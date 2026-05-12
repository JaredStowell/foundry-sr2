import { beforeEach, describe, expect, it, vi } from "vitest";

import { SR2Combat } from "../../../scripts/combat/sr2-combat.js";

function createItemCollection(items) {
  const storage = new Map(items.map((item) => [item.id, item]));
  const values = () => Array.from(storage.values());
  return {
    get(id) {
      return storage.get(id);
    },
    filter(predicate) {
      return values().filter(predicate);
    },
    find(predicate) {
      return values().find(predicate);
    },
    some(predicate) {
      return values().some(predicate);
    },
  };
}

function createUpdatableEntity(data) {
  return {
    ...data,
    update: vi.fn(async (updateData) => {
      for (const [path, value] of Object.entries(updateData || {})) {
        foundry.utils.setProperty(data, path, value);
      }
    }),
  };
}

function buildEvent({ itemId, rollType = "attack" }) {
  return {
    preventDefault: vi.fn(),
    currentTarget: {
      dataset: { itemId, rollType },
    },
  };
}

async function loadSheetClass() {
  vi.resetModules();
  globalThis.ActorSheet =
    globalThis.ActorSheet ||
    class ActorSheet {
      constructor(actor) {
        this.actor = actor;
      }

      static get defaultOptions() {
        return {};
      }
    };
  const module = await import("../../../scripts/actor/actor-sheet.js");
  return module.SR2ActorSheet;
}

describe("SR2ActorSheet action flows", () => {
  beforeEach(() => {
    ui.notifications.warn.mockClear();
    ui.notifications.error.mockClear();
    ui.notifications.info.mockClear();
    game.actors.__clear();
    game.combats.__clear();
    CONFIG.Combat.documentClass = SR2Combat;

    game.user = {
      id: "U1",
      targets: new Set(),
    };

    globalThis.ChatMessage = {
      create: vi.fn(async () => {}),
      getSpeaker: vi.fn(() => ({ alias: "Runner" })),
    };
    globalThis.Dialog = {
      confirm: vi.fn(async () => true),
    };

    globalThis.canvas = undefined;
  });

  it("applies full-auto ranged profile damage and ammo consumption", async () => {
    const SR2ActorSheet = await loadSheetClass();

    const linkedSkill = {
      id: "skill-1",
      type: "skill",
      name: "Assault Rifles",
      system: {
        baseSkill: "Assault Rifles",
        baseRating: 6,
        concentration: "",
        concentrationRating: 0,
        specialization: "",
        specializationRating: 0,
      },
    };
    const weapon = createUpdatableEntity({
      id: "weapon-1",
      type: "weapon",
      name: "AK-97",
      system: {
        weaponType: "ranged",
        damage: "8M",
        mode: "FA",
        recoil: 0,
        rangeType: "assault rifle",
        ammo: { current: 10, max: 30, type: "regular" },
        linkedSkill: { skillId: "skill-1", rollType: "base" },
      },
    });
    const actor = {
      id: "actor-1",
      name: "Shooter",
      system: {
        attributes: {
          strength: { value: 4 },
          magic: { value: 0 },
        },
        health: {
          physical: { value: 0, max: 10 },
          stun: { value: 0, max: 10 },
        },
      },
      items: createItemCollection([linkedSkill, weapon]),
      getActiveTokens: vi.fn(() => []),
    };
    const target = createUpdatableEntity({
      id: "target-1",
      name: "Guard",
      system: {
        attributes: { body: { value: 4 } },
        health: {
          physical: { value: 0, max: 10 },
          stun: { value: 0, max: 10 },
        },
        details: { traits: { dermalArmor: 0, reach: 0 } },
      },
      items: createItemCollection([]),
    });
    game.user.targets = new Set([{ actor: target, center: { x: 0, y: 0 } }]);

    const sheet = Object.create(SR2ActorSheet.prototype);
    sheet.actor = actor;
    sheet._showTargetNumberDialog = vi
      .fn()
      .mockResolvedValueOnce({
        rolled: true,
        rollResult: { successes: 4 },
      })
      .mockResolvedValueOnce({
        rolled: true,
        rollResult: { successes: 0, successesBySource: { combat: 0 } },
      });
    sheet._loadRangesData = vi.fn(async () => ({
      "assault rifle": { min: 0, short: 50, medium: 150, long: 350, extreme: 550 },
    }));

    await sheet._onWeaponAttack(buildEvent({ itemId: "weapon-1", rollType: "fullauto-6" }));

    expect(sheet._showTargetNumberDialog).toHaveBeenCalledTimes(2);
    const firstContext = sheet._showTargetNumberDialog.mock.calls[0][5];
    expect(firstContext.autoRangedModifiers.profile.modeUsed).toBe("FA");
    expect(firstContext.autoRangedModifiers.profile.ammoConsumed).toBe(6);
    expect(weapon.update).toHaveBeenCalledWith({ "system.ammo.current": 4 });
    expect(target.update).toHaveBeenCalledWith({ "system.health.physical.value": 10 });
  });

  it("routes sheet initiative rolls through the active Encounter", async () => {
    const SR2ActorSheet = await loadSheetClass();

    const token = { id: "token-initiative", actor: null, scene: { id: "scene-1" } };
    const actor = {
      id: "actor-initiative",
      name: "Runner",
      system: {
        initiative: { base: 8, current: 0 },
        attributes: {
          reaction: { value: 8 },
        },
      },
      getActiveTokens: vi.fn(() => [token]),
      _mockInitiativeTotal: 22,
    };
    token.actor = actor;
    game.actors.__set(actor);
    globalThis.canvas = { scene: { id: "scene-1" } };
    const combat = await SR2Combat.create({ scene: "scene-1", active: true });
    await combat.createEmbeddedDocuments("Combatant", [
      {
        tokenId: token.id,
        actorId: actor.id,
      },
    ]);

    const sheet = Object.create(SR2ActorSheet.prototype);
    sheet.actor = actor;

    await sheet._onInitiativeRoll({
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
    });

    expect(foundry.utils.getProperty(combat, "flags.shadowrun2e.sr2.currentPhase")).toBe(22);
    expect(combat.combatants[0].tokenId).toBe("token-initiative");
    expect(Dialog.confirm).not.toHaveBeenCalled();
  });

  it("asks before rolling initiative outside an Encounter", async () => {
    const SR2ActorSheet = await loadSheetClass();

    class FakeRoll {
      constructor(formula) {
        this.formula = formula;
      }

      async evaluate() {
        return this;
      }

      async toMessage(data) {
        ChatMessage.create(data);
      }
    }

    globalThis.Roll = FakeRoll;

    const actor = {
      id: "actor-no-encounter",
      name: "Runner",
      system: {
        initiative: { dice: 2, base: 8 },
        attributes: {
          reaction: { value: 8 },
        },
      },
      getActiveTokens: vi.fn(() => []),
    };

    const sheet = Object.create(SR2ActorSheet.prototype);
    sheet.actor = actor;

    await sheet._onInitiativeRoll({
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
    });

    expect(Dialog.confirm).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Roll Initiative?",
        content: expect.stringContaining("is not in an encounter"),
      }),
    );
    expect(ChatMessage.create).toHaveBeenCalledWith(
      expect.objectContaining({
        flavor: "Runner rolls Initiative (2d6+8)",
      }),
    );
    expect(game.combats.contents).toHaveLength(0);
    expect(ui.notifications.warn).not.toHaveBeenCalled();
  });

  it("resolves spell resistance, applies combat spell damage, and applies caster drain", async () => {
    const SR2ActorSheet = await loadSheetClass();

    const spell = {
      id: "spell-1",
      type: "spell",
      name: "Manabolt",
      system: {
        force: 4,
        class: "C",
        type: "M",
        damage: "M",
        drain: "[(F/2)+1]M",
      },
    };
    const caster = createUpdatableEntity({
      id: "caster-1",
      name: "Mage",
      system: {
        attributes: {
          magic: { value: 6, effective: 6 },
          willpower: { value: 5 },
        },
        health: {
          physical: { value: 0, max: 10 },
          stun: { value: 0, max: 10 },
        },
      },
      items: createItemCollection([spell]),
    });
    const target = createUpdatableEntity({
      id: "target-2",
      name: "Corp Sec",
      system: {
        attributes: {
          willpower: { value: 4 },
          body: { value: 4 },
        },
        health: {
          physical: { value: 0, max: 10 },
          stun: { value: 0, max: 10 },
        },
      },
      items: createItemCollection([]),
    });
    game.user.targets = new Set([{ actor: target }]);

    const sheet = Object.create(SR2ActorSheet.prototype);
    sheet.actor = caster;
    sheet._getHighestSorcerySkill = vi.fn(() => 6);
    sheet._showTargetNumberDialog = vi
      .fn()
      .mockResolvedValueOnce({
        rolled: true,
        rollResult: { successes: 5, isCriticalFailure: false },
        poolsUsed: [],
      })
      .mockResolvedValueOnce({
        rolled: true,
        rollResult: { successes: 2 },
      })
      .mockResolvedValueOnce({
        rolled: true,
        rollResult: { successes: 0 },
      });

    await sheet._onSpellCast(buildEvent({ itemId: "spell-1" }));

    expect(sheet._showTargetNumberDialog).toHaveBeenCalledTimes(3);
    const resistanceContext = sheet._showTargetNumberDialog.mock.calls[1][5];
    expect(resistanceContext.allowedPoolKeys).toEqual(["spell", "karma"]);
    expect(target.update).toHaveBeenCalledWith({ "system.health.physical.value": 10 });
    expect(caster.update).toHaveBeenCalledWith({ "system.health.stun.value": 3 });
    expect(ChatMessage.create).toHaveBeenCalled();
  });

  it("skips resistance rolls for spells whose explicit target metadata is not resisted", async () => {
    const SR2ActorSheet = await loadSheetClass();

    const spell = {
      id: "spell-detect-life",
      type: "spell",
      name: "Detect Life",
      system: {
        force: 4,
        class: "D",
        type: "M",
        target: "4",
        drain: "(F/2)L",
      },
    };
    const caster = createUpdatableEntity({
      id: "caster-detect-life",
      name: "Mage",
      system: {
        attributes: {
          magic: { value: 6, effective: 6 },
          willpower: { value: 5 },
        },
        health: {
          physical: { value: 0, max: 10 },
          stun: { value: 0, max: 10 },
        },
      },
      items: createItemCollection([spell]),
    });
    const target = createUpdatableEntity({
      id: "target-detect-life",
      name: "Guard",
      system: {
        attributes: {
          willpower: { value: 4 },
          body: { value: 4 },
        },
        health: {
          physical: { value: 0, max: 10 },
          stun: { value: 0, max: 10 },
        },
      },
      items: createItemCollection([]),
    });
    game.user.targets = new Set([{ actor: target }]);

    const sheet = Object.create(SR2ActorSheet.prototype);
    sheet.actor = caster;
    sheet._getHighestSorcerySkill = vi.fn(() => 6);
    sheet._showTargetNumberDialog = vi
      .fn()
      .mockResolvedValueOnce({
        rolled: true,
        rollResult: { successes: 3, isCriticalFailure: false },
        poolsUsed: [],
      })
      .mockResolvedValueOnce({
        rolled: true,
        rollResult: { successes: 2 },
      });

    await sheet._onSpellCast(buildEvent({ itemId: "spell-detect-life" }));

    expect(sheet._showTargetNumberDialog).toHaveBeenCalledTimes(2);
    expect(target.update).not.toHaveBeenCalled();
  });

  it("applies critical-misfire drain TN when no spell target is selected", async () => {
    const SR2ActorSheet = await loadSheetClass();

    const spell = {
      id: "spell-2",
      type: "spell",
      name: "Powerbolt",
      system: {
        force: 4,
        class: "C",
        type: "P",
        damage: "M",
        drain: "[(F/2)+1]M",
      },
    };
    const caster = createUpdatableEntity({
      id: "caster-2",
      name: "Mage 2",
      system: {
        attributes: {
          magic: { value: 6, effective: 6 },
          willpower: { value: 5 },
        },
        health: {
          physical: { value: 0, max: 10 },
          stun: { value: 0, max: 10 },
        },
      },
      items: createItemCollection([spell]),
    });
    game.user.targets = new Set();

    const sheet = Object.create(SR2ActorSheet.prototype);
    sheet.actor = caster;
    sheet._getHighestSorcerySkill = vi.fn(() => 6);
    sheet._showTargetNumberDialog = vi
      .fn()
      .mockResolvedValueOnce({
        rolled: true,
        rollResult: { successes: 1, isCriticalFailure: true },
        poolsUsed: [],
      })
      .mockResolvedValueOnce({
        rolled: true,
        rollResult: { successes: 0 },
      });

    await sheet._onSpellCast(buildEvent({ itemId: "spell-2" }));

    expect(sheet._showTargetNumberDialog).toHaveBeenCalledTimes(2);
    expect(sheet._showTargetNumberDialog.mock.calls[1][3]).toBe(5);
    expect(ChatMessage.create).not.toHaveBeenCalled();
  });

  it("includes power focus dice in magic attribute tests", async () => {
    const SR2ActorSheet = await loadSheetClass();

    const actor = {
      id: "actor-power-focus",
      name: "Mage",
      system: {
        magic: {
          awakened: true,
          physicalAdept: false,
        },
        attributes: {
          magic: { value: 6 },
        },
      },
      _sr2PowerFocusBonus: 2,
      _calculateAugmentationModifiers: vi.fn(() => ({})),
    };

    const sheet = Object.create(SR2ActorSheet.prototype);
    sheet.actor = actor;
    sheet._showTargetNumberDialog = vi.fn(async () => ({ rolled: true }));

    await sheet._onAttributeRoll({
      preventDefault: vi.fn(),
      currentTarget: { dataset: { attribute: "magic" } },
    });

    expect(sheet._showTargetNumberDialog).toHaveBeenCalledWith(
      8,
      "Magic Test [+2 Power Focus]",
      "attribute",
    );
  });

  it("adds matching specific and category focus dice to spellcasting and passes remaining dice to drain", async () => {
    const SR2ActorSheet = await loadSheetClass();

    const spell = {
      id: "spell-focus",
      type: "spell",
      name: "Manabolt",
      system: {
        force: 4,
        class: "C",
        type: "M",
        damage: "M",
        drain: "[(F/2)+1]M",
      },
    };
    const specificFocus = {
      id: "focus-specific",
      type: "gear",
      name: "Specific Spell Focus 2",
      system: {
        equipped: true,
        focus: {
          spellId: "spell-focus",
          spellClass: "",
          spiritType: "",
        },
      },
    };
    const categoryFocus = {
      id: "focus-category",
      type: "gear",
      name: "Spell Category Focus 3",
      system: {
        equipped: true,
        focus: {
          spellId: "",
          spellClass: "C",
          spiritType: "",
        },
      },
    };
    const caster = createUpdatableEntity({
      id: "caster-focus",
      name: "Mage",
      system: {
        attributes: {
          magic: { value: 6, effective: 6 },
          willpower: { value: 5 },
        },
        health: {
          physical: { value: 0, max: 10 },
          stun: { value: 0, max: 10 },
        },
      },
      items: createItemCollection([spell, specificFocus, categoryFocus]),
    });
    game.user.targets = new Set();

    const sheet = Object.create(SR2ActorSheet.prototype);
    sheet.actor = caster;
    sheet._getHighestSorcerySkill = vi.fn(() => 6);
    sheet._showTargetNumberDialog = vi
      .fn()
      .mockResolvedValueOnce({
        rolled: true,
        rollResult: { successes: 3, isCriticalFailure: false },
        poolsUsed: [
          {
            pool: { key: "focus-specific-focus-specific", isActorPool: false },
            dice: 1,
          },
          {
            pool: { key: "focus-category-focus-category", isActorPool: false },
            dice: 2,
          },
        ],
      })
      .mockResolvedValueOnce({
        rolled: true,
        rollResult: { successes: 1 },
      });

    await sheet._onSpellCast(buildEvent({ itemId: "spell-focus" }));

    expect(sheet._showTargetNumberDialog).toHaveBeenCalledTimes(2);
    expect(sheet._showTargetNumberDialog.mock.calls[0][5].additionalPools).toEqual([
      {
        key: "focus-specific-focus-specific",
        name: "Specific Spell Focus 2 (Manabolt)",
        current: 2,
        max: 2,
        isActorPool: false,
      },
      {
        key: "focus-category-focus-category",
        name: "Spell Category Focus 3 (Combat)",
        current: 3,
        max: 3,
        isActorPool: false,
      },
    ]);
    expect(sheet._showTargetNumberDialog.mock.calls[1][5].additionalPools).toEqual([
      {
        key: "focus-specific-focus-specific",
        name: "Specific Spell Focus 2 (Manabolt)",
        current: 1,
        max: 2,
        isActorPool: false,
      },
      {
        key: "focus-category-focus-category",
        name: "Spell Category Focus 3 (Combat)",
        current: 1,
        max: 3,
        isActorPool: false,
      },
    ]);
  });

  it("adds matching spirit focus dice to conjuring and carries unused dice into drain resistance", async () => {
    const SR2ActorSheet = await loadSheetClass();

    const spiritFocus = {
      id: "focus-spirit",
      type: "gear",
      name: "Spirit Focus 2",
      system: {
        equipped: true,
        focus: {
          spiritType: "Water Elemental",
        },
      },
    };
    const actor = {
      id: "actor-conjurer",
      name: "Conjurer",
      system: {
        attributes: {
          charisma: { value: 5 },
        },
      },
      items: createItemCollection([spiritFocus]),
    };

    const sheet = Object.create(SR2ActorSheet.prototype);
    sheet.actor = actor;
    sheet._promptConjuringDetails = vi.fn(async () => ({
      ok: true,
      spiritType: "Water Elemental",
      force: 4,
    }));
    sheet._showTargetNumberDialog = vi
      .fn()
      .mockResolvedValueOnce({
        rolled: true,
        poolsUsed: [
          {
            pool: { key: "focus-spirit-focus-spirit", isActorPool: false },
            dice: 1,
          },
        ],
      })
      .mockResolvedValueOnce({
        rolled: true,
        rollResult: { successes: 2 },
      });

    await sheet._onConjuringRoll(6, "Conjuring");

    expect(sheet._showTargetNumberDialog).toHaveBeenCalledTimes(2);
    expect(sheet._showTargetNumberDialog.mock.calls[0][5].additionalPools).toEqual([
      {
        key: "focus-spirit-focus-spirit",
        name: "Spirit Focus 2 (Water Elemental)",
        current: 2,
        max: 2,
        isActorPool: false,
      },
    ]);
    expect(sheet._showTargetNumberDialog.mock.calls[1][5].additionalPools).toEqual([
      {
        key: "focus-spirit-focus-spirit",
        name: "Spirit Focus 2 (Water Elemental)",
        current: 1,
        max: 2,
        isActorPool: false,
      },
    ]);
  });

  it("toggles spell lock state and reuses spell-lock sync to create and remove invisibility effects", async () => {
    const SR2ActorSheet = await loadSheetClass();

    const spell = {
      id: "spell-lock-1",
      type: "spell",
      name: "Improved Invisibility",
      system: {
        spellLock: {
          assigned: true,
          enabled: false,
        },
      },
      update: vi.fn(async (updates = {}) => {
        for (const [path, value] of Object.entries(updates)) {
          foundry.utils.setProperty(spell, path, value);
        }
        return spell;
      }),
    };

    const effects = [];
    const actor = {
      id: "actor-spell-lock",
      name: "Mage",
      items: createItemCollection([spell]),
      effects,
      createEmbeddedDocuments: vi.fn(async (type, docs) => {
        if (type !== "ActiveEffect") return [];
        const doc = docs[0];
        const createdEffect = createUpdatableEntity({
          ...doc,
          getFlag: (scope, key) => doc.flags?.[scope]?.[key],
        });
        createdEffect.delete = vi.fn(async () => {
          const index = effects.indexOf(createdEffect);
          if (index >= 0) effects.splice(index, 1);
        });
        effects.push(createdEffect);
        return [createdEffect];
      }),
    };

    const sheet = Object.create(SR2ActorSheet.prototype);
    sheet.actor = actor;
    sheet.rendered = true;
    sheet.render = vi.fn();

    await sheet._onSpellLockToggle({
      preventDefault: vi.fn(),
      currentTarget: { dataset: { itemId: "spell-lock-1" } },
    });

    expect(spell.update).toHaveBeenCalledWith({ "system.spellLock.enabled": true });
    expect(actor.createEmbeddedDocuments).toHaveBeenCalledWith("ActiveEffect", [
      expect.objectContaining({
        name: "Sustained Spell: Invisibility",
        system: { changes: [] },
        flags: { shadowrun2e: { spellLockInvisibilityEffect: true } },
      }),
    ]);
    expect(actor.createEmbeddedDocuments.mock.calls[0][1][0]).not.toHaveProperty("changes");
    expect(sheet.render).toHaveBeenCalledWith(false);

    const effect = effects[0];
    effect.delete = vi.fn(async () => {
      const index = effects.indexOf(effect);
      if (index >= 0) effects.splice(index, 1);
    });

    await sheet._onSpellLockToggle({
      preventDefault: vi.fn(),
      currentTarget: { dataset: { itemId: "spell-lock-1" } },
    });

    expect(spell.update).toHaveBeenCalledWith({ "system.spellLock.enabled": false });
    expect(effect.delete).toHaveBeenCalledTimes(1);
  });
});
