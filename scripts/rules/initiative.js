// Keep sheet/chat rolls and core Combat rolls on the same numeric terms.
export function sr2GetInitiativeTerms(actor) {
  const system = actor?.system ?? {};
  const initiative = system.initiative ?? {};
  const reaction = Number(system.attributes?.reaction?.value);
  let dice = Number(initiative.dice);
  let base = Number(initiative.base ?? reaction);

  if (["spirit", "critter", "ic"].includes(actor?.type)) {
    dice = 1;
    const formBonus = actor.type === "ic" ? 0 : system.spiritForm === "astral" ? 20 : 10;
    base = (Number.isFinite(reaction) ? reaction : 0) + formBonus;
  }

  dice = Number.isFinite(dice) ? Math.max(1, Math.min(10, Math.floor(dice))) : 1;
  if (!Number.isFinite(base)) base = Number.isFinite(reaction) ? reaction : 0;
  base = Math.max(0, Math.floor(base));

  return {
    dice,
    base,
    formula: `${dice}d6 + ${base}`,
    compactFormula: `${dice}d6+${base}`,
  };
}
