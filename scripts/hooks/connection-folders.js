const SR2_CONNECTION_FOLDER_HOOKS_KEY = "__sr2ConnectionFolderHooksInstalled";

function sr2IsSameUser(userId) {
    if (typeof userId !== "string") return true;
    const currentUserId = globalThis.game?.user?.id;
    if (!currentUserId) return true;
    return userId === currentUserId;
}

export function registerConnectionFolderHooks({ getSystemSetting } = {}) {
    if (globalThis[SR2_CONNECTION_FOLDER_HOOKS_KEY]) return;
    globalThis[SR2_CONNECTION_FOLDER_HOOKS_KEY] = true;

    const readSetting = typeof getSystemSetting === "function"
        ? getSystemSetting
        : (key, fallback) => fallback;

    function sr2GetConnectionFolderParentId(folder) {
        const parent = folder?.folder ?? folder?.parent;
        if (typeof parent === "string") return parent;
        return parent?.id ?? null;
    }

    function sr2GetConnectionFolderFlag(folder) {
        try {
            const flag = folder?.getFlag?.("shadowrun2e", "connectionFolder");
            if (flag) return flag;
        } catch (err) {
            // Ignore.
        }
        return folder?.flags?.shadowrun2e?.connectionFolder ?? null;
    }

    function sr2ConnectionFolderFlagsMatch(actual, expected) {
        if (!actual || !expected) return false;
        if (actual.kind !== expected.kind) return false;
        if ((actual.connectionType ?? null) !== (expected.connectionType ?? null)) return false;
        if ((actual.leaderId ?? null) !== (expected.leaderId ?? null)) return false;
        return true;
    }

    function sr2GetConnectionTypeFolderName(connectionType) {
        if (connectionType === "contact") return "Contacts";
        if (connectionType === "follower") return "Followers";
        return null;
    }

    async function sr2EnsureActorConnectionFolderSegment({ name, parentId = null, expectedFlag }) {
        const allFolders = globalThis.game?.folders ?? [];
        const candidates = allFolders.filter(f => f?.type === "Actor" && sr2GetConnectionFolderParentId(f) === parentId);

        const byFlag = candidates.find(f => sr2ConnectionFolderFlagsMatch(sr2GetConnectionFolderFlag(f), expectedFlag));
        if (byFlag) return byFlag;

        const byName = candidates.find(f => String(f?.name || "") === String(name || ""));
        if (byName) {
            if (game?.user?.isGM) {
                try {
                    await byName.setFlag("shadowrun2e", "connectionFolder", expectedFlag);
                } catch (err) {
                    // Ignore.
                }
            }
            return byName;
        }

        if (!game?.user?.isGM) return null;

        try {
            return await Folder.create({
                name,
                type: "Actor",
                folder: parentId,
                flags: {
                    shadowrun2e: {
                        connectionFolder: expectedFlag
                    }
                }
            });
        } catch (err) {
            console.warn("SR2E | Failed to create connection folder:", err);
            return null;
        }
    }

    async function sr2GetOrCreateActorConnectionFolder({ mode, leaderActor, connectionType }) {
        const leaderId = leaderActor?.id;
        const leaderName = String(leaderActor?.name || "").trim();
        if (!leaderId || !leaderName) return null;

        const typeFolderName = sr2GetConnectionTypeFolderName(connectionType);
        if (!typeFolderName) return null;

        const typeSegment = {
            name: typeFolderName,
            expectedFlag: { kind: "type", connectionType }
        };

        const playerSegment = {
            name: leaderName,
            expectedFlag: { kind: "player", leaderId }
        };

        let segments = [];
        switch (String(mode || "disabled")) {
            case "perType":
                segments = [typeSegment];
                break;
            case "perPlayer":
                segments = [playerSegment];
                break;
            case "perTypePerPlayer":
                segments = [typeSegment, playerSegment];
                break;
            case "perPlayerPerType":
                segments = [playerSegment, typeSegment];
                break;
            default:
                return null;
        }

        let parentId = null;
        let folder = null;
        for (const segment of segments) {
            folder = await sr2EnsureActorConnectionFolderSegment({
                name: segment.name,
                parentId,
                expectedFlag: segment.expectedFlag
            });
            if (!folder?.id) return null;
            parentId = folder.id;
        }

        return folder;
    }

    async function sr2ApplyNestedConnectionFolder(actor) {
        if (!actor || !["contact", "follower"].includes(actor.type)) return;

        const mode = readSetting("nestedConnectionFolders", "disabled");
        if (!mode || mode === "disabled") return;

        const leaderId = actor.system?.details?.leaderId;
        if (!leaderId) return;

        const leader = globalThis.game?.actors?.get(leaderId);
        if (!leader || leader.type !== "character") return;

        const targetFolder = await sr2GetOrCreateActorConnectionFolder({
            mode,
            leaderActor: leader,
            connectionType: actor.type
        });
        if (!targetFolder?.id) return;

        const currentFolderId = actor.folder?.id ?? actor.folder ?? null;
        if (currentFolderId === targetFolder.id) return;

        try {
            await actor.update({ folder: targetFolder.id }, { sr2AssigningConnectionFolder: true });
            try {
                globalThis.ui?.actors?.render?.();
            } catch (err) {
                // Ignore.
            }
        } catch (err) {
            console.warn("SR2E | Failed to assign connection folder:", err);
        }
    }

    Hooks.on("createActor", async function (actor, options, userId) {
        if (!sr2IsSameUser(userId)) return;
        await sr2ApplyNestedConnectionFolder(actor);
    });

    Hooks.on("updateActor", async function (actor, changes, options, userId) {
        if (options?.sr2AssigningConnectionFolder) return;
        if (!sr2IsSameUser(userId)) return;
        if (!actor || !["contact", "follower"].includes(actor.type)) return;

        const getProperty = globalThis.foundry?.utils?.getProperty;
        if (typeof getProperty !== "function") return;

        if (getProperty(changes, "system.details.leaderId") === undefined) return;
        await sr2ApplyNestedConnectionFolder(actor);
    });
}
