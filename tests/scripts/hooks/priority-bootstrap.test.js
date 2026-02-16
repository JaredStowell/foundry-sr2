import { describe, expect, it, vi } from "vitest";

import {
    sr2ApplyCharacterPrioritiesOnCreate,
    sr2BuildCharacterPriorityUpdates
} from "../../../scripts/hooks/priority-bootstrap.js";

function createCharacterActor(overrides = {}) {
    const flags = {
        shadowrun2e: {}
    };

    const actor = {
        id: "char-1",
        type: "character",
        system: {
            details: {
                metatype: "human"
            },
            priorities: {
                metatype: "A",
                attributes: "B",
                skills: "C",
                resources: "D",
                magic: "B"
            },
            attributes: {
                magic: { value: 2 }
            },
            magic: {
                awakened: false,
                physicalAdept: false
            },
            creation: {
                attributePoints: 0,
                skillPoints: 0,
                forcePoints: 0,
                startingNuyen: 0
            }
        },
        getFlag: vi.fn((scope, key) => flags?.[scope]?.[key]),
        setFlag: vi.fn(async (scope, key, value) => {
            if (!flags[scope]) flags[scope] = {};
            flags[scope][key] = value;
        }),
        update: vi.fn(async (updates) => {
            for (const [path, value] of Object.entries(updates || {})) {
                foundry.utils.setProperty(actor, path, value);
            }
        }),
        ...overrides
    };

    return actor;
}

describe("sr2BuildCharacterPriorityUpdates", () => {
    it("builds shifted magic updates for metahuman with metatype A", () => {
        const actor = createCharacterActor({
            system: {
                details: {
                    metatype: "elf"
                },
                priorities: {
                    metatype: "A",
                    attributes: "B",
                    skills: "C",
                    resources: "D",
                    magic: "B"
                },
                attributes: {
                    magic: { value: 1 }
                },
                magic: {
                    awakened: false
                }
            }
        });

        const updates = sr2BuildCharacterPriorityUpdates(actor, {
            getAllowedMetatypesForPriority: () => ["human", "elf", "dwarf", "ork", "troll"]
        });

        expect(updates).toMatchObject({
            "system.magic.awakened": true,
            "system.magic.physicalAdept": false,
            "system.attributes.magic.value": 6,
            "system.creation.attributePoints": 24,
            "system.creation.skillPoints": 24,
            "system.creation.forcePoints": 15,
            "system.creation.startingNuyen": 5000
        });
    });

    it("forces disallowed metatype and zeroes force points for non-magicians", () => {
        const actor = createCharacterActor({
            system: {
                details: {
                    metatype: "troll"
                },
                priorities: {
                    metatype: "D",
                    attributes: "A",
                    skills: "A",
                    resources: "A",
                    magic: "C"
                },
                attributes: {
                    magic: { value: 6 }
                },
                magic: {
                    awakened: true
                }
            }
        });

        const updates = sr2BuildCharacterPriorityUpdates(actor, {
            getAllowedMetatypesForPriority: () => ["human"]
        });

        expect(updates).toMatchObject({
            "system.details.metatype": "human",
            "system.magic.awakened": false,
            "system.magic.physicalAdept": false,
            "system.attributes.magic.value": 0,
            "system.creation.attributePoints": 30,
            "system.creation.skillPoints": 40,
            "system.creation.forcePoints": 0,
            "system.creation.startingNuyen": 1000000
        });
    });

    it("returns null when no priorities are selected", () => {
        const actor = createCharacterActor({
            system: {
                priorities: {
                    metatype: "",
                    attributes: "",
                    skills: "",
                    resources: "",
                    magic: ""
                }
            }
        });
        expect(sr2BuildCharacterPriorityUpdates(actor)).toBeNull();
    });
});

describe("sr2ApplyCharacterPrioritiesOnCreate", () => {
    it("applies updates, syncs free languages, and sets priorities flag", async () => {
        const actor = createCharacterActor({
            system: {
                details: {
                    metatype: "elf"
                },
                priorities: {
                    metatype: "A",
                    attributes: "B",
                    skills: "C",
                    resources: "D",
                    magic: "B"
                },
                attributes: {
                    magic: { value: 0 }
                },
                magic: {
                    awakened: false,
                    physicalAdept: false
                },
                creation: {
                    attributePoints: 0,
                    skillPoints: 0,
                    forcePoints: 0,
                    startingNuyen: 0
                }
            }
        });
        const syncFreeLanguageSkills = vi.fn().mockResolvedValue(undefined);

        const applied = await sr2ApplyCharacterPrioritiesOnCreate(actor, {
            userId: "U1",
            currentUserId: "U1",
            getAllowedMetatypesForPriority: () => ["human", "elf"],
            syncFreeLanguageSkills
        });

        expect(applied).toBe(true);
        expect(actor.update).toHaveBeenCalledOnce();
        expect(syncFreeLanguageSkills).toHaveBeenCalledWith(actor);
        expect(actor.setFlag).toHaveBeenCalledWith("shadowrun2e", "prioritiesApplied", true);
    });

    it("skips when user does not match, actor type is non-character, or priorities already applied", async () => {
        const actor = createCharacterActor();

        expect(
            await sr2ApplyCharacterPrioritiesOnCreate(actor, {
                userId: "other-user",
                currentUserId: "U1"
            })
        ).toBe(false);

        const nonCharacter = createCharacterActor({ type: "contact" });
        expect(
            await sr2ApplyCharacterPrioritiesOnCreate(nonCharacter, {
                userId: "U1",
                currentUserId: "U1"
            })
        ).toBe(false);

        const alreadyApplied = createCharacterActor({
            getFlag: vi.fn(() => true)
        });
        expect(
            await sr2ApplyCharacterPrioritiesOnCreate(alreadyApplied, {
                userId: "U1",
                currentUserId: "U1"
            })
        ).toBe(false);
    });
});
