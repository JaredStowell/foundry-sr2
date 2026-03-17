export const SR2_KNOWLEDGE_TARGET_NUMBERS = Object.freeze({
  general: 3,
  detailed: 5,
  intricate: 8,
  obscure: 12,
});

export const SR2_LANGUAGE_TARGET_NUMBERS = Object.freeze({
  universal: 2,
  basic: 4,
  complex: 6,
  intricate: 9,
  obscure: 11,
});

export const SR2_SOCIAL_ATTITUDE_MODIFIERS = Object.freeze({
  friendly: -2,
  neutral: 0,
  suspicious: 2,
  hostile: 4,
  enemy: 6,
});

export const SR2_SOCIAL_VALUE_MODIFIERS = Object.freeze({
  advantageous: -2,
  none: 0,
  neutral: 0,
  annoying: 2,
  harmful: 4,
  disastrous: 6,
});

export const SR2_BUILD_REPAIR_BASE_TARGET_NUMBERS = Object.freeze({
  ordinary: 4,
  technical: 6,
  exotic: 8,
});

export const SR2_BUILD_REPAIR_PRICE_DIVISORS = Object.freeze({
  combat: 10,
  vehicle: 20,
  technical: 50,
});

function sr2GraphNeighbors(graph, node) {
  return Array.isArray(graph?.[node]) ? graph[node] : [];
}

// Defaulting traces a legal Skill Web path from a known skill or attribute to the desired skill.
export function sr2FindSkillWebPath(graph, startNode, targetNode) {
  const start = String(startNode || "");
  const target = String(targetNode || "");
  if (!start || !target) return null;
  if (start === target) return [start];

  const queue = [[start]];
  const visited = new Set([start]);

  while (queue.length > 0) {
    const path = queue.shift();
    const node = path[path.length - 1];
    for (const next of sr2GraphNeighbors(graph, node)) {
      if (visited.has(next)) continue;
      const nextPath = [...path, next];
      if (next === target) return nextPath;
      visited.add(next);
      queue.push(nextPath);
    }
  }

  return null;
}

// Each Skill Web node crossed adds +2 TN when defaulting.
export function sr2ComputeSkillWebDefaultingModifier(path) {
  if (!Array.isArray(path) || path.length < 2) return 0;
  return (path.length - 1) * 2;
}

// When several defaulting routes exist, prefer the lowest-TN path, then a skill over an attribute.
export function sr2ResolveSkillWebDefaulting({
  graph,
  target,
  knownSkills = {},
  knownAttributes = {},
} = {}) {
  const candidates = [];

  for (const [name, dicePool] of Object.entries(knownSkills || {})) {
    if ((Number(dicePool) || 0) <= 0) continue;
    const path = sr2FindSkillWebPath(graph, name, target);
    if (!path) continue;
    candidates.push({
      source: name,
      sourceType: "skill",
      dicePool: Number(dicePool) || 0,
      path,
      tnModifier: sr2ComputeSkillWebDefaultingModifier(path),
    });
  }

  for (const [name, dicePool] of Object.entries(knownAttributes || {})) {
    if ((Number(dicePool) || 0) <= 0) continue;
    const path = sr2FindSkillWebPath(graph, name, target);
    if (!path) continue;
    candidates.push({
      source: name,
      sourceType: "attribute",
      dicePool: Number(dicePool) || 0,
      path,
      tnModifier: sr2ComputeSkillWebDefaultingModifier(path),
    });
  }

  if (candidates.length === 0) return null;

  candidates.sort((a, b) => {
    if (a.tnModifier !== b.tnModifier) return a.tnModifier - b.tnModifier;
    if (a.sourceType !== b.sourceType) return a.sourceType === "skill" ? -1 : 1;
    if (a.dicePool !== b.dicePool) return b.dicePool - a.dicePool;
    return a.source.localeCompare(b.source);
  });

  return candidates[0];
}

// Perception is usually TN 4 unless a specific TN, like Concealability, replaces it.
export function sr2ComputePerceptionTargetNumber({
  specificTargetNumber = null,
  modifiers = [],
} = {}) {
  const base = specificTargetNumber == null ? 4 : Number(specificTargetNumber) || 4;
  const totalModifier = (modifiers || []).reduce((sum, value) => sum + (Number(value) || 0), 0);
  return Math.max(2, base + totalModifier);
}

// Group perception uses average Intelligence plus 1 die per team member.
export function sr2ComputeGroupPerceptionDice(intelligenceRatings, { rounding = "nearest" } = {}) {
  const ratings = (intelligenceRatings || [])
    .map((value) => Number(value) || 0)
    .filter((value) => value > 0);
  if (ratings.length === 0) return 0;

  const average = ratings.reduce((sum, value) => sum + value, 0) / ratings.length;
  const roundedAverage =
    rounding === "floor"
      ? Math.floor(average)
      : rounding === "ceil"
        ? Math.ceil(average)
        : Math.round(average);
  return roundedAverage + ratings.length;
}

// Perception success bands go from noticing something to knowing exactly what it is.
export function sr2InterpretPerceptionSuccesses(successes) {
  const count = Math.max(0, Number(successes) || 0);
  if (count <= 0) return "No useful information";
  if (count === 1) return "Notice something is there";
  if (count === 2) return "Confirm something is there and suspect its kind";
  if (count === 3) return "Know the kind of thing and suspect its exact nature";
  return "Know what it is with specific detail";
}

// Knowledge tests use the SR2 general/detailed/intricate/obscure TN table.
export function sr2GetKnowledgeTargetNumber(level) {
  return SR2_KNOWLEDGE_TARGET_NUMBERS[String(level || "").toLowerCase()] ?? 12;
}

// Knowledge successes scale from broad familiarity to detailed and accurate information.
export function sr2InterpretKnowledgeSuccesses(successes) {
  const count = Math.max(0, Number(successes) || 0);
  if (count <= 0) return "No useful information";
  if (count === 1) return "General knowledge, no details";
  if (count === 2) return "Detailed information, but minor points inaccurate";
  if (count === 3) return "Detailed information, but minor points missing or obscure";
  return "Detailed and accurate information";
}

// Language tests use the topic TN ladder, with +2 TN for dialect variation.
export function sr2GetLanguageTargetNumber({ situation = "basic", dialect = false } = {}) {
  const base = SR2_LANGUAGE_TARGET_NUMBERS[String(situation || "").toLowerCase()] ?? 4;
  return base + (dialect ? 2 : 0);
}

// Social tests start from the NPC's mental attribute and add attitude, value, and racism modifiers.
export function sr2ComputeSocialTargetNumber({
  baseMentalAttribute = 4,
  attitude = "neutral",
  value = "none",
  racismPoints = 0,
} = {}) {
  return Math.max(
    2,
    (Number(baseMentalAttribute) || 4) +
      (SR2_SOCIAL_ATTITUDE_MODIFIERS[String(attitude || "").toLowerCase()] ?? 0) +
      (SR2_SOCIAL_VALUE_MODIFIERS[String(value || "").toLowerCase()] ?? 0) +
      Math.max(0, Number(racismPoints) || 0),
  );
}

// Optional racism points come from 2D6 - 6, never below 0.
export function sr2ComputeRacismPointsFromRoll(twoD6Total) {
  return Math.max(0, (Number(twoD6Total) || 0) - 6);
}

// A separate Charisma test cancels 1 racism point per success.
export function sr2ComputeCharismaOffsetsForRacism(charismaSuccesses) {
  return Math.max(0, Number(charismaSuccesses) || 0);
}

// Optional legwork fees scale with contact Etiquette, player successes, and the contact's mental stats.
export function sr2ComputeLegworkFee({
  contactEtiquette = 0,
  playerSuccesses = 0,
  contactCharisma = 0,
  contactIntelligence = 0,
} = {}) {
  return (
    Math.max(0, Number(contactEtiquette) || 0) *
    Math.max(0, Number(playerSuccesses) || 0) *
    (Math.max(0, Number(contactCharisma) || 0) + Math.max(0, Number(contactIntelligence) || 0)) *
    10
  );
}

// Build time starts from the comparable item price divided by the SR2 category divisor.
export function sr2ComputeBuildRepairHours({ comparablePrice = 0, category = "technical" } = {}) {
  const divisor = SR2_BUILD_REPAIR_PRICE_DIVISORS[String(category || "").toLowerCase()] ?? 50;
  return Math.max(0, Number(comparablePrice) || 0) / divisor;
}

// Build/Repair TNs start from the ordinary/technical/exotic guideline, then add situational modifiers.
export function sr2ComputeBuildRepairTargetNumber({
  baseCategory = "ordinary",
  conditionModifier = 0,
  toolModifier = 0,
  referenceModifier = 0,
  memoryModifier = 0,
} = {}) {
  const base = SR2_BUILD_REPAIR_BASE_TARGET_NUMBERS[String(baseCategory || "").toLowerCase()] ?? 4;
  return Math.max(
    2,
    base +
      (Number(conditionModifier) || 0) +
      (Number(toolModifier) || 0) +
      (Number(referenceModifier) || 0) +
      (Number(memoryModifier) || 0),
  );
}

// Build/Repair actual time is base time divided by the number of successes.
export function sr2ComputeBuildRepairActualHours({ baseHours = 0, successes = 0 } = {}) {
  const hours = Math.max(0, Number(baseHours) || 0);
  const successCount = Math.max(1, Number(successes) || 0);
  return hours / successCount;
}
