import { beforeEach, describe, expect, it, vi } from "vitest";

async function loadVehicleSheetClass() {
  vi.resetModules();
  globalThis.ActorSheet =
    globalThis.ActorSheet ||
    class ActorSheet {
      constructor(actor) {
        this.actor = actor;
        this.object = actor;
      }

      static get defaultOptions() {
        return {};
      }
    };

  const module = await import("../../../scripts/actor/vehicle-sheet.js");
  return module.SR2VehicleSheet;
}

function createItemCollection(items = []) {
  const storage = new Map(items.map((item) => [item.id, item]));
  return {
    get(id) {
      return storage.get(id);
    },
    map(callback) {
      return Array.from(storage.values()).map(callback);
    },
    filter(callback) {
      return Array.from(storage.values()).filter(callback);
    },
    [Symbol.iterator]() {
      return storage.values();
    },
  };
}

describe("SR2VehicleSheet", () => {
  beforeEach(() => {
    ui.notifications.error.mockClear();
  });

  it("creates vehicle modifications as categorized gear", async () => {
    const SR2VehicleSheet = await loadVehicleSheetClass();
    const createdItems = [];
    const actor = {
      items: createItemCollection(),
      createEmbeddedDocuments: vi.fn(async (type, documents) => {
        expect(type).toBe("Item");
        createdItems.push(...documents);
        return documents;
      }),
    };

    const sheet = Object.create(SR2VehicleSheet.prototype);
    sheet.actor = actor;
    sheet.render = vi.fn(async () => {});

    const created = await sheet._onItemCreate({
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
      currentTarget: {
        dataset: {
          type: "gear",
          name: "New Modification",
          category: "Vehicle Modification",
        },
        setAttribute: vi.fn(),
        removeAttribute: vi.fn(),
      },
    });

    expect(created).toEqual(
      expect.objectContaining({
        name: "New Modification",
        type: "gear",
        system: expect.objectContaining({ category: "Vehicle Modification" }),
      }),
    );
    expect(createdItems[0].system.name).toBeUndefined();
    expect(createdItems[0].system.type).toBeUndefined();
  });

  it("classifies categorized modifications separately from normal gear", async () => {
    const SR2VehicleSheet = await loadVehicleSheetClass();
    const sheet = Object.create(SR2VehicleSheet.prototype);
    const context = {
      items: [
        {
          id: "gear-1",
          name: "Tool Kit",
          type: "gear",
          system: { category: "Vehicle Gear", quantity: 1, weight: 2 },
        },
        {
          id: "mod-1",
          name: "Improved Suspension",
          type: "gear",
          system: { category: "Vehicle Modification", quantity: 1, weight: 0 },
        },
      ],
      system: { vehicleType: "drone" },
    };

    sheet._prepareVehicleData(context);

    expect(context.gear.map((item) => item.id)).toEqual(["gear-1"]);
    expect(context.modifications.map((item) => item.id)).toEqual(["mod-1"]);
  });

  it("saves inline embedded item edits from the vehicle sheet", async () => {
    const SR2VehicleSheet = await loadVehicleSheetClass();
    const item = {
      id: "gear-1",
      name: "New Gear",
      system: { quantity: 1, weight: 0 },
      update: vi.fn(async (changes) => {
        if (changes.name !== undefined) item.name = changes.name;
        for (const [path, value] of Object.entries(changes)) {
          if (path === "name") continue;
          foundry.utils.setProperty(item, path, value);
        }
      }),
    };
    const actor = {
      items: createItemCollection([item]),
      update: vi.fn(async () => {}),
    };

    const sheet = Object.create(SR2VehicleSheet.prototype);
    sheet.actor = actor;

    await sheet._updateObject(
      {},
      {
        "items.gear-1.name": "Drone Sensor Pod",
        "items.gear-1.system.quantity": "2",
        "items.gear-1.system.weight": "1.5",
      },
    );

    expect(item.update).toHaveBeenCalledWith({
      name: "Drone Sensor Pod",
      "system.quantity": 2,
      "system.weight": 1.5,
    });
    expect(item.name).toBe("Drone Sensor Pod");
    expect(item.system.quantity).toBe(2);
    expect(item.system.weight).toBe(1.5);
  });
});
