import { sr2RefreshActionPools } from "../pools.js";

const SR2_POOL_AUTO_REFRESH_HOOKS_KEY = "__sr2PoolAutoRefreshHooksInstalled";

function sr2GetSystemSetting(key, fallback) {
  try {
    return game?.settings?.get("shadowrun2e", key) ?? fallback;
  } catch (err) {
    return fallback;
  }
}

function sr2ShouldAutoRefreshPools() {
  return Boolean(sr2GetSystemSetting("autoRefreshPools", true));
}

export function registerPoolAutoRefreshHooks() {
  if (globalThis[SR2_POOL_AUTO_REFRESH_HOOKS_KEY]) return;
  globalThis[SR2_POOL_AUTO_REFRESH_HOOKS_KEY] = true;

  Hooks.on("updateCombat", async (combat, changes) => {
    if (!sr2ShouldAutoRefreshPools()) return;
    if (!combat?.started) return;

    const changed = changes && typeof changes === "object" ? changes : {};
    const hasTurnChange =
      Object.prototype.hasOwnProperty.call(changed, "turn") ||
      Object.prototype.hasOwnProperty.call(changed, "round") ||
      Object.prototype.hasOwnProperty.call(changed, "started");
    if (!hasTurnChange) return;

    const combatant = combat?.combatant;
    const actor = combatant?.actor;
    await sr2RefreshActionPools(actor);
  });
}
