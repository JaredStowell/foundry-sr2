import { beforeEach, describe, expect, it, vi } from "vitest";

import { sr2ApplyCharacterPrioritiesOnCreate } from "../../scripts/hooks/priority-bootstrap.js";
import { registerCreationRuleHooks } from "../../scripts/hooks/creation-rules.js";

function runAll(callbacks, args) {
  const results = [];
  for (const callback of callbacks) {
    results.push(callback(...args));
  }
  return results;
}

function createCharacterActor(overrides = {}) {
  const flags = {
    shadowrun2e: {},
  };

  const actor = {
    id: "character-1",
    type: "character",
    items: [],
    system: {
      details: {
        metatype: "human",
      },
      priorities: {
        metatype: "A",
        attributes: "B",
        skills: "C",
        resources: "D",
        magic: "A",
      },
      attributes: {
        magic: { value: 0 },
        charisma: { value: 3 },
      },
      magic: {
        awakened: false,
        physicalAdept: false,
      },
      resources: {
        lifestyle: "street",
      },
      creation: {
        attributePoints: 0,
        skillPoints: 0,
        forcePoints: 0,
        startingNuyen: 0,
        resourcesFinalized: false,
        extras: {
          contacts: 0,
          buddy: 0,
          gang: 0,
          followers: 0,
        },
      },
    },
    getFlag: vi.fn((scope, key) => flags?.[scope]?.[key]),
    setFlag: vi.fn(async (scope, key, value) => {
      if (!flags[scope]) flags[scope] = {};
      flags[scope][key] = value;
    }),
    update: vi.fn(async (updates) => {
      for (const [path, value] of Object.entries(updates || {})) {
        foundry.utils.setProperty(actor, path, value);
      }
    }),
    ...overrides,
  };

  return actor;
}

beforeEach(() => {
  Hooks.__reset();
  Hooks.on.mockClear();
  ui.notifications.warn.mockClear();
  ui.notifications.error.mockClear();
  ui.notifications.info.mockClear();

  delete globalThis.__sr2CreationRuleHooksInstalled;

  game.user = {
    id: "U1",
    isGM: false,
  };
});

describe("character creation e2e flow (vitest integration)", () => {
  it("best case: priorities apply and legal item/spell additions pass validation", async () => {
    registerCreationRuleHooks();

    const actor = createCharacterActor();
    const syncFreeLanguageSkills = vi.fn().mockResolvedValue(undefined);

    const applied = await sr2ApplyCharacterPrioritiesOnCreate(actor, {
      userId: "U1",
      currentUserId: "U1",
      getAllowedMetatypesForPriority: () => ["human", "elf", "dwarf", "ork", "troll"],
      syncFreeLanguageSkills,
    });

    expect(applied).toBe(true);
    expect(actor.system.creation.attributePoints).toBe(24);
    expect(actor.system.creation.skillPoints).toBe(24);
    expect(actor.system.creation.startingNuyen).toBe(5000);
    expect(actor.system.creation.forcePoints).toBe(15);
    expect(actor.system.magic.awakened).toBe(true);

    const preCreateItemHooks = Hooks.__get("preCreateItem");

    const legalGearResults = runAll(preCreateItemHooks, [
      { type: "gear", parent: actor, name: "Knife" },
      { type: "gear", name: "Knife", system: { price: 500, quantity: 1 } },
      {},
      "U1",
    ]);
    expect(legalGearResults.some((result) => result === false)).toBe(false);

    const legalSpellResults = runAll(preCreateItemHooks, [
      { type: "spell", parent: actor, name: "Heal" },
      { type: "spell", name: "Heal", system: { force: 4 } },
      {},
      "U1",
    ]);
    expect(legalSpellResults.some((result) => result === false)).toBe(false);

    expect(syncFreeLanguageSkills).toHaveBeenCalledWith(actor);
  });

  it("worst case: over-budget gear and over-force spells are blocked", async () => {
    registerCreationRuleHooks();

    const actor = createCharacterActor({
      items: [{ type: "spell", system: { force: 14 } }],
    });

    await sr2ApplyCharacterPrioritiesOnCreate(actor, {
      userId: "U1",
      currentUserId: "U1",
      getAllowedMetatypesForPriority: () => ["human", "elf", "dwarf", "ork", "troll"],
      syncFreeLanguageSkills: vi.fn().mockResolvedValue(undefined),
    });

    const preCreateItemHooks = Hooks.__get("preCreateItem");

    const expensiveGearResults = runAll(preCreateItemHooks, [
      { type: "gear", parent: actor, name: "Luxury Item" },
      { type: "gear", name: "Luxury Item", system: { price: 6000, quantity: 1 } },
      {},
      "U1",
    ]);
    expect(expensiveGearResults.some((result) => result === false)).toBe(true);
    expect(ui.notifications.error).toHaveBeenCalledWith(
      "Not enough creation Nuyen remaining for that item.",
    );

    const invalidForceSpellResults = runAll(preCreateItemHooks, [
      { type: "spell", parent: actor, name: "Manabolt" },
      { type: "spell", name: "Manabolt", system: { force: 10 } },
      {},
      "U1",
    ]);
    expect(invalidForceSpellResults.some((result) => result === false)).toBe(true);
    expect(ui.notifications.error).toHaveBeenCalledWith(
      "In creation mode, spell Force must be between 1 and 6.",
    );

    const overForceBudgetResults = runAll(preCreateItemHooks, [
      { type: "spell", parent: actor, name: "Powerbolt" },
      { type: "spell", name: "Powerbolt", system: { force: 2 } },
      {},
      "U1",
    ]);
    expect(overForceBudgetResults.some((result) => result === false)).toBe(true);
    expect(ui.notifications.error).toHaveBeenCalledWith(
      "Not enough Force Points remaining. Reduce other spells/foci first.",
    );
  });
});
