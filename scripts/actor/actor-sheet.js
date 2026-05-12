import {
  sr2ComputeCreationNuyenBudgetBreakdown,
  sr2BuildCreationCompletionSummary,
  sr2ComputeAttributePointsSpent,
  sr2ComputeContactLevelSummary,
  sr2ComputeForcePointsSpent,
  sr2ComputeSkillPointsSpent,
  sr2ComputeSkillRatingsFromAllocated,
  sr2Clamp,
  sr2ComputeStartingKarmaPool,
  sr2FormatSignedModifier,
  sr2HasCreationLimits,
  sr2GetRacialAttributeBounds,
  sr2GetRacialModifiers,
  sr2GetRacialTraits,
  sr2InferCombatSpellDamageLevelFromName,
  sr2ParseFocusName,
  sr2InferFocusBondCostForGearItem,
  sr2NormalizeContactLevel,
  sr2SkillInferAllocatedRating,
} from "../sr2-rules.js";
import { sr2LogDebug } from "../utils/logger.js";
import { sr2ApplyMessageMode } from "../utils/chat-mode.js";
import {
  ensureEncounterCombatant,
  rollEncounterInitiative,
  sr2RollInitiativeToChat,
} from "../actions/initiative.js";
import { sr2PrepareSkillRoll } from "../actions/skill-roll.js";
import { sr2BuildRangedModifierSummary } from "../rules/attack-modifiers.js";
import {
  sr2ComputeDamageResistanceTargetNumber,
  sr2ApplyCalledShot,
  sr2ComputeMeleeTargetNumbers,
  sr2GetInjuryModifiers,
  sr2GetRangeBand,
  sr2ResolveMeleeDamage,
  sr2ResolveMeleeOpposedTest,
  sr2ResolveRangedCombat,
} from "../rules/combat-resolution.js";
import {
  sr2ApplyWeaponAttackProfileToDamage,
  sr2BuildWeaponAttackModifiers,
} from "../rules/weapon-fire.js";
import {
  sr2ComputeDrainTargetNumber,
  sr2ComputeDrainValueFromCode,
} from "../rules/spellcasting.js";
import {
  sr2PrepareSpellResistanceTest,
  sr2SummarizeDrainApplication,
  sr2SummarizeCombatSpellDamage,
  sr2SummarizeSpellEffectResolution,
} from "../rules/spell-resolution.js";
import {
  sr2ComputeInstalledBiowareIndex,
  sr2ComputeInstalledCyberwareEssenceLoss,
} from "../rules/augmentation-effects.js";
import {
  loadSkillsData,
  SR2_SPELL_CLASS_LABELS,
  sr2ApplyDamageToActor,
  sr2FindWeaponSkill,
  sr2FormatSpellDrain,
  sr2GetArmorRatings,
  sr2GetEffectiveSkillRating,
  sr2GetHighestSkillRatingByBaseSkill,
  sr2GetModifiedAttribute,
  sr2GetSystemSetting,
  sr2GetWeaponSkillData,
  sr2InferSpellDamageLevelFromDrain,
  sr2InferSpellRangeFromName,
  sr2InferSpellResistFromType,
  sr2NormalizeSpellClass,
  sr2ParseDamageCode,
} from "./actor-sheet-helpers.js";
import {
  sr2BuildLifestyleUpdatesFromFormFields,
  sr2ClearDirtyFieldState,
  sr2CreateDirtyFieldState,
  sr2FilterUpdatesToDirtyFields,
  sr2MarkDirtyField,
} from "./actor-sheet-save-helpers.js";

function sr2GetSpellRangeLabel(spell) {
  const explicitRange = String(spell?.system?.range || "").trim();
  if (explicitRange) return explicitRange;
  return sr2InferSpellRangeFromName(spell?.name);
}

function sr2GetSpellTargetLabel(spell) {
  const explicitTarget = String(spell?.system?.target || "").trim();
  if (explicitTarget) return explicitTarget;
  return sr2InferSpellResistFromType(spell?.system?.type);
}

function sr2GetSpellResistanceAttributeKey(spell) {
  const target = String(spell?.system?.target || "")
    .trim()
    .toLowerCase();

  if (target.includes("willpower")) return "willpower";
  if (target.includes("body")) return "body";
  if (target.includes("intelligence")) return "intelligence";

  if (target.includes("[r]") || target.includes("(r)")) {
    const inferred = String(sr2InferSpellResistFromType(spell?.system?.type) || "")
      .trim()
      .toLowerCase();
    return ["willpower", "body", "intelligence"].includes(inferred) ? inferred : "";
  }

  if (target) return "";

  const fallback = String(sr2InferSpellResistFromType(spell?.system?.type) || "")
    .trim()
    .toLowerCase();
  return ["willpower", "body", "intelligence"].includes(fallback) ? fallback : "";
}

const SR2_ALL_POOL_KEYS = ["combat", "spell", "hacking", "control", "task", "astral", "karma"];

/**
 * Extend the basic ActorSheet with Shadowrun 2E specific functionality
 */
export class SR2ActorSheet extends ActorSheet {
  constructor(...args) {
    super(...args);

    // Cache DOM lookups and debounce multi-click updates
    this._domCache = new Map();
    this._updateQueue = new Map();

    this._boundOnActorUpdate = this._onActorUpdate.bind(this);
    this._hasActorUpdateHook = false;
    this._dirtyFields = sr2CreateDirtyFieldState();

    this._debouncedUpdate = this._debounce(this._processUpdateQueue.bind(this), 50);
  }

  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["shadowrun2e", "sheet", "actor"],
      template: "systems/shadowrun2e/templates/actor/character-sheet.html",
      width: 960,
      height: 680,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "main" }],
    });
  }

  /** @override */
  get template() {
    // For now, all actor types use the character sheet
    // Later we can add different sheets for different actor types
    return "systems/shadowrun2e/templates/actor/character-sheet.html";
  }

  /** @override */
  async getData() {
    const context = super.getData();
    const actorData = this.actor.toObject(false);

    context.system = actorData.system;
    context.flags = actorData.flags;

    const moreMetahumans = Boolean(sr2GetSystemSetting("moreMetahumans", false));
    const contactLevels = Boolean(sr2GetSystemSetting("contactLevels", false));
    const disableBuddies = contactLevels || Boolean(sr2GetSystemSetting("disableBuddies", false));

    context.sr2Settings = {
      moreMetahumans,
      contactLevels,
      disableBuddies,
    };

    // Ensure shadowrun2e flags container exists for template bindings
    if (!context.flags.shadowrun2e) context.flags.shadowrun2e = {};
    context.isCreationMode = sr2HasCreationLimits(context.system);
    context.skillAllocatedMax = context.isCreationMode ? 6 : 99;

    if (!context.system.karma) context.system.karma = {};
    context.system.karma.earned = Math.max(0, Math.floor(Number(context.system.karma.earned) || 0));
    context.system.karma.spent = Math.max(0, Math.floor(Number(context.system.karma.spent) || 0));

    // Ensure health data structure exists with defaults
    if (!context.system.health) {
      context.system.health = {
        physical: { value: 0, max: 10 },
        stun: { value: 0, max: 10 },
      };
    } else {
      // Ensure physical health exists
      if (!context.system.health.physical) {
        context.system.health.physical = { value: 0, max: 10 };
      } else {
        // Ensure values are numbers, handle NaN, null, undefined
        const physValue = context.system.health.physical.value;
        const physMax = context.system.health.physical.max;

        context.system.health.physical.value =
          typeof physValue === "number" && !isNaN(physValue) ? physValue : 0;
        context.system.health.physical.max =
          typeof physMax === "number" && !isNaN(physMax) ? physMax : 10;
      }

      // Ensure stun health exists
      if (!context.system.health.stun) {
        context.system.health.stun = { value: 0, max: 10 };
      } else {
        // Ensure values are numbers, handle NaN, null, undefined
        const stunValue = context.system.health.stun.value;
        const stunMax = context.system.health.stun.max;

        context.system.health.stun.value =
          typeof stunValue === "number" && !isNaN(stunValue) ? stunValue : 0;
        context.system.health.stun.max =
          typeof stunMax === "number" && !isNaN(stunMax) ? stunMax : 10;
      }
    }

    // Normalize lifestyles list (supports multiple lifestyles)
    if (["character", "contact", "follower"].includes(actorData.type)) {
      if (!context.system.resources) context.system.resources = {};

      const legacyLifestyle = context.system.resources.lifestyle || "street";
      const legacyMonths = context.system.creation?.lifestyleMonths ?? 1;

      const rawLifestyles = context.system.resources.lifestyles;
      if (!Array.isArray(rawLifestyles) || rawLifestyles.length === 0) {
        context.system.resources.lifestyles = [
          {
            type: legacyLifestyle,
            months: Math.max(1, parseInt(legacyMonths, 10) || 1),
          },
        ];
      } else {
        context.system.resources.lifestyles = rawLifestyles.map((l) => ({
          type: l?.type || legacyLifestyle,
          months: Math.max(1, parseInt(l?.months, 10) || 1),
        }));
      }
    }

    // Prepare character data and items
    if (["character", "contact", "follower"].includes(actorData.type)) {
      this._prepareItems(context);
      this._prepareCharacterData(context);
      await this._prepareSkillsData(context);
    }

    if (actorData.type === "contact" && context.sr2Settings.contactLevels) {
      if (!context.system.details) context.system.details = {};
      context.system.details.contactLevel = sr2NormalizeContactLevel(
        context.system.details.contactLevel,
      );
    }

    // Racial modifiers/caps and creation point tracking
    if (["character", "contact", "follower"].includes(actorData.type)) {
      const metatype = context.system?.details?.metatype || "human";
      const bounds = sr2GetRacialAttributeBounds(metatype);

      // Apply chargen racial min/max only while creation budgets are active. After creation,
      // advancement is tracked by Karma and the sheet should not block higher ratings.
      for (const [key, { min, max }] of Object.entries(bounds)) {
        if (!context.system.attributes?.[key]) continue;
        context.system.attributes[key].min = context.isCreationMode ? min : 0;
        context.system.attributes[key].max = context.isCreationMode ? max : 99;
      }

      // Leader display (followers)
      context.leaderId = context.system?.details?.leaderId || "";
      context.leaderName = "";
      if (actorData.type === "follower" && context.leaderId && game?.actors) {
        const leader = game.actors.get(context.leaderId);
        context.leaderName = leader?.name || "";
      }

      // Followers list (leaders)
      if (actorData.type === "character" && game?.actors) {
        const linkedActors = game.actors.filter(
          (a) => a.system?.details?.leaderId === this.actor.id,
        );

        context.leaderContacts = linkedActors
          .filter((a) => a.type === "contact")
          .map((a) => ({
            id: a.id,
            name: a.name,
            contactLevel: sr2NormalizeContactLevel(a.system?.details?.contactLevel),
            sort: Number(a.sort) || 0,
          }))
          .sort((a, b) => a.name.localeCompare(b.name));

        const linkedFollowers = linkedActors
          .filter((a) => a.type === "follower")
          .map((a) => ({
            id: a.id,
            name: a.name,
            archetype: a.system?.details?.archetype || "",
          }))
          .sort((a, b) => a.name.localeCompare(b.name));

        const gangArchetypes = new Set(["gangMember", "tribesman"]);
        context.leaderGangMembers = linkedFollowers.filter((f) => gangArchetypes.has(f.archetype));
        context.leaderFollowers = linkedFollowers.filter((f) => !gangArchetypes.has(f.archetype));
      }
      if (!Array.isArray(context.leaderContacts)) context.leaderContacts = [];
      if (!Array.isArray(context.leaderGangMembers)) context.leaderGangMembers = [];
      if (!Array.isArray(context.leaderFollowers)) context.leaderFollowers = [];

      // Connection counts and limits (creation-mode helpers)
      if (actorData.type === "character") {
        const contactLevelsEnabled = context.sr2Settings.contactLevels;
        const disableBuddies = context.sr2Settings.disableBuddies;
        const extras = context.system?.creation?.extras || {};

        const followersPurchased = Math.max(0, parseInt(extras.followers, 10) || 0) > 0;

        const contactsCount = (context.leaderContacts || []).length;
        let contactsLimit = Math.max(2, Math.max(0, parseInt(extras.contacts, 10) || 0));
        let contactsOver = contactsCount > contactsLimit;

        if (contactLevelsEnabled) {
          const charisma = Number(context.system?.attributes?.charisma?.value) || 0;
          context.contactLevelsSummary = sr2ComputeContactLevelSummary(
            context.leaderContacts,
            charisma,
          );
          contactsLimit = context.contactLevelsSummary.counts.maxTotalContacts;
          contactsOver = Boolean(
            context.contactLevelsSummary.over.extraContacts ||
            context.contactLevelsSummary.over.extraLevel2 ||
            context.contactLevelsSummary.over.extraLevel3,
          );
        }

        context.connectionCounts = {
          contacts: contactsCount,
          followers: context.leaderFollowers.length,
        };

        context.connectionLimits = {
          contacts: contactsLimit,
          // SR2: one Followers purchase provides five followers.
          followers: followersPurchased ? 5 : 0,
        };

        context.connectionOver = {
          contacts: contactsOver,
          followers: context.connectionCounts.followers > context.connectionLimits.followers,
        };

        context.creationExtrasPurchased = {
          buddy: disableBuddies ? false : Math.max(0, parseInt(extras.buddy, 10) || 0) > 0,
          gang: Math.max(0, parseInt(extras.gang, 10) || 0) > 0,
          followers: followersPurchased,
        };
      }

      const attributePointsTotal = Number(context.system.creation?.attributePoints) || 0;
      const skillPointsTotal = Number(context.system.creation?.skillPoints) || 0;
      const forcePointsTotal = Number(context.system.creation?.forcePoints) || 0;

      const attributePointsSpent = sr2ComputeAttributePointsSpent(
        context.system.attributes,
        metatype,
      );
      const skillPointsSpent = sr2ComputeSkillPointsSpent(context.skills || []);
      const forcePointsSpent = sr2ComputeForcePointsSpent(context.items || []);

      context.creationPoints = {
        attributes: {
          total: attributePointsTotal,
          spent: attributePointsSpent,
          remaining: attributePointsTotal - attributePointsSpent,
        },
        skills: {
          total: skillPointsTotal,
          spent: skillPointsSpent,
          remaining: skillPointsTotal - skillPointsSpent,
        },
        force: {
          total: forcePointsTotal,
          spent: forcePointsSpent,
          remaining: forcePointsTotal - forcePointsSpent,
        },
      };

      // Racial summary string for quick reference
      const mods = sr2GetRacialModifiers(metatype);
      const traits = sr2GetRacialTraits(metatype);
      const modParts = [
        ["Body", mods.body],
        ["Quickness", mods.quickness],
        ["Strength", mods.strength],
        ["Charisma", mods.charisma],
        ["Intelligence", mods.intelligence],
        ["Willpower", mods.willpower],
      ].filter(([, v]) => Number(v) !== 0);

      const traitParts = [];
      if (traits.lowLightVision) traitParts.push("Low-Light Vision");
      if (traits.thermographicVision) traitParts.push("Thermographic Vision");
      if (traits.reach) traitParts.push(`Reach +${traits.reach}`);
      if (traits.dermalArmor)
        traitParts.push(`Dermal Armor (+${traits.dermalArmor} Body vs damage)`);
      if (traits.diseaseResistance)
        traitParts.push(`Disease Resistance (+${traits.diseaseResistance} Body vs disease)`);

      const modsText = modParts.length
        ? `Racial Mods: ${modParts.map(([label, v]) => `${label} ${sr2FormatSignedModifier(v)}`).join(", ")}`
        : "";
      const traitsText = traitParts.length ? `Traits: ${traitParts.join(", ")}` : "";
      context.racialSummary = [modsText, traitsText].filter(Boolean).join(" | ");

      // Creation resources helpers (lifestyle + extras)
      const budgetOptions = {
        disableBuddies: context.sr2Settings.disableBuddies,
      };
      if (
        actorData.type === "character" &&
        context.sr2Settings.contactLevels &&
        context.contactLevelsSummary
      ) {
        budgetOptions.contactLevelsSummary = context.contactLevelsSummary;
      }
      context.creationResources = sr2ComputeCreationNuyenBudgetBreakdown(
        context.system,
        context.items,
        budgetOptions,
      );
    }

    return context;
  }

  /**
   * Organize and classify Items for Character sheets.
   */
  _prepareItems(context) {
    const gear = [];
    const weapons = [];
    const armor = [];
    const cyberware = [];
    const bioware = [];
    const spells = [];
    const adeptpowers = [];
    const skills = [];

    for (let i of context.items) {
      i.img = i.img || "icons/svg/item-bag.svg";

      if (i.type === "skill") {
        skills.push(i);
      } else if (i.type === "weapon") {
        weapons.push(i);
      } else if (i.type === "armor") {
        armor.push(i);
      } else if (i.type === "cyberware") {
        cyberware.push(i);
      } else if (i.type === "bioware") {
        bioware.push(i);
      } else if (i.type === "spell") {
        const explicitDamage = String(i.system?.damage || "")
          .trim()
          .toUpperCase();
        i.sr2Spell = {
          range: sr2GetSpellRangeLabel(i),
          resist: sr2GetSpellTargetLabel(i),
          damage: sr2InferCombatSpellDamageLevelFromName(i.name, {
            fallback: explicitDamage || sr2InferSpellDamageLevelFromDrain(i.system?.drain),
          }),
          drainDisplay: sr2FormatSpellDrain(i.system?.drain),
        };
        spells.push(i);
      } else if (i.type === "adeptpower") {
        // Calculate total cost for leveled powers
        if (i.system.hasLevels) {
          i.system.totalCost = i.system.cost * i.system.currentLevel;
        } else {
          i.system.totalCost = i.system.cost;
        }
        adeptpowers.push(i);
      } else if (i.type === "gear") {
        gear.push(i);
      }
    }

    context.gear = gear;
    context.weapons = weapons;
    context.armor = armor;
    context.cyberware = cyberware;
    context.bioware = bioware;
    context.spells = spells;
    context.adeptpowers = adeptpowers;
    context.skills = skills;

    // Prepare totem data for shamanic magicians
    const totems = [];
    for (let i of context.items) {
      if (i.type === "totem") {
        totems.push(i);
      }
    }
    context.totems = totems;

    // Find selected totem
    context.selectedTotem = totems.find((t) => t.system.isSelected);

    const round2 = (value) => Math.round((value + Number.EPSILON) * 100) / 100;

    // Calculate essence loss from installed cyberware
    const installedCyberware = cyberware.filter((c) => c.system.installed);
    const totalEssenceLoss = round2(
      installedCyberware.reduce((total, cyber) => {
        return total + (parseFloat(cyber.system.essence) || 0);
      }, 0),
    );

    // Calculate current essence (base essence - cyberware essence loss)
    const baseEssence = Number(context.system?.attributes?.essence?.max) || 6;
    const currentEssence = round2(Math.max(0, baseEssence - totalEssenceLoss));

    // Avoid Document updates during getData/render; derived Essence is handled in SR2Actor.prepareDerivedData.
    if (context.system?.attributes?.essence) {
      context.system.attributes.essence.value = currentEssence;
    }

    context.essenceData = {
      base: baseEssence,
      current: currentEssence,
      loss: totalEssenceLoss,
      available: currentEssence,
    };

    // Calculate total power points used for adept powers
    context.powerPointsUsed = adeptpowers.reduce((total, power) => {
      return total + (power.system.totalCost || 0);
    }, 0);

    // Calculate gear summary statistics
    const totalWeight = context.items.reduce((total, item) => {
      return total + (item.system.weight || 0) * (item.system.quantity || 1);
    }, 0);
    context.totalWeight = round2(totalWeight);
    context.totalWeightDisplay = context.totalWeight.toFixed(2);

    context.totalValue = context.items.reduce((total, item) => {
      return total + (item.system.price || 0) * (item.system.quantity || 1);
    }, 0);

    context.totalItems = context.items.reduce((total, item) => {
      return total + (item.system.quantity || 1);
    }, 0);
  }

  /**
   * Prepare character specific data
   */
  _prepareCharacterData(context) {
    // Calculate and display augmentation modifiers
    const modifiers =
      this.actor._sr2AugmentationModifiers ?? this.actor._calculateAugmentationModifiers();
    context.augmentationModifiers = modifiers;

    // Calculate total modified attributes for display
    const attrs = context.system.attributes;
    context.modifiedAttributes = {
      body: attrs.body.value + (modifiers.BOD || 0),
      quickness: attrs.quickness.value + (modifiers.QCK || 0),
      strength: attrs.strength.value + (modifiers.STR || 0),
      charisma: attrs.charisma.value + (modifiers.CHA || 0),
      intelligence: attrs.intelligence.value + (modifiers.INT || 0),
      willpower: attrs.willpower.value + (modifiers.WIL || 0),
      reaction: attrs.reaction.value, // Already includes modifiers
      initiativeDice: 1 + (modifiers.INI || 0),
    };

    // Check for cyberdeck (for Hacking Pool visibility)
    context.system.hasCyberdeck = this.actor.items.some(
      (item) => item.type === "cyberware" && item.name.toLowerCase().includes("cyberdeck"),
    );

    // Check for Vehicle Control Rig (for Control Pool visibility)
    context.system.hasControlRig = this.actor.items.some(
      (item) =>
        item.type === "cyberware" &&
        (item.name.toLowerCase().includes("control rig") ||
          item.name.toLowerCase().includes("vehicle control rig")),
    );
  }

  /**
   * Prepare skills data for the template
   */
  async _prepareSkillsData(context) {
    // Load the skills data from the JSON file
    try {
      const skillsData = await loadSkillsData();
      const availableSkills = foundry.utils.deepClone(skillsData);
      const hasMagic = (Number(this.actor.system?.attributes?.magic?.value) || 0) > 0;

      // Only characters with a Magic rating may take Sorcery/Conjuring (SR2 core).
      for (const key of ["Sorcery", "Conjuring"]) {
        if (!availableSkills[key]) continue;
        availableSkills[key].disabled = !hasMagic;
      }

      context.availableSkills = availableSkills;

      // Add concentration data for each skill
      context.skills.forEach((skill) => {
        if (skill.system.baseSkill && skillsData[skill.system.baseSkill]) {
          skill.availableConcentrations = skillsData[skill.system.baseSkill].Concentrations || [];
        } else {
          skill.availableConcentrations = [];
        }

        // Ensure all skill system properties exist with defaults
        if (!skill.system.baseSkill) skill.system.baseSkill = "";
        if (!skill.system.concentration) skill.system.concentration = "";
        if (!skill.system.specialization) skill.system.specialization = "";
        if (typeof skill.system.baseRating !== "number") skill.system.baseRating = 0;
        if (typeof skill.system.concentrationRating !== "number")
          skill.system.concentrationRating = 0;
        if (typeof skill.system.specializationRating !== "number")
          skill.system.specializationRating = 0;
        if (typeof skill.system.isFree !== "boolean") skill.system.isFree = false;

        // Ensure allocated rating exists in the template context and compute SR2 conc/spec math for display
        const computed = sr2ComputeSkillRatingsFromAllocated(skill.system);
        skill.system.allocatedRating = computed.allocatedRating;
        skill.system.baseRating = computed.baseRating;
        skill.system.concentrationRating = computed.concentrationRating;
        skill.system.specializationRating = computed.specializationRating;
      });
    } catch (error) {
      console.error("SR2E | Failed to load skills data:", error);
      context.availableSkills = {};
    }
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Initialize health data if needed
    this._initializeHealthData();

    // Set up actor update listener for external changes (once per sheet instance)
    if (!this._hasActorUpdateHook && globalThis.Hooks) {
      Hooks.on("updateActor", this._boundOnActorUpdate);
      this._hasActorUpdateHook = true;
    }

    // Ensure skill selects show correct values after render
    this._refreshSkillSelects(html);

    // Rollable abilities
    html.find(".rollable").click(this._onRoll.bind(this));

    // Open owned item sheets by clicking the item name
    const openItemSheetFromRow = (rowElement) => {
      if (!rowElement) return;

      const itemId = rowElement.getAttribute("data-item-id") || rowElement.dataset?.itemId;
      if (!itemId) {
        ui.notifications?.warn?.("No item id found for that row.");
        return;
      }

      const item = this.actor.items.get(itemId);
      if (!item) {
        ui.notifications?.warn?.(`Couldn't find item ${itemId} on this actor.`);
        return;
      }

      const sheet = item.sheet;
      if (!sheet) {
        ui.notifications?.warn?.(`No sheet is available for ${item.name}.`);
        return;
      }

      try {
        // Legacy Application render signature
        sheet.render(true);
      } catch (err) {
        try {
          // ApplicationV2 render signature
          sheet.render({ force: true });
        } catch (err2) {
          console.error("SR2E | Failed to open item sheet", {
            itemId,
            itemName: item.name,
            err,
            err2,
          });
          ui.notifications?.error?.(
            "Failed to open item sheet. Check the console (F12) for details.",
          );
        }
      }
    };

    const openItemSheet = (event) => {
      const ev = event;
      ev.preventDefault();
      ev.stopPropagation();

      const row = ev.currentTarget?.closest?.(".item-row");
      openItemSheetFromRow(row);
    };

    html.find(".item-row .item-name span").click(openItemSheet);

    // Also allow double-click anywhere on the row (excluding interactive controls)
    html.find(".item-row").dblclick((ev) => {
      ev.preventDefault();
      ev.stopPropagation();

      const tag = String(ev.target?.tagName || "").toLowerCase();
      if (["input", "select", "textarea", "button", "a", "label"].includes(tag)) return;
      if (ev.target?.closest?.(".item-actions")) return;

      openItemSheetFromRow(ev.currentTarget);
    });

    // Drag events for macros
    if (this.actor.isOwner) {
      let handler = (ev) => this._onDragStart(ev);

      // Enable drag for all item types
      const itemSelectors = [
        "li.item", // Generic items
        ".item-row .item-name img", // Item rows (drag from icon to avoid blocking clicks)
        ".skill-item .skill-image img", // Skills (drag from icon)
        ".program-row .program-name img", // Programs (drag from icon)
      ];

      itemSelectors.forEach((selector) => {
        html.find(selector).each((i, element) => {
          // Skip headers and elements without item IDs
          if (
            element.classList.contains("inventory-header") ||
            element.classList.contains("header")
          )
            return;

          const hasItemId = Boolean(
            element.dataset?.itemId ||
            element.getAttribute?.("data-item-id") ||
            element.closest?.("[data-item-id]")?.dataset?.itemId,
          );
          if (!hasItemId) return;

          element.setAttribute("draggable", true);
          element.addEventListener("dragstart", handler, false);

          // Add visual feedback for draggable items
          element.style.cursor = "grab";
        });
      });
    }

    // Everything below here is only needed if the sheet is editable
    if (!this.isEditable) return;

    this._trackDirtyFormFields(html);

    // Add Inventory Item
    html.find(".item-create").click(this._onItemCreate.bind(this));

    // Delete Inventory Item
    html.find(".item-delete").click(async (ev) => {
      ev.preventDefault();
      ev.stopPropagation();

      try {
        // Get item ID from button's data attribute or parent element
        const button = $(ev.currentTarget);

        // Try multiple ways to get the item ID
        let itemId =
          button.attr("data-item-id") ||
          button.data("item-id") ||
          button.data("itemId") ||
          button.parents(".item, .skill-item, .item-row").attr("data-item-id") ||
          button.parents(".item, .skill-item, .item-row").data("item-id") ||
          button.parents(".item, .skill-item, .item-row").data("itemId");

        console.log("SR2E | Delete item button clicked, itemId:", itemId);
        console.log("SR2E | Button data attributes:", button.get(0).dataset);
        console.log(
          "SR2E | Available items:",
          this.actor.items.map((i) => ({ id: i.id, name: i.name, type: i.type })),
        );

        if (!itemId) {
          console.warn("SR2E | No item ID found for delete operation");
          ui.notifications.error("Could not find item to delete. Check console for details.");
          return;
        }

        const item = this.actor.items.get(itemId);
        if (item) {
          // Confirm deletion for important items
          const confirmDelete =
            game.settings.get("core", "noCanvas") || confirm(`Delete ${item.name}?`);

          if (confirmDelete) {
            await item.delete();
            const row = button.parents(".item, .skill-item, .item-row");
            row.slideUp(200, () => this.render(false));
            ui.notifications.info(`${item.name} deleted successfully.`);
          }
        } else {
          console.warn(`SR2E | Item with ID ${itemId} not found in actor items`);
          console.warn(
            "SR2E | Available item IDs:",
            this.actor.items.map((i) => i.id),
          );
          ui.notifications.error(`Could not find item with ID: ${itemId}`);
        }
      } catch (error) {
        console.error("SR2E | Error deleting item:", error);
        ui.notifications.error("Failed to delete item. Check console for details.");
      }
    });

    // Active Effect management
    html.find(".effect-control").click((ev) => onManageActiveEffect(ev, this.actor));

    // Pool management
    html.find(".pool-adjust").click(this._onPoolAdjust.bind(this));
    html.find(".karma-earned-adjust").click(this._onKarmaEarnedAdjust.bind(this));
    html.find(".reset-all-pools").click(this._onResetAllPools.bind(this));

    // Skill management
    html.find(".base-skill-select").change(this._onBaseSkillChange.bind(this));
    html.find(".concentration-select").change(this._onConcentrationChange.bind(this));
    html
      .find('input[name*="specialization"]:not([name*="Rating"])')
      .on("change", this._onSpecializationChange.bind(this));
    html
      .find('input[name*="allocatedRating"]')
      .on("change", this._onSkillAllocatedRatingChange.bind(this));
    html
      .find('input[name*="allocatedRating"]')
      .on("blur", this._onSkillAllocatedRatingChange.bind(this));
    html
      .find('input[name*="allocatedRating"]')
      .on("input", this._onSkillAllocatedRatingInput.bind(this));
    html.find(".sr2-skill-allocated-adjust").click(this._onSkillAllocatedAdjust.bind(this));
    html.find(".skill-roll").click(this._onSkillRoll.bind(this));

    // Leader quick-open (followers)
    html.find(".open-leader").click(this._onOpenLeader.bind(this));
    html.find(".open-connection").click(this._onOpenConnection.bind(this));
    html.find(".sr2-add-contact").click(this._onAddContact.bind(this));
    html.find(".sr2-add-follower, .sr2-add-gang-member").click(this._onAddFollower.bind(this));
    html.find(".sr2-add-spirit").click(this._onAddSpirit.bind(this));
    html.find(".sr2-add-critter").click(this._onAddCritter.bind(this));
    html.find(".sr2-add-ic").click(this._onAddIC.bind(this));
    html.find(".sr2-adjust-contacts").click(this._onAdjustContacts.bind(this));
    html.find(".sr2-toggle-extra").click(this._onToggleExtra.bind(this));
    html.find(".sr2-complete-creation").click(this._onCompleteCreation.bind(this));

    // Lifestyle management
    if (["character", "contact", "follower"].includes(this.actor.type)) {
      html.find(".sr2-lifestyle-add").click(this._onLifestyleAdd.bind(this));
      html.find(".sr2-lifestyle-delete").click(this._onLifestyleDelete.bind(this));
    }

    // Handle form submission to ensure skill data is saved
    html.find("form").on("submit", this._onFormSubmit.bind(this));

    // Attribute rolls
    html.find(".attribute-roll").click(this._onAttributeRoll.bind(this));

    // Item browser
    html.find(".browse-items").click(this._onBrowseItems.bind(this));

    // Spell casting
    html.find(".spell-lock-toggle").click(this._onSpellLockToggle.bind(this));
    html.find(".spell-cast").click(this._onSpellCast.bind(this));

    // Weapon attacks
    html.find(".weapon-attack").click(this._onWeaponAttack.bind(this));

    // Range calculator
    html.find(".range-weapon-select").change(this._onRangeWeaponChange.bind(this));
    html.find(".range-distance").on("input", this._onRangeDistanceChange.bind(this));

    // Totem management
    html.find(".browse-totems").click(this._onBrowseTotems.bind(this));
    html.find(".change-totem").click(this._onBrowseTotems.bind(this));

    // Cyberware installation management
    html.find(".cyberware-installed").change(this._onCyberwareInstall.bind(this));
    html.find(".bioware-installed").change(this._onBiowareInstall.bind(this));

    // Damage quick controls (header)
    html.find(".sr2-damage-adjust").click(this._onDamageAdjust.bind(this));
    html.find(".sr2-damage-input").change(this._onDamageInputChange.bind(this));
    html.find(".initiative-roll-btn").click(this._onInitiativeRoll.bind(this));
  }

  /**
   * Handle creating a new Owned Item for the actor using initial data defined in the HTML dataset
   */
  async _onItemCreate(event) {
    event.preventDefault();
    event.stopPropagation();

    if (this._creatingEmbeddedItem) return;

    this._creatingEmbeddedItem = true;
    const createButton = event.currentTarget;
    createButton.setAttribute("aria-disabled", "true");
    const header = event.currentTarget;
    const type = header.dataset.type;
    const data = foundry.utils.deepClone(header.dataset);
    const typeLabel = type ? type.charAt(0).toUpperCase() + type.slice(1) : "Item";
    const name = `New ${typeLabel}`;
    const itemData = {
      name: name,
      type: type,
      system: data,
    };
    delete itemData.system["type"];

    try {
      const [created] = await this.actor.createEmbeddedDocuments("Item", [itemData]);
      await this.render(false);
      return created;
    } finally {
      this._creatingEmbeddedItem = false;
      createButton.removeAttribute("aria-disabled");
    }
  }

  /**
   * Handle clickable rolls
   */
  _onRoll(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const dataset = element.dataset;

    // Handle item rolls
    if (dataset.rollType) {
      if (dataset.rollType == "item") {
        const itemId = element.closest(".item").dataset.itemId;
        const item = this.actor.items.get(itemId);
        if (item) return item.roll();
      }
    }

    // Handle rolls that supply the formula directly
    if (dataset.roll) {
      let label = dataset.label ? `[ability] ${dataset.label}` : "";
      let roll = new Roll(dataset.roll, this.actor.getRollData());
      roll.toMessage(
        sr2ApplyMessageMode({
          speaker: ChatMessage.getSpeaker({ actor: this.actor }),
          flavor: label,
        }),
      );
      return roll;
    }
  }

  /**
   * Handle pool adjustments
   */
  _onPoolAdjust(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const poolType = element.dataset.pool;
    const adjustment = parseInt(element.dataset.adjust);

    const pool = this.actor.system?.pools?.[poolType];
    if (!pool) return;

    const currentValue = Number(pool.current) || 0;
    const maxValue = poolType === "karma" ? Number(pool.total) || 0 : Number(pool.max) || 0;
    const newValue = sr2Clamp(currentValue + adjustment, 0, maxValue);

    this.actor.update({ [`system.pools.${poolType}.current`]: newValue });
  }

  _onKarmaEarnedAdjust(event) {
    event.preventDefault();

    const adjustment = parseInt(event.currentTarget?.dataset?.adjust, 10);
    if (!Number.isFinite(adjustment) || adjustment === 0) return;

    const currentValue = Number(this.actor.system?.karma?.earned) || 0;
    const newValue = Math.max(0, Math.floor(currentValue + adjustment));

    this.actor.update({ "system.karma.earned": newValue });
  }

  /**
   * Reset all visible pools to their maximum values.
   */
  async _onResetAllPools(event) {
    event.preventDefault();

    // Check conditions for pool visibility
    const magicAttribute = this.actor.system.attributes.magic?.value || 0;
    const isSpellcaster =
      Boolean(this.actor.system.magic?.awakened) &&
      !Boolean(this.actor.system.magic?.physicalAdept);
    const hasCyberdeck = this.actor.items.some(
      (item) => item.type === "cyberware" && item.name.toLowerCase().includes("cyberdeck"),
    );
    const hasControlRig = this.actor.items.some(
      (item) =>
        item.type === "cyberware" &&
        (item.name.toLowerCase().includes("control rig") ||
          item.name.toLowerCase().includes("vehicle control rig")),
    );

    // Build update data for available pools only
    const updateData = {};
    const poolData = this.actor.system.pools;

    // Define pool types with their visibility conditions
    const poolTypes = [
      { key: "combat", condition: true },
      { key: "spell", condition: isSpellcaster && magicAttribute > 0 },
      { key: "hacking", condition: hasCyberdeck },
      { key: "control", condition: hasControlRig },
      { key: "task", condition: (poolData.task?.max || 0) > 0 },
      { key: "astral", condition: isSpellcaster && magicAttribute > 0 },
    ];

    poolTypes.forEach((poolType) => {
      if (poolType.condition && poolData[poolType.key]) {
        updateData[`system.pools.${poolType.key}.current`] = poolData[poolType.key].max;
      }
    });

    // Update the actor
    await this.actor.update(updateData);

    // Show confirmation message
    ui.notifications.info(`All available dice pools reset to maximum for ${this.actor.name}`);
  }

  /**
   * Handle base skill selection change
   */
  async _onBaseSkillChange(event) {
    event.preventDefault();
    event.stopPropagation();
    const element = event.currentTarget;
    const skillId = element.dataset.skillId;
    const baseSkill = element.value;
    const item = this.actor.items.get(skillId);

    if (item) {
      // Only clear concentration and specialization if the base skill actually changed
      const currentBaseSkill = item.system.baseSkill;

      if (currentBaseSkill !== baseSkill) {
        // Prevent duplicate base skills (Languages may have multiple entries)
        if (baseSkill && baseSkill !== "Language") {
          const duplicate = this.actor.items.some(
            (i) => i.type === "skill" && i.id !== item.id && i.system?.baseSkill === baseSkill,
          );
          if (duplicate) {
            ui.notifications.warn(
              `"${baseSkill}" is already on the sheet. Each skill can only be acquired once.`,
            );
            element.value = currentBaseSkill || "";
            return;
          }
        }

        // Clear concentration and specialization when base skill changes
        const nextSystem = {
          ...item.system,
          baseSkill: baseSkill,
          concentration: "",
          specialization: "",
        };

        const computed = sr2ComputeSkillRatingsFromAllocated(nextSystem);
        await item.update({
          "system.baseSkill": baseSkill,
          "system.concentration": "",
          "system.specialization": "",
          "system.allocatedRating": computed.allocatedRating,
          "system.baseRating": computed.baseRating,
          "system.concentrationRating": computed.concentrationRating,
          "system.specializationRating": computed.specializationRating,
          name: baseSkill || "New Skill",
        });
      } else {
        // Even if the base skill didn't change, make sure the select shows the correct value
        element.value = baseSkill;
      }
    } else {
      console.error("SR2E | Could not find skill item for base skill change:", skillId);
    }
  }

  /**
   * Handle concentration selection change
   */
  async _onConcentrationChange(event) {
    event.preventDefault();
    event.stopPropagation();
    const element = event.currentTarget;
    const skillId = element.dataset.skillId || element.closest(".skill-item").dataset.itemId;
    const concentration = element.value;
    const item = this.actor.items.get(skillId);

    if (!item) {
      console.error("SR2E | Could not find skill item for concentration change:", skillId);
      return;
    }

    if (item.system.isFree) {
      element.value = item.system.concentration || "";
      return;
    }

    if (item.system.concentration === concentration) return;

    const baseSkill = item.system.baseSkill || "";
    if (baseSkill === "Language") {
      element.value = "";
      return;
    }

    const currentAllocated = sr2SkillInferAllocatedRating(item.system);
    let nextAllocated = currentAllocated;

    // Clearing concentration also clears specialization (SR2: spec implies concentration)
    const nextSpecialization = concentration ? item.system.specialization || "" : "";

    // If a concentration is selected, ensure allocated rating supports it (min 2)
    const computedPreview = sr2ComputeSkillRatingsFromAllocated({
      ...item.system,
      concentration,
      specialization: nextSpecialization,
      allocatedRating: nextAllocated,
    });

    if (baseSkill && nextAllocated < computedPreview.minAllocated) {
      nextAllocated = computedPreview.minAllocated;
    }

    const computed = sr2ComputeSkillRatingsFromAllocated({
      ...item.system,
      concentration,
      specialization: nextSpecialization,
      allocatedRating: nextAllocated,
    });

    await item.update({
      "system.concentration": concentration,
      "system.specialization": nextSpecialization,
      "system.allocatedRating": computed.allocatedRating,
      "system.baseRating": computed.baseRating,
      "system.concentrationRating": computed.concentrationRating,
      "system.specializationRating": computed.specializationRating,
    });
  }

  /**
   * Handle specialization text change
   */
  async _onSpecializationChange(event) {
    event.preventDefault();
    event.stopPropagation();
    const element = event.currentTarget;
    const skillId = element.dataset.skillId || element.closest(".skill-item").dataset.itemId;
    const specialization = element.value;
    const item = this.actor.items.get(skillId);

    if (!item) {
      console.error("SR2E | Could not find skill item for specialization change:", skillId);
      return;
    }

    if (item.system.isFree) {
      element.value = item.system.specialization || "";
      return;
    }

    if (item.system.specialization === specialization) return;

    const baseSkill = item.system.baseSkill || "";
    if (baseSkill === "Language") {
      element.value = "";
      return;
    }

    if (specialization && !item.system.concentration) {
      ui.notifications.warn("Specialization requires a Concentration.");
      element.value = "";
      return;
    }

    const currentAllocated = sr2SkillInferAllocatedRating(item.system);
    let nextAllocated = currentAllocated;

    const computedPreview = sr2ComputeSkillRatingsFromAllocated({
      ...item.system,
      specialization,
      allocatedRating: nextAllocated,
    });

    if (baseSkill && specialization && nextAllocated < computedPreview.minAllocated) {
      nextAllocated = computedPreview.minAllocated;
    }

    const computed = sr2ComputeSkillRatingsFromAllocated({
      ...item.system,
      specialization,
      allocatedRating: nextAllocated,
    });

    await item.update({
      "system.specialization": specialization,
      "system.allocatedRating": computed.allocatedRating,
      "system.baseRating": computed.baseRating,
      "system.concentrationRating": computed.concentrationRating,
      "system.specializationRating": computed.specializationRating,
    });
  }

  /**
   * Refresh skill select elements to ensure they show correct values
   */
  _refreshSkillSelects(html) {
    // Ensure base skill selects show the correct selected values
    html.find(".base-skill-select").each((i, select) => {
      const skillId = select.dataset.skillId;
      const skill = this.actor.items.get(skillId);
      if (skill && skill.system.baseSkill) {
        select.value = skill.system.baseSkill;
      }
    });

    // Ensure concentration selects show the correct selected values
    html.find(".concentration-select").each((i, select) => {
      const skillId = select.dataset.skillId;
      const skill = this.actor.items.get(skillId);
      if (skill && skill.system.concentration) {
        select.value = skill.system.concentration;
      }
    });
  }

  _isCreationMode() {
    return sr2HasCreationLimits(this.actor.system);
  }

  /**
   * Handle allocated skill rating changes (SR2 skill point spending)
   */
  async _onSkillAllocatedRatingChange(event) {
    event.preventDefault();
    event.stopPropagation();

    const element = event.currentTarget;
    const skillId = element.closest(".skill-item")?.dataset?.itemId;
    const item = skillId ? this.actor.items.get(skillId) : null;
    if (!item) return;
    if (item.system.isFree) {
      element.value = sr2SkillInferAllocatedRating(item.system);
      return;
    }

    const baseSkill = item.system.baseSkill || "";
    let nextAllocated = parseInt(element.value, 10);
    if (!Number.isFinite(nextAllocated)) nextAllocated = 0;

    const preview = { ...item.system, allocatedRating: nextAllocated };
    const computedPreview = sr2ComputeSkillRatingsFromAllocated(preview);

    // Starting skills must have a minimum rating (SR2 p. 45). Allow 0 only if no base skill selected.
    const minAllocated = baseSkill ? computedPreview.minAllocated : 0;
    const maxAllocated = this._isCreationMode() ? 6 : 99;

    nextAllocated = sr2Clamp(nextAllocated, minAllocated, maxAllocated);

    const computed = sr2ComputeSkillRatingsFromAllocated({
      ...item.system,
      allocatedRating: nextAllocated,
    });

    await item.update({
      "system.allocatedRating": computed.allocatedRating,
      "system.baseRating": computed.baseRating,
      "system.concentrationRating": computed.concentrationRating,
      "system.specializationRating": computed.specializationRating,
    });
  }

  _onSkillAllocatedRatingInput(event) {
    const element = event.currentTarget;
    const rating = parseInt(element.value, 10);
    if (!Number.isFinite(rating)) {
      element.style.borderColor = "";
      return;
    }

    const maxAllocated = this._isCreationMode() ? 6 : 99;
    if (rating < 0 || rating > maxAllocated) {
      element.style.borderColor = "#ff6b6b";
    } else {
      element.style.borderColor = "";
    }
  }

  async _onSkillAllocatedAdjust(event) {
    event.preventDefault();
    event.stopPropagation();

    const button = event.currentTarget;
    const delta = parseInt(button?.dataset?.adjust, 10);
    if (!Number.isFinite(delta) || delta === 0) return;

    const row = button.closest(".skill-item");
    const skillId = button?.dataset?.skillId || row?.dataset?.itemId;
    if (!row || !skillId) return;

    const input = row.querySelector('input[name*="allocatedRating"]');
    if (!input) return;

    const current = parseInt(input.value, 10);
    const next = (Number.isFinite(current) ? current : 0) + delta;
    input.value = String(next);

    await this._onSkillAllocatedRatingChange({
      preventDefault: () => {},
      stopPropagation: () => {},
      currentTarget: input,
    });

    const item = this.actor.items.get(skillId);
    if (item && !item.system?.isFree) {
      input.value = String(sr2SkillInferAllocatedRating(item.system));
    }
  }

  _onOpenLeader(event) {
    event.preventDefault();
    event.stopPropagation();

    const leaderId = event.currentTarget?.dataset?.leaderId;
    const leader = leaderId ? game?.actors?.get(leaderId) : null;
    if (!leader) {
      ui.notifications.warn("Leader not found.");
      return;
    }

    leader.sheet?.render(true);
  }

  _onOpenConnection(event) {
    event.preventDefault();
    event.stopPropagation();

    const actorId = event.currentTarget?.dataset?.actorId;
    const actor = actorId ? game?.actors?.get(actorId) : null;
    if (!actor) {
      ui.notifications.warn("Actor not found.");
      return;
    }

    actor.sheet?.render(true);
  }

  async _onAdjustContacts(event) {
    event.preventDefault();
    event.stopPropagation();

    if (!this._isCreationMode()) return;
    if (Boolean(sr2GetSystemSetting("contactLevels", false))) return;

    const delta = parseInt(event.currentTarget?.dataset?.delta, 10);
    if (!Number.isFinite(delta) || delta === 0) return;

    const raw = Math.max(0, parseInt(this.actor.system?.creation?.extras?.contacts, 10) || 0);
    const current = Math.max(2, raw);
    const next = Math.max(2, current + delta);

    await this.actor.update({
      "system.creation.extras.contacts": next,
    });
  }

  async _onToggleExtra(event) {
    event.preventDefault();
    event.stopPropagation();

    if (!this._isCreationMode()) return;

    const extra = event.currentTarget?.dataset?.extra;
    const disableBuddies =
      Boolean(sr2GetSystemSetting("disableBuddies", false)) ||
      Boolean(sr2GetSystemSetting("contactLevels", false));
    const allowed = disableBuddies ? ["gang", "followers"] : ["buddy", "gang", "followers"];
    if (!allowed.includes(extra)) return;

    const current = Math.max(0, parseInt(this.actor.system?.creation?.extras?.[extra], 10) || 0);
    const next = current > 0 ? 0 : 1;

    await this.actor.update({
      [`system.creation.extras.${extra}`]: next,
    });
  }

  async _onCompleteCreation(event) {
    event.preventDefault();
    event.stopPropagation();

    if (this.actor.type !== "character" || !this._isCreationMode()) return false;

    const contactLevelsEnabled = Boolean(sr2GetSystemSetting("contactLevels", false));
    const disableBuddies =
      contactLevelsEnabled || Boolean(sr2GetSystemSetting("disableBuddies", false));
    const metatype = this.actor.system?.details?.metatype || "human";
    const budgetOptions = { disableBuddies };
    const linkedActors =
      game?.actors?.filter((a) => a.system?.details?.leaderId === this.actor.id) ?? [];
    const leaderContacts = linkedActors
      .filter((a) => a.type === "contact")
      .map((a) => ({
        id: a.id,
        sort: Number(a.sort) || 0,
        contactLevel: a.system?.details?.contactLevel,
      }));

    if (contactLevelsEnabled) {
      const charisma = Number(this.actor.system?.attributes?.charisma?.value) || 0;
      const summary = sr2ComputeContactLevelSummary(leaderContacts, charisma);
      budgetOptions.contactLevelsSummary = summary;

      if (summary.over.extraContacts) {
        ui.notifications.error(
          "Too many contacts (max extra contacts is 3× Charisma, plus two free).",
        );
        return false;
      }
      if (summary.over.extraLevel2) {
        ui.notifications.error(
          "Too many Level 2+ contacts (max extra Level 2 upgrades is 2× Charisma).",
        );
        return false;
      }
      if (summary.over.extraLevel3) {
        ui.notifications.error(
          "Too many Level 3 contacts (max extra Level 3 upgrades is 1× Charisma).",
        );
        return false;
      }
    } else {
      const purchasedContacts = Math.max(
        2,
        Math.max(0, parseInt(this.actor.system?.creation?.extras?.contacts, 10) || 0),
      );
      if (leaderContacts.length > purchasedContacts) {
        ui.notifications.error("Too many contacts for the purchased creation extras.");
        return false;
      }
    }

    const gangArchetypes = new Set(["gangMember", "tribesman"]);
    const followerCount = linkedActors.filter(
      (a) => a.type === "follower" && !gangArchetypes.has(a.system?.details?.archetype || ""),
    ).length;
    const followersPurchased =
      Math.max(0, parseInt(this.actor.system?.creation?.extras?.followers, 10) || 0) > 0;
    const followerLimit = followersPurchased ? 5 : 0;
    if (followerCount > followerLimit) {
      ui.notifications.error("Too many followers for the purchased creation extras.");
      return false;
    }

    const completion = sr2BuildCreationCompletionSummary({
      system: this.actor.system,
      items: this.actor.items,
      metatype,
      budgetOptions,
    });

    const RollCtor = globalThis.Roll;
    if (!RollCtor) {
      ui.notifications.error("Foundry Roll is unavailable, so creation cannot be completed.");
      return false;
    }

    const startingCashRoll = await new RollCtor("3d6 * 1000").evaluate({ async: true });
    const finalized = sr2BuildCreationCompletionSummary({
      system: this.actor.system,
      items: this.actor.items,
      metatype,
      startingCashRoll: startingCashRoll?.total,
      budgetOptions,
    });
    const computedStartingCashFinal = finalized.startingCashFinal;
    const currentNuyen = Math.max(
      0,
      Math.floor(Number(this.actor.system?.resources?.nuyen) || 0),
    );
    const finalNuyen = Math.max(currentNuyen, computedStartingCashFinal);
    finalized.startingCashFinal = finalNuyen;
    finalized.computedStartingCashFinal = computedStartingCashFinal;

    const moreMetahumans = Boolean(sr2GetSystemSetting("moreMetahumans", false));
    const startingKarmaPool = sr2ComputeStartingKarmaPool(metatype, { moreMetahumans });

    await this.actor.update({
      "system.resources.nuyen": finalNuyen,
      "system.pools.karma.current": startingKarmaPool,
      "system.pools.karma.total": startingKarmaPool,
      "system.pools.karma.base": startingKarmaPool,
      "system.karma.earned": 0,
      "system.karma.spent": 0,
      "system.creation.attributePoints": 0,
      "system.creation.skillPoints": 0,
      "system.creation.forcePoints": 0,
      "system.creation.startingNuyen": 0,
      "system.creation.resourcesFinalized": true,
      "system.creation.unspentNuyen": finalized.unspentNuyen,
      "system.creation.startingCashFromUnspent": finalized.startingCashFromUnspent,
      "system.creation.startingCashRoll": finalized.startingCashRoll,
      "system.creation.startingCashFinal": finalized.startingCashFinal,
    });

    ui.notifications.info(
      `Character creation completed. Starting cash: ¥${finalNuyen}. Karma Pool: ${startingKarmaPool}.`,
    );
    return finalized;
  }

  async _sr2OpenActorCreateDialogWithDefaults({ type, leaderId = null, archetype = null }) {
    const applyDefaults = (app, html) => {
      try {
        // Normalize to a root element
        const root = html?.[0] ?? html;
        if (!root) return false;

        const form = root.matches?.("form") ? root : root.querySelector?.("form");
        if (!form) return false;

        const typeSelect = form.querySelector('select[name="type"]');
        if (!typeSelect) return false;

        // Only target the "Create Actor" dialog for this system.
        // Some Foundry versions use different create-dialog classes/hooks, so keep this check permissive.
        const optionValues = Array.from(typeSelect.options || []).map((o) => o.value);
        const isSR2ActorCreateDialog =
          optionValues.includes("character") &&
          (optionValues.includes("contact") ||
            optionValues.includes("follower") ||
            optionValues.includes("spirit"));
        if (!isSR2ActorCreateDialog) return false;
        if (!optionValues.includes(type)) return false;

        // Prefer setting after other render-hook enhancers have injected fields/handlers.
        setTimeout(() => {
          try {
            if (typeSelect.value !== type) {
              typeSelect.value = type;
              typeSelect.dispatchEvent(new Event("change", { bubbles: true }));
            }

            if (leaderId) {
              const leaderSelect = form.querySelector('select[name="system.details.leaderId"]');
              if (leaderSelect) {
                leaderSelect.value = leaderId;
                leaderSelect.dispatchEvent(new Event("change", { bubbles: true }));
              }
            }

            if (archetype !== null) {
              const archetypeSelect = form.querySelector('select[name="system.details.archetype"]');
              if (archetypeSelect) {
                archetypeSelect.value = archetype;
                archetypeSelect.dispatchEvent(new Event("change", { bubbles: true }));
              }
            }
          } catch (err) {
            console.warn("SR2E | Failed to prefill Create Actor dialog:", err);
          }
        }, 0);

        return true;
      } catch (err) {
        console.warn("SR2E | Failed to open Create Actor dialog:", err);
        return false;
      }
    };

    let applied = false;
    const handler = (app, html) => {
      if (applied) return;
      applied = applyDefaults(app, html);
      if (!applied) return;
      cleanup();
    };

    const cleanup = () => {
      try {
        Hooks.off("renderActorCreateDialog", handler);
      } catch (_) {}
      try {
        Hooks.off("renderDialog", handler);
      } catch (_) {}
      try {
        Hooks.off("renderDocumentCreateDialog", handler);
      } catch (_) {}
      try {
        Hooks.off("renderDocumentCreationDialog", handler);
      } catch (_) {}
    };

    // Foundry versions differ: create-actor can fire multiple render hooks depending on version.
    Hooks.on("renderActorCreateDialog", handler);
    Hooks.on("renderDialog", handler);
    Hooks.on("renderDocumentCreateDialog", handler);
    Hooks.on("renderDocumentCreationDialog", handler);

    // Safety: don't leave hooks installed if something unexpected happens.
    setTimeout(() => {
      if (!applied) cleanup();
    }, 10000);

    return Actor.createDialog({ type });
  }

  async _onAddContact(event) {
    event.preventDefault();
    event.stopPropagation();

    return this._sr2OpenActorCreateDialogWithDefaults({
      type: "contact",
      leaderId: this.actor.id,
    });
  }

  async _onAddFollower(event) {
    event.preventDefault();
    event.stopPropagation();

    const archetype = event.currentTarget?.dataset?.archetype ?? "";

    return this._sr2OpenActorCreateDialogWithDefaults({
      type: "follower",
      leaderId: this.actor.id,
      archetype,
    });
  }

  async _onAddSpirit(event) {
    event.preventDefault();
    event.stopPropagation();

    return this._sr2OpenActorCreateDialogWithDefaults({
      type: "spirit",
    });
  }

  async _onAddCritter(event) {
    event.preventDefault();
    event.stopPropagation();

    return this._sr2OpenActorCreateDialogWithDefaults({
      type: "critter",
    });
  }

  async _onAddIC(event) {
    event.preventDefault();
    event.stopPropagation();

    return this._sr2OpenActorCreateDialogWithDefaults({
      type: "ic",
    });
  }

  _getNormalizedLifestylesFromActor() {
    const rawLifestyles = this.actor.system?.resources?.lifestyles;
    if (Array.isArray(rawLifestyles) && rawLifestyles.length) {
      return foundry.utils.deepClone(rawLifestyles).map((l) => ({
        type: l?.type || "street",
        months: Math.max(1, parseInt(l?.months, 10) || 1),
      }));
    }

    const legacyLifestyle = this.actor.system?.resources?.lifestyle || "street";
    const legacyMonths = this.actor.system?.creation?.lifestyleMonths ?? 1;
    return [
      {
        type: legacyLifestyle,
        months: Math.max(1, parseInt(legacyMonths, 10) || 1),
      },
    ];
  }

  async _onLifestyleAdd(event) {
    event.preventDefault();
    event.stopPropagation();

    const lifestyles = this._getNormalizedLifestylesFromActor();
    lifestyles.push({ type: "street", months: 1 });

    const primary = lifestyles[0] || { type: "street", months: 1 };
    await this.actor.update({
      "system.resources.lifestyles": lifestyles,
      "system.resources.lifestyle": primary.type || "street",
      "system.creation.lifestyleMonths": primary.months || 1,
    });
  }

  async _onLifestyleDelete(event) {
    event.preventDefault();
    event.stopPropagation();

    const index = parseInt(event.currentTarget?.dataset?.index, 10);
    if (!Number.isFinite(index)) return;

    const lifestyles = this._getNormalizedLifestylesFromActor();
    lifestyles.splice(index, 1);
    if (!lifestyles.length) lifestyles.push({ type: "street", months: 1 });

    const primary = lifestyles[0] || { type: "street", months: 1 };
    await this.actor.update({
      "system.resources.lifestyles": lifestyles,
      "system.resources.lifestyle": primary.type || "street",
      "system.creation.lifestyleMonths": primary.months || 1,
    });
  }

  /**
   * Handle form submission to ensure all data is properly saved
   */
  async _onFormSubmit(event) {
    sr2LogDebug("Form submitted");
    // Let the default form submission handle the data
    // Our _updateObject method will process it
  }

  /**
   * Handle skill roll
   */
  async _onSkillRoll(event) {
    event.preventDefault();
    const skillId = event.currentTarget.dataset.skillId;
    const rollType = event.currentTarget.dataset.rollType || "base";

    sr2LogDebug("Skill roll requested", { skillId, rollType });

    const skill = this.actor.items.get(skillId);
    const formElement = event.currentTarget.closest("form");
    let allocatedRatingValue;
    if (formElement) {
      const allocatedRatingInput = formElement.querySelector(
        `input[name*="${skillId}"][name*="allocatedRating"]`,
      );
      if (allocatedRatingInput) {
        allocatedRatingValue = parseInt(allocatedRatingInput.value, 10);
      }
    }

    const preparedRoll = sr2PrepareSkillRoll({
      actor: this.actor,
      skill,
      rollType,
      allocatedRatingValue,
    });
    if (!preparedRoll.ok) {
      if (preparedRoll.warning) ui.notifications.warn(preparedRoll.warning);
      else if (preparedRoll.error) ui.notifications.error(preparedRoll.error);
      return;
    }

    sr2LogDebug("Prepared skill roll", {
      skillName: preparedRoll.skill?.name,
      rollType,
      skillRating: preparedRoll.skillRating,
      dicePool: preparedRoll.dicePool,
      defaulting: preparedRoll.isDefaulting,
    });

    if (preparedRoll.baseSkillName === "Conjuring") {
      await this._onConjuringRoll(preparedRoll.dicePool, preparedRoll.finalTitle);
      return;
    }

    await this._showTargetNumberDialog(
      preparedRoll.dicePool,
      preparedRoll.finalTitle,
      "skill",
      4,
      null,
      {
        baseSkillName: preparedRoll.baseSkillName,
      },
    );
  }

  async _promptConjuringDetails() {
    const defaultForce = 4;

    const content = `
      <div class="sr2-conjuring-details">
        <div class="form-group">
          <label><strong>Spirit Type</strong></label>
          <input type="text" name="spiritType" value="" placeholder="e.g. Water elemental, Hearth spirit"/>
        </div>
        <div class="form-group">
          <label><strong>Spirit Force</strong></label>
          <input type="number" name="spiritForce" value="${defaultForce}" min="1" max="30"/>
        </div>
        <p><em>SR2: Magic Pool does not apply to Conjuring tests.</em></p>
      </div>
    `;

    return new Promise((resolve) => {
      let isResolved = false;
      let isRolling = false;
      const finish = (result) => {
        if (isResolved) return;
        isResolved = true;
        resolve(result);
      };

      const dialog = new Dialog({
        title: "Conjuring",
        content,
        buttons: {
          continue: {
            icon: '<i class="fas fa-dice-d6"></i>',
            label: "Continue",
            callback: (html) => {
              const spiritType = String(html.find('input[name="spiritType"]').val() || "").trim();
              const force = Math.max(
                1,
                parseInt(html.find('input[name="spiritForce"]').val(), 10) || defaultForce,
              );
              finish({ ok: true, spiritType, force });
            },
          },
          cancel: {
            icon: '<i class="fas fa-times"></i>',
            label: "Cancel",
            callback: () => finish({ ok: false }),
          },
        },
        default: "continue",
        close: () => finish({ ok: false }),
      });

      dialog.render(true);
    });
  }

  _sr2NormalizeSpiritType(value) {
    return String(value || "")
      .trim()
      .replace(/\s+/g, " ")
      .toLowerCase();
  }

  _sr2DescribeConjuringDrain(force, charisma) {
    const f = Math.max(1, Number(force) || 1);
    const cha = Math.max(0, Number(charisma) || 0);

    if (cha <= 0) return "";

    if (f < cha / 2) return "L Stun";
    if (f <= cha) return "M Stun";
    if (f <= 2 * cha) return "S Physical";
    return "D Physical";
  }

  async _onConjuringRoll(conjuringDicePool, title) {
    const details = await this._promptConjuringDetails();
    if (!details?.ok) return;

    const spiritType = String(details.spiritType || "").trim();
    const force = Math.max(1, Number(details.force) || 1);
    const normalizedSpiritType = this._sr2NormalizeSpiritType(spiritType);

    const focusPools = [];
    const equippedGear = this.actor.items.filter((i) => i.type === "gear" && i.system?.equipped);
    for (const item of equippedGear) {
      const focus = sr2ParseFocusName(item.name);
      if (!focus) continue;
      if (focus.kind !== "spirit focus") continue;

      const focusSpiritType = this._sr2NormalizeSpiritType(item.system?.focus?.spiritType);
      if (!normalizedSpiritType || !focusSpiritType || focusSpiritType !== normalizedSpiritType)
        continue;

      focusPools.push({
        key: `focus-spirit-${item.id}`,
        name: `${item.name} (${item.system?.focus?.spiritType || spiritType})`,
        current: focus.rating,
        max: focus.rating,
        isActorPool: false,
      });
    }

    const conjuringTitle = spiritType
      ? `${title}: ${spiritType} (Force ${force})`
      : `${title} (Force ${force})`;
    const conjuringResult = await this._showTargetNumberDialog(
      conjuringDicePool,
      conjuringTitle,
      "skill",
      force,
      null,
      {
        baseSkillName: "Conjuring",
        additionalPools: focusPools,
      },
    );
    if (!conjuringResult?.rolled) return;

    const focusDiceUsed = {};
    for (const { pool, dice } of conjuringResult.poolsUsed || []) {
      if (pool?.isActorPool) continue;
      if (!pool?.key) continue;
      focusDiceUsed[pool.key] = (focusDiceUsed[pool.key] || 0) + (Number(dice) || 0);
    }

    const remainingFocusPools = focusPools
      .map((pool) => {
        const used = Number(focusDiceUsed[pool.key]) || 0;
        return {
          ...pool,
          current: Math.max(0, (Number(pool.current) || 0) - used),
        };
      })
      .filter((pool) => (Number(pool.current) || 0) > 0);

    // SR2: Conjuring drain uses Charisma dice against TN = spirit Force (see Conjuring, p. 139).
    const charisma = Number(this.actor.system?.attributes?.charisma?.value) || 0;
    const drainDicePool = charisma;
    const drainCode = this._sr2DescribeConjuringDrain(force, charisma);
    const drainTitle = `Conjuring Drain Resistance${drainCode ? ` (${drainCode})` : ""}${spiritType ? `: ${spiritType}` : ""}`;

    await this._showTargetNumberDialog(drainDicePool, drainTitle, "drain", force, null, {
      baseSkillName: "Conjuring",
      additionalPools: remainingFocusPools,
    });
  }

  /**
   * Handle attribute roll
   */
  async _onAttributeRoll(event) {
    event.preventDefault();
    const attributeName = event.currentTarget.dataset.attribute;
    const attributeValue = Number(this.actor.system.attributes[attributeName]?.value) || 1;

    // Use modified attribute value if available (includes cyberware bonuses)
    const modifiers = this.actor._calculateAugmentationModifiers();
    let modifierValue = 0;

    // Map attribute names to modifier keys
    const modifierMap = {
      body: "BOD",
      quickness: "QCK",
      strength: "STR",
      charisma: "CHA",
      intelligence: "INT",
      willpower: "WIL",
      reaction: "RCT",
    };

    if (modifierMap[attributeName]) {
      // Reaction is already derived (includes modifiers) in `SR2Actor.prepareDerivedData`.
      // Avoid double-counting RCT/attribute modifiers on Reaction tests.
      if (attributeName !== "reaction") {
        modifierValue = modifiers[modifierMap[attributeName]] || 0;
      }
    }

    // Attributes roll their rating as dice pool (including modifiers)
    let dicePool = attributeValue + modifierValue;

    // Power Focus adds dice to Magic tests (spellcasters only)
    const isSpellcaster =
      Boolean(this.actor.system?.magic?.awakened) && !this.actor.system?.magic?.physicalAdept;
    const powerFocusBonus = isSpellcaster ? Number(this.actor._sr2PowerFocusBonus) || 0 : 0;
    const appliesPowerFocus = attributeName === "magic" && powerFocusBonus > 0;
    if (appliesPowerFocus) {
      dicePool += powerFocusBonus;
    }

    // Ensure minimum dice pool of 1
    if (dicePool < 1) {
      dicePool = 1;
    }

    let title = `${attributeName.charAt(0).toUpperCase() + attributeName.slice(1)} Test`;
    if (appliesPowerFocus) {
      title += ` [+${powerFocusBonus} Power Focus]`;
    }

    // Show TN selection dialog and roll
    await this._showTargetNumberDialog(dicePool, title, "attribute");
  }

  /**
   * Get available pools for dice rolling
   */
  _getAvailablePools(context = {}, rollActor = this.actor) {
    const pools = [];
    const poolData = rollActor.system.pools;

    // Define pool types with their visibility conditions
    const poolTypes = [
      { key: "karma", name: "Karma Pool", maxKey: "total", condition: true },
      { key: "combat", name: "Combat Pool", maxKey: "max", condition: true },
      { key: "spell", name: "Magic Pool", maxKey: "max", condition: true },
      { key: "hacking", name: "Hacking Pool", maxKey: "max", condition: true },
      { key: "control", name: "Control Pool", maxKey: "max", condition: true },
      { key: "task", name: "Task Pool", maxKey: "max", condition: true },
      { key: "astral", name: "Astral Combat Pool", maxKey: "max", condition: true },
    ];

    poolTypes.forEach((poolType) => {
      // Only add pools that meet their visibility condition
      if (poolType.condition) {
        const pool = poolData[poolType.key];
        if (pool) {
          pools.push({
            key: poolType.key,
            name: poolType.name,
            current: pool.current || 0,
            max: pool[poolType.maxKey] || 0,
            isActorPool: true,
          });
        }
      }
    });

    return pools;
  }

  /**
   * Show Target Number selection dialog
   */
  async _showTargetNumberDialog(
    dicePool,
    title,
    rollType,
    defaultTN = 4,
    weaponData = null,
    context = {},
  ) {
    const enrichedContext = { ...(context || {}), rollType };
    const rollActor = enrichedContext.rollActor || this.actor;
    const additionalPools = Array.isArray(enrichedContext?.additionalPools)
      ? enrichedContext.additionalPools
      : [];
    let availablePools = [
      ...this._getAvailablePools(enrichedContext, rollActor),
      ...additionalPools,
    ];

    const allowedPoolKeys = Array.isArray(enrichedContext?.allowedPoolKeys)
      ? enrichedContext.allowedPoolKeys
      : null;
    if (allowedPoolKeys) {
      availablePools = availablePools.filter((pool) => allowedPoolKeys.includes(pool.key));
    }
    if (!availablePools.some((pool) => pool.key === "additional")) {
      availablePools = [
        ...availablePools,
        { key: "additional", name: "Additional", isActorPool: false, isUnlimited: true },
      ];
    }

    const poolCaps =
      enrichedContext?.poolCaps && typeof enrichedContext.poolCaps === "object"
        ? enrichedContext.poolCaps
        : {};
    const isRangedAttack =
      rollType === "attack" && weaponData && weaponData.system.weaponType === "ranged";
    const rangedWoundModifier = isRangedAttack
      ? sr2GetInjuryModifiers({
          physicalBoxes: rollActor.system?.health?.physical?.value,
          stunBoxes: rollActor.system?.health?.stun?.value,
        }).targetNumber
      : 0;
    const autoRangedModifiers = isRangedAttack
      ? {
          recoilModifier: Number(enrichedContext?.autoRangedModifiers?.recoilModifier) || 0,
          accessoriesModifier:
            Number(enrichedContext?.autoRangedModifiers?.accessoriesModifier) || 0,
          calledShotModifier: Number(enrichedContext?.autoRangedModifiers?.calledShotModifier) || 0,
        }
      : { recoilModifier: 0, accessoriesModifier: 0, calledShotModifier: 0 };

    const rangedModifiersSection = isRangedAttack
      ? `
      <div class="ranged-modifiers-section">
        <h4><strong>Ranged Combat Modifiers:</strong></h4>
        <div class="modifier-grid">
          <div class="modifier-group">
            <label><strong>Recoil:</strong></label>
            <select name="recoil-modifier" class="modifier-select">
              <option value="0">None</option>
              <option value="1">Semi-automatic (+1)</option>
              <option value="2">Burst-fire (+2)</option>
              <option value="3">Full-auto (+3)</option>
              <option value="2">Heavy weapon (+2)</option>
            </select>
          </div>
          
          <div class="modifier-group">
            <label><strong>Visibility:</strong></label>
            <select name="visibility-modifier" class="modifier-select">
              <option value="0">Clear</option>
              <option value="8">Blind Fire (+8)</option>
            </select>
          </div>
          
          <div class="modifier-group">
            <label><strong>Cover:</strong></label>
            <select name="cover-modifier" class="modifier-select">
              <option value="0">None</option>
              <option value="4">Partial Cover (+4)</option>
            </select>
          </div>
          
          <div class="modifier-group">
            <label><strong>Multiple Targets:</strong></label>
            <select name="multiple-targets-modifier" class="modifier-select">
              <option value="0">Single Target</option>
              <option value="2">2 Targets (+2)</option>
              <option value="4">3 Targets (+4)</option>
              <option value="6">4 Targets (+6)</option>
              <option value="8">5 Targets (+8)</option>
              <option value="10">6+ Targets (+10)</option>
            </select>
          </div>
          
          <div class="modifier-group">
            <label><strong>Target Movement:</strong></label>
            <select name="target-movement-modifier" class="modifier-select">
              <option value="0">Normal</option>
              <option value="2">Target Running (+2)</option>
              <option value="-1">Target Stationary (-1)</option>
            </select>
          </div>
          
          <div class="modifier-group">
            <label><strong>Attacker in Melee:</strong></label>
            <select name="attacker-melee-modifier" class="modifier-select">
              <option value="0">Not in Melee</option>
              <option value="2">1 Opponent (+2)</option>
              <option value="4">2 Opponents (+4)</option>
              <option value="6">3 Opponents (+6)</option>
              <option value="8">4+ Opponents (+8)</option>
            </select>
          </div>
          
          <div class="modifier-group">
            <label><strong>Attacker Movement:</strong></label>
            <select name="attacker-movement-modifier" class="modifier-select">
              <option value="0">Stationary</option>
              <option value="1">Walking (+1)</option>
              <option value="2">Walking, Difficult Ground (+2)</option>
              <option value="4">Running (+4)</option>
              <option value="6">Running, Difficult Ground (+6)</option>
            </select>
          </div>
          
          <div class="modifier-group">
            <label><strong>Weapon Accessories:</strong></label>
            <select name="accessories-modifier" class="modifier-select">
              <option value="0">None</option>
              <option value="-2">Smartlink w/ Smartgun (-2)</option>
              <option value="-1">Smart Goggles w/ Smartgun (-1)</option>
              <option value="-1">Laser Sight (-1)</option>
            </select>
          </div>
          
          <div class="modifier-group">
            <label><strong>Other Modifiers:</strong></label>
            <select name="other-modifier" class="modifier-select">
              <option value="0">None</option>
              <option value="2">Using Second Firearm (+2)</option>
              <option value="-1">Aimed Shot, 1 Phase (-1)</option>
              <option value="-2">Aimed Shot, 2 Phases (-2)</option>
              <option value="-3">Aimed Shot, 3 Phases (-3)</option>
              <option value="-4">Aimed Shot, 4+ Phases (-4)</option>
            </select>
          </div>
        </div>
        <div class="total-modifier">
          <strong>Total TN Modifier: <span id="total-tn-modifier">+0</span></strong>
        </div>
      </div>
    `
      : "";

    const content = `
      <div class="target-number-dialog">
        <div class="roll-info">
          <h3>${title}</h3>
          <p><strong>Base Dice Pool:</strong> ${dicePool}</p>
        </div>
        
        <div class="target-number-section">
          <label for="target-number"><strong>Base Target Number:</strong></label>
          <select id="target-number" name="targetNumber">
            <option value="2" ${defaultTN === 2 ? "selected" : ""}>2 - Trivial</option>
            <option value="3" ${defaultTN === 3 ? "selected" : ""}>3 - Easy</option>
            <option value="4" ${defaultTN === 4 ? "selected" : ""}>4 - Average</option>
            <option value="5" ${defaultTN === 5 ? "selected" : ""}>5 - Fair</option>
            <option value="6" ${defaultTN === 6 ? "selected" : ""}>6 - Hard</option>
            <option value="7" ${defaultTN === 7 ? "selected" : ""}>7 - Extreme</option>
            <option value="8" ${defaultTN === 8 ? "selected" : ""}>8 - Nearly Impossible</option>
            <option value="9" ${defaultTN === 9 ? "selected" : ""}>9 - Impossible</option>
            <option value="10" ${defaultTN === 10 ? "selected" : ""}>10 - Miraculous</option>
            <option value="11" ${defaultTN === 11 ? "selected" : ""}>11</option>
            <option value="12" ${defaultTN === 12 ? "selected" : ""}>12</option>
            <option value="13" ${defaultTN === 13 ? "selected" : ""}>13</option>
            <option value="14" ${defaultTN === 14 ? "selected" : ""}>14</option>
            <option value="15" ${defaultTN === 15 ? "selected" : ""}>15</option>
            <option value="16" ${defaultTN === 16 ? "selected" : ""}>16</option>
            <option value="17" ${defaultTN === 17 ? "selected" : ""}>17</option>
            <option value="18" ${defaultTN === 18 ? "selected" : ""}>18</option>
            <option value="19" ${defaultTN === 19 ? "selected" : ""}>19</option>
            <option value="20" ${defaultTN === 20 ? "selected" : ""}>20</option>
            <option value="21" ${defaultTN === 21 ? "selected" : ""}>21</option>
            <option value="22" ${defaultTN === 22 ? "selected" : ""}>22</option>
            <option value="23" ${defaultTN === 23 ? "selected" : ""}>23</option>
            <option value="24" ${defaultTN === 24 ? "selected" : ""}>24</option>
            <option value="25" ${defaultTN === 25 ? "selected" : ""}>25</option>
            <option value="26" ${defaultTN === 26 ? "selected" : ""}>26</option>
            <option value="27" ${defaultTN === 27 ? "selected" : ""}>27</option>
            <option value="28" ${defaultTN === 28 ? "selected" : ""}>28</option>
            <option value="29" ${defaultTN === 29 ? "selected" : ""}>29</option>
            <option value="30" ${defaultTN === 30 ? "selected" : ""}>30</option>
          </select>
        </div>

        ${rangedModifiersSection}

	        ${
            availablePools.length > 0
              ? `
        <div class="pool-dice-section">
          <div class="pool-dice-header">
            <label><strong>Pool Dice (Optional):</strong></label>
            <button type="button" class="reset-pool-dice sr2-small-action" title="Reset pool dice allocation">
              <i class="fas fa-sync-alt"></i> Reset
            </button>
          </div>
          ${availablePools
            .map(
              (pool) => `
              ${(() => {
                const cap = Number(poolCaps?.[pool.key]);
                const maxDice = pool.isUnlimited
                  ? null
                  : Number.isFinite(cap)
                    ? Math.max(0, Math.min(pool.current, cap))
                    : pool.current;
                const hasDice = pool.isUnlimited || maxDice > 0;
                const disabledAttr = hasDice ? "" : "disabled";
                const tooltipAttr = hasDice ? "" : 'title="No dice available (pool is empty)"';
                const poolLabel = pool.isUnlimited
                  ? `${pool.name} (No limit)`
                  : `${pool.name} (${pool.current}/${pool.max})`;
                const maxAttr = pool.isUnlimited ? "" : `max="${maxDice}"`;
                return `
	            <div class="pool-option">
	              <label>
	                <input type="checkbox" name="pool-${pool.key}" value="${pool.key}" class="pool-checkbox" ${disabledAttr} ${tooltipAttr}>
	                ${poolLabel}
	              </label>
	              <input type="number" name="pool-${pool.key}-dice" 
	                     min="0" ${maxAttr} value="0" disabled class="pool-dice-input">
	            </div>
                `;
              })()}
	          `,
            )
            .join("")}
	        </div>
	        `
              : ""
          }
	      </div>
    `;

    return new Promise((resolve) => {
      let isResolved = false;
      let isRolling = false;
      const finish = (result) => {
        if (isResolved) return;
        isResolved = true;
        resolve(result);
      };

      const dialog = new Dialog({
        title: `${title} - Target Number Selection`,
        content: content,
        render: (html) => {
          // Handle pool checkbox interactions
          html.find(".pool-checkbox").change(function () {
            const isChecked = $(this).is(":checked");
            const poolKey = $(this).val();
            const diceInput = html.find(`input[name="pool-${poolKey}-dice"]`);
            const pool = availablePools.find((p) => p.key === poolKey);

            if (isChecked) {
              diceInput.prop("disabled", false);
              // Only default to 1 if the pool has dice available
              if (pool && (pool.isUnlimited || pool.current > 0)) {
                diceInput.val(1);
              } else {
                diceInput.val(0);
              }
            } else {
              diceInput.prop("disabled", true);
              diceInput.val(0);
            }
          });

          // Clamp pool dice inputs to their max values (prevents typing above available dice)
          html.find(".pool-dice-input").on("input change", function () {
            const rawMax = parseInt($(this).attr("max"), 10);
            const hasMax = Number.isFinite(rawMax);

            let rawValue = parseInt($(this).val(), 10);
            if (!Number.isFinite(rawValue)) rawValue = 0;

            const clamped = hasMax
              ? Math.max(0, Math.min(rawValue, rawMax))
              : Math.max(0, rawValue);
            if (String($(this).val()) !== String(clamped)) {
              $(this).val(clamped);
            }
          });

          // Reset all pool dice allocations in this dialog
          html.find(".reset-pool-dice").on("click", function () {
            html.find(".pool-checkbox").prop("checked", false);
            html.find(".pool-dice-input").prop("disabled", true).val(0);
          });

          // Handle ranged modifier calculations
          if (isRangedAttack) {
            const updateTotalModifier = () => {
              const modifierSummary = sr2BuildRangedModifierSummary({
                baseTargetNumber: defaultTN,
                recoilModifier:
                  (parseInt(html.find('select[name="recoil-modifier"]').val()) || 0) +
                  autoRangedModifiers.recoilModifier,
                visibilityModifier:
                  parseInt(html.find('select[name="visibility-modifier"]').val()) || 0,
                coverModifier: parseInt(html.find('select[name="cover-modifier"]').val()) || 0,
                multipleTargetsModifier:
                  parseInt(html.find('select[name="multiple-targets-modifier"]').val()) || 0,
                targetMovementModifier:
                  parseInt(html.find('select[name="target-movement-modifier"]').val()) || 0,
                attackerMeleeModifier:
                  parseInt(html.find('select[name="attacker-melee-modifier"]').val()) || 0,
                attackerMovementModifier:
                  parseInt(html.find('select[name="attacker-movement-modifier"]').val()) || 0,
                accessoriesModifier:
                  (parseInt(html.find('select[name="accessories-modifier"]').val()) || 0) +
                  autoRangedModifiers.accessoriesModifier,
                otherModifier: parseInt(html.find('select[name="other-modifier"]').val()) || 0,
                woundModifier: rangedWoundModifier,
                calledShotModifier: autoRangedModifiers.calledShotModifier,
              });
              html
                .find("#total-tn-modifier")
                .text(
                  modifierSummary.totalModifier >= 0
                    ? `+${modifierSummary.totalModifier}`
                    : `${modifierSummary.totalModifier}`,
                );
            };

            html.find(".modifier-select").change(updateTotalModifier);
            updateTotalModifier(); // Initial calculation
          }
        },
        buttons: {
          roll: {
            icon: '<i class="fas fa-dice-d6"></i>',
            label: "Roll",
            callback: async (html) => {
              if (isRolling || isResolved) return;
              isRolling = true;
              try {
                const baseTargetNumber = parseInt(html.find("#target-number").val());
                let finalDicePool = dicePool;

                // Calculate ranged combat modifiers if applicable
                let tnModifier = 0;
                let modifierDetails = [];

                if (isRangedAttack) {
                  const modifierSummary = sr2BuildRangedModifierSummary({
                    baseTargetNumber,
                    recoilModifier:
                      (parseInt(html.find('select[name="recoil-modifier"]').val()) || 0) +
                      autoRangedModifiers.recoilModifier,
                    visibilityModifier:
                      parseInt(html.find('select[name="visibility-modifier"]').val()) || 0,
                    coverModifier: parseInt(html.find('select[name="cover-modifier"]').val()) || 0,
                    multipleTargetsModifier:
                      parseInt(html.find('select[name="multiple-targets-modifier"]').val()) || 0,
                    targetMovementModifier:
                      parseInt(html.find('select[name="target-movement-modifier"]').val()) || 0,
                    attackerMeleeModifier:
                      parseInt(html.find('select[name="attacker-melee-modifier"]').val()) || 0,
                    attackerMovementModifier:
                      parseInt(html.find('select[name="attacker-movement-modifier"]').val()) || 0,
                    accessoriesModifier:
                      (parseInt(html.find('select[name="accessories-modifier"]').val()) || 0) +
                      autoRangedModifiers.accessoriesModifier,
                    otherModifier: parseInt(html.find('select[name="other-modifier"]').val()) || 0,
                    woundModifier: rangedWoundModifier,
                    calledShotModifier: autoRangedModifiers.calledShotModifier,
                  });

                  tnModifier = modifierSummary.totalModifier;
                  modifierDetails = modifierSummary.parts.map(
                    (part) => `${part.label}: ${part.value >= 0 ? "+" : ""}${part.value}`,
                  );
                }

                const finalTargetNumber = Math.max(2, baseTargetNumber + tnModifier);

                // Handle pool dice
                const poolsUsed = [];
                let totalPoolDice = 0;

                availablePools.forEach((pool) => {
                  const checkbox = html.find(`input[name="pool-${pool.key}"]`);
                  const diceInput = html.find(`input[name="pool-${pool.key}-dice"]`);

                  if (checkbox.is(":checked")) {
                    const diceUsed = parseInt(diceInput.val()) || 0;
                    let actualDiceUsed = 0;
                    if (pool.isUnlimited) {
                      actualDiceUsed = Math.max(0, diceUsed);
                    } else {
                      // Validate that we don't use more dice than available
                      const cap = Number(poolCaps?.[pool.key]);
                      const maxFromCap = Number.isFinite(cap) ? cap : Infinity;
                      actualDiceUsed = Math.min(diceUsed, pool.current, maxFromCap);
                    }
                    if (actualDiceUsed > 0) {
                      totalPoolDice += actualDiceUsed;
                      poolsUsed.push({ pool: pool, dice: actualDiceUsed });
                    }
                  }
                });

                // Add pool dice to final dice pool
                finalDicePool += totalPoolDice;

                // Ensure minimum dice pool of 1
                if (finalDicePool < 1) {
                  finalDicePool = 1;
                }

                // Update actor's pool values
                if (poolsUsed.length > 0) {
                  const updateData = {};
                  poolsUsed.forEach(({ pool, dice }) => {
                    if (!pool.isActorPool) return;
                    const newCurrent = Math.max(0, pool.current - dice);
                    updateData[`system.pools.${pool.key}.current`] = newCurrent;
                  });
                  if (Object.keys(updateData).length > 0) {
                    await rollActor.update(updateData);
                  }
                }

                // Create enhanced title with pool info and modifiers
                let finalTitle = `${title} (TN ${finalTargetNumber})`;
                if (tnModifier !== 0) {
                  finalTitle += ` [Base TN ${baseTargetNumber} ${tnModifier >= 0 ? "+" : ""}${tnModifier}]`;
                }
                if (poolsUsed.length > 0) {
                  const poolInfo = poolsUsed
                    .map(({ pool, dice }) => `${dice} ${pool.name}`)
                    .join(", ");
                  finalTitle += ` [+${totalPoolDice} from ${poolInfo}]`;
                }

                // Roll the dice
                const unclampedDicePool = (Number(dicePool) || 0) + totalPoolDice;
                let sources = [];
                if (unclampedDicePool <= 0) {
                  sources = ["base"];
                } else {
                  for (let i = 0; i < Math.max(0, Number(dicePool) || 0); i++) {
                    sources.push("base");
                  }
                  for (const { pool, dice } of poolsUsed) {
                    for (let i = 0; i < dice; i++) {
                      sources.push(pool.key);
                    }
                  }
                }
                while (sources.length < finalDicePool) sources.push("base");
                if (sources.length > finalDicePool) sources = sources.slice(0, finalDicePool);

                const rollResult = await rollActor.rollDice(
                  finalDicePool,
                  finalTargetNumber,
                  finalTitle,
                  { sources },
                );

                // Show modifier breakdown in chat if there were ranged modifiers
                if (isRangedAttack && modifierDetails.length > 0) {
                  const modifierChatData = {
                    user: game.user.id,
                    speaker: ChatMessage.getSpeaker({ actor: rollActor }),
                    content: `
	                    <div class="ranged-modifiers-breakdown">
	                      <h4>Ranged Combat Modifiers Applied:</h4>
	                      <ul>
                        ${modifierDetails.map((detail) => `<li>${detail}</li>`).join("")}
                      </ul>
                      <p><strong>Total TN Modifier: ${tnModifier >= 0 ? "+" : ""}${tnModifier}</strong></p>
                    </div>
                  `,
                  };
                  ChatMessage.create(modifierChatData);
                }

                finish({
                  rolled: true,
                  rollResult,
                  finalDicePool,
                  finalTargetNumber,
                  baseTargetNumber,
                  tnModifier,
                  poolsUsed,
                });
              } catch (error) {
                console.error("SR2E | Failed to resolve TN roll dialog", error);
                ui.notifications?.error?.("Roll failed (see console).");
                finish({ rolled: false });
              } finally {
                isRolling = false;
              }
            },
          },
          cancel: {
            icon: '<i class="fas fa-times"></i>',
            label: "Cancel",
            callback: () => finish({ rolled: false }),
          },
        },
        default: "roll",
        close: () => {
          // Dialog auto-close after clicking Roll should not short-circuit async roll handling.
          if (isRolling) return;
          finish({ rolled: false });
        },
      });

      dialog.render(true);
    });
  }

  /**
   * Handle opening item browser
   */
  async _onBrowseItems(event) {
    event.preventDefault();
    const itemType = event.currentTarget.dataset.type;

    try {
      // Import the item browser dynamically
      const { SR2ItemBrowser } = await import("/systems/shadowrun2e/scripts/item-browser.js");
      const browser = new SR2ItemBrowser(this.actor, itemType);
      browser.render(true);
    } catch (error) {
      console.error("SR2E | Failed to open item browser", error);
      ui.notifications.error("Item browser is unavailable (see console).");
    }
  }

  /**
   * Toggle sustained spell effects (no Spell Lock item required)
   */
  async _onSpellLockToggle(event) {
    event.preventDefault();

    const spellId = event.currentTarget.dataset.itemId;
    const spell = this.actor.items.get(spellId);
    if (!spell || spell.type !== "spell") return;

    const spellLock = spell.system?.spellLock ?? {};
    const isEnabled = Boolean(spellLock.enabled);

    try {
      await spell.update({ "system.spellLock.enabled": !isEnabled });
      await this._syncSpellLockEffects();
      if (this.rendered) this.render(false);
    } catch (error) {
      console.error("SR2E | Failed to toggle sustained spell", error);
      ui.notifications.error("Failed to toggle sustained spell (see console).");
    }
  }

  async _syncSpellLockEffects() {
    try {
      const enabledLockedSpells = this.actor.items.filter(
        (i) => i.type === "spell" && i.system?.spellLock?.enabled,
      );

      const hasInvisibility = enabledLockedSpells.some((spell) =>
        String(spell.name || "")
          .toLowerCase()
          .includes("invisibility"),
      );

      const existingInvisibility = this.actor.effects.find(
        (e) => e.getFlag("shadowrun2e", "spellLockInvisibilityEffect") === true,
      );

      if (!hasInvisibility) {
        if (existingInvisibility) await existingInvisibility.delete();
        return;
      }

      if (!existingInvisibility) {
        await this.actor.createEmbeddedDocuments("ActiveEffect", [
          {
            name: "Sustained Spell: Invisibility",
            icon: "icons/svg/invisible.svg",
            system: { changes: [] },
            disabled: false,
            flags: { shadowrun2e: { spellLockInvisibilityEffect: true } },
          },
        ]);
        return;
      }

      if (existingInvisibility.disabled) {
        await existingInvisibility.update({ disabled: false });
      }
    } catch (error) {
      console.error("SR2E | Failed to sync spell lock effects", error);
    }
  }

  /**
   * Handle spell casting
   */
  async _onSpellCast(event) {
    event.preventDefault();
    const spellId = event.currentTarget.dataset.itemId;
    const spell = this.actor.items.get(spellId);

    if (!spell) return;

    try {
      const force = Math.max(1, Number(spell.system.force) || 1);
      const magicRating =
        Number(
          this.actor.system.attributes.magic.effective ?? this.actor.system.attributes.magic.value,
        ) || 0;
      const sorcerySkill = this._getHighestSorcerySkill();

      // SR2 spellcasting: Spell Success Test uses Force dice; Magic Pool and foci add dice separately.
      if (magicRating <= 0) {
        ui.notifications.error("This character has no Magic rating.");
        return;
      }
      if (sorcerySkill <= 0) {
        ui.notifications.error("Sorcery skill is required to cast spells.");
        return;
      }

      const dicePool = force;

      const title = `Casting ${spell.name} (Force ${force})`;

      const spellClass = sr2NormalizeSpellClass(spell.system?.class);
      const spellClassLabel = spellClass ? SR2_SPELL_CLASS_LABELS[spellClass] || spellClass : "";

      const targets = Array.from(game.user?.targets ?? []);
      const resistAttributeKey = sr2GetSpellResistanceAttributeKey(spell);
      const casterWoundModifier = sr2GetInjuryModifiers({
        physicalBoxes: this.actor.system?.health?.physical?.value,
        stunBoxes: this.actor.system?.health?.stun?.value,
      }).targetNumber;
      let defaultCastTargetNumber = 4;
      if (targets.length === 1 && resistAttributeKey) {
        const targetActor = targets[0]?.actor;
        const resistAttributeValue = Number(
          targetActor?.system?.attributes?.[resistAttributeKey]?.value,
        );
        if (Number.isFinite(resistAttributeValue) && resistAttributeValue > 0) {
          defaultCastTargetNumber = sr2Clamp(resistAttributeValue, 2, 30);
        }
      }
      defaultCastTargetNumber = sr2Clamp(defaultCastTargetNumber + casterWoundModifier, 2, 30);

      const focusPools = [];
      const equippedGear = this.actor.items.filter((i) => i.type === "gear" && i.system?.equipped);
      for (const item of equippedGear) {
        const focus = sr2ParseFocusName(item.name);
        if (!focus) continue;

        if (focus.kind === "specific spell focus") {
          const linkedSpellId = String(item.system?.focus?.spellId || "");
          if (!linkedSpellId || linkedSpellId !== spell.id) continue;

          focusPools.push({
            key: `focus-specific-${item.id}`,
            name: `${item.name} (${spell.name})`,
            current: focus.rating,
            max: focus.rating,
            isActorPool: false,
          });
        }

        if (focus.kind === "spell type focus") {
          const focusClass = sr2NormalizeSpellClass(item.system?.focus?.spellClass);
          if (!focusClass || !spellClass || focusClass !== spellClass) continue;

          focusPools.push({
            key: `focus-category-${item.id}`,
            name: `${item.name}${spellClassLabel ? ` (${spellClassLabel})` : ""}`,
            current: focus.rating,
            max: focus.rating,
            isActorPool: false,
          });
        }
      }

      // Show TN selection dialog and roll for spellcasting
      const castResult = await this._showTargetNumberDialog(
        dicePool,
        title,
        "spell",
        defaultCastTargetNumber,
        null,
        {
          baseSkillName: "Sorcery",
          additionalPools: focusPools,
        },
      );
      if (!castResult?.rolled) return;

      const casterSuccesses = Number(castResult.rollResult?.successes) || 0;
      let spellResolution = null;
      let combatSpellDamage = null;
      let combatSpellApplied = false;

      if (targets.length === 1 && resistAttributeKey && casterSuccesses > 0) {
        const targetActor = targets[0]?.actor || null;
        const targetAttributeValue =
          Number(targetActor?.system?.attributes?.[resistAttributeKey]?.value) || 0;
        const resistanceTest = sr2PrepareSpellResistanceTest({
          spellType: spell.system?.type,
          spellForce: force,
          targetAttributeValue,
        });

        if (targetActor && resistanceTest.dicePool > 0) {
          const resistanceResult = await this._showTargetNumberDialog(
            resistanceTest.dicePool,
            `${targetActor.name} Spell Resistance vs ${spell.name}`,
            "spell-resistance",
            resistanceTest.targetNumber,
            null,
            {
              rollActor: targetActor,
              allowedPoolKeys: ["spell", "karma"],
            },
          );

          if (resistanceResult?.rolled) {
            spellResolution = sr2SummarizeSpellEffectResolution({
              casterSuccesses,
              targetSuccesses: Number(resistanceResult.rollResult?.successes) || 0,
              resisted: true,
              spellType: spell.system?.type,
            });

            if (spellClass === "C") {
              const explicitDamage = String(spell.system?.damage || "")
                .trim()
                .toUpperCase();
              const baseSpellDamageLevel = sr2InferCombatSpellDamageLevelFromName(spell.name, {
                fallback: explicitDamage || sr2InferSpellDamageLevelFromDrain(spell.system?.drain),
              });
              combatSpellDamage = sr2SummarizeCombatSpellDamage({
                baseDamageLevel: baseSpellDamageLevel,
                netSuccesses: spellResolution.netSuccesses,
                minimumEffect: spellResolution.minimumEffect,
              });
              if (combatSpellDamage.finalDamageLevel && combatSpellDamage.boxes > 0) {
                const combatSpellDamageType = /stun/i.test(String(spell.name || ""))
                  ? "stun"
                  : "physical";
                combatSpellApplied = await sr2ApplyDamageToActor(
                  targetActor,
                  combatSpellDamageType,
                  combatSpellDamage.boxes,
                );
              }
            }
          }
        }
      }

      // Calculate drain
      const misfireDrainMod = castResult.rollResult?.isCriticalFailure ? 2 : 0;
      const drainValue = sr2ComputeDrainTargetNumber({
        modifiedForce: sr2ComputeDrainValueFromCode(spell.system.drain, force),
        criticalMisfire: Boolean(misfireDrainMod),
      });
      const drainPool = Number(this.actor.system.attributes.willpower.value) || 0;

      // Show TN selection dialog and roll drain resistance
      const drainTitle = `Drain Resistance for ${spell.name}`;

      const focusDiceUsed = {};
      for (const { pool, dice } of castResult.poolsUsed || []) {
        if (pool?.isActorPool) continue;
        if (!pool?.key) continue;
        focusDiceUsed[pool.key] = (focusDiceUsed[pool.key] || 0) + (Number(dice) || 0);
      }

      const remainingFocusPools = focusPools.map((pool) => {
        const used = Number(focusDiceUsed[pool.key]) || 0;
        return {
          ...pool,
          current: Math.max(0, (Number(pool.current) || 0) - used),
        };
      });

      const drainResult = await this._showTargetNumberDialog(
        drainPool,
        drainTitle,
        "drain",
        drainValue,
        null,
        {
          baseSkillName: "Sorcery",
          additionalPools: remainingFocusPools,
        },
      );
      if (!drainResult?.rolled) return;

      const drainResolution = sr2SummarizeDrainApplication({
        baseDrainLevel: sr2InferSpellDamageLevelFromDrain(spell.system.drain) || "",
        modifiedForce: sr2ComputeDrainValueFromCode(spell.system.drain, force),
        criticalMisfire: Boolean(misfireDrainMod),
        resistanceSuccesses: Number(drainResult?.rollResult?.successes) || 0,
        spellForce: force,
        casterMagic: magicRating,
      });
      if (drainResolution.applied && drainResolution.boxes > 0) {
        await sr2ApplyDamageToActor(this.actor, drainResolution.damageType, drainResolution.boxes);
      }

      if (spellResolution) {
        const targetActor = targets[0]?.actor || null;
        const combatDamageText = combatSpellDamage?.finalDamageLevel
          ? `<p><strong>Combat Spell Damage:</strong> ${combatSpellDamage.finalDamageLevel} (${combatSpellDamage.boxes} boxes)${combatSpellApplied ? "" : " (not applied)"}</p>`
          : "";
        const effectText =
          spellResolution.result === "resisted"
            ? "Target resisted the spell."
            : spellResolution.minimumEffect
              ? "Target resists, but the spell takes minimum effect."
              : spellResolution.result === "success"
                ? `Spell takes effect with ${spellResolution.netSuccesses} net successes.`
                : "Spell miscast.";

        await ChatMessage.create({
          user: game.user.id,
          speaker: ChatMessage.getSpeaker({ actor: this.actor }),
          content: `
            <div class="sr2-combat-resolution">
              <h3>Spell Resolution: ${spell.name}</h3>
              ${targetActor ? `<p><strong>Target:</strong> ${targetActor.name}</p>` : ""}
              <p><strong>Effect:</strong> ${effectText}</p>
              ${combatDamageText}
              <p><strong>Drain:</strong> ${
                drainResolution.applied && drainResolution.finalLevel
                  ? `${drainResolution.finalLevel} ${drainResolution.damageType === "physical" ? "Physical" : "Stun"} (${drainResolution.boxes} boxes)`
                  : "No Drain"
              }</p>
            </div>
          `,
        });
      }
    } catch (error) {
      console.error("SR2E | Failed to cast spell", error);
      ui.notifications.error("Spell casting failed (see console).");
    }
  }

  /**
   * Get the highest Sorcery skill rating
   */
  _getHighestSorcerySkill() {
    return sr2GetHighestSkillRatingByBaseSkill(this.actor, "Sorcery");
  }

  /**
   * Handle weapon attacks
   */
  async _onWeaponAttack(event) {
    event.preventDefault();

    const weaponId = event.currentTarget.dataset.itemId;
    const weapon = this.actor.items.get(weaponId);
    if (!weapon) return;
    const requestedAttackType = String(event.currentTarget.dataset.rollType || "attack");
    const weaponAttackModifiers = sr2BuildWeaponAttackModifiers({
      actor: this.actor,
      weapon,
      requestedAttackType,
    });

    const isRanged = weapon.system.weaponType === "ranged";
    const { skillRating, skillName, rollDescription } = sr2GetWeaponSkillData(this.actor, weapon, {
      notify: true,
    });
    const dicePool = Math.max(0, Number(skillRating) || 0);

    const targets = Array.from(game.user?.targets ?? []);
    const targetToken = targets.length === 1 ? targets[0] : null;
    const targetActor = targetToken?.actor || null;

    const resolveErrorChat = async (message) => {
      await ChatMessage.create({
        user: game.user.id,
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        content: `<div class="sr2-combat-resolution"><p>${message}</p></div>`,
      });
    };

    const consumeAmmo = async () => {
      if (!isRanged) return;
      if (!weapon.system.ammo || weapon.system.ammo.current <= 0) return;

      const newAmmo = Math.max(
        0,
        (Number(weapon.system.ammo.current) || 0) - weaponAttackModifiers.profile.ammoConsumed,
      );
      await weapon.update({ "system.ammo.current": newAmmo });
      if (newAmmo === 0) ui.notifications.warn(`${weapon.name} is out of ammunition!`);
    };

    if (!targetToken || !targetActor) {
      const attackType = isRanged ? "Ranged Attack" : "Melee Attack";
      const subtitle = dicePool > 0 ? `${skillName} (${rollDescription})` : "Defaulting";
      const attackResult = await this._showTargetNumberDialog(
        dicePool,
        `${attackType} with ${weapon.name} - ${subtitle}`,
        "attack",
        4,
        weapon,
        {
          allowedPoolKeys: SR2_ALL_POOL_KEYS,
          poolCaps: { combat: dicePool },
          autoRangedModifiers: weaponAttackModifiers,
        },
      );
      if (!attackResult?.rolled) return;

      await ChatMessage.create({
        user: game.user.id,
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        content: `
          <div class="sr2-combat-resolution">
            <h3>${attackType}: ${weapon.name}</h3>
            <p><strong>Damage Code:</strong> ${weapon.system.damage || "1L"}</p>
            ${
              isRanged && weaponAttackModifiers.profile.modeUsed !== "SS"
                ? `<p><strong>Fire Mode:</strong> ${weaponAttackModifiers.profile.modeUsed} (${weaponAttackModifiers.profile.ammoConsumed} round${weaponAttackModifiers.profile.ammoConsumed === 1 ? "" : "s"})</p>`
                : ""
            }
            <p><em>Target exactly one token to auto-resolve damage/resistance.</em></p>
          </div>
        `,
      });

      await consumeAmmo();
      return;
    }

    if (isRanged) {
      let baseTargetNumber = 4;
      let rangeLabel = "";
      let distance = null;
      let distanceUnits = "";

      const attackerToken =
        canvas?.tokens?.controlled?.find((t) => t.actor?.id === this.actor.id) ||
        (this.actor.getActiveTokens?.(true)?.[0] ?? null);
      if (
        canvas?.grid?.size &&
        canvas?.scene?.grid?.distance &&
        attackerToken?.center &&
        targetToken?.center
      ) {
        const dx = targetToken.center.x - attackerToken.center.x;
        const dy = targetToken.center.y - attackerToken.center.y;
        const pixels = Math.hypot(dx, dy);
        distance = (pixels / canvas.grid.size) * canvas.scene.grid.distance;
        distanceUnits = String(canvas.scene.grid.units || "");
      }

      try {
        const rangeType = String(weapon.system.rangeType || "");
        const rangesData = await this._loadRangesData();
        const rangeData = rangesData?.[rangeType];
        if (rangeData && Number.isFinite(distance)) {
          const minRange = Number(rangeData.min) || 0;
          const shortMax = Number(rangeData.short) || 0;
          const mediumMax = Number(rangeData.medium) || 0;
          const longMax = Number(rangeData.long) || 0;
          const extremeMax = Number(rangeData.extreme) || 0;

          const rangeBand = sr2GetRangeBand({
            distance,
            rangeData: {
              min: minRange,
              short: shortMax,
              medium: mediumMax,
              long: longMax,
              extreme: extremeMax,
            },
          });
          baseTargetNumber = rangeBand.targetNumber;
          rangeLabel = rangeBand.label;
        }
      } catch (err) {
        // If range data fails, fall back to TN 4.
      }

      const subtitle = dicePool > 0 ? `${skillName} (${rollDescription})` : "Defaulting";
      const rangeSuffix =
        rangeLabel && Number.isFinite(distance)
          ? ` [${rangeLabel} ${distance.toFixed(1)}${distanceUnits ? ` ${distanceUnits}` : ""}]`
          : rangeLabel
            ? ` [${rangeLabel}]`
            : "";
      const rangeText =
        rangeLabel && Number.isFinite(distance)
          ? `${rangeLabel} ${distance.toFixed(1)}${distanceUnits ? ` ${distanceUnits}` : ""}`
          : rangeLabel;

      const attackResult = await this._showTargetNumberDialog(
        dicePool,
        `Ranged Attack with ${weapon.name} - ${subtitle}${rangeSuffix}`,
        "attack",
        baseTargetNumber,
        weapon,
        {
          allowedPoolKeys: SR2_ALL_POOL_KEYS,
          poolCaps: { combat: dicePool },
          autoRangedModifiers: weaponAttackModifiers,
        },
      );
      if (!attackResult?.rolled) return;

      const attackerSuccesses = Number(attackResult.rollResult?.successes) || 0;
      if (attackerSuccesses <= 0) {
        await resolveErrorChat(
          `<strong>${this.actor.name}</strong> misses with <strong>${weapon.name}</strong>.`,
        );
        await consumeAmmo();
        return;
      }

      const attackerStrength = sr2GetModifiedAttribute(this.actor, "strength");
      const parsed = sr2ParseDamageCode(weapon.system.damage || "", { strength: attackerStrength });
      if (!parsed) {
        await resolveErrorChat(
          `Cannot auto-resolve: unparseable damage code <strong>${weapon.system.damage || ""}</strong>.`,
        );
        await consumeAmmo();
        return;
      }
      const adjustedDamage = sr2ApplyWeaponAttackProfileToDamage(
        parsed,
        weaponAttackModifiers.profile,
      );

      const armorRatings = sr2GetArmorRatings(targetActor);
      const rangeType = String(weapon.system.rangeType || "");
      const usesImpactArmor =
        ["(GRLN)", "(MISLN)"].includes(rangeType.toUpperCase()) ||
        /grenade|missile|rocket/i.test(String(weapon.name || ""));
      const armorValue = usesImpactArmor ? armorRatings.impact : armorRatings.ballistic;

      const resistTargetNumber = sr2ComputeDamageResistanceTargetNumber({
        power: adjustedDamage.power,
        armor: armorValue,
      });
      const bodyDice = sr2GetModifiedAttribute(targetActor, "body");

      const resistResult = await this._showTargetNumberDialog(
        bodyDice,
        `${targetActor.name} Damage Resistance vs ${weapon.name}`,
        "damage-resistance",
        resistTargetNumber,
        null,
        {
          rollActor: targetActor,
          allowedPoolKeys: SR2_ALL_POOL_KEYS,
        },
      );
      if (!resistResult?.rolled) return;

      const defenderSuccesses = Number(resistResult.rollResult?.successes) || 0;
      const defenderCombatPoolSuccesses =
        Number(resistResult.rollResult?.successesBySource?.combat) || 0;

      const rangedResolution = sr2ResolveRangedCombat({
        attackerSuccesses,
        defenderSuccesses,
        defenderCombatPoolSuccesses,
        baseDamageLevel: adjustedDamage.level,
      });

      let applied = false;
      if (rangedResolution.finalLevel && rangedResolution.boxes > 0) {
        try {
          applied = await sr2ApplyDamageToActor(
            targetActor,
            adjustedDamage.damageType,
            rangedResolution.boxes,
          );
        } catch (error) {
          console.error("SR2E | Failed to apply ranged damage", error);
        }
      }

      const resultLabel = rangedResolution.cleanMiss
        ? `Clean miss (defender Combat Pool successes ${defenderCombatPoolSuccesses} > attacker ${attackerSuccesses}).`
        : rangedResolution.finalLevel
          ? `${rangedResolution.finalLevel} ${adjustedDamage.damageType === "stun" ? "Stun" : "Physical"} (${rangedResolution.boxes} boxes)`
          : "No damage";

      await ChatMessage.create({
        user: game.user.id,
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        content: `
            <div class="sr2-combat-resolution">
              <h3>Ranged Combat: ${this.actor.name} → ${targetActor.name}</h3>
              <p><strong>Weapon:</strong> ${weapon.name} (${weapon.system.damage || "1L"})</p>
              <p><strong>Fire Mode:</strong> ${weaponAttackModifiers.profile.modeUsed} (${weaponAttackModifiers.profile.ammoConsumed} round${weaponAttackModifiers.profile.ammoConsumed === 1 ? "" : "s"})</p>
              ${rangeText ? `<p><strong>Range:</strong> ${rangeText}</p>` : ""}
              <p><strong>Attack successes:</strong> ${attackerSuccesses}</p>
              <p><strong>Resistance TN:</strong> ${resistTargetNumber} (= ${adjustedDamage.power} - ${armorValue})</p>
              <p><strong>Resistance successes:</strong> ${defenderSuccesses} (Combat Pool-only: ${defenderCombatPoolSuccesses})</p>
              <p><strong>Result:</strong> ${resultLabel}${rangedResolution.finalLevel && rangedResolution.boxes > 0 ? (applied ? "" : " (not applied)") : ""}</p>
            </div>
        `,
      });

      await consumeAmmo();
      return;
    }

    const equippedMeleeWeapons = targetActor.items.filter(
      (i) => i.type === "weapon" && i.system?.weaponType === "melee" && i.system?.equipped,
    );
    const defenderWeapon = equippedMeleeWeapons.length > 0 ? equippedMeleeWeapons[0] : null;
    const defenderWeaponName = defenderWeapon?.name || "Unarmed";

    let defenderSkillRating = 0;
    let defenderSkillName = "Unarmed Combat";
    let defenderRollDescription = "Unarmed";

    if (defenderWeapon) {
      const defenderSkillData = sr2GetWeaponSkillData(targetActor, defenderWeapon, {
        notify: false,
      });
      defenderSkillRating = Math.max(0, Number(defenderSkillData.skillRating) || 0);
      defenderSkillName = defenderSkillData.skillName || defenderSkillName;
      defenderRollDescription = defenderSkillData.rollDescription || "Base Skill";
    } else {
      const unarmedSkill = targetActor.items.find(
        (i) => i.type === "skill" && i.system?.baseSkill === "Unarmed Combat",
      );
      if (unarmedSkill) {
        defenderSkillRating = Math.max(0, Number(unarmedSkill.system?.baseRating) || 0);
        defenderSkillName = unarmedSkill.name || "Unarmed Combat";
        defenderRollDescription = "Base Skill";
      }
    }

    const attackerReach =
      (Number(this.actor.system?.details?.traits?.reach) || 0) +
      (Number(weapon.system?.reach) || 0);
    const defenderReach =
      (Number(targetActor.system?.details?.traits?.reach) || 0) +
      (Number(defenderWeapon?.system?.reach) || 0);
    const reachDelta = attackerReach - defenderReach;

    const meleeTargetNumbers = sr2ComputeMeleeTargetNumbers({
      attackerReach,
      defenderReach,
    });
    const attackerWoundModifier = sr2GetInjuryModifiers({
      physicalBoxes: this.actor.system?.health?.physical?.value,
      stunBoxes: this.actor.system?.health?.stun?.value,
    }).targetNumber;
    const defenderWoundModifier = sr2GetInjuryModifiers({
      physicalBoxes: targetActor.system?.health?.physical?.value,
      stunBoxes: targetActor.system?.health?.stun?.value,
    }).targetNumber;
    const meleeCalledShotRequested = requestedAttackType.startsWith("called-shot");
    const attackerMeleeTN = Math.max(
      2,
      meleeTargetNumbers.attackerTargetNumber +
        attackerWoundModifier +
        (meleeCalledShotRequested ? 4 : 0),
    );
    const defenderMeleeTN = Math.max(
      2,
      meleeTargetNumbers.defenderTargetNumber + defenderWoundModifier,
    );

    const attackerSubtitle = dicePool > 0 ? `${skillName} (${rollDescription})` : "Defaulting";
    const reachNote =
      reachDelta !== 0 ? ` [Reach Δ ${reachDelta >= 0 ? "+" : ""}${reachDelta}]` : "";

    const attackerTest = await this._showTargetNumberDialog(
      dicePool,
      `Melee Attack (${weapon.name}) - ${attackerSubtitle}${reachNote}`,
      "attack",
      attackerMeleeTN,
      weapon,
      {
        allowedPoolKeys: SR2_ALL_POOL_KEYS,
        poolCaps: { combat: dicePool },
      },
    );
    if (!attackerTest?.rolled) return;

    const defenderTest = await this._showTargetNumberDialog(
      defenderSkillRating,
      `Melee Defense (${defenderWeaponName}) - ${defenderSkillName} (${defenderRollDescription})${reachNote}`,
      "attack",
      defenderMeleeTN,
      defenderWeapon,
      {
        rollActor: targetActor,
        allowedPoolKeys: SR2_ALL_POOL_KEYS,
        poolCaps: { combat: defenderSkillRating },
      },
    );
    if (!defenderTest?.rolled) return;

    const attackerSuccesses = Number(attackerTest.rollResult?.successes) || 0;
    const defenderSuccesses = Number(defenderTest.rollResult?.successes) || 0;

    const meleeOpposed = sr2ResolveMeleeOpposedTest({
      attackerSuccesses,
      defenderSuccesses,
    });
    const attackerHits = meleeOpposed.attackerHits;
    const hitterActor = attackerHits ? this.actor : targetActor;
    const hitActor = attackerHits ? targetActor : this.actor;
    const hitterWeapon = attackerHits ? weapon : defenderWeapon;
    const hitterWeaponName = attackerHits ? weapon.name : defenderWeaponName;
    const stageUp = meleeOpposed.stageUp;

    const hitterStrength = sr2GetModifiedAttribute(hitterActor, "strength");
    const rawDamageCode = hitterWeapon ? hitterWeapon.system.damage || "" : "(STR)M Stun";
    let parsed = sr2ParseDamageCode(rawDamageCode, { strength: hitterStrength });
    if (!parsed) {
      await resolveErrorChat(
        `Cannot auto-resolve: unparseable melee damage code <strong>${rawDamageCode}</strong>.`,
      );
      return;
    }
    if (meleeCalledShotRequested && attackerHits) {
      const meleeCalledShot = sr2ApplyCalledShot({
        baseTargetNumber: attackerMeleeTN,
        baseDamageLevel: parsed.level,
        enabled: true,
        mode: requestedAttackType.includes("subtarget") ? "sub-target" : "damage",
      });
      parsed = {
        ...parsed,
        level:
          meleeCalledShot.finalDamageLevel && meleeCalledShot.damageLevelIncreased
            ? meleeCalledShot.finalDamageLevel
            : parsed.level,
      };
    }

    const armorRatings = sr2GetArmorRatings(hitActor);
    const resistTargetNumber = sr2ComputeDamageResistanceTargetNumber({
      power: parsed.power,
      armor: armorRatings.impact,
    });
    const bodyDice = sr2GetModifiedAttribute(hitActor, "body");

    const resistResult = await this._showTargetNumberDialog(
      bodyDice,
      `${hitActor.name} Damage Resistance vs ${hitterWeaponName}`,
      "damage-resistance",
      resistTargetNumber,
      null,
      {
        rollActor: hitActor,
        allowedPoolKeys: SR2_ALL_POOL_KEYS,
      },
    );
    if (!resistResult?.rolled) return;

    const resistSuccesses = Number(resistResult.rollResult?.successes) || 0;
    const meleeResolution = sr2ResolveMeleeDamage({
      baseDamageLevel: parsed.level,
      opposedStageUp: stageUp,
      resistanceSuccesses: resistSuccesses,
    });

    let applied = false;
    if (meleeResolution.finalLevel && meleeResolution.boxes > 0) {
      try {
        applied = await sr2ApplyDamageToActor(hitActor, parsed.damageType, meleeResolution.boxes);
      } catch (error) {
        console.error("SR2E | Failed to apply melee damage", error);
      }
    }

    const resultLabel = meleeResolution.finalLevel
      ? `${meleeResolution.finalLevel} ${parsed.damageType === "stun" ? "Stun" : "Physical"} (${meleeResolution.boxes} boxes)`
      : "No damage";

    await ChatMessage.create({
      user: game.user.id,
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      content: `
        <div class="sr2-combat-resolution">
          <h3>Melee Combat: ${this.actor.name} ↔ ${targetActor.name}</h3>
          <p><strong>Attacker successes:</strong> ${attackerSuccesses}</p>
          <p><strong>Defender successes:</strong> ${defenderSuccesses}</p>
          <p><strong>Hit:</strong> ${hitterActor.name} (${hitterWeaponName})</p>
          <p><strong>Damage staged up:</strong> +${stageUp} level(s) → ${meleeResolution.stagedLevel}</p>
          <p><strong>Resistance TN:</strong> ${resistTargetNumber} (= ${parsed.power} - ${armorRatings.impact})</p>
          <p><strong>Resistance successes:</strong> ${resistSuccesses}</p>
          <p><strong>Result:</strong> ${resultLabel}${meleeResolution.finalLevel && meleeResolution.boxes > 0 ? (applied ? "" : " (not applied)") : ""}</p>
        </div>
      `,
    });
  }

  /**
   * Handle range weapon selection change
   */
  async _onRangeWeaponChange(event) {
    event.preventDefault();
    const weaponId = event.currentTarget.value;
    const rangeType = event.currentTarget.selectedOptions[0]?.dataset.rangeType;

    if (!weaponId || !rangeType) {
      this._hideRangeBands();
      return;
    }

    try {
      // Load ranges data and display range bands
      const rangesData = await this._loadRangesData();
      if (rangesData && rangesData[rangeType]) {
        this._displayRangeBands(rangesData[rangeType]);
        this._calculateRangeCategory();
      }
    } catch (error) {
      console.error("SR2E | Failed to update range bands", error);
      ui.notifications.error("Range calculator failed (see console).");
    }
  }

  /**
   * Handle distance input change
   */
  _onRangeDistanceChange(event) {
    event.preventDefault();
    try {
      this._calculateRangeCategory();
    } catch (error) {
      console.error("SR2E | Failed to update range category", error);
      ui.notifications.error("Range calculator failed (see console).");
    }
  }

  /**
   * Load ranges data from JSON file
   */
  async _loadRangesData() {
    if (this.rangesData) {
      return this.rangesData;
    }

    try {
      const response = await fetch("/systems/shadowrun2e/data/ranges.json");
      this.rangesData = await response.json();
      return this.rangesData;
    } catch (error) {
      console.error("Failed to load ranges data:", error);
      return null;
    }
  }

  /**
   * Display range bands for selected weapon
   */
  _displayRangeBands(rangeData) {
    const rangeBands = document.getElementById("range-bands");
    if (!rangeBands) return;

    document.getElementById("short-range").textContent = rangeData.short;
    document.getElementById("medium-range").textContent = rangeData.medium;
    document.getElementById("long-range").textContent = rangeData.long;
    document.getElementById("extreme-range").textContent = rangeData.extreme;

    rangeBands.style.display = "grid";
  }

  /**
   * Hide range bands
   */
  _hideRangeBands() {
    const rangeBands = document.getElementById("range-bands");
    if (rangeBands) {
      rangeBands.style.display = "none";
    }

    const rangeCategory = document.getElementById("range-category");
    const rangeModifier = document.getElementById("range-modifier");
    if (rangeCategory) rangeCategory.textContent = "-";
    if (rangeModifier) rangeModifier.textContent = "";
  }

  /**
   * Calculate and display range category based on distance
   */
  async _calculateRangeCategory() {
    const weaponSelect = document.getElementById("range-weapon-select");
    const distanceInput = document.getElementById("range-distance");
    const rangeCategorySpan = document.getElementById("range-category");
    const rangeModifierSpan = document.getElementById("range-modifier");

    if (!weaponSelect || !distanceInput || !rangeCategorySpan) return;

    const weaponId = weaponSelect.value;
    const rangeType = weaponSelect.selectedOptions[0]?.dataset.rangeType;
    const distance = parseInt(distanceInput.value);

    if (!weaponId || !rangeType || !distance) {
      rangeCategorySpan.textContent = "-";
      rangeModifierSpan.textContent = "";
      return;
    }

    const rangesData = await this._loadRangesData();
    if (!rangesData || !rangesData[rangeType]) return;

    const ranges = rangesData[rangeType];
    let category = "";
    let modifier = "";
    let categoryClass = "";

    if (distance <= ranges.short) {
      category = "Short";
      modifier = "(TN 4)";
      categoryClass = "short";
    } else if (distance <= ranges.medium) {
      category = "Medium";
      modifier = "(TN 5)";
      categoryClass = "medium";
    } else if (distance <= ranges.long) {
      category = "Long";
      modifier = "(TN 6)";
      categoryClass = "long";
    } else if (distance <= ranges.extreme) {
      category = "Extreme";
      modifier = "(TN 9)";
      categoryClass = "extreme";
    } else {
      category = "Out of Range";
      modifier = "(Impossible)";
      categoryClass = "impossible";
    }

    rangeCategorySpan.textContent = category;
    rangeCategorySpan.className = `range-category ${categoryClass}`;
    rangeModifierSpan.textContent = modifier;
    rangeModifierSpan.className = `range-modifier ${categoryClass}`;
  }

  /**
   * Handle browsing totems for shamanic magicians
   */
  async _onBrowseTotems(event) {
    event.preventDefault();

    try {
      // Import the item browser dynamically
      const { SR2ItemBrowser } = await import("/systems/shadowrun2e/scripts/item-browser.js");

      // Create a custom item browser with totem selection handling
      const browser = new SR2ItemBrowser(this.actor, "totem", {});

      // Override the default item creation to handle totem selection
      const originalAddItem = browser.addItem;
      browser.addItem = async (item) => {
        // First, unselect any existing totems
        const existingTotems = this.actor.items.filter((i) => i.type === "totem");
        for (const existingTotem of existingTotems) {
          await existingTotem.update({ "system.isSelected": false });
        }

        // Then add the new totem and mark it as selected
        const newItem = await originalAddItem.call(browser, item);
        if (newItem) {
          await newItem.update({ "system.isSelected": true });
        }
        return newItem;
      };

      browser.render(true);
    } catch (error) {
      console.error("SR2E | Failed to open totem browser", error);
      ui.notifications.error("Totem browser is unavailable (see console).");
    }
  }

  /**
   * Handle cyberware installation toggle
   */
  async _onCyberwareInstall(event) {
    event.preventDefault();
    const checkbox = event.currentTarget;
    const itemId = checkbox.dataset.itemId;
    const item = this.actor.items.get(itemId);

    if (!item) return;

    const round2 = (value) => Math.round((value + Number.EPSILON) * 100) / 100;

    const isInstalling = checkbox.checked;
    const essenceCost = round2(parseFloat(item.system.essence) || 0);

    try {
      if (isInstalling) {
        // Check if installing this cyberware would reduce essence below 0.1
        const baseEssence = round2(this.actor.system.attributes.essence.max || 6);
        const derivedEssence = round2(
          baseEssence - sr2ComputeInstalledCyberwareEssenceLoss(this.actor.items),
        );
        const currentEssence = round2(
          Math.min(
            derivedEssence,
            Number(this.actor.system.attributes.essence.value) || baseEssence,
          ),
        );
        const remainingEssence = round2(currentEssence - essenceCost);

        if (remainingEssence < 0.1) {
          // Prevent installation
          checkbox.checked = false;
          ui.notifications.error(
            `Cannot install ${item.name}. Essence cost (${essenceCost}) would reduce your Essence below 0.1. ` +
              `Current Essence: ${currentEssence.toFixed(2)}, Required: ${essenceCost.toFixed(2)}`,
          );
          return;
        }

        // Show confirmation for significant essence loss
        if (essenceCost >= 1.0) {
          const confirm = await Dialog.confirm({
            title: "Cyberware Installation",
            content: `<p>Installing <strong>${item.name}</strong> will permanently reduce your Essence by <strong>${essenceCost}</strong>.</p>
                     <p>Current Essence: <strong>${currentEssence.toFixed(2)}</strong></p>
                     <p>New Essence: <strong>${remainingEssence.toFixed(2)}</strong></p>
                     <p>This cannot be undone. Continue?</p>`,
            yes: () => true,
            no: () => false,
          });

          if (!confirm) {
            checkbox.checked = false;
            return;
          }
        }

        // Install the cyberware
        await item.update({ "system.installed": true });
        ui.notifications.info(`${item.name} installed. Essence reduced by ${essenceCost}.`);
      } else {
        // Uninstall the cyberware
        const confirm = await Dialog.confirm({
          title: "Cyberware Removal",
          content: `<p>Are you sure you want to remove <strong>${item.name}</strong>?</p>
                   <p>This will restore <strong>${essenceCost}</strong> Essence.</p>
                   <p><em>Note: In Shadowrun, cyberware removal typically requires surgery and may have complications.</em></p>`,
          yes: () => true,
          no: () => false,
        });

        if (!confirm) {
          checkbox.checked = true;
          return;
        }

        await item.update({ "system.installed": false });
        ui.notifications.info(`${item.name} removed. Essence restored by ${essenceCost}.`);
      }

      // Refresh the sheet to update essence display
      this.render(false);
    } catch (error) {
      console.error("SR2E | Failed to toggle cyberware installation", error);
      ui.notifications.error("Cyberware installation failed (see console).");
      checkbox.checked = !!item.system.installed;
      this.render(false);
    }
  }

  /**
   * Handle bioware installation toggle
   */
  async _onBiowareInstall(event) {
    event.preventDefault();
    const checkbox = event.currentTarget;
    const itemId = checkbox.dataset.itemId;
    const item = this.actor.items.get(itemId);

    if (!item) return;

    const isInstalling = checkbox.checked;
    const bioIndex = parseFloat(item.system.bioIndex) || 0;

    try {
      if (isInstalling) {
        // Calculate current Bio Index usage
        const currentBioIndex = sr2ComputeInstalledBiowareIndex(this.actor.items, {
          excludeItemId: itemId,
        });

        // Bio Index limit is typically equal to Essence (rounded down)
        const essenceValue = Math.floor(this.actor.system.attributes.essence.value || 6);
        const remainingBioIndex = essenceValue - currentBioIndex;

        if (bioIndex > remainingBioIndex) {
          // Prevent installation
          checkbox.checked = false;
          ui.notifications.error(
            `Cannot install ${item.name}. Bio Index cost (${bioIndex}) exceeds available capacity. ` +
              `Available Bio Index: ${remainingBioIndex.toFixed(2)}, Required: ${bioIndex.toFixed(2)}`,
          );
          return;
        }

        // Show confirmation for bioware installation
        if (bioIndex >= 1.0) {
          const confirm = await Dialog.confirm({
            title: "Bioware Installation",
            content: `<p>Installing <strong>${item.name}</strong> will use <strong>${bioIndex}</strong> Bio Index.</p>
                     <p>Current Bio Index Used: <strong>${currentBioIndex.toFixed(2)}</strong></p>
                     <p>Bio Index Limit: <strong>${essenceValue}</strong></p>
                     <p>Remaining after installation: <strong>${(remainingBioIndex - bioIndex).toFixed(2)}</strong></p>
                     <p>Continue?</p>`,
            yes: () => true,
            no: () => false,
          });

          if (!confirm) {
            checkbox.checked = false;
            return;
          }
        }

        // Install the bioware
        await item.update({ "system.installed": true });
        ui.notifications.info(`${item.name} installed. Bio Index used: ${bioIndex}.`);
      } else {
        // Uninstall the bioware
        const confirm = await Dialog.confirm({
          title: "Bioware Removal",
          content: `<p>Are you sure you want to remove <strong>${item.name}</strong>?</p>
                   <p>This will free up <strong>${bioIndex}</strong> Bio Index.</p>
                   <p><em>Note: In Shadowrun, bioware removal typically requires surgery and may have complications.</em></p>`,
          yes: () => true,
          no: () => false,
        });

        if (!confirm) {
          checkbox.checked = true;
          return;
        }

        await item.update({ "system.installed": false });
        ui.notifications.info(`${item.name} removed. Bio Index freed: ${bioIndex}.`);
      }

      // Refresh the sheet to update displays
      this.render(false);
    } catch (error) {
      console.error("SR2E | Failed to toggle bioware installation", error);
      ui.notifications.error("Bioware installation failed (see console).");
      checkbox.checked = !!item.system.installed;
      this.render(false);
    }
  }

  /**
   * Handle damage box clicks
   */
  async _onDamageBoxClick(event) {
    event.preventDefault();

    // Find the actual damage box element (in case user clicked on a child element)
    let element = event.currentTarget;
    if (!element.classList.contains("damage-box")) {
      element = element.closest(".damage-box");
    }

    if (!element) {
      console.error("SR2E | Could not find damage box element");
      return;
    }

    try {
      // Try to get box number from multiple sources
      let boxNumberStr = element.dataset.boxNumber || element.getAttribute("data-box-number");

      // If we still don't have a box number, try to find it from the element's position
      if (!boxNumberStr) {
        const damageBoxes = element.parentElement.querySelectorAll(".damage-box");
        const index = Array.from(damageBoxes).indexOf(element);
        if (index >= 0) {
          boxNumberStr = (index + 1).toString();
          console.log("SR2E | Box number derived from position:", boxNumberStr);
        }
      }

      // Last resort: try to get it from the text content of the box-number span
      if (!boxNumberStr) {
        const boxNumberSpan = element.querySelector(".box-number");
        if (boxNumberSpan && boxNumberSpan.textContent) {
          boxNumberStr = boxNumberSpan.textContent.trim();
          console.log("SR2E | Box number derived from text content:", boxNumberStr);
        }
      }

      // Validate input parameters
      const boxNumber = parseInt(boxNumberStr);
      const damageBoxesContainer = element.closest(".damage-boxes");

      if (!damageBoxesContainer) {
        throw new Error("Damage box container not found");
      }

      const damageType = damageBoxesContainer.dataset.damageType;

      // Validate box number
      if (isNaN(boxNumber) || boxNumber < 1 || boxNumber > 10) {
        console.error("SR2E | Box number validation failed:", {
          boxNumberStr,
          boxNumber,
          isNaN: isNaN(boxNumber),
          element: element,
          dataset: element.dataset,
        });
        throw new Error(`Invalid box number: ${boxNumber}. Must be between 1 and 10.`);
      }

      // Validate damage type
      if (!damageType || !["physical", "stun"].includes(damageType)) {
        throw new Error(`Invalid damage type: ${damageType}. Must be 'physical' or 'stun'.`);
      }

      // Validate actor data exists and has proper structure
      if (!this.actor) {
        throw new Error("Actor not found");
      }

      if (!this.actor.system) {
        throw new Error("Actor system data not found");
      }

      if (!this.actor.system.health) {
        throw new Error("Actor health data not found");
      }

      if (!this.actor.system.health[damageType]) {
        throw new Error(`Actor ${damageType} health data not found`);
      }

      const currentDamage = this.actor.system.health[damageType].value;

      // Validate current damage value
      if (typeof currentDamage !== "number" || isNaN(currentDamage)) {
        console.warn(
          `SR2E | Invalid current ${damageType} damage value: ${currentDamage}, defaulting to 0`,
        );
        // Set a default value and continue
        await this.actor.update({
          [`system.health.${damageType}.value`]: 0,
        });
        return;
      }

      let newDamage;

      // If clicking on the current damage level, reset to 0
      if (boxNumber === currentDamage) {
        newDamage = 0;
      } else {
        // Otherwise set damage to the clicked box number
        newDamage = boxNumber;
      }

      // Validate and clamp damage within bounds (0-10)
      if (typeof newDamage !== "number" || isNaN(newDamage)) {
        throw new Error(`Invalid damage value calculated: ${newDamage}`);
      }

      newDamage = sr2Clamp(newDamage, 0, 10);

      // Validate that the new damage value is different from current
      if (newDamage === currentDamage) {
        console.log(`SR2E | ${damageType} damage already at ${newDamage}, no update needed`);
        return;
      }

      // Update the actor's damage value using debounced update system
      try {
        // Use queued update for better concurrent handling
        this._queueUpdate({
          [`system.health.${damageType}.value`]: newDamage,
        });

        console.log(
          `SR2E | Queued ${damageType} damage update from ${currentDamage} to ${newDamage}`,
        );

        // Provide immediate UI feedback
        this._updateDamageBoxDisplay(damageType, newDamage);

        // Provide user feedback for significant damage changes
        if (newDamage >= 8 && currentDamage < 8) {
          ui.notifications.warn(
            `${this.actor.name} has taken severe ${damageType} damage (${newDamage}/10)!`,
          );
        } else if (newDamage === 10 && currentDamage < 10) {
          ui.notifications.error(`${this.actor.name} has reached maximum ${damageType} damage!`);
        } else if (newDamage === 0 && currentDamage > 0) {
          ui.notifications.info(`${this.actor.name}'s ${damageType} damage has been cleared.`);
        }
      } catch (updateError) {
        console.error(`SR2E | Failed to queue ${damageType} damage update:`, updateError);
        ui.notifications.error(
          `Failed to update ${damageType} damage. The character sheet may be locked or you may not have permission.`,
        );
        throw updateError;
      }
    } catch (error) {
      console.error("SR2E | Error handling damage box click:", error);
      ui.notifications.error(`Error updating damage: ${error.message}`);

      // Try to refresh the sheet to show current state
      try {
        this.render(false);
      } catch (renderError) {
        console.error("SR2E | Failed to refresh sheet after damage error:", renderError);
      }
    }
  }

  /**
   * Test function to validate damage box functionality
   */
  _testDamageBoxes() {
    console.log("SR2E | Testing damage box functionality...");

    const physicalBoxes = this.element.find(
      '.damage-boxes[data-damage-type="physical"] .damage-box',
    );
    const stunBoxes = this.element.find('.damage-boxes[data-damage-type="stun"] .damage-box');

    console.log("SR2E | Found physical damage boxes:", physicalBoxes.length);
    console.log("SR2E | Found stun damage boxes:", stunBoxes.length);

    physicalBoxes.each((index, element) => {
      const boxNumber = element.dataset.boxNumber || element.getAttribute("data-box-number");
      console.log(`SR2E | Physical box ${index + 1}: data-box-number = ${boxNumber}`);
    });

    stunBoxes.each((index, element) => {
      const boxNumber = element.dataset.boxNumber || element.getAttribute("data-box-number");
      console.log(`SR2E | Stun box ${index + 1}: data-box-number = ${boxNumber}`);
    });
  }

  async _onDamageAdjust(event) {
    event.preventDefault();
    event.stopPropagation();

    const button = event.currentTarget;
    const damageType = String(button?.dataset?.damageType || "");
    const adjust = parseInt(button?.dataset?.adjust, 10);
    if (!["physical", "stun"].includes(damageType)) return;
    if (!Number.isFinite(adjust) || adjust === 0) return;

    const current = Number(this.actor.system?.health?.[damageType]?.value);
    const max = Number(this.actor.system?.health?.[damageType]?.max);
    const safeCurrent = Number.isFinite(current) ? current : 0;
    const safeMax = Number.isFinite(max) ? max : 10;
    const next = Math.max(0, Math.min(safeMax, safeCurrent + adjust));

    await this.actor.update({ [`system.health.${damageType}.value`]: next });
  }

  async _onDamageInputChange(event) {
    event.preventDefault();
    event.stopImmediatePropagation();

    const input = event.currentTarget;
    const damageType = String(input?.dataset?.damageType || "");
    if (!["physical", "stun"].includes(damageType)) return;

    const max = Number(this.actor.system?.health?.[damageType]?.max);
    const safeMax = Number.isFinite(max) ? max : 10;

    let next = parseInt(input.value, 10);
    if (!Number.isFinite(next)) next = 0;
    next = Math.max(0, Math.min(safeMax, next));

    if (String(input.value) !== String(next)) {
      input.value = String(next);
    }

    await this.actor.update({ [`system.health.${damageType}.value`]: next });
  }

  /**
   * Roll initiative through the active Encounter using the actor's token in the current scene.
   */
  async _onInitiativeRoll(event) {
    event.preventDefault();
    event.stopPropagation();

    try {
      const encounterCheck = await ensureEncounterCombatant({
        actor: this.actor,
        createCombat: false,
        createCombatant: false,
        notify: false,
      });

      if (!encounterCheck.ok) {
        const shouldRoll = await Dialog.confirm({
          title: "Roll Initiative?",
          content: `<p>${
            this.actor?.name || "This character"
          } is not in an encounter. Roll initiative anyway?</p>`,
          yes: () => true,
          no: () => false,
          defaultYes: false,
        });

        if (!shouldRoll) return;

        await sr2RollInitiativeToChat(this.actor);
        return;
      }

      await rollEncounterInitiative({ actor: this.actor });
    } catch (error) {
      console.error("SR2E | Error rolling initiative:", error);
      ui.notifications.error("Failed to roll initiative (see console).");
    }
  }

  /**
   * Handle keyboard navigation for damage boxes
   */
  _onDamageBoxKeydown(event) {
    const element = event.currentTarget;
    const damageBoxes = element.closest(".damage-boxes");
    const allBoxes = Array.from(damageBoxes.querySelectorAll(".damage-box"));
    const currentIndex = allBoxes.indexOf(element);

    let targetIndex = currentIndex;
    let handled = false;

    switch (event.key) {
      case "Enter":
      case " ":
        // Activate the damage box (same as clicking)
        event.preventDefault();
        this._onDamageBoxClick(event);
        handled = true;
        break;

      case "ArrowLeft":
      case "ArrowUp":
        event.preventDefault();
        targetIndex = Math.max(0, currentIndex - 1);
        handled = true;
        break;

      case "ArrowRight":
      case "ArrowDown":
        event.preventDefault();
        targetIndex = Math.min(allBoxes.length - 1, currentIndex + 1);
        handled = true;
        break;

      case "Home":
        event.preventDefault();
        targetIndex = 0;
        handled = true;
        break;

      case "End":
        event.preventDefault();
        targetIndex = allBoxes.length - 1;
        handled = true;
        break;

      case "0":
      case "Delete":
      case "Backspace":
        // Clear all damage
        event.preventDefault();
        const damageType = damageBoxes.dataset.damageType;
        this._clearDamage(damageType);
        handled = true;
        break;

      default:
        // Handle number keys 1-9 for direct damage setting
        if (event.key >= "1" && event.key <= "9") {
          event.preventDefault();
          const boxNumber = parseInt(event.key);
          if (boxNumber <= allBoxes.length) {
            // Create a synthetic click event for the target box
            const targetBox = allBoxes[boxNumber - 1];
            const syntheticEvent = {
              preventDefault: () => {},
              currentTarget: targetBox,
            };
            this._onDamageBoxClick(syntheticEvent);
            // Focus the target box
            targetBox.focus();
          }
          handled = true;
        }
        break;
    }

    // Move focus to target box if navigation occurred
    if (handled && targetIndex !== currentIndex && allBoxes[targetIndex]) {
      this._updateDamageBoxTabIndex(damageBoxes, targetIndex);
      allBoxes[targetIndex].focus();
    }
  }

  /**
   * Handle focus management for damage box groups
   */
  _onDamageBoxesFocusIn(event) {
    const damageBoxes = event.currentTarget;
    const focusedBox = event.target;

    if (focusedBox.classList.contains("damage-box")) {
      const allBoxes = Array.from(damageBoxes.querySelectorAll(".damage-box"));
      const focusedIndex = allBoxes.indexOf(focusedBox);
      this._updateDamageBoxTabIndex(damageBoxes, focusedIndex);
    }
  }

  /**
   * Update tabindex for damage boxes to maintain proper keyboard navigation
   */
  _updateDamageBoxTabIndex(damageBoxes, focusedIndex) {
    const allBoxes = damageBoxes.querySelectorAll(".damage-box");
    allBoxes.forEach((box, index) => {
      box.tabIndex = index === focusedIndex ? 0 : -1;
    });
  }

  /**
   * Clear all damage for a specific damage type
   */
  async _clearDamage(damageType) {
    try {
      if (!["physical", "stun"].includes(damageType)) {
        throw new Error(`Invalid damage type: ${damageType}`);
      }

      const currentDamage = this.actor.system.health[damageType].value;

      if (currentDamage === 0) {
        ui.notifications.info(`${damageType} damage is already at 0.`);
        return;
      }

      // Update the actor's damage value
      this._queueUpdate({
        [`system.health.${damageType}.value`]: 0,
      });

      // Provide immediate UI feedback
      this._updateDamageBoxDisplay(damageType, 0);

      ui.notifications.info(`${this.actor.name}'s ${damageType} damage has been cleared.`);
    } catch (error) {
      console.error(`SR2E | Error clearing ${damageType} damage:`, error);
      ui.notifications.error(`Failed to clear ${damageType} damage: ${error.message}`);
    }
  }

  /**
   * Initialize health data structure if it doesn't exist or has invalid values
   */
  async _initializeHealthData() {
    try {
      const currentHealth = this.actor.system.health;
      let needsUpdate = false;
      const updateData = {};

      // Check if health structure exists
      if (!currentHealth) {
        updateData["system.health"] = {
          physical: { value: 0, max: 10 },
          stun: { value: 0, max: 10 },
        };
        needsUpdate = true;
      } else {
        // Check physical health
        if (!currentHealth.physical) {
          updateData["system.health.physical"] = { value: 0, max: 10 };
          needsUpdate = true;
        } else {
          if (
            typeof currentHealth.physical.value !== "number" ||
            isNaN(currentHealth.physical.value)
          ) {
            updateData["system.health.physical.value"] = 0;
            needsUpdate = true;
          }
          if (typeof currentHealth.physical.max !== "number" || isNaN(currentHealth.physical.max)) {
            updateData["system.health.physical.max"] = 10;
            needsUpdate = true;
          }
        }

        // Check stun health
        if (!currentHealth.stun) {
          updateData["system.health.stun"] = { value: 0, max: 10 };
          needsUpdate = true;
        } else {
          if (typeof currentHealth.stun.value !== "number" || isNaN(currentHealth.stun.value)) {
            updateData["system.health.stun.value"] = 0;
            needsUpdate = true;
          }
          if (typeof currentHealth.stun.max !== "number" || isNaN(currentHealth.stun.max)) {
            updateData["system.health.stun.max"] = 10;
            needsUpdate = true;
          }
        }
      }

      // Apply updates if needed
      if (needsUpdate) {
        console.log("SR2E | Initializing health data structure:", updateData);
        await this.actor.update(updateData);
      }
    } catch (error) {
      console.error("SR2E | Error initializing health data:", error);
    }
  }

  /**
   * Performance optimization: Debounce function
   */
  _debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  /**
   * Performance optimization: Cache DOM elements
   */
  _getCachedElement(selector) {
    if (!this._domCache.has(selector)) {
      const element = this.element.find(selector);
      if (element.length > 0) {
        this._domCache.set(selector, element);
      }
    }
    return this._domCache.get(selector);
  }

  /**
   * Performance optimization: Clear DOM cache when sheet is rendered
   */
  _clearDomCache() {
    this._domCache.clear();
  }

  /**
   * Performance optimization: Queue updates to prevent excessive database writes
   */
  _queueUpdate(updateData) {
    // Merge with existing queued updates
    for (const [key, value] of Object.entries(updateData)) {
      this._updateQueue.set(key, value);
    }

    // Debounce the actual update
    this._debouncedUpdate();
  }

  /**
   * Performance optimization: Process queued updates
   */
  async _processUpdateQueue() {
    if (this._updateQueue.size === 0) return;

    // Convert Map to object
    const updateData = {};
    for (const [key, value] of this._updateQueue.entries()) {
      updateData[key] = value;
    }

    // Clear the queue
    this._updateQueue.clear();

    try {
      await this.actor.update(updateData);
    } catch (error) {
      console.error("SR2E | Failed to process update queue:", error);
      ui.notifications.error(
        "Failed to save changes. You may not have permission to modify this character.",
      );
    }
  }

  /**
   * Performance optimization: Optimized damage box display update
   */
  _updateDamageBoxDisplay(damageType, newDamage) {
    try {
      // Use cached selector for better performance
      const damageBoxes = this._getCachedElement(
        `.damage-boxes[data-damage-type="${damageType}"] .damage-box`,
      );

      if (!damageBoxes || damageBoxes.length === 0) {
        console.warn(`SR2E | No damage boxes found for type: ${damageType}`);
        return;
      }

      // Batch DOM updates for better performance
      const updates = [];

      damageBoxes.each((index, box) => {
        const boxNumber = parseInt(box.dataset.boxNumber);
        const shouldBeFilled = boxNumber <= newDamage;
        const currentlyFilled = box.dataset.filled === "true";

        if (shouldBeFilled !== currentlyFilled) {
          updates.push({
            element: box,
            filled: shouldBeFilled,
            boxNumber: boxNumber,
          });
        }
      });

      // Apply all updates at once
      updates.forEach((update) => {
        update.element.dataset.filled = update.filled.toString();
        update.element.setAttribute("aria-checked", update.filled.toString());
      });

      // Update damage counter with cached element
      const damageCounter = this._getCachedElement(`.${damageType}-monitor .damage-counter`);
      if (damageCounter && damageCounter.length > 0) {
        const maxDamage = this.actor.system.health[damageType].max || 10;
        damageCounter.text(`${newDamage}/${maxDamage}`);
      }
    } catch (error) {
      console.error(`SR2E | Error updating ${damageType} damage display:`, error);
    }
  }

  /**
   * Synchronize UI state across different parts of the character sheet
   * Ensures combat panel updates are reflected elsewhere
   */
  _synchronizeUIState() {
    try {
      // Update damage displays in other tabs if they exist
      this._updateDamageDisplays();

      // Trigger any dependent calculations
      this._updateDependentValues();

      // Emit custom event for other systems to listen to
      this._emitCombatStateChange();
    } catch (error) {
      console.error("SR2E | Error synchronizing UI state:", error);
      // Don't throw error, just log it since this is a synchronization function
    }
  }

  /**
   * Update damage displays throughout the character sheet
   */
  _updateDamageDisplays() {
    try {
      if (!this.actor?.system?.health) return;

      const physicalDamage = this.actor.system.health.physical?.value || 0;
      const stunDamage = this.actor.system.health.stun?.value || 0;

      // Update any damage indicators outside the combat panel
      const damageIndicators = this.element.find(".damage-indicator, .health-status");
      damageIndicators.each((index, element) => {
        try {
          const $element = $(element);
          const damageType = $element.data("damage-type");

          if (damageType === "physical") {
            $element.text(physicalDamage);
            $element.attr("data-damage-level", physicalDamage);
          } else if (damageType === "stun") {
            $element.text(stunDamage);
            $element.attr("data-damage-level", stunDamage);
          }
        } catch (elementError) {
          console.warn("SR2E | Error updating damage indicator:", elementError);
        }
      });

      // Update damage-based CSS classes for visual feedback
      this.element.removeClass("light-damage moderate-damage heavy-damage critical-damage");

      const totalDamage = physicalDamage + stunDamage;
      if (totalDamage >= 16) {
        this.element.addClass("critical-damage");
      } else if (totalDamage >= 12) {
        this.element.addClass("heavy-damage");
      } else if (totalDamage >= 6) {
        this.element.addClass("moderate-damage");
      } else if (totalDamage > 0) {
        this.element.addClass("light-damage");
      }
    } catch (error) {
      console.error("SR2E | Error updating damage displays:", error);
    }
  }

  /**
   * Update values that depend on combat state (damage penalties, etc.)
   */
  _updateDependentValues() {
    try {
      if (!this.actor?.system?.health) return;

      const physicalDamage = this.actor.system.health.physical?.value || 0;
      const stunDamage = this.actor.system.health.stun?.value || 0;

      // Calculate damage penalties according to SR2 rules
      // Physical damage: -1 die per 3 boxes of damage
      // Stun damage: -1 die per 3 boxes of damage
      const physicalPenalty = Math.floor(physicalDamage / 3);
      const stunPenalty = Math.floor(stunDamage / 3);
      const totalPenalty = physicalPenalty + stunPenalty;

      // Update penalty displays
      const penaltyIndicators = this.element.find(".damage-penalty, .wound-penalty");
      penaltyIndicators.each((index, element) => {
        try {
          const $element = $(element);
          $element.text(totalPenalty > 0 ? `-${totalPenalty}` : "0");
          $element.attr("data-penalty", totalPenalty);

          // Add visual styling based on penalty severity
          $element.removeClass("minor-penalty major-penalty severe-penalty");
          if (totalPenalty >= 6) {
            $element.addClass("severe-penalty");
          } else if (totalPenalty >= 3) {
            $element.addClass("major-penalty");
          } else if (totalPenalty > 0) {
            $element.addClass("minor-penalty");
          }
        } catch (elementError) {
          console.warn("SR2E | Error updating penalty indicator:", elementError);
        }
      });
    } catch (error) {
      console.error("SR2E | Error updating dependent values:", error);
    }
  }

  /**
   * Emit custom event for combat state changes
   */
  _emitCombatStateChange() {
    try {
      const combatState = {
        actorId: this.actor.id,
        physicalDamage: this.actor.system.health?.physical?.value || 0,
        stunDamage: this.actor.system.health?.stun?.value || 0,
        timestamp: Date.now(),
      };

      // Emit event for other systems to listen to
      Hooks.callAll("sr2e.combatStateChanged", combatState);

      // Also emit on the actor for actor-specific listeners
      if (this.actor.sheet) {
        $(this.actor.sheet.element).trigger("combatStateChanged", combatState);
      }
    } catch (error) {
      console.error("SR2E | Error emitting combat state change:", error);
    }
  }

  /**
   * Override the render method to handle loading states
   */
  async render(force = false, options = {}) {
    try {
      this._clearDomCache();

      // Add loading state
      if (this.element && this.element.length > 0) {
        this.element.addClass("loading");
      }

      // Call parent render method
      const result = await super.render(force, options);

      // Remove loading state and synchronize UI
      if (this.element && this.element.length > 0) {
        this.element.removeClass("loading");

        // Synchronize UI state after render
        setTimeout(() => {
          this._synchronizeUIState();
        }, 100);
      }

      return result;
    } catch (error) {
      console.error("SR2E | Error rendering character sheet:", error);

      // Remove loading state even on error
      if (this.element && this.element.length > 0) {
        this.element.removeClass("loading");
      }

      // Show user-friendly error
      ui.notifications.error("Failed to render character sheet. Try refreshing the page.");
      throw error;
    }
  }

  /**
   * Handle actor data updates from external sources
   */
  _onActorUpdate(actor, updateData, options, userId) {
    try {
      // Only process updates for this actor
      if (actor.id !== this.actor.id) return;

      // Check if combat-related data was updated
      const combatDataUpdated =
        updateData.system?.health || updateData.system?.attributes?.reaction;

      if (combatDataUpdated) {
        // Synchronize UI with a small delay to ensure data is fully updated
        setTimeout(() => {
          this._synchronizeUIState();
        }, 50);
      }
    } catch (error) {
      console.error("SR2E | Error handling actor update:", error);
    }
  }

  /**
   * Clean up listeners when sheet is closed
   */
  async close(options = {}) {
    if (this._hasActorUpdateHook && globalThis.Hooks) {
      Hooks.off("updateActor", this._boundOnActorUpdate);
      this._hasActorUpdateHook = false;
    }

    // Flush any pending queued updates (e.g., damage clicks) before closing
    if (this._updateQueue?.size > 0) {
      await this._processUpdateQueue();
    }

    this._clearDomCache();
    return super.close(options);
  }

  /** @override */
  async _updateObject(event, formData) {
    // Separate actor updates from item updates
    let actorUpdates = {};
    let itemUpdates = {};

    for (const [key, value] of Object.entries(formData)) {
      if (key.startsWith("items.")) {
        // This is an item update
        const match = key.match(/^items\.([^.]+)\.(.+)$/);
        if (match) {
          const itemId = match[1];
          const itemPath = match[2];

          if (!itemUpdates[itemId]) {
            itemUpdates[itemId] = {};
          }

          // Handle skill rating fields to ensure they're numbers
          if (itemPath.includes("Rating")) {
            itemUpdates[itemId][itemPath] = parseInt(value) || 0;
          } else {
            itemUpdates[itemId][itemPath] = value;
          }
        }
      } else {
        // This is an actor update
        actorUpdates[key] = value;
      }
    }

    ({ actorUpdates, itemUpdates } = sr2FilterUpdatesToDirtyFields({
      actorUpdates,
      itemUpdates,
      dirty: this._dirtyFields,
    }));

    const creationMode = this._isCreationMode();
    const totalSkillPoints = Number(this.actor.system.creation?.skillPoints) || 0;
    const totalAttributePoints = Number(this.actor.system.creation?.attributePoints) || 0;
    const totalForcePoints = Number(this.actor.system.creation?.forcePoints) || 0;

    // Clamp SR2 starting gear limits (rating <= 6) in creation mode
    const clampStartingRating = (item, updateData) => {
      if (!creationMode) return;
      if (!totalSkillPoints && !totalAttributePoints && !totalForcePoints) return;

      if (updateData["system.rating"] !== undefined) {
        const rating = parseInt(updateData["system.rating"], 10);
        if (Number.isFinite(rating)) {
          updateData["system.rating"] = Math.max(0, Math.min(6, rating));
        }
      }
    };

    const computeForceSpentExcluding = (excludeItemId) => {
      let spent = 0;
      for (const i of this.actor.items) {
        if (i.id === excludeItemId) continue;
        if (i.type === "spell") spent += Math.max(0, Number(i.system.force) || 0);
        if (i.type === "gear") {
          const quantity = Math.max(1, Number(i.system.quantity) || 1);
          const explicitBondCost = Math.max(0, Number(i.system.bondCost) || 0);
          const perItemCost =
            explicitBondCost > 0
              ? explicitBondCost
              : sr2InferFocusBondCostForGearItem({
                  category: i.system.category,
                  name: i.name,
                  price: i.system.price ?? i.system.cost ?? 0,
                });
          if (perItemCost > 0) spent += perItemCost * quantity;
        }
      }
      return spent;
    };

    // Update items first
    for (const [itemId, updateData] of Object.entries(itemUpdates)) {
      const item = this.actor.items.get(itemId);
      if (item) {
        // Creation-mode clamping and SR2 conc/spec math
        if (item.type === "skill") {
          const nextSystem = {
            ...item.system,
            baseSkill: updateData["system.baseSkill"] ?? item.system.baseSkill,
            concentration: updateData["system.concentration"] ?? item.system.concentration,
            specialization: updateData["system.specialization"] ?? item.system.specialization,
            allocatedRating: updateData["system.allocatedRating"] ?? item.system.allocatedRating,
            isFree: updateData["system.isFree"] ?? item.system.isFree,
          };

          const computed = sr2ComputeSkillRatingsFromAllocated(nextSystem);
          const shouldClampAllocated =
            creationMode && !nextSystem.isFree && nextSystem.baseSkill !== "Language";
          updateData["system.allocatedRating"] = shouldClampAllocated
            ? Math.min(computed.allocatedRating, 6)
            : computed.allocatedRating;
          updateData["system.baseRating"] = computed.baseRating;
          updateData["system.concentrationRating"] = computed.concentrationRating;
          updateData["system.specializationRating"] = computed.specializationRating;
        }

        if (item.type === "spell" && updateData["system.force"] !== undefined) {
          let nextForce = parseInt(updateData["system.force"], 10);
          if (!Number.isFinite(nextForce)) nextForce = 1;

          if (creationMode && totalForcePoints > 0) {
            nextForce = Math.max(1, Math.min(6, nextForce));
            const spentOther = computeForceSpentExcluding(item.id);
            const maxForThis = totalForcePoints - spentOther;
            if (maxForThis < 1) {
              ui.notifications.error(
                "Not enough Force Points remaining. Reduce other spells/foci first.",
              );
              updateData["system.force"] = item.system.force || 1;
            } else {
              updateData["system.force"] = Math.min(nextForce, maxForThis);
            }
          } else {
            updateData["system.force"] = Math.max(1, Math.min(10, nextForce));
          }
        }

        clampStartingRating(item, updateData);

        await item.update(updateData);
      }
    }

    // Then update actor if there are actor-level changes
    if (Object.keys(actorUpdates).length > 0) {
      // Sync legacy lifestyle fields from the multi-lifestyle list
      const existingLifestyles = this._getNormalizedLifestylesFromActor();
      const lifestyleUpdates = sr2BuildLifestyleUpdatesFromFormFields(
        actorUpdates,
        existingLifestyles,
      );

      if (lifestyleUpdates.changed) {
        for (const key of lifestyleUpdates.indexedKeys) delete actorUpdates[key];

        actorUpdates["system.resources.lifestyles"] = lifestyleUpdates.lifestyles;
        actorUpdates["system.resources.lifestyle"] = lifestyleUpdates.primaryType;
        actorUpdates["system.creation.lifestyleMonths"] = lifestyleUpdates.primaryMonths;
      }

      // Clamp attributes by racial mins/maxes only while creation mode is active.
      const metatype =
        actorUpdates["system.details.metatype"] ?? this.actor.system.details?.metatype ?? "human";
      const bounds = sr2GetRacialAttributeBounds(metatype);

      const attrKeys = ["body", "quickness", "strength", "charisma", "intelligence", "willpower"];
      const newAttributeValues = {};
      for (const key of attrKeys) {
        const path = `system.attributes.${key}.value`;
        const raw =
          actorUpdates[path] !== undefined
            ? actorUpdates[path]
            : this.actor.system.attributes?.[key]?.value;
        const value = creationMode ? sr2Clamp(raw, bounds[key].min, bounds[key].max) : Number(raw);
        newAttributeValues[key] = Number.isFinite(value) ? value : 0;
        if (actorUpdates[path] !== undefined) actorUpdates[path] = newAttributeValues[key];
      }
      await this.object.update(actorUpdates);
    }

    sr2ClearDirtyFieldState(this._dirtyFields);
    return true;
  }

  _trackDirtyFormFields(html) {
    html.find("input[name], select[name], textarea[name]").on("input change", (event) => {
      sr2MarkDirtyField(this._dirtyFields, event.currentTarget?.name);
    });
  }

  /**
   * Handle drag start events for creating hotbar macros
   */
  _onDragStart(event) {
    const element = event.currentTarget;

    // Get item data - try different ways to find the item ID
    let itemId =
      element.dataset.itemId ||
      element.getAttribute("data-item-id") ||
      element.closest("[data-item-id]")?.dataset.itemId;

    if (!itemId) {
      console.warn("SR2E | No item ID found for drag operation");
      return;
    }

    const item = this.actor.items.get(itemId);

    if (!item) {
      console.warn("SR2E | Item not found for drag:", itemId);
      return;
    }

    // Create drag data for hotbar macro creation
    const dragData = item.toDragData ? item.toDragData() : { type: "Item", uuid: item.uuid };

    // Set the drag data
    event.dataTransfer.setData("text/plain", JSON.stringify(dragData));
  }

  /** @override */
  async _onDrop(event) {
    const data = TextEditor.getDragEventData(event);

    // Prevent dropping an owned item from this same actor onto this sheet, which creates duplicates.
    if (data?.type === "Item") {
      const uuid = data.uuid ?? data.data?.uuid;
      if (uuid && this.actor?.uuid && uuid.startsWith(`${this.actor.uuid}.Item.`)) {
        event.preventDefault();
        event.stopPropagation();
        return false;
      }
    }

    return super._onDrop(event);
  }

  /**
   * Handle weapon attack button clicks
   */
  async _onWeaponAttackWithMeleeDialog(event) {
    event.preventDefault();

    const weaponId = event.currentTarget.dataset.itemId;
    const weapon = this.actor.items.get(weaponId);

    if (!weapon) {
      ui.notifications.error("Weapon not found");
      return;
    }

    // Check if this is a melee weapon (has reach property)
    const isMeleeWeapon = weapon.system.reach !== undefined && weapon.system.reach !== null;

    if (isMeleeWeapon) {
      // Show melee combat modifiers dialog
      this._showMeleeCombatDialog(weapon);
    } else {
      // For ranged weapons, show a simpler attack dialog or direct roll
      this._performWeaponAttack(weapon, 0); // No modifiers for now
    }
  }

  /**
   * Show melee combat modifiers dialog
   */
  async _showMeleeCombatDialog(weapon, defaultTN = 4) {
    //Dean
    const availablePools = this._getAvailablePools();
    if (!availablePools.some((pool) => pool.key === "additional")) {
      availablePools.push({
        key: "additional",
        name: "Additional",
        isActorPool: false,
        isUnlimited: true,
      });
    }
    const dialogContent = `
      <div class="melee-combat-dialog">
        <h3>Melee Combat Modifiers for ${weapon.name}</h3>
        <div class="target-number-section">
          <label for="target-number"><strong>Base Target Number:</strong></label>
          <select id="target-number" name="targetNumber">
            <option value="2" ${defaultTN === 2 ? "selected" : ""}>2 - Trivial</option>
            <option value="3" ${defaultTN === 3 ? "selected" : ""}>3 - Easy</option>
            <option value="4" ${defaultTN === 4 ? "selected" : ""}>4 - Average</option>
            <option value="5" ${defaultTN === 5 ? "selected" : ""}>5 - Fair</option>
            <option value="6" ${defaultTN === 6 ? "selected" : ""}>6 - Hard</option>
            <option value="7" ${defaultTN === 7 ? "selected" : ""}>7 - Extreme</option>
            <option value="8" ${defaultTN === 8 ? "selected" : ""}>8 - Nearly Impossible</option>
            <option value="9" ${defaultTN === 9 ? "selected" : ""}>9 - Impossible</option>
            <option value="10" ${defaultTN === 10 ? "selected" : ""}>10 - Miraculous</option>
            <option value="11" ${defaultTN === 11 ? "selected" : ""}>11</option>
            <option value="12" ${defaultTN === 12 ? "selected" : ""}>12</option>
            <option value="13" ${defaultTN === 13 ? "selected" : ""}>13</option>
            <option value="14" ${defaultTN === 14 ? "selected" : ""}>14</option>
            <option value="15" ${defaultTN === 15 ? "selected" : ""}>15</option>
            <option value="16" ${defaultTN === 16 ? "selected" : ""}>16</option>
            <option value="17" ${defaultTN === 17 ? "selected" : ""}>17</option>
            <option value="18" ${defaultTN === 18 ? "selected" : ""}>18</option>
            <option value="19" ${defaultTN === 19 ? "selected" : ""}>19</option>
            <option value="20" ${defaultTN === 20 ? "selected" : ""}>20</option>
            <option value="21" ${defaultTN === 21 ? "selected" : ""}>21</option>
            <option value="22" ${defaultTN === 22 ? "selected" : ""}>22</option>
            <option value="23" ${defaultTN === 23 ? "selected" : ""}>23</option>
            <option value="24" ${defaultTN === 24 ? "selected" : ""}>24</option>
            <option value="25" ${defaultTN === 25 ? "selected" : ""}>25</option>
            <option value="26" ${defaultTN === 26 ? "selected" : ""}>26</option>
            <option value="27" ${defaultTN === 27 ? "selected" : ""}>27</option>
            <option value="28" ${defaultTN === 28 ? "selected" : ""}>28</option>
            <option value="29" ${defaultTN === 29 ? "selected" : ""}>29</option>
            <option value="30" ${defaultTN === 30 ? "selected" : ""}>30</option>
          </select>
        </div>
        
        <div class="modifier-section">
          <h4>Situational Modifiers</h4>
          
          <div class="modifier-row">
            <label for="friends-in-melee">Character has friends in melee:</label>
            <select id="friends-in-melee" name="friendsInMelee">
              <option value="0">None</option>
              <option value="-1">1 Friend (-1)</option>
              <option value="-2">2 Friends (-2)</option>
              <option value="-3">3 Friends (-3)</option>
              <option value="-4">4+ Friends (-4)</option>
            </select>
          </div>

          <div class="modifier-row">
            <label for="opponents-in-melee">Opponent has friends in melee:</label>
            <select id="opponents-in-melee" name="opponentsInMelee">
              <option value="0">None</option>
              <option value="1">1 Friend (+1)</option>
              <option value="2">2 Friends (+2)</option>
              <option value="3">3 Friends (+3)</option>
              <option value="4">4+ Friends (+4)</option>
            </select>
          </div>

          <div class="modifier-row">
            <label for="reach-advantage">Character's weapon reach advantage:</label>
            <select id="reach-advantage" name="reachAdvantage">
              <option value="0">Equal reach</option>
              <option value="-1">1 point longer (-1)</option>
              <option value="-2">2 points longer (-2)</option>
              <option value="-3">3 points longer (-3)</option>
              <option value="1">1 point shorter (+1)</option>
              <option value="2">2 points shorter (+2)</option>
              <option value="3">3 points shorter (+3)</option>
            </select>
          </div>

          <div class="modifier-row">
            <label for="multiple-targets">Character attacking multiple targets:</label>
            <select id="multiple-targets" name="multipleTargets">
              <option value="0">Single target</option>
              <option value="2">2 targets (+2)</option>
              <option value="4">3 targets (+4)</option>
              <option value="6">4 targets (+6)</option>
              <option value="8">5+ targets (+8)</option>
            </select>
          </div>

          <div class="modifier-row">
            <label for="superior-position">Character has superior position:</label>
            <input type="checkbox" id="superior-position" name="superiorPosition" value="-1">
            <span class="modifier-value">(-1)</span>
          </div>

          <div class="modifier-row">
            <label for="opponent-prone">Opponent is prone:</label>
            <input type="checkbox" id="opponent-prone" name="opponentProne" value="-2">
            <span class="modifier-value">(-2)</span>
          </div>

          <div class="modifier-summary">
            <strong>Total TN Modifier: <span id="total-modifier">0</span></strong>
          </div>
        </div>
        ${
          availablePools.length > 0
            ? `
        <div class="pool-dice-section">
          <div class="pool-dice-header">
            <label><strong>Pool Dice (Optional):</strong></label>
            <button type="button" class="reset-pool-dice sr2-small-action" title="Reset pool dice allocation">
              <i class="fas fa-sync-alt"></i> Reset
            </button>
          </div>
          ${availablePools
            .map(
              (pool) => `
              ${(() => {
                const hasDice = pool.isUnlimited || pool.current > 0;
                const disabledAttr = hasDice ? "" : "disabled";
                const tooltipAttr = hasDice ? "" : 'title="No dice available (pool is empty)"';
                const poolLabel = pool.isUnlimited
                  ? `${pool.name} (No limit)`
                  : `${pool.name} (${pool.current}/${pool.max})`;
                const maxAttr = pool.isUnlimited ? "" : `max="${pool.current}"`;
                return `
            <div class="pool-option">
              <label>
                <input type="checkbox" name="pool-${pool.key}" value="${pool.key}" class="pool-checkbox" ${disabledAttr} ${tooltipAttr}>
                ${poolLabel}
              </label>
              <input type="number" name="pool-${pool.key}-dice" 
                     min="0" ${maxAttr} value="0" disabled class="pool-dice-input">
            </div>
                `;
              })()}
          `,
            )
            .join("")}
        </div>
        `
            : ""
        }
      </div>
    `;

    // Create and show the dialog
    new Dialog({
      title: `Melee Attack: ${weapon.name}`,
      content: dialogContent,
      buttons: {
        attack: {
          label: "Make Attack",
          callback: (html) => {
            const modifiers = this._calculateMeleeModifiers(html);
            this._performWeaponAttack(weapon, modifiers.total);
          },
        },
        cancel: {
          label: "Cancel",
        },
      },
      default: "attack",
      render: (html) => {
        // Reset all pool dice allocations in this dialog
        html.find(".reset-pool-dice").on("click", function () {
          html.find(".pool-checkbox").prop("checked", false);
          html.find(".pool-dice-input").prop("disabled", true).val(0);
        });

        // Add event listeners to update total modifier in real-time
        const updateTotal = () => {
          const modifiers = this._calculateMeleeModifiers(html);
          html
            .find("#total-modifier")
            .text(modifiers.total > 0 ? `+${modifiers.total}` : modifiers.total);
        };

        html.find('select, input[type="checkbox"]').on("change", updateTotal);
        updateTotal(); // Initial calculation
      },
    }).render(true);
  }

  /**
   * Calculate melee combat modifiers from dialog
   */
  _calculateMeleeModifiers(html) {
    const friendsInMelee = parseInt(html.find('[name="friendsInMelee"]').val()) || 0;
    const opponentsInMelee = parseInt(html.find('[name="opponentsInMelee"]').val()) || 0;
    const reachAdvantage = parseInt(html.find('[name="reachAdvantage"]').val()) || 0;
    const multipleTargets = parseInt(html.find('[name="multipleTargets"]').val()) || 0;
    const superiorPosition = html.find('[name="superiorPosition"]').is(":checked") ? -1 : 0;
    const opponentProne = html.find('[name="opponentProne"]').is(":checked") ? -2 : 0;

    const total =
      friendsInMelee +
      opponentsInMelee +
      reachAdvantage +
      multipleTargets +
      superiorPosition +
      opponentProne;

    return {
      friendsInMelee,
      opponentsInMelee,
      reachAdvantage,
      multipleTargets,
      superiorPosition,
      opponentProne,
      total,
    };
  }

  /**
   * Perform the actual weapon attack with modifiers
   */
  async _performWeaponAttack(weapon, tnModifier) {
    // Get the linked skill for this weapon
    const linkedSkill = sr2FindWeaponSkill(this.actor, weapon);

    if (!linkedSkill) {
      ui.notifications.error(
        `No skill found for ${weapon.name}. Please link a skill to this weapon.`,
      );
      return;
    }

    // Calculate base TN (typically 4 for most attacks)
    const baseTN = 4;
    const finalTN = Math.max(2, baseTN + tnModifier); // TN can't go below 2

    // Get skill rating
    const skillRating = sr2GetEffectiveSkillRating(linkedSkill);

    if (skillRating === 0) {
      ui.notifications.error(`${linkedSkill.name} skill rating is 0. Cannot make attack.`);
      return;
    }

    // Create attack roll description
    let attackDescription = `${weapon.name} Attack`;
    if (tnModifier !== 0) {
      attackDescription += ` (TN ${baseTN} ${tnModifier > 0 ? "+" : ""}${tnModifier} = ${finalTN})`;
    }

    // Roll the attack
    const result = await this.actor.rollDice(skillRating, finalTN, attackDescription);

    // Create detailed chat message
    const chatContent = `
      <div class="weapon-attack-result">
        <h3>${weapon.name} Attack</h3>
        <p><strong>Attacker:</strong> ${this.actor.name}</p>
        <p><strong>Skill:</strong> ${linkedSkill.name} (${skillRating})</p>
        <p><strong>Target Number:</strong> ${finalTN}</p>
        ${tnModifier !== 0 ? `<p><strong>Modifiers:</strong> ${tnModifier > 0 ? "+" : ""}${tnModifier}</p>` : ""}
        <p><strong>Damage:</strong> ${weapon.system.damage || "Unknown"}</p>
        ${weapon.system.reach !== undefined ? `<p><strong>Reach:</strong> ${weapon.system.reach}</p>` : ""}
        <p><strong>Result:</strong> ${result.successes} success${result.successes !== 1 ? "es" : ""}</p>
        ${result.isCriticalFailure ? "<p><strong>Critical Failure!</strong></p>" : ""}
      </div>
    `;

    ChatMessage.create({
      user: game.user.id,
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      content: chatContent,
    });
  }
}
