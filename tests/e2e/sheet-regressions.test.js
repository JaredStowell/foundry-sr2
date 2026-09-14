import { readFileSync } from "node:fs";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { JSDOM } from "jsdom";
import jqueryFactory from "jquery";
import { sr2EnhanceActorCreateDialog } from "../../scripts/create-actor-dialog.js";

let dom;
let $;

beforeEach(() => {
  dom = new JSDOM("<!doctype html><body></body>");
  $ = jqueryFactory(dom.window);
  vi.stubGlobal("$", $);
  vi.stubGlobal("jQuery", $);
  game.settings = { get: vi.fn(() => false) };
  game.actors.__clear();
  delete globalThis.__sr2eCreateActorCatalogCache;
});

afterEach(() => {
  dom.window.close();
  vi.unstubAllGlobals();
});

async function loadSheet(actor) {
  vi.resetModules();
  vi.stubGlobal(
    "ActorSheet",
    class {
      constructor(actor) {
        this.actor = this.object = actor;
      }
      _getSubmitData(updateData) {
        return { name: "Stale Name", ...updateData };
      }
    },
  );
  const { SR2ActorSheet } = await import("../../scripts/actor/actor-sheet.js");
  return new SR2ActorSheet(actor);
}

describe("sheet save and reset regressions", () => {
  it("saves a name change even when the core change listener submits before dirty tracking", async () => {
    const actor = { system: {}, update: vi.fn(async () => {}) };
    const sheet = await loadSheet(actor);
    await sheet._updateObject(
      { target: { name: "name" } },
      { name: "Anna", "system.pools.karma.current": 0 },
    );
    expect(actor.update).toHaveBeenCalledWith({ name: "Anna" });

    actor.update.mockClear();
    await sheet._updateObject({}, { name: "Stale Name" });
    expect(actor.update).not.toHaveBeenCalled();
  });

  it("saves explicit portrait updates from FilePicker without submitting stale fields", async () => {
    const actor = { system: {}, update: vi.fn(async () => {}) };
    const sheet = await loadSheet(actor);
    await sheet._updateObject({}, sheet._getSubmitData({ img: "portraits/anna.webp" }));
    expect(actor.update).toHaveBeenCalledWith({ img: "portraits/anna.webp" });
  });

  it("resets all pools including Karma and Magic, and prevents a stale close from undoing it", async () => {
    const actor = {
      name: "Mage",
      system: {
        pools: {
          spell: { current: 0, max: 6 },
          karma: { current: 0, total: 2 },
          hacking: { current: 1, max: 4 },
        },
      },
      update: vi.fn(async () => {}),
    };
    const sheet = await loadSheet(actor);
    sheet._dirtyFields.actorFields.add("system.pools.spell.current");
    await sheet._onResetAllPools({ preventDefault: vi.fn(), stopPropagation: vi.fn() });
    expect(actor.update).toHaveBeenCalledWith({
      "system.pools.spell.current": 6,
      "system.pools.karma.current": 2,
      "system.pools.hacking.current": 4,
    });
    actor.update.mockClear();
    await sheet._updateObject({}, { "system.pools.spell.current": 0 });
    expect(actor.update).not.toHaveBeenCalled();
  });

  it("limits Hacking Pool to base dice and rechecks pool availability when a dialog rolls", async () => {
    const actor = {
      system: { pools: { hacking: { current: 9, max: 7 } } },
      update: vi.fn(async () => {}),
      rollDice: vi.fn(async () => ({ successes: 1 })),
    };
    const sheet = await loadSheet(actor);
    let config;
    let html;
    vi.stubGlobal(
      "Dialog",
      class {
        constructor(data) {
          config = data;
        }
        render() {
          html = $(config.content);
          config.render(html);
        }
      },
    );
    const result = sheet._showTargetNumberDialog(3, "Program", "program");
    const input = html.find('input[name="pool-hacking-dice"]');
    expect(input.attr("max")).toBe("3");
    html.find('input[name="pool-hacking"]').prop("checked", true);
    input.val(99);
    actor.system.pools.hacking.current = 2;
    await config.buttons.roll.callback(html);
    await result;
    expect(actor.update).toHaveBeenCalledWith({ "system.pools.hacking.current": 0 });
    expect(actor.rollDice.mock.calls[0][0]).toBe(5);
  });

  it("clears allocation checkboxes and dice with the casting dialog Reset button", async () => {
    const actor = { system: { pools: { spell: { current: 6, max: 6 } } } };
    const sheet = await loadSheet(actor);
    let config;
    let html;
    vi.stubGlobal(
      "Dialog",
      class {
        constructor(data) {
          config = data;
        }
        render() {
          html = $(config.content);
          config.render(html);
        }
      },
    );
    const result = sheet._showTargetNumberDialog(4, "Casting", "spell");
    html.find('input[name="pool-spell"]').prop("checked", true).trigger("change");
    html.find('input[name="pool-spell-dice"]').val(4);
    html.find(".reset-pool-dice").trigger("click");
    expect(html.find('input[name="pool-spell"]').prop("checked")).toBe(false);
    expect(html.find('input[name="pool-spell-dice"]').val()).toBe("0");
    expect(html.find('input[name="pool-spell-dice"]').prop("disabled")).toBe(true);
    config.close();
    await result;
  });
});

describe("vehicle create dialog regression", () => {
  it("submits scalar Crawler fields and excludes inactive cyberdeck fields across type changes", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url) => ({
        json: async () => JSON.parse(readFileSync(`data/${String(url).split("/").pop()}`, "utf8")),
      })),
    );
    const form = $(
      '<form><input name="name" value="Runner"><select name="type"><option value="character">Character</option><option value="cyberdeck">Cyberdeck</option><option value="vehicle">Vehicle</option><option value="spirit">Spirit</option></select></form>',
    );
    sr2EnhanceActorCreateDialog(null, form);
    await vi.waitFor(() =>
      expect(form.find(".sr2-vehicle-template-select option").length).toBeGreaterThan(2),
    );
    form.find('select[name="type"]').val("vehicle").trigger("change");
    const crawler = form
      .find(".sr2-vehicle-template-select option")
      .toArray()
      .find((option) => option.textContent.includes("Crawler"));
    expect(crawler).toBeDefined();
    form.find(".sr2-vehicle-template-select").val(crawler.value).trigger("change");
    await vi.waitFor(() =>
      expect(form.find('input[name="system.cost"]').val()).not.toBeUndefined(),
    );
    for (const name of ["system.load", "system.cost", "system.streetIndex", "system.model"]) {
      expect(form.find(`[name="${name}"]`)).toHaveLength(1);
    }
    const data = new dom.window.FormData(form[0]);
    expect(data.get("system.model")).toBe("Aztech GCR-23C Crawler");
    expect(data.get("system.load")).toBe("15");
    expect(data.get("system.cost")).toBe("3750");
    expect(data.get("system.streetIndex")).toBe("1");
    form.find('select[name="type"]').val("cyberdeck").trigger("change");
    expect(form.find(".sr2-create-vehicle-details [name]")).toHaveLength(0);
    const deck = form
      .find(".sr2-cyberdeck-template-select option")
      .toArray()
      .find((option) => option.value);
    form.find(".sr2-cyberdeck-template-select").val(deck.value).trigger("change");
    await vi.waitFor(() =>
      expect(form.find('input[name="system.cost"]').val()).not.toBeUndefined(),
    );
    expect(form.find('[name="system.cost"]')).toHaveLength(1);
    form.find('select[name="type"]').val("character").trigger("change");
    expect(
      form.find(".sr2-create-vehicle-details [name], .sr2-create-cyberdeck-details [name]"),
    ).toHaveLength(0);
  });
});
