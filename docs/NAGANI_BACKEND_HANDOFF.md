# Nagani 6+36 — Backend Handoff Document

## Product Name

Nagani / နဂါးနီ

## Product Goal

Nagani is a premium Myanmar traditional web-game platform focused on two main games:

1. ၆ ကောင်ဂျင်
2. ၃၆ ကောင်ထီ

The current project is a clean frontend foundation built in `nagani-traditional`.

This is not the old slot/reel prototype.  
There should be no slot-machine logic, no Buffalo clone direction, and no emoji-final asset direction.

The final product should feel like:

- Premium Myanmar traditional game platform
- Red dragon brand identity
- Mobile-first user app
- Clear wallet/cashier flow
- Live results and history
- Simple operator/admin control center
- Later: immersive 2.5D traditional game-room experience

---

# Current Frontend Status

## Player Routes

These routes already exist and work with mock data:

- `/`
- `/six-animal`
- `/thirty-six`
- `/cashier`
- `/history`
- `/live`
- `/profile`

## Admin Routes

These routes already exist and work as mock foundation:

- `/admin`
- `/admin/users`
- `/admin/wallet-requests`
- `/admin/six-animal`
- `/admin/thirty-six`
- `/admin/settings`

Admin pages are intentionally left simple for now.  
Do not overbuild admin UI before backend data shape is confirmed.

---

# Important System Rule

Frontend must never be the source of truth for:

- Wallet balance
- Bet acceptance
- Game result
- Payout
- Win/loss settlement
- Draw result
- Transaction status
- Admin approval

Frontend can only display backend-approved data.

Backend must be the source of truth.

---

# Game 1: ၆ ကောင်ဂျင် Backend Requirement

## Current Frontend Behavior

Route:

- `/six-animal`

Current mock behavior:

- User selects one animal
- User enters bet amount
- User confirms bet
- Mock dice result appears
- Match count/result label appears

## Backend Needed Later

Backend should handle:

- Create game round
- Accept user bet
- Check wallet balance
- Deduct bet amount safely
- Generate or receive server-side result
- Calculate match count
- Calculate payout
- Settle wallet
- Save bet record
- Save round record
- Publish result for live/history pages

## Possible Table Ideas

### `six_animal_rounds`

Suggested fields:

- `id`
- `round_code`
- `result_animals`
- `status`
- `started_at`
- `settled_at`
- `created_at`

### `six_animal_bets`

Suggested fields:

- `id`
- `user_id`
- `round_id`
- `selected_animal`
- `bet_amount`
- `match_count`
- `payout_amount`
- `status`
- `created_at`
- `settled_at`

## Open Questions

Backend/product team must confirm:

- Final animal list
- Final payout rules
- Whether payout means profit only or total return
- Whether rounds are instant per user or shared public rounds
- Whether dice result is RNG-generated or admin-recorded
- How to audit/admin-review suspicious rounds

---

# Game 2: ၃၆ ကောင်ထီ Backend Requirement

## Current Frontend Behavior

Route:

- `/thirty-six`

Current mock behavior:

- User selects one or more numbers
- Selected chips appear
- User enters amount per selected number
- Total bet calculates
- User confirms draw bet
- Mock ticket message appears

## Backend Needed Later

Backend should handle:

- Current draw creation
- Draw open/closed status
- Draw close time
- Bet ticket creation
- Multiple selected numbers per ticket
- Wallet balance check
- Wallet deduction
- Result publishing
- Win/loss settlement
- Ticket status update
- History record creation
- Live result publication

## Possible Table Ideas

### `thirty_six_draws`

Suggested fields:

- `id`
- `draw_code`
- `draw_name`
- `open_at`
- `close_at`
- `result_number`
- `result_animal`
- `status`
- `published_at`
- `created_at`

### `thirty_six_tickets`

Suggested fields:

- `id`
- `user_id`
- `draw_id`
- `total_amount`
- `status`
- `created_at`
- `settled_at`

### `thirty_six_ticket_lines`

Suggested fields:

- `id`
- `ticket_id`
- `number`
- `animal_label`
- `bet_amount`
- `payout_amount`
- `status`

## Open Questions

Backend/product team must confirm:

- Final 36-number animal mapping
- Final payout rules
- Draw schedule
- Whether admin manually publishes result
- What happens if draw is cancelled
- Whether tickets can be refunded
- Whether betting closes before draw time
- How many numbers a user can select per ticket

---

# Wallet / Cashier Requirement

## Current Frontend Behavior

Route:

- `/cashier`

Current mock behavior:

- Deposit tab
- Withdraw tab
- Amount input
- Note field
- Mock submit request
- Recent ticket list

## Backend Needed Later

Backend should handle:

- Real wallet balance
- Deposit request creation
- Withdraw request creation
- Admin approval/rejection
- Wallet ledger
- Transaction history
- Prevent negative wallet balance
- Prevent duplicate settlement
- Record admin action and audit trail

## Possible Table Ideas

### `wallets`

Suggested fields:

- `id`
- `user_id`
- `balance`
- `currency`
- `status`
- `created_at`
- `updated_at`

### `wallet_requests`

Suggested fields:

- `id`
- `user_id`
- `type`
- `amount`
- `note`
- `status`
- `admin_note`
- `reviewed_by`
- `reviewed_at`
- `created_at`

### `wallet_transactions`

Suggested fields:

- `id`
- `user_id`
- `type`
- `amount`
- `balance_before`
- `balance_after`
- `reference_type`
- `reference_id`
- `created_at`

## Critical Wallet Safety Rules

- Wallet deduction must happen server-side only.
- Bet creation and wallet deduction should be atomic.
- Payout and wallet credit should be atomic.
- Admin approval should not be able to settle twice.
- Withdraw should not create negative wallet balance.
- All wallet changes should create ledger records.
- Users should only read their own wallet and records.
- Admin actions should be logged.

---

# History Page Requirement

## Current Frontend Behavior

Route:

- `/history`

Current mock behavior:

- All filter
- ၆ ကောင်ဂျင် filter
- ၃၆ ကောင်ထီ filter
- Wallet filter
- Mock records

## Backend Needed Later

History should load:

- Six Animal bets
- Thirty Six tickets
- Wallet transactions
- Deposit/withdraw request statuses
- Win/loss/pending/cancelled states

Frontend should not calculate final status.  
Backend should return final display-safe history records.

---

# Live Results Requirement

## Current Frontend Behavior

Route:

- `/live`

Current mock behavior:

- All tab
- ၆ ကောင်ဂျင် tab
- ၃၆ ကောင်ထီ tab
- Winners tab
- Mock recent results
- Mock winners

## Backend Needed Later

Live page should load:

- Recent Six Animal results
- Recent Thirty Six draw results
- Recent winner feed
- Privacy-safe member names
- Result timestamps

Possible approach:

- Polling first
- Realtime later if needed

Privacy rule:

Do not expose full user identity on public winner feed.

---

# Profile Requirement

## Current Frontend Behavior

Route:

- `/profile`

Current mock behavior:

- Member card
- Mock balance
- Mock stats
- Account status
- Quick actions
- Support/security section
- Visual logout button

## Backend Needed Later

Profile should load:

- Auth user
- Member ID
- Display name
- Wallet balance
- Bet count
- Win count
- Wallet ticket count
- Member status
- Real logout action

---

# Admin Requirement

## Current Frontend Behavior

Admin routes already exist as mock pages:

- `/admin`
- `/admin/users`
- `/admin/wallet-requests`
- `/admin/six-animal`
- `/admin/thirty-six`
- `/admin/settings`

Admin UI is good enough for now.  
Do not over-componentize before backend.

## Backend Needed Later

Admin should handle:

- Admin authentication
- Role/permission check
- View users
- View wallet balances
- Approve/reject wallet requests
- View Six Animal rounds/bets
- View Thirty Six draws/tickets
- Publish Thirty Six draw result
- View settings
- Audit admin actions

## Possible Admin Role Ideas

Start simple:

- `user`
- `admin`

Later possible roles:

- `operator`
- `support`
- `owner`

Do not add complex role logic until required.

---

# Suggested Backend Actions / APIs

## Auth

- Get current user
- Get current member profile
- Logout

## Wallet

- Get wallet balance
- Submit deposit request
- Submit withdraw request
- List wallet requests
- List wallet transactions

## Six Animal

- Get current/recent rounds
- Submit Six Animal bet
- Get user Six Animal bet history
- Get public Six Animal results

## Thirty Six

- Get current draw
- Submit Thirty Six ticket
- Get user Thirty Six ticket history
- Admin publish draw result
- Get public Thirty Six results

## Admin

- Get admin dashboard stats
- List users
- List wallet requests
- Approve wallet request
- Reject wallet request
- List game records
- Publish draw result
- Update platform settings

---

# Frontend Integration Notes

Current frontend uses mock data only.

When backend is ready, replace mock data page by page:

1. `/cashier`
2. `/profile`
3. `/history`
4. `/live`
5. `/six-animal`
6. `/thirty-six`
7. `/admin`

Recommended backend integration order:

1. Auth/profile/wallet read
2. Cashier request flow
3. Wallet ledger/history
4. Six Animal bet flow
5. Thirty Six draw/ticket flow
6. Live results
7. Admin settlement tools

---

# Compliance / Safety Reminder

Before any real-money production launch, the project must review:

- Local legality
- Gambling/game rules
- Age restrictions
- Wallet/payment compliance
- RNG fairness
- Admin abuse prevention
- Audit logs
- Terms and policies

Do not launch real-money production without legal/compliance review.

---

# Current Decision

Admin frontend will stay as mock foundation for now.

Priority after this handoff:

1. Backend contract and database design
2. User/player frontend polish
3. Real asset direction
4. Backend integration
5. Admin hardening later

---

# One-Line Backend Mission

Build a secure backend where wallet, bet result, payout, draw settlement, history, and admin approval are server-trusted, auditable, and safe for future production review.