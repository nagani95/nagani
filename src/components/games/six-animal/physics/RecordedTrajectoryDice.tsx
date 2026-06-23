//src/components/games/six-animal/physics/RecordedTrajectoryDice.tsx

"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Euler, MathUtils, Quaternion, Vector3, type Group } from "three";

import { DiceVisual } from "./DiceVisuals";
import {
  DISPLAY_DICE_ROTATIONS,
  createTableMeasurements,
  type DiceAnimalLabel,
  type DiceShapePreset,
} from "./physicsConstants";
import type {
  DiceShadowMotionMetrics,
  DiceTrajectoryFrame,
} from "./diceShadowTypes";
import {
  STRICT_READABLE_RESULT_CONFIDENCE,
  STRICT_READABLE_RESULT_MAX_TILT_DEGREES,
  detectTopDiceFace,
  type DiceFaceResult,
} from "./diceResultDetection";

const RECORDED_TRAJECTORY_REPLAY_TIME_SCALE = 1.18;
const RECORDED_TRAJECTORY_INTRO_SECONDS = 0.52;
const RECORDED_TRAJECTORY_VISUAL_SMOOTHING = 28;

export type RecordedReadableCapture = {
  t: number;
  frame: DiceTrajectoryFrame;
  result: DiceFaceResult;
};

type HeldRecordedTrajectoryDiceLike = {
  dieIndex: number;
  frames: DiceTrajectoryFrame[];
  replayKey?: number;
};

export function getRecordedTrajectoryFramePair(
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

export function getRecordedFrameMotionScore({
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

export function roundRecorderNumber(value: number, decimals: number) {
  const scale = 10 ** decimals;
  return Math.round(value * scale) / scale;
}

export function createV1RecordedMotionMetrics(
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

export function getRecordedTrajectoryReadableCapture(
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
  frame: currentFrame,
  result,
};

      if (stableSeconds >= 0.28) {
return {
  t: currentFrame.t,
  frame: currentFrame,
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
      frame: bestReadable.frame,
      result: {
        ...bestReadable.result,
        message: `Recorded trajectory face readable near ${bestReadable.t.toFixed(
          1
        )}s.`,
      },
    }
  : null;
}

export function RecordedTrajectoryDice({
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
  const smoothedPositionRef = useRef(new Vector3());
  const targetPositionRef = useRef(new Vector3());
  const smoothedQuaternionRef = useRef(new Quaternion());
  const targetQuaternionRef = useRef(new Quaternion());
  const replayStartedAtRef = useRef(0);
  const finalCapturedRef = useRef(false);
  const readableCapturedRef = useRef(false);
  const readableCaptureRef = useRef<RecordedReadableCapture | null>(null);
  const stableHoldFrameRef = useRef<DiceTrajectoryFrame | null>(null);

  const table = createTableMeasurements();
  const firstFrame = frames[0] ?? null;

  const holderStartPosition: [number, number, number] = firstFrame
    ? [firstFrame.position[0], 2.82, table.backWallZ + 0.42]
    : [0, 2.82, table.backWallZ + 0.42];

  const holderStartRotation = new Quaternion().setFromEuler(
    new Euler(...(DISPLAY_DICE_ROTATIONS[activeDieIndex] ?? [0, 0, 0]), "XYZ")
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

  function copyHolderReleaseIntroToGroup(progress: number) {
    const group = groupRef.current;
    if (!group || !handoffFrame) return;

    const releaseProgress = MathUtils.clamp(progress, 0, 1);

    const fallEase = 1 - Math.pow(1 - releaseProgress, 1.7);
    const forwardEase =
      releaseProgress * releaseProgress * (3 - 2 * releaseProgress);
    const rotationEase = releaseProgress * releaseProgress * releaseProgress;

    group.position.set(
      MathUtils.lerp(holderStartPosition[0], handoffFrame.position[0], forwardEase),
      MathUtils.lerp(holderStartPosition[1], handoffFrame.position[1], fallEase),
      MathUtils.lerp(holderStartPosition[2], handoffFrame.position[2], forwardEase)
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
    smoothedPositionRef.current.copy(group.position);
    targetPositionRef.current.copy(group.position);
    smoothedQuaternionRef.current.copy(group.quaternion).normalize();
    targetQuaternionRef.current.copy(group.quaternion).normalize();
  }

  useLayoutEffect(() => {
    if (!firstFrame) return;

    copyHolderReleaseIntroToGroup(0);
  }, [frames, replayKey, activeDieIndex]);

  useEffect(() => {
    replayStartedAtRef.current = performance.now();
    finalCapturedRef.current = false;
    readableCapturedRef.current = false;
    const readableCapture = getRecordedTrajectoryReadableCapture(frames);

readableCaptureRef.current = readableCapture;
stableHoldFrameRef.current =
  readableCapture?.frame ?? frames[frames.length - 1] ?? null;

    if (firstFrame) {
      copyHolderReleaseIntroToGroup(0);
    }

    onSettledChange(false);
    onFaceResultChange(null);
  }, [frames, replayKey, activeDieIndex, onSettledChange, onFaceResultChange]);

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group || frames.length === 0 || !firstFrame || !handoffFrame) return;

    const lastFrame = frames[frames.length - 1];

    if (!lastFrame) return;

    const stableHoldFrame = stableHoldFrameRef.current ?? lastFrame;

function copyStableResultHoldPose() {
  const liveGroup = groupRef.current;
  if (!liveGroup) return;

  const stableHoldQuaternion = new Quaternion(
    stableHoldFrame.rotation[0],
    stableHoldFrame.rotation[1],
    stableHoldFrame.rotation[2],
    stableHoldFrame.rotation[3]
  ).normalize();

  liveGroup.position.set(
    lastFrame.position[0],
    lastFrame.position[1],
    lastFrame.position[2]
  );

  liveGroup.quaternion.copy(stableHoldQuaternion);

  smoothedPositionRef.current.copy(liveGroup.position);
  targetPositionRef.current.copy(liveGroup.position);
  smoothedQuaternionRef.current.copy(liveGroup.quaternion).normalize();
  targetQuaternionRef.current.copy(liveGroup.quaternion).normalize();
}
    const replayElapsedSeconds =
      (performance.now() - replayStartedAtRef.current) / 1000;

    const holderReleaseIntroSeconds = RECORDED_TRAJECTORY_INTRO_SECONDS;

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

    const { previousFrame, nextFrame, alpha } = getRecordedTrajectoryFramePair(
      frames,
      trajectorySeconds
    );

    targetPositionRef.current.set(
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

    targetQuaternionRef.current
      .copy(previousQuaternion)
      .slerp(nextQuaternion, alpha)
      .normalize();

    const visualSmoothing =
      1 - Math.exp(-delta * RECORDED_TRAJECTORY_VISUAL_SMOOTHING);

    smoothedPositionRef.current.lerp(targetPositionRef.current, visualSmoothing);
    smoothedQuaternionRef.current
      .slerp(targetQuaternionRef.current, visualSmoothing)
      .normalize();

    group.position.copy(smoothedPositionRef.current);
    group.quaternion.copy(smoothedQuaternionRef.current);

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

  const finalResult =
    readableCaptureRef.current?.result ??
    detectTopDiceFace({
      x: stableHoldFrame.rotation[0],
      y: stableHoldFrame.rotation[1],
      z: stableHoldFrame.rotation[2],
      w: stableHoldFrame.rotation[3],
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

export function StaticRecordedTrajectoryDice({
  heldDice,
  diceShapePreset,
  hideActiveDiceFaces = false,
}: {
  heldDice: HeldRecordedTrajectoryDiceLike;
  diceShapePreset: DiceShapePreset;
  hideActiveDiceFaces?: boolean;
}) {
  const finalFrame = heldDice.frames[heldDice.frames.length - 1];

  if (!finalFrame) return null;

const finalQuaternion = new Quaternion(
  finalFrame.rotation[0],
  finalFrame.rotation[1],
  finalFrame.rotation[2],
  finalFrame.rotation[3]
).normalize();

  const finalEuler = new Euler().setFromQuaternion(finalQuaternion, "XYZ");

  const finalPosition: [number, number, number] = [
    finalFrame.position[0],
    finalFrame.position[1],
    finalFrame.position[2],
  ];

  const finalRotation: [number, number, number] = [
    finalEuler.x,
    finalEuler.y,
    finalEuler.z,
  ];

  return (
    <group position={finalPosition} rotation={finalRotation}>
      <DiceVisual
        shapePreset={diceShapePreset}
        showFaceLayer={!hideActiveDiceFaces}
        showHiddenFaceSeal={Boolean(hideActiveDiceFaces)}
      />
    </group>
  );
}