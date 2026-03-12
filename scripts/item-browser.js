/**
 * Item Browser for Shadowrun 2E
 * Allows browsing and adding items from JSON data files
 */
import {
  sr2ComputeContactLevelSummary,
  sr2ComputeCreationNuyenBudgetBreakdown,
  sr2InferFocusBondCostForGearItem,
} from "./sr2-rules.js";

export class SR2ItemBrowser extends Application {
  static _itemsCache = new Map();

  constructor(actor, itemType, options = {}) {
    super(options);
    this.actor = actor;
    this.itemType = itemType;
    this.items = [];
    this.filteredItems = [];
    this.searchTerm = "";
    this._pendingSearchFocus = null;
    this._scheduledRender = null;
  }

  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "sr2-item-browser",
      title: "Item Browser",
      template: "systems/shadowrun2e/templates/apps/item-browser.html",
      width: 800,
      height: 600,
      resizable: true,
      classes: ["shadowrun2e", "item-browser"],
    });
  }

  /** @override */
  get title() {
    const typeNames = {
      cyberware: "Cyberware Browser",
      bioware: "Bioware Browser",
      spell: "Spell Browser",
      adeptpower: "Adept Power Browser",
      totem: "Totem Browser",
      program: "Program Browser",
      vrprogram: "VR Program Browser",
      weapon: "Weapon Browser",
      armor: "Armor Browser",
      gear: "Equipment Browser",
    };
    return typeNames[this.itemType] || "Item Browser";
  }

  /** @override */
  async getData() {
    const data = super.getData();

    // Load items if not already loaded
    if (this.items.length === 0) {
      await this._loadItems();
    }

    // Filter items based on search
    this._filterItems();

    const buyer = this._getBuyerActor();
    const purchaseFunds = this._getPurchaseFunds(buyer);
    const buyerNuyen = purchaseFunds.value;
    for (const item of this.filteredItems) {
      const costValue = item._buyCostValue ?? null;
      const costDisplay = item._buyCostDisplay ?? "?";
      const cost = { value: costValue, display: costDisplay };

      item.showBuy = costValue !== null && this._supportsNuyenPurchases();
      item.buyCostDisplay = costDisplay;
      item.buyCostValue = costValue;
      item.canBuy = Boolean(buyer) && costValue !== null && buyerNuyen >= costValue;
      item.buyDisabled = !item.canBuy;
      item.buyButtonClass = item.canBuy ? "can-buy" : "cant-buy";
      item.buyTitle = this._getBuyTitle({ buyer, purchaseFunds, buyerNuyen, cost, item });
    }

    return {
      ...data,
      itemType: this.itemType,
      items: this.filteredItems,
      searchTerm: this.searchTerm,
      hasItems: this.filteredItems.length > 0,
    };
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Search functionality
    html.find(".item-search").on("input", this._onSearch.bind(this));

    // Add item to character
    html.find(".add-item").click(this._onAddItem.bind(this));

    // Buy item (add + subtract nuyen)
    html.find(".buy-item").click(this._onBuyItem.bind(this));

    this._restorePendingSearchFocus(html);
  }

  /**
   * Load items from JSON data files
   */
  async _loadItems() {
    try {
      const cached = SR2ItemBrowser._itemsCache.get(this.itemType);
      if (cached) {
        this.items = cached.items.map((item) => ({ ...item }));
        return;
      }

      let response;
      let data;

      switch (this.itemType) {
        case "cyberware":
          response = await fetch("systems/shadowrun2e/data/cyberware.json");
          data = await response.json();
          this.items = this._processCyberwareData(data);
          break;

        case "bioware":
          response = await fetch("systems/shadowrun2e/data/bioware.json");
          data = await response.json();
          this.items = this._processBiowareData(data);
          break;

        case "spell":
          response = await fetch("systems/shadowrun2e/data/spells.json");
          data = await response.json();
          this.items = this._processSpellData(data);
          break;

        case "adeptpower":
          response = await fetch("systems/shadowrun2e/data/AdeptPowers.json");
          data = await response.json();
          this.items = this._processAdeptPowerData(data);
          break;

        case "totem":
          response = await fetch("systems/shadowrun2e/data/totems.json");
          data = await response.json();
          this.items = this._processTotemData(data);
          break;

        case "program":
          response = await fetch("systems/shadowrun2e/data/programs.json");
          data = await response.json();
          this.items = this._processProgramData(data, { isVr: false });
          break;

        case "vrprogram":
          response = await fetch("systems/shadowrun2e/data/VirtualRealityPrograms.json");
          data = await response.json();
          this.items = this._processProgramData(data, { isVr: true });
          break;

        case "weapon":
          response = await fetch("systems/shadowrun2e/data/gear.json");
          data = await response.json();
          this.items = this._processWeaponData(data);
          break;

        case "armor":
          response = await fetch("systems/shadowrun2e/data/gear.json");
          data = await response.json();
          this.items = this._processArmorData(data);
          break;

        case "gear":
          response = await fetch("systems/shadowrun2e/data/gear.json");
          data = await response.json();
          this.items = this._processGearData(data);
          break;
      }

      this._prepareBrowserItems();
      SR2ItemBrowser._itemsCache.set(this.itemType, {
        items: this.items.map((item) => ({ ...item })),
      });
    } catch (error) {
      console.error(`Failed to load ${this.itemType} data:`, error);
      ui.notifications.error(`Failed to load ${this.itemType} data`);
    }
  }

  _prepareBrowserItems() {
    for (const item of this.items) {
      const name = String(item.name || "").toLowerCase();
      const mods = String(item.mods || "").toLowerCase();
      item._searchText = `${name} ${mods}`.trim();

      const cost = this._parseNuyenCost(item.cost);
      item._buyCostValue = cost.value;
      item._buyCostDisplay = cost.display;
    }
  }

  /**
   * Process cyberware data from JSON
   */
  _processCyberwareData(data) {
    const items = [];

    for (const [category, categoryItems] of Object.entries(data)) {
      for (const item of categoryItems) {
        items.push({
          name: item.Name,
          category: category,
          essence: item.EssCost,
          cost: item.Cost,
          streetIndex: item.StreetIndex,
          mods: item.Mods || "",
          bookPage: item.BookPage,
          type: "cyberware",
        });
      }
    }

    return items;
  }

  /**
   * Process bioware data from JSON
   */
  _processBiowareData(data) {
    const items = [];

    for (const [category, categoryItems] of Object.entries(data)) {
      for (const item of categoryItems) {
        items.push({
          name: item.Name,
          category: category,
          bioIndex: parseFloat(item.BioIndex),
          cost: item.Cost,
          streetIndex: item.StreetIndex,
          mods: item.Mods || "",
          bookPage: item.BookPage,
          type: "bioware",
        });
      }
    }

    return items;
  }

  /**
   * Process program data from JSON
   */
  _processProgramData(data, { isVr } = {}) {
    const items = [];
    const isVrProgram = Boolean(isVr);
    const descriptionPrefix = isVrProgram ? "Virtual Reality Program" : "Standard Program";

    for (const program of data) {
      const multiplier = Number(program.Multiplyer) || 1;
      items.push({
        name: program.Name,
        category: isVrProgram ? "VR Program" : "Program",
        multiplier,
        memorySize: multiplier,
        mods: "",
        type: "program",
        description: `${descriptionPrefix}\nSize Multiplier: ${multiplier}`,
      });
    }

    return items;
  }

  /**
   * Process spell data from JSON
   */
  _processSpellData(data) {
    const items = [];

    for (const spell of data) {
      const name = spell.Name.trim();
      const spellType = spell.Type;
      const drain = spell.Drain;

      items.push({
        name,
        category: spell.Class,
        range: this._inferSpellRange(name),
        resist: this._inferSpellResist(spellType),
        damage: this._inferSpellDamageLevelFromDrain(drain),
        drain,
        drainDisplay: this._formatSpellDrain(drain),
        spellType,
        duration: spell.Duration,
        bookPage: spell.BookPage,
      });
    }

    return items;
  }

  _inferSpellRange(spellName) {
    const name = String(spellName || "").toLowerCase();
    if (!name) return "";
    if (name.includes("touch")) return "Touch";
    return "LOS";
  }

  _inferSpellResist(spellType) {
    switch (String(spellType || "").toUpperCase()) {
      case "M":
        return "Willpower";
      case "P":
        return "Body";
      default:
        return "";
    }
  }

  _inferSpellDamageLevelFromDrain(rawDrain) {
    const drain = String(rawDrain || "")
      .trim()
      .toUpperCase();
    const match = drain.match(/([LMSD])\s*$/);
    return match ? match[1] : "";
  }

  _formatSpellDrain(rawDrain) {
    const drain = String(rawDrain || "").trim();
    if (!drain) return "";

    const levelMatch = drain.toUpperCase().match(/([LMSD])\s*$/);
    if (!levelMatch) return drain;

    const level = levelMatch[1];
    let formula = drain.replace(/([LMSD])\s*$/i, "").trim();
    formula = formula.replace(/^\[(.*)\]$/, "$1").trim();
    if (!formula) return drain;

    return `${formula} ${level}`;
  }

  /**
   * Process adept power data from JSON
   */
  _processAdeptPowerData(data) {
    const items = [];

    for (const power of data) {
      items.push({
        name: power.Name.trim(),
        category: "Adept Powers",
        cost: power.Cost,
        hasLevels: power.HasLevels,
        mods: power.Mods || "",
        notes: power.Notes || "",
        bookPage: power.BookPage,
        type: "adeptpower",
      });
    }

    return items;
  }

  /**
   * Process totem data from JSON
   */
  _processTotemData(data) {
    const items = [];

    // Process all totems from the TOTEMS array
    if (data.TOTEMS && Array.isArray(data.TOTEMS)) {
      for (const totem of data.TOTEMS) {
        items.push({
          name: totem.name,
          category: this._getTotemCategory(totem),
          environment: totem.environment,
          advantages: totem.advantages,
          disadvantages: totem.disadvantages,
          bookPage: "SR2E Core",
          type: "totem",
        });
      }
    }

    return items;
  }

  /**
   * Determine totem category based on name and environment
   */
  _getTotemCategory(totem) {
    const name = totem.name.toLowerCase();
    const env = totem.environment.toLowerCase();

    // Elemental totems
    if (["moon", "mountain", "oak", "sea", "stream", "sun", "wind"].includes(name)) {
      return "Elemental Totems";
    }

    // Urban totems
    if (env.includes("urban") || ["cat", "dog", "rat", "gator"].includes(name)) {
      return "Urban Totems";
    }

    // Voodoo totems
    if (
      ["azaca", "damballah", "erzulie", "ghede", "legba", "obatala", "ogoun", "shango"].includes(
        name,
      )
    ) {
      return "Voodoo Totems";
    }

    // Default to Animal Totems
    return "Animal Totems";
  }

  /**
   * Filter items based on search term
   */
  _filterItems() {
    this.filteredItems = this.items.filter((item) => {
      // Search filter
      if (this.searchTerm) {
        const searchLower = this.searchTerm.toLowerCase();
        return (item._searchText || "").includes(searchLower);
      }

      return true;
    });
  }

  /**
   * Handle search input
   */
  _onSearch(event) {
    const input = event.currentTarget;
    this.searchTerm = input.value;
    this._pendingSearchFocus = {
      selectionStart: input.selectionStart,
      selectionEnd: input.selectionEnd,
    };
    this._scheduleRender();
  }

  /**
   * Handle adding item to character
   */
  async _onAddItem(event) {
    event.preventDefault();
    const itemIndex = parseInt(event.currentTarget.dataset.itemIndex);
    const itemData = this.filteredItems[itemIndex];

    if (!itemData) return;

    await this.addItem(itemData);
  }

  /**
   * Add item to character (can be overridden for custom behavior)
   */
  async addItem(itemData, { notify = true } = {}) {
    const documentType = this.itemType === "vrprogram" ? "program" : this.itemType;

    // Create the item data for Foundry
    const newItemData = {
      name: itemData.name,
      type: documentType,
      system: this._createSystemData(itemData),
    };

    try {
      const createdItems = await this.actor.createEmbeddedDocuments("Item", [newItemData]);
      if (notify) ui.notifications.info(`Added ${itemData.name} to ${this.actor.name}`);
      return createdItems[0];
    } catch (error) {
      console.error("Failed to add item:", error);
      ui.notifications.error("Failed to add item to character");
      return null;
    }
  }

  /**
   * Handle buying an item (add to actor + subtract nuyen)
   */
  async _onBuyItem(event) {
    event.preventDefault();
    const itemIndex = parseInt(event.currentTarget.dataset.itemIndex);
    const itemData = this.filteredItems[itemIndex];
    if (!itemData) return;

    const buyer = this._getBuyerActor();
    if (!buyer) return;

    const cost = this._parseNuyenCost(itemData.cost);
    if (cost.value === null) {
      ui.notifications.warn(`Can't buy ${itemData.name}: cost is not a number.`);
      return;
    }

    const purchaseFunds = this._getPurchaseFunds(buyer);
    const buyerNuyen = purchaseFunds.value;
    if (buyerNuyen < cost.value) {
      const label = purchaseFunds.mode === "creation" ? "resource budget" : "nuyen";
      ui.notifications.warn(`Not enough ${label} to buy ${itemData.name}.`);
      return;
    }

    if (purchaseFunds.mode !== "creation") {
      try {
        await buyer.update({ "system.resources.nuyen": buyerNuyen - cost.value });
      } catch (error) {
        console.error("Failed to deduct nuyen:", error);
        ui.notifications.error("Failed to deduct nuyen for purchase.");
        return;
      }
    }

    const createdItem = await this.addItem(itemData, { notify: false });
    if (!createdItem) {
      if (purchaseFunds.mode !== "creation") {
        try {
          const currentNuyen = this._getActorNuyen(buyer);
          await buyer.update({ "system.resources.nuyen": currentNuyen + cost.value });
        } catch (error) {
          console.error("Failed to refund nuyen after purchase failure:", error);
        }
      }
      return;
    }

    if (purchaseFunds.mode === "creation") {
      ui.notifications.info(
        `Added ${itemData.name} to purchases (¥${cost.value} from resource budget).`,
      );
    } else {
      ui.notifications.info(`Bought ${itemData.name} for ¥${cost.value}.`);
    }
    this._cancelScheduledRender();
    this.render(false);
  }

  /**
   * Create system data based on item type
   */
  _createSystemData(itemData) {
    const cost = this._parseNuyenCost(itemData.cost);
    const descriptionParts = [];
    if (itemData.bookPage) descriptionParts.push(`Source: ${itemData.bookPage}`);
    if (cost.value === null && cost.display && cost.display !== "?")
      descriptionParts.push(`Cost: ${cost.display}`);

    const baseData = {
      description: descriptionParts.join("\n"),
      price: cost.value ?? 0,
    };

    switch (this.itemType) {
      case "cyberware":
        return {
          ...baseData,
          essence: itemData.essence,
          streetIndex: itemData.streetIndex,
          mods: itemData.mods,
          installed: false,
          rating: 0,
        };

      case "bioware":
        return {
          ...baseData,
          bioIndex: itemData.bioIndex,
          streetIndex: itemData.streetIndex,
          mods: itemData.mods,
          installed: false,
          rating: 0,
        };

      case "spell":
        return {
          ...baseData,
          drain: itemData.drain,
          type: itemData.spellType,
          duration: itemData.duration,
          class: itemData.category,
          force: 1,
        };

      case "adeptpower":
        return {
          ...baseData,
          cost: itemData.cost,
          hasLevels: itemData.hasLevels,
          currentLevel: 1,
          maxLevel: 6,
          mods: itemData.mods,
          notes: itemData.notes,
        };

      case "totem":
        return {
          ...baseData,
          environment: itemData.environment,
          advantages: itemData.advantages,
          disadvantages: itemData.disadvantages,
          isSelected: false,
          quantity: 1,
          weight: 0,
        };

      case "armor":
        return {
          ...baseData,
          rating: parseInt(itemData.ballistic) || parseInt(itemData.impact) || 0,
          concealability: parseInt(itemData.concealability) || 0,
          ballistic: parseInt(itemData.ballistic) || 0,
          impact: parseInt(itemData.impact) || 0,
          equipped: false,
          quantity: 1,
          weight: parseFloat(itemData.weight) || 0,
          availability: itemData.availability || "",
          streetIndex: parseFloat(itemData.streetIndex) || 1.0,
        };

      case "weapon":
        return {
          ...baseData,
          weaponType: this._determineWeaponType(itemData.category),
          concealability: parseInt(itemData.concealability) || 0,
          damage: itemData.damage || "1L",
          reach: parseInt(itemData.reach) || 0,
          mode: itemData.mode || "SS",
          ammo: {
            current: 0,
            max: parseInt(itemData.ammo) || 0,
            type: "",
          },
          recoil: parseInt(itemData.recoil) || 0,
          rangeType: this._determineRangeType(itemData.name, itemData.category),
          equipped: false,
          quantity: 1,
          weight: parseFloat(itemData.weight) || 0,
          availability: itemData.availability || "",
          streetIndex: parseFloat(itemData.streetIndex) || 1.0,
        };

      case "gear":
        return {
          ...baseData,
          category: itemData.category || "",
          rating: parseInt(itemData.rating) || 0,
          bondCost: sr2InferFocusBondCostForGearItem({
            category: itemData.category,
            name: itemData.name,
            price: itemData.cost,
          }),
          equipped: false,
          quantity: 1,
          weight: parseFloat(itemData.weight) || 0,
          availability: itemData.availability || "",
          streetIndex: parseFloat(itemData.streetIndex) || 1.0,
        };

      case "program":
      case "vrprogram":
        return {
          ...baseData,
          description: itemData.description || baseData.description,
          rating: 1,
          type: "utility",
          multiplier: Number(itemData.multiplier) || 1,
          memorySize: Number.isFinite(Number(itemData.memorySize))
            ? Number(itemData.memorySize)
            : Number(itemData.multiplier) || 1,
          loadTime: 1,
          isActive: false,
          isLoaded: false,
          availability: itemData.availability || "",
          streetIndex: parseFloat(itemData.streetIndex) || 1.0,
          quantity: 1,
          weight: parseFloat(itemData.weight) || 0,
          price: 0,
        };
    }

    return baseData;
  }

  _getBuyerActor() {
    const leaderId = this.actor?.system?.details?.leaderId;
    const leader = leaderId && game?.actors ? game.actors.get(leaderId) : null;
    return leader || this.actor;
  }

  _getActorNuyen(actor) {
    const nuyen = actor?.system?.resources?.nuyen;
    const value = Number(nuyen);
    return Number.isFinite(value) ? value : 0;
  }

  _supportsNuyenPurchases() {
    return ["cyberware", "bioware", "weapon", "armor", "gear"].includes(this.itemType);
  }

  _getSystemSetting(key, fallback) {
    try {
      return game?.settings?.get("shadowrun2e", key) ?? fallback;
    } catch (err) {
      return fallback;
    }
  }

  _isCreationBudgetActive(actor) {
    if (!actor) return false;

    const completed = actor.getFlag?.("shadowrun2e", "creationCompleted");
    if (completed === true) return false;

    const flag = actor.getFlag?.("shadowrun2e", "creationMode");
    let creationMode = false;
    if (typeof flag === "boolean") {
      creationMode = flag;
    } else {
      const creation = actor.system?.creation;
      creationMode = Boolean(
        (creation?.attributePoints || 0) > 0 ||
        (creation?.skillPoints || 0) > 0 ||
        (creation?.forcePoints || 0) > 0,
      );
    }
    if (!creationMode) return false;

    const startingNuyen = Number(actor.system?.creation?.startingNuyen) || 0;
    if (startingNuyen <= 0) return false;

    return !actor.system?.creation?.resourcesFinalized;
  }

  _getCreationBudgetRemaining(actor) {
    const contactLevelsEnabled = Boolean(this._getSystemSetting("contactLevels", false));
    const disableBuddies =
      contactLevelsEnabled || Boolean(this._getSystemSetting("disableBuddies", false));
    const budgetOptions = { disableBuddies };

    if (contactLevelsEnabled && actor?.type === "character") {
      const charisma = Number(actor.system?.attributes?.charisma?.value) || 0;
      const linkedContacts =
        game?.actors?.filter(
          (a) => a.type === "contact" && a.system?.details?.leaderId === actor.id,
        ) ?? [];

      budgetOptions.contactLevelsSummary = sr2ComputeContactLevelSummary(
        linkedContacts.map((a) => ({
          id: a.id,
          sort: Number(a.sort) || 0,
          contactLevel: a.system?.details?.contactLevel,
        })),
        charisma,
      );
    }

    const breakdown = sr2ComputeCreationNuyenBudgetBreakdown(
      actor.system,
      actor.items,
      budgetOptions,
    );
    return Number(breakdown?.remainingNuyen) || 0;
  }

  _getPurchaseFunds(actor) {
    if (this._supportsNuyenPurchases() && this._isCreationBudgetActive(actor)) {
      return { mode: "creation", value: this._getCreationBudgetRemaining(actor) };
    }

    return { mode: "nuyen", value: this._getActorNuyen(actor) };
  }

  _parseNuyenCost(rawCost) {
    if (rawCost === undefined || rawCost === null) return { value: null, display: "?" };

    const display = String(rawCost).trim();
    if (!display) return { value: null, display: "?" };

    const numeric = display.replace(/[,\s¥$]/g, "");
    if (!/^\d+(\.\d+)?$/.test(numeric)) return { value: null, display };

    const value = Number(numeric);
    return Number.isFinite(value) ? { value, display } : { value: null, display };
  }

  _getBuyTitle({ buyer, purchaseFunds, buyerNuyen, cost, item }) {
    if (!buyer) return "No buyer available";
    if (cost.value === null) return "Can't buy: cost is not a number";
    if (buyerNuyen < cost.value) {
      const label = purchaseFunds.mode === "creation" ? "resource budget" : "nuyen";
      return `Can't buy: need ¥${cost.value} (${label})`;
    }
    if (purchaseFunds.mode === "creation")
      return `Add to purchases for ¥${cost.value} (resource budget)`;
    if (buyer === this.actor) return `Buy for ${cost.value}¥`;
    return `Buy for ${cost.value}¥ (paid by ${buyer.name})`;
  }

  _cancelScheduledRender() {
    if (!this._scheduledRender) return;
    clearTimeout(this._scheduledRender);
    this._scheduledRender = null;
  }

  _scheduleRender(delayMs = 150) {
    this._cancelScheduledRender();
    this._scheduledRender = setTimeout(() => {
      this._scheduledRender = null;
      this.render(false);
    }, delayMs);
  }

  _restorePendingSearchFocus(html) {
    const pending = this._pendingSearchFocus;
    if (!pending) return;

    const input = html.find(".item-search")[0];
    if (!input) {
      this._pendingSearchFocus = null;
      return;
    }

    input.focus();
    try {
      const start = Number.isFinite(pending.selectionStart)
        ? pending.selectionStart
        : input.value.length;
      const end = Number.isFinite(pending.selectionEnd) ? pending.selectionEnd : start;
      input.setSelectionRange(start, end);
    } catch (_) {
      // ignore
    }

    this._pendingSearchFocus = null;
  }

  async close(options = {}) {
    this._cancelScheduledRender();
    return super.close(options);
  }

  /**
   * Determine weapon type based on category
   */
  _determineWeaponType(categoryName) {
    const rangedCategories = ["Firearms", "Bow and crossbow", "Rockets and Missiles"];
    return rangedCategories.includes(categoryName) ? "ranged" : "melee";
  }

  /**
   * Determine range type based on weapon name and category
   */
  _determineRangeType(weaponName, categoryName) {
    const name = weaponName.toLowerCase();

    // Pistol categories
    if (name.includes("hold-out") && name.includes("light")) return "(LHOP)";
    if (name.includes("hold-out")) return "(HOPist)";
    if (name.includes("light pistol")) return "(LPist)";
    if (name.includes("machine pistol")) return "(MaPist)";
    if (name.includes("heavy pistol")) return "(HPist)";
    if (name.includes("very heavy pistol")) return "(VHP)";
    if (name.includes("medium pistol") || name.includes("pistol")) return "(MPist)";

    // Long guns
    if (name.includes("assault rifle")) return "(AsRf)";
    if (name.includes("sniper rifle")) return "(SptR)";
    if (name.includes("heavy sniper")) return "(HSR)";
    if (name.includes("sniper")) return "(Snip)";
    if (name.includes("light carbine")) return "LCarb";
    if (name.includes("carbine")) return "(Carb)";
    if (name.includes("shotgun")) return "(ShtG)";
    if (name.includes("submachine") || name.includes("smg")) return "(SMG)";

    // Machine guns
    if (name.includes("heavy machine gun") || name.includes("hmg")) return "(HMG)";
    if (name.includes("medium machine gun") || name.includes("mmg")) return "(MMG)";
    if (name.includes("light machine gun") || name.includes("lmg")) return "(LMG)";
    if (name.includes("minigun")) return "(MinG)";

    // Heavy weapons
    if (name.includes("assault cannon")) return "(ACan)";
    if (name.includes("grenade launcher")) return "(GrLn)";
    if (name.includes("missile launcher")) return "(MisLn)";
    if (name.includes("mortar")) return "(Mrtr)";
    if (name.includes("flamethrower")) return "(FlThr)";

    // Bows and crossbows
    if (name.includes("heavy crossbow")) return "(HCB)";
    if (name.includes("medium crossbow")) return "(MCB)";
    if (name.includes("light crossbow")) return "(LCB)";
    if (name.includes("crossbow")) return "(MCB)";
    if (name.includes("bow")) return "(Bow)";

    // Thrown weapons
    if (name.includes("shuriken")) return "(SH)";
    if (name.includes("throwing knife") || name.includes("thrown knife")) return "(TK)";
    if (name.includes("net")) return "(Net)";

    // Special weapons
    if (name.includes("taser")) return "(Tasr)";
    if (name.includes("spear gun")) return "(SpGn)";
    if (name.includes("blowgun")) return "(BG)";
    if (name.includes("slingshot")) return "(SS)";
    if (name.includes("sling")) return "(SL)";

    // Default based on category
    if (categoryName === "Firearms") return "(MPist)"; // Default to medium pistol
    if (categoryName === "Bow and crossbow") return "(Bow)";
    if (categoryName === "Rockets and Missiles") return "(MisLn)";

    return "(MPist)"; // Default fallback
  }

  /**
   * Process weapon data from gear.json
   */
  _processWeaponData(data) {
    const items = [];
    const weaponCategories = [
      "Edged weapon",
      "Bow and crossbow",
      "Firearms",
      "Rockets and Missiles",
      "Grenades",
      "VehicleFire",
    ];

    for (const categoryName of weaponCategories) {
      if (data[categoryName] && data[categoryName].entries) {
        for (const item of data[categoryName].entries) {
          items.push({
            name: item.Name,
            category: categoryName,
            concealability: item.Concealability || "",
            damage: item.Damage || "",
            reach: item.Reach || "",
            mode: item.Mode || "",
            ammo: item.Ammo || "",
            recoil: item.Recoil || "",
            weight: item.Weight || "",
            availability: item.Availability || "",
            cost: item.Cost || "",
            streetIndex: item["Street Index"] || "",
            bookPage: item.BookPage || "",
            type: "weapon",
          });
        }
      }
    }

    return items;
  }

  /**
   * Process armor data from gear.json
   */
  _processArmorData(data) {
    const items = [];
    const armorCategories = ["Clothing and Armor"];

    for (const categoryName of armorCategories) {
      if (data[categoryName] && data[categoryName].entries) {
        for (const item of data[categoryName].entries) {
          items.push({
            name: item.Name,
            category: categoryName,
            ballistic: item.Ballistic || "",
            impact: item.Impact || "",
            concealability: item.Concealability || "",
            weight: item.Weight || "",
            availability: item.Availability || "",
            cost: item.Cost || "",
            streetIndex: item["Street Index"] || "",
            bookPage: item.BookPage || "",
            type: "armor",
          });
        }
      }
    }

    return items;
  }

  /**
   * Process general gear/equipment data from gear.json
   */
  _processGearData(data) {
    const items = [];
    const gearCategories = Object.keys(data).filter(
      (cat) =>
        ![
          "Edged weapon",
          "Bow and crossbow",
          "Firearms",
          "Rockets and Missiles",
          "Grenades",
          "VehicleFire",
          "Clothing and Armor",
        ].includes(cat),
    );

    for (const categoryName of gearCategories) {
      if (data[categoryName] && data[categoryName].entries) {
        for (const item of data[categoryName].entries) {
          items.push({
            name: item.Name,
            category: categoryName,
            rating: item.Rating || "",
            weight: item.Weight || "",
            availability: item.Availability || "",
            cost: item.Cost || "",
            streetIndex: item["Street Index"] || "",
            bookPage: item.BookPage || "",
            type: "gear",
          });
        }
      }
    }

    return items;
  }
}
