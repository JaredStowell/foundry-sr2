import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  SR2_SPELL_CLASS_LABELS,
  loadSkillsData,
  sr2ApplyDamageToActor,
  sr2FindWeaponSkill,
  sr2FormatSpellDrain,
  sr2GetArmorRatings,
  sr2GetEffectiveSkillRating,
  sr2GetHighestSkillRatingByBaseSkill,
  sr2GetModifiedAttribute,
  sr2GetSystemSetting,
  sr2GetWeaponSkillData,
  sr2InferSpellDamageLevelFromDrain,
  sr2InferSpellRangeFromName,
  sr2InferSpellResistFromType,
  sr2NormalizeSpellClass,
  sr2ParseDamageCode,
  sr2StageDamageLevel,
} from "../../../scripts/actor/actor-sheet-helpers.js";

function createSkill({
  id,
  name,
  baseSkill,
  baseRating = 0,
  concentration = "",
  concentrationRating = 0,
  specialization = "",
  specializationRating = 0,
} = {}) {
  return {
    id: id || baseSkill || name,
    type: "skill",
    name: name || baseSkill || "Skill",
    system: {
      baseSkill: baseSkill || "",
      baseRating,
      concentration,
      concentrationRating,
      specialization,
      specializationRating,
    },
  };
}

function createItemsCollection(items) {
  const byId = new Map(items.map((item) => [item.id, item]));
  return {
    get(id) {
      return byId.get(id);
    },
    filter(predicate) {
      return items.filter(predicate);
    },
    find(predicate) {
      return items.find(predicate);
    },
  };
}

describe("actor-sheet helper spell utilities", () => {
  it("infers spell presentation fields", () => {
    expect(sr2InferSpellRangeFromName("Treat Touch")).toBe("Touch");
    expect(sr2InferSpellRangeFromName("Manabolt")).toBe("LOS");
    expect(sr2InferSpellResistFromType("M")).toBe("Willpower");
    expect(sr2InferSpellResistFromType("mana")).toBe("Willpower");
    expect(sr2InferSpellResistFromType("p")).toBe("Body");
    expect(sr2InferSpellResistFromType("physical")).toBe("Body");
    expect(sr2InferSpellDamageLevelFromDrain("[Force/2]S")).toBe("S");
    expect(sr2FormatSpellDrain("[Force/2]S")).toBe("Force/2 S");
    expect(sr2NormalizeSpellClass("manipulation")).toBe("M");
    expect(SR2_SPELL_CLASS_LABELS.M).toBe("Manipulation");
  });

  it("falls back safely for unknown spell metadata", () => {
    expect(sr2InferSpellRangeFromName("")).toBe("");
    expect(sr2InferSpellResistFromType("x")).toBe("");
    expect(sr2InferSpellDamageLevelFromDrain("Force/2")).toBe("");
    expect(sr2FormatSpellDrain("Force/2")).toBe("Force/2");
    expect(sr2NormalizeSpellClass("weird")).toBe("");
  });
});

describe("actor-sheet helper settings and attributes", () => {
  beforeEach(() => {
    game.settings = {
      get: vi.fn(),
    };
  });

  it("reads system settings with fallback behavior", () => {
    game.settings.get.mockReturnValueOnce(true).mockImplementationOnce(() => {
      throw new Error("boom");
    });

    expect(sr2GetSystemSetting("contactLevels", false)).toBe(true);
    expect(sr2GetSystemSetting("disableBuddies", false)).toBe(false);
  });

  it("computes modified attributes from augmentation modifiers", () => {
    const actor = {
      system: {
        attributes: {
          body: { value: 4 },
          strength: { value: 3 },
          reaction: { value: 5 },
        },
      },
      _sr2AugmentationModifiers: {
        BOD: 2,
        STR: 1,
      },
    };

    expect(sr2GetModifiedAttribute(actor, "body")).toBe(6);
    expect(sr2GetModifiedAttribute(actor, "strength")).toBe(4);
    expect(sr2GetModifiedAttribute(actor, "reaction")).toBe(5);
  });
});

describe("actor-sheet helper damage parsing and staging", () => {
  it("parses standard and stun damage codes", () => {
    expect(sr2ParseDamageCode("9M")).toEqual({
      power: 9,
      level: "M",
      damageType: "physical",
      raw: "9M",
    });
    expect(sr2ParseDamageCode("(STR+2)S Stun", { strength: 5 })).toEqual({
      power: 7,
      level: "S",
      damageType: "stun",
      raw: "(STR+2)S Stun",
    });
  });

  it("handles strength minimum and rejects unsafe formulas", () => {
    expect(sr2ParseDamageCode("(STR MIN. + 1)M", { strength: 2, strengthMin: 4 })).toEqual({
      power: 5,
      level: "M",
      damageType: "physical",
      raw: "(STR MIN. + 1)M",
    });
    expect(sr2ParseDamageCode("alert(1)M")).toBeNull();
  });

  it("stages damage levels within SR2 limits", () => {
    expect(sr2StageDamageLevel("M", 1)).toBe("S");
    expect(sr2StageDamageLevel("S", 5)).toBe("D");
    expect(sr2StageDamageLevel("L", -1)).toBeNull();
    expect(sr2StageDamageLevel("?", 1)).toBeNull();
  });
});

describe("actor-sheet helper damage application", () => {
  it("applies physical damage directly", async () => {
    const actor = {
      system: {
        health: {
          physical: { value: 2, max: 10 },
          stun: { value: 1, max: 10 },
        },
      },
      update: vi.fn(async () => {}),
    };

    await expect(sr2ApplyDamageToActor(actor, "physical", 3)).resolves.toBe(true);
    expect(actor.update).toHaveBeenCalledWith({
      "system.health.physical.value": 5,
    });
  });

  it("carries excess stun into physical", async () => {
    const actor = {
      system: {
        health: {
          physical: { value: 4, max: 10 },
          stun: { value: 9, max: 10 },
        },
      },
      update: vi.fn(async () => {}),
    };

    await expect(sr2ApplyDamageToActor(actor, "stun", 3)).resolves.toBe(true);
    expect(actor.update).toHaveBeenCalledWith({
      "system.health.stun.value": 10,
      "system.health.physical.value": 6,
    });
  });

  it("refuses to apply damage when tracks are missing or amount is invalid", async () => {
    await expect(sr2ApplyDamageToActor(null, "physical", 3)).resolves.toBe(false);
    await expect(
      sr2ApplyDamageToActor(
        {
          system: { health: { physical: { value: 1, max: 10 } } },
          update: vi.fn(),
        },
        "physical",
        3,
      ),
    ).resolves.toBe(false);
  });
});

describe("actor-sheet helper armor and weapon skill lookup", () => {
  beforeEach(() => {
    ui.notifications.warn.mockClear();
  });

  it("sums equipped armor with dermal armor", () => {
    const actor = {
      items: [
        { type: "armor", system: { equipped: true, ballistic: 3, impact: 2 } },
        { type: "armor", system: { equipped: false, ballistic: 9, impact: 9 } },
        { type: "armor", system: { equipped: true, ballistic: 1, impact: 4 } },
      ],
      system: {
        details: {
          traits: {
            dermalArmor: 2,
          },
        },
      },
    };

    expect(sr2GetArmorRatings(actor)).toEqual({
      ballistic: 6,
      impact: 8,
    });
  });

  it("uses linked specialization data when present", () => {
    const linkedSkill = createSkill({
      id: "skill-1",
      name: "Pistols",
      baseSkill: "Firearms",
      specialization: "Heavy Pistols",
      specializationRating: 8,
    });
    const actor = {
      items: createItemsCollection([linkedSkill]),
    };
    const weapon = {
      name: "Predator",
      system: {
        weaponType: "ranged",
        linkedSkill: {
          skillId: "skill-1",
          rollType: "specialization",
        },
      },
    };

    expect(sr2GetWeaponSkillData(actor, weapon)).toEqual({
      skillRating: 8,
      skillName: "Pistols [Heavy Pistols]",
      rollDescription: "Specialization",
    });
  });

  it("warns when linked specialization metadata is incomplete", () => {
    const linkedSkill = createSkill({
      id: "skill-2",
      name: "Pistols",
      baseSkill: "Firearms",
      specializationRating: 7,
    });
    const actor = {
      items: createItemsCollection([linkedSkill]),
    };
    const weapon = {
      name: "Predator",
      system: {
        weaponType: "ranged",
        linkedSkill: {
          skillId: "skill-2",
          rollType: "specialization",
        },
      },
    };

    expect(sr2GetWeaponSkillData(actor, weapon, { notify: true })).toEqual({
      skillRating: 7,
      skillName: "Defaulting",
      rollDescription: "No Specialization",
    });
    expect(ui.notifications.warn).toHaveBeenCalledWith(
      "Predator is linked to a skill with no specialization entered.",
    );
  });

  it("auto-detects a fallback combat skill", () => {
    const firearms = createSkill({
      id: "skill-3",
      name: "Firearms",
      baseSkill: "Firearms",
      baseRating: 5,
    });
    const gunnery = createSkill({
      id: "skill-4",
      name: "Gunnery",
      baseSkill: "Gunnery",
      baseRating: 6,
    });
    const actor = {
      items: createItemsCollection([firearms, gunnery]),
    };
    const weapon = {
      name: "LMG",
      system: {
        weaponType: "ranged",
      },
    };

    expect(sr2GetWeaponSkillData(actor, weapon)).toEqual({
      skillRating: 6,
      skillName: "Gunnery",
      rollDescription: "Auto-detected",
    });
  });

  it("finds weapon skills from links and name heuristics", () => {
    const edged = createSkill({
      id: "skill-5",
      name: "Edged Weapons",
      baseSkill: "Edged Weapons",
      baseRating: 4,
    });
    const pistols = createSkill({
      id: "skill-6",
      name: "Pistols",
      baseSkill: "Pistols",
      baseRating: 5,
    });
    const actor = {
      items: createItemsCollection([edged, pistols]),
    };

    expect(
      sr2FindWeaponSkill(actor, {
        name: "Ares Predator Pistol",
        system: {},
      }),
    ).toBe(pistols);
    expect(
      sr2FindWeaponSkill(actor, {
        name: "Katana",
        system: {
          linkedSkill: {
            skillId: "skill-5",
          },
        },
      }),
    ).toBe(edged);
  });

  it("computes effective and highest skill ratings", () => {
    const sorceryA = createSkill({
      id: "skill-7",
      name: "Sorcery",
      baseSkill: "Sorcery",
      baseRating: 4,
      concentrationRating: 6,
    });
    const sorceryB = createSkill({
      id: "skill-8",
      name: "Sorcery (Combat)",
      baseSkill: "Sorcery",
      specializationRating: 7,
    });
    const actor = {
      items: createItemsCollection([sorceryA, sorceryB]),
    };

    expect(sr2GetEffectiveSkillRating(sorceryA)).toBe(6);
    expect(sr2GetHighestSkillRatingByBaseSkill(actor, "Sorcery")).toBe(7);
    expect(sr2GetHighestSkillRatingByBaseSkill(actor, "Conjuring")).toBe(0);
  });
});

describe("actor-sheet helper skills data loader", () => {
  it("caches skills data after the first fetch", async () => {
    const payload = { Firearms: { Concentrations: ["Pistols"] } };
    const fetchMock = vi.fn(async () => ({
      json: async () => payload,
    }));

    vi.stubGlobal("fetch", fetchMock);

    const first = await loadSkillsData();
    const second = await loadSkillsData();

    expect(first).toBe(payload);
    expect(second).toBe(payload);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    vi.unstubAllGlobals();
  });
});
