import { vi } from "vitest";

function getProperty(obj, path) {
    if (!obj || !path) return undefined;
    return path.split(".").reduce((acc, key) => (acc == null ? undefined : acc[key]), obj);
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
    }
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
        }
    };
}

globalThis.game = {
    user: {
        id: "U1",
        isGM: false
    },
    actors: createActorsCollection()
};

globalThis.ui = {
    notifications: {
        warn: vi.fn(),
        error: vi.fn(),
        info: vi.fn()
    }
};

globalThis.foundry = {
    utils: {
        getProperty,
        setProperty,
        mergeObject(target = {}, source = {}) {
            return { ...target, ...source };
        }
    }
};

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
