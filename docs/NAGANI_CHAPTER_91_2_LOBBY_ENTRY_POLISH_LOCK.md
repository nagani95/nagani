# Nagani Chapter 91.2 — Lobby / Entry Polish Lock

## Chapter

```txt
91.2-G — Lobby / Entry Polish Lock
Status: LOCK
```

This document locks the completed lobby / entry polish pass after the Six Animal MVP production baseline was protected.

This is not a dice tuning chapter.
This is not a backend rewrite chapter.
This is not a feature expansion chapter.

The Six Animal dice MVP heart remains locked and untouched.

---

## Current Baseline

```txt
90.3G-C5L → C5Z — COMPLETE / LOCKED
Chapter 91 — Future Product Polish Planning — PASS / LOCKED
91.1 — Product Surface Audit — PASS / LOCKED
91.2 — Lobby / Entry Polish — READY TO LOCK
```

---

## 91.2 Completed Work

```txt
91.2-A — Home Page Entry Audit: PASS WITH POLISH NOTES
91.2-B — LobbyGameCards Audit: PASS
91.2-C — LobbyHero Audit: PASS
91.2-D — LobbyRecentActivity Player-Facing Polish: PASS
91.2-E — Thirty Six Coming Soon Lock: PASS
91.2-F — Remove Confusing Demo Entry: PASS
91.2-G — Lobby / Entry Polish Lock: CURRENT
```

---

## What Was Improved

The lobby / entry path was cleaned for MVP launch trust.

Completed changes:

```txt
- Removed player-facing mock / frontend preview wording from LobbyRecentActivity
- Replaced fake recent activity with safe MVP player-center status copy
- Locked Thirty Six as Coming Soon
- Removed confusing Play Demo entry
- Kept Login / Register as the clean production guest entry
- Kept Six Animal wallet-balance entry protection
- Confirmed LobbyGameCards locked state is safe
- Confirmed LobbyHero has no dev/debug wording
```

---

## Protected Rules

Do not touch:

```txt
Dice physics
Shadow worker tuning
Recorded replay behavior
Dice holder / trapdoor
Backend result logic
Wallet logic
Admin logic
Supabase functions
Settlement logic
Sound implementation
Production assets
```

Dice behavior was not changed during 91.2.

---

## Current Lobby Entry Behavior

Current production lobby behavior:

```txt
Guest user:
- Sees Login
- Sees Register
- Does not see Play Demo

Logged-in funded user:
- Sees Wallet Connected
- Sees wallet balance
- Can enter Six Animal

Logged-in low-balance user:
- Sees Six Animal locked
- Sees minimum 1,000 MMK balance requirement

Thirty Six:
- Visible as Coming Soon
- Not clickable as a production-ready game
```

---

## Player-Facing Safety

Confirmed no lobby-facing leak of:

```txt
Mock activity shown for frontend preview
Backend will later provide
dev text
debug text
worker / shadow wording
RNG wording
dice tuning wording
```

---

## Pass Condition

This lock passes when:

```txt
- Lobby opens cleanly
- Login / Register are visible for guests
- Play Demo is removed
- Six Animal entry is protected by wallet balance
- Thirty Six is Coming Soon / locked
- LobbyRecentActivity no longer shows fake live results
- Production build passes
- Dice behavior remains untouched
```

---

## Final Lock

```txt
91.2-G — Lobby / Entry Polish Lock
Status: PASS / LOCKED
```

Next safe chapter:

```txt
91.3 — Cashier Trust Polish
```

Do not reopen dice behavior.
