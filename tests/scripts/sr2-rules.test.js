import { describe, expect, it } from "vitest";

import {
    sr2Clamp,
    sr2ComputeAttributePointsSpent,
    sr2ComputeContactLevelSummary,
    sr2ComputeCreationExtrasCost,
    sr2ComputeCreationLifestyleCost,
    sr2ComputeCreationNuyenBudgetBreakdown,
    sr2ComputeForcePointsSpent,
    sr2ComputeItemNuyenSpent,
    sr2ComputeSkillPointsSpent,
    sr2ComputeSkillRatingsFromAllocated,
    sr2ComputeSpellLockAugmentationModifiers,
    sr2ComputeSpellLockCapacity,
    sr2CountAssignedSpellLocks,
    sr2CountSpellLocksPurchased,
    sr2FormatSignedModifier,
    sr2GetRacialAttributeBounds,
    sr2GetRacialModifiers,
    sr2GetRacialTraits,
    sr2InferFocusBondCostForGearItem,
    sr2InferSpellLockAugmentationModifiersFromSpellName,
    sr2IsPriorityLetter,
    sr2NormalizeContactLevel,
    sr2ParseFocusName,
    sr2SkillInferAllocatedRating
} from "../../scripts/sr2-rules.js";

describe("sr2NormalizeContactLevel", () => {
    it("clamps values into the 1..3 range", () => {
        expect(sr2NormalizeContactLevel(-5)).toBe(1);
        expect(sr2NormalizeContactLevel("2")).toBe(2);
        expect(sr2NormalizeContactLevel(99)).toBe(3);
        expect(sr2NormalizeContactLevel("nope")).toBe(1);
    });
});

describe("sr2ComputeContactLevelSummary", () => {
    it("flags over-limit Level 3 contacts when charisma is too low", () => {
        const contacts = [
            { id: "a", sort: 1, contactLevel: 3 },
            { id: "b", sort: 2, contactLevel: 3 },
            { id: "c", sort: 3, contactLevel: 3 }
        ];

        const summary = sr2ComputeContactLevelSummary(contacts, 0);

        expect(summary.over.extraContacts).toBe(true);
        expect(summary.over.extraLevel3).toBe(true);
        expect(summary.costs.contactsTotalCost).toBeGreaterThan(0);
    });

    it("supports custom free contact counts", () => {
        const contacts = [
            { id: "a", sort: 1, contactLevel: 3 },
            { id: "b", sort: 2, contactLevel: 2 }
        ];

        const summary = sr2ComputeContactLevelSummary(contacts, 1, { freeContacts: 1 });

        expect(summary.freeContacts).toBe(1);
        expect(summary.counts.extraContacts).toBe(1);
        expect(summary.counts.totalLevel3).toBe(1);
    });
});

describe("sr2IsPriorityLetter", () => {
    it("accepts valid SR2 priority letters only", () => {
        expect(sr2IsPriorityLetter("A")).toBe(true);
        expect(sr2IsPriorityLetter("E")).toBe(true);
        expect(sr2IsPriorityLetter("F")).toBe(false);
        expect(sr2IsPriorityLetter("a")).toBe(false);
    });
});

describe("sr2ComputeItemNuyenSpent", () => {
    it("sums purchasable items only", () => {
        const items = [
            { type: "gear", system: { price: 500, quantity: 2 } },
            { type: "vehicle", system: { price: 1000, quantity: 1 } },
            { type: "spell", system: { price: 99999, quantity: 1 } },
            { type: "skill", system: { price: 99999, quantity: 1 } }
        ];

        expect(sr2ComputeItemNuyenSpent(items)).toBe(2000);
    });
});

describe("sr2ComputeCreationExtrasCost", () => {
    it("uses default extras pricing with two free contacts", () => {
        const cost = sr2ComputeCreationExtrasCost({
            contacts: 4,
            buddy: 1,
            gang: 1,
            followers: 0
        });

        // (4 - 2) * 5000 + buddy(10000) + gang(50000)
        expect(cost).toBe(70000);
    });

    it("respects contact summary and disabled buddies option", () => {
        const cost = sr2ComputeCreationExtrasCost(
            { contacts: 0, buddy: 1, gang: 0, followers: 1 },
            {
                disableBuddies: true,
                contactLevelsSummary: {
                    costs: {
                        contactsTotalCost: 12345
                    }
                }
            }
        );

        expect(cost).toBe(212345);
    });
});

describe("sr2ComputeCreationLifestyleCost", () => {
    it("clamps months to minimum 1 and handles unknown lifestyles", () => {
        const middle = sr2ComputeCreationLifestyleCost("middle", 0);
        const unknown = sr2ComputeCreationLifestyleCost("unknown", 2);

        expect(middle).toMatchObject({
            lifestyleKey: "middle",
            lifestyleMonths: 1,
            lifestyleCostPerMonth: 5000,
            lifestyleCost: 5000
        });
        expect(unknown.lifestyleCostPerMonth).toBe(0);
    });
});

describe("sr2ComputeCreationNuyenBudgetBreakdown", () => {
    it("includes item, lifestyle, and extras costs", () => {
        const system = {
            creation: {
                startingNuyen: 100000,
                lifestyleMonths: 2,
                extras: { contacts: 3, buddy: 1, gang: 0, followers: 0 }
            },
            resources: {
                lifestyle: "middle"
            }
        };
        const items = [{ type: "gear", system: { price: 1000, quantity: 5 } }];

        const breakdown = sr2ComputeCreationNuyenBudgetBreakdown(system, items, {
            disableBuddies: false
        });

        expect(breakdown.itemCost).toBe(5000);
        expect(breakdown.lifestyleCost).toBe(10000);
        expect(breakdown.extrasCost).toBe(15000);
        expect(breakdown.remainingNuyen).toBe(70000);
    });

    it("uses multiple lifestyle rows when provided", () => {
        const system = {
            creation: {
                startingNuyen: 20000,
                extras: { contacts: 2, buddy: 0, gang: 0, followers: 0 }
            },
            resources: {
                lifestyles: [
                    { type: "low", months: 1 },
                    { type: "middle", months: 2 }
                ]
            }
        };

        const breakdown = sr2ComputeCreationNuyenBudgetBreakdown(system, []);
        expect(breakdown.lifestyles).toHaveLength(2);
        expect(breakdown.lifestyleCost).toBe(11000);
        expect(breakdown.remainingNuyen).toBe(9000);
    });
});

describe("sr2ComputeSkillRatingsFromAllocated", () => {
    it("enforces language skill behavior with no conc/spec", () => {
        const ratings = sr2ComputeSkillRatingsFromAllocated({
            baseSkill: "Language",
            allocatedRating: 4,
            concentration: "Street",
            specialization: "None"
        });

        expect(ratings).toEqual({
            allocatedRating: 4,
            baseRating: 4,
            concentrationRating: 0,
            specializationRating: 0,
            minAllocated: 1
        });
    });

    it("computes concentration and specialization tiers", () => {
        const concentration = sr2ComputeSkillRatingsFromAllocated({
            allocatedRating: 3,
            concentration: "SMGs"
        });
        const specialization = sr2ComputeSkillRatingsFromAllocated({
            allocatedRating: 3,
            concentration: "Pistols",
            specialization: "Heavy Pistols"
        });

        expect(concentration).toMatchObject({
            allocatedRating: 3,
            baseRating: 2,
            concentrationRating: 4,
            specializationRating: 0,
            minAllocated: 2
        });
        expect(specialization).toMatchObject({
            allocatedRating: 3,
            baseRating: 1,
            concentrationRating: 3,
            specializationRating: 5,
            minAllocated: 3
        });
    });
});

describe("sr2SkillInferAllocatedRating", () => {
    it("prefers explicit allocatedRating and clamps negative values", () => {
        expect(sr2SkillInferAllocatedRating({ allocatedRating: 5 })).toBe(5);
        expect(sr2SkillInferAllocatedRating({ allocatedRating: -2 })).toBe(0);
    });

    it("supports legacy rating and conc/spec fallbacks", () => {
        expect(sr2SkillInferAllocatedRating({ rating: 6 })).toBe(6);
        expect(sr2SkillInferAllocatedRating({ concentration: "SMG", concentrationRating: 4 })).toBe(3);
        expect(sr2SkillInferAllocatedRating({ specialization: "Heavy", specializationRating: 6 })).toBe(4);
        expect(sr2SkillInferAllocatedRating({ specialization: "Heavy", concentrationRating: 3 })).toBe(3);
        expect(sr2SkillInferAllocatedRating({ specialization: "Heavy", baseRating: 2 })).toBe(4);
    });
});

describe("sr2InferFocusBondCostForGearItem", () => {
    it("infers weapon focus bond costs from name and price table", () => {
        const smallCost = sr2InferFocusBondCostForGearItem({
            category: "Magical Equipment",
            name: "Weapon Focus 2",
            price: 380000
        });

        const largeCost = sr2InferFocusBondCostForGearItem({
            category: "Magical Equipment",
            name: "Weapon Focus 2",
            price: 480000
        });

        expect(smallCost).toBe(8);
        expect(largeCost).toBe(10);
    });

    it("returns zero for non-magical categories", () => {
        const cost = sr2InferFocusBondCostForGearItem({
            category: "Cyberware",
            name: "Weapon Focus 2",
            price: 480000
        });
        expect(cost).toBe(0);
    });
});

describe("sr2ParseFocusName", () => {
    it("parses focus naming conventions and rejects invalid names", () => {
        expect(sr2ParseFocusName("Spell Lock")).toEqual({ kind: "spell lock", rating: 0, name: "Spell Lock" });
        expect(sr2ParseFocusName("Spell Category Focus 3")).toEqual({
            kind: "spell type focus",
            rating: 3,
            name: "Spell Category Focus 3"
        });
        expect(sr2ParseFocusName("Power Focus 0")).toBeNull();
        expect(sr2ParseFocusName("Not A Focus")).toBeNull();
    });
});

describe("sr2 utility coverage", () => {
    it("clamps numbers and returns min for non-finite", () => {
        expect(sr2Clamp(5, 1, 4)).toBe(4);
        expect(sr2Clamp(-1, 0, 6)).toBe(0);
        expect(sr2Clamp("nope", 2, 6)).toBe(2);
    });

    it("returns racial defaults for unknown metatype", () => {
        expect(sr2GetRacialModifiers("unknown")).toEqual(sr2GetRacialModifiers("human"));
        expect(sr2GetRacialTraits("unknown")).toEqual(sr2GetRacialTraits("human"));
    });

    it("computes racial bounds and attribute point spending", () => {
        const bounds = sr2GetRacialAttributeBounds("troll");
        expect(bounds.body).toEqual({ min: 5, max: 11 });
        expect(bounds.charisma).toEqual({ min: -2, max: 4 });

        const spent = sr2ComputeAttributePointsSpent(
            {
                body: { value: 20 },
                quickness: { value: -10 },
                strength: { value: 7 },
                charisma: { value: 0 },
                intelligence: { value: 1 },
                willpower: { value: 2 }
            },
            "troll"
        );
        expect(spent).toBeGreaterThanOrEqual(0);
    });
});

describe("sr2 skill/force/spell lock helpers", () => {
    it("counts skill points while skipping free and invalid skills", () => {
        const spent = sr2ComputeSkillPointsSpent([
            { system: { baseSkill: "Pistols", allocatedRating: 4 } },
            { system: { baseSkill: "Language", allocatedRating: 3, isFree: true } },
            { system: { allocatedRating: 8 } }
        ]);
        expect(spent).toBe(4);
    });

    it("computes force points across spells and magical gear", () => {
        const spent = sr2ComputeForcePointsSpent([
            { type: "spell", system: { force: 3 } },
            {
                type: "gear",
                name: "Spell Lock",
                system: { category: "Magical Equipment", quantity: 2, bondCost: 0, price: 10000 }
            },
            {
                type: "gear",
                name: "Power Focus 1",
                system: { category: "Magical Equipment", quantity: 1, bondCost: 9, price: 500000 }
            }
        ]);
        expect(spent).toBe(14);
    });

    it("formats signed modifiers and spell lock counts/capacity", () => {
        expect(sr2FormatSignedModifier(3)).toBe("+3");
        expect(sr2FormatSignedModifier(-1)).toBe("-1");
        expect(sr2FormatSignedModifier(0)).toBe("0");

        const items = [
            { type: "gear", name: "Spell Lock", system: { quantity: 2 } },
            { type: "gear", name: "Spell Lock", system: { quantity: 1.8 } },
            { type: "spell", system: { spellLock: { assigned: true } } },
            { type: "spell", system: { spellLock: { assigned: false } } }
        ];
        expect(sr2CountSpellLocksPurchased(items)).toBe(3);
        expect(sr2CountAssignedSpellLocks(items)).toBe(1);
        expect(sr2ComputeSpellLockCapacity(items)).toEqual({ total: 3, assigned: 1, remaining: 2 });
    });

    it("infers spell lock augmentation modifiers", () => {
        expect(sr2InferSpellLockAugmentationModifiersFromSpellName("Increase Reflexes +2 dice")).toEqual({ INI: 2 });
        expect(sr2InferSpellLockAugmentationModifiersFromSpellName("Armor")).toEqual({});

        const modifiers = sr2ComputeSpellLockAugmentationModifiers([
            { type: "spell", name: "Increase Reflexes +1 die", system: { spellLock: { enabled: true } } },
            { type: "spell", name: "Increase Reflexes +3 dice", system: { spellLock: { enabled: true } } },
            { type: "spell", name: "Increase Reflexes +2 dice", system: { spellLock: { enabled: false } } }
        ]);
        expect(modifiers.INI).toBe(4);
        expect(modifiers.BOD).toBe(0);
    });
});
