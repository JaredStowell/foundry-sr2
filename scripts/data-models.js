const SR2TypeDataModel = globalThis.foundry?.abstract?.TypeDataModel ?? class {};

function sr2Clone(value) {
  if (Array.isArray(value)) return value.map((entry) => sr2Clone(entry));
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, sr2Clone(entry)]));
  }
  return value;
}

function sr2MergeDefaults(base = {}, additions = {}) {
  const merged = sr2Clone(base);

  for (const [key, value] of Object.entries(additions)) {
    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      merged[key] &&
      typeof merged[key] === "object" &&
      !Array.isArray(merged[key])
    ) {
      merged[key] = sr2MergeDefaults(merged[key], value);
    } else {
      merged[key] = sr2Clone(value);
    }
  }

  return merged;
}

function sr2FieldClasses() {
  const fields = globalThis.foundry?.data?.fields;
  if (!fields) throw new Error("SR2E | foundry.data.fields is unavailable");
  return fields;
}

function sr2FieldFromDefault(value, path, htmlFields) {
  const {
    ArrayField,
    BooleanField,
    HTMLField,
    NumberField,
    ObjectField,
    SchemaField,
    StringField,
  } = sr2FieldClasses();

  const pathKey = path.join(".");

  if (htmlFields.has(pathKey)) {
    return new HTMLField({ required: true, blank: true, initial: String(value ?? "") });
  }

  if (Array.isArray(value)) {
    return new ArrayField(new ObjectField({ required: false, nullable: false, initial: {} }), {
      required: true,
      nullable: false,
      initial: sr2Clone(value),
    });
  }

  if (value && typeof value === "object") {
    return new SchemaField(
      Object.fromEntries(
        Object.entries(value).map(([key, entry]) => [
          key,
          sr2FieldFromDefault(entry, [...path, key], htmlFields),
        ]),
      ),
      { required: true, nullable: false },
    );
  }

  if (typeof value === "boolean") return new BooleanField({ required: true, initial: value });
  if (typeof value === "number") {
    return new NumberField({ required: true, nullable: false, initial: value });
  }
  return new StringField({ required: true, blank: true, initial: String(value ?? "") });
}

function sr2SchemaFromDefaults(defaults, htmlFields = []) {
  const htmlFieldSet = new Set(htmlFields);
  return Object.fromEntries(
    Object.entries(defaults).map(([key, value]) => [
      key,
      sr2FieldFromDefault(value, [key], htmlFieldSet),
    ]),
  );
}

class SR2TemplateBackedDataModel extends SR2TypeDataModel {
  static DEFAULT_SYSTEM = {};
  static HTML_FIELDS = [];

  static defineSchema() {
    return sr2SchemaFromDefaults(this.DEFAULT_SYSTEM, this.HTML_FIELDS);
  }
}

const SR2_CHARACTER_BASE_DEFAULTS = {
  health: {
    physical: { value: 0, max: 10 },
    stun: { value: 0, max: 10 },
  },
  biography: "",
  attributes: {
    body: { value: 0, min: 0, max: 6 },
    quickness: { value: 0, min: 0, max: 6 },
    strength: { value: 0, min: 0, max: 6 },
    charisma: { value: 0, min: 0, max: 6 },
    intelligence: { value: 0, min: 0, max: 6 },
    willpower: { value: 0, min: 0, max: 6 },
    essence: { value: 6, min: 0, max: 6 },
    magic: { value: 0, min: 0, max: 6 },
    reaction: { value: 0, min: 0, max: 12 },
  },
  pools: {
    combat: { current: 0, max: 0 },
    spell: { current: 0, max: 0 },
    karma: { current: 0, total: 0, base: 0 },
    hacking: { current: 0, max: 0 },
    control: { current: 0, max: 0 },
    task: { current: 0, max: 0 },
    astral: { current: 0, max: 0 },
  },
  initiative: { base: 2, dice: 1, current: 0 },
  magic: { awakened: false, physicalAdept: false, tradition: "" },
  karma: { earned: 0, spent: 0 },
  resources: {
    nuyen: 0,
    lifestyle: "street",
    lifestyles: [{ type: "street", months: 1 }],
  },
  priorities: {
    attributes: "",
    skills: "",
    resources: "",
    metatype: "",
    magic: "",
  },
  creation: {
    attributePoints: 0,
    skillPoints: 0,
    forcePoints: 0,
    startingNuyen: 0,
    lifestyleMonths: 1,
    extras: { contacts: 0, buddy: 0, gang: 0, followers: 0 },
    resourcesFinalized: false,
    unspentNuyen: 0,
    startingCashFromUnspent: 0,
    startingCashRoll: 0,
    startingCashFinal: 0,
  },
  details: {
    metatype: "human",
    nativeLanguage: "English",
    dialectLanguage: "City Speak",
    age: "",
    height: "",
    weight: "",
    eyes: "",
    hair: "",
    skin: "",
    concept: "",
    archetype: "",
    traits: {
      lowLightVision: false,
      thermographicVision: false,
      reach: 0,
      dermalArmor: 0,
      diseaseResistance: 0,
    },
  },
};

const SR2_SPIRIT_DEFAULTS = {
  spiritType: "",
  spiritForm: "manifest",
  attributes: {
    body: { value: 1, min: 1, max: 20 },
    quickness: { value: 1, min: 1, max: 20 },
    strength: { value: 1, min: 1, max: 20 },
    charisma: { value: 1, min: 1, max: 20 },
    intelligence: { value: 1, min: 1, max: 20 },
    willpower: { value: 1, min: 1, max: 20 },
    force: { value: 1, min: 1, max: 12 },
    reaction: { value: 1, min: 1, max: 20 },
  },
  initiative: { base: 0, dice: 1, current: 0 },
  health: { value: 0, max: 10 },
  powers: "",
  services: 0,
  summoner: "",
  biography: "",
};

const SR2_ACTOR_BASE_DEFAULTS = {
  health: {
    physical: { value: 0, max: 10 },
    stun: { value: 0, max: 10 },
  },
  biography: "",
};

export const SR2_ACTOR_SYSTEM_DEFAULTS = {
  character: SR2_CHARACTER_BASE_DEFAULTS,
  contact: sr2MergeDefaults(SR2_CHARACTER_BASE_DEFAULTS, {
    details: { contactLevel: 1, leaderId: "" },
  }),
  follower: sr2MergeDefaults(SR2_CHARACTER_BASE_DEFAULTS, {
    details: { leaderId: "" },
  }),
  cyberdeck: {
    name: "",
    model: "",
    persona: 1,
    personaPrograms: { body: 0, evasion: 0, masking: 0, sensors: 0 },
    hardening: 0,
    memory: { total: 100, used: 0 },
    storage: { total: 500, used: 0 },
    load: 5,
    ioSpeed: 1,
    responseIncrease: 0,
    damage: { icon: { value: 0, max: 10 } },
    cost: 0,
    streetIndex: 1,
    availability: "",
    bookPage: "",
    biography: "",
  },
  vehicle: sr2MergeDefaults(SR2_ACTOR_BASE_DEFAULTS, {
    model: "",
    vehicleType: "ground",
    handling: { on: 0, off: 0 },
    speed: 0,
    accel: 0,
    body: 0,
    armor: 0,
    sig: 0,
    autonav: 0,
    pilot: 0,
    sensor: 0,
    cargo: 0,
    load: 0,
    seating: "",
    cost: 0,
    availability: "",
    streetIndex: 1,
    notes: "",
    bookPage: "",
    health: { value: 0, max: 10 },
  }),
  spirit: SR2_SPIRIT_DEFAULTS,
  critter: SR2_SPIRIT_DEFAULTS,
  ic: sr2MergeDefaults(SR2_SPIRIT_DEFAULTS, { icType: "", rating: 1 }),
};

const SR2_ITEM_BASE_DEFAULTS = {
  description: "",
  source: "",
  quantity: 1,
  weight: 0,
  price: 0,
};

export const SR2_ITEM_SYSTEM_DEFAULTS = {
  skill: sr2MergeDefaults(SR2_ITEM_BASE_DEFAULTS, {
    allocatedRating: 0,
    baseRating: 0,
    concentrationRating: 0,
    specializationRating: 0,
    baseSkill: "",
    concentration: "",
    specialization: "",
    category: "active",
    isFree: false,
    freeLanguageType: "",
    requiresConcentration: false,
  }),
  weapon: sr2MergeDefaults(SR2_ITEM_BASE_DEFAULTS, {
    weaponType: "melee",
    concealability: 0,
    damage: "1M",
    reach: 0,
    mode: "SS",
    ammo: { current: 0, max: 0, type: "" },
    recoil: 0,
    rangeType: "",
    equipped: false,
    linkedSkill: { skillId: "", rollType: "base" },
  }),
  armor: sr2MergeDefaults(SR2_ITEM_BASE_DEFAULTS, {
    rating: 0,
    concealability: 0,
    ballistic: 0,
    impact: 0,
    equipped: false,
  }),
  gear: sr2MergeDefaults(SR2_ITEM_BASE_DEFAULTS, {
    category: "",
    rating: 0,
    bondCost: 0,
    equipped: false,
    focus: { spellId: "", spellClass: "", spiritType: "" },
  }),
  cyberware: sr2MergeDefaults(SR2_ITEM_BASE_DEFAULTS, {
    rating: 0,
    essence: 0,
    installed: false,
    bodyLocation: "",
    reactionBonus: 0,
    initiativeDice: 0,
    streetIndex: 1,
    mods: "",
  }),
  bioware: sr2MergeDefaults(SR2_ITEM_BASE_DEFAULTS, {
    rating: 0,
    bioIndex: 0,
    installed: false,
    bodyLocation: "",
    streetIndex: 1,
    mods: "",
  }),
  spell: sr2MergeDefaults(SR2_ITEM_BASE_DEFAULTS, {
    category: "combat",
    type: "mana",
    range: "touch",
    damage: "M",
    duration: "instant",
    drain: "2",
    force: 1,
    class: "C",
    spellLock: { assigned: false, enabled: false },
  }),
  adeptpower: sr2MergeDefaults(SR2_ITEM_BASE_DEFAULTS, {
    cost: 0,
    hasLevels: false,
    currentLevel: 1,
    maxLevel: 6,
    mods: "",
    notes: "",
    bookPage: "",
  }),
  contact: sr2MergeDefaults(SR2_ITEM_BASE_DEFAULTS, {
    level: 1,
    loyalty: 1,
    archetype: "",
    connection: "",
    notes: "",
  }),
  program: sr2MergeDefaults(SR2_ITEM_BASE_DEFAULTS, {
    rating: 1,
    type: "utility",
    multiplier: 1,
    memorySize: 1,
    loadTime: 1,
    isActive: false,
    isLoaded: false,
    availability: "",
    streetIndex: 1,
  }),
  totem: sr2MergeDefaults(SR2_ITEM_BASE_DEFAULTS, {
    environment: "",
    advantages: "",
    disadvantages: "",
    isSelected: false,
  }),
};

class SR2CharacterDataModel extends SR2TemplateBackedDataModel {
  static DEFAULT_SYSTEM = SR2_ACTOR_SYSTEM_DEFAULTS.character;
  static HTML_FIELDS = ["biography"];
}

class SR2ContactDataModel extends SR2TemplateBackedDataModel {
  static DEFAULT_SYSTEM = SR2_ACTOR_SYSTEM_DEFAULTS.contact;
  static HTML_FIELDS = ["biography"];
}

class SR2FollowerDataModel extends SR2TemplateBackedDataModel {
  static DEFAULT_SYSTEM = SR2_ACTOR_SYSTEM_DEFAULTS.follower;
  static HTML_FIELDS = ["biography"];
}

class SR2CyberdeckDataModel extends SR2TemplateBackedDataModel {
  static DEFAULT_SYSTEM = SR2_ACTOR_SYSTEM_DEFAULTS.cyberdeck;
  static HTML_FIELDS = ["biography"];
}

class SR2VehicleDataModel extends SR2TemplateBackedDataModel {
  static DEFAULT_SYSTEM = SR2_ACTOR_SYSTEM_DEFAULTS.vehicle;
  static HTML_FIELDS = ["biography"];
}

class SR2SpiritDataModel extends SR2TemplateBackedDataModel {
  static DEFAULT_SYSTEM = SR2_ACTOR_SYSTEM_DEFAULTS.spirit;
  static HTML_FIELDS = ["biography"];
}

class SR2CritterDataModel extends SR2TemplateBackedDataModel {
  static DEFAULT_SYSTEM = SR2_ACTOR_SYSTEM_DEFAULTS.critter;
  static HTML_FIELDS = ["biography"];
}

class SR2ICDataModel extends SR2TemplateBackedDataModel {
  static DEFAULT_SYSTEM = SR2_ACTOR_SYSTEM_DEFAULTS.ic;
  static HTML_FIELDS = ["biography"];
}

class SR2SkillDataModel extends SR2TemplateBackedDataModel {
  static DEFAULT_SYSTEM = SR2_ITEM_SYSTEM_DEFAULTS.skill;
  static HTML_FIELDS = ["description"];
}

class SR2WeaponDataModel extends SR2TemplateBackedDataModel {
  static DEFAULT_SYSTEM = SR2_ITEM_SYSTEM_DEFAULTS.weapon;
  static HTML_FIELDS = ["description"];
}

class SR2ArmorDataModel extends SR2TemplateBackedDataModel {
  static DEFAULT_SYSTEM = SR2_ITEM_SYSTEM_DEFAULTS.armor;
  static HTML_FIELDS = ["description"];
}

class SR2GearDataModel extends SR2TemplateBackedDataModel {
  static DEFAULT_SYSTEM = SR2_ITEM_SYSTEM_DEFAULTS.gear;
  static HTML_FIELDS = ["description"];
}

class SR2CyberwareDataModel extends SR2TemplateBackedDataModel {
  static DEFAULT_SYSTEM = SR2_ITEM_SYSTEM_DEFAULTS.cyberware;
  static HTML_FIELDS = ["description"];
}

class SR2BiowareDataModel extends SR2TemplateBackedDataModel {
  static DEFAULT_SYSTEM = SR2_ITEM_SYSTEM_DEFAULTS.bioware;
  static HTML_FIELDS = ["description"];
}

class SR2SpellDataModel extends SR2TemplateBackedDataModel {
  static DEFAULT_SYSTEM = SR2_ITEM_SYSTEM_DEFAULTS.spell;
  static HTML_FIELDS = ["description"];
}

class SR2AdeptPowerDataModel extends SR2TemplateBackedDataModel {
  static DEFAULT_SYSTEM = SR2_ITEM_SYSTEM_DEFAULTS.adeptpower;
  static HTML_FIELDS = ["description"];
}

class SR2ContactItemDataModel extends SR2TemplateBackedDataModel {
  static DEFAULT_SYSTEM = SR2_ITEM_SYSTEM_DEFAULTS.contact;
  static HTML_FIELDS = ["description"];
}

class SR2ProgramDataModel extends SR2TemplateBackedDataModel {
  static DEFAULT_SYSTEM = SR2_ITEM_SYSTEM_DEFAULTS.program;
  static HTML_FIELDS = ["description"];
}

class SR2TotemDataModel extends SR2TemplateBackedDataModel {
  static DEFAULT_SYSTEM = SR2_ITEM_SYSTEM_DEFAULTS.totem;
  static HTML_FIELDS = ["description"];
}

export const SR2_ACTOR_DATA_MODELS = {
  character: SR2CharacterDataModel,
  contact: SR2ContactDataModel,
  follower: SR2FollowerDataModel,
  cyberdeck: SR2CyberdeckDataModel,
  vehicle: SR2VehicleDataModel,
  spirit: SR2SpiritDataModel,
  critter: SR2CritterDataModel,
  ic: SR2ICDataModel,
};

export const SR2_ITEM_DATA_MODELS = {
  skill: SR2SkillDataModel,
  weapon: SR2WeaponDataModel,
  armor: SR2ArmorDataModel,
  gear: SR2GearDataModel,
  cyberware: SR2CyberwareDataModel,
  bioware: SR2BiowareDataModel,
  spell: SR2SpellDataModel,
  adeptpower: SR2AdeptPowerDataModel,
  contact: SR2ContactItemDataModel,
  program: SR2ProgramDataModel,
  totem: SR2TotemDataModel,
};
