export const SR2_PRIORITY_TABLE = {
    attributes: { A: 30, B: 24, C: 20, D: 17, E: 15 },
    skills: { A: 40, B: 30, C: 24, D: 20, E: 17 },
    resources: {
        A: { nuyen: 1000000, forcePoints: 50 },
        B: { nuyen: 400000, forcePoints: 35 },
        C: { nuyen: 90000, forcePoints: 25 },
        D: { nuyen: 5000, forcePoints: 15 },
        E: { nuyen: 500, forcePoints: 5 }
    }
};

export const SR2_RACIAL_MODIFIERS = {
    human: { body: 0, quickness: 0, strength: 0, charisma: 0, intelligence: 0, willpower: 0 },
    dwarf: { body: 1, quickness: -1, strength: 2, charisma: 0, intelligence: 0, willpower: 1 },
    elf: { body: 0, quickness: 1, strength: 0, charisma: 2, intelligence: 0, willpower: 0 },
    ork: { body: 3, quickness: 0, strength: 2, charisma: -1, intelligence: -1, willpower: 0 },
    troll: { body: 5, quickness: -1, strength: 4, charisma: -2, intelligence: -2, willpower: -1 }
};

export const SR2_RACIAL_TRAITS = {
    human: { lowLightVision: false, thermographicVision: false, reach: 0, dermalArmor: 0, diseaseResistance: 0 },
    dwarf: { lowLightVision: false, thermographicVision: true, reach: 0, dermalArmor: 0, diseaseResistance: 2 },
    elf: { lowLightVision: true, thermographicVision: false, reach: 0, dermalArmor: 0, diseaseResistance: 0 },
    ork: { lowLightVision: true, thermographicVision: false, reach: 0, dermalArmor: 0, diseaseResistance: 0 },
    troll: { lowLightVision: false, thermographicVision: true, reach: 1, dermalArmor: 1, diseaseResistance: 0 }
};

export const SR2_LIFESTYLE_COSTS = {
    street: 0,
    squatter: 100,
    low: 1000,
    middle: 5000,
    high: 10000,
    luxury: 100000
};

export const SR2_EXTRAS_COSTS = {
    contact: 5000,
    buddy: 10000,
    gang: 50000,
    followers: 200000
};

export const SR2_CONTACT_LEVEL_RULES = {
    // Two free level 1 contacts.
    freeContacts: 2,
    // Purchase limits (excluding the two free contacts).
    maxExtraContactsMultiplier: 3, // max extra level 1 contacts
    maxExtraLevel2Multiplier: 2, // max extra upgrades to level 2
    maxExtraLevel3Multiplier: 1, // max extra upgrades to level 3
    // Costs.
    costExtraContact: 5000,
    costUpgradeToLevel2: 3000,
    costUpgradeToLevel3: 7000,
    // Allowed contact level range.
    minLevel: 1,
    maxLevel: 3
};

export function sr2NormalizeContactLevel(value) {
    const num = parseInt(value, 10);
    if (!Number.isFinite(num)) return SR2_CONTACT_LEVEL_RULES.minLevel;
    return Math.max(SR2_CONTACT_LEVEL_RULES.minLevel, Math.min(SR2_CONTACT_LEVEL_RULES.maxLevel, num));
}

export function sr2ComputeContactLevelSummary(contacts, charisma, options = {}) {
    const freeContacts = Math.max(
        0,
        parseInt(options?.freeContacts ?? SR2_CONTACT_LEVEL_RULES.freeContacts, 10) || 0
    );
    const cha = Math.max(0, parseInt(charisma, 10) || 0);

    const normalized = (contacts || [])
        .map(c => ({
            id: String(c?.id || ""),
            sort: Number(c?.sort) || 0,
            contactLevel: sr2NormalizeContactLevel(c?.contactLevel)
        }))
        .sort((a, b) => (a.sort - b.sort) || a.id.localeCompare(b.id));

    const totalContacts = normalized.length;
    const freeSlots = Math.max(0, Math.min(freeContacts, totalContacts));
    const extraContacts = Math.max(0, totalContacts - freeSlots);

    const maxExtraContacts = SR2_CONTACT_LEVEL_RULES.maxExtraContactsMultiplier * cha;
    const maxExtraLevel2 = SR2_CONTACT_LEVEL_RULES.maxExtraLevel2Multiplier * cha;
    const maxExtraLevel3 = SR2_CONTACT_LEVEL_RULES.maxExtraLevel3Multiplier * cha;

    const maxTotalContacts = freeContacts + maxExtraContacts;

    const totalLevel2 = normalized.filter(c => c.contactLevel >= 2).length;
    const totalLevel3 = normalized.filter(c => c.contactLevel >= 3).length;

    // The "two free contacts" are an allowance, not a specific set of actors.
    // For limit checks, we treat up to `freeSlots` contacts as exempt and pick the highest-level contacts first
    // (to minimize the number of "extra" Level 2/3 upgrades counted against Charisma-based maxima).
    const exemptedLevel3 = Math.min(freeSlots, totalLevel3);
    const remainingSlots = freeSlots - exemptedLevel3;
    const exemptedLevel2 = exemptedLevel3 + Math.min(remainingSlots, Math.max(0, totalLevel2 - exemptedLevel3));

    const extraLevel2 = Math.max(0, totalLevel2 - exemptedLevel2);
    const extraLevel3 = Math.max(0, totalLevel3 - exemptedLevel3);

    const contactsBaseCost = extraContacts * SR2_CONTACT_LEVEL_RULES.costExtraContact;
    const contactsLevel2Cost = totalLevel2 * SR2_CONTACT_LEVEL_RULES.costUpgradeToLevel2;
    const contactsLevel3Cost = totalLevel3 * SR2_CONTACT_LEVEL_RULES.costUpgradeToLevel3;
    const contactsTotalCost = contactsBaseCost + contactsLevel2Cost + contactsLevel3Cost;

    return {
        freeContacts,
        charisma: cha,
        counts: {
            totalContacts,
            maxTotalContacts,
            extraContacts,
            maxExtraContacts,
            extraLevel2,
            maxExtraLevel2,
            extraLevel3,
            maxExtraLevel3,
            totalLevel2,
            totalLevel3
        },
        costs: {
            contactsBaseCost,
            contactsLevel2Cost,
            contactsLevel3Cost,
            contactsTotalCost
        },
        over: {
            extraContacts: extraContacts > maxExtraContacts,
            extraLevel2: extraLevel2 > maxExtraLevel2,
            extraLevel3: extraLevel3 > maxExtraLevel3
        }
    };
}

export function sr2IsPriorityLetter(value) {
    return ["A", "B", "C", "D", "E"].includes(value);
}

export function sr2ComputeItemNuyenSpent(items) {
    let spent = 0;
    for (const item of (items || [])) {
        if (!item) continue;
        if (["skill", "spell", "adeptpower", "totem"].includes(item.type)) continue;

        const price = Number(item.system?.price) || 0;
        const quantity = Math.max(1, Number(item.system?.quantity) || 1);
        spent += Math.max(0, price) * quantity;
    }
    return spent;
}

export function sr2ComputeCreationExtrasCost(extras, options = {}) {
    const contactLevelsSummary = options?.contactLevelsSummary;

    const contacts = Math.max(0, parseInt(extras?.contacts, 10) || 0);
    const buddy = options?.disableBuddies
        ? 0
        : Math.min(1, Math.max(0, parseInt(extras?.buddy, 10) || 0));
    const gang = Math.min(1, Math.max(0, parseInt(extras?.gang, 10) || 0));
    const followers = Math.min(1, Math.max(0, parseInt(extras?.followers, 10) || 0));

    const contactsCost = (contactLevelsSummary && typeof contactLevelsSummary?.costs?.contactsTotalCost === "number")
        ? Math.max(0, Number(contactLevelsSummary.costs.contactsTotalCost) || 0)
        // Default SR2 behavior: Characters start with two free contacts during creation (SR2 core).
        : Math.max(0, contacts - 2) * (SR2_EXTRAS_COSTS.contact || 0);

    return (
        contactsCost +
        buddy * (SR2_EXTRAS_COSTS.buddy || 0) +
        gang * (SR2_EXTRAS_COSTS.gang || 0) +
        followers * (SR2_EXTRAS_COSTS.followers || 0)
    );
}

export function sr2ComputeCreationLifestyleCost(lifestyleKey, months) {
    const costPerMonth = SR2_LIFESTYLE_COSTS[lifestyleKey] ?? 0;
    const monthCount = Math.max(1, parseInt(months, 10) || 1);
    return {
        lifestyleKey,
        lifestyleMonths: monthCount,
        lifestyleCostPerMonth: costPerMonth,
        lifestyleCost: costPerMonth * monthCount
    };
}

export function sr2ComputeCreationNuyenBudgetBreakdown(system, items, options = {}) {
    const budgetNuyen = Number(system?.creation?.startingNuyen) || 0;
    const itemCost = sr2ComputeItemNuyenSpent(items);

    const rawLifestyles = system?.resources?.lifestyles;
    const lifestyles = Array.isArray(rawLifestyles) && rawLifestyles.length
        ? rawLifestyles
            .map(l => sr2ComputeCreationLifestyleCost(l?.type || "street", l?.months ?? 1))
        : [sr2ComputeCreationLifestyleCost(system?.resources?.lifestyle || "street", system?.creation?.lifestyleMonths ?? 1)];

    const lifestyleCost = lifestyles.reduce((sum, l) => sum + (Number(l?.lifestyleCost) || 0), 0);
    const primaryLifestyle = lifestyles[0] ?? sr2ComputeCreationLifestyleCost("street", 1);

    const extrasCost = sr2ComputeCreationExtrasCost(system?.creation?.extras, options);

    const totalCost = itemCost + lifestyleCost + extrasCost;
    return {
        budgetNuyen,
        itemCost,
        lifestyles,
        lifestyleKey: primaryLifestyle.lifestyleKey,
        lifestyleMonths: primaryLifestyle.lifestyleMonths,
        lifestyleCostPerMonth: primaryLifestyle.lifestyleCostPerMonth,
        lifestyleCost,
        extrasCost,
        totalCost,
        remainingNuyen: budgetNuyen - totalCost
    };
}

export function sr2Clamp(value, min, max) {
    const num = Number(value);
    if (!Number.isFinite(num)) return min;
    return Math.max(min, Math.min(max, num));
}

export function sr2GetRacialModifiers(metatype) {
    return SR2_RACIAL_MODIFIERS[metatype] ?? SR2_RACIAL_MODIFIERS.human;
}

export function sr2GetRacialTraits(metatype) {
    return SR2_RACIAL_TRAITS[metatype] ?? SR2_RACIAL_TRAITS.human;
}

export function sr2GetRacialAttributeBounds(metatype) {
    const mods = sr2GetRacialModifiers(metatype);
    const baseMin = 1;
    const baseMax = 6;

    const bounds = {};
    for (const [key, mod] of Object.entries(mods)) {
        const min = Math.max(0, baseMin + mod);
        const max = Math.max(min, baseMax + mod);
        bounds[key] = { min, max };
    }
    return bounds;
}

export function sr2ComputeAttributePointsSpent(attributes, metatype) {
    const mods = sr2GetRacialModifiers(metatype);
    const keys = ["body", "quickness", "strength", "charisma", "intelligence", "willpower"];
    let spent = 0;
    for (const key of keys) {
        const value = Number(attributes?.[key]?.value) || 0;
        const mod = Number(mods[key]) || 0;
        const baseline = Math.max(0, 1 + mod);
        spent += Math.max(0, value - baseline);
    }
    return spent;
}

export function sr2SkillInferAllocatedRating(skillSystem) {
    if (!skillSystem) return 0;
    const allocated = Number(skillSystem.allocatedRating);
    if (Number.isFinite(allocated)) return Math.max(0, allocated);

    const base = Number(skillSystem.baseRating) || 0;
    const conc = Number(skillSystem.concentrationRating) || 0;
    const spec = Number(skillSystem.specializationRating) || 0;
    const hasConcentration = Boolean(skillSystem.concentration);
    const hasSpecialization = Boolean(skillSystem.specialization);

    if (hasSpecialization) {
        if (spec > 0) return Math.max(0, spec - 2);
        if (conc > 0) return Math.max(0, conc);
        return Math.max(0, base + 2);
    }
    if (hasConcentration) {
        if (conc > 0) return Math.max(0, conc - 1);
        return Math.max(0, base + 1);
    }
    return Math.max(0, base);
}

export function sr2ComputeSkillRatingsFromAllocated(skillSystem) {
    const allocated = sr2SkillInferAllocatedRating(skillSystem);
    const baseSkill = skillSystem?.baseSkill || "";

    // Languages do not use Concentrations/Specializations in SR2 character creation.
    if (baseSkill === "Language") {
        return {
            allocatedRating: allocated,
            baseRating: allocated,
            concentrationRating: 0,
            specializationRating: 0,
            minAllocated: 1
        };
    }

    const hasConcentration = Boolean(skillSystem?.concentration);
    const hasSpecialization = Boolean(skillSystem?.specialization);

    if (hasSpecialization) {
        return {
            allocatedRating: allocated,
            baseRating: Math.max(0, allocated - 2),
            concentrationRating: allocated,
            specializationRating: allocated + 2,
            minAllocated: 3
        };
    }

    if (hasConcentration) {
        return {
            allocatedRating: allocated,
            baseRating: Math.max(0, allocated - 1),
            concentrationRating: allocated + 1,
            specializationRating: 0,
            minAllocated: 2
        };
    }

    return {
        allocatedRating: allocated,
        baseRating: allocated,
        concentrationRating: 0,
        specializationRating: 0,
        minAllocated: 1
    };
}

export function sr2ComputeSkillPointsSpent(skillItems) {
    return (skillItems || []).reduce((sum, skill) => {
        if (!skill?.system?.baseSkill) return sum;
        if (skill?.system?.isFree) return sum;
        return sum + sr2SkillInferAllocatedRating(skill.system);
    }, 0);
}

export function sr2ComputeForcePointsSpent(items) {
    let spent = 0;
    for (const item of (items || [])) {
        if (!item?.system) continue;

        if (item.type === "spell") {
            spent += Math.max(0, Number(item.system.force) || 0);
            continue;
        }

        if (item.type === "gear") {
            const quantity = Math.max(1, Number(item.system.quantity) || 1);
            const explicitBondCost = Math.max(0, Number(item.system.bondCost) || 0);
            const perItemCost = explicitBondCost > 0
                ? explicitBondCost
                : sr2InferFocusBondCostForGearItem({
                    category: item.system.category,
                    name: item.name,
                    price: item.system.price ?? item.system.cost ?? 0
                });

            if (perItemCost > 0) spent += perItemCost * quantity;
        }
    }
    return spent;
}

export function sr2ParseFocusName(name) {
    const itemName = String(name || "").trim();
    if (!itemName) return null;

    if (itemName === "Spell Lock") {
        return { kind: "spell lock", rating: 0, name: itemName };
    }

    const match = itemName.match(/^(Specific Spell Focus|Spell Type Focus|Spell Category Focus|Spirit Focus|Power Focus|Weapon Focus)\\s+(\\d+)$/i);
    if (!match) return null;

    let kind = String(match[1] || "").toLowerCase();
    if (kind === "spell category focus") kind = "spell type focus";
    const rating = parseInt(match[2], 10);
    if (!Number.isFinite(rating) || rating <= 0) return null;

    return { kind, rating, name: itemName };
}

export function sr2InferFocusBondCostForGearItem({ category, name, price }) {
    const normalizedCategory = String(category || "").trim();
    if (normalizedCategory && normalizedCategory !== "Magical Equipment") return 0;

    const focus = sr2ParseFocusName(name);
    if (!focus) return 0;
    if (focus.kind === "spell lock") return 1;

    if (focus.kind === "specific spell focus") return focus.rating;
    if (focus.kind === "spell type focus") return 3 * focus.rating;
    if (focus.kind === "spirit focus") return 2 * focus.rating;
    if (focus.kind === "power focus") return 5 * focus.rating;

    if (focus.kind === "weapon focus") {
        const numericPrice = Number(String(price ?? "").replace(/[^\d.]/g, ""));
        const smallPrice = focus.rating * 90000 + 200000;
        const largePrice = focus.rating * 90000 + 300000;

        if (numericPrice === largePrice) return 5 * focus.rating;
        if (numericPrice === smallPrice) return 4 * focus.rating;

        // Fallback: if we can't identify the exact table, treat a higher price as a large focus.
        if (Number.isFinite(numericPrice) && numericPrice > smallPrice) return 5 * focus.rating;
        return 4 * focus.rating;
    }

    return 0;
}

export function sr2FormatSignedModifier(value) {
    const num = Number(value) || 0;
    if (num === 0) return "0";
    return num > 0 ? `+${num}` : `${num}`;
}

export function sr2CountSpellLocksPurchased(items) {
    let total = 0;
    for (const item of (items || [])) {
        if (!item) continue;
        if (item.type !== "gear") continue;

        const name = String(item.name || "").trim().toLowerCase();
        if (name !== "spell lock") continue;

        const rawQuantity = Number(item.system?.quantity);
        const quantity = Number.isFinite(rawQuantity) ? Math.max(0, Math.floor(rawQuantity)) : 1;
        total += quantity;
    }
    return total;
}

export function sr2CountAssignedSpellLocks(items) {
    let total = 0;
    for (const item of (items || [])) {
        if (!item) continue;
        if (item.type !== "spell") continue;
        if (item.system?.spellLock?.assigned) total += 1;
    }
    return total;
}

export function sr2ComputeSpellLockCapacity(items) {
    const total = sr2CountSpellLocksPurchased(items);
    const assigned = sr2CountAssignedSpellLocks(items);
    return {
        total,
        assigned,
        remaining: total - assigned
    };
}

export function sr2InferSpellLockAugmentationModifiersFromSpellName(spellName) {
    const name = String(spellName || "").trim();
    if (!name) return {};

    const increaseReflexesMatch = name.match(/^Increase Reflexes\s*\+(\d+)\s*(?:initiative\s+)?(?:die|dice)$/i);
    if (increaseReflexesMatch) {
        const dice = parseInt(increaseReflexesMatch[1], 10);
        if (Number.isFinite(dice) && dice > 0) {
            return { INI: dice };
        }
    }

    return {};
}

export function sr2ComputeSpellLockAugmentationModifiers(items) {
    const modifiers = {
        BOD: 0,
        QCK: 0,
        STR: 0,
        CHA: 0,
        INT: 0,
        WIL: 0,
        RCT: 0,
        INI: 0,
        CPL: 0
    };

    for (const item of (items || [])) {
        if (!item?.system) continue;
        if (item.type !== "spell") continue;

        const spellLock = item.system.spellLock;
        if (!spellLock?.assigned || !spellLock?.enabled) continue;

        const inferred = sr2InferSpellLockAugmentationModifiersFromSpellName(item.name);
        for (const [key, value] of Object.entries(inferred)) {
            if (!Object.prototype.hasOwnProperty.call(modifiers, key)) continue;
            modifiers[key] += Number(value) || 0;
        }
    }

    return modifiers;
}
