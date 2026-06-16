//src>components>games>six-animal>ThreeDiceSequenceController.tsx

"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import ThreeDicePhysicsStage, {
  createThreeDiceRoundPayload,
  type CapturedDiceResult,
  type DiceAnimalLabel,
  type DiceFaceResult,
  type HeldRecordedTrajectoryDice,
  type MountedDiceRackMode,
  type ThreeDiceRoundPayload,
} from "./ThreeDicePhysicsStage";
import type { DiceTrajectoryFrame } from "./physics/diceShadowTypes";
import { loadDiceTrajectoryForAnimal } from "./physics/diceTrajectoryLibrary";

const EXPECTED_DICE_RESULT_COUNT = 3;

const APPROVED_DICE_CONFIRM_HOLD_MS = 950;
const APPROVED_DICE_FINAL_HOLD_MS = 2400;
const APPROVED_LIBRARY_CAPTURE_GUARD_MS = 3200;

// The replay file already knows when the motion should visually finish.
// Do not reveal the result board only because the face became readable early.
const APPROVED_REPLAY_REVEAL_EXTRA_HOLD_MS = 650;

type ThreeDiceSequenceControllerProps = {
  enabled: boolean;
  runKey: number;
  onComplete: (
    payload: ThreeDiceRoundPayload,
    visualRoundId?: string | null
  ) => void;
  onProgress?: (
    payload: ThreeDiceRoundPayload,
    visualRoundId?: string | null
  ) => void;
  onDiceDrop?: (dieNumber: number, visualRoundId?: string | null) => void;
  visualRoundId?: string | null;
  className?: string;
  showInternalResultStrip?: boolean;
  mountedDiceRackMode?: MountedDiceRackMode;
  serverRngResults?: string[];
};

type ApprovedReplayTrajectory = {
  dieIndex: number;
  targetAnimal: DiceAnimalLabel;
  finalAnimal: DiceAnimalLabel;
  frames: DiceTrajectoryFrame[];
  readableAtSeconds?: number;
  motionEndSeconds?: number;
  replayEndSeconds?: number;
  motionGrade?: string;
  motionScore?: number;
  fileName: string;
};

function mapBackendAnimalToDiceLabel(
  animalKey?: string | null
): DiceAnimalLabel | null {
  if (animalKey === "tiger") return "Tiger";
  if (animalKey === "dragon") return "Dragon";
  if (animalKey === "rooster") return "Rooster";
  if (animalKey === "fish") return "Fish";
  if (animalKey === "crab") return "Crab";
  if (animalKey === "elephant") return "Elephant";

  return null;
}

function createApprovedReplayCapturedResult({
  result,
  trajectory,
  dieNumber,
}: {
  result: DiceFaceResult;
  trajectory: ApprovedReplayTrajectory;
  dieNumber: number;
}): CapturedDiceResult {
  const visibleLabel = trajectory.finalAnimal;

  return {
    ...result,
    status: "accepted",
    label: visibleLabel,
    nearestLabel: visibleLabel,
    message: `Approved trajectory replay captured from ${trajectory.fileName}.`,
    dieNumber,
  };
}

function getApprovedReplayRevealGateMs(
  trajectory: ApprovedReplayTrajectory
) {
  const lastFrame = trajectory.frames[trajectory.frames.length - 1];

  const replayEndSeconds =
    Number.isFinite(trajectory.replayEndSeconds) &&
    Number(trajectory.replayEndSeconds) > 0
      ? Number(trajectory.replayEndSeconds)
      : Number.isFinite(trajectory.motionEndSeconds) &&
          Number(trajectory.motionEndSeconds) > 0
        ? Number(trajectory.motionEndSeconds)
        : lastFrame?.t ?? 0;

  return Math.ceil(replayEndSeconds * 1000) + APPROVED_REPLAY_REVEAL_EXTRA_HOLD_MS;
}

export default function ThreeDiceSequenceController({
  enabled,
  runKey,
  onComplete,
  onProgress,
  onDiceDrop,
  visualRoundId = null,
  className = "",
  showInternalResultStrip = true,
  mountedDiceRackMode = enabled ? "sequence" : "ready",
  serverRngResults = [],
}: ThreeDiceSequenceControllerProps) {
  const [resetKey, setResetKey] = useState(1);
  const [, setSettled] = useState(false);
  const [activeDieIndex, setActiveDieIndex] = useState(0);
  const [sequenceRunning, setSequenceRunning] = useState(false);
  const [holdFinalDiceOnTable, setHoldFinalDiceOnTable] = useState(false);
  const [capturedResults, setCapturedResults] = useState<CapturedDiceResult[]>(
    []
  );
  const [faceCaptureOwner, setFaceCaptureOwner] = useState<{
    dieIndex: number;
    result: DiceFaceResult;
  } | null>(null);
  const [replayTrajectories, setReplayTrajectories] = useState<
    Array<ApprovedReplayTrajectory | null>
  >([null, null, null]);
  const [replayPreparing, setReplayPreparing] = useState(false);
  const [replayError, setReplayError] = useState<string | null>(null);
  const [captureGateTick, setCaptureGateTick] = useState(0);

  const lastStartedSequenceKeyRef = useRef<string | null>(null);
  const activeVisualRoundIdRef = useRef<string | null>(null);
  const capturedResultsOwnerRef = useRef<string | null>(null);
  const capturedDieNumbersRef = useRef<Set<number>>(new Set());
  const completionSentRef = useRef(false);
  const visualSequenceInFlightRef = useRef(false);
  const nextDieTimerRef = useRef<number | null>(null);
  const captureGateTimerRef = useRef<number | null>(null);
  const activeDieStartedAtRef = useRef(0);
  const replayTrajectoriesRef = useRef<Array<ApprovedReplayTrajectory | null>>([
    null,
    null,
    null,
  ]);
  const onProgressRef = useRef(onProgress);
  const onCompleteRef = useRef(onComplete);
  const onDiceDropRef = useRef(onDiceDrop);
  const lastDiceDropSoundKeyRef = useRef<string | null>(null);

  function clearTimers() {
    if (nextDieTimerRef.current) {
      window.clearTimeout(nextDieTimerRef.current);
      nextDieTimerRef.current = null;
    }

    if (captureGateTimerRef.current) {
      window.clearTimeout(captureGateTimerRef.current);
      captureGateTimerRef.current = null;
    }
  }

  async function prepareApprovedLibraryTrajectories({
    roundId,
    sequenceKey,
    targetAnimals,
  }: {
    roundId: string;
    sequenceKey: string;
    targetAnimals: DiceAnimalLabel[];
  }) {
    setReplayPreparing(true);
    setReplayError(null);
    setReplayTrajectories([null, null, null]);
    replayTrajectoriesRef.current = [null, null, null];

    try {
      const loadedTrajectories = await Promise.all(
        targetAnimals.map(async (targetAnimal, dieIndex) => {
          const { entry, trajectory, slotMatch } =
            await loadDiceTrajectoryForAnimal({
              animal: targetAnimal,
              preferredDieIndex: dieIndex,
              random: Math.random,
            });

          if (slotMatch !== "exact-slot") {
            throw new Error(
              `Approved replay requires exact D${
                dieIndex + 1
              } slot for ${targetAnimal}.`
            );
          }

          if (trajectory.dieIndex !== dieIndex) {
            throw new Error(
              `Replay slot mismatch. Expected D${dieIndex + 1}, got D${
                trajectory.dieIndex + 1
              } from ${entry.fileName}.`
            );
          }

return {
  dieIndex,
  targetAnimal,
  finalAnimal: trajectory.animal,
  frames: trajectory.frames,
  readableAtSeconds: trajectory.timing.readableAtSeconds,
  motionEndSeconds: trajectory.timing.motionEndSeconds,
  replayEndSeconds: trajectory.timing.replayEndSeconds,
  motionGrade: trajectory.quality.motionGrade,
  motionScore: trajectory.quality.motionScore,
  fileName: entry.fileName,
} satisfies ApprovedReplayTrajectory;
        })
      );

      if (sequenceKey !== lastStartedSequenceKeyRef.current) return;
      if (roundId !== activeVisualRoundIdRef.current) return;

      replayTrajectoriesRef.current = loadedTrajectories;
      setReplayTrajectories(loadedTrajectories);
      setReplayPreparing(false);
      activeDieStartedAtRef.current = Date.now();
      setSequenceRunning(true);
      setResetKey((value) => value + 1);
    } catch (error) {
      if (sequenceKey !== lastStartedSequenceKeyRef.current) return;
      if (roundId !== activeVisualRoundIdRef.current) return;

      setReplayPreparing(false);
      setReplayError(
        error instanceof Error
          ? error.message
          : "Approved trajectory library failed to load."
      );
    }
  }

  function resetSequenceForNewRun({
    roundId,
    sequenceKey,
    targetAnimals,
  }: {
    roundId: string;
    sequenceKey: string;
    targetAnimals: DiceAnimalLabel[];
  }) {
    clearTimers();

    activeVisualRoundIdRef.current = roundId;
    capturedResultsOwnerRef.current = roundId;
    capturedDieNumbersRef.current.clear();
    completionSentRef.current = false;
    visualSequenceInFlightRef.current = true;
    lastDiceDropSoundKeyRef.current = null;

    setCapturedResults([]);
    setActiveDieIndex(0);
    setSettled(false);
    setFaceCaptureOwner(null);
    setHoldFinalDiceOnTable(false);
    setSequenceRunning(false);
    setResetKey((value) => value + 1);

    void prepareApprovedLibraryTrajectories({
      roundId,
      sequenceKey,
      targetAnimals,
    });
  }

  const handleFaceResultChange = useCallback(
    (result: DiceFaceResult | null) => {
      setFaceCaptureOwner(
        result
          ? {
              dieIndex: activeDieIndex,
              result,
            }
          : null
      );
    },
    [activeDieIndex]
  );

  useEffect(() => {
    onProgressRef.current = onProgress;
  }, [onProgress]);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    onDiceDropRef.current = onDiceDrop;
  }, [onDiceDrop]);

  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, []);

  useEffect(() => {
    if (!visualRoundId) {
      const hasLockedVisualRound =
        visualSequenceInFlightRef.current &&
        Boolean(activeVisualRoundIdRef.current) &&
        !completionSentRef.current;

      if (hasLockedVisualRound) {
        return;
      }

      clearTimers();
      visualSequenceInFlightRef.current = false;
      setSequenceRunning(false);
      setHoldFinalDiceOnTable(false);
      setFaceCaptureOwner(null);
      setReplayPreparing(false);
      setReplayError(null);
      return;
    }

    if (!enabled) {
      const hasLockedVisualRound =
        visualSequenceInFlightRef.current &&
        activeVisualRoundIdRef.current === visualRoundId &&
        !completionSentRef.current;

      if (hasLockedVisualRound) {
        return;
      }

      clearTimers();
      setSequenceRunning(false);
      setFaceCaptureOwner(null);
      return;
    }

    const targetAnimals = serverRngResults
      .slice(0, EXPECTED_DICE_RESULT_COUNT)
      .map((animalKey) => mapBackendAnimalToDiceLabel(animalKey));

    const hasValidTargets =
      targetAnimals.length === EXPECTED_DICE_RESULT_COUNT &&
      targetAnimals.every(Boolean);

    if (!hasValidTargets) {
      setSequenceRunning(false);
      setReplayPreparing(false);
      setReplayError("Missing backend dice result animals.");
      return;
    }

    const sequenceKey = `${runKey}|${visualRoundId}`;

    if (lastStartedSequenceKeyRef.current === sequenceKey) {
      return;
    }

    lastStartedSequenceKeyRef.current = sequenceKey;

    resetSequenceForNewRun({
      roundId: visualRoundId,
      sequenceKey,
      targetAnimals: targetAnimals as DiceAnimalLabel[],
    });
  }, [enabled, runKey, visualRoundId, serverRngResults]);

  const activeReplayTrajectory = replayTrajectories[activeDieIndex] ?? null;
  const activeReplayFrames = activeReplayTrajectory?.frames ?? null;
  const hasActiveReplayFrames = Boolean(activeReplayFrames?.length);

  const visualSequenceAllowed =
    enabled ||
    (visualSequenceInFlightRef.current &&
      Boolean(activeVisualRoundIdRef.current) &&
      !completionSentRef.current);

  useEffect(() => {
    if (!visualSequenceAllowed || !sequenceRunning) return;
    if (!hasActiveReplayFrames) return;

    const ownerRoundId = activeVisualRoundIdRef.current;

    if (!ownerRoundId) return;

    const dieNumber = activeDieIndex + 1;
    const soundKey = `${ownerRoundId}:${dieNumber}:${resetKey}:approved-replay`;

    if (lastDiceDropSoundKeyRef.current === soundKey) return;
    if (capturedDieNumbersRef.current.has(dieNumber)) return;

    lastDiceDropSoundKeyRef.current = soundKey;
    onDiceDropRef.current?.(dieNumber, ownerRoundId);
  }, [
    visualSequenceAllowed,
    sequenceRunning,
    activeDieIndex,
    resetKey,
    hasActiveReplayFrames,
  ]);

  useEffect(() => {
    if (!visualSequenceAllowed || !sequenceRunning) return;
    if (!faceCaptureOwner) return;
    if (faceCaptureOwner.dieIndex !== activeDieIndex) return;
    if (!activeReplayTrajectory) return;

    const dieNumber = activeDieIndex + 1;

    if (capturedDieNumbersRef.current.has(dieNumber)) return;

    clearTimers();

const elapsedMs = Date.now() - activeDieStartedAtRef.current;

const replayRevealGateMs = getApprovedReplayRevealGateMs(
  activeReplayTrajectory
);

const requiredRevealGateMs = Math.max(
  APPROVED_LIBRARY_CAPTURE_GUARD_MS,
  replayRevealGateMs
);

if (elapsedMs < requiredRevealGateMs) {
  const waitMs = requiredRevealGateMs - elapsedMs;

  captureGateTimerRef.current = window.setTimeout(() => {
    captureGateTimerRef.current = null;
    setCaptureGateTick((value) => value + 1);
  }, waitMs);

  return;
}

    const capturedResult = createApprovedReplayCapturedResult({
      result: faceCaptureOwner.result,
      trajectory: activeReplayTrajectory,
      dieNumber,
    });

    capturedDieNumbersRef.current.add(dieNumber);
    capturedResultsOwnerRef.current = activeVisualRoundIdRef.current;

    setCapturedResults((current) => {
      const withoutDuplicate = current.filter(
        (result) => result.dieNumber !== dieNumber
      );

      return [...withoutDuplicate, capturedResult].sort(
        (a, b) => a.dieNumber - b.dieNumber
      );
    });

    setSettled(false);
    setFaceCaptureOwner(null);

    if (activeDieIndex < EXPECTED_DICE_RESULT_COUNT - 1) {
      nextDieTimerRef.current = window.setTimeout(() => {
        activeDieStartedAtRef.current = Date.now();
        setActiveDieIndex(activeDieIndex + 1);
        setResetKey((value) => value + 1);
        nextDieTimerRef.current = null;
      }, APPROVED_DICE_CONFIRM_HOLD_MS);

      return;
    }

    nextDieTimerRef.current = window.setTimeout(() => {
      setHoldFinalDiceOnTable(true);
      setSequenceRunning(false);
      nextDieTimerRef.current = null;
    }, APPROVED_DICE_FINAL_HOLD_MS);
  }, [
    visualSequenceAllowed,
    sequenceRunning,
    activeDieIndex,
    faceCaptureOwner,
    activeReplayTrajectory,
    captureGateTick,
  ]);

  useEffect(() => {
    if (capturedResults.length === 0) return;

    const ownerRoundId = capturedResultsOwnerRef.current;

    if (!ownerRoundId || ownerRoundId !== activeVisualRoundIdRef.current) {
      return;
    }

    onProgressRef.current?.(
      createThreeDiceRoundPayload(capturedResults, sequenceRunning),
      ownerRoundId
    );
  }, [capturedResults, sequenceRunning]);

  useEffect(() => {
    if (sequenceRunning) return;
    if (capturedResults.length !== EXPECTED_DICE_RESULT_COUNT) return;

    const ownerRoundId = capturedResultsOwnerRef.current;

    if (!ownerRoundId || ownerRoundId !== activeVisualRoundIdRef.current) {
      return;
    }

    if (completionSentRef.current) return;

    completionSentRef.current = true;
    visualSequenceInFlightRef.current = false;

    onCompleteRef.current(
      createThreeDiceRoundPayload(capturedResults, false),
      ownerRoundId
    );
  }, [sequenceRunning, capturedResults]);

  const shouldShowActiveTableDice =
    (sequenceRunning && hasActiveReplayFrames) || holdFinalDiceOnTable;

  const stageActiveDieIndex = shouldShowActiveTableDice ? activeDieIndex : -1;

  const stageMountedDiceRackMode: MountedDiceRackMode = shouldShowActiveTableDice
    ? "sequence"
    : mountedDiceRackMode;

  const stageRecordedFrames = shouldShowActiveTableDice
    ? activeReplayFrames
    : null;

const heldRecordedTrajectoryDice: HeldRecordedTrajectoryDice[] = [];

  return (
    <div
      className={`relative h-full min-h-[360px] overflow-hidden rounded-[1.6rem] border border-amber-300/15 bg-black/35 ${className}`}
    >
      <ThreeDicePhysicsStage
        resetKey={resetKey}
        onSettledChange={setSettled}
        onFaceResultChange={handleFaceResultChange}
        debugPhysics={false}
        testMode="trap"
        activeDieIndex={stageActiveDieIndex}
        sequenceRunning={shouldShowActiveTableDice}
        displayOnly={false}
        variant="room"
        mountedDiceRackMode={stageMountedDiceRackMode}
        hideActiveDiceFaces={false}
        captureRequestKey={0}
        targetAnimal={null}
        targetPerformanceEnabled={false}
        strictReadableResultGate={false}
        targetLaunchRecipeEnabled={false}
        recordedTrajectoryFrames={stageRecordedFrames}
recordedTrajectoryReplayKey={resetKey}
heldRecordedTrajectoryDice={heldRecordedTrajectoryDice}
enableV1PhysicalRelease={false}
      />

      {showInternalResultStrip ? (
        <div className="pointer-events-none absolute bottom-3 left-1/2 z-20 w-[min(92%,360px)] -translate-x-1/2 rounded-2xl border border-amber-300/20 bg-black/60 p-3 text-center shadow-2xl shadow-black/60 backdrop-blur-md">
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-amber-200/60">
            3D Dice Sequence
          </p>

          <div className="mt-2 grid grid-cols-3 gap-2">
            {[1, 2, 3].map((dieNumber) => {
              const captured = capturedResults.find(
                (result) => result.dieNumber === dieNumber
              );

              const trajectory = replayTrajectories[dieNumber - 1];

              return (
                <div
                  key={`sequence-die-${dieNumber}`}
                  className="rounded-xl border border-white/10 bg-white/[0.04] px-2 py-2"
                >
                  <p className="text-[9px] font-black uppercase tracking-[0.14em] text-white/35">
                    Die {dieNumber}
                  </p>

                  <p className="mt-1 text-xs font-black text-amber-100">
                    {captured?.label ??
                      trajectory?.targetAnimal ??
                      (replayPreparing ? "..." : "—")}
                  </p>
                </div>
              );
            })}
          </div>

          {replayError ? (
            <p className="mt-2 text-[10px] font-bold text-red-200">
              {replayError}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}