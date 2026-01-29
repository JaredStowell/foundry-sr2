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

export function sr2ComputeCreationExtrasCost(extras) {
    const contacts = Math.max(0, parseInt(extras?.contacts, 10) || 0);
    const buddy = Math.max(0, parseInt(extras?.buddy, 10) || 0);
    const gang = Math.max(0, parseInt(extras?.gang, 10) || 0);
    const followers = Math.max(0, parseInt(extras?.followers, 10) || 0);

    // Characters start with two free contacts during creation (SR2 core).
    const paidContacts = Math.max(0, contacts - 2);

    return (
        paidContacts * (SR2_EXTRAS_COSTS.contact || 0) +
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

export function sr2ComputeCreationNuyenBudgetBreakdown(system, items) {
    const budgetNuyen = Number(system?.creation?.startingNuyen) || 0;
    const itemCost = sr2ComputeItemNuyenSpent(items);

    const rawLifestyles = system?.resources?.lifestyles;
    const lifestyles = Array.isArray(rawLifestyles) && rawLifestyles.length
        ? rawLifestyles
            .map(l => sr2ComputeCreationLifestyleCost(l?.type || "street", l?.months ?? 1))
        : [sr2ComputeCreationLifestyleCost(system?.resources?.lifestyle || "street", system?.creation?.lifestyleMonths ?? 1)];

    const lifestyleCost = lifestyles.reduce((sum, l) => sum + (Number(l?.lifestyleCost) || 0), 0);
    const primaryLifestyle = lifestyles[0] ?? sr2ComputeCreationLifestyleCost("street", 1);

    const extrasCost = sr2ComputeCreationExtrasCost(system?.creation?.extras);

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
            const bondCost = Number(item.system.bondCost) || 0;
            if (bondCost > 0) spent += bondCost;
        }
    }
    return spent;
}

export function sr2InferFocusBondCostForGearItem({ category, name, price }) {
    if (String(category || "").trim() !== "Magical Equipment") return 0;

    const itemName = String(name || "").trim();
    if (!itemName) return 0;

    if (itemName === "Spell Lock") return 1;

    const match = itemName.match(/^(Specific Spell Focus|Spell Type Focus|Spirit Focus|Power Focus|Weapon Focus)\\s+(\\d+)$/i);
    if (!match) return 0;

    const kind = String(match[1] || "").toLowerCase();
    const rating = parseInt(match[2], 10);
    if (!Number.isFinite(rating) || rating <= 0) return 0;

    if (kind === "specific spell focus") return rating;
    if (kind === "spell type focus") return 3 * rating;
    if (kind === "spirit focus") return 2 * rating;
    if (kind === "power focus") return 5 * rating;

    if (kind === "weapon focus") {
        const numericPrice = Number(String(price ?? "").replace(/[^\d.]/g, ""));
        const smallPrice = rating * 90000 + 200000;
        const largePrice = rating * 90000 + 300000;

        if (numericPrice === largePrice) return 5 * rating;
        if (numericPrice === smallPrice) return 4 * rating;

        // Fallback: if we can't identify the exact table, treat a higher price as a large focus.
        if (Number.isFinite(numericPrice) && numericPrice > smallPrice) return 5 * rating;
        return 4 * rating;
    }

    return 0;
}

export function sr2FormatSignedModifier(value) {
    const num = Number(value) || 0;
    if (num === 0) return "0";
    return num > 0 ? `+${num}` : `${num}`;
}
