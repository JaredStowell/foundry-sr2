import { describe, expect, it, vi } from "vitest";

import {
  sr2BuildActorItemActionEvent,
  sr2BuildItemMacroCommand,
  sr2ExecuteActorItemAction,
  sr2GetDefaultActionTypeForItem,
  sr2NormalizeSkillRollType,
} from "../../../scripts/actions/item-actions.js";

describe("item action helpers", () => {
  it("derives default macro actions by item type", () => {
    expect(sr2GetDefaultActionTypeForItem("weapon")).toBe("attack");
    expect(sr2GetDefaultActionTypeForItem("spell")).toBe("cast");
    expect(sr2GetDefaultActionTypeForItem("skill")).toBe("base");
    expect(sr2GetDefaultActionTypeForItem("adeptpower")).toBe("activate");
    expect(sr2GetDefaultActionTypeForItem("gear")).toBe("use");
  });

  it("builds macro commands and action events", () => {
    expect(sr2BuildItemMacroCommand("actor-1", "item-1", "attack")).toBe(
      'executeSR2Macro("actor-1", "item-1", "attack");',
    );

    const event = sr2BuildActorItemActionEvent("skill-1", {
      skillId: "skill-1",
      rollType: "specialization",
    });
    expect(event.currentTarget.dataset).toEqual({
      itemId: "skill-1",
      skillId: "skill-1",
      rollType: "specialization",
    });
    expect(sr2NormalizeSkillRollType("weird")).toBe("base");
  });

  it("routes weapon/spell/skill actions through shared handlers", async () => {
    const weaponAttack = vi.fn(async () => {});
    const spellCast = vi.fn(async () => {});
    const skillRoll = vi.fn(async () => {});
    const actor = { sheet: {} };

    await expect(
      sr2ExecuteActorItemAction(actor, { id: "w1", type: "weapon" }, "attack", {
        handlers: { weaponAttack },
      }),
    ).resolves.toMatchObject({ ok: true, mode: "handler" });

    await expect(
      sr2ExecuteActorItemAction(actor, { id: "s1", type: "spell" }, "cast", {
        handlers: { spellCast },
      }),
    ).resolves.toMatchObject({ ok: true, mode: "handler" });

    await expect(
      sr2ExecuteActorItemAction(actor, { id: "k1", type: "skill" }, "concentration", {
        handlers: { skillRoll },
      }),
    ).resolves.toMatchObject({ ok: true, mode: "handler", actionType: "concentration" });

    expect(weaponAttack).toHaveBeenCalledWith(
      expect.objectContaining({
        currentTarget: expect.objectContaining({
          dataset: expect.objectContaining({ itemId: "w1" }),
        }),
      }),
    );
    expect(spellCast).toHaveBeenCalled();
    expect(skillRoll.mock.calls[0][0].currentTarget.dataset.rollType).toBe("concentration");
  });

  it("falls back to item.roll when no specialized handler exists", async () => {
    const roll = vi.fn(async () => {});
    const result = await sr2ExecuteActorItemAction(
      { sheet: {} },
      { id: "gear-1", type: "gear", roll },
      "use",
    );

    expect(result).toMatchObject({ ok: true, mode: "fallback" });
    expect(roll).toHaveBeenCalledTimes(1);
  });
});
