import {
  sr2CanCastSpellAtForce,
  sr2ComputeAreaSpellRadius,
  sr2ComputeDrainTargetNumber,
  SR2_DAMAGE_BOXES_BY_LEVEL,
  sr2ComputeMagicPoolCapForSpellSuccessTest,
  sr2ComputeRestrictedSpellEffectiveForce,
  sr2ComputeSpellTargetNumber,
  sr2GetSpellResistanceAttribute,
  sr2ResolveDrain,
  sr2ResolveSpellEffect,
  sr2StageDamageLevel,
} from "./spellcasting.js";

function sr2NormalizeTargetCount(value) {
  return Math.max(1, Math.floor(Number(value) || 1));
}

function sr2NormalizeForceAllocations(targetCount, forceAllocations, totalForce) {
  if (!Array.isArray(forceAllocations) || forceAllocations.length === 0) {
    return Array.from({ length: targetCount }, (_, index) => (index === 0 ? totalForce : 0));
  }

  const normalized = forceAllocations
    .slice(0, targetCount)
    .map((value) => Math.max(0, Math.floor(Number(value) || 0)));

  while (normalized.length < targetCount) normalized.push(0);
  return normalized;
}

function sr2NormalizeDamageLevel(level) {
  const normalized = String(level || "")
    .trim()
    .toUpperCase();
  return ["L", "M", "S", "D"].includes(normalized) ? normalized : null;
}

// SR2 spellcasting starts by setting the modified TN, confirming learned Force, and capping Magic Pool
// dice added to the Spell Success Test at the caster's Magic Attribute.
export function sr2PrepareSpellCastTargetNumber({
  spellType = "",
  learnedForce = 0,
  castForce = 0,
  requestedMagicPoolDice = 0,
  magicRating = 0,
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
  exclusive = false,
  fetishType = null,
} = {}) {
  const requestedForce = Math.max(0, Number(castForce) || 0);
  const forceCap = Math.max(0, Number(learnedForce) || 0);
  const canCastAtForce = sr2CanCastSpellAtForce({
    learnedForce: forceCap,
    castForce: requestedForce,
  });
  const magicPoolCap = sr2ComputeMagicPoolCapForSpellSuccessTest(magicRating);
  const allowedMagicPoolDice = Math.max(
    0,
    Math.min(Math.floor(Number(requestedMagicPoolDice) || 0), magicPoolCap),
  );

  const modifiedTargetNumber = sr2ComputeSpellTargetNumber({
    baseTargetNumber,
    visibilityModifier,
    coverModifier,
    woundModifier,
    sustainingSpells,
    manaBarrierForce,
    lodgeRating,
    ignoreBarrierModifier,
    ignoreLodgeModifier,
    touchOnly,
  });

  return {
    canCastAtForce,
    learnedForce: forceCap,
    castForce: requestedForce,
    effectiveForce: sr2ComputeRestrictedSpellEffectiveForce({
      force: requestedForce,
      exclusive,
      fetishType,
    }),
    resistanceAttribute: sr2GetSpellResistanceAttribute(spellType),
    modifiedTargetNumber,
    magicPoolCap,
    requestedMagicPoolDice: Math.max(0, Math.floor(Number(requestedMagicPoolDice) || 0)),
    allowedMagicPoolDice,
    touchOnly: Boolean(touchOnly),
    modifiers: {
      baseTargetNumber: Number(baseTargetNumber) || 4,
      visibilityModifier: Number(visibilityModifier) || 0,
      coverModifier: Number(coverModifier) || 0,
      woundModifier: Number(woundModifier) || 0,
      sustainingModifier: Math.max(0, Number(sustainingSpells) || 0) * 2,
      manaBarrierModifier: ignoreBarrierModifier
        ? 0
        : Math.floor(Math.max(0, Number(manaBarrierForce) || 0) / 2),
      lodgeModifier: ignoreLodgeModifier
        ? 0
        : Math.floor(Math.max(0, Number(lodgeRating) || 0) / 2),
    },
  };
}

// SR2 targeting summaries need to distinguish single-target, split-Force multi-target, and area-effect
// casts, while keeping the original Force and any per-target Force allocations visible.
export function sr2SummarizeSpellTargets({
  spellType = "",
  targetCount = 1,
  castForce = 0,
  forceAllocations = [],
  area = false,
  magicRating = 0,
  areaMode = "increase",
  withheldDice = 0,
} = {}) {
  const normalizedTargetCount = sr2NormalizeTargetCount(targetCount);
  const totalForce = Math.max(0, Math.floor(Number(castForce) || 0));
  const perTargetForce = sr2NormalizeForceAllocations(
    normalizedTargetCount,
    forceAllocations,
    totalForce,
  );
  const allocatedForce = perTargetForce.reduce((sum, value) => sum + value, 0);

  return {
    targetingMode: area ? "area" : normalizedTargetCount > 1 ? "multi-target" : "single-target",
    resistanceAttribute: sr2GetSpellResistanceAttribute(spellType),
    targetCount: normalizedTargetCount,
    castForce: totalForce,
    perTargetForce,
    allocatedForce,
    unallocatedForce: Math.max(0, totalForce - allocatedForce),
    hasValidForceSplit:
      normalizedTargetCount <= 1 ? true : allocatedForce > 0 && allocatedForce <= totalForce,
    area,
    areaRadius: area
      ? sr2ComputeAreaSpellRadius({
          magicRating,
          withheldDice,
          spellForce: totalForce,
          mode: areaMode,
        })
      : null,
    withheldDice: area ? Math.max(0, Math.min(Number(withheldDice) || 0, totalForce)) : 0,
  };
}

// SR2 resisted spell resolution compares caster and target successes; ties still produce the spell's
// minimum effect, while damaging manipulations use Damage Resistance instead of normal spell resistance.
export function sr2SummarizeSpellEffectResolution({
  casterSuccesses = 0,
  targetSuccesses = 0,
  resisted = true,
  spellType = "",
  damagingManipulation = false,
} = {}) {
  const outcome = sr2ResolveSpellEffect({
    casterSuccesses,
    targetSuccesses,
    resisted,
  });

  return {
    ...outcome,
    resisted: Boolean(resisted),
    resistanceAttribute: sr2GetSpellResistanceAttribute(spellType),
    resistanceMode: damagingManipulation ? "damage-resistance-half-impact" : "spell-resistance",
    casterSuccesses: Math.max(0, Number(casterSuccesses) || 0),
    targetSuccesses: Math.max(0, Number(targetSuccesses) || 0),
  };
}

// SR2 spell resistance usually uses Body or Willpower against TN equal to the spell's Force.
export function sr2PrepareSpellResistanceTest({
  spellType = "",
  spellForce = 0,
  targetAttributeValue = 0,
} = {}) {
  return {
    resistanceAttribute: sr2GetSpellResistanceAttribute(spellType),
    dicePool: Math.max(0, Math.floor(Number(targetAttributeValue) || 0)),
    targetNumber: Math.max(2, Math.floor(Number(spellForce) || 0)),
  };
}

// SR2 combat spells stage their listed damage level up by one per two net successes after resistance.
export function sr2SummarizeCombatSpellDamage({
  baseDamageLevel = "",
  netSuccesses = 0,
  minimumEffect = false,
} = {}) {
  const normalizedBaseLevel = sr2NormalizeDamageLevel(baseDamageLevel);
  if (!normalizedBaseLevel) {
    return {
      finalDamageLevel: null,
      stageDelta: 0,
    };
  }

  const stageDelta = minimumEffect ? 0 : Math.floor(Math.max(0, Number(netSuccesses) || 0) / 2);
  return {
    finalDamageLevel: sr2StageDamageLevel(normalizedBaseLevel, stageDelta),
    boxes: SR2_DAMAGE_BOXES_BY_LEVEL[sr2StageDamageLevel(normalizedBaseLevel, stageDelta)] ?? 0,
    stageDelta,
  };
}

// SR2 Drain resolves after the cast using modified Force as the Drain TN; every 2 successes stage Drain
// down one level, and any remaining Drain becomes Physical if spell Force exceeds Magic.
export function sr2SummarizeDrainApplication({
  baseDrainLevel = "",
  modifiedForce = 0,
  criticalMisfire = false,
  resistanceSuccesses = 0,
  spellForce = 0,
  casterMagic = 0,
} = {}) {
  return {
    drainTargetNumber: sr2ComputeDrainTargetNumber({ modifiedForce, criticalMisfire }),
    ...sr2ResolveDrain({
      baseDrainLevel,
      resistanceSuccesses,
      spellForce,
      casterMagic,
    }),
    baseDrainLevel: String(baseDrainLevel || "").toUpperCase(),
    resistanceSuccesses: Math.max(0, Number(resistanceSuccesses) || 0),
    criticalMisfire: Boolean(criticalMisfire),
  };
}
