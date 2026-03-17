export const SR2_COMBAT_PHASE_INTERVAL = 10;
export const SR2_ACTION_ALLOWANCE = Object.freeze({
  free: 1,
  simple: 2,
  complex: 1,
});

function sr2BaseReaction({ quickness = 0, intelligence = 0, naturalReaction } = {}) {
  const explicit = Number(naturalReaction);
  if (Number.isFinite(explicit)) return explicit;
  return Math.floor(
    (Math.max(0, Number(quickness) || 0) + Math.max(0, Number(intelligence) || 0)) / 2,
  );
}

// SR2: Initiative uses adjusted Reaction; Matrix and rigging only apply their own bonuses plus wounds.
export function sr2ComputeAdjustedReaction({
  mode = "physical",
  quickness = 0,
  intelligence = 0,
  naturalReaction,
  reactionModifier = 0,
  woundModifier = 0,
  responseIncrease = 0,
  inputMode = "standard",
  vehicleControlRigReactionBonus = 0,
} = {}) {
  const baseReaction = sr2BaseReaction({ quickness, intelligence, naturalReaction });
  const wounds = Number(woundModifier) || 0;
  const normalizedMode = String(mode || "physical").toLowerCase();
  const normalizedInputMode = String(inputMode || "standard").toLowerCase();

  if (normalizedMode === "matrix") {
    const halvedReaction =
      normalizedInputMode === "keyboard" ? Math.max(1, Math.floor(baseReaction / 2)) : baseReaction;
    const responseReactionBonus =
      normalizedInputMode === "keyboard" ? 0 : Math.max(0, Number(responseIncrease) || 0) * 2;
    return halvedReaction + responseReactionBonus + wounds;
  }

  if (normalizedMode === "rigging") {
    return baseReaction + (Number(vehicleControlRigReactionBonus) || 0) + wounds;
  }

  return baseReaction + (Number(reactionModifier) || 0) + wounds;
}

// SR2: Base Initiative is 1D6; Matrix adds deck Response Increase dice and cybernetic command adds +1D6.
export function sr2ComputeInitiativeDice({
  mode = "physical",
  baseDice = 1,
  initiativeDiceBonus = 0,
  responseIncrease = 0,
  inputMode = "standard",
} = {}) {
  const normalizedMode = String(mode || "physical").toLowerCase();
  const normalizedInputMode = String(inputMode || "standard").toLowerCase();
  const base = Math.max(1, Number(baseDice) || 1);

  if (normalizedMode === "matrix") {
    const responseDice = Math.max(0, Number(responseIncrease) || 0);
    const cyberneticDice = normalizedInputMode === "cybernetic" ? 1 : 0;
    return base + responseDice + cyberneticDice;
  }

  return base + Math.max(0, Number(initiativeDiceBonus) || 0);
}

// SR2: Initiative total equals adjusted Reaction plus rolled Initiative dice.
export function sr2ComputeInitiativeTotal({
  adjustedReaction = 0,
  initiativeRollTotal = 0,
  initiativeDiceResults = [],
} = {}) {
  const rollTotal =
    Array.isArray(initiativeDiceResults) && initiativeDiceResults.length
      ? initiativeDiceResults.reduce((sum, value) => sum + (Number(value) || 0), 0)
      : Number(initiativeRollTotal) || 0;
  return (Number(adjustedReaction) || 0) + rollTotal;
}

// SR2: A character acts on Initiative total, then again every 10 phases while still above 0.
export function sr2GetCombatPhases(initiativeTotal) {
  const total = Math.max(0, Math.floor(Number(initiativeTotal) || 0));
  const phases = [];
  for (let phase = total; phase > 0; phase -= SR2_COMBAT_PHASE_INTERVAL) {
    phases.push(phase);
  }
  return phases;
}

// SR2: Additional actions occur 10 phases later if the next phase remains above 0.
export function sr2GetNextActionPhase(currentPhase) {
  const phase = Math.floor(Number(currentPhase) || 0) - SR2_COMBAT_PHASE_INTERVAL;
  return phase > 0 ? phase : null;
}

// SR2 action economy allows one Free, two Simple, or one Complex Action when you act.
export function sr2GetActionAllowance() {
  return { ...SR2_ACTION_ALLOWANCE };
}

// SR2 tie-breaks use adjusted Reaction, then natural Reaction, then simultaneous if still tied.
export function sr2CompareInitiativeTieBreak(a, b) {
  const adjustedA = Number(a?.adjustedReaction) || 0;
  const adjustedB = Number(b?.adjustedReaction) || 0;
  if (adjustedA !== adjustedB) return adjustedB - adjustedA;

  const naturalA = Number(a?.naturalReaction) || 0;
  const naturalB = Number(b?.naturalReaction) || 0;
  if (naturalA !== naturalB) return naturalB - naturalA;

  return String(a?.id || "").localeCompare(String(b?.id || ""));
}

// SR2 declarations happen from slowest to fastest within a shared phase.
export function sr2SortDeclarations(combatants) {
  return [...(combatants || [])].sort((a, b) => -sr2CompareInitiativeTieBreak(a, b));
}

// SR2 action resolution proceeds from fastest to slowest after declarations.
export function sr2SortResolutions(combatants) {
  return [...(combatants || [])].sort(sr2CompareInitiativeTieBreak);
}

// SR2 actors can act in their listed phases, or in the exact phase they delayed to.
export function sr2CanActInPhase({ initiativeTotal, currentPhase, delayedToPhase = null } = {}) {
  const phase = Math.floor(Number(currentPhase) || 0);
  if (phase <= 0) return false;
  if (delayedToPhase !== null && delayedToPhase !== undefined) {
    return phase === Math.floor(Number(delayedToPhase) || 0);
  }
  return sr2GetCombatPhases(initiativeTotal).includes(phase);
}

// SR2 delayed actions resolve before normal actions, then continue 10 phases later as usual.
export function sr2ResolveDelayedAction({ originalInitiativeTotal, interventionPhase } = {}) {
  const phase = Math.floor(Number(interventionPhase) || 0);
  return {
    actedPhase: phase,
    nextActionPhase: sr2GetNextActionPhase(phase),
    originalInitiativeTotal: Math.max(0, Math.floor(Number(originalInitiativeTotal) || 0)),
  };
}

// SR2 Combat Turns are built from the highest phase down, with declaration and resolution order per phase.
export function sr2BuildCombatTurn(combatants) {
  const normalizedCombatants = (combatants || []).map((combatant) => {
    const initiativeTotal = Math.max(0, Math.floor(Number(combatant?.initiativeTotal) || 0));
    return {
      ...combatant,
      initiativeTotal,
      actionPhases: sr2GetCombatPhases(initiativeTotal),
    };
  });

  const allPhases = Array.from(
    new Set(normalizedCombatants.flatMap((combatant) => combatant.actionPhases)),
  ).sort((a, b) => b - a);

  return {
    highestPhase: allPhases[0] ?? 0,
    phases: allPhases.map((phase) => {
      const active = normalizedCombatants.filter((combatant) =>
        combatant.actionPhases.includes(phase),
      );
      return {
        phase,
        declarations: sr2SortDeclarations(active),
        resolutions: sr2SortResolutions(active),
      };
    }),
  };
}
