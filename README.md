# Shadowrun 2E for Foundry VTT

A game system for playing Shadowrun, Second Edition (SR2) in Foundry Virtual Tabletop.

## Compatibility

- **Foundry VTT**: Version 11+ (verified on v13)
- **System ID**: `shadowrun2e`

## Installation

### Method 1: Manifest URL (Recommended)

1. Open Foundry VTT
2. Go to "Game Systems" tab
3. Click "Install System"
4. Paste this manifest URL: `https://raw.githubusercontent.com/JaredStowell/foundry-sr2/main/system.json`
5. Click "Install"

### Method 2: Manual Installation

1. Download the system `.zip` from the repository (tags/releases), or use the `download` URL in `system.json`
2. Extract the zip file to your Foundry `Data/systems/` directory as `shadowrun2e`
3. Restart Foundry VTT

## Highlights

### Actors & Sheets

- Character sheet for **Character**, **Contact**, and **Follower** actors (creation helpers, contacts, follower leader linking)
- Cyberdeck sheet with program load/active toggles and memory/storage tracking
- Vehicle sheet (vehicles and drones)
- Spirit sheet

### Rules Support

- SR2 d6 success tests with Target Numbers (Rule of One, Rule of Six)
- Skills with Concentrations/Specializations; roll Base/Concentration/Specialization ratings
- Dice pools (Combat, Magic, Hacking, Control, Astral) with spend/refresh tracking
- Spell casting with Force and Drain resistance
- Cyberware/bioware installation with Essence and Bio Index tracking

### Tools & Data

- Item Browser for adding cyberware, bioware, spells, adept powers, totems, weapons, armor, and gear
- Initiative Tracker (token controls button or `Ctrl+I`) with multi-phase SR2 turn order
- System Settings → **Import System Data** to rebuild compendiums from `data/*.json`
- Included compendiums: skills, gear, cyberware, bioware, spells, adept powers, programs, VR programs, totems, cyberdecks, vehicles, drones

## Documentation

- Rules reference: `RULES.md`

## Support

- **Issues**: [GitHub Issues](https://github.com/JaredStowell/foundry-sr2/issues)
- **Discussions**: [GitHub Discussions](https://github.com/JaredStowell/foundry-sr2/discussions)

## License

This system is licensed under the terms specified in the LICENSE file.

## Acknowledgments

- Based on Shadowrun 2nd Edition by FASA Corporation
- Built for the Foundry VTT community

---

_Shadowrun is a trademark of Catalyst Game Labs. This system is not affiliated with or endorsed by Catalyst Game Labs._
