# Nagani Traditional — Server-Authority Cinematic Dice Timeline Plan

## Chapter 77 — Purpose

The Six Animal live room already has backend-controlled round timing, betting, wallet debit, settlement, and final result.

The remaining trust problem is visual timing.

Each player browser runs local dice animation. Different phones, browsers, refresh timing, and device performance cannot finish local 3D physics at the exact same millisecond.

Therefore, the production room must use a server-authority cinematic dice timeline.

## Architecture Decision

Current path: Option C.

Option C means:

- Backend remains the source of truth for round phase and final result.
- Frontend plays a bounded cinematic dice sequence.
- Dice animation must feel physical and live.
- Result board must wait for visible dice capture.
- Settlement must never appear before all 3 visual dice captures.
- Result phase must include enough buffer for slower devices to catch up before next betting round.

Future path: Option B.

Option B means:

- Backend sends result plus animation seed/timeline.
- Frontend reconstructs the same deterministic-looking dice sequence.
- This is the better long-term scalable architecture, but not the current quick fix.

Rejected current behavior:

- Backend reaches result and frontend instantly jumps to settlement.
- Result board shows dice result before the visible dice has completed.
- Player only sees 1 or 2 dice before final result page appears.
- Dice table feels separated from UI result.

## Locked Real-Life Flow

The correct player-visible flow is:

1. Bets Closed
2. Die 1 drops
3. Die 1 rolls
4. Die 1 result is captured
5. Die 1 clears
6. Die 2 drops
7. Die 2 rolls
8. Die 2 result is captured
9. Die 2 clears
10. Die 3 drops
11. Die 3 rolls
12. Die 3 result is captured
13. Final result / settlement appears
14. Result buffer remains visible
15. Next betting round starts

## Hard Rule

Final result and settlement cannot appear until the frontend has captured all 3 visual dice.

This rule is true even if the backend round phase has already changed to `result`.

## Backend Rule

Backend controls:

- round phase
- betting start/end
- closed phase
- rolling start
- final result animals
- result phase
- next round start
- wallet debit
- settlement credit

Backend does not wait for each player's browser animation.

## Frontend Rule

Frontend controls:

- visual dice sequence playback
- dice capture display timing
- safe guard before settlement
- reconnect reconstruction from backend timestamps

Frontend must not create its own final result.

Frontend must display backend result only after the visual dice sequence is safe.

## Result Phase Visual Guard

If backend phase becomes `result` before visual dice sequence is complete:

- Do not instantly show settlement.
- Keep the dice/result board visible.
- Continue or reconstruct remaining visual dice captures.
- Show a calm waiting state if needed:
  - `Finalizing table result`
- After 3 visual captures are complete, show settlement.

## Bounded Per-Die Timing

Each die needs safe timing limits.

Suggested first production budget:

- Die drop + roll minimum: 1800ms
- Die drop + roll maximum: 4200ms
- Capture hold after die result: 500ms
- Clear delay before next die: 250ms

Total target visual rolling time:

- Minimum around 7 seconds
- Maximum around 15 seconds

The sequence should feel alive but must not run forever.

If the die settles early:

- Hold briefly before capture.

If the die takes too long:

- Capture safely within max budget.

## Reconnect / Late Join Rule

When user refreshes during rolling:

- Frontend reads backend `rolling_starts_at`.
- Frontend calculates elapsed rolling time.
- Frontend restores the correct visual stage.
- Already elapsed dice may appear as captured results.
- Current dice may resume from the approximate cinematic stage.
- Settlement must still wait until 3 visual captures are complete.

When user joins too late:

- Do not corrupt dice sequence.
- If visual reconstruction is no longer safe, show final board only after guard rules are satisfied.

## Trust Rule

Visible dice remains the player-facing source of trust.

Backend result is the authority, but the player must experience the result as coming from the visible table.

No suspicious behavior allowed:

- no instant settlement jump
- no result before dice capture
- no invisible backend result reveal before table reveal
- no after-stop dice rotation
- no skipped third dice
- no fake separate result card replacing the table too early

## Files Expected To Be Touched Later

Likely files for implementation:

- `src/app/six-animal/page.tsx`
- `src/components/games/six-animal/ThreeDiceSequenceController.tsx`
- `src/components/games/six-animal/ThreeDicePhysicsStage.tsx`
- `src/lib/threeDiceResultAdapter.ts`

Do not touch unrelated files.

Do not change wallet, admin, backend SQL, result detection, betting rules, settlement math, or table model unless Chapter 77 requires it.

## Chapter 77 Acceptance Checklist

Chapter 77 is accepted only when:

- Bets Closed does not feel delayed or broken.
- Die 1, Die 2, and Die 3 are each visibly seen.
- Result board updates only after each visible dice capture.
- Settlement appears only after all 3 dice are captured.
- Backend early result phase does not skip visual dice.
- Refresh during rolling restores a believable visual stage.
- Slow devices get a safe result buffer.
- Next betting round does not begin before visual result feels complete.
- Build passes.