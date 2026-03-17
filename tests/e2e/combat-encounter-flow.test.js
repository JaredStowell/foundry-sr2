import { beforeEach, describe, expect, it, vi } from "vitest";

import { SR2Combat } from "../../scripts/combat/sr2-combat.js";

function createItemCollection(items) {
  const storage = new Map(items.map((item) => [item.id, item]));
  const values = () => Array.from(storage.values());
  return {
    get(id) {
      return storage.get(id);
    },
    filter(predicate) {
      return values().filter(predicate);
    },
    find(predicate) {
      return values().find(predicate);
    },
    some(predicate) {
      return values().some(predicate);
    },
    map(callback) {
      return values().map(callback);
    },
    [Symbol.iterator]() {
      return values()[Symbol.iterator]();
    },
  };
}

function createUpdatableEntity(data) {
  return {
    ...data,
    update: vi.fn(async (updateData = {}) => {
      for (const [path, value] of Object.entries(updateData)) {
        foundry.utils.setProperty(data, path, value);
      }
      return data;
    }),
  };
}

function createToken({ id, actor = null, x = 0, y = 0, scene }) {
  return {
    id,
    actor,
    center: { x, y },
    scene,
  };
}

function createActor({
  id,
  name,
  token = null,
  items = [],
  reaction = 6,
  initiativeBase = reaction,
  mockInitiativeTotal = 12,
  system = {},
} = {}) {
  const actor = createUpdatableEntity({
    id,
    name,
    _mockInitiativeTotal: mockInitiativeTotal,
    system: foundry.utils.mergeObject(
      {
        initiative: { base: initiativeBase, current: 0, dice: 1 },
        attributes: {
          body: { value: 3 },
          quickness: { value: 4 },
          strength: { value: 4 },
          willpower: { value: 4 },
          intelligence: { value: 4 },
          magic: { value: 0, effective: 0 },
          reaction: { value: reaction },
        },
        health: {
          physical: { value: 0, max: 10 },
          stun: { value: 0, max: 10 },
        },
        details: { traits: { dermalArmor: 0, reach: 0 } },
      },
      foundry.utils.deepClone(system),
    ),
    items: createItemCollection(items),
    getActiveTokens: vi.fn(() => (token ? [token] : [])),
  });
  if (token) token.actor = actor;
  game.actors.__set(actor);
  return actor;
}

function buildEvent({ itemId, rollType = "attack" }) {
  return {
    preventDefault: vi.fn(),
    stopPropagation: vi.fn(),
    currentTarget: {
      dataset: { itemId, rollType },
    },
  };
}

async function loadSheetClass() {
  vi.resetModules();
  globalThis.ActorSheet =
    globalThis.ActorSheet ||
    class ActorSheet {
      constructor(actor) {
        this.actor = actor;
      }

      static get defaultOptions() {
        return {};
      }
    };
  return (await import("../../scripts/actor/actor-sheet.js")).SR2ActorSheet;
}

function createSheet(SR2ActorSheet, actor) {
  const sheet = Object.create(SR2ActorSheet.prototype);
  sheet.actor = actor;
  sheet.object = actor;
  sheet.render = vi.fn();
  return sheet;
}

function createDialogHtml(values) {
  const normalizedValues = { ...values };
  const makeNode = (selector) => ({
    val(nextValue) {
      if (arguments.length > 0) {
        normalizedValues[selector] = nextValue;
        return this;
      }
      return normalizedValues[selector] ?? 0;
    },
    is() {
      return false;
    },
    prop() {
      return this;
    },
    change() {
      return this;
    },
    on() {
      return this;
    },
    text(nextValue) {
      normalizedValues[selector] = nextValue;
      return this;
    },
    attr() {
      return "0";
    },
  });

  return {
    find(selector) {
      return makeNode(selector);
    },
  };
}

describe("combat encounter e2e flow", () => {
  beforeEach(() => {
    ui.notifications.warn.mockClear();
    ui.notifications.error.mockClear();
    ui.notifications.info.mockClear();
    Hooks.__reset();
    game.actors.__clear();
    game.combats.__clear();
    CONFIG.Combat.documentClass = SR2Combat;

    game.user = {
      id: "U1",
      targets: new Set(),
    };

    globalThis.ChatMessage = {
      create: vi.fn(async () => {}),
      getSpeaker: vi.fn(() => ({ alias: "Runner" })),
    };

    globalThis.canvas = {
      scene: {
        id: "scene-1",
        grid: { distance: 1, units: "m" },
      },
      grid: { size: 1 },
      tokens: { controlled: [] },
    };
  });

  it("plays through initiative, multiple phases, and three combat styles in one encounter", async () => {
    const SR2ActorSheet = await loadSheetClass();

    const scene = canvas.scene;

    const shooterToken = createToken({ id: "token-shooter", x: 0, y: 0, scene });
    const brawlerToken = createToken({ id: "token-brawler", x: 1, y: 0, scene });
    const mageToken = createToken({ id: "token-mage", x: 2, y: 0, scene });
    const guardToken = createToken({ id: "token-guard", x: 20, y: 0, scene });
    const gangerToken = createToken({ id: "token-ganger", x: 3, y: 0, scene });
    const corpToken = createToken({ id: "token-corp", x: 4, y: 0, scene });

    const shooterSkill = {
      id: "skill-rifle",
      type: "skill",
      name: "Assault Rifles",
      system: {
        baseSkill: "Assault Rifles",
        baseRating: 6,
        concentration: "",
        concentrationRating: 0,
        specialization: "",
        specializationRating: 0,
      },
    };
    const shooterWeapon = createUpdatableEntity({
      id: "weapon-rifle",
      type: "weapon",
      name: "AK-97",
      system: {
        weaponType: "ranged",
        damage: "8M",
        mode: "SS/BF/FA",
        recoil: 0,
        rangeType: "assault rifle",
        ammo: { current: 12, max: 30, type: "regular" },
        linkedSkill: { skillId: "skill-rifle", rollType: "base" },
      },
    });
    const shooter = createActor({
      id: "actor-shooter",
      name: "Shooter",
      token: shooterToken,
      items: [shooterSkill, shooterWeapon],
      reaction: 8,
      initiativeBase: 8,
      mockInitiativeTotal: 19,
      system: {
        attributes: {
          strength: { value: 4 },
          reaction: { value: 8 },
          magic: { value: 0, effective: 0 },
        },
      },
    });

    const brawlerWeapon = {
      id: "weapon-club",
      type: "weapon",
      name: "Stun Baton",
      system: {
        weaponType: "melee",
        damage: "6M",
        reach: 0,
        equipped: true,
      },
    };
    const brawlerSkill = {
      id: "skill-club",
      type: "skill",
      name: "Clubs",
      system: {
        baseSkill: "Clubs",
        baseRating: 5,
        concentration: "",
        concentrationRating: 0,
        specialization: "",
        specializationRating: 0,
      },
    };
    const brawler = createActor({
      id: "actor-brawler",
      name: "Brawler",
      token: brawlerToken,
      items: [brawlerSkill, brawlerWeapon],
      reaction: 7,
      initiativeBase: 7,
      mockInitiativeTotal: 17,
      system: {
        attributes: {
          strength: { value: 5 },
          reaction: { value: 7 },
          magic: { value: 0, effective: 0 },
        },
        details: { traits: { dermalArmor: 0, reach: 0 } },
      },
    });

    const mageSpell = {
      id: "spell-manabolt",
      type: "spell",
      name: "Manabolt",
      system: {
        force: 4,
        class: "C",
        type: "M",
        damage: "M",
        drain: "[(F/2)+1]M",
      },
    };
    const mage = createActor({
      id: "actor-mage",
      name: "Mage",
      token: mageToken,
      items: [mageSpell],
      reaction: 6,
      initiativeBase: 6,
      mockInitiativeTotal: 12,
      system: {
        attributes: {
          magic: { value: 6, effective: 6 },
          willpower: { value: 5 },
          reaction: { value: 6 },
        },
      },
    });

    const guardArmor = {
      id: "armor-guard",
      type: "armor",
      name: "Armor Jacket",
      system: { equipped: true, ballistic: 5, impact: 3 },
    };
    const guard = createActor({
      id: "actor-guard",
      name: "Guard",
      token: guardToken,
      items: [guardArmor],
      system: {
        attributes: { body: { value: 4 } },
      },
    });

    const gangerUnarmed = {
      id: "skill-unarmed",
      type: "skill",
      name: "Unarmed Combat",
      system: { baseSkill: "Unarmed Combat", baseRating: 4 },
    };
    const gangerArmor = {
      id: "armor-ganger",
      type: "armor",
      name: "Leather Jacket",
      system: { equipped: true, ballistic: 1, impact: 2 },
    };
    const ganger = createActor({
      id: "actor-ganger",
      name: "Ganger",
      token: gangerToken,
      items: [gangerUnarmed, gangerArmor],
      system: {
        attributes: { body: { value: 3 } },
      },
    });

    const corp = createActor({
      id: "actor-corp",
      name: "Corp Mage",
      token: corpToken,
      items: [],
      system: {
        attributes: {
          body: { value: 4 },
          willpower: { value: 4 },
        },
      },
    });

    const shooterSheet = createSheet(SR2ActorSheet, shooter);
    const brawlerSheet = createSheet(SR2ActorSheet, brawler);
    const mageSheet = createSheet(SR2ActorSheet, mage);

    await shooterSheet._onInitiativeRoll({ preventDefault: vi.fn(), stopPropagation: vi.fn() });
    await brawlerSheet._onInitiativeRoll({ preventDefault: vi.fn(), stopPropagation: vi.fn() });
    await mageSheet._onInitiativeRoll({ preventDefault: vi.fn(), stopPropagation: vi.fn() });

    const [combat] = game.combats.contents;
    expect(combat).toBeTruthy();
    expect(combat.combatants).toHaveLength(3);
    expect(foundry.utils.getProperty(combat, "flags.shadowrun2e.sr2.currentPhase")).toBe(19);
    expect(combat.combatant.actorId).toBe(shooter.id);

    shooterSheet._showTargetNumberDialog = vi
      .fn()
      .mockResolvedValueOnce({
        rolled: true,
        rollResult: { successes: 4 },
      })
      .mockResolvedValueOnce({
        rolled: true,
        rollResult: { successes: 1, successesBySource: { combat: 0 } },
      });
    shooterSheet._loadRangesData = vi.fn(async () => ({
      "assault rifle": { min: 0, short: 50, medium: 150, long: 350, extreme: 550 },
    }));
    canvas.tokens.controlled = [shooterToken];
    game.user.targets = new Set([guardToken]);

    await shooterSheet._onWeaponAttack(buildEvent({ itemId: shooterWeapon.id }));

    expect(shooterSheet._showTargetNumberDialog).toHaveBeenCalledTimes(2);
    expect(shooterSheet._showTargetNumberDialog.mock.calls[0][3]).toBe(4);
    expect(shooterSheet._showTargetNumberDialog.mock.calls[1][3]).toBe(3);
    expect(shooterWeapon.update).toHaveBeenCalledWith({ "system.ammo.current": 11 });
    expect(guard.update).toHaveBeenCalledWith({ "system.health.physical.value": 6 });

    await combat.nextTurn();
    expect(foundry.utils.getProperty(combat, "flags.shadowrun2e.sr2.currentPhase")).toBe(17);
    expect(combat.combatant.actorId).toBe(brawler.id);

    brawlerSheet._showTargetNumberDialog = vi
      .fn()
      .mockResolvedValueOnce({
        rolled: true,
        rollResult: { successes: 3 },
      })
      .mockResolvedValueOnce({
        rolled: true,
        rollResult: { successes: 1 },
      })
      .mockResolvedValueOnce({
        rolled: true,
        rollResult: { successes: 0 },
      });
    canvas.tokens.controlled = [brawlerToken];
    game.user.targets = new Set([gangerToken]);

    await brawlerSheet._onWeaponAttack(buildEvent({ itemId: brawlerWeapon.id }));

    expect(brawlerSheet._showTargetNumberDialog).toHaveBeenCalledTimes(3);
    expect(brawlerSheet._showTargetNumberDialog.mock.calls[0][3]).toBe(4);
    expect(brawlerSheet._showTargetNumberDialog.mock.calls[1][3]).toBe(4);
    expect(brawlerSheet._showTargetNumberDialog.mock.calls[2][3]).toBe(4);
    expect(ganger.update).toHaveBeenCalledWith({ "system.health.physical.value": 6 });

    await combat.nextTurn();
    expect(foundry.utils.getProperty(combat, "flags.shadowrun2e.sr2.currentPhase")).toBe(12);
    expect(combat.combatant.actorId).toBe(mage.id);

    mageSheet._getHighestSorcerySkill = vi.fn(() => 6);
    mageSheet._showTargetNumberDialog = vi
      .fn()
      .mockResolvedValueOnce({
        rolled: true,
        rollResult: { successes: 5, isCriticalFailure: false },
        poolsUsed: [],
      })
      .mockResolvedValueOnce({
        rolled: true,
        rollResult: { successes: 2 },
      })
      .mockResolvedValueOnce({
        rolled: true,
        rollResult: { successes: 0 },
      });
    game.user.targets = new Set([corpToken]);

    await mageSheet._onSpellCast(buildEvent({ itemId: mageSpell.id }));

    expect(mageSheet._showTargetNumberDialog).toHaveBeenCalledTimes(3);
    expect(mageSheet._showTargetNumberDialog.mock.calls[0][3]).toBe(4);
    expect(mageSheet._showTargetNumberDialog.mock.calls[1][3]).toBe(4);
    expect(mageSheet._showTargetNumberDialog.mock.calls[2][3]).toBe(3);
    expect(corp.update).toHaveBeenCalledWith({ "system.health.physical.value": 10 });
    expect(mage.update).toHaveBeenCalledWith({ "system.health.stun.value": 3 });

    await combat.nextTurn();
    expect(foundry.utils.getProperty(combat, "flags.shadowrun2e.sr2.currentPhase")).toBe(9);
    expect(combat.combatant.actorId).toBe(shooter.id);

    await combat.nextTurn();
    expect(foundry.utils.getProperty(combat, "flags.shadowrun2e.sr2.currentPhase")).toBe(7);
    expect(combat.combatant.actorId).toBe(brawler.id);

    await combat.nextTurn();
    expect(foundry.utils.getProperty(combat, "flags.shadowrun2e.sr2.currentPhase")).toBe(2);
    expect(combat.combatant.actorId).toBe(mage.id);

    await combat.nextTurn();
    expect(combat.round).toBe(2);
    expect(foundry.utils.getProperty(combat, "flags.shadowrun2e.sr2.currentPhase")).toBe(19);
  });

  it("applies visibility, cover, movement, accessories, and wound penalties in the actual TN dialog", async () => {
    const SR2ActorSheet = await loadSheetClass();

    const actor = createActor({
      id: "actor-dialog",
      name: "Shooter",
      items: [],
      reaction: 6,
      initiativeBase: 6,
      mockInitiativeTotal: 10,
      system: {
        health: {
          physical: { value: 4, max: 10 },
          stun: { value: 0, max: 10 },
        },
      },
    });
    actor.rollDice = vi.fn(async (dice, targetNumber, title) => ({
      successes: 2,
      finalDicePool: dice,
      finalTargetNumber: targetNumber,
      title,
    }));

    const weapon = {
      id: "weapon-dialog",
      type: "weapon",
      name: "Predator",
      system: {
        weaponType: "ranged",
      },
    };

    const originalDialog = globalThis.Dialog;
    globalThis.Dialog = class MockDialog {
      constructor(config) {
        this.config = config;
      }

      render() {
        const html = createDialogHtml({
          "#target-number": 4,
          'select[name="recoil-modifier"]': "0",
          'select[name="visibility-modifier"]': "8",
          'select[name="cover-modifier"]': "4",
          'select[name="multiple-targets-modifier"]': "0",
          'select[name="target-movement-modifier"]': "2",
          'select[name="attacker-melee-modifier"]': "0",
          'select[name="attacker-movement-modifier"]': "1",
          'select[name="accessories-modifier"]': "0",
          'select[name="other-modifier"]': "-1",
        });
        this.config.render?.(html);
        void this.config.buttons.roll.callback(html);
        return this;
      }
    };

    const sheet = createSheet(SR2ActorSheet, actor);
    sheet._getAvailablePools = vi.fn(() => []);

    const result = await sheet._showTargetNumberDialog(6, "Ranged Attack", "attack", 4, weapon, {
      autoRangedModifiers: {
        recoilModifier: 3,
        accessoriesModifier: -2,
        calledShotModifier: 4,
      },
    });

    globalThis.Dialog = originalDialog;

    expect(result.rolled).toBe(true);
    expect(result.baseTargetNumber).toBe(4);
    expect(result.tnModifier).toBe(21);
    expect(result.finalTargetNumber).toBe(25);
    expect(actor.rollDice).toHaveBeenCalledWith(6, 25, expect.stringContaining("Base TN 4 +21"), {
      sources: ["base", "base", "base", "base", "base", "base"],
    });
    expect(ChatMessage.create).toHaveBeenCalledWith(
      expect.objectContaining({
        content: expect.stringContaining("Visibility: +8"),
      }),
    );
  });
});
