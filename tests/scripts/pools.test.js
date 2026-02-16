import { describe, expect, it, vi } from "vitest";

import {
    sr2BuildActionPoolRefreshUpdate,
    sr2CanUserUpdateActor,
    sr2GetDicePoolCurrent,
    sr2GetDicePoolMax,
    sr2RefreshActionPools
} from "../../scripts/pools.js";

describe("sr2GetDicePoolMax", () => {
    it("reads max for action pools and total for karma", () => {
        expect(sr2GetDicePoolMax({ max: 6 }, "combat")).toBe(6);
        expect(sr2GetDicePoolMax({ total: 3 }, "karma")).toBe(3);
        expect(sr2GetDicePoolMax(null, "combat")).toBe(0);
        expect(sr2GetDicePoolMax({ max: -4 }, "combat")).toBe(0);
    });
});

describe("sr2GetDicePoolCurrent", () => {
    it("returns a non-negative current value", () => {
        expect(sr2GetDicePoolCurrent({ current: 4 })).toBe(4);
        expect(sr2GetDicePoolCurrent({ current: -4 })).toBe(0);
        expect(sr2GetDicePoolCurrent({})).toBe(0);
    });
});

describe("sr2BuildActionPoolRefreshUpdate", () => {
    it("builds update data only for out-of-sync pools", () => {
        const actor = {
            system: {
                pools: {
                    combat: { current: 1, max: 4 },
                    spell: { current: 2, max: 2 },
                    hacking: { current: 0, max: 3 }
                }
            }
        };

        expect(sr2BuildActionPoolRefreshUpdate(actor)).toEqual({
            "system.pools.combat.current": 4,
            "system.pools.hacking.current": 3
        });
    });
});

describe("sr2CanUserUpdateActor", () => {
    it("allows owner or gm and denies others", () => {
        game.user.isGM = false;
        expect(sr2CanUserUpdateActor({ isOwner: true })).toBe(true);
        expect(sr2CanUserUpdateActor({ isOwner: false })).toBe(false);

        game.user.isGM = true;
        expect(sr2CanUserUpdateActor({ isOwner: false })).toBe(true);
    });

    it("returns false if permission checks throw", () => {
        const actor = {};
        Object.defineProperty(actor, "isOwner", {
            get() {
                throw new Error("bad access");
            }
        });
        expect(sr2CanUserUpdateActor(actor)).toBe(false);
    });
});

describe("sr2RefreshActionPools", () => {
    it("updates actor pools and tags update options", async () => {
        const update = vi.fn().mockResolvedValue(undefined);
        const actor = {
            isOwner: true,
            system: {
                pools: {
                    combat: { current: 1, max: 3 }
                }
            },
            update
        };

        const result = await sr2RefreshActionPools(actor, { diff: false });

        expect(result).toBe(true);
        expect(update).toHaveBeenCalledWith(
            { "system.pools.combat.current": 3 },
            { diff: false, sr2AutoRefreshPools: true }
        );
    });

    it("skips update when nothing changed", async () => {
        const update = vi.fn().mockResolvedValue(undefined);
        const actor = {
            isOwner: true,
            system: {
                pools: {
                    combat: { current: 3, max: 3 }
                }
            },
            update
        };

        const result = await sr2RefreshActionPools(actor);
        expect(result).toBe(false);
        expect(update).not.toHaveBeenCalled();
    });

    it("returns false for null actor and update failures", async () => {
        expect(await sr2RefreshActionPools(null)).toBe(false);

        const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
        const actor = {
            isOwner: true,
            name: "Runner",
            system: {
                pools: {
                    combat: { current: 1, max: 3 }
                }
            },
            update: vi.fn().mockRejectedValue(new Error("boom"))
        };

        await expect(sr2RefreshActionPools(actor)).resolves.toBe(false);
        expect(warnSpy).toHaveBeenCalled();
        warnSpy.mockRestore();
    });
});
