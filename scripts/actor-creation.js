import {
  sr2InferCombatSpellDamageLevelFromName,
  sr2ComputeContactLevelSummary,
  sr2IsPriorityLetter,
} from "./sr2-rules.js";
import { sr2BuildAugmentationSystemData } from "./rules/augmentation-effects.js";

/* -------------------------------------------- */
/*  Actor Creation Helpers                      */
/* -------------------------------------------- */

const SR2_METAHUMAN_METATYPES = ["elf", "dwarf", "ork", "troll"];
export const SR2_METATYPE_VALUES = ["human", ...SR2_METAHUMAN_METATYPES];
const SR2_ALLOWED_METATYPES_BY_PRIORITY = {
  A: SR2_METATYPE_VALUES,
  B: ["human"],
  C: ["human"],
  D: ["human"],
  E: ["human"],
};

export function sr2GetSystemSetting(key, fallback) {
  try {
    return game?.settings?.get("shadowrun2e", key) ?? fallback;
  } catch (err) {
    return fallback;
  }
}

export function sr2GetAllowedMetatypesForPriority(priority) {
  if (!sr2IsPriorityLetter(priority)) return null;
  if (Boolean(sr2GetSystemSetting("moreMetahumans", false))) {
    // House rule: allow metahumans at priorities A–C (default SR2 is A only).
    if (["A", "B", "C"].includes(priority)) return SR2_METATYPE_VALUES;
    return ["human"];
  }
  return SR2_ALLOWED_METATYPES_BY_PRIORITY[priority] ?? null;
}

export function sr2AreContactLevelsEnabled() {
  return Boolean(sr2GetSystemSetting("contactLevels", false));
}

export function sr2AreBuddiesDisabled() {
  // Contact Levels house rule implies no Buddies.
  return sr2AreContactLevelsEnabled() || Boolean(sr2GetSystemSetting("disableBuddies", false));
}

export function sr2GetContactLevelsSummaryForLeader(leaderActor, pendingContact = null) {
  if (!sr2AreContactLevelsEnabled()) return null;
  if (!leaderActor || leaderActor.type !== "character") return null;

  const leaderId = leaderActor.id;
  if (!leaderId) return null;

  const charisma = Number(leaderActor.system?.attributes?.charisma?.value) || 0;
  const linkedContacts =
    globalThis.game?.actors?.filter(
      (a) => a.type === "contact" && a.system?.details?.leaderId === leaderId,
    ) ?? [];
  const contacts = linkedContacts.map((a) => ({
    id: a.id,
    // Treat new/pending contacts as "last" so we don't shift free-contact selection unexpectedly.
    sort: Number(a.sort) || 0,
    contactLevel: a.system?.details?.contactLevel,
  }));

  if (pendingContact && pendingContact.id) {
    const idx = contacts.findIndex((c) => c.id === pendingContact.id);
    const pending = {
      id: String(pendingContact.id),
      sort: Number.isFinite(Number(pendingContact.sort))
        ? Number(pendingContact.sort)
        : Number.MAX_SAFE_INTEGER,
      contactLevel: pendingContact.contactLevel,
    };
    if (idx >= 0) contacts[idx] = pending;
    else contacts.push(pending);
  }

  return sr2ComputeContactLevelSummary(contacts, charisma);
}

export async function sr2SyncFreeLanguageSkills(actor) {
  if (!actor || !["character", "contact", "follower"].includes(actor.type)) return;

  const nativeLanguage = actor.system?.details?.nativeLanguage || "English";
  const dialectLanguage = actor.system?.details?.dialectLanguage || "City Speak";
  const legacyLifestyle = actor.system?.resources?.lifestyle || "street";
  const lifestyles = actor.system?.resources?.lifestyles;
  const shouldHaveDialect =
    Array.isArray(lifestyles) && lifestyles.length
      ? lifestyles.some((l) => (l?.type || legacyLifestyle) === "street")
      : legacyLifestyle === "street";

  const intelligence = Number(actor.system?.attributes?.intelligence?.value) || 1;
  const nativeRating = Math.min(6, intelligence + 2);
  const dialectRating = Math.max(1, Math.floor(intelligence / 2));

  const existingLanguageSkills = actor.items.filter(
    (i) => i.type === "skill" && i.system?.baseSkill === "Language" && i.system?.isFree,
  );
  const nativeItem = existingLanguageSkills.find((i) => i.system?.freeLanguageType === "native");
  const dialectItem = existingLanguageSkills.find((i) => i.system?.freeLanguageType === "dialect");

  const updates = [];

  if (nativeItem) {
    const updateData = {};
    if (nativeItem.name !== nativeLanguage) updateData["name"] = nativeLanguage;
    if (nativeItem.system.allocatedRating !== nativeRating)
      updateData["system.allocatedRating"] = nativeRating;
    if (nativeItem.system.baseRating !== nativeRating)
      updateData["system.baseRating"] = nativeRating;
    if (nativeItem.system.concentrationRating !== 0) updateData["system.concentrationRating"] = 0;
    if (nativeItem.system.specializationRating !== 0) updateData["system.specializationRating"] = 0;
    if (Object.keys(updateData).length) updates.push({ _id: nativeItem.id, ...updateData });
  }

  if (dialectItem) {
    if (!shouldHaveDialect) {
      await dialectItem.delete({ sr2SyncingLanguages: true });
    } else {
      const updateData = {};
      if (dialectItem.name !== dialectLanguage) updateData["name"] = dialectLanguage;
      if (dialectItem.system.allocatedRating !== dialectRating)
        updateData["system.allocatedRating"] = dialectRating;
      if (dialectItem.system.baseRating !== dialectRating)
        updateData["system.baseRating"] = dialectRating;
      if (dialectItem.system.concentrationRating !== 0)
        updateData["system.concentrationRating"] = 0;
      if (dialectItem.system.specializationRating !== 0)
        updateData["system.specializationRating"] = 0;
      if (Object.keys(updateData).length) updates.push({ _id: dialectItem.id, ...updateData });
    }
  }

  if (updates.length) {
    await actor.updateEmbeddedDocuments("Item", updates, { sr2SyncingLanguages: true });
  }

  const createData = [];
  if (!nativeItem) {
    createData.push({
      name: nativeLanguage,
      type: "skill",
      system: {
        baseSkill: "Language",
        allocatedRating: nativeRating,
        baseRating: nativeRating,
        concentrationRating: 0,
        specializationRating: 0,
        concentration: "",
        specialization: "",
        category: "language",
        isFree: true,
        freeLanguageType: "native",
        requiresConcentration: false,
      },
    });
  }

  if (shouldHaveDialect && !dialectItem) {
    createData.push({
      name: dialectLanguage,
      type: "skill",
      system: {
        baseSkill: "Language",
        allocatedRating: dialectRating,
        baseRating: dialectRating,
        concentrationRating: 0,
        specializationRating: 0,
        concentration: "",
        specialization: "",
        category: "language",
        isFree: true,
        freeLanguageType: "dialect",
        requiresConcentration: false,
      },
    });
  }

  if (createData.length) {
    await actor.createEmbeddedDocuments("Item", createData, { sr2SyncingLanguages: true });
  }
}

export const SR2_FOLLOWER_ARCHETYPES = {
  // Source reference: `ARCHETYPES.md` (OCR dump from SR2 archetype section).
  // NOTE: We currently apply attributes + skills + magic flags + augmentations + spells. Gear is still TODO.

  bodyguard: {
    label: "Bodyguard",
    source: { book: "SR2", page: 49 },
    attributes: { body: 6, quickness: 6, strength: 5, charisma: 3, intelligence: 5, willpower: 5 },
    skills: [
      { baseSkill: "Car", baseRating: 6 },
      { baseSkill: "Firearms", baseRating: 6 },
      { baseSkill: "Negotiation", baseRating: 4 },
      { baseSkill: "Stealth", baseRating: 2 },
      { baseSkill: "Unarmed combat", baseRating: 6 },
    ],
    magic: { awakened: false, physicalAdept: false, tradition: "" },
    cyberware: [
      "Filter: Air 5",
      "Dermal Plating 3",
      "Skillwires 3",
      "Smartlink II",
      "Wired Reflexes 2",
    ],
  },
  combatMage: {
    label: "Combat Mage",
    source: { book: "SR2", page: 50 },
    attributes: {
      body: 2,
      quickness: 4,
      strength: 2,
      charisma: 2,
      intelligence: 5,
      willpower: 5,
      magic: 5,
    },
    skills: [
      { baseSkill: "Conjuring", baseRating: 3 },
      { baseSkill: "Etiquette: Corporate", baseRating: 2 },
      { baseSkill: "Firearms", baseRating: 3 },
      { baseSkill: "Magical theory", baseRating: 4 },
      { baseSkill: "Sorcery", baseRating: 6 },
      { baseSkill: "Unarmed combat", baseRating: 2 },
    ],
    magic: { awakened: true, physicalAdept: false, tradition: "hermetic" },
    cyberware: ["Eye Thermographic", "Eye Low-light"],
    spells: [
      { name: "Manaball", force: 4 },
      { name: "Mana Bolt", force: 4 },
      { name: "Power Bolt", force: 3 },
      { name: "Clairvoyance", force: 3 },
      { name: "Detect Enemies", force: 2 },
      { name: "Personal Combat Sense", force: 5 },
      { name: "Heal", force: 3 },
      { name: "Increase Reaction (+2)", force: 2 },
      { name: "Armor", force: 3 },
      { name: "Confusion", force: 3 },
    ],
  },
  decker: {
    label: "Decker",
    source: { book: "SR2", page: 51 },
    attributes: { body: 2, quickness: 4, strength: 3, charisma: 1, intelligence: 6, willpower: 4 },
    skills: [
      { baseSkill: "Bike", baseRating: 4 },
      { baseSkill: "Computer", baseRating: 6 },
      { baseSkill: "Computer theory", baseRating: 6 },
      { baseSkill: "Computer B/R", baseRating: 6 },
      { baseSkill: "Electronics", baseRating: 6 },
      { baseSkill: "Etiquette: Street", baseRating: 5 },
      { baseSkill: "Firearms", baseRating: 3 },
      { baseSkill: "Physical sciences", baseRating: 4 },
    ],
    magic: { awakened: false, physicalAdept: false, tradition: "" },
    cyberware: ["Datajack", "Headware Memory (30 Mp)"],
  },
  detective: {
    label: "Detective",
    source: { book: "SR2", page: 52 },
    attributes: { body: 4, quickness: 4, strength: 3, charisma: 3, intelligence: 6, willpower: 4 },
    skills: [
      { baseSkill: "Biotech", baseRating: 2 },
      { baseSkill: "Car", baseRating: 4 },
      { baseSkill: "Computer", baseRating: 4 },
      { baseSkill: "Etiquette: Corporate", baseRating: 3 },
      { baseSkill: "Etiquette: Street", baseRating: 4 },
      { baseSkill: "Firearms", baseRating: 6 },
      { baseSkill: "Negotiation", baseRating: 6 },
      { baseSkill: "Stealth", baseRating: 5 },
      { baseSkill: "Unarmed combat", baseRating: 6 },
    ],
    magic: { awakened: false, physicalAdept: false, tradition: "" },
  },
  dwarfMercenary: {
    label: "Dwarf Mercenary",
    source: { book: "SR2", page: 53 },
    metatype: "dwarf",
    attributes: { body: 6, quickness: 3, strength: 5, charisma: 2, intelligence: 3, willpower: 4 },
    skills: [
      { baseSkill: "Car", baseRating: 4 },
      { baseSkill: "Etiquette: Mercenary", baseRating: 2 },
      { baseSkill: "Firearms", baseRating: 6 },
      { baseSkill: "Gunnery", baseRating: 5 },
      { baseSkill: "Stealth", baseRating: 4 },
      { baseSkill: "Throwing", baseRating: 4 },
      { baseSkill: "Unarmed combat", baseRating: 5 },
    ],
    magic: { awakened: false, physicalAdept: false, tradition: "" },
    cyberware: ["Smartlink II"],
  },
  elvenDecker: {
    label: "Elven Decker",
    source: { book: "SR2", page: 54 },
    metatype: "elf",
    attributes: { body: 2, quickness: 5, strength: 2, charisma: 5, intelligence: 5, willpower: 4 },
    skills: [
      { baseSkill: "Bike", baseRating: 3 },
      { baseSkill: "Computer", baseRating: 5 },
      { baseSkill: "Computer theory", baseRating: 5 },
      { baseSkill: "Etiquette: Elven", baseRating: 2 },
      { baseSkill: "Etiquette: Street", baseRating: 2 },
      { baseSkill: "Firearms", baseRating: 3 },
    ],
    magic: { awakened: false, physicalAdept: false, tradition: "" },
    cyberware: ["Datajack", "Headware Memory (30 Mp)"],
  },
  formerCompanyMan: {
    label: "Former Company Man",
    source: { book: "SR2", page: 55 },
    attributes: { body: 4, quickness: 4, strength: 4, charisma: 2, intelligence: 3, willpower: 3 },
    skills: [
      { baseSkill: "Car", baseRating: 6 },
      { baseSkill: "Computer", baseRating: 3 },
      { baseSkill: "Demolitions", baseRating: 2 },
      { baseSkill: "Etiquette: Corporate", baseRating: 4 },
      { baseSkill: "Firearms", baseRating: 6 },
      { baseSkill: "Stealth", baseRating: 4 },
      { baseSkill: "Unarmed combat", baseRating: 6 },
    ],
    magic: { awakened: false, physicalAdept: false, tradition: "" },
    cyberware: ["Datajack", "Muscle Replac. 1", "Smartlink II", "Wired Reflexes 2"],
  },
  formerWageMage: {
    label: "Former Wage Mage",
    source: { book: "SR2", page: 56 },
    attributes: {
      body: 2,
      quickness: 3,
      strength: 1,
      charisma: 1,
      intelligence: 6,
      willpower: 4,
      magic: 6,
    },
    skills: [
      { baseSkill: "Conjuring", baseRating: 6 },
      { baseSkill: "Etiquette: Corporate", baseRating: 5 },
      { baseSkill: "Firearms", baseRating: 3 },
      { baseSkill: "Magical theory", baseRating: 6 },
      { baseSkill: "Negotiation", baseRating: 2 },
      { baseSkill: "Psychology", baseRating: 2 },
      { baseSkill: "Sorcery", baseRating: 6 },
    ],
    magic: { awakened: true, physicalAdept: false, tradition: "hermetic" },
    spells: [
      { name: "Fireball", force: 5 },
      { name: "Heal", force: 3 },
      { name: "Mana Bolt", force: 6 },
      { name: "Powerball", force: 6 },
      { name: "Sleep", force: 5 },
    ],
  },
  gangMember: {
    label: "Gang Member",
    source: { book: "SR2", page: 57 },
    attributes: { body: 5, quickness: 6, strength: 5, charisma: 6, intelligence: 4, willpower: 4 },
    skills: [
      { baseSkill: "Armed Combat", baseRating: 4 },
      { baseSkill: "Etiquette: Street", baseRating: 4 },
      { baseSkill: "Firearms", baseRating: 4 },
      { baseSkill: "Projectile Weapons", baseRating: 3 },
      { baseSkill: "Stealth", baseRating: 3 },
      { baseSkill: "Unarmed combat", baseRating: 3 },
    ],
    magic: { awakened: false, physicalAdept: false, tradition: "" },
    cyberware: ["Hand Razors", "Eye Low-light"],
  },
  mercenary: {
    label: "Mercenary",
    source: { book: "SR2", page: 58 },
    attributes: { body: 5, quickness: 4, strength: 5, charisma: 3, intelligence: 4, willpower: 3 },
    skills: [
      { baseSkill: "Armed Combat", baseRating: 6 },
      { baseSkill: "Car", baseRating: 4 },
      { baseSkill: "Demolitions", baseRating: 3 },
      { baseSkill: "Firearms", baseRating: 6 },
      { baseSkill: "Gunnery", baseRating: 4 },
      { baseSkill: "Military theory", baseRating: 2 },
      { baseSkill: "Rotor craft", baseRating: 3 },
      { baseSkill: "Stealth", baseRating: 3 },
      { baseSkill: "Throwing", baseRating: 3 },
      { baseSkill: "Unarmed combat", baseRating: 6 },
    ],
    magic: { awakened: false, physicalAdept: false, tradition: "" },
    cyberware: ["Eye Low-light", "Radio receiver", "Wired Reflexes 1"],
  },
  rigger: {
    label: "Rigger",
    source: { book: "SR2", page: 59 },
    attributes: { body: 5, quickness: 6, strength: 4, charisma: 4, intelligence: 6, willpower: 5 },
    skills: [
      { baseSkill: "Bike", baseRating: 4 },
      { baseSkill: "Car", baseRating: 5 },
      { baseSkill: "Computer", baseRating: 3 },
      { baseSkill: "Electronics", baseRating: 3 },
      { baseSkill: "Etiquette: Corporate", baseRating: 1 },
      { baseSkill: "Firearms", baseRating: 2 },
      { baseSkill: "Gunnery", baseRating: 4 },
      { baseSkill: "Ground vehicles B/R", baseRating: 2 },
    ],
    magic: { awakened: false, physicalAdept: false, tradition: "" },
    cyberware: [
      "Datajack",
      "Radio receiver",
      "Smartlink II",
      "Vehicle Ctrl Rig 2",
      "Eye Low-light",
      "Eye Flare comp.",
      "Eye Thermographic",
    ],
  },
  shaman: {
    label: "Shaman",
    source: { book: "SR2", page: 60 },
    attributes: {
      body: 3,
      quickness: 3,
      strength: 3,
      charisma: 5,
      intelligence: 4,
      willpower: 6,
      magic: 6,
    },
    skills: [
      { baseSkill: "Armed Combat", baseRating: 3 },
      { baseSkill: "Conjuring", baseRating: 6 },
      { baseSkill: "Etiquette: Tribal", baseRating: 4 },
      { baseSkill: "Magical theory", baseRating: 3 },
      { baseSkill: "Sorcery", baseRating: 5 },
      { baseSkill: "Stealth", baseRating: 3 },
    ],
    magic: { awakened: true, physicalAdept: false, tradition: "shamanic" },
    spells: [
      { name: "Mana Bolt", force: 4 },
      { name: "Powerball", force: 6 },
      { name: "Sleep", force: 5 },
    ],
  },
  streetShaman: {
    label: "Street Shaman",
    source: { book: "SR2", page: 63 },
    attributes: {
      body: 4,
      quickness: 3,
      strength: 2,
      charisma: 5,
      intelligence: 4,
      willpower: 6,
      magic: 6,
    },
    skills: [
      { baseSkill: "Conjuring", baseRating: 5 },
      { baseSkill: "Etiquette: Street", baseRating: 3 },
      { baseSkill: "Firearms", baseRating: 3 },
      { baseSkill: "Magical theory", baseRating: 5 },
      { baseSkill: "Sorcery", baseRating: 5 },
      { baseSkill: "Stealth", baseRating: 3 },
    ],
    magic: { awakened: true, physicalAdept: false, tradition: "shamanic" },
    spells: [
      { name: "Mana Bolt", force: 4 },
      { name: "Powerball", force: 6 },
      { name: "Sleep", force: 5 },
    ],
  },
  tribesman: {
    label: "Tribesman",
    source: { book: "SR2", page: 63 },
    attributes: { body: 5, quickness: 5, strength: 3, charisma: 2, intelligence: 3, willpower: 3 },
    skills: [
      { baseSkill: "Armed Combat", baseRating: 5 },
      { baseSkill: "Biology", baseRating: 3 },
      { baseSkill: "Biotech", baseRating: 3 },
      { baseSkill: "Etiquette: Tribal", baseRating: 4 },
      { baseSkill: "Projectile Weapons", baseRating: 6 },
      { baseSkill: "Stealth", baseRating: 6 },
      { baseSkill: "Horseback Riding", baseRating: 3 },
    ],
    magic: { awakened: false, physicalAdept: false, tradition: "" },
  },
};

export const SR2_CONTACT_ARCHETYPES = {
  // Source reference: `guide-raw.md` Contact templates section (SR2 p. 202+).
  //
  // NOTE: We only apply attributes + core skills + magic flags + cyberware. Many entries
  // list “Special Skills” in the book which are not currently represented in `data/skills.json`
  // and are therefore omitted here (to avoid creating unusable skill items).

  bountyHunter: {
    label: "Bounty Hunter",
    source: { book: "SR2", page: 202 },
    guide: { startLine: 34131 },
    attributes: { body: 6, quickness: 5, strength: 5, charisma: 1, intelligence: 4, willpower: 4 },
    skills: [
      { baseSkill: "Bike", baseRating: 5 },
      { baseSkill: "Car", baseRating: 5 },
      { baseSkill: "Computer", baseRating: 4 },
      { baseSkill: "Etiquette: Corporate", baseRating: 3 },
      { baseSkill: "Etiquette: Street", baseRating: 5 },
      { baseSkill: "Firearms", baseRating: 8 },
      { baseSkill: "Stealth", baseRating: 4 },
      { baseSkill: "Unarmed combat", baseRating: 6 },
    ],
    magic: { awakened: false, physicalAdept: false, tradition: "" },
    cyberware: ["Eye Thermographic", "Smartlink I", "Wired Reflexes 2"],
  },
  bartender: {
    label: "Bartender",
    source: { book: "SR2", page: 202 },
    guide: { startLine: 34196 },
    attributes: { body: 4, quickness: 3, strength: 4, charisma: 3, intelligence: 2, willpower: 2 },
    skills: [
      { baseSkill: "Etiquette: Street", baseRating: 4 },
      { baseSkill: "Firearms", baseRating: 3 },
      { baseSkill: "Unarmed combat", baseRating: 3 },
    ],
    magic: { awakened: false, physicalAdept: false, tradition: "" },
  },
  companyMan: {
    label: "Company Man",
    source: { book: "SR2", page: 203 },
    guide: { startLine: 34264 },
    attributes: { body: 6, quickness: 5, strength: 6, charisma: 2, intelligence: 4, willpower: 5 },
    skills: [
      { baseSkill: "Car", baseRating: 5 },
      { baseSkill: "Etiquette: Corporate", baseRating: 3 },
      { baseSkill: "Firearms", baseRating: 7 },
      { baseSkill: "Stealth", baseRating: 5 },
      { baseSkill: "Unarmed combat", baseRating: 6 },
    ],
    magic: { awakened: false, physicalAdept: false, tradition: "" },
    cyberware: ["Skillwires 5", "Wired Reflexes 1"],
  },
  cityOfficial: {
    label: "City Official",
    source: { book: "SR2", page: 203 },
    guide: { startLine: 34306, prependHeading: "CITY OFFICIAL" },
    attributes: { body: 2, quickness: 2, strength: 2, charisma: 5, intelligence: 3, willpower: 2 },
    skills: [
      { baseSkill: "Etiquette: Corporate", baseRating: 4 },
      { baseSkill: "Etiquette: Tribal", baseRating: 3 },
      { baseSkill: "Negotiation", baseRating: 4 },
    ],
    magic: { awakened: false, physicalAdept: false, tradition: "" },
  },
  corporateSecretary: {
    label: "Corporate Secretary",
    source: { book: "SR2", page: 204 },
    guide: { startLine: 34368 },
    attributes: { body: 2, quickness: 2, strength: 2, charisma: 4, intelligence: 4, willpower: 2 },
    skills: [
      { baseSkill: "Computer", baseRating: 3 },
      { baseSkill: "Etiquette: Corporate", baseRating: 4 },
    ],
    magic: { awakened: false, physicalAdept: false, tradition: "" },
    cyberware: ["Datajack"],
  },
  corporateSecurityGuard: {
    label: "Corporate Security Guard",
    source: { book: "SR2", page: 204 },
    guide: { startLine: 34425 },
    attributes: { body: 4, quickness: 3, strength: 3, charisma: 2, intelligence: 2, willpower: 2 },
    skills: [
      { baseSkill: "Etiquette: Corporate", baseRating: 2 },
      { baseSkill: "Firearms", baseRating: 3 },
      { baseSkill: "Interrogation", baseRating: 2 },
      { baseSkill: "Unarmed combat", baseRating: 3 },
    ],
    magic: { awakened: false, physicalAdept: false, tradition: "" },
  },
  dwarfTechnician: {
    label: "Dwarf Technician",
    source: { book: "SR2", page: 205 },
    guide: { startLine: 34514 },
    metatype: "dwarf",
    attributes: { body: 4, quickness: 2, strength: 3, charisma: 2, intelligence: 6, willpower: 4 },
    skills: [
      { baseSkill: "Computer theory", baseRating: 6 },
      { baseSkill: "Computer B/R", baseRating: 6 },
      { baseSkill: "Electronics B/R", baseRating: 9 },
      { baseSkill: "Electronics", baseRating: 6 },
      { baseSkill: "Etiquette: Corporate", baseRating: 3 },
    ],
    magic: { awakened: false, physicalAdept: false, tradition: "" },
    cyberware: ["Datajack"],
  },
  elvenHitman: {
    label: "Elven Hitman",
    source: { book: "SR2", page: 205 },
    guide: { startLine: 34581 },
    metatype: "elf",
    attributes: { body: 5, quickness: 6, strength: 5, charisma: 2, intelligence: 4, willpower: 4 },
    skills: [
      { baseSkill: "Bike", baseRating: 4 },
      { baseSkill: "Car", baseRating: 4 },
      { baseSkill: "Demolitions", baseRating: 4 },
      { baseSkill: "Etiquette: Corporate", baseRating: 3 },
      { baseSkill: "Etiquette: Street", baseRating: 3 },
      { baseSkill: "Firearms", baseRating: 8 },
      { baseSkill: "Unarmed combat", baseRating: 4 },
    ],
    magic: { awakened: false, physicalAdept: false, tradition: "" },
    cyberware: ["Smartlink I", "Wired Reflexes 2"],
  },
  gangBoss: {
    label: "Gang Boss",
    source: { book: "SR2", page: 206 },
    guide: { startLine: 34654 },
    attributes: { body: 3, quickness: 3, strength: 4, charisma: 4, intelligence: 4, willpower: 4 },
    skills: [
      { baseSkill: "Armed Combat", baseRating: 4 },
      { baseSkill: "Etiquette: Street", baseRating: 6 },
      { baseSkill: "Firearms", baseRating: 4 },
      { baseSkill: "Leadership", baseRating: 4 },
      { baseSkill: "Unarmed combat", baseRating: 2 },
    ],
    magic: { awakened: false, physicalAdept: false, tradition: "" },
  },
  fixer: {
    label: "Fixer",
    source: { book: "SR2", page: 206 },
    guide: { startLine: 34702 },
    attributes: { body: 2, quickness: 3, strength: 2, charisma: 3, intelligence: 5, willpower: 5 },
    skills: [
      { baseSkill: "Computer", baseRating: 3 },
      { baseSkill: "Electronics", baseRating: 3 },
      { baseSkill: "Etiquette: Street", baseRating: 5 },
      { baseSkill: "Firearms", baseRating: 3 },
      { baseSkill: "Negotiation", baseRating: 7 },
    ],
    magic: { awakened: false, physicalAdept: false, tradition: "" },
    cyberware: ["Datajack"],
  },
  humanisPoliclubMember: {
    label: "Humanis Policlub Member",
    source: { book: "SR2", page: 207 },
    guide: { startLine: 34813 },
    attributes: { body: 4, quickness: 4, strength: 4, charisma: 2, intelligence: 2, willpower: 4 },
    skills: [
      { baseSkill: "Bike", baseRating: 3 },
      { baseSkill: "Car", baseRating: 3 },
      { baseSkill: "Demolitions", baseRating: 4 },
      { baseSkill: "Etiquette: Street", baseRating: 3 },
      { baseSkill: "Firearms", baseRating: 4 },
    ],
    magic: { awakened: false, physicalAdept: false, tradition: "" },
  },
  mechanic: {
    label: "Mechanic",
    source: { book: "SR2", page: 207 },
    guide: { startLine: 34884 },
    attributes: { body: 2, quickness: 3, strength: 3, charisma: 2, intelligence: 6, willpower: 4 },
    skills: [
      { baseSkill: "Aircraft B/R", baseRating: 6 },
      { baseSkill: "Computer theory", baseRating: 6 },
      { baseSkill: "Computer", baseRating: 3 },
      { baseSkill: "Electronics B/R", baseRating: 5 },
      { baseSkill: "Electronics", baseRating: 3 },
      { baseSkill: "Ground vehicles B/R", baseRating: 8 },
    ],
    magic: { awakened: false, physicalAdept: false, tradition: "" },
  },
  mediaProducer: {
    label: "Media Producer",
    source: { book: "SR2", page: 208 },
    guide: { startLine: 34943 },
    attributes: { body: 2, quickness: 3, strength: 2, charisma: 5, intelligence: 4, willpower: 4 },
    skills: [
      { baseSkill: "Computer", baseRating: 3 },
      { baseSkill: "Etiquette: Corporate", baseRating: 4 },
      { baseSkill: "Etiquette: Media", baseRating: 4 },
      { baseSkill: "Etiquette: Street", baseRating: 4 },
      { baseSkill: "Negotiation", baseRating: 4 },
      { baseSkill: "Stealth", baseRating: 2 },
      { baseSkill: "Unarmed combat", baseRating: 2 },
    ],
    magic: { awakened: false, physicalAdept: false, tradition: "" },
  },
  metahumanRightsActivist: {
    label: "Metahuman Rights Activist",
    source: { book: "SR2", page: 208 },
    guide: { startLine: 35004 },
    attributes: { body: 2, quickness: 2, strength: 2, charisma: 2, intelligence: 2, willpower: 2 },
    skills: [
      { baseSkill: "Etiquette: Media", baseRating: 5 },
      { baseSkill: "Interrogation", baseRating: 3 },
      { baseSkill: "Leadership", baseRating: 3 },
      { baseSkill: "Negotiation", baseRating: 3 },
    ],
    magic: { awakened: false, physicalAdept: false, tradition: "" },
  },
  mrJohnson: {
    label: "Mr. Johnson",
    source: { book: "SR2", page: 209 },
    guide: { startLine: 35066 },
    attributes: { body: 2, quickness: 2, strength: 2, charisma: 4, intelligence: 6, willpower: 5 },
    skills: [
      { baseSkill: "Computer theory", baseRating: 5 },
      { baseSkill: "Etiquette: Corporate", baseRating: 8 },
      { baseSkill: "Negotiation", baseRating: 6 },
      { baseSkill: "Psychology", baseRating: 8 },
    ],
    magic: { awakened: false, physicalAdept: false, tradition: "" },
    cyberware: ["Datajack"],
  },
  squatter: {
    label: "Squatter",
    source: { book: "SR2", page: 209 },
    guide: { startLine: 35119 },
    attributes: { body: 2, quickness: 2, strength: 1, charisma: 1, intelligence: 2, willpower: 2 },
    skills: [{ baseSkill: "Etiquette: Street", baseRating: 3 }],
    magic: { awakened: false, physicalAdept: false, tradition: "" },
  },
  streetDoc: {
    label: "Street Doc",
    source: { book: "SR2", page: 210 },
    guide: { startLine: 35177 },
    attributes: { body: 2, quickness: 3, strength: 2, charisma: 2, intelligence: 4, willpower: 2 },
    skills: [
      { baseSkill: "Biotech", baseRating: 8 },
      { baseSkill: "Etiquette: Street", baseRating: 3 },
      { baseSkill: "Negotiation", baseRating: 4 },
    ],
    magic: { awakened: false, physicalAdept: false, tradition: "" },
    cyberware: ["Datajack"],
  },
  streetCop: {
    label: "Street Cop",
    source: { book: "SR2", page: 210 },
    guide: { startLine: 35232 },
    attributes: { body: 4, quickness: 4, strength: 4, charisma: 2, intelligence: 3, willpower: 3 },
    skills: [
      { baseSkill: "Armed Combat", baseRating: 2 },
      { baseSkill: "Etiquette: Corporate", baseRating: 2 },
      { baseSkill: "Etiquette: Street", baseRating: 4 },
      { baseSkill: "Firearms", baseRating: 3 },
      { baseSkill: "Unarmed combat", baseRating: 3 },
    ],
    magic: { awakened: false, physicalAdept: false, tradition: "" },
  },
  talismonger: {
    label: "Talismonger",
    source: { book: "SR2", page: 211 },
    guide: { startLine: 35339 },
    attributes: {
      body: 2,
      quickness: 3,
      strength: 3,
      charisma: 2,
      intelligence: 3,
      willpower: 4,
      magic: 6,
    },
    skills: [
      { baseSkill: "Etiquette: Street", baseRating: 4 },
      { baseSkill: "Magical theory", baseRating: 8 },
      { baseSkill: "Negotiation", baseRating: 6 },
      { baseSkill: "Sorcery", baseRating: 4 },
    ],
    magic: { awakened: true, physicalAdept: false, tradition: "" },
  },
  tribalChief: {
    label: "Tribal Chief",
    source: { book: "SR2", page: 211 },
    guide: { startLine: 35441 },
    attributes: { body: 3, quickness: 3, strength: 4, charisma: 4, intelligence: 4, willpower: 4 },
    skills: [
      { baseSkill: "Etiquette: Corporate", baseRating: 4 },
      { baseSkill: "Etiquette: Tribal", baseRating: 8 },
      { baseSkill: "Leadership", baseRating: 5 },
      { baseSkill: "Negotiation", baseRating: 4 },
      { baseSkill: "Projectile Weapons", baseRating: 4 },
      { baseSkill: "Psychology", baseRating: 5 },
      { baseSkill: "Stealth", baseRating: 5 },
    ],
    magic: { awakened: false, physicalAdept: false, tradition: "" },
  },
  trollBouncer: {
    label: "Troll Bouncer",
    source: { book: "SR2", page: 212 },
    guide: { startLine: 35506 },
    metatype: "troll",
    attributes: { body: 9, quickness: 3, strength: 9, charisma: 1, intelligence: 1, willpower: 2 },
    skills: [
      { baseSkill: "Armed Combat", baseRating: 3 },
      { baseSkill: "Etiquette: Street", baseRating: 2 },
      { baseSkill: "Firearms", baseRating: 2 },
      { baseSkill: "Unarmed combat", baseRating: 6 },
    ],
    magic: { awakened: false, physicalAdept: false, tradition: "" },
  },
  yakuzaBoss: {
    label: "Yakuza Boss",
    source: { book: "SR2", page: 212 },
    guide: { startLine: 35563 },
    attributes: { body: 3, quickness: 4, strength: 3, charisma: 5, intelligence: 6, willpower: 5 },
    skills: [
      { baseSkill: "Etiquette: Corporate", baseRating: 4 },
      { baseSkill: "Etiquette: Street", baseRating: 5 },
      { baseSkill: "Leadership", baseRating: 5 },
      { baseSkill: "Negotiation", baseRating: 6 },
    ],
    magic: { awakened: false, physicalAdept: false, tradition: "" },
    cyberware: ["Datajack", "Wired Reflexes 1"],
  },

  // Source reference: Shadowrun Contacts Insert (FASA 7902), compiled by Tom Dowd.
  // These entries are not present in `guide-raw.md`, so they won't auto-populate biographies.

  armorer: {
    label: "Armorer",
    source: { book: "SR2 Contacts Insert", page: 14 },
    attributes: { body: 3, quickness: 3, strength: 4, charisma: 4, intelligence: 7, willpower: 4 },
    skills: [
      { baseSkill: "Armed Combat B/R", baseRating: 5 },
      { baseSkill: "Computer B/R", baseRating: 4 },
      { baseSkill: "Computer", baseRating: 4 },
      { baseSkill: "Electronics B/R", baseRating: 3 },
      { baseSkill: "Electronics", baseRating: 4 },
      { baseSkill: "Firearms B/R", baseRating: 6 },
      { baseSkill: "Firearms", baseRating: 3 },
      { baseSkill: "Gunnery B/R", baseRating: 5 },
      { baseSkill: "Projectile Weapons B/R", baseRating: 4 },
      { baseSkill: "Throwing Weapons B/R", baseRating: 3 },
      { baseSkill: "Unarmed combat", baseRating: 2 },
    ],
    magic: { awakened: false, physicalAdept: false, tradition: "" },
    cyberware: ["Datajack", "Display Link", "Headware Memory (100 Mp)"],
  },
  clubHabitue: {
    label: "Club Habitué",
    source: { book: "SR2 Contacts Insert", page: 14 },
    attributes: { body: 3, quickness: 3, strength: 2, charisma: 4, intelligence: 2, willpower: 2 },
    skills: [
      { baseSkill: "Unarmed combat", baseRating: 2 },
      { baseSkill: "Club Rumormill", baseRating: 2, category: "special" },
      { baseSkill: "Day Job", baseRating: 3, category: "special" },
    ],
    magic: { awakened: false, physicalAdept: false, tradition: "" },
  },
  clubOwner: {
    label: "Club Owner",
    source: { book: "SR2 Contacts Insert", page: 15 },
    attributes: { body: 2, quickness: 2, strength: 2, charisma: 3, intelligence: 3, willpower: 3 },
    skills: [
      { baseSkill: "Etiquette: Media", baseRating: 4 },
      { baseSkill: "Etiquette: Street", baseRating: 4 },
      { baseSkill: "Negotiation", baseRating: 4 },
    ],
    magic: { awakened: false, physicalAdept: false, tradition: "" },
  },
  corporateDecker: {
    label: "Corporate Decker",
    source: { book: "SR2 Contacts Insert", page: 15 },
    attributes: { body: 2, quickness: 3, strength: 1, intelligence: 4, willpower: 3 },
    skills: [
      { baseSkill: "Computer", baseRating: 5 },
      { baseSkill: "Computer theory", baseRating: 4 },
      { baseSkill: "Etiquette: Corporate", baseRating: 2 },
    ],
    magic: { awakened: false, physicalAdept: false, tradition: "" },
    cyberware: ["Datajack"],
  },
  corporateOfficial: {
    label: "Corporate Official",
    source: { book: "SR2 Contacts Insert", page: 16 },
    attributes: { body: 2, quickness: 2, strength: 3, charisma: 3, intelligence: 5, willpower: 4 },
    skills: [
      { baseSkill: "Etiquette: Corporate", baseRating: 5 },
      { baseSkill: "Interrogation", baseRating: 4 },
      { baseSkill: "Negotiation", baseRating: 4 },
    ],
    magic: { awakened: false, physicalAdept: false, tradition: "" },
    cyberware: ["Datajack", "Headware Memory (100 Mp)"],
  },
  corporateRigger: {
    label: "Corporate Rigger",
    source: { book: "SR2 Contacts Insert", page: 16 },
    attributes: { body: 4, quickness: 6, strength: 3, charisma: 4, intelligence: 6, willpower: 4 },
    skills: [
      { baseSkill: "Car", baseRating: 6 },
      { baseSkill: "Computer", baseRating: 3 },
      { baseSkill: "Electronics", baseRating: 3 },
      { baseSkill: "Etiquette: Corporate", baseRating: 4 },
      { baseSkill: "Firearms", baseRating: 3 },
      { baseSkill: "Gunnery", baseRating: 3 },
      { baseSkill: "Rotor craft", baseRating: 5 },
    ],
    magic: { awakened: false, physicalAdept: false, tradition: "" },
    cyberware: [
      "Eye Low-light",
      "Eye Thermographic",
      "Eye Flare comp.",
      "Datajack",
      "Vehicle Control Rig 1",
    ],
  },
  corporateScientist: {
    label: "Corporate Scientist",
    source: { book: "SR2 Contacts Insert", page: 17 },
    attributes: { body: 2, quickness: 2, strength: 1, intelligence: 8, willpower: 5 },
    skills: [
      { baseSkill: "Appropriate Science Skill", baseRating: 7, category: "knowledge" },
      { baseSkill: "Computer", baseRating: 4 },
      { baseSkill: "Etiquette: Corporate", baseRating: 2 },
      { baseSkill: "Related Science Skill", baseRating: 6, category: "knowledge" },
    ],
    magic: { awakened: false, physicalAdept: false, tradition: "" },
    cyberware: ["Datajack", "Display Link", "Headware Memory (500 Mp)"],
  },
  corporateWageSlave: {
    label: "Corporate Wage Slave",
    source: { book: "SR2 Contacts Insert", page: 17 },
    attributes: { body: 2, quickness: 2, strength: 2, charisma: 2, intelligence: 2, willpower: 1 },
    skills: [
      { baseSkill: "Computer", baseRating: 2 },
      { baseSkill: "Etiquette: Corporate", baseRating: 2 },
      { baseSkill: "Being Ignored", baseRating: 6, category: "special" },
      { baseSkill: "Corporate Rumormill", baseRating: 2, category: "special" },
    ],
    magic: { awakened: false, physicalAdept: false, tradition: "" },
  },
  derNachtmachenPoliclubMember: {
    label: "Der Nachtmachen Policlub Member",
    source: { book: "SR2 Contacts Insert", page: 18 },
    attributes: { body: 5, quickness: 4, strength: 3, charisma: 2, intelligence: 2, willpower: 4 },
    skills: [
      { baseSkill: "Armed Combat", baseRating: 5 },
      { baseSkill: "Car", baseRating: 3 },
      { baseSkill: "Etiquette: Street", baseRating: 3 },
      { baseSkill: "Unarmed combat", baseRating: 4 },
      { baseSkill: "Local Politics", baseRating: 4, category: "special" },
      { baseSkill: "Rabble-Rousing", baseRating: 3, category: "special" },
    ],
    magic: { awakened: false, physicalAdept: false, tradition: "" },
  },
  dockWorker: {
    label: "Dock Worker",
    source: { book: "SR2 Contacts Insert", page: 18 },
    attributes: { body: 6, quickness: 3, strength: 6, charisma: 3, intelligence: 3, willpower: 4 },
    skills: [
      { baseSkill: "Athletics", baseRating: 3 },
      { baseSkill: "Car", baseRating: 3 },
      { baseSkill: "Etiquette: Corporate", baseRating: 2 },
      { baseSkill: "Negotiation", baseRating: 2 },
      { baseSkill: "Throwing Weapons", baseRating: 2 },
      { baseSkill: "Unarmed combat", baseRating: 2 },
    ],
    magic: { awakened: false, physicalAdept: false, tradition: "" },
  },
  elfPoserGangMember: {
    label: "Elf-Poser Gang Member",
    source: { book: "SR2 Contacts Insert", page: 19 },
    attributes: { body: 4, quickness: 4, strength: 2, charisma: 3, intelligence: 2, willpower: 2 },
    skills: [
      { baseSkill: "Armed Combat", baseRating: 2 },
      { baseSkill: "Bike", baseRating: 3 },
      { baseSkill: "Firearms", baseRating: 3 },
      { baseSkill: "Unarmed combat", baseRating: 2 },
      { baseSkill: "Elf Gang Speak", baseRating: 2, category: "special" },
    ],
    magic: { awakened: false, physicalAdept: false, tradition: "" },
  },
  fan: {
    label: "Fan",
    source: { book: "SR2 Contacts Insert", page: 19 },
    attributes: { body: 2, quickness: 2, strength: 2, charisma: 1, intelligence: 2, willpower: 1 },
    skills: [
      { baseSkill: "Etiquette (Varies)", baseRating: 2, category: "special" },
      { baseSkill: "Useful Skill (Idol)", baseRating: 5, category: "special" },
      { baseSkill: "History of Idol's Career", baseRating: 8, category: "special" },
    ],
    magic: { awakened: false, physicalAdept: false, tradition: "" },
    cyberware: ["Datajack"],
  },
  fireFighter: {
    label: "Fire Fighter",
    source: { book: "SR2 Contacts Insert", page: 20 },
    attributes: { body: 5, quickness: 6, strength: 5, charisma: 3, intelligence: 3, willpower: 5 },
    skills: [
      { baseSkill: "Athletics", baseRating: 3 },
      { baseSkill: "Biotech", baseRating: 3 },
      { baseSkill: "Car", baseRating: 2 },
      { baseSkill: "Fire Fighting", baseRating: 4, category: "special" },
    ],
    magic: { awakened: false, physicalAdept: false, tradition: "" },
  },
  governmentAgent: {
    label: "Government Agent",
    source: { book: "SR2 Contacts Insert", page: 20 },
    attributes: { body: 4, quickness: 6, strength: 4, charisma: 4, intelligence: 5, willpower: 4 },
    skills: [
      { baseSkill: "Car", baseRating: 3 },
      { baseSkill: "Electronics", baseRating: 3 },
      { baseSkill: "Etiquette: Agency", baseRating: 3 },
      { baseSkill: "Etiquette: Political", baseRating: 1 },
      { baseSkill: "Firearms", baseRating: 5 },
      { baseSkill: "Interrogation", baseRating: 3 },
      { baseSkill: "Rotor craft", baseRating: 2 },
      { baseSkill: "Unarmed combat", baseRating: 4 },
    ],
    magic: { awakened: false, physicalAdept: false, tradition: "" },
    cyberware: ["Datajack", "Headware Memory (50 Mp)", "Smartlink I", "Wired Reflexes 1"],
  },
  governmentOfficial: {
    label: "Government Official",
    source: { book: "SR2 Contacts Insert", page: 21 },
    attributes: { body: 2, quickness: 2, strength: 2, charisma: 6, intelligence: 6, willpower: 5 },
    skills: [
      { baseSkill: "Etiquette: Corporate", baseRating: 6 },
      { baseSkill: "Etiquette: Political", baseRating: 6 },
      { baseSkill: "Leadership", baseRating: 4 },
      { baseSkill: "Negotiation", baseRating: 5 },
      { baseSkill: "Economic Theory", baseRating: 2, category: "knowledge" },
      { baseSkill: "Politics", baseRating: 4, category: "knowledge" },
    ],
    magic: { awakened: false, physicalAdept: false, tradition: "" },
    cyberware: ["Datajack", "Headware Memory (20 Mp)"],
  },
  mafiaDon: {
    label: "Mafia Don",
    source: { book: "SR2 Contacts Insert", page: 21 },
    attributes: { body: 2, quickness: 2, strength: 2, charisma: 6, intelligence: 7, willpower: 6 },
    skills: [
      { baseSkill: "Etiquette: Family", baseRating: 5 },
      { baseSkill: "Interrogation", baseRating: 3 },
      { baseSkill: "Leadership", baseRating: 6 },
      { baseSkill: "Negotiation", baseRating: 6 },
      { baseSkill: "Local Politics", baseRating: 4, category: "special" },
      { baseSkill: "Neighborhood Knowledge", baseRating: 3, category: "special" },
    ],
    magic: { awakened: false, physicalAdept: false, tradition: "" },
  },
  mafiaSoldier: {
    label: "Mafia Soldier",
    source: { book: "SR2 Contacts Insert", page: 22 },
    attributes: { body: 5, quickness: 4, strength: 4, charisma: 3, intelligence: 4, willpower: 3 },
    skills: [
      { baseSkill: "Car", baseRating: 3 },
      { baseSkill: "Etiquette: Family", baseRating: 4 },
      { baseSkill: "Etiquette: Street", baseRating: 5 },
      { baseSkill: "Firearms", baseRating: 5 },
      { baseSkill: "Interrogation", baseRating: 3 },
      { baseSkill: "Unarmed combat", baseRating: 3 },
      { baseSkill: "Local Rumormill", baseRating: 4, category: "special" },
    ],
    magic: { awakened: false, physicalAdept: false, tradition: "" },
  },
  newsmanMediaEntrepreneur: {
    label: "Newsman/Media Entrepreneur",
    source: { book: "SR2 Contacts Insert", page: 22 },
    attributes: { body: 3, quickness: 3, strength: 2, charisma: 6, intelligence: 5, willpower: 4 },
    skills: [
      { baseSkill: "Computer", baseRating: 2 },
      { baseSkill: "Etiquette: Corporate", baseRating: 3 },
      { baseSkill: "Etiquette: Media", baseRating: 5 },
      { baseSkill: "Etiquette: Street", baseRating: 4 },
      { baseSkill: "Etiquette: Tribal", baseRating: 3 },
      { baseSkill: "Negotiation", baseRating: 4 },
      { baseSkill: "Stealth", baseRating: 3 },
      { baseSkill: "Unarmed combat", baseRating: 2 },
    ],
    magic: { awakened: false, physicalAdept: false, tradition: "" },
  },
  metroplexGuardsman: {
    label: "Metroplex Guardsman",
    source: { book: "SR2 Contacts Insert", page: 23 },
    attributes: { body: 4, quickness: 4, strength: 4, charisma: 2, intelligence: 3, willpower: 3 },
    skills: [
      { baseSkill: "Etiquette: Corporate", baseRating: 2 },
      { baseSkill: "Etiquette: Street", baseRating: 2 },
      { baseSkill: "Firearms", baseRating: 5 },
      { baseSkill: "Unarmed combat", baseRating: 4 },
    ],
    magic: { awakened: false, physicalAdept: false, tradition: "" },
  },
  orkRightsCommitteeMember: {
    label: "Ork Rights Committee Member (ORC)",
    source: { book: "SR2 Contacts Insert", page: 23 },
    attributes: { body: 7, quickness: 2, strength: 6, charisma: 2, intelligence: 4, willpower: 4 },
    skills: [
      { baseSkill: "Etiquette: Political", baseRating: 3 },
      { baseSkill: "Leadership", baseRating: 2 },
      { baseSkill: "Negotiation", baseRating: 3 },
      { baseSkill: "Sociology", baseRating: 3 },
      { baseSkill: "Unarmed combat", baseRating: 3 },
    ],
    magic: { awakened: false, physicalAdept: false, tradition: "" },
  },
  orkShaman: {
    label: "Ork Shaman",
    source: { book: "SR2 Contacts Insert", page: 24 },
    metatype: "ork",
    attributes: { body: 5, quickness: 2, strength: 5, charisma: 4, intelligence: 5, willpower: 6 },
    skills: [
      { baseSkill: "Armed Combat", baseRating: 3 },
      { baseSkill: "Conjuring", baseRating: 6 },
      { baseSkill: "Magical theory", baseRating: 4 },
      { baseSkill: "Sorcery", baseRating: 4 },
      { baseSkill: "Unarmed combat", baseRating: 3 },
    ],
    magic: { awakened: true, physicalAdept: false, tradition: "shamanic" },
  },
  paramedic: {
    label: "Paramedic",
    source: { book: "SR2 Contacts Insert", page: 24 },
    attributes: { body: 3, quickness: 4, strength: 3, charisma: 3, intelligence: 4, willpower: 3 },
    skills: [
      { baseSkill: "Biotech", baseRating: 5 },
      { baseSkill: "Car", baseRating: 3 },
      { baseSkill: "Cybertechnology", baseRating: 1 },
      { baseSkill: "Firearms", baseRating: 2 },
      { baseSkill: "Unarmed combat", baseRating: 2 },
    ],
    magic: { awakened: false, physicalAdept: false, tradition: "" },
  },
  pedestrian: {
    label: "Pedestrian",
    source: { book: "SR2 Contacts Insert", page: 25 },
    attributes: { body: 3, quickness: 4, strength: 3, charisma: 3, intelligence: 3, willpower: 3 },
    skills: [{ baseSkill: "Professional Skill", baseRating: 3, category: "special" }],
    magic: { awakened: false, physicalAdept: false, tradition: "" },
  },
  plainclothesCop: {
    label: "Plainclothes Cop",
    source: { book: "SR2 Contacts Insert", page: 25 },
    attributes: { body: 4, quickness: 5, strength: 3, charisma: 3, intelligence: 4, willpower: 5 },
    skills: [
      { baseSkill: "Car", baseRating: 3 },
      { baseSkill: "Etiquette: Law Enforcement", baseRating: 4 },
      { baseSkill: "Etiquette: Street", baseRating: 7 },
      { baseSkill: "Firearms", baseRating: 5 },
      { baseSkill: "Military Theory", baseRating: 2, category: "knowledge" },
      { baseSkill: "Psychology", baseRating: 4 },
      { baseSkill: "Sociology", baseRating: 3 },
      { baseSkill: "Unarmed combat", baseRating: 4 },
    ],
    magic: { awakened: false, physicalAdept: false, tradition: "" },
  },
  reporter: {
    label: "Reporter",
    source: { book: "SR2 Contacts Insert", page: 26 },
    attributes: { body: 3, quickness: 5, strength: 2, charisma: 5, intelligence: 6, willpower: 5 },
    skills: [
      { baseSkill: "Car", baseRating: 2 },
      { baseSkill: "Etiquette: Corporate", baseRating: 5 },
      { baseSkill: "Etiquette: Political", baseRating: 5 },
      { baseSkill: "Etiquette: Street", baseRating: 5 },
      { baseSkill: "Firearms", baseRating: 3 },
      { baseSkill: "Interrogation", baseRating: 6 },
      { baseSkill: "Negotiation", baseRating: 5 },
      { baseSkill: "Unarmed combat", baseRating: 3 },
      { baseSkill: "Nose for News", baseRating: 5, category: "special" },
    ],
    magic: { awakened: false, physicalAdept: false, tradition: "" },
    cyberware: ["Datajack", "Display Link", "Headware Memory (100 Mp)"],
  },
  sasquatchEntertainer: {
    label: "Sasquatch Entertainer",
    source: { book: "SR2 Contacts Insert", page: 26 },
    attributes: { body: 8, quickness: 3, strength: 7, charisma: 3, intelligence: 3, willpower: 2 },
    skills: [
      { baseSkill: "Unarmed combat", baseRating: 6 },
      { baseSkill: "Sound Mimicry", baseRating: 8, category: "special" },
    ],
    magic: { awakened: false, physicalAdept: false, tradition: "" },
  },
  simsenseStar: {
    label: "Simsense Star",
    source: { book: "SR2 Contacts Insert", page: 27 },
    attributes: { body: 3, quickness: 3, strength: 3, charisma: 6, intelligence: 3, willpower: 4 },
    skills: [
      { baseSkill: "Acting", baseRating: 2 },
      { baseSkill: "Athletics", baseRating: 4 },
      { baseSkill: "Bike", baseRating: 3 },
      { baseSkill: "Car", baseRating: 3 },
      { baseSkill: "Etiquette: Corporate", baseRating: 4 },
      { baseSkill: "Etiquette: Media", baseRating: 6 },
      { baseSkill: "Negotiation", baseRating: 6 },
    ],
    magic: { awakened: false, physicalAdept: false, tradition: "" },
    cyberware: ["Custom Simsense Rig", "Senselink", "Internal Transmitter"],
  },
  snitch: {
    label: "Snitch",
    source: { book: "SR2 Contacts Insert", page: 27 },
    attributes: { body: 2, quickness: 6, strength: 2, charisma: 1, intelligence: 3, willpower: 2 },
    skills: [
      { baseSkill: "Etiquette: Street", baseRating: 4 },
      { baseSkill: "Negotiation", baseRating: 4 },
      { baseSkill: "Unarmed combat", baseRating: 2 },
      { baseSkill: "Local Rumormill", baseRating: 6, category: "special" },
    ],
    magic: { awakened: false, physicalAdept: false, tradition: "" },
  },
  storeOwner: {
    label: "Store Owner",
    source: { book: "SR2 Contacts Insert", page: 28 },
    attributes: { body: 4, quickness: 2, strength: 3, charisma: 4, intelligence: 3, willpower: 5 },
    skills: [
      { baseSkill: "Firearms", baseRating: 3 },
      { baseSkill: "Negotiation", baseRating: 5 },
      { baseSkill: "Neighborhood Rumormill", baseRating: 5, category: "special" },
    ],
    magic: { awakened: false, physicalAdept: false, tradition: "" },
  },
  streetKid: {
    label: "Street Kid",
    source: { book: "SR2 Contacts Insert", page: 28 },
    attributes: { body: 2, quickness: 6, strength: 2, charisma: 4, intelligence: 4, willpower: 3 },
    skills: [
      { baseSkill: "Armed Combat", baseRating: 2 },
      { baseSkill: "Athletics", baseRating: 4 },
      { baseSkill: "Etiquette: Street", baseRating: 4 },
      { baseSkill: "Stealth", baseRating: 3 },
      { baseSkill: "Unarmed combat", baseRating: 2 },
      { baseSkill: "Street Rumormill", baseRating: 3, category: "special" },
    ],
    magic: { awakened: false, physicalAdept: false, tradition: "" },
  },
  taxiDriver: {
    label: "Taxi Driver",
    source: { book: "SR2 Contacts Insert", page: 29 },
    attributes: { body: 3, quickness: 3, strength: 3, charisma: 4, intelligence: 4, willpower: 5 },
    skills: [
      { baseSkill: "Car", baseRating: 5 },
      { baseSkill: "Etiquette: Street", baseRating: 2 },
      { baseSkill: "Firearms", baseRating: 3 },
      { baseSkill: "Unarmed combat", baseRating: 2 },
      { baseSkill: "Street Rumormill", baseRating: 3, category: "special" },
    ],
    magic: { awakened: false, physicalAdept: false, tradition: "" },
    cyberware: ["Datajack", "Display Link"],
  },
  technician: {
    label: "Technician",
    source: { book: "SR2 Contacts Insert", page: 29 },
    attributes: { body: 2, quickness: 3, strength: 3, charisma: 2, intelligence: 6, willpower: 4 },
    skills: [
      { baseSkill: "Biotech", baseRating: 3 },
      { baseSkill: "Computer", baseRating: 4 },
      { baseSkill: "Computer B/R", baseRating: 6 },
      { baseSkill: "Computer theory", baseRating: 5 },
      { baseSkill: "Cybertechnology", baseRating: 3 },
      { baseSkill: "Electronics", baseRating: 3 },
      { baseSkill: "Electronics B/R", baseRating: 3 },
    ],
    magic: { awakened: false, physicalAdept: false, tradition: "" },
    cyberware: ["Datajack"],
  },
  terrorist: {
    label: "Terrorist",
    source: { book: "SR2 Contacts Insert", page: 30 },
    attributes: { body: 3, quickness: 4, strength: 3, charisma: 4, intelligence: 4, willpower: 3 },
    skills: [
      { baseSkill: "Armed Combat", baseRating: 3 },
      { baseSkill: "Car", baseRating: 2 },
      { baseSkill: "Demolitions B/R", baseRating: 3 },
      { baseSkill: "Demolitions", baseRating: 3 },
      { baseSkill: "Firearms", baseRating: 6 },
      { baseSkill: "Psychology", baseRating: 4 },
      { baseSkill: "Unarmed combat", baseRating: 4 },
    ],
    magic: { awakened: false, physicalAdept: false, tradition: "" },
    cyberware: ["Smartlink I", "Wired Reflexes 1"],
  },
  wizKidMage: {
    label: "Wiz Kid Mage",
    source: { book: "SR2 Contacts Insert", page: 30 },
    attributes: {
      body: 2,
      quickness: 5,
      strength: 2,
      charisma: 2,
      intelligence: 3,
      willpower: 2,
      magic: 3,
    },
    skills: [
      { baseSkill: "Bike", baseRating: 2 },
      { baseSkill: "Conjuring", baseRating: 2 },
      { baseSkill: "Firearms", baseRating: 2 },
      { baseSkill: "Magical theory", baseRating: 1 },
      { baseSkill: "Sorcery", baseRating: 3 },
      { baseSkill: "Unarmed combat", baseRating: 2 },
    ],
    magic: { awakened: true, physicalAdept: false, tradition: "" },
    spells: [
      { name: "Fireball", force: 3 },
      { name: "Power Bolt", force: 4 },
      { name: "Heal", force: 3 },
      { name: "Chaos", force: 2 },
      { name: "Mask", force: 2 },
    ],
  },
};

export function sr2NormalizeCatalogName(name) {
  return String(name || "")
    .trim()
    .toLowerCase();
}

let sr2CyberwareCatalogIndex = null;
let sr2CyberwareCatalogIndexPromise = null;
let sr2BiowareCatalogIndex = null;
let sr2BiowareCatalogIndexPromise = null;

async function sr2LoadCyberwareCatalogIndex() {
  if (sr2CyberwareCatalogIndex) return sr2CyberwareCatalogIndex;
  if (!sr2CyberwareCatalogIndexPromise) {
    sr2CyberwareCatalogIndexPromise = fetch("/systems/shadowrun2e/data/cyberware.json")
      .then((response) => response.json())
      .then((data) => {
        const map = new Map();
        for (const [category, items] of Object.entries(data || {})) {
          for (const item of items || []) {
            const key = sr2NormalizeCatalogName(item?.Name);
            if (!key) continue;
            if (!map.has(key)) map.set(key, { category, item });
          }
        }
        sr2CyberwareCatalogIndex = map;
        return map;
      })
      .catch((error) => {
        sr2CyberwareCatalogIndexPromise = null;
        throw error;
      });
  }
  return sr2CyberwareCatalogIndexPromise;
}

async function sr2LoadBiowareCatalogIndex() {
  if (sr2BiowareCatalogIndex) return sr2BiowareCatalogIndex;
  if (!sr2BiowareCatalogIndexPromise) {
    sr2BiowareCatalogIndexPromise = fetch("/systems/shadowrun2e/data/bioware.json")
      .then((response) => response.json())
      .then((data) => {
        const map = new Map();
        for (const [category, items] of Object.entries(data || {})) {
          for (const item of items || []) {
            const key = sr2NormalizeCatalogName(item?.Name);
            if (!key) continue;
            if (!map.has(key)) map.set(key, { category, item });
          }
        }
        sr2BiowareCatalogIndex = map;
        return map;
      })
      .catch((error) => {
        sr2BiowareCatalogIndexPromise = null;
        throw error;
      });
  }
  return sr2BiowareCatalogIndexPromise;
}

let sr2SpellsCatalogIndex = null;
let sr2SpellsCatalogIndexPromise = null;

async function sr2LoadSpellsCatalogIndex() {
  if (sr2SpellsCatalogIndex) return sr2SpellsCatalogIndex;
  if (!sr2SpellsCatalogIndexPromise) {
    sr2SpellsCatalogIndexPromise = fetch("/systems/shadowrun2e/data/spells.json")
      .then((response) => response.json())
      .then((data) => {
        const map = new Map();
        for (const spell of data || []) {
          const key = sr2NormalizeCatalogName(spell?.Name);
          if (!key) continue;
          if (!map.has(key)) map.set(key, spell);
        }
        sr2SpellsCatalogIndex = map;
        return map;
      })
      .catch((error) => {
        sr2SpellsCatalogIndexPromise = null;
        throw error;
      });
  }
  return sr2SpellsCatalogIndexPromise;
}

export async function sr2BuildCyberwareItemData(name, { installed = true } = {}) {
  const trimmedName = String(name || "").trim();
  const fallback = {
    name: trimmedName || "Cyberware",
    type: "cyberware",
    img: "systems/shadowrun2e/icons/cyberware.svg",
    system: {
      ...sr2BuildAugmentationSystemData({ type: "cyberware", name: trimmedName, installed }),
      quantity: 1,
      weight: 0,
    },
  };

  if (!trimmedName) return fallback;

  try {
    const index = await sr2LoadCyberwareCatalogIndex();
    const entry = index?.get(sr2NormalizeCatalogName(trimmedName));
    if (!entry?.item) return fallback;

    const item = entry.item;
    const category = entry.category || "";
    return {
      name: String(item.Name || trimmedName).trim(),
      type: "cyberware",
      img: "systems/shadowrun2e/icons/cyberware.svg",
      system: {
        ...sr2BuildAugmentationSystemData({
          type: "cyberware",
          name: item.Name || trimmedName,
          category,
          bookPage: item.BookPage,
          cost: item.Cost,
          streetIndex: item.StreetIndex,
          essence: item.EssCost,
          mods: item.Mods,
          installed,
        }),
        quantity: 1,
        weight: 0,
      },
    };
  } catch (err) {
    console.warn("SR2E | Failed to load cyberware catalog for archetype item:", trimmedName, err);
    return fallback;
  }
}

export async function sr2BuildBiowareItemData(name, { installed = true } = {}) {
  const trimmedName = String(name || "").trim();
  const fallback = {
    name: trimmedName || "Bioware",
    type: "bioware",
    img: "systems/shadowrun2e/icons/bioware.svg",
    system: {
      ...sr2BuildAugmentationSystemData({ type: "bioware", name: trimmedName, installed }),
      quantity: 1,
      weight: 0,
    },
  };

  if (!trimmedName) return fallback;

  try {
    const index = await sr2LoadBiowareCatalogIndex();
    const entry = index?.get(sr2NormalizeCatalogName(trimmedName));
    if (!entry?.item) return fallback;

    const item = entry.item;
    const category = entry.category || "";
    return {
      name: String(item.Name || trimmedName).trim(),
      type: "bioware",
      img: "systems/shadowrun2e/icons/bioware.svg",
      system: {
        ...sr2BuildAugmentationSystemData({
          type: "bioware",
          name: item.Name || trimmedName,
          category,
          bookPage: item.BookPage,
          cost: item.Cost,
          streetIndex: item.StreetIndex,
          bioIndex: item.BioIndex,
          mods: item.Mods,
          installed,
        }),
        quantity: 1,
        weight: 0,
      },
    };
  } catch (err) {
    console.warn("SR2E | Failed to load bioware catalog for archetype item:", trimmedName, err);
    return fallback;
  }
}

export async function sr2BuildSpellItemData(name, { force = 1 } = {}) {
  const trimmedName = String(name || "").trim();
  const inferredRange = /\btouch\b/i.test(trimmedName) ? "Touch" : "LOS";
  const fallback = {
    name: trimmedName || "Spell",
    type: "spell",
    img: "systems/shadowrun2e/icons/spell.svg",
    system: {
      description: "",
      drain: "",
      type: "",
      duration: "",
      class: "",
      force: Math.max(1, Number(force) || 1),
      category: "c",
      range: inferredRange,
      target: "",
      damage: sr2InferCombatSpellDamageLevelFromName(trimmedName, { fallback: "M" }),
      quantity: 1,
      weight: 0,
      price: 0,
    },
  };

  if (!trimmedName) return fallback;

  try {
    const index = await sr2LoadSpellsCatalogIndex();
    const spell = index?.get(sr2NormalizeCatalogName(trimmedName));
    if (!spell) return fallback;

    return {
      name: String(spell.Name || trimmedName).trim(),
      type: "spell",
      img: "systems/shadowrun2e/icons/spell.svg",
      system: {
        description: `Source: ${spell.BookPage || ""}`.trim(),
        drain: spell.Drain || "",
        type: spell.Type || "",
        duration: spell.Duration || "",
        class: spell.Class || "",
        force: Math.max(1, Number(force) || 1),
        category: String(spell.Class || "c").toLowerCase(),
        range: String(spell.Range || "").trim() || inferredRange,
        target: String(spell.Target || "").trim(),
        damage:
          spell.Damage ||
          sr2InferCombatSpellDamageLevelFromName(spell.Name || trimmedName, { fallback: "M" }),
        quantity: 1,
        weight: 0,
        price: 0,
      },
    };
  } catch (err) {
    console.warn("SR2E | Failed to load spells catalog for archetype item:", trimmedName, err);
    return fallback;
  }
}

function sr2GetGuideRawCache() {
  const key = "__sr2eGuideRawCache";
  if (!globalThis[key]) {
    globalThis[key] = { lines: null, promise: null };
  }
  return globalThis[key];
}

async function sr2LoadGuideRawLines() {
  const cache = sr2GetGuideRawCache();
  if (cache.lines) return cache.lines;
  if (cache.promise) return cache.promise;

  cache.promise = (async () => {
    const systemId = globalThis.game?.system?.id || "shadowrun2e";
    const response = await fetch(`/systems/${systemId}/guide-raw.md`);
    if (!response.ok) throw new Error(`Failed to load guide-raw.md (${response.status})`);

    const text = await response.text();
    const normalized = String(text || "")
      .replace(/\r\n/g, "\n")
      .replace(/\r/g, "\n");
    const lines = normalized.split("\n");
    cache.lines = lines;
    return lines;
  })();

  try {
    return await cache.promise;
  } catch (err) {
    cache.promise = null;
    throw err;
  }
}

export function sr2ExtractContactStoryFromGuide(archetype, guideLines) {
  const startLine = Number(archetype?.guide?.startLine);
  if (!Number.isFinite(startLine) || startLine <= 0) return "";

  const startIndex = Math.max(0, Math.floor(startLine) - 1);
  const raw = [];

  for (let i = startIndex; i < guideLines.length; i++) {
    const line = String(guideLines[i] ?? "")
      .replace(/\f/g, "")
      .trimEnd();
    if (line.trim() === "ATTRIBUTES") break;
    raw.push(line);
  }

  while (raw.length && !raw[0].trim()) raw.shift();
  while (raw.length && !raw[raw.length - 1].trim()) raw.pop();

  const collapsed = [];
  let lastWasBlank = false;
  for (const line of raw) {
    const blank = !line.trim();
    if (blank) {
      if (lastWasBlank) continue;
      collapsed.push("");
      lastWasBlank = true;
      continue;
    }
    collapsed.push(line);
    lastWasBlank = false;
  }

  const heading = String(archetype?.guide?.prependHeading || "").trim();
  if (heading) {
    const headingUpper = heading.toUpperCase();
    const existingHeading = String(collapsed[0] || "")
      .trim()
      .toUpperCase();
    if (existingHeading !== headingUpper) {
      collapsed.unshift(heading);
    }
    if (collapsed.length > 1 && collapsed[1].trim() !== "") {
      collapsed.splice(1, 0, "");
    }
  }

  return collapsed.join("\n").trim();
}

export function sr2BuildContactBiographyFallback(archetype) {
  if (!archetype) return "";

  const label = String(archetype.label || "Contact").trim();
  const sourceBook = String(archetype.source?.book || "").trim();
  const sourcePage = String(archetype.source?.page || "").trim();
  const sourceParts = [];
  if (sourceBook) sourceParts.push(sourceBook);
  if (sourcePage) sourceParts.push(`p. ${sourcePage}`);

  const lines = [];
  lines.push(label.toUpperCase());

  if (sourceParts.length) {
    lines.push(`Source: ${sourceParts.join(", ")}`);
  }

  const skills = Array.isArray(archetype.skills)
    ? archetype.skills.map((skill) => String(skill?.baseSkill || "").trim()).filter(Boolean)
    : [];
  if (skills.length) {
    const limitedSkills = skills.slice(0, 10);
    const suffix = skills.length > limitedSkills.length ? ", ..." : "";
    lines.push(`Typical Skills: ${limitedSkills.join(", ")}${suffix}`);
  }

  const cyberware = Array.isArray(archetype.cyberware)
    ? archetype.cyberware.map((item) => String(item || "").trim()).filter(Boolean)
    : [];
  if (cyberware.length) {
    lines.push(`Typical Cyberware: ${cyberware.join(", ")}`);
  }

  const bioware = Array.isArray(archetype.bioware)
    ? archetype.bioware.map((item) => String(item || "").trim()).filter(Boolean)
    : [];
  if (bioware.length) {
    lines.push(`Typical Bioware: ${bioware.join(", ")}`);
  }

  const awakened = Boolean(archetype.magic?.awakened || archetype.magic?.physicalAdept);
  if (awakened) {
    const tradition = String(archetype.magic?.tradition || "").trim();
    lines.push(`Magical: Yes${tradition ? ` (${tradition})` : ""}`);
  }

  lines.push("");
  lines.push("Notes:");

  return lines.join("\n").trim();
}

export async function sr2BuildContactBiography({ archetype } = {}) {
  if (!archetype) return "";

  const fallbackBiography = sr2BuildContactBiographyFallback(archetype);

  try {
    const guideLines = await sr2LoadGuideRawLines();
    const story = sr2ExtractContactStoryFromGuide(archetype, guideLines);
    if (!story) return fallbackBiography;
    return `${story}\n\nNotes:`;
  } catch (err) {
    console.warn("SR2E | Failed to build contact biography from guide:", err);
    return fallbackBiography;
  }
}

export async function sr2RepairLegacySkillAllocatedRatings(actor) {
  if (!actor?.items?.size) return;

  const updates = [];

  for (const item of actor.items) {
    if (item.type !== "skill") continue;

    const allocated = Number(item.system?.allocatedRating);
    if (!Number.isFinite(allocated) || allocated > 0) continue;

    const base = Number(item.system?.baseRating) || 0;
    if (base <= 0) continue;

    const hasConcentration = Boolean(item.system?.concentration);
    const hasSpecialization = Boolean(item.system?.specialization);
    if (hasConcentration || hasSpecialization) continue;

    updates.push({ _id: item.id, "system.allocatedRating": base });
  }

  if (!updates.length) return;
  await actor.updateEmbeddedDocuments("Item", updates, { sr2SkipBudget: true });
}

export async function sr2RepairExistingConnectionActors() {
  if (!globalThis.game?.user?.isGM) return;

  const actors =
    globalThis.game?.actors?.filter((a) => a && ["contact", "follower"].includes(a.type)) ?? [];
  for (const actor of actors) {
    try {
      await sr2RepairLegacySkillAllocatedRatings(actor);
    } catch (err) {
      console.warn("SR2E | Failed to repair skill allocated ratings:", actor?.name, err);
    }

    if (actor.type !== "contact") continue;

    const existingBio = String(actor.system?.biography || "").trim();
    const shouldUpdateBio = !existingBio || existingBio.startsWith("Contact Template:");
    if (!shouldUpdateBio) continue;
    const archetypeKey = actor.system?.details?.archetype;
    const archetype = archetypeKey ? SR2_CONTACT_ARCHETYPES[archetypeKey] : null;
    if (!archetype) continue;

    try {
      const biography = await sr2BuildContactBiography({ archetype });
      const currentBio = String(actor.system?.biography || "").trim();
      if (biography && (!currentBio || currentBio.startsWith("Contact Template:"))) {
        await actor.update({ "system.biography": biography });
      }
    } catch (err) {
      console.warn("SR2E | Failed to repair contact biography:", actor?.name, err);
    }
  }
}
