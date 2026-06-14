//src>components>games>six-animal>physics>diceTrajectoryRecorder.ts
import type { DiceAnimalLabel } from "../ThreeDicePhysicsStage";
import type {
  DiceShadowFinalFaceStatus,
  DiceShadowMotionGrade,
  DiceShadowMotionMetrics,
  DiceTrajectoryFrame,
} from "./diceShadowTypes";

export type DiceTrajectoryRecorderCandidate = {
  finalAnimal: DiceAnimalLabel;
  dieIndex: number;
  frames: DiceTrajectoryFrame[];

  finalStatus: DiceShadowFinalFaceStatus;
  confidence: number;
  tiltDegrees: number;

  readableAtSeconds: number;
  motionEndSeconds: number;
  replayEndSeconds: number;

  metrics: DiceShadowMotionMetrics;
  motionScore: number;
  motionGrade: DiceShadowMotionGrade;

  notes: string[];
};

export type DiceTrajectoryGateSeverity = "pass" | "warn" | "block";

export type DiceTrajectoryGateIssue = {
  severity: DiceTrajectoryGateSeverity;
  code: string;
  message: string;
};

export type DiceTrajectoryGateReport = {
  severity: DiceTrajectoryGateSeverity;
  canProductionApprove: boolean;
  issues: DiceTrajectoryGateIssue[];
};

export type ApprovedDiceTrajectoryFile = {
  schema: "nagani.sixAnimal.diceTrajectory.v1";
  version: 1;

  trajectoryId: string;
  fileName: string;
  publicTargetPath: string;

  animal: DiceAnimalLabel;
  dieIndex: number;
  dieNumber: number;

  source: "v1-live-physics-recorder";
  approvedForProduction: true;

  frameRate: 60;
  frames: DiceTrajectoryFrame[];

  timing: {
    readableAtSeconds: number;
    motionEndSeconds: number;
    replayEndSeconds: number;
  };

  quality: {
    finalStatus: DiceShadowFinalFaceStatus;
    confidence: number;
    tiltDegrees: number;
    motionScore: number;
    motionGrade: DiceShadowMotionGrade;
    gateSeverity: DiceTrajectoryGateSeverity;
    issues: DiceTrajectoryGateIssue[];
  };

  metrics: DiceShadowMotionMetrics;

  metadata: {
    recordedAt: string;
    approvedAt: string;
    notes: string[];
  };
};

export type ApprovedTrajectoryCounts = Record<DiceAnimalLabel, number>;

export const SIX_ANIMAL_TRAJECTORY_ANIMALS: DiceAnimalLabel[] = [
  "Tiger",
  "Dragon",
  "Rooster",
  "Fish",
  "Crab",
  "Elephant",
];

function getAnimalFolder(animal: DiceAnimalLabel) {
  return animal.toLowerCase();
}

function pad3(value: number) {
  return String(value).padStart(3, "0");
}

function addIssue(
  issues: DiceTrajectoryGateIssue[],
  severity: DiceTrajectoryGateSeverity,
  code: string,
  message: string
) {
  issues.push({ severity, code, message });
}

function getWorstSeverity(
  issues: DiceTrajectoryGateIssue[]
): DiceTrajectoryGateSeverity {
  if (issues.some((issue) => issue.severity === "block")) return "block";
  if (issues.some((issue) => issue.severity === "warn")) return "warn";
  return "pass";
}

export function evaluateDiceTrajectoryGate(
  candidate: DiceTrajectoryRecorderCandidate
): DiceTrajectoryGateReport {
  const issues: DiceTrajectoryGateIssue[] = [];

  if (candidate.finalStatus !== "accepted") {
    addIssue(
      issues,
      "block",
      "final_not_accepted",
      "Final face is not accepted/readable."
    );
  }

if (candidate.motionGrade === "weak") {
  const visuallyGoodButLong =
    candidate.finalStatus === "accepted" &&
    candidate.readableAtSeconds <= 4.8 &&
    candidate.metrics.tumbleTurns >= 1.3 &&
    candidate.metrics.deflectorBounceScore >= 0.12 &&
    candidate.metrics.deadSlideSeconds <= 1.2;

  if (visuallyGoodButLong) {
    addIssue(
      issues,
      "warn",
      "weak_grade_but_visual_ok",
      "Motion grade is weak, but readable/tumble/impact metrics look usable. Preview carefully."
    );
  } else {
    addIssue(
      issues,
      "block",
      "weak_motion",
      "Motion grade is weak. Keep this as diagnostic only."
    );
  }
}

  if (candidate.confidence < 90) {
    addIssue(
      issues,
      "block",
      "low_confidence",
      `Confidence is too low: ${candidate.confidence}%.`
    );
  } else if (candidate.confidence < 95) {
    addIssue(
      issues,
      "warn",
      "confidence_warning",
      `Confidence is below premium target: ${candidate.confidence}%.`
    );
  }

  if (candidate.readableAtSeconds > 6.8) {
    addIssue(
      issues,
      "block",
      "readable_too_late",
      `Readable face is too late: ${candidate.readableAtSeconds}s.`
    );
  } else if (candidate.readableAtSeconds > 6.2) {
    addIssue(
      issues,
      "warn",
      "readable_late",
      `Readable face is late: ${candidate.readableAtSeconds}s.`
    );
  }

  if (candidate.metrics.deadSlideSeconds > 1.2) {
    addIssue(
      issues,
      "block",
      "dead_slide_too_long",
      `Dead slide is too long: ${candidate.metrics.deadSlideSeconds}s.`
    );
  } else if (candidate.metrics.deadSlideSeconds > 0.75) {
    addIssue(
      issues,
      "warn",
      "dead_slide_warning",
      `Dead slide is noticeable: ${candidate.metrics.deadSlideSeconds}s.`
    );
  }

  if (candidate.metrics.tumbleTurns < 0.85) {
    addIssue(
      issues,
      "block",
      "not_enough_tumble",
      `Tumble is too low: ${candidate.metrics.tumbleTurns} turns.`
    );
  } else if (candidate.metrics.tumbleTurns < 1.35) {
    addIssue(
      issues,
      "warn",
      "low_tumble_warning",
      `Tumble is below premium target: ${candidate.metrics.tumbleTurns} turns.`
    );
  }

  if (candidate.metrics.deflectorBounceScore < 0.12) {
    addIssue(
      issues,
      "warn",
      "weak_deflector",
      `Deflector impact looks weak: ${candidate.metrics.deflectorBounceScore}.`
    );
  }

  if (candidate.frames.length < 120) {
    addIssue(
      issues,
      "block",
      "too_few_frames",
      `Too few frames captured: ${candidate.frames.length}.`
    );
  }

  const severity = getWorstSeverity(issues);

  return {
    severity,
    canProductionApprove: severity !== "block",
    issues,
  };
}

export function getApprovedTrajectoryCounts(
  approvedFiles: ApprovedDiceTrajectoryFile[]
): ApprovedTrajectoryCounts {
  return SIX_ANIMAL_TRAJECTORY_ANIMALS.reduce((counts, animal) => {
    counts[animal] = approvedFiles.filter(
      (file) => file.animal === animal
    ).length;

    return counts;
  }, {} as ApprovedTrajectoryCounts);
}

export function getNextTrajectorySequenceNumber(params: {
  animal: DiceAnimalLabel;
  dieIndex: number;
  approvedFiles: ApprovedDiceTrajectoryFile[];
}) {
  const matching = params.approvedFiles.filter(
    (file) =>
      file.animal === params.animal && file.dieIndex === params.dieIndex
  );

  return matching.length + 1;
}

export function buildTrajectoryFileName(params: {
  animal: DiceAnimalLabel;
  dieIndex: number;
  sequenceNumber: number;
}) {
  const folderName = getAnimalFolder(params.animal);
  const dieNumber = params.dieIndex + 1;

  return `${folderName}-v1-d${dieNumber}-${pad3(params.sequenceNumber)}.json`;
}

export function buildApprovedDiceTrajectoryFile(params: {
  candidate: DiceTrajectoryRecorderCandidate;
  approvedFiles: ApprovedDiceTrajectoryFile[];
}): ApprovedDiceTrajectoryFile {
  const gate = evaluateDiceTrajectoryGate(params.candidate);

  if (!gate.canProductionApprove) {
    throw new Error("Trajectory is blocked by the production quality gate.");
  }

  const sequenceNumber = getNextTrajectorySequenceNumber({
    animal: params.candidate.finalAnimal,
    dieIndex: params.candidate.dieIndex,
    approvedFiles: params.approvedFiles,
  });

  const fileName = buildTrajectoryFileName({
    animal: params.candidate.finalAnimal,
    dieIndex: params.candidate.dieIndex,
    sequenceNumber,
  });

  const animalFolder = getAnimalFolder(params.candidate.finalAnimal);
  const now = new Date().toISOString();

  return {
    schema: "nagani.sixAnimal.diceTrajectory.v1",
    version: 1,

    trajectoryId: fileName.replace(".json", ""),
    fileName,
    publicTargetPath: `public/assets/nagani/six-animal/dice/trajectories/${animalFolder}/${fileName}`,

    animal: params.candidate.finalAnimal,
    dieIndex: params.candidate.dieIndex,
    dieNumber: params.candidate.dieIndex + 1,

    source: "v1-live-physics-recorder",
    approvedForProduction: true,

    frameRate: 60,
    frames: params.candidate.frames,

    timing: {
      readableAtSeconds: params.candidate.readableAtSeconds,
      motionEndSeconds: params.candidate.motionEndSeconds,
      replayEndSeconds: params.candidate.replayEndSeconds,
    },

    quality: {
      finalStatus: params.candidate.finalStatus,
      confidence: params.candidate.confidence,
      tiltDegrees: params.candidate.tiltDegrees,
      motionScore: params.candidate.motionScore,
      motionGrade: params.candidate.motionGrade,
      gateSeverity: gate.severity,
      issues: gate.issues,
    },

    metrics: params.candidate.metrics,

    metadata: {
      recordedAt: now,
      approvedAt: now,
      notes: params.candidate.notes,
    },
  };
}

export function downloadJsonFile(fileName: string, payload: unknown) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  });

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = fileName;
  anchor.click();

  URL.revokeObjectURL(url);
}

export function downloadApprovedTrajectoryFile(file: ApprovedDiceTrajectoryFile) {
  downloadJsonFile(file.fileName, file);
}

export function downloadDiagnosticTrajectoryFile(params: {
  candidate: DiceTrajectoryRecorderCandidate;
  reason?: string;
}) {
  const animalFolder = getAnimalFolder(params.candidate.finalAnimal);
  const dieNumber = params.candidate.dieIndex + 1;
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

  downloadJsonFile(`diagnostic-${animalFolder}-v1-d${dieNumber}-${timestamp}.json`, {
    schema: "nagani.sixAnimal.diceTrajectory.diagnostic.v1",
    version: 1,
    reason: params.reason ?? "Diagnostic export only. Not production approved.",
    gate: evaluateDiceTrajectoryGate(params.candidate),
    candidate: params.candidate,
  });
}

export type DiceTrajectoryManifestEntry = {
  animal: DiceAnimalLabel;
  dieIndex: number;
  dieNumber: number;
  fileName: string;
  publicTargetPath: string;
  loadPath: string;
  readableAtSeconds: number;
  motionEndSeconds: number;
  replayEndSeconds: number;
  motionGrade: DiceShadowMotionGrade;
  motionScore: number;
  confidence: number;
};

export type DiceTrajectoryManifest = {
  schema: "nagani.sixAnimal.diceTrajectoryManifest.v1";
  version: 1;
  generatedAt: string;
  totalFiles: number;
  counts: ApprovedTrajectoryCounts;
  targetPerAnimal: number;
  entries: DiceTrajectoryManifestEntry[];
};

export function buildApprovedTrajectoryManifest(
  approvedFiles: ApprovedDiceTrajectoryFile[]
): DiceTrajectoryManifest {
  return {
    schema: "nagani.sixAnimal.diceTrajectoryManifest.v1",
    version: 1,
    generatedAt: new Date().toISOString(),
    totalFiles: approvedFiles.length,
    counts: getApprovedTrajectoryCounts(approvedFiles),
    targetPerAnimal: 10,
    entries: approvedFiles.map((file) => {
      const animalFolder = file.animal.toLowerCase();

      return {
        animal: file.animal,
        dieIndex: file.dieIndex,
        dieNumber: file.dieNumber,
        fileName: file.fileName,
        publicTargetPath: file.publicTargetPath,
        loadPath: `/assets/nagani/six-animal/dice/trajectories/${animalFolder}/${file.fileName}`,
        readableAtSeconds: file.timing.readableAtSeconds,
        motionEndSeconds: file.timing.motionEndSeconds,
        replayEndSeconds: file.timing.replayEndSeconds,
        motionGrade: file.quality.motionGrade,
        motionScore: file.quality.motionScore,
        confidence: file.quality.confidence,
      };
    }),
  };
}

export function downloadApprovedTrajectoryManifest(
  approvedFiles: ApprovedDiceTrajectoryFile[]
) {
  const manifest = buildApprovedTrajectoryManifest(approvedFiles);
  downloadJsonFile("trajectory-manifest.v1.json", manifest);
}