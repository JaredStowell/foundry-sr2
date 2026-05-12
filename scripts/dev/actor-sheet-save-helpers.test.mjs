import test from "node:test";
import assert from "node:assert/strict";

import {
  sr2BuildLifestyleUpdatesFromFormFields,
  sr2CreateDirtyFieldState,
  sr2FilterUpdatesToDirtyFields,
  sr2MarkDirtyField,
} from "../actor/actor-sheet-save-helpers.js";

test("filters full sheet submit data down to fields changed in this sheet instance", () => {
  const dirty = sr2CreateDirtyFieldState();
  sr2MarkDirtyField(dirty, "system.biography");
  sr2MarkDirtyField(dirty, "items.skill-1.system.allocatedRating");

  const filtered = sr2FilterUpdatesToDirtyFields({
    actorUpdates: {
      "name": "Stale Name",
      "system.biography": "New notes",
      "system.resources.nuyen": 1200,
    },
    itemUpdates: {
      "skill-1": {
        "name": "Stale Skill Name",
        "system.allocatedRating": 4,
      },
      "gear-1": {
        "system.quantity": 2,
      },
    },
    dirty,
  });

  assert.deepEqual(filtered.actorUpdates, {
    "system.biography": "New notes",
  });
  assert.deepEqual(filtered.itemUpdates, {
    "skill-1": {
      "system.allocatedRating": 4,
    },
  });
});

test("empty dirty state prevents stale close submits from updating actor data", () => {
  const dirty = sr2CreateDirtyFieldState();

  const filtered = sr2FilterUpdatesToDirtyFields({
    actorUpdates: {
      "system.biography": "Old notes",
      "system.resources.nuyen": 500,
    },
    itemUpdates: {},
    dirty,
  });

  assert.deepEqual(filtered.actorUpdates, {});
  assert.deepEqual(filtered.itemUpdates, {});
});

test("partial lifestyle form updates preserve untouched lifestyle entries", () => {
  const result = sr2BuildLifestyleUpdatesFromFormFields(
    {
      "system.resources.lifestyles.1.months": "3",
    },
    [
      { type: "street", months: 1 },
      { type: "middle", months: 1 },
    ],
  );

  assert.deepEqual(result, {
    changed: true,
    lifestyles: [
      { type: "street", months: 1 },
      { type: "middle", months: 3 },
    ],
    primaryType: "street",
    primaryMonths: 1,
    indexedKeys: ["system.resources.lifestyles.1.months"],
  });
});
