# Nagani Chapter 91.5 — Profile Polish Lock

## Chapter

```txt
91.5-F — Profile Polish Lock
Status: LOCK
```

This document locks the completed Profile polish pass after the Six Animal MVP production baseline was protected.

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
91.3 — Cashier Trust Polish — PASS / LOCKED
91.4 — Remove History / Live Player Pages — PASS / LOCKED
91.5 — Profile Polish — READY TO LOCK
```

---

## 91.5 Completed Work

```txt
91.5-A — Profile Page Fake Stats Cleanup: PASS
91.5-B — ProfileMemberCard Audit: PASS
91.5-C — ProfileAccountStatus Static Claim Cleanup: PASS
91.5-D — ProfileQuickActions Removed History / Live Links: PASS
91.5-E — ProfileSupportSecurity History / Preview Text Cleanup: PASS
91.5-F — Profile Polish Lock: CURRENT
```

---

## What Was Checked

Profile surfaces reviewed:

```txt
src/app/profile/page.tsx
src/components/profile/ProfileMemberCard.tsx
src/components/profile/ProfileAccountStatus.tsx
src/components/profile/ProfileQuickActions.tsx
src/components/profile/ProfileSupportSecurity.tsx
```

---

## What Was Improved

Completed profile polish:

```txt
- Removed fake hardcoded profile stats
- Removed Demo Player wording
- Confirmed member card safely shows member name, member ID, and wallet balance
- Replaced static account-status claims with safer member guide wording
- Removed Profile quick links to /history and /live
- Added useful quick links: Cashier, Six Animal, Lobby
- Removed History reference from support/security copy
- Removed frontend preview / backend-auth placeholder wording
- Kept logout behavior unchanged
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

Profile polish did not rewrite account logic.

Dice behavior was not changed.

---

## Current Profile Behavior

Current player-facing profile behavior:

```txt
Player can view member name.
Player can view member ID.
Player can view current wallet balance.
Player can open Cashier.
Player can enter Six Animal.
Player can return to Lobby.
Player can read safe account/security guidance.
Player can logout.
```

Removed from profile surface:

```txt
Fake stats
Demo Player wording
History link
Live Results link
Frontend preview text
Backend-auth placeholder text
```

---

## Pass Condition

This lock passes when:

```txt
- Profile page loads
- Member card is clear
- No fake stats are shown
- No History / Live links remain
- No frontend preview text remains
- No backend/internal placeholder wording remains
- Production build passes
- Dice behavior remains untouched
```

---

## Final Lock

```txt
91.5-F — Profile Polish Lock
Status: PASS / LOCKED
```

Next safe chapter:

```txt
91.6 — Admin Usability Polish
```

Do not reopen dice behavior.
