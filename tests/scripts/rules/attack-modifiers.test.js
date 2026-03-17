import { describe, expect, it } from "vitest";

import {
  sr2BuildRangedModifierSummary,
  sr2ComputeRecoilModifier,
  sr2GetAccessoryModifier,
  sr2GetCalledShotTargetNumberModifier,
  sr2GetMovementModifier,
  sr2GetVisibilityModifier,
} from "../../../scripts/rules/attack-modifiers.js";

describe("attack-modifiers rules", () => {
  it("reads the SR2 visibility table by vision mode", () => {
    expect(sr2GetVisibilityModifier({ condition: "fullDarkness" })).toBe(8);
    expect(
      sr2GetVisibilityModifier({
        condition: "lightSmokeFogRain",
        visionMode: "low-light",
        naturalVision: true,
      }),
    ).toBe(2);
    expect(
      sr2GetVisibilityModifier({
        condition: "heavySmokeFogRain",
        visionMode: "thermographic",
        naturalVision: false,
      }),
    ).toBe(1);
  });

  it("computes movement, accessories, and called-shot modifiers", () => {
    expect(sr2GetMovementModifier({ role: "attacker", movement: "walking" })).toBe(1);
    expect(
      sr2GetMovementModifier({ role: "attacker", movement: "running", difficultGround: true }),
    ).toBe(6);
    expect(sr2GetMovementModifier({ role: "target", movement: "stationary" })).toBe(-1);
    expect(sr2GetAccessoryModifier({ smartlink: true, laserSight: true })).toBe(-2);
    expect(sr2GetAccessoryModifier({ laserSight: true, dualWielding: true })).toBe(0);
    expect(sr2GetCalledShotTargetNumberModifier(true)).toBe(4);
  });

  it("handles unknown visibility and target movement defaults", () => {
    expect(sr2GetVisibilityModifier({ condition: "unknown-condition" })).toBe(0);
    expect(sr2GetMovementModifier({ role: "target", movement: "running" })).toBe(2);
    expect(sr2GetMovementModifier({ role: "target", movement: "normal" })).toBe(0);
  });

  it("computes recoil by fire mode and compensation", () => {
    expect(sr2ComputeRecoilModifier({ fireMode: "SA", shotsThisPhase: 2 })).toBe(1);
    expect(sr2ComputeRecoilModifier({ fireMode: "BF", burstsThisPhase: 2 })).toBe(6);
    expect(
      sr2ComputeRecoilModifier({
        fireMode: "FA",
        roundsFiredThisPhase: 6,
        recoilCompensation: 2,
      }),
    ).toBe(4);
    expect(
      sr2ComputeRecoilModifier({
        fireMode: "FA",
        roundsFiredThisPhase: 4,
        recoilCompensation: 1,
        heavyWeapon: true,
      }),
    ).toBe(6);
    expect(
      sr2ComputeRecoilModifier({
        fireMode: "SS",
        roundsFiredThisPhase: 1,
        recoilCompensation: 9,
      }),
    ).toBe(0);
  });

  it("builds ranged TN summaries including wound penalties", () => {
    expect(
      sr2BuildRangedModifierSummary({
        baseTargetNumber: 4,
        recoilModifier: 1,
        visibilityModifier: 2,
        coverModifier: 4,
        attackerMovementModifier: 1,
        woundModifier: 2,
      }),
    ).toEqual({
      baseTargetNumber: 4,
      totalModifier: 10,
      finalTargetNumber: 14,
      parts: [
        { label: "Recoil", value: 1 },
        { label: "Visibility", value: 2 },
        { label: "Cover", value: 4 },
        { label: "Attacker Movement", value: 1 },
        { label: "Wounds", value: 2 },
      ],
    });
  });

  it("clamps base/final TN and includes called-shot parts", () => {
    expect(
      sr2BuildRangedModifierSummary({
        baseTargetNumber: 1,
        accessoriesModifier: -3,
        calledShotModifier: 4,
      }),
    ).toEqual({
      baseTargetNumber: 2,
      totalModifier: 1,
      finalTargetNumber: 2,
      parts: [
        { label: "Accessories", value: -3 },
        { label: "Called Shot", value: 4 },
      ],
    });
  });
});
