import { beforeEach, describe, expect, it } from "vitest";

import { sr2DelayEncounterAction, SR2Combat } from "../../../scripts/combat/sr2-combat.js";

function createActor({
  id,
  reaction = 6,
  initiativeBase = reaction,
  mockInitiativeTotal = 16,
} = {}) {
  const actor = {
    id,
    system: {
      initiative: {
        base: initiativeBase,
        current: 0,
      },
      attributes: {
        reaction: { value: reaction },
      },
    },
    _mockInitiativeTotal: mockInitiativeTotal,
  };
  game.actors.__set(actor);
  return actor;
}

async function createCombatWithActors(actorConfigs) {
  const combat = await SR2Combat.create({ scene: "scene-1", active: true });
  const combatants = [];

  for (const actorConfig of actorConfigs) {
    const actor = createActor(actorConfig);
    const [combatant] = await combat.createEmbeddedDocuments("Combatant", [
      {
        actorId: actor.id,
        tokenId: `${actor.id}-token`,
      },
    ]);
    combatants.push(combatant);
  }

  return { combat, combatants };
}

describe("SR2Combat", () => {
  beforeEach(() => {
    game.actors.__clear();
    game.combats.__clear();
    CONFIG.Combat.documentClass = SR2Combat;
  });

  it("advances a single combatant through multiple phases and rerolls next round", async () => {
    const { combat, combatants } = await createCombatWithActors([
      { id: "sam", reaction: 8, initiativeBase: 8, mockInitiativeTotal: 23 },
    ]);

    await combat.rollInitiative([combatants[0].id]);

    expect(foundry.utils.getProperty(combat, "flags.shadowrun2e.sr2.currentPhase")).toBe(23);

    await combat.nextTurn();
    expect(foundry.utils.getProperty(combat, "flags.shadowrun2e.sr2.currentPhase")).toBe(13);

    await combat.nextTurn();
    expect(foundry.utils.getProperty(combat, "flags.shadowrun2e.sr2.currentPhase")).toBe(3);

    await combat.nextTurn();
    expect(combat.round).toBe(2);
    expect(foundry.utils.getProperty(combat, "flags.shadowrun2e.sr2.currentPhase")).toBe(23);
  });

  it("orders tied combatants by adjusted reaction for resolution and reverse for declarations", async () => {
    const { combat, combatants } = await createCombatWithActors([
      { id: "sam", reaction: 8, initiativeBase: 8, mockInitiativeTotal: 17 },
      { id: "mage", reaction: 6, initiativeBase: 6, mockInitiativeTotal: 17 },
    ]);

    await combat.rollInitiative(combatants.map((combatant) => combatant.id));

    expect(combat.turns[0].actorId).toBe("sam");
    expect(foundry.utils.getProperty(combat, "flags.shadowrun2e.sr2.resolutionOrderIds")).toEqual([
      combatants[0].id,
      combatants[1].id,
    ]);
    expect(foundry.utils.getProperty(combat, "flags.shadowrun2e.sr2.declarationOrderIds")).toEqual([
      combatants[1].id,
      combatants[0].id,
    ]);
  });

  it("breaks ties by natural reaction when adjusted reactions match", async () => {
    const { combat, combatants } = await createCombatWithActors([
      { id: "wired", reaction: 8, initiativeBase: 7, mockInitiativeTotal: 17 },
      { id: "mundane", reaction: 6, initiativeBase: 7, mockInitiativeTotal: 17 },
    ]);

    await combat.rollInitiative(combatants.map((combatant) => combatant.id));

    expect(combat.turns[0].actorId).toBe("wired");
    expect(foundry.utils.getProperty(combat, "flags.shadowrun2e.sr2.resolutionOrderIds")).toEqual([
      combatants[0].id,
      combatants[1].id,
    ]);
  });

  it("advances to the next actor within the same phase before dropping phases", async () => {
    const { combat, combatants } = await createCombatWithActors([
      { id: "sam", reaction: 8, initiativeBase: 8, mockInitiativeTotal: 19 },
      { id: "adept", reaction: 7, initiativeBase: 7, mockInitiativeTotal: 17 },
    ]);

    await combat.rollInitiative(combatants.map((combatant) => combatant.id));
    await combat.nextTurn();

    expect(foundry.utils.getProperty(combat, "flags.shadowrun2e.sr2.currentPhase")).toBe(17);
    expect(combat.combatant.actorId).toBe("adept");
  });

  it("supports delayed actions and resumes from delayed phase minus ten", async () => {
    const { combat, combatants } = await createCombatWithActors([
      { id: "adept", reaction: 9, initiativeBase: 9, mockInitiativeTotal: 24 },
    ]);

    await combat.rollInitiative([combatants[0].id]);
    await sr2DelayEncounterAction({ combat, combatant: combatants[0], toPhase: 13 });

    expect(foundry.utils.getProperty(combat, "flags.shadowrun2e.sr2.currentPhase")).toBe(13);

    await combat.nextTurn();

    const flags = foundry.utils.getProperty(combatants[0], "flags.shadowrun2e.sr2");
    expect(flags.nextActionPhase).toBe(3);
    expect(foundry.utils.getProperty(combat, "flags.shadowrun2e.sr2.currentPhase")).toBe(3);
  });

  it("prioritizes delayed combatants ahead of normal actions in the chosen phase", async () => {
    const { combat, combatants } = await createCombatWithActors([
      { id: "delayer", reaction: 7, initiativeBase: 7, mockInitiativeTotal: 23 },
      { id: "normal", reaction: 8, initiativeBase: 8, mockInitiativeTotal: 13 },
    ]);

    await combat.rollInitiative(combatants.map((combatant) => combatant.id));
    await sr2DelayEncounterAction({ combat, combatant: combatants[0], toPhase: 13 });

    expect(foundry.utils.getProperty(combat, "flags.shadowrun2e.sr2.currentPhase")).toBe(13);
    expect(combat.combatant.actorId).toBe("delayer");
    expect(foundry.utils.getProperty(combat, "flags.shadowrun2e.sr2.resolutionOrderIds")).toEqual([
      combatants[0].id,
      combatants[1].id,
    ]);
  });

  it("ignores invalid delay requests that are not below the current phase", async () => {
    const { combat, combatants } = await createCombatWithActors([
      { id: "sam", reaction: 8, initiativeBase: 8, mockInitiativeTotal: 20 },
    ]);

    await combat.rollInitiative([combatants[0].id]);
    await sr2DelayEncounterAction({ combat, combatant: combatants[0], toPhase: 20 });
    await sr2DelayEncounterAction({ combat, combatant: combatants[0], toPhase: 0 });

    const flags = foundry.utils.getProperty(combatants[0], "flags.shadowrun2e.sr2");
    expect(flags.delayedToPhase).toBeNull();
    expect(flags.nextActionPhase).toBe(20);
  });

  it("keeps running when a combatant is removed mid-round", async () => {
    const { combat, combatants } = await createCombatWithActors([
      { id: "sam", reaction: 8, initiativeBase: 8, mockInitiativeTotal: 21 },
      { id: "guard", reaction: 5, initiativeBase: 5, mockInitiativeTotal: 11 },
    ]);

    await combat.rollInitiative(combatants.map((combatant) => combatant.id));
    await combat.nextTurn();
    await combat.deleteEmbeddedDocuments("Combatant", [combatants[1].id]);
    await combat.nextTurn();

    expect(combat.combatants).toHaveLength(1);
    expect(foundry.utils.getProperty(combat, "flags.shadowrun2e.sr2.currentPhase")).toBe(1);
  });

  it("leaves late-joining combatants inactive until explicitly rolled", async () => {
    const { combat, combatants } = await createCombatWithActors([
      { id: "sam", reaction: 8, initiativeBase: 8, mockInitiativeTotal: 18 },
    ]);

    await combat.rollInitiative([combatants[0].id]);
    const lateActor = createActor({
      id: "late",
      reaction: 6,
      initiativeBase: 6,
      mockInitiativeTotal: 12,
    });
    const [lateCombatant] = await combat.createEmbeddedDocuments("Combatant", [
      {
        actorId: lateActor.id,
        tokenId: "late-token",
      },
    ]);

    expect(foundry.utils.getProperty(lateCombatant, "flags.shadowrun2e.sr2")).toBeUndefined();

    await combat.rollInitiative([lateCombatant.id]);

    expect(foundry.utils.getProperty(lateCombatant, "flags.shadowrun2e.sr2.rolledInitiative")).toBe(
      12,
    );
  });

  it("ignores actorless combatants when rerolling a new combat turn", async () => {
    const { combat, combatants } = await createCombatWithActors([
      { id: "sam", reaction: 8, initiativeBase: 8, mockInitiativeTotal: 11 },
    ]);
    const [actorless] = await combat.createEmbeddedDocuments("Combatant", [
      {
        tokenId: "actorless-token",
      },
    ]);

    await combat.rollInitiative([combatants[0].id]);
    await combat.nextTurn();
    await combat.nextTurn();

    expect(combat.round).toBe(2);
    expect(
      foundry.utils.getProperty(actorless, "flags.shadowrun2e.sr2.nextActionPhase"),
    ).toBeNull();
    expect(foundry.utils.getProperty(actorless, "flags.shadowrun2e.sr2.rolledInitiative")).toBe(0);
    expect(foundry.utils.getProperty(combat, "flags.shadowrun2e.sr2.currentPhase")).toBe(11);
  });

  it("clears encounter phase state when advancing an empty combat", async () => {
    const combat = await SR2Combat.create({ scene: "scene-1", active: true });

    await combat.nextTurn();

    expect(combat.turn).toBeNull();
    expect(foundry.utils.getProperty(combat, "flags.shadowrun2e.sr2")).toEqual({
      currentPhase: null,
      roundNumber: 1,
      declarationPhaseOpen: false,
      resolutionPhaseOpen: false,
      declarationOrderIds: [],
      resolutionOrderIds: [],
    });
  });

  it("rerolls all eligible combatants when nextRound is requested", async () => {
    const { combat, combatants } = await createCombatWithActors([
      { id: "sam", reaction: 8, initiativeBase: 8, mockInitiativeTotal: 21 },
      { id: "mage", reaction: 6, initiativeBase: 6, mockInitiativeTotal: 14 },
    ]);

    await combat.rollInitiative(combatants.map((combatant) => combatant.id));
    combatants[0].actor._mockInitiativeTotal = 12;
    combatants[1].actor._mockInitiativeTotal = 9;

    await combat.nextRound();

    expect(combat.round).toBe(2);
    expect(foundry.utils.getProperty(combatants[0], "flags.shadowrun2e.sr2.rolledInitiative")).toBe(
      12,
    );
    expect(foundry.utils.getProperty(combatants[1], "flags.shadowrun2e.sr2.rolledInitiative")).toBe(
      9,
    );
    expect(foundry.utils.getProperty(combat, "flags.shadowrun2e.sr2.currentPhase")).toBe(12);
  });
});
