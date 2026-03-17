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
      createEmbeddedDocuments: vi.fn(async () => created),
    };

    const browser = new SR2ItemBrowser(actor, "vrprogram", {});
    const result = await browser.addItem(
      {
        name: "Virtual Armor",
        description: "VR Program",
        multiplier: 3,
        memorySize: 3,
      },
      { notify: false },
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
      createEmbeddedDocuments: vi.fn(async () => [{ id: "program-2" }]),
    };

    const browser = new SR2ItemBrowser(actor, "program", {});
    await browser.addItem(
      { name: "Shield", description: "Program", multiplier: 2 },
      { notify: false },
    );

    const [, docs] = actor.createEmbeddedDocuments.mock.calls[0];
    expect(docs[0].type).toBe("program");
  });

  it("creates spell items with canonical combat damage levels", async () => {
    const { SR2ItemBrowser } = await loadItemBrowserModule();
    const actor = {
      name: "Mage",
      createEmbeddedDocuments: vi.fn(async () => [{ id: "spell-1" }]),
    };

    const browser = new SR2ItemBrowser(actor, "spell", {});
    await browser.addItem(
      {
        name: "Mana Bolt",
        category: "C",
        spellType: "M",
        duration: "I",
        drain: "(F/2)S",
      },
      { notify: false },
    );

    const [, docs] = actor.createEmbeddedDocuments.mock.calls[0];
    expect(docs[0].type).toBe("spell");
    expect(docs[0].system.damage).toBe("S");
  });

  it("preserves explicit spell range and target metadata from the catalog", async () => {
    const { SR2ItemBrowser } = await loadItemBrowserModule();
    const actor = {
      name: "Mage",
      createEmbeddedDocuments: vi.fn(async () => [{ id: "spell-2" }]),
    };

    const browser = new SR2ItemBrowser(actor, "spell", {});
    await browser.addItem(
      {
        name: "Control Thoughts",
        category: "M",
        spellType: "M",
        duration: "S",
        drain: "[(F/2)+2]D",
        range: "Limited",
        target: "Willpower [R]",
      },
      { notify: false },
    );

    const [, docs] = actor.createEmbeddedDocuments.mock.calls[0];
    expect(docs[0].type).toBe("spell");
    expect(docs[0].system.range).toBe("Limited");
    expect(docs[0].system.target).toBe("Willpower [R]");
  });

  it("normalizes catalog cyberware into consistent system data", async () => {
    const { SR2ItemBrowser } = await loadItemBrowserModule();
    const actor = {
      name: "Runner",
      createEmbeddedDocuments: vi.fn(async () => [{ id: "cyber-1" }]),
    };
    const browser = new SR2ItemBrowser(actor, "cyberware", {});

    const [wiredReflexes] = browser._processCyberwareData({
      BODYWARE: [
        {
          Name: "Wired Reflexes 2",
          EssCost: 3,
          Cost: 165000,
          StreetIndex: 1,
          Mods: "+4RCT,+2INI",
          BookPage: "sr2.249",
        },
      ],
    });

    expect(wiredReflexes.reactionBonus).toBe(4);
    expect(wiredReflexes.initiativeDice).toBe(2);
    expect(wiredReflexes.rating).toBe(2);

    await browser.addItem(wiredReflexes, { notify: false });

    const [, docs] = actor.createEmbeddedDocuments.mock.calls[0];
    expect(docs[0].system).toMatchObject({
      essence: 3,
      reactionBonus: 4,
      initiativeDice: 2,
      rating: 2,
      mods: "+4RCT,+2INI",
      bodyLocation: "bodyware",
      streetIndex: 1,
      price: 165000,
    });
  });

  it("normalizes catalog bioware into consistent system data", async () => {
    const { SR2ItemBrowser } = await loadItemBrowserModule();
    const actor = {
      name: "Runner",
      createEmbeddedDocuments: vi.fn(async () => [{ id: "bio-1" }]),
    };
    const browser = new SR2ItemBrowser(actor, "bioware", {});

    const [cerebralBooster] = browser._processBiowareData({
      STANDARD: [
        {
          Name: "Cerebral Booster 2",
          BioIndex: "0.8",
          Cost: "110000",
          StreetIndex: "2.00",
          Mods: "+2INT",
          BookPage: "st.???",
        },
      ],
    });

    expect(cerebralBooster.rating).toBe(2);
    expect(cerebralBooster.bioIndex).toBe(0.8);

    await browser.addItem(cerebralBooster, { notify: false });

    const [, docs] = actor.createEmbeddedDocuments.mock.calls[0];
    expect(docs[0].system).toMatchObject({
      bioIndex: 0.8,
      rating: 2,
      mods: "+2INT",
      bodyLocation: "standard",
      streetIndex: 2,
      price: 110000,
    });
  });

  it("deducts nuyen for non-creation augmentation purchases", async () => {
    const { SR2ItemBrowser } = await loadItemBrowserModule();
    const actor = {
      id: "actor-1",
      name: "Runner",
      system: {
        resources: { nuyen: 120000 },
        creation: { startingNuyen: 0, resourcesFinalized: false },
      },
      getFlag: vi.fn(() => false),
      update: vi.fn(async (updates = {}) => {
        for (const [path, value] of Object.entries(updates)) {
          foundry.utils.setProperty(actor, path, value);
        }
      }),
      createEmbeddedDocuments: vi.fn(async () => [{ id: "bio-2" }]),
    };
    const browser = new SR2ItemBrowser(actor, "bioware", {});
    browser.render = vi.fn();
    browser.filteredItems = [
      {
        name: "Cerebral Booster 1",
        category: "STANDARD",
        bioIndex: 0.4,
        cost: "50000",
        streetIndex: 2,
        mods: "+1INT",
        bookPage: "st.???",
      },
    ];

    await browser._onBuyItem({
      preventDefault: vi.fn(),
      currentTarget: { dataset: { itemIndex: "0" } },
    });

    expect(actor.update).toHaveBeenCalledWith({ "system.resources.nuyen": 70000 });
    expect(actor.system.resources.nuyen).toBe(70000);
    expect(actor.createEmbeddedDocuments).toHaveBeenCalledTimes(1);
    expect(ui.notifications.info).toHaveBeenCalledWith("Bought Cerebral Booster 1 for ¥50000.");
  });

  it("refunds nuyen when an augmentation purchase fails after deduction", async () => {
    const { SR2ItemBrowser } = await loadItemBrowserModule();
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    const actor = {
      id: "actor-2",
      name: "Runner",
      system: {
        resources: { nuyen: 5000 },
        creation: { startingNuyen: 0, resourcesFinalized: false },
      },
      getFlag: vi.fn(() => false),
      update: vi.fn(async (updates = {}) => {
        for (const [path, value] of Object.entries(updates)) {
          foundry.utils.setProperty(actor, path, value);
        }
      }),
      createEmbeddedDocuments: vi.fn(async () => {
        throw new Error("create failed");
      }),
    };
    const browser = new SR2ItemBrowser(actor, "cyberware", {});
    browser.render = vi.fn();
    browser.filteredItems = [
      {
        name: "Datajack",
        category: "HEADWEAR",
        essence: 0.2,
        cost: 1000,
        streetIndex: 0.9,
        mods: "",
        bookPage: "sr2.246",
      },
    ];

    await browser._onBuyItem({
      preventDefault: vi.fn(),
      currentTarget: { dataset: { itemIndex: "0" } },
    });

    expect(actor.update).toHaveBeenNthCalledWith(1, { "system.resources.nuyen": 4000 });
    expect(actor.update).toHaveBeenNthCalledWith(2, { "system.resources.nuyen": 5000 });
    expect(actor.system.resources.nuyen).toBe(5000);
    expect(ui.notifications.error).toHaveBeenCalledWith("Failed to add item to character");
    consoleError.mockRestore();
  });

  it("treats creation budgets as active from system.creation data instead of flags", async () => {
    const { SR2ItemBrowser } = await loadItemBrowserModule();
    const actor = {
      system: {
        resources: { nuyen: 0 },
        creation: {
          attributePoints: 0,
          skillPoints: 0,
          forcePoints: 0,
          startingNuyen: 5000,
        },
      },
      getFlag: vi.fn((scope, key) => {
        if (scope !== "shadowrun2e") return undefined;
        if (key === "creationCompleted") return true;
        if (key === "creationMode") return false;
        return undefined;
      }),
    };

    const browser = new SR2ItemBrowser(actor, "gear", {});
    expect(browser._isCreationBudgetActive(actor)).toBe(true);
  });
});
