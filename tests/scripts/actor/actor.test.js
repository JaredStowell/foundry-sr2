import { beforeEach, describe, expect, it, vi } from "vitest";
import { sr2GetInitiativeTerms } from "../../../scripts/actions/initiative.js";

async function loadActorClass() {
  vi.resetModules();
  globalThis.Actor =
    globalThis.Actor ||
    class Actor {
      prepareData() {}
      prepareBaseData() {}
      prepareDerivedData() {}
    };
  return (await import("../../../scripts/actor/actor.js")).SR2Actor;
}

function createItemsCollection(items = []) {
  const values = () => items;
  return {
    filter(predicate) {
      return values().filter(predicate);
    },
    find(predicate) {
      return values().find(predicate);
    },
    some(predicate) {
      return values().some(predicate);
    },
    map(callback) {
      return values().map(callback);
    },
    [Symbol.iterator]() {
      return values()[Symbol.iterator]();
    },
  };
}

function createCharacterActor(SR2Actor, { items = [], system = {} } = {}) {
  const actor = Object.create(SR2Actor.prototype);
  actor.type = "character";
  actor.items = createItemsCollection(items);
  actor.system = foundry.utils.mergeObject(
    {
      attributes: {
        body: { value: 3 },
        quickness: { value: 4 },
        strength: { value: 3 },
        charisma: { value: 3 },
        intelligence: { value: 5 },
        willpower: { value: 4 },
        reaction: { value: 0 },
        essence: { value: 6, max: 6 },
        magic: { value: 0, effective: 0 },
      },
      magic: {
        awakened: false,
        physicalAdept: false,
        tradition: "",
      },
      initiative: {
        base: 0,
        dice: 1,
        current: 0,
      },
      pools: {
        combat: { current: 0, max: 0 },
        spell: { current: 0, max: 0 },
        hacking: { current: 0, max: 0 },
        control: { current: 0, max: 0 },
        task: { current: 0, max: 0 },
        astral: { current: 0, max: 0 },
        karma: { current: 0, total: 0 },
      },
      health: {
        physical: { value: 0, max: 10 },
        stun: { value: 0, max: 10 },
      },
    },
    foundry.utils.deepClone(system),
  );
  return actor;
}

describe("SR2Actor derived augmentation handling", () => {
  beforeEach(() => {
    game.settings = {
      get: vi.fn(() => false),
    };
  });

  it("computes Essence loss from installed cyberware in Foundry-style item collections", async () => {
    const SR2Actor = await loadActorClass();
    const actor = createCharacterActor(SR2Actor, {
      items: [
        { type: "cyberware", name: "Datajack", system: { installed: true, essence: 1.5 } },
        { type: "cyberware", name: "Smartlink II", system: { installed: false, essence: 2 } },
      ],
    });

    actor._prepareCharacterData(actor);

    expect(actor.system.attributes.essence.value).toBe(4.5);
  });

  it("applies cyberware reflex bonuses once even when mods also encode them", async () => {
    const SR2Actor = await loadActorClass();
    const actor = createCharacterActor(SR2Actor, {
      items: [
        {
          type: "cyberware",
          name: "Wired Reflexes 2",
          system: {
            installed: true,
            essence: 3,
            reactionBonus: 4,
            initiativeDice: 2,
            mods: "+4RCT,+2INI",
          },
        },
        {
          type: "bioware",
          name: "Cerebral Booster 2",
          system: {
            installed: true,
            bioIndex: 0.8,
            mods: "+2INT",
          },
        },
      ],
      system: {
        magic: {
          awakened: true,
          physicalAdept: false,
          tradition: "hermetic",
        },
        attributes: {
          magic: { value: 6, effective: 0 },
        },
      },
    });

    actor._prepareCharacterData(actor);

    expect(actor._sr2AugmentationModifiers).toMatchObject({
      INT: 2,
      RCT: 4,
      INI: 2,
    });
    expect(actor.system.attributes.reaction.value).toBe(9);
    expect(actor.system.initiative.base).toBe(9);
    expect(actor.system.initiative.dice).toBe(3);
    expect(actor.system.attributes.magic.value).toBe(3);
  });

  it.each([
    {},
    { reactionBonus: 0, initiativeDice: 0 },
    { reactionBonus: "", initiativeDice: "invalid" },
  ])("retains reflex bonuses on legacy cyberware with numeric fields %j", async (fields) => {
    const SR2Actor = await loadActorClass();
    const actor = createCharacterActor(SR2Actor, {
      items: [
        {
          type: "cyberware",
          name: "Wired Reflexes 2",
          system: { installed: true, mods: "+4RCT,+2INI", ...fields },
        },
      ],
    });

    actor.prepareDerivedData();

    expect(actor.system.initiative).toMatchObject({ base: 8, dice: 3 });
    expect(actor.getRollData().actor.initiative).toMatchObject({ base: 8, dice: 3 });
    expect(sr2GetInitiativeTerms(actor).compactFormula).toBe("3d6+8");
    actor.prepareDerivedData();
    expect(actor.system.initiative).toMatchObject({ base: 8, dice: 3 });
  });

  it("prefers edited numeric reflex bonuses and excludes uninstalled cyberware", async () => {
    const SR2Actor = await loadActorClass();
    const actor = createCharacterActor(SR2Actor, {
      items: [
        {
          type: "cyberware",
          name: "Wired Reflexes 2",
          system: { installed: true, mods: "+4RCT,+2INI", reactionBonus: 2, initiativeDice: 1 },
        },
        {
          type: "cyberware",
          name: "Wired Reflexes 3",
          system: { installed: false, mods: "+6RCT,+3INI" },
        },
      ],
    });

    actor.prepareDerivedData();

    expect(actor.system.initiative).toMatchObject({ base: 6, dice: 2 });
  });

  it("calculates Reaction numerically for imported string attributes", async () => {
    const SR2Actor = await loadActorClass();
    const actor = createCharacterActor(SR2Actor, {
      system: { attributes: { quickness: { value: "4" }, intelligence: { value: "5" } } },
    });

    actor.prepareDerivedData();

    expect(actor.system.initiative).toMatchObject({ base: 4, dice: 1 });
  });

  it.each([
    { dice: 12, base: 4, expectedDice: 10, expectedBase: 4 },
    { dice: 2.7, base: -4, expectedDice: 2, expectedBase: 0 },
    { dice: "bad", base: "bad", expectedDice: 1, expectedBase: 6 },
  ])(
    "uses identical roll terms in chat and core Combat for $dice dice and base $base",
    async ({ dice, base, expectedDice, expectedBase }) => {
      const SR2Actor = await loadActorClass();
      const actor = createCharacterActor(SR2Actor, {
        system: { initiative: { dice, base }, attributes: { reaction: { value: 6 } } },
      });

      expect(sr2GetInitiativeTerms(actor)).toMatchObject({
        dice: expectedDice,
        base: expectedBase,
      });
      expect(actor.getRollData().actor.initiative).toMatchObject({
        dice: expectedDice,
        base: expectedBase,
      });
      expect(actor.system.initiative).toMatchObject({ dice, base });
    },
  );

  it.each([
    { type: "spirit", spiritForm: "manifest", expectedBase: 16 },
    { type: "spirit", spiritForm: "astral", expectedBase: 26 },
    { type: "critter", spiritForm: "manifest", expectedBase: 16 },
    { type: "ic", spiritForm: "astral", expectedBase: 6 },
  ])(
    "keeps $type $spiritForm initiative identical across preparation, chat, and core Combat",
    async ({ type, spiritForm, expectedBase }) => {
      const SR2Actor = await loadActorClass();
      const actor = createCharacterActor(SR2Actor, {
        system: {
          spiritForm,
          initiative: { base: 0, dice: 5 },
          attributes: { reaction: { value: 6 } },
        },
      });
      actor.type = type;

      expect(sr2GetInitiativeTerms(actor)).toMatchObject({ dice: 1, base: expectedBase });
      actor.prepareDerivedData();
      expect(actor.system.initiative).toMatchObject({ dice: 1, base: expectedBase });
      expect(actor.getRollData().actor.initiative).toMatchObject({ dice: 1, base: expectedBase });
    },
  );

  it.each([
    { metatype: "human", base: 0, earned: 10, total: 1, expected: 2 },
    { metatype: "human", base: undefined, earned: 30, total: 4, expected: 4 },
    { metatype: "elf", base: 0, earned: 10, total: 1, expected: 3 },
  ])(
    "restores the chargen Karma Pool for $metatype with base $base",
    async ({ metatype, base, earned, total, expected }) => {
      const SR2Actor = await loadActorClass();
      const actor = createCharacterActor(SR2Actor, {
        system: {
          details: { metatype },
          karma: { earned, spent: 0 },
          pools: { karma: { base, total, current: 1 } },
        },
      });
      actor.prepareDerivedData();
      actor.prepareDerivedData();
      expect(actor.system.pools.karma.total).toBe(expected);
      expect(actor.system.pools.karma.current).toBe(1);
    },
  );

  it("gives Anna 3d6+10 from Wired Reflexes without adding physical reflexes to Hacking Pool", async () => {
    const SR2Actor = await loadActorClass();
    const actor = createCharacterActor(SR2Actor, {
      system: { attributes: { quickness: { value: 6 }, intelligence: { value: 6 } } },
      items: [
        {
          type: "cyberware",
          name: "Wired Reflexes 2",
          system: { installed: true, reactionBonus: 0, initiativeDice: 0, mods: "+4RCT,+2INI" },
        },
        { type: "skill", name: "Computer", system: { baseSkill: "Computer", baseRating: 4 } },
      ],
    });
    actor.prepareDerivedData();
    expect(sr2GetInitiativeTerms(actor).compactFormula).toBe("3d6+10");
    expect(actor.getRollData().actor.initiative).toMatchObject({ dice: 3, base: 10 });
    expect(actor.system.pools.hacking.max).toBe(10);
  });

  it("keeps earned Karma Pool totals stable without refreshing spent dice during preparation", async () => {
    const SR2Actor = await loadActorClass();
    const actor = createCharacterActor(SR2Actor, {
      system: {
        karma: { earned: 30, spent: 12 },
        pools: { karma: { base: 2, total: 5, current: 1 } },
      },
    });

    actor.prepareDerivedData();
    actor.prepareDerivedData();

    expect(actor.system.pools.karma).toEqual({ base: 2, total: 5, current: 1 });
    expect(actor.system.karma).toEqual({ earned: 30, spent: 12 });
  });

  it("keeps bioware and adept-power mods additive for non-reflex stats", async () => {
    const SR2Actor = await loadActorClass();
    const actor = createCharacterActor(SR2Actor, {
      items: [
        {
          type: "bioware",
          name: "Adrenal Pump 1",
          system: {
            installed: true,
            bioIndex: 1.25,
            mods: "+1QCK,+1STR,+1WIL,+2RCT",
          },
        },
        {
          type: "adeptpower",
          name: "Improved Body",
          system: {
            hasLevels: true,
            currentLevel: 2,
            mods: "+1BOD",
          },
        },
      ],
    });

    actor._prepareCharacterData(actor);

    expect(actor._sr2AugmentationModifiers).toMatchObject({
      BOD: 2,
      QCK: 1,
      STR: 1,
      WIL: 1,
      RCT: 2,
    });
    expect(actor.system.attributes.reaction.value).toBe(7);
  });

  it("applies equipped power focus bonuses to effective magic and spell pool, including imported names", async () => {
    const SR2Actor = await loadActorClass();
    const actor = createCharacterActor(SR2Actor, {
      items: [
        {
          type: "skill",
          name: "Sorcery",
          system: {
            baseSkill: "Sorcery",
            baseRating: 5,
            concentrationRating: 0,
            specializationRating: 0,
          },
        },
        {
          type: "gear",
          name: "Power Focus-2",
          system: {
            equipped: true,
            category: "Magical Equipment",
            bondCost: 10,
          },
        },
      ],
      system: {
        magic: {
          awakened: true,
          physicalAdept: false,
          tradition: "hermetic",
        },
        attributes: {
          magic: { value: 6, effective: 0 },
          essence: { value: 6, max: 6 },
        },
      },
    });

    actor._prepareCharacterData(actor);

    expect(actor._sr2PowerFocusBonus).toBe(2);
    expect(actor.system.attributes.magic.value).toBe(6);
    expect(actor.system.attributes.magic.effective).toBe(8);
    expect(actor.system.pools.spell.max).toBe(7);
  });

  it("applies enabled spell-lock augmentation modifiers during derived initiative prep", async () => {
    const SR2Actor = await loadActorClass();
    const actor = createCharacterActor(SR2Actor, {
      items: [
        {
          type: "spell",
          name: "Increase Reflexes +2 dice",
          system: {
            spellLock: { enabled: true },
          },
        },
      ],
      system: {
        magic: {
          awakened: true,
          physicalAdept: false,
          tradition: "hermetic",
        },
        attributes: {
          quickness: { value: 4 },
          intelligence: { value: 4 },
          reaction: { value: 0 },
          magic: { value: 6, effective: 0 },
        },
      },
    });

    actor._prepareCharacterData(actor);

    expect(actor._sr2AugmentationModifiers.INI).toBe(2);
    expect(actor.system.initiative.base).toBe(4);
    expect(actor.system.initiative.dice).toBe(3);
  });
});
