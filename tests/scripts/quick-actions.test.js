import { beforeEach, describe, expect, it } from "vitest";

import { SR2Combat } from "../../scripts/combat/sr2-combat.js";

async function loadQuickActionsModule() {
  return import("../../scripts/quick-actions.js");
}

describe("SR2QuickActionsPopup initiative", () => {
  beforeEach(() => {
    game.actors.__clear();
    game.combats.__clear();
    CONFIG.Combat.documentClass = SR2Combat;
    globalThis.canvas = {
      scene: { id: "scene-1" },
    };
  });

  it("routes quick-actions initiative through the active Encounter", async () => {
    const { SR2QuickActionsPopup } = await loadQuickActionsModule();

    const actor = {
      id: "actor-quick",
      name: "Street Sam",
      system: {
        initiative: { base: 7, current: 0 },
        attributes: {
          reaction: { value: 7 },
        },
      },
      _mockInitiativeTotal: 19,
    };
    const token = {
      id: "token-quick",
      actor,
      scene: { id: "scene-1" },
    };
    actor.getActiveTokens = () => [token];
    game.actors.__set(actor);

    const app = new SR2QuickActionsPopup({ token });
    await app._rollInitiative();

    const [combat] = game.combats.contents;
    expect(combat).toBeTruthy();
    expect(foundry.utils.getProperty(combat, "flags.shadowrun2e.sr2.currentPhase")).toBe(19);
    expect(combat.combatants[0].tokenId).toBe("token-quick");
  });
});
