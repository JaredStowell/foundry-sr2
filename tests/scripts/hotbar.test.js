import { beforeEach, describe, expect, it, vi } from "vitest";

async function loadHotbarModule() {
  vi.resetModules();
  Hooks.__reset();
  return import("../../scripts/hotbar.js");
}

beforeEach(() => {
  ui.notifications.warn.mockClear();
  ui.notifications.error.mockClear();
  ui.notifications.info.mockClear();

  game.user = {
    id: "U1",
    isGM: false,
    assignHotbarMacro: vi.fn(),
  };

  globalThis.window = globalThis;
  globalThis.fromUuid = vi.fn();
  globalThis.Macro = {
    create: vi.fn(),
  };
});

describe("createItemMacro", () => {
  it("ignores non-item drops", async () => {
    const { createItemMacro } = await loadHotbarModule();
    await createItemMacro({ type: "Actor" }, 1);
    expect(fromUuid).not.toHaveBeenCalled();
  });

  it("warns when dropped item cannot be resolved or has no actor", async () => {
    const { createItemMacro } = await loadHotbarModule();

    fromUuid.mockResolvedValueOnce(null);
    await createItemMacro({ type: "Item", uuid: "missing" }, 1);
    expect(ui.notifications.warn).toHaveBeenCalledWith("Could not find the item for this macro");

    fromUuid.mockResolvedValueOnce({
      id: "item-1",
      name: "Loose Item",
      type: "gear",
      img: "item.png",
      parent: null,
    });
    await createItemMacro({ type: "Item", uuid: "no-parent" }, 2);
    expect(ui.notifications.warn).toHaveBeenCalledWith(
      "This item must be owned by an actor to create a macro",
    );
  });

  it("creates and assigns a weapon macro with attack command", async () => {
    const { createItemMacro } = await loadHotbarModule();
    fromUuid.mockResolvedValue({
      id: "item-1",
      name: "Ares Predator",
      type: "weapon",
      img: "predator.png",
      parent: { id: "actor-1" },
    });
    Macro.create.mockResolvedValue({ id: "macro-1" });

    await createItemMacro({ type: "Item", uuid: "abc" }, 5);

    expect(Macro.create).toHaveBeenCalled();
    const payload = Macro.create.mock.calls[0][0];
    expect(payload.name).toBe("Ares Predator (Attack)");
    expect(payload.command).toContain('executeSR2Macro("actor-1", "item-1", "attack")');
    expect(game.user.assignHotbarMacro).toHaveBeenCalledWith({ id: "macro-1" }, 5);
    expect(ui.notifications.info).toHaveBeenCalledWith("Created macro for Ares Predator");
  });

  it("creates spell, skill, adept power, and default macros", async () => {
    const { createItemMacro } = await loadHotbarModule();
    const actor = { id: "actor-1" };
    const cases = [
      { type: "spell", name: "Manabolt", expected: "cast" },
      { type: "skill", name: "Pistols", expected: "base" },
      { type: "adeptpower", name: "Killing Hands", expected: "activate" },
      { type: "gear", name: "Medkit", expected: "use" },
    ];

    Macro.create.mockImplementation(async (payload) => ({ id: payload.name }));

    for (const [index, itemCase] of cases.entries()) {
      fromUuid.mockResolvedValueOnce({
        id: `item-${index}`,
        name: itemCase.name,
        type: itemCase.type,
        img: `${itemCase.type}.png`,
        parent: actor,
      });
      await createItemMacro({ type: "Item", uuid: `uuid-${index}` }, index + 1);
    }

    const commands = Macro.create.mock.calls.map((call) => call[0].command);
    expect(commands.some((command) => command.includes('"cast"'))).toBe(true);
    expect(commands.some((command) => command.includes('"base"'))).toBe(true);
    expect(commands.some((command) => command.includes('"activate"'))).toBe(true);
    expect(commands.some((command) => command.includes('"use"'))).toBe(true);
  });
});

describe("hotbar drop and executeSR2Macro", () => {
  it("registers hotbar drop hook and blocks default for items", async () => {
    await loadHotbarModule();
    const [hotbarDropHook] = Hooks.__get("hotbarDrop");
    const result = hotbarDropHook({}, { type: "Item" }, 1);
    expect(result).toBe(false);
    expect(hotbarDropHook({}, { type: "Actor" }, 1)).toBeUndefined();
  });

  it("shows errors for missing actor/item in executeSR2Macro", async () => {
    await loadHotbarModule();
    game.actors = { get: vi.fn(() => null) };

    await window.executeSR2Macro("a", "i", "attack");
    expect(ui.notifications.error).toHaveBeenCalledWith("Actor not found for this macro");

    game.actors.get.mockReturnValue({ items: new Map() });
    await window.executeSR2Macro("a", "i", "attack");
    expect(ui.notifications.error).toHaveBeenCalledWith("Item not found on actor");
  });

  it("routes actions through actor sheet handlers and fallback rolls", async () => {
    await loadHotbarModule();

    const weaponHandler = vi.fn();
    const skillHandler = vi.fn();
    const fallbackRoll = vi.fn();
    const itemMap = new Map([
      ["weapon-1", { id: "weapon-1", name: "Gun", type: "weapon", roll: fallbackRoll }],
      ["skill-1", { id: "skill-1", name: "Pistols", type: "skill", roll: fallbackRoll }],
      ["gear-1", { id: "gear-1", name: "Kit", type: "gear", roll: fallbackRoll }],
    ]);

    game.actors = {
      get: vi.fn(() => ({
        id: "actor-1",
        sheet: {
          _onWeaponAttack: weaponHandler,
          _onSkillRoll: skillHandler,
        },
        items: {
          get: (id) => itemMap.get(id),
        },
      })),
    };

    await window.executeSR2Macro("actor-1", "weapon-1", "attack");
    await window.executeSR2Macro("actor-1", "skill-1", "concentration");
    await window.executeSR2Macro("actor-1", "gear-1", "use");

    expect(weaponHandler).toHaveBeenCalled();
    expect(skillHandler).toHaveBeenCalled();
    const skillEvent = skillHandler.mock.calls[0][0];
    expect(skillEvent.currentTarget.dataset.rollType).toBe("concentration");
    expect(fallbackRoll).toHaveBeenCalledTimes(1);
  });

  it("handles spell and skill fallback/specialization execution paths", async () => {
    await loadHotbarModule();

    const spellCast = vi.fn();
    const skillRoll = vi.fn();
    const spellFallback = vi.fn();
    const skillFallback = vi.fn();
    const itemMap = new Map([
      ["spell-1", { id: "spell-1", name: "Powerbolt", type: "spell", roll: spellFallback }],
      ["spell-2", { id: "spell-2", name: "Heal", type: "spell", roll: spellFallback }],
      ["skill-1", { id: "skill-1", name: "Stealth", type: "skill", roll: skillFallback }],
      ["skill-2", { id: "skill-2", name: "Etiquette", type: "skill", roll: skillFallback }],
    ]);

    const actor = {
      sheet: {
        _onSpellCast: spellCast,
        _onSkillRoll: skillRoll,
      },
      items: {
        get: (id) => itemMap.get(id),
      },
    };

    game.actors = { get: vi.fn(() => actor) };

    await window.executeSR2Macro("a", "spell-1", "cast");
    await window.executeSR2Macro("a", "skill-1", "specialization");
    expect(spellCast).toHaveBeenCalled();
    expect(skillRoll.mock.calls[0][0].currentTarget.dataset.rollType).toBe("specialization");

    delete actor.sheet._onSpellCast;
    delete actor.sheet._onSkillRoll;
    await window.executeSR2Macro("a", "spell-2", "cast");
    await window.executeSR2Macro("a", "skill-2", "base");
    expect(spellFallback).toHaveBeenCalled();
    expect(skillFallback).toHaveBeenCalled();
  });

  it("falls back to weapon roll when attack handler is unavailable", async () => {
    await loadHotbarModule();
    const weaponRoll = vi.fn();
    const actor = {
      sheet: {},
      items: {
        get: () => ({ id: "w1", name: "Shotgun", type: "weapon", roll: weaponRoll }),
      },
    };
    game.actors = { get: vi.fn(() => actor) };

    await window.executeSR2Macro("actor", "w1", "attack");
    expect(weaponRoll).toHaveBeenCalled();
  });
});
