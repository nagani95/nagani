// src/components/games/six-animal/ThreeDicePhysicsStage.tsx

"use client";

import { useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, RoundedBox, Text, useTexture } from "@react-three/drei";
import { MathUtils, Quaternion, Vector3 } from "three";
import {
  CuboidCollider,
  Physics,
  RigidBody,
  RoundCuboidCollider,
  type RapierRigidBody,
} from "@react-three/rapier";
import { naganiAssets } from "../../../lib/naganiAssets";

export type TestMode = "trap" | "runway";
export type StageViewVariant = "lab" | "room";
export type MountedDiceRackMode = "ready" | "sequence" | "empty";

export type DiceShapePreset =
  | "current"
  | "softer-round"
  | "more-round"
  | "test-extreme";

export type DiceColliderPreset =
  | "current"
  | "tighter"
  | "softer"
  | "experimental";

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

export type DiceAnimalLabel =
  | "Tiger"
  | "Dragon"
  | "Rooster"
  | "Fish"
  | "Crab"
  | "Elephant";

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

const worldUp = new Vector3(0, 1, 0);
const VALID_FACE_SCORE_THRESHOLD = 0.82;
const TARGET_CORRECTION_ENABLED = false;
const TARGET_CORRECTION_MIN_SPEED = 0.18;
const TARGET_CORRECTION_MAX_TILT_DEGREES = 35;
const ACCEPTED_RESULT_MESSAGE = "Top face accepted and captured.";
const COCKED_RESULT_MESSAGE =
  "Dice stopped at an unreadable angle. Result not accepted.";

const VISIBLE_FACE_CAPTURE_MIN_ROLL_MS = 7600;
const VISIBLE_FACE_CAPTURE_STABLE_SECONDS = 0.78;
const VISIBLE_FACE_CAPTURE_SPEED = 0.72;
const VISIBLE_FACE_HARD_READ_MS = 9800;
const VISIBLE_FACE_EDGE_SETTLE_LIMIT_MS = 11200;
const VISIBLE_FACE_EDGE_SETTLE_TILT_DEGREES = 32;

const DICE_HOLDER_X_POSITIONS = [-1.0, 0, 1.0];

const DISPLAY_DICE_ROTATIONS: [number, number, number][] = [
  // Waiting dice display only. Does not affect physical result detection.
  [-Math.PI / 2, 0, 0], // Tiger/top face visible
  [0, Math.PI / 2, 0], // Rooster/right face visible
  [0, -Math.PI / 2, 0], // Fish/left face visible
];
const USE_DICE_FACE_TEXTURES = true;
const SHOW_DICE_FACE_TEXT_LABELS = false;

const DICE_FACE_ASSET_BASE = naganiAssets.sixAnimal.dice.faces.base;

const DICE_SIZE = 1.08;
const DICE_CORNER_RADIUS = 0.26;
const DICE_SMOOTHNESS = 16;

type DiceShapeConfig = {
  size: number;
  cornerRadius: number;
  smoothness: number;
};

const DICE_SHAPE_PRESET_CONFIG: Record<DiceShapePreset, DiceShapeConfig> = {
  current: {
    size: DICE_SIZE,
    cornerRadius: DICE_CORNER_RADIUS,
    smoothness: DICE_SMOOTHNESS,
  },
  "softer-round": {
    size: DICE_SIZE,
    cornerRadius: 0.3,
    smoothness: 18,
  },
  "more-round": {
    size: DICE_SIZE,
    cornerRadius: 0.34,
    smoothness: 20,
  },
  "test-extreme": {
    size: DICE_SIZE,
    cornerRadius: 0.4,
    smoothness: 24,
  },
};

function getDiceShapeConfig(preset: DiceShapePreset): DiceShapeConfig {
  return DICE_SHAPE_PRESET_CONFIG[preset] ?? DICE_SHAPE_PRESET_CONFIG.current;
}

type DiceColliderConfig = {
  args: [number, number, number, number];
};

const DICE_COLLIDER_PRESET_CONFIG: Record<
  DiceColliderPreset,
  DiceColliderConfig
> = {
  current: {
    args: [0.12, 0.12, 0.12, 0.46],
  },
  tighter: {
    args: [0.15, 0.15, 0.15, 0.42],
  },
  softer: {
    args: [0.1, 0.1, 0.1, 0.48],
  },
  experimental: {
    args: [0.08, 0.08, 0.08, 0.5],
  },
};

function getDiceColliderConfig(
  preset: DiceColliderPreset
): DiceColliderConfig {
  return (
    DICE_COLLIDER_PRESET_CONFIG[preset] ??
    DICE_COLLIDER_PRESET_CONFIG.current
  );
}

const PRODUCTION_DICE_SHAPE_PRESET: DiceShapePreset = "more-round";
const PRODUCTION_DICE_COLLIDER_PRESET: DiceColliderPreset = "softer";

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
const TABLE_FRONT_VISUAL_LIP_HEIGHT = 0.46;
const TABLE_FRONT_COLLIDER_HEIGHT = 0.36;

const TABLE_FRONT_REBOUND_RESTITUTION = 0.74;
const TABLE_FRONT_REBOUND_FRICTION = 0.13;
const TABLE_FRONT_KEEPER_RESTITUTION = 0.3;
const TABLE_FRONT_KEEPER_FRICTION = 0.24;

const TABLE_DEFLECTOR_RESTITUTION = 0.86;
const TABLE_DEFLECTOR_FRICTION = 0.075;
const TABLE_DEFLECTOR_SHOULDER_RESTITUTION = 0.76;
const TABLE_DEFLECTOR_SHOULDER_FRICTION = 0.09;
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

type DiceFaceCandidate = {
  axis: string;
  label: DiceAnimalLabel;
  direction: Vector3;
};

const diceFaceCandidates: DiceFaceCandidate[] = [
  { axis: "+Y", label: "Tiger", direction: new Vector3(0, 1, 0) },
  { axis: "-Y", label: "Dragon", direction: new Vector3(0, -1, 0) },
  { axis: "+X", label: "Rooster", direction: new Vector3(1, 0, 0) },
  { axis: "-X", label: "Fish", direction: new Vector3(-1, 0, 0) },
  { axis: "+Z", label: "Crab", direction: new Vector3(0, 0, 1) },
  { axis: "-Z", label: "Elephant", direction: new Vector3(0, 0, -1) },
];

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
}) {
const bodyRef = useRef<RapierRigidBody | null>(null);
const stillTimeRef = useRef(0);
const settledRef = useRef(false);
const rollStartedAtRef = useRef(0);
const stableVisibleFaceKeyRef = useRef<string | null>(null);
const stableVisibleFaceTimeRef = useRef(0);
const lastCaptureRequestKeyRef = useRef(0);
const softHoldStartedAtRef = useRef<number | null>(null);

const collider = getDiceColliderConfig(diceColliderPreset);
const activeDieX = DICE_HOLDER_X_POSITIONS[activeDieIndex] ?? 0;

const activeHolderStartPosition: [number, number, number] =
  testMode === "runway"
    ? [activeDieX, 0.25, -1.45]
    : [activeDieX, 2.62, -2.58];

const activeHolderStartRotation: [number, number, number] =
  testMode === "runway"
    ? [0.72, 0.42, -0.58]
    : DISPLAY_DICE_ROTATIONS[activeDieIndex] ?? [0, 0, 0];

const lateralDrift =
  activeDieIndex === 0
    ? 0.035
    : activeDieIndex === 2
      ? -0.035
      : resetKey % 2 === 0
        ? 0.018
        : -0.018;

useEffect(() => {
stillTimeRef.current = 0;
settledRef.current = false;
rollStartedAtRef.current = performance.now();
stableVisibleFaceKeyRef.current = null;
stableVisibleFaceTimeRef.current = 0;
lastCaptureRequestKeyRef.current = captureRequestKey;
softHoldStartedAtRef.current = null;

onSettledChange(false);
onFaceResultChange(null);

  const releaseFrame = window.requestAnimationFrame(() => {
    const body = bodyRef.current;
    if (!body) return;

    if (testMode === "runway") {
      body.setLinvel(
        {
          x: lateralDrift,
          y: -0.55,
          z: 0.75,
        },
        true
      );

      body.setAngvel(
        {
          x: 1.8 + resetKey * 0.04,
          y: -0.8 + resetKey * 0.03,
          z: 2.2 + resetKey * 0.04,
        },
        true
      );

      return;
    }

const naturalDirection =
  activeDieIndex === 0
    ? 0.055
    : activeDieIndex === 2
      ? -0.055
      : resetKey % 2 === 0
        ? 0.035
        : -0.035;

body.setLinvel(
  {
    x: naturalDirection + lateralDrift * 0.32,
    y: -0.92,
    z: 0.56,
  },
  true
);

body.setAngvel(
  {
    x: 3.15 + resetKey * 0.01,
    y:
      (activeDieIndex === 0
        ? -0.82
        : activeDieIndex === 2
          ? 0.82
          : resetKey % 2 === 0
            ? -0.64
            : 0.64) + resetKey * 0.004,
    z: 2.55 + resetKey * 0.01,
  },
  true
);
  });

  return () => window.cancelAnimationFrame(releaseFrame);
}, [
  resetKey,
  activeDieIndex,
  testMode,
  lateralDrift,
]);

useFrame((_, delta) => {
  const body = bodyRef.current;
  if (!body) return;

  const linvel = body.linvel();
    const angvel = body.angvel();

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

const rollAgeMs = performance.now() - rollStartedAtRef.current;
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

  const capturedResult = createNearestVisibleResult(visibleResult);

  settledRef.current = true;
  stillTimeRef.current = 999;

  softHoldStartedAtRef.current = performance.now();
  softenVisibleDiceBody(body);

  onSettledChange(true);
  onFaceResultChange({
    ...capturedResult,
    message: "Nearest visible dice face captured by dice director.",
  });

  return;
}

if (
  visibleFaceKey &&
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
  visibleResult.tiltDegrees <= 26 &&
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

if ((hasStableVisibleFace || hasReachedHardRead) && !settledRef.current) {
  const capturedResult = hasStableVisibleFace
    ? visibleResult
    : createNearestVisibleResult(visibleResult);

  settledRef.current = true;
  stillTimeRef.current = 999;

  softHoldStartedAtRef.current = performance.now();
softenVisibleDiceBody(body);

  onSettledChange(true);
  onFaceResultChange({
    ...capturedResult,
    message: hasStableVisibleFace
      ? "Stable visible dice face captured and held."
      : "Nearest visible dice face captured and held at performance limit.",
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

  onSettledChange(true);
  onFaceResultChange({
    ...visibleResult,
    message: "Naturally stopped visible dice face captured and held.",
  });
}
  });

  return (
    <RigidBody
      ref={bodyRef}
      key={resetKey}
      colliders={false}
      ccd
position={activeHolderStartPosition}
rotation={activeHolderStartRotation}
restitution={0.62}
friction={0.22}
linearDamping={0.004}
angularDamping={0.008}
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

type TableMeasurements = {
  floorWidth: number;
  floorDepth: number;
  halfWidth: number;
  halfDepth: number;
  floorY: number;
  floorZ: number;
  slopeAngle: number;
  runwaySlopeAngle: number;
  settlingSlopeAngle: number;
  backEdgeZ: number;
  frontEdgeZ: number;
  transitionZ: number;
  upperFloorDepth: number;
  settlingFloorDepth: number;
  upperFloorZ: number;
  settlingFloorZ: number;
  upperFloorY: number;
  settlingFloorY: number;
  backWallZ: number;
  trapdoorZ: number;
  frontBorderY: number;
  sideRailY: number;
};

function createTableMeasurements(): TableMeasurements {
  const floorWidth = 4.45;
  const floorDepth = 6.75;
  const halfWidth = floorWidth / 2;
  const halfDepth = floorDepth / 2;

  const floorY = -1.05;
  const floorZ = 0.35;

  // Upper zone keeps dice lively after drop.
  const runwaySlopeAngle = 0.3;

  // Lower zone is not flat. It is a calmer runout slope so dice still rolls,
  // but does not keep gaining strong forward energy forever.
const settlingSlopeAngle = 0.028;

  // Transition point between energetic runway and calmer receiving zone.
  const transitionZ = floorZ + 0.95;

  const slopeAngle = runwaySlopeAngle;

  const backEdgeZ = floorZ - halfDepth;
  const frontEdgeZ = floorZ + halfDepth;
  const backWallZ = backEdgeZ - 0.12;
  const trapdoorZ = backWallZ + 0.82;

  const floorYAtZ = (z: number) => {
    if (z <= transitionZ) {
      return floorY - (z - floorZ) * Math.sin(runwaySlopeAngle);
    }

    const transitionY =
      floorY - (transitionZ - floorZ) * Math.sin(runwaySlopeAngle);

    return transitionY - (z - transitionZ) * Math.sin(settlingSlopeAngle);
  };

  const upperFloorDepth = transitionZ - backEdgeZ;
  const settlingFloorDepth = frontEdgeZ - transitionZ;

  const upperFloorZ = backEdgeZ + upperFloorDepth / 2;
  const settlingFloorZ = transitionZ + settlingFloorDepth / 2;

  const upperFloorY = floorYAtZ(upperFloorZ);
  const settlingFloorY = floorYAtZ(settlingFloorZ);

  const frontBorderY = floorYAtZ(frontEdgeZ) + 0.26;
  const sideRailY = floorY + 0.08;

  return {
    floorWidth,
    floorDepth,
    halfWidth,
    halfDepth,
    floorY,
    floorZ,
    slopeAngle,
    runwaySlopeAngle,
    settlingSlopeAngle,
    backEdgeZ,
    frontEdgeZ,
    transitionZ,
    upperFloorDepth,
    settlingFloorDepth,
    upperFloorZ,
    settlingFloorZ,
    upperFloorY,
    settlingFloorY,
    backWallZ,
    trapdoorZ,
    frontBorderY,
    sideRailY,
  };
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

            {/* visual-only royal felt center depth; no collider */}
      <mesh
        position={[0, table.floorY + 0.116, table.floorZ + 1.22]}
        rotation={[table.settlingSlopeAngle, 0, 0]}
        receiveShadow
      >
        <boxGeometry args={[table.floorWidth - 1.28, 0.005, 2.95]} />
        <meshStandardMaterial
          color="#7d0714"
          roughness={1}
          metalness={0}
          transparent
          opacity={0.18}
          depthWrite={false}
        />
      </mesh>

      {/* visual-only soft front shadow; no collider */}
      <mesh
        position={[0, table.floorY + 0.118, table.frontEdgeZ - 0.72]}
        rotation={[table.settlingSlopeAngle, 0, 0]}
        receiveShadow
      >
        <boxGeometry args={[table.floorWidth - 0.92, 0.005, 0.72]} />
        <meshStandardMaterial
          color="#230105"
          roughness={1}
          metalness={0}
          transparent
          opacity={0.22}
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

function TableRunway({ table }: { table: TableMeasurements }) {
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
      />

            {/* visual-only soft inner felt tone; no collider */}
      <mesh
        position={[0, table.floorY + 0.102, table.floorZ + 0.32]}
        rotation={[table.slopeAngle, 0, 0]}
        receiveShadow
      >
        <boxGeometry args={[table.floorWidth - 0.72, 0.006, table.floorDepth - 1.28]} />
        <meshStandardMaterial
          {...TABLE_MATERIALS.runwayInset}
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

function TrapdoorFlaps({
  table,
  activeDieIndex,
  sequenceRunning,
  displayOnly,
}: {
  table: TableMeasurements;
  activeDieIndex: number;
  sequenceRunning: boolean;
  displayOnly: boolean;
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
        const openAngle = 1.22;

        return (
          <group
            key={`trapdoor-flap-${index}`}
            position={[x, 2.42, table.backWallZ + 0.18]}
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
}: {
  table: TableMeasurements;
  activeDieIndex: number;
  sequenceRunning: boolean;
  diceShapePreset: DiceShapePreset;
  mountedDiceRackMode: MountedDiceRackMode;
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

        const waitingDiePosition: [number, number, number] = [
          x,
          2.82,
          table.backWallZ + 0.42,
        ];

        const waitingDieScale = 0.92;
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
}: {
  table: TableMeasurements;
  testMode: TestMode;
  forceVisible?: boolean;
}) {
  if (testMode !== "trap" && !forceVisible) return null;

  return (
    <>
      <group
        position={[0, 0.36, table.backWallZ + 0.78]}
        rotation={[0.12, 0, 0]}
      >
        <mesh receiveShadow castShadow rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.072, 0.072, table.floorWidth - 0.28, 32]} />
          <meshStandardMaterial {...TABLE_MATERIALS.goldAccent} />
        </mesh>
      </group>

<CuboidCollider
  args={[1.675, 0.04, 0.095]}
  position={[0, 0.39, table.backWallZ + 0.78]}
  rotation={[0.12, 0, 0]}
  restitution={TABLE_DEFLECTOR_RESTITUTION}
  friction={TABLE_DEFLECTOR_FRICTION}
/>

{/* subtle upper contact shoulder: helps dice visibly catch/graze the bar instead of gliding past it */}
<CuboidCollider
  args={[1.58, 0.032, 0.075]}
  position={[0, 0.55, table.backWallZ + 0.735]}
  rotation={[0.32, 0, 0]}
  restitution={TABLE_DEFLECTOR_SHOULDER_RESTITUTION}
  friction={TABLE_DEFLECTOR_SHOULDER_FRICTION}
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
restitution={0.36}
friction={0.24}
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
restitution={0.36}
friction={0.24}
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
  restitution={0.12}
  friction={0.5}
/>

<CuboidCollider
  args={[0.11, 1.16, table.halfDepth]}
  position={[-table.halfWidth - 0.04, 0.08, table.floorZ]}
restitution={0.24}
friction={0.34}
/>

<CuboidCollider
  args={[0.11, 1.16, table.halfDepth]}
  position={[table.halfWidth + 0.04, 0.08, table.floorZ]}
restitution={0.24}
friction={0.34}
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
}: {
  testMode: TestMode;
  activeDieIndex: number;
  sequenceRunning: boolean;
  displayOnly: boolean;
  diceShapePreset: DiceShapePreset;
  mountedDiceRackMode: MountedDiceRackMode;
  showDice?: boolean;
  forceShowStumbleBar?: boolean;
}) {
  const table = createTableMeasurements();

  return (
    <RigidBody type="fixed" colliders={false}>
<TableRunway table={table} />
<TableBackboard table={table} />
<TrapdoorFlaps
        table={table}
        activeDieIndex={activeDieIndex}
        sequenceRunning={sequenceRunning}
        displayOnly={displayOnly}
      />
{showDice ? (
  <WaitingDiceRack
    table={table}
    activeDieIndex={activeDieIndex}
    sequenceRunning={sequenceRunning}
    diceShapePreset={diceShapePreset}
    mountedDiceRackMode={mountedDiceRackMode}
  />
) : null}
      <StumbleBar
        table={table}
        testMode={testMode}
        forceVisible={forceShowStumbleBar}
      />
      <FrontLip table={table} />
      <TraySideRails table={table} />
      <TableSafetyGuards table={table} />
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
}) {
  const shouldRenderActiveDice =
    !displayOnly && showDice && sequenceRunning;

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

      <Physics debug={debugPhysics} gravity={[0, -13.2, 0]}>
<TrayBox
  testMode={testMode}
  activeDieIndex={activeDieIndex}
  sequenceRunning={sequenceRunning}
  displayOnly={displayOnly}
  diceShapePreset={diceShapePreset}
  mountedDiceRackMode={mountedDiceRackMode}
  showDice={showDice}
  forceShowStumbleBar={forceShowStumbleBar}
/>

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
/>
    </Canvas>
  );
}
