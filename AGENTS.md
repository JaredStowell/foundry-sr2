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
- Run quick repo checks before opening a PR: `npm run verify`

## Coding Style & Naming Conventions

- Follow `.editorconfig` (indentation, whitespace, newlines).
- JavaScript: ES modules, semicolons, 4-space indentation (match existing `scripts/` files)
- Templates/CSS/JSON/Markdown: 2-space indentation (match `templates/`, `styles/`, and root JSON)
- Naming: files are typically `kebab-case.js`; classes are `PascalCase` with an `SR2` prefix (e.g., `SR2ActorSheet`)
- Keep the system id consistent: `shadowrun2e` (used in paths and settings keys)

## Testing Guidelines

There is no automated test suite. Do a quick Foundry smoke test (v11+; verified v13 in `system.json`):

- Create an Actor, open sheets, add/edit items, and roll a few tests
- Run the Initiative Tracker and confirm multi-phase behavior
- If changing catalogs in `data/*.json`, re-run the in-game importer (System Settings → Import System Data) and verify compendiums
- Do not commit generated compendium contents under `packs/` (they are treated as build artifacts)

## Agent-Specific Instructions

- Do not run `git` commands (e.g., `git status`, `git log`, `git diff`).
- Use filesystem tools (`ls`, `find`, `rg`) and the repo files themselves to gather context.
