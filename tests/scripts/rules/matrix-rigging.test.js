import { describe, expect, it } from "vitest";

import {
  sr2ComputeAutopilotTargetNumber,
  sr2ComputeCrashPower,
  sr2ComputeDumpShockDurationSeconds,
  sr2ComputeEscapeTargetNumber,
  sr2ComputeICReactionBaseline,
  sr2ComputeMatrixInitiativeDice,
  sr2ComputeMatrixReaction,
  sr2ComputePositionAttacks,
  sr2ComputePositionDistance,
  sr2ComputePositionTestTargetNumber,
  sr2ComputeVehicleCrashResistanceTargetNumber,
  sr2ComputeVehicleOperationTargetNumber,
  sr2GetCrashDamageLevel,
  sr2GetVehicleDamageModifiers,
  sr2StageVehicleDamageLevel,
} from "../../../scripts/rules/matrix-rigging.js";

describe("matrix and rigging rules", () => {
  it("computes matrix reaction, initiative, IC baseline, and dump shock", () => {
    expect(sr2ComputeMatrixReaction({ baseReaction: 6, responseIncrease: 2 })).toBe(10);
    expect(
      sr2ComputeMatrixReaction({ baseReaction: 6, responseIncrease: 2, inputMode: "keyboard" }),
    ).toBe(3);
    expect(sr2ComputeMatrixInitiativeDice({ responseIncrease: 2, inputMode: "cybernetic" })).toBe(
      4,
    );
    expect(sr2ComputeICReactionBaseline("orange", 4)).toBe(11);
    expect(sr2ComputeDumpShockDurationSeconds(3)).toBe(10);
  });

  it("computes vehicle target numbers and chase positioning", () => {
    expect(
      sr2ComputeVehicleOperationTargetNumber({
        handling: 4,
        complexControls: true,
        unfamiliarVehicle: "stressful",
        badConditions: 2,
        vcrLevel: 2,
      }),
    ).toBe(6);
    expect(sr2ComputeAutopilotTargetNumber(5)).toBe(5);
    expect(sr2ComputePositionTestTargetNumber({ handling: 4, terrain: "tight" })).toBe(8);
    expect(sr2ComputePositionDistance(3, 90)).toBe(270);
    expect(sr2ComputePositionAttacks({ stance: "flight", successes: 5 })).toBe(2);
    expect(sr2ComputePositionAttacks({ stance: "fight", successes: 5 })).toBe(5);
  });

  it("computes crash, escape, and vehicle damage modifiers", () => {
    expect(sr2ComputeCrashPower(75)).toBe(7);
    expect(sr2GetCrashDamageLevel(75)).toBe("S");
    expect(sr2ComputeVehicleCrashResistanceTargetNumber({ crashPower: 7, armor: 3 })).toBe(4);
    expect(sr2StageVehicleDamageLevel("S", 4)).toBe("L");
    expect(sr2ComputeEscapeTargetNumber({ fleeingNetSuccesses: 3, terrain: "open" })).toBe(7);
    expect(sr2GetVehicleDamageModifiers("moderate")).toEqual({
      testModifier: 2,
      initiativeModifier: -2,
      speedMultiplier: 0.75,
    });
  });
});
