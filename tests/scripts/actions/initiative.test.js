import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  advanceEncounterPhase,
  delayEncounterAction,
  ensureEncounterCombatant,
  rollEncounterInitiative,
  sr2GetInitiativeTerms,
  sr2RollInitiativeToChat,
} from "../../../scripts/actions/initiative.js";
import { SR2Combat } from "../../../scripts/combat/sr2-combat.js";

function createActor(data = {}) {
  return {
    id: data.id ?? "actor-1",
    name: data.name ?? "Runner",
    system: {
      initiative: {
        base: data.initiativeBase ?? 7,
        current: data.initiativeCurrent ?? 0,
      },
      attributes: {
        reaction: { value: data.reaction ?? data.initiativeBase ?? 7 },
      },
    },
    getActiveTokens: vi.fn(() => data.tokens ?? []),
    _mockInitiativeTotal: data.mockInitiativeTotal ?? null,
  };
}

describe("initiative helpers", () => {
  beforeEach(() => {
    ui.notifications.warn.mockClear();
    ui.notifications.error.mockClear();
    game.actors.__clear();
    game.combats.__clear();
    CONFIG.Combat.documentClass = SR2Combat;
    globalThis.canvas = {
      scene: { id: "scene-1" },
    };
  });

  it("normalizes initiative terms from actor data", () => {
    expect(
      sr2GetInitiativeTerms({
        system: {
          initiative: { dice: 0, base: -5 },
          attributes: { reaction: { value: 6 } },
        },
      }),
    ).toEqual({
      dice: 1,
      base: 0,
      formula: "1d6 + 0",
      compactFormula: "1d6+0",
    });

    expect(
      sr2GetInitiativeTerms({
        system: {
          initiative: { dice: 12 },
          attributes: { reaction: { value: 5 } },
        },
      }),
    ).toMatchObject({ dice: 10, base: 5 });
  });

  it("rolls initiative to chat through injected dependencies", async () => {
    const toMessage = vi.fn(async () => {});

    class FakeRoll {
      constructor(formula) {
        this.formula = formula;
      }

      async evaluate() {
        return this;
      }
    }

    const actor = {
      name: "Runner",
      system: {
        initiative: { dice: 3, base: 7 },
        attributes: { reaction: { value: 7 } },
      },
    };

    const result = await sr2RollInitiativeToChat(actor, {
      Roll: FakeRoll,
      ChatMessage: {
        getSpeaker: vi.fn(() => ({ alias: "Runner" })),
      },
      toMessage,
    });

    expect(result.terms.compactFormula).toBe("3d6+7");
    expect(toMessage).toHaveBeenCalledWith(
      expect.objectContaining({ formula: "3d6 + 7" }),
      expect.objectContaining({
        flavor: "Runner rolls Initiative (3d6+7)",
        speaker: { alias: "Runner" },
      }),
    );
  });

  it("refuses Encounter initiative for actors without a token in the current scene", async () => {
    const actor = createActor({ tokens: [] });
    const result = await ensureEncounterCombatant({ actor });

    expect(result).toEqual(expect.objectContaining({ ok: false, reason: "missing-token" }));
    expect(ui.notifications.warn).toHaveBeenCalledWith(
      "Initiative requires an active token in the current scene.",
    );
  });

  it("creates and reuses a scene Encounter while creating token-backed combatants", async () => {
    const token = { id: "token-1", actor: null, scene: { id: "scene-1" } };
    const actor = createActor({ id: "actor-encounter", tokens: [token] });
    token.actor = actor;
    game.actors.__set(actor);

    const first = await ensureEncounterCombatant({ actor });
    const second = await ensureEncounterCombatant({ actor });

    expect(first.ok).toBe(true);
    expect(first.combat).toBe(second.combat);
    expect(first.combatant.id).toBe(second.combatant.id);
    expect(game.combats.contents).toHaveLength(1);
  });

  it("uses an explicitly provided token even when the actor has no active tokens", async () => {
    const token = { id: "token-explicit", actor: null, scene: { id: "scene-1" } };
    const actor = createActor({ id: "actor-explicit", tokens: [] });
    token.actor = actor;
    game.actors.__set(actor);

    const result = await ensureEncounterCombatant({ actor, token });

    expect(result.ok).toBe(true);
    expect(result.token.id).toBe("token-explicit");
    expect(result.combatant.tokenId).toBe("token-explicit");
  });

  it("returns missing-combat when creation is disabled and no encounter exists", async () => {
    const token = { id: "token-nocombat", actor: null, scene: { id: "scene-1" } };
    const actor = createActor({ id: "actor-nocombat", tokens: [token] });
    token.actor = actor;
    game.actors.__set(actor);

    const result = await ensureEncounterCombatant({ actor, createCombat: false });

    expect(result).toEqual(expect.objectContaining({ ok: false, reason: "missing-combat" }));
    expect(ui.notifications.warn).toHaveBeenCalledWith(
      "No active Encounter was found for this scene.",
    );
  });

  it("reuses only the current scene's encounter when multiple scenes have combats", async () => {
    await SR2Combat.create({ scene: "scene-2", active: true });

    const token = { id: "token-scene", actor: null, scene: { id: "scene-1" } };
    const actor = createActor({ id: "actor-scene", tokens: [token] });
    token.actor = actor;
    game.actors.__set(actor);

    const result = await ensureEncounterCombatant({ actor });

    expect(result.ok).toBe(true);
    expect(result.combat.scene.id).toBe("scene-1");
    expect(game.combats.contents).toHaveLength(2);
  });

  it("warns when the token cannot be resolved to a scene", async () => {
    globalThis.canvas = undefined;
    const token = { id: "token-noscene", actor: null };
    const actor = createActor({ id: "actor-nosce", tokens: [token] });
    token.actor = actor;
    game.actors.__set(actor);

    const result = await ensureEncounterCombatant({ actor, token });

    expect(result).toEqual(expect.objectContaining({ ok: false, reason: "missing-scene" }));
    expect(ui.notifications.warn).toHaveBeenCalledWith(
      "Could not determine the current scene for initiative.",
    );
  });

  it("rolls initiative through Encounter and populates SR2 combatant flags", async () => {
    const token = { id: "token-2", actor: null, scene: { id: "scene-1" } };
    const actor = createActor({
      id: "actor-roll",
      tokens: [token],
      initiativeBase: 8,
      reaction: 8,
      mockInitiativeTotal: 23,
    });
    token.actor = actor;
    game.actors.__set(actor);

    const result = await rollEncounterInitiative({ actor });
    const combatant = result.combat.combatants[0];
    const flags = foundry.utils.getProperty(combatant, "flags.shadowrun2e.sr2");

    expect(result.ok).toBe(true);
    expect(result.combat.round).toBe(1);
    expect(flags).toEqual(
      expect.objectContaining({
        rolledInitiative: 23,
        adjustedReaction: 8,
        naturalReaction: 8,
        actionPhases: [23, 13, 3],
        nextActionPhase: 23,
      }),
    );
    expect(foundry.utils.getProperty(result.combat, "flags.shadowrun2e.sr2.currentPhase")).toBe(23);
  });

  it("does not duplicate an existing combatant when rolling initiative repeatedly", async () => {
    const token = { id: "token-repeat", actor: null, scene: { id: "scene-1" } };
    const actor = createActor({
      id: "actor-repeat",
      tokens: [token],
      initiativeBase: 7,
      reaction: 7,
      mockInitiativeTotal: 18,
    });
    token.actor = actor;
    game.actors.__set(actor);

    await rollEncounterInitiative({ actor });
    await rollEncounterInitiative({ actor });

    const [combat] = game.combats.contents;
    expect(combat.combatants).toHaveLength(1);
  });

  it("wraps encounter delay and advance helpers", async () => {
    const token = { id: "token-wrapper", actor: null, scene: { id: "scene-1" } };
    const actor = createActor({
      id: "actor-wrapper",
      tokens: [token],
      initiativeBase: 8,
      reaction: 8,
      mockInitiativeTotal: 22,
    });
    token.actor = actor;
    game.actors.__set(actor);

    const result = await rollEncounterInitiative({ actor });
    const combatant = result.combat.combatants[0];

    const delayed = await delayEncounterAction({ combat: result.combat, combatant, toPhase: 12 });
    expect(delayed).toEqual(expect.objectContaining({ ok: true }));
    expect(foundry.utils.getProperty(combatant, "flags.shadowrun2e.sr2.delayedToPhase")).toBe(12);

    const advanced = await advanceEncounterPhase({ combat: result.combat });
    expect(advanced).toEqual(expect.objectContaining({ ok: true }));
    expect(foundry.utils.getProperty(result.combat, "flags.shadowrun2e.sr2.currentPhase")).toBe(2);
  });

  it("returns wrapper errors for missing combat or combatant", async () => {
    await expect(
      delayEncounterAction({ combat: null, combatant: null, toPhase: 5 }),
    ).resolves.toEqual(expect.objectContaining({ ok: false, reason: "missing-combatant" }));
    await expect(advanceEncounterPhase({ combat: null })).resolves.toEqual(
      expect.objectContaining({ ok: false, reason: "missing-combat" }),
    );
  });
});
