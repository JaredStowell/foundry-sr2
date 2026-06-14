const SR2_CHAT_COMMAND_HOOKS_KEY = "__sr2ChatCommandHooksInstalled";
const SR2_RTN_COMMAND_REGEX = /^\/rtn(?:\s|$)/i;
const SR2_RTN_CHAT_COMMAND_REGEX = /^\/rtn(?:\s+(.+))?$/i;
const SR2_RTN_USAGE = "Usage: /rtn <diceFormula> <targetNumber> (example: /rtn 1d6+4 5)";

function sr2EscapeHtml(value) {
  const escapeHTML = globalThis.foundry?.utils?.escapeHTML;
  if (typeof escapeHTML === "function") return escapeHTML(String(value ?? ""));
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function sr2ParseRtnCommand(messageText) {
  const content = String(messageText ?? "").trim();
  if (!SR2_RTN_COMMAND_REGEX.test(content)) return null;

  const args = content.replace(/^\/rtn/i, "").trim();
  if (!args) return { error: SR2_RTN_USAGE };

  const match = args.match(/^(.+)\s+(-?\d+)$/);
  if (!match) return { error: SR2_RTN_USAGE };

  const formula = String(match[1] ?? "").trim();
  const targetNumber = Number.parseInt(match[2], 10);

  if (!formula) return { error: SR2_RTN_USAGE };
  if (!Number.isFinite(targetNumber)) {
    return { error: "Target number must be an integer." };
  }

  return { formula, targetNumber };
}

function sr2GetRollResultValue(result) {
  if (typeof result === "number") return result;
  if (!result || typeof result !== "object") return null;
  if (result.active === false || result.discarded === true) return null;

  const value = Number(result.result ?? result.value ?? result.total);
  return Number.isFinite(value) ? value : null;
}

export function sr2CountRtnSuccesses(roll, targetNumber) {
  const diceTerms = Array.isArray(roll?.dice) ? roll.dice : [];
  let successes = 0;

  for (const die of diceTerms) {
    const results = Array.isArray(die?.results) ? die.results : [];
    for (const result of results) {
      const value = sr2GetRollResultValue(result);
      if (value !== null && value >= targetNumber) successes++;
    }
  }

  return successes;
}

function sr2GetChatLogCommandRegistry() {
  const ChatLogClass =
    globalThis.ChatLog ??
    globalThis.foundry?.applications?.sidebar?.tabs?.ChatLog ??
    globalThis.ui?.chat?.constructor;
  const commands = ChatLogClass?.CHAT_COMMANDS;
  return commands && typeof commands === "object" ? commands : null;
}

function sr2GetRtnCommandMessageText(command, match) {
  if (typeof match === "string") return match;
  if (Array.isArray(match)) {
    const firstMatch = match[0];
    if (typeof firstMatch === "string") return firstMatch;
    if (Array.isArray(firstMatch) && typeof firstMatch[0] === "string") return firstMatch[0];
  }
  return `/${command || "rtn"}`;
}

export async function sr2ExecuteRtnCommand(parsedCommand, chatData = {}) {
  const { formula, targetNumber } = parsedCommand;

  try {
    const roll = new Roll(formula);
    await roll.evaluate({ async: true });

    const total = Number(roll.total) || 0;
    const successes = sr2CountRtnSuccesses(roll, targetNumber);
    const success = successes > 0;
    const outcome = `${successes} success${successes === 1 ? "" : "es"}`;

    const speaker = chatData?.speaker ??
      globalThis.ChatMessage?.getSpeaker?.() ?? { alias: game?.user?.name };
    const safeFormula = sr2EscapeHtml(formula);

    await roll.toMessage({
      speaker,
      flavor: `
        <div class="sr2-rtn-result">
          <h3>Target Number Roll</h3>
          <p><strong>Formula:</strong> <code>${safeFormula}</code></p>
          <p><strong>Target Number:</strong> ${targetNumber}</p>
          <p><strong>Outcome:</strong> ${outcome}</p>
        </div>
      `,
      flags: {
        shadowrun2e: {
          rtn: {
            formula,
            targetNumber,
            total,
            successes,
            success,
          },
        },
      },
    });
  } catch (error) {
    console.error("SR2E | /rtn command failed", error);
    ui.notifications.error(`Failed to roll /rtn command: ${formula}`);
  }
}

export async function sr2HandleRtnChatCommand(command, match, chatData = {}) {
  const messageText = sr2GetRtnCommandMessageText(command, match);
  const parsed = sr2ParseRtnCommand(messageText);
  if (!parsed) return;

  if (parsed.error) {
    ui.notifications.warn(parsed.error);
    return false;
  }

  await sr2ExecuteRtnCommand(parsed, chatData);
  return false;
}

export function sr2HandleRtnChatMessage(chatLog, messageText, chatData) {
  const parsed = sr2ParseRtnCommand(messageText);
  if (!parsed) return true;

  if (parsed.error) {
    ui.notifications.warn(parsed.error);
    return false;
  }

  void sr2ExecuteRtnCommand(parsed, chatData);
  return false;
}

export function sr2RegisterRtnChatCommand() {
  const commands = sr2GetChatLogCommandRegistry();
  if (!commands) return false;

  commands.rtn = {
    rgx: SR2_RTN_CHAT_COMMAND_REGEX,
    fn: sr2HandleRtnChatCommand,
  };
  return true;
}

export function registerChatCommandHooks() {
  if (globalThis[SR2_CHAT_COMMAND_HOOKS_KEY]) return;
  globalThis[SR2_CHAT_COMMAND_HOOKS_KEY] = true;
  if (sr2RegisterRtnChatCommand()) return;
  Hooks.on("chatMessage", sr2HandleRtnChatMessage);
}
