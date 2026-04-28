/**
 * Extend the basic ActorSheet with Vehicle specific functionality
 */
export class SR2VehicleSheet extends ActorSheet {
  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["shadowrun2e", "sheet", "actor", "vehicle"],
      width: 980,
      height: 720,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "main" }],
    });
  }

  /** @override */
  get template() {
    return "systems/shadowrun2e/templates/actor/vehicle-sheet.html";
  }

  /** @override */
  getData() {
    const context = super.getData();
    const actorData = this.actor.toObject(false);

    context.system = actorData.system;
    context.flags = actorData.flags;

    // Prepare vehicle data
    this._prepareVehicleData(context);

    return context;
  }

  /**
   * Organize and classify Items for Vehicle sheets.
   */
  _prepareVehicleData(context) {
    const gear = [];
    const weapons = [];
    const modifications = [];

    for (let i of context.items) {
      i.img = i.img || "icons/svg/item-bag.svg";

      if (i.type === "weapon") {
        weapons.push(i);
      } else if (i.type === "gear") {
        const category = String(i.system?.category || "").toLowerCase();
        if (
          category === "vehicle modification" ||
          category === "modification" ||
          i.name.toLowerCase().includes("modification") ||
          i.name.toLowerCase().includes("upgrade") ||
          i.name.toLowerCase().includes("enhancement")
        ) {
          modifications.push(i);
        } else {
          gear.push(i);
        }
      } else {
        gear.push(i);
      }
    }

    context.gear = gear;
    context.weapons = weapons;
    context.modifications = modifications;

    // Calculate total weight
    context.totalWeight = context.items.reduce((total, item) => {
      return total + (item.system.weight || 0) * (item.system.quantity || 1);
    }, 0);

    // Determine vehicle type icon
    context.vehicleTypeIcon = this._getVehicleTypeIcon(context.system.vehicleType);
  }

  /**
   * Get appropriate icon for vehicle type
   */
  _getVehicleTypeIcon(vehicleType) {
    const icons = {
      ground: "fas fa-car",
      air: "fas fa-plane",
      water: "fas fa-ship",
      drone: "fas fa-robot",
    };
    return icons[vehicleType] || "fas fa-car";
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.isEditable) return;

    // Add Item
    html.find(".item-create").click(this._onItemCreate.bind(this));

    // Open owned item sheets by clicking the displayed item name or double-clicking a row.
    const openItemSheetFromRow = (rowElement) => {
      const itemId = rowElement?.getAttribute("data-item-id") || rowElement?.dataset?.itemId;
      if (!itemId) return;

      const item = this.actor.items.get(itemId);
      if (!item?.sheet) return;

      try {
        item.sheet.render(true);
      } catch (err) {
        try {
          item.sheet.render({ force: true });
        } catch (err2) {
          console.error("SR2E | Failed to open vehicle item sheet", { itemId, err, err2 });
          ui.notifications.error("Failed to open item sheet. Check console for details.");
        }
      }
    };

    html.find(".item-row .sr2-sheet-item-name span").click((ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      openItemSheetFromRow(ev.currentTarget?.closest?.(".item-row"));
    });

    html.find(".item-row").dblclick((ev) => {
      ev.preventDefault();
      ev.stopPropagation();

      const tag = String(ev.target?.tagName || "").toLowerCase();
      if (["input", "select", "textarea", "button", "a", "label"].includes(tag)) return;
      if (ev.target?.closest?.(".sr2-sheet-actions")) return;

      openItemSheetFromRow(ev.currentTarget);
    });

    // Delete Item
    html.find(".item-delete").click(async (ev) => {
      ev.preventDefault();
      ev.stopPropagation();

      try {
        // Get item ID from button's data attribute or parent element
        const button = $(ev.currentTarget);

        // Try multiple ways to get the item ID
        let itemId =
          button.attr("data-item-id") ||
          button.data("item-id") ||
          button.data("itemId") ||
          button.parents(".item-row").attr("data-item-id") ||
          button.parents(".item-row").data("item-id") ||
          button.parents(".item-row").data("itemId");

        console.log("SR2E | Delete button clicked, itemId:", itemId);
        console.log("SR2E | Button data attributes:", button.get(0).dataset);
        console.log(
          "SR2E | Available items:",
          this.actor.items.map((i) => ({ id: i.id, name: i.name })),
        );

        if (!itemId) {
          console.warn("SR2E | No item ID found for delete operation");
          ui.notifications.error("Could not find item to delete. Check console for details.");
          return;
        }

        const item = this.actor.items.get(itemId);
        if (item) {
          // Confirm deletion
          const confirmDelete =
            game.settings.get("core", "noCanvas") || confirm(`Delete ${item.name}?`);

          if (confirmDelete) {
            await item.delete();
            const row = button.parents(".item-row");
            row.slideUp(200, () => this.render(false));
            ui.notifications.info(`${item.name} deleted successfully.`);
          }
        } else {
          console.warn(`SR2E | Item with ID ${itemId} not found in actor items`);
          console.warn(
            "SR2E | Available item IDs:",
            this.actor.items.map((i) => i.id),
          );
          ui.notifications.error(`Could not find item with ID: ${itemId}`);
        }
      } catch (error) {
        console.error("SR2E | Error deleting item:", error);
        ui.notifications.error("Failed to delete item. Check console for details.");
      }
    });

    // Repair damage
    html.find(".repair-damage").click(this._onRepairDamage.bind(this));

    // Vehicle type change
    html.find('select[name="system.vehicleType"]').change(this._onVehicleTypeChange.bind(this));
  }

  /**
   * Handle creating a new item
   */
  async _onItemCreate(event) {
    event.preventDefault();
    event.stopPropagation();

    if (this._creatingEmbeddedItem) return;

    this._creatingEmbeddedItem = true;
    const createButton = event.currentTarget;
    createButton.setAttribute("aria-disabled", "true");
    const header = event.currentTarget;
    const type = header.dataset.type;
    const data = foundry.utils.deepClone(header.dataset);
    const typeLabel = type ? type.charAt(0).toUpperCase() + type.slice(1) : "Item";
    const name = data.name || `New ${typeLabel}`;
    const itemData = {
      name: name,
      type: type,
      system: data,
    };
    delete itemData.system["type"];
    delete itemData.system["name"];

    try {
      const [created] = await this.actor.createEmbeddedDocuments("Item", [itemData]);
      await this.render(false);
      return created;
    } finally {
      this._creatingEmbeddedItem = false;
      createButton.removeAttribute("aria-disabled");
    }
  }

  /** @override */
  async _onDrop(event) {
    const data = TextEditor.getDragEventData(event);

    // Prevent dropping an owned item from this same actor onto this sheet, which creates duplicates.
    if (data?.type === "Item") {
      const uuid = data.uuid ?? data.data?.uuid;
      if (uuid && this.actor?.uuid && uuid.startsWith(`${this.actor.uuid}.Item.`)) {
        event.preventDefault();
        event.stopPropagation();
        return false;
      }
    }

    return super._onDrop(event);
  }

  /** @override */
  async _updateObject(event, formData) {
    const actorUpdates = {};
    const itemUpdates = {};

    for (const [key, value] of Object.entries(formData)) {
      const match = key.match(/^items\.([^.]+)\.(.+)$/);
      if (match) {
        const itemId = match[1];
        const itemPath = match[2];
        itemUpdates[itemId] ||= {};
        itemUpdates[itemId][itemPath] = value;
        continue;
      }

      actorUpdates[key] = value;
    }

    for (const [itemId, updateData] of Object.entries(itemUpdates)) {
      const item = this.actor.items.get(itemId);
      if (!item) continue;

      for (const [path, value] of Object.entries(updateData)) {
        if (path === "name") continue;
        if (path.startsWith("system.")) updateData[path] = this._coerceItemFieldValue(path, value);
      }

      await item.update(updateData);
    }

    if (Object.keys(actorUpdates).length > 0) {
      await this.actor.update(actorUpdates);
    }

    return true;
  }

  _coerceItemFieldValue(path, value) {
    const numericFields = new Set([
      "system.ammo.current",
      "system.ammo.max",
      "system.price",
      "system.quantity",
      "system.rating",
      "system.weight",
    ]);

    if (!numericFields.has(path)) return value;

    const parsed = path === "system.weight" ? parseFloat(value) : parseInt(value, 10);
    if (!Number.isFinite(parsed)) return path === "system.quantity" ? 1 : 0;
    if (path === "system.quantity") return Math.max(1, parsed);
    return Math.max(0, parsed);
  }

  /**
   * Handle repairing vehicle damage
   */
  async _onRepairDamage(event) {
    event.preventDefault();
    const repairAmount = parseInt(event.currentTarget.dataset.amount) || 1;
    const currentDamage = this.actor.system.health.value;
    const newDamage = Math.max(0, currentDamage - repairAmount);

    await this.actor.update({ "system.health.value": newDamage });

    if (repairAmount === 1) {
      ui.notifications.info(`Repaired 1 point of vehicle damage.`);
    } else {
      ui.notifications.info(`Fully repaired vehicle damage.`);
    }
  }

  /**
   * Handle vehicle type change
   */
  async _onVehicleTypeChange(event) {
    event.preventDefault();
    this.render(false);
  }
}
