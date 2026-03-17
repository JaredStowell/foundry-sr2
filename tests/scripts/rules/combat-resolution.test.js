import { describe, expect, it } from "vitest";

import {
  sr2ApplyCalledShot,
  sr2ComputeDamageResistanceTargetNumber,
  sr2ComputeMeleeTargetNumbers,
  sr2GetDamageLevelFromBoxes,
  sr2GetInjuryModifiers,
  sr2GetRangeBand,
  sr2ResolveMeleeDamage,
  sr2ResolveMeleeOpposedTest,
  sr2ResolveRangedCombat,
  sr2StageDamageLevel,
} from "../../../scripts/rules/combat-resolution.js";

describe("combat-resolution rules", () => {
  it("derives wound levels and injury modifiers from damage boxes", () => {
    expect(sr2GetDamageLevelFromBoxes(0)).toBe(null);
    expect(sr2GetDamageLevelFromBoxes(3)).toBe("M");
    expect(sr2GetDamageLevelFromBoxes(9)).toBe("S");
    expect(sr2GetDamageLevelFromBoxes(10)).toBe("D");
    expect(sr2GetInjuryModifiers({ physicalBoxes: 3, stunBoxes: 6 })).toEqual({
      level: "S",
      targetNumber: 3,
      initiative: -3,
    });
    expect(sr2GetInjuryModifiers({ physicalBoxes: 10, stunBoxes: 3 })).toEqual({
      level: "D",
      targetNumber: 4,
      initiative: -4,
    });
  });

  it("computes range bands and resistance target numbers", () => {
    expect(
      sr2GetRangeBand({
        distance: 42,
        rangeData: { min: 5, short: 10, medium: 40, long: 80, extreme: 150 },
      }),
    ).toEqual({
      targetNumber: 6,
      label: "Long",
      inRange: true,
    });
    expect(
      sr2GetRangeBand({
        distance: 3,
        rangeData: { min: 5, short: 50, medium: 100, long: 150, extreme: 300 },
      }),
    ).toEqual({
      targetNumber: 9,
      label: "Below Minimum (5+)",
      inRange: false,
    });
    expect(sr2ComputeDamageResistanceTargetNumber({ power: 9, armor: 5 })).toBe(4);
  });

  it("resolves ranged staging including clean misses", () => {
    expect(
      sr2ResolveRangedCombat({
        attackerSuccesses: 4,
        defenderSuccesses: 1,
        defenderCombatPoolSuccesses: 0,
        baseDamageLevel: "M",
      }),
    ).toMatchObject({
      hit: true,
      cleanMiss: false,
      finalLevel: "S",
      boxes: 6,
      stageDelta: 1,
    });

    expect(
      sr2ResolveRangedCombat({
        attackerSuccesses: 2,
        defenderSuccesses: 0,
        defenderCombatPoolSuccesses: 3,
        baseDamageLevel: "M",
      }),
    ).toMatchObject({
      hit: false,
      cleanMiss: true,
      finalLevel: null,
      boxes: 0,
    });

    expect(
      sr2ResolveRangedCombat({
        attackerSuccesses: 1,
        defenderSuccesses: 6,
        defenderCombatPoolSuccesses: 0,
        baseDamageLevel: "S",
      }),
    ).toMatchObject({
      cleanMiss: false,
      stageDelta: -2,
      finalLevel: "L",
      boxes: 1,
    });
  });

  it("resolves melee opposed tests and staged damage", () => {
    expect(sr2ComputeMeleeTargetNumbers({ attackerReach: 2, defenderReach: 0 })).toEqual({
      reachDelta: 2,
      attackerTargetNumber: 2,
      defenderTargetNumber: 6,
    });

    expect(
      sr2ResolveMeleeOpposedTest({
        attackerSuccesses: 3,
        defenderSuccesses: 3,
      }),
    ).toMatchObject({
      attackerHits: true,
      hitter: "attacker",
      stageUp: 0,
    });

    expect(
      sr2ResolveMeleeDamage({
        baseDamageLevel: "M",
        opposedStageUp: 2,
        resistanceSuccesses: 2,
      }),
    ).toEqual({
      stagedLevel: "D",
      finalLevel: "S",
      boxes: 6,
      stageDown: 1,
    });

    expect(sr2StageDamageLevel("L", -1)).toBe(null);
  });

  it("applies called-shot TN and damage adjustments", () => {
    expect(
      sr2ApplyCalledShot({
        baseTargetNumber: 4,
        baseDamageLevel: "M",
        enabled: true,
        mode: "damage",
      }),
    ).toEqual({
      calledShotTargetNumber: 8,
      finalDamageLevel: "S",
      damageLevelIncreased: true,
      mode: "damage",
    });

    expect(
      sr2ApplyCalledShot({
        baseTargetNumber: 4,
        baseDamageLevel: "M",
        enabled: true,
        mode: "sub-target",
      }),
    ).toEqual({
      calledShotTargetNumber: 8,
      finalDamageLevel: "M",
      damageLevelIncreased: false,
      mode: "sub-target",
    });

    expect(
      sr2ApplyCalledShot({
        baseTargetNumber: 4,
        baseDamageLevel: "M",
        enabled: false,
        mode: "damage",
      }),
    ).toEqual({
      calledShotTargetNumber: 4,
      finalDamageLevel: "M",
      damageLevelIncreased: false,
      mode: "damage",
    });
  });
});
