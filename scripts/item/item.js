/**
 * Extend the basic Item with Shadowrun 2E specific functionality
 */
import { sr2ApplyMessageMode } from "../utils/chat-mode.js";

function sr2EscapeHtml(value) {
  const raw = String(value ?? "");
  if (globalThis.foundry?.utils?.escapeHTML) return globalThis.foundry.utils.escapeHTML(raw);
  return raw.replace(
    /[&<>"']/g,
    (c) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[c],
  );
}

export class SR2Item extends Item {
  /** @override */
  prepareData() {
    super.prepareData();
  }

  /** @override */
  prepareDerivedData() {
    const itemData = this;
    const systemData = itemData.system;
    const flags = itemData.flags.shadowrun2e || {};

    // Make separate methods for each Item type to keep things organized
    this._prepareWeaponData(itemData);
    this._prepareArmorData(itemData);
  }

  /**
   * Prepare weapon specific data
   */
  _prepareWeaponData(itemData) {
    if (itemData.type !== "weapon") return;

    const systemData = itemData.system;
    // Add weapon-specific calculations here
  }

  /**
   * Prepare armor specific data
   */
  _prepareArmorData(itemData) {
    if (itemData.type !== "armor") return;

    const systemData = itemData.system;
    // Add armor-specific calculations here
  }

  /**
   * Handle clickable rolls for items
   */
  async roll() {
    const item = this;

    // Initialize chat data
    const speaker = ChatMessage.getSpeaker({ actor: this.actor });
    const label = `[${item.type.capitalize()}] ${item.name}`;

    // Handle different item types
    switch (item.type) {
      case "weapon":
        return this._rollWeapon();
      case "spell":
        return this._rollSpell();
      case "skill":
        return this._rollSkill();
      default:
        // For other items, show description or basic info
        ChatMessage.create(
          sr2ApplyMessageMode({
            speaker: speaker,
            flavor: label,
            content: this._getItemDescription(),
          }),
        );
        break;
    }
  }

  /**
   * Roll a weapon attack
   */
  async _rollWeapon() {
    const speaker = ChatMessage.getSpeaker({ actor: this.actor });
    const itemName = sr2EscapeHtml(this.name);
    const damage = sr2EscapeHtml(this.system.damage || "Unknown");
    const reach = sr2EscapeHtml(this.system.reach || "Unknown");

    let content = `<div class="weapon-roll">
      <h3>${itemName}</h3>
      <p><strong>Damage:</strong> ${damage}</p>
      <p><strong>Reach:</strong> ${reach}</p>
    `;

    if (this.system.description) {
      content += `<p><em>${sr2EscapeHtml(this.system.description)}</em></p>`;
    }

    content += `<p><em>Use the weapon attack button for full combat rolls.</em></p></div>`;

    ChatMessage.create(
      sr2ApplyMessageMode({
        speaker: speaker,
        flavor: `Weapon: ${this.name}`,
        content: content,
      }),
    );
  }

  /**
   * Roll a spell
   */
  async _rollSpell() {
    const speaker = ChatMessage.getSpeaker({ actor: this.actor });
    const itemName = sr2EscapeHtml(this.name);
    const category = sr2EscapeHtml(this.system.category || "Unknown");
    const target = sr2EscapeHtml(this.system.target || "Unknown");
    const drain = sr2EscapeHtml(this.system.drain || "Unknown");

    let content = `<div class="spell-roll">
      <h3>${itemName}</h3>
      <p><strong>Category:</strong> ${category}</p>
      <p><strong>Target:</strong> ${target}</p>
      <p><strong>Drain:</strong> ${drain}</p>
    `;

    if (this.system.description) {
      content += `<p><em>${sr2EscapeHtml(this.system.description)}</em></p>`;
    }

    content += `<p><em>Use the spell cast button for full spellcasting rolls.</em></p></div>`;

    ChatMessage.create(
      sr2ApplyMessageMode({
        speaker: speaker,
        flavor: `Spell: ${this.name}`,
        content: content,
      }),
    );
  }

  /**
   * Roll a skill
   */
  async _rollSkill() {
    const speaker = ChatMessage.getSpeaker({ actor: this.actor });
    const itemName = sr2EscapeHtml(this.name);
    const baseSkill = sr2EscapeHtml(this.system.baseSkill || "None");
    const baseRating = Number(this.system.baseRating) || 0;

    let content = `<div class="skill-roll">
      <h3>${itemName}</h3>
      <p><strong>Base Skill:</strong> ${baseSkill}</p>
      <p><strong>Base Rating:</strong> ${baseRating}</p>
    `;

    if (this.system.concentration) {
      content += `<p><strong>Concentration:</strong> ${sr2EscapeHtml(this.system.concentration)} (${Number(this.system.concentrationRating) || 0})</p>`;
    }

    if (this.system.specialization) {
      content += `<p><strong>Specialization:</strong> ${sr2EscapeHtml(this.system.specialization)} (${Number(this.system.specializationRating) || 0})</p>`;
    }

    content += `<p><em>Use the skill roll button for dice rolls.</em></p></div>`;

    ChatMessage.create(
      sr2ApplyMessageMode({
        speaker: speaker,
        flavor: `Skill: ${this.name}`,
        content: content,
      }),
    );
  }

  /**
   * Get item description for display
   */
  _getItemDescription() {
    const itemName = sr2EscapeHtml(this.name);
    let content = `<div class="item-info">
      <h3>${itemName}</h3>
    `;

    if (this.system.description) {
      content += `<p>${sr2EscapeHtml(this.system.description)}</p>`;
    } else {
      content += `<p><em>No description available.</em></p>`;
    }

    // Add type-specific info
    if (this.system.price) {
      content += `<p><strong>Price:</strong> ${Number(this.system.price) || 0}¥</p>`;
    }

    if (this.system.weight) {
      content += `<p><strong>Weight:</strong> ${Number(this.system.weight) || 0} kg</p>`;
    }

    content += `</div>`;
    return content;
  }

  /**
   * Prepare a data object which is passed to any Roll formulas
   */
  getRollData() {
    if (!this.actor) return null;
    const rollData = this.actor.getRollData();
    rollData.item = foundry.utils.deepClone(this.system);
    return rollData;
  }
}
