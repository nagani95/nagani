// src/components/games/six-animal/ThreeDicePhysicsStage.tsx

"use client";

import { useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Euler, MathUtils, Quaternion, Vector3 } from "three";
import {
  Physics,
  RigidBody,
  RoundCuboidCollider,
  type RapierRigidBody,
} from "@react-three/rapier";
import { DiceVisual } from "./physics/DiceVisuals";
import {
  RecordedTrajectoryDice,
  StaticRecordedTrajectoryDice,
  createV1RecordedMotionMetrics,
  getRecordedTrajectoryReadableCapture,
  roundRecorderNumber,
} from "./physics/RecordedTrajectoryDice";
import { TrayBox } from "./physics/DiceTableScene";
import {
  createNearestVisibleResult,
  createStrictReadableVisibleResult,
  createTargetTopFaceQuaternion,
  detectTopDiceFace,
  getDiceFaceDirectionByLabel,
  isStrictReadableVisibleResult,
  type DiceFaceResult,
} from "./physics/diceResultDetection";
export type { DiceFaceResult } from "./physics/diceResultDetection";

export {
  getDiceFaceCandidateByLabel,
  getDiceFaceDirectionByLabel,
  getTargetCorrectionReadiness,
  getTargetCorrectionSafetyConfig,
  getTargetResultCaptureSummary,
  getTargetResultValidation,
  getTargetTopFaceDebugInfo,
} from "./physics/diceResultDetection";
import {
  DICE_HOLDER_X_POSITIONS,
  PHYSICS_GRAVITY,
  PRODUCTION_DICE_COLLIDER_PRESET,
  PRODUCTION_DICE_SHAPE_PRESET,
  createTableMeasurements,
  getDiceColliderConfig,
  getActiveDiceStartPosition,
getFallbackActiveDiceStartRotation,
getDiceLateralDrift,
getDiceNaturalDirection,
getDefaultRunwayLaunchLinvel,
getDefaultRunwayLaunchAngvel,
getDefaultTrapLaunchLinvel,
getDefaultTrapLaunchAngvel,
  worldUp,
  type DiceAnimalLabel,
  type DiceColliderPreset,
  type DiceShapePreset,
  type TableMeasurements,
  type DiceLaunchVelocity,
  getTargetLaunchRecipeProfile,
  getTargetLaunchSeed,  
} from "./physics/physicsConstants";
import type {
  DiceShadowLaunchRecipe,
  DiceTrajectoryFrame,
  DiceTrajectoryRecorderComplete,
} from "./physics/diceShadowTypes";

export type {
  DiceAnimalLabel,
  DiceColliderPreset,
  DiceShapePreset,
  TableMeasurements,
} from "./physics/physicsConstants";

export type TestMode = "trap" | "runway";
export type StageViewVariant = "lab" | "room";
export type MountedDiceRackMode = "ready" | "sequence" | "empty";

export type CapturedDiceResult = DiceFaceResult & {
  dieNumber: number;
};

export type ThreeDiceRoundPayload = {
  status: "idle" | "running" | "complete";
  source: "visible-physical-dice";
  results: DiceAnimalLabel[];
};

export type HeldRecordedTrajectoryDice = {
  dieIndex: number;
  frames: DiceTrajectoryFrame[];
  replayKey?: number;
};

export function createThreeDiceRoundPayload(
  capturedResults: CapturedDiceResult[],
  sequenceRunning: boolean
): ThreeDiceRoundPayload {
  const orderedResults = [...capturedResults]
    .sort((a, b) => a.dieNumber - b.dieNumber)
    .map((result) => result.label as DiceAnimalLabel);

  if (sequenceRunning) {
    return {
      status: "running",
      source: "visible-physical-dice",
      results: orderedResults,
    };
  }

  if (capturedResults.length === 3) {
    return {
      status: "complete",
      source: "visible-physical-dice",
      results: orderedResults,
    };
  }

  return {
    status: "idle",
    source: "visible-physical-dice",
    results: [],
  };
}

const VISIBLE_FACE_CAPTURE_MIN_ROLL_MS = 6200;
const VISIBLE_FACE_CAPTURE_STABLE_SECONDS = 0.42;
const VISIBLE_FACE_CAPTURE_SPEED = 1.05;
const VISIBLE_FACE_HARD_READ_MS = 9800;
const VISIBLE_FACE_EDGE_SETTLE_LIMIT_MS = 11200;
const TARGET_PERFORMANCE_START_MS = 7200;
const TARGET_PERFORMANCE_FULL_MS = 9800;
const TARGET_PERFORMANCE_END_MS = 11600;
const VISIBLE_FACE_EDGE_SETTLE_TILT_DEGREES = 32;

const TABLE_RUNWAY_COLOR = "#5f0612";
const TABLE_BACKBOARD_COLOR = "#260405";
const TABLE_INNER_PANEL_COLOR = "#3a0808";
const TABLE_BORDER_COLOR = "#1d0304";
const TABLE_TRAPDOOR_CLOSED_COLOR = "#35100d";
const TABLE_TRAPDOOR_OPEN_COLOR = "#4a1813";
const TABLE_GOLD_ACCENT_COLOR = "#b9903d";
const TABLE_WOOD_ACCENT_COLOR = "#2b0806";
const TABLE_RUNWAY_INSET_COLOR = "#760816";
const TABLE_RUNWAY_SHADOW_COLOR = "#240205";
const TABLE_GOLD_TRIM_COLOR = "#c89f47";

const TABLE_LACQUER_OUTER_COLOR = "#190203";
const TABLE_SIDE_INNER_GLOW_COLOR = "#45100f";
const TABLE_VELVET_HIGHLIGHT_COLOR = "#9c1120";
const TABLE_SHADOW_GLASS_COLOR = "#120102";
const TABLE_BRASS_SHADOW_COLOR = "#6e4a1e";

type TableMaterialToken = {
  color: string;
  roughness: number;
  metalness?: number;
  transparent?: boolean;
  opacity?: number;
};

const TABLE_MATERIALS = {
  runwayFelt: {
    color: TABLE_RUNWAY_COLOR,
    roughness: 0.99,
    metalness: 0,
  },
  runwayInset: {
    color: TABLE_RUNWAY_INSET_COLOR,
    roughness: 1,
    metalness: 0,
    transparent: true,
    opacity: 0.22,
  },
  runwayCenterGlow: {
    color: TABLE_VELVET_HIGHLIGHT_COLOR,
    roughness: 1,
    metalness: 0,
    transparent: true,
    opacity: 0.1,
  },
  runwayBackShadow: {
    color: TABLE_RUNWAY_SHADOW_COLOR,
    roughness: 1,
    metalness: 0,
    transparent: true,
    opacity: 0.28,
  },
  runwaySideDepth: {
    color: TABLE_SHADOW_GLASS_COLOR,
    roughness: 1,
    metalness: 0,
    transparent: true,
    opacity: 0.12,
  },
  backboardLacquer: {
    color: TABLE_BACKBOARD_COLOR,
    roughness: 0.48,
    metalness: 0.08,
  },
  innerLacquerPanel: {
    color: TABLE_INNER_PANEL_COLOR,
    roughness: 0.56,
    metalness: 0.06,
  },
  holderWood: {
    color: TABLE_WOOD_ACCENT_COLOR,
    roughness: 0.62,
    metalness: 0.04,
  },
  trapdoorClosed: {
    color: TABLE_TRAPDOOR_CLOSED_COLOR,
    roughness: 0.68,
    metalness: 0.025,
  },
  trapdoorOpen: {
    color: TABLE_TRAPDOOR_OPEN_COLOR,
    roughness: 0.7,
    metalness: 0.025,
  },
  goldAccent: {
    color: TABLE_GOLD_ACCENT_COLOR,
    roughness: 0.42,
    metalness: 0.55,
  },
  goldTrim: {
    color: TABLE_GOLD_TRIM_COLOR,
    roughness: 0.4,
    metalness: 0.5,
  },
  darkBorder: {
    color: TABLE_BORDER_COLOR,
    roughness: 0.52,
    metalness: 0.06,
  },
  sideGoldRail: {
    color: TABLE_GOLD_TRIM_COLOR,
    roughness: 0.42,
    metalness: 0.48,
  },
    railLacquerSheen: {
    color: TABLE_SIDE_INNER_GLOW_COLOR,
    roughness: 0.46,
    metalness: 0.08,
    transparent: true,
    opacity: 0.22,
  },
  railOuterShadow: {
    color: TABLE_LACQUER_OUTER_COLOR,
    roughness: 0.7,
    metalness: 0.04,
    transparent: true,
    opacity: 0.42,
  },
  frontLipLacquerSheen: {
    color: TABLE_SIDE_INNER_GLOW_COLOR,
    roughness: 0.44,
    metalness: 0.08,
    transparent: true,
    opacity: 0.18,
  },
  frontLipBottomShadow: {
    color: TABLE_SHADOW_GLASS_COLOR,
    roughness: 0.78,
    metalness: 0.03,
    transparent: true,
    opacity: 0.36,
  },
    backboardLacquerSheen: {
    color: TABLE_SIDE_INNER_GLOW_COLOR,
    roughness: 0.48,
    metalness: 0.08,
    transparent: true,
    opacity: 0.16,
  },
  backboardLowerShadow: {
    color: TABLE_SHADOW_GLASS_COLOR,
    roughness: 0.82,
    metalness: 0.03,
    transparent: true,
    opacity: 0.34,
  },
  holderShelfGoldEdge: {
    color: TABLE_GOLD_TRIM_COLOR,
    roughness: 0.38,
    metalness: 0.5,
  },
  holderShelfShadow: {
    color: TABLE_SHADOW_GLASS_COLOR,
    roughness: 0.8,
    metalness: 0.03,
    transparent: true,
    opacity: 0.34,
  },
    kanoteGold: {
    color: TABLE_GOLD_TRIM_COLOR,
    roughness: 0.44,
    metalness: 0.52,
  },
  kanoteSoftShadow: {
    color: TABLE_BRASS_SHADOW_COLOR,
    roughness: 0.62,
    metalness: 0.24,
    transparent: true,
    opacity: 0.34,
  },
    kanoteBackboardGhost: {
    color: TABLE_GOLD_ACCENT_COLOR,
    roughness: 0.58,
    metalness: 0.26,
    transparent: true,
    opacity: 0.12,
  },
} satisfies Record<string, TableMaterialToken>;

const ROOM_AMBIENT_LIGHT_INTENSITY = 0.62;
const ROOM_KEY_LIGHT_INTENSITY = 2.45;
const ROOM_WARM_FILL_LIGHT_INTENSITY = 1.05;

const ROOM_CAMERA_DEFAULT_TOP_VIEW = 0.48;
const ROOM_CAMERA_BASE_HEIGHT = 5.05;
const ROOM_CAMERA_BASE_DISTANCE = 10.95;
const ROOM_CAMERA_LOOK_Y = 0.04;
const ROOM_CAMERA_LOOK_Z = -0.22;

const DEV_TRAP_RELEASE_DICE_START_Y = 2.82;
const DEV_TRAP_RELEASE_DICE_START_Z_OFFSET = 0.67;

const DEV_TRAP_RELEASE_HINGE_Y = 2.42;
const DEV_TRAP_RELEASE_HINGE_Z_OFFSET = 0.41;
const DEV_TRAP_RELEASE_CLOSED_ANGLE = 0.56;
const DEV_TRAP_RELEASE_OPEN_ANGLE = 1.12;

const DEV_ROLL_DICE_RESTITUTION = 0.5;
const DEV_ROLL_DICE_FRICTION = 0.36;
const DEV_ROLL_DICE_LINEAR_DAMPING = 0.006;
const DEV_ROLL_DICE_ANGULAR_DAMPING = 0.008;

const DEV_RUNWAY_UPPER_RESTITUTION = 0.28;
const DEV_RUNWAY_UPPER_FRICTION = 0.3;
const DEV_RUNWAY_SETTLING_RESTITUTION = 0.14;
const DEV_RUNWAY_SETTLING_FRICTION = 0.4;

const DEV_DEFLECTOR_RESTITUTION = 0.78;
const DEV_DEFLECTOR_FRICTION = 0.18;
const DEV_DEFLECTOR_SHOULDER_RESTITUTION = 0.7;
const DEV_DEFLECTOR_SHOULDER_FRICTION = 0.22;

function softenVisibleDiceBody(body: RapierRigidBody) {
  const linvel = body.linvel();
  const angvel = body.angvel();

  body.setLinvel(
    {
      x: linvel.x * 0.18,
      y: linvel.y * 0.18,
      z: linvel.z * 0.18,
    },
    true
  );

  body.setAngvel(
    {
      x: angvel.x * 0.14,
      y: angvel.y * 0.14,
      z: angvel.z * 0.14,
    },
    true
  );
}

function createTargetAwareCaptureMessage({
  targetAnimal,
  capturedResult,
  defaultMessage,
}: {
  targetAnimal?: DiceAnimalLabel | null;
  capturedResult: DiceFaceResult;
  defaultMessage: string;
}) {
if (capturedResult.status !== "accepted") {
  return capturedResult.message || defaultMessage;
}

if (!targetAnimal) {
  return defaultMessage;
}

  if (capturedResult.label === targetAnimal) {
    return `Visible dice matched target ${targetAnimal}.`;
  }

  return `Visible dice captured as ${capturedResult.label}; target ${targetAnimal} not matched.`;
}

function applySoftTargetPerformance({
  body,
  targetAnimal,
  rollAgeMs,
  movementSpeed,
}: {
  body: RapierRigidBody;
  targetAnimal?: DiceAnimalLabel | null;
  rollAgeMs: number;
  movementSpeed: number;
}) {
  if (!targetAnimal) return;
  if (rollAgeMs < TARGET_PERFORMANCE_START_MS) return;
  if (rollAgeMs > TARGET_PERFORMANCE_END_MS) return;

  const targetDirection = getDiceFaceDirectionByLabel(targetAnimal);
  if (!targetDirection) return;

  const rotation = body.rotation();
  const quaternion = new Quaternion(
    rotation.x,
    rotation.y,
    rotation.z,
    rotation.w
  );

  const targetWorldDirection = targetDirection
    .applyQuaternion(quaternion)
    .normalize();

  const alignment = MathUtils.clamp(targetWorldDirection.dot(worldUp), -1, 1);
  const targetAngle = Math.acos(alignment);

  const correctionAxis = targetWorldDirection.clone().cross(worldUp);

  if (correctionAxis.lengthSq() < 0.00001) {
    const angvel = body.angvel();

    body.setAngvel(
      {
        x: angvel.x * 0.94,
        y: angvel.y * 0.94,
        z: angvel.z * 0.94,
      },
      true
    );

    return;
  }

  correctionAxis.normalize();

  const ageBlend = MathUtils.clamp(
    (rollAgeMs - TARGET_PERFORMANCE_START_MS) /
      (TARGET_PERFORMANCE_FULL_MS - TARGET_PERFORMANCE_START_MS),
    0,
    1
  );

const lateBlend = MathUtils.clamp((rollAgeMs - 7600) / 2300, 0, 1);
const finalBlend = MathUtils.clamp((rollAgeMs - 9800) / 1500, 0, 1);
const landingBlend = Math.max(lateBlend, finalBlend);

const speedBlend = MathUtils.clamp((2.0 - movementSpeed) / 1.8, 0, 1);

const correctionStrength =
  MathUtils.clamp(
    targetAngle *
      MathUtils.lerp(0.35, 1.28, lateBlend) *
      MathUtils.lerp(1, 1.18, finalBlend),
    0,
    MathUtils.lerp(0.42, 1.68, landingBlend)
  ) *
  ageBlend *
  (0.14 + speedBlend * 0.86);

const spinKeep = MathUtils.lerp(0.995, 0.78, landingBlend);
const angvel = body.angvel();

const nextAngvel = {
  x: angvel.x * spinKeep + correctionAxis.x * correctionStrength,
  y: angvel.y * spinKeep + correctionAxis.y * correctionStrength,
  z: angvel.z * spinKeep + correctionAxis.z * correctionStrength,
};

const maxAngularSpeed = MathUtils.lerp(4.2, 1.65, landingBlend);
const nextSpeed =
  Math.abs(nextAngvel.x) + Math.abs(nextAngvel.y) + Math.abs(nextAngvel.z);

if (nextSpeed > maxAngularSpeed) {
  const scale = maxAngularSpeed / nextSpeed;

  body.setAngvel(
    {
      x: nextAngvel.x * scale,
      y: nextAngvel.y * scale,
      z: nextAngvel.z * scale,
    },
    true
  );

  return;
}

body.setAngvel(nextAngvel, true);
}

function quaternionToEulerTuple(quaternion: Quaternion): [number, number, number] {
  const euler = new Euler().setFromQuaternion(quaternion.normalize(), "XYZ");

  return [euler.x, euler.y, euler.z];
}

function createTargetAwareLaunchRecipe({
  enabled,
  targetAnimal,
  activeDieIndex,
  resetKey,
  fallbackRotation,
  fallbackLinvel,
  fallbackAngvel,
}: {
  enabled: boolean;
  targetAnimal?: DiceAnimalLabel | null;
  activeDieIndex: number;
  resetKey: number;
  fallbackRotation: [number, number, number];
  fallbackLinvel: DiceLaunchVelocity;
  fallbackAngvel: DiceLaunchVelocity;
}) {
  if (!enabled || !targetAnimal) {
    return {
      rotation: fallbackRotation,
      linvel: fallbackLinvel,
      angvel: fallbackAngvel,
    };
  }

  const targetQuaternion = createTargetTopFaceQuaternion(targetAnimal);

  if (!targetQuaternion) {
    return {
      rotation: fallbackRotation,
      linvel: fallbackLinvel,
      angvel: fallbackAngvel,
    };
  }

const seed =
  getTargetLaunchSeed(targetAnimal) + activeDieIndex * 7 + resetKey * 3;

const profile = getTargetLaunchRecipeProfile(targetAnimal);

const preRollQuaternion = new Quaternion().setFromAxisAngle(
  new Vector3(1, 0, 0),
  MathUtils.degToRad(profile.preRollDeg)
);

const scrambleAxis = new Vector3(
  0.12 + (seed % 2) * 0.05,
  0.88,
  0.22 - (seed % 3) * 0.04
).normalize();

const scrambleQuaternion = new Quaternion().setFromAxisAngle(
  scrambleAxis,
  MathUtils.degToRad(profile.scrambleDeg)
);

const launchQuaternion = targetQuaternion
  .clone()
  .multiply(preRollQuaternion)
  .multiply(scrambleQuaternion)
  .normalize();

return {
  rotation: quaternionToEulerTuple(launchQuaternion),
  linvel: {
    x: profile.linX,
    y: profile.linY,
    z: profile.linZ,
  },
  angvel: {
    x: profile.angX,
    y: profile.angY,
    z: profile.angZ,
  },
};
}

function seededUnit(seed: number) {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
}

function seededRange(seed: number, min: number, max: number) {
  return min + (max - min) * seededUnit(seed);
}

function getDevTrapReleaseDicePosition({
  table,
  activeDieX,
}: {
  table: TableMeasurements;
  activeDieX: number;
}): [number, number, number] {
  return [
    activeDieX,
    DEV_TRAP_RELEASE_DICE_START_Y,
    table.backWallZ + DEV_TRAP_RELEASE_DICE_START_Z_OFFSET,
  ];
}

type RecorderReleasePattern = {
  position: DiceLaunchVelocity;
  rotation: DiceLaunchVelocity;
  linvel: DiceLaunchVelocity;
  angvel: DiceLaunchVelocity;
};

const RECORDER_RELEASE_PATTERNS: RecorderReleasePattern[] = [
  {
    // A — natural forward tumble
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0.08, y: 0.12, z: -0.06 },
    linvel: { x: 0.02, y: -0.04, z: 0.22 },
    angvel: { x: 3.75, y: 0.85, z: 1.65 },
  },
  {
    // B — opposite forward tumble
    position: { x: 0, y: 0, z: 0.02 },
    rotation: { x: -0.1, y: -0.16, z: 0.08 },
    linvel: { x: -0.02, y: -0.04, z: 0.24 },
    angvel: { x: -3.75, y: -0.85, z: -1.65 },
  },
  {
    // C — side tumble left
    position: { x: -0.12, y: 0.01, z: -0.03 },
    rotation: { x: 0.18, y: 0.62, z: -0.24 },
    linvel: { x: -0.18, y: -0.05, z: 0.18 },
    angvel: { x: 1.45, y: 3.35, z: 1.25 },
  },
  {
    // D — side tumble right
    position: { x: 0.12, y: 0.01, z: -0.03 },
    rotation: { x: -0.18, y: -0.62, z: 0.24 },
    linvel: { x: 0.18, y: -0.05, z: 0.18 },
    angvel: { x: -1.45, y: -3.35, z: -1.25 },
  },
  {
    // E — crab/elephant front-back flip
    position: { x: 0.05, y: 0.02, z: 0.05 },
    rotation: { x: 0.28, y: 0.18, z: 0.74 },
    linvel: { x: 0.08, y: -0.02, z: 0.28 },
    angvel: { x: 1.05, y: 0.9, z: 3.85 },
  },
  {
    // F — reverse front-back flip
    position: { x: -0.05, y: 0.02, z: 0.05 },
    rotation: { x: -0.28, y: -0.18, z: -0.74 },
    linvel: { x: -0.08, y: -0.02, z: 0.28 },
    angvel: { x: -1.05, y: -0.9, z: -3.85 },
  },
  {
    // G — high soft pop
    position: { x: 0.04, y: 0.045, z: -0.08 },
    rotation: { x: 0.44, y: -0.36, z: 0.28 },
    linvel: { x: 0.1, y: 0.04, z: 0.12 },
    angvel: { x: 2.35, y: -2.45, z: 2.1 },
  },
  {
    // H — opposite high soft pop
    position: { x: -0.04, y: 0.045, z: -0.08 },
    rotation: { x: -0.44, y: 0.36, z: -0.28 },
    linvel: { x: -0.1, y: 0.04, z: 0.12 },
    angvel: { x: -2.35, y: 2.45, z: -2.1 },
  },
  {
    // I — diagonal deflector kiss
    position: { x: -0.16, y: 0.015, z: 0.03 },
    rotation: { x: 0.34, y: 0.74, z: 0.18 },
    linvel: { x: 0.2, y: -0.04, z: 0.3 },
    angvel: { x: 2.55, y: 2.65, z: 2.35 },
  },
  {
    // J — opposite diagonal deflector kiss
    position: { x: 0.16, y: 0.015, z: 0.03 },
    rotation: { x: -0.34, y: -0.74, z: -0.18 },
    linvel: { x: -0.2, y: -0.04, z: 0.3 },
    angvel: { x: -2.55, y: -2.65, z: -2.35 },
  },
  {
    // K — low rolling twist
    position: { x: 0.07, y: -0.02, z: 0.08 },
    rotation: { x: 0.16, y: 0.88, z: -0.38 },
    linvel: { x: 0.14, y: -0.08, z: 0.2 },
    angvel: { x: 0.95, y: 3.8, z: -2.6 },
  },
  {
    // L — opposite low rolling twist
    position: { x: -0.07, y: -0.02, z: 0.08 },
    rotation: { x: -0.16, y: -0.88, z: 0.38 },
    linvel: { x: -0.14, y: -0.08, z: 0.2 },
    angvel: { x: -0.95, y: -3.8, z: 2.6 },
  },
];

function getRecorderReleasePattern(index: number): RecorderReleasePattern {
  return RECORDER_RELEASE_PATTERNS[
    Math.abs(index) % RECORDER_RELEASE_PATTERNS.length
  ];
}

function DiceCube({
  resetKey,
  onSettledChange,
  onFaceResultChange,
  testMode,
  activeDieIndex,
  diceShapePreset,
  diceColliderPreset,
  hideActiveDiceFaces,
captureRequestKey = 0,
targetAnimal = null,
targetPerformanceEnabled = false,
strictReadableResultGate = false,
targetLaunchRecipeEnabled = false,
devPhysicalReleaseEnabled = false,
shadowLaunchRecipe = null,
trajectoryRecorderEnabled = false,
trajectoryRecorderRunNonce = 0,
onTrajectoryRecorderComplete = null,
}: {
  resetKey: number;
  onSettledChange: (settled: boolean) => void;
  onFaceResultChange: (result: DiceFaceResult | null) => void;
  testMode: TestMode;
  activeDieIndex: number;
  diceShapePreset: DiceShapePreset;
  diceColliderPreset: DiceColliderPreset;
hideActiveDiceFaces?: boolean;
  captureRequestKey?: number;
  targetAnimal?: DiceAnimalLabel | null;
  targetPerformanceEnabled?: boolean;
  strictReadableResultGate?: boolean;
  targetLaunchRecipeEnabled?: boolean;
  devPhysicalReleaseEnabled?: boolean;
  shadowLaunchRecipe?: DiceShadowLaunchRecipe | null;
    trajectoryRecorderEnabled?: boolean;
  onTrajectoryRecorderComplete?:
  | ((recording: DiceTrajectoryRecorderComplete) => void)
  | null;
trajectoryRecorderRunNonce?: number;
}) {
const bodyRef = useRef<RapierRigidBody | null>(null);
const stillTimeRef = useRef(0);
const settledRef = useRef(false);
const rollStartedAtRef = useRef(0);
const stableVisibleFaceKeyRef = useRef<string | null>(null);
const stableVisibleFaceTimeRef = useRef(0);
const lastCaptureRequestKeyRef = useRef(0);
const softHoldStartedAtRef = useRef<number | null>(null);
const trajectoryFramesRef = useRef<DiceTrajectoryFrame[]>([]);
const trajectoryLastSampleSecondRef = useRef(-1);
const trajectoryCompletedRef = useRef(false);

const collider = getDiceColliderConfig(diceColliderPreset);
const activeDieX = DICE_HOLDER_X_POSITIONS[activeDieIndex] ?? 0;
const table = createTableMeasurements();

const hasShadowLaunchRecipe = Boolean(shadowLaunchRecipe);

const recorderReleaseSeed =
  trajectoryRecorderRunNonce + resetKey * 101 + activeDieIndex * 1009;

const recorderReleaseJitterEnabled =
  trajectoryRecorderEnabled &&
  devPhysicalReleaseEnabled &&
  testMode === "trap" &&
  !targetLaunchRecipeEnabled &&
  !hasShadowLaunchRecipe;

const recorderReleasePatternIndex = recorderReleaseJitterEnabled
  ? trajectoryRecorderRunNonce + activeDieIndex * 5 + resetKey * 2
  : 0;

const recorderReleasePattern = getRecorderReleasePattern(
  recorderReleasePatternIndex
);

const recorderPositionJitter = recorderReleaseJitterEnabled
  ? {
      x:
        recorderReleasePattern.position.x +
        seededRange(recorderReleaseSeed + 1, -0.055, 0.055),
      y:
        recorderReleasePattern.position.y +
        seededRange(recorderReleaseSeed + 2, -0.018, 0.028),
      z:
        recorderReleasePattern.position.z +
        seededRange(recorderReleaseSeed + 3, -0.045, 0.045),
    }
  : { x: 0, y: 0, z: 0 };

const recorderRotationJitter = recorderReleaseJitterEnabled
  ? {
      x:
        recorderReleasePattern.rotation.x +
        seededRange(recorderReleaseSeed + 4, -0.18, 0.18),
      y:
        recorderReleasePattern.rotation.y +
        seededRange(recorderReleaseSeed + 5, -0.22, 0.22),
      z:
        recorderReleasePattern.rotation.z +
        seededRange(recorderReleaseSeed + 6, -0.18, 0.18),
    }
  : { x: 0, y: 0, z: 0 };

const recorderInitialLinvel = recorderReleaseJitterEnabled
  ? {
      x:
        recorderReleasePattern.linvel.x +
        seededRange(recorderReleaseSeed + 7, -0.045, 0.045),
      y:
        recorderReleasePattern.linvel.y +
        seededRange(recorderReleaseSeed + 8, -0.025, 0.025),
      z:
        recorderReleasePattern.linvel.z +
        seededRange(recorderReleaseSeed + 9, -0.05, 0.05),
    }
  : { x: 0, y: 0, z: 0 };

const recorderInitialAngvel = recorderReleaseJitterEnabled
  ? {
      x:
        recorderReleasePattern.angvel.x +
        seededRange(recorderReleaseSeed + 10, -0.42, 0.42),
      y:
        recorderReleasePattern.angvel.y +
        seededRange(recorderReleaseSeed + 11, -0.42, 0.42),
      z:
        recorderReleasePattern.angvel.z +
        seededRange(recorderReleaseSeed + 12, -0.42, 0.42),
    }
  : { x: 0, y: 0, z: 0 };

const useKinematicTrapRelease =
  devPhysicalReleaseEnabled &&
  testMode === "trap" &&
  !targetLaunchRecipeEnabled &&
  !hasShadowLaunchRecipe;

const v1TrapReleaseBasePosition = getDevTrapReleaseDicePosition({
  table,
  activeDieX,
});

const activeHolderStartPosition = shadowLaunchRecipe
  ? shadowLaunchRecipe.startPosition
  : useKinematicTrapRelease
    ? ([
        v1TrapReleaseBasePosition[0] + recorderPositionJitter.x,
        v1TrapReleaseBasePosition[1] + recorderPositionJitter.y,
        v1TrapReleaseBasePosition[2] + recorderPositionJitter.z,
      ] as [number, number, number])
    : getActiveDiceStartPosition({
        testMode,
        activeDieX,
      });

const baseFallbackActiveHolderStartRotation =
  getFallbackActiveDiceStartRotation({
    testMode,
    activeDieIndex,
  });

const fallbackActiveHolderStartRotation: [number, number, number] = [
  baseFallbackActiveHolderStartRotation[0] + recorderRotationJitter.x,
  baseFallbackActiveHolderStartRotation[1] + recorderRotationJitter.y,
  baseFallbackActiveHolderStartRotation[2] + recorderRotationJitter.z,
];

const lateralDrift = getDiceLateralDrift({
  activeDieIndex,
  resetKey,
});

const naturalDirection = getDiceNaturalDirection({
  activeDieIndex,
  resetKey,
});

const defaultRunwayLaunchLinvel = getDefaultRunwayLaunchLinvel({
  lateralDrift,
});

const defaultRunwayLaunchAngvel = getDefaultRunwayLaunchAngvel({
  resetKey,
});

const defaultTrapLaunchLinvel = getDefaultTrapLaunchLinvel({
  naturalDirection,
  lateralDrift,
});

const defaultTrapLaunchAngvel = getDefaultTrapLaunchAngvel({
  activeDieIndex,
  resetKey,
});

const targetLaunchRecipe = createTargetAwareLaunchRecipe({
  enabled: targetLaunchRecipeEnabled,
  targetAnimal,
  activeDieIndex,
  resetKey,
  fallbackRotation: fallbackActiveHolderStartRotation,
  fallbackLinvel:
    testMode === "runway" ? defaultRunwayLaunchLinvel : defaultTrapLaunchLinvel,
  fallbackAngvel:
    testMode === "runway" ? defaultRunwayLaunchAngvel : defaultTrapLaunchAngvel,
});

const shadowLaunchStartRotation = shadowLaunchRecipe
  ? quaternionToEulerTuple(
      new Quaternion(
        shadowLaunchRecipe.rotation[0],
        shadowLaunchRecipe.rotation[1],
        shadowLaunchRecipe.rotation[2],
        shadowLaunchRecipe.rotation[3]
      )
    )
  : null;

const activeHolderStartRotation =
  shadowLaunchStartRotation ?? targetLaunchRecipe.rotation;

useEffect(() => {
stillTimeRef.current = 0;
settledRef.current = false;
rollStartedAtRef.current = performance.now();
stableVisibleFaceKeyRef.current = null;
stableVisibleFaceTimeRef.current = 0;
lastCaptureRequestKeyRef.current = captureRequestKey;
softHoldStartedAtRef.current = null;
trajectoryFramesRef.current = [];
trajectoryLastSampleSecondRef.current = -1;
trajectoryCompletedRef.current = false;

onSettledChange(false);
onFaceResultChange(null);

  const releaseFrame = window.requestAnimationFrame(() => {
    const body = bodyRef.current;
    if (!body) return;

if (shadowLaunchRecipe) {
  body.setLinvel(
    {
      x: shadowLaunchRecipe.linvel[0],
      y: shadowLaunchRecipe.linvel[1],
      z: shadowLaunchRecipe.linvel[2],
    },
    true
  );

  body.setAngvel(
    {
      x: shadowLaunchRecipe.angvel[0],
      y: shadowLaunchRecipe.angvel[1],
      z: shadowLaunchRecipe.angvel[2],
    },
    true
  );

  return;
}

if (useKinematicTrapRelease) {
  body.setLinvel(recorderInitialLinvel, true);
  body.setAngvel(recorderInitialAngvel, true);
  return;
}

body.setLinvel(targetLaunchRecipe.linvel, true);
body.setAngvel(targetLaunchRecipe.angvel, true);
  });

  return () => window.cancelAnimationFrame(releaseFrame);
}, [
  resetKey,
  activeDieIndex,
  testMode,
  lateralDrift,
  captureRequestKey,
  targetLaunchRecipe.linvel.x,
  targetLaunchRecipe.linvel.y,
  targetLaunchRecipe.linvel.z,
  targetLaunchRecipe.angvel.x,
  targetLaunchRecipe.angvel.y,
  targetLaunchRecipe.angvel.z,
  useKinematicTrapRelease,
  trajectoryRecorderRunNonce,
recorderInitialLinvel.x,
recorderInitialLinvel.y,
recorderInitialLinvel.z,
recorderInitialAngvel.x,
recorderInitialAngvel.y,
recorderInitialAngvel.z,
    shadowLaunchRecipe,
]);

function recordTrajectoryFrame({
  body,
  elapsedSeconds,
  force = false,
}: {
  body: RapierRigidBody;
  elapsedSeconds: number;
  force?: boolean;
}) {
  if (!trajectoryRecorderEnabled || trajectoryCompletedRef.current) return;

  const safeElapsedSeconds = Math.max(0, elapsedSeconds);

  if (
    !force &&
    trajectoryLastSampleSecondRef.current >= 0 &&
    safeElapsedSeconds - trajectoryLastSampleSecondRef.current < 1 / 60
  ) {
    return;
  }

  const position = body.translation();
  const rotation = body.rotation();

  trajectoryLastSampleSecondRef.current = safeElapsedSeconds;

  trajectoryFramesRef.current.push({
    t: roundRecorderNumber(safeElapsedSeconds, 4),
    position: [
      roundRecorderNumber(position.x, 5),
      roundRecorderNumber(position.y, 5),
      roundRecorderNumber(position.z, 5),
    ],
    rotation: [
      roundRecorderNumber(rotation.x, 6),
      roundRecorderNumber(rotation.y, 6),
      roundRecorderNumber(rotation.z, 6),
      roundRecorderNumber(rotation.w, 6),
    ],
  });
}

function completeTrajectoryRecording({
  body,
  capturedResult,
}: {
  body: RapierRigidBody;
  capturedResult: DiceFaceResult;
}) {
  if (
    !trajectoryRecorderEnabled ||
    trajectoryCompletedRef.current ||
    !onTrajectoryRecorderComplete
  ) {
    return;
  }

const elapsedSeconds = (performance.now() - rollStartedAtRef.current) / 1000;

recordTrajectoryFrame({
  body,
  elapsedSeconds,
  force: true,
});

trajectoryCompletedRef.current = true;

  const frames = [...trajectoryFramesRef.current];

  if (frames.length < 2) return;

  const lastFrame = frames[frames.length - 1];
  const readableCapture = getRecordedTrajectoryReadableCapture(frames);
  const metrics = createV1RecordedMotionMetrics(frames);

  const finalAnimal = (
    capturedResult.status === "accepted"
      ? capturedResult.label
      : capturedResult.nearestLabel
  ) as DiceAnimalLabel;

  onTrajectoryRecorderComplete({
    dieIndex: activeDieIndex,
    frameRate: 60,
    frames,
    finalAnimal,
    finalStatus: capturedResult.status,
    finalConfidence: capturedResult.confidence,
    finalTiltDegrees: capturedResult.tiltDegrees,
    readableAtSeconds: roundRecorderNumber(
      readableCapture?.t ?? lastFrame.t,
      2
    ),
    motionEndSeconds: roundRecorderNumber(lastFrame.t, 2),
    replayEndSeconds: roundRecorderNumber(lastFrame.t + 0.75, 2),
    metrics,
  });
}

useFrame((_, delta) => {
  const body = bodyRef.current;
  if (!body) return;

const linvel = body.linvel();
const angvel = body.angvel();

const rollAgeMs = performance.now() - rollStartedAtRef.current;

recordTrajectoryFrame({
  body,
  elapsedSeconds: rollAgeMs / 1000,
});

const movementSpeed =
      Math.abs(linvel.x) +
      Math.abs(linvel.y) +
      Math.abs(linvel.z) +
      Math.abs(angvel.x) * 0.15 +
      Math.abs(angvel.y) * 0.15 +
      Math.abs(angvel.z) * 0.15;

      if (settledRef.current) {
  const holdAgeMs = softHoldStartedAtRef.current
    ? performance.now() - softHoldStartedAtRef.current
    : 0;

  if (holdAgeMs < 760) {
    softenVisibleDiceBody(body);
  } else if (movementSpeed < 0.045) {
    body.setLinvel({ x: 0, y: 0, z: 0 }, true);
    body.setAngvel({ x: 0, y: 0, z: 0 }, true);
  }

  return;
}
  
const rotation = body.rotation();
const visibleResult = detectTopDiceFace(rotation);
const visibleFaceKey =
  visibleResult.status === "accepted"
    ? `${visibleResult.label}:${visibleResult.axis}`
    : null;

const hasControllerCaptureRequest =
  captureRequestKey > 0 &&
  captureRequestKey !== lastCaptureRequestKeyRef.current;

if (hasControllerCaptureRequest && !settledRef.current) {
  lastCaptureRequestKeyRef.current = captureRequestKey;

const diceStillFeelsAlive =
  rollAgeMs < VISIBLE_FACE_HARD_READ_MS &&
  (movementSpeed > 0.62 ||
    visibleResult.tiltDegrees > VISIBLE_FACE_EDGE_SETTLE_TILT_DEGREES);

  if (diceStillFeelsAlive) {
    softenVisibleDiceBody(body);
    return;
  }

  const capturedResult = strictReadableResultGate
  ? createStrictReadableVisibleResult(visibleResult)
  : createNearestVisibleResult(visibleResult);

settledRef.current = true;
stillTimeRef.current = 999;

softHoldStartedAtRef.current = performance.now();

softenVisibleDiceBody(body);

completeTrajectoryRecording({
  body,
  capturedResult,
});

onSettledChange(true);
onFaceResultChange({
  ...capturedResult,
  message: createTargetAwareCaptureMessage({
    targetAnimal,
    capturedResult,
    defaultMessage: "Nearest visible dice face captured by dice director.",
  }),
});

  return;
}

const shouldUseSoftTargetPerformance = targetPerformanceEnabled;

if (shouldUseSoftTargetPerformance) {
  applySoftTargetPerformance({
    body,
    targetAnimal,
    rollAgeMs,
    movementSpeed,
  });
}

const shouldRequireTargetMatch =
  Boolean(targetAnimal) &&
  (targetPerformanceEnabled || targetLaunchRecipeEnabled || hasShadowLaunchRecipe);

const visibleFaceMatchesTarget =
  !shouldRequireTargetMatch || visibleResult.label === targetAnimal;

if (
  visibleFaceKey &&
  visibleFaceMatchesTarget &&
  movementSpeed < VISIBLE_FACE_CAPTURE_SPEED &&
  rollAgeMs >= VISIBLE_FACE_CAPTURE_MIN_ROLL_MS
) {
  if (stableVisibleFaceKeyRef.current === visibleFaceKey) {
    stableVisibleFaceTimeRef.current += delta;
  } else {
    stableVisibleFaceKeyRef.current = visibleFaceKey;
    stableVisibleFaceTimeRef.current = 0;
  }
} else {
  stableVisibleFaceKeyRef.current = null;
  stableVisibleFaceTimeRef.current = 0;
}

const hasComfortablyStableVisibleFace =
  visibleResult.status === "accepted" &&
  visibleFaceMatchesTarget &&
  (strictReadableResultGate
    ? isStrictReadableVisibleResult(visibleResult)
    : visibleResult.tiltDegrees <= 26) &&
  movementSpeed < VISIBLE_FACE_CAPTURE_SPEED &&
  stableVisibleFaceTimeRef.current >= VISIBLE_FACE_CAPTURE_STABLE_SECONDS;

const hasStableVisibleFace = hasComfortablyStableVisibleFace;

const hasReachedHardRead = rollAgeMs >= VISIBLE_FACE_HARD_READ_MS;
const shouldGiveCockedDiceMoreSettleTime =
  hasReachedHardRead &&
  rollAgeMs < VISIBLE_FACE_EDGE_SETTLE_LIMIT_MS &&
  visibleResult.tiltDegrees > VISIBLE_FACE_EDGE_SETTLE_TILT_DEGREES;

if (
  hasReachedHardRead &&
  shouldGiveCockedDiceMoreSettleTime &&
  !settledRef.current
) {
   if (shouldRequireTargetMatch && shouldUseSoftTargetPerformance) {
    const currentLinvel = body.linvel();

    body.setLinvel(
      {
x: currentLinvel.x * 0.96,
y: currentLinvel.y * 0.96,
z: currentLinvel.z * 0.96,
      },
      true
    );

    applySoftTargetPerformance({
      body,
      targetAnimal,
      rollAgeMs,
      movementSpeed,
    });

    return;
  }

  const settleDirection = activeDieIndex === 1 ? -1 : 1;

  softenVisibleDiceBody(body);
  body.setAngvel(
    {
      x: 0.42 * settleDirection,
      y: 0.12 * settleDirection,
      z: 0.36 * settleDirection,
    },
    true
  );

  return;
}

const shouldContinueTargetLanding =
  shouldUseSoftTargetPerformance &&
  shouldRequireTargetMatch &&
  hasReachedHardRead &&
  rollAgeMs < TARGET_PERFORMANCE_END_MS &&
  visibleResult.status === "accepted" &&
  visibleResult.label !== targetAnimal;

if (shouldContinueTargetLanding && !settledRef.current) {
  applySoftTargetPerformance({
    body,
    targetAnimal,
    rollAgeMs,
    movementSpeed,
  });

  return;
}

if ((hasStableVisibleFace || hasReachedHardRead) && !settledRef.current) {
const rawCapturedResult = strictReadableResultGate
  ? createStrictReadableVisibleResult(visibleResult)
  : hasStableVisibleFace
    ? visibleResult
    : createNearestVisibleResult(visibleResult);

const capturedResult =
  shouldRequireTargetMatch &&
  rawCapturedResult.status === "accepted" &&
  rawCapturedResult.label !== targetAnimal
    ? {
        ...rawCapturedResult,
        status: "cocked" as const,
        label: "Target Miss",
nearestLabel: rawCapturedResult.label,
message: `Target miss. Expected ${targetAnimal}, visible ${rawCapturedResult.label}.`,
      }
    : rawCapturedResult;

settledRef.current = true;
stillTimeRef.current = 999;

softHoldStartedAtRef.current = performance.now();

softenVisibleDiceBody(body);

const defaultMessage = hasStableVisibleFace
  ? "Stable visible dice face captured and held."
  : "Nearest visible dice face captured and held at performance limit.";

completeTrajectoryRecording({
  body,
  capturedResult,
});

onSettledChange(true);
onFaceResultChange({
  ...capturedResult,
  message: createTargetAwareCaptureMessage({
    targetAnimal,
    capturedResult,
    defaultMessage,
  }),
});

  return;
}

if (movementSpeed < 0.12) {
  stillTimeRef.current += delta;
} else {
  stillTimeRef.current = 0;

  if (settledRef.current) {
    settledRef.current = false;
    onSettledChange(false);
    onFaceResultChange(null);
  }
}

if (stillTimeRef.current > 1.35 && !settledRef.current) {
  settledRef.current = true;

  softHoldStartedAtRef.current = performance.now();
softenVisibleDiceBody(body);

const rawCapturedResult = strictReadableResultGate
  ? createStrictReadableVisibleResult(visibleResult)
  : visibleResult;

const capturedResult =
  shouldRequireTargetMatch &&
  rawCapturedResult.status === "accepted" &&
  rawCapturedResult.label !== targetAnimal
    ? {
        ...rawCapturedResult,
        status: "cocked" as const,
        label: "Target Miss",
nearestLabel: rawCapturedResult.label,
message: `Target miss. Expected ${targetAnimal}, visible ${rawCapturedResult.label}.`,
      }
    : rawCapturedResult;

completeTrajectoryRecording({
  body,
  capturedResult,
});

onSettledChange(true);
onFaceResultChange({
  ...capturedResult,
message: createTargetAwareCaptureMessage({
  targetAnimal,
  capturedResult,
  defaultMessage: "Naturally stopped visible dice face captured and held.",
}),
});
}
  });

const useV1LiveReleaseMaterial =
  useKinematicTrapRelease || hasShadowLaunchRecipe;

  return (
    <RigidBody
      ref={bodyRef}
      key={resetKey}
      colliders={false}
      ccd
position={activeHolderStartPosition}
rotation={activeHolderStartRotation}
restitution={
  useV1LiveReleaseMaterial
    ? DEV_ROLL_DICE_RESTITUTION
    : targetLaunchRecipeEnabled
      ? 0.46
      : 0.62
}
friction={
  useV1LiveReleaseMaterial
    ? DEV_ROLL_DICE_FRICTION
    : targetLaunchRecipeEnabled
      ? 0.3
      : 0.22
}
linearDamping={
  useV1LiveReleaseMaterial
    ? DEV_ROLL_DICE_LINEAR_DAMPING
    : targetLaunchRecipeEnabled
      ? 0.035
      : 0.004
}
angularDamping={
  useV1LiveReleaseMaterial
    ? DEV_ROLL_DICE_ANGULAR_DAMPING
    : targetLaunchRecipeEnabled
      ? 0.055
      : 0.008
}
    >
<RoundCuboidCollider args={collider.args} />

<DiceVisual
  shapePreset={diceShapePreset}
  showFaceLayer={!hideActiveDiceFaces}
  showHiddenFaceSeal={Boolean(hideActiveDiceFaces)}
/>
    </RigidBody>
  );
}

function HumanPOVCameraRig() {
  const { camera, gl } = useThree();

  const leanRef = useRef(0);
  const targetLeanRef = useRef(0);

const topViewRef = useRef(ROOM_CAMERA_DEFAULT_TOP_VIEW);
const targetTopViewRef = useRef(ROOM_CAMERA_DEFAULT_TOP_VIEW);

  const dragStartXRef = useRef<number | null>(null);
  const dragStartYRef = useRef<number | null>(null);
  const dragStartLeanRef = useRef(0);
  const dragStartTopViewRef = useRef(0);

  const cameraPositionRef = useRef(new Vector3());
  const lookTargetRef = useRef(new Vector3());

  useEffect(() => {
    const canvas = gl.domElement;

    function handlePointerDown(event: PointerEvent) {
      if (event.pointerType === "mouse" && event.button !== 0) return;

      dragStartXRef.current = event.clientX;
      dragStartYRef.current = event.clientY;
      dragStartLeanRef.current = targetLeanRef.current;
      dragStartTopViewRef.current = targetTopViewRef.current;

      try {
        canvas.setPointerCapture(event.pointerId);
      } catch {
        // Some browsers can fail pointer capture.
      }
    }

    function handlePointerMove(event: PointerEvent) {
      if (dragStartXRef.current === null || dragStartYRef.current === null) {
        return;
      }

      // Reversed direction: touch/drag feels natural.
      const dragDistanceX =
        (dragStartXRef.current - event.clientX) / window.innerWidth;

      const dragDistanceY =
        (event.clientY - dragStartYRef.current) / window.innerHeight;

      targetLeanRef.current = MathUtils.clamp(
  dragStartLeanRef.current + dragDistanceX * 3.8,
  -1.28,
  1.28
);

            targetTopViewRef.current = MathUtils.clamp(
        dragStartTopViewRef.current + dragDistanceY * 3.4,
        -0.35,
        1.65
      );
    }

    function handlePointerUp(event: PointerEvent) {
      dragStartXRef.current = null;
      dragStartYRef.current = null;

      try {
        canvas.releasePointerCapture(event.pointerId);
      } catch {
        // Safe fallback.
      }
    }

    function handlePointerLeave() {
      dragStartXRef.current = null;
      dragStartYRef.current = null;
    }

    canvas.addEventListener("pointerdown", handlePointerDown);
    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("pointerup", handlePointerUp);
    canvas.addEventListener("pointercancel", handlePointerUp);
    canvas.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      canvas.removeEventListener("pointerdown", handlePointerDown);
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerup", handlePointerUp);
      canvas.removeEventListener("pointercancel", handlePointerUp);
      canvas.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, [gl]);

  useFrame(({ clock }, delta) => {
    const smoothing = 1 - Math.exp(-delta * 7.5);
    const idleBreath = Math.sin(clock.elapsedTime * 0.75) * 0.035;

    leanRef.current = MathUtils.lerp(
      leanRef.current,
      targetLeanRef.current,
      smoothing
    );

    topViewRef.current = MathUtils.lerp(
      topViewRef.current,
      targetTopViewRef.current,
      smoothing
    );

    const lean = leanRef.current;
    const topView = topViewRef.current;

    const sideShift = lean * 1.95;
const lookShift = lean * 0.68;

const forwardShift = Math.abs(lean) * 0.52;
    const heightShift = topView * 1.95;
    const topForwardShift = topView * 1.28;

    cameraPositionRef.current.set(
  sideShift,
  ROOM_CAMERA_BASE_HEIGHT + heightShift + idleBreath,
  ROOM_CAMERA_BASE_DISTANCE - forwardShift - topForwardShift
);

lookTargetRef.current.set(
  lookShift,
  ROOM_CAMERA_LOOK_Y - topView * 0.18 + idleBreath * 0.25,
  ROOM_CAMERA_LOOK_Z - topView * 0.28
);

    camera.position.lerp(cameraPositionRef.current, smoothing);
    camera.lookAt(lookTargetRef.current);
  });

  return null;
}

function DicePhysicsScene({
  resetKey,
  onSettledChange,
  onFaceResultChange,
  debugPhysics,
  testMode,
  activeDieIndex,
  sequenceRunning,
  displayOnly,
  variant,
  diceShapePreset,
  diceColliderPreset,
  mountedDiceRackMode,
  hideActiveDiceFaces,
  showDice = true,
  forceShowStumbleBar = false,
captureRequestKey = 0,
targetAnimal = null,
targetPerformanceEnabled = false,
strictReadableResultGate = false,
targetLaunchRecipeEnabled = false,
recordedTrajectoryFrames = null,
recordedTrajectoryReplayKey = 0,
heldRecordedTrajectoryDice = [],
devPhysicalReleaseEnabled = false,
shadowLaunchRecipe = null,
trajectoryRecorderEnabled = false,
trajectoryRecorderRunNonce = 0,
onTrajectoryRecorderComplete = null,
}: {
  resetKey: number;
  onSettledChange: (settled: boolean) => void;
  onFaceResultChange: (result: DiceFaceResult | null) => void;
  debugPhysics: boolean;
  testMode: TestMode;
  activeDieIndex: number;
  sequenceRunning: boolean;
  displayOnly: boolean;
  variant: StageViewVariant;
  diceShapePreset: DiceShapePreset;
  diceColliderPreset: DiceColliderPreset;
  mountedDiceRackMode: MountedDiceRackMode;
hideActiveDiceFaces?: boolean;
showDice?: boolean;
forceShowStumbleBar?: boolean;
captureRequestKey?: number;
targetAnimal?: DiceAnimalLabel | null;
targetPerformanceEnabled?: boolean;
strictReadableResultGate?: boolean;
targetLaunchRecipeEnabled?: boolean;
recordedTrajectoryFrames?: DiceTrajectoryFrame[] | null;
recordedTrajectoryReplayKey?: number;
heldRecordedTrajectoryDice?: HeldRecordedTrajectoryDice[];
devPhysicalReleaseEnabled?: boolean;
shadowLaunchRecipe?: DiceShadowLaunchRecipe | null;
trajectoryRecorderEnabled?: boolean;
trajectoryRecorderRunNonce?: number;
onTrajectoryRecorderComplete?:
  | ((recording: DiceTrajectoryRecorderComplete) => void)
  | null;
}) {
  const hasShadowLaunchRecipe = Boolean(shadowLaunchRecipe);

  const hasRecordedTrajectory = Boolean(
    !hasShadowLaunchRecipe &&
      recordedTrajectoryFrames &&
      recordedTrajectoryFrames.length > 0
  );

  const shouldRenderRecordedDice =
    !displayOnly && showDice && sequenceRunning && hasRecordedTrajectory;

  const shouldRenderActiveDice =
    !displayOnly && showDice && sequenceRunning && !hasRecordedTrajectory;

    const activeDevPhysicalReleaseEnabled =
  devPhysicalReleaseEnabled && testMode === "trap" && !hasRecordedTrajectory;
  

  return (
    <>
            <ambientLight intensity={0.96} />

      <directionalLight
        position={[3.8, 8.2, 7.8]}
        intensity={1.55}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.00008}
      />

      <pointLight
        position={[-3.4, 3.1, 4.6]}
        intensity={1.38}
        color="#f3c66d"
      />

      <pointLight
        position={[0, 3.15, -1.15]}
        intensity={0.82}
        color="#ffd08a"
      />

            <pointLight
        position={[2.45, 2.25, 2.4]}
        intensity={0.38}
        color="#d59642"
      />

      <pointLight
        position={[-2.45, 2.1, 2.2]}
        intensity={0.32}
        color="#b86f2e"
      />

      <Physics debug={debugPhysics} gravity={PHYSICS_GRAVITY}>
<TrayBox
  testMode={testMode}
  activeDieIndex={activeDieIndex}
  sequenceRunning={sequenceRunning}
  displayOnly={displayOnly}
  diceShapePreset={diceShapePreset}
  mountedDiceRackMode={mountedDiceRackMode}
  showDice={showDice}
  forceShowStumbleBar={forceShowStumbleBar}
devPhysicalReleaseEnabled={activeDevPhysicalReleaseEnabled}
/>

{!displayOnly && showDice
  ? heldRecordedTrajectoryDice.map((heldDice) => (
      <StaticRecordedTrajectoryDice
        key={`held-recorded-die-${heldDice.dieIndex}-${heldDice.replayKey ?? 0}`}
        heldDice={heldDice}
        diceShapePreset={diceShapePreset}
        hideActiveDiceFaces={hideActiveDiceFaces}
      />
    ))
  : null}

{shouldRenderRecordedDice && recordedTrajectoryFrames ? (
<RecordedTrajectoryDice
  frames={recordedTrajectoryFrames}
  replayKey={recordedTrajectoryReplayKey}
  onSettledChange={onSettledChange}
  onFaceResultChange={onFaceResultChange}
  diceShapePreset={diceShapePreset}
  hideActiveDiceFaces={hideActiveDiceFaces}
  activeDieIndex={activeDieIndex}
/>
) : null}

{shouldRenderActiveDice ? (
<DiceCube
  resetKey={resetKey}
  onSettledChange={onSettledChange}
  onFaceResultChange={onFaceResultChange}
  testMode={testMode}
  activeDieIndex={activeDieIndex}
  diceShapePreset={diceShapePreset}
  diceColliderPreset={diceColliderPreset}
  hideActiveDiceFaces={hideActiveDiceFaces}
  captureRequestKey={captureRequestKey}
  targetAnimal={targetAnimal}
  targetPerformanceEnabled={targetPerformanceEnabled}
  strictReadableResultGate={strictReadableResultGate}
  targetLaunchRecipeEnabled={targetLaunchRecipeEnabled}
  devPhysicalReleaseEnabled={activeDevPhysicalReleaseEnabled}
  shadowLaunchRecipe={shadowLaunchRecipe}
  trajectoryRecorderEnabled={trajectoryRecorderEnabled}
  trajectoryRecorderRunNonce={trajectoryRecorderRunNonce}
  onTrajectoryRecorderComplete={onTrajectoryRecorderComplete}
/>
) : null}
      </Physics>

{variant === "room" ? (
  <HumanPOVCameraRig />
) : (
  <OrbitControls
    enablePan={false}
    enableRotate
    enableZoom
    enableDamping
    dampingFactor={0.08}
    rotateSpeed={0.65}
    target={[0, 0, 0]}
    minDistance={5}
    maxDistance={9}
  />
)}
    </>
  );
}

export default function ThreeDicePhysicsStage({
  resetKey,
  onSettledChange,
  onFaceResultChange,
  debugPhysics,
  testMode,
  activeDieIndex,
  sequenceRunning,
  displayOnly = false,
  variant = "lab",
  diceShapePreset = "current",
  diceColliderPreset = "current",
  mountedDiceRackMode,
  hideActiveDiceFaces = false,
  showDice = true,
  forceShowStumbleBar = false,
captureRequestKey = 0,
targetAnimal = null,
targetPerformanceEnabled = false,
strictReadableResultGate = false,
targetLaunchRecipeEnabled = false,
recordedTrajectoryFrames = null,
recordedTrajectoryReplayKey = 0,
heldRecordedTrajectoryDice = [],
enableV1PhysicalRelease = false,
shadowLaunchRecipe = null,
trajectoryRecorderEnabled = false,
trajectoryRecorderRunNonce = 0,
onTrajectoryRecorderComplete = null,
}: {
  resetKey: number;
  onSettledChange: (settled: boolean) => void;
  onFaceResultChange: (result: DiceFaceResult | null) => void;
  debugPhysics: boolean;
  testMode: TestMode;
  activeDieIndex: number;
  sequenceRunning: boolean;
  displayOnly?: boolean;
  variant?: StageViewVariant;
  diceShapePreset?: DiceShapePreset;
  diceColliderPreset?: DiceColliderPreset;
  mountedDiceRackMode?: MountedDiceRackMode;
hideActiveDiceFaces?: boolean;
showDice?: boolean;
forceShowStumbleBar?: boolean;
captureRequestKey?: number;
targetAnimal?: DiceAnimalLabel | null;
targetPerformanceEnabled?: boolean;
strictReadableResultGate?: boolean;
targetLaunchRecipeEnabled?: boolean;
recordedTrajectoryFrames?: DiceTrajectoryFrame[] | null;
recordedTrajectoryReplayKey?: number;
heldRecordedTrajectoryDice?: HeldRecordedTrajectoryDice[];
enableV1PhysicalRelease?: boolean;
shadowLaunchRecipe?: DiceShadowLaunchRecipe | null;
trajectoryRecorderEnabled?: boolean;
trajectoryRecorderRunNonce?: number;
onTrajectoryRecorderComplete?:
  | ((recording: DiceTrajectoryRecorderComplete) => void)
  | null;
}) {
const effectiveDiceShapePreset: DiceShapePreset =
  variant === "lab" ? diceShapePreset : PRODUCTION_DICE_SHAPE_PRESET;

const effectiveDiceColliderPreset: DiceColliderPreset =
  variant === "lab" ? diceColliderPreset : PRODUCTION_DICE_COLLIDER_PRESET;
  
const effectiveMountedDiceRackMode: MountedDiceRackMode =
  mountedDiceRackMode ?? (displayOnly ? "ready" : "sequence");

const cameraConfig =
  variant === "room"
    ? {
        position: [0, 5.6, 10.6] as [number, number, number],
        fov: 45,
      }
    : { position: [3.8, 3.75, 8.1] as [number, number, number], fov: 43 };

const devPhysicalReleaseEnabled =
  testMode === "trap" && (variant === "lab" || enableV1PhysicalRelease);

return (
<Canvas
  shadows
  dpr={[1, 1.5]}
  camera={cameraConfig}
  gl={{
    antialias: true,
    powerPreference: "high-performance",
    alpha: true,
  }}
  style={{
    touchAction: variant === "room" ? "none" : "auto",
    background: "transparent",
  }}
>
<DicePhysicsScene
  resetKey={resetKey}
  onSettledChange={onSettledChange}
  onFaceResultChange={onFaceResultChange}
  debugPhysics={debugPhysics}
  testMode={testMode}
  activeDieIndex={activeDieIndex}
  sequenceRunning={sequenceRunning}
  displayOnly={displayOnly}
  variant={variant}
  diceShapePreset={effectiveDiceShapePreset}
  diceColliderPreset={effectiveDiceColliderPreset}
  mountedDiceRackMode={effectiveMountedDiceRackMode}
  hideActiveDiceFaces={hideActiveDiceFaces}
  showDice={showDice}
  forceShowStumbleBar={forceShowStumbleBar}
  captureRequestKey={captureRequestKey}
  targetAnimal={targetAnimal}
  targetPerformanceEnabled={targetPerformanceEnabled}
  strictReadableResultGate={strictReadableResultGate}
  targetLaunchRecipeEnabled={targetLaunchRecipeEnabled}
recordedTrajectoryFrames={recordedTrajectoryFrames}
recordedTrajectoryReplayKey={recordedTrajectoryReplayKey}
heldRecordedTrajectoryDice={heldRecordedTrajectoryDice}
devPhysicalReleaseEnabled={devPhysicalReleaseEnabled}
  shadowLaunchRecipe={shadowLaunchRecipe}
  trajectoryRecorderEnabled={trajectoryRecorderEnabled}
  trajectoryRecorderRunNonce={trajectoryRecorderRunNonce}
  onTrajectoryRecorderComplete={onTrajectoryRecorderComplete}
/>
    </Canvas>
  );
}
