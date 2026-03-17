/**
 * Shadowrun 2nd Edition System for Foundry VTT
 */

// Import modules
import { SR2Actor } from "./actor/actor.js";
import { SR2ActorSheet } from "./actor/actor-sheet.js";
import { SR2CyberdeckSheet } from "./actor/cyberdeck-sheet.js";
import { SR2VehicleSheet } from "./actor/vehicle-sheet.js";
import { SR2SpiritSheet } from "./actor/spirit-sheet.js";
import { SR2ICSheet } from "./actor/ic-sheet.js";
import { SR2Item } from "./item/item.js";
import { SR2ItemSheet } from "./item/item-sheet.js";
import { SR2Combat } from "./combat/sr2-combat.js";
import { SR2ItemBrowser } from "./item-browser.js";
import { SR2GearPurchaseApp } from "./gear-purchase.js";
import { SR2DataImporter } from "./data-importer.js";
import { SR2CharacterImporter } from "./character-importer.js";
import { initializeQuickActions } from "./quick-actions.js";
import {
  SR2_CONTACT_ARCHETYPES,
  SR2_FOLLOWER_ARCHETYPES,
  sr2AreBuddiesDisabled,
  sr2AreContactLevelsEnabled,
  sr2BuildContactBiography,
  sr2BuildBiowareItemData,
  sr2BuildCyberwareItemData,
  sr2BuildSpellItemData,
  sr2GetAllowedMetatypesForPriority,
  sr2GetContactLevelsSummaryForLeader,
  sr2GetSystemSetting,
  sr2NormalizeCatalogName,
  sr2RepairExistingConnectionActors,
  sr2RepairLegacySkillAllocatedRatings,
  sr2SyncFreeLanguageSkills,
} from "./actor-creation.js";
import { sr2EnhanceActorCreateDialog } from "./create-actor-dialog.js";
import { registerPoolAutoRefreshHooks } from "./hooks/pool-auto-refresh.js";
import { registerActorRuleHooks } from "./hooks/actor-rules.js";
import {
  registerActorCreateDialogHooks,
  installActorCreateDialogObserver,
} from "./hooks/actor-create-dialog.js";
import { registerConnectionFolderHooks } from "./hooks/connection-folders.js";
import { registerCreationRuleHooks } from "./hooks/creation-rules.js";
import { sr2ApplyCharacterPrioritiesOnCreate } from "./hooks/priority-bootstrap.js";
import { registerChatCommandHooks } from "./hooks/chat-commands.js";
import "./hotbar.js";
import { sr2GetRacialAttributeBounds, sr2GetRacialTraits } from "./sr2-rules.js";

function sr2InstallPoolAutoRefreshHooks() {
  registerPoolAutoRefreshHooks();
}

/* -------------------------------------------- */
/*  Foundry VTT Initialization                  */
/* -------------------------------------------- */

Hooks.once("init", async function () {
  console.log("Shadowrun 2E | Initializing Shadowrun 2nd Edition System");

  // Debug: Log that we're starting initialization
  console.log("SR2E | Registering document classes...");

  // Assign custom classes and constants
  CONFIG.Actor.documentClass = SR2Actor;
  CONFIG.Item.documentClass = SR2Item;
  CONFIG.Combat.documentClass = SR2Combat;

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
    spirit: "systems/shadowrun2e/icons/spirit.png",
    critter: "systems/shadowrun2e/icons/spirit.png",
    ic: "systems/shadowrun2e/icons/cyberdeck.png",
  };

  // Register sheet application classes
  console.log("SR2E | Unregistering core sheets...");
  Actors.unregisterSheet("core", ActorSheet);

  console.log("SR2E | Registering SR2ActorSheet...", SR2ActorSheet);
  Actors.registerSheet("shadowrun2e", SR2ActorSheet, {
    types: ["character", "contact", "follower"],
    makeDefault: true,
    label: "Shadowrun 2E Character Sheet",
  });

  console.log("SR2E | Registering SR2CyberdeckSheet...", SR2CyberdeckSheet);
  Actors.registerSheet("shadowrun2e", SR2CyberdeckSheet, {
    types: ["cyberdeck"],
    makeDefault: true,
    label: "Shadowrun 2E Cyberdeck Sheet",
  });

  console.log("SR2E | Registering SR2VehicleSheet...", SR2VehicleSheet);
  Actors.registerSheet("shadowrun2e", SR2VehicleSheet, {
    types: ["vehicle"],
    makeDefault: true,
    label: "Shadowrun 2E Vehicle Sheet",
  });

  console.log("SR2E | Registering SR2SpiritSheet...", SR2SpiritSheet);
  Actors.registerSheet("shadowrun2e", SR2SpiritSheet, {
    types: ["spirit", "critter"],
    makeDefault: true,
    label: "Shadowrun 2E Spirit Sheet",
  });

  console.log("SR2E | Registering SR2ICSheet...", SR2ICSheet);
  Actors.registerSheet("shadowrun2e", SR2ICSheet, {
    types: ["ic"],
    makeDefault: true,
    label: "Shadowrun 2E IC Sheet",
  });

  // Force set as default for character actors
  if (!CONFIG.Actor.sheetClasses.character) {
    CONFIG.Actor.sheetClasses.character = {};
  }
  CONFIG.Actor.sheetClasses.character["shadowrun2e.SR2ActorSheet"] = {
    id: "shadowrun2e.SR2ActorSheet",
    cls: SR2ActorSheet,
    default: true,
  };

  // Force set as default for contact actors
  if (!CONFIG.Actor.sheetClasses.contact) {
    CONFIG.Actor.sheetClasses.contact = {};
  }
  CONFIG.Actor.sheetClasses.contact["shadowrun2e.SR2ActorSheet"] = {
    id: "shadowrun2e.SR2ActorSheet",
    cls: SR2ActorSheet,
    default: true,
  };

  // Force set as default for follower actors
  if (!CONFIG.Actor.sheetClasses.follower) {
    CONFIG.Actor.sheetClasses.follower = {};
  }
  CONFIG.Actor.sheetClasses.follower["shadowrun2e.SR2ActorSheet"] = {
    id: "shadowrun2e.SR2ActorSheet",
    cls: SR2ActorSheet,
    default: true,
  };

  // Force set as default for cyberdeck actors
  if (!CONFIG.Actor.sheetClasses.cyberdeck) {
    CONFIG.Actor.sheetClasses.cyberdeck = {};
  }
  CONFIG.Actor.sheetClasses.cyberdeck["shadowrun2e.SR2CyberdeckSheet"] = {
    id: "shadowrun2e.SR2CyberdeckSheet",
    cls: SR2CyberdeckSheet,
    default: true,
  };

  // Force set as default for vehicle actors
  if (!CONFIG.Actor.sheetClasses.vehicle) {
    CONFIG.Actor.sheetClasses.vehicle = {};
  }
  CONFIG.Actor.sheetClasses.vehicle["shadowrun2e.SR2VehicleSheet"] = {
    id: "shadowrun2e.SR2VehicleSheet",
    cls: SR2VehicleSheet,
    default: true,
  };

  // Force set as default for spirit actors
  if (!CONFIG.Actor.sheetClasses.spirit) {
    CONFIG.Actor.sheetClasses.spirit = {};
  }
  CONFIG.Actor.sheetClasses.spirit["shadowrun2e.SR2SpiritSheet"] = {
    id: "shadowrun2e.SR2SpiritSheet",
    cls: SR2SpiritSheet,
    default: true,
  };

  // Force set as default for critter actors
  if (!CONFIG.Actor.sheetClasses.critter) {
    CONFIG.Actor.sheetClasses.critter = {};
  }
  CONFIG.Actor.sheetClasses.critter["shadowrun2e.SR2SpiritSheet"] = {
    id: "shadowrun2e.SR2SpiritSheet",
    cls: SR2SpiritSheet,
    default: true,
  };

  // Force set as default for IC actors
  if (!CONFIG.Actor.sheetClasses.ic) {
    CONFIG.Actor.sheetClasses.ic = {};
  }
  CONFIG.Actor.sheetClasses.ic["shadowrun2e.SR2ICSheet"] = {
    id: "shadowrun2e.SR2ICSheet",
    cls: SR2ICSheet,
    default: true,
  };

  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("shadowrun2e", SR2ItemSheet, {
    makeDefault: true,
    label: "Shadowrun 2E Item Sheet",
  });

  console.log("SR2E | Sheet registration completed");

  // Register system settings
  registerSystemSettings();

  // Preload Handlebars templates
  preloadHandlebarsTemplates();

  // Register Handlebars helpers
  registerHandlebarsHelpers();

  // SR2 rules: dice pools refresh at the start of the acting character's turn.
  sr2InstallPoolAutoRefreshHooks();

  // Token quick actions popup
  initializeQuickActions();

  // Expose data importer globally for debugging
  window.SR2DataImporter = SR2DataImporter;
});

registerActorCreateDialogHooks(sr2EnhanceActorCreateDialog);

/* -------------------------------------------- */
/*  Actor Rules                                 */
/* -------------------------------------------- */

registerActorRuleHooks({ syncFreeLanguageSkills: sr2SyncFreeLanguageSkills });
registerChatCommandHooks();

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
  const contactArchetype = contactLevelsEnabled
    ? (SR2_CONTACT_ARCHETYPES[archetypeKey] ?? null)
    : null;
  const followerArchetype = archetypeKey ? (SR2_FOLLOWER_ARCHETYPES[archetypeKey] ?? null) : null;
  const usesContactArchetype = Boolean(contactArchetype);
  const archetype = contactArchetype || followerArchetype;
  if (!archetype) return;

  // Contact Levels house rule: gang/tribe members are capped at 3 for skills and attributes.
  const isGangTribeMember =
    contactLevelsEnabled &&
    !usesContactArchetype &&
    ["gangMember", "tribesman"].includes(archetypeKey);
  const gangTribeCap = 3;

  const updates = {};

  for (const [attributeKey, value] of Object.entries(archetype.attributes || {})) {
    const raw = Number(value) || 0;
    updates[`system.attributes.${attributeKey}.value`] = isGangTribeMember
      ? Math.min(gangTribeCap, raw)
      : raw;
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
      updates["system.attributes.magic.value"] = Math.max(
        actor.system.attributes.magic.value || 0,
        6,
      );
    }
  }

  // Standardize follower name on create (Archetype Follower - Leader)
  const leaderId = actor.system?.details?.leaderId;
  const leaderName = leaderId ? game.actors.get(leaderId)?.name || "" : "";
  const archetypeLabel = archetype.label || "Follower";
  updates["name"] = leaderName
    ? `${archetypeLabel} Follower - ${leaderName}`
    : `${archetypeLabel} Follower`;

  if (Object.keys(updates).length) {
    await actor.update(updates, { render: false });
  }

  const normalizedSkillKey = (baseSkill, concentration, specialization) =>
    `${sr2NormalizeCatalogName(baseSkill)}|${sr2NormalizeCatalogName(concentration)}|${sr2NormalizeCatalogName(specialization)}`;

  const existingSkillKeys = new Set(
    actor.items
      .filter((i) => i.type === "skill")
      .map((i) =>
        normalizedSkillKey(
          i.system?.baseSkill || i.name,
          i.system?.concentration,
          i.system?.specialization,
        ),
      ),
  );

  const skillsToCreate = [];
  for (const skill of archetype.skills || []) {
    const key = normalizedSkillKey(skill.baseSkill, skill.concentration, skill.specialization);
    if (existingSkillKeys.has(key)) continue;
    const rawAllocated = Number(skill.allocatedRating ?? skill.baseRating) || 0;
    const rawBase = Number(skill.baseRating) || 0;
    const allocatedRating = isGangTribeMember ? Math.min(gangTribeCap, rawAllocated) : rawAllocated;
    const baseRating = isGangTribeMember ? Math.min(gangTribeCap, rawBase) : rawBase;
    const concentrationRatingRaw = Number(skill.concentrationRating) || 0;
    const specializationRatingRaw = Number(skill.specializationRating) || 0;
    const concentrationRating = isGangTribeMember
      ? Math.min(gangTribeCap, concentrationRatingRaw)
      : concentrationRatingRaw;
    const specializationRating = isGangTribeMember
      ? Math.min(gangTribeCap, specializationRatingRaw)
      : specializationRatingRaw;
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
        requiresConcentration: false,
      },
    });
  }

  if (skillsToCreate.length) {
    await actor.createEmbeddedDocuments("Item", skillsToCreate, { sr2SkipBudget: true });
  }

  const existingCyberwareNames = new Set(
    actor.items.filter((i) => i.type === "cyberware").map((i) => sr2NormalizeCatalogName(i.name)),
  );
  const cyberwareToCreate = [];
  for (const cyberwareName of archetype.cyberware || []) {
    const key = sr2NormalizeCatalogName(cyberwareName);
    if (!key || existingCyberwareNames.has(key)) continue;
    cyberwareToCreate.push(await sr2BuildCyberwareItemData(cyberwareName, { installed: true }));
  }

  if (cyberwareToCreate.length) {
    await actor.createEmbeddedDocuments("Item", cyberwareToCreate, { sr2SkipBudget: true });
  }

  const existingBiowareNames = new Set(
    actor.items.filter((i) => i.type === "bioware").map((i) => sr2NormalizeCatalogName(i.name)),
  );
  const biowareToCreate = [];
  for (const biowareName of archetype.bioware || []) {
    const key = sr2NormalizeCatalogName(biowareName);
    if (!key || existingBiowareNames.has(key)) continue;
    biowareToCreate.push(await sr2BuildBiowareItemData(biowareName, { installed: true }));
  }

  if (biowareToCreate.length) {
    await actor.createEmbeddedDocuments("Item", biowareToCreate, { sr2SkipBudget: true });
  }

  const existingSpellNames = new Set(
    actor.items.filter((i) => i.type === "spell").map((i) => sr2NormalizeCatalogName(i.name)),
  );
  const spellsToCreate = [];
  const isSpellcaster =
    Boolean(archetype.magic?.awakened) && !Boolean(archetype.magic?.physicalAdept);
  if (isSpellcaster) {
    for (const spell of archetype.spells || []) {
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
  await sr2ApplyCharacterPrioritiesOnCreate(actor, {
    userId,
    currentUserId: game?.user?.id,
    getAllowedMetatypesForPriority: sr2GetAllowedMetatypesForPriority,
    syncFreeLanguageSkills: sr2SyncFreeLanguageSkills,
  });
});

Hooks.on("createActor", async function (actor, options, userId) {
  if (typeof userId === "string" && userId !== game.user.id) return;
  if (!["character", "contact", "follower"].includes(actor.type)) return;
  if (actor.getFlag("shadowrun2e", "metatypeBaselineApplied")) return;

  // If this actor is being created from a follower archetype, let the archetype bootstrap set values.
  if (actor.type === "follower" && actor.system?.details?.archetype) return;

  const metatype = actor.system?.details?.metatype || "human";
  const bounds = sr2GetRacialAttributeBounds(metatype);
  const traits = sr2GetRacialTraits(metatype);

  const attrKeys = ["body", "quickness", "strength", "charisma", "intelligence", "willpower"];

  // Auto-apply baselines if the actor still looks unallocated (template defaults).
  const looksUnallocated = attrKeys.every((key) => {
    const value = Number(actor.system?.attributes?.[key]?.value);
    return !Number.isFinite(value) || value === 0 || value === 1;
  });

  const updates = {};

  // Keep derived traits and caps consistent with the chosen metatype.
  if (!actor.system?.details?.traits || typeof actor.system.details.traits !== "object") {
    updates["system.details.traits"] = traits;
  }

  for (const key of attrKeys) {
    const b = bounds[key];
    if (!b) continue;

    const currentMin = actor.system?.attributes?.[key]?.min;
    const currentMax = actor.system?.attributes?.[key]?.max;
    if (currentMin !== b.min) updates[`system.attributes.${key}.min`] = b.min;
    if (currentMax !== b.max) updates[`system.attributes.${key}.max`] = b.max;

    const currentValue = Number(actor.system?.attributes?.[key]?.value);
    const shouldApplyBaseline =
      looksUnallocated || !Number.isFinite(currentValue) || currentValue < b.min;
    if (shouldApplyBaseline) updates[`system.attributes.${key}.value`] = b.min;
  }

  if (Object.keys(updates).length) {
    await actor.update(updates, { render: false });
  }

  await actor.setFlag("shadowrun2e", "metatypeBaselineApplied", true);
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
      updates["system.attributes.magic.value"] = Math.max(
        actor.system.attributes.magic.value || 0,
        6,
      );
    }
  }

  // Standardize contact name on create (Archetype - Leader).
  const leaderId = actor.system?.details?.leaderId;
  const leaderName = leaderId ? game.actors.get(leaderId)?.name || "" : "";
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
      .filter((i) => i.type === "skill")
      .map((i) =>
        normalizedSkillKey(
          i.system?.baseSkill || i.name,
          i.system?.concentration,
          i.system?.specialization,
        ),
      ),
  );

  const skillsToCreate = [];
  for (const skill of archetype.skills || []) {
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
        requiresConcentration: false,
      },
    });
  }

  if (skillsToCreate.length) {
    await actor.createEmbeddedDocuments("Item", skillsToCreate, { sr2SkipBudget: true });
  }

  const existingCyberwareNames = new Set(
    actor.items.filter((i) => i.type === "cyberware").map((i) => sr2NormalizeCatalogName(i.name)),
  );
  const cyberwareToCreate = [];
  for (const cyberwareName of archetype.cyberware || []) {
    const key = sr2NormalizeCatalogName(cyberwareName);
    if (!key || existingCyberwareNames.has(key)) continue;
    cyberwareToCreate.push(await sr2BuildCyberwareItemData(cyberwareName, { installed: true }));
  }

  if (cyberwareToCreate.length) {
    await actor.createEmbeddedDocuments("Item", cyberwareToCreate, { sr2SkipBudget: true });
  }

  const existingBiowareNames = new Set(
    actor.items.filter((i) => i.type === "bioware").map((i) => sr2NormalizeCatalogName(i.name)),
  );
  const biowareToCreate = [];
  for (const biowareName of archetype.bioware || []) {
    const key = sr2NormalizeCatalogName(biowareName);
    if (!key || existingBiowareNames.has(key)) continue;
    biowareToCreate.push(await sr2BuildBiowareItemData(biowareName, { installed: true }));
  }

  if (biowareToCreate.length) {
    await actor.createEmbeddedDocuments("Item", biowareToCreate, { sr2SkipBudget: true });
  }

  const existingSpellNames = new Set(
    actor.items.filter((i) => i.type === "spell").map((i) => sr2NormalizeCatalogName(i.name)),
  );
  const spellsToCreate = [];
  const isSpellcaster =
    Boolean(archetype.magic?.awakened) && !Boolean(archetype.magic?.physicalAdept);
  if (isSpellcaster) {
    for (const spell of archetype.spells || []) {
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
registerConnectionFolderHooks({ getSystemSetting: sr2GetSystemSetting });

/* -------------------------------------------- */
/*  Creation Rule Enforcement                   */
/* -------------------------------------------- */

registerCreationRuleHooks({
  areContactLevelsEnabled: sr2AreContactLevelsEnabled,
  areBuddiesDisabled: sr2AreBuddiesDisabled,
  getContactLevelsSummaryForLeader: sr2GetContactLevelsSummaryForLeader,
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
    default: true,
  });

  // SR2 core rule support: pools refresh at the start of a character's action.
  game.settings.register("shadowrun2e", "autoRefreshPools", {
    name: "Auto-Refresh Dice Pools",
    hint: "Automatically refresh Combat/Magic/etc. pools to full at the start of the acting combatant's turn in Foundry Combat.",
    scope: "world",
    config: true,
    type: Boolean,
    default: true,
  });

  // UI convenience: token selection quick actions popup (client-side).
  game.settings.register("shadowrun2e", "tokenQuickActions", {
    name: "Token Quick Actions",
    hint: "Show a small quick-actions popup when you select a token you control.",
    scope: "client",
    config: true,
    type: Boolean,
    default: true,
  });

  // Client-only: persist per-user size for the Token Quick Actions popup.
  game.settings.register("shadowrun2e", "quickActionsWidth", {
    name: "Token Quick Actions Width",
    scope: "client",
    config: false,
    type: Number,
    default: 300,
  });

  game.settings.register("shadowrun2e", "quickActionsHeight", {
    name: "Token Quick Actions Height",
    scope: "client",
    config: false,
    type: Number,
    default: 360,
  });

  game.settings.register("shadowrun2e", "debugLogging", {
    name: "Debug Logging",
    hint: "Enable verbose Shadowrun 2E debug logging in the browser console.",
    scope: "client",
    config: true,
    type: Boolean,
    default: false,
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
    restricted: true,
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
    restricted: true,
  });

  // House rule: remove Buddies from character creation entirely.
  game.settings.register("shadowrun2e", "disableBuddies", {
    name: "Disable Buddies",
    hint: "Remove the Buddy creation extra (no purchase button, no cost, no budget impact).",
    scope: "world",
    config: true,
    type: Boolean,
    default: false,
    restricted: true,
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
      perPlayerPerType: "Per Player Per Type",
    },
    default: "disabled",
    restricted: true,
  });

  game.settings.register("shadowrun2e", "dataImported", {
    name: "Data Imported",
    hint: "Whether the system data has been imported into compendiums",
    scope: "world",
    config: false,
    type: Boolean,
    default: false,
  });

  game.settings.registerMenu("shadowrun2e", "dataImport", {
    name: "Import System Data",
    label: "Import Data",
    hint: "Import cyberware, bioware, spells, and other items into compendiums",
    icon: "fas fa-download",
    type: DataImportConfig,
    restricted: true,
  });

  game.settings.registerMenu("shadowrun2e", "characterImport", {
    name: "Import Character",
    label: "Import Character",
    hint: "Import a character from JSON file",
    icon: "fas fa-user-plus",
    type: CharacterImportConfig,
    restricted: false,
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
    "systems/shadowrun2e/templates/actor/ic-sheet.html",
    "systems/shadowrun2e/templates/item/item-sheet.html",
    "systems/shadowrun2e/templates/apps/quick-actions.html",
    "systems/shadowrun2e/templates/apps/item-browser.html",
    "systems/shadowrun2e/templates/apps/gear-purchase.html",
    "systems/shadowrun2e/templates/apps/data-import.html",
    "systems/shadowrun2e/templates/apps/character-import.html",
    "systems/shadowrun2e/templates/chat/dice-roll.html",
  ];

  return loadTemplates(templatePaths);
}

/* -------------------------------------------- */
/*  Handlebars Helpers                          */
/* -------------------------------------------- */

function registerHandlebarsHelpers() {
  // Helper for greater than comparison
  Handlebars.registerHelper("gt", function (a, b) {
    return a > b;
  });

  // Helper for equality comparison
  Handlebars.registerHelper("eq", function (a, b) {
    return a === b;
  });

  // Helper for string capitalization
  Handlebars.registerHelper("capitalize", function (str) {
    if (typeof str !== "string") return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  });

  // Helper for mathematical operations
  Handlebars.registerHelper("math", function (lvalue, operator, rvalue, options) {
    lvalue = parseFloat(lvalue);
    rvalue = parseFloat(rvalue);

    return {
      "+": lvalue + rvalue,
      "-": lvalue - rvalue,
      "*": lvalue * rvalue,
      "/": lvalue / rvalue,
      "%": lvalue % rvalue,
    }[operator];
  });

  // Helper for less than or equal comparison
  Handlebars.registerHelper("lte", function (a, b) {
    return a <= b;
  });

  // Helper for less than comparison
  Handlebars.registerHelper("lt", function (a, b) {
    return a < b;
  });

  // Helper for creating repeated elements (like damage boxes)
  Handlebars.registerHelper("times", function (n, block) {
    let accum = "";
    for (let i = 0; i < n; ++i) {
      accum += block.fn({ index: i });
    }
    return accum;
  });

  // Helper for addition
  Handlebars.registerHelper("add", function (a, b) {
    return a + b;
  });

  // Helper for safe number display (handles NaN and undefined)
  Handlebars.registerHelper("safeNumber", function (value, defaultValue = 0) {
    if (typeof value === "number" && !isNaN(value)) {
      return value;
    }
    return defaultValue;
  });

  console.log("SR2E | Registered safeNumber Handlebars helper");
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
      classes: ["shadowrun2e", "data-import"],
    });
  }

  getData() {
    return {
      dataImported: game.settings.get("shadowrun2e", "dataImported"),
    };
  }

  activateListeners(html) {
    super.activateListeners(html);
    html.find(".import-data").click(this._onImportData.bind(this));
    html.find(".clear-data").click(this._onClearData.bind(this));
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
      no: () => false,
    });

    if (confirmed) {
      await this._clearAllPacks();
      await game.settings.set("shadowrun2e", "dataImported", false);
      ui.notifications.info("All data cleared.");
      this.render();
    }
  }

  async _clearAllPacks() {
    const itemPackNames = [
      "cyberware",
      "bioware",
      "spells",
      "adeptpowers",
      "skills",
      "programs",
      "vrprograms",
      "gear",
      "totems",
    ];
    const actorPackNames = ["cyberdecks", "vehicles", "drones"];

    // Clear item packs
    for (const packName of itemPackNames) {
      const pack = game.packs.get(`shadowrun2e.${packName}`);
      if (pack) {
        const documents = await pack.getDocuments();
        await Item.deleteDocuments(
          documents.map((d) => d.id),
          { pack: pack.collection },
        );
      }
    }

    // Clear actor packs
    for (const packName of actorPackNames) {
      const pack = game.packs.get(`shadowrun2e.${packName}`);
      if (pack) {
        const documents = await pack.getDocuments();
        await Actor.deleteDocuments(
          documents.map((d) => d.id),
          { pack: pack.collection },
        );
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
      classes: ["shadowrun2e", "character-import"],
    });
  }

  getData() {
    return {};
  }

  activateListeners(html) {
    super.activateListeners(html);
    html.find(".import-character").click(this._onImportCharacter.bind(this));
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
    installActorCreateDialogObserver(sr2EnhanceActorCreateDialog);
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
      defaultYes: true,
    });

    if (shouldImport) {
      ui.notifications.info("Importing Shadowrun 2E data...");
      try {
        await SR2DataImporter.importAllData();
        await game.settings.set("shadowrun2e", "dataImported", true);
      } catch (error) {
        console.error("Auto-import failed:", error);
        ui.notifications.warn(
          "Auto-import failed. You can manually import data from System Settings.",
        );
      }
    }
  }

  try {
    await sr2RepairExistingConnectionActors();
  } catch (err) {
    console.warn("SR2E | Failed to repair existing connection actors:", err);
  }
});
