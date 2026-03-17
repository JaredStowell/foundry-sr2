export const SR2_DAMAGE_LEVELS = Object.freeze(["L", "M", "S", "D"]);

export const SR2_DAMAGE_BOXES_BY_LEVEL = Object.freeze({
  L: 1,
  M: 3,
  S: 6,
  D: 10,
});

function sr2NormalizeDamageLevel(level) {
  const normalized = String(level || "")
    .trim()
    .toUpperCase();
  return SR2_DAMAGE_LEVELS.includes(normalized) ? normalized : null;
}

function sr2NormalizeSuccesses(value) {
  return Math.max(0, Math.floor(Number(value) || 0));
}

// SR2 wound levels map to Light/Moderate/Serious/Deadly at 1/3/6/10 boxes.
export function sr2GetDamageLevelFromBoxes(boxes) {
  const count = Math.max(0, Math.floor(Number(boxes) || 0));
  if (count >= 10) return "D";
  if (count >= 6) return "S";
  if (count >= 3) return "M";
  if (count >= 1) return "L";
  return null;
}

// SR2 injury penalties use the worse of the Physical or Stun tracks for TN and Initiative modifiers.
export function sr2GetInjuryModifiers({ physicalBoxes = 0, stunBoxes = 0 } = {}) {
  const physicalLevel = sr2GetDamageLevelFromBoxes(physicalBoxes);
  const stunLevel = sr2GetDamageLevelFromBoxes(stunBoxes);
  const levels = ["L", "M", "S", "D"];
  const winningLevel =
    levels.indexOf(physicalLevel) > levels.indexOf(stunLevel) ? physicalLevel : stunLevel;
  const severity =
    winningLevel === "L"
      ? 1
      : winningLevel === "M"
        ? 2
        : winningLevel === "S"
          ? 3
          : winningLevel === "D"
            ? 4
            : 0;

  return {
    level: winningLevel,
    targetNumber: severity,
    initiative: severity > 0 ? -severity : 0,
  };
}

// SR2 damage stages by one wound level per two net successes, capped at Deadly or reduced to no damage.
export function sr2StageDamageLevel(baseLevel, stageDelta = 0) {
  const normalizedLevel = sr2NormalizeDamageLevel(baseLevel);
  if (!normalizedLevel) return null;

  const baseIndex = SR2_DAMAGE_LEVELS.indexOf(normalizedLevel);
  const delta = Math.trunc(Number(stageDelta) || 0);
  const finalIndex = baseIndex + delta;

  if (finalIndex < 0) return null;
  if (finalIndex >= SR2_DAMAGE_LEVELS.length) return "D";
  return SR2_DAMAGE_LEVELS[finalIndex];
}

// SR2 range bands map to TN 4/5/6/9, with launcher minimum range failures using TN 9 and marking out of range.
export function sr2GetRangeBand({ distance = null, rangeData = {} } = {}) {
  const meters = Number(distance);
  const minRange = Number(rangeData?.min) || 0;
  const shortMax = Number(rangeData?.short) || 0;
  const mediumMax = Number(rangeData?.medium) || 0;
  const longMax = Number(rangeData?.long) || 0;
  const extremeMax = Number(rangeData?.extreme) || 0;

  if (!Number.isFinite(meters)) {
    return {
      targetNumber: 4,
      label: "",
      inRange: true,
    };
  }

  if (minRange > 0 && meters < minRange) {
    return {
      targetNumber: 9,
      label: `Below Minimum (${minRange}+)`,
      inRange: false,
    };
  }

  if (meters <= shortMax) return { targetNumber: 4, label: "Short", inRange: true };
  if (meters <= mediumMax) return { targetNumber: 5, label: "Medium", inRange: true };
  if (meters <= longMax) return { targetNumber: 6, label: "Long", inRange: true };
  if (meters <= extremeMax) return { targetNumber: 9, label: "Extreme", inRange: true };
  return { targetNumber: 9, label: "Out of Range", inRange: false };
}

// SR2 Damage Resistance TN is Power minus armor, with a minimum TN of 2.
export function sr2ComputeDamageResistanceTargetNumber({ power = 0, armor = 0 } = {}) {
  return Math.max(2, (Number(power) || 0) - (Number(armor) || 0));
}

// SR2 ranged combat produces a clean miss when Combat Pool-only defense successes exceed the attacker's successes.
export function sr2ResolveRangedCombat({
  attackerSuccesses = 0,
  defenderSuccesses = 0,
  defenderCombatPoolSuccesses = 0,
  baseDamageLevel,
} = {}) {
  const attacker = sr2NormalizeSuccesses(attackerSuccesses);
  const defender = sr2NormalizeSuccesses(defenderSuccesses);
  const defenderCombat = sr2NormalizeSuccesses(defenderCombatPoolSuccesses);
  const cleanMiss = defenderCombat > attacker;
  const netSuccesses = cleanMiss ? 0 : attacker - defender;
  const stageDelta = cleanMiss ? 0 : Math.trunc(netSuccesses / 2);
  const finalLevel = cleanMiss ? null : sr2StageDamageLevel(baseDamageLevel, stageDelta);

  return {
    hit: !cleanMiss && Boolean(finalLevel),
    cleanMiss,
    netSuccesses,
    stageDelta,
    finalLevel,
    boxes: finalLevel ? (SR2_DAMAGE_BOXES_BY_LEVEL[finalLevel] ?? 0) : 0,
  };
}

// SR2 melee uses base TN 4, shifted by reach advantage in opposite directions for attacker and defender.
export function sr2ComputeMeleeTargetNumbers({
  attackerReach = 0,
  defenderReach = 0,
  baseTargetNumber = 4,
} = {}) {
  const reachDelta = (Number(attackerReach) || 0) - (Number(defenderReach) || 0);
  const baseTN = Number(baseTargetNumber) || 4;

  return {
    reachDelta,
    attackerTargetNumber: Math.max(2, baseTN - reachDelta),
    defenderTargetNumber: Math.max(2, baseTN + reachDelta),
  };
}

// SR2 melee ties go to the attacker; otherwise the higher-success side lands the hit and stages damage up per 2 net successes.
export function sr2ResolveMeleeOpposedTest({ attackerSuccesses = 0, defenderSuccesses = 0 } = {}) {
  const attacker = sr2NormalizeSuccesses(attackerSuccesses);
  const defender = sr2NormalizeSuccesses(defenderSuccesses);
  const attackerHits = attacker >= defender;
  const netSuccesses = Math.abs(attacker - defender);

  return {
    attackerHits,
    hitter: attackerHits ? "attacker" : "defender",
    netSuccesses,
    stageUp: Math.trunc(netSuccesses / 2),
  };
}

// SR2 melee damage is first staged up from the opposed test, then staged down by 1 level per 2 resistance successes.
export function sr2ResolveMeleeDamage({
  baseDamageLevel,
  opposedStageUp = 0,
  resistanceSuccesses = 0,
} = {}) {
  const stagedLevel = sr2StageDamageLevel(baseDamageLevel, opposedStageUp);
  const stageDown = Math.trunc(sr2NormalizeSuccesses(resistanceSuccesses) / 2);
  const finalLevel = stagedLevel ? sr2StageDamageLevel(stagedLevel, -stageDown) : null;

  return {
    stagedLevel,
    finalLevel,
    boxes: finalLevel ? (SR2_DAMAGE_BOXES_BY_LEVEL[finalLevel] ?? 0) : 0,
    stageDown,
  };
}

// SR2 called shots add +4 TN and either stage damage up one level or target a specific sub-location.
export function sr2ApplyCalledShot({
  baseTargetNumber = 4,
  baseDamageLevel,
  mode = "damage",
  enabled = true,
} = {}) {
  const normalizedMode = String(mode || "damage")
    .trim()
    .toLowerCase();
  const calledShotTargetNumber = Math.max(2, (Number(baseTargetNumber) || 4) + (enabled ? 4 : 0));
  const finalDamageLevel =
    enabled && normalizedMode === "damage"
      ? sr2StageDamageLevel(baseDamageLevel, 1)
      : sr2NormalizeDamageLevel(baseDamageLevel);

  return {
    calledShotTargetNumber,
    finalDamageLevel,
    damageLevelIncreased: enabled && normalizedMode === "damage",
    mode: normalizedMode,
  };
}
