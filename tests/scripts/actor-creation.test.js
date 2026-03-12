import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  sr2AreBuddiesDisabled,
  sr2BuildContactBiographyFallback,
  sr2ExtractContactStoryFromGuide,
  sr2GetAllowedMetatypesForPriority,
  sr2GetContactLevelsSummaryForLeader,
  sr2RepairLegacySkillAllocatedRatings,
  sr2SyncFreeLanguageSkills,
} from "../../scripts/actor-creation.js";

function installSettings(values = {}) {
  game.settings = {
    get: vi.fn((scope, key) => {
      expect(scope).toBe("shadowrun2e");
      return values[key];
    }),
  };
}

beforeEach(() => {
  game.actors.__clear();
  installSettings();
});

describe("sr2GetAllowedMetatypesForPriority", () => {
  it("uses SR2 defaults when the house rule is off", () => {
    installSettings({ moreMetahumans: false });

    expect(sr2GetAllowedMetatypesForPriority("A")).toEqual([
      "human",
      "elf",
      "dwarf",
      "ork",
      "troll",
    ]);
    expect(sr2GetAllowedMetatypesForPriority("B")).toEqual(["human"]);
    expect(sr2GetAllowedMetatypesForPriority("Z")).toBeNull();
  });

  it("allows metahumans through priority C with the house rule on", () => {
    installSettings({ moreMetahumans: true });

    expect(sr2GetAllowedMetatypesForPriority("C")).toEqual([
      "human",
      "elf",
      "dwarf",
      "ork",
      "troll",
    ]);
    expect(sr2GetAllowedMetatypesForPriority("D")).toEqual(["human"]);
  });
});

describe("sr2AreBuddiesDisabled", () => {
  it("treats contact levels as an implicit buddy disable", () => {
    installSettings({ contactLevels: true, disableBuddies: false });
    expect(sr2AreBuddiesDisabled()).toBe(true);

    installSettings({ contactLevels: false, disableBuddies: true });
    expect(sr2AreBuddiesDisabled()).toBe(true);
  });
});

describe("sr2GetContactLevelsSummaryForLeader", () => {
  it("includes existing contacts plus a pending contact update", () => {
    installSettings({ contactLevels: true });

    const leader = {
      id: "leader-1",
      type: "character",
      system: {
        attributes: {
          charisma: { value: 3 },
        },
      },
    };

    game.actors.__set({
      id: "contact-1",
      type: "contact",
      sort: 10,
      system: {
        details: {
          leaderId: "leader-1",
          contactLevel: 1,
        },
      },
    });
    game.actors.__set({
      id: "contact-2",
      type: "contact",
      sort: 20,
      system: {
        details: {
          leaderId: "leader-1",
          contactLevel: 2,
        },
      },
    });

    const summary = sr2GetContactLevelsSummaryForLeader(leader, {
      id: "contact-2",
      sort: 20,
      contactLevel: 3,
    });

    expect(summary.counts.totalContacts).toBe(2);
    expect(summary.counts.totalLevel3).toBe(1);
    expect(summary.costs.contactsTotalCost).toBeGreaterThan(0);
  });

  it("returns null when the actor is not a character or the rule is disabled", () => {
    installSettings({ contactLevels: false });
    expect(sr2GetContactLevelsSummaryForLeader({ type: "character", id: "x" })).toBeNull();

    installSettings({ contactLevels: true });
    expect(sr2GetContactLevelsSummaryForLeader({ type: "contact", id: "x" })).toBeNull();
  });
});

describe("sr2SyncFreeLanguageSkills", () => {
  it("creates native and dialect language skills for street-level actors", async () => {
    const actor = {
      type: "character",
      system: {
        details: {
          nativeLanguage: "Spanish",
          dialectLanguage: "City Speak",
        },
        resources: {
          lifestyle: "street",
        },
        attributes: {
          intelligence: { value: 4 },
        },
      },
      items: [],
      updateEmbeddedDocuments: vi.fn(),
      createEmbeddedDocuments: vi.fn(),
    };

    await sr2SyncFreeLanguageSkills(actor);

    expect(actor.updateEmbeddedDocuments).not.toHaveBeenCalled();
    expect(actor.createEmbeddedDocuments).toHaveBeenCalledTimes(1);
    const [, created] = actor.createEmbeddedDocuments.mock.calls[0];
    expect(created).toHaveLength(2);
    expect(created.map((item) => item.name)).toEqual(["Spanish", "City Speak"]);
    expect(created.map((item) => item.system.allocatedRating)).toEqual([6, 2]);
  });
});

describe("sr2ExtractContactStoryFromGuide", () => {
  it("trims the section and prepends a missing heading", () => {
    const archetype = {
      guide: {
        startLine: 2,
        prependHeading: "CITY OFFICIAL",
      },
    };
    const lines = ["", "Lives inside the arcology.", "", "", "Knows everyone.", "ATTRIBUTES"];

    expect(sr2ExtractContactStoryFromGuide(archetype, lines)).toBe(
      ["CITY OFFICIAL", "", "Lives inside the arcology.", "", "Knows everyone."].join("\n"),
    );
  });
});

describe("sr2BuildContactBiographyFallback", () => {
  it("summarizes source, skills, cyberware, and magic", () => {
    const biography = sr2BuildContactBiographyFallback({
      label: "Fixer",
      source: { book: "SR2", page: 206 },
      skills: [{ baseSkill: "Negotiation" }, { baseSkill: "Etiquette: Street" }],
      cyberware: ["Datajack"],
      magic: { awakened: true, tradition: "hermetic" },
    });

    expect(biography).toContain("FIXER");
    expect(biography).toContain("Source: SR2, p. 206");
    expect(biography).toContain("Typical Skills: Negotiation, Etiquette: Street");
    expect(biography).toContain("Typical Cyberware: Datajack");
    expect(biography).toContain("Magical: Yes (hermetic)");
  });
});

describe("sr2RepairLegacySkillAllocatedRatings", () => {
  it("fills allocated ratings for plain legacy skills only", async () => {
    const items = [
      {
        id: "skill-1",
        type: "skill",
        system: { allocatedRating: 0, baseRating: 4, concentration: "", specialization: "" },
      },
      {
        id: "skill-2",
        type: "skill",
        system: { allocatedRating: 0, baseRating: 5, concentration: "Pistols", specialization: "" },
      },
      {
        id: "gear-1",
        type: "gear",
        system: {},
      },
    ];
    items.size = items.length;

    const actor = {
      items,
      updateEmbeddedDocuments: vi.fn(),
    };

    await sr2RepairLegacySkillAllocatedRatings(actor);

    expect(actor.updateEmbeddedDocuments).toHaveBeenCalledTimes(1);
    expect(actor.updateEmbeddedDocuments).toHaveBeenCalledWith(
      "Item",
      [{ _id: "skill-1", "system.allocatedRating": 4 }],
      { sr2SkipBudget: true },
    );
  });
});
