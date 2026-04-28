import { beforeEach, describe, expect, it, vi } from "vitest";

import { registerCreationRuleHooks } from "../../../scripts/hooks/creation-rules.js";

function runAll(callbacks, args) {
  const results = [];
  for (const callback of callbacks) {
    results.push(callback(...args));
  }
  return results;
}

function createCreationActor(overrides = {}) {
  return {
    id: "actor-1",
    type: "character",
    sort: 1,
    items: [],
    getFlag: vi.fn((scope, key) => {
      if (scope !== "shadowrun2e") return undefined;
      if (key === "creationCompleted") return false;
      if (key === "creationMode") return true;
      return undefined;
    }),
    system: {
      attributes: {
        charisma: { value: 3 },
        magic: { value: 1 },
      },
      resources: {
        lifestyle: "street",
      },
      creation: {
        attributePoints: 30,
        skillPoints: 40,
        forcePoints: 6,
        startingNuyen: 10000,
        resourcesFinalized: false,
        extras: {
          contacts: 0,
          buddy: 0,
          gang: 0,
          followers: 0,
        },
      },
    },
    ...overrides,
  };
}

function createContactActor(overrides = {}) {
  return {
    id: "contact-1",
    type: "contact",
    sort: 1,
    system: {
      details: {
        leaderId: "leader-1",
        contactLevel: 1,
      },
    },
    ...overrides,
  };
}

beforeEach(() => {
  Hooks.__reset();
  Hooks.on.mockClear();

  ui.notifications.warn.mockClear();
  ui.notifications.error.mockClear();
  ui.notifications.info.mockClear();

  game.user = {
    id: "U1",
    isGM: false,
  };
  game.actors.__clear();

  delete globalThis.__sr2CreationRuleHooksInstalled;
});

describe("registerCreationRuleHooks", () => {
  it("registers hooks only once", () => {
    registerCreationRuleHooks();
    registerCreationRuleHooks();

    expect(Hooks.on).toHaveBeenCalledTimes(8);
  });

  it("ignores legacy creation flags and derives chargen limits from system.creation data", () => {
    registerCreationRuleHooks({
      areContactLevelsEnabled: () => true,
    });
    const [preCreateActorHook] = Hooks.__get("preCreateActor");

    const leader = createCreationActor({
      id: "leader-1",
      getFlag: vi.fn((scope, key) => {
        if (scope !== "shadowrun2e") return undefined;
        if (key === "creationCompleted") return true;
        if (key === "creationMode") return false;
        return undefined;
      }),
      system: {
        attributes: {
          charisma: { value: 0 },
          magic: { value: 1 },
        },
        resources: {
          lifestyle: "street",
        },
        creation: {
          attributePoints: 0,
          skillPoints: 0,
          forcePoints: 0,
          startingNuyen: 5000,
          extras: {
            contacts: 0,
            buddy: 0,
            gang: 0,
            followers: 0,
          },
        },
      },
    });
    game.actors.__set(leader);
    game.actors.__set({
      id: "contact-a",
      type: "contact",
      sort: 1,
      system: { details: { leaderId: "leader-1", contactLevel: 1 } },
    });
    game.actors.__set({
      id: "contact-b",
      type: "contact",
      sort: 2,
      system: { details: { leaderId: "leader-1", contactLevel: 1 } },
    });

    const result = preCreateActorHook(
      { type: "contact" },
      { type: "contact", system: { details: { leaderId: "leader-1", contactLevel: 1 } } },
      {},
      "U1",
    );

    expect(result).toBe(false);
    expect(ui.notifications.error).toHaveBeenCalledWith(
      "Too many contacts (max extra contacts is 3× Charisma, plus two free).",
    );
  });

  it("blocks contact creation when charisma-based contact cap is exceeded", () => {
    registerCreationRuleHooks({
      areContactLevelsEnabled: () => true,
    });
    const [preCreateActorHook] = Hooks.__get("preCreateActor");

    const leader = {
      id: "leader-1",
      type: "character",
      items: [],
      getFlag: vi.fn((scope, key) => {
        if (scope !== "shadowrun2e") return undefined;
        if (key === "creationCompleted") return false;
        if (key === "creationMode") return true;
        return undefined;
      }),
      system: {
        attributes: {
          charisma: { value: 0 },
        },
        creation: {
          startingNuyen: 5000,
          resourcesFinalized: false,
        },
      },
    };
    game.actors.__set(leader);
    game.actors.__set({
      id: "contact-a",
      type: "contact",
      sort: 1,
      system: { details: { leaderId: "leader-1", contactLevel: 1 } },
    });
    game.actors.__set({
      id: "contact-b",
      type: "contact",
      sort: 2,
      system: { details: { leaderId: "leader-1", contactLevel: 1 } },
    });

    const pendingActor = { type: "contact" };
    const data = {
      type: "contact",
      system: {
        details: {
          leaderId: "leader-1",
          contactLevel: 1,
        },
      },
    };

    const result = preCreateActorHook(pendingActor, data, {}, "U1");

    expect(result).toBe(false);
    expect(ui.notifications.error).toHaveBeenCalledWith(
      "Too many contacts (max extra contacts is 3× Charisma, plus two free).",
    );
  });

  it("blocks contact creation for level 2 and level 3 cap violations", () => {
    registerCreationRuleHooks({
      areContactLevelsEnabled: () => true,
    });
    const [preCreateActorHook] = Hooks.__get("preCreateActor");

    const leader = createCreationActor({
      id: "leader-1",
      system: {
        attributes: { charisma: { value: 1 }, magic: { value: 1 } },
        resources: { lifestyle: "street" },
        creation: {
          attributePoints: 30,
          skillPoints: 30,
          forcePoints: 6,
          startingNuyen: 500000,
          resourcesFinalized: false,
          extras: { contacts: 0, buddy: 0, gang: 0, followers: 0 },
        },
      },
    });
    game.actors.__set(leader);

    // 4 existing level 2 contacts + pending level 2 => exceeds extra level 2 max.
    for (let i = 0; i < 4; i += 1) {
      game.actors.__set({
        id: `l2-${i}`,
        type: "contact",
        sort: i,
        system: { details: { leaderId: "leader-1", contactLevel: 2 } },
      });
    }
    const resultLevel2 = preCreateActorHook(
      { type: "contact" },
      { type: "contact", system: { details: { leaderId: "leader-1", contactLevel: 2 } } },
      {},
      "U1",
    );
    expect(resultLevel2).toBe(false);
    expect(ui.notifications.error).toHaveBeenCalledWith(
      "Too many Level 2+ contacts (max extra Level 2 upgrades is 2× Charisma).",
    );

    game.actors.__clear();
    game.actors.__set(leader);
    for (let i = 0; i < 3; i += 1) {
      game.actors.__set({
        id: `l3-${i}`,
        type: "contact",
        sort: i,
        system: { details: { leaderId: "leader-1", contactLevel: 3 } },
      });
    }
    const resultLevel3 = preCreateActorHook(
      { type: "contact" },
      { type: "contact", system: { details: { leaderId: "leader-1", contactLevel: 3 } } },
      {},
      "U1",
    );
    expect(resultLevel3).toBe(false);
    expect(ui.notifications.error).toHaveBeenCalledWith(
      "Too many Level 3 contacts (max extra Level 3 upgrades is 1× Charisma).",
    );
  });

  it("allows contact creation when nuyen budget would go negative", () => {
    registerCreationRuleHooks({
      areContactLevelsEnabled: () => true,
    });
    const [preCreateActorHook] = Hooks.__get("preCreateActor");

    const leader = createCreationActor({
      id: "leader-1",
      items: [{ type: "gear", system: { price: 9000, quantity: 1 } }],
      system: {
        attributes: { charisma: { value: 6 }, magic: { value: 1 } },
        resources: { lifestyle: "street" },
        creation: {
          attributePoints: 30,
          skillPoints: 30,
          forcePoints: 6,
          startingNuyen: 1000,
          resourcesFinalized: false,
          extras: { contacts: 0, buddy: 0, gang: 0, followers: 0 },
        },
      },
    });
    game.actors.__set(leader);

    const result = preCreateActorHook(
      { type: "contact" },
      { type: "contact", system: { details: { leaderId: "leader-1", contactLevel: 2 } } },
      {},
      "U1",
    );

    expect(result).toBeUndefined();
    expect(ui.notifications.error).not.toHaveBeenCalledWith(
      "Not enough creation Nuyen remaining for that contact.",
    );
  });

  it("forces buddy extras to zero when buddies are disabled", () => {
    registerCreationRuleHooks({
      areBuddiesDisabled: () => true,
    });
    const preUpdateActorHooks = Hooks.__get("preUpdateActor");
    const budgetGuardHook = preUpdateActorHooks[0];

    const actor = {
      type: "character",
      system: {
        creation: {
          extras: {
            buddy: 0,
          },
        },
      },
    };
    const changes = {
      system: {
        creation: {
          extras: {
            buddy: 1,
          },
        },
      },
    };

    budgetGuardHook(actor, changes, {}, "U1");

    expect(foundry.utils.getProperty(changes, "system.creation.extras.buddy")).toBe(0);
    expect(ui.notifications.warn).toHaveBeenCalledWith("Buddies are disabled for this world.");
  });

  it("clamps contact level and allows expensive contact updates", () => {
    const summary = {
      over: {
        extraContacts: false,
        extraLevel2: false,
        extraLevel3: false,
      },
      costs: {
        contactsTotalCost: 90000,
      },
    };
    const contactSummaryForLeader = vi.fn(() => summary);

    registerCreationRuleHooks({
      areContactLevelsEnabled: () => true,
      getContactLevelsSummaryForLeader: contactSummaryForLeader,
    });
    const preUpdateActorHooks = Hooks.__get("preUpdateActor");
    const contactUpdateHook = preUpdateActorHooks[0];

    const leader = createCreationActor({
      id: "leader-1",
      system: {
        attributes: { charisma: { value: 3 }, magic: { value: 1 } },
        resources: { lifestyle: "street" },
        creation: {
          attributePoints: 30,
          skillPoints: 30,
          forcePoints: 6,
          startingNuyen: 1000,
          resourcesFinalized: false,
          extras: { contacts: 0, buddy: 0, gang: 0, followers: 0 },
        },
      },
    });
    game.actors.__set(leader);

    const actor = createContactActor();
    const changes = {
      system: {
        details: {
          contactLevel: 99,
          leaderId: "leader-1",
        },
      },
    };

    const result = contactUpdateHook(actor, changes, {}, "U1");
    expect(foundry.utils.getProperty(changes, "system.details.contactLevel")).toBe(3);
    expect(contactSummaryForLeader).toHaveBeenCalled();
    expect(result).toBeUndefined();
    expect(ui.notifications.error).not.toHaveBeenCalledWith(
      "Not enough creation Nuyen remaining for that contact change.",
    );
  });

  it("passes leader transfer metadata to contact summary helper", () => {
    const contactSummaryForLeader = vi.fn(() => ({
      over: {
        extraContacts: false,
        extraLevel2: false,
        extraLevel3: false,
      },
      costs: {
        contactsTotalCost: 0,
      },
    }));

    registerCreationRuleHooks({
      areContactLevelsEnabled: () => true,
      getContactLevelsSummaryForLeader: contactSummaryForLeader,
    });
    const preUpdateActorHooks = Hooks.__get("preUpdateActor");
    const contactUpdateHook = preUpdateActorHooks[0];

    const leader = createCreationActor({ id: "leader-2" });
    game.actors.__set(leader);

    const actor = createContactActor({
      id: "contact-5",
      sort: 4,
      system: { details: { leaderId: "leader-1", contactLevel: 1 } },
    });
    const changes = {
      system: {
        details: {
          leaderId: "leader-2",
          contactLevel: 2,
        },
      },
    };

    contactUpdateHook(actor, changes, {}, "U1");
    expect(contactSummaryForLeader).toHaveBeenCalledWith(
      leader,
      expect.objectContaining({
        id: "contact-5",
        sort: Number.MAX_SAFE_INTEGER,
        contactLevel: 2,
      }),
    );
  });

  it("blocks contact updates for cap violations returned by summary helper", () => {
    registerCreationRuleHooks({
      areContactLevelsEnabled: () => true,
      getContactLevelsSummaryForLeader: () => ({
        over: {
          extraContacts: false,
          extraLevel2: true,
          extraLevel3: false,
        },
        costs: {
          contactsTotalCost: 0,
        },
      }),
    });
    const preUpdateActorHooks = Hooks.__get("preUpdateActor");
    const contactUpdateHook = preUpdateActorHooks[0];

    game.actors.__set(createCreationActor({ id: "leader-1" }));
    const actor = createContactActor();
    const result = contactUpdateHook(actor, { system: { details: { contactLevel: 2 } } }, {}, "U1");

    expect(result).toBe(false);
    expect(ui.notifications.error).toHaveBeenCalledWith(
      "Too many Level 2+ contacts (max extra Level 2 upgrades is 2× Charisma).",
    );
  });

  it("rejects creating Sorcery skills when magic is zero", () => {
    registerCreationRuleHooks();
    const preCreateItemHooks = Hooks.__get("preCreateItem");

    const actor = {
      type: "character",
      system: {
        attributes: {
          magic: { value: 0 },
        },
        creation: {
          attributePoints: 0,
          skillPoints: 1,
          forcePoints: 0,
          startingNuyen: 0,
        },
      },
    };
    const item = {
      type: "skill",
      parent: actor,
    };
    const data = {
      type: "skill",
      system: {
        baseSkill: "Sorcery",
      },
    };

    const results = runAll(preCreateItemHooks, [item, data, {}, "U1"]);

    expect(results.some((result) => result === false)).toBe(true);
    expect(ui.notifications.error).toHaveBeenCalledWith(
      "Sorcery and Conjuring require a Magic rating.",
    );
  });

  it("allows creating Sorcery skills after creation even when magic is zero", () => {
    registerCreationRuleHooks();
    const preCreateItemHooks = Hooks.__get("preCreateItem");

    const actor = {
      type: "character",
      system: {
        attributes: {
          magic: { value: 0 },
        },
        creation: {
          attributePoints: 0,
          skillPoints: 0,
          forcePoints: 0,
          startingNuyen: 0,
        },
      },
    };
    const item = {
      type: "skill",
      parent: actor,
    };
    const data = {
      type: "skill",
      system: {
        baseSkill: "Sorcery",
      },
    };

    const results = runAll(preCreateItemHooks, [item, data, {}, "U1"]);

    expect(results.some((result) => result === false)).toBe(false);
  });

  it("rejects Sorcery/Conjuring skill updates when magic is zero", () => {
    registerCreationRuleHooks();
    const preUpdateItemHooks = Hooks.__get("preUpdateItem");
    const actor = createCreationActor({
      system: {
        attributes: { charisma: { value: 3 }, magic: { value: 0 } },
        resources: { lifestyle: "street" },
        creation: {
          attributePoints: 30,
          skillPoints: 40,
          forcePoints: 6,
          startingNuyen: 10000,
          resourcesFinalized: false,
          extras: { contacts: 0, buddy: 0, gang: 0, followers: 0 },
        },
      },
    });
    const item = {
      type: "skill",
      parent: actor,
      system: {
        baseSkill: "Pistols",
      },
    };

    const results = runAll(preUpdateItemHooks, [
      item,
      { system: { baseSkill: "Sorcery" } },
      {},
      "U1",
    ]);
    expect(results.some((result) => result === false)).toBe(true);
    expect(ui.notifications.error).toHaveBeenCalledWith(
      "Sorcery and Conjuring require a Magic rating.",
    );
  });

  it("allows Sorcery/Conjuring create/update when magic is positive", () => {
    registerCreationRuleHooks();
    const preCreateItemHooks = Hooks.__get("preCreateItem");
    const preUpdateItemHooks = Hooks.__get("preUpdateItem");

    const actor = createCreationActor({
      system: {
        attributes: { charisma: { value: 3 }, magic: { value: 6 } },
        resources: { lifestyle: "street" },
        creation: {
          attributePoints: 30,
          skillPoints: 40,
          forcePoints: 6,
          startingNuyen: 10000,
          resourcesFinalized: false,
          extras: { contacts: 0, buddy: 0, gang: 0, followers: 0 },
        },
      },
    });

    const item = {
      type: "skill",
      parent: actor,
      system: {
        baseSkill: "Pistols",
      },
    };

    const createResults = runAll(preCreateItemHooks, [
      item,
      { type: "skill", system: { baseSkill: "Sorcery" } },
      {},
      "U1",
    ]);
    const updateResults = runAll(preUpdateItemHooks, [
      item,
      { system: { baseSkill: "Conjuring" } },
      {},
      "U1",
    ]);

    expect(createResults.some((result) => result === false)).toBe(false);
    expect(updateResults.some((result) => result === false)).toBe(false);
  });

  it("clamps spell force updates to 1..6 during creation mode", () => {
    registerCreationRuleHooks();
    const preUpdateItemHooks = Hooks.__get("preUpdateItem");

    const actor = {
      type: "character",
      items: [],
      getFlag: vi.fn((scope, key) => {
        if (scope !== "shadowrun2e") return undefined;
        if (key === "creationCompleted") return false;
        if (key === "creationMode") return true;
        return undefined;
      }),
      system: {
        creation: {
          startingNuyen: 100000,
          forcePoints: 10,
          resourcesFinalized: false,
        },
      },
    };
    const item = {
      type: "spell",
      parent: actor,
      system: {
        force: 3,
      },
    };
    const changes = {
      system: {
        force: 9,
      },
    };

    runAll(preUpdateItemHooks, [item, changes, {}, "U1"]);

    expect(foundry.utils.getProperty(changes, "system.force")).toBe(6);
    expect(ui.notifications.warn).toHaveBeenCalledWith(
      "In creation mode, spell Force must be between 1 and 6.",
    );
  });

  it("rejects spell creation with out-of-range force in creation mode", () => {
    registerCreationRuleHooks();
    const preCreateItemHooks = Hooks.__get("preCreateItem");

    const actor = createCreationActor();
    const item = {
      type: "spell",
      parent: actor,
    };

    const results = runAll(preCreateItemHooks, [
      item,
      { type: "spell", system: { force: 10 } },
      {},
      "U1",
    ]);

    expect(results.some((result) => result === false)).toBe(true);
    expect(ui.notifications.error).toHaveBeenCalledWith(
      "In creation mode, spell Force must be between 1 and 6.",
    );
  });

  it("allows expensive non-skill item creation and updates in creation mode", () => {
    registerCreationRuleHooks();
    const preCreateItemHooks = Hooks.__get("preCreateItem");
    const preUpdateItemHooks = Hooks.__get("preUpdateItem");

    const actor = createCreationActor({
      items: [{ type: "gear", system: { price: 100, quantity: 1 } }],
      system: {
        attributes: { charisma: { value: 3 }, magic: { value: 1 } },
        resources: { lifestyle: "street" },
        creation: {
          attributePoints: 30,
          skillPoints: 40,
          forcePoints: 6,
          startingNuyen: 150,
          resourcesFinalized: false,
          extras: { contacts: 0, buddy: 0, gang: 0, followers: 0 },
        },
      },
    });

    const createItem = {
      type: "gear",
      parent: actor,
    };
    const createResults = runAll(preCreateItemHooks, [
      createItem,
      { type: "gear", system: { price: 200, quantity: 1 } },
      {},
      "U1",
    ]);
    expect(createResults.some((result) => result === false)).toBe(false);
    expect(ui.notifications.error).not.toHaveBeenCalledWith(
      "Not enough creation Nuyen remaining for that item.",
    );

    const existingItem = {
      type: "gear",
      parent: actor,
      system: { price: 100, quantity: 1 },
    };
    const updateResults = runAll(preUpdateItemHooks, [
      existingItem,
      { system: { price: 400 } },
      {},
      "U1",
    ]);
    expect(updateResults.some((result) => result === false)).toBe(false);
    expect(ui.notifications.error).not.toHaveBeenCalledWith(
      "Not enough creation Nuyen remaining for that change.",
    );
  });

  it("skips budget checks when skip flag is set", () => {
    registerCreationRuleHooks();
    const preCreateItemHooks = Hooks.__get("preCreateItem");
    const actor = createCreationActor({
      system: {
        attributes: { charisma: { value: 3 }, magic: { value: 1 } },
        resources: { lifestyle: "street" },
        creation: {
          attributePoints: 30,
          skillPoints: 40,
          forcePoints: 6,
          startingNuyen: 0,
          resourcesFinalized: false,
          extras: { contacts: 0, buddy: 0, gang: 0, followers: 0 },
        },
      },
    });
    const item = {
      type: "gear",
      parent: actor,
    };

    const results = runAll(preCreateItemHooks, [
      item,
      { type: "gear", system: { price: 999999 } },
      { sr2SkipBudget: true },
      "U1",
    ]);
    expect(results.some((result) => result === false)).toBe(false);
  });

  it("enforces force point availability for spell and focus creation", () => {
    registerCreationRuleHooks();
    const preCreateItemHooks = Hooks.__get("preCreateItem");

    const zeroForceActor = createCreationActor({
      system: {
        attributes: { charisma: { value: 3 }, magic: { value: 3 } },
        resources: { lifestyle: "street" },
        creation: {
          attributePoints: 30,
          skillPoints: 40,
          forcePoints: 0,
          startingNuyen: 10000,
          resourcesFinalized: false,
          extras: { contacts: 0, buddy: 0, gang: 0, followers: 0 },
        },
      },
    });
    const zeroResults = runAll(preCreateItemHooks, [
      { type: "spell", parent: zeroForceActor },
      { type: "spell", system: { force: 2 } },
      {},
      "U1",
    ]);
    expect(zeroResults.some((result) => result === false)).toBe(true);
    expect(ui.notifications.error).toHaveBeenCalledWith(
      "This character has no Force Points available for spells/foci in creation mode.",
    );

    const tightActor = createCreationActor({
      items: [{ type: "spell", system: { force: 5 } }],
      system: {
        attributes: { charisma: { value: 3 }, magic: { value: 3 } },
        resources: { lifestyle: "street" },
        creation: {
          attributePoints: 30,
          skillPoints: 40,
          forcePoints: 6,
          startingNuyen: 10000,
          resourcesFinalized: false,
          extras: { contacts: 0, buddy: 0, gang: 0, followers: 0 },
        },
      },
    });
    const overResults = runAll(preCreateItemHooks, [
      { type: "gear", parent: tightActor, name: "Power Focus 1" },
      {
        type: "gear",
        name: "Power Focus 1",
        system: { category: "Magical Equipment", quantity: 1, price: 250000 },
      },
      {},
      "U1",
    ]);
    expect(overResults.some((result) => result === false)).toBe(true);
    expect(ui.notifications.error).toHaveBeenCalledWith(
      "Not enough Force Points remaining. Reduce other spells/foci first.",
    );
  });

  it("enforces force point limits for spell and focus updates", () => {
    registerCreationRuleHooks();
    const preUpdateItemHooks = Hooks.__get("preUpdateItem");

    const actor = createCreationActor({
      items: [{ type: "spell", system: { force: 5 } }],
      system: {
        attributes: { charisma: { value: 3 }, magic: { value: 3 } },
        resources: { lifestyle: "street" },
        creation: {
          attributePoints: 30,
          skillPoints: 40,
          forcePoints: 6,
          startingNuyen: 10000,
          resourcesFinalized: false,
          extras: { contacts: 0, buddy: 0, gang: 0, followers: 0 },
        },
      },
    });

    const spellItem = {
      type: "spell",
      parent: actor,
      system: { force: 1 },
    };
    const spellResults = runAll(preUpdateItemHooks, [
      spellItem,
      { system: { force: 4 } },
      {},
      "U1",
    ]);
    expect(spellResults.some((result) => result === false)).toBe(true);

    const gearItem = {
      type: "gear",
      parent: actor,
      name: "Weapon Focus 1",
      system: {
        quantity: 1,
        category: "Magical Equipment",
        price: 290000,
      },
    };
    const gearResults = runAll(preUpdateItemHooks, [
      gearItem,
      { system: { quantity: 2 } },
      {},
      "U1",
    ]);
    expect(gearResults.some((result) => result === false)).toBe(true);
    expect(ui.notifications.error).toHaveBeenCalledWith(
      "Not enough Force Points remaining. Reduce other spells/foci first.",
    );
  });

  it("handles force point update no-op branches cleanly", () => {
    registerCreationRuleHooks();
    const preUpdateItemHooks = Hooks.__get("preUpdateItem");
    const actor = createCreationActor({
      items: [],
      system: {
        attributes: { charisma: { value: 3 }, magic: { value: 3 } },
        resources: { lifestyle: "street" },
        creation: {
          attributePoints: 30,
          skillPoints: 40,
          forcePoints: 6,
          startingNuyen: 10000,
          resourcesFinalized: false,
          extras: { contacts: 0, buddy: 0, gang: 0, followers: 0 },
        },
      },
    });

    // Spell without force change.
    const spell = { type: "spell", parent: actor, system: { force: 2 } };
    const spellResults = runAll(preUpdateItemHooks, [spell, { system: {} }, {}, "U1"]);
    expect(spellResults.some((result) => result === false)).toBe(false);

    // Gear with no relevant fields changed.
    const gear = {
      type: "gear",
      parent: actor,
      name: "Weapon Focus 1",
      system: { category: "Magical Equipment", quantity: 1, price: 290000 },
    };
    const gearNoop = runAll(preUpdateItemHooks, [gear, { system: {} }, {}, "U1"]);
    expect(gearNoop.some((result) => result === false)).toBe(false);

    // Gear with reduced cost should early-return.
    const gearDecrease = runAll(preUpdateItemHooks, [
      gear,
      { system: { quantity: 1, price: 100000 } },
      {},
      "U1",
    ]);
    expect(gearDecrease.some((result) => result === false)).toBe(false);
  });

  it("ignores hook processing when updates come from another user or skip budget flag", () => {
    registerCreationRuleHooks();
    const [preUpdateActorHook] = Hooks.__get("preUpdateActor");
    const preUpdateItemHooks = Hooks.__get("preUpdateItem");

    const actor = createCreationActor();
    const lockChanges = {
      system: {
        creation: {
          extras: {
            buddy: 1,
          },
        },
      },
    };
    preUpdateActorHook(actor, lockChanges, {}, "OTHER");
    expect(foundry.utils.getProperty(lockChanges, "system.creation.extras.buddy")).toBe(1);

    const item = {
      type: "gear",
      parent: actor,
      system: {
        price: 100,
        quantity: 1,
      },
    };
    const results = runAll(preUpdateItemHooks, [
      item,
      { system: { price: 999999 } },
      { sr2SkipBudget: true },
      "U1",
    ]);
    expect(results.some((result) => result === false)).toBe(false);
  });
});
