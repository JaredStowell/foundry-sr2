import { sr2ComputeSkillRatingsFromAllocated, sr2SkillInferAllocatedRating } from "../sr2-rules.js";

export function sr2ResolveSkillWithPendingAllocation(skill, allocatedRatingValue) {
  if (!skill || !Number.isFinite(Number(allocatedRatingValue))) return skill;

  const allocated = Number(allocatedRatingValue);
  const currentAllocated = sr2SkillInferAllocatedRating(skill.system);
  if (allocated === currentAllocated) return skill;

  const computed = sr2ComputeSkillRatingsFromAllocated({
    ...skill.system,
    allocatedRating: allocated,
  });

  return {
    ...skill,
    system: {
      ...skill.system,
      allocatedRating: computed.allocatedRating,
      baseRating: computed.baseRating,
      concentrationRating: computed.concentrationRating,
      specializationRating: computed.specializationRating,
    },
  };
}

export function sr2PrepareSkillRoll({
  actor,
  skill,
  rollType = "base",
  allocatedRatingValue,
} = {}) {
  if (!skill) {
    return { ok: false, reason: "missing-skill", error: "Skill not found for roll" };
  }

  const resolvedSkill = sr2ResolveSkillWithPendingAllocation(skill, allocatedRatingValue);
  const baseSkillName = resolvedSkill.system?.baseSkill || "";
  const magicRating = Number(actor?.system?.attributes?.magic?.value) || 0;

  if ((baseSkillName === "Sorcery" || baseSkillName === "Conjuring") && magicRating <= 0) {
    return {
      ok: false,
      reason: "missing-magic",
      error: "Sorcery and Conjuring require a Magic rating.",
    };
  }

  let skillRating = 0;
  let title = resolvedSkill.name || resolvedSkill.system?.baseSkill || "Unknown Skill";
  let rollDescription = "";

  switch (String(rollType || "base")) {
    case "concentration":
      skillRating = parseInt(resolvedSkill.system?.concentrationRating, 10) || 0;
      if (!resolvedSkill.system?.concentration) {
        return {
          ok: false,
          reason: "missing-concentration",
          warning: "No concentration selected for this skill.",
        };
      }
      title = `${resolvedSkill.system.baseSkill || resolvedSkill.name} (${resolvedSkill.system.concentration})`;
      rollDescription = "Concentration";
      break;
    case "specialization":
      skillRating = parseInt(resolvedSkill.system?.specializationRating, 10) || 0;
      if (!resolvedSkill.system?.specialization) {
        return {
          ok: false,
          reason: "missing-specialization",
          warning: "No specialization entered for this skill.",
        };
      }
      title = `${resolvedSkill.system.baseSkill || resolvedSkill.name} [${resolvedSkill.system.specialization}]`;
      rollDescription = "Specialization";
      break;
    case "base":
    default:
      skillRating = parseInt(resolvedSkill.system?.baseRating, 10) || 0;
      rollDescription = "Base Skill";
      title = resolvedSkill.system?.baseSkill || resolvedSkill.name || "Unknown Skill";
      if (resolvedSkill.system?.baseSkill === "Language" && resolvedSkill.name) {
        title = resolvedSkill.name;
      }
      break;
  }

  const dicePool = Math.max(1, skillRating);
  return {
    ok: true,
    skill: resolvedSkill,
    baseSkillName,
    skillRating,
    dicePool,
    rollDescription,
    title,
    finalTitle: `${title} (${rollDescription})`,
    isDefaulting: skillRating < 1,
  };
}
