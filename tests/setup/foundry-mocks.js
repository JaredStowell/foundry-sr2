import { vi } from "vitest";

function getProperty(obj, path) {
  if (!obj || !path) return undefined;
  return path.split(".").reduce((acc, key) => (acc == null ? undefined : acc[key]), obj);
}

function deepClone(value) {
  if (Array.isArray(value)) return value.map((entry) => deepClone(entry));
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, deepClone(entry)]));
  }
  return value;
}

function mergeObject(target = {}, source = {}) {
  const base = target && typeof target === "object" ? target : {};
  const additions = source && typeof source === "object" ? source : {};
  const merged = { ...base };

  for (const [key, value] of Object.entries(additions)) {
    if (Array.isArray(value)) {
      merged[key] = value.map((entry) => deepClone(entry));
      continue;
    }

    if (value && typeof value === "object") {
      merged[key] = mergeObject(base[key] ?? {}, value);
      continue;
    }

    merged[key] = value;
  }

  return merged;
}

function setProperty(obj, path, value) {
  if (!obj || !path) return obj;

  const keys = path.split(".");
  const last = keys.pop();
  let current = obj;

  for (const key of keys) {
    if (!Object.prototype.hasOwnProperty.call(current, key) || current[key] == null) {
      current[key] = {};
    }
    current = current[key];
  }

  current[last] = value;
  return obj;
}

const hookHandlers = new Map();

globalThis.Hooks = {
  on: vi.fn((eventName, callback) => {
    if (!hookHandlers.has(eventName)) hookHandlers.set(eventName, []);
    hookHandlers.get(eventName).push(callback);
  }),
  __get(eventName) {
    return hookHandlers.get(eventName) || [];
  },
  __reset() {
    hookHandlers.clear();
  },
};

function createActorsCollection() {
  const storage = new Map();
  return {
    __set(actor) {
      storage.set(actor.id, actor);
    },
    __clear() {
      storage.clear();
    },
    get(id) {
      return storage.get(id);
    },
    filter(predicate) {
      return Array.from(storage.values()).filter(predicate);
    },
  };
}

function createCombatsCollection() {
  const storage = new Map();
  return {
    __set(combat) {
      storage.set(combat.id, combat);
    },
    __clear() {
      storage.clear();
    },
    get(id) {
      return storage.get(id);
    },
    find(predicate) {
      return Array.from(storage.values()).find(predicate);
    },
    values() {
      return storage.values();
    },
    get contents() {
      return Array.from(storage.values());
    },
    [Symbol.iterator]() {
      return storage.values();
    },
  };
}

let combatIdCounter = 1;
let combatantIdCounter = 1;

class MockCombatant {
  constructor(data = {}, combat) {
    this.id = data.id ?? `combatant-${combatantIdCounter++}`;
    this.combat = combat;
    this.actorId = data.actorId ?? null;
    this.tokenId = data.tokenId ?? null;
    this.flags = deepClone(data.flags ?? {});
    this.initiative = data.initiative ?? null;
    this._mockInitiativeTotal = data._mockInitiativeTotal ?? null;
  }

  get actor() {
    return game.actors.get(this.actorId) ?? null;
  }

  get token() {
    return this.combat?.scene?.tokens?.find?.((token) => token.id === this.tokenId) ?? null;
  }
}

class MockCombat {
  constructor(data = {}) {
    this.id = data.id ?? `combat-${combatIdCounter++}`;
    this.scene = typeof data.scene === "object" ? data.scene : { id: data.scene ?? "scene-1" };
    this.active = data.active ?? true;
    this.flags = deepClone(data.flags ?? {});
    this.round = data.round ?? 0;
    this.turn = data.turn ?? null;
    this.combatants = [];
    this.turns = [];

    for (const combatant of data.combatants ?? []) {
      this.combatants.push(new MockCombatant(combatant, this));
    }

    this.setupTurns();
  }

  static async create(data = {}) {
    const combat = new this(data);
    game.combats.__set(combat);
    return combat;
  }

  get started() {
    return Number(this.round) > 0;
  }

  get combatant() {
    return Number.isInteger(this.turn) && this.turn >= 0 ? (this.turns[this.turn] ?? null) : null;
  }

  setupTurns() {
    this.turns = [...this.combatants].sort((left, right) => {
      const leftInitiative =
        left.initiative === null || left.initiative === undefined
          ? -Infinity
          : Number(left.initiative);
      const rightInitiative =
        right.initiative === null || right.initiative === undefined
          ? -Infinity
          : Number(right.initiative);
      if (rightInitiative !== leftInitiative) return rightInitiative - leftInitiative;
      return String(left.id).localeCompare(String(right.id));
    });
    return this.turns;
  }

  async update(changes = {}) {
    for (const [path, value] of Object.entries(changes)) {
      if (path === "scene" && value && typeof value !== "object") {
        this.scene = { id: value };
        continue;
      }

      setProperty(this, path, deepClone(value));
    }

    this.setupTurns();
    return this;
  }

  async createEmbeddedDocuments(type, documents = []) {
    if (type !== "Combatant") return [];
    const created = documents.map((data) => new MockCombatant(data, this));
    this.combatants.push(...created);
    this.setupTurns();
    return created;
  }

  async updateEmbeddedDocuments(type, updates = []) {
    if (type !== "Combatant") return [];

    const updated = [];
    for (const change of updates) {
      const target = this.combatants.find(
        (combatant) => combatant.id === change._id || combatant.id === change.id,
      );
      if (!target) continue;

      for (const [key, value] of Object.entries(change)) {
        if (key === "_id" || key === "id") continue;
        if (key === "flags") {
          target.flags = mergeObject(target.flags, value);
          continue;
        }
        target[key] = deepClone(value);
      }

      updated.push(target);
    }

    this.setupTurns();
    return updated;
  }

  async deleteEmbeddedDocuments(type, ids = []) {
    if (type !== "Combatant") return [];
    const idSet = new Set(ids.map((value) => String(value)));
    this.combatants = this.combatants.filter((combatant) => !idSet.has(String(combatant.id)));
    this.setupTurns();
    return [];
  }

  async rollInitiative(ids) {
    const requestedIds = Array.isArray(ids) ? ids : [ids];
    for (const id of requestedIds) {
      const combatant = this.combatants.find((entry) => entry.id === id);
      if (!combatant) continue;

      const actor = combatant.actor;
      const total =
        combatant._mockInitiativeTotal ??
        actor?._mockInitiativeTotal ??
        actor?.system?.initiative?.current ??
        actor?.system?.initiative?.base ??
        0;
      combatant.initiative = Math.max(0, Number(total) || 0);
    }

    this.setupTurns();
    return this;
  }

  async nextTurn() {
    if (!this.turns.length) return this;
    const nextTurn = Number.isInteger(this.turn) ? this.turn + 1 : 0;
    if (nextTurn >= this.turns.length) {
      this.turn = 0;
      this.round = Math.max(1, Number(this.round) || 1) + 1;
    } else {
      this.turn = nextTurn;
    }
    return this;
  }

  async nextRound() {
    this.round = Math.max(1, Number(this.round) || 1) + 1;
    this.turn = 0;
    return this;
  }
}

globalThis.game = {
  user: {
    id: "U1",
    isGM: false,
  },
  actors: createActorsCollection(),
  combats: createCombatsCollection(),
};

globalThis.ui = {
  notifications: {
    warn: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
};

globalThis.foundry = {
  utils: {
    getProperty,
    setProperty,
    mergeObject,
    deepClone,
  },
};

globalThis.CONFIG = {
  Actor: {},
  Item: {},
  Combat: {
    initiative: {},
    documentClass: MockCombat,
  },
};

globalThis.Combat = MockCombat;

if (!globalThis.window) {
  globalThis.window = globalThis;
}

if (!globalThis.Application) {
  class MockApplication {
    constructor(options = {}) {
      this.options = options;
      this.rendered = false;
      this.position = {};
      this.element = null;
    }

    static get defaultOptions() {
      return {};
    }

    _getHeaderButtons() {
      return [];
    }

    getData() {
      return {};
    }

    render(force) {
      this.rendered = Boolean(force);
      return this;
    }

    async _render() {
      this.rendered = true;
    }

    async close() {
      this.rendered = false;
      return true;
    }

    setPosition(position = {}) {
      this.position = { ...this.position, ...position };
      return this.position;
    }

    activateListeners() {
      // no-op
    }
  }

  globalThis.Application = MockApplication;
}
