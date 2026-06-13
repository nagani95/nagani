# Nagani Six Animal — MVP Dice Round Acceptance Lock

## Chapter

```txt
90.3G-C5R — Final MVP Acceptance Lock
Status: ACCEPTED BASELINE
```

This document records final acceptance of the MVP dice round heart for **Nagani Traditional Six Animal Dice**.

This is not a tuning chapter.
This is not a new feature chapter.
This is an acceptance lock.

---

## Current Accepted Status

```txt
90.3G-C5L — Three-Dice Shadow Sequence Replay
Status: COMPLETE

90.3G-C5M — Production Integration Plan
Status: COMPLETE / PASSED

90.3G-C5N — Final Dice Production Lock / Documentation
Status: PASS / LOCKED

90.3G-C5O — Final Production Safety Sweep
Status: PASS / LOCKED

90.3G-C5P — Final Handoff / Restore Point
Status: PASS / LOCKED

90.3G-C5Q — Final Real-User MVP Round Smoke Test
Status: PASS

90.3G-C5R — Final MVP Acceptance Lock
Status: ACCEPTED
```

---

## Final MVP Dice Round Result

Gary confirmed the real production flow works:

```txt
Flow works
Result matches
Game timing is nicely connected
Dice → board → settlement → next round works
```

This confirms the main MVP heart of the Six Animal game is production-accepted.

---

## Accepted Production Dice Model

The accepted dice result model is:

```txt
Backend result authority
→ shadow worker prepares natural target-matched trajectories
→ production replays recorded dice motion
→ visible dice result matches backend result
→ live result board reveals from visual progress
→ settlement appears after all three dice complete
→ next betting round opens cleanly
```

This is the current production baseline.

---

## What Is Accepted

The MVP dice round acceptance includes:

```txt
- Backend result and visible dice result match
- Live result board reveals correctly
- Settlement appears cleanly
- Next round opens cleanly
- No old dice leaks into next betting round
- Timing feels nicely connected
- Player-facing UI has no dev/debug dice wording
- Restore point document exists
- Final dice production lock document exists
```

---

## Forbidden Reopening

Do not reopen the following unless there is a confirmed blocker:

```txt
Dice physics tuning
Shadow worker tuning
Collider / friction tuning
Dice holder redesign
Trapdoor redesign
Backend result logic
Settlement logic
Wallet logic
Admin logic
Supabase functions
Sound
Production assets
```

---

## Forbidden Regressions

Do not reintroduce:

```txt
Fake dice swap
Late snap rotation
Target correction
Public reroll loop
Hidden random reroll production loop
Race-car slide tuning
Heavy dead-box stop
Slow-motion paper-box stretch
Player-facing dev dice UI
```

---

## Current Rule

Default future instruction:

```txt
The MVP dice round is accepted.
Do not change dice behavior unless a real blocker appears.
Future work should move to non-dice MVP completion or final product packaging.
```

---

## Next Safe Direction

After this acceptance lock, the next safe work should be outside dice behavior.

Recommended next chapter:

```txt
90.3G-C5S — MVP Release Readiness Sweep
```

Scope:

```txt
- Do not touch dice behavior
- Do not tune physics
- Check real-user entry path
- Check wallet entry path
- Check one clean bet path
- Check lobby → room → result → lobby experience
- Check mobile visual safety
- Check production build
```

---

## Final Acceptance Statement

```txt
Nagani Six Animal MVP dice round heart is production-accepted.
The result truth problem is solved.
The dice system is locked.
The next work is release readiness, not dice tuning.
```
