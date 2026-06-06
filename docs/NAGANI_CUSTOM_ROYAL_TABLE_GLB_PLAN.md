# Nagani Custom Royal Table GLB Plan

## Chapter 78 — Custom Royal Table GLB / Final Game Room Visual Polish

### 78.1 Custom Royal Table GLB Requirement Lock

Status: Planning first. No production code swap yet.

---

## Purpose

The Six Animal live room is now gameplay-stable after Chapter 77.

Chapter 78 focuses only on final 3D visual production polish for the dice table and game room.

The main goal is to replace the prototype-looking procedural table with a custom royal Myanmar Six Animal table model while protecting the working dice physics, backend trust flow, wallet, betting, result, and settlement logic.

---

## Current Stable Baseline

Current production room already has:

- Server-authority round state.
- Backend-locked result before dice drop.
- Local cinematic dice flow.
- Refresh after Bets Closed / Rolling / Result waits for next betting.
- Visible dice result flow.
- Three sequential dice.
- Betting sheet.
- Result board.
- Settlement modal.
- Mobile-first room layout.
- Palace background.
- Production dice face textures.
- Production animal card art.

This baseline must not be broken.

---

## Current Table Architecture

Current table is built procedurally in:

`src/components/games/six-animal/ThreeDicePhysicsStage.tsx`

Important current table parts:

- Table measurements.
- Sloped runway.
- Lower settling tray.
- Backboard.
- Dice holder shelf.
- Trapdoor flaps.
- Stumble bar / deflector.
- Front lip / rebound area.
- Side rails.
- Invisible safety guards.
- Human POV camera.

Current physics depends on simple colliders. This is valuable and must be protected.

---

## Final Production Table Direction

The final table should feel like a real royal Myanmar traditional Six Animal dice table, not a toy browser model.

Visual style:

- Red lacquer royal wood.
- Deep dark maroon / black lacquer depth.
- Gold Kanote ornament trim.
- Brass/gold rail accents.
- Strong but elegant front lip.
- Clear dice runway.
- Clear lower tray.
- Mounted dice holder at the back.
- Trapdoor/flap impression for three dice.
- Physical stumble/deflector bar.
- Premium furniture feeling.
- Mobile-readable dice area.

The table should look expensive, handcrafted, and culturally Myanmar-inspired.

---

## Important Technical Decision

Use hybrid architecture:

### Visible table

A beautiful custom `.glb` model.

### Physics table

Simple invisible colliders.

This means the game can look production-quality while dice physics stays stable and controllable.

Do not depend on the GLB mesh for dice physics.

---

## Planned Asset Path

Future GLB path:

`public/assets/nagani/six-animal/table-models/six-animal-royal-table-v1.glb`

Future optional texture folder:

`public/assets/nagani/six-animal/table-models/textures/`

---

## Production GLB Requirements

The GLB model should include visual geometry only:

- Backboard.
- Dice holder shelf.
- Three trapdoor/flap visuals.
- Main sloped runway.
- Lower tray.
- Side rails.
- Front lip.
- Stumble/deflector bar.
- Kanote trim.
- Gold/brass accents.
- Lacquer body.

The GLB should not be required for physics collision.

---

## Collider Protection Rule

Current colliders must remain the source of dice physical behavior until a separate collider QA passes.

Allowed:

- Hide or reduce procedural visual meshes after GLB is accepted.
- Keep procedural colliders invisible.
- Align GLB visually over existing collider measurements.
- Adjust GLB scale/position in dev preview.

Not allowed:

- Replace working dice physics with complex GLB mesh collisions.
- Break dice result detection.
- Change backend result authority.
- Change Chapter 77 refresh/timeline behavior.
- Change wallet/betting/settlement/admin logic.

---

## Mobile Requirements

The final table must work first on mobile portrait.

Acceptance requirements:

- Dice top faces remain readable.
- Result board does not block dice view.
- Betting sheet still feels natural.
- Player can see dice runway and tray.
- Front lip does not hide stopped dice.
- Table looks premium from default camera.
- Top-view drag still helps read dice surface.
- No major FPS drop on mobile.

---
## Chapter 78 Safe Implementation Phases

### 78.1 Requirement Lock

Create and accept this document.

### 78.2 Asset Folder / Registry Preparation

Prepare the table model folder and reserve the future asset path.

No production rendering yet.

### 78.3 Dev Table Preview Lab Preparation

Prepare the isolated `/dev/three-dice` table preview lab.

Do not load GLB yet unless a real acceptable GLB exists.

### 78.4 GLB Asset Readiness / Model Creation Requirement

Confirm the real production GLB does not exist yet and define how to create it.

### 78.5 Royal Table GLB Creation Prompt / Handoff Pack

Prepare the exact prompt / 3D artist handoff.

### 78.7A Meshy 5 Table Rejection / Quality Gate Lock

Reject the Meshy 5 result because it looks cheap / toy-like and is too heavy for mobile.

### 78.7B Custom Royal Table Modeling Requirement Lock

Define the exact custom Blender / artist requirements.

### 78.8 Blender / Artist Correction Plan

Use the current prototype table as anatomy truth.

### 78.9 Dev Lab GLB + Invisible Collider Separation

Preview only in `/dev/three-dice`.

### 78.10 Production Swap Readiness QA

Check visual quality, dice physics, camera, and mobile FPS.

### 78.11 Safe `/six-animal` Visual Swap

Only after dev lab passes.

### 78.12 Final Royal Table Lock

Lock final screenshots/video proof.

Status: Passed / Locked

The Meshy 5 generated royal table model is rejected for production use.

Reason:
- Looks cheap / toy-like.
- Gold details look melted.
- Wood carving is noisy and not true royal craftsmanship.
- Gameplay anatomy is not trustworthy.
- Dice runway, stopper, rails, deflector bar, and gate area are not accurate enough.
- Topology is too heavy for mobile: around 576k faces / 321k vertices.

Decision:
- Do not wire this GLB into `/six-animal`.
- Do not use it as production table.
- Do not spend more credits on blind Meshy regeneration.
- Keep the current prototype table as gameplay anatomy truth.
- Final royal table must be custom modeled in Blender or by a 3D artist.
- The final visible GLB must match the tested prototype table shape.
- Dice physics must use simple invisible colliders, not complex decorative mesh.

Next step:
Chapter 78.7B — Custom Royal Table Modeling Requirement Lock.

## Chapter 78.7B — Custom Royal Table Modeling Requirement Lock

Status: Locked.

The final royal Six Animal table must be custom modeled in Blender or by a 3D artist.

The current procedural prototype table remains the gameplay anatomy truth.

The final GLB must not invent a new dice table shape. It must match the tested prototype structure first, then improve visual quality.

Required anatomy to match:

* Long dice runway.
* Correct runway slope direction.
* Lower dice landing tray.
* Raised side rails.
* Strong front stopper / rebound lip.
* Tall rear backboard.
* Three rear dice gate / flap positions.
* Small deflector / stumble bar.
* Clear open dice rolling space.
* Mobile-readable dice surface from the current camera.

Visual upgrade requirements:

* Deep dark red lacquer wood.
* Premium black / maroon lacquer depth.
* Gold Myanmar Kanote decoration.
* Brass or gold rail accents.
* Handcrafted royal furniture feeling.
* Clean red dice runway surface.
* No toy-like melted geometry.
* No noisy fake carving.
* No cartoon style.
* No casino slot machine style.

Technical rule:

The visible GLB is only the beauty layer.

Dice physics must continue to use simple invisible colliders.

The GLB mesh must not be used as the dice physics collider.

Production protection:

Do not touch `/six-animal` yet.
Do not change backend.
Do not change wallet.
Do not change admin.
Do not change betting.
Do not change settlement.
Do not change Chapter 77 dice timeline.
Do not change dice result detection.

Next step:

Chapter 78.8 — Blender / Artist Correction Plan.

## Chapter 78.8 — Blender / Artist Correction Plan

Status: Planned.

The final royal table must be built or corrected in Blender using the current prototype table as the exact gameplay reference.

The goal is not to create a new table design.

The goal is to create a premium royal visual shell that matches the existing working dice table anatomy.

Blender / artist correction requirements:

* Match the current prototype runway length.
* Match the current runway slope direction.
* Match the lower tray width and depth.
* Match the side rail height.
* Match the front stopper / rebound lip position.
* Match the small deflector / stumble bar position.
* Match the rear three-dice gate spacing.
* Keep the dice rolling area open and clean.
* Keep the dice top faces visible from mobile camera.
* Remove any ornament that enters the dice rolling path.
* Keep Kanote decoration on outer body, rails, backboard, and front panel only.
* Keep the interior dice runway clean.

Modeling rule:

The table should be made from clean geometry first.

Decoration should be added after the gameplay shape is correct.

Physics rule:

Do not build physics into the GLB.

The game will use invisible simple colliders for dice physics.

The GLB is visual only.

Export requirement:

Final file path:

`public/assets/nagani/six-animal/table-models/six-animal-royal-table-v1.glb`

Next step:

Chapter 78.9 — Dev Lab GLB + Invisible Collider Separation.

## Chapter 78.9 — Dev Lab GLB + Invisible Collider Separation

Status: Planned / Waiting for acceptable GLB.

The royal table GLB must be tested only in the isolated dev lab before production.

Dev lab route:

`/dev/three-dice`

Production route protected:

`/six-animal`

Important rule:

Do not load any rejected Meshy 5 GLB.

Do not load any unfinished or toy-like GLB.

Only an acceptable custom Blender / artist-made GLB may be previewed.

Preview rule:

The GLB must be visual only.

Dice physics must continue to use the existing simple invisible colliders.

The dice must not collide with the decorative GLB mesh.

Dev lab acceptance requirements:

* GLB loads only in `/dev/three-dice`.
* `/six-animal` remains untouched.
* Dice still drops correctly.
* Dice still hits the deflector bar correctly.
* Dice still rolls inside the tray.
* Dice still rebounds from the front stopper.
* Dice still settles naturally.
* Result detection still works.
* Camera still shows dice top faces.
* Mobile performance remains acceptable.
* GLB decoration does not block the dice runway.

Not allowed:

* No production visual swap.
* No backend change.
* No wallet change.
* No betting change.
* No settlement change.
* No Chapter 77 timeline change.
* No dice physics rewrite.
* No GLB mesh collider.

Next step:

Chapter 78.10 — Production Swap Readiness QA.

## Chapter 78.10 — Production Swap Readiness QA

Status: Planned / Waiting for acceptable GLB.

The royal table GLB cannot be moved into production until it passes dev lab QA.

Production route:

`/six-animal`

Dev test route:

`/dev/three-dice`

Production swap requirements:

* GLB must look premium, not toy-like.
* GLB must match current prototype table anatomy.
* Dice runway must stay clear.
* Tray must not hide dice.
* Front stopper must not block camera view.
* Side rails must contain dice visually.
* Deflector bar must align with current dice behavior.
* Rear gate area must match three dice release positions.
* Dice top faces must stay readable on mobile.
* Full three-dice roll must still feel exciting.
* No FPS drop on mobile portrait.
* No result detection regression.
* No backend/timeline/wallet/betting/settlement change.

Required QA before production swap:

* Dev lab front-view screenshot.
* Dev lab top-view screenshot.
* Dev lab side-view screenshot.
* Dev lab diagonal-view screenshot.
* One full three-dice roll test.
* One mobile portrait visual test.
* One result detection test.
* One performance check.

Fail condition:

If the GLB looks cheap, blocks dice, changes gameplay feeling, hurts mobile performance, or does not match prototype anatomy, it must not enter `/six-animal`.

Next step:

Chapter 78.11 — Safe `/six-animal` Visual Swap.

## Chapter 78.10B — Royal Table GLB Waiting Lock / Asset Blocker

Status: Blocked / Waiting for acceptable custom GLB.

Chapter 78.11 Safe `/six-animal` Visual Swap must not start yet.

Reason:

- No acceptable custom Blender / artist-made royal table GLB exists yet.
- Meshy 5 result is rejected.
- Production `/six-animal` must stay protected.
- Current prototype table remains the working gameplay table.

Locked decision:

Do not load rejected GLB.
Do not preview toy-like GLB.
Do not wire any GLB into `/six-animal`.
Do not change dice physics.
Do not change backend, wallet, betting, settlement, or Chapter 77 timeline.

Next allowed work:

Create or hire for a proper custom royal table GLB that matches the current prototype anatomy.

After the real GLB exists, continue:

Chapter 78.11 — Safe `/six-animal` Visual Swap.

## Chapter 78.10C — Prototype Table Anatomy Reference Extraction

Status: Extracted / Locked.

This section records the current working prototype table anatomy from:

`src/components/games/six-animal/ThreeDicePhysicsStage.tsx`

This prototype is the gameplay anatomy truth for the future custom royal table GLB.

The final GLB must match this structure first, then improve visual quality.

### Coordinate Direction

* Player/front side faces positive Z.
* Backboard / dice holder side is negative Z.
* Dice travels from back to front.
* The table is long front-to-back, not wide sideways.

### Main Table Size

* Floor width: `4.45`
* Floor depth: `6.75`
* Half width: `2.225`
* Half depth: `3.375`
* Floor center Y: `-1.05`
* Floor center Z: `0.35`

### Runway / Tray Shape

Back edge:

`Z = -3.025`

Front edge:

`Z = 3.725`

Transition between upper runway and lower settling tray:

`Z = 1.3`

Upper runway:

* Depth: `4.325`
* Slope angle: `0.3 rad`
* Purpose: keeps dice lively after drop.

Lower settling tray:

* Depth: `2.425`
* Slope angle: `0.12 rad`
* Purpose: lets dice continue rolling but slows naturally.

Artist rule:

The final GLB must keep this two-zone floor feeling:

* upper lively runway
* lower calmer settling tray

Do not make the tray fully flat.
Do not make a reverse triangle slope.
Do not block the dice landing area.

### Backboard

Backboard position:

`[0, 1.05, -3.145]`

Backboard visual size:

`[4.57, 4.45, 0.26]`

Backboard rule:

The final GLB needs a strong tall rear backboard connected to the table body.

### Dice Holder / Rear Gate

Dice holder X positions:

`[-1.0, 0, 1.0]`

Trapdoor Z:

`-2.325`

Dice holder shelf position:

`[0, 2.1, -2.425]`

Dice holder shelf size:

`[3.12, 0.12, 0.28]`

Trapdoor flap positions:

`[-1.0, 2.28, -2.295]`
`[0, 2.28, -2.295]`
`[1.0, 2.28, -2.295]`

Trapdoor flap size:

`[0.72, 0.045, 0.54]`

Waiting dice position height:

`Y = 2.82`

Artist rule:

The GLB must show three rear dice gate / flap areas clearly.

Do not make one large generic shelf.
Do not hide the three-dice release structure.

### Deflector / Stumble Bar

Deflector bar position:

`[0, 0.36, -2.365]`

Deflector bar rotation:

`[0.12, 0, 0]`

Deflector bar visual size:

`[3.35, 0.055, 0.15]`

Deflector collider half-size:

`[1.675, 0.028, 0.075]`

Artist rule:

The deflector bar must be small and wall-mounted.

It should guide/stumble the dice, not block the dice.

Do not make it thick.
Do not make it too high.
Do not make it decorative-only if it changes the visual dice path.

### Front Stopper / Rebound Lip

Front visual lip position:

`[0, -1.461, 3.805]`

Front visual lip size:

`[4.45, 0.46, 0.3]`

Front gold trim position:

`[0, -1.201, 3.645]`

Front gold trim size:

`[4.03, 0.045, 0.075]`

Invisible angled rebound collider:

* position: `[0, -1.131, 3.625]`
* rotation: `[-0.24, 0, 0]`
* half-size: `[2.145, 0.075, 0.18]`
* restitution: `0.78`
* friction: `0.08`

Invisible keeper wall:

* position: `[0, -1.341, 3.825]`
* half-size: `[2.225, 0.36, 0.11]`
* restitution: `0.46`
* friction: `0.14`

Artist rule:

The front stopper must feel strong and premium, but it must not hide the dice from mobile camera.

It should visually support rebound, not kill dice motion.

### Side Rails

Left rail position:

`[-2.225, -0.97, 0.35]`

Right rail position:

`[2.225, -0.97, 0.35]`

Rail rotation:

`[0.3, 0, 0]`

Rail visual size:

`[0.28, 1.32, 6.75]`

Rail collider half-size:

`[0.14, 1.18, 3.375]`

Artist rule:

Side rails must contain dice, but must not hide dice top faces.

Kanote decoration should stay outside or on top edges, not inside the dice path.

### Safety Guards

Front emergency escape guard:

* position: `[0, 0.12, 4.065]`
* half-size: `[2.225, 1.05, 0.08]`

Left escape guard:

* position: `[-2.265, 0.12, 0.35]`
* half-size: `[0.12, 1.3, 3.375]`

Right escape guard:

* position: `[2.265, 0.12, 0.35]`
* half-size: `[0.12, 1.3, 3.375]`

Artist rule:

These are invisible gameplay guards.

The GLB should not copy these as visible thick walls unless needed visually.

### Dice Drop Reference

Trapdoor mode dice start position:

`[activeDieX, 2.9, -2.55]`

Runway test dice start position:

`[activeDieX, 0.25, -1.45]`

Active dice X positions:

`[-1.0, 0, 1.0]`

Artist rule:

The rear holder and gate must visually align with these three drop lanes.

### Camera Reference

Production room camera base:

* height: `5.05`
* distance: `10.95`
* default top view: `0.48`
* look target Y: `0.04`
* look target Z: `-0.22`
* FOV: `45`

Artist rule:

The final GLB must look good from the current mobile camera.

Do not make the front lip, rails, or ornaments block dice top-face visibility.

### Final Artist / Blender Rule

Build the GLB as a beauty shell only.

The GLB must match this prototype anatomy:

* same long runway
* same two-zone slope concept
* same rear three-gate spacing
* same small deflector bar location
* same side rail containment
* same front stopper/rebound feeling
* same mobile dice readability

The GLB must not be used as physics collider.

Dice physics will continue using simple invisible colliders.

## Chapter 78.10E — Artist Handoff Reference Lock

Status: Passed / Locked.

The clean artist handoff document now exists:

`docs/NAGANI_ROYAL_TABLE_ARTIST_HANDOFF.md`

This handoff is the document to give to a Blender artist or 3D modeler.

It includes:

* Non-negotiable requirements.
* Prototype anatomy measurements.
* Modeling instructions.
* Decoration rules.
* Material direction.
* Export requirements.
* Final acceptance checklist.

Decision:

Do not continue Chapter 78.11 yet.

Chapter 78.11 Safe `/six-animal` Visual Swap is blocked until a real acceptable custom royal table GLB exists.

Next real-world step:

Create or hire for the final GLB using the artist handoff document.

## Chapter 78.10F — GLB Branch Pause / Procedural Table Polish Pivot

Status: Passed / Locked.

The royal table GLB branch is paused.

Reason:

The current procedural table is already close to the desired final structure.

The main remaining issue is not the whole table shape.

The main issue is the rear dice mechanism:

* Dice holder feels separated from the wall.
* Deflector bar still feels slightly floating.
* Dice appears to free-fall almost straight down into the bar.
* The rear sloped wall / chute does not yet feel useful enough.
* Dice should look like it leaves the rear holder, follows the wall/chute, hits the deflector bar, then jumps/rolls down the runway.

Decision:

Do not continue GLB generation now.

Do not start Chapter 78.11 Safe `/six-animal` Visual Swap.

Do not load rejected Meshy 5 GLB.

Do not replace the current working table.

Keep the current procedural table as the production gameplay table.

New direction:

Continue with non-GLB polish.

The table should be improved like painting/finishing a real installed table:

* Improve table materials.
* Improve royal lacquer feeling.
* Improve gold trim depth.
* Improve rear holder connection.
* Improve rear chute / slide feeling.
* Improve deflector mounting.
* Preserve current dice physics and backend flow.

Next chapter:

Chapter 79 — Procedural Royal Table Skin + Rear Chute Connection Polish.

Protected systems:

* Do not touch backend.
* Do not touch wallet.
* Do not touch admin.
* Do not touch Supabase functions.
* Do not touch betting.
* Do not touch settlement.
* Do not touch Chapter 77 server-authority cinematic dice timeline.
* Do not change result ownership.
* Do not replace dice physics system.


## Chapter 79.4 — Procedural Table Polish / Timing Lock

Status: Passed / Locked.

Chapter 79 confirms the current procedural table remains the active production table.

Completed improvements:

- Removed failed rear chute add-on.
- Kept the table simple and clear.
- Rebuilt dice holder area as clean wall-mounted flat dice doors.
- Added simple hinge bars at the wall-door connection.
- Removed confusing connector / seesaw / side-door designs.
- Improved dice drop direction so dice moves more forward from the wall-door area.
- Fixed first dice timing so Dice 1 drops immediately after Bets Closed countdown ends.
- Backend result is preloaded during Bets Closed.
- Frontend starts local cinematic dice flow from the locked backend result.
- Backend remains result authority.
- Chapter 77 refresh rule remains protected.

Current accepted table state:

- No GLB replacement.
- No Meshy model.
- No extra rear mechanism.
- Current procedural table is production gameplay table.
- Dice holder / doors look clean enough for this stage.
- Dice drop timing feels better.
- Production flow passes.

Do not continue Chapter 78.11 Safe `/six-animal` GLB Swap until a real acceptable custom GLB exists.

Next safe branch:

Chapter 80 — Final Visual QA / Small Polish Lock.

## Chapter 80.1 — Final Visual QA / Small Polish Lock

Status: Passed / Locked.

After Chapter 79, `/six-animal` was tested again in production room flow.

QA passed:

- Mobile portrait full round.
- Betting sheet readability.
- Bets Closed 3s timing.
- Dice 1 drops immediately after Bets Closed countdown ends.
- Dice holder / flat wall-mounted doors look clean.
- Dice drop direction feels more natural.
- Result board waits for visual dice progress.
- Settlement appears only after all 3 dice visually complete.
- Next round reset works.
- Backend / wallet / betting / settlement flow remains protected.

Current accepted state:

The current procedural table is good enough for this stage.

Do not restart GLB replacement work.

Do not randomly polish table/dice/physics.

Only continue with small confirmed visual fixes if a real problem is seen.

## Chapter 80.2 — Final Room Stop Point / Next Branch Lock

Status: Passed / Locked.

Six Animal visual/table polish is stopped here for now.

Current accepted state:

- Current procedural table remains production gameplay table.
- GLB replacement branch is paused.
- Rejected Meshy/toy GLB models must not be loaded.
- Dice holder / wall-mounted flat doors are accepted.
- Dice drop direction is accepted.
- First dice starts immediately after Bets Closed countdown ends.
- Production room QA passed after Chapter 79 and Chapter 80.1.
- Backend / wallet / betting / settlement / Chapter 77 timeline remain protected.

Decision:

Do not continue random table, dice, physics, or GLB polishing unless a real blocker appears.

Next major branch should be chosen deliberately.

Recommended next branch:

Chapter 81 — Demo / Deploy Readiness Final Pass.

Purpose:

Confirm the stable Six Animal room is ready for demo/deploy without changing the accepted visual baseline.

## Chapter 81.1 — Dice Result Truth Audit / Current Behavior Lock

Status: Current behavior identified.

Current dice result behavior:

- Backend is still the result authority.
- Frontend receives backend result animals before dice reveal.
- ThreeDiceSequenceController runs a timed cinematic dice sequence.
- Result board is filled from backend result timing.
- Active rolling dice currently hides face art when backend results are present.
- Current dice is therefore demo/cinematic result reveal, not final visible-face truth.

Important current limitation:

The stopped physical dice face may not visually prove the backend result yet.

Final production requirement:

The visible dice must stop/show the correct backend result clearly enough that players trust it.

Goal for Chapter 81:

Improve result truth without returning to suspicious forced rotation.

Allowed future work:

- Use backend result as target.
- Make final stopped dice show/read as the backend animal.
- Keep visual motion believable.
- Avoid obvious after-stop correction.
- Avoid sudden fake rotation.
- Preserve Chapter 77 backend authority.
- Preserve Chapter 79 table/door/timing lock.

Not allowed:

- Do not change backend result ownership.
- Do not touch wallet.
- Do not touch betting.
- Do not touch settlement.
- Do not restart GLB/table polish.

## Chapter 81.2 — Correct Visible Target Face Strategy

Status: Strategy locked before code.

Current problem:

The backend result is correct, but the visible dice does not yet clearly prove the backend result.

Production truth:

Backend remains result authority.

The frontend is the visual dealer.

The final visible dice must support the backend result clearly enough for player trust.

Rejected approaches:

- Do not rotate the dice after it visibly stops.
- Do not use suspicious invisible-hand correction.
- Do not make backend result depend on random browser physics.
- Do not return to full physical result detection as production authority.
- Do not break Chapter 77 timeline.
- Do not touch wallet, betting, settlement, admin, or backend functions.

Correct strategy:

Use backend result as the target animal.

During rolling, the dice can remain cinematic and hidden/partly sealed.

At the result reveal moment, the visible dice must show the backend target face clearly.

The transition must happen before or during the natural final reveal, not after the dice has already stopped visibly.

Safe implementation direction:

1. Keep backend result authority.
2. Keep cinematic dice timing.
3. Do not force late rotation after stop.
4. Add controlled final visible-result presentation.
5. Make each die show the target animal face clearly at reveal.
6. Keep motion believable and mobile-readable.
7. Test first in dev/protected mode before treating as production final.

Goal:

Player should feel:

- Dice dropped.
- Dice rolled.
- Dice stopped.
- The visible dice face matches the result board.
- No suspicious late correction.

## Chapter 81.3B — Same Dice Result Truth Strategy

Status: Strategy locked before code.

The separate target/result display dice prototype was rejected.

Reason:

- It made the rolling dice disappear.
- It made a new dice appear in the table.
- It felt like a dice swap.
- It reduced player trust.

Correct final direction:

- The same dice must drop.
- The same dice must roll.
- The same dice must stop.
- The visible stopped face must match the result board.
- Result board must wait for the dice reveal moment.
- After reveal, hold about 1.5 seconds so player can check the dice and result board.
- Then the next dice drops.

Timing rule:

Do not force result reveal by blind timer.

The dice sequence should follow real-life feeling:

Dice drops → dice rolls → dice settles/reveal is safe → result board updates → 1.5s check time → next dice.

Protected:

- No dice swap.
- No separate result dice.
- No suspicious after-stop rotation.
- No backend result ownership change.
- No wallet change.
- No betting change.
- No settlement change.
- No table/GLB restart.

We are working on Nagani Traditional / Six Animal live room.

Task:
Implement Chapter 81.4B — Fixed Dealer Show Timeline.

Important protected rules:

* Do not touch backend, wallet, admin, Supabase functions, betting submission, settlement calculation, table design, GLB, camera, or assets.
* Backend remains result authority.
* Frontend is only the visual dealer show.
* No fake dice swap.
* No separate result dice.
* No result board before dice show timing.
* No uncontrolled physics wait.
* Refresh after Bets Closed/Rolling/Result should not restore/replay dice.

Main file:
src/components/games/six-animal/ThreeDiceSequenceController.tsx

Current problem:
The live sequence waits for faceResult before capturing each die. This lets browser physics control timing. On slow devices the dice can roll/shake too long and next round can start while dice is unfinished.

Required change:
Change the sequence controller to use a bounded fixed dealer-show timeline.

Desired timing:

* Betting remains 20s elsewhere.
* Bets Closed remains 3s elsewhere.
* Dice show total should be bounded around 18s.
* Each die should:

  1. start/drop immediately when its turn starts,
  2. visually roll for a fixed period,
  3. capture backend target result by timer,
  4. show result board,
  5. hold about 1.5s,
  6. then start next die.
* Do not wait for faceResult to reveal/capture result.

Implementation requirements:

1. In ThreeDiceSequenceController.tsx, remove faceResult as the live timing gate.
2. Use timers to capture backend result for the active die after a fixed visual duration.
3. Use serverRngResults as the only result source.
4. Keep capturedResultsOwnerRef / visualRoundId safety.
5. Keep onProgress and onComplete behavior.
6. Keep reconnect display behavior working if possible.
7. Do not change ThreeDicePhysicsStage.tsx yet except if TypeScript requires a harmless prop adjustment.
8. Keep build passing.

Suggested constants:
const LIVE_DICE_VISUAL_MS = 5000;
const LIVE_DICE_BETWEEN_MS = 0;
const LIVE_DICE_CONFIRM_HOLD_MS = 1500;
const LIVE_DICE_FINAL_CONFIRM_HOLD_MS = 3000;

Expected flow:
Bets Closed ends → Die 1 drops immediately → after fixed visual time result board shows Die 1 → hold 1.5s → Die 2 drops → same → Die 3 drops → final hold → onComplete → settlement.

After patch:
Run npm run build and report any TypeScript errors.
