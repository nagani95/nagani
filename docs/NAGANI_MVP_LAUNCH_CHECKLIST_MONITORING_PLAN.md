# Nagani MVP Launch Checklist / Monitoring Plan

## Chapter

```txt
90.3G-C5X — MVP Launch Checklist / Monitoring Plan
Status: LAUNCH CHECKLIST
```

This document prepares the current **Nagani Traditional Six Animal Dice MVP** for launch observation.

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
90.3G-C5X — MVP Launch Checklist / Monitoring Plan: CURRENT
```

---

## Launch Protection Rule

Do not change these unless there is a confirmed production blocker:

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

The current MVP dice round heart is accepted and protected.

---

## Pre-Launch Checklist

### 1. Production URL

```txt
- Production URL opens
- Landing / lobby loads
- No blank screen
- No obvious console-breaking issue
```

Status:

```txt
Pending
```

---

### 2. Real User Login

```txt
- Real user can log in
- Logged-in state stays active
- User can enter Six Animal room
```

Status:

```txt
Pending
```

---

### 3. Wallet / Balance

```txt
- Wallet balance displays correctly
- Low balance path behaves safely
- Funded player can place bet
- Bet debit happens once
```

Status:

```txt
Pending
```

---

### 4. Full MVP Round

```txt
- Betting opens
- Player places bet
- Bets close
- Dice sequence runs
- Visible dice result matches board
- Settlement appears
- Next betting round opens cleanly
```

Status:

```txt
Pending
```

---

### 5. Exit / Return

```txt
- Exit button works
- Confirm popup works
- Returning to lobby works
- Re-entering room does not break current state
```

Status:

```txt
Pending
```

---

### 6. Refresh Safety

```txt
- Refresh during betting is safe
- Refresh during closed / rolling / result is safe
- Waiting overlay appears when needed
- Next round resumes cleanly
```

Status:

```txt
Pending
```

---

### 7. Mobile Safety

```txt
- Mobile screen fits
- Betting sheet is usable
- Result board is readable
- Settlement popup is readable
- Exit / music / fullscreen controls are reachable
```

Status:

```txt
Pending
```

---

## Monitoring Checklist

During first launch observation, watch for:

```txt
- Dice and board mismatch
- Dice sequence stuck
- Settlement missing
- Next round not opening
- Wallet balance wrong after bet
- Bet placed twice
- Player unable to enter room
- Mobile screen cut off
- Player-facing dev/debug text
- Console error that blocks gameplay
```

---

## Bug Report Format

If a blocker appears, record:

```txt
Time:
Device / browser:
User account:
Round phase:
Round number if visible:
What happened:
Expected behavior:
Can reproduce? yes / no:
Screenshot or screen recording:
Console error if available:
```

---

## Rollback Rule

Only rollback or patch if the issue is a real blocker:

```txt
- Player cannot enter game
- Player cannot place bet
- Wallet debit is wrong
- Dice and board mismatch
- Settlement does not appear
- Next round does not open
- App crashes or blank screen appears
```

Do not rollback for minor visual preference.

Do not reopen dice motion beauty polish during launch monitoring.

---

## Post-Launch Observation Notes

Use this section after launch testing:

```txt
Observation date:
Tester:
Device:
Result:
Issues found:
Decision:
```

---

## Pass Condition

This chapter passes when:

```txt
- Production URL opens
- Real user can complete one full MVP round
- Wallet / bet / dice / result / settlement / next round all work
- Mobile screen remains playable
- No release blocker appears
```

---

## Final Instruction

If all launch checklist items pass, mark:

```txt
90.3G-C5X — MVP Launch Checklist / Monitoring Plan
Status: PASS / LOCKED
```

Next safe chapter:

```txt
90.3G-C5Y — First Launch Observation / Bug Triage
```

Do not reopen dice behavior.
