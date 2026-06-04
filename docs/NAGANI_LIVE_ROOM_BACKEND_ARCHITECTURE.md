# Nagani Traditional — Live Room Backend Architecture Plan

## Purpose

This document defines the future backend structure for Nagani Traditional live rooms, especially the ၆ ကောင်ဂျင် / ဂလုန်းဂလုန်း simulation room.

Nagani is not a cheap slot/casino clone. It is a premium Myanmar traditional game simulation platform. The backend must support trust, realism, shared live-room timing, result history, and future production scalability.

---

## Main Goal

All players should see the same live room state at the same time.

Example:

```txt
Betting Open → Bets Closed → Dice Rolling → Result → Next Round
```

The frontend should not create its own independent random result for each player.

Correct production flow:

```txt
Backend creates official round.
Backend controls phase timing.
Backend creates official result.
Frontend animates dice to match backend result.
Backend saves result/history.
```

---

## Supported Games

Initial focus:

1. ၆ ကောင်ဂျင် / ဂလုန်းဂလုန်း
2. ၃၆ ကောင်ထီ

This document focuses first on ၆ ကောင်ဂျင် because the 3D dice room is the current active product foundation.

---

## Locked Six Animal Symbols

1. Tiger / ကျား
2. Dragon / နဂါး
3. Rooster / ကြက်
4. Fish / ငါး
5. Crab / ဂဏန်း
6. Elephant / ဆင်

Do not use Gourd / ဘူး.

---

## Six Animal Round Phases

Current frontend phase rhythm:

```txt
Betting: 20 seconds
Bets Closed: 1 second
Rolling: controlled by 3D dice sequence completion
Result: 6 seconds
```

Future backend should support these phases:

```ts
type RoundPhase = "betting" | "closed" | "rolling" | "result";
```

---

## Round State Shape

Recommended backend round object:

```ts
type SixAnimalRound = {
  id: string; // official database id / uuid
  roomId: string; // permanent room id
  roundNumber: number; // display/order number only

  phase: "betting" | "closed" | "rolling" | "result";

  bettingStartsAt: string;
  bettingEndsAt: string;
  rollingStartsAt: string | null;
  resultRevealedAt: string | null;
  nextRoundStartsAt: string | null;

  resultAnimals: DiceAnimalLabel[] | null;

  status: "scheduled" | "active" | "settled" | "cancelled";

  createdAt: string;
  updatedAt: string;
};
```

Result example:

```ts
resultAnimals: ["Crab", "Dragon", "Fish"];
```

Production rule:

```txt
Use `id` / `roundId` for backend identity.
Use `roundNumber` only for display, sorting, and human-readable history.
```

## Frontend Result Target

Frontend dice animation should eventually receive a target result from backend:

```ts
type DiceAnimationTarget = {
  roundId: string;
  roomId: string;
  roundNumber: number;
  resultAnimals: DiceAnimalLabel[];
  source: "backend" | "demo";
};
```

Example:

```ts
const target = {
  roundId: "uuid-from-database",
  roomId: "six-animal-main-room",
  roundNumber: 1208,
  resultAnimals: ["Crab", "Dragon", "Fish"],
  source: "backend",
};
```

Frontend responsibility:

```txt
Animate dice rolling.
Reveal the backend-provided animals.
Show result board.
Show settlement/result summary.
```

Frontend should not be the official source of result.

## Backend Source of Truth

Backend must be source of truth for:

```txt
round phase
countdown timing
official result
history records
settlement records
admin monitoring
```

Frontend can show animation, but backend result is final.

---

## Demo Mode vs Production Mode

### Demo Mode

Allowed for development, testing, screenshots, and presentation:

```txt
Developer can force result.
Example: force ["Tiger", "Tiger", "Crab"].
```

Demo mode must be clearly separated from production.

### Production Mode

Production should not allow hidden manual result manipulation.

Correct rule:

```txt
Admin can monitor rounds.
Admin cannot secretly change result after betting closes.
```

Production result should come from fair locked generation logic.

---

## Suggested Database Tables

### rooms

```ts
type Room = {
  id: string;
  gameType: "six_animal" | "thirty_six";
  name: string;
  status: "active" | "paused" | "maintenance";
  createdAt: string;
  updatedAt: string;
};
```

### six_animal_rounds

Stores each round state and result.

```ts
type SixAnimalRoundRecord = {
  id: string;
  roomId: string;
  roundNumber: number;
  phase: string;
  resultAnimals: string[] | null;
  bettingStartsAt: string;
  bettingEndsAt: string;
  resultRevealedAt: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
};
```

### six_animal_bets

If betting/points/wallet is enabled later:

```ts
type SixAnimalBetRecord = {
  id: string;
  roundId: string;
  userId: string;
  selectedAnimal: DiceAnimalLabel;
  amount: number;
  status: "pending" | "won" | "lost" | "cancelled";
  matchCount: number | null;
  payout: number | null;
  net: number | null;
  createdAt: string;
  settledAt: string | null;
};
```

### result_history

General result feed for live/history pages.

```ts
type ResultHistoryRecord = {
  id: string;
  gameType: "six_animal" | "thirty_six";
  roundId: string;
  resultLabel: string;
  resultPayload: unknown;
  createdAt: string;
};
```

---

## Realtime Requirements

Frontend should subscribe to:

```txt
current room state
current round phase
countdown timestamps
official result payload
recent result history
```

Supabase Realtime or websocket can be used later.

Frontend should calculate countdown from backend timestamps, not local fake timer only.

---

## Admin Requirements

Admin should be able to:

```txt
view current room
view current phase
view round history
pause room
resume room
set maintenance mode
see recent results
see bet totals if betting is enabled
```

Admin should not secretly override production results after betting closes.

Demo/testing force-result controls must be separated from production.

---

## Fairness / Trust Direction

Nagani should feel trusted and serious.

Important rules:

```txt
Round result is locked by backend.
Frontend only displays animation.
History is saved.
Demo mode is separate.
Production result cannot be edited secretly.
```

Future fairness options:

```txt
server-side RNG
seeded result generation
commit-reveal style proof
admin audit log
round hash
```

These can be planned later if needed.

---

## Current Frontend Relationship

Current active files:

```txt
src/app/six-animal/page.tsx
src/components/games/six-animal/ThreeDicePhysicsStage.tsx
src/components/games/six-animal/ThreeDiceSequenceController.tsx
src/components/games/six-animal/SixAnimalBettingSheet.tsx
src/lib/threeDiceResultAdapter.ts
```

Current frontend is still mock/local state.

Future backend integration should replace local mock timing/result gradually, not rewrite the whole room.

---

## Recommended Integration Order

1. Keep current frontend room working.
2. Add mock backend-shaped round object locally.
3. Make frontend consume `currentRound` object instead of scattered local phase state.
4. Add target result support for dice animation.
5. Connect real backend current round.
6. Connect result history.
7. Connect user bet records if needed.
8. Add admin room monitor.
9. Add fairness/audit layer.

---

## Current Status

Chapter 28 completed enough:

```txt
3D dice visual upgraded
animal face textures working
dice constants locked
production dice model plan documented
```

Next chapter:

```txt
Chapter 29 — backend architecture planning
```

This document is the first step before backend implementation.

## Room vs Round Model

A live room is permanent. A round is temporary.

```txt
Room = long-lived live table
Round = one short betting / rolling / result cycle
```

Example:

```txt
roomId: six-animal-main-room
current round: #1208
next round: #1209
next round: #1210
```

Rounds are expected to continue forever while the room is active. This is normal and should not be treated as manual work.

Backend should only keep one current active round per room. Old rounds should be saved as history and loaded with pagination when needed.

Important identity rule:

```txt
roundId = official database identity
roundNumber = display/order number only
```

Frontend may show `roundNumber`, but backend logic should trust `roundId`.
