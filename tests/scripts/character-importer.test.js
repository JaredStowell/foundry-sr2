import { beforeEach, describe, expect, it, vi } from "vitest";

async function loadImporterHelpers() {
  vi.resetModules();
  return import("../../scripts/character-importer-helpers.js");
}

async function loadCharacterImporterModule() {
  vi.resetModules();
  return import("../../scripts/character-importer.js");
}

function createImportFixture(overrides = {}) {
  return {
    street_name: "New Runner",
    race: "Troll",
    age: 18,
    magical: true,
    magicalChoice: "Metahuman Full Magician",
    magicalTradition: { name: "Shaman" },
    magicalTotem: { name: "Wolf" },
    priorities: {
      Race: "A",
      Magic: "B",
      Attributes: "C",
      Skills: "D",
      Resources: "E",
    },
    maxSkillPoints: 20,
    maxAttributePoints: 20,
    maxSpellPoints: 5,
    chargenCash: 500,
    cashSpent: 200,
    karma: 3,
    karmaPool: 1,
    attributes: {
      Body: 4,
      Quickness: 2,
      Strength: 1,
      Charisma: 6,
      Willpower: 6,
      Intelligence: 1,
      Essence: 6,
      Initative: 1,
      Magic: 6,
      Reaction: 4,
    },
    raceBonuses: {
      Body: 5,
      Quickness: -1,
      Strength: 4,
      Charisma: -2,
      Willpower: -1,
      Intelligence: -2,
      Notes: "Thermographic Vision, +1 Reach for Armed/Unarmed Combat, Dermal Armor (+1 Body)",
    },
    magicalAttributeBonuses: {
      Body: 0,
      Quickness: 0,
      Strength: 0,
      Charisma: 0,
      Willpower: 0,
      Intelligence: 0,
      Reaction: 0,
    },
    cyberAttributeBonuses: {
      Body: 0,
      Quickness: 0,
      Strength: 0,
      Charisma: 0,
      Willpower: 0,
      Intelligence: 0,
      Reaction: 0,
    },
    skills: [
      {
        name: "Sorcery",
        rating: 5,
        type: "Active",
        selectedConcentrations: [],
        Concentrations: [{ name: "Combat Spells", Specializations: ["*technique"] }],
      },
      {
        name: "Firearms",
        rating: 4,
        type: "Active",
        selectedConcentrations: [
          {
            name: "Pistols",
            selectedSpecializations: ["Heavy Pistol"],
          },
        ],
        Concentrations: [{ name: "Pistols", Specializations: ["Heavy Pistol"] }],
      },
    ],
    gear: [
      {
        Name: "Armor Vest",
        Concealability: "12",
        Ballistic: "2",
        Impact: "1",
        Weight: "1",
        Cost: "200",
        Type: "Clothing and Armor",
        Amount: 1,
      },
      {
        Name: "Knife",
        Concealability: "8",
        Reach: "-",
        Damage: "(STR)L",
        Weight: ".5",
        Cost: "30",
        Type: "Edged weapon",
        Amount: 1,
      },
      {
        Name: "Power Focus-2",
        Concealability: "4",
        Weight: "0.5",
        Cost: "900000",
        Type: "Magical Equipment",
        Amount: 1,
      },
    ],
    weapons: [
      {
        Name: "Ares Predator Heavy Pistol",
        Type: "Firearms",
        Concealability: "4",
        Damage: "9M",
        Mode: "SA",
        Ammo: "15",
        Weight: "1.2",
        Cost: "650",
      },
    ],
    spells: [
      {
        Name: "Sleep              ",
        Drain: "[(F/2)-1]S",
        Type: "M",
        Duration: "I",
        Class: "C",
        Rating: 5,
        BookPage: "SR2.???",
      },
    ],
    powers: [
      {
        Name: "Improved Reflexes",
        Cost: "2",
        HasLevels: false,
        Notes: "Bonus initiative dice",
      },
    ],
    contacts: [
      {
        Name: "Contact 1",
        Archtype: "Fixer",
        Level: 1,
        GeneralInfo: "Helps with gear",
      },
    ],
    ...overrides,
  };
}

describe("character importer helpers", () => {
  beforeEach(() => {
    ui.notifications.warn.mockClear();
    ui.notifications.error.mockClear();
    ui.notifications.info.mockClear();
  });

  it("builds actor data from imported stats, traits, and priorities", async () => {
    const { sr2BuildImportedActorData } = await loadImporterHelpers();
    const actorData = sr2BuildImportedActorData(createImportFixture());

    expect(actorData.name).toBe("New Runner");
    expect(actorData.system.details.metatype).toBe("troll");
    expect(actorData.system.details.traits.thermographicVision).toBe(true);
    expect(actorData.system.details.traits.reach).toBe(1);
    expect(actorData.system.attributes.body).toEqual({ value: 9, min: 5, max: 11 });
    expect(actorData.system.attributes.charisma).toEqual({ value: 4, min: -2, max: 4 });
    expect(actorData.system.initiative.base).toBe(4);
    expect(actorData.system.magic).toEqual({
      awakened: true,
      physicalAdept: false,
      tradition: "shamanic",
    });
    expect(actorData.system.priorities).toEqual({
      metatype: "A",
      attributes: "C",
      skills: "D",
      resources: "E",
      magic: "B",
    });
    expect(actorData.system.creation.attributePoints).toBe(20);
    expect(actorData.system.creation.skillPoints).toBe(20);
    expect(actorData.system.creation.forcePoints).toBe(5);
    expect(actorData.system.resources.nuyen).toBe(300);
    expect(actorData.system.biography).toContain("Totem: Wolf");
    expect(actorData.system.biography).toContain("Racial Notes:");
  });

  it("maps imported skills, gear, weapons, spells, and powers into system items", async () => {
    const { sr2BuildImportedItemData } = await loadImporterHelpers();
    const skillCatalog = {
      Sorcery: {
        name: "Sorcery",
        requiresConcentration: false,
        Concentrations: [{ name: "Combat Spells", Specializations: ["*technique"] }],
      },
      Firearms: {
        name: "Firearms",
        requiresConcentration: false,
        Concentrations: [{ name: "Pistols", Specializations: ["Heavy Pistol"] }],
      },
    };

    const items = sr2BuildImportedItemData(createImportFixture(), { skillCatalog });
    const baseSorcery = items.find(
      (item) => item.type === "skill" && item.system.baseSkill === "Sorcery",
    );
    const specializedFirearms = items.find(
      (item) =>
        item.type === "skill" &&
        item.system.baseSkill === "Firearms" &&
        item.system.concentration === "Pistols",
    );
    const armorVest = items.find((item) => item.name === "Armor Vest");
    const knife = items.find((item) => item.name === "Knife");
    const powerFocus = items.find((item) => item.name === "Power Focus-2");
    const pistol = items.find((item) => item.name === "Ares Predator Heavy Pistol");
    const sleep = items.find((item) => item.type === "spell");
    const adeptPower = items.find((item) => item.type === "adeptpower");

    expect(baseSorcery.system.attribute).toBe("willpower");
    expect(baseSorcery.system.baseRating).toBe(5);
    expect(baseSorcery.system.description).toContain("Combat Spells");

    expect(specializedFirearms.system.attribute).toBe("quickness");
    expect(specializedFirearms.system.baseRating).toBe(2);
    expect(specializedFirearms.system.concentrationRating).toBe(4);
    expect(specializedFirearms.system.specializationRating).toBe(6);
    expect(specializedFirearms.name).toBe("Firearms (Pistols) [Heavy Pistol]");

    expect(armorVest.type).toBe("armor");
    expect(armorVest.system.ballistic).toBe(2);
    expect(armorVest.system.impact).toBe(1);

    expect(knife.type).toBe("weapon");
    expect(knife.system.weaponType).toBe("melee");
    expect(knife.system.damage).toBe("(STR)L");

    expect(powerFocus.type).toBe("gear");
    expect(powerFocus.system.bondCost).toBe(10);

    expect(pistol.type).toBe("weapon");
    expect(pistol.system.weaponType).toBe("ranged");
    expect(pistol.system.rangeType).toBe("(HPist)");

    expect(sleep.system.category).toBe("combat");
    expect(sleep.system.type).toBe("mana");
    expect(sleep.system.duration).toBe("instant");
    expect(sleep.system.description).toContain("Source: SR2.???");

    expect(adeptPower.system.cost).toBe(2);
  });

  it("builds contact actors with leader linkage and a readable biography", async () => {
    const { sr2BuildImportedContactActorData } = await loadImporterHelpers();
    const contactData = sr2BuildImportedContactActorData(createImportFixture().contacts[0], {
      characterName: "New Runner",
      leaderId: "actor-1",
    });

    expect(contactData.name).toBe("Contact 1");
    expect(contactData.system.initiative.base).toBe(3);
    expect(contactData.system.details.concept).toBe("Fixer");
    expect(contactData.system.details.leaderId).toBe("actor-1");
    expect(contactData.system.biography).toContain("Helps with gear");
  });
});

describe("SR2CharacterImporter", () => {
  beforeEach(() => {
    globalThis.fetch = vi.fn(async () => ({
      ok: true,
      json: async () => ({
        Sorcery: {
          name: "Sorcery",
          requiresConcentration: false,
          Concentrations: [{ name: "Combat Spells", Specializations: ["*technique"] }],
        },
      }),
    }));
  });

  it("creates an actor, imports items, and creates contacts from imported data", async () => {
    const createdContacts = [];
    const actor = {
      id: "actor-123",
      name: "New Runner",
      sheet: { render: vi.fn() },
      createEmbeddedDocuments: vi.fn(async () => []),
    };

    globalThis.Actor = {
      create: vi.fn(async (data) => {
        if (data.type === "contact") {
          createdContacts.push(data);
          return { id: `contact-${createdContacts.length}`, ...data };
        }
        return actor;
      }),
    };

    const { SR2CharacterImporter } = await loadCharacterImporterModule();
    const result = await SR2CharacterImporter._createCharacterActor(
      createImportFixture(),
      true,
      true,
    );

    expect(result).toBe(actor);
    expect(globalThis.Actor.create).toHaveBeenCalled();
    expect(actor.createEmbeddedDocuments).toHaveBeenCalledTimes(1);
    const [documentName, documents] = actor.createEmbeddedDocuments.mock.calls[0];
    expect(documentName).toBe("Item");
    expect(documents.some((item) => item.type === "spell")).toBe(true);
    expect(documents.some((item) => item.type === "armor")).toBe(true);
    expect(createdContacts).toHaveLength(1);
    expect(createdContacts[0].system.details.leaderId).toBe("actor-123");
  });
});
