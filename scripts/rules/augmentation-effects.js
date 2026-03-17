const SR2_AUGMENTATION_MODIFIER_KEYS = new Set([
  "BOD",
  "QCK",
  "STR",
  "CHA",
  "INT",
  "WIL",
  "RCT",
  "INI",
  "CPL",
]);

const SR2_ROMAN_NUMERAL_VALUES = new Map([
  ["I", 1],
  ["II", 2],
  ["III", 3],
  ["IV", 4],
  ["V", 5],
  ["VI", 6],
  ["VII", 7],
  ["VIII", 8],
  ["IX", 9],
  ["X", 10],
]);

function sr2Round2(value) {
  return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
}

function sr2CoerceNumberish(value, fallback = 0) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}

function sr2GetItemEntries(items) {
  if (Array.isArray(items)) return items;
  if (!items) return [];
  if (typeof items.filter === "function") return items.filter(() => true);
  if (typeof items[Symbol.iterator] === "function") return Array.from(items);
  return [];
}

/**
 * SR2 augmentation entries encode attribute and reflex bonuses in compact modifier strings
 * such as "+2RCT,+1INI". Parse those strings once so all augmentation entry paths agree.
 */
export function sr2ParseAugmentationModifierString(mods, { multiplier = 1 } = {}) {
  const parsed = {
    BOD: 0,
    QCK: 0,
    STR: 0,
    CHA: 0,
    INT: 0,
    WIL: 0,
    RCT: 0,
    INI: 0,
    CPL: 0,
  };

  const factor = Math.max(1, Number(multiplier) || 1);
  const normalizedMods = String(mods || "").trim();
  if (!normalizedMods) return parsed;

  for (const rawPart of normalizedMods.split(",")) {
    const part = rawPart.trim();
    if (!part) continue;

    const match = part.match(/([+-]?\d+(?:\.\d+)?)([A-Z]{3})/);
    if (!match) continue;

    const key = match[2];
    if (!SR2_AUGMENTATION_MODIFIER_KEYS.has(key)) continue;

    parsed[key] += (Number(match[1]) || 0) * factor;
  }

  return parsed;
}

/**
 * SR2 cyberware/bioware names often embed rating or level information ("Wired Reflexes 2",
 * "Smartlink II"). Infer that rating so browser/importer/archetype-created items retain it.
 */
export function sr2InferAugmentationRating(name) {
  const normalized = String(name || "").trim();
  if (!normalized) return 0;

  const arabic = normalized.match(/(?:^|[\s(])(\d+)(?:\s*(?:Mp|pts?|point|level|lv))?\)?$/i);
  if (arabic) return Number(arabic[1]) || 0;

  const roman = normalized.match(/\b(I|II|III|IV|V|VI|VII|VIII|IX|X)\b$/i);
  if (roman) return SR2_ROMAN_NUMERAL_VALUES.get(roman[1].toUpperCase()) ?? 0;

  return 0;
}

/**
 * SR2 augmentation catalogs carry Essence/Bio Index, Street Index, and reflex modifiers.
 * Normalize those raw catalog entries into consistent item system data for every ingestion path.
 */
export function sr2BuildAugmentationSystemData({
  type,
  name,
  category = "",
  bookPage = "",
  cost = 0,
  streetIndex = 1.0,
  essence = 0,
  bioIndex = 0,
  mods = "",
  installed = false,
} = {}) {
  const normalizedType = type === "bioware" ? "bioware" : "cyberware";
  const normalizedName = String(name || "").trim();
  const normalizedMods = String(mods || "").trim();
  const modifierBonuses = sr2ParseAugmentationModifierString(normalizedMods);
  const numericCost = sr2CoerceNumberish(cost, 0);
  const numericStreetIndex = sr2CoerceNumberish(streetIndex, 1);
  const numericEssence = sr2Round2(sr2CoerceNumberish(essence, 0));
  const numericBioIndex = sr2Round2(sr2CoerceNumberish(bioIndex, 0));
  const rating = sr2InferAugmentationRating(normalizedName);

  const descriptionParts = [];
  if (category) descriptionParts.push(`Category: ${category}`);
  if (bookPage) descriptionParts.push(`Source: ${bookPage}`);

  if (normalizedType === "cyberware") {
    return {
      description: descriptionParts.join("\n"),
      price: numericCost,
      rating,
      essence: numericEssence,
      installed: Boolean(installed),
      bodyLocation: String(category || "").toLowerCase(),
      reactionBonus: modifierBonuses.RCT,
      initiativeDice: modifierBonuses.INI,
      streetIndex: numericStreetIndex,
      mods: normalizedMods,
    };
  }

  return {
    description: descriptionParts.join("\n"),
    price: numericCost,
    rating,
    bioIndex: numericBioIndex,
    installed: Boolean(installed),
    bodyLocation: String(category || "").toLowerCase(),
    streetIndex: numericStreetIndex,
    mods: normalizedMods,
  };
}

/**
 * SR2 catalogs are the canonical source for browser/importer/archetype augmentation items.
 * Build a normalized item record once so those paths stop drifting.
 */
export function sr2BuildCatalogAugmentationRecord({ type, category, item } = {}) {
  const normalizedType = type === "bioware" ? "bioware" : "cyberware";
  const source = item && typeof item === "object" ? item : {};

  const system = sr2BuildAugmentationSystemData({
    type: normalizedType,
    name: source.Name,
    category,
    bookPage: source.BookPage,
    cost: source.Cost,
    streetIndex: source.StreetIndex,
    essence: source.EssCost,
    bioIndex: source.BioIndex,
    mods: source.Mods,
    installed: false,
  });

  return {
    name: String(source.Name || "").trim(),
    category: String(category || ""),
    cost: source.Cost,
    streetIndex: system.streetIndex,
    bookPage: source.BookPage || "",
    mods: system.mods || "",
    type: normalizedType,
    ...(normalizedType === "cyberware"
      ? {
          essence: system.essence,
          rating: system.rating,
          reactionBonus: system.reactionBonus,
          initiativeDice: system.initiativeDice,
        }
      : {
          bioIndex: system.bioIndex,
          rating: system.rating,
        }),
  };
}

/**
 * SR2 current Essence equals base Essence minus installed cyberware Essence loss.
 * Compute the installed loss centrally so actor prep and install validation stay aligned.
 */
export function sr2ComputeInstalledCyberwareEssenceLoss(items) {
  const entries = sr2GetItemEntries(items);
  return sr2Round2(
    entries
      .filter((item) => item?.type === "cyberware" && item?.system?.installed)
      .reduce((sum, item) => sum + sr2CoerceNumberish(item?.system?.essence, 0), 0),
  );
}

/**
 * SR2 bioware consumes Bio Index capacity based on installed bioware only.
 * Compute that centrally so sheet install checks and tests use the same rule.
 */
export function sr2ComputeInstalledBiowareIndex(items, { excludeItemId = null } = {}) {
  const excluded = excludeItemId == null ? null : String(excludeItemId);
  const entries = sr2GetItemEntries(items);
  return sr2Round2(
    entries
      .filter((item) => {
        if (item?.type !== "bioware" || !item?.system?.installed) return false;
        if (excluded == null) return true;
        const itemId = item?.id ?? item?._id ?? null;
        return itemId == null || String(itemId) !== excluded;
      })
      .reduce((sum, item) => sum + sr2CoerceNumberish(item?.system?.bioIndex, 0), 0),
  );
}
