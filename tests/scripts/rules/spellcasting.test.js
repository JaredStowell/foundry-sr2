import { describe, expect, it } from "vitest";

import {
  sr2CanCastSpellAtForce,
  sr2CanLearnSpellAtCharacterCreation,
  sr2CanSustainAdditionalSpell,
  sr2ComputeAreaSpellRadius,
  sr2ComputeDrainValueFromCode,
  sr2ComputeDrainTargetNumber,
  sr2ComputeMagicPoolCapForSpellSuccessTest,
  sr2ComputeRestrictedSpellEffectiveForce,
  sr2ComputeSpellNoticeTargetNumber,
  sr2ComputeSpellTargetNumber,
  sr2ComputeSustainingModifier,
  sr2ComputeDetectionSpellTargetNumber,
  sr2GetSpellResistanceAttribute,
  sr2ResolveDrain,
  sr2ResolveSpellEffect,
} from "../../../scripts/rules/spellcasting.js";

describe("spellcasting rules", () => {
  it("computes spell TN modifiers and resistance attributes", () => {
    expect(
      sr2ComputeSpellTargetNumber({
        baseTargetNumber: 4,
        visibilityModifier: 2,
        coverModifier: 1,
        woundModifier: 1,
        sustainingSpells: 2,
        manaBarrierForce: 4,
        lodgeRating: 6,
      }),
    ).toBe(17);
    expect(
      sr2ComputeSpellTargetNumber({
        baseTargetNumber: 4,
        coverModifier: 6,
        touchOnly: true,
        woundModifier: 1,
      }),
    ).toBe(5);
    expect(sr2GetSpellResistanceAttribute("mana")).toBe("willpower");
    expect(sr2GetSpellResistanceAttribute("P")).toBe("body");
  });

  it("resolves resisted spells and drain staging", () => {
    expect(sr2ResolveSpellEffect({ casterSuccesses: 0, targetSuccesses: 0 })).toMatchObject({
      cast: false,
      result: "miscast",
    });
    expect(sr2ResolveSpellEffect({ casterSuccesses: 4, targetSuccesses: 4 })).toMatchObject({
      cast: true,
      result: "minimum-effect",
      minimumEffect: true,
    });
    expect(sr2ResolveSpellEffect({ casterSuccesses: 5, targetSuccesses: 2 })).toMatchObject({
      cast: true,
      result: "success",
      netSuccesses: 3,
    });

    expect(sr2ComputeDrainValueFromCode("[(F/2)+1]S", 6)).toBe(4);
    expect(sr2ComputeDrainTargetNumber({ modifiedForce: 5, criticalMisfire: true })).toBe(7);
    expect(
      sr2ResolveDrain({
        baseDrainLevel: "S",
        resistanceSuccesses: 4,
        spellForce: 7,
        casterMagic: 6,
      }),
    ).toEqual({
      applied: true,
      finalLevel: "L",
      boxes: 1,
      damageType: "physical",
    });
  });

  it("computes area radius, sustaining, and notice helpers", () => {
    expect(
      sr2ComputeAreaSpellRadius({
        magicRating: 6,
        withheldDice: 3,
        spellForce: 6,
        mode: "increase",
      }),
    ).toBe(9);
    expect(
      sr2ComputeAreaSpellRadius({
        magicRating: 6,
        withheldDice: 4,
        spellForce: 6,
        mode: "decrease",
      }),
    ).toBe(4);
    expect(
      sr2ComputeDetectionSpellTargetNumber({ subjectsOutOfSight: true, barrierRating: 3 }),
    ).toBe(9);
    expect(
      sr2ComputeSpellNoticeTargetNumber({
        casterMagic: 6,
        spellForce: 4,
        observerIsMagician: true,
      }),
    ).toBe(2);
    expect(sr2ComputeMagicPoolCapForSpellSuccessTest(6)).toBe(6);
    expect(
      sr2ComputeRestrictedSpellEffectiveForce({
        force: 4,
        exclusive: true,
        fetishType: "reusable",
      }),
    ).toBe(7);
    expect(sr2ComputeSustainingModifier(3)).toBe(6);
    expect(sr2CanSustainAdditionalSpell({ currentSustainedCount: 2, sorceryRating: 3 })).toBe(true);
    expect(sr2CanCastSpellAtForce({ learnedForce: 4, castForce: 5 })).toBe(false);
    expect(sr2CanLearnSpellAtCharacterCreation(6)).toBe(true);
  });
});
