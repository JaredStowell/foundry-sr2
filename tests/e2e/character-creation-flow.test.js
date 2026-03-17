import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  sr2GetAllowedMetatypesForPriority,
  sr2SyncFreeLanguageSkills,
} from "../../scripts/actor-creation.js";
import { sr2ApplyCharacterPrioritiesOnCreate } from "../../scripts/hooks/priority-bootstrap.js";
import { registerCreationRuleHooks } from "../../scripts/hooks/creation-rules.js";
import {
  sr2ComputeAttributePointsSpent,
  sr2ComputeCreationNuyenBudgetBreakdown,
  sr2ComputeForcePointsSpent,
  sr2ComputeSkillPointsSpent,
} from "../../scripts/sr2-rules.js";

function runAll(callbacks, args) {
  const results = [];
  for (const callback of callbacks) {
    results.push(callback(...args));
  }
  return results;
}

let ownedItemId = 1;

function createItemCollection(items = []) {
  const storage = new Map(items.map((item) => [item.id, item]));

  return {
    get(id) {
      return storage.get(id);
    },
    add(item) {
      storage.set(item.id, item);
      return item;
    },
    delete(id) {
      storage.delete(id);
    },
    filter(predicate) {
      return Array.from(storage.values()).filter(predicate);
    },
    find(predicate) {
      return Array.from(storage.values()).find(predicate);
    },
    some(predicate) {
      return Array.from(storage.values()).some(predicate);
    },
    reduce(callback, initialValue) {
      return Array.from(storage.values()).reduce(callback, initialValue);
    },
    map(callback) {
      return Array.from(storage.values()).map(callback);
    },
    get length() {
      return storage.size;
    },
    [Symbol.iterator]() {
      return storage.values();
    },
  };
}

async function loadCharacterClasses() {
  vi.resetModules();
  globalThis.Actor =
    globalThis.Actor ||
    class Actor {
      prepareData() {}
      prepareBaseData() {}
      prepareDerivedData() {}
    };
  globalThis.ActorSheet =
    globalThis.ActorSheet ||
    class ActorSheet {
      constructor(actor) {
        this.actor = actor;
        this.object = actor;
      }

      static get defaultOptions() {
        return {};
      }
    };

  const [{ SR2Actor }, { SR2ActorSheet }] = await Promise.all([
    import("../../scripts/actor/actor.js"),
    import("../../scripts/actor/actor-sheet.js"),
  ]);
  return { SR2Actor, SR2ActorSheet };
}

async function loadItemBrowserClass() {
  vi.resetModules();
  return (await import("../../scripts/item-browser.js")).SR2ItemBrowser;
}

function createOwnedItem(actor, collection, data) {
  const itemId = data.id ?? data._id ?? `item-${ownedItemId++}`;
  const item = {
    id: itemId,
    _id: itemId,
    name: data.name ?? data.system?.baseSkill ?? data.type ?? "Item",
    type: data.type,
    img: data.img ?? "item.png",
    parent: actor,
    system: foundry.utils.deepClone(data.system ?? {}),
    update: vi.fn(async (updates = {}) => {
      for (const [path, value] of Object.entries(updates)) {
        if (path === "name") {
          item.name = value;
          continue;
        }
        foundry.utils.setProperty(item, path, value);
      }
      actor._prepareCharacterData?.(actor);
      return item;
    }),
    delete: vi.fn(async () => {
      collection.delete(item.id);
      actor._prepareCharacterData?.(actor);
      return true;
    }),
  };

  collection.add(item);
  return item;
}

function createCharacterActorDocument(SR2Actor, overrides = {}) {
  const flags = {
    shadowrun2e: {},
  };
  const items = createItemCollection();

  const actor = Object.create(SR2Actor.prototype);
  actor.id = overrides.id ?? "character-1";
  actor.name = overrides.name ?? "New Runner";
  actor.type = "character";
  actor.sort = 1;
  actor.items = items;
  actor.flags = flags;
  actor.system = foundry.utils.mergeObject(
    {
      details: {
        metatype: "human",
        nativeLanguage: "English",
        dialectLanguage: "City Speak",
        traits: {
          dermalArmor: 0,
          reach: 0,
        },
      },
      priorities: {
        metatype: "E",
        attributes: "D",
        skills: "B",
        resources: "C",
        magic: "A",
      },
      attributes: {
        body: { value: 0 },
        quickness: { value: 0 },
        strength: { value: 0 },
        charisma: { value: 0 },
        intelligence: { value: 0 },
        willpower: { value: 0 },
        reaction: { value: 0 },
        magic: { value: 0, effective: 0 },
        essence: { value: 6, max: 6 },
      },
      magic: {
        awakened: false,
        physicalAdept: false,
        tradition: "hermetic",
      },
      initiative: {
        base: 0,
        dice: 1,
        current: 0,
      },
      health: {
        physical: { value: 0, max: 10 },
        stun: { value: 0, max: 10 },
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
      resources: {
        nuyen: 0,
        lifestyle: "street",
        lifestyles: [{ type: "street", months: 1 }],
      },
      creation: {
        attributePoints: 0,
        skillPoints: 0,
        forcePoints: 0,
        startingNuyen: 0,
        lifestyleMonths: 1,
        extras: {
          contacts: 0,
          buddy: 0,
          gang: 0,
          followers: 0,
        },
      },
    },
    foundry.utils.deepClone(overrides.system ?? {}),
  );

  actor.getFlag = vi.fn((scope, key) => actor.flags?.[scope]?.[key]);
  actor.setFlag = vi.fn(async (scope, key, value) => {
    if (!actor.flags[scope]) actor.flags[scope] = {};
    actor.flags[scope][key] = value;
  });
  actor.update = vi.fn(async (updates = {}) => {
    for (const [path, value] of Object.entries(updates)) {
      foundry.utils.setProperty(actor, path, value);
    }
    actor._prepareCharacterData?.(actor);
    return actor;
  });
  actor.createEmbeddedDocuments = vi.fn(async (type, documents = []) => {
    if (type !== "Item") return [];
    const created = documents.map((data) => createOwnedItem(actor, items, data));
    actor._prepareCharacterData?.(actor);
    return created;
  });
  actor.updateEmbeddedDocuments = vi.fn(async (type, updates = []) => {
    if (type !== "Item") return [];
    const changed = [];
    for (const update of updates) {
      const target = items.get(update._id ?? update.id);
      if (!target) continue;
      await target.update(update);
      changed.push(target);
    }
    actor._prepareCharacterData?.(actor);
    return changed;
  });
  actor.getActiveTokens = vi.fn(() => []);

  actor._prepareCharacterData(actor);
  return actor;
}

function createSheet(SR2ActorSheet, actor) {
  const sheet = Object.create(SR2ActorSheet.prototype);
  sheet.actor = actor;
  sheet.object = actor;
  sheet.render = vi.fn();
  return sheet;
}

function buildSkillEvent(itemId, value) {
  const element = {
    value: String(value),
    dataset: { skillId: itemId },
    style: {},
    closest: () => ({ dataset: { itemId } }),
  };

  return {
    preventDefault: vi.fn(),
    stopPropagation: vi.fn(),
    currentTarget: element,
  };
}

async function attemptCreateItem(actor, data, userId = "U1") {
  const pending = {
    type: data.type,
    name: data.name,
    parent: actor,
  };
  const results = runAll(Hooks.__get("preCreateItem"), [pending, data, {}, userId]);
  if (results.some((result) => result === false)) return null;
  const [created] = await actor.createEmbeddedDocuments("Item", [data]);
  return created;
}

describe("character creation e2e flow (vitest integration)", () => {
  beforeEach(() => {
    Hooks.__reset();
    Hooks.on.mockClear();

    ui.notifications.warn.mockClear();
    ui.notifications.error.mockClear();
    ui.notifications.info.mockClear();

    game.user = {
      id: "U1",
      isGM: false,
      targets: new Set(),
    };
    game.actors.__clear();
    game.settings = {
      get: vi.fn(() => false),
    };

    globalThis.ChatMessage = {
      create: vi.fn(async () => {}),
      getSpeaker: vi.fn(() => ({ alias: "Runner" })),
    };
    globalThis.Dialog = {
      confirm: vi.fn(async () => true),
    };
    globalThis.Roll = class FakeRoll {
      constructor(formula) {
        this.formula = formula;
        this.total = 10;
      }

      async evaluate() {
        return this;
      }
    };

    delete globalThis.__sr2CreationRuleHooksInstalled;
  });

  it("supports a full ABCDE creation flow through priorities, sheet edits, purchases, and augmentations without chargen finalization", async () => {
    const { SR2Actor, SR2ActorSheet } = await loadCharacterClasses();
    registerCreationRuleHooks();

    const actor = createCharacterActorDocument(SR2Actor, {
      system: {
        priorities: {
          metatype: "E",
          attributes: "D",
          skills: "B",
          resources: "C",
          magic: "A",
        },
      },
    });
    const sheet = createSheet(SR2ActorSheet, actor);

    const applied = await sr2ApplyCharacterPrioritiesOnCreate(actor, {
      userId: "U1",
      currentUserId: "U1",
      getAllowedMetatypesForPriority: sr2GetAllowedMetatypesForPriority,
      syncFreeLanguageSkills: sr2SyncFreeLanguageSkills,
    });

    expect(applied).toBe(true);
    expect(actor.system.creation.attributePoints).toBe(17);
    expect(actor.system.creation.skillPoints).toBe(30);
    expect(actor.system.creation.startingNuyen).toBe(90000);
    expect(actor.system.creation.forcePoints).toBe(25);
    expect(actor.system.magic.awakened).toBe(true);
    expect(actor.items.filter((item) => item.system?.isFree)).toHaveLength(2);

    await sheet._updateObject(
      { currentTarget: { name: "system.attributes.willpower.value" } },
      {
        "system.attributes.body.value": 3,
        "system.attributes.quickness.value": 3,
        "system.attributes.strength.value": 2,
        "system.attributes.charisma.value": 2,
        "system.attributes.intelligence.value": 4,
        "system.attributes.willpower.value": 3,
        "system.resources.lifestyles.0.type": "low",
        "system.resources.lifestyles.0.months": 2,
      },
    );

    expect(
      sr2ComputeAttributePointsSpent(actor.system.attributes, actor.system.details.metatype),
    ).toBe(17);
    expect(actor.system.resources.lifestyles).toEqual([{ type: "low", months: 2 }]);

    const sorcery = await attemptCreateItem(actor, {
      name: "Sorcery",
      type: "skill",
      system: {
        baseSkill: "Sorcery",
        allocatedRating: 1,
        baseRating: 1,
        concentration: "",
        concentrationRating: 0,
        specialization: "",
        specializationRating: 0,
      },
    });
    const pistols = await attemptCreateItem(actor, {
      name: "Pistols",
      type: "skill",
      system: {
        baseSkill: "Pistols",
        allocatedRating: 1,
        baseRating: 1,
        concentration: "",
        concentrationRating: 0,
        specialization: "",
        specializationRating: 0,
      },
    });
    const biotech = await attemptCreateItem(actor, {
      name: "Biotech",
      type: "skill",
      system: {
        baseSkill: "Biotech",
        allocatedRating: 1,
        baseRating: 1,
        concentration: "",
        concentrationRating: 0,
        specialization: "",
        specializationRating: 0,
      },
    });

    await sheet._onSkillAllocatedRatingChange(buildSkillEvent(sorcery.id, 6));
    await sheet._onSkillAllocatedRatingChange(buildSkillEvent(pistols.id, 5));
    await sheet._onConcentrationChange(buildSkillEvent(pistols.id, "Semi-Automatics"));
    await sheet._onSpecializationChange(buildSkillEvent(pistols.id, "Heavy Pistols"));
    await sheet._onSkillAllocatedRatingChange(buildSkillEvent(biotech.id, 4));

    expect(sr2ComputeSkillPointsSpent(actor.items.filter((item) => item.type === "skill"))).toBe(
      15,
    );
    expect(pistols.system.baseRating).toBe(3);
    expect(pistols.system.concentrationRating).toBe(5);
    expect(pistols.system.specializationRating).toBe(7);

    const heal = await attemptCreateItem(actor, {
      name: "Heal",
      type: "spell",
      system: { force: 4, class: "H", type: "M", drain: "[(F/2)+1]M" },
    });
    const manabolt = await attemptCreateItem(actor, {
      name: "Manabolt",
      type: "spell",
      system: { force: 3, class: "C", type: "M", drain: "[(F/2)+1]M" },
    });

    expect(heal).toBeTruthy();
    expect(manabolt).toBeTruthy();
    expect(sr2ComputeForcePointsSpent(actor.items)).toBe(7);

    const armor = await attemptCreateItem(actor, {
      name: "Armor Jacket",
      type: "armor",
      system: { price: 4000, quantity: 1, ballistic: 5, impact: 3, equipped: true },
    });
    const weapon = await attemptCreateItem(actor, {
      name: "Ares Predator",
      type: "weapon",
      system: { price: 1000, quantity: 1, damage: "9M", weaponType: "ranged" },
    });
    const medkit = await attemptCreateItem(actor, {
      name: "Medkit",
      type: "gear",
      system: { price: 500, quantity: 1, rating: 6 },
    });
    const cyberware = await attemptCreateItem(actor, {
      name: "Wired Reflexes",
      type: "cyberware",
      system: {
        price: 30000,
        quantity: 1,
        essence: 0.5,
        reactionBonus: 1,
        initiativeDice: 2,
        installed: false,
      },
    });
    const bioware = await attemptCreateItem(actor, {
      name: "Muscle Toner",
      type: "bioware",
      system: {
        price: 15000,
        quantity: 1,
        bioIndex: 0.75,
        mods: "+1QCK",
        installed: false,
      },
    });

    expect(armor).toBeTruthy();
    expect(weapon).toBeTruthy();
    expect(medkit).toBeTruthy();
    expect(cyberware).toBeTruthy();
    expect(bioware).toBeTruthy();

    await sheet._onCyberwareInstall({
      preventDefault: vi.fn(),
      currentTarget: {
        checked: true,
        dataset: { itemId: cyberware.id },
      },
    });
    await sheet._onBiowareInstall({
      preventDefault: vi.fn(),
      currentTarget: {
        checked: true,
        dataset: { itemId: bioware.id },
      },
    });

    actor._prepareCharacterData(actor);

    expect(cyberware.system.installed).toBe(true);
    expect(bioware.system.installed).toBe(true);
    expect(actor.system.attributes.essence.value).toBe(5.5);
    expect(actor.system.attributes.magic.value).toBe(5);
    expect(actor._sr2AugmentationModifiers.QCK).toBe(1);
    expect(actor.system.attributes.reaction.value).toBe(5);
    expect(actor.system.initiative.base).toBe(5);
    expect(actor.system.initiative.dice).toBe(3);

    const breakdown = sr2ComputeCreationNuyenBudgetBreakdown(actor.system, actor.items);
    expect(breakdown.itemCost).toBe(50500);
    expect(breakdown.lifestyleCost).toBe(2000);
    expect(breakdown.totalCost).toBe(52500);
    expect(breakdown.remainingNuyen).toBe(37500);
    expect(sheet._isCreationMode()).toBe(true);
    expect(actor.system.resources.nuyen).toBe(0);
  });

  it("supports buying cyberware and bioware through the item browser during character creation", async () => {
    const { SR2Actor, SR2ActorSheet } = await loadCharacterClasses();
    const SR2ItemBrowser = await loadItemBrowserClass();
    registerCreationRuleHooks();

    const actor = createCharacterActorDocument(SR2Actor, {
      system: {
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
        creation: {
          attributePoints: 20,
          skillPoints: 30,
          forcePoints: 0,
          startingNuyen: 300000,
          lifestyleMonths: 1,
          resourcesFinalized: false,
        },
        resources: {
          lifestyle: "street",
          lifestyles: [{ type: "street", months: 1 }],
        },
      },
    });

    const sheet = createSheet(SR2ActorSheet, actor);
    const cyberBrowser = new SR2ItemBrowser(actor, "cyberware", {});
    const bioBrowser = new SR2ItemBrowser(actor, "bioware", {});
    cyberBrowser.render = vi.fn();
    bioBrowser.render = vi.fn();

    cyberBrowser.filteredItems = cyberBrowser._processCyberwareData({
      BODYWARE: [
        {
          Name: "Wired Reflexes 2",
          EssCost: 3,
          Cost: 165000,
          StreetIndex: 1,
          Mods: "+4RCT,+2INI",
          BookPage: "sr2.249",
        },
      ],
    });
    bioBrowser.filteredItems = bioBrowser._processBiowareData({
      STANDARD: [
        {
          Name: "Cerebral Booster 2",
          BioIndex: "0.8",
          Cost: "110000",
          StreetIndex: "2.00",
          Mods: "+2INT",
          BookPage: "st.???",
        },
      ],
    });

    await cyberBrowser._onBuyItem({
      preventDefault: vi.fn(),
      currentTarget: { dataset: { itemIndex: "0" } },
    });
    await bioBrowser._onBuyItem({
      preventDefault: vi.fn(),
      currentTarget: { dataset: { itemIndex: "0" } },
    });

    const wiredReflexes = actor.items.find((item) => item.name === "Wired Reflexes 2");
    const cerebralBooster = actor.items.find((item) => item.name === "Cerebral Booster 2");

    expect(wiredReflexes).toBeTruthy();
    expect(cerebralBooster).toBeTruthy();
    expect(wiredReflexes.system).toMatchObject({
      essence: 3,
      reactionBonus: 4,
      initiativeDice: 2,
      rating: 2,
      installed: false,
    });
    expect(cerebralBooster.system).toMatchObject({
      bioIndex: 0.8,
      rating: 2,
      mods: "+2INT",
      installed: false,
    });

    await sheet._onCyberwareInstall({
      preventDefault: vi.fn(),
      currentTarget: {
        checked: true,
        dataset: { itemId: wiredReflexes.id },
      },
    });
    await sheet._onBiowareInstall({
      preventDefault: vi.fn(),
      currentTarget: {
        checked: true,
        dataset: { itemId: cerebralBooster.id },
      },
    });

    actor._prepareCharacterData(actor);

    expect(actor.system.attributes.essence.value).toBe(3);
    expect(actor.system.attributes.intelligence.value).toBe(5);
    expect(actor._sr2AugmentationModifiers.INT).toBe(2);
    expect(actor._sr2AugmentationModifiers.RCT).toBe(4);
    expect(actor._sr2AugmentationModifiers.INI).toBe(2);
    expect(actor.system.attributes.reaction.value).toBe(9);
    expect(actor.system.initiative.base).toBe(9);
    expect(actor.system.initiative.dice).toBe(3);

    const breakdown = sr2ComputeCreationNuyenBudgetBreakdown(actor.system, actor.items);
    expect(breakdown.itemCost).toBe(275000);
    expect(breakdown.remainingNuyen).toBe(25000);
  });

  it("blocks illegal chargen choices end to end for mundane characters and clamps overspends", async () => {
    const { SR2Actor, SR2ActorSheet } = await loadCharacterClasses();
    registerCreationRuleHooks();

    const actor = createCharacterActorDocument(SR2Actor, {
      system: {
        priorities: {
          metatype: "E",
          attributes: "C",
          skills: "B",
          resources: "D",
          magic: "A",
        },
      },
    });
    const sheet = createSheet(SR2ActorSheet, actor);

    await sr2ApplyCharacterPrioritiesOnCreate(actor, {
      userId: "U1",
      currentUserId: "U1",
      getAllowedMetatypesForPriority: sr2GetAllowedMetatypesForPriority,
      syncFreeLanguageSkills: sr2SyncFreeLanguageSkills,
    });

    await actor.update({
      "system.magic.awakened": false,
      "system.magic.physicalAdept": false,
      "system.attributes.magic.value": 0,
      "system.creation.forcePoints": 0,
    });

    await sheet._updateObject(
      { currentTarget: { name: "system.attributes.willpower.value" } },
      {
        "system.attributes.body.value": 3,
        "system.attributes.quickness.value": 3,
        "system.attributes.strength.value": 3,
        "system.attributes.charisma.value": 3,
        "system.attributes.intelligence.value": 4,
        "system.attributes.willpower.value": 4,
      },
    );
    await sheet._updateObject(
      { currentTarget: { name: "system.attributes.body.value" } },
      {
        "system.attributes.body.value": 4,
      },
    );

    expect(
      sr2ComputeAttributePointsSpent(actor.system.attributes, actor.system.details.metatype),
    ).toBe(20);
    expect(actor.system.attributes.body.value).toBe(3);
    expect(ui.notifications.warn).toHaveBeenCalledWith(
      "Attribute Points exceeded; clamped the last change.",
    );

    const sorcery = await attemptCreateItem(actor, {
      name: "Sorcery",
      type: "skill",
      system: {
        baseSkill: "Sorcery",
        allocatedRating: 1,
        baseRating: 1,
      },
    });
    expect(sorcery).toBeNull();
    expect(ui.notifications.error).toHaveBeenCalledWith(
      "Sorcery and Conjuring require a Magic rating.",
    );

    const spell = await attemptCreateItem(actor, {
      name: "Heal",
      type: "spell",
      system: { force: 2 },
    });
    expect(spell).toBeNull();
    expect(ui.notifications.error).toHaveBeenCalledWith(
      "This character has no Force Points available for spells/foci in creation mode.",
    );

    const pistols = await attemptCreateItem(actor, {
      name: "Pistols",
      type: "skill",
      system: {
        baseSkill: "Pistols",
        allocatedRating: 1,
        baseRating: 1,
        concentration: "",
        concentrationRating: 0,
        specialization: "",
        specializationRating: 0,
      },
    });

    await sheet._onSkillAllocatedRatingChange(buildSkillEvent(pistols.id, 8));
    await sheet._onSpecializationChange(buildSkillEvent(pistols.id, "Heavy Pistols"));

    expect(pistols.system.allocatedRating).toBe(6);
    expect(pistols.system.specialization).toBe("");
    expect(ui.notifications.warn).toHaveBeenCalledWith("Specialization requires a Concentration.");

    const expensiveCyberware = await attemptCreateItem(actor, {
      name: "Delta Clinic Toy",
      type: "cyberware",
      system: {
        price: 6000,
        quantity: 1,
        essence: 0.2,
        installed: false,
      },
    });

    expect(expensiveCyberware).toBeNull();
    expect(ui.notifications.error).toHaveBeenCalledWith(
      "Not enough creation Nuyen remaining for that item.",
    );
  });

  it("enforces cyberware essence limits and bioware capacity during installation", async () => {
    const { SR2Actor, SR2ActorSheet } = await loadCharacterClasses();

    const actor = createCharacterActorDocument(SR2Actor, {
      system: {
        attributes: {
          body: { value: 3 },
          quickness: { value: 3 },
          strength: { value: 3 },
          charisma: { value: 3 },
          intelligence: { value: 3 },
          willpower: { value: 3 },
          reaction: { value: 0 },
          magic: { value: 0, effective: 0 },
          essence: { value: 0.5, max: 6 },
        },
      },
    });
    const sheet = createSheet(SR2ActorSheet, actor);

    const [heavyCyber] = await actor.createEmbeddedDocuments("Item", [
      {
        name: "Essence Hog",
        type: "cyberware",
        system: {
          price: 1000,
          quantity: 1,
          essence: 0.5,
          installed: false,
        },
      },
    ]);
    const [installedBio, blockedBio] = await actor.createEmbeddedDocuments("Item", [
      {
        name: "Cultured Existing",
        type: "bioware",
        system: {
          price: 1000,
          quantity: 1,
          bioIndex: 2.5,
          installed: true,
        },
      },
      {
        name: "Cultured Upgrade",
        type: "bioware",
        system: {
          price: 1000,
          quantity: 1,
          bioIndex: 1.0,
          installed: false,
        },
      },
    ]);

    actor.system.attributes.essence.value = 0.5;
    await sheet._onCyberwareInstall({
      preventDefault: vi.fn(),
      currentTarget: {
        checked: true,
        dataset: { itemId: heavyCyber.id },
      },
    });

    expect(heavyCyber.system.installed).toBe(false);
    expect(ui.notifications.error).toHaveBeenCalledWith(
      expect.stringContaining("would reduce your Essence below 0.1"),
    );

    actor.system.attributes.essence.value = 3;
    await sheet._onBiowareInstall({
      preventDefault: vi.fn(),
      currentTarget: {
        checked: true,
        dataset: { itemId: blockedBio.id },
      },
    });

    expect(installedBio.system.installed).toBe(true);
    expect(blockedBio.system.installed).toBe(false);
    expect(ui.notifications.error).toHaveBeenCalledWith(
      expect.stringContaining("Bio Index cost (1) exceeds available capacity"),
    );
  });
});
