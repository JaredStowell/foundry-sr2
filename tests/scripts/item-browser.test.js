import { beforeEach, describe, expect, it, vi } from "vitest";

async function loadItemBrowserModule() {
    vi.resetModules();
    return import("../../scripts/item-browser.js");
}

describe("SR2ItemBrowser addItem", () => {
    beforeEach(() => {
        ui.notifications.warn.mockClear();
        ui.notifications.error.mockClear();
        ui.notifications.info.mockClear();
    });

    it("normalizes vrprogram browser adds to program item type", async () => {
        const { SR2ItemBrowser } = await loadItemBrowserModule();
        const created = [{ id: "program-1" }];
        const actor = {
            name: "Deck",
            createEmbeddedDocuments: vi.fn(async () => created)
        };

        const browser = new SR2ItemBrowser(actor, "vrprogram", {});
        const result = await browser.addItem(
            {
                name: "Virtual Armor",
                description: "VR Program",
                multiplier: 3,
                memorySize: 3
            },
            { notify: false }
        );

        expect(actor.createEmbeddedDocuments).toHaveBeenCalledTimes(1);
        const [documentName, docs] = actor.createEmbeddedDocuments.mock.calls[0];
        expect(documentName).toBe("Item");
        expect(docs).toHaveLength(1);
        expect(docs[0].type).toBe("program");
        expect(docs[0].name).toBe("Virtual Armor");
        expect(result).toEqual(created[0]);
    });

    it("keeps non-vr browser types unchanged", async () => {
        const { SR2ItemBrowser } = await loadItemBrowserModule();
        const actor = {
            name: "Deck",
            createEmbeddedDocuments: vi.fn(async () => [{ id: "program-2" }])
        };

        const browser = new SR2ItemBrowser(actor, "program", {});
        await browser.addItem({ name: "Shield", description: "Program", multiplier: 2 }, { notify: false });

        const [, docs] = actor.createEmbeddedDocuments.mock.calls[0];
        expect(docs[0].type).toBe("program");
    });
});
