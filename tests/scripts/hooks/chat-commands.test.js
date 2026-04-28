import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  registerChatCommandHooks,
  sr2CountRtnSuccesses,
  sr2HandleRtnChatMessage,
  sr2ParseRtnCommand,
} from "../../../scripts/hooks/chat-commands.js";

beforeEach(() => {
  Hooks.__reset();
  Hooks.on.mockClear();
  ui.notifications.warn.mockClear();
  ui.notifications.error.mockClear();
  delete globalThis.__sr2ChatCommandHooksInstalled;
  delete globalThis.Roll;
  globalThis.ChatMessage = {
    getSpeaker: vi.fn(() => ({ alias: "GM" })),
  };
});

describe("registerChatCommandHooks", () => {
  it("registers chat command hooks only once", () => {
    registerChatCommandHooks();
    registerChatCommandHooks();
    expect(Hooks.on).toHaveBeenCalledTimes(1);
    expect(Hooks.__get("chatMessage")).toHaveLength(1);
  });
});

describe("sr2ParseRtnCommand", () => {
  it("returns null for non-/rtn chat messages", () => {
    expect(sr2ParseRtnCommand("/roll 1d6")).toBeNull();
  });

  it("parses formula and target number from /rtn command", () => {
    expect(sr2ParseRtnCommand("/rtn 1d6+4 5")).toEqual({
      formula: "1d6+4",
      targetNumber: 5,
    });
  });

  it("accepts formulas with spaces by using the last token as target number", () => {
    expect(sr2ParseRtnCommand("/rtn 2d6 + 3 7")).toEqual({
      formula: "2d6 + 3",
      targetNumber: 7,
    });
  });

  it("returns usage error for malformed /rtn command", () => {
    expect(sr2ParseRtnCommand("/rtn 1d6+4")).toEqual({
      error: "Usage: /rtn <diceFormula> <targetNumber> (example: /rtn 1d6+4 5)",
    });
  });
});

describe("sr2HandleRtnChatMessage", () => {
  it("passes through non-/rtn chat messages", () => {
    expect(sr2HandleRtnChatMessage({}, "hello world", {})).toBe(true);
  });

  it("warns and blocks malformed /rtn command", () => {
    expect(sr2HandleRtnChatMessage({}, "/rtn", {})).toBe(false);
    expect(ui.notifications.warn).toHaveBeenCalledWith(
      "Usage: /rtn <diceFormula> <targetNumber> (example: /rtn 1d6+4 5)",
    );
  });

  it("rolls and sends a result message for valid /rtn command", async () => {
    const evaluate = vi.fn().mockResolvedValue(undefined);
    const toMessage = vi.fn().mockResolvedValue(undefined);

    globalThis.Roll = vi.fn((formula) => ({
      formula,
      total: 8,
      dice: [
        {
          results: [{ result: 2 }, { result: 5 }, { result: 6 }],
        },
      ],
      evaluate,
      toMessage,
    }));

    const handled = sr2HandleRtnChatMessage({}, "/rtn 1d6+4 5", { speaker: { alias: "User" } });
    expect(handled).toBe(false);

    await vi.waitFor(() => {
      expect(globalThis.Roll).toHaveBeenCalledWith("1d6+4");
      expect(evaluate).toHaveBeenCalledWith({ async: true });
      expect(toMessage).toHaveBeenCalledTimes(1);
    });

    const [{ flavor, flags }] = toMessage.mock.calls[0];
    expect(flavor).toContain("Target Number Roll");
    expect(flavor).toContain("Target Number:</strong> 5");
    expect(flavor).toContain("Outcome:</strong> 2 successes");
    expect(flags.shadowrun2e.rtn).toEqual({
      formula: "1d6+4",
      targetNumber: 5,
      total: 8,
      successes: 2,
      success: true,
    });
  });

  it("reports errors when formula cannot be rolled", async () => {
    globalThis.Roll = vi.fn(() => {
      throw new Error("bad formula");
    });

    const handled = sr2HandleRtnChatMessage({}, "/rtn this-is-bad 4", {});
    expect(handled).toBe(false);

    await vi.waitFor(() => {
      expect(ui.notifications.error).toHaveBeenCalledWith(
        "Failed to roll /rtn command: this-is-bad",
      );
    });
  });
});

describe("sr2CountRtnSuccesses", () => {
  it("counts active die results greater than or equal to the target number", () => {
    expect(
      sr2CountRtnSuccesses(
        {
          dice: [
            {
              results: [
                { result: 4 },
                { result: 5 },
                { result: 6 },
                { result: 8, active: false },
              ],
            },
          ],
        },
        5,
      ),
    ).toBe(2);
  });
});
