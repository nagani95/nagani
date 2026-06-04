//src>type>sixAnimalRoom.ts

import type { DiceAnimalLabel } from "@/components/games/six-animal/ThreeDicePhysicsStage";

export type SixAnimalRoundPhase = "betting" | "closed" | "rolling" | "result";

export type SixAnimalRoundStatus =
  | "scheduled"
  | "active"
  | "settled"
  | "cancelled";

export type SixAnimalRoundState = {
  id: string;
  roomId: string;
  roundNumber: number;
  phase: SixAnimalRoundPhase;
  bettingStartsAt: string;
  bettingEndsAt: string;
  rollingStartsAt: string | null;
  resultRevealedAt: string | null;
  nextRoundStartsAt: string | null;
  resultAnimals: DiceAnimalLabel[] | null;
  status: SixAnimalRoundStatus;
  createdAt: string;
  updatedAt: string;
};

export type SixAnimalDiceTarget = {
  roundId: string;
  roomId: string;
  roundNumber: number;
  resultAnimals: DiceAnimalLabel[];
  source: "mock-backend" | "backend";
};