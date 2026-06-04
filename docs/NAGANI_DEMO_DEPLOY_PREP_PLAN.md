# Nagani Traditional — Demo / Deploy Preparation Plan

Version: v0.1
Status: Chapter 38 Planning Started
Project: `nagani-traditional`

---

## 1. Purpose

This document prepares Nagani Traditional for safe demo and deploy presentation.

The goal is not to add risky new features yet.

The goal is to clearly lock:

* what is demo-ready
* what is still mock/prototype
* what must not be misunderstood as production backend
* what must not be changed before demo
* what should be checked before deploy
* what should be protected after the stable Six Animal demo lock

---

## 2. Current Demo-Ready Baseline

Chapter 37 is complete enough and locked.

The current accepted demo baseline is:

* mobile-first 3D Six Animal room
* visible physical 3D dice as source of truth
* no backend forced result
* no production target correction
* no old sample table
* no dev/lab UI
* muted room direction
* accepted betting sheet
* accepted Bets Closed phase
* accepted physical 3D dice rolling
* accepted rolling/result board
* accepted settlement layer
* accepted room atmosphere
* accepted next-round reset
* build passing

This baseline should be treated as stable and demo-presentable.

---

## 3. Protected Stable Area

The `/six-animal` player room is now protected.

Do not change stable `/six-animal` files unless:

1. fixing a confirmed real bug,
2. correcting a demo-blocking layout issue,
3. making a small safe copy/text clarification,
4. or preparing a controlled future chapter with clear rollback path.

Protected files include:

* `src/app/six-animal/page.tsx`
* `src/components/games/six-animal/ThreeDiceSequenceController.tsx`
* `src/components/games/six-animal/ThreeDicePhysicsStage.tsx`
* `src/components/games/six-animal/SixAnimalBettingSheet.tsx`
* `src/lib/threeDiceResultAdapter.ts`
* `src/types/sixAnimalRoom.ts`

Any change to these files must preserve the Chapter 37 locked demo behavior.

---

## 4. Demo-Ready Features

The following parts are acceptable for demo:

### Six Animal / ၆ ကောင်ဂျင်

* mobile-first game room
* room intro
* 20-second betting phase
* animal selection
* bet amount selection
* place bet / lock bet
* 3-second Bets Closed transition
* physical 3D dice rolling sequence
* visible dice result capture
* rolling result board progress
* final result display
* settlement feedback
* no-bet round behavior
* next round reset
* muted presentation

### Trust / Visual Source of Truth

The demo must clearly show that:

* dice roll visually before result is finalized
* result board follows visible dice
* settlement follows the visible result
* no hidden backend target is forcing the result in production room
* no dev correction UI is visible
* no suspicious after-stop dice turning is used

---

## 5. Mock / Prototype Areas

The following areas are still mock or prototype and must not be presented as production-ready backend systems.

### Wallet

Current wallet/balance behavior is frontend mock only.

Not production-ready yet:

* real deposit
* real withdrawal
* real wallet debit
* real wallet credit
* real transaction ledger
* real anti-duplicate settlement protection

### Backend Round State

Current room flow is frontend/mock controlled.

Not production-ready yet:

* backend-created round ID
* backend-controlled timer
* backend room sync
* backend result storage
* backend settlement authority
* reconnect recovery

### Betting Records

Current bet behavior is demo/mock only.

Not production-ready yet:

* real bet submission API
* backend validation
* atomic wallet debit
* internal/admin bet audit records
* fraud/duplicate protection

### Admin Monitoring

Admin monitoring is planning-level only.

Not production-ready yet:

* live room monitor
* internal bet monitor
* settlement monitor
* wallet audit dashboard
* security/fairness logs

---

## 5.5 Demo-Ready vs Mock Feature Checklist

This section separates what can be safely shown in a demo from what must be clearly explained as mock or not production-connected yet.

---

### 5.5.1 Demo-Ready / Safe To Show

These areas are safe to show as part of the current frontend demo.

| Area                   | Status     | Demo Note                                          |
| ---------------------- | ---------- | -------------------------------------------------- |
| Six Animal room layout | Demo-ready | Mobile-first 3D room is accepted.                  |
| Room intro             | Demo-ready | Safe to show as part of player entry.              |
| Betting countdown      | Demo-ready | Frontend-controlled 20-second demo timer.          |
| Animal selection       | Demo-ready | Tiger, Dragon, Rooster, Fish, Crab, Elephant only. |
| Bet amount selection   | Demo-ready | Demo interaction only, not real wallet debit.      |
| Place Bet / bet lock   | Demo-ready | Shows intended player UX.                          |
| Bets Closed phase      | Demo-ready | Accepted 3-second transition.                      |
| 3D dice rolling        | Demo-ready | Visible physical dice is source of truth.          |
| Result board           | Demo-ready | Follows visible dice result.                       |
| Settlement display     | Demo-ready | Shows UX concept only, not real wallet credit.     |
| No-bet round           | Demo-ready | Safe to show.                                      |
| Next round reset       | Demo-ready | Safe to show.                                      |
| Muted room direction   | Demo-ready | Audio intentionally skipped for now.               |

---

### 5.5.2 Mock / Not Production Yet

These areas must not be described as production-ready.

| Area                        | Status         | Warning                                                   |
| --------------------------- | -------------- | --------------------------------------------------------- |
| Wallet balance              | Mock           | Not connected to real wallet ledger yet.                  |
| Deposit                     | Mock / planned | No real deposit processing yet.                           |
| Withdrawal                  | Mock / planned | No real withdrawal processing yet.                        |
| Wallet debit                | Not connected  | Bets do not debit real balance yet.                       |
| Wallet credit               | Not connected  | Settlements do not credit real balance yet.               |
| Backend round state         | Not connected  | Round is not controlled by backend yet.                   |
| Realtime sync               | Not connected  | Multiple users are not synced to same backend room yet.   |
| Real bet records            | Not connected  | Internal/admin bet audit records are not implemented yet. |
| Admin monitoring            | Planning only  | No real monitoring dashboard yet.                         |
| Security/fairness logs      | Planning only  | Not implemented yet.                                      |
| Production result authority | Not connected  | Current demo uses visible frontend physics result only.   |

---

### 5.5.3 Demo Explanation Summary

For demo presentation, explain the current state like this:

> The Six Animal room is currently a stable frontend demo.
> The player experience, mobile layout, betting flow, 3D dice simulation, result display, and settlement UX are ready to show.
> Real wallet, backend round control, realtime room sync, admin monitoring, and production settlement are planned next and are not connected yet.

This keeps the demo honest and protects trust.

---

### 5.5.4 Chapter 38.2 Acceptance Checklist

Chapter 38.2 passes when:

* demo-ready features are clearly listed
* mock features are clearly listed
* wallet warning is clear
* backend warning is clear
* settlement warning is clear
* admin monitoring warning is clear
* `/six-animal` production code was not changed
* build passes

---

## 6. Demo Communication Rule

When showing the demo, explain it like this:

> This is the stable frontend demo of the Nagani Traditional Six Animal 3D room.
> The visual room flow, betting UX, dice simulation, result display, settlement UX, and mobile layout are ready for presentation.
> Wallet, backend round control, real settlement, realtime sync, and admin monitoring are planned but not connected yet.

Do not say the wallet/backend is production-ready.

Do not show mock balance as real money behavior.

Do not promise real deposits or withdrawals until backend integration is complete.

---

## 6.5 Demo Presentation Notes / Client-Safe Explanation

This section defines how to present the current Nagani Traditional demo clearly and honestly.

The goal is to show the strength of the Six Animal room without accidentally presenting mock wallet/backend behavior as production-ready.

---

### 6.5.1 Short Demo Introduction

Use this explanation before starting the demo:

> This is the current stable frontend demo of Nagani Traditional’s Six Animal 3D room.
> The game-room experience, mobile layout, betting flow, visible dice simulation, result board, and settlement display are ready to present as a demo.
> Real wallet, backend round control, realtime sync, admin monitoring, and production settlement are not connected yet.

---

### 6.5.2 What To Emphasize During Demo

When showing the Six Animal room, emphasize:

* this is a premium Myanmar traditional game/simulation direction
* this is not a slot/reel/casino clone
* the room is mobile-first
* the player sees physical 3D dice roll before result
* the result board follows the visible dice
* settlement display follows the visible result
* the room is intentionally muted for now
* backend/wallet work is planned separately after demo lock

---

### 6.5.3 What Not To Say During Demo

Do not say:

* “The wallet is already real.”
* “Deposit and withdrawal already work.”
* “The backend is already controlling the room.”
* “Multiple users are already synced in realtime.”
* “Admin can already monitor every bet.”
* “This is ready for real-money production.”
* “The dice result is backend-forced.”

These statements are not true yet and can create trust problems.

---

### 6.5.4 Safer Words To Use

Use these safer phrases:

| Instead of saying     | Say this                               |
| --------------------- | -------------------------------------- |
| Real wallet           | Wallet UX demo                         |
| Real betting          | Betting flow demo                      |
| Real payout           | Settlement UX demo                     |
| Production backend    | Planned backend integration            |
| Live multiplayer room | Future realtime room sync              |
| Final assets          | Current demo/prototype assets          |
| Ready for launch      | Ready for frontend demo / presentation |

---

### 6.5.5 Suggested Demo Flow

Present the demo in this order:

1. Open the lobby.
2. Enter the Six Animal room.
3. Explain the room is mobile-first.
4. Select an animal.
5. Select or enter bet amount.
6. Place bet.
7. Show bet lock behavior.
8. Wait for Bets Closed.
9. Let the 3D dice roll visibly.
10. Point out result board progress.
11. Show final result.
12. Show settlement display.
13. Wait for next round reset.
14. Explain what is mock and what comes next.

---

### 6.5.6 Trust Explanation

Use this explanation if someone asks about fairness or result trust:

> In this demo, the visible 3D dice result is treated as the source of truth.
> The result board and settlement follow what the player sees from the dice.
> Production backend authority, wallet settlement, audit logs, and security rules are planned as the next backend stage.

This keeps the answer honest without overpromising.

---

### 6.5.7 Backend Explanation

Use this explanation if someone asks whether the backend is finished:

> The backend is not connected yet.
> This demo focuses on the player-facing room experience first.
> The next backend stage will connect round state, bet submission, wallet debit, settlement, realtime sync, admin monitoring, and audit records.

---

### 6.5.8 Wallet Explanation

Use this explanation if someone asks whether balance, deposit, or withdrawal are real:

> The current wallet display is demo/mock only.
> It shows the intended user experience, but real wallet ledger, deposit, withdrawal, debit, credit, and settlement protection still need backend implementation.

---

### 6.5.9 Chapter 38.3 Acceptance Checklist

Chapter 38.3 passes when:

* demo introduction text is written
* safe explanation text is written
* unsafe claims are listed
* wallet/backend mock warning is clear
* suggested demo flow is written
* trust explanation is written
* `/six-animal` production code was not changed
* build passes

---

## 7. Deploy Preparation Checklist

Before demo deploy, confirm:

* `npm run build` passes
* `/` loads correctly
* `/six-animal` loads correctly
* `/thirty-six` loads correctly
* `/cashier` loads correctly
* `/history` loads correctly
* `/live` loads correctly
* `/profile` loads correctly
* no dev-only UI appears in `/six-animal`
* no old sample Six Animal table appears
* no Gourd symbol appears
* Six Animal symbols remain Tiger, Dragon, Rooster, Fish, Crab, Elephant
* muted room direction remains clear
* mobile portrait layout remains usable
* result/settlement layer does not block dice visibility during rolling
* next round reset works after result phase

---

## 7.5 Deploy Checklist / Route QA Lock

This section defines the minimum route checks before any demo deploy.

The goal is not to redesign pages.

The goal is to confirm that the current frontend demo can be opened safely without broken routes, obvious layout issues, or confusing production claims.

---

### 7.5.1 Required Build Check

Before deploy, always run:

```bash
npm run build
```

Deploy is not allowed if the build fails.

---

### 7.5.2 Required Route Check

Before deploy, manually open these routes:

| Route         | Required Result                     |
| ------------- | ----------------------------------- |
| `/`           | Lobby loads without crash.          |
| `/six-animal` | Stable Six Animal 3D room loads.    |
| `/thirty-six` | Thirty Six page loads.              |
| `/cashier`    | Cashier page loads as mock/demo UX. |
| `/history`    | History page loads as mock/demo UX. |
| `/live`       | Live page loads as mock/demo UX.    |
| `/profile`    | Profile page loads as mock/demo UX. |

---

### 7.5.3 Six Animal Deploy QA

On `/six-animal`, confirm:

* room intro appears
* betting phase starts at 20 seconds
* animal board appears
* animal selection works
* amount selection works
* Place Bet button works
* bet locks after placing
* Bets Closed phase appears for 3 seconds
* 3D dice table stays visible
* physical dice roll visibly
* result board updates from visible dice
* final result appears
* settlement appears only when a bet was placed
* next round reset works
* no old sample table appears
* no dev/lab UI appears
* no Gourd symbol appears
* no sound/audio button appears
* no backend-forced result UI appears

---

### 7.5.4 Thirty Six Deploy QA

On `/thirty-six`, confirm:

* page loads without crash
* 36-number grid is readable
* number selection works
* amount input works
* ticket confirmation UI works
* page does not claim real backend settlement
* page does not visually break on mobile portrait

Thirty Six is not yet at Six Animal polish level.

It is acceptable for demo as a secondary game preview, not as the final polished room.

---

### 7.5.5 Cashier / Wallet Deploy QA

On `/cashier`, confirm:

* page loads without crash
* deposit UI does not claim real processing
* withdrawal UI does not claim real processing
* mock/demo nature is clear enough
* no real payment instruction is shown unless backend/payment is ready

Current cashier is demo/mock only.

Do not present it as real deposit or withdrawal.

---

### 7.5.6 History Deploy QA

On `/history`, confirm:

* page loads without crash
* history is understood as demo/mock data
* wallet history direction remains acceptable
* no separate player betting-round history is required for Six Animal

Player-facing history should focus on wallet history later.

Internal bet records belong to admin/audit backend, not player history.

---

### 7.5.7 Live Page Deploy QA

On `/live`, confirm:

* page loads without crash
* live content is understood as demo/mock
* it does not claim real backend realtime sync yet
* Six Animal and Thirty Six previews remain understandable

---

### 7.5.8 Profile Deploy QA

On `/profile`, confirm:

* page loads without crash
* user account details are demo/mock
* no real KYC/security claim is made
* no production wallet/security feature is implied

---

### 7.5.9 Deploy Blockers

Do not deploy the demo if any of these happen:

* `npm run build` fails
* `/six-animal` crashes
* physical dice result does not reach final result
* settlement appears before dice result
* old sample table appears
* dev/lab UI appears in player room
* Gourd appears anywhere in Six Animal
* page claims real wallet/backend production behavior
* mobile portrait layout is unusable

---

### 7.5.10 Chapter 38.4 Acceptance Checklist

Chapter 38.4 passes when:

* deploy route checklist is written
* Six Animal deploy QA is written
* Thirty Six deploy QA is written
* Cashier/wallet warning is written
* History/wallet-history direction is written
* deploy blockers are written
* `/six-animal` production code was not changed
* build passes


## 8. Demo Safety Checklist

During demo QA, test at least:

### Full Bet Round

* enter room
* select animal
* select amount
* place bet
* wait for Bets Closed
* watch all 3 dice roll
* confirm result board updates
* confirm settlement appears
* confirm next round resets

### No-Bet Round

* enter room
* do not place bet
* wait for rolling
* confirm result still appears
* confirm no settlement card appears
* confirm next round resets

### Trust Check

Confirm:

* result board matches visible dice
* settlement matches result board
* no backend target/correction UI appears
* no suspicious final dice turn occurs after stop
* no old prototype table appears

---

## 9. What Must Not Change During Chapter 38

Do not change:

* dice physics behavior
* dice result source rule
* target correction lock
* Six Animal symbol set
* betting round rhythm
* settlement layer behavior
* muted/no-audio direction
* core `/six-animal` layout
* accepted mobile portrait flow

Chapter 38 is for demo/deploy preparation only.

---

## 9.5 Demo Lock / Pre-Deploy Freeze Rule

This section locks the current demo state before any deploy or client presentation.

The goal is to prevent accidental changes to the stable Six Animal room after Chapter 37 QA and Chapter 38 demo/deploy preparation.

---

### 9.5.1 Freeze Rule

Before demo deploy, the current `/six-animal` room is frozen.

Do not change the stable Six Animal room unless there is a confirmed demo-blocking bug.

Frozen areas include:

* dice physics behavior
* dice result detection behavior
* dice result source-of-truth rule
* table camera and player POV
* betting phase timing
* Bets Closed timing
* result reveal timing
* settlement display behavior
* betting sheet layout
* result board layout
* muted room direction
* Six Animal symbol set
* mobile portrait room layout

---

### 9.5.2 Allowed Changes During Freeze

Only these changes are allowed during the pre-deploy freeze:

* documentation updates
* demo explanation text
* deploy checklist updates
* small typo fixes
* non-risky copy clarification
* confirmed crash fix
* confirmed route-loading fix
* confirmed mobile layout blocker fix

Any code change during freeze must be small, clear, and tested immediately.

---

### 9.5.3 Not Allowed During Freeze

Do not start these during the pre-deploy freeze:

* new dice physics tuning
* new camera tuning
* new result behavior
* new betting rules
* new settlement formula
* new wallet logic
* new backend integration
* new realtime sync
* new admin monitoring
* new production asset replacement
* new audio/sound implementation
* Thirty Six redesign
* large layout redesign

These belong to future chapters after Chapter 38 is locked.

---

### 9.5.4 Pre-Deploy Demo Rule

Before deploy, the demo must still match the Chapter 37 accepted baseline.

Required:

* Six Animal loads cleanly
* betting flow works
* no-bet flow works
* dice roll visibly
* result board follows visible dice
* settlement follows result
* next round resets
* mock wallet/backend status is clear
* no dev/lab UI appears
* no old sample table appears
* no Gourd symbol appears
* build passes

---

### 9.5.5 Rollback Rule

If a code change breaks the accepted demo baseline, rollback immediately.

Do not continue layering new fixes on top of a broken demo.

The stable demo is more important than adding new features during Chapter 38.

---

### 9.5.6 Chapter 38.5 Acceptance Checklist

Chapter 38.5 passes when:

* pre-deploy freeze rule is written
* allowed changes are clearly listed
* not-allowed changes are clearly listed
* rollback rule is written
* `/six-animal` production code was not changed
* build passes

---

## 10. Possible Next Branches After Chapter 38

After demo/deploy preparation is locked, the next branch can be chosen safely.

Possible next chapters:

### Chapter 39 — Thirty Six Parity Polish

Improve `/thirty-six` so it feels closer to the premium Six Animal direction.

### Chapter 40 — Backend Bridge Implementation Start

Begin real backend integration carefully from the locked backend/trust/wallet plan.

### Chapter 41 — Production Asset Creation

Create or replace production-quality dice, table, room, and animal board assets.

The current recommendation is:

1. finish Chapter 38 demo/deploy prep,
2. deploy or prepare demo safely,
3. then choose between Thirty Six parity, backend bridge, or production asset creation.

---

## 11. Chapter 38 Acceptance Checklist

Chapter 38 can be marked complete when:

* this document exists
* demo-ready areas are clearly listed
* mock/prototype areas are clearly listed
* wallet/backend warning is clear
* deploy checklist is written
* stable `/six-animal` protection rule is written
* `npm run build` passes
* no production code was changed unnecessarily

---

## 12. Current Decision Lock

Nagani Traditional is currently safe to present as a frontend/mobile demo.

The stable Six Animal room should not be disturbed before demo/deploy preparation is complete.

The next risky work must be planned as a separate chapter.

---

## 13. Chapter 38 Final Lock / Demo Deploy Prep Closeout

Chapter 38 is complete enough.

The demo/deploy preparation plan now clearly defines:

* what is demo-ready
* what is still mock/prototype
* what must not be presented as production backend
* how to explain the demo safely
* which routes must be checked before deploy
* what blocks demo deploy
* what must not change before demo
* how to protect the stable `/six-animal` room during pre-deploy freeze

---

### 13.1 Completed Chapter 38 Items

Completed:

* Chapter 38.1 — Demo / Deploy Prep Plan created
* Chapter 38.2 — Demo-Ready vs Mock Feature Checklist
* Chapter 38.3 — Demo Presentation Notes / Client-Safe Explanation
* Chapter 38.4 — Deploy Checklist / Route QA Lock
* Chapter 38.5 — Demo Lock / Pre-Deploy Freeze Rule
* Chapter 38.6 — Final Lock / Closeout

---

### 13.2 Current Demo Position

Nagani Traditional is currently safe to present as a frontend/mobile demo.

The strongest demo area is:

* ၆ ကောင်ဂျင် / ဂလုန်းဂလုန်း Six Animal 3D room

The demo is safe to describe as:

* frontend demo
* mobile-first player experience
* visual dice simulation demo
* betting UX demo
* result display demo
* settlement UX demo

The demo must not be described as:

* production backend ready
* real wallet ready
* real deposit/withdrawal ready
* realtime multiplayer room ready
* real admin monitoring ready
* real settlement authority ready

---

### 13.3 Protected Stable Demo Baseline

The `/six-animal` room remains protected.

Do not change it unless fixing a confirmed demo-blocking bug.

The protected baseline includes:

* mobile-first 3D room
* visible physical dice source of truth
* no backend forced result
* no production target correction
* no old sample table
* no dev/lab UI
* muted room direction
* accepted betting sheet
* accepted Bets Closed phase
* accepted physical 3D dice rolling
* accepted rolling/result board
* accepted settlement layer
* accepted room atmosphere
* accepted next-round reset

---

### 13.4 Final Chapter 38 Acceptance Checklist

Chapter 38 is accepted when:

* demo/deploy prep document exists
* demo-ready areas are clearly listed
* mock/prototype areas are clearly listed
* wallet/backend warnings are clear
* demo-safe explanation is written
* route QA checklist is written
* deploy blockers are written
* pre-deploy freeze rule is written
* stable `/six-animal` protection rule is written
* `npm run build` passes
* no unnecessary production code was changed

---

### 13.5 Next Roadmap Decision

After Chapter 38, the next major branch should be chosen carefully.

Possible next branches:

1. Chapter 39 — Thirty Six Parity Polish
2. Chapter 40 — Backend Bridge Implementation Start
3. Chapter 41 — Production Asset Creation

Recommended order:

1. finish Chapter 38 lock
2. prepare or deploy the safe frontend demo
3. then choose the next branch based on priority

Current recommendation:

Move to **Chapter 39 — Thirty Six Parity Polish** only if the goal is to improve the second game before demo.

Move to **Chapter 40 — Backend Bridge Implementation Start** only if the goal is to start real production connection.

Move to **Chapter 41 — Production Asset Creation** only if the goal is visual production quality upgrade.

Until that decision is made, keep `/six-animal` stable.

---

## 14. Chapter 55.1 — Post Table/Dice Lock Demo Status Update

Status: Passed

Purpose:

Chapter 55.1 updates the demo/deploy plan after the Six Animal table + dice production polishing branch.

The previous demo/deploy lock was based on the earlier Chapter 37 / Chapter 38 baseline.

Since then, Six Animal received a major table and dice polish branch and passed final QA again.

---

### 14.1 New Current Demo Baseline

The current accepted Six Animal demo baseline is now:

- improved procedural 3D table
- future table direction locked as Hybrid custom GLB later
- production dice candidate locked as More Round + Softer
- smoother deep red felt / velvet tray floor
- dark lacquer / antique brass table direction
- restrained Kanote ornament first pass
- palace room background active
- mounted dice rack continuity fixed
- betting flow stable
- no-bet flow stable
- result board stable
- settlement layer stable
- mobile portrait view accepted
- visible physical dice remains source of truth
- project remains muted

---

### 14.2 Important Production Dice Lock

Current active production dice candidate:

```ts
const PRODUCTION_DICE_SHAPE_PRESET: DiceShapePreset = "more-round";
const PRODUCTION_DICE_COLLIDER_PRESET: DiceColliderPreset = "softer";


---

## 15. Chapter 55.2 — Updated Deploy Route QA After Table/Dice Lock

Status: Passed

Purpose:

Chapter 55.2 updates the deploy route QA checklist after the Six Animal table + dice production polish lock.

The previous route QA checklist is still valid, but `/six-animal` now has extra table/dice-specific checks that must be verified before any demo deploy.

---

### 15.1 Required Build Check

Before demo deploy, run:

```bash
npm run build

---

## 16. Chapter 55.3 — Updated Demo Presentation Script After Table/Dice Lock

Status: Passed

Purpose:

Chapter 55.3 updates the demo presentation script after the Six Animal table + dice polish lock.

The goal is to help present the current demo clearly, honestly, and confidently without overpromising backend, wallet, realtime, or production settlement features.

---

### 16.1 Opening Demo Script

Use this opening explanation:

> This is the current stable frontend demo of Nagani Traditional’s Six Animal 3D room.
> The demo focuses on the player-facing experience: mobile room layout, betting flow, improved 3D table, visible dice simulation, result board, and settlement UX.
> The table and dice have been polished with a more realistic rolling feel, smoother tray floor, Myanmar-inspired Kanote detail, and fixed mounted dice rack continuity.
> Real wallet, backend round control, realtime room sync, admin monitoring, and production settlement are planned next and are not connected yet.

---

### 16.2 What To Show First

Start with:

1. Open the lobby.
2. Enter `/six-animal`.
3. Let the room intro appear.
4. Point out the palace background.
5. Point out the 3D table and mounted dice.
6. Explain that the project is muted intentionally for now.
7. Explain that this is a frontend/mobile demo.

---

### 16.3 Six Animal Room Talking Points

During the Six Animal demo, say:

> This room is designed to feel like a premium Myanmar traditional Six Animal game room, not a slot/reel game.
> The player sees the table, mounted dice, betting sheet, dice roll, result board, and settlement flow in one mobile-first room.

Mention:

- improved procedural 3D table
- future hybrid custom GLB table direction
- More Round + Softer dice candidate
- visible physical dice source of truth
- smoother deep red tray floor
- restrained Kanote ornament
- fixed mounted dice rack behavior
- muted room direction

---

### 16.4 Betting Flow Script

When showing betting:

> The player selects one animal, chooses an amount, and locks the bet before the timer ends.
> This is the intended betting UX.
> In the current demo, the wallet and bet submission are not connected to backend yet.

Show:

1. Select animal.
2. Select amount.
3. Press Place Bet.
4. Show locked bet state.
5. Wait for Bets Closed.

---

### 16.5 Dice Roll Script

When dice start rolling, say:

> The result comes from the visible 3D dice simulation.
> The mounted dice disappear one by one as each die drops.
> After the third die drops, the holder stays empty until the next round, which makes the table feel more physical.

Emphasize:

- dice roll visibly before result finalizes
- result board follows visible dice
- no backend-forced result in current frontend demo
- no visible correction/debug UI in production room

---

### 16.6 Result / Settlement Script

When result appears, say:

> The result board shows the visible dice result.
> The settlement display shows the intended UX for win or no-match.
> In production, this settlement will need backend wallet debit, credit, audit records, and protection against duplicate settlement.

Do not say:

- wallet is real
- payout is real
- backend already settles
- this is ready for real-money launch

---

### 16.7 No-Bet Round Script

For no-bet round, say:

> The room still runs continuously even if the player does not place a bet.
> The dice roll and result display continue, but no fake settlement is shown.

This shows the room rhythm is stable.

---

### 16.8 Trust Explanation

Use this if someone asks about fairness or trust:

> In this frontend demo, the visible physical dice result is treated as the source of truth.
> The result board follows the dice the player sees.
> Production backend authority, wallet settlement, audit records, and security/fairness monitoring are planned as the next backend stage.

---

### 16.9 Backend Explanation

Use this if someone asks whether backend is connected:

> Backend is not connected yet.
> This demo focuses on proving the player room experience first.
> The next backend stage will connect round state, bet submission, wallet debit, wallet credit, settlement authority, realtime sync, admin monitoring, and audit records.

---

### 16.10 Wallet Explanation

Use this if someone asks about balance, deposit, or withdrawal:

> The current wallet and balance are demo/mock only.
> They show the intended UX direction.
> Real deposit, withdrawal, wallet ledger, bet debit, settlement credit, and transaction protection still need backend implementation.

---

### 16.11 What Not To Promise

Do not say:

- real wallet is ready
- real deposit works
- real withdrawal works
- backend controls the room
- realtime multiplayer sync is finished
- admin monitoring is finished
- settlement is production-ready
- final assets are finished
- sound/audio is finished
- custom GLB table is already integrated

---

### 16.12 Safe Closing Statement

End the demo with:

> The current Six Animal room is stable as a frontend/mobile demo.
> The table and dice polish are now locked enough to protect.
> The next major production step should be chosen carefully: demo deploy, backend bridge, custom asset production, or Thirty Six polish.

---

### 16.13 Chapter 55.3 Acceptance Checklist

Chapter 55.3 is complete when:

- updated demo opening script is written
- betting flow script is written
- dice roll script is written
- result/settlement script is written
- no-bet explanation is written
- trust explanation is written
- backend explanation is written
- wallet explanation is written
- unsafe promises are listed
- no production code changed
- `npm run build` passes

---

## 17. Chapter 55.4 — Demo / Deploy Prep Final Lock After Table/Dice Polish

Status: Passed

Purpose:

Chapter 55.4 closes the demo/deploy preparation update after the Six Animal table + dice production polish lock.

This chapter confirms that the current demo/deploy plan now reflects the latest accepted Six Animal frontend prototype state.

---

### 17.1 Current Demo Lock

The current accepted demo state is:

- Six Animal 3D room is stable enough for frontend demo
- improved procedural 3D table is active
- future table direction is Hybrid custom GLB later
- production dice candidate is More Round + Softer
- mounted dice rack continuity is fixed
- tray floor feels smoother and less plastic
- Kanote ornament first pass is accepted
- palace background remains active
- game remains muted
- visible physical dice remains source of truth
- full bet round QA passed
- no-bet round QA passed
- visual QA passed
- camera/trust QA passed

---

### 17.2 Current Demo Explanation Lock

Use this explanation for demo:

> This is the current stable frontend demo of Nagani Traditional’s Six Animal 3D room.
> The mobile room experience, betting flow, improved 3D table, visible dice simulation, result board, and settlement UX are ready to present.
> Real wallet, backend round control, realtime sync, admin monitoring, and production settlement are planned next and are not connected yet.

---

### 17.3 Protected `/six-animal` Areas

Do not change unless fixing a confirmed blocker:

- dice physics
- dice collider
- More Round + Softer production dice candidate
- mounted dice rack behavior
- result detection
- result source-of-truth rule
- table layout
- betting flow
- Bets Closed timing
- result reveal timing
- settlement flow
- mobile camera behavior
- muted project direction
- Six Animal symbol set

Locked Six Animal symbols:

- Tiger
- Dragon
- Rooster
- Fish
- Crab
- Elephant

Do not bring back Gourd / ဘူး.

---

### 17.4 What Must Still Be Explained As Mock

The following are not production-ready yet:

- real wallet debit
- real wallet credit
- real deposit
- real withdrawal
- backend round authority
- backend timer sync
- realtime multi-user room
- backend settlement authority
- internal/admin bet audit records
- admin monitoring
- production fairness/security logs

The current demo is still a frontend/mobile room demo.

---

### 17.5 Deploy Blockers

Do not deploy or present if:

- `npm run build` fails
- `/six-animal` crashes
- dice result does not reach final result
- mounted dice rack refills during result phase
- result board does not match visible dice
- settlement appears before dice result
- dev/debug/correction UI appears
- old sample table appears
- Gourd / ဘူး appears
- mobile portrait layout is unusable
- page claims real wallet/backend production behavior

---

### 17.6 Chapter 55 Completed Items

Completed:

- Chapter 55.1 — Post Table/Dice Lock Demo Status Update
- Chapter 55.2 — Updated Deploy Route QA After Table/Dice Lock
- Chapter 55.3 — Updated Demo Presentation Script After Table/Dice Lock
- Chapter 55.4 — Demo / Deploy Prep Final Lock After Table/Dice Polish

---

### 17.7 Next Roadmap Choices

After this lock, choose one major branch:

1. Demo / deploy execution

   Best if you want to show the current frontend demo.

2. Backend bridge implementation

   Best if you want real round state, wallet debit/credit, settlement, realtime sync, and admin monitoring.

3. Custom asset production

   Best if you want final GLB table / final dice asset work.

4. Thirty Six polish

   Best if you want the second game closer to Six Animal quality.

Recommended next:

Protect the current `/six-animal` frontend demo first, then decide whether the next major branch is backend or custom assets.

---

### 17.8 Chapter 55.4 Acceptance Checklist

Chapter 55.4 is complete when:

- current demo lock is documented
- demo explanation is updated
- protected `/six-animal` areas are listed
- mock/backend warnings remain clear
- deploy blockers are updated
- Chapter 55 completed items are listed
- next roadmap choices are listed
- no production code changed
- `npm run build` passes