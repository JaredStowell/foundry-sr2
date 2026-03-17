import { beforeEach, describe, expect, it, vi } from "vitest";

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
