# Nagani Game Rules Draft v0.2

## Product

Nagani — Premium Myanmar Traditional Games Platform

Main games:

1. ၆ ကောင်ဂျင်
2. ၃၆ ကောင်ထီ

This document is the working rule lock before backend settlement logic.

Important:

- This document guides frontend, backend, admin, designer, and handover.
- Frontend mock behavior is not final settlement logic.
- Backend must be the source of truth for wallet, result, payout, and records.

---

# 1. ၆ ကောင်ဂျင်

## Game Type

Myanmar traditional animal dice game.

## MVP Animal List

1. ကျား — Tiger
2. နဂါး — Dragon
3. ကြက် — Rooster
4. ငါး — Fish
5. ဂဏန်း — Crab
6. ဘူး — Gourd

Final asset names must follow these animal keys unless Gary changes the animal list before asset production.

## Dice Count

MVP uses:

- 3 dice

## Player Flow

1. User opens ၆ ကောင်ဂျင်.
2. User sees wallet balance and game status.
3. User selects one animal.
4. User enters bet amount.
5. User confirms bet.
6. Backend accepts the bet and deducts wallet.
7. Backend generates or returns the 3-dice result.
8. Frontend displays result.
9. Backend settles payout.
10. Bet appears in History.
11. Public result can appear in Live Results.

## Bet Rules

- Minimum bet: 1,000 MMK
- Maximum bet: 500,000 MMK
- MVP supports one selected animal per bet.
- Multiple animal betting can be Phase 2.
- User cannot confirm bet if wallet balance is insufficient.
- User cannot confirm bet if game status is closed.

## Payout Working Draft

If selected animal appears in the 3 dice:

- 0 matching dice = loss
- 1 matching dice = 1x win multiplier
- 2 matching dice = 2x win multiplier
- 3 matching dice = 3x win multiplier

Backend team must confirm final settlement meaning before production:

- Option A: payout is profit only, then stake return is handled separately.
- Option B: payout is total returned amount including stake.

Until backend confirmation, frontend should only display result and match count, not final financial payout.

## Result Control

MVP working assumption:

- Result is generated server-side.
- Frontend only displays result.
- Frontend never calculates final wallet payout.
- Every result must be recorded.
- Every wallet change must create a transaction record.

## Frontend States Needed

- Loading wallet
- Game open
- Game closed
- Select animal
- Enter amount
- Confirming bet
- Rolling/revealing result
- Won
- Lost
- Insufficient balance
- Backend error

---

# 2. ၃၆ ကောင်ထီ

## Game Type

36-animal draw / lottery game.

## Animal List

Temporary frontend list:

- Animal 1 to Animal 36

Final Myanmar animal names, numbers, and asset filenames must be confirmed before final asset production.

## Draw Model

MVP working assumption:

- There is a current draw.
- Draw can be open or closed.
- Users can place bets only while draw is open.
- Result can be published by operator/admin.
- Settlement happens after result is published.

## Player Flow

1. User opens ၃၆ ကောင်ထီ.
2. User sees current draw status.
3. User sees next draw time or draw close status.
4. User selects one or more animal numbers.
5. User enters bet amount per selected animal.
6. User confirms before draw closes.
7. Backend deducts wallet and records bet lines.
8. Result is published.
9. Winning bets are settled.
10. Wallet/history updates.
11. Public result appears in Live Results.

## Bet Rules

- Minimum bet: 1,000 MMK per selected animal
- Maximum bet: 500,000 MMK per selected animal
- User can select multiple animals.
- Each selected animal creates one bet line.
- Total bet = bet amount × selected animal count.
- User cannot confirm if draw is closed.
- User cannot confirm if wallet balance is insufficient.

## Payout Working Draft

- Winning animal payout: 30x

Backend team must confirm final settlement meaning before production:

- Option A: payout is profit only, then stake return is handled separately.
- Option B: payout is total returned amount including stake.

Until backend confirmation, frontend should show selected tickets and draw status, not final financial settlement.

## Draw Control

MVP working assumption:

- Draw result can be published by operator/admin.
- Settlement must happen server-side.
- Frontend never decides winning result.
- Admin publishing must be logged.
- Cancelled draw/refund behavior must be confirmed before backend production.

## Frontend States Needed

- Loading current draw
- Draw open
- Draw closed
- Result published
- Select numbers
- Confirming bet
- Pending draw
- Won
- Lost
- Cancelled/refunded
- Backend error

---

# 3. Wallet Safety Rules

- Frontend never directly changes wallet balance.
- Frontend never decides final payout.
- Frontend never decides final result.
- Bet placement must deduct wallet server-side.
- Payout settlement must happen server-side.
- Every wallet change must create a transaction record.
- Admin actions must be logged.
- Users can only read their own private bet/wallet records.
- Public pages can show limited recent result/winner activity only.

---

# 4. Admin MVP Rules

Admin MVP should support:

- View users
- View wallet requests
- Approve/reject deposit requests
- Approve/reject withdraw requests
- View ၆ ကောင်ဂျင် rounds/bets
- View ၃၆ ကောင်ထီ draws/bets
- Publish ၃၆ ကောင်ထီ result if manual draw mode is used
- View or edit basic game settings
- Audit important actions later

Admin UI rules:

- Desktop-style admin is acceptable.
- Do not use mobile bottom nav on admin pages.
- Keep tables clear.
- Important actions need confirmation.
- Avoid overbuilding roles in MVP.

---

# 5. MVP Scope Lock

Included:

- Lobby
- ၆ ကောင်ဂျင်
- ၃၆ ကောင်ထီ
- Cashier
- History
- Live results
- Profile
- Basic admin
- Mobile-first user UI
- Desktop-style admin UI
- Mock frontend first
- Backend integration later

Not included in MVP unless quoted separately:

- Certified RNG audit
- Legal/gambling license service
- Payment gateway automation
- App Store / Play Store launch
- Advanced fraud system
- Full enterprise security audit
- Many extra games

---

# 6. Open Questions Before Backend Production

Gary/backend team must confirm:

## ၆ ကောင်ဂျင်

- Is 3 dice final?
- Is one-animal bet enough for MVP?
- Does payout multiplier mean profit only or total return?
- Should result be automatic server RNG or admin-controlled?
- Should there be round timer or instant round?

## ၃၆ ကောင်ထီ

- What are the final 36 animal names?
- What are the fixed numbers for each animal?
- What are the draw times?
- How many minutes before draw should betting close?
- Does 30x mean profit only or total return?
- Should result be manual admin publish or automatic?
- What happens if a draw is cancelled?

## Wallet

- Which balance model will backend use?
- What wallet request statuses are final?
- What transaction types are final?
- What admin audit logs are required?

---

# 7. Current Working Status

Chapter 0:

- Complete

Chapter 1:

- Rule lock in progress

Current frontend:

- Mock/demo only
- No real wallet settlement yet
- No real backend game result yet
- No real Supabase integration yet