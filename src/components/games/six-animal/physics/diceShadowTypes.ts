// src/components/games/six-animal/physics/diceShadowTypes.ts

import type { DiceAnimalLabel } from "./physicsConstants";

export type DiceTrajectoryFrame = {
  t: number;
  position: [number, number, number];
  rotation: [number, number, number, number];
};

export type DiceShadowFinalFaceStatus = "accepted" | "cocked";

export type DiceShadowMotionGrade = "premium" | "accepted" | "weak";

export type DiceShadowMotionMetrics = {
  activeSeconds: number;
  visualActiveSeconds: number;
  deadSlideSeconds: number;
  deflectorBounceScore: number;
  directionChangeCount: number;
  directionChangeRadians: number;
  finalSettleScore: number;
  firstImpactScore: number;
  frontStopRisk: number;
  horizontalTravel: number;
  lateTumbleScore: number;
  lateTumbleTurns: number;
  lateralTravel: number;
  straightness: number;
  totalTravel: number;
  tumbleTurns: number;
};

export type DiceShadowSearchRequest = {
  kind: "search-one-die";
  requestId: string;
  targetAnimal: DiceAnimalLabel;
  dieIndex: number;
  attemptLimit: number;
  maxSimulationSeconds: number;
  frameRate: 30 | 60;
};

export type DiceShadowSearchSuccess = {
  kind: "search-success";
  requestId: string;
  targetAnimal: DiceAnimalLabel;
  dieIndex: number;
  finalAnimal: DiceAnimalLabel;
  finalStatus: DiceShadowFinalFaceStatus;
  finalConfidence: number;
  finalTiltDegrees: number;
  targetMatched: boolean;
  motionScore: number;
  motionGrade: DiceShadowMotionGrade;
  motionNotes: string[];
  motionMetrics: DiceShadowMotionMetrics;
  frames: DiceTrajectoryFrame[];
  attemptCount: number;
  simulationSeconds: number;

  // Optional timing markers.
  // These let the replay director reveal result before the full recorded replay ends.
  readableAtSeconds?: number;
  motionEndSeconds?: number;
  replayEndSeconds?: number;
};

export type DiceShadowSearchFail = {
  kind: "search-fail";
  requestId: string;
  targetAnimal: DiceAnimalLabel;
  dieIndex: number;
  attemptCount: number;
  reason: string;

  bestMatchedFinalAnimal?: DiceAnimalLabel;
  bestMatchedFinalStatus?: DiceShadowFinalFaceStatus;
  bestMatchedFinalConfidence?: number;
  bestMatchedFinalTiltDegrees?: number;
  bestMatchedMotionScore?: number;
  bestMatchedMotionGrade?: DiceShadowMotionGrade;
  bestMatchedMotionNotes?: string[];
  bestMatchedMotionMetrics?: DiceShadowMotionMetrics;
  bestMatchedAttemptCount?: number;
  bestMatchedFrames?: DiceTrajectoryFrame[];
};

export type DiceShadowWorkerRequest = DiceShadowSearchRequest;

export type DiceShadowWorkerResponse =
  | DiceShadowSearchSuccess
  | DiceShadowSearchFail;
