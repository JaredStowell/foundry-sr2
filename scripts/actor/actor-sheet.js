import {
    sr2ComputeCreationNuyenBudgetBreakdown,
    sr2ComputeAttributePointsSpent,
    sr2ComputeContactLevelSummary,
    sr2ComputeForcePointsSpent,
    sr2ComputeSkillPointsSpent,
    sr2ComputeSkillRatingsFromAllocated,
    sr2ComputeSpellLockCapacity,
    sr2Clamp,
    sr2FormatSignedModifier,
    sr2GetRacialAttributeBounds,
    sr2GetRacialModifiers,
    sr2GetRacialTraits,
    sr2ParseFocusName,
    sr2InferFocusBondCostForGearItem,
    sr2NormalizeContactLevel,
    sr2SkillInferAllocatedRating
} from "../sr2-rules.js";

let skillsDataCache = null;
let skillsDataCachePromise = null;

async function loadSkillsData() {
    if (skillsDataCache) return skillsDataCache;

    if (!skillsDataCachePromise) {
        skillsDataCachePromise = fetch('/systems/shadowrun2e/data/skills.json')
            .then(response => response.json())
            .then(skillsData => {
                skillsDataCache = skillsData;
                return skillsData;
            })
            .catch(error => {
                skillsDataCachePromise = null;
                throw error;
            });
    }

    return skillsDataCachePromise;
}

function sr2InferSpellRangeFromName(spellName) {
    const name = String(spellName || "").toLowerCase();
    if (!name) return "";
    if (name.includes("touch")) return "Touch";
    return "LOS";
}

function sr2InferSpellResistFromType(spellType) {
    switch (String(spellType || "").toUpperCase()) {
        case "M":
            return "Willpower";
        case "P":
            return "Body";
        default:
            return "";
    }
}

function sr2InferSpellDamageLevelFromDrain(rawDrain) {
    const drain = String(rawDrain || "").trim().toUpperCase();
    const match = drain.match(/([LMSD])\s*$/);
    return match ? match[1] : "";
}

function sr2FormatSpellDrain(rawDrain) {
    const drain = String(rawDrain || "").trim();
    if (!drain) return "";

    const levelMatch = drain.toUpperCase().match(/([LMSD])\s*$/);
    if (!levelMatch) return drain;

    const level = levelMatch[1];
    let formula = drain.replace(/([LMSD])\s*$/i, "").trim();
    formula = formula.replace(/^\[(.*)\]$/, "$1").trim();
    if (!formula) return drain;

    return `${formula} ${level}`;
}

const SR2_SPELL_CLASS_LABELS = {
    C: "Combat",
    D: "Detection",
    H: "Health",
    I: "Illusion",
    M: "Manipulation"
};

function sr2NormalizeSpellClass(value) {
    const raw = String(value || "").trim();
    if (!raw) return "";

    const upper = raw.toUpperCase();
    if (Object.prototype.hasOwnProperty.call(SR2_SPELL_CLASS_LABELS, upper)) return upper;

    const lower = raw.toLowerCase();
    const map = {
        combat: "C",
        detection: "D",
        health: "H",
        illusion: "I",
        manipulation: "M"
    };
    return map[lower] || "";
}

function sr2GetSystemSetting(key, fallback) {
    try {
        return game?.settings?.get("shadowrun2e", key) ?? fallback;
    } catch (err) {
        return fallback;
    }
}

const SR2_DAMAGE_LEVELS = ["L", "M", "S", "D"];
const SR2_DAMAGE_BOXES_BY_LEVEL = { L: 1, M: 3, S: 6, D: 10 };

function sr2GetAugmentationModifiers(actor) {
    if (!actor) return {};
    return actor._sr2AugmentationModifiers ?? actor._calculateAugmentationModifiers?.() ?? {};
}

function sr2GetModifiedAttribute(actor, attributeName) {
    const base = Number(actor?.system?.attributes?.[attributeName]?.value) || 0;
    const modifiers = sr2GetAugmentationModifiers(actor);

    const map = {
        body: "BOD",
        quickness: "QCK",
        strength: "STR",
        charisma: "CHA",
        intelligence: "INT",
        willpower: "WIL"
    };
    const key = map[String(attributeName || "")] || "";
    if (!key) return base;
    return base + (Number(modifiers?.[key]) || 0);
}

function sr2SafeEvalArithmetic(expression) {
    const expr = String(expression || "").replace(/\s+/g, "");
    if (!expr) return null;
    if (!/^[0-9+\-*/().]+$/.test(expr)) return null;
    try {
        const value = Function(`"use strict";return (${expr});`)();
        if (!Number.isFinite(value)) return null;
        return value;
    } catch (err) {
        return null;
    }
}

function sr2ParseDamageCode(rawDamageCode, context = {}) {
    const raw = String(rawDamageCode || "").trim();
    if (!raw) return null;

    const isStun = /\bSTUN\b/i.test(raw);
    let cleaned = raw.replace(/\bSTUN\b/ig, "").trim();

    const levelMatch = cleaned.match(/([LMSD])\s*$/i);
    if (!levelMatch) return null;
    const level = levelMatch[1].toUpperCase();

    cleaned = cleaned.replace(/([LMSD])\s*$/i, "").trim();
    cleaned = cleaned.replace(/^\((.*)\)$/, "$1").trim();

    const strength = Number(context?.strength) || 0;
    const strengthMin = Number(context?.strengthMin) || strength;

    let powerExpr = cleaned.toUpperCase();
    powerExpr = powerExpr.replace(/STR\s*MIN\.?/g, String(strengthMin));
    powerExpr = powerExpr.replace(/\bSTR\b/g, String(strength));
    powerExpr = powerExpr.replace(/(\d+)\s*[X×]\s*/g, "$1*");
    powerExpr = powerExpr.replace(/[^0-9+\-*/().]/g, "");

    const power = sr2SafeEvalArithmetic(powerExpr);
    if (!Number.isFinite(power)) return null;

    return {
        power: Math.floor(power),
        level,
        damageType: isStun ? "stun" : "physical",
        raw
    };
}

function sr2StageDamageLevel(baseLevel, stageDelta) {
    const level = String(baseLevel || "").toUpperCase();
    const baseIndex = SR2_DAMAGE_LEVELS.indexOf(level);
    if (baseIndex < 0) return null;

    const delta = Number(stageDelta) || 0;
    const finalIndex = baseIndex + delta;
    if (finalIndex < 0) return null;
    if (finalIndex >= SR2_DAMAGE_LEVELS.length) return "D";
    return SR2_DAMAGE_LEVELS[finalIndex];
}

function sr2GetArmorRatings(actor) {
    const equippedArmor = actor?.items?.filter(i => i.type === "armor" && i.system?.equipped) || [];
    const ballistic = equippedArmor.reduce((sum, a) => sum + (Number(a.system?.ballistic) || 0), 0);
    const impact = equippedArmor.reduce((sum, a) => sum + (Number(a.system?.impact) || 0), 0);
    const dermalArmor = Number(actor?.system?.details?.traits?.dermalArmor) || 0;
    return {
        ballistic: ballistic + dermalArmor,
        impact: impact + dermalArmor
    };
}

async function sr2ApplyDamageToActor(actor, damageType, boxes) {
    const type = String(damageType || "physical");
    const amount = Number(boxes) || 0;
    if (!actor || amount <= 0) return false;

    const hasTwoTracks = actor?.system?.health?.physical && actor?.system?.health?.stun;
    if (!hasTwoTracks) return false;

    const primary = type === "stun" ? "stun" : "physical";
    const other = primary === "stun" ? "physical" : "stun";

    const currentPrimary = Number(actor.system.health?.[primary]?.value) || 0;
    const currentOther = Number(actor.system.health?.[other]?.value) || 0;
    const maxPrimary = Number(actor.system.health?.[primary]?.max) || 10;
    const maxOther = Number(actor.system.health?.[other]?.max) || 10;

    let nextPrimary = currentPrimary + amount;
    let carry = 0;

    if (primary === "stun" && nextPrimary > maxPrimary) {
        carry = nextPrimary - maxPrimary;
        nextPrimary = maxPrimary;
    }

    const updateData = { [`system.health.${primary}.value`]: Math.max(0, Math.min(maxPrimary, nextPrimary)) };
    if (carry > 0) {
        const nextOther = Math.max(0, Math.min(maxOther, currentOther + carry));
        updateData[`system.health.${other}.value`] = nextOther;
    }

    await actor.update(updateData);
    return true;
}

function sr2GetWeaponSkillData(actor, weapon, options = {}) {
    const notify = Boolean(options?.notify);
    const weaponType = String(weapon?.system?.weaponType || "");
    const isRanged = weaponType === "ranged";

    const fallbackSkillNames = isRanged
        ? ["Firearms", "Projectile Weapons", "Throwing Weapons", "Gunnery"]
        : ["Armed Combat", "Unarmed Combat"];

    let skillRating = 0;
    let skillName = "Defaulting";
    let rollDescription = "";

    const linkedSkillId = weapon?.system?.linkedSkill?.skillId;
    if (linkedSkillId) {
        const linkedSkill = actor?.items?.get?.(linkedSkillId);
        if (linkedSkill) {
            const rollType = String(weapon?.system?.linkedSkill?.rollType || "base");
            switch (rollType) {
                case "concentration": {
                    skillRating = Number(linkedSkill.system?.concentrationRating) || 0;
                    if (linkedSkill.system?.concentration) {
                        skillName = `${linkedSkill.name || linkedSkill.system?.baseSkill} (${linkedSkill.system.concentration})`;
                        rollDescription = "Concentration";
                    } else {
                        rollDescription = "No Concentration";
                        if (notify) ui.notifications.warn(`${weapon.name} is linked to a skill with no concentration selected.`);
                    }
                    break;
                }
                case "specialization": {
                    skillRating = Number(linkedSkill.system?.specializationRating) || 0;
                    if (linkedSkill.system?.specialization) {
                        skillName = `${linkedSkill.name || linkedSkill.system?.baseSkill} [${linkedSkill.system.specialization}]`;
                        rollDescription = "Specialization";
                    } else {
                        rollDescription = "No Specialization";
                        if (notify) ui.notifications.warn(`${weapon.name} is linked to a skill with no specialization entered.`);
                    }
                    break;
                }
                case "base":
                default:
                    skillRating = Number(linkedSkill.system?.baseRating) || 0;
                    skillName = linkedSkill.name || linkedSkill.system?.baseSkill || "Unknown Skill";
                    rollDescription = "Base Skill";
                    break;
            }
        } else if (notify) {
            ui.notifications.warn(`${weapon.name} is linked to a skill that no longer exists.`);
        }
    } else {
        const skills = actor?.items?.filter?.(i => i.type === "skill" && fallbackSkillNames.includes(i.system?.baseSkill)) || [];
        if (skills.length > 0) {
            const bestSkill = skills.reduce((best, current) => {
                const currentRating = Number(current.system?.baseRating) || 0;
                const bestRating = Number(best.system?.baseRating) || 0;
                return currentRating > bestRating ? current : best;
            });
            skillRating = Number(bestSkill.system?.baseRating) || 0;
            skillName = bestSkill.name || bestSkill.system?.baseSkill || "Unknown Skill";
            rollDescription = "Auto-detected";
        }
    }

    return { skillRating, skillName, rollDescription };
}

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

    this._debouncedUpdate = this._debounce(this._processUpdateQueue.bind(this), 50);
  }

  /** @override */
	  static get defaultOptions() {
	    return foundry.utils.mergeObject(super.defaultOptions, {
	      classes: ["shadowrun2e", "sheet", "actor"],
	      template: "systems/shadowrun2e/templates/actor/character-sheet.html",
	      width: 960,
	      height: 680,
	      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "main" }]
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
      disableBuddies
    };

	    // Ensure shadowrun2e flags container exists for template bindings
	    if (!context.flags.shadowrun2e) context.flags.shadowrun2e = {};

	    // Default: creation mode is enabled for characters created via priorities
	    if (context.flags.shadowrun2e.creationCompleted === true) {
	      context.flags.shadowrun2e.creationMode = false;
	    } else if (typeof context.flags.shadowrun2e.creationMode !== "boolean") {
	      const hasCreationPoints =
	        (context.system.creation?.attributePoints || 0) > 0 ||
	        (context.system.creation?.skillPoints || 0) > 0 ||
	        (context.system.creation?.forcePoints || 0) > 0;
	      context.flags.shadowrun2e.creationMode = hasCreationPoints;
	    }

    // Ensure health data structure exists with defaults
    if (!context.system.health) {
      context.system.health = {
        physical: { value: 0, max: 10 },
        stun: { value: 0, max: 10 }
      };
    } else {
      // Ensure physical health exists
      if (!context.system.health.physical) {
        context.system.health.physical = { value: 0, max: 10 };
      } else {
        // Ensure values are numbers, handle NaN, null, undefined
        const physValue = context.system.health.physical.value;
        const physMax = context.system.health.physical.max;

        context.system.health.physical.value = (typeof physValue === 'number' && !isNaN(physValue)) ? physValue : 0;
        context.system.health.physical.max = (typeof physMax === 'number' && !isNaN(physMax)) ? physMax : 10;
      }

      // Ensure stun health exists
      if (!context.system.health.stun) {
        context.system.health.stun = { value: 0, max: 10 };
      } else {
        // Ensure values are numbers, handle NaN, null, undefined
        const stunValue = context.system.health.stun.value;
        const stunMax = context.system.health.stun.max;

        context.system.health.stun.value = (typeof stunValue === 'number' && !isNaN(stunValue)) ? stunValue : 0;
        context.system.health.stun.max = (typeof stunMax === 'number' && !isNaN(stunMax)) ? stunMax : 10;
      }
    }

    // Normalize lifestyles list (supports multiple lifestyles)
    if (['character', 'contact', 'follower'].includes(actorData.type)) {
      if (!context.system.resources) context.system.resources = {};

      const legacyLifestyle = context.system.resources.lifestyle || "street";
      const legacyMonths = context.system.creation?.lifestyleMonths ?? 1;

      const rawLifestyles = context.system.resources.lifestyles;
      if (!Array.isArray(rawLifestyles) || rawLifestyles.length === 0) {
        context.system.resources.lifestyles = [{
          type: legacyLifestyle,
          months: Math.max(1, parseInt(legacyMonths, 10) || 1)
        }];
      } else {
        context.system.resources.lifestyles = rawLifestyles.map(l => ({
          type: l?.type || legacyLifestyle,
          months: Math.max(1, parseInt(l?.months, 10) || 1)
        }));
      }
    }

    // Prepare character data and items
    if (['character', 'contact', 'follower'].includes(actorData.type)) {
      this._prepareItems(context);
      this._prepareCharacterData(context);
      await this._prepareSkillsData(context);
    }

    if (actorData.type === "contact" && context.sr2Settings.contactLevels) {
      if (!context.system.details) context.system.details = {};
      context.system.details.contactLevel = sr2NormalizeContactLevel(context.system.details.contactLevel);
    }

    // Racial modifiers/caps and creation point tracking
    if (['character', 'contact', 'follower'].includes(actorData.type)) {
      const metatype = context.system?.details?.metatype || "human";
      const bounds = sr2GetRacialAttributeBounds(metatype);

      // Apply racial min/max to displayed attributes (Body/Quickness/Strength/Charisma/Intelligence/Willpower)
      for (const [key, { min, max }] of Object.entries(bounds)) {
        if (!context.system.attributes?.[key]) continue;
        context.system.attributes[key].min = min;
        context.system.attributes[key].max = max;
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
        const linkedActors = game.actors.filter(a => a.system?.details?.leaderId === this.actor.id);

        context.leaderContacts = linkedActors
          .filter(a => a.type === "contact")
          .map(a => ({
            id: a.id,
            name: a.name,
            contactLevel: sr2NormalizeContactLevel(a.system?.details?.contactLevel),
            sort: Number(a.sort) || 0
          }))
          .sort((a, b) => a.name.localeCompare(b.name));

        const linkedFollowers = linkedActors
          .filter(a => a.type === "follower")
          .map(a => ({
            id: a.id,
            name: a.name,
            archetype: a.system?.details?.archetype || ""
          }))
          .sort((a, b) => a.name.localeCompare(b.name));

        const gangArchetypes = new Set(["gangMember", "tribesman"]);
        context.leaderGangMembers = linkedFollowers.filter(f => gangArchetypes.has(f.archetype));
        context.leaderFollowers = linkedFollowers.filter(f => !gangArchetypes.has(f.archetype));
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
	          context.contactLevelsSummary = sr2ComputeContactLevelSummary(context.leaderContacts, charisma);
	          contactsLimit = context.contactLevelsSummary.counts.maxTotalContacts;
	          contactsOver = Boolean(
	            context.contactLevelsSummary.over.extraContacts ||
	            context.contactLevelsSummary.over.extraLevel2 ||
	            context.contactLevelsSummary.over.extraLevel3
	          );
	        }

	        context.connectionCounts = {
	          contacts: contactsCount,
	          followers: context.leaderFollowers.length
	        };

	        context.connectionLimits = {
	          contacts: contactsLimit,
	          // SR2: one Followers purchase provides five followers.
	          followers: followersPurchased ? 5 : 0
	        };

	        context.connectionOver = {
	          contacts: contactsOver,
	          followers: context.connectionCounts.followers > context.connectionLimits.followers
	        };

	        context.creationExtrasPurchased = {
	          buddy: disableBuddies ? false : (Math.max(0, parseInt(extras.buddy, 10) || 0) > 0),
	          gang: Math.max(0, parseInt(extras.gang, 10) || 0) > 0,
	          followers: followersPurchased
	        };
	      }

	      const attributePointsTotal = Number(context.system.creation?.attributePoints) || 0;
	      const skillPointsTotal = Number(context.system.creation?.skillPoints) || 0;
	      const forcePointsTotal = Number(context.system.creation?.forcePoints) || 0;

      const attributePointsSpent = sr2ComputeAttributePointsSpent(context.system.attributes, metatype);
      const skillPointsSpent = sr2ComputeSkillPointsSpent(context.skills || []);
      const forcePointsSpent = sr2ComputeForcePointsSpent(context.items || []);

      context.creationPoints = {
        attributes: {
          total: attributePointsTotal,
          spent: attributePointsSpent,
          remaining: attributePointsTotal - attributePointsSpent
        },
        skills: {
          total: skillPointsTotal,
          spent: skillPointsSpent,
          remaining: skillPointsTotal - skillPointsSpent
        },
        force: {
          total: forcePointsTotal,
          spent: forcePointsSpent,
          remaining: forcePointsTotal - forcePointsSpent
        }
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
        ["Willpower", mods.willpower]
      ].filter(([, v]) => Number(v) !== 0);

      const traitParts = [];
      if (traits.lowLightVision) traitParts.push("Low-Light Vision");
      if (traits.thermographicVision) traitParts.push("Thermographic Vision");
      if (traits.reach) traitParts.push(`Reach +${traits.reach}`);
      if (traits.dermalArmor) traitParts.push(`Dermal Armor (+${traits.dermalArmor} Body vs damage)`);
      if (traits.diseaseResistance) traitParts.push(`Disease Resistance (+${traits.diseaseResistance} Body vs disease)`);

      const modsText = modParts.length
        ? `Racial Mods: ${modParts.map(([label, v]) => `${label} ${sr2FormatSignedModifier(v)}`).join(", ")}`
        : "";
      const traitsText = traitParts.length ? `Traits: ${traitParts.join(", ")}` : "";
      context.racialSummary = [modsText, traitsText].filter(Boolean).join(" | ");

      // Creation resources helpers (lifestyle + extras)
      const budgetOptions = {
        disableBuddies: context.sr2Settings.disableBuddies
      };
      if (actorData.type === "character" && context.sr2Settings.contactLevels && context.contactLevelsSummary) {
        budgetOptions.contactLevelsSummary = context.contactLevelsSummary;
      }
      context.creationResources = sr2ComputeCreationNuyenBudgetBreakdown(context.system, context.items, budgetOptions);
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

      if (i.type === 'skill') {
        skills.push(i);
      } else if (i.type === 'weapon') {
        weapons.push(i);
      } else if (i.type === 'armor') {
        armor.push(i);
      } else if (i.type === 'cyberware') {
        cyberware.push(i);
      } else if (i.type === 'bioware') {
        bioware.push(i);
      } else if (i.type === 'spell') {
        i.sr2Spell = {
          range: sr2InferSpellRangeFromName(i.name),
          resist: sr2InferSpellResistFromType(i.system?.type),
          damage: sr2InferSpellDamageLevelFromDrain(i.system?.drain),
          drainDisplay: sr2FormatSpellDrain(i.system?.drain)
        };
        spells.push(i);
      } else if (i.type === 'adeptpower') {
        // Calculate total cost for leveled powers
        if (i.system.hasLevels) {
          i.system.totalCost = i.system.cost * i.system.currentLevel;
        } else {
          i.system.totalCost = i.system.cost;
        }
        adeptpowers.push(i);
      } else if (i.type === 'gear') {
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
      if (i.type === 'totem') {
        totems.push(i);
      }
    }
    context.totems = totems;

    // Find selected totem
    context.selectedTotem = totems.find(t => t.system.isSelected);

    const round2 = (value) => Math.round((value + Number.EPSILON) * 100) / 100;

    // Calculate essence loss from installed cyberware
    const installedCyberware = cyberware.filter(c => c.system.installed);
    const totalEssenceLoss = round2(installedCyberware.reduce((total, cyber) => {
      return total + (parseFloat(cyber.system.essence) || 0);
    }, 0));

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
      available: currentEssence
    };

    // Calculate total power points used for adept powers
    context.powerPointsUsed = adeptpowers.reduce((total, power) => {
      return total + (power.system.totalCost || 0);
    }, 0);

    // Calculate gear summary statistics
    context.totalWeight = context.items.reduce((total, item) => {
      return total + ((item.system.weight || 0) * (item.system.quantity || 1));
    }, 0);

    context.totalValue = context.items.reduce((total, item) => {
      return total + ((item.system.price || 0) * (item.system.quantity || 1));
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
    const modifiers = this.actor._sr2AugmentationModifiers ?? this.actor._calculateAugmentationModifiers();
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
      initiativeDice: 1 + (modifiers.INI || 0)
    };

    // Check for cyberdeck (for Hacking Pool visibility)
    context.system.hasCyberdeck = this.actor.items.some(item => 
      item.type === 'cyberware' && 
      item.name.toLowerCase().includes('cyberdeck')
    );

    // Check for Vehicle Control Rig (for Control Pool visibility)
    context.system.hasControlRig = this.actor.items.some(item => 
      item.type === 'cyberware' && 
      (item.name.toLowerCase().includes('control rig') || 
       item.name.toLowerCase().includes('vehicle control rig'))
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
      context.skills.forEach(skill => {
        if (skill.system.baseSkill && skillsData[skill.system.baseSkill]) {
          skill.availableConcentrations = skillsData[skill.system.baseSkill].Concentrations || [];
        } else {
          skill.availableConcentrations = [];
        }

        // Ensure all skill system properties exist with defaults
        if (!skill.system.baseSkill) skill.system.baseSkill = '';
        if (!skill.system.concentration) skill.system.concentration = '';
        if (!skill.system.specialization) skill.system.specialization = '';
        if (typeof skill.system.baseRating !== 'number') skill.system.baseRating = 0;
        if (typeof skill.system.concentrationRating !== 'number') skill.system.concentrationRating = 0;
        if (typeof skill.system.specializationRating !== 'number') skill.system.specializationRating = 0;
        if (typeof skill.system.isFree !== 'boolean') skill.system.isFree = false;

        // Ensure allocated rating exists in the template context and compute SR2 conc/spec math for display
        const computed = sr2ComputeSkillRatingsFromAllocated(skill.system);
        skill.system.allocatedRating = computed.allocatedRating;
        skill.system.baseRating = computed.baseRating;
        skill.system.concentrationRating = computed.concentrationRating;
        skill.system.specializationRating = computed.specializationRating;
      });
    } catch (error) {
      console.error('SR2E | Failed to load skills data:', error);
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
      Hooks.on('updateActor', this._boundOnActorUpdate);
      this._hasActorUpdateHook = true;
    }

    // Ensure skill selects show correct values after render
    this._refreshSkillSelects(html);

    // Rollable abilities
    html.find('.rollable').click(this._onRoll.bind(this));

    // Drag events for macros
    if (this.actor.isOwner) {
      let handler = ev => this._onDragStart(ev);
      
      // Enable drag for all item types
      const itemSelectors = [
        'li.item',           // Generic items
        '.item-row',         // Weapons, armor, gear, cyberware, bioware, spells, adept powers
        '.skill-item',       // Skills
        '.program-row'       // Programs (for cyberdeck sheets)
      ];
      
      itemSelectors.forEach(selector => {
        html.find(selector).each((i, element) => {
          // Skip headers and elements without item IDs
          if (element.classList.contains("inventory-header") || 
              element.classList.contains("header") ||
              !element.dataset.itemId) return;
              
          element.setAttribute("draggable", true);
          element.addEventListener("dragstart", handler, false);
          
          // Add visual feedback for draggable items
          element.style.cursor = "grab";
        });
      });
    }

    // Everything below here is only needed if the sheet is editable
    if (!this.isEditable) return;

    // Add Inventory Item
    html.find('.item-create').click(this._onItemCreate.bind(this));

    // Delete Inventory Item
    html.find('.item-delete').click(async ev => {
      ev.preventDefault();
      ev.stopPropagation();

      try {
        // Get item ID from button's data attribute or parent element
        const button = $(ev.currentTarget);

        // Try multiple ways to get the item ID
        let itemId = button.attr("data-item-id") ||
          button.data("item-id") ||
          button.data("itemId") ||
          button.parents(".item, .skill-item, .item-row").attr("data-item-id") ||
          button.parents(".item, .skill-item, .item-row").data("item-id") ||
          button.parents(".item, .skill-item, .item-row").data("itemId");

        console.log("SR2E | Delete item button clicked, itemId:", itemId);
        console.log("SR2E | Button data attributes:", button.get(0).dataset);
        console.log("SR2E | Available items:", this.actor.items.map(i => ({ id: i.id, name: i.name, type: i.type })));

        if (!itemId) {
          console.warn("SR2E | No item ID found for delete operation");
          ui.notifications.error("Could not find item to delete. Check console for details.");
          return;
        }

        const item = this.actor.items.get(itemId);
        if (item) {
          // Confirm deletion for important items
          const confirmDelete = game.settings.get("core", "noCanvas") ||
            confirm(`Delete ${item.name}?`);

          if (confirmDelete) {
            await item.delete();
            const row = button.parents(".item, .skill-item, .item-row");
            row.slideUp(200, () => this.render(false));
            ui.notifications.info(`${item.name} deleted successfully.`);
          }
        } else {
          console.warn(`SR2E | Item with ID ${itemId} not found in actor items`);
          console.warn("SR2E | Available item IDs:", this.actor.items.map(i => i.id));
          ui.notifications.error(`Could not find item with ID: ${itemId}`);
        }
      } catch (error) {
        console.error("SR2E | Error deleting item:", error);
        ui.notifications.error("Failed to delete item. Check console for details.");
      }
    });

    // Active Effect management
    html.find(".effect-control").click(ev => onManageActiveEffect(ev, this.actor));

    // Pool management
    html.find('.pool-adjust').click(this._onPoolAdjust.bind(this));
    html.find('.reset-all-pools').click(this._onResetAllPools.bind(this));

    // Skill management
    html.find('.base-skill-select').change(this._onBaseSkillChange.bind(this));
	    html.find('.concentration-select').change(this._onConcentrationChange.bind(this));
	    html.find('input[name*="specialization"]:not([name*="Rating"])').on('change', this._onSpecializationChange.bind(this));
	    html.find('input[name*="allocatedRating"]').on('change', this._onSkillAllocatedRatingChange.bind(this));
	    html.find('input[name*="allocatedRating"]').on('blur', this._onSkillAllocatedRatingChange.bind(this));
	    html.find('input[name*="allocatedRating"]').on('input', this._onSkillAllocatedRatingInput.bind(this));
	    html.find('.sr2-skill-allocated-adjust').click(this._onSkillAllocatedAdjust.bind(this));
	    html.find('.skill-roll').click(this._onSkillRoll.bind(this));

	    // Leader quick-open (followers)
	    html.find('.open-leader').click(this._onOpenLeader.bind(this));
	    html.find('.open-connection').click(this._onOpenConnection.bind(this));
	    html.find('.sr2-add-contact').click(this._onAddContact.bind(this));
	    html.find('.sr2-adjust-contacts').click(this._onAdjustContacts.bind(this));
	    html.find('.sr2-toggle-extra').click(this._onToggleExtra.bind(this));

	    // Creation resources finalization
	    html.find('.finalize-resources').click(this._onFinalizeResources.bind(this));
	    html.find('.unfinalize-resources').click(this._onUnfinalizeResources.bind(this));
	    html.find('.sr2-complete-creation').click(this._onCompleteCreation.bind(this));

	    // Lifestyle management (creation resources)
	    if (['character', 'contact', 'follower'].includes(this.actor.type)) {
	      html.find('.sr2-lifestyle-add').click(this._onLifestyleAdd.bind(this));
      html.find('.sr2-lifestyle-delete').click(this._onLifestyleDelete.bind(this));
    }

    // Handle form submission to ensure skill data is saved
    html.find('form').on('submit', this._onFormSubmit.bind(this));

    // Attribute rolls
    html.find('.attribute-roll').click(this._onAttributeRoll.bind(this));

    // Item browser
    html.find('.browse-items').click(this._onBrowseItems.bind(this));

    // Spell casting
    html.find('.spell-lock-toggle').click(this._onSpellLockToggle.bind(this));
    html.find('.spell-cast').click(this._onSpellCast.bind(this));

    // Weapon attacks
    html.find('.weapon-attack').click(this._onWeaponAttack.bind(this));

    // Range calculator
    html.find('.range-weapon-select').change(this._onRangeWeaponChange.bind(this));
    html.find('.range-distance').on('input', this._onRangeDistanceChange.bind(this));

    // Totem management
    html.find('.browse-totems').click(this._onBrowseTotems.bind(this));
    html.find('.change-totem').click(this._onBrowseTotems.bind(this));

    // Cyberware installation management
    html.find('.cyberware-installed').change(this._onCyberwareInstall.bind(this));
    html.find('.bioware-installed').change(this._onBiowareInstall.bind(this));

    // Damage quick controls (header)
    html.find('.sr2-damage-adjust').click(this._onDamageAdjust.bind(this));
    html.find('.sr2-damage-input').change(this._onDamageInputChange.bind(this));

    // Initiative roll button
    html.find('.initiative-roll-btn').click(this._onInitiativeRoll.bind(this));
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
    createButton.setAttribute('aria-disabled', 'true');
    const header = event.currentTarget;
    const type = header.dataset.type;
    const data = foundry.utils.deepClone(header.dataset);
    const typeLabel = type ? type.charAt(0).toUpperCase() + type.slice(1) : 'Item';
    const name = `New ${typeLabel}`;
    const itemData = {
      name: name,
      type: type,
      system: data
    };
    delete itemData.system["type"];

    try {
      const [created] = await this.actor.createEmbeddedDocuments('Item', [itemData]);
      await this.render(false);
      return created;
    } finally {
      this._creatingEmbeddedItem = false;
      createButton.removeAttribute('aria-disabled');
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
      if (dataset.rollType == 'item') {
        const itemId = element.closest('.item').dataset.itemId;
        const item = this.actor.items.get(itemId);
        if (item) return item.roll();
      }
    }

    // Handle rolls that supply the formula directly
    if (dataset.roll) {
      let label = dataset.label ? `[ability] ${dataset.label}` : '';
      let roll = new Roll(dataset.roll, this.actor.getRollData());
      roll.toMessage({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        flavor: label,
        rollMode: game.settings.get('core', 'rollMode'),
      });
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
    const maxValue = poolType === "karma"
      ? (Number(pool.total) || 0)
      : (Number(pool.max) || 0);
    const newValue = Math.clamped(currentValue + adjustment, 0, maxValue);

    this.actor.update({ [`system.pools.${poolType}.current`]: newValue });
  }

  /**
   * Reset all pools to maximum (GM only)
   */
  async _onResetAllPools(event) {
    event.preventDefault();

    // Check conditions for pool visibility
    const magicAttribute = this.actor.system.attributes.magic?.value || 0;
    const isSpellcaster = Boolean(this.actor.system.magic?.awakened) && !Boolean(this.actor.system.magic?.physicalAdept);
    const hasCyberdeck = this.actor.items.some(item => 
      item.type === 'cyberware' && 
      item.name.toLowerCase().includes('cyberdeck')
    );
    const hasControlRig = this.actor.items.some(item => 
      item.type === 'cyberware' && 
      (item.name.toLowerCase().includes('control rig') || 
       item.name.toLowerCase().includes('vehicle control rig'))
    );

    // Build list of available pools for confirmation dialog
    const availablePools = [];
    if (true) availablePools.push('Combat');
    if (isSpellcaster && magicAttribute > 0) availablePools.push('Magic');
    if (hasCyberdeck) availablePools.push('Hacking');
    if (hasControlRig) availablePools.push('Control');
    if ((this.actor.system.pools.task?.max || 0) > 0) availablePools.push('Task');
    if (isSpellcaster && magicAttribute > 0) availablePools.push('Astral');

    // Confirm with GM before resetting
    const confirmed = await Dialog.confirm({
      title: "Reset All Pools",
      content: `<p>Are you sure you want to reset all dice pools to maximum for <strong>${this.actor.name}</strong>?</p>
                <p>This will restore the following pools to their maximum values:</p>
                <p><em>${availablePools.join(', ')}</em></p>`,
      yes: () => true,
      no: () => false,
      defaultYes: false
    });

    if (!confirmed) return;

    // Build update data for available pools only
    const updateData = {};
    const poolData = this.actor.system.pools;

    // Define pool types with their visibility conditions
    const poolTypes = [
      { key: 'combat', condition: true },
      { key: 'spell', condition: isSpellcaster && magicAttribute > 0 },
      { key: 'hacking', condition: hasCyberdeck },
      { key: 'control', condition: hasControlRig },
      { key: 'task', condition: (poolData.task?.max || 0) > 0 },
      { key: 'astral', condition: isSpellcaster && magicAttribute > 0 }
    ];

    const resetPools = [];
    poolTypes.forEach(poolType => {
      if (poolType.condition && poolData[poolType.key]) {
        updateData[`system.pools.${poolType.key}.current`] = poolData[poolType.key].max;
        resetPools.push(poolType.key);
      }
    });

    // Update the actor
    await this.actor.update(updateData);

    // Show confirmation message
    ui.notifications.info(`All available dice pools reset to maximum for ${this.actor.name}`);

    // Optional: Create chat message for transparency
    ChatMessage.create({
      user: game.user.id,
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      content: `<div class="pool-reset-message">
        <h3>🔄 Pools Reset</h3>
        <p><strong>${this.actor.name}'s</strong> dice pools have been reset to maximum by the GM.</p>
        <ul>
          ${resetPools.map(type => {
        const pool = poolData[type];
        return pool && pool.max > 0 ? `<li>${type.charAt(0).toUpperCase() + type.slice(1)} Pool: ${pool.max}/${pool.max}</li>` : '';
      }).filter(item => item).join('')}
        </ul>
      </div>`,
      whisper: [game.user.id] // Only visible to GM
    });
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
          const duplicate = this.actor.items.some(i =>
            i.type === "skill" &&
            i.id !== item.id &&
            i.system?.baseSkill === baseSkill
          );
          if (duplicate) {
            ui.notifications.warn(`"${baseSkill}" is already on the sheet. Each skill can only be acquired once.`);
            element.value = currentBaseSkill || "";
            return;
          }
        }

        // Clear concentration and specialization when base skill changes
        const nextSystem = {
          ...item.system,
          baseSkill: baseSkill,
          concentration: "",
          specialization: ""
        };

        const computed = sr2ComputeSkillRatingsFromAllocated(nextSystem);
        await item.update({
          'system.baseSkill': baseSkill,
          'system.concentration': "",
          'system.specialization': "",
          'system.allocatedRating': computed.allocatedRating,
          'system.baseRating': computed.baseRating,
          'system.concentrationRating': computed.concentrationRating,
          'system.specializationRating': computed.specializationRating,
          'name': baseSkill || 'New Skill'
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
    const skillId = element.dataset.skillId || element.closest('.skill-item').dataset.itemId;
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
    const nextSpecialization = concentration ? (item.system.specialization || "") : "";

    // If a concentration is selected, ensure allocated rating supports it (min 2)
    const computedPreview = sr2ComputeSkillRatingsFromAllocated({
      ...item.system,
      concentration,
      specialization: nextSpecialization,
      allocatedRating: nextAllocated
    });

    if (baseSkill && nextAllocated < computedPreview.minAllocated) {
      nextAllocated = computedPreview.minAllocated;
    }

    if (this._isCreationMode() && (Number(this.actor.system.creation?.skillPoints) || 0) > 0) {
      const total = Number(this.actor.system.creation?.skillPoints) || 0;
      const spentOther = this._getSkillPointsSpentExcluding(item.id);
      const maxForThis = total - spentOther;

      if (maxForThis < computedPreview.minAllocated) {
        ui.notifications.error("Not enough Skill Points remaining. Reduce other skills first.");
        element.value = item.system.concentration || "";
        return;
      }

      nextAllocated = Math.min(nextAllocated, 6, maxForThis);
      nextAllocated = Math.max(nextAllocated, computedPreview.minAllocated);
    }

    const computed = sr2ComputeSkillRatingsFromAllocated({
      ...item.system,
      concentration,
      specialization: nextSpecialization,
      allocatedRating: nextAllocated
    });

    await item.update({
      "system.concentration": concentration,
      "system.specialization": nextSpecialization,
      "system.allocatedRating": computed.allocatedRating,
      "system.baseRating": computed.baseRating,
      "system.concentrationRating": computed.concentrationRating,
      "system.specializationRating": computed.specializationRating
    });
  }

  /**
   * Handle specialization text change
   */
  async _onSpecializationChange(event) {
    event.preventDefault();
    event.stopPropagation();
    const element = event.currentTarget;
    const skillId = element.dataset.skillId || element.closest('.skill-item').dataset.itemId;
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
      allocatedRating: nextAllocated
    });

    if (baseSkill && specialization && nextAllocated < computedPreview.minAllocated) {
      nextAllocated = computedPreview.minAllocated;
    }

    if (this._isCreationMode() && (Number(this.actor.system.creation?.skillPoints) || 0) > 0) {
      const total = Number(this.actor.system.creation?.skillPoints) || 0;
      const spentOther = this._getSkillPointsSpentExcluding(item.id);
      const maxForThis = total - spentOther;

      if (maxForThis < computedPreview.minAllocated) {
        ui.notifications.error("Not enough Skill Points remaining. Reduce other skills first.");
        element.value = item.system.specialization || "";
        return;
      }

      nextAllocated = Math.min(nextAllocated, 6, maxForThis);
      nextAllocated = Math.max(nextAllocated, computedPreview.minAllocated);
    }

    const computed = sr2ComputeSkillRatingsFromAllocated({
      ...item.system,
      specialization,
      allocatedRating: nextAllocated
    });

    await item.update({
      "system.specialization": specialization,
      "system.allocatedRating": computed.allocatedRating,
      "system.baseRating": computed.baseRating,
      "system.concentrationRating": computed.concentrationRating,
      "system.specializationRating": computed.specializationRating
    });
  }

  /**
   * Refresh skill select elements to ensure they show correct values
   */
  _refreshSkillSelects(html) {
    // Ensure base skill selects show the correct selected values
    html.find('.base-skill-select').each((i, select) => {
      const skillId = select.dataset.skillId;
      const skill = this.actor.items.get(skillId);
      if (skill && skill.system.baseSkill) {
        select.value = skill.system.baseSkill;
      }
    });

    // Ensure concentration selects show the correct selected values
    html.find('.concentration-select').each((i, select) => {
      const skillId = select.dataset.skillId;
      const skill = this.actor.items.get(skillId);
      if (skill && skill.system.concentration) {
        select.value = skill.system.concentration;
      }
    });
  }

	  _isCreationMode() {
	    const completed = this.actor.getFlag("shadowrun2e", "creationCompleted");
	    if (completed === true) return false;

	    const flag = this.actor.getFlag("shadowrun2e", "creationMode");
	    if (typeof flag === "boolean") return flag;

	    const creation = this.actor.system?.creation;
	    return Boolean(
      (creation?.attributePoints || 0) > 0 ||
      (creation?.skillPoints || 0) > 0 ||
      (creation?.forcePoints || 0) > 0
    );
  }

  _getSkillPointsSpentExcluding(excludeItemId) {
    return this.actor.items
      .filter(i => i.type === "skill" && i.id !== excludeItemId)
      .reduce((sum, skill) => {
        if (!skill.system?.baseSkill) return sum;
        if (skill.system?.isFree) return sum;
        return sum + sr2SkillInferAllocatedRating(skill.system);
      }, 0);
  }

  /**
   * Handle allocated skill rating changes (SR2 skill point spending)
   */
  async _onSkillAllocatedRatingChange(event) {
    event.preventDefault();
    event.stopPropagation();

    const element = event.currentTarget;
    const skillId = element.closest('.skill-item')?.dataset?.itemId;
    const item = skillId ? this.actor.items.get(skillId) : null;
    if (!item) return;
    if (item.system.isFree) {
      element.value = sr2SkillInferAllocatedRating(item.system);
      return;
    }

    const baseSkill = item.system.baseSkill || "";
    const oldAllocated = sr2SkillInferAllocatedRating(item.system);
    let nextAllocated = parseInt(element.value, 10);
    if (!Number.isFinite(nextAllocated)) nextAllocated = 0;

    const preview = { ...item.system, allocatedRating: nextAllocated };
    const computedPreview = sr2ComputeSkillRatingsFromAllocated(preview);

    // Starting skills must have a minimum rating (SR2 p. 45). Allow 0 only if no base skill selected.
    const minAllocated = baseSkill ? computedPreview.minAllocated : 0;
    const maxAllocated = this._isCreationMode() ? 6 : 12;

    nextAllocated = sr2Clamp(nextAllocated, minAllocated, maxAllocated);

    if (this._isCreationMode() && (Number(this.actor.system.creation?.skillPoints) || 0) > 0 && baseSkill) {
      const total = Number(this.actor.system.creation?.skillPoints) || 0;
      const spentOther = this._getSkillPointsSpentExcluding(item.id);
      const maxForThis = total - spentOther;

      if (maxForThis < minAllocated) {
        ui.notifications.error("Not enough Skill Points remaining. Reduce other skills first.");
        element.value = oldAllocated;
        return;
      }

      nextAllocated = Math.min(nextAllocated, maxForThis);
    }

    const computed = sr2ComputeSkillRatingsFromAllocated({ ...item.system, allocatedRating: nextAllocated });

    await item.update({
      "system.allocatedRating": computed.allocatedRating,
      "system.baseRating": computed.baseRating,
      "system.concentrationRating": computed.concentrationRating,
      "system.specializationRating": computed.specializationRating
    });
  }

	  _onSkillAllocatedRatingInput(event) {
	    const element = event.currentTarget;
	    const rating = parseInt(element.value, 10);
	    if (!Number.isFinite(rating)) {
	      element.style.borderColor = '';
	      return;
	    }

	    const maxAllocated = this._isCreationMode() ? 6 : 12;
	    if (rating < 0 || rating > maxAllocated) {
	      element.style.borderColor = '#ff6b6b';
	    } else {
	      element.style.borderColor = '';
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
	      currentTarget: input
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

	    if (this.actor.system?.creation?.resourcesFinalized) {
	      ui.notifications.warn("Resources are finalized. Reopen resources to purchase extras.");
	      return;
	    }

	    const delta = parseInt(event.currentTarget?.dataset?.delta, 10);
	    if (!Number.isFinite(delta) || delta === 0) return;

	    const raw = Math.max(0, parseInt(this.actor.system?.creation?.extras?.contacts, 10) || 0);
	    const current = Math.max(2, raw);
	    const next = Math.max(2, current + delta);

	    await this.actor.update({
	      "system.creation.extras.contacts": next
	    });
	  }

	  async _onToggleExtra(event) {
	    event.preventDefault();
	    event.stopPropagation();

	    if (!this._isCreationMode()) return;

	    if (this.actor.system?.creation?.resourcesFinalized) {
	      ui.notifications.warn("Resources are finalized. Reopen resources to purchase extras.");
	      return;
	    }

	    const extra = event.currentTarget?.dataset?.extra;
	    const disableBuddies = Boolean(sr2GetSystemSetting("disableBuddies", false)) || Boolean(sr2GetSystemSetting("contactLevels", false));
	    const allowed = disableBuddies ? ["gang", "followers"] : ["buddy", "gang", "followers"];
	    if (!allowed.includes(extra)) return;

	    const current = Math.max(0, parseInt(this.actor.system?.creation?.extras?.[extra], 10) || 0);
	    const next = current > 0 ? 0 : 1;

	    await this.actor.update({
	      [`system.creation.extras.${extra}`]: next
	    });
	  }

  async _onAddContact(event) {
    event.preventDefault();
    event.stopPropagation();

    const leaderId = this.actor.id;

    Hooks.once("renderDialog", (app, html) => {
      try {
        const jq = globalThis.jQuery;
        const $html = (jq && html instanceof jq) ? html : $(html);

        const form = $html.is("form") ? $html : $html.find("form");
        if (!form.length) return;

        const typeSelect = form.find('select[name="type"]');
        if (!typeSelect.length) return;

        const optionValues = typeSelect.find("option").map((_, el) => el.value).get();
        const isSR2ActorCreateDialog =
          optionValues.includes("character") &&
          optionValues.includes("cyberdeck") &&
          optionValues.includes("vehicle") &&
          optionValues.includes("spirit");
        if (!isSR2ActorCreateDialog) return;

        setTimeout(() => {
          try {
            typeSelect.val("contact").trigger("change");
            const leaderSelect = form.find('select[name="system.details.leaderId"]');
            if (leaderSelect.length) leaderSelect.val(leaderId).trigger("change");
          } catch (err) {
            console.warn("SR2E | Failed to prefill Add Contact dialog:", err);
          }
        }, 0);
      } catch (err) {
        console.warn("SR2E | Failed to open Add Contact dialog:", err);
      }
    });

    return Actor.createDialog();
  }

	  async _onFinalizeResources(event) {
	    event.preventDefault();
	    event.stopPropagation();

    const budget = Number(this.actor.system?.creation?.startingNuyen) || 0;
    if (budget <= 0) return;
    if (this.actor.system?.creation?.resourcesFinalized) return;

    const contactLevelsEnabled = Boolean(sr2GetSystemSetting("contactLevels", false));
    const disableBuddies = contactLevelsEnabled || Boolean(sr2GetSystemSetting("disableBuddies", false));

    const budgetOptions = { disableBuddies };

    if (contactLevelsEnabled) {
      const charisma = Number(this.actor.system?.attributes?.charisma?.value) || 0;
      const linkedContacts = game?.actors?.filter(a => a.type === "contact" && a.system?.details?.leaderId === this.actor.id) ?? [];
      budgetOptions.contactLevelsSummary = sr2ComputeContactLevelSummary(
        linkedContacts.map(a => ({ id: a.id, sort: Number(a.sort) || 0, contactLevel: a.system?.details?.contactLevel })),
        charisma
      );

      const over = budgetOptions.contactLevelsSummary?.over;
      if (over?.extraContacts || over?.extraLevel2 || over?.extraLevel3) {
        ui.notifications.error("Contact limits exceeded. Reduce contacts or contact levels before finalizing resources.");
        return;
      }
    }

    const breakdown = sr2ComputeCreationNuyenBudgetBreakdown(this.actor.system, this.actor.items, budgetOptions);
    if ((breakdown.remainingNuyen || 0) < 0) {
      ui.notifications.error("Resource Budget exceeded. Reduce item/lifestyle/extras spending first.");
      return;
    }

    const unspentNuyen = Math.max(0, Math.floor(breakdown.remainingNuyen || 0));
    const startingCashFromUnspent = Math.floor(unspentNuyen / 10);

    const roll = await (new Roll("3d6")).evaluate({ async: true });
    const startingCashRoll = (Number(roll.total) || 0) * 1000;
    const startingCashFinal = startingCashFromUnspent + startingCashRoll;

    await this.actor.update({
      "system.creation.resourcesFinalized": true,
      "system.creation.unspentNuyen": unspentNuyen,
      "system.creation.startingCashFromUnspent": startingCashFromUnspent,
      "system.creation.startingCashRoll": startingCashRoll,
      "system.creation.startingCashFinal": startingCashFinal,
      "system.resources.nuyen": startingCashFinal
    });

    ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      flavor: `${this.actor.name} finalizes starting cash`,
      content: `<p>Unspent: ${unspentNuyen}¥ → ÷10 = ${startingCashFromUnspent}¥</p>
                <p>Roll (3D6×1,000¥): ${startingCashRoll}¥</p>
                <p><strong>Total Starting Cash:</strong> ${startingCashFinal}¥</p>`
    });

	    ui.notifications.info(`Resources finalized: ${startingCashFinal}¥ starting cash.`);
	  }

	  async _onUnfinalizeResources(event) {
	    event.preventDefault();
	    event.stopPropagation();

    if (!this.actor.system?.creation?.resourcesFinalized) return;

    const restoredBudget = Number(this.actor.system?.creation?.startingNuyen) || 0;
    await this.actor.update({
      "system.creation.resourcesFinalized": false,
      "system.creation.unspentNuyen": 0,
      "system.creation.startingCashFromUnspent": 0,
      "system.creation.startingCashRoll": 0,
      "system.creation.startingCashFinal": 0,
      ...(restoredBudget > 0 ? { "system.resources.nuyen": restoredBudget } : {})
    });

	    ui.notifications.info("Resource budget reopened.");
	  }

		  async _onCompleteCreation(event) {
		    event.preventDefault();
		    event.stopPropagation();

		    const alreadyCompleted = this.actor.getFlag?.("shadowrun2e", "creationCompleted") === true;
		    if (alreadyCompleted) {
		      ui.notifications.warn("Character Generation is already finalized for this character.");
		      return;
		    }

		    const message = `<p><strong>Finalize Character Generation?</strong></p>
		      <p>This will permanently disable Character Generation for <strong>${this.actor.name}</strong>.</p>
		      <p>You will not be able to re-enter Character Generation or revert this.</p>`;

		    let confirmed = false;
		    if (globalThis.Dialog?.confirm) {
		      confirmed = await Dialog.confirm({
		        title: "Finalize Character Generation",
		        content: message
		      });
		    } else {
		      confirmed = confirm("Finalize Character Generation? This will permanently disable Character Generation and cannot be undone.");
		    }

	    if (!confirmed) return;

		    await this.actor.update({
		      "flags.shadowrun2e.creationMode": false,
		      "flags.shadowrun2e.creationCompleted": true
		    });

		    ui.notifications.info("Character Generation finalized. This cannot be undone.");
		  }

  _getNormalizedLifestylesFromActor() {
    const rawLifestyles = this.actor.system?.resources?.lifestyles;
    if (Array.isArray(rawLifestyles) && rawLifestyles.length) {
      return foundry.utils.deepClone(rawLifestyles).map(l => ({
        type: l?.type || "street",
        months: Math.max(1, parseInt(l?.months, 10) || 1)
      }));
    }

    const legacyLifestyle = this.actor.system?.resources?.lifestyle || "street";
    const legacyMonths = this.actor.system?.creation?.lifestyleMonths ?? 1;
    return [{
      type: legacyLifestyle,
      months: Math.max(1, parseInt(legacyMonths, 10) || 1)
    }];
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
      "system.creation.lifestyleMonths": primary.months || 1
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
      "system.creation.lifestyleMonths": primary.months || 1
    });
  }

  /**
   * Handle form submission to ensure all data is properly saved
   */
  async _onFormSubmit(event) {
    console.log("SR2E | Form submitted");
    // Let the default form submission handle the data
    // Our _updateObject method will process it
  }

  /**
   * Handle skill roll
   */
  async _onSkillRoll(event) {
    event.preventDefault();
    const skillId = event.currentTarget.dataset.skillId;
    const rollType = event.currentTarget.dataset.rollType || 'base';

    console.log("SR2E | Skill roll requested - ID:", skillId, "Type:", rollType);

    // Get the skill item and force a fresh read
    let skill = this.actor.items.get(skillId);

    if (!skill) {
      console.error("SR2E | Skill not found for roll:", skillId);
      ui.notifications.error("Skill not found for roll");
      return;
    }

    // Sorcery/Conjuring require a Magic rating.
    const baseSkillName = skill.system?.baseSkill || "";
    const magicRating = Number(this.actor.system?.attributes?.magic?.value) || 0;
    if ((baseSkillName === "Sorcery" || baseSkillName === "Conjuring") && magicRating <= 0) {
      ui.notifications.error("Sorcery and Conjuring require a Magic rating.");
      return;
    }

    // If the user edited the allocated rating without blurring, prefer the form value for this roll.
    const formElement = event.currentTarget.closest('form');
    if (formElement) {
      const allocatedRatingInput = formElement.querySelector(`input[name*="${skillId}"][name*="allocatedRating"]`);
      if (allocatedRatingInput) {
        const allocated = parseInt(allocatedRatingInput.value, 10);
        const currentAllocated = sr2SkillInferAllocatedRating(skill.system);
        if (Number.isFinite(allocated) && allocated !== currentAllocated) {
          const computed = sr2ComputeSkillRatingsFromAllocated({ ...skill.system, allocatedRating: allocated });
          skill = {
            ...skill,
            system: {
              ...skill.system,
              allocatedRating: computed.allocatedRating,
              baseRating: computed.baseRating,
              concentrationRating: computed.concentrationRating,
              specializationRating: computed.specializationRating
            }
          };
        }
      }
    }

    let skillRating = 0;
    let title = skill.name || skill.system.baseSkill || 'Unknown Skill';
    let rollDescription = '';

    console.log("SR2E | Rolling skill:", skill.name, "Type:", rollType);
    console.log("SR2E | Using skill data:", JSON.stringify(skill.system, null, 2));

    // Determine which rating to use based on roll type
    switch (rollType) {
      case 'base':
        skillRating = parseInt(skill.system.baseRating) || 0;
        rollDescription = 'Base Skill';
        title = skill.system.baseSkill || skill.name || 'Unknown Skill';
        if (skill.system.baseSkill === "Language" && skill.name) {
          title = skill.name;
        }
        console.log(`SR2E | Base skill roll: baseRating=${skill.system.baseRating}, parsed=${skillRating}`);
        break;
      case 'concentration':
        skillRating = parseInt(skill.system.concentrationRating) || 0;
        if (skill.system.concentration) {
          title = `${skill.system.baseSkill || skill.name} (${skill.system.concentration})`;
          rollDescription = 'Concentration';
          console.log(`SR2E | Concentration roll: concentrationRating=${skill.system.concentrationRating}, parsed=${skillRating}`);
        } else {
          ui.notifications.warn("No concentration selected for this skill.");
          return;
        }
        break;
      case 'specialization':
        skillRating = parseInt(skill.system.specializationRating) || 0;
        if (skill.system.specialization) {
          title = `${skill.system.baseSkill || skill.name} [${skill.system.specialization}]`;
          rollDescription = 'Specialization';
          console.log(`SR2E | Specialization roll: specializationRating=${skill.system.specializationRating}, parsed=${skillRating}`);
        } else {
          ui.notifications.warn("No specialization entered for this skill.");
          return;
        }
        break;
    }

    console.log("SR2E | Skill rating for roll:", skillRating, "Roll type:", rollType);

    // Calculate dice pool - skills roll only their rating in SR2E
    let dicePool = skillRating;

    // Ensure minimum dice pool of 1 (defaulting skill)
    if (dicePool < 1) {
      dicePool = 1;
      console.log("SR2E | Using defaulting dice pool of 1");
    }

    // Add roll type to title
    const finalTitle = `${title} (${rollDescription})`;

    console.log("SR2E | Final dice pool:", dicePool, "Title:", finalTitle);

    if (baseSkillName === "Conjuring") {
      await this._onConjuringRoll(dicePool, finalTitle);
      return;
    }

    // Show TN selection dialog and roll
    await this._showTargetNumberDialog(dicePool, finalTitle, 'skill', 4, null, { baseSkillName });
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

    return new Promise(resolve => {
      let isResolved = false;
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
              const force = Math.max(1, parseInt(html.find('input[name="spiritForce"]').val(), 10) || defaultForce);
              finish({ ok: true, spiritType, force });
            }
          },
          cancel: {
            icon: '<i class="fas fa-times"></i>',
            label: "Cancel",
            callback: () => finish({ ok: false })
          }
        },
        default: "continue",
        close: () => finish({ ok: false })
      });

      dialog.render(true);
    });
  }

  _sr2NormalizeSpiritType(value) {
    return String(value || "").trim().replace(/\s+/g, " ").toLowerCase();
  }

  _sr2DescribeConjuringDrain(force, charisma) {
    const f = Math.max(1, Number(force) || 1);
    const cha = Math.max(0, Number(charisma) || 0);

    if (cha <= 0) return "";

    if (f < (cha / 2)) return "L Stun";
    if (f <= cha) return "M Stun";
    if (f <= (2 * cha)) return "S Physical";
    return "D Physical";
  }

  async _onConjuringRoll(conjuringDicePool, title) {
    const details = await this._promptConjuringDetails();
    if (!details?.ok) return;

    const spiritType = String(details.spiritType || "").trim();
    const force = Math.max(1, Number(details.force) || 1);
    const normalizedSpiritType = this._sr2NormalizeSpiritType(spiritType);

    const focusPools = [];
    const equippedGear = this.actor.items.filter(i => i.type === "gear" && i.system?.equipped);
    for (const item of equippedGear) {
      const focus = sr2ParseFocusName(item.name);
      if (!focus) continue;
      if (focus.kind !== "spirit focus") continue;

      const focusSpiritType = this._sr2NormalizeSpiritType(item.system?.focus?.spiritType);
      if (!normalizedSpiritType || !focusSpiritType || focusSpiritType !== normalizedSpiritType) continue;

      focusPools.push({
        key: `focus-spirit-${item.id}`,
        name: `${item.name} (${item.system?.focus?.spiritType || spiritType})`,
        current: focus.rating,
        max: focus.rating,
        isActorPool: false
      });
    }

    const conjuringTitle = spiritType ? `${title}: ${spiritType} (Force ${force})` : `${title} (Force ${force})`;
    const conjuringResult = await this._showTargetNumberDialog(conjuringDicePool, conjuringTitle, "skill", force, null, {
      baseSkillName: "Conjuring",
      additionalPools: focusPools
    });
    if (!conjuringResult?.rolled) return;

    const focusDiceUsed = {};
    for (const { pool, dice } of (conjuringResult.poolsUsed || [])) {
      if (pool?.isActorPool) continue;
      if (!pool?.key) continue;
      focusDiceUsed[pool.key] = (focusDiceUsed[pool.key] || 0) + (Number(dice) || 0);
    }

    const remainingFocusPools = focusPools.map(pool => {
      const used = Number(focusDiceUsed[pool.key]) || 0;
      return {
        ...pool,
        current: Math.max(0, (Number(pool.current) || 0) - used)
      };
    }).filter(pool => (Number(pool.current) || 0) > 0);

    // SR2: Conjuring drain uses Charisma dice against TN = spirit Force (see Conjuring, p. 139).
    const charisma = Number(this.actor.system?.attributes?.charisma?.value) || 0;
    const drainDicePool = charisma;
    const drainCode = this._sr2DescribeConjuringDrain(force, charisma);
    const drainTitle = `Conjuring Drain Resistance${drainCode ? ` (${drainCode})` : ""}${spiritType ? `: ${spiritType}` : ""}`;

    await this._showTargetNumberDialog(drainDicePool, drainTitle, "drain", force, null, {
      baseSkillName: "Conjuring",
      additionalPools: remainingFocusPools
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
      'body': 'BOD',
      'quickness': 'QCK',
      'strength': 'STR',
      'charisma': 'CHA',
      'intelligence': 'INT',
      'willpower': 'WIL',
      'reaction': 'RCT'
    };

    if (modifierMap[attributeName]) {
      // Reaction is already derived (includes modifiers) in `SR2Actor.prepareDerivedData`.
      // Avoid double-counting RCT/attribute modifiers on Reaction tests.
      if (attributeName !== 'reaction') {
        modifierValue = modifiers[modifierMap[attributeName]] || 0;
      }
    }

    // Attributes roll their rating as dice pool (including modifiers)
    let dicePool = attributeValue + modifierValue;

    // Power Focus adds dice to Magic tests (spellcasters only)
    const isSpellcaster = Boolean(this.actor.system?.magic?.awakened) && !this.actor.system?.magic?.physicalAdept;
    const powerFocusBonus = isSpellcaster ? (Number(this.actor._sr2PowerFocusBonus) || 0) : 0;
    const appliesPowerFocus = attributeName === 'magic' && powerFocusBonus > 0;
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
    await this._showTargetNumberDialog(dicePool, title, 'attribute');
  }

  /**
   * Get available pools for dice rolling
   */
  _getAvailablePools(context = {}, rollActor = this.actor) {
    const pools = [];
    const poolData = rollActor.system.pools;
    const magicAttribute = rollActor.system.attributes.magic?.value || 0;
    const baseSkillName = String(context?.baseSkillName || "");
    const rollType = String(context?.rollType || "").toLowerCase();
    const excludeMagicPool = baseSkillName === "Conjuring";

    // Check for cyberdeck and control rig
    const hasCyberdeck = rollActor.items.some(item => 
      item.type === 'cyberware' && 
      item.name.toLowerCase().includes('cyberdeck')
    );
    
    const hasControlRig = rollActor.items.some(item => 
      item.type === 'cyberware' && 
      (item.name.toLowerCase().includes('control rig') || 
       item.name.toLowerCase().includes('vehicle control rig'))
    );

    const restrictToMagicPools = rollType === "spell" || rollType === "drain";

    // Define pool types with their visibility conditions
    const poolTypes = restrictToMagicPools
      ? [
          { key: 'karma', name: 'Karma Pool', maxKey: 'total', condition: true },
          { key: 'spell', name: 'Magic Pool', maxKey: 'max', condition: magicAttribute > 0 && !excludeMagicPool }
        ]
      : [
          { key: 'karma', name: 'Karma Pool', maxKey: 'total', condition: true },
          { key: 'combat', name: 'Combat Pool', maxKey: 'max', condition: true },
          { key: 'spell', name: 'Magic Pool', maxKey: 'max', condition: magicAttribute > 0 && !excludeMagicPool },
          { key: 'hacking', name: 'Hacking Pool', maxKey: 'max', condition: hasCyberdeck },
          { key: 'control', name: 'Control Pool', maxKey: 'max', condition: hasControlRig },
          { key: 'task', name: 'Task Pool', maxKey: 'max', condition: (poolData.task?.max || 0) > 0 },
          { key: 'astral', name: 'Astral Combat Pool', maxKey: 'max', condition: magicAttribute > 0 }
        ];

    poolTypes.forEach(poolType => {
      // Only add pools that meet their visibility condition
      if (poolType.condition) {
        const pool = poolData[poolType.key];
        if (pool) {
          pools.push({
            key: poolType.key,
            name: poolType.name,
            current: pool.current || 0,
            max: pool[poolType.maxKey] || 0,
            isActorPool: true
          });
        }
      }
    });

    return pools;
  }

  /**
   * Show Target Number selection dialog
   */
  async _showTargetNumberDialog(dicePool, title, rollType, defaultTN = 4, weaponData = null, context = {}) {
    const enrichedContext = { ...(context || {}), rollType };
    const rollActor = enrichedContext.rollActor || this.actor;
    const additionalPools = Array.isArray(enrichedContext?.additionalPools) ? enrichedContext.additionalPools : [];
    let availablePools = [
      ...this._getAvailablePools(enrichedContext, rollActor),
      ...additionalPools
    ];

    const allowedPoolKeys = Array.isArray(enrichedContext?.allowedPoolKeys) ? enrichedContext.allowedPoolKeys : null;
    if (allowedPoolKeys) {
      availablePools = availablePools.filter(pool => allowedPoolKeys.includes(pool.key));
    }

    const poolCaps = (enrichedContext?.poolCaps && typeof enrichedContext.poolCaps === "object") ? enrichedContext.poolCaps : {};
    const isRangedAttack = rollType === 'attack' && weaponData && weaponData.system.weaponType === 'ranged';

    const rangedModifiersSection = isRangedAttack ? `
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
    ` : '';

    const content = `
      <div class="target-number-dialog">
        <div class="roll-info">
          <h3>${title}</h3>
          <p><strong>Base Dice Pool:</strong> ${dicePool}</p>
        </div>
        
        <div class="target-number-section">
          <label for="target-number"><strong>Base Target Number:</strong></label>
          <select id="target-number" name="targetNumber">
            <option value="2" ${defaultTN === 2 ? 'selected' : ''}>2 - Trivial</option>
            <option value="3" ${defaultTN === 3 ? 'selected' : ''}>3 - Easy</option>
            <option value="4" ${defaultTN === 4 ? 'selected' : ''}>4 - Average</option>
            <option value="5" ${defaultTN === 5 ? 'selected' : ''}>5 - Fair</option>
            <option value="6" ${defaultTN === 6 ? 'selected' : ''}>6 - Hard</option>
            <option value="7" ${defaultTN === 7 ? 'selected' : ''}>7 - Extreme</option>
            <option value="8" ${defaultTN === 8 ? 'selected' : ''}>8 - Nearly Impossible</option>
            <option value="9" ${defaultTN === 9 ? 'selected' : ''}>9 - Impossible</option>
            <option value="10" ${defaultTN === 10 ? 'selected' : ''}>10 - Miraculous</option>
            <option value="11" ${defaultTN === 11 ? 'selected' : ''}>11</option>
            <option value="12" ${defaultTN === 12 ? 'selected' : ''}>12</option>
            <option value="13" ${defaultTN === 13 ? 'selected' : ''}>13</option>
            <option value="14" ${defaultTN === 14 ? 'selected' : ''}>14</option>
            <option value="15" ${defaultTN === 15 ? 'selected' : ''}>15</option>
            <option value="16" ${defaultTN === 16 ? 'selected' : ''}>16</option>
            <option value="17" ${defaultTN === 17 ? 'selected' : ''}>17</option>
            <option value="18" ${defaultTN === 18 ? 'selected' : ''}>18</option>
            <option value="19" ${defaultTN === 19 ? 'selected' : ''}>19</option>
            <option value="20" ${defaultTN === 20 ? 'selected' : ''}>20</option>
            <option value="21" ${defaultTN === 21 ? 'selected' : ''}>21</option>
            <option value="22" ${defaultTN === 22 ? 'selected' : ''}>22</option>
            <option value="23" ${defaultTN === 23 ? 'selected' : ''}>23</option>
            <option value="24" ${defaultTN === 24 ? 'selected' : ''}>24</option>
            <option value="25" ${defaultTN === 25 ? 'selected' : ''}>25</option>
            <option value="26" ${defaultTN === 26 ? 'selected' : ''}>26</option>
            <option value="27" ${defaultTN === 27 ? 'selected' : ''}>27</option>
            <option value="28" ${defaultTN === 28 ? 'selected' : ''}>28</option>
            <option value="29" ${defaultTN === 29 ? 'selected' : ''}>29</option>
            <option value="30" ${defaultTN === 30 ? 'selected' : ''}>30</option>
          </select>
        </div>

        ${rangedModifiersSection}

	        ${availablePools.length > 0 ? `
	        <div class="pool-dice-section">
	          <label><strong>Pool Dice (Optional):</strong></label>
	          ${availablePools.map(pool => `
              ${(() => {
                const cap = Number(poolCaps?.[pool.key]);
                const maxDice = Number.isFinite(cap) ? Math.max(0, Math.min(pool.current, cap)) : pool.current;
                const hasDice = maxDice > 0;
                const disabledAttr = hasDice ? "" : "disabled";
                const tooltipAttr = hasDice ? "" : 'title="No dice available (pool is empty)"';
                return `
	            <div class="pool-option">
	              <label>
	                <input type="checkbox" name="pool-${pool.key}" value="${pool.key}" class="pool-checkbox" ${disabledAttr} ${tooltipAttr}>
	                ${pool.name} (${pool.current}/${pool.max})
	              </label>
	              <input type="number" name="pool-${pool.key}-dice" 
	                     min="0" max="${maxDice}" value="0" disabled class="pool-dice-input">
	            </div>
                `;
              })()}
	          `).join('')}
	        </div>
	        ` : ''}
	      </div>
    `;

    return new Promise(resolve => {
      let isResolved = false;
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
          html.find('.pool-checkbox').change(function () {
            const isChecked = $(this).is(':checked');
            const poolKey = $(this).val();
            const diceInput = html.find(`input[name="pool-${poolKey}-dice"]`);
            const pool = availablePools.find(p => p.key === poolKey);

            if (isChecked) {
              diceInput.prop('disabled', false);
              // Only default to 1 if the pool has dice available
              if (pool && pool.current > 0) {
                diceInput.val(1);
              } else {
                diceInput.val(0);
              }
            } else {
              diceInput.prop('disabled', true);
              diceInput.val(0);
            }
          });

          // Clamp pool dice inputs to their max values (prevents typing above available dice)
          html.find('.pool-dice-input').on('input change', function () {
            const rawMax = parseInt($(this).attr('max'), 10);
            const max = Number.isFinite(rawMax) ? rawMax : 0;

            let rawValue = parseInt($(this).val(), 10);
            if (!Number.isFinite(rawValue)) rawValue = 0;

            const clamped = Math.max(0, Math.min(rawValue, max));
            if (String($(this).val()) !== String(clamped)) {
              $(this).val(clamped);
            }
          });

          // Handle ranged modifier calculations
          if (isRangedAttack) {
            const updateTotalModifier = () => {
              let totalModifier = 0;
              html.find('.modifier-select').each(function() {
                totalModifier += parseInt($(this).val()) || 0;
              });
              html.find('#total-tn-modifier').text(totalModifier >= 0 ? `+${totalModifier}` : `${totalModifier}`);
            };

            html.find('.modifier-select').change(updateTotalModifier);
            updateTotalModifier(); // Initial calculation
          }
        },
        buttons: {
	          roll: {
	            icon: '<i class="fas fa-dice-d6"></i>',
	            label: "Roll",
	            callback: async (html) => {
	              const baseTargetNumber = parseInt(html.find('#target-number').val());
	              let finalDicePool = dicePool;

              // Calculate ranged combat modifiers if applicable
              let tnModifier = 0;
              let modifierDetails = [];
            
              if (isRangedAttack) {
                const recoilMod = parseInt(html.find('select[name="recoil-modifier"]').val()) || 0;
                const visibilityMod = parseInt(html.find('select[name="visibility-modifier"]').val()) || 0;
                const coverMod = parseInt(html.find('select[name="cover-modifier"]').val()) || 0;
                const multipleTargetsMod = parseInt(html.find('select[name="multiple-targets-modifier"]').val()) || 0;
                const targetMovementMod = parseInt(html.find('select[name="target-movement-modifier"]').val()) || 0;
                const attackerMeleeMod = parseInt(html.find('select[name="attacker-melee-modifier"]').val()) || 0;
                const attackerMovementMod = parseInt(html.find('select[name="attacker-movement-modifier"]').val()) || 0;
                const accessoriesMod = parseInt(html.find('select[name="accessories-modifier"]').val()) || 0;
                const otherMod = parseInt(html.find('select[name="other-modifier"]').val()) || 0;

                tnModifier = recoilMod + visibilityMod + coverMod + multipleTargetsMod + 
                            targetMovementMod + attackerMeleeMod + attackerMovementMod + 
                            accessoriesMod + otherMod;

                // Build modifier details for display
                if (recoilMod !== 0) modifierDetails.push(`Recoil: ${recoilMod >= 0 ? '+' : ''}${recoilMod}`);
                if (visibilityMod !== 0) modifierDetails.push(`Visibility: ${visibilityMod >= 0 ? '+' : ''}${visibilityMod}`);
                if (coverMod !== 0) modifierDetails.push(`Cover: ${coverMod >= 0 ? '+' : ''}${coverMod}`);
                if (multipleTargetsMod !== 0) modifierDetails.push(`Multiple Targets: ${multipleTargetsMod >= 0 ? '+' : ''}${multipleTargetsMod}`);
                if (targetMovementMod !== 0) modifierDetails.push(`Target Movement: ${targetMovementMod >= 0 ? '+' : ''}${targetMovementMod}`);
                if (attackerMeleeMod !== 0) modifierDetails.push(`Attacker in Melee: ${attackerMeleeMod >= 0 ? '+' : ''}${attackerMeleeMod}`);
                if (attackerMovementMod !== 0) modifierDetails.push(`Attacker Movement: ${attackerMovementMod >= 0 ? '+' : ''}${attackerMovementMod}`);
                if (accessoriesMod !== 0) modifierDetails.push(`Accessories: ${accessoriesMod >= 0 ? '+' : ''}${accessoriesMod}`);
                if (otherMod !== 0) modifierDetails.push(`Other: ${otherMod >= 0 ? '+' : ''}${otherMod}`);
              }

              const finalTargetNumber = Math.max(2, baseTargetNumber + tnModifier);

              // Handle pool dice
              const poolsUsed = [];
              let totalPoolDice = 0;

	              availablePools.forEach(pool => {
	                const checkbox = html.find(`input[name="pool-${pool.key}"]`);
	                const diceInput = html.find(`input[name="pool-${pool.key}-dice"]`);
	
	                if (checkbox.is(':checked')) {
	                  const diceUsed = parseInt(diceInput.val()) || 0;
	                  // Validate that we don't use more dice than available
	                  const cap = Number(poolCaps?.[pool.key]);
	                  const maxFromCap = Number.isFinite(cap) ? cap : Infinity;
	                  const actualDiceUsed = Math.min(diceUsed, pool.current, maxFromCap);
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
                finalTitle += ` [Base TN ${baseTargetNumber} ${tnModifier >= 0 ? '+' : ''}${tnModifier}]`;
              }
	              if (poolsUsed.length > 0) {
	                const poolInfo = poolsUsed.map(({ pool, dice }) => `${dice} ${pool.name}`).join(', ');
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

	              const rollResult = await rollActor.rollDice(finalDicePool, finalTargetNumber, finalTitle, { sources });
	
	              // Show modifier breakdown in chat if there were ranged modifiers
	              if (isRangedAttack && modifierDetails.length > 0) {
	                const modifierChatData = {
	                  user: game.user.id,
	                  speaker: ChatMessage.getSpeaker({ actor: rollActor }),
	                  content: `
	                    <div class="ranged-modifiers-breakdown">
	                      <h4>Ranged Combat Modifiers Applied:</h4>
	                      <ul>
                        ${modifierDetails.map(detail => `<li>${detail}</li>`).join('')}
                      </ul>
                      <p><strong>Total TN Modifier: ${tnModifier >= 0 ? '+' : ''}${tnModifier}</strong></p>
                    </div>
                  `
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
                poolsUsed
              });
            }
          },
          cancel: {
            icon: '<i class="fas fa-times"></i>',
            label: "Cancel",
            callback: () => finish({ rolled: false })
          }
        },
        default: "roll",
        close: () => finish({ rolled: false })
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
   * Handle spell lock assignment and toggling
   */
  async _onSpellLockToggle(event) {
    event.preventDefault();

    const spellId = event.currentTarget.dataset.itemId;
    const spell = this.actor.items.get(spellId);
    if (!spell || spell.type !== "spell") return;

    const spellLock = spell.system?.spellLock ?? {};
    const isAssigned = Boolean(spellLock.assigned);
    const isEnabled = Boolean(spellLock.enabled);

    if (!isAssigned) {
      const capacity = sr2ComputeSpellLockCapacity(this.actor.items);
      if (capacity.remaining <= 0) {
        if (capacity.total <= 0) {
          ui.notifications.error("No Spell Locks found. Add Spell Lock gear to assign one to a spell.");
        } else {
          ui.notifications.error(`All Spell Locks are already assigned (${capacity.assigned}/${capacity.total}).`);
        }
        return;
      }

      const confirmed = game.settings.get("core", "noCanvas") ||
        confirm(`Are you sure you want to use a spell lock on ${spell.name}?`);

      if (!confirmed) return;

      try {
        await spell.update({
          "system.spellLock.assigned": true,
          "system.spellLock.enabled": true
        });
        await this._syncSpellLockEffects();
        if (this.rendered) this.render(false);
      } catch (error) {
        console.error("SR2E | Failed to assign Spell Lock", error);
        ui.notifications.error("Failed to assign Spell Lock (see console).");
      }

      return;
    }

    try {
      await spell.update({ "system.spellLock.enabled": !isEnabled });
      await this._syncSpellLockEffects();
      if (this.rendered) this.render(false);
    } catch (error) {
      console.error("SR2E | Failed to toggle Spell Lock", error);
      ui.notifications.error("Failed to toggle Spell Lock (see console).");
    }
  }

  async _syncSpellLockEffects() {
    try {
      const enabledLockedSpells = this.actor.items.filter(i =>
        i.type === "spell" &&
        i.system?.spellLock?.assigned &&
        i.system?.spellLock?.enabled
      );

      const hasInvisibility = enabledLockedSpells.some(spell =>
        String(spell.name || "").toLowerCase().includes("invisibility")
      );

      const existingInvisibility = this.actor.effects.find(e =>
        e.getFlag("shadowrun2e", "spellLockInvisibilityEffect") === true
      );

      if (!hasInvisibility) {
        if (existingInvisibility) await existingInvisibility.delete();
        return;
      }

      if (!existingInvisibility) {
        await this.actor.createEmbeddedDocuments("ActiveEffect", [{
          name: "Spell Lock: Invisibility",
          icon: "icons/svg/invisible.svg",
          changes: [],
          disabled: false,
          flags: { shadowrun2e: { spellLockInvisibilityEffect: true } }
        }]);
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
      const magicRating = Number(this.actor.system.attributes.magic.effective ?? this.actor.system.attributes.magic.value) || 0;
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
      const spellClassLabel = spellClass ? (SR2_SPELL_CLASS_LABELS[spellClass] || spellClass) : "";

      const targets = Array.from(game.user?.targets ?? []);
      const resistAttributeLabel = sr2InferSpellResistFromType(spell.system?.type);
      const resistAttributeKey = resistAttributeLabel ? resistAttributeLabel.toLowerCase() : "";
      let defaultCastTargetNumber = 4;
      if (targets.length === 1 && resistAttributeKey) {
        const targetActor = targets[0]?.actor;
        const resistAttributeValue = Number(targetActor?.system?.attributes?.[resistAttributeKey]?.value);
        if (Number.isFinite(resistAttributeValue) && resistAttributeValue > 0) {
          defaultCastTargetNumber = sr2Clamp(resistAttributeValue, 2, 30);
        }
      }

      const focusPools = [];
      const equippedGear = this.actor.items.filter(i => i.type === "gear" && i.system?.equipped);
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
            isActorPool: false
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
            isActorPool: false
          });
        }
      }

      // Show TN selection dialog and roll for spellcasting
      const castResult = await this._showTargetNumberDialog(dicePool, title, 'spell', defaultCastTargetNumber, null, {
        baseSkillName: "Sorcery",
        additionalPools: focusPools
      });
      if (!castResult?.rolled) return;

      // Calculate drain
      const misfireDrainMod = castResult.rollResult?.isCriticalFailure ? 2 : 0;
      const drainValue = Math.max(2, this._calculateDrain(spell.system.drain, force) + misfireDrainMod);
      const drainPool = Number(this.actor.system.attributes.willpower.value) || 0;

      // Show TN selection dialog and roll drain resistance
      const drainTitle = `Drain Resistance for ${spell.name}`;

      const focusDiceUsed = {};
      for (const { pool, dice } of (castResult.poolsUsed || [])) {
        if (pool?.isActorPool) continue;
        if (!pool?.key) continue;
        focusDiceUsed[pool.key] = (focusDiceUsed[pool.key] || 0) + (Number(dice) || 0);
      }

      const remainingFocusPools = focusPools.map(pool => {
        const used = Number(focusDiceUsed[pool.key]) || 0;
        return {
          ...pool,
          current: Math.max(0, (Number(pool.current) || 0) - used)
        };
      });

      const drainResult = await this._showTargetNumberDialog(drainPool, drainTitle, 'drain', drainValue, null, {
        baseSkillName: "Sorcery",
        additionalPools: remainingFocusPools
      });
      if (!drainResult?.rolled) return;

      const baseDrainLevel = sr2InferSpellDamageLevelFromDrain(spell.system.drain) || "";
      const drainRollSuccesses = Number(drainResult?.rollResult?.successes) || 0;
      if (!baseDrainLevel) return;

      // SR2: Every 2 successes stages Drain down 1 level.
      const drainStageDown = Math.floor(drainRollSuccesses / 2);
      const levels = ["L", "M", "S", "D"];
      const baseIndex = levels.indexOf(baseDrainLevel);
      if (baseIndex < 0) return;
      const finalIndex = Math.max(-1, baseIndex - drainStageDown);
      if (finalIndex < 0) return; // Staged below Light: no Drain.

      const drainBoxesByLevel = { L: 1, M: 3, S: 6, D: 10 };
      const finalLevel = levels[finalIndex];
      const drainBoxes = drainBoxesByLevel[finalLevel] ?? 0;
      if (drainBoxes <= 0) return;

      const isPhysicalDrain = force > magicRating;
      const damageType = isPhysicalDrain ? "physical" : "stun";
      const otherType = isPhysicalDrain ? "stun" : "physical";

      const currentPrimary = Number(this.actor.system?.health?.[damageType]?.value) || 0;
      const currentOther = Number(this.actor.system?.health?.[otherType]?.value) || 0;
      const maxPrimary = Number(this.actor.system?.health?.[damageType]?.max) || 10;
      const maxOther = Number(this.actor.system?.health?.[otherType]?.max) || 10;

      let nextPrimary = currentPrimary + drainBoxes;
      let carry = 0;

      // SR2: excess Stun carries into Physical (overflow handling is limited by current 10-box tracks).
      if (damageType === "stun" && nextPrimary > maxPrimary) {
        carry = nextPrimary - maxPrimary;
        nextPrimary = maxPrimary;
      }

      const updateData = { [`system.health.${damageType}.value`]: Math.max(0, Math.min(maxPrimary, nextPrimary)) };
      if (carry > 0) {
        const nextOther = Math.max(0, Math.min(maxOther, currentOther + carry));
        updateData[`system.health.${otherType}.value`] = nextOther;
      }

      await this.actor.update(updateData);
    } catch (error) {
      console.error("SR2E | Failed to cast spell", error);
      ui.notifications.error("Spell casting failed (see console).");
    }
  }

  /**
   * Get the highest Sorcery skill rating
   */
  _getHighestSorcerySkill() {
    const sorcerySkills = this.actor.items.filter(i =>
      i.type === 'skill' && i.system.baseSkill === 'Sorcery'
    );

    if (sorcerySkills.length === 0) return 0;

    return Math.max(...sorcerySkills.map(skill => {
      const baseRating = skill.system.baseRating || 0;
      const concRating = skill.system.concentrationRating || 0;
      const specRating = skill.system.specializationRating || 0;
      return Math.max(baseRating, concRating, specRating);
    }));
  }

  /**
   * Handle weapon attacks
   */
  async _onWeaponAttack(event) {
    event.preventDefault();

    const weaponId = event.currentTarget.dataset.itemId;
    const weapon = this.actor.items.get(weaponId);
    if (!weapon) return;

    const isRanged = weapon.system.weaponType === "ranged";
    const { skillRating, skillName, rollDescription } = sr2GetWeaponSkillData(this.actor, weapon, { notify: true });
    const dicePool = Math.max(0, Number(skillRating) || 0);

    const targets = Array.from(game.user?.targets ?? []);
    const targetToken = targets.length === 1 ? targets[0] : null;
    const targetActor = targetToken?.actor || null;

    const resolveErrorChat = async (message) => {
      await ChatMessage.create({
        user: game.user.id,
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        content: `<div class="sr2-combat-resolution"><p>${message}</p></div>`
      });
    };

    const consumeAmmo = async () => {
      if (!isRanged) return;
      if (!weapon.system.ammo || weapon.system.ammo.current <= 0) return;

      const newAmmo = weapon.system.ammo.current - 1;
      await weapon.update({ "system.ammo.current": newAmmo });
      if (newAmmo === 0) ui.notifications.warn(`${weapon.name} is out of ammunition!`);
    };

    if (!targetToken || !targetActor) {
      const attackType = isRanged ? "Ranged Attack" : "Melee Attack";
      const subtitle = dicePool > 0 ? `${skillName} (${rollDescription})` : "Defaulting";
      const attackResult = await this._showTargetNumberDialog(dicePool, `${attackType} with ${weapon.name} - ${subtitle}`, "attack", 4, weapon, {
        allowedPoolKeys: ["combat", "karma"],
        poolCaps: { combat: dicePool }
      });
      if (!attackResult?.rolled) return;

      await ChatMessage.create({
        user: game.user.id,
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        content: `
          <div class="sr2-combat-resolution">
            <h3>${attackType}: ${weapon.name}</h3>
            <p><strong>Damage Code:</strong> ${weapon.system.damage || "1L"}</p>
            <p><em>Target exactly one token to auto-resolve damage/resistance.</em></p>
          </div>
        `
      });

      await consumeAmmo();
      return;
    }

    if (isRanged) {
      let baseTargetNumber = 4;
      let rangeLabel = "";
      let distance = null;
      let distanceUnits = "";

      const attackerToken = canvas?.tokens?.controlled?.find(t => t.actor?.id === this.actor.id) || (this.actor.getActiveTokens?.(true)?.[0] ?? null);
      if (canvas?.grid?.size && canvas?.scene?.grid?.distance && attackerToken?.center && targetToken?.center) {
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

          if (minRange > 0 && distance < minRange) {
            baseTargetNumber = 9;
            rangeLabel = `Below Minimum (${minRange}+)`;
          } else if (distance <= shortMax) {
            baseTargetNumber = 4;
            rangeLabel = "Short";
          } else if (distance <= mediumMax) {
            baseTargetNumber = 5;
            rangeLabel = "Medium";
          } else if (distance <= longMax) {
            baseTargetNumber = 6;
            rangeLabel = "Long";
          } else if (distance <= extremeMax) {
            baseTargetNumber = 9;
            rangeLabel = "Extreme";
          } else {
            baseTargetNumber = 9;
            rangeLabel = "Out of Range";
          }
        }
      } catch (err) {
        // If range data fails, fall back to TN 4.
      }

      const subtitle = dicePool > 0 ? `${skillName} (${rollDescription})` : "Defaulting";
      const rangeSuffix = rangeLabel && Number.isFinite(distance)
        ? ` [${rangeLabel} ${distance.toFixed(1)}${distanceUnits ? ` ${distanceUnits}` : ""}]`
        : (rangeLabel ? ` [${rangeLabel}]` : "");
      const rangeText = rangeLabel && Number.isFinite(distance)
        ? `${rangeLabel} ${distance.toFixed(1)}${distanceUnits ? ` ${distanceUnits}` : ""}`
        : rangeLabel;

      const attackResult = await this._showTargetNumberDialog(dicePool, `Ranged Attack with ${weapon.name} - ${subtitle}${rangeSuffix}`, "attack", baseTargetNumber, weapon, {
        allowedPoolKeys: ["combat", "karma"],
        poolCaps: { combat: dicePool }
      });
      if (!attackResult?.rolled) return;

      const attackerSuccesses = Number(attackResult.rollResult?.successes) || 0;
      if (attackerSuccesses <= 0) {
        await resolveErrorChat(`<strong>${this.actor.name}</strong> misses with <strong>${weapon.name}</strong>.`);
        await consumeAmmo();
        return;
      }

      const attackerStrength = sr2GetModifiedAttribute(this.actor, "strength");
      const parsed = sr2ParseDamageCode(weapon.system.damage || "", { strength: attackerStrength });
      if (!parsed) {
        await resolveErrorChat(`Cannot auto-resolve: unparseable damage code <strong>${weapon.system.damage || ""}</strong>.`);
        await consumeAmmo();
        return;
      }

      const armorRatings = sr2GetArmorRatings(targetActor);
      const rangeType = String(weapon.system.rangeType || "");
      const usesImpactArmor = ["(GRLN)", "(MISLN)"].includes(rangeType.toUpperCase()) || /grenade|missile|rocket/i.test(String(weapon.name || ""));
      const armorValue = usesImpactArmor ? armorRatings.impact : armorRatings.ballistic;

      const resistTargetNumber = Math.max(2, parsed.power - armorValue);
      const bodyDice = sr2GetModifiedAttribute(targetActor, "body");

      const resistResult = await this._showTargetNumberDialog(
        bodyDice,
        `${targetActor.name} Damage Resistance vs ${weapon.name}`,
        "damage-resistance",
        resistTargetNumber,
        null,
        {
          rollActor: targetActor,
          allowedPoolKeys: ["combat", "karma"]
        }
      );
      if (!resistResult?.rolled) return;

      const defenderSuccesses = Number(resistResult.rollResult?.successes) || 0;
      const defenderCombatPoolSuccesses = Number(resistResult.rollResult?.successesBySource?.combat) || 0;

      const cleanMiss = defenderCombatPoolSuccesses > attackerSuccesses;
      let finalLevel = null;
      let boxes = 0;

      if (!cleanMiss) {
        const net = attackerSuccesses - defenderSuccesses;
        const stages = Math.floor(Math.abs(net) / 2);
        const stageDelta = net > 0 ? stages : (net < 0 ? -stages : 0);
        finalLevel = sr2StageDamageLevel(parsed.level, stageDelta);
        if (finalLevel) boxes = SR2_DAMAGE_BOXES_BY_LEVEL[finalLevel] ?? 0;
      }

      let applied = false;
      if (finalLevel && boxes > 0) {
        try {
          applied = await sr2ApplyDamageToActor(targetActor, parsed.damageType, boxes);
        } catch (error) {
          console.error("SR2E | Failed to apply ranged damage", error);
        }
      }

      const resultLabel = cleanMiss
        ? `Clean miss (defender Combat Pool successes ${defenderCombatPoolSuccesses} > attacker ${attackerSuccesses}).`
        : (finalLevel ? `${finalLevel} ${parsed.damageType === "stun" ? "Stun" : "Physical"} (${boxes} boxes)` : "No damage");

      await ChatMessage.create({
        user: game.user.id,
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        content: `
          <div class="sr2-combat-resolution">
            <h3>Ranged Combat: ${this.actor.name} → ${targetActor.name}</h3>
            <p><strong>Weapon:</strong> ${weapon.name} (${weapon.system.damage || "1L"})</p>
            ${rangeText ? `<p><strong>Range:</strong> ${rangeText}</p>` : ""}
            <p><strong>Attack successes:</strong> ${attackerSuccesses}</p>
            <p><strong>Resistance TN:</strong> ${resistTargetNumber} (= ${parsed.power} - ${armorValue})</p>
            <p><strong>Resistance successes:</strong> ${defenderSuccesses} (Combat Pool-only: ${defenderCombatPoolSuccesses})</p>
            <p><strong>Result:</strong> ${resultLabel}${finalLevel && boxes > 0 ? (applied ? "" : " (not applied)") : ""}</p>
          </div>
        `
      });

      await consumeAmmo();
      return;
    }

    const equippedMeleeWeapons = targetActor.items.filter(i =>
      i.type === "weapon" && i.system?.weaponType === "melee" && i.system?.equipped
    );
    const defenderWeapon = equippedMeleeWeapons.length > 0 ? equippedMeleeWeapons[0] : null;
    const defenderWeaponName = defenderWeapon?.name || "Unarmed";

    let defenderSkillRating = 0;
    let defenderSkillName = "Unarmed Combat";
    let defenderRollDescription = "Unarmed";

    if (defenderWeapon) {
      const defenderSkillData = sr2GetWeaponSkillData(targetActor, defenderWeapon, { notify: false });
      defenderSkillRating = Math.max(0, Number(defenderSkillData.skillRating) || 0);
      defenderSkillName = defenderSkillData.skillName || defenderSkillName;
      defenderRollDescription = defenderSkillData.rollDescription || "Base Skill";
    } else {
      const unarmedSkill = targetActor.items.find(i => i.type === "skill" && i.system?.baseSkill === "Unarmed Combat");
      if (unarmedSkill) {
        defenderSkillRating = Math.max(0, Number(unarmedSkill.system?.baseRating) || 0);
        defenderSkillName = unarmedSkill.name || "Unarmed Combat";
        defenderRollDescription = "Base Skill";
      }
    }

    const attackerReach = (Number(this.actor.system?.details?.traits?.reach) || 0) + (Number(weapon.system?.reach) || 0);
    const defenderReach = (Number(targetActor.system?.details?.traits?.reach) || 0) + (Number(defenderWeapon?.system?.reach) || 0);
    const reachDelta = attackerReach - defenderReach;

    const attackerMeleeTN = Math.max(2, 4 - reachDelta);
    const defenderMeleeTN = Math.max(2, 4 + reachDelta);

    const attackerSubtitle = dicePool > 0 ? `${skillName} (${rollDescription})` : "Defaulting";
    const reachNote = reachDelta !== 0 ? ` [Reach Δ ${reachDelta >= 0 ? "+" : ""}${reachDelta}]` : "";

    const attackerTest = await this._showTargetNumberDialog(dicePool, `Melee Attack (${weapon.name}) - ${attackerSubtitle}${reachNote}`, "attack", attackerMeleeTN, weapon, {
      allowedPoolKeys: ["combat", "karma"],
      poolCaps: { combat: dicePool }
    });
    if (!attackerTest?.rolled) return;

    const defenderTest = await this._showTargetNumberDialog(defenderSkillRating, `Melee Defense (${defenderWeaponName}) - ${defenderSkillName} (${defenderRollDescription})${reachNote}`, "attack", defenderMeleeTN, defenderWeapon, {
      rollActor: targetActor,
      allowedPoolKeys: ["combat", "karma"],
      poolCaps: { combat: defenderSkillRating }
    });
    if (!defenderTest?.rolled) return;

    const attackerSuccesses = Number(attackerTest.rollResult?.successes) || 0;
    const defenderSuccesses = Number(defenderTest.rollResult?.successes) || 0;

    const attackerHits = attackerSuccesses >= defenderSuccesses;
    const hitterActor = attackerHits ? this.actor : targetActor;
    const hitActor = attackerHits ? targetActor : this.actor;
    const hitterWeapon = attackerHits ? weapon : defenderWeapon;
    const hitterWeaponName = attackerHits ? weapon.name : defenderWeaponName;
    const hitterSuccesses = attackerHits ? attackerSuccesses : defenderSuccesses;
    const otherSuccesses = attackerHits ? defenderSuccesses : attackerSuccesses;
    const stageUp = Math.floor(Math.max(0, hitterSuccesses - otherSuccesses) / 2);

    const hitterStrength = sr2GetModifiedAttribute(hitterActor, "strength");
    const rawDamageCode = hitterWeapon ? (hitterWeapon.system.damage || "") : "(STR)M Stun";
    const parsed = sr2ParseDamageCode(rawDamageCode, { strength: hitterStrength });
    if (!parsed) {
      await resolveErrorChat(`Cannot auto-resolve: unparseable melee damage code <strong>${rawDamageCode}</strong>.`);
      return;
    }

    const stagedLevel = sr2StageDamageLevel(parsed.level, stageUp) || parsed.level;
    const armorRatings = sr2GetArmorRatings(hitActor);
    const resistTargetNumber = Math.max(2, parsed.power - armorRatings.impact);
    const bodyDice = sr2GetModifiedAttribute(hitActor, "body");

    const resistResult = await this._showTargetNumberDialog(
      bodyDice,
      `${hitActor.name} Damage Resistance vs ${hitterWeaponName}`,
      "damage-resistance",
      resistTargetNumber,
      null,
      {
        rollActor: hitActor,
        allowedPoolKeys: ["combat", "karma"]
      }
    );
    if (!resistResult?.rolled) return;

    const resistSuccesses = Number(resistResult.rollResult?.successes) || 0;
    const stageDown = Math.floor(resistSuccesses / 2);
    const finalLevel = sr2StageDamageLevel(stagedLevel, -stageDown);
    const boxes = finalLevel ? (SR2_DAMAGE_BOXES_BY_LEVEL[finalLevel] ?? 0) : 0;

    let applied = false;
    if (finalLevel && boxes > 0) {
      try {
        applied = await sr2ApplyDamageToActor(hitActor, parsed.damageType, boxes);
      } catch (error) {
        console.error("SR2E | Failed to apply melee damage", error);
      }
    }

    const resultLabel = finalLevel
      ? `${finalLevel} ${parsed.damageType === "stun" ? "Stun" : "Physical"} (${boxes} boxes)`
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
          <p><strong>Damage staged up:</strong> +${stageUp} level(s) → ${stagedLevel}</p>
          <p><strong>Resistance TN:</strong> ${resistTargetNumber} (= ${parsed.power} - ${armorRatings.impact})</p>
          <p><strong>Resistance successes:</strong> ${resistSuccesses}</p>
          <p><strong>Result:</strong> ${resultLabel}${finalLevel && boxes > 0 ? (applied ? "" : " (not applied)") : ""}</p>
        </div>
      `
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
      const response = await fetch('/systems/shadowrun2e/data/ranges.json');
      this.rangesData = await response.json();
      return this.rangesData;
    } catch (error) {
      console.error('Failed to load ranges data:', error);
      return null;
    }
  }

  /**
   * Display range bands for selected weapon
   */
  _displayRangeBands(rangeData) {
    const rangeBands = document.getElementById('range-bands');
    if (!rangeBands) return;

    document.getElementById('short-range').textContent = rangeData.short;
    document.getElementById('medium-range').textContent = rangeData.medium;
    document.getElementById('long-range').textContent = rangeData.long;
    document.getElementById('extreme-range').textContent = rangeData.extreme;

    rangeBands.style.display = 'grid';
  }

  /**
   * Hide range bands
   */
  _hideRangeBands() {
    const rangeBands = document.getElementById('range-bands');
    if (rangeBands) {
      rangeBands.style.display = 'none';
    }

    const rangeCategory = document.getElementById('range-category');
    const rangeModifier = document.getElementById('range-modifier');
    if (rangeCategory) rangeCategory.textContent = '-';
    if (rangeModifier) rangeModifier.textContent = '';
  }

  /**
   * Calculate and display range category based on distance
   */
  async _calculateRangeCategory() {
    const weaponSelect = document.getElementById('range-weapon-select');
    const distanceInput = document.getElementById('range-distance');
    const rangeCategorySpan = document.getElementById('range-category');
    const rangeModifierSpan = document.getElementById('range-modifier');

    if (!weaponSelect || !distanceInput || !rangeCategorySpan) return;

    const weaponId = weaponSelect.value;
    const rangeType = weaponSelect.selectedOptions[0]?.dataset.rangeType;
    const distance = parseInt(distanceInput.value);

    if (!weaponId || !rangeType || !distance) {
      rangeCategorySpan.textContent = '-';
      rangeModifierSpan.textContent = '';
      return;
    }

    const rangesData = await this._loadRangesData();
    if (!rangesData || !rangesData[rangeType]) return;

    const ranges = rangesData[rangeType];
    let category = '';
    let modifier = '';
    let categoryClass = '';

    if (distance <= ranges.short) {
      category = 'Short';
      modifier = '(TN 4)';
      categoryClass = 'short';
    } else if (distance <= ranges.medium) {
      category = 'Medium';
      modifier = '(TN 5)';
      categoryClass = 'medium';
    } else if (distance <= ranges.long) {
      category = 'Long';
      modifier = '(TN 6)';
      categoryClass = 'long';
    } else if (distance <= ranges.extreme) {
      category = 'Extreme';
      modifier = '(TN 9)';
      categoryClass = 'extreme';
    } else {
      category = 'Out of Range';
      modifier = '(Impossible)';
      categoryClass = 'impossible';
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
      const browser = new SR2ItemBrowser(this.actor, 'totem', {});

      // Override the default item creation to handle totem selection
      const originalAddItem = browser.addItem;
      browser.addItem = async (item) => {
        // First, unselect any existing totems
        const existingTotems = this.actor.items.filter(i => i.type === 'totem');
        for (const existingTotem of existingTotems) {
          await existingTotem.update({ 'system.isSelected': false });
        }

        // Then add the new totem and mark it as selected
        const newItem = await originalAddItem.call(browser, item);
        if (newItem) {
          await newItem.update({ 'system.isSelected': true });
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
        const currentEssence = round2(this.actor.system.attributes.essence.value || 6);
        const remainingEssence = round2(currentEssence - essenceCost);

        if (remainingEssence < 0.1) {
          // Prevent installation
          checkbox.checked = false;
          ui.notifications.error(
            `Cannot install ${item.name}. Essence cost (${essenceCost}) would reduce your Essence below 0.1. ` +
            `Current Essence: ${currentEssence.toFixed(2)}, Required: ${essenceCost.toFixed(2)}`
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
            no: () => false
          });

          if (!confirm) {
            checkbox.checked = false;
            return;
          }
        }

        // Install the cyberware
        await item.update({ 'system.installed': true });
        ui.notifications.info(`${item.name} installed. Essence reduced by ${essenceCost}.`);

      } else {
        // Uninstall the cyberware
        const confirm = await Dialog.confirm({
          title: "Cyberware Removal",
          content: `<p>Are you sure you want to remove <strong>${item.name}</strong>?</p>
                   <p>This will restore <strong>${essenceCost}</strong> Essence.</p>
                   <p><em>Note: In Shadowrun, cyberware removal typically requires surgery and may have complications.</em></p>`,
          yes: () => true,
          no: () => false
        });

        if (!confirm) {
          checkbox.checked = true;
          return;
        }

        await item.update({ 'system.installed': false });
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
        const installedBioware = this.actor.items.filter(i =>
          i.type === 'bioware' && i.system.installed && i._id !== itemId
        );
        const currentBioIndex = installedBioware.reduce((total, bio) => {
          return total + (parseFloat(bio.system.bioIndex) || 0);
        }, 0);

        // Bio Index limit is typically equal to Essence (rounded down)
        const essenceValue = Math.floor(this.actor.system.attributes.essence.value || 6);
        const remainingBioIndex = essenceValue - currentBioIndex;

        if (bioIndex > remainingBioIndex) {
          // Prevent installation
          checkbox.checked = false;
          ui.notifications.error(
            `Cannot install ${item.name}. Bio Index cost (${bioIndex}) exceeds available capacity. ` +
            `Available Bio Index: ${remainingBioIndex.toFixed(2)}, Required: ${bioIndex.toFixed(2)}`
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
            no: () => false
          });

          if (!confirm) {
            checkbox.checked = false;
            return;
          }
        }

        // Install the bioware
        await item.update({ 'system.installed': true });
        ui.notifications.info(`${item.name} installed. Bio Index used: ${bioIndex}.`);

      } else {
        // Uninstall the bioware
        const confirm = await Dialog.confirm({
          title: "Bioware Removal",
          content: `<p>Are you sure you want to remove <strong>${item.name}</strong>?</p>
                   <p>This will free up <strong>${bioIndex}</strong> Bio Index.</p>
                   <p><em>Note: In Shadowrun, bioware removal typically requires surgery and may have complications.</em></p>`,
          yes: () => true,
          no: () => false
        });

        if (!confirm) {
          checkbox.checked = true;
          return;
        }

        await item.update({ 'system.installed': false });
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
   * Calculate drain value from drain code
   */
  _calculateDrain(drainCode, force) {
    if (!drainCode) return 4;

    // Parse drain codes like "(F/2)M", "[(F/2)+1]S", etc.
    let drainValue = 4; // Default

    try {
      // Replace F with force value
      let formula = drainCode.replace(/F/g, force.toString());

      // Remove brackets and damage level indicators
      formula = formula.replace(/[\[\]LMSD]/g, '');

      // Evaluate the mathematical expression
      drainValue = Math.max(2, Math.floor(eval(formula)));
    } catch (error) {
      console.warn(`Could not parse drain code: ${drainCode}`, error);
    }

    return drainValue;
  }

  /**
   * Handle damage box clicks
   */
  async _onDamageBoxClick(event) {
    event.preventDefault();

    // Find the actual damage box element (in case user clicked on a child element)
    let element = event.currentTarget;
    if (!element.classList.contains('damage-box')) {
      element = element.closest('.damage-box');
    }

    if (!element) {
      console.error('SR2E | Could not find damage box element');
      return;
    }

    try {
      // Try to get box number from multiple sources
      let boxNumberStr = element.dataset.boxNumber || element.getAttribute('data-box-number');

      // If we still don't have a box number, try to find it from the element's position
      if (!boxNumberStr) {
        const damageBoxes = element.parentElement.querySelectorAll('.damage-box');
        const index = Array.from(damageBoxes).indexOf(element);
        if (index >= 0) {
          boxNumberStr = (index + 1).toString();
          console.log('SR2E | Box number derived from position:', boxNumberStr);
        }
      }

      // Last resort: try to get it from the text content of the box-number span
      if (!boxNumberStr) {
        const boxNumberSpan = element.querySelector('.box-number');
        if (boxNumberSpan && boxNumberSpan.textContent) {
          boxNumberStr = boxNumberSpan.textContent.trim();
          console.log('SR2E | Box number derived from text content:', boxNumberStr);
        }
      }

      // Validate input parameters
      const boxNumber = parseInt(boxNumberStr);
      const damageBoxesContainer = element.closest('.damage-boxes');

      if (!damageBoxesContainer) {
        throw new Error("Damage box container not found");
      }

      const damageType = damageBoxesContainer.dataset.damageType;

      // Validate box number
      if (isNaN(boxNumber) || boxNumber < 1 || boxNumber > 10) {
        console.error('SR2E | Box number validation failed:', {
          boxNumberStr,
          boxNumber,
          isNaN: isNaN(boxNumber),
          element: element,
          dataset: element.dataset
        });
        throw new Error(`Invalid box number: ${boxNumber}. Must be between 1 and 10.`);
      }

      // Validate damage type
      if (!damageType || !['physical', 'stun'].includes(damageType)) {
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
      if (typeof currentDamage !== 'number' || isNaN(currentDamage)) {
        console.warn(`SR2E | Invalid current ${damageType} damage value: ${currentDamage}, defaulting to 0`);
        // Set a default value and continue
        await this.actor.update({
          [`system.health.${damageType}.value`]: 0
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
      if (typeof newDamage !== 'number' || isNaN(newDamage)) {
        throw new Error(`Invalid damage value calculated: ${newDamage}`);
      }

      newDamage = Math.clamped(newDamage, 0, 10);

      // Validate that the new damage value is different from current
      if (newDamage === currentDamage) {
        console.log(`SR2E | ${damageType} damage already at ${newDamage}, no update needed`);
        return;
      }

      // Update the actor's damage value using debounced update system
      try {
        // Use queued update for better concurrent handling
        this._queueUpdate({
          [`system.health.${damageType}.value`]: newDamage
        });

        console.log(`SR2E | Queued ${damageType} damage update from ${currentDamage} to ${newDamage}`);

        // Provide immediate UI feedback
        this._updateDamageBoxDisplay(damageType, newDamage);

        // Provide user feedback for significant damage changes
        if (newDamage >= 8 && currentDamage < 8) {
          ui.notifications.warn(`${this.actor.name} has taken severe ${damageType} damage (${newDamage}/10)!`);
        } else if (newDamage === 10 && currentDamage < 10) {
          ui.notifications.error(`${this.actor.name} has reached maximum ${damageType} damage!`);
        } else if (newDamage === 0 && currentDamage > 0) {
          ui.notifications.info(`${this.actor.name}'s ${damageType} damage has been cleared.`);
        }

      } catch (updateError) {
        console.error(`SR2E | Failed to queue ${damageType} damage update:`, updateError);
        ui.notifications.error(`Failed to update ${damageType} damage. The character sheet may be locked or you may not have permission.`);
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
    console.log('SR2E | Testing damage box functionality...');

    const physicalBoxes = this.element.find('.damage-boxes[data-damage-type="physical"] .damage-box');
    const stunBoxes = this.element.find('.damage-boxes[data-damage-type="stun"] .damage-box');

    console.log('SR2E | Found physical damage boxes:', physicalBoxes.length);
    console.log('SR2E | Found stun damage boxes:', stunBoxes.length);

    physicalBoxes.each((index, element) => {
      const boxNumber = element.dataset.boxNumber || element.getAttribute('data-box-number');
      console.log(`SR2E | Physical box ${index + 1}: data-box-number = ${boxNumber}`);
    });

    stunBoxes.each((index, element) => {
      const boxNumber = element.dataset.boxNumber || element.getAttribute('data-box-number');
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
   * Handle initiative roll button clicks
   */
  async _onInitiativeRoll(event) {
    event.preventDefault();
    event.stopPropagation();

    try {
      const initiative = this.actor.system?.initiative || {};

      let initiativeDice = parseInt(initiative.dice, 10);
      if (!Number.isFinite(initiativeDice) || initiativeDice < 1) initiativeDice = 1;
      if (initiativeDice > 10) initiativeDice = 10;

      const baseFromReaction = this.actor.system?.attributes?.reaction?.value;
      let initiativeBase = parseInt(initiative.base ?? baseFromReaction ?? 0, 10);
      if (!Number.isFinite(initiativeBase) || initiativeBase < 0) initiativeBase = 0;

      const rollFormula = `${initiativeDice}d6 + ${initiativeBase}`;
      const roll = await (new Roll(rollFormula)).evaluate({ async: true });

      await roll.toMessage({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        flavor: `${this.actor.name} rolls Initiative (${initiativeDice}d6+${initiativeBase})`
      });

      const total = Number(roll.total) || 0;
      await this.actor.update({ "system.initiative.current": total });
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
    const damageBoxes = element.closest('.damage-boxes');
    const allBoxes = Array.from(damageBoxes.querySelectorAll('.damage-box'));
    const currentIndex = allBoxes.indexOf(element);

    let targetIndex = currentIndex;
    let handled = false;

    switch (event.key) {
      case 'Enter':
      case ' ':
        // Activate the damage box (same as clicking)
        event.preventDefault();
        this._onDamageBoxClick(event);
        handled = true;
        break;

      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault();
        targetIndex = Math.max(0, currentIndex - 1);
        handled = true;
        break;

      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault();
        targetIndex = Math.min(allBoxes.length - 1, currentIndex + 1);
        handled = true;
        break;

      case 'Home':
        event.preventDefault();
        targetIndex = 0;
        handled = true;
        break;

      case 'End':
        event.preventDefault();
        targetIndex = allBoxes.length - 1;
        handled = true;
        break;

      case '0':
      case 'Delete':
      case 'Backspace':
        // Clear all damage
        event.preventDefault();
        const damageType = damageBoxes.dataset.damageType;
        this._clearDamage(damageType);
        handled = true;
        break;

      default:
        // Handle number keys 1-9 for direct damage setting
        if (event.key >= '1' && event.key <= '9') {
          event.preventDefault();
          const boxNumber = parseInt(event.key);
          if (boxNumber <= allBoxes.length) {
            // Create a synthetic click event for the target box
            const targetBox = allBoxes[boxNumber - 1];
            const syntheticEvent = {
              preventDefault: () => { },
              currentTarget: targetBox
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

    if (focusedBox.classList.contains('damage-box')) {
      const allBoxes = Array.from(damageBoxes.querySelectorAll('.damage-box'));
      const focusedIndex = allBoxes.indexOf(focusedBox);
      this._updateDamageBoxTabIndex(damageBoxes, focusedIndex);
    }
  }

  /**
   * Update tabindex for damage boxes to maintain proper keyboard navigation
   */
  _updateDamageBoxTabIndex(damageBoxes, focusedIndex) {
    const allBoxes = damageBoxes.querySelectorAll('.damage-box');
    allBoxes.forEach((box, index) => {
      box.tabIndex = index === focusedIndex ? 0 : -1;
    });
  }

  /**
   * Clear all damage for a specific damage type
   */
  async _clearDamage(damageType) {
    try {
      if (!['physical', 'stun'].includes(damageType)) {
        throw new Error(`Invalid damage type: ${damageType}`);
      }

      const currentDamage = this.actor.system.health[damageType].value;

      if (currentDamage === 0) {
        ui.notifications.info(`${damageType} damage is already at 0.`);
        return;
      }

      // Update the actor's damage value
      this._queueUpdate({
        [`system.health.${damageType}.value`]: 0
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
        updateData['system.health'] = {
          physical: { value: 0, max: 10 },
          stun: { value: 0, max: 10 }
        };
        needsUpdate = true;
      } else {
        // Check physical health
        if (!currentHealth.physical) {
          updateData['system.health.physical'] = { value: 0, max: 10 };
          needsUpdate = true;
        } else {
          if (typeof currentHealth.physical.value !== 'number' || isNaN(currentHealth.physical.value)) {
            updateData['system.health.physical.value'] = 0;
            needsUpdate = true;
          }
          if (typeof currentHealth.physical.max !== 'number' || isNaN(currentHealth.physical.max)) {
            updateData['system.health.physical.max'] = 10;
            needsUpdate = true;
          }
        }

        // Check stun health
        if (!currentHealth.stun) {
          updateData['system.health.stun'] = { value: 0, max: 10 };
          needsUpdate = true;
        } else {
          if (typeof currentHealth.stun.value !== 'number' || isNaN(currentHealth.stun.value)) {
            updateData['system.health.stun.value'] = 0;
            needsUpdate = true;
          }
          if (typeof currentHealth.stun.max !== 'number' || isNaN(currentHealth.stun.max)) {
            updateData['system.health.stun.max'] = 10;
            needsUpdate = true;
          }
        }
      }

      // Apply updates if needed
      if (needsUpdate) {
        console.log('SR2E | Initializing health data structure:', updateData);
        await this.actor.update(updateData);
      }

    } catch (error) {
      console.error('SR2E | Error initializing health data:', error);
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
      ui.notifications.error("Failed to save changes. You may not have permission to modify this character.");
    }
  }

  /**
   * Performance optimization: Optimized damage box display update
   */
  _updateDamageBoxDisplay(damageType, newDamage) {
    try {
      // Use cached selector for better performance
      const damageBoxes = this._getCachedElement(`.damage-boxes[data-damage-type="${damageType}"] .damage-box`);

      if (!damageBoxes || damageBoxes.length === 0) {
        console.warn(`SR2E | No damage boxes found for type: ${damageType}`);
        return;
      }

      // Batch DOM updates for better performance
      const updates = [];

      damageBoxes.each((index, box) => {
        const boxNumber = parseInt(box.dataset.boxNumber);
        const shouldBeFilled = boxNumber <= newDamage;
        const currentlyFilled = box.dataset.filled === 'true';

        if (shouldBeFilled !== currentlyFilled) {
          updates.push({
            element: box,
            filled: shouldBeFilled,
            boxNumber: boxNumber
          });
        }
      });

      // Apply all updates at once
      updates.forEach(update => {
        update.element.dataset.filled = update.filled.toString();
        update.element.setAttribute('aria-checked', update.filled.toString());
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
   * Display initiative roll results in the UI
   */
  _displayInitiativeResult(diceResults, diceTotal, reactionBonus, finalTotal, rollFormula) {
    try {
      // Validate UI elements exist
      if (!this.element || this.element.length === 0) {
        console.warn("SR2E | Character sheet element not found, cannot display initiative result");
        return;
      }

      const resultDiv = this.element.find('.initiative-result');
      if (resultDiv.length === 0) {
        console.warn("SR2E | Initiative result display area not found in UI");
        return;
      }

      const diceResultSpan = resultDiv.find('.dice-result');
      const bonusResultSpan = resultDiv.find('.bonus-result');
      const totalResultSpan = resultDiv.find('.total-result');
      const formulaSpan = resultDiv.find('.formula-text');

      // Format dice results display with error handling
      let diceDisplay = '';
      try {
        if (Array.isArray(diceResults) && diceResults.length > 0) {
          diceDisplay = `[${diceResults.join(', ')}] = ${diceTotal}`;
        } else {
          diceDisplay = `Dice Total: ${diceTotal}`;
        }
      } catch (displayError) {
        console.warn("SR2E | Error formatting dice display:", displayError);
        diceDisplay = `Dice Total: ${diceTotal}`;
      }

      // Update UI elements with error handling for each
      try {
        if (diceResultSpan.length > 0) {
          diceResultSpan.text(diceDisplay);
        }
      } catch (error) {
        console.warn("SR2E | Failed to update dice result display:", error);
      }

      try {
        if (bonusResultSpan.length > 0) {
          bonusResultSpan.text(`+ ${reactionBonus}`);
        }
      } catch (error) {
        console.warn("SR2E | Failed to update bonus result display:", error);
      }

      try {
        if (totalResultSpan.length > 0) {
          totalResultSpan.text(`= ${finalTotal}`);
        }
      } catch (error) {
        console.warn("SR2E | Failed to update total result display:", error);
      }

      try {
        if (formulaSpan.length > 0) {
          formulaSpan.text(`Formula: ${rollFormula}`);
        }
      } catch (error) {
        console.warn("SR2E | Failed to update formula display:", error);
      }

      // Show the result div with animation and error handling
      try {
        resultDiv.slideDown(300);
      } catch (animationError) {
        console.warn("SR2E | Failed to animate result display:", animationError);
        // Fallback to just showing the element
        try {
          resultDiv.show();
        } catch (showError) {
          console.warn("SR2E | Failed to show result display:", showError);
        }
      }

      // Trigger UI synchronization
      this._synchronizeUIState();

    } catch (error) {
      console.error("SR2E | Error displaying initiative result:", error);
      // Don't throw error, just log it since this is a display function
    }
  }

  /**
   * Calculate action phases from initiative score
   * SR2 phase system: characters act on multiple phases based on initiative
   * Each phase occurs every 10 points of initiative
   * Example: Initiative 27 = acts on phases 27, 17, 7
   */
  _calculateActionPhases(initiativeScore) {
    try {
      // Validate input
      if (typeof initiativeScore !== 'number' || isNaN(initiativeScore)) {
        throw new Error(`Invalid initiative score: ${initiativeScore}. Must be a number.`);
      }

      if (initiativeScore < 1) {
        console.warn(`SR2E | Initiative score too low: ${initiativeScore}, using minimum of 1`);
        initiativeScore = 1;
      }

      if (initiativeScore > 100) {
        console.warn(`SR2E | Initiative score very high: ${initiativeScore}, this may indicate an error`);
      }

      const phases = [];
      let currentPhase = Math.floor(initiativeScore); // Ensure integer
      let iterationCount = 0;
      const maxIterations = 20; // Safety limit to prevent infinite loops

      while (currentPhase > 0 && iterationCount < maxIterations) {
        phases.push(currentPhase);
        currentPhase -= 10;
        iterationCount++;
      }

      if (iterationCount >= maxIterations) {
        console.warn(`SR2E | Phase calculation hit iteration limit for initiative ${initiativeScore}`);
      }

      // Validate result
      if (phases.length === 0) {
        console.warn(`SR2E | No phases calculated for initiative ${initiativeScore}, adding single phase`);
        phases.push(Math.max(1, Math.floor(initiativeScore)));
      }

      console.log(`SR2E | Calculated ${phases.length} action phases for initiative ${initiativeScore}: [${phases.join(', ')}]`);
      return phases;

    } catch (error) {
      console.error("SR2E | Error calculating action phases:", error);
      // Return fallback single phase
      const fallbackPhase = Math.max(1, Math.floor(initiativeScore) || 1);
      console.warn(`SR2E | Using fallback single phase: ${fallbackPhase}`);
      return [fallbackPhase];
    }
  }

  /**
   * Add character to initiative tracker after rolling initiative
   */
  async _addToInitiativeTracker(initiativeResult) {
    try {
      // Validate initiative result
      if (typeof initiativeResult !== 'number' || isNaN(initiativeResult) || initiativeResult < 1) {
        throw new Error(`Invalid initiative result: ${initiativeResult}`);
      }

      // Validate actor data
      if (!this.actor || !this.actor.id) {
        throw new Error("Actor data is missing or invalid");
      }

      // Check if canvas and tokens are available
      if (!canvas || !canvas.tokens) {
        throw new Error("Canvas or tokens not available. Make sure you're on a scene with tokens.");
      }

      // Get or create the global initiative tracker instance
      let initiativeTracker = game.shadowrun2e?.initiativeTracker;

      if (!initiativeTracker) {
        try {
          // Create new tracker instance if it doesn't exist
          initiativeTracker = new SR2InitiativeTracker();

          // Store reference globally for access from other parts of the system
          if (!game.shadowrun2e) {
            game.shadowrun2e = {};
          }
          game.shadowrun2e.initiativeTracker = initiativeTracker;
        } catch (trackerError) {
          throw new Error(`Failed to create initiative tracker: ${trackerError.message}`);
        }
      }

      // Get the token for this actor (prefer controlled token, fallback to any token)
      let token = null;

      try {
        const controlledTokens = canvas.tokens.controlled.filter(t => t.actor?.id === this.actor.id);

        if (controlledTokens.length > 0) {
          token = controlledTokens[0];
        } else {
          // Find any token representing this actor on the current scene
          token = canvas.tokens.placeables.find(t => t.actor?.id === this.actor.id);
        }
      } catch (tokenError) {
        console.error("SR2E | Error finding token:", tokenError);
      }

      if (!token) {
        console.warn(`SR2E | No token found for actor ${this.actor.name}, cannot add to initiative tracker`);
        ui.notifications.warn(`No token found for ${this.actor.name}. Place a token on the scene to add to initiative tracker.`);
        return;
      }

      // Validate token data
      if (!token.id) {
        throw new Error("Token ID is missing");
      }

      // Validate initiative tracker has combatants array
      if (!Array.isArray(initiativeTracker.combatants)) {
        console.warn("SR2E | Initiative tracker combatants array missing, creating new array");
        initiativeTracker.combatants = [];
      }

      // Check if character is already in the tracker
      const existingCombatant = initiativeTracker.combatants.find(c => c.actorId === this.actor.id);

      // Calculate action phases for this initiative result with error handling
      let actionPhases;
      try {
        actionPhases = this._calculateActionPhases(initiativeResult);

        // Validate action phases result
        if (!Array.isArray(actionPhases) || actionPhases.length === 0) {
          throw new Error(`Invalid action phases calculated: ${actionPhases}`);
        }
      } catch (phaseError) {
        console.error("SR2E | Error calculating action phases:", phaseError);
        // Fallback to simple single phase
        actionPhases = [initiativeResult];
      }

      // Get safe values for initiative dice and reaction
      const initiativeDice = (this.actor.system?.initiative?.dice &&
        typeof this.actor.system.initiative.dice === 'number' &&
        !isNaN(this.actor.system.initiative.dice))
        ? this.actor.system.initiative.dice : 1;

      const reaction = (this.actor.system?.attributes?.reaction?.value &&
        typeof this.actor.system.attributes.reaction.value === 'number' &&
        !isNaN(this.actor.system.attributes.reaction.value))
        ? this.actor.system.attributes.reaction.value : 1;

      if (existingCombatant) {
        // Update existing combatant's initiative and phases
        try {
          existingCombatant.initiative = initiativeResult;
          existingCombatant.actionPhases = actionPhases;
          existingCombatant.hasRolled = true;
          existingCombatant.initiativeDice = initiativeDice;
          existingCombatant.reaction = reaction;

          console.log(`SR2E | Updated ${this.actor.name}'s initiative in tracker: ${initiativeResult}, phases: [${actionPhases.join(', ')}]`);
        } catch (updateError) {
          throw new Error(`Failed to update existing combatant: ${updateError.message}`);
        }
      } else {
        // Add new combatant to tracker
        try {
          const combatant = {
            id: foundry.utils.randomID(),
            tokenId: token.id,
            actorId: this.actor.id,
            name: this.actor.name || "Unknown Character",
            img: this.actor.img || "icons/svg/mystery-man.svg",
            initiative: initiativeResult,
            actionPhases: actionPhases,
            initiativeDice: initiativeDice,
            reaction: reaction,
            hasRolled: true
          };

          initiativeTracker.combatants.push(combatant);
          console.log(`SR2E | Added ${this.actor.name} to initiative tracker with initiative ${initiativeResult}, phases: [${actionPhases.join(', ')}]`);
        } catch (addError) {
          throw new Error(`Failed to add new combatant: ${addError.message}`);
        }
      }

      // Render the tracker if it's currently open
      try {
        if (initiativeTracker.rendered) {
          initiativeTracker.render();
        }
      } catch (renderError) {
        console.warn("SR2E | Failed to render initiative tracker:", renderError);
        // Don't throw error for render failure, it's not critical
      }

      // Show notification
      const message = existingCombatant
        ? `${this.actor.name} updated in initiative tracker with initiative ${initiativeResult}`
        : `${this.actor.name} added to initiative tracker with initiative ${initiativeResult}`;
      ui.notifications.info(message);

    } catch (error) {
      console.error("SR2E | Error adding character to initiative tracker:", error);

      // Provide specific error messages
      let errorMessage = "Failed to add character to initiative tracker.";

      if (error.message.includes("Canvas")) {
        errorMessage = "No active scene found. Open a scene with tokens to use the initiative tracker.";
      } else if (error.message.includes("token")) {
        errorMessage = `No token found for ${this.actor.name}. Place a token on the scene first.`;
      } else if (error.message.includes("tracker")) {
        errorMessage = "Initiative tracker system error. Try reloading the page.";
      } else {
        errorMessage = `Initiative tracker error: ${error.message}`;
      }

      ui.notifications.error(errorMessage);
      throw error; // Re-throw to be handled by calling function
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

      // Update initiative displays in other parts of the sheet
      this._updateInitiativeDisplays();

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
      const damageIndicators = this.element.find('.damage-indicator, .health-status');
      damageIndicators.each((index, element) => {
        try {
          const $element = $(element);
          const damageType = $element.data('damage-type');

          if (damageType === 'physical') {
            $element.text(physicalDamage);
            $element.attr('data-damage-level', physicalDamage);
          } else if (damageType === 'stun') {
            $element.text(stunDamage);
            $element.attr('data-damage-level', stunDamage);
          }
        } catch (elementError) {
          console.warn("SR2E | Error updating damage indicator:", elementError);
        }
      });

      // Update damage-based CSS classes for visual feedback
      this.element.removeClass('light-damage moderate-damage heavy-damage critical-damage');

      const totalDamage = physicalDamage + stunDamage;
      if (totalDamage >= 16) {
        this.element.addClass('critical-damage');
      } else if (totalDamage >= 12) {
        this.element.addClass('heavy-damage');
      } else if (totalDamage >= 6) {
        this.element.addClass('moderate-damage');
      } else if (totalDamage > 0) {
        this.element.addClass('light-damage');
      }

    } catch (error) {
      console.error("SR2E | Error updating damage displays:", error);
    }
  }

  /**
   * Update initiative displays throughout the character sheet
   */
  _updateInitiativeDisplays() {
    try {
      if (!this.actor?.system?.initiative) return;

      const currentInitiative = this.actor.system.initiative.current || 0;

      // Update any initiative indicators outside the combat panel
      const initiativeIndicators = this.element.find('.initiative-indicator, .initiative-display');
      initiativeIndicators.each((index, element) => {
        try {
          const $element = $(element);
          $element.text(currentInitiative);
          $element.attr('data-initiative', currentInitiative);
        } catch (elementError) {
          console.warn("SR2E | Error updating initiative indicator:", elementError);
        }
      });

    } catch (error) {
      console.error("SR2E | Error updating initiative displays:", error);
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
      const penaltyIndicators = this.element.find('.damage-penalty, .wound-penalty');
      penaltyIndicators.each((index, element) => {
        try {
          const $element = $(element);
          $element.text(totalPenalty > 0 ? `-${totalPenalty}` : '0');
          $element.attr('data-penalty', totalPenalty);

          // Add visual styling based on penalty severity
          $element.removeClass('minor-penalty major-penalty severe-penalty');
          if (totalPenalty >= 6) {
            $element.addClass('severe-penalty');
          } else if (totalPenalty >= 3) {
            $element.addClass('major-penalty');
          } else if (totalPenalty > 0) {
            $element.addClass('minor-penalty');
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
        initiative: this.actor.system.initiative?.current || 0,
        timestamp: Date.now()
      };

      // Emit event for other systems to listen to
      Hooks.callAll('sr2e.combatStateChanged', combatState);

      // Also emit on the actor for actor-specific listeners
      if (this.actor.sheet) {
        $(this.actor.sheet.element).trigger('combatStateChanged', combatState);
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
        this.element.addClass('loading');
      }

      // Call parent render method
      const result = await super.render(force, options);

      // Remove loading state and synchronize UI
      if (this.element && this.element.length > 0) {
        this.element.removeClass('loading');

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
        this.element.removeClass('loading');
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
      const combatDataUpdated = (
        updateData.system?.health ||
        updateData.system?.initiative ||
        updateData.system?.attributes?.reaction
      );

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
      Hooks.off('updateActor', this._boundOnActorUpdate);
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
    const actorUpdates = {};
    const itemUpdates = {};

    for (const [key, value] of Object.entries(formData)) {
      if (key.startsWith('items.')) {
        // This is an item update
        const match = key.match(/^items\.([^.]+)\.(.+)$/);
        if (match) {
          const itemId = match[1];
          const itemPath = match[2];

          if (!itemUpdates[itemId]) {
            itemUpdates[itemId] = {};
          }

          // Handle skill rating fields to ensure they're numbers
          if (itemPath.includes('Rating')) {
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

    const creationModeOverride = actorUpdates["flags.shadowrun2e.creationMode"];
    let creationMode = this._isCreationMode();
    if (creationModeOverride !== undefined) {
      if (typeof creationModeOverride === "boolean") creationMode = creationModeOverride;
      else if (typeof creationModeOverride === "string") creationMode = creationModeOverride === "true";
      else creationMode = Boolean(creationModeOverride);
    }

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
          const perItemCost = explicitBondCost > 0
            ? explicitBondCost
            : sr2InferFocusBondCostForGearItem({
              category: i.system.category,
              name: i.name,
              price: i.system.price ?? i.system.cost ?? 0
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
            isFree: updateData["system.isFree"] ?? item.system.isFree
          };

          const computed = sr2ComputeSkillRatingsFromAllocated(nextSystem);
          const shouldClampAllocated = creationMode && !nextSystem.isFree && nextSystem.baseSkill !== "Language";
          updateData["system.allocatedRating"] = shouldClampAllocated ? Math.min(computed.allocatedRating, 6) : computed.allocatedRating;
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
              ui.notifications.error("Not enough Force Points remaining. Reduce other spells/foci first.");
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
	      const lifestylesByIndex = new Map();
	      for (const [key, value] of Object.entries(actorUpdates)) {
	        const match = key.match(/^system\.resources\.lifestyles\.(\d+)\.(type|months)$/);
	        if (!match) continue;

	        const index = parseInt(match[1], 10);
	        if (!Number.isFinite(index)) continue;

	        if (!lifestylesByIndex.has(index)) {
	          const current = existingLifestyles[index] || { type: "street", months: 1 };
	          lifestylesByIndex.set(index, {
	            type: current.type || "street",
	            months: Math.max(1, parseInt(current.months, 10) || 1)
	          });
	        }
	        const entry = lifestylesByIndex.get(index);
	        if (match[2] === "type") entry.type = String(value || "street");
	        if (match[2] === "months") entry.months = Math.max(1, parseInt(value, 10) || 1);
	      }

      if (lifestylesByIndex.size > 0) {
        const normalizedLifestyles = [...lifestylesByIndex.entries()]
          .sort(([a], [b]) => a - b)
          .map(([, entry]) => ({
            type: entry.type || "street",
            months: entry.months || 1
          }));

        for (const key of Object.keys(actorUpdates)) {
          if (key.startsWith("system.resources.lifestyles.")) delete actorUpdates[key];
        }

        actorUpdates["system.resources.lifestyles"] = normalizedLifestyles.length
          ? normalizedLifestyles
          : [{ type: "street", months: 1 }];

        actorUpdates["system.resources.lifestyle"] = actorUpdates["system.resources.lifestyles"][0]?.type || "street";
        actorUpdates["system.creation.lifestyleMonths"] = actorUpdates["system.resources.lifestyles"][0]?.months || 1;
      }

      // Clamp attributes by racial mins/maxes and enforce Attribute Points in creation mode
      const metatype = actorUpdates["system.details.metatype"] ?? this.actor.system.details?.metatype ?? "human";
      const bounds = sr2GetRacialAttributeBounds(metatype);

      const attrKeys = ["body", "quickness", "strength", "charisma", "intelligence", "willpower"];
      const newAttributeValues = {};
      for (const key of attrKeys) {
        const path = `system.attributes.${key}.value`;
        const raw = actorUpdates[path] !== undefined ? actorUpdates[path] : this.actor.system.attributes?.[key]?.value;
        const clamped = sr2Clamp(raw, bounds[key].min, bounds[key].max);
        newAttributeValues[key] = clamped;
        if (actorUpdates[path] !== undefined) actorUpdates[path] = clamped;
      }

      if (creationMode && totalAttributePoints > 0) {
        const spent = attrKeys.reduce((sum, key) => {
          const baseline = bounds[key]?.min ?? 0;
          const value = Number(newAttributeValues[key]);
          return sum + Math.max(0, value - baseline);
        }, 0);

        if (spent > totalAttributePoints) {
          const changedName = event?.currentTarget?.name || "";
          const match = changedName.match(/^system\.attributes\.([^.]+)\.value$/);
          const changedKey = match?.[1];
          if (changedKey && attrKeys.includes(changedKey)) {
            const baseline = bounds[changedKey]?.min ?? 0;
            const currentSpent = Math.max(0, Number(newAttributeValues[changedKey]) - baseline);
            const otherSpent = spent - currentSpent;
            const allowedSpent = Math.max(0, totalAttributePoints - otherSpent);
            const allowedFinalRaw = baseline + allowedSpent;
            const allowedFinal = sr2Clamp(allowedFinalRaw, bounds[changedKey].min, bounds[changedKey].max);
            actorUpdates[`system.attributes.${changedKey}.value`] = allowedFinal;
            ui.notifications.warn("Attribute Points exceeded; clamped the last change.");
          } else {
            ui.notifications.warn("Attribute Points exceeded.");
          }
        }
      }

      await this.object.update(actorUpdates);
    }

    return true;
  }

  /**
   * Handle drag start events for creating hotbar macros
   */
  _onDragStart(event) {
    const element = event.currentTarget;

    // Get item data - try different ways to find the item ID
    let itemId = element.dataset.itemId ||
                 element.getAttribute('data-item-id') ||
                 element.closest('[data-item-id]')?.dataset.itemId;
    
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
    const dialogContent = `
      <div class="melee-combat-dialog">
        <h3>Melee Combat Modifiers for ${weapon.name}</h3>
        <div class="target-number-section">
          <label for="target-number"><strong>Base Target Number:</strong></label>
          <select id="target-number" name="targetNumber">
            <option value="2" ${defaultTN === 2 ? 'selected' : ''}>2 - Trivial</option>
            <option value="3" ${defaultTN === 3 ? 'selected' : ''}>3 - Easy</option>
            <option value="4" ${defaultTN === 4 ? 'selected' : ''}>4 - Average</option>
            <option value="5" ${defaultTN === 5 ? 'selected' : ''}>5 - Fair</option>
            <option value="6" ${defaultTN === 6 ? 'selected' : ''}>6 - Hard</option>
            <option value="7" ${defaultTN === 7 ? 'selected' : ''}>7 - Extreme</option>
            <option value="8" ${defaultTN === 8 ? 'selected' : ''}>8 - Nearly Impossible</option>
            <option value="9" ${defaultTN === 9 ? 'selected' : ''}>9 - Impossible</option>
            <option value="10" ${defaultTN === 10 ? 'selected' : ''}>10 - Miraculous</option>
            <option value="11" ${defaultTN === 11 ? 'selected' : ''}>11</option>
            <option value="12" ${defaultTN === 12 ? 'selected' : ''}>12</option>
            <option value="13" ${defaultTN === 13 ? 'selected' : ''}>13</option>
            <option value="14" ${defaultTN === 14 ? 'selected' : ''}>14</option>
            <option value="15" ${defaultTN === 15 ? 'selected' : ''}>15</option>
            <option value="16" ${defaultTN === 16 ? 'selected' : ''}>16</option>
            <option value="17" ${defaultTN === 17 ? 'selected' : ''}>17</option>
            <option value="18" ${defaultTN === 18 ? 'selected' : ''}>18</option>
            <option value="19" ${defaultTN === 19 ? 'selected' : ''}>19</option>
            <option value="20" ${defaultTN === 20 ? 'selected' : ''}>20</option>
            <option value="21" ${defaultTN === 21 ? 'selected' : ''}>21</option>
            <option value="22" ${defaultTN === 22 ? 'selected' : ''}>22</option>
            <option value="23" ${defaultTN === 23 ? 'selected' : ''}>23</option>
            <option value="24" ${defaultTN === 24 ? 'selected' : ''}>24</option>
            <option value="25" ${defaultTN === 25 ? 'selected' : ''}>25</option>
            <option value="26" ${defaultTN === 26 ? 'selected' : ''}>26</option>
            <option value="27" ${defaultTN === 27 ? 'selected' : ''}>27</option>
            <option value="28" ${defaultTN === 28 ? 'selected' : ''}>28</option>
            <option value="29" ${defaultTN === 29 ? 'selected' : ''}>29</option>
            <option value="30" ${defaultTN === 30 ? 'selected' : ''}>30</option>
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
        ${availablePools.length > 0 ? `
        <div class="pool-dice-section">
          <label><strong>Pool Dice (Optional):</strong></label>
          ${availablePools.map(pool => `
            <div class="pool-option">
              <label>
                <input type="checkbox" name="pool-${pool.key}" value="${pool.key}" class="pool-checkbox">
                ${pool.name} (${pool.current}/${pool.max})
              </label>
              <input type="number" name="pool-${pool.key}-dice" 
                     min="0" max="${pool.current}" value="0" disabled class="pool-dice-input">
            </div>
          `).join('')}
        </div>
        ` : ''}
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
          }
        },
        cancel: {
          label: "Cancel"
        }
      },
      default: "attack",
      render: (html) => {
        // Add event listeners to update total modifier in real-time
        const updateTotal = () => {
          const modifiers = this._calculateMeleeModifiers(html);
          html.find('#total-modifier').text(modifiers.total > 0 ? `+${modifiers.total}` : modifiers.total);
        };

        html.find('select, input[type="checkbox"]').on('change', updateTotal);
        updateTotal(); // Initial calculation
      }
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
    const superiorPosition = html.find('[name="superiorPosition"]').is(':checked') ? -1 : 0;
    const opponentProne = html.find('[name="opponentProne"]').is(':checked') ? -2 : 0;

    const total = friendsInMelee + opponentsInMelee + reachAdvantage + multipleTargets + superiorPosition + opponentProne;

    return {
      friendsInMelee,
      opponentsInMelee,
      reachAdvantage,
      multipleTargets,
      superiorPosition,
      opponentProne,
      total
    };
  }

  /**
   * Perform the actual weapon attack with modifiers
   */
  async _performWeaponAttack(weapon, tnModifier) {
    // Get the linked skill for this weapon
    const linkedSkill = this._getWeaponSkill(weapon);
    
    if (!linkedSkill) {
      ui.notifications.error(`No skill found for ${weapon.name}. Please link a skill to this weapon.`);
      return;
    }

    // Calculate base TN (typically 4 for most attacks)
    const baseTN = 4;
    const finalTN = Math.max(2, baseTN + tnModifier); // TN can't go below 2

    // Get skill rating
    const skillRating = this._getSkillRating(linkedSkill);
    
    if (skillRating === 0) {
      ui.notifications.error(`${linkedSkill.name} skill rating is 0. Cannot make attack.`);
      return;
    }

    // Create attack roll description
    let attackDescription = `${weapon.name} Attack`;
    if (tnModifier !== 0) {
      attackDescription += ` (TN ${baseTN} ${tnModifier > 0 ? '+' : ''}${tnModifier} = ${finalTN})`;
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
        ${tnModifier !== 0 ? `<p><strong>Modifiers:</strong> ${tnModifier > 0 ? '+' : ''}${tnModifier}</p>` : ''}
        <p><strong>Damage:</strong> ${weapon.system.damage || 'Unknown'}</p>
        ${weapon.system.reach !== undefined ? `<p><strong>Reach:</strong> ${weapon.system.reach}</p>` : ''}
        <p><strong>Result:</strong> ${result.successes} success${result.successes !== 1 ? 'es' : ''}</p>
        ${result.isCriticalFailure ? '<p><strong>Critical Failure!</strong></p>' : ''}
      </div>
    `;

    ChatMessage.create({
      user: game.user.id,
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      content: chatContent
    });
  }

  /**
   * Get the appropriate skill for a weapon
   */
  _getWeaponSkill(weapon) {
    // First check if weapon has a linked skill
    if (weapon.system.linkedSkill && weapon.system.linkedSkill.skillId) {
      return this.actor.items.get(weapon.system.linkedSkill.skillId);
    }

    // Auto-detect skill based on weapon type/name
    const weaponName = weapon.name.toLowerCase();
    const skills = this.actor.items.filter(i => i.type === 'skill');

    // Common weapon skill mappings
    const skillMappings = {
      'sword': 'Edged Weapons',
      'knife': 'Edged Weapons',
      'blade': 'Edged Weapons',
      'katana': 'Edged Weapons',
      'club': 'Clubs',
      'staff': 'Pole Arms',
      'spear': 'Pole Arms',
      'whip': 'Whips',
      'pistol': 'Pistols',
      'rifle': 'Rifles',
      'shotgun': 'Shotguns',
      'smg': 'SMG',
      'assault': 'Assault Rifles'
    };

    // Try to find matching skill
    for (const [weaponType, skillName] of Object.entries(skillMappings)) {
      if (weaponName.includes(weaponType)) {
        const skill = skills.find(s => s.system.baseSkill === skillName);
        if (skill) return skill;
      }
    }

    // Default to first combat skill found
    const combatSkills = ['Edged Weapons', 'Clubs', 'Pole Arms', 'Whips', 'Pistols', 'Rifles', 'Shotguns', 'SMG', 'Assault Rifles'];
    for (const skillName of combatSkills) {
      const skill = skills.find(s => s.system.baseSkill === skillName);
      if (skill) return skill;
    }

    return null;
  }

  /**
   * Get effective skill rating for a skill item
   */
  _getSkillRating(skill) {
    if (!skill) return 0;
    
    const baseRating = skill.system.baseRating || 0;
    const concRating = skill.system.concentrationRating || 0;
    const specRating = skill.system.specializationRating || 0;
    
    // Return the highest rating available
    return Math.max(baseRating, concRating, specRating);
  }
}
