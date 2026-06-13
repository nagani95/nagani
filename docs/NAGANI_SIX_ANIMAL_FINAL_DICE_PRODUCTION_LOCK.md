# Nagani Six Animal — Final Dice Production Lock

## Chapter

```txt
90.3G-C5N — Final Dice Production Lock / Documentation
Status: LOCKED BASELINE
```

This document locks the completed production dice result system for **Nagani Traditional Six Animal Dice**.

This is not a new feature chapter.
This is a protection document.

The goal is to record the working production dice architecture and prevent accidental reopening of the final accepted dice system.

---

## Completed Previous Chapter

```txt
90.3G-C5M — Production Integration Plan
Status: COMPLETE
```

Passed subchapters:

```txt
90.3G-C5M-A — First Production Shadow Integration
Status: PASS

90.3G-C5M-B — Production Cleanup Lock
Status: PASS

90.3G-C5M-C — Final Production Dice QA
Status: PASS
```

Gary tested multiple real production rounds after integration and confirmed the final dice production QA passed.

---

## Final Accepted Production Dice Flow

The current accepted production model is:

```txt
Backend result is already known
↓
Frontend prepares shadow recorded trajectories
↓
Shadow worker searches natural target-matched dice paths
↓
Production stage replays the recorded natural paths
↓
Visible dice result matches backend result
↓
Live result board reveals 1/3, 2/3, 3/3 from visual progress
↓
Settlement appears only after all three visual dice complete
↓
Next round starts cleanly with no dice leak
```

This is the current trusted production dice solution.

---

## Production Result Authority

Backend remains the official result authority.

The frontend must not invent the result.

The frontend receives the backend result animals and uses them as the target for the shadow dice preparation.

```txt
Backend result → shadow search target → recorded replay → visible dice → result board → settlement
```

The visible dice and the live result board must match.

---

## Important Architecture Lock

The production dice system no longer depends on random browser physics accidentally matching the backend result.

It also does not use fake visual tricks.

The accepted production architecture is:

```txt
Backend result authority
+
Shadow worker natural physics search
+
Recorded trajectory replay
+
Visual progress-controlled result board
+
Settlement after visual completion
```

This is the locked baseline.

---

## Current Main Files

Key files involved in the locked system:

```txt
src/app/six-animal/page.tsx
src/components/games/six-animal/ThreeDiceSequenceController.tsx
src/components/games/six-animal/ThreeDicePhysicsStage.tsx
src/components/games/six-animal/physics/diceShadowWorker.ts
src/components/games/six-animal/physics/diceShadowTypes.ts
src/components/games/six-animal/physics/physicsConstants.ts
```

---

## Page Responsibility

`src/app/six-animal/page.tsx`

Current locked responsibilities:

```txt
- Receives backend result animals
- Enables dice preparation during closed / rolling / result visual guard
- Passes backend result into the dice controller
- Updates live result board from controller visual progress
- Shows settlement only after controller completion
```

The page must not force early settlement before visual dice completion.

The page must not reveal final result progress independently of the dice controller visual progress.

---

## Sequence Controller Responsibility

`src/components/games/six-animal/ThreeDiceSequenceController.tsx`

Current locked responsibilities:

```txt
- Maps backend result keys to dice labels
- Starts shadow worker preparation per die
- Stores recorded trajectories
- Starts first replay when the first trajectory is ready
- Feeds active recorded trajectory frames into ThreeDicePhysicsStage
- Uses stable replay callback handling
- Sends visual progress after each captured die
- Sends complete only after all three dice complete
```

The controller owns the production shadow flow.

This is intentional.

---

## Physics Stage Responsibility

`src/components/games/six-animal/ThreeDicePhysicsStage.tsx`

Current locked responsibilities:

```txt
- Supports recordedTrajectoryFrames
- Supports recordedTrajectoryReplayKey
- Renders recorded replay dice when recorded frames exist
- Captures readable face during recorded replay
- Reports visual face result back to controller
```

The Stage should not secretly correct final dice after stop.

The Stage should not swap dice.

The Stage should not perform visible late target correction.

---

## Shadow Worker Responsibility

`src/components/games/six-animal/physics/diceShadowWorker.ts`

Current locked responsibilities:

```txt
- Searches natural target-matched dice trajectories
- Produces recorded trajectory frames
- Allows production-friendly early accepted / premium results
- Avoids heavy search delays that make frontend appear stuck
```

The worker is part of the trusted production bridge.

It must not become a public reroll loop.

It must not create player-visible dev states.

---

## What Was Fixed In C5M

### 1. First Production Shadow Integration

`ThreeDiceSequenceController.tsx` now owns the production shadow flow.

It prepares shadow trajectories from:

```txt
serverRngResults
```

Then passes active recorded frames into:

```txt
ThreeDicePhysicsStage
```

The Stage already supports replay through:

```txt
recordedTrajectoryFrames
recordedTrajectoryReplayKey
```

---

### 2. Shadow Preparation Starts Earlier

The first integration started the worker too late.

Gary observed that the frontend appeared to be “thinking” after Bets Closed, and the first dice could continue too close to the next round reset.

This was fixed by allowing shadow dice preparation during:

```txt
phase === "closed"
```

The worker now starts preparing before rolling begins.

This allows dice replay to start quickly and finish cleanly before the next round.

---

### 3. Worker Search Timing Was Improved

The worker search was adjusted away from heavy always-long search behavior.

Locked concept:

```txt
Do not wait for 760–980 attempts every time.
Allow earlier accepted / premium shadow result.
```

This made production timing usable while preserving natural dice motion.

---

### 4. Replay Callback Stability Was Fixed

`handleFaceResultChange` in `ThreeDiceSequenceController.tsx` was changed to a stable `useCallback`.

This stopped recorded replay / capture from resetting itself during replay.

---

### 5. Production Cleanup Passed

Old production props were removed from `page.tsx` controller usage:

```txt
targetPerformanceEnabled
strictReadableResultGate
rollingStartedAt
```

Old dev/player-visible overlays were removed from the production path.

Production players should not see:

```txt
Preparing Dice
Dice Director Error
dev strip
```

Console warnings may remain for developer safety, but no player-facing dev UI should leak.

---

## Passed Final QA

Gary confirmed:

```txt
C5M-A passes
C5M-B cleanup lock passes
C5M-C final production dice QA passes
```

Final QA checklist passed:

```txt
No board mismatch
No stuck dice
No next-round overlap
Settlement appears cleanly
Motion still feels acceptable
Dice and live board match in real time
```

---

## Protected Rules

Do not reopen the following unless there is a confirmed production blocker:

```txt
Backend
Wallet
Admin
Supabase functions
Settlement logic
Sound
Production assets
Dice holder visual redesign
Trapdoor redesign
Worker physics tuning
Collider/friction tuning
```

The current working solution must be protected.

---

## Forbidden Regressions

Do not reintroduce:

```txt
fake dice swap
late snap rotation
target correction
public reroll loop
hidden random reroll production loop
race-car slide tuning
heavy dead-box stop
slow-motion paper-box stretch
```

These were rejected or are unsafe for player trust.

---

## Final Production Dice Trust Rule

The dice must feel like a respectful traditional dice performance.

The player should believe:

```txt
The dice were released.
The dice rolled naturally.
The visible top faces are readable.
The live board follows what the dice showed.
Settlement follows after the dice are complete.
```

The player should not feel:

```txt
The dice were swapped.
The result was snapped late.
The app was searching in public.
The dice were corrected by an invisible hand.
The board ignored the visible dice.
The next round started while old dice were still alive.
```

---

## Current Lock Statement

As of this lock:

```txt
90.3G-C5L — Three-Dice Shadow Sequence Replay: COMPLETE
90.3G-C5M — Production Integration Plan: COMPLETE
90.3G-C5N — Final Dice Production Lock / Documentation: LOCKED
```

The shadow-recorded dice production solution is the accepted baseline.

Do not continue dice tuning now.

The correct next work after this document is normal production protection, final visual QA, or non-dice polish only if Gary explicitly requests it.

---

## Final Instruction

If future work touches the dice system, first check this document.

Default answer should be:

```txt
Do not change dice physics or production behavior unless there is a confirmed blocker.
The C5M shadow-recorded production dice system is locked.
```
