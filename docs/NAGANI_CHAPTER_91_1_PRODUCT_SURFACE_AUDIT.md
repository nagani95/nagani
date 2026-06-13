# Nagani Chapter 91.1 — Product Surface Audit

## Chapter

```txt
91.1 — Product Surface Audit
Status: AUDIT
```

This chapter audits the visible product surfaces after the Six Animal MVP production baseline has been locked.

This is not a dice tuning chapter.
This is not a backend rewrite chapter.
This is not a feature expansion chapter.

The Six Animal dice MVP heart is complete and protected.

---

## Locked Baseline

```txt
90.3G-C5L → C5Z: COMPLETE / LOCKED
Chapter 91 — Future Product Polish Planning: PASS / LOCKED
91.1 — Product Surface Audit: CURRENT
```

---

## Protected Rule

Do not change:

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

Only record issues in this chapter.

No code change unless Gary confirms a real blocker.

---

## Audit Goal

Review the visible MVP product surfaces and identify:

```txt
Blocker
Minor issue
Polish idea
Future idea
```

Do not patch immediately.

---

## Routes To Audit

```txt
/
 /six-animal
 /cashier
 /history
 /profile
 /admin
```

---

## Audit Checklist

### 1. Lobby / Home

```txt
- Opens correctly
- Looks respectful and premium enough for MVP
- Player can find Six Animal room
- No broken button
- No dev/debug text
```

Status:

```txt
Pending
```

---

### 2. Six Animal Room

```txt
- Production baseline still works
- Player can enter room
- Betting sheet usable
- Dice/result/settlement flow still safe
- No dice behavior change needed
```

Status:

```txt
Locked / observe only
```

---

### 3. Cashier

```txt
- Wallet balance visible
- Deposit request path understandable
- Withdraw request path understandable
- No confusing/dev wording
- Mobile layout usable
```

Status:

```txt
Pending
```

---

### 4. History

```txt
- User can understand previous activity
- Bet / wallet history is readable
- No broken layout
- No confusing labels
```

Status:

```txt
Pending
```

---

### 5. Profile

```txt
- User account info is readable
- Navigation is clear
- No broken layout
- No dev/debug text
```

Status:

```txt
Pending
```

---

### 6. Admin

```txt
- Admin access still protected
- Wallet request review usable
- Approve / reject flow understandable
- No obvious layout blocker
```

Status:

```txt
Pending
```

---

## Issue Recording Format

Use this format for each issue:

```txt
Issue:
Route:
Type: Blocker / Minor / Polish / Future
What I saw:
Why it matters:
Suggested action:
Patch now? yes / no
```

---

## Pass Condition

This chapter passes when:

```txt
- Main routes are reviewed
- No release blocker is found
- Any minor issues are recorded only
- Dice behavior remains untouched
- Build passes
```

---

## Next Safe Chapter

After this audit passes, choose one small polish branch:

```txt
91.2 — Lobby / Entry Polish
91.3 — Cashier Trust Polish
91.4 — Profile / History Polish
91.5 — Admin Usability Polish
91.6 — Mobile UI Refinement
```

Do not start dice polish.
