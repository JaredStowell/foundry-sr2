/**
 * Character Importer for Shadowrun 2E
 * Imports characters from JSON files into Foundry actors
 */
import {
  sr2BuildImportedActorData,
  sr2BuildImportedContactActorData,
  sr2BuildImportedItemData,
  sr2BuildImportedBiography,
} from "./character-importer-helpers.js";

export class SR2CharacterImporter {
  static _skillCatalogPromise = null;

  /**
   * Show the character import dialog
   */
  static async showImportDialog() {
    const dialog = new Dialog({
      title: "Import Shadowrun 2E Character",
      content: `
        <form>
          <div class="form-group">
            <label>Character JSON File:</label>
            <input type="file" name="characterFile" accept=".json" required>
          </div>
          <div class="form-group">
            <label>
              <input type="checkbox" name="createItems" checked>
              Import gear, weapons, and spells as items
            </label>
          </div>
          <div class="form-group">
            <label>
              <input type="checkbox" name="createContacts" checked>
              Create contact actors
            </label>
          </div>
        </form>
      `,
      buttons: {
        import: {
          icon: '<i class="fas fa-upload"></i>',
          label: "Import Character",
          callback: (html) => this._processImport(html),
        },
        cancel: {
          icon: '<i class="fas fa-times"></i>',
          label: "Cancel",
        },
      },
      default: "import",
    });

    dialog.render(true);
  }

  /**
   * Process the character import
   */
  static async _processImport(html) {
    const fileInput = html.find('input[name="characterFile"]')[0];
    const createItems = html.find('input[name="createItems"]').is(":checked");
    const createContacts = html.find('input[name="createContacts"]').is(":checked");

    if (!fileInput.files.length) {
      ui.notifications.error("Please select a character file to import.");
      return;
    }

    const file = fileInput.files[0];

    try {
      const text = await file.text();
      const characterData = JSON.parse(text);

      ui.notifications.info("Importing character...");

      const actor = await this._createCharacterActor(characterData, createItems, createContacts);

      ui.notifications.success(`Character "${actor.name}" imported successfully!`);
      actor.sheet.render(true);
    } catch (error) {
      console.error("Character import failed:", error);
      ui.notifications.error("Failed to import character. Check console for details.");
    }
  }

  static async _loadSkillCatalog() {
    if (this._skillCatalogPromise) return this._skillCatalogPromise;

    this._skillCatalogPromise = (async () => {
      if (typeof fetch !== "function") return {};

      try {
        const response = await fetch("/systems/shadowrun2e/data/skills.json");
        if (!response.ok) throw new Error(`Unexpected status ${response.status}`);
        return await response.json();
      } catch (error) {
        console.warn("SR2E | Failed to load skills catalog for character import", error);
        return {};
      }
    })();

    return this._skillCatalogPromise;
  }

  /**
   * Create the character actor from JSON data
   */
  static async _createCharacterActor(data, createItems = true, createContacts = true) {
    const actorData = sr2BuildImportedActorData(data);
    const actor = await Actor.create(actorData);

    if (createItems) {
      await this._importCharacterItems(actor, data);
    }

    if (createContacts && data?.contacts) {
      await this._createContactActors(data.contacts, actor.name, actor.id);
    }

    return actor;
  }

  /**
   * Import character items (skills, gear, spells, etc.)
   */
  static async _importCharacterItems(actor, data) {
    const skillCatalog = await this._loadSkillCatalog();
    const items = sr2BuildImportedItemData(data, { skillCatalog });

    if (!items.length) return;

    await actor.createEmbeddedDocuments("Item", items);
    console.log(`SR2E | Imported ${items.length} items for ${actor.name}`);
  }

  /**
   * Create contact actors
   */
  static async _createContactActors(contacts, characterName, leaderId = null) {
    const contactList = Array.isArray(contacts) ? contacts : Object.values(contacts || {});
    if (!contactList.length) return;

    let createdContacts = 0;

    for (const contact of contactList) {
      const contactData = sr2BuildImportedContactActorData(contact, { characterName, leaderId });
      if (!contactData) continue;
      await Actor.create(contactData);
      createdContacts += 1;
    }

    console.log(`SR2E | Created ${createdContacts} contact actors for ${characterName}`);
  }

  /**
   * Generate character biography from import data
   */
  static _generateBiography(data) {
    return sr2BuildImportedBiography(data);
  }
}
