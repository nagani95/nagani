# Nagani Post-Launch Monitoring / Support Notes

## Chapter

```txt
90.3G-C5Z — Post-Launch Monitoring / Support Notes
Status: POST-LAUNCH MONITORING
```

This document records post-launch monitoring and support rules for **Nagani Traditional Six Animal Dice MVP**.

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
90.3G-C5Y — First Launch Observation / Bug Triage: PASS / LOCKED
90.3G-C5Z — Post-Launch Monitoring / Support Notes: CURRENT
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

The MVP dice round heart is accepted and protected.

---

## Monitoring Goal

During post-launch observation, watch for:

```txt
- Player can enter the game
- Wallet balance is correct
- Bet can be placed
- Wallet debit happens once
- Dice and live board match
- Settlement appears
- Next betting round opens cleanly
- Mobile screen remains playable
- No player-facing dev/debug text appears
```

---

## Blocker Issues

A blocker means launch trust or gameplay is broken.

Blockers include:

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

If a blocker appears:

```txt
1. Stop new feature work.
2. Record the issue clearly.
3. Do not tune unrelated files.
4. Make the smallest safe patch.
5. Run npm run build.
6. Run one real-user full round smoke test.
7. Confirm the blocker is gone.
```

---

## Minor Issues

Minor issues do not block launch.

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

If a minor issue appears:

```txt
Record it.
Do not patch immediately.
Group it for a future polish chapter.
Do not reopen dice behavior.
```

---

## Support Report Format

Use this format for any reported issue:

```txt
Issue ID:
Date / time:
Reporter:
Device:
Browser:
User account:
Route:
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

## Rollback Rule

Rollback or emergency patch only if one of these happens:

```txt
Game cannot open
Login fails for real user
Player cannot enter room
Wallet balance is wrong
Bet path is broken
Dice and board mismatch
Settlement is missing
Next round is stuck
App crashes
```

Do not rollback for minor visual preference.

---

## First Support Priority

Highest priority support issues:

```txt
Wallet trust
Bet placement trust
Dice/result match trust
Settlement trust
Next-round continuity
```

These are more important than visual polish.

---

## Future Polish Parking Lot

Record future ideas here without acting immediately:

```txt
Idea:
Reason:
Priority:
Can wait? yes / no:
```

Examples of future non-emergency polish:

```txt
Lobby visual polish
Cashier copy polish
Profile polish
Admin usability polish
Mobile spacing refinement
Future dice motion beauty polish
Sound layering later
```

---

## Final Instruction

If post-launch monitoring notes are saved and build passes, mark:

```txt
90.3G-C5Z — Post-Launch Monitoring / Support Notes
Status: PASS / LOCKED
```

After this chapter, the C5 chain is complete.

Next safe direction:

```txt
Chapter 91 — Future Product Polish Planning
```

Only open Chapter 91 when Gary explicitly chooses the next product area.
Do not reopen dice behavior.
