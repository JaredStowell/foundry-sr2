import {
  sr2ComputeContactLevelSummary,
  sr2ComputeCreationNuyenBudgetBreakdown,
  sr2ComputeForcePointsSpent,
  sr2ComputeItemNuyenSpent,
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
  const completed = actor?.getFlag?.("shadowrun2e", "creationCompleted");
  if (completed === true) return false;

  const flagged = actor?.getFlag?.("shadowrun2e", "creationMode");
  if (typeof flagged === "boolean") return flagged;

  const hasCreationPoints =
    (Number(actor?.system?.creation?.attributePoints) || 0) > 0 ||
    (Number(actor?.system?.creation?.skillPoints) || 0) > 0 ||
    (Number(actor?.system?.creation?.forcePoints) || 0) > 0;
  return hasCreationPoints;
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

function sr2ToBool(value) {
  if (value === undefined) return undefined;
  if (value === null) return false;
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value !== 0;
  if (typeof value === "string") {
    const v = value.trim().toLowerCase();
    if (v === "true") return true;
    if (v === "false") return false;
    if (v === "1") return true;
    if (v === "0") return false;
  }
  return Boolean(value);
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

  Hooks.on("preUpdateActor", function (actor, changes, options, userId) {
    if (!sr2IsSameUser(userId)) return;
    if (!SR2_CHARACTER_TYPES.includes(actor.type)) return;

    const getProperty = globalThis.foundry?.utils?.getProperty;
    const setProperty = globalThis.foundry?.utils?.setProperty;
    if (typeof getProperty !== "function" || typeof setProperty !== "function") return;

    const currentCompleted =
      sr2ToBool(actor.getFlag?.("shadowrun2e", "creationCompleted")) === true;
    const nextCompletedRaw = getProperty(changes, "flags.shadowrun2e.creationCompleted");
    const nextCompleted = sr2ToBool(nextCompletedRaw);
    const unsetCompleted =
      getProperty(changes, "flags.shadowrun2e.-=creationCompleted") !== undefined;

    const shouldLock = currentCompleted || nextCompleted === true;
    if (!shouldLock) return;

    if (unsetCompleted) {
      try {
        delete changes.flags?.shadowrun2e?.["-=creationCompleted"];
      } catch (err) {
        // Ignore.
      }
      setProperty(changes, "flags.shadowrun2e.creationCompleted", true);
      if (currentCompleted)
        ui.notifications.warn("Character Generation is already finalized and cannot be reopened.");
    }
    if (nextCompleted === false) {
      setProperty(changes, "flags.shadowrun2e.creationCompleted", true);
      if (currentCompleted)
        ui.notifications.warn("Character Generation is already finalized and cannot be reopened.");
    }

    const unsetCreationMode =
      getProperty(changes, "flags.shadowrun2e.-=creationMode") !== undefined;
    if (unsetCreationMode) {
      try {
        delete changes.flags?.shadowrun2e?.["-=creationMode"];
      } catch (err) {
        // Ignore.
      }
      setProperty(changes, "flags.shadowrun2e.creationMode", false);
    }

    const nextCreationModeRaw = getProperty(changes, "flags.shadowrun2e.creationMode");
    const nextCreationMode = sr2ToBool(nextCreationModeRaw);
    if (nextCreationMode === true) {
      setProperty(changes, "flags.shadowrun2e.creationMode", false);
      if (currentCompleted)
        ui.notifications.warn("Character Generation is locked off for this actor.");
    } else if (nextCompleted === true && nextCreationModeRaw === undefined) {
      setProperty(changes, "flags.shadowrun2e.creationMode", false);
    }
  });

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
    if (leader.system?.creation?.resourcesFinalized) return;

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

    const budget = Number(leader.system?.creation?.startingNuyen) || 0;
    if (budget <= 0) return;

    const breakdown = sr2ComputeCreationNuyenBudgetBreakdown(leader.system, leader.items, {
      disableBuddies: buddiesDisabled(),
      contactLevelsSummary: summary,
    });
    if ((breakdown.remainingNuyen || 0) < 0) {
      ui.notifications.error("Not enough creation Nuyen remaining for that contact.");
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
    if (leader.system?.creation?.resourcesFinalized) return;

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

    const budget = Number(leader.system?.creation?.startingNuyen) || 0;
    if (budget <= 0) return;

    const breakdown = sr2ComputeCreationNuyenBudgetBreakdown(leader.system, leader.items, {
      disableBuddies: buddiesDisabled(),
      contactLevelsSummary: summary,
    });
    if ((breakdown.remainingNuyen || 0) < 0) {
      ui.notifications.error("Not enough creation Nuyen remaining for that contact change.");
      return false;
    }
  });

  Hooks.on("preCreateItem", function (item, data, options, userId) {
    if (!sr2IsSameUser(userId)) return;
    if (options?.sr2SkipBudget) return;

    const actor = item?.parent;
    if (!actor || !SR2_CHARACTER_TYPES.includes(actor.type)) return;
    if (!sr2IsCreationMode(actor)) return;
    if (actor.system?.creation?.resourcesFinalized) return;

    const budget = Number(actor.system?.creation?.startingNuyen) || 0;
    if (budget <= 0) return;

    const type = data?.type ?? item.type;
    if (["skill", "spell", "adeptpower", "totem"].includes(type)) return;

    const system = data?.system || {};
    const previewItem = {
      type,
      system: {
        price: system.price ?? system.cost ?? 0,
        quantity: system.quantity ?? 1,
      },
    };

    const breakdownOptions = {
      disableBuddies: buddiesDisabled(),
    };
    const contactLevelsSummary = contactSummaryForLeader(actor);
    if (contactLevelsSummary) breakdownOptions.contactLevelsSummary = contactLevelsSummary;

    const breakdown = sr2ComputeCreationNuyenBudgetBreakdown(
      actor.system,
      actor.items,
      breakdownOptions,
    );
    const newItemCost = sr2ComputeItemNuyenSpent([previewItem]);
    if ((breakdown.remainingNuyen || 0) - newItemCost < 0) {
      ui.notifications.error("Not enough creation Nuyen remaining for that item.");
      return false;
    }
  });

  Hooks.on("preUpdateItem", function (item, changes, options, userId) {
    if (!sr2IsSameUser(userId)) return;
    if (options?.sr2SkipBudget) return;

    const actor = item?.parent;
    if (!actor || !SR2_CHARACTER_TYPES.includes(actor.type)) return;
    if (!sr2IsCreationMode(actor)) return;
    if (actor.system?.creation?.resourcesFinalized) return;

    const budget = Number(actor.system?.creation?.startingNuyen) || 0;
    if (budget <= 0) return;

    const type = item.type;
    if (["skill", "spell", "adeptpower", "totem"].includes(type)) return;

    const getProperty = globalThis.foundry?.utils?.getProperty;
    if (typeof getProperty !== "function") return;

    const oldPrice = Number(item.system?.price ?? item.system?.cost) || 0;
    const oldQty = Math.max(1, Number(item.system?.quantity) || 1);
    const oldCost = Math.max(0, oldPrice) * oldQty;

    const nextPriceRaw = getProperty(changes, "system.price");
    const nextCostRaw = getProperty(changes, "system.cost");
    const nextQtyRaw = getProperty(changes, "system.quantity");

    const nextPrice = Number(nextPriceRaw ?? nextCostRaw ?? oldPrice) || 0;
    const nextQty = Math.max(1, Number(nextQtyRaw ?? oldQty) || 1);
    const nextCost = Math.max(0, nextPrice) * nextQty;

    const delta = nextCost - oldCost;
    if (delta <= 0) return;

    const breakdownOptions = {
      disableBuddies: buddiesDisabled(),
    };
    const contactLevelsSummary = contactSummaryForLeader(actor);
    if (contactLevelsSummary) breakdownOptions.contactLevelsSummary = contactLevelsSummary;

    const breakdown = sr2ComputeCreationNuyenBudgetBreakdown(
      actor.system,
      actor.items,
      breakdownOptions,
    );
    if ((breakdown.remainingNuyen || 0) - delta < 0) {
      ui.notifications.error("Not enough creation Nuyen remaining for that change.");
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
