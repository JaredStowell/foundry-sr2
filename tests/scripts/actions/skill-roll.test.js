import { describe, expect, it } from "vitest";

import {
  sr2PrepareSkillRoll,
  sr2ResolveSkillWithPendingAllocation,
} from "../../../scripts/actions/skill-roll.js";

function createSkill(system = {}, name = "Skill") {
  return {
    id: "skill-1",
    name,
    system: {
      baseSkill: "Firearms",
      allocatedRating: 4,
      baseRating: 4,
      concentration: "",
      concentrationRating: 0,
      specialization: "",
      specializationRating: 0,
      ...system,
    },
  };
}

describe("skill roll helpers", () => {
  it("recomputes pending allocated ratings before a roll", () => {
    const skill = createSkill();
    const resolved = sr2ResolveSkillWithPendingAllocation(skill, 5);

    expect(resolved.system.allocatedRating).toBe(5);
    expect(resolved.system.baseRating).toBe(5);
  });

  it("prepares base, concentration, and specialization rolls", () => {
    const actor = {
      system: {
        attributes: {
          magic: { value: 6 },
        },
      },
    };

    const concentration = sr2PrepareSkillRoll({
      actor,
      skill: createSkill(
        {
          concentration: "Pistols",
          concentrationRating: 6,
        },
        "Firearms",
      ),
      rollType: "concentration",
    });
    expect(concentration).toMatchObject({
      ok: true,
      dicePool: 6,
      finalTitle: "Firearms (Pistols) (Concentration)",
    });

    const specialization = sr2PrepareSkillRoll({
      actor,
      skill: createSkill(
        {
          specialization: "Heavy Pistols",
          specializationRating: 7,
        },
        "Firearms",
      ),
      rollType: "specialization",
    });
    expect(specialization).toMatchObject({
      ok: true,
      dicePool: 7,
      finalTitle: "Firearms [Heavy Pistols] (Specialization)",
    });
  });

  it("reports missing concentration or specialization cleanly", () => {
    const actor = {
      system: {
        attributes: {
          magic: { value: 6 },
        },
      },
    };

    expect(
      sr2PrepareSkillRoll({
        actor,
        skill: createSkill(),
        rollType: "concentration",
      }),
    ).toMatchObject({ ok: false, reason: "missing-concentration" });

    expect(
      sr2PrepareSkillRoll({
        actor,
        skill: createSkill(),
        rollType: "specialization",
      }),
    ).toMatchObject({ ok: false, reason: "missing-specialization" });
  });

  it("enforces magic requirements and keeps defaulting testable", () => {
    expect(
      sr2PrepareSkillRoll({
        actor: { system: { attributes: { magic: { value: 0 } } } },
        skill: createSkill({ baseSkill: "Sorcery" }, "Sorcery"),
        rollType: "base",
      }),
    ).toMatchObject({ ok: false, reason: "missing-magic" });

    expect(
      sr2PrepareSkillRoll({
        actor: { system: { attributes: { magic: { value: 6 } } } },
        skill: createSkill({ baseRating: 0 }, "Stealth"),
        rollType: "base",
      }),
    ).toMatchObject({ ok: true, dicePool: 1, isDefaulting: true });
  });
});
