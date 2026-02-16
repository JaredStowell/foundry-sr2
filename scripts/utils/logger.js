const SR2_SYSTEM_ID = "shadowrun2e";
const SR2_DEBUG_SETTING = "debugLogging";

function sr2GetDebugLoggingEnabled() {
    try {
        return Boolean(globalThis.game?.settings?.get(SR2_SYSTEM_ID, SR2_DEBUG_SETTING));
    } catch (err) {
        return false;
    }
}

function sr2PrefixArgs(args) {
    return ["SR2E |", ...args];
}

export function sr2LogDebug(...args) {
    if (!sr2GetDebugLoggingEnabled()) return;
    console.log(...sr2PrefixArgs(args));
}

export function sr2LogInfo(...args) {
    console.info(...sr2PrefixArgs(args));
}

export function sr2LogWarn(...args) {
    console.warn(...sr2PrefixArgs(args));
}

export function sr2LogError(...args) {
    console.error(...sr2PrefixArgs(args));
}
