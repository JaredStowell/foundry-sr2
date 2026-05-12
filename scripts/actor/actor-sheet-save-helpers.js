export function sr2CreateDirtyFieldState() {
  return {
    actorFields: new Set(),
    itemFields: new Map(),
  };
}

export function sr2MarkDirtyField(dirty, fieldName) {
  if (!dirty || typeof fieldName !== "string" || !fieldName) return;

  const itemMatch = fieldName.match(/^items\.([^.]+)\.(.+)$/);
  if (itemMatch) {
    const [, itemId, itemPath] = itemMatch;
    if (!dirty.itemFields.has(itemId)) dirty.itemFields.set(itemId, new Set());
    dirty.itemFields.get(itemId).add(itemPath);
    return;
  }

  dirty.actorFields.add(fieldName);
}

export function sr2ClearDirtyFieldState(dirty) {
  dirty?.actorFields?.clear?.();
  dirty?.itemFields?.clear?.();
}

export function sr2FilterUpdatesToDirtyFields({ actorUpdates = {}, itemUpdates = {}, dirty }) {
  if (!dirty) return { actorUpdates, itemUpdates };

  const filteredActorUpdates = {};
  const filteredItemUpdates = {};
  const dirtyActorFields = dirty.actorFields ?? new Set();
  const dirtyItemFields = dirty.itemFields ?? new Map();

  for (const [key, value] of Object.entries(actorUpdates)) {
    if (dirtyActorFields.has(key)) filteredActorUpdates[key] = value;
  }

  for (const [itemId, updateData] of Object.entries(itemUpdates)) {
    const dirtyPaths = dirtyItemFields.get(itemId);
    if (!dirtyPaths?.size) continue;

    for (const [path, value] of Object.entries(updateData)) {
      if (!dirtyPaths.has(path)) continue;
      filteredItemUpdates[itemId] ||= {};
      filteredItemUpdates[itemId][path] = value;
    }
  }

  return {
    actorUpdates: filteredActorUpdates,
    itemUpdates: filteredItemUpdates,
  };
}

export function sr2BuildLifestyleUpdatesFromFormFields(actorUpdates, existingLifestyles = []) {
  const indexedKeys = [];
  const lifestyles = Array.isArray(existingLifestyles)
    ? existingLifestyles.map((entry) => ({
        type: entry?.type || "street",
        months: Math.max(1, parseInt(entry?.months, 10) || 1),
      }))
    : [];

  if (!lifestyles.length) lifestyles.push({ type: "street", months: 1 });

  for (const [key, value] of Object.entries(actorUpdates || {})) {
    const match = key.match(/^system\.resources\.lifestyles\.(\d+)\.(type|months)$/);
    if (!match) continue;

    indexedKeys.push(key);

    const index = parseInt(match[1], 10);
    if (!Number.isFinite(index)) continue;

    while (lifestyles.length <= index) lifestyles.push({ type: "street", months: 1 });

    if (match[2] === "type") lifestyles[index].type = String(value || "street");
    if (match[2] === "months") {
      lifestyles[index].months = Math.max(1, parseInt(value, 10) || 1);
    }
  }

  const primary = lifestyles[0] || { type: "street", months: 1 };
  return {
    changed: indexedKeys.length > 0,
    lifestyles,
    primaryType: primary.type || "street",
    primaryMonths: primary.months || 1,
    indexedKeys,
  };
}
