// src/components/games/six-animal/ThreeDicePhysicsStage.tsx

"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, RoundedBox, Text, useTexture } from "@react-three/drei";
import { Euler, MathUtils, Quaternion, Vector3, type Group } from "three";
import {
  CuboidCollider,
  Physics,
  RigidBody,
  RoundCuboidCollider,
  type RapierRigidBody,
} from "@react-three/rapier";
import { naganiAssets } from "../../../lib/naganiAssets";
import {
  DICE_HOLDER_X_POSITIONS,
  DISPLAY_DICE_ROTATIONS,
  PHYSICS_GRAVITY,
  PRODUCTION_DICE_COLLIDER_PRESET,
  PRODUCTION_DICE_SHAPE_PRESET,
  TABLE_DEFLECTOR_FRICTION,
  TABLE_DEFLECTOR_RESTITUTION,
  TABLE_DEFLECTOR_SHOULDER_FRICTION,
  TABLE_DEFLECTOR_SHOULDER_RESTITUTION,
  TABLE_FRONT_COLLIDER_HEIGHT,
  TABLE_FRONT_KEEPER_FRICTION,
  TABLE_FRONT_KEEPER_RESTITUTION,
  TABLE_FRONT_REBOUND_FRICTION,
  TABLE_FRONT_REBOUND_RESTITUTION,
  TABLE_FRONT_VISUAL_LIP_HEIGHT,
  TABLE_SAFETY_FRONT_FRICTION,
  TABLE_SAFETY_FRONT_RESTITUTION,
  TABLE_SAFETY_SIDE_FRICTION,
  TABLE_SAFETY_SIDE_RESTITUTION,
  TABLE_SIDE_RAIL_FRICTION,
  TABLE_SIDE_RAIL_RESTITUTION,
  VALID_FACE_SCORE_THRESHOLD,
  createTableMeasurements,
  diceFaceCandidates,
  getDiceColliderConfig,
  getDiceShapeConfig,
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
  type DiceFaceCandidate,
  type DiceShapePreset,
  type TableMeasurements,
  type DiceLaunchVelocity,
  getTargetLaunchRecipeProfile,
  getTargetLaunchSeed,  
} from "./physics/physicsConstants";
import type {
  DiceShadowLaunchRecipe,
  DiceShadowMotionMetrics,
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

export type DiceFaceResult = {
  status: "accepted" | "cocked";
  label: string;
  nearestLabel: string;
  axis: string;
  confidence: number;
  tiltDegrees: number;
  message: string;
};

export type CapturedDiceResult = DiceFaceResult & {
  dieNumber: number;
};

export type ThreeDiceRoundPayload = {
  status: "idle" | "running" | "complete";
  source: "visible-physical-dice";
  results: DiceAnimalLabel[];
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

const TARGET_CORRECTION_ENABLED = false;
const TARGET_CORRECTION_MIN_SPEED = 0.18;
const TARGET_CORRECTION_MAX_TILT_DEGREES = 35;
const ACCEPTED_RESULT_MESSAGE = "Top face accepted and captured.";
const COCKED_RESULT_MESSAGE =
  "Dice stopped at an unreadable angle. Result not accepted.";

const VISIBLE_FACE_CAPTURE_MIN_ROLL_MS = 6200;
const RECORDED_TRAJECTORY_REPLAY_TIME_SCALE = 1.35;
const VISIBLE_FACE_CAPTURE_STABLE_SECONDS = 0.42;
const VISIBLE_FACE_CAPTURE_SPEED = 1.05;
const VISIBLE_FACE_HARD_READ_MS = 9800;
const VISIBLE_FACE_EDGE_SETTLE_LIMIT_MS = 11200;
const TARGET_PERFORMANCE_START_MS = 7200;
const TARGET_PERFORMANCE_FULL_MS = 9800;
const TARGET_PERFORMANCE_END_MS = 11600;
const VISIBLE_FACE_EDGE_SETTLE_TILT_DEGREES = 32;
const STRICT_READABLE_RESULT_CONFIDENCE = 82;
const STRICT_READABLE_RESULT_MAX_TILT_DEGREES = 35;

const USE_DICE_FACE_TEXTURES = true;
const SHOW_DICE_FACE_TEXT_LABELS = false;

const DICE_FACE_ASSET_BASE = naganiAssets.sixAnimal.dice.faces.base;

const DICE_FACE_SURFACE_OFFSET = 0.553;
const DICE_FACE_PRINT_SIZE = 0.78;
const DICE_FACE_PRINT_ALPHA_TEST = 0.052;
const DICE_FACE_PRINT_OPACITY = 0.94;
const DICE_FACE_PRINT_WARM_TINT = "#f0d9a3";

const DICE_BODY_COLOR = "#ead7a3";
const DICE_BODY_ROUGHNESS = 0.52;
const DICE_BODY_METALNESS = 0.018;

const DICE_FACE_PLANE_ROUGHNESS = 0.78;
const DICE_FACE_PLANE_METALNESS = 0;

const HIDDEN_DICE_FACE_SIZE = 0.68;
const HIDDEN_DICE_FACE_COLOR = "#3a0908";
const HIDDEN_DICE_FACE_GOLD = "#c89f47";
const HIDDEN_DICE_FACE_SHADOW = "#120102";
const HIDDEN_DICE_FACE_OPACITY = 0.82;
const HIDDEN_DICE_FACE_SURFACE_OFFSET = DICE_FACE_SURFACE_OFFSET + 0.006;

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

type DiceMaterialToken = {
  color: string;
  roughness: number;
  metalness?: number;
  emissive?: string;
  emissiveIntensity?: number;
  clearcoat?: number;
  clearcoatRoughness?: number;
};

const DICE_MATERIALS = {
  ivoryBody: {
    color: DICE_BODY_COLOR,
    roughness: DICE_BODY_ROUGHNESS,
    metalness: DICE_BODY_METALNESS,
    emissive: "#241405",
    emissiveIntensity: 0.04,
    clearcoat: 0.28,
    clearcoatRoughness: 0.64,
  },
} satisfies Record<string, DiceMaterialToken>;

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

export function getDiceFaceCandidateByLabel(
  targetAnimal: DiceAnimalLabel
): DiceFaceCandidate | null {
  return (
    diceFaceCandidates.find((candidate) => candidate.label === targetAnimal) ??
    null
  );
}

export function getDiceFaceDirectionByLabel(
  targetAnimal: DiceAnimalLabel
): Vector3 | null {
  const candidate = getDiceFaceCandidateByLabel(targetAnimal);

  return candidate ? candidate.direction.clone() : null;
}

export function createTargetTopFaceQuaternion(
  targetAnimal: DiceAnimalLabel
): Quaternion | null {
  const targetDirection = getDiceFaceDirectionByLabel(targetAnimal);

  if (!targetDirection) {
    return null;
  }

  return new Quaternion()
    .setFromUnitVectors(targetDirection.normalize(), worldUp.clone().normalize())
    .normalize();
}

export function getTargetTopFaceDebugInfo(targetAnimal: DiceAnimalLabel) {
  const candidate = getDiceFaceCandidateByLabel(targetAnimal);
  const targetQuaternion = createTargetTopFaceQuaternion(targetAnimal);

  if (!candidate || !targetQuaternion) {
    return null;
  }

  return {
    targetAnimal,
    targetAxis: candidate.axis,
    quaternion: {
      x: targetQuaternion.x,
      y: targetQuaternion.y,
      z: targetQuaternion.z,
      w: targetQuaternion.w,
    },
  };
}

export function getTargetCorrectionSafetyConfig() {
  return {
    enabled: TARGET_CORRECTION_ENABLED,
    minSpeed: TARGET_CORRECTION_MIN_SPEED,
    maxTiltDegrees: TARGET_CORRECTION_MAX_TILT_DEGREES,
    note: TARGET_CORRECTION_ENABLED
      ? "Target correction flag is enabled for dev testing."
      : "Target correction is locked OFF. Dice result still comes from physical detection.",
  };
}

type TargetCorrectionReadinessInput = {
  movementSpeed: number;
  tiltDegrees: number;
  hasTarget: boolean;
};

export function getTargetCorrectionReadiness({
  movementSpeed,
  tiltDegrees,
  hasTarget,
}: TargetCorrectionReadinessInput) {
  if (!TARGET_CORRECTION_ENABLED) {
    return {
      ready: false,
      reason: "Target correction is locked OFF.",
    };
  }

  if (!hasTarget) {
    return {
      ready: false,
      reason: "No target animal is available.",
    };
  }

  if (movementSpeed > TARGET_CORRECTION_MIN_SPEED) {
    return {
      ready: false,
      reason: "Dice is still moving too fast for safe correction.",
    };
  }

  if (tiltDegrees > TARGET_CORRECTION_MAX_TILT_DEGREES) {
    return {
      ready: false,
      reason: "Dice tilt is too high for subtle correction.",
    };
  }

  return {
    ready: true,
    reason: "Dice is inside the safe correction window.",
  };
}

type TargetResultValidationInput = {
  targetAnimal?: DiceAnimalLabel | null;
  faceResult?: DiceFaceResult | null;
};

export function getTargetResultValidation({
  targetAnimal,
  faceResult,
}: TargetResultValidationInput) {
  if (!targetAnimal) {
    return {
      accepted: false,
      status: "missing-target",
      message: "No target animal is available for validation.",
    };
  }

  if (!faceResult) {
    return {
      accepted: false,
      status: "waiting",
      message: "Waiting for visible dice result before validation.",
    };
  }

  if (faceResult.status !== "accepted") {
    return {
      accepted: false,
      status: "invalid-visible-result",
      message: "Visible dice result is cocked or unreadable.",
      targetAnimal,
      detectedAnimal: faceResult.nearestLabel,
    };
  }

  if (faceResult.label !== targetAnimal) {
    return {
      accepted: false,
      status: "target-mismatch",
      message: "Visible dice face does not match the selected target.",
      targetAnimal,
      detectedAnimal: faceResult.label,
      confidence: faceResult.confidence,
      tiltDegrees: faceResult.tiltDegrees,
    };
  }

  return {
    accepted: true,
    status: "target-matched",
    message: "Visible dice face matches the selected target.",
    targetAnimal,
    detectedAnimal: faceResult.label,
    confidence: faceResult.confidence,
    tiltDegrees: faceResult.tiltDegrees,
  };
}

export function getTargetResultCaptureSummary({
  targetAnimal,
  faceResult,
}: TargetResultValidationInput) {
  const validation = getTargetResultValidation({
    targetAnimal,
    faceResult,
  });

  const visibleAnimal =
    faceResult?.status === "accepted"
      ? faceResult.label
      : faceResult?.nearestLabel ?? null;

  return {
    safeForBackendTargetCapture: validation.accepted,
    canCaptureVisiblePhysicalResult: faceResult?.status === "accepted",
    targetAnimal: targetAnimal ?? null,
    visibleAnimal,
    validationStatus: validation.status,
    validationMessage: validation.message,
    confidence: faceResult?.confidence ?? null,
    tiltDegrees: faceResult?.tiltDegrees ?? null,
    captureRule: validation.accepted
      ? "Target and visible dice match. Safe for future backend target capture."
      : "Do not use target result. Use visible physical result or continue/reroll animation.",
  };
}

type DiceFaceVisual = {
  key: string;
  label: DiceAnimalLabel;
  assetPath: string;
  position: [number, number, number];
  rotation: [number, number, number];
};

const diceFaceVisuals: DiceFaceVisual[] = [
  {
    key: "face-top-tiger",
    label: "Tiger",
    assetPath: `${DICE_FACE_ASSET_BASE}/dice-face-tiger-v1.png`,
    position: [0, DICE_FACE_SURFACE_OFFSET, 0],
    rotation: [-Math.PI / 2, 0, 0],
  },
  {
    key: "face-bottom-dragon",
    label: "Dragon",
    assetPath: `${DICE_FACE_ASSET_BASE}/dice-face-dragon-v1.png`,
    position: [0, -DICE_FACE_SURFACE_OFFSET, 0],
    rotation: [Math.PI / 2, 0, 0],
  },
  {
    key: "face-right-rooster",
    label: "Rooster",
    assetPath: `${DICE_FACE_ASSET_BASE}/dice-face-rooster-v1.png`,
    position: [DICE_FACE_SURFACE_OFFSET, 0, 0],
    rotation: [0, Math.PI / 2, 0],
  },
  {
    key: "face-left-fish",
    label: "Fish",
    assetPath: `${DICE_FACE_ASSET_BASE}/dice-face-fish-v1.png`,
    position: [-DICE_FACE_SURFACE_OFFSET, 0, 0],
    rotation: [0, -Math.PI / 2, 0],
  },
  {
    key: "face-front-crab",
    label: "Crab",
    assetPath: `${DICE_FACE_ASSET_BASE}/dice-face-crab-v1.png`,
    position: [0, 0, DICE_FACE_SURFACE_OFFSET],
    rotation: [0, 0, 0],
  },
  {
    key: "face-back-elephant",
    label: "Elephant",
    assetPath: `${DICE_FACE_ASSET_BASE}/dice-face-elephant-v1.png`,
    position: [0, 0, -DICE_FACE_SURFACE_OFFSET],
    rotation: [0, Math.PI, 0],
  },
];

function detectTopDiceFace(rotation: {
  x: number;
  y: number;
  z: number;
  w: number;
}): DiceFaceResult {
  const quaternion = new Quaternion(rotation.x, rotation.y, rotation.z, rotation.w);

  let best = diceFaceCandidates[0];
  let bestScore = -Infinity;

  for (const candidate of diceFaceCandidates) {
    const worldDirection = candidate.direction
      .clone()
      .applyQuaternion(quaternion)
      .normalize();

    const score = worldDirection.dot(worldUp);

    if (score > bestScore) {
      best = candidate;
      bestScore = score;
    }
  }

  const clampedScore = Math.min(1, Math.max(-1, bestScore));
  const confidence = Math.round(Math.max(0, clampedScore) * 100);
  const tiltDegrees = Math.round((Math.acos(clampedScore) * 180) / Math.PI);
  const isAccepted = clampedScore >= VALID_FACE_SCORE_THRESHOLD;

  return {
    status: isAccepted ? "accepted" : "cocked",
    label: isAccepted ? best.label : "Cocked / Reroll",
    nearestLabel: best.label,
    axis: best.axis,
    confidence,
    tiltDegrees,
    message: isAccepted ? ACCEPTED_RESULT_MESSAGE : COCKED_RESULT_MESSAGE,
  };
}

function DiceFaceLabels() {
  return (
    <>
      {diceFaceVisuals.map((face) => (
        <Text
          key={face.key}
          position={face.position}
          rotation={face.rotation}
          fontSize={0.16}
          maxWidth={0.82}
          textAlign="center"
          anchorX="center"
          anchorY="middle"
          color="#3b0a0a"
          outlineWidth={0.01}
          outlineColor="#f8e89a"
        >
          {face.label}
        </Text>
      ))}
    </>
  );
}

// Animal texture planes sit just above each dice face.
// Keep this layer very thin: it is visual only and must not affect physics.
function DiceFaceTexturePlane({ face }: { face: DiceFaceVisual }) {
  const texture = useTexture(face.assetPath);

  return (
    <mesh position={face.position} rotation={face.rotation} renderOrder={2}>
      <planeGeometry args={[DICE_FACE_PRINT_SIZE, DICE_FACE_PRINT_SIZE]} />
<meshStandardMaterial
  map={texture}
  color={DICE_FACE_PRINT_WARM_TINT}
  transparent
  opacity={DICE_FACE_PRINT_OPACITY}
  alphaTest={DICE_FACE_PRINT_ALPHA_TEST}
  roughness={DICE_FACE_PLANE_ROUGHNESS}
  metalness={DICE_FACE_PLANE_METALNESS}
  toneMapped={false}
  polygonOffset
  polygonOffsetFactor={-1}
  polygonOffsetUnits={-1}
/>
    </mesh>
  );
}

function DiceFaceTexturePlanes() {
  return (
    <>
      {diceFaceVisuals.map((face) => (
        <DiceFaceTexturePlane key={`texture-${face.key}`} face={face} />
      ))}
    </>
  );
}

function DiceFaceLayer() {
  return (
    <>
      {USE_DICE_FACE_TEXTURES ? <DiceFaceTexturePlanes /> : null}
      {SHOW_DICE_FACE_TEXT_LABELS ? <DiceFaceLabels /> : null}
    </>
  );
}

function getHiddenDiceFacePosition(
  position: [number, number, number]
): [number, number, number] {
  return [
    position[0] === 0 ? 0 : Math.sign(position[0]) * HIDDEN_DICE_FACE_SURFACE_OFFSET,
    position[1] === 0 ? 0 : Math.sign(position[1]) * HIDDEN_DICE_FACE_SURFACE_OFFSET,
    position[2] === 0 ? 0 : Math.sign(position[2]) * HIDDEN_DICE_FACE_SURFACE_OFFSET,
  ];
}

function HiddenDiceFaceSeal({ face }: { face: DiceFaceVisual }) {
  return (
    <group
      position={getHiddenDiceFacePosition(face.position)}
      rotation={face.rotation}
    >
      <mesh renderOrder={2}>
        <planeGeometry args={[HIDDEN_DICE_FACE_SIZE, HIDDEN_DICE_FACE_SIZE]} />
        <meshStandardMaterial
          color={HIDDEN_DICE_FACE_COLOR}
          transparent
          opacity={HIDDEN_DICE_FACE_OPACITY}
          roughness={0.72}
          metalness={0.08}
          polygonOffset
          polygonOffsetFactor={-1}
          polygonOffsetUnits={-1}
        />
      </mesh>

      <mesh position={[0, 0, 0.003]} renderOrder={3}>
        <planeGeometry args={[HIDDEN_DICE_FACE_SIZE * 0.72, 0.045]} />
        <meshStandardMaterial
          color={HIDDEN_DICE_FACE_GOLD}
          roughness={0.42}
          metalness={0.5}
          polygonOffset
          polygonOffsetFactor={-2}
          polygonOffsetUnits={-2}
        />
      </mesh>

      <mesh position={[0, 0.14, 0.004]} rotation={[0, 0, Math.PI / 4]} renderOrder={3}>
        <planeGeometry args={[0.14, 0.14]} />
        <meshStandardMaterial
          color={HIDDEN_DICE_FACE_GOLD}
          roughness={0.46}
          metalness={0.46}
          polygonOffset
          polygonOffsetFactor={-2}
          polygonOffsetUnits={-2}
        />
      </mesh>

      <mesh position={[0, -0.14, 0.002]} renderOrder={2}>
        <planeGeometry args={[HIDDEN_DICE_FACE_SIZE * 0.58, 0.035]} />
        <meshStandardMaterial
          color={HIDDEN_DICE_FACE_SHADOW}
          transparent
          opacity={0.48}
          roughness={0.9}
          polygonOffset
          polygonOffsetFactor={-1}
          polygonOffsetUnits={-1}
        />
      </mesh>
    </group>
  );
}

function HiddenDiceFaceLayer() {
  return (
    <>
      {diceFaceVisuals.map((face) => (
        <HiddenDiceFaceSeal key={`hidden-${face.key}`} face={face} />
      ))}
    </>
  );
}

function DiceVisual({
  shapePreset = "current",
  showFaceLayer = true,
  showHiddenFaceSeal = false,
}: {
  shapePreset?: DiceShapePreset;
  showFaceLayer?: boolean;
  showHiddenFaceSeal?: boolean;
}) {
  const shape = getDiceShapeConfig(shapePreset);

  return (
    <>
      <RoundedBox
        args={[shape.size, shape.size, shape.size]}
        radius={shape.cornerRadius}
        smoothness={shape.smoothness}
        castShadow
      >
        <meshPhysicalMaterial {...DICE_MATERIALS.ivoryBody} />
      </RoundedBox>

      {showFaceLayer ? <DiceFaceLayer /> : null}
      {!showFaceLayer && showHiddenFaceSeal ? <HiddenDiceFaceLayer /> : null}
    </>
  );
}

function getRecordedTrajectoryFramePair(
  frames: DiceTrajectoryFrame[],
  elapsedSeconds: number
) {
  if (frames.length <= 1) {
    const onlyFrame = frames[0];

    return {
      previousFrame: onlyFrame,
      nextFrame: onlyFrame,
      alpha: 1,
    };
  }

  for (let index = 1; index < frames.length; index += 1) {
    const nextFrame = frames[index];

    if (elapsedSeconds <= nextFrame.t) {
      const previousFrame = frames[index - 1];
      const duration = Math.max(0.001, nextFrame.t - previousFrame.t);

      return {
        previousFrame,
        nextFrame,
        alpha: MathUtils.clamp(
          (elapsedSeconds - previousFrame.t) / duration,
          0,
          1
        ),
      };
    }
  }

  const lastFrame = frames[frames.length - 1];

  return {
    previousFrame: lastFrame,
    nextFrame: lastFrame,
    alpha: 1,
  };
}

type RecordedReadableCapture = {
  t: number;
  result: DiceFaceResult;
};

function getRecordedFrameMotionScore({
  previousFrame,
  currentFrame,
}: {
  previousFrame: DiceTrajectoryFrame;
  currentFrame: DiceTrajectoryFrame;
}) {
  const dt = Math.max(0.001, currentFrame.t - previousFrame.t);

  const previousPosition = new Vector3(...previousFrame.position);
  const currentPosition = new Vector3(...currentFrame.position);
  const positionSpeed = currentPosition.distanceTo(previousPosition) / dt;

  const previousQuaternion = new Quaternion(
    previousFrame.rotation[0],
    previousFrame.rotation[1],
    previousFrame.rotation[2],
    previousFrame.rotation[3]
  ).normalize();

  const currentQuaternion = new Quaternion(
    currentFrame.rotation[0],
    currentFrame.rotation[1],
    currentFrame.rotation[2],
    currentFrame.rotation[3]
  ).normalize();

  const rotationSpeed = previousQuaternion.angleTo(currentQuaternion) / dt;

  return positionSpeed + rotationSpeed * 0.18;
}

function roundRecorderNumber(value: number, decimals: number) {
  const scale = 10 ** decimals;
  return Math.round(value * scale) / scale;
}

function seededUnit(seed: number) {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
}

function seededRange(seed: number, min: number, max: number) {
  return min + (max - min) * seededUnit(seed);
}

function createV1RecordedMotionMetrics(
  frames: DiceTrajectoryFrame[]
): DiceShadowMotionMetrics {
  if (frames.length < 2) {
    return {
      activeSeconds: 0,
      visualActiveSeconds: 0,
      deadSlideSeconds: 0,
      deflectorBounceScore: 0,
      directionChangeCount: 0,
      directionChangeRadians: 0,
      finalSettleScore: 0,
      firstImpactScore: 0,
      frontStopRisk: 1,
      horizontalTravel: 0,
      lateTumbleScore: 0,
      lateTumbleTurns: 0,
      lateralTravel: 0,
      straightness: 1,
      totalTravel: 0,
      tumbleTurns: 0,
    };
  }

  const table = createTableMeasurements();
  const firstFrame = frames[0];
  const lastFrame = frames[frames.length - 1];

  let totalTravel = 0;
  let horizontalTravel = 0;
  let lateralTravel = 0;
  let tumbleRadians = 0;
  let lateTumbleRadians = 0;
  let deadSlideSeconds = 0;
  let directionChangeCount = 0;
  let directionChangeRadians = 0;
  let firstImpactScore = 0;
  let deflectorBounceScore = 0;

  let previousHorizontalDirection: Vector3 | null = null;

  const deflectorZ = table.backWallZ + 0.78;
  const lateStartT = lastFrame.t * 0.58;

  for (let index = 1; index < frames.length; index += 1) {
    const previousFrame = frames[index - 1];
    const currentFrame = frames[index];
    const dt = Math.max(0.001, currentFrame.t - previousFrame.t);

    const previousPosition = new Vector3(...previousFrame.position);
    const currentPosition = new Vector3(...currentFrame.position);
    const deltaPosition = currentPosition.clone().sub(previousPosition);

    const horizontalDelta = new Vector3(deltaPosition.x, 0, deltaPosition.z);
    const horizontalDistance = horizontalDelta.length();

    totalTravel += deltaPosition.length();
    horizontalTravel += horizontalDistance;
    lateralTravel += Math.abs(deltaPosition.x);

    const previousQuaternion = new Quaternion(
      previousFrame.rotation[0],
      previousFrame.rotation[1],
      previousFrame.rotation[2],
      previousFrame.rotation[3]
    ).normalize();

    const currentQuaternion = new Quaternion(
      currentFrame.rotation[0],
      currentFrame.rotation[1],
      currentFrame.rotation[2],
      currentFrame.rotation[3]
    ).normalize();

    const rotationDelta = previousQuaternion.angleTo(currentQuaternion);
    tumbleRadians += rotationDelta;

    if (currentFrame.t >= lateStartT) {
      lateTumbleRadians += rotationDelta;
    }

    const horizontalSpeed = horizontalDistance / dt;
    const rotationSpeed = rotationDelta / dt;

    if (horizontalSpeed > 0.18 && rotationSpeed < 0.42) {
      deadSlideSeconds += dt;
    }

    if (horizontalDistance > 0.012) {
      const currentHorizontalDirection = horizontalDelta.normalize();

      if (previousHorizontalDirection) {
        const directionAngle =
          previousHorizontalDirection.angleTo(currentHorizontalDirection);

        if (directionAngle > 0.42) {
          directionChangeCount += 1;
          directionChangeRadians += directionAngle;
        }
      }

      previousHorizontalDirection = currentHorizontalDirection.clone();
    }

    const isNearDeflector =
      Math.abs(currentFrame.position[2] - deflectorZ) <= 0.28 &&
      currentFrame.position[1] <= 1.15;

    if (isNearDeflector && rotationSpeed > 1.1) {
      deflectorBounceScore = Math.max(
        deflectorBounceScore,
        Math.min(1, rotationSpeed / 8)
      );
    }

    if (currentFrame.t <= 1.35) {
      firstImpactScore = Math.max(
        firstImpactScore,
        Math.min(1, Math.abs(deltaPosition.y) / Math.max(0.001, dt) / 5)
      );
    }
  }

  const directHorizontalTravel = new Vector3(
    lastFrame.position[0] - firstFrame.position[0],
    0,
    lastFrame.position[2] - firstFrame.position[2]
  ).length();

  const straightness =
    horizontalTravel > 0.001
      ? Math.min(1, directHorizontalTravel / horizontalTravel)
      : 1;

  const finalWindow = frames.slice(Math.max(0, frames.length - 8));
  let finalMotionScore = 0;

  for (let index = 1; index < finalWindow.length; index += 1) {
    finalMotionScore += getRecordedFrameMotionScore({
      previousFrame: finalWindow[index - 1],
      currentFrame: finalWindow[index],
    });
  }

  const averageFinalMotion =
    finalWindow.length > 1 ? finalMotionScore / (finalWindow.length - 1) : 999;

  const finalSettleScore = MathUtils.clamp(
    1 - averageFinalMotion / 1.25,
    0,
    1
  );

  const frontDistance = Math.abs(lastFrame.position[2] - table.frontEdgeZ);
  const frontStopRisk = MathUtils.clamp(1 - frontDistance / 1.4, 0, 1);

  const tumbleTurns = tumbleRadians / (Math.PI * 2);
  const lateTumbleTurns = lateTumbleRadians / (Math.PI * 2);

  return {
    activeSeconds: roundRecorderNumber(lastFrame.t, 2),
    visualActiveSeconds: roundRecorderNumber(lastFrame.t, 2),
    deadSlideSeconds: roundRecorderNumber(deadSlideSeconds, 2),
    deflectorBounceScore: roundRecorderNumber(deflectorBounceScore, 2),
    directionChangeCount,
    directionChangeRadians: roundRecorderNumber(directionChangeRadians, 2),
    finalSettleScore: roundRecorderNumber(finalSettleScore, 2),
    firstImpactScore: roundRecorderNumber(firstImpactScore, 2),
    frontStopRisk: roundRecorderNumber(frontStopRisk, 2),
    horizontalTravel: roundRecorderNumber(horizontalTravel, 2),
    lateTumbleScore: roundRecorderNumber(
      MathUtils.clamp(lateTumbleTurns / 0.65, 0, 1),
      2
    ),
    lateTumbleTurns: roundRecorderNumber(lateTumbleTurns, 2),
    lateralTravel: roundRecorderNumber(lateralTravel, 2),
    straightness: roundRecorderNumber(straightness, 2),
    totalTravel: roundRecorderNumber(totalTravel, 2),
    tumbleTurns: roundRecorderNumber(tumbleTurns, 2),
  };
}

function getRecordedTrajectoryReadableCapture(
  frames: DiceTrajectoryFrame[]
): RecordedReadableCapture | null {
  if (frames.length < 4) return null;

  let stableFaceKey: string | null = null;
  let stableSeconds = 0;
  let bestReadable: RecordedReadableCapture | null = null;

  for (let index = 1; index < frames.length; index += 1) {
    const previousFrame = frames[index - 1];
    const currentFrame = frames[index];
    const dt = Math.max(0.001, currentFrame.t - previousFrame.t);

    const result = detectTopDiceFace({
      x: currentFrame.rotation[0],
      y: currentFrame.rotation[1],
      z: currentFrame.rotation[2],
      w: currentFrame.rotation[3],
    });

    const motionScore = getRecordedFrameMotionScore({
      previousFrame,
      currentFrame,
    });

    const faceKey =
      result.status === "accepted" ? `${result.label}:${result.axis}` : null;

    const isReadable =
      currentFrame.t >= 1.2 &&
      result.status === "accepted" &&
      result.confidence >= STRICT_READABLE_RESULT_CONFIDENCE &&
      result.tiltDegrees <= STRICT_READABLE_RESULT_MAX_TILT_DEGREES &&
      motionScore <= 1.15;

    if (isReadable && faceKey) {
      if (stableFaceKey === faceKey) {
        stableSeconds += dt;
      } else {
        stableFaceKey = faceKey;
        stableSeconds = 0;
      }

      bestReadable = {
        t: currentFrame.t,
        result,
      };

      if (stableSeconds >= 0.28) {
        return {
          t: currentFrame.t,
          result: {
            ...result,
            message: `Recorded trajectory face readable at ${currentFrame.t.toFixed(
              1
            )}s.`,
          },
        };
      }
    } else {
      stableFaceKey = null;
      stableSeconds = 0;
    }
  }

  return bestReadable
    ? {
        t: bestReadable.t,
        result: {
          ...bestReadable.result,
          message: `Recorded trajectory face readable near ${bestReadable.t.toFixed(
            1
          )}s.`,
        },
      }
    : null;
}

function RecordedTrajectoryDice({
  frames,
  replayKey,
  onSettledChange,
  onFaceResultChange,
  diceShapePreset,
  hideActiveDiceFaces = false,
  activeDieIndex,
}: {
  frames: DiceTrajectoryFrame[];
  replayKey: number;
  onSettledChange: (settled: boolean) => void;
  onFaceResultChange: (result: DiceFaceResult | null) => void;
  diceShapePreset: DiceShapePreset;
  hideActiveDiceFaces?: boolean;
  activeDieIndex: number;
}) {
  const groupRef = useRef<Group | null>(null);
  const replayStartedAtRef = useRef(0);
  const finalCapturedRef = useRef(false);
  const readableCapturedRef = useRef(false);
  const readableCaptureRef = useRef<RecordedReadableCapture | null>(null);

  const table = createTableMeasurements();
  const firstFrame = frames[0] ?? null;

  const holderStartPosition: [number, number, number] = firstFrame
    ? [firstFrame.position[0], 2.82, table.backWallZ + 0.42]
    : [0, 2.82, table.backWallZ + 0.42];

  const holderStartRotation = new Quaternion().setFromEuler(
    new Euler(
      ...(DISPLAY_DICE_ROTATIONS[activeDieIndex] ?? [0, 0, 0]),
      "XYZ"
    )
  );

  function getReplayHandoffFrameIndex() {
    if (frames.length <= 1) return 0;

    const deflectorZ = table.backWallZ + 0.78;

    for (let index = 1; index < frames.length; index += 1) {
      const frame = frames[index];
      const [, y, z] = frame.position;

      const isNearDeflector = z >= deflectorZ - 0.16;
      const hasDroppedFromHolder = y <= 1.05;

      if (isNearDeflector || hasDroppedFromHolder) {
        return index;
      }
    }

    return Math.min(6, frames.length - 1);
  }

  const handoffFrameIndex = getReplayHandoffFrameIndex();
  const handoffFrame = frames[handoffFrameIndex] ?? firstFrame;
  const handoffTime = handoffFrame?.t ?? 0;

  function copyRecordedFrameToGroup(frame: DiceTrajectoryFrame) {
    const group = groupRef.current;
    if (!group) return;

    group.position.set(frame.position[0], frame.position[1], frame.position[2]);

    group.quaternion
      .set(
        frame.rotation[0],
        frame.rotation[1],
        frame.rotation[2],
        frame.rotation[3]
      )
      .normalize();
  }

  function copyHolderReleaseIntroToGroup(progress: number) {
    const group = groupRef.current;
    if (!group || !handoffFrame) return;

    const releaseProgress = MathUtils.clamp(progress, 0, 1);

    // Fast enough to avoid the "held by invisible hand" feeling,
    // but still reads as gravity sliding down from the holder.
    const fallEase = 1 - Math.pow(1 - releaseProgress, 1.7);
    const forwardEase = releaseProgress * releaseProgress * (3 - 2 * releaseProgress);
    const rotationEase = releaseProgress * releaseProgress * releaseProgress;

    group.position.set(
      MathUtils.lerp(
        holderStartPosition[0],
        handoffFrame.position[0],
        forwardEase
      ),
      MathUtils.lerp(
        holderStartPosition[1],
        handoffFrame.position[1],
        fallEase
      ),
      MathUtils.lerp(
        holderStartPosition[2],
        handoffFrame.position[2],
        forwardEase
      )
    );

    const handoffQuaternion = new Quaternion(
      handoffFrame.rotation[0],
      handoffFrame.rotation[1],
      handoffFrame.rotation[2],
      handoffFrame.rotation[3]
    ).normalize();

    const introQuaternion = holderStartRotation
      .clone()
      .normalize()
      .slerp(handoffQuaternion, rotationEase)
      .normalize();

    group.quaternion.copy(introQuaternion);
  }

  useLayoutEffect(() => {
    if (!firstFrame) return;

    copyHolderReleaseIntroToGroup(0);
  }, [frames, replayKey, activeDieIndex]);

  useEffect(() => {
    replayStartedAtRef.current = performance.now();
    finalCapturedRef.current = false;
    readableCapturedRef.current = false;
    readableCaptureRef.current = getRecordedTrajectoryReadableCapture(frames);

    if (firstFrame) {
      copyHolderReleaseIntroToGroup(0);
    }

    onSettledChange(false);
    onFaceResultChange(null);
  }, [frames, replayKey, activeDieIndex, onSettledChange, onFaceResultChange]);

  useFrame(() => {
    const group = groupRef.current;
    if (!group || frames.length === 0 || !firstFrame || !handoffFrame) return;

    const lastFrame = frames[frames.length - 1];

    if (!lastFrame) return;

    const replayElapsedSeconds =
      (performance.now() - replayStartedAtRef.current) / 1000;

    const holderReleaseIntroSeconds = 0.68;

    if (replayElapsedSeconds < holderReleaseIntroSeconds) {
      copyHolderReleaseIntroToGroup(
        replayElapsedSeconds / holderReleaseIntroSeconds
      );

      return;
    }

    const trajectorySeconds =
      handoffTime +
      (replayElapsedSeconds - holderReleaseIntroSeconds) /
        RECORDED_TRAJECTORY_REPLAY_TIME_SCALE;

    const { previousFrame, nextFrame, alpha } =
      getRecordedTrajectoryFramePair(frames, trajectorySeconds);

    group.position.set(
      MathUtils.lerp(previousFrame.position[0], nextFrame.position[0], alpha),
      MathUtils.lerp(previousFrame.position[1], nextFrame.position[1], alpha),
      MathUtils.lerp(previousFrame.position[2], nextFrame.position[2], alpha)
    );

    const previousQuaternion = new Quaternion(
      previousFrame.rotation[0],
      previousFrame.rotation[1],
      previousFrame.rotation[2],
      previousFrame.rotation[3]
    ).normalize();

    const nextQuaternion = new Quaternion(
      nextFrame.rotation[0],
      nextFrame.rotation[1],
      nextFrame.rotation[2],
      nextFrame.rotation[3]
    ).normalize();

    previousQuaternion.slerp(nextQuaternion, alpha).normalize();
    group.quaternion.copy(previousQuaternion);

    const readableCapture = readableCaptureRef.current;

    if (
      readableCapture &&
      trajectorySeconds >= readableCapture.t &&
      !readableCapturedRef.current
    ) {
      readableCapturedRef.current = true;
      onFaceResultChange(readableCapture.result);
    }

    if (trajectorySeconds >= lastFrame.t && !finalCapturedRef.current) {
      finalCapturedRef.current = true;

      const finalResult = detectTopDiceFace({
        x: lastFrame.rotation[0],
        y: lastFrame.rotation[1],
        z: lastFrame.rotation[2],
        w: lastFrame.rotation[3],
      });

      onSettledChange(true);

      if (!readableCapturedRef.current) {
        onFaceResultChange({
          ...finalResult,
          message: `Recorded trajectory replay complete. ${finalResult.message}`,
        });
      }
    }
  });

  if (frames.length === 0 || !firstFrame) return null;

  return (
    <group
      key={replayKey}
      ref={groupRef}
      position={holderStartPosition}
      rotation={DISPLAY_DICE_ROTATIONS[activeDieIndex] ?? [0, 0, 0]}
    >
      <DiceVisual
        shapePreset={diceShapePreset}
        showFaceLayer={!hideActiveDiceFaces}
        showHiddenFaceSeal={Boolean(hideActiveDiceFaces)}
      />
    </group>
  );
}

function createNearestVisibleResult(result: DiceFaceResult): DiceFaceResult {
  if (result.status === "accepted") {
    return {
      ...result,
      message: result.message || "Visible dice face captured.",
    };
  }

  return {
    ...result,
    status: "accepted",
    label: result.nearestLabel,
    nearestLabel: result.nearestLabel,
    message: "Nearest visible dice face captured at performance limit.",
  };
}

function isStrictReadableVisibleResult(result: DiceFaceResult) {
  return (
    result.status === "accepted" &&
    result.confidence >= STRICT_READABLE_RESULT_CONFIDENCE &&
    result.tiltDegrees <= STRICT_READABLE_RESULT_MAX_TILT_DEGREES
  );
}

function createStrictReadableVisibleResult(
  result: DiceFaceResult
): DiceFaceResult {
  if (isStrictReadableVisibleResult(result)) {
    return {
      ...result,
      message: "Clear readable dice face captured.",
    };
  }

  return {
    ...result,
    status: "cocked",
    label: "Cocked / Reroll",
    nearestLabel: result.nearestLabel,
    message: `Unreadable dice angle. Nearest ${result.nearestLabel}, ${result.confidence}% confidence, ${result.tiltDegrees}° tilt. Reroll required.`,
  };
}

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

const recorderPositionJitter = recorderReleaseJitterEnabled
  ? {
      x: seededRange(recorderReleaseSeed + 1, -0.085, 0.085),
      y: seededRange(recorderReleaseSeed + 2, -0.025, 0.035),
      z: seededRange(recorderReleaseSeed + 3, -0.055, 0.055),
    }
  : { x: 0, y: 0, z: 0 };

const recorderRotationJitter = recorderReleaseJitterEnabled
  ? {
      x: seededRange(recorderReleaseSeed + 4, -0.18, 0.18),
      y: seededRange(recorderReleaseSeed + 5, -0.24, 0.24),
      z: seededRange(recorderReleaseSeed + 6, -0.18, 0.18),
    }
  : { x: 0, y: 0, z: 0 };

const recorderInitialLinvel = recorderReleaseJitterEnabled
  ? {
      x: seededRange(recorderReleaseSeed + 7, -0.12, 0.12),
      y: seededRange(recorderReleaseSeed + 8, -0.04, 0.04),
      z: seededRange(recorderReleaseSeed + 9, -0.16, 0.18),
    }
  : { x: 0, y: 0, z: 0 };

const recorderInitialAngvel = recorderReleaseJitterEnabled
  ? {
      x: seededRange(recorderReleaseSeed + 10, -0.85, 0.85),
      y: seededRange(recorderReleaseSeed + 11, -0.55, 0.55),
      z: seededRange(recorderReleaseSeed + 12, -0.85, 0.85),
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

function TableRunwayDepthLayer({ table }: { table: TableMeasurements }) {
  return (
    <>
      {/* visual-only soft velvet wash; no collider */}
      <mesh
        position={[0, table.floorY + 0.108, table.floorZ + 0.36]}
        rotation={[table.slopeAngle, 0, 0]}
        receiveShadow
      >
        <boxGeometry args={[table.floorWidth - 0.95, 0.006, table.floorDepth - 1.55]} />
        <meshStandardMaterial
          {...TABLE_MATERIALS.runwayCenterGlow}
          depthWrite={false}
        />
      </mesh>

{/* visual-only very soft royal floor depth; no collider */}
<mesh
  position={[0, table.floorY + 0.116, table.floorZ + 0.82]}
  rotation={[table.settlingSlopeAngle, 0, 0]}
  receiveShadow
>
  <boxGeometry args={[table.floorWidth - 1.42, 0.004, 3.65]} />
  <meshStandardMaterial
    color="#8b0714"
    roughness={1}
    metalness={0}
    transparent
    opacity={0.075}
    depthWrite={false}
  />
</mesh>

      {/* visual-only rear shadow where dice leaves the holder area; no collider */}
      <mesh
        position={[0, table.floorY + 0.112, table.backEdgeZ + 0.72]}
        rotation={[table.slopeAngle, 0, 0]}
        receiveShadow
      >
        <boxGeometry args={[table.floorWidth - 0.82, 0.006, 0.42]} />
        <meshStandardMaterial
          {...TABLE_MATERIALS.runwayBackShadow}
          depthWrite={false}
        />
      </mesh>

            {/* visual-only back wall / runway seam cover; no collider */}
      <mesh
        position={[0, table.floorY + 0.13, table.backEdgeZ + 0.18]}
        rotation={[table.slopeAngle, 0, 0]}
        receiveShadow
      >
        <boxGeometry args={[table.floorWidth - 0.46, 0.012, 0.22]} />
        <meshStandardMaterial
          color="#0b0102"
          roughness={0.9}
          metalness={0.02}
          transparent
          opacity={0.42}
          depthWrite={false}
        />
      </mesh>

      {/* visual-only soft red cove above the seam; no collider */}
      <mesh
        position={[0, table.floorY + 0.138, table.backEdgeZ + 0.34]}
        rotation={[table.slopeAngle, 0, 0]}
        receiveShadow
      >
        <boxGeometry args={[table.floorWidth - 0.72, 0.006, 0.34]} />
        <meshStandardMaterial
          color="#3b0308"
          roughness={1}
          metalness={0}
          transparent
          opacity={0.2}
          depthWrite={false}
        />
      </mesh>

      {/* visual-only soft rail-side shadow, kept flat so it does not read as an obstacle */}
      <mesh
        position={[-table.halfWidth + 0.56, table.floorY + 0.11, table.floorZ + 0.28]}
        rotation={[table.slopeAngle, 0, 0]}
        receiveShadow
      >
        <boxGeometry args={[0.18, 0.005, table.floorDepth - 1.25]} />
        <meshStandardMaterial
          {...TABLE_MATERIALS.runwaySideDepth}
          depthWrite={false}
        />
      </mesh>

      <mesh
        position={[table.halfWidth - 0.56, table.floorY + 0.11, table.floorZ + 0.28]}
        rotation={[table.slopeAngle, 0, 0]}
        receiveShadow
      >
        <boxGeometry args={[0.18, 0.005, table.floorDepth - 1.25]} />
        <meshStandardMaterial
          {...TABLE_MATERIALS.runwaySideDepth}
          depthWrite={false}
        />
      </mesh>
    </>
  );
}

function TableRunway({
  table,
  devPhysicalReleaseEnabled = false,
}: {
  table: TableMeasurements;
  devPhysicalReleaseEnabled?: boolean;
}) {
  const upperRunwayRestitution = devPhysicalReleaseEnabled
    ? DEV_RUNWAY_UPPER_RESTITUTION
    : undefined;

  const upperRunwayFriction = devPhysicalReleaseEnabled
    ? DEV_RUNWAY_UPPER_FRICTION
    : undefined;

  const settlingRunwayRestitution = devPhysicalReleaseEnabled
    ? DEV_RUNWAY_SETTLING_RESTITUTION
    : undefined;

  const settlingRunwayFriction = devPhysicalReleaseEnabled
    ? DEV_RUNWAY_SETTLING_FRICTION
    : undefined;

  return (
    <>
      {/* upper lively runway: keeps the dice exciting after drop */}
      <mesh
        position={[0, table.upperFloorY, table.upperFloorZ]}
        rotation={[table.runwaySlopeAngle, 0, 0]}
        receiveShadow
      >
        <boxGeometry
          args={[table.floorWidth, 0.18, table.upperFloorDepth + 0.04]}
        />
        <meshStandardMaterial {...TABLE_MATERIALS.runwayFelt} />
      </mesh>

<CuboidCollider
  args={[table.halfWidth, 0.09, table.upperFloorDepth / 2 + 0.02]}
  position={[0, table.upperFloorY, table.upperFloorZ]}
  rotation={[table.runwaySlopeAngle, 0, 0]}
  restitution={upperRunwayRestitution}
  friction={upperRunwayFriction}
/>

      {/* lower runout tray: still sloped, but calmer for natural settling */}
      <mesh
        position={[0, table.settlingFloorY, table.settlingFloorZ]}
        rotation={[table.settlingSlopeAngle, 0, 0]}
        receiveShadow
      >
        <boxGeometry
          args={[table.floorWidth, 0.18, table.settlingFloorDepth + 0.04]}
        />
        <meshStandardMaterial {...TABLE_MATERIALS.runwayFelt} />
      </mesh>

<CuboidCollider
  args={[table.halfWidth, 0.09, table.settlingFloorDepth / 2 + 0.02]}
  position={[0, table.settlingFloorY, table.settlingFloorZ]}
  rotation={[table.settlingSlopeAngle, 0, 0]}
  restitution={settlingRunwayRestitution}
  friction={settlingRunwayFriction}
/>

            {/* visual-only soft inner felt tone; no collider */}
      <mesh
        position={[0, table.floorY + 0.102, table.floorZ + 0.32]}
        rotation={[table.slopeAngle, 0, 0]}
        receiveShadow
      >
        <boxGeometry args={[table.floorWidth - 0.72, 0.006, table.floorDepth - 1.28]} />
<meshStandardMaterial
  color="#8d0715"
  roughness={1}
  metalness={0}
  transparent
  opacity={0.11}
  depthWrite={false}
/>
      </mesh>

      <TableRunwayDepthLayer table={table} />
    </>
  );
}

function TableBackboardDepth({ table }: { table: TableMeasurements }) {
  return (
    <>
      {/* visual-only upper lacquer sheen; no collider */}
      <mesh
        position={[0, 2.82, table.backWallZ + 0.155]}
        receiveShadow
      >
        <boxGeometry args={[table.floorWidth - 0.72, 0.08, 0.018]} />
        <meshStandardMaterial
          {...TABLE_MATERIALS.backboardLacquerSheen}
          depthWrite={false}
        />
      </mesh>

      {/* visual-only soft center lacquer reflection; no collider */}
      <mesh
        position={[0, 1.55, table.backWallZ + 0.158]}
        receiveShadow
      >
        <boxGeometry args={[table.floorWidth - 1.05, 0.18, 0.018]} />
        <meshStandardMaterial
          {...TABLE_MATERIALS.backboardLacquerSheen}
          depthWrite={false}
        />
      </mesh>

            {/* visual-only warm palace glow behind dice holder; no collider */}
      <mesh
        position={[0, 2.08, table.backWallZ + 0.162]}
        receiveShadow
      >
        <boxGeometry args={[3.42, 0.34, 0.018]} />
        <meshStandardMaterial
          color="#8a4a18"
          roughness={0.72}
          metalness={0.08}
          transparent
          opacity={0.16}
          depthWrite={false}
        />
      </mesh>

      {/* visual-only lower holder shadow; no collider */}
      <mesh
        position={[0, 1.82, table.backWallZ + 0.164]}
        receiveShadow
      >
        <boxGeometry args={[3.2, 0.16, 0.018]} />
        <meshStandardMaterial
          color="#080101"
          roughness={0.9}
          metalness={0.02}
          transparent
          opacity={0.26}
          depthWrite={false}
        />
      </mesh>

      {/* visual-only lower shadow behind chute/tray; no collider */}
      <mesh
        position={[0, -0.42, table.backWallZ + 0.16]}
        receiveShadow
      >
        <boxGeometry args={[table.floorWidth - 0.48, 0.42, 0.02]} />
        <meshStandardMaterial
          {...TABLE_MATERIALS.backboardLowerShadow}
          depthWrite={false}
        />
      </mesh>
    </>
  );
}

function TableBackboardKanotePattern({ table }: { table: TableMeasurements }) {
  const motifCount = 7;
  const spacing = (table.floorWidth - 1.25) / (motifCount - 1);
  const startX = -((motifCount - 1) * spacing) / 2;

  return (
    <group position={[0, 1.72, table.backWallZ + 0.185]}>
      {/* visual-only ghost Kanote band; no collider */}
      <mesh position={[0, 0, -0.004]} receiveShadow>
        <boxGeometry args={[table.floorWidth - 0.95, 0.025, 0.012]} />
        <meshStandardMaterial
          {...TABLE_MATERIALS.kanoteBackboardGhost}
          depthWrite={false}
        />
      </mesh>

      {Array.from({ length: motifCount }).map((_, index) => {
        const x = startX + index * spacing;

        return (
          <group key={`backboard-kanote-motif-${index}`} position={[x, 0, 0]}>
            <mesh rotation={[0, 0, Math.PI / 4]} receiveShadow>
              <boxGeometry args={[0.12, 0.12, 0.012]} />
              <meshStandardMaterial
                {...TABLE_MATERIALS.kanoteBackboardGhost}
                depthWrite={false}
              />
            </mesh>

            <mesh position={[0, 0.11, 0.002]} receiveShadow>
              <boxGeometry args={[0.16, 0.018, 0.012]} />
              <meshStandardMaterial
                {...TABLE_MATERIALS.kanoteBackboardGhost}
                depthWrite={false}
              />
            </mesh>

            <mesh position={[0, -0.11, 0.002]} receiveShadow>
              <boxGeometry args={[0.16, 0.018, 0.012]} />
              <meshStandardMaterial
                {...TABLE_MATERIALS.kanoteBackboardGhost}
                depthWrite={false}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

function TableBackboard({ table }: { table: TableMeasurements }) {
  return (
    <>
<RoundedBox
  position={[0, 1.05, table.backWallZ]}
  args={[table.floorWidth + 0.12, 4.45, 0.26]}
  radius={0.045}
  smoothness={8}
  receiveShadow
  castShadow
>
  <meshStandardMaterial {...TABLE_MATERIALS.backboardLacquer} />
</RoundedBox>

      <CuboidCollider
        args={[table.halfWidth + 0.06, 2.22, 0.13]}
        position={[0, 1.05, table.backWallZ]}
      />

      {/* inner lacquer panel */}
      <mesh position={[0, 1.04, table.backWallZ + 0.018]} receiveShadow>
        <boxGeometry args={[table.floorWidth - 0.38, 3.72, 0.035]} />
        <meshStandardMaterial {...TABLE_MATERIALS.innerLacquerPanel} />
      </mesh>
            <TableBackboardDepth table={table} />
            <TableBackboardKanotePattern table={table} />
    </>
  );
}

function DiceHolderShelfDepth({ table }: { table: TableMeasurements }) {
  return (
    <>
      {/* visual-only rounded front brass edge on holder shelf; no collider */}
      <RoundedBox
        position={[0, 2.17, table.backWallZ + 0.43]}
        args={[3.06, 0.052, 0.062]}
        radius={0.018}
        smoothness={8}
        receiveShadow
        castShadow
      >
        <meshStandardMaterial {...TABLE_MATERIALS.holderShelfGoldEdge} />
      </RoundedBox>

      {/* visual-only underside shadow; no collider */}
      <mesh
        position={[0, 2.015, table.backWallZ + 0.42]}
        receiveShadow
      >
        <boxGeometry args={[3.05, 0.045, 0.05]} />
        <meshStandardMaterial
          {...TABLE_MATERIALS.holderShelfShadow}
          depthWrite={false}
        />
      </mesh>

            {/* visual-only shelf contact shadow against back wall; no collider */}
      <mesh
        position={[0, 2.04, table.backWallZ + 0.235]}
        receiveShadow
      >
        <boxGeometry args={[3.12, 0.055, 0.026]} />
        <meshStandardMaterial
          color="#070101"
          roughness={0.86}
          metalness={0.02}
          transparent
          opacity={0.36}
          depthWrite={false}
        />
      </mesh>

      {/* visual-only warm lacquer top glow on shelf; no collider */}
      <mesh
        position={[0, 2.145, table.backWallZ + 0.345]}
        receiveShadow
      >
        <boxGeometry args={[2.82, 0.012, 0.22]} />
        <meshStandardMaterial
          color="#6f120d"
          roughness={0.78}
          metalness={0.04}
          transparent
          opacity={0.18}
          depthWrite={false}
        />
      </mesh>
    </>
  );
}

function DiceHolderShelfKanoteAccent({ table }: { table: TableMeasurements }) {
  return (
    <>
      {/* visual-only holder front ornament strip; no collider */}
      <mesh
        position={[0, 2.205, table.backWallZ + 0.46]}
        receiveShadow
        castShadow
      >
        <boxGeometry args={[2.72, 0.024, 0.024]} />
        <meshStandardMaterial {...TABLE_MATERIALS.kanoteSoftShadow} />
      </mesh>

      {DICE_HOLDER_X_POSITIONS.map((x, index) => (
        <group
          key={`holder-mechanism-accent-${index}`}
          position={[x, 2.225, table.backWallZ + 0.47]}
        >
          {/* tiny visual brass hinge impression; no collider */}
          <mesh receiveShadow castShadow>
            <boxGeometry args={[0.28, 0.026, 0.026]} />
            <meshStandardMaterial {...TABLE_MATERIALS.kanoteGold} />
          </mesh>

          <mesh position={[-0.18, 0, 0.002]} receiveShadow castShadow>
            <boxGeometry args={[0.045, 0.045, 0.018]} />
            <meshStandardMaterial {...TABLE_MATERIALS.kanoteGold} />
          </mesh>

          <mesh position={[0.18, 0, 0.002]} receiveShadow castShadow>
            <boxGeometry args={[0.045, 0.045, 0.018]} />
            <meshStandardMaterial {...TABLE_MATERIALS.kanoteGold} />
          </mesh>
        </group>
      ))}
    </>
  );
}

function DiceHolderBackboardSupports({ table }: { table: TableMeasurements }) {
  void table;

  return null;
}

function DiceHolderShelf({ table }: { table: TableMeasurements }) {
  return (
    <>
<RoundedBox
  position={[0, 2.1, table.backWallZ + 0.28]}
  args={[3.12, 0.12, 0.42]}
        radius={0.025}
        smoothness={6}
        receiveShadow
      >
        <meshStandardMaterial {...TABLE_MATERIALS.holderWood} />
      </RoundedBox>

      <DiceHolderBackboardSupports table={table} />
      <DiceHolderShelfDepth table={table} />
      <DiceHolderShelfKanoteAccent table={table} />
    </>
  );
}

function KinematicTrapdoorReleaseSupport(_: {
  table: TableMeasurements;
  activeDieIndex: number;
  resetKey: number;
  sequenceRunning: boolean;
  displayOnly: boolean;
  testMode: TestMode;
}) {
  return null;
}

function TrapdoorFlaps({
  table,
  activeDieIndex,
  sequenceRunning,
  displayOnly,
  devPhysicalReleaseEnabled,
}: {
  table: TableMeasurements;
  activeDieIndex: number;
  sequenceRunning: boolean;
  displayOnly: boolean;
  devPhysicalReleaseEnabled: boolean;
}) {
  return (
    <>
      {DICE_HOLDER_X_POSITIONS.map((x, index) => {
        const hasDroppedThisRound =
          !displayOnly && sequenceRunning && index <= activeDieIndex;

        const isSingleDropOpen =
          !displayOnly && !sequenceRunning && index === activeDieIndex;

const isDoorOpen = hasDroppedThisRound || isSingleDropOpen;

const closedAngle = 0.56;
        const openAngle = devPhysicalReleaseEnabled
  ? DEV_TRAP_RELEASE_OPEN_ANGLE
  : 1.22;

        return (
          <group
            key={`trapdoor-flap-${index}`}
position={[
  x,
  DEV_TRAP_RELEASE_HINGE_Y,
  table.backWallZ +
    (devPhysicalReleaseEnabled ? DEV_TRAP_RELEASE_HINGE_Z_OFFSET : 0.18),
]}
            rotation={[isDoorOpen ? openAngle : closedAngle, 0, 0]}
          >
            {/* simple hinge bar at wall-door connection */}
            <mesh position={[0, 0.002, 0.04]} receiveShadow castShadow>
              <boxGeometry args={[0.62, 0.026, 0.04]} />
              <meshStandardMaterial {...TABLE_MATERIALS.goldTrim} />
            </mesh>

            {/* lacquer trapdoor panel under the dice */}
            <RoundedBox
              position={[0, -0.02, 0.31]}
              args={[0.78, 0.055, 0.58]}
              radius={0.025}
              smoothness={6}
              receiveShadow
              castShadow
            >
              <meshStandardMaterial
                {...(isDoorOpen
                  ? TABLE_MATERIALS.trapdoorOpen
                  : TABLE_MATERIALS.trapdoorClosed)}
              />
            </RoundedBox>

            {/* visual-only inset shadow on trapdoor */}
            <mesh position={[0, -0.052, 0.31]} receiveShadow>
              <boxGeometry args={[0.58, 0.01, 0.38]} />
              <meshStandardMaterial
                color="#170202"
                roughness={0.82}
                metalness={0.02}
                transparent
                opacity={0.28}
                depthWrite={false}
              />
            </mesh>

            {/* tiny gold front edge */}
            <mesh position={[0, 0.01, 0.58]} receiveShadow castShadow>
              <boxGeometry args={[0.62, 0.024, 0.035]} />
              <meshStandardMaterial {...TABLE_MATERIALS.goldTrim} />
            </mesh>
          </group>
        );
      })}
    </>
  );
}

function WaitingDiceRack({
  table,
  activeDieIndex,
  sequenceRunning,
  diceShapePreset,
  mountedDiceRackMode,
  devPhysicalReleaseEnabled,
}: {
  table: TableMeasurements;
  activeDieIndex: number;
  sequenceRunning: boolean;
  diceShapePreset: DiceShapePreset;
  mountedDiceRackMode: MountedDiceRackMode;
  devPhysicalReleaseEnabled: boolean;
}) {
  return (
    <>
      {DICE_HOLDER_X_POSITIONS.map((x, index) => {
        const isRackWaitingForSequence =
          mountedDiceRackMode === "sequence" && !sequenceRunning;

        const shouldShowWaitingDie =
          mountedDiceRackMode === "ready" ||
          isRackWaitingForSequence ||
          (mountedDiceRackMode === "sequence" &&
            sequenceRunning &&
            index > activeDieIndex);

        if (!shouldShowWaitingDie) return null;

const waitingDiePosition: [number, number, number] =
  devPhysicalReleaseEnabled
    ? getDevTrapReleaseDicePosition({
        table,
        activeDieX: x,
      })
    : [x, 2.82, table.backWallZ + 0.42];

        const waitingDieScale = 1;
        const baseRotation = DISPLAY_DICE_ROTATIONS[index] ?? [0, 0, 0];

        const waitingPreviewOffset =
          mountedDiceRackMode === "ready" || isRackWaitingForSequence
            ? activeDieIndex + index + 1
            : 0;

        const waitingDieRotation: [number, number, number] = [
          baseRotation[0] + Math.sin(waitingPreviewOffset * 1.7) * 0.08,
          baseRotation[1] + Math.cos(waitingPreviewOffset * 1.3) * 0.1,
          baseRotation[2] + Math.sin(waitingPreviewOffset * 2.1) * 0.07,
        ];

        return (
          <group
            key={`mounted-waiting-die-${index}`}
            position={waitingDiePosition}
            rotation={waitingDieRotation}
            scale={[waitingDieScale, waitingDieScale, waitingDieScale]}
          >
            <DiceVisual shapePreset={diceShapePreset} />
          </group>
        );
      })}
    </>
  );
}

function StumbleBar({
  table,
  testMode,
  forceVisible = false,
  devPhysicalReleaseEnabled = false,
}: {
  table: TableMeasurements;
  testMode: TestMode;
  forceVisible?: boolean;
  devPhysicalReleaseEnabled?: boolean;
}) {
if (testMode !== "trap" && !forceVisible) return null;

const deflectorY = 0.36;
const deflectorZ = table.backWallZ + 0.78;
const deflectorRotation = 0.12;

const deflectorRestitution = devPhysicalReleaseEnabled
  ? DEV_DEFLECTOR_RESTITUTION
  : TABLE_DEFLECTOR_RESTITUTION;

const deflectorFriction = devPhysicalReleaseEnabled
  ? DEV_DEFLECTOR_FRICTION
  : TABLE_DEFLECTOR_FRICTION;

const shoulderRestitution = devPhysicalReleaseEnabled
  ? DEV_DEFLECTOR_SHOULDER_RESTITUTION
  : TABLE_DEFLECTOR_SHOULDER_RESTITUTION;

const shoulderFriction = devPhysicalReleaseEnabled
  ? DEV_DEFLECTOR_SHOULDER_FRICTION
  : TABLE_DEFLECTOR_SHOULDER_FRICTION;

return (
    <>
      <group
        position={[0, deflectorY, deflectorZ]}
rotation={[deflectorRotation, 0, 0]}
      >
        <mesh receiveShadow castShadow rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.072, 0.072, table.floorWidth - 0.28, 32]} />
          <meshStandardMaterial {...TABLE_MATERIALS.goldAccent} />
        </mesh>
      </group>

<CuboidCollider
  args={[1.675, 0.04, 0.095]}
position={[0, deflectorY + 0.03, deflectorZ]}
rotation={[deflectorRotation, 0, 0]}
restitution={deflectorRestitution}
friction={deflectorFriction}
/>

{/* subtle upper contact shoulder: helps dice visibly catch/graze the bar instead of gliding past it */}
<CuboidCollider
  args={[1.58, 0.032, 0.075]}
position={[0, deflectorY + 0.16, deflectorZ - 0.045]}
rotation={[deflectorRotation + 0.2, 0, 0]}
restitution={shoulderRestitution}
friction={shoulderFriction}
/>
    </>
  );
}

function FrontLipLacquerDepth({ table }: { table: TableMeasurements }) {
  return (
    <>
      {/* visual-only lacquer sheen on front lip; no collider */}
      <mesh
        position={[0, table.frontBorderY + 0.08, table.frontEdgeZ + 0.205]}
        receiveShadow
      >
        <boxGeometry args={[table.floorWidth - 0.28, 0.06, 0.035]} />
        <meshStandardMaterial {...TABLE_MATERIALS.frontLipLacquerSheen} />
      </mesh>

            {/* visual-only heavy front lacquer depth; no collider */}
      <mesh
        position={[0, table.frontBorderY - 0.08, table.frontEdgeZ + 0.23]}
        receiveShadow
      >
        <boxGeometry args={[table.floorWidth - 0.36, 0.13, 0.032]} />
        <meshStandardMaterial
          color="#070101"
          roughness={0.82}
          metalness={0.04}
          transparent
          opacity={0.32}
          depthWrite={false}
        />
      </mesh>

      {/* visual-only lower shadow for heavier furniture feeling; no collider */}
      <mesh
        position={[0, table.frontBorderY - 0.31, table.frontEdgeZ + 0.225]}
        receiveShadow
      >
        <boxGeometry args={[table.floorWidth - 0.18, 0.08, 0.04]} />
        <meshStandardMaterial {...TABLE_MATERIALS.frontLipBottomShadow} />
      </mesh>
    </>
  );
}

function FrontLipKanoteStrip({ table }: { table: TableMeasurements }) {
  const ornamentCount = 13;
  const spacing = (table.floorWidth - 0.9) / (ornamentCount - 1);
  const startX = -((ornamentCount - 1) * spacing) / 2;

  return (
    <group position={[0, table.frontBorderY + 0.015, table.frontEdgeZ + 0.255]}>
      {/* visual-only shadow base for carved/embossed feeling; no collider */}
      <mesh position={[0, -0.01, -0.004]} receiveShadow>
        <boxGeometry args={[table.floorWidth - 0.62, 0.035, 0.012]} />
        <meshStandardMaterial
          {...TABLE_MATERIALS.kanoteSoftShadow}
          depthWrite={false}
        />
      </mesh>

      {Array.from({ length: ornamentCount }).map((_, index) => {
        const x = startX + index * spacing;

        return (
          <group key={`front-kanote-motif-${index}`} position={[x, 0, 0]}>
            {/* simple first-pass diamond motif inspired by carved Kanote trim */}
            <mesh rotation={[0, 0, Math.PI / 4]} receiveShadow>
              <boxGeometry args={[0.105, 0.105, 0.018]} />
              <meshStandardMaterial {...TABLE_MATERIALS.kanoteGold} />
            </mesh>

            {/* small lower accent keeps motif from feeling like plain dots */}
            <mesh position={[0, -0.082, 0.002]} receiveShadow>
              <boxGeometry args={[0.18, 0.018, 0.016]} />
              <meshStandardMaterial {...TABLE_MATERIALS.kanoteGold} />
            </mesh>
          </group>
        );
      })}

      {Array.from({ length: ornamentCount - 1 }).map((_, index) => {
        const x = startX + spacing / 2 + index * spacing;

        return (
          <mesh
            key={`front-kanote-connector-${index}`}
            position={[x, 0, -0.001]}
            receiveShadow
          >
            <boxGeometry args={[spacing * 0.42, 0.018, 0.014]} />
            <meshStandardMaterial {...TABLE_MATERIALS.kanoteGold} />
          </mesh>
        );
      })}
    </group>
  );
}

function FrontLip({ table }: { table: TableMeasurements }) {
  return (
    <>
<RoundedBox
  position={[0, table.frontBorderY - 0.1, table.frontEdgeZ + 0.08]}
  args={[table.floorWidth, TABLE_FRONT_VISUAL_LIP_HEIGHT, 0.3]}
  radius={0.035}
  smoothness={8}
  receiveShadow
  castShadow
>
  <meshStandardMaterial {...TABLE_MATERIALS.darkBorder} />
</RoundedBox>

<RoundedBox
  position={[0, table.frontBorderY + 0.16, table.frontEdgeZ - 0.08]}
  args={[table.floorWidth - 0.42, 0.07, 0.095]}
  radius={0.028}
  smoothness={8}
  receiveShadow
  castShadow
>
  <meshStandardMaterial {...TABLE_MATERIALS.goldTrim} />
</RoundedBox>

<FrontLipLacquerDepth table={table} />
<FrontLipKanoteStrip table={table} />

            {/* invisible angled rebound face: kicks dice back into the tray */}
<CuboidCollider
  args={[table.halfWidth - 0.08, 0.07, 0.16]}
  position={[0, table.frontBorderY + 0.19, table.frontEdgeZ - 0.08]}
  rotation={[-0.11, 0, 0]}
  restitution={TABLE_FRONT_REBOUND_RESTITUTION}
  friction={TABLE_FRONT_REBOUND_FRICTION}
/>

      {/* invisible keeper wall: prevents escape without being the first hard stop */}
      <CuboidCollider
        args={[table.halfWidth, TABLE_FRONT_COLLIDER_HEIGHT, 0.11]}
        position={[0, table.frontBorderY + 0.02, table.frontEdgeZ + 0.1]}
        restitution={TABLE_FRONT_KEEPER_RESTITUTION}
        friction={TABLE_FRONT_KEEPER_FRICTION}
      />
    </>
  );
}

function TraySideRailKanoteTrim({ table }: { table: TableMeasurements }) {
  const motifCount = 9;
  const trimDepth = table.floorDepth - 1.35;
  const spacing = trimDepth / (motifCount - 1);
  const startZ = table.floorZ - trimDepth / 2;

  return (
    <>
      {[-1, 1].map((side) => {
        const x = side < 0 ? -table.halfWidth - 0.165 : table.halfWidth + 0.165;
        const motifRotationZ = side < 0 ? Math.PI / 4 : -Math.PI / 4;

        return (
          <group
            key={`side-rail-kanote-${side}`}
            rotation={[table.slopeAngle, 0, 0]}
          >
            {/* visual-only outer Kanote trim line; no collider */}
            <mesh
              position={[x, table.sideRailY + 0.53, table.floorZ]}
              receiveShadow
            >
              <boxGeometry args={[0.025, 0.035, trimDepth + 0.18]} />
              <meshStandardMaterial {...TABLE_MATERIALS.kanoteSoftShadow} />
            </mesh>

            {Array.from({ length: motifCount }).map((_, index) => {
              const z = startZ + index * spacing;

              return (
                <group
                  key={`side-rail-kanote-motif-${side}-${index}`}
                  position={[x, table.sideRailY + 0.58, z]}
                >
                  <mesh rotation={[0, 0, motifRotationZ]} receiveShadow>
                    <boxGeometry args={[0.072, 0.072, 0.014]} />
                    <meshStandardMaterial {...TABLE_MATERIALS.kanoteGold} />
                  </mesh>

                  <mesh
                    position={[0, -0.06, 0]}
                    rotation={[0, 0, motifRotationZ]}
                    receiveShadow
                  >
                    <boxGeometry args={[0.048, 0.048, 0.012]} />
                    <meshStandardMaterial {...TABLE_MATERIALS.kanoteGold} />
                  </mesh>
                </group>
              );
            })}
          </group>
        );
      })}
    </>
  );
}

function TrayRailLacquerDepth({ table }: { table: TableMeasurements }) {
  return (
    <>
      {/* visual-only left rail inner lacquer sheen; no collider */}
      <mesh
        position={[-table.halfWidth + 0.08, table.sideRailY + 0.44, table.floorZ]}
        rotation={[table.slopeAngle, 0, 0]}
        receiveShadow
      >
        <boxGeometry args={[0.045, 0.18, table.floorDepth - 0.72]} />
        <meshStandardMaterial {...TABLE_MATERIALS.railLacquerSheen} />
      </mesh>

      {/* visual-only left outer shadow; no collider */}
      <mesh
        position={[-table.halfWidth - 0.13, table.sideRailY + 0.16, table.floorZ]}
        rotation={[table.slopeAngle, 0, 0]}
        receiveShadow
      >
        <boxGeometry args={[0.04, 0.72, table.floorDepth - 0.48]} />
        <meshStandardMaterial {...TABLE_MATERIALS.railOuterShadow} />
      </mesh>

      {/* visual-only right rail inner lacquer sheen; no collider */}
      <mesh
        position={[table.halfWidth - 0.08, table.sideRailY + 0.44, table.floorZ]}
        rotation={[table.slopeAngle, 0, 0]}
        receiveShadow
      >
        <boxGeometry args={[0.045, 0.18, table.floorDepth - 0.72]} />
        <meshStandardMaterial {...TABLE_MATERIALS.railLacquerSheen} />
      </mesh>

      {/* visual-only right outer shadow; no collider */}
      <mesh
        position={[table.halfWidth + 0.13, table.sideRailY + 0.16, table.floorZ]}
        rotation={[table.slopeAngle, 0, 0]}
        receiveShadow
      >
        <boxGeometry args={[0.04, 0.72, table.floorDepth - 0.48]} />
        <meshStandardMaterial {...TABLE_MATERIALS.railOuterShadow} />
      </mesh>
    </>
  );
}

function TraySideRails({ table }: { table: TableMeasurements }) {
  return (
    <>
      {/* left side rail */}
      <RoundedBox
        position={[-table.halfWidth, table.sideRailY, table.floorZ]}
        rotation={[table.slopeAngle, 0, 0]}
        args={[0.28, 1.32, table.floorDepth]}
        radius={0.035}
        smoothness={8}
        receiveShadow
        castShadow
      >
        <meshStandardMaterial {...TABLE_MATERIALS.darkBorder} />
      </RoundedBox>

      <RoundedBox
        position={[-table.halfWidth + 0.16, table.sideRailY + 0.72, table.floorZ]}
        rotation={[table.slopeAngle, 0, 0]}
        args={[0.07, 0.07, table.floorDepth - 0.46]}
        radius={0.026}
        smoothness={8}
        receiveShadow
        castShadow
      >
        <meshStandardMaterial {...TABLE_MATERIALS.sideGoldRail} />
      </RoundedBox>

<CuboidCollider
  args={[0.13, 1.08, table.halfDepth]}
  position={[-table.halfWidth, table.sideRailY + 0.1, table.floorZ]}
  rotation={[table.slopeAngle, 0, 0]}
restitution={TABLE_SIDE_RAIL_RESTITUTION}
friction={TABLE_SIDE_RAIL_FRICTION}
/>

      {/* right side rail */}
      <RoundedBox
        position={[table.halfWidth, table.sideRailY, table.floorZ]}
        rotation={[table.slopeAngle, 0, 0]}
        args={[0.28, 1.32, table.floorDepth]}
        radius={0.035}
        smoothness={8}
        receiveShadow
        castShadow
      >
        <meshStandardMaterial {...TABLE_MATERIALS.darkBorder} />
      </RoundedBox>

      <RoundedBox
        position={[table.halfWidth - 0.16, table.sideRailY + 0.72, table.floorZ]}
        rotation={[table.slopeAngle, 0, 0]}
        args={[0.07, 0.07, table.floorDepth - 0.46]}
        radius={0.026}
        smoothness={8}
        receiveShadow
        castShadow
      >
        <meshStandardMaterial {...TABLE_MATERIALS.sideGoldRail} />
      </RoundedBox>

<CuboidCollider
  args={[0.13, 1.08, table.halfDepth]}
  position={[table.halfWidth, table.sideRailY + 0.1, table.floorZ]}
  rotation={[table.slopeAngle, 0, 0]}
restitution={TABLE_SIDE_RAIL_RESTITUTION}
friction={TABLE_SIDE_RAIL_FRICTION}
/>

      <TrayRailLacquerDepth table={table} />
      <TraySideRailKanoteTrim table={table} />
    </>
  );
}

function TableSafetyGuards({ table }: { table: TableMeasurements }) {
  return (
    <>
            {/* emergency escape guard only; main bounce should happen on FrontLip */}
<CuboidCollider
  args={[table.halfWidth, 0.92, 0.07]}
  position={[0, 0.08, table.frontEdgeZ + 0.34]}
restitution={TABLE_SAFETY_FRONT_RESTITUTION}
friction={TABLE_SAFETY_FRONT_FRICTION}
/>

<CuboidCollider
  args={[0.11, 1.16, table.halfDepth]}
  position={[-table.halfWidth - 0.04, 0.08, table.floorZ]}
restitution={TABLE_SAFETY_SIDE_RESTITUTION}
friction={TABLE_SAFETY_SIDE_FRICTION}
/>

<CuboidCollider
  args={[0.11, 1.16, table.halfDepth]}
  position={[table.halfWidth + 0.04, 0.08, table.floorZ]}
restitution={TABLE_SAFETY_SIDE_RESTITUTION}
friction={TABLE_SAFETY_SIDE_FRICTION}
/>
    </>
  );
}

function TrayBox({
  testMode,
  activeDieIndex,
  sequenceRunning,
  displayOnly,
  diceShapePreset,
  mountedDiceRackMode,
  showDice = true,
  forceShowStumbleBar = false,
  resetKey,
devPhysicalReleaseEnabled = false,
}: {
  testMode: TestMode;
  activeDieIndex: number;
  sequenceRunning: boolean;
  displayOnly: boolean;
  diceShapePreset: DiceShapePreset;
  mountedDiceRackMode: MountedDiceRackMode;
  showDice?: boolean;
  forceShowStumbleBar?: boolean;
  resetKey: number;
devPhysicalReleaseEnabled?: boolean;
}) {
  const table = createTableMeasurements();

return (
  <>
    <RigidBody type="fixed" colliders={false}>
<TableRunway
  table={table}
  devPhysicalReleaseEnabled={devPhysicalReleaseEnabled}
/>
<TableBackboard table={table} />

<TrapdoorFlaps
        table={table}
        activeDieIndex={activeDieIndex}
        sequenceRunning={sequenceRunning}
        displayOnly={displayOnly}
        devPhysicalReleaseEnabled={devPhysicalReleaseEnabled}
      />
{showDice ? (
  <WaitingDiceRack
    table={table}
    activeDieIndex={activeDieIndex}
    sequenceRunning={sequenceRunning}
    diceShapePreset={diceShapePreset}
    mountedDiceRackMode={mountedDiceRackMode}
    devPhysicalReleaseEnabled={devPhysicalReleaseEnabled}
  />
) : null}
<StumbleBar
  table={table}
  testMode={testMode}
  forceVisible={forceShowStumbleBar}
  devPhysicalReleaseEnabled={devPhysicalReleaseEnabled}
/>
      <FrontLip table={table} />
      <TraySideRails table={table} />
      <TableSafetyGuards table={table} />
    </RigidBody>

    {devPhysicalReleaseEnabled ? (
      <KinematicTrapdoorReleaseSupport
        table={table}
        activeDieIndex={activeDieIndex}
        resetKey={resetKey}
        sequenceRunning={sequenceRunning}
        displayOnly={displayOnly}
        testMode={testMode}
      />
    ) : null}
  </>
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
  resetKey={resetKey}
devPhysicalReleaseEnabled={activeDevPhysicalReleaseEnabled}
/>

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
  camera={cameraConfig}
  gl={{ antialias: true }}
  style={{ touchAction: variant === "room" ? "none" : "auto" }}
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
  devPhysicalReleaseEnabled={devPhysicalReleaseEnabled}
  shadowLaunchRecipe={shadowLaunchRecipe}
  trajectoryRecorderEnabled={trajectoryRecorderEnabled}
  trajectoryRecorderRunNonce={trajectoryRecorderRunNonce}
  onTrajectoryRecorderComplete={onTrajectoryRecorderComplete}
/>
    </Canvas>
  );
}
