export function sr2GetDefaultActionTypeForItem(itemType) {
  switch (String(itemType || "")) {
    case "weapon":
      return "attack";
    case "spell":
      return "cast";
    case "skill":
      return "base";
    case "adeptpower":
      return "activate";
    default:
      return "use";
  }
}

export function sr2NormalizeSkillRollType(actionType) {
  switch (String(actionType || "").toLowerCase()) {
    case "concentration":
      return "concentration";
    case "specialization":
      return "specialization";
    default:
      return "base";
  }
}

export function sr2BuildItemMacroCommand(actorId, itemId, actionType) {
  return `executeSR2Macro("${actorId}", "${itemId}", "${actionType}");`;
}

export function sr2BuildActorItemActionEvent(itemId, options = {}) {
  const skillId = options.skillId ?? itemId;
  const rollType = sr2NormalizeSkillRollType(options.rollType);

  return {
    preventDefault: options.preventDefault ?? (() => {}),
    stopPropagation: options.stopPropagation ?? (() => {}),
    currentTarget: {
      dataset: {
        itemId,
        skillId,
        rollType,
      },
    },
  };
}

function sr2GetActionHandlers(actor, handlers = {}) {
  const sheet = handlers.sheet ?? actor?.sheet ?? null;

  return {
    sheet,
    weaponAttack:
      handlers.weaponAttack ??
      (typeof sheet?._onWeaponAttack === "function" ? sheet._onWeaponAttack.bind(sheet) : null),
    spellCast:
      handlers.spellCast ??
      (typeof sheet?._onSpellCast === "function" ? sheet._onSpellCast.bind(sheet) : null),
    skillRoll:
      handlers.skillRoll ??
      (typeof sheet?._onSkillRoll === "function" ? sheet._onSkillRoll.bind(sheet) : null),
  };
}

export async function sr2ExecuteActorItemAction(actor, item, actionType = "default", options = {}) {
  if (!actor) {
    return { ok: false, reason: "missing-actor" };
  }

  if (!item) {
    return { ok: false, reason: "missing-item" };
  }

  const normalizedAction =
    actionType === "default" ? sr2GetDefaultActionTypeForItem(item.type) : String(actionType || "");
  const handlers = sr2GetActionHandlers(actor, options.handlers);

  switch (item.type) {
    case "weapon": {
      if (handlers.weaponAttack) {
        await handlers.weaponAttack(
          sr2BuildActorItemActionEvent(item.id, { rollType: normalizedAction }),
        );
        return { ok: true, mode: "handler", actionType: normalizedAction };
      }
      break;
    }
    case "spell": {
      if (handlers.spellCast) {
        await handlers.spellCast(
          sr2BuildActorItemActionEvent(item.id, { rollType: normalizedAction }),
        );
        return { ok: true, mode: "handler", actionType: normalizedAction };
      }
      break;
    }
    case "skill": {
      if (handlers.skillRoll) {
        await handlers.skillRoll(
          sr2BuildActorItemActionEvent(item.id, {
            skillId: item.id,
            rollType: sr2NormalizeSkillRollType(normalizedAction),
          }),
        );
        return {
          ok: true,
          mode: "handler",
          actionType: sr2NormalizeSkillRollType(normalizedAction),
        };
      }
      break;
    }
    default:
      break;
  }

  if (typeof item.roll === "function") {
    await item.roll();
    return { ok: true, mode: "fallback", actionType: normalizedAction };
  }

  return { ok: false, reason: "no-handler", actionType: normalizedAction };
}
