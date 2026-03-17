/**
 * Extend the basic ActorSheet with IC (Matrix security) specific functionality
 */
export class SR2ICSheet extends ActorSheet {
  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["shadowrun2e", "sheet", "actor", "ic", "spirit"],
      width: 920,
      height: 680,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "main" }],
    });
  }

  /** @override */
  get template() {
    return "systems/shadowrun2e/templates/actor/ic-sheet.html";
  }

  /** @override */
  getData() {
    const context = super.getData();
    const actorData = this.actor.toObject(false);

    context.system = actorData.system;
    context.flags = actorData.flags;

    this._prepareICData(context);

    return context;
  }

  _prepareICData(context) {
    // Initiative display (SR2: derived initiative terms)
    const dice = Number.isFinite(Number(context.system?.initiative?.dice))
      ? Number(context.system.initiative.dice)
      : 1;
    const base = Number.isFinite(Number(context.system?.initiative?.base))
      ? Number(context.system.initiative.base)
      : Number(context.system?.attributes?.reaction?.value) || 0;
    context.initiative = `${dice}d6+${base}`;
    context.namePlaceholder = "IC Name";
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.isEditable) return;

    // Heal damage
    html.find(".heal-damage").click(this._onHealDamage.bind(this));
  }

  async _onHealDamage(event) {
    event.preventDefault();
    const healAmount = parseInt(event.currentTarget.dataset.amount) || 1;
    const currentDamage = Number(this.actor.system?.health?.value) || 0;
    const newDamage = Math.max(0, currentDamage - healAmount);

    await this.actor.update({ "system.health.value": newDamage });

    if (healAmount === 1) {
      ui.notifications.info(`Healed 1 point of matrix damage.`);
    } else {
      ui.notifications.info(`Fully healed matrix damage.`);
    }
  }
}
