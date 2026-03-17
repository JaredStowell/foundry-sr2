import {
  sr2InferCombatSpellDamageLevelFromName,
  sr2ComputeSkillRatingsFromAllocated,
  sr2GetRacialAttributeBounds,
  sr2GetRacialTraits,
  sr2InferFocusBondCostForGearItem,
} from "./sr2-rules.js";

const IMPORTED_ATTRIBUTE_KEYS = [
  "body",
  "quickness",
  "strength",
  "charisma",
  "intelligence",
  "willpower",
  "essence",
  "magic",
  "reaction",
];

const IMPORTED_ATTRIBUTE_ALIASES = {
  body: "body",
  quickness: "quickness",
  strength: "strength",
  charisma: "charisma",
  intelligence: "intelligence",
  willpower: "willpower",
  essence: "essence",
  magic: "magic",
  reaction: "reaction",
  initiative: "initiative",
  initative: "initiative",
};

const IMPORTED_BONUS_PATHS = ["raceBonuses", "magicalAttributeBonuses", "cyberAttributeBonuses"];

const IMPORTED_METATYPE_MAP = {
  human: "human",
  elf: "elf",
  dwarf: "dwarf",
  ork: "ork",
  troll: "troll",
  orc: "ork",
};

const IMPORTED_TRADITION_MAP = {
  hermetic: "hermetic",
  shaman: "shamanic",
  shamanic: "shamanic",
};

const SKILL_ATTRIBUTE_OVERRIDES = {
  "armed combat": "quickness",
  athletics: "body",
  bike: "quickness",
  biology: "intelligence",
  biotech: "intelligence",
  "biotech b/r": "intelligence",
  "boats b/r": "intelligence",
  car: "quickness",
  "channel: access": "intelligence",
  "channel: control": "intelligence",
  "channel: files": "intelligence",
  "channel: index": "intelligence",
  "channel: slave": "intelligence",
  computer: "intelligence",
  "computer b/r": "intelligence",
  "computer theory": "intelligence",
  conjuring: "charisma",
  cybertechnology: "intelligence",
  dancing: "quickness",
  demolitions: "intelligence",
  electronics: "intelligence",
  "electronics b/r": "intelligence",
  enchanting: "intelligence",
  firearms: "quickness",
  "firearms b/r": "intelligence",
  gunnery: "quickness",
  "gunnery b/r": "intelligence",
  hovecraft: "quickness",
  interrogation: "charisma",
  leadership: "charisma",
  language: "intelligence",
  "magical theory": "intelligence",
  "military theory": "intelligence",
  motorboat: "quickness",
  negotiation: "charisma",
  "physical sciences": "intelligence",
  "police procedures": "intelligence",
  "projectile weapons": "quickness",
  psychology: "intelligence",
  "rotor craft": "quickness",
  sailboat: "quickness",
  singing: "charisma",
  sociology: "intelligence",
  sorcery: "willpower",
  stealth: "quickness",
  "throwing weapons": "quickness",
  "unarmed combat": "quickness",
  "vectored thrust": "quickness",
  "winged planes": "quickness",
};

const SPELL_CATEGORY_MAP = {
  c: "combat",
  combat: "combat",
  d: "detection",
  detection: "detection",
  h: "health",
  health: "health",
  i: "illusion",
  illusion: "illusion",
  m: "manipulation",
  manipulation: "manipulation",
};

const SPELL_TYPE_MAP = {
  m: "mana",
  mana: "mana",
  p: "physical",
  physical: "physical",
};

const SPELL_DURATION_MAP = {
  i: "instant",
  instant: "instant",
  s: "sustained",
  sustained: "sustained",
  p: "permanent",
  permanent: "permanent",
};

const WEAPON_RANGE_FALLBACKS = {
  Firearms: "(MPist)",
  "Bow and crossbow": "(Bow)",
  "Rockets and Missiles": "(MisLn)",
};

function normalizeName(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

function isFiniteNumber(value) {
  return Number.isFinite(Number(value));
}

export function sr2ParseImportedInteger(value, fallback = 0) {
  if (value == null || value === "") return fallback;
  const numeric = parseInt(String(value).replace(/[^\d-]/g, ""), 10);
  return Number.isFinite(numeric) ? numeric : fallback;
}

export function sr2ParseImportedFloat(value, fallback = 0) {
  if (value == null || value === "") return fallback;
  const numeric = parseFloat(String(value).replace(/[^\d.-]/g, ""));
  return Number.isFinite(numeric) ? numeric : fallback;
}

function getImportedStringField(data, ...keys) {
  for (const key of keys) {
    const value = data?.[key];
    if (typeof value !== "string") continue;
    const trimmed = value.trim();
    if (trimmed) return trimmed;
  }
  return "";
}

function normalizeTraditionName(value) {
  const normalized = normalizeName(value);
  return IMPORTED_TRADITION_MAP[normalized] || "";
}

function normalizeMetatype(value) {
  const normalized = normalizeName(value);
  return IMPORTED_METATYPE_MAP[normalized] || "human";
}

function normalizeAttributeKey(value) {
  return IMPORTED_ATTRIBUTE_ALIASES[normalizeName(value)] || null;
}

function getImportedAttributeValue(record, attributeKey) {
  if (!record || typeof record !== "object") return 0;

  for (const [rawKey, rawValue] of Object.entries(record)) {
    if (normalizeAttributeKey(rawKey) !== attributeKey) continue;
    return Number(rawValue) || 0;
  }

  return 0;
}

function getImportedResourceNuyen(data) {
  if (isFiniteNumber(data?.cash)) return Math.max(0, Number(data.cash));

  const chargenCash = Number(data?.chargenCash);
  const cashSpent = Number(data?.cashSpent);
  if (Number.isFinite(chargenCash) && Number.isFinite(cashSpent)) {
    return Math.max(0, chargenCash - cashSpent);
  }

  return 0;
}

function normalizeImportedFocusName(name) {
  return String(name || "")
    .trim()
    .replace(
      /^(Specific Spell Focus|Spell Type Focus|Spell Category Focus|Spirit Focus|Power Focus|Weapon Focus)\s*-\s*(\d+)$/i,
      "$1 $2",
    );
}

function mapImportedPriorities(priorities) {
  if (!priorities || typeof priorities !== "object") {
    return {
      metatype: "",
      attributes: "",
      skills: "",
      resources: "",
      magic: "",
    };
  }

  return {
    metatype: String(priorities.Race || priorities.metatype || "").trim(),
    attributes: String(priorities.Attributes || priorities.attributes || "").trim(),
    skills: String(priorities.Skills || priorities.skills || "").trim(),
    resources: String(priorities.Resources || priorities.resources || "").trim(),
    magic: String(priorities.Magic || priorities.magic || "").trim(),
  };
}

function mapImportedCreationBudget(data) {
  return {
    attributePoints: Number(data?.maxAttributePoints) || 0,
    skillPoints: Number(data?.maxSkillPoints) || 0,
    forcePoints: Number(data?.maxSpellPoints ?? data?.pointbuyExtraForce) || 0,
    startingNuyen: Number(data?.chargenCash) || 0,
    lifestyleMonths: 1,
    extras: {
      contacts: 0,
      buddy: 0,
      gang: 0,
      followers: 0,
    },
  };
}

function mapImportedMagicFlags(data) {
  const magicalChoice = getImportedStringField(data, "magicalChoice");
  const isPhysicalAdept = /physical adept/i.test(magicalChoice);
  const awakened = Boolean(data?.magical || magicalChoice);
  const tradition =
    normalizeTraditionName(data?.magicalTradition?.name) ||
    normalizeTraditionName(data?.magicalTradition);

  return {
    awakened,
    physicalAdept: isPhysicalAdept,
    tradition,
  };
}

function describeImportedPriorityLines(priorities) {
  return Object.entries(priorities)
    .filter(([, value]) => value)
    .map(([key, value]) => `${key}: ${value}`);
}

export function sr2BuildImportedBiography(data) {
  const lines = ["Imported Character", ""];

  const race = getImportedStringField(data, "race");
  if (race) lines.push(`Race: ${race}`);

  if (data?.age != null && data.age !== "") lines.push(`Age: ${data.age}`);

  const magicalChoice = getImportedStringField(data, "magicalChoice");
  if (magicalChoice) lines.push(`Magical Type: ${magicalChoice}`);

  const tradition = getImportedStringField(data?.magicalTradition, "name");
  if (tradition) lines.push(`Tradition: ${tradition}`);

  const totem = getImportedStringField(data?.magicalTotem, "name");
  if (totem) lines.push(`Totem: ${totem}`);

  const priorityLines = describeImportedPriorityLines(data?.priorities || {});
  if (priorityLines.length) {
    lines.push("", "Priorities:", ...priorityLines.map((line) => `  ${line}`));
  }

  const racialNotes = getImportedStringField(data?.raceBonuses, "Notes", "notes");
  if (racialNotes) lines.push("", `Racial Notes: ${racialNotes}`);

  const description = getImportedStringField(data, "description");
  if (description) lines.push("", `Description: ${description}`);

  const notes = getImportedStringField(data, "notes");
  if (notes) lines.push("", `Notes: ${notes}`);

  return lines.join("\n").trim();
}

export function sr2BuildImportedActorData(data) {
  const metatype = normalizeMetatype(data?.race);
  const racialBounds = sr2GetRacialAttributeBounds(metatype);
  const traits = sr2GetRacialTraits(metatype);
  const attributes = {};

  for (const attributeKey of IMPORTED_ATTRIBUTE_KEYS) {
    let finalValue = getImportedAttributeValue(data?.attributes, attributeKey);

    for (const bonusPath of IMPORTED_BONUS_PATHS) {
      finalValue += getImportedAttributeValue(data?.[bonusPath], attributeKey);
    }

    if (attributeKey === "essence") {
      attributes.essence = { value: Math.max(0, finalValue || 6), min: 0, max: 6 };
      continue;
    }

    if (attributeKey === "magic") {
      attributes.magic = { value: Math.max(0, finalValue || 0), min: 0, max: 6 };
      continue;
    }

    if (attributeKey === "reaction") {
      attributes.reaction = { value: Math.max(1, finalValue || 1), min: 1, max: 12 };
      continue;
    }

    const bounds = racialBounds[attributeKey] || { min: 1, max: 6 };
    const fallback = Math.max(1, Number(bounds.min) || 1);
    const resolved = Math.max(fallback, finalValue || fallback);
    attributes[attributeKey] = {
      value: resolved,
      min: bounds.min,
      max: bounds.max,
    };
  }

  const magic = mapImportedMagicFlags(data);
  const initiativeBase = Number(attributes.reaction?.value) || 1;

  return {
    name: getImportedStringField(data, "street_name", "name") || "Imported Character",
    type: "character",
    img: "icons/svg/mystery-man.svg",
    system: {
      attributes,
      pools: {
        combat: { current: 0, max: 0 },
        spell: { current: 0, max: 0 },
        karma: { current: Number(data?.karmaPool) || 0, total: Number(data?.karma) || 0 },
        hacking: { current: 0, max: 0 },
        control: { current: 0, max: 0 },
        task: { current: 0, max: 0 },
        astral: { current: 0, max: 0 },
      },
      initiative: {
        base: initiativeBase,
        dice: 1,
        current: 0,
      },
      magic,
      priorities: mapImportedPriorities(data?.priorities),
      creation: mapImportedCreationBudget(data),
      resources: {
        nuyen: getImportedResourceNuyen(data),
        lifestyle: "street",
        lifestyles: [{ type: "street", months: 1 }],
      },
      details: {
        metatype,
        nativeLanguage: getImportedStringField(data, "nativeLanguage"),
        dialectLanguage: getImportedStringField(data, "dialectLanguage"),
        age: data?.age != null && data.age !== "" ? String(data.age) : "",
        height: getImportedStringField(data, "height"),
        weight: getImportedStringField(data, "weight"),
        eyes: getImportedStringField(data, "eyes"),
        hair: getImportedStringField(data, "hair"),
        skin: getImportedStringField(data, "skin"),
        concept:
          getImportedStringField(data, "concept") || getImportedStringField(data, "magicalChoice"),
        traits,
      },
      health: {
        physical: { value: 0, max: 10 },
        stun: { value: 0, max: 10 },
      },
      biography: sr2BuildImportedBiography(data),
    },
  };
}

function normalizeSkillCatalog(skillCatalog = {}) {
  const entries = Object.entries(skillCatalog);
  return new Map(entries.map(([name, definition]) => [normalizeName(name), definition]));
}

function resolveImportedSkillDefinition(skill, skillCatalogMap) {
  const requestedName = getImportedStringField(skill, "name", "Name");
  const catalogDefinition = skillCatalogMap.get(normalizeName(requestedName));
  const concentrations = Array.isArray(catalogDefinition?.Concentrations)
    ? catalogDefinition.Concentrations
    : Array.isArray(skill?.Concentrations)
      ? skill.Concentrations
      : [];

  return {
    name: catalogDefinition?.name || requestedName,
    requiresConcentration: Boolean(
      catalogDefinition?.requiresConcentration ?? skill?.requiresConcentration,
    ),
    concentrations,
  };
}

function inferSkillAttribute(baseSkillName) {
  const normalized = normalizeName(baseSkillName);
  if (normalized.startsWith("etiquette:")) return "charisma";
  if (normalized.includes("theory")) return "intelligence";
  if (normalized.endsWith(" b/r")) return "intelligence";
  if (normalized.startsWith("language")) return "intelligence";
  return SKILL_ATTRIBUTE_OVERRIDES[normalized] || "intelligence";
}

function inferSkillCategory(skill, baseSkillName) {
  const importedCategory = normalizeName(skill?.type || skill?.category);
  if (importedCategory === "language") return "language";
  if (baseSkillName === "Language") return "language";
  if (importedCategory === "knowledge" || importedCategory === "active") return importedCategory;
  if (normalizeName(baseSkillName).startsWith("etiquette:")) return "active";
  return importedCategory || "active";
}

function describeSkillConcentrations(concentrations) {
  if (!Array.isArray(concentrations) || !concentrations.length) return "None";
  return concentrations
    .map((entry) => getImportedStringField(entry, "name", "Name"))
    .filter(Boolean)
    .join(", ");
}

function normalizeSelectedSkillVariants(skill) {
  const variants = [];
  const selected = Array.isArray(skill?.selectedConcentrations) ? skill.selectedConcentrations : [];

  if (!selected.length) {
    return [{ concentration: "", specialization: "" }];
  }

  for (const entry of selected) {
    if (typeof entry === "string") {
      variants.push({ concentration: entry.trim(), specialization: "" });
      continue;
    }

    if (!entry || typeof entry !== "object") continue;

    const concentration = getImportedStringField(entry, "name", "Name", "concentration");
    const specialization = getImportedStringField(
      entry,
      "specialization",
      "selectedSpecialization",
      "selectedSpecializations",
    );

    const nestedSpecializations = Array.isArray(entry?.selectedSpecializations)
      ? entry.selectedSpecializations
      : [];
    if (!nestedSpecializations.length) {
      variants.push({ concentration, specialization });
      continue;
    }

    for (const nestedSpecialization of nestedSpecializations) {
      const nestedValue =
        typeof nestedSpecialization === "string"
          ? nestedSpecialization.trim()
          : getImportedStringField(nestedSpecialization, "name", "Name", "specialization");
      variants.push({ concentration, specialization: nestedValue });
    }
  }

  return variants.length ? variants : [{ concentration: "", specialization: "" }];
}

function buildImportedSkillDocument(
  skill,
  baseSkillName,
  concentration,
  specialization,
  definition,
) {
  const allocatedRating = Number(skill?.rating) || 0;
  const computedRatings = sr2ComputeSkillRatingsFromAllocated({
    baseSkill: baseSkillName,
    concentration,
    specialization,
    allocatedRating,
  });
  const hasNameSuffix = concentration
    ? specialization
      ? ` (${concentration}) [${specialization}]`
      : ` (${concentration})`
    : "";
  const descriptionParts = [
    `Concentrations: ${describeSkillConcentrations(definition.concentrations)}`,
  ];
  if (skill?.notes) descriptionParts.push(String(skill.notes));

  return {
    name: `${baseSkillName}${hasNameSuffix}`,
    type: "skill",
    img: "systems/shadowrun2e/icons/skill.svg",
    system: {
      ...computedRatings,
      attribute: inferSkillAttribute(baseSkillName),
      baseSkill: baseSkillName,
      concentration,
      specialization,
      category: inferSkillCategory(skill, baseSkillName),
      requiresConcentration: definition.requiresConcentration,
      description: descriptionParts.join("\n"),
      quantity: 1,
      weight: 0,
      price: 0,
    },
  };
}

export function sr2BuildImportedSkillItems(skills, skillCatalog = {}) {
  if (!Array.isArray(skills) || !skills.length) return [];

  const skillCatalogMap = normalizeSkillCatalog(skillCatalog);
  const items = [];

  for (const importedSkill of skills) {
    const definition = resolveImportedSkillDefinition(importedSkill, skillCatalogMap);
    if (!definition.name) continue;

    const variants = normalizeSelectedSkillVariants(importedSkill);
    for (const variant of variants) {
      items.push(
        buildImportedSkillDocument(
          importedSkill,
          definition.name,
          variant.concentration,
          variant.specialization,
          definition,
        ),
      );
    }
  }

  return items;
}

export function sr2DetermineImportedWeaponType(categoryName) {
  const rangedCategories = ["Firearms", "Bow and crossbow", "Rockets and Missiles"];
  return rangedCategories.includes(categoryName) ? "ranged" : "melee";
}

export function sr2DetermineImportedRangeType(weaponName, categoryName) {
  const name = normalizeName(weaponName);

  if (name.includes("hold-out") && name.includes("light")) return "(LHOP)";
  if (name.includes("hold-out")) return "(HOPist)";
  if (name.includes("light pistol")) return "(LPist)";
  if (name.includes("machine pistol")) return "(MaPist)";
  if (name.includes("heavy pistol")) return "(HPist)";
  if (name.includes("very heavy pistol")) return "(VHP)";
  if (name.includes("medium pistol") || name.includes("pistol")) return "(MPist)";

  if (name.includes("assault rifle")) return "(AsRf)";
  if (name.includes("sniper rifle")) return "(SptR)";
  if (name.includes("heavy sniper")) return "(HSR)";
  if (name.includes("sniper")) return "(Snip)";
  if (name.includes("light carbine")) return "LCarb";
  if (name.includes("carbine")) return "(Carb)";
  if (name.includes("shotgun")) return "(ShtG)";
  if (name.includes("submachine") || name.includes("smg")) return "(SMG)";

  if (name.includes("heavy machine gun") || name.includes("hmg")) return "(HMG)";
  if (name.includes("medium machine gun") || name.includes("mmg")) return "(MMG)";
  if (name.includes("light machine gun") || name.includes("lmg")) return "(LMG)";
  if (name.includes("minigun")) return "(MinG)";

  if (name.includes("assault cannon")) return "(ACan)";
  if (name.includes("grenade launcher")) return "(GrLn)";
  if (name.includes("missile launcher")) return "(MisLn)";
  if (name.includes("mortar")) return "(Mrtr)";
  if (name.includes("flamethrower")) return "(FlThr)";

  if (name.includes("heavy crossbow")) return "(HCB)";
  if (name.includes("medium crossbow")) return "(MCB)";
  if (name.includes("light crossbow")) return "(LCB)";
  if (name.includes("crossbow")) return "(MCB)";
  if (name.includes("bow")) return "(Bow)";

  if (name.includes("shuriken")) return "(SH)";
  if (name.includes("throwing knife") || name.includes("thrown knife")) return "(TK)";
  if (name.includes("net")) return "(Net)";

  if (name.includes("taser")) return "(Tasr)";
  if (name.includes("spear gun")) return "(SpGn)";
  if (name.includes("blowgun")) return "(BG)";
  if (name.includes("slingshot")) return "(SS)";
  if (name.includes("sling")) return "(SL)";

  return WEAPON_RANGE_FALLBACKS[categoryName] || "(MPist)";
}

function inferImportedSpellCategory(value) {
  const normalized = normalizeName(value);
  return SPELL_CATEGORY_MAP[normalized] || "combat";
}

function inferImportedSpellType(value) {
  const normalized = normalizeName(value);
  return SPELL_TYPE_MAP[normalized] || "mana";
}

function inferImportedSpellDuration(value) {
  const normalized = normalizeName(value);
  return SPELL_DURATION_MAP[normalized] || "instant";
}

function buildImportedSpellDescription(spell) {
  const parts = [];
  const source = getImportedStringField(spell, "BookPage");
  if (source) parts.push(`Source: ${source}`);
  if (spell?.Fetish) parts.push("Requires Fetish");
  if (spell?.Exclusive) parts.push("Exclusive");
  return parts.join("\n");
}

export function sr2BuildImportedWeaponItem(weapon, fallbackCategory = "") {
  const category = getImportedStringField(weapon, "Type") || fallbackCategory || "Edged weapon";
  return {
    name: getImportedStringField(weapon, "Name"),
    type: "weapon",
    img: "icons/svg/sword.svg",
    system: {
      weaponType: sr2DetermineImportedWeaponType(category),
      concealability: sr2ParseImportedInteger(weapon?.Concealability, 0),
      damage: getImportedStringField(weapon, "Damage") || "1L",
      reach: sr2ParseImportedInteger(weapon?.Reach, 0),
      mode: getImportedStringField(weapon, "Mode") || "SS",
      ammo: {
        current: 0,
        max: sr2ParseImportedInteger(weapon?.Ammo, 0),
        type: getImportedStringField(weapon, "AmmoType"),
      },
      recoil: sr2ParseImportedInteger(weapon?.Recoil, 0),
      rangeType: sr2DetermineImportedRangeType(getImportedStringField(weapon, "Name"), category),
      equipped: false,
      description: getImportedStringField(weapon, "Notes"),
      quantity: sr2ParseImportedInteger(weapon?.Amount, 1),
      weight: sr2ParseImportedFloat(weapon?.Weight, 0),
      price: sr2ParseImportedInteger(weapon?.Cost, 0),
    },
  };
}

export function sr2BuildImportedArmorItem(gear) {
  return {
    name: getImportedStringField(gear, "Name"),
    type: "armor",
    img: "icons/svg/shield.svg",
    system: {
      rating: Math.max(
        sr2ParseImportedInteger(gear?.Ballistic, 0),
        sr2ParseImportedInteger(gear?.Impact, 0),
      ),
      concealability: sr2ParseImportedInteger(gear?.Concealability, 0),
      ballistic: sr2ParseImportedInteger(gear?.Ballistic, 0),
      impact: sr2ParseImportedInteger(gear?.Impact, 0),
      equipped: false,
      description: `Type: ${getImportedStringField(gear, "Type") || "Unknown"}`,
      quantity: sr2ParseImportedInteger(gear?.Amount, 1),
      weight: sr2ParseImportedFloat(gear?.Weight, 0),
      price: sr2ParseImportedInteger(gear?.Cost, 0),
    },
  };
}

export function sr2BuildImportedGearItem(gear) {
  const category = getImportedStringField(gear, "Type");
  const price = sr2ParseImportedInteger(gear?.Cost, 0);
  const name = getImportedStringField(gear, "Name");

  return {
    name,
    type: "gear",
    img: "icons/svg/item-bag.svg",
    system: {
      description: `Type: ${category || "Unknown"}\nConcealability: ${gear?.Concealability || "N/A"}`,
      quantity: sr2ParseImportedInteger(gear?.Amount, 1),
      weight: sr2ParseImportedFloat(gear?.Weight, 0),
      price,
      category,
      rating: 0,
      bondCost: sr2InferFocusBondCostForGearItem({
        category,
        name: normalizeImportedFocusName(name),
        price,
      }),
      equipped: false,
    },
  };
}

export function sr2InferImportedGearKind(gear) {
  const category = normalizeName(gear?.Type);
  const hasArmorRatings = isFiniteNumber(gear?.Ballistic) || isFiniteNumber(gear?.Impact);
  if (hasArmorRatings || category.includes("armor")) return "armor";

  const hasWeaponFields =
    Boolean(getImportedStringField(gear, "Damage")) ||
    Boolean(getImportedStringField(gear, "Mode")) ||
    Boolean(getImportedStringField(gear, "Ammo")) ||
    Boolean(getImportedStringField(gear, "AmmoType")) ||
    Boolean(getImportedStringField(gear, "Reach"));
  if (hasWeaponFields) return "weapon";

  if (
    category.includes("weapon") ||
    category.includes("firearm") ||
    category.includes("missile") ||
    category.includes("grenade")
  ) {
    return "weapon";
  }

  return "gear";
}

export function sr2BuildImportedItemData(data, options = {}) {
  const items = [];
  const skillCatalog = options.skillCatalog || {};

  items.push(...sr2BuildImportedSkillItems(data?.skills, skillCatalog));

  for (const gear of Array.isArray(data?.gear) ? data.gear : []) {
    const kind = sr2InferImportedGearKind(gear);
    if (kind === "armor") {
      items.push(sr2BuildImportedArmorItem(gear));
      continue;
    }
    if (kind === "weapon") {
      items.push(sr2BuildImportedWeaponItem(gear, getImportedStringField(gear, "Type")));
      continue;
    }
    items.push(sr2BuildImportedGearItem(gear));
  }

  for (const weapon of Array.isArray(data?.weapons) ? data.weapons : []) {
    if (!getImportedStringField(weapon, "Name")) continue;
    items.push(sr2BuildImportedWeaponItem(weapon, getImportedStringField(weapon, "Type")));
  }

  for (const spell of Array.isArray(data?.spells) ? data.spells : []) {
    const name = getImportedStringField(spell, "Name");
    if (!name) continue;
    const importedRange = getImportedStringField(spell, "Range");
    const importedTarget = getImportedStringField(spell, "Target");
    items.push({
      name,
      type: "spell",
      img: "systems/shadowrun2e/icons/spell.svg",
      system: {
        category: inferImportedSpellCategory(spell?.Class),
        type: inferImportedSpellType(spell?.Type),
        range: importedRange || (/\btouch\b/i.test(name) ? "Touch" : "LOS"),
        target: importedTarget,
        drain: getImportedStringField(spell, "Drain") || "2",
        damage: sr2InferCombatSpellDamageLevelFromName(name, { fallback: "M" }),
        duration: inferImportedSpellDuration(spell?.Duration),
        force: sr2ParseImportedInteger(spell?.Rating, 1),
        class: getImportedStringField(spell, "Class") || "C",
        description: buildImportedSpellDescription(spell),
        quantity: 1,
        weight: 0,
        price: 0,
      },
    });
  }

  for (const power of Array.isArray(data?.powers) ? data.powers : []) {
    const name = getImportedStringField(power, "Name");
    if (!name) continue;
    items.push({
      name,
      type: "adeptpower",
      img: "systems/shadowrun2e/icons/adeptpower.svg",
      system: {
        cost: sr2ParseImportedFloat(power?.Cost, 0),
        hasLevels: Boolean(power?.HasLevels),
        currentLevel: sr2ParseImportedInteger(power?.Level, 1),
        maxLevel: 6,
        mods: getImportedStringField(power, "Mods"),
        notes: getImportedStringField(power, "Notes"),
        bookPage: getImportedStringField(power, "BookPage"),
        description: getImportedStringField(power, "Description"),
        quantity: 1,
        weight: 0,
        price: 0,
      },
    });
  }

  return items;
}

export function sr2BuildImportedContactActorData(contact, { characterName, leaderId } = {}) {
  const name = getImportedStringField(contact, "Name");
  if (!name) return null;

  return {
    name,
    type: "contact",
    img: "icons/svg/mystery-man.svg",
    system: {
      attributes: {
        body: { value: 3, min: 1, max: 6 },
        quickness: { value: 3, min: 1, max: 6 },
        strength: { value: 3, min: 1, max: 6 },
        charisma: { value: 4, min: 1, max: 6 },
        intelligence: { value: 4, min: 1, max: 6 },
        willpower: { value: 4, min: 1, max: 6 },
        essence: { value: 6, min: 0, max: 6 },
        magic: { value: 0, min: 0, max: 6 },
        reaction: { value: 3, min: 1, max: 12 },
      },
      pools: {
        combat: { current: 0, max: 0 },
        spell: { current: 0, max: 0 },
        karma: { current: 0, total: 0 },
        hacking: { current: 0, max: 0 },
        control: { current: 0, max: 0 },
        task: { current: 0, max: 0 },
        astral: { current: 0, max: 0 },
      },
      initiative: { base: 3, dice: 1, current: 0 },
      magic: { awakened: false, physicalAdept: false, tradition: "" },
      resources: {
        nuyen: 0,
        lifestyle: "street",
        lifestyles: [{ type: "street", months: 1 }],
      },
      details: {
        metatype: "human",
        age: "",
        height: "",
        weight: "",
        eyes: "",
        hair: "",
        skin: "",
        concept: getImportedStringField(contact, "Archtype") || "Contact",
        leaderId: leaderId ?? "",
        traits: sr2GetRacialTraits("human"),
      },
      health: {
        physical: { value: 0, max: 10 },
        stun: { value: 0, max: 10 },
      },
      biography: [
        `Contact for: ${characterName || "Unknown Character"}`,
        `Archetype: ${getImportedStringField(contact, "Archtype") || "Unknown"}`,
        `Level: ${sr2ParseImportedInteger(contact?.Level, 1)}`,
        `General Info: ${getImportedStringField(contact, "GeneralInfo") || "No additional information"}`,
      ].join("\n"),
    },
  };
}
