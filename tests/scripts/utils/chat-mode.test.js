import { beforeEach, describe, expect, it, vi } from "vitest";

import { sr2ApplyMessageMode, sr2GetMessageMode } from "../../../scripts/utils/chat-mode.js";

describe("chat message visibility modes", () => {
  beforeEach(() => {
    game.settings = {
      get: vi.fn((scope, key) => {
        if (scope === "core" && key === "messageMode") return "gm";
        if (scope === "core" && key === "rollMode") return "blind";
        return undefined;
      }),
    };
    globalThis.ChatMessage = {};
  });

  it("prefers v14 core messageMode over legacy rollMode", () => {
    expect(sr2GetMessageMode()).toBe("gm");
    expect(game.settings.get).toHaveBeenCalledWith("core", "messageMode");
  });

  it("uses ChatMessage.applyMode when available", () => {
    globalThis.ChatMessage.applyMode = vi.fn((data, mode) => ({ ...data, appliedMode: mode }));

    expect(sr2ApplyMessageMode({ content: "Hoi" }, "blind")).toEqual({
      content: "Hoi",
      appliedMode: "blind",
    });
    expect(ChatMessage.applyMode).toHaveBeenCalledWith({ content: "Hoi" }, "blind");
  });

  it("falls back to legacy rollMode data for pre-v14 compatibility", () => {
    expect(sr2ApplyMessageMode({ content: "Hoi" }, "blind")).toEqual({
      content: "Hoi",
      rollMode: "blind",
    });
  });
});
