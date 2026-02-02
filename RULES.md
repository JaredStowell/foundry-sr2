# Shadowrun Second Edition — Rules

Use search for headings like `## Combat`.

## Table of Contents (searchable)

- [Game Concepts](#game-concepts) — search `## Game Concepts`
- [Creating a Character](#creating-a-character) — search `## Creating a Character`
- [Archetypes](#archetypes) — search `## Archetypes`
- [Skills](#skills) — search `## Skills`
- [Combat](#combat) — search `## Combat`
- [Magic](#magic) — search `## Magic`
- [The Matrix](#the-matrix) — search `## The Matrix`
- [Critters](#critters) — search `## Critters`
- [Gear](#gear) — search `## Gear`
- [Vehicles](#vehicles) — search `## Vehicles`
- [Karma](#karma) — search `## Karma`
- [Reference Tables](#reference-tables) — search `## Reference Tables`

---

## Game Concepts

### Success Tests (core mechanic)
- Roll a number of d6 equal to the relevant Skill or Attribute.
- Each die that is **≥ Target Number (TN)** counts as 1 success.
- Usually 1+ successes = success; more successes = a better result.

### Rule of One
- Any die showing `1` is always a failure.
- If *all* dice rolled are `1`s, the test is a critical failure; the GM decides what happens.

### Rule of Six
When the TN is greater than 6:
- A `6` “explodes”: re-roll it and add the new result to 6.
- Keep re-rolling and adding if you roll additional 6s.

### Modifiers
- Unless stated otherwise, modifiers adjust the TN (e.g., TN 5 with –3 becomes TN 2).
- Some rules instead add/remove dice.
- Target Numbers generally have a minimum of **2**.

### Skill Success Table (difficulty → TN)
| Difficulty | TN |
| --- | ---: |
| Simple | 2 |
| Routine | 3 |
| Average | 4 |
| Challenging | 5 |
| Difficult | 6–7 |
| Strenuous | 8 |
| Extreme | 9 |
| Nearly impossible | 10+ |

### Opposed Tests
- Both sides roll their tests and compare successes.
- The side with more successes wins; net successes often determine the magnitude of the result.

### Taking the Time (extended tasks)
- For tasks with a base time (repairs, building, etc.), roll once and divide the **base time** by the number of successes to get the actual time.
- Round to a sensible whole time unit (GM adjudication).

### Dice Pools (bonus dice)
Dice Pools are extra dice that can be added to certain tests.
- Common pools: **Combat**, **Magic**, **Control**, **Hacking**
- Spent dice are unavailable until the pool refreshes (refresh timing is defined in the relevant rules sections).

### Quick Glossary
- **Condition Monitor**: tracks damage/stun; gear like vehicles/cyberdecks may have their own damage tracks.
- **Damage Code**: weapon damage is expressed as Power (number) + Damage Level (Light/Moderate/Serious/Deadly).
- **Force**: rating for spells/spirits; used like a Skill/Attribute in some tests and affects Drain.
- **Drain**: fatigue/stun suffered by magicians from spellcasting/conjuring; resolved via Drain resistance rules.
- **Karma**: earned advancement currency; also fuels Karma Pool (see `## Karma`).

## Creating a Character

### What you track
A character sheet tracks:
- Race
- Attributes
- Skills
- Gear
- Magic (if any): spells, Drain, etc.
- Cyberware (if any): costs Essence
- Extras: contacts, lifestyle, etc.

### Race
Available races: Human, Elf, Dwarf, Ork, Troll.

#### Racial traits (at a glance)
- **Human**: no special mods.
- **Elf**: higher Quickness and Charisma; low-light vision.
- **Dwarf**: higher Body, Strength, and Willpower; lower Quickness; thermographic vision; more resistant to disease.
- **Ork**: higher Body and Strength; lower Charisma and Intelligence; low-light vision.
- **Troll**: much higher Body and Strength; lower Quickness, Charisma, Intelligence, and Willpower; thermographic vision; long arms (melee advantage); very tough skin.

### Attributes
#### Attribute list
- **Physical**: Body, Quickness, Strength
- **Mental**: Charisma, Intelligence, Willpower
- **Special**: Essence, Reaction (+ Magic for magicians)

#### Key rules
- **Reaction** = floor((Quickness + Intelligence) / 2)
- Attributes are often written as `natural (modified)`, e.g. `4 (6)`.
- Starting characters cannot exceed their racial maximums.

#### Human attribute rating descriptions
| Rating | Description |
| ---: | --- |
| 1 | Weak |
| 2 | Underdeveloped |
| 3 | Typical |
| 4 | Improved |
| 5 | Superior |
| 6 | Maximum unmodified human |

#### Racial maximums (unmodified)
| Attribute | Human | Elf | Dwarf | Ork | Troll |
| --- | ---: | ---: | ---: | ---: | ---: |
| Body | 6 | 6 | 7 | 9 | 11 |
| Quickness | 6 | 8 | 5 | 6 | 5 |
| Strength | 6 | 6 | 8 | 8 | 10 |
| Charisma | 6 | 8 | 6 | 5 | 4 |
| Intelligence | 6 | 6 | 6 | 5 | 4 |
| Willpower | 6 | 6 | 7 | 6 | 5 |
| Essence | 6 | 6 | 6 | 6 | 6 |
| Magic | 6 | 6 | 6 | 6 | 6 |
| Reaction | 6 | 6 | 5 | 5 | 4 |

#### Attribute definitions
- **Body**: general health and resistance to injury/pain.
- **Quickness**: dexterity and agility; affects movement.
- **Strength**: ability to lift/carry and apply physical force.
- **Intelligence**: quickness of mind, perception, and learning.
- **Willpower**: determination and mental stability; resistance to mental/fatigue damage.
- **Charisma**: personal aura and persuasiveness (not just physical attractiveness).

### Essence and Magic
- All characters start with **Essence 6**.
- Cyberware reduces Essence; no character can start above 6.
- If Essence ever drops below 0, the character dies.
- Characters who can use magic have a **Magic** rating:
  - Starts at 6.
  - Equals Essence (rounded down).

### Skills
- Skills define what a character knows and can do.
- Skill ratings start at 1.
- Starting characters normally cap at Skill 6 (unless a Concentration/Specialization rule says otherwise).

### Gear
- Gear is equipment the character owns (weapons, armor, radios, vehicles, foci, etc.).
- Some gear has ratings; starting gear normally caps at Rating 6.

### Extras
- Extras cover broad advantages (not a single spell or item).
- **Contacts** are vital sources of information.
- Characters start with **two free contacts**; additional contacts are earned through play.
- A **buddy** is a more loyal contact (typically chosen at character creation).

### Cyberware
- Cyberware can improve Attributes/abilities and enable special actions (like decking or rigging).
- Cyberware is purchased with starting funds during character creation and costs Essence.
- More cyberware can be acquired later with money; installation requires parts + surgery (handled in play).

### Spells
- Spells are available only to magicians capable of sorcery.
- New characters get their first spells at character creation; new spells later require a teacher and money.
- Spells have a Force rating (minimum 1).
- Starting spells cannot have Force higher than 6.

### Building a Character

You can either:
- Pick an **Archetype** (pregenerated character) and play.
- Build from scratch:
  - Decide a concept (samurai, decker, rigger, magician, etc.).
  - Assign priorities (A–E).
  - Spend Attribute Points, Skill Points, and Resources.
  - Choose spells/gear/cyberware/extras as allowed.

### Priority System (A–E)

Assign each priority letter **once** across these categories:
- Race
- Magic
- Attributes
- Skills
- Resources

Higher priority = more capability in that category.

#### Race priority
- **Priority A**: choose a metahuman (Elf, Dwarf, Ork, Troll).
- **Priorities B–E**: Human.

#### Lifestyle (starting)
During character creation, purchase a starting lifestyle (upkeep/standard of living):
- Street
- Squatter
- Low
- Middle
- High
- Luxury

#### Racial modifications
Racial Attribute modifiers determine the character’s baseline (starting) attributes.
- Baseline attributes do **not** cost Attribute Points.
- Baseline attributes may be **0** if a negative modifier drops them below 1 (e.g., Dwarf Quickness).
- Final Attribute ratings cannot exceed racial maximums.

| Race | Modifications |
| --- | --- |
| Dwarf | +1 Body, –1 Quickness, +2 Strength, +1 Willpower; Thermographic Vision; Disease Resistance (+2 Body vs disease) |
| Elf | +1 Quickness, +2 Charisma; Low-Light Vision |
| Ork | +3 Body, +2 Strength, –1 Charisma, –1 Intelligence; Low-Light Vision |
| Troll | +5 Body, –1 Quickness, +4 Strength, –2 Intelligence, –1 Willpower, –2 Charisma; Thermographic Vision; Reach +1 (Armed/Unarmed); Dermal Armor (+1 Body) |

#### Essence, Magic, Reaction
- All characters start with **Essence 6** (reduced by cyberware).
- If the character is a magician, **Magic starts at 6** but is limited by Essence (Magic equals Essence, rounded down).
- **Reaction** = floor((Quickness + Intelligence) / 2)
- You do not spend Attribute Points on Essence, Magic, or Reaction.

#### Skills priority
Allocate Skill Points based on the priority assigned to **Skills**:
- A: 40
- B: 30
- C: 24
- D: 20
- E: 17

Rules:
- No starting skill above 6 (unless Concentrations/Specializations are in play).
- Only characters with a Magic rating may take Sorcery and Conjuring.

#### Magic priority
The priority assigned to **Magic** determines whether the character is a magician:
- Human magician: Magic priority A
- Metahuman magician: Magic priority B

These priorities determine *whether* you’re magical, not *which* tradition (hermetic vs shamanic)—that’s the player’s choice.

Examples:
- Human magician: Magic A, Race E
- Metahuman magician: Race A, Magic B

#### Adepts (limited-ability magicians)
Adepts assign Magic priority differently:
- Human adept: Magic priority **B** (Race priority **E** still available; Priority A still available elsewhere)
- Metahuman adept: Race priority **A** and Magic priority **C** (Priority B still available elsewhere)

As with full magicians, assigning priorities does not determine what *type* of adept the character becomes; that’s the player’s choice.

#### Concentrations and Specializations (optional)
- Any one general skill may have only one Concentration or Specialization.
- Each general skill can only be acquired once.

**Concentration**
- Concentration rating = (general skill rating + 1)
- General skill rating becomes (general skill rating – 1)

**Specialization**
- Specialization rating = (general skill rating + 2)
- General skill rating becomes (general skill rating – 2)
- The character also uses the related Concentration at a rating equal to the original (pre-specialization) general skill rating.

#### Attributes priority
Assign a priority to the **Attributes** category to get Attribute Points for the six Physical/Mental attributes:
- Body, Quickness, Strength, Intelligence, Willpower, Charisma

Attribute Points by priority:
- A: 30
- B: 24
- C: 20
- D: 17
- E: 15

Rules:
- Special attributes (Essence, Magic, Reaction) are handled separately.
- Start at the racial baseline, then spend Attribute Points to raise ratings above it.
- No final Attribute above racial maximum; Attributes can be 0 if allowed by baseline.

#### Languages (special skill)
- All characters know their native language at (Intelligence + 2), max 6.
- Characters with a Street lifestyle also know a local dialect (e.g., City Speak, Tunnel Talk) at floor(Intelligence / 2).
- Other languages are purchased like skills (see Languages section).
- Starting language skills have a minimum rating of 1.

### Resources (money and Force Points)

Resources provide:
- **Money (¥)** for gear, cyberware, extras, and the nuyen cost of foci.
- **Force Points** (magicians only) for spells and bonding foci.

#### Resources by priority
| Priority | Money | Force Points (magicians only) |
| --- | ---: | ---: |
| A | 1,000,000¥ | 50 |
| B | 400,000¥ | 35 |
| C | 90,000¥ | 25 |
| D | 5,000¥ | 15 |
| E | 500¥ | 5 |

#### Force Points (spells and foci)
- Choose starting spells from the Spell Directory and assign Force Points to them as their Force ratings.
- No starting spell can have Force higher than 6.
- Foci cost **money** and also require a **Bonding** cost; pay Bonding from Force Points.

#### Focus bonding costs (Karma; paid in Force Points at character creation)
| Focus | Bonding cost |
| --- | ---: |
| Specific Spell Focus | Rating |
| Spell Category Focus | 3 × Rating |
| Spirit Focus | 2 × Rating |
| Power Focus | 5 × Rating |
| Spell Lock | 1 |
| Weapon Focus (Small) | 4 × Rating |
| Weapon Focus (Large) | 5 × Rating |

#### Buying during character creation
- **Cyberware**: pay the listed cost and apply the listed Essence reduction. Ignore Availability/Street Index and surgery/installation costs during character generation.
- **Gear**: pay the listed cost. Characters cannot start with gear rated above 6.
- **Extras**: pay the listed cost (see table). Characters start with two free contacts.
- **Lifestyle**: purchase a starting lifestyle during character generation (or default to Street).

#### Cost of Extras
| Extra | Cost |
| --- | ---: |
| Contact | 5,000¥ |
| Buddy | 10,000¥ |
| Gang/Tribe | 50,000¥ |
| Followers | 200,000¥ |

#### Optional: More Metahumans
If a GM wants more metahuman PCs:
- Reduce the metahuman Race requirement from Priority A to Priority C.
- Shift Magic priorities to A (full magicians) and B (adepts) for all races.

#### Optional: Allergies
A GM may allow a metahuman character to take an allergy for extra character generation points.
(See Critters for allergy details.)

### Completing the Character

Checklist:
- If the character is magical: choose tradition/type; if shamanic, choose a totem.
- Confirm Race and Magic priorities.
- Allocate Attribute Points and apply racial modifiers.
- Allocate Skill Points and apply Concentration/Specialization adjustments (if used).
- Buy equipment, cyberware, spells, contacts, foci, and a lifestyle.

### Starting Money
- Unspent Resource nuyen converts to starting cash at a 10:1 ratio.
  - Example: 15,000¥ unspent becomes 1,500¥ starting cash.
- All characters also start with **3D6 × 1,000¥** in additional cash (in whatever form the player chooses).

### Starting Karma
- Humans begin with **1** point in Karma Pool.
- Metahumans begin with **2** points in Karma Pool (unless the More Metahumans optional rule is used).
- A new team starts with **2** points in Team Karma Pool.
- Characters may contribute some of their starting Karma Points to Team Karma (optional).

### Character Record Sheet
Fill out the character record sheet; the character is ready to run.

## Archetypes
These are pregenerated characters (use as-is or as templates).

#### Bodyguard

##### Attributes
- Body: 6 (9)
- Quickness: 6
- Strength: 5
- Charisma: 3
- Intelligence: 5
- Willpower: 5
- Essence: 0.2
- Reaction: 5 (9)
- Initiative: 9 + 3D6

##### Skills
- Car: 6
- Firearms: 6
- Negotiation: 4
- Stealth: 2
- Unarmed Combat: 6

##### Dice Pools
- Combat: 8

##### Cyberware
- Air Filtration: 5
- Dermal Plating: 3
##### Skillsofts
- Armed Combat: 3
- Bike: 3
- Electronics: 3
- Rotor: 3
- Winged: 3
- (4) Specialized Etiquette softs at 3 points each
- Skillwire: 3
- Smartlink
- Wired Reflexes: 2

##### Contacts
- Choose (2) Contacts
##### Gear
- (3) Spare Clip
- Ares Predator — smartlink; 50 rounds exploding ammo
- Armor Clothing — 3/1
- Concealable Holster
- DocWagon Contract (Gold)
- High Lifestyle — 2 months prepaid
- Lined Coat — 4/2
- Pocket Secretary
- Earplug Phone
- Phone Booster Pack
- Tres Chic Clothing
- Starting Cash: 11,474¥

#### Combat Mage

##### Attributes
- Body: 2 (3)
- Quickness: 4
- Strength: 2
- Charisma: 2
- Intelligence: 5
- Willpower: 5
- Essence: 5.8
- Magic: 5 (7)
- Reaction: 4
- Initiative: 4 + 1D6

##### Skills
- Conjuring: 3
- Firearms: 3
- Magical Theory: 4
- Sorcery: 6
- Unarmed Combat: 2

##### Other
- Etiquette (Corp): 2

##### Dice Pools

- Combat: 7 (9)
- Magic: 6 (8)
##### Cyberware
- Cybereyes with Thermographic and Low-Light
##### Contacts

- Choose (2) Contacts
##### Gear
- Armor Jacket — 5/3
- DocWagon Contract (Gold)
- Heckler & Koch HK227 — laser sight; 50 rounds regular ammo
- Middle Lifestyle — 1 month prepaid
- Power Focus 2
- Spell Lock — Armor (2 successes)
- Spell Lock — Personal Combat Sense (4 successes)
- Spells
- Combat:
- Manaball: 4
- Mana Bolt: 4
- Power Bolt: 3
- Detection:
- Clairvoyance: 3
- Detect Enemies: 2
- Personal Combat Sense: 5
- Health:
- Heal: 3
- Increase Reaction (+2): 2
- Manipulation:
- Armor: 3
- Confusion: 3
- Starting Cash: 14,100¥

#### Decker

##### Attributes
- Body: 2
- Quickness: 4
- Strength: 3
- Charisma: 1
- Intelligence: 6
- Willpower: 4
- Essence: 5.5
- Reaction: 5 (7)*
- Initiative: 5 (7)* + 1D6 (2D6)*

##### Skills
- Bike: 4
- Computer: 6
- Computer Theory: 6
- Electronics: 6
- Firearms: 3
- Physical Sciences: 4

##### Other
- Computer (B/R): 6
- Etiquette (Street): 5

##### Dice Pools
- Combat: 7
- Hacking: 11 (13)*
##### Cyberware
- Datajack
- Headware Memory (30 Mp)

##### Contacts
- Choose (2) Contacts
##### Gear
- Fuchi Cyber-4
- Programs:
- Bod Rating 5
- Evasion Rating 4
- Masking Rating 4
- Sensors Rating 5
- Attack Rating 6
- Browse Rating 4
- Deception Rating 4
- Electronic Shop
- Table Top PC (100 mp)
- Yamaha Rapier
- Ruger Super Warhawk — 10 rounds regular ammo
- Middle Lifestyle
- Starting Cash: 10,860¥
- *Applies in the Matrix only.


#### Detective

##### Attributes
- Body: 4
- Quickness: 4
- Strength: 3
- Charisma: 3
- Intelligence: 6
- Willpower: 4
- Essence: 6
- Reaction: 5
- Initiative: 5 + 1D6

##### Skills
- Biotech: 2
- Car: 4
- Computer: 4
- Firearms: 6
- Negotiation: 6
- Stealth: 5
- Unarmed Combat: 6

##### Other
- Etiquette (Corp): 3
- Etiquette (Street): 4

##### Dice Pools
- Combat: 7
##### Cyberware
- None

##### Contacts
- Choose (6) Contacts
##### Gear
- Ares Predator — 10 rounds regular ammo
- Armor Vest — 2/1
- Ford Americar
- Lower Lifestyle — 1 month prepaid
- Micro-Recorder
- Pocket Secretary
- Walther Palm Pistol — 10 rounds regular ammo
- Starting Cash: 12,311¥

#### Dwarf Mercenary

##### Attributes
- Body: 6
- Quickness: 3
- Strength: 5
- Charisma: 2
- Intelligence: 3
- Willpower: 4
- Essence: 5.5
- Reaction: 3
- Initiative: 3 + 1D6

##### Skills
- Car: 4
- Firearms: 6
- Gunnery: 5
- Stealth: 4
- Throwing: 4
- Unarmed Combat: 5

##### Other
- Etiquette (Mercenary): 2

##### Dice Pools

- Combat: 4

##### Cyberware

- Smartlink
##### Gear
- Armor Clothing — 3/1
- (2) Defensive — hand grenades
- FN HAR — laser sight; 100 rounds regular ammo
- Lower Lifestyle

##### Contacts
- Choose (2) Contacts
- Starting Cash: 10,154¥
- Notes: Natural thermographic vi-
- sion, +2 Body for disease
- resistance only


#### Elven Decker

##### Attributes
- Body: 2
- Quickness: 5
- Strength: 2
- Charisma: 5
- Intelligence: 5
- Willpower: 4
- Essence: 5.5
- Reaction: 5 (7)*
- Initiative: 5 (7)* + 1D6 (2D6)*

##### Skills
- Bike: 3
- Computer: 5
- Computer Theory: 5
- Firearms: 3

##### Other
- Etiquette (Elven): 2
- Etiquette (Street): 2

##### Dice Pools

- Combat: 7
- Hacking: 10 (12)*
##### Cyberware
- Datajack
- Headware Memory (30 Mp)

##### Contacts
- Choose (2) Contacts
##### Gear
- Fuchi Cyber-4
- Programs:
- Bod Rating 5
- Evasion Rating 4
- Masking Rating 4
- Sensors Rating 5
- Attack Rating 6
- Browse Rating 4
- Deception Rating 4
- Electronic Shop
- Table Top PC (100 mp)
- Yamaha Rapier
- Ruger Super Warhawk — 10 rounds regular ammo
- Middle Lifestyle
- Starting Cash: 10,860¥
- Notes: Natural low-light eyes.
- *Applies only in the Matrix.

#### Former Company Man

##### Attributes
- Body: 4
- Quickness: 4 (5)
- Strength: 4 (5)
- Charisma: 2
- Intelligence: 3
- Willpower: 3
- Essence: 1.3
- Reaction: 4 (8)
- Initiative: 8 + 3D6

##### Skills
- Car: 6
- Computer: 3
- Demolitions: 2
- Firearms: 6
- Stealth: 4
- Unarmed Combat: 6

##### Other
- Etiquette (Corp): 4

##### Dice Pools
- Combat: 5
##### Cyberware
- Datajack
- Muscle Replacement (1)
- Smartgun Link
- Wired Reflexes (2)

##### Contacts
- Choose (2) Contacts
##### Gear
- Armor Clothing — 3/0
- Armor Jacket — 5/3
- Bug Scanner Lv 4
- Earplug Phone
- Phone Booster Pack
- Eurocar Westwind 2000
- Fichetti Security 500 — internal smartlink; 100 rounds regular ammo
- Heckler & Koch HK227 — internal smartlink; 100 rounds regular ammo
- Jammer Lv 4
- Low-Light Goggles
- Medkit
- Survival Kit
- (2) Tranq Patch 5
- Trauma Patch
- White Noise Generator Lv 6
- Starting Cash: 17,780¥


#### Former Wage Mage

##### Attributes
- Strength: 1
- Quickness: 3
- Body: 2
- Charisma: I
- Intelligence: 6
- Willpower: 4
- Essence: 6
- Magic: 6
- Reaction: 4
- Initiative: 4 + 1D6

##### Skills
- Conjuring: 6
- Firearms: 3
- Magical Theory: 6
- Negotiation: 2
- Psychology: 2
- Sorcery: 6

##### Other
- Etiquette (Corp): 5

##### Dice Pools
- Combat: 6
- Magic: 6

##### Cyberware
- None

##### Contacts
- Choose (2) Contacts

##### Gear
- Armor Clothing — 3/0
- Hermetic library - Disk - Rating 3
- Data Display (60Mp)
- Ruger Super Warhawk — 10 rounds regular ammo
- Spells
- Choose one orientation from the following:
- Fighter:
- Healer:
- Antidote M Toxin: 2
- Analyze Device: 5
- Heal: 3
- Cure M Disease: 4
- Chaotic World: 5
- Mana Bolt: 6
- Detox M Toxin: 3
- Clairvoyance: 4
- Powerball: 6
- Heal : 6
- Entertainment: 3
- Hibermate: 4
- Mask: 3
- Treat: 6
- Sleep: 5
- Sleep: 5
- Starting Cash: 1,100¥

#### Gang Member

##### Attributes
- Body: 5
- Quickness: 6
- Charisma: 6
- Strength: 5
- Intelligence: 4
- Willpower: 4
- Essence: 5.7
- Reaction: 5
- Initiative: 5 + 1D6

##### Skills
- Armed Combat: 4
- Bike: 3
- Firearms: 4
- Projectile Weapons: 3
- Stealth: 3
- Unarmed Combat: 3

##### Other
- Etiquette (Street): 4
- \

##### Dice Pools
- Combat: 7

##### Cyberware
- Hand Razors
- Cybereyes with Low-Light
##### Contacts

- Choose (4) Contacts

##### Gear
- Knife
- Simsense Player Unit
- (6) Simsense Program Chip
- Squatter Lifestyle
- Streetline Special — 10 rounds regular ammo
- Synthetic Leather — 0/1
- Yamaha Rapier
- Starting Cash: 1,647¥
- Note: The gang member can call on 2D6 other members for help.

#### Mercenary

Body: 5

a

Quickness: 4

e Ae

Charisma: 3

¢

=

a

Armed Combat: 6

Car: 4

Demolitions: 3

Strength: 5

é a@.


##### Attributes
- Intelligence: 4
- Willpower: 3
- Essence: 3.4
- Reaction: 4 (6)
- Initiative: 6 + 2D6

##### Skills
- Firearms: 6
- Gunnery: 4
- Military Theory: 2
- Rotor: 3
- Stealth: 3

##### Other
- .

##### Dice Pools

- Throwing: 3
- Unarmed Combat: 6
- Combat: 5

##### Cyberware

- Cybereyes with Low-Light
- Radio Receiver
- Wired Reflexes: 1
##### Contacts

- Choose (2) Contacts

##### Gear
- Ares Predator — external smartlink; 20 rounds regular ammo
- Armor Jacket — 5/3
- Ingram Valiant — external smartlink; 100 rounds regular ammo
- Knife
- Smart Goggles
- Throwing Knife
- Starting Cash: 12,750¥

#### Rigger

##### Attributes
- Body: 5
- Quickness: 6
- Strength: 4
- Charisma: 4
- Intelligence: 6
- Willpower: 5
- Essence: 1.35
- Reaction: 6 (10)*
- Initiative: 6 (10)* + 1D6 (3D6)*

##### Skills
- Bike: 4
- Car: 5
- Computer: 3
- Electronics: 3
- Firearms: 2
- Gunnery: 4

##### Other
- Etiquette (Corp): 1
- Ground Vehicles (B/R): 2

##### Dice Pools
- Combat: 8
- Control: 6 (10)*
##### Cyberware
- Cybereyes with Low-Light, Flare Protection, and Thermographic Imaging
- Datajack
- Radio
- Smartlink
- Vehicle Control Rig: 2
##### Contacts

- Choose (2) Contacts
##### Gear
- (2) MCT Indrahar O-5P Surv. Drone — rigged; remote gear
- Ares Predator — external smartlink; 20 rounds regular ammo
- Armor Jacket — 5/3
- DocWagon Contract (Platinum)
- Eurocar Westwind 2000 — rigged; concealed LMG; 1,000 rounds belted ammo; 2-shot Missile Launcher (2 AVMs)
- GM-Nissan Spotter — rigged; remote gear; 2 LMGs; 1,000 rounds regular belted ammo
- Middle Lifestyle
- Chrysler-Nissan Patrol-1 — remote gear; 2 LMGs; 1,000 rounds regular belt-fed ammo
- Remote Control Deck (R3) — three slave ports
- Starting Cash: 10,315¥
- *Applies only when rigged.


#### Shaman

Body: 3
Quicknesth:s:3 3
Streng
Charisma: 5

##### Attributes
- Intelligence: 4
- Willpower: 6
- Essence: 6
- Magic: 6
- Reaction: 3
- Initiative: 3 + 1D6

##### Skills
- Armed Combat: 3
- Conjuring: 6 : 4
- Magical Theory: 3
- Sorcery: 5
- Stealth: 3

##### Other
- Etiquette (Tribal)

##### Dice Pools

- Combat: 6
- Magic: 5

##### Cyberware
- None

##### Contacts

- Choose (2) Contacts
##### Gear
- Knife
- Real Leather — 0/2
- Medicine Lodge Materials - Force 2
- Street Lifestyle
- Spells
- Choose one of the following orientations:
- Decelver:
- Fighter:
- Chaos: 4
- Confusion: 5
- Mana Bolt: 4
- Powerball: 6
- Sleep: 5
- Healer:
- Heal: 6
- Hibernate: 4
- Treat: 5
- Entertainment: 3
- Mask: 3
- Detector:
- Starting Cash: 10,315¥
- Analyze Device: 4
- Clairvoyance: 3
- Detect Enemies: 3
- Detect Magic: 5
- Note: A shaman must select a wilderness totem (see Magic chapter).

#### Street Mage

##### Attributes
- Body: 3
- Quickness: 3
- Strength: 2
- Charisma: 3
- Intelligence: 4
- Willpower: 5
- Essence: 6
- Magic: 6
- Reaction: 3
- Initiative: 3 + 1D6

##### Skills
- Bike: 2
- Conjuring: 6
- Firearms: 2
- Magical Theory: 5
- Sorcery: 6
- Stealth: 3
- Unarmed Combat: 2

##### Other
- Etiquette (Street): 4
- \

##### Dice Pools
- Combat: 6
- Magic: 6

##### Cyberware
- None

##### Contacts
- Choose (2) Contacts
##### Gear
- Armor Clothing — 3/0
- Ritual sorcery material - Detection — 4 points (Detect/Detection spells)
- Ritual sorcery material -Illusion — 4 points (Illusion spells)
- Streetline Special — 10 rounds regular ammo
- Spells
- Choose one orientation from the following:
- Fighter:
- Decelver:
- Mana Bolt: 4
- Chaos: 4
- Powerball: 6
- Confusion: 5
- Sleep: 5
- Healer:
- Heal: 6
- Entertainment: 3
- Mask: 3
- Detector:
- Hibemate: 4
- Analyze Device: 4
- Treat: 5
- Clairvoyance: 3
- Detect Enemies: 3
- Detect Magic: 5
- Starting Cash: 10,300¥

#### Street Samurai

##### Attributes
- Body: 6 (8)
- Quickness: 4 (5)
- Strength: 6 (7)
- Charisma: 2
- Intelligence: 5
- Willpower: 5
- Essence: 0.1
- Reaction: 5 (9)
- Initiative: 9 + 3D6

##### Skills
- Armed Combat: 3
- Bike: 2
- Firearms: 5
- Stealth: 4
- Unarmed Combat: 6

##### Other
- Etiquette (Street): 4

##### Dice Pools

- Combat: 7

##### Cyberware
- Cybereyes with Low-Light
- Dermal Plating: 2
- Muscle Replacement: I
- Retractable Hand Razors
- Smartlink
- Wired Reflexes: 2

##### Contacts
- Choose (2) Contacts

##### Gear
- Data Display (100Mp)
- Armor Jacket — 5/3
- Ares Predator — external smartlink; 50 rounds regular ammo
- DocWagon Contract (Platinum)
- Harley-Davidson Scorpion
- Stun Baton
- Uzi III — external smartlink; sound suppressor; regular ammo
- Wrist Phone w/Flip-up Screen
- Starting Cash: 17,270¥

#### Street Shaman

##### Attributes
- Body: 4
- Quickness: 3
- Strength: 2
- Charisma: 5
- Intelligence: 4
- Willpower: 6
- Essence: 6
- Magic: 6
- Reaction: 3
- Initiative: 3 + 1D6

##### Skills
- Conjuring: 5
- Firearms: 3
- Magical Theory: 5
- Sorcery: 5
- Stealth: 3

##### Other
- Etiquette (Street): 3

##### Dice Pools

- Combat: 6
- Magic: 5

##### Cyberware
- None

##### Contacts
- Choose (2) Contacts
##### Gear
- Medicine Lodge Materials - Force 1
- Medkit
- Ruger Super Warhawk — 10 rounds regular ammo
- Spells
- Choose one orientation from the following:
- Fighter:
- Deceiver:
- Mana Bolt: 4
- Chaos: 4
- Powerball: 6
- Confusion: 5
- Sleep: 5
- Healer:
- Heal: 6
- Entertainment: 3
- Mask: 3
- Detector:
- Hibemate: 4
- Analyze Device: 4
- Treat: 5
- Clairvoyance: 3
- Detect Enemies: 3
- Detect Magic: 5
- Starting Cash: 11,305¥
- Note: A street shaman must select an urban totem (see Magic chapter).

#### Tribesman

##### Attributes
- Body: 5
- Quickness: 5
- Strength: 5
- Charisma: 5
- Intelligence: 5
- Willpower: 5
- Essence: 6
- Reaction: 5
- Initiative: 5 + 1D6

##### Skills
- Armed Combat: 5
- Biology: 3
- Biotech: 3
- Stealth: 6
- Horseback Riding: 3

##### Other
- Etiquette (Tribal): 4
- Projectile Weapons:
- Special Skills:

##### Dice Pools

- Combat: 7
##### Cyberware
- None

##### Contacts

- Choose (2) Contacts
##### Gear
- (3) Antidote Patch 4
- Binoculars
- Standard Bow
- (20) Arrows
- Knife
- Low-Light Goggles
- Medkit
- Real Leather
- Street Lifestyle
- Survival Kit
- Tranq Patch 5
- Trauma Patch
- Starting Cash: 12,495¥
- Notes: The tribesman may call on 2D6 members of his tribe for help.

## Skills

Keep this section lightweight and searchable: core rules + a clean skill list.

### Skill Ratings
- Skill ratings start at 1.
- Beginning characters usually cap at Skill 6 (unless a special rule says otherwise).
- A skill test rolls a number of d6 equal to the Skill rating (see `## Game Concepts`).

### Untrained Use (no skill rating)
- Characters with no rating may still attempt some tasks by defaulting to an Attribute or a related skill (GM discretion).
- If defaulting, the dice pool is typically the relevant Attribute (and the GM may apply TN modifiers).

### Skill Web (defaulting)
Shadowrun skills are connected by a “Skill Web” that defines how defaulting works when you lack the exact skill.

- Defaulting via a **related skill**:
  - Trace a path from the desired skill to a skill you have.
  - Each node/circle passed adds **+2 TN**.
- Defaulting via an **Attribute**:
  - Trace from the Attribute to the desired skill.
  - Each node/circle passed adds **+2 TN**.
- You can only trace in the direction allowed by the web (some paths are blocked; some skills don’t connect cleanly).

### Perception
Perception is typically tested using **Intelligence**.

- Dice: roll **Intelligence** dice.
- Base TN: usually **4**, modified by circumstances (table below).
- Perception can cover any of the five senses (sight, hearing, smell, touch, taste).
- Some things (like an item’s **Concealability**) define a specific TN; use that TN instead of 4.

#### Group perception (optional)
- For a team perception test, roll the **average Intelligence** (rounded as the GM prefers) plus **+1 die per team member**.
- Avoid group perception when surprise is possible.

#### Perception modifiers (common)
| Situation | TN modifier |
| --- | ---: |
| Perceiver distracted | +2 |
| **Sight:** very small object | +6 |
| **Sight:** object partially hidden | +2 |
| **Sight:** object brightly colored | –2 |
| **Sight:** action very obvious | –4 |
| **Sight:** action not obvious | +4 |
| **Sight:** visibility impaired | See `## Combat` visibility table |
| **Sound:** single gunshot | –2 |
| **Sound:** silenced single gunshot | 0 |
| **Sound:** burst fire | –4 |
| **Sound:** sound-suppressed burst fire | –2 |
| **Sound:** full autofire | –6 |
| **Sound:** sound-suppressed autofire | –4 |
| **Sound:** grenade blast | –8 |
| **Sound:** a person’s yell | –2 |
| **Sound:** sound is rooms away | +2 |
| **Sound:** sound is on same floor | +4 |
| **Sound:** sound is floors away | +6 |
| **Sound:** perceiver has active sound enhancements | Rating, or –2 |
| **Smell:** odor obvious | –4 |
| **Smell:** other odors present | +2 |
| **Touch:** temperature extreme (hot/cold) | –4 |
| **Touch:** perceiver wearing gloves | +2 |
| **Taste:** taste obvious | –4 |
| **Taste:** perceiver has a cold | +2 |

#### Perception success guideline
| Successes | Result |
| ---: | --- |
| 1 | Notice something is there |
| 2 | Confirm something is there; suspect what kind of thing it is |
| 3 | Know what kind of thing it is; suspect its exact nature |
| 4+ | Know what it is (specific details may still require examination) |

### Knowledge skills (using knowledge skills)
Players may not know setting details, technical facts, or magical theory, but characters might.

- Use the most relevant Knowledge Skill (or default per Skill Web rules).
- The GM sets a TN based on how common/technical the information is.

| Knowledge sought | TN |
| --- | ---: |
| General knowledge | 3 |
| Detailed knowledge | 5 |
| Intricate knowledge | 8 |
| Obscure knowledge | 12 |

| Successes | Result |
| ---: | --- |
| 1 | General knowledge, no details |
| 2 | Detailed information, but minor points inaccurate |
| 3 | Detailed information, but some minor points obscure or missing |
| 4+ | Detailed and accurate information |

### Language skills (using language skills)
- Failure usually means communication is only partially successful and may be misunderstood.
- The GM may make language rolls in secret to preserve uncertainty.

| Situation | TN |
| --- | ---: |
| Universal concept (hunger, fear, bodily functions) | 2 |
| Basic conversation (daily life) | 4 |
| Complex subject (special/limited-interest topics) | 6 |
| Intricate subject (most technical subjects) | 9 |
| Obscure subject (rare/deep technical knowledge) | 11 |

Notes:
- Speaking a dialect variation of a language: **+2 TN**.

### Social skills (using social skills)
To influence an NPC through Social Skills, roll the relevant Social Skill and use a mental Attribute of the NPC as the base TN (GM decides based on approach).

- If influencing a group with no leader, use the **average** of their relevant Attribute ratings.
- Social Skills often use extra successes to measure *how well* the attempt worked (time bought, degree of compliance, etc.).

| Situation | TN modifier |
| --- | ---: |
| NPC is friendly | –2 |
| NPC is neutral | +0 |
| NPC is suspicious | +2 |
| NPC is hostile | +4 |
| NPC is an enemy | +6 |
| Desired result is advantageous to NPC | –2 |
| Desired result is of no value to NPC | +0 |
| Desired result is annoying to NPC | +2 |
| Desired result is harmful to NPC | +4 |
| Desired result is disastrous to NPC | +6 |

#### Optional: Racism and Charisma (GM-facing)
If using racism as a mechanical modifier:

1. Determine racism severity: roll **2D6 – 6**.
   - If the result is **> 0**, the NPC has that many **Racism Points**.
2. Determine the NPC’s racial biases: roll **1D6** on the table below.
   - If the result is the NPC’s own race, ignore it and keep rolling until either:
     - two different racial biases are indicated, or
     - the result is “all except own race”.

| 1D6 | Racial bias |
| ---: | --- |
| 1 | All, except own race |
| 2 | Humans |
| 3 | Elves |
| 4 | Dwarfs |
| 5 | Orks |
| 6 | Trolls |

When making a Social Skill Test against that NPC:
- Add any applicable Racism Points to the Social Skill TN.
- The character may offset Racism Points with a separate **Charisma Test** vs TN **(2 × NPC racism)** (secret TN).
  - Each success cancels **1** Racism Point.
  - This Charisma Test does not add successes to the Social Skill Test; it only reduces the TN penalty.
- If the character is defaulting to **Charisma** for the Social Skill Test, they may not make a separate Charisma Test to offset racism.

### Legwork (using contacts)
Contacts are a primary way to gather clues and information.

- Use **Street** or **Corporate Etiquette** (as appropriate) vs TN **4** to determine what a contact knows and is willing to share.
- More successes = more complete detail; higher-success results include the information from lower-success results.

#### Paying for information (baseline formula; optional)
If the GM wants a baseline nuyen cost for information:
- `Fee = (contact Etiquette skill) × (player successes) × (contact Charisma + contact Intelligence) × 10¥`
- Adjust for the specific contact and situation; normal Negotiation procedures can apply.

#### “Check around” requests (optional)
If the runner asks a contact to listen for news over a few hours:
- GM rolls the contact’s appropriate Etiquette at **+2 dice** vs the TN for the information sought (GM sets).
- If the contact rolls **1+** successes, they report back in about **2D6 hours** (or at a time set by the GM).

### Build/Repair skills (B/R)
Build/Repair tasks mostly care about time.

- Divide the base time by the number of successes to determine the actual time required.
- To estimate build time in hours: take the price of a comparable item and divide by:
  - **10** for armed-combat type items
  - **20** for vehicles
  - **50** for electronics/cyberware/other technical gear
- Base TN guideline:
  - Ordinary/everyday equipment: **TN 4**
  - Fancy/technical gear: **TN 6**
  - Exotics: **TN 8+**

| Situation | TN modifier |
| --- | ---: |
| Bad working conditions | +2 |
| Terrible working conditions | +4 |
| Superior working conditions | –1 |
| Tools unavailable | Usually not allowed |
| Tools inadequate | +2 |
| Reference material available | –1 |
| Working from memory | +(5 – Intelligence) |

### Concentrations and Specializations
See `## Creating a Character` → `#### Concentrations and Specializations (optional)` for the character-generation rules.

### Skill List (system)
- **Aircraft B/R**
- **Armed Combat** — Concentrations: Clubs (*weapon); Edged weapons (*weapon); Pole Arms / Staff (*weapon); Whips/Flails (*weapon)
- **Armed Combat B/R**
- **Artistic Expression** — Concentrations: Painting (Spray, Oil, Watercolor); Sculpting; Drawing (Anime, Comic); Writing (Horror, Comedy, Screenplay); Photography (Digital, Film)
- **Athletics** — Concentrations: Climbing; Jumping; Lifting; Running; Swimming; Football (Passing); Baseball; Urban Brawl; Combat Biking (Flagsnagging)
- **Bike** — Concentrations: Racing (*vehicle); Two-wheeler (*vehicle); Three-wheeler (*vehicle)
- **Biology** — Concentrations: Botany; Medicine; Parabotany; Parazoology; Zoology
- **Biotech** — Concentrations: Extended care; First aid; Organ culture (*organ/limb); Replacement construction (*organ/limb); Transimplant surgery (Headware, Bodyware, Organic replacements)
- **Biotech B/R**
- **Boats B/R**
- **Car** — Concentrations: Passenger vehicle (*vehicle); Racing (*vehicle); Remote operation (*category); Truck (*vehicle)
- **Channel: Access** — Concentrations: Crash; Decrypt; Disinfect; Deception; Scanner
- **Channel: Control** — Concentrations: Analyze; Crash; Camo; Commlink; Deception; Disinfect; Mirrors; Validate; Scanner
- **Channel: Files** — Concentrations: Commlink; Crash; Decrypt; Disinfect; Read/Write; Scanner
- **Channel: Index** — Concentrations: Analyze; Browse; Crash; Disinfect; Evaluate; Scanner
- **Channel: Slave** — Concentrations: Spoof; Crash; Decrypt; Disinfect; Scanner
- **Computer** — Concentrations: Hardware (Mainframes, Micros, Interface tech, Implant tech); Software (Decking, Matrix programming, Non-matrix programming, Interface programming, Implant programming)
- **Computer B/R**
- **Computer theory** — Concentrations: Hardware (Mainframes, Micros, Matrix programming, Interface tech, Implant tech); Matrix Theory; Software (Decking, Matrix programming, Non-matrix programming, Interface programming, Implant programming)
- **Conjuring** — Concentrations: Banishing (*type); Controlling (*type); Elemental (*type); Nature spirit (*type)
- **Cybertechnology** — Concentrations: Bodyware (*device); Headware (*device)
- **Dancing** — Concentrations: Ballet (*specific dance); Modern (*specific dance); Ballroom (*specific dance); Native American (*specific dance)
- **Demolitions** — Concentrations: Conventional Explosives; Plastic Explosives
- **Electronic Music**
- **Electronics** — Concentrations: Control systems; Diagnostic; Electronic warfare; Linking between devices; Maglocks
- **Electronics B/R**
- **Enchanting** — Concentrations: Alchemy; Talismongering (*type)
- **Etiquette: Art** — Requires a Concentration
- **Etiquette: Corporate** — Requires a Concentration
- **Etiquette: Elven** — Requires a Concentration
- **Etiquette: Magical** — Requires a Concentration
- **Etiquette: Matrix** — Requires a Concentration
- **Etiquette: Media** — Requires a Concentration
- **Etiquette: Mercenary** — Requires a Concentration
- **Etiquette: Street** — Requires a Concentration
- **Etiquette: Tribal** — Requires a Concentration
- **Firearms** — Concentrations: Grenade launchers (*weapon); LMG (*weapon); Pistols (*weapon); Rifles (*weapon); SMG (*weapon); Tasers (*weapon)
- **Firearms B/R**
- **Ground vehicles B/R**
- **Gunnery** — Concentrations: Assault Cannon (*weapon); Machine Guns (*weapon); Missile Launchers (*weapon); Vehicle Cannons (*weapon)
- **Gunnery B/R**
- **Horseback Riding**
- **Hovecraft** — Concentrations: Passenger craft (*vehicle); Racing (*vehicle); Remote operation (*category); Transport craft (*vehicle)
- **Interrogation** — Concentrations: Machine-aided (Lie detectors, Voice stress analysis); Verbal; Interviewing (Trideo Interviewing)
- **Language**
- **Leadership** — Concentrations: Commercial (Strategy, Tactics, Morale); Military (Strategy, Tactics, Morale); Political (Strategy, Tactics, Morale); Negotiation (Bargain, Bribe, Fast Talk); Reporting
- **Magical theory** — Concentrations: Design (Shamanic, Hermetic); History (*continent)
- **Military theory** — Concentrations: Military history (*continent/period); Tactics (Air, Land, Sea)
- **Motorboat** — Concentrations: Pleasure craft (*vehicle); Racing (*vehicle); Remote operation (*category); Transport (*vehicle)
- **Musical Composition**
- **Musical Instrument** — Concentrations: Acoustic (*instrument); Electric (*instrument); Synthesizer (*instrument)
- **Musical Production**
- **Negotiation** — Concentrations: Bargain; Bribe; Fast Talk
- **Physical sciences** — Concentrations: Chemistry; Engineering; Geology; Physics
- **Police Procedures** — Concentrations: Find Contraband; Bureaucracy; Laws and Statutes
- **Portacam**
- **Projectile Weapons** — Concentrations: Bows (*weapon); Crossbows (*weapon)
- **Projectile Weapons B/R**
- **Psychology** — Concentrations: Deviant behavior; Group behavior; Individual behavior
- **Rotor craft** — Concentrations: Fixed-rotor (*vehicle); Remote operation (*category); Tilt-rotor (*vehicle)
- **Sailboat** — Concentrations: Pleasure craft (*vehicle); Racing (*vehicle); Transport (*vehicle)
- **Singing** — Concentrations: Chant (Gregorian Chant, Native American Chant); Rock (Metal, Thrash); Blues; Classical; Pop
- **Sociology** — Concentrations: Anthropology; Archaelogy; History
- **Sorcery** — Concentrations: Astral Sorcery (*aspect); Combat Spells (*technique); Detection Spells (*technique); Forensic Magic; Health Spells (*technique); Illusion Spells (*technique); Manipulation Spells (*technique); Ritual Sorcery (category); Spellcasting (*spell category); Spell Defense (*spell category)
- **Stealth** — Concentrations: Farmland (*aspect); Urban (*aspect); Wilderness (*aspect)
- **Throwing Weapons** — Concentrations: Aerodynamic (Shuriken, Airfoil grenades); Non-aerodynamic (Grenades, Knives); Shafted (*weapon)
- **Throwings Weapons B/R**
- **Unarmed combat** — Concentrations: Cyber Implant Weaponry (*weapon); Martial Arts Style (*style); Subduing Combat
- **Vectored thrust** — Concentrations: LAV craft (*vehicle); Remote operation (*category); VTOL (*vehicle)
- **Winged planes** — Concentrations: Gliders (*vehicle); Jets (*vehicle); Propellers (*vehicle); Racing (*vehicle); Remote operation (*category)

## Combat

This section is a clean, table-first reference. Flavor and long examples are removed.

### Combat Turn (overview)
- A Combat Turn is ~3 seconds.
- Combat is resolved in Combat Turns, subdivided into Combat Phases based on Initiative.
- At the start of an encounter (first Combat Turn), Dice Pools are available at full value.

### Combat Turn Sequence (quick)
1. Determine Initiative for everyone involved.
2. Act in Initiative order; after acting, Initiative decreases and additional actions may occur in later phases (per Initiative rules).
3. End the Combat Turn; apply end-of-turn effects and continue if combat continues.

### Initiative (quick)
- Initiative is based on Reaction plus Initiative dice (source depends on cyberware/adept powers/etc.).
- Higher Initiative acts first; ties are resolved by Reaction or a roll-off (GM discretion).

### Initiative and actions (details)

#### Initiative dice and Reaction
- Base Initiative is **1D6**; cyberware/magic can add extra Initiative dice.
- Base Reaction = floor((Quickness + Intelligence) / 2); apply bonuses/penalties (cyberware, magic, wounds, etc.).
- Special cases:
  - **Matrix**: only deck **Response Increase** affects Reaction/Initiative (other bonuses don’t apply, except wounds).
  - **Rigging**: only the Vehicle Control Rig affects Reaction/Initiative while jumped in (other bonuses don’t apply, except wounds).

#### Initiative total and Combat Phases
- Roll Initiative dice and add **adjusted Reaction** to get the **Initiative total**.
- A Combat Turn has Combat Phases from the highest Initiative total down to **1** (Phase 0 ends the turn).
- A character’s first action occurs on the Combat Phase equal to their Initiative total.

#### Multiple actions
- After acting, a character becomes eligible for another action every **10 Combat Phases** later (Initiative total –10, –20, etc.), as long as the result is > 0.

#### Initiative ties and declaration order
- If Initiative totals tie: higher **adjusted Reaction** wins; if still tied, higher **natural Reaction**; if still tied, treat as simultaneous.
- When multiple characters act in the same Combat Phase:
  - **Declare** actions from slowest to fastest (lowest to highest tie-break value).
  - **Resolve** actions from fastest to slowest.

#### Delaying actions (optional)
- A character may delay an eligible action to a later Combat Phase (requires a Free Action to initiate).
- While delaying, the character can generally do nothing except Free Actions.
- To act, the player declares intervention during the **Declare Actions** step of the later Combat Phase, after other actors in that phase have declared. If resolution has started, it’s too late to intervene.
- Delayed actions resolve before the normal actions of that Combat Phase; if multiple delayed characters act, use Initiative tie rules.
- After resolving the delayed action, subtract **10** from the character’s Initiative total as normal to determine additional actions.
- If still delayed at the end of a Combat Turn, the delay carries over to the next Combat Turn (you may act during any later phase even if it occurs before your new Initiative total).

### Action economy (Free / Simple / Complex)
- On your action in a Combat Phase, you can take:
  - **1 Free Action**, and
  - either **2 Simple Actions** or **1 Complex Action**.
- A character may take **one** Free Action in any Combat Phase, even if they are not eligible to act in that phase (but generally not before their first action unless they carried over a delayed action).

### Actions (reference)

This is a practical list of common actions and their mechanical hooks. The gamemaster can always adjudicate unusual actions as Simple vs Complex.

#### Free Actions (common)
- **Activate cyberware** that isn’t always-on (headware radio, thermo, etc.).
- **Call a shot** (must be immediately followed by Take Aim / Fire Weapon / Throw Weapon / Melee Unarmed Attack; see `#### Called shots`).
- **Change smartgun fire mode** (requires smartlink + smartgun).
- **Delay action** (initiate a delayed action; only in a phase where you’re eligible to act).
- **Drop prone** (not while surprised). If sustaining spells, make a **Willpower (2)** test to keep concentration.
- **Drop object** (you can drop what’s in both hands with one Free Action).
- **Drop a sustained spell**.
- **Eject smartgun clip** (smartlink + smartgun; still takes a Simple Action to insert a new clip).
- **Gesture** (one clear gesture).
- **Observe** (only what’s immediately obvious; no Perception Test).
- **Speak** (tabletop practicality; GM can enforce “one word = one Free Action” if needed).

#### Simple Actions (common)
- **Change gun mode** (smartguns can do this as a Free Action).
- **Change position** (stand up / go prone). Standing while wounded requires a **Willpower (2)** test.
- **Command a spirit** (if you have one under control).
- **Fire weapon** (single-shot / semi-auto / burst-fire) or **throw a weapon**.
- **Insert clip** / **remove clip**.
- **Observe in detail** (Perception Test).
- **Pick up / put down object**.
- **Quick draw** (Reaction test; see `#### Quick draw`).
- **Ready weapon** (draw, pick up, nock arrow, etc.). You can ready up to **floor(Quickness / 2)** small throwing weapons per action.
- **Shift perception** (astral perception on/off).
- **Take Aim** (see `#### Take Aim`).
- **Use simple object** (push button, open an unlocked door, etc.).

#### Complex Actions (common)
- **Astral projection**.
- **Cast spell**.
- **Melee/unarmed attack** (can attack multiple melee targets; see `#### Multiple targets (melee)`).
- **Fire automatic weapon** (full-auto).
- **Fire mounted/vehicle weapon**.
- **Reload firearm** (for weapons that don’t use removable clips; see `#### Reloading firearms`).
- **Summon nature spirit**.
- **Use complex object** (decking, driving, detailed operation; can’t be done while running).
- **Use skill** (general case).

### Dice Pools (details)
- Pool dice are bonus dice you add to a test; once spent, they’re unavailable until the pool refreshes.
- Refresh timing:
  - At the start of each character’s **action**, their pools refresh to full.
  - Unused pool dice do not carry from one action to the next.
  - Pool dice left at the end of a Combat Turn can still be used in early phases of the next Combat Turn, but are lost on that character’s first action of the new turn.
- Delayed actions:
  - Pools refresh in the Combat Phase where the delay is initiated.
  - Pools do **not** refresh again when the delayed action finally triggers.
  - Spending any Pool dice during the delay breaks the delay.

#### Combat Pool
- Used to augment offensive/defensive combat tests (Firearms, melee, gunnery, etc.) and Damage Resistance tests.
- Combat Pool = floor((Quickness + Intelligence + Willpower) / 2).
- Limits:
  - Max dice you can add to an **offensive** combat Success Test = the rating of the skill being used.
  - No limit on dice added to a defensive Damage Resistance test.
- Armor impact:
  - Partial/full heavy armor reduces Combat Pool by 1 die for each point of **Ballistic** armor that exceeds the wearer’s **Quickness**.
- Clean miss edge case:
  - If the defender’s Combat Pool successes alone exceed the attacker’s successes, the attack is a complete miss.
- Magic edge case:
  - Combat Pool can only help resist magic in the case of **damaging manipulation spells** (it augments the Damage Resistance Test).

#### Control Pool
- Used by riggers to augment vehicle-control tests (driving/piloting, position tests, etc.).
- Control Pool = **Reaction**, modified only by the Vehicle Control Rig.
- Only characters with a Vehicle Control Rig have a Control Pool.
- Max dice you can add to a control-related test = the base dice in that test (typically the controlling skill rating).

#### Hacking Pool
- Used by deckers to augment Matrix tests (utility tests and MPCP resistance in Matrix combat).
- Hacking Pool = **Computer skill** (or appropriate concentration/specialization) + **Reaction**.
  - Only deck Response Increase bonuses apply; other initiative/reaction boosters generally don’t.
- Cannot be used to augment defensive utility programs.
- Max dice you can add to a program test = the base dice in use (usually the program’s rating).
- Max dice you can add to MPCP Resistance = the MPCP rating.
- Only characters with a cyberdeck have a Hacking Pool.

#### Magic Pool
- Used to augment spellcasting tests (Spell Success, Drain Resistance, Spell Defense allocation, ritual sorcery).
- Magic Pool = **Sorcery skill** (or concentration/specialization) + applicable **power foci** dice, plus conditional totem modifiers.
- Cannot be used to augment Conjuring-related tests.
- Limits:
  - Max dice you can add to a Spell Success Test = your **Magic Attribute**.
  - No limit on dice used for Drain Resistance (subject to allocation timing).
- Allocation timing:
  - Allocate Magic Pool dice immediately after Declare Actions (for that Action Phase).

### Movement
- You may move during a Combat Phase in addition to taking Free/Simple/Complex Actions.
- Two movement modes: walking or running (or stay still).
- If you have multiple actions in a Combat Turn, you can only **run** in one of those Combat Phases (choose which).

#### Walking
- Move up to **Quickness meters** per Combat Phase.
- If walking while also making a test that phase: **+1 TN**.
- If walking over rough/difficult ground while making a test: **+2 TN**.

#### Running
- Move **Quickness × running modifier** meters per Combat Phase:
  - Human/Elf/Ork: ×3
  - Dwarf/Troll: ×2
- Any tests while running: **+4 TN**.
- If the character has Running skill, they may spend a **Complex Action** to push distance:
  - Running test vs TN **4**; each success increases effective Quickness by **+1** for that Combat Phase (for running distance).

### Interception
- If movement takes you within **1 meter** of an opponent and you attempt to pass without attacking, that opponent may make a free melee attack.
  - If the interceptor has no ready weapon, they attack **unarmed**.
  - Base TN is **4**; apply reach, movement, and injury modifiers. Combat Pool may be used.
  - The moving character is assumed to be in **Full Defense** (see `#### Full Defense (optional)`).
- If the moving character takes any damage, their movement ends (they’re intercepted).

### Attacks (quick procedure)
- **Ranged combat**: determine range (base TN), apply modifiers, attacker Success Test (skill + Combat Pool), target Damage Resistance Test (Body + Combat Pool vs TN **Power – armor**), compare successes to stage up/down (tie = base; clean miss if target’s Combat Pool successes exceed attacker successes), apply staged damage.
- **Melee combat**: attacker and defender both roll combat skill + Combat Pool vs TN **4** (modified), compare successes (tie attacker), stage damage up per 2 net successes, defender resists with Body vs TN **(Strength + weapon modifier – Impact armor)**, stage down per 2 successes.

### Surprise
- Surprise is resolved per opponent: you can be surprised by one ambusher but not another.
- Everyone makes a **Reaction Test** vs TN **4**.
  - Ambushers with delayed actions (lying in wait) typically get **–2 TN**.
  - Apply situational modifiers (camouflage, terrain, etc.) as needed.
- Compare successes per character pair:
  - If you do **not** have more successes than a given opponent, you can’t take actions that directly affect or counter that opponent.
  - If you have more successes than a given opponent, you can act normally against them.
- If you fail to beat **all** opponents, you’re completely surprised: you can’t act (including Free Actions) for **10 Combat Phases**.
- Spells/programs/IC are never surprised.

### Ranged Combat (details)

#### Range and base TN
- Short range TN **4**, Medium **5**, Long **6**, Extreme **9**.
- Use the weapon’s range bands (see table below) to determine which range category you’re in.
- Some weapons (notably grenade/missile launchers) have minimum ranges.

#### Weapon Range Table (book)
All distances are in meters.

**Firearms**
| Weapon type | Short (TN 4) | Medium (TN 5) | Long (TN 6) | Extreme (TN 9) |
| --- | --- | --- | --- | --- |
| Hold-out pistol | 0–5 | 6–15 | 16–30 | 31–50 |
| Light pistol | 0–5 | 6–15 | 16–30 | 31–50 |
| Heavy pistol | 0–5 | 6–20 | 21–40 | 41–60 |
| SMG | 0–10 | 11–40 | 41–80 | 81–150 |
| Taser | 0–5 | 6–10 | 11–12 | 13–15 |
| Shotgun | 0–10 | 11–20 | 21–50 | 51–100 |
| Sporting rifle | 0–30 | 31–60 | 61–150 | 151–300 |
| Sniper rifle | 0–40 | 41–80 | 81–200 | 201–400 |
| Assault rifle | 0–15 | 16–40 | 41–100 | 101–250 |
| LMG | 0–20 | 21–40 | 41–80 | 81–150 |

**Heavy weapons**
| Weapon type | Short (TN 4) | Medium (TN 5) | Long (TN 6) | Extreme (TN 9) |
| --- | --- | --- | --- | --- |
| Medium machine gun | 0–40 | 41–150 | 151–300 | 301–500 |
| Heavy machine gun | 0–40 | 41–150 | 151–400 | 401–800 |
| Assault cannon | 0–50 | 51–150 | 151–450 | 451–1,300 |
| Grenade launcher* | 5–50 | 51–100 | 101–150 | 151–300 |
| Missile launcher* | 20–70 | 71–150 | 151–450 | 451–1,500 |

**Impact projectiles**
For impact projectiles, the listed `Str` value is the **Strength Minimum** of the weapon (bows/crossbows), used to determine range. (Throwing weapons use the thrower’s Strength instead.) Interpret these like firearms: each range band begins **1 meter past** the prior band’s maximum (e.g., `Str = 5` → short `0–5`, medium `6–50`, long `51–150`, extreme `151–300`).

| Weapon type | Short (TN 4) | Medium (TN 5) | Long (TN 6) | Extreme (TN 9) |
| --- | --- | --- | --- | --- |
| Bow | 0–Str | to (Str × 10) | to (Str × 30) | to (Str × 60) |
| Light crossbow | 0–(Str × 2) | to (Str × 8) | to (Str × 20) | to (Str × 40) |
| Medium crossbow | 0–(Str × 3) | to (Str × 12) | to (Str × 30) | to (Str × 50) |
| Heavy crossbow | 0–(Str × 5) | to (Str × 15) | to (Str × 40) | to (Str × 60) |
| Thrown knife | 0–Str | to (Str × 2) | to (Str × 3) | to (Str × 5) |
| Shuriken | 0–Str | to (Str × 2) | to (Str × 5) | to (Str × 7) |

*Minimum ranges: grenade and missile launchers can’t be fired at targets closer than their minimum short-range distance.

#### Common target-number modifiers
| Situation | TN modifier |
| --- | ---: |
| Semi-auto recoil (second shot in phase) | +1 |
| Burst-fire recoil (per burst in phase) | +3 |
| Full-auto recoil (per round fired in phase) | +1 |
| Heavy weapon recoil (MMG/HMG/shotguns) | 2× uncompensated recoil |
| Blind fire (target not visible) | +8 |
| Partial cover | +4 |
| Visibility impaired | See Visibility table |
| Multiple targets (per extra target in phase) | +2 |
| Target running | +2 |
| Target stationary | –1 |
| Attacker engaged in melee (per opponent) | +2 |
| Attacker running | +4 |
| Attacker running (difficult ground) | +6 |
| Attacker walking | +1 |
| Attacker walking (difficult ground) | +2 |
| Attacker wounded | See Injury modifiers |
| Smartlink + smartgun | –2 |
| Smart goggles + smartgun | –1 |
| Laser sight (effective to ~50m; negated by smoke/fog/rain/mist) | –1 |
| Using a second firearm (dual pistols/SMGs) | +2 each |
| Aiming (per Simple Action spent aiming) | –1 |

Notes:
- Dual-wielding also negates smartlink/smart-goggle/laser bonuses, and uncompensated recoil from either weapon applies to both.
- Image magnification systems reduce effective range category by their rating (to a minimum of short range).
- Recoil compensation reduces recoil (–1 per point of compensation). Gyro stabilization reduces recoil and movement modifiers (–1 per point).

#### Visibility modifiers
If a modifier is shown as `cyber/natural`, use the first value for cyber/electronic vision and the second for natural metahuman vision.

| Condition | Normal | Low-light | Thermographic |
| --- | ---: | ---: | ---: |
| Full darkness | +8 | +8/+8 | +4/+2 |
| Minimal light | +6 | +4/+2 | +4/+2 |
| Partial light | +2 | +1/0 | +2/+1 |
| Glare | +2 | +4/+2 | +4/+2 |
| Mist | +2 | +2/0 | 0 |
| Light smoke/fog/rain | +4 | +4/+2 | 0 |
| Heavy smoke/fog/rain | +6 | +6/+4 | +1/0 |
| Thermal smoke | As smoke | As smoke | As normal |

#### Take Aim (aimed shot)
- **Take Aim** is a **Simple Action** with a ready ranged weapon (firearm, bow, throwing weapon).
- Each Take Aim action reduces the base TN by **–1** (cumulative).
- You lose all accumulated Take Aim benefits if you take **any other action**, including a **Free Action**.
- Take Aim may be extended across Combat Phases and Combat Turns.
- Maximum sequential Take Aim actions = **floor(weapon skill / 2)**.
- While aiming across multiple phases/turns, you can’t use **any Dice Pool dice** for any reason without losing the aim benefit.

#### Called shots
Calling a shot means aiming at a vulnerable sub-target (head, tires, windows, etc.). The GM decides if the sub-target is reasonably accessible.

- Calling a shot is a **Free Action** and must immediately be followed by the attack.
- Applies **+4 TN** to the attack.
- Choose one of:
  - **Increase Damage Level by 1** (L→M→S→D max), or
  - **Hit a specific sub-target** on something vehicle-sized or larger (tires/windows/etc.). Resolve normal damage against that sub-target; use appropriate **Barrier Ratings** for things like tires/windows.
- Firearms restriction: only **SS/SA/BF** attacks can be called shots (no full-auto called shots).
- You can Take Aim first and still call the shot at the time of the attack.
- Melee weapons can also call shots (same +4 TN and effect options).

#### Quick draw
- **Quick draw** is a **Simple Action** that attempts to draw a pistol-sized weapon and immediately fire it.
- Eligible weapons: pistols/pistol-sized weapons (typically **Concealability 4+**) that can be fired with a **Simple Action**.
- Make a **Reaction (4)** test:
  - **1+** successes: draw the weapon and fire normally this Combat Phase.
  - 0 successes: you fail to clear the weapon and cannot fire it this Combat Phase.
  - If the weapon is not in a proper holster, apply **+2 TN** to this test.
- Two weapons can be quick-drawn and fired, but apply an additional **+2 TN** to each Reaction test (in addition to normal dual-weapon firing modifiers).

#### Fire modes (firearms)
Firearms may have one or more fire modes: single-shot (SS), semi-auto (SA), burst-fire (BF), full-auto (FA).

- **Single-shot (SS)**: fire once per Combat Phase. **Simple Action**. Cannot fire again that phase.
- **Semi-auto (SA)**:
  - Up to **2 shots** per Combat Phase; each shot is a **Simple Action** with its own Success Test and Combat Pool allocation.
  - The **second shot** in the same phase takes **+1 recoil** (often countered by recoil compensation).
  - If shooting two targets in the same phase, the second target is **+2 TN** (multiple targets).
- **Burst-fire (BF)**:
  - Each burst is **3 rounds** and is a **Simple Action** (so up to 2 bursts per phase).
  - Recoil: **+3 per burst** fired that Combat Phase (cumulative per burst).
  - Damage change: treat the weapon as **Power +3** and **Damage Level +1** for that burst.
  - Short bursts (ammo shortage):
    - **2-round burst**: **Power +2**, **no Damage Level increase**, recoil **+2**.
    - **1-round burst**: resolve as a single-shot attack.
  - Multiple targets: second target in the phase is **+2 TN** (and so on).
- **Full-auto (FA)**:
  - **Complex Action**.
  - Declare how many rounds are fired in each “full-auto burst” at each target. Each burst must fire a minimum of **3** rounds.
    - Each full-auto burst is resolved with its own Success Test and Combat Pool allocation.
    - If ammo shortage produces a **2-round** or **1-round** burst, treat it as a burst-fire short burst (2 rounds) or a single-shot attack (1 round).
  - Recoil: **+1 per round fired that Combat Phase** (cumulative across all bursts/targets that phase, including any “wasted” rounds).
  - Damage change: **Power +1 per round**, and **Damage Level +1 per 3 full rounds** (max Damage Level D).
  - Multiple targets: to “walk” fire between targets, waste **1 round per meter** between targets (smartguns never waste rounds), and apply **+2 TN** per additional target engaged that phase.
    - Optional: stray shots from walked fire can hit bystanders. For each potential target in the line of fire, roll **2 dice** vs TN **4/5/6/9** (short/medium/long/extreme). On success, resolve a hit normally, but grant the attacker **+1D6** extra successes. If multiple potential targets exist, randomize their order. Smartguns never produce stray rounds.
- **Heavy weapons recoil**: double uncompensated recoil for **MMG/HMG/shotguns**.

#### Ammunition (common)
- **Flechette rounds**
  - Against **unarmored** targets: increase Damage Level by **+1** (e.g., 9M → 9S).
  - Against **armored** targets: for Armor Rating use **max( Ballistic, 2×Impact )**; also **double** Barrier Ratings and vehicle armor.
  - Dermal armor negates the Damage Level increase vs unarmored targets (it still adds to Body as normal).
- **Explosive rounds**
  - Increase Power by **+1**.
  - Firing through barriers: use **2×** the barrier rating to penetrate, but the barrier takes damage as if it had **1/2** its normal Barrier Rating.
  - Misfire: if all Attack Test dice are **1s**, the round misfires regardless of success/failure. The shooter takes one “attack” equal to the weapon’s normal Damage Code (ignore explosive adjustments), cannot use Combat Pool, and the number of attacker successes is **1D6**. The original attack misses.
- **Gel (stun) rounds**
  - **Power –2**, same Damage Level, but damage is **Stun** (not Physical).
  - Use **Impact** armor (not Ballistic).
  - Knockdown: when resisting knockdown from gel rounds, use a knockdown TN equal to the gel round’s **Power** (not half Power).

#### Reloading firearms
Reload time depends on the reload system on the firearm’s ammo notation:
- **(c) Removable clip**: remove clip **1 Simple Action**, insert clip **1 Simple Action**. Reload loose rounds into a clip: **Complex Action**, up to **Quickness** rounds.
- **(b) Break action**: **Complex Action** to insert **2** rounds.
- **(m) Internal magazine**: **Complex Action** to insert **Quickness** rounds.
- **(cy) Cylinder**: **Complex Action** to insert **Quickness** rounds.
  - Speed loader: load a full cylinder in **1 Complex Action**. Reload the speed loader at the same rate as the weapon.
- **(belt) Belt feed**: insert belt in **1 Complex Action**. Reload a belt at **floor(Quickness / 2)** rounds per **Complex Action**.

#### Shotguns (shot rounds and choke)
Shotguns normally fire slugs. If loaded with shot rounds:
- Apply **flechette** ammunition rules to the weapon’s Damage Code.
- The user sets the shotgun **choke** from **2 to 10**, controlling spread:
  - For every number of meters equal to the choke setting that the shot travels, the spread increases **1 meter** to either side of the center line.
  - Each time spread increases: **Power –1** and attacker TN **–1**.
  - When Power reaches **0**, the shot is ineffective.
- Everything inside the spread is a valid target. Roll the attacker’s Success Test once, then each target makes its own Resistance Test against the same attacker successes.
  - Each target gains **+1 extra die** on its Resistance Test per other target in the spread **in front of it** (between it and the shooter).
- Smart shotguns: for +10% cost, choke can be cybernetically adjusted. With shot rounds, smartlinks give only **–1**, and smart goggles/laser sights give **no** TN reduction.

#### Projectile weapons (bows/crossbows/throwing)
- Use the normal ranged combat procedure.
- **Strength Minimum**:
  - Bows: if Strength is below the bow’s Strength Minimum, apply **+1 TN per point** below minimum. The Strength Minimum determines range and damage.
  - Crossbows: if Strength is below the crossbow’s Strength Minimum, add **one extra Ready Weapon action to reload** per point below minimum. The Strength Minimum determines range.
- Throwing weapons: no Strength Minimum; use the thrower’s **Strength** to determine range and damage.

#### Attack and damage resolution (ranged)
1. Attacker rolls **Ranged Combat skill + Combat Pool dice** vs the final TN; successes = hits.
2. Defender rolls **Body + Combat Pool dice** vs TN **(weapon Power – armor)** (minimum TN **2**).
   - Typically use **Ballistic** armor vs firearms/projectiles and **Impact** armor vs melee/blunt impacts (GM adjudication for edge cases).
3. Compare successes:
   - Attacker stages damage **up** 1 level per **2** net successes.
   - Defender stages damage **down** 1 level per **2** net successes.
   - If the defender’s Combat Pool successes alone exceed the attacker’s successes, the attack is a clean miss.
4. Apply the final staged Damage Level to the Condition Monitor.

#### Stopping and knockdown (ranged hits)
- After taking damage from a ranged attack, make a **Body Test** vs TN **floor(Power / 2)**.
- Threshold = **half the Damage Level**, rounding normally:
  - Light → 1
  - Moderate → 2
  - Serious → 3
- Outcomes:
  - If successes exceed the threshold: no effect.
  - If 1+ successes but not enough: the character staggers **1 meter** away from the direction of the attack.
  - If 0 successes: the character falls **prone**.
- A **Deadly** wound always knocks the character down.

### Grenades and explosives

Grenade attacks are a two-step process:
1. Determine where the grenade detonates (hit + scatter).
2. Resolve the blast effect from the blast point.

#### Grenade range table (base TNs and scatter dice)
Use the target’s distance (meters) and the grenade type.

| Grenade type | Short (TN 4) | Medium (TN 5) | Long (TN 8) | Extreme (TN 9) | Scatter |
| --- | --- | --- | --- | --- | --- |
| Standard | 0–(Strength × 3) | (Strength × 3)–(Strength × 5) | (Strength × 5)–(Strength × 10) | (Strength × 10)–(Strength × 20) | 1D6 m |
| Aerodynamic | 0–(Strength × 3) | (Strength × 3)–(Strength × 5) | (Strength × 5)–(Strength × 20) | (Strength × 20)–(Strength × 30) | 2D6 m |
| Grenade launcher | 5–50 | 51–100 | 101–150 | 151–300 | 3D6 m |

Notes:
- Range TNs are the base; apply normal ranged-combat modifiers (visibility, cover, movement, wounds, etc.).
- Grenade launchers have a **5 m minimum arming range**: the grenade does not detonate if it hits something before traveling ~5 meters (safety feature).

#### Step 1: Hit test
- Roll the attacker’s appropriate **combat skill** vs the base TN from the range table.
  - Thrown grenades typically use **Throwing Weapons**.
  - Launched grenades typically use **Firearms** (grenade launcher).
- Combat Pool dice may be applied.
- Record the number of successes (used later for blast staging).

#### Step 2: Scatter
Even a “hit” grenade can scatter; successes reduce scatter distance.

1. **Direction**: roll **1D6** on the scatter diagram (relative to the direction of the throw):
   - `1` = forward (over-throw, beyond target)
   - `4` = back (short, toward attacker)
   - `2/3/5/6` = intermediate directions (GM uses the diagram)
2. **Distance**: roll the scatter dice from the range table.
3. **Reduce** scatter distance by the Hit Test successes:
   - Standard grenades: **–2 m per success**
   - Aerodynamic grenades and grenade launchers: **–4 m per success**
4. If scatter distance is reduced to **0 or less**, the grenade detonates at the target; otherwise it detonates at the remaining distance in the indicated direction.

#### Blast damage (power reduction by distance)
For offensive/defensive/concussion grenades, use these default blast reduction rates:

| Type | Base damage | Power reduction |
| --- | --- | --- |
| Offensive | 10S | –1 per meter |
| Defensive | 10S | –1 per 0.5 m |
| Concussion | 12M (Stun) | –1 per meter |

For other grenade types, use their listed Damage Code and apply the closest matching reduction rate (GM adjudication).

#### Blast resolution
1. Determine the target’s distance from the blast point.
2. Reduce the blast **Power** by distance using the reduction rate above.
3. **Blast resistance**: target rolls **Body** vs TN **(adjusted Power – Impact armor)** (minimum TN **2**).
   - Combat Pool dice may be used to augment this test.
4. Compare successes:
   - If the attacker’s Hit Test successes exceed the target’s resistance successes, stage blast damage **up** 1 level per **2** net successes.
   - If the target’s resistance successes exceed the attacker’s Hit Test successes, stage blast damage **down** 1 level per **2** net successes.

#### Blast against barriers
When a blast hits a barrier (wall/door/etc.):
- Compare remaining blast Power (after distance reduction) against **2× the barrier’s Barrier Rating**.
- Determine barrier effects using the Barrier Effect rules in `### Barriers` below.
  - If the barrier falls, the blast continues past it, but reduce the blast Power by the barrier’s original Barrier Rating.
  - If the barrier holds, the blast may be channeled in confined spaces (see below).

#### Blast in confined spaces (“chunky salsa”)
If grenades detonate in confined spaces (rooms, hallways):
- First determine whether the surrounding barriers hold (Blast against Barriers).
- If barriers hold, the blast wave can reflect back; if the same character is struck more than once, the effective Power can become the **sum** of the waves that hit them (GM adjudication).

#### Demolitions (placed charges)
If Demolitions is used to place explosives:
- Treat the barrier as having its normal Barrier Rating (not doubled).
- Make a **Demolitions Test** vs TN **2**; successes add to the effective Power of the explosives.

### Missile launchers (rockets and missiles)
Missile launchers fire both rockets (dumb) and missiles (guided). Warheads are broadly similar to grenade blasts, but cover larger areas.

#### Rockets (dumb weapons)
- Rockets have no internal/external guidance; they go where pointed.
- Rocket fire is resolved like launched grenades (see `### Grenades and explosives`):
  - Use the missile launcher’s range band TN (short/medium/long/extreme).
  - Scatter is **2D6 meters** (use the scatter diagram for direction).
  - Reduce scatter like a launcher/aerodynamic projectile: **–4 m per Hit Test success**.

Rocket warheads:
- **High-explosive (HER)**: large-area blast; use grenade-style blast rules.
- **Anti-personnel (APR)**: fragmentation; treat the attack as **flechette** for armor/barrier/vehicle-armor interactions.
- **Anti-vehicle (AVR)**: shaped charge; barrier and vehicle armor effectiveness is reduced:
  - Barriers: use **half** Barrier Rating (round down).
  - Vehicles: use **half** vehicle Armor (round down).

#### Missiles (guided weapons)
Missiles follow the same warhead categories (HEM/APM/AVM) and their warhead rules match the equivalent rocket type.

Guidance effects:
- Add the missile’s **Intelligence rating** as extra dice to the attack Success Test (in addition to **Gunnery** dice and any Combat Pool dice).
- Against vehicles, the base TN becomes the vehicle’s **Signature rating** (regardless of range).
  - Add **+2 TN** when firing in cluttered urban environments (major city, industrial park, most non-residential sprawl areas).
- Scatter distance is further reduced by the missile’s **Intelligence rating** in meters (after other scatter reductions).

#### Rocket/Missile table (blast defaults)
| Type | Damage code | Power reduction | Scatter |
| --- | --- | --- | --- |
| HER / HEM | 16D | –1 per meter | 2D6 m |
| APR / APM | 16D | –1 per 0.5 m | 2D6 m |
| AVR / AVM | 16D | –8 per meter | 2D6 m |

### Barriers

#### Barrier Rating table (materials)
| Material | Barrier Rating |
| --- | ---: |
| Standard glass | 2 |
| Cheap material / regular tires | 3 |
| Average material / ballistic glass | 4 |
| Heavy material | 6 |
| Reinforced / armored glass | 8 |
| Structural material | 12 |
| Heavy structural material | 16 |
| Armored / reinforced material | 24 |
| Hardened material | 32 |

Notes:
- Standard doors use the Barrier Rating of their construction material.
- Security doors have **2×** the Barrier Rating of the material.
- Glass doors use the Barrier Rating of the glass.

#### Firing through a barrier (ranged)
- If the barrier is opaque and you can’t see the target: apply **+8 TN** (Blind Fire). If the barrier is transparent, this modifier does not apply.
- Resolve the attack normally, except the defender may subtract:
  - their appropriate armor rating, and
  - the barrier’s Barrier Rating
  from the Power of the attack.
- If the barrier’s Barrier Rating exceeds the Power of the attack, the attack cannot penetrate and is stopped (but may still damage the barrier).

#### Attacking through with melee (quick)
- Against blunt melee attacks (fists, clubs): barrier uses its normal rating.
- Against edged melee attacks (swords, etc.): barrier uses **2×** its normal rating.

#### Breaking through (making a hole / forcing a door)
Resolve similarly to Blast against Barriers, with a different “adjusted” Barrier Rating depending on the attack type.

Adjustments:
- Against firearm rounds and other ranged attacks: barrier uses **2×** its normal rating.
- Against melee attacks: barrier uses **2×** its normal rating.
- Against combat magic spells: barrier uses **2×** its normal rating.
- Against damaging manipulation spells: barrier uses its normal rating.

Always use the base Power of the attack (unmodified by burst/full auto) for comparisons against the Barrier Rating.

**Barrier Effect (breaking through)**
| Attack Power vs adjusted Barrier Rating | Effect |
| --- | --- |
| Power < 1/2 rating | No effect; minor cosmetic damage |
| 1/2 rating ≤ Power ≤ rating | Barrier damaged; reduce Barrier Rating by 1 |
| Power > rating | For every increment of (rating / 2) that Power exceeds the rating: open a 0.5 m hole and reduce Barrier Rating by 1 |

**Doors**
- A regular door breaks open when its Barrier Rating is reduced to **half**.
- A security door must be reduced to **0** to break open.

### Melee Combat (details)
- Both attacker and defender roll **combat skill + Combat Pool** vs base TN **4** (apply reach, visibility, wounds, and other modifiers).
- Highest successes hits; ties go to the attacker.
- Net successes stage damage **up** 1 level per **2** net successes.
- Damage Resistance: defender rolls **Body** vs TN **(attacker Strength + weapon modifier – Impact armor)**; every **2** successes stages damage down 1 level.
  - By default, Combat Pool is not used for melee damage resistance (see Full Defense below).

#### Melee modifiers (common)
| Situation | TN modifier |
| --- | ---: |
| Friends in the melee (advantage) | –1 per friend advantage (max –4) |
| Friends in the melee (disadvantage) | +1 per friend disadvantage (max +4) |
| Visibility impaired | Use Visibility Table at **half value** (round down), except Full Darkness |
| Wounded | Injury modifier |
| Weapon has longer reach | –1 per reach difference |
| Weapon has inferior reach | +1 per reach difference |
| Attacking multiple targets | +2 per additional target |
| Superior position | –1 |
| Opponent prone | –2 |

#### Multiple targets (melee)
- You can attack multiple melee opponents with one **Complex Action**.
- Each additional target after the first is **+2 TN** for that Combat Phase.
- Combat Pool dice are allocated separately for each attack.

#### Multiple opponents (“friends in the melee”)
- Count the number of participants within ~1 meter who are actually fighting in the same brawl on each side.
- Side with more “friends” gets **–1 TN per extra friend** (max –4); the side with fewer friends gets **+1 TN per extra enemy friend** (max +4).
- As people move away or drop out, update the counts.

#### Full Defense (optional)
When attacked, a character can choose to defend only themselves:
- They may not add Combat Pool dice to their melee skill test for that exchange, but may add Combat Pool dice to their melee **Damage Resistance Test**.
- A clean miss occurs if the defender’s **Combat Pool** successes alone exceed the attacker’s successes (regardless of other dice).

#### Knockback and knockdown (melee hits)
- After taking damage from a melee hit, make a **Body Test** vs TN **attacker Strength**.
- Threshold = **half the Damage Level**, rounding normally (L→1, M→2, S→3).
- Outcomes:
  - If successes exceed the threshold: no effect.
  - If 1+ successes but not enough: step directly backward **1 meter**.
    - If you can’t step back (wall/obstacle), you fight at **+2 TN** until you can move away.
  - If 0 successes: fall **prone**.

#### Subduing
Subduing is non-lethal control (not “beat them unconscious”):
- Declare subduing at the **start** of the fight (the initiator can switch back to normal fighting; doing so clears all subduing damage immediately).
- Apply **+2 TN** to subduing combat tests, and all damage inflicted must be **Stun**.
- When a character would reach the Unconscious level from subduing damage, they are **subdued** (not actually unconscious) and under the victor’s control.
- If control isn’t maintained, subduing damage fades at **1 box per minute**.
- To maintain control, the victor rolls **Unarmed Combat or Strength or Quickness** vs TN equal to the subdued character’s **lowest** of those three stats; each success restores **1** box of subduing damage.
  - The subdued character may oppose with the same rule, but with injury modifiers and an additional **+2 TN**.
- The victor can attempt this “maintenance” roll as often as desired.
- Only weapons that do **Stun** damage can be used to subdue.
- Not everyone in the same melee needs to be subduing, but subduing damage still applies injury modifiers normally.

#### Monofilament whip (special)
- If an attack misses solely because the defender’s Combat Pool successes exceed the attacker’s successes (possible only with Full Defense), the attacker risks being hit by the whip.
  - Make an **Armed Combat** test vs TN **6**. If it generates **no** successes, the attacker is hit by their own whip.
- The whip’s Damage Code is **10S**; the attacker resists with **Body + Combat Pool**, staging down 1 level per 2 successes.
- Use **Impact** armor, but halve its rating (round down). Double Barrier Ratings against a monowhip.

#### Shock weapons (tasers and stun batons)
- Resolve the hit using normal ranged/melee rules; damage is **Stun**.
- Additional disorientation: after a successful hit, the target is stunned for:
  - `Combat Turns = Power – floor(Impact armor / 2) – successes`
  - where successes are from a **Body or Willpower** test (use the higher attribute) vs TN **4**.
- While stunned, the target suffers an additional **+2 TN** to all tests.
- Use **Impact** armor, halved (round down), vs shock weapon damage resistance.

#### Reach
- If one combatant’s reach exceeds the other’s, the longer-reach combatant gets **–1 TN per point** of reach difference and the shorter-reach combatant gets **+1 TN per point**.
- Trolls have a natural **+1 Reach** (in addition to weapon reach).

### Damage and healing

#### Damage codes and staging
- Damage is expressed as **Power + Damage Level** (L/M/S/D).
- Staging:
  - +1 Damage Level per **2** net successes for the attacker.
  - –1 Damage Level per **2** successes for the defender’s resistance.
  - If damage is staged below **Light**, it becomes **no damage**.

#### Condition Monitor boxes per wound level
| Wound level | Boxes |
| --- | ---: |
| Light | 1 |
| Moderate | 3 |
| Serious | 6 |
| Deadly | 10 |

#### Overflow and death edge cases
- If **Stun** exceeds 10 boxes, excess carries into **Physical** and the character falls unconscious.
- If **Physical** exceeds 10 boxes:
  - Instant death occurs if damage exceeds **10 + Body**.
  - Otherwise the character is dying and needs prompt medical care (GM adjudication); without care, they typically take an extra Physical box about every 10 minutes.

#### Injury modifiers
| Damage level | TN modifier | Initiative modifier |
| --- | ---: | ---: |
| Light | +1 | –1 |
| Moderate | +2 | –2 |
| Serious | +3 | –3 |
| Deadly | Unconscious / near death | — |

Notes:
- Injury TN modifiers apply to most tests except damage resistance/avoidance.
- Initiative modifiers apply to Reaction before rolling initiative; if Reaction drops to 0 or less, the character can’t act that Combat Turn.

#### Healing overview
- **Stun**: recovery (not “healing”)
  - Recover by resting and rolling **Body or Willpower** (higher attribute) vs TN **2**, modified by current injury modifiers (Stun and/or Physical).
  - Base time to recover **1 box** of Stun is **60 minutes**. Actual time = `60 minutes / successes`.
  - Rest must be uninterrupted; if interrupted, recovery aborts and you must test again using the current condition.
    - The result can’t be better than the result of the first roll (GM adjudication).
  - A character knocked unconscious from **Deadly Stun** won’t wake up until Stun is reduced to **Serious**.
  - No medical treatment or known magic heals Stun; stimulant patches are only a temporary workaround (see Gear).
- **Physical**: heals in stages (each stage reduces wound level by 1 and resets boxes to the minimum for that level).
  - After a time break (end of adventure, downtime, etc.), make a **natural Body Test** (no cyber/magical attribute mods) vs TN based on wound level (table below).
  - If the test yields **1+** successes, the character can heal without medical attention.
  - If the test yields **0** successes, medical attention is required for healing to occur.
  - Deadly wounds always require medical attention.
  - Apply **First Aid** and **Magical Healing** effects (if any) before determining whether medical attention is required.

#### Healing (useful tables)
**Physical healing without medical attention (Body test TN):**
| Wound level | TN |
| --- | ---: |
| Light | 2 |
| Moderate | 4 |
| Serious | 6 |

**Physical healing time per stage (Body test):**
| Damage level | Base time | Minimum time | TN | Minimum lifestyle |
| --- | --- | --- | ---: | --- |
| Deadly | 30 days | 3 days | 10 | Hospitalized |
| Serious | 20 days | 2 days | 8 | High |
| Moderate | 10 days | 1 day | 6 | Middle |
| Light | 24 hours | 2 hours | 4 | Low |

#### Healing with medical care (doctoring modifiers)
To determine actual healing time for one stage:
- Make a **natural Body Test** vs the TN from the Healing Table.
- Divide **successes** into the Base time to get actual healing time (minimum is the Minimum time from the table).
- Lifestyle cost can be paid daily: `monthly cost / 30` (see `### Lifestyle`).

If a doctor/clinic is involved, apply these TN modifiers (only one “conditions” entry applies):

| Situation | TN modifier |
| --- | ---: |
| Intensive care (hospital only) | –2 |
| Long-term magical care | –2 |
| Not in hospital or clinic | +2 |
| Bad conditions | +3 |
| Terrible conditions | +4 |
| Patient is a magician | +2 |
| Patient natural Body is 4–6 | –1 |
| Patient natural Body is 7–9 | –2 |
| Patient natural Body is 10+ | –3 |
| Patient natural Willpower is 4–6 | –1 |
| Patient natural Willpower is 7–9 | –2 |
| Patient natural Willpower is 10+ | –3 |

Notes:
- “Natural” attributes exclude magical/cybernetic modifiers.
- If a character can’t support the minimum lifestyle, apply additional penalties (GM discretion).

#### Medical costs (optional)
| Service | Cost |
| --- | ---: |
| Paramedic first aid: Deadly wound | 400¥ |
| Paramedic first aid: Serious wound | 200¥ |
| Paramedic first aid: Moderate wound | 100¥ |
| Paramedic first aid: Light wound | 50¥ |
| Doctor services: Deadly wound | 400¥ per day |
| Doctor services: Serious wound | 200¥ per day |
| Doctor services: Moderate wound | 100¥ per day |
| Doctor services: Light wound | 50¥ per day |
| Hospitalization lifestyle (includes doctor) | 500¥ per day |
| Intensive care (Deadly only) | 1,000¥ per day |

#### Deadly wounds and permanent damage (optional)
When a character suffers a **Deadly** Physical wound, there is a chance of permanent damage.

- Make a **Body Test** (dermal armor counts) vs TN **4**.
  - If a trauma patch was used, apply **+2 TN**.

Results:
- **0 successes**: vital organ/system damage
  - Continuous treatment by someone with Biotech is required even if stabilized.
  - Double the total healing time.
  - A replacement organ must be transplanted (see Pieces and Parts below).
  - Roll **1D6**:
    - `1` lose 1 Body
    - `2` lose 1 Strength
    - `3` lose 1 Quickness
    - `4` lose 1 Intelligence
    - `5` lose 1 Willpower
    - `6` lose 1 Reaction
  - Attribute points lost this way can’t be recovered (though they can be replaced by cyber/other means).
  - The loss also reduces the character’s racial maximum for that Attribute by 1.
- **1 success**: limb/eye loss
  - Replacement required (natural or cyber).
  - Increase base healing time by **50%**.
  - Roll **1D6**:
    - `1` lose right arm
    - `2` lose left arm
    - `3` lose right leg
    - `4` lose left leg
    - `5` lose an ear (1–3 right, 4–6 left)
    - `6` lose an eye (1–3 right, 4–6 left)
- **2+ successes**: no limb/organ damage.

#### Pieces and parts (replacement organs/limbs)
Replacement parts may need to be grown/ordered before healing can begin.

**Body part types**
| Body part | Base time to grow | Base cost |
| --- | --- | ---: |
| Eye or small organ | 3 weeks | 7,500¥ |
| Large organ | 5 weeks | 15,000¥ |
| Hand/foot | 6 weeks | 15,000¥ |
| Limb | 8 weeks | 25,000¥ |

**Body part grades**
| Grade | Availability | Compatibility | Cost |
| --- | --- | ---: | ---: |
| Clonal | Must grow | 100% | Base ×2 |
| Type 0 | 3 in 6 | 90% | Base |
| Type G | 5 in 6 | 75% | Base ×0.8 |
| Secondhand | Always | 3D6 × 5% | Base ×0.4 |

**Failure under stress (compatibility check)**
| Compatibility | Chance of failure (under stress) |
| ---: | --- |
| 100% | No chance |
| 90–99% | 2D6 ≤ 3 |
| 70–89% | 2D6 ≤ 4 |
| 40–69% | 2D6 ≤ 5 |
| 10–39% | 2D6 ≤ 6 |

**Force-grown clonal parts (optional)**
- Choose a Force Growth Rating (max **10**) and divide it into the base grow time to get actual time.
- Forced growth increases cost and reduces compatibility by that rating percentage (GM adjudication).

**Cyber replacements**
- Cyberware can replace a lost/damaged part; use the Elective Surgery rules below when implanting cyberware.

#### Elective surgery (implanting cyberware / major procedures)
Surgery causes damage; recovery takes time (and money).

| Procedure type | Resulting wound |
| --- | --- |
| Minor cosmetic (no Essence cost; minor plastic) | Light |
| Minor invasive (≤ 0.4 Essence, or whole-body/eyes/muscles/nervous cosmetic) | Moderate |
| Major invasive (0.41–0.99 Essence; organic limb replacements/eye transplants) | Serious |
| Drastic invasive (≥ 1.0 Essence; organ transplants) | Deadly (stable; will not die) |

Notes:
- After drastic surgery, magicians check for Magic loss after healing (see below).
- Calculate the Essence costs of all cyberware being installed at the same time; additional cyberware can’t be installed until healing is complete.

#### First aid (Biotech)
First aid can reduce non-Deadly Physical wounds or stabilize Deadly wounds until professional care is available.

- First aid only helps **Physical** damage (not Stun).
- First aid must be applied within the “golden” first hour after injury.
- First aid is no longer useful once magical healing has been applied (regardless of success).

**First aid test**
- Roll **Biotech** vs TN based on the patient’s current Damage Level (table below), modified as listed.
- On **1+** successes: reduce Damage Level by **1** step (never more than 1 step via first aid).
- Treatment time is the table’s Treatment Time divided by successes (uninterrupted minutes). Serious interruption aborts (but you can repeat).

| Condition level | TN | Treatment time |
| --- | ---: | --- |
| Light | 4 | 10 minutes |
| Moderate | 6 | 20 minutes |
| Serious | 8 | 30 minutes |
| Deadly | 10 | Special (stabilize only) |

| Situation | TN modifier |
| --- | ---: |
| Patient is a magician | +2 |
| Bad conditions | +1 |
| Terrible conditions | +3 |
| Patient natural Body is 4–6 | –1 |
| Patient natural Body is 7–9 | –2 |
| Patient natural Body is 10+ | –3 |
| No medkit available | +4 |

**Deadly wounds (stabilization)**
- Make the Biotech test as above.
  - If it produces **1+** successes, the character stabilizes (stops taking an extra Physical box every 10 minutes from overflow).
  - If it fails, the wounded character makes a **natural Body Test** vs TN **10**:
    - If it succeeds, the body stabilizes itself.
    - If it fails, the character will die once overflow exceeds their Body (see overflow rules above).
- Stabilization must be maintained continually until professional help can be administered.
- Professional help allows another Biotech Test and Body Test:
  - “Professional” means better equipment (clinic/hospital) or a better Biotech rating than the initial caregiver.

#### Trauma patches (stabilization)
A trauma patch is a last-resort stabilizer applied over the heart.

- When applied, the character gains an extra **natural Body Test** to stabilize.
- TN = **4 + dermal armor rating + blood filter rating** (both restrict medicine flow).
- If it succeeds, the character stabilizes and stops accumulating additional overflow damage.

#### Magicians and damage (Magic loss)
Medical treatment is harder on magicians and can risk permanent Magic loss.

- When a magician suffers a **Deadly** wound, or is treated without the “patient is a magician” **+2 TN** modifier, check for Magic loss:
  - Roll **2D6**.
  - If the result is **≤** the magician’s current Magic rating, they permanently lose **1** point of Magic.
  - If treated for a Deadly wound without the +2 modifier, check **twice**.
- Limb/organ replacements for magicians:
  - Replacement limbs/organs must be cloned from the magician’s original tissue.
  - Any other DNA pattern reduces Magic by **1** automatically (can be restored later by replacing with a clone; organ implants are drastic surgery and can trigger additional Magic loss checks).

#### Magical healing (Treat/Heal)
- **Treat** must be applied within **1 hour** of injury to have effect; **Heal** can be used at any time.
- Successful Treat/Heal precludes additional Treat/Heal spells and also precludes first aid.
- Treat/Heal spells reduce Physical overflow damage.

### Vehicles and Rigging
- Vehicle combat uses the same Combat Turn structure, with vehicle tests and vehicle damage tracks.
- Rigging and drones typically rely on the Control Pool and vehicle/drone stats (see `## Vehicles`).

#### Vehicle ratings (quick)
- **Handling**: maneuverability (higher = harder to control).
- **Speed/Accel**: cruising speed and top speed in meters per Combat Turn (multiply by ~1.2 for km/h).
- **Body**: structural toughness/size proxy.
- **Armor**: protection vs damage; functions similarly to armor/barriers in some cases.
- **Signature**: how hard it is to detect electronically/thermally.
- **Autonav/Autopilot**: how well the vehicle can run itself and perceive threats.

#### Vehicle Control Rig (VCR) basics
- Rigging requires a VCR; it provides Reaction/Initiative bonuses and the **Control Pool** while the rigger is cybernetically controlling a vehicle.
- Other Reaction/Initiative boosters generally do not stack while jumped in.
- Commanding a vehicle is typically a **Complex Action** per vehicle; issuing the same one-sentence command to multiple drones may be handled as a group (GM adjudication).
- Autopilots handle simple commands best; the more complex the instruction, the higher the TN / the higher the chance of misinterpretation.

#### Autopilot commands (drones/vehicle autopilots)
- The GM rates the command’s complexity (see `## Skills` → `### Skill Success Table`) and sets a Target Number.
- **Autopilot Test**: roll **Autopilot** rating vs the TN.
  - 1 success = the autopilot follows the instruction.
  - Extra successes = the autopilot has more “latitude” in interpreting the command (GM discretion).

#### Vehicle operation (non-combat)
Normal vehicle operation does not usually require dice rolls. In non-combat situations where the driver is pushing limits, use the vehicle’s **Handling** as the base TN and apply modifiers below.

| Situation | TN modifier |
| --- | ---: |
| Complex controls | +1 |
| Unfamiliar vehicle (nonstressful) | +1 |
| Unfamiliar vehicle (stressful) | +3 |
| Large vehicle of type | +2 |
| Very large vehicle of type | +3 |
| Bad conditions | +2 |
| Terrible conditions | +4 |
| Rigger in control | –(VCR Level × 2) |

#### Terrain (vehicle chases)
Terrain affects Position Tests, Crash Tests, Ramming, and Escape Tests.

- Different vehicles in the same encounter may be in different terrain types (GM discretion).
- Terrain types (by vehicle type and current conditions):
  - **Open**: flat open areas / highways; aircraft: clear skies; boats: smooth water.
  - **Normal**: typical roads/countryside; aircraft: partly cloudy; boats: light seas.
  - **Restricted**: suburban streets, light woods, hills; aircraft: overcast/rain; boats: high seas.
  - **Tight**: dense urban maze/badlands/woods; aircraft/boats: high winds.
- Common condition shifts:
  - Fog, rain, or darkness can shift **Normal → Restricted**.
  - Mist, glare, or low light can shift **Restricted → Tight**.
  - Smoke, heavy fog, or total darkness can shift **Normal → Tight**.

#### Vehicle Combat Turn (chases/pursuit)
Vehicles use the normal Combat Turn structure, with extra vehicle steps.

1. **Position Test** (before Initiative): riggers allocate Control Pool dice for the Position Test, then all drivers make Position Tests.
2. Determine Initiative normally (apply VCR bonuses and vehicle damage modifiers).
3. Resolve actions, but attacks and movement are constrained by Position Test results.
4. End of Combat Turn: fleeing vehicles may attempt an Escape Test, then start a new Combat Turn with a new Position Test.

##### Allocating Control Pool dice (Position Test)
- Before the Position Test, riggers decide how many Control Pool dice will be used for the Position Test; the rest remain available for other uses.
- The Control Pool refreshes at the beginning of each rigger action, but the dice spent in the Position Test are removed each time the pool refreshes (they’re unavailable for other uses for the rest of the Combat Turn).

##### Position Test (flight / pursuit / fight)
- Each driver chooses an intention in secret, then reveals it after rolling:
  - **Flight**: widen the distance and escape.
  - **Pursuit**: close the distance and prevent escape.
  - **Fight**: maneuver for clear shots.
- Roll: **Vehicle Skill + (allocated Control Pool dice)** vs TN **(Handling + terrain modifier)**.

**Position Test Modifiers**
| Terrain | TN modifier |
| --- | ---: |
| Open | 0 |
| Normal | +1 |
| Restricted | +2 |
| Tight | +4 |

##### Using Position Test successes
**Flight**
- Distance traveled in this Combat Turn: **successes × cruising speed** (meters).
- Attacks: for every **2** successes generated, **each character in the vehicle** may spend **1 full action** attacking the pursuer (subject to weapon availability, firing arcs, etc.).
  - With **6** successes, characters may spend up to **3** actions each (but never more than the character’s normal number of actions that Combat Turn).
- Record Position Test successes for the Escape Test at end of turn.

**Pursuit**
- Distance closed in this Combat Turn: **successes × cruising speed** (meters).
- Attacks: the pursuers may make **1** attack for every **2** successes generated (subject to character action limits).
- Record Position Test successes for the Escape Test at end of turn.

**Fight**
- Attacks: the vehicle’s side may make a number of attacks against the opposing vehicle equal to **the number of Position Test successes** (each attack takes **1 full action** from a character in the vehicle).
- Distance: for every **2** successes, the vehicle may open or close distance by **cruising speed** (meters).

##### Relative distance (chase positioning)
- When one vehicle closes on another by traveling farther than the other vehicle in the Combat Turn, the closing driver chooses the final distance within the gain.
  - Example: starting distance 20 m; fleeing travels 30 m; pursuer travels 45 m → gain 15 m → final distance can be any value from **5 m** to **20 m**.
- If vehicles end closer than **1 meter**, they’re in a potential ramming situation. A collision occurs only if a driver spends a **Complex Action** to ram (see below).

##### Initiative notes (rigging)
- Determine Initiative normally.
- A character jumped in via a VCR adds the VCR’s Reaction/Initiative bonuses.
- Apply vehicle-damage Initiative modifiers by reducing the controlling character’s effective Reaction (see Vehicle Damage Modifiers below).
- If a rigger controls multiple vehicles, the rigger uses **one** Initiative total: use the **lowest** (worst) Initiative result among the vehicles under control.

##### Resolving actions (vehicle-specific limits)
- The driver must spend at least **one Complex Action** (any Complex Action) controlling the vehicle each Combat Turn.
  - If the driver spent no action controlling the vehicle, make a **Crash Test** at the end of the driver’s last action of the turn.
- Control Pool dice can assist tests to evade incoming attacks and Handling Tests, but **cannot** be used:
  - to defend against magical combat spell attacks, or
  - for the vehicle’s crash Damage Resistance Test.

##### Crash Tests
Crash Tests are required when:
- The vehicle takes **Serious** damage in any Combat Phase, or
- The driver spent no action controlling the vehicle that turn, or
- The vehicle is destroyed by weapons (automatic crash).

**Crash Test**
- Roll **Vehicle Skill + Control Pool** vs TN **(Handling + terrain modifier)**.

| Terrain | TN modifier |
| --- | ---: |
| Open | –1 |
| Normal | 0 |
| Tight | +2 |
| Restricted | +4 |

**Crash damage**
- Crash Power = **floor(cruising speed / 10)**.
- Crash Damage Level is based on cruising speed (meters per Combat Turn):

| Speed | Damage Level |
| ---: | --- |
| 1–20 | Light (L) |
| 21–60 | Moderate (M) |
| 61–200 | Serious (S) |
| 201+ | Deadly (D) |

**Vehicle crash Damage Resistance**
- Roll **Body + floor(Armor/2)** dice vs TN **(Crash Power – Armor)** (minimum TN **2**).
  - Unlike weapon damage, crash Power is reduced **only** by vehicle Armor (not by vehicle Body).
  - Control Pool dice **cannot** assist this test.
- Every **2** successes reduce the crash Damage Level by **1** step.

**Passengers in a crash**
- If the vehicle’s crash resistance test eliminates all crash damage, passengers take no damage.
- If the vehicle takes any crash damage, passengers suffer an attack with:
  - the **same Power** as the crash, and
  - the **Damage Level** the crash was reduced to.
- Passengers resist this as melee damage:
  - Combat Pool dice can never be applied.
  - Only **Impact** armor counts.

**Crash positioning**
- A crash stops the vehicle’s travel for the remainder of the Combat Turn, eliminating any distance won in the Position Test.

##### Ramming
- If the distance between two vehicles is less than **1 meter**, a driver may spend a **Complex Action** to ram (trying to force the other vehicle into a Crash Test).
- Control Pool dice apply to ramming rolls.

**Ramming roll**
- Each vehicle rolls dice equal to:
  - **Driver Vehicle Skill**
  - **+ Vehicle Body**
  - **+ floor(vehicle Armor/2)**
  - **– Vehicle Handling**
- Target Number = **(opposing Body + floor(opposing Armor/2) – terrain modifier)**, using the pursuing vehicle’s terrain.

| Terrain | Modifier |
| --- | ---: |
| Open | 0 |
| Normal | –2 |
| Restricted | –3 |
| Tight | +4 |

- The vehicle with the least successes must make a Crash Test. If tied, there is no crash.

##### Escape Test (end of Combat Turn)
- Vehicles that chose **Flight** in the Position Test may attempt to escape at the end of the Combat Turn.
- Compare Position Test successes:
  - If the pursuing or fighting vehicle has more successes, the escape attempt automatically fails.
  - If the fleeing vehicle has more successes, the pursuer makes an Escape Test:
    - Target Number = **(net successes of fleeing vehicle)**, modified by terrain (table below).
    - The pursuer may roll the highest **Intelligence** rating of any character who can potentially see the fleeing vehicle.
    - If the pursuer scores **0** successes, the fleeing vehicle has escaped.

| Terrain | TN modifier |
| --- | ---: |
| Open | +4 |
| Normal | –2 |
| Restricted | 0 |
| Tight | +2 |

##### Vehicle Damage Modifiers
- Vehicles use a Condition Monitor with Light/Moderate/Serious/Destroyed.
- The vehicle damage TN modifier applies to tests that actually involve the vehicle.
- The Initiative modifier reduces the controlling character’s effective Reaction.
- The Speed modifier reduces the vehicle’s cruising and maximum speeds.

| Vehicle damage | TN modifier | Initiative modifier | Speed |
| --- | ---: | ---: | --- |
| Light | +1 | –1 | No change |
| Moderate | +2 | –2 | 75% |
| Serious | +3 | –3 | 50% |

##### Vehicles, weapons, and magic (combat interactions)
**Weapon attacks vs vehicles**
- Vehicles without vehicle armor:
  - Vehicle **Body** counts as composite armor (ballistic and impact) and reduces Power.
  - Weapon Damage Level is reduced by **1** step (D→S→M→L).
  - Light weapons generally can’t affect vehicles unless using special ammo or attacking something vital (called shot).
- Vehicles with vehicle armor:
  - Treat vehicle **Armor** as a Barrier Rating for penetration.
  - If a weapon’s **base Power** (unmodified by burst/full-auto fire) does not exceed vehicle Armor, it cannot penetrate.
- Explosives:
  - Grenades and most explosives follow the same basic reductions as above.
  - Anti-vehicle rockets/missiles have semi-armor-piercing warheads: Power is reduced by vehicle Armor, but Damage Level is **not** reduced.
- Vehicle Damage Resistance (weapon attacks, with vehicle armor):
  - Roll **Body + floor(Armor/2)** dice vs TN **(Power – (Body + Armor))** (minimum TN **2**).
  - Riggers may add Control Pool dice if they choose.

**Moving Target Table (ranged attacks)**
Compare the speed of the firing vehicle (or the vehicle a character is firing from) against the speed of the target.
- Stationary attackers have a speed of **5**.
- In vehicle combat, compare vehicles’ **cruising speeds**.

| Relative speeds | TN modifier |
| --- | ---: |
| Target speed ≤ attacker speed | 0 |
| Target speed up to 2× attacker speed | +2 |
| Target speed is 2× to 3× attacker speed | +4 |
| Target speed is more than 3× attacker speed | +6 |

**Breaking windows**
- Civilian vehicles that take **Moderate** damage have one or more windows shattered/blown out.
- Military/security vehicles typically don’t lose windows until **Serious** damage.
- Aircraft with shattered/blown-out windows must descend to a safe, oxygen-rich altitude (note: SR2 vehicle rules don’t model altitude).

**Spells vs vehicles**
- Combat spells:
  - Only **physical** combat spells that do **physical** damage can affect vehicles (mana spells don’t).
  - Physical combat spells vs vehicles have a base TN **8**.
  - The vehicle resists with a Spell Resistance Test: roll **Body + floor(vehicle Armor/2)** vs TN **Force**.
  - Spell Defense dice may be allocated to assist a vehicle.
  - Vehicles are treated as a single entity for spell targeting (you can’t selectively hit “the tires” with a single-target combat spell).
- Damaging manipulations:
  - Resolve as regular weapons against vehicles.
  - They do **not** suffer the normal reductions in Power/Damage Level that weapon attacks do.

### NPCs and Threat Ratings (GM tools)

#### NPC professionalism (morale guideline)
NPCs can be rated by professionalism (how long they keep fighting once hurt).

| Professionalism | Typical behavior | Withdraw after… |
| --- | --- | --- |
| Average (1) | Untrained/civilians | Light wound |
| Semi-trained (2) | Basic training | Moderate wound |
| Trained (3) | Combat-trained | Serious wound |
| Professional (4) | Shadowrunners/elite | Fights to the end (or until motivation changes) |

When an NPC would normally withdraw, the GM may allow a **Willpower (4)** test to stay in the fight.

#### Threat Ratings (optional)
Threat Ratings are a quick way to scale an NPC without full character creation.

- Each point of Threat Rating provides **+1 die** usable on any test (offensive or defensive).
- Threat dice are always available (not a Dice Pool) and do not “refresh.”
  - Threat dice can be used on multiple tests within a Combat Phase.
- If using Threat Ratings for an NPC, do not also use standard Dice Pools for that NPC.
- Threat dice do not add to Initiative dice when rolling Initiative.
- For determining a clean miss, treat Threat dice as Combat Pool dice (see `### Ranged Combat`).

### Optional: lethality adjustments (table option)
These are suggested dials for changing campaign lethality. Agree on changes before play.

| Setting | Firearms: Ballistic Armor | Melee: Attack Power | Magic: Drain TN | Magic: Resistance TN |
| --- | --- | --- | --- | --- |
| High Threat | As written | 2× Power | As written | Force |
| Medium Threat | 1.5× armor rating | 1.5× Power | Force | Force |
| Low Threat | 2× armor rating | As written | Force | 1/2 Force |

## Magic

Long in-world lore is removed; keep the mechanical rules and reference tables.

### Core Concepts
- **Magic Rating**: measures magical ability; starting magicians typically begin at 6 and are limited by Essence.
- **Force**: chosen when casting a spell; affects effect and Drain.
- **Drain**: resisted after casting; unresolved Drain applies as damage (usually Stun).
- **Learned Force**: spells are learned at a specific Force. When casting, a magician may voluntarily cast at a lower Force, but can’t exceed the learned Force.

### Spellcasting (quick)
1. Choose spell and casting Force (≤ the spell’s learned Force; spells at character creation usually cap at Force 6).
2. Allocate Magic Pool dice during **Declare Actions** (Success Test / Drain / Spell Defense).
3. Make the **Spell Success Test**: roll **Force** dice + allocated Magic Pool dice vs the spell’s TN (modified).
4. If resisted, the target resists and you compare successes (ties favor the caster); then resist **Drain** with **Willpower + allocated Magic Pool**.

### Spellcasting (details)

#### Actions and Magic Pool allocation
- Spellcasting is resolved during the Combat Turn’s **Resolve Actions** step.
- During **Declare Actions**, a magician can allocate Magic Pool dice for tests expected that Action Phase:
  - Spell Success Test
  - Drain Resistance Test
  - Spell Defense dice (see below)

#### Basic procedure
1. Choose the spell, its casting Force (≤ learned Force), and any special options (exclusive/fetish-required, stacking, multiple targets, area radius).
2. Determine the target and the base Target Number (TN):
   - **Living targets**: typically **Willpower** for mana spells; **Body** for physical spells.
   - **Objects**: use **Object Resistance** (table below).
   - **Ranged damaging manipulation**: often a base TN **4** (then apply modifiers).
3. Apply modifiers (visibility, cover, wounds, sustaining, circles/barriers, etc.). TNs have a minimum of **2**.
   - Mana barrier: **+1 TN per 2 Force** when casting across the barrier (except for the barrier’s creator).
   - Hermetic circle / medicine lodge: **+1 TN per 2 Rating** when casting within it (except for the circle’s inscriber / shamans of the appropriate totem).
   - Sustaining: **+2 TN per sustained spell** currently sustained.
   - Touch spells: only injury modifiers apply.
4. **Spell Success Test**: roll **Force** dice (plus allocated Magic Pool dice) vs the modified TN.
   - 0 successes: miscast (no effect).
   - Rule of One edge case: if all dice are **1s**, it’s a misfire; the Drain Resistance TN is increased by **+2**.
5. If the spell allows resistance, make a resistance test and compare successes:
   - Most spells: target rolls **Body** (physical) or **Willpower** (mana) vs TN **Force**.
     - Magicians may add unused **Magic Pool** dice. Allocated **Spell Defense** dice (from themselves or an ally) can also add dice to this test.
   - Damaging manipulation spells: this resistance is treated as a **Damage Resistance Test** (as in Ranged Combat), not a normal Spell Resistance Test.
     - Treat spell Force like weapon Power, but only **half Impact armor** (round down) reduces it; barriers like glass can add additional “effective” Impact armor. See `#### Spells and astral space (targeting and barriers)`.
   - If the target has more successes: spell has no effect (but is still “cast”).
   - If successes tie: caster wins; apply the spell’s minimum effect.
   - If caster has more successes: apply effects based on net successes (per the spell).
6. **Drain Resistance Test**: roll **Willpower + allocated Magic Pool** vs TN **modified Force**.
   - Every **2** successes reduce Drain by **1 Damage Level**.
   - If the spell’s Force exceeds the caster’s **Magic Rating**, remaining Drain is **Physical**; otherwise it’s **Stun**.

#### Spell components (Force and range)
- **Learned Force**: a magician learns each spell at a specific Force and cannot cast it at a higher Force without re-learning it.
  - The magician may voluntarily cast at a lower Force than learned.
- **Range**:
  - **LOS (line of sight)**: if the caster can see the target with valid vision, the spell can reach it regardless of distance (see `#### Spell targeting (line of sight)`).
  - **Touch**: the caster must touch the target. If the target refuses contact, the caster must first hit with an unarmed melee attack (see `## Combat` → `#### Melee combat`).
  - **Limited** (hypersense detection spells): after casting, determine the sense’s operating range:
    - Make a separate **Force Test** vs TN **4** + injury modifiers (Magic Pool dice may be allocated to this test, but must be separate from the Spell Success Test).
    - Range in meters = **(successes × Magic Rating)**.

#### Detection spells (hypersense and general)
- Hypersense detection spells use **Limited** range (see above).
- General detection spells are not aimed at a specific target:
  - Declare what information you’re trying to detect.
  - Base TN:
    - **4**: all targets within sight
    - **6**: subjects out of sight
    - **10**: beings in astral space
    - If the subjects are out of sight behind a magical barrier: add the barrier’s **Rating** to the TN.
  - Roll **Force** dice vs the TN and interpret results with the table below.
  - If sustained, new subjects entering the area are detected using the original result.
- Detection spells aimed at a specific target also use the table below.
- Spells requiring a voluntary subject can be cast on any willing subject.

| Successes | Result |
| ---: | --- |
| 1 | General information only |
| 2 | Good detail, but minor points may be wrong |
| 3 | Mostly accurate detail, but minor points may be missing/unclear |
| 4+ | Accurate and detailed information |

#### Sustaining and duration
- **Sustained spells** last as long as the caster maintains them.
  - Each sustained spell imposes **+2 TN** to all other tests the caster makes.
  - A magician can sustain up to **Sorcery** spells at once.
  - A magician can sustain while **astrally perceiving**, but not while **astrally projecting**.
- **Permanent spells** must be sustained for their required time; dropping early ends the effect.

#### Restricted-use spells (learned as special versions)
Restricted-use versions permanently trade limitations for a higher effective Force (for determining spell effects) and can be cast above the magician’s Magic Rating without risking Physical damage from exceeding it.

- **Exclusive spell**
  - Cast as if its Force were **+2** for determining effect; Drain is calculated at the spell’s normal Force.
  - While casting an exclusive spell, the magician can’t cast or sustain other spells in the same action.
  - While sustaining an exclusive spell, the magician can’t cast other spells or use another magical skill.
- **Fetish-required spell**
  - Requires a spell-specific fetish. The fetish must be in hand (touching it is sufficient if worn).
  - **Reusable fetish**: cast as if Force were **+1** for effect.
  - **Expendable fetish**: cast as if Force were **+2** for effect; the fetish is consumed.
  - A fetish can’t be substituted for another, and a fetish belongs to a specific spell.
  - A spell can be learned as reusable-fetish or expendable-fetish, but not both.
- If you want the “same spell” with different restricted-use options, you learn it again as a separate version.
- With GM permission, starting characters can begin with restricted-use spells (still limited to base Force **6** at character creation).

#### Spell stacking (casting multiple spells at once)
- A magician can cast multiple spells with one Complex Action.
- Each additional stacked spell adds **+2 TN** to spellcasting-related tests and Drain Resistance Tests for that casting.
- Magic Pool dice are allocated separately to each stacked spell.
- Resolve stacked spells in any order the caster chooses.

#### Multiple targets
- A single spell can be cast at multiple distinct targets by splitting the spell’s **Force dice** among them.
- Resolve each target separately (success/resistance).
- Make a separate Drain Resistance Test for each target (each resisted against the spell’s full Drain/TN based on the original Force).
  - Allocate Magic Pool dice separately per target, including separately for each target’s Drain Resistance Test.

#### Object Resistance (base TNs vs objects)
| Object category | Base TN |
| --- | ---: |
| Natural objects (soil, trees, unprocessed water) | 3 |
| Manufactured low-tech (brick, leather, simple plastics) | 5 |
| Manufactured high-tech (advanced plastics, alloys, electronics) | 8 |
| Highly processed (computers, complex toxic waste) | 10+ |

#### Area-effect spells
- Base radius is **Magic Rating meters**.
- Area spells affect all valid targets in the radius (friend or foe).
- Adjust radius by withholding dice from the Spell Success Test (withheld dice can’t exceed the spell’s Force):
  - **Reduce** radius: **–1 m per 2 dice withheld**
  - **Increase** radius: **+1 m per 1 die withheld**
- Even if you withhold all Force dice for radius control, you can still roll Magic Pool dice, up to a maximum number equal to the spell’s original Force.
- Roll once, then compare that roll separately against each target’s TN within the radius.

#### Spell targeting (line of sight)
- In general, the caster must see the target with their own eyes or a natural extension of them (the image must be “direct,” not translated into another medium).
- Works: optical binoculars/scopes, cybereyes, mirrors, transparent glass.
  - One-way mirrors only work from the “see-through” side.
  - Manipulation spells have extra constraints through mirrors/glass; see `### Spells and astral space`.
- Does not work: cameras/screens, drone sensors, or remote-viewing spells (like clairvoyance).

#### Noticing spellcasting
- Noticing someone cast a spell typically requires a **Perception Test** (Intelligence dice) vs:
  - `TN = 2 × (caster Magic Rating – spell Force)` (minimum TN **2**).
- Apply normal Perception situation modifiers (distance, distraction, etc.).
  - The GM may apply an additional **–2 TN** if the observer is also a magician.
- Characters who are astrally perceiving or projecting automatically notice spellcasting’s astral display.

### Spell Defense
- During Declare Actions, allocate Magic Pool dice as Spell Defense.
- Spell Defense can protect the caster and other chosen targets currently in the caster’s line of sight.
- When a protected target makes a Spell Resistance Test, the caster can spend Spell Defense dice to add dice to that test.
- Spent Spell Defense dice refresh when the Magic Pool refreshes and must be reallocated.

### Medicine lodge (shaman)
- A medicine lodge is a prepared ritual area for a **specific totem**. It must have clear boundaries and be at least **3 m × 3 m** (larger if shared).
- A lodge has a **Rating** and can be shared among shamans of that totem.
- Study requirements:
  - Learning a new spell: lodge Rating must be **≥ spell Force**.
  - Ritual sorcery: lodge Rating must be **≥ spell Force**.
- Materials:
  - Cost: **500¥ per Rating point**
  - Weight: **2 kg per Rating point**
  - Materials are reusable unless lost/destroyed.
- Setting up a lodge at a new site takes **1 day per Rating point**.

### Hermetic libraries (mage)
- Hermetic libraries are specific to a **skill** (separate libraries for Sorcery, Conjuring, Magical Theory) and have a **Rating**.
- Uses:
  - Sorcery library: required to increase Sorcery skill (advancement without one is much harder).
  - Conjuring library: required for summoning elementals.
  - Magical Theory library: required to learn new spells.
- Data capacity: **Rating² × 100 Mp** (megapulses).
- Libraries can be shared; large facilities often charge registered users **Rating¥ per hour**.
- Ratings are **not cumulative** (a Rating 2 + Rating 3 library does not become Rating 5).

**Storage and cost**
- Hardcopy:
  - Space: **0.5 m³ per 100 Mp**
  - Cost: **Rating² × 2,000¥**
- Mini-CD:
  - Capacity: **100 Mp per disk**
  - Cost: **Rating² × 1,000¥**
- Optical chip:
  - Capacity: **up to 1 Gp per chip**
  - Cost: **Rating² × 1,200¥**

### Hermetic circle (mage)
- A hermetic circle is prepared for **one specific spell or conjuring**. It can be reused only for that same operation.
- Circle Rating limits the maximum rating/Force of an operation performed within it (typically must be **≥ Force**).
- Drawing and empowering the circle takes **Rating hours** of uninterrupted work.
- Size: base **3 m** diameter **+ Rating** meters (so diameter is `3 + Rating`).
- The circle is linked to the mage who inscribed it:
  - The link can be traced in astral space (see Astral Tracking).
  - The creator’s “style” can be identified via astral perception/assensing.

### Learning a new spell
- You must learn a spell before you can cast it (from another magician or from a spell formula; spell design rules are not in this guide).
- A teacher can instruct as long as they are still functional (**Magic 1+**) and know the spell at the Force being taught (or higher).
- Typical teacher cost: **1,000¥ × spell Force**, plus living expenses.
- Study requirements:
  - Shaman: medicine lodge Rating **≥ Force**.
  - Mage: sorcery library Rating **≥ Force**.

**Learning Test**
- Roll **Sorcery + Magical Theory** vs `TN = 2 × Force`.
- Apply normal TN modifiers (wounds, sustaining distractions, bad conditions, etc.).
- Apply totem modifiers where applicable.
- A mage may gain extra dice if aided by an elemental appropriate to the spell (GM adjudication).

**Teaching Test (optional)**
- If the teacher has the **Teaching** Special Skill, they may roll Teaching vs:
  - `TN = Force – student Intelligence` (minimum TN **2**)
  - Each teaching success reduces the student’s TN by **1**.

**Time and Karma**
- Base time: **Force days**
- Actual time: divide base time by learning successes (minimum **1 day**).
- Karma cost: **Force**.

**Failure**
- If the learning test generates **0** successes:
  - The attempt fails and the magician wastes **Force days**.
  - The attempt costs **no Karma**.
  - Teachers still expect to be paid.

### Ritual sorcery
Ritual sorcery builds a spell over hours. It enables teamwork and can target something not within line of sight.

- Use the **Ritual Sorcery** Concentration of Sorcery for ritual sorcery tests.
- Requirements:
  - Shaman: medicine lodge Rating **≥ Force**.
  - Mage: hermetic circle (for the specific spell) Rating **≥ Force**.
- Combat spells cannot be cast with ritual sorcery.

#### Ritual materials (consumed)
Materials are consumed when the spell is attempted (success or failure).

| Spell category | Materials cost |
| --- | ---: |
| Detection | 100¥ × Force |
| Health | 500¥ × Force |
| Illusion | 100¥ × Force |
| Manipulation | 1,000¥ × Force |

#### Material link (when the target is not in sight)
If the team cannot see the target, they need a material link:
- Living target: a tissue sample containing the target’s DNA.
- Non-living target: an integral physical piece of the target (e.g., a brick from the wall).
- A picture or unrelated object is not sufficient.

If using a ritual team, **astral guiding** can replace the need for a material link (see below).

#### Ritual teams
- All members must know the spell.
- All members must be the same tradition (shamans of different totems may cooperate).
- Max team size = the **lowest Sorcery rating** among the team members.
- Choose a team leader. All ritual tests use the **leader’s** totem/equipment modifiers.
- At the start, combine all members’ Magic Pools into one **Ritual Magic Pool**.
  - The ritual counts as one action; the pool does **not** refresh during the ritual.
  - A focus adds its dice once over the course of the whole ritual, not at each stage.
- A member may withdraw (stop participating). Reduce remaining Ritual Magic Pool dice by that member’s Magic Pool dice.
  - If this reduces the pool to **0**, the ritual aborts and all members make Drain Resistance Tests.
- Wounds and other modifiers affecting a member affect only that individual (except when the leader is affected).

#### Astral guiding (team spotter)
One team member may astrally project to “spot” the target:
- The spotter does **not** contribute to the Ritual Magic Pool, but does suffer Drain like everyone else.
- If the spotter is killed or driven away, the ritual aborts and all members make Drain Resistance Tests.
- The spotter must remain in astral space until the sending is complete.

#### Casting ritual sorcery (procedure)
1. **Prepare for sending**
  - Pick the spell and its Force.
  - Drop any sustained spells (participants cannot cast/sustain other spells during the ritual).
  - Combine Magic Pools into the Ritual Magic Pool.
2. **Form material link** (skip if astral guiding is used or the target is in sight)
  - Base time: **Force hours**.
  - At the end, the leader rolls a Success Test using allocated Ritual Magic Pool dice.
  - A single success links the spell to the target; actual time = base time / successes (minimum GM adjudication).
  - 0 successes: ritual aborts; all members resist Drain.
3. **The sending**
  - The leader rolls a Success Test using allocated Ritual Magic Pool dice (TN from the Sending Table).
  - Time: **Force hours / successes** (minimum **1 hour**).
  - 0 successes: ritual aborts; all members resist Drain.
4. **Determine the effect**
  - Make a normal Spell Success Test using Ritual Magic Pool dice against the spell’s normal TN.
  - If this is an area spell, the base radius is equal to the ritual team leader’s **Magic Rating** (meters) and it can be altered by withholding dice per the normal area-effect rules.
  - Because the link is established: modifiers for mana barriers/circles/lodges and for cover/visibility do not apply.
  - Only the leader’s injury modifiers (and totem modifiers, if relevant) apply.
  - If a Spell Resistance Test is needed, its TN is **Force** or the leader’s **Ritual Sorcery** skill, whichever is higher.
5. **Resist Drain**
  - Each member resists Drain as if they cast the spell alone.
  - Any remaining Ritual Magic Pool dice may be divided among members by the leader.
  - This step happens even if the ritual aborts.

**Material Link Table (target location)**
| Target location known | TN |
| --- | ---: |
| City or county known | 5 |
| State, province, or country known | 7 |
| Continent known | 9 |
| Unknown | 11 |

**Magic Link Modifiers**
| Situation | Modifier |
| --- | ---: |
| Target is a spirit | +2 |
| Target is protected by a mana barrier | +Barrier Rating |
| Target is within a hermetic circle or medicine lodge | +Rating |
| Tissue sample is older than (target Essence) hours | +4 |

**Sending Table**
| Target type | TN |
| --- | ---: |
| Specific place | 6 |
| Human or metahuman | 6 |
| Specific object | 8 |
| Spirit | 8 |

Sending modifiers:
- Target is moving faster than running (plane/car/train): **+2 TN**
- Area spell: **–1 TN**

#### Noticing the sending
During the sending, an astral observer who can see the target may roll **Intelligence** vs:
- `TN = Force – hours into the sending` (only **1** success is needed to identify the sending).
- If the target is a magician, their TN is **+2** compared to an outside observer.

#### Sustaining ritual spells
If the ritual spell is sustained:
- Allocate remaining Ritual Magic Pool dice to sustaining:
  - Duration (hours) = **leader Magic Rating × dice allocated**.
- A mage may use an elemental to maintain the spell for a number of **days** equal to spell Force (elemental rules).
- If the team stays locked together to sustain:
  - The astral link back to the team remains.
  - It counts as sustaining (+2 to each member’s Drain Resistance TN).
  - Participants may perform only non-intensive mundane tasks while sustaining.

#### Tracking back a detected sending
- A detected sending creates an astral “tendril” linking caster(s) and target.
- Follow it using **Astral Tracking**.
- During the sending stage, the ritual team is considered present in astral space and can be attacked via astral combat.
- If defenders pull personal Magic Pool dice out of the Ritual Magic Pool to defend themselves, the ritual aborts.

### Foci
- A focus must be **bonded** (Karma) and usually must be **activated** (Simple Action) before it provides benefits.
- Only one magician can bond a focus at a time; if a new magician takes a focus, they must bond it (paying Karma) before they can use it.
- Activating a focus takes **1 Simple Action** and requires no test.
- A magician can have a number of **active foci** equal to **Intelligence**.
- Once activated, a focus works as long as it’s on the magician’s person (worn, carried, or held). If it’s snatched away or dropped, it immediately deactivates and provides no benefits until recovered.
  - If the same magician recovers it, it does not need to be re-bonded.

#### Focus bonding costs (Karma)
| Focus | Karma cost |
| --- | ---: |
| Specific spell focus | Rating |
| Spell category focus | 3 × Rating |
| Spirit focus | 2 × Rating |
| Power focus | 5 × Rating |
| Spell lock | 1 |
| Weapon focus (small) | 4 × Rating |
| Weapon focus (large) | 5 × Rating |

#### Spell foci
- **Specific spell focus**: extra dice (equal to rating) for casting and Drain resistance for one spell chosen at bonding.
- Specific spell focus dice cannot be used to resist the same spell cast by another magician, and cannot be used as Spell Defense dice.
- **Spell category focus**: extra dice (equal to rating) for casting and Drain resistance for one spell category.
  - Category focus dice can also help resist spells from that category.
  - Category focus dice are **not** Spell Defense dice.
- Focus dice refresh like Magic Pool dice, but are limited to their focus’s purpose (don’t just “add into” the Magic Pool).

#### Spirit foci
- Bonded to a specific spirit type (elemental/nature-spirit domain/type) at bonding.
- Provides extra dice (up to rating) for summoning, banishing, controlling, and conjuring Drain tests involving that spirit type.
- For a single conjuring attempt, you can use at most a number of spirit focus dice equal to the focus’s rating across all associated tests.
- Magic Pool does not apply to Conjuring-related tests; spirit foci do.

#### Power foci
- Increase the magician’s **Magic Rating** by the focus rating.
- Also add extra dice (equal to rating) directly into the magician’s **Magic Pool** (usable anywhere regular Magic Pool dice can be used).

#### Spell locks
- A spell lock sustains one sustained spell without the caster’s concentration.
- The lock is bonded to a spell after a successful casting; the spell lock is then linked to that spell (not “re-cast” repeatedly to fish for more successes).
- Placement/activation:
  - Must be in contact with the target.
  - Activation is a Simple Action by a magician of the proper tradition.
  - Once placed, it is effectively invisible to mundanes; it can be spotted while astrally perceiving and removed to break the link.
- Spell locks can be handed off for placement (e.g., given to another magician of the proper tradition to activate).
- If removed, the lock goes dormant and must be re-bonded before being used again (and can be bonded to a different spell then).
- The creator can activate/deactivate their locks at will with a Simple Action.
- Active spell locks count toward the creator’s active-focus limit even when placed on someone else.
- Drawback: an astral “thread” links back to the creator and can be traced; active locks can be exploited as a material link for ritual sorcery.

#### Weapon foci
- A weapon focus adds its rating to the wielder’s Armed Combat skill (requires Magic Rating 1+ and bonding).
- Adepts (including physical adepts) can use weapon foci.
- Weapon foci only function in the owner’s hands (which is why “enchanted missiles/bullets” don’t work in practice).
- A weapon focus counts as a magical weapon for astral combat and against creatures resistant to normal weapons.
- Weapon foci require orichalcum as part of their construction.
- Against regeneration, a weapon focus can prevent regeneration on a killing blow:
  - If the wound is Deadly or would drop the critter, the target makes an **Essence Test** vs TN **(weapon focus rating × 2)**.
  - If the test fails, regeneration does not occur.

#### Attacking through an active focus (astral “grounding”)
- Active foci form an astral bridge; a projecting magician can attack the focus’s physical component with **physical** spells.
- **Manipulation** spells can’t be used for grounding attacks.
- Resolution is a contest between spell Force and focus rating:
  - Attacker rolls **Force** dice vs TN **focus rating**.
  - Defender rolls **focus rating** dice vs TN **Force**.
  - If the spell wins, the focus bond is broken and the spell grounds into the focus (then resolves normally).
  - Otherwise, the spell does not ground and dissipates.
- If the spell is not area-effect, it can only affect the target in possession of the focus or directly connected to it.
- Area-effect spells can be centered on the focus; line of sight is determined from the attacker’s position in astral space (the caster still must be able to see the target).

### Conjuring (spirits)
- Conjuring is used to summon, control, and banish spirits (nature spirits and elementals).
- The spirit’s **Force** sets the Conjuring TN and also drives spirit power and difficulty.
- Magic Pool dice do **not** apply to Conjuring tests (spirit foci and totem modifiers can).

#### Conjuring Drain (nature spirits and elementals)
| Spirit Force relative to summoner Charisma | Drain |
| --- | --- |
| Less than half Charisma | (L) Stun |
| Up to Charisma | (M) Stun |
| Greater than Charisma | (S) Physical |
| Greater than twice Charisma | (D) Physical |

#### Nature spirits (shamans)

##### Domains
- Nature spirits only have power **within** their domain and cannot cross out of it.
- Limited domains supersede broad domains (e.g., a hearth spirit inside an occupied building supersedes city/sky domains).
- Domain overlap examples (Search power):
  - A city spirit can search streets/plazas, but not inside an occupied building (hearth), a park (forest), a boat on a river (river), or the open sea (ocean).

##### Summoning and standby
- A nature spirit can only be summoned in its **domain** (hearth, city, forest, storm, river, etc.).
- Summoning is a **Complex Action**.
- **Conjuring Test**: Conjuring vs TN **Force**; successes = services owed.
- **Drain Resistance**: **Charisma** vs TN **Force**; every **2** successes reduce Drain by **1 level**.
  - If Drain knocks the shaman unconscious, the spirit departs.
- A shaman can have only **one** nature spirit in service at a time.
- Nature spirits vanish at **sunrise and sunset**; all remaining services end at that time.
- After summoning, the shaman may tell the spirit to return to its environment on “standby.”
  - Calling a standby spirit takes a **Simple Action**.

##### Noticing a spirit (“shimmer”)
- When present in astral form, a nature spirit is visible in the physical world as a shimmering in the air.
- Use **Concealability = (12 – Force)** for that shimmering effect.

##### Nature spirit services
- A spirit in astral form can only use powers that directly protect/benefit the shaman (e.g., concealment, guard, movement).
- To use powers on others, it must assume **manifest** form.
- Continual use of the same power counts as **one** service; changing parameters counts as a new service.
- Combat powers used on behalf of the shaman count as **one** service regardless of how many foes are involved.

#### Elementals (mages)

##### Summoning requirements
- Only mages summon elementals.
- Requires a conjuring library and a hermetic circle (correct type) rated at least the elemental’s Force.
- Materials cost: **1,000¥ per Force**.
- Each elemental needs a “source” present:
  - **Fire**: large bonfire/fireplace/large brazier
  - **Water**: large tub/pool (or circle near a body of water)
  - **Air**: large quantities of burning incense
  - **Earth**: man-sized heap of earth/clay/rock (or working on open ground)
- Ritual time: **Force hours** uninterrupted.
- At the end, make the **Conjuring Test**: Conjuring vs TN **Force**; successes = services.
  - 0 successes: no elemental appears, but materials are consumed.
- Then make **Drain Resistance**: **Charisma** vs TN **Force**; every **2** successes reduce Drain by **1 level**.
  - If Drain knocks the mage unconscious, the elemental escapes uncontrolled:
    - Roll elemental **Force** vs TN **4**.
    - **1+** successes: it flees immediately.
    - **0** successes: it attacks the summoning mage.
- A mage can have a number of bound elementals up to **Charisma** (release one to make room).

##### Calling and visibility (“shimmer”)
- An elemental with remaining services is bound and “on notice”; it departs until called.
- Calling an elemental to appear is a **Complex Action** and does **not** spend a service.
  - Calling is exclusive: the mage cannot be sustaining spells at the moment of calling.
- When it arrives in astral form, it is visible physically as shimmering air.
  - Use **Concealability = (8 – Force)** for this effect.

##### Command timing, LOS, and service decay
- After an elemental arrives, it takes only a **Simple Action** to command it to start a service.
- Elementals can perform only **one** service at a time.
- Except for remote service, the elemental must stay within the mage’s **line of sight**:
  - Astral perception/projection, clairvoyance, and other magical senses count.
  - Cameras/trideo and other electronic viewing do not.
- If **24 hours** pass while the elemental is present (even if it is performing a service), it consumes **one additional service**.

##### Elemental service types
Elementals can perform: **Aid Sorcery**, **Aid Study**, **Spell Sustaining**, **Physical Service**, **Remote Service**.
- Each type costs **one** service to initiate.
- Sending an elemental away and leaving it “on notice” does **not** cost a service.

**Aid Sorcery**
- Provides a pool of extra dice equal to the elemental’s **Force** usable like Magic Pool dice for sorcery, including Spell Defense.
- These dice do not refresh. Each die used reduces the elemental’s Force by **1**; at Force **0** it vanishes.
- Elemental-category limits:
  - Fire → Combat spells
  - Water → Illusion spells
  - Air → Detection spells
  - Earth → Manipulation spells
  - No elemental can aid Health spells
- A depleted elemental may be re-called:
  - Requires another **Complex Action** to call it.
  - Costs **one** service in this case.
  - It arrives at full Force.

**Aid Study**
- Adds the elemental’s **Force** dice to help learn **one** new spell in its category (costs one service).
- A mage can use only one spirit, one time, when learning a particular spell.

**Spell Sustaining**
- Sustains one spell in the elemental’s category.
- Short-term: sustains for **Force Combat Turns**, then disappears at Force 0 (mage can take over sustaining before it ends).
- Long-term binding option: bind the elemental to the spell to sustain for **Force days**.
  - Each day (or part of a day) reduces the spirit’s Force permanently by **1**.
  - At Force **0**, the spirit is destroyed and cannot be re-called.
  - Releasing the spirit early ends the spell and still dismisses the spirit permanently.
- If the elemental is banished while sustaining, the spell ends.
- While sustaining, it cannot perform other services.

**Physical Service**
- The elemental manifests and uses its powers (burning through a door, moving weight, fighting, etc.).
- Requires manifest form.

**Remote Service**
- Must be commanded immediately after summoning; the elemental cannot be bound for remote service.
- The command forfeits extra summoning successes/services (remote service replaces them).
- Once set loose, even the summoner cannot halt it; it continues until it completes the task or is banished/destroyed.
- May switch between astral and manifest forms as needed (costs the spirit a Simple Action).

##### Delegating
- The summoning mage may order the elemental to obey another character.
  - Mundanes can receive services, but cannot have it cast spells.

#### Spirit forms (astral vs manifest)
- Nature spirits and elementals can be in **astral** or **manifest** form; changing form costs the spirit a **Simple Action**.
- **Astral form**
  - Exists entirely in astral space; may still be seen as shimmering air.
  - Can only affect the summoner directly or targets with a valid astral presence.
  - Physical weapons cannot harm it; weapon foci can (if the wielder is astrally perceiving/projecting).
  - The shimmering itself cannot be attacked or targeted by spells.
- **Manifest form**
  - Used to affect targets that have only physical presence.
  - Mundane attacks use **Willpower** instead of weapon skill and cannot add Combat/Magic Pool dice.
  - Magical attacks (weapon foci, spells, vulnerabilities) use the normal combat skill rules.
  - Immunity vs indirect attacks: treat as armor = **2 × Force** (ballistic/impact as appropriate) against firearms, most ranged weapons, and explosions.
    - This immunity does not apply against melee attacks, bows (except crossbows), and throwing weapons.

#### Spirit initiative
- Spirits use special Initiative based on current form:
  - **Astral form**: base Reaction (per spirit type) + **20**, then roll **1D6**.
  - **Manifest form**: base Reaction (per spirit type) + **10**, then roll **1D6**.
- If a spirit switches from astral → manifest mid-turn, it resolves its current action, then cannot act again for **20 phases**.
- Spirits can only receive new commands on their summoner’s actions; they may Delay while waiting.

#### Spirit combat (spirit vs spirit)
- Spirits can directly fight each other as a Force-vs-Force contest:
  - Each rolls **Force** dice vs TN equal to the opposing spirit’s Force.
  - The winner reduces the loser’s Force by the difference in successes.
  - A spirit reduced to Force **0** is destroyed and cannot be re-called.
  - Requires spirits to be within **1 meter**; direct contests take a **Complex Action** and cost **1 service** (the fight can continue without extra service cost until one spirit is defeated).
- A magician attacked by a spirit may choose to use **Conjuring** in place of the normal resisting Attribute for that defense test.

#### Control contests
- Only a shaman may contest a nature spirit; only a mage may contest an elemental.
- Challenger declares as a **Complex Action**.
- Challenger: Conjuring vs TN **(Force + 2)**.
- Controller: Conjuring vs TN **Force** (no modifiers).
- If controller wins: no change; challenger makes a Drain Resistance Test as if they had conjured the spirit.
- If challenger wins: control transfers; **both** magicians make Drain Resistance Tests as if they had conjured the spirit.
- If neither rolls any successes: both resist Drain; the spirit goes uncontrolled.
- If the winner is knocked out by Drain, the spirit goes uncontrolled.

#### Commanding an uncontrolled spirit
- Make a Conjuring Test like banishing: Conjuring vs TN **Force**.
- Every **2** successes results in the spirit owing **1 service**.

#### Banishing
- Banishing requires full concentration: no other actions and no sustaining other spells.
- Each round is a contest:
  - Magician rolls Conjuring vs TN **Force** (if they summoned the spirit, add Charisma dice); apply spirit foci/totem.
  - Spirit rolls Force vs TN **magician Magic**.
  - Side with more successes reduces the other’s Magic/Force by **1 per 2 net successes**.
- The winner of a round chooses whether to continue; repeat until someone stops or hits **0**.
  - Spirit Force **0**: spirit destroyed.
  - Magician Magic **0**: magician passes out; spirit is free.
- Lost Magic/Force points return at **1 point per hour**.

### Astral space (basics)
- Astral space is a parallel plane where magic, spirits, auras, spells, and active foci have presence.
- Living things have astral forms (auras) and cannot be passed through in astral space.
- Inanimate objects can be passed through, but block line-of-sight for assensing (you can’t assense through a wall even if you can “walk through” it).

#### Astral perception
- Switching to/from astral perception is a **Simple Action**.
- While astrally perceiving, purely physical tasks are harder; apply **+2 TN** to physical-only tests.
- Astral perception allows assensing:
  - Auras (true nature/health/Essence/Magic relative to the viewer)
  - Spells, foci, and other active magic
  - Ritual sorcery traces (and spell-lock sustaining traces)
- Astral perception exposes the magician’s aura: the perceiver can be engaged in astral combat and can be targeted by mana spells.

#### Astral examination (detail from assensing)
| Successes | Typical result |
| ---: | --- |
| 0 | No useful information |
| 1–2 | General type (e.g., elemental vs focus vs spell category) |
| 3 | Specific spell/type; Force/Rating roughly relative to the perceiver |
| 4+ | Specific spell/type and the Force/Rating identified |

#### Astral movement (projection)
- Normal movement: **Astral Quickness × 4** meters per Action Phase.
- Fast movement: about **Magic Rating kilometers per action**, but details are a blur (no careful assensing while moving this fast).
- Projecting magicians can move vertically and “fly” in astral space, but do not leave the atmosphere (about **80 km** up).

#### Astral projection
- Astral projection leaves the body comatose while the magician’s astral form travels.
- Astral Attributes:
  - Astral Strength = **Charisma**
  - Astral Quickness = **Intelligence**
  - Astral Body = **Willpower**
  - Astral Reaction = **2 × Intelligence**
- The projecting magician’s body loses **1 Essence per hour** while projecting. After returning, Essence recovers at **1 point per minute** (up to the original rating).
- If the physical body is moved while the magician is away, the projecting magician does not automatically know.
  - To locate their body, roll **Body or Willpower** (whichever is higher) vs TN **4**.
  - Base search time is **6 hours**, divided by successes (minimum GM adjudication).
- If the body dies, the projecting magician knows immediately; the astral form persists until its Essence is used up.

#### Astral combat (quick)
- Astral combat functions like melee combat (no ranged attacks in astral space).
- Astral initiative is faster than physical:
  - Projecting magicians use **Astral Reaction + 15**, then roll **1D6**.
  - Magicians who are only astrally perceiving use their physical initiative.
- Initiative edge cases:
  - If you start the Combat Turn in your body and begin astral projection mid-turn, you keep your physical Initiative for that Combat Turn.
  - If you start the Combat Turn astrally projecting and return to your body mid-turn, you’re ineligible for another action for **20 phases**.
- Astral Pool: **floor((Intelligence + Willpower + Charisma) / 2)**. Use it like Combat Pool for astral fighting/dodging/resisting damage (not for casting spells).

#### Astral combat (details)
- Anything with an active astral presence can fight in astral space. Mundanes (**Magic 0**) cannot be harmed directly by astral attacks.
- Astral combat works like melee combat:
  - No ranged attacks.
  - Movement/cover concepts apply, with the usual astral limitations.
- Attack skill options:
  - With an active weapon focus: **Armed Combat**
  - Otherwise: **Unarmed Combat** or **Sorcery** (even if you cannot cast spells)
- Base astral attack TN: **4**.
- Astral Pool can add dice to astral combat and astral damage resistance, but not to casting spells in astral space.

**Astral Attack Table**
| Attack type | Damage code |
| --- | --- |
| Unarmed human magician | (Astral Strength)L |
| Armed attack (weapon focus) | (Astral Strength + floor(Focus Rating/2))M |
| Spirit | (Force)M |
| Barriers | (Rating)L |
| Intercepted/contested spell | (Force)(spell’s Drain Level) |

**Damage resistance**
- Resist astral damage with **Astral Body** dice.
- Dual-natured beings that have physical armor also receive that armor’s benefits in astral space (armor reduces Power normally).

**Damage type**
- Astral damage may be **Physical** or **Stun** at the attacker’s choice.
- Non-sentient astral entities (barriers, many magical items) always do Physical damage and can only be affected by Physical damage.

**Repercussion**
- Astral damage manifests on the physical body immediately (and vice-versa).
- Healing applied to one body heals the other (mundane or magical healing).

#### Astral barriers (hermetic circles and medicine lodges)
Hermetic circles and medicine lodges act as barriers in astral space.

- To pass through a barrier, reduce its Rating to **0** by attacking it.
- The barrier’s creator knows when someone is attacking it.

**Passing through a barrier (astral origin)**
1. Attacker rolls **Armed/Unarmed Combat or Sorcery** vs TN **barrier Rating**.
2. Barrier rolls **barrier Rating** dice vs TN **attacker Magic**.
3. Compare successes:
  - If attacker wins: reduce barrier Rating by **net successes**.
  - If barrier wins: it deals damage with base Damage Code **(Rating)L**, staging up **1 level per 2 net successes**.
    - Resist with **Astral Body** vs TN **barrier Rating**.
4. When the barrier’s Rating reaches **0**, it collapses.
  - If the fight ends early, any reduction in Rating remains (it does not “heal back”).

This procedure applies to attacks originating in astral space. Effects from physical space use the normal physical-world rules (e.g., spellcasting TN modifiers).

#### Magical items in astral combat
- Magical items fight only if attacked.
- Use the item’s **Force** as its “attack dice” in astral contests.
- If “destroyed” astrally, the item loses its enchantment (its physical form usually remains, but may appear dulled/changed).
- A spell lock has **Force 1** for astral purposes (regardless of the spell it contains); attacks are made against the lock, not the sustained spell.

#### Magical creatures (dual and astral beings)
- Dual beings exist on both planes at once and use the same stats on both planes.
  - They cannot be in different physical/astral locations and are limited to physical speed/initiative.
- Astral beings live in astral space; when they manifest physically, they are still tied to their physical location and physical speed/initiative.
- In astral space, purely astral beings typically have Attributes equal to their **Force/Essence** (critter rules).

#### Intercepting a spell in astral space
- A spell uses its **Force** for astral contests. Its caster can allocate Magic Pool dice (and relevant focus/totem dice) to support it.
- A spell is mindless:
  - If unopposed, it ignores other astral forms and reaches its target in the same action it is cast.
  - If blocked, it fights.
- To intercept a spell, an **astrally projecting** character must:
  - be aware of the spellcasting, and
  - have a **Delayed Action** ready.
  - An astrally perceiving character cannot physically react fast enough to intercept.

**Spell interception resolution**
- Resolve like fighting a barrier:
  - Winner’s net successes reduce the loser’s Force.
  - If the spell wins, the interceptor takes damage with Damage Code **(Force)(spell Drain Level)**.
  - If the interceptor wins and reduces the spell’s Force to **0**, the spell is destroyed and has no effect.
- After each exchange, the **winner** decides whether to continue the fight.
- As long as either side continues, the spell is blocked and cannot strike the target.
- If the interceptor stops or is defeated, the spell continues to the target. If its Force was reduced, it hits at the reduced Force.
- The caster may choose to stop supporting/casting the spell on any action; the spell dissipates immediately.
- The caster still makes the Drain Resistance Test in the action the spell was cast.
  - If the caster is knocked out, the spell vanishes.
  - Supporting a contested spell counts like sustaining (**+2 TN**) and the caster can still cast other spells while supporting it (subject to normal limits).

#### Spells cast in astral space
- A magician in astral space cannot cast a spell at another spell, but can cast at astral beings.
- Such a spell cannot be intercepted.
- Mana spells affect only the astral target. Physical spells can “ground out” into the physical world (see below).
- Magic Pool (and relevant foci/totems) can be used normally for the spell; Astral Pool cannot be used for spellcasting.
- Drain from spells cast in astral space is always **Physical**, regardless of Force.

#### Astral evasion
- Use an Astral Evasion Test when both sides can move freely and one tries to break off combat or evade pursuit.
- Both sides roll:
  - **Astral Quickness** for normal movement, or
  - **Magic** for fast movement.
  - Spirits roll **Force**.
- TN = opponent’s Astral Quickness / Magic / Force (matching the movement mode used).
- Winner decides:
  - Normal movement: break off while staying in the general area (move away up to normal astral movement).
  - Fast movement: fully evade and leave the area, or keep up and maintain combat range.

#### Astral tracking (threads from foci and sendings)
Active spell locks and ritual sendings can leave an astral “thread” back to the creator/caster.

- Test: **Intelligence** vs TN **4**, modified:
  - If the ritual spell/focus Force/Rating is **≤** tracker’s **Sorcery**: **–2 TN**
  - If the ritual spell/focus Force/Rating is **>** tracker’s **Sorcery**: **+2 TN**
- Base time: **12 hours / successes**.
- You may pause to rest. When resuming, roll **Intelligence or Magic** (whichever is higher) vs TN equal to the number of hours (or part thereof) since you stopped:
  - 1+ successes: resume tracking.
  - 0 successes: trail is lost.

#### Ritual teams in astral space
- During the sending stage (and while sustaining a ritual spell), a ritual sorcery team is considered present in astral space and can be attacked via astral combat.
- The hermetic circle or medicine lodge acts as an astral barrier:
  - Team members (except the leader) may leave the barrier to engage astral attackers.
  - Team members cannot cast spells from inside the barrier, but can cast freely outside it.
- If a team member dies or loses consciousness, reduce the Ritual Magic Pool by the appropriate amount.
  - If the pool drops to **0**, or if the leader loses consciousness, the ritual aborts and each remaining team member makes a Drain Resistance Test.
  - Team members outside the circle/lodge when the ritual aborts take the Drain as **Physical** damage.

#### Spells and astral space (targeting and barriers)
- A spell can only affect a target the caster can see with **natural vision** or a natural extension (optical scopes, cybereyes).
  - Cameras/screens and remote-viewing spells (e.g., clairvoyance) do not work for spell targeting.
  - Mirrors count for line of sight (one-way mirrors only from the see-through side).
- Combat spells (and most other spells) affect only targets whose auras the caster can see.
  - For area-effect spells, targets not in the caster’s view are not affected even if they are within the radius.
  - Seeing only a “sliver” of aura is not enough to target someone.
- From astral space:
  - Physical terrain is opaque. Treat line of sight as if the astral caster were standing in the same physical location.
  - Transparent barriers (glass) do not block line of sight; semi-transparent barriers may provide cover modifiers.

**Dual-profile targets (bridges)**
- Active foci and active astral perception create a dual astral/physical presence.
- Astral casters can exploit this bridge:
  - Mana spells affect only the dual-profile target, even if area-effect.
  - Physical spells can ground out through the target’s physical component; area effects can continue beyond the target.

**Manipulation spells (physical component)**
- Manipulation spells also travel through the physical world (not just astral).
  - They cannot be cast “via mirror” because their physical component takes a direct path and will hit the obstruction.
- A target may apply **Impact armor** against manipulation spells like ranged combat:
  - Impact armor reduces the spell’s effective Force by **floor(Impact armor / 2)**.
- If a manipulation spell is cast through glass or another transparent barrier:
  - Resolve like shooting through barriers, but use **half** the Barrier Rating.
  - Add **half** the Barrier Rating to the target’s Impact armor for this hit.
  - If half the Barrier Rating is **≥ Force**, the spell dissipates.

### Adepts
An adept is a restricted magician. Adepts have a Magic Rating and lose Magic from Essence loss and Deadly wounds.

#### Magical adepts
- A magical adept can use only **one** magical skill:
  - Sorcery-only adepts are often called *sorcerers*.
  - Conjuring-only adepts are often called *conjurers*.
- Choose a tradition (hermetic or shamanic) and follow the normal rules for that tradition’s spell learning/conjuring where applicable.
- Magical adepts have **no access to astral space** (no astral perception or projection).

#### Shamanic adepts
- Must be a shaman.
- May only cast spells and conjure spirits for which their totem would normally offer modifiers (by purpose/domain).
  - Shamanic adepts do **not** receive the totem modifiers; they are still subject to the totem’s requirements.
  - Some totems cannot produce shamanic adepts (e.g., totems with no modifiers, or modifiers based on time/place rather than purpose).
- Shamanic adepts can use Sorcery/Conjuring defensively and can access astral space (perception and projection).

#### Physical adepts
- Physical adepts improve the body via “powers” purchased with Magic Rating Points.
  - These points are not “spent down”; they are a cap on how many points of powers the adept can have (up to Magic Rating).
- A physical adept cannot astrally project.
- The only focus that normally benefits a physical adept is a **weapon focus**.

### Physical adept powers (SR2 core)
This section describes the SR2 core physical adept powers and their costs.

#### Astral Perception
Cost: **2**

- The adept can see into astral space (astral perception) but cannot astrally project.
- Enables the adept to use **Sorcery** in astral combat.
- The adept cannot cast spells and does not have a Magic Pool.

#### Combat Sense
Each level provides extra Combat Pool dice and allows spending Combat Pool dice to assist the **Reaction Test** in surprise situations.

| Level | Combat Pool dice | Cost |
| ---: | ---: | ---: |
| 1 | 1 | 2 |
| 2 | 2 | 3 |
| 3 | 3 | 4 |

#### Improved Ability
- Buy extra dice for one general skill; the dice apply to its Concentrations/Specializations.
- Skill Web edge case: Improved Ability dice are reduced by **1 die per circle crossed** on the Skill Web (in addition to the usual +2 TN per circle).
- Combat skill cap: you cannot have more Improved Ability dice than your current rating in that combat skill.

**Improved Ability Costs**
| Area | Cost |
| --- | ---: |
| Athletic Skills | 0.25 per die |
| Stealth | 0.25 per die |
| Armed Combat | 0.5 per die |
| Unarmed Combat | 0.5 per die |
| Throwing | 0.5 per die |
| Projectile Weapons | 0.5 per die |
| Firearms | 1 per die |
| Gunnery | 1 per die |

#### Improved Physical Attributes
- Raises only **Body**, **Quickness**, or **Strength** (not mental attributes).
- When later increasing the attribute with Karma, use the total attribute rating (including magical improvements) to determine cost.

**Improved Attribute Costs**
| Final attribute rating | Cost per +1 |
| --- | ---: |
| ≤ 1/2 racial maximum | 0.5 |
| Up to racial maximum | 1 |
| Up to 1.5× racial maximum | 1.5 |

#### Improved Physical Senses
Cost: **0.25 per improvement**

- Includes low-light/thermographic vision, high/low-frequency hearing, enhanced smell/taste, etc.
- Anything cyberware can improve (except purely technological/radio-style effects) can be improved this way.
- No “package deals”; each improvement is purchased separately.

#### Increased Reaction
- Grants additional Reaction points (no extra Initiative dice).

**Increased Reaction Cost**
| Final Reaction rating | Cost per +1 |
| --- | ---: |
| ≤ 1/2 racial maximum | 0.5 |
| Up to racial maximum | 1 |
| Up to 1.5× racial maximum | 2 |

#### Increased Reflexes
- Grants additional Initiative dice.

| Extra Initiative dice | Cost |
| ---: | ---: |
| 1 | 1 |
| 2 | 4 |
| 3 | 6 |

#### Killing Hands
- Normal unarmed damage is **(Strength)M Stun**.
- Killing Hands allows unarmed attacks to do **Physical** damage at the purchased level.
  - You may choose per attack whether to deal normal Stun or Killing Hands Physical.
- Declare Killing Hands use when making the Unarmed Combat attack.
- Killing Hands attacks affect creatures immune/resistant to normal weapons (their defensive bonuses vs normal weapons do not apply).
- Killing Hands cannot be augmented by weapons or magic, but other adept powers (like Improved Ability) still apply.

**Killing Hands Cost**
| Damage level | Cost |
| --- | ---: |
| (Strength)L | 0.5 |
| (Strength)M | 1 |
| (Strength)S | 2 |
| (Strength)D | 4 |

#### Pain Resistance
Cost: **0.5 per point**

- Ignore injury and Initiative modifiers for a number of damage boxes equal to Pain Resistance points.
  - Example: Pain Resistance 3 ignores modifiers from Light/Moderate wounds (up to 3 boxes).
  - Once damage exceeds the Moderate threshold, modifiers apply normally.
- Applies to both Physical and Stun Condition Monitors.
- Also affects resisting/inflicting pain (torture, illness, etc.):
  - Add Pain Resistance points to TNs to inflict pain on the adept.
  - Subtract Pain Resistance points from TNs to resist pain.
- Cannot improve any Damage Resistance Test outcome.

#### Physical adepts and Magic loss
- If a physical adept loses Magic points, they must give up **1 full point** worth of purchased improvements per point of Magic lost.
- Purchased powers cannot be reallocated, but they can be upgraded later by spending more Magic Rating Points.

### Spell Directory (system list)
Legend:
- Class: `C` Combat, `D` Detection, `H` Health, `I` Illusion, `M` Manipulation
- Type: `M` Mana, `P` Physical
- Duration: `I` Instant, `S` Sustained, `P` Permanent

| Spell | Class | Type | Duration | Drain | Book |
| --- | --- | --- | --- | --- | --- |
| Death Touch | C | M | I | [(F/2)-1]S | SR2.??? |
| Fire Bolt | C | P | I | [(F/2)+1]D | SR2.??? |
| Fire Cloud | C | P | I | [(F/2)+1]D | SR2.??? |
| Fire Dart | C | P | I | [(F/2)+1]M | SR2.??? |
| Fire Missile | C | P | I | [(F/2)+1]S | SR2.??? |
| Fireball | C | P | I | [(F/2)+3]D | SR2.151 |
| Flame Arrows | C | P | I | [(F/2)+1]D | SR2.??? |
| Force Drain | C | M | I | (F/2)S | SR2.??? |
| Hellblast | C | P | I | [(F/2)+6]D | SR2.159 |
| Inferno | C | P | I | [(F/2)-1]D | SR2.??? |
| Mana Bolt | C | M | I | (F/2)S | SR2.151 |
| Mana Cloud | C | M | I | (F/2)S | SR2.??? |
| Mana Dart | C | M | I | (F/2)L | SR2.151 |
| Mana Missile | C | M | I | (F/2)M | SR2.151 |
| Manaball | C | M | I | (F/2)S | SR2.151 |
| Manablast | C | M | I | (F/2)D | SR2.??? |
| Power Bolt | C | P | I | [(F/2)+1]S | SR2.151 |
| Power Dart | C | P | I | [(F/2)+1]L | SR2.151 |
| Power Missile | C | P | I | [(F/2)+1]M | SR2.151 |
| Powerball | C | P | I | [(F/2)+1]S | SR2.151 |
| Powerblast | C | P | I | [(F/2)+1]D | SR2.??? |
| Ram | C | P | I | [(F/2)+1]S | SR2.151 |
| Ram Touch | C | P | I | [(F/2)-1]M | SR2.??? |
| Redirect | C | P | I | [special] | SR2.??? |
| Rot | C | P | I | [(F/2)+1]M | SR2.??? |
| Shattershield | C | M | I | (F/2)S | SR2.??? |
| Slay (Race/species) | C | M | I | [(F/2)-1]S | SR2.??? |
| Sleep | C | M | I | [(F/2)-1]S | SR2.151 |
| Spirit Bolt | C | M | I | [(F/2)-1]S | SR2.??? |
| Sterilize | C | P | I | [(F/2)+1]D | SR2.??? |
| Stun Bolt | C | M | I | [(F/2)-1]D | SR2.??? |
| Stun Cloud | C | M | I | [(F/2)-1]S | SR2.??? |
| Stun Missile | C | M | I | [(F/2)-1]M | SR2.??? |
| Stun Touch | C | M | I | [(F/2)-2]M | SR2.??? |
| Stunball | C | M | I | [(F/2)-1]D | SR2.??? |
| Stunblast | C | M | I | [(F/2)+1]D | SR2.??? |
| Tire Wrecker | C | P | I | [(F/2)+1]M | SR2.??? |
| Urban Renewal | C | P | I | (F/2)D | SR2.??? |
| Wrecker | C | P | I | (F/2)S | SR2.??? |
| Analyze Device | D | P | S | [(F/2)+1]M | SR2.153 |
| Analyze Magic | D | M | S | (F/2)M | SR2.??? |
| Analyze Truth | D | M | S | (F/2)S | SR2.153 |
| Animal Spy | D | M | S | (F/2)L | SR2.??? |
| Astral Perception | D | M | S | (F/2)S | SR2.??? |
| Astral Sense | D | M | S | (F/2)M | SR2.??? |
| Catalogue | D | P | I | [(F/2)-1]L | SR2.??? |
| Clairaudience | D | M | S | (F/2)M | SR2.153 |
| Clairaudience (Extended) | D | M | S | [(F/2)-1]S | SR2.??? |
| Clair Spell | D | M | S | [(F/2)+2]M | SR2.??? |
| Clair Spell (Extended) | D | M | S | [(F/2)+1]S | SR2.??? |
| Clairvoyance | D | M | S | (F/2)M | SR2.153 |
| Clairvoyance (Extended) | D | M | S | [(F/2)-1]S | SR2.??? |
| Combat Sense | D | P | S | [(F/2)+1]S | SR2.153 |
| Detect Credstick Protection | D | M | S | (F/2)D | SR2.??? |
| Detect Damage Level | D | P | I | [(F/2)-1]S | SR2.??? |
| Detect Enemies | D | M | S | [(F/2)+1]M | SR2.153 |
| Detect Enemies (Extended) | D | M | S | (F/2)S | SR2.??? |
| Detect Individual | D | M | S | (F/2)L | SR2.153 |
| Detect Life | D | M | S | (F/2)L | SR2.153 |
| Detect (Life Form) | D | M | S | [(F/2)-1]L | SR2.153 |
| Detect Magic | D | M | S | (F/2)L | SR2.??? |
| Detect Magical Sites (Ext) | D | M | S | [(F/2)-1]M | SR2.??? |
| Detect (Object) | D | P | S | [(F/2)+1]M | SR2.153 |
| Detect Sentients | D | M | S | [(F/2)-1]M | SR2.??? |
| Detect Traps | D | P | I | [(F/2)-1]M | SR2.??? |
| Detect Traps (Extended) | D | P | I | [(F/2)-2]S | SR2.??? |
| Detect Wound Level | D | M | I | (F/2)M | SR2.??? |
| Diagnose | D | M | I | [(F/2)-1]M | SR2.??? |
| Enhance Aim | D | M | S | (F/2)S | SR2.??? |
| Enhanced (Sense) | D | P | S | [(F/2)+2]M | SR2.??? |
| Enhanced Sight | D | P | S | [(F/2)+4]D | SR2.??? |
| Foresight | D | M | S | (F/2)D | SR2.??? |
| Foretelling | D | M | I | (F/2)D | SR2.??? |
| Know Exit | D | P | S | [(F/2)+3]S | SR2.??? |
| Low-Light Vision | D | P | S | (F/2)L | SR2.??? |
| Memory Probe | D | P | S | [(F/2)+3]D | SR2.??? |
| Mindlink (Individual) | D | M | S | [(F/2)+2]M | SR2.??? |
| Mind Probe | D | M | S | [(F/2)+2]D | SR2.153 |
| Night Vision | D | P | S | (F/2)L | SR2.??? |
| Personal Combat Sense | D | P | S | [(F/2)+1]M | SR2.153 |
| Sound Selection | D | M | S | (F/2)L | SR2.??? |
| Telepathic Chat | D | M | S | [(F/2)-2]S | SR2.??? |
| Thermographic Vision | D | P | S | (F/2)L | SR2.??? |
| Translate | D | M | S | [(F/2)+1]L | SR2.153 |
| Truth Glow | D | M | S | [(F/2)+2]S | SR2.??? |
| X-Ray Vision | D | P | S | [(F/2)+2]S | SR2.??? |
| Air Breathing | H | P | S | [(F/2)+2]L | SR2.??? |
| Allergy | H | P | S | [(F/2)+2]S | SR2.??? |
| Alleviate Nuissance Allergy | H | P | S | (F/2)L | SR2.??? |
| Alleviate Mild Allergy | H | P | S | (F/2)M | SR2.??? |
| Alleviate Moderate Allergy | H | P | S | (F/2)S | SR2.??? |
| Alleviate Severe Allergy | H | P | S | (F/2)D | SR2.??? |
| Antidote L Toxin | H | P | P | (F/2)L | SR2.159 |
| Antidote M Toxin | H | P | P | (F/2)M | SR2.159 |
| Antidote S Toxin | H | P | P | (F/2)S | SR2.159 |
| Antidote D Toxin | H | P | P | (F/2)D | SR2.159 |
| Awaken | H | M | I | [(F/2)-1]L | SR2.??? |
| Blindness | H | M | S | [(F/2)+1]D | SR2.??? |
| Buzz | H | P | P | (F/2)S | SR2.??? |
| Cause Nuissance Allergy | H | M | S | [(F/2)+1]L | SR2.??? |
| Cause Mild Allergy | H | M | S | [(F/2)+1]M | SR2.??? |
| Cause Moderate Allergy | H | M | S | [(F/2)+1]S | SR2.??? |
| Cause Severe Allergy | H | M | S | [(F/2)+1]D | SR2.??? |
| Cripple Limb | H | M | S | (F/2)S | SR2.??? |
| Cure L Disease | H | P | P | (F/2)L | SR2.159 |
| Cure M Disease | H | P | P | (F/2)M | SR2.159 |
| Cure S Disease | H | P | P | (F/2)S | SR2.159 |
| Cure D Disease | H | P | P | (F/2)D | SR2.159 |
| Decrease -1 Attribute | H | P | S | [(F/2)+1]L | SR2.159 |
| Decrease -2 Attribute | H | P | S | [(F/2)+1]M | SR2.159 |
| Decrease -3 Attribute | H | P | S | [(F/2)+1]S | SR2.159 |
| Decrease -4 Attribute | H | P | S | [(F/2)+1]D | SR2.159 |
| Decrease -1 Cybered Attribute | H | P | S | [(F/2)+3]L | SR2.??? |
| Decrease -2 Cybered Attribute | H | P | S | [(F/2)+3]M | SR2.??? |
| Decrease -3 Cybered Attribute | H | P | S | [(F/2)+3]S | SR2.??? |
| Decrease -4 Cybered Attribute | H | P | S | [(F/2)+3]D | SR2.??? |
| Decrease Reflexes -1 die | H | M | S | [(F/2)+1]S | SR2.??? |
| Decrease Reflexes -2 dice | H | M | S | [(F/2)+1]D | SR2.??? |
| Decrease Reflexes -3 dice | H | M | S | [(F/2)+3]D | SR2.??? |
| Detox L Toxin | H | P | P | [(F/2)-2]L | SR2.159 |
| Detox M Toxin | H | P | P | [(F/2)-2]M | SR2.159 |
| Detox S Toxin | H | P | P | [(F/2)-2]S | SR2.159 |
| Detox D Toxin | H | P | P | [(F/2)-2]D | SR2.159 |
| Enhance Willpower | H | M | S | (F/2)S | SR2.??? |
| Essence Drain | H | P | S | [(F/2)+2]D | SR2.??? |
| Fast | H | M | P | (F/2)L | SR2.??? |
| Hair Growth | H | P | S | [(F/2)+1]L | SR2.??? |
| Hair Loss | H | P | S | (F/2)L | SR2.??? |
| Heal | H | M | P | (F/2)(Wound Level) | SR2.155 |
| Heal L Wounds | H | M | P | [(F/2)-1]L | SR2.??? |
| Heal M Wounds | H | M | P | [(F/2)-1]M | SR2.??? |
| Heal S Wounds | H | M | P | [(F/2)-1]S | SR2.??? |
| Heal D Wounds | H | M | P | [(F/2)-1]D | SR2.??? |
| Healthy Glow | H | P | P | (F/2)L | SR2.??? |
| Increase +1 Attribute | H | M | S | [(F/2)+1]L | SR2.159 |
| Increase +2 Attribute | H | M | S | [(F/2)+1]M | SR2.159 |
| Increase +3 Attribute | H | M | S | [(F/2)+1]S | SR2.159 |
| Increase +4 Attribute | H | M | S | [(F/2)+1]D | SR2.159 |
| Increase +1 Cybered Attribute | H | P | S | [(F/2)+3]L | SR2.159 |
| Increase +2 Cybered Attribute | H | P | S | [(F/2)+3]M | SR2.159 |
| Increase +3 Cybered Attribute | H | P | S | [(F/2)+3]S | SR2.159 |
| Increase +4 Cybered Attribute | H | P | S | [(F/2)+3]D | SR2.159 |
| Increase Matrix Reaction +1 | H | M | S | [(F/2)+1]M | SR2.??? |
| Increase Matrix Reaction +2 | H | M | S | [(F/2)+1]S | SR2.??? |
| Increase Matrix Reaction +3 | H | M | S | [(F/2)+1]D | SR2.??? |
| Increase Reflexes +1 die | H | M | S | (F/2)M | SR2.??? |
| Increase Reflexes +2 dice | H | M | S | (F/2)S | SR2.??? |
| Increase Reflexes +3 dice | H | M | S | (F/2)D | SR2.??? |
| Intoxication | H | M | S | [(F/2)+2]M | SR2.??? |
| Nutrition | H | M | P | (F/2)L | SR2.??? |
| Oxygenate | H | P | S | [(F/2)+2]M | SR2.??? |
| Paralyze | H | M | S | [(F/2)+1]D | SR2.??? |
| Preserve | H | P | S | [(F/2)+1]M | SR2.??? |
| Prophylaxis L Pathogen | H | P | S | [(F/2)+2]L | SR2.??? |
| Prophylaxis M Pathogen | H | P | S | [(F/2)+2]M | SR2.??? |
| Prophylaxis S Pathogen | H | P | S | [(F/2)+2]S | SR2.??? |
| Prophylaxis D Pathogen | H | P | S | [(F/2)+2]D | SR2.??? |
| Resist Nuissance Allergy | H | M | S | [(F/2)+1]L | SR2.??? |
| Resist Mild Allergy | H | M | S | [(F/2)+1]M | SR2.??? |
| Resist Moderate Allergy | H | M | S | [(F/2)+1]S | SR2.??? |
| Resist Severe Allergy | H | M | S | [(F/2)+1]D | SR2.??? |
| Resist Pain L | H | M | P | (F/2)M | SR2.??? |
| Resist Pain M | H | M | P | (F/2)S | SR2.??? |
| Resist Paint S | H | M | P | (F/2)D | SR2.??? |
| Stabilize | H | P | P | (F/2)S | SR2.??? |
| Treat | H | M | P | (F/2)(Wound Level) | SR2.155 |
| Treat L Wounds | H | M | P | [(F/2)-1]L | SR2.??? |
| Treat M Wounds | H | M | P | [(F/2)-1]M | SR2.??? |
| Treat S Wounds | H | M | P | [(F/2)-1]S | SR2.??? |
| Treat D Wounds | H | M | P | [(F/2)-1]D | SR2.??? |
| Water Breathing | H | P | S | [(F/2)+2]L | SR2.??? |
| Agonizing Pain | I | M | S | [(F/2)+1]M | SR2.??? |
| Aural Entertainment | I | P | S | [(F/2)+2]L | SR2.??? |
| Blackout | I | P | S | [(F/2)+2]M | SR2.??? |
| Black Wall | I | P | S | [(F/2)+1]M | SR2.??? |
| Camouflage | I | P | S | [(F/2)+2]L | SR2.??? |
| Chaff | I | P | S | [(F/2)-1]S | SR2.??? |
| Chaos | I | P | S | [(F/2)+2]M | SR2.155 |
| Chaotic World | I | P | S | [(F/2)+2]S | SR2.155 |
| Confusion | I | M | S | (F/2)S | SR2.155 |
| Crowd Scene | I | P | S | [(F/2)+2]M | SR2.??? |
| Displacement | I | P | S | [(F/2)+1]S | SR2.??? |
| Disregard | I | M | S | (F/2)M | SR2.??? |
| Distant Invisibility | I | M | S | [(F/2)+1]M | SR2.??? |
| Dream | I | M | S | (F/2)L | SR2.??? |
| Entertainment | I | M | S | [(F/2)+1]L | SR2.156 |
| Fake Death | I | P | S | [(F/2)+2]M | SR2.??? |
| Flare | I | P | I | [(F/2)+1]M | SR2.??? |
| Flash | I | P | I | [(F/2)+1]M | SR2.??? |
| Hide Vehicle | I | P | S | (F/2)M | SR2.??? |
| Holograph | I | P | P | [(F/2)+2]L | SR2.??? |
| Illusionary Barrier | I | P | S | [(F/2)+2]L | SR2.??? |
| Improved Invisibility | I | P | S | [(F/2)+1]M | SR2.156 |
| Invisibility | I | M | S | (F/2)M | SR2.156 |
| Mask | I | M | S | (F/2)L | SR2.156 |
| Maya's Flame Burst | I | P | I | [(F/2)+1]L | SR2.??? |
| Misinformation | I | M | S | [(F/2)+1]S | SR2.??? |
| Overstimulation | I | M | S | [(F/2)+1]M | SR2.??? |
| Peregrine's Magnificent Ill. | I | P | S | [(F/2)+2]S | SR2.??? |
| Phantasmal Force | I | M | S | [(F/2)+1]S | SR2.??? |
| Phantom Bolt | I | P | I | [(F/2)+1]M | SR2.??? |
| Physical Mask | I | P | S | [(F/2)+1]L | SR2.??? |
| Reflections | I | P | S | [(F/2)+2]S | SR2.??? |
| Silence | I | P | S | [(F/2)+2]S | SR2.??? |
| Spectacle | I | M | S | [(F/2)+1]M | SR2.??? |
| Stimulation | I | M | S | [(F/2)+1]L | SR2.156 |
| Stink | I | M | S | [(F/2)+1]S | SR2.156 |
| Trid Entertainment | I | P | S | [(F/2)+2]L | SR2.??? |
| Trid Spectacle | I | P | S | [(F/2)+2]M | SR2.??? |
| Undetectable Lie | I | P | S | [(F/2)+2]M | SR2.??? |
| Vehicle Mask | I | P | S | (F/2)L | SR2.??? |
| Video | I | P | P | [(F/2)+1]M | SR2.??? |
| Voicechange | I | P | S | [(F/2)+2]M | SR2.??? |
| Acid | M | P | I | [(F/2)+1]S | SR2.??? |
| Acid Bomb | M | P | I | [(F/2)+1]D | SR2.??? |
| Acid Stream | M | P | I | [(F/2)+1]D | SR2.??? |
| Alter Temperature | M | P | S | [(F/2)+2]S | SR2.??? |
| Animate | M | P | S | [(F/2)+2]M | SR2.??? |
| Armor | M | P | S | [(F/2)+2]M | SR2.151 |
| Arrow Barrier | M | P | S | [(F/2)+2]M | SR2.??? |
| Astral Static | M | M | S | [(F/2)+1]D | SR2.??? |
| Barrier | M | P | S | [(F/2)+2]S | SR2.151 |
| Bind | M | P | S | [(F/2)+2]S | SR2.??? |
| Biophysical Armor | M | M | S | [(F/2)+1]M | SR2.??? |
| Blade Barrier | M | P | S | [(F/2)+2]M | SR2.??? |
| Blast Barrier | M | P | S | [(F/2)+2]M | SR2.??? |
| Blindness | M | P | S | [(F/2)+2]M | SR2.??? |
| Blunder | M | M | I | (F/2)D | SR2.??? |
| Bug Barrier | M | M | S | [(F/2)+2]D | SR2.??? |
| Bullet Barrier | M | P | S | [(F/2)+2]M | SR2.??? |
| Calm Animal | M | M | S | [(F/2)+2]L | SR2.??? |
| Catfall | M | P | S | [(F/2)+2]L | SR2.??? |
| Chained Lightning | M | P | I | [(F/2)+3]D | SR2.??? |
| Clean Air | M | P | I | [(F/2)+1]S | SR2.??? |
| Clean Water | M | P | P | (F/2)S | SR2.??? |
| Clout | M | P | I | (F/2)M | SR2.??? |
| Compel Truth | M | M | S | [(F/2)+2]L | SR2.??? |
| Control Actions | M | M | S | [(F/2)+2]S | SR2.156 |
| Control Animal | M | M | S | [(F/2)+2]D | SR2.??? |
| Control Emotion | M | M | S | [(F/2)+2]M | SR2.156 |
| Control Fire | M | P | S | [(F/2)+2]S | SR2.??? |
| Control Thoughts | M | M | S | [(F/2)+2]D | SR2.157 |
| Corpse Cadavre | M | P | P | [(F/2)+2]S | SR2.??? |
| (Critter) Form | M | P | S | [(F/2)+2]M | SR2.??? |
| Deafness | M | P | S | [(F/2)+2]M | SR2.??? |
| Deflect | M | P | S | [(F/2)+1]S | SR2.??? |
| Existential Blues | I | M | S | [(F/2)+2]M | SR2.??? |
| Extinguish Fire | M | P | I | [(F/2)+1]S | SR2.??? |
| False Memory | M | M | P | [(F/2)+2]S | SR2.??? |
| Fashion | M | P | P | [(F/2)+2]M | SR2.??? |
| FireFlies | M | P | S | [(F/2)+2]D | SR2.??? |
| Fire Strike | M | P | I | [(F/2)+3]D | SR2.??? |
| Firewall | M | P | S | [(F/2)+2]D | SR2.??? |
| Fix | M | P | P | [(F/2)+1]M | SR2.??? |
| Flame Aura | M | P | S | [(F/2)+2]M | SR2.??? |
| Flame Barrier | M | P | S | [(F/2)+3]M | SR2.??? |
| Flame Bomb | M | P | I | [(F/2)+1]D | SR2.158 |
| Flame Burst | M | P | I | [(F/2)+1]D | SR2.??? |
| Flamethrower | M | P | I | [(F/2)+1]S | SR2.158 |
| Flight | M | P | S | [(F/2)+2]M | SR2.??? |
| Fling | M | P | I | (F/2)M | SR2.??? |
| Flying Ball | M | P | I | [(F/2)+1]S | SR2.??? |
| Forced Truth | M | M | S | (F/2)M | SR2.??? |
| Freeze Water | M | P | I | [(F/2)+1]S | SR2.??? |
| Gecko Crawl | M | P | S | [(F/2)+1]M | SR2.??? |
| Glue | M | P | S | [(F/2)+2]S | SR2.??? |
| Gravity Restriction | M | P | S | [(F/2)+8]D | SR2.??? |
| Heat Shield | M | P | S | [(F/2)+2]M | SR2.??? |
| Hibernate | M | P | S | (F/2)S | SR2.157 |
| Ice Sheet | M | P | I | [(F/2)+1]S | SR2.158 |
| Ignite | M | P | P | [(F/2)+2]D | SR2.158 |
| Improved Mauler v1.2 | M | P | I | [(F/2)+4]D | SR2.??? |
| Influence | M | M | P | [(F/2)+2]S | SR2.??? |
| Insect Barrier | M | P | S | [(F/2)+1]M | SR2.??? |
| Levitate Item | M | P | S | [(F/2)+1]L | SR2.157 |
| Levitate Person | M | P | S | [(F/2)+1]M | SR2.157 |
| Lift & Push | M | P | I | (F/2)M | SR2.??? |
| Light | M | P | S | [(F/2)+2]M | SR2.155 |
| Lightning | M | P | I | [(F/2)+1]S | SR2.??? |
| Light Ray | M | M | I | [(F/2)+1]D | SR2.??? |
| Limited Fireball | M | P | I | [(F/2)+1]D | SR2.??? |
| Lock | M | P | S | [(F/2)+2]M | SR2.??? |
| Magesword | M | M | S | [(F/2)+1]S | SR2.??? |
| Magesword II | M | P | S | [(F/2)+2]S | SR2.??? |
| Magic Fingers | M | P | S | [(F/2)+2]M | SR2.157 |
| Makeover | M | P | P | [(F/2)+2]M | SR2.??? |
| Mana Barrier | M | M | S | [(F/2)+1]S | SR2.158 |
| Mental Armor | M | M | S | [(F/2)+1]M | SR2.??? |
| Mental Shield | M | M | S | [(F/2)+1]M | SR2.??? |
| Mental Shields | M | M | S | [(F/2)+2]L | SR2.??? |
| Meteor Strike | M | P | I | [(F/2)+6]D | SR2.??? |
| Mist | M | P | S | [(F/2)+2]S | SR2.??? |
| Mob Mind | M | M | S | [(F/2)+3]S | SR2.??? |
| Mob Mood | M | M | S | [(F/2)+2]M | SR2.??? |
| Movement | M | P | S | [(F/2)+2]S | SR2.158 |
| Net | M | P | S | [(F/2)+2]D | SR2.??? |
| One-Way Barrier | M | P | S | [(F/2)+3]M | SR2.??? |
| Pathkeeper | M | P | S | [(F/2)+2]M | SR2.??? |
| Peregrine's Energy Web | M | M | S | (F/2)D | SR2.??? |
| Personal Barrier | M | P | S | [(F/2)+2]M | SR2.??? |
| Personal Blade Barrier | M | P | S | [(F/2)+2]L | SR2.??? |
| Personal Blast Barrier | M | P | S | [(F/2)+2]L | SR2.??? |
| Personal Bullet Barrier | M | P | S | [(F/2)+2]L | SR2.??? |
| Personal Heat Shield | M | P | S | [(F/2)+2]L | SR2.??? |
| Personal Mana Barrier | M | M | S | [(F/2)+1]M | SR2.??? |
| Personal Spell Barrier | M | M | S | [(F/2)+1]L | SR2.??? |
| Petrify | M | P | S | [(F/2)+2]S | SR2.??? |
| Poltergeist | M | P | S | [(F/2)+1]S | SR2.156 |
| Possession | M | M | S | [(F/2)+3]S | SR2.??? |
| Protection From Cold | M | P | S | [(F/2)+1]S | SR2.??? |
| Protection From Electricity | M | P | S | [(F/2)+1]S | SR2.??? |
| Protection From Fire | M | P | S | [(F/2)+1]S | SR2.??? |
| Protection From Heat | M | P | S | [(F/2)+1]S | SR2.??? |
| Quickmove | M | P | I | [(F/2)+1]S | SR2.??? |
| Rain: Drizzle | M | P | S | (F/2)L | SR2.??? |
| Rain: Steady | M | P | S | (F/2)M | SR2.??? |
| Rain: Heavy | M | P | S | (F/2)S | SR2.??? |
| Rain: Tropical Downpour | M | P | S | (F/2)D | SR2.??? |
| Rebound Magic | M | M | S | [(F/2)+1]S | SR2.??? |
| Rebound Melee | M | P | S | [(F/2)+2]S | SR2.??? |
| Remote Control | M | P | I | [(F/2)+1]M | SR2.??? |
| Rubber Skin | M | P | S | [(F/2)+2]M | SR2.??? |
| Sap Strength | M | P | S | [(F/2)+2]S | SR2.??? |
| Seal | M | P | S | [(F/2)+2]S | SR2.??? |
| Shadow | M | P | S | [(F/2)+2]M | SR2.158 |
| Shapechange | M | P | S | [(F/2)+2]S | SR2.??? |
| Shape Earth | M | P | S | [(F/2)+2]D | SR2.??? |
| Shape Water | M | P | S | [(F/2)+2]D | SR2.??? |
| Small Meteors | M | P | S | [(F/2)+2]S | SR2.??? |
| Smoke Cloud | M | P | S | [(F/2)+3]D | SR2.??? |
| Sound Barrier | M | P | S | [(F/2)+2]S | SR2.??? |
| Spark | M | P | I | [(F/2)+1]M | SR2.158 |
| Spell Barrier | M | M | S | [(F/2)+1]M | SR2.??? |
| Spirit Barrier | M | M | S | [(F/2)+2]M | SR2.??? |
| Steel Skin | M | P | S | [(F/2)+2]S | SR2.??? |
| Stoplight Control | M | P | S | [(F/2)+2]L | SR2.??? |
| Suffer | M | P | S | [(F/2)+2]D | SR2.??? |
| Teleportation | M | P | I | (F/2)S | SR2.??? |
| Temper | M | P | S | [(F/2)+1]M | SR2.??? |
| Temporary L Insanity | M | M | S | [(F/2)+3]L | SR2.??? |
| Temporary M Insanity | M | M | S | [(F/2)+3]M | SR2.??? |
| Temporary S Insanity | M | M | S | [(F/2)+3]S | SR2.??? |
| Temporary D Insanity | M | M | S | [(F/2)+3]D | SR2.??? |
| Terrorize | M | M | S | [(F/2)+2]S | SR2.??? |
| Thunderclap | M | P | I | (F/2)S | SR2.??? |
| Toxic Wave | M | P | I | [(F/2)+3]D | SR2.??? |
| Transform | M | P | S | [(F/2)+2]S | SR2.??? |
| Turn Marble To Bat | M | P | S | [(F/2)+2]L | SR2.??? |
| Turn To Goo | M | P | P | [(F/2)+1]S | SR2.??? |
| Use (Skill) | M | P | S | [(F/2)+3]L | SR2.??? |
| Wall Of Fire | M | P | S | [(F/2)+2]S | SR2.??? |
| Warplight | M | P | S | [(F/2)+3]M | SR2.??? |
| Weather Guard | M | P | S | [(F/2)+2]S | SR2.??? |
| Wind | M | P | I | [(F/2)+1]S | SR2.??? |
| X-Ray Specs | M | P | S | [(F/2)+2]M | SR2.??? |


### Adept Powers (system list)
| Power | Cost | Notes | Book |
| --- | --- | --- | --- |
| Astral Perception | 2.0 |  | sr2.??? |
| Attribute Boost (BOD) +1 | 0.5 |  | gr2.??? |
| Attribute Boost (QCK) +1 | 0.5 |  | gr2.??? |
| Attribute Boost (STR) +1 | 0.5 |  | gr2.??? |
| Blind Fighting | 0.5 |  | aw.??? |
| Body control +1 level | 0.5 |  | gr2.??? |
| Combat Sense +1 | 2.0 |  | sr2.??? |
| Combat Sense +2 | 3.0 |  | sr2.??? |
| Combat Sense +3 | 4.0 |  | sr2.??? |
| Counterstrike Lv1 | 0.5 |  | aw.??? |
| Counterstrike Lv2 | 1.0 |  | aw.??? |
| Counterstrike Lv3 | 1.5 |  | aw.??? |
| Counterstrike Lv4 | 2.0 |  | aw.??? |
| Counterstrike Lv5 | 2.5 |  | aw.??? |
| Counterstrike Lv6 | 3.0 |  | aw.??? |
| Delay Damage | 2.5 |  | aw.??? |
| Distance Strike | 2.0 |  | aw.??? |
| Empathic Sense | 0.5 |  | aw.??? |
| Enhanced Centering (x skill) | 2.0 |  | gr2.??? |
| Enhanced Coordination Lv1 | 0.25 |  | aw.??? |
| Enhanced Coordination Lv2 | 0.5 |  | aw.??? |
| Enhanced Coordination Lv3 | 0.75 |  | aw.??? |
| Enhanced Coordination Lv4 | 1.0 |  | aw.??? |
| Enhanced Coordination Lv5 | 1.25 |  | aw.??? |
| Enhanced Coordination Lv6 | 1.5 |  | aw.??? |
| Enhanced smell | 0.25 |  | sr2.??? |
| Enhanced taste | 0.25 |  | sr2.??? |
| Flexibility Lv1 | 0.25 |  | aw.??? |
| Flexibility Lv2 | 0.5 |  | aw.??? |
| Flexibility Lv3 | 0.75 |  | aw.??? |
| Flexibility Lv4 | 1.0 |  | aw.??? |
| Flexibility Lv5 | 1.25 |  | aw.??? |
| Flexibility Lv6 | 1.5 |  | aw.??? |
| FreeFall Lv1 | 0.25 |  | aw.??? |
| FreeFall Lv2 | 0.5 |  | aw.??? |
| FreeFall Lv3 | 0.75 |  | aw.??? |
| FreeFall Lv4 | 1.0 |  | aw.??? |
| FreeFall Lv5 | 1.25 |  | aw.??? |
| FreeFall Lv6 | 1.5 |  | aw.??? |
| High frequency hearing | 0.25 |  | sr2.??? |
| Improved Armed Combat +1 | 0.5 |  | sr2.??? |
| Improved Athletic Skills +1 | 0.25 |  | sr2.??? |
| Improved Body +1 | Varies (see cost table) |  | sr2.??? |
| Improved Firearms +1 | 1.0 |  | sr2.??? |
| Improved Gunnery +1 | 1.0 |  | sr2.??? |
| Improved Project. weapons +1 | 0.5 |  | sr2.??? |
| Improved Quickness +1 | Varies (see cost table) |  | sr2.??? |
| Improved Stealth +1 | 0.25 |  | sr2.??? |
| Improved Strength +1 | Varies (see cost table) |  | sr2.??? |
| Improved Throwing +1 | 0.5 |  | sr2.??? |
| Improved Unarmed Combat +1 | 0.5 |  | sr2.??? |
| Increased Reaction +1 | Varies (see cost table) |  | sr2.??? |
| Increased Reflexes +1D6 | 1.0 |  | sr2.??? |
| Increased Reflexes +2D6 | 4.0 |  | sr2.??? |
| Increased Reflexes +3D6 | 6.0 |  | sr2.??? |
| Iron Will Lv1 | 0.5 |  | aw.??? |
| Iron Will Lv2 | 1.0 |  | aw.??? |
| Iron Will Lv3 | 1.5 |  | aw.??? |
| Iron Will Lv4 | 2.0 |  | aw.??? |
| Iron Will Lv5 | 2.5 |  | aw.??? |
| Iron Will Lv6 | 3.0 |  | aw.??? |
| Killing Hands (Str)D | 4.0 |  | sr2.??? |
| Killing Hands (Str)L | 0.5 |  | sr2.??? |
| Killing Hands (Str)M | 1.0 |  | sr2.??? |
| Killing Hands (Str)S | 2.0 |  | sr2.??? |
| Low frequency hearing | 0.25 |  | sr2.??? |
| Low-light vision | 0.25 |  | sr2.??? |
| Magic Resistance Lv1 | 1.0 |  | aw.??? |
| Magic Resistance Lv2 | 2.0 |  | aw.??? |
| Magic Resistance Lv3 | 3.0 |  | aw.??? |
| Magic Resistance Lv4 | 4.0 |  | aw.??? |
| Magic Resistance Lv5 | 5.0 |  | aw.??? |
| Magic Resistance Lv6 | 6.0 |  | aw.??? |
| Magic Sense | 1.0 |  | aw.??? |
| Magnification Vision 1 | 0.25 |  | sr2.??? |
| Magnification Vision 2 | 0.5 |  | sr2.??? |
| Magnification Vision 3 | 0.75 |  | sr2.??? |
| Missile Mastery | 1.0 |  | aw.??? |
| Missile Parry | 1.0 |  | gr2.??? |
| Mystic Armor +1 rating | 1.0 |  | gr2.??? |
| Nerve Strike | 1.0 |  | aw.??? |
| Pain Resistance +1 level | 0.5 |  | sr2.??? |
| Quick Draw | 3.0 |  | aw.??? |
| Quick Strike Lv1 | 0.25 |  | aw.??? |
| Quick Strike Lv2 | 0.5 |  | aw.??? |
| Quick Strike Lv3 | 0.75 |  | aw.??? |
| Quick Strike Lv4 | 1.0 |  | aw.??? |
| Quick Strike Lv5 | 1.25 |  | aw.??? |
| Quick Strike Lv6 | 1.5 |  | aw.??? |
| Rapid Healing Lv1 | 0.5 |  | aw.??? |
| Rapid Healing Lv2 | 1.0 |  | aw.??? |
| Rapid Healing Lv3 | 1.5 |  | aw.??? |
| Rapid Healing Lv4 | 2.0 |  | aw.??? |
| Rapid Healing Lv5 | 2.5 |  | aw.??? |
| Rapid Healing Lv6 | 3.0 |  | aw.??? |
| Rooting Lv1 | 0.25 |  | aw.??? |
| Rooting Lv2 | 0.5 |  | aw.??? |
| Rooting Lv3 | 0.75 |  | aw.??? |
| Rooting Lv4 | 1.0 |  | aw.??? |
| Rooting Lv5 | 1.25 |  | aw.??? |
| Rooting Lv6 | 1.5 |  | aw.??? |
| Sixth Sense | 3.0 |  | aw.??? |
| Smashing Blow | 1.0 |  | aw.??? |
| Spell Shroud Lv1 | 0.25 |  | aw.??? |
| Spell Shroud Lv2 | 0.5 |  | aw.??? |
| Spell Shroud Lv3 | 0.75 |  | aw.??? |
| Spell Shroud Lv4 | 1.0 |  | aw.??? |
| Spell Shroud Lv5 | 1.25 |  | aw.??? |
| Spell Shroud Lv6 | 1.5 |  | aw.??? |
| Suspended State | 1.0 |  | gr2.??? |
| Temperature Tolerance Lv1 | 0.25 |  | aw.??? |
| Temperature Tolerance Lv2 | 0.5 |  | aw.??? |
| Temperature Tolerance Lv3 | 0.75 |  | aw.??? |
| Temperature Tolerance Lv4 | 1.0 |  | aw.??? |
| Temperature Tolerance Lv5 | 1.25 |  | aw.??? |
| Temperature Tolerance Lv6 | 1.5 |  | aw.??? |
| Thermographic vision | 0.25 |  | sr2.??? |
| Traceless Walk | 0.5 |  | aw.??? |

### Totems
| Totem | Environment | Advantages | Disadvantages |
| --- | --- | --- | --- |
| Adversary | Everywhere | +2 dice for combat and manipulation spells | If wounded, Adversary shamans go berserk in the same way as Bear shamans (p. 163, SR3). Adversary shamans must succeed in a Willpower (8) Test to be friendly and civil to authority figures. |
| Bacchus | Anywhere on land | +2 dice for illusion spells, +2 dice for spirits of man | A Bacchus shaman must succeed in a Willpower (6) Test to continue on a course of action if something more interesting, prettier or more relaxing presents itself. Additionally, Bacchus shamans are easily distracted; apply a -1 Perception die modifier whenever a Bacchus shaman is in the presence of music, art, motion or great beauty. |
| Badger | Forest | +2 dice for combat spells, +2 dice for forest spirits | Badger shamans may go berserk in combat, the same as Bear shamans |
| Bat | Anywhere | +2 dice for detection and manipulation spells, +1 die for spirits of the sky | +2 to all magical target numbers when in direct sunlight. |
| Bear | Forest | +2 dice for health spells, +2 dice for forest spirits | Bear shamans can go berserk when wounded. Whenever a Bear shaman takes physical damage in combat, the player makes a Willpower (4) Test. The shaman goes berserk for 3 turns, minus 1 turn per success. Three or more successes avert the berserk rage entirely. A berserk shaman will attack the closest living thing, friend or foe, using the most powerful weapons available (mundane or magical). If the shaman incapacitates a target before the time is up, the berserk fury dissipates. |
| Boar | Forest | +2 dice for combat spells, +1 service from any spirit summoned for combat purposes | -1 die for illusion spells. Boar shamans must make a Willpower (6) Test to withdraw from conflict. |
| Buffalo | Plains | +2 dice for health spells, +2 dice for prairie spirits | :-1 die for illusion spells |
| Bull | Forest, mountains or plains | +2 dice for health spells, +1 die for combat and detection spells | A Bull shaman must have a minimum Charisma of 4. |
| Cat | Urban | +2 dice for illusion spells, +2 dice for city spirits | +1 to all Mental target numbers if dirty or unkempt. An unwounded Cat shaman must make a Willpower (6) Test when casting a damaging spell. If the test fails, the shaman must cast her least-damaging spell (at its minimum damage level, for a variable damage spell, and at 1/2 Force). If the shaman is wounded, all this playing around stops. |
| Cheetah | Savannah | +2 dice for combat spells, +2 dice for savannah (prairie) spirits | -1 die for health spells. Cheetah shamans must have a minimum Reaction of 4. |
| Cobra | Jungle | +2 dice to combat and illusion spells, +1 die for jungle (forest) spirits | If surprised (p. 108, SR3), a Cobra shaman adds a +1 modifier to all target numbers for the remainder of that combat. |
| Coyote | Anywhere on land | None | None |
| Crab | On or by the sea | +2 dice for sea spirits, +1 die for all Damage Resistance Tests (including Drain Tests) | -1 die for illusion spells. A Crab shaman must make a Willpower (6) Test to change his mind, much like Dog (p. 164, SR3). |
| Creator | Urban or forest | +2 dice for enchanting, +1 die for hearth and city spirits | -1 die for combat spells. When confronted with something unusual or unique, a Creator shaman must make a Willpower (4) Test to avoid immediately using astral perception to examine the new find for 3 turns. Each success on the Willpower Test reduces this time by one turn, and 3 or more successes allow the shaman to ignore the impulse. |
| Crocodile | On or by the sea | +2 dice for combat spells, +1 die for illusion spells, +2 dice for sea spirits | Crocodile shamans may go berserk in the same way as Shark shamans (p. 166, SR3). |
| Dark King | Natural caves | +2 dice for health spells, +2 dice for spirits of man | : Followers of the Dark King are physically weak, having suffered great trials. They must sacrifice 1 point from a starting physical Attribute. |
| Dog | Urban | +2 dice for detection spells, +2 dice for field and hearth spirits | : A Dog shaman must make a Willpower (6) Test to change a declared course of action. The test requires a Complex Action as Dog struggles to change his mind. |
| Dolphin | : On or by the sea | +2 dice for detection spells, +2 dice for sea spirits | -1 die for combat spells |
| Dove | Forests and Savannah | +2 dice for health spells, +1 die for detection spells, +1 die for spirits of the sky | Dove shamans cannot cast combat spells. They hate the thought of hurting others and must make a successful Willpower (6) Test to purposely inflict physical damage on a metahuman. |
| Dragonslayer | Anywhere on land | +3 dice for combat spells, +1 die for hearth spirits | -1 die for illusion and detection spells |
| Eagle | Mountains | +2 dice for detection spells, +2 dice for all spirits of the sky | Double the Essence loss caused by adding cyberware because of the psychological impact this has on the Eagle shaman. |
| Elk | Plains, forests and tundra | +1 die for health spells, +1 die for spell defense, +2 dice for spirits of the land | -2 dice for combat spells |
| Fenrir | Forests | +3 dice for combat spells, +1 die for forest spirits | : Fenrir shamans must make a Willpower (8) Test to back down or flee from any confrontation. If wounded, a Fenrir shaman goes berserk in the same manner as a Bear shaman (p. 163, SR3). |
| Fire-Bringer | Urban | +2 dice for detection and manipulation spells, +2 dice for spirits of man | -1 die for illusion spells |
| Fish | On or near water | +2 dice for detection spells, +2 dice for one spirits of the waters (shaman's choice) | -1 die for combat spells |
| Fox | Anywhere on land | +2 dice for illusion spells, +2 dice for any one spirit of the land or spirit of man (shaman's choice) | -1 die for combat spells. A Fox shaman must make a Willpower (6) Test to spare a fallen enemy. |
| Gargoyle | Urban | +1 die for detection and illusion spells, +2 dice for city spirits | -1 die for spirits of the waters. Gargoyle shamans must live in either a skyscraper or castlelike structure, which usually requires a high or luxury lifestyle (p. 240, SR3). Their homes always feature some sort of accessible perch, walkway or balcony near the roof. |
| Gator | Swamp, river or urban | +2 dice for combat and detection spells. As a wilderness totem +2 dice for swamp, lake or river spirits (shaman's choice). As an urban totem, +2 dice for city spirits. | -1 die for illusion spells. It takes a Willpower (6) Test for a Gator shaman to break off a fight, chase or other direct action. |
| Gecko | Anywhere | +2 dice for illusion or manipulation spells (shaman's choice), +1 die for resisting any type of poison | -1 die for combat spells |
| Goose | Anywhere near wate | +2 dice for detection spells, +1 die for combat spells, +2 dice for a single spirit of the land, sky or waters (shaman's choice) | Goose shamans know their chosen territory well. Away from their home city or region, however, they suffer +2 to all magical target numbers. If the shaman moves to a new home, it takes a full turn of the moon (28 days) to acclimate to the new locale and eliminate the penalty. |
| Great Mother | Anywhere | +2 dice for health spells, +2 dice for field and forest spirits and all spirits of the waters | -2 dice when in the presence of corruption |
| Griffin | Mountains | +2 dice for combat spells, +2 dice for spirits of the sky | : Any time a Griffin shaman is insulted or offended, unless he succeeds in a Willpower (6) Test, the shaman will fly into a frenzy and attack the target. |
| Horned Man | Anywhere on land | +2 dice for combat spells, +2 dice for all spirits of the land | Shamans of the Horned Man must make a Willpower (6) Test to refuse a fight or physical contest. They are also lecherous and must make a Willpower Test against a target number equal to twice a seducer's Charisma to refuse any advances. |
| Horse | Prairie | +2 dice for health spells, +2 dice for prairie spirits. Horse shaman initiates can also attempt to learn the Movement critter power (self only, three times a day; see p.265, SR3) as a metamagical technique. | -1 die when resisting combat or illusion spells (shaman must choose at character creation). |
| Hyena | Savannah | +2 dice for combat spells, +2 dice for Banishing any spirits | -1 die for health spells. Must make a Willpower (6) Test to perform an action with no benefit to herself. |
| Jackal | Savannah | +2 dice for detection and illusion spells, +2 dice for savannah (prairie) spirits | -1 die for all combat spells |
| Jaguar | Jungle | +2 dice for detection spells, +2 dice for forest spirits | -1 die for health spell |
| Leopard | Forest and savannah | +2 dice for combat and health spells, +2 dice for all nature spirits at night | -1 die for resisting illusion spells |
| Leviathan | On or near the sea | +1 die for health and manipulation spells, +2 dice for sea spirits | -1 die for illusion spells |
| Lion | Prairie | +2 dice for combat spells, +2 dice for prairie spirits | -1 die for health spells |
| Lizard | Desert, forest or mountains | +2 dice for health spells, +2 dice for desert, forest or mountain spirits (shaman's choice) | +2 to all target numbers while in tight quarters. When trapped in a confined place with no clear view of the sky, a Lizard shaman must make a Willpower (6) Test. The shaman flies into a berserk panic for 3 turns, minus 1 turn for every success generated on the Willpower Test. While in a panic, the shaman will do everything possible to get out of the enclosed space |
| Lover | Urban | +2 dice for illusion and control manipulation spells, +2 dice for spirits of the waters | Followers must have a minimum Charisma of 6 |
| Monkey | Forest | +2 dice for manipulation spells, +2 dice for spirits of man | -1 die for combat spells |
| Moon | Wild places far from civilization, or the hidden corners of the city | +2 dice for illusion and transformation manipulation spells, +1 die for detection spells, +1 die for spirits of the waters | -1 die for combat spells. Moon shamans must make a Willpower (6) Test in order to engage in direct confrontation. Negotiation is not considered confrontation (Moon loves discussion), but arguments do fall into that category. |
| Moon Maiden | Anywhere | None | None |
| Mountain | Mountain | +2 dice for manipulation spells, +2 dice for mountain spirits | -1 die for illusion spells. A Mountain shaman must make a Willpower (6) Test to change a course of action once it is chosen. |
| Mouse | Urban or fields | +2 dice for detection and health spells, +2 dice for hearth and field spirits. | -2 dice for combat spells |
| Oak | Forest | +2 dice for health spells, +2 dice for forest spirits, +2 dice for hearth spirits in any structure built mostly of oak | An Oak shaman must have a minimum Strength and Body of 4. |
| Otter | On or near water | +2 dice for illusion spells, +2 dice for river or sea spirits (shaman's choice) | -1 die for combat spells |
| Owl | Anywhere | +2 dice for any Sorcery or Conjuring at night | +2 to all magical target numbers during the daytime. |
| Parrot | Jungle | +2 dice to illusion spells, +2 dice to jungle (forest) spirits | Parrot's magic exists to bring applause. Apply a +1 modifier to all magical target numbers when a Parrot shaman's magical actions are not witnessed by someone who can be impressed by them. |
| Pegasus | Rural area under the open sky | +2 dice to detection and health spells, +2 dice for spirits of the sky | Pegasus shamans cannot bear captivity or limits on their freedom of movement. If they voluntarily enter a building or enclosed area, they must make a Willpower (6) Test to remain inside. If they fail, they still may stay inside but receive +1 to all target numbers while inside. Every (Willpower) hours the shaman must repeat this test. Additional failures add a cumulative +1 modifier to all tests. If the modifiers reach +8, the shaman enters a death frenzy. A Pegasus shaman involuntarily confined (imprisoned, caught in a natural disaster, and so on) automatically suffers a +1 penalty to all target numbers. This penalty increases by 1 every (Willpower) hours. When the modifiers reach +8, he enters a death frenzy. Additionally, an imprisoned Pegasus shaman must make a Willpower (6) Test every (Willpower) hours or enter a death frenzy. death frenzy. The shaman will immediately try to escape confinement. He does not fight unless opponents try to stop him. The gamemaster keeps a secret running total of any damage the shaman takes during the frenzy, though neither that damage nor any penalties apply. If the character's damage exceeds the Physical column of the Condition Monitor and his Body Rating, the shaman continues to live for a number of minutes equal to his Willpower, still possessed by the frenzy, then dies. If the shaman succeeds in escaping, the frenzy ends a number of minutes later equal to his Willpower. All damage taken during the frenzy takes effect at that moment. If the damage is enough to kill the shaman, he or she dies. |
| Phoenix | Desert and fields | All Phoenix shamans summon spirits of the flames (MITS. p.105) instead of spirits of man. +1 die for health and illusion spells, +2 dice for spirits of the flames (p. 105). Phoenix shamans have a reputation, like their totem, for rising from the ashes. They can survive physical overflow damage of Body x 2. Each time the shaman's damage overflows the Physical column of the Condition Monitor, however, reduce the total by 1. Over time, this can effectively reduce the shaman to having no overflow at all. | Phoenix shamans cannot summon spirits of man. They must have a minimum Charisma of 4. Phoenix shamans must also know a performance skill such as a musical instrument, singing or dance, which may be used as a geas or as a creative skill used for centering (MITS. p. 72). |
| Plumed Serpent | Anywhere in Aztlan | +2 dice for detection spells, +2 dice for spirits of the sky | +2 to all magical target numbers outside the territorial borders of Aztlan |
| Polecat | Anywhere on land | +1 die for combat spells (+1 more die for combat spells at night), +2 dice for spirits of the land | -1 die for health spells. In combat, a Polecat shaman will single-mindedly continue to attack an opponent until they are downed, ignoring other opponents; the shaman must make a Willpower (6) Test to break off the attack. |
| Prairie Dog | Anywhere on land | +2 dice for detection spells, +1 die for illusion spells, +2 dice for spirits of the land | -2 dice for combat spells. Prairie Dog shamans must have a minimum Charisma of 4. |
| Puma | Any isolated wilderness location except the desert | +2 dice for illusion spells, +2 dice for mountain spirits | 2 to all magical target numbers when in direct sunlight or in crowds |
| Python | Jungle | +2 dice for health and control manipulation spells, +2 dice for jungle (forest) spirits | A Python shaman must make a successful Willpower (6) Test to break off combat or any other sustained activity. |
| Raccoon | Anywhere but the desert | +2 dice for manipulation spells, +2 dice for city spirits | -1 die for combat spells |
| Rat | Urban | +2 dice for detection and illusion spells, +2 dice for city spirits | -1 die for combat spells |
| Raven | Anywhere under the open sky | +2 dice for manipulation spells, +2 dice for sky spirits | : +1 to all magical target numbers while not under the open sky |
| Scorpion | Desert | +2 dice for combat and illusion spells. Scorpion shamans can milk venom from ordinary and Awakened scorpions, and scorpion venom never does more than Light damage to a Scorpion shaman | +2 to all magical target numbers during the day, –1 die for all Conjuring Tests. Scorpion shamans become irritable and depressed when away from their desert homes: +1 to all of the shaman's magical target numbers for each day outside the desert to a maximum of +6. |
| Sea | On or near the sea | +2 dice for health and transformation manipulation spells, +2 dice for sea spirits and ship (hearth) spirits | A Sea shaman does not give anything away for free. She must receive a suitable payment, which is determined by the shaman. A loved one may receive a valuable artifact for the price of a kiss, while someone in disfavor must pay handsomely for the smallest consideration. A Sea shaman is very proud and must make a Willpower (6) Test to avoid answering any slight or insult in kind. |
| Sea King | Anywhere near the sea | +2 dice for manipulation spells, +2 dice for sea spirits | -1 die for combat spells. Sea King shamans also suffer from the Sea Legs Flaw (p. 24, SR Comp), without receiving any compensating Edges or Build Points |
| Seductress | Urban | +2 dice for illusion and control manipulation spells, +2 dice for spirits of man | : Seductress shamans must have a minimum Charisma of 6. They must also succeed in a Willpower (6) Test to avoid indulging themselves when a vice or corruption (drugs, BTLs, sex, and so on) is made available. |
| Shark | On or by the sea | +2 dice for combat and detection spells, +2 dice for sea spirits | Shark shamans can go berserk in combat similar to Bear shamans, when they are wounded or when they kill an opponent (see p. 163). A berserk Shark shaman may, instead of attacking a living target, continue to attack the body of his last victim, if the player chooses. |
| Siren | Sea | +2 dice for illusion and control manipulation spells, +2 dice for sea spirits | Siren shamans must have a minimum Charisma of 6. Sirens have difficulty focusing on more than one opponent at a time; they receive a +1 spellcasting modifier when attacked by more than one foe. |
| Sky Father | Anywhere under the open sky | +2 dice for detection and manipulation spells, +2 dice for storm spirits | +2 to all target numbers if the shaman is entrapped or bound in any way |
| Snake | Anywhere on land | +2 dice for detection, health and illusion spells. As a wilderness totem, +2 dice for any one spirit of the land (shaman's choice). As an urban totem, +2 dice for any one spirit of man (shaman's choice). | -1 die for all spells cast during combat. |
| Spider | The quiet, dark places into which others seldom look | +2 dice for illusion spells, +1 die for all nature spirits | +2 to all magical target numbers in the open, away from immediate shelter. +1 to all target numbers if a Spider shaman does not have sufficient time to plan and consider a situation |
| Stag | Forest | +2 dice for health and illusion spells, +2 dice for forest spirits | -1 die for manipulation spells |
| Stream | Near the shores of a river or stream | +2 dice for health spells, +2 dice for river spirits | -1 die for combat spells |
| Sun | Anywhere under the open sky | +2 dice for combat, detection and health spells. +2 dice for any spirit while in direct sunlight | +2 to all Conjuring target numbers at night. A Sun shaman must have a minimum Charisma of 4. |
| Thunderbird | Under the open sky | +2 dice for combat and detection spells, +2 dice for storm spirits | -1 die for all magical tests while not under open sky. Thunderbird shamans are very moody and subject to bouts of savage fury in the same manner as Shark shamans (p. 166, SR3). |
| Trickster | Anywhere | None | None |
| Turtle | On or near water | : +2 dice for illusion spells, +2 dice for one spirit of the waters (shaman's choice) | -2 dice for combat spells |
| Unicorn | Forest | +2 dice for health and illusion spells, +2 dice for spirits of the land. A Unicorn shaman receives the Aura Reading Skill (p. 86, SR3) for free at one-half his starting Intelligence. The shaman may increase the skill rating using standard rules | Double all Essence losses from cyberware. |
| Whale | On or near the sea | +2 dice for combat spells, +2 dice for sea spirit | -1 die for illusion spells |
| Wild Huntsman | Forest, mountains or plains | +2 dice for detection and illusion spells, +2 dice for storm spirits | Wild Huntsman shamans can go berserk in combat in the same way as Bear shamans (p. 163, SR3). |
| Wind | Anywhere under the open sky | +2 dice for detection spells, +2 dice for spirits of the sky | +2 to all magical target numbers while not under the open sky |
| Wise Warrior | Urban | +2 dice for combat and detection spells, +2 dice for resisting all damaging spells | -1 die for illusion spells |
| Wolf | Forest, prairie or mountains | +2 dice for combat and detection spells, +2 dice for forest, prairie or mountain spirits (shaman's choice) | Wolf shamans can go berserk in combat, similar to Bear shamans (p. 163). |
| Wyrm | Mountains | +2 dice for health and manipulation spells, +2 dice for mountain spirits | Wyrm shamans must make a Willpower (6) Test to quit a task and do something else instead. They must also sleep an average of seventy hours a week. |

### Nature Totems
| Totem | Environment | Advantages | Disadvantages |
| --- | --- | --- | --- |
| Moon | Wild places far from civilization, or the hidden corners of the city | +2 dice for illusion and transformation manipulation spells, +1 die for detection spells, +1 die for spirits of the waters | -1 die for combat spells. Moon shamans must make a Willpower (6) Test in order to engage in direct confrontation. Negotiation is not considered confrontation (Moon loves discussion), but arguments do fall into that category. |
| Mountain | Mountain | +2 dice for manipulation spells, +2 dice for mountain spirits | -1 die for illusion spells. A Mountain shaman must make a Willpower (6) Test to change a course of action once it is chosen. |
| Oak | Forest | +2 dice for health spells, +2 dice for forest spirits, +2 dice for hearth spirits in any structure built mostly of oak | An Oak shaman must have a minimum Strength and Body of 4. |
| Sea | On or near the sea | +2 dice for health and transformation manipulation spells, +2 dice for sea spirits and ship (hearth) spirits | A Sea shaman does not give anything away for free. She must receive a suitable payment, which is determined by the shaman. A loved one may receive a valuable artifact for the price of a kiss, while someone in disfavor must pay handsomely for the smallest consideration. A Sea shaman is very proud and must make a Willpower (6) Test to avoid answering any slight or insult in kind. |
| Stream | Near the shores of a river or stream | +2 dice for health spells, +2 dice for river spirits | -1 die for combat spells |
| Sun | Anywhere under the open sky | +2 dice for combat, detection and health spells. +2 dice for any spirit while in direct sunlight | +2 to all Conjuring target numbers at night. A Sun shaman must have a minimum Charisma of 4. |
| Wind | Anywhere under the open sky | +2 dice for detection spells, +2 dice for spirits of the sky | +2 to all magical target numbers while not under the open sky |

### Mythic Totems
| Totem | Environment | Advantages | Disadvantages |
| --- | --- | --- | --- |
| Fenrir | Forests | +3 dice for combat spells, +1 die for forest spirits | : Fenrir shamans must make a Willpower (8) Test to back down or flee from any confrontation. If wounded, a Fenrir shaman goes berserk in the same manner as a Bear shaman (p. 163, SR3). |
| Gargoyle | Urban | +1 die for detection and illusion spells, +2 dice for city spirits | -1 die for spirits of the waters. Gargoyle shamans must live in either a skyscraper or castlelike structure, which usually requires a high or luxury lifestyle (p. 240, SR3). Their homes always feature some sort of accessible perch, walkway or balcony near the roof. |
| Griffin | Mountains | +2 dice for combat spells, +2 dice for spirits of the sky | : Any time a Griffin shaman is insulted or offended, unless he succeeds in a Willpower (6) Test, the shaman will fly into a frenzy and attack the target. |
| Leviathan | On or near the sea | +1 die for health and manipulation spells, +2 dice for sea spirits | -1 die for illusion spells |
| Pegasus | Rural area under the open sky | +2 dice to detection and health spells, +2 dice for spirits of the sky | Pegasus shamans cannot bear captivity or limits on their freedom of movement. If they voluntarily enter a building or enclosed area, they must make a Willpower (6) Test to remain inside. If they fail, they still may stay inside but receive +1 to all target numbers while inside. Every (Willpower) hours the shaman must repeat this test. Additional failures add a cumulative +1 modifier to all tests. If the modifiers reach +8, the shaman enters a death frenzy. A Pegasus shaman involuntarily confined (imprisoned, caught in a natural disaster, and so on) automatically suffers a +1 penalty to all target numbers. This penalty increases by 1 every (Willpower) hours. When the modifiers reach +8, he enters a death frenzy. Additionally, an imprisoned Pegasus shaman must make a Willpower (6) Test every (Willpower) hours or enter a death frenzy. death frenzy. The shaman will immediately try to escape confinement. He does not fight unless opponents try to stop him. The gamemaster keeps a secret running total of any damage the shaman takes during the frenzy, though neither that damage nor any penalties apply. If the character's damage exceeds the Physical column of the Condition Monitor and his Body Rating, the shaman continues to live for a number of minutes equal to his Willpower, still possessed by the frenzy, then dies. If the shaman succeeds in escaping, the frenzy ends a number of minutes later equal to his Willpower. All damage taken during the frenzy takes effect at that moment. If the damage is enough to kill the shaman, he or she dies. |
| Phoenix | Desert and fields | All Phoenix shamans summon spirits of the flames (MITS. p.105) instead of spirits of man. +1 die for health and illusion spells, +2 dice for spirits of the flames (p. 105). Phoenix shamans have a reputation, like their totem, for rising from the ashes. They can survive physical overflow damage of Body x 2. Each time the shaman's damage overflows the Physical column of the Condition Monitor, however, reduce the total by 1. Over time, this can effectively reduce the shaman to having no overflow at all. | Phoenix shamans cannot summon spirits of man. They must have a minimum Charisma of 4. Phoenix shamans must also know a performance skill such as a musical instrument, singing or dance, which may be used as a geas or as a creative skill used for centering (MITS. p. 72). |
| Plumed Serpent | Anywhere in Aztlan | +2 dice for detection spells, +2 dice for spirits of the sky | +2 to all magical target numbers outside the territorial borders of Aztlan |
| Thunderbird | Under the open sky | +2 dice for combat and detection spells, +2 dice for storm spirits | -1 die for all magical tests while not under open sky. Thunderbird shamans are very moody and subject to bouts of savage fury in the same manner as Shark shamans (p. 166, SR3). |
| Unicorn | Forest | +2 dice for health and illusion spells, +2 dice for spirits of the land. A Unicorn shaman receives the Aura Reading Skill (p. 86, SR3) for free at one-half his starting Intelligence. The shaman may increase the skill rating using standard rules | Double all Essence losses from cyberware. |
| Wyrm | Mountains | +2 dice for health and manipulation spells, +2 dice for mountain spirits | Wyrm shamans must make a Willpower (6) Test to quit a task and do something else instead. They must also sleep an average of seventy hours a week. |

### Idols
| Totem | Environment | Advantages | Disadvantages |
| --- | --- | --- | --- |
| Adversary | Everywhere | +2 dice for combat and manipulation spells | If wounded, Adversary shamans go berserk in the same way as Bear shamans (p. 163, SR3). Adversary shamans must succeed in a Willpower (8) Test to be friendly and civil to authority figures. |
| Bacchus | Anywhere on land | +2 dice for illusion spells, +2 dice for spirits of man | A Bacchus shaman must succeed in a Willpower (6) Test to continue on a course of action if something more interesting, prettier or more relaxing presents itself. Additionally, Bacchus shamans are easily distracted; apply a -1 Perception die modifier whenever a Bacchus shaman is in the presence of music, art, motion or great beauty. |
| Creator | Urban or forest | +2 dice for enchanting, +1 die for hearth and city spirits | -1 die for combat spells. When confronted with something unusual or unique, a Creator shaman must make a Willpower (4) Test to avoid immediately using astral perception to examine the new find for 3 turns. Each success on the Willpower Test reduces this time by one turn, and 3 or more successes allow the shaman to ignore the impulse. |
| Dark King | Natural caves | +2 dice for health spells, +2 dice for spirits of man | : Followers of the Dark King are physically weak, having suffered great trials. They must sacrifice 1 point from a starting physical Attribute. |
| Dragonslayer | Anywhere on land | +3 dice for combat spells, +1 die for hearth spirits | -1 die for illusion and detection spells |
| Fire-Bringer | Urban | +2 dice for detection and manipulation spells, +2 dice for spirits of man | -1 die for illusion spells |
| Great Mother | Anywhere | +2 dice for health spells, +2 dice for field and forest spirits and all spirits of the waters | -2 dice when in the presence of corruption |
| Horned Man | Anywhere on land | +2 dice for combat spells, +2 dice for all spirits of the land | Shamans of the Horned Man must make a Willpower (6) Test to refuse a fight or physical contest. They are also lecherous and must make a Willpower Test against a target number equal to twice a seducer's Charisma to refuse any advances. |
| Lover | Urban | +2 dice for illusion and control manipulation spells, +2 dice for spirits of the waters | Followers must have a minimum Charisma of 6 |
| Moon Maiden | Anywhere | None | None |
| Sea King | Anywhere near the sea | +2 dice for manipulation spells, +2 dice for sea spirits | -1 die for combat spells. Sea King shamans also suffer from the Sea Legs Flaw (p. 24, SR Comp), without receiving any compensating Edges or Build Points |
| Seductress | Urban | +2 dice for illusion and control manipulation spells, +2 dice for spirits of man | : Seductress shamans must have a minimum Charisma of 6. They must also succeed in a Willpower (6) Test to avoid indulging themselves when a vice or corruption (drugs, BTLs, sex, and so on) is made available. |
| Siren | Sea | +2 dice for illusion and control manipulation spells, +2 dice for sea spirits | Siren shamans must have a minimum Charisma of 6. Sirens have difficulty focusing on more than one opponent at a time; they receive a +1 spellcasting modifier when attacked by more than one foe. |
| Sky Father | Anywhere under the open sky | +2 dice for detection and manipulation spells, +2 dice for storm spirits | +2 to all target numbers if the shaman is entrapped or bound in any way |
| Trickster | Anywhere | None | None |
| Wild Huntsman | Forest, mountains or plains | +2 dice for detection and illusion spells, +2 dice for storm spirits | Wild Huntsman shamans can go berserk in combat in the same way as Bear shamans (p. 163, SR3). |
| Wise Warrior | Urban | +2 dice for combat and detection spells, +2 dice for resisting all damaging spells | -1 die for illusion spells |

### Loa
| Totem | Environment | Advantages | Disadvantages |
| --- | --- | --- | --- |
| Agwe | Anywhere | +2 dice for illusion spells | -1 die for combat spell |
| Azaca | Anywhere | +2 dice for health spells | A houngan of Azaca must make a Willpower (6) Test to avoid taking impulsive actions. |
| Damballah | Anywhere | +2 dice for detection and manipulation spells | A houngan of Damballah must make a successful Willpower (6) Test to reveal a particularly good piece of information. |
| Erzulie | Anywhere | +2 dice for illusion and control manipulation spells | A houngan of Erzulie must maintain at least a Middle Lifestyle (p. 240, SR3). They suffer +1 to all magical target numbers while unkempt or less than stylish. |
| Ghede | Anywhere | +2 dice for health and manipulation spells | A houngan of Ghede must make a Willpower (6) Test to avoid playing a trick in an inappropriate situation. |
| Legba | Anywhere | +2 dice for detection and manipulation spells | -1 die for combat spells. Houngans of Legba must have a minimum Charisma of 4. |
| Obatala | Anywhere | +2 dice for detection, health and control manipulation spells | Houngans of Obatala cannot cast combat spells. They suffer +2 to all magical target numbers when they are not wearing at least one article of white clothing. |
| Ogoun | Anywhere | +2 dice for combat spells | -1 die for illusion spells. Houngans of Ogoun must make a Willpower (6) Test to back down from any insult to their honor or prowess. |
| Shango | Anywhere | +3 dice for Fire and Lightning elemental manipulation spells | Houngans of Shango may go berserk in combat, in the same way as Bear shamans (p. 163, SR3) |

### Elements
| Totem | Environment | Advantages | Disadvantages |
| --- | --- | --- | --- |
| Air | Anywhere |  |  |
| Earth | Anywhere |  |  |
| Fire | Anywhere |  |  |
| Water | Anywhere |  |  |

## The Matrix

This section is a quick-reference for decking and Matrix play. Long examples are removed.

### Grids and security
- Local telecom grids (LTGs) connect to regional telecom grids (RTGs).
- Moving between LTGs/RTGs and entering hosts typically requires passing a **System Access Node (SAN)** with that grid/host’s security rating.
- A node’s **Security Rating** is expressed as **Security Code + System Rating** (e.g., `Orange-5`):
  - **Security Code** (color) is the success threshold to get the node to accept commands / run programs.
  - **System Rating** (number) is the Target Number (TN) for most tests in that node.

#### Security code (success threshold)
| Security code | Successes needed |
| --- | ---: |
| Blue | 1 |
| Green | 2 |
| Orange | 3 |
| Red | 4 |

### Matrix geography (nodes and systems)
- A **system** is a group of nodes (usually a single mainframe). Nodes are connected by **datalines**.
- Datalines have no Security Rating and no IC; Matrix combat happens in nodes. If combat crosses a dataline, it continues in the next node.
- Common node types and built-in system operations (usable only when no hostile IC is present):
  - **CPU**: Cancel Alert, Change Node, Display Map, Shutdown.
  - **Datastore**: Erase/Edit/Read/Transfer files. Typical file size is **2D6 × 10 Mp**.
  - **I/O Port**: Display Message, Lockout (may require crashing a terminal first).
  - **SAN**: Lockout (locks the access point).
  - **Slave node**: Control, Sensor Readout (controls physical devices and sensors/cameras).
  - **SPU**: no built-in system operations (it’s mostly routing/structure).

### Movement and Matrix ranges
- Matrix movement is effectively instantaneous unless you’re loading programs, transferring data, issuing system instructions, or in Matrix combat.
- Three practical ranges:
  - **Observation range**: you can see adjacent nodes/SANs, but usually can’t identify them in detail; you can move freely.
  - **Sensor range**: you can identify node types and recognize obvious constructs (IC/files/personas). You can run sensor utilities; gray/black IC may react if the system is on alert.
  - **Contact range**: you’re in the same node. Required for masking/combat utilities and file transfers.

### System operations and alerts
- System operations can be performed only if there is **no hostile IC** in the node.
  - IC that is crashed, or IC that had a sleaze/deceive program successfully used against it for the current Combat Turn, does not count as hostile.
- **System operation test**: roll **Computer + Hacking Pool** vs TN **node System Rating**.
  - You must generate at least the **Security Code**’s successes needed (Blue 1 / Green 2 / Orange 3 / Red 4).
  - If the test fails, you can try again, adding **+2 TN** per additional attempt.
- Alert risk while attempting system operations:
  - After the first attempt, the GM rolls **1D6** each attempt; if the result is **≤** the total attempts so far, a **passive alert** triggers.
  - If the decker leaves the node, the chance drops by **1** for each Combat Turn that passes.

#### Passive alert
- The system is cautious (not sure it’s invaded): increase all IC ratings by **+50%** (round normally; GM adjudication).
- Passive alerts usually last about **an hour**.
- Triggering a second passive alert while already on alert escalates to an **active alert**.

#### Active alert
- The system confirms an intrusion and notifies human operators (GM response).
- A common response is a controlled shutdown: **2D6 turns** to shut down safely; any persona still inside when it finishes is **dumped**.

### Finding system addresses (directory assistance)
When a decker tries to locate an unlisted system address within an RTG:
- Roll **Computer + Hacking Pool** vs TN **RTG System Rating**.
- You must generate at least the successes required by that RTG’s **Security Code**.
- If you fail, you can try again; each new attempt is at **+2 TN**.
- Alert risk: the GM can secretly roll **1D6**; if the result is **≤** the number of attempts it took (or attempts made before giving up), the target system will be on **passive alert** when the decker later comes to access it.
  - Leaving it alone for a few days (often **1D6**) usually clears the alert.

### Matrix combat timing and initiative
- Matrix combat uses the same Combat Turn structure as physical combat.
- Decker initiative is based on **Reaction** (other physical/astral initiative boosters generally don’t apply in the Matrix).
  - **Response Increase** (deck) adds **+2 Reaction** and **+1D6 Initiative** per level (Matrix only).
- Input mode edge cases:
  - Pure cybernetic command: gain **+1D6** Initiative.
  - Keyboard-only command: halve Reaction (minimum 1), gain no Reaction bonus from Response Increase, but still roll Response Increase Initiative dice in addition to the normal **1D6**.
- IC initiative is based on security code speed plus IC rating (then roll initiative).
- When astral + Matrix + physical actions overlap in the same Action Phase: resolve **astral first**, then **Matrix**, then **physical**.

#### IC reaction speed (initiative baseline)
| Security code | Reaction time baseline |
| --- | --- |
| Blue | No IC / N/A |
| Green | 5 + IC Rating |
| Orange | 7 + IC Rating |
| Red | 9 + IC Rating |

### Common Matrix actions (examples)
- Free: Delay, Observe, Speak.
- Simple: Change range, Erase program, Execute system operation, Jack out (requires a Willpower test vs black IC), Jam IC, Load programs, Run defense utility.
- Complex: Execute utility (Execution Test), Execute masking utility (special execution test), Run complex utility (combat or sensor).

### Exiting the Matrix (dump shock)
- You can **jack out** any time.
- If you’re dumped involuntarily, you suffer **dump shock**: +2 TN to all tests for up to **30 seconds**.
  - You can roll **Willpower** vs TN **4** to shake it off faster: divide **30 seconds** by successes to get the duration (every 3 seconds or part thereof is 1 Combat Turn).
- If engaged by **black IC**, jacking out requires a **Willpower** test vs TN equal to the IC’s rating (Simple Action). On a successful jack out, you also resist a **4M Stun** attack with **Body** vs TN **4**, and you still suffer dump shock.

### Cyberdeck stats (how to read the tables)
- **Persona**: deck “persona/MPCP” capability (your Matrix “body”); when it crashes you’re dumped.
- **Hard**: hardening (Matrix “armor” that reduces incoming program damage).
- **Mem**: active memory (limit on the total size of loaded programs).
- **Stor**: storage memory (where programs/data live before loading).
- **Load**: how quickly programs move from storage → active memory.
- **I/O**: how fast data transfers through the deck.
- **Resp+**: response increase (Matrix initiative/reaction booster).

#### Program loading (edge cases)
- Programs must be in **active memory** to run.
- Starting a load is typically a Simple Action; transfer speed is measured in Mp per Combat Turn.
- If a program’s size is **≤ half** the deck’s Load speed, it typically finishes loading in the same action that started it.
- The deck can load only **one** program at a time.
- While loading, the persona suffers **+2 TN** to all tests.

#### “Tortoises” (non-deck terminal users)
- Terminal users don’t get a Hacking Pool and are slower/less flexible than deckers.
- Black IC can’t physically injure a terminal user (it can still dump them/offline them).
- Tortoises reduce all program ratings by **–1**, and their terminals use persona programs fixed at **Rating 3**.
- Tortoises on a terminal halve their **Reaction** (minimum **1**) and still roll **1D6** for Initiative.
- Terminals typically cost about **1/10** as much as an equivalent cyberdeck.

### Cyberprograms (core rules)
- Programs come in two broad types:
  - **Persona programs** (Bod/Evasion/Masking/Sensors): firmware chips installed in the deck; do **not** use active memory.
  - **Utility programs**: software loaded into active memory; used for sensor/masking/combat/defense effects.
- Persona program ratings:
  - Each persona program has Rating 1+.
  - The sum of the four persona program ratings cannot exceed **3 × MPCP**.
- Utility program basics:
  - Utilities must be in **active memory** to run, and tie up active memory even if they crash.
  - Only one copy of a given utility can be in active memory at once.
  - Erasing a utility from active memory takes a **Simple Action** and is immediate.
  - Some utilities are degradable (common case: **–1 Rating** each time used during a run; they reset after jacking out), but some degrade on special schedules (see the specific utility).

#### Program size (Mp)
- Utility size is typically: `Size (Mp) = (Rating × Rating) × Multiplier`.
- Use the multiplier tables below to compute memory size for a given Rating.

### Executing a utility (Execution Test)
Many utilities must be “executed” in a node before they can take effect there.

- Execution is usually a **Complex Action** (defense utilities are a common exception).
- Program Success Test: roll **program Rating + Hacking Pool** dice (max Hacking Pool dice added = program Rating) vs TN **node System Rating**.
- Node Resistance Test: roll **node System Rating** dice vs TN **persona Evasion**.
- To execute successfully, the decker must beat the node and the node’s Security Code:
  - Execution succeeds if `program successes > (node resistance successes + Security Code successes needed)`.
  - Net successes for the utility’s effect are typically `program successes – (node resistance successes + Security Code successes needed)`.
- If execution fails, you can retry, adding **+2 TN** per additional attempt.
- Once executed in a node, a utility can be run multiple times in that node without re-executing (unless the GM rules you need more execution successes).

### Matrix combat (core procedure)
- Decker actions follow the normal Combat Turn/Initiative structure.
- Utility use depends on range:
  - **Sensor range**: sensor utilities (scope out nodes/IC).
  - **Contact range**: masking utilities, combat utilities, file transfers.

#### Combat utilities (Attack/Slow)
- To use a combat utility:
  - **Execute** the utility (Complex Action), then
  - **Run** it (another Complex Action), resolving the Matrix combat attack/resistance tests.
- Attack effects are typically based on net successes:
  - **Attack utilities** and **killer/blaster IC** generally do **1 damage box per net success** to the target’s Matrix Condition Monitor.
  - **Slow** reduces IC Initiative; if IC Initiative is reduced to **0 or less**, it is frozen (cannot act or trigger alarms/traps).

#### Attacking and resisting (success comparison)
When a persona attacks, its successes generally must also overcome the node’s **Security Code**. IC does not pay Security Code costs, and personas ignore Security Codes when resisting attacks.

- **Persona attacks IC**
  - Attack: **program Rating + Hacking Pool** vs TN **node System Rating**.
  - Resistance: **IC Rating** vs TN **attacker Computer**.
  - Net successes typically treat the node’s Security Code as a success cost: `attack successes – (IC resistance successes + Security Code successes needed)`.
- **IC attacks persona**
  - Attack: **IC Rating** vs TN **persona Bod**.
  - Resistance: **persona MPCP** (plus optional Hacking Pool) vs TN **node System Rating**.
  - IC ignores Security Codes when attacking; net successes are typically `IC attack successes – persona resistance successes`.
- **Persona vs persona**
  - Execution tests are made against the target persona’s **Evasion** (executing in their deck), not the node’s System Rating.
  - Attacks use TN **target persona Bod**; resistance uses **target MPCP** vs TN **attacker Computer**.
  - If the fight occurs inside a secured node, apply the node’s Security Code success cost to persona attacks (personas still ignore Security Codes when resisting).

#### Damage and crashing
- Personas and IC use a single 10-box Matrix Condition Monitor (no separate stun/physical tracks).
- At **10** boxes, the target **crashes**:
  - Crashed IC is disabled.
  - Crashed personas dump their decker (see dump shock). Restarted decks return to full health unless special IC effects apply (e.g., blaster-style MPCP burn).

#### Avoiding combat and pursuit
- A pursuer can easily follow a fleeing decker as long as the decker stays within **1 node** (observation range).
- If the decker moves **2+ nodes** away, pursue by rolling:
  - Pursuer: **IC Rating** or hostile decker’s **Sensors** (no Hacking Pool)
  - TN: fleeing persona’s **Masking**
  - 1+ successes means the pursuer knows exactly where the decker went; failure loses the trail.

### Utility program notes (core)
Program sizes use the multiplier tables below: `Size (Mp) = Rating² × Multiplier`.

#### Combat utilities
- Combat utilities require **contact range** and both an **Execution Test** and then a **run/attack** action.
- **Attack**
  - Each net success typically inflicts **1** damage box on the target’s Matrix Condition Monitor.
  - Multiplier: **2**
- **Slow**
  - Only affects IC (not other personas).
  - Successes reduce the IC’s Initiative at the start of the next Combat Turn; if IC Initiative is reduced to **0 or less**, it is frozen (cannot act, trigger alarms, or trigger traps).
  - Multiplier: **4**

#### Defense utilities (no Execution Test)
- Running a defense utility is a **Simple Action**.
- **Medic**
  - Roll program Rating dice vs TN based on current condition level; cannot use Hacking Pool.
  - Each success heals **1** box on the MPCP Condition Monitor.
  - Degrades **–1 Rating** each time it is used (reload a fresh copy from storage during the run to restore rating).
  - Multiplier: **4**
  - Program Repair TNs:
    - Light: 4
    - Moderate: 5
    - Serious: 6
- **Mirrors**
  - Adds its Rating to persona **Evasion**.
  - Degrades by **–1** bonus per Combat Turn after it triggers.
  - Multiplier: **3**
- **Shield**
  - Automatically stops a number of wounds equal to its Rating.
  - Degrades by **–1 Rating** each time it stops damage.
  - Multiplier: **4**
- **Smoke**
  - Adds its Rating to **every TN** for tests made by anything in the node (including the decker).
  - Degrades by **–1** per Combat Turn and follows the persona between nodes.
  - Multiplier: **2**

#### Sensor utilities
- Sensor utilities require **sensor range** and a successful Execution Test.
- **Analyze**
  - Identifies constructs/nodes and their function; can also determine a node’s Security Rating.
  - Against IC: resolve an opposed test (program Rating + Hacking Pool vs node System Rating; IC Rating vs persona Evasion). Net successes beyond IC + Security Code drive detail.
  - Multiplier: **3**
- **Browse**
  - Searches a datastore for subject matter; reveals which files reference it and their sizes (not full details).
  - Base time is **10 turns**, reduced by Execution Test successes.
  - Multiplier: **1**
- **Decrypt**
  - Defeats Scramble IC (opposed tests; net successes beyond IC + Security Code drive effect).
  - Multiplier: **2**
- **Evaluate**
  - Identifies valuable files in a datastore (count, size, market value) and can indicate whether the datastore contains subject-matter of interest.
  - Degrades over time: Rating drops by **–1** about every **2 weeks** (GM may optionally degrade faster in secret).
  - Multiplier: **2**

#### Masking utilities (special execution)
- Masking utilities require **contact range** and use a special execution contest:
  - Decker: program Rating dice vs TN **node System Rating**
  - IC: IC Rating dice vs TN **persona Masking**
- To succeed, the decker must achieve net successes at least equal to the node’s **Security Code level** (Blue 1 / Green 2 / Orange 3 / Red 4).
  - If the IC wins, it may trigger an alert or activate attack IC (per its programming).
  - If the decker wins but doesn’t clear the Security Code level, the IC doesn’t react and the decker can retry (each retry is **+2 TN**).
- **Deception**
  - Generates fake passcodes (logged); defeats Access IC and gray IC; does not affect Barrier or black IC.
  - Multiplier: **2**
- **Relocate**
  - Defeats Trace IC by sending it on an endless chase (no alarms).
  - Multiplier: **2**
- **Sleaze**
  - Bypasses Access/Barrier/gray/black IC without leaving tracks; does not work if the IC is already actively attacking/activated.
  - If staying in the node, you must re-sleaze each Combat Turn, with **+1 TN** each turn.
  - Multiplier: **3**

### Intrusion countermeasures (IC) quick reference
IC comes in three broad classes: **white** (identify/alert), **gray** (attack/trace), and **black** (harm decker).

#### White IC (identify and alert)
- White IC is not directly harmful, but it triggers system alerts if not fooled.
- If a persona enters contact range and does not immediately attempt sleaze/deception, the IC attempts verification on its next action.
- White IC cannot meaningfully defend itself; if it survives to its next action while under attack, it triggers an immediate active alert.
- **Jam IC** (Simple Action): spend Hacking Pool dice to prevent the IC from triggering an alert on its next action.
  - Decker: roll **Hacking Pool** dice vs TN **IC System Rating**.
  - IC: roll **IC Rating** dice vs TN **persona Masking**.
  - If the IC wins, it triggers the alert.

**Access IC**
- Verifies signal legality; commonly defeated by **Deception** (or **Sleaze**).
- If not fooled, it triggers a passive alert on its next action.
- If successfully slowed, it cannot trigger an active alert while the slow is maintained.

**Barrier IC**
- A hard lock/wall on a node; used on datastores or nodes with little legitimate traffic.
- Defeat with **Sleaze** or by crashing it (deception does not work).

**Scramble IC**
- Guards a file/datastore; can be defeated by **Deception**, **Decrypt**, or by crashing it.
- If a decker fails to keep it suppressed (e.g., fails an attack/slow at the wrong time), it attempts to erase the guarded file on its next action.
- You can download a file with Scramble IC attached:
  - Add the IC’s rating to the decker’s TN for the transfer in that node.
  - The downloaded file size increases by **+50%**.
  - A copy of the IC remains active in the node.

#### Gray IC (attack/trap/trace)
- Gray IC is mobile and can damage a deck/persona.

**Killer IC**
- Matrix attacker; each net success typically inflicts 1 damage box.

**Blaster IC**
- Like killer, but after crashing a persona it immediately attempts to burn MPCP:
  - Roll IC Rating vs TN **deck MPCP**; hardening reduces the effect as a threshold.
  - Net successes can permanently reduce MPCP (requires hardware replacement to restore).

**Tar baby / tar pit**
- Trap IC that can crash the attacking utility if the fooling attempt fails or if the IC is attacked but not harmed.
- Tar pit additionally corrupts all copies of the attacking utility in deck storage (not offline storage).

**Trace IC**
- Traces the decker to their Matrix entry point:
  - IC rolls **IC Rating** vs TN **persona Masking**.
  - Base time is **10 turns / successes**; on failure, it can retry next action.
- To stop a trace, crash the trace IC or successfully use **Relocate**.
- Variants:
  - Trace & Report: reports entry point address, then goes dormant.
  - Trace & Dump: dumps the decker and reports the location.
  - Trace & Burn: dumps and spawns a blaster-style attack at the entry point (harder to defend; GM adjudication).

#### Black IC (hurts the decker)
- Black IC targets the decker directly (Physical by default, sometimes Stun).
- Deckers without a cybernetic link (keyboard-only) are immune to black IC’s damage effects.
- The shield utility does not protect against black IC; hardening acts like armor.
- If black IC hits, the decker can either hang tough or jack out:
  - **Hang tough**: opposed tests between the IC and the decker’s Body; net successes stage damage (often 1 Light wound per 2 net successes; GM adjudication).
  - **Jack out**: Willpower vs TN **IC Rating** (Simple Action), then resist **4M Stun** (Body vs TN 4) and suffer dump shock.

### Cyberdecks (system list)
| Deck | Persona | Hard | Mem | Stor | Load | I/O | Resp+ | Avail | Cost | SI | Book |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Radio Shack PCD-100 | 2 | 0 | 100 | 500 | 5 | 1 | 0 | 4/7days | 6800 | 1 | sr2.173 |
| Allegiance Alpha | 3 | 1 | 100 | 500 | 5 | 1 | 0 | 4/7days | 12600 | 1 | sr2.173 |
| Sony CTY-360 | 3 | 3 | 50 | 100 | 20 | 10 | 0 | 4/7days | 6800 | 1 | sr2.173 |
| Fuchi Cyber-4 | 6 | 3 | 100 | 500 | 20 | 20 | 1 | 4/7days | 121400 | 1 | sr2.173 |
| Fuchi Cyber-6 | 8 | 4 | 100 | 500 | 50 | 30 | 2 | 6/7days | 334500 | 1 | sr2.173 |
| Fuchi Cyber-7 | 10 | 4 | 200 | 1000 | 40 | 40 | 2 | 10/7days | 1112100 | 1 | sr2.173 |
| Fairlight Excalibur | 12 | 5 | 500 | 1000 | 100 | 50 | 3 | 22/7days | 5529600 | 1 | sr2.173 |

### Programs (multiplier list)
Program size: `Size (Mp) = Rating² × Multiplier`.
| Program | Multiplier |
| --- | --- |
| Analyze | 3 |
| Armor | 3 |
| Attack | 2 |
| Black Hammer | 20 |
| Browse | 1 |
| Camo | 3 |
| Cloak | 3 |
| Commlink | 1 |
| Compressor | 2 |
| Crash | 3 |
| Deception | 2 |
| Decrypt | 2 |
| Defuse | 2 |
| Disinfect | 2 |
| Evaluate | 2 |
| Hog | 3 |
| Killjoy | 10 |
| Lock-on | 3 |
| Medic | 4 |
| Mirrors | 3 |
| Poison | 3 |
| Read/Write | 2 |
| Relocate | 2 |
| Restore | 3 |
| Restrict | 3 |
| Reveal | 3 |
| Scanner | 3 |
| Shield | 4 |
| Sift | 1 |
| Sleaze | 3 |
| Slow | 4 |
| Smoke | 2 |
| Spoof | 3 |
| Steamroller | 3 |
| Track | 8 |
| Validate | 4 |

### Virtual Reality Programs (multiplier list)
Program size: `Size (Mp) = Rating² × Multiplier`.
| Program | Multiplier |
| --- | --- |
| Analyze | 3 |
| Armor | 3 |
| Attack D | 5 |
| Attack L | 2 |
| Attack M | 3 |
| Attack S | 4 |
| Black Hammer | 20 |
| Browse | 1 |
| Camo | 3 |
| Cloak | 3 |
| Commlink | 1 |
| Compressor | 2 |
| Crash | 3 |
| Deception | 2 |
| Decrypt | 2 |
| Defuse | 2 |
| Disinfect | 2 |
| Evaluate | 2 |
| Hog | 3 |
| Killjoy | 10 |
| Lock-on | 3 |
| Medic | 4 |
| Mirrors | 3 |
| Poison | 3 |
| Read/Write | 2 |
| Relocate | 2 |
| Restore | 3 |
| Restrict | 3 |
| Reveal | 3 |
| Scanner | 3 |
| Shield | 4 |
| Sift | 1 |
| Sleaze | 3 |
| Slow | 4 |
| Smoke | 2 |
| Spoof | 3 |
| Steamroller | 3 |
| Track | 8 |
| Validate | 4 |

### Quick Matrix systems (GM quick-gen)
This optional system lets a GM generate a “random” host quickly.

#### Random security code
| 1D6 | Security code |
| ---: | --- |
| 1–2 | Green |
| 3–5 | Orange |
| 6 | Red |

#### Node generation (architecture)
- Start with an entry **SAN** that connects to an **SPU** (SANs always connect to SPUs).
- Roll 1D6 and consult the table below based on the **current node** to create the next node and connect it.
- Only one **CPU** should exist; ignore “CPU” results if they would make the CPU too easy to reach (GM adjudication).

| 1D6 | From CPU | From SPU | From Datastore |
| ---: | --- | --- | --- |
| 1 | SPU | CPU | CPU |
| 2 | SPU | SPU | CPU |
| 3 | SPU | Datastore | SPU |
| 4 | Datastore | Datastore | SPU |
| 5 | Datastore | `*` | SPU |
| 6 | `*` | `*` | Datastore |

`*` = dead end: add a line to the dead-end node (SN, I/O, or SAN) and stay in the current node for the next roll.

#### Security classifications (optional)
- You can assign one overall Security Code and roll a separate **System Rating** for each node.
- To vary Security Code by node: roll 1D6:
  - `1` = one level lower (Green → Blue)
  - `6` = one level higher (Green → Orange)
  - Otherwise = same as overall

#### Install IC (optional)
For each node, roll 1D6 to see if IC is present:
- Green: IC on **1**
- Orange: IC on **1–2**
- Red: IC on **1–3**

If IC is present:
- Roll 2D6 to determine whether IC is white/gray/black (table below).
- All IC has rating **2D6 – 1**.

| Security code | White IC | Gray IC | Black IC |
| --- | --- | --- | --- |
| Green | 2–8 | 9–11 | 12 |
| Orange | 2–7 | 8–10 | 11–12 |
| Red | 2–6 | 7–10 | 11–12 |

**White IC program table (2D6)**
| Roll | IC type |
| ---: | --- |
| 2 | Trapped IC* |
| 3–7 | Access |
| 8–11 | Barrier / Scramble** |
| 12 | Trapped IC* |

`*` Trapped IC: gray IC is hidden in the white IC. Roll **1D6 + 4** on the white IC table for the “obvious” IC, then roll on the gray IC table for the hidden IC.  
`**` Use Scramble IC only in a datastore. Use Barrier IC in any node (including a datastore).

**Gray IC program table (2D6)**
| Roll | IC type |
| ---: | --- |
| 2–4 | Blaster |
| 5–6 | Trace |
| 7–8 | Killer |
| 9–11 | Tar Baby |
| 12 | Tar Pit |

#### Install data values (paydata loot)
- Roll 2D6 and consult the Data Value Table for each datastore:
  - Unless the roll is **2** or **12**, the datastore contains **1D6** valuable files.
  - Each file size is **2D6 × 10 Mp**.
  - The decker usually needs **Evaluate** to find valuable files.
- Data must still be fenced; use `### Fencing the loot` guidelines.

**Data Value Table: value per 10 Mp of data**
| 2D6 | Green | Orange | Red |
| ---: | ---: | ---: | ---: |
| 2 | 0¥ | 0¥ | 0¥ |
| 3–4 | 500¥ | 1,000¥ | 2,500¥ |
| 5–7 | 1,000¥ | 2,500¥ | 5,000¥ |
| 8–10 | 5,000¥ | 10,000¥ | 50,000¥ |
| 11 | 10,000¥ | 50,000¥ | 100,000¥ |
| 12 | 0¥ | 0¥ | 0¥ |

## Critters

This chapter is trimmed to the rules that commonly matter at the table: critter power and weakness definitions, plus spirit/nature-spirit reference used by Magic.

### Using powers (opposed effects)
- When two nature spirits use directly opposing powers within a domain (e.g., **Accident** vs **Guard**):
  - The spirit with the higher **Force** wins.
  - The winning power takes effect at an effective Force equal to **(winner Force – loser Force)**.
  - Ties have no effect.

### Powers of the Awakened (common)
Many critter powers key off **Essence**. Unless stated otherwise, “Essence” below refers to the critter/spirit’s Essence rating.

#### Accident
- Victim makes a **Quickness or Intelligence** test (higher rating) vs TN **Essence**.
- Failure: victim loses their action (trip, stumble, etc.). Accident itself isn’t inherently lethal, but the environment can make it dangerous.

#### Alienation
- Treat as an **Invisibility** effect with Force = **Essence**, lasting **Essence hours**.
- Victims are “ignored” by the world (people don’t react; drivers don’t stop; allies may shoot through them, etc.).
- To avoid danger or get attention, the victim must score **1+ success** with an appropriate test vs TN **Essence**.

#### Animal Control
- The critter can prevent certain animals (often a category) from attacking/raising alarms.
- By concentrating, it can control an animal’s behavior through its senses (within what’s plausible for that animal).
- Maximum controlled animals:
  - Small animals (cats, rats, etc.): **Charisma × 1D6**
  - Large animals (wolves, lions, etc.): **Charisma**

#### Binding
- Victim becomes stuck to a surface or to the critter.
- Treat the binding as having **Strength = 2 × Essence** (GM adjudication for escape tests).

#### Compulsion
- Forces a victim toward a specific action (often a single “scripted” compulsion).
- Treat as **Control Actions** with Force = **Essence**.

#### Concealment
- Hides the critter and/or companions (or an object) within its terrain.
- Adds **Essence** to the Target Number of Perception tests to notice the concealed target/object.

#### Confusion
- Victims lose direction and judgment while within the being’s terrain.
- Apply a penalty equal to **Essence** to most tests made by the victim (GM adjudication).
- When a decision is required, victim makes **Willpower** vs TN **Essence**:
  - Failure: can’t decide/act until prompted (attack, reminder, etc.), then test again.
- Ends when the victim leaves the terrain.

#### Electrical Projection
- Ranged electrical attack; victims typically cannot Dodge/defend against the projection itself.
- Typical damage: **(Essence)M**, plus disorientation for **Essence turns** (varies by critter).

#### Engulf
- Pulls the victim into the spirit/element/terrain; at minimum, causes suffocation or crushing/heat effects.
- Generic resolution:
  - Opposed test: victim **Willpower** vs critter **Essence** (each using the other as TN).
  - If the critter wins, the victim is engulfed and begins suffocating/taking damage; it persists while the critter maintains the effect.
  - Suffocation: each turn, victim makes **Body** vs **(Essence)M Stun** (armor/dermal plating don’t help).
- For elementals/nature spirits: resolve engulf as a melee engagement; victims may attempt escape with an opposed **Strength vs Essence** test (TN 4), typically on their actions. Damage varies by element:
  - Fire: resist **(Essence + 2)M** (impact armor helps; ballistic often doesn’t).
  - Water: resist **(Essence)M Stun**, with the Power increasing as the spirit maintains pressure (GM adjudication); unconscious victims eventually take lethal drowning damage.
  - Air: resist **(Essence)S Stun** as noxious breath (breathing gear doesn’t help); unconscious victims eventually suffocate.
  - Earth: resist **(Essence)S** crushing damage (impact helps; ballistic doesn’t).

#### Enhanced Physical Attributes
- Adds **Essence** to some or all Physical Attributes (may be limited in scope/duration).

#### Enhanced Senses
- Includes low-light/thermographic vision, improved smell/hearing, sonar, motion detection, etc.
- Use as a Perception edge (GM adjudication).

#### Essence Drain
- Drains Essence from a subdued or willing victim over minutes of undisturbed contact; adds drained Essence to the drainer.
- Minimum drain is **1**; a drainer can typically drain up to its own current Essence.
- Drainers can exceed their normal max Essence up to about **2× their species max** (humanoids commonly up to 12).
- Victims may become addicted:
  - Each draining: victim rolls **Willpower** vs TN **4**; failure indicates addiction and a tendency to cooperate to be drained again.
- Essence-drainers can also drain each other without “emotion requirements”:
  - Both make an **Essence test** vs TN **4**; the side with more successes drains Essence equal to net successes.
  - A being reduced to **Essence 0** this way dies permanently.

#### Fear
- Opposed test: victim **Willpower** vs critter **Essence** (each using the other as TN).
- Critter net successes determine how overwhelming the panic is (GM adjudication); victims typically flee toward perceived safety.

#### Flame Aura
- Touch/close contact burns attackers.
- Adds **+2 Power** to the critter’s successful melee attacks.
- If an attacker lands a successful melee attack on the critter, the attacker must resist heat damage: **Body** vs **(Essence)M** (armor may help depending on contact).

#### Flame Projection
- Ranged flame attack with Damage Code **(Essence)L**; may ignite flammables.
- Can be sustained like spellcasting; sustained use inflicts Drain-like fatigue on the being (typically **(Essence)S**) and can expand to an area (GM adjudication).

#### Guard
- Prevents accidents within the being’s terrain, including those caused by **Accident** power.

#### Hardened Armor
- Treat as **vehicle/hardened armor**:
  - Attacks that don’t exceed the armor rating may fail to penetrate at all.
  - Otherwise, the armor meaningfully reduces attack Power and/or improves resistance (see vehicle armor rules; GM adjudication).

#### Immunity to Age
- Does not age and does not suffer age-related frailty.

#### Immunity to Normal Weapons
- When resisting damage from ordinary weapons, treat as armor equal to **2 × Essence**.
- No effect against magical weapons. Against elemental/environmental damage, immunity is typically halved (treat as armor = **Essence**).

#### Immunity to Pathogens
- Adds **2 × Essence** dice when resisting disease/infection.

#### Immunity to Poisons
- Adds **2 × Essence** dice when resisting toxins/drugs.

#### Infection
- If an Essence-draining creature reduces a victim’s Essence to **0**, the victim may die and later rise as the same type of creature (Essence remains 0).
- Infected PCs generally become NPCs under GM control.

#### Influence
- Implants a suggestion/emotional predisposition.
- Opposed test: critter **Charisma** (or **Essence** if it has no Charisma) vs victim **Willpower** (each using the other as TN).
- Net successes gauge how strongly the suggestion takes hold (GM adjudication).

#### Magical Guard
- Provides Spell Defense-like protection equal to the being’s **Essence** for the guarded targets.

#### Manifestation
- An astral being can temporarily manifest physically.
- When manifested, its Physical Attribute ratings are typically **Essence** (minimum 1), unless otherwise specified.
- A manifested spirit’s **Essence** functions as Spell Defense.
- Mundane attacks (shooting/striking with non-magical weapons): roll **Willpower** instead of the normal Combat Skill (use normal TNs/modifiers for the attack).
  - You may not add Combat Pool or Magic Pool dice to this attack test.
- Magical attacks (weapon foci, spells) and attacks exploiting a spirit’s vulnerability use the normal Combat Skill rules and may use Combat Pool dice.
- Manifest spirits have “immunity” against firearms, most ranged weapons, and explosions: treat as armor equal to **2 × Essence** (for spirits, this is typically **2 × Force**) of the appropriate type.
  - This does not apply against melee attacks, bows (except crossbows), and throwing weapons.

#### Mist Form
- Being becomes mist (Complex Action), able to pass through any non-airtight crack/crevice; anti-bacterial/anti-viral filtration can block it.
- In mist form, the being has immunity to normal weapons (even those exploiting vulnerability), but can still be affected by magic.
- Exposure to an allergen can force a return to corporeal form immediately.

#### Movement
- Multiplies or divides a victim’s movement rate within the being’s terrain by **Essence**.

#### Noxious Breath
- Victim resists nausea/incapacitation with **Willpower or Body** (higher) vs **(Essence)S Stun**.
- Armor/dermal plating do not help.

#### Paralyzing Touch (Howl)
- Touch reduces victim **Quickness** by **Essence** for **2D6 minutes** (multiple touches stack).
- At Quickness 0: victim must make a **Willpower** test each minute vs TN **Essence** to keep breathing; failure means death in **1D6 minutes** unless resolved.
- Paralyzing howl is the aural form; resolve as an opposed **Essence vs Willpower** test (each using the other as TN). 1+ success affects the victim.

#### Pestilence
- Victim contracts a disease similar to **VITAS-3** (GM adjudication).

#### Petrifying Gaze
- If the victim meets the being’s eyes: **Intelligence** vs TN **Essence**.
- Being can keep a number of victims petrified up to **Essence**.
- A petrified victim generally can only attempt to break free with the same test.

#### Psychokinesis
- Generates telekinetic force with **Strength = Essence** (similar to magic fingers).

#### Regeneration
- Ordinary wounds don’t permanently kill it unless the spine/brain is critically damaged.
- When it takes a **Deadly** wound or cumulative damage drops it: roll **1D6**.
  - **1** = dead; otherwise it survives and its wounds vanish at the start of the next Combat Turn.
- Massive tissue damage (fire/explosions, etc.) is more effective: death on a **1–2** on the die roll.

#### Search
- Can search for a person/place/object within its terrain.
- Its effective rating to perceive hidden targets is **2 × Essence**; targets resist with an opposed test (GM adjudication).

#### Venom
- Poisonous attack treated as a toxin with Damage Code **(Essence)S**, speed **1 turn**.

### Common weaknesses

#### Allergy
Allergy-causing substances include sunlight, ferrous metals, holy objects (often psychosomatic), plastics, pollutants, etc.
- **Nuisance**: annoyance; no significant effects.
- **Mild**: discomfort and distraction; **+1 to all target numbers**.
- **Severe**: painful; often forces retreat; prolonged contact triggers reaction; **add +2 Power** for weapons made of the allergen.
- **Extreme**: slightest touch causes reaction and Physical damage; **add +2 Power** (as Severe) and the weapon also inflicts a **Light** wound.

#### Essence loss
- The being has no inherent Essence and must consume the Essence of others to survive.
- Typically loses **1 Essence per month** without feeding.
- A being that reaches Essence 0 dies within days/hours; near-starvation often makes it behave as a mindless predator hunting Essence.

#### Reduced senses
- One or more senses are limited; typically function at half normal rating.

#### Vulnerability
- Weapons made of the vulnerable substance increase Damage Level by **1 step** (e.g., 2L → 2M).
- Simple contact with the vulnerable substance is treated like a **Nuisance** allergy reaction.

### Cyberware for critters
- Cyber-modified animals tend to become vicious and poorly controlled.
- When an animal is unleashed, roll **1D6**:
  - If the result is **≥ the animal’s Essence**, it turns on its handler.
- Control implants can mitigate this, but at a cost:
  - Each implant: **–1 Essence**, **–1 Mental Attribute**, and **–2** to the “turn on handler” die roll.

### Spirits (elementals and nature spirits)
These quick stats are used for summoned spirits. `F` = spirit Force; spirits exist primarily in astral space.

#### Elementals (attributes and core powers)
| Elemental | Body | Quickness | Strength | Charisma | Intelligence | Willpower | Reaction | Powers (common) | Weakness |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Air | F–2 | (F+3)×4 | F–3 | F | F | F | F+2 | Engulf, Movement, Manifestation, Noxious Breath, Psychokinesis | Confinement; Vulnerability (Earth) |
| Earth | F+4 | (F–2)×2 | F+4 | F | F | F | F–2 | Engulf, Movement, Manifestation | Vulnerability (Air) |
| Fire | F+1 | (F+2)×3 | F–2 | F | F | F | F+1 | Engulf, Flame Aura, Flame Projection, Guard, Movement, Manifestation | Vulnerability (Water) |
| Water | F+2 | F×2 | F | F | F | F | F–1 | Engulf, Movement, Manifestation | Vulnerability (Fire) |

#### Nature spirits (domains and powers)
Nature spirits are grouped by “spirit family” and then by local domain:
- **Spirits of Man**
  - City: Accident, Alienation, Concealment, Confusion, Fear, Guard, Search (domain: streets/plazas/alleys/open areas/abandoned buildings)
  - Hearth: Accident, Alienation, Concealment, Confusion, Guard, Search (domain: occupied homes/buildings)
  - Field: Accident, Concealment, Guard, Search (domain: cultivated fields/growing areas)
- **Spirits of the Land**
  - Desert: Concealment, Guard, Movement, Search (domain: open desert)
  - Forest: Accident, Concealment, Confusion, Fear, Guard (domain: forests and sizeable parks)
  - Mountain: Accident, Concealment, Guard, Movement, Search (domain: rugged mountain terrain)
  - Prairie: Accident, Alienation, Concealment, Guard, Movement, Search (domain: open land/uncultivated fields/tundra)
- **Spirits of the Sky**
  - Mist: Accident, Concealment, Confusion, Guard, Movement (domain: mist/fog/rain)
  - Storm: Concealment, Confusion, Electrical Projection, Fear (domain: violent storms)
- **Spirits of the Waters**
  - Lake: Accident, Engulf, Fear, Guard, Movement, Search (domain: open lake water)
  - River: Accident, Concealment, Engulf, Fear, Guard, Movement, Search (domain: rivers/large streams/deltas/inlets/outlets)
  - Sea: Accident, Alienation, Concealment, Confusion, Engulf, Fear, Guard, Movement, Search (domain: open sea)
  - Swamp: Accident, Binding, Concealment, Confusion, Engulf, Fear, Guard, Movement, Search (domain: swamps/marshes)

## Gear

This section is generated from the system’s data catalogs for clean search and consistent tables.

### Using equipment (ratings)
- Most gear “just works” until something directly opposes it (e.g., **radio** vs **jammer**).
- When opposed, roll a number of dice equal to each device’s rating vs TN equal to the opposing device’s rating.
  - Ties have no effect; the device activated first continues to function (GM adjudication).
- A common abstraction for this is an item’s **ECM/ECCM rating**.
  - Items listed with a base cost are commonly treated as ECM/ECCM **Rating 1**.
  - Buying Rating 0 (no ECM/ECCM): multiply cost by **0.75** (and opposing equipment dominates).
  - Buying Rating N: multiply cost by **N** (and increase Availability/Street Index appropriately).
  - As a common guideline, Rating >1 increases Availability and increases Street Index by **+0.1 per rating point**.

### Availability and Street Index (how to buy things)
- Availability is written like `TN/time` (example: `4/24hrs`, `10/7days`).
  - Left side = acquisition Target Number.
  - Right side = base time to locate the item.
- Street Index (SI) modifies how much the item costs on the street/gray market:
  - **Street price** = `Cost × SI` (before negotiation).
- In the gear tables:
  - **Concealability** is commonly used as the Target Number for Perception tests to notice a concealed item.
  - **Reach** affects melee Target Numbers (see `## Combat` → `#### Reach`).

#### Acquisition Test (GM-facing procedure)
1. The buyer contacts a source (often a fixer).
2. GM rolls a number of dice equal to the source’s acquisition skill (or appropriate Etiquette +2) vs TN = Availability TN.
3. If there are **no successes**, the item isn’t available right now.
4. If there are successes: **actual time to locate** = `base time / successes`.
5. When the source confirms availability (often about halfway through), negotiate price:
   - Buyer rolls Negotiation (or a reasonable default) vs TN = source Willpower.
   - Source rolls similarly vs TN = buyer Willpower.
   - The side with more successes shifts the street price by **5% per net success** in their favor.

### Fencing the loot (selling stolen goods)
If the team has a prearranged buyer/fence for loot, skip these rules.

#### Finding a fence
Finding a fence requires an Etiquette (Street) test:
- Base TN: **4**
- Apply modifiers from the table below.

Team version (optional):
- Roll a number of dice equal to the average Etiquette (Street) rating of the group, **+1 die per team member**, vs the same TN.
- All characters contributing their Etiquette rating must attend the meet; if they can’t, the fence may get nervous and skip it.

Base time: **10 days** to locate a fence and set up a meet.
- Allocate successes to reduce the time (minimum **1 day**).
- Each day spent searching increases the chance the original owners hear about it:
  - At the end of each day, the GM rolls a number of dice equal to the days spent searching vs TN **6**.
  - If the GM scores **1+** successes, the owners are on to the team (and may ambush the meet).

| Situation | TN modifier |
| --- | ---: |
| Using a regular contact | –1 |
| Disposing of standard gear | –1 |
| Disposing of hi-tech or otherwise important loot | +1 |
| Disposing of hot loot | +3 |
| While being sought by police | +1 |
| While being sought by a corp or organized crime | +2 |
| Magical loot (foci, spell formulae, etc.) | +2 |

#### Financing the fence (optional)
Instead of reducing time, allocate successes to increase the fence’s bankroll:
- GM rolls **2D6 × 100,000¥** to determine base bankroll.
- Multiply base bankroll by the number of successes allocated to bankroll to get how much cash the fence has available.

#### The meet (negotiation)
- Make a Negotiation Test between one character and the fence:
  - Each rolls Negotiation dice vs the other’s Willpower as the TN.
  - Both sides are suspicious: **+2 TN** to both tests.
- Base price: **30%** of the item’s value (or GM-set value for unusual loot).
- Winner adjusts price by **5% per net success**.
  - If the fence wins: price paid never drops below **10%** of value.
  - If the team wins: price paid never rises above **50%** of value.

### Encumbrance (optional)
- Carrying capacity (kg) based on Strength:
  - Up to **STR × 5**: no penalty.
  - **STR × 10**: fatigued like **Light Stun**.
  - **STR × 15**: **Moderate** fatigue; can’t run; movement halved.
  - **STR × 20**: **Serious** fatigue; can’t run; movement quartered.
  - Above **STR × 20**: character passes out from exertion.
- Lifting (not carrying): may add **(STR)D6 kg** above the STR×20 cap for **Body turns**; beyond that, fatigue worsens by 1 level per turn (GM adjudication).

### Diseases and toxins
Diseases and toxins (drugs and poisons) are rated by:
- **Power** (used as the resistance TN)
- **Damage** (Power + Damage Level)
- **Speed** (how often resistance is rolled)
- Any side effects (per the specific toxin/disease)

**Resistance**
- Make a **Body Test** vs TN equal to the toxin/disease **Power**.
- Every **2** successes reduce the Damage Level by **1** step.
- If the target is still exposed/infected after the Speed interval elapses again, they must resist again.

**Antidotes and vaccines**
- Antidotes add dice equal to their rating to the victim’s Body Test **if no damage has yet been done**.
- If a patient has gone down (Deadly Damage Level) from a toxin/disease, the correct antidote counts as professional attention (see Deadly wounds rules in `## Combat`).
- Vaccines administered ahead of time provide immunity (no resistance roll needed).

### Edged weapon
| Name | Concealability | Reach | Damage | Weight | Availability | Cost | Street Index |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Ares Monosword | 3 | 1 | (STR+3)M | 2 | 4/24hrs | 1000 | 1 |
| Bayonet | 8 | 0 | (STR)L | .25 | 2/8hrs | 35 | .8 |
| Bear-Knife | 3 | 0 | (STR+2)M | 1 | 6/48hrs | 2000 | 1 |
| Bowie Knife | 6 | 0 | (STR+2)L | 1 | 3/24hrs | 50 | .8 |
| Broadsword | 4 | 1 | (str+1)M | 2 | 6/48hrs | 1000 | 3 |
| Cane Knife | 2 | 1 | (STR+1)M | 1 | 10/7days | 600 | 2 |
| Cane Sword | 2 | 1 | (STR+1)M | 1 | 10/7days | 600 | 2 |
| Centurion Laser Axe | 2 | 1 | (STR)S | 5.2 | 6/48hrs | 3500 | .5 |
| Combat Axe | 2 | 2 | (STR)S | 2 | 3/24hrs | 750 | 2 |
| Combat Axe Thrusting Point | - | - | (STR+2)L | 0 | NA | 0 | 1 |
| Decapitator battleaxe | - | 2 | (STR+4)S | 11 | 6/48hrs | 2000 | 3 |
| Fineblade Knife (short) | 8 | - | (STR)M | .5 | 5/72hrs | 800 | 3 |
| Fineblade Knife (long) | 5 | - | (STR+1)M | .75 | 8/72hrs | 1500 | 3 |
| Gasher battleaxe | 2 | 1 | (STR)S | 2 | 6/48hrs | 1000 | 3 |
| Gutter dagger | 8 | 0 | (str)M | .5 | 6/48hrs | 1000 | 1 |
| Katana | 3 | 1 | (STR+3)M | 1 | 4/48hrs | 1000 | 1 |
| Kendachi M-33 Powersword | 4 | 1 | (STR+1)S | 3 | 8/14days | 1860 | 3 |
| Kendachi Monokatana | 3 | 1 | (STR+4)M | 1 | 8/5days | 1200 | 2.5 |
| Kendachi Monoknife | 7 | - | (STR+1)L | .5 | 6/60hrs | 200 | 1 |
| Kendachi Mononaginata | 2 | 1 | (STR+2)L | .5 | 6/60hrs | 300 | 1 |
| Kendachi Mono-Two (long | 3/5 | 1/0 | (STR+3)M/(STR+1)M | 1/.75 | 5/48hrs | 1650 | 2.1 |
| Knife | 8 | - | (STR)L | .5 | 2/4hrs | 30 | .75 |
| Longsword | 4 | 1 | (STR+2)M | 2 | 6/48hrs | 1000 | 1 |
| Mystic Tech. Spring Knife | 8 | 0 | (STR+2)L | .75 | 4/12hrs | 125 | 1.2 |
| Rapier | 5 | 1 | (STR+2)M | 2 | 6/48hrs | 1000 | 3 |
| Scimitar | 4 | 1 | (STR+2)M | 1.5 | 6/48hrs | 1,000 | 3 |
| Shortsword | 5 | 1 | (STR)M | 2 | 6/48hrs | 1000 | 3 |
| Slamdance Inc. Spawnblade | 8 | 0 | (STR)L | .5 | 4/72hrs | 100 | 1.1 |
| Stiletto | 10 | 0 | (STR)L | .3 | 6/48hrs | 1000 | 1 |
| Stiletto | 14 | 0 | (STR-1)L | .1 | 2/24hrs | 10 | .5 |
| Survival Knife | 6 | - | (STR+2)L | .75 | 3/6hrs | 450 | 1 |
| Sword | 4 | 1 | (STR+2)M | 1 | 3/24hrs | 500 | 1 |
| Two-Handed Sword | 2 | 1 | (STR+3)S | 5 | 6/48hrs | 3000 | 3 |
| AZ-150 Stun Baton | 5 | 1 | 8S Stun | 1 | 3/36hrs | 1500 | 2 |
| Club | 5 | 1 | (STR+1)M Stun | 1 | 2/6hrs | 10 | 1 |
| Devil | - | 2 | (str)S | 10 | 6/48hrs | 1500 | 3 |
| Mace | 2 | 1 | (STR)M | 5 | 6/48hrs | 700 | 3 |
| Mace | 4 | 1 | (STR+1)M Stun | 1 | 2/6hrs | 40 | 1 |
| Mjolnir warhammer | - | 2 | (STR+4)D | 15 | 6/48hrs | 2000 | 3 |
| Morning Star | 2 | 1 | (STR+1)M | 7 | 6/48hrs | 1000 | 3 |
| Sap | 8 | - | (STR+1)M Stun | 0 | 2/6hrs | 10 | 1 |
| Skull Crusher warhammer | 2 | 1 | (STR)S | 5 | 6/48hrs | 1000 | 3 |
| Stun Baton | 4 | 1 | 6S Stun | 1 | 3/36hrs | 750 | 1 |
| Halberd | 2 | 2 | (STR)S | 6 | 6/48hrs | 1000 | 3 |
| Lance | - | 2 | (kph/5)M | 2 | 4/12hrs | 60 | 1 |
| Long Spear | 2 | 2 | (STR)S | 4 | 6/48hrs | 1000 | 3 |
| Mersch MX-23 Stunlance | 2 | 2 | (STR+2)L/9S Stun | 3 | 5/48hrs | 2500 | 1 |
| Pole Arm | 2 | 2 | (STR)S | 4 | 4/48hrs | 500 | 2 |
| Scythe | - | 2 | (STR+1)S | 7 | 6/48hrs | 1000 | 3 |
| Staff | 2 | 2 | (STR+2)M Stun | 2 | 3/24hrs | 50 | 1 |
| Tetsubo | - | 2 | (STR+3)S | 3 | 5/24hrs | 500 | 1 |
| Bullwhip | 8 | 2 | (STR)L | 1 | 6/48hrs | 100 | 1 |
| Cat With Nine Tails | 5 | 2 | (STR+2)M | 3 | 6/48hrs | 1000 | 3 |
| Flail | 3 | 2 | (STR+1)M Stun | .75 | 4/12hrs | 50 | 1 |
| Flogger whip | 6 | 2 | (STR)M | 1 | 6/48hrs | 500 | 3 |
| Kendachi Monowhip | 9 | 3 | 10S | - | 26/14 days | 3500 | 3 |
| Monofilament Whip | 10 | 1 | 10S | 0 | 24/14days | 3000 | 3 |
| Whip | 6 | 2 | (skill/2)L | .5 | 5/24hrs | 200 | 1 |
| Bio-Injector | 8 | 0 | 5L | - | 14/7 days | 15000 | 3 |
| Bio-Injector | 8 | 0 | 5L + drug | .5 | 10/96hrs | 15000 | 1 |
| Brass Knuckles | 16/4 | 0 | (STR+1)M Stun | .2 | 2/24hrs | 20 | .75 |
| DinaTech F5C | 8 | 0 | (STR/2)L/(STR)L | - | 10/14 days | 350 | 3 |
| Drug-A-Thug | 6 | 0 | drug | .5 | 3/8hrs | 150 | 2 |
| Fashion Gloves | - | 0 | (STR+1)M Stun | .2 | 4/36hrs | 350 | 1 |
| Forearm Snap Blades | 7 | - | (STR)M | 1.5 | 4/48hrs | 850 | 2 |
| IMI | 6 | 0 | (STR+5)L | .75 | 6/48hrs | 120 | 1.2 |
| Kitchen Sink | - | 0 | ((2x STR)-6)S Stun | 10 | always | 100 | 1 |
| Shock Glove | 9 | - | 7S Stun | .5 | 5/48hrs | 950 | 2 |
| Taser II | 7 | 0 | 5S Stun | .5 | 4/24hrs | 300 | 1 |
| Techtronica Black-Zap Glove | 4 | 0 | 9S Stun | 1 | 6/48hrs | 1200 | 2.2 |

### Bow and crossbow
| Name | Concealability | Str.Min. | Damage | Weight | Availability | Cost | Street Index |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Arrows | 3 | - | (As bow) | .1 | 3/36hrs | 10 | 1 |
| Standard Bow | 2 | 1+ | (STR Min.+2)M | 1 | 3/36hrs | 100xSTR Min. | 1 |
| Ranger-X Arrows | 4 | - | (As bow) | .08 | 3/36hrs | 18 | 1 |
| Ranger-X Bow | 3 | 2+ | (STR+4)M | 1.5 | 5/36hrs | 120xSTR Min. | 2 |
| Bolts | 4 | - | (As crossbow) | .05 | 5/36hrs | 5 | 1 |
| Light Crossbow | 2 | 3 | 6L | 2 | 4/36hrs | 300 | 1 |
| Medium Crossbow | 2 | 4 | 6M | 3 | 5/36hrs | 500 | 1 |
| Heavy Crossbow | - | 5 | 8S | 4 | 6/36hrs | 750 | 1 |
| Throwing Knife | 9 | - | (STR)L | .25 | 2/24hrs | 20 | 1 |
| Shuriken | 8 | - | (STR)L | .25 | 2/24hrs | 30 | 2 |

### Firearms
| Name | Concealability | Ammunition | Mode | Damage | Weight | Availability | Cost | Street Index | Accessories |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Barton Arms Bracer | 7 | 1 | SS | 6L | .3 | 12/7days | 1300 | 3 | None |
| Barton Arms Gun Cane | 2/9 | 1 | SS | 6L | 1 | 10/7days | 500 | 2 | None |
| BudgetArms C13 | 8 | 8(c) | SA | 4L | .5 | 2/8hrs | 150 | .75 | None |
| Ceska Diplomat | 8 | 6(cy) | SS | 4L | .5 | 3/12hrs | 250 | 1 | None |
| Colt Take-Down | 8 | 2(b) | SA | 7M | .5 | 4/12hrs | 150 | .8 | None |
| Dai Lung Cybermag 15 | 7 | 10(c) | SA | 4L | .5 | 3/12hrs | 100 | .7 | None |
| Federated Arms X-22 | 7 | 10(c) | SA | 4L | .5 | 2/12hrs | 300 | .8 | None |
| Fichetti Tiffani Needler | 8 | 4(c) | SA | 5L | .5 | 7/48hrs | 650 | 2 | None |
| Hammerli Model 520 | 4 | 6(c) | SA | 6L | 1.25 | 8/4days | 1000 | 1 | Recoil Compensation (1) |
| H&K P48 | 8 | 6(c) | SA/BF | 4L | .45 | 4/24hrs | 300 | 1.5 | None |
| Morrissey | 8 | 5(c) | SA | 5L | .5 | 8/7days | 500 | 2 | None |
| North Industries Firing Knife | 6 | 5(cy) | SA | 4L | .5 | 5/12hrs | 250 | 1 | None |
| Raecor Sting | 9 | 5(c) | SS | 4M(f) | .25 | 10/7days | 375 | 2 | None |
| Star Model DWT | 7 | 6(c) | SA | 5L | .5 | 3/18hrs | 300 | .8 | None |
| Streetline Special | 8 | 6(c) | SS | 4L | .5 | 2/12hrs | 100 | .75 | None |
| Tiffani Self-Defender | 8 | 4(c) | SS | 4L | .5 | 2/12hrs | 450 | .75 | None |
| Walther Palm Pistol | 9 | 2(b) | SS | 4L | .25 | 3/12hrs | 200 | .75 | None |
| Ares Hornet | 8 | 7(cy) | DAR(SA) | 7L | 2 | 4/48hrs | 250 | .8 | None |
| Ares Light Fire 70 | 5 | 16(c) | SA | 6L | 1 | 3/12hrs | 475 | .8 | None |
| Ares Scorpion | 8 | 7(cy) | DAR(SA) | 7L | 2.25 | 4/48hrs | 275 | 1 | Laser Sight |
| Beretta Model 101T | 5 | 12(c) | SA | 6L | 1 | 3/12hrs | 350 | .8 | None |
| Ceska vz | 7 | 18(c) | SA | 6L | 1 | 3/12hrs | 500 | .8 | None |
| Colt American L36 | 6 | 11(c) | SA | 6L | 1 | 3/12hrs | 350 | .8 | None |
| Colt Protector | 8 | 6(cy) | SS | 6L | .75 | 2/12hrs | 300 | .7 | None |
| Dai Lung Streetmaster | 6 | 12(c) | SA | 6L | 1 | 3/12hrs | 325 | .8 | None |
| Federated Arms X-9mm | 5 | 12(c) | SA | 6L | 1 | 3/12hrs | 450 | .75 | None |
| Fichetti Security 500 | 7 | 12(c) | SA | 6L | 1 | 3/12hrs | 400 | .8 | None |
| Fichetti Security 500a | 6 | 25(c) | SA | 6L | 1.25 | 3/12hrs | 450 | .8 | None |
| Glock 19 Mk.IV | 5 | 17(c) | SA | 6L | 1 | 8/24hrs | 750 | 2 | Laser Sight, Recoil Compensation (1) |
| Glock 19 Mk.IV Smart | 5 | 17(c) | SA | 6L | 1 | 8/24hrs | 950 | 2 | Smartlink, Recoil Compensation (1) |
| Glock 19 Mk.IV Smart II | 5 | 17(c) | SA | 6L | 1 | 8/24hrs | 1150 | 2 | Smartlink II, Recoil Compensation (1) |
| H&K Cavaet | 5 | 9(c) | SA | 6L | 1.25 | 4/24hrs | 500 | 1 | None |
| H&K P7S15 | 6 | 15(c) | SA | 6L | 1 | 4/24hrs | 400 | 1 | None |
| H&K P11M8 | 8 | 8(c) | SA | 6L | 1 | 5/36hrs | 600 | 1.25 | None |
| H&K P11M13 | 8 | 13(c) | SA | 6L | 1 | 5/36hrs | 650 | 1.25 | None |
| Hammerli 610S | 4 | 6(c) | SA | 6L | 2.5 | 8/24hrs | 1295 | 2.5 | Customized |
| Mauser Ladyline | 7 | 8(c) | SA | 6L | .75 | 4/24hrs | 350 | 1 | None |
| Militech Arms Avenger | 6 | 10(c) | SA | 6L | 1 | 3/12hrs | 325 | .8 | None |
| Powell Knife Pistol | 8 | 1(b) | SS | 6L/(STR)L | .5 | 5/48hrs | 250 | 1 | None |
| Ruger P-8 | 8 | 10(c) | SA | 7L | .75 | 4/24hrs | 395 | 1 | None |
| Seco LD-120 | 5 | 22(c) | SA | 6L | 1.25 | 3/12hrs | 400 | .8 | Laser Sight |
| S&W Model 6739 | 8 | 5(cy) | SS | 6L | .75 | 3/36hrs | 250 | .9 | None |
| Thumper | 6 | 10(c) | SA | 5L Stun | 1.25 | 3/12hrs | 120 | .75 | None |
| Walther PB-120 | 8 | 15(c) | SA | 6L | .75 | 6/36hrs | 700 | 2 | None |
| Ares Assault Machine Pistol | 6 | 40(c) | SA/BF/FA | 6L | 2.75 | 8/36hrs | 1000 | 2 | Improved Gas Vent (2) |
| Ares Black Widow | 6 | 21(c) | SA/BF | 6L | 1 | 14/7days | 1500 | 3 | Silencer, Smartlink II |
| Ares Crusader MP | 6 | 40(c) | SA/BF | 6L | 3.25 | 5/36hrs | 950 | 2 | Gas Vent (2) |
| Beretta Model 200ST | 4 | 26(c) | SA/BF | 6L | 2 | 5/24hrs | 750 | 1.5 | Recoil Compensation (1) |
| BudgetArms Laser-Niner | 5(4) | 15(35)(c) | SA/BF/FA | 6L | 1.5 | 4/36hrs | 675 | 1.2 | Caseless, Laser Sight |
| Ceska Black Scorpion | 5 | 35(c) | SA/BF | 6L | 3 | 5/36hrs | 850 | 2 | Recoil Compensation (1) |
| Fichetti Executive Action | 6 | 24(c) | SA/BF | 6L | 1.5 | 14/7days | 1150 | 3 | None |
| H&K VP80Z | 6 | 21(c) | SA/BF | 6L | 1.25 | 6/48hrs | 1200 | 3 | Recoil Compensation (1) |
| Micro Uzi III | 6 | 16(c) | BF | 6L | 1.5 | 6/36hrs | 750 | 1 | Laser Sight |
| Ruger P-4 | 4 | 100(c) | BF | 7L | 1.25 | 8/48hrs | 1350 | 2.25 | None |
| Seco Quickfire | 5 | 18(c) | SA/BF/FA | 6L | 1.5 | 5/24hrs | 750 | 2 | None |
| Altmayr SP | 4 | 7(m) | SS | (Special) | 3 | 4/48hrs | 900 | 1.5 | None |
| Ares Constrictor | 6 | 6(cy) | DAR | 10M | 2.5 | 7/7days | 400 | 2 | Smartlink |
| Ares Jaguar | 5 | 6(cy) | DAR | 10M | 2.5 | 5/4days | 300 | 1 | Laser Sight |
| Ares Predator | 5 | 15(c) | SA | 9M | 2.25 | 3/24hrs | 450 | .5 | None |
| Ares Predator II | 4 | 15(c) | SA | 9M | 2.5 | 4/24hrs | 550 | .5 | Smartlink |
| Ares Predator III | 4 | 15(c) | SA | 9M | 2.5 | 6/36hrs | 700 | 1 | Smartlink II |
| Ares Stingray | 4 | 6(cy) | DAR | 10M | 2.75 | 7/7days | 500 | 3 | Laser Sight, Recoil Compensation (1) |
| Ares Stingray Smart | 4 | 6(cy) | DAR | 10M | 2.75 | 7/7days | 500 | 3 | Smartlink, Recoil Compensation (1) |
| Ares Viper Silvergun | 6 | 30(c) | SA/BF | 9S(f) | 2 | 3/48hrs | 600 | 1 | Silencer |
| Armalite 44 | 4 | 8(c) | SA | 9M | 2.25 | 4/24hrs | 450 | 1 | None |
| Beretta Model 95S | 5 | 15(c) | SA | 9M | 2.5 | 3/24hrs | 500 | 1 | Smartlink II |
| Beretta Model 95S-B | 5 | 15(c) | SA/BF | 9M | 2.5 | 6/72hrs | 750 | 1.75 | Smartlink II |
| Beretta 100S | 5 | 15(c) | SA | 9M | 2.5 | 5/36hrs | 650 | 1.5 | Laser Sight, Silencer |
| Beretta 100S Smart | 5 | 15(c) | SA | 9M | 2.5 | 5/36hrs | 1300 | 1.5 | Smartlink, Silencer |
| Beretta Model 110-T | 5 | 16(c) | SA | 9M | 2 | 3/24hrs | 400 | 1 | Laser Sight |
| Bond & Carrington MP-11 | 4 | 15(30)(c) | SA/BF | 9M | 3 | 8/36hrs | 1200 | 2 | Gas Vent (2), Laser Sight |
| Bond & Carrington MP-11 Smart | 4 | 15(30((c) | SA/BF | 9M | 3 | 8/36hrs | 2000 | 2 | Gas Vent (2), Smartlink |
| Browning Defender 10 | 5 | 15(c) | SA/BF | 9M | 2 | 5/36hrs | 900 | 2 | None |
| Browning Defender 10 Smart | 5 | 15(c) | SA/BF | 9M | 2 | 5/36hrs | 1800 | 2 | Smartlink |
| Browning Max-Power | 6 | 10(c) | SA | 9M | 2 | 3/24hrs | 450 | 1 | None |
| Browning Ultra-Power | 6 | 10(c) | SA | 9M | 2.25 | 4/24hrs | 525 | 1.5 | Laser Sight |
| BudgetArms Auto 3 | 5 | 8(c) | SA | 9M | 2.25 | 4/12hrs | 350 | .7 | None |
| Colt Alpha-Omega | 4 | 10(c) | SA | 9M | 2.5 | 5/24hrs | 500 | 1 | Gas Vent (1), Smartlink |
| Colt AMT Model 2000 | 5 | 8(c) | SA | 9M | 2.5 | 5/24hrs | 500 | 1 | None |
| Colt Manhunter | 5 | 16(c) | SA | 9M | 2.5 | 4/24hrs | 425 | 1 | Laser Sight |
| Colt Manhunter S | 5 | 16(c) | SA | 9M | 2.25 | 4/24hrs | 600 | 1 | Smartlink |
| Colt Manhunter S | 5 | 16(c) | SA | 9M | 2.25 | 6/48hrs | 800 | 1 | Smartlink II |
| Colt Peacemaker | 4 | 6(cy) | SS | 10M | 2.75 | 3/24hrs | 350 | .9 | None |
| Colt Penetrator | 5 | 12(c) | SA | 9M | 2 | 4/24hrs | 600 | 1.5 | None |
| DinaTech F5A | 10 | 1 | SS | 10M | - | 10/14days | 500 | 3 | None |
| DinaTech F5B | 10 | 1 | SS | 7S | - | 12/14days | 700 | 3 | None |
| Federated Arms 454 DA | 3 | 5(cy) | SS | 11M | 3.5 | 5/36hrs | 1,375 | 1.25 | None |
| Fichetti Hurricane | 5 | 14(30)(c) | SA/BF | 9S(f) | 2 | 3/48hrs | 600 | 1 | None |
| Fichetti Military XI | 4 | 18(c) | SA/BF | 9M | 2.25 | 5/36hrs | 900 | 2 | Laser Sight, Recoil Compensation (1) |
| Fichetti Military XI Smart | 4 | 18(c) | SA/BF | 9M | 2.25 | 5/36hrs | 1800 | 2 | Smartlink, Recoil Compensation (1) |
| Glock 22 Mk. III | 4 | 15(c) | SA | 9M | 2.5 | 6/24hrs | 600 | 1.5 | Laser Sight |
| Glock 22 Mk. III Smart | 4 | 15(c) | SA | 9M | 2.5 | 6/24hrs | 800 | 1.5 | Smartlink |
| Glock 22 Mk. III Smart II | 4 | 15(c) | SA | 9M | 2.5 | 6/24hrs | 1000 | 1.5 | Smartlink II |
| Glock Thirty Machine Pistol | 6(5) | 20(30)(c) | SA/BF | 9M | 2.5 | 6/36hrs | 705 | 2 | Gas Vent (2) |
| Goncz-Taurus Pistol | 6(5) | 15(30)(c) | SA | 9M | 2 | 4/48hrs | 500 | 1 | None |
| Goncz-Taurus Pistol(Selective) | 6(5) | 15(30)(c) | SA/FA | 9M | 2 | 8/72hrs | 700 | 1.75 | None |
| H&K 'Blaster' | 4 | 6(m) | SS | 12M | 3 | - | - | - | None |
| H&K OHWS | 5 | 12(c) | SA | 9M | 1.2 | 18/14 days | 2,500 | 2 | Flashlight, Laser Sight |
| Ingram Mk IV | 4 | 16(c) | SA/BF | 10M | 3 | 18/14 days | 2500 | 3 | Gas Vent (3), Smartlink |
| Malorian Arms 3516 | 4 | 6(c) | SS | 12M | 3 | - | 4,525 | - | Smartlink II, Strength 4 required to shoot |
| Malorian Arms Heavy Flechette | 5 | special | SA | 9M | 2.5 | 9/48hrs | 1595 | 2 | Smartlink |
| Malorian Arms Sliver Gun | 4 | 7(c) | SA | 6S(f) | 2.5 | 6/72hrs | 1375 | 3 | None |
| Morrissey Alta | 6 | 12(c) | SA | 9M | 1 | 8/48hrs | 1200 | 2 | Laser Sight |
| Morrissey Elite | 6 | 5(c) | SA | 9M | 1 | 6/48hrs | 950 | 2 | Laser Sight |
| Nova .338 City Gun | 5 | 7(c) | SA | 10M | 2.5 | 4/24hrs | 460 | 1 | None |
| Phoenix Gyroc | 3 | 3(b) | SA | ammo | 3 | 8/7days | 10000 | 2 | None |
| Polymer One-Shot Cannon | 5 | 1 | SS | 5S | 1.5 | 3/12hrs | 190 | .6 | None |
| Remington Roomsweeper | 8 | 8(m) | SA | 9S(f) | 2.5 | 3/24hrs | 300 | 1 | None |
| Ruger Super Warhawk | 4 | 6(cy) | SS | 10M | 2.5 | 3/24hrs | 300 | 1 | None |
| Ruger Thunderbolt | 4 | 12(c) | BF | 12S* | 2.75 | 14/12days | 1000 | 3 | None |
| Ruger Thunderbolt - Laser Sight | 4 | 12(c) | BF | 12S* | 2.75 | 14/12days | 1250 | 3 | Laser Sight |
| Ruger Thunderbolt - Smartlinked | 4 | 12(c) | BF | 12S* | 2.75 | 14/12days | 1400 | 3 | Smatlink |
| Riot Gun | 8 | 3(c) | SA | 9S(f) | 2 | 4/48hrs | 500 | 1 | None |
| Ruger M45 | 6 | 18(c) | SA/FA | 9M | 2 | 8/60hrs | 860 | 3 | Laser Sight |
| Ruger P-105 | 4 | 10(c) | SA | 10M | 2.5 | 4/24hrs | 600 | 1 | None |
| Ruger Warhawk | 5 | 6(cy) | SS | 9M | 2 | 3/24hrs | 250 | 1 | None |
| S&W 'Tri-Star' | 3 | 6(cy) | SS | 10M | 2.5 | 6/24hrs | 375 | 1.5 | Laser Sight |
| Savalette Guardian | 5 | 12(c) | SA/BF | 9M | 3.25 | 6/36hrs | 900 | 2.5 | Recoil Compensation (1), Smartlink II |
| Sig Sauer P300 | 4 | 18(c) | SA | 9M | 3.25 | 8/48hrs | 800 | 2 | Caseless, Laser Sight, Silencer |
| SMF | 3 | 5(cy) | SS | 11M | 3.5 | 10/7days | 950 | 2 | None |
| SternMeyer Type 35 | 5 | 8(c) | SA | 9M | 2.5 | 4/36hrs | 400 | 1 | None |
| SuperEagle | 4 | 7(c) | SA | 11M | 2.75 | 6/48hrs | 600 | 1.5 | Smartlink |
| Syrko Wolf | 5 | 17(c) | SA/BF | 9M | 2.5 | 5/48hrs | 800 | 1.5 | Smartlink |
| Walther Secura | 6 | 12(c) | SA | 9M | 1.5 | 5/48hrs | 500 | 1.5 | None |
| Zastava Magnum Model 2054 | 5 | 7(cy) | SS | 9M | 1.75 | 4/36hrs | 350 | .9 | None |
| Colt TP-6A | 7 | 6(m) | SS | 8S | .75 | 6/24hrs | 550 | 1 | None |
| Defiance Super Shock | 4 | 4(m) | SA | 10S | 2 | 5/24hrs | 1000 | 1 | Low-light Scope |
| Miltech Electronics Taser | 6 | 10(m) | SS | 8S Stun | 1.5 | 5/36hrs | 600 | 1.4 | None |
| Stundart Pistol | 3 | 2(b) | SS | 10S Stun | 3.5 | 8/4days | 1090 | 2 | None |
| Techtronica Model 009 | 3 | 6(c) | SS | 10S Stun | 3.5 | 8/72hrs | 1950 | 2.5 | None |
| Yamaha Pulsar | 5 | 4(m) | SA | 10S Stun | 2 | 12/7days | 1350 | 2 | None |
| Ares Cascade | 4 | 60 | SA | (Special) | 5.5 | 12/14days | 1800 | 2 | None |
| Ares ELD-AR | 4 | 50(c) | SA/BF | (Special) | 4.5 | 9/7days | 950 | 2 | None |
| Ares Squirt | 7 | 10/20 | SA | (Special) | 1.75 | 8/3days | 750 | 2 | None |
| Ares SuperSquirt II | 7 | 20 | SA | (Special) | 2 | 9/14days | 800 | 1.5 | None |
| Avante P-1135 Needlegun | 5 | 15(c) | SA | 5L | 1 | 2/12hrs | 200 | .75 | None |
| Enerts AKM Power Squirt | 5 | 50(m) | SS | (Drugs) | 1 | always | 15 | 1 | None |
| FAB-NG Netgun | 3 | 4(b) | SA | (Special) | 4.5 | 8/14days | 1500 | 4 | None |
| FAB-NG Netgun | 2 | 4(b) | SA | (Special) | 5 | 8/14days | 2500 | 5 | None |
| Kendachi Dragon flamethrower | 3 | 4(m) | SS | 10M | 4.25 | 10/5 days | 1,660 | 4.5 | None |
| Micro-Missile Pod | (-2) | 1(m) | SS | (Micromissile) | .75 | 8/5days | 2000 | 1.9 | None |
| Militech Urban Missile Launchr | 3 | 12(c) | SA | (Micromissile) | 3.5 | 10/7days | 4500 | 2 | None |
| Narcoject Pistol | 7 | 5(c) | SA | (As toxin) | 1.5 | 6/2days | 600 | 2 | None |
| Narcoject Rifle | 4 | 10(c) | SA | (As toxin) | 3.25 | 8/2days | 1700 | 2 | None |
| Nelspot | 4 | 20(c) | SA | 4L Stun | 1.5 | 2/24hrs | 200 | .75 | None |
| Net Gun | 4 | 4(b) | SA | (Special) | 4 | 8/36hrs | 750 | 2 | Laser Sight |
| Net Gun | 3 | 4(b) | SA | (Special) | 4.5 | 8/36hrs | 1150 | 2 | Laser Sight |
| Pursuit Security Webgun | 3 | 1(m) | SS | (Special) | 3.5 | 6/3days | 500 | 2.5 | None |
| Rostovic Wrist Racate | 6 | 6(m) | SA/BF | 9S | 2.5 | 18/20days | 3800 | 3.5 | None |
| Sonic Stunner | 6 | 10 | SA | 15M | 2 | 6/36hrs | 1000 | 1.5 | None |
| Spetsdod | 7 | 15(c) | SS | (Dart) | .25 | 18/21days | 3600 | 1 | None |
| Techtronica M40 | 1 | 6(c) | SS | (Special) | 8.5 | - | 3500 | - | None |
| Tsunami Arms | 5 | 5(cy) | SA | (Special) | 1.5 | 11/14days | 325 | 2.5 | Gun Camera, Laser Sight |
| Tsunami Arms | 5 | 7(cy) | SA | special | 1.5 | 12/14days | 400 | 3 | Smartlink |
| Underbarrel Capacitor Laser | (-2) | 2(20) | SA | 10M | 5 | 24/21 days | 95000 | 3.5 | None |
| AK-97 SMG | 4 | 30(c) | SA/BF/FA | 6M | 4 | 5/3days | 800 | 1 | None |
| Arasaka Minami 10 | 6 | 40(c) | SA/BF/FA | 7M | 3.25 | 3/24hrs | 1000 | .9 | None |
| Beretta M-24 Advanced | 4 | 50(c) | BF/FA | 7M | 3.5 | 6/4days | 950 | 1.25 | None |
| Beretta M-24 Advanced Smart | 4 | 50(c) | BF/FA | 7M | 3.5 | 6/4days | 1250 | 1.25 | Smartlink |
| Berretta Model 70 | 3 | 35(c) | BF/FA | 6M | 3.75 | 5/3days | 900 | 1 | Laser Sight, Sound Suppressor |
| Buzzsaw | 4 | 1000(c) | FA | 7L | 5.5 | 12/14days | 215 | 1 | None |
| Ceres Tri-Barrel | 2 | 36(c)/belt | BF/FA | 6L | 4.5 | 9/60hrs | 1000 | 3 | Smartlink |
| Colt Cobra TZ-110 | 5 | 32(c) | SA/BF/FA | 6M | 3 | 6/36hrs | 700 | 2 | Gas Vent (2) |
| Colt Cobra TZ-115 | 5 | 32(c) | SA/BF/FA | 6M | 3 | 6/36hrs | 850 | 2 | Gas Vent (2), Laser Sight |
| Colt Cobra TZ-118 | 5 | 32(c) | SA/BF/FA | 6M | 3 | 6/36hrs | 1000 | 2 | Gas Vent (2), Smartlink |
| Defiance AT-900 | 4 | 30(c) | SA/BF/FA | 6M | 3.75 | 5/36hrs | 900 | 1 | Gas Vent (2), Laser Sight |
| Defiance AT-900 Smart | 4 | 30(c) | SA/BF/FA | 6M | 3.75 | 5/36hrs | 1800 | 1 | Gas Vent (2), Smartlink |
| Federated Arms Tech Assault II | 5 | 50(c) | SA/FA | 6L | 2.5 | 4/36hrs | 600 | 1 | None |
| FN P55 | 5 | 50(c) | SA/BF/FA | 8M | 3.5 | 8/4days | 650 | 2.5 | Gas Vent (2), Magnification (2) |
| FN P55 Smart | 5 | 50(c) | SA/BF/FA | 8M | 3.75 | 9/4days | 900 | 2.75 | Gas Vent (2), Smartlink |
| H&K MP7z Urban Combat | 6/18 | 36(c) | SA/BF/FA | 7M | 1.75 | 6/6days | 2200 | 2 | Gas Vent (3), Silencer |
| H&K MP7z Urban Combat Smart | 6/18 | 36(c) | SA/BF/FA | 7M | 2 | 8/8days | 4000 | 2 | Gas Vent (3), Silencer, Smartlink |
| H&K MP-9 | 4 | 25(c) | SA/BF | 7M | 3.75 | 5/36hrs | 900 | 1 | Gas Vent (3), Smartlink |
| H&K MP-2013 | 3 | 35(c) | SA/BF/FA | 6M | 2.75 | 5/48hrs | 900 | 1.1 | Sound Suppressor |
| H&K MPK9 | 5 | 35(c) | SA/BF | 7M | 3 | 5/36hrs | 1040 | .8 | None |
| H&K MPK-11 | 4 | 30(c) | SA/FA | 7M | 3.5 | 5/48hrs | 1,400 | 1.2 | None |
| Heckler & Koch HK227 | 4 | 28(c) | SA/BF/FA | 7M | 4 | 4/24hrs | 1500 | .75 | Gas Vent (2), Laser Sight |
| Heckler & Koch HK227-S | 5 | 28(c) | SA/BF | 7M | 3 | 10/7days | 1200 | 2 | Laser Sight, Silencer |
| Heckler & Koch MP-5TX | 5 | 20(c) | SA/BF/FA | 6M | 3.25 | 5/36hrs | 850 | 1 | Gas Vent (2), Laser Sight |
| Ingram MAC-14 | 6 | 20(c) | SA/FA | 7M | 3 | 4/36hrs | 650 | 1 | None |
| Ingram MAC-20 | 5 | 20(c)/16(32)(c) | SA/FA | 9M/7M | 3.75/3.5 | 6/48hrs | 700 | 1.5 | Sound Suppressor |
| Ingram Smartgun Model 20t | 5 | 32(c) | BF/FA | 7M | 3 | 4/24hrs | 950 | 1 | Gas Vent (2), Smartlink |
| Ingram Super Mach 100 | 5 | 40(c) | SA/BF/FA | 6L | 3 | 9/48hrs | 850 | 3 | Gas Vent (3) |
| Ingram Warrior | 4 | 30(c) | SA/BF | 7M | 3 | 3/24hrs | 650 | .9 | None |
| Malorian Arms SubFlechette Gun | 3(2) | 10(30)(c) | BF/FA | 6M | 4 | 4/24hrs | 795 | 1 | Caseless, Gas Vent (3) |
| Militech-10 | 2 | 30(c) | BF/FA | 6M | 7 | 5/72hrs | 3455 | 3 | Magnification 91), Grenade Launcher (4-shot), Sound Suppressor |
| Militech Mini-Gat Carbine | 1 | 120(c) | BF/FA | 6L | 5.75 | 20/14days | 2695 | 5 | Caseless |
| Sandler Model II | 3 | 30(c) | BF/FA | 6M | 3.75 | 4/24hrs | 700 | 1 | Gas Vent (2), Laser Sight |
| Sandler TMP | 4 | 20(c) | BF/FA | 6M | 3.25 | 5/36hrs | 500 | 1 | Laser Sight, Recoil Compensation (1) |
| SCK Model 100 | 4 | 30(c) | SA/BF | 7M | 4.5 | 5/36hrs | 1000 | 1 | Smatlink |
| Setsuko-Arasaka | 4 | 40(c) | SA/BF | 6M | 3.5 | 4/72hrs | 950 | 1 | Caseless, Sound Suppressor |
| Setsuko-Arasaka | 4 | 40(c) | SA/BF | 6M | 3.5 | 4/72hrs | 1150 | 1 | Caseless, Smartlink, Sound Suppressor |
| Sternmeyer SMG 21 | 4 | 30(c) | SA.BF/FA | 7M | 3.25 | 4/36hrs | 1000 | 1.1 | None |
| Steyr MP i 25 | 4 | 35(c) | SA/BF/FA | 6M | 3.75 | 5/60hrs | 725 | 2 | Gas Vent (1), Laser Sight |
| Syrko Eagle | 4 | 50(c) | SA/FA | 6M | 3 | 5/3days | 900 | 1 | Gas Vent (2), Smartlink |
| Uzi III | 5 | 24(c) | BF | 6M | 2 | 4/24hrs | 600 | .75 | Laser Sight |
| Uzi 3S | 5 | 24(c) | SA/BF | 6M | 2.5 | 10/36hrs | 900 | 2 | Laser Sight, Sound Suppressor |
| Uzi IV | 4 | 30(c) | SA/BF/FA | 6M | 3 | 6/60hrs | 1000 | 1 | Gas Vent (2), Laser Sight |
| Uzi IV Smart | 5 | 30(c) | SA/BF/FA | 6M | 3.25 | 8/60hrs | 1200 | 1.25 | Gas Vent (2), Smartlink |
| Uzi Miniauto 9 | 5 | 30(c) | BF/FA | 6M | 3 | 4/36hrs | 700 | 1 | None |
| Walther S900 | 4 | 30(c) | SA/BF | 6M | 3 | 5/36hrs | 900 | 1 | Gas Vent (2), Laser Sight |
| Ares Alpha Combat Gun | 2 | 42(c) | SA/BF/FA | 8M | 5.25 | 8/48hrs | 2000 | 4 | Grenade Launcher (8-shot), Recoil Compensation (2), Smartlink II |
| Ares High-Vel. Assault Rifle | 2 | 50(c) | SA/BF/FA | 6M | 5 | 14/7days | 3200 | 4 | Recoil Compensation (3), Smartlink II |
| AK-97 | 3 | 38(c) | SA/BF/FA | 8M | 4.5 | 3/36hrs | 700 | 2 | None |
| AK-98 | 2 | 38(c) | SA/BF/FA | 8M | 6 | 8/4days | 2500 | 4 | Grenade Launcher (6-shot) |
| AKR-20 | 3 | 30(c) | SA/BF/FA | 8M | 4 | 5/48hrs | 1000 | 2 | Gas Vent (1), Laser Sight |
| Anti-Vehicular Rifle | 3 | 10(c) | SA/BF | 8S | 5.3 | 14/16days | 6000 | 3.2 | Magnification (2) |
| Colt M22A2 | 3 | 40(c) | SA/BF/FA | 8M | 4.75 | 4/3days | 1600 | 2 | Gas Vent (1), Grenade Launcher (6-shot), Magnification (2) |
| Colt M-23 | 3 | 40(c) | SA/BF/FA | 8M | 4.5 | 6/36hrs | 950 | 2 | None |
| Darra-Polytechnic M-9 | 3 | 40(c) | SA/FA | 8M | 3.75 | 3/36hrs | 1300 | .9 | Caseless, Magnification (1) |
| Federated Arms Light Assault15 | 3 | 30(c) | BF/FA | 8M | 3.5 | 4/36hrs | 400 | 1.25 | Caseless, Magnification (1) |
| Federated Arms Light Assault15 | 3 | 30(c) | BF/FA | 8M | 3.5 | 4/36hrs | 700 | 1.25 | Caseless, Magnification (1), Smartlink |
| FN AGRL | - | 40(c) | SA/BF/FA | 8M | 5 | 5/36hrs | 2000 | 2 | Gas Vent (2)< Grenade Launcher (6-shot), Laser Sight, Magnification (2) |
| FN HAR | 2 | 35(c) | SA/BF/FA | 8M | 4.5 | 4/48hrs | 1200 | 2 | Gas Vent (2), Laser Sight |
| FN RAL | 3 | 30(c) | SA/FA | 8M | 5 | 5/60hrs | 1200 | 2 | Magnification (1) |
| H | 3 | 30(c) | SA/BF/FA | 8M | 4 | 3/36hrs | 1500 | 4 | None |
| H | 2 | 32(c) | SA/BF/FA | 8M | 5.25 | 8/4days | 2200 | 3 | Gas Vent (2), Laser Sight, Shock Pads |
| H | 2(1) | 20(45)(c) | SA/BF/FA | 8M | 3.75 | 8/7days | 950 | 2 | Gas Vent (2) |
| H | 3(2) | 20(45)(c) | SA/BF/FA | 8M | 4 | 8/7days | 950 | 2.25 | Gas Vent (2) |
| Honda AR-1 | 3 | 28(c) | BF/FA | 8M | 4.25 | 9/6 days | 1000 | 2 | Magnifcation (1) |
| Kalashnikov A-80 | 1 | 35(c) | SA/FA | 8M | 4.5 | 4/36hrs | 1100 | 2.5 | None |
| Kalishnikov AK-100 | - | 30(c) | SA/BF/FA | 8M | 5.75 | 5/36hrs | 1000 | 2 | Gas Vent (2) |
| Kalishnikov AK-100 Smart | - | 30(c) | SA/BF/FA | 8M | 5.75 | 5/36hrs | 2000 | 2 | Gas Vent (2), Smartlink |
| Kalishnikov AK-101 | 2 | 30(m) | SA/BF/FA | 8M | 5.5 | 8/4days | 1600 | 2 | Gas Vent (2), Laser Sight |
| Kalishnikov AK-101 Smart | 2 | 30(m) | SA/BF/FA | 8M | 5.5 | 8/4days | 3200 | 2 | Gas Vent (2), Smartlink |
| Maremont LR | 3 | 36(c) | BF/FA | 8M | 4.25 | 6/4days | 1400 | 2.5 | Laser Sight, Magnification (1) |
| Militech Cyborg Rifle | 2 | 30(c) | SA | 6S | 7.5 | 10/7days | 800 | 2.5 | Gas Vent (2) |
| Militech M-31a1 AICW | 1 | 150(c) | SA/BF/FA | 6M | 6.5 | 20/28days | 1695 | 4.5 | Grenade Launcher (4-shot) |
| Militech Ronin Light Assault | 1 | 35(c) | SA/BF/FA | 8M | 3.5 | 4/48hrs | 900 | 2 | Laser Sight |
| Parker Carbine | 3 | 500(c) | FA | 6M | 5.1 | 12/7days | 2500 | 1 | Caseless, Gas Vent (2), recoil is halved |
| Samopal vz 88V | 2 | 35(c) | SA/BF/FA | 8M | 5.5 | 5/36hrs | 1800 | 2 | Gas Vent (2), Laser Sight, Magnification(2), Shock Pads |
| S&W Model F 'Cyborg Assault' | 4 | 8(c) | SS | 8S | 4 | 10/5days | 1650 | 2.5 | 22mm Muzzle Adaptor |
| SIG 880 | 2 | 30(c) | SA/BF | 8M | 4 | 4/36hrs | 850 | 2 | Gas Vent (2), Laser Sight |
| SIG 882 | 3 | 30(c) | SA/BF | 8M | 4 | 5/36hrs | 850 | 2 | Gas Vent (2), Laser Sight |
| Seco M-995 | - | 30(c) | SA/BF/FA | 8M | 5.75 | 10/4days | 3000 | 3 | Gas Vent (3), Grenade Launcher (6-shot), Laser Sight, Rangefinder Grenade Link |
| Seco M-995 Smart | - | 30(c) | SA/BF/FA | 8M | 5.75 | 10/4days | 6000 | 3 | Gas Vent (3), Grenade Launcher (6-shot), Rangefinder Grenade Link, Smartlink |
| Arasaka Rapid Assault Shot 12 | 1 | 20(c) | SA/FA | 8S | 5.5 | 8/10days | 1800 | 2.25 | None |
| Ares Wippet | 4 | 6(m) | SA | 6M/9M | 2 | 5/36hrs | 1500 | 1.5 | None |
| Chandler Capture 100 | 3 | 10(m) | SA | 10S | 4 | 4/24hrs | 1500 | 2 | Gas Vent (2), Shock Pads |
| Chandler Capture 100 Smart | 3 | 10(m) | SA | 10S | 4 | 4/24hrs | 2200 | 2 | Gas Vent (2), Shock Pads, Smartlink |
| Syrko Cobra | 2(4) | 10(c) | SA | 10S | 4.5 | 4/60hrs | 1200 | 1 | Smartlink |
| Defiance T-250 | 4 | 5(m) | SA | 10S | 3 | 3/24hrs | 1400 | 1 | None |
| Eichiro Hatamoto II | 6 | 1 | SS | 8S | 2.5 | 12/7days | 1200 | 2 | None |
| Enfield AS7 | 4 | 10(50)(c) | SA/BF | 8S | 4 | 8/8days | 1000 | 1 | Laser Sight |
| Franchi SPAS-22 | 2 | 10(m) | SA/BF | 10S | 4 | 6/48hrs | 1000 | 2 | Smartlink II |
| Holland & Holland .600 NE | - | 2(b) | SA | 12S | 4.5 | - | 10000 | - | None |
| Kimatsuhama UBS-5 | (-2) | 4(m) | SS | 7S | 2.25 | 5/48hrs | 500 | 1.1 | None |
| Kimatsuhama UBS-6 | (-2) | 6(m) | SA | 7S | 2.5 | 6/48hrs | 750 | 1.1 | None |
| Kimatsuhama UBS-7 | (-3) | 2x 4(m) | 2x SS | 7S | 3.5 | 10/7days | 1700 | 1.25 | None |
| Luigi 'King Buck' Multi-Magnum | 1 | 4(m) | SA | 9S | 7 | 12/4days | 800 | 2.1 | CB2 |
| Militech Crusher SSG | 5 | 6(c) | SA | 6S/8M | 3 | 6/48hrs | 1450 | 1.5 | None |
| Militech Military | 2 | 6(m) | SA | 10S | 4.5 | 4/60hrs | 800 | 1 | None |
| Militech Military | 2 | 8(m) | SA | 8S | 4.5 | 4/60hrs | 800 | 1 | None |
| Mossberg CMDT | 2 | 8(c) | SA/BF | 9S | 4.25 | 8/8days | 1400 | 1 | Laser Sight |
| Mossberg CMDT | 2 | 8(c) | SA/BF | 9S | 4.5 | 12/8days | 1900 | 2 | Smartlink |
| Ranger Arms Security 12 | 3 | 15(c) | SA/BF/FA | 10S | 4.5 | 10/8days | 2000 | 2 | Gas Vent (2), Laser Sight |
| Remington 990 | 2 | 8(m) | SA | 10S | 4 | 3/48hrs | 650 | 2 | None |
| Remington 990 Sawn-Off | 4 | 8(m) | SA | 8S | 4 | 3/48hrs | 650 | 2 | None |
| Remington 1628 | 4 | 8(m) | SS | 8S | 3 | 3/24hrs | 500 | 1 | None |
| Remington Rapid Assault 12 | 3 | 15(c) | SA/BF | 10S | 4.5 | 12/8days | 2000 | 2 | Smartlink |
| Wirtz SW3i DemoControl | 3 | 4(m) | SS | (special) | 3 | 9/16days | 600 | 4 | None |
| Wristbreaker I | 2(3) | 2x 10(m) | 2x SA/FA | 8S | 4.25 | 14/14days | 1450 | 3 | None |
| Wristbreaker II | 3(4) | 2x 5(m) | 2x SA | 8S | 2.75 | 8/10days | 1450 | 1.5 | None |
| Sandler 'Mad Max' | 5 | 2(b) | SA | 6S | 2.25 | 4/48hrs | 400 | 1 | None |
| Sternmeyer Stakeout 10 | 4 | 10(m) | SA | 9S | 3.75 | 8/7days | 900 | 1.5 | None |
| Barret Model 121 HSR | - | 14(c) | SA | 14D | 10 | 14/30days | 4800 | 5 | Recoil Compensation (2), Silencer, Smartlink |
| H&K PSG-65 | - | 20(m) | SA | 14S | 6 | 12/7days | 7000 | 4 | Gas Vent (2), Low-Light, Magnification (3), Smartlink, Thermographic |
| Ranger Arms SM-3 | - | 6(m) | SA | 14S | 4 | 12/7days | 4000 | 4 | Gas Vent (2), Low-Light or Thermographic, Magnification (3), Silencer |
| SMF K6 | - | 30(c) | SA/FA | 10S | 5 | 14/21days | 2000 | 3 | Gas Vent (2) |
| Tsunami Arms Ramjet Rifle | - | 9(c) | SA/BF | 10S/12S/14S/16S | 5 | 16/14 days | 7380 | 4 | Bipod, Magnification (3), Recoil Compensation (1), Samrtlink II |
| Walther WA-2100 | - | 10(m) | SA | 14S | 4.5 | 12/7days | 6500 | 4 | Smartlink |
| Remington 750 | 3 | 5(m) | SA | 7S | 3 | 3/24hrs | 600 | 1 | Magnification (1) |
| Remington 950 | 2 | 5(m) | SA | 9S | 4 | 3/24hrs | 1300 | 1 | Magnification (1) |
| Ruger 100 | 2 | 5(m) | SA | 7S | 3.75 | 3/24hrs | 1300 | 1 | Magnification (3) |
| SIG 883 SP | 2 | 5(30)(c) | SA | 9M | 4.25 | 3/36hrs | 950 | 1.5 | Magnification (2), Shock Pads |
| Mossberg M-712 | 3 | 35(c)/15(c) | (SA/BF/FA)/(SA) | 8M/10S | 6 | 12/7days | 4000 | 3 | Gas Vent (2, Rifle), Magnification (2), Smartlink |
| Steyr AUG-CSL | varies | 40(c) | varies | varies | varies | 10/4days | 4500 | 3 | Laser Sight |
| Syrko Panther | 1 | 40(c)/25(c) | (SA/FA)/(SA/BF) | 8M/8S | 5.25 | 8/7days | 4000 | 3 | Gas Vent (3, Rifle), Gas Vent (2, Shotgun), Smartlink |
| Ares MP LMG | - | belt/50(c) | BF/FA | 7S | 7.5 | 6/5days | 2200 | 2 | Gas Vent (2), Laser Sight, Shock Pads |
| Ares HV MP-LMG | - | 80(c) | SA/BF/FA | 6S | 8 | 20/14days | 4500 | 4 | Recoil Compensation (3), Smartlink II |
| GE Vindicator Minigun | - | belt/50(c) | FA | 7S | 15 | 24/14days | 2500 | 2 | None |
| H&K G-6 Advanced Squad Auto. | - | 100(c) | FA | 7M | 7 | 14/21days | 2050 | 3.5 | Caseless, Magnification (2), Smartlink II, Thermographic |
| H&K MG4/46 | - | belt/100(c) | BF/FA | 7S | 7 | 11/8days | 2500 | 4 | Laser Sight, Magnification (3), Shock Pads, Thermographic |
| Ingram Valiant | - | belt/50(c) | BF/FA | 7S | 9 | 6/5days | 1500 | 2 | Gas Vent (2), Shock Pads |
| IWS Mini-5 | - | belt | FA | 7S | 14 | 24/14days | 13000 | 2 | None |
| IWS Mini-5 Smart | - | belt | FA | 7S | 14 | 24/14days | 26000 | 2 | Smartlink |
| SIG 883 | 1 | 30(50)(c) | SA/FA | 9M | 6.5 | 6/48hrs | 1000 | 2.5 | Bipod, Gas Vent (3), Laser Sight, Shock Pads |
| Syrko Tiger | - | 40(c)/belt | SA/FA | 7S | 8.25 | 7/7days | 3000 | 2 | Caseless, Gas Vent (3), Smartlink |
| Ares MP Laser | - | 20(Pack) | SA | 15M | 30 | NA | 2500000 | NA | None |
| Ares MP Laser III | - | 20(Pack) | SA | 15M | 25 | 24/21days | 120000 | 3 | None |
| Infrared Laser | normal | normal | normal | normal | normal | +4/+7 days | double normal | +1 | normal |
| Laser LAW | 2 | 1(m) | SS | 12M | 5 | 24/21days | 75000 | 3 | None |
| Laser VLAW | 4 | 1(m) | SS | 10M | 3.5 | 24/21days | 60000 | 3 | None |
| Militech Electronics Laser | - | (Special) | SA | 3M to 15M | 25 | 26/21days | 130000 | 3.25 | None |
| 2-Barrel HMG Chaingun | - | belt | FA | 9S | 20 | 26/21days | 6500 | 2 | None |
| 7.62cm 10-Barrel | - | 10(m) | FA | (7.62cm rocket) | 30 | 22/14days | 9500 | 4 | None |
| 7.62cm Single Barrel | - | 1(m) | SA | (7.62cm rocket) | 2.5 | 10/10days | 1000 | 1.75 | None |
| 12.7cm 10-Barrel | - | 10(m) | FA | (12.7cm rocket) | 35 | 24/14days | 12000 | 4 | None |
| 12.7cm Single Barrel | - | 1(m) | SA | (12.7 cm rocket) | 3 | 11/10days | 1250 | 1.75 | None |
| Ares MP Maser | - | 20 | SA | 10M + Special | 25 | - | 750000 | - | None |
| Assault Cannon | - | 20(c) | SS | 18D | 20 | 16/14days | 6500 | 2 | None |
| Barrett-Arasaka Light 20mm | - | 10(c) | SS | 18D | 19 | 15/14days | 6000 | 2 | None |
| Colt-Mauser M2X Cannon | - | 8(c) | SS | 18D | 23 | 20/14days | 6100 | 2 | Magnification (2), Shock Pads |
| FN MAG-5 MMG | - | (belt)50(box) | FA | 9S | 9.5 | 18/14days | 3200 | 3 | Gas Vent (2), Laser Sight |
| Generic MMG | - | 40(c) | FA | 9S | 12 | 14/14days | 2500 | 2 | None |
| Generic HMG | - | 40(c) | FA | 10S | 15 | 18/18days | 4000 | 2 | None |
| IWS Assault 20 | - | 20(m) | SA | 18D | 16 | 16/14days | 7200 | 2 | Gas Vent (4), Shock Pads |
| M10A Light Recoilless Rifle | - | 1(b | SS | (Grenade) | 6.5 | 12/14days | 2000 | 2 | None |
| M400 | - | 2x belt | FA | 10S | 18.5 | 22/21days | 5500 | 2 | Gas Vent (3) |
| M400 Smart | - | 2x belt | FA | 10S | 19 | 24/21days | 7500 | 2.5 | Gas Vent (3), Smartlink II |
| Militech AM-3 | - | 5(c) | SS | 20D | 26 | 20/14days | 8000 | 3 | Gas Vent (2), Magnification (3), Shock Pads, Smartlink |
| NR-10 Multi-Barrel HMG | - | 35(c) or belt | FA | 10S | 41 | 28/30days | 75000 | 3 | None |
| Stoner-Ares M107 | - | (belt)50(box) | FA | 10S | 12.5 | 18/14days | 5200 | 3 | Gas Vent (3), Laser Sight |
| Panther Assault Cannon | - | 22(c) | SS | 18D | 18 | 16/14days | 6500 | 2 | Shock Pads |
| Panther Heavy Recoilless Rifle | - | 1(b) | SS | (Grenade) | 10 | 14/14days | 4000 | 3 | None |
| Rhinemetall EMG-85 Railgun | - | 5(m) | SS | 25D | 35 | - | 113700 | - | Gyro Mount (5), Smartlink II |
| Ruhrmetall SF20 | - | belt/80(c) | BF/FA | 10S | 14 | 17/28days | 7200 | 2 | Gas Vent (3), Shock Pads |
| Whitney-Morgan Caseless MMG | - | belt | FA | 9S | 35 | 26/30days | 25000 | 4 | Caseless |
| Ares Suppressor (Standard) | - | 12(c) | SA/BF | (Grenade) | 7 | 18/14days | 3400 | 3 | None |
| Ares Suppressor (Rangefinder) | - | 12(c) | SA/BF | (Grenade) | 7 | 18/14days | 4300 | 3 | Rangefinder |
| Ares Suprpessor (Smart) | - | 12(c) | SA/BF | (Grenade) | 7 | 18/14days | 6800 | 3 | Smartlink |
| Ares Suppressor (Smart | - | 12(c) | SA/BF | (Grenade) | 7 | 18/14days | 7700 | 3 | Rangefinder, Smartlink |
| ArmTech MGL-12 | 3 | 12(c) | SA | (Grenade) | 5 | 6/36hrs | 2200 | 3 | None |
| ArmTech Mini-6 | 6 | 6(c) | SA | (Grenade) | 2.5 | 6/36hrs | 1600 | 3 | None |
| Generic Under-Barrel | (-3) | 6(m) | SS | (Grenade) | (+2 kg) | 8/4days | 1700 | 3 | None |
| Grenade Launcher | (-2) | 1(m) | SS | (Grenade) | 1 | 6/4days | 1250 | 2.75 | None |
| Hand-Held Grenade Launcher | 2 | 5(c) | SS | (Grenade) | 2.5 | 9/5days | 2300 | 3 | None |
| Militech Mini-Grenade Launcher | 3(-2) | 4(m) | SA | (Grenade) | 3.5 | 10/6days | 2550 | 3 | None |
| Militech Mini-Grenade Launcher | 1(-4) | 16(c) | SA | (Grenade) | 5 | 24/12days | 4750 | 5 | None |
| Rockwell AGL-113 | - | 20(c)/belt | FA | (Grenade) | 50 | 24/21days | 15000 | 4 | None |
| Arbelast II MAW | - | 1 | SS | 15D | 2.75 | 8/48hrs | 1200 | 2 | None |
| Great Dragon ATGM | 4 | 1 | SS | 20D | 2.75 | 8/48hrs | 1200 | 2 | Magnification (2) |
| M79B LAW | 4/- | 1 | SS | 12D | 2.5 | 6/36hrs | 700 | 2 | None |
| Militech RPG-A | - | 1(m) | SS | (Missile) | 4.5 | 9/14days | 4500 | 2.5 | None |
| Multi-Launcher | - | 4(b) | SS | (Missile) | 8 | 12/14days | 8000 | 2 | None |
| Ruhrmetall GPRL-Alpha | - | 4(m) | SS | (Missile) | 9.5 | 13/28days | 9000 | 2 | None |
| Scorpion 16 Missile Launcher | - | 1(b) | SS | (Missile) | 5 | 10/14days | 6000 | 2 | None |
| M-12 Man-Portable Mortar | - | 1 | SS | (Round) | 30 | 12/14days | 3000 | 2 | None |
| Ballista Multi-Role Launcher | - | 4(m) | SS | (Round) | 6.5 | 18/30days | 10500 | 4 | Type I Laser Designator |
| Improved Silencer | Barrel | (-2) | +1 | .2 | 8/72hrs | 5000 | 2 |  |  |
| Smartscope (Magnification 2) | Top | (-2) | -1/2 | 1 | 5/60hrs | 3750 | 1.1 |  |  |
| Smartscope (Magnification 3) | Top | (-2) | -1/3 | 1 | 5/60hrs | 4250 | 1.1 |  |  |
| Micro Flare Launcher | 3 | 1(b) | SS | (Micro flare) | 2 | 5/48hrs | 50 | 1.5 | None |

### Rockets and Missiles
| Name | Intelligence | Damage | Weight | Availability | Cost | Street Index |
| --- | --- | --- | --- | --- | --- | --- |
| Anti-Personnel Rocket | NA | 16D | 2 | 8/14days | 1000 | 2 |
| Anti-Power-Plant Rocket | NA | 12M | 2 | 6/48hrs | 2500 | 1.3 |
| Anti-Vehicle Rocket | NA | 16D | 3 | 8/14days | 2000 | 2 |
| Armor-Piercing Rocket | NA | 16D | 3 | 12/6days | 3500 | 2.5 |
| Baffler Rocket | NA | 8M Stun | 2.5 | 6/3days | 3000 | 2 |
| Fireball Special Rocket | NA | 12D | 2.5 | 10/4days | 3500 | 2.3 |
| High-Explosive Rocket | NA | 16D | 2 | 8/14days | 1500 | 2 |
| Puff Dragon Rocket | NA | 8M Stun | 2 | 9/72hrs | 2200 | 2 |
| Smoking Jenny Rocket | NA | 8M Stun | 2 | 8/72hrs | 2000 | 1.8 |
| Anti-Personnel Missile | 3 | 16D | 2.25 | 12/14days | 2500 | 3 |
| Anti-Vehicle Missile | 4 | 16D | 3.25 | 12/14days | 5000 | 3 |
| Armor-Piercing Missile | 3 | 16D | 2.5 | 10/6days | 4500 | 3 |
| Fireball Special Missile | 3 | 12D | 2.5 | 12/7days | 4500 | 2.5 |
| High-Explosive Missile | 3 | 16D | 2.25 | 12/14days | 3750 | 3 |
| Puff Dragon Missile | 3 | 8M Stun | 2.5 | 10/72hrs | 3200 | 2 |
| Surface to Air Missile (SAM) | 4 | 13D | 1.5 | 18/21days | 2500 | 4 |
| Anti-Armor Micromissile | 2 | 12M | .25 | 16/14ays | 750 | 2 |
| HEP Micromissile | NA | 14M | .25 | 12/14days | 200 | 2 |
| Normal Micromissile | 2 | 12M | .25 | 14/14days | 500 | 2 |
| Ballista Round Mark I | NA | 14D | 2.75 | 12/21days | 1000 | 4 |
| Ballista Round Mark II | 5 | 14D | 2.75 | 18/28days | 2000 | 4 |
| Ballista Round Mark III | 6 | 14D | 2.75 | 14/28days | 2500 | 4 |

### Grenades
| Name | Concealability | Damage | Weight | Availability | Cost | Street Index |
| --- | --- | --- | --- | --- | --- | --- |
| Concussion Grenade | 6 | 6M Stun | .25 | 5/4days | 30 | 2 |
| Concussion Grenade | 7 | 10M Stun | .25 | 6/72hrs | 40 | 1.2 |
| Crawler Grenade | 6 | (see rules) | .25 | 20/14 days | 150 | 6 |
| CS Grenade | 5 | tear gas | .5 | 6/4 days | 75 | 2.5 |
| IPE Concussion Grenade (N) | 6 | 16M Stun | .5 | 8/1wk | 70 | 2 |
| IPE Defensive AP Grenade | 6 | 15D(f) | .5 | 8/1wk | 60 | 2 |
| IPE Defensive HE Grenade | 6 | 15S | .5 | 8/1wk | 60 | 2 |
| IPE Offensive AP Grenade | 6 | 15D(f) | .5 | 8/1wk | 60 | 2 |
| IPE Offensive HE Grenade | 6 | 15S | .5 | 8/1wk | 60 | 2 |
| Mace XII Gas Grenade (N) | 6 | gas | .25 | 8/6days | 50 | 2 |
| Militech PDU-3 (N) | 8 | 10S | .25 | 10/7days | 150 | 2.5 |
| Motion Restraints Grenade (N) | 6 | - | .5 | 6/48hrs | 60 | 2 |
| Neurostun IX Grenade (N) | 6 | gas | .25 | 6/6days | 50 | 2 |
| Niref D Gas Grenade (N) | 6 | gas | .25 | 10/6days | 80 | 2 |
| Offensive AP Grenade B | 6 | 10S(f) | .25 | 4/4days | 30 | 2 |
| Offensive HE Grenade B | 6 | 10S | .25 | 4/4days | 30 | 2 |
| Paint Grenade | 6 | - | .25 | 3/48hrs | 20 | 2 |
| Scatter Grenade | 6 | per charge | .25 | 3/48hrs | 70 | 1.5 |
| Smoke Grenade | 6 | - | .25 | 3/24hrs | 30 | 2 |
| Smoke (IR) Grenade | 6 | - | .25 | 4/48hrs | 40 | 2 |
| Spraypaint Grenade | 6 | - | .25 | 2/3days | 20 | .9 |
| Stench Bomb | 6 | - | .25 | 3/48hrs | 20 | .8 |
| Thermal Smoke | 6 | - | .25 | 5/4days | 40 | 2 |
| White Phosphorus Grenade | 6 | 14M/10L | .25 | 6/5days | 120 | 3 |

### Ammunition
| Name | Concealability | Damage | Weight | Availability | Cost | Street Index |
| --- | --- | --- | --- | --- | --- | --- |
| 4-Rnd Clip (APDS) | 8 | - | .85 | 14/14days | 33 | 4 |
| 5-Rnd Clip (APDS) | 8 | - | .875 | 14/14days | 40 | 4 |
| 6-Rnd Clip (APDS) | 8 | - | .9 | 14/14days | 47 | 4 |
| 7-Rnd Clip (APDS) | 8 | - | .925 | 14/14days | 54 | 4 |
| 8-Rnd Clip (APDS) | 8 | - | .95 | 14/14days | 61 | 4 |
| 10-Rnd Clip (APDS) | 8 | - | 1 | 14/14days | 75 | 4 |
| 11-Rnd Clip (APDS) | 8 | - | 1.025 | 14/14days | 82 | 4 |
| 12-Rnd Clip (APDS) | 8 | - | 1.05 | 14/14days | 89 | 4 |
| 14-Rnd Clip (APDS) | 8 | - | 1.1 | 14/14days | 103 | 4 |
| 15-Rnd Clip (APDS) | 8 | - | 1.125 | 14/14days | 110 | 4 |
| 16-Rnd Clip (APDS) | 8 | - | 1.15 | 14/14days | 117 | 4 |
| 18-Rnd Clip (APDS) | 8 | - | 1.2 | 14/14days | 131 | 4 |
| 20-Rnd Clip (APDS) | 8 | - | 1.25 | 14/14days | 145 | 4 |
| 24-Rnd Clip (APDS) | 8 | - | 1.35 | 14/14days | 173 | 4 |
| 25-Rnd Clip (APDS) | 8 | - | 1.375 | 14/14days | 180 | 4 |
| 28-Rnd Clip (APDS) | 8 | - | 1.45 | 14/14days | 201 | 4 |
| 30-Rnd Clip (APDS) | 8 | - | 1.5 | 14/14days | 215 | 4 |
| 32-Rnd Clip (APDS) | 8 | - | 1.55 | 14/14days | 229 | 4 |
| 35-Rnd Clip (APDS) | 8 | - | 1.625 | 14/14days | 250 | 4 |
| 38-Rnd Clip (APDS) | 8 | - | 1.7 | 14/14days | 271 | 4 |
| 40-Rnd Clip (APDS) | 8 | - | 1.75 | 14/14days | 285 | 4 |
| 42-Rnd Clip (APDS) | 8 | - | 1.8 | 14/14days | 299 | 4 |
| 50-Rnd Clip (APDS) | 8 | - | 2 | 14/14days | 355 | 4 |
| 60-Rnd Clip (APDS) | 8 | - | 2.25 | 14/14days | 425 | 4 |
| 4-Rnd Clip (AV) | 8 | - | 1.15 | 16/14days | 85 | 4 |
| 5-Rnd Clip (AV) | 8 | - | 1.25 | 16/14days | 105 | 4 |
| 6-Rnd Clip (AV) | 8 | - | 1.35 | 16/14days | 125 | 4 |
| 7-Rnd Clip (AV) | 8 | - | 1.45 | 16/14days | 145 | 4 |
| 8-Rnd Clip (AV) | 8 | - | 1.55 | 16/14days | 165 | 4 |
| 10-Rnd Clip (AV) | 8 | - | 1.75 | 16/14days | 205 | 4 |
| 11-Rnd Clip (AV) | 8 | - | 1.85 | 16/14days | 225 | 4 |
| 12-Rnd Clip (AV) | 8 | - | 1.95 | 16/14days | 245 | 4 |
| 14-Rnd Clip (AV) | 8 | - | 2.15 | 16/14days | 285 | 4 |
| 15-Rnd Clip (AV) | 8 | - | 2.25 | 16/14days | 305 | 4 |
| 16-Rnd Clip (AV) | 8 | - | 2.35 | 16/14days | 325 | 4 |
| 18-Rnd Clip (AV) | 8 | - | 2.55 | 16/14days | 365 | 4 |
| 20-Rnd Clip (AV) | 8 | - | 2.75 | 16/14days | 405 | 4 |
| 24-Rnd Clip (AV) | 8 | - | 3.15 | 16/14days | 485 | 4 |
| 25-Rnd Clip (AV) | 8 | - | 3.25 | 16/14days | 505 | 4 |
| 28-Rnd Clip (AV) | 8 | - | 3.55 | 16/14days | 565 | 4 |
| 30-Rnd Clip (AV) | 8 | - | 3.75 | 16/14days | 605 | 4 |
| 32-Rnd Clip (AV) | 8 | - | 3.95 | 16/14days | 625 | 4 |
| 35-Rnd Clip (AV) | 8 | - | 4.25 | 16/14days | 685 | 4 |
| 38-Rnd Clip (AV) | 8 | - | 4.55 | 16/14days | 745 | 4 |
| 40-Rnd Clip (AV) | 8 | - | 4.75 | 16/14days | 785 | 4 |
| 42-Rnd Clip (AV) | 8 | - | 4.95 | 16/14days | 825 | 4 |
| 50-Rnd Clip (AV) | 8 | - | 5.75 | 16/14days | 985 | 4 |
| 60-Rnd Clip (AV) | 8 | - | 6.75 | 16/14days | 1085 | 4 |
| 8-Rnd Clip (Big D | 8 | - | 1.55 | 16/14days | 165 | 5 |
| 10-Rnd Clip (Big D | 8 | - | 1.75 | 16/14days | 205 | 5 |
| 50-Rnd Clip (Big D | 8 | - | 5.75 | 16/14days | 1005 | 5 |
| 8-Rnd Clip (Bola) | 8 | - | 1.55 | 5/72hrs | 85 | 2 |
| 10-Rnd Clip (Bola) | 8 | - | 1.75 | 5/72hrs | 105 | 2 |
| 50-Rnd Clip (Bola) | 8 | - | 5.75 | 5/72hrs | 505 | 2 |
| 4-Rnd Clip (Capsule) | 8 | - | .85 | 4/48hrs | 9 | 2 |
| 5-Rnd Clip (Capsule) | 8 | - | .875 | 4/48hrs | 10 | 2 |
| 6-Rnd Clip (Capsule) | 8 | - | .9 | 4/48hrs | 11 | 2 |
| 7-Rnd Clip (Capsule) | 8 | - | .925 | 4/48hrs | 12 | 2 |
| 8-Rnd Clip (Capsule) | 8 | - | .95 | 4/48hrs | 13 | 2 |
| 10-Rnd Clip (Capsule) | 8 | - | 1 | 4/48hrs | 15 | 2 |
| 11-Rnd Clip (Capsule) | 8 | - | 1.025 | 4/48hrs | 16 | 2 |
| 12-Rnd Clip (Capsule) | 8 | - | 1.05 | 4/48hrs | 17 | 2 |
| 14-Rnd Clip (Capsule) | 8 | - | 1.1 | 4/48hrs | 19 | 2 |
| 15-Rnd Clip (Capsule) | 8 | - | 1.125 | 4/48hrs | 20 | 2 |
| 16-Rnd Clip (Capsule) | 8 | - | 1.15 | 4/48hrs | 21 | 2 |
| 18-Rnd Clip (Capsule) | 8 | - | 1.2 | 4/48hrs | 23 | 2 |
| 20-Rnd Clip (Capsule) | 8 | - | 1.25 | 4/48hrs | 25 | 2 |
| 24-Rnd Clip (Capsule) | 8 | - | 1.35 | 4/48hrs | 29 | 2 |
| 25-Rnd Clip (Capsule) | 8 | - | 1.375 | 4/48hrs | 30 | 2 |
| 28-Rnd Clip (Capsule) | 8 | - | 1.45 | 4/48hrs | 33 | 2 |
| 30-Rnd Clip (Capsule) | 8 | - | 1.5 | 4/48hrs | 35 | 2 |
| 32-Rnd Clip (Capsule) | 8 | - | 1.55 | 4/48hrs | 37 | 2 |
| 35-Rnd Clip (Capsule) | 8 | - | 1.625 | 4/48hrs | 40 | 2 |
| 38-Rnd Clip (Capsule) | 8 | - | 1.7 | 4/48hrs | 43 | 2 |
| 40-Rnd Clip (Capsule) | 8 | - | 1.75 | 4/48hrs | 45 | 2 |
| 42-Rnd Clip (Capsule) | 8 | - | 1.8 | 4/48hrs | 47 | 2 |
| 50-Rnd Clip (Capsule) | 8 | - | 2 | 4/48hrs | 55 | 2 |
| 60-Rnd Clip (Capsule) | 8 | - | 2.25 | 4/48hrs | 65 | 2 |
| 4-Rnd Clip (Explosive) | 8 | - | 1.05 | 3/36hrs | 25 | .8 |
| 5-Rnd Clip (Explosive) | 8 | - | 1.125 | 3/36hrs | 30 | .8 |
| 6-Rnd Clip (Explosive) | 8 | - | 1.2 | 3/36hrs | 35 | .8 |
| 7-Rnd Clip (Explosive) | 8 | - | 1.275 | 3/36hrs | 40 | .8 |
| 8-Rnd Clip (Explosive) | 8 | - | 1.35 | 3/36hrs | 45 | .8 |
| 10-Rnd Clip (Explosive) | 8 | - | 1.5 | 3/36hrs | 55 | .8 |
| 11-Rnd Clip (Explosive) | 8 | - | 1.575 | 3/36hrs | 60 | .8 |
| 12-Rnd Clip (Explosive) | 8 | - | 1.65 | 3/36hrs | 65 | .8 |
| 14-Rnd Clip (Explosive) | 8 | - | 1.8 | 3/36hrs | 75 | .8 |
| 15-Rnd Clip (Explosive) | 8 | - | 1.875 | 3/36hrs | 80 | .8 |
| 16-Rnd Clip (Explosive) | 8 | - | 1.95 | 3/36hrs | 85 | .8 |
| 18-Rnd Clip (Explosive) | 8 | - | 2.1 | 3/36hrs | 95 | .8 |
| 20-Rnd Clip (Explosive) | 8 | - | 2.25 | 3/36hrs | 105 | .8 |
| 24-Rnd Clip (Explosive) | 8 | - | 2.55 | 3/36hrs | 125 | .8 |
| 25-Rnd Clip (Explosive) | 8 | - | 2.625 | 3/36hrs | 130 | .8 |
| 28-Rnd Clip (Explosive) | 8 | - | 2.85 | 3/36hrs | 145 | .8 |
| 30-Rnd Clip (Explosive) | 8 | - | 3 | 3/36hrs | 155 | .8 |
| 32-Rnd Clip (Explosive) | 8 | - | 3.15 | 3/36hrs | 165 | .8 |
| 35-Rnd Clip (Explosive) | 8 | - | 3.375 | 3/36hrs | 180 | .8 |
| 38-Rnd Clip (Explosive) | 8 | - | 3.6 | 3/36hrs | 195 | .8 |
| 40-Rnd Clip (Explosive) | 8 | - | 3.75 | 3/36hrs | 205 | .8 |
| 42-Rnd Clip (Explosive) | 8 | - | 3.9 | 3/36hrs | 215 | .8 |
| 50-Rnd Clip (Explosive) | 8 | - | 4.5 | 3/36hrs | 255 | .8 |
| 60-Rnd Clip (Explosive) | 8 | - | 5.25 | 3/36hrs | 305 | .8 |
| 4-Rnd Clip (EX Explosive) | 8 | - | 1.05 | 6/72hrs | 45 | 1.5 |
| 5-Rnd Clip (EX Explosive) | 8 | - | 1.125 | 6/72hrs | 55 | 1.5 |
| 6-Rnd Clip (EX Explosive) | 8 | - | 1.2 | 6/72hrs | 65 | 1.5 |
| 7-Rnd Clip (EX Explosive) | 8 | - | 1.275 | 6/72hrs | 75 | 1.5 |
| 8-Rnd Clip (EX Explosive) | 8 | - | 1.35 | 6/72hrs | 85 | 1.5 |
| 10-Rnd Clip (EX Explosive) | 8 | - | 1.5 | 6/72hrs | 105 | 1.5 |
| 11-Rnd Clip (EX Explosive) | 8 | - | 1.575 | 6/72hrs | 115 | 1.5 |
| 12-Rnd Clip (EX Explosive) | 8 | - | 1.65 | 6/72hrs | 125 | 1.5 |
| 14-Rnd Clip (EX Explosive) | 8 | - | 1.8 | 6/72hrs | 145 | 1.5 |
| 15-Rnd Clip (EX Explosive) | 8 | - | 1.875 | 6/72hrs | 155 | 1.5 |
| 16-Rnd Clip (EX Explosive) | 8 | - | 1.95 | 6/72hrs | 165 | 1.5 |
| 18-Rnd Clip (EX Explosive) | 8 | - | 2.1 | 6/72hrs | 185 | 1.5 |
| 20-Rnd Clip (EX Explosive) | 8 | - | 2.25 | 6/72hrs | 205 | 1.5 |
| 24-Rnd Clip (EX Explosive) | 8 | - | 2.55 | 6/72hrs | 245 | 1.5 |
| 25-Rnd Clip (EX Explosive) | 8 | - | 2.625 | 6/72hrs | 255 | 1.5 |
| 28-Rnd Clip (EX Explosive) | 8 | - | 2.85 | 6/72hrs | 285 | 1.5 |
| 30-Rnd Clip (EX Explosive) | 8 | - | 3 | 6/72hrs | 305 | 1.5 |
| 32-Rnd Clip (EX Explosive) | 8 | - | 3.15 | 6/72hrs | 325 | 1.5 |
| 35-Rnd Clip (EX Explosive) | 8 | - | 3.375 | 6/72hrs | 355 | 1.5 |
| 38-Rnd Clip (EX Explosive) | 8 | - | 3.6 | 6/72hrs | 385 | 1.5 |
| 40-Rnd Clip (EX Explosive) | 8 | - | 3.75 | 6/72hrs | 405 | 1.5 |
| 42-Rnd Clip (EX Explosive) | 8 | - | 3.9 | 6/72hrs | 425 | 1.5 |
| 50-Rnd Clip (EX Explosive) | 8 | - | 4.5 | 6/72hrs | 505 | 1.5 |
| 60-Rnd Clip (EX Explosive) | 8 | - | 5.25 | 6/72hrs | 605 | 1.5 |
| 8-Rnd Clip (Flare) | 8 | - | 1.55 | 4/48hrs | 25 | 1 |
| 10-Rnd Clip (Flare) | 8 | - | 1.75 | 4/48hrs | 30 | 1 |
| 50-Rnd Clip (Flare) | 8 | - | 5.75 | 4/48hrs | 130 | 1 |
| 4-Rnd Clip (Flechette) | 8 | - | .95 | 3/36hrs | 45 | .8 |
| 5-Rnd Clip (Flechette) | 8 | - | 1 | 3/36hrs | 55 | .8 |
| 6-Rnd Clip (Flechette) | 8 | - | 1.05 | 3/36hrs | 65 | .8 |
| 7-Rnd Clip (Flechette) | 8 | - | 1.1 | 3/36hrs | 75 | .8 |
| 8-Rnd Clip (Flechette) | 8 | - | 1.15 | 3/36hrs | 85 | .8 |
| 10-Rnd Clip (Flechette) | 8 | - | 1.25 | 3/36hrs | 105 | .8 |
| 11-Rnd Clip (Flechette) | 8 | - | 1.3 | 3/36hrs | 115 | .8 |
| 12-Rnd Clip (Flechette) | 8 | - | 1.35 | 3/36hrs | 125 | .8 |
| 14-Rnd Clip (Flechette) | 8 | - | 1.45 | 3/36hrs | 145 | .8 |
| 15-Rnd Clip (Flechette) | 8 | - | 1.5 | 3/36hrs | 155 | .8 |
| 16-Rnd Clip (Flechette) | 8 | - | 1.55 | 3/36hrs | 165 | .8 |
| 18-Rnd Clip (Flechette) | 8 | - | 1.65 | 3/36hrs | 185 | .8 |
| 20-Rnd Clip (Flechette) | 8 | - | 1.75 | 3/36hrs | 205 | .8 |
| 24-Rnd Clip (Flechette) | 8 | - | 1.95 | 3/36hrs | 245 | .8 |
| 25-Rnd Clip (Flechette) | 8 | - | 2 | 3/36hrs | 255 | .8 |
| 28-Rnd Clip (Flechette) | 8 | - | 2.15 | 3/36hrs | 285 | .8 |
| 30-Rnd Clip (Flechette) | 8 | - | 2.25 | 3/36hrs | 305 | .8 |
| 32-Rnd Clip (Flechette) | 8 | - | 2.35 | 3/36hrs | 325 | .8 |
| 35-Rnd Clip (Flechette) | 8 | - | 2.5 | 3/36hrs | 355 | .8 |
| 38-Rnd Clip (Flechette) | 8 | - | 2.65 | 3/36hrs | 385 | .8 |
| 40-Rnd Clip (Flechette) | 8 | - | 2.75 | 3/36hrs | 405 | .8 |
| 42-Rnd Clip (Flechette) | 8 | - | 2.85 | 3/36hrs | 425 | .8 |
| 50-Rnd Clip (Flechette) | 8 | - | 3.25 | 3/36hrs | 505 | .8 |
| 60-Rnd Clip (Flechette) | 8 | - | 3.75 | 3/36hrs | 605 | .8 |
| 4-Rnd Clip (Gel) | 8 | - | .85 | 4/48hrs | 17 | 1 |
| 5-Rnd Clip (Gel) | 8 | - | .875 | 4/48hrs | 20 | 1 |
| 6-Rnd Clip (Gel) | 8 | - | .9 | 4/48hrs | 23 | 1 |
| 7-Rnd Clip (Gel) | 8 | - | .925 | 4/48hrs | 26 | 1 |
| 8-Rnd Clip (Gel) | 8 | - | .95 | 4/48hrs | 29 | 1 |
| 10-Rnd Clip (Gel) | 8 | - | 1 | 4/48hrs | 35 | 1 |
| 11-Rnd Clip (Gel) | 8 | - | 1.025 | 4/48hrs | 38 | 1 |
| 12-Rnd Clip (Gel) | 8 | - | 1.05 | 4/48hrs | 41 | 1 |
| 14-Rnd Clip (Gel) | 8 | - | 1.1 | 4/48hrs | 47 | 1 |
| 15-Rnd Clip (Gel) | 8 | - | 1.125 | 4/48hrs | 50 | 1 |
| 16-Rnd Clip (Gel) | 8 | - | 1.15 | 4/48hrs | 53 | 1 |
| 18-Rnd Clip (Gel) | 8 | - | 1.2 | 4/48hrs | 59 | 1 |
| 20-Rnd Clip (Gel) | 8 | - | 1.25 | 4/48hrs | 65 | 1 |
| 24-Rnd Clip (Gel) | 8 | - | 1.35 | 4/48hrs | 77 | 1 |
| 25-Rnd Clip (Gel) | 8 | - | 1.375 | 4/48hrs | 80 | 1 |
| 28-Rnd Clip (Gel) | 8 | - | 1.45 | 4/48hrs | 89 | 1 |
| 30-Rnd Clip (Gel) | 8 | - | 1.5 | 4/48hrs | 95 | 1 |
| 32-Rnd Clip (Gel) | 8 | - | 1.55 | 4/48hrs | 101 | 1 |
| 35-Rnd Clip (Gel) | 8 | - | 1.625 | 4/48hrs | 110 | 1 |
| 38-Rnd Clip (Gel) | 8 | - | 1.7 | 4/48hrs | 119 | 1 |
| 40-Rnd Clip (Gel) | 8 | - | 1.75 | 4/48hrs | 125 | 1 |
| 42-Rnd Clip (Gel) | 8 | - | 1.8 | 4/48hrs | 131 | 1 |
| 50-Rnd Clip (Gel) | 8 | - | 2 | 4/48hrs | 155 | 1 |
| 60-Rnd Clip (Gel) | 8 | - | 2.25 | 4/48hrs | 185 | 1 |
| 4-Rnd Clip (Glazer) | 8 | - | .95 | 10/1wk | 35 | 3 |
| 5-Rnd Clip (Glazer) | 8 | - | 1 | 10/1wk | 42.5 | 3 |
| 6-Rnd Clip (Glazer) | 8 | - | 1.05 | 10/1wk | 50 | 3 |
| 7-Rnd Clip (Glazer) | 8 | - | 1.1 | 10/1wk | 57.5 | 3 |
| 8-Rnd Clip (Glazer) | 8 | - | 1.15 | 10/1wk | 65 | 3 |
| 10-Rnd Clip (Glazer) | 8 | - | 1.25 | 10/1wk | 80 | 3 |
| 11-Rnd Clip (Glazer) | 8 | - | 1.3 | 10/1wk | 87.5 | 3 |
| 12-Rnd Clip (Glazer) | 8 | - | 1.35 | 10/1wk | 95 | 3 |
| 14-Rnd Clip (Glazer) | 8 | - | 1.45 | 10/1wk | 110 | 3 |
| 15-Rnd Clip (Glazer) | 8 | - | 1.5 | 10/1wk | 117.5 | 3 |
| 16-Rnd Clip (Glazer) | 8 | - | 1.55 | 10/1wk | 125 | 3 |
| 18-Rnd Clip (Glazer) | 8 | - | 1.65 | 10/1wk | 140 | 3 |
| 20-Rnd Clip (Glazer) | 8 | - | 1.75 | 10/1wk | 155 | 3 |
| 24-Rnd Clip (Glazer) | 8 | - | 1.95 | 10/1wk | 185 | 3 |
| 25-Rnd Clip (Glazer) | 8 | - | 2 | 10/1wk | 192.5 | 3 |
| 28-Rnd Clip (Glazer) | 8 | - | 2.15 | 10/1wk | 215 | 3 |
| 30-Rnd Clip (Glazer) | 8 | - | 2.25 | 10/1wk | 230 | 3 |
| 32-Rnd Clip (Glazer) | 8 | - | 2.35 | 10/1wk | 245 | 3 |
| 35-Rnd Clip (Glazer) | 8 | - | 2.5 | 10/1wk | 267.5 | 3 |
| 38-Rnd Clip (Glazer) | 8 | - | 2.65 | 10/1wk | 290 | 3 |
| 40-Rnd Clip (Glazer) | 8 | - | 2.75 | 10/1wk | 305 | 3 |
| 42-Rnd Clip (Glazer) | 8 | - | 2.85 | 10/1wk | 320 | 3 |
| 50-Rnd Clip (Glazer) | 8 | - | 3.25 | 10/1wk | 380 | 3 |
| 60-Rnd Clip (Glazer) | 8 | - | 3.75 | 10/1wk | 455 | 3 |
| 4-Rnd Clip (Hi-C) | 8 | - | .85 | 6/1wk | 65 | 3 |
| 5-Rnd Clip (Hi-C) | 8 | - | .875 | 6/1wk | 80 | 3 |
| 6-Rnd Clip (Hi-C) | 8 | - | .9 | 6/1wk | 95 | 3 |
| 7-Rnd Clip (Hi-C) | 8 | - | .925 | 6/1wk | 110 | 3 |
| 8-Rnd Clip (Hi-C) | 8 | - | .95 | 6/1wk | 125 | 3 |
| 10-Rnd Clip (Hi-C) | 8 | - | 1 | 6/1wk | 155 | 3 |
| 11-Rnd Clip (Hi-C) | 8 | - | 1.025 | 6/1wk | 170 | 3 |
| 12-Rnd Clip (Hi-C) | 8 | - | 1.05 | 6/1wk | 185 | 3 |
| 14-Rnd Clip (Hi-C) | 8 | - | 1.1 | 6/1wk | 215 | 3 |
| 15-Rnd Clip (Hi-C) | 8 | - | 1.125 | 6/1wk | 230 | 3 |
| 16-Rnd Clip (Hi-C) | 8 | - | 1.15 | 6/1wk | 245 | 3 |
| 18-Rnd Clip (Hi-C) | 8 | - | 1.2 | 6/1wk | 275 | 3 |
| 20-Rnd Clip (Hi-C) | 8 | - | 1.25 | 6/1wk | 305 | 3 |
| 24-Rnd Clip (Hi-C) | 8 | - | 1.35 | 6/1wk | 365 | 3 |
| 25-Rnd Clip (Hi-C) | 8 | - | 1.375 | 6/1wk | 380 | 3 |
| 28-Rnd Clip (Hi-C) | 8 | - | 1.45 | 6/1wk | 425 | 3 |
| 30-Rnd Clip (Hi-C) | 8 | - | 1.5 | 6/1wk | 455 | 3 |
| 32-Rnd Clip (Hi-C) | 8 | - | 1.55 | 6/1wk | 485 | 3 |
| 35-Rnd Clip (Hi-C) | 8 | - | 1.625 | 6/1wk | 530 | 3 |
| 38-Rnd Clip (Hi-C) | 8 | - | 1.7 | 6/1wk | 575 | 3 |
| 40-Rnd Clip (Hi-C) | 8 | - | 1.75 | 6/1wk | 605 | 3 |
| 42-Rnd Clip (Hi-C) | 8 | - | 1.8 | 6/1wk | 635 | 3 |
| 50-Rnd Clip (Hi-C) | 8 | - | 2 | 6/1wk | 755 | 3 |
| 60-Rnd Clip (Hi-C) | 8 | - | 2.25 | 6/1wk | 905 | 3 |
| 4-Rnd Clip (Hollow Point) | 8 | - | .95 | 5/48hrs | 25 | 2 |
| 5-Rnd Clip (Hollow Point) | 8 | - | 1 | 5/48hrs | 30 | 2 |
| 6-Rnd Clip (Hollow Point) | 8 | - | 1.05 | 5/48hrs | 35 | 2 |
| 7-Rnd Clip (Hollow Point) | 8 | - | 1.1 | 5/48hrs | 40 | 2 |
| 8-Rnd Clip (Hollow Point) | 8 | - | 1.15 | 5/48hrs | 45 | 2 |
| 10-Rnd Clip (Hollow Point) | 8 | - | 1.25 | 5/48hrs | 55 | 2 |
| 11-Rnd Clip (Hollow Point) | 8 | - | 1.3 | 5/48hrs | 60 | 2 |
| 12-Rnd Clip (Hollow Point) | 8 | - | 1.35 | 5/48hrs | 65 | 2 |
| 14-Rnd Clip (Hollow Point) | 8 | - | 1.45 | 5/48hrs | 75 | 2 |
| 15-Rnd Clip (Hollow Point) | 8 | - | 1.5 | 5/48hrs | 80 | 2 |
| 16-Rnd Clip (Hollow Point) | 8 | - | 1.55 | 5/48hrs | 85 | 2 |
| 18-Rnd Clip (Hollow Point) | 8 | - | 1.65 | 5/48hrs | 95 | 2 |
| 20-Rnd Clip (Hollow Point) | 8 | - | 1.75 | 5/48hrs | 105 | 2 |
| 24-Rnd Clip (Hollow Point) | 8 | - | 1.95 | 5/48hrs | 125 | 2 |
| 25-Rnd Clip (Hollow Point) | 8 | - | 2 | 5/48hrs | 130 | 2 |
| 28-Rnd Clip (Hollow Point) | 8 | - | 2.15 | 5/48hrs | 145 | 2 |
| 30-Rnd Clip (Hollow Point) | 8 | - | 2.25 | 5/48hrs | 155 | 2 |
| 32-Rnd Clip (Hollow Point) | 8 | - | 2.35 | 5/48hrs | 165 | 2 |
| 35-Rnd Clip (Hollow Point) | 8 | - | 2.5 | 5/48hrs | 180 | 2 |
| 38-Rnd Clip (Hollow Point) | 8 | - | 2.65 | 5/48hrs | 195 | 2 |
| 40-Rnd Clip (Hollow Point) | 8 | - | 2.75 | 5/48hrs | 205 | 2 |
| 42-Rnd Clip (Hollow Point) | 8 | - | 2.85 | 5/48hrs | 215 | 2 |
| 50-Rnd Clip (Hollow Point) | 8 | - | 3.25 | 5/48hrs | 255 | 2 |
| 60-Rnd Clip (Hollow Point) | 8 | - | 3.75 | 5/48hrs | 305 | 2 |
| 4-Rnd Clip (Incendiary) | 8 | - | 1.05 | 10/1wk | 65 | 2 |
| 5-Rnd Clip (Incendiary) | 8 | - | 1.125 | 10/1wk | 80 | 2 |
| 6-Rnd Clip (Incendiary) | 8 | - | 1.2 | 10/1wk | 95 | 2 |
| 7-Rnd Clip (Incendiary) | 8 | - | 1.275 | 10/1wk | 110 | 2 |
| 8-Rnd Clip (Incendiary) | 8 | - | 1.35 | 10/1wk | 125 | 2 |
| 10-Rnd Clip (Incendiary) | 8 | - | 1.5 | 10/1wk | 155 | 2 |
| 11-Rnd Clip (Incendiary) | 8 | - | 1.575 | 10/1wk | 170 | 2 |
| 12-Rnd Clip (Incendiary) | 8 | - | 1.65 | 10/1wk | 185 | 2 |
| 14-Rnd Clip (Incendiary) | 8 | - | 1.8 | 10/1wk | 215 | 2 |
| 15-Rnd Clip (Incendiary) | 8 | - | 1.875 | 10/1wk | 230 | 2 |
| 16-Rnd Clip (Incendiary) | 8 | - | 1.95 | 10/1wk | 245 | 2 |
| 18-Rnd Clip (Incendiary) | 8 | - | 2.1 | 10/1wk | 275 | 2 |
| 20-Rnd Clip (Incendiary) | 8 | - | 2.25 | 10/1wk | 305 | 2 |
| 24-Rnd Clip (Incendiary) | 8 | - | 2.55 | 10/1wk | 365 | 2 |
| 25-Rnd Clip (Incendiary) | 8 | - | 2.625 | 10/1wk | 380 | 2 |
| 28-Rnd Clip (Incendiary) | 8 | - | 2.85 | 10/1wk | 425 | 2 |
| 30-Rnd Clip (Incendiary) | 8 | - | 3 | 10/1wk | 455 | 2 |
| 32-Rnd Clip (Incendiary) | 8 | - | 3.15 | 10/1wk | 485 | 2 |
| 35-Rnd Clip (Incendiary) | 8 | - | 3.375 | 10/1wk | 530 | 2 |
| 38-Rnd Clip (Incendiary) | 8 | - | 3.6 | 10/1wk | 575 | 2 |
| 40-Rnd Clip (Incendiary) | 8 | - | 3.75 | 10/1wk | 605 | 2 |
| 42-Rnd Clip (Incendiary) | 8 | - | 3.9 | 10/1wk | 635 | 2 |
| 50-Rnd Clip (Incendiary) | 8 | - | 4.5 | 10/1wk | 755 | 2 |
| 60-Rnd Clip (Incendiary) | 8 | - | 5.25 | 10/1wk | 905 | 2 |
| 4-Rnd Clip (Mercury) | 8 | - | 1.05 | 6/48hrs | 25 | 2 |
| 5-Rnd Clip (Mercury) | 8 | - | 1.125 | 6/48hrs | 30 | 2 |
| 6-Rnd Clip (Mercury) | 8 | - | 1.2 | 6/48hrs | 35 | 2 |
| 7-Rnd Clip (Mercury) | 8 | - | 1.275 | 6/48hrs | 40 | 2 |
| 8-Rnd Clip (Mercury) | 8 | - | 1.35 | 6/48hrs | 45 | 2 |
| 10-Rnd Clip (Mercury) | 8 | - | 1.5 | 6/48hrs | 55 | 2 |
| 11-Rnd Clip (Mercury) | 8 | - | 1.575 | 6/48hrs | 60 | 2 |
| 12-Rnd Clip (Mercury) | 8 | - | 1.65 | 6/48hrs | 65 | 2 |
| 14-Rnd Clip (Mercury) | 8 | - | 1.8 | 6/48hrs | 75 | 2 |
| 15-Rnd Clip (Mercury) | 8 | - | 1.875 | 6/48hrs | 80 | 2 |
| 16-Rnd Clip (Mercury) | 8 | - | 1.95 | 6/48hrs | 85 | 2 |
| 18-Rnd Clip (Mercury) | 8 | - | 2.1 | 6/48hrs | 95 | 2 |
| 20-Rnd Clip (Mercury) | 8 | - | 2.25 | 6/48hrs | 105 | 2 |
| 24-Rnd Clip (Mercury) | 8 | - | 2.55 | 6/48hrs | 125 | 2 |
| 25-Rnd Clip (Mercury) | 8 | - | 2.625 | 6/48hrs | 130 | 2 |
| 28-Rnd Clip (Mercury) | 8 | - | 2.85 | 6/48hrs | 145 | 2 |
| 30-Rnd Clip (Mercury) | 8 | - | 3 | 6/48hrs | 155 | 2 |
| 32-Rnd Clip (Mercury) | 8 | - | 3.15 | 6/48hrs | 165 | 2 |
| 35-Rnd Clip (Mercury) | 8 | - | 3.375 | 6/48hrs | 180 | 2 |
| 38-Rnd Clip (Mercury) | 8 | - | 3.6 | 6/48hrs | 195 | 2 |
| 40-Rnd Clip (Mercury) | 8 | - | 3.75 | 6/48hrs | 205 | 2 |
| 42-Rnd Clip (Mercury) | 8 | - | 3.9 | 6/48hrs | 215 | 2 |
| 50-Rnd Clip (Mercury) | 8 | - | 4.5 | 6/48hrs | 255 | 2 |
| 60-Rnd Clip (Mercury) | 8 | - | 5.25 | 6/48hrs | 305 | 2 |
| 4-Rnd Clip (Regular) | 8 | - | .95 | 2/24hrs | 13 | .75 |
| 5-Rnd Clip (Regular) | 8 | - | 1 | 2/24hrs | 15 | .75 |
| 6-Rnd Clip (Regular) | 8 | - | 1.05 | 2/24hrs | 17 | .75 |
| 7-Rnd Clip (Regular) | 8 | - | 1.1 | 2/24hrs | 19 | .75 |
| 8-Rnd Clip (Regular) | 8 | - | 1.15 | 2/24hrs | 21 | .75 |
| 10-Rnd Clip (Regular) | 8 | - | 1.25 | 2/24hrs | 25 | .75 |
| 11-Rnd Clip (Regular) | 8 | - | 1.3 | 2/24hrs | 27 | .75 |
| 12-Rnd Clip (Regular) | 8 | - | 1.35 | 2/24hrs | 29 | .75 |
| 14-Rnd Clip (Regular) | 8 | - | 1.45 | 2/24hrs | 33 | .75 |
| 15-Rnd Clip (Regular) | 8 | - | 1.5 | 2/24hrs | 35 | .75 |
| 16-Rnd Clip (Regular) | 8 | - | 1.55 | 2/24hrs | 37 | .75 |
| 18-Rnd Clip (Regular) | 8 | - | 1.65 | 2/24hrs | 41 | .75 |
| 20-Rnd Clip (Regular) | 8 | - | 1.75 | 2/24hrs | 45 | .75 |
| 24-Rnd Clip (Regular) | 8 | - | 1.95 | 2/24hrs | 53 | .75 |
| 25-Rnd Clip (Regular) | 8 | - | 2 | 2/24hrs | 55 | .75 |
| 28-Rnd Clip (Regular) | 8 | - | 2.15 | 2/24hrs | 61 | .75 |
| 30-Rnd Clip (Regular) | 8 | - | 2.25 | 2/24hrs | 65 | .75 |
| 32-Rnd Clip (Regular) | 8 | - | 2.35 | 2/24hrs | 69 | .75 |
| 35-Rnd Clip (Regular) | 8 | - | 2.5 | 2/24hrs | 75 | .75 |
| 38-Rnd Clip (Regular) | 8 | - | 2.65 | 2/24hrs | 81 | .75 |
| 40-Rnd Clip (Regular) | 8 | - | 2.75 | 2/24hrs | 85 | .75 |
| 42-Rnd Clip (Regular) | 8 | - | 2.85 | 2/24hrs | 89 | .75 |
| 50-Rnd Clip (Regular) | 8 | - | 3.25 | 2/24hrs | 105 | .75 |
| 60-Rnd Clip (Regular) | 8 | - | 3.75 | 2/24hrs | 125 | .75 |
| 8-Rnd Clip (Shock Lock) | 8 | 1/2 Door Barrier | 1.35 | 5/48hrs | 61 | 2 |
| 10-Rnd Clip (Shock Lock) | 8 | 1/2 Door Barrier | 1.5 | 5/48hrs | 75 | 2 |
| 50-Rnd Clip (Shock Lock) | 8 | 1/2 Door Barrier | 4.5 | 5/48hrs | 355 | 2 |
| 8-Rnd Clip (Stun Shells) | 8 | - | 1.15 | 3/12hrs | 25 | 1 |
| 10-Rnd Clip (Stun Shells) | 8 | - | 1.25 | 3/12hrs | 30 | 1 |
| 50-Rnd Clip (Stun Shells) | 8 | - | 3.25 | 3/12hrs | 130 | 1 |
| Spare Clip | - | - | - | .75 | 5 | .75 |
| Spare Clip (Nostal. Ind. PN5) | - | - | - | .75 | 50 | 1 |
| Regular Rnds | 8 | - | .05 | 2/24hrs | 2 | .75 |
| Triplex Rnds(HPonly) 5 | 9 | (see rules) | .05 | 4/60hrs | 5 | 1.25 |
| 30mm-Explosiv Rnds | 8 | +1 Power | .1 | 6/36hrs | 10 | 1.5 |
| 30mm-massiv Rnds | 8 | - | .1 | 4/24hrs | 4 | 1 |
| 30mm-Schrot Rnds | 8 | (see rules) | .1 | 4/24hrs | 4 | 1 |
| Acid Rnds | 8 | as weapon | .05 | 14/8days | 10 | 4 |
| Anti-Personnel Rnds | 8 | +2 Power, +1 Damage | .075 | 12/10days | 10 | 3.5 |
| Anti-Vehicular Rnds | 8 | (see rules) | .025 | 16/14days | 30 | 4 |
| APDS Rnds | 8 | 1/2 Ballistic | .025 | 14/14days | 7 | 4 |
| APDS Flechette Rnds | 8 | +1 Damage, 1/2 Ballistic | .025 | 14/14days | 10 | 4 |
| Armor Piercing Rnds | 8 | -2 Ballistic | .05 | 2/24hrs | 2 | .75 |
| APiercing Flechette Rnds | 8 | (see rules) | .05 | 6/3days | 15 | 3.5 |
| APiercing Incendiary Rnds | 8 | 1/2 Ballistic | .025 | 16/14days | 8 | 4.5 |
| AV Rnds | 8 | (See Rules) | .1 | 16/2wks | 20 | 4 |
| Barret Model 121 Rnds | 6 | 1/2 Ballistic & Barrier Ratings | .075 | 14/30days | 20 | 5 |
| Blowgun Needles (20) | 8 | (See Rules) | .25 | 2/24hrs | 5 | 1 |
| Crawler Rnds | 8 | (see rules) | .05 | 14/14days | 10 | 6 |
| Capsule Rnds | 8 | (See Rules) | .025 | 4/48hrs | 1 | 2 |
| Dartgun Cyberfinger Darts | 10 | 3L | .01 | 6/48hrs | 2 | .05 |
| Depleted Uranium Core Rnds | 8 | +2 Power | .075 | 8/12days | 75 | 2 |
| Dragon | 8 | (see rules) | .075 | 12/7days | 9 | 3 |
| Dual-Purpose Rnds | 8 | 1/2 Ballistic + special | .05 | 16/14days | 8 | 4 |
| Duplex Rnds | 8 | (two bullets) | .075 | 5/36hrs | 9 | 1 |
| Explosive Rnds | 8 | (see rules) | .075 | 3/36hrs | 5 | .8 |
| EX Explosive Rnds | 8 | (see rules) | .075 | 6/72hrs | 10 | 1.5 |
| Firepower Rnds (10) (HP only) | 8 | +1 Power | .5 | 3/36hrs | 35 | .75 |
| Flare Rnds(Shotgun only) | 8 | 6M | .05 | 4/24hrs | 5 | 1 |
| Flash Rnds(Shotgun only) | 8 | none | .05 | 4/24hrs | 6 | 1 |
| Flechette Rnds | 8 | (see rules) | .05 | 3/36hrs | 10 | .8 |
| Frag. Flechette Rnds | 8 | +1 Power | .05 | 12/10days | 10 | 4.5 |
| Gas Rnds(Shotgun only) | 8 | gas | .05 | 6/48hrs | 5 | 1.1 |
| Gauss Gun ammo(Gauss Gun only) | 6 | normal | 1.5 | - | 300 | - |
| Gel Rnds | 8 | (see rules) | .025 | 4/48hrs | 3 | 1 |
| Glazer Rnds (1) | 8 | (See Rules) | .05 | 10/1wk | 7.5 | 3 |
| Glazer Rnds (10) | 8 | (See Rules) | .5 | 10/1wk | 75 | 3 |
| Hi-C Plastic Rnds | 9 | (See Rules) | .025 | 6/1wk | 15 | 3 |
| High Explosive AP Rnds | 8 | (see rules) | .1 | 18/21days | 20 | 5 |
| HEP Rnds | 8 | (see rules) | .075 | 5/36hrs | 6 | 1.1 |
| HESH Rnds | 8 | (Special) | .075 | 18/14days | 20 | 3 |
| Hollow Point Rnds | 8 | (See Rules) | .05 | 5/48hrs | 5 | 2 |
| Incendiary Rnds | 8 | (See Rules) | .075 | 10/1wk | 15 | 2 |
| Light APiercing | 8 | (see rules) | .075 | 16/14days | 10 | 2.5 |
| Mal. Arms Sliver Gun ammo (7) | 8 | 6S(f) | .5 | 6/72hrs | 7 | 3 |
| Mal. Arms Sliver Gun batteries | 8 | - | .5 | 6/72hrs | 7 | 3 |
| Mercury Rnds | 8 | (See Rules) | .075 | 6/48hrs | 5 | 1.5 |
| Multi-Flechette Rnds | 8 | (see rules) | .05 | 5/48hrs | 10 | 1 |
| Ramjet Rnds (RamjetRonly) | 8 | - | .05 | 8/72hrs | 10 | 2 |
| Rostovic Wrist Racate (6 rnds) | 5 | 10S stun | 1.25 | 14/20 days | 200 | 3.5 |
| Rubber Rnds | 8 | Stun | .05 | 3/12hrs | 1 | .75 |
| Silver Rnds | 8 | (see rules) | .05 | 6/6days | 5 | 2 |
| Smoke Rnds(Shotgun only) | 8 | none | .05 | 3/12hrs | 4 | .8 |
| Stinger Rnds(Shotgun only) | 8 | Stun | .05 | 4/18hrs | 3 | 1 |
| Stun Rnds | 8 | (see rules) | .1 | 4/48hrs | 10 | 1 |
| Tracer Rnds (10) | 8 | (see rules) | .5 | 3/24hrs | 75 | 1 |
| Tungesten Rnds | 8 | +1 Power | .06 | 6/6days | 5 | 1.5 |
| Wirtz-Bet | 6 | 12M Stun | .15 | 8/36hrs | 10 | 2 |
| Wirtz-Schrot Rnds | 8 | 11S(f) | .125 | 8/36hrs | 8 | 2 |
| Duplex Rnds (50) | 6 | +2 power, as-rifle only | 1.2 | 6/72hrs | 35 | 2 |
| DE8025.01 ap (for P-61) (50) | 6 | .75 armor rating | 3.25 | 6/48hrs | 200 | 3 |
| DE8025.04 fr (for P-61) (50) | 6 | frangible | 3.25 | 6/48hrs | 250 | 3 |
| Tracker Rnds (AOD) | 8 | (See Rules) | .1 | Rating/1wk | 200 x Rating | 1 |
| Tracker AOD Rating [1] | 8 | (See Rules) | .1 | 1/1wk | 200 | 1 |
| Tracker AOD Rating [2] | 8 | (See Rules) | .1 | 2/1wk | 400 | 1 |
| Tracker AOD Rating [3] | 8 | (See Rules) | .1 | 3/1wk | 600 | 1 |
| Tracker AOD Rating [4] | 8 | (See Rules) | .1 | 4/1wk | 800 | 1 |
| Tracker AOD Rating [5] | 8 | (See Rules) | .1 | 5/1wk | 1000 | 1 |
| Tracker AOD Rating [6] | 8 | (See Rules) | .1 | 6/1wk | 1200 | 1 |
| Tracker Rnds (Standard) | 8 | (See Rules) | .1 | Rating/1wk | 300 x Rating | 1 |
| Tracker Standard Rating [1] | 8 | (See Rules) | .1 | 1/1wk | 300 | 1 |
| Tracker Standard Rating [2] | 8 | (See Rules) | .2 | 1/1wk | 600 | 1 |
| Tracker Standard Rating [3] | 8 | (See Rules) | .3 | 1/1wk | 900 | 1 |
| Tracker Standard Rating [4] | 8 | (See Rules) | .4 | 1/1wk | 1200 | 1 |
| Tracker Standard Rating [5] | 8 | (See Rules) | .5 | 1/1wk | 1500 | 1 |
| Tracker Standard Rating [6] | 8 | (See Rules) | .6 | 1/1wk | 1800 | 1 |
| APDU Heavy Pistol (50) | 8 | B -30%/-10% | 1 | GM | 125 | GM |
| APDU Submachine Gun (100) | 4 | B -35%/-15% | 2 | GM | 250 | GM |
| APDU LMG | 4 | B -55%/-20% | 1.2 | GM | 250 | GM |
| APDU MMG | 4 | B -55%/-20% | 2.8 | GM | 400 | GM |
| APDU Sport | 8 | B -55%/-20% | 1.4 | GM | 200 | GM |
| APDS-DU Sport | 8 | B -65%/-20% | 1.3 | GM | 225 | GM |
| APDS-DU MMG | 8 | B -65%/-20% | 2.6 | GM | 450 | GM |
| APDS-DU HMG | 8 | B -100%/-35% | 11.5 | GM | 1125 | GM |
| APDS-DU AMR | 8 | B -100%/-50% | 21 | GM | 4500 | GM |
| Frangible pistol | 8 | (see rules) | 2 | 5/36hrs | 150 | 3 |
| Frangible sport rifle (20) | 6 | (see rules) | 1.5 | 5/36hrs | 100 | 3 |
| Frangible sniper rifle (20) | 6 | (see rules) | 1.5 | 5/36hrs | 120 | 3 |
| H Lead Hollowpoint (HP) (50) | 8 | P+1 or B+25% | 2 | per regular | 10 | 1 |
| H semi-j Hollowpoint(SJHP)(50) | 8 | P+1 or B+25% | 2 | per regular | 12 | 1 |
| H jacket Hollowpoint(JHP) (50) | 8 | P+1 or B+25% | 2 | per regular | 15 | 1 |
| H soft point (SP) (50) | 8 | P+1 or B+25% | 2 | per regular | 12 | 1 |
| H Expand Full-M Jack(EFMJ)(50) | 8 | P+1 if B=4 or less | 2 | per regular | 20 | 1 |
| R Lead Hollowpoint (HP) (20) | 6 | P+1 or B+25% | 1 | per regular | 10 | 1 |
| R semi-j Hollowpoint(SJHP)(20) | 6 | P+1 or B+25% | 1 | per regular | 12 | 1 |
| R jacket Hollowpoint(JHP) (20) | 6 | P+1 or B+25% | 1 | per regular | 15 | 1 |
| R soft point (SP) (20) | 6 | P+1 or B+25% | 1 | per regular | 12 | 1 |
| Match Pistol (20) | 8 | range +35% | 1 | 3/36hrs | 20 | 2 |
| Match Sport Rifle (20) | 6 | range +35% | 1.2 | 3/36hrs | 30 | 2 |
| Match Sniper Rifle (20) | 6 | range +35% | 1.4 | 3/36hrs | 40 | 2 |
| HPBT Match Pistol (20) | 8 | range +30%, P+1vs unarmored | 1 | 3/36hrs | 20 | 2 |
| HPBT Match Sport Rifle (20) | 6 | range +30%, P+1vs unarmored | 1.2 | 3/36hrs | 30 | 2 |
| HPBT Match Sniper Rifle (20) | 6 | range +30%, P+1vs unarmored | 1.4 | 3/36hrs | 40 | 2 |
| Poly-Tip Match Pistol (20) | 8 | range +30%, P+1vs unarmored | 1 | 3/36hrs | 20 | 2 |
| Poly-Tip Match Sport-R (20) | 6 | range +30%, P+1vs unarmored | 1.2 | 3/36hrs | 30 | 2 |
| Poly-Tip Match Snip-R (20) | 6 | range +30%, P+1vs unarmored | 1.4 | 3/36hrs | 40 | 2 |
| Reverse Ogive Pistol | 8 | P+1, less range | 1 | 4/48hrs | 20 | 2 |
| Reverse Ogive 12-g Slug (20) | 5 | P+1, less range | 4 | 4/48hrs | 35 | 2 |
| AP Reverse-O Pistol | 8 | P+1, B-25%, less range | 1 | 8/72hrs | 25 | 4 |
| AP Reverse-O 12-g Slug (20) | 5 | P+1, B-25%, less range | 3.5 | 8/72hrs | 40 | 4 |
| SLAP Sport | 8 | AV, B-65%/-20%, range mods | 1.3 | GM | 150 | GM |
| SLAP MMG | 4 | AV, B-65%/-20%, range mods | 2.6 | GM | 300 | GM |
| SLAP HMG | - | AV, B-100%/-35%, range mods | 11.5 | GM | 750 | GM |
| APDS AMR | - | AV, B-100%/-50%, range mods | 21 | GM | 3000 | GM |
| PIE med | 6 | P+1 | 1 | 4/48hrs | 250 | 2 |
| PIE SMG | 6 | P+1 | 1 | 4/48hrs | 250 | 2 |
| PIE Carbine | 8 | P+1 | 1 | 4/48hrs | 100 | 2 |
| PIE Sport Rifle | 8 | P+1 | 1.5 | 4/48hrs | 140 | 2 |
| PIE Sniper Rifle (20) | 8 | P+1 | 1.5 | 6/48hrs | 160 | 2 |
| HEI Sniper Rifle (20) | 8 | P+2, incendiary | 1.5 | 6/48hrs | 180 | 3 |
| HEI H-Sniper Rifle | 4 | P+3, incendiary, AV, B-50% | 2 | 6/72hrs | 250 | 3 |
| HEIAP H-Sniper Rifle | 4 | P+3, incendiary, AV, B-75% | 2 | 6/6 days | 500 | 3 |
| HEI Fused AMR | 4 | P+4, incendiary, AV, B-100% | 40 | 6/10 days | 4500 | 3 |
| HEDP AMR | 4 | P+4, incendiary, AV, B-100% | 40 | 6/10 days | 5200 | 3 |
| PIE Shotgun slug (20) | 4 | P+2 | 3 | 4/48hrs | 140 | 2 |
| HEI Shotgun slug (20) | 4 | P+2, incendiary, AV | 3 | 6/48hrs | 160 | 3 |
| HEIAP Shotgun slug (20) | 4 | P+2, incendiary, AV, B-50% | 3 | 6/6 days | 200 | 3 |
| API AsRF | 8 | B-55%/-20%, incendiary | 1 | 4/48hrs | 30 | 2 |
| API Sport Rifle | 8 | B-55%/-20%, incendiary | 1.5 | 4/48hrs | 40 | 2 |
| API Sniper Rifle (20) | 8 | B-60%/-30%, incendiary | 1.5 | 4/48hrs | 50 | 2 |
| API H-Sniper Rifle | 5 | B-100%/-40%, incendiary | 3 | 4/48hrs | 120 | 2 |
| API AMR | - | B-100%/-50%, incendiary | 10 | 4/48hrs | 1200 | 2 |
| API Shutgun (AV slug) (20) | 5 | B-60%/-30%, incendiary | 2 | 4/48hrs | 120 | 2 |
| AsRF | 8 | incendiary | - | +2/12hrs | 10 | 1 |
| Sport Rifle | 8 | incendiary | - | +2/12hrs | 10 | 1 |
| Sniper Rifle ( | 8 | incendiary | - | +2/12hrs | 10 | 1 |
| H-Sniper Rifle | 5 | incendiary | - | +2/12hrs | 10 | 1 |
| AMR | - | incendiary | - | +2/12hrs | 50 | 1 |
| Shutgun (AV slug) ( | 5 | incendiary | - | +2/12hrs | 10 | 1 |
| Subsonic Lgt | 8 | range/2 | 1.5 | per regular | 10 | 1 |
| Subsonic Heavy pistol ( | 8 | P-2, range/2 | 1.5 | per regular | 10 | 1 |
| Subsonic SMG | 8 | P-1, range/2 | 2 | per regular | 0 | 1 |
| Subsonic Carb | 8 | DL-1, range/2 | 1 | 4/48hrs | 10 | 2 |
| Subsonic Sport Rifle ( | 8 | P-2, DL-1, range/2 | 1.5 | 4/48hrs | 10 | 2 |
| Subsonic Sniper Rifle ( | 8 | P-4, DL-1, range/2 | 1.5 | 4/48hrs | 10 | 2 |
| Dart, Empty | 8 | as toxin | .01 | 4/48hrs | 20 | 2 |
| Dart, Atropine | 8 | 6D | .01 | 5/48hrs | 620 | 1 |
| Dart, Cyanide | 8 | 7D | .01 | 4/48hrs | 380 | 1 |
| Dart, Fugu 5 | 8 | 3D | .01 | 4/72hrs | 10020 | .5 |
| Dart, Fugu 6 | 8 | 6D | .01 | 5/1week | 20020 | .5 |
| Dart, Fugu 8 | 8 | 8D | .01 | 8/2weeks | 30020 | .5 |
| Dart, Gamma-Scopolamine | 8 | 10D stun | .01 | 8/2weeks | 320 | 3 |
| Dart, Hyper | 8 | 6S stun | .01 | 4/48hrs | 200 | 1 |
| Dart, Insecticide | 8 | Special | .01 | 4/48hrs | 25 | 2 |
| Dart, MAO | 8 | Special | .01 | 5/48hrs | 300 | 2 |
| Dart, Narcoject | 8 | 6D stun | .01 | 4/48hrs | 170 | 1 |
| Stundart Rnds(HP only) | 8 | 10S Stun | .075 | 6/72hrs | 8 | 2 |
| Taser Darts | 3 | special | .05 | 6/36hrs | 5 | 1.5 |
| Big D | 8 | (See Rules) | .1 | 16/14days | 20 | 5 |
| Big D | 8 | (See Rules) | 1 | 16/14days | 200 | 5 |
| Bola Rnds (1) | 8 | (See Rules) | .1 | 5/72hrs | 10 | 2 |
| Bola Rnds (10) | 8 | (See Rules) | 1 | 5/72hrs | 100 | 2 |
| Flare Rnds (1) | 8 | (See Rules) | .1 | 4/48hrs | 2.5 | 1 |
| Flare Rnds (10) | 8 | (See Rules) | 1 | 4/48hrs | 25 | 1 |
| Shock Lock Rnds (1) | 8 | (See Rules) | .075 | 5/48hrs | 7 | 2 |
| Shock Lock Rnds (10) | 8 | (See Rules) | .75 | 5/48hrs | 70 | 2 |
| Stun Rnds (1) | 8 | (As Weapon)Stun | .05 | 3/12hrs | 2.5 | 1 |
| Stun Rnds (10) | 8 | (As Weapon)Stun | .5 | 3/12hrs | 25 | 1 |
| Dragon | 8 | 14M/10L, white phosphorus rules | 1.5 | 6/5days | 150 | 3 |
| Flare (20) | 6 | (see rules) | 1.2 | 3/36hrs | 75 | 1.5 |
| Light Flechette Rnds(12g) (25) | 6 | range+50% | 1.2 | 2/24hrs | 75 | 1 |
| Heavy Flechette Rnds(12g) (25) | 6 | range+50%, B-25% | 1.2 | 2/24hrs | 80 | 1 |
| Heavy Flechette Rnds(10g) (25) | 6 | range+50%, B-25% | 1.4 | 2/24hrs | 100 | 1 |
| Lockbuster Rnds (20) | 6 | P+2 (-3/m), DL+1 (-1/m), use stand-off brake | 1.5 | 4/48hrs | 125 | 2 |
| Agricultural Bomb (20) | 6 | 10S stun (-3/m), flash, GRLN ranges | 1.5 | 4/48hrs | 200 | 1 |
| Assault Cannon Belt (100) | - | - | 12.5 | 6/3days | 4250 | 2 |
| AV Assault Cannon Belt (100) | - | (As Weapon) | 15 | 16/2wks | 9500 | 4 |
| Assault Cannon Rnds | 3 | - | .125 | 5/3days | 45 | 2 |
| AV Assault Cannon Rnds | 3 | (As Weapon) | .15 | 16/2wks | 100 | 4 |
| Extra High Impact | 3 | special | .15 | 8/4 days | 1000 | 2.25 |
| Gyrojet Rockets (Stand.)(10) | 8 | (As Weapon) | 1.75 | 4/48hrs | 80 | 2.5 |
| Gyrojet Rockets (Plus) (10) | 8 | (See Rules) | 2 | 14/3wks | 120 | 4 |
| Gyrojet Seeker Heads Stand(10) | 7 | (As Rocket) | .25 | 5/72hrs | 160 | 2.5 |
| Gyrojet Seeker Heads Plus.(10) | 7 | (As Rocket) | .25 | 15/4.5wks | 240 | 4 |
| Net Rnds (Normal) | 7 | (See Rules) | 5 | 4/48hrs | 1500 | 1 |
| Net Rnds (Large) | 5 | (See Rules) | 7.5 | 4/48hrs | 3000 | 1 |
| Speargun Spears | 8 | (As Weapon) | 10 | 2/24hrs | 500 | 2 |
| AP Mortar Round B | 3 | 18D(f) | 4 | 18/2wks | 250 | 3 |
| AV Mortar Round B | 3 | 16D | 4 | 18/3wks | 250 | 4 |
| Duel Charge Round B | 3 | (Special) | 5 | 18/3wks | 500 | 4 |
| HE Mortar Round B | 3 | 18D | 4 | 18/2wks | 200 | 3 |
| Incendiary Round B | 3 | (Special) | 4 | 18/2wks | 150 | 3 |
| Seeker Round B | - | (As Round) | +.5 | +2/+1wk | +1000 | +1 |
| Smoke Mortar Round | 3 | - | 3.5 | 18/2wks | 175 | 2 |
| Smoke (IR) Mortar Round | 3 | - | 3.5 | 18/3wks | 200 | 3 |
| Solar Mortar Round B | 3 | (Special) | 3.5 | 18/2wks | 200 | 2 |
| Splash Mortar Round B | 3 | (Special) | 5 | 18/1wk | 300 | 3 |
| White Phosphorus Round B | 3 | 15S/12L | 4 | 18/2wks | 350 | 3 |
| Arasaka Restraint Caster (20) | 5 | none | .75 | 6/72hrs | 60 | 2 |
| Arasaka Rest. Cas. Solvant(10) | 5 | none | .4 | 6/72hrs | 10 | 2 |
| Carbosteel Wire Net | 5 | 10S Stun | 1 | 6/48hrs | 100 | 2 |
| FEN Dz-55 Det-Web | 5 | 8D | 2 | 10/72hrs | 450 | 3 |
| Large Net | 5 | none | .75 | 8/48hrs | 300 | 2 |
| Small Net | 7 | none | .5 | 6/48hrs | 150 | 2 |
| DTox Spetsdod Round | 8 | 3D | * | 14/14days | GM | GM |
| ShokTox Spetsdod Round | 8 | 6D Stun | * | 4/48hrs | 200 | 1 |
| SPAZM Spetsdod Round | 8 | 6D+Special | * | 14/30days | GM | GM |
| Stinger Spetsdod Round | 8 | (see rules) | * | 4/48hrs | 100 | 1 |
| Chaff (ECM) Grenade (A) | 6 | Special | .5 | 4/4days | 30 | 1.5 |
| Anti-Armor Minigrenade | 8 | 10S | .1 | 8/5days | 125 | 3.5 |
| Anti-Personnel Flechette | 8 | 10D(f) | .1 | 9/14days | 100 | 3.5 |
| Concussion Minigrenade B | 8 | 10M Stun | .1 | 7/4days | 60 | 3 |
| Def. AP Minigrenade B | 8 | 10S(f) | .1 | 6days | 60 | 3 |
| Def. HE Minigrenade B | 8 | 10S | .1 | 6/6days | 60 | 3 |
| Dual Charge Minigrenade | 8 | (Special) | .1 | 10/9days | 300 | 4 |
| Flare Minigrenade | 8 | (Special) | .1 | 4/24hrs | 80 | 2 |
| Flash Minigrenade | 8 | (Special) | .1 | 6/48hrs | 80 | 2 |
| Gas Minigrenade | 8 | NeuroStun | .1 | 10/6days | 120 | 3 |
| Green Ring 4 Minigrenade | 8 | gas | .1 | 14/6days | 120 | 3 |
| Incendary Minigrenade | 8 | (Special) | .1 | 6/6days | 100 | 3 |
| Ink Minigrenade | 8 | None | .1 | 6/6days | 80 | 3 |
| IPE Concussion Minigrenade | 8 | 16M Stun | .1 | 10/9days | 140 | 3 |
| IPE Defensive AP Minigrenade | 8 | 15D(f) | .1 | 10/9days | 120 | 3 |
| IPE Defensive HE Minigrenade | 8 | 15S | .1 | 10/9days | 120 | 3 |
| IPE Offensive AP Minigrenade | 8 | 15D(f) | .1 | 10/9days | 120 | 3 |
| IPE Offensive HE Minigrenade | 8 | 15S | .1 | 10/9days | 120 | 3 |
| Neurostun-Minigrenade | 8 | 8M + gas | .15 | 12/4ays | 200 | 3 |
| Off. AP Minigrenade B | 8 | 10S(f) | .1 | 6/6days | 60 | 3 |
| Off. HE Minigrenade B | 8 | 10S | .1 | 6/6days | 60 | 3 |
| Smoke Minigrenade | 8 | - | .1 | 5/24hrs | 60 | 3 |
| Smoke (IR) Minigrenade | 8 | - | .1 | 6/48hrs | 80 | 3 |
| Neurostun-Minigrenade | 8 | 8M + gas | .15 | 12/4ays | 200 | 3 |
| SplatShell Minigrenade | 8 | splatballs | .1 | 6/48hrs | 10 | 1 |
| Tr | 8 | 8M | .15 | 4/24hrs | 50 | 1.5 |
| Super Flash Minigrenade | 8 | (Special) | .1 | 12/16days | 160 | 4 |
| White Phosphorus Minigrenade | 8 | 14M/10L | .1 | 8/7days | 240 | 4 |
| XM1822 Adapter | 10 | 12D(f) | 1 | 4/48hrs | 300 | 2 |
| 12 Gauge Adapter | 10 | per shotgun load | .75 | 4/48hrs | 80 | 2 |
| 20mm Offensive HE | 10 | 10S (-1/m) | .25 | 5/4 days | 100 | 2 |
| 20mm Defensive HE | 10 | 10S (-0.5/m) | .25 | 5/4 days | 100 | 2 |
| 20mm Concussion | 10 | 12M stun (-1/m) | .25 | 5/4 days | 100 | 2 |
| 20mm White Phosphorus | 10 | 12M/8L (-1/m) | .25 | 6/5 days | 440 | 3 |
| 20mm Flash | 10 | (see rules) | .25 | 4/2 days | 160 | 2 |
| 20mm Flechete | 10 | 10D(f) (-1/m) | .25 | 5/4 days | 100 | 2 |
| 20mm DSAT Offensive HE | 10 | 9S (-5/m) | .35 | 7/5 days | 150 | 3 |
| 20mm DSAT Defensive HE | 10 | 9S (-5/m) | .35 | 7/5 days | 150 | 3 |
| 20mm DSAT Concussion | 10 | 11M stun (-5/m) | .35 | 7/5 days | 150 | 3 |
| 20mm DSAT White Phosphorus | 10 | 11M/8L (-5/m) | .35 | 8/6 days | 660 | 4 |
| 20mm DSAT Flash | 10 | (see rules) | .35 | 6/3 days | 240 | 3 |
| 20mm DSAT Flech | 10 | 9D(f) (-5/m) | .35 | 7/5 days | 150 | 3 |
| 20mm ATAT Offensive HE | 10 | 8S (-1/m) | .5 | 11/19 days | 300 | 3 |
| 20mm ATAT Defensive HE | 10 | 8S (-0.5/m) | .5 | 11/19 days | 300 | 3 |
| 20mm ATAT Concussion | 10 | 10M stun (-1/m) | .5 | 11/19 days | 300 | 3 |
| 20mm ATAT White Phosphorus | 10 | 10M/8L (-1/m) | .5 | 12/20 days | 1320 | 4 |
| 20mm ATAT Flash | 10 | (see rules) | .5 | 10/17 days | 480 | 3 |
| 20mm ATAT Flech | 10 | 8D(f) (-1/m) | .5 | 11/19 days | 300 | 3 |
| 40mm IPE Offensive HE | 8 | 15S (-1/m) | .75 | 5/4 days | 120 | 2 |
| 40mm IPE Defensive HE | 8 | 15S (-0.5/m) | .75 | 5/4 days | 120 | 2 |
| 40mm IPE Concussion | 8 | 16M stun (-1/m) | .75 | 5/4 days | 120 | 2 |
| 40mm White Phosphorus | 8 | 14M/10L (-1/m) | .75 | 6/5 days | 480 | 3 |
| 40mm Flash | 8 | (see rules) | .75 | 4/2 days | 160 | 2 |
| 40mm Flechete | 8 | 15D(f) (-1/m) | .75 | 5/4 days | 120 | 2 |
| 40mm DSAT IPE Offensive HE | 8 | 14S (-5/m) | .85 | 7/5 days | 180 | 3 |
| 40mm DSAT IPE Defensive HE | 8 | 14S (-5/m) | .85 | 7/5 days | 180 | 3 |
| 40mm DSAT IPE Concussion | 8 | 15M stun (-5/m) | .85 | 7/5 days | 180 | 3 |
| 40mm DSAT White Phosphorus | 8 | 13M/8L (-5/m) | .85 | 8/6 days | 720 | 4 |
| 40mm DSAT Flash | 8 | (see rules) | .85 | 6/3 days | 240 | 3 |
| 40mm DSAT Flech | 8 | 14D(f) (-5/m) | .85 | 7/5 days | 180 | 3 |
| 40mm DSAT Light Anti-Armor | 8 | 12D(f) (-6/m) | 1 | 20/45 days | 225 | 3 |
| 40mm ATAT IPE Offensive HE | 8 | 13S (-1/m) | 1 | 11/19 days | 360 | 3 |
| 40mm ATAT IPE Defensive HE | 8 | 13S (-0.5/m) | 1 | 11/19 days | 360 | 3 |
| 40mm ATAT IPE Concussion | 8 | 14M stun (-1/m) | 1 | 11/19 days | 360 | 3 |
| 40mm ATAT White Phosphorus | 8 | 12M/8L (-1/m) | 1 | 12/20 days | 1440 | 4 |
| 40mm ATAT Flash | 8 | (see rules) | 1 | 10/17 days | 480 | 3 |
| 40mm ATAT Flech | 8 | 10D(f) (-1/m) | 1 | 11/19 days | 360 | 3 |
| Anti-Tank | 4 | 16D | .5 | 8/8 days | 100 | 2 |
| Concussion | 4 | 12M Stun | .5 | 8/8 days | 50 | 2 |
| Defensive | 4 | 10S | .5 | 8/8 days | 50 | 2 |
| Offensive | 4 | 10S | .5 | 8/8 days | 50 | 2 |
| Concussion Shotgun Grenade | 8 | 10M | .2 | 7/4 days | 600 | 3 |
| Defensive Shotgun Grenade | 8 | 8S | .2 | 6/4 days | 600 | 3 |
| Offensive Shotgun Grenade | 8 | 8S | .2 | 6/4 days | 600 | 3 |
| Smoke | 6 | - | .25 | 4/4 days | 30 | 2 |
| Defensive Mikrogrenade | 9 | 10S | .1 | 6/36hrs | 80 | 1.5 |
| Offensive Mikrogrenade | 9 | 10S | .1 | 6/36hrs | 80 | 1.5 |
| Schock Mikrogrenade | 9 | 12M Stun | .1 | 8/36hrs | 80 | 1.5 |
| Concussion Pistol Grenade | 8 | 8M Stun | .1 | 5/6 days | 15 | 2 |
| Defensive Frag Pistol Grenade | 8 | 6M | .1 | 5/7 days | 20 | 2 |
| Flash Bomb Pistol Grenade | 8 | 4L | .1 | 4/72hrs | 15 | 1.2 |
| HEP (Cratering) Pistol Grenade | 8 | (see rules) | .1 | 4/6 days | 30 | 1.5 |
| Incendiary Pistol Grenade | 8 | 6M | .1 | 8/7 days | 30 | 2 |
| Offensive Frag Pistol Grenade | 8 | 6S | .1 | 5/7 days | 25 | 2 |
| Smoke | 8 | gas | .1 | 6/7 days | 20 | 2.5 |
| Anti-Armor LRR Grenade | 5 | 12D | 3 | 5/36hrs | 200 | 3 |
| Anti-Personnel LRR Grenade | 5 | 12S(f) | 3 | 5/36hrs | 150 | 3 |
| High Explosive LRR Grenade | 5 | 12S | 3 | 5/36hrs | 150 | 3 |
| Smoke LRR Grenade | 5 | - | 2.5 | 4/36hrs | 125 | 2.5 |
| Anti-Armor HRR Grenade | 5 | 18D | 3 | 5/36hrs | 200 | 3 |
| Anti-Personnel HRR Grenade | 5 | 18D(f) | 3 | 5/36hrs | 150 | 3 |
| High Explosive HRR Grenade | 5 | 18S | 3 | 5/36hrs | 150 | 3 |
| Smoke HRR Grenade | 5 | - | 2.5 | 4/36hrs | 125 | 2.5 |
| Anti-Personnel Mine | 8 | As grenade | 2 | As grenade | As grenade x 10 | 2 |
| Anti-Vehicle Mine | 6 | 12D | 5 | 10/1wk | 500 | 3 |
| Antitank Mine | 4 | 14D | .5 | 10/7days | 40 | 3 |
| Claymore | 4 | 10D/10S | 1.5 | 8/6days | 175 | 3 |
| Claymore | 6 | 16D | 1 | 8/2wks | 200 | 2 |
| Directional A-P Mine | 4 | 8D(f)/8S | .5 | 10/7days | 100 | 3 |
| Explosive-Tipped Spike | 10 | 2D | .1 | 8/10days | 5 | 2 |
| Thermite Limpet Mine | 8 | 10S | .25 | 9/7days | 80 | 2.5 |
| Trapdoor Smart Mine | 8 | 14D | 15 | 14/21days | 10000 | 4 |
| Bangalore Torpedo | 3 | 20D | 6 | 14/2wks | 25000 | - |
| Cratering Charge | - | special | 50 | 14/2wks | 50000 | 3 |
| Detcord (30m) | 3 | 12S | 1 | 14/2wks | 2500 | 2 |
| Micro Flares | 10 | 6M | - | Always | 75 | 1 |

### Firearms Accessories
| Name | Mount | Concealability | Rating | Weight | Availability | Cost | Street Index |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 22mm Muzzle Adaptor | Barrel | - | - | - | 6/48hrs | 100 | 3 |
| Ares MirrorSmarts | - | 10 | - | - | 6/60hrs | 6500 | 2 |
| Bow Accessory Mount | - | (-1) | - | .1 | 2/24hrs | 100 | .9 |
| Concealable Holster | - | (+2) | - | .1 | 2/24hrs | 100 | .75 |
| Digital Weapon Uplink | Top/Under | -1 | - | .5 | 6/6days | 500 | 2 |
| Electrothermal Ammo Enhancem. | - | - | - | .5 | 10/7days | 0 | 2 |
| Gun Cam | Top/Under | (-1) | - | .25 | 3/36hrs | 100 | 1.2 |
| Gun Camera | Top/Under | (-1) | - | .25 | 2/24hrs | 300 | .5 |
| Individual Biometric Safety | - | - | .1 | 3/36hrs | 2250 | 1.5 |  |
| Militech Muzzle Adaptor | Barrel | - | - | - | 4/48hrs | 200 | .9 |
| Nine-Eleven Chip | Top/Under | (-1) | - | - | call Lone Star | 1750 | - |
| Rangefinder | Under | - | - | .1 | 2/24hrs | 150 | .8 |
| Rangefinder Grenade Link | - | - | - | .1 | 8/48hrs | 750 | 2 |
| Security Chipping | Top/Under | - | 10 | - | 4/72hrs | 1250 | 1 |
| Spare Clip | - | - | - | .75 | 2/24hrs | 5 | .75 |
| LaserEdge | melee weapons only | -1 | - | .25 | 6/5days | 700 | 2 |
| Sharpwire Net Under-Barrel | Under | (-2) | - | 2 | 5/4days | 450 | 2 |
| Sighting Band | Top | - | (-1) | .25 | 4/24hrs | 20 | 1 |
| Speedholster | - | (+2) | - | .25 | 4/24hrs | 200 | 1.25 |
| Speedloader | - | 8 | - | .5 | 2/24hrs | 10 | .75 |
| Improved Sound Suppressor | Barrel | (-2) | +1 | .5 | 8/72hrs | 7500 | 2 |
| Mini Silencer | Barrel | - | (-1) | .1 | 6/48hrs | 2500 | 1 |
| Revolver Silencer | Barrel | (-3) | - | 1 | 6/60hrs | 700 | 3 |
| Shhh 7000 Sound Suppressor | Barrel | (-3) | +2 | 1 | 9/72hrs | 11250 | 2.5 |
| Silencer | Barrel | (-2) | - | .2 | 4/48hrs | 500 | 2 |
| Slimline Silencer | Barrel | (-1) | - | .2 | 6/48hrs | 2500 | 2 |
| Sound Suppresser | Barrel | (-2) | - | .5 | 6/48hrs | 750 | 2 |
| Smartscope (No magnification) | Top | (-2) | -1/0 | 1 | 5/60hrs | 3250 | 1 |
| Smartscope (Magnification 1) | Top | (-2) | -1/1 | 1 | 5/60hrs | 3500 | 1 |
| Bipod | Under | - | - | 2 | 6/12hrs | 400 | 1 |
| Gas Vent II | Barrel | (-1) | 1 | .5 | 2/24hrs | 450 | .8 |
| Gas Vent III | Barrel | (-2) | 2 | .75 | 2/24hrs | 700 | 1 |
| Gyro Mount | - | (-6) | 6 | 8 | 4/48hrs | 7000 | 1 |
| Gyro Mount | Under | (-7) | 7 | 7 | 6/48hrs | 7800 | 1 |
| Gyro Mount | Under | (-6) | 5 | 5 | 6/48hrs | 3500 | 1 |
| Gyro Mount | - | (-5) | 5 | 6 | 4/48hrs | 2500 | 1 |
| Improved Gas Vent II | Barrel | (-) | 2 | .25 | 2/24hrs | 550 | .9 |
| Improved Gas Vent III | Barrel | (-1) | 3 | .5 | 2/24hrs | 800 | .9 |
| Improved Gas Vent IV | Barrel | (-2) | 4 | .75 | 2/24hrs | 1000 | 1 |
| Shock Pads | - | - | 1 | .25 | 2/24hrs | 200 | .75 |
| SumnerTech Gyro-Mount 1S | Under | (-3) | 3 | 2.5 | 6/48hrs | 2000 | 1 |
| Tripod | Under | - | 6 | 8 | 10/12hrs | 600 | 1 |
| Ultrasound Sight | Top | (-2) | - | .25 | 8/4days | 1300 | .8 |
| Ultrasound Goggles | NA | - | - | - | 3/36hrs | 1100 | 1 |
| DUD Smartgun Controller | Top/Under | -1 | 3 | .25 | 8/6days | 5000 | 2.5 |
| Imaging Scope | Top | (-2) | - | .25 | 3/36hrs | 1500 | .8 |
| Imaging Scope | Top | (-1) | 1 | .25 | 3/36hrs | 500 | .8 |
| Imaging Scope | Top | (-1) | 2 | .25 | 3/36hrs | 800 | .9 |
| Imaging Scope | Top | (-1) | 3 | .25 | 3/36hrs | 1200 | 1 |
| Imaging Scope | Top | (-2) | - | .25 | 3/36hrs | 1500 | .8 |
| Laser Sights | Top | (-1) | - | .25 | 6/36hrs | 500 | .9 |
| Midnight Arms Smartshades | - | 5 | - | - | 3/36hrs | 4500 | 1 |
| Smart Goggles | - | - | - | .1 | 3/36hrs | 3000 | 1 |
| Smartgun level I | - | - | - | .5 | - | 0 | - |
| Smartgun level I | Top/Under | (-2) | - | 1 | 4/48hrs | 600 | 1 |

### Explosives
| Name | Concealability | Rating | Weight | Availability | Cost | Street Index |
| --- | --- | --- | --- | --- | --- | --- |
| Commercial Explosive | 6 | 3 | 1 | 6/48hrs | 60 | 1 |
| Detcord (per 10 meters) | 6 | 6 | 5 | 10/48hrs | 900 | 1.5 |
| FEN Dz 25 | 10 | 4 | .02 | 8/5days | 120 | 4 |
| Plastic | 6 | 6 | 1 | 8/48hrs | 80 | 1 |
| Plastic | 6 | 12 | 1 | 10/48hrs | 250 | 2 |
| Radio Detonator | 8 | - | .25 | 4/48hrs | 250 | 2 |
| Shaped Charge | 4 | 15D | 1 | 12/48hrs | 500 | 2.5 |
| Timer | 6 | - | .5 | 4/48hrs | 100 | 2 |
| SecSystems Protection Field | 8 | 6L Stun | 1.5 | 6/36hrs | 750 | 1.5 |
| Sleep Inducer | 6 | 4 | .5 | 6/4days | 85 | 2 |

### Clothing and Armor
| Name | Concealability | Ballistic | Impact | Weight | Availability | Cost | Street Index |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Ordinary Clothing | - | - | - | 1 | Always | 50 | .8 |
| Fine Clothing | - | - | - | 1 | Always | 500 | 1 |
| Tres Chic Clothing | - | - | - | 1 | Always | 1000 | 1 |
| Heavy Leather(Jacket or Pants) | - | - | 2 | 1 | always | 750 | .75 |
| Real Leather | - | - | 2 | 1 | Always | 750 | .75 |
| Synthetic Leather | - | - | 1 | 1 | Always | 250 | .6 |
| Arasaka Jetsetter Briefcase | - | 3 | 3 | 4.5 | 4/36hrs | 2000 | 1.2 |
| Armor Clothing | 10 | 3 | - | 2 | 3/36hrs | 500 | 1 |
| Armor Jacket | 6 | 5 | 3 | 2 | 3/36hrs | 900 | .75 |
| Armored Stockings | 15 | +1 | 0 | - | 6/72hrs | 110 | 1.1 |
| Armor Street Clothes Type 1 | 12 | 3 | 1 | 1.5 | 3/24hrs | 500 | .8 |
| Armor Street Clothes Type 2 | 12 | 2 | 2 | 1.5 | 3/24hrs | 500 | .8 |
| Armor Vest | 12 | 2 | 1 | 1 | 2/36hrs | 200 | .8 |
| Forearm Guards | 12 | - | 1 | .2 | 5/36hrs | 250 | .75 |
| Kevlar Armor Jacket | 8 | 3 | 2 | 1 | 2/36hrs | 600 | .8 |
| Kevlar Armor Jacket | 6 | 4 | 3 | 1.5 | 3/36hrs | 800 | .8 |
| Kevlar Armor Jacket | 5 | 5 | 4 | 2 | 3/36hrs | 1000 | .8 |
| Kevlar T-Shirt | 11 | 2 | 0 | 1 | 4/48hrs | 220 | 2 |
| Lined Coat | 8 | 4 | 2 | 1 | 2/24hrs | 700 | .75 |
| Secure Clothing | 12 | 3 | - | 1.5 | 3/36hrs | 450 | .9 |
| Secure Jacket | 9 | 5 | 3 | 3 | 4/36hrs | 850 | .8 |
| Secure Vest | 15 | 2 | 1 | .75 | 3/36hrs | 175 | .9 |
| Secure Ultra-Vest | 14 | 4 | 3 | 2.5 | 3/36hrs | 350 | .9 |
| Secure Long Coat | 10 | 4 | 2 | 2 | 3/24hrs | 650 | .9 |
| Vest with Plates | 10 | 4 | 3 | 2 | 3/36hrs | 600 | 1 |
| Armant | 14 | 1 | 0 | .3 | 2/48hrs | 750 | .75 |
| Armant | 12 | 3 | 1 | 1 | 4/48hrs | 1100 | .75 |
| Armant | 12 | 2 | 2 | 1 | 4/48hrs | 600 | .75 |
| Armant | 13 | 1 | 1 | .75 | 2/48hrs | 4500 | .75 |
| Armant | 13 | 2 | 1 | 1 | 3/48hrs | 1000 | .75 |
| Armant | 14 | 1 | 0 | .5 | 2/48hrs | 3500 | .75 |
| Eji Armored Cloak | 14 | 2 | 1 | 1.5 | always | 500 | .75 |
| Eji Designer | - | 0 | 0 | 1 | always | 50 | .75 |
| Eji Lamb | - | 0 | 0 | 1 | always | 60 | .75 |
| Gibson Acid-washed Jeans | 10 | 2 | 1 | 1 | 4/48hrs | 300 | 1 |
| Gibson Denim Jacket | 9 | 2 | 1 | 1 | 4/48hrs | 1500 | 1 |
| Gibson T-Shirt | 10 | 1 | 0 | .5 | 4/48hrs | 100 | 1 |
| Gibson Sneak Suit Helmet | - | +1 | +0 | 1.5 | 10/5days | 1185 | 2.5 |
| Gibson Sneak Suit Diving Suit | +4 | 0 | 0 | 2 | 12/7days | 35000 | 3.5 |
| Gibson Sneak Suit Flak Vest | +2 | 2 | 1 | 1.5 | 8/5days | 1375 | 2 |
| Gibson Sneak Suit Sneak Suit | +4 | 1 | 0 | 1 | 8/5days | 1560 | 3 |
| Gibson Sneak Suit Space Suit | +4 | 1 | 1 | 10 | 14/7days | 25000 | 4.5 |
| ICON Bomber Jacket | - | 0 | 2 | 1.5 | always | 900 | .9 |
| ICON Boots | - | 0 | 0 | 1 | always | 450 | .8 |
| ICON Gun Belt | - | 0 | 0 | .25 | 3/24hrs | 180 | .9 |
| ICON | - | 0 | 0 | .5 | always | 300 | .8 |
| ICON Half Boots | - | 0 | 0 | .75 | always | 300 | .8 |
| ICON Long Duster | - | 0 | 1 | 1.5 | always | 1500 | .8 |
| ICON Long Skirt | - | 0 | 0 | 1 | always | 600 | .8 |
| ICON Miniskirt | - | 0 | 0 | .5 | always | 300 | .8 |
| ICON Pants | - | 0 | 0 | 1 | always | 750 | .8 |
| ICON Tunic | - | 0 | 1 | 1 | always | 660 | .8 |
| Masetto | - | - | - | - | always | 200 | 1 |
| Masetto | - | - | - | - | always | 40 | 1 |
| Masetto | - | - | +1 | 1 | 4/48hrs | 3,500 | 2 |
| Masetto | - | - | +1 | 1 | 3/48hrs | 600 | 2 |
| Masetto | 6 | 3 | 2 | 1 | always | 1600 | 1 |
| Masetto | - | - | - | - | always | 50 | 1 |
| Mortimer | 11 | 4 | 2 | 3 | 6/48hrs | 1000 | .75 |
| Nu-Tek Wearment Jacket | - | 0 | 0 | 1 | 3/48hrs | 300 | .9 |
| Nu-Tek Wearman Skirt | - | 0 | 0 | .75 | 3/48hrs | 200 | .9 |
| Takanaka Exec Briefcase | - | 0 | 0 | 1.5 | 5/72hrs | 600 | .8 |
| Takanaka Exec Cape | - | 0 | 0 | 1.5 | 6/72hrs | 900 | .9 |
| Takanaka Exec Cologne | - | - | - | - | 6/72hrs | 150 | .9 |
| Takanaka Exec Cravat | - | 0 | 0 | .5 | 6/72hrs | 100 | .9 |
| Takanaka Exec Armored Topcoat | 10 | 4 | 1 | 2.5 | 8/72hrs | 2000 | .9 |
| Takanaka Exec Jacket | - | 0 | 0 | 1 | 6/72hrs | 800 | .9 |
| Takanaka Exec Monogram Shirt | - | 0 | 0 | .75 | 7/72hrs | 200 | 1.1 |
| Takanaka Exec Opera Cloak | 10 | 3 | 1 | 2.5 | 8/72hrs | 1200 | .9 |
| Takanaka Exec Pants | - | 0 | 0 | 1 | 6/72hrs | 700 | .9 |
| Takanaka Exec Scarf | - | 0 | 0 | .25 | 6/72hrs | 75 | .9 |
| Takanaka Exec Sword Case | - | - | - | .5 | 8/72hrs | 300 | 1 |
| Takanaka Exec Tie | - | 0 | 0 | - | 6/72hrs | 100 | .9 |
| Takanaka Exec Top Coat | - | 0 | 0 | 1.5 | 6/72hrs | 1000 | .9 |
| Takanaka Exec Vest | - | 0 | 0 | .75 | 6/72hrs | 500 | .9 |
| Uniware Armored Jacket | 7 | 3 | 2 | 1.5 | 10/4days | 800 | 1.3 |
| Uniware Armored Trenchcoat | 7 | 4 | 3 | 2 | 10/4days | 900 | 1.3 |
| Uniware Blouse | - | 0 | 0 | .75 | 8/4days | 40 | 1.2 |
| Uniware Boots | - | 0 | 0 | 1 | 4/4days | 60 | 1.2 |
| Uniware Dress | - | 0 | 0 | 1.5 | 6/4days | 100 | 1.2 |
| Uniware Jumpsuit | - | 0 | 0 | 1.5 | 8/4days | 150 | 1.2 |
| Uniware Legpads | 8 | 2 | 2 | 1.5 | 9/4days | 300 | 1.3 |
| Uniware Pants | - | 0 | 0 | 1 | 8/4days | 70 | 1.2 |
| Uniware Skirt | - | 0 | 0 | .75 | 8/4days | 70 | 1.2 |
| Uniware Torso Armor | 8 | 2 | 2 | 2 | 10/4days | 300 | 1.3 |
| Uniware Utility Belt | - | 0 | 0 | .5 | 5/4days | 30 | 1.1 |
| Uniware Vest | - | 0 | 0 | .5 | 8/4days | 50 | 1.2 |
| Vashon Island Houndstooth Set | varies | varies | varies | varies | 6/48hrs | 2000 | .75 |
| Vashon Island Hunt Ball Set | varies | varies | varies | varies | 5/48hrs | 3000 | .75 |
| Zo | 13 | 3 | 1 | 1 | 4/48hrs | 2000 | .75 |
| Zo | 14 | 4 | 2 | 1.5 | 6/48hrs | 2000 | .75 |
| Zo | 13 | 3 | 1 | 1.5 | 4/48hrs | 2500 | .75 |
| Full Suit | - | 3 | 1 | - | 4/36hrs | 800 | 1 |
| Jacket | - | 5 | 3 | - | 5/36hrs | 1200 | 1 |
| Form-fitting Armor Lvl 1 | - | 2 | - | .75 | 3/48hrs | 150 | 1 |
| Form-fitting Armor Lvl 2 | 15 | 3 | 1 | 1.25 | 4/48hrs | 250 | 1 |
| Form-fitting Armor Lvl 3 | 12 | 4 | 1 | 1.75 | 4/48hrs | 500 | 1 |
| Fireproof Coat | 8 | 0 | 2 | 1 | 4/48hrs | 220 | 2 |
| Fireproof Jacket | 8 | 0 | 2 | 1 | 4/48hrs | 200 | 2 |
| Fireproof Shirt | 8 | 0 | 1 | .5 | 4/48hrs | 130 | 2 |
| Fireproof Hat | 8 | 0 | 1 | - | 4/48hrs | 130 | 2 |
| Fireproof Skirt | 8 | 0 | 1 | 1 | 4/48hrs | 150 | 2 |
| Fireproof Pants | 8 | 0 | 2 | 1.5 | 4/48hrs | 150 | 2 |
| Fireproof Overcoat | 8 | 0 | 2 | 2 | 4/48hrs | 500 | 2 |
| Fireproof Suit | 4 | (Special) | (Special) | 3 | 6/72hrs | 500 | 2.5 |
| Fire-Resistant Coveralls | 10 | 0 | 3 | 3.5 | 10/48hrs | 2000 | 1 |
| Light Combat Biker Armor | - | 3 | 2 | 1.25 | 4/48hrs | 900 | 1 |
| Heavy Combat Biker Armor | - | 6 | 5 | 2.75 | 4/48hrs | 1200 | 1 |
| Combat Bikr Helmet | - | +1 | +1 | .5 | 5/48hrs | 600 | 2 |
| Light Urban Brawl Armor | - | 3 | 2 | 1.25 | 4/48hrs | 700 | 1 |
| Medium Urban Brawl Armor | - | 4 | 3 | 1.5 | 4/48hrs | 750 | 1 |
| Heavy Urban Brawl Armor | - | 6 | 4 | 2.5 | 4/48hrs | 1000 | 1 |
| Urban Brawl Helmet | - | +1 | +1 | .5 | 5/48hrs | 600 | 1 |
| Battle Vest | 7 | 0 | 0 | 1 | 5/3days | 750 | 1.75 |
| Doorgunner | - | 6 | 4 | 12 | 9/8days | 7500 | 1.9 |
| Flack Vest | - | 4 | 4 | 2 | 6/4days | 1000 | 1 |
| Full Suit | - | 8 | 6 | (15+BODY) | 16/14days | 20000 | 3 |
| Helmet | - | +1 | +1 | 0 | 12/14days | 200 | 1.5 |
| Helmet | - | +1 | +1 | 0 | 12/14days | 200 | 1.5 |
| Helmet | - | +1 | +2 | 0 | 14/14days | 250 | 1.75 |
| MedicGear Combat Medical Armor | 5 | 3 | 1 | 4 | 10/14days | 3400 | 2 |
| Partial Suit | - | 6 | 4 | (10+BODY) | 8/10days | 10000 | 2 |
| Kelmar Light Police Armor | 2 | 3 | 5 | 2.5 | 20/14days | 10000 | 3 |
| Kelmar Heavy Police Armor | 1 | 5 | 7 | 4 | 24/20days | 12500 | 3.5 |
| Kelmar Police Helmet | - | +0 | +1 | .75 | 20/14days | 2000 | 3.5 |
| Light Security Armor | - | 6 | 4 | (9+BODY) | 12/10days | 7500 | 2 |
| Medium Security Armor | - | 6 | 5 | (11+BODY) | 14/10days | 9000 | 2.5 |
| Heavy Security Armor | - | 7 | 5 | (13+BODY) | 16/14days | 12000 | 3 |
| Security Helmet | - | +1 | +2 | 0 | 12/14days | 250 | 2 |
| Riot Shield | - | 1 | - | 2 | 8/14hrs | 1500 | 2 |
| Riot Shield | - | 2 | - | 3 | - | 3200 | - |
| Light Military Armor | - | 10 | 7 | (12+BODY) | 18/1mth | 25000 | 3 |
| Medium Military Armor | - | 12 | 8 | (14+BODY) | 24/1mth | 45000 | 3 |
| Heavy Military Armor | - | 14 | 9 | (16+BODY) | 28/1mth | 70000 | 3 |
| Military Helmet | - | +2 | +3 | 3 | 24/1mth | 2500 | 3 |
| MetalGear Arm Piece | 2 | 1.5 | 1.25 | 2 | 10/7days | 2000 | 3 |
| MetalGear Helmet | 2 | 1.5 | 1.25 | 2 | 10/7days | 2000 | 3 |
| MetalGear Leg Piece | 2 | 1.5 | 1.25 | 2 | 10/7days | 2000 | 3 |
| MetalGear Torso Piece | 2 | 1.5 | 1.25 | 2 | 10/7days | 2000 | 3 |
| Diving Suit | - | 2 | 1 | 10 | 10/10 days | 6,000 | 3 |
| Esporma Environment Suit | 1 | 2 | 1 | 5 | 6/4days | 7250 | 3 |
| 8 | +4 | 2 | 1 | 3 | 6/14days | 53000 | 8 |
| Helmet 8 | - | +1 | +0 | 1.5 | 8/14days | 6000 | 8 |
| IR Combat Cloak | +4/+2 | - | - | 2 | 6/48hrs | 450 | 2 |
| Kevlar Blanket | - | 2 | - | - | always | 500 | 1 |
| Medieval Armor (Maximillian) | - | 3 | 4 | 14 | 10/4days | 10600 | 1 |
| Medieval Armor (Standard) | - | 2 | 3 | 10 | 8/48hrs | 3500 | 1 |
| Military Chemsuit | - | - | - | BODY x1.5 | 18/14days | 15000 | 2 |
| Gear | - | +1 | +0 | 1 | 9/4days | 700 | 2.5 |
| Gear | - | 2 | 1 | 1.5 | 7/4days | 1275 | 2.5 |
| Gear | +2 | 1 | 0 | 1.5 | 5/48hrs | 1050 | 3 |
| Shadow Suit | 12 | 4 | 1 | 1.5 | 6/48hrs | 800 | 1 |
| Sneak Suit | +4 | 0 | 0 | 2 | 8/14days | 50000 | 7.5 |
| Thermal Regulation Suit | 14 | - | - | 2 | 6/48hrs | 8000 | 2 |

### S+S Vision Enhancers
| Name | Concealability | Magnification | Weight | Availability | Cost | Street Index |
| --- | --- | --- | --- | --- | --- | --- |
| Binoculars | 5 | 50x | 1 | Always | 100 | .8 |
| Binoculars | 5 | 50x | 1 | 4/48hrs | 300 | 1.25 |
| Binoculars | 5 | 50x | 1 | 4/48hrs | 350 | 1.25 |
| DataScope | 8 | - | .25 | 4/36hrs | 5000 | 1 |
| Goggles | 6 | 20x | - | 4/48hrs | 1500 | 1.5 |
| Low-Light Goggles | 6 | 20x | - | 6/48hrs | 2000 | 2 |
| Thermographic Goggles | 6 | 20x | - | 6/48hrs | 2200 | 2 |
| Optitech MagViewer | 4 | 20x | 1 | always | 375 | .8 |

### Surveillance and Security
| Name | Concealability | Weight | Availability | Cost | Street Index |
| --- | --- | --- | --- | --- | --- |
| Micro-Camcorder | 8 | - | 6/48hrs | 2500 | 2 |
| Micro-Recorder | 9 | - | 6/48hrs | 1000 | 2 |
| Micro-Transceiver | 18 | - | 6/48hrs | 2500 | 2 |
| Laser Link (TacComm) | 4 | 1 | 14/21days | 2700 | 2 |
| Master Unit (TacComm) | - | 75 | 24/21days | 60000 | 3 |
| Microwave Link (TacComm) | 3 | 1 | 18/21days | 4800 | 2 |
| Personal Comm Unit (TacComm) | - | .5 | 12/14days | 18500 | 2 |
| Portable Master Unit (TacComm) | 8 | 20 | 18/14days | 120000 | 2 |
| Satellite Uplink (TacComm) | - | 2 | 12/21days | 7500 | 2 |
| Dataline Tap Lv 1 | 12 | - | 1/8days | 5000 | 1.5 |
| Dataline Tap Lv 2 | 12 | - | 2/8days | 10000 | 1.5 |
| Dataline Tap Lv 3 | 12 | - | 3/8days | 15000 | 1.5 |
| Dataline Tap Lv 4 | 12 | - | 4/8days | 20000 | 1.5 |
| Dataline Tap Lv 5 | 12 | - | 5/8days | 25000 | 1.5 |
| Dataline Tap Lv 6 | 12 | - | 6/8days | 30000 | 1.5 |
| Dataline Tap Lv 7 | 12 | - | 7/8days | 35000 | 1.5 |
| Dataline Tap Lv 8 | 12 | - | 8/8days | 40000 | 1.5 |
| Dataline Tap Lv 9 | 12 | - | 9/8days | 45000 | 1.5 |
| Dataline Tap Lv 10 | 12 | - | 10/8days | 50000 | 1.5 |
| Shotgun Microphone Lv 1 | 5 | 1 | 1/36hrs | 1000 | 1 |
| Shotgun Microphone Lv 2 | 5 | 1 | 2/36hrs | 2000 | 1 |
| Shotgun Microphone Lv 3 | 5 | 1 | 3/36hrs | 3000 | 1 |
| Shotgun Microphone Lv 4 | 5 | 1 | 4/36hrs | 4000 | 1 |
| Shotgun Microphone Lv 5 | 5 | 1 | 5/36hrs | 5000 | 1 |
| Shotgun Microphone Lv 6 | 5 | 1 | 6/36hrs | 6000 | 1 |
| Shotgun Microphone Lv 7 | 5 | 1 | 7/36hrs | 7000 | 1 |
| Shotgun Microphone Lv 8 | 5 | 1 | 8/36hrs | 8000 | 1 |
| Shotgun Microphone Lv 9 | 5 | 1 | 9/36hrs | 9000 | 1 |
| Shotgun Microphone Lv 10 | 5 | 1 | 10/36hrs | 10000 | 1 |
| Signal Locator Lv 1 | 3 | 2 | 1/48hrs | 1000 | 1.5 |
| Signal Locator Lv 2 | 3 | 2 | 2/48hrs | 2000 | 1.5 |
| Signal Locator Lv 3 | 3 | 2 | 3/48hrs | 3000 | 1.5 |
| Signal Locator Lv 4 | 3 | 2 | 4/48hrs | 4000 | 1.5 |
| Signal Locator Lv 5 | 3 | 2 | 5/48hrs | 5000 | 1.5 |
| Signal Locator Lv 6 | 3 | 2 | 6/48hrs | 6000 | 1.5 |
| Signal Locator Lv 7 | 3 | 2 | 7/48hrs | 7000 | 1.5 |
| Signal Locator Lv 8 | 3 | 2 | 8/48hrs | 8000 | 1.5 |
| Signal Locator Lv 9 | 3 | 2 | 9/48hrs | 9000 | 1.5 |
| Signal Locator Lv 10 | 3 | 2 | 10/48hrs | 10000 | 1.5 |
| Tracking Signal Lv 1 | 3 | - | 1/72hrs | 300 | 2 |
| Tracking Signal Lv 2 | 4 | - | 2/72hrs | 400 | 2 |
| Tracking Signal Lv 3 | 5 | - | 3/72hrs | 500 | 2 |
| Tracking Signal Lv 4 | 6 | - | 4/72hrs | 600 | 2 |
| Tracking Signal Lv 5 | 7 | - | 5/72hrs | 700 | 2 |
| Tracking Signal Lv 6 | 8 | - | 6/72hrs | 800 | 2 |
| Tracking Signal Lv 7 | 9 | - | 7/72hrs | 900 | 2 |
| Tracking Signal Lv 8 | 10 | - | 8/72hrs | 1000 | 2 |
| Tracking Signal Lv 9 | 11 | - | 9/72hrs | 1100 | 2 |
| Tracking Signal Lv 10 | 12 | - | 10/72hrs | 1200 | 2 |
| Voice Identifier Lv 1 | 2 | 5 | 1/72hrs | 2000 | 2 |
| Voice Identifier Lv 2 | 2 | 5 | 2/72hrs | 4000 | 2 |
| Voice Identifier Lv 3 | 2 | 5 | 3/72hrs | 6000 | 2 |
| Voice Identifier Lv 4 | 2 | 5 | 4/72hrs | 8000 | 2 |
| Voice Identifier Lv 5 | 2 | 5 | 5/72hrs | 10000 | 2 |
| Voice Identifier Lv 6 | 2 | 5 | 6/72hrs | 12000 | 2 |
| Voice Identifier Lv 7 | 2 | 5 | 7/72hrs | 14000 | 2 |
| Voice Identifier Lv 8 | 2 | 5 | 8/72hrs | 16000 | 2 |
| Voice Identifier Lv 9 | 2 | 5 | 9/72hrs | 18000 | 2 |
| Voice Identifier Lv 10 | 2 | 5 | 10/72hrs | 20000 | 2 |
| Low-wattage Flashlight | - | - | always | 10 | 1 |
| Low-wattage Gun-Flashlight | - | - | 2/24hrs | 100 | 1 |
| Low-wattage Floodlight | - | - | always | 150 | 1 |
| Active Infrared Flashlight | - | - | 4/48hrs | 100 | 2 |
| Active Infrared Gun-Flashlight | - | - | 6/48hrs | 250 | 2 |
| Active Infrared Floodlight | - | - | 5/48hrs | 350 | 2 |
| Ultraviolet Flashlight | - | - | 4/4days | 200 | 2 |
| Ultraviolet Gun-Flashlight | - | - | 6/4days | 500 | 2 |
| Ultraviolet Floodlight | - | - | 8/4days | 750 | 2 |
| Bug Scanner Lv 1 | 3 | 1 | 1/48hrs | 500 | 1.5 |
| Bug Scanner Lv 2 | 3 | 1 | 2/48hrs | 1000 | 1.5 |
| Bug Scanner Lv 3 | 3 | 1 | 3/48hrs | 1500 | 1.5 |
| Bug Scanner Lv 4 | 3 | 1 | 4/48hrs | 2000 | 1.5 |
| Bug Scanner Lv 5 | 3 | 1 | 5/48hrs | 2500 | 1.5 |
| Bug Scanner Lv 6 | 3 | 1 | 6/48hrs | 3000 | 1.5 |
| Bug Scanner Lv 7 | 3 | 1 | 7/48hrs | 3500 | 1.5 |
| Bug Scanner Lv 8 | 3 | 1 | 8/48hrs | 4000 | 1.5 |
| Bug Scanner Lv 9 | 3 | 1 | 9/48hrs | 4500 | 1.5 |
| Bug Scanner Lv 10 | 3 | 1 | 10/48hrs | 5000 | 1.5 |
| Jammer Lv 1 | 2 | 5 | 1/72hrs | 1000 | 1.5 |
| Jammer Lv 2 | 2 | 5 | 2/72hrs | 2000 | 1.5 |
| Jammer Lv 3 | 2 | 5 | 3/72hrs | 3000 | 1.5 |
| Jammer Lv 4 | 2 | 5 | 4/72hrs | 4000 | 1.5 |
| Jammer Lv 5 | 2 | 5 | 5/72hrs | 5000 | 1.5 |
| Jammer Lv 6 | 2 | 5 | 6/72hrs | 6000 | 1.5 |
| Jammer Lv 7 | 2 | 5 | 7/72hrs | 7000 | 1.5 |
| Jammer Lv 8 | 2 | 5 | 8/72hrs | 8000 | 1.5 |
| Jammer Lv 9 | 2 | 5 | 9/72hrs | 9000 | 1.5 |
| Jammer Lv 10 | 2 | 5 | 10/72hrs | 10000 | 1.5 |
| PanicButton Jammer | - | - | 8/48hrs | 200 | 1 |
| Portacom Jammer | - | - | 4/24hrs | 20 | 1 |
| Radio Jammer | - | - | 5/36hrs | 100 | 1 |
| Voice Mask Lv 1 | 6 | - | 1/72hrs | 3000 | 1.5 |
| Voice Mask Lv 2 | 6 | - | 2/72hrs | 6000 | 1.5 |
| Voice Mask Lv 3 | 6 | - | 3/72hrs | 9000 | 1.5 |
| Voice Mask Lv 4 | 6 | - | 4/72hrs | 12000 | 1.5 |
| Voice Mask Lv 5 | 6 | - | 5/72hrs | 15000 | 1.5 |
| Voice Mask Lv 6 | 6 | - | 6/72hrs | 18000 | 1.5 |
| Voice Mask Lv 7 | 6 | - | 7/72hrs | 21000 | 1.5 |
| Voice Mask Lv 8 | 6 | - | 8/72hrs | 24000 | 1.5 |
| Voice Mask Lv 9 | 6 | - | 9/72hrs | 27000 | 1.5 |
| Voice Mask Lv 10 | 6 | - | 10/72hrs | 30000 | 1.5 |
| ID Scanner: Thumbprint Lv 1 | - | - | 1/72hrs | 200 | 1 |
| ID Scanner: Thumbprint Lv 2 | - | - | 2/72hrs | 400 | 1 |
| ID Scanner: Thumbprint Lv 3 | - | - | 3/72hrs | 600 | 1 |
| ID Scanner: Thumbprint Lv 4 | - | - | 4/72hrs | 800 | 1 |
| ID Scanner: Thumbprint Lv 5 | - | - | 5/72hrs | 1000 | 1 |
| ID Scanner: Thumbprint Lv 6 | - | - | 6/72hrs | 1200 | 1 |
| ID Scanner: Thumbprint Lv 7 | - | - | 7/72hrs | 1400 | 1 |
| ID Scanner: Thumbprint Lv 8 | - | - | 8/72hrs | 1600 | 1 |
| ID Scanner: Thumbprint Lv 9 | - | - | 9/72hrs | 1800 | 1 |
| ID Scanner: Thumbprint Lv 10 | - | - | 10/72hrs | 2000 | 1 |
| ID Scanner: Palmprint Lv 1 | - | - | 2/72hrs | 300 | 2 |
| ID Scanner: Palmprint Lv 2 | - | - | 3/72hrs | 600 | 2 |
| ID Scanner: Palmprint Lv 3 | - | - | 4/72hrs | 900 | 2 |
| ID Scanner: Palmprint Lv 4 | - | - | 5/72hrs | 1200 | 2 |
| ID Scanner: Palmprint Lv 5 | - | - | 6/72hrs | 1500 | 2 |
| ID Scanner: Palmprint Lv 6 | - | - | 7/72hrs | 1800 | 2 |
| ID Scanner: Palmprint Lv 7 | - | - | 8/72hrs | 2100 | 2 |
| ID Scanner: Palmprint Lv 8 | - | - | 9/72hrs | 2400 | 2 |
| ID Scanner: Palmprint Lv 9 | - | - | 10/72hrs | 2700 | 2 |
| ID Scanner: Palmprint Lv 10 | - | - | 11/72hrs | 3000 | 2 |
| ID Scanner: Retinal Lv 1 | - | - | 3/72hrs | 1000 | 3 |
| ID Scanner: Retinal Lv 2 | - | - | 4/72hrs | 2000 | 3 |
| ID Scanner: Retinal Lv 3 | - | - | 5/72hrs | 3000 | 3 |
| ID Scanner: Retinal Lv 4 | - | - | 6/72hrs | 4000 | 3 |
| ID Scanner: Retinal Lv 5 | - | - | 7/72hrs | 5000 | 3 |
| ID Scanner: Retinal Lv 6 | - | - | 8/72hrs | 6000 | 3 |
| ID Scanner: Retinal Lv 7 | - | - | 9/72hrs | 7000 | 3 |
| ID Scanner: Retinal Lv 8 | - | - | 10/72hrs | 8000 | 3 |
| ID Scanner: Retinal Lv 9 | - | - | 11/72hrs | 9000 | 3 |
| ID Scanner: Retinal Lv 10 | - | - | 12/72hrs | 10000 | 3 |
| PANICBUTTON Hook-Up | - | - | Call Lone Star | 1000 | 1 |
| Advanced Alarm Removal Kit | 2 | 3 | 8/12hrs | 2900 | 5 |
| Global Positioning System | 8 | .5 | 6/48hrs | 700 | 1 |
| LaserTrack Aerosol | - | - | 4/24hrs | 50 | 1 |
| Linozap | 5 | .75 | 6/4 days | 350 | 2 |
| Personal Body Alarm | - | - | on payment | varies | - |
| See Through Paper Spray | - | - | always | 15 | 1 |
| Surveillance Kit | - | 6.5 | 6/5days | 98000 | 2 |
| Synthetic Print Duplication | - | - | 4/12hrs | 500 | 1 |
| ThunderArc Automapper | 7 | .5 | 6/48hrs | 600 | 1 |
| Ultrasound Detector | 8 | .2 | 8/48hrs | 1500 | 1.5 |
| Linear Beam Commlink | - | - | 6/72hrs | 2000 | 2.5 |
| Chemsuit Lv 1 | - | 1 | 1/1days | 200 | 1 |
| Chemsuit Lv 2 | - | 1 | 2/2days | 400 | 1 |
| Chemsuit Lv 3 | - | 1 | 3/3days | 600 | 1 |
| Chemsuit Lv 4 | - | 1 | 4/4days | 800 | 1 |
| Chemsuit Lv 5 | - | 1 | 5/5days | 1000 | 1 |
| Chemsuit Lv 6 | - | 1 | 6/6days | 1200 | 1 |
| Chemsuit Lv 7 | - | 1 | 7/7days | 1400 | 1 |
| Chemsuit Lv 8 | - | 1 | 8/8days | 1600 | 1 |
| Chemsuit Lv 9 | - | 1 | 9/9days | 1800 | 1 |
| Chemsuit Lv 10 | - | 1 | 10/10days | 2000 | 1 |
| Pressure Regulator | - | .5 | 6/48hrs | 250 | 2 |
| Ration Bars (10 Days) | - | 1 | 2/48hrs | 30 | 1 |
| Respirator | - | 1 | 4/48hrs | 500 | 2 |
| Survival Kit | - | 2 | 2/48hrs | 100 | 1 |
| Ascent | - | .25 | always | 75 | 1 |
| Ascent | - | 2 | always | 250 | 1 |
| Everest Grapple Line | - | 3 | always | 240 | 1 |
| Grapple Gun | 7 | 2.25 | always | 450 | 1 |
| Normal Line (100 meters) | - | 2 | always | 50 | 1 |
| Rappelling Gear | - | 5 | always | 250 | 1 |
| Rappelling Gloves | - | - | always | 70 | 1 |
| Rope (50 meters) | - | 1 | always | 125 | 1 |
| Stealth Line (100 meters) | - | 3 | always | 85 | 1 |
| Stealth Line Catalyst Stick | - | - | always | 120 | 1 |
| General Kit | 3 | 5 | 5/48hrs | 500 | 2 |
| Vehicle Kit | 3 | 5 | 5/48hrs | 1000 | 2 |
| Electronic ToolKit | 3 | 5 | 5/48hrs | 1500 | 2 |
| Computer ToolKit | 3 | 5 | 5/48hrs | 1500 | 2 |
| Cyberware ToolKit | 3 | 5 | 5/48hrs | 1500 | 2 |
| General Shop | - | - | 8/72hrs | 5000 | 3 |
| Vehicle Shop | - | - | 8/72hrs | 10000 | 3 |
| Electronic Shop | - | - | 8/72hrs | 15000 | 3 |
| Computer Shop | - | - | 8/72hrs | 15000 | 3 |
| Cyberware Shop | - | - | 8/72hrs | 15000 | 3 |
| General Facility | - | - | 14/7days | 100000 | 4 |
| Vehicle Facility | - | - | 14/7days | 200000 | 4 |
| Electronic Facility | - | - | 14/7days | 300000 | 4 |
| Computer Facility | - | - | 14/7days | 300000 | 4 |
| Cyberware Facility | - | - | 14/7days | 300000 | 4 |

### Cyberdecks
| Name | Persona | Hardening | Memory | Storage | Load | I/O | Availability | Cost | Street Index |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Radio Shack PCD-100 | 2 | 0 | 10 | 50 | 5 | 1 | 4/7days | 6800 | 1 |
| Allegiance Alpha | 3 | 1 | 10 | 50 | 5 | 1 | 4/7days | 12600 | 1 |
| Sony CTY-360 | 6 | 3 | 50 | 100 | 20 | 10 | 4/7days | 99400 | 1 |
| Fuchi Cyber-4 | 6 | 3 | 100 | 500 | 20 | 20 | 4/7days | 121400 | 1 |
| Fuchi Cyber-6 | 8 | 4 | 100 | 500 | 50 | 30 | 6/7days | 334500 | 1 |
| Fuchi Cyber-7 | 10 | 4 | 200 | 1000 | 50 | 40 | 10/7days | 1112100 | 1 |
| Fairlight Excalibur | 12 | 5 | 500 | 1000 | 100 | 50 | 22/7days | 5529600 | 1 |

### Cyberdeck Other
| Name | Availability | Cost | Street Index |
| --- | --- | --- | --- |
| Off-line Store 100 Mp | 2/24hrs | 100 | 1 |
| Off-line Store 200 Mp | 2/24hrs | 200 | 1 |
| Off-line Store 300 Mp | 2/24hrs | 300 | 1 |
| Off-line Store 400 Mp | 2/24hrs | 400 | 1 |
| Off-line Store 500 Mp | 2/24hrs | 500 | 1 |
| CybDeck | 6/48hrs | 25000 | 1 |
| CybDeck | 8/72hrs | 100000 | 2 |
| CybDeck | 12/7days | 250000 | 2 |
| Hitcher Jack | 2/48hrs | 1000 | 1 |
| Vidscreen Display | 2/24hrs | 500 | 1 |
| Bod Rating 1 | 3/7days | 300 | 1 |
| Bod Rating 2 | 3/7days | 1200 | 1 |
| Bod Rating 3 | 3/7days | 2700 | 1 |
| Bod Rating 4 | 6/7days | 24000 | 1.5 |
| Bod Rating 5 | 6/7days | 37500 | 1.5 |
| Bod Rating 6 | 6/7days | 54000 | 1.5 |
| Bod Rating 7 | 12/14days | 147000 | 2 |
| Bod Rating 8 | 12/14days | 192000 | 2 |
| Bod Rating 9 | 12/14days | 243000 | 2 |
| Bod Rating 10 | 24/30days | 1500000 | 3 |
| Evasion Rating 1 | 3/7days | 300 | 1 |
| Evasion Rating 2 | 3/7days | 1200 | 1 |
| Evasion Rating 3 | 3/7days | 2700 | 1 |
| Evasion Rating 4 | 6/7days | 24000 | 1.5 |
| Evasion Rating 5 | 6/7days | 37500 | 1.5 |
| Evasion Rating 6 | 6/7days | 54000 | 1.5 |
| Evasion Rating 7 | 12/14days | 147000 | 2 |
| Evasion Rating 8 | 12/14days | 192000 | 2 |
| Evasion Rating 9 | 12/14days | 243000 | 2 |
| Evasion Rating 10 | 24/30days | 1500000 | 3 |
| Masking Rating 1 | 3/7days | 200 | 1 |
| Masking Rating 2 | 3/7days | 800 | 1 |
| Masking Rating 3 | 3/7days | 1800 | 1 |
| Masking Rating 4 | 6/7days | 16000 | 1.5 |
| Masking Rating 5 | 6/7days | 25000 | 1.5 |
| Masking Rating 6 | 6/7days | 36000 | 1.5 |
| Masking Rating 7 | 12/14days | 98000 | 2 |
| Masking Rating 8 | 12/14days | 128000 | 2 |
| Masking Rating 9 | 12/14days | 162000 | 2 |
| Masking Rating 10 | 24/30days | 1000000 | 3 |
| Sensors Rating 1 | 3/7days | 200 | 1 |
| Sensors Rating 2 | 3/7days | 800 | 1 |
| Sensors Rating 3 | 3/7days | 1800 | 1 |
| Sensors Rating 4 | 6/7days | 16000 | 1.5 |
| Sensors Rating 5 | 6/7days | 25000 | 1.5 |
| Sensors Rating 6 | 6/7days | 36000 | 1.5 |
| Sensors Rating 7 | 12/14days | 98000 | 2 |
| Sensors Rating 8 | 12/14days | 128000 | 2 |
| Sensors Rating 9 | 12/14days | 162000 | 2 |
| Sensors Rating 10 | 24/30days | 1000000 | 3 |
| Analyse Rating 1 | 2/7days | 300 | 1 |
| Analyse Rating 2 | 2/7days | 1200 | 1 |
| Analyse Rating 3 | 2/7days | 2700 | 1 |
| Analyse Rating 4 | 4/7days | 24000 | 1.5 |
| Analyse Rating 5 | 4/7days | 37500 | 1.5 |
| Analyse Rating 6 | 4/7days | 54000 | 1.5 |
| Analyse Rating 7 | 8/14days | 147000 | 2 |
| Analyse Rating 8 | 8/14days | 192000 | 2 |
| Analyse Rating 9 | 8/14days | 243000 | 2 |
| Analyse Rating 10 | 16/100days | 1500000 | 3 |
| Armor Rating 1 | 2/7days | 300 | 1 |
| Armor Rating 2 | 2/7days | 1200 | 1 |
| Armor Rating 3 | 2/7days | 2700 | 1 |
| Armor Rating 4 | 4/7days | 24000 | 1.5 |
| Armor Rating 5 | 4/7days | 37500 | 1.5 |
| Armor Rating 6 | 4/7days | 54000 | 1.5 |
| Armor Rating 7 | 8/14days | 147000 | 2 |
| Armor Rating 8 | 8/14days | 192000 | 2 |
| Armor Rating 9 | 8/14days | 243000 | 2 |
| Armor Rating 10 | 16/100days | 1500000 | 3 |
| Attack Rating 1 | 3/7days | 200 | 1 |
| Attack Rating 2 | 3/7days | 800 | 1 |
| Attack Rating 3 | 3/7days | 1800 | 1 |
| Attack Rating 4 | 6/7days | 16000 | 1.5 |
| Attack Rating 5 | 6/7days | 25000 | 1.5 |
| Attack Rating 6 | 6/7days | 36000 | 1.5 |
| Attack Rating 7 | 12/14days | 98000 | 2 |
| Attack Rating 8 | 12/14days | 128000 | 2 |
| Attack Rating 9 | 12/14days | 162000 | 2 |
| Attack Rating 10 | 24/30days | 1000000 | 3 |
| Blind Rating 1 | 2/7days | 300 | 1 |
| Blind Rating 2 | 2/7days | 1200 | 1 |
| Blind Rating 3 | 2/7days | 2700 | 1 |
| Blind Rating 4 | 4/7days | 24000 | 1.5 |
| Blind Rating 5 | 4/7days | 37500 | 1.5 |
| Blind Rating 6 | 4/7days | 54000 | 1.5 |
| Blind Rating 7 | 8/14days | 147000 | 2 |
| Blind Rating 8 | 8/14days | 192000 | 2 |
| Blind Rating 9 | 8/14days | 243000 | 2 |
| Blind Rating 10 | 16/100days | 1500000 | 3 |
| Browse Rating 1 | 3/7days | 100 | 1 |
| Browse Rating 2 | 3/7days | 400 | 1 |
| Browse Rating 3 | 3/7days | 900 | 1 |
| Browse Rating 4 | 6/7days | 8000 | 1.5 |
| Browse Rating 5 | 6/7days | 12500 | 1.5 |
| Browse Rating 6 | 6/7days | 18000 | 1.5 |
| Browse Rating 7 | 12/14days | 49000 | 2 |
| Browse Rating 8 | 12/14days | 64000 | 2 |
| Browse Rating 9 | 12/14days | 81000 | 2 |
| Browse Rating 10 | 24/30days | 500000 | 3 |
| Cloak Rating 1 | 2/7days | 300 | 1 |
| Cloak Rating 2 | 2/7days | 1200 | 1 |
| Cloak Rating 3 | 2/7days | 2700 | 1 |
| Cloak Rating 4 | 4/7days | 24000 | 1.5 |
| Cloak Rating 5 | 4/7days | 37500 | 1.5 |
| Cloak Rating 6 | 4/7days | 54000 | 1.5 |
| Cloak Rating 7 | 8/14days | 147000 | 2 |
| Cloak Rating 8 | 8/14days | 192000 | 2 |
| Cloak Rating 9 | 8/14days | 243000 | 2 |
| Cloak Rating 10 | 16/100days | 1500000 | 3 |
| Compressor Rating 1 | 3/7days | 200 | 1 |
| Compressor Rating 2 | 3/7days | 800 | 1 |
| Compressor Rating 3 | 3/7days | 1800 | 1 |
| Compressor Rating 4 | 6/7days | 16000 | 1.5 |
| Compressor Rating 5 | 6/7days | 25000 | 1.5 |
| Compressor Rating 6 | 6/7days | 36000 | 1.5 |
| Compressor Rating 7 | 12/14days | 98000 | 2 |
| Compressor Rating 8 | 12/14days | 128000 | 2 |
| Compressor Rating 9 | 12/14days | 162000 | 2 |
| Compressor Rating 10 | 24/30days | 1000000 | 3 |
| Controller Rating 1 | 3/7days | 400 | 1 |
| Controller Rating 2 | 3/7days | 1600 | 1 |
| Controller Rating 3 | 3/7days | 3600 | 1 |
| Controller Rating 4 | 6/7days | 32000 | 1.5 |
| Controller Rating 5 | 6/7days | 50000 | 1.5 |
| Controller Rating 6 | 6/7days | 72000 | 1.5 |
| Controller Rating 7 | 12/14days | 196000 | 2 |
| Controller Rating 8 | 12/14days | 256000 | 2 |
| Controller Rating 9 | 12/14days | 324000 | 2 |
| Controller Rating 10 | 24/30days | 2000000 | 3 |
| Deception Rating 1 | 3/7days | 200 | 1 |
| Deception Rating 2 | 3/7days | 800 | 1 |
| Deception Rating 3 | 3/7days | 1800 | 1 |
| Deception Rating 4 | 6/7days | 16000 | 1.5 |
| Deception Rating 5 | 6/7days | 25000 | 1.5 |
| Deception Rating 6 | 6/7days | 36000 | 1.5 |
| Deception Rating 7 | 12/14days | 98000 | 2 |
| Deception Rating 8 | 12/14days | 128000 | 2 |
| Deception Rating 9 | 12/14days | 162000 | 2 |
| Deception Rating 10 | 24/30days | 1000000 | 3 |
| Decrypt Rating 1 | 3/7days | 200 | 1 |
| Decrypt Rating 2 | 3/7days | 800 | 1 |
| Decrypt Rating 3 | 3/7days | 1800 | 1 |
| Decrypt Rating 4 | 6/7days | 16000 | 1.5 |
| Decrypt Rating 5 | 6/7days | 25000 | 1.5 |
| Decrypt Rating 6 | 6/7days | 36000 | 1.5 |
| Decrypt Rating 7 | 12/14days | 98000 | 2 |
| Decrypt Rating 8 | 12/14days | 128000 | 2 |
| Decrypt Rating 9 | 12/14days | 162000 | 2 |
| Decrypt Rating 10 | 24/30days | 1000000 | 3 |
| Evaluate Rating 1 | 3/7days | 200 | 1 |
| Evaluate Rating 2 | 3/7days | 800 | 1 |
| Evaluate Rating 3 | 3/7days | 1800 | 1 |
| Evaluate Rating 4 | 6/7days | 16000 | 1.5 |
| Evaluate Rating 5 | 6/7days | 25000 | 1.5 |
| Evaluate Rating 6 | 6/7days | 36000 | 1.5 |
| Evaluate Rating 7 | 12/14days | 98000 | 2 |
| Evaluate Rating 8 | 12/14days | 128000 | 2 |
| Evaluate Rating 9 | 12/14days | 162000 | 2 |
| Evaluate Rating 10 | 24/30days | 1000000 | 3 |
| Hog Rating 1 | 2/7days | 300 | 1 |
| Hog Rating 2 | 2/7days | 1200 | 1 |
| Hog Rating 3 | 2/7days | 2700 | 1 |
| Hog Rating 4 | 4/7days | 24000 | 1.5 |
| Hog Rating 5 | 4/7days | 37500 | 1.5 |
| Hog Rating 6 | 4/7days | 54000 | 1.5 |
| Hog Rating 7 | 8/14days | 147000 | 2 |
| Hog Rating 8 | 8/14days | 192000 | 2 |
| Hog Rating 9 | 8/14days | 243000 | 2 |
| Hog Rating 10 | 16/100days | 1500000 | 3 |
| Medic Rating 1 | 3/7days | 400 | 1 |
| Medic Rating 2 | 3/7days | 1600 | 1 |
| Medic Rating 3 | 3/7days | 3600 | 1 |
| Medic Rating 4 | 6/7days | 32000 | 1.5 |
| Medic Rating 5 | 6/7days | 50000 | 1.5 |
| Medic Rating 6 | 6/7days | 72000 | 1.5 |
| Medic Rating 7 | 12/14days | 196000 | 2 |
| Medic Rating 8 | 12/14days | 256000 | 2 |
| Medic Rating 9 | 12/14days | 324000 | 2 |
| Medic Rating 10 | 24/30days | 2000000 | 3 |
| Mirror Rating 1 | 2/7days | 300 | 1 |
| Mirror Rating 2 | 2/7days | 1200 | 1 |
| Mirror Rating 3 | 2/7days | 2700 | 1 |
| Mirror Rating 4 | 4/7days | 24000 | 1.5 |
| Mirror Rating 5 | 4/7days | 37500 | 1.5 |
| Mirror Rating 6 | 4/7days | 54000 | 1.5 |
| Mirror Rating 7 | 8/14days | 147000 | 2 |
| Mirror Rating 8 | 8/14days | 192000 | 2 |
| Mirror Rating 9 | 8/14days | 243000 | 2 |
| Mirror Rating 10 | 16/100days | 1500000 | 3 |
| Poison Rating 1 | 2/7days | 300 | 1 |
| Poison Rating 2 | 2/7days | 1200 | 1 |
| Poison Rating 3 | 2/7days | 2700 | 1 |
| Poison Rating 4 | 4/7days | 24000 | 1.5 |
| Poison Rating 5 | 4/7days | 37500 | 1.5 |
| Poison Rating 6 | 4/7days | 54000 | 1.5 |
| Poison Rating 7 | 8/14days | 147000 | 2 |
| Poison Rating 8 | 8/14days | 192000 | 2 |
| Poison Rating 9 | 8/14days | 243000 | 2 |
| Poison Rating 10 | 16/100days | 1500000 | 3 |
| Relocate Rating 1 | 3/7days | 200 | 1 |
| Relocate Rating 2 | 3/7days | 800 | 1 |
| Relocate Rating 3 | 3/7days | 1800 | 1 |
| Relocate Rating 4 | 6/7days | 16000 | 1.5 |
| Relocate Rating 5 | 6/7days | 25000 | 1.5 |
| Relocate Rating 6 | 6/7days | 36000 | 1.5 |
| Relocate Rating 7 | 12/14days | 98000 | 2 |
| Relocate Rating 8 | 12/14days | 128000 | 2 |
| Relocate Rating 9 | 12/14days | 162000 | 2 |
| Relocate Rating 10 | 24/30days | 1000000 | 3 |
| Restore Rating 1 | 2/7days | 300 | 1 |
| Restore Rating 2 | 2/7days | 1200 | 1 |
| Restore Rating 3 | 2/7days | 2700 | 1 |
| Restore Rating 4 | 4/7days | 24000 | 1.5 |
| Restore Rating 5 | 4/7days | 37500 | 1.5 |
| Restore Rating 6 | 4/7days | 54000 | 1.5 |
| Restore Rating 7 | 8/14days | 147000 | 2 |
| Restore Rating 8 | 8/14days | 192000 | 2 |
| Restore Rating 9 | 8/14days | 243000 | 2 |
| Restore Rating 10 | 16/100days | 1500000 | 3 |
| Restrict Rating 1 | 2/7days | 300 | 1 |
| Restrict Rating 2 | 2/7days | 1200 | 1 |
| Restrict Rating 3 | 2/7days | 2700 | 1 |
| Restrict Rating 4 | 4/7days | 24000 | 1.5 |
| Restrict Rating 5 | 4/7days | 37500 | 1.5 |
| Restrict Rating 6 | 4/7days | 54000 | 1.5 |
| Restrict Rating 7 | 8/14days | 147000 | 2 |
| Restrict Rating 8 | 8/14days | 192000 | 2 |
| Restrict Rating 9 | 8/14days | 243000 | 2 |
| Restrict Rating 10 | 16/100days | 1500000 | 3 |
| Reveal Rating 1 | 2/7days | 300 | 1 |
| Reveal Rating 2 | 2/7days | 1200 | 1 |
| Reveal Rating 3 | 2/7days | 2700 | 1 |
| Reveal Rating 4 | 4/7days | 24000 | 1.5 |
| Reveal Rating 5 | 4/7days | 37500 | 1.5 |
| Reveal Rating 6 | 4/7days | 54000 | 1.5 |
| Reveal Rating 7 | 8/14days | 147000 | 2 |
| Reveal Rating 8 | 8/14days | 192000 | 2 |
| Reveal Rating 9 | 8/14days | 243000 | 2 |
| Reveal Rating 10 | 16/100days | 1500000 | 3 |
| Scanner Rating 1 | 2/7days | 300 | 1 |
| Scanner Rating 2 | 2/7days | 1200 | 1 |
| Scanner Rating 3 | 2/7days | 2700 | 1 |
| Scanner Rating 4 | 4/7days | 24000 | 1.5 |
| Scanner Rating 5 | 4/7days | 37500 | 1.5 |
| Scanner Rating 6 | 4/7days | 54000 | 1.5 |
| Scanner Rating 7 | 8/14days | 147000 | 2 |
| Scanner Rating 8 | 8/14days | 192000 | 2 |
| Scanner Rating 9 | 8/14days | 243000 | 2 |
| Scanner Rating 10 | 16/100days | 1500000 | 3 |
| Shield Rating 1 | 3/7days | 400 | 1 |
| Shield Rating 2 | 3/7days | 1600 | 1 |
| Shield Rating 3 | 3/7days | 3600 | 1 |
| Shield Rating 4 | 6/7days | 32000 | 1.5 |
| Shield Rating 5 | 6/7days | 50000 | 1.5 |
| Shield Rating 6 | 6/7days | 72000 | 1.5 |
| Shield Rating 7 | 12/14days | 196000 | 2 |
| Shield Rating 8 | 12/14days | 256000 | 2 |
| Shield Rating 9 | 12/14days | 324000 | 2 |
| Shield Rating 10 | 24/30days | 2000000 | 3 |
| Sift Rating 1 | 3/7days | 100 | 1 |
| Sift Rating 2 | 3/7days | 400 | 1 |
| Sift Rating 3 | 3/7days | 900 | 1 |
| Sift Rating 4 | 6/7days | 8000 | 1.5 |
| Sift Rating 5 | 6/7days | 12500 | 1.5 |
| Sift Rating 6 | 6/7days | 18000 | 1.5 |
| Sift Rating 7 | 12/14days | 49000 | 2 |
| Sift Rating 8 | 12/14days | 64000 | 2 |
| Sift Rating 9 | 12/14days | 81000 | 2 |
| Sift Rating 10 | 24/30days | 500000 | 3 |
| Sleaze Rating 1 | 2/7days | 300 | 1 |
| Sleaze Rating 2 | 2/7days | 1200 | 1 |
| Sleaze Rating 3 | 2/7days | 2700 | 1 |
| Sleaze Rating 4 | 4/7days | 24000 | 1.5 |
| Sleaze Rating 5 | 4/7days | 37500 | 1.5 |
| Sleaze Rating 6 | 4/7days | 54000 | 1.5 |
| Sleaze Rating 7 | 8/14days | 147000 | 2 |
| Sleaze Rating 8 | 8/14days | 192000 | 2 |
| Sleaze Rating 9 | 8/14days | 243000 | 2 |
| Sleaze Rating 10 | 16/100days | 1500000 | 3 |
| Slow Rating 1 | 3/7days | 400 | 1 |
| Slow Rating 2 | 3/7days | 1600 | 1 |
| Slow Rating 3 | 3/7days | 3600 | 1 |
| Slow Rating 4 | 6/7days | 32000 | 1.5 |
| Slow Rating 5 | 6/7days | 50000 | 1.5 |
| Slow Rating 6 | 6/7days | 72000 | 1.5 |
| Slow Rating 7 | 12/14days | 196000 | 2 |
| Slow Rating 8 | 12/14days | 256000 | 2 |
| Slow Rating 9 | 12/14days | 324000 | 2 |
| Slow Rating 10 | 24/30days | 2000000 | 3 |
| Smoke Rating 1 | 3/7days | 200 | 1 |
| Smoke Rating 2 | 3/7days | 800 | 1 |
| Smoke Rating 3 | 3/7days | 1800 | 1 |
| Smoke Rating 4 | 6/7days | 16000 | 1.5 |
| Smoke Rating 5 | 6/7days | 25000 | 1.5 |
| Smoke Rating 6 | 6/7days | 36000 | 1.5 |
| Smoke Rating 7 | 12/14days | 98000 | 2 |
| Smoke Rating 8 | 12/14days | 128000 | 2 |
| Smoke Rating 9 | 12/14days | 162000 | 2 |
| Smoke Rating 10 | 24/30days | 1000000 | 3 |

### Biotech
| Name | Rating | Availability | Weight | Cost | Street Index |
| --- | --- | --- | --- | --- | --- |
| Archaesthetic | -1 | 1 | 6/7days | 10000 | 4 |
| Cybercast | +2 | 1.5 | 3/12hrs | 3000 | 2 |
| Medkit | 3 | 2/24hrs | 3 | 200 | 1.5 |
| Medkit Supplies | - | 2/24hrs | - | 50 | 1.5 |
| Portable Intern Unit | 1 | 2 | 3/24hrs | 120 | 1.5 |
| RapiDetox | - | 5 | 5/4days | 1500 | 3 |
| Stabilization Unit | 2 | 12/1mth | 30 | 10000 | 3 |
| Stabilization Unit Deluxe | 6 | 16/1mth | 35 | 20000 | 3 |
| DocWagon | - | On Payment | - | 5000 | - |
| DocWagon | - | On Payment | - | 25000 | - |
| DocWagon | - | On Payment | - | 50000 | - |
| Antidote Patch 1 | 1 | 6/72hrs | - | 50 | 2 |
| Antidote Patch 2 | 2 | 6/72hrs | - | 100 | 2 |
| Antidote Patch 3 | 3 | 6/72hrs | - | 150 | 2 |
| Antidote Patch 4 | 4 | 6/72hrs | - | 200 | 2 |
| Antidote Patch 5 | 5 | 6/72hrs | - | 250 | 2 |
| Antidote Patch 6 | 6 | 6/72hrs | - | 300 | 2 |
| Antidote Patch 7 | 7 | 6/72hrs | - | 350 | 2 |
| Antidote Patch 8 | 8 | 6/72hrs | - | 400 | 2 |
| Stimulant Patch 1 | 1 | 2/24hrs | - | 25 | 1 |
| Stimulant Patch 2 | 2 | 2/24hrs | - | 50 | 1 |
| Stimulant Patch 3 | 3 | 2/24hrs | - | 75 | 1 |
| Stimulant Patch 4 | 4 | 2/24hrs | - | 100 | 1 |
| Stimulant Patch 5 | 5 | 2/24hrs | - | 125 | 1 |
| Stimulant Patch 6 | 6 | 2/24hrs | - | 150 | 1 |
| Tranq Patch 1 | 1 | 4/48hrs | - | 20 | 2 |
| Tranq Patch 2 | 2 | 4/48hrs | - | 40 | 2 |
| Tranq Patch 3 | 3 | 4/48hrs | - | 60 | 2 |
| Tranq Patch 4 | 4 | 4/48hrs | - | 80 | 2 |
| Tranq Patch 5 | 5 | 4/48hrs | - | 100 | 2 |
| Tranq Patch 6 | 6 | 4/48hrs | - | 120 | 2 |
| Tranq Patch 7 | 7 | 4/48hrs | - | 140 | 2 |
| Tranq Patch 8 | 8 | 4/48hrs | - | 160 | 2 |
| Tranq Patch 9 | 9 | 4/48hrs | - | 180 | 2 |
| Tranq Patch 10 | 10 | 4/48hrs | - | 200 | 2 |
| Trauma Patch | - | 4/48hrs | - | 500 | 4 |
| Antibac Level 1 | - | 4/48hrs | - | 500 | 1 |
| Antibac Level 2 | - | 4/48hrs | - | 500 | 1 |
| Antibac Level 3 | - | 4/48hrs | - | 500 | 1 |
| Antibac Level 4 | - | 4/48hrs | - | 1000 | 1 |
| Antibac Level 5 | - | 4/48hrs | - | 1000 | 1 |
| Antibac Level 6 | - | 4/48hrs | - | 1000 | 1 |
| Antibac Level 7 | - | 4/48hrs | - | 1500 | 1 |
| Antibac Level 8 | - | 4/48hrs | - | 1500 | 1 |
| Antibac Level 9 | - | 4/48hrs | - | 1500 | 1 |
| Antibac Level 10 | - | 4/48hrs | - | 2500 | 1 |
| Binder 1 | - | 4/32hrs | - | 300 | 1 |
| Binder 2 | - | 4/32hrs | - | 300 | 1 |
| Binder 3 | - | 4/32hrs | - | 300 | 1 |
| Binder 4 | - | 4/32hrs | - | 600 | 1 |
| Binder 5 | - | 4/32hrs | - | 600 | 1 |
| Binder 6 | - | 4/32hrs | - | 600 | 1 |
| Binder 7 | - | 4/32hrs | - | 900 | 1 |
| Binder 8 | - | 4/32hrs | - | 900 | 1 |
| Binder 9 | - | 4/32hrs | - | 900 | 1 |
| Binder 10 | - | 4/32hrs | - | 1500 | 1 |
| ACTH (6 doses) | - | 5/12hrs | - | 100 | 1 |
| Atropine (1 dose) | - | 5/12hrs | - | 600 | 1 |
| Carcerands | - | 4/10days | - | see Text | 2 |
| Corrosive Compound 1 | 4 | 5/48hrs | 1000 | 2 |  |
| Corrosive Compound 4 | 4 | 8/7days | 4000 | 4 |  |
| Cyanide (1 dose) | - | 3/48hrs | - | 360 | .5 |
| Dikote TM (100 cm^3) | - | 6/14days | - | 1000 | 10 |
| DMSO (1 dose) | - | 2/12hrs | - | 10 | 1.5 |
| Hyper (1 dose) | - | 4/24hrs | - | 180 | .9 |
| MAO (1 dose) | - | 5/36hrs | - | 280 | 2 |
| MAO Inhibitors (1 dose) | - | ? | 60 | 2.5 |  |
| Oxygenated Fluorocarbons | - | 4/48hrs | - | 750 | 1 |
| Ruthenium Polymers (1 m^3) | - | 5/14days | - | 10000 | 7.5 |
| Doom (1 dose) | - | 14/30days | - | 500 | 5 |
| Gamma-Anthrax (1 dose) | - | 14/30days | - | 180 | 6 |
| Myco-Protein | - | always | - | 25 | 1 |
| Gene Cleansing | - | 6/30days | - | 50000 | 2.5 |
| Genetic Correction | - | 6/30days | - | 60000 | 2.5 |
| Gene Reconstruct | - | 6/30days | - | 100000 | 2.5 |
| Other Gene Therapy | - | 6/30days | - | 50000 | 2.5 |
| Leonization | - | 6/30days | 2000000 | 2.5 |  |
| Single Immunization | - | 6/20days | - | 40000 | 2 |
| Full Spectrum Immunization | - | 6/20days | - | 300000 | 2 |
| Zeta-Interpheron 1 | - | 4/32hrs | - | 400 | 2 |
| Zeta-Interpheron 2 | - | 4/32hrs | - | 400 | 2 |
| Zeta-Interpheron 3 | - | 4/32hrs | - | 400 | 2 |
| Zeta-Interpheron 4 | - | 4/32hrs | - | 800 | 2 |
| Zeta-Interpheron 5 | - | 4/32hrs | - | 800 | 2 |
| Zeta-Interpheron 6 | - | 4/32hrs | - | 800 | 2 |
| Zeta-Interpheron 7 | - | 4/32hrs | - | 1200 | 2 |
| Zeta-Interpheron 8 | - | 4/32hrs | - | 1200 | 2 |
| Zeta-Interpheron 9 | - | 4/32hrs | - | 1200 | 2 |
| Zeta-Interpheron 10 | - | 4/32hrs | - | 2000 | 2 |

### Lifestyle
- Lifestyle covers day-to-day living expenses (shelter, food, entertainment, clothing, etc.), not weapons/tech/magic gear/professional hirelings.
- Costs are monthly (except Street is free; Hospitalized is daily).
- Hospitalized lifestyle (while sick/injured) can’t be “owned”; it’s paid as needed:
  - Basic care: **500¥/day**
  - Intensive care: **1,000¥/day**
- Middle lifestyle (or higher) can support guests:
  - Pay **+10%** of your own lifestyle cost per guest.
  - You can host someone at a lower lifestyle by paying **10%** of that lower lifestyle cost per guest.
  - Servants are often maintained this way (GM adjudication).

#### Keeping up payments (missed months)
- Lifestyle is paid monthly.
- Each month a character misses a payment, roll **1D6**:
  - If the result is **greater than** the number of consecutive months missed, the missed payment is absorbed by credit (no immediate effect).
  - If the result is **≤** the number of months missed:
    - Lifestyle is downgraded one step.
    - The character owes someone **one month** of the former lifestyle’s cost (debt).

#### Permanent lifestyles (optional)
- A character can buy a permanent lifestyle by paying **100 months** of upkeep (lump sum).
  - A permanent lifestyle can still be lost due to events (GM adjudication).
- A permanent lifestyle of **Middle or better** can be sold:
  - If the character has time to broker a legitimate sale: roll **2D6 × 10%** to determine the percent of the purchase price they receive.
  - If the character lacks a SIN, must dump it fast, or must sell through an agent: roll **1D6 × 10%** instead.

| Name | Concealability | Weight | Availability | Cost | Street Index |
| --- | --- | --- | --- | --- | --- |
| Street Lifestyle |  |  |  | 0 |  |
| Squatter Lifestyle |  |  |  | 100 |  |
| Lower Lifestyle |  |  |  | 1000 |  |
| Middle Lifestyle |  |  |  | 5000 |  |
| High Lifestyle |  |  |  | 10000 |  |
| Luxury Lifestyle |  |  |  | 100000 |  |

### Lifestyle Extras
| Name | Concealability | Weight | Availability | Cost | Street Index |
| --- | --- | --- | --- | --- | --- |
| Armament Briefcase (armor 0 | - | 1.5 | 4/36hrs | 500 | 2 |
| Armament Computer Case | - | 1.5 | 4/36hrs | 450 | 2 |
| Armament Guitar Case | - | 3.5 | 5/36hrs | 700 | 2 |
| Armament Keyboard Case | - | 3 | 6/36hrs | 700 | 2 |
| Armament Large Suitcase | - | 3 | 6/36hrs | 600 | 2 |
| Armament Small Suitcase | - | 2.5 | 5/36hrs | 500 | 2 |
| Armament Tool Case | - | 1 | 4/36hrs | 400 | 2 |
| Armament Violin Case | - | 2 | 6/36hrs | 650 | 2 |
| IEC Domitic System (per m | - | - | 2/48hrs | 2D6x50 | - |
| Autotanner | 3 | 1 | always | 200 | .9 |
| Bar-In-A-Briefcase | 3 | 5 | 6/36hrs | 100 | .75 |
| Biotech Nutrisupplement | - | .5 | always | 10 | .8 |
| Biotech Nymph Perfume | - | - | always | 200 | .9 |
| Boyo Bodyfree Masks | 8 | - | - | 600 | 1 |
| DDI PrayerWare | 7 | - | on payment | 120 | - |
| Everest Climbing Spikes | 3 | - | 2/24hrs | 75 | 1 |
| Flavored Cigarettes | - | - | always | 2 | .8 |
| Flare Compensation Sunglasses | 12 | .1 | 5/24hrs | 2000 | 1.5 |
| Folding Pocket Binoculars | 8 | - | always | 50 | 1 |
| Shower-In-A-Can | 8 | .5 | 2/12hrs | 3 | 1 |
| Skunker | 7 | .25 | 5/60hrs | 70 | 1.3 |
| Slosh Bag | 2 | 2 | 4/72hrs | 65 | 1 |
| Smartgun Sunglasses | 12 | .1 | 4/24hrs | 1950 | 1 |
| Swiss Army Knife | - | - | always | 30 | 1 |
| Thermographic Sunglasses | 12 | .1 | 4/24hrs | 2600 | 1.25 |
| Temperfoam Furniture | - | varies | 2/24hrs | 140 | .5 |
| Travel Kit | 3 | 5 | always | 500 | 1 |
| Wonders | - | - | 4/60hrs | 500 | 2 |
| Mindscape Cyberholo Art Imager | - | - | always | 6000 | 1 |
| Newsviewer | 4 | .1 | 3/36hrs | 100 | 1 |
| Desktop Holotank | - | 15 | 4/48hrs | 1000 | 1.2 |
| Holotank | - | 100 | 5/48hrs | 5000 | 1.2 |
| Tabletop Holotank | - | 5 | 4/48hrs | 500 | 1.2 |
| Music | 8 | - | Always | 20 | .75 |
| Music | 3 | 2 | Always | 200 | .75 |
| Music | - | - | Always | 100 | .75 |
| DPI Black Box Backup Synthamp | 4 | 3 | 6/48hrs | 8000 | 1.3 |
| DPI Black Box Datachips | - | - | 6/48hrs | 100 | 1.3 |
| DPI Body Rythm Dance Bracelets | - | - | always | 400 | 1 |
| DPI Drumsticks | 4 | .25 | 3/36hrs | 800 | 1 |
| Washburn Soundmachine Guitar | - | 3.5 | 5/60hrs | 1000 | 1 |
| Yamaha RX4000 Ultrasynth | - | - | always | 9380 | 1 |
| Basic Rush System | 3 | 4.5 | always | 500 | .8 |
| Rush Multi-player Adaptor | - | - | always | 100 | .6 |
| Rush Total Environment | - | .75 | always | 1000 | .8 |
| Video Wall | - | 5 | always | 3500 | 1 |
| Rush Virtual Villains | - | - | always | 150 | .9 |
| Simsense Player Unit | 3 | 3 | always | 350 | .75 |
| Simsense Program Chip | 8 | - | always | 50 | .75 |
| Simsense Portable Recorder | - | 5 | 7/7days | 50000 | 2 |
| Fuchi Dreamliner | 2 | 5.5 | always | 2500 | 1 |
| Fuchi RealSense MasterSim | - | 12 | 8/1week | 125000 | 3 |
| Sony Beautiful Dreamer | 3 | 3 | always | 200 | 1 |
| Sony Beautiful Dreamer II | 2 | 5 | always | 1800 | 1 |
| Truman Dreambox | 3 | 3 | always | 350 | .75 |
| Truman Paradiso | - | 6 | 4/36hrs | 75000 | 1 |
| Cheap Baseline ACT Recording | 10 | - | always | 1 | .75 |
| Average Baseline ACT Recording | 10 | - | always | 3 | .75 |
| High-Quality Baseline ACT Rec. | 10 | - | always | 2.5 | .75 |
| Current Hit Baseline ACT Rec. | 10 | - | always | 3 | .75 |
| Average Baseline Dir-X Rec. | 10 | - | always | 90 | .75 |
| HighQuality Baseline Dir-X Rec | 10 | - | always | 100 | .75 |
| Current Hit Baseline Dir-X Rec | 10 | - | always | 150 | .75 |
| Cheap Full-X ACT Recording | 10 | - | always | 3 | .75 |
| Average Full-X ACT Recording | 10 | - | always | 6 | .75 |
| High-Quality Full-X ACT Rec. | 10 | - | always | 7.5 | .75 |
| Current Hit Full-X ACT Rec. | 10 | - | always | 9 | .75 |
| Average Full-X Dir-X Recording | 10 | - | always | 270 | .75 |
| HighQuality Full-X Dir-X Rec | 10 | - | always | 300 | .75 |
| Current Hit Full-X Dir-X Rec | 10 | - | always | 450 | .75 |
| Video Disk | 8 | - | always | 20 | .75 |
| Video Recorder Package | 2 | 2 | 6/48hrs | 1000 | 1.5 |
| Video Screen | - | 3 | always | 150 | .75 |
| Video Transmission Unit | - | 5 | 8/7days | 4000 | 2 |
| Heat-sensitive Color Changers | - | - | 3/24hrs | 120 | 1 |
| Stars | - | - | 2/24hrs | 50 | 1 |
| Trademarks | - | - | 4/24hrs | 100 | 1 |
| Telecom (100 mp) | - | 15 | Always | 3000 | 1 |
| Telecom (250 mp) | - | 15 | Always | 7500 | 1 |
| Telecom (500 mp) | - | 15 | Always | 15000 | 1 |
| Telecom (1000 mp) | - | 15 | Always | 30000 | 1 |
| Advanced Comm. Suitcase | 3 | 6 | 8/48hrs | 8000 | 1.5 |
| Earplug Phone | 8 | - | Always | 1000 | 1.5 |
| EBM Carfaxx 2002 | - | - | - | 500 | - |
| Fax Plus 1000 Fax Machine | 6 | .5 | always | 300 | 1 |
| Handset Phone | 3 | 1 | Always | 500 | .75 |
| Phone Booster Pack | 3 | 2 | Always | 500 | 1 |
| Pocket Secretary | 3 | .5 | Always | 3000 | 1 |
| Office Communications Suite | - | - | 10/10days | 10000 | 2.5 |
| ThunderArc Three-D Holophone | - | 1 | 3/24hrs | 9000 | 1.25 |
| Wrist Phone | 4 | - | Always | 1000 | .75 |
| Wrist Phone w/Flip-up Screen | - | - | Always | 1500 | 1 |
| Call Forwarding Phone Upgrade | - | - | always | 50 | - |
| Call Waiting Phone Upgrade | - | - | always | 50 | - |
| Conference Calling Phone Upgr. | - | - | always | 50 | 1 |
| Digital Recorder Phone Upgrade | - | - | 6/36hrs | 2500 | 1 |
| ECM Scrambler Phone Upgrade | - | - | always | 25 | 1 |
| Emergency Dialer Phone Upgrade | - | - | always | 150 | 1 |
| Fax Interface Phone Upgrade | - | - | always | 150 | 1 |
| Privacy Plus Phone Upgrade | - | - | always | 3000 | 1 |
| Split Line Phone Upgrade | - | - | always | 100 | 1 |
| Tight Beam Phone Upgrade | - | 3 | 2/12hrs | 200 | 2 |
| Video Option Phone Upgrade | - | - | always | 450 | 1 |
| Voicemail Phone Upgrade | - | - | always | 40 | 1 |
| Computer Memory (non-cyber) | NA | - | Always | 20xMP | .75 |
| Computer Printer | NA | 10 | Always | 100 | 1 |
| DataTel RotoWrighter (printer) | 8 | .25 | always | 20 | 1 |
| E-Book Microcomp (12 Mp) | 4 | - | always | 4800 | 1.5 |
| E-Book Microcomp Cyber (12 Mp) | 4 | - | 3/36hrs | 6720 | 2 |
| EBM Cyber-PCX Minicomp (25 Mp) | 3 | 1 | 3/24hrs | 3500 | 1.5 |
| EBM PCX Minicomp (25 Mp) | 3 | 1 | always | 2500 | 1 |
| Hybrid Wearable Computer 25 Mp | 6 | 2 | 10/8 days | 3000 | 2 |
| IIKL-4 Workstation 40 Mp | - | 10 | always | 800 | .75 |
| IIKL-4 Workstation Cyber 40 Mp | - | 10 | 3/36hrs | 1120 | 1 |
| Mead Electronic Notebook 30 Mp | 4 | 1 | always | 3000 | 1 |
| Mini-Printer | 3 | .5 | always | 125 | 1 |
| PCZ Super Laptop (30 Mp) | 1 | 3 | always | 750 | .75 |
| Pocket Computer (100 mp) | 3 | 1 | Always | 10000 | 1 |
| Pocket Computer (250 mp) | 3 | 1 | Always | 25000 | 1 |
| Pocket Computer (500 mp) | 3 | 1 | Always | 50000 | 1 |
| Pocket Computer (1000 mp) | 3 | 1 | Always | 100000 | 1 |
| Techtronics Black Book (12 Mp) | 4 | - | always | 5750 | 1.6 |
| Treasurer Datawatch (1 Mp) | 12 | - | always | 55 | 1.5 |
| Table Top PC (100 mp) | - | 10 | Always | 2000 | .75 |
| Table Top PC (250 mp) | - | 10 | Always | 5000 | .75 |
| Table Top PC (500 mp) | - | 10 | Always | 10000 | .75 |
| Table Top PC (1000 mp) | - | 10 | Always | 20000 | .75 |
| Table Top PC (1500 mp) | - | 10 | Always | 30000 | .75 |
| Wrist Computer (100 mp) | 4 | - | Always | 40000 | 1.5 |
| Wrist Computer (250 mp) | 4 | - | Always | 100000 | 1.5 |
| Wrist Computer (500 mp) | 4 | - | Always | 200000 | 1.5 |
| Wrist Computer (1000 mp) | 4 | - | Always | 400000 | 1.5 |
| Wrist Computer (1500 mp) | 4 | - | Always | 600000 | 1.5 |
| Wyzard Handbox Personal Comp. | 3 | 1 | 2/6hrs | 6700 | 1.25 |
| Zetatech PDA | - | 1.1 | always | 3000 | 1 |
| Zetatech PS-4040 (30 Mp) | - | 3 | always | 1600 | .75 |
| Dataport | - | - | always | 100 | .75 |
| External Memory | - | .25 | always | 200 | .75 |
| Memory Upgrades (+10 Mp) | - | - | always | 200 | .75 |
| Language Processors | - | - | always | +40% | 1 |
| Tritech Datashielding | - | +1 | 5/48hrs | +20% | 1.2 |
| Zetatech Bug Detector 1 | - | - | 2/48hrs | 600 | 1.5 |
| Zetatech Bug Detector 2 | - | - | 2/48hrs | 1200 | 1.5 |
| Zetatech Bug Detector 3 | - | - | 3/48hrs | 1800 | 1.5 |
| Zetatech Bug Detector 4 | - | - | 4/48hrs | 2400 | 1.5 |
| Zetatech Bug Detector 5 | - | - | 5/48hrs | 3000 | 1.5 |
| Zetatech Bug Detector 6 | - | - | 6/48hrs | 3600 | 1.5 |
| Zetatech Bug Detector 7 | - | - | 7/48hrs | 4200 | 1.5 |
| Zetatech Bug Detector 8 | - | - | 8/48hrs | 4800 | 1.5 |
| Zetatech Bug Detector 9 | - | - | 9/48hrs | 5400 | 1.5 |
| Zetatech Bug Detector 10 | - | - | 10/48hrs | 6000 | 1.5 |
| Zetatech Bug Jammer 1 | - | - | 2/72hrs | 600 | 1.5 |
| Zetatech Bug Jammer 2 | - | - | 2/72hrs | 1200 | 1.5 |
| Zetatech Bug Jammer 3 | - | - | 3/72hrs | 1800 | 1.5 |
| Zetatech Bug Jammer 4 | - | - | 4/72hrs | 2400 | 1.5 |
| Zetatech Bug Jammer 5 | - | - | 5/72hrs | 3000 | 1.5 |
| Zetatech Bug Jammer 6 | - | - | 6/72hrs | 3600 | 1.5 |
| Zetatech Bug Jammer 7 | - | - | 7/72hrs | 4200 | 1.5 |
| Zetatech Bug Jammer 8 | - | - | 8/72hrs | 4800 | 1.5 |
| Zetatech Bug Jammer 9 | - | - | 9/72hrs | 5400 | 1.5 |
| Zetatech Bug Jammer 10 | - | - | 10/72hrs | 6000 | 1.5 |
| Zetatech Credit Transactor | - | - | 2/24hrs | 750 | 1 |
| Zetatech Drug Analyzer 1 | - | - | 2/48hrs | 225 | 2 |
| Zetatech Drug Analyzer 2 | - | - | 2/48hrs | 450 | 2 |
| Zetatech Drug Analyzer 3 | - | - | 3/48hrs | 675 | 2 |
| Zetatech Drug Analyzer 4 | - | - | 4/48hrs | 900 | 2 |
| Zetatech Lie Detector 1 | - | - | 3/48hrs | 600 | 2 |
| Zetatech Lie Detector 2 | - | - | 6/48hrs | 1200 | 2 |
| Zetatech Lie Detector 3 | - | - | 9/48hrs | 1800 | 2 |
| Zetatech Medscanner 1 | - | - | 2/24hrs | 750 | 1.5 |
| Zetatech Medscanner 2 | - | - | 2/24hrs | 1500 | 1.5 |
| Zetatech Medscanner 3 | - | - | 3/24hrs | 2250 | 1.5 |
| Zetatech Medscanner 4 | - | - | 4/24hrs | 3000 | 1.5 |
| Zetatech Radar Detector 1 | - | - | 2/72hrs | 450 | 1.5 |
| Zetatech Radar Detector 2 | - | - | 2/72hrs | 900 | 1.5 |
| Zetatech Radar Detector 3 | - | - | 3/72hrs | 1350 | 1.5 |
| Zetatech Radar Detector 4 | - | - | 4/72hrs | 1800 | 1.5 |
| Zetatech Radar Detector 5 | - | - | 5/72hrs | 2250 | 1.5 |
| Zetatech Radar Detector 6 | - | - | 6/72hrs | 2700 | 1.5 |
| Zetatech Radar Detector 7 | - | - | 7/72hrs | 3150 | 1.5 |
| Zetatech Radar Detector 8 | - | - | 8/72hrs | 3600 | 1.5 |
| Zetatech Radar Detector 9 | - | - | 9/72hrs | 4050 | 1.5 |
| Zetatech Radar Detector 10 | - | - | 10/72hrs | 4500 | 1.5 |
| Zetatech Signal Tracker 1 | - | - | 2/48hrs | 900 | 1.5 |
| Zetatech Signal Tracker 2 | - | - | 2/48hrs | 1800 | 1.5 |
| Zetatech Signal Tracker 3 | - | - | 3/48hrs | 2700 | 1.5 |
| Zetatech Signal Tracker 4 | - | - | 4/48hrs | 3600 | 1.5 |
| Zetatech Signal Tracker 5 | - | - | 5/48hrs | 4500 | 1.5 |
| Zetatech Signal Tracker 6 | - | - | 6/48hrs | 5400 | 1.5 |
| Zetatech Signal Tracker 7 | - | - | 7/48hrs | 6300 | 1.5 |
| Zetatech Signal Tracker 8 | - | - | 8/48hrs | 7200 | 1.5 |
| Zetatech Signal Tracker 9 | - | - | 9/48hrs | 8100 | 1.5 |
| Zetatech Signal Tracker 10 | - | - | 10/48hrs | 9000 | 1.5 |
| Zetatech Techscanner 1 | - | - | 2/24hrs | 750 | 1.5 |
| Zetatech Techscanner 2 | - | - | 2/24hrs | 1500 | 1.5 |
| Zetatech Techscanner 3 | - | - | 3/24hrs | 2250 | 1.5 |
| Zetatech Techscanner 4 | - | - | 4/24hrs | 3000 | 1.5 |
| Zetatech Voice Stress Analyz 1 | - | - | 2/48hrs | 300 | 2 |
| Zetatech Voice Stress Analyz 2 | - | - | 4/48hrs | 600 | 2 |
| Zetatech Voice Stress Analyz 3 | - | - | 6/48hrs | 900 | 2 |
| Data Unit (1000Mp) | 3 | 2 | Always | 20000 | 1 |
| Data Display (60Mp) | 3 | 2 | Always | 1200 | 1 |
| Data Display (100Mp) | 3 | 2 | Always | 2000 | 1 |
| Data: Headset (500Mp) | 4 | 1 | Always | 20000 | 1.5 |
| Data: Heads-Up Display (200Mp) | NA | 1 | 6/7days | 40000 | 3 |
| Kiroshi Goggles | - | 1 | 8/7days | 150 | 3.5 |
| Kiroshi Mirrorshades | - | - | 8/7days | 300 | 3.5 |
| Kiroshi Monocle | - | - | 8/7days | 200 | 3.5 |
| AZT Micro20 Microportacam | 8 | 2.5 | 5/72hrs | 2500 | 2 |
| AZT Micro25 Microcybercam | 8 | 2.5 | 5/72hrs | 3200 | 2 |
| Bionome Tridlink Adaptor | 6 | 1 | 2/72hrs | 700 | 1 |
| Fuchi VX2200 Portacam | - | 3 | 2/48hrs | 1000 | 1 |
| Fuchi VX2200 Cybercam | - | 5 | 3/48hrs | 1300 | 2 |
| Kiroshi Remote Cybercam 20 | - | 1 | 2/48hrs | 1350 | 1 |
| Nikkon America Campod | - | 2 | 4/72hrs | 2000 | 1 |
| Sony HB500 Portacam | - | 3.5 | 4/72hrs | 2200 | 2 |
| Sony CB5000 Cybercam | - | 5.5 | 5/72hrs | 2700 | 2 |
| AZT Micro30 StaticBrace Chest | - | 2 | 3/48hrs | 2200 | 1 |
| AZT Micro30 StaticBrace Wrist | - | 1 | 3/48hrs | 2200 | 1 |
| Cinema Pr. Steadycam Chest | - | 3 | 3/48hrs | 1800 | 2 |
| Cinema Pr. Steadycam Head | - | 2 | 3/48hrs | 1800 | 2 |
| Cinema Pr. Steadycam Shoulder | - | 2 | 3/48hrs | 1800 | 2 |
| Kodak GAC-25 Shoulder Mount | - | 1 | 3/48hrs | 200 | 2 |
| Fuchi I-C-U Autocam Controller | 5 | 1.5 | 5/72hrs | 400 | 2 |
| Sekrit Sistemz No-Sho Camtrol. | 5 | 1 | 5/72hrs | 1000 | 2 |
| Smartcam Adapter | - | .5 | 5/72hrs | 1500 | 2 |
| Zeemandt Luzor Monocular | 6 | .5 | 5/72hrs | 700 | 2 |
| Fibre-Optic Cable | - | - | always | 0.10 per meter | 1 |
| Secured Short-Haul Link | 4 | 5 | 4/72hrs | 6000 | 3 |
| Secured Long-Haul Link | 2 | 4 | 4/72hrs | 9000 | 3 |
| Secured Uplink | - | 3 | 4/72hrs | 1000 | 3 |
| Unsecured Short-Haul Link | 6 | 5 | 4/72hrs | 4000 | 2 |
| Unsecured Long-Haul Link | 4 | 4 | 4/72hrs | 6000 | 2 |
| Unsecured Uplink | 2 | 3 | 4/72hrs | 1000 | 2 |
| Fuchi Holo-Edit 7200 | - | 9 | 4/72hrs | 10000 | 2 |
| Sony TFX-10000 Imaging Gener. | - | 7 | 8/1week | 13000 | 2 |
| Vertex Netsynth Tridmixer | - | 7 | 2/48hs | 8000 | 1 |
| Non-Mobile Radio | - | 35 | 8/1week | 5500 | 1 |
| Non-Mobile TV | - | 35 | 9/1week | 8000 | 3 |
| Non-Mobile TV | - | 35 | 10/week | 10500 | 3 |
| Non-Mobile TV | - | 35 | 11/1week | 13000 | 3 |
| Non-Mobile TV | - | 35 | 12/1week | 15500 | 3 |
| Non-Mobile TV | - | 35 | 13/1week | 18000 | 3 |
| Non-Mobile TV | - | 35 | 14/1week | 20500 | 3 |
| Mobile Radio | - | 25 | 8/2weeks | 7500 | 2 |
| Mobile TV | - | 25 | 9/2weeks | 10000 | 3 |
| Mobile TV | - | 25 | 10/2weeks | 12500 | 3 |
| Mobile TV | - | 25 | 11/2weeks | 15000 | 3 |
| Mobile TV | - | 25 | 12/2weeks | 17500 | 3 |
| Mobile TV | - | 25 | 13/2weeks | 20000 | 3 |
| Mobile TV | - | 25 | 14/2weeks | 22500 | 3 |
| Transmission Sampler | 6 | 5 | 8/1week | 1000 | 2 |
| Satellite Injecton Uplink | - | 20 | 8/2weeks | 1000 | 2 |
| Satellite Injecton Uplink ECM1 | - | 20 | 9/2weeks | 4000 | 3 |
| Satellite Injecton Uplink ECM2 | - | 20 | 10/2weeks | 7000 | 3 |
| Satellite Injecton Uplink ECM3 | - | 20 | 11/2weeks | 10000 | 3 |
| Satellite Injecton Uplink ECM4 | - | 20 | 12/2weeks | 13000 | 3 |
| Satellite Injecton Uplink ECM5 | - | 20 | 13/2weeks | 16000 | 3 |
| Satellite Injecton Uplink ECM6 | - | 20 | 14/2weeks | 19000 | 3 |
| Cable Signal Formatter | 3 | 3 | 8/1week | 2000 | 2 |
| Cable Signal Formatter ECM 1 | 3 | 3 | 9/1week | 3500 | 3 |
| Cable Signal Formatter ECM 2 | 3 | 3 | 10/1week | 5000 | 3 |
| Cable Signal Formatter ECM 3 | 3 | 3 | 11/1week | 6500 | 3 |
| Cable Signal Formatter ECM 4 | 3 | 3 | 12/1week | 8000 | 3 |
| Cable Signal Formatter ECM 5 | 3 | 3 | 13/1week | 9500 | 3 |
| Cable Signal Formatter ECM 6 | 3 | 3 | 14/1week | 11000 | 3 |
| Ares CyberMed Psychscanner | - | 10 | 8/2weeks | 25000 | 3 |
| EBMM Therapeutic ASIST System | - | 12 | 8/2weeks | 40000 | 3 |
| Galil Ruach-Aleph Reprogrammer | 3 | 2 | 8/1week | 10000 | 3 |
| Mitsuhama MenTokko-II Manip. | 4 | 3 | 8/2weeks | 15000 | 3 |
| Mitsuhama MenTokko-V Manip. | - | 14 | 12/3weeks | 60000 | 3 |
| Fuchi RealSense Kosmos XXV | - | 30 | 8/2weeks | 250000 | 3 |
| Truman Inner-I | - | 28 | 8/2weeks | 200000 | 3 |
| Truman Reality-500 | - | 15 | 8/1week | 25000 | 2 |
| Sense Patch Injector | 4 | 5 | 8/1week | 25000 | 2 |
| Signal Peak Controller | 4 | 5.5 | 8/1week | 15000 | 2 |
| MonoPOV ACT Format | - | 13 | 8/1week | 15000 | 2 |
| MonoPOV Dir-X Format | - | 14 | 8/1week | 75000 | 2 |
| Musical instrument: Cheap Complexity 1 | - | varies | always | 50 | 8 |
| Musical instrument: Cheap Complexity 2 | - | varies | always | 100 | 8 |
| Musical instrument: Cheap Complexity 3 | - | varies | always | 150 | 8 |
| Musical instrument: Cheap Complexity 4 | - | varies | always | 200 | 8 |
| Musical instrument: Cheap Complexity 5 | - | varies | always | 250 | 8 |
| Musical instrument: Average Complexity 1 | - | varies | always | 500 | 8 |
| Musical instrument: Average Complexity 2 | - | varies | always | 1000 | 8 |
| Musical instrument: Average Complexity 3 | - | varies | always | 1500 | 8 |
| Musical instrument: Average Complexity 4 | - | varies | always | 2000 | 8 |
| Musical instrument: Average Complexity 5 | - | varies | always | 2500 | 8 |
| Musical instrument: Fine Complexity 1 | - | varies | always | 5000 | 8 |
| Musical instrument: Fine Complexity 2 | - | varies | always | 10000 | 8 |
| Musical instrument: Fine Complexity 3 | - | varies | always | 15000 | 8 |
| Musical instrument: Fine Complexity 4 | - | varies | always | 20000 | 8 |
| Musical instrument: Fine Complexity 5 | - | varies | always | 25000 | 8 |
| Synthesizers Cheap, 1 voice | - | varies | always | 175 | 8 |
| Synthesizers Cheap, 2 voices | - | varies | always | 200 | 8 |
| Synthesizers Cheap, 3 voices | - | varies | always | 225 | 8 |
| Synthesizers Cheap, 4 voices | - | varies | always | 250 | 8 |
| Synthesizers Cheap, 5 voices | - | varies | always | 275 | 8 |
| Synthesizers Cheap, 6 voices | - | varies | always | 300 | 8 |
| Synthesizers Cheap, 7 voices | - | varies | always | 325 | 8 |
| Synthesizers Cheap, 8 voices | - | varies | always | 350 | 8 |
| Synthesizers Average, 1 voice | - | varies | always | 600 | 8 |
| Synthesizers Average, 2 voices | - | varies | always | 700 | 8 |
| Synthesizers Average, 3 voices | - | varies | always | 800 | 8 |
| Synthesizers Average, 4 voices | - | varies | always | 900 | 8 |
| Synthesizers Average, 5 voices | - | varies | always | 1000 | 8 |
| Synthesizers Average, 6 voices | - | varies | always | 1100 | 8 |
| Synthesizers Average, 7 voices | - | varies | always | 1200 | 8 |
| Synthesizers Average, 8 voices | - | varies | always | 1300 | 8 |
| Synthesizers Average, 9 voices | - | varies | always | 1400 | 8 |
| Synthesizers Average, 10 voices | - | varies | always | 1500 | 8 |
| Synthesizers Average, 11 voices | - | varies | always | 1600 | 8 |
| Synthesizers Average, 12 voices | - | varies | always | 1700 | 8 |
| Synthesizers Average, 13 voices | - | varies | always | 1800 | 8 |
| Synthesizers Average, 14 voices | - | varies | always | 1900 | 8 |
| Synthesizers Average, 15 voices | - | varies | always | 2000 | 8 |
| Synthesizers Average, 16 voices | - | varies | always | 2100 | 8 |
| Synthesizers Fine, 1 voice | - | varies | always | 5500 | 8 |
| Synthesizers Fine, 2 voices | - | varies | always | 6000 | 8 |
| Synthesizers Fine, 3 voices | - | varies | always | 6500 | 8 |
| Synthesizers Fine, 4 voices | - | varies | always | 7000 | 8 |
| Synthesizers Fine, 5 voices | - | varies | always | 7500 | 8 |
| Synthesizers Fine, 6 voices | - | varies | always | 8000 | 8 |
| Synthesizers Fine, 7 voices | - | varies | always | 8500 | 8 |
| Synthesizers Fine, 8 voices | - | varies | always | 9000 | 8 |
| Synthesizers Fine, 9 voices | - | varies | always | 9500 | 8 |
| Synthesizers Fine, 10 voices | - | varies | always | 10000 | 8 |
| Synthesizers Fine, 11 voices | - | varies | always | 10500 | 8 |
| Synthesizers Fine, 12 voices | - | varies | always | 11000 | 8 |
| Synthesizers Fine, 13 voices | - | varies | always | 11500 | 8 |
| Synthesizers Fine, 14 voices | - | varies | always | 12000 | 8 |
| Synthesizers Fine, 15 voices | - | varies | always | 12500 | 8 |
| Synthesizers Fine, 16 voices | - | varies | always | 13000 | 8 |
| Synthesizers Fine, 17 voices | - | varies | always | 13500 | 8 |
| Synthesizers Fine, 18 voices | - | varies | always | 14000 | 8 |
| Synthesizers Fine, 19 voices | - | varies | always | 14500 | 8 |
| Synthesizers Fine, 20 voices | - | varies | always | 15000 | 8 |
| Synthesizers Fine, 21 voices | - | varies | always | 15500 | 8 |
| Synthesizers Fine, 22 voices | - | varies | always | 16000 | 8 |
| Synthesizers Fine, 23 voices | - | varies | always | 16500 | 8 |
| Synthesizers Fine, 24 voices | - | varies | always | 17000 | 8 |
| Synthesizers Fine, 25 voices | - | varies | always | 17500 | 8 |
| Synthesizers Fine, 26 voices | - | varies | always | 18000 | 8 |
| Synthesizers Fine, 27 voices | - | varies | always | 18500 | 8 |
| Synthesizers Fine, 28 voices | - | varies | always | 19000 | 8 |
| Synthesizers Fine, 29 voices | - | varies | always | 19500 | 8 |
| Synthesizers Fine, 30 voices | - | varies | always | 20000 | 8 |
| Synthesizers Fine, 31 voices | - | varies | always | 20500 | 8 |
| Synthesizers Fine, 32 voices | - | varies | always | 21000 | 8 |
| Autosynth, skill 1 | - | - | always | 1000 | 8 |
| Autosynth, skill 2 | - | - | always | 2000 | 8 |
| Autosynth, skill 3 | - | - | always | 3000 | 8 |
| Autosynth, skill 4 | - | - | always | 12000 | 8 |
| Autosynth, skill 5 | - | - | always | 15000 | 8 |
| Autosynth, skill 6 | - | - | always | 30000 | 8 |
| Autosynth, skill 7 | - | - | always | 35000 | 8 |
| Autosynth, skill 8 | - | - | always | 40000 | 8 |
| Autosynth, skill 9 | - | - | always | 90000 | 8 |
| Autosynth, skill 10 | - | - | always | 100000 | 8 |
| Cheap Synthlink Controller | 6 | .5 | always | 1000 | .75 |
| Average Synthlink Controller | 5 | .5 | always | 10000 | .75 |
| Fine Synthlink Controller | 5 | .5 | 3/48hrs | 50000 | 1 |
| Small Acoustic Modulators | - | - | always | 8000 | 8 |
| Club Acoustic Modulators | - | - | always | 15000 | 8 |
| Hall Acoustic Modulators | - | - | always | 35000 | 8 |
| Small Amplifiers | - | - | always | 100 | 8 |
| Club Amplifiers | - | - | always | 400 | 8 |
| Hall Amplifiers | - | - | always | 1200 | 8 |
| Stadium Amplifiers | - | - | always | 5000 | 8 |
| Superstatium Amplifiers | - | - | always | 12000 | 8 |
| Small Speakers | - | - | always | 100 | 8 |
| Club Speakers | - | - | always | 1000 | 8 |
| Hall Speakers | - | - | always | 5000 | 8 |
| Stadium Speakers | - | - | always | 12000 | 8 |
| Superstadium Speakers | - | - | always | 25000 | 8 |
| 4-track Sampler | - | - | always | 1200 | 8 |
| 8-track Sampler | - | - | always | 3200 | 8 |
| 16-track Sampler | - | - | always | 8000 | 8 |
| 24-track Sampler | - | - | always | 14400 | 8 |
| 32-track Sampler | - | - | always | 22400 | 8 |
| Body Mike | 10 | .1 | 2/36hrs | 100 | 1 |
| Hand Mike | 6 | .5 | always | 100 | 1 |
| Mike Stand | - | 3 | always | 50 | 1 |
| Mike Boom | - | 3 | 3/36hrs | 75 | 1 |
| Basic Mixer Unit | 8 | 2 | always | 1000 | 1 |
| Additional Mixer Input Channel | - | - | 3/36hrs | 200 | 2 |
| Additional Mixer Output Channl | - | - | - | 500 | 2 |
| Built-in Polycorder in Mixer | - | - | 5/36hrs | 300 | 2 |
| Digital Recording Studio | - | - | 8/14 days | 12000 | 1.1 |
| Hand-held Polycorder | 2 | 2.5 | always | 100 | .75 |
| Microcorder | 8 | - | 6/48hrs | 1000 | 2 |
| Minicorder | 6 | .1 | 4/24hrs | 700 | 1 |
| Pocket Sized Polycorder | 5 | .2 | always | 200 | .75 |
| Rack-Mounted Polycorder | - | 4 | 3/24hrs | 1500 | 2 |
| Sprawl Blaster | - | 3.5 | always | 200 | .75 |
| Sprawl Fuserr | - | 5.5 | always | 1200 | .75 |
| Cab Hailer | 10 | - | upon payment | 150 | 1 |
| Image Wallet | 8 | .1 | 4/36hrs | 250 | 1 |
| Life | 4 | 1.5 | 5/36hrs | 500 | .9 |
| DataTel | 4 | 1 | 4/4days | 500 | 1 |
| Miniature Copier | 3 | .5 | 2/12hrs | 230 | .8 |
| Orientation Unit | 6 | .5 | 5/4 days | 1500 | 1 |
| Paper Shredder | - | 2.5 | always | 500 | 1 |
| Mastoid Commo | 8 | - | 2/12hrs | 1000 | .6 |
| Pocket Commo | 7 | .1 | always | 500 | .5 |
| Power Grid SolarElectric Panel | 2 | 1 | 4/36hrs | 100 | 1.1 |
| Taser Wallet | 10 | - | 5/48hrs | 165 | 1.5 |
| WorldSat Comm Flopscreen | - | 1 | always | 4500 | 1.1 |
| SecSystems Detention Collar | 4 | .5 | 8/10days | 260 | 3 |

### Magical Equipment
| Name | Availability | Cost | Street Index |
| --- | --- | --- | --- |
| Specific Spell Focus 1 | 4/48hrs | 45000 | 2 |
| Specific Spell Focus 2 | 4/48hrs | 90000 | 2 |
| Specific Spell Focus 3 | 4/48hrs | 135000 | 2 |
| Specific Spell Focus 4 | 4/48hrs | 180000 | 2 |
| Specific Spell Focus 5 | 4/48hrs | 225000 | 2 |
| Specific Spell Focus 6 | 4/48hrs | 270000 | 2 |
| Spell Type Focus 1 | 5/48hrs | 75000 | 2 |
| Spell Type Focus 2 | 5/48hrs | 150000 | 2 |
| Spell Type Focus 3 | 5/48hrs | 225000 | 2 |
| Spell Type Focus 4 | 5/48hrs | 300000 | 2 |
| Spell Type Focus 5 | 5/48hrs | 375000 | 2 |
| Spell Type Focus 6 | 5/48hrs | 450000 | 2 |
| Spirit Focus 1 | 4/48hrs | 60000 | 2 |
| Spirit Focus 2 | 4/48hrs | 120000 | 2 |
| Spirit Focus 3 | 4/48hrs | 180000 | 2 |
| Spirit Focus 4 | 4/48hrs | 240000 | 2 |
| Spirit Focus 5 | 4/48hrs | 300000 | 2 |
| Spirit Focus 6 | 4/48hrs | 360000 | 2 |
| Power Focus 1 | 6/72hrs | 105000 | 2 |
| Power Focus 2 | 6/72hrs | 210000 | 2 |
| Power Focus 3 | 6/72hrs | 315000 | 2 |
| Power Focus 4 | 6/72hrs | 420000 | 2 |
| Power Focus 5 | 6/72hrs | 525000 | 2 |
| Power Focus 6 | 6/72hrs | 630000 | 2 |
| Spell Lock | 2/48hrs | 45000 | 2 |
| Weapon Focus 1 | 8/72hrs | 290000 | 3 |
| Weapon Focus 2 | 8/72hrs | 380000 | 3 |
| Weapon Focus 3 | 8/72hrs | 470000 | 3 |
| Weapon Focus 4 | 8/72hrs | 560000 | 3 |
| Weapon Focus 5 | 8/72hrs | 650000 | 3 |
| Weapon Focus 6 | 8/72hrs | 740000 | 3 |
| Weapon Focus 1 | 8/72hrs | 390000 | 3 |
| Weapon Focus 2 | 8/72hrs | 480000 | 3 |
| Weapon Focus 3 | 8/72hrs | 570000 | 3 |
| Weapon Focus 4 | 8/72hrs | 660000 | 3 |
| Weapon Focus 5 | 8/72hrs | 750000 | 3 |
| Weapon Focus 6 | 8/72hrs | 840000 | 3 |
| Ally Conjuring Materials (1 Unit) | (Force)/36hrs | 1000 | 1 |
| Elemental Conjuring Materials - Force 1 | 1/24hrs | 1000 | 1 |
| Elemental Conjuring Materials - Force 2 | 2/24hrs | 2000 | 1 |
| Elemental Conjuring Materials - Force 3 | 3/24hrs | 3000 | 1 |
| Elemental Conjuring Materials - Force 4 | 4/24hrs | 4000 | 1 |
| Elemental Conjuring Materials - Force 5 | 5/24hrs | 5000 | 1 |
| Elemental Conjuring Materials - Force 6 | 6/24hrs | 6000 | 1 |
| Fetish Focus - Force 1 | 3/26hrs | 3000 | 1 |
| Fetish Focus - Force 2 | 3/26hrs | 6000 | 1 |
| Fetish Focus - Force 3 | 3/26hrs | 9000 | 1 |
| Fetish Focus - Force 4 | 3/26hrs | 12000 | 1 |
| Fetish Focus - Force 5 | 3/26hrs | 15000 | 1 |
| Fetish Focus - Force 6 | 3/26hrs | 18000 | 1 |
| Medicine Lodge Materials - Force 1 | 1/24hrs | 500 | 1 |
| Medicine Lodge Materials - Force 2 | 2/24hrs | 1000 | 1 |
| Medicine Lodge Materials - Force 3 | 3/24hrs | 1500 | 1 |
| Medicine Lodge Materials - Force 4 | 4/24hrs | 2000 | 1 |
| Medicine Lodge Materials - Force 5 | 5/24hrs | 2500 | 1 |
| Medicine Lodge Materials - Force 6 | 6/24hrs | 3000 | 1 |
| Ward Casting Materials (1 Unit) | (Force)/36hrs | 1000 | 1 |
| Watcher Casting Materials (1 Unit) | (Force)/36hrs | 1000 | 1 |
| Hermetic library - Disk - Rating 1 | 1/7days | 1000 | 2 |
| Hermetic library - Disk - Rating 2 | 2/7days | 4000 | 2 |
| Hermetic library - Disk - Rating 3 | 3/7days | 9000 | 2 |
| Hermetic library - Disk - Rating 4 | 4/7days | 16000 | 2 |
| Hermetic library - Disk - Rating 5 | 5/7days | 25000 | 2 |
| Hermetic library - Disk - Rating 6 | 6/7days | 36000 | 2 |
| Hermetic library - Chip - Rating 1 | 1/7days | 1200 | 2 |
| Hermetic library - Chip - Rating 2 | 2/7days | 4800 | 2 |
| Hermetic library - Chip - Rating 3 | 3/7days | 10800 | 2 |
| Hermetic library - Chip - Rating 4 | 4/7days | 19200 | 2 |
| Hermetic library - Chip - Rating 5 | 5/7days | 30000 | 2 |
| Hermetic library - Chip - Rating 6 | 6/7days | 43200 | 2 |
| Hermetic library - Hardcopy - Force 1 | 1/14days | 2000 | 3 |
| Hermetic library - Hardcopy - Force 2 | 2/14days | 8000 | 3 |
| Hermetic library - Hardcopy - Force 3 | 3/14days | 18000 | 3 |
| Hermetic library - Hardcopy - Force 4 | 4/14days | 32000 | 3 |
| Hermetic library - Hardcopy - Force 5 | 5/14days | 50000 | 3 |
| Hermetic library - Hardcopy - Force 6 | 6/14days | 72000 | 3 |
| Expendable fetish - Combat | 2/24hrs | 20 | 1 |
| Expendable fetish - Detection | 2/24hrs | 5 | 1 |
| Expendable fetish - Healing | 2/24hrs | 50 | 1 |
| Expendable fetish - Illusion | 2/24hrs | 10 | 1 |
| Expendable fetish - Manipulation | 2/24hrs | 30 | 1 |
| Reusable fetishes - Combat | 3/24hrs | 200 | 1 |
| Reusable fetishes - Detection | 3/24hrs | 50 | 1 |
| Reusable fetishes - Healing | 3/24hrs | 500 | 1 |
| Reusable fetishes - Illusion | 3/24hrs | 100 | 1 |
| Reusable fetishes - Manipulation | 3/24hrs | 300 | 1 |
| Ritual sorcery material - Detection | 3/24hrs | 100xForce | 1 |
| Ritual sorcery material -Healing | 3/24hrs | 500xForce | 1 |
| Ritual sorcery material -Illusion | 3/24hrs | 100xForce | 1 |
| Ritual sorcery material -Manipulation | 3/24hrs | 1000xForce | 1 |
| Herbals Raw | - | 50 | - |
| Herbals Refined | - | 100 | - |
| Herbals Radical | - | 200 | - |
| Crystals Raw | - | 100 | - |
| Crystals Refined | - | 200 | - |
| Crystals Radical | - | 400 | - |
| Sprecious Gems Raw | - | 200 | - |
| Sprecious Gems Refined | - | 400 | - |
| Sprecious Gems Radical | - | 800 | - |
| Precious Gems Raw | - | 500 | - |
| Precious Gems Refined | - | 1000 | - |
| Precious Gems Radical | - | 2000 | - |
| Iron Raw | - | 50 | - |
| Iron Refined | - | 100 | - |
| Iron Radical | - | 200 | - |
| Copper Raw | - | 100 | - |
| Copper Refined | - | 200 | - |
| Copper Radical | - | 400 | - |
| Silver Raw | - | 300 | - |
| Silver Refined | - | 600 | - |
| Silver Radical | - | 1200 | - |
| Gold Raw | - | 10000 | - |
| Gold Refined | - | 20000 | - |
| Gold Radical | - | 40000 | - |
| Mercury Raw | - | 600 | - |
| Mercury Refined | - | 1200 | - |
| Mercury Radical | - | 2400 | - |
| Tin Raw | - | 30 | - |
| Tin Refined | - | 60 | - |
| Tin Radical | - | 120 | - |
| Lead Raw | - | 30 | - |
| Lead Refined | - | 60 | - |
| Lead Radical | - | 120 | - |
| 1 Unit Orichalcum | - | 88000 | - |
| Spell formulae - Force L | - | 50xForce | - |
| Spell formulae - Force M | - | 100xForce | - |
| Spell formulae - Force S | - | 500xForce | - |
| Spell formulae - Force D | - | 1000xForce | - |

### Chips
| Name | Type | Rating | Memory | Availability | Cost | Street Index |
| --- | --- | --- | --- | --- | --- | --- |
| Active General Skill Chip Rating 1 | Active | 1 | 10 | 6/4days | 1000 | 1.25 |
| Active General Skill Chip Rating 2 | Active | 2 | 20 | 6/4days | 2000 | 1.25 |
| Active General Skill Chip Rating 3 | Active | 3 | 30 | 6/4days | 3000 | 1.25 |
| Active General Skill Chip Rating 4 | Active | 4 | 200 | 6/4days | 20000 | 1.25 |
| Active General Skill Chip Rating 5 | Active | 5 | 250 | 6/4days | 25000 | 1.25 |
| Active General Skill Chip Rating 6 | Active | 6 | 300 | 6/4days | 30000 | 1.25 |
| Active General Skill Chip Rating 7 | Active | 7 | 700 | 6/4days | 70000 | 1.25 |
| Active General Skill Chip Rating 8 | Active | 8 | 800 | 6/4days | 80000 | 1.25 |
| Active General Skill Chip Rating 9 | Active | 9 | 900 | 6/4days | 90000 | 1.25 |
| Active General Skill Chip Rating 10 | Active | 10 | 2000 | 6/4days | 200000 | 1.25 |
| Active Concentration Chip Rating 1 | Active | 1 | 6 | 6/4days | 600 | 1.25 |
| Active Concentration Chip Rating 2 | Active | 2 | 12 | 6/4days | 1200 | 1.25 |
| Active Concentration Chip Rating 3 | Active | 3 | 18 | 6/4days | 1800 | 1.25 |
| Active Concentration Chip Rating 4 | Active | 4 | 120 | 6/4days | 12000 | 1.25 |
| Active Concentration Chip Rating 5 | Active | 5 | 150 | 6/4days | 15000 | 1.25 |
| Active Concentration Chip Rating 6 | Active | 6 | 180 | 6/4days | 18000 | 1.25 |
| Active Concentration Chip Rating 7 | Active | 7 | 420 | 6/4days | 42000 | 1.25 |
| Active Concentration Chip Rating 8 | Active | 8 | 480 | 6/4days | 48000 | 1.25 |
| Active Concentration Chip Rating 9 | Active | 9 | 540 | 6/4days | 54000 | 1.25 |
| Active Concentration Chip Rating 10 | Active | 10 | 1200 | 6/4days | 120000 | 1.25 |
| Active Specialization Chip Rating 1 | Active | 1 | 4 | 6/4days | 400 | 1.25 |
| Active Specialization Chip Rating 2 | Active | 2 | 8 | 6/4days | 800 | 1.25 |
| Active Specialization Chip Rating 3 | Active | 3 | 12 | 6/4days | 1200 | 1.25 |
| Active Specialization Chip Rating 4 | Active | 4 | 80 | 6/4days | 8000 | 1.25 |
| Active Specialization Chip Rating 5 | Active | 5 | 100 | 6/4days | 10000 | 1.25 |
| Active Specialization Chip Rating 6 | Active | 6 | 120 | 6/4days | 12000 | 1.25 |
| Active Specialization Chip Rating 7 | Active | 7 | 280 | 6/4days | 28000 | 1.25 |
| Active Specialization Chip Rating 8 | Active | 8 | 320 | 6/4days | 32000 | 1.25 |
| Active Specialization Chip Rating 9 | Active | 9 | 360 | 6/4days | 36000 | 1.25 |
| Active Specialization Chip Rating 10 | Active | 10 | 800 | 6/4days | 80000 | 1.25 |
| Ambidexterity Chip Rating 1 | Active | 1 | 10 | 6/4days | 1000 | 1.25 |
| Ambidexterity Chip Rating 2 | Active | 2 | 20 | 6/4days | 2000 | 1.25 |
| Ambidexterity Chip Rating 3 | Active | 3 | 30 | 6/4days | 3000 | 1.25 |
| Ambidexterity Chip Rating 4 | Active | 4 | 200 | 6/4days | 20000 | 1.25 |
| Ambidexterity Chip Rating 5 | Active | 5 | 250 | 6/4days | 25000 | 1.25 |
| DeathTrance Chip Rating 1 | Active | 1 | 50 | 20/10days | 5000 | .9 |
| Mister Lover Chip Rating 1 | Active | 1 | 5 | 5/48hrs | 100 | .9 |
| Mister Lover Chip Rating 2 | Active | 2 | 10 | 5/48hrs | 200 | .9 |
| Mister Lover Chip Rating 3 | Active | 3 | 15 | 5/48hrs | 300 | .9 |
| Poser Impersonation W | Active | 4 and 6 | 440 Mp | 24/20days | 40000 | 1 |
| Poser Impersonation W | Active | 4 and 6 | 320 Mp | 20/20days | 30000 | 1 |
| General Knowledge Skill Chip Rating 1 | Know | 1 | 10 | 5/4days | 1500 | 1.25 |
| General Knowledge Skill Chip Rating 2 | Know | 2 | 20 | 5/4days | 3000 | 1.25 |
| General Knowledge Skill Chip Rating 3 | Know | 3 | 30 | 5/4days | 4500 | 1.25 |
| General Knowledge Skill Chip Rating 4 | Know | 4 | 200 | 5/4days | 30000 | 1.25 |
| General Knowledge Skill Chip Rating 5 | Know | 5 | 250 | 5/4days | 37500 | 1.25 |
| General Knowledge Skill Chip Rating 6 | Know | 6 | 300 | 5/4days | 45000 | 1.25 |
| General Knowledge Skill Chip Rating 7 | Know | 7 | 700 | 5/4days | 105000 | 1.25 |
| General Knowledge Skill Chip Rating 8 | Know | 8 | 800 | 5/4days | 120000 | 1.25 |
| General Knowledge Skill Chip Rating 9 | Know | 9 | 900 | 5/4days | 135000 | 1.25 |
| General Knowledge Skill Chip Rating 10 | Know | 10 | 2000 | 5/4days | 300000 | 1.25 |
| Knowledge Concentration Chip Rating 1 | Know | 1 | 6 | 5/4days | 900 | 1.25 |
| Knowledge Concentration Chip Rating 2 | Know | 2 | 12 | 5/4days | 1800 | 1.25 |
| Knowledge Concentration Chip Rating 3 | Know | 3 | 18 | 5/4days | 2700 | 1.25 |
| Knowledge Concentration Chip Rating 4 | Know | 4 | 120 | 5/4days | 18000 | 1.25 |
| Knowledge Concentration Chip Rating 5 | Know | 5 | 150 | 5/4days | 22500 | 1.25 |
| Knowledge Concentration Chip Rating 6 | Know | 6 | 180 | 5/4days | 27000 | 1.25 |
| Knowledge Concentration Chip Rating 7 | Know | 7 | 420 | 5/4days | 63000 | 1.25 |
| Knowledge Concentration Chip Rating 8 | Know | 8 | 480 | 5/4days | 72000 | 1.25 |
| Knowledge Concentration Chip Rating 9 | Know | 9 | 540 | 5/4days | 81000 | 1.25 |
| Knowledge Concentration Chip Rating 10 | Know | 10 | 1200 | 5/4days | 180000 | 1.25 |
| Knowledge Specialization Chip Rating 1 | Know | 1 | 4 | 5/4days | 600 | 1.25 |
| Knowledge Specialization Chip Rating 2 | Know | 2 | 8 | 5/4days | 1200 | 1.25 |
| Knowledge Specialization Chip Rating 3 | Know | 3 | 12 | 5/4days | 1800 | 1.25 |
| Knowledge Specialization Chip Rating 4 | Know | 4 | 80 | 5/4days | 12000 | 1.25 |
| Knowledge Specialization Chip Rating 5 | Know | 5 | 100 | 5/4days | 15000 | 1.25 |
| Knowledge Specialization Chip Rating 6 | Know | 6 | 120 | 5/4days | 18000 | 1.25 |
| Knowledge Specialization Chip Rating 7 | Know | 7 | 280 | 5/4days | 42000 | 1.25 |
| Knowledge Specialization Chip Rating 8 | Know | 8 | 320 | 5/4days | 48000 | 1.25 |
| Knowledge Specialization Chip Rating 9 | Know | 9 | 360 | 5/4days | 54000 | 1.25 |
| Knowledge Specialization Chip Rating 10 | Know | 10 | 800 | 5/4days | 120000 | 1.25 |
| Auditory Recognition Chip 1 | Know | 1 | 50 | 7/4days | 7500 | 1.5 |
| Auditory Recognition Chip 2 | Know | 2 | 100 | 7/4days | 15000 | 1.5 |
| Auditory Recognition Chip 3 | Know | 3 | 150 | 7/4days | 22500 | 1.5 |
| Auditory Recognition Chip 4 | Know | 4 | 200 | 7/4days | 30000 | 1.5 |
| DataEdge Inc. Stutter Chipping | Know | - | 20 | 4/48hrs | 3100 | 1.5 |
| Digi-Tone ID Chip 1 | Know | 1 | 2 | 2/4days | 70 | 1 |
| Digi-Tone ID Chip 2 | Know | 2 | 4 | 2/4days | 140 | 1 |
| Digi-Tone ID Chip 3 | Know | 3 | 6 | 3/4days | 210 | 1 |
| Digi-Tone ID Chip 4 | Know | 4 | 8 | 4/4days | 280 | 1 |
| Digi-Tone ID Chip 5 | Know | 5 | 10 | 5/4days | 350 | 1 |
| Digi-Tone ID Chip 6 | Know | 6 | 12 | 6/4days | 420 | 1 |
| Mind Games Chip | Know | - | depends on game | always | 750 | .6 |
| M.O. Chip | Know | - | 300 | 10/14days | 12000 | 10 |
| Language skill Chip Rating 1 | Lingua | 1 | 3 | 5/36hrs | 300 | 1.25 |
| Language skill Chip Rating 2 | Lingua | 2 | 6 | 5/36hrs | 600 | 1.25 |
| Language skill Chip Rating 3 | Lingua | 3 | 9 | 5/36hrs | 900 | 1.25 |
| Language skill Chip Rating 4 | Lingua | 4 | 24 | 5/36hrs | 2400 | 1.25 |
| Language skill Chip Rating 5 | Lingua | 5 | 30 | 5/36hrs | 3000 | 1.25 |
| Language skill Chip Rating 6 | Lingua | 6 | 36 | 5/36hrs | 3600 | 1.25 |
| Language skill Chip Rating 7 | Lingua | 7 | 70 | 5/36hrs | 7000 | 1.25 |
| Language skill Chip Rating 8 | Lingua | 8 | 80 | 5/36hrs | 8000 | 1.25 |
| Language skill Chip Rating 9 | Lingua | 9 | 90 | 5/36hrs | 9000 | 1.25 |
| Language skill Chip Rating 10 | Lingua | 10 | 300 | 5/36hrs | 30000 | 1.25 |
| PhotoMemory RAM | Data | "-2" | - | 6/72hrs | 16000 | 1.25 |
| Corporate Officer VisRec Chip1 | Know | 1 | 40 | 10/4days | 6000 | 1.5 |
| Corporate Officer VisRec Chip2 | Know | 2 | 80 | 10/4days | 12000 | 1.5 |
| Corporate Officer VisRec Chip3 | Know | 3 | 120 | 10/4days | 18000 | 1.5 |
| Corporate Officer VisRec Chip4 | Know | 4 | 160 | 10/4days | 24000 | 1.5 |
| Military VisRec Chip 1 | Know | 1 | 100 | 10/4days | 15000 | 2.5 |
| Military VisRec Chip 2 | Know | 2 | 200 | 10/4days | 30000 | 2.5 |
| Military VisRec Chip 3 | Know | 3 | 300 | 10/4days | 45000 | 2.5 |
| Military VisRec Chip 4 | Know | 4 | 400 | 10/4days | 60000 | 2.5 |
| Police VisRec Chip 1 | Know | 1 | 65 | 10/4days | 16250 | 2.5 |
| Police VisRec Chip 2 | Know | 2 | 130 | 10/4days | 32500 | 2.5 |
| Police VisRec Chip 3 | Know | 3 | 195 | 10/4days | 48750 | 2.5 |
| Police VisRec Chip 4 | Know | 4 | 260 | 10/4days | 65000 | 2.5 |
| Rocker VisRec Chip 1 | Know | 1 | 50 | 5/4days | 7500 | 1.5 |
| Rocker VisRec Chip 2 | Know | 1 | 100 | 5/4days | 15000 | 1.5 |
| Rocker VisRec Chip 3 | Know | 1 | 150 | 5/4days | 22500 | 1.5 |
| Rocker VisRec Chip 4 | Know | 1 | 200 | 5/4days | 30000 | 1.5 |
| Secretarial VisRec Chip 1 | Know | 1 | 50 | 8/4days | 7500 | 1.5 |
| Secretarial VisRec Chip 2 | Know | 1 | 100 | 8/4days | 15000 | 1.5 |
| Secretarial VisRec Chip 3 | Know | 1 | 150 | 8/4days | 22500 | 1.5 |
| Secretarial VisRec Chip 4 | Know | 1 | 200 | 8/4days | 30000 | 1.5 |
| Techie VisRec Chip 1 | Know | 1 | 50 | 6/4days | 7500 | 1.5 |
| Techie VisRec Chip 2 | Know | 1 | 100 | 6/4days | 15000 | 1.5 |
| Techie VisRec Chip 3 | Know | 1 | 150 | 6/4days | 22500 | 1.5 |
| Techie VisRec Chip 4 | Know | 1 | 200 | 6/4days | 30000 | 1.5 |
| Adrenalin | (Special) | 1 | 150 | 6/72hrs | 12500 | 2 |
| Adrenalin | (Special) | 2 | 300 | 6/72hrs | 25000 | 2 |
| Adrenalin | (Special) | 3 | 450 | 6/72hrs | 37500 | 2 |
| Adrenalin | (Special) | 4 | 600 | 6/72hrs | 50000 | 2 |
| Adrenalin | (Special) | 5 | 750 | 6/72hrs | 62500 | 2 |
| Adrenalin | (Special) | 6 | 900 | 6/72hrs | 75000 | 2 |
| Business Trip Chip | Active/Lingua | 4 | 424 | 4/24hrs | 42500 | 1 |
| N | (Special) | - | 20 | 4/4days | 1000 | 1 |
| Special Operative Chip | Active/Know/Lingua | 4 | 500 | 8/6days | 60000 | 2 |
| Stress Chip | (Special) | - | 20 | 4/36hrs | 3500 | 1 |
| Tourism Chip | Active/Lingua | 4 | 344 | 4/24hrs | 42500 | 1 |

### Drugs
| Name | Addiction | Tolerance | Strength | Availability | Cost | Street Index |
| --- | --- | --- | --- | --- | --- | --- |
| Alcohol (bottle) | 2M | 3 | 50 | always | 10 | .8 |
| Barbiturates | 4M+3P | 3 | 5 | 4/3hrs | 1 | .8 |
| Benzodiazepines | 2M+2P | 5 | 5 | 4/3hrs | 1 | .9 |
| Butaqualide | 5M | 3 | 10 | 5/1hr | 20 | 2.5 |
| Chloral Hydrate | 4M+3P | 3 | 5 | 5/4hrs | 2 | 1 |
| Diamond-Four | 2P | 2 | 10 | 10/48hrs | 1500 | 3.5 |
| FoolKiller | 5P | 2 | 10 | 8/3hrs | 35 | 2.5 |
| Genesios Three | 2M | 5 | 20 | 14/14days | 1000 | 8.5 |
| Glutethimide | 3M+4P | 4 | 3 | 5/4hrs | 3 | 1 |
| Marijuana (ingested) | 3M | 3 | 10 | 3/1hr | 20 | .5 |
| Marijuana (smoked) | 3M | 3 | 10 | 3/1hr | 4 | .5 |
| Methaqualone | 4M+4P | 4 | 2 | 4/3hrs | 3 | 1.2 |
| Musk | 3M | 3 | 20 | 3/1hr | 250 | 2 |
| Nicotine (pack of cigarettes) | 3M | 1 | 20 | always | 2 | .8 |
| NuYou | 6M | 3 | 10 | 4/2hrs | 350 | 3 |
| Paxium | 2M | 4 | 20 | 3/1hr | 5 | 2.5 |
| Schwarzeneine | 6P | 4 | 5 | 8/3hrs | 45 | 3.5 |
| Shades | 5M | 2 | 5 | 4/1hr | 30 | 2 |
| Sonniene | 4M | 3 | 5 | 4/1hr | 80 | 3 |
| Ecstacy | 4M | 4 | 20 | 5/7hrs | 150 | 4 |
| LSD (one tab) | 1M | 2 | 4 | 4/7hrs | 5 | 1.5 |
| LSD (100 tabs) | 1M | 2 | 4 | 4/7hrs | 200 | 1.5 |
| MDA | 2M | 2 | 6 | 4/7hrs | 10 | 1.7 |
| Mescaline | 2M | 2 | 4 | 4/5hrs | 80 | 2 |
| Phencyclidine | 5M | 4 | 2 | 8/14hrs | 25 | 2.5 |
| Ribopropylmethionine | 8P | 2 | 2 | 10/7hrs | 100 | 3 |
| Zen | 5M | 3 | 10 | 5/10hrs | 120 | 3 |
| Heroin | 5M+5P | 3 | 3 | 5/2hrs | 20 | 2.5 |
| Hydromorphone | 4M+4P | 5 | 7 | 5/6hrs | 250 | 1.5 |
| Meperidine | 4M+4P | 5 | 4 | 6/6hrs | 500 | 2.5 |
| Methadone | 2M+3P | 3 | 5 | 5/6hrs | 50 | 2 |
| Morphine | 4M+4P | 4 | 10 | 4/3hrs | 150 | 1.25 |
| Opium | 4M+4P | 3 | 15 | 6/24hrs | 50 | 1.25 |
| Amphetamines (50 tablets) | 5P | 3 | 6 | 4/3hrs | 75 | 1.5 |
| Brown Study | 1M | 4 | 10 | 6/6hrs | 35 | 3 |
| Caffeine (100 tablets) | 1M | 3 | 50 | always | 5 | 1 |
| Cocaine | 6P | 3 | 5 | 4/1hr | 10 | 2 |
| Endorphins | 4P | 4 | 5 | 6/3hrs | 30 | 3 |
| J | 1M | 1 | 50 | 10/3hrs | 600 | 4 |
| Kamikaze | 4P | 2 | 4 | 5/4days | 50 | 5 |
| Methylphenidate | 3P | 5 | 4 | 4/3hrs | 25 | 1.8 |
| Phenmetrazine (10 tablets) | 5P | 4 | 5 | 5/3hrs | 75 | 1.5 |
| Spaz | 5P | 1 | 5 | 8/24hrs | 10 | 1.5 |
| Triphetamines (50 tablets) | 2M | 4 | 5 | 5/3hrs | 25 | 1.5 |

### Stuff With Ratings
| Name | Concealability | Rating | Weight | Availability | Cost | Street Index |
| --- | --- | --- | --- | --- | --- | --- |
| External Simlink Rating 1 | 8 | 1 | .5 | 8/2weeks | 30000 | 2 |
| External Simlink Rating 2 | 8 | 2 | .5 | 8/2weeks | 35000 | 2 |
| External Simlink Rating 3 | 8 | 3 | .5 | 8/2weeks | 40000 | 2 |
| External Simlink Rating 4 | 8 | 4 | .5 | 8/2weeks | 45000 | 2 |
| External Simlink Rating 5 | 8 | 5 | .5 | 8/2weeks | 50000 | 2 |
| External Simlink Rating 6 | 8 | 6 | .5 | 8/2weeks | 55000 | 2 |
| External Simlink Rating 7 | 8 | 7 | .5 | 8/2weeks | 60000 | 2 |
| External Simlink Rating 8 | 8 | 8 | .5 | 8/2weeks | 65000 | 2 |
| External Simlink Rating 9 | 8 | 9 | .5 | 8/2weeks | 70000 | 2 |
| External Simlink Rating 10 | 8 | 10 | .5 | 8/2weeks | 75000 | 2 |
| EC | 5 | 1 | 6 | 8/1week | 10000 | 2 |
| EC | 5 | 2 | 6 | 8/1week | 20000 | 2 |
| EC | 5 | 3 | 6 | 8/1week | 30000 | 2 |
| EC | 5 | 4 | 6 | 8/1week | 40000 | 2 |
| EC | 5 | 5 | 6 | 8/1week | 50000 | 2 |
| EC | 5 | 6 | 6 | 8/1week | 60000 | 2 |
| EC | 5 | 7 | 6 | 8/1week | 70000 | 2 |
| EC | 5 | 8 | 6 | 8/1week | 80000 | 2 |
| EC | 5 | 9 | 6 | 8/1week | 90000 | 2 |
| EC | 5 | 10 | 6 | 8/1week | 100000 | 2 |
| Emotive ASIST Enabler Rating 1 | 5 | 1 | 6 | 8/1week | 25000 | 2 |
| Emotive ASIST Enabler Rating 2 | 5 | 2 | 6 | 8/1week | 50000 | 2 |
| Emotive ASIST Enabler Rating 3 | 5 | 3 | 6 | 8/1week | 75000 | 2 |
| Emotive ASIST Enabler Rating 4 | 5 | 4 | 6 | 8/1week | 100000 | 2 |
| Emotive ASIST Enabler Rating 5 | 5 | 5 | 6 | 8/1week | 125000 | 2 |
| Emotive ASIST Enabler Rating 6 | 5 | 6 | 6 | 8/1week | 150000 | 2 |
| Emotive ASIST Enabler Rating 7 | 5 | 7 | 6 | 8/1week | 175000 | 2 |
| Emotive ASIST Enabler Rating 8 | 5 | 8 | 6 | 8/1week | 200000 | 2 |
| Emotive ASIST Enabler Rating 9 | 5 | 9 | 6 | 8/1week | 225000 | 2 |
| Emotive ASIST Enabler Rating10 | 5 | 10 | 6 | 8/1week | 250000 | 2 |
| Micro Hearing Amplifier Lvl 1 | 11 | 1 | .1 | 6/36hrs | 500 | 1.5 |
| Micro Hearing Amplifier Lvl 2 | 10 | 2 | .2 | 6/36hrs | 1000 | 1.5 |
| Micro Hearing Amplifier Lvl 3 | 9 | 3 | .3 | 6/36hrs | 1500 | 1.5 |
| Micro Hearing Amplifier Lvl 4 | 8 | 4 | .4 | 6/36hrs | 2000 | 1.5 |
| Micro Hearing Amplifier Lvl 5 | 7 | 5 | .5 | 6/36hrs | 2500 | 1.5 |
| Micro Hearing Amplifier Lvl 6 | 6 | 6 | .6 | 6/36hrs | 3000 | 1.5 |
| Micro Hearing Amplifier Lvl 7 | 5 | 7 | .7 | 6/36hrs | 3500 | 1.5 |
| Micro Hearing Amplifier Lvl 8 | 4 | 8 | .8 | 6/36hrs | 4000 | 1.5 |
| Data Codebreaker Lv 1 | 2 | 1 | 5 | 1/10days | 10000 | 1.5 |
| Data Codebreaker Lv 2 | 2 | 2 | 5 | 2/10days | 20000 | 1.5 |
| Data Codebreaker Lv 3 | 2 | 3 | 5 | 3/10days | 30000 | 1.5 |
| Data Codebreaker Lv 4 | 2 | 4 | 5 | 4/10days | 40000 | 1.5 |
| Data Codebreaker Lv 5 | 2 | 5 | 5 | 5/10days | 50000 | 1.5 |
| Data Codebreaker Lv 6 | 2 | 6 | 5 | 6/10days | 60000 | 1.5 |
| Data Codebreaker Lv 7 | 2 | 7 | 5 | 7/10days | 70000 | 1.5 |
| Data Codebreaker Lv 8 | 2 | 8 | 5 | 8/10days | 80000 | 1.5 |
| Data Codebreaker Lv 9 | 2 | 9 | 5 | 9/10days | 90000 | 1.5 |
| Data Codebreaker Lv 10 | 2 | 10 | 5 | 10/10days | 100000 | 1.5 |
| Omega Phone Tap | 5 | 6 | .5 | 10/10days | 35000 | 2 |
| Arasaka | 5 | 4 | 1 | 4/48hrs | 6000 | 1.5 |
| Arasaka | 5 | 4 | 1 | 4/48hsr | 7500 | 1.5 |
| Laser Microphone Lv 1 | 5 | 1 | 1 | 1/48hrs | 1500 | 1.5 |
| Laser Microphone Lv 2 | 5 | 2 | 1 | 2/48hrs | 3000 | 1.5 |
| Laser Microphone Lv 3 | 5 | 3 | 1 | 3/48hrs | 4500 | 1.5 |
| Laser Microphone Lv 4 | 5 | 4 | 1 | 4/48hrs | 6000 | 1.5 |
| Laser Microphone Lv 5 | 5 | 5 | 1 | 5/48hrs | 7500 | 1.5 |
| Laser Microphone Lv 6 | 5 | 6 | 1 | 6/48hrs | 9000 | 1.5 |
| Laser Microphone Lv 7 | 5 | 7 | 1 | 7/48hrs | 10500 | 1.5 |
| Laser Microphone Lv 8 | 5 | 8 | 1 | 8/48hrs | 12000 | 1.5 |
| Laser Microphone Lv 9 | 5 | 9 | 1 | 9/48hrs | 13500 | 1.5 |
| Laser Microphone Lv 10 | 5 | 10 | 1 | 10/48hrs | 15000 | 1.5 |
| Limpet Beacon | 8 | -1 | - | 8/6days | 250 | 1.2 |
| Line Tap Detector | 7 | 1 | - | 4/24hrs | 60 | .8 |
| Chemical Analyzer Lvl 1 | 5 | 1 | .5 | 4/5days | 10000 | 1 |
| Chemical Analyzer Lvl 2 | 5 | 2 | .5 | 4/5days | 12500 | 1 |
| Chemical Analyzer Lvl 3 | 5 | 3 | .5 | 4/5days | 15000 | 1 |
| Chemical Analyzer Lvl 4 | 5 | 4 | .5 | 4/5days | 17500 | 1 |
| Chemical Analyzer Lvl 5 | 5 | 5 | .5 | 4/5days | 20000 | 1 |
| Chemical Analyzer Lvl 6 | 5 | 6 | .5 | 4/5days | 22500 | 1 |
| Chemical Detection System 1 | 3 | 1 | 1 | 12/6 days | 70000 | 1.25 |
| Chemical Detection System 2 | 3 | 2 | 1 | 12/6 days | 140000 | 1.25 |
| Chemical Detection System 3 | 3 | 3 | 1 | 12/6 days | 210000 | 1.25 |
| Gas Detector Lvl 1 | 4 | 1 | .5 | 3/7days | 5000 | 2 |
| Gas Detector Lvl 2 | 4 | 2 | .5 | 6/7days | 20000 | 2 |
| Gas Detector Lvl 3 | 4 | 3 | .5 | 9/7days | 45000 | 2 |
| Gas Detector Lvl 4 | 4 | 4 | .5 | 12/7days | 80000 | 2 |
| Gas Detector Lvl 5 | 4 | 5 | .5 | 15/7days | 125000 | 2 |
| Gas Detector Lvl 6 | 4 | 6 | .5 | 18/7days | 180000 | 2 |
| Gas Spectrometer Lvl 1 | 5 | 1 | .5 | 4/5days | 10000 | 1 |
| Gas Spectrometer Lvl 2 | 5 | 2 | .5 | 4/5days | 12500 | 1 |
| Gas Spectrometer Lvl 3 | 5 | 3 | .5 | 4/5days | 15000 | 1 |
| Gas Spectrometer Lvl 4 | 5 | 4 | .5 | 4/5days | 17500 | 1 |
| Gas Spectrometer Lvl 5 | 5 | 5 | .5 | 4/5days | 20000 | 1 |
| Gas Spectrometer Lvl 6 | 5 | 6 | .5 | 4/5days | 22500 | 1 |
| Arasaka ECM Comm-Scrambler | 4 | 6 | 1 | 6/36hrs | 30000 | 1.2 |
| Data Encryption System Lv 1 | 2 | 1 | 6 | 1/14days | 1000 | 2 |
| Data Encryption System Lv 2 | 2 | 2 | 6 | 2/14days | 2000 | 2 |
| Data Encryption System Lv 3 | 2 | 3 | 6 | 3/14days | 3000 | 2 |
| Data Encryption System Lv 4 | 2 | 4 | 6 | 4/14days | 4000 | 2 |
| Data Encryption System Lv 5 | 2 | 5 | 6 | 5/14days | 5000 | 2 |
| Data Encryption System Lv 6 | 2 | 6 | 6 | 6/14days | 6000 | 2 |
| Data Encryption System Lv 7 | 2 | 7 | 6 | 7/14days | 7000 | 2 |
| Data Encryption System Lv 8 | 2 | 8 | 6 | 8/14days | 8000 | 2 |
| Data Encryption System Lv 9 | 2 | 9 | 6 | 9/14days | 9000 | 2 |
| Data Encryption System Lv 10 | 2 | 10 | 6 | 10/14days | 10000 | 2 |
| Radio Scrambler Level 1 | - | 1 | - | 5/24hrs | 1000 | 1 |
| Radio Scrambler Level 2 | - | 2 | - | 5/24hrs | 2000 | 1 |
| Radio Scrambler Level 3 | - | 3 | - | 5/24hrs | 3000 | 1 |
| Radio Scrambler Level 4 | - | 4 | - | 5/24hrs | 4000 | 1 |
| Radio Scrambler Level 5 | - | 5 | - | 5/24hrs | 10000 | 1.25 |
| Radio Scrambler Level 6 | - | 6 | - | 5/24hrs | 12000 | 1.25 |
| Radio Scrambler Level 7 | - | 7 | - | 5/24hrs | 14000 | 1.25 |
| Radio Scrambler Level 8 | - | 8 | - | 6/36hrs | 24000 | 1.5 |
| Radio Scrambler Level 9 | - | 9 | - | 6/36hrs | 27000 | 1.5 |
| Radio Scrambler Level 10 | - | 10 | - | 8/36hrs | 50000 | 1.25 |
| Dataline Scanner Lv 1 | 2 | 1 | 6 | 1/14days | 100 | 2 |
| Dataline Scanner Lv 2 | 2 | 2 | 6 | 2/14days | 200 | 2 |
| Dataline Scanner Lv 3 | 2 | 3 | 6 | 3/14days | 300 | 2 |
| Dataline Scanner Lv 4 | 2 | 4 | 6 | 4/14days | 400 | 2 |
| Dataline Scanner Lv 5 | 2 | 5 | 6 | 5/14days | 500 | 2 |
| Dataline Scanner Lv 6 | 2 | 6 | 6 | 6/14days | 600 | 2 |
| Dataline Scanner Lv 7 | 2 | 7 | 6 | 7/14days | 700 | 2 |
| Dataline Scanner Lv 8 | 2 | 8 | 6 | 8/14days | 800 | 2 |
| Dataline Scanner Lv 9 | 2 | 9 | 6 | 9/14days | 900 | 2 |
| Dataline Scanner Lv 10 | 2 | 10 | 6 | 10/14days | 1000 | 2 |
| Arasaka R-101 Lie Detector | 2 | 6 | 3 | 14/20days | 5000 | 4 |
| White Noise Generator Lv 1 | 3 | 1 | 1 | 1/72hrs | 1500 | 1.5 |
| White Noise Generator Lv 2 | 3 | 2 | 1 | 2/72hrs | 3000 | 1.5 |
| White Noise Generator Lv 3 | 3 | 3 | 1 | 3/72hrs | 4500 | 1.5 |
| White Noise Generator Lv 4 | 3 | 4 | 1 | 4/72hrs | 6000 | 1.5 |
| White Noise Generator Lv 5 | 3 | 5 | 1 | 5/72hrs | 7500 | 1.5 |
| White Noise Generator Lv 6 | 3 | 6 | 1 | 6/72hrs | 9000 | 1.5 |
| White Noise Generator Lv 7 | 3 | 7 | 1 | 7/72hrs | 10500 | 1.5 |
| White Noise Generator Lv 8 | 3 | 8 | 1 | 8/72hrs | 12000 | 1.5 |
| White Noise Generator Lv 9 | 3 | 9 | 1 | 9/72hrs | 13500 | 1.5 |
| White Noise Generator Lv 10 | 3 | 10 | 1 | 10/72hrs | 15000 | 1.5 |
| BRL-3014 Window Trembler 1 | 9 | 1 | 2/4days | 120 | 2.5 |  |
| BRL-3014 Window Trembler 2 | 9 | 2 | 3/4days | 240 | 2.5 |  |
| BRL-3014 Window Trembler 3 | 9 | 3 | 4/4days | 360 | 2.5 |  |
| BRL-3014 Window Trembler 4 | 9 | 4 | 5/4days | 480 | 2.5 |  |
| BRL-3014 Window Trembler 5 | 9 | 5 | 6/4days | 600 | 2.5 |  |
| BRL-3014 Window Trembler 6 | 9 | 6 | 7/4days | 720 | 2.5 |  |
| BRL-3014 Window Trembler 7 | 9 | 7 | 8/4days | 840 | 2.5 |  |
| BRL-3014 Window Trembler 8 | 9 | 8 | 9/4days | 960 | 2.5 |  |
| BRL-3014 Window Trembler 9 | 9 | 9 | 10/4days | 1080 | 2.5 |  |
| BRL-3014 Window Trembler 10 | 9 | 10 | 11/4days | 1200 | 2.5 |  |
| Maglock Lvl 1 | - | 1 | - | 2/72hrs | 100 | 1 |
| Maglock Lvl 2 | - | 2 | - | 2/72hrs | 200 | 1 |
| Maglock Lvl 3 | - | 3 | - | 3/72hrs | 300 | 1 |
| Maglock Lvl 4 | - | 4 | - | 4/72hrs | 400 | 1 |
| Maglock Lvl 5 | - | 5 | - | 5/72hrs | 500 | 1 |
| Maglock Lvl 6 | - | 6 | - | 6/72hrs | 600 | 1 |
| Maglock Lvl 7 | - | 7 | - | 7/72hrs | 700 | 1 |
| Maglock Lvl 8 | - | 8 | - | 8/72hrs | 800 | 1 |
| Maglock Lvl 9 | - | 9 | - | 9/72hrs | 900 | 1 |
| Maglock Lvl 10 | - | 10 | - | 10/72hrs | 1000 | 1 |
| Type I Maglock (rating 1) | - | 1 | - | 2/2days | 75 | .75 |
| Type I Maglock (rating 2) | - | 2 | - | 2/2days | 150 | .75 |
| Type I Maglock (rating 3) | - | 3 | - | 3/2days | 225 | .75 |
| Type II Maglock (rating 4) | - | 4 | - | 4/3days | 400 | 1 |
| Type II Maglock (rating 5) | - | 5 | - | 5/3days | 500 | 1 |
| Type II Maglock (rating 6) | - | 6 | - | 6/3days | 600 | 1 |
| Type III Maglock (rating 7) | - | 7 | - | 7/3.5days | 1050 | 1.25 |
| Type III Maglock (rating 8) | - | 8 | - | 8/3.5days | 1200 | 1.25 |
| Type III Maglock (rating 9) | - | 9 | - | 9/3.5days | 1350 | 1.25 |
| Type IV Maglock (rating 10) | - | 10 | - | 10/4days | 2500 | 1.5 |
| Type III Biometric Maglock (7) | - | 7 | - | 7/5days | 2450 | 2 |
| Type III Biometric Maglock (8) | - | 8 | - | 8/5days | 2800 | 2 |
| Type III Biometric Maglock (9) | - | 9 | - | 9/5days | 3150 | 2 |
| Type IV Biometric Maglock (10) | - | 10 | - | 10/5days | 3500 | 2 |
| SecSystems Maglock | 3 | 3 | 1 | 4/72hrs | 300 | 1 |
| Smartlock Door Sec. System 1 | - | 1 | - | 5/72hrs | 250 | 1.5 |
| Smartlock Door Sec. System 2 | - | 2 | - | 5/72hrs | 500 | 1.5 |
| Smartlock Door Sec. System 3 | - | 3 | - | 5/72hrs | 750 | 1.5 |
| Smartlock Door Sec. System 4 | - | 4 | - | 5/72hrs | 1000 | 1.5 |
| Smartlock Door Sec. System 5 | - | 5 | - | 5/72hrs | 1250 | 1.5 |
| Smartlock Door Sec. System 6 | - | 6 | - | 5/72hrs | 1500 | 1.5 |
| Smartlock Door Sec. System 7 | - | 7 | - | 5/72hrs | 1750 | 1.5 |
| Smartlock Door Sec. System 8 | - | 8 | - | 5/72hrs | 2000 | 1.5 |
| Scanway Chem | - | 5 | - | 9/7days | 350000 | 1 |
| Scanway Cyberware detector | - | 5 | - | 8/7days | 50000 | 1 |
| Scanway Weapon Detector | - | 5 | - | 6/7days | 25000 | 1 |
| Scanway Large screen | - | - | - | as detector | 500 | 1 |
| Scanman Full Identity Scanner | 4 | 5 | 2.5 | 14/14days | 21000 | 5 |
| SecSystems Detection Wand | 4 | 2 | .5 | 2/12hrs | 10000 | 1 |
| Keypad Sequencer Level 1 | - | 1 | .5 | 2/10days | 500 | 1 |
| Keypad Sequencer Level 2 | - | 2 | .5 | 2/10days | 2000 | 1 |
| Keypad Sequencer Level 3 | - | 3 | .5 | 2/10days | 4500 | 1 |
| Keypad Sequencer Level 4 | - | 4 | .5 | 2/10days | 8000 | 1 |
| Keypad Sequencer Level 5 | - | 5 | .5 | 2/10days | 12500 | 1 |
| Keypad Sequencer Level 6 | - | 6 | .5 | 3/10days | 18000 | 1 |
| Maglock Passkey Lvl 1 | - | 1 | 1 | 2/10days | 10000 | 3 |
| Maglock Passkey Lvl 2 | - | 2 | 1 | 4/10days | 20000 | 3 |
| Maglock Passkey Lvl 3 | - | 3 | 1 | 6/10days | 30000 | 3 |
| Maglock Passkey Lvl 4 | - | 4 | 1 | 8/10days | 40000 | 3 |
| Maglock Passkey Lvl 5 | - | 5 | 1 | 10/10days | 50000 | 3 |
| Maglock Passkey Lvl 6 | - | 6 | 1 | 12/10days | 60000 | 3 |
| Maglock Passkey Lvl 7 | - | 7 | 1 | 14/10days | 70000 | 3 |
| Maglock Passkey Lvl 8 | - | 8 | 1 | 16/10days | 80000 | 3 |
| Maglock Passkey Lvl 9 | - | 9 | 1 | 18/10days | 90000 | 3 |
| Maglock Passkey Lvl 10 | - | 10 | 1 | 20/10days | 100000 | 3 |
| Restraints | 3 | 12 | .5 | 4/48hrs | 50 | 1 |
| Restraints | 3 | 15 | - | 4/48hrs | 20 | 1 |
| Restraints | 4 | - | - | 6/72hrs | 100 | 2 |
| ANQ 3 | 4 | 3 | 1 | 6/48hrs | 1000 | 2.5 |
| Arasaka Omnitec Radar Detector | 7 | 4 | 1 | 4/72hrs | 2000 | 1.5 |
| ID badgemaker | 3 | 3 | 1 | 5/48hrs | 500 | 2 |
| Laser Detector Lvl 1 | 6 | 1 | .3 | 8/72hrs | 5000 | 1.5 |
| Laser Detector Lvl 2 | 6 | 2 | .3 | 8/72hrs | 10000 | 1.5 |
| Laser Detector Lvl 3 | 6 | 3 | .3 | 8/72hrs | 15000 | 1.5 |
| Laser Detector Lvl 4 | 6 | 4 | .3 | 8/72hrs | 20000 | 1.5 |
| Laser Detector Lvl 5 | 6 | 5 | .3 | 8/72hrs | 25000 | 1.5 |
| Laser Detector Lvl 6 | 6 | 6 | .3 | 8/72hrs | 30000 | 1.5 |
| M-0116 Tripwire Sensor | 6 | 1 | - | 3/24hrs | 20 | 1 |
| Magnetic Anomaly Detector Lv 1 | 3 | 1 | 1 | 8/4days | 5000 | 1 |
| Magnetic Anomaly Detector Lv 2 | 3 | 2 | 1 | 8/4days | 10000 | 1 |
| Magnetic Anomaly Detector Lv 3 | 3 | 3 | 1 | 8/4days | 15000 | 1 |
| Magnetic Anomaly Detector Lv 4 | 3 | 4 | 1 | 8/4days | 20000 | 1 |
| MS1803 Panoramic Motion Sensor | 2 | 5 | 2.5 | 8/48hrs | 1000 | 2 |
| Portable Motion Detector Lvl 1 | - | 1 | 2 | 4/24hrs | 200 | 1.25 |
| Portable Motion Detector Lvl 2 | - | 2 | 2 | 4/24hrs | 400 | 1.25 |
| Portable Motion Detector Lvl 3 | - | 3 | 2 | 4/24hrs | 600 | 1.25 |
| Portable Motion Detector Lvl 4 | - | 4 | 2 | 4/24hrs | 800 | 1.25 |
| Portable Motion Detector Lvl 5 | - | 5 | 2 | 4/24hrs | 1000 | 1.25 |
| Retinal Pattern Duplicator 1 | 3 | 1 | 1 | 14/10days | 60000 | 1 |
| Retinal Pattern Duplicator 2 | 3 | 2 | 1 | 14/10days | 120000 | 1 |
| Retinal Pattern Duplicator 3 | 3 | 3 | 1 | 14/10days | 180000 | 1 |
| Retinal Pattern Duplicator 4 | 3 | 4 | 1 | 14/10days | 240000 | 1 |
| Retinal Pattern Duplicator 5 | 3 | 5 | 1 | 14/10days | 300000 | 1 |
| Retinal Pattern Duplicator 6 | 3 | 6 | 1 | 14/10days | 360000 | 1 |
| Retinal Pattern Duplicator 7 | 3 | 7 | 1 | 14/10days | 420000 | 1 |
| Retinal Pattern Duplicator 8 | 3 | 8 | 1 | 14/10days | 480000 | 1 |
| Retinal Pattern Duplicator 9 | 3 | 9 | 1 | 14/10days | 540000 | 1 |
| Retinal Pattern Duplicator 10 | 3 | 10 | 1 | 14/10days | 600000 | 1 |
| Retinal Pattern Input Dev. 1 | 4 | 1 | .5 | 10/6days | 1000 | 4 |
| Retinal Pattern Input Dev. 2 | 4 | 2 | .5 | 10/6days | 2000 | 4 |
| Retinal Pattern Input Dev. 3 | 4 | 3 | .5 | 10/6days | 3000 | 4 |
| Retinal Pattern Input Dev. 4 | 4 | 4 | .5 | 10/6days | 4000 | 4 |
| Retinal Pattern Input Dev. 5 | 4 | 5 | .5 | 10/6days | 5000 | 4 |
| Retinal Pattern Input Dev. 6 | 4 | 6 | .5 | 10/6days | 6000 | 4 |
| Retinal Pattern Input Dev. 7 | 4 | 7 | .5 | 10/6days | 7000 | 4 |
| Retinal Pattern Input Dev. 8 | 4 | 8 | .5 | 10/6days | 8000 | 4 |
| Retinal Pattern Input Dev. 9 | 4 | 9 | .5 | 10/6days | 9000 | 4 |
| S91KA Remote Heat Sensor | 4 | 8 | .5 | 4/48hrs | 2000 | 1.5 |
| Sonar Scanner | 4 | 3 | .2 | 5/48hrs | 50 | 1.2 |
| Superball Lvl 1 (per meter) | - | 1 | - | 2/48hrs | 50 | 3 |
| Superball Lvl 2 (per meter) | - | 2 | - | 4/48hrs | 100 | 3 |
| Superball Lvl 3 (per meter) | - | 3 | - | 6/48hrs | 150 | 3 |
| Superball Lvl 4 (per meter) | - | 4 | - | 8/48hrs | 200 | 3 |
| Superball Lvl 5 (per meter) | - | 5 | - | 10/48hrs | 250 | 3 |
| Superball Lvl 6 (per meter) | - | 6 | - | 12/48hrs | 300 | 3 |
| Superball Lvl 7 (per meter) | - | 7 | - | 14/48hrs | 350 | 3 |
| Superball Lvl 8 (per meter) | - | 8 | - | 16/48hrs | 400 | 3 |
| Superball Lvl 9 (per meter) | - | 9 | - | 18/48hrs | 450 | 3 |
| Superball Lvl 10 (per meter) | - | 10 | - | 20/48hrs | 500 | 3 |
| Print Duplication Supplies 1 | - | 1 | - | 4/12hrs | 200 | 1 |
| Print Duplication Supplies 2 | - | 2 | - | 4/12hrs | 400 | 1 |
| Print Duplication Supplies 3 | - | 3 | - | 4/12hrs | 600 | 1 |
| Print Duplication Supplies 4 | - | 4 | - | 4/12hrs | 800 | 1 |
| U-Open-It Rating 1 | 2 | 1 | 5 | 6/48hrs | 75 | 2 |
| U-Open-It Rating 2 | 2 | 1 | 5 | 6/48hrs | 150 | 2 |
| U-Open-It Rating 3 | 2 | 1 | 5 | 6/48hrs | 225 | 2 |
| U-Open-It Rating 4 | 2 | 1 | 5 | 6/48hrs | 300 | 2 |
| U-Open-It Rating 5 | 2 | 1 | 5 | 6/48hrs | 375 | 2 |
| Buchsterhude GmbH Tool Kits | - | - | 5 | 6/48hrs | 1000 | 2 |
| Tech Tool Kit 21 | 3 | - | 5 | 5/48hrs | 350 | 2 |
| Electronics Toolkit 21 | 3 | - | 5 | 5/48hrs | 1350 | 2 |
| Arc Furnace | - | - | - | 6/7days | 10000 | 1 |
| Barbed Wire (per 100 meters) | - | 3L | 20 | always | 25 | .75 |
| CTS Pembroke Techscanner | - | -1 | 5 | 9/72hrs | 1500 | 3.5 |
| Duct Tape (per 35 meters) | - | - | - | always | 10 | 1 |
| Tech Scanner 21 | 3 | - | 5 | 5/48hrs | 1200 | 2 |
| Portable Cryogenic Case | 2 | armor 2/2 | 2 | 6/12hrs | 250 | 1.2 |
| Geotech Enviroscanner | 5 | 3 | 1 | 8/7days | 45000 | 3 |
| Geotech Enviroscanner | 6 | 4 | 1 | 4/24hrs | 1400 | 1.2 |
| Kendachi Monowire (per meter) | - | - | - | 8/7days | 60 | 2.5 |
| Microtech Virtual Reality BBS | - | -1 | - | 6/7days | 10000 | 1 |
| Monowire (per meter) | - | - | - | always | 2 | 1 |
| Portable Electropack | 3 | - | 2 | always | 100 | 1 |
| Portable Fire Extinguisher | 2 | 4 | 9 | 2/12 hrs | 150 | .8 |
| Raven Interface Monitor | 5 | -1 | 1 | 6/48hrs | 8000 | 1 |
| Microwaldo | - | - | 2 | 8/72hrs | 8000 | 3.25 |
| Microwaldo | - | - | 2 | 6/72hrs | 7000 | 3 |
| Raven | - | - | 25 | 10/7days | 8000 | 3.5 |
| Razor Wire (per 100 meters) | - | 3M | 25 | 3/48hrs | 75 | 1 |
| Swiss Army Chronograph | - | - | - | always | 120 | 1 |
| Diagnostic Remote | - | - | 1 | 8/72hrs | 5000 | 3.25 |
| Diagnostic Remote | - | - | 1 | 6/72hrs | 4000 | 3 |
| Telectronics Micromanipulator | - | - | - | 8/72hrs | 3000 | 3 |

### Vehiclegear
| Name | Availability | Cost | Street Index |
| --- | --- | --- | --- |
| Anti-Theft System Level 1 |  | 100 |  |
| Anti-Theft System Level 2 |  | 200 |  |
| Anti-Theft System Level 3 |  | 300 |  |
| Anti-Theft System Level 4 |  | 1600 |  |
| Anti-Theft System Level 5 |  | 2000 |  |
| Anti-Theft System Level 6 |  | 2400 |  |
| Anti-Theft System Level 7 |  | 7000 |  |
| Anti-Theft System Level 8 |  | 8000 |  |
| Anti-Theft System Level 9 |  | 9000 |  |
| Anti-Theft System Level 10 |  | 50000 |  |
| Standard Tires (Vehicle Body 1) |  | 50 |  |
| Standard Tires (Vehicle Body 2) |  | 100 |  |
| Standard Tires (Vehicle Body 3) |  | 150 |  |
| Standard Tires (Vehicle Body 4) |  | 200 |  |
| Standard Tires (Vehicle Body 5) |  | 250 |  |
| Performance Tires (Vehicle Body 1) |  | 75 |  |
| Performance Tires (Vehicle Body 2) |  | 150 |  |
| Performance Tires (Vehicle Body 3) |  | 225 |  |
| Performance Tires (Vehicle Body 4) |  | 300 |  |
| Performance Tires (Vehicle Body 5) |  | 375 |  |
| Off-road Tires (Vehicle Body 1) |  | 125 |  |
| Off-road Tires (Vehicle Body 2) |  | 250 |  |
| Off-road Tires (Vehicle Body 3) |  | 375 |  |
| Off-road Tires (Vehicle Body 4) |  | 500 |  |
| Off-road Tires (Vehicle Body 5) |  | 625 |  |
| Dual-Purpose Tires (Vehicle Body 1) |  | 250 |  |
| Dual-Purpose Tires (Vehicle Body 2) |  | 500 |  |
| Dual-Purpose Tires (Vehicle Body 3) |  | 750 |  |
| Dual-Purpose Tires (Vehicle Body 4) |  | 1000 |  |
| Dual-Purpose Tires (Vehicle Body 5) |  | 1250 |  |
| Standard Tires - Runflat (Vehicle Body 1) |  | 250 |  |
| Standard Tires - Runflat (Vehicle Body 2) |  | 500 |  |
| Standard Tires - Runflat (Vehicle Body 3) |  | 750 |  |
| Standard Tires - Runflat (Vehicle Body 4) |  | 1000 |  |
| Standard Tires - Runflat (Vehicle Body 5) |  | 1250 |  |
| Performance Tires - Runflat (Vehicle Body 1) |  | 275 |  |
| Performance Tires - Runflat (Vehicle Body 2) |  | 550 |  |
| Performance Tires - Runflat (Vehicle Body 3) |  | 825 |  |
| Performance Tires - Runflat (Vehicle Body 4) |  | 1150 |  |
| Performance Tires - Runflat (Vehicle Body 5) |  | 1375 |  |
| Off-road Tires - Runflat (Vehicle Body 1) |  | 325 |  |
| Off-road Tires - Runflat (Vehicle Body 2) |  | 650 |  |
| Off-road Tires - Runflat (Vehicle Body 3) |  | 975 |  |
| Off-road Tires - Runflat (Vehicle Body 4) |  | 1300 |  |
| Off-road Tires - Runflat (Vehicle Body 5) |  | 1625 |  |
| Dual-Purpose Tires - Runflat (Vehicle Body 1) |  | 450 |  |
| Dual-Purpose Tires - Runflat (Vehicle Body 2) |  | 900 |  |
| Dual-Purpose Tires - Runflat (Vehicle Body 3) |  | 1350 |  |
| Dual-Purpose Tires - Runflat (Vehicle Body 4) |  | 1800 |  |
| Dual-Purpose Tires - Runflat (Vehicle Body 5) |  | 2250 |  |
| Sidecar (Bike Body 1) |  | 1000 |  |
| Sidecar (Bike Body 2) |  | 2000 |  |
| Sidecar (Bike Body 3) |  | 3500 |  |
| Remote Control Gear | 4/72hrs | 2500xBody | 2 |
| Vehicle Control Gear | 4/7days | 2800 | 2 |
| Remote Control Deck (R1) | 4/72hrs | 5000 |  |
| Remote Control Deck (R2) | 4/72hrs | 10000 |  |
| Remote Control Deck (R3) | 4/72hrs | 15000 |  |
| Remote Control Deck (R4) | 4/72hrs | 20000 |  |
| Remote Control Deck (R5) | 4/72hrs | 25000 |  |
| Remote Control Deck (R6) | 4/72hrs | 30000 |  |
| Remote Control Deck (R7) | 4/72hrs | 35000 |  |
| Remote Control Deck (R68) | 4/72hrs | 40000 |  |
| Remote Control Deck (R9) | 4/72hrs | 45000 |  |
| Remote Control Deck (R10) | 4/72hrs | 50000 |  |
| Charges for Smokegen. (6) | 4/72hrs | 700 | 2 |
| Charges for Smokegen. (12) | 4/7days | 1000 | 2 |
| Abl. Vehicle Armor Level 1 | 8/14days | 700 | 2 |
| Abl. Vehicle Armor Level 2 | 12/14days | 1600 | 2 |
| Abl. Vehicle Armor Level 3 | 14/21days | 2500 | 2 |
| Sentinel Pod I | 5/1week | 3000 | 2 |
| Sentinel Pod II | 6/1week | 3500 | 2 |
| Sentinel Pod III | 6/2weeks | 5000 | 2 |
| Sentinel Pod IV | 8/2weeks | 7500 | 2 |

### VehicleFire
| Name | Type | Ammunition | Mode | Damage | Weight | Availability | Cost | Street Index |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Ares Firelance Vehicle Laser | Assault | 40 | SA | 15S | 48 | GM | 300000 | GM |
| Autocannon | Cannon | 10(c) | SA | 12D | 45 | GM | 12000 | GM |
| Flechette Gun | MMG | 20(c) | SA/FA | 9D(f) | 45 | 14/14days | 17000 | 1.5 |
| Gauss Gun | Cannon | 10(c) | SS | 11S | 135 | - | 500000 | - |
| Rocket Launcher | Assault | 6(b) | SS | (Rocket) | 15 | GM | 15000 | GM |
| Ruhrmetall GPRL for vehicles | Missile | 4(m) | SS | (Missile) | 10 | 14/30days | 12000 | 4 |
| Ruhrmetall SF20 for vehicles | HMG | 200(beltbox) | BF/FA | 10S | 16 | 18/30days | 8500 | .5 |
| Twin Laser | Sniper | (Special) | SA | 18S | 340 | - | 700000 | - |
| Vanquisher Minigun | HMG | 100 | FA | 10S | 45 | GM | 75000 | GM |
| Vangeance Minigun | HMG | 100 | FA | 9S | 30 | GM | 50000 | GM |
| Vehicular Shotgun | Shotgun | 10(c) | SA | 9S | 8.5 | 8/72hrs | 2500 | 1.75 |
| Victory Rotary Assault Cannon | Cannon | 50 | FA | 18D | 90 | GM | 90000 | GM |
| Vigilant Rotary Autocannon | Cannon | 25 | FA | 20D | 60 | GM | 125000 | GM |
| Water Cannon | "Shotgun" | 40 | "SA" | 6M Stun | 12 | GM | 20000 | GM |

### Vehicle modifications
| Name | Cost | Equipment | CF |
| --- | --- | --- | --- |
| APPS (per seat) | 2500 | Facility | 1 |
| Autopilot Rating 1 | BODY x 500 | Facility | 0 |
| Autopilot Rating 2 | BODY x 5000 | Facility | 0 |
| Autopilot Rating 3 | BODY x 10000 | Facility | 0 |
| Autopilot Rating 4 | BODY x 25000 | Facility | 0 |
| Bench Seat | 750 | Shop | 5 |
| Bench Seat | 50 | Shop | 5 |
| Boat Hull Modification | BODY x 500 | Facility | 0 |
| Bucket Seat | 700 | Shop | 5 |
| Bucket Seat | 750 | Shop | 6 |
| Convertible Top | 2500 + 10% of vehicle | Shop | 0 |
| Crash Cage | 3500 | Shop | 7 |
| Crash Cage | 4000 | Shop | 8 |
| Datajack Link | 2500 | Facility | 2 |
| EnviroSeal (Gas) (Vehicle Body 1) | 250 | Facility | 1 |
| EnviroSeal (Gas) (Vehicle Body 2) | 500 | Facility | 1 |
| EnviroSeal (Gas) (Vehicle Body 3) | 750 | Facility | 1 |
| EnviroSeal (Gas) (Vehicle Body 4) | 1000 | Facility | 1 |
| EnviroSeal (Gas) (Vehicle Body 5) | 1250 | Facility | 1 |
| EnviroSeal (Water) (Vehicle Body 1) | 750 | Facility | 1 |
| EnviroSeal (Water) (Vehicle Body 2) | 1500 | Facility | 1 |
| EnviroSeal (Water) (Vehicle Body 3) | 2250 | Facility | 1 |
| EnviroSeal (Water) (Vehicle Body 4) | 3000 | Facility | 1 |
| EnviroSeal (Water) (Vehicle Body 5) | 3750 | Facility | 1 |
| EnviroSeal (Engine) (Vehicle Body 1) | 1000 | Facility | 1 |
| EnviroSeal (Engine) (Vehicle Body 2) | 2000 | Facility | 1 |
| EnviroSeal (Engine) (Vehicle Body 3) | 3000 | Facility | 1 |
| EnviroSeal (Engine) (Vehicle Body 4) | 4000 | Facility | 1 |
| EnviroSeal (Engine) (Vehicle Body 5) | 5000 | Facility | 1 |
| External Luggage | 250 | Shop | 0 |
| GridLink Power | 600 | Facility | 3 |
| Headlights | 1250 | Shop | 0 |
| Headlights | 500 | Shop | 0 |
| Life Support (10 man-hours) | 1500 | Shop | 1 |
| Reinforced Seating | 250 | Shop | 1 |
| Roll Bars | 2000 | Shop | 2 |
| Secondary Controls | 400 | Facility | 2 |
| SunCell Power | 500 | Shop | 1 |
| Amphibious Package lvl 1 | 2500 | Facility | 0 |
| Amphibious Package lvl 2 | 7500 | Facility | 2 |
| Amphibious Package lvl 3 | 15000 | Facility | 3 |
| Bucket Seat | 3000 | Facility | 8 |
| Drone Rack | BODY x 1000 | - | Drone's CF +2 |
| Integrated Controls | 1500 | Facility | 2 |
| Rigger Control Gear | BODY x 2500 | Facility | 2(6) |
| Vehicle Sensors Level 0 | 0 | - | 0 |
| Vehicle Sensors Level 1 | 5000 | - | 0 |
| Vehicle Sensors Level 2 | 15000 | - | 1 |
| Vehicle Sensors Level 3 | 45000 | - | 2 |
| Vehicle Sensors Level 4 | 120000 | - | 1 |
| Vehicle Sensors Level 5 | 360000 | - | 2 |
| Vehicle Sensors Level 6 | 1250000 | - | 3 |
| Vehicle Sensors Level 7 | 3000000 | - | 4 |
| ECM Level 1 | 25000 | - | 1 |
| ECM Level 2 | 75000 | - | 2 |
| ECM Level 3 | 225000 | - | 4 |
| ECM Level 4 | 800000 | - | 2 |
| ECM Level 5 | 2400000 | - | 3 |
| ECM Level 6 | 6000000 | - | 4 |
| ECCM Level 1 | 20000 | - | 2 |
| ECCM Level 2 | 70000 | - | 3 |
| ECCM Level 3 | 190000 | - | 5 |
| ECCM Level 4 | 700000 | - | 3 |
| ECCM Level 5 | 2000000 | - | 4 |
| ECCM Level 6 | 5000000 | - | 5 |
| Firmpoint | 750 | - | 1 |
| Hardpoint Single Centerline | 1000 | - | 2 |
| Hardpoint Dual Centerline | 1750 | - | 3 |
| Hardpoint Wing/Fairing | 750 | - | .5 |
| External Micro Turret | 5000 | - | 2 |
| External Small Turret | 7500 | - | 3 |
| External Medium Turret | 15000 | - | 4 |
| Pop-Up Remote Micro Turret | 18000 | - | 2 |
| Pop-Up Remote Small Turret | 27000 | - | 4 |
| Pop-Up Remote Medium Turret | 52500 | - | 6 |
| Remote Micro Turret | 6000 | - | 1 |
| Remote Small Turret | 9000 | - | 2 |
| Remote Medium Turret | 17500 | - | 3 |
| Pop-Up Micro Turret | 15000 | - | 4 |
| Pop-Up Small Turret | 22500 | - | 6 |
| Pop-Up Medium Turret | 45000 | - | 8 |
| External Rack Mount(1 missile) | 1000 | - | 0 |
| Pintle Mount | 50 | - | 0 |
| Ring Mount | 1500 | - | 0 |
| Ring Mount with Hatch | 2000 | - | 0 |
| Ring Mount | 3000 | - | 1 |

### Cyberware (system list)
#### Bodyware
| Name | EssCost | Cost | StreetIndex | Mods | Book |
| --- | --- | --- | --- | --- | --- |
| Boosted Reflexes 1 | 0.5 | 15000 | 1.0 | +1INI | ssc.??? |
| Boosted Reflexes 2 | 1.25 | 40000 | 1.0 | +1RCT,+1INI | ssc.??? |
| Boosted Reflexes 3 | 2.8 | 90000 | 1.0 | +2RCT,+2INI | ssc.??? |
| Dermal Plating 1 | 0.5 | 6000 | 1.0 | +1BOD | sr2.x |
| Dermal Plating 2 | 1.0 | 15000 | 1.0 | +2BOD | sr2.x |
| Dermal Plating 3 | 1.5 | 45000 | 1.0 | +3BOD | sr2.x |
| Filter: Air 1 | 0.1 | 15000 | 1.0 |  | sr2.x |
| Filter: Air 2 | 0.2 | 30000 | 1.0 |  | sr2.x |
| Filter: Air 3 | 0.3 | 45000 | 1.0 |  | sr2.x |
| Filter: Air 4 | 0.4 | 60000 | 1.0 |  | sr2.x |
| Filter: Air 5 | 0.5 | 75000 | 1.0 |  | sr2.x |
| Filter: Air 6 | 0.6 | 90000 | 1.0 |  | sr2.x |
| Filter: Air 7 | 0.7 | 105000 | 1.0 |  | sr2.x |
| Filter: Air 8 | 0.8 | 120000 | 1.0 |  | sr2.x |
| Filter: Air 9 | 0.9 | 135000 | 1.0 |  | sr2.x |
| Filter: Air 10 | 1.0 | 150000 | 1.0 |  | sr2.x |
| Filter: Blood 1 | 0.2 | 15000 | 1.0 |  | sr2.x |
| Filter: Blood 2 | 0.4 | 30000 | 1.0 |  | sr2.x |
| Filter: Blood 3 | 0.6 | 45000 | 1.0 |  | sr2.x |
| Filter: Blood 4 | 0.8 | 60000 | 1.0 |  | sr2.x |
| Filter: Blood 5 | 1.0 | 75000 | 1.0 |  | sr2.x |
| Filter: Blood 6 | 1.2 | 90000 | 1.0 |  | sr2.x |
| Filter: Blood 7 | 1.4 | 105000 | 1.0 |  | sr2.x |
| Filter: Blood 8 | 1.6 | 120000 | 1.0 |  | sr2.x |
| Filter: Blood 9 | 1.8 | 135000 | 1.0 |  | sr2.x |
| Filter: Blood 10 | 2.0 | 150000 | 1.0 |  | sr2.x |
| Filter: Toxin 1 | 0.2 | 15000 | 1.0 |  | sr2.x |
| Filter: Toxin 2 | 0.4 | 30000 | 1.0 |  | sr2.x |
| Filter: Toxin 3 | 0.6 | 45000 | 1.0 |  | sr2.x |
| Filter: Toxin 4 | 0.8 | 60000 | 1.0 |  | sr2.x |
| Filter: Toxin 5 | 1.0 | 75000 | 1.0 |  | sr2.x |
| Filter: Toxin 6 | 1.2 | 90000 | 1.0 |  | sr2.x |
| Filter: Toxin 7 | 1.4 | 105000 | 1.0 |  | sr2.x |
| Filter: Toxin 8 | 1.6 | 120000 | 1.0 |  | sr2.x |
| Filter: Toxin 9 | 1.8 | 135000 | 1.0 |  | sr2.x |
| Filter: Toxin 10 | 2.0 | 150000 | 1.0 |  | sr2.x |
| Muscle Replac. 1 | 1.0 | 20000 | 1.0 | +1QCK,+1STR | sr2.x |
| Muscle Replac. 2 | 2.0 | 40000 | 1.0 | +2QCK,+2STR | sr2.x |
| Muscle Replac. 3 | 3.0 | 60000 | 1.0 | +3QCK,+3STR | sr2.x |
| Muscle Replac. 4 | 4.0 | 80000 | 1.0 | +4QCK,+4STR | sr2.x |
| Skillwires 1 | 0.1 | 10000 | 1.0 |  | sr2.x |
| Skillwires 2 | 0.2 | 20000 | 1.0 |  | sr2.x |
| Skillwires 3 | 0.3 | 30000 | 1.0 |  | sr2.x |
| Skillwires 4 | 0.4 | 40000 | 1.0 |  | sr2.x |
| Skillwires 5 | 1.0 | 500000 | 1.0 |  | sr2.x |
| Skillwires 6 | 1.2 | 600000 | 1.0 |  | sr2.x |
| Skillwires 7 | 2.1 | 7000000 | 1.0 |  | sr2.x |
| Skillwires 8 | 2.4 | 8000000 | 1.0 |  | sr2.x |
| Skillwires 9 | 2.7 | 9000000 | 1.0 |  | sr2.x |
| Siemens Rigit!F1 | 0.5 | 25000 | 1.0 | +1INI | sr2.x |
| Wired Reflexes 1 | 2.0 | 55000 | 1.0 | +2RCT,+1INI | sr2.x |
| Wired Reflexes 2 | 3.0 | 165000 | 1.0 | +4RCT,+2INI | sr2.x |
| Wired Reflexes 3 | 5.0 | 500000 | 1.0 | +6RCT,+3INI | sr2.x |
| Spurs | 0.1 | 7000 | 1.0 |  | sr2.x |
| Int. Voice Mask | 0.1 | 7000 | 1.0 |  | ssc.??? |
| Skill Hardwires 1 | 0.2 | 5000 | 1.0 |  | ssc.??? |
| Skill Hardwires 2 | 0.4 | 10000 | 1.0 |  | ssc.??? |
| Skill Hardwires 3 | 0.6 | 15000 | 1.0 |  | ssc.??? |
| Skill Hardwires 4 | 0.8 | 20000 | 1.0 |  | ssc.??? |
| Skill Hardwires 5 | 1.25 | 250000 | 1.5 |  | ssc.??? |
| Skill Hardwires 6 | 1.5 | 300000 | 1.5 |  | ssc.??? |
| Skill Hardwires 7 | 1.75 | 350000 | 1.5 |  | ssc.??? |
| Skill Hardwires 8 | 2.0 | 400000 | 1.5 |  | ssc.??? |
| Skill Hardwires 9 | 2.7 | 4500000 | 1.5 |  | ssc.??? |
| Skill Hardwires 10 | 3.0 | 5000000 | 1.5 |  | ssc.??? |
| Bone Lac. Plastic | 0.5 | 7500 | 1.5 | +1BOD | st.??? |
| Bone Lac. Aluminum | 1.15 | 25000 | 1.5 | +1BOD | st.??? |
| Bone Lac. Titanium | 2.25 | 75000 | 1.5 | +2BOD | st.??? |
| Skillwires+ 1 | 0.1 | 15000 | 1.0 |  | st.??? |
| Skillwires+ 2 | 0.2 | 30000 | 1.0 |  | st.??? |
| Skillwires+ 3 | 0.3 | 45000 | 1.0 |  | st.??? |
| Skillwires+ 4 | 0.8 | 500000 | 1.0 |  | st.??? |
| Skillwires+ 5 | 1.0 | 625000 | 1.0 |  | st.??? |
| Skillwires+ 6 | 1.2 | 750000 | 1.0 |  | st.??? |
| Skillwires+ 7 | 2.1 | 7000000 | 1.0 |  | st.??? |
| Skillwires+ 8 | 2.4 | 8000000 | 1.0 |  | st.??? |
| Skillwires+ 9 | 2.7 | 9000000 | 1.0 |  | st.??? |
| Body Plating S Lv1 | 0.0 | 10000 | 2.0 |  | ct.??? |
| Body Plating S Lv2 | 0.0 | 20000 | 2.0 |  | ct.??? |
| Body Plating S Lv3 | 0.0 | 30000 | 2.0 |  | ct.??? |
| Body Plating S Lv4 | 0.0 | 40000 | 2.0 |  | ct.??? |
| Body Plating S Lv5 | 0.0 | 50000 | 2.0 |  | ct.??? |
| Body Plating S Lv6 | 0.0 | 60000 | 2.0 |  | ct.??? |
| Body Plating H Lv1 | 0.0 | 25000 | 2.0 |  | ct.??? |
| Body Plating H Lv2 | 0.0 | 50000 | 2.0 |  | ct.??? |
| Body Plating H Lv3 | 0.0 | 75000 | 2.0 |  | ct.??? |
| Body Plating H Lv4 | 0.0 | 100000 | 2.0 |  | ct.??? |
| Body Plating H Lv5 | 0.0 | 125000 | 2.0 |  | ct.??? |
| Body Plating H Lv6 | 0.0 | 150000 | 2.0 |  | ct.??? |
| Reaction Enhan Lv1 | 0.3 | 60000 | 2.0 | +1RCT | ct.??? |
| Reaction Enhan Lv2 | 0.6 | 120000 | 2.0 | +2RCT | ct.??? |
| Reaction Enhan Lv3 | 0.9 | 180000 | 2.0 | +3RCT | ct.??? |
| Reaction Enhan Lv4 | 1.2 | 240000 | 2.0 | +4RCT | ct.??? |
| Reaction Enhan Lv5 | 1.5 | 300000 | 2.0 | +5RCT | ct.??? |
| Reaction Enhan Lv6 | 1.8 | 360000 | 2.0 | +6RCT | ct.??? |
| Reflex Trigger | 0.2 | 13000 | 1.0 |  | ct.??? |
| Move-by-Wire Lv1 | 2.5 | 250000 | 2.5 | +1QCK,+2RCT | ct.??? |
| Move-by-Wire Lv2 | 3.85 | 500000 | 3.0 | +2QCK,+4RCT | ct.??? |
| Move-by-Wire Lv3 | 5.2 | 1250000 | 3.0 | +3QCK,+6RCT | ct.??? |
| Move-by-Wire Lv4 | 6.45 | 3000000 | 3.5 | +4QCK,+8RCT | ct.??? |
| CyberTorso | 1.5 | 120000 | 1.0 | +1BOD | ct.??? |
| Internal Air Tank | 0.25 | 1200 | 1.5 |  | ct.??? |

#### Communications
| Name | EssCost | Cost | StreetIndex | Mods | Book |
| --- | --- | --- | --- | --- | --- |
| Radio | 0.75 | 4000 | 0.8 |  | sr2.x |
| Telephone | 0.5 | 3700 | 0.9 |  | sr2.x |
| Radio receiver | 0.4 | 2000 | 0.8 |  | sr2.x |
| Commlink 2 | 0.3 | 8000 | 1.0 |  | ssc.??? |
| Commlink 4 | 0.3 | 18000 | 1.25 |  | ssc.??? |
| Commlink 8 | 0.3 | 40000 | 1.5 |  | ssc.??? |
| Commlink 10 | 0.3 | 60000 | 1.75 |  | ssc.??? |
| Subvocal Mic Ext | 0.0 | 500 | 1.25 |  | ct.??? |
| Subvocal Mic Int | 0.1 | 850 | 2.0 |  | ct.??? |
| Sub Speakers | 0.1 | 650 | 2.0 |  | ct.??? |
| Cybercomm Link | 0.4 | 62000 | 3.0 |  | ct.??? |

#### Cyberlimb Mods
| Name | EssCost | Cost | StreetIndex | Mods | Book |
| --- | --- | --- | --- | --- | --- |
| Hydraulic Jack 1 | 0.25 | 5000 | 1.0 |  | st.??? |
| Hydraulic Jack 2 | 0.25 | 10000 | 1.0 |  | st.??? |
| Hydraulic Jack 3 | 0.25 | 15000 | 1.0 |  | st.??? |
| Hydraulic Jack 4 | 0.25 | 20000 | 1.0 |  | st.??? |
| Hydraulic Jack 5 | 0.25 | 25000 | 1.0 |  | st.??? |
| Hydraulic Jack 6 | 0.25 | 30000 | 1.0 |  | st.??? |
| Magnetic Cyberlimb | 0.0 | 2800 | 2.0 |  | ct.??? |
| Cyberarm Taser | 0.0 | 2000 | 1.5 |  | ct.??? |
| Tool Laser | 0.25 | 5200 | 2.0 |  | ct.??? |

#### Cyberlimbs
| Name | EssCost | Cost | StreetIndex | Mods | Book |
| --- | --- | --- | --- | --- | --- |
| Cyberarm/Leg | 1.0 | 100000 | 1.0 |  | ct.??? |
| Cyberhand/Foot | 0.35 | 45000 | 1.0 |  | ct.??? |
| Cyber Forearm/Leg | 0.65 | 70000 | 1.0 |  | ct.??? |
| Cyberarm Gyromount | 1.5 | 260000 | 2.0 |  | ct.??? |
| External Mount | 0.0 | 3200 | 2.0 |  | ct.??? |
| Tracking Mount | 0.0 | 24000 | 2.0 |  | ct.??? |
| Articulate Arm | 0.25 | 110000 | 2.0 |  | ct.??? |

#### Cyberweapons
| Name | EssCost | Cost | StreetIndex | Mods | Book |
| --- | --- | --- | --- | --- | --- |
| Cybergun Hold-Out | 0.0 | 250 | 2.0 |  | ssc.??? |
| Cybergun Light | 0.0 | 650 | 2.0 |  | ssc.??? |
| Cybergun Mach. Gun | 0.0 | 900 | 2.0 |  | ssc.??? |
| Cybergun SMG | 0.0 | 1800 | 2.0 |  | ssc.??? |
| Cybergun Heavy | 0.0 | 800 | 2.0 |  | ssc.??? |
| Cybergun Shotgun | 0.0 | 1200 | 2.0 |  | ssc.??? |
| CyberSquirt | 0.0 | 1400 | 2.0 |  | ct.??? |
| Eye Dart | 0.25 | 4200 | 2.0 |  | ct.??? |
| Eye Gun | 0.4 | 6400 | 3.0 |  | ct.??? |
| Oral Dart | 0.25 | 3600 | 2.0 |  | ct.??? |
| Oral Gun | 0.4 | 5600 | 3.0 |  | ct.??? |
| Oral Spur | 0.25 | 8200 | 2.5 |  | ct.??? |
| Oral Whip | 0.25 | 10500 | 2.5 |  | ct.??? |

#### Ears
| Name | EssCost | Cost | StreetIndex | Mods | Book |
| --- | --- | --- | --- | --- | --- |
| Ear Cyber replac. | 0.3 | 4000 | 0.75 |  | sr2.x |
| Ear Modification | 0.1 | 2000 | 1.0 |  | sr2.x |
| Ear Cosmetic mod. | 0.0 | 1000 | 0.8 |  | sr2.x |
| Ear Damper | 0.1 | 3500 | 1.25 |  | sr2.x |
| Ear High freq. | 0.2 | 3000 | 1.25 |  | sr2.x |
| Ear Low freq. | 0.2 | 3000 | 1.25 |  | sr2.x |
| Ear Recorder | 0.3 | 7000 | 2.0 |  | sr2.x |

#### Eyes
| Name | EssCost | Cost | StreetIndex | Mods | Book |
| --- | --- | --- | --- | --- | --- |
| Eye Cyber Replacement | 0.2 | 5000 | 0.75 |  | sr2.x |
| Eye Camera | 0.4 | 5000 | 2.0 |  | sr2.x |
| Eye Cosmetic mod. | 0.0 | 1000 | 0.8 |  | sr2.x |
| Eye Flare comp. | 0.1 | 2000 | 1.25 |  | sr2.x |
| Eye Low-light | 0.2 | 3000 | 1.25 |  | sr2.x |
| Eye Retinal dupl. | 0.1 | 50000 | 2.0 |  | sr2.x |
| Eye Thermographic | 0.2 | 3000 | 1.25 |  | sr2.x |
| Zeiss Cybereyes 1 | 0.15 | 31000 | 1.0 |  | sr2.x |
| Zeiss Cybereyes 2 | 0.15 | 40000 | 1.0 |  | sr2.x |
| Zeiss Cybereyes 3 | 0.3 | 79000 | 1.0 |  | sr2.x |
| Zeiss Cybereyes 4 | 0.6 | 98000 | 1.0 |  | sr2.x |
| Zeiss Cybereyes 5 | 1.0 | 169000 | 1.0 |  | sr2.x |
| Video Link | 0.5 | 22000 | 1.0 |  | ssc.??? |
| Video Link (Trans) | 0.4 | 4500 | 1.0 |  | ssc.??? |
| Retinal Clock | 0.1 | 450 | 1.0 |  | ct.??? |
| Image Link | 0.2 | 1600 | 2.0 |  | ct.??? |
| Protective Covers | 0.0 | 500 | 1.5 |  | ct.??? |
| Eye Dataport | 0.25 | 2200 | 2.0 |  | ct.??? |
| Optical Scan DJ | 0.3 | 5500 | 3.0 |  | ct.??? |
| Eye Light Systems | 0.2 | 1200 | 1.5 |  | ct.??? |
| Eye Light Systems - BrightLight | 0.4 | 1200 | 3.0 |  | ct.??? |
| Eye Light Systems - Flash-pak | 0.0 | 1000 | 3.0 |  | ct.??? |
| Eye Light Systems - one shot FP | 0.0 | 500 | 3.0 |  | ct.??? |

#### Feet
| Name | EssCost | Cost | StreetIndex | Mods | Book |
| --- | --- | --- | --- | --- | --- |
| Foot Anchor | 0.4 | 14000 | 2.0 |  | ct.??? |

#### Hands
| Name | EssCost | Cost | StreetIndex | Mods | Book |
| --- | --- | --- | --- | --- | --- |
| Fingertip Picks | 0.0 | 18000 | 3.0 |  | ct.??? |
| Fingertip Needle | 0.0 | 800 | 1.5 |  | ct.??? |
| Replacement Hand | 0.0 | 28000 | 2.0 |  | ct.??? |
| Hand Blade | 0.1 | 7500 | 1.5 |  | ct.??? |
| Hand Blade Retractable | 0.25 | 10000 | 1.5 |  | ct.??? |
| Hand Razors | 0.1 | 4500 | 1.0 |  | sr2.260 |
| Retractable Hand Razors | 0.1 | 9000 | 1.0 |  | sr2.260 |
| Shock Hand | 0.0 | 1300 | 2.0 |  | ct.??? |

#### Headwear
| Name | EssCost | Cost | StreetIndex | Mods | Book |
| --- | --- | --- | --- | --- | --- |
| Chipjack | 0.2 | 1000 | 0.9 |  | sr2.x |
| Data Filter | 0.3 | 5000 | 1.5 |  | sr2.x |
| Data Lock | 0.2 | 1000 | 1.5 |  | sr2.x |
| Datajack | 0.2 | 1000 | 0.9 |  | sr2.x |
| Datajack Science | 0.35 | 4500 | 1.0 |  | sr2.x |
| Datajack Archive | 0.8 | 15000 | 1.0 |  | sr2.x |
| Datajack Business | 0.4 | 6500 | 1.0 |  | sr2.x |
| Datasoft Link | 0.1 | 1000 | 1.0 |  | sr2.x |
| Display Link | 0.1 | 1000 | 1.0 |  | sr2.x |
| Headware Memory (30 Mp) | 0.3 | 3000 | 1.0 |  | sr2.247 |
| Smartcam Link | 0.5 | 2500 | 1.5 |  | sr2.x |
| Smartlink I | 0.5 | 2500 | 1.0 |  | sr2.x |
| Smartlink II | 0.5 | 3200 | 2.0 |  | fof.x |
| Datajack 1 | 0.1 | 500 | 0.9 |  | st.??? |
| Datajack 2 | 0.15 | 1000 | 0.9 |  | st.??? |
| Datajack 3 | 0.2 | 2000 | 0.9 |  | st.??? |
| Datajack 4 | 0.25 | 4000 | 0.9 |  | st.??? |
| Softlink 1 | 0.15 | 1000 | 0.9 |  | st.??? |
| Softlink 2 | 0.2 | 2000 | 0.9 |  | st.??? |
| Softlink 3 | 0.25 | 4000 | 0.9 |  | st.??? |
| Softlink 4 | 0.3 | 8000 | 0.9 |  | st.??? |
| Tactical Comp 1 | 3.5 | 350000 | 4.0 |  | st.??? |
| Tactical Comp 2 | 4.0 | 900000 | 4.0 |  | st.??? |
| CyberSkull | 0.75 | 75000 | 1.0 | +1BOD | ct.??? |
| Induction DJ | 0.3 | 3000 | 2.0 |  | ct.??? |
| Induction Jack Lv1 | 0.4 | 1500 | 2.0 |  | ct.??? |
| Induction Jack Lv2 | 0.4 | 3000 | 2.0 |  | ct.??? |
| Induction Jack Lv3 | 0.4 | 6000 | 2.0 |  | ct.??? |
| Induction Jack Lv4 | 0.4 | 12000 | 2.0 |  | ct.??? |
| Tactical Comp Lv1 | 3.5 | 350000 | 4.0 |  | ct.??? |
| Tactical Comp Lv2 | 4.0 | 900000 | 4.0 |  | ct.??? |
| Tooth Compartment Break | 0.0 | 700 | 1.5 |  | ct.??? |
| Tooth Compartment Storage | 0.0 | 1500 | 1.25 |  | ct.??? |
| Cranial Bomb Kink | 0.0 | 28000 | 1.5 |  | ct.??? |
| Cranial Bomb Micro | 0.0 | 65500 | 1.25 |  | ct.??? |
| Cranial Bomb Area | 0.0 | 500000 | 1.0 |  | ct.??? |
| Laser Designator | 0.5 | 12000 | 3.0 |  | ct.??? |
| Laser Tracker | 0.2 | 3200 | 2.0 |  | ct.??? |
| Spatial Recognizer | 0.2 | 1200 | 2.0 |  | ct.??? |
| Balance Augmentor | 0.4 | 14000 | 2.0 |  | ct.??? |
| Direct NeuralInter | 0.1 | 4500 | 1.0 |  | ct.??? |

#### Matrixware
| Name | EssCost | Cost | StreetIndex | Mods | Book |
| --- | --- | --- | --- | --- | --- |
| Crypto Circuit 1 | 0.1 | 10000 | 1.0 |  | ssc.??? |
| Crypto Circuit 2 | 0.1 | 20000 | 1.0 |  | ssc.??? |
| Crypto Circuit 3 | 0.1 | 30000 | 1.0 |  | ssc.??? |
| Crypto Circuit 4 | 0.1 | 40000 | 1.0 |  | ssc.??? |
| Crypto Circuit 5 | 0.1 | 100000 | 1.25 |  | ssc.??? |
| Crypto Circuit 6 | 0.1 | 120000 | 1.25 |  | ssc.??? |
| Crypto Circuit 7 | 0.1 | 140000 | 1.25 |  | ssc.??? |
| Crypto Circuit 8 | 0.1 | 240000 | 1.5 |  | ssc.??? |
| Crypto Circuit 9 | 0.1 | 270000 | 1.5 |  | ssc.??? |
| Crypto Circuit 10 | 0.1 | 500000 | 2.0 |  | ssc.??? |
| Scramble Breaker 1 | 0.2 | 20000 | 1.5 |  | ssc.??? |
| Scramble Breaker 2 | 0.2 | 40000 | 1.5 |  | ssc.??? |
| Scramble Breaker 3 | 0.2 | 60000 | 1.5 |  | ssc.??? |
| Scramble Breaker 4 | 0.2 | 80000 | 1.5 |  | ssc.??? |
| Scramble Breaker 5 | 0.2 | 200000 | 1.75 |  | ssc.??? |
| Scramble Breaker 6 | 0.2 | 240000 | 1.75 |  | ssc.??? |
| Scramble Breaker 7 | 0.2 | 280000 | 1.75 |  | ssc.??? |
| Scramble Breaker 8 | 0.2 | 600000 | 1.75 |  | ssc.??? |
| SPU - Data 1 | 0.1 | 9500 | 1.0 |  | st.??? |
| SPU - Data 2 | 0.15 | 19000 | 1.0 |  | st.??? |
| SPU - Data 3 | 0.2 | 28500 | 1.0 |  | st.??? |
| SPU - Data 4 | 0.25 | 38000 | 1.0 |  | st.??? |
| SPU - I/O 1 | 0.1 | 5000 | 1.5 |  | st.??? |
| SPU - I/O 2 | 0.15 | 7500 | 1.5 |  | st.??? |
| SPU - I/O 3 | 0.2 | 12500 | 1.5 |  | st.??? |
| SPU - I/O 4 | 0.25 | 22500 | 1.5 |  | st.??? |
| SPU - Math 1 | 0.1 | 2000 | 1.0 |  | st.??? |
| SPU - Math 2 | 0.15 | 5000 | 1.0 |  | st.??? |
| SPU - Math 3 | 0.2 | 11000 | 1.0 |  | st.??? |
| SPU - Math 4 | 0.25 | 23000 | 1.0 |  | st.??? |
| Encephalon 1 | 0.5 | 15000 | 2.0 | +1INT | st.??? |
| Encephalon 2 | 0.75 | 40000 | 2.0 | +1INT | st.??? |
| Encephalon 3 | 1.5 | 75000 | 2.0 | +2INT | st.??? |
| Encephalon 4 | 1.75 | 115000 | 2.0 | +2INT | st.??? |

#### Rigger
| Name | EssCost | Cost | StreetIndex | Mods | Book |
| --- | --- | --- | --- | --- | --- |
| Vehicle Ctrl Rig 1 | 2.0 | 12000 | 1.0 | +2RCT,+1INI | sr2.x |
| Vehicle Ctrl Rig 2 | 3.0 | 60000 | 1.25 | +4RCT,+2INI | sr2.x |
| Vehicle Ctrl Rig 3 | 5.0 | 300000 | 1.5 | +6RCT,+3INI | sr2.x |

#### Senseware
| Name | EssCost | Cost | StreetIndex | Mods | Book |
| --- | --- | --- | --- | --- | --- |
| Ear Hearing Amp | 0.2 | 3500 | 1.25 |  | ssc.??? |
| Ear Sound Filter 1 | 0.2 | 10000 | 1.25 |  | ssc.??? |
| Ear Sound Filter 2 | 0.2 | 20000 | 1.25 |  | ssc.??? |
| Ear Sound Filter 3 | 0.2 | 30000 | 1.25 |  | ssc.??? |
| Ear Sound Filter 4 | 0.2 | 40000 | 1.25 |  | ssc.??? |
| Ear Sound Filter 5 | 0.2 | 50000 | 1.25 |  | ssc.??? |
| Eye Optical Mag 1 | 0.2 | 2500 | 1.0 |  | ssc.??? |
| Eye Optical Mag 2 | 0.2 | 4000 | 1.0 |  | ssc.??? |
| Eye Optical Mag 3 | 0.2 | 6000 | 1.0 |  | ssc.??? |
| Eye Electric Mag 1 | 0.1 | 3500 | 1.0 |  | ssc.??? |
| Eye Electric Mag 2 | 0.1 | 7500 | 1.0 |  | ssc.??? |
| Eye Electric Mag 3 | 0.1 | 11000 | 1.0 |  | ssc.??? |
| Eye Rangefinder | 0.1 | 2000 | 1.5 |  | ssc.??? |
| Sense Link | 2.0 | 300000 | 1.0 |  | ssc.??? |
| Sense Link (Trans) | 0.6 | 80000 | 1.5 |  | ssc.??? |
| Olfactory Boost 1 | 0.2 | 1000 | 1.0 |  | st.??? |
| Olfactory Boost 2 | 0.2 | 2000 | 1.0 |  | st.??? |
| Olfactory Boost 3 | 0.2 | 3000 | 1.0 |  | st.??? |
| Olfactory Boost 4 | 0.2 | 4000 | 1.0 |  | st.??? |
| Olfactory Boost 5 | 0.2 | 5000 | 1.0 |  | st.??? |
| Olfactory Boost 6 | 0.2 | 6000 | 1.0 |  | st.??? |
| Orientation System | 0.5 | 15000 | 1.5 |  | st.??? |
| Chem. Analyzer 1 | 0.2 | 2500 | 1.0 |  | st.??? |
| Chem. Analyzer 2 | 0.2 | 5000 | 1.0 |  | st.??? |
| Chem. Analyzer 3 | 0.2 | 7500 | 1.0 |  | st.??? |
| Chem. Analyzer 4 | 0.2 | 10000 | 1.0 |  | st.??? |
| Chem. Analyzer 5 | 0.2 | 12500 | 1.0 |  | st.??? |
| Chem. Analyzer 6 | 0.2 | 15000 | 1.0 |  | st.??? |
| Gas Spectrometer 1 | 0.2 | 2000 | 1.0 |  | st.??? |
| Gas Spectrometer 2 | 0.2 | 4000 | 1.0 |  | st.??? |
| Gas Spectrometer 3 | 0.2 | 6000 | 1.0 |  | st.??? |
| Gas Spectrometer 4 | 0.2 | 8000 | 1.0 |  | st.??? |
| Gas Spectrometer 5 | 0.2 | 10000 | 1.0 |  | st.??? |
| Gas Spectrometer 6 | 0.2 | 12000 | 1.0 |  | st.??? |
| Orientation System | 0.5 | 15000 | 1.5 |  | ct.??? |

#### Various
| Name | EssCost | Cost | StreetIndex | Mods | Book |
| --- | --- | --- | --- | --- | --- |
| Dermal Sheath Lv1 | 0.7 | 24000 | 1.5 | +2BOD | ct.??? |
| Dermal Sheath Lv2 | 1.4 | 60000 | 1.5 | +3BOD | ct.??? |
| Dermal Sheath Lv3 | 2.1 | 120000 | 1.5 | +4BOD | ct.??? |
| DS Coloration Lv1 | 0.0 | 30000 | 1.75 | +2BOD | ct.??? |
| DS Coloration Lv2 | 0.0 | 75000 | 1.75 | +3BOD | ct.??? |
| DS Coloration Lv3 | 0.0 | 150000 | 1.75 | +4BOD | ct.??? |
| DS Cyber Control | 0.1 | 32000 | 1.5 |  | ct.??? |
| Strength Lv1 | 0.0 | 150000 | 1.5 |  | ct.??? |
| Strength Lv2 | 0.0 | 300000 | 1.5 |  | ct.??? |
| Strength Lv3 | 0.0 | 450000 | 1.5 |  | ct.??? |
| Strength Lv4 | 0.4 | 175000 | 1.5 |  | ct.??? |
| Strength Lv5 | 0.8 | 350000 | 1.5 |  | ct.??? |
| Strength Lv6 | 1.2 | 525000 | 1.5 |  | ct.??? |
| Quickness Lv1 | 0.0 | 90000 | 1.5 | +1QCK | ct.??? |
| Quickness Lv2 | 0.0 | 180000 | 1.5 | +2QCK | ct.??? |
| Quickness Lv3 | 0.0 | 270000 | 1.5 | +3QCK | ct.??? |
| Quickness Lv4 | 0.3 | 110000 | 1.5 | +4QCK | ct.??? |
| Quickness Lv5 | 0.6 | 220000 | 1.5 | +5QCK | ct.??? |
| Quickness Lv6 | 0.9 | 330000 | 1.5 | +6QCK | ct.??? |
| Body Enhance Lv1 | 0.0 | 75000 | 1.5 | +1BOD | ct.??? |
| Body Enhance Lv2 | 0.0 | 150000 | 1.5 | +2BOD | ct.??? |
| Body Enhance Lv3 | 0.0 | 225000 | 1.5 | +3BOD | ct.??? |
| Body Enhance Lv4 | 0.0 | 300000 | 1.5 | +4BOD | ct.??? |
| Body Enhance Lv5 | 0.0 | 375000 | 1.5 | +5BOD | ct.??? |
| Body Enhance Lv6 | 0.0 | 450000 | 1.5 | +6BOD | ct.??? |

### Bioware (system list)
#### Standard
| Name | BioIndex | Cost | StreetIndex | Mods | Book |
| --- | --- | --- | --- | --- | --- |
| Adrenal Pump 1 | 1.25 | 60000 | 3.00 | +1QCK,+1STR,+1WIL,+2RCT | st.??? |
| Adrenal Pump 2 | 2.5 | 100000 | 3.00 | +2QCK,+2STR,+2WIL,+4RCT | st.??? |
| Cerebral Booster 1 | 0.4 | 50000 | 2.00 | +1INT | st.??? |
| Cerebral Booster 2 | 0.8 | 110000 | 2.00 | +2INT | st.??? |
| Damage Comp. 1 | 0.2 | 25000 | 2.50 |  | st.??? |
| Damage Comp. 2 | 0.4 | 50000 | 2.50 |  | st.??? |
| Damage Comp. 3 | 0.6 | 150000 | 2.00 |  | st.??? |
| Damage Comp. 4 | 0.8 | 200000 | 2.00 |  | st.??? |
| Damage Comp. 5 | 1.0 | 250000 | 2.00 |  | st.??? |
| Damage Comp. 6 | 1.2 | 600000 | 2.50 |  | st.??? |
| Damage Comp. 7 | 1.4 | 700000 | 2.50 |  | st.??? |
| Damage Comp. 8 | 1.6 | 800000 | 2.50 |  | st.??? |
| Damage Comp. 9 | 1.8 | 900000 | 2.50 |  | st.??? |
| Enh. Articulation | 0.6 | 40000 | 1.50 | +1RCT | st.??? |
| Ext. Volume 1 | 0.2 | 8000 | 1.00 |  | st.??? |
| Ext. Volume 2 | 0.3 | 15000 | 1.00 |  | st.??? |
| Ext. Volume 3 | 0.4 | 25000 | 1.00 |  | st.??? |
| Mnemonic Enhanc. 1 | 0.2 | 15000 | 1.00 |  | st.??? |
| Mnemonic Enhanc. 2 | 0.4 | 30000 | 1.00 |  | st.??? |
| Mnemonic Enhanc. 3 | 0.6 | 45000 | 1.00 |  | st.??? |
| Mnemonic Enhanc. 4 | 0.8 | 60000 | 1.00 |  | st.??? |
| Mnemonic Enhanc. 5 | 1.0 | 75000 | 1.00 |  | st.??? |
| Mnemonic Enhanc. 6 | 1.2 | 90000 | 1.00 |  | st.??? |
| Muscle Augm. 1 | 0.8 | 45000 | 0.90 | +1QCK,+1STR | st.??? |
| Muscle Augm. 2 | 1.6 | 90000 | 0.90 | +2QCK,+2STR | st.??? |
| Muscle Augm. 3 | 2.4 | 135000 | 0.90 | +3QCK,+3STR | st.??? |
| Muscle Augm. 4 | 3.2 | 180000 | 0.90 | +4QCK,+4STR | st.??? |
| Nephritic Screen | 0.4 | 20000 | 1.00 |  | st.??? |
| Orthoskin 1 | 0.5 | 25000 | 0.80 |  | st.??? |
| Orthoskin 2 | 1.0 | 60000 | 0.80 |  | st.??? |
| Orthoskin 3 | 1.5 | 100000 | 0.80 |  | st.??? |
| Pain Editor | 0.6 | 60000 | 1.20 |  | st.??? |
| Pathogenic Def. 1 | 0.2 | 24000 | 1.50 |  | st.??? |
| Pathogenic Def. 2 | 0.4 | 48000 | 1.50 |  | st.??? |
| Pathogenic Def. 3 | 0.6 | 72000 | 1.50 |  | st.??? |
| Pathogenic Def. 4 | 0.8 | 96000 | 1.50 |  | st.??? |
| Pathogenic Def. 5 | 1.0 | 120000 | 1.50 |  | st.??? |
| Pathogenic Def. 6 | 1.2 | 144000 | 1.50 |  | st.??? |
| Pathogenic Def. 7 | 1.4 | 168000 | 1.50 |  | st.??? |
| Pathogenic Def. 8 | 1.6 | 192000 | 1.50 |  | st.??? |
| Pathogenic Def. 9 | 1.8 | 216000 | 1.50 |  | st.??? |
| Pathogenic Def. 10 | 2.0 | 240000 | 1.50 |  | st.??? |
| Platelet Factory | 0.4 | 30000 | 1.50 |  | st.??? |
| Reflex Rec. (conc) | 0.1 | 10000 | 1.50 |  | st.??? |
| Reflex Rec. (spec) | 0.25 | 25000 | 1.50 |  | st.??? |
| Suprathyroid Gland | 1.4 | 50000 | 2.50 | +1BOD,+1QCK,+1STR,+1RCT | st.??? |
| Symbiotes 1 | 0.4 | 15000 | 1.00 |  | st.??? |
| Symbiotes 2 | 0.7 | 35000 | 1.00 |  | st.??? |
| Symbiotes 3 | 1.0 | 60000 | 1.00 |  | st.??? |
| Synaptic Accel. 1 | 0.3 | 75000 | 2.00 | +1INI | st.??? |
| Synaptic Accel. 2 | 1.6 | 200000 | 2.00 | +2INI | st.??? |
| Synthacardium 1 | 0.2 | 6000 | 1.50 |  | st.??? |
| Synthacardium 2 | 0.3 | 15000 | 1.50 |  | st.??? |
| Tailored Pherom. 1 | 0.4 | 20000 | 2.00 | +1CHA | st.??? |
| Tailored Pherom. 2 | 0.6 | 45000 | 2.00 | +2CHA | st.??? |
| Toxin Exhaler | 0.6 | 30000 | 3.00 |  | st.??? |
| Toxin Extractor 1 | 0.2 | 24000 | 1.00 |  | st.??? |
| Tracheal Filter 1 | 0.2 | 30000 | 1.00 |  | st.??? |
| Trauma Damper | 0.4 | 40000 | 2.00 |  | st.??? |

## Vehicles

Vehicle combat rules live in `## Combat`. This section provides the stats lists.

### Vehicles (system list)
| Name | Handling | Speed/Accel | Body/Armor | Sig/Autonav | Pilot/Sensor | Cargo/Load | Seating | Cost | Availability | Street Index | Notes | Book |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| BMW Blitzen 2050 | 3/4 | 220/13 | 2/2 | 1/2 | -/0 | 2/40 | 2m | 26300 | 2/48hrs | 1 | Turbocharging 3(factored in) | r3.158 |
| Harley-Davidson Electroglide | 3/4 | 225/13 | 2/2 | 1/1 | -/0 | 2/140 | 1m | 70000 | 10/10days | 2 | Electronics Port w/Radio(Rating 3), External Fixed Firmpoint(1 CF Ammo Bin), Turbocharging 3(factored in) | r3.158 |
| Harley-Davidson Scorpion | 4/5 | 120/6 | 2/1 | 2/2 | -/0 | 4/60 | 2m | 13500 | 2/24hrs | 1 |  | sr2.308, r3.158 |
| Honda Viking | 3/5 | 120/5 | 2/1 | 1/2 | -/0 | 4/40 | 2m | 20000 | 2/24hrs | 1 | Turbocharging 1(factored in), Engine Customization 3, Adjusted Controls(troll) | r3.158 |
| Gaz-Niki White Eagle | 3/3 | 100/4 | 2/0 | 1/0 | -/0 | 2/30 | 2m | 13000 | 2/24hrs | 1 | External Fixed Hardpoint | r3.159 |
| Hyundai Offroader | 2/4 | 90/4 | 2/0 | 4/1 | -/0 | 1/20 | 2m | 13000 | 2/24hrs | 1 |  | r3.159 |
| Thundercloud Pinto | 4/2 | 85/4 | 2/0 | 2/0 | -/0 | 8/40 | 3m | 35000 | 2/48hrs | 1 |  | r3.158 |
| Suzuki Aurora | 2/4 | 210/11 | 2/0 | 2/1 | -/0 | 1/40 | 1m | 18100 | 2/24hrs | 1 |  | r3.159 |
| Yamaha Rapier | 3/6 | 195/10 | 2/0 | 2/1 | -/0 | 1/40 | 1m | 14200 | 2/24hrs | 1 |  | sr2.308, r3.159 |
| Dodge Scoot | 3/4 | 60/3 | 2/0 | 5/0 | -/0 | 1/10 | 1m | 5900 | 2/24hrs | .50 | Gridlink | sr2.308, r3.160 |
| Entertainment Systems Papoose | 3/6 | 90/3 | 2/0 | 5/0 | -/0 | 1/5 | 1m | 6600 | 2/24hrs | .50 |  | r3.160 |
| Aztech Nightrunner (E) | 3 | 45/5 | 3/0 | 5(5)/3 | -/0 | 14/250 | 2 | 45625 | 3/72hrs | 1 | Electric | r3.160 |
| Aztech Nightrunner(M) | 3 | 75/8 | 3/0 | 4(4)/3 | -/0 | 14/250 | 2 | 30000 | 2/48hrs | 1 | Methane | r3.160 |
| Sendako Marlin | 3 | 30/3 | 3/0 | 6(6)/0 | -/0 | 12/150 | 2+1b | 18750 | 2/24hrs | 1 |  | sr2.309, r3.160 |
| Surfstar Marine Seacop | 3 | 90/7 | 3/1 | 3(3)/2 | -/0 | 10/45 | 1+2b | 170000 | 15/15days | 2 | Elctronics Port w/Radio(Rating 4 1.2CF), External Fixed Firmpoint(1 CF Ammo Bin), Spotlight | r3.160 |
| Colorado Craft Cigarette Hydro | 4(5) | 75(105)/10(15) | 3/0 | 3(1)/2 | -/0 | 8/240 | 2 | 35000 | 2/48hrs | 1 | Hydrofoil Capability | r3.161 |
| Aztech Tiburon | 3 | 90/5 | 5/4 | 3(3)/3 | -/7(0) | 20/505 | 2+1b | 650000 | - | 2 | 2 Mini-Turrets (1 CF Ammo Bin each), Improved Signature 1 (factored in) | r3.161 |
| Aztech Tiburon(cbt) | 3 | 90/5 | 5/4 | 3(3)/3 | -/7(0) | 18/475 | 2+1b | 2670000 | NA | 3.00 | 3 Micro-Turrets(1 CF Ammo Bin each), Mini-Turret(1 CF Ammo Bin), Improved Signature 3 (factored in) | r3.161 |
| Biohm | 4 | 75/4 | 5/9 | 1(1)/3 | -/1(0) | 55/800 | 2+1b | 260000 | 19/19days | 2 | 3 Micro-Turrets(1 CF Ammo Bin each), Mini-Turret(1 CF Ammo Bin) | r3.161 |
| GMC Riverine | 3 | 90/5 | 5/6 | 2(2)/2 | -/1(0) | 16/175 | 2+5b | 100000 | 5/5days | 1 | Partial Basic Living Amenities, folding Bench Seats, Ring Mount | r3.161 |
| GMC Riverine(Security) | 3 | 90/5 | 5/6 | 1(1)/2 | -/1(0) | 51/1355 | 2+2b | 150000 | 18/18days | 3 | Partial Basic Living Amenities, folding Bench Seats, Micro-Turret(1 CF Ammo Bin), Mini-Turret(1 CF Ammo Bin) | r3.161 |
| GMC Riverine(Police) | 3 | 90/5 | 5/6 | 2(2)/2 | -/1(0) | 55/1345 | 2+2b | 125000 | 13/13days | 2 | Partial Basic Living Amenities, folding Bench Seats, Ring Mount, External Fixed Hardpoint(1 CF Ammo Bin) | r3.160 |
| Samuvani-Criscraft Otter | 4 | 45/6 | 5/0 | 3(3)/2 | -/1(0) | 48/650 | 2 | 32500 | 2/48hrs | 1 |  | sr2.309, r3.161 |
| Zemlya-Poltava Swordsman | 4 | 75/5 | 5/0 | 3(3)/2 | -/1(0) | 30/300 | 2+3b | 29000 | 2/48hrs | 1 | Folding Bench Seats | r3.161 |
| Zemlya Poltava Swordsman(AME) | 4 | 30/3 | 5/0 | 5(5)/2 | -/1(0) | 30/300 | 2+3b | 58375 | 3/72hrs | 1 | Folding Bench Seats | r3.161 |
| Zemlya Poltava Swordsman(P.O.) | 4 | 90/6 | 5/0 | 3(3)/2 | -/1(0) | 30/300 | 2+3b | 37000 | 2/48hrs | 1 | Folding Bench Seats | r3.161 |
| Suzuki Watersport(G) | 2 | 45/7 | 2/0 | 3(3)/0 | -/1 | 4/38 | 1 | 10000 | 2/24hrs | 1 | Gasoline | r3.162 |
| Suzuki Watersport(E) | 2 | 30/4 | 2/0 | 5(5)/0 | -/1 | 1/37 | 1 | 11000 | 2/24hrs | 1 | Electric | r3.162 |
| Harland | 5 | 45/4 | 8/0 | 2(2)/2 | -/1(0) | 120[210PS]/2500 | 2 | 207500 | 15/15days | 2 | 10 High Living amenities, 10-man Life Raft | r3.162 |
| Marine Technologies Dolphin II | 3 | 45/4 | 8/0 | 2(2)/4 | -/1(0) | 9[210PS]/1200 | 1 | 125000 | 11/11days | 2 | 6 Improved Living Amenities, 10-man Life Raft | r3.162 |
| BAE Agincourt APC | 4/4 | 80/6 | 7/6 | 5/3 | -/0 | 48/1000 | 1+1+2b | 256700 | 13/13days | 3.00 | Medium turret (heavy mortar 5 CF Ammo Bin), Electronics port (with Rating 3 radio) | sota.78 |
| Ferrari Appaloosa Light Scout | 2/3 | 125/10 | 6/9 | 5/2 | -/6 | 5/625 | 3+1b | 775300 | - | 3 | ECM 5, ECCM 5, Medium Turret(12 CF Ammo Bin), Folding Bench Seat, Improved Sig 2(factored in), RAM 2(factored in), Thermal Baffles 2(factored in) | r3.163 |
| LAV-93 Devil Rat | 5/4 | 75/5 | 7/12 | 3/2 | -/0 | 12/2800 | 2+2b | 260100 | 23/23days | 3 | Amphibious Operation 1, Electronics Port w/Radio(Rating 2 0.6CF), Gas Enviroseal, Small Remote Turret(2 CF Ammo Bin), Improved Sig 1(factored in), Thermal Baffles 1(factored in), 2 Folding Bench Seats | r3.163 |
| LAV-103 Striker Light Tank | 5/4 | 75/5 | 7/15 | 3/2 | -/0 | 12/1865 | 3 | 305100 | 26/26days | 3 | Amphibious Operation 1, Electronics Port w/Radio(Rating 2 0.6 CF), Gas Enviroseal, Medium Remote Turret(10 CF Ammo Bin), Improved Sig 1(factored in), Thermal Baffles 1(factored in) | r3.163 |
| Ruhr. Falkener Air Defense APC | 4/4 | 90/7 | 7/6 | 4/2 | -/8 | 22.5/1010 | 1+2+1b | 619600 | 31/1month | 3.00 | ECCM 6, ECD 4, EnviroSeal (Gas with Cabin Overpressure), Medium Turret (Vigilant Autocannon on AA-mount 15 CF Ammo Bin Medium Launch Control System 8 Internal Missile Mounts), Radar Absorbent Materials 1 (factored in), Electronics Port (with Rating 3 Radio), Thermal Baffles 1 (factored in) | sota.78 |
| Ruhr. Frettchen | 4/4 | 85/6 | 10/22 | 11/2 | -/10 | 10/1445 | 4 | 16800000 | - | 4.00 | Amphibious Operation 3, Contingency Maneuver Controls 3, Drive-by-Wire 2, ECD 6, ECCM 9, ED 6, EnviroSeal (gas water engine), Large Smoke Projector, Life Support(100 man-hours), Medium Turret(AA capable 6 CF for 6000 rounds of HMG ammo), Radar Absorbent Materials 3, Rigger Adaptation, Ruthenium Polymer Masking (with 40 picture files), Smart Materials | sota.78 |
| Ruhr. Keller A4 | 4/4 | 120/10 | 10/28 | 2/2 | -/7 | 12/1775 | 4 | 4600000 | - | 4.00 | Amphibious Operation 3, Contingency Maneuver Controls 9, Drive-by-Wire 1, EnviroSeal(gas water engine), 2x4 External Rocket Mounts, Large Smoke Projector, Large Turret(1.6 CF ammo bin for 160 railgun slugs), Life Support(100 Man-Hours), Medium Launch Control Systems, Micro-turret(AA capable Recoil Adjustment 4 0.5 CF ammo bin for 5000 rds HVAR ammo), Rigger Adaption, Smart Armor System, Smart Materials | sota.78 |
| Ruhr. Leopard III | 4/4 | 90/8 | 12/40 | 4/2 | -/8 | 33/2095 | 3 | 7290000 | - | 4.00 | Contingency Maneuver Controls 6, Drive-by-Wire 2, Rigger Adaptation, EnviroSeal(gas water engine), 2x4 External Rocket Mounts, Extra-Large Turret(0.8 CF Ammo Bin for 80 railgun projectiles), Large Smoke Projector, Life Support(150 man-hours), Medium Launch Control System, Micro-turret(AA capable Recoil Adjustment 4 1 CF Ammo Bin for HVAR ammo), Radar Absorbent Materials 2, Smart Materials, Thermal Baffles 2, Turbocharging 1 | sota.78 |
| Ruhrmetall Wolf II AFV APC | 3/5 | 105/8 | 6/12 | 2/2 | -/- | 9/900 | 6 | 332200 | 26/26days | 3.00 | EnviroSeal (with gas seal and cabin overpressure), Life Support (60 man-hours), Runflat Tires, Small Turret (AA capable), Thermal Baffles 2, Turbocharging 2 | sota.78 |
| S-D Kreuzritter Propelled Gun | 5/5 | 75/6 | 7/6 | 2/3 | -/2 | 16/2000 | 1+1+3b | 279400 | 14/14days | 3.00 | EnviroSeal (with gas seal and cabin overpressure), Medium Turret (Light Howitzer 10 CF Ammo Bin), Electronics Port (with Rating 3 Radio) | sota.78 |
| U-D Semaphore Command Center | 4/4 | 90/7 | 7/6 | 4/4 | -/7 | 18.75/3507 | 1+2+1+2 | 1196500 | NA | 3.00 | ECM8, ECCM8, ED5, ECD6, Electronics Port (with Remote Control Deck 6 Rigger Protocol Emulation Module 6 Signal Amplifier 6), Remote Control Encryption Unit 6, Small Remote Turret (2 CF Ammo Bin), 4 Additional Electronics Ports | sota.78 |
| Mitsubishi Nightsky | 4/8 | 120/8 | 4/2 | 2/4 | -/1 | 10/60 | 8 | 171200 | 13/13days | 2 | APPS, Concealed Armor, Roll Bars, Gas Enviroseal, Electronics Port w/Sat Uplink | r3.164 |
| Rolls-Royce Phaeton | 4/4 | 140/8 | 4/4 | 2/4 | -/1 | 6/30 | 8+1b | 218800 | 15/15days | 2 | APPS, Concealed Armor, Roll Bars, Gas Enviroseal, Electronics Port w/Sat Uplink, 3 Folding Bucket Seats | r3.164 |
| Ford-Canada Bison | 4/3 | 135/6 | 4/4 | 2/3 | -/1 | 67/1918 | 2+5b | 145000 | 8/8days | 1 | Concealed Armor, Folding Bench Seat, 2 Basic Living Amenities | sr2.309,r3.164 |
| Rolls-Royce Prairie Cat | 3/2 | 120/4 | 4/4 | 2/3 | -/1 | 36/1008 | 2+4b | 113400 | 10/10days | 2 | APPS, Amphibious Operation 1, Concealed Armor, Electronics Port(Standard Portable Satellite Uplink 2CF), Roll Bars, 2 Improved Living Amenities | r3.164 |
| Lockheed-Chenowth LSV | 4/3 | 90/8 | 2/- | 3/- | -/- | 4/45 | 4 | 12300 | 8/8days | 2 | Electronics Port w/Radio(Rating 2 0.6CF), Roll Bars, Ring Mount | r3.165 |
| Rover Ascot | 3/2 | 90/9 | 3/6 | 5/2 | -/0 | 3/120 | 2 | 50000 | 3/72hrs | 2 | Amphibious OPs Package I, Enviroseal (Water), optional Underwater Package includes Enviroseal (engine) and Amphibious ops Package II | tss.6 |
| Chrysler-Nissan Patrol-1 | 4/8 | 180/12 | 3/2 | 1/3 | -/0 | 11/40 | 2+1b | 43700 | 9/9days | 2 | Gas Enviroseal, Turbocharging 2(factored in), Electronics Port w/Radio(Rating 4 1.2CF), 2 Pintle Mounts | sr2.310,r3.165 |
| Chrysler-Nissan Cirrus | 3/8 | 105/8 | 3/0 | 3/2 | -/0 | 8/150 | 2+2 | 30000 | 2/24hrs | 1 | APPS | tss.6 |
| EMC Eurocar (M) | 4/8 | 100/6 | 3/0 | 3/2 | -/0 | 4/80 | 2+2 | 25000 | 2/24hrs | 1 |  | tss.6 |
| EMC Eurocar (G) | 4/8 | 110/8 | 3/0 | 3/2 | -/0 | 4/100 | 2+2 | 27500 | 2/24hrs | 1 |  | tss.6 |
| EMC Eurocar Hatchback (G) | 4/8 | 110/8 | 3/0 | 3/2 | -/0 | 4/100 | 2+2 | 30000 | 2/24hrs | 1 |  | tss.6 |
| Ford Americar | 4/8 | 105/8 | 3/0 | 2/2 | -/1 | 12/110 | 2+1b | 20000 | 2/24hrs | 1 |  | sr2.308, r3.165 |
| General Products COP | 4/8 | 90/6 | 3/1 | 4/1 | -/0 | 18/155 | 2 | 34800 | 8/8days | 2 | Gridlink, Superconductive Drive 1 | r3.165 |
| Lone Star Ford Americar | 4/8 | 105/8 | 3/3 | 2/2 | -/1 | 10/65 | 4 | 38500 | 8/8days | 2 | Lone Star | r3.165 |
| Pontiac Stratocruiser | 3/8 | 150/10 | 3/0 | 3/2 | -/0 | 4/80 | 2+2b | 30000 | 2/24hrs | 2 | APPS | tss.6 |
| Toyota Elite | 4/8 | 120/12 | 3/0 | 2/4 | -/1 | 11/100 | 4 | 66400 | 8/8days | 2 | APPS, Gas Enviroseal | r3.165 |
| CAT Snowbear Standard | 5/5 | 40/1 | 6/0 | 2/0 | -/0 | 250/9700 | 2b+1B | 186300 | 10/10days | 1,00 | Amphibious Operation 1 | twl.133 |
| CAT Snowbear Science | 5/4 | 40/1 | 6/0 | 2/0 | -/0 | 478 (378PS)/8950 (700PS) | 2b+1B | 407445 | 10/10days | 1,00 | Amphibious Operation 2, Datajack Port, Shop, Thermal Baffles 2 (factored in), 2 Basic Living Amenities | twl.133 |
| Gaz-Willys Nomad | 3/3 | 100/9 | 4/0 | 2/2 | -/0 | 18/850 | 2+1b | 34500 | 2/48hrs | 1 | Roll Bars | r3.166 |
| GMC MPUV | 4/3 | 120/8 | 4/6 | 2/0 | -/0 | 11/750 | 2+1b | 70000 | 13/13days | 3 | Electronics Port w/Radio(Rating 3 0.9CF), Pintle Mount, Spotlight | r3.166 |
| Land Rover Model 2046(Van) | 3/5 | 100/7 | 4/0 | 2/2 | -/0 | 11/750 | 2+3b | 32000 | 2/48hrs | 1 | 3 Folding Bench Seats | r3.166 |
| Land Rover Model 2046(Pickup) | 3/3 | 100/7 | 4/0 | 2/1 | -/0 | 18/700 | 2+2b | 29000 | 2/48hrs | 1 | 2 Folding Bench Seats | r3.166 |
| Nissan-Holden Brumby | 4/3 | 100/7 | 4/0 | 2/2 | -/0 | 12/850 | 2+1b | 19000 | 2/48hrs | 1 | Folding Bench Seat | r3.166 |
| Ruhr. Vogelhund | 4/3 | 120/9 | 4/3 | 2/2 | -/8 | 7.5/253 | 2+1 | 257000 | 13/13days | 3.00 | ECCM 4, ECD 3, Small Turret(2 medium launch control systems 8 internal missile mounts), Radar Abosorbent Materials 1(factored in), Electronics Port (w Radio Rating 3), Thermal Baffles 1(factored in) | sota.78 |
| Toyota Gopher | 4/4 | 105/7 | 4/0 | 2/2 | -/0 | 38/500 | 2 | 29500 | 2/48hrs | 1 | Roll Bars | r3.166 |
| Audi Avus | 3/8 | 250/15 | 3/0 | 1/3 | -/1 | 3/40 | 2 | 195000 | 4/7days | 2 | Crash Cage, datajack link, optional Rigger Control Gear (does not require CF) | tss.6 |
| Aztechnology Atalante | 4/8 | 200/12 | 3/0 | 3/3 | -/0 | 6/40 | 1 | 400000 | 4/8days | 2 | APPS, Anti-theft IV, Enviroseal (gas), Optional Crash Cage and Datajack Port | tss.6 |
| Crystler-Nissan Camaro | 4/8 | 110/9 | 3/0 | 2/1 | -/0 | 5/50 | 2+2b | 30000 | 2/48hrs | 1 |  | tss.6 |
| Crystler-Nissan Camaro Turbo | 4/8 | 160/10 | 3/0 | 1/1 | -/0 | 4/60 | 2+2b | 35000 | 3/72hrs | 1 |  | tss.6 |
| EMG Slipstream | 3/8 | 225/10 | 3/0 | 1/3 | -/1 | 4/40 | 2 | 95000 | 3/72hrs | 2 | APPS | tss.6 |
| Eurocar Westwind 2000 | 3/8 | 210/10 | 3/0 | 2/3 | -/1 | 5/45 | 2+1b | 57000 | 3/72hrs | 2 | APPS | sr2.308, r3.167 |
| Eurocar Westwind 2000 Turbo | 3/8 | 240/14 | 3/0 | 1/3 | -/1 | 5/45 | 2+1b | 77000 | 4/96hrs | 2 | APPS, Turbocharging 2 | sr2.308, r3.167 |
| Ferrari Open-Wheel Racer | 2/7 | 311/21 | 3/0 | 2/0 | -/2 | 6/95 | 1 | 210300 | 11/11days | 3 | Smart Materials, Nitrous Oxide Injectors 6, Datajack Port, Rigger Adaptation, Crash Cage | r3.167 |
| Honda-GM 3220 | 4/8 | 160/10 | 3/0 | 2/1 | -/0 | 3/40 | 4 | 28000 | 2/48hrs | 1 |  | r3.167 |
| Honda-GM 3220 Turbo | 4/8 | 190/14 | 3/0 | 1/2 | -/0 | 3/40 | 4 | 44000 | 3/72hrs | 1 | Turbocharging 2(factored in) | r3.167 |
| Isdera Warp | 4/7 | 240/18 | 3/6 | 2/0 | 0/2 | 0/50 | 1+1b | 400000 | 4/73hrs | 2 | Roll Bars, Datajack Port, Rigger Controls, APPS, Performance Runflat Tires, Remote mini-popup, Satt Uplink | tss.6 |
| Lone Star Honda-GM 3220 Turbo | 4/8 | 190/14 | 3/1 | 1/2 | -/0 | 3/15 | 4 | 49000 | 9/9days | 2 | Turbocharging 2(factored in) | r3.167 |
| Saab Dynamit 778 TI | 4/8 | 250/15 | 3/0 | 1/3 | -/1 | 3/45 | 2+1b | 92000 | 5/5days | 2 | APPS, Roll Bars, Turbocharging 2(factored in) | r3.167 |
| Aztechnology Salsa (E) | 4/8 | 75/5 | 3/0 | 5/1 | -/0 | 3/60 | 2+2b | 12500 | 3/48hrs | 1 | Modula design comes with Hardtop Module. Flatback/Pickup module adds 15CF and costs 500, Transport Module adds 10CF ad costs 750. any module adds 1/1 to handling | tss.6 |
| Chrysler-Nissan Jackrabbit(E) | 3/8 | 80/5 | 3/0 | 5/1 | -/0 | 1/100 | 2+1b | 20500 | 2/24hrs | 1 | Folding Bench Seat, Electric | sr2.307, r3.168 |
| Chrysler-Nissan Jackrabbit(M) | 3/8 | 90/6 | 3/0 | 4/1 | -/0 | 1/100 | 2+1b | 16500 | 2/24hrs | 1 | Folding Bench Seat, Methane | sr2.307, r3.168 |
| Daimler Benz Swatch C | 2/7 | 100/5 | 3/0 | 6/4 | 1/0 | 2/40 | 2 | 80000 | 2/24hrs | 1 | APPS, Anti-Theft System V, Gridlink, optional Suncell and roof rack | tss.6 |
| Ford-Min Pao Commuter | 4/8 | 70/4 | 2/0 | 5/1 | -/0 | 1/40 | 2 | 7000 | 2/24hrs | 1 | electric, streamlined design | tss.6 |
| Ford-Min Pao Spider | 4/8 | 150/10 | 3/0 | 1/1 | -/0 | 1/80 | 2 | 18000 | 3/48hrs | 1 | APPS | tss.6 |
| Leyland-Zil Tsarina(E) | 4/8 | 60/4 | 3/0 | 5/1 | -/0 | 2/50 | 2 | 16000 | 2/24hrs | 1 | Electric | r3.168 |
| Leyland-Zil Tsarina(M) | 4/8 | 100/6 | 3/0 | 4/1 | -/0 | 3/100 | 2 | 12500 | 2/24hrs | 1 | Methane | r3.168 |
| Mitsubishi Citycab | 3/10 | 90/5 | 2/3 | 6/4 | 3/2 | 1/40 | 1 | 75000 | 2/24hrs | 1 | Electric, APPS, Antitheft VII, Enviroseal, Gridlink, Learning Pool 2 (for defense decisions), optional roof rack and Roll Bars | tss.6 |
| Mitsubishi Runabout | 4/8 | 75/5 | 3/0 | 5/1 | -/0 | 1/50 | 1 | 12200 | 2/24hrs | 1 |  | r3.168 |
| Renault-Fiat Mulipla | 4/8 | 90/6 | 3/0 | 4/1 | 0/0 | 4/40 | 2+2 | 10000 | 2/24hrs | 1 |  | tss.6 |
| Volkswagen Beetle III | 3/6 | 90/5 | 3/0 | 6/2 | -/0 | 5/50 | 2 | 12000 | 2/24hrs | 1 | Gridlink | tss.6 |
| Volkswagen Elektro | 4/8 | 75/4 | 3/0 | 5/0 | -/0 | 1/45 | 1 | 10000 | 2/24hrs | 1 |  | r3.168 |
| Volkswagen Mayfly | 3/6 | 75/3 | 3/0 | 6/1 | 0/0 | 3/30 | 2 | 6000 | 2/24hrs | 1 | Gridlink | tss.6 |
| Conestoga Trailblazer | 4/8 | 90/3 | 5/0 | 2/2 | -/0 | 6/18000 | 2+1b | 152000 | 8/8days | 1 | Folding Bench Seat | r3.169 |
| GMC Tow Truck | 5/12 | 60/3 | 6/0 | 2/0 | -/0 | 105/11495 | 2 | 142000 | 6/6 days | 2.00 | crash cage, load hydraulic flatbed and winch designed to cary up to rating 6 Bod vehicle (heavy transport trailer t-bird or smaller), diesel engine, 500L fuel capacity, 3km/l economy | cus. |
| GMC 4201 | 3/7 | 85/3 | 6/0 | 2/2 | -/0 | 130/6500 | 2d+1x | 80000 | 4/4days | 1 |  | r3.169 |
| Ares Citymaster | 5/11 | 120/3 | 5/10 | 1/3 | -/0 | 41/530 | 2+5b | 136300 | 13/13days | 2 | Gas Enviroseal, Life Support(20 man-hrs), Small Turret(1 CF Ammo Bin) | sr2.310,r3.169 |
| Ares Mobmaster | 6/12 | 120/3 | 5/14 | 1/4 | -/0 | 40/575 | 2+5b | 173000 | 19/19days | 3 | Gas Enviroseal, Life Support(30 man-hrs), Small Turret(1 CF Ammo Bin) | r3.169 |
| Ares Roadmaster | 4/10 | 90/3 | 5/0 | 2/2 | -/0 | 80/2000 | 2+1b | 45000 | 3/3days | 1 |  | sr2.309, r3.169 |
| DocWagon Ares Citymaster | 5/11 | 120/3 | 5/10 | 1/3 | -/0 | 327[320 PS]/630[600 PS] | 2+2b | 677000 | - | 2.5 | Anti-Theft System 6, Gas Enviroseal, Life Suport(20 man-hrs), Small Turret(1 CF Ammo Bin), Medical Clinic(3p/3t 4) | r3.169 |
| DocWagon CRT Ambulance | 4/10 | 75/6 | 5/0 | 2/2 | -/0 | 348[336 PS]/1750[800 PS] | 2 | 537000 | 27/27days | 1.5 | Anti-Theft System 6, Medical Clinic(4p/4t 4) | r3.170 |
| DocWagon SRT Ambulance | 4/10 | 80/8 | 4/0 | 2/1 | -/0 | 100[84 PS]/250[200 PS] | 2 | 341250 | 18/18days | 1.5 | Anti-Theft System 6, Medical Clinic(1p/1t 4) | r3.170 |
| Ford E-255M Media Van | 4/8 | 85/4 | 4/0 | 2/2 | -/0 | 40/1180 | 1+1b | 37900 | 2/48hrs | 1 | Electronics Port, Large Portable Satellite Dish, Power Amplifiers 4, Satellite Link 3 | sta2.39 |
| GMC Bulldog Step-Van | 4/8 | 85/4 | 4/2 | 2/2 | -/0 | 50/1200 | 1+1b | 32600 | 2/48hrs | 1 | Folding Bench Seat | r3.170 |
| GMC Bulldog Step-Van(Security) | 4/6 | 85/4 | 4/5 | 2/2 | -/0 | 50/960 | 1+1b | 52600 | 9/9days | 2 | Folding Bench Seat | r3.170 |
| Leyland-Rover Trans(E Cl Bed) | 4/8 | 90/5 | 4/0 | 5/2 | -/0 | 70/430 | 2+1b | 49000 | 3/72hrs | 1 | Folding Bench Seat, Electric, Closed Bed | r3.170 |
| Leyland-Rover Trans(E Mini) | 4/8 | 90/5 | 4/0 | 5/2 | -/0 | 64/130 | 2+3b | 52000 | 3/72hrs | 1 | Folding Bench Seat, Electric, Minibus | r3.170 |
| Leyland-Rover Trans(E Pickup) | 4/8 | 90/5 | 4/0 | 5/2 | -/0 | 70/430 | 2+1b | 49000 | 3/72hrs | 1 | Folding Bench Seat, Electric, Pickup | r3.170 |
| Leyland-Rover Trans(G Cl Bed) | 4/8 | 105/8 | 4/0 | 2/2 | -/0 | 44/1200 | 2+2b | 51000 | 3/72hrs | 1 | Folding Bench Seat, Gas, Closed Bed | r3.170 |
| Leyland-Rover Trans(G Mini) | 4/8 | 105/8 | 4/0 | 2/2 | -/0 | 34/800 | 2+4b | 51000 | 3/72hrs | 1 | Folding Bench Seat, Gas, Minibus | r3.170 |
| Leyland-Rover Trans(G Pickup) | 4/8 | 105/8 | 4/0 | 2/2 | -/0 | 50[46 PS]/1350 | 2+1b | 51000 | 3/72hrs | 1 | Folding Bench Seat, Gas, Pickup | r3.170 |
| Lone Star Black Mariah USPTV | 4/6 | 100/4 | 4/9 | 2/2 | -/0 | 50/1255 | 2+1b | 115000 | 12/12days | 2 | Gas Enviroseal, Life Support(12 man-hrs), 2 Mini-Turrets(1 CF Ammo Bin each) | r3.170 |
| Renault-Fiat Eurovan(Camper) | 4/10 | 105/6 | 4/0 | 2/2 | -/0 | 90/550 | 2+3b | 53000 | 3/72hrs | 1 | Folding Bench Seat, Camper | r3.171 |
| Renault-Fiat Eurovan(Cov. Bed) | 4/10 | 105/6 | 4/0 | 2/2 | -/0 | 60/1500 | 2 | 34000 | 2/48hrs | 1 | Covered Bed | r3.171 |
| Renault-Fiat Eurovan(Pickup) | 4/10 | 105/6 | 4/0 | 2/2 | -/0 | 64/1500 | 2 | 38000 | 2/48hrs | 1 | Pickup | r3.171 |
| Rover Journeyman | 3/8 | 125/7 | 3/0 | 3/3 | -/0 | 8/600 | 2+2 | 50000 | 2/24hrs | 1 | Minivan, APPS, TDI Engine, Datajack Port, optional Rigger Adaptation | tss.6 |
| V-W Superkombi III | 4/8 | 105/7 | 4/1 | 2/3 | -/0 | 18/150 | 2+5b | 46300 | 3/72hrs | 1 | Folding Bench Seat | r3.171 |
| V-W Superkombi III(Cov. Bed) | 4/8 | 105/7 | 4/1 | 2/3 | -/0 | 48/540 | 1+2b | 47700 | 3/72hrs | 1 | Folding Bench Seat, Covered Bed | r3.171 |
| V-W Superkombi III(Flat Bed) | 4/8 | 105/7 | 4/1 | 2/3 | -/0 | 48/540 | 2 | 42700 | 3/72hrs | 1 | Folding Bench Seat, Flatbed | r3.171 |
| V-W Superkombi III(Pickup) | 4/8 | 105/7 | 4/1 | 2/3 | -/0 | 42/340 | 2+1b | 42200 | 3/72hrs | 1 | Folding Bench Seat, Pickup | r3.171 |
| V-W Superkombi III(RV) | 4/8 | 105/7 | 4/1 | 2/3 | -/0 | 24/800 | 4+2b | 50300 | 3/72hrs | 1 | Folding Bench Seat, RV | r3.171 |
| BMW 9018s | 3/8 | 190/14 | 4/2 | 0/3 | -/0 | 4/180 | 2+2+2 | 121200 | - | - |  | cb1.20 |
| Audi A9 GTX Scirocco | 3/3 | 140/15 | 3/3 | 2/3 | 2/0 | 3/300 | 2 | 45000 | 3/7days | 2 | Rally Car, no offroad speed change. Roll bars, Datajack port, GPS, Rigger Control, Amphibious OPs Packages I-III, Secondary Controls, Spotlight, Satt Uplink | tss.6 |
| Hawker-Ridley HS-895 Skytruck | 5 | 135(320)/22 | 9/0 | 3/3 | -/1 | 260/9000 | 2+40b | 1131250 | - | 1.00 |  | r3.178 |
| Lockheed C-260 Transport | 6 | 150(600)/35 | 9/12 | 2/3 | -/1 | 3000/55000 | 5 | 5876500 | - | 1.00 |  | r3.178 |
| Lockheed | 6 | 125(2500)/60 | 10/0 | 2/4 | -/3 | 250/15000 | 204 | 8275000 | NA | 1.00 | 6 Partial Basic Living Amenities | r3.178 |
| Airbus A1570 HSCT | 6 | 125(3000)/80 | 10/0 | 2/4 | -/4 | 360/10000 | 124 | 8040000 | NA | 1.00 | Rigger Adaption, 6 Partial Basic Living Amenities | r3.178 |
| Aztech Halcon GAA | 5 | 150(1800)/80 | 7/12 | 6/4 | -/9 | 3/2600 | 1e | 4500000 | NA | 3.00 | Gas Enviroseal, 2 External Fixed Hardpoints, 7 External Missile Mounts, Thermal Baffles 4 (factored in), ECM 9, ECCM 9, 3 Medium Launch Control Systems | r3.179 |
| Bac-Dessault-MBB EFA Variants | 4 | 150(2000)/150 | 7/6 | 5/3 | -/7 | 2/1700 | 1e | 2137500 | NA | 3.00 | Gas Enviroseal, External Fixed Hardpoint, 4 External Missile Mounts, Thermal Baffles 2 (factored in), ECM 4, ECCM 5, 2 Medium Launch Control Systems | r3.179 |
| Fiat-Fokker Cloud Nine | 4 | 60(200)/21 | 4/0 | 4/2 | -/1 | 9/325 | 2+2b | 315000 | 16/16 days | 1.00 | Floatation Package, 2 Folding Bucket Seats | r3.179 |
| CASA J-239 Raven | 3 | 135(400)/30 | 6/0 | 3/1 | -/4 | 44/450 | 2 | 331000 | 17/17 days | 1 | Customised Engine(factored in), 2 External Hardpoints | r3.180 |
| Cessna C750(Cargo) | 5 | 135(340)/22 | 6/0 | 4/2 | -/1 | 48/1100 | 2 | 177000 | 9/9 days | 1.00 |  | sr2.310,r3.180 |
| Cessna C750(Passenger) | 5 | 135(340)/22 | 6/0 | 4/2 | -/1 | 36/500 | 4 | 167000 | 9/9 days | 1.00 |  | sr2.310,r3.180 |
| Embraer-Dassault Mistral | 4 | 135(300)/21 | 6/0 | 4/2 | -/1 | 12/600 | 17 | 362000 | 18/18 days | 1.00 |  | r3.180 |
| Lear-Cessna Platinum I | 4 | 135(330)/24 | 6/0 | 4/3 | -/2 | 29/400 | 2+3b | 213000 | 15/15 days | 2.00 | 3 Folding Bench Seats | r3.180 |
| Lear-Cessna Platinum II | 4 | 135(800)/40 | 6/0 | 3/4 | -/2 | 35/1000 | 2+2b | 427000 | 26/26 days | 2.00 | 2 Folding Bench Seats | r3.180 |
| Artemis Nightglider | 3 | 10(60)/4 | 2/0 | 9/1 | -/0 | 4/190 | 1 | 46500 | 3/72 hrs | 1.00 |  | r3.181 |
| Moonlight Aerospace Avenger | 4 | 40(200)/21 | 2/4 | 6/2 | 0/1 | 0/58 | 1 | 50000 | 3/72 hrs | 2.00 | 2 External Firmpoints | r3.181 |
| Renraku Tendai LAV | 4 | 700/30 | 7/15 | 3/4 | 4/8 | 36/15000 | 3+12 | 20000000 | - | 3.00 | ECM/ECCM Military, level unknown. 2 external drone racks, 2 small remote turrets, 20 Naga AP mines, 4 automatic grenade launchers | tss.6 |
| GMC-Nissan Hovertruck | 5 | 120/5 | 5/0 | 2/1 | -/0 | 94/1850 | 2+1b | 200000 | 10/10 days | 1 | Folding Bench Seat | r3.181 |
| NT Vodianoi Personnel Carrier | 4 | 150/10 | 5/6 | 4/3 | -/4 | 42.5/2400 | 1+2+2b+2b | 468600 | 24/24days | 3.00 | EnviroSeal (Gas with Cabin Overpressure), Radar Absorbent Materials 1 (factored in), Electronics Port (with Rating 3 Radio), Thermal Baffles 1 (factored in), 2 Ring Mounts | sota.78 |
| NT Vodianoi Assault Craft | 4 | 150/10 | 5/6 | 4/3 | -/4 | 26.5/2375 | 1+2+2b+2b | 489600 | 25/25days | 3.00 | EnviroSeal (Gas with Cabin Overpressure), Radar Absorbent Materials 1 (factored in), Electronics Port (with Rating 3 Radio), Thermal Baffles 1 (factored in), Small Turret (5 CF Ammo Bin), Medium Launch Control System, 8 Internal Missle Mounts | sota.78 |
| Silkorsky-Bell Red Ranger | 3 | 270/16 | 3/2 | 2/3 | -/1 | 10/98 | 2 | 336000 | 17/17 days | 1.00 | Amphibious Operation 3 | r3.181 |
| Chrysler-Nissan G12A(cargo) | 4 | 120/5 | 4/0 | 2/2 | -/0 | 66/1000 | 2 | 62000 | 4/96 hrs | 1.00 |  | sr2.309, r3.182 |
| Chrysler-Nissan G14 | 4 | 120/5 | 4/12 | 3/4 | -/0 | 21/400 |  | 750000 | 10/10 days | 2.0 | medium turret (weapon n/i), provisions for 2 drone racks or 4CF AA missiles | tss.6 |
| GMC Beachcraft Patroller | 4 | 165/9 | 4/6 | 1/2 | -/0 | 65/510 | 2 | 176000 | 15/15 days | 2.00 | External Fixed Hardpoint (1 CF Ammo Bin) | sr2.311,r3.182 |
| GMC Beachcraft Vacationer | 4 | 105/7 | 4/0 | 2/3 | -/0 | 180[174 PS]/1250[600 PS] | 2+2b | 289000 | 15/15 days | 1.00 | Basic Living Amenities | r3.182 |
| Lone Star SWAT Hovertruck | 4 | 120/8 | 4/6 | 2/3 | -/0 | 28/870 | 2+5b | 214000 | 17/17 days | 2.00 |  | r3.182 |
| Mostrans KVP-14T(standard) | 4 | 180/9 | 4/0 | 2/1 | -/0 | 72/800 | 2 | 124000 | 7/7 days | 1.00 |  | r3.182 |
| Mostrans KVP-14T(passenger) | 4 | 180/9 | 4/0 | 2/1 | -/0 | 18/300 | 11b | 143000 | 8/8 days | 1.00 |  | r3.182 |
| Aztechnology Aguilar-EX | 4 | 350/27 | 5/5 | 2/4 | -/7 | 2/1560 | 2 | 1508250 | NA | 3.00 | External Fixed Hardpoint, 5 External Missle Mounts, ECM 6, ECCM 7, 2 Medium Launch Control Systems | r3.183 |
| Eurocopter Tiger | 3 | 300/21 | 5/5 | 3/3 | -/5 | 3/1600 | 2 | 982500 | - | 3.00 | Crash Cage, Datajack Port, Drive-by-Wire 1, ECM 2, ECCM 2, 2 External Fixed Hardpoints (located under chin), Medium Launch Control System, Rigger Adaptation, 2x3 Rocket Mounts (Wingtip) | sota.78 |
| M-K Sperber Military Variant | 4 | 350/32 | 5/9 | 5/3 | -/6 | 2/580 | 2 | 1380000 | - | 3.00 | ECM 5, ECCM 5, Thermal Baffles 1, 4 External Rocket Mounts and 1 Fixed Firmpoint on each Wing (8 mounts and 2 firmpoints total), Medium Launch Control System, Mini-Turret (located under chin) | sota.78 |
| M-K Sperber Security Variant | 4 | 350/32 | 5/5 | 4/3 | -/5 | 5/880 | 2 | 1123250 | - | 2.00 | ECM 2, ECCM 2, 2x3 External Rocket Mounts (Wingtip), Medium Launch Control System, Mini-Turret (located under chin) | sota.78 |
| Ilyushin-Greifswald Argus | 3 | 275/20 | 2/6 | 4/3 | -/5 | 1/25 | 1 | 200000 | 7/7Days | 2.0 | Remote Popup Micro-Turret (weapon n/i), optional pintle mount for pilot | tss.6 |
| Northrup Mosquito PRC-51F | 2 | 120/18 | 2/3 | 5/2 | -/4 | 1/20 | 1 | 250000 | 4/4Days | 2.0 | ECM 1, ECCM 2, Micro-Turret (weapon n/i), optional missile pods | tss.6 |
| Northrup Wasp PRC-42B | 3 | 130/15 | 3/0 | 3/0 | -/2 | 2/72 | 1 | 54000 | 9/9 days | 2.00 | ECCM 1,Micro-Turret (weapon n/i) | sr2.311,r3.183 |
| Northrup Wasp PRC-42F | 3 | 130/15 | 3/2 | 4/0 | -/2 | 2/32 | 1 | 72000 | 10/10 Days | 2.00 | ECCM 1,Micro-Turret (weapon n/i) | r3.183 |
| Northrup YellowJacket PRC44B | 4 | 130/15 | 3/0 | 3/0 | -/2 | 1/52 | 1 | 52000 | 9/9 days | 2.00 | ECCM 1,Micro-Turret (weapon n/i) | r3.183 |
| Northrup YellowJacket PRC44F | 4 | 130/15 | 3/2 | 4/0 | -/2 | 1/27 | 1 | 76000 | 10/10 Days | 2.00 | ECCM 1,Mini-Turret (weapon n/i) | r3.183 |
| Ares Dragon | 5 | 260/10 | 7/0 | 3/3 | -/1 | 95/3250 | 3 | 590000 | 30/1Month | 1 |  | sr2.310,r3.184 |
| Hughes Airstar | 4 | 200/16 | 7/6 | 3/4 | -/1 | 226/2100 | 11 | 1330500 | n/a | 1 | Concealed Armor, Partial High Living Amenities | r3.184 |
| Ares TR-55 Class C | 5 | 320/12 | 5/5 | 4/3 | -/1 | 24/100 | 2+3b | 338000 | 17/17Days | 1.00 | 3 Folding Seats,VTOL | r3.184 |
| Ares TR-55 Class E | 5 | 350/12 | 5/0 | 4/3 | -/1 | 25/500 | 11 | 338000 | 21/21 Days | 2 | VTOL | r3.184 |
| Ares TR-55 Class T | 5 | 350/12 | 5/0 | 4/3 | -/1 | 7/500 | 14 | 350000 | 18/18Days | 1.00 | VTOL | r3.184 |
| Doc Wagon CRT Air Unit | 5 | 320/8 | 7/0 | 1/3 | -/1 | 2[336 PS]/350[800 PS] | 2 | 1266750 | - | 2.50 | VTOL, Anti-Theft System (Rating 6), 2 External Hardpoints, Medical Clinic(2 patients Rating 4) | r3.184 |
| Doc Wagon Osprey II | 5 | 380/10 | 5/3 | 2/3 | -/1 | 12[168 PS]/300[400 PS] | 2 | 935000 | - | 2.50 | VTOL, Anti-Theft System (Rating 6), 2 External Hardpoints, Medical Clinic(2 patients Rating 4) | sr2.311,r3.184 |
| Fed-Boeing Commuter | 5 | 320/10 | 5/0 | 4/3 | -/1 | 6/850 | 17 | 318000 | 16/16Days | 1.00 |  | r3.184 |
| Agusta-Clerva Plutocrat | 4 | 290/17 | 4/2 | 3/4 | -/1 | 7/240 | 2+1b | 421000 | 26/26 Days | 2.00 | 2 Folding Bucket Seats, Reinforced Bench Seats, Partial High Living Amenities, Electronics Port w/Satelite uplink | r3.184 |
| Agusta-Clerva Plutocrat (S) | 4 | 290/17 | 4/2 | 3/4 | -/1 | 8/140 | 2+1b | 517000 | - | 2.00 | 2 Folding Bucket Seats, Reinforced Bench Seats, Partial High Living Amenities, Electronics Port w/Satelite uplink, Small Turret | r3.184 |
| Doc Wagon SRT | 5 | 250/18 | 4/0 | 3/3 | -/1 | 5[84 PS]/500[200 PS] | 1 | 773750 | - | 1.50 | Anti-Theft System (Rating 6),Medical Treatment Gear (1 patient), Carries 1 patient 1 medtech and a pilot | r3.184 |
| E-D Dorocilo(base) | 4 | 350/15 | 5/0 | 3/4 | -/0 | 55/2400 | 2 | 550000 | 11/10 Days | 1.00 | base model, no toys | tss.6 |
| E-D Dorocilo(cargo) | 4 | 350/15 | 5/0 | 3/4 | -/0 | 555/2400 | 2 | 575000 | 11/10 Days | 1.00 | back ramp, side door | tss.6 |
| E-D Dorocilo(commuter) | 4 | 350/15 | 5/0 | 3/4 | -/0 | 87/2400 | 2 | 600000 | 15/15 Days | 1.00 | 4x2-aisle-2 bucket seats, side door | tss.6 |
| E-D Dorocilo(Luxury) | 4 | 350/15 | 5/0 | 3/4 | -/0 | 65/2400 | 2 | 800000 | 18/18 Days | 2.00 | 4 comfy bucket seats, 3 person couch + 2 foldup bendhes, 2 mahogany desks, comm/entertainment suite, satt Matrix uplink, kitchen, bar, side door | tss.6 |
| E-D Dorocilo(Troop Carrier) | 4 | 350/15 | 5/9 | 3/4 | -/0 | 85/2400 | 2 | 750000 | 260/130 Days | 3.00 | 10 oversized bucket seats, weapon rack, tac comm, 2 side doors and back ramp | tss.6 |
| E-D Dorocilo(Drone Carrier) | 4 | 350/15 | 5/9 | 3/4 | -/0 | 305/2400 | 2 | 1050000 | 260/130 Days | 3.00 | 4 external drone racks, internal storage for 2 cars or 4 Steel Lynx-sized vehicles or drones, drone rearmament and recharge facility, Speed 250 when loaded | tss.6 |
| Fuchi Tsumukari | 6 | 400/20 | 6/12 | 3/4 | 4/8 | 505/800 | 3+12 | 7500000 | 260/130 Days | 3.00 | cargo space for 12 men and a manned APC, medium remote turret(rotary autocannon), 4 remote micro-turrets(2xTwin LMG), 4CF AA missiles, 8CF AG rockets, 4CF AG missiles, 4CF air-drop AP mines | tss.6 |
| Hughes WK-2 | 5 | 190/14 | 4/0 | 3/3 | -/1 | 70/1250 | 2 | 257500 | 13/13 Days | 1.00 |  | sr2.310,r3.184 |
| Doc Wagon Hughes WK-2 | 5 | 190/14 | 4/6 | 1/3 | -/1 | 4[84 PS]/200[200 PS] | 2 | 828750 | - | 2.50 | Anti-Theft System (Rating 6), 2 External Hardpoints, Medical Treatment Gear (2 patients) | r3.184 |
| MF Akihito-Class Supercarrier | 5 | 45(20)/3 | 9/12 | 1(2)/4 | -/10(2) | 2984748[158500 PS]/8424995[1425000 PS] | - | 999999999 | - | 1 | Actual cost: 9 BILLION NUYEN,Aircraft Facilities (10 facilities 80 planes), Flight Deck (325m Angled Catapult/Arrestor), ECCM 10, ECD 6, 2 Remote Large Turrets (12 medium Internal Missle Mounts Each), 4 Medium Launch Control Systems, 4 Remote Medium Turrets w/ANDREWS System, 5500 Basic Living Amenities, 500 Improved Amenities | r3.186 |
| CSS Stuart Class Corvette | 3 | 70(30)/5 | 3/3 | 3(4)/4 | -/4(4) | 302[3600 PS]/2500[52500 PS] | - | 60000000 | - | 1.00 | Medium Remote Turret (Victory Autocannon w/ 500 rnds in 2 CF ammo bin), 2 Medium Remote Turrets (8 Medium Internal Missle Mounts), 2 Launch Control Systems, 35 Basic Living Amenities | r3.186 |
| Shiawase Aohana-Class Frigate | 4 | 45(20)/4 | 4/3 | 2(4)/4 | -/6(4) | 6889[21250 PS]/75000[668000 PS] | - | 116000000 | - | 1.00 | Aircraft Facilities (1 Helicopter), Medium Remote Turret (Light Naval Gun w/500 rds in 16 CF ammo bin), Medium Remote Turret (Victory Autocannon w/2000 rds in 13 CF ammo bin), 2 Torpedo Tubes (20 torpedoes w/autoloader), 6 Heavy Launch Control Systems, 24 Heavy Internal Missile Mounts, 300 Basic Living Amenities | r3.186 |
| Cunard Princess Victoria Liner | 4 | 50(15)/2 | 5/0 | 3(2)/4 | -/4(1) | 39300[35700 PS]/734995[750000 PS] | - | 40000000 | - | 2.00 | 30 Basic Living Amenities, 200 Improved Living Amenities, 100 High Living Amenities | r3.187 |
| KM Jorgensen Class Merchantman | 5 | 25(10)/1 | 7/0 | 2(2)/3 | -/1(1) | 300000[3000 PS]/1999440[37500 PS] | - | 140000000 | - | 1.00 | Crane (5000 kg), 25 Basic Living Amenities | r3.186 |
| USS New Hampshire Attack Sub | 4 | (50(35)/22(15))/4(2) | 5/9 | (7(7)/6(4))/4 | -/7(9) | 358[11700 PS]/2282360[236250 PS] | - | 860000000 | - | 1.00 | Water and Engine Enviroseal, Oxygen Generator, 6 Torpedo Tubes, 12 Heavy Launch Control Systems, 36 Torpedoes, 16 Heavy Internal Missile Mounts, 105 Basic Living Amenities | r3.187 |
| KM Triton Class Submarine | 5 | (30(20)/10(2))/1(1) | 7/3 | (5(4)/5(3))/3 | -/2(2) | 200000[2940 PS]/15000000[36000 PS] | - | 435000000 | - | 1.00 | Water and Engine EnviroSeal, Oxygen Generator, 24 Basic Living Amenities | r3.188 |
| Saeder-Kruppp D.J. Locker | 3 | 15(30)/3(3) | 4/0 | (8(8)/6(4))/2 | -/0(1) | 3/410 | 2 | 193000 | 10/10 days | 1.00 | Water & Engine EnviroSeal, Life Support (10 man-hours), Mechanical Arm (STR 12), Spotlight | r3.188 |
| Vulkan Delphin RQ7(standard) | 4 | 50(30)/3(4) | 6/2 | (8(8)/6(4))/2 | -/1(1) | 26[198 PS]/575[1200 PS] | 4 | 546000 | 27/27 days | 1.00 | Water & Engine EnviroSeal, Life Support (100 man-hours), 8 Basic Living Amenities | r3.188 |
| Vulkan Delphin RQ7(patrol) | 5 | 50(30)/3(4) | 6/9 | (7(7)/5(5))/2 | -/5(3) | 3[198 PS]/120[1200 PS] | 4 | 1262000 | - | 2.00 | Water & Engine EnviroSeal, Life Support (100 man-hours), 8 Basic Living Amenities, 4 Medium Launch Control Systems (Piranha mini-torpedo system), 12 Internal Mini Torpedo Mounts, Mini-turret (1 CF Ammo Bin and HMG) | r3.188 |
| Vulkan Electronaut | 3 | 15/4 | 4/0 | 8(8)/2 | -/0(0) | 4/150 | 2 | 45000 | 3/3 days | 1.00 | Water and Engine EnviroSeal, Life support (10 man hours) | r3.188 |
| KS Vaneyev Class Patrol Sub | 3 | (45(30)/20(17))/3(2) | 4/9 | (6(4)/8(8))/3 | -/4(4) | 823[6600 PS]/41985[127500 PS] | - | 210000000 | - | 1.00 | Water and Engine EnviroSeal, Oxygen Generator, 4 Torpedo Tubes, 4 Heavy Launch Control Systems, 24 Torpedoes, 85 Basic Living Amenities | r3.189 |
| Mitsuhama Anago(standard) | 3 | 35/4 | 2/0 | 9(9)/1 | 1/1(1) | 2/450 | 2 | 13750 | 2/24 hrs | 1.00 | 6 Handholds | r3.186 |
| Mitsuhama Anago(security) | 3 | 35/4 | 2/0 | 9(9)/1 | 1/1(1) | .5/440 | 2 | 15000 | 8/8 Days | 2.00 | 6 handholds, 1 External Fixed Firmpoint (1 CF ammo bin) | r3.189 |
| Federated Boeing Eagle | 4 | 1800/75 | 7/10 | 2/3 | -/8 | 2.5/500 | 1e | 12102000 | - | 3.00 | Gas Enviroseal, ECM 7, ECCM 8, RAM 2 (factored in), 2 External Fixed Hardpoints (1 CF ammo bin each), Missile Launch System, 6 Missile Mounts (Total Ordinance Weight 1800 kg) | r3.190 |
| Aztech Lobo Medium Scout LAV | 6 | 250(850)/35 | 6/21 | 2/3 | -/7 | 24/800 | 3e | 2420000 | NA | 3.00 | ECM 6, ECCM 5, Medium Turret (1 CF Ammo Bin), Gas Enviroseal | r3.190 |
| GMC Banshee | 6 | 250(1000)/50 | 6/18 | 5/2 | -/7 | 29/805 | 3e | 2560000 | NA | 3.00 | ECM 5, ECCM 5, RAM 2 (factored in), Thermal Baffles 1 (factored in), External Fixed Hardpoint, Small Turret (1 CF Ammo Bin), Gas Enviroseal | sr2.311,r3.190 |
| GMC Harpy Scout LAV | 5 | 250(850)/45 | 6/15 | 6/2 | -/5 | 24/1000 | 3e | 2210000 | NA | 3.00 | ECM 3, ECCM 3, RAM 2 (factored in), Thermal Baffles 2 (factored in), Gas Enviroseal, Medium Launch Control System, 2 External Missile Mounts, Small Turret (1 CF Ammo Bin) | r3.190 |
| Nizhinyi BMV-2 | 3 | 250(750)/40 | 6/9 | 3/2 | -/4 | 27.5/2375 | 1e+2e+2b+2b | 1844750 | NA | 3.00 | Small Turret (10 CF Ammo Bin), Medium Launch System, 4 Internal Missle Mounts | sota.78 |
| Airship Industries Skyswimmer | 3 | 100/2 | 8/1 | 5/2 | -/1 | 42/750 | 2+1b | 240000 | 12/12 days | 1.00 | Suncell, This model is a dirigible | r3.191 |
| Goodyear Commuter-47 | 3 | 250/15 | 8/1 | 3/2 | -/1 | 50/1500 | 8+1b | 360000 | 18/18 days | 1.00 | This model is a dirigible | r3.191 |
| Luftschiffbau LA-2049 | 3 | 200/10 | 8/4 | 3/2 | -/1 | 128/2400 | 2+1b | 318000 | 16/16 days | 1.00 |  | r3.191 |
| Luftschiffbau LA-2051-C | 3 | 140/8 | 8/1 | 3/3 | -/1 | 110/3200 | 2+1b | 310000 | 16/16 days | 1.00 |  | r3.191 |
| N-C Bergen(tractor) | 3/6 | 90/2 | 8/6 | 1/4 | -/2 | 5/400000 | 4+2b | 750000 | 38/38 days | 1.00 |  | r3.192 |
| N-C Bergen(trailer) | - | - | 8/3 | 3/- | -/0 | 1008/80000 | 2 | 227000 | 10/10 days | 1.00 |  | r3.192 |
| A | 6 | 200(1000)/50 | 2/1 | 2/4 | 4/4 | 300/12000 | 156 | 75000000 | - | 1.00 | Rigger Adaption, 8 Partial Basic Living Amenities | r3.192 |
| GD SV250 Semiballistic | 5 | 200(1500)/60 | 2/1 | 2/4 | 4/4 | 250/8000 | 126 | 76000000 | - | 1.00 | Rigger Adaption, 8 Partial Basic Living Amenities | r3.192 |
| S Snowglide | -/3 | 70/3 | 2/0 | 5/0 | -/0 | 2/20 | 2m | 28600 | 2/24hrs | 1,00 | Environmental Adaptation (Artic) | twl.133 |
| A-M Hoplite (G) | -/3 | 90/6 | 2/4P | 1/0 | -/0 | 0,3/34 | 1m | 12600 | 2/24hrs | 2,00 | Amphibious Operation 1, Electronics Port w/Personal Com Unit (Rationg 4, 1.2 CF), Environmental Adaptation (Artic), Externeal Fixed Firmpoint (1 CF Ammo Bin), Turbocharging 2 (factored in) | twl.133 |
| A-M Hoplite (F) | -/3 | 65/5 | 2/4P | 4/0 | -/0 | 0,3/20 | 1m | 23600 | 2/24hrs | 2,00 | Amphibious Operation 1, Electronics Port w/Personal Com Unit (Rationg 4, 1.2 CF), Environmental Adaptation (Artic), Externeal Fixed Firmpoint (1 CF Ammo Bin), Turbocharging 1 (factored in) | twl.133 |
| F-B China Clipper Suborbital | 5 | 150(1250)/150 | 1/2 | 2/4 | 4/4 | 400/12500 | 156 | 32000000 | NA | 1.00 | Rigger Adaption, 8 Partial Basic Living Amenities | r3.192 |
| Ilyushin IL-159 Suborbital | 6 | 150(750)/80 | 1/2 | 2/4 | 4/4 | 580/20000 | 154 | 30000000 | NA | 1.00 | Rigger Adaption, 8 Partial Basic Living Amenities | r3.192 |
| Moonlight Aerospace Gossamer | 5 | */* | 1/0 | 16/- | 3/3 | 2/5 | - | 120000 | 3/72hrs | 1 | Speed and Accel depend on windspeed, Remote Control Interface, Rigger Adaptation, Electroncs Bay, Optional Monofilament reels and Multicore fibre controls | tss.6 |
| Renraku Scorpion | 4 | 180/18 | 3/9 | 2/3 | 2/4 | 10/75 | - | 25000 | 4/24hrs | 3.0 | Alternate stats while in ground mode, micro-turret (weapon n/i), 6CF reserved for more electronics and 4CF for ammo | tss.6 |

### Drones (system list)
| Name | Handling | Speed/Accel | Body/Armor | Sig/Autonav | Pilot/Sensor | Cargo/Load | Seating | Cost | Availability | Street Index | Notes | Book |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Mesametric Kodiak | 5/4 | 20/2 | 4/12 | 3/- | 2/3 | 0/1025 | - | 75500 | 4/4days | 2 | Remote-Control Interface, Rigger Adaptation, Off-Road Suspension 2(factored in), Improved Suspension 2(factored in), Crane(Scoop 1000kg), Dozer Blade | r3.163 |
| Mazda Dust Devil | 4/4 | 10/2 | 1/0 | 8/0 | 1/1 | 0/0 | - | 1500 | 2/24hrs | .5 | Remote-Control Interface, Rigger Adaptation, Special Machinery (vacuum/wetvac/brushes/sprayer), Special Storage Area (liquid tanks-2l total) | ssg.122 |
| IFMU Mr. Green 3500 | 4/4 | 10/2 | 1/0 | 8/0 | 1/1 | 0/0 | - | 3500 | 2/24hrs | .5 | Remote-Control Interface, Rigger Adaptation, Autosoft Interpreter, Autosoft (Gardening 1), Special Machinery (lawnmower/sprinkler/shears/sprayer), Special Storage Area (liquid tanks/5l) | ssg.122 |
| IFMU Mr. Fireman 3500 | 4/4 | 10/2 | 1/4 | 8/0 | 2/1 | 0/4 | - | 11000 | 2/24hrs | 1 | Remote-Control Interface, Rigger Adaptation, Autosoft Interpreter, Autosoft (Firefighting 2), Special Machinery (smoke/fire detector/sprayer), Special Storage Area (10l fire extinguisher) | ssg.122 |
| Renraku StreetCleaner | 4/6 | 10/2 | 2/0 | 7/- | 2/2 | 0/5 | - | 7000 | 2/24hrs | 1 | Remote-Control Interface, Rigger Adaptation, Special Machinery (sweep and brush system), Special Storage Area (10 liter water tank) | ssg.122 |
| V.R. House Helper | 4/4 | 10/2 | 1/0 | 8/0 | 1/1 | 0/0 | - | 1500 | 2/24hrs | .5 | Remote-Control Interface, Rigger Adaptation, Special Machinery (vacuum/wetvac/brushes/sprayer), Special Storage Area (liquid tanks-2l total) | ssg.122 |
| Mitsuhama Butlerbot | 4/4 | 10/2 | 2/0 | 7/0 | 2/2 | 5/50 | - | 25000 | 2/24hrs | 1 | Remote-Control Interface, Rigger Adaptation, Robotic Pilot, Adaptation Pool 2, Fuzzy Logic Augmentation, Mechanical Arm (Strength 4), Special Machinery (cleaning items), Special Storage Area (beverage/water/cleaning tanks/5l total) | ssg.122 |
| GM Mr Fix-It | 4/4 | 10/2 | 1/0 | 8/0 | 3/1 | 3/170 | - | 27000 | 2/24hrs | 1 | Remote-Control Interface, Rigger Adaptation, Autosoft Interpreter, Autosoft (any B/R skill at rating 3), Special Machinery (toolkit), 2 Mechanical Arms (Strength 4) | ssg.122 |
| IFMU Mr. Bright 3000 | 4/4 | 2/- | 1/0 | 8/- | 1/1 | 4/2 | - | 6500 | 2/24hrs | 1 | Remote-Control Interface, Rigger Adaptation, Special Machinery (window cleaning gear/foot suction system), Special Storage Area (5 liter water tank), Winch (25 kg) | ssg.122 |
| IFMU Mr. Bright (household) | 4/4 | 2/- | 1/0 | 8/- | 1/1 | 4/5 | - | 6000 | 2/24hrs | 1 | Remote-Control Interface, Rigger Adaptation, Special Machinery (window cleaning gear/foot suction system), Special Storage Area (5 liter water tank) | ssg.122 |
| Renraku Barback | 3 | 10/- | 2/0 | 6/0 | 2/2 | 0/20 | - | 44000 | 3/72hrs | 1 | Remote-Control Interface, Rigger Adaptation, Robotic Pilot, Adaptation Pool 2, Fuzzy Logic Augmentation, 2 Mechanical Arms (Strength 6) | ssg.122 |
| Ares Felix the SynthCat | 4/4 | 15/- | 1/0 | 8/- | 1/1 | 0/5 | - | 9500 | 2/24hrs | 1 | Remote-Control Interface, Rigger Adaptation, Robotic Pilot, Improved Neural Network 1, Adaptation Pool 2 | ssg.122 |
| Ares Sentinel | 4 | 25/2 | 1/12 | 7/0 | 3/4 | 1/25 | - | 32000 | 8/8 days | 2 | Remote-Control Interface, Rigger Adaptation, Gridlink, Micro-turret(1 CF Ammo Bin) | r3.172 |
| Aztech GCR-23C Crawler | 4/4 | 15/3 | 1/0 | 8/0 | 1/1 | 1/15 | - | 3750 | 2/24hrs | 1 | Remote-Control Interface, Rigger Adaptation | r3.172 |
| Aztech Hedgehog | 4/4 | 15/3 | 1/0 | 8/0 | 5/4 | 1/16 | - | 200000 | 16/16 days | 2.00 | Remote-control interface, Rigger Adaption, 2 Electronics Ports (Rigger Decryption 4 Rigger Protocol Emulation 4 0.2 CF total), Autosoft Interpretation System, Autosoft: Electronic Warfare 5 | r3.172 |
| Citroen Brouillard Smoke Gen. | 4/4 | 50/5 | 2/0 | 4/0 | 1/1 | 0/250 | - | 10000 | 2/24hrs | 1 | Remote-Control Interface, Rigger Adaptation, Smoke Generator, Fog Oil(5 CF), Graphite Smoke(1 CF) | r3.172 |
| Ferret RPD-VI Perimeter Drone | 3/4 | 30/2 | 1/0 | 8/0 | 3/4 | 4/50 | - | 18500 | 9/9 days | 2 | Remote-Control Interface, Rigger Adaptation, Spotlight(white light) | r3.172 |
| FMC TADS Salamander | 4/4 | 60/6 | 2/0 | 4/0 | 2/3 | 4/125 | - | 24500 | 2/48 hrs | 2.00 | Remote-Control Interface, Rigger Adaptation, BattleTac FDDM Receiver | r3.172 |
| Gaz-Niki GNRD-71 BIS Snooper | 4/3 | 75/3 | 1/0 | 8/0 | 1/1 | 2/30 | - | 8500 | 2/24hrs | 1 | Remote-Control Interface, Rigger Adaptation | sr2.312,r3.172 |
| GM-Nissan Doberman | 3/5 | 70/8 | 2/6 | 2/0 | 2/1 | 2.5/50 | - | 25000 | 8/8 days | 2 | Remote-Control Interface, Rigger Adaptation, External Fixed Firmpoint(0.4 CF Ammo Bin), Remote Micro-turret(1 CF Ammo Bin) | sr2.311,r3.173 |
| IWS DLK MK 6 | 4/4 | 35/3 | 2/0 | 7/0 | 2/3 | 1/350 | - | 21000 | 2/48hrs | 1 | Remote-Control Interface, Rigger Adaptation, 2 Mechanical Arms(STR 6) | r3.173 |
| IWS DLK MK 6(Armed) | 4/4 | 35/3 | 2/4 | 6/0 | 2/3 | 1.5/280 | - | 22000 | 8/8 days | 2 | Remote-Control Interface, Rigger Adaptation, Mechanical Arm(STR 6), External Fixed Firmpoint(1 CF Ammo Bin) | r3.173 |
| MCT Hachiman | 3/4 | 10/2 | 2/5(7) | 7/0 | 3/5 | 4/125 | - | 70000 | NA | 2 | Ablative Armor 1, Robot-Pilot Advanced Programming, Adaptation Pool 3, Robotic Reflexes 3, Remote-Control Gear, Remote Mini-turret w/Ultimax MMG, Rigger Interface, Spotlight | r3.173 |
| Saab-Thyssen Bloodhound | 3/3 | 90/6 | 2/0 | 4/0 | 2/4 | 2/5 | - | 23500 | 2/48hrs | 2 | Remote-Control Interface, Rigger Adaptation, Amphibious Operation 1, Mechanical Arm(STR 6 Cybersquirt Implant), Special Storage Area(Liquid Tank 10 liters 1 CF), Special Machinery(HAZMAT Sensors) | r3.173 |
| Steel Lynx Ground Combat Drone | 4/6 | 80/6 | 2/9 | 6/0 | 2/1 | 3/225 | - | 34500 | 8/8 days | 2 | Remote-Control Interface, Rigger Adaptation, Remote Mini-Turret(1 CF Ammo Bin) | r3.173 |
| A.S. Condor LDSD-23 | 4 | 60/3 | 2/0 | 10/0 | 1/1 | 1/50 | - | 9000 | 2/24hrs | 1 | Remote-Control Interface, Rigger Adaptation, SunCell Power | r3.174 |
| A.S. Condor LDSD-41 | 4 | 75/5 | 2/3 | 10/0 | 3/1 | 4/28 | - | 33650 | 2/48hrs | 1 | Remote-Control Interface, Rigger Adaptation, SunCell Power | r3.174 |
| LS Sherlock Crime Analysis | 3 | 75/8 | 1/0 | 8/0 | 2/6 | 1/25 | - | 180000 | 12/3 wks | 2 | Remote-Control Interface, Rigger Adaptation, chem sniffer 6, mads 6, mechanical arm (str 2), camera, trideo recorder | sta2.98 |
| Sikorsky-Bell Microskimmer I | 3 | 90/6 | 1/0 | 7/0 | 1/1 | 1/5 | - | 7500 | 2/24hrs | .5 | Remote-Control Interface, Rigger Adaptation | r3.174 |
| Sikorsky-Bell Microskimmer II | 3 | 90(45)/5(3) | 1/0 | 7(7)/0 | 1/1 | 1/5 | - | 18300 | 2/24hrs | .5 | Remote-Control Interface, Rigger Adaptation, Ballast Tanks, Engine Enviroseal, Auxiliary Engine(Electric Battery) | r3.174 |
| Ares Arms Sentry II | - | -/- | 2/0 | 7/0 | 4/4 | 1/145 | - | 43500 | 9/9 days | 2 | Remote-Control Interface, Rigger Adaptation, Micro-Turret(Anti-Aircraft Capability; 1 CF Ammo Bin), Generator(12hrs of power) | r3.175 |
| Aztech Liebre RPV | 3 | 60(1620)/75 | 3/4 | 5/0 | 4/4 | 5/25 | - | 195000 | 16/16days | 2 | Remote-Control Interface, Rigger Adaptation, External Fixed Hardpoint, Vindicator Minigun | r3.175 |
| CAS Wandjina RPV | 5 | 60(500)/40 | 3/6 | 5/0 | 4/3 | 1/325 | - | 119000 | 12/12days | 2 | Remote-Control Interface, Rigger Adaptation, External Fixed Hardpoint, External Missle Mount | r3.175 |
| FMC-Stonebrooke TADS Firebird | 4 | 40(105)/30 | 2/0 | 6/0 | 2/3 | 0/5 | - | 52000 | 9/9 days | 2 | Remote-Control Interface, Rigger Adaptation, BattleTac FDDM | r3.175 |
| GM-Nissan Spotter | 3 | 40(200)/35 | 2/0 | 6/0 | 2/1 | 0/10 | - | 45250 | 3/72hrs | 1 | Remote-Control Interface, Rigger Adaptation | r3.175 |
| GTE-Ford Retrans Unit | 4 | 40(105)/30 | 2/0 | 6/0 | 2/1 | 4/115 | - | 40300 | 2/48hrs | 1 | Remote-Control Interface, Rigger Adaptation, Retrans Mission Unit | r3.175 |
| MCT Indrahar O-5P Surv. Drone | 4 | 60(300)/20 | 3/0 | 6/0 | 3/6 | 2/100 | - | 108825 | 6/6 days | 1.5 | Remote-Control Interface, Rigger Adaptation, ECCM 6, Enhanced Sensors 6 | sta2.39 |
| P | 4 | 40(105)/30 | 2/0 | 6/0 | 2/1 | 0/120 | - | 34250 | 2/48hrs | 1 | Remote-Control Interface, Rigger Adaptation, Special Machinery(Sprayer) | r3.176 |
| Cyberspace Designs Dalmation | 3 | 108/8 | 2/0 | 5/- | 2/1 | 3/80 | - | 15800 | 2/24hrs | .75 | Remote-Control Interface, Rigger Adaptation | sr2.312 |
| Eireann-Tir Prospero | 3 | 70/9 | 1/0 | 5/0 | 2/1 | 0/10 | - | 8125 | 2/24hrs | 1 | Remote-Control Interface, Rigger Adaptation | r3.176 |
| Lone Star Strato-9 Surv. Drone | 3 | 100/9 | 2/0 | 4/0 | 2/5 | 1/20 | - | 34500 | 8/8 days | 2 | ECM 2, External Fixed Hardpoint w/MMG(w/GasVent-III and 500 rds. ammo), Remote-Control Interface, Rigger Adaptation | r3.176 |
| MCT-Nissan Roto-Drone | 4 | 70/6 | 2/0 | 4/0 | 1/1 | 4/150 | - | 10500 | 2/24hrs | 1 | Remote-Control Interface, Rigger Adaptation | sr2.312,r3.176 |
| Aeroquip | 4 | 300/35 | 3/0 | 5/0 | 2/3 | 16/155 | - | 85000 | 4/4days | 1 | Remote-Control Interface, Rigger Adaptation | r3.177 |
| Ares Guardian Drone | 4 | 60/6 | 2/12 | 7/0 | 3/4 | 1/25 | - | 99000 | 11/11days | 2 | Remote-Control Interface, Rigger Adaptation, Remote Mini-turret(1 CF Ammo Bin) | r3.177 |
| Cyberspace Designs Dalmatian | 3 | 105/8 | 2/0 | 6/0 | 2/1 | 3/80 | - | 16000 | 2/24hrs | 1 | Remote-Control Interface, Rigger Adaptation | sr2.312,r3.177 |
| Cyberspace Designs Wolfhound | 3 | 210/12 | 2/0 | 6/0 | 2/1 | 3/80 | - | 60000 | 3/72hrs | 1 | Remote-Control Interface, Rigger Adaptation, Robotic Pilot, Adaptation Pool 2 | r3.177 |
| Generic Surv. Drone VTOL | 3 | 70/9 | 1/0 | 5/- | 2/1 | 0/10 | - | 6250 | 2/24hrs | .75 | Remote Control Interface, Rigger Adaptation,Lowlight & Thermographic Cam. | sr2.312 |
| Renraku Arachnoid Mini-drone | 3/3 | 2/- | -/0 | 12/0 | 1/1 | 0/0 | - | 12375 | 2/24hrs | 1 | Remote-Control Interface, Rigger Adaptation | r3.177 |
| Shiawase Kanmushi Crawler | 3/3 | 2/- | -/0 | 12/0 | 1/1 | 0/0 | - | 9350 | 2/24 hrs | 1.00 | Remote-Control Interface, Rigger Adaptation | r3.178 |
| Toyota MK-Guyver S | 4 | 10/- | 2/3 | 5/0 | 3/1 | 5/1025 | - | 95375 | 5/5days | 2 | Remote-Control Interface, Rigger Adaptation, Robotic Pilot, Adaptation Pool 2, 2 Mechanical Arms(STR 10), Autosoft Interpretation System, Autosoft: Demolitions 3 | r3.178 |
| LS Spectator Surv. Drone | 4/4 | 30/4 | 0/0 | 12/0 | 1/0 | -/0 | - | 67000 | 14/1 month | 2 | Remote-Control Interface, Rigger Adaptation, Micro-Recorder 6, micro-camcorder, universal receiver 4 | sta2.98 |

## Karma

Long anecdotes are removed; keep the advancement rules and the Karma Pool rules.

### Earning Karma (overview)
- Karma is typically awarded at the end of an adventure.
- The GM awards Karma for surviving, achieving objectives, and individual feats (roleplay, smart planning, etc.).

#### Awarding Karma (GM guidelines)
These guidelines split “team” awards (everyone) from “individual” awards (spotlight moments).

- Team awards (to each surviving member):
  - **Survival**: +1
  - **Success**: +1 per objective achieved (partial credit allowed)
  - **Threat**: +0 to +3 based on danger/opposition (GM discretion)
- Typical total per adventure: about **3–4** Karma per character. Very dangerous runs can reach **6–8**.
- Individual awards (usually 0–2 each, GM discretion): roleplaying, guts, smart planning, surprise solutions, humor/drama, and “right place—right time.”
- A single-adventure award over about **12** Karma should be extremely rare.

### Reputation (optional)
For a quick “how well known are you?” measure:
- Track **private rep** (total Karma earned) and **public rep** (Karma that became widely known; GM decides).
- To see if an NPC has heard of a character: `TN = (1000 – rep) / 50` for an Etiquette (or similar) test.
  - Use public rep for outsiders (cops/media) and private rep for shadow contacts.

### Good Karma vs Karma Pool
- **90%** of Karma earned becomes **Good Karma** (long-term advancement).
- **10%** (round up) goes into **Karma Pool** (short-term “butt-saving” dice).

### Improving Attributes (Good Karma)
- Increase an Attribute by 1 by paying Good Karma equal to the **new rating** (e.g., 5 → 6 costs 6).
- With GM permission, raising above racial maximum costs **double** the normal Good Karma.
- Karma cannot directly raise Reaction, Essence, or Magic (Reaction may change if Quickness/Intelligence change).

### Improving Skills (Good Karma)
- After paying, the skill increases by 1.
- General skills, Concentrations, and Specializations are improved separately.

#### Good Karma costs for skills
| Skill type | Cost |
| --- | --- |
| General skills | 2 × new rating |
| Concentrations | 1.5 × new rating |
| Specializations | 1 × new rating |
| Languages | 1 × new rating |

#### New skills
- New skills cost **1** Good Karma for the first rating point (then improve normally).
- Hermetic magicians need unrestricted access to a **sorcery library** with a rating at least as high as the Sorcery rating they wish to learn.

#### New Concentrations and Specializations
- New Concentrations are purchased based on the existing general skill rating.
  - Example: if you have Firearms 4, a new Pistols Concentration at 5 costs **1.5 × 5**.
- New Specializations are purchased based on the existing Concentration rating; if no Concentration exists, use the general skill.

### Karma Pool (how it works)
- One-tenth (round up) of all Karma earned goes into the character’s Karma Pool.
- Karma Pool refreshes each **encounter/scene**. If the pool hits 0, it’s unavailable until the next encounter.
- **Exception:** Karma Pool points spent to buy successes are permanently lost.

#### Re-roll failures
- Spend **1 Karma Pool** point to re-roll the dice that failed on a test.
- You can repeat this on the same test, but each additional re-roll costs **+1** more Karma Pool than the previous re-roll for that test.

#### Avoid an “Oops” (Rule of One)
- If all dice came up **1** (critical failure), spend **1 Karma Pool** point to turn it into a normal failure (no re-roll; can’t spend more on that failure).

#### Buy additional dice
- Spend **1 Karma Pool** point to add **+1 die** to a test.
- Maximum extra dice equals the number of base dice from the skill/attribute/rating being used (not counting Pool dice).

### Buying Successes
- You may buy extra successes at **1 Karma Pool** point per success, but only if you rolled at least 1 normal success first.
- Karma Pool dice spent this way are permanently lost (must be re-earned).

### Team Karma Pool
- A team can maintain a shared Team Karma Pool funded by permanent contributions from members’ Karma Pools.
- Team Karma refreshes each encounter/scene like personal Karma Pool.
  - Team Karma spent to buy successes is permanently lost (same as personal).
- Founding/joining:
  - When a team forms, each member contributes at least **1** point.
  - New members must also contribute at least **1** point on joining.
- Spending Team Karma generally requires a majority agreement of players present at the table (GM breaks ties).
- Leaving the team:
  - If someone leaves (or is kicked), remove **half** the current Team Karma Pool points from the pool.
  - The departing character does not take those points with them.
- Multiple teams:
  - A character can belong to multiple teams, but contributions are less efficient:
    - Effective Team Karma gained = `transferred points – (number of other teams the character belongs to)`.
    - Example: if you’re in two teams, it costs **2** personal Karma Pool points to add **1** Team Karma to either team.

## Reference Tables

### Common formulas
- **Reaction** = floor((Quickness + Intelligence) / 2)
- **Damage Code** = Power + Damage Level (L/M/S/D)

### Weapon ranges
| Category | Abbrev | Short | Medium | Long | Extreme |
| --- | --- | --- | --- | --- | --- |
| Assault Cannon | (ACan) | 100 | 300 | 900 | 2400 |
| Assault Rifle | (AmRf) | 100 | 300 | 900 | 2400 |
| Assault Rifle | (AsRf) | 50 | 150 | 350 | 550 |
| Ballista | (Blsta) | 100 | 500 | 3000 | 5000 |
| Blowgun | (BG) | 3 | 8 | 12 | 15 |
| Bow | (Bow) | 1 | 10 | 30 | 60 |
| Caltrops | (SS) | 3 | 5 | 10 | 20 |
| Carbine | (Carb) | 40 | 150 | 250 | 350 |
| Cigarete Micro-Rocket | (cig) | 5 | 15 | 30 | 50 |
| Flamethrower | (FlThr) | 10 | 20 | 50 | 100 |
| Great Dragon ATGM | (GATGM) | 350 | 750 | 1500 | 5000 |
| Grenade Launcher | (GrLn) | 50 | 100 | 150 | 300 |
| Gyrojet Pistol | (GJPist) | 10 | 20 | 50 | 100 |
| Heavy Crossbow | (HCB) | 5 | 15 | 40 | 60 |
| Heavy Machine Gun | (HMG) | 80 | 250 | 800 | 1500 |
| Heavy Pistol | (HPist) | 5 | 20 | 40 | 60 |
| Heavy Sniper Rifle | (HSR) | 150 | 350 | 900 | 1800 |
| Hold-out Pistols | (HOPist) | 5 | 15 | 30 | 50 |
| Light Carbine | (LCarb) | 20 | 50 | 100 | 200 |
| Light Crossbow | (LCB) | 2 | 8 | 20 | 40 |
| Light Hold-out | (LHOP) | 3 | 8 | 15 | 25 |
| Light Machine Gun | (LMG) | 75 | 200 | 400 | 800 |
| Light Pistol | (LPist) | 5 | 15 | 30 | 50 |
| Machine Pistol | (MaPist): | 5 | 15 | 30 | 50 |
| Medium Crossbow | (MCB) | 3 | 12 | 30 | 50 |
| Medium Machine Gun | (MMG) | 80 | 250 | 750 | 1200 |
| Medium Pistol | (MPist) | 5 | 20 | 40 | 60 |
| Mini Gun | (MinG) | 75 | 200 | 400 | 800 |
| Missile Launcher | (MisLn) | 150 | 450 | 1200 | 3000 |
| Mortar | (Mrtr) | 300 | 1000 | 4000 | 6000 |
| Netguns | (NtGn) | 10 | 20 | 50 | 100 |
| Nets | (Net) | 2 | 4 | 6 | 10 |
| Shotgun | (SMG) | 10 | 40 | 80 | 150 |
| Shotgun | (SMG) | 10 | 20 | 50 | 100 |
| Shuriken | (SH) | 1 | 2 | 5 | 7 |
| Sling Launcher | (SL) | 3 | 5 | 20 | 30 |
| Slingshot | (SS) | 1 | 25 | 5 | 7 |
| Sniper Rifle | (Snip) | 150 | 300 | 700 | 1000 |
| Sniper Rifle | (SptR) | 100 | 250 | 500 | 750 |
| Spear Gun | (SS) | 10 | 40 | 80 | 150 |
| Taser | (Tasr) | 5 | 10 | 12 | 15 |
| Thrown Knife | (TK) | 1 | 2 | 3 | 5 |
| Very Heavy Pistol | (VHP) | 10 | 20 | 40 | 60 |
| Vogeljager Man-Portable | (VJMP) | 200 | 600 | 2000 | 4000 |
