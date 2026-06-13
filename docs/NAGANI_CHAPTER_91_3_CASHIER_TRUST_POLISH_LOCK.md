# Nagani Chapter 91.3 — Cashier Trust Polish Lock

## Chapter

```txt
91.3-F — Cashier Trust Polish Lock
Status: LOCK
```

This document locks the completed cashier trust polish pass after the Six Animal MVP production baseline was protected.

This is not a dice tuning chapter.
This is not a backend rewrite chapter.
This is not a wallet logic rewrite chapter.

The Six Animal dice MVP heart remains locked and untouched.

---

## Current Baseline

```txt
90.3G-C5L → C5Z — COMPLETE / LOCKED
Chapter 91 — Future Product Polish Planning — PASS / LOCKED
91.1 — Product Surface Audit — PASS / LOCKED
91.2 — Lobby / Entry Polish — PASS / LOCKED
91.3 — Cashier Trust Polish — READY TO LOCK
```

---

## 91.3 Completed Work

```txt
91.3-A — Cashier Page Audit: PASS
91.3-B — CashierRequestForm Trust Audit: PASS
91.3-C — CashierHero Trust Audit: PASS
91.3-D — CashierRecentTickets Empty State Polish: PASS
91.3-E — CashierNote Player-Facing Trust Polish: PASS
91.3-F — Cashier Trust Polish Lock: CURRENT
```

---

## What Was Checked

Cashier trust surfaces were reviewed:

```txt
src/app/cashier/page.tsx
src/components/cashier/CashierRequestForm.tsx
src/components/cashier/CashierHero.tsx
src/components/cashier/CashierRecentTickets.tsx
src/components/cashier/CashierNote.tsx
```

---

## What Was Improved

Completed cashier polish:

```txt
- Confirmed wallet balance display is safe
- Confirmed deposit / withdraw tabs are clear
- Confirmed request amount and minimum amount wording is clear
- Confirmed request summary shows Pending review
- Confirmed recent tickets show player-friendly statuses
- Added safe empty state for users with no wallet tickets
- Removed frontend preview / backend internal wording from cashier note
- Replaced dev-style copy with player-facing wallet review guidance
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

Cashier polish did not rewrite wallet logic.

Dice behavior was not changed.

---

## Current Cashier Behavior

Current player-facing cashier behavior:

```txt
Player can see current wallet balance.
Player can submit deposit request.
Player can submit withdraw request.
Requests show as Pending review until reviewed.
Confirmed requests show as Confirmed.
Rejected requests show as Rejected.
Empty wallet ticket history shows a clean empty state.
Cashier guide explains review flow without dev/internal wording.
```

---

## Player-Facing Safety

Confirmed no cashier-facing leak of:

```txt
Frontend preview only
backend settlement
backend records
mock data
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
- Cashier page loads
- Wallet balance displays
- Deposit / withdraw request form is clear
- Recent wallet ticket history is clear
- Empty state is safe
- Cashier guide is production-friendly
- Production build passes
- Dice behavior remains untouched
```

---

## Final Lock

```txt
91.3-F — Cashier Trust Polish Lock
Status: PASS / LOCKED
```

Next safe chapter:

```txt
91.4 — Profile / History Polish
```

Do not reopen dice behavior.
