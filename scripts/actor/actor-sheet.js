// Import the initiative tracker
import { SR2InitiativeTracker } from '../initiative-tracker.js';
import {
    sr2ComputeCreationNuyenBudgetBreakdown,
    sr2ComputeAttributePointsSpent,
    sr2ComputeForcePointsSpent,
    sr2ComputeSkillPointsSpent,
    sr2ComputeSkillRatingsFromAllocated,
    sr2Clamp,
    sr2FormatSignedModifier,
    sr2GetRacialAttributeBounds,
    sr2GetRacialModifiers,
    sr2GetRacialTraits,
    sr2SkillInferAllocatedRating
} from "../sr2-rules.js";

let skillsDataCache = null;
let skillsDataCachePromise = null;

async function loadSkillsData() {
    if (skillsDataCache) return skillsDataCache;

    if (!skillsDataCachePromise) {
        skillsDataCachePromise = fetch('/systems/shadowrun2e/data/skills.json')
            .then(response => response.json())
            .then(skillsData => {
                skillsDataCache = skillsData;
                return skillsData;
            })
            .catch(error => {
                skillsDataCachePromise = null;
                throw error;
            });
    }

    return skillsDataCachePromise;
}

function sr2InferSpellRangeFromName(spellName) {
    const name = String(spellName || "").toLowerCase();
    if (!name) return "";
    if (name.includes("touch")) return "Touch";
    return "LOS";
}

function sr2InferSpellResistFromType(spellType) {
    switch (String(spellType || "").toUpperCase()) {
        case "M":
            return "Willpower";
        case "P":
            return "Body";
        default:
            return "";
    }
}

function sr2InferSpellDamageLevelFromDrain(rawDrain) {
    const drain = String(rawDrain || "").trim().toUpperCase();
    const match = drain.match(/([LMSD])\s*$/);
    return match ? match[1] : "";
}

function sr2FormatSpellDrain(rawDrain) {
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
 * Extend the basic ActorSheet with Shadowrun 2E specific functionality
 */
export class SR2ActorSheet extends ActorSheet {

  constructor(...args) {
    super(...args);

    // Cache DOM lookups and debounce multi-click updates
    this._domCache = new Map();
    this._updateQueue = new Map();

    this._boundOnActorUpdate = this._onActorUpdate.bind(this);
    this._hasActorUpdateHook = false;

    this._debouncedUpdate = this._debounce(this._processUpdateQueue.bind(this), 50);
  }

  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["shadowrun2e", "sheet", "actor"],
      template: "systems/shadowrun2e/templates/actor/character-sheet.html",
      width: 960,
      height: 680,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "attributes" }]
    });
  }

  /** @override */
  get template() {
    // For now, all actor types use the character sheet
    // Later we can add different sheets for different actor types
    return "systems/shadowrun2e/templates/actor/character-sheet.html";
  }

  /** @override */
  async getData() {
    const context = super.getData();
    const actorData = this.actor.toObject(false);

    context.system = actorData.system;
    context.flags = actorData.flags;

    // Ensure shadowrun2e flags container exists for template bindings
    if (!context.flags.shadowrun2e) context.flags.shadowrun2e = {};

    // Default: creation mode is enabled for characters created via priorities
    if (typeof context.flags.shadowrun2e.creationMode !== "boolean") {
      const hasCreationPoints =
        (context.system.creation?.attributePoints || 0) > 0 ||
        (context.system.creation?.skillPoints || 0) > 0 ||
        (context.system.creation?.forcePoints || 0) > 0;
      context.flags.shadowrun2e.creationMode = hasCreationPoints;
    }

    // Ensure health data structure exists with defaults
    if (!context.system.health) {
      context.system.health = {
        physical: { value: 0, max: 10 },
        stun: { value: 0, max: 10 }
      };
    } else {
      // Ensure physical health exists
      if (!context.system.health.physical) {
        context.system.health.physical = { value: 0, max: 10 };
      } else {
        // Ensure values are numbers, handle NaN, null, undefined
        const physValue = context.system.health.physical.value;
        const physMax = context.system.health.physical.max;

        context.system.health.physical.value = (typeof physValue === 'number' && !isNaN(physValue)) ? physValue : 0;
        context.system.health.physical.max = (typeof physMax === 'number' && !isNaN(physMax)) ? physMax : 10;
      }

      // Ensure stun health exists
      if (!context.system.health.stun) {
        context.system.health.stun = { value: 0, max: 10 };
      } else {
        // Ensure values are numbers, handle NaN, null, undefined
        const stunValue = context.system.health.stun.value;
        const stunMax = context.system.health.stun.max;

        context.system.health.stun.value = (typeof stunValue === 'number' && !isNaN(stunValue)) ? stunValue : 0;
        context.system.health.stun.max = (typeof stunMax === 'number' && !isNaN(stunMax)) ? stunMax : 10;
      }
    }

    // Normalize lifestyles list (supports multiple lifestyles)
    if (['character', 'contact', 'follower'].includes(actorData.type)) {
      if (!context.system.resources) context.system.resources = {};

      const legacyLifestyle = context.system.resources.lifestyle || "street";
      const legacyMonths = context.system.creation?.lifestyleMonths ?? 1;

      const rawLifestyles = context.system.resources.lifestyles;
      if (!Array.isArray(rawLifestyles) || rawLifestyles.length === 0) {
        context.system.resources.lifestyles = [{
          type: legacyLifestyle,
          months: Math.max(1, parseInt(legacyMonths, 10) || 1)
        }];
      } else {
        context.system.resources.lifestyles = rawLifestyles.map(l => ({
          type: l?.type || legacyLifestyle,
          months: Math.max(1, parseInt(l?.months, 10) || 1)
        }));
      }
    }

    // Prepare character data and items
    if (['character', 'contact', 'follower'].includes(actorData.type)) {
      this._prepareItems(context);
      this._prepareCharacterData(context);
      await this._prepareSkillsData(context);
    }

    // Racial modifiers/caps and creation point tracking
    if (['character', 'contact', 'follower'].includes(actorData.type)) {
      const metatype = context.system?.details?.metatype || "human";
      const bounds = sr2GetRacialAttributeBounds(metatype);

      // Apply racial min/max to displayed attributes (Body/Quickness/Strength/Charisma/Intelligence/Willpower)
      for (const [key, { min, max }] of Object.entries(bounds)) {
        if (!context.system.attributes?.[key]) continue;
        context.system.attributes[key].min = min;
        context.system.attributes[key].max = max;
      }

      // Leader display (followers)
      context.leaderId = context.system?.details?.leaderId || "";
      context.leaderName = "";
      if (actorData.type === "follower" && context.leaderId && game?.actors) {
        const leader = game.actors.get(context.leaderId);
        context.leaderName = leader?.name || "";
      }

      // Followers list (leaders)
      if (actorData.type === "character" && game?.actors) {
        const linkedActors = game.actors.filter(a => a.system?.details?.leaderId === this.actor.id);

        context.leaderContacts = linkedActors
          .filter(a => a.type === "contact")
          .map(a => ({ id: a.id, name: a.name }))
          .sort((a, b) => a.name.localeCompare(b.name));

        const linkedFollowers = linkedActors
          .filter(a => a.type === "follower")
          .map(a => ({
            id: a.id,
            name: a.name,
            archetype: a.system?.details?.archetype || ""
          }))
          .sort((a, b) => a.name.localeCompare(b.name));

        context.leaderGangMembers = linkedFollowers.filter(f => f.archetype === "gangMember");
        context.leaderFollowers = linkedFollowers.filter(f => f.archetype !== "gangMember");
      }
      if (!Array.isArray(context.leaderContacts)) context.leaderContacts = [];
      if (!Array.isArray(context.leaderGangMembers)) context.leaderGangMembers = [];
      if (!Array.isArray(context.leaderFollowers)) context.leaderFollowers = [];

      const attributePointsTotal = Number(context.system.creation?.attributePoints) || 0;
      const skillPointsTotal = Number(context.system.creation?.skillPoints) || 0;
      const forcePointsTotal = Number(context.system.creation?.forcePoints) || 0;

      const attributePointsSpent = sr2ComputeAttributePointsSpent(context.system.attributes, metatype);
      const skillPointsSpent = sr2ComputeSkillPointsSpent(context.skills || []);
      const forcePointsSpent = sr2ComputeForcePointsSpent(context.items || []);

      context.creationPoints = {
        attributes: {
          total: attributePointsTotal,
          spent: attributePointsSpent,
          remaining: attributePointsTotal - attributePointsSpent
        },
        skills: {
          total: skillPointsTotal,
          spent: skillPointsSpent,
          remaining: skillPointsTotal - skillPointsSpent
        },
        force: {
          total: forcePointsTotal,
          spent: forcePointsSpent,
          remaining: forcePointsTotal - forcePointsSpent
        }
      };

      // Racial summary string for quick reference
      const mods = sr2GetRacialModifiers(metatype);
      const traits = sr2GetRacialTraits(metatype);
      const modParts = [
        ["Body", mods.body],
        ["Quickness", mods.quickness],
        ["Strength", mods.strength],
        ["Charisma", mods.charisma],
        ["Intelligence", mods.intelligence],
        ["Willpower", mods.willpower]
      ].filter(([, v]) => Number(v) !== 0);

      const traitParts = [];
      if (traits.lowLightVision) traitParts.push("Low-Light Vision");
      if (traits.thermographicVision) traitParts.push("Thermographic Vision");
      if (traits.reach) traitParts.push(`Reach +${traits.reach}`);
      if (traits.dermalArmor) traitParts.push(`Dermal Armor (+${traits.dermalArmor} Body vs damage)`);
      if (traits.diseaseResistance) traitParts.push(`Disease Resistance (+${traits.diseaseResistance} Body vs disease)`);

      const modsText = modParts.length
        ? `Racial Mods: ${modParts.map(([label, v]) => `${label} ${sr2FormatSignedModifier(v)}`).join(", ")}`
        : "";
      const traitsText = traitParts.length ? `Traits: ${traitParts.join(", ")}` : "";
      context.racialSummary = [modsText, traitsText].filter(Boolean).join(" | ");

      // Creation resources helpers (lifestyle + extras)
      context.creationResources = sr2ComputeCreationNuyenBudgetBreakdown(context.system, context.items);
    }

    return context;
  }



  /**
   * Organize and classify Items for Character sheets.
   */
  _prepareItems(context) {
    const gear = [];
    const weapons = [];
    const armor = [];
    const cyberware = [];
    const bioware = [];
    const spells = [];
    const adeptpowers = [];
    const skills = [];

    for (let i of context.items) {
      i.img = i.img || "icons/svg/item-bag.svg";

      if (i.type === 'skill') {
        skills.push(i);
      } else if (i.type === 'weapon') {
        weapons.push(i);
      } else if (i.type === 'armor') {
        armor.push(i);
      } else if (i.type === 'cyberware') {
        cyberware.push(i);
      } else if (i.type === 'bioware') {
        bioware.push(i);
      } else if (i.type === 'spell') {
        i.sr2Spell = {
          range: sr2InferSpellRangeFromName(i.name),
          resist: sr2InferSpellResistFromType(i.system?.type),
          damage: sr2InferSpellDamageLevelFromDrain(i.system?.drain),
          drainDisplay: sr2FormatSpellDrain(i.system?.drain)
        };
        spells.push(i);
      } else if (i.type === 'adeptpower') {
        // Calculate total cost for leveled powers
        if (i.system.hasLevels) {
          i.system.totalCost = i.system.cost * i.system.currentLevel;
        } else {
          i.system.totalCost = i.system.cost;
        }
        adeptpowers.push(i);
      } else if (i.type === 'gear') {
        gear.push(i);
      }
    }

    context.gear = gear;
    context.weapons = weapons;
    context.armor = armor;
    context.cyberware = cyberware;
    context.bioware = bioware;
    context.spells = spells;
    context.adeptpowers = adeptpowers;
    context.skills = skills;

    // Prepare totem data for shamanic magicians
    const totems = [];
    for (let i of context.items) {
      if (i.type === 'totem') {
        totems.push(i);
      }
    }
    context.totems = totems;

    // Find selected totem
    context.selectedTotem = totems.find(t => t.system.isSelected);

    const round2 = (value) => Math.round((value + Number.EPSILON) * 100) / 100;

    // Calculate essence loss from installed cyberware
    const installedCyberware = cyberware.filter(c => c.system.installed);
    const totalEssenceLoss = round2(installedCyberware.reduce((total, cyber) => {
      return total + (parseFloat(cyber.system.essence) || 0);
    }, 0));

    // Calculate current essence (base essence - cyberware essence loss)
    const baseEssence = Number(context.system?.attributes?.essence?.max) || 6;
    const currentEssence = round2(Math.max(0, baseEssence - totalEssenceLoss));

    // Avoid Document updates during getData/render; derived Essence is handled in SR2Actor.prepareDerivedData.
    if (context.system?.attributes?.essence) {
      context.system.attributes.essence.value = currentEssence;
    }

    context.essenceData = {
      base: baseEssence,
      current: currentEssence,
      loss: totalEssenceLoss,
      available: currentEssence
    };

    // Calculate total power points used for adept powers
    context.powerPointsUsed = adeptpowers.reduce((total, power) => {
      return total + (power.system.totalCost || 0);
    }, 0);

    // Calculate gear summary statistics
    context.totalWeight = context.items.reduce((total, item) => {
      return total + ((item.system.weight || 0) * (item.system.quantity || 1));
    }, 0);

    context.totalValue = context.items.reduce((total, item) => {
      return total + ((item.system.price || 0) * (item.system.quantity || 1));
    }, 0);

    context.totalItems = context.items.reduce((total, item) => {
      return total + (item.system.quantity || 1);
    }, 0);
  }

  /**
   * Prepare character specific data
   */
  _prepareCharacterData(context) {
    // Calculate and display augmentation modifiers
    const modifiers = this.actor._sr2AugmentationModifiers ?? this.actor._calculateAugmentationModifiers();
    context.augmentationModifiers = modifiers;

    // Calculate total modified attributes for display
    const attrs = context.system.attributes;
    context.modifiedAttributes = {
      body: attrs.body.value + (modifiers.BOD || 0),
      quickness: attrs.quickness.value + (modifiers.QCK || 0),
      strength: attrs.strength.value + (modifiers.STR || 0),
      charisma: attrs.charisma.value + (modifiers.CHA || 0),
      intelligence: attrs.intelligence.value + (modifiers.INT || 0),
      willpower: attrs.willpower.value + (modifiers.WIL || 0),
      reaction: attrs.reaction.value, // Already includes modifiers
      initiativeDice: 1 + (modifiers.INI || 0)
    };

    // Check for cyberdeck (for Hacking Pool visibility)
    context.system.hasCyberdeck = this.actor.items.some(item => 
      item.type === 'cyberware' && 
      item.name.toLowerCase().includes('cyberdeck')
    );

    // Check for Vehicle Control Rig (for Control Pool visibility)
    context.system.hasControlRig = this.actor.items.some(item => 
      item.type === 'cyberware' && 
      (item.name.toLowerCase().includes('control rig') || 
       item.name.toLowerCase().includes('vehicle control rig'))
    );
  }

  /**
   * Prepare skills data for the template
   */
  async _prepareSkillsData(context) {
    // Load the skills data from the JSON file
    try {
      const skillsData = await loadSkillsData();
      const availableSkills = foundry.utils.deepClone(skillsData);
      const hasMagic = (Number(this.actor.system?.attributes?.magic?.value) || 0) > 0;

      // Only characters with a Magic rating may take Sorcery/Conjuring (SR2 core).
      for (const key of ["Sorcery", "Conjuring"]) {
        if (!availableSkills[key]) continue;
        availableSkills[key].disabled = !hasMagic;
      }

      context.availableSkills = availableSkills;

      // Add concentration data for each skill
      context.skills.forEach(skill => {
        if (skill.system.baseSkill && skillsData[skill.system.baseSkill]) {
          skill.availableConcentrations = skillsData[skill.system.baseSkill].Concentrations || [];
        } else {
          skill.availableConcentrations = [];
        }

        // Ensure all skill system properties exist with defaults
        if (!skill.system.baseSkill) skill.system.baseSkill = '';
        if (!skill.system.concentration) skill.system.concentration = '';
        if (!skill.system.specialization) skill.system.specialization = '';
        if (typeof skill.system.baseRating !== 'number') skill.system.baseRating = 0;
        if (typeof skill.system.concentrationRating !== 'number') skill.system.concentrationRating = 0;
        if (typeof skill.system.specializationRating !== 'number') skill.system.specializationRating = 0;
        if (typeof skill.system.isFree !== 'boolean') skill.system.isFree = false;

        // Ensure allocated rating exists in the template context and compute SR2 conc/spec math for display
        const computed = sr2ComputeSkillRatingsFromAllocated(skill.system);
        skill.system.allocatedRating = computed.allocatedRating;
        skill.system.baseRating = computed.baseRating;
        skill.system.concentrationRating = computed.concentrationRating;
        skill.system.specializationRating = computed.specializationRating;
      });
    } catch (error) {
      console.error('SR2E | Failed to load skills data:', error);
      context.availableSkills = {};
    }
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Initialize health data if needed
    this._initializeHealthData();

    // Set up actor update listener for external changes (once per sheet instance)
    if (!this._hasActorUpdateHook && globalThis.Hooks) {
      Hooks.on('updateActor', this._boundOnActorUpdate);
      this._hasActorUpdateHook = true;
    }

    // Ensure skill selects show correct values after render
    this._refreshSkillSelects(html);

    // Rollable abilities
    html.find('.rollable').click(this._onRoll.bind(this));

    // Drag events for macros
    if (this.actor.isOwner) {
      let handler = ev => this._onDragStart(ev);
      
      // Enable drag for all item types
      const itemSelectors = [
        'li.item',           // Generic items
        '.item-row',         // Weapons, armor, gear, cyberware, bioware, spells, adept powers
        '.skill-item',       // Skills
        '.program-row'       // Programs (for cyberdeck sheets)
      ];
      
      itemSelectors.forEach(selector => {
        html.find(selector).each((i, element) => {
          // Skip headers and elements without item IDs
          if (element.classList.contains("inventory-header") || 
              element.classList.contains("header") ||
              !element.dataset.itemId) return;
              
          element.setAttribute("draggable", true);
          element.addEventListener("dragstart", handler, false);
          
          // Add visual feedback for draggable items
          element.style.cursor = "grab";
        });
      });
    }

    // Everything below here is only needed if the sheet is editable
    if (!this.isEditable) return;

    // Add Inventory Item
    html.find('.item-create').click(this._onItemCreate.bind(this));

    // Delete Inventory Item
    html.find('.item-delete').click(async ev => {
      ev.preventDefault();
      ev.stopPropagation();

      try {
        // Get item ID from button's data attribute or parent element
        const button = $(ev.currentTarget);

        // Try multiple ways to get the item ID
        let itemId = button.attr("data-item-id") ||
          button.data("item-id") ||
          button.data("itemId") ||
          button.parents(".item, .skill-item, .item-row").attr("data-item-id") ||
          button.parents(".item, .skill-item, .item-row").data("item-id") ||
          button.parents(".item, .skill-item, .item-row").data("itemId");

        console.log("SR2E | Delete item button clicked, itemId:", itemId);
        console.log("SR2E | Button data attributes:", button.get(0).dataset);
        console.log("SR2E | Available items:", this.actor.items.map(i => ({ id: i.id, name: i.name, type: i.type })));

        if (!itemId) {
          console.warn("SR2E | No item ID found for delete operation");
          ui.notifications.error("Could not find item to delete. Check console for details.");
          return;
        }

        const item = this.actor.items.get(itemId);
        if (item) {
          // Confirm deletion for important items
          const confirmDelete = game.settings.get("core", "noCanvas") ||
            confirm(`Delete ${item.name}?`);

          if (confirmDelete) {
            await item.delete();
            const row = button.parents(".item, .skill-item, .item-row");
            row.slideUp(200, () => this.render(false));
            ui.notifications.info(`${item.name} deleted successfully.`);
          }
        } else {
          console.warn(`SR2E | Item with ID ${itemId} not found in actor items`);
          console.warn("SR2E | Available item IDs:", this.actor.items.map(i => i.id));
          ui.notifications.error(`Could not find item with ID: ${itemId}`);
        }
      } catch (error) {
        console.error("SR2E | Error deleting item:", error);
        ui.notifications.error("Failed to delete item. Check console for details.");
      }
    });

    // Active Effect management
    html.find(".effect-control").click(ev => onManageActiveEffect(ev, this.actor));

    // Pool management
    html.find('.pool-adjust').click(this._onPoolAdjust.bind(this));
    html.find('.reset-all-pools').click(this._onResetAllPools.bind(this));

    // Skill management
    html.find('.base-skill-select').change(this._onBaseSkillChange.bind(this));
    html.find('.concentration-select').change(this._onConcentrationChange.bind(this));
    html.find('input[name*="specialization"]:not([name*="Rating"])').on('change', this._onSpecializationChange.bind(this));
    html.find('input[name*="allocatedRating"]').on('change', this._onSkillAllocatedRatingChange.bind(this));
    html.find('input[name*="allocatedRating"]').on('blur', this._onSkillAllocatedRatingChange.bind(this));
    html.find('input[name*="allocatedRating"]').on('input', this._onSkillAllocatedRatingInput.bind(this));
    html.find('.skill-roll').click(this._onSkillRoll.bind(this));

    // Leader quick-open (followers)
    html.find('.open-leader').click(this._onOpenLeader.bind(this));
    html.find('.open-connection').click(this._onOpenConnection.bind(this));

    // Creation resources finalization
    html.find('.finalize-resources').click(this._onFinalizeResources.bind(this));
    html.find('.unfinalize-resources').click(this._onUnfinalizeResources.bind(this));

    // Lifestyle management (creation resources)
    if (['character', 'contact', 'follower'].includes(this.actor.type)) {
      html.find('.sr2-lifestyle-add').click(this._onLifestyleAdd.bind(this));
      html.find('.sr2-lifestyle-delete').click(this._onLifestyleDelete.bind(this));
    }

    // Handle form submission to ensure skill data is saved
    html.find('form').on('submit', this._onFormSubmit.bind(this));

    // Attribute rolls
    html.find('.attribute-roll').click(this._onAttributeRoll.bind(this));

    // Item browser
    html.find('.browse-items').click(this._onBrowseItems.bind(this));

    // Spell casting
    html.find('.spell-cast').click(this._onSpellCast.bind(this));

    // Weapon attacks
    html.find('.weapon-attack').click(this._onWeaponAttack.bind(this));

    // Range calculator
    html.find('.range-weapon-select').change(this._onRangeWeaponChange.bind(this));
    html.find('.range-distance').on('input', this._onRangeDistanceChange.bind(this));

    // Totem management
    html.find('.browse-totems').click(this._onBrowseTotems.bind(this));
    html.find('.change-totem').click(this._onBrowseTotems.bind(this));

    // Cyberware installation management
    html.find('.cyberware-installed').change(this._onCyberwareInstall.bind(this));
    html.find('.bioware-installed').change(this._onBiowareInstall.bind(this));

    // Damage box click handlers - use event delegation to handle clicks on child elements
    html.find('.damage-boxes').on('click', '.damage-box, .damage-box *', this._onDamageBoxClick.bind(this));

    // Damage box keyboard navigation
    html.find('.damage-box').keydown(this._onDamageBoxKeydown.bind(this));

    // Damage boxes focus management
    html.find('.damage-boxes').on('focusin', this._onDamageBoxesFocusIn.bind(this));

    // Initiative roll button
    html.find('.initiative-roll-btn').click(this._onInitiativeRoll.bind(this));
  }

  /**
   * Handle creating a new Owned Item for the actor using initial data defined in the HTML dataset
   */
  async _onItemCreate(event) {
    event.preventDefault();
    event.stopPropagation();

    if (this._creatingEmbeddedItem) return;

    this._creatingEmbeddedItem = true;
    const createButton = event.currentTarget;
    createButton.setAttribute('aria-disabled', 'true');
    const header = event.currentTarget;
    const type = header.dataset.type;
    const data = foundry.utils.deepClone(header.dataset);
    const typeLabel = type ? type.charAt(0).toUpperCase() + type.slice(1) : 'Item';
    const name = `New ${typeLabel}`;
    const itemData = {
      name: name,
      type: type,
      system: data
    };
    delete itemData.system["type"];

    try {
      const [created] = await this.actor.createEmbeddedDocuments('Item', [itemData]);
      await this.render(false);
      return created;
    } finally {
      this._creatingEmbeddedItem = false;
      createButton.removeAttribute('aria-disabled');
    }
  }

  /**
   * Handle clickable rolls
   */
  _onRoll(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const dataset = element.dataset;

    // Handle item rolls
    if (dataset.rollType) {
      if (dataset.rollType == 'item') {
        const itemId = element.closest('.item').dataset.itemId;
        const item = this.actor.items.get(itemId);
        if (item) return item.roll();
      }
    }

    // Handle rolls that supply the formula directly
    if (dataset.roll) {
      let label = dataset.label ? `[ability] ${dataset.label}` : '';
      let roll = new Roll(dataset.roll, this.actor.getRollData());
      roll.toMessage({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        flavor: label,
        rollMode: game.settings.get('core', 'rollMode'),
      });
      return roll;
    }
  }

  /**
   * Handle pool adjustments
   */
  _onPoolAdjust(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const poolType = element.dataset.pool;
    const adjustment = parseInt(element.dataset.adjust);

    const currentValue = this.actor.system.pools[poolType].current;
    const maxValue = this.actor.system.pools[poolType].max;
    const newValue = Math.clamped(currentValue + adjustment, 0, maxValue);

    this.actor.update({ [`system.pools.${poolType}.current`]: newValue });
  }

  /**
   * Reset all pools to maximum (GM only)
   */
  async _onResetAllPools(event) {
    event.preventDefault();

    // Check conditions for pool visibility
    const magicAttribute = this.actor.system.attributes.magic?.value || 0;
    const isSpellcaster = Boolean(this.actor.system.magic?.awakened) && !Boolean(this.actor.system.magic?.physicalAdept);
    const hasCyberdeck = this.actor.items.some(item => 
      item.type === 'cyberware' && 
      item.name.toLowerCase().includes('cyberdeck')
    );
    const hasControlRig = this.actor.items.some(item => 
      item.type === 'cyberware' && 
      (item.name.toLowerCase().includes('control rig') || 
       item.name.toLowerCase().includes('vehicle control rig'))
    );

    // Build list of available pools for confirmation dialog
    const availablePools = [];
    if (true) availablePools.push('Combat');
    if (isSpellcaster && magicAttribute > 0) availablePools.push('Spell');
    if (hasCyberdeck) availablePools.push('Hacking');
    if (hasControlRig) availablePools.push('Control');
    if ((this.actor.system.pools.task?.max || 0) > 0) availablePools.push('Task');
    if (isSpellcaster && magicAttribute > 0) availablePools.push('Astral');

    // Confirm with GM before resetting
    const confirmed = await Dialog.confirm({
      title: "Reset All Pools",
      content: `<p>Are you sure you want to reset all dice pools to maximum for <strong>${this.actor.name}</strong>?</p>
                <p>This will restore the following pools to their maximum values:</p>
                <p><em>${availablePools.join(', ')}</em></p>`,
      yes: () => true,
      no: () => false,
      defaultYes: false
    });

    if (!confirmed) return;

    // Build update data for available pools only
    const updateData = {};
    const poolData = this.actor.system.pools;

    // Define pool types with their visibility conditions
    const poolTypes = [
      { key: 'combat', condition: true },
      { key: 'spell', condition: isSpellcaster && magicAttribute > 0 },
      { key: 'hacking', condition: hasCyberdeck },
      { key: 'control', condition: hasControlRig },
      { key: 'task', condition: (poolData.task?.max || 0) > 0 },
      { key: 'astral', condition: isSpellcaster && magicAttribute > 0 }
    ];

    const resetPools = [];
    poolTypes.forEach(poolType => {
      if (poolType.condition && poolData[poolType.key]) {
        updateData[`system.pools.${poolType.key}.current`] = poolData[poolType.key].max;
        resetPools.push(poolType.key);
      }
    });

    // Update the actor
    await this.actor.update(updateData);

    // Show confirmation message
    ui.notifications.info(`All available dice pools reset to maximum for ${this.actor.name}`);

    // Optional: Create chat message for transparency
    ChatMessage.create({
      user: game.user.id,
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      content: `<div class="pool-reset-message">
        <h3>🔄 Pools Reset</h3>
        <p><strong>${this.actor.name}'s</strong> dice pools have been reset to maximum by the GM.</p>
        <ul>
          ${resetPools.map(type => {
        const pool = poolData[type];
        return pool && pool.max > 0 ? `<li>${type.charAt(0).toUpperCase() + type.slice(1)} Pool: ${pool.max}/${pool.max}</li>` : '';
      }).filter(item => item).join('')}
        </ul>
      </div>`,
      whisper: [game.user.id] // Only visible to GM
    });
  }

  /**
   * Handle base skill selection change
   */
  async _onBaseSkillChange(event) {
    event.preventDefault();
    event.stopPropagation();
    const element = event.currentTarget;
    const skillId = element.dataset.skillId;
    const baseSkill = element.value;
    const item = this.actor.items.get(skillId);

    if (item) {
      // Only clear concentration and specialization if the base skill actually changed
      const currentBaseSkill = item.system.baseSkill;

      if (currentBaseSkill !== baseSkill) {
        // Prevent duplicate base skills (Languages may have multiple entries)
        if (baseSkill && baseSkill !== "Language") {
          const duplicate = this.actor.items.some(i =>
            i.type === "skill" &&
            i.id !== item.id &&
            i.system?.baseSkill === baseSkill
          );
          if (duplicate) {
            ui.notifications.warn(`"${baseSkill}" is already on the sheet. Each skill can only be acquired once.`);
            element.value = currentBaseSkill || "";
            return;
          }
        }

        // Clear concentration and specialization when base skill changes
        const nextSystem = {
          ...item.system,
          baseSkill: baseSkill,
          concentration: "",
          specialization: ""
        };

        const computed = sr2ComputeSkillRatingsFromAllocated(nextSystem);
        await item.update({
          'system.baseSkill': baseSkill,
          'system.concentration': "",
          'system.specialization': "",
          'system.allocatedRating': computed.allocatedRating,
          'system.baseRating': computed.baseRating,
          'system.concentrationRating': computed.concentrationRating,
          'system.specializationRating': computed.specializationRating,
          'name': baseSkill || 'New Skill'
        });
      } else {
        // Even if the base skill didn't change, make sure the select shows the correct value
        element.value = baseSkill;
      }
    } else {
      console.error("SR2E | Could not find skill item for base skill change:", skillId);
    }
  }

  /**
   * Handle concentration selection change
   */
  async _onConcentrationChange(event) {
    event.preventDefault();
    event.stopPropagation();
    const element = event.currentTarget;
    const skillId = element.dataset.skillId || element.closest('.skill-item').dataset.itemId;
    const concentration = element.value;
    const item = this.actor.items.get(skillId);

    if (!item) {
      console.error("SR2E | Could not find skill item for concentration change:", skillId);
      return;
    }

    if (item.system.isFree) {
      element.value = item.system.concentration || "";
      return;
    }

    if (item.system.concentration === concentration) return;

    const baseSkill = item.system.baseSkill || "";
    if (baseSkill === "Language") {
      element.value = "";
      return;
    }

    const currentAllocated = sr2SkillInferAllocatedRating(item.system);
    let nextAllocated = currentAllocated;

    // Clearing concentration also clears specialization (SR2: spec implies concentration)
    const nextSpecialization = concentration ? (item.system.specialization || "") : "";

    // If a concentration is selected, ensure allocated rating supports it (min 2)
    const computedPreview = sr2ComputeSkillRatingsFromAllocated({
      ...item.system,
      concentration,
      specialization: nextSpecialization,
      allocatedRating: nextAllocated
    });

    if (baseSkill && nextAllocated < computedPreview.minAllocated) {
      nextAllocated = computedPreview.minAllocated;
    }

    if (this._isCreationMode() && (Number(this.actor.system.creation?.skillPoints) || 0) > 0) {
      const total = Number(this.actor.system.creation?.skillPoints) || 0;
      const spentOther = this._getSkillPointsSpentExcluding(item.id);
      const maxForThis = total - spentOther;

      if (maxForThis < computedPreview.minAllocated) {
        ui.notifications.error("Not enough Skill Points remaining. Reduce other skills first.");
        element.value = item.system.concentration || "";
        return;
      }

      nextAllocated = Math.min(nextAllocated, 6, maxForThis);
      nextAllocated = Math.max(nextAllocated, computedPreview.minAllocated);
    }

    const computed = sr2ComputeSkillRatingsFromAllocated({
      ...item.system,
      concentration,
      specialization: nextSpecialization,
      allocatedRating: nextAllocated
    });

    await item.update({
      "system.concentration": concentration,
      "system.specialization": nextSpecialization,
      "system.allocatedRating": computed.allocatedRating,
      "system.baseRating": computed.baseRating,
      "system.concentrationRating": computed.concentrationRating,
      "system.specializationRating": computed.specializationRating
    });
  }

  /**
   * Handle specialization text change
   */
  async _onSpecializationChange(event) {
    event.preventDefault();
    event.stopPropagation();
    const element = event.currentTarget;
    const skillId = element.dataset.skillId || element.closest('.skill-item').dataset.itemId;
    const specialization = element.value;
    const item = this.actor.items.get(skillId);

    if (!item) {
      console.error("SR2E | Could not find skill item for specialization change:", skillId);
      return;
    }

    if (item.system.isFree) {
      element.value = item.system.specialization || "";
      return;
    }

    if (item.system.specialization === specialization) return;

    const baseSkill = item.system.baseSkill || "";
    if (baseSkill === "Language") {
      element.value = "";
      return;
    }

    if (specialization && !item.system.concentration) {
      ui.notifications.warn("Specialization requires a Concentration.");
      element.value = "";
      return;
    }

    const currentAllocated = sr2SkillInferAllocatedRating(item.system);
    let nextAllocated = currentAllocated;

    const computedPreview = sr2ComputeSkillRatingsFromAllocated({
      ...item.system,
      specialization,
      allocatedRating: nextAllocated
    });

    if (baseSkill && specialization && nextAllocated < computedPreview.minAllocated) {
      nextAllocated = computedPreview.minAllocated;
    }

    if (this._isCreationMode() && (Number(this.actor.system.creation?.skillPoints) || 0) > 0) {
      const total = Number(this.actor.system.creation?.skillPoints) || 0;
      const spentOther = this._getSkillPointsSpentExcluding(item.id);
      const maxForThis = total - spentOther;

      if (maxForThis < computedPreview.minAllocated) {
        ui.notifications.error("Not enough Skill Points remaining. Reduce other skills first.");
        element.value = item.system.specialization || "";
        return;
      }

      nextAllocated = Math.min(nextAllocated, 6, maxForThis);
      nextAllocated = Math.max(nextAllocated, computedPreview.minAllocated);
    }

    const computed = sr2ComputeSkillRatingsFromAllocated({
      ...item.system,
      specialization,
      allocatedRating: nextAllocated
    });

    await item.update({
      "system.specialization": specialization,
      "system.allocatedRating": computed.allocatedRating,
      "system.baseRating": computed.baseRating,
      "system.concentrationRating": computed.concentrationRating,
      "system.specializationRating": computed.specializationRating
    });
  }

  /**
   * Refresh skill select elements to ensure they show correct values
   */
  _refreshSkillSelects(html) {
    // Ensure base skill selects show the correct selected values
    html.find('.base-skill-select').each((i, select) => {
      const skillId = select.dataset.skillId;
      const skill = this.actor.items.get(skillId);
      if (skill && skill.system.baseSkill) {
        select.value = skill.system.baseSkill;
      }
    });

    // Ensure concentration selects show the correct selected values
    html.find('.concentration-select').each((i, select) => {
      const skillId = select.dataset.skillId;
      const skill = this.actor.items.get(skillId);
      if (skill && skill.system.concentration) {
        select.value = skill.system.concentration;
      }
    });
  }

  _isCreationMode() {
    const flag = this.actor.getFlag("shadowrun2e", "creationMode");
    if (typeof flag === "boolean") return flag;

    const creation = this.actor.system?.creation;
    return Boolean(
      (creation?.attributePoints || 0) > 0 ||
      (creation?.skillPoints || 0) > 0 ||
      (creation?.forcePoints || 0) > 0
    );
  }

  _getSkillPointsSpentExcluding(excludeItemId) {
    return this.actor.items
      .filter(i => i.type === "skill" && i.id !== excludeItemId)
      .reduce((sum, skill) => {
        if (!skill.system?.baseSkill) return sum;
        if (skill.system?.isFree) return sum;
        return sum + sr2SkillInferAllocatedRating(skill.system);
      }, 0);
  }

  /**
   * Handle allocated skill rating changes (SR2 skill point spending)
   */
  async _onSkillAllocatedRatingChange(event) {
    event.preventDefault();
    event.stopPropagation();

    const element = event.currentTarget;
    const skillId = element.closest('.skill-item')?.dataset?.itemId;
    const item = skillId ? this.actor.items.get(skillId) : null;
    if (!item) return;
    if (item.system.isFree) {
      element.value = sr2SkillInferAllocatedRating(item.system);
      return;
    }

    const baseSkill = item.system.baseSkill || "";
    const oldAllocated = sr2SkillInferAllocatedRating(item.system);
    let nextAllocated = parseInt(element.value, 10);
    if (!Number.isFinite(nextAllocated)) nextAllocated = 0;

    const preview = { ...item.system, allocatedRating: nextAllocated };
    const computedPreview = sr2ComputeSkillRatingsFromAllocated(preview);

    // Starting skills must have a minimum rating (SR2 p. 45). Allow 0 only if no base skill selected.
    const minAllocated = baseSkill ? computedPreview.minAllocated : 0;
    const maxAllocated = this._isCreationMode() ? 6 : 12;

    nextAllocated = sr2Clamp(nextAllocated, minAllocated, maxAllocated);

    if (this._isCreationMode() && (Number(this.actor.system.creation?.skillPoints) || 0) > 0 && baseSkill) {
      const total = Number(this.actor.system.creation?.skillPoints) || 0;
      const spentOther = this._getSkillPointsSpentExcluding(item.id);
      const maxForThis = total - spentOther;

      if (maxForThis < minAllocated) {
        ui.notifications.error("Not enough Skill Points remaining. Reduce other skills first.");
        element.value = oldAllocated;
        return;
      }

      nextAllocated = Math.min(nextAllocated, maxForThis);
    }

    const computed = sr2ComputeSkillRatingsFromAllocated({ ...item.system, allocatedRating: nextAllocated });

    await item.update({
      "system.allocatedRating": computed.allocatedRating,
      "system.baseRating": computed.baseRating,
      "system.concentrationRating": computed.concentrationRating,
      "system.specializationRating": computed.specializationRating
    });
  }

  _onSkillAllocatedRatingInput(event) {
    const element = event.currentTarget;
    const rating = parseInt(element.value, 10);
    if (!Number.isFinite(rating)) {
      element.style.borderColor = '';
      return;
    }

    const maxAllocated = this._isCreationMode() ? 6 : 12;
    if (rating < 0 || rating > maxAllocated) {
      element.style.borderColor = '#ff6b6b';
    } else {
      element.style.borderColor = '';
    }
  }

  _onOpenLeader(event) {
    event.preventDefault();
    event.stopPropagation();

    const leaderId = event.currentTarget?.dataset?.leaderId;
    const leader = leaderId ? game?.actors?.get(leaderId) : null;
    if (!leader) {
      ui.notifications.warn("Leader not found.");
      return;
    }

    leader.sheet?.render(true);
  }

  _onOpenConnection(event) {
    event.preventDefault();
    event.stopPropagation();

    const actorId = event.currentTarget?.dataset?.actorId;
    const actor = actorId ? game?.actors?.get(actorId) : null;
    if (!actor) {
      ui.notifications.warn("Actor not found.");
      return;
    }

    actor.sheet?.render(true);
  }

  async _onFinalizeResources(event) {
    event.preventDefault();
    event.stopPropagation();

    const budget = Number(this.actor.system?.creation?.startingNuyen) || 0;
    if (budget <= 0) return;
    if (this.actor.system?.creation?.resourcesFinalized) return;

    const breakdown = sr2ComputeCreationNuyenBudgetBreakdown(this.actor.system, this.actor.items);
    if ((breakdown.remainingNuyen || 0) < 0) {
      ui.notifications.error("Resource Budget exceeded. Reduce item/lifestyle/extras spending first.");
      return;
    }

    const unspentNuyen = Math.max(0, Math.floor(breakdown.remainingNuyen || 0));
    const startingCashFromUnspent = Math.floor(unspentNuyen / 10);

    const roll = await (new Roll("3d6")).evaluate({ async: true });
    const startingCashRoll = (Number(roll.total) || 0) * 1000;
    const startingCashFinal = startingCashFromUnspent + startingCashRoll;

    await this.actor.update({
      "system.creation.resourcesFinalized": true,
      "system.creation.unspentNuyen": unspentNuyen,
      "system.creation.startingCashFromUnspent": startingCashFromUnspent,
      "system.creation.startingCashRoll": startingCashRoll,
      "system.creation.startingCashFinal": startingCashFinal,
      "system.resources.nuyen": startingCashFinal
    });

    ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      flavor: `${this.actor.name} finalizes starting cash`,
      content: `<p>Unspent: ${unspentNuyen}¥ → ÷10 = ${startingCashFromUnspent}¥</p>
                <p>Roll (3D6×1,000¥): ${startingCashRoll}¥</p>
                <p><strong>Total Starting Cash:</strong> ${startingCashFinal}¥</p>`
    });

    ui.notifications.info(`Resources finalized: ${startingCashFinal}¥ starting cash.`);
  }

  async _onUnfinalizeResources(event) {
    event.preventDefault();
    event.stopPropagation();

    if (!this.actor.system?.creation?.resourcesFinalized) return;

    const restoredBudget = Number(this.actor.system?.creation?.startingNuyen) || 0;
    await this.actor.update({
      "system.creation.resourcesFinalized": false,
      "system.creation.unspentNuyen": 0,
      "system.creation.startingCashFromUnspent": 0,
      "system.creation.startingCashRoll": 0,
      "system.creation.startingCashFinal": 0,
      ...(restoredBudget > 0 ? { "system.resources.nuyen": restoredBudget } : {})
    });

    ui.notifications.info("Resource budget reopened.");
  }

  _getNormalizedLifestylesFromActor() {
    const rawLifestyles = this.actor.system?.resources?.lifestyles;
    if (Array.isArray(rawLifestyles) && rawLifestyles.length) {
      return foundry.utils.deepClone(rawLifestyles).map(l => ({
        type: l?.type || "street",
        months: Math.max(1, parseInt(l?.months, 10) || 1)
      }));
    }

    const legacyLifestyle = this.actor.system?.resources?.lifestyle || "street";
    const legacyMonths = this.actor.system?.creation?.lifestyleMonths ?? 1;
    return [{
      type: legacyLifestyle,
      months: Math.max(1, parseInt(legacyMonths, 10) || 1)
    }];
  }

  async _onLifestyleAdd(event) {
    event.preventDefault();
    event.stopPropagation();

    const lifestyles = this._getNormalizedLifestylesFromActor();
    lifestyles.push({ type: "street", months: 1 });

    const primary = lifestyles[0] || { type: "street", months: 1 };
    await this.actor.update({
      "system.resources.lifestyles": lifestyles,
      "system.resources.lifestyle": primary.type || "street",
      "system.creation.lifestyleMonths": primary.months || 1
    });
  }

  async _onLifestyleDelete(event) {
    event.preventDefault();
    event.stopPropagation();

    const index = parseInt(event.currentTarget?.dataset?.index, 10);
    if (!Number.isFinite(index)) return;

    const lifestyles = this._getNormalizedLifestylesFromActor();
    lifestyles.splice(index, 1);
    if (!lifestyles.length) lifestyles.push({ type: "street", months: 1 });

    const primary = lifestyles[0] || { type: "street", months: 1 };
    await this.actor.update({
      "system.resources.lifestyles": lifestyles,
      "system.resources.lifestyle": primary.type || "street",
      "system.creation.lifestyleMonths": primary.months || 1
    });
  }

  /**
   * Handle form submission to ensure all data is properly saved
   */
  async _onFormSubmit(event) {
    console.log("SR2E | Form submitted");
    // Let the default form submission handle the data
    // Our _updateObject method will process it
  }

  /**
   * Handle skill roll
   */
  async _onSkillRoll(event) {
    event.preventDefault();
    const skillId = event.currentTarget.dataset.skillId;
    const rollType = event.currentTarget.dataset.rollType || 'base';

    console.log("SR2E | Skill roll requested - ID:", skillId, "Type:", rollType);

    // Get the skill item and force a fresh read
    let skill = this.actor.items.get(skillId);

    if (!skill) {
      console.error("SR2E | Skill not found for roll:", skillId);
      ui.notifications.error("Skill not found for roll");
      return;
    }

    // Sorcery/Conjuring require a Magic rating.
    const baseSkillName = skill.system?.baseSkill || "";
    const magicRating = Number(this.actor.system?.attributes?.magic?.value) || 0;
    if ((baseSkillName === "Sorcery" || baseSkillName === "Conjuring") && magicRating <= 0) {
      ui.notifications.error("Sorcery and Conjuring require a Magic rating.");
      return;
    }

    // If the user edited the allocated rating without blurring, prefer the form value for this roll.
    const formElement = event.currentTarget.closest('form');
    if (formElement) {
      const allocatedRatingInput = formElement.querySelector(`input[name*="${skillId}"][name*="allocatedRating"]`);
      if (allocatedRatingInput) {
        const allocated = parseInt(allocatedRatingInput.value, 10);
        const currentAllocated = sr2SkillInferAllocatedRating(skill.system);
        if (Number.isFinite(allocated) && allocated !== currentAllocated) {
          const computed = sr2ComputeSkillRatingsFromAllocated({ ...skill.system, allocatedRating: allocated });
          skill = {
            ...skill,
            system: {
              ...skill.system,
              allocatedRating: computed.allocatedRating,
              baseRating: computed.baseRating,
              concentrationRating: computed.concentrationRating,
              specializationRating: computed.specializationRating
            }
          };
        }
      }
    }

    let skillRating = 0;
    let title = skill.name || skill.system.baseSkill || 'Unknown Skill';
    let rollDescription = '';

    console.log("SR2E | Rolling skill:", skill.name, "Type:", rollType);
    console.log("SR2E | Using skill data:", JSON.stringify(skill.system, null, 2));

    // Determine which rating to use based on roll type
    switch (rollType) {
      case 'base':
        skillRating = parseInt(skill.system.baseRating) || 0;
        rollDescription = 'Base Skill';
        title = skill.system.baseSkill || skill.name || 'Unknown Skill';
        if (skill.system.baseSkill === "Language" && skill.name) {
          title = skill.name;
        }
        console.log(`SR2E | Base skill roll: baseRating=${skill.system.baseRating}, parsed=${skillRating}`);
        break;
      case 'concentration':
        skillRating = parseInt(skill.system.concentrationRating) || 0;
        if (skill.system.concentration) {
          title = `${skill.system.baseSkill || skill.name} (${skill.system.concentration})`;
          rollDescription = 'Concentration';
          console.log(`SR2E | Concentration roll: concentrationRating=${skill.system.concentrationRating}, parsed=${skillRating}`);
        } else {
          ui.notifications.warn("No concentration selected for this skill.");
          return;
        }
        break;
      case 'specialization':
        skillRating = parseInt(skill.system.specializationRating) || 0;
        if (skill.system.specialization) {
          title = `${skill.system.baseSkill || skill.name} [${skill.system.specialization}]`;
          rollDescription = 'Specialization';
          console.log(`SR2E | Specialization roll: specializationRating=${skill.system.specializationRating}, parsed=${skillRating}`);
        } else {
          ui.notifications.warn("No specialization entered for this skill.");
          return;
        }
        break;
    }

    console.log("SR2E | Skill rating for roll:", skillRating, "Roll type:", rollType);

    // Calculate dice pool - skills roll only their rating in SR2E
    let dicePool = skillRating;

    // Ensure minimum dice pool of 1 (defaulting skill)
    if (dicePool < 1) {
      dicePool = 1;
      console.log("SR2E | Using defaulting dice pool of 1");
    }

    // Add roll type to title
    const finalTitle = `${title} (${rollDescription})`;

    console.log("SR2E | Final dice pool:", dicePool, "Title:", finalTitle);

    // Show TN selection dialog and roll
    await this._showTargetNumberDialog(dicePool, finalTitle, 'skill');
  }

  /**
   * Handle attribute roll
   */
  async _onAttributeRoll(event) {
    event.preventDefault();
    const attributeName = event.currentTarget.dataset.attribute;
    const attributeValue = Number(this.actor.system.attributes[attributeName]?.value) || 1;

    // Use modified attribute value if available (includes cyberware bonuses)
    const modifiers = this.actor._calculateAugmentationModifiers();
    let modifierValue = 0;

    // Map attribute names to modifier keys
    const modifierMap = {
      'body': 'BOD',
      'quickness': 'QCK',
      'strength': 'STR',
      'charisma': 'CHA',
      'intelligence': 'INT',
      'willpower': 'WIL',
      'reaction': 'RCT'
    };

    if (modifierMap[attributeName]) {
      // Reaction is already derived (includes modifiers) in `SR2Actor.prepareDerivedData`.
      // Avoid double-counting RCT/attribute modifiers on Reaction tests.
      if (attributeName !== 'reaction') {
        modifierValue = modifiers[modifierMap[attributeName]] || 0;
      }
    }

    // Attributes roll their rating as dice pool (including modifiers)
    let dicePool = attributeValue + modifierValue;

    // Ensure minimum dice pool of 1
    if (dicePool < 1) {
      dicePool = 1;
    }

    const title = `${attributeName.charAt(0).toUpperCase() + attributeName.slice(1)} Test`;

    // Show TN selection dialog and roll
    await this._showTargetNumberDialog(dicePool, title, 'attribute');
  }

  /**
   * Get available pools for dice rolling
   */
  _getAvailablePools() {
    const pools = [];
    const poolData = this.actor.system.pools;
    const magicAttribute = this.actor.system.attributes.magic?.value || 0;

    // Check for cyberdeck and control rig
    const hasCyberdeck = this.actor.items.some(item => 
      item.type === 'cyberware' && 
      item.name.toLowerCase().includes('cyberdeck')
    );
    
    const hasControlRig = this.actor.items.some(item => 
      item.type === 'cyberware' && 
      (item.name.toLowerCase().includes('control rig') || 
       item.name.toLowerCase().includes('vehicle control rig'))
    );

    // Define pool types with their visibility conditions
    const poolTypes = [
      { key: 'karma', name: 'Karma Pool', maxKey: 'total', condition: true },
      { key: 'combat', name: 'Combat Pool', maxKey: 'max', condition: true },
      { key: 'spell', name: 'Spell Pool', maxKey: 'max', condition: magicAttribute > 0 },
      { key: 'hacking', name: 'Hacking Pool', maxKey: 'max', condition: hasCyberdeck },
      { key: 'control', name: 'Control Pool', maxKey: 'max', condition: hasControlRig },
      { key: 'task', name: 'Task Pool', maxKey: 'max', condition: (poolData.task?.max || 0) > 0 },
      { key: 'astral', name: 'Astral Combat Pool', maxKey: 'max', condition: magicAttribute > 0 }
    ];

    poolTypes.forEach(poolType => {
      // Only add pools that meet their visibility condition
      if (poolType.condition) {
        const pool = poolData[poolType.key];
        if (pool) {
          pools.push({
            key: poolType.key,
            name: poolType.name,
            current: pool.current || 0,
            max: pool[poolType.maxKey] || 0
          });
        }
      }
    });

    return pools;
  }

  /**
   * Show Target Number selection dialog
   */
  async _showTargetNumberDialog(dicePool, title, rollType, defaultTN = 4, weaponData = null) {
    const availablePools = this._getAvailablePools();
    const isRangedAttack = rollType === 'attack' && weaponData && weaponData.system.weaponType === 'ranged';

    const rangedModifiersSection = isRangedAttack ? `
      <div class="ranged-modifiers-section">
        <h4><strong>Ranged Combat Modifiers:</strong></h4>
        <div class="modifier-grid">
          <div class="modifier-group">
            <label><strong>Recoil:</strong></label>
            <select name="recoil-modifier" class="modifier-select">
              <option value="0">None</option>
              <option value="1">Semi-automatic (+1)</option>
              <option value="2">Burst-fire (+2)</option>
              <option value="3">Full-auto (+3)</option>
              <option value="2">Heavy weapon (+2)</option>
            </select>
          </div>
          
          <div class="modifier-group">
            <label><strong>Visibility:</strong></label>
            <select name="visibility-modifier" class="modifier-select">
              <option value="0">Clear</option>
              <option value="8">Blind Fire (+8)</option>
            </select>
          </div>
          
          <div class="modifier-group">
            <label><strong>Cover:</strong></label>
            <select name="cover-modifier" class="modifier-select">
              <option value="0">None</option>
              <option value="4">Partial Cover (+4)</option>
            </select>
          </div>
          
          <div class="modifier-group">
            <label><strong>Multiple Targets:</strong></label>
            <select name="multiple-targets-modifier" class="modifier-select">
              <option value="0">Single Target</option>
              <option value="2">2 Targets (+2)</option>
              <option value="4">3 Targets (+4)</option>
              <option value="6">4 Targets (+6)</option>
              <option value="8">5 Targets (+8)</option>
              <option value="10">6+ Targets (+10)</option>
            </select>
          </div>
          
          <div class="modifier-group">
            <label><strong>Target Movement:</strong></label>
            <select name="target-movement-modifier" class="modifier-select">
              <option value="0">Normal</option>
              <option value="2">Target Running (+2)</option>
              <option value="-1">Target Stationary (-1)</option>
            </select>
          </div>
          
          <div class="modifier-group">
            <label><strong>Attacker in Melee:</strong></label>
            <select name="attacker-melee-modifier" class="modifier-select">
              <option value="0">Not in Melee</option>
              <option value="2">1 Opponent (+2)</option>
              <option value="4">2 Opponents (+4)</option>
              <option value="6">3 Opponents (+6)</option>
              <option value="8">4+ Opponents (+8)</option>
            </select>
          </div>
          
          <div class="modifier-group">
            <label><strong>Attacker Movement:</strong></label>
            <select name="attacker-movement-modifier" class="modifier-select">
              <option value="0">Stationary</option>
              <option value="1">Walking (+1)</option>
              <option value="2">Walking, Difficult Ground (+2)</option>
              <option value="4">Running (+4)</option>
              <option value="6">Running, Difficult Ground (+6)</option>
            </select>
          </div>
          
          <div class="modifier-group">
            <label><strong>Weapon Accessories:</strong></label>
            <select name="accessories-modifier" class="modifier-select">
              <option value="0">None</option>
              <option value="-2">Smartlink w/ Smartgun (-2)</option>
              <option value="-1">Smart Goggles w/ Smartgun (-1)</option>
              <option value="-1">Laser Sight (-1)</option>
            </select>
          </div>
          
          <div class="modifier-group">
            <label><strong>Other Modifiers:</strong></label>
            <select name="other-modifier" class="modifier-select">
              <option value="0">None</option>
              <option value="2">Using Second Firearm (+2)</option>
              <option value="-1">Aimed Shot, 1 Phase (-1)</option>
              <option value="-2">Aimed Shot, 2 Phases (-2)</option>
              <option value="-3">Aimed Shot, 3 Phases (-3)</option>
              <option value="-4">Aimed Shot, 4+ Phases (-4)</option>
            </select>
          </div>
        </div>
        <div class="total-modifier">
          <strong>Total TN Modifier: <span id="total-tn-modifier">+0</span></strong>
        </div>
      </div>
    ` : '';

    const content = `
      <div class="target-number-dialog">
        <div class="roll-info">
          <h3>${title}</h3>
          <p><strong>Base Dice Pool:</strong> ${dicePool}</p>
        </div>
        
        <div class="target-number-section">
          <label for="target-number"><strong>Base Target Number:</strong></label>
          <select id="target-number" name="targetNumber">
            <option value="2" ${defaultTN === 2 ? 'selected' : ''}>2 - Trivial</option>
            <option value="3" ${defaultTN === 3 ? 'selected' : ''}>3 - Easy</option>
            <option value="4" ${defaultTN === 4 ? 'selected' : ''}>4 - Average</option>
            <option value="5" ${defaultTN === 5 ? 'selected' : ''}>5 - Fair</option>
            <option value="6" ${defaultTN === 6 ? 'selected' : ''}>6 - Hard</option>
            <option value="7" ${defaultTN === 7 ? 'selected' : ''}>7 - Extreme</option>
            <option value="8" ${defaultTN === 8 ? 'selected' : ''}>8 - Nearly Impossible</option>
            <option value="9" ${defaultTN === 9 ? 'selected' : ''}>9 - Impossible</option>
            <option value="10" ${defaultTN === 10 ? 'selected' : ''}>10 - Miraculous</option>
            <option value="11" ${defaultTN === 11 ? 'selected' : ''}>11</option>
            <option value="12" ${defaultTN === 12 ? 'selected' : ''}>12</option>
            <option value="13" ${defaultTN === 13 ? 'selected' : ''}>13</option>
            <option value="14" ${defaultTN === 14 ? 'selected' : ''}>14</option>
            <option value="15" ${defaultTN === 15 ? 'selected' : ''}>15</option>
            <option value="16" ${defaultTN === 16 ? 'selected' : ''}>16</option>
            <option value="17" ${defaultTN === 17 ? 'selected' : ''}>17</option>
            <option value="18" ${defaultTN === 18 ? 'selected' : ''}>18</option>
            <option value="19" ${defaultTN === 19 ? 'selected' : ''}>19</option>
            <option value="20" ${defaultTN === 20 ? 'selected' : ''}>20</option>
            <option value="21" ${defaultTN === 21 ? 'selected' : ''}>21</option>
            <option value="22" ${defaultTN === 22 ? 'selected' : ''}>22</option>
            <option value="23" ${defaultTN === 23 ? 'selected' : ''}>23</option>
            <option value="24" ${defaultTN === 24 ? 'selected' : ''}>24</option>
            <option value="25" ${defaultTN === 25 ? 'selected' : ''}>25</option>
            <option value="26" ${defaultTN === 26 ? 'selected' : ''}>26</option>
            <option value="27" ${defaultTN === 27 ? 'selected' : ''}>27</option>
            <option value="28" ${defaultTN === 28 ? 'selected' : ''}>28</option>
            <option value="29" ${defaultTN === 29 ? 'selected' : ''}>29</option>
            <option value="30" ${defaultTN === 30 ? 'selected' : ''}>30</option>
          </select>
        </div>

        ${rangedModifiersSection}

        ${availablePools.length > 0 ? `
        <div class="pool-dice-section">
          <label><strong>Pool Dice (Optional):</strong></label>
          ${availablePools.map(pool => `
            <div class="pool-option">
              <label>
                <input type="checkbox" name="pool-${pool.key}" value="${pool.key}" class="pool-checkbox">
                ${pool.name} (${pool.current}/${pool.max})
              </label>
              <input type="number" name="pool-${pool.key}-dice" 
                     min="0" max="${pool.current}" value="0" disabled class="pool-dice-input">
            </div>
          `).join('')}
        </div>
        ` : ''}
      </div>
    `;

    const dialog = new Dialog({
      title: `${title} - Target Number Selection`,
      content: content,
      render: (html) => {
        // Handle pool checkbox interactions
        html.find('.pool-checkbox').change(function () {
          const isChecked = $(this).is(':checked');
          const poolKey = $(this).val();
          const diceInput = html.find(`input[name="pool-${poolKey}-dice"]`);
          const pool = availablePools.find(p => p.key === poolKey);

          if (isChecked) {
            diceInput.prop('disabled', false);
            // Only default to 1 if the pool has dice available
            if (pool && pool.current > 0) {
              diceInput.val(1);
            } else {
              diceInput.val(0);
            }
          } else {
            diceInput.prop('disabled', true);
            diceInput.val(0);
          }
        });

        // Handle ranged modifier calculations
        if (isRangedAttack) {
          const updateTotalModifier = () => {
            let totalModifier = 0;
            html.find('.modifier-select').each(function() {
              totalModifier += parseInt($(this).val()) || 0;
            });
            html.find('#total-tn-modifier').text(totalModifier >= 0 ? `+${totalModifier}` : `${totalModifier}`);
          };

          html.find('.modifier-select').change(updateTotalModifier);
          updateTotalModifier(); // Initial calculation
        }
      },
      buttons: {
        roll: {
          icon: '<i class="fas fa-dice-d6"></i>',
          label: "Roll",
          callback: async (html) => {
            let baseTargetNumber = parseInt(html.find('#target-number').val());
            const diceModifier = parseInt(html.find('#dice-modifier').val()) || 0;
            let finalDicePool = dicePool + diceModifier;

            // Calculate ranged combat modifiers if applicable
            let tnModifier = 0;
            let modifierDetails = [];
            
            if (isRangedAttack) {
              const recoilMod = parseInt(html.find('select[name="recoil-modifier"]').val()) || 0;
              const visibilityMod = parseInt(html.find('select[name="visibility-modifier"]').val()) || 0;
              const coverMod = parseInt(html.find('select[name="cover-modifier"]').val()) || 0;
              const multipleTargetsMod = parseInt(html.find('select[name="multiple-targets-modifier"]').val()) || 0;
              const targetMovementMod = parseInt(html.find('select[name="target-movement-modifier"]').val()) || 0;
              const attackerMeleeMod = parseInt(html.find('select[name="attacker-melee-modifier"]').val()) || 0;
              const attackerMovementMod = parseInt(html.find('select[name="attacker-movement-modifier"]').val()) || 0;
              const accessoriesMod = parseInt(html.find('select[name="accessories-modifier"]').val()) || 0;
              const otherMod = parseInt(html.find('select[name="other-modifier"]').val()) || 0;

              tnModifier = recoilMod + visibilityMod + coverMod + multipleTargetsMod + 
                          targetMovementMod + attackerMeleeMod + attackerMovementMod + 
                          accessoriesMod + otherMod;

              // Build modifier details for display
              if (recoilMod !== 0) modifierDetails.push(`Recoil: ${recoilMod >= 0 ? '+' : ''}${recoilMod}`);
              if (visibilityMod !== 0) modifierDetails.push(`Visibility: ${visibilityMod >= 0 ? '+' : ''}${visibilityMod}`);
              if (coverMod !== 0) modifierDetails.push(`Cover: ${coverMod >= 0 ? '+' : ''}${coverMod}`);
              if (multipleTargetsMod !== 0) modifierDetails.push(`Multiple Targets: ${multipleTargetsMod >= 0 ? '+' : ''}${multipleTargetsMod}`);
              if (targetMovementMod !== 0) modifierDetails.push(`Target Movement: ${targetMovementMod >= 0 ? '+' : ''}${targetMovementMod}`);
              if (attackerMeleeMod !== 0) modifierDetails.push(`Attacker in Melee: ${attackerMeleeMod >= 0 ? '+' : ''}${attackerMeleeMod}`);
              if (attackerMovementMod !== 0) modifierDetails.push(`Attacker Movement: ${attackerMovementMod >= 0 ? '+' : ''}${attackerMovementMod}`);
              if (accessoriesMod !== 0) modifierDetails.push(`Accessories: ${accessoriesMod >= 0 ? '+' : ''}${accessoriesMod}`);
              if (otherMod !== 0) modifierDetails.push(`Other: ${otherMod >= 0 ? '+' : ''}${otherMod}`);
            }

            const finalTargetNumber = Math.max(2, baseTargetNumber + tnModifier);

            // Handle pool dice
            const poolsUsed = [];
            let totalPoolDice = 0;

            availablePools.forEach(pool => {
              const checkbox = html.find(`input[name="pool-${pool.key}"]`);
              const diceInput = html.find(`input[name="pool-${pool.key}-dice"]`);

              if (checkbox.is(':checked')) {
                const diceUsed = parseInt(diceInput.val()) || 0;
                // Validate that we don't use more dice than available
                const actualDiceUsed = Math.min(diceUsed, pool.current);
                if (actualDiceUsed > 0) {
                  totalPoolDice += actualDiceUsed;
                  poolsUsed.push({ pool: pool, dice: actualDiceUsed });
                }
              }
            });

            // Add pool dice to final dice pool
            finalDicePool += totalPoolDice;

            // Ensure minimum dice pool of 1
            if (finalDicePool < 1) {
              finalDicePool = 1;
            }

            // Update actor's pool values
            if (poolsUsed.length > 0) {
              const updateData = {};
              poolsUsed.forEach(({ pool, dice }) => {
                const newCurrent = Math.max(0, pool.current - dice);
                updateData[`system.pools.${pool.key}.current`] = newCurrent;
              });
              await this.actor.update(updateData);
            }

            // Create enhanced title with pool info and modifiers
            let finalTitle = `${title} (TN ${finalTargetNumber})`;
            if (tnModifier !== 0) {
              finalTitle += ` [Base TN ${baseTargetNumber} ${tnModifier >= 0 ? '+' : ''}${tnModifier}]`;
            }
            if (poolsUsed.length > 0) {
              const poolInfo = poolsUsed.map(({ pool, dice }) => `${dice} ${pool.name}`).join(', ');
              finalTitle += ` [+${totalPoolDice} from ${poolInfo}]`;
            }

            // Roll the dice
            this.actor.rollDice(finalDicePool, finalTargetNumber, finalTitle);

            // Show modifier breakdown in chat if there were ranged modifiers
            if (isRangedAttack && modifierDetails.length > 0) {
              const modifierChatData = {
                user: game.user.id,
                speaker: ChatMessage.getSpeaker({ actor: this.actor }),
                content: `
                  <div class="ranged-modifiers-breakdown">
                    <h4>Ranged Combat Modifiers Applied:</h4>
                    <ul>
                      ${modifierDetails.map(detail => `<li>${detail}</li>`).join('')}
                    </ul>
                    <p><strong>Total TN Modifier: ${tnModifier >= 0 ? '+' : ''}${tnModifier}</strong></p>
                  </div>
                `
              };
              ChatMessage.create(modifierChatData);
            }
          }
        },
        cancel: {
          icon: '<i class="fas fa-times"></i>',
          label: "Cancel"
        }
      },
      default: "roll",
      render: (html) => {
        // Enable/disable pool dice inputs when checkboxes are toggled
        html.find('input[type="checkbox"]').change(function () {
          const diceInput = html.find(`input[name="${this.name}-dice"]`);
          diceInput.prop('disabled', !this.checked);
          if (!this.checked) {
            diceInput.val(0);
          }
        });
      }
    });

    dialog.render(true);
  }

  /**
   * Handle opening item browser
   */
  async _onBrowseItems(event) {
    event.preventDefault();
    const itemType = event.currentTarget.dataset.type;

    try {
      // Import the item browser dynamically
      const { SR2ItemBrowser } = await import("/systems/shadowrun2e/scripts/item-browser.js");
      const browser = new SR2ItemBrowser(this.actor, itemType);
      browser.render(true);
    } catch (error) {
      console.error("SR2E | Failed to open item browser", error);
      ui.notifications.error("Item browser is unavailable (see console).");
    }
  }

  /**
   * Handle spell casting
   */
  async _onSpellCast(event) {
    event.preventDefault();
    const spellId = event.currentTarget.dataset.itemId;
    const spell = this.actor.items.get(spellId);

    if (!spell) return;

    try {
      const force = Math.max(1, Number(spell.system.force) || 1);
      const magicRating = Number(this.actor.system.attributes.magic.value) || 0;
      const sorcerySkill = this._getHighestSorcerySkill();

      // Calculate dice pool for spellcasting - in SR2E, use only the sorcery skill rating
      if (magicRating <= 0) {
        ui.notifications.error("This character has no Magic rating.");
        return;
      }
      if (sorcerySkill <= 0) {
        ui.notifications.error("Sorcery skill is required to cast spells.");
        return;
      }

      const dicePool = sorcerySkill;

      const title = `Casting ${spell.name} (Force ${force})`;

      // Show TN selection dialog and roll for spellcasting
      await this._showTargetNumberDialog(dicePool, title, 'spell', 4);

      // Calculate drain
      const drainValue = this._calculateDrain(spell.system.drain, force);
      const drainPool = this.actor.system.attributes.willpower.value + magicRating;

      // Show TN selection dialog and roll drain resistance
      const drainTitle = `Drain Resistance for ${spell.name}`;
      await this._showTargetNumberDialog(drainPool, drainTitle, 'drain', drainValue);
    } catch (error) {
      console.error("SR2E | Failed to cast spell", error);
      ui.notifications.error("Spell casting failed (see console).");
    }
  }

  /**
   * Get the highest Sorcery skill rating
   */
  _getHighestSorcerySkill() {
    const sorcerySkills = this.actor.items.filter(i =>
      i.type === 'skill' && i.system.baseSkill === 'Sorcery'
    );

    if (sorcerySkills.length === 0) return 0;

    return Math.max(...sorcerySkills.map(skill => {
      const baseRating = skill.system.baseRating || 0;
      const concRating = skill.system.concentrationRating || 0;
      const specRating = skill.system.specializationRating || 0;
      return Math.max(baseRating, concRating, specRating);
    }));
  }

  /**
   * Handle weapon attacks
   */
  async _onWeaponAttack(event) {
    event.preventDefault();
    const weaponId = event.currentTarget.dataset.itemId;
    const weapon = this.actor.items.get(weaponId);

    if (!weapon) return;

    // Get relevant attributes
    const strength = this.actor.system.attributes.strength.value || 1;
    const quickness = this.actor.system.attributes.quickness.value || 1;

    // Determine if it's a melee or ranged weapon
    const isRanged = weapon.system.weaponType === 'ranged';
    const attribute = isRanged ? quickness : strength;

    let skillRating = 0;
    let skillName = 'Defaulting';
    let rollDescription = '';

    // Check if weapon has a linked skill
    if (weapon.system.linkedSkill?.skillId) {
      const linkedSkill = this.actor.items.get(weapon.system.linkedSkill.skillId);

      if (linkedSkill) {
        const rollType = weapon.system.linkedSkill.rollType || 'base';

        // Get skill rating based on roll type
        switch (rollType) {
          case 'base':
            skillRating = Number(linkedSkill.system.baseRating) || 0;
            skillName = linkedSkill.name || linkedSkill.system.baseSkill || 'Unknown Skill';
            rollDescription = 'Base Skill';
            break;
          case 'concentration':
            skillRating = Number(linkedSkill.system.concentrationRating) || 0;
            if (linkedSkill.system.concentration) {
              skillName = `${linkedSkill.name || linkedSkill.system.baseSkill} (${linkedSkill.system.concentration})`;
              rollDescription = 'Concentration';
            } else {
              ui.notifications.warn(`${weapon.name} is linked to a skill with no concentration selected.`);
              skillRating = 0;
              skillName = 'Defaulting';
              rollDescription = 'No Concentration';
            }
            break;
          case 'specialization':
            skillRating = Number(linkedSkill.system.specializationRating) || 0;
            if (linkedSkill.system.specialization) {
              skillName = `${linkedSkill.name || linkedSkill.system.baseSkill} [${linkedSkill.system.specialization}]`;
              rollDescription = 'Specialization';
            } else {
              ui.notifications.warn(`${weapon.name} is linked to a skill with no specialization entered.`);
              skillRating = 0;
              skillName = 'Defaulting';
              rollDescription = 'No Specialization';
            }
            break;
        }
      } else {
        ui.notifications.warn(`${weapon.name} is linked to a skill that no longer exists.`);
      }
    } else {
      // Fall back to automatic skill detection for backwards compatibility
      const combatSkills = this.actor.items.filter(i =>
        i.type === 'skill' &&
        (i.system.baseSkill === 'Armed Combat' ||
          i.system.baseSkill === 'Firearms' ||
          i.system.baseSkill === 'Projectile Weapons')
      );

      if (combatSkills.length > 0) {
        // Use the highest applicable combat skill
        const bestSkill = combatSkills.reduce((best, current) => {
          const currentRating = Number(current.system.baseRating) || 0;
          const bestRating = Number(best.system.baseRating) || 0;
          return currentRating > bestRating ? current : best;
        });

        skillRating = Number(bestSkill.system.baseRating) || 0;
        skillName = bestSkill.name || bestSkill.system.baseSkill;
        rollDescription = 'Auto-detected';
      }
    }

    // Calculate dice pool - in SR2E, only use skill rating (not attribute + skill)
    const dicePool = skillRating;

    // Create attack title
    const attackType = isRanged ? 'Ranged Attack' : 'Melee Attack';
    const title = `${attackType} with ${weapon.name}`;
    const subtitle = skillRating > 0 ? `${skillName} (${rollDescription})` : 'Defaulting to Attribute Only';

    // Show TN selection dialog and roll for attack
    await this._showTargetNumberDialog(dicePool, `${title} - ${subtitle}`, 'attack', 4, weapon);

    // Display weapon damage in chat
    const damageCode = weapon.system.damage || "1L";
    const chatData = {
      user: game.user.id,
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      content: `
        <div class="weapon-attack">
          <h3>${weapon.name} Attack</h3>
          <p><strong>Skill Used:</strong> ${skillName} ${rollDescription ? `(${rollDescription})` : ''}</p>
          <p><strong>Dice Pool:</strong> ${skillRating} (Skill Only)</p>
          <p><strong>Damage Code:</strong> ${damageCode}</p>
        </div>
      `
    };

    ChatMessage.create(chatData);

    // Handle ammo consumption for ranged weapons
    if (isRanged && weapon.system.ammo && weapon.system.ammo.current > 0) {
      const newAmmo = weapon.system.ammo.current - 1;
      await weapon.update({ 'system.ammo.current': newAmmo });

      if (newAmmo === 0) {
        ui.notifications.warn(`${weapon.name} is out of ammunition!`);
      }
    }
  }

  /**
   * Handle range weapon selection change
   */
  async _onRangeWeaponChange(event) {
    event.preventDefault();
    const weaponId = event.currentTarget.value;
    const rangeType = event.currentTarget.selectedOptions[0]?.dataset.rangeType;

    if (!weaponId || !rangeType) {
      this._hideRangeBands();
      return;
    }

    try {
      // Load ranges data and display range bands
      const rangesData = await this._loadRangesData();
      if (rangesData && rangesData[rangeType]) {
        this._displayRangeBands(rangesData[rangeType]);
        this._calculateRangeCategory();
      }
    } catch (error) {
      console.error("SR2E | Failed to update range bands", error);
      ui.notifications.error("Range calculator failed (see console).");
    }
  }

  /**
   * Handle distance input change
   */
  _onRangeDistanceChange(event) {
    event.preventDefault();
    try {
      this._calculateRangeCategory();
    } catch (error) {
      console.error("SR2E | Failed to update range category", error);
      ui.notifications.error("Range calculator failed (see console).");
    }
  }

  /**
   * Load ranges data from JSON file
   */
  async _loadRangesData() {
    if (this.rangesData) {
      return this.rangesData;
    }

    try {
      const response = await fetch('/systems/shadowrun2e/data/ranges.json');
      this.rangesData = await response.json();
      return this.rangesData;
    } catch (error) {
      console.error('Failed to load ranges data:', error);
      return null;
    }
  }

  /**
   * Display range bands for selected weapon
   */
  _displayRangeBands(rangeData) {
    const rangeBands = document.getElementById('range-bands');
    if (!rangeBands) return;

    document.getElementById('short-range').textContent = rangeData.short;
    document.getElementById('medium-range').textContent = rangeData.medium;
    document.getElementById('long-range').textContent = rangeData.long;
    document.getElementById('extreme-range').textContent = rangeData.extreme;

    rangeBands.style.display = 'grid';
  }

  /**
   * Hide range bands
   */
  _hideRangeBands() {
    const rangeBands = document.getElementById('range-bands');
    if (rangeBands) {
      rangeBands.style.display = 'none';
    }

    const rangeCategory = document.getElementById('range-category');
    const rangeModifier = document.getElementById('range-modifier');
    if (rangeCategory) rangeCategory.textContent = '-';
    if (rangeModifier) rangeModifier.textContent = '';
  }

  /**
   * Calculate and display range category based on distance
   */
  async _calculateRangeCategory() {
    const weaponSelect = document.getElementById('range-weapon-select');
    const distanceInput = document.getElementById('range-distance');
    const rangeCategorySpan = document.getElementById('range-category');
    const rangeModifierSpan = document.getElementById('range-modifier');

    if (!weaponSelect || !distanceInput || !rangeCategorySpan) return;

    const weaponId = weaponSelect.value;
    const rangeType = weaponSelect.selectedOptions[0]?.dataset.rangeType;
    const distance = parseInt(distanceInput.value);

    if (!weaponId || !rangeType || !distance) {
      rangeCategorySpan.textContent = '-';
      rangeModifierSpan.textContent = '';
      return;
    }

    const rangesData = await this._loadRangesData();
    if (!rangesData || !rangesData[rangeType]) return;

    const ranges = rangesData[rangeType];
    let category = '';
    let modifier = '';
    let categoryClass = '';

    if (distance <= ranges.short) {
      category = 'Short';
      modifier = '(TN 4)';
      categoryClass = 'short';
    } else if (distance <= ranges.medium) {
      category = 'Medium';
      modifier = '(TN 5)';
      categoryClass = 'medium';
    } else if (distance <= ranges.long) {
      category = 'Long';
      modifier = '(TN 6)';
      categoryClass = 'long';
    } else if (distance <= ranges.extreme) {
      category = 'Extreme';
      modifier = '(TN 8)';
      categoryClass = 'extreme';
    } else {
      category = 'Out of Range';
      modifier = '(Impossible)';
      categoryClass = 'impossible';
    }

    rangeCategorySpan.textContent = category;
    rangeCategorySpan.className = `range-category ${categoryClass}`;
    rangeModifierSpan.textContent = modifier;
    rangeModifierSpan.className = `range-modifier ${categoryClass}`;
  }

  /**
   * Handle browsing totems for shamanic magicians
   */
  async _onBrowseTotems(event) {
    event.preventDefault();

    try {
      // Import the item browser dynamically
      const { SR2ItemBrowser } = await import("/systems/shadowrun2e/scripts/item-browser.js");

      // Create a custom item browser with totem selection handling
      const browser = new SR2ItemBrowser(this.actor, 'totem', {});

      // Override the default item creation to handle totem selection
      const originalAddItem = browser.addItem;
      browser.addItem = async (item) => {
        // First, unselect any existing totems
        const existingTotems = this.actor.items.filter(i => i.type === 'totem');
        for (const existingTotem of existingTotems) {
          await existingTotem.update({ 'system.isSelected': false });
        }

        // Then add the new totem and mark it as selected
        const newItem = await originalAddItem.call(browser, item);
        if (newItem) {
          await newItem.update({ 'system.isSelected': true });
        }
        return newItem;
      };

      browser.render(true);
    } catch (error) {
      console.error("SR2E | Failed to open totem browser", error);
      ui.notifications.error("Totem browser is unavailable (see console).");
    }
  }

  /**
   * Handle cyberware installation toggle
   */
  async _onCyberwareInstall(event) {
    event.preventDefault();
    const checkbox = event.currentTarget;
    const itemId = checkbox.dataset.itemId;
    const item = this.actor.items.get(itemId);

    if (!item) return;

    const round2 = (value) => Math.round((value + Number.EPSILON) * 100) / 100;

    const isInstalling = checkbox.checked;
    const essenceCost = round2(parseFloat(item.system.essence) || 0);

    try {
      if (isInstalling) {
        // Check if installing this cyberware would reduce essence below 0.1
        const currentEssence = round2(this.actor.system.attributes.essence.value || 6);
        const remainingEssence = round2(currentEssence - essenceCost);

        if (remainingEssence < 0.1) {
          // Prevent installation
          checkbox.checked = false;
          ui.notifications.error(
            `Cannot install ${item.name}. Essence cost (${essenceCost}) would reduce your Essence below 0.1. ` +
            `Current Essence: ${currentEssence.toFixed(2)}, Required: ${essenceCost.toFixed(2)}`
          );
          return;
        }

        // Show confirmation for significant essence loss
        if (essenceCost >= 1.0) {
          const confirm = await Dialog.confirm({
            title: "Cyberware Installation",
            content: `<p>Installing <strong>${item.name}</strong> will permanently reduce your Essence by <strong>${essenceCost}</strong>.</p>
                     <p>Current Essence: <strong>${currentEssence.toFixed(2)}</strong></p>
                     <p>New Essence: <strong>${remainingEssence.toFixed(2)}</strong></p>
                     <p>This cannot be undone. Continue?</p>`,
            yes: () => true,
            no: () => false
          });

          if (!confirm) {
            checkbox.checked = false;
            return;
          }
        }

        // Install the cyberware
        await item.update({ 'system.installed': true });
        ui.notifications.info(`${item.name} installed. Essence reduced by ${essenceCost}.`);

      } else {
        // Uninstall the cyberware
        const confirm = await Dialog.confirm({
          title: "Cyberware Removal",
          content: `<p>Are you sure you want to remove <strong>${item.name}</strong>?</p>
                   <p>This will restore <strong>${essenceCost}</strong> Essence.</p>
                   <p><em>Note: In Shadowrun, cyberware removal typically requires surgery and may have complications.</em></p>`,
          yes: () => true,
          no: () => false
        });

        if (!confirm) {
          checkbox.checked = true;
          return;
        }

        await item.update({ 'system.installed': false });
        ui.notifications.info(`${item.name} removed. Essence restored by ${essenceCost}.`);
      }

      // Refresh the sheet to update essence display
      this.render(false);
    } catch (error) {
      console.error("SR2E | Failed to toggle cyberware installation", error);
      ui.notifications.error("Cyberware installation failed (see console).");
      checkbox.checked = !!item.system.installed;
      this.render(false);
    }
  }

  /**
   * Handle bioware installation toggle
   */
  async _onBiowareInstall(event) {
    event.preventDefault();
    const checkbox = event.currentTarget;
    const itemId = checkbox.dataset.itemId;
    const item = this.actor.items.get(itemId);

    if (!item) return;

    const isInstalling = checkbox.checked;
    const bioIndex = parseFloat(item.system.bioIndex) || 0;

    try {
      if (isInstalling) {
        // Calculate current Bio Index usage
        const installedBioware = this.actor.items.filter(i =>
          i.type === 'bioware' && i.system.installed && i._id !== itemId
        );
        const currentBioIndex = installedBioware.reduce((total, bio) => {
          return total + (parseFloat(bio.system.bioIndex) || 0);
        }, 0);

        // Bio Index limit is typically equal to Essence (rounded down)
        const essenceValue = Math.floor(this.actor.system.attributes.essence.value || 6);
        const remainingBioIndex = essenceValue - currentBioIndex;

        if (bioIndex > remainingBioIndex) {
          // Prevent installation
          checkbox.checked = false;
          ui.notifications.error(
            `Cannot install ${item.name}. Bio Index cost (${bioIndex}) exceeds available capacity. ` +
            `Available Bio Index: ${remainingBioIndex.toFixed(2)}, Required: ${bioIndex.toFixed(2)}`
          );
          return;
        }

        // Show confirmation for bioware installation
        if (bioIndex >= 1.0) {
          const confirm = await Dialog.confirm({
            title: "Bioware Installation",
            content: `<p>Installing <strong>${item.name}</strong> will use <strong>${bioIndex}</strong> Bio Index.</p>
                     <p>Current Bio Index Used: <strong>${currentBioIndex.toFixed(2)}</strong></p>
                     <p>Bio Index Limit: <strong>${essenceValue}</strong></p>
                     <p>Remaining after installation: <strong>${(remainingBioIndex - bioIndex).toFixed(2)}</strong></p>
                     <p>Continue?</p>`,
            yes: () => true,
            no: () => false
          });

          if (!confirm) {
            checkbox.checked = false;
            return;
          }
        }

        // Install the bioware
        await item.update({ 'system.installed': true });
        ui.notifications.info(`${item.name} installed. Bio Index used: ${bioIndex}.`);

      } else {
        // Uninstall the bioware
        const confirm = await Dialog.confirm({
          title: "Bioware Removal",
          content: `<p>Are you sure you want to remove <strong>${item.name}</strong>?</p>
                   <p>This will free up <strong>${bioIndex}</strong> Bio Index.</p>
                   <p><em>Note: In Shadowrun, bioware removal typically requires surgery and may have complications.</em></p>`,
          yes: () => true,
          no: () => false
        });

        if (!confirm) {
          checkbox.checked = true;
          return;
        }

        await item.update({ 'system.installed': false });
        ui.notifications.info(`${item.name} removed. Bio Index freed: ${bioIndex}.`);
      }

      // Refresh the sheet to update displays
      this.render(false);
    } catch (error) {
      console.error("SR2E | Failed to toggle bioware installation", error);
      ui.notifications.error("Bioware installation failed (see console).");
      checkbox.checked = !!item.system.installed;
      this.render(false);
    }
  }

  /**
   * Calculate drain value from drain code
   */
  _calculateDrain(drainCode, force) {
    if (!drainCode) return 4;

    // Parse drain codes like "(F/2)M", "[(F/2)+1]S", etc.
    let drainValue = 4; // Default

    try {
      // Replace F with force value
      let formula = drainCode.replace(/F/g, force.toString());

      // Remove brackets and damage level indicators
      formula = formula.replace(/[\[\]LMSD]/g, '');

      // Evaluate the mathematical expression
      drainValue = Math.max(2, Math.floor(eval(formula)));
    } catch (error) {
      console.warn(`Could not parse drain code: ${drainCode}`, error);
    }

    return drainValue;
  }

  /**
   * Handle damage box clicks
   */
  async _onDamageBoxClick(event) {
    event.preventDefault();

    // Find the actual damage box element (in case user clicked on a child element)
    let element = event.currentTarget;
    if (!element.classList.contains('damage-box')) {
      element = element.closest('.damage-box');
    }

    if (!element) {
      console.error('SR2E | Could not find damage box element');
      return;
    }

    try {
      // Try to get box number from multiple sources
      let boxNumberStr = element.dataset.boxNumber || element.getAttribute('data-box-number');

      // If we still don't have a box number, try to find it from the element's position
      if (!boxNumberStr) {
        const damageBoxes = element.parentElement.querySelectorAll('.damage-box');
        const index = Array.from(damageBoxes).indexOf(element);
        if (index >= 0) {
          boxNumberStr = (index + 1).toString();
          console.log('SR2E | Box number derived from position:', boxNumberStr);
        }
      }

      // Last resort: try to get it from the text content of the box-number span
      if (!boxNumberStr) {
        const boxNumberSpan = element.querySelector('.box-number');
        if (boxNumberSpan && boxNumberSpan.textContent) {
          boxNumberStr = boxNumberSpan.textContent.trim();
          console.log('SR2E | Box number derived from text content:', boxNumberStr);
        }
      }

      // Validate input parameters
      const boxNumber = parseInt(boxNumberStr);
      const damageBoxesContainer = element.closest('.damage-boxes');

      if (!damageBoxesContainer) {
        throw new Error("Damage box container not found");
      }

      const damageType = damageBoxesContainer.dataset.damageType;

      // Validate box number
      if (isNaN(boxNumber) || boxNumber < 1 || boxNumber > 10) {
        console.error('SR2E | Box number validation failed:', {
          boxNumberStr,
          boxNumber,
          isNaN: isNaN(boxNumber),
          element: element,
          dataset: element.dataset
        });
        throw new Error(`Invalid box number: ${boxNumber}. Must be between 1 and 10.`);
      }

      // Validate damage type
      if (!damageType || !['physical', 'stun'].includes(damageType)) {
        throw new Error(`Invalid damage type: ${damageType}. Must be 'physical' or 'stun'.`);
      }

      // Validate actor data exists and has proper structure
      if (!this.actor) {
        throw new Error("Actor not found");
      }

      if (!this.actor.system) {
        throw new Error("Actor system data not found");
      }

      if (!this.actor.system.health) {
        throw new Error("Actor health data not found");
      }

      if (!this.actor.system.health[damageType]) {
        throw new Error(`Actor ${damageType} health data not found`);
      }

      const currentDamage = this.actor.system.health[damageType].value;

      // Validate current damage value
      if (typeof currentDamage !== 'number' || isNaN(currentDamage)) {
        console.warn(`SR2E | Invalid current ${damageType} damage value: ${currentDamage}, defaulting to 0`);
        // Set a default value and continue
        await this.actor.update({
          [`system.health.${damageType}.value`]: 0
        });
        return;
      }

      let newDamage;

      // If clicking on the current damage level, reset to 0
      if (boxNumber === currentDamage) {
        newDamage = 0;
      } else {
        // Otherwise set damage to the clicked box number
        newDamage = boxNumber;
      }

      // Validate and clamp damage within bounds (0-10)
      if (typeof newDamage !== 'number' || isNaN(newDamage)) {
        throw new Error(`Invalid damage value calculated: ${newDamage}`);
      }

      newDamage = Math.clamped(newDamage, 0, 10);

      // Validate that the new damage value is different from current
      if (newDamage === currentDamage) {
        console.log(`SR2E | ${damageType} damage already at ${newDamage}, no update needed`);
        return;
      }

      // Update the actor's damage value using debounced update system
      try {
        // Use queued update for better concurrent handling
        this._queueUpdate({
          [`system.health.${damageType}.value`]: newDamage
        });

        console.log(`SR2E | Queued ${damageType} damage update from ${currentDamage} to ${newDamage}`);

        // Provide immediate UI feedback
        this._updateDamageBoxDisplay(damageType, newDamage);

        // Provide user feedback for significant damage changes
        if (newDamage >= 8 && currentDamage < 8) {
          ui.notifications.warn(`${this.actor.name} has taken severe ${damageType} damage (${newDamage}/10)!`);
        } else if (newDamage === 10 && currentDamage < 10) {
          ui.notifications.error(`${this.actor.name} has reached maximum ${damageType} damage!`);
        } else if (newDamage === 0 && currentDamage > 0) {
          ui.notifications.info(`${this.actor.name}'s ${damageType} damage has been cleared.`);
        }

      } catch (updateError) {
        console.error(`SR2E | Failed to queue ${damageType} damage update:`, updateError);
        ui.notifications.error(`Failed to update ${damageType} damage. The character sheet may be locked or you may not have permission.`);
        throw updateError;
      }

    } catch (error) {
      console.error("SR2E | Error handling damage box click:", error);
      ui.notifications.error(`Error updating damage: ${error.message}`);

      // Try to refresh the sheet to show current state
      try {
        this.render(false);
      } catch (renderError) {
        console.error("SR2E | Failed to refresh sheet after damage error:", renderError);
      }
    }
  }

  /**
   * Test function to validate damage box functionality
   */
  _testDamageBoxes() {
    console.log('SR2E | Testing damage box functionality...');

    const physicalBoxes = this.element.find('.damage-boxes[data-damage-type="physical"] .damage-box');
    const stunBoxes = this.element.find('.damage-boxes[data-damage-type="stun"] .damage-box');

    console.log('SR2E | Found physical damage boxes:', physicalBoxes.length);
    console.log('SR2E | Found stun damage boxes:', stunBoxes.length);

    physicalBoxes.each((index, element) => {
      const boxNumber = element.dataset.boxNumber || element.getAttribute('data-box-number');
      console.log(`SR2E | Physical box ${index + 1}: data-box-number = ${boxNumber}`);
    });

    stunBoxes.each((index, element) => {
      const boxNumber = element.dataset.boxNumber || element.getAttribute('data-box-number');
      console.log(`SR2E | Stun box ${index + 1}: data-box-number = ${boxNumber}`);
    });
  }

  /**
   * Handle initiative roll button clicks
   */
  async _onInitiativeRoll(event) {
    event.preventDefault();

    try {
      // Validate actor exists and has required data
      if (!this.actor) {
        throw new Error("Actor not found");
      }

      if (!this.actor.system) {
        throw new Error("Actor system data not found");
      }

      // Validate initiative data structure exists
      if (!this.actor.system.initiative) {
        console.warn("SR2E | Initiative data missing, creating default structure");
        await this.actor.update({
          'system.initiative': {
            dice: 1,
            current: 0
          }
        });
      }

      // Validate attributes data structure exists
      if (!this.actor.system.attributes) {
        throw new Error("Actor attributes data not found");
      }

      if (!this.actor.system.attributes.reaction) {
        console.warn("SR2E | Reaction attribute missing, creating default structure");
        await this.actor.update({
          'system.attributes.reaction': {
            value: 1
          }
        });
      }

      // Get initiative dice with validation and sensible defaults
      let initiativeDice = this.actor.system.initiative.dice;

      if (typeof initiativeDice !== 'number' || isNaN(initiativeDice) || initiativeDice < 1) {
        console.warn(`SR2E | Invalid initiative dice value: ${initiativeDice}, defaulting to 1`);
        initiativeDice = 1;
        // Update the actor with the corrected value
        await this.actor.update({
          'system.initiative.dice': 1
        });
      }

      // Cap initiative dice at reasonable maximum (10 dice)
      if (initiativeDice > 10) {
        console.warn(`SR2E | Initiative dice value too high: ${initiativeDice}, capping at 10`);
        initiativeDice = 10;
        await this.actor.update({
          'system.initiative.dice': 10
        });
      }

      // Get reaction bonus with validation and sensible defaults
      let reactionBonus = this.actor.system.attributes.reaction.value;

      if (typeof reactionBonus !== 'number' || isNaN(reactionBonus) || reactionBonus < 0) {
        console.warn(`SR2E | Invalid reaction value: ${reactionBonus}, defaulting to 0`);
        reactionBonus = 0;
        // Update the actor with the corrected value
        await this.actor.update({
          'system.attributes.reaction.value': 0
        });
      }

      // Cap reaction at reasonable maximum (30 for heavily augmented characters)
      if (reactionBonus > 30) {
        console.warn(`SR2E | Reaction value too high: ${reactionBonus}, capping at 30`);
        reactionBonus = 30;
        await this.actor.update({
          'system.attributes.reaction.value': 30
        });
      }

      // Create the roll formula (e.g., "3d6 + 12")
      const rollFormula = `${initiativeDice}d6 + ${reactionBonus}`;

      console.log(`SR2E | Rolling initiative for ${this.actor.name}: ${rollFormula}`);

      // Create and evaluate the roll using Foundry's Roll class
      // Note: Using standard d6 without exploding dice for initiative
      let roll;
      try {
        roll = new Roll(rollFormula);
        await roll.evaluate();
      } catch (rollError) {
        console.error("SR2E | Error creating or evaluating roll:", rollError);
        throw new Error(`Failed to create initiative roll with formula ${rollFormula}: ${rollError.message}`);
      }

      // Validate roll results
      if (!roll || typeof roll.total !== 'number' || isNaN(roll.total)) {
        throw new Error(`Invalid roll result: ${roll?.total}`);
      }

      // Extract dice results with error handling
      let diceResults = [];
      let diceTotal = 0;

      try {
        if (roll.terms && roll.terms[0] && roll.terms[0].results) {
          diceResults = roll.terms[0].results.map(r => r.result);
          diceTotal = diceResults.reduce((sum, die) => sum + die, 0);
        } else {
          // Fallback: calculate dice total from final total minus reaction bonus
          diceTotal = roll.total - reactionBonus;
          diceResults = [`${diceTotal} (total)`];
        }
      } catch (extractError) {
        console.warn("SR2E | Could not extract individual dice results:", extractError);
        diceTotal = roll.total - reactionBonus;
        diceResults = [`${diceTotal} (total)`];
      }

      const finalTotal = roll.total;

      // Validate final total is reasonable
      if (finalTotal < 1 || finalTotal > 100) {
        console.warn(`SR2E | Unusual initiative total: ${finalTotal}`);
      }

      // Update the actor's current initiative with error handling
      try {
        await this.actor.update({
          'system.initiative.current': finalTotal
        });
      } catch (updateError) {
        console.error("SR2E | Failed to update actor initiative:", updateError);
        ui.notifications.error("Failed to save initiative result. You may not have permission to modify this character.");
        // Continue with display and chat message even if update fails
      }

      // Display the result in the UI with error handling
      try {
        this._displayInitiativeResult(diceResults, diceTotal, reactionBonus, finalTotal, rollFormula);
      } catch (displayError) {
        console.error("SR2E | Failed to display initiative result:", displayError);
        ui.notifications.warn("Initiative rolled successfully but display failed. Check chat for results.");
      }

      // Send roll to chat with error handling
      try {
        await roll.toMessage({
          speaker: ChatMessage.getSpeaker({ actor: this.actor }),
          flavor: `${this.actor.name} rolls Initiative`
        });
      } catch (chatError) {
        console.error("SR2E | Failed to send initiative roll to chat:", chatError);
        ui.notifications.warn("Initiative rolled successfully but failed to post to chat.");
      }

      // Automatically add character to initiative tracker with error handling
      try {
        await this._addToInitiativeTracker(finalTotal);
      } catch (trackerError) {
        console.error("SR2E | Failed to add to initiative tracker:", trackerError);
        ui.notifications.warn(`Initiative rolled (${finalTotal}) but failed to add to tracker. You can add manually.`);
      }

      console.log(`SR2E | ${this.actor.name} rolled initiative: ${rollFormula} = ${finalTotal}`);
      ui.notifications.info(`${this.actor.name} rolled initiative: ${finalTotal}`);

    } catch (error) {
      console.error("SR2E | Error rolling initiative:", error);

      // Provide specific error messages based on error type
      let errorMessage = "Failed to roll initiative.";

      if (error.message.includes("not found")) {
        errorMessage = "Character data is missing or corrupted. Try refreshing the sheet.";
      } else if (error.message.includes("permission")) {
        errorMessage = "You don't have permission to modify this character.";
      } else if (error.message.includes("roll")) {
        errorMessage = "Failed to calculate dice roll. Check character's initiative and reaction values.";
      } else {
        errorMessage = `Initiative roll failed: ${error.message}`;
      }

      ui.notifications.error(errorMessage);

      // Try to refresh the sheet to show current state
      try {
        this.render(false);
      } catch (renderError) {
        console.error("SR2E | Failed to refresh sheet after initiative error:", renderError);
      }
    }
  }

  /**
   * Handle keyboard navigation for damage boxes
   */
  _onDamageBoxKeydown(event) {
    const element = event.currentTarget;
    const damageBoxes = element.closest('.damage-boxes');
    const allBoxes = Array.from(damageBoxes.querySelectorAll('.damage-box'));
    const currentIndex = allBoxes.indexOf(element);

    let targetIndex = currentIndex;
    let handled = false;

    switch (event.key) {
      case 'Enter':
      case ' ':
        // Activate the damage box (same as clicking)
        event.preventDefault();
        this._onDamageBoxClick(event);
        handled = true;
        break;

      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault();
        targetIndex = Math.max(0, currentIndex - 1);
        handled = true;
        break;

      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault();
        targetIndex = Math.min(allBoxes.length - 1, currentIndex + 1);
        handled = true;
        break;

      case 'Home':
        event.preventDefault();
        targetIndex = 0;
        handled = true;
        break;

      case 'End':
        event.preventDefault();
        targetIndex = allBoxes.length - 1;
        handled = true;
        break;

      case '0':
      case 'Delete':
      case 'Backspace':
        // Clear all damage
        event.preventDefault();
        const damageType = damageBoxes.dataset.damageType;
        this._clearDamage(damageType);
        handled = true;
        break;

      default:
        // Handle number keys 1-9 for direct damage setting
        if (event.key >= '1' && event.key <= '9') {
          event.preventDefault();
          const boxNumber = parseInt(event.key);
          if (boxNumber <= allBoxes.length) {
            // Create a synthetic click event for the target box
            const targetBox = allBoxes[boxNumber - 1];
            const syntheticEvent = {
              preventDefault: () => { },
              currentTarget: targetBox
            };
            this._onDamageBoxClick(syntheticEvent);
            // Focus the target box
            targetBox.focus();
          }
          handled = true;
        }
        break;
    }

    // Move focus to target box if navigation occurred
    if (handled && targetIndex !== currentIndex && allBoxes[targetIndex]) {
      this._updateDamageBoxTabIndex(damageBoxes, targetIndex);
      allBoxes[targetIndex].focus();
    }
  }

  /**
   * Handle focus management for damage box groups
   */
  _onDamageBoxesFocusIn(event) {
    const damageBoxes = event.currentTarget;
    const focusedBox = event.target;

    if (focusedBox.classList.contains('damage-box')) {
      const allBoxes = Array.from(damageBoxes.querySelectorAll('.damage-box'));
      const focusedIndex = allBoxes.indexOf(focusedBox);
      this._updateDamageBoxTabIndex(damageBoxes, focusedIndex);
    }
  }

  /**
   * Update tabindex for damage boxes to maintain proper keyboard navigation
   */
  _updateDamageBoxTabIndex(damageBoxes, focusedIndex) {
    const allBoxes = damageBoxes.querySelectorAll('.damage-box');
    allBoxes.forEach((box, index) => {
      box.tabIndex = index === focusedIndex ? 0 : -1;
    });
  }

  /**
   * Clear all damage for a specific damage type
   */
  async _clearDamage(damageType) {
    try {
      if (!['physical', 'stun'].includes(damageType)) {
        throw new Error(`Invalid damage type: ${damageType}`);
      }

      const currentDamage = this.actor.system.health[damageType].value;

      if (currentDamage === 0) {
        ui.notifications.info(`${damageType} damage is already at 0.`);
        return;
      }

      // Update the actor's damage value
      this._queueUpdate({
        [`system.health.${damageType}.value`]: 0
      });

      // Provide immediate UI feedback
      this._updateDamageBoxDisplay(damageType, 0);

      ui.notifications.info(`${this.actor.name}'s ${damageType} damage has been cleared.`);

    } catch (error) {
      console.error(`SR2E | Error clearing ${damageType} damage:`, error);
      ui.notifications.error(`Failed to clear ${damageType} damage: ${error.message}`);
    }
  }

  /**
   * Initialize health data structure if it doesn't exist or has invalid values
   */
  async _initializeHealthData() {
    try {
      const currentHealth = this.actor.system.health;
      let needsUpdate = false;
      const updateData = {};

      // Check if health structure exists
      if (!currentHealth) {
        updateData['system.health'] = {
          physical: { value: 0, max: 10 },
          stun: { value: 0, max: 10 }
        };
        needsUpdate = true;
      } else {
        // Check physical health
        if (!currentHealth.physical) {
          updateData['system.health.physical'] = { value: 0, max: 10 };
          needsUpdate = true;
        } else {
          if (typeof currentHealth.physical.value !== 'number' || isNaN(currentHealth.physical.value)) {
            updateData['system.health.physical.value'] = 0;
            needsUpdate = true;
          }
          if (typeof currentHealth.physical.max !== 'number' || isNaN(currentHealth.physical.max)) {
            updateData['system.health.physical.max'] = 10;
            needsUpdate = true;
          }
        }

        // Check stun health
        if (!currentHealth.stun) {
          updateData['system.health.stun'] = { value: 0, max: 10 };
          needsUpdate = true;
        } else {
          if (typeof currentHealth.stun.value !== 'number' || isNaN(currentHealth.stun.value)) {
            updateData['system.health.stun.value'] = 0;
            needsUpdate = true;
          }
          if (typeof currentHealth.stun.max !== 'number' || isNaN(currentHealth.stun.max)) {
            updateData['system.health.stun.max'] = 10;
            needsUpdate = true;
          }
        }
      }

      // Apply updates if needed
      if (needsUpdate) {
        console.log('SR2E | Initializing health data structure:', updateData);
        await this.actor.update(updateData);
      }

    } catch (error) {
      console.error('SR2E | Error initializing health data:', error);
    }
  }

  /**
   * Performance optimization: Debounce function
   */
  _debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  /**
   * Performance optimization: Cache DOM elements
   */
  _getCachedElement(selector) {
    if (!this._domCache.has(selector)) {
      const element = this.element.find(selector);
      if (element.length > 0) {
        this._domCache.set(selector, element);
      }
    }
    return this._domCache.get(selector);
  }

  /**
   * Performance optimization: Clear DOM cache when sheet is rendered
   */
  _clearDomCache() {
    this._domCache.clear();
  }

  /**
   * Performance optimization: Queue updates to prevent excessive database writes
   */
  _queueUpdate(updateData) {
    // Merge with existing queued updates
    for (const [key, value] of Object.entries(updateData)) {
      this._updateQueue.set(key, value);
    }

    // Debounce the actual update
    this._debouncedUpdate();
  }

  /**
   * Performance optimization: Process queued updates
   */
  async _processUpdateQueue() {
    if (this._updateQueue.size === 0) return;

    // Convert Map to object
    const updateData = {};
    for (const [key, value] of this._updateQueue.entries()) {
      updateData[key] = value;
    }

    // Clear the queue
    this._updateQueue.clear();

    try {
      await this.actor.update(updateData);
    } catch (error) {
      console.error("SR2E | Failed to process update queue:", error);
      ui.notifications.error("Failed to save changes. You may not have permission to modify this character.");
    }
  }

  /**
   * Performance optimization: Optimized damage box display update
   */
  _updateDamageBoxDisplay(damageType, newDamage) {
    try {
      // Use cached selector for better performance
      const damageBoxes = this._getCachedElement(`.damage-boxes[data-damage-type="${damageType}"] .damage-box`);

      if (!damageBoxes || damageBoxes.length === 0) {
        console.warn(`SR2E | No damage boxes found for type: ${damageType}`);
        return;
      }

      // Batch DOM updates for better performance
      const updates = [];

      damageBoxes.each((index, box) => {
        const boxNumber = parseInt(box.dataset.boxNumber);
        const shouldBeFilled = boxNumber <= newDamage;
        const currentlyFilled = box.dataset.filled === 'true';

        if (shouldBeFilled !== currentlyFilled) {
          updates.push({
            element: box,
            filled: shouldBeFilled,
            boxNumber: boxNumber
          });
        }
      });

      // Apply all updates at once
      updates.forEach(update => {
        update.element.dataset.filled = update.filled.toString();
        update.element.setAttribute('aria-checked', update.filled.toString());
      });

      // Update damage counter with cached element
      const damageCounter = this._getCachedElement(`.${damageType}-monitor .damage-counter`);
      if (damageCounter && damageCounter.length > 0) {
        const maxDamage = this.actor.system.health[damageType].max || 10;
        damageCounter.text(`${newDamage}/${maxDamage}`);
      }

    } catch (error) {
      console.error(`SR2E | Error updating ${damageType} damage display:`, error);
    }
  }

  /**
   * Display initiative roll results in the UI
   */
  _displayInitiativeResult(diceResults, diceTotal, reactionBonus, finalTotal, rollFormula) {
    try {
      // Validate UI elements exist
      if (!this.element || this.element.length === 0) {
        console.warn("SR2E | Character sheet element not found, cannot display initiative result");
        return;
      }

      const resultDiv = this.element.find('.initiative-result');
      if (resultDiv.length === 0) {
        console.warn("SR2E | Initiative result display area not found in UI");
        return;
      }

      const diceResultSpan = resultDiv.find('.dice-result');
      const bonusResultSpan = resultDiv.find('.bonus-result');
      const totalResultSpan = resultDiv.find('.total-result');
      const formulaSpan = resultDiv.find('.formula-text');

      // Format dice results display with error handling
      let diceDisplay = '';
      try {
        if (Array.isArray(diceResults) && diceResults.length > 0) {
          diceDisplay = `[${diceResults.join(', ')}] = ${diceTotal}`;
        } else {
          diceDisplay = `Dice Total: ${diceTotal}`;
        }
      } catch (displayError) {
        console.warn("SR2E | Error formatting dice display:", displayError);
        diceDisplay = `Dice Total: ${diceTotal}`;
      }

      // Update UI elements with error handling for each
      try {
        if (diceResultSpan.length > 0) {
          diceResultSpan.text(diceDisplay);
        }
      } catch (error) {
        console.warn("SR2E | Failed to update dice result display:", error);
      }

      try {
        if (bonusResultSpan.length > 0) {
          bonusResultSpan.text(`+ ${reactionBonus}`);
        }
      } catch (error) {
        console.warn("SR2E | Failed to update bonus result display:", error);
      }

      try {
        if (totalResultSpan.length > 0) {
          totalResultSpan.text(`= ${finalTotal}`);
        }
      } catch (error) {
        console.warn("SR2E | Failed to update total result display:", error);
      }

      try {
        if (formulaSpan.length > 0) {
          formulaSpan.text(`Formula: ${rollFormula}`);
        }
      } catch (error) {
        console.warn("SR2E | Failed to update formula display:", error);
      }

      // Show the result div with animation and error handling
      try {
        resultDiv.slideDown(300);
      } catch (animationError) {
        console.warn("SR2E | Failed to animate result display:", animationError);
        // Fallback to just showing the element
        try {
          resultDiv.show();
        } catch (showError) {
          console.warn("SR2E | Failed to show result display:", showError);
        }
      }

      // Trigger UI synchronization
      this._synchronizeUIState();

    } catch (error) {
      console.error("SR2E | Error displaying initiative result:", error);
      // Don't throw error, just log it since this is a display function
    }
  }

  /**
   * Calculate action phases from initiative score
   * SR2 phase system: characters act on multiple phases based on initiative
   * Each phase occurs every 10 points of initiative
   * Example: Initiative 27 = acts on phases 27, 17, 7
   */
  _calculateActionPhases(initiativeScore) {
    try {
      // Validate input
      if (typeof initiativeScore !== 'number' || isNaN(initiativeScore)) {
        throw new Error(`Invalid initiative score: ${initiativeScore}. Must be a number.`);
      }

      if (initiativeScore < 1) {
        console.warn(`SR2E | Initiative score too low: ${initiativeScore}, using minimum of 1`);
        initiativeScore = 1;
      }

      if (initiativeScore > 100) {
        console.warn(`SR2E | Initiative score very high: ${initiativeScore}, this may indicate an error`);
      }

      const phases = [];
      let currentPhase = Math.floor(initiativeScore); // Ensure integer
      let iterationCount = 0;
      const maxIterations = 20; // Safety limit to prevent infinite loops

      while (currentPhase > 0 && iterationCount < maxIterations) {
        phases.push(currentPhase);
        currentPhase -= 10;
        iterationCount++;
      }

      if (iterationCount >= maxIterations) {
        console.warn(`SR2E | Phase calculation hit iteration limit for initiative ${initiativeScore}`);
      }

      // Validate result
      if (phases.length === 0) {
        console.warn(`SR2E | No phases calculated for initiative ${initiativeScore}, adding single phase`);
        phases.push(Math.max(1, Math.floor(initiativeScore)));
      }

      console.log(`SR2E | Calculated ${phases.length} action phases for initiative ${initiativeScore}: [${phases.join(', ')}]`);
      return phases;

    } catch (error) {
      console.error("SR2E | Error calculating action phases:", error);
      // Return fallback single phase
      const fallbackPhase = Math.max(1, Math.floor(initiativeScore) || 1);
      console.warn(`SR2E | Using fallback single phase: ${fallbackPhase}`);
      return [fallbackPhase];
    }
  }

  /**
   * Add character to initiative tracker after rolling initiative
   */
  async _addToInitiativeTracker(initiativeResult) {
    try {
      // Validate initiative result
      if (typeof initiativeResult !== 'number' || isNaN(initiativeResult) || initiativeResult < 1) {
        throw new Error(`Invalid initiative result: ${initiativeResult}`);
      }

      // Validate actor data
      if (!this.actor || !this.actor.id) {
        throw new Error("Actor data is missing or invalid");
      }

      // Check if canvas and tokens are available
      if (!canvas || !canvas.tokens) {
        throw new Error("Canvas or tokens not available. Make sure you're on a scene with tokens.");
      }

      // Get or create the global initiative tracker instance
      let initiativeTracker = game.shadowrun2e?.initiativeTracker;

      if (!initiativeTracker) {
        try {
          // Create new tracker instance if it doesn't exist
          initiativeTracker = new SR2InitiativeTracker();

          // Store reference globally for access from other parts of the system
          if (!game.shadowrun2e) {
            game.shadowrun2e = {};
          }
          game.shadowrun2e.initiativeTracker = initiativeTracker;
        } catch (trackerError) {
          throw new Error(`Failed to create initiative tracker: ${trackerError.message}`);
        }
      }

      // Get the token for this actor (prefer controlled token, fallback to any token)
      let token = null;

      try {
        const controlledTokens = canvas.tokens.controlled.filter(t => t.actor?.id === this.actor.id);

        if (controlledTokens.length > 0) {
          token = controlledTokens[0];
        } else {
          // Find any token representing this actor on the current scene
          token = canvas.tokens.placeables.find(t => t.actor?.id === this.actor.id);
        }
      } catch (tokenError) {
        console.error("SR2E | Error finding token:", tokenError);
      }

      if (!token) {
        console.warn(`SR2E | No token found for actor ${this.actor.name}, cannot add to initiative tracker`);
        ui.notifications.warn(`No token found for ${this.actor.name}. Place a token on the scene to add to initiative tracker.`);
        return;
      }

      // Validate token data
      if (!token.id) {
        throw new Error("Token ID is missing");
      }

      // Validate initiative tracker has combatants array
      if (!Array.isArray(initiativeTracker.combatants)) {
        console.warn("SR2E | Initiative tracker combatants array missing, creating new array");
        initiativeTracker.combatants = [];
      }

      // Check if character is already in the tracker
      const existingCombatant = initiativeTracker.combatants.find(c => c.actorId === this.actor.id);

      // Calculate action phases for this initiative result with error handling
      let actionPhases;
      try {
        actionPhases = this._calculateActionPhases(initiativeResult);

        // Validate action phases result
        if (!Array.isArray(actionPhases) || actionPhases.length === 0) {
          throw new Error(`Invalid action phases calculated: ${actionPhases}`);
        }
      } catch (phaseError) {
        console.error("SR2E | Error calculating action phases:", phaseError);
        // Fallback to simple single phase
        actionPhases = [initiativeResult];
      }

      // Get safe values for initiative dice and reaction
      const initiativeDice = (this.actor.system?.initiative?.dice &&
        typeof this.actor.system.initiative.dice === 'number' &&
        !isNaN(this.actor.system.initiative.dice))
        ? this.actor.system.initiative.dice : 1;

      const reaction = (this.actor.system?.attributes?.reaction?.value &&
        typeof this.actor.system.attributes.reaction.value === 'number' &&
        !isNaN(this.actor.system.attributes.reaction.value))
        ? this.actor.system.attributes.reaction.value : 1;

      if (existingCombatant) {
        // Update existing combatant's initiative and phases
        try {
          existingCombatant.initiative = initiativeResult;
          existingCombatant.actionPhases = actionPhases;
          existingCombatant.hasRolled = true;
          existingCombatant.initiativeDice = initiativeDice;
          existingCombatant.reaction = reaction;

          console.log(`SR2E | Updated ${this.actor.name}'s initiative in tracker: ${initiativeResult}, phases: [${actionPhases.join(', ')}]`);
        } catch (updateError) {
          throw new Error(`Failed to update existing combatant: ${updateError.message}`);
        }
      } else {
        // Add new combatant to tracker
        try {
          const combatant = {
            id: foundry.utils.randomID(),
            tokenId: token.id,
            actorId: this.actor.id,
            name: this.actor.name || "Unknown Character",
            img: this.actor.img || "icons/svg/mystery-man.svg",
            initiative: initiativeResult,
            actionPhases: actionPhases,
            initiativeDice: initiativeDice,
            reaction: reaction,
            hasRolled: true
          };

          initiativeTracker.combatants.push(combatant);
          console.log(`SR2E | Added ${this.actor.name} to initiative tracker with initiative ${initiativeResult}, phases: [${actionPhases.join(', ')}]`);
        } catch (addError) {
          throw new Error(`Failed to add new combatant: ${addError.message}`);
        }
      }

      // Render the tracker if it's currently open
      try {
        if (initiativeTracker.rendered) {
          initiativeTracker.render();
        }
      } catch (renderError) {
        console.warn("SR2E | Failed to render initiative tracker:", renderError);
        // Don't throw error for render failure, it's not critical
      }

      // Show notification
      const message = existingCombatant
        ? `${this.actor.name} updated in initiative tracker with initiative ${initiativeResult}`
        : `${this.actor.name} added to initiative tracker with initiative ${initiativeResult}`;
      ui.notifications.info(message);

    } catch (error) {
      console.error("SR2E | Error adding character to initiative tracker:", error);

      // Provide specific error messages
      let errorMessage = "Failed to add character to initiative tracker.";

      if (error.message.includes("Canvas")) {
        errorMessage = "No active scene found. Open a scene with tokens to use the initiative tracker.";
      } else if (error.message.includes("token")) {
        errorMessage = `No token found for ${this.actor.name}. Place a token on the scene first.`;
      } else if (error.message.includes("tracker")) {
        errorMessage = "Initiative tracker system error. Try reloading the page.";
      } else {
        errorMessage = `Initiative tracker error: ${error.message}`;
      }

      ui.notifications.error(errorMessage);
      throw error; // Re-throw to be handled by calling function
    }
  }

  /**
   * Synchronize UI state across different parts of the character sheet
   * Ensures combat panel updates are reflected elsewhere
   */
  _synchronizeUIState() {
    try {
      // Update damage displays in other tabs if they exist
      this._updateDamageDisplays();

      // Update initiative displays in other parts of the sheet
      this._updateInitiativeDisplays();

      // Trigger any dependent calculations
      this._updateDependentValues();

      // Emit custom event for other systems to listen to
      this._emitCombatStateChange();

    } catch (error) {
      console.error("SR2E | Error synchronizing UI state:", error);
      // Don't throw error, just log it since this is a synchronization function
    }
  }

  /**
   * Update damage displays throughout the character sheet
   */
  _updateDamageDisplays() {
    try {
      if (!this.actor?.system?.health) return;

      const physicalDamage = this.actor.system.health.physical?.value || 0;
      const stunDamage = this.actor.system.health.stun?.value || 0;

      // Update any damage indicators outside the combat panel
      const damageIndicators = this.element.find('.damage-indicator, .health-status');
      damageIndicators.each((index, element) => {
        try {
          const $element = $(element);
          const damageType = $element.data('damage-type');

          if (damageType === 'physical') {
            $element.text(physicalDamage);
            $element.attr('data-damage-level', physicalDamage);
          } else if (damageType === 'stun') {
            $element.text(stunDamage);
            $element.attr('data-damage-level', stunDamage);
          }
        } catch (elementError) {
          console.warn("SR2E | Error updating damage indicator:", elementError);
        }
      });

      // Update damage-based CSS classes for visual feedback
      this.element.removeClass('light-damage moderate-damage heavy-damage critical-damage');

      const totalDamage = physicalDamage + stunDamage;
      if (totalDamage >= 16) {
        this.element.addClass('critical-damage');
      } else if (totalDamage >= 12) {
        this.element.addClass('heavy-damage');
      } else if (totalDamage >= 6) {
        this.element.addClass('moderate-damage');
      } else if (totalDamage > 0) {
        this.element.addClass('light-damage');
      }

    } catch (error) {
      console.error("SR2E | Error updating damage displays:", error);
    }
  }

  /**
   * Update initiative displays throughout the character sheet
   */
  _updateInitiativeDisplays() {
    try {
      if (!this.actor?.system?.initiative) return;

      const currentInitiative = this.actor.system.initiative.current || 0;

      // Update any initiative indicators outside the combat panel
      const initiativeIndicators = this.element.find('.initiative-indicator, .initiative-display');
      initiativeIndicators.each((index, element) => {
        try {
          const $element = $(element);
          $element.text(currentInitiative);
          $element.attr('data-initiative', currentInitiative);
        } catch (elementError) {
          console.warn("SR2E | Error updating initiative indicator:", elementError);
        }
      });

    } catch (error) {
      console.error("SR2E | Error updating initiative displays:", error);
    }
  }

  /**
   * Update values that depend on combat state (damage penalties, etc.)
   */
  _updateDependentValues() {
    try {
      if (!this.actor?.system?.health) return;

      const physicalDamage = this.actor.system.health.physical?.value || 0;
      const stunDamage = this.actor.system.health.stun?.value || 0;

      // Calculate damage penalties according to SR2 rules
      // Physical damage: -1 die per 3 boxes of damage
      // Stun damage: -1 die per 3 boxes of damage
      const physicalPenalty = Math.floor(physicalDamage / 3);
      const stunPenalty = Math.floor(stunDamage / 3);
      const totalPenalty = physicalPenalty + stunPenalty;

      // Update penalty displays
      const penaltyIndicators = this.element.find('.damage-penalty, .wound-penalty');
      penaltyIndicators.each((index, element) => {
        try {
          const $element = $(element);
          $element.text(totalPenalty > 0 ? `-${totalPenalty}` : '0');
          $element.attr('data-penalty', totalPenalty);

          // Add visual styling based on penalty severity
          $element.removeClass('minor-penalty major-penalty severe-penalty');
          if (totalPenalty >= 6) {
            $element.addClass('severe-penalty');
          } else if (totalPenalty >= 3) {
            $element.addClass('major-penalty');
          } else if (totalPenalty > 0) {
            $element.addClass('minor-penalty');
          }
        } catch (elementError) {
          console.warn("SR2E | Error updating penalty indicator:", elementError);
        }
      });

    } catch (error) {
      console.error("SR2E | Error updating dependent values:", error);
    }
  }

  /**
   * Emit custom event for combat state changes
   */
  _emitCombatStateChange() {
    try {
      const combatState = {
        actorId: this.actor.id,
        physicalDamage: this.actor.system.health?.physical?.value || 0,
        stunDamage: this.actor.system.health?.stun?.value || 0,
        initiative: this.actor.system.initiative?.current || 0,
        timestamp: Date.now()
      };

      // Emit event for other systems to listen to
      Hooks.callAll('sr2e.combatStateChanged', combatState);

      // Also emit on the actor for actor-specific listeners
      if (this.actor.sheet) {
        $(this.actor.sheet.element).trigger('combatStateChanged', combatState);
      }

    } catch (error) {
      console.error("SR2E | Error emitting combat state change:", error);
    }
  }

  /**
   * Override the render method to handle loading states
   */
  async render(force = false, options = {}) {
    try {
      this._clearDomCache();

      // Add loading state
      if (this.element && this.element.length > 0) {
        this.element.addClass('loading');
      }

      // Call parent render method
      const result = await super.render(force, options);

      // Remove loading state and synchronize UI
      if (this.element && this.element.length > 0) {
        this.element.removeClass('loading');

        // Synchronize UI state after render
        setTimeout(() => {
          this._synchronizeUIState();
        }, 100);
      }

      return result;

    } catch (error) {
      console.error("SR2E | Error rendering character sheet:", error);

      // Remove loading state even on error
      if (this.element && this.element.length > 0) {
        this.element.removeClass('loading');
      }

      // Show user-friendly error
      ui.notifications.error("Failed to render character sheet. Try refreshing the page.");
      throw error;
    }
  }

  /**
   * Handle actor data updates from external sources
   */
  _onActorUpdate(actor, updateData, options, userId) {
    try {
      // Only process updates for this actor
      if (actor.id !== this.actor.id) return;

      // Check if combat-related data was updated
      const combatDataUpdated = (
        updateData.system?.health ||
        updateData.system?.initiative ||
        updateData.system?.attributes?.reaction
      );

      if (combatDataUpdated) {
        // Synchronize UI with a small delay to ensure data is fully updated
        setTimeout(() => {
          this._synchronizeUIState();
        }, 50);
      }

    } catch (error) {
      console.error("SR2E | Error handling actor update:", error);
    }
  }



  /**
   * Clean up listeners when sheet is closed
   */
  async close(options = {}) {
    if (this._hasActorUpdateHook && globalThis.Hooks) {
      Hooks.off('updateActor', this._boundOnActorUpdate);
      this._hasActorUpdateHook = false;
    }

    // Flush any pending queued updates (e.g., damage clicks) before closing
    if (this._updateQueue?.size > 0) {
      await this._processUpdateQueue();
    }

    this._clearDomCache();
    return super.close(options);
  }

  /** @override */
  async _updateObject(event, formData) {
    // Separate actor updates from item updates
    const actorUpdates = {};
    const itemUpdates = {};

    for (const [key, value] of Object.entries(formData)) {
      if (key.startsWith('items.')) {
        // This is an item update
        const match = key.match(/^items\.([^.]+)\.(.+)$/);
        if (match) {
          const itemId = match[1];
          const itemPath = match[2];

          if (!itemUpdates[itemId]) {
            itemUpdates[itemId] = {};
          }

          // Handle skill rating fields to ensure they're numbers
          if (itemPath.includes('Rating')) {
            itemUpdates[itemId][itemPath] = parseInt(value) || 0;
          } else {
            itemUpdates[itemId][itemPath] = value;
          }
        }
      } else {
        // This is an actor update
        actorUpdates[key] = value;
      }
    }

    const creationModeOverride = actorUpdates["flags.shadowrun2e.creationMode"];
    let creationMode = this._isCreationMode();
    if (creationModeOverride !== undefined) {
      if (typeof creationModeOverride === "boolean") creationMode = creationModeOverride;
      else if (typeof creationModeOverride === "string") creationMode = creationModeOverride === "true";
      else creationMode = Boolean(creationModeOverride);
    }

    const totalSkillPoints = Number(this.actor.system.creation?.skillPoints) || 0;
    const totalAttributePoints = Number(this.actor.system.creation?.attributePoints) || 0;
    const totalForcePoints = Number(this.actor.system.creation?.forcePoints) || 0;

    // Clamp SR2 starting gear limits (rating <= 6) in creation mode
    const clampStartingRating = (item, updateData) => {
      if (!creationMode) return;
      if (!totalSkillPoints && !totalAttributePoints && !totalForcePoints) return;

      if (updateData["system.rating"] !== undefined) {
        const rating = parseInt(updateData["system.rating"], 10);
        if (Number.isFinite(rating)) {
          updateData["system.rating"] = Math.max(0, Math.min(6, rating));
        }
      }
    };

    const computeForceSpentExcluding = (excludeItemId) => {
      let spent = 0;
      for (const i of this.actor.items) {
        if (i.id === excludeItemId) continue;
        if (i.type === "spell") spent += Math.max(0, Number(i.system.force) || 0);
        if (i.type === "gear") spent += Math.max(0, Number(i.system.bondCost) || 0);
      }
      return spent;
    };

    // Update items first
    for (const [itemId, updateData] of Object.entries(itemUpdates)) {
      const item = this.actor.items.get(itemId);
      if (item) {
        // Creation-mode clamping and SR2 conc/spec math
        if (item.type === "skill") {
          const nextSystem = {
            ...item.system,
            baseSkill: updateData["system.baseSkill"] ?? item.system.baseSkill,
            concentration: updateData["system.concentration"] ?? item.system.concentration,
            specialization: updateData["system.specialization"] ?? item.system.specialization,
            allocatedRating: updateData["system.allocatedRating"] ?? item.system.allocatedRating,
            isFree: updateData["system.isFree"] ?? item.system.isFree
          };

          const computed = sr2ComputeSkillRatingsFromAllocated(nextSystem);
          const shouldClampAllocated = creationMode && !nextSystem.isFree && nextSystem.baseSkill !== "Language";
          updateData["system.allocatedRating"] = shouldClampAllocated ? Math.min(computed.allocatedRating, 6) : computed.allocatedRating;
          updateData["system.baseRating"] = computed.baseRating;
          updateData["system.concentrationRating"] = computed.concentrationRating;
          updateData["system.specializationRating"] = computed.specializationRating;
        }

        if (item.type === "spell" && updateData["system.force"] !== undefined) {
          let nextForce = parseInt(updateData["system.force"], 10);
          if (!Number.isFinite(nextForce)) nextForce = 1;

          if (creationMode && totalForcePoints > 0) {
            nextForce = Math.max(1, Math.min(6, nextForce));
            const spentOther = computeForceSpentExcluding(item.id);
            const maxForThis = totalForcePoints - spentOther;
            if (maxForThis < 1) {
              ui.notifications.error("Not enough Force Points remaining. Reduce other spells/foci first.");
              updateData["system.force"] = item.system.force || 1;
            } else {
              updateData["system.force"] = Math.min(nextForce, maxForThis);
            }
          } else {
            updateData["system.force"] = Math.max(1, Math.min(10, nextForce));
          }
        }

        clampStartingRating(item, updateData);

        await item.update(updateData);
      }
    }

	    // Then update actor if there are actor-level changes
	    if (Object.keys(actorUpdates).length > 0) {
	      // Sync legacy lifestyle fields from the multi-lifestyle list
	      const existingLifestyles = this._getNormalizedLifestylesFromActor();
	      const lifestylesByIndex = new Map();
	      for (const [key, value] of Object.entries(actorUpdates)) {
	        const match = key.match(/^system\.resources\.lifestyles\.(\d+)\.(type|months)$/);
	        if (!match) continue;

	        const index = parseInt(match[1], 10);
	        if (!Number.isFinite(index)) continue;

	        if (!lifestylesByIndex.has(index)) {
	          const current = existingLifestyles[index] || { type: "street", months: 1 };
	          lifestylesByIndex.set(index, {
	            type: current.type || "street",
	            months: Math.max(1, parseInt(current.months, 10) || 1)
	          });
	        }
	        const entry = lifestylesByIndex.get(index);
	        if (match[2] === "type") entry.type = String(value || "street");
	        if (match[2] === "months") entry.months = Math.max(1, parseInt(value, 10) || 1);
	      }

      if (lifestylesByIndex.size > 0) {
        const normalizedLifestyles = [...lifestylesByIndex.entries()]
          .sort(([a], [b]) => a - b)
          .map(([, entry]) => ({
            type: entry.type || "street",
            months: entry.months || 1
          }));

        for (const key of Object.keys(actorUpdates)) {
          if (key.startsWith("system.resources.lifestyles.")) delete actorUpdates[key];
        }

        actorUpdates["system.resources.lifestyles"] = normalizedLifestyles.length
          ? normalizedLifestyles
          : [{ type: "street", months: 1 }];

        actorUpdates["system.resources.lifestyle"] = actorUpdates["system.resources.lifestyles"][0]?.type || "street";
        actorUpdates["system.creation.lifestyleMonths"] = actorUpdates["system.resources.lifestyles"][0]?.months || 1;
      }

      // Clamp attributes by racial mins/maxes and enforce Attribute Points in creation mode
      const metatype = actorUpdates["system.details.metatype"] ?? this.actor.system.details?.metatype ?? "human";
      const bounds = sr2GetRacialAttributeBounds(metatype);

      const attrKeys = ["body", "quickness", "strength", "charisma", "intelligence", "willpower"];
      const newAttributeValues = {};
      for (const key of attrKeys) {
        const path = `system.attributes.${key}.value`;
        const raw = actorUpdates[path] !== undefined ? actorUpdates[path] : this.actor.system.attributes?.[key]?.value;
        const clamped = sr2Clamp(raw, bounds[key].min, bounds[key].max);
        newAttributeValues[key] = clamped;
        if (actorUpdates[path] !== undefined) actorUpdates[path] = clamped;
      }

      if (creationMode && totalAttributePoints > 0) {
        const spent = attrKeys.reduce((sum, key) => {
          const baseline = bounds[key]?.min ?? 0;
          const value = Number(newAttributeValues[key]);
          return sum + Math.max(0, value - baseline);
        }, 0);

        if (spent > totalAttributePoints) {
          const changedName = event?.currentTarget?.name || "";
          const match = changedName.match(/^system\.attributes\.([^.]+)\.value$/);
          const changedKey = match?.[1];
          if (changedKey && attrKeys.includes(changedKey)) {
            const baseline = bounds[changedKey]?.min ?? 0;
            const currentSpent = Math.max(0, Number(newAttributeValues[changedKey]) - baseline);
            const otherSpent = spent - currentSpent;
            const allowedSpent = Math.max(0, totalAttributePoints - otherSpent);
            const allowedFinalRaw = baseline + allowedSpent;
            const allowedFinal = sr2Clamp(allowedFinalRaw, bounds[changedKey].min, bounds[changedKey].max);
            actorUpdates[`system.attributes.${changedKey}.value`] = allowedFinal;
            ui.notifications.warn("Attribute Points exceeded; clamped the last change.");
          } else {
            ui.notifications.warn("Attribute Points exceeded.");
          }
        }
      }

      await this.object.update(actorUpdates);
    }

    return true;
  }

  /**
   * Handle drag start events for creating hotbar macros
   */
  _onDragStart(event) {
    const element = event.currentTarget;

    // Get item data - try different ways to find the item ID
    let itemId = element.dataset.itemId ||
                 element.getAttribute('data-item-id') ||
                 element.closest('[data-item-id]')?.dataset.itemId;
    
    if (!itemId) {
      console.warn("SR2E | No item ID found for drag operation");
      return;
    }
    
    const item = this.actor.items.get(itemId);
    
    if (!item) {
      console.warn("SR2E | Item not found for drag:", itemId);
      return;
    }

    // Create drag data for hotbar macro creation
    const dragData = item.toDragData ? item.toDragData() : { type: "Item", uuid: item.uuid };

    // Set the drag data
    event.dataTransfer.setData("text/plain", JSON.stringify(dragData));
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
   * Handle weapon attack button clicks
   */
  async _onWeaponAttack(event) {
    event.preventDefault();
    
    const weaponId = event.currentTarget.dataset.itemId;
    const weapon = this.actor.items.get(weaponId);
    
    if (!weapon) {
      ui.notifications.error("Weapon not found");
      return;
    }

    // Check if this is a melee weapon (has reach property)
    const isMeleeWeapon = weapon.system.reach !== undefined && weapon.system.reach !== null;
    
    if (isMeleeWeapon) {
      // Show melee combat modifiers dialog
      this._showMeleeCombatDialog(weapon);
    } else {
      // For ranged weapons, show a simpler attack dialog or direct roll
      this._performWeaponAttack(weapon, 0); // No modifiers for now
    }
  }

  /**
   * Show melee combat modifiers dialog
   */
  async _showMeleeCombatDialog(weapon, defaultTN = 4) {
    //Dean
    const availablePools = this._getAvailablePools();
    const dialogContent = `
      <div class="melee-combat-dialog">
        <h3>Melee Combat Modifiers for ${weapon.name}</h3>
        <div class="target-number-section">
          <label for="target-number"><strong>Base Target Number:</strong></label>
          <select id="target-number" name="targetNumber">
            <option value="2" ${defaultTN === 2 ? 'selected' : ''}>2 - Trivial</option>
            <option value="3" ${defaultTN === 3 ? 'selected' : ''}>3 - Easy</option>
            <option value="4" ${defaultTN === 4 ? 'selected' : ''}>4 - Average</option>
            <option value="5" ${defaultTN === 5 ? 'selected' : ''}>5 - Fair</option>
            <option value="6" ${defaultTN === 6 ? 'selected' : ''}>6 - Hard</option>
            <option value="7" ${defaultTN === 7 ? 'selected' : ''}>7 - Extreme</option>
            <option value="8" ${defaultTN === 8 ? 'selected' : ''}>8 - Nearly Impossible</option>
            <option value="9" ${defaultTN === 9 ? 'selected' : ''}>9 - Impossible</option>
            <option value="10" ${defaultTN === 10 ? 'selected' : ''}>10 - Miraculous</option>
            <option value="11" ${defaultTN === 11 ? 'selected' : ''}>11</option>
            <option value="12" ${defaultTN === 12 ? 'selected' : ''}>12</option>
            <option value="13" ${defaultTN === 13 ? 'selected' : ''}>13</option>
            <option value="14" ${defaultTN === 14 ? 'selected' : ''}>14</option>
            <option value="15" ${defaultTN === 15 ? 'selected' : ''}>15</option>
            <option value="16" ${defaultTN === 16 ? 'selected' : ''}>16</option>
            <option value="17" ${defaultTN === 17 ? 'selected' : ''}>17</option>
            <option value="18" ${defaultTN === 18 ? 'selected' : ''}>18</option>
            <option value="19" ${defaultTN === 19 ? 'selected' : ''}>19</option>
            <option value="20" ${defaultTN === 20 ? 'selected' : ''}>20</option>
            <option value="21" ${defaultTN === 21 ? 'selected' : ''}>21</option>
            <option value="22" ${defaultTN === 22 ? 'selected' : ''}>22</option>
            <option value="23" ${defaultTN === 23 ? 'selected' : ''}>23</option>
            <option value="24" ${defaultTN === 24 ? 'selected' : ''}>24</option>
            <option value="25" ${defaultTN === 25 ? 'selected' : ''}>25</option>
            <option value="26" ${defaultTN === 26 ? 'selected' : ''}>26</option>
            <option value="27" ${defaultTN === 27 ? 'selected' : ''}>27</option>
            <option value="28" ${defaultTN === 28 ? 'selected' : ''}>28</option>
            <option value="29" ${defaultTN === 29 ? 'selected' : ''}>29</option>
            <option value="30" ${defaultTN === 30 ? 'selected' : ''}>30</option>
          </select>
        </div>
        
        <div class="modifier-section">
          <h4>Situational Modifiers</h4>
          
          <div class="modifier-row">
            <label for="friends-in-melee">Character has friends in melee:</label>
            <select id="friends-in-melee" name="friendsInMelee">
              <option value="0">None</option>
              <option value="-1">1 Friend (-1)</option>
              <option value="-2">2 Friends (-2)</option>
              <option value="-3">3 Friends (-3)</option>
              <option value="-4">4+ Friends (-4)</option>
            </select>
          </div>

          <div class="modifier-row">
            <label for="opponents-in-melee">Opponent has friends in melee:</label>
            <select id="opponents-in-melee" name="opponentsInMelee">
              <option value="0">None</option>
              <option value="1">1 Friend (+1)</option>
              <option value="2">2 Friends (+2)</option>
              <option value="3">3 Friends (+3)</option>
              <option value="4">4+ Friends (+4)</option>
            </select>
          </div>

          <div class="modifier-row">
            <label for="reach-advantage">Character's weapon reach advantage:</label>
            <select id="reach-advantage" name="reachAdvantage">
              <option value="0">Equal reach</option>
              <option value="-1">1 point longer (-1)</option>
              <option value="-2">2 points longer (-2)</option>
              <option value="-3">3 points longer (-3)</option>
              <option value="1">1 point shorter (+1)</option>
              <option value="2">2 points shorter (+2)</option>
              <option value="3">3 points shorter (+3)</option>
            </select>
          </div>

          <div class="modifier-row">
            <label for="multiple-targets">Character attacking multiple targets:</label>
            <select id="multiple-targets" name="multipleTargets">
              <option value="0">Single target</option>
              <option value="2">2 targets (+2)</option>
              <option value="4">3 targets (+4)</option>
              <option value="6">4 targets (+6)</option>
              <option value="8">5+ targets (+8)</option>
            </select>
          </div>

          <div class="modifier-row">
            <label for="superior-position">Character has superior position:</label>
            <input type="checkbox" id="superior-position" name="superiorPosition" value="-1">
            <span class="modifier-value">(-1)</span>
          </div>

          <div class="modifier-row">
            <label for="opponent-prone">Opponent is prone:</label>
            <input type="checkbox" id="opponent-prone" name="opponentProne" value="-2">
            <span class="modifier-value">(-2)</span>
          </div>

          <div class="modifier-summary">
            <strong>Total TN Modifier: <span id="total-modifier">0</span></strong>
          </div>
        </div>
        ${availablePools.length > 0 ? `
        <div class="pool-dice-section">
          <label><strong>Pool Dice (Optional):</strong></label>
          ${availablePools.map(pool => `
            <div class="pool-option">
              <label>
                <input type="checkbox" name="pool-${pool.key}" value="${pool.key}" class="pool-checkbox">
                ${pool.name} (${pool.current}/${pool.max})
              </label>
              <input type="number" name="pool-${pool.key}-dice" 
                     min="0" max="${pool.current}" value="0" disabled class="pool-dice-input">
            </div>
          `).join('')}
        </div>
        ` : ''}
      </div>
    `;

    // Create and show the dialog
    new Dialog({
      title: `Melee Attack: ${weapon.name}`,
      content: dialogContent,
      buttons: {
        attack: {
          label: "Make Attack",
          callback: (html) => {
            const modifiers = this._calculateMeleeModifiers(html);
            this._performWeaponAttack(weapon, modifiers.total);
          }
        },
        cancel: {
          label: "Cancel"
        }
      },
      default: "attack",
      render: (html) => {
        // Add event listeners to update total modifier in real-time
        const updateTotal = () => {
          const modifiers = this._calculateMeleeModifiers(html);
          html.find('#total-modifier').text(modifiers.total > 0 ? `+${modifiers.total}` : modifiers.total);
        };

        html.find('select, input[type="checkbox"]').on('change', updateTotal);
        updateTotal(); // Initial calculation
      }
    }).render(true);
  }

  /**
   * Calculate melee combat modifiers from dialog
   */
  _calculateMeleeModifiers(html) {
    const friendsInMelee = parseInt(html.find('[name="friendsInMelee"]').val()) || 0;
    const opponentsInMelee = parseInt(html.find('[name="opponentsInMelee"]').val()) || 0;
    const reachAdvantage = parseInt(html.find('[name="reachAdvantage"]').val()) || 0;
    const multipleTargets = parseInt(html.find('[name="multipleTargets"]').val()) || 0;
    const superiorPosition = html.find('[name="superiorPosition"]').is(':checked') ? -1 : 0;
    const opponentProne = html.find('[name="opponentProne"]').is(':checked') ? -2 : 0;

    const total = friendsInMelee + opponentsInMelee + reachAdvantage + multipleTargets + superiorPosition + opponentProne;

    return {
      friendsInMelee,
      opponentsInMelee,
      reachAdvantage,
      multipleTargets,
      superiorPosition,
      opponentProne,
      total
    };
  }

  /**
   * Perform the actual weapon attack with modifiers
   */
  async _performWeaponAttack(weapon, tnModifier) {
    // Get the linked skill for this weapon
    const linkedSkill = this._getWeaponSkill(weapon);
    
    if (!linkedSkill) {
      ui.notifications.error(`No skill found for ${weapon.name}. Please link a skill to this weapon.`);
      return;
    }

    // Calculate base TN (typically 4 for most attacks)
    const baseTN = 4;
    const finalTN = Math.max(2, baseTN + tnModifier); // TN can't go below 2

    // Get skill rating
    const skillRating = this._getSkillRating(linkedSkill);
    
    if (skillRating === 0) {
      ui.notifications.error(`${linkedSkill.name} skill rating is 0. Cannot make attack.`);
      return;
    }

    // Create attack roll description
    let attackDescription = `${weapon.name} Attack`;
    if (tnModifier !== 0) {
      attackDescription += ` (TN ${baseTN} ${tnModifier > 0 ? '+' : ''}${tnModifier} = ${finalTN})`;
    }

    // Roll the attack
    const result = await this.actor.rollDice(skillRating, finalTN, attackDescription);

    // Create detailed chat message
    const chatContent = `
      <div class="weapon-attack-result">
        <h3>${weapon.name} Attack</h3>
        <p><strong>Attacker:</strong> ${this.actor.name}</p>
        <p><strong>Skill:</strong> ${linkedSkill.name} (${skillRating})</p>
        <p><strong>Target Number:</strong> ${finalTN}</p>
        ${tnModifier !== 0 ? `<p><strong>Modifiers:</strong> ${tnModifier > 0 ? '+' : ''}${tnModifier}</p>` : ''}
        <p><strong>Damage:</strong> ${weapon.system.damage || 'Unknown'}</p>
        ${weapon.system.reach !== undefined ? `<p><strong>Reach:</strong> ${weapon.system.reach}</p>` : ''}
        <p><strong>Result:</strong> ${result.successes} success${result.successes !== 1 ? 'es' : ''}</p>
        ${result.isCriticalFailure ? '<p><strong>Critical Failure!</strong></p>' : ''}
      </div>
    `;

    ChatMessage.create({
      user: game.user.id,
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      content: chatContent
    });
  }

  /**
   * Get the appropriate skill for a weapon
   */
  _getWeaponSkill(weapon) {
    // First check if weapon has a linked skill
    if (weapon.system.linkedSkill && weapon.system.linkedSkill.skillId) {
      return this.actor.items.get(weapon.system.linkedSkill.skillId);
    }

    // Auto-detect skill based on weapon type/name
    const weaponName = weapon.name.toLowerCase();
    const skills = this.actor.items.filter(i => i.type === 'skill');

    // Common weapon skill mappings
    const skillMappings = {
      'sword': 'Edged Weapons',
      'knife': 'Edged Weapons',
      'blade': 'Edged Weapons',
      'katana': 'Edged Weapons',
      'club': 'Clubs',
      'staff': 'Pole Arms',
      'spear': 'Pole Arms',
      'whip': 'Whips',
      'pistol': 'Pistols',
      'rifle': 'Rifles',
      'shotgun': 'Shotguns',
      'smg': 'SMG',
      'assault': 'Assault Rifles'
    };

    // Try to find matching skill
    for (const [weaponType, skillName] of Object.entries(skillMappings)) {
      if (weaponName.includes(weaponType)) {
        const skill = skills.find(s => s.system.baseSkill === skillName);
        if (skill) return skill;
      }
    }

    // Default to first combat skill found
    const combatSkills = ['Edged Weapons', 'Clubs', 'Pole Arms', 'Whips', 'Pistols', 'Rifles', 'Shotguns', 'SMG', 'Assault Rifles'];
    for (const skillName of combatSkills) {
      const skill = skills.find(s => s.system.baseSkill === skillName);
      if (skill) return skill;
    }

    return null;
  }

  /**
   * Get effective skill rating for a skill item
   */
  _getSkillRating(skill) {
    if (!skill) return 0;
    
    const baseRating = skill.system.baseRating || 0;
    const concRating = skill.system.concentrationRating || 0;
    const specRating = skill.system.specializationRating || 0;
    
    // Return the highest rating available
    return Math.max(baseRating, concRating, specRating);
  }
}
