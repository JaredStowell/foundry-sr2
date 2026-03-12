import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  installActorCreateDialogObserver,
  registerActorCreateDialogHooks,
} from "../../../scripts/hooks/actor-create-dialog.js";

beforeEach(() => {
  Hooks.__reset();
  Hooks.on.mockClear();
  delete globalThis.__sr2ActorCreateDialogHooksInstalled;
  delete globalThis.__sr2eActorCreateDialogObserver;
});

describe("registerActorCreateDialogHooks", () => {
  it("registers dialog hooks once when enhancer is a function", () => {
    const enhancer = vi.fn();
    registerActorCreateDialogHooks(enhancer);
    registerActorCreateDialogHooks(enhancer);
    expect(Hooks.on).toHaveBeenCalledTimes(4);
  });

  it("ignores non-function enhancers", () => {
    registerActorCreateDialogHooks(null);
    expect(Hooks.on).not.toHaveBeenCalled();
  });
});

describe("installActorCreateDialogObserver", () => {
  it("installs observer and scans forms immediately and after mutations", async () => {
    vi.useFakeTimers();
    const enhancer = vi.fn();
    const forms = [{ id: "f1" }, { id: "f2" }];
    const observe = vi.fn();

    let lastObserver = null;
    globalThis.document = {
      body: {},
      querySelectorAll: vi.fn(() => forms),
    };
    globalThis.MutationObserver = class {
      constructor(callback) {
        this.callback = callback;
        this.observe = observe;
        lastObserver = this;
      }
    };

    installActorCreateDialogObserver(enhancer);
    expect(observe).toHaveBeenCalledWith(document.body, { childList: true, subtree: true });
    expect(enhancer).toHaveBeenCalledTimes(2);

    // Multiple mutations in same tick should still schedule one scan.
    lastObserver.callback();
    lastObserver.callback();
    vi.runAllTimers();

    expect(enhancer).toHaveBeenCalledTimes(4);
    vi.useRealTimers();
  });

  it("no-ops for non-function enhancer and duplicate install", () => {
    installActorCreateDialogObserver(null);
    expect(globalThis.__sr2eActorCreateDialogObserver).toBeUndefined();

    const enhancer = vi.fn();
    globalThis.document = {
      body: {},
      querySelectorAll: vi.fn(() => []),
    };
    globalThis.MutationObserver = class {
      constructor() {
        this.observe = vi.fn();
      }
    };
    installActorCreateDialogObserver(enhancer);
    const first = globalThis.__sr2eActorCreateDialogObserver;
    installActorCreateDialogObserver(enhancer);
    expect(globalThis.__sr2eActorCreateDialogObserver).toBe(first);
  });
});
