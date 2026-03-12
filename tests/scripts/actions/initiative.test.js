import { describe, expect, it, vi } from "vitest";

import {
  sr2GetInitiativeTerms,
  sr2RollInitiativeToChat,
} from "../../../scripts/actions/initiative.js";

describe("initiative helpers", () => {
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
});
