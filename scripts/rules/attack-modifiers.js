export const SR2_VISIBILITY_MODIFIERS = Object.freeze({
  clear: Object.freeze({
    normal: 0,
    lowLightNatural: 0,
    lowLightCyber: 0,
    thermoNatural: 0,
    thermoCyber: 0,
  }),
  fullDarkness: Object.freeze({
    normal: 8,
    lowLightNatural: 8,
    lowLightCyber: 8,
    thermoNatural: 2,
    thermoCyber: 4,
  }),
  minimalLight: Object.freeze({
    normal: 6,
    lowLightNatural: 2,
    lowLightCyber: 4,
    thermoNatural: 2,
    thermoCyber: 4,
  }),
  partialLight: Object.freeze({
    normal: 2,
    lowLightNatural: 0,
    lowLightCyber: 1,
    thermoNatural: 1,
    thermoCyber: 2,
  }),
  glare: Object.freeze({
    normal: 2,
    lowLightNatural: 2,
    lowLightCyber: 4,
    thermoNatural: 2,
    thermoCyber: 4,
  }),
  mist: Object.freeze({
    normal: 2,
    lowLightNatural: 0,
    lowLightCyber: 2,
    thermoNatural: 0,
    thermoCyber: 0,
  }),
  lightSmokeFogRain: Object.freeze({
    normal: 4,
    lowLightNatural: 2,
    lowLightCyber: 4,
    thermoNatural: 0,
    thermoCyber: 0,
  }),
  heavySmokeFogRain: Object.freeze({
    normal: 6,
    lowLightNatural: 4,
    lowLightCyber: 6,
    thermoNatural: 0,
    thermoCyber: 1,
  }),
});

function sr2NormalizeNumber(value) {
  return Number(value) || 0;
}

// SR2 visibility modifiers use the condition table, with separate values for natural and cyber-assisted vision.
export function sr2GetVisibilityModifier({
  condition = "clear",
  visionMode = "normal",
  naturalVision = true,
} = {}) {
  const row =
    SR2_VISIBILITY_MODIFIERS[String(condition || "clear")] || SR2_VISIBILITY_MODIFIERS.clear;
  const normalizedVisionMode = String(visionMode || "normal").toLowerCase();
  const key =
    normalizedVisionMode === "low-light"
      ? naturalVision
        ? "lowLightNatural"
        : "lowLightCyber"
      : normalizedVisionMode === "thermographic"
        ? naturalVision
          ? "thermoNatural"
          : "thermoCyber"
        : "normal";
  return row[key] ?? 0;
}

// SR2 attacker and target movement modifiers follow the ranged combat modifier table.
export function sr2GetMovementModifier({
  role = "attacker",
  movement = "normal",
  difficultGround = false,
} = {}) {
  const normalizedRole = String(role || "attacker").toLowerCase();
  const normalizedMovement = String(movement || "normal").toLowerCase();

  if (normalizedRole === "target") {
    if (normalizedMovement === "stationary") return -1;
    if (normalizedMovement === "running") return 2;
    return 0;
  }

  if (normalizedMovement === "walking") return difficultGround ? 2 : 1;
  if (normalizedMovement === "running") return difficultGround ? 6 : 4;
  return 0;
}

// SR2 ranged attack accessories do not stack; use the best available bonus, and dual-wielding negates them.
export function sr2GetAccessoryModifier({
  smartlink = false,
  smartGoggles = false,
  laserSight = false,
  dualWielding = false,
} = {}) {
  if (dualWielding) return 0;
  if (smartlink) return -2;
  if (smartGoggles || laserSight) return -1;
  return 0;
}

// SR2 recoil is mode-dependent: SA adds +1 on the second shot, BF adds +3 per burst, FA adds +1 per round.
export function sr2ComputeRecoilModifier({
  fireMode = "SS",
  shotsThisPhase = 1,
  burstsThisPhase = 1,
  roundsFiredThisPhase = 0,
  recoilCompensation = 0,
  heavyWeapon = false,
} = {}) {
  const normalizedMode = String(fireMode || "SS").toUpperCase();
  let rawModifier = 0;

  if (normalizedMode === "SA") {
    rawModifier = Math.max(0, Math.floor(shotsThisPhase) - 1);
  } else if (normalizedMode === "BF") {
    rawModifier = Math.max(0, Math.floor(burstsThisPhase)) * 3;
  } else if (normalizedMode === "FA") {
    rawModifier = Math.max(0, Math.floor(roundsFiredThisPhase));
  }

  const uncompensated = Math.max(0, rawModifier - Math.max(0, Math.floor(recoilCompensation)));
  return heavyWeapon ? uncompensated * 2 : uncompensated;
}

// SR2 called shots add +4 TN whether they raise the damage level or target a specific sub-location.
export function sr2GetCalledShotTargetNumberModifier(enabled = false) {
  return enabled ? 4 : 0;
}

// SR2 ranged attack TN adds the situational modifier stack to the base TN, including wound penalties.
export function sr2BuildRangedModifierSummary({
  baseTargetNumber = 4,
  recoilModifier = 0,
  visibilityModifier = 0,
  coverModifier = 0,
  multipleTargetsModifier = 0,
  targetMovementModifier = 0,
  attackerMeleeModifier = 0,
  attackerMovementModifier = 0,
  accessoriesModifier = 0,
  otherModifier = 0,
  woundModifier = 0,
  calledShotModifier = 0,
} = {}) {
  const parts = [
    { label: "Recoil", value: sr2NormalizeNumber(recoilModifier) },
    { label: "Visibility", value: sr2NormalizeNumber(visibilityModifier) },
    { label: "Cover", value: sr2NormalizeNumber(coverModifier) },
    { label: "Multiple Targets", value: sr2NormalizeNumber(multipleTargetsModifier) },
    { label: "Target Movement", value: sr2NormalizeNumber(targetMovementModifier) },
    { label: "Attacker in Melee", value: sr2NormalizeNumber(attackerMeleeModifier) },
    { label: "Attacker Movement", value: sr2NormalizeNumber(attackerMovementModifier) },
    { label: "Accessories", value: sr2NormalizeNumber(accessoriesModifier) },
    { label: "Other", value: sr2NormalizeNumber(otherModifier) },
    { label: "Wounds", value: sr2NormalizeNumber(woundModifier) },
    { label: "Called Shot", value: sr2NormalizeNumber(calledShotModifier) },
  ];

  const totalModifier = parts.reduce((sum, part) => sum + part.value, 0);
  return {
    baseTargetNumber: Math.max(2, sr2NormalizeNumber(baseTargetNumber) || 4),
    totalModifier,
    finalTargetNumber: Math.max(2, (sr2NormalizeNumber(baseTargetNumber) || 4) + totalModifier),
    parts: parts.filter((part) => part.value !== 0),
  };
}
