# Nagani Six Animal Production Asset Creation Plan

## Chapter 46 — Production Asset Creation Plan for Six Animal

Status: Planning-first
Current lock: Chapter 45.5 final Six Animal realism QA passed
Target route: `/six-animal`

---

## 1. Current Honest State

The Six Animal room is now a strong frontend prototype foundation.

Accepted current strengths:

* Mobile-first ၆ ကောင်ဂျင် room foundation
* Royal palace atmosphere shell
* Improved 3D table and tray foundation
* Improved dice material and readability foundation
* Higher default camera for dice top-face readability
* Royal betting sheet foundation
* Clear selected and locked animal states
* Improved MMK amount input and bet slip trust
* Royal result board foundation
* Improved settlement sheet
* Full betting round QA passed
* No-bet round QA passed
* Small mobile portrait stress QA passed
* Trust/source-of-truth QA passed
* Build passed

Honest weakness:

The room is not final production asset quality yet.
The biggest remaining gap is not logic. It is asset realism.

The current room still needs:

* Real dice animal face textures
* Final animal artwork
* Real-life inspired dice table and tray material direction
* Royal palace background asset direction
* Carved royal UI and card texture direction
* Safe asset folder paths
* Safe drop-in and replacement order

---

## 2. Non-Negotiable Direction Locks

This project is not a slot, reel, casino clone, or browser toy.

Do not use:

* Slot reels
* Buffalo clone thinking
* Cabinet/reel layouts
* Emoji final assets
* Cheap flat browser-game styling
* Gourd / ဘူး symbol
* Suspicious backend-forced dice results
* Suspicious after-stop dice correction
* Production backend target result display when physical dice mismatches
* Sound/audio work unless explicitly reopened later

Six Animal symbols are locked as:

1. Tiger
2. Dragon
3. Rooster
4. Fish
5. Crab
6. Elephant

The visible physical dice result remains the production source of truth.

---

## 3. Production Asset Goal

The final Six Animal room should feel like a premium Myanmar traditional royal game simulation.

Target feeling:

* Real-life inspired ဂလုန်းဂလုန်း table
* Royal palace room atmosphere
* Physical dice with readable animal faces
* Trustworthy betting sheet and result board
* Warm lacquer, gold, jade, wood, brass, velvet, shadow, and carved details
* Cultural, premium, serious, and alive
* Not cartoon
* Not emoji
* Not slot-machine style

---

## 4. Asset Groups Needed

### 4.1 Dice Animal Face Textures

Purpose:

Replace prototype dice faces with production-quality animal face textures.

Needed faces:

* Tiger
* Dragon
* Rooster
* Fish
* Crab
* Elephant

Requirements:

* Square texture
* Centered animal symbol
* Strong silhouette
* Readable on small mobile screen
* Works on 3D dice face
* Not too detailed to become blurry
* Premium traditional illustration style
* Consistent color grading across all six animals

Suggested folder:

```txt
public/assets/nagani/six-animal/dice/faces/
```

Suggested filenames:

```txt
dice-face-tiger-v1.png
dice-face-dragon-v1.png
dice-face-rooster-v1.png
dice-face-fish-v1.png
dice-face-crab-v1.png
dice-face-elephant-v1.png
```

---

### 4.2 Final Animal Card Art

Purpose:

Upgrade betting board animal cards from prototype-style cards to production animal cards.

Needed animals:

* Tiger
* Dragon
* Rooster
* Fish
* Crab
* Elephant

Requirements:

* Premium 2D or 2.5D animal art
* Consistent art direction
* Strong readable animal identity
* Myanmar traditional royal feeling
* Works inside compact mobile betting card
* Clear selected and locked states
* No emoji style
* No childish cartoon style

Suggested folder:

```txt
public/assets/nagani/six-animal/animals/
```

Suggested filenames:

```txt
six-animal-tiger-v1.png
six-animal-dragon-v1.png
six-animal-rooster-v1.png
six-animal-fish-v1.png
six-animal-crab-v1.png
six-animal-elephant-v1.png
```

---

### 4.3 Real-Life Inspired Table / Tray Asset Direction

Purpose:

Upgrade the current 3D table/tray from prototype geometry into a more believable real-life inspired ဂလုန်းဂလုန်း table.

Target table feeling:

* Wooden royal table
* Dice mounted above
* Drop gate / chute
* Lower rolling tray
* Physical receiving box
* Real shadow and material depth
* Not toy-like
* Not plastic
* Not over-decorated in a way that hides dice

Asset direction:

* Wood base
* Lacquer surface
* Brass or gold trim
* Slight worn real-life texture
* Tray floor with enough contrast for dice readability
* Raised tray borders, but not so high that dice result becomes hard to see

Suggested folder:

```txt
public/assets/nagani/six-animal/table/
```

Possible future asset names:

```txt
six-animal-table-material-reference-v1.png
six-animal-tray-floor-texture-v1.png
six-animal-wood-trim-texture-v1.png
six-animal-gold-edge-texture-v1.png
```

---

### 4.4 Royal Palace Background

Purpose:

Replace the current atmosphere shell with a stronger Myanmar royal palace interior direction.

Target background feeling:

* Myanmar royal palace room
* Warm cinematic lighting
* Dark lacquer and gold
* Subtle depth behind table
* Not too busy
* Does not distract from dice
* Mobile portrait safe
* The table remains the main focus

Suggested folder:

```txt
public/assets/nagani/six-animal/room/
```

Suggested filenames:

```txt
six-animal-palace-room-bg-v1.png
six-animal-palace-side-ornament-left-v1.png
six-animal-palace-side-ornament-right-v1.png
six-animal-table-spotlight-v1.png
```

---

### 4.5 Carved Royal UI / Card Textures

Purpose:

Upgrade betting sheet, result board, settlement sheet, and cards with consistent royal material.

Target UI feeling:

* Carved lacquer panel
* Gold edge trim
* Jade accent
* Warm shadow
* Premium readable mobile interface
* Trustworthy wallet/bet slip feeling
* Not noisy
* Not over-decorated

Suggested folder:

```txt
public/assets/nagani/six-animal/ui/
```

Suggested filenames:

```txt
royal-betting-sheet-panel-v1.png
royal-animal-card-frame-v1.png
royal-selected-card-frame-v1.png
royal-locked-card-frame-v1.png
royal-result-board-panel-v1.png
royal-settlement-sheet-panel-v1.png
```

---

## 5. Safe Asset Drop-In Order

Do not replace everything at once.

Recommended order:

### Phase 1 — Dice Face Texture Upgrade

Reason:

Dice result is the trust source of truth.
Readable dice faces matter most.

Files likely involved later:

```txt
src/components/games/six-animal/ThreeDicePhysicsStage.tsx
src/lib/naganiAssets.ts
```

Expected result:

The physical dice still roll the same way, but faces look more premium and readable.

---

### Phase 2 — Animal Card Art Upgrade

Reason:

The betting board is the main player action area.

Files likely involved later:

```txt
src/components/games/six-animal/SixAnimalBettingSheet.tsx
src/lib/naganiAssets.ts
```

Expected result:

The betting sheet feels more premium without changing game logic.

---

### Phase 3 — Room Background Upgrade

Reason:

The room atmosphere should become royal and cultural, but it must not disturb the dice/table layout.

Files likely involved later:

```txt
src/app/six-animal/page.tsx
src/lib/naganiAssets.ts
```

Expected result:

The game feels more like a Myanmar royal room, while dice and betting remain readable.

---

### Phase 4 — Table / Tray Material Upgrade

Reason:

This is visually important but risky because it can affect dice readability and physical trust.

Files likely involved later:

```txt
src/components/games/six-animal/ThreeDicePhysicsStage.tsx
```

Expected result:

The table feels less like a prototype 3D model and more like a real-life inspired dice table.

---

### Phase 5 — Royal UI Texture Upgrade

Reason:

UI polish should happen after dice, animals, room, and table direction are stable.

Files likely involved later:

```txt
src/components/games/six-animal/SixAnimalBettingSheet.tsx
src/app/six-animal/page.tsx
```

Expected result:

Betting sheet, result board, and settlement sheet feel like one premium royal system.

---

## 6. Asset QA Checklist

Each production asset must pass this checklist before wiring into code.

### Dice Face Texture QA

* Animal is readable on mobile
* Animal is readable while dice is small
* Animal is readable from top camera angle
* Texture does not look blurry
* Texture does not look like emoji
* All six faces feel like the same art family
* Dice result remains trustworthy

### Animal Card QA

* Animal identity is clear
* Burmese and English labels remain readable
* Selected state is obvious
* Locked state is obvious
* Card does not feel childish
* Card does not overpower the dice table

### Room Background QA

* Table remains the focus
* Dice remains readable
* Betting sheet remains readable
* Background does not feel like flat wallpaper
* Royal palace feeling is visible
* Mobile portrait remains safe

### Table / Tray QA

* Dice can still be seen clearly
* Dice top face is readable
* Tray does not hide dice
* Table does not feel like a toy
* Materials feel wood/lacquer/brass/gold, not plastic
* Camera does not need major retuning after replacement

### UI Texture QA

* MMK amount is readable
* Place Bet button remains strong
* Result board remains clear
* Settlement Bet / Return / Net remains clear
* UI feels premium but not noisy

---

## 7. Production Safety Rules

During Chapter 46:

* Planning and asset creation only
* Do not change round logic
* Do not change wallet logic
* Do not change backend target behavior
* Do not enable production target-result completion
* Do not reintroduce sound
* Do not touch Thirty Six unless explicitly chosen
* Do not redesign the whole `/six-animal` layout
* Do not break Chapter 45.5 QA lock

---

## 8. Chapter 46 Acceptance Criteria

Chapter 46 is complete enough when:

* Production asset groups are clearly defined
* Folder paths are locked
* Dice face texture plan is locked
* Animal card art direction is locked
* Palace background direction is locked
* Table/tray asset direction is locked
* Royal UI texture direction is locked
* Safe drop-in order is locked
* No production game logic was changed
* Build still passes

---

## 9. Next Step After This Document

Chapter 46.2 — Dice Animal Face Texture Direction

Focus:

Create or prepare the first six production dice face textures:

* Tiger
* Dragon
* Rooster
* Fish
* Crab
* Elephant

The dice face upgrade should happen before animal cards, room background, table materials, or UI textures because the visible physical dice result is the trust source of truth.

---

## 10. Chapter 46.2 — Dice Animal Face Texture Direction

Status: Passed
Priority: Highest asset priority
Reason: The physical dice result is the trust source of truth.

### 10.1 Goal

Create six production-quality dice face textures for the Six Animal dice.

The dice faces must make the visible physical dice result feel clear, trustworthy, and premium.

Required dice faces:

1. Tiger
2. Dragon
3. Rooster
4. Fish
5. Crab
6. Elephant

### 10.2 Dice Face Art Direction

The dice face textures should feel like premium Myanmar traditional icon art.

Target style:

* Carved royal emblem
* Lacquer and gold feeling
* Strong animal silhouette
* Clean readable center symbol
* Slight embossed depth
* High contrast against dice material
* Mobile-readable from top camera angle
* Consistent style across all six faces

Avoid:

* Emoji style
* Cartoon sticker style
* Overly realistic full-body animal painting
* Too much tiny detail
* Text-heavy face design
* Slot-machine icon style
* Bright toy colors
* Low-contrast gold-on-gold design

### 10.3 Texture Format Requirements

Recommended format:

* PNG
* Square image
* Transparent background preferred if used over dice material
* Minimum 1024×1024 for source asset
* Can be exported down later if needed
* Centered animal emblem
* Safe padding around animal symbol
* Same visual scale across all six animals

Recommended folder:

```txt
public/assets/nagani/six-animal/dice/faces/
```

Recommended filenames:

```txt
dice-face-tiger-v1.png
dice-face-dragon-v1.png
dice-face-rooster-v1.png
dice-face-fish-v1.png
dice-face-crab-v1.png
dice-face-elephant-v1.png
```

---

## 11. Chapter 46.4 — First Dice Face Asset Visual Review

Status: Passed with caution

Reviewed assets:

```txt
public/assets/nagani/six-animal/dice/faces/dice-face-tiger-v1.png
public/assets/nagani/six-animal/dice/faces/dice-face-dragon-v1.png
public/assets/nagani/six-animal/dice/faces/dice-face-rooster-v1.png
public/assets/nagani/six-animal/dice/faces/dice-face-fish-v1.png
public/assets/nagani/six-animal/dice/faces/dice-face-crab-v1.png
public/assets/nagani/six-animal/dice/faces/dice-face-elephant-v1.png
```

### 11.1 Visual Verdict

The first six dice face assets pass as a production art-family direction.

Strengths:

* Strong premium royal gold-carved style
* Consistent visual family
* Not emoji
* Not slot icon
* Not cheap browser-game style
* Clear cultural and premium direction
* Good source artwork quality

### 11.2 Caution

The assets are highly detailed and several are full-body compositions.

This may cause readability issues when mapped onto small 3D dice faces.

Caution assets:

* Dragon: beautiful, but may need head or emblem crop later
* Elephant: full-body detail may shrink; head or trunk crop may be better later
* Rooster: tall body shape may become small
* Tiger: full-body detail may shrink; head crop may be stronger later

Strong direct dice candidates:

* Crab
* Fish

### 11.3 Small-Size Dice Preview Result

Status: Passed enough

The dice face textures were tested inside the real `/six-animal` 3D dice flow.

Confirmed:

* Textures load from the correct folder
* Dice faces are visible on the physical dice
* Premium gold-carved direction works in the room
* No missing texture error
* The visual result is much stronger than prototype labels

Decision:

The assets are good enough to continue as the first production dice face texture set.

---

## 12. Chapter 46.5 — Dice Face Asset Registry Wiring / Path Cleanup

Status: Passed

### 12.1 What Changed

Dice face paths are now owned by the asset registry.

The asset registry now includes:

```txt
naganiAssets.sixAnimal.dice.faces.base
naganiAssets.sixAnimal.dice.faces.tiger
naganiAssets.sixAnimal.dice.faces.dragon
naganiAssets.sixAnimal.dice.faces.rooster
naganiAssets.sixAnimal.dice.faces.fish
naganiAssets.sixAnimal.dice.faces.crab
naganiAssets.sixAnimal.dice.faces.elephant
```

`ThreeDicePhysicsStage.tsx` now uses:

```txt
naganiAssets.sixAnimal.dice.faces.base
```

instead of a hardcoded dice face folder string.

### 12.2 Acceptance Result

Passed.

Confirmed visually:

* Betting phase works
* Bets closed phase works
* Rolling phase works
* Result phase works
* Production dice face textures stay visible
* No missing texture error
* Physical dice result logic unchanged
* Visible dice source-of-truth unchanged

---

## 13. Chapter 46.6 — Mounted Dice Display Variety / Readability Polish

Status: Passed

### 13.1 What Changed

Display-only mounted dice now show varied animal faces instead of all showing the same crab face.

This affects only waiting/display dice presentation.

It does not change:

* Physical dice result detection
* Rolling physics
* Settlement
* Backend trust rule
* Visible dice source-of-truth

### 13.2 Acceptance Result

Passed.

The idle, closed, rolling, and result views now feel more intentional and less repetitive.

---

## 14. Chapter 46.7 — Animal Card Asset Registry Wiring

Status: Passed

### 14.1 What Changed

Six Animal animal card assets are now registry-based.

The asset registry now owns all six animal image paths:

```txt
naganiAssets.sixAnimal.animals.tiger
naganiAssets.sixAnimal.animals.dragon
naganiAssets.sixAnimal.animals.rooster
naganiAssets.sixAnimal.animals.fish
naganiAssets.sixAnimal.animals.crab
naganiAssets.sixAnimal.animals.elephant
```

`gameRules.ts` now uses the asset registry for `SIX_ANIMAL_OPTIONS`.

`/six-animal/page.tsx` now builds `ANIMAL_ASSETS` from `naganiAssets` and passes it into `SixAnimalBettingSheet`.

### 14.2 Acceptance Result

Passed.

Confirmed visually:

* Betting cards still show all six animals
* Selected animal preview still works
* Locked active bet still works
* Floating result board still shows animal icons
* Settlement sheet still shows active bet animal
* No gameplay logic changed
* No dice logic changed
* Visible dice source-of-truth unchanged

---

## 15. Chapter 46.8 — Animal Card Visual Review / Production Card Art Direction Lock

Status: Passed enough for first production card family

### 15.1 Visual Verdict

The current Six Animal card art is accepted as the first production animal card art family.

Strengths:

* Premium gold royal style
* Consistent with dice face direction
* Not emoji
* Not slot icon
* Not cheap browser-game art
* Strong enough for mobile betting cards
* Looks better inside selected and locked states
* Works inside result board and settlement sheet

### 15.2 Current Accepted Animal Card Assets

```txt
public/assets/nagani/six-animal/animals/six-animal-tiger-sample-01.png
public/assets/nagani/six-animal/animals/six-animal-dragon-sample-01.png
public/assets/nagani/six-animal/animals/six-animal-rooster-sample-01.png
public/assets/nagani/six-animal/animals/six-animal-fish-sample-01.png
public/assets/nagani/six-animal/animals/six-animal-crab-sample-01.png
public/assets/nagani/six-animal/animals/six-animal-elephant-sample-01.png
```

### 15.3 Caution

These are accepted as first production card assets, but not final forever.

Future improvements may include:

* More consistent scale across all six animals
* Slightly stronger silhouettes for tiny result slots
* More royal frame integration
* Better cropping for compact mobile cards
* Final filename cleanup from `sample-01` to production `v1`

### 15.4 Decision

Do not redesign the betting sheet now.

The current card art and card layout are good enough to move forward.

Next asset priority:

Chapter 46.9 — Room Background / Palace Asset Direction

Reason:

The dice faces and animal cards are now much stronger.
The next biggest visual weakness is the room background and palace environment still feeling like CSS atmosphere instead of a real production palace room asset.

---

## 16. Chapter 46.9 — Room Background / Palace Asset Direction

Status: In progress
Priority: High
Reason: The dice faces and animal cards are now stronger, so the next biggest visual weakness is the palace room environment.

### 16.1 Goal

Create a production direction for the Six Animal royal palace room background.

The room background must make `/six-animal` feel less like a CSS prototype and more like a premium Myanmar traditional live table room.

The background should support the table, dice, betting sheet, result board, and settlement sheet without distracting from them.

### 16.2 Current Weakness

The current room atmosphere is acceptable as a prototype shell, but it still relies heavily on:

* CSS gradients
* Simple glow layers
* Simulated side columns
* Generic dark lacquer mood
* No real palace depth
* No true production background asset

It gives the correct mood, but not final production realism.

### 16.3 Target Palace Feeling

The final room should feel like:

* Myanmar royal palace interior
* Warm lacquer and gold
* Cinematic but readable
* Cultural and traditional
* Premium live table environment
* Focused around the dice table
* Deep background, not flat wallpaper
* Mobile portrait safe
* Not crowded
* Not distracting
* Not slot-machine casino background

### 16.4 Background Composition Requirements

The palace background should be designed for mobile portrait first.

Required composition:

* Dark upper palace wall area
* Warm central glow behind the dice table
* Subtle gold/lacquer ornamentation
* Left and right side depth or pillars
* Soft floor/table glow near the bottom
* Dark vignette around edges
* Clear center focus area
* No important details hidden behind betting sheet
* No important details hidden behind result board
* No busy patterns directly behind dice

The table and dice must remain the hero.

### 16.5 Asset Format Requirements

Recommended folder:

```txt
public/assets/nagani/six-animal/room/
```

Recommended first background asset:

```txt
six-animal-palace-room-bg-v1.png
```

Recommended optional layer assets:

```txt
six-animal-palace-side-ornament-left-v1.png
six-animal-palace-side-ornament-right-v1.png
six-animal-table-spotlight-v1.png
six-animal-palace-vignette-v1.png
```

Recommended format:

* PNG or WebP
* Portrait-safe source
* Minimum 1440×2560 source size
* Should crop safely to mobile portrait
* Dark enough for UI readability
* Center should not be too bright
* Side ornaments should not steal attention

### 16.6 Prompt Direction

Use this direction for the first palace room background generation:

```txt
Create a premium Myanmar royal palace interior background for a traditional Six Animal dice game room. Mobile portrait composition, dark lacquer wood, antique gold ornamentation, warm cinematic lighting, subtle palace pillars on left and right, deep room atmosphere, central empty focus area for a 3D dice table, soft golden glow behind the table, dark vignette edges, elegant cultural Myanmar traditional feeling, premium live table simulation, not casino slot machine, not cartoon, not emoji, not cluttered, no text, no people, no dice, no game UI.
```

### 16.7 Negative Prompt Direction

Avoid:

```txt
slot machine, casino reels, neon arcade, cartoon, emoji, cheap browser game, flat wallpaper, busy pattern, people, dealer, text, numbers, western casino, sci-fi, plastic, toy room, bright colorful background, cluttered objects, dice, animal icons, betting UI
```

### 16.8 Safe Implementation Rule

Do not wire the palace background immediately.

First:

1. Generate or prepare the palace background asset.
2. Place it in the planned folder.
3. Review it visually in isolation.
4. Check whether the center area is safe behind the 3D table.
5. Check whether the top area is safe behind the result board.
6. Check whether the bottom area is safe behind the settlement sheet.
7. Only then update `src/lib/naganiAssets.ts`.
8. Only after registry wiring, update `src/app/six-animal/page.tsx`.

### 16.9 Acceptance Checklist

The palace background direction is accepted only if:

* It feels Myanmar royal/traditional
* It does not look like a slot/casino/reel room
* It does not look like a cartoon background
* It has enough depth
* It keeps the dice table as the hero
* It does not hurt result board readability
* It does not hurt betting sheet readability
* It remains safe for mobile portrait
* It can be added without changing game logic

### 16.10 Decision

Chapter 46.9 locks the room background direction only.

No gameplay logic should change.

Next step after this:

Chapter 46.10 — Palace Room Asset Folder + First Background Asset Review

---

## 17. Chapter 46.10 — Palace Room Asset Folder + First Background Asset Review

Status: Passed

### 17.1 Asset Added

The first palace room background asset was added at:

```txt
public/assets/nagani/six-animal/room/six-animal-palace-room-bg-v1.jpg

## Chapter 68.2 — Custom Table / Dice Asset Folder and Registry Plan

Status: Passed and locked.

Purpose:

Chapter 68.2 defines the future folder and registry structure for custom Six Animal table and dice production assets before importing any GLB model or material maps.

This chapter is planning-only.

No custom model is imported yet.
No production table code is changed yet.
No dice physics is changed.
No backend/admin/wallet/security logic is touched.

Current asset inventory confirmed:

Existing Six Animal assets:

* `public/assets/nagani/six-animal/animals/six-animal-tiger-sample-01.png`
* `public/assets/nagani/six-animal/animals/six-animal-dragon-sample-01.png`
* `public/assets/nagani/six-animal/animals/six-animal-rooster-sample-01.png`
* `public/assets/nagani/six-animal/animals/six-animal-fish-sample-01.png`
* `public/assets/nagani/six-animal/animals/six-animal-crab-sample-01.png`
* `public/assets/nagani/six-animal/animals/six-animal-elephant-sample-01.png`

Existing dice face assets:

* `public/assets/nagani/six-animal/dice/faces/dice-face-tiger-v1.png`
* `public/assets/nagani/six-animal/dice/faces/dice-face-dragon-v1.png`
* `public/assets/nagani/six-animal/dice/faces/dice-face-rooster-v1.png`
* `public/assets/nagani/six-animal/dice/faces/dice-face-fish-v1.png`
* `public/assets/nagani/six-animal/dice/faces/dice-face-crab-v1.png`
* `public/assets/nagani/six-animal/dice/faces/dice-face-elephant-v1.png`

Existing room asset:

* `public/assets/nagani/six-animal/room/six-animal-palace-room-bg-v1.jpg`

Existing table reference asset:

* `public/assets/nagani/six-animal/table/six-animal-table-reference-01.png`

Current missing production assets:

* no custom table GLB model yet
* no custom table material maps yet
* no custom final dice GLB model yet
* no dice material maps yet
* no hybrid table integration yet

Future folder plan:

```txt
public/assets/nagani/six-animal/table-models/
public/assets/nagani/six-animal/table-textures/
public/assets/nagani/six-animal/dice-models/
public/assets/nagani/six-animal/dice-textures/
```

Future table model registry keys:

```ts
naganiAssets.sixAnimal.tableModels.royalTableV1
naganiAssets.sixAnimal.tableModels.placeholder
```

Future table texture registry keys:

```ts
naganiAssets.sixAnimal.tableTextures.feltV1
naganiAssets.sixAnimal.tableTextures.lacquerWoodV1
naganiAssets.sixAnimal.tableTextures.brassTrimV1
naganiAssets.sixAnimal.tableTextures.kanoteTrimV1
```

Future dice model registry keys:

```ts
naganiAssets.sixAnimal.diceModels.royalDiceV1
naganiAssets.sixAnimal.diceModels.placeholder
```

Future dice texture registry keys:

```ts
naganiAssets.sixAnimal.diceTextures.ivoryBodyV1
naganiAssets.sixAnimal.diceTextures.edgeWearV1
naganiAssets.sixAnimal.diceTextures.faceInkV1
```

Recommended future filenames:

```txt
public/assets/nagani/six-animal/table-models/six-animal-royal-table-v1.glb
public/assets/nagani/six-animal/table-models/six-animal-royal-table-placeholder.glb

public/assets/nagani/six-animal/table-textures/table-felt-v1.png
public/assets/nagani/six-animal/table-textures/table-lacquer-wood-v1.png
public/assets/nagani/six-animal/table-textures/table-brass-trim-v1.png
public/assets/nagani/six-animal/table-textures/table-kanote-trim-v1.png

public/assets/nagani/six-animal/dice-models/six-animal-royal-dice-v1.glb
public/assets/nagani/six-animal/dice-models/six-animal-royal-dice-placeholder.glb

public/assets/nagani/six-animal/dice-textures/dice-ivory-body-v1.png
public/assets/nagani/six-animal/dice-textures/dice-edge-wear-v1.png
public/assets/nagani/six-animal/dice-textures/dice-face-ink-v1.png
```

Important decision:

Do not wire these registry keys into runtime yet unless real files exist.

Reason:

Adding registry paths for missing GLB or texture files can create broken asset assumptions, 404s, or premature integration pressure.

Safe next action:

* create the folders when ready
* keep them empty or with `.gitkeep`
* document the registry plan first
* do not import GLB yet
* do not change `ThreeDicePhysicsStage.tsx` yet
* do not change `/six-animal` yet

Locked future integration rule:

Custom assets must enter through `/dev/three-dice` first.

First future custom table integration path:

1. Place GLB in `public/assets/nagani/six-animal/table-models/`.
2. Add registry key in `src/lib/naganiAssets.ts`.
3. Import/render only in `/dev/three-dice`.
4. Keep current invisible colliders.
5. Align custom visible model to current procedural table anatomy.
6. Test dice drop, roll, stop, rail collision, front lip collision, and top-face readability.
7. Only after lab pass, test `/six-animal`.
8. Keep procedural table fallback.

Locked rule:

The current procedural table remains the active stable prototype and collider reference. The future custom GLB table is visual-only first. It must not control dice physics, result detection, wallet logic, settlement logic, backend result authority, or admin security.

## Chapter 68.3 — Final Custom Table Artist Brief / Prompt Lock

Status: Passed and locked.

Purpose:

Chapter 68.3 locks the final custom table artist/model brief for the future Six Animal hybrid GLB table path.

This chapter is planning-only.

No model is imported.
No registry key is added.
No production code is changed.
No `/six-animal` runtime behavior is changed.
No dice physics is changed.
No backend/admin/wallet/security logic is touched.

Current final table direction:

The future final Six Animal table should use the hybrid path:

* visible table = custom GLB model
* dice physics = simple invisible colliders
* current procedural table = fallback / collider reference / dev testing reference

The custom GLB table should visually replace the procedural table later, but it must not control dice physics or game result logic.

### 68.3.1 Custom Table Asset Goal

Create a premium custom 3D model of a Myanmar traditional Six Animal dice table for ၆ ကောင်ဂျင် / ဂလုန်းဂလုန်း.

The table should feel like:

* real Myanmar traditional game equipment
* royal palace furniture
* dark red-black lacquer wood
* deep red felt / velvet dice rolling tray
* antique brass / old gold trim
* restrained carved ကနုတ် / Kanote detail
* heavy handcrafted physical object
* ceremonial and expensive
* trustworthy live dice table

The table must not feel like:

* plastic toy
* browser-game primitive model
* slot machine prop
* western casino table
* neon casino object
* cartoon object
* fantasy treasure box
* overloaded decoration
* UI panel or betting board

### 68.3.2 Required Table Anatomy

The model must include these physical parts:

1. Upper dice holder

* three dice resting positions
* believable wooden support
* dark lacquer or teak-inspired structure
* small brass/gold details
* visually explains where dice wait before dropping

2. Trapdoor / release flap area

* three separate flap positions
* believable mechanical release structure
* small hinge impressions
* should not look magical or fake

3. Backboard / chute wall

* vertical or slightly angled support wall
* frames the dice holder
* supports the royal furniture silhouette
* subtle carved Kanote panel
* not too busy behind mounted dice

4. Lower sloped tray

* main dice landing and rolling area
* deep red felt / velvet surface
* smooth and clean
* no busy ornament under dice
* enough contrast against ivory dice

5. Side rails

* left and right raised tray boundaries
* dark lacquer wood
* antique brass / old gold edge highlight
* must not block mobile camera readability

6. Front lip

* strong foreground table edge
* heavier lacquer wood
* restrained Kanote trim
* must not hide stopped dice top faces

### 68.3.3 Material Requirements

The model should have separated material slots where possible:

* `dark_lacquer_wood`
* `deep_red_felt_tray`
* `antique_brass_trim`
* `trapdoor_dark_wood`
* `kanote_carved_gold`
* `inner_shadow_dark`

Material direction:

* dark red-black lacquer wood
* soft deep red felt / velvet tray
* warm old gold / antique brass trim
* subtle worn edges
* restrained handcrafted detail
* warm palace lighting response
* not mirror-glossy
* not neon gold
* not flat untextured plastic

### 68.3.4 Kanote / Myanmar Ornament Rules

Kanote should feel carved or embossed into the furniture.

Allowed placement:

* front lip trim
* side rail outer trim
* backboard panel
* upper holder accent
* table corners

Forbidden placement:

* main dice landing surface
* center tray floor
* directly under stopped dice
* high-contrast area behind animal dice faces
* anything that competes with top-face readability

Rule:

Kanote must support the table, not compete with the dice.

Gameplay readability comes before ornament beauty.

### 68.3.5 Scale / Export Requirements

The model should be prepared for later alignment with the current procedural table and invisible colliders.

Requirements:

* GLB format
* centered origin
* applied transforms
* clean scale
* mobile-game optimized geometry
* clean UVs
* separated named meshes
* no extra cameras
* no extra lights
* no dice included
* no UI included
* no betting board included
* no palace background included
* no result display included

Suggested mesh names:

* `table_body_lacquer`
* `tray_felt_surface`
* `front_lip_lacquer`
* `side_rail_left`
* `side_rail_right`
* `backboard_lacquer`
* `dice_holder`
* `trapdoor_flap_left`
* `trapdoor_flap_center`
* `trapdoor_flap_right`
* `kanote_front_trim`
* `kanote_side_trim_left`
* `kanote_side_trim_right`
* `brass_accents`

### 68.3.6 Final Artist / Model Brief

Use this brief for a 3D artist, Blender modeling, or AI-assisted model planning:

Create a premium 3D GLB model of a Myanmar traditional Six Animal dice table, used for ၆ ကောင်ဂျင် / ဂလုန်းဂလုန်း. The table should feel like expensive royal palace furniture: dark red-black lacquer wood, deep red felt or velvet dice rolling tray, antique brass / old gold trims, restrained carved Myanmar Kanote ornament. The table has an upper dice holder with three dice positions, three small trapdoor release flaps, a backboard/chute wall, a lower sloped dice rolling tray, side rails, and a front lip. The rolling tray must stay clean and smooth with no busy ornament under the dice. Kanote ornament should appear only on the front lip, side rail outer trim, backboard, and holder accents. The model should feel handcrafted, heavy, ceremonial, realistic, and trustworthy. It must not feel toy-like, cartoon, slot-machine, western casino, neon, plastic, or fantasy. Make separate material slots for dark lacquer wood, deep red felt, antique brass, trapdoor wood, and Kanote trim. No dice, no UI, no betting board, no result display, no people, no background room. Mobile-game optimized, clean UVs, centered origin, applied transforms, separated named meshes, exported as GLB.

### 68.3.7 Concept Image Prompt

Use this for a concept image reference before 3D modeling:

Premium Myanmar traditional Six Animal dice table, royal palace furniture style, dark red-black lacquer wood, deep red velvet dice tray, antique brass trim, restrained carved Myanmar Kanote ornaments, upper three-dice holder with release flaps, vertical backboard, lower sloped rolling tray, raised side rails and front lip, handcrafted ceremonial game equipment, realistic 3D product render, mobile game asset reference, clean dice rolling surface, no dice, no people, no UI, no betting board, no casino slot machine, no cartoon, no neon, no text.

### 68.3.8 Negative Prompt

Avoid:

slot machine, casino reels, western casino table, roulette, poker table, neon arcade, cartoon, emoji, toy, plastic, fantasy treasure chest, sci-fi, cluttered ornament, busy tray pattern, dice included, people, dealer, betting UI, text, numbers, flat browser game asset, cheap mobile game prop, bright neon gold, mirror metal, low quality geometry.

### 68.3.9 Future Integration Reminder

When a real table GLB exists:

1. Place it in `public/assets/nagani/six-animal/table-models/`.
2. Add the registry key only after the real file exists.
3. Import/render it in `/dev/three-dice` first.
4. Keep current invisible colliders.
5. Align model to current table anatomy.
6. Test dice landing, side rail collision, front lip collision, and top-face readability.
7. Only after lab pass, test `/six-animal`.
8. Keep procedural table fallback until GLB is fully accepted.

Locked rule:

The future custom table is visual-only first. It must not control dice physics, result detection, backend result authority, wallet logic, settlement logic, admin security, or live room timing.

## Chapter 68.4 — Final Dice Asset Direction / GLB or Material Map Decision

Status: Passed and locked.

Purpose:

Chapter 68.4 decides the future final dice asset direction before creating or importing any custom dice model or material maps.

This chapter is planning-only.

No dice model is imported.
No dice registry key is added.
No dice texture registry key is added.
No dice physics is changed.
No production result detection is changed.
No backend/admin/wallet/security logic is touched.
No `/six-animal` runtime behavior is changed.

Current accepted dice baseline:

* current active production dice uses procedural rounded cube geometry
* current production dice candidate is More Round + Softer
* dice body uses warm ivory / aged resin first-pass material
* six animal face textures are wired and visible
* mounted dice display variety is fixed
* dice top-face readability is acceptable enough for current prototype
* visible physical dice / backend result timeline remains protected
* production target correction remains off
* no suspicious after-stop snapping is allowed

Current weakness:

The current dice are strong enough for the active prototype, but they are not final production asset quality.

They can still feel like:

* procedural 3D dice
* painted material
* flat animal face print
* generated object instead of handcrafted traditional dice
* not fully aged ivory / bone / resin physical object

### 68.4.1 Final Dice Quality Goal

Final Six Animal dice should feel like premium physical traditional game dice.

Target feeling:

* warm aged ivory
* bone / resin / antique game-piece material
* slightly worn but clean
* handcrafted object
* softly polished
* heavy and believable
* readable animal face print
* animal face feels embedded, inked, engraved, or burned into the surface
* premium Myanmar traditional game equipment

The dice must not feel like:

* plastic toy cube
* emoji dice
* red casino cube
* slot-machine icon cube
* cheap glossy mobile-game prop
* unreadable antique object
* overly dirty old dice
* suspicious forced-result object

### 68.4.2 Dice Trust Rule

The dice are the most important trust object in Six Animal.

The player must believe:

“The result came from the physical dice I watched.”

Rules:

* top face must remain readable
* dice must not visibly rotate after stopping
* no invisible hand correction
* no direct forced snapping
* no backend target-result display if visible dice mismatches
* no fake result card replacing dice truth
* result board may summarize only after dice/result timeline is trusted
* beauty must never reduce readability

Trust priority:

1. visible physical result
2. readable top face
3. natural roll
4. no suspicious correction
5. premium material beauty

### 68.4.3 Option A — Keep Procedural Dice + Better Material Maps

Description:

Keep the current procedural RoundedBox dice geometry and collider system, but improve the visual surface using better material maps and face texture treatment.

Possible future assets:

* ivory body texture map
* subtle edge wear map
* roughness map
* normal map
* face ink / engraving treatment
* improved simplified animal emblem faces

Future folder:

```txt
public/assets/nagani/six-animal/dice-textures/
```

Possible filenames:

```txt
dice-ivory-body-v1.png
dice-edge-wear-v1.png
dice-face-ink-v1.png
```

Pros:

* lowest risk
* keeps current dice physics stable
* keeps current result detection stable
* easier to tune
* easier to preserve mobile readability
* no GLB alignment risk
* best short-term upgrade path

Cons:

* still may feel procedural
* cannot achieve full custom sculpted dice quality
* rounded cube silhouette remains code-generated
* animal faces may still feel like surface planes unless carefully treated

Best use:

* near-term production polish
* current prototype improvement
* safer visual upgrade before full custom dice model

### 68.4.4 Option B — Custom Dice GLB

Description:

Create a custom GLB dice model with proper UVs, rounded handcrafted shape, aged ivory material, subtle edge wear, and embedded animal face texture areas.

Future folder:

```txt
public/assets/nagani/six-animal/dice-models/
```

Possible filename:

```txt
six-animal-royal-dice-v1.glb
```

Pros:

* best final visual quality
* can have custom handmade shape
* can support better UV material detail
* can make animal face feel truly embedded
* can look less procedural and more physical

Cons:

* higher risk
* must match current collider behavior
* can affect perceived roll trust if visual/collider mismatch
* needs careful face orientation mapping
* needs careful top-face readability testing
* may require more asset production time
* wrong model scale/origin can break camera/readability

Best use:

* final production asset path after material-map lessons
* later custom asset branch
* only after dev lab import plan is ready

### 68.4.5 Recommended Final Dice Path

Decision:

Use a phased hybrid dice path.

Short-term direction:

* keep current procedural dice active
* improve through material maps and face texture treatment later
* do not import custom dice GLB yet

Long-term direction:

* visible dice may become custom GLB later
* physics should stay controlled by stable simple collider
* current procedural dice remains fallback and physics reference

Recommended path:

1. Keep current More Round + Softer procedural dice active.
2. Prepare final dice texture/material-map requirements.
3. Improve dice material maps first if suitable assets are created.
4. Only consider custom dice GLB after table GLB planning/import path is stable.
5. Import any custom dice GLB into `/dev/three-dice` first.
6. Keep stable simple collider and result detection protected.
7. Only after lab pass, test `/six-animal`.

### 68.4.6 Final Dice Asset Requirements

Future final dice asset work should support:

* warm aged ivory material
* subtle roughness variation
* soft worn edge detail
* clean face print areas
* animal faces readable at mobile size
* consistent animal face scale
* embedded/inked/engraved print feeling
* no busy texture that hides animal identity
* no red body as main dice body
* no mirror gloss
* no plastic toy look

Animal face improvements may include:

* simplified emblem versions
* stronger silhouettes
* darker antique ink treatment
* better center alignment
* less full-body tiny detail
* consistent padding across all six faces

Locked animal set:

* Tiger
* Dragon
* Rooster
* Fish
* Crab
* Elephant

No Gourd.

### 68.4.7 Future Dice GLB Requirements

If custom dice GLB is created later, it must follow these rules:

* one dice model only
* no animation baked into model
* clean centered origin
* applied transforms
* correct scale matching current dice size
* clean UVs
* material slots separated if useful
* six face areas clearly mapped
* no extra cameras
* no extra lights
* mobile-safe geometry
* must work with current simple collider or a tested lab collider
* must preserve top-face readability

Suggested future mesh/material names:

```txt
dice_body_ivory
dice_face_tiger
dice_face_dragon
dice_face_rooster
dice_face_fish
dice_face_crab
dice_face_elephant
dice_edge_wear
```

### 68.4.8 What Must Not Change Yet

Do not change yet:

* `ThreeDicePhysicsStage.tsx`
* `ThreeDiceSequenceController.tsx`
* `/six-animal/page.tsx`
* dice collider
* dice physics values
* result detection threshold
* face orientation mapping
* backend result timeline
* settlement logic
* wallet logic
* admin security
* live room timing

Do not add registry keys for missing files yet.

Reason:

Missing GLB or texture registry paths can create false assumptions, 404s, and premature integration pressure.

### 68.4.9 Future Dice Integration Rule

When final dice assets exist later:

1. Place texture maps in `public/assets/nagani/six-animal/dice-textures/` or GLB in `public/assets/nagani/six-animal/dice-models/`.
2. Add registry keys only after real files exist.
3. Test in `/dev/three-dice` first.
4. Compare against current procedural dice fallback.
5. Confirm dice face mapping.
6. Confirm top-face readability.
7. Confirm no floating/clipping/collider mismatch.
8. Confirm no suspicious correction.
9. Only after lab pass, test `/six-animal`.
10. Keep current procedural dice fallback until final dice is fully accepted.

Locked decision:

The current procedural More Round + Softer dice remain the active stable production prototype. The next dice asset upgrade should be material-map and face-treatment planning first. Custom dice GLB is allowed later, but only through `/dev/three-dice` and only with stable collider/result trust preserved.

## Chapter 68.5 — Dev Lab Import Plan

Status: Passed and locked.

Purpose:

Chapter 68.5 defines the safe import plan for future custom Six Animal table and dice assets.

This chapter is planning-only.

No GLB is imported.
No registry key is added.
No custom model runtime code is added.
No `/six-animal` production behavior is changed.
No dice physics is changed.
No backend/admin/wallet/security logic is touched.

The goal is to make sure future custom assets enter the project safely through `/dev/three-dice` first, not directly into the real player room.

### 68.5.1 Core Import Rule

All future custom table and dice assets must be tested in the dev lab first.

Allowed first route:

* `/dev/three-dice`

Forbidden first route:

* `/six-animal`

Reason:

The production Six Animal room already has working backend round flow, betting, wallet debit, result timeline, settlement, and admin safety. A custom asset import can break visual alignment, dice readability, mobile performance, or physics trust if added directly to production.

### 68.5.2 Current Stable Production Baseline

Current production baseline remains:

* active table: improved procedural 3D table
* future final table direction: hybrid custom GLB visible table + invisible colliders
* production dice candidate: More Round + Softer
* dice body: warm ivory / aged resin first pass
* dice faces: production v1 animal textures
* palace room background: active
* game remains muted
* backend remains the dealer
* browser does not control round timing/result/wallet/settlement
* visible dice / backend result timeline remains protected

This baseline must stay available as fallback.

### 68.5.3 Future Table GLB Import Path

When a real custom table GLB exists:

1. Place the file in:

```txt
public/assets/nagani/six-animal/table-models/
```

2. Recommended filename:

```txt
six-animal-royal-table-v1.glb
```

3. Add registry key only after the real file exists:

```ts
naganiAssets.sixAnimal.tableModels.royalTableV1
```

4. Render only in `/dev/three-dice` first.

5. Keep current invisible colliders active.

6. Keep current procedural table available as fallback.

7. Align the visible GLB table to the current procedural table anatomy.

8. Test:

* dice holder position
* trapdoor/drop path
* tray floor alignment
* side rail collision visual alignment
* front lip collision visual alignment
* stumble bar visual/collider alignment
* stopped top-face readability
* mobile camera readability
* performance

9. Only after `/dev/three-dice` pass, test `/six-animal`.

10. Do not delete the procedural table until the custom table is fully accepted.

### 68.5.4 Future Dice Texture Import Path

When final dice texture/material maps exist:

1. Place files in:

```txt
public/assets/nagani/six-animal/dice-textures/
```

2. Possible filenames:

```txt
dice-ivory-body-v1.png
dice-edge-wear-v1.png
dice-face-ink-v1.png
```

3. Add registry keys only after real files exist:

```ts
naganiAssets.sixAnimal.diceTextures.ivoryBodyV1
naganiAssets.sixAnimal.diceTextures.edgeWearV1
naganiAssets.sixAnimal.diceTextures.faceInkV1
```

4. Test in `/dev/three-dice` first.

5. Confirm:

* animal faces remain readable
* dice body does not become too glossy
* dice does not look plastic
* texture does not hide top-face result
* mobile portrait view remains safe
* result trust remains clear

6. Only after dev lab pass, test `/six-animal`.

### 68.5.5 Future Dice GLB Import Path

Custom dice GLB is allowed later, but not first.

When a real custom dice GLB exists:

1. Place file in:

```txt
public/assets/nagani/six-animal/dice-models/
```

2. Recommended filename:

```txt
six-animal-royal-dice-v1.glb
```

3. Add registry key only after the real file exists:

```ts
naganiAssets.sixAnimal.diceModels.royalDiceV1
```

4. Render only in `/dev/three-dice` first.

5. Keep current simple collider unless a lab-tested collider is approved.

6. Confirm:

* model scale matches current dice
* origin is centered
* transforms are clean
* face orientation mapping is correct
* Tiger, Dragon, Rooster, Fish, Crab, Elephant faces are mapped correctly
* top face remains readable
* dice does not float
* dice does not clip
* dice roll still feels natural
* no suspicious correction is introduced

7. Only after lab pass, test `/six-animal`.

8. Keep current procedural dice fallback until final dice model is fully accepted.

### 68.5.6 Feature Flag Rule

Future custom asset integration should use explicit feature flags.

Recommended future flags:

```ts
USE_CUSTOM_TABLE_MODEL_IN_LAB = false;
USE_CUSTOM_TABLE_MODEL_IN_ROOM = false;
USE_CUSTOM_DICE_TEXTURES_IN_LAB = false;
USE_CUSTOM_DICE_TEXTURES_IN_ROOM = false;
USE_CUSTOM_DICE_MODEL_IN_LAB = false;
USE_CUSTOM_DICE_MODEL_IN_ROOM = false;
```

Initial rule:

* lab flags can be tested first
* room flags must remain false until lab QA passes
* production `/six-animal` must not accidentally use missing or unapproved assets

Do not add these flags until there is a real asset or code chapter requiring them.

### 68.5.7 Registry Safety Rule

Do not add registry keys for missing files.

Reason:

Missing registry paths can cause:

* 404s
* false assumptions
* premature runtime imports
* broken builds or broken user trust
* confusion about whether the asset is actually ready

Registry keys should be added only after the file exists in the correct folder.

### 68.5.8 Dev Lab QA Checklist For Custom Table

A custom table GLB passes dev lab only if:

* model loads without error
* no missing texture warnings
* scale feels correct
* dice lands on visible floor naturally
* dice does not float
* dice does not clip through rails or lip
* side rail collision looks believable
* front lip collision looks believable
* stumble bar collision does not look like empty-air bounce
* top face remains readable after stop
* mounted dice remain visible
* mobile camera remains safe
* performance remains acceptable
* procedural fallback still works

### 68.5.9 Dev Lab QA Checklist For Custom Dice

A custom dice texture or GLB passes dev lab only if:

* animal faces are readable
* top face is readable after settle
* all six animals are mapped correctly
* dice material does not look like cheap plastic
* dice does not look too dirty or unreadable
* dice does not float or clip
* dice roll still feels natural
* result detection/trust remains safe
* no after-stop correction is introduced
* current procedural dice fallback still works

### 68.5.10 Production Promotion Rule

A custom table or dice asset can move from `/dev/three-dice` to `/six-animal` only after:

* dev lab import passes
* visual alignment passes
* mobile readability passes
* dice result trust passes
* fallback remains available
* build passes
* Gary accepts screenshot/QA
* no backend/admin/wallet/security behavior is touched

Production promotion must be a separate chapter.

Do not combine:

* asset import
* production promotion
* physics tuning
* backend changes
* UI redesign

Each must remain separate to avoid breaking the stable room.

### 68.5.11 Rollback Rule

If a custom asset fails:

* keep current procedural table/dice
* disable lab feature flag
* do not push asset to `/six-animal`
* revise model scale/origin/materials
* test again in `/dev/three-dice`

Current procedural table and dice remain the safety fallback.

### 68.5.12 Locked Decision

Chapter 68.5 locks the future import process:

* custom assets enter through `/dev/three-dice` first
* registry keys are added only after real files exist
* `/six-animal` production room is not touched until lab pass
* invisible colliders remain the physics authority for the future hybrid table
* current procedural table and dice remain active prototype and fallback
* backend/admin/wallet/security foundation remains untouched


## Chapter 68.6 — Custom Asset Branch Lock

Status: Passed and locked.

Purpose:

Chapter 68.6 closes the Custom Table / Dice Asset Production Preparation branch.

This chapter locks the preparation work before any real custom GLB table, custom dice GLB, or final dice material map is created/imported.

This chapter is planning-only.

No custom GLB is imported.
No registry key for missing files is added.
No runtime asset code is changed.
No `/six-animal` production behavior is changed.
No dice physics is changed.
No backend/admin/wallet/security logic is touched.

### 68.6.1 Completed Chapter 68 Scope

Chapter 68 completed:

* Chapter 68.1 — Current Asset Inventory Audit
* Chapter 68.2 — Custom Table / Dice Asset Folder and Registry Plan
* Chapter 68.3 — Final Custom Table Artist Brief / Prompt Lock
* Chapter 68.4 — Final Dice Asset Direction / GLB or Material Map Decision
* Chapter 68.5 — Dev Lab Import Plan
* Chapter 68.6 — Custom Asset Branch Lock

### 68.6.2 Current Asset Inventory Lock

Existing Six Animal production assets:

* six animal card assets for Tiger, Dragon, Rooster, Fish, Crab, Elephant
* dice face assets for Tiger, Dragon, Rooster, Fish, Crab, Elephant
* palace room background v1
* old table reference PNG
* shared Nagani logo/background/panel assets

Missing future production assets:

* no custom table GLB yet
* no table material maps yet
* no custom final dice GLB yet
* no final dice material maps yet
* no hybrid GLB table integration yet

### 68.6.3 Future Folder Plan Lock

Future custom asset folders are planned as:

```txt
public/assets/nagani/six-animal/table-models/
public/assets/nagani/six-animal/table-textures/
public/assets/nagani/six-animal/dice-models/
public/assets/nagani/six-animal/dice-textures/
```

These folders may be created later when real assets are ready.

Do not add runtime registry keys until real files exist.

### 68.6.4 Future Registry Plan Lock

Future registry keys are planned but not added yet.

Future table model keys:

```ts
naganiAssets.sixAnimal.tableModels.royalTableV1
naganiAssets.sixAnimal.tableModels.placeholder
```

Future table texture keys:

```ts
naganiAssets.sixAnimal.tableTextures.feltV1
naganiAssets.sixAnimal.tableTextures.lacquerWoodV1
naganiAssets.sixAnimal.tableTextures.brassTrimV1
naganiAssets.sixAnimal.tableTextures.kanoteTrimV1
```

Future dice model keys:

```ts
naganiAssets.sixAnimal.diceModels.royalDiceV1
naganiAssets.sixAnimal.diceModels.placeholder
```

Future dice texture keys:

```ts
naganiAssets.sixAnimal.diceTextures.ivoryBodyV1
naganiAssets.sixAnimal.diceTextures.edgeWearV1
naganiAssets.sixAnimal.diceTextures.faceInkV1
```

Locked rule:

Do not add these keys until the real matching files exist.

### 68.6.5 Custom Table Direction Lock

Future final table direction:

* visible table = custom GLB model
* dice physics = simple invisible colliders
* current procedural table = fallback / collider reference / dev testing reference

The future custom table must feel like:

* Myanmar traditional ၆ ကောင်ဂျင် / ဂလုန်းဂလုန်း equipment
* royal palace furniture
* dark red-black lacquer wood
* deep red felt / velvet tray
* antique brass / old gold trim
* restrained carved Myanmar Kanote detail
* heavy handcrafted physical object
* ceremonial and trustworthy

It must not feel like:

* toy
* western casino prop
* slot machine object
* neon arcade object
* cartoon
* plastic model
* fantasy treasure box
* betting UI panel

### 68.6.6 Final Dice Direction Lock

Current active dice remains:

* procedural More Round + Softer dice
* warm ivory / aged resin first-pass material
* production v1 animal face textures
* current stable collider/result trust baseline

Future dice direction:

Short-term:

* keep procedural dice active
* improve with material maps and face-treatment later if real assets are ready

Long-term:

* custom dice GLB is allowed later
* custom dice GLB must enter through `/dev/three-dice` first
* stable simple collider and top-face readability must remain protected
* procedural dice remains fallback until custom dice is fully accepted

Dice trust priority remains:

1. visible physical result
2. readable top face
3. natural roll
4. no suspicious correction
5. premium material beauty

### 68.6.7 Dev Lab Import Rule Lock

All future custom assets must enter through:

```txt
/dev/three-dice
```

Not directly through:

```txt
/six-animal
```

Reason:

The production room is already stable. Custom asset import can break scale, alignment, camera readability, mobile performance, dice trust, or result clarity if rushed directly into production.

### 68.6.8 Production Promotion Rule Lock

A custom table or dice asset can move from `/dev/three-dice` to `/six-animal` only after:

* real asset file exists
* registry key is added safely
* dev lab import passes
* model/texture loads without missing asset warnings
* visual scale is correct
* dice readability passes
* mobile portrait readability passes
* dice result trust passes
* fallback remains available
* build passes
* Gary accepts screenshot/QA

Production promotion must be its own separate chapter.

Do not combine asset import, production promotion, physics tuning, backend changes, and UI redesign in one step.

### 68.6.9 What Must Stay Untouched

Future custom asset work must not touch:

* backend authority
* wallet logic
* settlement logic
* admin security
* RPC grants
* RLS policies
* live room timing
* backend result source
* betting flow
* result trust rule
* Six Animal symbol set
* muted project direction
* player browser authority rule

Backend remains the dealer.

The player browser only joins, watches, and submits valid bets.

### 68.6.10 Locked Current Stable Baseline

Current stable baseline remains:

* `/six-animal` is the main MVP room
* improved procedural 3D table remains active
* More Round + Softer dice remains active
* palace background remains active
* dice faces and animal cards remain v1 accepted
* game remains muted
* backend/admin safety is locked
* admin monitor pages remain read-only
* custom GLB table/dice assets are not yet imported

### 68.6.11 Next Recommended Branch

Next recommended branch:

## Chapter 69 — Custom Table Concept / Asset Creation Start

Goal:

Create or prepare the first real custom table concept/reference before any GLB import.

Recommended sequence:

* Chapter 69.1 — Custom Table Concept Prompt Final Review
* Chapter 69.2 — Generate / Source First Table Concept Image
* Chapter 69.3 — Table Concept Visual QA
* Chapter 69.4 — Decide: Concept Good Enough For 3D Model Brief or Revise
* Chapter 69.5 — Asset Creation Branch Lock

Decision:

Final production realism now needs real asset creation, not more procedural code polishing.

The current procedural table and dice remain the active stable prototype until real custom assets exist and pass dev lab QA.

## Chapter 69.1 — Custom Table Concept Prompt Final Review

Status: Passed and locked.

Purpose:

Chapter 69 starts the first real custom table concept / asset creation branch for the future Six Animal hybrid GLB table path.

This chapter locks the final concept-image prompt before generating or sourcing the first custom table concept image.

This chapter is planning-only.

No image is added yet.
No GLB is imported.
No registry key is added.
No `/dev/three-dice` code is changed.
No `/six-animal` production code is changed.
No dice physics is changed.
No backend/admin/wallet/security logic is touched.

Current stable baseline remains:

* `/six-animal` is the main MVP room.
* Improved procedural 3D table remains active.
* More Round + Softer dice remains active.
* Palace background remains active.
* Dice faces and animal cards remain v1 accepted.
* Backend/admin safety remains locked.
* Current procedural table remains fallback and collider reference.
* Future custom table must enter through `/dev/three-dice` first.

### 69.1.1 Concept Goal

Create the first visual concept reference for the future custom Six Animal table.

The concept should guide future:

* 3D artist handoff
* Blender modeling
* GLB model creation
* material direction
* Kanote ornament placement
* table silhouette
* mobile-game asset quality review

The concept image is not the final in-game asset.

It is a visual reference for the future custom GLB table.

### 69.1.2 Required Table Feeling

The table concept should feel like:

* real Myanmar traditional ၆ ကောင်ဂျင် / ဂလုန်းဂလုန်း equipment
* royal palace furniture
* dark red-black lacquer wood
* deep red felt / velvet dice tray
* antique brass / old gold trim
* restrained carved Myanmar ကနုတ် / Kanote ornament
* heavy handcrafted object
* ceremonial
* expensive
* trustworthy
* physical and realistic

The table must not feel like:

* slot machine
* western casino table
* roulette / poker table
* cartoon game object
* toy
* plastic prop
* fantasy treasure chest
* neon arcade object
* betting UI panel
* browser-game primitive model

### 69.1.3 Required Anatomy In Concept

The concept must clearly show:

1. Upper dice holder

* three dice resting positions
* believable wooden structure
* brass/gold details
* feels like a real release mechanism

2. Trapdoor / flap release area

* three separate flap positions
* small hinge/mechanism feeling
* not magical
* not fake spawn point

3. Backboard / chute wall

* supports dice holder
* gives table height
* dark lacquer panel
* subtle Kanote detail

4. Lower sloped rolling tray

* clean deep red felt / velvet surface
* main dice landing area
* no busy ornament under dice
* enough contrast for ivory dice

5. Side rails

* raised left/right boundaries
* dark lacquer wood
* antique brass edge
* do not block player view

6. Front lip

* strong foreground table edge
* heavier lacquer wood
* restrained Kanote trim
* must not hide dice top faces later

### 69.1.4 Concept Image Prompt

Use this prompt for the first table concept image:

Premium Myanmar traditional Six Animal dice table for ၆ ကောင်ဂျင် / ဂလုန်းဂလုန်း, royal palace furniture style, dark red-black lacquer wood, deep red velvet dice rolling tray, antique brass and old gold trim, restrained carved Myanmar Kanote ornaments, upper three-dice holder with three release flap positions, vertical backboard and chute wall, lower sloped dice rolling tray, raised side rails and strong front lip, handcrafted ceremonial game equipment, realistic 3D product render, mobile game asset reference, clean dice rolling surface, heavy physical table, expensive traditional object, warm palace lighting, no dice, no people, no UI, no betting board, no result board, no text, no numbers, no casino slot machine, no western casino, no cartoon, no neon.

### 69.1.5 Negative Prompt

Avoid:

slot machine, casino reels, roulette, poker table, western casino, neon arcade, cartoon, emoji, toy, plastic, fantasy treasure chest, sci-fi, cluttered ornament, busy tray pattern, dice included, people, dealer, betting UI, text, numbers, flat browser game asset, cheap mobile game prop, bright neon gold, mirror metal, low quality geometry, low detail, blurry, distorted table, impossible mechanism.

### 69.1.6 Concept Acceptance Checklist

The first table concept is accepted only if:

* table anatomy is clear
* upper dice holder is visible
* trapdoor/release idea is understandable
* lower tray is clean and usable for dice
* side rails and front lip feel physical
* Kanote ornament is restrained
* table feels Myanmar traditional
* table feels premium and handcrafted
* table does not look toy-like
* table does not look western casino
* table does not look like slot-machine equipment
* rolling surface is not busy
* future dice readability looks safe
* concept can guide future GLB modeling

### 69.1.7 Rejection Signals

Reject or revise the concept if:

* it includes dice
* it includes UI
* it includes people or dealer
* it looks like a casino table
* it looks like a slot machine
* it looks cartoon/toy/plastic
* the tray is too busy
* the table anatomy is wrong
* there is no clear dice holder
* there is no believable rolling tray
* Kanote ornament overwhelms gameplay area
* mobile readability would be unsafe

### 69.1.8 Next Step

Next chapter:

## Chapter 69.2 — Generate / Source First Table Concept Image

Goal:

Create or source the first custom table concept image using the locked prompt.

No code should change during Chapter 69.2.

The concept image should be reviewed before any GLB modeling, folder creation, registry wiring, or dev-lab import begins.

Locked rule:

Final production realism now starts with concept quality first, not code changes.

## Chapter 69.3 — Table Concept Visual QA

Status: Passed and locked.

Purpose:

Chapter 69.3 reviews the first custom Six Animal table concept image before any GLB modeling, registry wiring, dev-lab import, or production integration.

This chapter is visual QA only.

No GLB is imported.
No registry key is added.
No `/dev/three-dice` code is changed.
No `/six-animal` production code is changed.
No dice physics is changed.
No backend/admin/wallet/security logic is touched.

Reviewed concept asset:

```txt
public/assets/nagani/six-animal/table/six-animal-royal-table-concept-v1.png
```

### 69.3.1 Visual QA Verdict

The first custom table concept is accepted as v1.

The concept successfully captures the future custom table direction:

* premium Myanmar traditional game-table feeling
* dark red-black lacquer wood
* deep red velvet / felt rolling tray
* antique brass / old gold trim
* restrained carved Kanote ornament
* handcrafted royal palace furniture direction
* physical and trustworthy object feeling
* stronger production quality than the current procedural table

### 69.3.2 Anatomy QA

The concept preserves the important Six Animal table anatomy:

* upper dice holder is clear
* three trapdoor / flap release positions are clear
* backboard / chute wall is clear
* middle deflector bar is included
* long lower rolling tray is clear
* raised side rails are clear
* strong front lip closest to player is clear
* clean rolling surface is preserved

This matches the current playable table structure closely enough to guide future GLB modeling.

### 69.3.3 Material QA

Accepted material direction:

* dark lacquer wood feels premium
* red tray surface feels like velvet / felt
* brass/gold trim feels aged and physical
* carved front and side details feel more handcrafted
* table feels heavier and more real than the current procedural model

The concept does not feel like:

* slot machine
* western casino table
* cartoon toy
* cheap plastic prop
* browser-game primitive model
* neon arcade object

### 69.3.4 Gameplay Readability QA

The rolling tray is clean enough for future dice readability.

Accepted:

* no busy ornament on main tray floor
* strong contrast between red tray and future ivory dice
* side rails and front lip frame the tray clearly
* deflector bar is visible but not oversized
* table does not visually replace dice/result trust

Important future rule:

The rolling surface must remain clean in the final GLB. Kanote detail must stay on the outer furniture surfaces, not under stopped dice.

### 69.3.5 Caution For Future GLB

The small vertical gold pins along the side rails and front lip look beautiful, but they must be handled carefully in the final 3D model.

Future GLB rule:

* pins may be visual-only decoration
* pins should be reduced/lowered if they block dice visibility
* pins must not become physics obstacles
* pins must not make dice bounce unnaturally
* pins must not hide stopped top faces
* invisible colliders should remain simple and safe

The future custom GLB table should use simple invisible colliders, not tiny decorative mesh collision.

### 69.3.6 Acceptance Result

Chapter 69.3 passes because:

* concept anatomy is close to current game structure
* concept material quality is strong
* concept table feels premium and traditional
* concept tray remains clean
* concept avoids slot/casino/cartoon/toy direction
* concept can guide future 3D model production
* no code was changed
* no gameplay behavior was changed
* backend/admin safety remains untouched

### 69.3.7 Next Step

Next chapter:

## Chapter 69.4 — Decide: Concept Good Enough For 3D Model Brief or Revise

Recommended decision:

The concept is good enough to become the first 3D model brief reference.

Next step should lock the concept as the v1 model reference and prepare a short 3D model handoff note.

Do not import GLB yet.
Do not add registry keys yet.
Do not touch `/dev/three-dice` yet.
Do not touch `/six-animal` yet.

## Chapter 69.4 — Concept Good Enough For 3D Model Brief or Revise

Status: Passed and locked.

Purpose:

Chapter 69.4 makes the decision after visual QA of the first custom Six Animal table concept image.

This chapter decides whether the concept should be revised or accepted as the first 3D model brief reference.

This chapter is decision-only.

No GLB is imported.
No registry key is added.
No `/dev/three-dice` code is changed.
No `/six-animal` production code is changed.
No dice physics is changed.
No backend/admin/wallet/security logic is touched.

Reviewed concept asset:

```txt
public/assets/nagani/six-animal/table/six-animal-royal-table-concept-v1.png
```

### 69.4.1 Decision

Decision:

The first custom table concept is good enough to become the v1 3D model brief reference.

No immediate concept revision is required.

Reason:

The concept successfully captures the intended final table direction:

* real Myanmar traditional dice table feeling
* premium royal palace furniture style
* dark red-black lacquer wood
* clean deep red velvet / felt rolling tray
* antique brass / old gold trim
* carved Kanote ornament
* upper dice holder
* three release flap positions
* backboard / chute wall
* middle deflector bar
* long lower rolling tray
* raised side rails
* strong front lip
* no dice, no UI, no people
* no slot/casino/cartoon/toy feeling

### 69.4.2 Accepted Use

The concept is accepted as:

* visual reference for future 3D artist handoff
* material reference for lacquer, brass, felt, and Kanote
* table anatomy reference for future custom GLB model
* production quality direction reference
* future QA comparison image

This concept is not the final in-game asset.

It is the first accepted model reference.

### 69.4.3 Model Brief Guidance From Concept

The future 3D model should follow the concept closely, especially:

* table silhouette
* long tray proportions
* upper dice holder structure
* three flap positions
* backboard height
* clean tray floor
* carved front lip
* carved side panels
* brass/gold trim
* dark lacquer material direction
* red felt / velvet surface direction

### 69.4.4 Required Adjustments For Future 3D Model

The final GLB should improve or control these areas carefully:

1. Side/front gold pins

The concept includes many small vertical gold pins along side rails and front lip.

Future model rule:

* pins may stay as visual decoration
* pins must not become physics obstacles
* pins should not block stopped dice top faces
* pins can be reduced, lowered, or simplified if needed
* invisible colliders must remain simple

2. Trapdoor mechanism

The concept shows the flap positions clearly.

Future model rule:

* flaps should look believable
* flaps should not need real animation in first model pass
* visual flap placement must align with current dice holder/drop path

3. Tray surface

The tray surface is clean and accepted.

Future model rule:

* keep main rolling tray smooth
* no Kanote or busy pattern under dice
* preserve contrast against ivory dice

4. Deflector bar

The concept includes a middle deflector bar.

Future model rule:

* bar should be visible but not oversized
* bar should act as a visual match for the existing invisible collider
* bar must not make dice appear to hit empty air

### 69.4.5 What Not To Do Next

Do not immediately:

* import a GLB
* add table model registry keys
* add table texture registry keys
* replace the procedural table
* change dice physics
* change colliders
* change `/six-animal`
* change backend result authority
* change wallet or settlement logic

The next step is a handoff/modeling note, not code.

### 69.4.6 Acceptance Result

Chapter 69.4 passes because:

* the concept is accepted as v1
* no concept revision is needed now
* future 3D model requirements are clear
* caution areas are documented
* procedural table remains active
* custom table remains future visual-only GLB path
* `/dev/three-dice` remains the first import target later
* no production behavior changed

### 69.4.7 Next Step

Next chapter:

## Chapter 69.5 — 3D Model Handoff Note / Asset Creation Branch Lock

Goal:

Create a short final handoff note for a 3D artist or future modeling step using the accepted concept v1.

The handoff should clearly say:

* use concept v1 as the main visual reference
* preserve current playable table anatomy
* create visual-only GLB
* no dice included
* no UI included
* clean tray surface
* separated material slots
* mobile-safe model
* dev-lab import first
* procedural table remains fallback

Do not import any GLB yet.

## Chapter 69.5 — 3D Model Handoff Note / Asset Creation Branch Lock

Status: Passed and locked.

Purpose:

Chapter 69.5 closes the first custom table concept / asset creation branch and prepares the accepted concept for future 3D modeling.

This chapter creates the handoff note for a future 3D artist, Blender modeling step, or custom GLB creation step.

This chapter is planning and handoff only.

No GLB is imported.
No registry key is added.
No `/dev/three-dice` code is changed.
No `/six-animal` production code is changed.
No dice physics is changed.
No backend/admin/wallet/security logic is touched.

Reviewed and accepted concept asset:

```txt
public/assets/nagani/six-animal/table/six-animal-royal-table-concept-v1.png
```

### 69.5.1 Accepted Concept Status

The first custom table concept is accepted as the v1 visual reference for future 3D modeling.

Accepted strengths:

* premium Myanmar traditional table direction
* royal palace furniture feeling
* dark red-black lacquer wood
* deep red velvet / felt rolling tray
* antique brass / old gold trim
* restrained carved Kanote ornament
* clear upper dice holder
* three release flap positions
* clear backboard / chute wall
* visible middle deflector bar
* long lower rolling tray
* raised side rails
* strong front lip
* no dice included
* no UI included
* no people included
* no slot/casino/cartoon/toy direction

Decision:

No immediate concept revision is needed before the first 3D model brief.

### 69.5.2 3D Model Handoff Note

Use `six-animal-royal-table-concept-v1.png` as the main visual reference for the first custom Six Animal table GLB model.

The model should preserve the accepted concept direction while also staying aligned with the current playable table anatomy.

The future GLB should be:

* visual-only first
* mobile-game optimized
* cleanly modeled
* cleanly UV mapped
* exported as GLB
* centered origin
* applied transforms
* separated named meshes
* separated material slots where useful
* no dice included
* no betting UI included
* no result board included
* no palace background included
* no extra cameras
* no extra lights

The model must represent the physical dice table only.

### 69.5.3 Required 3D Model Anatomy

The first custom GLB model should include:

1. Upper dice holder

* three dice resting slots
* clear wall-mounted holder shape
* dark lacquer or teak-inspired body
* brass / old gold detail
* aligned with current dice drop path

2. Trapdoor / release flap area

* three flap positions
* believable brass/wood mechanical release look
* hinge impressions are allowed
* flaps do not need animation in first pass

3. Backboard / chute wall

* vertical or slightly angled back wall
* dark lacquer panel
* supports upper dice holder
* subtle carved Kanote detail
* not too busy behind mounted dice

4. Middle deflector bar

* visible horizontal bar across the dice path
* antique brass or dark wood with gold edge
* not oversized
* aligned visually with future invisible deflector collider

5. Lower sloped rolling tray

* long clean rolling surface
* deep red felt / velvet material
* no busy ornament under dice
* enough contrast for ivory dice
* smooth enough to read as playable

6. Side rails

* raised left/right boundaries
* dark lacquer wood
* old gold / brass edge trim
* visually contains dice
* does not block mobile camera readability

7. Front lip

* strong foreground table edge
* heavier lacquer wood
* carved Kanote front panel
* must not hide stopped dice top faces later

### 69.5.4 Material Slot Requirements

Recommended material slots:

```txt
dark_lacquer_wood
deep_red_felt_tray
antique_brass_trim
trapdoor_dark_wood
kanote_carved_gold
inner_shadow_dark
```

Material direction:

* lacquer wood should feel dark red-black, polished, and heavy
* red tray should feel like velvet or felt, not flat plastic
* brass/gold should feel antique, not neon
* Kanote should feel carved/embossed, not pasted sticker
* tray surface should stay clean and readable

### 69.5.5 Mesh Naming Recommendation

Suggested mesh names:

```txt
table_body_lacquer
tray_felt_surface
front_lip_lacquer
side_rail_left
side_rail_right
backboard_lacquer
dice_holder
trapdoor_flap_left
trapdoor_flap_center
trapdoor_flap_right
deflector_bar
kanote_front_trim
kanote_side_trim_left
kanote_side_trim_right
kanote_backboard_trim
brass_accents
```

Reason:

Clear mesh names will make future material tuning and dev-lab integration safer.

### 69.5.6 Important Adjustment From Concept

The concept includes many small vertical gold pins along the side rails and front lip.

Future model rule:

* pins can remain as visual decoration
* pins should be reduced, lowered, or simplified if needed
* pins must not block dice top-face readability
* pins must not become physics obstacles
* pins must not create tiny collision bumps
* invisible colliders should stay simple

The final table should use simple invisible colliders for gameplay physics.

Decorative details should be visual-only.

### 69.5.7 Hybrid Integration Rule

The future table remains hybrid:

* player sees the custom GLB table
* dice collides with simple invisible colliders
* procedural table remains fallback and collider reference

The custom GLB must not control:

* dice physics
* result detection
* backend result authority
* wallet logic
* settlement logic
* admin security
* live room timing

### 69.5.8 Future File Path

When the real custom GLB is created later, save it as:

```txt
public/assets/nagani/six-animal/table-models/six-animal-royal-table-v1.glb
```

Do not add this registry key until the real file exists:

```ts
naganiAssets.sixAnimal.tableModels.royalTableV1
```

### 69.5.9 Future Import Route

Future import must happen first in:

```txt
/dev/three-dice
```

Not first in:

```txt
/six-animal
```

Required first import steps later:

1. Add real GLB file to `public/assets/nagani/six-animal/table-models/`.
2. Add registry key only after file exists.
3. Render GLB only in `/dev/three-dice`.
4. Keep current invisible colliders active.
5. Keep procedural table fallback.
6. Align GLB table to current dice drop path.
7. Test dice landing, rail collision, front lip collision, deflector bar collision, and top-face readability.
8. Only after lab pass, test `/six-animal`.

### 69.5.10 Acceptance Result

Chapter 69.5 passes because:

* concept v1 is accepted as model reference
* model handoff requirements are documented
* anatomy requirements are documented
* material slot requirements are documented
* mesh naming direction is documented
* caution about decorative pins is documented
* future GLB path is documented
* dev-lab-first import rule remains locked
* no code was changed
* no gameplay behavior was changed
* backend/admin safety remains untouched

### 69.5.11 Chapter 69 Closeout

Chapter 69 is complete enough.

Completed:

* Chapter 69.1 — Custom Table Concept Prompt Final Review
* Chapter 69.2 — Generate / Source First Table Concept Image
* Chapter 69.3 — Table Concept Visual QA
* Chapter 69.4 — Decide: Concept Good Enough For 3D Model Brief or Revise
* Chapter 69.5 — 3D Model Handoff Note / Asset Creation Branch Lock

Current lock:

The first custom table concept is accepted as the v1 reference for future GLB modeling.

The next major step is not code.

The next major step is creating or sourcing the real custom table GLB model based on the accepted concept.

Recommended next branch:

## Chapter 70 — Custom Table GLB Creation / Source Preparation

Goal:

Prepare the real custom table GLB asset outside production runtime first.

Do not import into `/six-animal` yet.
Do not add registry keys yet.
Do not change dice physics yet.

## Chapter 70.1 — Custom Table GLB Creation Method Lock

Status: Passed and locked.

Purpose:

Chapter 70 starts the real custom table GLB creation/source preparation branch.

This chapter decides how the first real custom table GLB should be created or sourced before any import into the project.

This chapter is planning-only.

No GLB is imported.
No registry key is added.
No `/dev/three-dice` code is changed.
No `/six-animal` production code is changed.
No dice physics is changed.
No backend/admin/wallet/security logic is touched.

Current accepted reference:

```txt
public/assets/nagani/six-animal/table/six-animal-royal-table-concept-v1.png
```

Current stable production baseline:

* `/six-animal` remains the main MVP room.
* Improved procedural 3D table remains active.
* More Round + Softer dice remains active.
* Backend remains the dealer.
* Admin/backend safety remains locked.
* Current procedural table remains fallback and collider reference.
* Future custom table must enter through `/dev/three-dice` first.

### 70.1.1 Goal

Create or source the first real custom table GLB model based on the accepted concept v1.

The GLB should become the future visual table candidate.

It should not replace the current procedural table immediately.

The first goal is to produce a clean model file that can later be tested in `/dev/three-dice`.

### 70.1.2 Recommended Creation Method

Recommended method:

Use the accepted concept image as the main visual reference, then create the GLB through one of these paths:

1. Blender manual modeling
2. 3D artist handoff
3. AI-assisted 3D model generation followed by Blender cleanup
4. Hybrid: AI blockout first, artist/Blender cleanup second

Best practical path for this project:

AI-assisted or artist-assisted model creation is acceptable, but the final GLB should be cleaned in Blender before import.

Reason:

A raw AI-generated 3D model may have:

* messy geometry
* bad scale
* bad origin
* broken normals
* bad UVs
* too many polygons
* hidden geometry
* wrong material names
* impossible trapdoor shapes
* messy carved details
* poor mobile performance

The final file should be treated as a game asset, not just a pretty render.

### 70.1.3 Source Package Requirements

The model creator should receive:

1. Accepted table concept image

```txt
public/assets/nagani/six-animal/table/six-animal-royal-table-concept-v1.png
```

2. Current game table screenshots

Use screenshots showing:

* current front/top table view
* side/top view showing holder and deflector bar
* front lip / tray / side rails view

3. Written model brief from Chapter 69.5

Important instruction:

The concept image is the style/material reference.
The current game screenshots are the playable anatomy reference.

### 70.1.4 Required First GLB Result

The first GLB should be:

* one custom Six Animal table model
* no dice included
* no UI included
* no betting board included
* no result board included
* no people included
* no palace room included
* no extra cameras
* no extra lights
* mobile-game optimized
* clean enough for dev lab import

The model must include:

* upper dice holder
* three dice resting slots
* three trapdoor/flap release positions
* backboard/chute wall
* middle deflector bar
* long lower sloped tray
* raised side rails
* strong front lip
* carved Kanote front/side/backboard detail
* dark lacquer wood body
* deep red felt/velvet tray
* antique brass/old gold trim

### 70.1.5 Required File Format

Required export format:

```txt
.glb
```

Recommended final filename:

```txt
six-animal-royal-table-v1.glb
```

Future final path after asset exists:

```txt
public/assets/nagani/six-animal/table-models/six-animal-royal-table-v1.glb
```

Do not add this file path to `naganiAssets.ts` until the real GLB exists.

### 70.1.6 Blender Cleanup Requirements

Before the model is imported into the project, it should be checked in Blender or equivalent 3D software.

Required cleanup:

* centered origin
* applied transforms
* correct scale
* no extra cameras
* no extra lights
* no hidden unnecessary geometry
* normals fixed
* UVs clean enough
* material names clear
* object/mesh names clear
* polygon count reasonable for mobile
* no dice objects included
* no accidental text/number objects included

Suggested mesh names:

```txt
table_body_lacquer
tray_felt_surface
front_lip_lacquer
side_rail_left
side_rail_right
backboard_lacquer
dice_holder
trapdoor_flap_left
trapdoor_flap_center
trapdoor_flap_right
deflector_bar
kanote_front_trim
kanote_side_trim_left
kanote_side_trim_right
kanote_backboard_trim
brass_accents
```

Suggested material names:

```txt
dark_lacquer_wood
deep_red_felt_tray
antique_brass_trim
trapdoor_dark_wood
kanote_carved_gold
inner_shadow_dark
```

### 70.1.7 Mobile Performance Rule

The model must be mobile-safe.

Avoid:

* excessive polygon count
* heavy carved geometry everywhere
* huge texture files
* too many materials
* high-density hidden mesh
* over-detailed tray surface
* decorative pins modeled as complex collision-like objects

The table should look premium, but it must remain practical for a mobile-first game.

### 70.1.8 Gameplay Safety Rule

The future GLB is visual-only first.

The GLB must not control:

* dice physics
* dice collision
* result detection
* backend result authority
* wallet debit
* payout
* settlement
* round timing
* admin security

The future integration must keep simple invisible colliders.

Decorative details like Kanote carving and gold pins should be visual-only.

### 70.1.9 First QA Before Import

Before any code import, the GLB should be visually checked outside the app.

Check:

* table anatomy matches the current game table
* tray is long and sloped
* tray surface is clean
* upper dice holder is clear
* three flap positions are clear
* deflector bar exists
* side rails and front lip are clear
* front lip does not look too tall
* gold pins/details do not block dice area
* table does not look like casino/slot/toy/plastic
* material slots are understandable
* model looks usable as a game asset

### 70.1.10 What Not To Do Yet

Do not yet:

* create `naganiAssets.sixAnimal.tableModels`
* import `useGLTF`
* render GLB in `/dev/three-dice`
* render GLB in `/six-animal`
* delete procedural table
* change colliders
* change dice physics
* change camera
* change backend result flow
* change wallet/settlement/admin security

The next action is to create/source the actual GLB file outside runtime.

### 70.1.11 Next Step

Next chapter:

## Chapter 70.2 — Custom Table GLB Source Prompt / Artist Handoff Message

Goal:

Prepare the exact message/prompt to send to a 3D artist, Blender modeler, or AI 3D generation tool.

The message should include:

* accepted concept image as visual reference
* current table screenshots as anatomy reference
* required GLB format
* no dice / no UI / no people
* material and mesh naming requirements
* mobile-safe game asset rule
* dev-lab-first integration rule

## Chapter 70.2 — Custom Table GLB Source Prompt / Artist Handoff Message

Status: Passed and locked.

Purpose:

Chapter 70.2 prepares the exact handoff message/prompt for creating the first real custom Six Animal table GLB model.

This message can be used for:

* 3D artist handoff
* Blender modeler handoff
* AI-assisted 3D generation
* model cleanup instruction
* future asset production reference

This chapter is planning-only.

No GLB is imported.
No registry key is added.
No `/dev/three-dice` code is changed.
No `/six-animal` production code is changed.
No dice physics is changed.
No backend/admin/wallet/security logic is touched.

### 70.2.1 Handoff Context

We are creating a custom 3D GLB model for a Myanmar traditional Six Animal dice table, used in ၆ ကောင်ဂျင် / ဂလုန်းဂလုန်း.

The current game already has a working procedural 3D table and dice physics. The custom GLB is for visual production quality only.

The future integration will be hybrid:

* visible table = custom GLB model
* dice physics = simple invisible colliders
* current procedural table = fallback / collider reference

The GLB must not control dice physics.

### 70.2.2 Required References To Attach

Attach these references when sending the handoff:

1. Accepted concept image:

```txt
public/assets/nagani/six-animal/table/six-animal-royal-table-concept-v1.png
```

Use this as the main visual style/material reference.

2. Current in-game table screenshots:

Use screenshots showing:

* front/top current table view
* side/top view showing dice holder and deflector bar
* front lip / tray / side rails view

Use these as the playable anatomy reference.

Important instruction:

The concept image shows the final visual style.
The current game screenshots show the required functional structure.

### 70.2.3 Exact Handoff Message

Use this message for the artist/modeler/tool:

Create a custom 3D GLB model of a Myanmar traditional Six Animal dice table for ၆ ကောင်ဂျင် / ဂလုန်းဂလုန်း.

Use the attached accepted concept image as the main visual style reference: dark red-black lacquer wood, deep red velvet/felt rolling tray, antique brass/old gold trim, restrained carved Myanmar Kanote ornament, premium royal palace furniture feeling, heavy handcrafted ceremonial object.

Use the attached current game table screenshots as the functional anatomy reference. Preserve the same playable table structure:

* upper wall-mounted dice holder
* three dice resting slots
* three trapdoor/release flap positions
* vertical backboard / chute wall
* middle deflector bar
* long lower sloped rolling tray
* raised left and right side rails
* strong front lip closest to the player

The model should be visual-only first. It will later be aligned with simple invisible colliders inside the game. Do not design the model as a physics collider.

Do not include:

* dice
* people
* dealer
* betting UI
* result board
* text
* numbers
* palace room background
* extra cameras
* extra lights

The table should feel:

* premium
* Myanmar traditional
* royal palace furniture inspired
* handcrafted
* heavy and physical
* dark lacquer / polished wood
* deep red felt / velvet rolling surface
* antique brass / old gold trim
* restrained Kanote detail
* trustworthy and realistic

The table must not feel:

* toy-like
* plastic
* cartoon
* slot-machine-like
* western casino table
* roulette or poker table
* neon arcade
* fantasy treasure chest
* browser-game primitive model

### 70.2.4 Required Anatomy

The GLB must include:

1. Upper dice holder

* three dice resting slots
* wall-mounted holder structure
* dark lacquer or teak-inspired body
* brass / old gold accents
* aligned with current dice drop path

2. Trapdoor / release flap area

* three flap positions
* believable mechanical release detail
* small hinge impressions allowed
* flaps do not need animation in first pass

3. Backboard / chute wall

* vertical or slightly angled wall
* supports upper dice holder
* dark lacquer panel
* subtle carved Kanote detail
* not too busy behind mounted dice

4. Middle deflector bar

* visible horizontal bar across dice path
* antique brass or dark wood with gold edge
* not oversized
* should visually match future invisible deflector collider

5. Lower sloped rolling tray

* long clean rolling surface
* deep red felt / velvet material
* no busy pattern under dice
* enough contrast for ivory dice
* smooth and readable

6. Side rails

* raised left and right boundaries
* dark lacquer wood
* old gold / brass trim
* must not block mobile camera readability

7. Front lip

* strong foreground edge
* heavier lacquer wood
* carved Kanote front panel
* must not hide stopped dice top faces later

### 70.2.5 Material Slot Requirements

Please create separated material slots where possible:

```txt
dark_lacquer_wood
deep_red_felt_tray
antique_brass_trim
trapdoor_dark_wood
kanote_carved_gold
inner_shadow_dark
```

Material notes:

* lacquer wood should feel dark red-black, polished, and heavy
* red tray should feel like velvet or felt, not plastic
* brass/gold should feel antique, not neon
* Kanote should feel carved or embossed, not a flat sticker
* rolling tray must stay clean and readable

### 70.2.6 Mesh Naming Request

Use clear mesh names if possible:

```txt
table_body_lacquer
tray_felt_surface
front_lip_lacquer
side_rail_left
side_rail_right
backboard_lacquer
dice_holder
trapdoor_flap_left
trapdoor_flap_center
trapdoor_flap_right
deflector_bar
kanote_front_trim
kanote_side_trim_left
kanote_side_trim_right
kanote_backboard_trim
brass_accents
```

### 70.2.7 Technical Export Requirements

Export as:

```txt
GLB
```

Recommended filename:

```txt
six-animal-royal-table-v1.glb
```

Technical requirements:

* centered origin
* applied transforms
* clean scale
* clean UVs
* fixed normals
* no extra cameras
* no extra lights
* no hidden unnecessary geometry
* mobile-game optimized polygon count
* reasonable texture sizes
* material names preserved if possible
* mesh names preserved if possible

### 70.2.8 Important Modeling Cautions

The concept image includes small vertical gold pins along the side rails and front lip.

These may be included as visual decoration, but:

* keep them low enough to avoid blocking dice visibility
* do not make them too dense
* do not make the rolling tray busy
* do not make them look like collision obstacles
* they will not be used as physics colliders later

The main rolling tray must remain smooth and clean.

### 70.2.9 Final Short Prompt Version

Use this if a shorter prompt is needed:

Create a mobile-game optimized custom GLB model of a premium Myanmar traditional Six Animal dice table for ၆ ကောင်ဂျင် / ဂလုန်းဂလုန်း. Use the attached concept as visual style reference and current game screenshots as anatomy reference. The table must have an upper wall-mounted dice holder with three resting slots, three trapdoor release flaps, backboard/chute wall, middle deflector bar, long lower sloped red velvet rolling tray, raised side rails, and strong front lip. Style: dark red-black lacquer wood, deep red felt, antique brass/old gold trim, restrained carved Myanmar Kanote ornament, royal palace furniture, handcrafted, heavy, realistic, trustworthy. No dice, no UI, no people, no text, no casino/slot/cartoon/toy style. Export as clean GLB with centered origin, applied transforms, clean UVs, mobile-safe geometry, separated material slots, and clear mesh names.

### 70.2.10 Negative Prompt / Avoid List

Avoid:

```txt
slot machine, casino reels, roulette, poker table, western casino, neon arcade, cartoon, emoji, toy, plastic, fantasy treasure chest, sci-fi, cluttered ornament, busy tray pattern, dice included, people, dealer, betting UI, result UI, text, numbers, flat browser game asset, cheap mobile game prop, bright neon gold, mirror metal, low quality geometry, low detail, blurry, distorted table, impossible mechanism, broken trapdoor, wrong dice holder, short tray, flat box tray, missing deflector bar, overdecorated rolling surface
```

### 70.2.11 Future File Path

When the real GLB is ready, save it as:

```txt
public/assets/nagani/six-animal/table-models/six-animal-royal-table-v1.glb
```

Do not add this path to `naganiAssets.ts` until the real file exists.

### 70.2.12 Next Step

Next chapter:

## Chapter 70.3 — Source / Create First Custom Table GLB

Goal:

Use the locked handoff message to create or source the first real GLB file.

No code should change during 70.3 unless only creating folders and saving the asset file.

Do not import into `/dev/three-dice` yet.
Do not add registry keys yet.
Do not touch `/six-animal` yet.
## Chapter 70.3 — Custom Table Reference Package Lock

Status: Passed and locked.

Purpose:

Chapter 70.3 locks the custom Six Animal table image reference package before creating or sourcing the first GLB model.

This chapter prepares the accepted visual references for future AI 3D generation, Blender modeling, or artist handoff.

No GLB is imported.
No registry key is added.
No `/dev/three-dice` code is changed.
No `/six-animal` production code is changed.
No dice physics is changed.
No backend/admin/wallet/security logic is touched.

### 70.3.1 Reference Package Files

Accepted reference images:

```txt
public/assets/nagani/six-animal/table-models/six-animal-royal-table-v1-front-34.png
public/assets/nagani/six-animal/table-models/six-animal-royal-table-v1-front.png
public/assets/nagani/six-animal/table-models/six-animal-royal-table-v1-left-side.png
public/assets/nagani/six-animal/table-models/six-animal-royal-table-v1-top-front.png

## Chapter 70.4 — AI 3D / GLB Generation Prompt

Status: Passed and locked.

Purpose:

Chapter 70.4 prepares the exact AI 3D / GLB generation prompt for creating the first real custom Six Animal table model.

This chapter uses the locked reference package from Chapter 70.3.

No GLB is imported yet.
No registry key is added.
No `/dev/three-dice` code is changed.
No `/six-animal` production code is changed.
No dice physics is changed.
No backend/admin/wallet/security logic is touched.

### 70.4.1 Input Reference Images

Use these reference images:

```txt
public/assets/nagani/six-animal/table-models/six-animal-royal-table-v1-front-34.png
public/assets/nagani/six-animal/table-models/six-animal-royal-table-v1-front.png
public/assets/nagani/six-animal/table-models/six-animal-royal-table-v1-left-side.png
public/assets/nagani/six-animal/table-models/six-animal-royal-table-v1-top-front.png

## Chapter 70.5A — GLB Asset Pending Lock

Status: Passed and locked.

Purpose:

Chapter 70.5A pauses the custom table GLB import branch safely because the final `.glb` model does not exist yet.

The custom table reference image package is complete, but the real 3D model file is still pending.

This chapter prevents the project from getting stuck waiting for a missing GLB asset.

No GLB is imported.
No registry key is added.
No `/dev/three-dice` code is changed.
No `/six-animal` production code is changed.
No dice physics is changed.
No backend/admin/wallet/security logic is touched.

### 70.5A.1 Completed Reference Package

The custom Six Animal table reference package is complete enough for future GLB creation.

Accepted reference files:

```txt
public/assets/nagani/six-animal/table-models/six-animal-royal-table-v1-front-34.png
public/assets/nagani/six-animal/table-models/six-animal-royal-table-v1-front.png
public/assets/nagani/six-animal/table-models/six-animal-royal-table-v1-left-side.png
public/assets/nagani/six-animal/table-models/six-animal-royal-table-v1-top-front.png

## Chapter 71.1 — Procedural Table Cleanup Boundary Lock

Status: Passed and locked.

Purpose:

Chapter 71 starts the current procedural table production cleanup branch.

The custom GLB table branch is paused because the real `.glb` asset does not exist yet. This chapter defines how far we are allowed to polish the current procedural table without breaking the stable Six Animal room.

This chapter is planning-only.

No GLB is imported.
No registry key is added.
No `/six-animal` production behavior is changed yet.
No dice physics is changed yet.
No backend/admin/wallet/security logic is touched.

### 71.1.1 Current Problem

The current procedural table is useful and stable, but visually it has production-quality issues:

- dice holder can feel like it is floating
- deflector bar can feel separated from the table body
- back wall and lower tray can feel like separate objects
- mounted dice can feel suspended in air
- table anatomy does not yet feel like one handcrafted object
- dev-lab clean screenshots reveal the separation more clearly

This is acceptable for the current MVP physics prototype, but it should not be treated as the final table asset.

### 71.1.2 Current Strength

The current procedural table should remain active because:

- dice physics works
- dice result detection works
- `/six-animal` backend timeline sync works
- betting/result/settlement flow is stable
- current table is already integrated with mobile camera and room layout
- custom GLB asset is not available yet

The current table is the active production fallback.

### 71.1.3 Cleanup Goal

The goal is not to rebuild the whole table.

The goal is only to make the existing procedural table feel more connected and more usable until the future custom GLB exists.

Allowed cleanup areas:

- make the holder feel more attached to the backboard
- make the deflector bar visually mounted
- make the backboard/tray relationship feel less separated
- improve table readability in `/dev/three-dice`
- improve screenshot/reference mode
- keep dice readability safe
- keep mobile performance safe

### 71.1.4 What Must Not Change Yet

Do not change:

- backend result authority
- wallet debit / payout / settlement logic
- admin/security/RLS/grants
- `/six-animal` live round timing
- dice source-of-truth rule
- target result safety lock
- settlement UI flow
- betting flow
- table/dice production asset registry
- missing GLB import path

Do not do a full table rebuild.

Do not replace the current table with image planes.

Do not import a fake GLB.

### 71.1.5 Safe First Cleanup Order

Recommended safe order:

1. Dev lab only:
   - finish clean screenshot mode
   - hide dice cleanly
   - hide result panel cleanly
   - show deflector bar cleanly
   - make table easier to inspect

2. Procedural table visual connection:
   - add simple visual supports/brackets for deflector bar
   - add small holder/backboard connection pieces
   - add subtle shadow/bridge between backboard and tray
   - avoid changing colliders first

3. Lab QA:
   - check clean table screenshot
   - check dice still rolls
   - check result detection still works
   - run build

4. Only after lab pass:
   - decide whether any small visual-only table changes should move to `/six-animal`

### 71.1.6 Safety Rule

Visual-only meshes are allowed first.

Collider/physics changes are not allowed unless a later chapter explicitly requires them.

Reason:

The current dice physics and backend room flow are stable. A visual fix should not accidentally change dice behavior.

### 71.1.7 Current Decision

Decision:

Continue with the current procedural table as the active fallback.

Polish only what helps the table feel connected and readable.

Keep the future custom GLB references locked for later.

### 71.1.8 Next Step

Next chapter:

## Chapter 71.2 — Dev Lab Clean Screenshot Mode Completion

Goal:

Finish `/dev/three-dice` clean table screenshot mode before touching production room visuals.

Expected result:

- Clean Shot mode hides dice
- Clean Shot mode hides result panel
- Clean Shot mode hides bottom diagnostic cards
- deflector bar remains visible
- table can be captured clearly for references
- `/six-animal` remains untouched

## Chapter 71.5 — Procedural Table Cleanup Lock / Stop Table Tweaking

Status: Passed and locked.

Purpose:

Chapter 71.5 locks the current procedural table cleanup branch.

The custom GLB table branch remains pending because the real `.glb` file does not exist yet. The current procedural table has now received enough visual cleanup to continue as the active production fallback.

No GLB is imported.
No registry key is added.
No backend/admin/wallet/security logic is touched.
No dice physics behavior is intentionally changed.
No `/six-animal` live room flow is changed.

### 71.5.1 Completed Cleanup

Completed cleanup:

- `/dev/three-dice` clean screenshot mode works
- dice can be hidden for table screenshots
- result panel can be hidden
- bottom diagnostic cards can be hidden
- deflector bar can stay visible in clean shot mode
- visual support brackets were added to the deflector bar
- holder/backboard bridge supports were added
- table now feels less floating and more connected
- build passed

### 71.5.2 Current Accepted Status

The current procedural table is accepted as the active fallback table for the MVP/demo.

It is not the final custom production table.

It remains:

- stable enough for current gameplay
- readable enough for mobile
- connected enough visually after cleanup
- safe enough to continue production work
- replaceable later by the future custom GLB

### 71.5.3 Important Lock

Stop table anatomy tweaking for now.

Do not keep polishing the procedural table forever.

Reason:

The final table direction is already locked in the PNG reference package. The real final upgrade should happen through a future custom GLB model, not endless procedural mesh adjustments.

### 71.5.4 Future GLB Reminder

Future expected GLB path:

```txt
public/assets/nagani/six-animal/table-models/six-animal-royal-table-v1.glb

## Chapter 72.1 — Final Dice Production Polish Boundary Lock

Status: Passed and locked.

Purpose:

Chapter 72 starts the final dice production polish branch.

The goal is to decide whether the current dice needs small final visual polish before MVP/demo, without breaking the stable physical dice result flow.

This chapter is planning-only.

No dice physics is changed yet.
No result detection is changed yet.
No backend/admin/wallet/security logic is touched.
No `/six-animal` live room flow is changed.
No custom table GLB is imported.

### 72.1.1 Current Dice Status

The current Six Animal dice system is already strong enough as a working MVP foundation.

Current accepted strengths:

- dice are visible physical objects
- dice roll inside the table
- animal face textures are visible
- result is detected from physical dice orientation
- backend remains the dealer/source of truth for round timing and result state
- target-result correction remains locked off
- dice face result is readable enough on mobile
- dice flow works in `/six-animal`
- dev lab can test dice independently in `/dev/three-dice`

### 72.1.2 Current Dice Cautions

Remaining possible polish areas:

- dice body material can look more premium
- animal face print can be tuned for mobile readability
- dice can feel slightly too plain against the premium table direction
- top-face readability should remain protected
- dice should not become too shiny or toy-like
- dice should not become too round and lose face readability
- dice should not become too heavy/dull and lose excitement

### 72.1.3 Main Safety Rule

Do not change dice physics casually.

The current dice behavior is already stable enough.

Allowed first changes are visual-only:

- material color
- roughness
- clearcoat
- face print opacity
- face print size
- warm tint
- lighting-only review in dev lab if needed

Not allowed without a separate chapter:

- collider changes
- dice size changes
- gravity changes
- restitution changes
- friction changes
- result detection thresholds
- target correction logic
- backend result authority
- forced result animation
- suspicious dice correction

### 72.1.4 Source Of Truth Lock

The visible physical dice must remain the player-facing source of trust.

The dice face shown on the physical dice must stay aligned with what the result board shows.

Do not create separate fake result visuals that contradict the dice.

Do not force target result if the physical dice face does not match.

### 72.1.5 Final Dice Polish Goal

The goal is small, safe, production-facing polish:

- make dice feel more like ivory/resin ceremonial dice
- keep animal faces readable
- keep rolling motion exciting
- keep top face readable
- keep mobile view clear
- avoid cheap toy/plastic look
- avoid suspicious result behavior

### 72.1.6 Recommended Order

Recommended Chapter 72 order:

1. Dice visual audit in `/dev/three-dice`
2. Dice visual audit in `/six-animal`
3. Decide if material polish is needed
4. If needed, tune only material constants
5. Build and QA
6. Lock dice as MVP/demo-ready

### 72.1.7 What Must Not Change Now

Do not change:

- custom table GLB path
- procedural table anatomy
- dice colliders
- dice physics behavior
- result detection logic
- backend timeline
- wallet debit/payout
- settlement logic
- admin security
- `/six-animal` round flow

### 72.1.8 Acceptance Result

Chapter 72.1 passes because:

- dice polish boundary is clear
- risky physics changes are blocked
- visual-only polish is allowed later
- source-of-truth rule remains protected
- backend/admin/wallet safety remains untouched
- custom table GLB branch remains paused

### 72.1.9 Next Step

Next chapter:

## Chapter 72.2 — Dice Visual QA

Goal:

Review the current dice in `/dev/three-dice` and `/six-animal` before touching code.

Check:

- dice body material
- animal face visibility
- top-face readability
- mobile size
- rolling excitement
- result trust

## Chapter 72.3 — Dice Visual QA Result / No-Code Polish Decision

Status: Passed and locked.

Purpose:

Chapter 72.3 records the dice visual QA result after testing in `/dev/three-dice`.

This chapter decides whether dice needs immediate code/material changes before MVP/demo.

No code is changed in this chapter.
No dice physics is changed.
No result detection is changed.
No backend/admin/wallet/security logic is touched.
No `/six-animal` live room flow is changed.
No custom table GLB is imported.

### 72.3.1 QA Result

Dice visual QA passed.

The current dice are accepted as good enough for MVP/demo.

Accepted:

- dice body is readable
- dice size is acceptable
- animal faces are visible
- top face is readable enough
- rolling still feels exciting
- dice does not look suspiciously controlled
- result still comes from visible physical dice
- table does not fully hide dice
- More Round + Softer test remains visually acceptable
- Clean Shot / Show Dice controls work in dev lab

### 72.3.2 No Immediate Dice Code Change

Decision:

Do not change dice material constants now.

Do not tune:

- dice body color
- dice roughness
- dice metalness
- face print size
- face print opacity
- warm tint
- collider preset
- gravity
- restitution
- friction
- result detection threshold

Reason:

The current dice is stable and readable enough. More changes may risk breaking the accepted physical dice feel.

### 72.3.3 Accepted Dice Direction

Current accepted dice direction:

- ivory / ceremonial dice feeling
- rounded enough for believable rolling
- large enough for mobile readability
- animal faces visible on physical dice
- result board remains connected to dice result
- no fake result override
- no production target correction

### 72.3.4 Safety Lock

The visible physical dice remains the player-facing trust source.

Do not create result visuals that contradict the visible dice.

Do not force the dice to match a hidden target in production.

Do not change result detection unless there is a real QA failure.

### 72.3.5 Future Optional Polish

Future optional dice polish may happen later, but only after MVP/demo lock:

- improved custom dice GLB
- improved ivory material
- improved engraved/printed animal faces
- better texture compression
- mobile readability tuning

These are not required now.

### 72.3.6 Acceptance Result

Chapter 72.3 passes because:

- dice visual QA passed
- no immediate dice code change is needed
- dice source-of-truth rule remains protected
- physics remains untouched
- backend/admin/wallet safety remains untouched
- custom GLB branch remains pending

### 72.3.7 Next Step

Next chapter:

## Chapter 72.4 — Final Dice MVP/Demo Lock

Goal:

Lock current dice as MVP/demo-ready and stop dice tweaking unless a real bug appears.

## Chapter 72.4 — Final Dice MVP/Demo Lock

Status: Passed and locked.

Purpose:

Chapter 72.4 locks the current Six Animal dice as MVP/demo-ready.

This chapter stops dice tweaking unless a real bug appears.

No code is changed in this chapter.
No dice physics is changed.
No result detection is changed.
No backend/admin/wallet/security logic is touched.
No `/six-animal` live room flow is changed.
No custom table GLB is imported.

### 72.4.1 Final Dice Decision

Decision:

The current Six Animal dice are accepted as MVP/demo-ready.

The dice are not final AAA production assets, but they are good enough for the next stable demo stage.

Accepted current dice qualities:

- visible physical dice source of truth
- animal faces readable enough
- dice body readable against the table
- dice size acceptable for mobile
- rolling motion still feels exciting
- rounded shape feels better than square dice
- final stopped face can be read well enough
- result board relationship remains trustworthy
- no production target correction
- no fake result override

### 72.4.2 Locked Dice Preset Direction

Current accepted demo direction:

- dice shape: More Round / production rounded direction
- collider: Softer / production-safe direction
- ivory ceremonial dice body
- printed animal faces
- visible physical dice result detection
- backend remains the dealer/source of truth for room timing and result state

### 72.4.3 What Must Not Change Now

Do not change:

- dice collider
- dice size
- dice gravity
- dice friction
- dice restitution
- dice angular damping
- result detection threshold
- target correction safety
- backend result authority
- wallet debit/payout
- settlement logic
- admin security
- custom table GLB path
- `/six-animal` stable live room flow

### 72.4.4 Future Dice Upgrade Path

Future dice upgrade may happen later only as a separate branch.

Possible future branch:

## Future Chapter — Custom Dice GLB / Final Dice Material Upgrade

Possible future improvements:

- custom dice GLB
- improved ivory/resin material
- engraved or better blended animal faces
- better texture compression
- improved mobile readability
- production texture atlas
- final dice asset QA

This is not required for current MVP/demo lock.

### 72.4.5 Acceptance Result

Chapter 72.4 passes because:

- dice visual QA passed
- dice is accepted for MVP/demo
- no risky physics change is needed
- no result detection change is needed
- physical dice trust rule remains locked
- backend/admin/wallet safety remains untouched
- project can move forward without more dice tweaking

### 72.4.6 Chapter 72 Closeout

Chapter 72 is complete enough.

Completed:

- Chapter 72.1 — Final Dice Production Polish Boundary Lock
- Chapter 72.2 — Dice Visual QA
- Chapter 72.3 — Dice Visual QA Result / No-Code Polish Decision
- Chapter 72.4 — Final Dice MVP/Demo Lock

Current lock:

The current dice are MVP/demo-ready.

Stop dice tweaking unless a real QA bug appears.

### 72.4.7 Next Recommended Branch

Next chapter:

## Chapter 73 — Final Six Animal MVP Production QA

Goal:

Run one complete production QA pass after table/dice locks.

Check:

- `/six-animal` full round
- no-bet round
- bet round
- refresh safety
- backend timeline sync
- result/settlement continuity
- mobile readability
- admin monitor pages
- build stability

## Chapter 73.1 — Final Six Animal MVP Production QA Plan

Status: Passed and locked.

Purpose:

Chapter 73 starts the final Six Animal MVP production QA pass after table and dice locks.

This chapter defines the final QA checklist before moving toward demo/deploy readiness.

No code is changed in this chapter.
No dice physics is changed.
No table anatomy is changed.
No backend/admin/wallet/security logic is changed.
No custom GLB is imported.

### 73.1.1 Current Locked Baseline

Current accepted baseline:

- `/six-animal` uses the stable backend-connected live room
- backend controls round timing and result state
- player browser does not control final result authority
- visible physical dice remains player-facing trust source
- current procedural table is accepted as MVP fallback
- custom table GLB branch is paused until real `.glb` exists
- current dice is accepted as MVP/demo-ready
- admin monitor pages exist for backend health and financial integrity
- wallet debit/payout flow has already passed earlier backend QA
- build has been passing after chapter locks

### 73.1.2 Final QA Scope

Chapter 73 will test:

1. `/six-animal` normal full bet round
2. `/six-animal` no-bet round
3. refresh / reconnect safety
4. backend timeline sync
5. result and settlement continuity
6. mobile portrait readability
7. admin monitor pages
8. financial integrity / wallet safety visibility
9. final build stability

### 73.1.3 What Must Not Change During QA

Do not change:

- dice physics
- dice collider
- dice result detection
- table anatomy
- backend round functions
- wallet debit/payout functions
- admin access guard
- RLS policies
- cron runner schedule
- result authority logic
- production target correction safety
- custom GLB registry path

Only fix real QA-blocking bugs.

### 73.1.4 QA Order

Recommended QA order:

1. Chapter 73.2 — `/six-animal` Full Bet Round QA
2. Chapter 73.3 — `/six-animal` No-Bet Round QA
3. Chapter 73.4 — Refresh / Reconnect QA
4. Chapter 73.5 — Result / Settlement Continuity QA
5. Chapter 73.6 — Mobile Portrait Readability QA
6. Chapter 73.7 — Admin Monitor QA
7. Chapter 73.8 — Final Build / Demo Lock

### 73.1.5 Acceptance Result

Chapter 73.1 passes because:

- final QA scope is defined
- stable table and dice locks are protected
- backend/admin/wallet safety is protected
- no new feature branch is started
- project can now run final Six Animal MVP QA in order

### 73.1.6 Next Step

Next chapter:

## Chapter 73.2 — `/six-animal` Full Bet Round QA

Goal:

Test one complete betting round from player perspective:

- enter `/six-animal`
- wait for betting phase
- select animal
- enter bet amount
- place bet
- confirm bet locks
- wait for Bets Closed
- observe dice rolling
- observe result reveal
- observe settlement
- confirm next round reset

## Chapter 73.8 — Final Build / Six Animal MVP Demo Lock

Status: Passed and locked.

Purpose:

Chapter 73.8 locks the current Six Animal MVP/demo production baseline after final QA.

This chapter closes the final Six Animal MVP QA branch.

No new feature is added.
No dice physics is changed.
No table anatomy is changed.
No backend/admin/wallet/security logic is changed.
No custom GLB is imported.

### 73.8.1 Completed Final QA

Completed Chapter 73 QA:

* Chapter 73.1 — Final Six Animal MVP Production QA Plan
* Chapter 73.2 — `/six-animal` Full Bet Round QA
* Chapter 73.3 — `/six-animal` No-Bet Round QA
* Chapter 73.4 — Refresh / Reconnect QA
* Chapter 73.5 — Result / Settlement Continuity QA
* Chapter 73.6 — Mobile Portrait Readability QA
* Chapter 73.7 — Admin Monitor QA
* Chapter 73.8 — Final Build / Six Animal MVP Demo Lock

### 73.8.2 Current Accepted MVP/Demo Baseline

The current Six Animal room is accepted as MVP/demo-ready.

Accepted baseline:

* backend-connected live Six Animal room
* backend controls round timing and result state
* cron runner is healthy
* wallet debit/payout flow passed previous safety QA
* full bet round works
* no-bet round works
* refresh/reconnect works well enough for MVP
* rolling reconnect reconstructs current dice stage instead of disappearing
* result/settlement continuity passed
* mobile portrait readability passed
* admin monitor pages passed
* financial integrity monitor passed
* current procedural table is accepted as MVP fallback
* current dice is accepted as MVP/demo-ready
* custom table GLB branch is paused until real `.glb` exists

### 73.8.3 Important Production Trust Lock

The player browser does not control final result authority.

Backend remains the dealer/source of truth for:

* round phase
* round timing
* result animals
* bet acceptance
* wallet debit
* settlement / payout

The visible physical dice remains the player-facing trust layer.

Do not reintroduce:

* production target correction
* fake result override
* browser-settlement logic
* frontend-only wallet change
* old mock result logic
* old sample table fallback
* dev/lab UI in production room

### 73.8.4 Accepted Remaining Limitations

Accepted MVP/demo limitations:

* current table is still procedural, not final custom GLB
* final royal table GLB is pending
* current dice is good enough, not final AAA dice asset
* reconnect during rolling reconstructs the current dice stage rather than continuing the exact physics frame
* THREE.WebGLShadowMap warning is accepted as non-blocking for now

These are not blockers for MVP/demo.

### 73.8.5 Stop-Tweaking Rule

Stop tweaking Six Animal table/dice unless there is a real QA-blocking bug.

Do not keep polishing:

* table anatomy
* dice physics
* dice material
* result board layout
* settlement layout
* betting sheet layout

Reason:

The current Six Animal MVP is stable enough. More random polishing may break the accepted live backend room.

### 73.8.6 Future Upgrade Branches

Future branches may continue separately:

1. Custom royal table GLB branch
   Resume only after this file exists:

```txt
public/assets/nagani/six-animal/table-models/six-animal-royal-table-v1.glb
```

2. Custom dice GLB / final dice material branch

3. Final palace room / environment production branch

4. Deploy / client demo preparation branch

5. Thirty Six parity branch

Do not mix these into the locked Six Animal MVP baseline unless intentionally starting a new chapter.

### 73.8.7 Acceptance Result

Chapter 73.8 passes because:

* full player bet round passed
* no-bet round passed
* refresh/reconnect QA passed
* result/settlement continuity passed
* mobile portrait QA passed
* admin monitor QA passed
* table and dice are locked as MVP/demo-ready
* backend/admin/wallet safety remains protected
* custom GLB branch remains pending
* final build passed

### 73.8.8 Chapter 73 Closeout

Chapter 73 is complete.

Current status:

Six Animal MVP/demo baseline is locked.

Next recommended branch:

## Chapter 74 — Demo / Deploy Readiness Final Prep

Goal:

Prepare the project for final local demo / deployment review.

Focus:

* final build confirmation
* environment variable checklist
* Supabase production checklist
* admin account checklist
* demo route checklist
* client-safe explanation
* final handoff note

## Chapter 74.1 — Demo / Deploy Readiness Final Prep Plan

Status: Passed and locked.

Purpose:

Chapter 74 starts the final demo / deploy readiness branch after Six Animal MVP QA lock.

This chapter defines the final preparation checklist before local demo, client review, or deployment review.

No new feature is added.
No dice physics is changed.
No table anatomy is changed.
No backend/admin/wallet/security logic is changed.
No custom GLB is imported.

### 74.1.1 Current Locked Baseline

Current accepted baseline:

* Six Animal MVP/demo baseline is locked
* full bet round passed
* no-bet round passed
* refresh/reconnect QA passed
* result/settlement continuity passed
* mobile portrait readability passed
* admin monitor QA passed
* current procedural table is accepted as MVP fallback
* current dice is accepted as MVP/demo-ready
* custom royal table GLB branch is paused until real `.glb` exists
* backend/admin/wallet safety remains protected

### 74.1.2 Demo / Deploy Prep Scope

Chapter 74 will prepare:

1. final build confirmation
2. environment variable checklist
3. Supabase production checklist
4. cron runner / backend health checklist
5. admin account checklist
6. wallet / financial integrity checklist
7. demo route checklist
8. client-safe explanation
9. final handoff / continuation letter

### 74.1.3 What Must Not Change During Chapter 74

Do not change:

* dice physics
* dice result detection
* table anatomy
* betting flow
* result board flow
* settlement flow
* backend round functions
* wallet debit / payout logic
* admin security
* RLS policies
* RPC grants
* custom GLB registry path

Only fix real deploy/demo blockers.

### 74.1.4 Demo Route Checklist

Primary routes to verify:

```txt
/
/six-animal
/admin
/admin/six-animal
/admin/backend-health
/admin/financial-integrity
```

Optional routes to verify later:

```txt
/cashier
/history
/profile
/live
/thirty-six
```

Six Animal remains the main MVP demo focus.

### 74.1.5 Environment Checklist

Before deploy/demo, confirm:

```txt
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

Also confirm Supabase project has:

* correct database migrations / SQL functions
* cron runner active
* main Six Animal room seeded
* enabled admin user exists
* wallet table exists
* RPC permissions are correct
* backend health function works
* financial integrity function works

### 74.1.6 Client-Safe Demo Explanation

The demo should be explained honestly:

* Six Animal is backend-connected
* backend controls round timing and result state
* wallet debit/payout is connected for tested flow
* admin monitor pages show backend health and financial integrity
* current table/dice are MVP/demo-ready
* final custom GLB table is future production asset work
* current reconnect reconstructs live dice stage after refresh, not exact same physics frame
* sound remains muted / skipped for now
* Thirty Six parity is not the current locked focus

### 74.1.7 Acceptance Result

Chapter 74.1 passes because:

* demo/deploy prep scope is defined
* current MVP lock is protected
* no new feature branch is started
* environment/backend/admin checks are listed
* project can continue final readiness work safely

### 74.1.8 Next Step

Next chapter:

## Chapter 74.2 — Final Build / Environment Checklist

Goal:

Confirm final build and list required environment/backend setup before deployment or demo handoff.

## Chapter 74.2 — Final Build / Environment Checklist

Status: Passed and locked.

Purpose:

Chapter 74.2 confirms the final build/environment checklist before demo or deployment review.

This chapter does not change code.

No new feature is added.
No dice physics is changed.
No table anatomy is changed.
No backend/admin/wallet/security logic is changed.
No custom GLB is imported.

### 74.2.1 Final Build Requirement

Before demo or deploy review, the project must pass:

```bash
npm run build
```

Build must pass without TypeScript errors.

Non-blocking browser console warnings may be accepted only if they do not break gameplay, wallet, backend sync, or admin monitoring.

Accepted non-blocking warning:

```txt
THREE.WebGLShadowMap warning
```

This warning is not a demo blocker for the current MVP.

### 74.2.2 Required Environment Variables

The project requires these frontend environment variables:

```txt
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

Before deployment, confirm:

* `.env.local` has correct values for local testing
* deployment platform has the same required variables
* no service role key is exposed to frontend
* no private admin secret is committed into source code

### 74.2.3 Supabase Project Checklist

Before demo/deploy, confirm Supabase has:

* `six_animal_rooms`
* `six_animal_rounds`
* `six_animal_bets`
* `wallets`
* `wallet_transactions`
* `admin_users`
* required backend RPC functions
* required health/integrity monitor functions
* required RLS policies
* required RPC grants
* main room seeded

Main Six Animal room ID:

```txt
11111111-1111-1111-1111-111111111111
```

### 74.2.4 Cron Runner Checklist

Confirm cron runner exists and is active:

```txt
six-animal-main-room-runner
```

Expected schedule:

```txt
5 seconds
```

Expected command:

```sql
select public.advance_six_animal_room(
  '11111111-1111-1111-1111-111111111111'
);
```

Expected status:

* cron active
* latest run succeeded
* no repeated failed runs
* active round continues moving through betting, closed, rolling, and result

### 74.2.5 Backend Function Checklist

Required backend room functions:

```txt
advance_six_animal_room
rotate_six_animal_round
close_and_roll_six_animal
settle_six_animal_round
place_six_animal_bet
get_my_six_animal_bet
is_nagani_admin
get_six_animal_backend_health
get_six_animal_financial_integrity
```

Expected access direction:

* player bet functions available only to authenticated users
* admin checks available only to authenticated users
* room runner / settlement functions protected from normal player/browser use
* health/integrity monitor access must not expose unsafe write permissions

### 74.2.6 Admin Account Checklist

Before demo/deploy, confirm at least one enabled admin exists in:

```txt
public.admin_users
```

Admin route behavior:

* enabled admin can open admin pages
* normal player cannot open admin pages
* logged-out user cannot open admin pages
* admin guard checks server-side
* admin pages are monitor/read-only for this MVP stage

Required admin routes:

```txt
/admin
/admin/six-animal
/admin/backend-health
/admin/financial-integrity
```

### 74.2.7 Wallet / Financial Integrity Checklist

Before demo/deploy, confirm:

* player wallet exists
* wallet balance loads
* placing bet debits once
* duplicate bet is blocked
* settlement pays once
* no duplicate payout appears after refresh
* financial integrity page shows clean status

Expected clean values:

```txt
Negative Wallets: 0
Duplicate Bet Pairs: 0
Old Unsettled Bets: 0
```

### 74.2.8 Six Animal Route Checklist

Primary player route:

```txt
/six-animal
```

Confirm:

* room loads
* betting phase appears
* betting sheet opens
* animal selection works
* bet amount works
* Place Bet locks bet
* Bets Closed phase appears
* dice rolling appears
* result board fills
* settlement appears after result if player bet
* no settlement appears if no bet
* next round resets cleanly
* refresh during rolling reconstructs current live dice stage
* no dev/lab UI appears
* no old sample table appears

### 74.2.9 Accepted MVP Limitations

Accepted for current MVP/demo:

* custom GLB table is not yet available
* current table remains procedural fallback
* dice are MVP/demo-ready, not final AAA asset
* reconnect reconstructs current rolling stage instead of continuing the exact same physics frame
* project remains muted / no sound branch yet
* Thirty Six parity is outside current final Six Animal lock

### 74.2.10 What Must Not Change During Final Prep

Do not change:

* dice physics
* dice result detection
* table anatomy
* betting flow
* wallet debit/payout logic
* admin security
* RLS policies
* RPC grants
* cron runner logic
* custom GLB registry path

Only fix real demo/deploy blockers.

### 74.2.11 Acceptance Result

Chapter 74.2 passes because:

* final build requirement is defined
* environment variables are listed
* Supabase requirements are listed
* cron runner checklist is locked
* admin checklist is locked
* wallet/integrity checklist is locked
* Six Animal route checklist is locked
* accepted MVP limitations are documented
* no risky code change is made

### 74.2.12 Next Step

Next chapter:

## Chapter 74.3 — Demo Route QA Checklist

Goal:

Run final route QA before demo/deploy review.

Primary focus:

* `/`
* `/six-animal`
* `/admin`
* `/admin/six-animal`
* `/admin/backend-health`
* `/admin/financial-integrity`

## Chapter 74.3 — Demo Route QA Checklist

Status: Passed and locked.

Purpose:

Chapter 74.3 defines the final demo route QA checklist before local demo, client review, or deployment review.

This chapter does not change code.

No new feature is added.
No dice physics is changed.
No table anatomy is changed.
No backend/admin/wallet/security logic is changed.
No custom GLB is imported.

### 74.3.1 Primary Demo Routes

Primary routes to verify:

```txt
/
/six-animal
/admin
/admin/six-animal
/admin/backend-health
/admin/financial-integrity
```

Six Animal remains the main MVP demo focus.

### 74.3.2 Lobby Route QA

Route:

```txt
/
```

Confirm:

* lobby loads
* Nagani branding appears
* Six Animal entry is visible
* no broken image appears
* page does not crash
* mobile layout is acceptable
* navigation to `/six-animal` works

### 74.3.3 Six Animal Route QA

Route:

```txt
/six-animal
```

Confirm:

* room loads
* palace background appears
* live round state loads
* betting phase appears when open
* betting sheet works
* animal selection works
* bet amount works
* Place Bet locks bet
* wallet balance updates after bet
* Bets Closed phase appears
* rolling phase appears
* dice roll/reveal sequence appears
* result board fills
* settlement appears after result when player has bet
* no settlement appears when player did not bet
* next round resets cleanly
* refresh/reconnect works well enough for MVP
* no old sample table appears
* no dev/lab UI appears

### 74.3.4 Admin Overview QA

Route:

```txt
/admin
```

Confirm:

* enabled admin can access
* logged-out user is blocked
* normal player is blocked
* page does not crash
* live room summary appears
* backend status is readable
* no direct unsafe edit action is exposed

### 74.3.5 Admin Six Animal QA

Route:

```txt
/admin/six-animal
```

Confirm:

* enabled admin can access
* room state is visible
* active round is visible
* recent rounds are visible
* active bets / round data are readable if available
* page is monitor-focused
* no unsafe player-facing write action is exposed
* page does not crash

### 74.3.6 Backend Health QA

Route:

```txt
/admin/backend-health
```

Confirm:

* enabled admin can access
* health status is visible
* cron runner status is visible
* latest cron run succeeded
* failed runs last hour is acceptable
* old unsettled bets count is acceptable
* active round age is acceptable
* page does not expose unsafe public access

Expected healthy direction:

```txt
Cron Active: Yes
Health Status: Healthy
Old Unsettled Bets: 0
Failed Runs Last Hour: 0
```

### 74.3.7 Financial Integrity QA

Route:

```txt
/admin/financial-integrity
```

Confirm:

* enabled admin can access
* financial integrity status is visible
* negative wallets count is visible
* duplicate bet pair count is visible
* old unsettled bets count is visible
* duplicate payout concern is not shown
* page is read-only monitor
* no normal player can access

Expected clean direction:

```txt
Integrity Status: Clean
Negative Wallets: 0
Duplicate Bet Pairs: 0
Old Unsettled Bets: 0
```

### 74.3.8 Optional Route QA

Optional routes for later review:

```txt
/cashier
/history
/profile
/live
/thirty-six
```

These are not the main Chapter 74 blocker unless they crash the app or block demo navigation.

### 74.3.9 Accepted Non-Blocking Warning

Accepted non-blocking warning:

```txt
THREE.WebGLShadowMap warning
```

This warning is not a demo blocker for the current MVP if gameplay and route QA pass.

### 74.3.10 Acceptance Result

Chapter 74.3 passes because:

* primary demo routes are listed
* Six Animal route QA is defined
* admin route QA is defined
* backend health QA is defined
* financial integrity QA is defined
* optional route QA is separated
* no risky code change is made

### 74.3.11 Next Step

Next chapter:

## Chapter 74.4 — Client-Safe Demo Explanation

Goal:

Prepare the short explanation for what the MVP demo includes, what is real, what is pending, and what should not be promised yet.

## Chapter 74.4 — Client-Safe Demo Explanation

Status: Passed and locked.

Purpose:

Chapter 74.4 prepares the safe explanation for showing the current Six Animal MVP/demo to a client, partner, teammate, or reviewer.

This chapter does not change code.

No new feature is added.
No dice physics is changed.
No table anatomy is changed.
No backend/admin/wallet/security logic is changed.
No custom GLB is imported.

### 74.4.1 Demo Position

The current Six Animal room is ready to show as an MVP/demo baseline.

It should be presented as:

* backend-connected live Six Animal game room
* mobile-first Myanmar traditional game experience
* working betting flow
* working wallet debit/payout flow for tested flow
* backend-controlled round timing
* backend-controlled result state
* admin monitor visibility
* MVP/demo-ready table and dice presentation

It should not be presented as final AAA production asset quality yet.

### 74.4.2 What Is Real In The Demo

The demo includes real working foundations:

* live room phase flow
* backend round progression
* backend result animals
* cron-controlled room runner
* authenticated bet placement
* wallet debit on bet
* settlement/payout flow
* player bet restore
* refresh/reconnect recovery
* admin access guard
* backend health monitor
* financial integrity monitor
* mobile portrait player flow

### 74.4.3 What Is MVP / Prototype Quality

The following are accepted MVP/demo quality, not final production quality:

* current table is procedural fallback
* current dice are MVP/demo-ready, not final custom GLB dice
* custom royal table GLB is pending
* sound is skipped/muted
* Thirty Six parity is not the current locked focus
* palace room/background is v1, not final environment production
* reconnect during rolling reconstructs current dice stage instead of continuing exact same physics frame

### 74.4.4 Safe Client Explanation

Use this explanation:

```txt
This Six Animal demo shows the core live-room system working end-to-end.

The backend controls the round timing, betting window, rolling phase, result state, wallet debit, and settlement flow. The player browser does not decide the final result or payout.

The current 3D table and dice are MVP/demo-ready visual assets. They are stable enough to demonstrate the game flow and trust structure. The final custom royal table model and final high-end dice assets are planned as the next production asset upgrade.

For this demo, the main goal is to show that the live room, betting flow, backend result authority, wallet flow, reconnect behavior, and admin monitoring are working together.
```

### 74.4.5 What Not To Promise Yet

Do not promise yet:

* final custom GLB table is complete
* final AAA dice model is complete
* final sound design is complete
* Thirty Six is equal to Six Animal quality
* production deployment is complete unless environment is already deployed and verified
* all edge cases are production-audited beyond the completed MVP QA scope
* exact same physics frame continues after refresh

### 74.4.6 What Can Be Promised Safely

Safe to say:

* Six Animal MVP/demo baseline is working
* backend-connected room flow is working
* wallet debit/payout tested flow is working
* admin health/integrity monitor exists
* mobile portrait flow passed QA
* refresh/reconnect is acceptable for MVP
* table/dice are locked as MVP/demo-ready
* final visual asset upgrade has a clear future path

### 74.4.7 Acceptance Result

Chapter 74.4 passes because:

* demo explanation is honest
* real backend/wallet/admin work is clearly separated from MVP visual limitations
* future custom GLB table work is not falsely promised as complete
* client-safe wording is prepared
* no risky code change is made

### 74.4.8 Next Step

Next chapter:

## Chapter 74.5 — Final Handoff / Continuation Letter

Goal:

Prepare a complete continuation letter so the project can continue safely in a new chat without losing the current lock, roadmap, pending GLB branch, and demo/deploy next steps.

## Chapter 74.5 — Final Handoff / Continuation Letter

Status: Passed and locked.

Purpose:

Chapter 74.5 prepares the final continuation letter so the project can continue safely in a new chat without losing the current Six Animal MVP/demo lock, asset roadmap, backend trust rules, and next steps.

This chapter does not change code.

No new feature is added.
No dice physics is changed.
No table anatomy is changed.
No backend/admin/wallet/security logic is changed.
No custom GLB is imported.

### 74.5.1 Current Project Status

Nagani Traditional Six Animal is currently locked as an MVP/demo-ready baseline.

Current accepted state:

* Six Animal live room works end-to-end
* backend controls round timing and result state
* cron runner advances the main room
* player can place bet
* wallet debit works for tested flow
* settlement/payout works for tested flow
* full bet round QA passed
* no-bet round QA passed
* refresh/reconnect QA passed
* result/settlement continuity QA passed
* mobile portrait QA passed
* admin monitor QA passed
* final demo route checklist passed
* current procedural table is accepted as MVP fallback
* current dice are accepted as MVP/demo-ready
* custom royal table GLB branch is paused until real `.glb` exists

### 74.5.2 Locked Rules

Do not casually change:

* dice physics
* dice collider
* dice result detection
* table anatomy
* betting flow
* result board flow
* settlement flow
* backend round functions
* wallet debit/payout logic
* admin security
* RLS policies
* RPC grants
* cron runner logic
* missing custom GLB registry path

Only fix real demo/deploy blockers.

### 74.5.3 Pending Future Branches

Future branches are allowed, but they must be separate:

1. Demo / deploy final verification
2. Custom royal table GLB creation when `.glb` exists
3. Custom dice GLB / final dice material upgrade
4. Final palace room / environment production upgrade
5. Thirty Six parity polish
6. Sound/audio engineering branch later

The current project remains muted for now.

### 74.5.4 Continuation Letter

Use this letter to continue in a new chat:

```txt
Hi X, we are continuing the Nagani Traditional project.

Please read this carefully and continue from the locked project state.

Project:
Nagani Traditional — Myanmar traditional games platform.

Current main focus:
Six Animal / ၆ ကောင်ဂျင် live room.

Current status:
Chapter 74.4 has passed. We are at Chapter 74.5 / Chapter 75 direction.

Six Animal MVP/demo baseline is locked.

Important current lock:
Do not randomly tweak the Six Animal table, dice, physics, result detection, backend, wallet, admin, or betting flow unless fixing a real QA-blocking bug.

Current accepted Six Animal baseline:
- `/six-animal` is backend-connected.
- Backend controls round timing and result state.
- Cron runner advances the main room.
- Player browser does not control final result authority.
- Wallet debit/payout flow passed tested QA.
- Full bet round passed.
- No-bet round passed.
- Refresh/reconnect QA passed.
- During rolling refresh, dice reconstructs the current live stage instead of continuing the exact same physics frame. This is accepted for MVP.
- Result/settlement continuity passed.
- Mobile portrait readability passed.
- Admin monitor QA passed.
- Demo route QA passed.
- Current procedural table is accepted as MVP fallback.
- Current dice are accepted as MVP/demo-ready.
- Project remains muted; sound branch is skipped for now.

Important visual asset lock:
We created and accepted four custom royal table PNG reference views:
- `public/assets/nagani/six-animal/table-models/six-animal-royal-table-v1-front-34.png`
- `public/assets/nagani/six-animal/table-models/six-animal-royal-table-v1-front.png`
- `public/assets/nagani/six-animal/table-models/six-animal-royal-table-v1-left-side.png`
- `public/assets/nagani/six-animal/table-models/six-animal-royal-table-v1-top-front.png`

These are reference images only, not a GLB.

The future custom table GLB path is:
`public/assets/nagani/six-animal/table-models/six-animal-royal-table-v1.glb`

Do not add registry key or import GLB until this real `.glb` file exists.

Current table decision:
The procedural table was cleaned up enough:
- Clean Shot mode works in `/dev/three-dice`.
- Dice can be hidden.
- Result panel can be hidden.
- Deflector bar support was added.
- Holder/backboard supports were added.
- Table feels more connected.
- Stop table tweaking now.

Current dice decision:
Dice are MVP/demo-ready:
- More rounded dice direction accepted.
- Animal faces readable enough.
- Dice body readable enough.
- Rolling is exciting enough.
- No physics/material change needed now.
- Visible physical dice remains player-facing trust layer.

Backend/admin safety:
Admin monitor pages passed:
- `/admin`
- `/admin/six-animal`
- `/admin/backend-health`
- `/admin/financial-integrity`

Main room UUID:
`11111111-1111-1111-1111-111111111111`

Cron runner:
`six-animal-main-room-runner`
Schedule: 5 seconds
Command:
`select public.advance_six_animal_room('11111111-1111-1111-1111-111111111111');`

Required environment variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Do not expose service role key in frontend.

Current accepted limitations:
- Custom GLB royal table is pending.
- Final AAA dice model is pending.
- Sound/audio is skipped.
- Thirty Six parity is not the current lock.
- Current reconnect reconstructs dice stage, not the exact same physics frame.

Recommended next chapter:
Chapter 75 — Final Demo / Deploy Readiness Execution

Suggested order:
1. Final build confirmation.
2. Final route QA.
3. Environment variable verification.
4. Supabase production checklist.
5. Admin account verification.
6. Client-safe demo handoff note.
7. Optional deployment checklist.
8. Stop-tweaking / demo lock.

Please continue with precise chapter-by-chapter instructions. Gary prefers exact code locations and exact edit blocks if code changes are needed. Keep explanations short and focused. Protect the locked Six Animal MVP baseline.
```

### 74.5.5 Acceptance Result

Chapter 74.5 passes because:

* current project state is summarized
* locked MVP/demo baseline is preserved
* pending GLB branch is clearly marked
* table/dice stop-tweaking rule is preserved
* backend/admin/wallet safety rules are preserved
* continuation letter is ready for a new chat
* no risky code change is made

### 74.5.6 Chapter 74 Closeout

Chapter 74 is complete enough.

Completed:

* Chapter 74.1 — Demo / Deploy Readiness Final Prep Plan
* Chapter 74.2 — Final Build / Environment Checklist
* Chapter 74.3 — Demo Route QA Checklist
* Chapter 74.4 — Client-Safe Demo Explanation
* Chapter 74.5 — Final Handoff / Continuation Letter

Current status:

Six Animal MVP/demo baseline is locked and ready for final demo/deploy readiness execution.

Next recommended chapter:

## Chapter 75 — Final Demo / Deploy Readiness Execution

Goal:

Execute final local/demo/deploy readiness steps without changing the locked Six Animal MVP unless a real blocker appears.
