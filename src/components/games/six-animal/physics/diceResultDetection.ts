//src/components/games/six-animal/physics/diceResultDetection.ts

import { Quaternion } from "three";

import {
  VALID_FACE_SCORE_THRESHOLD,
  diceFaceCandidates,
  worldUp,
  type DiceAnimalLabel,
  type DiceFaceCandidate,
} from "./physicsConstants";

const TARGET_CORRECTION_ENABLED = false;
const TARGET_CORRECTION_MIN_SPEED = 0.18;
const TARGET_CORRECTION_MAX_TILT_DEGREES = 35;

const ACCEPTED_RESULT_MESSAGE = "Top face accepted and captured.";
const COCKED_RESULT_MESSAGE =
  "Dice stopped at an unreadable angle. Result not accepted.";

export const STRICT_READABLE_RESULT_CONFIDENCE = 82;
export const STRICT_READABLE_RESULT_MAX_TILT_DEGREES = 35;

export type DiceFaceResult = {
  status: "accepted" | "cocked";
  label: string;
  nearestLabel: string;
  axis: string;
  confidence: number;
  tiltDegrees: number;
  message: string;
};

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
) {
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

export function detectTopDiceFace(rotation: {
  x: number;
  y: number;
  z: number;
  w: number;
}): DiceFaceResult {
  const quaternion = new Quaternion(
    rotation.x,
    rotation.y,
    rotation.z,
    rotation.w
  );

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

export function createNearestVisibleResult(
  result: DiceFaceResult
): DiceFaceResult {
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

export function isStrictReadableVisibleResult(result: DiceFaceResult) {
  return (
    result.status === "accepted" &&
    result.confidence >= STRICT_READABLE_RESULT_CONFIDENCE &&
    result.tiltDegrees <= STRICT_READABLE_RESULT_MAX_TILT_DEGREES
  );
}

export function createStrictReadableVisibleResult(
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