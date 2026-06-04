# Nagani 3D Dice / Table Production Quality Plan

Status: Draft v0.1  
Project: Nagani Traditional  
Game: ၆ ကောင်ဂျင် / ဂလုန်းဂလုန်း

## 1. Current Prototype Status

The current `/six-animal` production room is good enough as a working visual prototype.

Current locked state:

- 3D-only room flow
- visible physical dice is the source of truth
- no backend forced result
- no target correction in production
- no old sample table fallback
- muted room, no real sound yet
- betting 20s
- bets closed 3s
- rolling waits for physical dice completion
- 2s result reveal pause
- result display 6s
- betting sheet, result board, settlement layer, and room atmosphere are polished enough for current prototype

## 2. What Is Good Enough Now

The current 3D table supports:

- clear dice focus
- readable dice path
- readable animal faces
- fixed table continuity between phases
- mobile portrait layout
- player trust because result comes from visible physical dice

Do not rebuild this immediately.

## 3. What Is Still Prototype

The current 3D table is still prototype geometry.

Prototype limits:

- table material is not real lacquer/wood/gold yet
- rails and runway are simple shapes
- dice model is still procedural rounded box
- animal face prints are texture planes, not final dice material
- lighting is good enough but not production cinematic
- cocked/tilted dice handling is basic
- no final 3D model asset pipeline yet

## 4. Production Dice Goal

Final dice should feel like real physical ၆ ကောင်ဂျင် dice:

- larger readable animal faces
- realistic rounded edges
- solid weight
- believable bounce and roll
- clear final top face
- no suspicious after-stop correction
- no invisible hand movement
- no backend target override shown to player

The final result must always feel caused by the visible dice.

## 5. Production Table Goal

Final table should feel like a premium Myanmar traditional dice table:

- dark red lacquer runway
- warm gold trim
- real wood/lacquer material feeling
- physical rails with believable thickness
- mounted dice holder/trapdoor area
- small deflector/stumble bar
- clear front landing area
- mobile readable composition

## 6. Result Trust Rule

Production rule:

The player room must not display a result that disagrees with visible dice.

Allowed now:

- visible physical dice capture
- result board mirrors visible dice
- settlement uses captured visible dice

Not allowed in production yet:

- forced backend result
- target correction
- late dice rotation after stop
- hidden result override
- suspicious mismatch between dice and board

## 7. Future Backend Target Strategy

Backend-controlled results should only be added after a natural animation strategy exists.

Possible future safe approach:

- backend sends target result
- frontend animation must physically land on matching result
- if visible dice does not match target, animation continues/rerolls naturally
- never snap or rotate after stop
- never show target before dice confirms it visually

Current decision:

Backend target completion remains OFF.

## 8. Future Production Asset Path

Later production upgrade can replace current procedural geometry with:

- final dice GLB model
- final table GLB model
- optimized mobile materials
- baked lighting or texture maps
- real animal face texture atlas
- better shadow setup

Current code should remain a stable prototype bridge until those assets are ready.

## 9. What Not To Touch Yet

Do not work on these now:

- backend wallet integration
- forced result logic
- real sound/audio system
- host/dealer character
- palace full 3D environment
- multiplayer/realtime logic
- admin monitoring

Those come later after the current production visual plan is locked.

## 10. Next Practical Steps

1. Lock this document.
2. Keep current `/six-animal` room stable.
3. Do not rebuild dice/table immediately.
4. Plan final dice model requirements.
5. Plan final table model requirements.
6. Later, create or commission production 3D assets.
7. Integrate production assets carefully without breaking visible dice trust.

## 11. Production Dice Asset Requirements

Final dice should eventually move from procedural rounded boxes to production-ready 3D assets.

### 11.1 Dice Model

Required:

- one reusable dice model
- rounded but not toy-like corners
- flatter readable faces
- solid physical weight feeling
- clean bevels
- no overly soft pillow shape
- no sharp perfect cube shape
- mobile-readable size

Preferred format:

- `.glb` or `.gltf`
- optimized for mobile
- low enough polygon count for repeated rolling
- separate material slots for body and faces if possible

### 11.2 Dice Face Design

Each die must support these six animals:

1. Tiger
2. Dragon
3. Rooster
4. Fish
5. Crab
6. Elephant

Face requirements:

- animal artwork must be clear at mobile size
- strong silhouette
- high contrast against dice body
- no emoji style
- no flat cheap icon style
- no text required on final dice face
- each animal must be distinguishable during quick result reading

### 11.3 Dice Material

Target material feeling:

- ivory/gold traditional dice body
- slightly rough physical surface
- not plastic toy
- not overly metallic
- warm premium lacquer/ceramic feeling

### 11.4 Physics / Collider Requirements

The visual dice and physics collider must match closely enough.

Rules:

- dice must roll naturally
- dice must not feel too heavy and dead
- dice must not fly unnaturally before landing
- dice must not clip through table
- dice must not stop unreadably too often
- dice collider can be simplified, but final face orientation must remain readable

### 11.5 Result Trust Requirements

The final result must always come from visible dice.

Not allowed:

- hidden result override
- after-stop rotation
- forced correction visible to player
- mismatch between dice and result board

Allowed later only if natural:

- backend target result with natural physical landing
- reroll/continue animation if visible dice does not match backend target
- cocked dice invalid handling

### 11.6 Asset Acceptance Checklist

A production dice asset is accepted only when:

- all six faces are readable on iPhone portrait
- dice rolls naturally inside current table
- top face can be detected confidently
- no suspicious final movement appears
- result board matches visible dice
- build passes
- 10-round QA passes without major unreadable result problem

## 12. Production Table Asset Requirements

The final table should eventually move from procedural prototype geometry to a production-quality 3D table asset.

### 12.1 Table Model Goal

The table must feel like a real premium ဂလုန်းဂလုန်း / ၆ ကောင်ဂျင် physical table.

Required structure:

* upper mounted dice holder
* three dice positions
* individual trapdoor/shutter area
* small deflector/stumble bar
* long sloped runway
* lower landing area
* side rails
* front player-side lip
* clear physical boundary so dice cannot escape

The table should look fixed and heavy, not like a toy prop.

### 12.2 Table Material Direction

Target material feeling:

* dark red lacquer
* deep wood body
* warm gold trim
* slightly worn physical edges
* subtle surface roughness
* no cheap plastic shine
* no flat browser-game color blocks

The final table should feel traditional, expensive, and believable.

### 12.3 Dice Visibility Requirement

The table must support dice readability first.

Rules:

* front lip must not hide final dice face
* side rails must not block top-face reading
* runway must guide the eye toward the dice
* result area must stay visually clear on mobile portrait
* mounted dice area must be visible but not distracting

Visible dice result is more important than decorative table detail.

### 12.4 Physics / Collider Requirements

Visual table and physics colliders must align closely.

Required:

* dice must land inside the table
* dice must not clip through rails
* dice must not fly out of the tray
* front and side borders must contain dice naturally
* deflector bar should influence dice physically, not through fake force
* collider simplification is allowed only if visual trust remains strong

### 12.5 Mobile Performance Requirements

The table asset must be optimized for mobile.

Required:

* lightweight `.glb` or `.gltf`
* optimized mesh count
* optimized material count
* no unnecessary high-poly ornaments
* baked details preferred where possible
* stable on iPhone portrait
* stable on mid-range Android devices

### 12.6 Production Table Acceptance Checklist

A production table asset is accepted only when:

* dice path is easy to understand
* dice face remains readable after landing
* table feels premium and traditional
* table does not distract from dice
* physics colliders feel believable
* no clipping or escape problem appears in normal testing
* `/six-animal` mobile portrait remains clean
* build passes
* 10-round QA passes

## 13. Result Detection / Cocked Dice Handling Requirements

Final production must protect result trust when dice stops at an unclear angle.

### 13.1 Current Prototype Status

Current prototype detects the top face by comparing dice face direction against world-up.

Current rule:

- accepted if confidence is high enough
- cocked if dice stops at unreadable tilt
- visible physical dice remains the source of truth

This is good enough for prototype, but production needs clearer handling.

### 13.2 Production Result Detection Goal

Production result detection must feel invisible and trustworthy.

Required:

- detect top face only after dice fully settles
- use visible dice orientation
- avoid accepting tilted/cocked dice too easily
- avoid false result capture
- avoid result mismatch between dice and board

### 13.3 Cocked Dice Definition

A dice result is cocked when:

- no top face is clearly upward
- dice rests against rail or front lip awkwardly
- dice is tilted too much
- confidence is below accepted threshold
- player cannot visually confirm the top face

Cocked dice should not be treated as a normal final result.

### 13.4 Production Cocked Dice Handling

Allowed handling:

- continue natural rolling if dice is still moving
- wait slightly longer before capture
- declare invalid/cocked internally
- reroll that die naturally
- show result only after valid visible face exists

Not allowed:

- snapping dice after stop
- rotating dice invisibly
- accepting unreadable face
- showing result board before visible dice confirms it
- hiding mismatch from player

### 13.5 Backend Integration Rule

When backend integration arrives:

- backend may provide target result
- visible dice must still confirm the result
- if dice lands cocked or wrong, animation must continue/reroll naturally
- final board must only show confirmed visible dice
- settlement must wait until valid visible result exists

### 13.6 Acceptance Checklist

Result detection is production-ready only when:

- top face detection is stable
- cocked dice is not accepted as valid result
- reroll/continue behavior feels natural
- no suspicious correction is visible
- result board always matches visible dice
- 10-round QA passes
- 30-round stress QA has no major trust issue

## 14. Production Asset Replacement / Integration Phases

Production 3D upgrade must be done carefully. The current `/six-animal` room is stable, so final assets should replace prototype pieces step by step.

### 14.1 Integration Rule

Do not replace everything at once.

Each production asset upgrade must preserve:

* current round flow
* visible physical dice source of truth
* table continuity
* mobile portrait layout
* result board matching visible dice
* betting and settlement UI stability

### 14.2 Phase 1 — Dice Visual Asset Replacement

First production upgrade should be dice visual quality.

Scope:

* replace procedural dice body with final dice model
* keep current physics behavior as close as possible
* keep current result detection rules
* keep current table geometry
* test all six animal faces

Acceptance:

* dice rolls naturally
* animal faces are readable
* result detection still works
* no suspicious final movement appears
* build passes

### 14.3 Phase 2 — Dice Material / Face Texture Upgrade

After dice model works, improve material quality.

Scope:

* final dice body material
* final animal face texture atlas
* better contrast
* better roughness/lighting response
* no text labels needed

Acceptance:

* mobile readability improves
* dice still feels physical
* no plastic toy feeling
* all six faces remain distinguishable

### 14.4 Phase 3 — Table Visual Asset Replacement

After dice is stable, replace or upgrade table visuals.

Scope:

* production table model
* lacquer/wood/gold materials
* mounted holder detail
* rails/front lip visual quality
* deflector bar detail

Acceptance:

* dice path remains clear
* dice does not get hidden
* table improves realism without distracting from dice
* mobile performance remains stable

### 14.5 Phase 4 — Collider Alignment Pass

After visual table replacement, align physics colliders.

Scope:

* runway collider
* side rail colliders
* front lip collider
* backboard collider
* deflector bar collider
* trapdoor/drop area

Acceptance:

* dice stays inside table
* dice does not clip
* dice does not escape
* cocked dice frequency is acceptable
* 10-round QA passes

### 14.6 Phase 5 — Production QA Lock

Final asset upgrade is accepted only after:

* betting round works
* closed phase works
* rolling works
* result board works
* settlement works
* next round reset works
* mobile portrait QA passes
* 30-round dice/result stress QA passes
* build passes

### 14.7 What Must Stay Untouched During Asset Replacement

Do not change these during visual asset replacement unless necessary:

* wallet logic
* backend result strategy
* sound system
* betting rules
* settlement formula
* round timing
* result trust rule

Asset upgrades must not break the stable room flow.

## 15. Current Prototype Freeze / Production Quality Lock

The current `/six-animal` room should be treated as the stable prototype baseline.

### 15.1 Frozen Prototype Baseline

Current baseline:

- mobile-first 3D Six Animal room
- visible physical dice source of truth
- 3D-only table flow
- no old sample table fallback
- no backend forced result
- no production target correction
- no sound/audio implementation
- betting sheet accepted
- result board accepted
- settlement layer accepted
- room atmosphere accepted
- full room flow QA passed

### 15.2 What Can Change Later

Allowed future changes:

- final dice model
- final dice animal face textures
- final table model
- final table material
- improved lighting/shadows
- cocked dice reroll handling
- backend round state after visual trust remains stable

### 15.3 What Must Not Be Broken

Future work must not break:

- visible dice/result trust
- betting 20s
- bets closed 3s
- rolling waits for physical dice completion
- 2s reveal pause
- result display 6s
- mobile portrait layout
- settlement clarity
- muted room direction
- build stability

### 15.4 Chapter 33 Lock Decision

Chapter 33 is a planning chapter.

Do not start production 3D asset replacement until:

- this plan is accepted
- final dice asset direction is ready
- final table asset direction is ready
- asset replacement can be tested safely in phases

Current decision:

Keep the current 3D dice/table prototype stable and move forward with product planning before deeper asset replacement.