import { preview, renderTemplate } from "./runtime.js";
import {
  anna,
  mage,
  adept,
  chargen,
  contact,
  follower,
  vehicle,
  deck,
  spirit,
  critter,
  ic,
  sampleItems,
  schema,
} from "./fixtures.js";
import { SR2ActorSheet } from "../../actor/actor-sheet.js";
import { SR2VehicleSheet } from "../../actor/vehicle-sheet.js";
import { SR2CyberdeckSheet } from "../../actor/cyberdeck-sheet.js";
import { SR2SpiritSheet } from "../../actor/spirit-sheet.js";
import { SR2ICSheet } from "../../actor/ic-sheet.js";
import { SR2ItemSheet } from "../../item/item-sheet.js";
import { SR2ItemBrowser } from "../../item-browser.js";
import { SR2GearPurchaseApp } from "../../gear-purchase.js";
import { SR2QuickActionsPopup } from "../../quick-actions.js";
import { SR2CharacterImporter } from "../../character-importer.js";
import { sr2EnhanceActorCreateDialog } from "../../create-actor-dialog.js";
import { registerActorRuleHooks } from "../../hooks/actor-rules.js";

registerActorRuleHooks();
const stage = document.querySelector("#preview-stage");
const status = document.querySelector("#preview-status");
const screens = [];
let currentScreen;
let activeApp;
let renderGeneration = 0;
preview.notify = (message) => {
  status.textContent = message;
};

function windowFrame(title, classes = [], width = 700, height = 650) {
  const element = document.createElement("article");
  element.className = ["preview-window", "app", "window-app", ...classes].join(" ");
  element.style.width = `${width}px`;
  element.style.height = typeof height === "number" ? `${height}px` : height;
  if (classes.includes("dialog")) element.style.maxHeight = "calc(100vh - 180px)";
  const header = document.createElement("header");
  header.className = "window-header";
  const heading = document.createElement("h3");
  heading.className = "window-title";
  heading.textContent = title;
  header.append(heading);
  const decoration = document.createElement("span");
  decoration.setAttribute("aria-hidden", "true");
  decoration.textContent = "⋮  ×";
  header.append(decoration);
  const content = document.createElement("section");
  content.className = "window-content";
  element.append(header, content);
  stage.replaceChildren(element);
  return { element, content };
}

function activateTab(content, tab) {
  content
    .querySelectorAll(".sheet-body > .tab")
    .forEach((panel) => panel.classList.toggle("active", panel.dataset.tab === tab));
  content
    .querySelectorAll(".sheet-tabs [data-tab]")
    .forEach((link) => link.classList.toggle("active", link.dataset.tab === tab));
}

preview.mountApp = async (app, initialTab) => {
  const generation = renderGeneration;
  activeApp = app;
  const data = await app.getData();
  const path = app.template ?? app.options.template;
  const html = await renderTemplate(path, data);
  if (generation !== renderGeneration) return;
  const { element, content } = windowFrame(
    app.title ?? app.actor?.name ?? app.item?.name ?? currentScreen?.label ?? "Preview",
    app.options.classes,
    app.options.width,
    app.options.height,
  );
  content.innerHTML = html;
  app.element = $(element);
  app.form = content.querySelector("form");
  const firstTab =
    initialTab ??
    app.options.tabs?.[0]?.initial ??
    content.querySelector(".sheet-tabs [data-tab]")?.dataset.tab;
  if (firstTab) activateTab(content, firstTab);
  $(content).on("click", ".sheet-tabs [data-tab]", (event) => {
    event.preventDefault();
    activateTab(content, event.currentTarget.dataset.tab);
  });
  $(content).on("submit", "form", (event) => event.preventDefault());
  // Invoke the real handlers for the regression controls, against memory-only actors.
  if (app instanceof SR2ActorSheet) {
    $(content).on("change", "[name]", async (event) => {
      const input = event.target;
      const value =
        input.type === "checkbox"
          ? input.checked
          : input.type === "number" || input.dataset.dtype === "Number"
            ? Number(input.value)
            : input.value;
      await app._updateObject(event, { [input.name]: value });
      preview.notify(`Saved sample field: ${input.name}`);
    });
    $(content).on("click", ".reset-all-pools", async (event) => {
      await app._onResetAllPools(event);
      await preview.mountApp(app, content.querySelector(".sheet-body > .tab.active")?.dataset.tab);
    });
    $(content).on("click", ".karma-earned-adjust", async (event) => {
      await app._onKarmaEarnedAdjust(event);
      await preview.mountApp(app, content.querySelector(".sheet-body > .tab.active")?.dataset.tab);
    });
    $(content).on("click", ".spell-cast", (event) => {
      event.preventDefault();
      void app._onSpellCast(event).catch(reportError);
    });
  }
  if (app instanceof SR2ItemBrowser) {
    $(content).on("input", ".item-search", async (event) => {
      const caret = event.target.selectionStart;
      app.searchTerm = event.target.value;
      await preview.mountApp(app);
      const input = stage.querySelector(".item-search");
      input.focus();
      input.setSelectionRange(caret, caret);
    });
  }
  return element;
};

preview.mountDialog = (dialog) => {
  const { element, content } = windowFrame(
    dialog.data.title,
    ["dialog", ...(dialog.options.classes ?? [])],
    dialog.options.width ?? 620,
    dialog.options.height ?? 650,
  );
  content.innerHTML = `<div class="dialog-content">${dialog.data.content}</div><footer class="dialog-buttons"></footer>`;
  const buttons = content.querySelector(".dialog-buttons");
  for (const [key, button] of Object.entries(dialog.data.buttons ?? {})) {
    const control = document.createElement("button");
    control.type = "button";
    control.innerHTML = `${button.icon ?? ""} ${Handlebars.escapeExpression(button.label ?? key)}`;
    // Preview the genuine dialog controls without simulating Foundry dice or imports.
    if (!["cancel", "no"].includes(key)) {
      control.title = "Rendering preview: this action requires Foundry.";
      control.addEventListener("click", () =>
        preview.notify("This is a styled preview. Executing this action requires Foundry."),
      );
    } else
      control.addEventListener("click", () => {
        dialog.close();
        preview.notify("Dialog closed in sample preview. Select another screen to continue.");
      });
    buttons.append(control);
  }
  dialog.data.render?.($(content));
  return element;
};

function reportError(error) {
  status.textContent = `Preview error: ${error.message}`;
  console.error(error);
}
function add(group, label, source, render) {
  const id = `${group}-${label}`.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  screens.push({ id, group, label, source, render });
}
function addApp(group, label, app, initialTab) {
  add(group, label, app.template ?? app.options.template, () => preview.mountApp(app, initialTab));
}
function sheet(actor, Class = SR2ActorSheet) {
  return (actor.sheet ??= new Class(actor));
}
for (const [actor, Class] of [
  [anna],
  [mage],
  [adept],
  [chargen],
  [contact],
  [follower],
  [vehicle, SR2VehicleSheet],
  [deck, SR2CyberdeckSheet],
  [spirit, SR2SpiritSheet],
  [critter, SR2SpiritSheet],
  [ic, SR2ICSheet],
]) {
  addApp("Actor sheets", `${actor.name} · ${actor.type}`, sheet(actor, Class));
}
for (const tab of [
  "attributes",
  "skills",
  "gear",
  "augmentations",
  "magic",
  "connections",
  "biography",
])
  addApp(
    "Character tabs",
    `${tab.charAt(0).toUpperCase() + tab.slice(1)} · ${tab === "magic" ? "Raven" : "Anna"}`,
    sheet(tab === "magic" ? mage : anna),
    tab === "attributes" ? "main" : tab,
  );
addApp("Character tabs", "Magic · physical adept", sheet(adept), "magic");
for (const entry of sampleItems)
  addApp("Item sheets", entry.name, new SR2ItemSheet(entry), "details");
for (const type of [
  "weapon",
  "armor",
  "gear",
  "cyberware",
  "bioware",
  "spell",
  "adeptpower",
  "totem",
  "program",
  "vrprogram",
])
  addApp(
    "Catalog browsers",
    type.charAt(0).toUpperCase() + type.slice(1),
    new SR2ItemBrowser(mage, type),
  );
addApp(
  "Applications",
  "Quick actions · Anna",
  new SR2QuickActionsPopup({ token: { actor: anna, id: "anna-token", name: "Anna" } }),
);
addApp(
  "Applications",
  "Quick actions · Raven",
  new SR2QuickActionsPopup({ token: { actor: mage, id: "mage-token", name: "Raven" } }),
);
addApp("Applications", "Follower gear purchase", new SR2GearPurchaseApp(follower));
for (const [label, path, data] of [
  ["Data import · pending", "apps/data-import.html", { dataImported: false }],
  ["Data import · complete", "apps/data-import.html", { dataImported: true }],
  ["Character import", "apps/character-import.html", {}],
  [
    "Dice result · success",
    "chat/dice-roll.html",
    {
      title: "Firearms · TN 4",
      successes: 3,
      ones: 1,
      dicePool: 6,
      targetNumber: 4,
      diceResults: [
        { results: [6, 2], total: 8, success: true },
        { results: [5], total: 5, success: true },
        { results: [4], total: 4, success: true },
        { results: [3], total: 3 },
        { results: [2], total: 2 },
        { results: [1], total: 1, isOne: true },
      ],
    },
  ],
  [
    "Dice result · critical failure",
    "chat/dice-roll.html",
    {
      title: "Computer · TN 5",
      successes: 0,
      ones: 4,
      dicePool: 4,
      targetNumber: 5,
      isCriticalFailure: true,
      diceResults: Array.from({ length: 4 }, () => ({ results: [1], total: 1, isOne: true })),
    },
  ],
]) {
  const app = new Application({
    title: label,
    template: `templates/${path}`,
    classes: ["shadowrun2e"],
    width: path.startsWith("chat") ? 440 : 650,
    height: 550,
  });
  app.getData = () => data;
  addApp("Applications", label, app);
}
async function waitFor(predicate, message) {
  const deadline = performance.now() + 8000;
  while (!predicate()) {
    if (performance.now() > deadline) throw new Error(message);
    await new Promise((resolve) => setTimeout(resolve, 20));
  }
}
function addDialog(label, create) {
  add(
    "Rolls and dialogs",
    label,
    "scripts/actor/actor-sheet.js · real dialog builder",
    async () => {
      preview.lastDialog = null;
      let error;
      Promise.resolve(create()).catch((reason) => {
        error = reason;
      });
      await waitFor(() => preview.lastDialog || error, `No dialog rendered: ${label}`);
      if (error) throw error;
    },
  );
}
addDialog("Skill test", () =>
  sheet(anna)._showTargetNumberDialog(6, "Firearms", "skill", 4, null, {
    baseSkillName: "Firearms",
  }),
);
addDialog("Attribute test", () => sheet(anna)._showTargetNumberDialog(6, "Body", "attribute"));
addDialog("Hacking test", () =>
  sheet(anna)._showTargetNumberDialog(4, "Attack program", "program"),
);
addDialog("Ranged attack", () =>
  sheet(anna)._showTargetNumberDialog(6, "Ares Predator", "attack", 4, anna.items.get("predator")),
);
addDialog("Spellcasting · linked foci", () =>
  sheet(mage)._onSpellCast({
    preventDefault() {},
    currentTarget: { dataset: { itemId: "manabolt" } },
  }),
);
addDialog("Drain resistance", () =>
  sheet(mage)._showTargetNumberDialog(6, "Drain Resistance", "drain", 4),
);
addDialog("Conjuring details", () => sheet(mage)._promptConjuringDetails());
addDialog("Melee modifiers", () => sheet(anna)._showMeleeCombatDialog(anna.items.get("katana")));
addDialog("Cyberware removal confirmation", () =>
  sheet(anna)._onCyberwareInstall({
    preventDefault() {},
    currentTarget: { checked: false, dataset: { itemId: "wired" } },
  }),
);
addDialog("Character file import", () => SR2CharacterImporter.showImportDialog());
screens.at(-1).source = "scripts/character-importer.js · real dialog builder";

for (const type of schema.Actor.types) {
  add(
    "Create actor",
    type.charAt(0).toUpperCase() + type.slice(1),
    "scripts/create-actor-dialog.js · real form enhancement",
    async () => {
      const { content } = windowFrame("Create Actor", ["dialog"], 610, "auto");
      const form = document.createElement("form");
      form.innerHTML = `<div class="form-group"><label>Name</label><input name="name" value="New Actor"></div><div class="form-group"><label>Type</label><select name="type">${schema.Actor.types.map((key) => `<option value="${key}">${key}</option>`).join("")}</select></div><footer class="dialog-buttons"><button type="button" disabled>Create Actor</button></footer>`;
      content.append(form);
      form.querySelector('[name="type"]').value = type;
      sr2EnhanceActorCreateDialog(null, $(form));
      if (["vehicle", "cyberdeck"].includes(type)) {
        const selector =
          type === "vehicle" ? ".sr2-vehicle-template-select" : ".sr2-cyberdeck-template-select";
        await waitFor(
          () =>
            Array.from(form.querySelectorAll(`${selector} option`)).some((option) => option.value),
          "Catalog did not load",
        );
        const options = Array.from(form.querySelectorAll(`${selector} option`));
        const option =
          options.find((entry) => entry.textContent.includes("Crawler")) ??
          options.find((entry) => entry.value);
        $(form).find(selector).val(option.value).trigger("change");
        await waitFor(
          () => form.querySelector('input[name="system.cost"]'),
          "Template fields did not populate",
        );
      }
    },
  );
}

async function show(id) {
  const entry = screens.find((screen) => screen.id === id) ?? screens[0];
  const generation = ++renderGeneration;
  preview.lastDialog?.close();
  preview.lastDialog = null;
  currentScreen = entry;
  document.querySelector("#preview-title").textContent = entry.label;
  document.querySelector("#preview-source").textContent = entry.source.replace(
    "systems/shadowrun2e/",
    "",
  );
  document
    .querySelectorAll(".preview-link")
    .forEach((link) =>
      link.setAttribute("aria-current", link.dataset.id === entry.id ? "page" : "false"),
    );
  try {
    status.textContent = "";
    await entry.render();
    if (generation === renderGeneration) stage.dataset.screen = entry.id;
  } catch (error) {
    reportError(error);
    throw error;
  }
}
for (const group of new Set(screens.map((entry) => entry.group))) {
  const section = document.createElement("details");
  section.className = "preview-group";
  section.open = true;
  const title = document.createElement("summary");
  title.textContent = group;
  section.append(title);
  for (const entry of screens.filter((entry) => entry.group === group)) {
    const button = document.createElement("button");
    button.className = "preview-link";
    button.dataset.id = entry.id;
    button.textContent = entry.label;
    button.addEventListener("click", () => {
      location.hash = entry.id;
    });
    section.append(button);
  }
  document.querySelector("#preview-nav").append(section);
}
document.querySelector("#preview-search").addEventListener("input", (event) => {
  const term = event.target.value.toLowerCase();
  document.querySelectorAll(".preview-link").forEach((button) => {
    button.hidden = !button.textContent.toLowerCase().includes(term);
  });
  document.querySelectorAll(".preview-group").forEach((group) => {
    group.hidden = !group.querySelector(".preview-link:not([hidden])");
  });
});

async function checkAll() {
  const original = currentScreen.id;
  const results = [];
  const start = performance.now();
  for (const entry of screens) {
    try {
      await show(entry.id);
      const availableTabs = new Set(
        Array.from(stage.querySelectorAll(".sheet-tabs [data-tab]")).map(
          (link) => link.dataset.tab,
        ),
      );
      const tabs = Array.from(stage.querySelectorAll(".sheet-body > .tab")).filter((tab) =>
        availableTabs.has(tab.dataset.tab),
      );
      for (const tab of tabs) {
        activateTab(stage, tab.dataset.tab);
        await new Promise(requestAnimationFrame);
        if (tab.getBoundingClientRect().height === 0)
          throw new Error(`Tab did not become visible: ${tab.dataset.tab}`);
      }
      await Promise.all(
        Array.from(stage.querySelectorAll("img")).map((image) => image.decode().catch(() => {})),
      );
      const brokenImages = Array.from(stage.querySelectorAll("img"))
        .filter((image) => !image.naturalWidth)
        .map((image) => image.getAttribute("src"));
      results.push({
        id: entry.id,
        tabs: tabs.length,
        brokenImages,
        ok: brokenImages.length === 0 && stage.textContent.trim().length > 30,
      });
    } catch (error) {
      results.push({ id: entry.id, ok: false, error: error.message });
    }
  }
  await show(original);
  const report = {
    screens: results.length,
    passed: results.filter((result) => result.ok).length,
    tabPanels: results.reduce((sum, result) => sum + (result.tabs ?? 0), 0),
    milliseconds: Math.round(performance.now() - start),
    results,
  };
  status.textContent = `${report.passed}/${report.screens} screen variants rendered · ${report.tabPanels} tab panels · ${(report.milliseconds / 1000).toFixed(1)}s. ${report.passed === report.screens ? "No broken images found." : "Some previews need attention."}`;
  window.sr2Preview.report = report;
  return report;
}
document.querySelector("#preview-audit").addEventListener("click", async (event) => {
  event.target.disabled = true;
  try {
    await checkAll();
  } finally {
    event.target.disabled = false;
  }
});
window.addEventListener("hashchange", () => void show(location.hash.slice(1)).catch(() => {}));
window.sr2Preview = {
  screens: screens.map(({ id, label, source }) => ({ id, label, source })),
  show,
  checkAll,
  get activeApp() {
    return activeApp;
  },
};
await show(location.hash.slice(1));
document.body.dataset.ready = "true";
