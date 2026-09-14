// Small, in-memory adapters for rendering system code without a Foundry installation.
export const clone = (value) => structuredClone(value);
export function getProperty(value, path) {
  return path.split(".").reduce((v, key) => v?.[key], value);
}
export function setProperty(value, path, next) {
  const keys = path.split(".");
  const last = keys.pop();
  for (const key of keys) value = value[key] ??= {};
  value[last] = next;
}
export function mergeObject(target = {}, source = {}) {
  const merged = clone(target);
  for (const [key, value] of Object.entries(source)) {
    merged[key] =
      value && typeof value === "object" && !Array.isArray(value)
        ? mergeObject(merged[key] ?? {}, value)
        : clone(value);
  }
  return merged;
}
export class Collection extends Array {
  get(id) {
    return this.find((entry) => entry.id === id);
  }
  get contents() {
    return Array.from(this);
  }
}
export const preview = { mountApp: null, mountDialog: null, lastDialog: null, notify: null };

class Document {
  constructor(data) {
    Object.assign(this, clone(data));
    this.id = this._id ?? crypto.randomUUID();
    this._id = this.id;
    this.flags ??= {};
    this.isOwner = true;
    this.items = Collection.from((data.items ?? []).map((item) => new Document(item)));
    for (const item of this.items) item.parent = this;
  }
  toObject() {
    return clone({
      _id: this.id,
      id: this.id,
      name: this.name,
      type: this.type,
      img: this.img,
      system: this.system,
      flags: this.flags,
      items: this.items.map((item) => item.toObject()),
    });
  }
  async update(changes) {
    for (const callback of Hooks.handlers.get("preUpdateActor") ?? [])
      callback(this, changes, {}, game.user.id);
    for (const [key, value] of Object.entries(changes)) {
      if (key.includes(".")) setProperty(this, key, clone(value));
      else this[key] = value && typeof value === "object" ? mergeObject(this[key], value) : value;
    }
    this.prepareDerivedData?.();
    return this;
  }
  getFlag(scope, key) {
    return this.flags[scope]?.[key];
  }
  getRollData() {
    return { actor: clone(this.system) };
  }
}

class Application {
  constructor(options = {}) {
    this.options = mergeObject(this.constructor.defaultOptions, options);
    this.position = this.options;
  }
  static get defaultOptions() {
    return { classes: [], width: 650, height: 650, tabs: [] };
  }
  getData() {
    return { editable: true, isGM: true, cssClass: "editable" };
  }
  render() {
    return preview.mountApp(this);
  }
  activateListeners() {}
  setPosition() {}
  _getHeaderButtons() {
    return [];
  }
  close() {
    return Promise.resolve();
  }
}
class ActorSheet extends Application {
  constructor(actor, options = {}) {
    super(options);
    this.actor = this.object = actor;
    this.isEditable = true;
  }
  getData() {
    const actor = this.actor.toObject();
    return {
      ...super.getData(),
      actor,
      data: actor,
      system: actor.system,
      items: actor.items,
      flags: actor.flags,
    };
  }
  _getSubmitData(updateData = {}) {
    return updateData;
  }
  async _updateObject(event, changes) {
    await this.actor.update(changes);
  }
}
class ItemSheet extends Application {
  constructor(item) {
    super();
    this.item = this.object = item;
    this.isEditable = true;
  }
  getData() {
    const item = this.item.toObject();
    return { ...super.getData(), item, data: item, system: item.system };
  }
}
class Dialog extends Application {
  static get defaultOptions() {
    return { ...super.defaultOptions, width: 620, height: "auto" };
  }
  constructor(data, options = {}) {
    super(options);
    this.data = data;
  }
  render() {
    preview.lastDialog = this;
    preview.mountDialog(this);
    return this;
  }
  close() {
    this.data.close?.();
    return Promise.resolve();
  }
  static confirm(data) {
    return new Promise((resolve) =>
      new Dialog(
        {
          ...data,
          buttons: {
            yes: { label: "Yes", callback: () => resolve(true) },
            no: { label: "No", callback: () => resolve(false) },
          },
        },
        data.options,
      ).render(),
    );
  }
}

const handlers = new Map();
Object.assign(globalThis, {
  Actor: Document,
  Item: Document,
  Application,
  ActorSheet,
  ItemSheet,
  Dialog,
  Combat: class {},
  Hooks: {
    handlers,
    on: (name, callback) => {
      if (!handlers.has(name)) handlers.set(name, []);
      handlers.get(name).push(callback);
    },
    off() {},
    callAll() {},
  },
  foundry: {
    utils: {
      mergeObject,
      deepClone: clone,
      getProperty,
      setProperty,
      duplicate: clone,
      debounce: (fn) => fn,
    },
    applications: { handlebars: {} },
  },
  game: {
    user: { id: "preview", isGM: true, targets: new Set() },
    actors: new Collection(),
    combats: new Collection(),
    settings: {
      get: (_scope, key) => ({ quickActionsWidth: 340, quickActionsHeight: 440 })[key] ?? false,
      set: async () => {},
    },
    i18n: { localize: (key) => key, format: (key) => key },
  },
  ui: {
    notifications: Object.fromEntries(
      ["info", "warn", "error"].map((level) => [level, (message) => preview.notify?.(message)]),
    ),
  },
  canvas: { tokens: { controlled: [], placeables: [] }, scene: null },
  CONFIG: { Actor: {}, Item: {}, statusEffects: [] },
  CONST: { CHAT_MESSAGE_TYPES: { ROLL: 5 } },
});

const templates = new Map();
export async function renderTemplate(path, data) {
  if (!templates.has(path))
    templates.set(
      path,
      fetch(`/${path.replace(/^\//, "")}`)
        .then((response) => {
          if (!response.ok) throw new Error(`Template not found: ${path}`);
          return response.text();
        })
        .then((text) => Handlebars.compile(text)),
    );
  return (await templates.get(path))(data);
}
foundry.applications.handlebars.renderTemplate = renderTemplate;
globalThis.renderTemplate = renderTemplate;
Handlebars.registerHelper({
  eq: (a, b) => a === b,
  gt: (a, b) => a > b,
  lt: (a, b) => a < b,
  lte: (a, b) => a <= b,
  and: (...args) => args.slice(0, -1).every(Boolean),
  or: (...args) => args.slice(0, -1).some(Boolean),
  not: (a) => !a,
  add: (a, b) => a + b,
  capitalize: (s) => (typeof s === "string" ? s.charAt(0).toUpperCase() + s.slice(1) : ""),
  math: (a, op, b) =>
    ({
      "+": Number(a) + Number(b),
      "-": Number(a) - Number(b),
      "*": Number(a) * Number(b),
      "/": Number(a) / Number(b),
      "%": Number(a) % Number(b),
    })[op],
  safeNumber: (v, fallback = 0) =>
    typeof v === "number" && !Number.isNaN(v) ? v : typeof fallback === "number" ? fallback : 0,
  times: (n, block) => Array.from({ length: n }, (_, index) => block.fn({ index })).join(""),
  localize: (key) => key,
  checked: (value) => (value ? "checked" : ""),
});
