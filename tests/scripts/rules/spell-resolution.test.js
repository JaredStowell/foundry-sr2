import { describe, expect, it } from "vitest";

import {
  sr2PrepareSpellResistanceTest,
  sr2PrepareSpellCastTargetNumber,
  sr2SummarizeCombatSpellDamage,
  sr2SummarizeDrainApplication,
  sr2SummarizeSpellEffectResolution,
  sr2SummarizeSpellTargets,
} from "../../../scripts/rules/spell-resolution.js";

describe("spell-resolution rules", () => {
  it("prepares cast TN summaries with force validation and magic pool caps", () => {
    expect(
      sr2PrepareSpellCastTargetNumber({
        spellType: "M",
        learnedForce: 6,
        castForce: 4,
        requestedMagicPoolDice: 7,
        magicRating: 5,
        baseTargetNumber: 4,
        visibilityModifier: 2,
        coverModifier: 1,
        woundModifier: 1,
        sustainingSpells: 2,
        manaBarrierForce: 4,
        lodgeRating: 6,
        exclusive: true,
      }),
    ).toEqual({
      canCastAtForce: true,
      learnedForce: 6,
      castForce: 4,
      effectiveForce: 6,
      resistanceAttribute: "willpower",
      modifiedTargetNumber: 17,
      magicPoolCap: 5,
      requestedMagicPoolDice: 7,
      allowedMagicPoolDice: 5,
      touchOnly: false,
      modifiers: {
        baseTargetNumber: 4,
        visibilityModifier: 2,
        coverModifier: 1,
        woundModifier: 1,
        sustainingModifier: 4,
        manaBarrierModifier: 2,
        lodgeModifier: 3,
      },
    });
  });

  it("handles touch spells and impossible cast-force requests safely", () => {
    const summary = sr2PrepareSpellCastTargetNumber({
      spellType: "physical",
      learnedForce: 3,
      castForce: 5,
      requestedMagicPoolDice: 2,
      magicRating: 4,
      baseTargetNumber: 4,
      coverModifier: 6,
      woundModifier: 1,
      touchOnly: true,
      fetishType: "reusable",
    });

    expect(summary.canCastAtForce).toBe(false);
    expect(summary.modifiedTargetNumber).toBe(5);
    expect(summary.effectiveForce).toBe(6);
    expect(summary.resistanceAttribute).toBe("body");
    expect(summary.allowedMagicPoolDice).toBe(2);
    expect(summary.modifiers.sustainingModifier).toBe(0);
    expect(summary.modifiers.manaBarrierModifier).toBe(0);
    expect(summary.modifiers.lodgeModifier).toBe(0);
  });

  it("caps and floors requested magic pool dice in cast prep", () => {
    const negative = sr2PrepareSpellCastTargetNumber({
      learnedForce: 4,
      castForce: 4,
      requestedMagicPoolDice: -5,
      magicRating: 6,
    });
    const capped = sr2PrepareSpellCastTargetNumber({
      learnedForce: 4,
      castForce: 4,
      requestedMagicPoolDice: 9.8,
      magicRating: 3,
    });

    expect(negative.allowedMagicPoolDice).toBe(0);
    expect(capped.allowedMagicPoolDice).toBe(3);
    expect(capped.requestedMagicPoolDice).toBe(9);
  });

  it("summarizes single-target, split-target, and area targeting", () => {
    expect(
      sr2SummarizeSpellTargets({
        spellType: "mana",
        targetCount: 3,
        castForce: 6,
        forceAllocations: [2, 2, 2],
      }),
    ).toEqual({
      targetingMode: "multi-target",
      resistanceAttribute: "willpower",
      targetCount: 3,
      castForce: 6,
      perTargetForce: [2, 2, 2],
      allocatedForce: 6,
      unallocatedForce: 0,
      hasValidForceSplit: true,
      area: false,
      areaRadius: null,
      withheldDice: 0,
    });

    expect(
      sr2SummarizeSpellTargets({
        spellType: "P",
        targetCount: 2,
        castForce: 5,
        forceAllocations: [4, 4],
      }).hasValidForceSplit,
    ).toBe(false);

    expect(
      sr2SummarizeSpellTargets({
        spellType: "P",
        castForce: 6,
        area: true,
        magicRating: 5,
        areaMode: "decrease",
        withheldDice: 4,
      }),
    ).toMatchObject({
      targetingMode: "area",
      resistanceAttribute: "body",
      area: true,
      areaRadius: 3,
      withheldDice: 4,
    });

    expect(
      sr2SummarizeSpellTargets({
        spellType: "mana",
        targetCount: 2,
        castForce: 5,
      }),
    ).toMatchObject({
      perTargetForce: [5, 0],
      hasValidForceSplit: true,
    });
  });

  it("summarizes resisted, minimum-effect, and damaging-manipulation outcomes", () => {
    expect(
      sr2SummarizeSpellEffectResolution({
        casterSuccesses: 0,
        targetSuccesses: 0,
        resisted: true,
        spellType: "M",
      }),
    ).toMatchObject({
      cast: false,
      result: "miscast",
      resistanceAttribute: "willpower",
      resistanceMode: "spell-resistance",
    });

    expect(
      sr2SummarizeSpellEffectResolution({
        casterSuccesses: 4,
        targetSuccesses: 4,
        resisted: true,
        spellType: "mana",
      }),
    ).toMatchObject({
      cast: true,
      result: "minimum-effect",
      minimumEffect: true,
      netSuccesses: 0,
    });

    expect(
      sr2SummarizeSpellEffectResolution({
        casterSuccesses: 5,
        targetSuccesses: 2,
        resisted: true,
        spellType: "physical",
        damagingManipulation: true,
      }),
    ).toMatchObject({
      cast: true,
      result: "success",
      netSuccesses: 3,
      resistanceAttribute: "body",
      resistanceMode: "damage-resistance-half-impact",
    });
  });

  it("prepares spell resistance tests and combat spell damage staging", () => {
    expect(
      sr2PrepareSpellResistanceTest({
        spellType: "mana",
        spellForce: 6,
        targetAttributeValue: 5,
      }),
    ).toEqual({
      resistanceAttribute: "willpower",
      dicePool: 5,
      targetNumber: 6,
    });

    expect(
      sr2SummarizeCombatSpellDamage({
        baseDamageLevel: "M",
        netSuccesses: 5,
      }),
    ).toEqual({
      finalDamageLevel: "D",
      boxes: 10,
      stageDelta: 2,
    });

    expect(
      sr2SummarizeCombatSpellDamage({
        baseDamageLevel: "M",
        netSuccesses: 0,
        minimumEffect: true,
      }),
    ).toEqual({
      finalDamageLevel: "M",
      boxes: 3,
      stageDelta: 0,
    });

    expect(
      sr2PrepareSpellResistanceTest({
        spellType: "physical",
        spellForce: 1,
        targetAttributeValue: 0,
      }),
    ).toEqual({
      resistanceAttribute: "body",
      dicePool: 0,
      targetNumber: 2,
    });

    expect(
      sr2SummarizeCombatSpellDamage({
        baseDamageLevel: "X",
        netSuccesses: 8,
      }),
    ).toEqual({
      finalDamageLevel: null,
      stageDelta: 0,
    });
  });

  it("summarizes drain TNs and final damage application", () => {
    expect(
      sr2SummarizeDrainApplication({
        baseDrainLevel: "S",
        modifiedForce: 5,
        criticalMisfire: true,
        resistanceSuccesses: 4,
        spellForce: 7,
        casterMagic: 6,
      }),
    ).toEqual({
      drainTargetNumber: 7,
      applied: true,
      finalLevel: "L",
      boxes: 1,
      damageType: "physical",
      baseDrainLevel: "S",
      resistanceSuccesses: 4,
      criticalMisfire: true,
    });

    expect(
      sr2SummarizeDrainApplication({
        baseDrainLevel: "M",
        modifiedForce: 4,
        resistanceSuccesses: 6,
        spellForce: 4,
        casterMagic: 6,
      }),
    ).toMatchObject({
      drainTargetNumber: 4,
      applied: false,
      finalLevel: null,
      boxes: 0,
      damageType: null,
      criticalMisfire: false,
    });
  });
});
