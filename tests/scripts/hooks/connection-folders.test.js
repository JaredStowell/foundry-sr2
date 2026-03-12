import { beforeEach, describe, expect, it, vi } from "vitest";

import { registerConnectionFolderHooks } from "../../../scripts/hooks/connection-folders.js";

function makeLeader(id, name = "Alice Runner") {
  return { id, name, type: "character" };
}

function makeConnectionActor(overrides = {}) {
  return {
    id: "contact-1",
    type: "contact",
    folder: null,
    system: {
      details: {
        leaderId: "leader-1",
      },
    },
    update: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  };
}

beforeEach(() => {
  Hooks.__reset();
  Hooks.on.mockClear();
  delete globalThis.__sr2ConnectionFolderHooksInstalled;

  game.user = { id: "U1", isGM: false };
  game.actors.__clear();
  game.folders = [];

  ui.actors = { render: vi.fn() };
  globalThis.Folder = {
    create: vi.fn(),
  };
});

describe("registerConnectionFolderHooks", () => {
  it("registers once and installs create/update actor hooks", () => {
    registerConnectionFolderHooks();
    registerConnectionFolderHooks();
    expect(Hooks.on).toHaveBeenCalledTimes(2);
  });

  it("assigns existing flagged folder on createActor", async () => {
    registerConnectionFolderHooks({
      getSystemSetting: () => "perType",
    });
    const [createActorHook] = Hooks.__get("createActor");

    const leader = makeLeader("leader-1");
    game.actors.__set(leader);
    game.folders = [
      {
        id: "contacts-folder",
        type: "Actor",
        name: "Contacts",
        folder: null,
        getFlag: vi.fn(() => ({ kind: "type", connectionType: "contact" })),
      },
    ];

    const actor = makeConnectionActor();
    await createActorHook(actor, {}, "U1");

    expect(actor.update).toHaveBeenCalledWith(
      { folder: "contacts-folder" },
      { sr2AssigningConnectionFolder: true },
    );
    expect(ui.actors.render).toHaveBeenCalled();
  });

  it("does nothing when non-GM user cannot create missing folders", async () => {
    registerConnectionFolderHooks({
      getSystemSetting: () => "perTypePerPlayer",
    });
    const [createActorHook] = Hooks.__get("createActor");

    game.actors.__set(makeLeader("leader-1"));
    const actor = makeConnectionActor();

    await createActorHook(actor, {}, "U1");

    expect(Folder.create).not.toHaveBeenCalled();
    expect(actor.update).not.toHaveBeenCalled();
  });

  it("creates nested folder segments as GM and assigns deepest folder", async () => {
    game.user.isGM = true;
    registerConnectionFolderHooks({
      getSystemSetting: () => "perTypePerPlayer",
    });
    const [createActorHook] = Hooks.__get("createActor");

    game.actors.__set(makeLeader("leader-1", "Rico"));

    Folder.create
      .mockResolvedValueOnce({ id: "type-folder", type: "Actor", name: "Contacts", folder: null })
      .mockResolvedValueOnce({
        id: "player-folder",
        type: "Actor",
        name: "Rico",
        folder: "type-folder",
      });

    const actor = makeConnectionActor();
    await createActorHook(actor, {}, "U1");

    expect(Folder.create).toHaveBeenCalledTimes(2);
    expect(actor.update).toHaveBeenCalledWith(
      { folder: "player-folder" },
      { sr2AssigningConnectionFolder: true },
    );
  });

  it("reuses name-matched folder and sets missing connection flag for GM", async () => {
    game.user.isGM = true;
    registerConnectionFolderHooks({
      getSystemSetting: () => "perPlayer",
    });
    const [createActorHook] = Hooks.__get("createActor");

    game.actors.__set(makeLeader("leader-1", "Rico"));
    const setFlag = vi.fn().mockResolvedValue(undefined);
    game.folders = [
      {
        id: "rico-folder",
        type: "Actor",
        name: "Rico",
        folder: null,
        flags: {},
        getFlag: vi.fn(() => null),
        setFlag,
      },
    ];

    const actor = makeConnectionActor();
    await createActorHook(actor, {}, "U1");

    expect(setFlag).toHaveBeenCalledWith("shadowrun2e", "connectionFolder", {
      kind: "player",
      leaderId: "leader-1",
    });
    expect(actor.update).toHaveBeenCalledWith(
      { folder: "rico-folder" },
      { sr2AssigningConnectionFolder: true },
    );
  });

  it("skips update if actor already in target folder", async () => {
    registerConnectionFolderHooks({
      getSystemSetting: () => "perType",
    });
    const [createActorHook] = Hooks.__get("createActor");

    game.actors.__set(makeLeader("leader-1"));
    game.folders = [
      {
        id: "contacts-folder",
        type: "Actor",
        name: "Contacts",
        folder: null,
        getFlag: vi.fn(() => ({ kind: "type", connectionType: "contact" })),
      },
    ];

    const actor = makeConnectionActor({ folder: { id: "contacts-folder" } });
    await createActorHook(actor, {}, "U1");
    expect(actor.update).not.toHaveBeenCalled();
  });

  it("handles folder creation and actor update failures without throwing", async () => {
    game.user.isGM = true;
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    registerConnectionFolderHooks({
      getSystemSetting: () => "perTypePerPlayer",
    });
    const [createActorHook] = Hooks.__get("createActor");

    game.actors.__set(makeLeader("leader-1", "Rico"));
    Folder.create.mockRejectedValueOnce(new Error("nope"));
    const actor = makeConnectionActor({
      update: vi.fn().mockRejectedValue(new Error("cannot update")),
    });

    await createActorHook(actor, {}, "U1");
    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockRestore();
  });

  it("updates folder when leaderId changes and ignores internal update option", async () => {
    game.user.isGM = true;
    registerConnectionFolderHooks({
      getSystemSetting: () => "perType",
    });
    const [updateActorHook] = Hooks.__get("updateActor");

    game.actors.__set(makeLeader("leader-1"));
    game.folders = [
      {
        id: "contacts-folder",
        type: "Actor",
        name: "Contacts",
        folder: null,
        getFlag: vi.fn(() => ({ kind: "type", connectionType: "contact" })),
      },
    ];

    const actor = makeConnectionActor({
      system: {
        details: {
          leaderId: "leader-1",
        },
      },
    });

    await updateActorHook(actor, { system: { details: { leaderId: "leader-1" } } }, {}, "U1");
    expect(actor.update).toHaveBeenCalledTimes(1);

    await updateActorHook(
      actor,
      { system: { details: { leaderId: "leader-1" } } },
      { sr2AssigningConnectionFolder: true },
      "U1",
    );
    expect(actor.update).toHaveBeenCalledTimes(1);
  });

  it("skips updateActor when leaderId did not change in the patch", async () => {
    registerConnectionFolderHooks({
      getSystemSetting: () => "perType",
    });
    const [updateActorHook] = Hooks.__get("updateActor");

    const actor = makeConnectionActor();
    await updateActorHook(actor, { system: { details: { name: "unchanged" } } }, {}, "U1");
    expect(actor.update).not.toHaveBeenCalled();
  });
});
