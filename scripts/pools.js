export const SR2_ACTION_POOL_KEYS = ["combat", "spell", "hacking", "control", "task", "astral"];

export function sr2GetDicePoolMax(pool, key = "") {
    if (!pool || typeof pool !== "object") return 0;
    const maxKey = key === "karma" ? "total" : "max";
    const rawMax = Number(pool[maxKey]);
    return Number.isFinite(rawMax) ? Math.max(0, rawMax) : 0;
}

export function sr2GetDicePoolCurrent(pool) {
    if (!pool || typeof pool !== "object") return 0;
    const raw = Number(pool.current);
    return Number.isFinite(raw) ? Math.max(0, raw) : 0;
}

export function sr2BuildActionPoolRefreshUpdate(actor) {
    const pools = actor?.system?.pools;
    if (!pools || typeof pools !== "object") return null;

    const updateData = {};
    for (const key of SR2_ACTION_POOL_KEYS) {
        const pool = pools[key];
        if (!pool) continue;

        const max = sr2GetDicePoolMax(pool, key);
        const current = sr2GetDicePoolCurrent(pool);
        if (current !== max) {
            updateData[`system.pools.${key}.current`] = max;
        }
    }

    return Object.keys(updateData).length ? updateData : null;
}

export function sr2CanUserUpdateActor(actor) {
    try {
        return Boolean(actor?.isOwner || game?.user?.isGM);
    } catch (err) {
        return false;
    }
}

export async function sr2RefreshActionPools(actor, options = {}) {
    if (!actor) return false;
    if (!sr2CanUserUpdateActor(actor)) return false;

    const updateData = sr2BuildActionPoolRefreshUpdate(actor);
    if (!updateData) return false;

    try {
        await actor.update(updateData, { ...options, sr2AutoRefreshPools: true });
        return true;
    } catch (error) {
        console.warn("SR2E | Failed to auto-refresh dice pools:", actor?.name, error);
        return false;
    }
}
