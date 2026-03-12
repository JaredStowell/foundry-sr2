import { sr2InferFocusBondCostForGearItem } from "./sr2-rules.js";

export class SR2GearPurchaseApp extends Application {
  static _archetypesData = null;
  static _archetypesPromise = null;
  static _gearCatalogIndex = null;
  static _gearCatalogPromise = null;

  constructor(actor, { archetypeKey } = {}, options = {}) {
    super(options);
    this.actor = actor;
    this.archetypeKey = archetypeKey || actor?.system?.details?.archetype || "";
    this.rows = [];
  }

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "sr2-gear-purchase",
      title: "Gear Purchase",
      template: "systems/shadowrun2e/templates/apps/gear-purchase.html",
      width: 820,
      height: 600,
      resizable: true,
      classes: ["shadowrun2e", "gear-purchase"],
    });
  }

  get title() {
    const actorName = this.actor?.name ? `: ${this.actor.name}` : "";
    return `Gear Purchase${actorName}`;
  }

  async getData() {
    const data = super.getData();
    await this._ensureLoaded();

    const buyer = this._getBuyerActor();
    const buyerNuyen = this._getActorNuyen(buyer);
    const totalCost = this._getSelectedTotal();
    const remainingNuyen = buyerNuyen - totalCost;
    const overBudget = totalCost > buyerNuyen;
    const buyDisabled = totalCost <= 0 || overBudget;

    return {
      ...data,
      actorName: this.actor?.name || "",
      archetypeLabel: this._getArchetypeLabel(),
      buyerName: buyer?.name || "",
      buyerNuyen,
      buyerNuyenDisplay: this._formatNuyen(buyerNuyen),
      totalCost,
      totalCostDisplay: this._formatNuyen(totalCost),
      remainingNuyen,
      remainingNuyenDisplay: this._formatNuyen(Math.max(0, remainingNuyen)),
      overBudget,
      buyDisabled,
      hasRows: this.rows.length > 0,
      rows: this.rows.map((r) => ({
        ...r,
        unitCostDisplay:
          r.unitCostValue === null ? r.unitCostDisplay || "?" : this._formatNuyen(r.unitCostValue),
        subtotalDisplay:
          r.unitCostValue === null ? "?" : this._formatNuyen(r.unitCostValue * r.quantity),
        typeLabel: r.itemType.charAt(0).toUpperCase() + r.itemType.slice(1),
      })),
    };
  }

  activateListeners(html) {
    super.activateListeners(html);

    html.find('input[data-action="toggle-row"]').on("change", this._onToggleRow.bind(this));
    html.find('input[data-action="qty-change"]').on("change", this._onQtyChange.bind(this));
    html.find('button[data-action="select-all"]').on("click", this._onSelectAll.bind(this));
    html.find('button[data-action="purchase"]').on("click", this._onPurchase.bind(this));
    html.find('button[data-action="skip"]').on("click", (event) => {
      event.preventDefault();
      this.close();
    });

    this._refreshSummary(html);
  }

  async _ensureLoaded() {
    if (this.rows.length) return;
    if (!this.actor || this.actor.type !== "follower") return;
    if (!this.archetypeKey) return;

    const [archetypesData, gearCatalogIndex] = await Promise.all([
      SR2GearPurchaseApp._loadArchetypesData(),
      SR2GearPurchaseApp._loadGearCatalogIndex(),
    ]);

    const archetype = archetypesData?.archetypes?.[this.archetypeKey];
    const gearList = Array.isArray(archetype?.gear) ? archetype.gear : [];

    const rows = [];
    for (const entry of gearList) {
      const itemType = String(entry?.type || "").trim();
      const rawName = String(entry?.name || "").trim();
      if (!itemType || !rawName) continue;

      const quantity = Math.max(1, Math.floor(Number(entry?.quantity) || 1));
      const expectedPrice = Number(entry?.expectedPrice);
      const expectedPriceValue = Number.isFinite(expectedPrice) ? expectedPrice : null;

      const resolved = this._resolveCatalogItem({
        itemType,
        name: rawName,
        expectedPrice: expectedPriceValue,
        gearCatalogIndex,
      });

      rows.push({
        itemType,
        name: resolved?.name || rawName,
        requestedName: rawName,
        quantity,
        selected: false,
        unitCostValue: resolved?.cost?.value ?? null,
        unitCostDisplay: resolved?.cost?.display ?? "?",
        canBuy: Boolean(resolved?.canBuy),
        note: resolved?.note || "",
        catalogItem: resolved?.catalogItem || null,
      });
    }

    this.rows = rows;
  }

  _getArchetypeLabel() {
    const label = this.actor?.system?.details?.archetypeLabel;
    if (label) return label;
    return String(this.archetypeKey || "").trim();
  }

  _resolveCatalogItem({ itemType, name, expectedPrice, gearCatalogIndex }) {
    const index = gearCatalogIndex?.[itemType];
    if (!index)
      return {
        name,
        cost: { value: null, display: "?" },
        canBuy: false,
        note: "Unknown item type",
      };

    const wantedKey = this._normalizeName(name);
    const exactMatches = index.get(wantedKey) || [];
    let matches = exactMatches;

    if (!matches.length && Number.isFinite(expectedPrice)) {
      const containsMatches = [];
      for (const [key, items] of index.entries()) {
        if (key.includes(wantedKey)) containsMatches.push(...items);
      }
      matches = containsMatches;
    }

    if (!matches.length) {
      return {
        name,
        cost: { value: null, display: "?" },
        canBuy: false,
        note: "Not found in catalog",
      };
    }

    const scored = matches
      .map((item) => {
        const cost = this._parseNuyenCost(item.cost);
        return { item, cost };
      })
      .filter((x) => x.cost.value !== null);

    if (!scored.length) {
      return {
        name,
        cost: { value: null, display: matches[0]?.cost ?? "?" },
        canBuy: false,
        note: "Cost not numeric",
      };
    }

    let chosen = null;
    if (Number.isFinite(expectedPrice)) {
      chosen = scored.find((x) => x.cost.value === expectedPrice) || null;
    }

    if (!chosen) {
      chosen = scored.slice().sort((a, b) => a.cost.value - b.cost.value)[0];
    }

    return {
      name: chosen.item.name,
      cost: chosen.cost,
      canBuy: true,
      note: chosen.item.name !== name ? `Matches catalog: ${chosen.item.name}` : "",
      catalogItem: chosen.item,
    };
  }

  async _onToggleRow(event) {
    event.preventDefault();
    const rowIndex = Number(event.currentTarget.dataset.rowIndex);
    const row = this.rows[rowIndex];
    if (!row || !row.canBuy) return;
    row.selected = Boolean(event.currentTarget.checked);
    this._refreshSummary(this.element);
  }

  async _onQtyChange(event) {
    event.preventDefault();
    const rowIndex = Number(event.currentTarget.dataset.rowIndex);
    const row = this.rows[rowIndex];
    if (!row) return;

    const parsed = Math.floor(Number(event.currentTarget.value) || 0);
    const next = Math.max(1, parsed);
    row.quantity = next;

    if (String(event.currentTarget.value) !== String(next)) {
      event.currentTarget.value = String(next);
    }

    this._refreshRowSubtotal(this.element, rowIndex);
    this._refreshSummary(this.element);
  }

  async _onSelectAll(event) {
    event.preventDefault();

    const html = this.element;
    if (!html) return;

    for (let i = 0; i < this.rows.length; i++) {
      const row = this.rows[i];
      if (!row?.canBuy) continue;
      row.selected = true;
      html.find(`input[data-action="toggle-row"][data-row-index="${i}"]`).prop("checked", true);
    }

    this._refreshSummary(html);
  }

  async _onPurchase(event) {
    event.preventDefault();

    const buyer = this._getBuyerActor();
    if (!buyer) return;

    const buyerNuyen = this._getActorNuyen(buyer);
    const selectedRows = this.rows.filter(
      (r) => r.selected && r.canBuy && r.unitCostValue !== null && r.catalogItem,
    );

    if (!selectedRows.length) {
      ui.notifications.warn("No gear selected.");
      return;
    }

    const totalCost = selectedRows.reduce((sum, r) => sum + r.unitCostValue * r.quantity, 0);
    if (totalCost > buyerNuyen) {
      ui.notifications.warn("Not enough nuyen for that purchase.");
      return;
    }

    try {
      await buyer.update({ "system.resources.nuyen": buyerNuyen - totalCost });
    } catch (error) {
      console.error("SR2E | Failed to deduct nuyen:", error);
      ui.notifications.error("Failed to deduct nuyen for purchase.");
      return;
    }

    const itemsToCreate = selectedRows.map((r) => this._buildEmbeddedItemData(r));

    try {
      await this.actor.createEmbeddedDocuments("Item", itemsToCreate, { sr2SkipBudget: true });
    } catch (error) {
      console.error("SR2E | Failed to create purchased items:", error);
      ui.notifications.error("Failed to add purchased gear to follower.");
      try {
        const currentNuyen = this._getActorNuyen(buyer);
        await buyer.update({ "system.resources.nuyen": currentNuyen + totalCost });
      } catch (refundError) {
        console.error("SR2E | Failed to refund nuyen after purchase failure:", refundError);
      }
      return;
    }

    ui.notifications.info(
      `Purchased ${itemsToCreate.length} item(s) for ¥${this._formatNuyen(totalCost)}.`,
    );
    await this.close();
  }

  _buildEmbeddedItemData(row) {
    const item = row.catalogItem;
    const unitCost = row.unitCostValue ?? 0;
    const quantity = Math.max(1, Number(row.quantity) || 1);

    const system = this._createSystemData(row.itemType, item, unitCost);
    system.quantity = quantity;
    system.price = unitCost;

    return {
      name: item.name,
      type: row.itemType,
      system,
    };
  }

  _createSystemData(itemType, itemData, unitCost) {
    const cost = {
      value: Number.isFinite(unitCost) ? unitCost : null,
      display: String(unitCost ?? "").trim(),
    };
    const descriptionParts = [];
    if (itemData.bookPage) descriptionParts.push(`Source: ${itemData.bookPage}`);
    if (cost.value === null && cost.display && cost.display !== "?")
      descriptionParts.push(`Cost: ${cost.display}`);

    const baseData = {
      description: descriptionParts.join("\n"),
      price: cost.value ?? 0,
    };

    if (itemType === "armor") {
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
    }

    if (itemType === "weapon") {
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
    }

    if (itemType === "gear") {
      return {
        ...baseData,
        category: itemData.category || "",
        rating: parseInt(itemData.rating) || 0,
        bondCost: sr2InferFocusBondCostForGearItem({
          category: itemData.category,
          name: itemData.name,
          price: unitCost,
        }),
        equipped: false,
        quantity: 1,
        weight: parseFloat(itemData.weight) || 0,
        availability: itemData.availability || "",
        streetIndex: parseFloat(itemData.streetIndex) || 1.0,
      };
    }

    return baseData;
  }

  _determineWeaponType(categoryName) {
    const rangedCategories = ["Firearms", "Bow and crossbow", "Rockets and Missiles"];
    return rangedCategories.includes(categoryName) ? "ranged" : "melee";
  }

  _determineRangeType(weaponName, categoryName) {
    const name = String(weaponName || "").toLowerCase();

    if (name.includes("hold-out") && name.includes("light")) return "(LHOP)";
    if (name.includes("hold-out")) return "(HOPist)";
    if (name.includes("light pistol")) return "(LPist)";
    if (name.includes("machine pistol")) return "(MaPist)";
    if (name.includes("heavy pistol")) return "(HPist)";
    if (name.includes("very heavy pistol")) return "(VHP)";
    if (name.includes("medium pistol") || name.includes("pistol")) return "(MPist)";

    if (name.includes("assault rifle")) return "(AsRf)";
    if (name.includes("sniper rifle")) return "(SptR)";
    if (name.includes("sport rifle")) return "(SprRf)";
    if (name.includes("hunting rifle")) return "(HntRf)";
    if (name.includes("rifle")) return "(Rfle)";

    if (name.includes("shotgun")) return "(Shot)";
    if (name.includes("smg") || name.includes("submachine gun")) return "(SMG)";
    if (name.includes("assault cannon")) return "(ACan)";
    if (name.includes("grenade launcher")) return "(GrLn)";
    if (name.includes("missile launcher")) return "(MisLn)";
    if (name.includes("mortar")) return "(Mrtr)";
    if (name.includes("flamethrower")) return "(FlThr)";

    if (name.includes("heavy crossbow")) return "(HCB)";
    if (name.includes("medium crossbow")) return "(MCB)";
    if (name.includes("light crossbow")) return "(LCB)";
    if (name.includes("crossbow")) return "(MCB)";
    if (name.includes("bow")) return "(Bow)";

    if (name.includes("shuriken")) return "(SH)";
    if (name.includes("throwing knife") || name.includes("thrown knife")) return "(TK)";
    if (name.includes("net")) return "(Net)";

    if (name.includes("taser")) return "(Tasr)";
    if (name.includes("spear gun")) return "(SpGn)";
    if (name.includes("blowgun")) return "(BG)";
    if (name.includes("slingshot")) return "(SS)";
    if (name.includes("sling")) return "(SL)";

    if (categoryName === "Firearms") return "(MPist)";
    if (categoryName === "Bow and crossbow") return "(Bow)";
    if (categoryName === "Rockets and Missiles") return "(MisLn)";

    return "(MPist)";
  }

  _refreshRowSubtotal(html, rowIndex) {
    const row = this.rows[rowIndex];
    if (!row || !html) return;

    const subtotal =
      row.unitCostValue === null ? "?" : this._formatNuyen(row.unitCostValue * row.quantity);
    html.find(`[data-role="row-subtotal"][data-row-index="${rowIndex}"]`).text(subtotal);
  }

  _refreshSummary(html) {
    if (!html) return;

    const buyer = this._getBuyerActor();
    const buyerNuyen = this._getActorNuyen(buyer);
    const total = this._getSelectedTotal();
    const remaining = buyerNuyen - total;
    const overBudget = total > buyerNuyen;
    const buyDisabled = total <= 0 || overBudget;

    html.find('[data-role="buyer-nuyen"]').text(this._formatNuyen(buyerNuyen));
    html.find('[data-role="total-cost"]').text(this._formatNuyen(total));
    html.find('[data-role="remaining-nuyen"]').text(this._formatNuyen(Math.max(0, remaining)));
    html.find('[data-role="purchase"]').prop("disabled", buyDisabled);
    html.find('[data-role="over-budget"]').toggleClass("is-hidden", !overBudget);
  }

  _getSelectedTotal() {
    return this.rows.reduce((sum, r) => {
      if (!r.selected || !r.canBuy || r.unitCostValue === null) return sum;
      return sum + r.unitCostValue * r.quantity;
    }, 0);
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

  _parseNuyenCost(rawCost) {
    if (rawCost === undefined || rawCost === null) return { value: null, display: "?" };

    const display = String(rawCost).trim();
    if (!display) return { value: null, display: "?" };

    const numeric = display.replace(/[,\s¥$]/g, "");
    if (!/^\d+(\.\d+)?$/.test(numeric)) return { value: null, display };

    const value = Number(numeric);
    return Number.isFinite(value) ? { value, display } : { value: null, display };
  }

  _normalizeName(name) {
    return String(name || "")
      .trim()
      .toLowerCase();
  }

  _formatNuyen(value) {
    const num = Number(value);
    if (!Number.isFinite(num)) return "0";
    return Math.floor(num).toLocaleString();
  }

  static _getSystemId() {
    return globalThis.game?.system?.id || "shadowrun2e";
  }

  static async _loadArchetypesData() {
    if (SR2GearPurchaseApp._archetypesData) return SR2GearPurchaseApp._archetypesData;
    if (SR2GearPurchaseApp._archetypesPromise) return SR2GearPurchaseApp._archetypesPromise;

    SR2GearPurchaseApp._archetypesPromise = (async () => {
      const systemId = SR2GearPurchaseApp._getSystemId();
      const response = await fetch(`systems/${systemId}/data/archetypes.json`);
      const data = await response.json();
      SR2GearPurchaseApp._archetypesData = data;
      return data;
    })();

    try {
      return await SR2GearPurchaseApp._archetypesPromise;
    } catch (error) {
      SR2GearPurchaseApp._archetypesPromise = null;
      throw error;
    }
  }

  static async _loadGearCatalogIndex() {
    if (SR2GearPurchaseApp._gearCatalogIndex) return SR2GearPurchaseApp._gearCatalogIndex;
    if (SR2GearPurchaseApp._gearCatalogPromise) return SR2GearPurchaseApp._gearCatalogPromise;

    SR2GearPurchaseApp._gearCatalogPromise = (async () => {
      const systemId = SR2GearPurchaseApp._getSystemId();
      const response = await fetch(`systems/${systemId}/data/gear.json`);
      const data = await response.json();

      const weaponCategories = [
        "Edged weapon",
        "Bow and crossbow",
        "Firearms",
        "Rockets and Missiles",
        "Grenades",
        "VehicleFire",
      ];
      const armorCategories = ["Clothing and Armor"];
      const excluded = new Set([...weaponCategories, ...armorCategories]);
      const gearCategories = Object.keys(data).filter((cat) => !excluded.has(cat));

      const byType = {
        weapon: new Map(),
        armor: new Map(),
        gear: new Map(),
      };

      const add = (type, item) => {
        const key = String(item?.name || "")
          .trim()
          .toLowerCase();
        if (!key) return;
        const list = byType[type].get(key) || [];
        list.push(item);
        byType[type].set(key, list);
      };

      for (const categoryName of weaponCategories) {
        if (!data[categoryName]?.entries) continue;
        for (const entry of data[categoryName].entries) {
          add("weapon", {
            name: entry.Name,
            category: categoryName,
            concealability: entry.Concealability || "",
            damage: entry.Damage || "",
            reach: entry.Reach || "",
            mode: entry.Mode || "",
            ammo: entry.Ammo || "",
            recoil: entry.Recoil || "",
            weight: entry.Weight || "",
            availability: entry.Availability || "",
            cost: entry.Cost || "",
            streetIndex: entry["Street Index"] || "",
            bookPage: entry.BookPage || "",
            type: "weapon",
          });
        }
      }

      for (const categoryName of armorCategories) {
        if (!data[categoryName]?.entries) continue;
        for (const entry of data[categoryName].entries) {
          add("armor", {
            name: entry.Name,
            category: categoryName,
            ballistic: entry.Ballistic || "",
            impact: entry.Impact || "",
            concealability: entry.Concealability || "",
            weight: entry.Weight || "",
            availability: entry.Availability || "",
            cost: entry.Cost || "",
            streetIndex: entry["Street Index"] || "",
            bookPage: entry.BookPage || "",
            type: "armor",
          });
        }
      }

      for (const categoryName of gearCategories) {
        if (!data[categoryName]?.entries) continue;
        for (const entry of data[categoryName].entries) {
          add("gear", {
            name: entry.Name,
            category: categoryName,
            rating: entry.Rating || "",
            weight: entry.Weight || "",
            availability: entry.Availability || "",
            cost: entry.Cost || "",
            streetIndex: entry["Street Index"] || "",
            bookPage: entry.BookPage || "",
            type: "gear",
          });
        }
      }

      SR2GearPurchaseApp._gearCatalogIndex = byType;
      return byType;
    })();

    try {
      return await SR2GearPurchaseApp._gearCatalogPromise;
    } catch (error) {
      SR2GearPurchaseApp._gearCatalogPromise = null;
      throw error;
    }
  }
}
