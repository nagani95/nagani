# Nagani Six Animal — MVP Release Readiness Sweep

## Chapter

```txt
90.3G-C5S — MVP Release Readiness Sweep
Status: PASS / LOCKED
```

This chapter verifies that the accepted Six Animal MVP dice round is ready for release-level testing.

This is not a dice tuning chapter.
This is not a physics chapter.
This is not a backend rewrite chapter.

The MVP dice round heart is already accepted and locked.

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
```

---

## Protected Rule

Do not change:

```txt
Dice physics
Shadow worker tuning
Recorded replay behavior
Backend result logic
Wallet logic
Admin logic
Settlement logic
Supabase functions
Sound
Production assets
```

Only fix a confirmed blocker.

---

## Release Readiness Checklist

### 1. Real User Entry

```txt
- Login works
- Player can enter lobby
- Player can enter Six Animal room
- Low-balance redirect still behaves safely
```

Status:

```txt
PASS
```

---

### 2. Wallet Path

```txt
- Wallet balance displays correctly
- Funded user can place bet
- Bet amount cannot exceed playable balance
- Wallet debit happens once
```

Status:

```txt
PASS
```

---

### 3. Full Round Path

```txt
- Betting opens
- Player selects animal / pair
- Bet places successfully
- Bets close
- Dice sequence starts
- Dice result matches board
- Settlement appears
- Next betting round opens cleanly
```

Status:

```txt
PASS
```

---

### 4. Leave / Return Path

```txt
- Exit button opens confirm popup
- Stay keeps player in room
- Leave returns to lobby
- Placed bet remains safe
- Returning later does not break room state
```

Status:

```txt
PASS
```

---

### 5. Refresh Safety

```txt
- Refresh during betting restores safely
- Refresh during closed / rolling / result does not replay broken dice
- Waiting overlay appears when needed
- Next round resumes cleanly
```

Status:

```txt
PASS
```

---

### 6. Mobile Visual Safety

```txt
- Room fits mobile screen
- Betting sheet is usable
- Result board is readable
- Settlement popup is readable
- Exit / music / fullscreen buttons are usable
- No important UI is cut off
```

Status:

```txt
PASS
```

---

### 7. Production Build

```txt
npm run build
```

Status:

```txt
PASS
```

---

## Pass Confirmation

This chapter passed because:

```txt
- One real user can complete a full MVP round
- Wallet and bet path work
- Dice/result/settlement/next-round flow works
- No player-facing debug/dev text appears
- Mobile screen remains playable
- Production build passes
```

---

## Final Lock

```txt
90.3G-C5S — MVP Release Readiness Sweep
Status: PASS / LOCKED
```

Next chapter:

```txt
90.3G-C5T — MVP Release Candidate Lock
```

Do not reopen dice behavior.
