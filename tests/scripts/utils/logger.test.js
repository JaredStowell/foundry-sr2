import { beforeEach, describe, expect, it, vi } from "vitest";

import { sr2LogDebug, sr2LogError, sr2LogInfo, sr2LogWarn } from "../../../scripts/utils/logger.js";

beforeEach(() => {
  game.settings = {
    get: vi.fn(() => false),
  };
});

describe("logger", () => {
  it("logs debug only when debug setting is enabled", () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    sr2LogDebug("hidden");
    expect(logSpy).not.toHaveBeenCalled();

    game.settings.get.mockReturnValue(true);
    sr2LogDebug("visible");
    expect(logSpy).toHaveBeenCalledWith("SR2E |", "visible");

    logSpy.mockRestore();
  });

  it("handles settings read failures for debug logging", () => {
    game.settings.get.mockImplementation(() => {
      throw new Error("unavailable");
    });

    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    sr2LogDebug("still hidden");
    expect(logSpy).not.toHaveBeenCalled();
    logSpy.mockRestore();
  });

  it("always prefixes info/warn/error logs", () => {
    const infoSpy = vi.spyOn(console, "info").mockImplementation(() => {});
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    sr2LogInfo("i");
    sr2LogWarn("w");
    sr2LogError("e");

    expect(infoSpy).toHaveBeenCalledWith("SR2E |", "i");
    expect(warnSpy).toHaveBeenCalledWith("SR2E |", "w");
    expect(errorSpy).toHaveBeenCalledWith("SR2E |", "e");

    infoSpy.mockRestore();
    warnSpy.mockRestore();
    errorSpy.mockRestore();
  });
});
