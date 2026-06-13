# Nagani Six Animal — Current Production Restore Point

## Restore Point

```txt
90.3G-C5P — Final Handoff / Restore Point
Status: RESTORE POINT
```

This document records the current safe production position for **Nagani Traditional Six Animal Dice**.

Purpose:

```txt
Help future Gary / future ChatGPT continue from the correct place without reopening completed dice work.
```

---

## Current Roadmap Position

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
Status: CURRENT
```

---

## What Is Now Solved

The main MVP heart of Six Animal dice round is solved.

The production dice result bridge now works:

```txt
Backend result
→ shadow worker prepares natural target-matched trajectories
→ production replays recorded dice motion
→ visible dice result matches backend result
→ live result board reveals 1/3, 2/3, 3/3
→ settlement appears after visual dice completion
→ next round opens cleanly
```

This means:

```txt
No board mismatch
No stuck dice
No next-round dice leak
No fake dice swap
No late snap correction
No public reroll loop
No player-facing dev dice UI
```

---

## Locked Dice Architecture

The accepted production dice model is:

```txt
Backend result authority
+
Shadow-recorded natural dice trajectory
+
Recorded replay in production
+
Live board controlled by visual progress
+
Settlement after all three visual dice complete
```

This is the production baseline.

Do not replace it with random browser dice physics.

Do not replace it with fake result dice.

Do not reopen dice tuning unless there is a confirmed production blocker.

---

## Important Lock Documents

Main dice lock document:

```txt
docs/NAGANI_SIX_ANIMAL_FINAL_DICE_PRODUCTION_LOCK.md
```

That document records:

```txt
- C5M production integration passed
- backend remains result authority
- shadow worker searches natural target-matched paths
- production replays recorded trajectories
- result board follows visual progress
- settlement waits until dice complete
- no dice swap / no snap / no reroll loop
```

This restore point document is only the short current-position handoff.

---

## Safety Sweep Passed

The final production safety sweep passed.

Checked visible player-facing surfaces:

```txt
src/app/six-animal/page.tsx
src/components/games/six-animal/FloatingResultBoard.tsx
src/components/games/six-animal/ActiveBetsSummaryPanel.tsx
src/components/games/six-animal/SettlementPopup.tsx
src/components/games/six-animal/SixAnimalBettingSheet.tsx
src/components/games/six-animal/RoomIntroOverlay.tsx
src/components/games/six-animal/RoyalRoomAtmosphere.tsx
src/components/games/six-animal/RoyalRoomTopBar.tsx
src/components/games/six-animal/RoyalTableChamberBackdrop.tsx
```

Confirmed no player-facing leak of:

```txt
Preparing Dice
Dice Director Error
dev strip
Tune Needed
Reroll Required
Shadow / worker wording
Backend / RNG wording
Replay / trajectory wording
Debug wording
```

---

## Protected Areas

Do not reopen these without a real blocker:

```txt
Dice physics
Shadow worker tuning
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

The MVP dice round heart is already working.

---

## Current Safe Rule

Default rule for future work:

```txt
Do not change dice physics or production dice behavior.
The C5M shadow-recorded production dice system is locked.
```

---

## Next Safe Step

After this restore point is saved and build passes, the next safe chapter is:

```txt
90.3G-C5Q — Final Real-User MVP Round Smoke Test
```

Scope should be small:

```txt
- Use real user account
- Confirm wallet balance
- Place one real bet
- Watch one full automatic round
- Confirm visible dice and board match
- Confirm settlement appears
- Confirm next betting round opens cleanly
- No code change unless a real blocker appears
```

Do not start optional dice beauty polish yet.

Future optional dice motion beauty polish can happen later, after MVP restore point and real-user smoke test are protected.

---

## Final Current Statement

As of this restore point:

```txt
The main Six Animal dice round MVP heart is production-accepted.
The dice result truth problem is solved.
The dice system is locked.
The next work is verification / handoff, not dice tuning.
```
