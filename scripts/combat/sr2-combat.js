import {
  sr2GetCombatPhases,
  sr2GetNextActionPhase,
  sr2SortDeclarations,
  sr2SortResolutions,
} from "../rules/combat-turn.js";

const SR2_FLAG_SCOPE = "shadowrun2e";
const SR2_COMBAT_FLAG_PATH = `flags.${SR2_FLAG_SCOPE}.sr2`;
const SR2_COMBATANT_FLAG_PATH = `flags.${SR2_FLAG_SCOPE}.sr2`;

function sr2GetCombatantsArray(combat) {
  const combatants = combat?.combatants;
  if (!combatants) return [];
  if (Array.isArray(combatants)) return combatants;
  if (typeof combatants.contents !== "undefined") return Array.from(combatants.contents || []);
  if (typeof combatants.values === "function") return Array.from(combatants.values());
  return Array.from(combatants);
}

function sr2GetCurrentCombatant(combat) {
  if (combat?.combatant) return combat.combatant;
  const turn = Number(combat?.turn);
  if (!Number.isInteger(turn) || turn < 0) return null;
  const turns = Array.isArray(combat?.turns) ? combat.turns : [];
  return turns[turn] ?? null;
}

function sr2NormalizePhase(value) {
  const phase = Math.floor(Number(value) || 0);
  return phase > 0 ? phase : null;
}

function sr2NormalizeCombatantFlagData(combatant) {
  const data = foundry.utils.getProperty(combatant, SR2_COMBATANT_FLAG_PATH) ?? {};
  const rolledInitiative = Math.max(0, Math.floor(Number(data.rolledInitiative) || 0));
  const actionPhases =
    Array.isArray(data.actionPhases) && data.actionPhases.length
      ? data.actionPhases.map((value) => sr2NormalizePhase(value)).filter((value) => value !== null)
      : sr2GetCombatPhases(rolledInitiative);
  const hasNextActionPhase = Object.prototype.hasOwnProperty.call(data, "nextActionPhase");
  const nextActionPhase = hasNextActionPhase
    ? sr2NormalizePhase(data.nextActionPhase)
    : (actionPhases.find((value) => value > 0) ?? null);

  return {
    rolledInitiative,
    adjustedReaction: Math.max(0, Number(data.adjustedReaction) || 0),
    naturalReaction: Math.max(0, Number(data.naturalReaction) || 0),
    actionPhases,
    nextPhaseIndex: Math.max(0, Number(data.nextPhaseIndex) || 0),
    nextActionPhase,
    delayedToPhase: sr2NormalizePhase(data.delayedToPhase),
    hasActedThisPhase: Boolean(data.hasActedThisPhase),
  };
}

function sr2GetActorAdjustedReaction(actor) {
  return Math.max(
    0,
    Number(actor?.system?.initiative?.base) ||
      Number(actor?.system?.attributes?.reaction?.value) ||
      0,
  );
}

function sr2GetActorNaturalReaction(actor) {
  return Math.max(0, Number(actor?.system?.attributes?.reaction?.value) || 0);
}

function sr2GetStableTieBreaker(id) {
  const text = String(id || "");
  let total = 0;
  for (let index = 0; index < text.length; index += 1) {
    total += text.charCodeAt(index);
  }
  return (total % 1000) / 1000000;
}

function sr2EncodeCombatantInitiative(phase, state, combatant) {
  const normalizedPhase = sr2NormalizePhase(phase);
  if (normalizedPhase === null) return null;

  return (
    normalizedPhase +
    Math.max(0, Number(state?.adjustedReaction) || 0) / 100 +
    Math.max(0, Number(state?.naturalReaction) || 0) / 10000 +
    sr2GetStableTieBreaker(combatant?.id)
  );
}

function sr2DetermineNextPhaseIndex(actionPhases, nextActionPhase) {
  const normalizedActionPhases = Array.isArray(actionPhases) ? actionPhases : [];
  const phase = sr2NormalizePhase(nextActionPhase);
  if (phase === null) return normalizedActionPhases.length;

  const exactIndex = normalizedActionPhases.findIndex((value) => value === phase);
  if (exactIndex >= 0) return exactIndex;

  const nextLowerIndex = normalizedActionPhases.findIndex((value) => value < phase);
  return nextLowerIndex >= 0 ? nextLowerIndex : normalizedActionPhases.length;
}

function sr2BuildCombatantSortData(combatant) {
  const actor = combatant?.actor;
  const state = sr2NormalizeCombatantFlagData(combatant);
  const nextActionPhase = sr2NormalizePhase(state.nextActionPhase);

  return {
    combatant,
    id: combatant?.id,
    nextActionPhase,
    adjustedReaction:
      state.adjustedReaction > 0 ? state.adjustedReaction : sr2GetActorAdjustedReaction(actor),
    naturalReaction:
      state.naturalReaction > 0 ? state.naturalReaction : sr2GetActorNaturalReaction(actor),
    delayedToPhase: sr2NormalizePhase(state.delayedToPhase),
    state,
  };
}

function sr2BuildEncounterPhaseState(combat) {
  const candidates = sr2GetCombatantsArray(combat)
    .map((combatant) => sr2BuildCombatantSortData(combatant))
    .filter((entry) => entry.nextActionPhase !== null);

  const currentPhase = candidates.reduce(
    (highest, entry) => Math.max(highest, entry.nextActionPhase || 0),
    0,
  );
  const activeCombatants = candidates.filter((entry) => entry.nextActionPhase === currentPhase);
  const delayedCombatants = activeCombatants.filter(
    (entry) => entry.delayedToPhase !== null && entry.delayedToPhase === currentPhase,
  );
  const normalCombatants = activeCombatants.filter(
    (entry) => !(entry.delayedToPhase !== null && entry.delayedToPhase === currentPhase),
  );
  const declarationOrder = sr2SortDeclarations(activeCombatants);
  const resolutionOrder = [
    ...sr2SortResolutions(delayedCombatants),
    ...sr2SortResolutions(normalCombatants),
  ];

  return {
    currentPhase: currentPhase > 0 ? currentPhase : null,
    declarationOrder,
    resolutionOrder,
    candidates,
  };
}

async function sr2ApplyEncounterOrdering(combat) {
  const { currentPhase, declarationOrder, resolutionOrder, candidates } =
    sr2BuildEncounterPhaseState(combat);
  const updates = candidates.map((entry) => {
    const nextActionPhase = sr2NormalizePhase(entry.nextActionPhase);
    const nextPhaseIndex = sr2DetermineNextPhaseIndex(entry.state.actionPhases, nextActionPhase);
    return {
      _id: entry.combatant.id,
      initiative: sr2EncodeCombatantInitiative(nextActionPhase, entry, entry.combatant),
      flags: {
        [SR2_FLAG_SCOPE]: {
          sr2: {
            ...entry.state,
            adjustedReaction: entry.adjustedReaction,
            naturalReaction: entry.naturalReaction,
            delayedToPhase: sr2NormalizePhase(entry.state.delayedToPhase),
            nextActionPhase,
            nextPhaseIndex,
            hasActedThisPhase: false,
          },
        },
      },
    };
  });
  const inactiveUpdates = sr2GetCombatantsArray(combat)
    .filter((combatant) => !candidates.some((entry) => entry.combatant.id === combatant.id))
    .map((combatant) => ({
      _id: combatant.id,
      initiative: null,
      flags: {
        [SR2_FLAG_SCOPE]: {
          sr2: {
            ...sr2NormalizeCombatantFlagData(combatant),
            nextActionPhase: null,
            nextPhaseIndex: sr2NormalizeCombatantFlagData(combatant).actionPhases.length,
            delayedToPhase: null,
            hasActedThisPhase: false,
          },
        },
      },
    }));

  if (updates.length || inactiveUpdates.length) {
    await combat.updateEmbeddedDocuments("Combatant", [...updates, ...inactiveUpdates]);
  }

  const currentCombatantId = resolutionOrder[0]?.id ?? null;
  const currentTurnIndex = Array.isArray(combat.turns)
    ? combat.turns.findIndex((combatant) => combatant?.id === currentCombatantId)
    : -1;

  await combat.update({
    turn: currentTurnIndex >= 0 ? currentTurnIndex : null,
    [SR2_COMBAT_FLAG_PATH]: {
      currentPhase,
      roundNumber: Math.max(1, Number(combat?.round) || 1),
      declarationPhaseOpen: currentPhase !== null,
      resolutionPhaseOpen: currentPhase !== null,
      declarationOrderIds: declarationOrder.map((entry) => entry.id),
      resolutionOrderIds: resolutionOrder.map((entry) => entry.id),
    },
  });

  return combat;
}

function sr2GetCombatRoundNumber(combat) {
  const round = Math.floor(Number(combat?.round) || 0);
  return round > 0 ? round : 1;
}

function sr2GetEncounterInitiativeCombatants(combat, ids = null) {
  const requestedIds = Array.isArray(ids)
    ? new Set(ids.map((value) => String(value)))
    : ids
      ? new Set([String(ids)])
      : null;

  return sr2GetCombatantsArray(combat).filter((combatant) => {
    if (!combatant?.tokenId) return false;
    if (requestedIds && !requestedIds.has(String(combatant.id))) return false;
    return Boolean(combatant.actor);
  });
}

// SR2: Initiative is rolled at the start of each Combat Turn, then converted into action phases every 10 counts.
export async function sr2InitializeEncounterCombatants(combat, ids = null) {
  const updates = sr2GetEncounterInitiativeCombatants(combat, ids).map((combatant) => {
    const rolledInitiative = Math.max(0, Math.floor(Number(combatant.initiative) || 0));
    const actionPhases = sr2GetCombatPhases(rolledInitiative);
    const actor = combatant.actor;

    return {
      _id: combatant.id,
      flags: {
        [SR2_FLAG_SCOPE]: {
          sr2: {
            rolledInitiative,
            adjustedReaction: sr2GetActorAdjustedReaction(actor),
            naturalReaction: sr2GetActorNaturalReaction(actor),
            actionPhases,
            nextPhaseIndex: 0,
            nextActionPhase: actionPhases[0] ?? null,
            delayedToPhase: null,
            hasActedThisPhase: false,
          },
        },
      },
    };
  });

  if (updates.length) {
    await combat.updateEmbeddedDocuments("Combatant", updates);
  }

  if (!combat?.started) {
    await combat.update({ round: sr2GetCombatRoundNumber(combat), turn: 0 });
  }

  return sr2ApplyEncounterOrdering(combat);
}

// SR2: Delaying moves the character's next action to a later phase in the same Combat Turn, then future actions continue from that delayed phase minus 10.
export async function sr2DelayEncounterAction({ combat, combatant, toPhase }) {
  const phase = sr2NormalizePhase(toPhase);
  if (!combat || !combatant || phase === null) return combat;

  const combatState = sr2BuildEncounterPhaseState(combat);
  const currentPhase = sr2NormalizePhase(combatState.currentPhase);
  if (currentPhase === null || phase >= currentPhase) return combat;

  const state = sr2NormalizeCombatantFlagData(combatant);
  await combat.updateEmbeddedDocuments("Combatant", [
    {
      _id: combatant.id,
      flags: {
        [SR2_FLAG_SCOPE]: {
          sr2: {
            ...state,
            delayedToPhase: phase,
            nextActionPhase: phase,
            nextPhaseIndex: sr2DetermineNextPhaseIndex(state.actionPhases, phase),
            hasActedThisPhase: false,
          },
        },
      },
    },
  ]);

  return sr2ApplyEncounterOrdering(combat);
}

async function sr2RollNewCombatTurn(combat) {
  const combatants = sr2GetEncounterInitiativeCombatants(combat);
  if (!combatants.length) {
    await combat.update({
      turn: null,
      [SR2_COMBAT_FLAG_PATH]: {
        currentPhase: null,
        roundNumber: sr2GetCombatRoundNumber(combat),
        declarationPhaseOpen: false,
        resolutionPhaseOpen: false,
        declarationOrderIds: [],
        resolutionOrderIds: [],
      },
    });
    return combat;
  }

  const nextRoundNumber = sr2GetCombatRoundNumber(combat) + 1;
  await combat.update({
    round: nextRoundNumber,
    turn: 0,
  });
  await combat.rollInitiative(combatants.map((combatant) => combatant.id));
  if (Number(combat.round) !== nextRoundNumber) {
    await combat.update({ round: nextRoundNumber, turn: 0 });
  }
  return combat;
}

// SR2: After acting, a combatant acts again 10 phases later while their next phase remains above 0.
export async function sr2AdvanceEncounterPhase({ combat } = {}) {
  if (!combat) return combat;

  const currentCombatant =
    sr2GetCurrentCombatant(combat) ??
    sr2BuildEncounterPhaseState(combat).resolutionOrder[0]?.combatant ??
    null;
  if (!currentCombatant) {
    return sr2RollNewCombatTurn(combat);
  }

  const state = sr2NormalizeCombatantFlagData(currentCombatant);
  const actedPhase = sr2NormalizePhase(state.delayedToPhase ?? state.nextActionPhase);
  const nextActionPhase = sr2GetNextActionPhase(actedPhase);

  await combat.updateEmbeddedDocuments("Combatant", [
    {
      _id: currentCombatant.id,
      flags: {
        [SR2_FLAG_SCOPE]: {
          sr2: {
            ...state,
            delayedToPhase: null,
            nextActionPhase,
            nextPhaseIndex: sr2DetermineNextPhaseIndex(state.actionPhases, nextActionPhase),
            hasActedThisPhase: true,
          },
        },
      },
    },
  ]);

  const updatedCombat = await sr2ApplyEncounterOrdering(combat);
  const nextPhase =
    foundry.utils.getProperty(updatedCombat, SR2_COMBAT_FLAG_PATH)?.currentPhase ?? null;
  if (nextPhase === null) {
    return sr2RollNewCombatTurn(updatedCombat);
  }
  return updatedCombat;
}

// SR2 Combat Turns are ordered by phase first, then Reaction tie-breaks inside the same phase.
export class SR2Combat extends Combat {
  async rollInitiative(ids, options = {}) {
    const result = (await super.rollInitiative(ids, options)) ?? this;
    await sr2InitializeEncounterCombatants(result, ids);
    return result;
  }

  async nextTurn() {
    return sr2AdvanceEncounterPhase({ combat: this });
  }

  async nextRound() {
    return sr2RollNewCombatTurn(this);
  }
}
