# Nagani Traditional — Target Result Animation Plan

## Chapter 30 — Backend Target Result Animation Plan

### Purpose

The future backend will control the official Six Animal round result.

However, the frontend 3D dice animation must visually match that official result in a natural way.

The player must feel:

- the dice physically rolled,
- the dice naturally stopped,
- the visible top faces caused the result,
- the Royal Result Board only reports what the dice showed.

The player must never feel that the system changed the result after the dice stopped.

---

## Current locked status

Current prototype behavior:

1. Frontend mock round starts.
2. 3D dice physically rolls.
3. Dice result is detected from the physical top face.
4. Royal Result Board shows the detected physical dice result.
5. Settlement uses that detected result.

This is trusted for the current prototype.

Current backend bridge exists but is intentionally inactive:

- `currentRound` exists in `/six-animal/page.tsx`.
- `mockDiceTarget` exists.
- `targetResult` is passed into `ThreeDiceSequenceController`.
- `USE_TARGET_RESULT_COMPLETION = false`.

This must stay OFF until controlled target animation is implemented safely.

---

## Final production goal

Future production behavior should be:

1. Backend creates the official round.
2. Betting opens.
3. Betting closes.
4. Backend locks or generates official dice result.
5. Frontend receives target result.
6. 3D dice animation rolls naturally.
7. Each die visually stops with the correct backend target face on top.
8. Royal Result Board captures the visible dice face.
9. Settlement uses backend-confirmed result.

The final result must match both:

- backend official result,
- visible 3D dice top faces.

---

## Important trust rule

Never show a result that does not match the visible dice.

Bad behavior:

- Dice visually lands on Tiger.
- Result board shows Dragon.
- Settlement uses Dragon.

This is not acceptable.

The visible dice, result board, and settlement must always agree.

---

## Possible animation strategies

### Option A — Pure physics only

The dice rolls naturally and result comes from physics.

Pros:

- Most natural.
- Most trusted visually.

Cons:

- Cannot guarantee backend target result.
- Not suitable when backend must control official result.

This is good for prototype only.

---

### Option B — Forced result swap after dice stops

The dice rolls, stops randomly, then frontend changes result to backend target.

Pros:

- Easy to implement.

Cons:

- Looks fake.
- Breaks trust.
- Player may notice mismatch.
- Not acceptable for Nagani Traditional.

This option is rejected.

---

### Option C — Hybrid physics with final orientation correction

The dice rolls with real physics during most of the animation.

Near the end, when speed is low or dice is almost settled, the system gently guides the die orientation so the target face becomes the top face.

Pros:

- Can match backend result.
- Can still look natural if correction is subtle.
- Good balance between trust and control.

Cons:

- Needs careful tuning.
- Sudden rotation correction would look fake.
- Needs invalid/cocked result handling.

This is the likely MVP production direction.

---

### Option D — Precomputed animation clips

Use pre-authored dice roll animations for each target result.

Pros:

- Very controllable.
- Easy to guarantee result.
- Can look polished if animated well.

Cons:

- May feel repeated.
- Less physically dynamic.
- Requires many animation variants.
- Harder to keep fresh.

This may be useful later, but not first choice.

---

### Option E — Server-seeded deterministic physics

Backend sends a seed. Frontend physics simulation uses that seed and produces the matching result.

Pros:

- More fair/trustable in theory.
- Backend and frontend can share deterministic logic.

Cons:

- Browser physics determinism is difficult.
- Device differences may cause mismatch.
- Complex for MVP.

This is a future advanced option, not current MVP.

---

## Recommended direction

Use:

## Hybrid physics + subtle final orientation correction

The dice should still:

- drop from the holder,
- hit the tray,
- bounce,
- roll,
- collide,
- slow down,
- settle naturally.

But near the final moment, the dice should be guided so the target animal face becomes the top face.

The correction must happen while the die is still moving slightly, not after it fully stops.

---

## Per-die target flow

For each of the 3 dice:

1. Receive target animal from backend result.
2. Drop one die.
3. Let physics run normally.
4. During rolling, keep the dice visually natural.
5. When die slows near settle state, begin gentle target correction.
6. Stop with target animal face on top.
7. Validate top face.
8. Capture result to Royal Result Board.
9. Clear physical die from tray.
10. Drop next die.

This keeps the current one-die-at-a-time real-life ဂလုန်းဂလုန်း flow.

---

## Invalid / cocked result handling

Sometimes dice may stop tilted or against the tray wall.

Future handling:

- Detect if top face confidence is too low.
- Mark result as invalid/cocked internally.
- Do not show wrong result to user.
- Either:
  - gently nudge the dice while still moving, or
  - continue rolling briefly, or
  - reroll that die visually before capture.

The user should not see technical invalid state unless needed.

---

## Result board rule

Royal Result Board should not decide the result by itself.

It should only capture what the dice visually reveals.

Correct flow:

```txt
Backend target → guided dice animation → visible dice face → result board capture → settlement

---

## Chapter 30.2 — Dice Face Orientation Map Audit

Current dice face orientation is locked as:

| Dice local axis | Animal | Myanmar |
|---|---|---|
| +Y | Tiger | ကျား |
| -Y | Dragon | နဂါး |
| +X | Rooster | ကြက် |
| -X | Fish | ငါး |
| +Z | Crab | ဂဏန်း |
| -Z | Elephant | ဆင် |

This mapping is used in `ThreeDicePhysicsStage.tsx` by `diceFaceCandidates`.

The visual texture planes must match this same mapping:

- Top face: Tiger
- Bottom face: Dragon
- Right face: Rooster
- Left face: Fish
- Front face: Crab
- Back face: Elephant

This is important because future target-result animation will need to rotate the dice so the backend target animal becomes the top face.

Current detection method:

```txt
candidate local face direction → apply dice quaternion → compare with worldUp

## Chapter 30.3 — Target Face Helper

A small target-face helper foundation was added in `ThreeDicePhysicsStage.tsx`.

Added helpers:

```ts
getDiceFaceCandidateByLabel(targetAnimal)
getDiceFaceDirectionByLabel(targetAnimal)

## Chapter 30.4A — Target Top-Face Orientation Helper

Added helper foundation in `ThreeDicePhysicsStage.tsx`.

New helpers:

```ts
createTargetTopFaceQuaternion(targetAnimal)
getTargetTopFaceDebugInfo(targetAnimal)

## Chapter 30.4B — Dev Lab Target Animal Selector

A dev-only target animal selector was added to `ThreeDicePhysicsLab.tsx`.

Purpose:

- Choose a target animal in the isolated `/dev/three-dice` lab.
- Display the target face axis.
- Display the target top-face quaternion debug values.
- Prepare for future target correction testing.

Current behavior remains unchanged:

- The selector does not control dice physics yet.
- The selector does not force results yet.
- `/six-animal` is unchanged.
- `USE_TARGET_RESULT_COMPLETION` remains OFF.
- Real production result still comes from visible physical dice.

---

## Chapter 30.4C — Single-Die Target Debug Preview

The dev dice lab now compares the selected target animal with the real detected dice result.

Added preview logic:

- Selected target animal
- Target axis
- Target top-face quaternion
- Detected physical dice result
- Target match / mismatch / invalid status

Purpose:

- Prove the target-selection/debug pipeline works.
- Confirm the current physical dice result is still independent.
- Prepare for future correction testing.

Important:

This chapter does not force the dice to land on the target.

A mismatch is expected because target correction is not active yet.

Current behavior remains safe:

- Dice physics is unchanged.
- Result capture is unchanged.
- `/six-animal` is unchanged.
- `USE_TARGET_RESULT_COMPLETION` remains OFF.
- Real production flow still trusts visible physical dice.

---

## Chapter 30.4D — Target Correction Safety Design

Before adding any target-result correction code, the safety rules must be locked.

The purpose of target correction is not to fake a result after the dice stops.

The purpose is to guide the dice naturally so the visible final top face matches the official backend target result.

### Core rule

Never change the result after the dice is visibly settled.

Bad behavior:

```txt
Dice stops on Crab → system changes result to Tiger

---

## Chapter 30.4E — Target Correction Feature Flag Foundation

A safe target-correction feature flag foundation was added in `ThreeDicePhysicsStage.tsx`.

Current constants:

```ts
TARGET_CORRECTION_ENABLED = false
TARGET_CORRECTION_MIN_SPEED = 0.18
TARGET_CORRECTION_MAX_TILT_DEGREES = 35

---

## Chapter 30.4F — Show Target Correction Safety Config in Dev Lab

The dev dice lab now displays the target correction safety config.

Displayed values:

- Correction enabled / locked OFF
- Minimum correction speed window
- Maximum correction tilt threshold
- Safety note

Purpose:

- Make the OFF state visible in the dev lab.
- Avoid accidental confusion about whether target correction is active.
- Prepare for future correction testing without changing behavior.

Current behavior remains unchanged:

- Target correction is still locked OFF.
- Dice physics is unchanged.
- Dice result capture is unchanged.
- `/six-animal` is unchanged.
- `USE_TARGET_RESULT_COMPLETION` remains OFF.

---

## Chapter 30.4G — Target Correction Readiness Gate

A target correction readiness helper was added in `ThreeDicePhysicsStage.tsx`.

New helper:

```ts
getTargetCorrectionReadiness({
  movementSpeed,
  tiltDegrees,
  hasTarget,
})

---

## Chapter 30.4H — Surface Readiness Gate in Dev Lab

The dev dice lab now displays the target correction readiness gate.

Displayed values:

- Ready / Not Ready
- Readiness reason
- Settled state
- Current detected tilt

Purpose:

- Make correction readiness visible before any correction is active.
- Confirm the feature flag keeps correction locked OFF.
- Prepare the lab for future safe target-correction testing.

Current behavior remains unchanged:

- Target correction is still OFF.
- Dice physics is unchanged.
- Dice result capture is unchanged.
- `/six-animal` is unchanged.
- `USE_TARGET_RESULT_COMPLETION` remains OFF.

---

## Chapter 30.5B — Tiny Orientation Nudge Prototype

A dev-only tiny orientation nudge prototype was added in `ThreeDicePhysicsStage.tsx`.

Behavior:

- Only runs when `targetCorrectionTestEnabled` is true.
- Only available through the dev lab.
- Only runs when the dice movement speed is low.
- Uses a very small quaternion slerp toward the selected target animal top-face orientation.
- Does not affect `/six-animal` because the live room does not pass the dev correction toggle.

Prototype constants:

```ts
DEV_TARGET_CORRECTION_BLEND = 0.018
DEV_TARGET_CORRECTION_MAX_SPEED = 0.16

---

## Chapter 30.5C — Remove Late Rotation / Use Rolling Spin Bias

The first direct quaternion rotation prototype was rejected after visual testing.

Rejected behavior:

```txt
dice slows down → appears to stop → slowly rotates into target
```

This looked like an invisible hand or magnet turning the dice after the result was already visible.

Updated dev-lab approach:

- Removed direct `body.setRotation(...)` target correction.
- Removed late near-stop quaternion slerp correction.
- Added a dev-only angular velocity bias while the dice still has visible rolling energy.
- Correction only runs inside a movement-speed window.
- Correction stops before the die looks settled.

Current dev constants:

```ts
DEV_TARGET_CORRECTION_MIN_SPEED = 0.38
DEV_TARGET_CORRECTION_MAX_SPEED = 1.35
DEV_TARGET_CORRECTION_ANGULAR_NUDGE = 0.36
DEV_TARGET_CORRECTION_ANGULAR_DAMPING = 0.94
```

Purpose:

Make the target influence happen during rolling motion, not after the dice stops.

Safety:

- `/six-animal` remains unchanged.
- Correction test remains dev-only.
- `USE_TARGET_RESULT_COMPLETION` remains OFF.
- Production result still comes from visible physical dice.

---

## Chapter 30.5D — Dev Spin Bias Tuning

After testing Chapter 30.5C, the fake late-stop rotation problem was improved.

The dice no longer visibly turns into the target after stopping.

However, the target influence was too weak, so the dice could still land on a different animal.

Updated dev tuning:

```ts
DEV_TARGET_CORRECTION_MIN_SPEED = 0.55
DEV_TARGET_CORRECTION_MAX_SPEED = 2.15
DEV_TARGET_CORRECTION_ANGULAR_NUDGE = 0.52
DEV_TARGET_CORRECTION_ANGULAR_DAMPING = 0.96

---

## Chapter 30.5E — Correction Window / Dev Lab Wording Cleanup

The dev lab wording was cleaned up to avoid confusion.

Before:

- Button showed `Correction Test: ON`
- Card showed `Correction Safety: Locked OFF`

This was confusing because both were true but referred to different systems.

Updated meaning:

- `Production Completion: Locked OFF` means production/backend target-result completion is still disabled.
- `Dev test: ON/OFF` means the isolated `/dev/three-dice` correction experiment can be toggled for testing.

The target mismatch text was also updated:

- If dev correction test is OFF, mismatch is expected.
- If dev correction test is ON, mismatch means the spin-bias experiment is still weak or still being tuned.

Safety remains unchanged:

- `/six-animal` is unchanged.
- Production target completion remains OFF.
- `USE_TARGET_RESULT_COMPLETION` remains OFF.
- The dev correction test remains isolated to `/dev/three-dice`.

---

## Chapter 30.5F — Spin Bias Test Result

Chapter 30.5F tuning was tested in `/dev/three-dice`.

Result:

- Dice roll feels smooth.
- No obvious after-stop invisible-hand turning was seen.
- Dev correction test can sometimes land on the target.
- Target influence can still miss, but the miss looks natural.

Decision:

This is acceptable learning progress.

Do not keep increasing correction strength aggressively yet.

It is better to miss naturally than to force a suspicious target match.

Current status:

- Dev correction test remains experimental.
- `/six-animal` remains unchanged.
- Production target completion remains OFF.
- `USE_TARGET_RESULT_COMPLETION` remains OFF.

---

## Chapter 30.6A — Target Result Validation Helper

A target result validation helper was added in `ThreeDicePhysicsStage.tsx`.

New helper:

```ts
getTargetResultValidation({
  targetAnimal,
  faceResult,
})

---

## Chapter 30.6B — Show Target Validation in Dev Lab

The dev dice lab now displays target result validation.

Displayed values:

- Validation status
- Accepted / rejected / waiting label
- Validation message
- Detected visible dice result
- Confidence and tilt when available

Purpose:

- Confirm whether the selected target matches the visible dice face.
- Make target mismatch obvious during dev testing.
- Prepare for future backend target capture.
- Protect the rule that backend target, visible dice face, result board, and settlement must agree.

Current behavior remains unchanged:

- Dice physics is unchanged.
- Dev correction test is unchanged.
- `/six-animal` is unchanged.
- Production target completion remains OFF.
- `USE_TARGET_RESULT_COMPLETION` remains OFF.

---

## Chapter 30.6C — Physical Capture Wording Cleanup

The dev lab wording was cleaned up to separate physical dice capture from target validation.

Before, the UI could show:

```txt
Target Validation: Rejected
Result Capture: Accepted

---

## Chapter 30.6D — Target Validation Summary for Future Backend Capture

A target result capture summary helper was added in `ThreeDicePhysicsStage.tsx`.

New helper:

```ts
getTargetResultCaptureSummary({
  targetAnimal,
  faceResult,
})

---

## Chapter 30.6E — Show Capture Summary in Dev Lab

The dev dice lab now displays the target result capture summary.

Displayed values:

- Whether backend target capture is safe
- Whether physical visible result is readable
- Target animal
- Visible animal
- Capture rule

Purpose:

- Make future backend target capture rules visible during testing.
- Separate readable physical result from safe backend target capture.
- Prevent using target result when visible dice does not match.
- Prepare for future controlled-result integration.

Current behavior remains unchanged:

- Dice physics is unchanged.
- Dev correction test is unchanged.
- `/six-animal` is unchanged.
- Production target completion remains OFF.
- `USE_TARGET_RESULT_COMPLETION` remains OFF.

---

## Chapter 30.6F — Target Validation Lock / No Production Enable

Chapter 30.6E confirmed the target validation and capture summary behavior in `/dev/three-dice`.

Confirmed behavior:

```txt
Target: Tiger
Visible dice: Crab / Rooster / Elephant
Target Validation: Rejected
Capture Summary: Hold
Physical Capture: Visible Result Accepted