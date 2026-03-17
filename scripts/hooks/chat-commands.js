const SR2_CHAT_COMMAND_HOOKS_KEY = "__sr2ChatCommandHooksInstalled";
const SR2_RTN_COMMAND_REGEX = /^\/rtn(?:\s|$)/i;
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

export async function sr2ExecuteRtnCommand(parsedCommand, chatData = {}) {
  const { formula, targetNumber } = parsedCommand;

  try {
    const roll = new Roll(formula);
    await roll.evaluate({ async: true });

    const total = Number(roll.total) || 0;
    const success = total >= targetNumber;
    const outcome = success ? "Success" : "Failure";

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

export function registerChatCommandHooks() {
  if (globalThis[SR2_CHAT_COMMAND_HOOKS_KEY]) return;
  globalThis[SR2_CHAT_COMMAND_HOOKS_KEY] = true;
  Hooks.on("chatMessage", sr2HandleRtnChatMessage);
}
