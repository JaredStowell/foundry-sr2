import { beforeEach, describe, expect, it, vi } from "vitest";

import { registerPoolAutoRefreshHooks } from "../../../scripts/hooks/pool-auto-refresh.js";

beforeEach(() => {
  Hooks.__reset();
  Hooks.on.mockClear();
  delete globalThis.__sr2PoolAutoRefreshHooksInstalled;
  game.user = { id: "U1", isGM: false };
  game.settings = {
    get: vi.fn(() => true),
  };
});

describe("registerPoolAutoRefreshHooks", () => {
  it("registers updateCombat once", () => {
    registerPoolAutoRefreshHooks();
    registerPoolAutoRefreshHooks();
    expect(Hooks.on).toHaveBeenCalledTimes(1);
  });

  it("refreshes pools on started combat turn/round changes", async () => {
    registerPoolAutoRefreshHooks();
    const [updateCombatHook] = Hooks.__get("updateCombat");

    const actor = {
      isOwner: true,
      system: {
        pools: {
          combat: { current: 0, max: 4 },
        },
      },
      update: vi.fn().mockResolvedValue(undefined),
    };
    const combat = {
      started: true,
      combatant: { actor },
    };

    await updateCombatHook(combat, { turn: 1 });
    expect(actor.update).toHaveBeenCalledWith(
      { "system.pools.combat.current": 4 },
      { sr2AutoRefreshPools: true },
    );
  });

  it("skips refresh when disabled, not started, or irrelevant update", async () => {
    registerPoolAutoRefreshHooks();
    const [updateCombatHook] = Hooks.__get("updateCombat");

    const actor = {
      isOwner: true,
      system: {
        pools: {
          combat: { current: 0, max: 4 },
        },
      },
      update: vi.fn().mockResolvedValue(undefined),
    };
    const combat = {
      started: true,
      combatant: { actor },
    };

    game.settings.get.mockReturnValueOnce(false);
    await updateCombatHook(combat, { turn: 1 });

    game.settings.get.mockReturnValue(true);
    await updateCombatHook({ ...combat, started: false }, { turn: 1 });
    await updateCombatHook(combat, { scene: "x" });

    expect(actor.update).not.toHaveBeenCalled();
  });

  it("falls back to default setting when settings lookup throws", async () => {
    registerPoolAutoRefreshHooks();
    const [updateCombatHook] = Hooks.__get("updateCombat");

    game.settings.get.mockImplementation(() => {
      throw new Error("settings unavailable");
    });

    const actor = {
      isOwner: true,
      system: {
        pools: {
          combat: { current: 1, max: 2 },
        },
      },
      update: vi.fn().mockResolvedValue(undefined),
    };
    await updateCombatHook({ started: true, combatant: { actor } }, { round: 1 });
    expect(actor.update).toHaveBeenCalled();
  });

  it("refreshes pools when the SR2 encounter phase changes", async () => {
    registerPoolAutoRefreshHooks();
    const [updateCombatHook] = Hooks.__get("updateCombat");

    const actor = {
      isOwner: true,
      system: {
        pools: {
          combat: { current: 0, max: 4 },
        },
      },
      update: vi.fn().mockResolvedValue(undefined),
    };

    await updateCombatHook(
      { started: true, combatant: { actor } },
      { flags: { shadowrun2e: { sr2: { currentPhase: 11 } } } },
    );

    expect(actor.update).toHaveBeenCalledWith(
      { "system.pools.combat.current": 4 },
      { sr2AutoRefreshPools: true },
    );
  });
});
