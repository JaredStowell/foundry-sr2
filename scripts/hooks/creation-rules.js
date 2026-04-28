import {
  sr2ComputeContactLevelSummary,
  sr2ComputeForcePointsSpent,
  sr2HasCreationLimits,
  sr2InferFocusBondCostForGearItem,
} from "../sr2-rules.js";

const SR2_CREATION_RULE_HOOKS_KEY = "__sr2CreationRuleHooksInstalled";
const SR2_CHARACTER_TYPES = ["character", "contact", "follower"];

function sr2IsSameUser(userId) {
  if (typeof userId !== "string") return true;
  const currentUserId = globalThis.game?.user?.id;
  if (!currentUserId) return true;
  return userId === currentUserId;
}

function sr2IsCreationMode(actor) {
  return sr2HasCreationLimits(actor?.system);
}

function sr2ClampCreationSpellForce(force) {
  const num = Number(force);
  if (!Number.isFinite(num)) return 1;
  return Math.max(1, Math.min(6, Math.floor(num)));
}

function sr2GetCreationItemForcePointCost({ type, name, system }) {
  if (type === "spell") return Math.max(0, Number(system?.force) || 0);
  if (type !== "gear") return 0;

  const quantity = Math.max(1, Number(system?.quantity) || 1);

  const explicitBondCost = Number(system?.bondCost) || 0;
  const perItemCost =
    explicitBondCost > 0
      ? explicitBondCost
      : sr2InferFocusBondCostForGearItem({
          category: system?.category,
          name,
          price: system?.price ?? system?.cost ?? 0,
        });

  return perItemCost > 0 ? perItemCost * quantity : 0;
}

export function registerCreationRuleHooks({
  areContactLevelsEnabled,
  areBuddiesDisabled,
  getContactLevelsSummaryForLeader,
} = {}) {
  if (globalThis[SR2_CREATION_RULE_HOOKS_KEY]) return;
  globalThis[SR2_CREATION_RULE_HOOKS_KEY] = true;

  const contactLevelsEnabled =
    typeof areContactLevelsEnabled === "function" ? areContactLevelsEnabled : () => false;
  const buddiesDisabled =
    typeof areBuddiesDisabled === "function" ? areBuddiesDisabled : () => false;
  const contactSummaryForLeader =
    typeof getContactLevelsSummaryForLeader === "function"
      ? getContactLevelsSummaryForLeader
      : () => null;

  Hooks.on("preCreateActor", function (actor, data, options, userId) {
    if (!sr2IsSameUser(userId)) return;
    if (!contactLevelsEnabled()) return;

    const type = data?.type ?? actor.type;
    if (type !== "contact") return;

    const leaderId = data?.system?.details?.leaderId;
    if (!leaderId) return;

    const leader = globalThis.game?.actors?.get(leaderId);
    if (!leader || leader.type !== "character") return;
    if (!sr2IsCreationMode(leader)) return;

    const charisma = Number(leader.system?.attributes?.charisma?.value) || 0;
    const linkedContacts =
      globalThis.game?.actors?.filter(
        (a) => a.type === "contact" && a.system?.details?.leaderId === leaderId,
      ) ?? [];
    const contacts = linkedContacts.map((a) => ({
      id: a.id,
      sort: Number(a.sort) || 0,
      contactLevel: a.system?.details?.contactLevel,
    }));
    contacts.push({
      id: "__sr2PendingContact",
      sort: Number.MAX_SAFE_INTEGER,
      contactLevel: data?.system?.details?.contactLevel,
    });

    const summary = sr2ComputeContactLevelSummary(contacts, charisma);
    if (summary.over.extraContacts) {
      ui.notifications.error(
        "Too many contacts (max extra contacts is 3× Charisma, plus two free).",
      );
      return false;
    }
    if (summary.over.extraLevel2) {
      ui.notifications.error(
        "Too many Level 2+ contacts (max extra Level 2 upgrades is 2× Charisma).",
      );
      return false;
    }
    if (summary.over.extraLevel3) {
      ui.notifications.error(
        "Too many Level 3 contacts (max extra Level 3 upgrades is 1× Charisma).",
      );
      return false;
    }
  });

  Hooks.on("preUpdateActor", function (actor, changes, options, userId) {
    if (!sr2IsSameUser(userId)) return;

    const getProperty = globalThis.foundry?.utils?.getProperty;
    const setProperty = globalThis.foundry?.utils?.setProperty;
    if (typeof getProperty !== "function" || typeof setProperty !== "function") return;

    if (actor.type === "character" && buddiesDisabled()) {
      const rawBuddy = getProperty(changes, "system.creation.extras.buddy");
      if (rawBuddy !== undefined && (Number(rawBuddy) || 0) > 0) {
        setProperty(changes, "system.creation.extras.buddy", 0);
        ui.notifications.warn("Buddies are disabled for this world.");
      }
    }

    if (!contactLevelsEnabled()) return;
    if (actor.type !== "contact") return;

    const rawContactLevel = getProperty(changes, "system.details.contactLevel");
    const nextLeaderId = getProperty(changes, "system.details.leaderId");
    const affectsContactLimitsOrCost = rawContactLevel !== undefined || nextLeaderId !== undefined;
    if (!affectsContactLimitsOrCost) return;

    if (rawContactLevel !== undefined) {
      const clamped = Math.max(1, Math.min(3, parseInt(rawContactLevel, 10) || 1));
      if (clamped !== Number(rawContactLevel))
        setProperty(changes, "system.details.contactLevel", clamped);
    }

    const leaderId = nextLeaderId !== undefined ? nextLeaderId : actor.system?.details?.leaderId;
    if (!leaderId) return;

    const leader = globalThis.game?.actors?.get(leaderId);
    if (!leader || leader.type !== "character") return;
    if (!sr2IsCreationMode(leader)) return;

    const previousLeaderId = actor.system?.details?.leaderId || "";
    const isLeaderTransfer = typeof nextLeaderId === "string" && nextLeaderId !== previousLeaderId;
    const nextContactLevel =
      rawContactLevel !== undefined
        ? (getProperty(changes, "system.details.contactLevel") ?? rawContactLevel)
        : actor.system?.details?.contactLevel;

    const summary = contactSummaryForLeader(leader, {
      id: actor.id,
      sort: isLeaderTransfer
        ? Number.MAX_SAFE_INTEGER
        : Number(actor.sort) || Number.MAX_SAFE_INTEGER,
      contactLevel: nextContactLevel,
    });
    if (!summary) return;

    if (summary.over.extraContacts) {
      ui.notifications.error(
        "Too many contacts (max extra contacts is 3× Charisma, plus two free).",
      );
      return false;
    }
    if (summary.over.extraLevel2) {
      ui.notifications.error(
        "Too many Level 2+ contacts (max extra Level 2 upgrades is 2× Charisma).",
      );
      return false;
    }
    if (summary.over.extraLevel3) {
      ui.notifications.error(
        "Too many Level 3 contacts (max extra Level 3 upgrades is 1× Charisma).",
      );
      return false;
    }
  });

  Hooks.on("preCreateItem", function (item, data, options, userId) {
    if (!sr2IsSameUser(userId)) return;
    if (options?.sr2SkipBudget) return;

    const actor = item?.parent;
    if (!actor || !SR2_CHARACTER_TYPES.includes(actor.type)) return;
    if (!sr2IsCreationMode(actor)) return;

    const type = data?.type ?? item.type;
    if (type !== "spell") return;

    const rawForce = data?.system?.force;
    const nextForce = rawForce === undefined ? 1 : sr2ClampCreationSpellForce(rawForce);
    if (rawForce !== undefined && nextForce !== Number(rawForce)) {
      ui.notifications.error("In creation mode, spell Force must be between 1 and 6.");
      return false;
    }
  });

  Hooks.on("preUpdateItem", function (item, changes, options, userId) {
    if (!sr2IsSameUser(userId)) return;
    if (options?.sr2SkipBudget) return;

    const actor = item?.parent;
    if (!actor || !SR2_CHARACTER_TYPES.includes(actor.type)) return;
    if (!sr2IsCreationMode(actor)) return;
    if (item.type !== "spell") return;

    const getProperty = globalThis.foundry?.utils?.getProperty;
    const setProperty = globalThis.foundry?.utils?.setProperty;
    if (typeof getProperty !== "function" || typeof setProperty !== "function") return;

    const rawForce = getProperty(changes, "system.force");
    if (rawForce === undefined) return;

    const nextForce = sr2ClampCreationSpellForce(rawForce);
    if (nextForce !== Number(rawForce)) {
      ui.notifications.warn("In creation mode, spell Force must be between 1 and 6.");
      setProperty(changes, "system.force", nextForce);
    }
  });

  Hooks.on("preCreateItem", function (item, data, options, userId) {
    if (!sr2IsSameUser(userId)) return;
    if (options?.sr2SkipBudget) return;

    const actor = item?.parent;
    if (!actor || !SR2_CHARACTER_TYPES.includes(actor.type)) return;
    if (!sr2IsCreationMode(actor)) return;

    const type = data?.type ?? item.type;
    const system = data?.system || {};
    const name = data?.name ?? item.name;
    const cost = sr2GetCreationItemForcePointCost({ type, name, system });
    if (cost <= 0) return;

    const totalForcePoints = Number(actor.system?.creation?.forcePoints) || 0;
    if (totalForcePoints <= 0) {
      ui.notifications.error(
        "This character has no Force Points available for spells/foci in creation mode.",
      );
      return false;
    }

    const spent = sr2ComputeForcePointsSpent(actor.items);
    if (spent + cost > totalForcePoints) {
      ui.notifications.error("Not enough Force Points remaining. Reduce other spells/foci first.");
      return false;
    }
  });

  Hooks.on("preUpdateItem", function (item, changes, options, userId) {
    if (!sr2IsSameUser(userId)) return;
    if (options?.sr2SkipBudget) return;

    const actor = item?.parent;
    if (!actor || !SR2_CHARACTER_TYPES.includes(actor.type)) return;
    if (!sr2IsCreationMode(actor)) return;

    const getProperty = globalThis.foundry?.utils?.getProperty;
    if (typeof getProperty !== "function") return;

    const totalForcePoints = Number(actor.system?.creation?.forcePoints) || 0;

    let oldCost = 0;
    let nextCost = 0;

    if (item.type === "spell") {
      const raw = getProperty(changes, "system.force");
      if (raw === undefined) return;
      oldCost = Math.max(0, Number(item.system?.force) || 0);
      nextCost = Math.max(0, Number(raw) || 0);
    } else if (item.type === "gear") {
      const rawBondCost = getProperty(changes, "system.bondCost");
      const rawQuantity = getProperty(changes, "system.quantity");
      const rawCategory = getProperty(changes, "system.category");
      const rawPrice = getProperty(changes, "system.price");
      const rawCost = getProperty(changes, "system.cost");
      const rawName = getProperty(changes, "name");

      if (
        rawBondCost === undefined &&
        rawQuantity === undefined &&
        rawCategory === undefined &&
        rawPrice === undefined &&
        rawCost === undefined &&
        rawName === undefined
      )
        return;

      oldCost = sr2GetCreationItemForcePointCost({
        type: "gear",
        name: item.name,
        system: item.system,
      });
      nextCost = sr2GetCreationItemForcePointCost({
        type: "gear",
        name: rawName === undefined ? item.name : rawName,
        system: {
          bondCost: rawBondCost === undefined ? item.system?.bondCost : rawBondCost,
          quantity: rawQuantity === undefined ? item.system?.quantity : rawQuantity,
          category: rawCategory === undefined ? item.system?.category : rawCategory,
          price: rawPrice === undefined ? item.system?.price : rawPrice,
          cost: rawCost === undefined ? item.system?.cost : rawCost,
        },
      });
    } else {
      return;
    }

    if (nextCost <= oldCost) return;

    if (totalForcePoints <= 0) {
      ui.notifications.error(
        "This character has no Force Points available for spells/foci in creation mode.",
      );
      return false;
    }

    const spent = sr2ComputeForcePointsSpent(actor.items);
    const delta = nextCost - oldCost;
    if (spent + delta > totalForcePoints) {
      ui.notifications.error("Not enough Force Points remaining. Reduce other spells/foci first.");
      return false;
    }
  });

  Hooks.on("preCreateItem", function (item, data, options, userId) {
    if (!sr2IsSameUser(userId)) return;
    if (options?.sr2SkipBudget) return;

    const actor = item?.parent;
    if (!actor || !SR2_CHARACTER_TYPES.includes(actor.type)) return;
    if (!sr2IsCreationMode(actor)) return;

    const type = data?.type ?? item.type;
    if (type !== "skill") return;

    const baseSkill = data?.system?.baseSkill;
    if (baseSkill !== "Sorcery" && baseSkill !== "Conjuring") return;

    const magicRating = Number(actor.system?.attributes?.magic?.value) || 0;
    if (magicRating > 0) return;

    ui.notifications.error("Sorcery and Conjuring require a Magic rating.");
    return false;
  });

  Hooks.on("preUpdateItem", function (item, changes, options, userId) {
    if (!sr2IsSameUser(userId)) return;
    if (options?.sr2SkipBudget) return;

    const actor = item?.parent;
    if (!actor || !SR2_CHARACTER_TYPES.includes(actor.type)) return;
    if (!sr2IsCreationMode(actor)) return;
    if (item.type !== "skill") return;

    const getProperty = globalThis.foundry?.utils?.getProperty;
    if (typeof getProperty !== "function") return;

    const nextBaseSkill = getProperty(changes, "system.baseSkill");
    if (nextBaseSkill !== "Sorcery" && nextBaseSkill !== "Conjuring") return;

    const magicRating = Number(actor.system?.attributes?.magic?.value) || 0;
    if (magicRating > 0) return;

    ui.notifications.error("Sorcery and Conjuring require a Magic rating.");
    return false;
  });
}
