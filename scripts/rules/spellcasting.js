export const SR2_DAMAGE_LEVELS = ["L", "M", "S", "D"];
export const SR2_DAMAGE_BOXES_BY_LEVEL = Object.freeze({
  L: 1,
  M: 3,
  S: 6,
  D: 10,
});

function sr2SafeEvalArithmetic(expression) {
  const expr = String(expression || "").replace(/\s+/g, "");
  if (!expr) return null;
  if (!/^[0-9+\-*/().]+$/.test(expr)) return null;
  try {
    const value = Function(`"use strict";return (${expr});`)();
    if (!Number.isFinite(value)) return null;
    return value;
  } catch (error) {
    return null;
  }
}

// Stage damage up or down one level per 2 net successes, capped at Deadly.
export function sr2StageDamageLevel(baseLevel, delta) {
  const level = String(baseLevel || "").toUpperCase();
  const index = SR2_DAMAGE_LEVELS.indexOf(level);
  if (index < 0) return null;

  const finalIndex = index + (Number(delta) || 0);
  if (finalIndex < 0) return null;
  if (finalIndex >= SR2_DAMAGE_LEVELS.length) return "D";
  return SR2_DAMAGE_LEVELS[finalIndex];
}

// Mana spells resist with Willpower; physical spells resist with Body.
export function sr2GetSpellResistanceAttribute(spellType) {
  switch (String(spellType || "").toLowerCase()) {
    case "m":
    case "mana":
      return "willpower";
    case "p":
    case "physical":
      return "body";
    default:
      return "";
  }
}

// Spellcasting TN starts from the base TN and adds sustaining, wound, barrier, and lodge modifiers.
export function sr2ComputeSpellTargetNumber({
  baseTargetNumber = 4,
  visibilityModifier = 0,
  coverModifier = 0,
  woundModifier = 0,
  sustainingSpells = 0,
  manaBarrierForce = 0,
  lodgeRating = 0,
  ignoreBarrierModifier = false,
  ignoreLodgeModifier = false,
  touchOnly = false,
} = {}) {
  const base = Number(baseTargetNumber) || 4;
  const wound = Number(woundModifier) || 0;
  if (touchOnly) return Math.max(2, base + wound);

  const barrierModifier = ignoreBarrierModifier
    ? 0
    : Math.floor(Math.max(0, Number(manaBarrierForce) || 0) / 2);
  const lodgeModifier = ignoreLodgeModifier
    ? 0
    : Math.floor(Math.max(0, Number(lodgeRating) || 0) / 2);
  const sustainingModifier = Math.max(0, Number(sustainingSpells) || 0) * 2;

  return Math.max(
    2,
    base +
      (Number(visibilityModifier) || 0) +
      (Number(coverModifier) || 0) +
      wound +
      sustainingModifier +
      barrierModifier +
      lodgeModifier,
  );
}

// Resisted spells compare caster and target successes; ties favor the caster with minimum effect.
export function sr2ResolveSpellEffect({
  casterSuccesses = 0,
  targetSuccesses = 0,
  resisted = true,
} = {}) {
  const caster = Math.max(0, Number(casterSuccesses) || 0);
  const target = Math.max(0, Number(targetSuccesses) || 0);

  if (caster <= 0) {
    return {
      cast: false,
      result: "miscast",
      netSuccesses: 0,
      minimumEffect: false,
    };
  }

  if (!resisted) {
    return {
      cast: true,
      result: "success",
      netSuccesses: caster,
      minimumEffect: false,
    };
  }

  if (target > caster) {
    return {
      cast: true,
      result: "resisted",
      netSuccesses: 0,
      minimumEffect: false,
    };
  }

  if (target === caster) {
    return {
      cast: true,
      result: "minimum-effect",
      netSuccesses: 0,
      minimumEffect: true,
    };
  }

  return {
    cast: true,
    result: "success",
    netSuccesses: caster - target,
    minimumEffect: false,
  };
}

// Magic Pool dice added to the spell success test cannot exceed the caster's Magic rating.
export function sr2ComputeMagicPoolCapForSpellSuccessTest(magicRating) {
  return Math.max(0, Number(magicRating) || 0);
}

// Drain resistance TN is the modified Force, with +2 for a Rule of One misfire.
export function sr2ComputeDrainTargetNumber({ modifiedForce = 2, criticalMisfire = false } = {}) {
  return Math.max(2, (Number(modifiedForce) || 0) + (criticalMisfire ? 2 : 0));
}

// SR2 drain codes substitute the cast Force into the formula, then floor the arithmetic result at a minimum of 2.
export function sr2ComputeDrainValueFromCode(drainCode, force) {
  if (!drainCode) return 4;

  let drainValue = 4;

  try {
    let formula = String(drainCode).replace(/F/g, String(force));
    formula = formula.replace(/[\[\]LMSD]/g, "");
    formula = formula.replace(/[^0-9+\-*/().]/g, "");

    const computed = sr2SafeEvalArithmetic(formula);
    if (!Number.isFinite(computed)) throw new Error("Invalid drain formula");
    drainValue = Math.max(2, Math.floor(computed));
  } catch (error) {
    return 4;
  }

  return drainValue;
}

// Every 2 Drain resistance successes reduces Drain by 1 level; Force above Magic makes it physical.
export function sr2ResolveDrain({
  baseDrainLevel,
  resistanceSuccesses = 0,
  spellForce = 0,
  casterMagic = 0,
} = {}) {
  const baseLevel = String(baseDrainLevel || "").toUpperCase();
  const index = SR2_DAMAGE_LEVELS.indexOf(baseLevel);
  if (index < 0) {
    return {
      applied: false,
      finalLevel: null,
      boxes: 0,
      damageType: null,
    };
  }

  const stageDown = Math.floor(Math.max(0, Number(resistanceSuccesses) || 0) / 2);
  const finalLevel = sr2StageDamageLevel(baseLevel, -stageDown);
  if (!finalLevel) {
    return {
      applied: false,
      finalLevel: null,
      boxes: 0,
      damageType: null,
    };
  }

  return {
    applied: true,
    finalLevel,
    boxes: SR2_DAMAGE_BOXES_BY_LEVEL[finalLevel] ?? 0,
    damageType: Number(spellForce) > Number(casterMagic) ? "physical" : "stun",
  };
}

// Area spells use Magic as base radius and can trade withheld dice to increase or decrease it.
export function sr2ComputeAreaSpellRadius({
  magicRating = 0,
  withheldDice = 0,
  spellForce = 0,
  mode = "increase",
} = {}) {
  const baseRadius = Math.max(0, Number(magicRating) || 0);
  const withheld = Math.max(0, Math.min(Number(withheldDice) || 0, Number(spellForce) || 0));
  if (mode === "decrease") {
    return Math.max(0, baseRadius - Math.floor(withheld / 2));
  }
  return baseRadius + withheld;
}

// Detection spells are TN 4 normally, 6 out of sight, 10 for astral beings, plus barriers.
export function sr2ComputeDetectionSpellTargetNumber({
  subjectsOutOfSight = false,
  astralBeings = false,
  barrierRating = 0,
} = {}) {
  let base = 4;
  if (astralBeings) base = 10;
  else if (subjectsOutOfSight) base = 6;

  return base + Math.max(0, Number(barrierRating) || 0);
}

// Noticing spellcasting uses 2 x (Magic - Force), with magicians getting the usual easier read.
export function sr2ComputeSpellNoticeTargetNumber({
  casterMagic = 0,
  spellForce = 0,
  perceptionModifier = 0,
  observerIsMagician = false,
} = {}) {
  const base = Math.max(2, 2 * ((Number(casterMagic) || 0) - (Number(spellForce) || 0)));
  const modifier = (Number(perceptionModifier) || 0) + (observerIsMagician ? -2 : 0);
  return Math.max(2, base + modifier);
}

// Exclusive spells and fetishes raise the effective Force used for restricted-spell handling.
export function sr2ComputeRestrictedSpellEffectiveForce({
  force = 0,
  exclusive = false,
  fetishType = null,
} = {}) {
  const baseForce = Math.max(0, Number(force) || 0);
  let bonus = exclusive ? 2 : 0;
  if (fetishType === "reusable") bonus += 1;
  if (fetishType === "expendable") bonus += 2;
  return baseForce + bonus;
}

// Sustaining one or more spells adds +2 TN per sustained spell.
export function sr2ComputeSustainingModifier(sustainedSpellCount) {
  return Math.max(0, Number(sustainedSpellCount) || 0) * 2;
}

// A caster can only sustain up to their Sorcery rating in spells at once.
export function sr2CanSustainAdditionalSpell({
  currentSustainedCount = 0,
  sorceryRating = 0,
} = {}) {
  return (Number(currentSustainedCount) || 0) < Math.max(0, Number(sorceryRating) || 0);
}

// You can cast a learned spell at any Force from 1 up to the learned Force.
export function sr2CanCastSpellAtForce({ learnedForce = 0, castForce = 0 } = {}) {
  const learned = Math.max(0, Number(learnedForce) || 0);
  const cast = Math.max(0, Number(castForce) || 0);
  return cast > 0 && cast <= learned;
}

// Starting characters cannot learn spells above Force 6.
export function sr2CanLearnSpellAtCharacterCreation(force) {
  return Math.max(0, Number(force) || 0) <= 6;
}
