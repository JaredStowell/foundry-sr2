import { clone, mergeObject, Collection } from "./runtime.js";
import { SR2Actor } from "../../actor/actor.js";

const schema = await fetch("/template.json").then((response) => response.json());
const icon = (name) => `/systems/shadowrun2e/icons/${name}`;
function defaults(group, type) {
  const data = schema[group][type];
  let result = {};
  for (const name of data.templates ?? [])
    result = mergeObject(result, schema[group].templates[name]);
  result = mergeObject(result, data);
  delete result.templates;
  return result;
}
export function item(type, name, system = {}, id = crypto.randomUUID()) {
  const img =
    {
      spell: "spell.svg",
      skill: "skill.svg",
      cyberware: "cyberware.svg",
      bioware: "bioware.svg",
      adeptpower: "adeptpower.svg",
    }[type] ?? "skill.svg";
  return {
    _id: id,
    name,
    type,
    img: icon(img),
    flags: {},
    system: mergeObject(defaults("Item", type), {
      description: `<p>${name}: sample equipment for the standalone screen gallery.</p>`,
      quantity: 1,
      weight: 1,
      price: 500,
      ...system,
    }),
  };
}
const loadout = [
  item(
    "skill",
    "Firearms",
    { baseSkill: "Firearms", allocatedRating: 6, baseRating: 6 },
    "firearms",
  ),
  item(
    "skill",
    "Computer",
    { baseSkill: "Computer", allocatedRating: 4, baseRating: 4 },
    "computer",
  ),
  item("skill", "Sorcery", { baseSkill: "Sorcery", allocatedRating: 6, baseRating: 6 }, "sorcery"),
  item(
    "skill",
    "Conjuring",
    { baseSkill: "Conjuring", allocatedRating: 4, baseRating: 4 },
    "conjuring",
  ),
  item(
    "weapon",
    "Ares Predator",
    {
      weaponType: "ranged",
      damage: "9M",
      mode: "SA",
      equipped: true,
      ammo: { value: 15, max: 15 },
      linkedSkill: { skillId: "firearms", rollType: "base" },
    },
    "predator",
  ),
  item(
    "weapon",
    "Katana",
    { weaponType: "melee", damage: "(STR+3)M", reach: 1, equipped: true },
    "katana",
  ),
  item("armor", "Armor Jacket", { ballistic: 5, impact: 3, equipped: true }),
  item("gear", "Medkit", { category: "Medical", rating: 3 }),
  item(
    "cyberware",
    "Wired Reflexes 2",
    { installed: true, essence: 3, mods: "+4RCT,+2INI", reactionBonus: 0, initiativeDice: 0 },
    "wired",
  ),
  item("cyberware", "Cyberdeck Interface", { installed: true, essence: 0.2 }),
  item("bioware", "Enhanced Articulation", { installed: true, bioIndex: 0.6, mods: "+1QCK" }),
  item(
    "spell",
    "Manabolt",
    { force: 4, class: "C", type: "M", range: "LOS", damage: "M", drain: "[(F/2)+1]M" },
    "manabolt",
  ),
  item(
    "spell",
    "Heal",
    { force: 5, class: "H", range: "Touch", duration: "Permanent", drain: "(F/2)M" },
    "heal",
  ),
  item(
    "gear",
    "Specific Spell Focus 2",
    { equipped: true, focus: { spellId: "manabolt" } },
    "specific-focus",
  ),
  item(
    "gear",
    "Spell Category Focus 3",
    { equipped: true, focus: { spellClass: "C" } },
    "category-focus",
  ),
  item("adeptpower", "Improved Reflexes", {
    cost: 2,
    hasLevels: true,
    currentLevel: 1,
    maxLevel: 3,
    mods: "+2RCT,+1INI",
  }),
  item("program", "Attack", { rating: 4, multiplier: 2, isLoaded: true, type: "offensive" }),
  item("totem", "Bear", {
    environment: "Forest",
    advantages: "+2 dice for health spells",
    disadvantages: "Berserk when wounded",
    isSelected: true,
  }),
];

export function makeActor(type = "character", name = "Anna", changes = {}, items = loadout) {
  const system = defaults("Actor", type);
  if (system.attributes)
    for (const [key, value] of Object.entries(system.attributes)) value.value = 6;
  if (system.karma) system.karma = { earned: 10, spent: 3 };
  if (system.resources) system.resources.nuyen = 12000;
  if (system.details)
    Object.assign(system.details, {
      metatype: "human",
      concept: "Street samurai",
      age: "28",
      nativeLanguage: "English",
      leaderId: "anna",
    });
  if (system.magic)
    Object.assign(system.magic, { awakened: false, physicalAdept: false, tradition: "hermetic" });
  const actor = new SR2Actor({
    _id: name.toLowerCase().replaceAll(/\W+/g, "-"),
    name,
    type,
    img: icon(
      {
        vehicle: "vehicle.png",
        cyberdeck: "cyberdeck.png",
        spirit: "spirit.png",
        critter: "spirit.png",
        ic: "cyberdeck.png",
      }[type] ?? "skill.svg",
    ),
    flags: {},
    system: mergeObject(system, {
      biography: "A sample runner in Seattle. This gallery uses disposable local data.",
      ...changes,
    }),
    items: clone(items),
  });
  actor.prepareDerivedData();
  if (actor.system.pools)
    for (const [key, pool] of Object.entries(actor.system.pools))
      pool.current = Math.max(0, (pool.max ?? pool.total) - (key === "karma" ? 1 : 2));
  return actor;
}
export const anna = makeActor(
  "character",
  "Anna",
  {},
  loadout.filter((entry) => !["adeptpower", "bioware", "spell", "totem"].includes(entry.type)),
);
export const mage = makeActor(
  "character",
  "Raven",
  {
    magic: { awakened: true, physicalAdept: false, tradition: "shamanic" },
    details: { concept: "Street shaman" },
  },
  loadout.filter((entry) => !["cyberware", "bioware", "adeptpower"].includes(entry.type)),
);
export const adept = makeActor(
  "character",
  "Kestrel",
  { magic: { awakened: true, physicalAdept: true } },
  loadout.filter((entry) => !["cyberware", "bioware", "spell", "totem"].includes(entry.type)),
);
export const chargen = makeActor(
  "character",
  "New Runner",
  {
    priorities: { metatype: "E", attributes: "B", skills: "C", resources: "A", magic: "D" },
    creation: { attributePoints: 24, skillPoints: 30, startingNuyen: 1000000, forcePoints: 0 },
  },
  [],
);
export const contact = makeActor(
  "contact",
  "Patch",
  { details: { archetype: "streetDoc", leaderId: "anna" } },
  [],
);
export const follower = makeActor("follower", "Bodyguard", {
  details: { archetype: "bodyguard", leaderId: "anna" },
});
export const vehicle = makeActor(
  "vehicle",
  "Aztech GCR-23C Crawler",
  {
    model: "Aztech GCR-23C Crawler",
    vehicleType: "drone",
    body: 1,
    armor: 0,
    pilot: 1,
    sensor: 1,
    load: 15,
    cost: 3750,
    streetIndex: 1,
  },
  loadout.filter((entry) => ["gear", "weapon"].includes(entry.type)),
);
export const deck = makeActor(
  "cyberdeck",
  "Fuchi Cyber-6",
  {
    model: "Fuchi Cyber-6",
    persona: 6,
    memory: { total: 500, used: 0 },
    storage: { total: 1000, used: 0 },
    responseIncrease: 2,
  },
  loadout.filter((entry) => entry.type === "program"),
);
export const spirit = makeActor(
  "spirit",
  "Water Elemental",
  {
    spiritType: "water",
    services: 3,
    summoner: "Raven",
    powers: "Engulf, Movement, Materialization",
  },
  [],
);
export const critter = makeActor(
  "critter",
  "Hellhound",
  { spiritType: "hellhound", powers: "Flame projection, Enhanced senses" },
  [],
);
export const ic = makeActor("ic", "Killer IC", { icType: "killer", rating: 5 }, []);
game.actors.push(anna, mage, adept, chargen, contact, follower, vehicle, deck, spirit, critter, ic);
export const sampleItems = Collection.from(
  schema.Item.types.map(
    (type) =>
      new Item(
        loadout.find((entry) => entry.type === type) ??
          item(type, type.charAt(0).toUpperCase() + type.slice(1)),
      ),
  ),
);
sampleItems.push(
  new Item(item("gear", "Power Focus 2", { equipped: true })),
  new Item(item("gear", "Spell Category Focus 3", { equipped: true, focus: { spellClass: "C" } })),
  new Item(
    item("gear", "Specific Spell Focus 2", { equipped: true, focus: { spellId: "manabolt" } }),
  ),
);
for (const entry of sampleItems) entry.parent = mage;
export { schema };
