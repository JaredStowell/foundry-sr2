import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const system = JSON.parse(readFileSync("system.json", "utf8"));

describe("system manifest v14 compatibility", () => {
  it("declares Foundry v14 compatibility bounds", () => {
    expect(system.compatibility).toEqual({
      minimum: "14",
      verified: "14.361",
      maximum: "14",
    });
  });

  it("declares Actor and Item document subtypes for TypeDataModel registration", () => {
    expect(Object.keys(system.documentTypes.Actor)).toEqual([
      "character",
      "contact",
      "follower",
      "cyberdeck",
      "vehicle",
      "spirit",
      "critter",
      "ic",
    ]);
    expect(Object.keys(system.documentTypes.Item)).toEqual([
      "skill",
      "weapon",
      "armor",
      "gear",
      "cyberware",
      "bioware",
      "spell",
      "adeptpower",
      "contact",
      "program",
      "totem",
    ]);
  });
});
