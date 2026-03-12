/**
 * Extend the basic ItemSheet with Shadowrun 2E specific functionality
 */
import { sr2ParseFocusName } from "../sr2-rules.js";

export class SR2ItemSheet extends ItemSheet {
  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["shadowrun2e", "sheet", "item"],
      width: 520,
      height: 480,
      tabs: [
        { navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description" },
      ],
    });
  }

  /** @override */
  get template() {
    // Use the same template for all item types
    return "systems/shadowrun2e/templates/item/item-sheet.html";
  }

  /** @override */
  async getData() {
    const context = await super.getData();
    const item = this.item ?? this.object;
    const itemData = item?.toObject ? item.toObject(false) : {};

    context.rollData = {};
    let actor = item?.parent ?? this.object?.parent ?? null;
    if (actor) {
      context.rollData = actor.getRollData();

      // For weapons, get available skills for linking
      if (itemData.type === "weapon") {
        context.availableSkills = actor.items.filter((i) => i.type === "skill");
      }
    }

    const focusLabels = {
      "specific spell focus": "Specific Spell Focus",
      "spell type focus": "Spell Category Focus",
      "spirit focus": "Spirit Focus",
      "power focus": "Power Focus",
      "weapon focus": "Weapon Focus",
      "spell lock": "Spell Lock",
    };

    const focus = itemData.type === "gear" ? sr2ParseFocusName(itemData.name) : null;
    context.focusInfo = focus
      ? {
          isFocus: true,
          kind: focus.kind,
          label: focusLabels[focus.kind] || focus.name,
          rating: focus.rating || 0,
          isSpecificSpellFocus: focus.kind === "specific spell focus",
          isSpellTypeFocus: focus.kind === "spell type focus",
          isSpiritFocus: focus.kind === "spirit focus",
        }
      : { isFocus: false };

    context.availableSpells = [];
    if (actor && context.focusInfo.isSpecificSpellFocus) {
      context.availableSpells = actor.items
        .filter((i) => i.type === "spell")
        .map((s) => ({ id: s.id, name: s.name }))
        .sort((a, b) => a.name.localeCompare(b.name));
    }

    context.spellClassOptions = [
      { value: "C", label: "Combat" },
      { value: "D", label: "Detection" },
      { value: "H", label: "Health" },
      { value: "I", label: "Illusion" },
      { value: "M", label: "Manipulation" },
    ];

    context.system = itemData.system;
    context.flags = itemData.flags;

    return context;
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.isEditable) return;

    // Roll handlers, click handlers, etc. would go here
  }
}
