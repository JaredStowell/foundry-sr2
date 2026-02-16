import { beforeEach, describe, expect, it, vi } from "vitest";

import { registerActorRuleHooks } from "../../../scripts/hooks/actor-rules.js";

function makeActor(overrides = {}) {
    return {
        id: "actor-1",
        type: "character",
        system: {
            details: {
                metatype: "human",
                traits: {
                    lowLightVision: false
                }
            },
            attributes: {
                body: { value: 3, min: 0, max: 6 },
                quickness: { value: 3, min: 0, max: 6 },
                strength: { value: 3, min: 0, max: 6 },
                charisma: { value: 3, min: 0, max: 6 },
                intelligence: { value: 3, min: 0, max: 6 },
                willpower: { value: 3, min: 0, max: 6 }
            },
            magic: {
                awakened: false,
                physicalAdept: false
            }
        },
        ...overrides
    };
}

beforeEach(() => {
    Hooks.__reset();
    Hooks.on.mockClear();
    delete globalThis.__sr2ActorRuleHooksInstalled;
    game.user = { id: "U1", isGM: false };
});

describe("registerActorRuleHooks", () => {
    it("registers hook set once", () => {
        registerActorRuleHooks();
        registerActorRuleHooks();
        expect(Hooks.on).toHaveBeenCalledTimes(4);
    });

    it("applies metatype bounds/traits and recalculates attribute values", () => {
        registerActorRuleHooks();
        const [preUpdateActor] = Hooks.__get("preUpdateActor");

        const actor = makeActor();
        const changes = {
            system: {
                details: {
                    metatype: "troll"
                }
            }
        };

        preUpdateActor(actor, changes, {}, "U1");

        expect(foundry.utils.getProperty(changes, "system.attributes.body.min")).toBe(5);
        expect(foundry.utils.getProperty(changes, "system.attributes.body.max")).toBe(11);
        expect(foundry.utils.getProperty(changes, "system.details.traits.thermographicVision")).toBe(true);
        expect(foundry.utils.getProperty(changes, "system.attributes.body.value")).toBe(8);
    });

    it("clamps explicitly updated values during metatype change", () => {
        registerActorRuleHooks();
        const [preUpdateActor] = Hooks.__get("preUpdateActor");

        const actor = makeActor();
        const changes = {
            system: {
                details: {
                    metatype: "troll"
                },
                attributes: {
                    body: {
                        value: 99
                    }
                }
            }
        };

        preUpdateActor(actor, changes, {}, "U1");
        expect(foundry.utils.getProperty(changes, "system.attributes.body.value")).toBe(11);
    });

    it("clamps explicit attribute updates and initializes missing traits", () => {
        registerActorRuleHooks();
        const [preUpdateActor] = Hooks.__get("preUpdateActor");

        const actor = makeActor({
            system: {
                details: {
                    metatype: "dwarf",
                    traits: null
                },
                attributes: {
                    body: { value: 4, min: 1, max: 7 },
                    quickness: { value: 0, min: -1, max: 5 },
                    strength: { value: 5, min: 2, max: 8 },
                    charisma: { value: 3, min: 0, max: 6 },
                    intelligence: { value: 2, min: 0, max: 6 },
                    willpower: { value: 3, min: 1, max: 7 }
                }
            }
        });
        const changes = {
            system: {
                attributes: {
                    quickness: { value: -99 }
                }
            }
        };

        preUpdateActor(actor, changes, {}, "U1");

        expect(foundry.utils.getProperty(changes, "system.attributes.quickness.value")).toBe(-1);
        expect(foundry.utils.getProperty(changes, "system.details.traits.diseaseResistance")).toBe(2);
    });

    it("initializes pre-created actors at racial minimum when values are unallocated", () => {
        registerActorRuleHooks();
        const [preCreateActor] = Hooks.__get("preCreateActor");

        const actor = { type: "character" };
        const data = {
            type: "character",
            system: {
                details: {
                    metatype: "ork"
                },
                attributes: {
                    body: { value: 1 },
                    quickness: { value: 1 },
                    strength: { value: 1 },
                    charisma: { value: 1 },
                    intelligence: { value: 1 },
                    willpower: { value: 1 }
                }
            }
        };

        preCreateActor(actor, data, {}, "U1");
        expect(foundry.utils.getProperty(data, "system.attributes.body.value")).toBe(3);
        expect(foundry.utils.getProperty(data, "system.attributes.charisma.value")).toBe(-1);
        expect(foundry.utils.getProperty(data, "system.details.traits.lowLightVision")).toBe(true);
    });

    it("keeps follower archetype values unchanged during preCreate", () => {
        registerActorRuleHooks();
        const [preCreateActor] = Hooks.__get("preCreateActor");

        const actor = { type: "follower" };
        const data = {
            type: "follower",
            system: {
                details: {
                    metatype: "human",
                    archetype: "streetSam"
                },
                attributes: {
                    body: { value: 4 }
                }
            }
        };

        preCreateActor(actor, data, {}, "U1");
        expect(foundry.utils.getProperty(data, "system.attributes.body.value")).toBe(4);
    });

    it("enforces awakened/physical adept consistency", () => {
        registerActorRuleHooks();
        const preUpdateActorHooks = Hooks.__get("preUpdateActor");
        const magicGuardHook = preUpdateActorHooks[1];

        const actor = makeActor();
        const changes = {
            system: {
                magic: {
                    physicalAdept: true
                }
            }
        };

        magicGuardHook(actor, changes, {}, "U1");
        expect(foundry.utils.getProperty(changes, "system.magic.awakened")).toBe(true);

        const changesTwo = {
            system: {
                magic: {
                    awakened: false
                }
            }
        };
        magicGuardHook(actor, changesTwo, {}, "U1");
        expect(foundry.utils.getProperty(changesTwo, "system.magic.physicalAdept")).toBe(false);
    });

    it("calls free-language sync only on relevant actor changes", async () => {
        const syncFreeLanguageSkills = vi.fn().mockResolvedValue(undefined);
        registerActorRuleHooks({ syncFreeLanguageSkills });
        const [updateActor] = Hooks.__get("updateActor");
        const actor = makeActor();

        await updateActor(actor, { system: { notes: "none" } }, {}, "U1");
        expect(syncFreeLanguageSkills).not.toHaveBeenCalled();

        await updateActor(
            actor,
            { system: { details: { nativeLanguage: "English" } } },
            {},
            "U1"
        );
        expect(syncFreeLanguageSkills).toHaveBeenCalledTimes(1);

        await updateActor(
            actor,
            { system: { details: { nativeLanguage: "German" } } },
            { sr2SyncingLanguages: true },
            "U1"
        );
        expect(syncFreeLanguageSkills).toHaveBeenCalledTimes(1);
    });

    it("ignores actor updates from other users", async () => {
        const syncFreeLanguageSkills = vi.fn().mockResolvedValue(undefined);
        registerActorRuleHooks({ syncFreeLanguageSkills });
        const [updateActor] = Hooks.__get("updateActor");
        const actor = makeActor();

        await updateActor(actor, { system: { details: { nativeLanguage: "English" } } }, {}, "OTHER");
        expect(syncFreeLanguageSkills).not.toHaveBeenCalled();
    });

    it("ignores preUpdateActor changes for non-character-like actor types", () => {
        registerActorRuleHooks();
        const [preUpdateActor] = Hooks.__get("preUpdateActor");

        const npcActor = makeActor({ type: "vehicle" });
        const changes = { system: { details: { metatype: "troll" } } };
        preUpdateActor(npcActor, changes, {}, "U1");

        expect(foundry.utils.getProperty(changes, "system.details.traits")).toBeUndefined();
    });
});
