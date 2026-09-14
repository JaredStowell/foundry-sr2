import { describe, expect, it, vi } from "vitest";

describe("SR2ItemSheet focus data", () => {
  it("exposes saved focus linkage and equipped state to the item template", async () => {
    vi.resetModules();
    globalThis.ItemSheet = class {
      async getData() {
        return {};
      }
    };
    const { SR2ItemSheet } = await import("../../scripts/item/item-sheet.js");
    const system = { equipped: true, focus: { spellId: "heal", spellClass: "" } };
    const sheet = Object.create(SR2ItemSheet.prototype);
    sheet.item = {
      parent: {
        getRollData: () => ({}),
        items: [{ id: "heal", name: "Heal", type: "spell" }],
      },
      toObject: () => ({ name: "Specific Spell Focus 2", type: "gear", system }),
    };
    const context = await sheet.getData();
    expect(context.system).toEqual(system);
    expect(context.focusInfo.isSpecificSpellFocus).toBe(true);
    expect(context.availableSpells).toEqual([{ id: "heal", name: "Heal" }]);
  });
});
