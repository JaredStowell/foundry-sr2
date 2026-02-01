/**
 * Shadowrun 2nd Edition System for Foundry VTT
 */

// Import modules
import { SR2Actor } from "./actor/actor.js";
import { SR2ActorSheet } from "./actor/actor-sheet.js";
import { SR2CyberdeckSheet } from "./actor/cyberdeck-sheet.js";
import { SR2VehicleSheet } from "./actor/vehicle-sheet.js";
import { SR2SpiritSheet } from "./actor/spirit-sheet.js";
import { SR2Item } from "./item/item.js";
import { SR2ItemSheet } from "./item/item-sheet.js";
import { SR2ItemBrowser } from "./item-browser.js";
import { SR2GearPurchaseApp } from "./gear-purchase.js";
import { SR2DataImporter } from "./data-importer.js";
import { SR2CharacterImporter } from "./character-importer.js";
import { initializeQuickActions } from "./quick-actions.js";
import "./hotbar.js";
import {
    SR2_PRIORITY_TABLE,
    sr2ComputeContactLevelSummary,
    sr2ComputeForcePointsSpent,
    sr2ComputeCreationNuyenBudgetBreakdown,
    sr2ComputeItemNuyenSpent,
    sr2GetRacialAttributeBounds,
    sr2GetRacialModifiers,
    sr2GetRacialTraits,
    sr2InferFocusBondCostForGearItem,
    sr2IsPriorityLetter
} from "./sr2-rules.js";

/* -------------------------------------------- */
/*  Actor Creation Helpers                      */
/* -------------------------------------------- */

const SR2_METAHUMAN_METATYPES = ["elf", "dwarf", "ork", "troll"];
const SR2_METATYPE_VALUES = ["human", ...SR2_METAHUMAN_METATYPES];
const SR2_ALLOWED_METATYPES_BY_PRIORITY = {
    A: SR2_METATYPE_VALUES,
    B: ["human"],
    C: ["human"],
    D: ["human"],
    E: ["human"]
};

function sr2GetSystemSetting(key, fallback) {
    try {
        return game?.settings?.get("shadowrun2e", key) ?? fallback;
    } catch (err) {
        return fallback;
    }
}

function sr2GetAllowedMetatypesForPriority(priority) {
    if (!sr2IsPriorityLetter(priority)) return null;
    if (Boolean(sr2GetSystemSetting("moreMetahumans", false))) {
        // House rule: allow metahumans at priorities A–C (default SR2 is A only).
        if (["A", "B", "C"].includes(priority)) return SR2_METATYPE_VALUES;
        return ["human"];
    }
    return SR2_ALLOWED_METATYPES_BY_PRIORITY[priority] ?? null;
}

function sr2AreContactLevelsEnabled() {
    return Boolean(sr2GetSystemSetting("contactLevels", false));
}

function sr2AreBuddiesDisabled() {
    // Contact Levels house rule implies no Buddies.
    return sr2AreContactLevelsEnabled() || Boolean(sr2GetSystemSetting("disableBuddies", false));
}

function sr2GetContactLevelsSummaryForLeader(leaderActor, pendingContact = null) {
    if (!sr2AreContactLevelsEnabled()) return null;
    if (!leaderActor || leaderActor.type !== "character") return null;

    const leaderId = leaderActor.id;
    if (!leaderId) return null;

    const charisma = Number(leaderActor.system?.attributes?.charisma?.value) || 0;
    const linkedContacts = globalThis.game?.actors?.filter(a => a.type === "contact" && a.system?.details?.leaderId === leaderId) ?? [];
    const contacts = linkedContacts.map(a => ({
        id: a.id,
        // Treat new/pending contacts as "last" so we don't shift free-contact selection unexpectedly.
        sort: Number(a.sort) || 0,
        contactLevel: a.system?.details?.contactLevel
    }));

    if (pendingContact && pendingContact.id) {
        const idx = contacts.findIndex(c => c.id === pendingContact.id);
        const pending = {
            id: String(pendingContact.id),
            sort: Number.isFinite(Number(pendingContact.sort)) ? Number(pendingContact.sort) : Number.MAX_SAFE_INTEGER,
            contactLevel: pendingContact.contactLevel
        };
        if (idx >= 0) contacts[idx] = pending;
        else contacts.push(pending);
    }

    return sr2ComputeContactLevelSummary(contacts, charisma);
}

const SR2_FOLLOWER_ARCHETYPES = {
    // Source reference: `ARCHETYPES.md` (OCR dump from SR2 archetype section).
    // NOTE: We currently apply only attributes + skills + magic flags. Cyberware/bioware/spells/gear are TODO.

    bodyguard: {
        label: "Bodyguard",
        source: { book: "SR2", page: 49 },
        attributes: { body: 6, quickness: 6, strength: 5, charisma: 3, intelligence: 5, willpower: 5 },
        skills: [
            { baseSkill: "Car", baseRating: 6 },
            { baseSkill: "Firearms", baseRating: 6 },
            { baseSkill: "Negotiation", baseRating: 4 },
            { baseSkill: "Stealth", baseRating: 2 },
            { baseSkill: "Unarmed combat", baseRating: 6 }
        ],
        magic: { awakened: false, physicalAdept: false, tradition: "" },
        cyberware: [
            "Filter: Air 5",
            "Dermal Plating 3",
            "Skillwires 3",
            "Smartlink II",
            "Wired Reflexes 2"
        ]
    },
    combatMage: {
        label: "Combat Mage",
        source: { book: "SR2", page: 50 },
        attributes: { body: 2, quickness: 4, strength: 2, charisma: 2, intelligence: 5, willpower: 5, magic: 5 },
        skills: [
            { baseSkill: "Conjuring", baseRating: 3 },
            { baseSkill: "Etiquette: Corporate", baseRating: 2 },
            { baseSkill: "Firearms", baseRating: 3 },
            { baseSkill: "Magical theory", baseRating: 4 },
            { baseSkill: "Sorcery", baseRating: 6 },
            { baseSkill: "Unarmed combat", baseRating: 2 }
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
            { name: "Confusion", force: 3 }
        ]
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
            { baseSkill: "Physical sciences", baseRating: 4 }
        ],
        magic: { awakened: false, physicalAdept: false, tradition: "" },
        cyberware: ["Datajack", "Headware Memory (30 Mp)"]
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
            { baseSkill: "Unarmed combat", baseRating: 6 }
        ],
        magic: { awakened: false, physicalAdept: false, tradition: "" }
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
            { baseSkill: "Unarmed combat", baseRating: 5 }
        ],
        magic: { awakened: false, physicalAdept: false, tradition: "" },
        cyberware: ["Smartlink II"]
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
            { baseSkill: "Firearms", baseRating: 3 }
        ],
        magic: { awakened: false, physicalAdept: false, tradition: "" },
        cyberware: ["Datajack", "Headware Memory (30 Mp)"]
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
            { baseSkill: "Unarmed combat", baseRating: 6 }
        ],
        magic: { awakened: false, physicalAdept: false, tradition: "" },
        cyberware: ["Datajack", "Muscle Replac. 1", "Smartlink II", "Wired Reflexes 2"]
    },
    formerWageMage: {
        label: "Former Wage Mage",
        source: { book: "SR2", page: 56 },
        attributes: { body: 2, quickness: 3, strength: 1, charisma: 1, intelligence: 6, willpower: 4, magic: 6 },
        skills: [
            { baseSkill: "Conjuring", baseRating: 6 },
            { baseSkill: "Etiquette: Corporate", baseRating: 5 },
            { baseSkill: "Firearms", baseRating: 3 },
            { baseSkill: "Magical theory", baseRating: 6 },
            { baseSkill: "Negotiation", baseRating: 2 },
            { baseSkill: "Psychology", baseRating: 2 },
            { baseSkill: "Sorcery", baseRating: 6 }
        ],
        magic: { awakened: true, physicalAdept: false, tradition: "hermetic" },
        spells: [
            { name: "Fireball", force: 5 },
            { name: "Heal", force: 3 },
            { name: "Mana Bolt", force: 6 },
            { name: "Powerball", force: 6 },
            { name: "Sleep", force: 5 }
        ]
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
            { baseSkill: "Unarmed combat", baseRating: 3 }
        ],
        magic: { awakened: false, physicalAdept: false, tradition: "" },
        cyberware: ["Hand Razors", "Eye Low-light"]
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
            { baseSkill: "Unarmed combat", baseRating: 6 }
        ],
        magic: { awakened: false, physicalAdept: false, tradition: "" },
        cyberware: ["Eye Low-light", "Radio receiver", "Wired Reflexes 1"]
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
            { baseSkill: "Ground vehicles B/R", baseRating: 2 }
        ],
        magic: { awakened: false, physicalAdept: false, tradition: "" },
        cyberware: [
            "Datajack",
            "Radio receiver",
            "Smartlink II",
            "Vehicle Ctrl Rig 2",
            "Eye Low-light",
            "Eye Flare comp.",
            "Eye Thermographic"
        ]
    },
    shaman: {
        label: "Shaman",
        source: { book: "SR2", page: 60 },
        attributes: { body: 3, quickness: 3, strength: 3, charisma: 5, intelligence: 4, willpower: 6, magic: 6 },
        skills: [
            { baseSkill: "Armed Combat", baseRating: 3 },
            { baseSkill: "Conjuring", baseRating: 6 },
            { baseSkill: "Etiquette: Tribal", baseRating: 4 },
            { baseSkill: "Magical theory", baseRating: 3 },
            { baseSkill: "Sorcery", baseRating: 5 },
            { baseSkill: "Stealth", baseRating: 3 }
        ],
        magic: { awakened: true, physicalAdept: false, tradition: "shamanic" },
        spells: [
            { name: "Mana Bolt", force: 4 },
            { name: "Powerball", force: 6 },
            { name: "Sleep", force: 5 }
        ]
    },
    streetShaman: {
        label: "Street Shaman",
        source: { book: "SR2", page: 63 },
        attributes: { body: 4, quickness: 3, strength: 2, charisma: 5, intelligence: 4, willpower: 6, magic: 6 },
        skills: [
            { baseSkill: "Conjuring", baseRating: 5 },
            { baseSkill: "Etiquette: Street", baseRating: 3 },
            { baseSkill: "Firearms", baseRating: 3 },
            { baseSkill: "Magical theory", baseRating: 5 },
            { baseSkill: "Sorcery", baseRating: 5 },
            { baseSkill: "Stealth", baseRating: 3 }
        ],
        magic: { awakened: true, physicalAdept: false, tradition: "shamanic" },
        spells: [
            { name: "Mana Bolt", force: 4 },
            { name: "Powerball", force: 6 },
            { name: "Sleep", force: 5 }
        ]
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
            { baseSkill: "Horseback Riding", baseRating: 3 }
        ],
        magic: { awakened: false, physicalAdept: false, tradition: "" }
    }
};

const SR2_CONTACT_ARCHETYPES = {
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
            { baseSkill: "Unarmed combat", baseRating: 6 }
        ],
        magic: { awakened: false, physicalAdept: false, tradition: "" },
        cyberware: [
            "Eye Thermographic",
            "Smartlink I",
            "Wired Reflexes 2"
        ]
    },
    bartender: {
        label: "Bartender",
        source: { book: "SR2", page: 202 },
        guide: { startLine: 34196 },
        attributes: { body: 4, quickness: 3, strength: 4, charisma: 3, intelligence: 2, willpower: 2 },
        skills: [
            { baseSkill: "Etiquette: Street", baseRating: 4 },
            { baseSkill: "Firearms", baseRating: 3 },
            { baseSkill: "Unarmed combat", baseRating: 3 }
        ],
        magic: { awakened: false, physicalAdept: false, tradition: "" }
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
            { baseSkill: "Unarmed combat", baseRating: 6 }
        ],
        magic: { awakened: false, physicalAdept: false, tradition: "" },
        cyberware: [
            "Skillwires 5",
            "Wired Reflexes 1"
        ]
    },
    cityOfficial: {
        label: "City Official",
        source: { book: "SR2", page: 203 },
        guide: { startLine: 34306, prependHeading: "CITY OFFICIAL" },
        attributes: { body: 2, quickness: 2, strength: 2, charisma: 5, intelligence: 3, willpower: 2 },
        skills: [
            { baseSkill: "Etiquette: Corporate", baseRating: 4 },
            { baseSkill: "Etiquette: Tribal", baseRating: 3 },
            { baseSkill: "Negotiation", baseRating: 4 }
        ],
        magic: { awakened: false, physicalAdept: false, tradition: "" }
    },
    corporateSecretary: {
        label: "Corporate Secretary",
        source: { book: "SR2", page: 204 },
        guide: { startLine: 34368 },
        attributes: { body: 2, quickness: 2, strength: 2, charisma: 4, intelligence: 4, willpower: 2 },
        skills: [
            { baseSkill: "Computer", baseRating: 3 },
            { baseSkill: "Etiquette: Corporate", baseRating: 4 }
        ],
        magic: { awakened: false, physicalAdept: false, tradition: "" },
        cyberware: [
            "Datajack"
        ]
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
            { baseSkill: "Unarmed combat", baseRating: 3 }
        ],
        magic: { awakened: false, physicalAdept: false, tradition: "" }
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
            { baseSkill: "Etiquette: Corporate", baseRating: 3 }
        ],
        magic: { awakened: false, physicalAdept: false, tradition: "" },
        cyberware: [
            "Datajack"
        ]
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
            { baseSkill: "Unarmed combat", baseRating: 4 }
        ],
        magic: { awakened: false, physicalAdept: false, tradition: "" },
        cyberware: [
            "Smartlink I",
            "Wired Reflexes 2"
        ]
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
            { baseSkill: "Unarmed combat", baseRating: 2 }
        ],
        magic: { awakened: false, physicalAdept: false, tradition: "" }
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
            { baseSkill: "Negotiation", baseRating: 7 }
        ],
        magic: { awakened: false, physicalAdept: false, tradition: "" },
        cyberware: [
            "Datajack"
        ]
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
            { baseSkill: "Firearms", baseRating: 4 }
        ],
        magic: { awakened: false, physicalAdept: false, tradition: "" }
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
            { baseSkill: "Ground vehicles B/R", baseRating: 8 }
        ],
        magic: { awakened: false, physicalAdept: false, tradition: "" }
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
            { baseSkill: "Unarmed combat", baseRating: 2 }
        ],
        magic: { awakened: false, physicalAdept: false, tradition: "" }
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
            { baseSkill: "Negotiation", baseRating: 3 }
        ],
        magic: { awakened: false, physicalAdept: false, tradition: "" }
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
            { baseSkill: "Psychology", baseRating: 8 }
        ],
        magic: { awakened: false, physicalAdept: false, tradition: "" },
        cyberware: [
            "Datajack"
        ]
    },
    squatter: {
        label: "Squatter",
        source: { book: "SR2", page: 209 },
        guide: { startLine: 35119 },
        attributes: { body: 2, quickness: 2, strength: 1, charisma: 1, intelligence: 2, willpower: 2 },
        skills: [
            { baseSkill: "Etiquette: Street", baseRating: 3 }
        ],
        magic: { awakened: false, physicalAdept: false, tradition: "" }
    },
    streetDoc: {
        label: "Street Doc",
        source: { book: "SR2", page: 210 },
        guide: { startLine: 35177 },
        attributes: { body: 2, quickness: 3, strength: 2, charisma: 2, intelligence: 4, willpower: 2 },
        skills: [
            { baseSkill: "Biotech", baseRating: 8 },
            { baseSkill: "Etiquette: Street", baseRating: 3 },
            { baseSkill: "Negotiation", baseRating: 4 }
        ],
        magic: { awakened: false, physicalAdept: false, tradition: "" },
        cyberware: [
            "Datajack"
        ]
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
            { baseSkill: "Unarmed combat", baseRating: 3 }
        ],
        magic: { awakened: false, physicalAdept: false, tradition: "" }
    },
    talismonger: {
        label: "Talismonger",
        source: { book: "SR2", page: 211 },
        guide: { startLine: 35339 },
        attributes: { body: 2, quickness: 3, strength: 3, charisma: 2, intelligence: 3, willpower: 4, magic: 6 },
        skills: [
            { baseSkill: "Etiquette: Street", baseRating: 4 },
            { baseSkill: "Magical theory", baseRating: 8 },
            { baseSkill: "Negotiation", baseRating: 6 },
            { baseSkill: "Sorcery", baseRating: 4 }
        ],
        magic: { awakened: true, physicalAdept: false, tradition: "" }
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
            { baseSkill: "Stealth", baseRating: 5 }
        ],
        magic: { awakened: false, physicalAdept: false, tradition: "" }
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
            { baseSkill: "Unarmed combat", baseRating: 6 }
        ],
        magic: { awakened: false, physicalAdept: false, tradition: "" }
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
            { baseSkill: "Negotiation", baseRating: 6 }
        ],
        magic: { awakened: false, physicalAdept: false, tradition: "" },
        cyberware: [
            "Datajack",
            "Wired Reflexes 1"
        ]
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
            { baseSkill: "Unarmed combat", baseRating: 2 }
        ],
        magic: { awakened: false, physicalAdept: false, tradition: "" },
        cyberware: [
            "Datajack",
            "Display Link",
            "Headware Memory (100 Mp)"
        ]
    },
    clubHabitue: {
        label: "Club Habitué",
        source: { book: "SR2 Contacts Insert", page: 14 },
        attributes: { body: 3, quickness: 3, strength: 2, charisma: 4, intelligence: 2, willpower: 2 },
        skills: [
            { baseSkill: "Unarmed combat", baseRating: 2 },
            { baseSkill: "Club Rumormill", baseRating: 2, category: "special" },
            { baseSkill: "Day Job", baseRating: 3, category: "special" }
        ],
        magic: { awakened: false, physicalAdept: false, tradition: "" }
    },
    clubOwner: {
        label: "Club Owner",
        source: { book: "SR2 Contacts Insert", page: 15 },
        attributes: { body: 2, quickness: 2, strength: 2, charisma: 3, intelligence: 3, willpower: 3 },
        skills: [
            { baseSkill: "Etiquette: Media", baseRating: 4 },
            { baseSkill: "Etiquette: Street", baseRating: 4 },
            { baseSkill: "Negotiation", baseRating: 4 }
        ],
        magic: { awakened: false, physicalAdept: false, tradition: "" }
    },
    corporateDecker: {
        label: "Corporate Decker",
        source: { book: "SR2 Contacts Insert", page: 15 },
        attributes: { body: 2, quickness: 3, strength: 1, intelligence: 4, willpower: 3 },
        skills: [
            { baseSkill: "Computer", baseRating: 5 },
            { baseSkill: "Computer theory", baseRating: 4 },
            { baseSkill: "Etiquette: Corporate", baseRating: 2 }
        ],
        magic: { awakened: false, physicalAdept: false, tradition: "" },
        cyberware: [
            "Datajack"
        ]
    },
    corporateOfficial: {
        label: "Corporate Official",
        source: { book: "SR2 Contacts Insert", page: 16 },
        attributes: { body: 2, quickness: 2, strength: 3, charisma: 3, intelligence: 5, willpower: 4 },
        skills: [
            { baseSkill: "Etiquette: Corporate", baseRating: 5 },
            { baseSkill: "Interrogation", baseRating: 4 },
            { baseSkill: "Negotiation", baseRating: 4 }
        ],
        magic: { awakened: false, physicalAdept: false, tradition: "" },
        cyberware: [
            "Datajack",
            "Headware Memory (100 Mp)"
        ]
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
            { baseSkill: "Rotor craft", baseRating: 5 }
        ],
        magic: { awakened: false, physicalAdept: false, tradition: "" },
        cyberware: [
            "Eye Low-light",
            "Eye Thermographic",
            "Eye Flare comp.",
            "Datajack",
            "Vehicle Control Rig 1"
        ]
    },
    corporateScientist: {
        label: "Corporate Scientist",
        source: { book: "SR2 Contacts Insert", page: 17 },
        attributes: { body: 2, quickness: 2, strength: 1, intelligence: 8, willpower: 5 },
        skills: [
            { baseSkill: "Appropriate Science Skill", baseRating: 7, category: "knowledge" },
            { baseSkill: "Computer", baseRating: 4 },
            { baseSkill: "Etiquette: Corporate", baseRating: 2 },
            { baseSkill: "Related Science Skill", baseRating: 6, category: "knowledge" }
        ],
        magic: { awakened: false, physicalAdept: false, tradition: "" },
        cyberware: [
            "Datajack",
            "Display Link",
            "Headware Memory (500 Mp)"
        ]
    },
    corporateWageSlave: {
        label: "Corporate Wage Slave",
        source: { book: "SR2 Contacts Insert", page: 17 },
        attributes: { body: 2, quickness: 2, strength: 2, charisma: 2, intelligence: 2, willpower: 1 },
        skills: [
            { baseSkill: "Computer", baseRating: 2 },
            { baseSkill: "Etiquette: Corporate", baseRating: 2 },
            { baseSkill: "Being Ignored", baseRating: 6, category: "special" },
            { baseSkill: "Corporate Rumormill", baseRating: 2, category: "special" }
        ],
        magic: { awakened: false, physicalAdept: false, tradition: "" }
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
            { baseSkill: "Rabble-Rousing", baseRating: 3, category: "special" }
        ],
        magic: { awakened: false, physicalAdept: false, tradition: "" }
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
            { baseSkill: "Unarmed combat", baseRating: 2 }
        ],
        magic: { awakened: false, physicalAdept: false, tradition: "" }
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
            { baseSkill: "Elf Gang Speak", baseRating: 2, category: "special" }
        ],
        magic: { awakened: false, physicalAdept: false, tradition: "" }
    },
    fan: {
        label: "Fan",
        source: { book: "SR2 Contacts Insert", page: 19 },
        attributes: { body: 2, quickness: 2, strength: 2, charisma: 1, intelligence: 2, willpower: 1 },
        skills: [
            { baseSkill: "Etiquette (Varies)", baseRating: 2, category: "special" },
            { baseSkill: "Useful Skill (Idol)", baseRating: 5, category: "special" },
            { baseSkill: "History of Idol's Career", baseRating: 8, category: "special" }
        ],
        magic: { awakened: false, physicalAdept: false, tradition: "" },
        cyberware: [
            "Datajack"
        ]
    },
    fireFighter: {
        label: "Fire Fighter",
        source: { book: "SR2 Contacts Insert", page: 20 },
        attributes: { body: 5, quickness: 6, strength: 5, charisma: 3, intelligence: 3, willpower: 5 },
        skills: [
            { baseSkill: "Athletics", baseRating: 3 },
            { baseSkill: "Biotech", baseRating: 3 },
            { baseSkill: "Car", baseRating: 2 },
            { baseSkill: "Fire Fighting", baseRating: 4, category: "special" }
        ],
        magic: { awakened: false, physicalAdept: false, tradition: "" }
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
            { baseSkill: "Unarmed combat", baseRating: 4 }
        ],
        magic: { awakened: false, physicalAdept: false, tradition: "" },
        cyberware: [
            "Datajack",
            "Headware Memory (50 Mp)",
            "Smartlink I",
            "Wired Reflexes 1"
        ]
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
            { baseSkill: "Politics", baseRating: 4, category: "knowledge" }
        ],
        magic: { awakened: false, physicalAdept: false, tradition: "" },
        cyberware: [
            "Datajack",
            "Headware Memory (20 Mp)"
        ]
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
            { baseSkill: "Neighborhood Knowledge", baseRating: 3, category: "special" }
        ],
        magic: { awakened: false, physicalAdept: false, tradition: "" }
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
            { baseSkill: "Local Rumormill", baseRating: 4, category: "special" }
        ],
        magic: { awakened: false, physicalAdept: false, tradition: "" }
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
            { baseSkill: "Unarmed combat", baseRating: 2 }
        ],
        magic: { awakened: false, physicalAdept: false, tradition: "" }
    },
    metroplexGuardsman: {
        label: "Metroplex Guardsman",
        source: { book: "SR2 Contacts Insert", page: 23 },
        attributes: { body: 4, quickness: 4, strength: 4, charisma: 2, intelligence: 3, willpower: 3 },
        skills: [
            { baseSkill: "Etiquette: Corporate", baseRating: 2 },
            { baseSkill: "Etiquette: Street", baseRating: 2 },
            { baseSkill: "Firearms", baseRating: 5 },
            { baseSkill: "Unarmed combat", baseRating: 4 }
        ],
        magic: { awakened: false, physicalAdept: false, tradition: "" }
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
            { baseSkill: "Unarmed combat", baseRating: 3 }
        ],
        magic: { awakened: false, physicalAdept: false, tradition: "" }
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
            { baseSkill: "Unarmed combat", baseRating: 3 }
        ],
        magic: { awakened: true, physicalAdept: false, tradition: "shamanic" }
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
            { baseSkill: "Unarmed combat", baseRating: 2 }
        ],
        magic: { awakened: false, physicalAdept: false, tradition: "" }
    },
    pedestrian: {
        label: "Pedestrian",
        source: { book: "SR2 Contacts Insert", page: 25 },
        attributes: { body: 3, quickness: 4, strength: 3, charisma: 3, intelligence: 3, willpower: 3 },
        skills: [
            { baseSkill: "Professional Skill", baseRating: 3, category: "special" }
        ],
        magic: { awakened: false, physicalAdept: false, tradition: "" }
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
            { baseSkill: "Unarmed combat", baseRating: 4 }
        ],
        magic: { awakened: false, physicalAdept: false, tradition: "" }
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
            { baseSkill: "Nose for News", baseRating: 5, category: "special" }
        ],
        magic: { awakened: false, physicalAdept: false, tradition: "" },
        cyberware: [
            "Datajack",
            "Display Link",
            "Headware Memory (100 Mp)"
        ]
    },
    sasquatchEntertainer: {
        label: "Sasquatch Entertainer",
        source: { book: "SR2 Contacts Insert", page: 26 },
        attributes: { body: 8, quickness: 3, strength: 7, charisma: 3, intelligence: 3, willpower: 2 },
        skills: [
            { baseSkill: "Unarmed combat", baseRating: 6 },
            { baseSkill: "Sound Mimicry", baseRating: 8, category: "special" }
        ],
        magic: { awakened: false, physicalAdept: false, tradition: "" }
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
            { baseSkill: "Negotiation", baseRating: 6 }
        ],
        magic: { awakened: false, physicalAdept: false, tradition: "" },
        cyberware: [
            "Custom Simsense Rig",
            "Senselink",
            "Internal Transmitter"
        ]
    },
    snitch: {
        label: "Snitch",
        source: { book: "SR2 Contacts Insert", page: 27 },
        attributes: { body: 2, quickness: 6, strength: 2, charisma: 1, intelligence: 3, willpower: 2 },
        skills: [
            { baseSkill: "Etiquette: Street", baseRating: 4 },
            { baseSkill: "Negotiation", baseRating: 4 },
            { baseSkill: "Unarmed combat", baseRating: 2 },
            { baseSkill: "Local Rumormill", baseRating: 6, category: "special" }
        ],
        magic: { awakened: false, physicalAdept: false, tradition: "" }
    },
    storeOwner: {
        label: "Store Owner",
        source: { book: "SR2 Contacts Insert", page: 28 },
        attributes: { body: 4, quickness: 2, strength: 3, charisma: 4, intelligence: 3, willpower: 5 },
        skills: [
            { baseSkill: "Firearms", baseRating: 3 },
            { baseSkill: "Negotiation", baseRating: 5 },
            { baseSkill: "Neighborhood Rumormill", baseRating: 5, category: "special" }
        ],
        magic: { awakened: false, physicalAdept: false, tradition: "" }
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
            { baseSkill: "Street Rumormill", baseRating: 3, category: "special" }
        ],
        magic: { awakened: false, physicalAdept: false, tradition: "" }
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
            { baseSkill: "Street Rumormill", baseRating: 3, category: "special" }
        ],
        magic: { awakened: false, physicalAdept: false, tradition: "" },
        cyberware: [
            "Datajack",
            "Display Link"
        ]
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
            { baseSkill: "Electronics B/R", baseRating: 3 }
        ],
        magic: { awakened: false, physicalAdept: false, tradition: "" },
        cyberware: [
            "Datajack"
        ]
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
            { baseSkill: "Unarmed combat", baseRating: 4 }
        ],
        magic: { awakened: false, physicalAdept: false, tradition: "" },
        cyberware: [
            "Smartlink I",
            "Wired Reflexes 1"
        ]
    },
    wizKidMage: {
        label: "Wiz Kid Mage",
        source: { book: "SR2 Contacts Insert", page: 30 },
        attributes: { body: 2, quickness: 5, strength: 2, charisma: 2, intelligence: 3, willpower: 2, magic: 3 },
        skills: [
            { baseSkill: "Bike", baseRating: 2 },
            { baseSkill: "Conjuring", baseRating: 2 },
            { baseSkill: "Firearms", baseRating: 2 },
            { baseSkill: "Magical theory", baseRating: 1 },
            { baseSkill: "Sorcery", baseRating: 3 },
            { baseSkill: "Unarmed combat", baseRating: 2 }
        ],
        magic: { awakened: true, physicalAdept: false, tradition: "" },
        spells: [
            { name: "Fireball", force: 3 },
            { name: "Power Bolt", force: 4 },
            { name: "Heal", force: 3 },
            { name: "Chaos", force: 2 },
            { name: "Mask", force: 2 }
        ]
    }
};

function sr2NormalizeCatalogName(name) {
    return String(name || "").trim().toLowerCase();
}

let sr2CyberwareCatalogIndex = null;
let sr2CyberwareCatalogIndexPromise = null;

async function sr2LoadCyberwareCatalogIndex() {
    if (sr2CyberwareCatalogIndex) return sr2CyberwareCatalogIndex;
    if (!sr2CyberwareCatalogIndexPromise) {
        sr2CyberwareCatalogIndexPromise = fetch('/systems/shadowrun2e/data/cyberware.json')
            .then(response => response.json())
            .then((data) => {
                const map = new Map();
                for (const [category, items] of Object.entries(data || {})) {
                    for (const item of (items || [])) {
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

let sr2SpellsCatalogIndex = null;
let sr2SpellsCatalogIndexPromise = null;

async function sr2LoadSpellsCatalogIndex() {
    if (sr2SpellsCatalogIndex) return sr2SpellsCatalogIndex;
    if (!sr2SpellsCatalogIndexPromise) {
        sr2SpellsCatalogIndexPromise = fetch('/systems/shadowrun2e/data/spells.json')
            .then(response => response.json())
            .then((data) => {
                const map = new Map();
                for (const spell of (data || [])) {
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

async function sr2BuildCyberwareItemData(name, { installed = true } = {}) {
    const trimmedName = String(name || "").trim();
    const fallback = {
        name: trimmedName || "Cyberware",
        type: "cyberware",
        img: "systems/shadowrun2e/icons/cyberware.svg",
        system: {
            description: "",
            essence: 0,
            cost: 0,
            streetIndex: 1.0,
            mods: "",
            installed,
            rating: 0,
            bodyLocation: "",
            quantity: 1,
            weight: 0,
            price: 0
        }
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
                description: `Category: ${category}\nSource: ${item.BookPage || ""}`.trim(),
                essence: item.EssCost ?? 0,
                cost: item.Cost ?? 0,
                streetIndex: item.StreetIndex ?? 1.0,
                mods: item.Mods || "",
                installed,
                rating: 0,
                bodyLocation: String(category || "").toLowerCase(),
                quantity: 1,
                weight: 0,
                price: item.Cost ?? 0
            }
        };
    } catch (err) {
        console.warn("SR2E | Failed to load cyberware catalog for archetype item:", trimmedName, err);
        return fallback;
    }
}

async function sr2BuildSpellItemData(name, { force = 1 } = {}) {
    const trimmedName = String(name || "").trim();
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
            range: "touch",
            damage: "M",
            quantity: 1,
            weight: 0,
            price: 0
        }
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
                range: "touch",
                damage: "M",
                quantity: 1,
                weight: 0,
                price: 0
            }
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
        const normalized = String(text || "").replace(/\r\n/g, "\n").replace(/\r/g, "\n");
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

function sr2ExtractContactStoryFromGuide(archetype, guideLines) {
    const startLine = Number(archetype?.guide?.startLine);
    if (!Number.isFinite(startLine) || startLine <= 0) return "";

    const startIndex = Math.max(0, Math.floor(startLine) - 1);
    const raw = [];

    for (let i = startIndex; i < guideLines.length; i++) {
        const line = String(guideLines[i] ?? "").replace(/\f/g, "").trimEnd();
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
        const existingHeading = String(collapsed[0] || "").trim().toUpperCase();
        if (existingHeading !== headingUpper) {
            collapsed.unshift(heading);
        }
        if (collapsed.length > 1 && collapsed[1].trim() !== "") {
            collapsed.splice(1, 0, "");
        }
    }

    return collapsed.join("\n").trim();
}

async function sr2BuildContactBiography({ archetype } = {}) {
    if (!archetype) return "";

    try {
        const guideLines = await sr2LoadGuideRawLines();
        const story = sr2ExtractContactStoryFromGuide(archetype, guideLines);
        if (!story) return "";
        return `${story}\n\nNotes:`;
    } catch (err) {
        console.warn("SR2E | Failed to build contact biography from guide:", err);
        return "";
    }
}

async function sr2RepairLegacySkillAllocatedRatings(actor) {
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

async function sr2RepairExistingConnectionActors() {
    if (!globalThis.game?.user?.isGM) return;

    const actors = globalThis.game?.actors?.filter(a => a && ["contact", "follower"].includes(a.type)) ?? [];
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

/* -------------------------------------------- */
/*  Foundry VTT Initialization                  */
/* -------------------------------------------- */

Hooks.once("init", async function () {
    console.log("Shadowrun 2E | Initializing Shadowrun 2nd Edition System");

    // Suppress V1 Application deprecation warnings for now
    // TODO: Migrate to ApplicationV2 in future version
    const originalWarn = console.warn;
    console.warn = function (...args) {
        const message = args.join(' ');
        if (message.includes('V1 Application framework is deprecated')) {
            return; // Suppress this specific warning
        }
        originalWarn.apply(console, args);
    };

    // Debug: Log that we're starting initialization
    console.log("SR2E | Registering document classes...");

    // Assign custom classes and constants
    CONFIG.Actor.documentClass = SR2Actor;
    CONFIG.Item.documentClass = SR2Item;

    // Ensure core Combat "Roll All" initiative works.
    if (CONFIG.Combat) {
        if (!CONFIG.Combat.initiative) CONFIG.Combat.initiative = {};
        CONFIG.Combat.initiative.formula = "(@actor.initiative.dice)d6 + @actor.initiative.base";
        CONFIG.Combat.initiative.decimals = 0;
    }

    // Set default actor icons
    CONFIG.Actor.typeIcons = {
        character: "icons/svg/mystery-man.svg",
        contact: "icons/svg/mystery-man.svg",
        follower: "icons/svg/mystery-man.svg",
        cyberdeck: "systems/shadowrun2e/icons/cyberdeck.png",
        vehicle: "systems/shadowrun2e/icons/vehicle.png",
        spirit: "systems/shadowrun2e/icons/spirit.png"
    };

    // Register sheet application classes
    console.log("SR2E | Unregistering core sheets...");
    Actors.unregisterSheet("core", ActorSheet);

    console.log("SR2E | Registering SR2ActorSheet...", SR2ActorSheet);
    Actors.registerSheet("shadowrun2e", SR2ActorSheet, {
        types: ["character", "contact", "follower"],
        makeDefault: true,
        label: "Shadowrun 2E Character Sheet"
    });

    console.log("SR2E | Registering SR2CyberdeckSheet...", SR2CyberdeckSheet);
    Actors.registerSheet("shadowrun2e", SR2CyberdeckSheet, {
        types: ["cyberdeck"],
        makeDefault: true,
        label: "Shadowrun 2E Cyberdeck Sheet"
    });

    console.log("SR2E | Registering SR2VehicleSheet...", SR2VehicleSheet);
    Actors.registerSheet("shadowrun2e", SR2VehicleSheet, {
        types: ["vehicle"],
        makeDefault: true,
        label: "Shadowrun 2E Vehicle Sheet"
    });

    console.log("SR2E | Registering SR2SpiritSheet...", SR2SpiritSheet);
    Actors.registerSheet("shadowrun2e", SR2SpiritSheet, {
        types: ["spirit"],
        makeDefault: true,
        label: "Shadowrun 2E Spirit Sheet"
    });

    // Force set as default for character actors
    if (!CONFIG.Actor.sheetClasses.character) {
        CONFIG.Actor.sheetClasses.character = {};
    }
    CONFIG.Actor.sheetClasses.character["shadowrun2e.SR2ActorSheet"] = {
        id: "shadowrun2e.SR2ActorSheet",
        cls: SR2ActorSheet,
        default: true
    };

    // Force set as default for contact actors
    if (!CONFIG.Actor.sheetClasses.contact) {
        CONFIG.Actor.sheetClasses.contact = {};
    }
    CONFIG.Actor.sheetClasses.contact["shadowrun2e.SR2ActorSheet"] = {
        id: "shadowrun2e.SR2ActorSheet",
        cls: SR2ActorSheet,
        default: true
    };

    // Force set as default for follower actors
    if (!CONFIG.Actor.sheetClasses.follower) {
        CONFIG.Actor.sheetClasses.follower = {};
    }
    CONFIG.Actor.sheetClasses.follower["shadowrun2e.SR2ActorSheet"] = {
        id: "shadowrun2e.SR2ActorSheet",
        cls: SR2ActorSheet,
        default: true
    };

    // Force set as default for cyberdeck actors
    if (!CONFIG.Actor.sheetClasses.cyberdeck) {
        CONFIG.Actor.sheetClasses.cyberdeck = {};
    }
    CONFIG.Actor.sheetClasses.cyberdeck["shadowrun2e.SR2CyberdeckSheet"] = {
        id: "shadowrun2e.SR2CyberdeckSheet",
        cls: SR2CyberdeckSheet,
        default: true
    };

    // Force set as default for vehicle actors
    if (!CONFIG.Actor.sheetClasses.vehicle) {
        CONFIG.Actor.sheetClasses.vehicle = {};
    }
    CONFIG.Actor.sheetClasses.vehicle["shadowrun2e.SR2VehicleSheet"] = {
        id: "shadowrun2e.SR2VehicleSheet",
        cls: SR2VehicleSheet,
        default: true
    };

    // Force set as default for spirit actors
    if (!CONFIG.Actor.sheetClasses.spirit) {
        CONFIG.Actor.sheetClasses.spirit = {};
    }
    CONFIG.Actor.sheetClasses.spirit["shadowrun2e.SR2SpiritSheet"] = {
        id: "shadowrun2e.SR2SpiritSheet",
        cls: SR2SpiritSheet,
        default: true
    };

    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("shadowrun2e", SR2ItemSheet, {
        makeDefault: true,
        label: "Shadowrun 2E Item Sheet"
    });

    console.log("SR2E | Sheet registration completed");

    // Register system settings
    registerSystemSettings();

    // Preload Handlebars templates
    preloadHandlebarsTemplates();

    // Register Handlebars helpers
    registerHandlebarsHelpers();

    // Token quick actions popup
    initializeQuickActions();

    // Expose data importer globally for debugging
    window.SR2DataImporter = SR2DataImporter;
});

/* -------------------------------------------- */
/*  Actor Create Dialog Enhancements            */
/* -------------------------------------------- */

	async function sr2SyncFreeLanguageSkills(actor) {
	    if (!actor || !["character", "contact", "follower"].includes(actor.type)) return;
	
	    const nativeLanguage = actor.system?.details?.nativeLanguage || "English";
	    const dialectLanguage = actor.system?.details?.dialectLanguage || "City Speak";
	    const legacyLifestyle = actor.system?.resources?.lifestyle || "street";
	    const lifestyles = actor.system?.resources?.lifestyles;
	    const shouldHaveDialect = Array.isArray(lifestyles) && lifestyles.length
	        ? lifestyles.some(l => (l?.type || legacyLifestyle) === "street")
	        : legacyLifestyle === "street";
	
	    const intelligence = Number(actor.system?.attributes?.intelligence?.value) || 1;
	    const nativeRating = Math.min(6, intelligence + 2);
	    const dialectRating = Math.max(1, Math.floor(intelligence / 2));

    const existingLanguageSkills = actor.items.filter(i => i.type === "skill" && i.system?.baseSkill === "Language" && i.system?.isFree);
    const nativeItem = existingLanguageSkills.find(i => i.system?.freeLanguageType === "native");
    const dialectItem = existingLanguageSkills.find(i => i.system?.freeLanguageType === "dialect");

    const updates = [];

    if (nativeItem) {
        const updateData = {};
        if (nativeItem.name !== nativeLanguage) updateData["name"] = nativeLanguage;
        if (nativeItem.system.allocatedRating !== nativeRating) updateData["system.allocatedRating"] = nativeRating;
        if (nativeItem.system.baseRating !== nativeRating) updateData["system.baseRating"] = nativeRating;
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
            if (dialectItem.system.allocatedRating !== dialectRating) updateData["system.allocatedRating"] = dialectRating;
            if (dialectItem.system.baseRating !== dialectRating) updateData["system.baseRating"] = dialectRating;
            if (dialectItem.system.concentrationRating !== 0) updateData["system.concentrationRating"] = 0;
            if (dialectItem.system.specializationRating !== 0) updateData["system.specializationRating"] = 0;
            if (Object.keys(updateData).length) updates.push({ _id: dialectItem.id, ...updateData });
        }
    }

    if (updates.length) {
        await actor.updateEmbeddedDocuments("Item", updates, { sr2SyncingLanguages: true });
    }

    // Create missing items (after updates so we don't race on IDs)
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
                requiresConcentration: false
            }
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
                requiresConcentration: false
            }
        });
    }

    if (createData.length) {
        await actor.createEmbeddedDocuments("Item", createData, { sr2SyncingLanguages: true });
    }
}

function sr2EnhanceActorCreateDialog(app, html) {
    // In some Foundry versions/hooks, "html" may not be a jQuery object.
    const jq = globalThis.jQuery;
    const $html = (jq && html instanceof jq) ? html : $(html);

    const form = $html.is("form") ? $html : $html.find("form");
    if (!form.length) return;

    const typeSelect = form.find('select[name="type"]');
    if (!typeSelect.length) return;

    // Only target the "Create Actor" dialog for this system.
    const optionValues = typeSelect.find("option").map((_, el) => el.value).get();
    const isSR2ActorCreateDialog =
        optionValues.includes("character") &&
        optionValues.includes("cyberdeck") &&
        optionValues.includes("vehicle") &&
        optionValues.includes("spirit");
    if (!isSR2ActorCreateDialog) return;

    // Avoid injecting multiple times on re-renders
    if (form.find(".sr2-create-extras").length) return;

    const priorityLetters = [
        { value: "", label: "" },
        { value: "A", label: "A" },
        { value: "B", label: "B" },
        { value: "C", label: "C" },
        { value: "D", label: "D" },
        { value: "E", label: "E" }
    ];

    const priorityOptionsHtml = priorityLetters
        .map(o => `<option value="${o.value}">${o.label}</option>`)
        .join("");

    const metatypeOptionsHtml = SR2_METATYPE_VALUES
        .map(m => `<option value="${m}">${m.charAt(0).toUpperCase() + m.slice(1)}</option>`)
        .join("");

    const escapeHtml = (value) => {
        if (globalThis.foundry?.utils?.escapeHTML) return foundry.utils.escapeHTML(String(value));
        return String(value).replace(/[&<>"']/g, c => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        }[c]));
    };

    const followerArchetypeOptionsHtml = [
        `<option value=""></option>`,
        ...Object.entries(SR2_FOLLOWER_ARCHETYPES).map(([key, data]) => `<option value="${key}">${data.label}</option>`)
    ].join("");

    const contactArchetypeOptionsHtml = [
        `<option value=""></option>`,
        ...Object.entries(SR2_CONTACT_ARCHETYPES).map(([key, data]) => `<option value="${key}">${data.label}</option>`)
    ].join("");

    const contactLevelsEnabled = sr2AreContactLevelsEnabled();

    const followerFromContactsOptionsHtml = (() => {
        if (!contactLevelsEnabled) return followerArchetypeOptionsHtml;

        const gangTribeKeys = ["gangMember", "tribesman"];
        const gangTribeOptions = gangTribeKeys
            .filter(k => SR2_FOLLOWER_ARCHETYPES[k])
            .map(k => `<option value="${k}">${SR2_FOLLOWER_ARCHETYPES[k].label}</option>`);

        const contactOptions = Object.entries(SR2_CONTACT_ARCHETYPES)
            .map(([key, data]) => `<option value="${key}">${data.label}</option>`);

        return [
            `<option value=""></option>`,
            ...(gangTribeOptions.length ? [`<option value="" disabled>— Gang/Tribe —</option>`, ...gangTribeOptions] : []),
            `<option value="" disabled>— Contacts —</option>`,
            ...contactOptions
        ].join("");
    })();

    const leaderActors = globalThis.game?.actors?.filter(a => a.type === "character") ?? [];
    const leaderOptionsHtml = [
        `<option value=""></option>`,
        ...leaderActors.map(a => `<option value="${a.id}">${escapeHtml(a.name)}</option>`)
    ].join("");

    const spiritTypeOptionsHtml = `
      <option value=""></option>
      <option value="elemental">Elemental</option>
      <option value="nature">Nature Spirit</option>
      <option value="city">City Spirit</option>
      <option value="hearth">Hearth Spirit</option>
      <option value="ancestor">Ancestor Spirit</option>
      <option value="task">Task Spirit</option>
      <option value="guidance">Guidance Spirit</option>
      <option value="plant">Plant Spirit</option>
      <option value="beast">Beast Spirit</option>
      <option value="water">Water Elemental</option>
      <option value="air">Air Elemental</option>
      <option value="earth">Earth Elemental</option>
      <option value="fire">Fire Elemental</option>
      <option value="man">Man Spirit</option>
      <option value="toxic">Toxic Spirit</option>
    `;

    const extrasHtml = `
      <div class="sr2-create-extras">
        <hr/>
        <div class="sr2-create-priorities">
          <h3>Priorities (ABCDE)</h3>
          <div class="form-group">
            <label>Metatype</label>
            <div class="form-fields">
              <div class="sr2-metatype-fields">
                <select name="system.priorities.metatype" class="sr2-priority-select" data-sr2-priority="metatype">${priorityOptionsHtml}</select>
                <select name="system.details.metatype" class="sr2-metatype-select">${metatypeOptionsHtml}</select>
              </div>
            </div>
          </div>
          <div class="form-group">
            <label>Attributes</label>
            <div class="form-fields">
              <select name="system.priorities.attributes" class="sr2-priority-select" data-sr2-priority="attributes">${priorityOptionsHtml}</select>
            </div>
          </div>
          <div class="form-group">
            <label>Skills</label>
            <div class="form-fields">
              <select name="system.priorities.skills" class="sr2-priority-select" data-sr2-priority="skills">${priorityOptionsHtml}</select>
            </div>
          </div>
          <div class="form-group">
            <label>Resources</label>
            <div class="form-fields">
              <select name="system.priorities.resources" class="sr2-priority-select" data-sr2-priority="resources">${priorityOptionsHtml}</select>
            </div>
          </div>
          <div class="form-group">
            <label>Magic</label>
            <div class="form-fields">
              <select name="system.priorities.magic" class="sr2-priority-select" data-sr2-priority="magic">${priorityOptionsHtml}</select>
            </div>
          </div>
        </div>
        <div class="sr2-create-archetype">
          <h3 class="sr2-archetype-title">Archetype</h3>
          <div class="form-group">
            <label class="sr2-archetype-label">Archetype</label>
            <div class="form-fields">
              <select name="system.details.archetype" class="sr2-archetype-select">${followerArchetypeOptionsHtml}</select>
            </div>
          </div>
          <div class="form-group">
            <label>Leader</label>
            <div class="form-fields">
              <select name="system.details.leaderId" class="sr2-leader-select">${leaderOptionsHtml}</select>
            </div>
          </div>
        </div>
        <div class="sr2-create-vehicle-details">
          <h3>Vehicle</h3>
          <div class="form-group">
            <label>Vehicle</label>
            <div class="form-fields">
              <select class="sr2-vehicle-template-select">
                <option value=""></option>
                <option value="" disabled>Loading vehicles…</option>
              </select>
            </div>
          </div>
          <input type="hidden" class="sr2-vehicle-template-field" name="system.model" data-dtype="String" disabled />
          <input type="hidden" class="sr2-vehicle-template-field" name="system.vehicleType" data-dtype="String" disabled />
          <input type="hidden" class="sr2-vehicle-template-field" name="system.handling.on" data-dtype="Number" disabled />
          <input type="hidden" class="sr2-vehicle-template-field" name="system.handling.off" data-dtype="Number" disabled />
          <input type="hidden" class="sr2-vehicle-template-field" name="system.speed" data-dtype="Number" disabled />
          <input type="hidden" class="sr2-vehicle-template-field" name="system.accel" data-dtype="Number" disabled />
          <input type="hidden" class="sr2-vehicle-template-field" name="system.body" data-dtype="Number" disabled />
          <input type="hidden" class="sr2-vehicle-template-field" name="system.armor" data-dtype="Number" disabled />
          <input type="hidden" class="sr2-vehicle-template-field" name="system.sig" data-dtype="Number" disabled />
          <input type="hidden" class="sr2-vehicle-template-field" name="system.autonav" data-dtype="Number" disabled />
          <input type="hidden" class="sr2-vehicle-template-field" name="system.pilot" data-dtype="Number" disabled />
          <input type="hidden" class="sr2-vehicle-template-field" name="system.sensor" data-dtype="Number" disabled />
          <input type="hidden" class="sr2-vehicle-template-field" name="system.cargo" data-dtype="Number" disabled />
          <input type="hidden" class="sr2-vehicle-template-field" name="system.load" data-dtype="Number" disabled />
          <input type="hidden" class="sr2-vehicle-template-field" name="system.seating" data-dtype="String" disabled />
          <input type="hidden" class="sr2-vehicle-template-field" name="system.cost" data-dtype="Number" disabled />
          <input type="hidden" class="sr2-vehicle-template-field" name="system.availability" data-dtype="String" disabled />
          <input type="hidden" class="sr2-vehicle-template-field" name="system.streetIndex" data-dtype="Number" disabled />
          <input type="hidden" class="sr2-vehicle-template-field" name="system.notes" data-dtype="String" disabled />
          <input type="hidden" class="sr2-vehicle-template-field" name="system.bookPage" data-dtype="String" disabled />
        </div>
        <div class="sr2-create-cyberdeck-details">
          <h3>Cyberdeck</h3>
          <div class="form-group">
            <label>Cyberdeck</label>
            <div class="form-fields">
              <select name="system.model" class="sr2-cyberdeck-template-select">
                <option value=""></option>
                <option value="" disabled>Loading cyberdecks…</option>
              </select>
            </div>
          </div>
          <input type="hidden" class="sr2-cyberdeck-template-field" name="system.persona" data-dtype="Number" disabled />
          <input type="hidden" class="sr2-cyberdeck-template-field" name="system.hardening" data-dtype="Number" disabled />
          <input type="hidden" class="sr2-cyberdeck-template-field" name="system.memory.total" data-dtype="Number" disabled />
          <input type="hidden" class="sr2-cyberdeck-template-field" name="system.memory.used" data-dtype="Number" disabled />
          <input type="hidden" class="sr2-cyberdeck-template-field" name="system.storage.total" data-dtype="Number" disabled />
          <input type="hidden" class="sr2-cyberdeck-template-field" name="system.storage.used" data-dtype="Number" disabled />
          <input type="hidden" class="sr2-cyberdeck-template-field" name="system.load" data-dtype="Number" disabled />
          <input type="hidden" class="sr2-cyberdeck-template-field" name="system.ioSpeed" data-dtype="Number" disabled />
          <input type="hidden" class="sr2-cyberdeck-template-field" name="system.responseIncrease" data-dtype="Number" disabled />
          <input type="hidden" class="sr2-cyberdeck-template-field" name="system.cost" data-dtype="Number" disabled />
          <input type="hidden" class="sr2-cyberdeck-template-field" name="system.streetIndex" data-dtype="Number" disabled />
          <input type="hidden" class="sr2-cyberdeck-template-field" name="system.availability" data-dtype="String" disabled />
          <input type="hidden" class="sr2-cyberdeck-template-field" name="system.bookPage" data-dtype="String" disabled />
        </div>
        <div class="sr2-create-spirit-details">
          <h3>Spirit</h3>
          <div class="form-group">
            <label>Spirit Type</label>
            <div class="form-fields">
              <select name="system.spiritType" class="sr2-spirit-type-select">${spiritTypeOptionsHtml}</select>
            </div>
          </div>
        </div>
      </div>
    `;

    const typeFormGroup = typeSelect.closest(".form-group");
    if (typeFormGroup.length) {
        typeFormGroup.after(extrasHtml);
    } else {
        typeSelect.after(extrasHtml);
    }

    const extras = form.find(".sr2-create-extras");
    const prioritiesSection = extras.find(".sr2-create-priorities");
    const archetypeSection = extras.find(".sr2-create-archetype");
    const vehicleSection = extras.find(".sr2-create-vehicle-details");
    const cyberdeckSection = extras.find(".sr2-create-cyberdeck-details");
    const spiritSection = extras.find(".sr2-create-spirit-details");
    const nameInput = form.find('input[name="name"]');
    const vehicleTemplateSelect = vehicleSection.find("select.sr2-vehicle-template-select");
    const cyberdeckTemplateSelect = cyberdeckSection.find("select.sr2-cyberdeck-template-select");

    const metatypePrioritySelect = prioritiesSection.find('select.sr2-priority-select[data-sr2-priority="metatype"]');
    const metatypeSelect = prioritiesSection.find("select.sr2-metatype-select");

    function applyMetatypeRestrictions() {
        if (!metatypePrioritySelect.length || !metatypeSelect.length) return;

        const priority = metatypePrioritySelect.val();
        const allowed = sr2GetAllowedMetatypesForPriority(priority);

        const options = Array.from(metatypeSelect[0].options);
        for (const opt of options) {
            if (!allowed) {
                opt.disabled = false;
                continue;
            }
            opt.disabled = !allowed.includes(opt.value);
        }

        const shouldDisableMetatypeSelect = Array.isArray(allowed) && allowed.length <= 1;
        metatypeSelect.prop("disabled", shouldDisableMetatypeSelect);

        if (allowed) {
            const current = metatypeSelect.val();
            if (!allowed.includes(current)) {
                metatypeSelect.val(allowed[0] ?? "human");
            }
        }
    }

    function syncPrioritySelects() {
        const selects = prioritiesSection.find("select.sr2-priority-select");
        const selectedValues = selects.map((_, el) => el.value).get().filter(Boolean);

        selects.each((_, el) => {
            const currentValue = el.value;
            const options = Array.from(el.options);
            for (const opt of options) {
                if (!opt.value) {
                    opt.disabled = false;
                    continue;
                }
                opt.disabled = opt.value !== currentValue && selectedValues.includes(opt.value);
            }
        });
    }

    const leaderNameById = leaderActors.reduce((acc, a) => {
        acc[a.id] = a.name;
        return acc;
    }, {});

    const nameByTypeKey = "sr2NameByType";
    const currentTypeKey = "sr2CurrentActorType";

    if (nameInput.length && !nameInput.data(nameByTypeKey)) {
        nameInput.data(nameByTypeKey, {});
    }
    if (typeSelect.data(currentTypeKey) === undefined) {
        typeSelect.data(currentTypeKey, typeSelect.val());
    }

    function rememberNameForType(type) {
        if (!nameInput.length) return;
        if (!type) return;

        const map = nameInput.data(nameByTypeKey) || {};
        map[type] = nameInput.val();
        nameInput.data(nameByTypeKey, map);
    }

    function applyNameForType(type) {
        if (!nameInput.length) return;

        const map = nameInput.data(nameByTypeKey) || {};

        if (type === "follower") {
            const archetypeKey = archetypeSection.find("select.sr2-archetype-select").val();
            const leaderId = archetypeSection.find("select.sr2-leader-select").val();

            const archetypeLabel = archetypeKey
                ? (
                    (contactLevelsEnabled && SR2_CONTACT_ARCHETYPES[archetypeKey]?.label)
                        ? SR2_CONTACT_ARCHETYPES[archetypeKey].label
                        : (SR2_FOLLOWER_ARCHETYPES[archetypeKey]?.label || "Follower")
                )
                : "Follower";
            const leaderName = leaderId ? (leaderNameById[leaderId] || "") : "";

            let name = `${archetypeLabel} Follower`;
            if (leaderName) name = `${name} - ${leaderName}`;

            nameInput.val(name);
            nameInput.prop("readonly", true);
            return;
        }

        if (type === "contact") {
            const contactKey = archetypeSection.find("select.sr2-archetype-select").val();
            const leaderId = archetypeSection.find("select.sr2-leader-select").val();

            const contactLabel = contactKey ? (SR2_CONTACT_ARCHETYPES[contactKey]?.label || "Contact") : "Contact";
            const leaderName = leaderId ? (leaderNameById[leaderId] || "") : "";

            let name = `${contactLabel}`;
            if (leaderName) name = `${name} - ${leaderName}`;

            nameInput.val(name);
            nameInput.prop("readonly", true);
            return;
        }

        const autoDefaults = {
            vehicle: "Vehicle",
            cyberdeck: "Cyberdeck",
            spirit: "Spirit"
        };

        const autoDefault = autoDefaults[type];

        if (autoDefault) {
            nameInput.val(autoDefault);
            nameInput.prop("readonly", true);
            return;
        }

        const saved = map[type];
        nameInput.prop("readonly", false);
        if (saved !== undefined) {
            nameInput.val(saved);
        }
    }

    function applyArchetypeOptions(type) {
        const select = archetypeSection.find("select.sr2-archetype-select");
        if (!select.length) return;

        const current = select.val();
        let options = `<option value=""></option>`;

        if (type === "follower") {
            options = followerFromContactsOptionsHtml;
        } else if (type === "contact") {
            options = contactArchetypeOptionsHtml;
        }

        const last = select.data("__sr2eArchetypeOptionsType");
        if (last === type) return;

        select.html(options);

        if (current && select.find(`option[value="${current}"]`).length) {
            select.val(current);
        } else {
            select.val("");
        }

        select.data("__sr2eArchetypeOptionsType", type);
    }

    function sr2GetCreateActorCatalogCache() {
        const key = "__sr2eCreateActorCatalogCache";
        if (!globalThis[key]) {
            globalThis[key] = {
                vehicleCatalog: null,
                vehicleCatalogPromise: null,
                cyberdeckCatalog: null,
                cyberdeckCatalogPromise: null
            };
        }
        return globalThis[key];
    }

    function sr2GetSystemId() {
        return globalThis.game?.system?.id || "shadowrun2e";
    }

    async function sr2LoadVehicleCatalog() {
        const cache = sr2GetCreateActorCatalogCache();
        if (cache.vehicleCatalog) return cache.vehicleCatalog;
        if (cache.vehicleCatalogPromise) return cache.vehicleCatalogPromise;

        cache.vehicleCatalogPromise = (async () => {
            const systemId = sr2GetSystemId();
            const [vehicles, drones] = await Promise.all([
                fetch(`/systems/${systemId}/data/vehicles.json`).then(r => r.json()),
                fetch(`/systems/${systemId}/data/drones.json`).then(r => r.json())
            ]);

            const map = {};

            const vehicleOptions = (vehicles || [])
                .map(v => ({ key: `vehicles:${(v?.name || "").toString().trim()}`, label: (v?.name || "").toString().trim(), data: v }))
                .filter(v => v.label);
            const droneOptions = (drones || [])
                .map(v => ({ key: `drones:${(v?.name || "").toString().trim()}`, label: (v?.name || "").toString().trim(), data: v }))
                .filter(v => v.label);

            vehicleOptions.sort((a, b) => a.label.localeCompare(b.label));
            droneOptions.sort((a, b) => a.label.localeCompare(b.label));

            for (const o of vehicleOptions) map[o.key] = { source: "vehicles", data: o.data };
            for (const o of droneOptions) map[o.key] = { source: "drones", data: o.data };

            const optionGroups = [];
            if (vehicleOptions.length) {
                optionGroups.push(`<optgroup label="Vehicles">${vehicleOptions.map(o => `<option value="${escapeHtml(o.key)}">${escapeHtml(o.label)}</option>`).join("")}</optgroup>`);
            }
            if (droneOptions.length) {
                optionGroups.push(`<optgroup label="Drones">${droneOptions.map(o => `<option value="${escapeHtml(o.key)}">${escapeHtml(o.label)}</option>`).join("")}</optgroup>`);
            }

            cache.vehicleCatalog = {
                map,
                optionsHtml: `<option value=""></option>${optionGroups.join("")}`
            };

            return cache.vehicleCatalog;
        })();

        try {
            return await cache.vehicleCatalogPromise;
        } catch (err) {
            cache.vehicleCatalogPromise = null;
            throw err;
        }
    }

    async function sr2LoadCyberdeckCatalog() {
        const cache = sr2GetCreateActorCatalogCache();
        if (cache.cyberdeckCatalog) return cache.cyberdeckCatalog;
        if (cache.cyberdeckCatalogPromise) return cache.cyberdeckCatalogPromise;

        cache.cyberdeckCatalogPromise = (async () => {
            const systemId = sr2GetSystemId();
            const decks = await fetch(`/systems/${systemId}/data/cyberdeck.json`).then(r => r.json());

            const map = {};
            const options = (decks || [])
                .map(d => {
                    const label = (d?.Name || "").toString().trim();
                    return { key: label, label, data: d };
                })
                .filter(d => d.label);

            options.sort((a, b) => a.label.localeCompare(b.label));
            for (const o of options) map[o.key] = o.data;

            cache.cyberdeckCatalog = {
                map,
                optionsHtml: `<option value=""></option>${options.map(o => `<option value="${escapeHtml(o.key)}">${escapeHtml(o.label)}</option>`).join("")}`
            };

            return cache.cyberdeckCatalog;
        })();

        try {
            return await cache.cyberdeckCatalogPromise;
        } catch (err) {
            cache.cyberdeckCatalogPromise = null;
            throw err;
        }
    }

    function sr2ParseDelimitedPair(rawValue, fallbackRightToLeft = false) {
        if (rawValue === undefined || rawValue === null) return [0, 0];
        const parts = rawValue.toString().split("/");
        const left = parseInt(parts[0]) || 0;
        let right = parseInt(parts[1]) || 0;
        if (fallbackRightToLeft && parts.length === 1) right = left;
        return [left, right];
    }

    function sr2InferVehicleType(vehicle) {
        const name = (vehicle?.name || "").toString();
        const notes = (vehicle?.Notes || "").toString();
        const speedAccel = (vehicle?.["Speed/Accel"] || "").toString();

        const haystack = `${name} ${notes}`.toLowerCase();

        const airKeywords = ["aircraft", "helicopter", "plane", "vtol", "rotor", "aerospace", "jet", "tiltrotor"];
        const waterKeywords = ["boat", "ship", "marine", "hydrofoil", "submarine", "submersible"];

        if (airKeywords.some(k => haystack.includes(k))) return "air";
        if (waterKeywords.some(k => haystack.includes(k))) return "water";
        if (speedAccel.includes("(") && speedAccel.includes(")")) return "air";

        return "ground";
    }

    function applyVehicleTemplateFromSelection() {
        const templateKey = vehicleTemplateSelect.val();
        const templateFields = vehicleSection.find("input.sr2-vehicle-template-field");

        if (!templateKey) {
            templateFields.prop("disabled", true);
            return;
        }

        sr2LoadVehicleCatalog().then(({ map }) => {
            // Avoid enabling hidden inputs if the user changed type/selection while loading.
            if (typeSelect.val() !== "vehicle" || vehicleTemplateSelect.val() !== templateKey) {
                templateFields.prop("disabled", true);
                return;
            }

            const entry = map[templateKey];
            if (!entry) {
                templateFields.prop("disabled", true);
                return;
            }

            const vehicle = entry.data || {};

            let handlingOn = 0, handlingOff = 0;
            if (vehicle.Handling) {
                const [on, off] = sr2ParseDelimitedPair(vehicle.Handling, true);
                handlingOn = on;
                handlingOff = off;
            }

            let speed = 0, accel = 0;
            if (vehicle["Speed/Accel"]) {
                const [s, a] = sr2ParseDelimitedPair(vehicle["Speed/Accel"]);
                speed = s;
                accel = a;
            }

            let body = 0, armor = 0;
            if (vehicle["Body/Armor"]) {
                const [b, a] = sr2ParseDelimitedPair(vehicle["Body/Armor"]);
                body = b;
                armor = a;
            }

            let sig = 0, autonav = 0;
            if (vehicle["Sig/Autonav"]) {
                const parts = vehicle["Sig/Autonav"].toString().split("/");
                sig = parseInt(parts[0]) || 0;
                autonav = parts[1] === "-" ? 0 : (parseInt(parts[1]) || 0);
            }

            let pilot = 0, sensor = 0;
            if (vehicle["Pilot/Sensor"]) {
                const parts = vehicle["Pilot/Sensor"].toString().split("/");
                pilot = parts[0] === "-" ? 0 : (parseInt(parts[0]) || 0);
                sensor = parseInt(parts[1]) || 0;
            }

            let cargo = 0, load = 0;
            if (vehicle["Cargo/Load"]) {
                const [c, l] = sr2ParseDelimitedPair(vehicle["Cargo/Load"]);
                cargo = c;
                load = l;
            }

            const isDrone = entry.source === "drones";
            const vehicleType = isDrone ? "drone" : sr2InferVehicleType(vehicle);

            const modelName = (vehicle.name || "").toString().trim();
            const cost = parseInt(vehicle["$Cost"]?.toString().replace(/[^\d]/g, "")) || 0;
            const streetIndex = parseFloat(vehicle["Street Index"]) || 1.0;

            vehicleSection.find('input[name="system.model"]').val(modelName);
            vehicleSection.find('input[name="system.vehicleType"]').val(vehicleType);
            vehicleSection.find('input[name="system.handling.on"]').val(handlingOn);
            vehicleSection.find('input[name="system.handling.off"]').val(handlingOff);
            vehicleSection.find('input[name="system.speed"]').val(speed);
            vehicleSection.find('input[name="system.accel"]').val(accel);
            vehicleSection.find('input[name="system.body"]').val(body);
            vehicleSection.find('input[name="system.armor"]').val(armor);
            vehicleSection.find('input[name="system.sig"]').val(sig);
            vehicleSection.find('input[name="system.autonav"]').val(autonav);
            vehicleSection.find('input[name="system.pilot"]').val(pilot);
            vehicleSection.find('input[name="system.sensor"]').val(sensor);
            vehicleSection.find('input[name="system.cargo"]').val(cargo);
            vehicleSection.find('input[name="system.load"]').val(load);
            vehicleSection.find('input[name="system.seating"]').val((vehicle.Seating || "").toString());
            vehicleSection.find('input[name="system.cost"]').val(cost);
            vehicleSection.find('input[name="system.availability"]').val((vehicle.Availability || "").toString());
            vehicleSection.find('input[name="system.streetIndex"]').val(streetIndex);
            vehicleSection.find('input[name="system.notes"]').val((vehicle.Notes || "").toString());
            vehicleSection.find('input[name="system.bookPage"]').val((vehicle["Book.Page"] || "").toString());

            if (typeSelect.val() !== "vehicle" || vehicleTemplateSelect.val() !== templateKey) {
                templateFields.prop("disabled", true);
                return;
            }

            templateFields.prop("disabled", false);
        }).catch(() => {
            templateFields.prop("disabled", true);
        });
    }

    function applyCyberdeckTemplateFromSelection() {
        const model = cyberdeckTemplateSelect.val();
        const templateFields = cyberdeckSection.find("input.sr2-cyberdeck-template-field");

        if (!model) {
            templateFields.prop("disabled", true);
            return;
        }

        sr2LoadCyberdeckCatalog().then(({ map }) => {
            // Avoid enabling hidden inputs if the user changed type/selection while loading.
            if (typeSelect.val() !== "cyberdeck" || cyberdeckTemplateSelect.val() !== model) {
                templateFields.prop("disabled", true);
                return;
            }

            const deck = map[model];
            if (!deck) {
                templateFields.prop("disabled", true);
                return;
            }

            cyberdeckSection.find('input[name="system.persona"]').val(deck.Persona ?? 1);
            cyberdeckSection.find('input[name="system.hardening"]').val(deck.Hardening ?? 0);
            cyberdeckSection.find('input[name="system.memory.total"]').val(deck.Memory ?? 100);
            cyberdeckSection.find('input[name="system.memory.used"]').val(0);
            cyberdeckSection.find('input[name="system.storage.total"]').val(deck.Storage ?? 500);
            cyberdeckSection.find('input[name="system.storage.used"]').val(0);
            cyberdeckSection.find('input[name="system.load"]').val(deck.Load ?? 5);
            cyberdeckSection.find('input[name="system.ioSpeed"]').val(deck["I/O Speed"] ?? 1);
            cyberdeckSection.find('input[name="system.responseIncrease"]').val(deck["Response Increase"] ?? 0);
            cyberdeckSection.find('input[name="system.cost"]').val(deck.Cost ?? 0);
            cyberdeckSection.find('input[name="system.streetIndex"]').val(parseFloat(deck["Street Index"]) || 1.0);
            cyberdeckSection.find('input[name="system.availability"]').val((deck.Availability || "").toString());
            cyberdeckSection.find('input[name="system.bookPage"]').val((deck.BookPage || "").toString());

            if (typeSelect.val() !== "cyberdeck" || cyberdeckTemplateSelect.val() !== model) {
                templateFields.prop("disabled", true);
                return;
            }

            templateFields.prop("disabled", false);
        }).catch(() => {
            templateFields.prop("disabled", true);
        });
    }

    function applyVisibility() {
        const type = typeSelect.val();
        const showPriorities = type === "character";
        const showArchetype = type === "follower" || type === "contact";
        const showVehicle = type === "vehicle";
        const showCyberdeck = type === "cyberdeck";
        const showSpirit = type === "spirit";

        prioritiesSection.toggle(showPriorities);
        prioritiesSection.find("select").prop("disabled", !showPriorities);

        const archetypeLabel = (type === "contact" || (type === "follower" && contactLevelsEnabled)) ? "Contact" : "Archetype";
        archetypeSection.find(".sr2-archetype-title").text(archetypeLabel);
        archetypeSection.find("label.sr2-archetype-label").text(archetypeLabel);

        applyArchetypeOptions(type);
        archetypeSection.toggle(showArchetype);
        archetypeSection.find("select").prop("disabled", !showArchetype);

        vehicleSection.toggle(showVehicle);
        vehicleSection.find("select, input").prop("disabled", true);
        vehicleTemplateSelect.prop("disabled", !showVehicle);

        cyberdeckSection.toggle(showCyberdeck);
        cyberdeckSection.find("select, input").prop("disabled", true);
        cyberdeckTemplateSelect.prop("disabled", !showCyberdeck);

        spiritSection.toggle(showSpirit);
        spiritSection.find("select").prop("disabled", !showSpirit);

        if (showPriorities) syncPrioritySelects();
        if (showPriorities) applyMetatypeRestrictions();

        if (showVehicle) applyVehicleTemplateFromSelection();
        if (showCyberdeck) applyCyberdeckTemplateFromSelection();

        applyNameForType(type);
    }

    prioritiesSection.find("select.sr2-priority-select").on("change", syncPrioritySelects);
    metatypePrioritySelect.on("change", applyMetatypeRestrictions);
    vehicleTemplateSelect.on("change", applyVehicleTemplateFromSelection);
    cyberdeckTemplateSelect.on("change", applyCyberdeckTemplateFromSelection);

    typeSelect.on("change", () => {
        const previousType = typeSelect.data(currentTypeKey);
        rememberNameForType(previousType);
        typeSelect.data(currentTypeKey, typeSelect.val());
        applyVisibility();
    });

    archetypeSection.find("select").on("change", () => {
        const type = typeSelect.val();
        if (type !== "follower" && type !== "contact") return;
        applyNameForType(type);
    });

    rememberNameForType(typeSelect.val());
    applyVisibility();

    sr2LoadVehicleCatalog()
        .then(({ optionsHtml }) => vehicleTemplateSelect.html(optionsHtml))
        .catch(() => vehicleTemplateSelect.html(`<option value=""></option><option value="" disabled>Failed to load vehicles</option>`));

    sr2LoadCyberdeckCatalog()
        .then(({ optionsHtml }) => cyberdeckTemplateSelect.html(optionsHtml))
        .catch(() => cyberdeckTemplateSelect.html(`<option value=""></option><option value="" disabled>Failed to load cyberdecks</option>`));

    // Visible confirmation for environments without devtools access
    const noticeKey = "__sr2eCreateActorDialogEnhancedNoticeShown";
    if (!globalThis[noticeKey] && globalThis.ui?.notifications?.info) {
        globalThis[noticeKey] = true;
    }

    // Let the dialog resize to fit the new content (when supported).
    let windowApp = app;
    if (!windowApp) {
        const windowElement = form.closest(".window-app");
        const appId = windowElement?.data?.("appid");
        if (appId && globalThis.ui?.windows?.[appId]) {
            windowApp = ui.windows[appId];
        }
    }

    if (typeof windowApp?.setPosition === "function") {
        try {
            windowApp.setPosition({ height: "auto" });
        } catch (err) {
            // Ignore.
        }
    }
}

Hooks.on("renderDialog", sr2EnhanceActorCreateDialog);
Hooks.on("renderDocumentCreateDialog", sr2EnhanceActorCreateDialog);
Hooks.on("renderDocumentCreationDialog", sr2EnhanceActorCreateDialog);
Hooks.on("renderActorCreateDialog", sr2EnhanceActorCreateDialog);

/* -------------------------------------------- */
/*  Metatype Racial Modifiers & Caps            */
/* -------------------------------------------- */

Hooks.on("preUpdateActor", function (actor, changes, options, userId) {
    if (typeof userId === "string" && globalThis.game?.user?.id && userId !== game.user.id) return;
    if (!["character", "contact", "follower"].includes(actor.type)) return;

    const getProperty = globalThis.foundry?.utils?.getProperty;
    const setProperty = globalThis.foundry?.utils?.setProperty;
    if (typeof getProperty !== "function" || typeof setProperty !== "function") return;

    const newMetatype = getProperty(changes, "system.details.metatype");
    const oldMetatype = actor.system?.details?.metatype || "human";
    const effectiveMetatype = newMetatype || oldMetatype;

    const bounds = sr2GetRacialAttributeBounds(effectiveMetatype);
    const traitData = sr2GetRacialTraits(effectiveMetatype);

    const attrKeys = ["body", "quickness", "strength", "charisma", "intelligence", "willpower"];

    // Always keep stored min/max in sync with metatype caps
    for (const key of attrKeys) {
        const b = bounds[key];
        if (!b) continue;
        const currentMin = actor.system?.attributes?.[key]?.min;
        const currentMax = actor.system?.attributes?.[key]?.max;
        if (currentMin !== b.min) setProperty(changes, `system.attributes.${key}.min`, b.min);
        if (currentMax !== b.max) setProperty(changes, `system.attributes.${key}.max`, b.max);
    }

    // If metatype changes, preserve allocated base attribute values where possible by shifting by modifier delta.
    if (newMetatype && newMetatype !== oldMetatype) {
        // Keep a copy of racial traits on the actor for quick reference/macros.
        setProperty(changes, "system.details.traits", traitData);

        const oldMods = sr2GetRacialModifiers(oldMetatype);
        const newMods = sr2GetRacialModifiers(newMetatype);

        for (const key of attrKeys) {
            const path = `system.attributes.${key}.value`;

            // If the update explicitly sets an attribute value, keep it (clamped to the new caps).
            const explicit = getProperty(changes, path);
            if (explicit !== undefined) {
                const clamped = Math.max(bounds[key].min, Math.min(bounds[key].max, Number(explicit)));
                setProperty(changes, path, clamped);
                continue;
            }

            const currentFinal = Number(actor.system?.attributes?.[key]?.value);
            const currentValue = Number.isFinite(currentFinal) ? currentFinal : bounds[key].min;
            const baseValue = currentValue - (Number(oldMods[key]) || 0);
            const nextFinalRaw = baseValue + (Number(newMods[key]) || 0);
            const nextFinal = Math.max(bounds[key].min, Math.min(bounds[key].max, nextFinalRaw));
            setProperty(changes, path, nextFinal);
        }
        return;
    }

    // If traits are missing (older actors), initialize once.
    const existingTraits = actor.system?.details?.traits;
    if (!existingTraits || typeof existingTraits !== "object") {
        setProperty(changes, "system.details.traits", traitData);
    }

    // Otherwise, clamp any updated attributes to racial caps.
    for (const key of attrKeys) {
        const path = `system.attributes.${key}.value`;
        const updated = getProperty(changes, path);
        if (updated === undefined) continue;
        const clamped = Math.max(bounds[key].min, Math.min(bounds[key].max, Number(updated)));
        setProperty(changes, path, clamped);
    }
});

Hooks.on("preCreateActor", function (actor, data, options, userId) {
    if (typeof userId === "string" && globalThis.game?.user?.id && userId !== game.user.id) return;

    const actorType = data?.type ?? actor.type;
    if (!["character", "contact", "follower"].includes(actorType)) return;

    const getProperty = globalThis.foundry?.utils?.getProperty;
    const setProperty = globalThis.foundry?.utils?.setProperty;
    if (typeof getProperty !== "function" || typeof setProperty !== "function") return;

    const metatype = getProperty(data, "system.details.metatype") || "human";
    const bounds = sr2GetRacialAttributeBounds(metatype);
    const traitData = sr2GetRacialTraits(metatype);

    const attrKeys = ["body", "quickness", "strength", "charisma", "intelligence", "willpower"];

    // Ensure derived traits and caps match the chosen metatype from the start.
    setProperty(data, "system.details.traits", traitData);
    for (const key of attrKeys) {
        const b = bounds[key];
        if (!b) continue;
        setProperty(data, `system.attributes.${key}.min`, b.min);
        setProperty(data, `system.attributes.${key}.max`, b.max);
    }

    // If this actor is being created from a follower archetype, let the archetype bootstrap set values.
    const archetypeKey = getProperty(data, "system.details.archetype");
    if (actorType === "follower" && archetypeKey) return;

    // If the attributes are still at the template defaults, apply the metatype baseline values.
    const looksUnallocated = attrKeys.every(key => {
        const raw = getProperty(data, `system.attributes.${key}.value`);
        const value = Number(raw);
        return !Number.isFinite(value) || value === 1;
    });

    if (!looksUnallocated) return;

    for (const key of attrKeys) {
        const b = bounds[key];
        if (!b) continue;
        setProperty(data, `system.attributes.${key}.value`, b.min);
    }
});

/* -------------------------------------------- */
/*  Magic Flags Consistency                     */
/* -------------------------------------------- */

Hooks.on("preUpdateActor", function (actor, changes, options, userId) {
    if (typeof userId === "string" && globalThis.game?.user?.id && userId !== game.user.id) return;
    if (!["character", "contact", "follower"].includes(actor.type)) return;

    const getProperty = globalThis.foundry?.utils?.getProperty;
    const setProperty = globalThis.foundry?.utils?.setProperty;
    if (typeof getProperty !== "function" || typeof setProperty !== "function") return;

    const awakened = getProperty(changes, "system.magic.awakened");
    const physicalAdept = getProperty(changes, "system.magic.physicalAdept");

    // Physical Adept implies Awakened.
    if (physicalAdept === true && awakened !== true) {
        setProperty(changes, "system.magic.awakened", true);
    }

    // Turning off Awakened turns off Physical Adept.
    if (awakened === false && physicalAdept !== false) {
        setProperty(changes, "system.magic.physicalAdept", false);
    }
});

Hooks.on("updateActor", async function (actor, changes, options, userId) {
    if (options?.sr2SyncingLanguages) return;
    if (typeof userId === "string" && globalThis.game?.user?.id && userId !== game.user.id) return;
    if (!["character", "contact", "follower"].includes(actor.type)) return;

    const getProperty = globalThis.foundry?.utils?.getProperty;
    if (typeof getProperty !== "function") return;

	    const relevant =
	        getProperty(changes, "system.attributes.intelligence.value") !== undefined ||
	        getProperty(changes, "system.resources.lifestyle") !== undefined ||
	        getProperty(changes, "system.resources.lifestyles") !== undefined ||
	        getProperty(changes, "system.details.nativeLanguage") !== undefined ||
	        getProperty(changes, "system.details.dialectLanguage") !== undefined;

    if (!relevant) return;
    await sr2SyncFreeLanguageSkills(actor);
});

function sr2InstallActorCreateDialogObserver() {
    const key = "__sr2eActorCreateDialogObserver";
    if (globalThis[key]) return;

    let scheduled = false;
    const scan = () => {
        const forms = document.querySelectorAll('form');
        for (const form of forms) {
            sr2EnhanceActorCreateDialog(null, form);
        }
    };

    const observer = new MutationObserver(() => {
        if (scheduled) return;
        scheduled = true;
        setTimeout(() => {
            scheduled = false;
            scan();
        }, 0);
    });

    observer.observe(document.body, { childList: true, subtree: true });
    globalThis[key] = observer;

    // Initial scan (covers dialogs that render before ready hook finishes).
    scan();
}

/* -------------------------------------------- */
/*  Follower Archetype Bootstrap                */
/* -------------------------------------------- */

Hooks.on("createActor", async function (actor, options, userId) {
    if (typeof userId === "string" && userId !== game.user.id) return;
    if (actor.type !== "follower") return;
    if (actor.getFlag("shadowrun2e", "followerBootstrapApplied")) {
        await sr2RepairLegacySkillAllocatedRatings(actor);
        await sr2SyncFreeLanguageSkills(actor);
        return;
    }

    const archetypeKey = actor.system?.details?.archetype;
    const contactLevelsEnabled = sr2AreContactLevelsEnabled();
    const contactArchetype = contactLevelsEnabled ? (SR2_CONTACT_ARCHETYPES[archetypeKey] ?? null) : null;
    const followerArchetype = archetypeKey ? (SR2_FOLLOWER_ARCHETYPES[archetypeKey] ?? null) : null;
    const usesContactArchetype = Boolean(contactArchetype);
    const archetype = contactArchetype || followerArchetype;
    if (!archetype) return;

    // Contact Levels house rule: gang/tribe members are capped at 3 for skills and attributes.
    const isGangTribeMember = contactLevelsEnabled && !usesContactArchetype && ["gangMember", "tribesman"].includes(archetypeKey);
    const gangTribeCap = 3;

    const updates = {};

    for (const [attributeKey, value] of Object.entries(archetype.attributes || {})) {
        const raw = Number(value) || 0;
        updates[`system.attributes.${attributeKey}.value`] = isGangTribeMember ? Math.min(gangTribeCap, raw) : raw;
    }

    if (archetype.metatype) {
        updates["system.details.metatype"] = archetype.metatype;
    }

    if (archetype.magic) {
        updates["system.magic.awakened"] = Boolean(archetype.magic.awakened);
        updates["system.magic.physicalAdept"] = Boolean(archetype.magic.physicalAdept);
        updates["system.magic.tradition"] = archetype.magic.tradition || "";

        const hasExplicitMagicValue = typeof archetype.attributes?.magic === "number";
        if ((archetype.magic.awakened || archetype.magic.physicalAdept) && !hasExplicitMagicValue) {
            updates["system.attributes.magic.value"] = Math.max(actor.system.attributes.magic.value || 0, 6);
        }
    }

    // Standardize follower name on create (Archetype Follower - Leader)
    const leaderId = actor.system?.details?.leaderId;
    const leaderName = leaderId ? (game.actors.get(leaderId)?.name || "") : "";
    const archetypeLabel = archetype.label || "Follower";
    updates["name"] = leaderName ? `${archetypeLabel} Follower - ${leaderName}` : `${archetypeLabel} Follower`;

    if (Object.keys(updates).length) {
        await actor.update(updates, { render: false });
    }

    const normalizedSkillKey = (baseSkill, concentration, specialization) =>
        `${sr2NormalizeCatalogName(baseSkill)}|${sr2NormalizeCatalogName(concentration)}|${sr2NormalizeCatalogName(specialization)}`;

    const existingSkillKeys = new Set(
        actor.items
            .filter(i => i.type === "skill")
            .map(i => normalizedSkillKey(i.system?.baseSkill || i.name, i.system?.concentration, i.system?.specialization))
    );

    const skillsToCreate = [];
    for (const skill of (archetype.skills || [])) {
        const key = normalizedSkillKey(skill.baseSkill, skill.concentration, skill.specialization);
        if (existingSkillKeys.has(key)) continue;
        const rawAllocated = Number(skill.allocatedRating ?? skill.baseRating) || 0;
        const rawBase = Number(skill.baseRating) || 0;
        const allocatedRating = isGangTribeMember ? Math.min(gangTribeCap, rawAllocated) : rawAllocated;
        const baseRating = isGangTribeMember ? Math.min(gangTribeCap, rawBase) : rawBase;
        const concentrationRatingRaw = Number(skill.concentrationRating) || 0;
        const specializationRatingRaw = Number(skill.specializationRating) || 0;
        const concentrationRating = isGangTribeMember ? Math.min(gangTribeCap, concentrationRatingRaw) : concentrationRatingRaw;
        const specializationRating = isGangTribeMember ? Math.min(gangTribeCap, specializationRatingRaw) : specializationRatingRaw;
        skillsToCreate.push({
            name: skill.baseSkill,
            type: "skill",
            system: {
                baseSkill: skill.baseSkill,
                allocatedRating,
                baseRating,
                concentrationRating,
                specializationRating,
                concentration: skill.concentration ?? "",
                specialization: skill.specialization ?? "",
                category: skill.category ?? "active",
                requiresConcentration: false
            }
        });
    }

    if (skillsToCreate.length) {
        await actor.createEmbeddedDocuments("Item", skillsToCreate, { sr2SkipBudget: true });
    }

    const existingCyberwareNames = new Set(actor.items.filter(i => i.type === "cyberware").map(i => sr2NormalizeCatalogName(i.name)));
    const cyberwareToCreate = [];
    for (const cyberwareName of (archetype.cyberware || [])) {
        const key = sr2NormalizeCatalogName(cyberwareName);
        if (!key || existingCyberwareNames.has(key)) continue;
        cyberwareToCreate.push(await sr2BuildCyberwareItemData(cyberwareName, { installed: true }));
    }

    if (cyberwareToCreate.length) {
        await actor.createEmbeddedDocuments("Item", cyberwareToCreate, { sr2SkipBudget: true });
    }

    const existingSpellNames = new Set(actor.items.filter(i => i.type === "spell").map(i => sr2NormalizeCatalogName(i.name)));
    const spellsToCreate = [];
    const isSpellcaster = Boolean(archetype.magic?.awakened) && !Boolean(archetype.magic?.physicalAdept);
    if (isSpellcaster) {
        for (const spell of (archetype.spells || [])) {
            const spellName = String(spell?.name || "").trim();
            if (!spellName) continue;
            const key = sr2NormalizeCatalogName(spellName);
            if (existingSpellNames.has(key)) continue;
            spellsToCreate.push(await sr2BuildSpellItemData(spellName, { force: spell.force ?? 1 }));
        }
    }

    if (spellsToCreate.length) {
        await actor.createEmbeddedDocuments("Item", spellsToCreate, { sr2SkipBudget: true });
    }

    await sr2SyncFreeLanguageSkills(actor);
    await sr2RepairLegacySkillAllocatedRatings(actor);
    await actor.setFlag("shadowrun2e", "followerBootstrapApplied", true);

    const shouldOfferGearPurchase = !usesContactArchetype;
    if (shouldOfferGearPurchase && !actor.getFlag("shadowrun2e", "gearPurchaseOffered")) {
        try {
            new SR2GearPurchaseApp(actor, { archetypeKey }).render(true);
            await actor.setFlag("shadowrun2e", "gearPurchaseOffered", true);
        } catch (error) {
            console.error("SR2E | Failed to open gear purchase panel:", error);
        }
    }
});

/* -------------------------------------------- */
/*  Character Priorities Bootstrap              */
/* -------------------------------------------- */

Hooks.on("createActor", async function (actor, options, userId) {
    if (typeof userId === "string" && userId !== game.user.id) return;
    if (actor.type !== "character") return;
    if (actor.getFlag("shadowrun2e", "prioritiesApplied")) return;

    const priorities = actor.system?.priorities;
    if (!priorities) return;

    const anyPrioritiesSelected = Object.values(priorities).some(sr2IsPriorityLetter);
    if (!anyPrioritiesSelected) return;

    const updates = {};
    let computedAwakened = null;

    const racePriority = priorities.metatype;
    const currentMetatype = actor.system?.details?.metatype || "human";
    const allowedMetatypes = sr2GetAllowedMetatypesForPriority(racePriority);

    if (Array.isArray(allowedMetatypes) && allowedMetatypes.length) {
        if (!allowedMetatypes.includes(currentMetatype)) {
            updates["system.details.metatype"] = allowedMetatypes[0] ?? "human";
        }
    }

    const effectiveMetatype = updates["system.details.metatype"] ?? currentMetatype;
    const isMetahuman = SR2_METAHUMAN_METATYPES.includes(effectiveMetatype);
    const usesShiftedMagicPriority = isMetahuman && racePriority === "A";

    const magicPriority = priorities.magic;
    if (sr2IsPriorityLetter(magicPriority)) {
        let awakened = false;
        let physicalAdept = false;

        if (usesShiftedMagicPriority) {
            if (magicPriority === "B") awakened = true;
            else if (magicPriority === "C") {
                awakened = true;
                physicalAdept = true;
            }
        } else {
            if (magicPriority === "A") awakened = true;
            else if (magicPriority === "B") {
                awakened = true;
                physicalAdept = true;
            }
        }

        updates["system.magic.awakened"] = awakened;
        updates["system.magic.physicalAdept"] = physicalAdept;
        updates["system.attributes.magic.value"] = awakened ? Math.max(actor.system.attributes.magic.value || 0, 6) : 0;
        computedAwakened = awakened;
    }

    const attributePriority = priorities.attributes;
    if (sr2IsPriorityLetter(attributePriority)) {
        updates["system.creation.attributePoints"] = SR2_PRIORITY_TABLE.attributes[attributePriority] ?? 0;
    }

    const skillsPriority = priorities.skills;
    if (sr2IsPriorityLetter(skillsPriority)) {
        updates["system.creation.skillPoints"] = SR2_PRIORITY_TABLE.skills[skillsPriority] ?? 0;
    }

    const resourcesPriority = priorities.resources;
    if (sr2IsPriorityLetter(resourcesPriority)) {
        const resources = SR2_PRIORITY_TABLE.resources[resourcesPriority];
        // Only magicians (awakened/adepts) receive Force Points in SR2.
        const isMagician = computedAwakened ?? actor.system?.magic?.awakened ?? false;
        updates["system.creation.forcePoints"] = isMagician ? (resources?.forcePoints ?? 0) : 0;
        updates["system.creation.startingNuyen"] = resources?.nuyen ?? 0;

        // Only set nuyen automatically if the actor has the default 0 value.
        const currentNuyen = actor.system?.resources?.nuyen ?? 0;
        if (currentNuyen === 0 && typeof resources?.nuyen === "number") {
            updates["system.resources.nuyen"] = resources.nuyen;
        }
    }

    if (Object.keys(updates).length) {
        await actor.update(updates, { render: false });
    }

    await sr2SyncFreeLanguageSkills(actor);
    await actor.setFlag("shadowrun2e", "prioritiesApplied", true);
});

Hooks.on("createActor", async function (actor, options, userId) {
    if (typeof userId === "string" && userId !== game.user.id) return;
    if (actor.type !== "contact") return;

    if (actor.getFlag("shadowrun2e", "contactBootstrapApplied")) {
        await sr2RepairLegacySkillAllocatedRatings(actor);
        await sr2SyncFreeLanguageSkills(actor);
        return;
    }

    const archetypeKey = actor.system?.details?.archetype;
    const archetype = archetypeKey ? SR2_CONTACT_ARCHETYPES[archetypeKey] : null;
    if (!archetype) {
        await sr2SyncFreeLanguageSkills(actor);
        return;
    }

    // Apply metatype first so the metatype-change hook doesn't overwrite template attribute values.
    if (archetype.metatype && actor.system?.details?.metatype !== archetype.metatype) {
        await actor.update({ "system.details.metatype": archetype.metatype }, { render: false });
    }

    const updates = {};

    for (const [attributeKey, value] of Object.entries(archetype.attributes || {})) {
        updates[`system.attributes.${attributeKey}.value`] = value;
    }

    if (archetype.magic) {
        updates["system.magic.awakened"] = Boolean(archetype.magic.awakened);
        updates["system.magic.physicalAdept"] = Boolean(archetype.magic.physicalAdept);
        updates["system.magic.tradition"] = archetype.magic.tradition || "";

        const hasExplicitMagicValue = typeof archetype.attributes?.magic === "number";
        if ((archetype.magic.awakened || archetype.magic.physicalAdept) && !hasExplicitMagicValue) {
            updates["system.attributes.magic.value"] = Math.max(actor.system.attributes.magic.value || 0, 6);
        }
    }

    // Standardize contact name on create (Archetype - Leader).
    const leaderId = actor.system?.details?.leaderId;
    const leaderName = leaderId ? (game.actors.get(leaderId)?.name || "") : "";
    const archetypeLabel = archetype.label || "Contact";
    updates["name"] = leaderName ? `${archetypeLabel} - ${leaderName}` : `${archetypeLabel}`;

    const existingBio = actor.system?.biography;
    const shouldSetBiography = !String(existingBio || "").trim();

    if (Object.keys(updates).length) {
        await actor.update(updates);
        try {
            globalThis.ui?.actors?.render?.();
        } catch (err) {
            // Ignore.
        }
    }

    if (shouldSetBiography) {
        const biography = await sr2BuildContactBiography({ archetype, leaderName });
        const currentBio = actor.system?.biography;
        if (biography && !String(currentBio || "").trim()) {
            await actor.update({ "system.biography": biography });
        }
    }

    const normalizedSkillKey = (baseSkill, concentration, specialization) =>
        `${sr2NormalizeCatalogName(baseSkill)}|${sr2NormalizeCatalogName(concentration)}|${sr2NormalizeCatalogName(specialization)}`;

    const existingSkillKeys = new Set(
        actor.items
            .filter(i => i.type === "skill")
            .map(i => normalizedSkillKey(i.system?.baseSkill || i.name, i.system?.concentration, i.system?.specialization))
    );

    const skillsToCreate = [];
    for (const skill of (archetype.skills || [])) {
        const key = normalizedSkillKey(skill.baseSkill, skill.concentration, skill.specialization);
        if (existingSkillKeys.has(key)) continue;
        const allocatedRating = Number(skill.allocatedRating ?? skill.baseRating) || 0;
        skillsToCreate.push({
            name: skill.baseSkill,
            type: "skill",
            system: {
                baseSkill: skill.baseSkill,
                allocatedRating,
                baseRating: skill.baseRating ?? 0,
                concentrationRating: skill.concentrationRating ?? 0,
                specializationRating: skill.specializationRating ?? 0,
                concentration: skill.concentration ?? "",
                specialization: skill.specialization ?? "",
                category: skill.category ?? "active",
                requiresConcentration: false
            }
        });
    }

    if (skillsToCreate.length) {
        await actor.createEmbeddedDocuments("Item", skillsToCreate, { sr2SkipBudget: true });
    }

    const existingCyberwareNames = new Set(actor.items.filter(i => i.type === "cyberware").map(i => sr2NormalizeCatalogName(i.name)));
    const cyberwareToCreate = [];
    for (const cyberwareName of (archetype.cyberware || [])) {
        const key = sr2NormalizeCatalogName(cyberwareName);
        if (!key || existingCyberwareNames.has(key)) continue;
        cyberwareToCreate.push(await sr2BuildCyberwareItemData(cyberwareName, { installed: true }));
    }

    if (cyberwareToCreate.length) {
        await actor.createEmbeddedDocuments("Item", cyberwareToCreate, { sr2SkipBudget: true });
    }

    const existingSpellNames = new Set(actor.items.filter(i => i.type === "spell").map(i => sr2NormalizeCatalogName(i.name)));
    const spellsToCreate = [];
    const isSpellcaster = Boolean(archetype.magic?.awakened) && !Boolean(archetype.magic?.physicalAdept);
    if (isSpellcaster) {
        for (const spell of (archetype.spells || [])) {
            const spellName = String(spell?.name || "").trim();
            if (!spellName) continue;
            const key = sr2NormalizeCatalogName(spellName);
            if (existingSpellNames.has(key)) continue;
            spellsToCreate.push(await sr2BuildSpellItemData(spellName, { force: spell.force ?? 1 }));
        }
    }

    if (spellsToCreate.length) {
        await actor.createEmbeddedDocuments("Item", spellsToCreate, { sr2SkipBudget: true });
    }

    await sr2SyncFreeLanguageSkills(actor);
    await sr2RepairLegacySkillAllocatedRatings(actor);
    await actor.setFlag("shadowrun2e", "contactBootstrapApplied", true);
});

/* -------------------------------------------- */
/*  Connection Folder Organization               */
/* -------------------------------------------- */

function sr2GetConnectionFolderParentId(folder) {
    const parent = folder?.folder ?? folder?.parent;
    if (typeof parent === "string") return parent;
    return parent?.id ?? null;
}

function sr2GetConnectionFolderFlag(folder) {
    try {
        const flag = folder?.getFlag?.("shadowrun2e", "connectionFolder");
        if (flag) return flag;
    } catch (err) {
        // Ignore.
    }
    return folder?.flags?.shadowrun2e?.connectionFolder ?? null;
}

function sr2ConnectionFolderFlagsMatch(actual, expected) {
    if (!actual || !expected) return false;
    if (actual.kind !== expected.kind) return false;
    if ((actual.connectionType ?? null) !== (expected.connectionType ?? null)) return false;
    if ((actual.leaderId ?? null) !== (expected.leaderId ?? null)) return false;
    return true;
}

function sr2GetConnectionTypeFolderName(connectionType) {
    if (connectionType === "contact") return "Contacts";
    if (connectionType === "follower") return "Followers";
    return null;
}

async function sr2EnsureActorConnectionFolderSegment({ name, parentId = null, expectedFlag }) {
    const allFolders = globalThis.game?.folders ?? [];
    const candidates = allFolders.filter(f => f?.type === "Actor" && sr2GetConnectionFolderParentId(f) === parentId);

    const byFlag = candidates.find(f => sr2ConnectionFolderFlagsMatch(sr2GetConnectionFolderFlag(f), expectedFlag));
    if (byFlag) {
        return byFlag;
    }

    const byName = candidates.find(f => String(f?.name || "") === String(name || ""));
    if (byName) {
        if (game?.user?.isGM) {
            try {
                await byName.setFlag("shadowrun2e", "connectionFolder", expectedFlag);
            } catch (err) {
                // Ignore.
            }
        }
        return byName;
    }

    if (!game?.user?.isGM) return null;

    try {
        return await Folder.create({
            name,
            type: "Actor",
            folder: parentId,
            flags: {
                shadowrun2e: {
                    connectionFolder: expectedFlag
                }
            }
        });
    } catch (err) {
        console.warn("SR2E | Failed to create connection folder:", err);
        return null;
    }
}

async function sr2GetOrCreateActorConnectionFolder({ mode, leaderActor, connectionType }) {
    const leaderId = leaderActor?.id;
    const leaderName = String(leaderActor?.name || "").trim();
    if (!leaderId || !leaderName) return null;

    const typeFolderName = sr2GetConnectionTypeFolderName(connectionType);
    if (!typeFolderName) return null;

    const typeSegment = {
        name: typeFolderName,
        expectedFlag: { kind: "type", connectionType }
    };

    const playerSegment = {
        name: leaderName,
        expectedFlag: { kind: "player", leaderId }
    };

    let segments = [];
    switch (String(mode || "disabled")) {
        case "perType":
            segments = [typeSegment];
            break;
        case "perPlayer":
            segments = [playerSegment];
            break;
        case "perTypePerPlayer":
            segments = [typeSegment, playerSegment];
            break;
        case "perPlayerPerType":
            segments = [playerSegment, typeSegment];
            break;
        default:
            return null;
    }

    let parentId = null;
    let folder = null;
    for (const segment of segments) {
        folder = await sr2EnsureActorConnectionFolderSegment({
            name: segment.name,
            parentId,
            expectedFlag: segment.expectedFlag
        });
        if (!folder?.id) return null;
        parentId = folder.id;
    }

    return folder;
}

async function sr2ApplyNestedConnectionFolder(actor) {
    if (!actor || !["contact", "follower"].includes(actor.type)) return;

    const mode = sr2GetSystemSetting("nestedConnectionFolders", "disabled");
    if (!mode || mode === "disabled") return;

    const leaderId = actor.system?.details?.leaderId;
    if (!leaderId) return;

    const leader = globalThis.game?.actors?.get(leaderId);
    if (!leader || leader.type !== "character") return;

    const targetFolder = await sr2GetOrCreateActorConnectionFolder({
        mode,
        leaderActor: leader,
        connectionType: actor.type
    });
    if (!targetFolder?.id) return;

    const currentFolderId = actor.folder?.id ?? actor.folder ?? null;
    if (currentFolderId === targetFolder.id) return;

    try {
        await actor.update({ folder: targetFolder.id }, { sr2AssigningConnectionFolder: true });
        try {
            globalThis.ui?.actors?.render?.();
        } catch (err) {
            // Ignore.
        }
    } catch (err) {
        console.warn("SR2E | Failed to assign connection folder:", err);
    }
}

Hooks.on("createActor", async function (actor, options, userId) {
    if (typeof userId === "string" && userId !== game.user.id) return;
    await sr2ApplyNestedConnectionFolder(actor);
});

Hooks.on("updateActor", async function (actor, changes, options, userId) {
    if (options?.sr2AssigningConnectionFolder) return;
    if (typeof userId === "string" && globalThis.game?.user?.id && userId !== game.user.id) return;
    if (!actor || !["contact", "follower"].includes(actor.type)) return;

    const getProperty = globalThis.foundry?.utils?.getProperty;
    if (typeof getProperty !== "function") return;

    if (getProperty(changes, "system.details.leaderId") === undefined) return;
    await sr2ApplyNestedConnectionFolder(actor);
});

/* -------------------------------------------- */
/*  Creation Nuyen Budget Enforcement           */
/* -------------------------------------------- */

function sr2IsCreationMode(actor) {
    const completed = actor?.getFlag?.("shadowrun2e", "creationCompleted");
    if (completed === true) return false;

    const flagged = actor?.getFlag?.("shadowrun2e", "creationMode");
    if (typeof flagged === "boolean") return flagged;

    const hasCreationPoints =
        (Number(actor?.system?.creation?.attributePoints) || 0) > 0 ||
        (Number(actor?.system?.creation?.skillPoints) || 0) > 0 ||
        (Number(actor?.system?.creation?.forcePoints) || 0) > 0;
    return hasCreationPoints;
}

/* -------------------------------------------- */
/*  Creation Mode Completion Lock               */
/* -------------------------------------------- */

Hooks.on("preUpdateActor", function (actor, changes, options, userId) {
    if (typeof userId === "string" && globalThis.game?.user?.id && userId !== game.user.id) return;
    if (!["character", "contact", "follower"].includes(actor.type)) return;

    const getProperty = globalThis.foundry?.utils?.getProperty;
    const setProperty = globalThis.foundry?.utils?.setProperty;
    if (typeof getProperty !== "function" || typeof setProperty !== "function") return;

    const toBool = (value) => {
        if (value === undefined) return undefined;
        if (value === null) return false;
        if (typeof value === "boolean") return value;
        if (typeof value === "number") return value !== 0;
        if (typeof value === "string") {
            const v = value.trim().toLowerCase();
            if (v === "true") return true;
            if (v === "false") return false;
            if (v === "1") return true;
            if (v === "0") return false;
        }
        return Boolean(value);
    };

    const currentCompleted = toBool(actor.getFlag?.("shadowrun2e", "creationCompleted")) === true;
    const nextCompletedRaw = getProperty(changes, "flags.shadowrun2e.creationCompleted");
    const nextCompleted = toBool(nextCompletedRaw);
    const unsetCompleted = getProperty(changes, "flags.shadowrun2e.-=creationCompleted") !== undefined;

    const shouldLock = currentCompleted || nextCompleted === true;
    if (!shouldLock) return;

    // Prevent unsetting or turning off completion once set.
    if (unsetCompleted) {
        try { delete changes.flags?.shadowrun2e?.["-=creationCompleted"]; } catch (err) { /* ignore */ }
        setProperty(changes, "flags.shadowrun2e.creationCompleted", true);
        if (currentCompleted) ui.notifications.warn("Character Generation is already finalized and cannot be reopened.");
    }
    if (nextCompleted === false) {
        setProperty(changes, "flags.shadowrun2e.creationCompleted", true);
        if (currentCompleted) ui.notifications.warn("Character Generation is already finalized and cannot be reopened.");
    }

    // If completion is being set (now or previously), force creationMode off and block attempts to re-enable.
    const unsetCreationMode = getProperty(changes, "flags.shadowrun2e.-=creationMode") !== undefined;
    if (unsetCreationMode) {
        try { delete changes.flags?.shadowrun2e?.["-=creationMode"]; } catch (err) { /* ignore */ }
        setProperty(changes, "flags.shadowrun2e.creationMode", false);
    }

    const nextCreationModeRaw = getProperty(changes, "flags.shadowrun2e.creationMode");
    const nextCreationMode = toBool(nextCreationModeRaw);
    if (nextCreationMode === true) {
        setProperty(changes, "flags.shadowrun2e.creationMode", false);
        if (currentCompleted) ui.notifications.warn("Character Generation is locked off for this actor.");
    } else if (nextCompleted === true && nextCreationModeRaw === undefined) {
        setProperty(changes, "flags.shadowrun2e.creationMode", false);
    }
});

/* -------------------------------------------- */
/*  Contact Levels Enforcement                  */
/* -------------------------------------------- */

Hooks.on("preCreateActor", function (actor, data, options, userId) {
    if (typeof userId === "string" && globalThis.game?.user?.id && userId !== game.user.id) return;
    if (!sr2AreContactLevelsEnabled()) return;

    const type = data?.type ?? actor.type;
    if (type !== "contact") return;

    const leaderId = data?.system?.details?.leaderId;
    if (!leaderId) return;

    const leader = globalThis.game?.actors?.get(leaderId);
    if (!leader || leader.type !== "character") return;
    if (!sr2IsCreationMode(leader)) return;
    if (leader.system?.creation?.resourcesFinalized) return;

    const charisma = Number(leader.system?.attributes?.charisma?.value) || 0;
    const linkedContacts = globalThis.game?.actors?.filter(a => a.type === "contact" && a.system?.details?.leaderId === leaderId) ?? [];
    const contacts = linkedContacts.map(a => ({ id: a.id, sort: Number(a.sort) || 0, contactLevel: a.system?.details?.contactLevel }));
    contacts.push({ id: "__sr2PendingContact", sort: Number.MAX_SAFE_INTEGER, contactLevel: data?.system?.details?.contactLevel });

    const summary = sr2ComputeContactLevelSummary(contacts, charisma);
    if (summary.over.extraContacts) {
        ui.notifications.error("Too many contacts (max extra contacts is 3× Charisma, plus two free).");
        return false;
    }
    if (summary.over.extraLevel2) {
        ui.notifications.error("Too many Level 2+ contacts (max extra Level 2 upgrades is 2× Charisma).");
        return false;
    }
    if (summary.over.extraLevel3) {
        ui.notifications.error("Too many Level 3 contacts (max extra Level 3 upgrades is 1× Charisma).");
        return false;
    }

    const budget = Number(leader.system?.creation?.startingNuyen) || 0;
    if (budget > 0) {
        const breakdown = sr2ComputeCreationNuyenBudgetBreakdown(leader.system, leader.items, {
            disableBuddies: sr2AreBuddiesDisabled(),
            contactLevelsSummary: summary
        });
        if ((breakdown.remainingNuyen || 0) < 0) {
            ui.notifications.error("Not enough creation Nuyen remaining for that contact.");
            return false;
        }
    }
});

Hooks.on("preUpdateActor", function (actor, changes, options, userId) {
    if (typeof userId === "string" && globalThis.game?.user?.id && userId !== game.user.id) return;

    const getProperty = globalThis.foundry?.utils?.getProperty;
    const setProperty = globalThis.foundry?.utils?.setProperty;
    if (typeof getProperty !== "function" || typeof setProperty !== "function") return;

    // House rule: Contact Levels implies no Buddies (and the Disable Buddies setting removes them too).
    if (actor.type === "character" && sr2AreBuddiesDisabled()) {
        const rawBuddy = getProperty(changes, "system.creation.extras.buddy");
        if (rawBuddy !== undefined && (Number(rawBuddy) || 0) > 0) {
            setProperty(changes, "system.creation.extras.buddy", 0);
            ui.notifications.warn("Buddies are disabled for this world.");
        }
    }

    if (!sr2AreContactLevelsEnabled()) return;
    if (actor.type !== "contact") return;

    const rawContactLevel = getProperty(changes, "system.details.contactLevel");
    const nextLeaderId = getProperty(changes, "system.details.leaderId");
    const affectsContactLimitsOrCost = rawContactLevel !== undefined || nextLeaderId !== undefined;
    if (!affectsContactLimitsOrCost) return;

    if (rawContactLevel !== undefined) {
        const clamped = Math.max(1, Math.min(3, parseInt(rawContactLevel, 10) || 1));
        if (clamped !== Number(rawContactLevel)) setProperty(changes, "system.details.contactLevel", clamped);
    }

    const leaderId = nextLeaderId !== undefined ? nextLeaderId : actor.system?.details?.leaderId;
    if (!leaderId) return;

    const leader = globalThis.game?.actors?.get(leaderId);
    if (!leader || leader.type !== "character") return;
    if (!sr2IsCreationMode(leader)) return;
    if (leader.system?.creation?.resourcesFinalized) return;

    const previousLeaderId = actor.system?.details?.leaderId || "";
    const isLeaderTransfer = typeof nextLeaderId === "string" && nextLeaderId !== previousLeaderId;
    const nextContactLevel = rawContactLevel !== undefined
        ? (getProperty(changes, "system.details.contactLevel") ?? rawContactLevel)
        : actor.system?.details?.contactLevel;

    const summary = sr2GetContactLevelsSummaryForLeader(leader, {
        id: actor.id,
        sort: isLeaderTransfer ? Number.MAX_SAFE_INTEGER : (Number(actor.sort) || Number.MAX_SAFE_INTEGER),
        contactLevel: nextContactLevel
    });
    if (!summary) return;

    if (summary.over.extraContacts) {
        ui.notifications.error("Too many contacts (max extra contacts is 3× Charisma, plus two free).");
        return false;
    }
    if (summary.over.extraLevel2) {
        ui.notifications.error("Too many Level 2+ contacts (max extra Level 2 upgrades is 2× Charisma).");
        return false;
    }
    if (summary.over.extraLevel3) {
        ui.notifications.error("Too many Level 3 contacts (max extra Level 3 upgrades is 1× Charisma).");
        return false;
    }

    const budget = Number(leader.system?.creation?.startingNuyen) || 0;
    if (budget > 0) {
        const breakdown = sr2ComputeCreationNuyenBudgetBreakdown(leader.system, leader.items, {
            disableBuddies: sr2AreBuddiesDisabled(),
            contactLevelsSummary: summary
        });
        if ((breakdown.remainingNuyen || 0) < 0) {
            ui.notifications.error("Not enough creation Nuyen remaining for that contact change.");
            return false;
        }
    }
});

Hooks.on("preCreateItem", function (item, data, options, userId) {
    if (typeof userId === "string" && globalThis.game?.user?.id && userId !== game.user.id) return;
    if (options?.sr2SkipBudget) return;

    const actor = item?.parent;
    if (!actor || !["character", "contact", "follower"].includes(actor.type)) return;
    if (!sr2IsCreationMode(actor)) return;
    if (actor.system?.creation?.resourcesFinalized) return;

    const budget = Number(actor.system?.creation?.startingNuyen) || 0;
    if (budget <= 0) return;

    const type = data?.type ?? item.type;
    if (["skill", "spell", "adeptpower", "totem"].includes(type)) return;

    const system = data?.system || {};
    const previewItem = {
        type,
        system: {
            price: system.price ?? system.cost ?? 0,
            quantity: system.quantity ?? 1
        }
    };

    const breakdownOptions = {
        disableBuddies: sr2AreBuddiesDisabled()
    };
    const contactLevelsSummary = sr2GetContactLevelsSummaryForLeader(actor);
    if (contactLevelsSummary) breakdownOptions.contactLevelsSummary = contactLevelsSummary;

    const breakdown = sr2ComputeCreationNuyenBudgetBreakdown(actor.system, actor.items, breakdownOptions);
    const newItemCost = sr2ComputeItemNuyenSpent([previewItem]);
    if ((breakdown.remainingNuyen || 0) - newItemCost < 0) {
        ui.notifications.error("Not enough creation Nuyen remaining for that item.");
        return false;
    }
});

Hooks.on("preUpdateItem", function (item, changes, options, userId) {
    if (typeof userId === "string" && globalThis.game?.user?.id && userId !== game.user.id) return;
    if (options?.sr2SkipBudget) return;

    const actor = item?.parent;
    if (!actor || !["character", "contact", "follower"].includes(actor.type)) return;
    if (!sr2IsCreationMode(actor)) return;
    if (actor.system?.creation?.resourcesFinalized) return;

    const budget = Number(actor.system?.creation?.startingNuyen) || 0;
    if (budget <= 0) return;

    const type = item.type;
    if (["skill", "spell", "adeptpower", "totem"].includes(type)) return;

    const getProperty = globalThis.foundry?.utils?.getProperty;
    if (typeof getProperty !== "function") return;

    const oldPrice = Number(item.system?.price ?? item.system?.cost) || 0;
    const oldQty = Math.max(1, Number(item.system?.quantity) || 1);
    const oldCost = Math.max(0, oldPrice) * oldQty;

    const nextPriceRaw = getProperty(changes, "system.price");
    const nextCostRaw = getProperty(changes, "system.cost");
    const nextQtyRaw = getProperty(changes, "system.quantity");

    const nextPrice = Number(nextPriceRaw ?? nextCostRaw ?? oldPrice) || 0;
    const nextQty = Math.max(1, Number(nextQtyRaw ?? oldQty) || 1);
    const nextCost = Math.max(0, nextPrice) * nextQty;

    const delta = nextCost - oldCost;
    if (delta <= 0) return;

    const breakdownOptions = {
        disableBuddies: sr2AreBuddiesDisabled()
    };
    const contactLevelsSummary = sr2GetContactLevelsSummaryForLeader(actor);
    if (contactLevelsSummary) breakdownOptions.contactLevelsSummary = contactLevelsSummary;

    const breakdown = sr2ComputeCreationNuyenBudgetBreakdown(actor.system, actor.items, breakdownOptions);
    if ((breakdown.remainingNuyen || 0) - delta < 0) {
        ui.notifications.error("Not enough creation Nuyen remaining for that change.");
        return false;
    }
});

/* -------------------------------------------- */
/*  Creation Force Point Enforcement            */
/* -------------------------------------------- */

function sr2ClampCreationSpellForce(force) {
    const num = Number(force);
    if (!Number.isFinite(num)) return 1;
    return Math.max(1, Math.min(6, Math.floor(num)));
}

Hooks.on("preCreateItem", function (item, data, options, userId) {
    if (typeof userId === "string" && globalThis.game?.user?.id && userId !== game.user.id) return;
    if (options?.sr2SkipBudget) return;

    const actor = item?.parent;
    if (!actor || !["character", "contact", "follower"].includes(actor.type)) return;
    if (!sr2IsCreationMode(actor)) return;

    const type = data?.type ?? item.type;
    if (type !== "spell") return;

    // In SR2 character creation, starting spell Force is capped at 6.
    const rawForce = data?.system?.force;
    const nextForce = rawForce === undefined ? 1 : sr2ClampCreationSpellForce(rawForce);
    if (rawForce !== undefined && nextForce !== Number(rawForce)) {
        ui.notifications.error("In creation mode, spell Force must be between 1 and 6.");
        return false;
    }
});

Hooks.on("preUpdateItem", function (item, changes, options, userId) {
    if (typeof userId === "string" && globalThis.game?.user?.id && userId !== game.user.id) return;
    if (options?.sr2SkipBudget) return;

    const actor = item?.parent;
    if (!actor || !["character", "contact", "follower"].includes(actor.type)) return;
    if (!sr2IsCreationMode(actor)) return;
    if (item.type !== "spell") return;

    const getProperty = globalThis.foundry?.utils?.getProperty;
    const setProperty = globalThis.foundry?.utils?.setProperty;
    if (typeof getProperty !== "function" || typeof setProperty !== "function") return;

    const rawForce = getProperty(changes, "system.force");
    if (rawForce === undefined) return;

    const nextForce = sr2ClampCreationSpellForce(rawForce);
    if (nextForce !== Number(rawForce)) {
        ui.notifications.warn("In creation mode, spell Force must be between 1 and 6.");
        setProperty(changes, "system.force", nextForce);
    }
});

function sr2GetCreationItemForcePointCost({ type, name, system }) {
    if (type === "spell") return Math.max(0, Number(system?.force) || 0);
    if (type !== "gear") return 0;

    const quantity = Math.max(1, Number(system?.quantity) || 1);

    const explicitBondCost = Number(system?.bondCost) || 0;
    const perItemCost = explicitBondCost > 0
        ? explicitBondCost
        : sr2InferFocusBondCostForGearItem({
            category: system?.category,
            name,
            price: system?.price ?? system?.cost ?? 0
        });

    return perItemCost > 0 ? perItemCost * quantity : 0;
}

Hooks.on("preCreateItem", function (item, data, options, userId) {
    if (typeof userId === "string" && globalThis.game?.user?.id && userId !== game.user.id) return;
    if (options?.sr2SkipBudget) return;

    const actor = item?.parent;
    if (!actor || !["character", "contact", "follower"].includes(actor.type)) return;
    if (!sr2IsCreationMode(actor)) return;

    const type = data?.type ?? item.type;
    const system = data?.system || {};
    const name = data?.name ?? item.name;
    const cost = sr2GetCreationItemForcePointCost({ type, name, system });
    if (cost <= 0) return;

    const totalForcePoints = Number(actor.system?.creation?.forcePoints) || 0;
    if (totalForcePoints <= 0) {
        ui.notifications.error("This character has no Force Points available for spells/foci in creation mode.");
        return false;
    }

    const spent = sr2ComputeForcePointsSpent(actor.items);
    if (spent + cost > totalForcePoints) {
        ui.notifications.error("Not enough Force Points remaining. Reduce other spells/foci first.");
        return false;
    }
});

Hooks.on("preUpdateItem", function (item, changes, options, userId) {
    if (typeof userId === "string" && globalThis.game?.user?.id && userId !== game.user.id) return;
    if (options?.sr2SkipBudget) return;

    const actor = item?.parent;
    if (!actor || !["character", "contact", "follower"].includes(actor.type)) return;
    if (!sr2IsCreationMode(actor)) return;

    const getProperty = globalThis.foundry?.utils?.getProperty;
    if (typeof getProperty !== "function") return;

    const totalForcePoints = Number(actor.system?.creation?.forcePoints) || 0;

    let oldCost = 0;
    let nextCost;

    if (item.type === "spell") {
        const raw = getProperty(changes, "system.force");
        if (raw === undefined) return;
        oldCost = Math.max(0, Number(item.system?.force) || 0);
        nextCost = Math.max(0, Number(raw) || 0);
    } else if (item.type === "gear") {
        const rawBondCost = getProperty(changes, "system.bondCost");
        const rawQuantity = getProperty(changes, "system.quantity");
        const rawCategory = getProperty(changes, "system.category");
        const rawPrice = getProperty(changes, "system.price");
        const rawCost = getProperty(changes, "system.cost");
        const rawName = getProperty(changes, "name");

        if (
            rawBondCost === undefined &&
            rawQuantity === undefined &&
            rawCategory === undefined &&
            rawPrice === undefined &&
            rawCost === undefined &&
            rawName === undefined
        ) return;

        oldCost = sr2GetCreationItemForcePointCost({ type: "gear", name: item.name, system: item.system });
        nextCost = sr2GetCreationItemForcePointCost({
            type: "gear",
            name: rawName === undefined ? item.name : rawName,
            system: {
                bondCost: rawBondCost === undefined ? item.system?.bondCost : rawBondCost,
                quantity: rawQuantity === undefined ? item.system?.quantity : rawQuantity,
                category: rawCategory === undefined ? item.system?.category : rawCategory,
                price: rawPrice === undefined ? item.system?.price : rawPrice,
                cost: rawCost === undefined ? item.system?.cost : rawCost
            }
        });
    } else {
        return;
    }

    if (nextCost <= oldCost) return;

    if (totalForcePoints <= 0) {
        ui.notifications.error("This character has no Force Points available for spells/foci in creation mode.");
        return false;
    }

    const spent = sr2ComputeForcePointsSpent(actor.items);
    const delta = nextCost - oldCost;
    if (spent + delta > totalForcePoints) {
        ui.notifications.error("Not enough Force Points remaining. Reduce other spells/foci first.");
        return false;
    }
});

/* -------------------------------------------- */
/*  Magic Skill Restrictions                    */
/* -------------------------------------------- */

Hooks.on("preCreateItem", function (item, data, options, userId) {
    if (typeof userId === "string" && globalThis.game?.user?.id && userId !== game.user.id) return;
    if (options?.sr2SkipBudget) return;

    const actor = item?.parent;
    if (!actor || !["character", "contact", "follower"].includes(actor.type)) return;

    const type = data?.type ?? item.type;
    if (type !== "skill") return;

    const baseSkill = data?.system?.baseSkill;
    if (baseSkill !== "Sorcery" && baseSkill !== "Conjuring") return;

    const magicRating = Number(actor.system?.attributes?.magic?.value) || 0;
    if (magicRating > 0) return;

    ui.notifications.error("Sorcery and Conjuring require a Magic rating.");
    return false;
});

Hooks.on("preUpdateItem", function (item, changes, options, userId) {
    if (typeof userId === "string" && globalThis.game?.user?.id && userId !== game.user.id) return;
    if (options?.sr2SkipBudget) return;

    const actor = item?.parent;
    if (!actor || !["character", "contact", "follower"].includes(actor.type)) return;
    if (item.type !== "skill") return;

    const getProperty = globalThis.foundry?.utils?.getProperty;
    if (typeof getProperty !== "function") return;

    const nextBaseSkill = getProperty(changes, "system.baseSkill");
    if (nextBaseSkill !== "Sorcery" && nextBaseSkill !== "Conjuring") return;

    const magicRating = Number(actor.system?.attributes?.magic?.value) || 0;
    if (magicRating > 0) return;

    ui.notifications.error("Sorcery and Conjuring require a Magic rating.");
    return false;
});

/* -------------------------------------------- */
/*  System Settings                             */
/* -------------------------------------------- */

function registerSystemSettings() {
    // Core system toggle: roll mechanic.
    game.settings.register("shadowrun2e", "useTargetNumbers", {
        name: "Use Target Numbers",
        hint: "Use target numbers for dice rolls instead of open-ended rolling",
        scope: "world",
        config: true,
        type: Boolean,
        default: true
    });

    // UI convenience: token selection quick actions popup (client-side).
    game.settings.register("shadowrun2e", "tokenQuickActions", {
        name: "Token Quick Actions",
        hint: "Show a small quick-actions popup when you select a token you control.",
        scope: "client",
        config: true,
        type: Boolean,
        default: true
    });

    // Client-only: persist per-user size for the Token Quick Actions popup.
    game.settings.register("shadowrun2e", "quickActionsWidth", {
        name: "Token Quick Actions Width",
        scope: "client",
        config: false,
        type: Number,
        default: 300
    });

    game.settings.register("shadowrun2e", "quickActionsHeight", {
        name: "Token Quick Actions Height",
        scope: "client",
        config: false,
        type: Number,
        default: 360
    });

    // House rule: Metatype priority restrictions.
    // - Default: Metahumans require Metatype priority A.
    // - Enabled: Allow metahumans at priorities A–C.
    game.settings.register("shadowrun2e", "moreMetahumans", {
        name: "More Metahumans",
        hint: "Allow selecting Elf/Dwarf/Ork/Troll at Metatype priorities A–C (default is A only).",
        scope: "world",
        config: true,
        type: Boolean,
        default: false,
        restricted: true
    });

    // House rule: Contact Levels (SR2-style contacts with upgrade tiers).
    // - Contacts are Level 1–3.
    // - Two free Level 1 contacts.
    // - Extra contacts: ¥5,000 each (max 3× Charisma, excluding the two free).
    // - Upgrades: +¥3,000 to Level 2 (max extra 2× Charisma), +¥7,000 to Level 3 (max extra 1× Charisma).
    // - No Buddies (this setting implies Disable Buddies).
    // - Followers are selected from Contact templates; Gang/Tribe followers remain and are capped to max 3 attributes/skills.
    // - Enforcement is creation-mode only (before Resources are finalized).
    game.settings.register("shadowrun2e", "contactLevels", {
        name: "Contact Levels",
        hint: "Enable Contact Levels (L1–L3) with SR2-style costs, limits, and upgrades during creation.",
        scope: "world",
        config: true,
        type: Boolean,
        default: false,
        restricted: true
    });

    // House rule: remove Buddies from character creation entirely.
    game.settings.register("shadowrun2e", "disableBuddies", {
        name: "Disable Buddies",
        hint: "Remove the Buddy creation extra (no purchase button, no cost, no budget impact).",
        scope: "world",
        config: true,
        type: Boolean,
        default: false,
        restricted: true
    });

    game.settings.register("shadowrun2e", "nestedConnectionFolders", {
        name: "Nested Connection Folders",
        hint: "Control how Connections are organized into nested folders.",
        scope: "world",
        config: true,
        type: String,
        choices: {
            disabled: "Disabled",
            perType: "Per Type",
            perPlayer: "Per Player",
            perTypePerPlayer: "Per Type Per Player",
            perPlayerPerType: "Per Player Per Type"
        },
        default: "disabled",
        restricted: true
    });

    game.settings.register("shadowrun2e", "dataImported", {
        name: "Data Imported",
        hint: "Whether the system data has been imported into compendiums",
        scope: "world",
        config: false,
        type: Boolean,
        default: false
    });

    game.settings.registerMenu("shadowrun2e", "dataImport", {
        name: "Import System Data",
        label: "Import Data",
        hint: "Import cyberware, bioware, spells, and other items into compendiums",
        icon: "fas fa-download",
        type: DataImportConfig,
        restricted: true
    });

    game.settings.registerMenu("shadowrun2e", "characterImport", {
        name: "Import Character",
        label: "Import Character",
        hint: "Import a character from JSON file",
        icon: "fas fa-user-plus",
        type: CharacterImportConfig,
        restricted: false
    });
}

/* -------------------------------------------- */
/*  Handlebars Helpers                          */
/* -------------------------------------------- */

function preloadHandlebarsTemplates() {
    const templatePaths = [
        "systems/shadowrun2e/templates/actor/character-sheet.html",
        "systems/shadowrun2e/templates/actor/cyberdeck-sheet.html",
        "systems/shadowrun2e/templates/actor/vehicle-sheet.html",
        "systems/shadowrun2e/templates/actor/spirit-sheet.html",
        "systems/shadowrun2e/templates/item/item-sheet.html",
        "systems/shadowrun2e/templates/apps/initiative-tracker.html",
        "systems/shadowrun2e/templates/apps/quick-actions.html",
        "systems/shadowrun2e/templates/apps/item-browser.html",
        "systems/shadowrun2e/templates/apps/gear-purchase.html",
        "systems/shadowrun2e/templates/apps/data-import.html",
        "systems/shadowrun2e/templates/apps/character-import.html",
        "systems/shadowrun2e/templates/chat/dice-roll.html"
    ];

    return loadTemplates(templatePaths);
}

/* -------------------------------------------- */
/*  Handlebars Helpers                          */
/* -------------------------------------------- */

function registerHandlebarsHelpers() {
    // Helper to calculate initiative phases
    Handlebars.registerHelper('phases', function (initiative) {
        const phases = [];
        let currentInit = initiative;
        while (currentInit > 0) {
            phases.push(currentInit);
            currentInit -= 10;
        }
        return phases;
    });

    // Helper for greater than comparison
    Handlebars.registerHelper('gt', function (a, b) {
        return a > b;
    });

    // Helper for equality comparison
    Handlebars.registerHelper('eq', function (a, b) {
        return a === b;
    });

    // Helper to get array element by index
    Handlebars.registerHelper('lookup', function (array, index) {
        return array[index];
    });

    // Helper for string capitalization
    Handlebars.registerHelper('capitalize', function (str) {
        if (typeof str !== 'string') return '';
        return str.charAt(0).toUpperCase() + str.slice(1);
    });

    // Helper for mathematical operations
    Handlebars.registerHelper('math', function (lvalue, operator, rvalue, options) {
        lvalue = parseFloat(lvalue);
        rvalue = parseFloat(rvalue);

        return {
            "+": lvalue + rvalue,
            "-": lvalue - rvalue,
            "*": lvalue * rvalue,
            "/": lvalue / rvalue,
            "%": lvalue % rvalue
        }[operator];
    });

    // Helper for less than or equal comparison
    Handlebars.registerHelper('lte', function (a, b) {
        return a <= b;
    });

    // Helper for less than comparison
    Handlebars.registerHelper('lt', function (a, b) {
        return a < b;
    });

    // Helper for creating repeated elements (like damage boxes)
    Handlebars.registerHelper('times', function (n, block) {
        let accum = '';
        for (let i = 0; i < n; ++i) {
            accum += block.fn({ index: i });
        }
        return accum;
    });

    // Helper for addition
    Handlebars.registerHelper('add', function (a, b) {
        return a + b;
    });

    // Helper for safe number display (handles NaN and undefined)
    Handlebars.registerHelper('safeNumber', function (value, defaultValue = 0) {
        if (typeof value === 'number' && !isNaN(value)) {
            return value;
        }
        return defaultValue;
    });

    console.log('SR2E | Registered safeNumber Handlebars helper');
}

/* -------------------------------------------- */
/*  Data Import Configuration                   */
/* -------------------------------------------- */

class DataImportConfig extends FormApplication {
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            id: "sr2-data-import",
            title: "Import Shadowrun 2E Data",
            template: "systems/shadowrun2e/templates/apps/data-import.html",
            width: 400,
            height: 300,
            classes: ["shadowrun2e", "data-import"]
        });
    }

    getData() {
        return {
            dataImported: game.settings.get("shadowrun2e", "dataImported")
        };
    }

    activateListeners(html) {
        super.activateListeners(html);
        html.find('.import-data').click(this._onImportData.bind(this));
        html.find('.clear-data').click(this._onClearData.bind(this));
    }

    async _onImportData(event) {
        event.preventDefault();
        ui.notifications.info("Starting data import...");

        try {
            await SR2DataImporter.importAllData();
            await game.settings.set("shadowrun2e", "dataImported", true);
            this.render();
        } catch (error) {
            console.error("Data import failed:", error);
            ui.notifications.error("Data import failed. Check console for details.");
        }
    }

    async _onClearData(event) {
        event.preventDefault();

        const confirmed = await Dialog.confirm({
            title: "Clear All Data",
            content: "Are you sure you want to clear all imported data? This cannot be undone.",
            yes: () => true,
            no: () => false
        });

        if (confirmed) {
            await this._clearAllPacks();
            await game.settings.set("shadowrun2e", "dataImported", false);
            ui.notifications.info("All data cleared.");
            this.render();
        }
    }

    async _clearAllPacks() {
        const itemPackNames = ["cyberware", "bioware", "spells", "adeptpowers", "skills", "programs", "vrprograms", "gear", "totems"];
        const actorPackNames = ["cyberdecks", "vehicles", "drones"];

        // Clear item packs
        for (const packName of itemPackNames) {
            const pack = game.packs.get(`shadowrun2e.${packName}`);
            if (pack) {
                const documents = await pack.getDocuments();
                await Item.deleteDocuments(documents.map(d => d.id), { pack: pack.collection });
            }
        }

        // Clear actor packs
        for (const packName of actorPackNames) {
            const pack = game.packs.get(`shadowrun2e.${packName}`);
            if (pack) {
                const documents = await pack.getDocuments();
                await Actor.deleteDocuments(documents.map(d => d.id), { pack: pack.collection });
            }
        }
    }
}

/* -------------------------------------------- */
/*  Character Import Configuration              */
/* -------------------------------------------- */

class CharacterImportConfig extends FormApplication {
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            id: "sr2-character-import",
            title: "Import Shadowrun 2E Character",
            template: "systems/shadowrun2e/templates/apps/character-import.html",
            width: 400,
            height: 250,
            classes: ["shadowrun2e", "character-import"]
        });
    }

    getData() {
        return {};
    }

    activateListeners(html) {
        super.activateListeners(html);
        html.find('.import-character').click(this._onImportCharacter.bind(this));
    }

    async _onImportCharacter(event) {
        event.preventDefault();
        this.close();
        SR2CharacterImporter.showImportDialog();
    }
}

/* -------------------------------------------- */
/*  Ready Hook - Auto Import Data              */
/* -------------------------------------------- */

Hooks.once("ready", async function () {
    // Make sure Create Actor dialog enhancements work reliably across Foundry versions.
    try {
        sr2InstallActorCreateDialogObserver();
    } catch (err) {
        console.warn("SR2E | Failed to install Create Actor dialog observer:", err);
    }

    // Auto-import data on first world load
    if (game.user.isGM && !game.settings.get("shadowrun2e", "dataImported")) {
        const shouldImport = await Dialog.confirm({
            title: "Import Shadowrun 2E Data",
            content: `<p>This appears to be the first time loading Shadowrun 2E in this world.</p>
                     <p>Would you like to automatically import all system data (cyberware, bioware, spells, etc.) into compendiums?</p>
                     <p><em>This may take a few moments...</em></p>`,
            yes: () => true,
            no: () => false,
            defaultYes: true
        });

        if (shouldImport) {
            ui.notifications.info("Importing Shadowrun 2E data...");
            try {
                await SR2DataImporter.importAllData();
                await game.settings.set("shadowrun2e", "dataImported", true);
            } catch (error) {
                console.error("Auto-import failed:", error);
                ui.notifications.warn("Auto-import failed. You can manually import data from System Settings.");
            }
        }
    }

    try {
        await sr2RepairExistingConnectionActors();
    } catch (err) {
        console.warn("SR2E | Failed to repair existing connection actors:", err);
    }
});
