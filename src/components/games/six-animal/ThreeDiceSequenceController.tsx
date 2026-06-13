//src>components>games>six-animal>ThreeDiceSequenceController.tsx

"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import ThreeDicePhysicsStage, {
  createThreeDiceRoundPayload,
  type CapturedDiceResult,
  type DiceFaceResult,
  type DiceAnimalLabel,
  type MountedDiceRackMode,
  type ThreeDiceRoundPayload,
} from "./ThreeDicePhysicsStage";
import type {
  DiceShadowWorkerRequest,
  DiceShadowWorkerResponse,
  DiceTrajectoryFrame,
} from "./physics/diceShadowTypes";

const EXPECTED_DICE_RESULT_COUNT = 3;

const LIVE_DICE_CONFIRM_HOLD_MS = 1550;
const LIVE_DICE_FINAL_CONFIRM_HOLD_MS = 1800;

const SHADOW_ATTEMPT_LIMIT = 980;
const SHADOW_MAX_SIMULATION_SECONDS = 7.2;
const SHADOW_FRAME_RATE: 30 | 60 = 30;

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

type ShadowTrajectory = {
  dieIndex: number;
  targetAnimal: DiceAnimalLabel;
  finalAnimal: DiceAnimalLabel;
  frames: DiceTrajectoryFrame[];
  motionGrade?: string;
  motionScore?: number;
  source: "shadow-pass" | "shadow-best-match";
};

type ShadowRequestOwner = {
  sequenceKey: string;
  roundId: string;
  dieIndex: number;
  targetAnimal: DiceAnimalLabel;
};

function createVisibleCapturedResult(
  result: DiceFaceResult,
  dieNumber: number
): CapturedDiceResult | null {
  if (result.status !== "accepted") {
    return null;
  }

  const visibleLabel = result.label as DiceAnimalLabel;

  return {
    ...result,
    status: "accepted",
    label: visibleLabel,
    nearestLabel: visibleLabel,
    message: result.message || "Visible dice face captured.",
    dieNumber,
  };
}

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

function createDiceShadowWorker() {
  return new Worker(new URL("./physics/diceShadowWorker.ts", import.meta.url), {
    type: "module",
  });
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
  const [shadowTrajectories, setShadowTrajectories] = useState<
    Array<ShadowTrajectory | null>
  >([null, null, null]);
  const [shadowPreparing, setShadowPreparing] = useState(false);
  const [shadowError, setShadowError] = useState<string | null>(null);

  const lastStartedSequenceKeyRef = useRef<string | null>(null);
  const activeVisualRoundIdRef = useRef<string | null>(null);
  const capturedResultsOwnerRef = useRef<string | null>(null);
  const capturedDieNumbersRef = useRef<Set<number>>(new Set());
  const completionSentRef = useRef(false);

  const nextDieTimerRef = useRef<number | null>(null);

  const onProgressRef = useRef(onProgress);
  const onCompleteRef = useRef(onComplete);
  const onDiceDropRef = useRef(onDiceDrop);
  const lastDiceDropSoundKeyRef = useRef<string | null>(null);

  const shadowWorkersRef = useRef<Worker[]>([]);
  const shadowRequestOwnersRef = useRef<Map<string, ShadowRequestOwner>>(
    new Map()
  );
  const shadowTrajectoriesRef = useRef<Array<ShadowTrajectory | null>>([
    null,
    null,
    null,
  ]);

  function clearTimers() {
    if (nextDieTimerRef.current) {
      window.clearTimeout(nextDieTimerRef.current);
      nextDieTimerRef.current = null;
    }
  }

  function clearShadowWorkers() {
    shadowWorkersRef.current.forEach((worker) => worker.terminate());
    shadowWorkersRef.current = [];
    shadowRequestOwnersRef.current.clear();
  }

  function updateShadowTrajectory(
    dieIndex: number,
    trajectory: ShadowTrajectory
  ) {
    const nextTrajectories = [...shadowTrajectoriesRef.current];

    nextTrajectories[dieIndex] = trajectory;
    shadowTrajectoriesRef.current = nextTrajectories;

    setShadowTrajectories(nextTrajectories);

    const hasFirstTrajectory = Boolean(nextTrajectories[0]?.frames.length);
    const hasAllTrajectories = nextTrajectories.every((item) =>
      Boolean(item?.frames.length)
    );

    if (hasAllTrajectories) {
      setShadowPreparing(false);
    }

    if (
      hasFirstTrajectory &&
      activeVisualRoundIdRef.current &&
      capturedResultsOwnerRef.current === activeVisualRoundIdRef.current &&
      capturedDieNumbersRef.current.size === 0 &&
      !completionSentRef.current
    ) {
      setSequenceRunning(true);
      setResetKey((value) => value + 1);
    }
  }

  function handleShadowWorkerResponse(response: DiceShadowWorkerResponse) {
    const owner = shadowRequestOwnersRef.current.get(response.requestId);

    if (!owner) return;
    if (owner.sequenceKey !== lastStartedSequenceKeyRef.current) return;
    if (owner.roundId !== activeVisualRoundIdRef.current) return;

    shadowRequestOwnersRef.current.delete(response.requestId);

    if (response.kind === "search-success") {
      updateShadowTrajectory(owner.dieIndex, {
        dieIndex: owner.dieIndex,
        targetAnimal: owner.targetAnimal,
        finalAnimal: response.finalAnimal,
        frames: response.frames,
        motionGrade: response.motionGrade,
        motionScore: response.motionScore,
        source: "shadow-pass",
      });

      return;
    }

    if (response.bestMatchedFrames?.length && response.bestMatchedFinalAnimal) {
      console.warn(
        `[Nagani Dice] Shadow best-match fallback used for Die ${
          owner.dieIndex + 1
        }: ${response.reason}`
      );

      updateShadowTrajectory(owner.dieIndex, {
        dieIndex: owner.dieIndex,
        targetAnimal: owner.targetAnimal,
        finalAnimal: response.bestMatchedFinalAnimal,
        frames: response.bestMatchedFrames,
        motionGrade: response.bestMatchedMotionGrade,
        motionScore: response.bestMatchedMotionScore,
        source: "shadow-best-match",
      });

      return;
    }

    console.error(
      `[Nagani Dice] Shadow search failed for Die ${owner.dieIndex + 1}: ${
        response.reason
      }`
    );

    setShadowPreparing(false);
    setShadowError(response.reason);
  }

  function prepareShadowTrajectories({
    roundId,
    sequenceKey,
    targetAnimals,
  }: {
    roundId: string;
    sequenceKey: string;
    targetAnimals: DiceAnimalLabel[];
  }) {
    clearShadowWorkers();

    setShadowPreparing(true);
    setShadowError(null);
    setShadowTrajectories([null, null, null]);
    shadowTrajectoriesRef.current = [null, null, null];

    targetAnimals.forEach((targetAnimal, dieIndex) => {
      const requestId = `${roundId}:${sequenceKey}:shadow:${dieIndex}:${Date.now()}`;

      const request: DiceShadowWorkerRequest = {
        kind: "search-one-die",
        requestId,
        targetAnimal,
        dieIndex,
        attemptLimit: SHADOW_ATTEMPT_LIMIT,
        maxSimulationSeconds: SHADOW_MAX_SIMULATION_SECONDS,
        frameRate: SHADOW_FRAME_RATE,
      };

      const worker = createDiceShadowWorker();

      shadowRequestOwnersRef.current.set(requestId, {
        sequenceKey,
        roundId,
        dieIndex,
        targetAnimal,
      });

      worker.onmessage = (event: MessageEvent<DiceShadowWorkerResponse>) => {
        handleShadowWorkerResponse(event.data);
      };

      worker.onerror = (event) => {
        console.error(
          `[Nagani Dice] Shadow worker crashed for Die ${dieIndex + 1}`,
          event
        );

        setShadowPreparing(false);
        setShadowError(`Shadow worker crashed for Die ${dieIndex + 1}.`);
      };

      shadowWorkersRef.current.push(worker);
      worker.postMessage(request);
    });
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
    lastDiceDropSoundKeyRef.current = null;

    setCapturedResults([]);
    setActiveDieIndex(0);
    setSettled(false);
    setFaceCaptureOwner(null);
    setHoldFinalDiceOnTable(false);
    setSequenceRunning(false);
    setResetKey((value) => value + 1);

    prepareShadowTrajectories({
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
      clearShadowWorkers();
    };
  }, []);

  useEffect(() => {
    if (!visualRoundId) {
      clearTimers();
      clearShadowWorkers();
      setSequenceRunning(false);
      setHoldFinalDiceOnTable(false);
      setFaceCaptureOwner(null);
      setShadowPreparing(false);
      setShadowError(null);
      return;
    }

    if (!enabled) {
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
      setShadowPreparing(false);
      setShadowError("Missing backend dice result animals.");
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

  const activeTargetAnimal = mapBackendAnimalToDiceLabel(
    serverRngResults[activeDieIndex]
  );

  const activeShadowTrajectory = shadowTrajectories[activeDieIndex] ?? null;
  const activeShadowFrames = activeShadowTrajectory?.frames ?? null;
  const hasActiveShadowFrames = Boolean(activeShadowFrames?.length);

  useEffect(() => {
    if (!enabled || !sequenceRunning) return;
    if (!hasActiveShadowFrames) return;

    const ownerRoundId = activeVisualRoundIdRef.current;

    if (!ownerRoundId) return;

    const dieNumber = activeDieIndex + 1;
    const soundKey = `${ownerRoundId}:${dieNumber}:${resetKey}:shadow`;

    if (lastDiceDropSoundKeyRef.current === soundKey) return;
    if (capturedDieNumbersRef.current.has(dieNumber)) return;

    lastDiceDropSoundKeyRef.current = soundKey;
    onDiceDropRef.current?.(dieNumber, ownerRoundId);
  }, [
    enabled,
    sequenceRunning,
    activeDieIndex,
    resetKey,
    hasActiveShadowFrames,
  ]);

  useEffect(() => {
    if (!enabled || !sequenceRunning) return;
    if (!faceCaptureOwner) return;
    if (faceCaptureOwner.dieIndex !== activeDieIndex) return;

    const dieNumber = activeDieIndex + 1;

    if (capturedDieNumbersRef.current.has(dieNumber)) return;

    clearTimers();

    const capturedResult = createVisibleCapturedResult(
      faceCaptureOwner.result,
      dieNumber
    );

    if (!capturedResult) {
      console.warn(
        `[Nagani Dice] Recorded trajectory produced unreadable face for Die ${dieNumber}.`
      );
      return;
    }

    if (activeTargetAnimal && capturedResult.label !== activeTargetAnimal) {
      console.warn(
        `[Nagani Dice] Recorded trajectory visible mismatch on Die ${dieNumber}. Expected ${activeTargetAnimal}, got ${capturedResult.label}.`
      );
    }

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
        setActiveDieIndex(activeDieIndex + 1);
        setResetKey((value) => value + 1);
        nextDieTimerRef.current = null;
      }, LIVE_DICE_CONFIRM_HOLD_MS);

      return;
    }

    nextDieTimerRef.current = window.setTimeout(() => {
      setHoldFinalDiceOnTable(true);
      setSequenceRunning(false);
      nextDieTimerRef.current = null;
    }, LIVE_DICE_FINAL_CONFIRM_HOLD_MS);
  }, [
    enabled,
    sequenceRunning,
    activeDieIndex,
    faceCaptureOwner,
    activeTargetAnimal,
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

    onCompleteRef.current(
      createThreeDiceRoundPayload(capturedResults, false),
      ownerRoundId
    );
  }, [sequenceRunning, capturedResults]);

  const shouldShowActiveTableDice =
    (sequenceRunning && hasActiveShadowFrames) || holdFinalDiceOnTable;

  const stageActiveDieIndex = shouldShowActiveTableDice ? activeDieIndex : -1;

  const stageMountedDiceRackMode: MountedDiceRackMode = shouldShowActiveTableDice
    ? "sequence"
    : mountedDiceRackMode;

  const stageRecordedFrames = shouldShowActiveTableDice
    ? activeShadowFrames
    : null;

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
        targetAnimal={activeTargetAnimal}
        targetPerformanceEnabled={false}
        strictReadableResultGate={false}
        targetLaunchRecipeEnabled={false}
        recordedTrajectoryFrames={stageRecordedFrames}
        recordedTrajectoryReplayKey={resetKey}
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

              const trajectory = shadowTrajectories[dieNumber - 1];

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
                      (shadowPreparing ? "..." : "—")}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}