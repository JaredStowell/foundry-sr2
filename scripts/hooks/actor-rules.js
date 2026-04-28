import {
  sr2ComputeKarmaPoolTotal,
  sr2GetRacialAttributeBounds,
  sr2GetRacialModifiers,
  sr2GetRacialTraits,
  sr2HasCreationLimits,
} from "../sr2-rules.js";

const SR2_ACTOR_RULE_HOOKS_KEY = "__sr2ActorRuleHooksInstalled";
const SR2_CHARACTER_LIKE_TYPES = ["character", "contact", "follower"];

function sr2IsSameUser(userId) {
  if (typeof userId !== "string") return true;
  const currentUserId = globalThis.game?.user?.id;
  if (!currentUserId) return true;
  return userId === currentUserId;
}

function sr2NormalizeKarmaNumber(value) {
  return Math.max(0, Math.floor(Number(value) || 0));
}

function sr2SyncKarmaPoolFromEarned(actor, changes) {
  const getProperty = globalThis.foundry?.utils?.getProperty;
  const setProperty = globalThis.foundry?.utils?.setProperty;
  if (typeof getProperty !== "function" || typeof setProperty !== "function") return;

  const earnedUpdate = getProperty(changes, "system.karma.earned");
  const baseUpdate = getProperty(changes, "system.pools.karma.base");
  if (earnedUpdate === undefined && baseUpdate === undefined) return;

  const oldEarned = sr2NormalizeKarmaNumber(actor.system?.karma?.earned);
  const oldBase = sr2NormalizeKarmaNumber(
    actor.system?.pools?.karma?.base ?? actor.system?.pools?.karma?.total,
  );
  const oldTotal = sr2NormalizeKarmaNumber(actor.system?.pools?.karma?.total);
  const oldCurrent = sr2NormalizeKarmaNumber(actor.system?.pools?.karma?.current);

  const nextEarned = sr2NormalizeKarmaNumber(earnedUpdate === undefined ? oldEarned : earnedUpdate);
  const nextBase = sr2NormalizeKarmaNumber(baseUpdate === undefined ? oldBase : baseUpdate);
  const nextTotal = sr2ComputeKarmaPoolTotal(nextBase, nextEarned);

  const currentUpdate = getProperty(changes, "system.pools.karma.current");
  const nextCurrentRaw =
    currentUpdate === undefined
      ? oldCurrent + Math.max(0, nextTotal - oldTotal)
      : sr2NormalizeKarmaNumber(currentUpdate);
  const nextCurrent = Math.max(0, Math.min(nextTotal, nextCurrentRaw));

  setProperty(changes, "system.karma.earned", nextEarned);
  setProperty(changes, "system.pools.karma.base", nextBase);
  setProperty(changes, "system.pools.karma.total", nextTotal);
  setProperty(changes, "system.pools.karma.current", nextCurrent);
}

export function registerActorRuleHooks({ syncFreeLanguageSkills } = {}) {
  if (globalThis[SR2_ACTOR_RULE_HOOKS_KEY]) return;
  globalThis[SR2_ACTOR_RULE_HOOKS_KEY] = true;

  Hooks.on("preUpdateActor", function (actor, changes, options, userId) {
    if (!sr2IsSameUser(userId)) return;
    if (!SR2_CHARACTER_LIKE_TYPES.includes(actor.type)) return;

    const getProperty = globalThis.foundry?.utils?.getProperty;
    const setProperty = globalThis.foundry?.utils?.setProperty;
    if (typeof getProperty !== "function" || typeof setProperty !== "function") return;

    sr2SyncKarmaPoolFromEarned(actor, changes);

    const creationMode = sr2HasCreationLimits(actor.system);
    const newMetatype = getProperty(changes, "system.details.metatype");
    const oldMetatype = actor.system?.details?.metatype || "human";
    const effectiveMetatype = newMetatype || oldMetatype;

    const bounds = sr2GetRacialAttributeBounds(effectiveMetatype);
    const traitData = sr2GetRacialTraits(effectiveMetatype);

    const attrKeys = ["body", "quickness", "strength", "charisma", "intelligence", "willpower"];

    if (creationMode) {
      for (const key of attrKeys) {
        const b = bounds[key];
        if (!b) continue;
        const currentMin = actor.system?.attributes?.[key]?.min;
        const currentMax = actor.system?.attributes?.[key]?.max;
        if (currentMin !== b.min) setProperty(changes, `system.attributes.${key}.min`, b.min);
        if (currentMax !== b.max) setProperty(changes, `system.attributes.${key}.max`, b.max);
      }
    }

    if (newMetatype && newMetatype !== oldMetatype) {
      setProperty(changes, "system.details.traits", traitData);

      if (!creationMode) return;

      const oldMods = sr2GetRacialModifiers(oldMetatype);
      const newMods = sr2GetRacialModifiers(newMetatype);

      for (const key of attrKeys) {
        const path = `system.attributes.${key}.value`;
        const explicit = getProperty(changes, path);
        if (explicit !== undefined) {
          const clamped = Math.max(bounds[key].min, Math.min(bounds[key].max, Number(explicit)));
          setProperty(changes, path, clamped);
          continue;
        }

        const currentFinal = Number(actor.system?.attributes?.[key]?.value);
        const currentValue = Number.isFinite(currentFinal) ? currentFinal : bounds[key].min;
        const baseValue = currentValue - (Number(oldMods[key]) || 0);
        const nextFinalRaw = baseValue + (Number(newMods[key]) || 0);
        const nextFinal = Math.max(bounds[key].min, Math.min(bounds[key].max, nextFinalRaw));
        setProperty(changes, path, nextFinal);
      }
      return;
    }

    const existingTraits = actor.system?.details?.traits;
    if (!existingTraits || typeof existingTraits !== "object") {
      setProperty(changes, "system.details.traits", traitData);
    }

    if (!creationMode) return;

    for (const key of attrKeys) {
      const path = `system.attributes.${key}.value`;
      const updated = getProperty(changes, path);
      if (updated === undefined) continue;
      const clamped = Math.max(bounds[key].min, Math.min(bounds[key].max, Number(updated)));
      setProperty(changes, path, clamped);
    }
  });

  Hooks.on("preCreateActor", function (actor, data, options, userId) {
    if (!sr2IsSameUser(userId)) return;

    const actorType = data?.type ?? actor.type;
    if (!SR2_CHARACTER_LIKE_TYPES.includes(actorType)) return;

    const getProperty = globalThis.foundry?.utils?.getProperty;
    const setProperty = globalThis.foundry?.utils?.setProperty;
    if (typeof getProperty !== "function" || typeof setProperty !== "function") return;

    const metatype = getProperty(data, "system.details.metatype") || "human";
    const bounds = sr2GetRacialAttributeBounds(metatype);
    const traitData = sr2GetRacialTraits(metatype);

    const attrKeys = ["body", "quickness", "strength", "charisma", "intelligence", "willpower"];

    setProperty(data, "system.details.traits", traitData);
    for (const key of attrKeys) {
      const b = bounds[key];
      if (!b) continue;
      setProperty(data, `system.attributes.${key}.min`, b.min);
      setProperty(data, `system.attributes.${key}.max`, b.max);
    }

    const archetypeKey = getProperty(data, "system.details.archetype");
    if (actorType === "follower" && archetypeKey) return;

    const looksUnallocated = attrKeys.every((key) => {
      const raw = getProperty(data, `system.attributes.${key}.value`);
      const value = Number(raw);
      return !Number.isFinite(value) || value === 0 || value === 1;
    });

    if (!looksUnallocated) return;

    for (const key of attrKeys) {
      const b = bounds[key];
      if (!b) continue;
      setProperty(data, `system.attributes.${key}.value`, b.min);
    }
  });

  Hooks.on("preUpdateActor", function (actor, changes, options, userId) {
    if (!sr2IsSameUser(userId)) return;
    if (!SR2_CHARACTER_LIKE_TYPES.includes(actor.type)) return;

    const getProperty = globalThis.foundry?.utils?.getProperty;
    const setProperty = globalThis.foundry?.utils?.setProperty;
    if (typeof getProperty !== "function" || typeof setProperty !== "function") return;

    const awakened = getProperty(changes, "system.magic.awakened");
    const physicalAdept = getProperty(changes, "system.magic.physicalAdept");

    if (physicalAdept === true && awakened !== true) {
      setProperty(changes, "system.magic.awakened", true);
    }

    if (awakened === false && physicalAdept !== false) {
      setProperty(changes, "system.magic.physicalAdept", false);
    }
  });

  Hooks.on("updateActor", async function (actor, changes, options, userId) {
    if (options?.sr2SyncingLanguages) return;
    if (!sr2IsSameUser(userId)) return;
    if (!SR2_CHARACTER_LIKE_TYPES.includes(actor.type)) return;
    if (typeof syncFreeLanguageSkills !== "function") return;

    const getProperty = globalThis.foundry?.utils?.getProperty;
    if (typeof getProperty !== "function") return;

    const relevant =
      getProperty(changes, "system.attributes.intelligence.value") !== undefined ||
      getProperty(changes, "system.resources.lifestyle") !== undefined ||
      getProperty(changes, "system.resources.lifestyles") !== undefined ||
      getProperty(changes, "system.details.nativeLanguage") !== undefined ||
      getProperty(changes, "system.details.dialectLanguage") !== undefined;

    if (!relevant) return;
    await syncFreeLanguageSkills(actor);
  });
}
