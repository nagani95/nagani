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

Create table model folder and add registry path in `naganiAssets.ts`.

No production rendering yet.

### 78.3 Dev Preview Only

Load the GLB in a dev-only preview or feature-flagged mode.

Do not touch production `/six-animal` yet.

### 78.4 Visual Alignment

Align GLB position, scale, and rotation over the existing procedural collider table.

### 78.5 Collider Safety QA

Confirm dice still drops, hits stumble bar, rolls, rebounds, settles, and detects result correctly.

### 78.6 Production Swap

Only after dev preview passes, use GLB visible table in production while keeping invisible colliders.

### 78.7 Mobile Visual QA

Test full round on mobile portrait.

### 78.8 Final Visual Proof Lock

Lock screenshots/video proof before moving to the next visual chapter.

---

## Protected Systems

Do not touch during Chapter 78 unless fixing a confirmed blocker:

- Supabase functions.
- Wallet debit/credit.
- Admin pages.
- Backend cron runner.
- Round state.
- Bet submission.
- Settlement logic.
- Chapter 77 cinematic dice timeline.
- Refresh after Bets Closed rule.
- Result ownership protection.
- Dice result detection.
- Production target correction lock.

---

## Acceptance Checklist for 78.1

- This document exists.
- Current procedural table role is understood.
- Hybrid GLB + invisible collider architecture is locked.
- No production code changed yet.
- Next step is asset folder / registry planning.