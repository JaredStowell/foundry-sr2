let skillsDataCache = null;
let skillsDataCachePromise = null;

export async function loadSkillsData() {
  if (skillsDataCache) return skillsDataCache;

  if (!skillsDataCachePromise) {
    skillsDataCachePromise = fetch("/systems/shadowrun2e/data/skills.json")
      .then((response) => response.json())
      .then((skillsData) => {
        skillsDataCache = skillsData;
        return skillsData;
      })
      .catch((error) => {
        skillsDataCachePromise = null;
        throw error;
      });
  }

  return skillsDataCachePromise;
}

export function sr2InferSpellRangeFromName(spellName) {
  const name = String(spellName || "").toLowerCase();
  if (!name) return "";
  if (name.includes("touch")) return "Touch";
  return "LOS";
}

export function sr2InferSpellResistFromType(spellType) {
  switch (String(spellType || "").toUpperCase()) {
    case "M":
      return "Willpower";
    case "P":
      return "Body";
    default:
      return "";
  }
}

export function sr2InferSpellDamageLevelFromDrain(rawDrain) {
  const drain = String(rawDrain || "")
    .trim()
    .toUpperCase();
  const match = drain.match(/([LMSD])\s*$/);
  return match ? match[1] : "";
}

export function sr2FormatSpellDrain(rawDrain) {
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

export const SR2_SPELL_CLASS_LABELS = {
  C: "Combat",
  D: "Detection",
  H: "Health",
  I: "Illusion",
  M: "Manipulation",
};

export function sr2NormalizeSpellClass(value) {
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
    manipulation: "M",
  };
  return map[lower] || "";
}

export function sr2GetSystemSetting(key, fallback) {
  try {
    return game?.settings?.get("shadowrun2e", key) ?? fallback;
  } catch (err) {
    return fallback;
  }
}

const SR2_DAMAGE_LEVELS = ["L", "M", "S", "D"];
export const SR2_DAMAGE_BOXES_BY_LEVEL = { L: 1, M: 3, S: 6, D: 10 };

function sr2GetAugmentationModifiers(actor) {
  if (!actor) return {};
  return actor._sr2AugmentationModifiers ?? actor._calculateAugmentationModifiers?.() ?? {};
}

export function sr2GetModifiedAttribute(actor, attributeName) {
  const base = Number(actor?.system?.attributes?.[attributeName]?.value) || 0;
  const modifiers = sr2GetAugmentationModifiers(actor);

  const map = {
    body: "BOD",
    quickness: "QCK",
    strength: "STR",
    charisma: "CHA",
    intelligence: "INT",
    willpower: "WIL",
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

export function sr2ParseDamageCode(rawDamageCode, context = {}) {
  const raw = String(rawDamageCode || "").trim();
  if (!raw) return null;

  const isStun = /\bSTUN\b/i.test(raw);
  let cleaned = raw.replace(/\bSTUN\b/gi, "").trim();

  const levelMatch = cleaned.match(/([LMSD])\s*$/i);
  if (!levelMatch) return null;
  const level = levelMatch[1].toUpperCase();

  cleaned = cleaned.replace(/([LMSD])\s*$/i, "").trim();
  cleaned = cleaned.replace(/^\((.*)\)$/, "$1").trim();

  const strength = Number(context?.strength) || 0;
  const strengthMin = Number(context?.strengthMin) || strength;

  const unsupportedIdentifiers = cleaned
    .toUpperCase()
    .replace(/STR\s*MIN\.?/g, "")
    .replace(/\bSTR\b/g, "")
    .replace(/[0-9+\-*/().\sX×]/g, "");
  if (unsupportedIdentifiers) return null;

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
    raw,
  };
}

export function sr2StageDamageLevel(baseLevel, stageDelta) {
  const level = String(baseLevel || "").toUpperCase();
  const baseIndex = SR2_DAMAGE_LEVELS.indexOf(level);
  if (baseIndex < 0) return null;

  const delta = Number(stageDelta) || 0;
  const finalIndex = baseIndex + delta;
  if (finalIndex < 0) return null;
  if (finalIndex >= SR2_DAMAGE_LEVELS.length) return "D";
  return SR2_DAMAGE_LEVELS[finalIndex];
}

export function sr2GetArmorRatings(actor) {
  const equippedArmor = actor?.items?.filter((i) => i.type === "armor" && i.system?.equipped) || [];
  const ballistic = equippedArmor.reduce((sum, a) => sum + (Number(a.system?.ballistic) || 0), 0);
  const impact = equippedArmor.reduce((sum, a) => sum + (Number(a.system?.impact) || 0), 0);
  const dermalArmor = Number(actor?.system?.details?.traits?.dermalArmor) || 0;
  return {
    ballistic: ballistic + dermalArmor,
    impact: impact + dermalArmor,
  };
}

export async function sr2ApplyDamageToActor(actor, damageType, boxes) {
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

  const updateData = {
    [`system.health.${primary}.value`]: Math.max(0, Math.min(maxPrimary, nextPrimary)),
  };
  if (carry > 0) {
    const nextOther = Math.max(0, Math.min(maxOther, currentOther + carry));
    updateData[`system.health.${other}.value`] = nextOther;
  }

  await actor.update(updateData);
  return true;
}

export function sr2GetWeaponSkillData(actor, weapon, options = {}) {
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
            if (notify)
              ui.notifications.warn(
                `${weapon.name} is linked to a skill with no concentration selected.`,
              );
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
            if (notify)
              ui.notifications.warn(
                `${weapon.name} is linked to a skill with no specialization entered.`,
              );
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
    const skills =
      actor?.items?.filter?.(
        (i) => i.type === "skill" && fallbackSkillNames.includes(i.system?.baseSkill),
      ) || [];
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

export function sr2FindWeaponSkill(actor, weapon) {
  if (weapon?.system?.linkedSkill?.skillId) {
    return actor?.items?.get?.(weapon.system.linkedSkill.skillId) || null;
  }

  const weaponName = String(weapon?.name || "").toLowerCase();
  const skills = actor?.items?.filter?.((i) => i.type === "skill") || [];

  const skillMappings = {
    sword: "Edged Weapons",
    knife: "Edged Weapons",
    blade: "Edged Weapons",
    katana: "Edged Weapons",
    club: "Clubs",
    staff: "Pole Arms",
    spear: "Pole Arms",
    whip: "Whips",
    pistol: "Pistols",
    rifle: "Rifles",
    shotgun: "Shotguns",
    smg: "SMG",
    assault: "Assault Rifles",
  };

  for (const [weaponType, skillName] of Object.entries(skillMappings)) {
    if (weaponName.includes(weaponType)) {
      const skill = skills.find((item) => item.system?.baseSkill === skillName);
      if (skill) return skill;
    }
  }

  const combatSkills = [
    "Edged Weapons",
    "Clubs",
    "Pole Arms",
    "Whips",
    "Pistols",
    "Rifles",
    "Shotguns",
    "SMG",
    "Assault Rifles",
  ];
  for (const skillName of combatSkills) {
    const skill = skills.find((item) => item.system?.baseSkill === skillName);
    if (skill) return skill;
  }

  return null;
}

export function sr2GetEffectiveSkillRating(skill) {
  if (!skill) return 0;

  const baseRating = Number(skill.system?.baseRating) || 0;
  const concentrationRating = Number(skill.system?.concentrationRating) || 0;
  const specializationRating = Number(skill.system?.specializationRating) || 0;

  return Math.max(baseRating, concentrationRating, specializationRating);
}

export function sr2GetHighestSkillRatingByBaseSkill(actor, baseSkillName) {
  const skills =
    actor?.items?.filter?.(
      (item) => item.type === "skill" && item.system?.baseSkill === baseSkillName,
    ) || [];
  if (skills.length === 0) return 0;
  return Math.max(...skills.map((skill) => sr2GetEffectiveSkillRating(skill)));
}
