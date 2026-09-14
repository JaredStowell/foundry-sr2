# Standalone styled screen gallery

Run `pnpm install`, then `pnpm preview` and open
<http://127.0.0.1:4175>. Set `SR2_PREVIEW_PORT` to use a different port.

The gallery loads the real system stylesheets, all twelve templates, sheet `getData`
methods, catalog files, and JavaScript dialog builders. Use the sidebar to explore
actor types, character tabs, item types, catalog browsers, roll dialogs and actor
creation. “Check every screen” renders each configured variant and its tab panels,
and checks for missing images. Its results are also available at
`window.sr2Preview.report` for browser automation.

Shared window styling lives in `styles/compact-ui.css`, loaded after the legacy
layout stylesheet in both `system.json` and this gallery. System dialog builders
use the `sr2-dialog` class so the same theme applies to roll and confirmation popups.

Foundry is not bundled. The window frame and base layout are approximated in
`preview.css`; Font Awesome Free supplies icons. `runtime.js` provides a minimal
in-memory document and application adapter. Names, karma adjustments and pool
resets operate on sample data only. Dice execution, purchases and imports are
not connected to a game. Reload the page to restore the fixtures.

This is visual development support, not a replacement for Foundry integration
tests. Core Foundry screens (canvas, Combat Tracker, FilePicker, player list,
settings and permissions), third-party modules, and every possible conditional
actor state are outside the standalone preview.
