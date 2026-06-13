// src/components/games/six-animal/physics/physicsConstants.ts

import { Vector3 } from "three";

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

export type DiceAnimalLabel =
  | "Tiger"
  | "Dragon"
  | "Rooster"
  | "Fish"
  | "Crab"
  | "Elephant";

export type DiceFaceCandidate = {
  axis: string;
  label: DiceAnimalLabel;
  direction: Vector3;
};

export type DiceShapeConfig = {
  size: number;
  cornerRadius: number;
  smoothness: number;
};

export type DiceColliderConfig = {
  args: [number, number, number, number];
};

export type DiceLaunchVelocity = {
  x: number;
  y: number;
  z: number;
};

export type DiceLaunchMode = "trap" | "runway";

export type DiceLaunchInput = {
  activeDieIndex: number;
  resetKey: number;
};

export type TargetLaunchRecipeProfile = {
  preRollDeg: number;
  scrambleDeg: number;
  linX: number;
  linY: number;
  linZ: number;
  angX: number;
  angY: number;
  angZ: number;
};

export type TableMeasurements = {
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

export const PHYSICS_GRAVITY: [number, number, number] = [0, -13.2, 0];

export const worldUp = new Vector3(0, 1, 0);

export const VALID_FACE_SCORE_THRESHOLD = 0.82;

export const DICE_HOLDER_X_POSITIONS: [number, number, number] = [-1.0, 0, 1.0];

export const RUNWAY_ACTIVE_DICE_START_Y = 0.25;
export const RUNWAY_ACTIVE_DICE_START_Z = -1.45;

export const TRAP_ACTIVE_DICE_START_Y = 2.62;
export const TRAP_ACTIVE_DICE_START_Z = -2.58;

export const RUNWAY_ACTIVE_DICE_START_ROTATION: [number, number, number] = [
  0.72,
  0.42,
  -0.58,
];

export const DISPLAY_DICE_ROTATIONS: [number, number, number][] = [
  [-Math.PI / 2, 0, 0],
  [0, Math.PI / 2, 0],
  [0, -Math.PI / 2, 0],
];

export const DICE_SIZE = 1.08;
export const DICE_CORNER_RADIUS = 0.26;
export const DICE_SMOOTHNESS = 16;

export const DICE_SHAPE_PRESET_CONFIG: Record<
  DiceShapePreset,
  DiceShapeConfig
> = {
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

export function getDiceShapeConfig(
  preset: DiceShapePreset
): DiceShapeConfig {
  return DICE_SHAPE_PRESET_CONFIG[preset] ?? DICE_SHAPE_PRESET_CONFIG.current;
}

export const DICE_COLLIDER_PRESET_CONFIG: Record<
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

export function getDiceColliderConfig(
  preset: DiceColliderPreset
): DiceColliderConfig {
  return (
    DICE_COLLIDER_PRESET_CONFIG[preset] ??
    DICE_COLLIDER_PRESET_CONFIG.current
  );
}

export const PRODUCTION_DICE_SHAPE_PRESET: DiceShapePreset = "more-round";
export const PRODUCTION_DICE_COLLIDER_PRESET: DiceColliderPreset = "softer";

export const TABLE_FRONT_VISUAL_LIP_HEIGHT = 0.46;
export const TABLE_FRONT_COLLIDER_HEIGHT = 0.36;

export const TABLE_FRONT_REBOUND_RESTITUTION = 0.74;
export const TABLE_FRONT_REBOUND_FRICTION = 0.13;
export const TABLE_FRONT_KEEPER_RESTITUTION = 0.3;
export const TABLE_FRONT_KEEPER_FRICTION = 0.24;

export const TABLE_DEFLECTOR_RESTITUTION = 0.86;
export const TABLE_DEFLECTOR_FRICTION = 0.075;
export const TABLE_DEFLECTOR_SHOULDER_RESTITUTION = 0.76;
export const TABLE_DEFLECTOR_SHOULDER_FRICTION = 0.09;

export const TABLE_SIDE_RAIL_RESTITUTION = 0.36;
export const TABLE_SIDE_RAIL_FRICTION = 0.24;

export const TABLE_SAFETY_FRONT_RESTITUTION = 0.12;
export const TABLE_SAFETY_FRONT_FRICTION = 0.5;
export const TABLE_SAFETY_SIDE_RESTITUTION = 0.24;
export const TABLE_SAFETY_SIDE_FRICTION = 0.34;

export function getActiveDiceStartPosition({
  testMode,
  activeDieX,
}: {
  testMode: DiceLaunchMode;
  activeDieX: number;
}): [number, number, number] {
  return testMode === "runway"
    ? [activeDieX, RUNWAY_ACTIVE_DICE_START_Y, RUNWAY_ACTIVE_DICE_START_Z]
    : [activeDieX, TRAP_ACTIVE_DICE_START_Y, TRAP_ACTIVE_DICE_START_Z];
}

export function getFallbackActiveDiceStartRotation({
  testMode,
  activeDieIndex,
}: {
  testMode: DiceLaunchMode;
  activeDieIndex: number;
}): [number, number, number] {
  return testMode === "runway"
    ? RUNWAY_ACTIVE_DICE_START_ROTATION
    : DISPLAY_DICE_ROTATIONS[activeDieIndex] ?? [0, 0, 0];
}

export function getDiceLateralDrift({
  activeDieIndex,
  resetKey,
}: DiceLaunchInput) {
  if (activeDieIndex === 0) return 0.035;
  if (activeDieIndex === 2) return -0.035;

  return resetKey % 2 === 0 ? 0.018 : -0.018;
}

export function getDiceNaturalDirection({
  activeDieIndex,
  resetKey,
}: DiceLaunchInput) {
  if (activeDieIndex === 0) return 0.055;
  if (activeDieIndex === 2) return -0.055;

  return resetKey % 2 === 0 ? 0.035 : -0.035;
}

export function getDefaultRunwayLaunchLinvel({
  lateralDrift,
}: {
  lateralDrift: number;
}): DiceLaunchVelocity {
  return {
    x: lateralDrift,
    y: -0.55,
    z: 0.75,
  };
}

export function getDefaultRunwayLaunchAngvel({
  resetKey,
}: {
  resetKey: number;
}): DiceLaunchVelocity {
  return {
    x: 1.8 + resetKey * 0.04,
    y: -0.8 + resetKey * 0.03,
    z: 2.2 + resetKey * 0.04,
  };
}

export function getDefaultTrapLaunchLinvel({
  naturalDirection,
  lateralDrift,
}: {
  naturalDirection: number;
  lateralDrift: number;
}): DiceLaunchVelocity {
  return {
    x: naturalDirection + lateralDrift * 0.32,
    y: -0.92,
    z: 0.56,
  };
}

export function getDefaultTrapLaunchAngvel({
  activeDieIndex,
  resetKey,
}: DiceLaunchInput): DiceLaunchVelocity {
  return {
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
  };
}

export function getTargetLaunchSeed(targetAnimal: DiceAnimalLabel) {
  if (targetAnimal === "Tiger") return 1;
  if (targetAnimal === "Dragon") return 2;
  if (targetAnimal === "Rooster") return 3;
  if (targetAnimal === "Fish") return 4;
  if (targetAnimal === "Crab") return 5;
  if (targetAnimal === "Elephant") return 6;

  return 0;
}

export function getTargetLaunchSideBias(targetAnimal: DiceAnimalLabel) {
  if (targetAnimal === "Rooster") return 0.075;
  if (targetAnimal === "Fish") return -0.075;
  if (targetAnimal === "Crab") return 0.035;
  if (targetAnimal === "Elephant") return -0.035;
  if (targetAnimal === "Tiger") return 0.018;
  if (targetAnimal === "Dragon") return -0.018;

  return 0;
}

export const TARGET_LAUNCH_RECIPE_PROFILES: Record<
  DiceAnimalLabel,
  TargetLaunchRecipeProfile
> = {
  Tiger: {
    preRollDeg: -118,
    scrambleDeg: 7,
    linX: 0.018,
    linY: -0.9,
    linZ: 0.62,
    angX: 2.45,
    angY: -0.16,
    angZ: 0.55,
  },
  Dragon: {
    preRollDeg: 118,
    scrambleDeg: 7,
    linX: -0.018,
    linY: -0.9,
    linZ: 0.62,
    angX: -2.45,
    angY: 0.16,
    angZ: -0.55,
  },
  Rooster: {
    preRollDeg: -126,
    scrambleDeg: 8,
    linX: 0.05,
    linY: -0.92,
    linZ: 0.64,
    angX: 2.18,
    angY: 0.72,
    angZ: 0.42,
  },
  Fish: {
    preRollDeg: 126,
    scrambleDeg: 8,
    linX: -0.05,
    linY: -0.92,
    linZ: 0.64,
    angX: -2.18,
    angY: -0.72,
    angZ: -0.42,
  },
  Crab: {
    preRollDeg: -112,
    scrambleDeg: 8,
    linX: 0.028,
    linY: -0.91,
    linZ: 0.68,
    angX: 2.62,
    angY: -0.22,
    angZ: 0.72,
  },
  Elephant: {
    preRollDeg: 112,
    scrambleDeg: 8,
    linX: -0.028,
    linY: -0.91,
    linZ: 0.68,
    angX: -2.62,
    angY: 0.22,
    angZ: -0.72,
  },
};

export function getTargetLaunchRecipeProfile(
  targetAnimal: DiceAnimalLabel
): TargetLaunchRecipeProfile {
  return TARGET_LAUNCH_RECIPE_PROFILES[targetAnimal];
}

export const diceFaceCandidates: DiceFaceCandidate[] = [
  
  { axis: "+Y", label: "Tiger", direction: new Vector3(0, 1, 0) },
  { axis: "-Y", label: "Dragon", direction: new Vector3(0, -1, 0) },
  { axis: "+X", label: "Rooster", direction: new Vector3(1, 0, 0) },
  { axis: "-X", label: "Fish", direction: new Vector3(-1, 0, 0) },
  { axis: "+Z", label: "Crab", direction: new Vector3(0, 0, 1) },
  { axis: "-Z", label: "Elephant", direction: new Vector3(0, 0, -1) },
];

export function createTableMeasurements(): TableMeasurements {
  const floorWidth = 4.45;
  const floorDepth = 6.75;
  const halfWidth = floorWidth / 2;
  const halfDepth = floorDepth / 2;

  const floorY = -1.05;
  const floorZ = 0.35;

  const runwaySlopeAngle = 0.3;
  const settlingSlopeAngle = 0.028;
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