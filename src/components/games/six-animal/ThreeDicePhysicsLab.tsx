// src/components/games/six-animal/ThreeDicePhysicsLab.tsx

"use client";

import { useEffect, useRef, useState } from "react";

import {
  convertThreeDicePayloadToMyanmarResult,
  convertThreeDicePayloadToSixAnimalKeys,
} from "@/lib/threeDiceResultAdapter";

import ThreeDicePhysicsStage, {
  createThreeDiceRoundPayload,
  getTargetCorrectionReadiness,
  getTargetCorrectionSafetyConfig,
  getTargetResultCaptureSummary,
  getTargetResultValidation,
  getTargetTopFaceDebugInfo,
    type CapturedDiceResult,
  type DiceAnimalLabel,
  type DiceColliderPreset,
  type DiceFaceResult,
  type DiceShapePreset,
  type TestMode,
} from "./ThreeDicePhysicsStage";
import type {
  DiceShadowMotionMetrics,
  DiceShadowWorkerResponse,
  DiceTrajectoryFrame,
  DiceTrajectoryRecorderComplete,
} from "./physics/diceShadowTypes";
import {
  buildApprovedDiceTrajectoryFile,
  downloadApprovedTrajectoryFile,
  downloadApprovedTrajectoryManifest,
  downloadDiagnosticTrajectoryFile,
  evaluateDiceTrajectoryGate,
  getApprovedTrajectoryCounts,
  type ApprovedDiceTrajectoryFile,
  type DiceTrajectoryRecorderCandidate,
} from "./physics/diceTrajectoryRecorder";
import {
  DICE_TRAJECTORY_LIBRARY_ANIMALS,
  loadDiceTrajectoryForAnimal,
} from "./physics/diceTrajectoryLibrary";

const BACKEND_AUTHORITY_SHADOW_ATTEMPT_LIMIT = 980;
const BACKEND_AUTHORITY_MAX_SIMULATION_SECONDS = 7.2;
const BACKEND_AUTHORITY_FRAME_RATE: 30 | 60 = 30;
const FIRST_TRAJECTORY_LIBRARY_TARGET_PER_ANIMAL = 10;
const SHOW_DICE_LAB_ADVANCED_TOOLS = false;
type TrajectoryLibrarySmokeStatus = "idle" | "loading" | "pass" | "fail";

type TrajectoryLibrarySmokeRow = {
  animal: DiceAnimalLabel;
  fileName: string;
  frames: number;
  motionGrade: string;
  confidence: number;
};

type TrajectoryLibraryReplayStatus = "idle" | "loading" | "ready" | "fail";
type TrajectoryLibraryReplayRoundStatus =
  | "idle"
  | "loading"
  | "replaying"
  | "complete"
  | "fail";

type TrajectoryLibraryReplay = {
  animal: DiceAnimalLabel;
  dieIndex: number;
  dieNumber: number;
  fileName: string;
  frames: DiceTrajectoryFrame[];
  motionGrade: string;
  confidence: number;
};

const TARGET_ANIMAL_OPTIONS: DiceAnimalLabel[] = [
  "Tiger",
  "Dragon",
  "Rooster",
  "Fish",
  "Crab",
  "Elephant",
];

function getRecordedMotionGrade(
  metrics: DiceShadowMotionMetrics
): "premium" | "accepted" | "weak" {
  const isPremium =
    metrics.visualActiveSeconds >= 4.6 &&
    metrics.visualActiveSeconds <= 8.4 &&
    metrics.deadSlideSeconds <= 0.9 &&
    metrics.deflectorBounceScore >= 0.18 &&
    metrics.tumbleTurns >= 1.35 &&
    metrics.frontStopRisk <= 0.86;

  if (isPremium) return "premium";

const isAccepted =
  metrics.visualActiveSeconds >= 3.6 &&
  metrics.visualActiveSeconds <= 10.2 &&
  metrics.deadSlideSeconds <= 1.45 &&
  metrics.tumbleTurns >= 0.85 &&
  metrics.frontStopRisk <= 0.95;

  return isAccepted ? "accepted" : "weak";
}

function getRecordedMotionScore(metrics: DiceShadowMotionMetrics) {
  let score = 0;

  if (metrics.visualActiveSeconds >= 4.6 && metrics.visualActiveSeconds <= 8.4) {
    score += 26;
  } else if (
    metrics.visualActiveSeconds >= 3.8 &&
    metrics.visualActiveSeconds <= 9.5
  ) {
    score += 18;
  }

  score += Math.min(1, Math.max(0, metrics.tumbleTurns / 2.2)) * 22;
  score += Math.min(1, Math.max(0, metrics.lateTumbleTurns / 0.75)) * 16;
  score += Math.min(1, Math.max(0, metrics.deflectorBounceScore)) * 14;
  score += Math.min(1, Math.max(0, metrics.directionChangeCount / 3)) * 10;
  score += Math.min(1, Math.max(0, 1 - metrics.deadSlideSeconds / 1.2)) * 8;
  score += Math.min(1, Math.max(0, 1 - metrics.frontStopRisk)) * 4;

  return Math.round(Math.min(100, Math.max(0, score)));
}

const DICE_SHAPE_PRESET_OPTIONS: {
  value: DiceShapePreset;
  label: string;
  note: string;
}[] = [
  {
    value: "current",
    label: "Current",
    note: "Production baseline",
  },
  {
    value: "softer-round",
    label: "Softer Round",
    note: "Slightly more rounded",
  },
  {
    value: "more-round",
    label: "More Round",
    note: "Stronger rounded test",
  },
  {
    value: "test-extreme",
    label: "Test Extreme",
    note: "Lab-only stress test",
  },
];

const DICE_COLLIDER_PRESET_OPTIONS: {
  value: DiceColliderPreset;
  label: string;
  note: string;
}[] = [
  {
    value: "current",
    label: "Current",
    note: "Production collider baseline",
  },
  {
    value: "tighter",
    label: "Tighter",
    note: "Sharper contact test",
  },
  {
    value: "softer",
    label: "Softer",
    note: "Rounder contact test",
  },
  {
    value: "experimental",
    label: "Experimental",
    note: "Lab-only stress test",
  },
];

export default function ThreeDicePhysicsLab() {
const [resetKey, setResetKey] = useState(1);
const [settled, setSettled] = useState(false);
const [faceResult, setFaceResult] = useState<DiceFaceResult | null>(null);
const [debugPhysics, setDebugPhysics] = useState(false);
const [showResultBoard, setShowResultBoard] = useState(false);
const [showDice, setShowDice] = useState(true);
const [cleanTableShotMode, setCleanTableShotMode] = useState(false);
const [testMode, setTestMode] = useState<TestMode>("runway");
const [diceShapePreset, setDiceShapePreset] =
  useState<DiceShapePreset>("more-round");
const [diceColliderPreset, setDiceColliderPreset] =
  useState<DiceColliderPreset>("softer");
const [activeDieIndex, setActiveDieIndex] = useState(0);
const [shadowSmokeDieIndex, setShadowSmokeDieIndex] = useState(0);
type TargetAnimalRecipe = [DiceAnimalLabel, DiceAnimalLabel, DiceAnimalLabel];

const [targetAnimals, setTargetAnimals] = useState<TargetAnimalRecipe>([
  "Tiger",
  "Dragon",
  "Rooster",
]);

const safeActiveDieIndex = Math.min(2, Math.max(0, activeDieIndex));
const activeTargetAnimal = targetAnimals[safeActiveDieIndex];

function updateTargetAnimal(index: number, animal: DiceAnimalLabel) {
  setTargetAnimals((current) => {
    const next = [...current] as TargetAnimalRecipe;
    next[index] = animal;
    return next;
  });
}
function getShadowSmokeWorker() {
  if (!shadowWorkerRef.current) {
    shadowWorkerRef.current = new Worker(
      new URL("./physics/diceShadowWorker.ts", import.meta.url),
      { type: "module" }
    );
  }

  return shadowWorkerRef.current;
}

function requestShadowSearch({
  dieIndex,
  targetAnimal,
}: {
  dieIndex: number;
  targetAnimal: DiceAnimalLabel;
}) {
  shadowRequestCounterRef.current += 1;

  const requestId =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `shadow-sequence-${shadowRequestCounterRef.current}`;

  const worker = getShadowSmokeWorker();

  return new Promise<DiceShadowWorkerResponse>((resolve, reject) => {
    const timeout = window.setTimeout(() => {
      reject(new Error(`Shadow search timed out for Die ${dieIndex + 1}.`));
    }, 45000);

    worker.onmessage = (event: MessageEvent<DiceShadowWorkerResponse>) => {
      if (event.data.requestId !== requestId) return;

      window.clearTimeout(timeout);
      resolve(event.data);
    };

    worker.onerror = (event) => {
      window.clearTimeout(timeout);
      reject(new Error(event.message || "Shadow worker sequence failed."));
    };

    worker.postMessage({
      kind: "search-one-die",
      requestId,
      targetAnimal,
      dieIndex,
      attemptLimit: BACKEND_AUTHORITY_SHADOW_ATTEMPT_LIMIT,
maxSimulationSeconds: BACKEND_AUTHORITY_MAX_SIMULATION_SECONDS,
frameRate: BACKEND_AUTHORITY_FRAME_RATE,
    });
  });
}

function runShadowSmokeTest() {
  shadowRequestCounterRef.current += 1;

  const requestId =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `shadow-smoke-${shadowRequestCounterRef.current}`;
const smokeDieIndex = Math.max(0, Math.min(2, shadowSmokeDieIndex));
const smokeTargetAnimal = targetAnimals[smokeDieIndex];

  const worker = getShadowSmokeWorker();

setShadowSmokeStatus("running");
setShadowSmokeResult(null);
setShadowSequenceResults([]);
setShadowSequenceReplayIndex(0);
setShadowSequenceStatus("idle");

// Clean previous replay before starting a new worker search.
setSequenceRunning(false);
setSettled(false);
setFaceResult(null);
setActiveDieIndex(smokeDieIndex);
capturedDieNumbersRef.current.clear();
setCapturedResults([]);
setResetKey((value) => value + 1);

  worker.onmessage = (event: MessageEvent<DiceShadowWorkerResponse>) => {
    const response = event.data;

setShadowSmokeResult(response);

const isTargetFound =
  response.kind === "search-success" && response.targetMatched;

setShadowSmokeStatus(isTargetFound ? "success" : "fail");

if (isTargetFound) {
  capturedDieNumbersRef.current.clear();
  setCapturedResults([]);
  setTrajectoryLibraryReplay(null);
setTrajectoryLibraryReplayError("");
setTrajectoryLibraryReplayStatus("idle");
setTrajectoryPreviewIndex(null);
setTrajectoryLibraryReplayRoundStatus("idle");
setTrajectoryLibraryReplayRound([]);
setTrajectoryLibraryReplayRoundIndex(0);
setTrajectoryLibraryReplayRoundError("");
  setTestMode("trap");
  setSequenceRunning(true);
  setActiveDieIndex(response.dieIndex);
  setSettled(false);
  setFaceResult(null);
  setResetKey((value) => value + 1);
}
  };

  worker.onerror = (event) => {
    setShadowSmokeStatus("fail");
    setShadowSmokeResult({
      kind: "search-fail",
      requestId,
      targetAnimal: smokeTargetAnimal,
      dieIndex: smokeDieIndex,
      attemptCount: 0,
      reason: event.message || "Shadow worker smoke test failed.",
    });
  };

  worker.postMessage({
    kind: "search-one-die",
    requestId,
    targetAnimal: smokeTargetAnimal,
    dieIndex: smokeDieIndex,
    attemptLimit: BACKEND_AUTHORITY_SHADOW_ATTEMPT_LIMIT,
maxSimulationSeconds: BACKEND_AUTHORITY_MAX_SIMULATION_SECONDS,
frameRate: BACKEND_AUTHORITY_FRAME_RATE,
  });
}

async function runShadowThreeDiceTest() {
  setShadowSmokeStatus("running");
  setShadowSmokeResult(null);
  setShadowSequenceResults([]);
  setShadowSequenceReplayIndex(0);
  setShadowSequenceStatus("searching");

  setTestMode("trap");
  setTrajectoryLibraryReplay(null);
setTrajectoryLibraryReplayError("");
setTrajectoryLibraryReplayStatus("idle");
setTrajectoryPreviewIndex(null);
  setSequenceRunning(false);
  setSettled(false);
  setFaceResult(null);
  capturedDieNumbersRef.current.clear();
  setCapturedResults([]);
  setResetKey((value) => value + 1);

  try {
    const results: DiceShadowWorkerResponse[] = [];

    for (let dieIndex = 0; dieIndex < 3; dieIndex += 1) {
      const response = await requestShadowSearch({
        dieIndex,
        targetAnimal: targetAnimals[dieIndex],
      });

      const isTargetFound =
        response.kind === "search-success" && response.targetMatched;

if (!isTargetFound) {
  setShadowSmokeResult(response);
  setShadowSmokeStatus("fail");
  setShadowSequenceStatus("fail");
  setSequenceRunning(false);
  setSettled(false);
  setFaceResult(null);
  return;
}

results.push(response);
    }

    setShadowSequenceResults(results);
    setShadowSequenceReplayIndex(0);
    setShadowSequenceStatus("replaying");

    setShadowSmokeResult(results[0]);
    setShadowSmokeStatus(
      results[0].kind === "search-success" ? "success" : "fail"
    );
    setActiveDieIndex(0);
    setSequenceRunning(true);
    setSettled(false);
    setFaceResult(null);
    setResetKey((value) => value + 1);
  } catch (error) {
    setShadowSmokeStatus("fail");
    setShadowSequenceStatus("fail");
    setShadowSmokeResult({
      kind: "search-fail",
      requestId: `shadow-sequence-error-${Date.now()}`,
      targetAnimal: targetAnimals[0],
      dieIndex: 0,
      attemptCount: 0,
      reason:
        error instanceof Error
          ? error.message
          : "Shadow 3 Dice sequence failed.",
    });
  }
}

function handleTrajectoryRecorderComplete(
  recording: DiceTrajectoryRecorderComplete
) {
  setTrajectoryRecordings((current) => [...current, recording]);
}

function runV1TrajectoryRecorder() {
  setShadowSmokeStatus("idle");
  setShadowSmokeResult(null);
  setShadowSequenceResults([]);
  setShadowSequenceReplayIndex(0);
  setShadowSequenceStatus("idle");

setTrajectoryRecorderEnabled(true);
setTrajectoryRecorderRunNonce(
  Date.now() + Math.floor(Math.random() * 1_000_000)
);
setTrajectoryRecordings([]);
setTrajectoryPreviewIndex(null);
setTrajectoryExportText("");
setTrajectoryLibraryReplay(null);
setTrajectoryLibraryReplayError("");
setTrajectoryLibraryReplayStatus("idle");

  setTargetCorrectionTestEnabled(false);
  setTargetLaunchRecipeEnabled(false);
  setCleanTableShotMode(false);
  setShowDice(true);
  setShowResultBoard(false);
  setTestMode("trap");

  setSequenceRunning(true);
  capturedDieNumbersRef.current.clear();
  setCapturedResults([]);
  setActiveDieIndex(0);
  setSettled(false);
  setFaceResult(null);
  setResetKey((value) => value + 1);
}

function stopV1TrajectoryRecorder() {
  setTrajectoryRecorderEnabled(false);
}

function previewTrajectoryRecording(index: number) {
  const recording = trajectoryRecordings[index];
  if (!recording) return;

  setTrajectoryRecorderEnabled(false);
  setTrajectoryPreviewIndex(index);
  setTrajectoryLibraryReplay(null);
setTrajectoryLibraryReplayError("");
setTrajectoryLibraryReplayStatus("idle");
  setShadowSmokeStatus("idle");
  setShadowSmokeResult(null);
  setShadowSequenceResults([]);
  setShadowSequenceReplayIndex(0);
  setShadowSequenceStatus("idle");

setShowResultBoard(false);
setCapturedResults([]);
capturedDieNumbersRef.current.clear();

setTestMode("trap");
  setSequenceRunning(true);
  setActiveDieIndex(recording.dieIndex);
  setSettled(false);
  setFaceResult(null);
  setTrajectoryReplayKey((value) => value + 1);
  setResetKey((value) => value + 1);
}

function approveTrajectoryRecording(index: number) {
  const recording = trajectoryRecordings[index];
  if (!recording) return;

  const candidate: DiceTrajectoryRecorderCandidate = {
    finalAnimal: recording.finalAnimal,
    dieIndex: recording.dieIndex,
    frames: recording.frames,

    finalStatus: recording.finalStatus,
    confidence: recording.finalConfidence,
    tiltDegrees: recording.finalTiltDegrees,

    readableAtSeconds: recording.readableAtSeconds,
    motionEndSeconds: recording.motionEndSeconds,
    replayEndSeconds: recording.replayEndSeconds,

    metrics: recording.metrics,
    motionScore: getRecordedMotionScore(recording.metrics),
    motionGrade: getRecordedMotionGrade(recording.metrics),

    notes: [
      "Approved from live V1 physics recorder.",
      `Shape preset: ${diceShapePreset}`,
      `Collider preset: ${diceColliderPreset}`,
    ],
  };

  const gate = evaluateDiceTrajectoryGate(candidate);

  if (!gate.canProductionApprove) {
    alert(
      [
        "This throw is blocked for production approval.",
        "",
        ...gate.issues.map((issue) => `• ${issue.message}`),
        "",
        "Use Diagnostic Export if you want to keep it for debugging.",
      ].join("\n")
    );
    return;
  }

  const approvedFile = buildApprovedDiceTrajectoryFile({
    candidate,
    approvedFiles: approvedTrajectoryFiles,
  });

  setApprovedTrajectoryFiles((current) => [...current, approvedFile]);
  setTrajectoryExportText("");
  downloadApprovedTrajectoryFile(approvedFile);
}

function diagnosticExportTrajectoryRecording(index: number) {
  const recording = trajectoryRecordings[index];
  if (!recording) return;

  const candidate: DiceTrajectoryRecorderCandidate = {
    finalAnimal: recording.finalAnimal,
    dieIndex: recording.dieIndex,
    frames: recording.frames,

    finalStatus: recording.finalStatus,
    confidence: recording.finalConfidence,
    tiltDegrees: recording.finalTiltDegrees,

    readableAtSeconds: recording.readableAtSeconds,
    motionEndSeconds: recording.motionEndSeconds,
    replayEndSeconds: recording.replayEndSeconds,

    metrics: recording.metrics,
    motionScore: getRecordedMotionScore(recording.metrics),
    motionGrade: getRecordedMotionGrade(recording.metrics),

    notes: [
      "Diagnostic export from V1 live physics recorder.",
      `Shape preset: ${diceShapePreset}`,
      `Collider preset: ${diceColliderPreset}`,
    ],
  };

  downloadDiagnosticTrajectoryFile({
    candidate,
    reason: "Manual diagnostic export from recorder card.",
  });
}

function exportApprovedTrajectories() {
  setTrajectoryExportText(JSON.stringify(approvedTrajectoryFiles, null, 2));
}

function downloadApprovedTrajectories() {
  const json = JSON.stringify(approvedTrajectoryFiles, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = `nagani-v1-approved-trajectory-files-${Date.now()}.json`;
  anchor.click();

  URL.revokeObjectURL(url);
}

function downloadTrajectoryManifest() {
  if (approvedTrajectoryFiles.length === 0) return;

  downloadApprovedTrajectoryManifest(approvedTrajectoryFiles);
}

async function runTrajectoryLibrarySmokeTest() {
  setTrajectoryLibrarySmokeStatus("loading");
  setTrajectoryLibrarySmokeRows([]);
  setTrajectoryLibrarySmokeError("");

  try {
    const rows: TrajectoryLibrarySmokeRow[] = [];

    for (const animal of DICE_TRAJECTORY_LIBRARY_ANIMALS) {
      for (let dieIndex = 0; dieIndex < 3; dieIndex += 1) {
        const { entry, trajectory, slotMatch } =
          await loadDiceTrajectoryForAnimal({
            animal,
            preferredDieIndex: dieIndex,
            random: () => 0,
          });

        if (slotMatch !== "exact-slot") {
          throw new Error(
            `Missing exact D${dieIndex + 1} replay file for ${animal}.`
          );
        }

        rows.push({
          animal,
          fileName: entry.fileName,
          frames: trajectory.frames.length,
          motionGrade: trajectory.quality.motionGrade,
          confidence: trajectory.quality.confidence,
        });
      }
    }

    setTrajectoryLibrarySmokeRows(rows);
    setTrajectoryLibrarySmokeStatus("pass");
  } catch (error) {
    setTrajectoryLibrarySmokeStatus("fail");
    setTrajectoryLibrarySmokeError(
      error instanceof Error
        ? error.message
        : "Trajectory library exact 18-slot smoke test failed."
    );
  }
}

async function replayTrajectoryLibraryAnimal(
  animal: DiceAnimalLabel = trajectoryLibraryReplayAnimal
) {
  setTrajectoryLibraryReplayStatus("loading");
  setTrajectoryLibraryReplay(null);
  setTrajectoryLibraryReplayError("");

  setTrajectoryLibraryReplayRoundStatus("idle");
setTrajectoryLibraryReplayRound([]);
setTrajectoryLibraryReplayRoundIndex(0);
setTrajectoryLibraryReplayRoundError("");

  setTrajectoryRecorderEnabled(false);
  setTrajectoryPreviewIndex(null);
  setTrajectoryExportText("");

  setShadowSmokeStatus("idle");
  setShadowSmokeResult(null);
  setShadowSequenceResults([]);
  setShadowSequenceReplayIndex(0);
  setShadowSequenceStatus("idle");

  setShowDice(true);
  setShowResultBoard(false);
  setCleanTableShotMode(false);
  setTestMode("trap");

  try {
    const { entry, trajectory } = await loadDiceTrajectoryForAnimal({
      animal,
      random: () => 0,
    });

    setTrajectoryLibraryReplay({
      animal: trajectory.animal,
      dieIndex: trajectory.dieIndex,
      dieNumber: trajectory.dieNumber,
      fileName: entry.fileName,
      frames: trajectory.frames,
      motionGrade: trajectory.quality.motionGrade,
      confidence: trajectory.quality.confidence,
    });

    capturedDieNumbersRef.current.clear();
    setCapturedResults([]);
    setActiveDieIndex(trajectory.dieIndex);
    setSettled(false);
    setFaceResult(null);
    setSequenceRunning(true);
    setTrajectoryReplayKey((value) => value + 1);
    setResetKey((value) => value + 1);
    setTrajectoryLibraryReplayStatus("ready");
  } catch (error) {
    setSequenceRunning(false);
    setTrajectoryLibraryReplayStatus("fail");
    setTrajectoryLibraryReplayError(
      error instanceof Error
        ? error.message
        : "Saved trajectory replay failed."
    );
  }
}

async function replayTrajectoryLibraryThreeDiceRound() {
  setTrajectoryLibraryReplayRoundStatus("loading");
  setTrajectoryLibraryReplayRound([]);
  setTrajectoryLibraryReplayRoundIndex(0);
  setTrajectoryLibraryReplayRoundError("");

  setTrajectoryLibraryReplayStatus("idle");
  setTrajectoryLibraryReplay(null);
  setTrajectoryLibraryReplayError("");

  setTrajectoryRecorderEnabled(false);
  setTrajectoryPreviewIndex(null);
  setTrajectoryExportText("");

  setShadowSmokeStatus("idle");
  setShadowSmokeResult(null);
  setShadowSequenceResults([]);
  setShadowSequenceReplayIndex(0);
  setShadowSequenceStatus("idle");

  setShowDice(true);
  setShowResultBoard(false);
  setCleanTableShotMode(false);
  setTestMode("trap");

  try {
    const replayRound: TrajectoryLibraryReplay[] = [];

    for (let dieIndex = 0; dieIndex < 3; dieIndex += 1) {
      const animal = targetAnimals[dieIndex];

      const { entry, trajectory } = await loadDiceTrajectoryForAnimal({
        animal,
        preferredDieIndex: dieIndex,
        random: () => 0,
      });

      replayRound.push({
        animal: trajectory.animal,
        dieIndex: trajectory.dieIndex,
        dieNumber: trajectory.dieNumber,
        fileName: entry.fileName,
        frames: trajectory.frames,
        motionGrade: trajectory.quality.motionGrade,
        confidence: trajectory.quality.confidence,
      });
    }

    const firstReplay = replayRound[0];

    if (!firstReplay) {
      throw new Error("No saved trajectory was loaded for the 3-dice replay.");
    }

    setTrajectoryLibraryReplayRound(replayRound);
    setTrajectoryLibraryReplayRoundIndex(0);
    setTrajectoryLibraryReplay(firstReplay);

    capturedDieNumbersRef.current.clear();
    setCapturedResults([]);
    setActiveDieIndex(firstReplay.dieIndex);
    setSettled(false);
    setFaceResult(null);
    setSequenceRunning(true);
    setTrajectoryReplayKey((value) => value + 1);
    setResetKey((value) => value + 1);
    setTrajectoryLibraryReplayRoundStatus("replaying");
  } catch (error) {
    setSequenceRunning(false);
    setTrajectoryLibraryReplayRoundStatus("fail");
    setTrajectoryLibraryReplayRoundError(
      error instanceof Error
        ? error.message
        : "Saved 3-dice trajectory replay failed."
    );
  }
}

useEffect(() => {
  return () => {
    shadowWorkerRef.current?.terminate();
    shadowWorkerRef.current = null;
  };
}, []);

const [targetCorrectionTestEnabled, setTargetCorrectionTestEnabled] =
  useState(false);
const [targetLaunchRecipeEnabled, setTargetLaunchRecipeEnabled] =
  useState(false);
const [shadowSmokeStatus, setShadowSmokeStatus] = useState<
  "idle" | "running" | "success" | "fail"
>("idle");
const [shadowSmokeResult, setShadowSmokeResult] =
  useState<DiceShadowWorkerResponse | null>(null);
  const [shadowSequenceResults, setShadowSequenceResults] = useState<
  DiceShadowWorkerResponse[]
>([]);
const [shadowSequenceReplayIndex, setShadowSequenceReplayIndex] = useState(0);
const [shadowSequenceStatus, setShadowSequenceStatus] = useState<
  "idle" | "searching" | "replaying" | "complete" | "fail"
>("idle");
const shadowWorkerRef = useRef<Worker | null>(null);
const shadowRequestCounterRef = useRef(0);
const [sequenceRunning, setSequenceRunning] = useState(false);
const [capturedResults, setCapturedResults] = useState<CapturedDiceResult[]>([]);
const [trajectoryRecorderEnabled, setTrajectoryRecorderEnabled] =
  useState(false);
const [trajectoryRecorderRunNonce, setTrajectoryRecorderRunNonce] = useState(0);
const [trajectoryRecordings, setTrajectoryRecordings] = useState<
  DiceTrajectoryRecorderComplete[]
>([]);
const [approvedTrajectoryFiles, setApprovedTrajectoryFiles] = useState<
  ApprovedDiceTrajectoryFile[]
>([]);
const [trajectoryPreviewIndex, setTrajectoryPreviewIndex] =
  useState<number | null>(null);
const [trajectoryReplayKey, setTrajectoryReplayKey] = useState(0);
const [trajectoryExportText, setTrajectoryExportText] = useState("");
const [trajectoryLibrarySmokeStatus, setTrajectoryLibrarySmokeStatus] =
  useState<TrajectoryLibrarySmokeStatus>("idle");
const [trajectoryLibrarySmokeRows, setTrajectoryLibrarySmokeRows] = useState<
  TrajectoryLibrarySmokeRow[]
>([]);
const [trajectoryLibrarySmokeError, setTrajectoryLibrarySmokeError] =
  useState("");
const [trajectoryLibraryReplayAnimal, setTrajectoryLibraryReplayAnimal] =
  useState<DiceAnimalLabel>("Dragon");
const [trajectoryLibraryReplayStatus, setTrajectoryLibraryReplayStatus] =
  useState<TrajectoryLibraryReplayStatus>("idle");
const [trajectoryLibraryReplay, setTrajectoryLibraryReplay] =
  useState<TrajectoryLibraryReplay | null>(null);
const [trajectoryLibraryReplayError, setTrajectoryLibraryReplayError] =
  useState("");
  const [
  trajectoryLibraryReplayRoundStatus,
  setTrajectoryLibraryReplayRoundStatus,
] = useState<TrajectoryLibraryReplayRoundStatus>("idle");
const [trajectoryLibraryReplayRound, setTrajectoryLibraryReplayRound] =
  useState<TrajectoryLibraryReplay[]>([]);
const [trajectoryLibraryReplayRoundIndex, setTrajectoryLibraryReplayRoundIndex] =
  useState(0);
const [trajectoryLibraryReplayRoundError, setTrajectoryLibraryReplayRoundError] =
  useState("");
const capturedDieNumbersRef = useRef<Set<number>>(new Set());
const sequenceComplete = capturedResults.length === 3 && !sequenceRunning;
const finalResultSummary =
  capturedResults.length > 0
    ? capturedResults.map((result) => result.label).join(" · ")
    : "Waiting";
const targetTestEnabled =
  targetCorrectionTestEnabled || targetLaunchRecipeEnabled;
const selectedTrajectoryPreview =
  trajectoryPreviewIndex === null
    ? null
    : trajectoryRecordings[trajectoryPreviewIndex] ?? null;
const activeTrajectoryReplayFrames =
  selectedTrajectoryPreview?.frames ?? trajectoryLibraryReplay?.frames ?? null;

const isTrajectoryLibraryRoundReplayActive =
  trajectoryLibraryReplayRoundStatus === "replaying" ||
  trajectoryLibraryReplayRoundStatus === "complete";

const trajectoryPreviewLabel = selectedTrajectoryPreview
  ? `${selectedTrajectoryPreview.finalAnimal} · D${
      selectedTrajectoryPreview.dieIndex + 1
    }`
  : isTrajectoryLibraryRoundReplayActive && trajectoryLibraryReplay
    ? `Library 3 Dice ${trajectoryLibraryReplayRoundIndex + 1}/3 · ${
        trajectoryLibraryReplay.animal
      }`
    : trajectoryLibraryReplay
      ? `Library ${trajectoryLibraryReplay.animal} · D${trajectoryLibraryReplay.dieNumber}`
      : "None";

const approvedTrajectoryCounts =
  getApprovedTrajectoryCounts(approvedTrajectoryFiles);

const nextTrajectoryLibraryAnimal =
  Object.entries(approvedTrajectoryCounts)
    .filter(([, count]) => count < FIRST_TRAJECTORY_LIBRARY_TARGET_PER_ANIMAL)
    .sort((a, b) => a[1] - b[1])[0]?.[0] ?? "Complete";

const trajectoryLibraryComplete = Object.values(approvedTrajectoryCounts).every(
  (count) => count >= FIRST_TRAJECTORY_LIBRARY_TARGET_PER_ANIMAL
);

const isTrajectoryPreviewing = Boolean(
  selectedTrajectoryPreview || trajectoryLibraryReplay
);

const trajectoryRecorderStatus = trajectoryRecorderEnabled
  ? "Recording"
  : trajectoryRecordings.length > 0
    ? "Captured"
    : "Idle";

const effectiveShowDice = cleanTableShotMode ? false : showDice;
const effectiveShowResultBoard = cleanTableShotMode ? false : showResultBoard;
const selectedShapePreset = DICE_SHAPE_PRESET_OPTIONS.find(
  (preset) => preset.value === diceShapePreset
);

const shapePresetLabel = selectedShapePreset?.label ?? "Current";
const shapePresetNote = selectedShapePreset?.note ?? "Production baseline";

const selectedColliderPreset = DICE_COLLIDER_PRESET_OPTIONS.find(
  (preset) => preset.value === diceColliderPreset
);

const colliderPresetLabel = selectedColliderPreset?.label ?? "Current";
const colliderPresetNote =
  selectedColliderPreset?.note ?? "Production collider baseline";

const activeSequenceLabel = sequenceRunning
  ? `Die ${activeDieIndex + 1} Rolling`
  : sequenceComplete
    ? "Round Complete"
    : "Single Drop";

const roundPayload = createThreeDiceRoundPayload(
  capturedResults,
  sequenceRunning
);

const adaptedMyanmarResult =
  convertThreeDicePayloadToMyanmarResult(roundPayload);

const adaptedAnimalKeys =
  convertThreeDicePayloadToSixAnimalKeys(roundPayload);

const targetTopFaceDebugInfo = getTargetTopFaceDebugInfo(activeTargetAnimal);
const targetCorrectionSafetyConfig = getTargetCorrectionSafetyConfig();

const targetCorrectionReadiness = getTargetCorrectionReadiness({
  movementSpeed: settled ? 0 : Number.POSITIVE_INFINITY,
  tiltDegrees: faceResult?.tiltDegrees ?? 999,
  hasTarget: Boolean(activeTargetAnimal),
});

const targetResultValidation = getTargetResultValidation({
targetAnimal: activeTargetAnimal,
faceResult,
});

const targetResultCaptureSummary = getTargetResultCaptureSummary({
targetAnimal: activeTargetAnimal,
faceResult,
});

const targetValidationTone = targetResultValidation.accepted
  ? "text-emerald-200"
  : targetResultValidation.status === "waiting"
    ? "text-white/45"
    : "text-orange-200";

const targetValidationLabel = targetResultValidation.accepted
  ? "Validated"
  : targetResultValidation.status === "waiting"
    ? "Waiting"
    : "Rejected";

const targetMatchStatus =
  !faceResult
    ? "waiting"
    : faceResult.status === "cocked"
      ? "invalid"
      : faceResult.label === activeTargetAnimal
        ? "matched"
        : "mismatch";

const targetMatchLabel =
  targetMatchStatus === "matched"
    ? "Target Matched"
    : targetMatchStatus === "mismatch"
      ? "Target Mismatch"
      : targetMatchStatus === "invalid"
        ? "Invalid / Cocked"
        : "Waiting";

const targetMatchTone =
  targetMatchStatus === "matched"
    ? "text-emerald-200"
    : targetMatchStatus === "mismatch"
      ? "text-red-200"
      : targetMatchStatus === "invalid"
        ? "text-orange-200"
        : "text-white/40";

const targetMatchDescription =
  targetMatchStatus === "matched"
    ? "The physical dice result matches the selected target."
    : targetMatchStatus === "mismatch"
      ? targetCorrectionTestEnabled || targetLaunchRecipeEnabled
        ? "Target test is ON. Launch recipe prepares the dice before drop; correction test adds soft mid-roll influence."
        : "The physical dice result does not match the selected target. This is expected because target testing is OFF."
      : targetMatchStatus === "invalid"
        ? "The dice stopped at an unreadable angle. No target comparison accepted."
        : "Drop a die to compare the selected target with the physical dice result.";

const shadowSmokeTone =
  shadowSmokeStatus === "success"
    ? "border-emerald-300/25 bg-emerald-300/10"
    : shadowSmokeStatus === "fail"
      ? "border-red-300/25 bg-red-300/10"
      : shadowSmokeStatus === "running"
        ? "border-sky-300/25 bg-sky-300/10"
        : "border-white/10 bg-white/[0.04]";

const shadowSmokeLabel =
  shadowSmokeStatus === "success"
    ? "Target Found"
    : shadowSmokeStatus === "fail"
      ? "No Match"
      : shadowSmokeStatus === "running"
        ? "Searching"
        : "Idle";

const shadowSmokeSummary =
  !shadowSmokeResult
    ? "Run a dev-only worker search. Production room is untouched."
    : shadowSmokeResult.kind === "search-success"
      ? `Final ${shadowSmokeResult.finalAnimal} · ${shadowSmokeResult.finalConfidence}% · ${shadowSmokeResult.finalTiltDegrees}° · Frames ${shadowSmokeResult.frames.length}`
      : shadowSmokeResult.reason;

const resultPanelTone =
  faceResult?.status === "accepted"
    ? "border-emerald-300/25 bg-emerald-500/10"
    : faceResult?.status === "cocked"
      ? "border-red-300/25 bg-red-500/10"
      : "border-amber-300/20 bg-amber-300/10";

const resultStatusLabel =
  faceResult?.status === "accepted"
    ? "Visible Result Accepted"
    : faceResult?.status === "cocked"
      ? "Visible Result Invalid"
      : "Waiting for Settle";

const royalBoardTitle = sequenceComplete
  ? "Round Complete"
  : faceResult?.status === "accepted"
    ? "Captured Result"
    : faceResult?.status === "cocked"
      ? targetTestEnabled
        ? "Recipe Miss"
        : "Invalid Throw"
      : "Royal Result Board";

const royalBoardMain = sequenceComplete
  ? finalResultSummary
  : faceResult?.status === "accepted"
    ? faceResult.label
    : faceResult?.status === "cocked"
      ? targetTestEnabled
        ? "Tune Needed"
        : "Reroll Required"
      : "Waiting";

const royalBoardSub = sequenceComplete
  ? "All three dice results captured successfully."
  : faceResult?.status === "accepted"
    ? `${faceResult.confidence}% confidence · ${faceResult.tiltDegrees}° tilt`
    : faceResult?.status === "cocked"
      ? targetTestEnabled
        ? `Expected ${activeTargetAnimal} · visible ${faceResult.nearestLabel}.`
        : `Nearest ${faceResult.nearestLabel} · ${faceResult.confidence}% confidence`
      : "The dice result will be captured here after it settles.";

      useEffect(() => {
  if (shadowSequenceStatus !== "replaying") return;
  if (!sequenceRunning || !settled || !faceResult) return;

  const dieNumber = shadowSequenceReplayIndex + 1;

  if (faceResult.status !== "accepted") {
    setSequenceRunning(false);
    setShadowSequenceStatus("fail");
    return;
  }

  if (!capturedDieNumbersRef.current.has(dieNumber)) {
    capturedDieNumbersRef.current.add(dieNumber);

    setCapturedResults((current) => [
      ...current.filter((result) => result.dieNumber !== dieNumber),
      {
        ...faceResult,
        dieNumber,
      },
    ]);
  }

  if (shadowSequenceReplayIndex >= shadowSequenceResults.length - 1) {
    setSequenceRunning(false);
    setShadowSequenceStatus("complete");
    return;
  }

  const timer = window.setTimeout(() => {
    const nextIndex = shadowSequenceReplayIndex + 1;
    const nextResult = shadowSequenceResults[nextIndex];

    setShadowSequenceReplayIndex(nextIndex);
    setShadowSmokeResult(nextResult);
    setShadowSmokeStatus(
      nextResult.kind === "search-success" ? "success" : "fail"
    );
    setActiveDieIndex(nextIndex);
    setSettled(false);
    setFaceResult(null);
    setResetKey((value) => value + 1);
  }, 1300);

  return () => window.clearTimeout(timer);
}, [
  shadowSequenceStatus,
  sequenceRunning,
  settled,
  faceResult,
  shadowSequenceReplayIndex,
  shadowSequenceResults,
]);

useEffect(() => {
  if (trajectoryLibraryReplayRoundStatus !== "replaying") return;
  if (!sequenceRunning || !settled || !faceResult) return;

  const dieNumber = trajectoryLibraryReplayRoundIndex + 1;
  const currentReplay = trajectoryLibraryReplayRound[trajectoryLibraryReplayRoundIndex];

  if (!currentReplay) {
    setSequenceRunning(false);
    setTrajectoryLibraryReplayRoundStatus("fail");
    setTrajectoryLibraryReplayRoundError("Saved replay round lost its current trajectory.");
    return;
  }

  if (faceResult.status !== "accepted") {
    setSequenceRunning(false);
    setTrajectoryLibraryReplayRoundStatus("fail");
    setTrajectoryLibraryReplayRoundError(
      `Saved replay D${dieNumber} ended unreadable.`
    );
    return;
  }

  if (!capturedDieNumbersRef.current.has(dieNumber)) {
    capturedDieNumbersRef.current.add(dieNumber);

    setCapturedResults((current) => [
      ...current.filter((result) => result.dieNumber !== dieNumber),
      {
        ...faceResult,
        dieNumber,
      },
    ]);
  }

  if (trajectoryLibraryReplayRoundIndex >= trajectoryLibraryReplayRound.length - 1) {
    setSequenceRunning(false);
    setTrajectoryLibraryReplayRoundStatus("complete");
    return;
  }

  const timer = window.setTimeout(() => {
    const nextIndex = trajectoryLibraryReplayRoundIndex + 1;
    const nextReplay = trajectoryLibraryReplayRound[nextIndex];

    if (!nextReplay) {
      setSequenceRunning(false);
      setTrajectoryLibraryReplayRoundStatus("fail");
      setTrajectoryLibraryReplayRoundError("Next saved trajectory is missing.");
      return;
    }

    setTrajectoryLibraryReplayRoundIndex(nextIndex);
    setTrajectoryLibraryReplay(nextReplay);
    setActiveDieIndex(nextReplay.dieIndex);
    setSettled(false);
    setFaceResult(null);
    setSequenceRunning(true);
    setTrajectoryReplayKey((value) => value + 1);
    setResetKey((value) => value + 1);
  }, 1300);

  return () => window.clearTimeout(timer);
}, [
  trajectoryLibraryReplayRoundStatus,
  sequenceRunning,
  settled,
  faceResult,
  trajectoryLibraryReplayRoundIndex,
  trajectoryLibraryReplayRound,
]);

useEffect(() => {
  if (!sequenceRunning || !settled || !faceResult) return;

if (shadowSmokeResult || isTrajectoryPreviewing) {
  return;
}

  const dieNumber = activeDieIndex + 1;

  if (capturedDieNumbersRef.current.has(dieNumber)) return;

if (faceResult.status === "cocked") {
  if (targetTestEnabled) {
    setSequenceRunning(false);
    return;
  }

  const timer = window.setTimeout(() => {
    setSettled(false);
    setFaceResult(null);
    setResetKey((value) => value + 1);
  }, 1200);

  return () => window.clearTimeout(timer);
}

capturedDieNumbersRef.current.add(dieNumber);

setCapturedResults((current) => [
  ...current,
  {
    ...faceResult,
    dieNumber,
  },
]);

if (activeDieIndex >= 2) {
  setSequenceRunning(false);
  return;
}

  const timer = window.setTimeout(() => {
    setSettled(false);
    setFaceResult(null);
    setActiveDieIndex((value) => value + 1);
    setResetKey((value) => value + 1);
  }, 1300);

  return () => window.clearTimeout(timer);
}, [
  sequenceRunning,
  settled,
  faceResult,
  activeDieIndex,
  targetTestEnabled,
  shadowSmokeResult,
  isTrajectoryPreviewing,
]);

useEffect(() => {
  if (!trajectoryRecorderEnabled) return;
  if (sequenceRunning) return;
  if (capturedResults.length < 3) return;

  setTrajectoryRecorderEnabled(false);
}, [trajectoryRecorderEnabled, sequenceRunning, capturedResults.length]);

useEffect(() => {
  if (!isTrajectoryPreviewing || !settled || !faceResult) return;
  if (trajectoryLibraryReplayRoundStatus === "replaying") return;

  const timer = window.setTimeout(() => {
    setSequenceRunning(false);
  }, 1000);

  return () => window.clearTimeout(timer);
}, [
  isTrajectoryPreviewing,
  settled,
  faceResult,
  trajectoryLibraryReplayRoundStatus,
]);

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-[1800px] flex-col px-3 py-5 2xl:px-6">
        <header className="grid gap-4 xl:grid-cols-[360px_1fr] xl:items-start">
          <div>
<p className="text-xs font-black uppercase tracking-[0.35em] text-amber-300/70">
  Chapter 78.3
</p>
<h1 className="mt-2 text-2xl font-black text-amber-100">
  3D Dice / Royal Table Preview Lab
</h1>
<p className="mt-1 text-sm font-bold text-white/55">
  Isolated dev preview route. Not connected to the live Six Animal room.
</p>
          </div>

<div className="flex flex-wrap items-center justify-start gap-2 xl:justify-end">
<div className="grid grid-cols-3 gap-2 rounded-2xl border border-sky-300/20 bg-sky-300/10 px-3 py-3 shadow-xl shadow-black/30">
  {targetAnimals.map((animal, index) => (
    <label key={`target-animal-${index}`} className="flex items-center gap-2">
      <span className="text-[10px] font-black uppercase tracking-[0.18em] text-sky-100/55">
        D{index + 1}
      </span>

      <select
        value={animal}
        disabled={sequenceRunning}
        onChange={(event) =>
          updateTargetAnimal(index, event.target.value as DiceAnimalLabel)
        }
        className="bg-transparent text-sm font-black text-sky-50 outline-none disabled:text-sky-100/35"
      >
        {TARGET_ANIMAL_OPTIONS.map((option) => (
          <option key={option} value={option} className="bg-black text-white">
            {option}
          </option>
        ))}
      </select>
    </label>
  ))}
</div>

    <label className="flex items-center gap-2 rounded-2xl border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-sm font-black text-amber-100 shadow-xl shadow-black/30">
  <span className="text-[10px] uppercase tracking-[0.2em] text-amber-100/55">
    Shape
  </span>

  <select
    value={diceShapePreset}
    disabled={sequenceRunning}
    onChange={(event) =>
      setDiceShapePreset(event.target.value as DiceShapePreset)
    }
    className="bg-transparent text-sm font-black text-amber-50 outline-none disabled:text-amber-100/35"
  >
    {DICE_SHAPE_PRESET_OPTIONS.map((preset) => (
      <option
        key={preset.value}
        value={preset.value}
        className="bg-black text-white"
      >
        {preset.label}
      </option>
    ))}
  </select>
</label>

<label className="flex items-center gap-2 rounded-2xl border border-orange-300/20 bg-orange-300/10 px-4 py-3 text-sm font-black text-orange-100 shadow-xl shadow-black/30">
  <span className="text-[10px] uppercase tracking-[0.2em] text-orange-100/55">
    Collider
  </span>

  <select
    value={diceColliderPreset}
    disabled={sequenceRunning}
    onChange={(event) =>
      setDiceColliderPreset(event.target.value as DiceColliderPreset)
    }
    className="bg-transparent text-sm font-black text-orange-50 outline-none disabled:text-orange-100/35"
  >
    {DICE_COLLIDER_PRESET_OPTIONS.map((preset) => (
      <option
        key={preset.value}
        value={preset.value}
        className="bg-black text-white"
      >
        {preset.label}
      </option>
    ))}
  </select>
</label>

  <button
    type="button"
    disabled={sequenceRunning}
    onClick={() => setTargetCorrectionTestEnabled((value) => !value)}
    className={
      targetCorrectionTestEnabled
        ? "rounded-2xl border border-purple-300/25 bg-purple-300/20 px-4 py-3 text-sm font-black text-purple-100 shadow-xl shadow-black/30"
        : "rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-black text-white/45 shadow-xl shadow-black/30"
    }
  >
    Correction Test: {targetCorrectionTestEnabled ? "ON" : "OFF"}
  </button>

  <button
  type="button"
  disabled={sequenceRunning}
  onClick={() => setTargetLaunchRecipeEnabled((value) => !value)}
  className={
    targetLaunchRecipeEnabled
      ? "rounded-2xl border border-emerald-300/25 bg-emerald-300/20 px-4 py-3 text-sm font-black text-emerald-100 shadow-xl shadow-black/30"
      : "rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-black text-white/45 shadow-xl shadow-black/30"
  }
>
  Launch Recipe: {targetLaunchRecipeEnabled ? "ON" : "OFF"}
</button>

<div className="grid grid-cols-3 gap-1 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 px-2 py-2 shadow-xl shadow-black/30">
  {[0, 1, 2].map((dieIndex) => (
    <button
      key={`shadow-smoke-die-${dieIndex}`}
      type="button"
      disabled={shadowSmokeStatus === "running" || sequenceRunning}
      onClick={() => {
        setShadowSmokeDieIndex(dieIndex);
        setActiveDieIndex(dieIndex);
        setSequenceRunning(false);
        setSettled(false);
        setFaceResult(null);
        setShadowSmokeResult(null);
      }}
      className={
        shadowSmokeDieIndex === dieIndex
          ? "rounded-xl border border-cyan-200/40 bg-cyan-200/25 px-3 py-2 text-xs font-black text-cyan-50"
          : "rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-black text-white/45"
      }
    >
      Die {dieIndex + 1}
    </button>
  ))}
</div>

<button
  type="button"
  disabled={shadowSmokeStatus === "running"}
  onClick={runShadowSmokeTest}
  className={
    shadowSmokeStatus === "running"
      ? "cursor-wait rounded-2xl border border-sky-300/25 bg-sky-300/15 px-4 py-3 text-sm font-black text-sky-100 shadow-xl shadow-black/30"
      : shadowSmokeStatus === "success"
        ? "rounded-2xl border border-emerald-300/25 bg-emerald-300/20 px-4 py-3 text-sm font-black text-emerald-100 shadow-xl shadow-black/30"
        : shadowSmokeStatus === "fail"
          ? "rounded-2xl border border-red-300/25 bg-red-300/15 px-4 py-3 text-sm font-black text-red-100 shadow-xl shadow-black/30"
          : "rounded-2xl border border-cyan-300/20 bg-cyan-300/10 px-4 py-3 text-sm font-black text-cyan-100 shadow-xl shadow-black/30"
  }
>
  Shadow Smoke: {shadowSmokeLabel}
</button>

<button
  type="button"
  disabled={sequenceRunning}
  onClick={() => {
    setSettled(false);
    setFaceResult(null);
    setResetKey((value) => value + 1);
    setTestMode((value) => (value === "runway" ? "trap" : "runway"));
  }}
  className={
    sequenceRunning
      ? "cursor-not-allowed rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-black text-white/30 shadow-xl shadow-black/30"
      : "rounded-2xl border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-sm font-black text-amber-100 shadow-xl shadow-black/30"
  }
>
  Mode: {testMode === "runway" ? "Runway" : "Trap"}
</button>

  <button
    type="button"
    onClick={() => setDebugPhysics((value) => !value)}
    className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-black text-white shadow-xl shadow-black/30"
  >
    {debugPhysics ? "Hide Debug" : "Show Debug"}
  </button>

  <button
  type="button"
  onClick={() => setShowResultBoard((value) => !value)}
  className={
    showResultBoard
      ? "rounded-2xl border border-red-300/25 bg-red-300/15 px-4 py-3 text-sm font-black text-red-100 shadow-xl shadow-black/30"
      : "rounded-2xl border border-emerald-300/25 bg-emerald-300/15 px-4 py-3 text-sm font-black text-emerald-100 shadow-xl shadow-black/30"
  }
>
  {showResultBoard ? "Hide Result Panel" : "Show Result Panel"}
</button>

<button
  type="button"
  onClick={() => setShowDice((value) => !value)}
  className={
    effectiveShowDice
      ? "rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-black text-white shadow-xl shadow-black/30"
      : "rounded-2xl border border-cyan-300/25 bg-cyan-300/15 px-4 py-3 text-sm font-black text-cyan-100 shadow-xl shadow-black/30"
  }
>
  {effectiveShowDice ? "Hide Dice" : "Show Dice"}
</button>

<button
  type="button"
  onClick={() => {
    const nextValue = !cleanTableShotMode;

    setCleanTableShotMode(nextValue);

    if (nextValue) {
      setDebugPhysics(false);
      setShowResultBoard(false);
      setShowDice(false);
      setSequenceRunning(false);
      setSettled(false);
      setFaceResult(null);
      setCapturedResults([]);
      capturedDieNumbersRef.current.clear();
      setTestMode("trap");
      setTargetLaunchRecipeEnabled(false);
    }
  }}
  className={
    cleanTableShotMode
      ? "rounded-2xl border border-cyan-300/30 bg-cyan-300 px-4 py-3 text-sm font-black text-black shadow-xl shadow-cyan-950/40"
      : "rounded-2xl border border-cyan-300/20 bg-cyan-300/10 px-4 py-3 text-sm font-black text-cyan-100 shadow-xl shadow-black/30"
  }
>
  {cleanTableShotMode ? "Clean Shot: ON" : "Clean Shot"}
</button>

<button
  type="button"
  disabled={shadowSmokeStatus === "running" || sequenceRunning}
  onClick={runShadowThreeDiceTest}
  className={
    shadowSequenceStatus === "complete"
      ? "rounded-2xl border border-emerald-300/25 bg-emerald-300/20 px-4 py-3 text-sm font-black text-emerald-100 shadow-xl shadow-black/30"
      : shadowSequenceStatus === "searching" ||
          shadowSequenceStatus === "replaying"
        ? "cursor-wait rounded-2xl border border-sky-300/25 bg-sky-300/15 px-4 py-3 text-sm font-black text-sky-100 shadow-xl shadow-black/30"
        : shadowSequenceStatus === "fail"
          ? "rounded-2xl border border-red-300/25 bg-red-300/15 px-4 py-3 text-sm font-black text-red-100 shadow-xl shadow-black/30"
          : "rounded-2xl border border-cyan-300/20 bg-cyan-300/10 px-4 py-3 text-sm font-black text-cyan-100 shadow-xl shadow-black/30"
  }
>
  Shadow 3 Dice:{" "}
  {shadowSequenceStatus === "searching"
    ? "Searching"
    : shadowSequenceStatus === "replaying"
      ? `Replay ${shadowSequenceReplayIndex + 1}/3`
      : shadowSequenceStatus === "complete"
        ? "Complete"
        : shadowSequenceStatus === "fail"
          ? "Fail"
          : "Ready"}
</button>

<button
  type="button"
  disabled={sequenceRunning || shadowSmokeStatus === "running"}
  onClick={runV1TrajectoryRecorder}
  className={
    trajectoryRecorderEnabled
      ? "cursor-wait rounded-2xl border border-sky-300/25 bg-sky-300/15 px-4 py-3 text-sm font-black text-sky-100 shadow-xl shadow-black/30"
      : "rounded-2xl border border-fuchsia-300/25 bg-fuchsia-300/15 px-4 py-3 text-sm font-black text-fuchsia-100 shadow-xl shadow-black/30"
  }
>
  Record V1 3 Dice
</button>

<button
  type="button"
  disabled={!trajectoryRecorderEnabled}
  onClick={stopV1TrajectoryRecorder}
  className={
    trajectoryRecorderEnabled
      ? "rounded-2xl border border-red-300/25 bg-red-300/15 px-4 py-3 text-sm font-black text-red-100 shadow-xl shadow-black/30"
      : "cursor-not-allowed rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-black text-white/25 shadow-xl shadow-black/30"
  }
>
  Stop Recorder
</button>

  <button
  type="button"
onClick={() => {
  setShadowSmokeStatus("idle");
  setShadowSmokeResult(null);
  setTrajectoryLibraryReplay(null);
  setTrajectoryLibraryReplayError("");
  setTrajectoryLibraryReplayStatus("idle");
  setTrajectoryPreviewIndex(null);
  setTrajectoryLibraryReplayRoundStatus("idle");
  setTrajectoryLibraryReplayRound([]);
  setTrajectoryLibraryReplayRoundIndex(0);
  setTrajectoryLibraryReplayRoundError("");
  setTestMode("trap");
  setSequenceRunning(true);
  capturedDieNumbersRef.current.clear();
  setCapturedResults([]);
  setActiveDieIndex(0);
  setSettled(false);
  setFaceResult(null);
  setResetKey((value) => value + 1);
}}
  className="rounded-2xl border border-emerald-300/25 bg-emerald-400/15 px-4 py-3 text-sm font-black text-emerald-100 shadow-xl shadow-black/30"
>
  Run 3 Dice
</button>

  <button
    type="button"
onClick={() => {
  setShadowSmokeStatus("idle");
  setShadowSmokeResult(null);
  setTrajectoryLibraryReplay(null);
  setTrajectoryLibraryReplayError("");
  setTrajectoryLibraryReplayStatus("idle");
  setTrajectoryPreviewIndex(null);
  setTrajectoryLibraryReplayRoundStatus("idle");
setTrajectoryLibraryReplayRound([]);
setTrajectoryLibraryReplayRoundIndex(0);
setTrajectoryLibraryReplayRoundError("");
  setSequenceRunning(false);
  capturedDieNumbersRef.current.clear();
  setCapturedResults([]);
  setActiveDieIndex(0);
  setSettled(false);
  setFaceResult(null);
  setResetKey((value) => value + 1);
  setShadowSequenceResults([]);
setShadowSequenceReplayIndex(0);
setShadowSequenceStatus("idle");
}}
    className="rounded-2xl border border-amber-300/30 bg-amber-300 px-4 py-3 text-sm font-black text-black shadow-xl shadow-amber-950/40"
  >
    Drop Again
  </button>
</div>
        </header>

<section className="relative mt-5 overflow-hidden rounded-[2rem] border border-amber-300/25 bg-[radial-gradient(circle_at_50%_28%,rgba(117,46,26,0.55),rgba(44,12,8,0.96)_45%,rgba(10,4,3,1)_100%)] shadow-2xl shadow-red-950/30">
  <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_46%,rgba(255,214,128,0.14),transparent_42%)]" />
    {effectiveShowResultBoard && !isTrajectoryPreviewing ? (
  <div className="pointer-events-none absolute right-5 top-5 z-20 w-[270px] rounded-[1.5rem] border border-amber-300/25 bg-black/55 p-4 shadow-2xl shadow-black/50 backdrop-blur-md">
    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-200/55">
      {royalBoardTitle}
    </p>

    <div className="mt-3 rounded-2xl border border-amber-300/20 bg-gradient-to-b from-amber-300/15 to-red-950/30 p-4 text-center">
      <p
        className={
          faceResult?.status === "cocked"
            ? "text-2xl font-black text-red-200"
            : faceResult?.status === "accepted"
              ? "text-3xl font-black text-amber-100"
              : "text-2xl font-black text-white/55"
        }
      >
        {royalBoardMain}
      </p>

      <p className="mt-2 text-xs font-bold leading-relaxed text-white/55">
        {royalBoardSub}
      </p>
    </div>

    <div className="mt-3 flex items-center justify-between rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-white/45">
      <span>Dice Lab</span>
      <span>{activeSequenceLabel}</span>
    </div>

    <div className="mt-3 grid grid-cols-3 gap-2">
  {[1, 2, 3].map((dieNumber) => {
    const captured = capturedResults.find(
      (result) => result.dieNumber === dieNumber
    );

    return (
      <div
        key={`captured-result-${dieNumber}`}
        className="rounded-xl border border-white/10 bg-white/[0.04] px-2 py-2 text-center"
      >
        <p className="text-[9px] font-black uppercase tracking-[0.16em] text-white/35">
          Die {dieNumber}
        </p>
        <p
          className={
            captured?.status === "cocked"
              ? "mt-1 text-xs font-black text-red-200"
              : captured
                ? "mt-1 text-xs font-black text-amber-100"
                : "mt-1 text-xs font-black text-white/30"
          }
        >
          {captured
            ? captured.status === "cocked"
              ? "Reroll"
              : captured.label
            : "—"}
        </p>
      </div>
    );
  })}
</div>
  </div>

    ) : null}

<div
  className={
    cleanTableShotMode
      ? "relative z-10 h-[82vh] min-h-[680px]"
      : "relative z-10 h-[78vh] min-h-[620px]"
  }
>
<ThreeDicePhysicsStage
  resetKey={resetKey}
  onSettledChange={setSettled}
  onFaceResultChange={setFaceResult}
  debugPhysics={debugPhysics}
  testMode={testMode}
  activeDieIndex={activeDieIndex}
  sequenceRunning={sequenceRunning}
  diceShapePreset={diceShapePreset}
  diceColliderPreset={diceColliderPreset}
  showDice={effectiveShowDice}
  forceShowStumbleBar={cleanTableShotMode}
targetAnimal={
  shadowSmokeResult ||
  targetCorrectionTestEnabled ||
  targetLaunchRecipeEnabled
    ? activeTargetAnimal
    : null
}
targetPerformanceEnabled={targetCorrectionTestEnabled}
targetLaunchRecipeEnabled={targetLaunchRecipeEnabled}
strictReadableResultGate={
  targetCorrectionTestEnabled || targetLaunchRecipeEnabled
}
shadowLaunchRecipe={
  shadowSmokeResult?.kind === "search-success"
    ? shadowSmokeResult.launchRecipe
    : null
}
recordedTrajectoryFrames={activeTrajectoryReplayFrames}
recordedTrajectoryReplayKey={trajectoryReplayKey}
trajectoryRecorderEnabled={
  trajectoryRecorderEnabled && !selectedTrajectoryPreview
}
onTrajectoryRecorderComplete={handleTrajectoryRecorderComplete}
enableV1PhysicalRelease
trajectoryRecorderRunNonce={trajectoryRecorderRunNonce}
/>
  </div>
</section>

  {trajectoryRecordings.length > 0 ? (
    <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {trajectoryRecordings.map((recording, index) => (
        <div
          key={`trajectory-recording-${index}`}
          className="rounded-2xl border border-white/10 bg-black/25 p-4"
        >
          <p className="font-black text-fuchsia-100">
            #{index + 1} · D{recording.dieIndex + 1} ·{" "}
            {recording.finalAnimal}
          </p>

          <p className="mt-1 text-white/45">
            {recording.frames.length} frames · Readable{" "}
            {recording.readableAtSeconds}s · End{" "}
            {recording.motionEndSeconds}s
          </p>

          <p className="mt-1 text-white/45">
            Travel {recording.metrics.horizontalTravel} · Tumble{" "}
            {recording.metrics.tumbleTurns} · Deflector{" "}
            {recording.metrics.deflectorBounceScore}
          </p>

          {(() => {
  const candidate: DiceTrajectoryRecorderCandidate = {
    finalAnimal: recording.finalAnimal,
    dieIndex: recording.dieIndex,
    frames: recording.frames,

    finalStatus: recording.finalStatus,
    confidence: recording.finalConfidence,
    tiltDegrees: recording.finalTiltDegrees,

    readableAtSeconds: recording.readableAtSeconds,
    motionEndSeconds: recording.motionEndSeconds,
    replayEndSeconds: recording.replayEndSeconds,

    metrics: recording.metrics,
    motionScore: getRecordedMotionScore(recording.metrics),
    motionGrade: getRecordedMotionGrade(recording.metrics),

    notes: [
      "Captured from V1 live physics recorder.",
      `Shape preset: ${diceShapePreset}`,
      `Collider preset: ${diceColliderPreset}`,
    ],
  };

  const gate = evaluateDiceTrajectoryGate(candidate);

  return (
    <>
      <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2">
        <p
          className={
            gate.severity === "block"
              ? "text-[10px] font-black uppercase tracking-[0.16em] text-red-200"
              : gate.severity === "warn"
                ? "text-[10px] font-black uppercase tracking-[0.16em] text-amber-200"
                : "text-[10px] font-black uppercase tracking-[0.16em] text-emerald-200"
          }
        >
          Gate: {gate.severity}
        </p>

        {gate.issues.length > 0 ? (
          <div className="mt-2 space-y-1">
            {gate.issues.slice(0, 3).map((issue) => (
              <p key={issue.code} className="text-[10px] text-white/45">
                • {issue.message}
              </p>
            ))}
          </div>
        ) : (
          <p className="mt-2 text-[10px] text-emerald-100/70">
            Production-ready candidate.
          </p>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => previewTrajectoryRecording(index)}
          className="rounded-xl border border-sky-300/20 bg-sky-300/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-sky-100"
        >
          Preview
        </button>

        <button
          type="button"
          onClick={() => diagnosticExportTrajectoryRecording(index)}
          className="rounded-xl border border-cyan-300/20 bg-cyan-300/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-cyan-100"
        >
          Diagnostic Export
        </button>

        <button
          type="button"
          disabled={!gate.canProductionApprove}
          onClick={() => approveTrajectoryRecording(index)}
          className={
            gate.canProductionApprove
              ? "rounded-xl border border-emerald-300/20 bg-emerald-300/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-emerald-100"
              : "cursor-not-allowed rounded-xl border border-red-300/15 bg-red-300/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-red-100/35"
          }
        >
          Production Approve
        </button>
      </div>
    </>
  );
})()}
        </div>
      ))}
    </div>
  ) : null}

        {cleanTableShotMode ? null : (
<section className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-12">
          <div className="rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4 md:col-span-1 xl:col-span-3">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-amber-200/60">
              Physics Status
            </p>
            <p className="mt-2 text-xl font-black text-white">
              {settled ? "Settled" : "Moving"}
            </p>
          </div>

          <div className="rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4 md:col-span-1 xl:col-span-3">
  <p className="text-[10px] font-black uppercase tracking-[0.25em] text-amber-200/60">
    Shape Preset
  </p>

  <p className="mt-2 text-xl font-black text-white">
    {shapePresetLabel}
  </p>

  <div className="mt-3 space-y-1 text-[11px] font-bold leading-relaxed text-white/45">
    <p>{shapePresetNote}</p>
    <p>Lab only. Production /six-animal remains Current.</p>
    <p>No collider or physics change in this step.</p>
  </div>
</div>

<div className="rounded-2xl border border-orange-300/20 bg-orange-300/10 p-4 md:col-span-1 xl:col-span-3">
  <p className="text-[10px] font-black uppercase tracking-[0.25em] text-orange-200/60">
    Collider Preset
  </p>

  <p className="mt-2 text-xl font-black text-white">
    {colliderPresetLabel}
  </p>

  <div className="mt-3 space-y-1 text-[11px] font-bold leading-relaxed text-white/45">
    <p>{colliderPresetNote}</p>
    <p>Lab only. Production /six-animal remains Current.</p>
    <p>This can affect physics. Test carefully.</p>
  </div>
</div>

<div className="rounded-2xl border border-sky-300/20 bg-sky-300/10 p-4 md:col-span-1 xl:col-span-3">
  <p className="text-[10px] font-black uppercase tracking-[0.25em] text-sky-200/60">
    Target Face
  </p>

  <div className="mt-2 flex items-start justify-between gap-3">
    <div>
      <p className="text-xl font-black text-white">{activeTargetAnimal}</p>
      <p className="mt-1 text-[11px] font-bold text-white/40">
        Axis: {targetTopFaceDebugInfo?.targetAxis ?? "Unknown"}
      </p>
    </div>

    <p className={`text-right text-xs font-black ${targetMatchTone}`}>
      {targetMatchLabel}
    </p>
  </div>

  <div className="mt-3 space-y-1 text-[11px] font-bold leading-relaxed text-white/45">
    <p>
      Detected:{" "}
      {faceResult
        ? faceResult.status === "accepted"
          ? faceResult.label
          : faceResult.nearestLabel
        : "Waiting"}
    </p>

    <p>
      Quaternion:{" "}
      {targetTopFaceDebugInfo
        ? `${targetTopFaceDebugInfo.quaternion.x.toFixed(2)}, ${targetTopFaceDebugInfo.quaternion.y.toFixed(2)}, ${targetTopFaceDebugInfo.quaternion.z.toFixed(2)}, ${targetTopFaceDebugInfo.quaternion.w.toFixed(2)}`
        : "Unavailable"}
    </p>

    <p>{targetMatchDescription}</p>
  </div>
</div>

<div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-4 md:col-span-1 xl:col-span-3">
  <p className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-200/60">
    Target Validation
  </p>

  <p className={`mt-2 text-xl font-black ${targetValidationTone}`}>
    {targetValidationLabel}
  </p>

  <div className="mt-3 space-y-1 text-[11px] font-bold leading-relaxed text-white/45">
    <p>Status: {targetResultValidation.status}</p>
    <p>{targetResultValidation.message}</p>

    {"detectedAnimal" in targetResultValidation ? (
      <p>Detected: {targetResultValidation.detectedAnimal}</p>
    ) : null}

    {"confidence" in targetResultValidation ? (
      <p>
        Confidence: {targetResultValidation.confidence}% · Tilt:{" "}
        {targetResultValidation.tiltDegrees}°
      </p>
    ) : null}
  </div>
</div>

<div className="rounded-2xl border border-lime-300/20 bg-lime-300/10 p-4 md:col-span-1 xl:col-span-3">
  <p className="text-[10px] font-black uppercase tracking-[0.25em] text-lime-200/60">
    Capture Summary
  </p>

  <p
    className={
      targetResultCaptureSummary.safeForBackendTargetCapture
        ? "mt-2 text-xl font-black text-emerald-200"
        : "mt-2 text-xl font-black text-orange-200"
    }
  >
    {targetResultCaptureSummary.safeForBackendTargetCapture
      ? "Safe"
      : "Hold"}
  </p>

  <div className="mt-3 space-y-1 text-[11px] font-bold leading-relaxed text-white/45">
    <p>
      Backend target safe:{" "}
      {targetResultCaptureSummary.safeForBackendTargetCapture ? "Yes" : "No"}
    </p>

    <p>
      Physical result readable:{" "}
      {targetResultCaptureSummary.canCaptureVisiblePhysicalResult
        ? "Yes"
        : "No"}
    </p>

    <p>
      Target: {targetResultCaptureSummary.targetAnimal ?? "None"}
    </p>

    <p>
      Visible: {targetResultCaptureSummary.visibleAnimal ?? "Waiting"}
    </p>

    <p>{targetResultCaptureSummary.captureRule}</p>
  </div>
</div>

<div className="rounded-2xl border border-purple-300/20 bg-purple-300/10 p-4 md:col-span-1 xl:col-span-3">
  <p className="text-[10px] font-black uppercase tracking-[0.25em] text-purple-200/60">
    Production Completion
  </p>

  <p
    className={
      targetCorrectionSafetyConfig.enabled
        ? "mt-2 text-xl font-black text-emerald-200"
        : "mt-2 text-xl font-black text-red-200"
    }
  >
    {targetCorrectionSafetyConfig.enabled ? "Enabled" : "Locked OFF"}
  </p>

  <div className="mt-3 space-y-1 text-[11px] font-bold leading-relaxed text-white/45">
    <p>
      Dev test:{" "}
      <span
        className={
          targetCorrectionTestEnabled
            ? "font-black text-purple-100"
            : "font-black text-white/45"
        }
      >
        {targetCorrectionTestEnabled ? "ON" : "OFF"}
      </span>
    </p>

    <p>Prod min speed: {targetCorrectionSafetyConfig.minSpeed}</p>
    <p>Prod max tilt: {targetCorrectionSafetyConfig.maxTiltDegrees}°</p>
    <p>Production target completion remains locked OFF.</p>
  </div>
</div>

<div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4 md:col-span-1 xl:col-span-3">
  <p className="text-[10px] font-black uppercase tracking-[0.25em] text-cyan-200/60">
    Readiness Gate
  </p>

  <p
    className={
      targetCorrectionReadiness.ready
        ? "mt-2 text-xl font-black text-emerald-200"
        : "mt-2 text-xl font-black text-cyan-100"
    }
  >
    {targetCorrectionReadiness.ready ? "Ready" : "Not Ready"}
  </p>

  <div className="mt-3 space-y-1 text-[11px] font-bold leading-relaxed text-white/45">
    <p>{targetCorrectionReadiness.reason}</p>
    <p>Settled: {settled ? "Yes" : "No"}</p>
    <p>Tilt: {faceResult ? `${faceResult.tiltDegrees}°` : "Waiting"}</p>
  </div>
</div>

<div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 md:col-span-2 xl:col-span-4">
  <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/35">
    Bridge Payload
  </p>

  <p className="mt-2 text-sm font-black text-white/75">
    Status: {roundPayload.status}
  </p>

  <p className="mt-1 text-sm font-bold leading-relaxed text-white/55">
    Results:{" "}
    {roundPayload.results.length > 0
      ? roundPayload.results.join(" · ")
      : "None yet"}
  </p>

<div className="mt-2 space-y-1 text-[11px] font-bold leading-relaxed text-white/35">
  <p>Clean result contract for later /six-animal integration.</p>

  <p>
    Six Animal Keys:{" "}
    {adaptedAnimalKeys.length > 0
      ? adaptedAnimalKeys.join(" · ")
      : "Waiting"}
  </p>

  <p>
    Myanmar Result:{" "}
    {adaptedMyanmarResult.length > 0
      ? adaptedMyanmarResult.join(" · ")
      : "Waiting"}
  </p>
</div>
</div>

<div className={`rounded-2xl border p-4 md:col-span-2 xl:col-span-4 ${shadowSmokeTone}`}>
  <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/45">
    Shadow Worker Smoke
  </p>

  <p className="mt-2 text-xl font-black text-white">
    {shadowSmokeLabel}
  </p>

  <div className="mt-3 space-y-1 text-[11px] font-bold leading-relaxed text-white/55">
    <p>Target: {activeTargetAnimal}</p>
    <p>Die: {safeActiveDieIndex + 1}</p>
    <p>{shadowSmokeSummary}</p>

    {shadowSequenceResults.length > 0 ? (
  <div className="my-3 rounded-2xl border border-emerald-300/15 bg-emerald-300/10 p-3">
    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-100/60">
      Shadow 3 Dice Summary
    </p>

    <div className="mt-2 space-y-2">
      {shadowSequenceResults.map((result, index) => {
        const target = targetAnimals[index];

        if (result.kind === "search-success") {
          return (
            <div
              key={`shadow-sequence-summary-${index}`}
              className="rounded-xl border border-white/10 bg-black/20 px-3 py-2"
            >
              <p className="font-black text-emerald-100">
                D{index + 1}: {target} → {result.finalAnimal}{" "}
                {result.targetMatched ? "PASS" : "MISS"}
              </p>

              <p className="text-white/45">
                Raw {result.motionMetrics.activeSeconds}s · Visual{" "}
                {result.motionMetrics.visualActiveSeconds}s · Deflector{" "}
                {result.motionMetrics.deflectorBounceScore} · Dead{" "}
                {result.motionMetrics.deadSlideSeconds}s
              </p>
            </div>
          );
        }

        return (
          <div
            key={`shadow-sequence-summary-${index}`}
            className="rounded-xl border border-red-300/20 bg-red-300/10 px-3 py-2"
          >
            <p className="font-black text-red-100">
              D{index + 1}: {target} → FAIL
            </p>

            <p className="text-white/45">
              {result.bestMatchedFinalAnimal
                ? `Best ${result.bestMatchedFinalAnimal} · Raw ${
                    result.bestMatchedMotionMetrics?.activeSeconds ?? "?"
                  }s · Deflector ${
                    result.bestMatchedMotionMetrics?.deflectorBounceScore ?? "?"
                  }`
                : result.reason}
            </p>
          </div>
        );
      })}
    </div>
  </div>
) : null}

    {shadowSmokeResult?.kind === "search-success" ? (
      <>
        <p>Matched: {shadowSmokeResult.targetMatched ? "Yes" : "No"}</p>
        <p>
          Motion: {shadowSmokeResult.motionScore} / 100 (
          {shadowSmokeResult.motionGrade})
        </p>
        <p>Notes: {shadowSmokeResult.motionNotes.slice(0, 4).join(" / ")}</p>
<p>
  Raw active: {shadowSmokeResult.motionMetrics.activeSeconds}s | Visual active:{" "}
  {shadowSmokeResult.motionMetrics.visualActiveSeconds}s | Target: 5–6s
</p>

<p>
  Travel: {shadowSmokeResult.motionMetrics.horizontalTravel} | Tumble:{" "}
  {shadowSmokeResult.motionMetrics.tumbleTurns} turns | Late:{" "}
  {shadowSmokeResult.motionMetrics.lateTumbleTurns} turns
</p>

<p>
  Deflector: {shadowSmokeResult.motionMetrics.deflectorBounceScore} | Changes:{" "}
  {shadowSmokeResult.motionMetrics.directionChangeCount}
</p>

<p>
  Dead slide: {shadowSmokeResult.motionMetrics.deadSlideSeconds}s | Front risk:{" "}
  {shadowSmokeResult.motionMetrics.frontStopRisk}
</p>

<p
  className={
    shadowSmokeResult.motionMetrics.visualActiveSeconds >= 5 &&
shadowSmokeResult.motionMetrics.visualActiveSeconds <= 7.4 &&
shadowSmokeResult.motionMetrics.deadSlideSeconds <= 0.75 &&
shadowSmokeResult.motionMetrics.deflectorBounceScore >= 0.35 &&
shadowSmokeResult.motionMetrics.lateTumbleTurns >= 0.35 &&
shadowSmokeResult.motionMetrics.frontStopRisk <= 0.72
      ? "font-black text-emerald-200"
      : "font-black text-orange-200"
  }
>
  Dice Soul Gate:{" "}
  {shadowSmokeResult.motionMetrics.visualActiveSeconds >= 5 &&
shadowSmokeResult.motionMetrics.visualActiveSeconds <= 7.4 &&
shadowSmokeResult.motionMetrics.deadSlideSeconds <= 0.75 &&
shadowSmokeResult.motionMetrics.deflectorBounceScore >= 0.35 &&
shadowSmokeResult.motionMetrics.lateTumbleTurns >= 0.35 &&
shadowSmokeResult.motionMetrics.frontStopRisk <= 0.72
    ? "PASS"
    : "CHECK"}
</p>

<p>Attempts: {shadowSmokeResult.attemptCount}</p>
        <p>Seconds: {shadowSmokeResult.simulationSeconds}</p>
      </>
    ) : shadowSmokeResult?.kind === "search-fail" ? (
      <>
        {shadowSmokeResult.bestMatchedMotionMetrics ? (
          <>
            <p className="font-black text-orange-100">
              Best matched candidate diagnostics
            </p>

            <p>
              Final: {shadowSmokeResult.bestMatchedFinalAnimal ?? "Unknown"} ·{" "}
              {shadowSmokeResult.bestMatchedFinalConfidence ?? 0}% ·{" "}
              {shadowSmokeResult.bestMatchedFinalTiltDegrees ?? 0}°
            </p>

            <p>
              Motion: {shadowSmokeResult.bestMatchedMotionScore ?? 0} / 100 (
              {shadowSmokeResult.bestMatchedMotionGrade ?? "weak"})
            </p>

            <p>
              Notes:{" "}
              {shadowSmokeResult.bestMatchedMotionNotes
                ?.slice(0, 6)
                .join(" / ") ?? "None"}
            </p>

<p>
  Raw active:{" "}
  {shadowSmokeResult.bestMatchedMotionMetrics.activeSeconds}s | Visual active:{" "}
  {shadowSmokeResult.bestMatchedMotionMetrics.visualActiveSeconds}s | Target:
  5–6s
</p>

            <p>
              Travel:{" "}
              {shadowSmokeResult.bestMatchedMotionMetrics.horizontalTravel} |
              Tumble:{" "}
              {shadowSmokeResult.bestMatchedMotionMetrics.tumbleTurns} turns |
              Late:{" "}
              {shadowSmokeResult.bestMatchedMotionMetrics.lateTumbleTurns} turns
            </p>

            <p>
              Deflector:{" "}
              {
                shadowSmokeResult.bestMatchedMotionMetrics
                  .deflectorBounceScore
              }{" "}
              | Changes:{" "}
              {
                shadowSmokeResult.bestMatchedMotionMetrics
                  .directionChangeCount
              }
            </p>

            <p>
              Dead slide:{" "}
              {shadowSmokeResult.bestMatchedMotionMetrics.deadSlideSeconds}s |
              Front risk:{" "}
              {shadowSmokeResult.bestMatchedMotionMetrics.frontStopRisk}
            </p>

            <p>
              Final settle:{" "}
              {shadowSmokeResult.bestMatchedMotionMetrics.finalSettleScore} |
              First impact:{" "}
              {shadowSmokeResult.bestMatchedMotionMetrics.firstImpactScore}
            </p>

            <p
              className={
                shadowSmokeResult.bestMatchedMotionMetrics.activeSeconds >= 4 &&
                shadowSmokeResult.bestMatchedMotionMetrics.activeSeconds <= 7.4 &&
                shadowSmokeResult.bestMatchedMotionMetrics.deadSlideSeconds <=
                  0.75 &&
                shadowSmokeResult.bestMatchedMotionMetrics.deflectorBounceScore >=
                  0.35 &&
                shadowSmokeResult.bestMatchedMotionMetrics.lateTumbleTurns >=
                  0.35 &&
                shadowSmokeResult.bestMatchedMotionMetrics.frontStopRisk <= 0.72
                  ? "font-black text-emerald-200"
                  : "font-black text-orange-200"
              }
            >
              Dice Soul Gate:{" "}
              {shadowSmokeResult.bestMatchedMotionMetrics.activeSeconds >= 4 &&
              shadowSmokeResult.bestMatchedMotionMetrics.activeSeconds <= 7.4 &&
              shadowSmokeResult.bestMatchedMotionMetrics.deadSlideSeconds <=
                0.75 &&
              shadowSmokeResult.bestMatchedMotionMetrics.deflectorBounceScore >=
                0.35 &&
              shadowSmokeResult.bestMatchedMotionMetrics.lateTumbleTurns >=
                0.35 &&
              shadowSmokeResult.bestMatchedMotionMetrics.frontStopRisk <= 0.72
                ? "PASS BY METRICS"
                : "CHECK"}
            </p>

            <p>
              Best attempt:{" "}
              {shadowSmokeResult.bestMatchedAttemptCount ?? "Unknown"}
            </p>
          </>
        ) : (
          <p>No target-matched diagnostic candidate found.</p>
        )}

        <p>Attempts: {shadowSmokeResult.attemptCount}</p>
      </>
    ) : null}
  </div>
</div>

<div className="rounded-2xl border border-fuchsia-300/20 bg-fuchsia-300/10 p-4 md:col-span-2 xl:col-span-12">
  <p className="text-[10px] font-black uppercase tracking-[0.25em] text-fuchsia-200/60">
    V1 Trajectory Recorder
  </p>

  <p className="mt-2 text-xl font-black text-white">
    {trajectoryRecorderStatus}
  </p>

  <div className="mt-4 rounded-2xl border border-fuchsia-300/15 bg-black/25 p-4">
  <div className="flex flex-wrap items-start justify-between gap-3">
    <div>
      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-fuchsia-200/60">
        First Library Routine
      </p>

      <h3 className="mt-1 text-lg font-black text-fuchsia-50">
        Build 10 Approved Throws Per Animal
      </h3>
    </div>

    <div
      className={
        trajectoryLibraryComplete
          ? "rounded-full border border-emerald-300/25 bg-emerald-300/15 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-emerald-100"
          : "rounded-full border border-amber-300/25 bg-amber-300/15 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-amber-100"
      }
    >
      {trajectoryLibraryComplete
        ? "Library Complete"
        : `Need: ${nextTrajectoryLibraryAnimal}`}
    </div>
  </div>

  <div className="mt-3 grid gap-2 md:grid-cols-2 xl:grid-cols-4">
    <div className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2">
      <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/35">
        Step 1
      </p>
      <p className="mt-1 text-xs font-bold leading-5 text-white/65">
        Click Record V1 3 Dice and let all three dice finish naturally.
      </p>
    </div>

    <div className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2">
      <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/35">
        Step 2
      </p>
      <p className="mt-1 text-xs font-bold leading-5 text-white/65">
        Preview every captured throw before approving.
      </p>
    </div>

    <div className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2">
      <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/35">
        Step 3
      </p>
      <p className="mt-1 text-xs font-bold leading-5 text-white/65">
        Production Approve only beautiful, readable, natural throws.
      </p>
    </div>

    <div className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2">
      <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/35">
        Step 4
      </p>
      <p className="mt-1 text-xs font-bold leading-5 text-white/65">
        Save each downloaded file into its matching animal folder.
      </p>
    </div>
  </div>

  <div className="mt-3 rounded-xl border border-red-300/15 bg-red-300/10 px-3 py-2">
    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-red-100/70">
      Approval Rule
    </p>

    <p className="mt-1 text-xs font-bold leading-5 text-white/65">
      Do not approve ugly motion, floating/stuck dice, fake-feeling correction,
      poor readability, long dead slide, or weak tumble. Use Diagnostic Export
      instead.
    </p>
  </div>
</div>

<div className="mt-3 space-y-2 text-[11px] font-bold leading-relaxed text-white/55">
  <div className="rounded-2xl border border-emerald-300/15 bg-emerald-300/10 p-3">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-emerald-200/60">
          Trajectory Library Loader
        </p>

<p className="mt-1 text-sm font-black text-emerald-50">
  {trajectoryLibrarySmokeStatus === "pass"
    ? "Smoke Passed"
    : trajectoryLibrarySmokeStatus === "fail"
      ? "Smoke Failed"
      : trajectoryLibrarySmokeStatus === "loading"
        ? "Loading"
        : "Ready"}
</p>

<p className="mt-2 text-xs font-bold leading-5 text-emerald-50/60">
  For three-dice replay, choose animals from the top D1 / D2 / D3 selectors,
  then click Test Selected D1/D2/D3 Replay. The one-animal replay tool is hidden
  in simple mode.
</p>
      </div>

      <button
        type="button"
        disabled={trajectoryLibrarySmokeStatus === "loading"}
        onClick={runTrajectoryLibrarySmokeTest}
        className={
          trajectoryLibrarySmokeStatus === "loading"
            ? "cursor-wait rounded-xl border border-sky-300/25 bg-sky-300/15 px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-sky-100"
            : "rounded-xl border border-emerald-300/25 bg-emerald-300/15 px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-emerald-100"
        }
      >
       Check 18 Replay Files
      </button>
    </div>

    <div className="mt-3 flex flex-wrap items-center gap-2 rounded-xl border border-white/10 bg-black/20 p-3">
{SHOW_DICE_LAB_ADVANCED_TOOLS ? (
  <>
    <select
      value={trajectoryLibraryReplayAnimal}
      disabled={trajectoryLibraryReplayStatus === "loading"}
      onChange={(event) =>
        setTrajectoryLibraryReplayAnimal(event.target.value as DiceAnimalLabel)
      }
      className="rounded-xl border border-white/10 bg-black/45 px-3 py-2 text-xs font-black text-white outline-none"
    >
      {DICE_TRAJECTORY_LIBRARY_ANIMALS.map((animal) => (
        <option key={`trajectory-replay-animal-${animal}`} value={animal}>
          {animal}
        </option>
      ))}
    </select>

    <button
      type="button"
      disabled={trajectoryLibraryReplayStatus === "loading"}
      onClick={() => replayTrajectoryLibraryAnimal()}
      className={
        trajectoryLibraryReplayStatus === "loading"
          ? "cursor-wait rounded-xl border border-sky-300/25 bg-sky-300/15 px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-sky-100"
          : "rounded-xl border border-fuchsia-300/25 bg-fuchsia-300/15 px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-fuchsia-100"
      }
    >
      Test One Animal
    </button>
  </>
) : null}

<button
  type="button"
  disabled={
    trajectoryLibraryReplayRoundStatus === "loading" ||
    trajectoryLibraryReplayRoundStatus === "replaying"
  }
  onClick={replayTrajectoryLibraryThreeDiceRound}
  className={
    trajectoryLibraryReplayRoundStatus === "loading" ||
    trajectoryLibraryReplayRoundStatus === "replaying"
      ? "cursor-wait rounded-xl border border-sky-300/25 bg-sky-300/15 px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-sky-100"
      : "rounded-xl border border-amber-300/25 bg-amber-300/15 px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-amber-100"
  }
>
  Test Selected D1/D2/D3 Replay
</button>

<p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/45">
  Uses top D1 / D2 / D3 selectors
</p>

  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/45">
    {trajectoryLibraryReplayStatus === "ready"
      ? "Replay Ready"
      : trajectoryLibraryReplayStatus === "fail"
        ? "Replay Failed"
        : trajectoryLibraryReplayStatus === "loading"
          ? "Loading Replay"
          : "Saved Replay Idle"}
  </p>
</div>

{trajectoryLibraryReplayError ? (
  <p className="mt-3 text-xs font-bold text-red-200">
    {trajectoryLibraryReplayError}
  </p>
) : null}

{trajectoryLibraryReplay ? (
  <div className="mt-3 rounded-xl border border-fuchsia-300/15 bg-fuchsia-300/10 px-3 py-2">
    <p className="text-xs font-black text-fuchsia-100">
      Replaying {trajectoryLibraryReplay.animal}
    </p>
    <p className="mt-1 text-[10px] text-white/45">
      {trajectoryLibraryReplay.fileName} · Frames{" "}
      {trajectoryLibraryReplay.frames.length} ·{" "}
      {trajectoryLibraryReplay.motionGrade} ·{" "}
      {trajectoryLibraryReplay.confidence}%
    </p>
  </div>
) : null}

{trajectoryLibraryReplayRoundError ? (
  <p className="mt-3 text-xs font-bold text-red-200">
    {trajectoryLibraryReplayRoundError}
  </p>
) : null}

{trajectoryLibraryReplayRound.length > 0 ? (
  <div className="mt-3 rounded-xl border border-amber-300/15 bg-amber-300/10 px-3 py-2">
    <p className="text-xs font-black text-amber-100">
      Saved 3 Dice Replay:{" "}
      {trajectoryLibraryReplayRoundStatus === "complete"
        ? "Complete"
        : trajectoryLibraryReplayRoundStatus === "fail"
          ? "Failed"
          : trajectoryLibraryReplayRoundStatus === "replaying"
            ? `Playing ${trajectoryLibraryReplayRoundIndex + 1}/3`
            : "Ready"}
    </p>

    <div className="mt-2 grid gap-2 sm:grid-cols-3">
      {trajectoryLibraryReplayRound.map((replay, index) => (
        <div
          key={`trajectory-library-round-${index}-${replay.fileName}`}
          className="rounded-lg border border-white/10 bg-black/25 px-2 py-2"
        >
          <p className="text-[10px] font-black text-amber-100">
            D{index + 1}: {targetAnimals[index]}
          </p>
          <p className="mt-1 text-[9px] text-white/45">
            {replay.fileName}
          </p>
        </div>
      ))}
    </div>
  </div>
) : null}

    {trajectoryLibrarySmokeError ? (
      <p className="mt-3 text-xs font-bold text-red-200">
        {trajectoryLibrarySmokeError}
      </p>
    ) : null}

    {trajectoryLibrarySmokeRows.length > 0 ? (
      <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {trajectoryLibrarySmokeRows.map((row) => (
          <div
            key={`trajectory-loader-smoke-${row.animal}-${row.fileName}`}
            className="rounded-xl border border-white/10 bg-black/25 px-3 py-2"
          >
            <p className="text-xs font-black text-emerald-100">
              {row.animal}
            </p>
            <p className="mt-1 text-[10px] text-white/45">
              {row.fileName}
            </p>
            <p className="mt-1 text-[10px] text-white/45">
              Frames {row.frames} · {row.motionGrade} · {row.confidence}%
            </p>
          </div>
        ))}
      </div>
    ) : null}
  </div>

<p>Captured: {trajectoryRecordings.length}</p>

{SHOW_DICE_LAB_ADVANCED_TOOLS ? (
  <>
    <p>Approved production files: {approvedTrajectoryFiles.length}</p>

    <div className="mt-4 rounded-2xl border border-amber-300/15 bg-black/25 p-3">
      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-amber-200/60">
        Approved Library Count
      </p>

      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {Object.entries(approvedTrajectoryCounts).map(([animal, count]) => (
          <div
            key={`approved-count-${animal}`}
            className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2"
          >
            <p className="text-[9px] font-black uppercase tracking-[0.16em] text-white/35">
              {animal}
            </p>
            <p className="mt-1 text-lg font-black text-amber-100">
              {count} / 10
            </p>
          </div>
        ))}
      </div>
    </div>
  </>
) : null}

<p>
  Preview: {trajectoryPreviewLabel}
</p>
  </div>

{SHOW_DICE_LAB_ADVANCED_TOOLS ? (
  <>
    <div className="mt-3 flex flex-wrap gap-2">
      <button
        type="button"
        disabled={approvedTrajectoryFiles.length === 0}
        onClick={exportApprovedTrajectories}
        className={
          approvedTrajectoryFiles.length > 0
            ? "rounded-xl border border-amber-300/25 bg-amber-300/15 px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-amber-100"
            : "cursor-not-allowed rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-white/25"
        }
      >
        Export JSON
      </button>

      <button
        type="button"
        disabled={approvedTrajectoryFiles.length === 0}
        onClick={downloadTrajectoryManifest}
        className={
          approvedTrajectoryFiles.length > 0
            ? "rounded-xl border border-emerald-300/25 bg-emerald-300/15 px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-emerald-100"
            : "cursor-not-allowed rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-white/25"
        }
      >
        Manifest
      </button>

      <button
        type="button"
        disabled={approvedTrajectoryFiles.length === 0}
        onClick={downloadApprovedTrajectories}
        className={
          approvedTrajectoryFiles.length > 0
            ? "rounded-xl border border-cyan-300/25 bg-cyan-300/15 px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-cyan-100"
            : "cursor-not-allowed rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-white/25"
        }
      >
        Download
      </button>
    </div>

    {trajectoryExportText ? (
      <textarea
        readOnly
        value={trajectoryExportText}
        className="mt-3 h-48 w-full rounded-xl border border-white/10 bg-black/40 p-3 font-mono text-[10px] leading-relaxed text-fuchsia-50 outline-none"
      />
    ) : null}
  </>
) : null}
</div>

<div className={`rounded-2xl border p-4 md:col-span-2 xl:col-span-4 ${resultPanelTone}`}>
<p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/45">
  Physical Capture
</p>

  <p className="mt-2 text-xl font-black text-white">
    {resultStatusLabel}
  </p>

  <div className="mt-3 space-y-1 text-sm font-bold leading-relaxed text-white/70">
    {faceResult ? (
      <>
        <p
          className={
            faceResult.status === "accepted"
              ? "text-lg font-black text-emerald-200"
              : "text-lg font-black text-red-200"
          }
        >
          {faceResult.label}
        </p>

        <p>
          Nearest face: {faceResult.nearestLabel}
        </p>

        <p>
          Axis {faceResult.axis} · {faceResult.confidence}% confidence ·{" "}
          {faceResult.tiltDegrees}° tilt
        </p>

        <p
          className={
            faceResult.status === "accepted"
              ? "text-emerald-100/80"
              : "text-red-100/80"
          }
        >
          {faceResult.message}
        </p>
      </>
    ) : (
      <p>Waiting for visible dice to stop before reading the physical top face.</p>
    )}
  </div>
</div>
        </section>
        )}
      </div>
    </main>
  );
}