# Nagani Six Animal — MVP Release Candidate Lock

## Chapter

```txt
90.3G-C5T — MVP Release Candidate Lock
Status: RELEASE CANDIDATE
```

This document marks **Nagani Traditional Six Animal Dice** as an MVP release candidate.

This is not a dice tuning chapter.
This is not a new feature chapter.
This is not a backend rewrite chapter.

The MVP dice round heart is accepted, documented, safety-checked, restore-protected, and release-readiness checked.

---

## Current Locked Roadmap

```txt
90.3G-C5L — Three-Dice Shadow Sequence Replay: COMPLETE
90.3G-C5M — Production Integration Plan: COMPLETE / PASSED
90.3G-C5N — Final Dice Production Lock / Documentation: PASS / LOCKED
90.3G-C5O — Final Production Safety Sweep: PASS / LOCKED
90.3G-C5P — Final Handoff / Restore Point: PASS / LOCKED
90.3G-C5Q — Final Real-User MVP Round Smoke Test: PASS
90.3G-C5R — Final MVP Acceptance Lock: PASS / LOCKED
90.3G-C5S — MVP Release Readiness Sweep: PASS / LOCKED
90.3G-C5T — MVP Release Candidate Lock: RELEASE CANDIDATE
```

---

## Release Candidate Statement

The Six Animal MVP dice round is now accepted as the current release candidate baseline.

Confirmed:

```txt
- Real-user flow works
- Wallet path works
- Betting path works
- Dice result matches live board
- Settlement appears cleanly
- Next betting round opens cleanly
- Game timing is nicely connected
- Player-facing dev/debug dice wording is not exposed
- Production build passes
```

---

## Accepted Dice Result Model

The accepted production model remains:

```txt
Backend result authority
→ shadow worker prepares natural target-matched trajectories
→ production replays recorded dice motion
→ visible dice result matches backend result
→ live result board reveals from visual progress
→ settlement appears after all three dice complete
→ next betting round opens cleanly
```

This model is locked.

---

## Do Not Reopen

Do not reopen these areas unless there is a confirmed production blocker:

```txt
Dice physics
Shadow worker tuning
Recorded replay behavior
Collider / friction tuning
Dice holder redesign
Trapdoor redesign
Backend result logic
Wallet logic
Admin logic
Supabase functions
Settlement logic
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

## Release Candidate Scope

This release candidate covers the MVP Six Animal gameplay path:

```txt
Login / enter room
→ wallet balance visible
→ place bet
→ betting closes
→ dice sequence runs
→ result board reveals
→ settlement appears
→ next round opens
```

---

## Final Rule

```txt
The MVP dice round is release-candidate locked.
Future work must not touch dice behavior unless a real blocker appears.
Next work should be final release packaging, deployment check, or non-dice product polish.
```

---

## Next Chapter

After this document is saved and build passes, the next safe chapter is:

```txt
90.3G-C5U — Final MVP Deployment / Production Smoke
```

Scope:

```txt
- Deploy or verify production build
- Open real production URL
- Login as real user
- Run one final full round
- Confirm no release blocker
- No code change unless blocker appears
```
