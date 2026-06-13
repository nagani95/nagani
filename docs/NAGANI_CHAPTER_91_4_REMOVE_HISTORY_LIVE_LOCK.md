# Nagani Chapter 91.4 — Remove History / Live Player Pages Lock

## Chapter

```txt
91.4-C — Remove History / Live Player Pages Lock
Status: LOCK
```

This document locks the MVP decision to remove useless **History** and **Live** player-facing pages from the current Nagani launch surface.

This is not a dice tuning chapter.
This is not a backend rewrite chapter.
This is not a database cleanup chapter.

The Six Animal dice MVP heart remains locked and untouched.

---

## Current Baseline

```txt
90.3G-C5L → C5Z — COMPLETE / LOCKED
Chapter 91 — Future Product Polish Planning — PASS / LOCKED
91.1 — Product Surface Audit — PASS / LOCKED
91.2 — Lobby / Entry Polish — PASS / LOCKED
91.3 — Cashier Trust Polish — PASS / LOCKED
91.4 — Remove History / Live Player Pages — READY TO LOCK
```

---

## Completed Work

```txt
91.4-A — Remove History / Live Player Navigation: PASS
91.4-B — Redirect Removed History / Live Routes: PASS
91.4-C — Remove History / Live Player Pages Lock: CURRENT
```

---

## What Was Changed

Player-facing navigation was simplified.

Completed changes:

```txt
- Removed Live from BottomNav
- Removed History from BottomNav
- BottomNav now shows Home / Cashier / Profile only
- Removed Live Results button from lobby game cards
- /history route redirects safely to /
- /live route redirects safely to /
- Production build passes
```

---

## What Was Not Changed

Do not confuse this chapter with data deletion.

This chapter did not delete or rewrite:

```txt
Wallet transaction records
Bet records
Admin records
Supabase tables
Settlement records
Backend functions
Dice behavior
```

The change is only player-facing route/navigation cleanup.

---

## Reason

History and Live pages were not useful enough for the current MVP launch.

Leaving them visible could make the product feel unfinished or confusing.

For MVP, the player-facing surface should stay focused:

```txt
Home
Cashier
Profile
Six Animal room
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

Dice behavior was not changed during 91.4.

---

## Current Player Navigation

Current player navigation:

```txt
Home
Cashier
Profile
```

Removed from player navigation:

```txt
Live
History
```

Old direct URLs:

```txt
/history → /
/live → /
```

---

## Pass Condition

This lock passes when:

```txt
- Bottom nav no longer shows Live
- Bottom nav no longer shows History
- Lobby no longer shows Live Results
- /history redirects to /
- /live redirects to /
- Production build passes
- Dice behavior remains untouched
```

---

## Final Lock

```txt
91.4-C — Remove History / Live Player Pages Lock
Status: PASS / LOCKED
```

Next safe chapter:

```txt
91.5 — Profile Polish
```

Do not reopen dice behavior.
