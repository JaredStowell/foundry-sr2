import { describe, expect, it } from "vitest";

import {
  sr2BuildAugmentationSystemData,
  sr2BuildCatalogAugmentationRecord,
  sr2ComputeInstalledBiowareIndex,
  sr2ComputeInstalledCyberwareEssenceLoss,
  sr2InferAugmentationRating,
  sr2ParseAugmentationModifierString,
} from "../../../scripts/rules/augmentation-effects.js";

describe("sr2ParseAugmentationModifierString", () => {
  it("parses SR2 augmentation modifier strings into attribute buckets", () => {
    expect(sr2ParseAugmentationModifierString("+1QCK,+2RCT,+1INI")).toEqual({
      BOD: 0,
      QCK: 1,
      STR: 0,
      CHA: 0,
      INT: 0,
      WIL: 0,
      RCT: 2,
      INI: 1,
      CPL: 0,
    });
  });

  it("supports level multipliers and ignores unknown codes", () => {
    expect(sr2ParseAugmentationModifierString("+1BOD,+2XYZ", { multiplier: 2 })).toEqual({
      BOD: 2,
      QCK: 0,
      STR: 0,
      CHA: 0,
      INT: 0,
      WIL: 0,
      RCT: 0,
      INI: 0,
      CPL: 0,
    });
  });
});

describe("sr2InferAugmentationRating", () => {
  it("reads arabic and roman numeral ratings from augmentation names", () => {
    expect(sr2InferAugmentationRating("Wired Reflexes 2")).toBe(2);
    expect(sr2InferAugmentationRating("Smartlink II")).toBe(2);
    expect(sr2InferAugmentationRating("Headware Memory (30 Mp)")).toBe(30);
  });
});

describe("sr2BuildAugmentationSystemData", () => {
  it("normalizes cyberware system data and derives reflex bonuses", () => {
    expect(
      sr2BuildAugmentationSystemData({
        type: "cyberware",
        name: "Wired Reflexes 2",
        category: "BODYWARE",
        bookPage: "sr2.249",
        cost: "165000",
        streetIndex: "1",
        essence: "3",
        mods: "+4RCT,+2INI",
        installed: true,
      }),
    ).toEqual({
      description: "Category: BODYWARE\nSource: sr2.249",
      price: 165000,
      rating: 2,
      essence: 3,
      installed: true,
      bodyLocation: "bodyware",
      reactionBonus: 4,
      initiativeDice: 2,
      streetIndex: 1,
      mods: "+4RCT,+2INI",
    });
  });

  it("normalizes bioware system data and keeps Bio Index modifiers", () => {
    expect(
      sr2BuildAugmentationSystemData({
        type: "bioware",
        name: "Cerebral Booster 2",
        category: "STANDARD",
        bookPage: "st.???",
        cost: "110000",
        streetIndex: "2.00",
        bioIndex: "0.8",
        mods: "+2INT",
      }),
    ).toEqual({
      description: "Category: STANDARD\nSource: st.???",
      price: 110000,
      rating: 2,
      bioIndex: 0.8,
      installed: false,
      bodyLocation: "standard",
      streetIndex: 2,
      mods: "+2INT",
    });
  });
});

describe("sr2BuildCatalogAugmentationRecord", () => {
  it("builds normalized browser/import records from catalog entries", () => {
    expect(
      sr2BuildCatalogAugmentationRecord({
        type: "cyberware",
        category: "HEADWEAR",
        item: {
          Name: "Smartlink II",
          EssCost: 0.5,
          Cost: 3200,
          StreetIndex: 2,
          Mods: "",
          BookPage: "fof.x",
        },
      }),
    ).toEqual({
      name: "Smartlink II",
      category: "HEADWEAR",
      cost: 3200,
      streetIndex: 2,
      bookPage: "fof.x",
      mods: "",
      type: "cyberware",
      essence: 0.5,
      rating: 2,
      reactionBonus: 0,
      initiativeDice: 0,
    });
  });
});

describe("augmentation install accounting", () => {
  const items = [
    { id: "c-1", type: "cyberware", system: { installed: true, essence: 1.5 } },
    { id: "c-2", type: "cyberware", system: { installed: false, essence: 1.0 } },
    { id: "b-1", type: "bioware", system: { installed: true, bioIndex: 0.75 } },
    { id: "b-2", type: "bioware", system: { installed: true, bioIndex: 0.5 } },
  ];

  it("computes installed cyberware Essence loss only from installed cyberware", () => {
    expect(sr2ComputeInstalledCyberwareEssenceLoss(items)).toBe(1.5);
  });

  it("computes installed bioware index and supports excluding the current item", () => {
    expect(sr2ComputeInstalledBiowareIndex(items)).toBe(1.25);
    expect(sr2ComputeInstalledBiowareIndex(items, { excludeItemId: "b-2" })).toBe(0.75);
  });
});
