# Nagani Six Animal — Table + Dice Production Roadmap

Version: v0.1  
Project: Nagani Traditional  
Game: ၆ ကောင်ဂျင် / ဂလုန်းဂလုန်း — Six Animal 3D Dice Room  
Status: Chapter 47.1 Roadmap Lock

---

## 1. Purpose

The table and dice are the MVP visual core of the Six Animal room.

The current `/six-animal` room already has:

- mobile-first playable room flow
- 3D dice table foundation
- visible physical dice source-of-truth
- production dice face textures v1
- animal card art v1
- palace background v1
- betting, closed, rolling, result, and settlement flow working

However, the table and dice are not final production quality yet.

The goal of this roadmap is to protect the major table + dice journey before doing more polish.

This document must prevent random small polishing from breaking the larger production direction.

---

## 2. Current Honest State

The current 3D table is useful and functional, but it still feels like prototype geometry.

Current weaknesses:

- table surface feels flat and simple
- lower tray material feels like plain red prototype material
- side rails feel too plain
- front lip feels too plain
- backboard still lacks rich material and carving language
- dice body is improved but still can feel too smooth/plastic
- animal face textures are accepted v1 but need long-term readability protection
- table does not yet fully express Myanmar traditional royal craft
- Kanote ornament is not yet integrated
- final table may eventually need a custom 3D model or hybrid approach

Current strength:

- table anatomy is now understandable
- dice drop/roll/capture foundation works
- physical dice result is visible
- mobile readability is already considered
- source-of-truth rule is protected

---

## 3. Production Direction Lock

The final Six Animal table should feel like:

- real-life ၆ ကောင်ဂျင် / ဂလုန်းဂလုန်း table
- premium Myanmar traditional game object
- dark lacquer wood
- deep red felt or velvet tray
- antique brass / old gold trim
- royal palace furniture language
- restrained ကနုတ် / Kanote ornament
- expensive physical table, not toy model
- readable mobile-first game equipment

Avoid:

- slot machine feeling
- western casino prop feeling
- cartoon toy table
- plastic toy material
- neon cyber style
- overloaded ornament
- busy dice landing surface
- fake result UI replacing physical dice result

---

## 4. Real-Life Table Anatomy Requirements

The Six Animal table should preserve this physical structure:

### 4.1 Upper Dice Holder

Purpose:

- holds three dice above the runway/tray
- makes the player feel dice are physically waiting before drop
- should look like part of a real wooden mechanism

Production direction:

- dark lacquer or polished teak body
- brass/gold trim accents
- stable shelf shape
- not too thick or toy-like
- dice must remain clearly visible from mobile camera

### 4.2 Trapdoor / Flap Holders

Purpose:

- each die rests on a closed flap
- flap opens downward to release dice
- flap should not look like a magic spawn point

Rules:

- flap should feel mechanical and believable
- after dice release, flap behavior must not look suspicious
- no fake teleporting dice
- no after-stop correction

Production direction:

- darker wood panels
- small brass hinge impression
- clean silhouette
- visible enough but not distracting

### 4.3 Backboard / Chute Area

Purpose:

- supports the upper holder
- frames the drop path
- gives the table height and real-life structure

Production direction:

- dark lacquer backboard
- subtle carved royal pattern
- optional Kanote trim
- not too busy behind dice
- must not hide dice faces

### 4.4 Stumble / Deflector Bar

Purpose:

- lightly interrupts dice path
- helps dice tumble naturally
- should not block dice too strongly

Rules:

- should guide, not trap
- should not make dice stop too early
- should not look oversized

Production direction:

- thin antique brass or dark wood with gold edge
- small enough to feel believable
- physics collider must remain safe

### 4.5 Lower Sloped Tray

Purpose:

- main dice landing/rolling area
- most important visual area during rolling/result

Production direction:

- deep red felt / velvet / lacquered cloth feeling
- richer roughness and surface depth
- not flat bright red
- not too reflective
- dice faces must remain readable

Rules:

- no busy ornament on landing surface
- no pattern that hides dice result
- surface must support mobile top-face readability

### 4.6 Side Rails

Purpose:

- contain dice physically
- define the runway/tray shape
- make the table feel like a real object

Production direction:

- dark lacquer wood or black-red polished wood
- antique brass/gold thin rail highlight
- possible subtle Kanote strip outside the landing area

Rules:

- must not block camera visibility
- must not make dice unreadable
- must contain dice without feeling like a cage

### 4.7 Front Lip

Purpose:

- protects dice from leaving tray
- gives strong foreground table silhouette

Production direction:

- heavier lacquer wood
- antique gold trim
- possible restrained Kanote strip
- premium carved furniture feeling

Rules:

- must not hide stopped dice
- must not cover top face too much in mobile view

---

## 5. Dice Production Requirements

The dice are the second half of the MVP.

Current dice direction is accepted enough for prototype:

- rounded cube body
- animal texture faces
- readable enough in `/six-animal`
- result detection working

Final dice should feel more like:

- ivory / bone / aged resin material
- warm polished surface
- physical printed or carved animal face
- premium traditional game dice
- slightly worn but clean
- heavy enough visually
- readable from mobile camera

Avoid:

- emoji dice
- plastic toy dice
- overly glossy cheap material
- over-rounded dice that never settles
- sharp cube that cannot roll naturally
- tiny animal print
- blurry animal print
- suspicious final result correction

---

## 6. Dice Top-Face Readability Rule

The visible top face is the production source of truth.

The player must be able to believe:

> “The result came from the physical dice I watched.”

Rules:

- top face should be readable after dice settles
- dice should not rotate after stopping
- no visible forced correction
- no backend target display if visible dice does not match
- no fake result card replacing dice truth
- result board can summarize only after visible dice is captured
- cocked/tilted result must be handled carefully

Allowed:

- camera readability improvement
- material readability improvement
- face texture size improvement
- lighting improvement
- physical roll tuning inside dev lab
- result capture after visible stop

Not allowed:

- suspicious after-stop spin
- invisible hand rotation
- direct forced top-face snapping
- production target-result completion before natural animation is solved

---

## 7. Myanmar Royal Material Direction

The final table should use this material family:

### Dark Lacquer Wood

Use for:

- table body
- side rails
- backboard
- holder structure
- front lip

Feeling:

- deep red-black lacquer
- polished but not plastic
- royal furniture
- heavy and expensive

### Deep Red Felt / Velvet Tray

Use for:

- dice landing surface
- lower runway floor

Feeling:

- rich red
- soft surface
- not bright flat red
- subtle cloth depth
- dice-friendly readable contrast

### Antique Brass / Old Gold Trim

Use for:

- side rail edge
- tray border
- front lip strip
- holder shelf accent
- small hinge/accent details

Feeling:

- old gold
- warm brass
- slightly worn
- not neon yellow
- not cheap shiny metal

### Teak / Carved Wood Influence

Use for:

- table structure
- decorative carved surfaces
- custom model direction later

Feeling:

- Myanmar traditional furniture
- handmade wooden object
- ceremonial game table

---

## 8. Kanote Ornament Usage Rules

ကနုတ် / Kanote ornament should be used carefully.

Goal:

- communicate Myanmar traditional royal design
- make table feel local and premium
- add cultural richness without hurting gameplay

Allowed placement:

- front lip ornament strip
- side rail outer trim
- backboard subtle carved pattern
- holder shelf accent
- corner ornaments
- table legs or base if visible

Avoid placement:

- dice landing surface
- busy pattern under dice
- top-face reading area
- anything that competes with animal faces
- large high-contrast pattern behind dice

Style:

- restrained
- carved or embossed
- antique gold on dark lacquer
- tone-on-tone pattern acceptable
- should feel integrated into furniture, not pasted sticker

Rule:

Gameplay readability comes before ornament beauty.

---

## 9. Safe Production Phases

## Phase 47 — Research + Reference + Roadmap Lock

Goal:

Lock table/dice direction before code changes.

Tasks:

- document real-life table anatomy
- document material direction
- document Kanote rules
- document safety rules
- protect current working `/six-animal` flow

Code risk:

- none

Acceptance:

- roadmap document created
- no gameplay behavior changed
- build passes

---

## Phase 48 — Table Material System Upgrade

Goal:

Improve table beauty while keeping current geometry and physics.

Scope:

- update material constants in `ThreeDicePhysicsStage.tsx`
- improve tray material
- improve rail material
- improve backboard material
- improve brass/gold trim
- reduce prototype plastic feeling

Must not change:

- physics colliders
- dice result logic
- betting flow
- settlement flow
- backend trust behavior

Expected result:

- same table shape
- richer material
- more premium royal furniture feeling
- lower breaking risk

---

## Phase 49 — Kanote Ornament Layer

Goal:

Add restrained Myanmar traditional ornament.

Scope:

- thin ornament strips
- subtle backboard pattern
- front lip detail
- holder shelf accent
- possibly texture planes or simple geometry

Must not:

- add busy landing surface pattern
- hide dice
- reduce result readability
- hurt mobile portrait view

Expected result:

- table starts to feel Myanmar traditional
- still clean and readable

---

## Phase 50 — Dice Production Material Upgrade

Goal:

Make dice body feel more physical and premium.

Scope:

- ivory/bone material direction
- better roughness/metalness/color tuning
- better lighting response
- preserve animal face readability
- preserve result detection

Must not:

- change source-of-truth rule
- change backend target behavior
- add suspicious correction
- make dice unreadable

Expected result:

- dice feel less toy/plastic
- animal faces remain clear
- table+dice feel closer to production quality

---

## Phase 51 — Dice Shape / Physics Lab Upgrade

Goal:

Test dice shape and physics improvement safely.

Scope:

- only `/dev/three-dice`
- test rounding values
- test dice mass
- test friction/restitution
- test cocked result handling
- test top-face readability

Must not:

- directly change `/six-animal`
- break production room
- force backend target result
- hide mismatch between visible dice and result

Expected result:

- safer dice physics knowledge
- better final dice settings later
- no production risk

---

## Phase 52 — Custom Table Model Decision

Goal:

Decide final table implementation path.

Options:

### Option A — Keep Procedural Table

Pros:

- easier to tune
- easy to keep physics aligned
- fast iteration

Cons:

- may never reach true premium custom model quality

### Option B — Full Custom GLB Table

Pros:

- highest visual quality
- true carved Kanote detail
- better silhouette
- production asset pipeline

Cons:

- collider alignment risk
- heavier asset pipeline
- harder to adjust quickly

### Option C — Hybrid Final Path

Recommended likely direction:

- visible table = beautiful custom GLB model
- physics = simple invisible colliders

Pros:

- best visual quality
- safest physics behavior
- easier result trust
- professional final path

Cons:

- requires careful asset/collider alignment
- needs model export discipline

Decision rule:

Do not choose final custom model path until Phase 48–51 lessons are completed.

---

## 10. Files Involved

Primary file:

- `src/components/games/six-animal/ThreeDicePhysicsStage.tsx`

Related files:

- `src/components/games/six-animal/ThreeDiceSequenceController.tsx`
- `src/app/six-animal/page.tsx`
- `src/lib/naganiAssets.ts`
- `docs/NAGANI_SIX_ANIMAL_PRODUCTION_ASSET_PLAN.md`

Current important table components:

- `TABLE_*` color constants
- `TABLE_MATERIALS`
- `TableRunway()`
- `TableBackboard()`
- `DiceHolderShelf()`
- `TrapdoorFlaps()`
- `StumbleBar()`
- `FrontLip()`
- `TraySideRails()`
- `TableSafetyGuards()`
- `TrayBox()`

---

## 11. What Must Not Break

During all table+dice production work:

- do not break visible physical dice source-of-truth
- do not enable production target-result completion
- do not add suspicious after-stop correction
- do not reopen audio
- do not change backend trust behavior
- do not change wallet logic
- do not change settlement rules
- do not change Six Animal symbol set
- do not bring back Gourd
- do not return to slot/reel design language
- do not change Thirty Six during this branch
- do not reduce mobile portrait readability
- do not hide dice faces behind UI
- do not make result feel fake

---

## 12. QA Checklist After Each Chapter

Test `/six-animal`:

- loading screen still works
- palace background still visible
- betting phase still readable
- betting sheet still usable
- mounted dice still visible
- bets closed phase still stable
- rolling phase still readable
- dice do not visually escape table
- result board still captures visible dice
- settlement still readable
- next round still resets
- mobile portrait still safe

Test `/dev/three-dice` when dice physics changes:

- single drop works
- three dice run works
- top-face detection works
- cocked/tilted state is understandable
- no suspicious after-stop correction
- dice remain visible
- build passes

Build command:

```bash
npm run build
```

---

## 14. Chapter 47.2 — Current Table / Dice Code Audit

Status: Passed

Purpose:

Before changing table or dice visuals, audit the current `ThreeDicePhysicsStage.tsx` structure so production polish can happen safely.

Primary code file:

- `src/components/games/six-animal/ThreeDicePhysicsStage.tsx`

This file currently owns:

- dice visual shape
- dice material
- dice face texture planes
- dice physics body
- table measurements
- table material tokens
- table visible geometry
- table physics colliders
- room/lab camera behavior
- lighting setup
- target correction safety helpers
- visible physical dice result detection

---

### 14.1 Current Dice Visual System

Current dice visual constants:

- `DICE_SIZE`
- `DICE_CORNER_RADIUS`
- `DICE_SMOOTHNESS`
- `DICE_FACE_SURFACE_OFFSET`
- `DICE_FACE_PRINT_SIZE`
- `DICE_FACE_PRINT_ALPHA_TEST`
- `DICE_BODY_COLOR`
- `DICE_BODY_ROUGHNESS`
- `DICE_BODY_METALNESS`
- `DICE_FACE_PLANE_ROUGHNESS`
- `DICE_FACE_PLANE_METALNESS`

Current dice material object:

- `DICE_MATERIALS.ivoryBody`

Current dice visual components:

- `DiceVisual()`
- `DiceFaceLayer()`
- `DiceFaceTexturePlanes()`
- `DiceFaceTexturePlane()`
- `DiceFaceLabels()`

Current dice face texture source:

- `naganiAssets.sixAnimal.dice.faces.base`

Current dice face files expected:

- `dice-face-tiger-v1.png`
- `dice-face-dragon-v1.png`
- `dice-face-rooster-v1.png`
- `dice-face-fish-v1.png`
- `dice-face-crab-v1.png`
- `dice-face-elephant-v1.png`

Production note:

The dice visual system is already separated enough for Chapter 50 dice material polish. Do not change dice physics or result detection during table material work.

---

### 14.2 Current Dice Physics System

Current active dice component:

- `DiceCube()`

Current physics body:

- `RigidBody`
- `RoundCuboidCollider`

Current physics values:

- `restitution={0.44}`
- `friction={0.3}`
- `linearDamping={0.01}`
- `angularDamping={0.016}`
- `ccd`

Current modes:

- `trap`
- `runway`

Production note:

Do not tune dice shape, collider, friction, damping, or velocity during Chapter 48 table material polish. Dice physics changes belong to Chapter 51 and should be tested in `/dev/three-dice` first.

---

### 14.3 Current Result Detection / Trust System

Current result detection:

- `detectTopDiceFace()`
- `VALID_FACE_SCORE_THRESHOLD = 0.82`
- `worldUp = new Vector3(0, 1, 0)`

Current accepted labels:

- Tiger
- Dragon
- Rooster
- Fish
- Crab
- Elephant

Current safety lock:

- `TARGET_CORRECTION_ENABLED = false`

Current target validation helpers:

- `getTargetResultValidation()`
- `getTargetResultCaptureSummary()`
- `getTargetCorrectionSafetyConfig()`
- `getTargetCorrectionReadiness()`

Production note:

This system must not be touched during table/dice visual polish unless the chapter is specifically about detection or cocked dice handling.

The visible physical dice result remains the production source of truth.

---

### 14.4 Current Table Material System

Current raw table color constants:

- `TABLE_RUNWAY_COLOR`
- `TABLE_BACKBOARD_COLOR`
- `TABLE_INNER_PANEL_COLOR`
- `TABLE_BORDER_COLOR`
- `TABLE_TRAPDOOR_CLOSED_COLOR`
- `TABLE_TRAPDOOR_OPEN_COLOR`
- `TABLE_GOLD_ACCENT_COLOR`
- `TABLE_WOOD_ACCENT_COLOR`
- `TABLE_RUNWAY_INSET_COLOR`
- `TABLE_RUNWAY_SHADOW_COLOR`
- `TABLE_GOLD_TRIM_COLOR`
- `TABLE_LACQUER_OUTER_COLOR`
- `TABLE_SIDE_INNER_GLOW_COLOR`
- `TABLE_VELVET_HIGHLIGHT_COLOR`
- `TABLE_SHADOW_GLASS_COLOR`
- `TABLE_BRASS_SHADOW_COLOR`

Current table material object:

- `TABLE_MATERIALS.runwayFelt`
- `TABLE_MATERIALS.runwayInset`
- `TABLE_MATERIALS.backboardLacquer`
- `TABLE_MATERIALS.innerLacquerPanel`
- `TABLE_MATERIALS.holderWood`
- `TABLE_MATERIALS.trapdoorClosed`
- `TABLE_MATERIALS.trapdoorOpen`
- `TABLE_MATERIALS.goldAccent`
- `TABLE_MATERIALS.goldTrim`
- `TABLE_MATERIALS.darkBorder`
- `TABLE_MATERIALS.sideGoldRail`

Production note:

Chapter 48 should start here. The safest first production polish is to improve these material tokens without changing geometry or colliders.

---

### 14.5 Current Table Measurement System

Current table measurement function:

- `createTableMeasurements()`

Current important measurement values:

- `floorWidth = 4.45`
- `floorDepth = 6.75`
- `floorY = -1.05`
- `floorZ = 0.35`
- `slopeAngle = 0.3`
- `backWallZ = backEdgeZ - 0.12`
- `trapdoorZ = backWallZ + 0.82`

Production note:

Do not change these during Chapter 48 material polish. Measurement and anatomy changes should be separate chapters because they can affect dice movement and camera readability.

---

### 14.6 Current Table Anatomy Components

Current table visual/physics components:

- `TableRunway()`
- `TableBackboard()`
- `DiceHolderShelf()`
- `TrapdoorFlaps()`
- `WaitingDiceRack()`
- `StumbleBar()`
- `FrontLip()`
- `TraySideRails()`
- `TableSafetyGuards()`
- `TrayBox()`

Current anatomy is good enough to polish in phases:

1. material first
2. ornament second
3. dice material third
4. shape/physics lab later
5. custom model decision later

Production note:

The table is already componentized enough for safe phased polish. Do not replace the whole table yet.

---

### 14.7 Current Camera / Lighting System

Current room camera constants:

- `ROOM_CAMERA_DEFAULT_TOP_VIEW`
- `ROOM_CAMERA_BASE_HEIGHT`
- `ROOM_CAMERA_BASE_DISTANCE`
- `ROOM_CAMERA_LOOK_Y`
- `ROOM_CAMERA_LOOK_Z`

Current camera component:

- `HumanPOVCameraRig()`

Current scene lighting is inside:

- `DicePhysicsScene()`

Production note:

Lighting may be lightly tuned during material polish if needed, but camera behavior should remain stable unless a chapter is specifically about readability.

---

### 14.8 Chapter 47.2 Acceptance Checklist

Chapter 47.2 is complete when:

- current dice visual system is documented
- current dice physics system is documented
- current result detection/trust system is documented
- current table material system is documented
- current table measurement system is documented
- current table anatomy components are documented
- current camera/light ownership is documented
- no gameplay code has changed
- no visual code has changed
- `npm run build` passes

---

## 15. Chapter 48 — Table Material System Upgrade Lock

Status: Passed

Purpose:

Chapter 48 upgraded the existing procedural table material system without changing table geometry, physics colliders, dice physics, result detection, settlement logic, backend trust behavior, or mobile room flow.

This phase intentionally focused on low-breaking-risk visual polish.

---

### 15.1 Chapter 48.1 — Table Material System First Pass

Status: Passed

Updated file:

- `src/components/games/six-animal/ThreeDicePhysicsStage.tsx`

Main changes:

- darkened the table color family
- shifted the table away from bright prototype red
- made the tray feel closer to deep red felt / velvet
- made rails and borders feel more like dark lacquer wood
- changed gold trim toward warmer antique brass
- kept all geometry and colliders unchanged

Result:

The table became darker, warmer, less toy-like, and closer to Myanmar royal furniture direction.

---

### 15.2 Chapter 48.2 — Table Surface Depth / Felt Highlight Layer

Status: Passed

Updated file:

- `src/components/games/six-animal/ThreeDicePhysicsStage.tsx`

Main changes:

- added visual-only runway center glow
- added visual-only rear shadow near chute/backboard
- added visual-only side depth near rails
- extended `TableMaterialToken` to support transparent/opacity material tokens
- kept landing surface clean and readable

Result:

The lower tray no longer feels like one flat red slab. It now has subtle felt/velvet depth while preserving dice readability.

Safety:

- no collider changes
- no dice physics changes
- no result logic changes

---

### 15.3 Chapter 48.3 — Lacquer Rail / Front Lip Material Depth

Status: Passed

Updated file:

- `src/components/games/six-animal/ThreeDicePhysicsStage.tsx`

Main changes:

- added `FrontLipLacquerDepth()`
- added `TrayRailLacquerDepth()`
- added visual-only lacquer sheen on side rails
- added visual-only outer rail shadow
- added visual-only front lip sheen and bottom shadow

Result:

The side rails and front lip now feel heavier and more physical. The table frame feels less blocky and more like polished lacquer furniture.

Safety:

- `TrayRailLacquerDepth()` is called inside `TraySideRails()`
- no stray JSX outside component functions
- no collider changes
- no dice physics changes

---

### 15.4 Chapter 48.4 — Backboard / Holder Material Depth

Status: Passed

Updated file:

- `src/components/games/six-animal/ThreeDicePhysicsStage.tsx`

Main changes:

- added `TableBackboardDepth()`
- added `DiceHolderShelfDepth()`
- added subtle backboard lacquer sheen
- added lower backboard shadow
- added holder shelf brass edge
- added holder shelf underside shadow

Result:

The upper dice holder and backboard now feel less flat and more connected to the table as a real wooden mechanism.

Safety:

- no trapdoor behavior changes
- no dice holder position changes
- no dice waiting logic changes
- no colliders changed

---

### 15.5 Current Phase 48 Accepted Result

The table material direction is now accepted as the first production material pass.

Accepted visual direction:

- dark lacquer table body
- deep red felt / velvet tray
- antique brass / old gold trim
- heavier front lip
- richer side rails
- deeper backboard
- more physical dice holder shelf

The table is still procedural geometry, but the material language is now closer to the final Myanmar royal table direction.

---

### 15.6 What Phase 48 Did Not Change

Phase 48 did not change:

- dice result detection
- dice physics
- dice collider
- dice size
- dice face texture mapping
- table measurements
- table colliders
- trapdoor mechanics
- room timer
- betting flow
- settlement flow
- backend trust rules
- target-result safety lock
- production source-of-truth rule

Important:

The visible physical dice result remains the production source of truth.

---

### 15.7 Chapter 48 Lock Checklist

Chapter 48 is locked when:

- `/dev/three-dice` table still renders correctly
- `/six-animal` betting phase still renders correctly
- mounted dice remain readable
- bets closed phase still looks stable
- rolling phase still works
- dice do not visually escape the table
- result board still captures visible dice
- settlement still remains readable
- mobile portrait layout remains safe
- `npm run build` passes

---

### 15.8 Next Phase

Next phase:

## Phase 49 — Kanote Ornament Layer

Goal:

Add restrained Myanmar ကနုတ် / Kanote ornament carefully on top of the improved material system.

Allowed first targets:

- front lip ornament strip
- side rail outer trim
- backboard subtle pattern
- holder shelf accent

Do not place ornament on:

- dice landing surface
- dice top-face readability area
- busy area behind animal faces

Rule:

Gameplay readability comes before ornament beauty.

---

## 16. Chapter 49.1 — Kanote Ornament Direction / Safe Pattern Plan

Status: Passed

Purpose:

Chapter 49 starts the Myanmar traditional ornament layer for the Six Animal table.

The goal is not to decorate everything. The goal is to make the table feel like a premium Myanmar royal game object while keeping dice readability and physical result trust safe.

Kanote ornament must support the table. It must not compete with the dice.

---

### 16.1 Kanote Visual Direction

The Kanote direction should feel:

- Myanmar traditional
- royal furniture inspired
- carved or embossed
- antique gold on dark lacquer
- restrained and elegant
- integrated into the table body
- ceremonial, not casino-slot decoration

The ornament should feel like it belongs to:

- palace furniture
- lacquerware
- carved teak
- royal trim
- handmade traditional craft

Avoid:

- neon gold pattern
- flat sticker feeling
- western casino filigree
- slot-machine border decoration
- over-detailed pattern everywhere
- bright pattern under the dice
- cartoon Myanmar pattern
- random generic floral clipart feeling

---

### 16.2 Safe Ornament Placement

Allowed first placement targets:

1. Front lip ornament strip

   This is the safest and strongest first target.

   Reason:

   - visible in mobile portrait
   - does not sit under dice
   - helps table feel crafted
   - can be thin and elegant
   - low risk to result readability

2. Side rail outer trim

   Reason:

   - reinforces table silhouette
   - visible from angled views
   - does not cover landing surface
   - can be subtle and repeated

3. Backboard subtle pattern

   Reason:

   - gives royal furniture feeling
   - supports upper table anatomy
   - should be low-contrast
   - should not distract from waiting dice

4. Holder shelf accent

   Reason:

   - small detail near dice mechanism
   - makes upper holder feel crafted
   - should stay minimal

---

### 16.3 Forbidden Ornament Placement

Do not place Kanote ornament on:

- main dice landing surface
- center runway/felt area
- area directly under stopped dice
- any surface that affects top-face readability
- bright high-contrast area behind animal faces
- moving trapdoor surfaces during early ornament pass
- dice face textures
- result board as part of this phase

Reason:

The physical dice result is the source of truth. Ornament must never make the visible dice result harder to read.

---

### 16.4 Pattern Strength Rule

Kanote should use a three-level strength system.

### Level 1 — Very Subtle

Use for:

- backboard pattern
- side rail secondary detail
- holder shelf shadow detail

Visual strength:

- low opacity
- dark gold / bronze
- tone-on-tone acceptable
- visible only as premium detail

### Level 2 — Clear Accent

Use for:

- front lip ornament strip
- side rail outer trim

Visual strength:

- readable antique gold
- thin geometry or texture strip
- still secondary to dice

### Level 3 — Hero Ornament

Do not use yet.

Reason:

Hero ornament can easily become too busy. It should wait until after the table model direction is more mature.

---

### 16.5 First Implementation Recommendation

The safest first code implementation should be:

## Chapter 49.2 — Front Lip Kanote Strip First Pass

Target:

- front lip only

Recommended approach:

- add a visual-only thin ornament strip
- use simple repeated small gold shapes or a texture-like geometry pattern
- keep it outside dice landing surface
- do not touch colliders
- do not touch physics
- do not touch result logic

Why front lip first:

- safest visible location
- strongest mobile impact
- low gameplay risk
- easy to remove or tune
- helps table look more culturally specific immediately

---

### 16.6 Kanote Implementation Safety Rules

During Phase 49:

- ornament must be visual-only
- no physics collider changes
- no dice movement changes
- no table measurement changes unless explicitly planned
- no busy pattern under dice
- no high-contrast ornament near top-face result
- no change to source-of-truth rule
- no backend target-result behavior
- no sound/audio changes
- no settlement or betting changes

---

### 16.7 Visual Acceptance Checklist

Kanote ornament is accepted only if:

- table feels more Myanmar traditional
- table feels more premium
- dice remain easy to read
- animal face textures remain clear
- result does not feel fake
- mobile portrait remains clean
- ornament does not look pasted randomly
- ornament does not feel like slot-machine border art
- build passes

---

### 16.8 Chapter 49.1 Acceptance Checklist

Chapter 49.1 is complete when:

- Kanote visual direction is documented
- safe placement targets are documented
- forbidden placement areas are documented
- pattern strength rule is documented
- first implementation target is selected
- safety rules are documented
- no visual code has changed
- no gameplay code has changed
- `npm run build` passes

---

## 17. Chapter 49 — Kanote Ornament Layer Lock

Status: Passed

Purpose:

Chapter 49 added restrained Myanmar ကနုတ် / Kanote-inspired ornament to the Six Animal table.

The goal was to make the table feel more like a premium Myanmar royal game object without making the dice area noisy or reducing result readability.

This phase intentionally avoided ornament on the main dice landing surface.

---

### 17.1 Chapter 49.1 — Kanote Ornament Direction / Safe Pattern Plan

Status: Passed

Updated file:

- `docs/NAGANI_SIX_ANIMAL_TABLE_DICE_PRODUCTION_ROADMAP.md`

Main decisions:

- Kanote must feel Myanmar traditional, royal, carved, and restrained
- ornament must support the table, not compete with the dice
- front lip is the safest first ornament target
- side rail trim is allowed if subtle
- backboard pattern must stay low contrast
- holder shelf accent must stay minimal
- no ornament on dice landing surface

Rule:

Gameplay readability comes before ornament beauty.

---

### 17.2 Chapter 49.2 — Front Lip Kanote Strip First Pass

Status: Passed

Updated file:

- `src/components/games/six-animal/ThreeDicePhysicsStage.tsx`

Main changes:

- added `kanoteGold`
- added `kanoteSoftShadow`
- added `FrontLipKanoteStrip()`
- placed a thin antique-gold ornament strip on the front lip

Result:

The front lip now has the first clear Myanmar traditional craft detail while staying outside the dice landing area.

Safety:

- no collider changes
- no dice physics changes
- no result logic changes
- no betting or settlement changes

---

### 17.3 Chapter 49.3 — Side Rail Kanote Trim First Pass

Status: Passed

Updated file:

- `src/components/games/six-animal/ThreeDicePhysicsStage.tsx`

Main changes:

- added `TraySideRailKanoteTrim()`
- placed small repeated antique-gold motifs on side rail outer areas
- kept motifs away from the center tray surface

Result:

The side rails now share the same crafted ornament language as the front lip.

Safety:

- `TraySideRailKanoteTrim()` is called inside `TraySideRails()`
- no stray JSX outside component functions
- no collider changes
- no dice physics changes

---

### 17.4 Chapter 49.4 — Backboard Subtle Kanote Pattern

Status: Passed

Updated file:

- `src/components/games/six-animal/ThreeDicePhysicsStage.tsx`

Main changes:

- added `kanoteBackboardGhost`
- added `TableBackboardKanotePattern()`
- placed a very low-opacity ornament band on the backboard

Result:

The backboard now has quiet royal craft detail without fighting the waiting dice.

Safety:

- pattern is low contrast
- pattern does not sit under dice
- waiting dice remain readable
- no collider changes
- no physics changes

---

### 17.5 Chapter 49.5 — Holder Shelf Accent / Mechanism Detail

Status: Passed

Updated file:

- `src/components/games/six-animal/ThreeDicePhysicsStage.tsx`

Main changes:

- added `DiceHolderShelfKanoteAccent()`
- added small brass hinge/mechanism impressions
- added a subtle holder front ornament strip

Result:

The upper dice holder now feels more like a crafted dice release mechanism instead of a plain shelf.

Safety:

- no trapdoor behavior changes
- no dice release timing changes
- no collider changes
- no physics changes

---

### 17.6 Current Phase 49 Accepted Result

The Kanote ornament layer is accepted as a first production pass.

Accepted visual direction:

- restrained antique-gold ornament
- front lip craft detail
- side rail outer trim
- subtle backboard pattern
- small holder shelf mechanism accents
- no ornament on the landing surface
- dice readability protected

The table now feels more culturally specific and closer to Myanmar royal furniture direction.

---

### 17.7 What Phase 49 Did Not Change

Phase 49 did not change:

- dice result detection
- dice physics
- dice collider
- dice size
- dice face texture mapping
- table measurements
- table colliders
- trapdoor mechanics
- room timer
- betting flow
- settlement flow
- backend trust rules
- target-result safety lock
- production source-of-truth rule

Important:

The visible physical dice result remains the production source of truth.

---

### 17.8 Chapter 49 Lock Checklist

Chapter 49 is locked when:

- `/dev/three-dice` table still renders correctly
- `/six-animal` betting phase still renders correctly
- mounted dice remain readable
- bets closed phase still looks stable
- rolling phase still works
- dice do not visually escape the table
- result board still captures visible dice
- settlement still remains readable
- mobile portrait layout remains safe
- Kanote ornament does not look like slot-machine decoration
- Kanote ornament does not cover the dice landing surface
- `npm run build` passes

---

### 17.9 Next Phase

Next phase:

## Phase 50 — Dice Production Material Upgrade

Goal:

Make the dice body feel more physical and premium without changing dice physics or result detection.

Allowed first targets:

- ivory/bone body material
- warmer surface response
- less plastic shine
- better animal face readability
- subtle print integration

Do not change yet:

- dice collider
- dice size
- dice corner radius
- dice mass/friction/damping
- result detection threshold
- backend target-result safety lock

Rule:

Dice material can improve now. Dice shape and physics changes wait for Phase 51.

---

## 18. Chapter 50.1 — Dice Material Direction / Safe Upgrade Plan

Status: Passed

Purpose:

Chapter 50 begins the dice production material upgrade.

The dice are the most important trust object in the Six Animal room because the visible physical dice result is the production source of truth.

The goal is to improve dice material quality without changing dice physics, dice shape, result detection, or backend trust behavior.

---

### 18.1 Current Dice State

Current accepted dice state:

- rounded cube dice body
- six animal face textures wired
- Tiger, Dragon, Rooster, Fish, Crab, Elephant faces visible
- mounted dice display variety works
- dice top-face detection works
- visible physical dice result is captured
- dice readability is acceptable enough for current prototype

Current weakness:

- dice body still feels a little plastic / synthetic
- dice surface can feel too plain
- animal face print can feel like a flat sticker
- material does not yet fully feel like premium traditional physical dice

---

### 18.2 Final Dice Material Direction

The final dice should feel like:

- ivory
- bone
- aged resin
- warm polished traditional game dice
- slightly heavy
- slightly worn but clean
- handcrafted
- premium physical object
- readable under palace lighting

The dice should not feel like:

- plastic toy cube
- emoji dice
- slot-game icon cube
- cheap glossy object
- flat sticker cube
- overly dirty old object
- unreadable antique prop

---

### 18.3 Dice Body Material Direction

The dice body should move toward:

- warmer ivory color
- softer surface highlight
- less flat yellow body
- slightly deeper warm tone in shadows
- subtle aged material feeling
- low metalness
- medium roughness
- controlled gloss

Allowed material changes:

- body color
- roughness
- metalness
- emissive warmth
- subtle lighting response

Not allowed yet:

- dice size change
- dice corner radius change
- dice collider change
- dice mass change
- friction change
- restitution change
- damping change
- result detection threshold change

Reason:

Dice material polish is low risk. Dice shape and physics changes are higher risk and belong to Phase 51.

---

### 18.4 Dice Face Print Direction

Animal face prints should feel more integrated into the dice surface.

Direction:

- clear animal image
- warm ink / engraved print feeling
- not too black
- not too faded
- not too shiny
- not too small
- readable on mobile portrait
- readable while dice is stopped at a slight tilt

Allowed changes:

- face plane roughness
- face plane metalness
- alpha test tuning
- print size tuning only if necessary
- tone mapping choice only if readability improves

Do not change yet:

- face asset paths
- animal-to-axis mapping
- face position mapping
- result detection logic
- dice top-face candidate labels

---

### 18.5 Dice Readability Rule

Dice material upgrade is accepted only if top faces remain easy to read.

Readability priority:

1. top face result clarity
2. animal identity clarity
3. believable physical dice material
4. visual beauty

Beauty must not reduce trust.

The player must still believe:

> “I can see the real dice result clearly.”

---

### 18.6 Safe First Implementation Recommendation

The safest first code implementation should be:

## Chapter 50.2 — Ivory Dice Body Material First Pass

Target:

- `DICE_BODY_COLOR`
- `DICE_BODY_ROUGHNESS`
- `DICE_BODY_METALNESS`
- `DICE_MATERIALS.ivoryBody`

Recommended direction:

- shift dice body from flat pale yellow toward warmer ivory
- slightly reduce cheap shine
- keep enough highlight so dice feels polished
- keep animal face contrast strong
- do not change dice geometry or collider

Expected result:

- dice feels less plastic
- dice feels more physical
- animal faces remain readable
- dice result detection remains untouched

---

### 18.7 Phase 50 Safety Rules

During Phase 50:

- do not change dice collider
- do not change dice size
- do not change dice corner radius
- do not change dice physics
- do not change result detection threshold
- do not change animal face mapping
- do not change backend target-result safety lock
- do not add suspicious correction
- do not change table colliders
- do not change betting or settlement logic

Important:

Visible physical dice result remains the production source of truth.

---

### 18.8 Chapter 50.1 Acceptance Checklist

Chapter 50.1 is complete when:

- dice material direction is documented
- dice body direction is documented
- dice face print direction is documented
- readability rule is documented
- safe first implementation target is selected
- Phase 50 safety rules are documented
- no visual code has changed
- no gameplay code has changed
- `npm run build` passes

---

## 19. Chapter 50 — Dice Production Material Upgrade Lock

Status: Passed

Purpose:

Chapter 50 upgraded the visual material quality of the Six Animal dice without changing dice physics, dice collider, dice shape, face mapping, result detection, backend trust behavior, betting flow, or settlement flow.

The dice are the most important trust object in the game because the visible physical dice result remains the production source of truth.

---

### 19.1 Chapter 50.1 — Dice Material Direction / Safe Upgrade Plan

Status: Passed

Updated file:

- `docs/NAGANI_SIX_ANIMAL_TABLE_DICE_PRODUCTION_ROADMAP.md`

Main decisions:

- dice should move toward ivory / bone / aged resin material
- dice should feel like premium traditional physical game dice
- dice face prints should feel integrated, not like stickers
- readability is more important than beauty
- dice material can improve now
- dice shape and physics changes must wait for Phase 51

Rule:

The player must clearly believe:

> “I can see the real physical dice result.”

---

### 19.2 Chapter 50.2 — Ivory Dice Body Material First Pass

Status: Passed

Updated file:

- `src/components/games/six-animal/ThreeDicePhysicsStage.tsx`

Main changes:

- shifted dice body color toward warmer ivory
- increased roughness for less plastic shine
- reduced metalness
- softened emissive warmth

Result:

Dice body feels less flat yellow and closer to warm ivory / aged resin.

Safety:

- no dice size change
- no dice corner radius change
- no collider change
- no physics change
- no result detection change

---

### 19.3 Chapter 50.2B — Room Camera Side View Expansion

Status: Passed

Updated file:

- `src/components/games/six-animal/ThreeDicePhysicsStage.tsx`

Main changes:

- expanded left/right drag range
- increased side camera shift
- increased side look shift
- kept default front camera unchanged

Result:

Players can now drag farther left/right to see the polished table, side rails, front lip ornament, and table depth better.

Safety:

- no dice physics change
- no table collider change
- no result logic change
- no default view break

---

### 19.4 Chapter 50.3 — Dice Face Print Integration / Readability Polish

Status: Passed

Updated file:

- `src/components/games/six-animal/ThreeDicePhysicsStage.tsx`

Main changes:

- slightly increased dice face print size
- increased alpha test for cleaner print edge
- added face print opacity
- added warm tint to face planes
- increased face plane roughness

Result:

Animal face prints feel warmer and more integrated into the ivory dice body while remaining readable.

Safety:

- no face asset path change
- no animal-to-axis mapping change
- no dice face position change
- no result detection change

---

### 19.5 Chapter 50.4 — Dice Body Subtle Highlight Polish

Status: Passed

Updated file:

- `src/components/games/six-animal/ThreeDicePhysicsStage.tsx`

Main changes:

- extended `DiceMaterialToken` for clearcoat settings
- added controlled clearcoat to dice body
- switched dice body from `meshStandardMaterial` to `meshPhysicalMaterial`

Result:

Dice now has a more premium polished ivory / aged resin surface without becoming mirror-glossy plastic.

Safety:

- no dice geometry change
- no dice collider change
- no physics change
- no face mapping change
- no result detection change

---

### 19.6 Current Phase 50 Accepted Result

The dice material direction is accepted as the first production material pass.

Accepted visual direction:

- warmer ivory / aged resin dice body
- softer surface shine
- less plastic feeling
- integrated warm animal face prints
- stronger premium physical object feeling
- mobile readability preserved

The dice still use the same shape, collider, physics, and top-face detection foundation.

---

### 19.7 What Phase 50 Did Not Change

Phase 50 did not change:

- dice size
- dice corner radius
- dice collider
- dice physics
- dice mass
- dice friction
- dice restitution
- dice damping
- dice face mapping
- dice result detection threshold
- table colliders
- trapdoor mechanics
- betting flow
- settlement flow
- backend trust rules
- target-result safety lock
- production source-of-truth rule

Important:

The visible physical dice result remains the production source of truth.

---

### 19.8 Chapter 50 Lock Checklist

Chapter 50 is locked when:

- `/dev/three-dice` dice still render correctly
- `/six-animal` mounted dice remain readable
- rolling dice faces remain readable
- stopped top face remains readable
- result board still captures visible dice
- dice do not visually feel too glossy
- dice do not look like cheap plastic
- animal face prints remain clear
- mobile portrait layout remains safe
- expanded side camera still feels controlled
- `npm run build` passes

---

### 19.9 Next Phase

Next phase:

## Phase 51 — Dice Shape / Physics Lab Upgrade

Goal:

Research better dice rolling behavior safely inside `/dev/three-dice` only.

Allowed first targets:

- dice shape research
- rounding amount research
- collider/visual relationship audit
- cocked result behavior review
- settle/readability testing
- runway/trap drop behavior testing

Do not directly change `/six-animal` yet.

Reason:

Dice shape and physics changes can affect trust. They must be tested in the isolated dice lab before touching the production room.

Rule:

Natural physical dice result is better than suspicious forced result.

---

## 20. Chapter 51.1 — Dice Shape / Physics Lab Research Plan

Status: Passed

Purpose:

Chapter 51 begins dice shape and physics research.

This phase is higher risk than material polish because dice shape, collider, friction, restitution, damping, and settle behavior can affect result trust.

All dice shape and physics research must happen inside `/dev/three-dice` first.

Do not directly change `/six-animal` production room during early Chapter 51.

---

### 20.1 Why This Phase Is High Risk

Dice shape and physics affect:

- how dice drops
- how dice bounces
- how dice rolls
- how long dice spins
- whether dice gets stuck near borders
- whether dice lands cocked
- whether top face is readable
- whether result feels natural
- whether players trust the result

A beautiful dice shape is not enough.

The dice must:

- roll naturally
- stop naturally
- show a readable top face
- avoid suspicious correction
- avoid invisible forced result behavior

---

### 20.2 Current Dice Shape State

Current accepted dice state:

- visual dice body uses `RoundedBox`
- current size is stable
- current corner radius is stable enough
- current collider is stable enough
- current dice can drop, roll, settle, and produce a detected top face
- current `/six-animal` production room is working

Current known weakness:

- dice can still sometimes feel too smooth or too controlled
- dice shape may not be final real-life dice quality
- current collider/visual relationship may not perfectly match a real rounded dice
- cocked/tilted cases still need future handling polish
- current physics is good enough for demo but not final production realism

---

### 20.3 Research Goals

The goal of Chapter 51 is to learn the safest final dice shape/physics direction.

Research should answer:

1. How much rounding is best?

   Too little rounding:

   - dice feels like a cube block
   - rolling can feel stiff
   - impact can feel unnatural

   Too much rounding:

   - dice may spin too long
   - dice may not settle cleanly
   - dice may stop at hard-to-read angles
   - result can feel unstable

2. What collider shape is safest?

   Current collider must be reviewed against the visual dice body.

   The collider should support:

   - believable bounce
   - believable rolling
   - readable settle
   - no frequent cocked stops

3. What physics values should be tested?

   Candidate values:

   - restitution
   - friction
   - linear damping
   - angular damping
   - gravity
   - initial drop velocity
   - initial angular velocity

4. How should cocked dice be handled?

   Future handling must be honest and visible.

   Allowed:

   - detect cocked result
   - show waiting / reroll-needed state in lab
   - research physical reroll logic
   - improve borders to reduce cocked stops

   Not allowed:

   - invisible after-stop correction
   - forced top-face snapping
   - hiding mismatch from player
   - backend target override in production

---

### 20.4 Lab-Only Rule

All Chapter 51 dice physics experiments must happen in:

- `/dev/three-dice`

Do not change production `/six-animal` until a tested setting is proven safe.

Reason:

The live Six Animal room already has:

- working betting flow
- working rolling flow
- working result board
- working settlement
- trusted visible physical dice result
- accepted material/table polish

Breaking it now would be expensive.

---

### 20.5 Safe Experiment Categories

Allowed lab experiments:

- dice corner radius experiments
- visual dice shape experiments
- collider size experiments
- collider radius experiments
- restitution tests
- friction tests
- damping tests
- drop energy tests
- bounce containment tests
- top-face confidence review
- cocked result frequency review

Do not change in production:

- `/six-animal` dice behavior
- backend trust rules
- settlement rules
- result capture rule
- target-result safety lock

---

### 20.6 Recommended Chapter 51 Sequence

Recommended next steps:

## Chapter 51.2 — Current Dice Shape / Physics Audit

Goal:

Document current dice shape, collider, and physics values before testing.

Audit file:

- `src/components/games/six-animal/ThreeDicePhysicsStage.tsx`

Focus:

- `DICE_SIZE`
- `DICE_CORNER_RADIUS`
- `DICE_SMOOTHNESS`
- `RoundCuboidCollider`
- `restitution`
- `friction`
- `linearDamping`
- `angularDamping`
- trap mode velocity
- runway mode velocity
- settle threshold
- face confidence threshold

No code behavior change.

---

## Chapter 51.3 — Lab Test Controls Plan

Goal:

Plan safe lab-only controls for comparing dice physics settings.

Possible controls:

- shape preset
- collider preset
- friction preset
- bounce preset
- damping preset
- reset/run test button
- result/cocked counter

Do not add controls to `/six-animal`.

---

## Chapter 51.4 — Rounded Dice Shape Lab Test

Goal:

Test dice corner radius / smoothness in `/dev/three-dice`.

Do not apply to `/six-animal`.

---

## Chapter 51.5 — Collider Relationship Lab Test

Goal:

Compare visual rounded dice shape against collider behavior.

Do not apply to `/six-animal`.

---

## Chapter 51.6 — Cocked Result Frequency Review

Goal:

Check how often dice lands unreadable under tested physics settings.

Do not apply to `/six-animal` until safe.

---

## Chapter 51.7 — Lab Result Lock / Production Candidate Decision

Goal:

Select a safe candidate configuration or decide to keep current production settings.

Only after this can production room integration be considered.

---

### 20.7 Production Safety Rules

During Chapter 51:

- do not directly change `/six-animal`
- do not change production dice source-of-truth
- do not enable backend target-result completion
- do not add suspicious correction
- do not rotate dice after stop
- do not hide cocked/mismatch behavior
- do not change settlement logic
- do not change wallet logic
- do not reopen sound/audio
- do not change Thirty Six

Rule:

A natural miss is safer than a suspicious forced result.

---

### 20.8 Chapter 51.1 Acceptance Checklist

Chapter 51.1 is complete when:

- dice shape/physics risk is documented
- lab-only rule is documented
- current dice state is documented
- research goals are documented
- safe experiment categories are documented
- Chapter 51 sequence is documented
- production safety rules are documented
- no visual code has changed
- no gameplay code has changed
- `npm run build` passes

---

## 21. Chapter 51.2 — Current Dice Shape / Physics Audit

Status: Passed

Purpose:

Chapter 51.2 documents the current dice shape, collider, physics, drop, settle, and detection baseline before any lab experiments begin.

This is important because the current production dice behavior is already working. Any future shape or physics experiment must be compared against this baseline.

No code behavior was changed in this chapter.

---

### 21.1 Primary File Audited

Primary file:

- `src/components/games/six-animal/ThreeDicePhysicsStage.tsx`

This file currently controls:

- dice visual shape
- dice body material
- dice face texture planes
- dice collider
- dice initial position
- dice initial velocity
- dice initial angular velocity
- settle detection
- top-face detection
- lab/room camera behavior
- table colliders
- trapdoor/table anatomy

---

### 21.2 Current Dice Visual Shape Baseline

Current dice visual constants:

```ts
const DICE_SIZE = 1.08;
const DICE_CORNER_RADIUS = 0.26;
const DICE_SMOOTHNESS = 16;
```

---

## 22. Chapter 51.3 — Lab Test Controls Plan

Status: Passed

Purpose:

Chapter 51.3 plans the lab-only dice shape and physics testing controls.

This chapter does not add controls yet. It defines what controls are safe, what they should compare, and what must stay out of `/six-animal`.

All controls planned here are for:

- `/dev/three-dice`

Not for:

- `/six-animal`

Reason:

Production Six Animal already works. Shape and physics experiments must not leak into the player room until proven safe.

---

### 22.1 Lab Control Goal

The goal of lab controls is to compare dice behavior safely.

Controls should help answer:

- does this dice shape roll more naturally?
- does this collider match the visual dice better?
- does this friction value stop too fast or too slowly?
- does this bounce value feel believable?
- does this damping value make dice settle cleanly?
- does this setting create more cocked results?
- does this setting keep the top face readable?

The controls are not for forcing results.

They are only for physics research.

---

### 22.2 Controls Must Stay Lab-Only

Allowed route:

- `/dev/three-dice`

Forbidden route:

- `/six-animal`

Do not expose experiment controls to real players.

Do not add:

- shape preset selector to `/six-animal`
- friction selector to `/six-animal`
- target correction selector to `/six-animal`
- debug physics toggle to `/six-animal`
- backend target control to `/six-animal`

Production room must stay clean and trustworthy.

---

### 22.3 Recommended Lab Controls

Recommended first lab controls:

### Shape Preset

Purpose:

Compare visual dice rounding.

Possible options:

- Current
- Softer Round
- More Round
- Test Extreme

Controls:

- visual corner radius
- visual smoothness

Safety:

This must only affect lab test dice until approved.

---

### Collider Preset

Purpose:

Compare collider behavior against visual dice shape.

Possible options:

- Current
- Tighter
- Softer
- Experimental

Controls:

- collider half extents
- collider round radius

Safety:

Collider changes can strongly affect result behavior. Lab only.

---

### Surface / Friction Preset

Purpose:

Compare how dice interacts with tray surface.

Possible options:

- Current
- More Grip
- Less Grip
- Slower Settle

Controls:

- dice friction
- possibly tray friction later if needed

Safety:

Do not make dice slide unnaturally or stop instantly.

---

### Bounce Preset

Purpose:

Compare impact and bounce realism.

Possible options:

- Current
- Softer Bounce
- More Bounce
- Heavy Dice Feel

Controls:

- restitution

Safety:

Too much bounce can make dice look like a toy. Too little bounce can feel dead.

---

### Damping Preset

Purpose:

Compare settle behavior.

Possible options:

- Current
- Longer Roll
- Cleaner Stop
- Heavy Stop

Controls:

- linear damping
- angular damping

Safety:

Too much damping feels fake. Too little damping can spin too long.

---

### Drop Energy Preset

Purpose:

Compare initial drop force and spin.

Possible options:

- Current
- Softer Drop
- Stronger Tumble
- Heavier Drop

Controls:

- trap mode linear velocity
- trap mode angular velocity
- runway mode velocity only in research mode

Safety:

Dice should drop mostly downward first. It should not fly sideways in the air.

---

### Result Review Counters

Purpose:

Track result quality across repeated tests.

Possible counters:

- total runs
- accepted results
- cocked results
- average confidence
- lowest confidence
- average settle time
- longest settle time

Safety:

Counters are for research only. Do not show them in production.

---

### 22.4 Controls Not Allowed

Do not add controls for:

- forced target result in production
- after-stop rotation
- direct quaternion snapping
- backend result override
- hidden result correction
- fake top-face display
- automatic mismatch hiding

Reason:

These reduce trust and can make the game feel suspicious.

---

### 22.5 Recommended UI Layout For Lab Controls

The `/dev/three-dice` lab controls should stay simple.

Suggested layout:

- left or top control panel
- preset buttons/selectors
- current setting summary
- run/reset button
- result confidence display
- cocked/accepted summary
- production safety warning

The warning should clearly say:

> Lab only. Production `/six-animal` remains unchanged.

---

### 22.6 First Implementation Recommendation

The safest first implementation should be:

## Chapter 51.4 — Lab Shape Preset Control Foundation

Goal:

Add a lab-only shape preset control to `/dev/three-dice`.

Initial scope:

- add preset state in the dev page/controller
- pass preset into `ThreeDicePhysicsStage`
- apply only when `variant === "lab"`
- keep `/six-animal` unchanged
- start with visual dice radius/smoothness only if safe

Do not change production room.

---

### 22.7 Lab Control Acceptance Rules

A lab control is accepted only if:

- it appears only in `/dev/three-dice`
- it does not affect `/six-animal`
- default preset matches current production baseline
- current behavior is still available
- build passes
- dice result detection still works
- no suspicious correction is introduced

---

### 22.8 Chapter 51.3 Acceptance Checklist

Chapter 51.3 is complete when:

- lab-only control goal is documented
- recommended controls are documented
- forbidden controls are documented
- lab UI layout direction is documented
- first implementation target is selected
- production safety warning is documented
- no visual code has changed
- no gameplay code has changed
- `npm run build` passes

---

## 23. Chapter 51.5 — Collider Relationship Lab Plan

Status: Passed

Purpose:

Chapter 51.5 plans how to test the relationship between the visible rounded dice shape and the physics collider.

This chapter is documentation-only.

No collider value is changed yet.

Reason:

The dice can look beautiful, but if the collider does not match the visible body well enough, players may feel the roll is strange, unreadable, or suspicious.

Collider testing must happen only in:

* `/dev/three-dice`

Do not apply collider changes directly to:

* `/six-animal`

---

### 23.1 Current Collider Baseline

Current dice visual baseline:

```ts
const DICE_SIZE = 1.08;
const DICE_CORNER_RADIUS = 0.26;
const DICE_SMOOTHNESS = 16;
```

Current dice collider baseline:

```tsx
<RoundCuboidCollider args={[0.12, 0.12, 0.12, 0.46]} />
```

Current physics body baseline:

```tsx
<RigidBody
  colliders={false}
  ccd
  restitution={0.44}
  friction={0.3}
  linearDamping={0.01}
  angularDamping={0.016}
>
```

Accepted rule:

The current collider baseline is stable enough for production prototype.

Do not replace it unless lab testing shows a clear improvement.

---

### 23.2 Why Collider Relationship Matters

The collider controls the physical behavior.

The visible dice body controls what the player sees.

If they do not feel aligned, problems can happen:

* dice may look like it touches the table before the collider touches
* dice may look like it floats slightly
* dice may bounce in a way that does not match its shape
* dice may roll too smoothly for its visible corners
* dice may stop cocked near borders more often
* dice may look like it is sliding instead of rolling
* result face may become harder to read
* player trust may drop

The goal is not to make the collider mathematically perfect.

The goal is to make the visible dice motion feel believable, readable, and trustworthy.

---

### 23.3 Collider Testing Goals

Collider testing should answer:

1. Does the collider feel matched to the visible dice?

2. Does the dice roll naturally after tray impact?

3. Does the dice bounce believably from the runway and rails?

4. Does the dice stop cleanly enough for top-face detection?

5. Does the dice avoid frequent cocked / unreadable stops?

6. Does the dice stay inside the tray?

7. Does the dice avoid suspicious sliding or floating?

8. Does the dice still feel like a physical traditional dice?

---

### 23.4 Lab-Only Collider Preset Direction

Future lab controls may include collider presets.

Possible presets:

### Current

Purpose:

* production baseline
* safest known behavior

Collider:

```tsx
<RoundCuboidCollider args={[0.12, 0.12, 0.12, 0.46]} />
```

Use as the comparison standard.

---

### Tighter

Purpose:

Test whether a slightly tighter collider gives better contact feeling.

Expected possible benefit:

* less float feeling
* sharper contact with table
* more believable impact

Possible risk:

* less rolling energy
* harder stops
* more blocky behavior

---

### Softer

Purpose:

Test whether a softer/larger rounded collider improves rolling.

Expected possible benefit:

* smoother roll
* less stiff cube behavior
* more natural tumble

Possible risk:

* too much rolling
* more cocked stops
* less readable settle
* dice may feel like a ball

---

### Experimental

Purpose:

Stress test only.

Expected possible benefit:

* learn boundary behavior

Possible risk:

* unstable
* toy-like
* too much bounce/slide
* not production-safe

Rule:

Experimental preset must never be treated as production candidate without review.

---

### 23.5 What Not To Do Yet

Do not change in production:

* `/six-animal` dice collider
* `/six-animal` dice physics
* `/six-animal` result detection
* `/six-animal` table colliders

Do not add:

* invisible result correction
* after-stop dice rotation
* backend target override
* forced top-face snapping
* hidden mismatch handling

Do not assume:

* more rounded is always better
* more bounce is always better
* longer roll is always better
* prettier dice shape is automatically more trusted

A stable trusted dice is better than a beautiful suspicious dice.

---

### 23.6 Recommended Next Code Step

Next code chapter:

## Chapter 51.6 — Lab Collider Preset Control Foundation

Goal:

Add a lab-only collider preset selector.

Route:

* `/dev/three-dice`

Files likely involved:

* `src/components/games/six-animal/ThreeDicePhysicsLab.tsx`
* `src/components/games/six-animal/ThreeDicePhysicsStage.tsx`

Initial implementation rule:

* default preset must be `current`
* production `/six-animal` must force `current`
* collider preset must affect only lab variant
* shape preset and collider preset should be separate controls
* no production room behavior change

---

### 23.7 Collider Test Acceptance Checklist

A collider preset is accepted only if:

* it appears only in `/dev/three-dice`
* `/six-animal` remains unchanged
* current preset remains available
* default behavior matches current production baseline
* dice stays inside tray
* dice does not look like it floats
* dice does not look like it slides unnaturally
* dice top face remains readable after settle
* cocked result frequency does not obviously increase
* no suspicious correction is introduced
* build passes

---

### 23.8 Chapter 51.5 Acceptance Checklist

Chapter 51.5 is complete when:

* current collider baseline is documented
* collider relationship risk is documented
* collider testing goals are documented
* possible lab collider presets are documented
* forbidden production changes are documented
* next code step is selected
* no visual code has changed
* no gameplay code has changed
* `npm run build` passes

---

## 24. Chapter 51.7 — Lab Shape + Collider Review Checklist

Status: Passed

Purpose:

Chapter 51.7 creates the review checklist for testing dice shape and collider combinations inside `/dev/three-dice`.

This chapter does not select a production candidate yet.

The goal is to prevent random physics tuning and make the test process clear.

---

### 24.1 Current Lab Controls Available

The `/dev/three-dice` lab now includes:

- Shape preset selector
- Collider preset selector
- Target selector
- Correction Test toggle
- Trap / Runway mode toggle
- Debug physics toggle
- Run 3 Dice button
- Drop Again button
- Shape Preset status card
- Collider Preset status card
- Physical Capture status card

Important:

These controls are lab-only.

Production `/six-animal` remains locked to:

- Shape: `current`
- Collider: `current`

---

### 24.2 Shape Presets To Review

Current available shape presets:

- Current
- Softer Round
- More Round
- Test Extreme

Review goals:

- does the dice still look readable?
- does the top face remain visible after settle?
- does the dice roll naturally?
- does it look too cube-like?
- does it look too ball-like?
- does it stop cleanly?
- does it create more cocked results?

Rule:

Do not choose a prettier shape if it makes result reading less trustworthy.

---

### 24.3 Collider Presets To Review

Current available collider presets:

- Current
- Tighter
- Softer
- Experimental

Review goals:

- does the collider feel matched to the visible dice?
- does the dice appear to touch the floor correctly?
- does the dice bounce believably?
- does the dice avoid floating feeling?
- does the dice avoid sliding feeling?
- does the dice stay inside the tray?
- does the dice stop with readable top face?
- does the dice avoid frequent cocked results?

Rule:

Collider changes affect trust more than visual changes. Treat them carefully.

---

### 24.4 Test Combinations

Start with these safe combinations:

### Baseline

- Shape: Current
- Collider: Current

Purpose:

Protect the current working behavior.

This is the comparison standard.

---

### Soft Visual Only

- Shape: Softer Round
- Collider: Current

Purpose:

Check if slightly more rounded visual dice improves appearance without changing physical collider behavior.

This may be the safest visual improvement path.

---

### Soft Collider Only

- Shape: Current
- Collider: Softer

Purpose:

Check if a softer collider improves roll behavior while keeping current visual shape.

Watch carefully for over-rolling or cocked stops.

---

### Matched Soft Test

- Shape: Softer Round
- Collider: Softer

Purpose:

Check whether visual and collider softness feel better together.

This is a possible candidate only if top-face readability stays strong.

---

### Reject / Stress Test

- Shape: More Round or Test Extreme
- Collider: Experimental

Purpose:

Learn what fails.

These are not production candidates unless unexpectedly stable.

---

### 24.5 What To Watch During Each Test

For each combination, test:

1. Single drop

   Check:

   - first impact
   - bounce
   - roll direction
   - final stop
   - top-face readability

2. Three dice run

   Check:

   - dice 1 capture
   - dice 2 capture
   - dice 3 capture
   - no repeated suspicious behavior
   - no dice escape
   - no heavy cocked frequency

3. Trap mode

   Check:

   - realistic drop from upper holder
   - not flying sideways
   - believable tumble
   - believable tray landing

4. Runway mode

   Check:

   - slope rolling behavior
   - shape/collider behavior without trapdoor drop
   - whether dice rolls too much or too little

5. Mobile view

   Check:

   - dice top face visible
   - animal print readable
   - result feels physical
   - floor/table does not hide dice

---

### 24.6 Acceptance Signals

A candidate is promising if:

- dice still feels physical
- top face is readable after settle
- animal print is clear
- dice does not look like a ball
- dice does not look like a block
- dice does not float above the floor
- dice does not slide unnaturally
- dice stays inside tray
- cocked results are not frequent
- result detection still feels honest
- no suspicious correction is needed

---

### 24.7 Rejection Signals

Reject a preset if:

- dice rolls too long
- dice stops too quickly
- dice frequently stops cocked
- top face is hard to read
- dice looks like it floats
- dice looks like it clips into floor
- dice looks like it slides instead of rolls
- dice escapes the tray
- dice hits borders unnaturally
- dice result feels suspicious
- it needs target correction to look good

Important:

A natural imperfect roll is safer than a suspicious perfect result.

---

### 24.8 Production Candidate Rule

A production candidate can only be considered after:

- `/dev/three-dice` single drop looks stable
- `/dev/three-dice` three dice run looks stable
- top-face detection still works
- cocked result frequency is acceptable
- mobile readability is acceptable
- `/six-animal` remains unchanged during testing
- build passes

Candidate decision options:

1. Keep Current / Current

   Best if current behavior is still safest.

2. Use Softer Round visual only

   Best if visual improvement is clear and collider behavior should stay stable.

3. Use Softer Round + Softer Collider

   Only if testing proves it is stable and readable.

4. Reject all changes

   Acceptable if all alternatives reduce trust.

---

### 24.9 Chapter 51.7 Acceptance Checklist

Chapter 51.7 is complete when:

- lab controls are listed
- shape presets are listed
- collider presets are listed
- safe test combinations are documented
- review checklist is documented
- acceptance signals are documented
- rejection signals are documented
- production candidate rule is documented
- no production code has changed
- no `/six-animal` behavior has changed
- `npm run build` passes

---

## 25. Chapter 51.6B — Tray Floor Smooth Surface Polish

Status: Passed

Purpose:

Chapter 51.6B polished the lower dice tray floor so it feels more like one smooth deep red felt / velvet rolling surface instead of a layered plastic box.

This chapter was added after visual QA showed that the tray floor inset and side-depth layers felt too much like physical obstacles or plastic sheets.

---

### 25.1 Visual Problem Found

The previous tray floor had these issues:

* inner inset rectangle looked like a separate plastic board
* side depth strips looked like raised obstacles
* surface felt too geometric
* floor did not yet feel like smooth felt / velvet
* dice rolling area felt visually interrupted

This was not a physics issue.

It was a visual surface polish issue.

---

### 25.2 Updated File

Updated file:

* `src/components/games/six-animal/ThreeDicePhysicsStage.tsx`

Main updated areas:

* `TABLE_MATERIALS.runwayFelt`
* `TABLE_MATERIALS.runwayInset`
* `TABLE_MATERIALS.runwayCenterGlow`
* `TABLE_MATERIALS.runwayBackShadow`
* `TABLE_MATERIALS.runwaySideDepth`
* `TableRunwayDepthLayer()`
* visual inset layer inside `TableRunway()`

---

### 25.3 Main Changes

Main changes:

* reduced inset opacity
* reduced side-depth opacity
* made floor highlight flatter and softer
* reduced visible raised-layer feeling
* changed inset panel into a soft inner felt tone
* kept all floor polish visual-only
* kept the rolling surface visually cleaner

Result:

The lower tray now feels smoother and more continuous.

The dice floor reads more like:

* deep red felt
* soft velvet
* real rolling surface
* less plastic
* less layered box

---

### 25.4 Safety Rules Preserved

This chapter did not change:

* tray collider
* dice collider
* dice physics
* dice size
* dice shape presets
* collider presets
* result detection
* target correction safety lock
* betting flow
* settlement flow
* backend trust rule
* `/six-animal` source-of-truth behavior

Important:

The visible physical dice result remains the production source of truth.

---

### 25.5 Accepted Result

Chapter 51.6B is accepted because:

* tray floor feels smoother
* inset panel no longer feels like a hard plastic obstacle
* side strips are less distracting
* dice remains readable
* mobile portrait view remains safe
* table still keeps depth
* no physics behavior was changed
* `npm run build` passes

---

### 25.6 Next Step

Next step:

## Chapter 51.8 — Lab Test Result Review / Candidate Decision

Goal:

Use the lab controls to compare shape and collider presets, then decide whether production should stay with:

* Shape: Current
* Collider: Current

or whether only a safe visual shape improvement should be considered later.

Rule:

Do not change production `/six-animal` until the lab result review is complete.

---

## 26. Chapter 51.8B — Final Dice Material Direction Note

Status: Passed

Purpose:

Chapter 51.8B records the final visual direction for Six Animal dice before continuing shape/collider testing.

The current dice are accepted as a strong working prototype and physics-testing baseline, but they are not the final production dice.

---

### 26.1 Current Dice Status

Current dice status:

- readable on mobile
- animal faces are clear
- ivory body is better than red for contrast
- rounded cube shape is acceptable for physics testing
- top-face detection works
- result capture works
- visible physical dice remains source of truth

However, the current dice still feel slightly like:

- painted plastic cube
- flat ivory material
- animal print sticker / surface paint
- procedural 3D object instead of handmade traditional dice

This is acceptable for current physics testing, but not final production quality.

---

### 26.2 Red Dice Decision

Full red dice body is rejected for now.

Reasons:

- animal face contrast may become weak
- red dice will fight with the red tray floor
- red body can feel like casino token / UI object
- mobile readability may drop
- top-face trust is more important than color branding

Red may be used later only as a very small accent, not as the main dice body.

---

### 26.3 Final Dice Direction

Final dice should move toward:

- warm aged ivory
- bone / resin / antique game-piece feeling
- subtle material grain
- soft corner shading
- light age variation
- premium handmade object feeling
- animal face printed, inked, burned, or engraved into the surface

The dice should not feel:

- plastic
- toy-like
- shiny white cube
- red casino cube
- emoji dice
- flat sticker cube

---

### 26.4 Animal Face Direction

Current animal face art is good for prototype and readability testing.

Future final dice faces may need:

- simplified emblem variants
- stronger silhouette
- less full-body detail at small size
- darker brown / antique ink treatment
- slight embedded/engraved feeling
- consistent face center alignment

Goal:

The player should feel the animal is part of the dice surface, not pasted above it.

---

### 26.5 Future Final Asset Path

Possible final production path:

1. Keep current procedural dice for physics testing.
2. Finish shape/collider candidate decision in `/dev/three-dice`.
3. Later create final dice asset pass:
   - custom dice GLB
   - real UV layout
   - aged ivory material map
   - subtle roughness/normal variation
   - embedded animal face texture
   - soft worn edge detail
4. Keep simple invisible collider if needed for stable physics.

Recommended final approach:

- visible dice = beautiful custom model/material
- physics dice = stable trusted collider

---

### 26.6 Safety Rule

Do not sacrifice readability for beauty.

Dice trust priority:

1. visible physical result
2. readable top face
3. natural roll
4. no suspicious correction
5. premium material beauty

A beautiful dice that players cannot read is not acceptable.

A readable dice that feels slightly prototype is acceptable until final asset production.

---

### 26.7 Next Step

Continue Chapter 51.8 lab testing.

Test these combinations:

- Shape: Current + Collider: Current
- Shape: Softer Round + Collider: Current
- Shape: Current + Collider: Softer
- Shape: Softer Round + Collider: Softer

Decision after testing:

- keep Current + Current if safest
- consider Softer Round + Current only if it improves appearance without hurting trust
- reject any combo that increases cocked results, sliding, floating, or unreadable top faces

---

## 27. Chapter 51.8C — Lab Candidate Result Note

Status: Passed

Purpose:

Chapter 51.8C records the current best lab candidate result after shape/collider comparison testing in `/dev/three-dice`.

This chapter does not change production `/six-animal` yet.

It only records the current best candidate direction.

---

### 27.1 Current Lab Winner

Current observed best candidate:

- Shape: `More Round`
- Collider: `Current`

Reason:

During visual/physics testing, `More Round` gave the most realistic physical feeling while keeping the current collider baseline.

This combination currently feels better than:

- Current + Current
- Softer Round + Current
- Current + Softer
- Softer Round + Softer

at least from current lab observation.

---

### 27.2 Why This Candidate Is Preferred

Observed strengths:

- dice feels more natural during tumble
- dice feels less like a stiff cube
- dice looks closer to real rolling dice
- realism feeling improved
- current collider baseline remains familiar and safer

Current recommendation:

Keep the collider unchanged for now.

Reason:

Collider changes affect trust more aggressively than visual shape changes.

So the safer promotion path, if accepted later, is:

- visual shape upgrade first
- collider stays `Current`

---

### 27.3 Important Safety Condition

This candidate is only acceptable if it still preserves:

- readable top face
- acceptable settle behavior
- no frequent cocked stops
- no suspicious sliding
- no obvious floating
- no result trust loss
- stable three-dice run

If later testing shows trust/readability problems, this candidate must be rejected even if it feels more realistic.

---

### 27.4 Current Production Decision

Production `/six-animal` is not changed yet.

Current production remains locked to:

- Shape: `Current`
- Collider: `Current`

until the candidate is formally promoted in a later chapter.

---

### 27.5 Recommended Next Step

Next step:

## Chapter 51.9 — Production Candidate Promotion Decision

Goal:

Decide whether `/six-animal` should safely promote from:

- Shape: `Current`

to:

- Shape: `More Round`

while keeping:

- Collider: `Softer`

Initial promotion rule:

- change visual shape only
- do not change collider
- do not change dice physics
- do not change result detection
- do not change source-of-truth rule

---

### 27.6 Chapter 51.8C Acceptance Checklist

Chapter 51.8C is complete when:

- current best lab candidate is recorded
- reason for choosing it is documented
- safety condition is documented
- production remains unchanged
- next production promotion decision is selected
- `npm run build` passes

---

## 27. Chapter 51.9 — Production Candidate Promotion: More Round + Softer

Status: Passed

Purpose:

Chapter 51.9 promoted the best-feeling lab dice candidate into the production Six Animal room.

The selected candidate is:

- Shape: `More Round`
- Collider: `Softer`

This promotion was based on lab testing where the dice felt more realistic, less stiff, and closer to a real rolling dice.

---

### 27.1 Updated File

Updated file:

- `src/components/games/six-animal/ThreeDicePhysicsStage.tsx`

Main changes:

- added `PRODUCTION_DICE_SHAPE_PRESET`
- added `PRODUCTION_DICE_COLLIDER_PRESET`
- set production shape to `more-round`
- set production collider to `softer`
- kept lab selectors active for `/dev/three-dice`
- kept `/six-animal` controlled by production constants

---

### 27.2 Production Candidate Values

Current production dice candidate:

```ts
const PRODUCTION_DICE_SHAPE_PRESET: DiceShapePreset = "more-round";
const PRODUCTION_DICE_COLLIDER_PRESET: DiceColliderPreset = "softer";

---

## 28. Chapter 51.10 — Production Candidate QA

Status: Passed

Purpose:

Chapter 51.10 tested the promoted production dice candidate inside the real `/six-animal` room.

The tested production candidate is:

- Shape: `More Round`
- Collider: `Softer`

This candidate was promoted after lab testing showed it felt more realistic than the previous stiff cube-like dice.

---

### 28.1 QA Scope

QA checked the real player room, not only the lab.

Route tested:

- `/six-animal`

Main flow checked:

- betting phase
- mounted dice visibility
- Bets Closed phase
- rolling phase
- visible physical dice stop
- result board capture
- settlement display
- next round reset
- mobile portrait readability
- side/top camera readability
- source-of-truth trust

---

### 28.2 Accepted Result

The promoted candidate is accepted for the current production prototype.

Accepted candidate:

```ts
const PRODUCTION_DICE_SHAPE_PRESET: DiceShapePreset = "more-round";
const PRODUCTION_DICE_COLLIDER_PRESET: DiceColliderPreset = "softer";

---

## 30. Chapter 51.12 — Phase 51 Closeout / Dice Shape Physics Lock

Status: Passed

Purpose:

Chapter 51.12 closes the Dice Shape / Physics Lab Upgrade phase.

Phase 51 researched, tested, promoted, and locked the current best procedural dice shape/collider candidate for the Six Animal production prototype.

---

### 30.1 Phase 51 Final Accepted Candidate

Final accepted procedural dice candidate:

```ts
const PRODUCTION_DICE_SHAPE_PRESET: DiceShapePreset = "more-round";
const PRODUCTION_DICE_COLLIDER_PRESET: DiceColliderPreset = "softer";

---

## 31. Chapter 52.1 — Custom Table Model Decision Plan

Status: Passed

Purpose:

Chapter 52 begins the final table implementation decision phase.

The current procedural Six Animal table is much better than before, but it is still built from code geometry.

The purpose of this chapter is to decide whether the final production table should remain procedural or move toward a custom 3D model / hybrid model path.

---

### 31.1 Current Table Status

Current table status:

- playable
- stable enough
- mobile-readable
- supports dice rolling
- supports visible physical dice result
- has improved dark lacquer material
- has deep red felt / velvet tray polish
- has Kanote-inspired ornament first pass
- has improved side rails, front lip, backboard, and holder shelf
- works with More Round + Softer dice candidate

Current weakness:

- still feels partly procedural
- geometry is still simple
- Kanote ornaments are built from primitive boxes
- table silhouette is not fully handcrafted
- material has no real texture maps
- carved detail is not true carved geometry
- final premium Myanmar royal furniture feeling may require custom asset work

---

### 31.2 Final Table Quality Goal

Final Six Animal table should feel like:

- real traditional ၆ကောင်ဂျင် / ဂလုန်းဂလုန်း equipment
- premium Myanmar royal furniture
- dark lacquer wood
- deep red felt / velvet rolling tray
- antique brass / old gold trim
- restrained carved ကနုတ် detail
- physical, heavy, handcrafted object
- not a toy model
- not a browser-game primitive object

The player should feel:

> “This is a real expensive traditional dice table inside a royal Myanmar game room.”

---

### 31.3 Option A — Keep Procedural Table

Description:

Continue improving the current code-built table.

Pros:

- fastest iteration
- easiest to tune
- colliders already aligned
- no external model pipeline needed
- small asset size
- easy to keep mobile-safe

Cons:

- may always feel somewhat primitive
- hard to create true carved Kanote detail
- hard to create real wood/felt material depth
- table silhouette may stay boxy
- not likely to reach final premium asset quality alone

Best use:

- prototype
- playable demo
- early production room
- physics testing

---

### 31.4 Option B — Full Custom GLB Table

Description:

Replace the procedural visible table with a fully modeled 3D table asset.

Pros:

- best visual quality
- true handcrafted silhouette
- real carved Kanote detail
- better table proportions
- proper UV texture mapping
- real material maps for lacquer, felt, brass, and wood

Cons:

- harder to align physics
- heavier asset pipeline
- slower iteration
- requires careful model export
- may break mobile performance if too heavy
- harder to tune after import

Best use:

- final production visual table
- marketing/demo-quality room
- long-term polished product

---

### 31.5 Option C — Hybrid Final Path

Recommended direction:

- visible table = custom GLB model
- physics table = simple invisible colliders

Pros:

- best visual quality
- keeps physics stable
- keeps dice result trust safer
- allows beautiful model without depending on complex mesh colliders
- easier to preserve current dice behavior
- professional production approach

Cons:

- requires careful alignment between model and colliders
- needs model export discipline
- needs QA for camera, dice visibility, and collision match

Recommended because:

The table can become beautiful without sacrificing the already-working dice physics and source-of-truth behavior.

---

### 31.6 Hybrid Table Safety Rule

In the hybrid path:

The custom model should be visual only.

The physics should remain controlled by simple invisible colliders.

Allowed:

- custom visible table mesh
- custom material maps
- carved Kanote model detail
- realistic felt tray texture
- lacquer/wood/brass material maps
- invisible colliders matching the playable tray

Not allowed:

- using complex visible mesh as production collider too early
- changing dice result source-of-truth
- breaking dice readability
- hiding dice behind table edges
- making tray surface busy
- increasing mobile load too much

---

### 31.7 Asset Requirements For Future Custom Table

Future custom table asset should include:

- upper dice holder
- trapdoor / flap structure
- backboard / chute wall
- lower sloped tray
- side rails
- front lip
- restrained Kanote trim
- deep red felt rolling surface
- dark lacquer wood body
- antique brass / old gold accents

Optional later:

- table legs / base
- carved corner ornaments
- subtle worn edge details
- normal/roughness maps
- separate material slots

---

### 31.8 What Must Stay Unchanged During Table Model Decision

Do not change during decision planning:

- dice physics
- dice collider
- dice result detection
- production dice candidate
- betting flow
- settlement flow
- backend trust rule
- source-of-truth rule
- wallet logic
- room timer
- Six Animal symbol set
- palace background
- muted project direction

---

### 31.9 Recommended Phase 52 Sequence

Recommended next steps:

## Chapter 52.2 — Current Procedural Table Strength / Weakness Review

Goal:

Review current table code and screenshots to decide what procedural table can still do well and where it cannot reach final quality.

Primary file:

- `src/components/games/six-animal/ThreeDicePhysicsStage.tsx`

---

## Chapter 52.3 — Hybrid GLB Table Requirements

Goal:

Write the exact requirements for a future custom table model before creating or importing any GLB asset.

---

## Chapter 52.4 — Model / Collider Alignment Plan

Goal:

Plan how visible custom table and invisible physics colliders should align safely.

---

## Chapter 52.5 — Custom Table Asset Prompt / Model Brief

Goal:

Prepare an asset generation / modeling brief for the future final table.

---

## Chapter 52.6 — Phase 52 Decision Lock

Goal:

Decide final implementation direction:

- keep procedural for now
- prepare hybrid GLB later
- start custom asset production branch

---

### 31.10 Chapter 52.1 Acceptance Checklist

Chapter 52.1 is complete when:

- procedural table option is documented
- full custom GLB option is documented
- hybrid option is documented
- recommended direction is documented
- asset requirements are documented
- safety rules are documented
- next sequence is documented
- no code changed
- no gameplay changed
- `npm run build` passes

---

## 32. Chapter 52.2 — Current Procedural Table Strength / Weakness Review

Status: Passed

Purpose:

Chapter 52.2 reviews the current procedural Six Animal table before deciding the final table model path.

The goal is to understand what the current code-built table can safely keep doing, and where it cannot reach final premium production quality.

No code was changed in this chapter.

---

### 32.1 Current Procedural Table Strengths

The current procedural table is strong because:

- it is already playable
- dice physics is already aligned
- invisible colliders are already stable
- table anatomy is understandable
- mobile portrait readability is already tested
- dice holder, trapdoor, backboard, tray, rails, and front lip exist
- table material system is centralized
- Kanote-inspired ornament first pass exists
- tray floor has been polished to feel smoother
- production dice candidate works with the table
- `/six-animal` flow is stable

Current procedural table is good for:

- gameplay prototype
- physics testing
- mobile QA
- result trust testing
- early production demo
- fast iteration

---

### 32.2 Current Procedural Table Weaknesses

The current procedural table still has limits:

- geometry still feels box-based
- carved details are not true carved geometry
- Kanote ornaments are simple primitive shapes
- table silhouette is not fully handcrafted
- material has no real texture maps
- felt/velvet surface is simulated with flat materials
- lacquer wood has no grain/normal/roughness maps
- antique brass trim is still simple geometry
- table still can feel like a polished prototype, not final furniture

The current table is much better than before, but it may not reach final premium Myanmar royal table quality alone.

---

### 32.3 Current Code Structure Reviewed

Primary file:

- `src/components/games/six-animal/ThreeDicePhysicsStage.tsx`

Current table is built from:

- `createTableMeasurements()`
- `TableRunway()`
- `TableRunwayDepthLayer()`
- `TableBackboard()`
- `TableBackboardDepth()`
- `TableBackboardKanotePattern()`
- `DiceHolderShelf()`
- `DiceHolderShelfDepth()`
- `DiceHolderShelfKanoteAccent()`
- `TrapdoorFlaps()`
- `StumbleBar()`
- `FrontLip()`
- `FrontLipLacquerDepth()`
- `FrontLipKanoteStrip()`
- `TraySideRails()`
- `TrayRailLacquerDepth()`
- `TraySideRailKanoteTrim()`
- `TableSafetyGuards()`
- `TrayBox()`

This structure is good for a prototype and safe polishing, but final visual quality may need external model work.

---

### 32.4 What Procedural Table Should Keep

Even if a custom GLB model is added later, the procedural system should still be useful for:

- invisible physics colliders
- fallback table rendering
- dev testing
- quick layout experiments
- collider alignment reference
- mobile readability reference

Important:

The current procedural table should not be deleted too early.

It can become the safety fallback and collider reference for the future hybrid model path.

---

### 32.5 What A Custom Model Can Improve

A future custom table model can improve:

- overall silhouette
- carved Kanote detail
- rounded furniture edges
- handmade wood structure
- believable trapdoor mechanism
- real lacquer material texture
- real felt/velvet texture
- antique brass edge wear
- table thickness and weight
- premium Myanmar royal furniture feeling

The main reason to consider a custom model is visual production quality, not physics.

---

### 32.6 Important Hybrid Insight

The safest final direction is still likely:

- visible table: custom GLB model
- physics table: simple invisible colliders

Reason:

The visible model can become beautiful without risking dice physics.

The physics colliders can remain simple, readable, and trusted.

This avoids the danger of using complex carved mesh geometry as the real dice collider.

---

### 32.7 Current Decision

Do not replace the procedural table immediately.

Decision:

- keep current procedural table as accepted prototype foundation
- keep current invisible collider system
- plan a future custom visible table model
- use hybrid path as the preferred final direction
- document exact GLB requirements before creating/importing assets

---

### 32.8 Chapter 52.2 Acceptance Checklist

Chapter 52.2 is complete when:

- procedural table strengths are documented
- procedural table weaknesses are documented
- current table code structure is reviewed
- fallback/collider value is documented
- custom model improvement areas are documented
- hybrid insight is documented
- no code changed
- no gameplay changed
- `npm run build` passes

---

## 33. Chapter 52.3 — Hybrid GLB Table Requirements

Status: Passed

Purpose:

Chapter 52.3 defines the requirements for a future custom GLB Six Animal table model.

The goal is to prepare the custom table model direction before any asset creation or code import.

No code was changed in this chapter.

---

### 33.1 Hybrid Table Direction

The preferred final implementation direction is:

- visible table = custom GLB model
- physics table = simple invisible colliders

Reason:

The visible model can become beautiful, detailed, and culturally rich, while the physics colliders stay simple, stable, and trusted.

This protects dice rolling behavior and visible physical result trust.

---

### 33.2 What The GLB Model Should Replace Visually

A future custom GLB model should visually replace the current procedural table parts:

- upper dice holder
- trapdoor / flap structure
- backboard / chute wall
- lower sloped tray
- side rails
- front lip
- Kanote ornament strips
- brass / gold trim
- lacquer body surfaces
- felt / velvet tray surface

The GLB should not replace game logic.

The GLB should not control result detection.

---

### 33.3 Required Table Anatomy

The custom model must preserve the current real-life table anatomy.

Required parts:

1. Upper dice holder

   Purpose:

   - holds three mounted dice
   - makes dice feel physically prepared before drop
   - should look like a real mechanism, not decoration

2. Trapdoor / release flaps

   Purpose:

   - visually explain how dice drops
   - should feel believable and mechanical

3. Backboard / chute wall

   Purpose:

   - gives table height
   - frames the upper holder
   - supports royal furniture feeling

4. Lower sloped tray

   Purpose:

   - main dice rolling surface
   - must remain visually clean
   - must not hide dice faces

5. Side rails

   Purpose:

   - contain dice visually
   - frame the tray
   - show table thickness and weight

6. Front lip

   Purpose:

   - gives strong foreground silhouette
   - keeps table feeling physically contained
   - can carry restrained Kanote detail

---

### 33.4 Required Material Slots

The GLB should be built with separate material slots if possible.

Recommended material slots:

- dark lacquer wood body
- deep red felt / velvet tray
- antique brass / old gold trim
- dark inner shadow material
- trapdoor wood panels
- subtle Kanote ornament material

Reason:

Separate material slots make it easier to tune the table inside the game without editing the model every time.

---

### 33.5 Visual Style Requirements

The custom table should feel:

- premium
- Myanmar traditional
- royal palace furniture inspired
- handcrafted
- heavy and physical
- dark lacquer / polished wood
- deep red felt / velvet rolling surface
- antique brass / old gold trim
- restrained Kanote detail

It should not feel:

- toy-like
- plastic
- slot-machine-like
- neon casino
- cartoon
- western casino table
- overloaded with decoration
- too busy under the dice

---

### 33.6 Kanote Requirements

Kanote ornament should be included carefully.

Allowed GLB Kanote placement:

- front lip
- side rail outer trim
- backboard subtle carved panel
- upper holder accent
- corner details

Forbidden GLB Kanote placement:

- main dice rolling surface
- center tray floor
- directly under stopped dice
- high-contrast area behind dice faces

Rule:

Kanote should feel carved or embossed into the table, not pasted on top like UI decoration.

---

### 33.7 Dice Readability Requirements

The custom table must protect dice readability.

Requirements:

- stopped dice top face must remain visible
- tray floor must contrast with ivory dice
- front lip must not hide dice
- side rails must not block mobile camera
- backboard must not visually compete with mounted dice
- tray surface must stay clean and not patterned
- lighting should still reveal animal faces clearly

The visible dice result remains more important than table beauty.

---

### 33.8 Physics Separation Requirement

The custom GLB table should be visual-only at first.

Physics should remain controlled by:

- simple invisible colliders
- current collider layout as reference
- safe tray collider
- safe side rail colliders
- safe front lip collider
- safe backboard collider
- safe stumble bar collider

Do not use complex carved GLB mesh as production dice collider in the first integration.

Reason:

Complex mesh colliders can create unpredictable dice behavior, cocked stops, clipping, or suspicious results.

---

### 33.9 Performance Requirements

The GLB must be mobile-safe.

Requirements:

- optimized polygon count
- no excessive carved geometry under dice
- no huge texture files
- reasonable material count
- compressed asset if needed
- clean UVs
- no hidden unnecessary geometry
- no heavy animations unless planned separately

Mobile portrait performance is more important than extreme detail.

---

### 33.10 Asset Export Requirements

Future GLB should ideally export with:

- correct scale
- centered origin
- clean transforms
- separated named meshes
- clear material names
- no extra cameras
- no extra lights
- no animation unless intentionally required
- model aligned to current table coordinate direction

Suggested mesh naming:

- `table_body_lacquer`
- `tray_felt`
- `front_lip`
- `side_rail_left`
- `side_rail_right`
- `backboard`
- `dice_holder`
- `trapdoor_flaps`
- `kanote_trim`
- `brass_accents`

---

### 33.11 First Integration Rule

The first custom GLB integration should be visual-only.

Safe first integration:

- keep current procedural colliders
- hide or reduce procedural visible table
- display GLB table
- align GLB visually to current dice drop path
- test `/dev/three-dice` first
- only then test `/six-animal`

Do not immediately delete the procedural table.

The procedural table remains fallback and collider reference.

---

### 33.12 Acceptance Checklist For Future GLB

A future custom table GLB is acceptable only if:

- dice rolling still works
- dice stays inside tray
- top face remains readable
- mounted dice remain visible
- mobile portrait remains safe
- table feels more premium than procedural table
- Kanote does not distract from dice
- tray floor remains visually clean
- no physics trust issue appears
- build passes
- fallback path remains possible

---

### 33.13 Chapter 52.3 Acceptance Checklist

Chapter 52.3 is complete when:

- hybrid GLB direction is documented
- required table anatomy is documented
- material slots are documented
- visual style requirements are documented
- Kanote requirements are documented
- dice readability requirements are documented
- physics separation rule is documented
- performance requirements are documented
- export requirements are documented
- first integration rule is documented
- no code changed
- no gameplay changed
- `npm run build` passes

---

## 34. Chapter 52.4 — Model / Collider Alignment Plan

Status: Passed

Purpose:

Chapter 52.4 defines how a future custom visible GLB table should align with the invisible physics colliders.

This chapter is planning-only.

No code was changed.

---

### 34.1 Core Alignment Rule

The custom table model should be visual.

The invisible colliders should control dice physics.

This means:

- the player sees the custom GLB table
- the dice collides with simple invisible collider shapes
- visible model and invisible collider must line up closely enough to feel believable
- physics stability is more important than perfect visual collision detail

Rule:

Beautiful visible geometry must not create unpredictable dice physics.

---

### 34.2 Current Collider Reference

The current procedural table already has useful collider references:

- main sloped tray collider
- backboard collider
- side rail colliders
- front lip collider
- stumble bar collider
- safety guard colliders

These should become the first reference for the hybrid model path.

The custom model should be built around this current physical table anatomy instead of forcing a new physics system immediately.

---

### 34.3 Alignment Priority Areas

The most important alignment areas are:

1. Dice landing floor

   The visible tray floor and invisible tray collider must feel aligned.

   If not aligned, dice may look like:

   - floating
   - clipping
   - bouncing before touching
   - sinking into surface

2. Side rails

   The visible side rails and invisible side rail colliders must feel aligned.

   If not aligned, dice may look like:

   - hitting invisible walls
   - passing through visible rail
   - stopping too far away from rail

3. Front lip

   The visible front lip and invisible front collider must feel aligned.

   If not aligned, dice may look like:

   - blocked by air
   - clipping into the front lip
   - hiding behind the lip

4. Backboard / chute

   The visible backboard and invisible back collider must feel aligned.

   If not aligned, dice drop path may feel fake.

5. Stumble bar

   The visible stumble bar and invisible collider must be very close.

   If not aligned, dice may appear to bounce from empty air.

---

### 34.4 Safe Alignment Method

Recommended first method:

1. Keep current procedural colliders.
2. Import or place the GLB visible table.
3. Turn off or hide most procedural visible table meshes.
4. Keep invisible colliders active.
5. Align GLB to the current tray coordinate system.
6. Test in `/dev/three-dice`.
7. Only after lab pass, test `/six-animal`.

Do not start by deleting procedural table code.

---

### 34.5 Visual Tolerance Rule

Perfect collider/model matching is not required.

Acceptable:

- collider is slightly inside visible rail
- collider is slightly below visible felt
- front lip collider is slightly safer than visible edge
- invisible safety guards remain hidden outside visible area

Not acceptable:

- dice visibly floats above table
- dice clips through visible rail
- dice bounces from empty space
- dice stops inside visible geometry
- dice top face becomes hidden
- dice result feels suspicious

---

### 34.6 Model Scale Requirement

The GLB model must match the current table scale closely.

Model should be prepared around:

- same tray width direction
- same tray depth direction
- same upper holder location
- same lower tray landing zone
- same front lip position
- same side rail boundaries
- same camera readability needs

If the GLB table is too large or too small, dice physics and camera readability may break.

---

### 34.7 Origin / Position Requirement

The GLB should use a clean origin.

Recommended:

- model origin near table center
- tray center aligned near current table center
- no random offset from modeling software
- transforms applied before export
- scale applied before export
- no extra parent transform surprises

Reason:

Clean origin makes it easier to align the model with current colliders.

---

### 34.8 Collider Debug Requirement

When integrating later, debug tools should help verify alignment.

Useful checks:

- show physics debug in `/dev/three-dice`
- compare visible rail to collider rail
- compare visible floor to collider floor
- compare front lip collider to visible front lip
- test dice drop from holder
- test side rail collision
- test front lip collision

Debug view should not be exposed to `/six-animal` players.

---

### 34.9 Camera Alignment Requirement

A custom GLB table must work with the current player camera.

Check:

- default front view
- top-view drag
- side-view drag
- mobile portrait view
- stopped dice readability
- mounted dice visibility
- front lip not blocking result
- side rails not hiding dice

The GLB should not force a full camera redesign unless absolutely necessary.

---

### 34.10 Material / Collider Independence

Visual material should not affect physics.

Examples:

- felt texture can look soft, but collider stays simple
- carved Kanote can be visible, but not physical collision
- brass trim can be visible, but not cause tiny collision bumps
- rounded rail model can be visible, but collider can remain simple box/capsule-like shape

Reason:

Tiny decorative details should not disturb dice rolling.

---

### 34.11 First Integration Acceptance Checklist

Future GLB alignment is acceptable only if:

- dice lands on visible floor naturally
- dice does not float
- dice does not clip
- dice side rail collision looks believable
- dice front lip collision looks believable
- dice stays inside tray
- top face remains readable
- mounted dice remain visible
- mobile camera remains safe
- `/dev/three-dice` passes first
- `/six-animal` passes after lab
- build passes

---

### 34.12 Rollback Rule

If custom GLB alignment fails:

- keep current procedural visible table
- keep current colliders
- do not force GLB into production
- revise model scale/origin/shape
- test again in `/dev/three-dice`

The current procedural table is the fallback.

---

### 34.13 Chapter 52.4 Acceptance Checklist

Chapter 52.4 is complete when:

- core alignment rule is documented
- current collider reference is documented
- priority alignment areas are documented
- safe alignment method is documented
- visual tolerance rule is documented
- model scale/origin requirements are documented
- debug requirement is documented
- camera requirement is documented
- rollback rule is documented
- no code changed
- no gameplay changed
- `npm run build` passes

---

## 35. Chapter 52.5 — Custom Table Asset Prompt / Model Brief

Status: Passed

Purpose:

Chapter 52.5 creates the future custom table asset brief.

This brief can be used later for:

- 3D artist handoff
- Blender modeling
- AI-assisted concept generation
- GLB production planning
- visual QA reference

No code was changed in this chapter.

---

### 35.1 Asset Goal

Create a premium custom 3D Six Animal / ၆ကောင်ဂျင် table model for Nagani Traditional.

The table should feel like:

- real Myanmar traditional game equipment
- royal palace furniture
- dark lacquer wood
- deep red felt / velvet dice tray
- antique brass / old gold trim
- restrained carved ကနုတ် / Kanote detail
- heavy handcrafted physical object
- expensive and trustworthy

The table must not feel like:

- plastic toy
- slot machine prop
- western casino table
- cartoon object
- generic browser-game model
- neon casino object
- cheap fantasy table

---

### 35.2 Model Type

Recommended model type:

- custom GLB table model
- visual-only first
- no dice included
- no game result UI included
- no betting board included
- no palace room background included

Reason:

Dice, UI, betting board, result board, and palace background are controlled separately by the game.

The custom table model should focus only on the physical dice table.

---

### 35.3 Required Anatomy

The model must include:

1. Upper dice holder

   - three dice slots / resting positions
   - believable wooden support
   - dark lacquer or teak-inspired structure
   - small brass/gold details
   - should visually explain where dice wait before dropping

2. Trapdoor / release flap area

   - three separate flap positions
   - believable release mechanism
   - small hinge impression
   - should look mechanical, not magical

3. Backboard / chute wall

   - vertical or slightly angled support wall
   - frames the dice holder
   - dark lacquer panel
   - subtle carved Kanote detail
   - not too busy behind mounted dice

4. Lower sloped tray

   - main dice landing and rolling surface
   - deep red felt / velvet
   - smooth and clean
   - no busy pattern under dice
   - enough contrast against ivory dice

5. Side rails

   - left and right tray boundaries
   - dark lacquer wood
   - old gold/brass edge highlight
   - must not block camera readability

6. Front lip

   - strong foreground table edge
   - heavier lacquer wood
   - restrained Kanote trim
   - must not hide stopped dice top faces

---

### 35.4 Material Direction

Recommended material slots:

- `dark_lacquer_wood`
- `deep_red_felt_tray`
- `antique_brass_trim`
- `trapdoor_dark_wood`
- `kanote_carved_gold`
- `inner_shadow_dark`

Material style:

- dark red-black lacquer wood
- soft deep red felt / velvet tray
- old gold / antique brass trim
- subtle worn edges
- restrained handcrafted detail
- warm palace lighting response

Avoid:

- bright red plastic
- neon gold
- mirror metal
- flat untextured colors
- noisy tray texture
- high-contrast patterns under dice

---

### 35.5 Kanote Direction

Kanote should feel carved or embossed into the table.

Allowed placement:

- front lip trim
- side rail outer trim
- backboard panel
- upper holder accent
- table corners

Forbidden placement:

- main dice landing surface
- center tray floor
- directly under stopped dice
- high-contrast area behind animal dice faces

Rule:

Kanote must support the table, not compete with the dice.

---

### 35.6 Scale / Alignment Direction

The model should be built to align with the current table anatomy.

Important alignment zones:

- tray center
- tray slope direction
- front lip position
- side rail boundaries
- upper dice holder position
- trapdoor drop path
- backboard/chute position

The final model should not force a complete rewrite of dice physics.

Recommended:

- centered origin
- clean transforms
- applied scale
- no random offsets
- model facing the same direction as current game table
- separate named meshes

---

### 35.7 Mesh Naming Recommendation

Suggested mesh names:

- `table_body_lacquer`
- `tray_felt_surface`
- `front_lip_lacquer`
- `side_rail_left`
- `side_rail_right`
- `backboard_lacquer`
- `dice_holder`
- `trapdoor_flap_left`
- `trapdoor_flap_center`
- `trapdoor_flap_right`
- `kanote_front_trim`
- `kanote_side_trim_left`
- `kanote_side_trim_right`
- `brass_accents`

Reason:

Clear mesh names make future integration and material tuning easier.

---

### 35.8 Texture Requirements

Future model should support:

- base color maps
- roughness maps
- normal maps
- optional ambient occlusion maps
- clean UV layout
- mobile-safe texture sizes

Recommended texture priorities:

1. felt / velvet tray texture
2. dark lacquer wood surface
3. brass / gold trim
4. carved Kanote detail
5. subtle edge wear

Do not over-texture the dice landing floor.

The tray must stay clean and readable.

---

### 35.9 Mobile Performance Requirements

Model must be mobile-safe.

Requirements:

- optimized polygon count
- no unnecessary hidden geometry
- no very heavy carved detail under dice
- reasonable texture sizes
- separate details only where visible
- no extra cameras
- no extra lights
- no heavy animation baked into model

The table should look premium without becoming too heavy for mobile portrait play.

---

### 35.10 3D Artist / Asset Prompt Draft

Use this as the future prompt or artist brief:

> Create a premium 3D model of a Myanmar traditional Six Animal dice table, used for ၆ကောင်ဂျင် / ဂလုန်းဂလုန်း. The table should feel like expensive royal palace furniture: dark red-black lacquer wood, deep red felt or velvet dice rolling tray, antique brass / old gold trims, restrained carved Myanmar Kanote ornament. The table has an upper dice holder with three dice positions, three small trapdoor release flaps, a backboard/chute wall, a lower sloped dice rolling tray, side rails, and a front lip. The rolling tray must stay clean and smooth with no busy ornament under the dice. Kanote ornament should appear on the front lip, side rail outer trim, backboard, and holder accents only. The model should feel handcrafted, heavy, ceremonial, and realistic, not toy-like, not cartoon, not slot-machine, not western casino. Make separate material slots for dark lacquer wood, deep red felt, antique brass, trapdoor wood, and Kanote trim. No dice, no UI, no betting board, no background room. The model should be mobile-game optimized, clean UVs, centered origin, applied transforms, and exported as GLB.

---

### 35.11 First Concept Image Prompt Draft

Use this later for a concept reference image:

> Premium Myanmar traditional Six Animal dice table, royal palace furniture style, dark red-black lacquer wood, deep red velvet dice tray, antique brass trim, restrained carved Kanote ornaments, upper three-dice holder with release flaps, vertical backboard, lower sloped rolling tray, side rails and front lip, handcrafted ceremonial game equipment, realistic 3D product render, mobile game asset reference, clean dice rolling surface, no dice, no people, no UI, no casino slot machine, no cartoon, no neon.

---

### 35.12 Integration Reminder

When this asset is created later:

- do not delete procedural table immediately
- import GLB in `/dev/three-dice` first
- keep current invisible colliders
- align model visually to existing physics
- test dice landing, rail collision, front lip collision
- only then test `/six-animal`

The procedural table remains fallback and collider reference.

---

### 35.13 Acceptance Checklist For Future Asset

A future custom table concept/model is accepted only if:

- table anatomy is correct
- rolling surface is clean
- dice readability is protected
- Kanote feels Myanmar traditional
- table feels premium and physical
- model does not look like plastic toy
- model does not look like slot/casino prop
- mobile performance is considered
- material slots are separated
- GLB can align with current colliders
- fallback remains possible

---

### 35.14 Chapter 52.5 Acceptance Checklist

Chapter 52.5 is complete when:

- custom table asset goal is documented
- required anatomy is documented
- material direction is documented
- Kanote direction is documented
- scale/alignment direction is documented
- mesh naming recommendation is documented
- texture requirements are documented
- performance requirements are documented
- artist/model brief is documented
- concept image prompt is documented
- no code changed
- no gameplay changed
- `npm run build` passes

---

## 36. Chapter 52.6 — Phase 52 Decision Lock

Status: Passed

Purpose:

Chapter 52.6 locks the table implementation decision for the Six Animal production roadmap.

The current procedural table is accepted as the active production prototype table.

The long-term final table direction is locked as a hybrid custom model path.

---

### 36.1 Final Decision

Decision:

Use the Hybrid Final Path later.

Final direction:

- visible table = custom GLB model
- physics table = simple invisible colliders

This is the preferred long-term production direction because it gives the best balance between:

- premium visual quality
- stable dice physics
- mobile readability
- visible physical dice result trust
- safe rollback/fallback

---

### 36.2 Current Active Table Status

The current procedural table remains active for now.

Current table status:

- accepted as production prototype foundation
- stable enough for `/six-animal`
- supports dice rolling
- supports result capture
- supports mobile portrait
- supports current More Round + Softer dice candidate
- improved with dark lacquer material
- improved with smooth red felt tray
- improved with restrained Kanote ornament first pass

The current procedural table should not be deleted.

It remains:

- active table
- fallback table
- collider reference
- dev testing reference

---

### 36.3 Why Not Replace Immediately

Do not immediately replace the procedural table with a custom GLB.

Reason:

- current table works
- dice physics is stable
- result trust is protected
- custom GLB needs asset production time
- collider/model alignment needs careful QA
- mobile performance must be protected
- final table asset should not be rushed

The next step is not random code replacement.

The next step is asset preparation only when ready.

---

### 36.4 What Hybrid Means

Hybrid means:

The player sees:

- custom GLB table
- handcrafted silhouette
- carved Kanote detail
- real material textures
- premium furniture style

The dice collides with:

- simple invisible tray collider
- simple invisible rail colliders
- simple invisible front lip collider
- simple invisible backboard collider
- safe invisible guards

This allows visual beauty without sacrificing physics trust.

---

### 36.5 Locked Safety Rule

The visible physical dice result remains the source of truth.

The custom model path must not introduce:

- forced result correction
- after-stop dice snapping
- hidden backend target result
- dice clipping
- dice floating
- unreadable top face
- busy tray surface
- mobile camera blockage

Table beauty must support dice trust.

---

### 36.6 Future Custom Table Asset Requirements

Future GLB table must follow the Chapter 52.5 asset brief.

Required:

- upper dice holder
- trapdoor / release flaps
- backboard / chute wall
- lower sloped tray
- side rails
- front lip
- dark lacquer wood
- deep red felt / velvet tray
- antique brass / old gold trim
- restrained Kanote ornament
- clean mobile-safe model
- separated material slots
- clean origin and scale

Forbidden:

- dice included in table model
- UI included in table model
- betting board included in table model
- busy ornament under dice
- casino slot styling
- toy/plastic feeling

---

### 36.7 Future Integration Rule

When a custom GLB table is ready later:

1. Import into `/dev/three-dice` first.
2. Keep current invisible colliders.
3. Align GLB visually to current table anatomy.
4. Test dice drop, roll, stop, and capture.
5. Test mobile camera readability.
6. Only then test `/six-animal`.
7. Keep procedural table fallback until GLB is fully accepted.

Do not integrate the GLB directly into production first.

---

### 36.8 What Phase 52 Completed

Phase 52 completed:

- custom table model decision plan
- procedural table strength/weakness review
- hybrid GLB table requirements
- model/collider alignment plan
- custom table asset/model brief
- final hybrid decision lock

---

### 36.9 What Phase 52 Did Not Do

Phase 52 did not:

- create a GLB model
- import a GLB model
- delete the procedural table
- change dice physics
- change dice result detection
- change betting flow
- change settlement flow
- change backend trust behavior

This phase was decision and planning only.

---

### 36.10 Phase 52 Final Status

Phase 52 is complete enough.

Accepted current state:

- active table: current procedural table
- future final direction: hybrid custom GLB visible table + invisible colliders
- procedural table remains fallback/reference
- custom GLB work deferred until asset production is ready
- current dice candidate remains More Round + Softer
- build passing

---

### 36.11 Next Major Step

Next recommended step:

## Chapter 53 — Table + Dice Production Polish Closeout

Goal:

Close the current table/dice polishing branch and summarize the accepted state before returning to the larger Nagani roadmap.

After that, the next major roadmap branch can be chosen:

- final Six Animal QA/demo lock
- custom table asset production branch
- backend bridge implementation
- Thirty Six polish
- deployment/demo preparation

Recommendation:

Do not start GLB integration until a real custom table asset exists.

---

## 37. Chapter 53 — Table + Dice Production Polish Closeout

Status: Passed

Purpose:

Chapter 53 closes the current Six Animal table + dice production polishing branch.

This branch improved the table, dice, tray floor, Kanote ornament, dice material, dice shape/physics candidate, and final custom table direction without breaking the existing Six Animal game flow.

---

### 37.1 Final Accepted State

The current accepted `/six-animal` state is:

- active table: improved procedural 3D table
- future final table direction: hybrid custom GLB visible table + invisible colliders
- production dice candidate: More Round + Softer
- dice body: warm ivory / aged resin first pass
- dice face textures: production v1 animal art
- tray floor: smoother deep red felt / velvet surface
- table material: dark lacquer + antique brass direction
- ornament: restrained Kanote first pass
- palace background: active
- game remains muted
- visible physical dice remains source of truth

---

### 37.2 Completed Branches

This table + dice polishing branch completed:

- Phase 47 — Table + Dice Roadmap Lock
- Phase 48 — Table Material System Upgrade
- Phase 49 — Kanote Ornament Layer
- Phase 50 — Dice Production Material Upgrade
- Phase 51 — Dice Shape / Physics Lab Upgrade
- Phase 52 — Custom Table Model Decision

---

### 37.3 Current Production Dice Lock

Current active production dice candidate:

```ts
const PRODUCTION_DICE_SHAPE_PRESET: DiceShapePreset = "more-round";
const PRODUCTION_DICE_COLLIDER_PRESET: DiceColliderPreset = "softer";

---

## 38. Chapter 54.1 — Final Six Animal QA Plan After Table + Dice Polish

Status: Passed

Purpose:

Chapter 54.1 starts final QA after completing the table + dice production polishing branch.

The goal is to verify that the improved table, dice, tray floor, Kanote ornament, and More Round + Softer dice candidate still work safely inside the full `/six-animal` room.

This chapter is planning and QA checklist only.

No code changed.

---

### 38.1 Current QA Target

Current target route:

- `/six-animal`

Current accepted production dice candidate:

```ts
const PRODUCTION_DICE_SHAPE_PRESET: DiceShapePreset = "more-round";
const PRODUCTION_DICE_COLLIDER_PRESET: DiceColliderPreset = "softer";

---

## 39. Chapter 54.2 — Full Bet Round QA After Table + Dice Polish

Status: Passed

Purpose:

Chapter 54.2 tested one complete `/six-animal` full bet round after the table + dice production polish branch.

This QA confirmed that the improved procedural table, smoother tray floor, Kanote ornament layer, and More Round + Softer production dice candidate still work inside the real player room.

---

### 39.1 Tested Flow

Tested route:

- `/six-animal`

Tested full bet flow:

1. Opened `/six-animal`
2. Waited for loading intro
3. Confirmed palace room appears clearly
4. Selected one animal during betting phase
5. Selected / confirmed bet amount
6. Pressed Place Bet
7. Confirmed bet locked
8. Waited for Bets Closed
9. Watched all three dice roll
10. Confirmed result board captured visible dice
11. Confirmed settlement appeared
12. Confirmed next round reset worked

---

### 39.2 Accepted Result

Chapter 54.2 passed because:

- betting phase remained usable
- bet lock worked
- mounted dice remained visible
- Bets Closed phase remained stable
- More Round + Softer dice rolled in production room
- dice stayed inside tray
- result board followed visible dice
- settlement appeared correctly
- next round reset worked
- no dev/lab UI appeared
- no correction/debug UI appeared
- no old sample table appeared

---

### 39.3 Current Production Dice Confirmed

Current active production dice candidate remains:

```ts
const PRODUCTION_DICE_SHAPE_PRESET: DiceShapePreset = "more-round";
const PRODUCTION_DICE_COLLIDER_PRESET: DiceColliderPreset = "softer";

---

## 40. Chapter 54.3 — No-Bet Round QA After Table + Dice Polish

Status: Passed

Purpose:

Chapter 54.3 tested one complete `/six-animal` round without placing a bet after the table + dice production polish branch.

This QA confirms that the improved table, smoother tray floor, Kanote ornament layer, and More Round + Softer production dice candidate still work when the player does not place a bet.

---

### 40.1 Tested Flow

Tested route:

- `/six-animal`

Tested no-bet flow:

1. Opened `/six-animal`
2. Waited for loading intro
3. Did not place a bet during betting phase
4. Waited through betting countdown
5. Waited for Bets Closed
6. Watched all three dice roll
7. Confirmed result board captured visible dice
8. Confirmed no fake settlement / bet result appeared
9. Confirmed next round reset worked

---

### 40.2 Accepted Result

Chapter 54.3 passed because:

- no-bet round did not break the UI
- betting phase remained stable without player action
- Bets Closed phase remained stable
- dice rolled normally
- More Round + Softer candidate remained acceptable
- result board still captured visible physical dice
- settlement did not show incorrect fake bet data
- next round reset worked
- no dev/lab UI appeared
- no correction/debug UI appeared

---

### 40.3 Safety Rules Preserved

This QA preserved:

- visible physical dice source-of-truth
- no backend forced result
- no target correction in production
- no after-stop snapping
- no hidden mismatch handling
- no fake no-bet settlement
- mobile portrait readability
- muted project direction

---

### 40.4 Chapter 54.3 Acceptance Checklist

Chapter 54.3 is complete when:

- no-bet round was tested
- dice rolled normally
- result board captured visible dice
- no fake settlement appeared
- next round reset worked
- More Round + Softer remained acceptable
- no dev/correction UI appeared
- `npm run build` passes

---

## 41. Chapter 54.4 — Dice / Table Visual QA After Table + Dice Polish

Status: Passed

Purpose:

Chapter 54.4 visually tested the improved dice and table after the table + dice production polish branch.

This QA focused on whether the current `/six-animal` room still feels stable, readable, and premium enough after the More Round + Softer dice candidate and tray/table polish.

---

### 41.1 Visual QA Scope

Checked route:

- `/six-animal`

Visual areas checked:

- More Round dice shape
- Softer collider behavior
- dice tray floor
- side rails
- front lip
- Kanote ornament
- mounted dice
- stopped dice readability
- table premium feeling
- mobile portrait view

---

### 41.2 Accepted Result

Chapter 54.4 passed because:

- More Round dice feels more natural
- Softer collider does not create suspicious sliding
- dice does not visibly float above tray
- dice does not clip through table
- dice stays inside tray
- stopped top face remains readable enough
- tray floor feels smoother and less plastic
- front lip does not hide stopped dice
- side rails do not block mobile view
- Kanote ornament does not distract from result
- table still feels premium enough for current prototype

---

### 41.3 Current Visual Lock

Current accepted visual state:

- active table: improved procedural 3D table
- tray floor: smooth deep red felt / velvet direction
- table material: dark lacquer + antique brass
- ornament: restrained Kanote first pass
- production dice: More Round + Softer
- dice material: warm ivory / aged resin first pass
- dice faces: production v1 animal art

---

### 41.4 Safety Rules Preserved

This QA preserved:

- visible physical dice source-of-truth
- no target correction in production
- no backend forced result
- no after-stop snapping
- no hidden mismatch handling
- no dev/lab UI in production
- mobile portrait readability
- muted project direction

---

### 41.5 Chapter 54.4 Acceptance Checklist

Chapter 54.4 is complete when:

- dice visual behavior was checked
- table visual quality was checked
- tray floor was checked
- top-face readability was checked
- ornament distraction risk was checked
- mobile portrait view was checked
- More Round + Softer remained acceptable
- `npm run build` passes

---

## 42. Chapter 54.5 — Camera / Trust QA After Table + Dice Polish

Status: Passed

Purpose:

Chapter 54.5 tested camera behavior and trust/source-of-truth behavior after the table + dice production polish branch.

This QA confirmed that the improved table, More Round + Softer dice candidate, and camera controls still support readable and trustworthy dice results.

---

### 42.1 Camera QA Scope

Checked route:

- `/six-animal`

Camera areas checked:

- default front view
- side drag view
- top-view drag
- mobile portrait readability
- stopped dice readability
- mounted dice visibility
- table side beauty visibility

---

### 42.2 Trust QA Scope

Checked trust behavior:

- visible dice remains source of truth
- result board waits for visible dice capture
- dice does not rotate after stopping
- no target correction appears in production
- no backend forced result appears
- no dev lab UI appears
- no debug physics appears
- no correction selector appears

---

### 42.3 Accepted Result

Chapter 54.5 passed because:

- default front view still works
- side drag shows table beauty without hiding dice
- top-view drag helps read dice top face
- camera does not make result unreadable
- visible physical dice remains the result source
- result board follows dice capture
- dice does not show suspicious after-stop correction
- no dev/debug/correction UI appears in production
- mobile portrait remains safe

---

### 42.4 Safety Rules Preserved

This QA preserved:

- visible physical dice source-of-truth
- More Round + Softer production dice candidate
- result capture trust
- target correction locked off
- no backend forced result
- no after-stop snapping
- no hidden mismatch handling
- no dev/lab UI in `/six-animal`
- muted project direction

---

### 42.5 Chapter 54.5 Acceptance Checklist

Chapter 54.5 is complete when:

- default camera view was checked
- side drag view was checked
- top-view drag was checked
- result readability was checked
- trust/source-of-truth behavior was checked
- no dev/debug/correction UI appeared
- mobile portrait remained safe
- `npm run build` passes

---

## 43. Chapter 54.5B — Mounted Dice Rack Continuity Fix

Status: Passed

Purpose:

Chapter 54.5B fixed a visual continuity issue with the upper mounted dice rack.

Before this fix, the wall-mounted dice could refill or change faces at the wrong time:

- mounted dice showed repeated crab faces
- dice dropped one by one but rack sometimes refilled after third drop
- result phase could suddenly show mounted dice again
- rack faces could appear to change randomly during result/reset
- next round returned to repeated crab-looking mounted dice

This made the dice holder feel confusing and less physical.

---

### 43.1 Root Cause

The mounted dice rack was controlled mostly by display-only behavior.

When rolling was not enabled, the stage could return to display-only mode and show all mounted dice again.

This caused the holder to visually refill before the next betting round was actually ready.

---

### 43.2 Updated Files

Updated files:

- `src/components/games/six-animal/ThreeDicePhysicsStage.tsx`
- `src/components/games/six-animal/ThreeDiceSequenceController.tsx`
- `src/app/six-animal/page.tsx`

---

### 43.3 Main Fix

Added phase-driven mounted dice rack control.

New rack modes:

```ts
export type MountedDiceRackMode = "ready" | "sequence" | "empty";

---

## 44. Chapter 54.6 — Final QA / Demo Lock After Table + Dice Polish

Status: Passed

Purpose:

Chapter 54.6 locks the final QA result after the Six Animal table + dice production polishing branch.

This chapter confirms that the improved table, tray floor, Kanote ornament, More Round + Softer dice candidate, mounted dice rack continuity fix, and full `/six-animal` room flow are stable enough for the current frontend demo/prototype baseline.

---

### 44.1 Final QA Covered

Chapter 54 final QA covered:

- full bet round QA
- no-bet round QA
- dice / table visual QA
- camera / trust QA
- mounted dice rack continuity QA
- build QA

Tested route:

- `/six-animal`

---

### 44.2 Accepted Current State

Current accepted `/six-animal` state:

- improved procedural 3D table remains active
- future table direction remains Hybrid GLB later
- production dice candidate is More Round + Softer
- tray floor feels smoother and less plastic
- Kanote ornament remains restrained
- palace room background remains active
- mounted dice rack continuity is fixed
- game remains muted
- visible physical dice remains source of truth

---

### 44.3 Production Dice Lock

Current active production dice candidate:

```ts
const PRODUCTION_DICE_SHAPE_PRESET: DiceShapePreset = "more-round";
const PRODUCTION_DICE_COLLIDER_PRESET: DiceColliderPreset = "softer";

## Chapter 67.2 — Production Realism Re-entry Decision Lock

Status: Passed and locked.

Chapter 67 re-entered the Six Animal visual production roadmap after completing the backend/admin safety lock.

Reason for re-entry:

The backend/admin safety foundation is now complete enough for this stage. The project can safely return to Six Animal production realism without weakening backend authority, wallet safety, admin security, or live-room trust.

Current accepted state:

* `/six-animal` remains the main MVP game room.
* Backend remains the dealer.
* Player browser only joins, watches, and submits valid bets.
* Player browser does not control round timing, dice result, wallet debit, payout, settlement, or round advancement.
* Admin pages remain read-only.
* Dealer RPCs remain locked.
* Wallet and financial integrity monitors are locked.
* RLS and table grants are cleaned.
* Build passes.

Table + dice roadmap review:

The existing table/dice production roadmap confirms that the current procedural table branch has already completed:

* Phase 47 — Table + Dice Roadmap Lock
* Phase 48 — Table Material System Upgrade
* Phase 49 — Kanote Ornament Layer
* Phase 50 — Dice Production Material Upgrade
* Phase 51 — Dice Shape / Physics Lab Upgrade
* Phase 52 — Custom Table Model Decision
* Chapter 53 — Table + Dice Production Polish Closeout
* Chapter 54 — Final QA / Demo Lock After Table + Dice Polish

Current active visual baseline:

* active table: improved procedural 3D table
* future final table direction: hybrid custom GLB visible table + invisible colliders
* production dice candidate: More Round + Softer
* dice body: warm ivory / aged resin first pass
* dice face textures: production v1 animal art
* tray floor: smoother deep red felt / velvet surface
* table material: dark lacquer + antique brass direction
* ornament: restrained Kanote first pass
* palace background: active
* game remains muted
* visible physical dice / backend result timeline remains protected
* no Gourd; locked animals remain Tiger, Dragon, Rooster, Fish, Crab, Elephant

Important decision:

Do not repeat random procedural table polish right now.

Reason:

The procedural table has already been improved enough for the current prototype baseline. More small color/box/ornament tweaks may waste time and create circular polishing. The roadmap already identifies the real final-quality path: a hybrid custom GLB table later, with the current simple invisible colliders preserved for trusted dice physics.

Locked final direction:

Use the hybrid table path later:

* visible table = custom GLB model
* dice physics = simple invisible colliders
* procedural table = fallback / collider reference / dev testing reference

Do not immediately integrate a GLB into production.

Future GLB integration rule:

1. Create or source a real custom table asset first.
2. Import into `/dev/three-dice` first.
3. Keep current invisible colliders.
4. Align visible GLB to current table anatomy.
5. Test dice drop, roll, stop, front lip collision, side rail collision, and top-face readability.
6. Only after lab pass, test `/six-animal`.
7. Keep procedural table fallback until GLB is fully accepted.

What must not change during the next visual branch:

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

Next recommended branch:

Chapter 68 — Custom Table / Dice Asset Production Preparation

Goal:

Prepare the production asset package for the future hybrid GLB path instead of continuing random procedural polish.

Recommended Chapter 68 sequence:

* Chapter 68.1 — Current Asset Inventory Audit
* Chapter 68.2 — Custom Table GLB Asset Folder / Registry Plan
* Chapter 68.3 — Table Model Prompt / Artist Brief Finalization
* Chapter 68.4 — Dice Final Asset Direction / GLB or Material Map Decision
* Chapter 68.5 — Dev Lab Import Plan
* Chapter 68.6 — Custom Asset Branch Lock

Decision lock:

The current procedural Six Animal table and More Round/Softer dice remain the active stable prototype. Final production realism now requires asset production discipline, not more random procedural polishing.

