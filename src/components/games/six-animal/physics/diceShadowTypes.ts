// src/components/games/six-animal/physics/diceShadowTypes.ts

import type { DiceAnimalLabel } from "./physicsConstants";

export type DiceTrajectoryFrame = {
  t: number;
  position: [number, number, number];
  rotation: [number, number, number, number];
};

export type DiceShadowLaunchRecipe = {
  version: "v1-holder-wall-release";
  dieIndex: number;
  attemptNumber: number;
  startPosition: [number, number, number];
  rotation: [number, number, number, number];
  linvel: [number, number, number];
  angvel: [number, number, number];
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

export type ApprovedDiceTrajectorySource =
  | "v1-live-physics-recorder"
  | "shadow-worker-diagnostic";

export type ApprovedDiceTrajectoryTestMode = "trap" | "runway";

export type ApprovedDiceTrajectory = {
  version: "v1-approved-trajectory-60hz";
  id: string;
  source: ApprovedDiceTrajectorySource;

  finalAnimal: DiceAnimalLabel;
  finalStatus: DiceShadowFinalFaceStatus;
  finalConfidence: number;
  finalTiltDegrees: number;

  dieIndex: number;
  testMode: ApprovedDiceTrajectoryTestMode;

  frameRate: 60;
  frames: DiceTrajectoryFrame[];

  readableAtSeconds: number;
  motionEndSeconds: number;
  replayEndSeconds: number;

  metrics: DiceShadowMotionMetrics;
  motionScore: number;
  motionGrade: DiceShadowMotionGrade;
  notes: string[];

  approved: boolean;
  createdAt: string;

  diceShapePreset?: string;
  diceColliderPreset?: string;
};

export type DiceTrajectoryRecorderSample = {
  dieIndex: number;
  frameRate: 60;
  frames: DiceTrajectoryFrame[];
};

export type DiceTrajectoryRecorderComplete = {
  dieIndex: number;
  frameRate: 60;
  frames: DiceTrajectoryFrame[];
  finalAnimal: DiceAnimalLabel;
  finalStatus: DiceShadowFinalFaceStatus;
  finalConfidence: number;
  finalTiltDegrees: number;
  readableAtSeconds: number;
  motionEndSeconds: number;
  replayEndSeconds: number;
  metrics: DiceShadowMotionMetrics;
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

  // Old rejected production idea:
  // worker recipe -> browser live physics.
  // Keep this only for diagnostics/dev history.
  launchRecipe: DiceShadowLaunchRecipe;

  // Dev-only diagnostic/replay support.
  // Do not use raw worker replay as final production visual path.
  frames: DiceTrajectoryFrame[];

  attemptCount: number;
  simulationSeconds: number;

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

  // Useful only for diagnostics.
  bestMatchedLaunchRecipe?: DiceShadowLaunchRecipe;

  // Dev-only diagnostic/replay support.
  bestMatchedFrames?: DiceTrajectoryFrame[];
};

export type DiceShadowWorkerRequest = DiceShadowSearchRequest;

export type DiceShadowWorkerResponse =
  | DiceShadowSearchSuccess
  | DiceShadowSearchFail;