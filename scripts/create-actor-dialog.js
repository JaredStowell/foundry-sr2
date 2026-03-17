import {
  SR2_CONTACT_ARCHETYPES,
  SR2_FOLLOWER_ARCHETYPES,
  SR2_METATYPE_VALUES,
  sr2AreContactLevelsEnabled,
  sr2GetAllowedMetatypesForPriority,
} from "./actor-creation.js";

export function sr2GetActorTypeLabel(type) {
  const labels = {
    character: "Character",
    contact: "Contact",
    follower: "Follower",
    cyberdeck: "Cyberdeck",
    vehicle: "Vehicle",
    spirit: "Spirit",
    critter: "Critter",
    ic: "IC",
  };
  return labels[type] || (type ? type.charAt(0).toUpperCase() + type.slice(1) : "");
}

export function sr2ParseDelimitedPair(rawValue, fallbackRightToLeft = false) {
  if (rawValue === undefined || rawValue === null) return [0, 0];
  const parts = rawValue.toString().split("/");
  const left = parseInt(parts[0]) || 0;
  let right = parseInt(parts[1]) || 0;
  if (fallbackRightToLeft && parts.length === 1) right = left;
  return [left, right];
}

export function sr2InferVehicleType(vehicle) {
  const name = (vehicle?.name || "").toString();
  const notes = (vehicle?.Notes || "").toString();
  const speedAccel = (vehicle?.["Speed/Accel"] || "").toString();

  const haystack = `${name} ${notes}`.toLowerCase();

  const airKeywords = [
    "aircraft",
    "helicopter",
    "plane",
    "vtol",
    "rotor",
    "aerospace",
    "jet",
    "tiltrotor",
  ];
  const waterKeywords = ["boat", "ship", "marine", "hydrofoil", "submarine", "submersible"];

  if (airKeywords.some((key) => haystack.includes(key))) return "air";
  if (waterKeywords.some((key) => haystack.includes(key))) return "water";
  if (speedAccel.includes("(") && speedAccel.includes(")")) return "air";

  return "ground";
}

export function sr2EnhanceActorCreateDialog(app, html) {
  // In some Foundry versions/hooks, "html" may not be a jQuery object.
  const jq = globalThis.jQuery;
  const $html = jq && html instanceof jq ? html : $(html);

  const form = $html.is("form") ? $html : $html.find("form");
  if (!form.length) return;

  const typeSelect = form.find('select[name="type"]');
  if (!typeSelect.length) return;

  // Only target the "Create Actor" dialog for this system.
  const optionValues = typeSelect
    .find("option")
    .map((_, el) => el.value)
    .get();
  const isSR2ActorCreateDialog =
    optionValues.includes("character") &&
    optionValues.includes("cyberdeck") &&
    optionValues.includes("vehicle") &&
    optionValues.includes("spirit");
  if (!isSR2ActorCreateDialog) return;

  typeSelect.find("option").each((_, el) => {
    if (!el.value) return;
    el.textContent = sr2GetActorTypeLabel(el.value);
  });

  // Avoid injecting multiple times on re-renders
  if (form.find(".sr2-create-extras").length) return;

  const priorityLetters = [
    { value: "", label: "" },
    { value: "A", label: "A" },
    { value: "B", label: "B" },
    { value: "C", label: "C" },
    { value: "D", label: "D" },
    { value: "E", label: "E" },
  ];

  const priorityOptionsHtml = priorityLetters
    .map((o) => `<option value="${o.value}">${o.label}</option>`)
    .join("");

  const metatypeOptionsHtml = SR2_METATYPE_VALUES.map(
    (m) => `<option value="${m}">${m.charAt(0).toUpperCase() + m.slice(1)}</option>`,
  ).join("");

  const escapeHtml = (value) => {
    if (globalThis.foundry?.utils?.escapeHTML) return foundry.utils.escapeHTML(String(value));
    return String(value).replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#039;",
        })[c],
    );
  };

  const followerArchetypeOptionsHtml = [
    `<option value=""></option>`,
    ...Object.entries(SR2_FOLLOWER_ARCHETYPES).map(
      ([key, data]) => `<option value="${key}">${data.label}</option>`,
    ),
  ].join("");

  const contactArchetypeOptionsHtml = [
    `<option value=""></option>`,
    ...Object.entries(SR2_CONTACT_ARCHETYPES).map(
      ([key, data]) => `<option value="${key}">${data.label}</option>`,
    ),
  ].join("");

  const contactLevelsEnabled = sr2AreContactLevelsEnabled();

  const followerFromContactsOptionsHtml = (() => {
    if (!contactLevelsEnabled) return followerArchetypeOptionsHtml;

    const gangTribeKeys = ["gangMember", "tribesman"];
    const gangTribeOptions = gangTribeKeys
      .filter((k) => SR2_FOLLOWER_ARCHETYPES[k])
      .map((k) => `<option value="${k}">${SR2_FOLLOWER_ARCHETYPES[k].label}</option>`);

    const contactOptions = Object.entries(SR2_CONTACT_ARCHETYPES).map(
      ([key, data]) => `<option value="${key}">${data.label}</option>`,
    );

    return [
      `<option value=""></option>`,
      ...(gangTribeOptions.length
        ? [`<option value="" disabled>— Gang/Tribe —</option>`, ...gangTribeOptions]
        : []),
      `<option value="" disabled>— Contacts —</option>`,
      ...contactOptions,
    ].join("");
  })();

  const currentUser = globalThis.game?.user;
  const ownershipLevels = globalThis.CONST?.DOCUMENT_OWNERSHIP_LEVELS;
  const visibleLevel = ownershipLevels?.LIMITED ?? ownershipLevels?.OBSERVER ?? 1;

  const leaderActors = (
    globalThis.game?.actors?.filter((a) => a.type === "character") ?? []
  ).filter((a) => {
    if (!currentUser) return true;
    if (currentUser.isGM) return true;
    if (typeof a?.testUserPermission === "function") {
      return a.testUserPermission(currentUser, visibleLevel);
    }
    const ownership = a?.ownership;
    const level = ownership?.[currentUser.id] ?? ownership?.default;
    return (Number(level) || 0) >= visibleLevel;
  });
  const leaderOptionsHtml = [
    `<option value=""></option>`,
    ...leaderActors.map((a) => `<option value="${a.id}">${escapeHtml(a.name)}</option>`),
  ].join("");

  const spiritTypeOptionsHtml = `
      <option value=""></option>
      <option value="elemental">Elemental</option>
      <option value="nature">Nature Spirit</option>
      <option value="city">City Spirit</option>
      <option value="hearth">Hearth Spirit</option>
      <option value="ancestor">Ancestor Spirit</option>
      <option value="task">Task Spirit</option>
      <option value="guidance">Guidance Spirit</option>
      <option value="plant">Plant Spirit</option>
      <option value="beast">Beast Spirit</option>
      <option value="water">Water Elemental</option>
      <option value="air">Air Elemental</option>
      <option value="earth">Earth Elemental</option>
      <option value="fire">Fire Elemental</option>
      <option value="man">Man Spirit</option>
      <option value="toxic">Toxic Spirit</option>
    `;

  const extrasHtml = `
      <div class="sr2-create-extras">
        <hr/>
        <div class="sr2-create-priorities">
          <h3>Priorities (ABCDE)</h3>
          <div class="form-group">
            <label>Metatype</label>
            <div class="form-fields">
              <div class="sr2-metatype-fields">
                <select name="system.priorities.metatype" class="sr2-priority-select" data-sr2-priority="metatype">${priorityOptionsHtml}</select>
                <select name="system.details.metatype" class="sr2-metatype-select">${metatypeOptionsHtml}</select>
              </div>
            </div>
          </div>
          <div class="form-group">
            <label>Attributes</label>
            <div class="form-fields">
              <select name="system.priorities.attributes" class="sr2-priority-select" data-sr2-priority="attributes">${priorityOptionsHtml}</select>
            </div>
          </div>
          <div class="form-group">
            <label>Skills</label>
            <div class="form-fields">
              <select name="system.priorities.skills" class="sr2-priority-select" data-sr2-priority="skills">${priorityOptionsHtml}</select>
            </div>
          </div>
          <div class="form-group">
            <label>Resources</label>
            <div class="form-fields">
              <select name="system.priorities.resources" class="sr2-priority-select" data-sr2-priority="resources">${priorityOptionsHtml}</select>
            </div>
          </div>
          <div class="form-group">
            <label>Magic</label>
            <div class="form-fields">
              <select name="system.priorities.magic" class="sr2-priority-select" data-sr2-priority="magic">${priorityOptionsHtml}</select>
            </div>
          </div>
        </div>
        <div class="sr2-create-archetype">
          <h3 class="sr2-archetype-title">Archetype</h3>
          <div class="form-group">
            <label class="sr2-archetype-label">Archetype</label>
            <div class="form-fields">
              <select name="system.details.archetype" class="sr2-archetype-select">${followerArchetypeOptionsHtml}</select>
            </div>
          </div>
          <div class="form-group">
            <label>Leader</label>
            <div class="form-fields">
              <select name="system.details.leaderId" class="sr2-leader-select">${leaderOptionsHtml}</select>
            </div>
          </div>
        </div>
        <div class="sr2-create-vehicle-details">
          <h3>Vehicle</h3>
          <div class="form-group">
            <label>Vehicle</label>
            <div class="form-fields">
              <select class="sr2-vehicle-template-select">
                <option value=""></option>
                <option value="" disabled>Loading vehicles…</option>
              </select>
            </div>
          </div>
          <input type="hidden" class="sr2-vehicle-template-field" name="system.model" data-dtype="String" disabled />
          <input type="hidden" class="sr2-vehicle-template-field" name="system.vehicleType" data-dtype="String" disabled />
          <input type="hidden" class="sr2-vehicle-template-field" name="system.handling.on" data-dtype="Number" disabled />
          <input type="hidden" class="sr2-vehicle-template-field" name="system.handling.off" data-dtype="Number" disabled />
          <input type="hidden" class="sr2-vehicle-template-field" name="system.speed" data-dtype="Number" disabled />
          <input type="hidden" class="sr2-vehicle-template-field" name="system.accel" data-dtype="Number" disabled />
          <input type="hidden" class="sr2-vehicle-template-field" name="system.body" data-dtype="Number" disabled />
          <input type="hidden" class="sr2-vehicle-template-field" name="system.armor" data-dtype="Number" disabled />
          <input type="hidden" class="sr2-vehicle-template-field" name="system.sig" data-dtype="Number" disabled />
          <input type="hidden" class="sr2-vehicle-template-field" name="system.autonav" data-dtype="Number" disabled />
          <input type="hidden" class="sr2-vehicle-template-field" name="system.pilot" data-dtype="Number" disabled />
          <input type="hidden" class="sr2-vehicle-template-field" name="system.sensor" data-dtype="Number" disabled />
          <input type="hidden" class="sr2-vehicle-template-field" name="system.cargo" data-dtype="Number" disabled />
          <input type="hidden" class="sr2-vehicle-template-field" name="system.load" data-dtype="Number" disabled />
          <input type="hidden" class="sr2-vehicle-template-field" name="system.seating" data-dtype="String" disabled />
          <input type="hidden" class="sr2-vehicle-template-field" name="system.cost" data-dtype="Number" disabled />
          <input type="hidden" class="sr2-vehicle-template-field" name="system.availability" data-dtype="String" disabled />
          <input type="hidden" class="sr2-vehicle-template-field" name="system.streetIndex" data-dtype="Number" disabled />
          <input type="hidden" class="sr2-vehicle-template-field" name="system.notes" data-dtype="String" disabled />
          <input type="hidden" class="sr2-vehicle-template-field" name="system.bookPage" data-dtype="String" disabled />
        </div>
        <div class="sr2-create-cyberdeck-details">
          <h3>Cyberdeck</h3>
          <div class="form-group">
            <label>Cyberdeck</label>
            <div class="form-fields">
              <select name="system.model" class="sr2-cyberdeck-template-select">
                <option value=""></option>
                <option value="" disabled>Loading cyberdecks…</option>
              </select>
            </div>
          </div>
          <input type="hidden" class="sr2-cyberdeck-template-field" name="system.persona" data-dtype="Number" disabled />
          <input type="hidden" class="sr2-cyberdeck-template-field" name="system.hardening" data-dtype="Number" disabled />
          <input type="hidden" class="sr2-cyberdeck-template-field" name="system.memory.total" data-dtype="Number" disabled />
          <input type="hidden" class="sr2-cyberdeck-template-field" name="system.memory.used" data-dtype="Number" disabled />
          <input type="hidden" class="sr2-cyberdeck-template-field" name="system.storage.total" data-dtype="Number" disabled />
          <input type="hidden" class="sr2-cyberdeck-template-field" name="system.storage.used" data-dtype="Number" disabled />
          <input type="hidden" class="sr2-cyberdeck-template-field" name="system.load" data-dtype="Number" disabled />
          <input type="hidden" class="sr2-cyberdeck-template-field" name="system.ioSpeed" data-dtype="Number" disabled />
          <input type="hidden" class="sr2-cyberdeck-template-field" name="system.responseIncrease" data-dtype="Number" disabled />
          <input type="hidden" class="sr2-cyberdeck-template-field" name="system.cost" data-dtype="Number" disabled />
          <input type="hidden" class="sr2-cyberdeck-template-field" name="system.streetIndex" data-dtype="Number" disabled />
          <input type="hidden" class="sr2-cyberdeck-template-field" name="system.availability" data-dtype="String" disabled />
          <input type="hidden" class="sr2-cyberdeck-template-field" name="system.bookPage" data-dtype="String" disabled />
        </div>
        <div class="sr2-create-spirit-details">
          <h3 class="sr2-spirit-details-title">Spirit</h3>
          <div class="form-group">
            <label class="sr2-spirit-type-label">Spirit Type</label>
            <div class="form-fields">
              <select name="system.spiritType" class="sr2-spirit-type-select">${spiritTypeOptionsHtml}</select>
            </div>
          </div>
        </div>
      </div>
    `;

  const typeFormGroup = typeSelect.closest(".form-group");
  if (typeFormGroup.length) {
    typeFormGroup.after(extrasHtml);
  } else {
    typeSelect.after(extrasHtml);
  }

  const extras = form.find(".sr2-create-extras");
  const prioritiesSection = extras.find(".sr2-create-priorities");
  const archetypeSection = extras.find(".sr2-create-archetype");
  const vehicleSection = extras.find(".sr2-create-vehicle-details");
  const cyberdeckSection = extras.find(".sr2-create-cyberdeck-details");
  const spiritSection = extras.find(".sr2-create-spirit-details");
  const nameInput = form.find('input[name="name"]');
  const vehicleTemplateSelect = vehicleSection.find("select.sr2-vehicle-template-select");
  const cyberdeckTemplateSelect = cyberdeckSection.find("select.sr2-cyberdeck-template-select");

  const metatypePrioritySelect = prioritiesSection.find(
    'select.sr2-priority-select[data-sr2-priority="metatype"]',
  );
  const metatypeSelect = prioritiesSection.find("select.sr2-metatype-select");

  function applyMetatypeRestrictions() {
    if (!metatypePrioritySelect.length || !metatypeSelect.length) return;

    const priority = metatypePrioritySelect.val();
    const allowed = sr2GetAllowedMetatypesForPriority(priority);

    const options = Array.from(metatypeSelect[0].options);
    for (const opt of options) {
      if (!allowed) {
        opt.disabled = false;
        continue;
      }
      opt.disabled = !allowed.includes(opt.value);
    }

    const shouldDisableMetatypeSelect = Array.isArray(allowed) && allowed.length <= 1;
    metatypeSelect.prop("disabled", shouldDisableMetatypeSelect);

    if (allowed) {
      const current = metatypeSelect.val();
      if (!allowed.includes(current)) {
        metatypeSelect.val(allowed[0] ?? "human");
      }
    }
  }

  function syncPrioritySelects() {
    const selects = prioritiesSection.find("select.sr2-priority-select");
    const selectedValues = selects
      .map((_, el) => el.value)
      .get()
      .filter(Boolean);

    selects.each((_, el) => {
      const currentValue = el.value;
      const options = Array.from(el.options);
      for (const opt of options) {
        if (!opt.value) {
          opt.disabled = false;
          continue;
        }
        opt.disabled = opt.value !== currentValue && selectedValues.includes(opt.value);
      }
    });
  }

  const leaderNameById = leaderActors.reduce((acc, a) => {
    acc[a.id] = a.name;
    return acc;
  }, {});

  const nameByTypeKey = "sr2NameByType";
  const currentTypeKey = "sr2CurrentActorType";

  if (nameInput.length && !nameInput.data(nameByTypeKey)) {
    nameInput.data(nameByTypeKey, {});
  }
  if (typeSelect.data(currentTypeKey) === undefined) {
    typeSelect.data(currentTypeKey, typeSelect.val());
  }

  function rememberNameForType(type) {
    if (!nameInput.length) return;
    if (!type) return;

    const map = nameInput.data(nameByTypeKey) || {};
    map[type] = nameInput.val();
    nameInput.data(nameByTypeKey, map);
  }

  function applyNameForType(type) {
    if (!nameInput.length) return;

    const map = nameInput.data(nameByTypeKey) || {};

    if (type === "follower") {
      const archetypeKey = archetypeSection.find("select.sr2-archetype-select").val();
      const leaderId = archetypeSection.find("select.sr2-leader-select").val();

      const archetypeLabel = archetypeKey
        ? contactLevelsEnabled && SR2_CONTACT_ARCHETYPES[archetypeKey]?.label
          ? SR2_CONTACT_ARCHETYPES[archetypeKey].label
          : SR2_FOLLOWER_ARCHETYPES[archetypeKey]?.label || "Follower"
        : "Follower";
      const leaderName = leaderId ? leaderNameById[leaderId] || "" : "";

      let name = archetypeLabel === "Follower" ? "Follower" : `${archetypeLabel} Follower`;
      if (leaderName) name = `${name} - ${leaderName}`;

      nameInput.val(name);
      nameInput.prop("readonly", true);
      return;
    }

    if (type === "contact") {
      const contactKey = archetypeSection.find("select.sr2-archetype-select").val();
      const leaderId = archetypeSection.find("select.sr2-leader-select").val();

      const contactLabel = contactKey
        ? SR2_CONTACT_ARCHETYPES[contactKey]?.label || "Contact"
        : "Contact";
      const leaderName = leaderId ? leaderNameById[leaderId] || "" : "";

      let name = `${contactLabel}`;
      if (leaderName) name = `${name} - ${leaderName}`;

      nameInput.val(name);
      nameInput.prop("readonly", true);
      return;
    }

    const autoDefaults = {
      vehicle: "Vehicle",
      cyberdeck: "Cyberdeck",
      spirit: "Spirit",
      critter: "Critter",
      ic: "IC",
    };

    const autoDefault = autoDefaults[type];

    if (autoDefault) {
      nameInput.val(autoDefault);
      nameInput.prop("readonly", true);
      return;
    }

    const saved = map[type];
    nameInput.prop("readonly", false);
    if (saved !== undefined) {
      nameInput.val(saved);
    }
  }

  function applyArchetypeOptions(type) {
    const select = archetypeSection.find("select.sr2-archetype-select");
    if (!select.length) return;

    const current = select.val();
    let options = `<option value=""></option>`;

    if (type === "follower") {
      options = followerFromContactsOptionsHtml;
    } else if (type === "contact") {
      options = contactArchetypeOptionsHtml;
    }

    const last = select.data("__sr2eArchetypeOptionsType");
    if (last === type) return;

    select.html(options);

    if (current && select.find(`option[value="${current}"]`).length) {
      select.val(current);
    } else {
      select.val("");
    }

    select.data("__sr2eArchetypeOptionsType", type);
  }

  function sr2GetCreateActorCatalogCache() {
    const key = "__sr2eCreateActorCatalogCache";
    if (!globalThis[key]) {
      globalThis[key] = {
        vehicleCatalog: null,
        vehicleCatalogPromise: null,
        cyberdeckCatalog: null,
        cyberdeckCatalogPromise: null,
      };
    }
    return globalThis[key];
  }

  function sr2GetSystemId() {
    return globalThis.game?.system?.id || "shadowrun2e";
  }

  async function sr2LoadVehicleCatalog() {
    const cache = sr2GetCreateActorCatalogCache();
    if (cache.vehicleCatalog) return cache.vehicleCatalog;
    if (cache.vehicleCatalogPromise) return cache.vehicleCatalogPromise;

    cache.vehicleCatalogPromise = (async () => {
      const systemId = sr2GetSystemId();
      const [vehicles, drones] = await Promise.all([
        fetch(`/systems/${systemId}/data/vehicles.json`).then((r) => r.json()),
        fetch(`/systems/${systemId}/data/drones.json`).then((r) => r.json()),
      ]);

      const map = {};

      const vehicleOptions = (vehicles || [])
        .map((v) => ({
          key: `vehicles:${(v?.name || "").toString().trim()}`,
          label: (v?.name || "").toString().trim(),
          data: v,
        }))
        .filter((v) => v.label);
      const droneOptions = (drones || [])
        .map((v) => ({
          key: `drones:${(v?.name || "").toString().trim()}`,
          label: (v?.name || "").toString().trim(),
          data: v,
        }))
        .filter((v) => v.label);

      vehicleOptions.sort((a, b) => a.label.localeCompare(b.label));
      droneOptions.sort((a, b) => a.label.localeCompare(b.label));

      for (const o of vehicleOptions) map[o.key] = { source: "vehicles", data: o.data };
      for (const o of droneOptions) map[o.key] = { source: "drones", data: o.data };

      const optionGroups = [];
      if (vehicleOptions.length) {
        optionGroups.push(
          `<optgroup label="Vehicles">${vehicleOptions.map((o) => `<option value="${escapeHtml(o.key)}">${escapeHtml(o.label)}</option>`).join("")}</optgroup>`,
        );
      }
      if (droneOptions.length) {
        optionGroups.push(
          `<optgroup label="Drones">${droneOptions.map((o) => `<option value="${escapeHtml(o.key)}">${escapeHtml(o.label)}</option>`).join("")}</optgroup>`,
        );
      }

      cache.vehicleCatalog = {
        map,
        optionsHtml: `<option value=""></option>${optionGroups.join("")}`,
      };

      return cache.vehicleCatalog;
    })();

    try {
      return await cache.vehicleCatalogPromise;
    } catch (err) {
      cache.vehicleCatalogPromise = null;
      throw err;
    }
  }

  async function sr2LoadCyberdeckCatalog() {
    const cache = sr2GetCreateActorCatalogCache();
    if (cache.cyberdeckCatalog) return cache.cyberdeckCatalog;
    if (cache.cyberdeckCatalogPromise) return cache.cyberdeckCatalogPromise;

    cache.cyberdeckCatalogPromise = (async () => {
      const systemId = sr2GetSystemId();
      const decks = await fetch(`/systems/${systemId}/data/cyberdeck.json`).then((r) => r.json());

      const map = {};
      const options = (decks || [])
        .map((d) => {
          const label = (d?.Name || "").toString().trim();
          return { key: label, label, data: d };
        })
        .filter((d) => d.label);

      options.sort((a, b) => a.label.localeCompare(b.label));
      for (const o of options) map[o.key] = o.data;

      cache.cyberdeckCatalog = {
        map,
        optionsHtml: `<option value=""></option>${options.map((o) => `<option value="${escapeHtml(o.key)}">${escapeHtml(o.label)}</option>`).join("")}`,
      };

      return cache.cyberdeckCatalog;
    })();

    try {
      return await cache.cyberdeckCatalogPromise;
    } catch (err) {
      cache.cyberdeckCatalogPromise = null;
      throw err;
    }
  }

  function applyVehicleTemplateFromSelection() {
    const templateKey = vehicleTemplateSelect.val();
    const templateFields = vehicleSection.find("input.sr2-vehicle-template-field");

    if (!templateKey) {
      templateFields.prop("disabled", true);
      return;
    }

    sr2LoadVehicleCatalog()
      .then(({ map }) => {
        // Avoid enabling hidden inputs if the user changed type/selection while loading.
        if (typeSelect.val() !== "vehicle" || vehicleTemplateSelect.val() !== templateKey) {
          templateFields.prop("disabled", true);
          return;
        }

        const entry = map[templateKey];
        if (!entry) {
          templateFields.prop("disabled", true);
          return;
        }

        const vehicle = entry.data || {};

        let handlingOn = 0,
          handlingOff = 0;
        if (vehicle.Handling) {
          const [on, off] = sr2ParseDelimitedPair(vehicle.Handling, true);
          handlingOn = on;
          handlingOff = off;
        }

        let speed = 0,
          accel = 0;
        if (vehicle["Speed/Accel"]) {
          const [s, a] = sr2ParseDelimitedPair(vehicle["Speed/Accel"]);
          speed = s;
          accel = a;
        }

        let body = 0,
          armor = 0;
        if (vehicle["Body/Armor"]) {
          const [b, a] = sr2ParseDelimitedPair(vehicle["Body/Armor"]);
          body = b;
          armor = a;
        }

        let sig = 0,
          autonav = 0;
        if (vehicle["Sig/Autonav"]) {
          const parts = vehicle["Sig/Autonav"].toString().split("/");
          sig = parseInt(parts[0]) || 0;
          autonav = parts[1] === "-" ? 0 : parseInt(parts[1]) || 0;
        }

        let pilot = 0,
          sensor = 0;
        if (vehicle["Pilot/Sensor"]) {
          const parts = vehicle["Pilot/Sensor"].toString().split("/");
          pilot = parts[0] === "-" ? 0 : parseInt(parts[0]) || 0;
          sensor = parseInt(parts[1]) || 0;
        }

        let cargo = 0,
          load = 0;
        if (vehicle["Cargo/Load"]) {
          const [c, l] = sr2ParseDelimitedPair(vehicle["Cargo/Load"]);
          cargo = c;
          load = l;
        }

        const isDrone = entry.source === "drones";
        const vehicleType = isDrone ? "drone" : sr2InferVehicleType(vehicle);

        const modelName = (vehicle.name || "").toString().trim();
        const cost = parseInt(vehicle["$Cost"]?.toString().replace(/[^\d]/g, "")) || 0;
        const streetIndex = parseFloat(vehicle["Street Index"]) || 1.0;

        vehicleSection.find('input[name="system.model"]').val(modelName);
        vehicleSection.find('input[name="system.vehicleType"]').val(vehicleType);
        vehicleSection.find('input[name="system.handling.on"]').val(handlingOn);
        vehicleSection.find('input[name="system.handling.off"]').val(handlingOff);
        vehicleSection.find('input[name="system.speed"]').val(speed);
        vehicleSection.find('input[name="system.accel"]').val(accel);
        vehicleSection.find('input[name="system.body"]').val(body);
        vehicleSection.find('input[name="system.armor"]').val(armor);
        vehicleSection.find('input[name="system.sig"]').val(sig);
        vehicleSection.find('input[name="system.autonav"]').val(autonav);
        vehicleSection.find('input[name="system.pilot"]').val(pilot);
        vehicleSection.find('input[name="system.sensor"]').val(sensor);
        vehicleSection.find('input[name="system.cargo"]').val(cargo);
        vehicleSection.find('input[name="system.load"]').val(load);
        vehicleSection.find('input[name="system.seating"]').val((vehicle.Seating || "").toString());
        vehicleSection.find('input[name="system.cost"]').val(cost);
        vehicleSection
          .find('input[name="system.availability"]')
          .val((vehicle.Availability || "").toString());
        vehicleSection.find('input[name="system.streetIndex"]').val(streetIndex);
        vehicleSection.find('input[name="system.notes"]').val((vehicle.Notes || "").toString());
        vehicleSection
          .find('input[name="system.bookPage"]')
          .val((vehicle["Book.Page"] || "").toString());

        if (typeSelect.val() !== "vehicle" || vehicleTemplateSelect.val() !== templateKey) {
          templateFields.prop("disabled", true);
          return;
        }

        templateFields.prop("disabled", false);
      })
      .catch(() => {
        templateFields.prop("disabled", true);
      });
  }

  function applyCyberdeckTemplateFromSelection() {
    const model = cyberdeckTemplateSelect.val();
    const templateFields = cyberdeckSection.find("input.sr2-cyberdeck-template-field");

    if (!model) {
      templateFields.prop("disabled", true);
      return;
    }

    sr2LoadCyberdeckCatalog()
      .then(({ map }) => {
        // Avoid enabling hidden inputs if the user changed type/selection while loading.
        if (typeSelect.val() !== "cyberdeck" || cyberdeckTemplateSelect.val() !== model) {
          templateFields.prop("disabled", true);
          return;
        }

        const deck = map[model];
        if (!deck) {
          templateFields.prop("disabled", true);
          return;
        }

        cyberdeckSection.find('input[name="system.persona"]').val(deck.Persona ?? 1);
        cyberdeckSection.find('input[name="system.hardening"]').val(deck.Hardening ?? 0);
        cyberdeckSection.find('input[name="system.memory.total"]').val(deck.Memory ?? 100);
        cyberdeckSection.find('input[name="system.memory.used"]').val(0);
        cyberdeckSection.find('input[name="system.storage.total"]').val(deck.Storage ?? 500);
        cyberdeckSection.find('input[name="system.storage.used"]').val(0);
        cyberdeckSection.find('input[name="system.load"]').val(deck.Load ?? 5);
        cyberdeckSection.find('input[name="system.ioSpeed"]').val(deck["I/O Speed"] ?? 1);
        cyberdeckSection
          .find('input[name="system.responseIncrease"]')
          .val(deck["Response Increase"] ?? 0);
        cyberdeckSection.find('input[name="system.cost"]').val(deck.Cost ?? 0);
        cyberdeckSection
          .find('input[name="system.streetIndex"]')
          .val(parseFloat(deck["Street Index"]) || 1.0);
        cyberdeckSection
          .find('input[name="system.availability"]')
          .val((deck.Availability || "").toString());
        cyberdeckSection
          .find('input[name="system.bookPage"]')
          .val((deck.BookPage || "").toString());

        if (typeSelect.val() !== "cyberdeck" || cyberdeckTemplateSelect.val() !== model) {
          templateFields.prop("disabled", true);
          return;
        }

        templateFields.prop("disabled", false);
      })
      .catch(() => {
        templateFields.prop("disabled", true);
      });
  }

  function applyVisibility() {
    const type = typeSelect.val();
    const showPriorities = type === "character";
    const showArchetype = type === "follower" || type === "contact";
    const showVehicle = type === "vehicle";
    const showCyberdeck = type === "cyberdeck";
    const showSpirit = type === "spirit" || type === "critter";
    const spiritLabel = type === "critter" ? "Critter" : "Spirit";

    prioritiesSection.toggle(showPriorities);
    prioritiesSection.find("select").prop("disabled", !showPriorities);

    const archetypeLabel =
      type === "contact" || (type === "follower" && contactLevelsEnabled) ? "Contact" : "Archetype";
    archetypeSection.find(".sr2-archetype-title").text(archetypeLabel);
    archetypeSection.find("label.sr2-archetype-label").text(archetypeLabel);

    applyArchetypeOptions(type);
    archetypeSection.toggle(showArchetype);
    archetypeSection.find("select").prop("disabled", !showArchetype);

    vehicleSection.toggle(showVehicle);
    vehicleSection.find("select, input").prop("disabled", true);
    vehicleTemplateSelect.prop("disabled", !showVehicle);

    cyberdeckSection.toggle(showCyberdeck);
    cyberdeckSection.find("select, input").prop("disabled", true);
    cyberdeckTemplateSelect.prop("disabled", !showCyberdeck);

    spiritSection.find(".sr2-spirit-details-title").text(spiritLabel);
    spiritSection.find(".sr2-spirit-type-label").text(`${spiritLabel} Type`);
    spiritSection.toggle(showSpirit);
    spiritSection.find("select").prop("disabled", !showSpirit);

    if (showPriorities) syncPrioritySelects();
    if (showPriorities) applyMetatypeRestrictions();

    if (showVehicle) applyVehicleTemplateFromSelection();
    if (showCyberdeck) applyCyberdeckTemplateFromSelection();

    applyNameForType(type);
  }

  prioritiesSection.find("select.sr2-priority-select").on("change", syncPrioritySelects);
  metatypePrioritySelect.on("change", applyMetatypeRestrictions);
  vehicleTemplateSelect.on("change", applyVehicleTemplateFromSelection);
  cyberdeckTemplateSelect.on("change", applyCyberdeckTemplateFromSelection);

  typeSelect.on("change", () => {
    const previousType = typeSelect.data(currentTypeKey);
    rememberNameForType(previousType);
    typeSelect.data(currentTypeKey, typeSelect.val());
    applyVisibility();
  });

  archetypeSection.find("select").on("change", () => {
    const type = typeSelect.val();
    if (type !== "follower" && type !== "contact") return;
    applyNameForType(type);
  });

  rememberNameForType(typeSelect.val());
  applyVisibility();

  sr2LoadVehicleCatalog()
    .then(({ optionsHtml }) => vehicleTemplateSelect.html(optionsHtml))
    .catch(() =>
      vehicleTemplateSelect.html(
        `<option value=""></option><option value="" disabled>Failed to load vehicles</option>`,
      ),
    );

  sr2LoadCyberdeckCatalog()
    .then(({ optionsHtml }) => cyberdeckTemplateSelect.html(optionsHtml))
    .catch(() =>
      cyberdeckTemplateSelect.html(
        `<option value=""></option><option value="" disabled>Failed to load cyberdecks</option>`,
      ),
    );

  // Visible confirmation for environments without devtools access
  const noticeKey = "__sr2eCreateActorDialogEnhancedNoticeShown";
  if (!globalThis[noticeKey] && globalThis.ui?.notifications?.info) {
    globalThis[noticeKey] = true;
  }

  // Let the dialog resize to fit the new content (when supported).
  let windowApp = app;
  if (!windowApp) {
    const windowElement = form.closest(".window-app");
    const appId = windowElement?.data?.("appid");
    if (appId && globalThis.ui?.windows?.[appId]) {
      windowApp = ui.windows[appId];
    }
  }

  if (typeof windowApp?.setPosition === "function") {
    try {
      windowApp.setPosition({ height: "auto" });
    } catch (err) {
      // Ignore.
    }
  }
}
