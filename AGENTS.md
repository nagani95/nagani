---

## Latest Locked Six Animal State

Current protected route:

* `/six-animal`

Current accepted frontend state:

* Stable frontend/mobile demo
* Improved procedural 3D table
* Future table direction: Hybrid custom GLB visible table + invisible colliders
* Production dice candidate: More Round + Softer
* Mounted dice rack continuity fixed
* Smooth deep red felt / velvet tray floor
* Dark lacquer / antique brass table direction
* Restrained Kanote ornament first pass
* Palace room background active
* Game intentionally muted for now
* Visible physical dice remains source of truth
* Backend/wallet not connected yet

Production dice lock:

```ts
const PRODUCTION_DICE_SHAPE_PRESET: DiceShapePreset = "more-round";
const PRODUCTION_DICE_COLLIDER_PRESET: DiceColliderPreset = "softer";
```

Mounted dice rack lock:

* Betting phase: 3 mounted dice visible
* Bets Closed phase: 3 mounted dice visible
* Rolling phase: mounted dice disappear one by one
* After third die: rack stays empty
* Result phase: rack stays empty
* Next betting round: 3 mounted dice refill

Locked Six Animal symbols:

* Tiger
* Dragon
* Rooster
* Fish
* Crab
* Elephant

Do not bring back Gourd / ဘူး.

---

## Protected Six Animal Files

Do not modify these files unless fixing a confirmed blocker or working inside a planned chapter with rollback path:

* `src/app/six-animal/page.tsx`
* `src/components/games/six-animal/ThreeDiceSequenceController.tsx`
* `src/components/games/six-animal/ThreeDicePhysicsStage.tsx`
* `src/components/games/six-animal/SixAnimalBettingSheet.tsx`
* `src/lib/threeDiceResultAdapter.ts`
* `src/types/sixAnimalRoom.ts`

Avoid random polishing now.

Do not change:

* dice physics
* dice collider
* dice result detection
* mounted dice rack behavior
* result source-of-truth rule
* betting flow
* settlement flow
* camera behavior
* muted room direction

---

## Current Development Direction

Frontend Six Animal polishing is paused and protected.

Next major branch:

## Chapter 56 — Supabase Connection Foundation

Backend roadmap:

1. Supabase connection foundation
2. Core database schema
3. Wallet ledger foundation
4. Backend round state
5. Bet submission RPC
6. Settlement RPC
7. Realtime room sync
8. Admin monitoring
9. Security / RLS / RPC lock
10. Frontend backend bridge

Backend must not redesign the stable Six Animal room.

Backend should connect carefully to the existing frontend flow.

---

## Backend Trust Rules

The current frontend demo uses visible physical dice as the result source.

Backend integration must preserve trust:

* result board must match visible dice
* settlement must match result board
* no hidden correction
* no after-stop dice snapping
* no backend mismatch shown to player
* no suspicious override
* no dev/debug/correction UI in production

If backend later becomes official result authority, it must be planned clearly with fairness, audit, and trust rules.

---

## Mock / Not Production Yet

These are still not production-ready:

* real wallet debit
* real wallet credit
* real deposit
* real withdrawal
* backend round authority
* backend timer sync
* realtime multi-user room
* backend settlement authority
* internal/admin bet audit records
* admin monitoring
* production fairness/security logs

Current demo should be described as:

* frontend/mobile room demo
* betting UX demo
* visible dice simulation demo
* settlement UX demo

Do not present it as real-money production yet.

---

## Current Important Docs

Keep these docs as source of truth:

* `docs/NAGANI_SIX_ANIMAL_TABLE_DICE_PRODUCTION_ROADMAP.md`
* `docs/NAGANI_DEMO_DEPLOY_PREP_PLAN.md`
* `docs/NAGANI_BACKEND_TRUST_WALLET_PLAN.md`

---

## AI Agent Response Style For This Project

When giving development instructions:

* show exact file path
* show exact block to find
* show exact replacement
* avoid vague instructions
* avoid random redesign
* protect passed QA work
* run `npm run build` after changes
* document passed chapters in the correct roadmap doc
