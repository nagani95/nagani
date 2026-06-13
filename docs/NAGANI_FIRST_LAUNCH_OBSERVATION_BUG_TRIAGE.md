# Nagani First Launch Observation / Bug Triage

## Chapter

```txt
90.3G-C5Y — First Launch Observation / Bug Triage
Status: OBSERVATION
```

This chapter records first-launch observation for **Nagani Traditional Six Animal Dice MVP**.

This is not a dice tuning chapter.
This is not a backend rewrite chapter.
This is not a feature expansion chapter.

The Six Animal MVP production baseline is already locked.

---

## Current Locked Baseline

```txt
90.3G-C5L — Three-Dice Shadow Sequence Replay: COMPLETE
90.3G-C5M — Production Integration Plan: COMPLETE / PASSED
90.3G-C5N — Final Dice Production Lock / Documentation: PASS / LOCKED
90.3G-C5O — Final Production Safety Sweep: PASS / LOCKED
90.3G-C5P — Final Handoff / Restore Point: PASS / LOCKED
90.3G-C5Q — Final Real-User MVP Round Smoke Test: PASS
90.3G-C5R — Final MVP Acceptance Lock: PASS / LOCKED
90.3G-C5S — MVP Release Readiness Sweep: PASS / LOCKED
90.3G-C5T — MVP Release Candidate Lock: PASS / LOCKED
90.3G-C5U — Final MVP Deployment / Production Smoke: PASS / LOCKED
90.3G-C5V — Six Animal MVP Production Baseline Lock: PASS / LOCKED
90.3G-C5W — Final MVP Launch Handoff: PASS / LOCKED
90.3G-C5X — MVP Launch Checklist / Monitoring Plan: PASS / LOCKED
90.3G-C5Y — First Launch Observation / Bug Triage: CURRENT
```

---

## Protected Rule

Do not change these unless a real production blocker appears:

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

The MVP dice round heart is already accepted and protected.

---

## Observation Goal

Observe real production use and separate:

```txt
Real blocker
Minor bug
Visual polish
Future idea
```

Do not patch randomly.

Do not reopen dice behavior.

Do not start dice motion beauty polish during first launch observation.

---

## Blocker Definition

A blocker is one of these:

```txt
Player cannot open the game
Player cannot log in
Player cannot enter Six Animal room
Wallet balance is wrong
Bet cannot be placed
Bet debits twice
Dice and board mismatch
Dice sequence gets stuck
Settlement does not appear
Next betting round does not open
App crashes or blank screen appears
Player-facing dev/debug text appears
```

Only blockers justify immediate patch work.

---

## Minor Issue Definition

Minor issues include:

```txt
Small spacing issue
Small copy issue
Minor animation preference
Minor color preference
Minor loading feel
Non-blocking console warning
Optional visual improvement
```

Minor issues should be recorded, not patched immediately.

---

## Observation Checklist

### 1. Production Entry

```txt
- Production URL opens
- Lobby loads
- User can log in
- User can enter Six Animal room
```

Status:

```txt
Pending
```

---

### 2. Wallet / Bet

```txt
- Wallet balance visible
- Bet amount controls usable
- Bet places successfully
- Wallet debit happens once
```

Status:

```txt
Pending
```

---

### 3. Round Flow

```txt
- Betting opens
- Bets close
- Dice sequence runs
- Dice and result board match
- Settlement appears
- Next betting round opens cleanly
```

Status:

```txt
Pending
```

---

### 4. Mobile Observation

```txt
- Room fits screen
- Betting sheet usable
- Result board readable
- Settlement popup readable
- Exit / music / fullscreen controls usable
```

Status:

```txt
Pending
```

---

### 5. Return / Refresh Observation

```txt
- Leave room works
- Return to room works
- Refresh during betting is safe
- Refresh during non-betting state waits safely
```

Status:

```txt
Pending
```

---

## Bug Report Template

If an issue appears, record it like this:

```txt
Issue ID:
Date / time:
Tester:
Device:
Browser:
User account:
Round phase:
What happened:
Expected behavior:
Blocker / minor / polish:
Can reproduce? yes / no:
Screenshot / video:
Console error:
Decision:
```

---

## Triage Decision Rules

### If Blocker

```txt
Stop launch expansion.
Do not tune unrelated files.
Find smallest safe patch.
Run production build.
Repeat real-user full round smoke test.
Update this document.
```

### If Minor Issue

```txt
Record it.
Do not patch immediately.
Group it for future polish chapter.
Keep MVP baseline protected.
```

### If No Issue

```txt
Mark first launch observation passed.
Move to post-launch monitoring / support notes.
```

---

## Pass Condition

This chapter passes when:

```txt
- First launch observation finds no blocker
- Real user can complete one full MVP round
- Wallet / bet / dice / result / settlement / next round all work
- Mobile screen remains playable
- Any minor issues are documented only
```

---

## Final Instruction

If first launch observation passes, mark:

```txt
90.3G-C5Y — First Launch Observation / Bug Triage
Status: PASS / LOCKED
```

Next safe chapter:

```txt
90.3G-C5Z — Post-Launch Monitoring / Support Notes
```

Do not reopen dice behavior.
