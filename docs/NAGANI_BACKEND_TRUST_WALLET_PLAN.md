# Nagani Backend / Trust / Wallet Integration Plan

Status: Draft v0.1
Project: Nagani Traditional
Primary Room: ၆ ကောင်ဂျင် / ဂလုန်းဂလုန်း

## 1. Purpose

Backend integration must make the live room trustworthy, stable, and safe.

The backend must support:

* server-controlled round state
* real wallet debit on bet lock
* real settlement after result
* realtime room updates
* bet history
* admin monitoring
* fairness and security rules

Backend work must not break the current accepted frontend room flow.

## 2. Current Frontend Baseline

Current `/six-animal` frontend is accepted as a stable prototype baseline.

Current accepted state:

* mobile-first 3D room
* visible physical dice source of truth
* betting 20s
* bets closed 3s
* rolling waits for physical dice completion
* 2s reveal pause
* result display 6s
* compact betting sheet
* active bet lock
* result board
* settlement layer
* muted room direction
* full room flow QA passed

## 3. Backend Integration Goal

The backend should eventually control:

* room ID
* round number
* round phase
* phase timestamps
* betting open/close time
* accepted bets
* wallet debit
* result publication
* wallet settlement
* bet history records
* admin room monitoring

The frontend should display backend state clearly without feeling like the table is fake.

## 4. Trust Rule

The player must trust the result.

Frontend production rule remains:

* visible dice result must match displayed result
* result board must mirror visible dice
* settlement must wait for confirmed result
* no suspicious result mismatch
* no hidden frontend override

Backend must not force the UI to show a result that visibly disagrees with dice animation.

## 5. Wallet Rule

Wallet behavior must be safe.

Required:

* validate balance before bet lock
* debit wallet only once per accepted bet
* prevent duplicate bet submission
* prevent betting after betting closes
* settlement must credit correct amount
* wallet history must record debit and payout
* failed bet must not debit wallet
* failed settlement must be recoverable/admin-visible

## 6. Realtime Room Rule

All users in the room should see the same round state.

Required:

* same round number
* same betting timer
* same phase
* same result
* same next-round reset timing

Frontend timer can display countdown, but source of truth should become backend timestamps later.

## 7. Admin Monitoring Goal

Admin should eventually see:

* current room state
* current round number
* phase
* total bet amount
* number of players/bets
* published result
* settlement status
* failed settlement alerts
* suspicious activity flags

Admin work should come after backend data shape is stable.

## 8. What Must Not Be Broken

Backend integration must not break:

* current mobile room layout
* visible dice source of truth
* betting sheet
* active bet lock
* result board
* settlement clarity
* muted room direction
* build stability
* current frontend QA flow

## 9. Short-Term Decision

Do not connect backend immediately.

Current decision:

* plan backend/trust/wallet integration first
* preserve current frontend mock flow
* define backend state shape carefully
* avoid rushing wallet logic before trust rules are clear
* keep frontend stable until backend contract is ready

## 10. Future Acceptance Checklist

Backend integration is accepted only when:

* server round timer works
* wallet debit works once per accepted bet
* duplicate bet prevention works
* betting closes correctly
* result publication works
* settlement credit works
* bet history is written
* frontend result board remains clear
* visible dice/result trust is preserved
* admin can monitor round state
* full room flow QA passes
* build passes

## 11. Round State / Backend Contract Requirements

The backend round state must become the single shared room clock later. Frontend should display the room state, not invent a separate truth.

### 11.1 Round State Fields

Future backend round state should include:

- `roomId`
- `roundId`
- `roundNumber`
- `phase`
- `bettingStartsAt`
- `bettingEndsAt`
- `rollingStartsAt`
- `resultRevealedAt`
- `nextRoundStartsAt`
- `resultAnimals`
- `status`
- `createdAt`
- `updatedAt`

### 11.2 Round Phases

Allowed phases:

- `betting`
- `closed`
- `rolling`
- `result`

Frontend may still show local loading/intro, but backend room phase should use only real round phases.

### 11.3 Timer Rule

Backend timestamps should control timing later.

Frontend should calculate countdown from backend timestamps:

- betting countdown from `bettingEndsAt`
- closed/rolling transition from backend phase
- result countdown from `nextRoundStartsAt`

Frontend should not decide the official round ending time after backend integration.

### 11.4 Result Rule

Future result state should include:

- three confirmed animal results
- result publication timestamp
- settlement status
- round status

Result must not be shown to player before visible dice flow confirms it.

### 11.5 Frontend Display Rule

Frontend should display:

- current round number
- current phase
- countdown
- betting availability
- result board
- settlement state

Frontend must not allow betting when backend phase is not `betting`.

### 11.6 Contract Acceptance Checklist

Round state contract is accepted only when:

- all phases are clear
- timestamps are enough for frontend countdown
- frontend can prevent late bets
- result can be published safely
- settlement can link to round result
- realtime clients can stay synced
- current frontend room flow can map to backend state

## 12. Bet Submission / Wallet Debit Requirements

Bet submission must be safe, single-use, and trusted. A player should never be charged twice for the same bet.

### 12.1 Bet Submission Goal

When the player presses Place Bet, backend should:

* validate user session
* validate room
* validate active round
* validate betting phase
* validate selected animal
* validate bet amount
* validate wallet balance
* create accepted bet record
* debit wallet once
* return locked bet state to frontend

### 12.2 Bet Request Fields

Future bet submission should include:

* `roomId`
* `roundId`
* `roundNumber`
* `animalKey`
* `amount`
* `clientRequestId`

The `clientRequestId` should prevent duplicate submissions from double taps, retries, or network delay.

### 12.3 Backend Validation Rules

Backend must reject bet if:

* user is not authenticated
* round does not exist
* round phase is not `betting`
* betting time already ended
* animal is invalid
* amount is below minimum
* amount is above maximum
* user balance is too low
* duplicate `clientRequestId` was already accepted

### 12.4 Wallet Debit Rules

Wallet debit must be atomic.

Required:

* bet record and wallet debit happen together
* if bet insert fails, wallet must not debit
* if wallet debit fails, bet must not be accepted
* accepted bet must have clear wallet transaction record
* duplicate submission must not create duplicate debit

### 12.5 Frontend Lock Rule

Frontend should lock the bet only after backend confirms acceptance.

Frontend should show:

* selected animal
* locked amount
* round number
* pending state while submitting
* error state if backend rejects

Frontend must not pretend bet is accepted if backend rejects it.

### 12.6 Bet Submission Acceptance Checklist

Bet submission is accepted only when:

* valid bet locks successfully
* insufficient balance fails safely
* late bet fails safely
* duplicate tap does not double debit
* wallet transaction is recorded
* bet history can show the accepted bet
* frontend locked state matches backend accepted bet
* build passes

## 13. Settlement / Wallet Credit Requirements

Settlement must be accurate, recoverable, and trusted. A player must receive the correct return after the visible dice result is confirmed.

### 13.1 Settlement Goal

After a round result is confirmed, backend should:

* read all accepted bets for the round
* read the confirmed result animals
* calculate match count for each bet
* calculate return amount
* calculate net result
* credit winning wallets
* mark losing bets as settled
* write settlement records
* expose settlement status to frontend and admin

### 13.2 Match Count Rule

For Six Animal, each accepted bet has one selected animal.

Match count:

* `0` means no match
* `1` means selected animal appeared once
* `2` means selected animal appeared twice
* `3` means selected animal appeared three times

The frontend settlement display should mirror this clearly.

### 13.3 Return / Net Rule

Current prototype rule:

* if match count is `0`, return is `0`
* if match count is greater than `0`, return is bet amount plus profit
* current mock profit is `betAmount × matchCount`
* current mock payout is `betAmount + profit`
* current mock net is profit for win, negative bet amount for loss

Final production formula must be locked before real wallet launch.

### 13.4 Wallet Credit Rule

Wallet credit must be atomic and traceable.

Required:

* credit wallet only once per settled bet
* create wallet transaction record
* link transaction to bet ID and round ID
* prevent duplicate settlement credit
* failed credit must be admin-visible
* settlement can be retried safely

### 13.5 Settlement Status

Each bet should have a settlement status:

* `pending`
* `won`
* `lost`
* `settlement_failed`
* `refunded` if needed later

Each round should have settlement summary status:

* `pending`
* `settling`
* `settled`
* `settlement_failed`

### 13.6 Frontend Settlement Rule

Frontend should show settlement only after backend confirms settlement or pending settlement state.

Frontend should show:

* chosen animal
* result animals
* match count
* bet amount
* return amount
* net result
* status if settlement is delayed

Frontend must not show wallet credit as final if backend has not confirmed it.

### 13.7 Settlement Acceptance Checklist

Settlement integration is accepted only when:

* win calculation is correct
* loss calculation is correct
* wallet credit happens once
* duplicate settlement is prevented
* failed settlement is visible
* bet history records settlement result
* frontend settlement matches backend result
* admin can inspect settlement state
* build passes

## 14. Realtime Room Sync / Bet History Requirements

Realtime sync must make all players see the same room state without breaking trust or timing.

### 14.1 Realtime Room Goal

All connected players should share:

- same room ID
- same round number
- same phase
- same countdown source
- same result
- same next round timing

Frontend may animate locally, but official room state should come from backend.

### 14.2 Realtime Events

Future realtime events may include:

- `round_started`
- `betting_closed`
- `rolling_started`
- `result_published`
- `settlement_started`
- `settlement_completed`
- `next_round_scheduled`

### 14.3 Frontend Sync Rule

Frontend should:

- subscribe to room state
- update phase from backend
- calculate countdown from backend timestamps
- disable betting when backend phase is not `betting`
- show result only after confirmed result state
- handle reconnect safely

Frontend should not create a separate official room timeline after backend is connected.

### 14.4 Internal Bet Record Requirements

Each accepted bet should still create an internal backend bet record.

This record is needed for:

- settlement calculation
- wallet debit/credit linking
- admin monitoring
- audit/debugging
- fraud or duplicate request investigation

This does not need to become a separate player-facing betting history screen.

Player-facing history can stay focused on wallet transactions only.

### 14.5 Wallet History Requirements

Wallet history should include:

- debit transaction for accepted bet
- credit transaction for winning settlement
- refund transaction if needed later
- transaction status
- linked bet ID
- linked round ID

### 14.6 Reconnect / Refresh Rule

If player refreshes during a round:

- frontend should reload current backend room state
- active accepted bet should restore if already placed
- betting should remain locked if bet was accepted
- result should show if already published
- settlement should show if already settled

### 14.7 Acceptance Checklist

Realtime and wallet history requirements are accepted only when:

- all clients see the same phase
- countdown stays synced from backend timestamps
- late bets are blocked
- refresh restores active bet state
- internal bet records exist for settlement/admin/audit
- player-facing wallet history shows debit/credit records
- result and settlement records match backend state
- build passes

## 15. Admin Monitoring / Security & Fairness Requirements

Admin monitoring must help the team detect wallet, round, settlement, and suspicious activity problems clearly.

### 15.1 Admin Monitoring Goal

Admin should eventually monitor:

- current active rooms
- current round number
- current phase
- total accepted bets
- total bet amount
- result animals
- settlement status
- failed settlements
- suspicious duplicate requests
- unusual betting activity

### 15.2 Round Monitoring

Admin room monitor should show:

- room ID
- round ID
- round number
- phase
- betting start/end time
- result revealed time
- next round start time
- round status

### 15.3 Bet Monitoring

Bet records are internal/admin/audit records.

Admin should see:

- accepted bet count
- total accepted amount
- bet by animal summary
- large bet alerts
- duplicate request attempts
- rejected late bet attempts
- failed wallet debit attempts

No separate player betting-round history screen is required.

### 15.4 Settlement Monitoring

Admin should see:

- settlement pending count
- settled bet count
- failed settlement count
- total payout amount
- wallet credit status
- retry-needed settlement records

### 15.5 Security Rules

Backend must protect:

- authenticated user identity
- wallet balance writes
- bet creation
- settlement writes
- admin-only monitoring
- duplicate bet prevention
- late bet prevention
- result publication permissions

Frontend must not be trusted for wallet or result authority.

### 15.6 Fairness / Trust Rules

Production fairness must be clear before real wallet launch.

Rules:

- result generation strategy must be documented
- backend result must be auditable
- visible dice animation must not contradict result
- admin should not secretly edit settled results
- settlement history must remain traceable
- wallet history must show player-facing debit/credit/refund records
- suspicious actions must be logged

### 15.7 Acceptance Checklist

Admin/security/fairness planning is accepted only when:

- admin can inspect active room state
- admin can inspect accepted bets internally
- admin can inspect settlement status
- failed settlement is visible
- wallet writes are protected
- duplicate bets are prevented
- late bets are rejected
- result publication is permission-controlled
- wallet history is enough for player-facing history
- fairness strategy is documented before real wallet launch
- build passes

## 16. Backend Integration Phases / Safe Frontend Bridge

Backend integration must be done step by step. The current `/six-animal` frontend room is stable, so backend work should not replace the whole flow at once.

### 16.1 Integration Rule

Do not connect full backend wallet/round logic in one step.

Each backend integration phase must preserve:

- current mobile room layout
- visible physical dice source of truth
- betting sheet behavior
- active bet lock clarity
- result board clarity
- settlement clarity
- muted room direction
- build stability

### 16.2 Phase 1 — Read-Only Backend Round State

First backend bridge should be read-only.

Scope:

- fetch current room state
- show backend round number
- show backend phase
- show backend timestamps
- compare backend countdown with current mock countdown

Acceptance:

- frontend still works if backend is unavailable
- no wallet action yet
- no real bet submission yet
- build passes

### 16.3 Phase 2 — Backend-Controlled Timer

After read-only state works, backend timestamps can control countdown.

Scope:

- betting countdown from `bettingEndsAt`
- result countdown from `nextRoundStartsAt`
- phase updates from backend state
- local timer becomes display-only

Acceptance:

- all clients see same timer
- betting closes correctly
- frontend does not invent official round end time
- build passes

### 16.4 Phase 3 — Real Bet Submission

After backend timer is stable, connect Place Bet.

Scope:

- submit selected animal
- submit amount
- include `clientRequestId`
- backend validates round/phase/balance
- backend debits wallet once
- frontend locks only after backend confirms

Acceptance:

- valid bet locks
- late bet rejects
- duplicate tap does not double debit
- insufficient balance rejects safely
- wallet history shows debit
- build passes

### 16.5 Phase 4 — Backend Settlement

After bet submission is stable, connect settlement.

Scope:

- backend calculates match count
- backend calculates return/net
- backend credits wallet once
- frontend shows settlement from backend state
- failed settlement is visible to admin

Acceptance:

- win/loss calculation is correct
- duplicate settlement is prevented
- wallet history shows credit/refund if needed
- frontend settlement matches backend
- build passes

### 16.6 Phase 5 — Realtime Room Sync

After backend round/bet/settlement works, connect realtime updates.

Scope:

- room phase subscription
- result publication event
- settlement event
- reconnect/refresh restoration
- active bet restore

Acceptance:

- all clients see same round state
- refresh restores active accepted bet
- late betting stays blocked
- next round reset works
- build passes

### 16.7 Phase 6 — Admin Monitoring

Admin monitoring comes after backend data shape is stable.

Scope:

- active rooms
- current rounds
- internal accepted bet records
- wallet debit/credit status
- settlement status
- suspicious/duplicate request logs

Acceptance:

- admin can inspect room state
- admin can inspect internal bet records
- admin can inspect settlement failures
- player-facing history remains wallet history only
- build passes

### 16.8 What Must Stay Untouched During Backend Bridge

Do not change these during early backend bridge:

- dice physics
- table camera
- result detection
- production target correction lock
- sound/audio strategy
- 3D table visual baseline
- betting board visual baseline

Backend bridge must support the stable room, not rebuild it.

## 17. Backend / Trust / Wallet Plan Lock

The backend, trust, and wallet integration plan is now the safe guide for future real-money backend work.

### 17.1 Current Planning Baseline

Current accepted backend planning covers:

- backend-controlled round state
- server timestamp rules
- bet submission requirements
- atomic wallet debit
- settlement and wallet credit
- realtime room sync
- wallet-history-only player history
- internal/admin/audit bet records
- admin monitoring
- security and fairness requirements
- phased backend integration plan

### 17.2 Current Frontend Baseline To Preserve

Future backend work must preserve the accepted `/six-animal` frontend baseline:

- mobile-first 3D room
- visible physical dice source of truth
- no backend forced visual mismatch
- betting 20s
- bets closed 3s
- rolling waits for physical dice completion
- 2s reveal pause
- result display 6s
- compact betting sheet
- active bet lock
- result board
- settlement layer
- muted room direction
- build stability

### 17.3 Backend Work Must Not Start With Full Wallet Launch

Do not connect real wallet logic all at once.

Correct order:

1. read-only backend round state
2. backend-controlled timer
3. real bet submission
4. wallet debit
5. settlement credit
6. realtime sync
7. admin monitoring

### 17.4 Player History Decision

Player-facing history should be wallet history only.

Player should see:

- bet debit
- win credit
- refund if needed
- transaction status

Separate player betting-round history is not required now.

Bet records remain internal/admin/audit records.

### 17.5 Chapter 36 Lock Decision

Chapter 36 is a planning chapter.

Do not start backend code until:

- backend contract is ready
- wallet transaction model is ready
- round state model is ready
- frontend bridge can be added safely
- current room flow remains protected

Current decision:

Keep `/six-animal` frontend stable and use this document as the backend/trust/wallet integration guide.

## Chapter 58 — Full Live Room Safety QA Lock

Chapter 58 is complete enough.

The `/six-animal` live backend room passed the core safety QA checks:

- Late join during Closed/Rolling/Result waits for next Betting.
- Late player cannot place a bet into an in-progress round.
- Backend bet restores safely after refresh.
- Duplicate bet is blocked.
- Wallet debit happens once.
- Settlement payout happens once.
- No-match settlement does not credit wallet.
- Leave Room before bet returns immediately.
- Leave Room after bet waits safely until the round is safe.
- Refresh during Betting/Closed/Rolling/Result does not create duplicate debit or payout.
- Backend `result_animals` is the source of truth.
- UI result matches backend result.
- Two-device result source-of-truth QA passed.
- Frontend does not settle the round.
- Frontend does not force result phase.
- Frontend does not own round timing.

Current accepted limitation:

- Refresh/rejoin during Rolling restores backend result state safely, but the physical dice motion is not yet a perfect deterministic shared replay across devices.
- This is accepted for the live backend safety stage.
- Final deterministic shared dice playback belongs to later production polish after backend safety is locked.

Chapter 58 lock rule:

Do not change wallet, settlement, bet submission, backend result authority, round timing, or live-room restore logic unless fixing a confirmed safety bug.

## Chapter 59 — Admin / Monitoring Foundation Lock

Chapter 59 adds the first real admin monitoring foundation for the Six Animal live backend room.

### Completed Admin Monitoring Scope

The admin monitoring foundation is read-only.

The admin can now see:

- current Six Animal backend round number
- current backend phase
- current backend room status
- backend phase target timestamp
- live admin countdown / refresh monitor
- backend result animals through `six_animal_results`
- current round bet count
- current round total bet amount
- current round settled bet count
- current round unsettled bet count
- latest current-round bets
- latest backend rounds
- latest round bet totals
- latest round settled / unsettled summary
- latest wallet transactions
- admin warning area for read/query problems
- settlement watch warning when result phase still has unsettled bets

### Admin Home Bridge

`/admin` now shows a real Six Animal backend dealer snapshot instead of only mock static values.

The admin home displays:

- current Six Animal round number
- current phase
- current bet count
- current bet total
- room status
- phase target timestamp
- settled and unsettled count
- direct link to `/admin/six-animal`

### Detailed Monitor Page

`/admin/six-animal` is now the detailed Six Animal monitoring page.

It reads from:

- `six_animal_rounds`
- `six_animal_results`
- `six_animal_bets`
- `wallet_transactions`

### Safety Boundary

The admin monitoring foundation must stay read-only.

Admin monitoring must not:

- advance live rounds
- create live rounds
- force result phase
- change result animals
- place bets
- cancel bets
- debit wallets
- credit wallets
- retry settlement
- manually settle payouts
- control player dice animation
- change player `/six-animal` state

Backend remains the dealer.

Player browser remains only a watcher / participant.

Admin monitor is only an operator visibility layer.

### Player Room Protection

Chapter 59 did not change player `/six-animal` live-room logic.

The following player safety rules remain locked:

- frontend does not own round timing
- frontend does not own dice result
- frontend does not call settlement
- frontend does not force result phase
- backend result remains source of truth
- wallet debit is handled by backend bet placement function
- payout is handled by backend settlement function
- refresh/rejoin safety remains protected
- backend rolling timeline restore remains accepted enough for current stage

### Accepted Limitation

Admin monitoring is currently a read-only MVP foundation.

Future admin production work may add:

- filtered wallet transaction visibility by round/user
- settlement failure table
- cron health status
- room runner heartbeat
- admin-only retry tools
- audit logs for every admin action
- role-based admin permissions
- security hardening for operator routes

Those future tools must be designed carefully and must not be added until the read-only monitoring foundation is locked and tested.

### Chapter 59 Lock

Chapter 59 Admin / Monitoring Foundation is accepted as the first backend operator visibility layer.

Current safe next branch:

- Chapter 60 — Admin Security / Access Control Foundation

Do not return to table/dice beauty polish until backend/admin safety foundation is locked further.

## Chapter 60 — Admin Security / Access Control Foundation

Chapter 60 starts the admin security foundation for the Nagani backend/live-room operator routes.

### Current Problem Found

Before Chapter 60, admin pages existed but had no route-level protection.

The project had:

- no `middleware.ts`
- no `src/app/admin/layout.tsx`
- no production login page
- only `/dev/login` for anonymous player QA
- no role column in `profiles`
- no real admin permission table yet

This meant `/admin` routes were unsafe if left open.

### Chapter 60.2 Admin Route Guard

A server-side admin layout guard was added at:

```txt
src/app/admin/layout.tsx

## Chapter 60.5 — Admin Security Foundation Final Lock

Chapter 60.5 closes the first admin access-control foundation.

### QA Passed

Admin guard QA passed:

- private / unauthenticated browser is blocked from `/admin`
- private / unauthenticated browser is blocked from `/admin/six-animal`
- wrong logged-in anonymous player is blocked from `/admin`
- wrong logged-in user shows Admin Access Denied
- allowed Supabase admin user opens `/admin`
- allowed Supabase admin user opens `/admin/six-animal`
- Six Animal admin monitor still reads backend live room state
- admin guard protects all nested `/admin/*` routes through `src/app/admin/layout.tsx`
- build passed

### Current Admin Security Status

The admin area is no longer openly reachable.

Current access rule:

```txt
Supabase logged-in user + user.id exists in NAGANI_ADMIN_USER_IDS

## Chapter 62 — Admin Audit Log / Operator Visibility Foundation

Chapter 62 adds the first read-only admin audit log visibility layer.

### Chapter 62.1 Audit Finding

The database already had:

```txt
public.admin_audit_logs

## Chapter 63.3 — Backend Health / Cron Runner Monitoring Lock

Status: Passed and locked.

Chapter 63 added read-only backend health visibility for the Six Animal global live room.

Locked backend rule:
The backend remains the dealer. The player browser must not control round timing, dice result, wallet debit, payout, settlement, or round advancement.

Completed:

- Confirmed `pg_cron` is installed and active.
- Confirmed `cron` schema exists.
- Confirmed cron job `six-animal-main-room-runner` exists.
- Confirmed cron job runs every 5 seconds.
- Confirmed cron job calls `public.advance_six_animal_room('11111111-1111-1111-1111-111111111111')`.
- Confirmed recent cron runs succeed.
- Confirmed failed cron run query returned no rows during audit.
- Confirmed old unsettled result bet query returned no rows during audit.
- Confirmed the live Six Animal round advances normally.
- Confirmed `public.six_animal_rooms` does not exist and should not be used.
- Confirmed backend health should read from:
  - `cron.job`
  - `cron.job_run_details`
  - `public.six_animal_rounds`
  - `public.six_animal_bets`
  - `public.wallet_transactions`

Added protected backend health RPC:

- `public.get_six_animal_backend_health()`

RPC safety:

- Uses `security definer`.
- Checks `public.is_nagani_admin()`.
- Blocks non-admin users with `admin only`.
- Revoked from public.
- Granted execute to `authenticated` and `service_role`.
- SQL Editor test correctly returned `admin only` outside logged-in admin context.

Added admin page:

- `src/app/admin/backend-health/page.tsx`

Admin Backend Health page shows:

- Health status.
- Cron active status.
- Last run age.
- Current round number.
- Old unsettled bet count.
- Cron job name.
- Cron schedule.
- Last run status.
- Last run started/ended time.
- Last run duration.
- Return message.
- Current room phase.
- Current round status.
- Current round age.
- Phase target.
- Backend timestamps.
- Failed runs in the last hour.
- Latest failed run status/message.
- Latest backend result animals when visible.
- Read-only lock notice.

Admin home updated:

- Added `/admin/backend-health` card after Audit Log and before Six Animal monitor.

QA passed:

- `/admin/backend-health` opens for enabled admin user.
- Page shows Healthy state.
- Cron Active shows Yes.
- Last Run updates within expected 5-second rhythm.
- Current backend round is visible.
- Failed Runs Last Hour shows 0.
- Old Unsettled Bets shows 0.
- No admin write buttons were added.
- No manual settlement was added.
- No payout retry was added.
- No force round advance was added.
- Player `/six-animal` was not touched.

Locked rule after Chapter 63:

Admin Backend Health is read-only monitoring only. It must not mutate round state, wallet state, bet state, result state, settlement state, or player room state.

## Chapter 64.3 — Financial Integrity / Wallet Safety Monitoring Lock

Status: Passed and locked.

Chapter 64 added read-only financial integrity monitoring for Six Animal wallet, bet, and payout safety.

Locked backend rule:
The backend remains the dealer. The player browser must not control wallet debit, payout, settlement, result, or round timing.

Audit completed:

- Checked negative wallet balances.
- Checked duplicate bets per user per round.
- Checked old unsettled bets after result phase.
- Checked recent Six Animal wallet transactions.
- Checked recent Six Animal payout transactions.
- Checked combined bet + wallet transaction timeline.

Audit result:

- Negative wallet balances: 0.
- Duplicate bet pairs: 0.
- Old unsettled result bets: 0.
- Six Animal debit and payout transaction rows are visible.
- Latest bet + wallet transaction timeline is visible.

Added protected financial integrity RPC:

- `public.get_six_animal_financial_integrity()`

RPC safety:

- Uses `security definer`.
- Checks `public.is_nagani_admin()`.
- Blocks non-admin users with `admin only`.
- Revoked from public.
- Granted execute to `authenticated` and `service_role`.
- SQL Editor test correctly returned `admin only` outside logged-in admin context.

Added admin page:

- `src/app/admin/financial-integrity/page.tsx`

Admin Financial Integrity page shows:

- Integrity status.
- Negative wallet count.
- Duplicate bet pair count.
- Old unsettled bet count.
- Six Animal transaction count.
- Payout transaction count.
- Latest bet timestamp.
- Latest wallet transaction timestamp.
- Negative wallet detail list.
- Duplicate bet detail list.
- Old unsettled bet detail list.
- Recent Six Animal wallet transactions.
- Recent Six Animal payouts.
- Combined latest bet + wallet transaction timeline.
- Read-only lock notice.

Admin home updated:

- Added `/admin/financial-integrity` card after Backend Health and before Six Animal monitor.

QA passed:

- `/admin/financial-integrity` opens for enabled admin user.
- Page shows Clean state.
- Negative Wallets shows 0.
- Duplicate Bet Pairs shows 0.
- Old Unsettled Bets shows 0.
- Six Animal transaction rows are visible.
- Payout transaction rows are visible.
- No admin write buttons were added.
- No wallet edit tool was added.
- No manual settlement was added.
- No payout retry was added.
- No force round advance was added.
- Player `/six-animal` was not touched.

Locked rule after Chapter 64:

Admin Financial Integrity is read-only monitoring only. It must not mutate wallet state, bet state, settlement state, result state, round state, payout state, or player room state.

## Chapter 65.3 — Database RLS / Public Exposure Safety Lock

Status: Passed and locked.

Chapter 65 audited and cleaned database RLS, table grants, and RPC execute exposure for the Nagani Six Animal backend/admin foundation.

Locked backend rule:
The backend remains the dealer. The player browser must not control round timing, dice result, wallet debit, payout, settlement, or round advancement.

Audit completed:

- Checked RLS status for important public tables.
- Checked policies for important public tables.
- Checked direct table grants for `anon`, `authenticated`, and `public`.
- Checked dealer RPC execute grants.
- Checked player-safe RPC execute grants.
- Checked admin monitor RPC execute grants.

RLS confirmed enabled on:

- `admin_audit_logs`
- `admin_users`
- `game_rooms`
- `profiles`
- `six_animal_bets`
- `six_animal_results`
- `six_animal_rounds`
- `wallet_transactions`
- `wallets`

Important finding:

- RLS was enabled, but table-level grants were too broad.
- `anon` and `authenticated` had broad direct table privileges such as INSERT, UPDATE, DELETE, TRUNCATE, TRIGGER, and REFERENCES.
- Admin monitor RPCs also had explicit `anon` execute grants.

Cleanup completed:

- Removed `anon` execute access from:
  - `public.get_six_animal_backend_health()`
  - `public.get_six_animal_financial_integrity()`

- Revoked broad table privileges from `anon` and `authenticated`.

- Re-granted only needed read access:
  - `game_rooms` SELECT to `anon`, `authenticated`
  - `six_animal_rounds` SELECT to `anon`, `authenticated`
  - `wallets` SELECT to `authenticated`
  - admin-read tables SELECT to `authenticated`, protected by RLS/admin policies

Dealer RPCs remain locked:

- `advance_six_animal_room` → `postgres`, `service_role`
- `rotate_six_animal_round` → `postgres`, `service_role`
- `settle_six_animal_round` → `postgres`, `service_role`
- `close_and_roll_six_animal` → `postgres`, `service_role`

Player-safe RPCs remain available only to authenticated users:

- `place_six_animal_bet`
- `get_my_six_animal_bet`

Admin monitor RPCs now require authenticated execution and still check `public.is_nagani_admin()` internally:

- `get_six_animal_backend_health`
- `get_six_animal_financial_integrity`

QA passed:

- `/admin` opens.
- `/admin/backend-health` opens.
- `/admin/financial-integrity` opens.
- `/admin/six-animal` opens.
- Admin monitor pages still read backend data correctly.
- Dealer RPCs remain unavailable to normal public/authenticated users.
- Player-safe RPCs remain available for logged-in player flow.
- Player `/six-animal` was not touched.

Locked rule after Chapter 65:

Database security must stay least-privilege. RLS and grants must work together. Future admin pages should use protected read-only RPCs or admin RLS policies first, and no admin write tool should be added without audit logging and explicit safety review.

## Chapter 66.2 — Backend/Admin Safety Final End-to-End Lock

Status: Passed and locked.

Chapter 66 completed the final backend/admin safety QA after cron monitoring, financial integrity monitoring, audit visibility, admin access control, RLS cleanup, table grant cleanup, and RPC exposure cleanup.

Locked live-room rule:

The backend is the dealer. The player browser only joins, watches, and submits valid bets. The player browser must not control round timing, dice result, wallet debit, payout, settlement, or round advancement.

Final admin QA passed:

- `/admin` opens for enabled admin user.
- `/admin/six-animal` opens.
- `/admin/backend-health` opens.
- `/admin/financial-integrity` opens.
- `/admin/audit-log` opens.
- Admin pages do not show permission/RLS errors.
- Backend Health monitor reads cron runner and live round state.
- Financial Integrity monitor reads wallet/bet/transaction safety state.
- Six Animal Admin monitor reads current backend round.
- Audit Log opens even when empty.
- All admin pages remain read-only.

Final player QA passed:

- `/six-animal` opens.
- Player can join room.
- Player can wait for backend betting phase.
- Player can select animal.
- Player can place small bet.
- Bet locks correctly.
- Wallet debit happens once.
- Round continues through betting → closed → rolling → result.
- Settlement appears safely.
- Payout/no-match behavior remains safe.
- Next round resets normally.
- Player room still works after RLS and table grant cleanup.

Security state locked:

- Dealer RPCs remain service-role only:
  - `advance_six_animal_room`
  - `rotate_six_animal_round`
  - `settle_six_animal_round`
  - `close_and_roll_six_animal`

- Player RPCs remain authenticated only:
  - `place_six_animal_bet`
  - `get_my_six_animal_bet`

- Admin monitor RPCs require authenticated execution and internal admin check:
  - `get_six_animal_backend_health`
  - `get_six_animal_financial_integrity`

- RLS remains enabled on important tables.
- Broad `anon` and `authenticated` table privileges were cleaned.
- Admin monitoring remains read-only.
- No admin write buttons were added.
- No manual settlement was added.
- No payout retry was added.
- No force round advance was added.
- No player room timing/result authority was added.

Final backend/admin safety lock:

The Six Animal backend/admin foundation is complete enough for this stage. Future work may add admin write tools only after a separate safety chapter with audit logging, confirmation UX, role checks, and rollback planning.

Next major roadmap branch:

Return to Six Animal production realism and MVP beauty:
- table/tray/dice production realism
- dice material upgrade
- Myanmar royal / ကနုတ် ornament layer
- production table asset path
- deterministic/shared dice replay polish later