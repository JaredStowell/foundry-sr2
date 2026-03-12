/**
 * Shadowrun 2E - Token Quick Actions
 * Shows a small action popup when the user controls a token.
 */
import { sr2GetInitiativeTerms, sr2RollInitiativeToChat } from "./actions/initiative.js";
import { sr2ExecuteActorItemAction } from "./actions/item-actions.js";

let sr2QuickActionsApp = null;
let sr2QuickActionsHooksInstalled = false;

const SR2_QUICK_ACTIONS_DEFAULT_WIDTH = 300;
const SR2_QUICK_ACTIONS_DEFAULT_HEIGHT = 360;

function sr2GetQuickActionsEnabled() {
  try {
    return Boolean(game.settings.get("shadowrun2e", "tokenQuickActions"));
  } catch (err) {
    return true;
  }
}

function sr2GetQuickActionsWidth() {
  try {
    const width = Number(game.settings.get("shadowrun2e", "quickActionsWidth"));
    return Number.isFinite(width) && width > 0 ? width : SR2_QUICK_ACTIONS_DEFAULT_WIDTH;
  } catch (err) {
    return SR2_QUICK_ACTIONS_DEFAULT_WIDTH;
  }
}

function sr2GetQuickActionsHeight() {
  try {
    const height = Number(game.settings.get("shadowrun2e", "quickActionsHeight"));
    return Number.isFinite(height) && height > 0 ? height : SR2_QUICK_ACTIONS_DEFAULT_HEIGHT;
  } catch (err) {
    return SR2_QUICK_ACTIONS_DEFAULT_HEIGHT;
  }
}

function sr2GetSingleControlledToken() {
  if (!canvas?.tokens) return null;
  const controlled = canvas.tokens.controlled || [];
  if (controlled.length !== 1) return null;
  const token = controlled[0];
  if (!token?.actor) return null;
  return token;
}

function sr2CloseQuickActionsApp() {
  try {
    if (!sr2QuickActionsApp) return;
    sr2QuickActionsApp.close();
  } catch (err) {
    // Intentionally ignore close errors
  } finally {
    sr2QuickActionsApp = null;
  }
}

function sr2RefreshQuickActionsApp() {
  if (!sr2GetQuickActionsEnabled()) {
    sr2CloseQuickActionsApp();
    return;
  }

  const token = sr2GetSingleControlledToken();
  if (!token) {
    sr2CloseQuickActionsApp();
    return;
  }

  if (!sr2QuickActionsApp) {
    sr2QuickActionsApp = new SR2QuickActionsPopup({ token });
    sr2QuickActionsApp.render(true);
    return;
  }

  sr2QuickActionsApp.setToken(token);
  if (sr2QuickActionsApp.rendered) sr2QuickActionsApp.render(false);
  else sr2QuickActionsApp.render(true);
}

export function initializeQuickActions() {
  if (sr2QuickActionsHooksInstalled) return;
  sr2QuickActionsHooksInstalled = true;

  Hooks.on("controlToken", () => {
    // Allow multi-select to settle before deciding whether to show/hide.
    setTimeout(() => sr2RefreshQuickActionsApp(), 0);
  });

  Hooks.on("canvasReady", () => {
    sr2CloseQuickActionsApp();
  });

  Hooks.on("deleteToken", (tokenDoc) => {
    if (!sr2QuickActionsApp?.token) return;
    if (sr2QuickActionsApp.token.id !== tokenDoc.id) return;
    sr2CloseQuickActionsApp();
  });
}

export class SR2QuickActionsPopup extends Application {
  constructor({ token }, options = {}) {
    super(options);
    this.token = token ?? null;
    this.actor = token?.actor ?? null;
    this._sr2NeedsPosition = true;
    this._sr2SaveSizeTimeout = null;
    this._sr2LastKnownWidth = null;
    this._sr2LastKnownHeight = null;
    this._sr2LastSavedWidth = sr2GetQuickActionsWidth();
    this._sr2LastSavedHeight = sr2GetQuickActionsHeight();
  }

  /** @override */
  _getHeaderButtons() {
    const buttons = super._getHeaderButtons();
    buttons.unshift({
      label: "Open Sheet",
      class: "sr2-open-sheet",
      icon: "fas fa-user",
      onclick: (event) => {
        event?.preventDefault?.();
        const actor = this.actor;
        if (!actor?.sheet) {
          ui?.notifications?.warn("No sheet available for this actor.");
          return;
        }
        actor.sheet.render(true);
      },
    });
    return buttons;
  }

  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "sr2-quick-actions",
      template: "systems/shadowrun2e/templates/apps/quick-actions.html",
      width: sr2GetQuickActionsWidth(),
      height: sr2GetQuickActionsHeight(),
      popOut: true,
      minimizable: false,
      resizable: true,
      draggable: true,
      minWidth: 260,
      minHeight: 220,
      classes: ["shadowrun2e", "sr2-quick-actions"],
    });
  }

  /** @override */
  get title() {
    return this.actor?.name || "Quick Actions";
  }

  /** @override */
  getData() {
    const data = super.getData();

    const actor = this.actor;
    const sr2SafeNumber = (value, fallback = 0) => {
      const num = Number(value);
      return Number.isFinite(num) ? num : fallback;
    };
    let initiativeFormula = null;
    let initiativeTitle = "Roll Initiative";
    if (actor) {
      const initiativeTerms = sr2GetInitiativeTerms(actor);
      initiativeFormula = initiativeTerms.compactFormula;
      initiativeTitle = `Roll Initiative (${initiativeFormula})`;
    }
    const rawHealth = actor?.system?.health;
    const health = rawHealth
      ? {
          physical: {
            value: sr2SafeNumber(rawHealth.physical?.value, 0),
            max: sr2SafeNumber(rawHealth.physical?.max, 0),
          },
          stun: {
            value: sr2SafeNumber(rawHealth.stun?.value, 0),
            max: sr2SafeNumber(rawHealth.stun?.max, 0),
          },
        }
      : null;
    const showHealth = actor?.type === "character" && Boolean(health);
    const weapons =
      actor?.items
        ?.filter((i) => i.type === "weapon")
        ?.map((weapon) => ({
          id: weapon.id,
          name: weapon.name,
          img: weapon.img,
        }))
        ?.sort((a, b) => String(a.name || "").localeCompare(String(b.name || ""))) ?? [];

    const spells =
      actor?.items
        ?.filter((i) => i.type === "spell")
        ?.map((spell) => {
          const spellLock = spell.system?.spellLock ?? {};
          const isEnabled = Boolean(spellLock.enabled);

          const lockClass = isEnabled ? "enabled" : "disabled";
          const lockTitle = isEnabled ? "Mark as Not Sustained" : "Mark as Sustained";
          const lockIcon = isEnabled ? "fa-lock" : "fa-lock-open";

          return {
            id: spell.id,
            name: spell.name,
            img: spell.img,
            lockClass,
            lockTitle,
            lockIcon,
          };
        })
        ?.sort((a, b) => String(a.name || "").localeCompare(String(b.name || ""))) ?? [];

    return {
      ...data,
      actor: actor ? { id: actor.id, name: actor.name, img: actor.img, type: actor.type } : null,
      token: this.token ? { id: this.token.id, name: this.token.name } : null,
      health,
      showHealth,
      initiativeFormula,
      initiativeTitle,
      weapons,
      hasWeapons: weapons.length > 0,
      spells,
      hasSpells: spells.length > 0,
    };
  }

  setToken(token) {
    const nextTokenId = token?.id ?? null;
    const currentTokenId = this.token?.id ?? null;
    if (nextTokenId && nextTokenId !== currentTokenId) this._sr2NeedsPosition = true;

    this.token = token ?? null;
    this.actor = token?.actor ?? null;
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    html.find("[data-action]").click(this._onAction.bind(this));
    html.find(".sr2-qa-weapon-attack").click(this._onWeaponAttack.bind(this));
    html.find(".sr2-qa-spell-cast").click(this._onSpellCast.bind(this));
    html.find(".sr2-qa-spell-lock-toggle").click(this._onSpellLockToggle.bind(this));
  }

  /** @override */
  async _render(force, options) {
    await super._render(force, options);
    if (!this._sr2NeedsPosition) return;
    this._positionNearToken();
    this._sr2NeedsPosition = false;
  }

  /** @override */
  async close(options) {
    try {
      if (this._sr2SaveSizeTimeout) {
        clearTimeout(this._sr2SaveSizeTimeout);
        this._sr2SaveSizeTimeout = null;
      }
      this._sr2SaveSizeNow();
    } catch (err) {
      // Ignore save errors
    }
    const result = await super.close(options);
    if (sr2QuickActionsApp === this) sr2QuickActionsApp = null;
    return result;
  }

  /** @override */
  setPosition(position = {}) {
    const result = super.setPosition(position);
    this._sr2MaybeQueueSaveSize();
    return result;
  }

  _sr2MaybeQueueSaveSize() {
    const width = Math.round(Number(this.position?.width));
    const height = Math.round(Number(this.position?.height));
    if (!Number.isFinite(width) || width <= 0) return;
    if (!Number.isFinite(height) || height <= 0) return;

    if (width === this._sr2LastKnownWidth && height === this._sr2LastKnownHeight) return;
    this._sr2LastKnownWidth = width;
    this._sr2LastKnownHeight = height;

    if (width === this._sr2LastSavedWidth && height === this._sr2LastSavedHeight) return;

    if (this._sr2SaveSizeTimeout) clearTimeout(this._sr2SaveSizeTimeout);
    this._sr2SaveSizeTimeout = setTimeout(() => {
      this._sr2SaveSizeTimeout = null;
      this._sr2SaveSizeNow();
    }, 250);
  }

  _sr2SaveSizeNow() {
    const settings = globalThis.game?.settings;
    if (!settings) return;

    const width = Math.round(Number(this.position?.width));
    const height = Math.round(Number(this.position?.height));
    if (!Number.isFinite(width) || width <= 0) return;
    if (!Number.isFinite(height) || height <= 0) return;

    if (width === this._sr2LastSavedWidth && height === this._sr2LastSavedHeight) return;
    this._sr2LastSavedWidth = width;
    this._sr2LastSavedHeight = height;

    try {
      void settings.set("shadowrun2e", "quickActionsWidth", width).catch(() => {});
      void settings.set("shadowrun2e", "quickActionsHeight", height).catch(() => {});
    } catch (err) {
      // Ignore settings errors (e.g., during shutdown)
    }
  }

  _positionNearToken() {
    try {
      const token = this.token;
      if (!token) return;
      if (!this.element?.length) return;
      if (!canvas?.stage?.toGlobal || !canvas?.app?.view?.getBoundingClientRect) return;

      const center = token.center ?? { x: token.x + token.w / 2, y: token.y + token.h / 2 };
      const globalPoint = canvas.stage.toGlobal(new PIXI.Point(center.x, center.y));
      const canvasRect = canvas.app.view.getBoundingClientRect();
      const rect = this.element[0].getBoundingClientRect();

      const margin = 8;
      const desiredLeft = canvasRect.left + globalPoint.x + 24;
      const desiredTop = canvasRect.top + globalPoint.y - rect.height / 2;

      const left = Math.min(
        Math.max(margin, desiredLeft),
        Math.max(margin, window.innerWidth - rect.width - margin),
      );
      const top = Math.min(
        Math.max(margin, desiredTop),
        Math.max(margin, window.innerHeight - rect.height - margin),
      );

      this.setPosition({ left, top });
    } catch (err) {
      // If positioning fails, allow Foundry to keep current position.
    }
  }

  async _onAction(event) {
    event.preventDefault();
    const action = event.currentTarget?.dataset?.action;
    if (!action) return;

    switch (action) {
      case "roll-initiative":
        await this._rollInitiative();
        break;
    }
  }

  async _rollInitiative() {
    const actor = this.actor;
    if (!actor) return;

    try {
      await sr2RollInitiativeToChat(actor);
    } catch (error) {
      console.error("SR2E | Error rolling initiative from quick actions:", error);
      ui.notifications.error("Failed to roll initiative (see console).");
    }
  }

  async _onWeaponAttack(event) {
    event.preventDefault();
    const actor = this.actor;
    const itemId = event.currentTarget?.dataset?.itemId;
    if (!actor || !itemId) return;
    const item = actor.items.get(itemId);
    const result = await sr2ExecuteActorItemAction(actor, item, "attack");
    if (!result.ok) ui.notifications.warn("Weapon attacks are unavailable for this actor.");
  }

  async _onSpellCast(event) {
    event.preventDefault();
    const actor = this.actor;
    const itemId = event.currentTarget?.dataset?.itemId;
    if (!actor || !itemId) return;
    const item = actor.items.get(itemId);
    const result = await sr2ExecuteActorItemAction(actor, item, "cast");
    if (!result.ok) ui.notifications.warn("Spell casting is unavailable for this actor.");
  }

  async _onSpellLockToggle(event) {
    event.preventDefault();
    const actor = this.actor;
    const itemId = event.currentTarget?.dataset?.itemId;
    if (!actor || !itemId) return;

    const sheet = actor.sheet;
    if (sheet && typeof sheet._onSpellLockToggle === "function") {
      await sheet._onSpellLockToggle({
        preventDefault: () => {},
        currentTarget: { dataset: { itemId } },
      });
      this.render(false);
      return;
    }

    ui.notifications.warn("Spell lock toggling is unavailable for this actor.");
  }
}
