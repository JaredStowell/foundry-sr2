export function sr2GetMessageMode() {
  try {
    return game.settings.get("core", "messageMode");
  } catch (err) {
    try {
      return game.settings.get("core", "rollMode");
    } catch (fallbackErr) {
      return "public";
    }
  }
}

export function sr2ApplyMessageMode(chatData, mode = sr2GetMessageMode()) {
  if (globalThis.ChatMessage && typeof ChatMessage.applyMode === "function") {
    return ChatMessage.applyMode(chatData, mode);
  }
  return { ...chatData, rollMode: mode };
}
