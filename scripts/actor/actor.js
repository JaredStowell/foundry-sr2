/**
 * Extend the base Actor document to support Shadowrun 2E
 */
import { sr2ComputeSpellLockAugmentationModifiers } from "../sr2-rules.js";

export class SR2Actor extends Actor {

  /** @override */
  prepareData() {
    super.prepareData();
  }

  /** @override */
  prepareBaseData() {
    // Data modifications in this step occur before processing derived data
  }

  /** @override */
  prepareDerivedData() {
    const actorData = this;

    // Make separate methods for each Actor type to keep things organized
    this._prepareCharacterData(actorData);
    this._prepareSpiritData(actorData);
  }

  /**
   * Prepare Character type specific data
   */
  _prepareCharacterData(actorData) {
    if (!['character', 'contact', 'follower'].includes(actorData.type)) return;

    const systemData = actorData.system;

    // Derived Essence (current = base max - installed cyberware Essence cost)
    this._calculateEssence(systemData);

    // Cache augmentation modifiers for this prepare cycle (used by sheets and derived calcs)
    const modifiers = this._calculateAugmentationModifiers();
    this._sr2AugmentationModifiers = modifiers;

    // Calculate derived attributes
    this._calculateDerivedAttributes(systemData, modifiers);
    this._calculateConditionMonitors(systemData);
    this._calculateInitiative(systemData, modifiers);
  }

  _prepareSpiritData(actorData) {
    if (!['spirit', 'critter', 'ic'].includes(actorData.type)) return;

    const systemData = actorData.system;
    if (!systemData) return;

    const attrs = systemData.attributes || {};
    const reaction = Number(attrs.reaction?.value) || 0;

    const spiritForm = String(systemData.spiritForm || "manifest");
    const formBonus = actorData.type === "ic" ? 0 : (spiritForm === "astral" ? 20 : 10);

    if (!systemData.initiative) systemData.initiative = {};

    systemData.initiative.dice = 1;
    systemData.initiative.base = reaction + formBonus;

    const current = Number(systemData.initiative.current);
    systemData.initiative.current = Number.isFinite(current) ? current : 0;
  }

  _calculateEssence(systemData) {
    const attrs = systemData.attributes;
    if (!attrs?.essence) return;

    const round2 = (value) => Math.round((value + Number.EPSILON) * 100) / 100;

    const baseEssence = Number(attrs.essence.max) || 6;
    const installedCyberware = this.items.filter(i => i.type === 'cyberware' && i.system.installed);
    const totalEssenceLoss = round2(installedCyberware.reduce((total, cyber) => {
      return total + (parseFloat(cyber.system.essence) || 0);
    }, 0));

    attrs.essence.value = round2(Math.max(0, baseEssence - totalEssenceLoss));
  }

  /**
   * Calculate derived attributes like Reaction, Initiative, etc.
   */
  _calculateDerivedAttributes(systemData, modifiers = null) {
    const attrs = systemData.attributes;

    // Apply cyberware and bioware modifiers to attributes
    if (!modifiers) modifiers = this._calculateAugmentationModifiers();

    // Base attributes with modifiers applied
    const modifiedAttrs = {
      body: attrs.body.value + (modifiers.BOD || 0),
      quickness: attrs.quickness.value + (modifiers.QCK || 0),
      strength: attrs.strength.value + (modifiers.STR || 0),
      charisma: attrs.charisma.value + (modifiers.CHA || 0),
      intelligence: attrs.intelligence.value + (modifiers.INT || 0),
      willpower: attrs.willpower.value + (modifiers.WIL || 0)
    };

    // Reaction = floor((Quickness + Intelligence) / 2) + Reaction modifiers
    modifiedAttrs.reaction = Math.floor((modifiedAttrs.quickness + modifiedAttrs.intelligence) / 2) + (modifiers.RCT || 0);

    // Update the reaction attribute with modifiers
    attrs.reaction.value = modifiedAttrs.reaction;

    // Magic is capped by Essence (rounded down) for awakened/adepts; 0 otherwise
    const isMagical = Boolean(systemData.magic?.awakened || systemData.magic?.physicalAdept);
    if (attrs.magic) {
      if (isMagical) {
        const essence = Number(attrs.essence?.value);
        const maxMagic = Number.isFinite(essence) ? Math.floor(Math.max(0, essence)) : 0;

        let magicValue = Number(attrs.magic.value);
        if (!Number.isFinite(magicValue)) magicValue = maxMagic;

        // Default to max Magic if not initialized (so awakened actors start with a Magic rating).
        if (magicValue <= 0 && maxMagic > 0) magicValue = maxMagic;

        // Clamp current Magic to Essence-derived maximum.
        attrs.magic.value = Math.max(0, Math.min(magicValue, maxMagic));
      } else {
        attrs.magic.value = 0;
      }
    }

    // Combat Pool = (Modified Quickness + Modified Intelligence + Modified Willpower) / 2 + Combat Pool bonuses,
    // reduced by heavy-armor encumbrance (SR2 core, p. 84).
    const baseCombatPool = Math.floor((modifiedAttrs.quickness + modifiedAttrs.intelligence + modifiedAttrs.willpower) / 2) + (modifiers.CPL || 0);
    const armorCombatPoolPenalty = this._getHeavyArmorCombatPoolPenalty(modifiedAttrs.quickness);
    systemData.pools.combat.max = Math.max(0, baseCombatPool - armorCombatPoolPenalty);

    const isSpellcaster = systemData.magic.awakened && !systemData.magic.physicalAdept;
    const powerFocusBonus = isSpellcaster ? this._getPowerFocusBonus() : 0;
    this._sr2PowerFocusBonus = powerFocusBonus;

    if (attrs.magic) {
      const baseMagic = Number(attrs.magic.value) || 0;
      attrs.magic.powerFocusBonus = powerFocusBonus;
      attrs.magic.effective = baseMagic + powerFocusBonus;
    }

    // Magic Pool (stored as `pools.spell`) = Sorcery + Power Focus (spellcasters only)
    if (isSpellcaster) {
      const sorcerySkill = this._getHighestSorcerySkill();
      systemData.pools.spell.max = sorcerySkill + powerFocusBonus;
    } else {
      systemData.pools.spell.max = 0;
    }

    // Hacking Pool = Modified Reaction + highest Computer skill
    const hackingSkill = this._getHighestComputerSkill();
    systemData.pools.hacking.max = modifiedAttrs.reaction + hackingSkill;

    // Control Pool = Modified Reaction + Vehicle Control Rig bonus
    const controlRigBonus = this._getControlRigBonus();
    systemData.pools.control.max = modifiedAttrs.reaction + controlRigBonus;

    // Task Pool = Modified Intelligence + highest relevant skill (simplified - using Intelligence base)
    systemData.pools.task.max = modifiedAttrs.intelligence;

    // Astral Combat Pool = floor((Intelligence + Willpower + Charisma) / 2) (spellcasters only)
    if (isSpellcaster) {
      systemData.pools.astral.max = Math.floor((modifiedAttrs.intelligence + modifiedAttrs.willpower + modifiedAttrs.charisma) / 2);
    } else {
      systemData.pools.astral.max = 0;
    }

    // Initialize current values if not set
    Object.keys(systemData.pools).forEach(poolName => {
      if (poolName === 'karma') return;

      const pool = systemData.pools[poolName];
      if (!pool) return;
      if (pool.current === undefined) pool.current = pool.max;

      const max = Number(pool.max) || 0;
      const cur = Number(pool.current) || 0;
      pool.current = Math.max(0, Math.min(cur, max));
    });
  }

  /**
   * Get the rating of a skill by base skill name
   */
  _getSkillMaxRatingValue(skill) {
    if (!skill?.system) return 0;

    const baseRating = Number(skill.system.baseRating) || 0;
    const concRating = Number(skill.system.concentrationRating) || 0;
    const specRating = Number(skill.system.specializationRating) || 0;
    const legacyRating = Number(skill.system.rating) || 0;
    return Math.max(baseRating, concRating, specRating, legacyRating);
  }

  /**
   * Get the rating of a skill by base skill name
   */
  _getSkillRating(baseSkillName) {
    const skills = this.items.filter(i => i.type === 'skill' && i.system.baseSkill === baseSkillName);
    if (skills.length === 0) return 0;
    
    // Return the highest rating if multiple concentrations exist
    return Math.max(...skills.map(skill => this._getSkillMaxRatingValue(skill)));
  }

  /**
   * Get the highest Computer skill rating for Hacking Pool
   * Looks for Computer base skill and any concentrations (Software, etc.)
   */
  _getHighestComputerSkill() {
    const computerSkills = this.items.filter(i =>
      i.type === 'skill' && i.system.baseSkill === 'Computer'
    );

    if (computerSkills.length === 0) return 0;
    
    // Return the highest rating among all Computer skill concentrations
    return Math.max(...computerSkills.map(skill => this._getSkillMaxRatingValue(skill)));
  }

  /**
   * Get the highest Sorcery skill rating for Magic Pool
   * Looks for Sorcery base skill and any concentrations
   */
  _getHighestSorcerySkill() {
    const sorcerySkills = this.items.filter(i =>
      i.type === 'skill' && i.system.baseSkill === 'Sorcery'
    );

    if (sorcerySkills.length === 0) return 0;
    
    // Return the highest rating among all Sorcery skill concentrations
    return Math.max(...sorcerySkills.map(skill => this._getSkillMaxRatingValue(skill)));
  }

  /**
   * Get Vehicle Control Rig bonus for Control Pool
   * Level 1 = +2, Level 2 = +4, Level 3 = +6
   */
  _getControlRigBonus() {
    const controlRigs = this.items.filter(i =>
      i.type === 'cyberware' &&
      i.system.installed &&
      i.name.toLowerCase().includes('control rig')
    );

    if (controlRigs.length === 0) return 0;

    // Find the highest level control rig
    let highestLevel = 0;
    for (const rig of controlRigs) {
      const rating = rig.system.rating || 0;
      if (rating > highestLevel) {
        highestLevel = rating;
      }
    }

    // Convert rating to bonus: Level 1 = +2, Level 2 = +4, Level 3 = +6
    return highestLevel * 2;
  }

  _getPowerFocusBonus() {
    const powerFoci = this.items.filter(i =>
      i.type === 'gear' &&
      i.system?.equipped &&
      /^Power Focus\s+\d+$/i.test(String(i.name || ""))
    );

    if (powerFoci.length === 0) return 0;

    let highestRating = 0;
    for (const focus of powerFoci) {
      const match = String(focus.name || "").match(/^Power Focus\s+(\d+)$/i);
      const rating = match ? parseInt(match[1], 10) : 0;
      if (Number.isFinite(rating) && rating > highestRating) highestRating = rating;
    }

    return highestRating;
  }

  _getHeavyArmorCombatPoolPenalty(modifiedQuickness) {
    // SR2: Partial/Full Heavy Armor reduces Combat Pool by 1 die for every point of Ballistic Armor Rating
    // over the character's Quickness.
    const qck = Math.max(0, Number(modifiedQuickness) || 0);
    const equippedArmor = this.items.filter(i => i.type === "armor" && i.system?.equipped);
    if (!equippedArmor.length) return 0;

    // Heuristic: treat any equipped armor piece with Ballistic >= 6 as "heavy armor".
    const isHeavy = equippedArmor.some(a => (Number(a.system?.ballistic) || 0) >= 6);
    if (!isHeavy) return 0;

    const totalBallistic = equippedArmor.reduce((sum, a) => sum + (Number(a.system?.ballistic) || 0), 0);
    return Math.max(0, totalBallistic - qck);
  }

  /**
   * Calculate attribute modifiers from installed cyberware and bioware
   * Parses the "Mods" field to extract bonuses like +1BOD, +2RCT, etc.
   */
  _calculateAugmentationModifiers() {
    const modifiers = {
      BOD: 0,    // Body
      QCK: 0,    // Quickness  
      STR: 0,    // Strength
      CHA: 0,    // Charisma
      INT: 0,    // Intelligence
      WIL: 0,    // Willpower
      RCT: 0,    // Reaction
      INI: 0,    // Initiative Dice
      CPL: 0     // Combat Pool
    };

    // Get all installed cyberware, bioware, and adept powers
    const augmentations = this.items.filter(i =>
      ((i.type === 'cyberware' || i.type === 'bioware') && i.system.installed) ||
      (i.type === 'adeptpower')
    );

    // Parse modifiers from each augmentation
    for (const aug of augmentations) {
      // Explicit cyberware fields (in addition to optional Mods string)
      if (aug.type === 'cyberware') {
        modifiers.RCT += Number(aug.system.reactionBonus) || 0;
        modifiers.INI += Number(aug.system.initiativeDice) || 0;
      }

      const mods = aug.system.mods || "";
      if (!mods) continue;

      // For adept powers, multiply by current level if it has levels
      let levelMultiplier = 1;
      if (aug.type === 'adeptpower' && aug.system.hasLevels) {
        levelMultiplier = aug.system.currentLevel || 1;
      }

      // Parse modifier string like "+1BOD,+2RCT" or "+1QCK,+1STR"
      const modParts = mods.split(',');

      for (const modPart of modParts) {
        const trimmed = modPart.trim();
        if (!trimmed) continue;

        // Match pattern like "+1BOD" or "+2RCT"
        const match = trimmed.match(/([+-]\d+)([A-Z]{3})/);
        if (match) {
          const baseValue = parseInt(match[1]);
          const attribute = match[2];
          const finalValue = baseValue * levelMultiplier;

          if (modifiers.hasOwnProperty(attribute)) {
            modifiers[attribute] += finalValue;
          }
        }
      }
    }

	    // Sustained spell bonuses (e.g., Increase Reflexes)
    const spellLockModifiers = sr2ComputeSpellLockAugmentationModifiers(this.items);
    for (const [key, value] of Object.entries(spellLockModifiers)) {
      if (Object.prototype.hasOwnProperty.call(modifiers, key)) {
        modifiers[key] += Number(value) || 0;
      }
    }

    return modifiers;
  }

  /**
   * Calculate condition monitors (Physical and Stun damage)
   */
  _calculateConditionMonitors(systemData) {
    const attrs = systemData.attributes;

    // Physical Condition Monitor = 10
    systemData.health.physical.max = 10;

    // Stun Condition Monitor = 10  
    systemData.health.stun.max = 10;
  }

  /**
   * Calculate initiative
   */
  _calculateInitiative(systemData, modifiers = null) {
    const attrs = systemData.attributes;
    if (!modifiers) modifiers = this._calculateAugmentationModifiers();

    // Base initiative = Reaction (already includes modifiers via derived attributes)
    systemData.initiative.base = attrs.reaction.value;

    // Initiative dice = 1 base + INI modifiers from cyberware
    systemData.initiative.dice = 1 + (modifiers.INI || 0);
  }

  /**
   * Roll dice for Shadowrun 2E with exploding 6s
   */
  async rollDice(dicePool, targetNumber = 4, title = "Dice Roll", options = {}) {
    // Ensure dicePool is a number and at least 1
    dicePool = Math.max(1, Number(dicePool) || 1);
    targetNumber = Math.max(2, Number(targetNumber) || 4);

    const sources = Array.isArray(options?.sources) ? options.sources : null;
    const suppressChat = Boolean(options?.suppressChat);
    
    const diceResults = [];
    let totalSuccesses = 0;
    let totalOnes = 0;
    const shouldExplode = targetNumber > 6;

    const successesBySource = {};
    const onesBySource = {};

    // Roll each die in the pool
    for (let i = 0; i < dicePool; i++) {
      const dieResults = [];
      let currentRoll = Math.floor(Math.random() * 6) + 1;
      let dieTotal = currentRoll;
      dieResults.push(currentRoll);

      // Rule of Six (only when TN > 6): exploding 6s - keep rolling while we get 6s
      while (shouldExplode && currentRoll === 6) {
        currentRoll = Math.floor(Math.random() * 6) + 1;
        dieTotal += currentRoll;
        dieResults.push(currentRoll);
      }

      // Count successes and ones for this die
      const isOne = dieResults[0] === 1;
      const isSuccess = !isOne && dieTotal >= targetNumber;
      const source = String(sources?.[i] ?? "base");
      if (isSuccess) {
        totalSuccesses++;
        successesBySource[source] = (successesBySource[source] || 0) + 1;
      }
      if (isOne) { // Only the first roll counts for ones
        totalOnes++;
        onesBySource[source] = (onesBySource[source] || 0) + 1;
      }

      diceResults.push({
        results: dieResults,
        total: dieTotal,
        success: isSuccess,
        isOne: isOne,
        source
      });
    }

    // Critical failure only occurs when ALL dice show 1 on their first roll
    const isCriticalFailure = totalOnes === dicePool && totalSuccesses === 0;

    const chatData = {
      user: game.user.id,
      speaker: ChatMessage.getSpeaker({ actor: this }),
      content: await foundry.applications.handlebars.renderTemplate("systems/shadowrun2e/templates/chat/dice-roll.html", {
        title: title,
        successes: totalSuccesses,
        ones: totalOnes,
        isCriticalFailure: isCriticalFailure,
        dicePool: dicePool,
        targetNumber: targetNumber,
        diceResults: diceResults
      })
    };

    if (!suppressChat) {
      ChatMessage.create(chatData);
    }

    return {
      successes: totalSuccesses,
      ones: totalOnes,
      isCriticalFailure: isCriticalFailure,
      dicePool,
      targetNumber,
      diceResults,
      successesBySource,
      onesBySource
    };
  }

  /**
   * Prepare a data object which is passed to any Roll formulas
   */
  getRollData() {
    const data = {};

    // Copy the actor's system data
    if (this.system) {
      data.actor = foundry.utils.deepClone(this.system);

      // Ensure initiative roll terms exist for core Combat initiative formulas (Roll All / Roll NPCs).
      const systemData = data.actor;
      if (!systemData.initiative) systemData.initiative = {};

      // Spirits/Critters/IC: base Reaction (per type) + 10/20 (manifest/astral), then roll 1d6.
      if (this.type === "spirit" || this.type === "critter" || this.type === "ic") {
        const reaction = Number(systemData.attributes?.reaction?.value) || 0;
        const spiritForm = String(systemData.spiritForm || "manifest");
        const formBonus = this.type === "ic" ? 0 : (spiritForm === "astral" ? 20 : 10);

        systemData.initiative.dice = 1;
        systemData.initiative.base = reaction + formBonus;
      } else {
        let initiativeDice = Number(systemData.initiative?.dice);
        if (!Number.isFinite(initiativeDice) || initiativeDice < 1) initiativeDice = 1;

        let initiativeBase = Number(systemData.initiative?.base);
        if (!Number.isFinite(initiativeBase)) {
          const reaction = Number(systemData.attributes?.reaction?.value);
          initiativeBase = Number.isFinite(reaction) ? reaction : 0;
        }

        systemData.initiative.dice = initiativeDice;
        systemData.initiative.base = initiativeBase;
      }

      let initiativeCurrent = Number(systemData.initiative?.current);
      if (!Number.isFinite(initiativeCurrent) || initiativeCurrent < 0) initiativeCurrent = 0;
      systemData.initiative.current = initiativeCurrent;
    }

    // Add level for easier access, or fall back to 0
    if (this.system.details?.level) {
      data.lvl = this.system.details.level;
    } else {
      data.lvl = 0;
    }

    return data;
  }
}
