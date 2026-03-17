import { describe, expect, it } from "vitest";

import {
  sr2ComputeBuildRepairActualHours,
  sr2ComputeBuildRepairHours,
  sr2ComputeBuildRepairTargetNumber,
  sr2ComputeCharismaOffsetsForRacism,
  sr2ComputeGroupPerceptionDice,
  sr2ComputeLegworkFee,
  sr2ComputePerceptionTargetNumber,
  sr2ComputeRacismPointsFromRoll,
  sr2ComputeSkillWebDefaultingModifier,
  sr2ComputeSocialTargetNumber,
  sr2FindSkillWebPath,
  sr2GetKnowledgeTargetNumber,
  sr2GetLanguageTargetNumber,
  sr2InterpretKnowledgeSuccesses,
  sr2InterpretPerceptionSuccesses,
  sr2ResolveSkillWebDefaulting,
} from "../../../scripts/rules/skill-procedures.js";

describe("skill and procedure rules", () => {
  const graph = {
    quickness: ["firearms"],
    intelligence: ["electronics"],
    firearms: ["pistols", "rifles"],
    electronics: ["computer"],
    computer: ["decking"],
  };

  it("finds valid skill-web paths and defaulting modifiers", () => {
    expect(sr2FindSkillWebPath(graph, "quickness", "pistols")).toEqual([
      "quickness",
      "firearms",
      "pistols",
    ]);
    expect(sr2ComputeSkillWebDefaultingModifier(["quickness", "firearms", "pistols"])).toBe(4);
    expect(
      sr2ResolveSkillWebDefaulting({
        graph,
        target: "pistols",
        knownSkills: { firearms: 5 },
        knownAttributes: { quickness: 6, intelligence: 4 },
      }),
    ).toMatchObject({
      source: "firearms",
      sourceType: "skill",
      dicePool: 5,
      tnModifier: 2,
    });
  });

  it("computes perception, knowledge, and language helpers", () => {
    expect(sr2ComputePerceptionTargetNumber({ modifiers: [2, -1] })).toBe(5);
    expect(sr2ComputeGroupPerceptionDice([5, 4, 3], { rounding: "floor" })).toBe(7);
    expect(sr2InterpretPerceptionSuccesses(3)).toContain("exact nature");
    expect(sr2GetKnowledgeTargetNumber("intricate")).toBe(8);
    expect(sr2InterpretKnowledgeSuccesses(4)).toContain("accurate");
    expect(sr2GetLanguageTargetNumber({ situation: "complex", dialect: true })).toBe(8);
  });

  it("computes social, racism, legwork, and B/R procedures", () => {
    expect(
      sr2ComputeSocialTargetNumber({
        baseMentalAttribute: 5,
        attitude: "hostile",
        value: "harmful",
        racismPoints: 2,
      }),
    ).toBe(15);
    expect(sr2ComputeRacismPointsFromRoll(11)).toBe(5);
    expect(sr2ComputeCharismaOffsetsForRacism(3)).toBe(3);
    expect(
      sr2ComputeLegworkFee({
        contactEtiquette: 4,
        playerSuccesses: 3,
        contactCharisma: 5,
        contactIntelligence: 4,
      }),
    ).toBe(1080);
    expect(sr2ComputeBuildRepairHours({ comparablePrice: 5000, category: "technical" })).toBe(100);
    expect(
      sr2ComputeBuildRepairTargetNumber({
        baseCategory: "technical",
        conditionModifier: 2,
        toolModifier: 2,
        referenceModifier: -1,
      }),
    ).toBe(9);
    expect(sr2ComputeBuildRepairActualHours({ baseHours: 100, successes: 4 })).toBe(25);
  });
});
