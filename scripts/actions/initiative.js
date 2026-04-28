import {
  sr2AdvanceEncounterPhase as sr2AdvanceEncounterPhaseState,
  sr2DelayEncounterAction as sr2DelayEncounterCombatAction,
} from "../combat/sr2-combat.js";

export function sr2GetInitiativeTerms(actor) {
  const initiative = actor?.system?.initiative || {};

  let initiativeDice = parseInt(initiative.dice, 10);
  if (!Number.isFinite(initiativeDice) || initiativeDice < 1) initiativeDice = 1;
  if (initiativeDice > 10) initiativeDice = 10;

  const baseFromReaction = actor?.system?.attributes?.reaction?.value;
  let initiativeBase = parseInt(initiative.base ?? baseFromReaction ?? 0, 10);
  if (!Number.isFinite(initiativeBase) || initiativeBase < 0) initiativeBase = 0;

  return {
    dice: initiativeDice,
    base: initiativeBase,
    formula: `${initiativeDice}d6 + ${initiativeBase}`,
    compactFormula: `${initiativeDice}d6+${initiativeBase}`,
  };
}

function sr2GetCombatsArray() {
  const combats = game?.combats;
  if (!combats) return [];
  if (Array.isArray(combats)) return combats;
  if (typeof combats.contents !== "undefined") return Array.from(combats.contents || []);
  if (typeof combats.values === "function") return Array.from(combats.values());
  return Array.from(combats);
}

function sr2GetSceneIdFromToken(token) {
  return (
    token?.scene?.id ??
    token?.document?.parent?.id ??
    token?.parent?.id ??
    canvas?.scene?.id ??
    null
  );
}

function sr2GetActorEncounterToken(actor, token = null) {
  if (token?.actor && (!actor || token.actor === actor)) return token;
  if (!actor || !canvas?.scene) return null;

  const activeTokens = actor.getActiveTokens?.(true) ?? [];
  const currentSceneId = canvas.scene.id;
  return (
    activeTokens.find((activeToken) => sr2GetSceneIdFromToken(activeToken) === currentSceneId) ??
    null
  );
}

function sr2GetSceneCombat(sceneId) {
  if (!sceneId) return null;
  return (
    sr2GetCombatsArray().find(
      (combat) =>
        (combat?.scene?.id ?? combat?.scene) === sceneId &&
        (combat?.active ?? combat?.isActive ?? true),
    ) ?? null
  );
}

async function sr2CreateSceneCombat(sceneId) {
  const CombatDocument = CONFIG?.Combat?.documentClass ?? globalThis.Combat;
  if (!CombatDocument?.create) {
    throw new Error("Combat document class is unavailable");
  }
  return CombatDocument.create({ scene: sceneId, active: true });
}

function sr2FindTokenCombatant(combat, token) {
  const combatants = combat?.combatants;
  if (!combatants) return null;
  const allCombatants =
    typeof combatants.contents !== "undefined"
      ? Array.from(combatants.contents || [])
      : Array.isArray(combatants)
        ? combatants
        : typeof combatants.values === "function"
          ? Array.from(combatants.values())
          : Array.from(combatants);
  return (
    allCombatants.find(
      (combatant) => combatant?.tokenId === token?.id || combatant?.token?.id === token?.id,
    ) ?? null
  );
}

// SR2: Initiative in play is tracked on a token in the active scene, not as an actor-only roll detached from the encounter.
export async function ensureEncounterCombatant({
  actor,
  token = null,
  createCombat = true,
  createCombatant = true,
  notify = true,
} = {}) {
  const resolvedToken = sr2GetActorEncounterToken(actor, token);
  if (!resolvedToken) {
    if (notify) ui.notifications.warn("Initiative requires an active token in the current scene.");
    return { ok: false, reason: "missing-token" };
  }

  const sceneId = sr2GetSceneIdFromToken(resolvedToken);
  if (!sceneId) {
    if (notify) ui.notifications.warn("Could not determine the current scene for initiative.");
    return { ok: false, reason: "missing-scene" };
  }

  let combat = sr2GetSceneCombat(sceneId);
  if (!combat && createCombat) {
    combat = await sr2CreateSceneCombat(sceneId);
  }
  if (!combat) {
    if (notify) ui.notifications.warn("No active Encounter was found for this scene.");
    return { ok: false, reason: "missing-combat" };
  }

  let combatant = sr2FindTokenCombatant(combat, resolvedToken);
  if (!combatant && createCombatant) {
    const created = await combat.createEmbeddedDocuments("Combatant", [
      {
        tokenId: resolvedToken.id,
        actorId: actor?.id ?? resolvedToken.actor?.id ?? null,
      },
    ]);
    combatant = Array.isArray(created) ? (created[0] ?? null) : (created ?? null);
  }

  if (!combatant) {
    if (notify) {
      const message = createCombatant
        ? "Failed to create an Encounter combatant for initiative."
        : "Actor is not in the active Encounter.";
      ui.notifications[createCombatant ? "error" : "warn"](message);
    }
    return { ok: false, reason: "missing-combatant" };
  }

  return {
    ok: true,
    combat,
    combatant,
    token: resolvedToken,
  };
}

// SR2: Rolling initiative joins the actor to the scene Encounter and delegates the actual roll to Foundry Combat.
export async function rollEncounterInitiative({ actor, token = null } = {}) {
  const ensured = await ensureEncounterCombatant({ actor, token, createCombat: true });
  if (!ensured.ok) return ensured;

  await ensured.combat.rollInitiative([ensured.combatant.id]);
  return ensured;
}

// SR2: Delayed actions are Encounter state changes, not sheet-local initiative edits.
export async function delayEncounterAction({ combat, combatant, toPhase } = {}) {
  if (!combat || !combatant) return { ok: false, reason: "missing-combatant" };
  await sr2DelayEncounterCombatAction({ combat, combatant, toPhase });
  return { ok: true, combat, combatant };
}

// SR2: Advancing initiative is phase-based and belongs to the active Encounter, not to the actor sheet.
export async function advanceEncounterPhase({ combat } = {}) {
  if (!combat) return { ok: false, reason: "missing-combat" };
  await sr2AdvanceEncounterPhaseState({ combat });
  return { ok: true, combat };
}

export async function sr2RollInitiativeToChat(actor, dependencies = {}) {
  const RollCtor = dependencies.Roll ?? globalThis.Roll;
  const ChatMessageCtor = dependencies.ChatMessage ?? globalThis.ChatMessage;
  const terms = sr2GetInitiativeTerms(actor);

  const roll = await new RollCtor(terms.formula).evaluate({ async: true });
  const speaker = ChatMessageCtor?.getSpeaker?.({ actor });
  const flavor = `${actor?.name || "Actor"} rolls Initiative (${terms.compactFormula})`;

  if (typeof dependencies.toMessage === "function") {
    await dependencies.toMessage(roll, { speaker, flavor });
  } else {
    await roll.toMessage({ speaker, flavor });
  }

  return { roll, terms, flavor, speaker };
}
