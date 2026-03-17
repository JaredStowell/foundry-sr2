export const SR2_IC_REACTION_BASELINES = Object.freeze({
  blue: null,
  green: 5,
  orange: 7,
  red: 9,
});

export const SR2_VEHICLE_TERRAIN_MODIFIERS = Object.freeze({
  open: 0,
  normal: 1,
  restricted: 2,
  tight: 4,
});

export const SR2_CRASH_TERRAIN_MODIFIERS = Object.freeze({
  open: -1,
  normal: 0,
  tight: 2,
  restricted: 4,
});

export const SR2_ESCAPE_TERRAIN_MODIFIERS = Object.freeze({
  open: 4,
  normal: -2,
  restricted: 0,
  tight: 2,
});

export const SR2_VEHICLE_DAMAGE_MODIFIERS = Object.freeze({
  light: { testModifier: 1, initiativeModifier: -1, speedMultiplier: 1 },
  moderate: { testModifier: 2, initiativeModifier: -2, speedMultiplier: 0.75 },
  serious: { testModifier: 3, initiativeModifier: -3, speedMultiplier: 0.5 },
  destroyed: { testModifier: null, initiativeModifier: null, speedMultiplier: 0 },
});

// SR2 Matrix Reaction uses deck Response Increase; keyboard control halves Reaction and ignores that bonus.
export function sr2ComputeMatrixReaction({
  baseReaction = 0,
  responseIncrease = 0,
  inputMode = "standard",
  woundModifier = 0,
} = {}) {
  const reaction = Math.max(0, Number(baseReaction) || 0);
  const wounds = Number(woundModifier) || 0;
  const response = Math.max(0, Number(responseIncrease) || 0);
  const mode = String(inputMode || "standard").toLowerCase();

  if (mode === "keyboard") {
    return Math.max(1, Math.floor(reaction / 2)) + wounds;
  }

  return reaction + response * 2 + wounds;
}

// SR2 Matrix Initiative is 1D6 plus Response Increase dice, with +1D6 for pure cybernetic command.
export function sr2ComputeMatrixInitiativeDice({
  baseDice = 1,
  responseIncrease = 0,
  inputMode = "standard",
} = {}) {
  const base = Math.max(1, Number(baseDice) || 1);
  const response = Math.max(0, Number(responseIncrease) || 0);
  return base + response + (String(inputMode || "standard").toLowerCase() === "cybernetic" ? 1 : 0);
}

// SR2 IC initiative baseline is set by security color code, then increased by IC rating.
export function sr2ComputeICReactionBaseline(securityCode, icRating) {
  const base = SR2_IC_REACTION_BASELINES[String(securityCode || "").toLowerCase()];
  if (base == null) return null;
  return base + Math.max(0, Number(icRating) || 0);
}

// SR2 dump shock lasts 30 seconds, reduced by Willpower test successes.
export function sr2ComputeDumpShockDurationSeconds(successes) {
  const successCount = Math.max(0, Number(successes) || 0);
  if (successCount <= 0) return 30;
  return 30 / successCount;
}

// SR2 vehicle and chase tests apply terrain modifiers from the relevant table.
export function sr2GetVehicleTerrainModifier(terrain, table = SR2_VEHICLE_TERRAIN_MODIFIERS) {
  return table[String(terrain || "").toLowerCase()] ?? 0;
}

// SR2 vehicle-operation TN starts at Handling, then adds condition modifiers and subtracts VCR benefits.
export function sr2ComputeVehicleOperationTargetNumber({
  handling = 0,
  complexControls = false,
  unfamiliarVehicle = "none",
  largeVehicleModifier = 0,
  badConditions = 0,
  vcrLevel = 0,
} = {}) {
  let targetNumber = Math.max(2, Number(handling) || 0);
  if (complexControls) targetNumber += 1;
  if (unfamiliarVehicle === "nonstressful") targetNumber += 1;
  if (unfamiliarVehicle === "stressful") targetNumber += 3;
  targetNumber += Number(largeVehicleModifier) || 0;
  targetNumber += Number(badConditions) || 0;
  targetNumber -= Math.max(0, Number(vcrLevel) || 0) * 2;
  return Math.max(2, targetNumber);
}

// SR2 autopilot rolls against the same vehicle TN floor of 2.
export function sr2ComputeAutopilotTargetNumber(baseTargetNumber) {
  return Math.max(2, Number(baseTargetNumber) || 0);
}

// SR2 Position Tests use Handling plus the current terrain modifier.
export function sr2ComputePositionTestTargetNumber({ handling = 0, terrain = "normal" } = {}) {
  return Math.max(2, (Number(handling) || 0) + sr2GetVehicleTerrainModifier(terrain));
}

// SR2 chase distance gained this turn is successes times cruising speed.
export function sr2ComputePositionDistance(successes, cruisingSpeed) {
  return Math.max(0, Number(successes) || 0) * Math.max(0, Number(cruisingSpeed) || 0);
}

// SR2 Position Test successes buy attacks based on whether the driver chose fight or flight.
export function sr2ComputePositionAttacks({ stance = "flight", successes = 0 } = {}) {
  const successCount = Math.max(0, Number(successes) || 0);
  if (stance === "fight") return successCount;
  return Math.floor(successCount / 2);
}

// SR2 crash Power is based on cruising speed in tens of meters per Combat Turn.
export function sr2ComputeCrashPower(cruisingSpeed) {
  return Math.floor(Math.max(0, Number(cruisingSpeed) || 0) / 10);
}

// SR2 crash damage level steps up with cruising speed from Light through Deadly.
export function sr2GetCrashDamageLevel(cruisingSpeed) {
  const speed = Math.max(0, Number(cruisingSpeed) || 0);
  if (speed <= 20) return "L";
  if (speed <= 60) return "M";
  if (speed <= 200) return "S";
  return "D";
}

// SR2 vehicle crash resistance is crash Power minus armor, minimum TN 2.
export function sr2ComputeVehicleCrashResistanceTargetNumber({ crashPower = 0, armor = 0 } = {}) {
  return Math.max(2, (Number(crashPower) || 0) - (Number(armor) || 0));
}

// SR2 crash damage stages down by one level per two resistance successes.
export function sr2StageVehicleDamageLevel(level, resistanceSuccesses) {
  const levels = ["L", "M", "S", "D"];
  const baseIndex = levels.indexOf(String(level || "").toUpperCase());
  if (baseIndex < 0) return null;

  const stageDown = Math.floor(Math.max(0, Number(resistanceSuccesses) || 0) / 2);
  const finalIndex = baseIndex - stageDown;
  if (finalIndex < 0) return null;
  return levels[finalIndex];
}

// SR2 vehicle damage applies handling TN, initiative, and speed penalties by damage level.
export function sr2GetVehicleDamageModifiers(level) {
  return SR2_VEHICLE_DAMAGE_MODIFIERS[String(level || "").toLowerCase()] ?? null;
}

// SR2 Escape Tests use fleeing net successes plus terrain modifiers, minimum TN 2.
export function sr2ComputeEscapeTargetNumber({
  fleeingNetSuccesses = 0,
  terrain = "restricted",
} = {}) {
  return Math.max(
    2,
    Math.max(0, Number(fleeingNetSuccesses) || 0) +
      sr2GetVehicleTerrainModifier(terrain, SR2_ESCAPE_TERRAIN_MODIFIERS),
  );
}
