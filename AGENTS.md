# Repository Guidelines

## Project Structure & Module Organization

- `scripts/` — ES module JavaScript (system init, Actor/Item logic, sheets, apps like importers and trackers)
- `templates/` — Handlebars/HTML templates for sheets and UI apps
- `styles/` — system CSS (`styles/shadowrun2e.css`)
- `data/` — source JSON catalogs (skills, gear, cyberware, spells, etc.) used by the importers
- `packs/` — Foundry compendium packs (LevelDB). Treat as generated artifacts; avoid hand-editing files here.
- `lang/` — localization strings (`lang/en.json`)
- `icons/` — system artwork
- Root manifests/schema: `system.json`, `template.json` (data model), `module.json` (metadata/legacy)

## Build, Test, and Development Commands

This repo has no build step; Foundry loads the files directly.

- Install for local dev by placing (or symlinking) the repo as `shadowrun2e` under your Foundry data directory: `Data/systems/shadowrun2e`
  - macOS example: `ln -s /path/to/foundry-sr2 "$HOME/Library/Application Support/FoundryVTT/Data/systems/shadowrun2e"`
- Start Foundry, enable the system in a world, and hard-refresh the browser after changes.
- Quick sanity check (syntax only): `node --check scripts/shadowrun2e.js` (and any changed files)

## Coding Style & Naming Conventions

- Follow `.editorconfig` (indentation, whitespace, newlines).
- JavaScript: ES modules, semicolons, 4-space indentation (match existing `scripts/` files)
- Templates/CSS/JSON/Markdown: 2-space indentation (match `templates/`, `styles/`, and root JSON)
- Naming: files are typically `kebab-case.js`; classes are `PascalCase` with an `SR2` prefix (e.g., `SR2ActorSheet`)
- Keep the system id consistent: `shadowrun2e` (used in paths and settings keys)

## System Data Model (Actor) Quick Reference

- Actor types (see `template.json`):
  - `character` (Character - Player)
  - `contact` (Character - Contact)
  - `follower` (Character - Follower)
  - `cyberdeck`, `vehicle`, `spirit`
- Shared `system.*` shape for `character`/`contact`/`follower`:
  - `system.attributes.{body,quickness,strength,charisma,intelligence,willpower,essence,magic,reaction}.value`
  - `system.pools.{combat,spell,hacking,control,task,astral}.{current,max}`
  - `system.pools.karma.{current,total}`
  - `system.initiative.{base,dice,current}`
  - `system.magic.{awakened,physicalAdept,tradition}` (tradition values used in sheet: `hermetic`, `shamanic`, or empty)
  - `system.resources.{nuyen,lifestyle}`
  - `system.priorities.{metatype,attributes,skills,resources,magic}` (single letters `A`–`E` or empty; used during creation)
  - `system.creation.{attributePoints,skillPoints,forcePoints,startingNuyen,lifestyleMonths,extras}` (computed on create when priorities are selected)
  - `system.creation.extras.{contacts,buddy,gang,followers}` (SR2 cost planning fields)
  - `system.details.{metatype,nativeLanguage,dialectLanguage,traits,age,height,weight,eyes,hair,skin,concept,archetype,leaderId}`
  - `system.details.traits.{lowLightVision,thermographicVision,reach,dermalArmor,diseaseResistance}` (derived from metatype)
- Follower conventions:
  - `system.details.archetype` is a key in `SR2_FOLLOWER_ARCHETYPES` (`scripts/shadowrun2e.js`) and documented in `ARCHETYPES.md`
  - `system.details.leaderId` is the Actor ID of the leader (an Actor with `type === "character"`)
- Create Actor dialog enhancements (in `scripts/shadowrun2e.js`):
  - When type is `character`, show ABCDE priorities fields
  - When type is `follower`, show Archetype + Leader fields
  - When type is `follower`, the Name field is auto-filled and read-only

## System Data Model (Item) Quick Reference

- Skill items (`Item.type === "skill"`):
  - `system.allocatedRating` (points spent; SR2 uses this for skill point tracking)
  - `system.baseRating`, `system.concentrationRating`, `system.specializationRating` (derived per SR2 conc/spec rules)
  - `system.isFree` + `system.freeLanguageType` used for free language skills (`native`/`dialect`)
- Gear items (`Item.type === "gear"`):
  - `system.bondCost` used for Force Point spending on foci (SR2)

## Testing Guidelines

There is no automated test suite. Do a quick Foundry smoke test (v11+; verified v13 in `system.json`):

- Create an Actor, open sheets, add/edit items, and roll a few tests
- Run the Initiative Tracker and confirm multi-phase behavior
- If changing catalogs in `data/*.json`, re-run the in-game importer (System Settings → Import System Data) and verify compendiums
- Do not commit generated compendium contents under `packs/` (they are treated as build artifacts)

## Agent-Specific Instructions

- Do not run `git` commands (e.g., `git status`, `git log`, `git diff`).
- Use filesystem tools (`ls`, `find`, `rg`) and the repo files themselves to gather context.
