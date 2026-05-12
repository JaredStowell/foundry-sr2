import { beforeEach, describe, expect, it, vi } from "vitest";

class MockTypeDataModel {}

class MockField {
  constructor(options = {}) {
    this.options = options;
  }
}

class MockArrayField extends MockField {
  constructor(element, options = {}) {
    super(options);
    this.element = element;
  }
}

class MockSchemaField extends MockField {
  constructor(fields = {}, options = {}) {
    super(options);
    this.fields = fields;
  }
}

function installFieldMocks() {
  globalThis.foundry.abstract = { TypeDataModel: MockTypeDataModel };
  globalThis.foundry.data = {
    fields: {
      ArrayField: MockArrayField,
      BooleanField: MockField,
      HTMLField: MockField,
      NumberField: MockField,
      ObjectField: MockField,
      SchemaField: MockSchemaField,
      StringField: MockField,
    },
  };
}

describe("SR2 TypeDataModel registration maps", () => {
  beforeEach(() => {
    vi.resetModules();
    installFieldMocks();
  });

  it("exports a data model for each Actor and Item subtype", async () => {
    const { SR2_ACTOR_DATA_MODELS, SR2_ITEM_DATA_MODELS } = await import(
      "../../scripts/data-models.js"
    );

    expect(Object.keys(SR2_ACTOR_DATA_MODELS)).toEqual([
      "character",
      "contact",
      "follower",
      "cyberdeck",
      "vehicle",
      "spirit",
      "critter",
      "ic",
    ]);
    expect(Object.keys(SR2_ITEM_DATA_MODELS)).toEqual([
      "skill",
      "weapon",
      "armor",
      "gear",
      "cyberware",
      "bioware",
      "spell",
      "adeptpower",
      "contact",
      "program",
      "totem",
    ]);
  });

  it("preserves important template defaults in generated schemas", async () => {
    const { SR2_ACTOR_DATA_MODELS, SR2_ITEM_DATA_MODELS } = await import(
      "../../scripts/data-models.js"
    );

    const characterSchema = SR2_ACTOR_DATA_MODELS.character.defineSchema();
    expect(characterSchema.biography).toBeInstanceOf(MockField);
    expect(characterSchema.biography.options.initial).toBe("");
    expect(characterSchema.resources).toBeInstanceOf(MockSchemaField);
    expect(characterSchema.resources.fields.lifestyle.options.initial).toBe("street");
    expect(characterSchema.resources.fields.lifestyles).toBeInstanceOf(MockArrayField);

    const spellSchema = SR2_ITEM_DATA_MODELS.spell.defineSchema();
    expect(spellSchema.description).toBeInstanceOf(MockField);
    expect(spellSchema.description.options.initial).toBe("");
    expect(spellSchema.spellLock.fields.assigned.options.initial).toBe(false);
    expect(spellSchema.spellLock.fields.enabled.options.initial).toBe(false);
  });
});
