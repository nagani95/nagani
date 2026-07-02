# Nagani Slot V1 Backend Core Snapshot

Date locked: 2026-07-02  
Project: nagani-traditional  
Chapter: Nagani Slot Backend Core Foundation  
Status: PASS / LOCKED

---

## 1. Production Rule Locked

Nagani Slot V1 must follow this rule:

Frontend does not decide result.  
Frontend does not calculate payout.  
Frontend does not update balance.

Real flow:

Player clicks Spin  
→ Backend checks login  
→ Backend checks wallet  
→ Backend locks wallet row  
→ Backend deducts bonus first, then cash  
→ Backend generates result grid  
→ Backend evaluates paylines and scatter  
→ Backend applies max payout cap  
→ Backend pays winnings to cash balance  
→ Backend records slot_spins  
→ Backend records wallet_transactions  
→ Frontend only animates backend result

---

## 2. Database Foundation Verified

Existing Nagani wallet foundation confirmed solid:

- profiles.phone_number = OK
- profiles.first_deposit_approved_at = OK
- profiles.first_cash_play_settled_at = OK
- profiles.withdrawal_unlocked = OK
- wallets.balance = OK
- wallets.bonus_balance = OK
- wallets.profile_id UNIQUE = OK
- duplicate wallet profiles = 0
- wallet_transactions amount positive = OK
- six_animal_bets.cash_amount = OK
- six_animal_bets.bonus_amount = OK
- bonus_grants = OK
- wallet_requests payment fields = OK
- player_payment_accounts = OK

Small timestamp patch completed:

- bonus_grants.granted_at added
- player_payment_accounts.created_at added

---

## 3. Existing RPC Foundation Verified

Important functions confirmed:

- handle_new_user = OK
- grant_welcome_bonus_2000 = OK
- place_six_animal_bet = OK
- settle_six_animal_round = OK
- review_wallet_request = OK
- is_nagani_admin = OK
- assign_my_referral_by_code = OK
- agent functions = OK

Wallet safety pattern confirmed from Six Animal:

- auth.uid check = YES
- wallet row lock FOR UPDATE = YES
- bonus_balance used = YES
- cash_amount recorded = YES
- bonus_amount recorded = YES
- wallet_transactions written = YES

---

## 4. New Slot Tables Created

Created:

### public.slot_math_versions

Purpose:

Stores slot math setup by version so old spins remain auditable even if math changes later.

Important columns:

- id
- version_code
- status: draft / active / retired
- rtp_target
- symbols jsonb
- reel_strips jsonb
- paylines jsonb
- payout_table jsonb
- min_bet
- max_bet
- max_payout_per_spin
- created_at
- activated_at

Safety:

- only one active version allowed
- RLS enabled
- admin can read
- authenticated players can read active math version

---

### public.slot_spins

Purpose:

Permanent audit table for every slot spin.

Important columns:

- id
- profile_id
- math_version_id
- bet_amount
- cash_amount
- bonus_amount
- payout_amount
- result_grid
- winning_lines
- scatter_result
- promo_result
- balance_before_cash
- balance_before_bonus
- balance_after_cash
- balance_after_bonus
- status
- created_at

Safety:

- bet_amount must equal cash_amount + bonus_amount
- all balance numbers nonnegative
- RLS enabled
- admin can read all slot spins
- player can read own slot spins only

---

## 5. Active Math Version Seeded

Active version:

NAGANI_SLOT_V1_LOW_CAP_82

Values:

- status: active
- rtp_target: 82.00
- min_bet: 100
- max_bet: 1,000
- max_payout_per_spin: 20,000
- symbol_count: 10
- reel_count: 5
- payline_count: 10

Allowed bet buttons:

- 100
- 200
- 500
- 1,000

Frontend symbol keys matched:

- dragon
- gold_pot
- buffalo
- bell
- ruby
- harp
- bagan
- ever_stand
- bonus
- wild

---

## 6. RPC Created

### get_active_nagani_slot_math()

Status: PASS

Purpose:

Returns active slot math version for frontend/admin use.

Verified result:

- version_code = NAGANI_SLOT_V1_LOW_CAP_82
- rtp_target = 82.00
- min_bet = 100
- max_bet = 1000
- max_payout_per_spin = 20000
- symbols = 10
- reels = 5
- paylines = 10

---

### spin_nagani_slot(p_bet_amount numeric)

Status: PASS

Purpose:

Main backend spin function.

It does:

- requires login
- loads active math version
- validates bet amount
- allows only 100 / 200 / 500 / 1000
- locks wallet row
- checks balance
- deducts bonus first
- deducts cash second
- generates 5x3 result grid
- evaluates 10 fixed paylines left-to-right
- wild replaces normal symbols only
- bonus scatter pays anywhere
- applies max payout cap
- pays winnings to cash balance only
- records slot_spins row
- records wallet_transactions
- updates first_cash_play_settled_at if cash was used
- unlocks withdrawal only if first deposit exists and cash play settled

---

## 7. Backend Safety Tests Passed

### Login Required Test

SQL Editor anonymous call:

select public.spin_nagani_slot(100);

Result:

ERROR: LOGIN_REQUIRED

PASS.

---

### Real Permanent 100 MMK Spin

Test player:

d31b2dab-170c-4bc4-b7b2-1142e5f1d1a0

Result:

- bet_amount = 100
- cash_amount = 0
- bonus_amount = 100
- payout_amount = 0
- status = settled
- slot_spins saved
- wallet_transactions saved

Wallet movement:

- cash: 19,000 → 19,000
- bonus: 56,000 → 55,900

Transaction:

- slot_bet_bonus = 100

PASS.

---

### Invalid Bet Test

Test:

spin_nagani_slot(300)

Result:

ERROR: INVALID_BET_AMOUNT

PASS.

---

### 1000 MMK Allowed Bet Dry Run

Result:

- bet_amount = 1000
- cash_amount = 0
- bonus_amount = 1000
- payout_amount = 1000
- payout_amount <= 20,000

PASS.

---

### Max Payout Cap Test

Forced all reels to dragon inside rollback transaction.

Raw payout:

- 10 winning lines
- each raw line payout = 25,000
- uncapped payout = 250,000

Final backend payout:

- payout_amount = 20,000
- max_payout_per_spin = 20,000
- cap_applied = true
- promo_result.uncapped_payout_amount = 250,000
- promo_result.capped_payout_amount = 20,000

PASS.

---

### Insufficient Balance Test

Temporary wallet inside rollback:

- balance = 0
- bonus_balance = 50

Spin:

spin_nagani_slot(100)

Result:

ERROR: INSUFFICIENT_BALANCE

Rollback restored wallet:

- cash = 19,000
- bonus = 55,900
- total = 74,900

PASS.

---

### Cash + Bonus Split Test

Temporary wallet inside rollback:

- cash = 1,000
- bonus = 50

Spin:

spin_nagani_slot(100)

Result:

- bet_amount = 100
- cash_amount = 50
- bonus_amount = 50
- balance_before_cash = 1000
- balance_before_bonus = 50
- balance_after_cash = 950
- balance_after_bonus = 0

Wallet transactions:

- slot_bet_cash = 50
- slot_bet_bonus = 50

PASS.

---

## 8. Frontend Preparation Completed

Updated:

src/lib/naganiSlot/symbols.ts

Added exported helper:

- getNaganiSlotSymbolByKey
- buildSlotColumnsFromBackendGrid

Purpose:

Backend returns string grid:

[
  ["ever_stand", "buffalo", "bonus"],
  ...
]

Frontend board needs NaganiSlotSymbol[][].

The helper converts backend result_grid into frontend-ready symbol columns.

Build result:

npm run build = PASS

---

## 9. Current Status

This chapter is locked:

Nagani Slot V1 Backend Core Foundation = DONE.

Not yet done:

- /dev/nagani-slot is not connected to spin_nagani_slot yet
- frontend still uses demo spin logic
- frontend still uses local demo balance
- no slot simulation script yet
- no slot_daily_stats yet
- no admin slot dashboard yet
- no invite reward yet
- no weekly lossback yet
- no Golden Pot community mechanic yet

---

## 10. Next Chapter

Next chapter:

Connect /dev/nagani-slot frontend to backend RPC.

Planned order:

1. Add frontend RPC types/helper
2. Update NaganiSlotRoom.tsx imports
3. Replace createDemoSpinResultColumns with backend spin result
4. Keep existing reel animation timing
5. Use backend result_grid for final stopped columns
6. Use backend payout_amount for reward count
7. Use backend balance.cash + balance.bonus for displayed balance
8. Keep frontend local demo fallback only if needed for dev
9. Run build
10. Test real spin from browser

Important:

Do not let frontend calculate payout.
Do not let frontend deduct balance by itself.
Do not let frontend generate final result.