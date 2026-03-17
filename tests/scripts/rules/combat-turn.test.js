import { describe, expect, it } from "vitest";

import {
  sr2BuildCombatTurn,
  sr2CanActInPhase,
  sr2CompareInitiativeTieBreak,
  sr2ComputeAdjustedReaction,
  sr2ComputeInitiativeDice,
  sr2ComputeInitiativeTotal,
  sr2GetCombatPhases,
  sr2GetNextActionPhase,
  sr2ResolveDelayedAction,
  sr2SortDeclarations,
  sr2SortResolutions,
} from "../../../scripts/rules/combat-turn.js";

describe("combat-turn rules", () => {
  it("computes adjusted reaction for physical, matrix, and keyboard matrix modes", () => {
    expect(
      sr2ComputeAdjustedReaction({
        quickness: 6,
        intelligence: 4,
        reactionModifier: 2,
        woundModifier: -1,
      }),
    ).toBe(6);

    expect(
      sr2ComputeAdjustedReaction({
        mode: "matrix",
        quickness: 6,
        intelligence: 4,
        responseIncrease: 2,
        woundModifier: -1,
      }),
    ).toBe(8);

    expect(
      sr2ComputeAdjustedReaction({
        mode: "matrix",
        quickness: 6,
        intelligence: 4,
        responseIncrease: 3,
        inputMode: "keyboard",
        woundModifier: -1,
      }),
    ).toBe(1);
  });

  it("computes initiative dice and action phases", () => {
    expect(
      sr2ComputeInitiativeDice({ mode: "matrix", responseIncrease: 2, inputMode: "cybernetic" }),
    ).toBe(4);
    expect(
      sr2ComputeInitiativeTotal({ adjustedReaction: 8, initiativeDiceResults: [4, 3, 2] }),
    ).toBe(17);
    expect(sr2GetCombatPhases(27)).toEqual([27, 17, 7]);
    expect(sr2GetNextActionPhase(17)).toBe(7);
  });

  it("sorts declarations slowest-first and resolutions fastest-first", () => {
    const tied = [
      { id: "a", adjustedReaction: 6, naturalReaction: 5 },
      { id: "b", adjustedReaction: 8, naturalReaction: 4 },
      { id: "c", adjustedReaction: 8, naturalReaction: 6 },
    ];

    expect(sr2CompareInitiativeTieBreak(tied[1], tied[2])).toBeGreaterThan(0);
    expect(sr2SortDeclarations(tied).map((entry) => entry.id)).toEqual(["a", "b", "c"]);
    expect(sr2SortResolutions(tied).map((entry) => entry.id)).toEqual(["c", "b", "a"]);
  });

  it("builds combat-turn phase structure and delayed-action follow-up", () => {
    const turn = sr2BuildCombatTurn([
      { id: "sam", initiativeTotal: 24, adjustedReaction: 8, naturalReaction: 6 },
      { id: "mage", initiativeTotal: 14, adjustedReaction: 6, naturalReaction: 6 },
    ]);

    expect(turn.phases.map((phase) => phase.phase)).toEqual([24, 14, 4]);
    expect(turn.phases[1].resolutions.map((entry) => entry.id)).toEqual(["sam", "mage"]);
    expect(sr2CanActInPhase({ initiativeTotal: 24, currentPhase: 14 })).toBe(true);
    expect(sr2ResolveDelayedAction({ originalInitiativeTotal: 24, interventionPhase: 14 })).toEqual(
      {
        actedPhase: 14,
        nextActionPhase: 4,
        originalInitiativeTotal: 24,
      },
    );
  });
});
