import { SR2_PRIORITY_TABLE, sr2IsPriorityLetter } from "../sr2-rules.js";

const SR2_METAHUMAN_METATYPES = ["elf", "dwarf", "ork", "troll"];

export function sr2BuildCharacterPriorityUpdates(
    actor,
    {
        getAllowedMetatypesForPriority
    } = {}
) {
    const priorities = actor?.system?.priorities;
    if (!priorities) return null;

    const anyPrioritiesSelected = Object.values(priorities).some(sr2IsPriorityLetter);
    if (!anyPrioritiesSelected) return null;

    const updates = {};
    let computedAwakened = null;

    const racePriority = priorities.metatype;
    const currentMetatype = actor?.system?.details?.metatype || "human";
    const allowedMetatypes = typeof getAllowedMetatypesForPriority === "function"
        ? getAllowedMetatypesForPriority(racePriority)
        : null;

    if (Array.isArray(allowedMetatypes) && allowedMetatypes.length) {
        if (!allowedMetatypes.includes(currentMetatype)) {
            updates["system.details.metatype"] = allowedMetatypes[0] ?? "human";
        }
    }

    const effectiveMetatype = updates["system.details.metatype"] ?? currentMetatype;
    const isMetahuman = SR2_METAHUMAN_METATYPES.includes(effectiveMetatype);
    const usesShiftedMagicPriority = isMetahuman && racePriority === "A";

    const magicPriority = priorities.magic;
    if (sr2IsPriorityLetter(magicPriority)) {
        let awakened = false;
        let physicalAdept = false;

        if (usesShiftedMagicPriority) {
            if (magicPriority === "B") awakened = true;
            else if (magicPriority === "C") {
                awakened = true;
                physicalAdept = true;
            }
        } else {
            if (magicPriority === "A") awakened = true;
            else if (magicPriority === "B") {
                awakened = true;
                physicalAdept = true;
            }
        }

        updates["system.magic.awakened"] = awakened;
        updates["system.magic.physicalAdept"] = physicalAdept;
        updates["system.attributes.magic.value"] = awakened
            ? Math.max(Number(actor?.system?.attributes?.magic?.value) || 0, 6)
            : 0;
        computedAwakened = awakened;
    }

    const attributePriority = priorities.attributes;
    if (sr2IsPriorityLetter(attributePriority)) {
        updates["system.creation.attributePoints"] = SR2_PRIORITY_TABLE.attributes[attributePriority] ?? 0;
    }

    const skillsPriority = priorities.skills;
    if (sr2IsPriorityLetter(skillsPriority)) {
        updates["system.creation.skillPoints"] = SR2_PRIORITY_TABLE.skills[skillsPriority] ?? 0;
    }

    const resourcesPriority = priorities.resources;
    if (sr2IsPriorityLetter(resourcesPriority)) {
        const resources = SR2_PRIORITY_TABLE.resources[resourcesPriority];
        const isMagician = computedAwakened ?? actor?.system?.magic?.awakened ?? false;
        updates["system.creation.forcePoints"] = isMagician ? (resources?.forcePoints ?? 0) : 0;
        updates["system.creation.startingNuyen"] = resources?.nuyen ?? 0;
    }

    return Object.keys(updates).length ? updates : null;
}

export async function sr2ApplyCharacterPrioritiesOnCreate(
    actor,
    {
        userId,
        currentUserId,
        getAllowedMetatypesForPriority,
        syncFreeLanguageSkills
    } = {}
) {
    if (typeof userId === "string" && userId !== currentUserId) return false;
    if (actor?.type !== "character") return false;
    if (actor.getFlag?.("shadowrun2e", "prioritiesApplied")) return false;

    const updates = sr2BuildCharacterPriorityUpdates(actor, { getAllowedMetatypesForPriority });
    if (!updates) return false;

    await actor.update(updates, { render: false });

    if (typeof syncFreeLanguageSkills === "function") {
        await syncFreeLanguageSkills(actor);
    }

    await actor.setFlag("shadowrun2e", "prioritiesApplied", true);
    return true;
}
