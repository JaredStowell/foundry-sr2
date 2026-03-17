import { describe, expect, it } from "vitest";

import {
  sr2GetActorTypeLabel,
  sr2InferVehicleType,
  sr2ParseDelimitedPair,
} from "../../scripts/create-actor-dialog.js";

describe("sr2ParseDelimitedPair", () => {
  it("parses slash-delimited numeric values", () => {
    expect(sr2ParseDelimitedPair("4/7")).toEqual([4, 7]);
    expect(sr2ParseDelimitedPair("12")).toEqual([12, 0]);
  });

  it("can mirror a single value into both sides", () => {
    expect(sr2ParseDelimitedPair("5", true)).toEqual([5, 5]);
    expect(sr2ParseDelimitedPair(null, true)).toEqual([0, 0]);
  });
});

describe("sr2InferVehicleType", () => {
  it("detects air vehicles from keywords or SR2 speed notation", () => {
    expect(sr2InferVehicleType({ name: "Ares Tiltrotor", Notes: "" })).toBe("air");
    expect(sr2InferVehicleType({ name: "Vector Thrust", "Speed/Accel": "220/40 (300)" })).toBe(
      "air",
    );
  });

  it("detects watercraft and falls back to ground", () => {
    expect(sr2InferVehicleType({ name: "Harbor Patrol Boat", Notes: "" })).toBe("water");
    expect(sr2InferVehicleType({ name: "GMC Bulldog", Notes: "Cargo van" })).toBe("ground");
  });
});

describe("sr2GetActorTypeLabel", () => {
  it("uses explicit labels for type names that do not title-case correctly", () => {
    expect(sr2GetActorTypeLabel("critter")).toBe("Critter");
    expect(sr2GetActorTypeLabel("ic")).toBe("IC");
  });

  it("falls back to title-casing unknown types", () => {
    expect(sr2GetActorTypeLabel("mystery")).toBe("Mystery");
  });
});
