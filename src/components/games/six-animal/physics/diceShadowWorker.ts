/// <reference lib="webworker" />

// src/components/games/six-animal/physics/diceShadowWorker.ts

import RAPIER from "@dimforge/rapier3d-compat";
import { Euler, MathUtils, Quaternion, Vector3 } from "three";

import {
  DICE_HOLDER_X_POSITIONS,
  PHYSICS_GRAVITY,
  TABLE_DEFLECTOR_FRICTION,
  TABLE_DEFLECTOR_RESTITUTION,
  TABLE_DEFLECTOR_SHOULDER_FRICTION,
  TABLE_DEFLECTOR_SHOULDER_RESTITUTION,
  TABLE_FRONT_COLLIDER_HEIGHT,
  TABLE_FRONT_KEEPER_FRICTION,
  TABLE_FRONT_KEEPER_RESTITUTION,
  TABLE_FRONT_REBOUND_FRICTION,
  TABLE_FRONT_REBOUND_RESTITUTION,
  TABLE_SAFETY_FRONT_FRICTION,
  TABLE_SAFETY_FRONT_RESTITUTION,
  TABLE_SAFETY_SIDE_FRICTION,
  TABLE_SAFETY_SIDE_RESTITUTION,
  TABLE_SIDE_RAIL_FRICTION,
  TABLE_SIDE_RAIL_RESTITUTION,
  VALID_FACE_SCORE_THRESHOLD,
  createTableMeasurements,
  diceFaceCandidates,
  getActiveDiceStartPosition,
  getDefaultTrapLaunchAngvel,
  getDefaultTrapLaunchLinvel,
  getDiceLateralDrift,
  getDiceNaturalDirection,
  worldUp,
} from "./physicsConstants";
import type {
  DiceShadowFinalFaceStatus,
  DiceShadowMotionGrade,
  DiceShadowMotionMetrics,
  DiceShadowWorkerRequest,
  DiceShadowWorkerResponse,
  DiceTrajectoryFrame,
} from "./diceShadowTypes";

const workerScope = self as unknown as DedicatedWorkerGlobalScope;

let rapierReadyPromise: Promise<void> | null = null;

const ACCEPTED_MOTION_SCORE = 58;
const PREMIUM_MOTION_SCORE = 74;
const RECORDED_TRAJECTORY_REPLAY_TIME_SCALE = 1.35;

const SHADOW_ATTEMPT_MIN = 180;
const SHADOW_ATTEMPT_MAX = 420;
const SHADOW_EARLY_ACCEPT_MIN_ATTEMPTS = 120;
const SHADOW_EARLY_ACCEPT_SOUL_SCORE = 72;

const MIN_RAW_SOUL_ACTIVE_SECONDS = 3.7;
const IDEAL_RAW_SOUL_ACTIVE_MIN_SECONDS = 3.85;
const IDEAL_RAW_SOUL_ACTIVE_MAX_SECONDS = 4.75;
const MAX_RAW_SOUL_ACTIVE_SECONDS = 5.8;

const MIN_SOUL_ACTIVE_SECONDS = 4.0;
const IDEAL_SOUL_ACTIVE_MIN_SECONDS = 5.0;
const IDEAL_SOUL_ACTIVE_MAX_SECONDS = 6.6;
const MAX_SOUL_ACTIVE_SECONDS = 7.4;

const MAX_SOUL_DEAD_SLIDE_SECONDS = 0.75;
const MIN_SOUL_LATE_TUMBLE_TURNS = 0.35;
const MIN_SOUL_DEFLECTOR_BOUNCE_SCORE = 0.35;
const MAX_SOUL_FRONT_STOP_RISK = 0.72;

type ShadowCuboid = {
  args: [number, number, number];
  position: [number, number, number];
  rotation?: [number, number, number];
  restitution?: number;
  friction?: number;
};

type ShadowAttemptSuccess = Extract<
  DiceShadowWorkerResponse,
  { kind: "search-success" }
>;

type ShadowAttemptResult = ShadowAttemptSuccess & {
  motionRejected: boolean;
};

function ensureRapierReady() {
  if (!rapierReadyPromise) {
    rapierReadyPromise = RAPIER.init();
  }

  return rapierReadyPromise;
}

function createRapierQuaternionFromEuler(
  rotation: [number, number, number] = [0, 0, 0]
) {
  const quaternion = new Quaternion().setFromEuler(
    new Euler(rotation[0], rotation[1], rotation[2], "XYZ")
  );

  return {
    x: quaternion.x,
    y: quaternion.y,
    z: quaternion.z,
    w: quaternion.w,
  };
}

function captureTrajectoryFrame(
  body: RAPIER.RigidBody,
  t: number
): DiceTrajectoryFrame {
  const position = body.translation();
  const rotation = body.rotation();

  return {
    t,
    position: [position.x, position.y, position.z],
    rotation: [rotation.x, rotation.y, rotation.z, rotation.w],
  };
}

function detectShadowTopFace(rotation: {
  x: number;
  y: number;
  z: number;
  w: number;
}) {
  const quaternion = new Quaternion(
    rotation.x,
    rotation.y,
    rotation.z,
    rotation.w
  );

  let best = diceFaceCandidates[0];
  let bestScore = -Infinity;

  for (const candidate of diceFaceCandidates) {
    const worldDirection = new Vector3(
      candidate.direction.x,
      candidate.direction.y,
      candidate.direction.z
    )
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
  const status: DiceShadowFinalFaceStatus =
    clampedScore >= VALID_FACE_SCORE_THRESHOLD ? "accepted" : "cocked";

  return {
    status,
    finalAnimal: best.label,
    confidence,
    tiltDegrees,
  };
}

type TrajectoryMotionQuality = {
  grade: DiceShadowMotionGrade;
  metrics: DiceShadowMotionMetrics;
  notes: string[];
  rejected: boolean;
  score: number;
};

function clamp01(value: number) {
  return MathUtils.clamp(value, 0, 1);
}

function roundMotionMetric(value: number, digits = 2) {
  const scale = 10 ** digits;

  return Math.round(value * scale) / scale;
}

function getVisualActiveSeconds(activeSeconds: number) {
  return activeSeconds * RECORDED_TRAJECTORY_REPLAY_TIME_SCALE;
}

function getRangeScore({
  value,
  minimum,
  preferredMinimum,
  preferredMaximum,
  maximum,
}: {
  value: number;
  minimum: number;
  preferredMinimum: number;
  preferredMaximum: number;
  maximum: number;
}) {
  if (value <= minimum || value >= maximum) return 0;
  if (value >= preferredMinimum && value <= preferredMaximum) return 1;

  if (value < preferredMinimum) {
    return clamp01((value - minimum) / (preferredMinimum - minimum));
  }

  return clamp01((maximum - value) / (maximum - preferredMaximum));
}

function getTrajectoryMotionQuality(
  frames: DiceTrajectoryFrame[],
  table: ReturnType<typeof createTableMeasurements>
): TrajectoryMotionQuality {
  if (frames.length < 4) {
    return {
      grade: "weak",
metrics: {
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
},
      notes: ["too few frames"],
      rejected: true,
      score: 0,
    };
  }

  let totalTravel = 0;
  let horizontalTravel = 0;
let tumbleRadians = 0;
let lateTumbleRadians = 0;
let directionChangeRadians = 0;
  let directionChangeCount = 0;
  let deadSlideSeconds = 0;
let maxVerticalImpulse = 0;
let maxDeflectorImpulse = 0;
let maxZ = frames[0].position[2];
  let minX = frames[0].position[0];
  let maxX = frames[0].position[0];
  let lastActiveSeconds = 0;
  let previousHorizontalDirection: Vector3 | null = null;
  let previousVerticalSpeed: number | null = null;

  const startFrame = frames[0];
  const finalFrame = frames[frames.length - 1];
  const startPosition = new Vector3(...startFrame.position);
  const finalPosition = new Vector3(...finalFrame.position);
  const finalWindowStart = Math.max(startFrame.t, finalFrame.t - 0.72);
  let finalWindowTravel = 0;
  let finalWindowTumble = 0;
  const deflectorZ = table.backWallZ + 0.78;

  for (let index = 1; index < frames.length; index += 1) {
    const previousFrame = frames[index - 1];
    const currentFrame = frames[index];
    const dt = Math.max(0.001, currentFrame.t - previousFrame.t);

    const previousPosition = new Vector3(...previousFrame.position);
    const currentPosition = new Vector3(...currentFrame.position);
    const movement = currentPosition.clone().sub(previousPosition);
    const horizontalMovement = new Vector3(movement.x, 0, movement.z);
    const horizontalDistance = horizontalMovement.length();
    const horizontalSpeed = horizontalDistance / dt;
    const verticalSpeed = movement.y / dt;

    totalTravel += movement.length();
    horizontalTravel += horizontalDistance;
    maxZ = Math.max(maxZ, currentPosition.z);
    minX = Math.min(minX, currentPosition.x);
    maxX = Math.max(maxX, currentPosition.x);

if (previousVerticalSpeed !== null && previousVerticalSpeed < -0.35) {
  const verticalImpulse = verticalSpeed - previousVerticalSpeed;

  maxVerticalImpulse = Math.max(maxVerticalImpulse, verticalImpulse);

  const nearDeflector =
    currentFrame.t <= 1.45 && Math.abs(currentPosition.z - deflectorZ) <= 0.58;

  if (nearDeflector) {
    maxDeflectorImpulse = Math.max(maxDeflectorImpulse, verticalImpulse);
  }
}

    previousVerticalSpeed = verticalSpeed;

    if (horizontalDistance > 0.015 && horizontalSpeed > 0.08) {
      const currentHorizontalDirection = horizontalMovement.clone().normalize();

      if (previousHorizontalDirection) {
        const turnAngle = Math.acos(
          MathUtils.clamp(
            currentHorizontalDirection.dot(previousHorizontalDirection),
            -1,
            1
          )
        );

        directionChangeRadians += turnAngle;

        if (turnAngle > 0.28) {
          directionChangeCount += 1;
        }
      }

      previousHorizontalDirection = currentHorizontalDirection;
    }

    const previousRotation = new Quaternion(
      previousFrame.rotation[0],
      previousFrame.rotation[1],
      previousFrame.rotation[2],
      previousFrame.rotation[3]
    ).normalize();
    const currentRotation = new Quaternion(
      currentFrame.rotation[0],
      currentFrame.rotation[1],
      currentFrame.rotation[2],
      currentFrame.rotation[3]
    ).normalize();
    const tumbleDelta = previousRotation.angleTo(currentRotation);
    const tumbleSpeed = tumbleDelta / dt;

    tumbleRadians += tumbleDelta;
    if (currentFrame.t >= 1.4) {
  lateTumbleRadians += tumbleDelta;
}

// Make dead slide detection stricter: slower speeds with low tumble still count as a bad slide
    if (
      horizontalSpeed > 0.08 &&
      tumbleSpeed < 0.55 &&
      currentFrame.t > 0.85
    ) {
      deadSlideSeconds += dt;
    }

    if (
      horizontalSpeed > 0.08 ||
      tumbleSpeed > 0.45 ||
      Math.abs(verticalSpeed) > 0.08
    ) {
      lastActiveSeconds = currentFrame.t;
    }

    if (currentFrame.t >= finalWindowStart) {
      finalWindowTravel += movement.length();
      finalWindowTumble += tumbleDelta;
    }
  }

  const netHorizontalDistance = new Vector3(
    finalPosition.x - startPosition.x,
    0,
    finalPosition.z - startPosition.z
  ).length();
  const straightness =
    horizontalTravel > 0.001 ? netHorizontalDistance / horizontalTravel : 1;
  const lateralTravel = maxX - minX;
  const tumbleTurns = tumbleRadians / (Math.PI * 2);
const lateTumbleTurns = lateTumbleRadians / (Math.PI * 2);
const activeSeconds = Math.max(0, lastActiveSeconds - startFrame.t);
const visualActiveSeconds = getVisualActiveSeconds(activeSeconds);
  const firstImpactScore = clamp01((maxVerticalImpulse - 0.45) / 2.25);
  const deflectorBounceScore = clamp01((maxDeflectorImpulse - 0.28) / 1.75);
  const finalWindowActivity = finalWindowTravel * 3.2 + finalWindowTumble * 0.95;
  const finalSettleScore = clamp01(1 - (finalWindowActivity - 0.035) / 0.28);
  const stoppedAtFront = finalPosition.z > table.frontEdgeZ - 0.36;
  const reachedFrontWall = maxZ > table.frontEdgeZ - 0.16;
  const frontStopRisk = clamp01(
    (stoppedAtFront ? 0.38 : 0) +
      (reachedFrontWall ? 0.22 : 0) +
      (straightness > 0.92 ? 0.2 : 0) +
      (directionChangeCount < 2 ? 0.14 : 0) +
      (lateralTravel < 0.16 ? 0.1 : 0)
  );

  const travelScore = clamp01((horizontalTravel - 1.05) / 2.3);
  const tumbleScore = clamp01((tumbleTurns - 0.55) / 1.8);
  const directionScore =
    clamp01(directionChangeCount / 3) * 0.7 +
    clamp01(directionChangeRadians / 1.9) * 0.3;
  const lateralScore = clamp01(lateralTravel / 0.42);
const activeDurationScore = getRangeScore({
  value: visualActiveSeconds,
  minimum: MIN_SOUL_ACTIVE_SECONDS,
  preferredMinimum: IDEAL_SOUL_ACTIVE_MIN_SECONDS,
  preferredMaximum: IDEAL_SOUL_ACTIVE_MAX_SECONDS,
  maximum: MAX_SOUL_ACTIVE_SECONDS,
});

const rawActiveDurationScore = getRangeScore({
  value: activeSeconds,
  minimum: MIN_RAW_SOUL_ACTIVE_SECONDS,
  preferredMinimum: IDEAL_RAW_SOUL_ACTIVE_MIN_SECONDS,
  preferredMaximum: IDEAL_RAW_SOUL_ACTIVE_MAX_SECONDS,
  maximum: MAX_RAW_SOUL_ACTIVE_SECONDS,
});

const lateTumbleScore = clamp01(lateTumbleTurns / 0.9);

  const penalties =
    clamp01((straightness - 0.9) / 0.1) * 16 +
    clamp01((deadSlideSeconds - 0.35) / 0.8) * 25 + // Heavily punish slides
    frontStopRisk * 24 +
    clamp01((0.32 - deflectorBounceScore) / 0.32) * 9 +
    clamp01((0.42 - firstImpactScore) / 0.42) * 10 +
    clamp01((0.75 - tumbleTurns) / 0.75) * 14 + // Demand more total tumble
    clamp01((4.9 - visualActiveSeconds) / 1.5) * 16 +
    clamp01((MIN_RAW_SOUL_ACTIVE_SECONDS - activeSeconds) / 0.7) * 34 +
    clamp01((0.45 - lateTumbleScore) / 0.45) * 12 + // Punish lack of late-stage rolling
    clamp01((0.45 - finalSettleScore) / 0.45) * 8;

  const rawScore =
    firstImpactScore * 11 +
    deflectorBounceScore * 13 +
    tumbleScore * 18 +
    directionScore * 16 +
    travelScore * 11 +
    lateralScore * 8 +
    activeDurationScore * 14 +
    rawActiveDurationScore * 18 +
    lateTumbleScore * 12 + // Strongly reward late tumbling
    finalSettleScore * 10 +
    clamp01((firstImpactScore + directionChangeCount * 0.22) / 1.35) * 11;

  const score = Math.round(MathUtils.clamp(rawScore - penalties, 0, 100));
  const hardRejects: string[] = [];

if (firstImpactScore < 0.2) hardRejects.push("weak first impact");
if (tumbleTurns < 0.75) hardRejects.push("low tumble");
if (horizontalTravel < 1.05) hardRejects.push("short travel");
if (deflectorBounceScore < MIN_SOUL_DEFLECTOR_BOUNCE_SCORE) {
  hardRejects.push("weak deflector bounce");
}
  if (directionChangeCount === 0 && directionChangeRadians < 0.45) {
    hardRejects.push("no meaningful direction change");
  }
  if (straightness > 0.97 && lateralTravel < 0.12 && horizontalTravel > 1.6) {
    hardRejects.push("straight-line slide");
  }
if (visualActiveSeconds < MIN_SOUL_ACTIVE_SECONDS) {
  hardRejects.push("dies too early");
}

if (activeSeconds < MIN_RAW_SOUL_ACTIVE_SECONDS) {
  hardRejects.push("raw motion too short");
}

if (visualActiveSeconds > MAX_SOUL_ACTIVE_SECONDS) {
  hardRejects.push("too long motion");
}

if (deadSlideSeconds > MAX_SOUL_DEAD_SLIDE_SECONDS) {
  hardRejects.push("race-car slide");
}
  if (frontStopRisk > MAX_SOUL_FRONT_STOP_RISK) {
  hardRejects.push("front-border ending");
}

if (lateralTravel < 0.22 && horizontalTravel > 1.35 && directionChangeCount < 2) {
  hardRejects.push("not enough side life");
}
  if (finalSettleScore < 0.32) hardRejects.push("not readable at finish");

const grade: DiceShadowMotionGrade =
  hardRejects.length > 0 || score < ACCEPTED_MOTION_SCORE
    ? "weak"
    : score >= PREMIUM_MOTION_SCORE
      ? "premium"
      : "accepted";

  const notes = [
    firstImpactScore >= 0.62 ? "strong first impact" : "soft first impact",
deflectorBounceScore >= 0.42 ? "deflector bounce" : "weak deflector bounce",
    tumbleTurns >= 1.15 ? "real tumble" : "limited tumble",
directionChangeCount >= 2 ? "direction change" : "mostly one direction",
activeSeconds >= IDEAL_RAW_SOUL_ACTIVE_MIN_SECONDS &&
activeSeconds <= IDEAL_RAW_SOUL_ACTIVE_MAX_SECONDS
  ? "real raw life"
  : activeSeconds >= MIN_RAW_SOUL_ACTIVE_SECONDS
    ? "barely real raw life"
    : "short alive motion",
lateTumbleScore >= 0.42 ? "late rolling life" : "weak late roll",
deadSlideSeconds <= 0.6 ? "little dead slide" : "dead-slide risk",
finalSettleScore >= 0.72 ? "readable settle" : "busy final settle",
    ...hardRejects.map((reject) => `reject: ${reject}`),
  ];

  return {
    grade,
metrics: {
  activeSeconds: roundMotionMetric(activeSeconds),
  visualActiveSeconds: roundMotionMetric(visualActiveSeconds),
  deadSlideSeconds: roundMotionMetric(deadSlideSeconds),
  deflectorBounceScore: roundMotionMetric(deflectorBounceScore),
  directionChangeCount,
  directionChangeRadians: roundMotionMetric(directionChangeRadians),
  finalSettleScore: roundMotionMetric(finalSettleScore),
  firstImpactScore: roundMotionMetric(firstImpactScore),
  frontStopRisk: roundMotionMetric(frontStopRisk),
  horizontalTravel: roundMotionMetric(horizontalTravel),
  lateTumbleScore: roundMotionMetric(lateTumbleScore),
  lateTumbleTurns: roundMotionMetric(lateTumbleTurns),
  lateralTravel: roundMotionMetric(lateralTravel),
  straightness: roundMotionMetric(straightness),
  totalTravel: roundMotionMetric(totalTravel),
  tumbleTurns: roundMotionMetric(tumbleTurns),
},
    notes,
    rejected: grade === "weak",
    score,
  };
}

function getNaturalAttemptWave(seed: number, salt: number) {
  const raw = Math.sin(seed * 12.9898 + salt * 78.233) * 43758.5453;

  return (raw - Math.floor(raw)) * 2 - 1;
}

function createNaturalAttemptLaunch({
  activeDieIndex,
  attemptNumber,
  fallbackLinvel,
  fallbackAngvel,
}: {
  activeDieIndex: number;
  attemptNumber: number;
  fallbackLinvel: { x: number; y: number; z: number };
  fallbackAngvel: { x: number; y: number; z: number };
}) {
  const seed = attemptNumber + activeDieIndex * 101;
  const waveA = getNaturalAttemptWave(seed, 1);
  const waveB = getNaturalAttemptWave(seed, 2);
  const waveC = getNaturalAttemptWave(seed, 3);
  const waveD = getNaturalAttemptWave(seed, 4);
  const energy = (attemptNumber % 5) / 4;
  const rollLife = 1.04 + ((attemptNumber % 6) / 5) * 0.3;

  const launchQuaternion = new Quaternion()
    .setFromEuler(
      new Euler(
        MathUtils.degToRad(42 + waveA * 145 + energy * 38),
        MathUtils.degToRad(waveB * 180 + activeDieIndex * 31),
        MathUtils.degToRad(waveC * 180 + attemptNumber * 17),
        "XYZ"
      )
    )
    .normalize();

  return {
    rotation: {
      x: launchQuaternion.x,
      y: launchQuaternion.y,
      z: launchQuaternion.z,
      w: launchQuaternion.w,
    },
linvel: {
  // Wall-hug release: small lateral variation, not a side throw.
  x:
    fallbackLinvel.x +
    waveA * 0.34 +
    waveD * 0.12 +
    (activeDieIndex - 1) * 0.06,

  // Downward fall from the mounted holder.
  y:
    fallbackLinvel.y -
    0.08 -
    energy * 0.08 +
    waveB * 0.06,

  // Enough forward reach to meet the deflector after falling,
  // but not enough to jump out from the wall.
  z: Math.max(
    0.34,
    fallbackLinvel.z - 0.12 + energy * 0.06 + waveC * 0.05
  ),
},
angvel: {
  // Micro angular life only. Do not add forward speed.
  x: fallbackAngvel.x * (1.66 + energy * 0.46) * rollLife + waveC * 2.45,
  y: fallbackAngvel.y + waveA * 2.35 + (activeDieIndex - 1) * 0.65,
  z: fallbackAngvel.z * (1.66 + energy * 0.46) * rollLife + waveD * 2.45,
},
  };
}

function getSafeAttemptLimit(request: DiceShadowWorkerRequest) {
  return Math.max(
    1,
    Math.min(
      SHADOW_ATTEMPT_MAX,
      Math.max(request.attemptLimit, SHADOW_ATTEMPT_MIN)
    )
  );
}

function getAttemptResetKey({
  activeDieIndex,
  attemptNumber,
}: {
  activeDieIndex: number;
  attemptNumber: number;
}) {
  return attemptNumber + activeDieIndex * 17;
}

function runOneDieShadowAttempt({
  request,
  activeDieIndex,
  attemptNumber,
}: {
  request: DiceShadowWorkerRequest;
  activeDieIndex: number;
  attemptNumber: number;
}): ShadowAttemptResult {
  const world = new RAPIER.World({
    x: PHYSICS_GRAVITY[0],
    y: PHYSICS_GRAVITY[1],
    z: PHYSICS_GRAVITY[2],
  });

  const physicsFrameRate = 60;
  const outputFrameRate = request.frameRate;
  const maxSimulationSeconds = Math.max(
    1,
    Math.min(11, request.maxSimulationSeconds)
  );

  const maxPhysicsSteps = Math.floor(maxSimulationSeconds * physicsFrameRate);
  const outputEverySteps = Math.max(
    1,
    Math.floor(physicsFrameRate / outputFrameRate)
  );

  world.timestep = 1 / physicsFrameRate;

  try {
    const table = createTableMeasurements();

    function addFixedCuboid({
      args,
      position,
      rotation = [0, 0, 0],
      restitution = 0.2,
      friction = 0.4,
    }: ShadowCuboid) {
      const colliderDesc = RAPIER.ColliderDesc.cuboid(
        args[0],
        args[1],
        args[2]
      )
        .setTranslation(position[0], position[1], position[2])
        .setRotation(createRapierQuaternionFromEuler(rotation))
        .setRestitution(restitution)
        .setFriction(friction);

      world.createCollider(colliderDesc);
    }

addFixedCuboid({
  args: [table.halfWidth, 0.09, table.upperFloorDepth / 2 + 0.02],
  position: [0, table.upperFloorY, table.upperFloorZ],
  rotation: [table.runwaySlopeAngle, 0, 0],
  restitution: 0.12,
  friction: 0.38,
});

addFixedCuboid({
  args: [table.halfWidth, 0.09, table.settlingFloorDepth / 2 + 0.02],
  position: [0, table.settlingFloorY, table.settlingFloorZ],
  rotation: [table.settlingSlopeAngle, 0, 0],
  restitution: 0.08,
  friction: 0.34,
});

    addFixedCuboid({
      args: [table.halfWidth + 0.06, 2.22, 0.13],
      position: [0, 1.05, table.backWallZ],
    });

    // Shadow-only rear slide guide.
// Gives the die a real wall-following contact path from holder area toward the deflector.
// This is not target correction and does not touch production /six-animal yet.
addFixedCuboid({
  args: [1.72, 0.035, 1.05],
  position: [0, 1.48, table.backWallZ + 0.54],
  rotation: [-1.18, 0, 0],
  restitution: 0.22,
  friction: 0.42,
});

    addFixedCuboid({
      args: [1.675, 0.04, 0.095],
      position: [0, 0.39, table.backWallZ + 0.78],
      rotation: [0.12, 0, 0],
      restitution: TABLE_DEFLECTOR_RESTITUTION,
      friction: TABLE_DEFLECTOR_FRICTION,
    });

    addFixedCuboid({
      args: [1.58, 0.032, 0.075],
      position: [0, 0.55, table.backWallZ + 0.735],
      rotation: [0.32, 0, 0],
      restitution: TABLE_DEFLECTOR_SHOULDER_RESTITUTION,
      friction: TABLE_DEFLECTOR_SHOULDER_FRICTION,
    });

    addFixedCuboid({
      args: [table.halfWidth - 0.08, 0.07, 0.16],
      position: [0, table.frontBorderY + 0.19, table.frontEdgeZ - 0.08],
      rotation: [-0.11, 0, 0],
      restitution: TABLE_FRONT_REBOUND_RESTITUTION,
      friction: TABLE_FRONT_REBOUND_FRICTION,
    });

    addFixedCuboid({
      args: [table.halfWidth, TABLE_FRONT_COLLIDER_HEIGHT, 0.11],
      position: [0, table.frontBorderY + 0.02, table.frontEdgeZ + 0.1],
      restitution: TABLE_FRONT_KEEPER_RESTITUTION,
      friction: TABLE_FRONT_KEEPER_FRICTION,
    });

    addFixedCuboid({
      args: [0.13, 1.08, table.halfDepth],
      position: [-table.halfWidth, table.sideRailY + 0.1, table.floorZ],
      rotation: [table.slopeAngle, 0, 0],
      restitution: TABLE_SIDE_RAIL_RESTITUTION,
      friction: TABLE_SIDE_RAIL_FRICTION,
    });

    addFixedCuboid({
      args: [0.13, 1.08, table.halfDepth],
      position: [table.halfWidth, table.sideRailY + 0.1, table.floorZ],
      rotation: [table.slopeAngle, 0, 0],
      restitution: TABLE_SIDE_RAIL_RESTITUTION,
      friction: TABLE_SIDE_RAIL_FRICTION,
    });

    addFixedCuboid({
      args: [table.halfWidth, 0.92, 0.07],
      position: [0, 0.08, table.frontEdgeZ + 0.34],
      restitution: TABLE_SAFETY_FRONT_RESTITUTION,
      friction: TABLE_SAFETY_FRONT_FRICTION,
    });

    addFixedCuboid({
      args: [0.11, 1.16, table.halfDepth],
      position: [-table.halfWidth - 0.04, 0.08, table.floorZ],
      restitution: TABLE_SAFETY_SIDE_RESTITUTION,
      friction: TABLE_SAFETY_SIDE_FRICTION,
    });

    addFixedCuboid({
      args: [0.11, 1.16, table.halfDepth],
      position: [table.halfWidth + 0.04, 0.08, table.floorZ],
      restitution: TABLE_SAFETY_SIDE_RESTITUTION,
      friction: TABLE_SAFETY_SIDE_FRICTION,
    });

    const activeDieX = DICE_HOLDER_X_POSITIONS[activeDieIndex] ?? 0;

const defaultStartPosition = getActiveDiceStartPosition({
  testMode: "trap",
  activeDieX,
});

// Worker-only wall-hug release.
// Keep production constants untouched.
// Start from the mounted holder/wall line instead of already popping forward.
const startPosition: [number, number, number] = [
  defaultStartPosition[0],
  defaultStartPosition[1] + 0.2,
  table.backWallZ + 0.42,
];

    const resetKey = getAttemptResetKey({
      activeDieIndex,
      attemptNumber,
    });

    const lateralDrift = getDiceLateralDrift({
      activeDieIndex,
      resetKey,
    });

    const naturalDirection = getDiceNaturalDirection({
      activeDieIndex,
      resetKey,
    });

    const fallbackLinvel = getDefaultTrapLaunchLinvel({
      naturalDirection,
      lateralDrift,
    });

    const fallbackAngvel = getDefaultTrapLaunchAngvel({
      activeDieIndex,
      resetKey,
    });

const launch = createNaturalAttemptLaunch({
  activeDieIndex,
  attemptNumber,
  fallbackLinvel,
  fallbackAngvel,
});

    const bodyDesc = RAPIER.RigidBodyDesc.dynamic()
      .setTranslation(startPosition[0], startPosition[1], startPosition[2])
      .setRotation(launch.rotation)
      .setLinvel(launch.linvel.x, launch.linvel.y, launch.linvel.z)
      .setAngvel({
        x: launch.angvel.x,
        y: launch.angvel.y,
        z: launch.angvel.z,
      });

    const diceBody = world.createRigidBody(bodyDesc);

const diceColliderDesc = RAPIER.ColliderDesc.roundCuboid(
  0.473,
  0.473,
  0.473,
  0.02
)
  .setRestitution(0.71)
  .setFriction(0.41);

    world.createCollider(diceColliderDesc, diceBody);

const frames: DiceTrajectoryFrame[] = [
  captureTrajectoryFrame(diceBody, 0),
];

for (let step = 1; step <= maxPhysicsSteps; step += 1) {
  world.step();

  if (step % outputEverySteps === 0 || step === maxPhysicsSteps) {
    frames.push(captureTrajectoryFrame(diceBody, step / physicsFrameRate));
  }
}

const finalFace = detectShadowTopFace(diceBody.rotation());
const targetMatched =
  finalFace.status === "accepted" &&
  finalFace.finalAnimal === request.targetAnimal;

const motionQuality = getTrajectoryMotionQuality(frames, table);

    return {
      kind: "search-success",
      requestId: request.requestId,
      targetAnimal: request.targetAnimal,
      dieIndex: activeDieIndex,
      finalAnimal: finalFace.finalAnimal,
      finalStatus: finalFace.status,
      finalConfidence: finalFace.confidence,
      finalTiltDegrees: finalFace.tiltDegrees,
      targetMatched,
      motionScore: motionQuality.score,
      motionGrade: motionQuality.grade,
      motionNotes: motionQuality.notes,
      motionMetrics: motionQuality.metrics,
      frames,
      attemptCount: attemptNumber,
      simulationSeconds: maxSimulationSeconds,
      motionRejected: motionQuality.rejected,
    };
  } finally {
    world.free();
  }
}

function getSoulSelectionScore(attempt: ShadowAttemptResult) {
const metrics = attempt.motionMetrics;
const visualActiveSeconds =
  metrics.visualActiveSeconds ?? getVisualActiveSeconds(metrics.activeSeconds);

const activeLifeScore = getRangeScore({
  value: visualActiveSeconds,
    minimum: MIN_SOUL_ACTIVE_SECONDS,
    preferredMinimum: IDEAL_SOUL_ACTIVE_MIN_SECONDS,
    preferredMaximum: IDEAL_SOUL_ACTIVE_MAX_SECONDS,
    maximum: MAX_SOUL_ACTIVE_SECONDS,
  });

  const rawActiveLifeScore = getRangeScore({
  value: metrics.activeSeconds,
  minimum: MIN_RAW_SOUL_ACTIVE_SECONDS,
  preferredMinimum: IDEAL_RAW_SOUL_ACTIVE_MIN_SECONDS,
  preferredMaximum: IDEAL_RAW_SOUL_ACTIVE_MAX_SECONDS,
  maximum: MAX_RAW_SOUL_ACTIVE_SECONDS,
});

  const lateTumbleScore = clamp01(
    metrics.lateTumbleTurns / MIN_SOUL_LATE_TUMBLE_TURNS
  );

  const deflectorScore = clamp01(metrics.deflectorBounceScore / 0.42);
  const settleScore = clamp01(metrics.finalSettleScore / 0.72);
  const impactScore = clamp01(metrics.firstImpactScore / 0.62);

  const shortLifePenalty =
    clamp01(
      (IDEAL_SOUL_ACTIVE_MIN_SECONDS - visualActiveSeconds) /
        (IDEAL_SOUL_ACTIVE_MIN_SECONDS - MIN_SOUL_ACTIVE_SECONDS)
    ) * 22;

  const longLifePenalty =
    clamp01(
      (visualActiveSeconds - IDEAL_SOUL_ACTIVE_MAX_SECONDS) /
        (MAX_SOUL_ACTIVE_SECONDS - IDEAL_SOUL_ACTIVE_MAX_SECONDS)
    ) * 12;

  const slidePenalty =
    clamp01((metrics.deadSlideSeconds - 0.35) / 0.4) * 24;

  const frontPenalty = metrics.frontStopRisk * 18;

  const rejectedPenalty = attempt.motionRejected ? 40 : 0;
  const rawShortPenalty =
  clamp01((MIN_RAW_SOUL_ACTIVE_SECONDS - metrics.activeSeconds) / 0.7) * 36;

  return Math.round(
    MathUtils.clamp(
      attempt.motionScore * 0.42 +
        activeLifeScore * 18 +
        rawActiveLifeScore * 24 +
        lateTumbleScore * 14 +
        deflectorScore * 8 +
        settleScore * 8 +
        impactScore * 6 -
        shortLifePenalty -
        longLifePenalty -
        slidePenalty -
        frontPenalty -
rawShortPenalty -
rejectedPenalty,
      0,
      100
    )
  );
}

function isSoulPassAttempt(attempt: ShadowAttemptResult) {
const metrics = attempt.motionMetrics;
const visualActiveSeconds =
  metrics.visualActiveSeconds ?? getVisualActiveSeconds(metrics.activeSeconds);

return (
    attempt.targetMatched &&
    !attempt.motionRejected &&
    attempt.motionScore >= ACCEPTED_MOTION_SCORE &&
    metrics.activeSeconds >= MIN_RAW_SOUL_ACTIVE_SECONDS &&
visualActiveSeconds >= MIN_SOUL_ACTIVE_SECONDS &&
visualActiveSeconds <= MAX_SOUL_ACTIVE_SECONDS &&
    metrics.deadSlideSeconds <= MAX_SOUL_DEAD_SLIDE_SECONDS &&
metrics.deflectorBounceScore >= MIN_SOUL_DEFLECTOR_BOUNCE_SCORE &&
metrics.lateTumbleTurns >= MIN_SOUL_LATE_TUMBLE_TURNS &&
metrics.frontStopRisk <= MAX_SOUL_FRONT_STOP_RISK
  );
}

function isBetterSoulCandidate(
  candidate: ShadowAttemptResult,
  current: ShadowAttemptResult | null
) {
  if (!current) return true;

  const candidateSoulScore = getSoulSelectionScore(candidate);
  const currentSoulScore = getSoulSelectionScore(current);

  if (candidateSoulScore !== currentSoulScore) {
    return candidateSoulScore > currentSoulScore;
  }

  return candidate.motionScore > current.motionScore;
}

function runOneDieShadowAttemptLoop(
  request: DiceShadowWorkerRequest
): DiceShadowWorkerResponse {
  const activeDieIndex = Math.max(0, Math.min(2, request.dieIndex));
  const attemptLimit = getSafeAttemptLimit(request);

  let bestAttempt: ShadowAttemptResult | null = null;
  let bestMatchedAttempt: ShadowAttemptResult | null = null;
  let bestAcceptedMatchedAttempt: ShadowAttemptResult | null = null;

  for (let attemptNumber = 1; attemptNumber <= attemptLimit; attemptNumber += 1) {
    const attempt = runOneDieShadowAttempt({
      request,
      activeDieIndex,
      attemptNumber,
    });

    if (
      !bestAttempt ||
      attempt.finalConfidence + attempt.motionScore / 100 >
        bestAttempt.finalConfidence + bestAttempt.motionScore / 100
    ) {
      bestAttempt = attempt;
    }

    if (attempt.targetMatched && isBetterSoulCandidate(attempt, bestMatchedAttempt)) {
      bestMatchedAttempt = attempt;
    }

    if (
      isSoulPassAttempt(attempt) &&
      isBetterSoulCandidate(attempt, bestAcceptedMatchedAttempt)
    ) {
      bestAcceptedMatchedAttempt = attempt;
    }
    if (
  bestAcceptedMatchedAttempt &&
  attemptNumber >= SHADOW_EARLY_ACCEPT_MIN_ATTEMPTS &&
  (bestAcceptedMatchedAttempt.motionGrade === "premium" ||
    getSoulSelectionScore(bestAcceptedMatchedAttempt) >=
      SHADOW_EARLY_ACCEPT_SOUL_SCORE)
) {
  return bestAcceptedMatchedAttempt;
}
  }

  if (bestAcceptedMatchedAttempt) {
    return bestAcceptedMatchedAttempt;
  }

return {
  kind: "search-fail",
  requestId: request.requestId,
  targetAnimal: request.targetAnimal,
  dieIndex: activeDieIndex,
  attemptCount: attemptLimit,
  reason: bestMatchedAttempt
    ? `Target matched, but no premium motion path passed. Best score ${bestMatchedAttempt.motionScore}, soul ${getSoulSelectionScore(bestMatchedAttempt)} (${bestMatchedAttempt.motionGrade}); ${bestMatchedAttempt.motionNotes.join("; ")}.`
    : bestAttempt
      ? `No target-matched shadow trajectory found. Best final: ${bestAttempt.finalAnimal}, ${bestAttempt.finalStatus}, ${bestAttempt.finalConfidence}% confidence, ${bestAttempt.finalTiltDegrees}° tilt, motion ${bestAttempt.motionScore}.`
      : "No shadow trajectory attempts were produced.",

  bestMatchedFinalAnimal: bestMatchedAttempt?.finalAnimal,
  bestMatchedFinalStatus: bestMatchedAttempt?.finalStatus,
  bestMatchedFinalConfidence: bestMatchedAttempt?.finalConfidence,
  bestMatchedFinalTiltDegrees: bestMatchedAttempt?.finalTiltDegrees,
  bestMatchedMotionScore: bestMatchedAttempt?.motionScore,
  bestMatchedMotionGrade: bestMatchedAttempt?.motionGrade,
  bestMatchedMotionNotes: bestMatchedAttempt?.motionNotes,
  bestMatchedMotionMetrics: bestMatchedAttempt?.motionMetrics,
  bestMatchedAttemptCount: bestMatchedAttempt?.attemptCount,
  bestMatchedFrames: bestMatchedAttempt?.frames,
};
}

workerScope.onmessage = async (
  event: MessageEvent<DiceShadowWorkerRequest>
) => {
  const request = event.data;

  try {
    await ensureRapierReady();

    if (request.kind === "search-one-die") {
      workerScope.postMessage(runOneDieShadowAttemptLoop(request));
    }
  } catch (error) {
    const response: DiceShadowWorkerResponse = {
      kind: "search-fail",
      requestId: request.requestId,
      targetAnimal: request.targetAnimal,
      dieIndex: request.dieIndex,
      attemptCount: 0,
      reason:
        error instanceof Error
          ? `Rapier worker natural attempt failed: ${error.message}`
          : "Rapier worker natural attempt failed.",
    };

    workerScope.postMessage(response);
  }
};

export {};
