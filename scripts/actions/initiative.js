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
