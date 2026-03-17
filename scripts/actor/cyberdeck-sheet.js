/**
 * Extend the basic ActorSheet with Cyberdeck specific functionality
 */
export class SR2CyberdeckSheet extends ActorSheet {
  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["shadowrun2e", "sheet", "actor", "cyberdeck"],
      width: 960,
      height: 720,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "main" }],
    });
  }

  /** @override */
  get template() {
    return "systems/shadowrun2e/templates/actor/cyberdeck-sheet.html";
  }

  /** @override */
  getData() {
    const context = super.getData();
    const actorData = this.actor.toObject(false);

    context.system = actorData.system;
    context.flags = actorData.flags;

    // Prepare cyberdeck data
    this._prepareCyberdeckData(context);

    return context;
  }

  /**
   * Organize and classify Items for Cyberdeck sheets.
   */
  _prepareCyberdeckData(context) {
    const programs = [];

    for (let i of context.items) {
      i.img = i.img || "icons/svg/item-bag.svg";

      if (i.type === "program") {
        programs.push(i);
      }
    }

    context.programs = programs;

    // Calculate program memory sizes dynamically
    programs.forEach((program) => {
      const rating = program.system.rating || 1;
      const multiplier = program.system.multiplier || 1;
      program.system.calculatedSize = rating * rating * multiplier;
    });

    // Calculate memory and storage usage
    context.memoryUsed = programs
      .filter((p) => p.system.isLoaded)
      .reduce((total, p) => total + (p.system.calculatedSize || p.system.memorySize || 0), 0);

    context.storageUsed = programs.reduce(
      (total, p) => total + (p.system.calculatedSize || p.system.memorySize || 0),
      0,
    );

    // Update the actor's memory and storage usage
    context.system.memory.used = context.memoryUsed;
    context.system.storage.used = context.storageUsed;

    // Calculate available memory and storage
    context.memoryAvailable = context.system.memory.total - context.memoryUsed;
    context.storageAvailable = context.system.storage.total - context.storageUsed;

    // Persona programs (Body/Evasion/Masking/Sensors) are allocated under a cap of MPCP * 3.
    const mpcp = Math.max(1, parseInt(context.system?.persona, 10) || 1);
    const maxTotal = mpcp * 3;
    const personaPrograms =
      context.system?.personaPrograms && typeof context.system.personaPrograms === "object"
        ? context.system.personaPrograms
        : { body: 0, evasion: 0, masking: 0, sensors: 0 };
    context.system.personaPrograms = personaPrograms;
    const keys = ["body", "evasion", "masking", "sensors"];
    let total = 0;
    for (const key of keys) {
      const value = Math.max(0, parseInt(personaPrograms?.[key], 10) || 0);
      total += value;
    }
    context.personaProgramMax = maxTotal;
    context.personaProgramTotal = total;
    context.personaProgramRemaining = Math.max(0, maxTotal - total);
    context.personaProgramOver = total > maxTotal;
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.isEditable) return;

    // Add Program
    html.find(".item-create").click(this._onItemCreate.bind(this));

    // Delete Program
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
          button.parents(".program-row, .item-row").attr("data-item-id") ||
          button.parents(".program-row, .item-row").data("item-id") ||
          button.parents(".program-row, .item-row").data("itemId");

        console.log("SR2E | Delete program button clicked, itemId:", itemId);
        console.log("SR2E | Button data attributes:", button.get(0).dataset);
        console.log(
          "SR2E | Available programs:",
          this.actor.items
            .filter((i) => i.type === "program")
            .map((i) => ({ id: i.id, name: i.name })),
        );

        if (!itemId) {
          console.warn("SR2E | No item ID found for delete operation");
          ui.notifications.error("Could not find program to delete. Check console for details.");
          return;
        }

        const item = this.actor.items.get(itemId);
        if (item) {
          // Confirm deletion
          const confirmDelete =
            game.settings.get("core", "noCanvas") || confirm(`Delete ${item.name}?`);

          if (confirmDelete) {
            await item.delete();
            const row = button.parents(".program-row, .item, .item-row");
            row.slideUp(200, () => this.render(false));
            ui.notifications.info(`${item.name} deleted successfully.`);
          }
        } else {
          console.warn(`SR2E | Program with ID ${itemId} not found in actor items`);
          console.warn(
            "SR2E | Available program IDs:",
            this.actor.items.filter((i) => i.type === "program").map((i) => i.id),
          );
          ui.notifications.error(`Could not find program with ID: ${itemId}`);
        }
      } catch (error) {
        console.error("SR2E | Error deleting program:", error);
        ui.notifications.error("Failed to delete program. Check console for details.");
      }
    });

    // Toggle program loaded/active status
    html.find(".program-toggle").click(this._onProgramToggle.bind(this));

    // Program rating change - recalculate size
    html.find('input[name*="system.rating"]').change(this._onProgramRatingChange.bind(this));

    // Browse programs
    html.find(".browse-items").click(this._onBrowsePrograms.bind(this));

    // Repair damage
    html.find(".repair-damage").click(this._onRepairDamage.bind(this));

    // Persona program allocation validation
    html.find('input[name="system.persona"]').change(this._onPersonaMpcpChange.bind(this));
    html
      .find('input[name^="system.personaPrograms."]')
      .change(this._onPersonaProgramChange.bind(this));
  }

  async _onPersonaProgramChange(event) {
    event.preventDefault();
    const input = event.currentTarget;
    const name = String(input?.name || "");
    const match = name.match(/^system\\.personaPrograms\\.(body|evasion|masking|sensors)$/);
    if (!match) return;

    const key = match[1];
    const keys = ["body", "evasion", "masking", "sensors"];

    const mpcp = Math.max(1, parseInt(this.actor.system?.persona, 10) || 1);
    const maxTotal = mpcp * 3;

    const current = this.actor.system?.personaPrograms || {};
    const otherSum = keys
      .filter((k) => k !== key)
      .reduce((sum, k) => sum + Math.max(0, parseInt(current?.[k], 10) || 0), 0);

    let next = parseInt(input.value, 10);
    if (!Number.isFinite(next)) next = 0;
    next = Math.max(0, next);

    const allowed = Math.max(0, maxTotal - otherSum);
    if (next > allowed) next = allowed;
    if (String(input.value) !== String(next)) input.value = String(next);

    await this.actor.update({ [`system.personaPrograms.${key}`]: next });
    this.render(false);
  }

  async _onPersonaMpcpChange(event) {
    event.preventDefault();
    const input = event.currentTarget;

    let mpcp = parseInt(input.value, 10);
    if (!Number.isFinite(mpcp)) mpcp = 1;
    mpcp = Math.max(1, mpcp);

    const maxTotal = mpcp * 3;
    const keys = ["body", "evasion", "masking", "sensors"];
    const current = this.actor.system?.personaPrograms || {};
    const values = {};
    let total = 0;
    for (const key of keys) {
      const value = Math.max(0, parseInt(current?.[key], 10) || 0);
      values[key] = value;
      total += value;
    }

    const updates = { "system.persona": mpcp };
    if (total > maxTotal) {
      let overflow = total - maxTotal;
      for (const key of ["sensors", "masking", "evasion", "body"]) {
        if (overflow <= 0) break;
        const value = values[key];
        const reduction = Math.min(value, overflow);
        values[key] = value - reduction;
        overflow -= reduction;
      }

      for (const key of keys) {
        if (values[key] !== Math.max(0, parseInt(current?.[key], 10) || 0)) {
          updates[`system.personaPrograms.${key}`] = values[key];
        }
      }

      ui.notifications.warn("Persona program total exceeded MPCP×3; values were clamped.");
    }

    await this.actor.update(updates);
    this.render(false);
  }

  /**
   * Handle creating a new program
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
    const name = `New ${typeLabel}`;
    const itemData = {
      name: name,
      type: type,
      system: data,
    };
    delete itemData.system["type"];

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

  /**
   * Handle toggling program loaded/active status
   */
  async _onProgramToggle(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const programId = element.dataset.programId;
    const toggleType = element.dataset.toggle;
    const program = this.actor.items.get(programId);

    if (!program) return;

    const updateData = {};

    if (toggleType === "loaded") {
      updateData["system.isLoaded"] = !program.system.isLoaded;

      // If unloading, also deactivate
      if (program.system.isLoaded) {
        updateData["system.isActive"] = false;
      }
    } else if (toggleType === "active") {
      // Can only activate if loaded
      if (program.system.isLoaded) {
        updateData["system.isActive"] = !program.system.isActive;
      } else {
        ui.notifications.warn("Program must be loaded before it can be activated.");
        return;
      }
    }

    await program.update(updateData);
    this.render(false);
  }

  /**
   * Handle program rating change - recalculate memory size
   */
  async _onProgramRatingChange(event) {
    event.preventDefault();
    const input = event.currentTarget;
    const programId = input.name.match(/items\.(.+?)\.system\.rating/)[1];
    const program = this.actor.items.get(programId);

    if (!program) return;

    const newRating = parseInt(input.value) || 1;
    const multiplier = program.system.multiplier || 1;
    const newMemorySize = newRating * newRating * multiplier;

    // Update both rating and calculated memory size
    await program.update({
      "system.rating": newRating,
      "system.memorySize": newMemorySize,
    });

    // Re-render to update memory usage displays
    this.render(false);
  }

  /**
   * Handle browsing programs and VR programs
   */
  async _onBrowsePrograms(event) {
    event.preventDefault();
    const programType = event.currentTarget.dataset.type;

    // Import the item browser dynamically
    const { SR2ItemBrowser } = await import("/systems/shadowrun2e/scripts/item-browser.js");

    const browserType = programType === "vrprogram" ? "vrprogram" : "program";
    const browser = new SR2ItemBrowser(this.actor, browserType, {});
    browser.render(true);
  }

  /**
   * Handle repairing icon damage
   */
  async _onRepairDamage(event) {
    event.preventDefault();
    const repairAmount = parseInt(event.currentTarget.dataset.amount) || 1;
    const currentDamage = this.actor.system.damage.icon.value;
    const newDamage = Math.max(0, currentDamage - repairAmount);

    await this.actor.update({ "system.damage.icon.value": newDamage });

    if (repairAmount === 1) {
      ui.notifications.info(`Repaired 1 point of Icon damage.`);
    } else {
      ui.notifications.info(`Fully repaired Icon damage.`);
    }
  }
}
