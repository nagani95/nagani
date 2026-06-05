//src/components/games/six-animal/ThreeDiceSequenceController.tsx

"use client";

import { useEffect, useRef, useState } from "react";

import ThreeDicePhysicsStage, {
  createThreeDiceRoundPayload,
  type CapturedDiceResult,
  type DiceFaceResult,
  type MountedDiceRackMode,
  type ThreeDiceRoundPayload,
  type DiceAnimalLabel,
} from "./ThreeDicePhysicsStage";

const EXPECTED_DICE_RESULT_COUNT = 3;

const LIVE_DICE_VISUAL_MS = 6400;
const LIVE_DICE_BETWEEN_MS = 450;
const LIVE_DICE_CONFIRM_HOLD_MS = 1500;
const LIVE_DICE_FINAL_CONFIRM_HOLD_MS = 3000;

function getLiveDiceRevealAtMs(index: number) {
  return LIVE_DICE_VISUAL_MS * (index + 1) + LIVE_DICE_BETWEEN_MS * index;
}

function getElapsedMsSinceIso(isoValue?: string | null) {
  if (!isoValue) return 0;

  const startedAtMs = new Date(isoValue).getTime();

  if (!Number.isFinite(startedAtMs)) return 0;

  return Math.max(0, Date.now() - startedAtMs);
}

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
  visualRoundId?: string | null;
  className?: string;
  showInternalResultStrip?: boolean;
  mountedDiceRackMode?: MountedDiceRackMode;
  serverRngResults?: string[];
  rollingStartedAt?: string | null;
};

export default function ThreeDiceSequenceController({
  enabled,
  runKey,
  onComplete,
  onProgress,
  className = "",
  showInternalResultStrip = true,
  mountedDiceRackMode = enabled ? "sequence" : "ready",
  serverRngResults = [],
rollingStartedAt = null,
visualRoundId = null,
}: ThreeDiceSequenceControllerProps) {
  const [resetKey, setResetKey] = useState(1);
const [, setSettled] = useState(false);
const [, setFaceResult] = useState<DiceFaceResult | null>(null);
  const [activeDieIndex, setActiveDieIndex] = useState(0);
  const [sequenceRunning, setSequenceRunning] = useState(false);
  const [capturedResults, setCapturedResults] = useState<CapturedDiceResult[]>(
    []
  );

  const capturedDieNumbersRef = useRef<Set<number>>(new Set());
  const completionSentRef = useRef(false);
const lastSequenceKeyRef = useRef<string | null>(null);
const liveCaptureTimerRef = useRef<number | null>(null);
const liveForceCaptureTimerRef = useRef<number | null>(null);
const liveNextDieTimerRef = useRef<number | null>(null);
const liveDieStartedAtRef = useRef<number>(Date.now());

const onProgressRef = useRef(onProgress);
const activeVisualRoundIdRef = useRef<string | null>(null);
const capturedResultsOwnerRef = useRef<string | null>(null);
  const backendResultKey = serverRngResults.join("|");
  const backendTimelineKey = `${backendResultKey}|${rollingStartedAt ?? ""}`;
const hasBackendLiveResults =
  serverRngResults.length === EXPECTED_DICE_RESULT_COUNT;

const isLiveReconnectDisplay =
  !enabled && Boolean(rollingStartedAt) && hasBackendLiveResults;

const shouldUseBackendTimeline = isLiveReconnectDisplay;

const stageMountedDiceRackMode: MountedDiceRackMode = isLiveReconnectDisplay
  ? "sequence"
  : mountedDiceRackMode;

const lastBackendResultKeyRef = useRef<string | null>(null);

  function getServerTargetAnimal(index: number) {
  const animalKey = serverRngResults[index];

  if (!animalKey) return null;

  return (animalKey.charAt(0).toUpperCase() +
    animalKey.slice(1)) as DiceAnimalLabel;
}

function createBackendCapturedResult(
  label: DiceAnimalLabel,
  dieNumber: number
): CapturedDiceResult {
  return {
    status: "accepted",
    label,
    nearestLabel: label,
    axis: "backend-live",
    confidence: 100,
    tiltDegrees: 0,
    message: "Backend live result captured.",
    dieNumber,
  };
}

function clearLiveDiceTimers() {
  if (liveCaptureTimerRef.current) {
    window.clearTimeout(liveCaptureTimerRef.current);
    liveCaptureTimerRef.current = null;
  }

  if (liveForceCaptureTimerRef.current) {
    window.clearTimeout(liveForceCaptureTimerRef.current);
    liveForceCaptureTimerRef.current = null;
  }

  if (liveNextDieTimerRef.current) {
    window.clearTimeout(liveNextDieTimerRef.current);
    liveNextDieTimerRef.current = null;
  }
}

useEffect(() => {
  onProgressRef.current = onProgress;
}, [onProgress]);

useEffect(() => {
  return () => {
    clearLiveDiceTimers();
  };
}, []);

useEffect(() => {
if (!enabled && !isLiveReconnectDisplay) {
  setSequenceRunning(false);
  lastBackendResultKeyRef.current = null;

  clearLiveDiceTimers();

  return;
}

const sequenceKey = `${runKey}|${visualRoundId ?? "no-round"}|${backendTimelineKey}|${
  enabled ? "live" : "reconnect"
}`;

  if (lastSequenceKeyRef.current === sequenceKey && !isLiveReconnectDisplay) {
    return;
  }

lastSequenceKeyRef.current = sequenceKey;
activeVisualRoundIdRef.current = visualRoundId;
capturedResultsOwnerRef.current = null;
completionSentRef.current = false;
capturedDieNumbersRef.current.clear();
lastBackendResultKeyRef.current = null;

clearLiveDiceTimers();
liveDieStartedAtRef.current = Date.now();

setCapturedResults([]);
  setActiveDieIndex(0);
  setSettled(false);
  setFaceResult(null);
  setSequenceRunning(enabled && hasBackendLiveResults);

  if (enabled && hasBackendLiveResults) {
    setResetKey((value) => value + 1);
  }
}, [
  enabled,
  runKey,
  visualRoundId,
  isLiveReconnectDisplay,
  backendTimelineKey,
  hasBackendLiveResults,
]);

useEffect(() => {
  if (!shouldUseBackendTimeline || !hasBackendLiveResults) {
    return;
  }

  if (lastBackendResultKeyRef.current === backendTimelineKey) {
    return;
  }

  lastBackendResultKeyRef.current = backendTimelineKey;

  let cancelled = false;
  const timers: number[] = [];
  const elapsedMs = isLiveReconnectDisplay
  ? getElapsedMsSinceIso(rollingStartedAt)
  : 0;

  completionSentRef.current = false;
  capturedDieNumbersRef.current.clear();

  const alreadyRevealedResults = serverRngResults
    .map((_, index) => {
      const revealAt = getLiveDiceRevealAtMs(index);

      if (elapsedMs < revealAt) return null;

      const label = getServerTargetAnimal(index);
      if (!label) return null;

      const dieNumber = index + 1;
      capturedDieNumbersRef.current.add(dieNumber);

      return createBackendCapturedResult(label, dieNumber);
    })
    .filter((result): result is CapturedDiceResult => Boolean(result));

  const revealedCount = alreadyRevealedResults.length;
  const hasPendingReveals = revealedCount < EXPECTED_DICE_RESULT_COUNT;
  const nextActiveDieIndex = Math.min(
    revealedCount,
    EXPECTED_DICE_RESULT_COUNT - 1
  );

setCapturedResults(alreadyRevealedResults);
setActiveDieIndex(nextActiveDieIndex);
setSettled(false);
setFaceResult(null);
setSequenceRunning(hasPendingReveals);
liveDieStartedAtRef.current = Date.now();
setResetKey((value) => value + 1);

  serverRngResults.forEach((_, index) => {
    const revealAt = getLiveDiceRevealAtMs(index);
    const revealDelay = revealAt - elapsedMs;

    if (revealDelay <= 0) return;

    const timer = window.setTimeout(() => {
      if (cancelled) return;

      const label = getServerTargetAnimal(index);
      if (!label) return;

      const dieNumber = index + 1;

      if (capturedDieNumbersRef.current.has(dieNumber)) return;

      capturedDieNumbersRef.current.add(dieNumber);

      setCapturedResults((current) => {
        const withoutDuplicate = current.filter(
          (result) => result.dieNumber !== dieNumber
        );

        return [
          ...withoutDuplicate,
          createBackendCapturedResult(label, dieNumber),
        ].sort((a, b) => a.dieNumber - b.dieNumber);
      });

      if (index < EXPECTED_DICE_RESULT_COUNT - 1) {
        setActiveDieIndex(index + 1);
        setResetKey((value) => value + 1);
      } else {
        setSequenceRunning(false);
      }
    }, revealDelay);

    timers.push(timer);
  });

  return () => {
    cancelled = true;
    timers.forEach((timer) => window.clearTimeout(timer));
  };
}, [
  shouldUseBackendTimeline,
  runKey,
  backendTimelineKey,
  hasBackendLiveResults,
  rollingStartedAt,
]);

useEffect(() => {
  if (!enabled || !sequenceRunning) return;
  if (!hasBackendLiveResults) return;

  const dieNumber = activeDieIndex + 1;

  if (capturedDieNumbersRef.current.has(dieNumber)) return;

  const label = getServerTargetAnimal(activeDieIndex);
  if (!label) return;

  const captureCurrentDie = () => {
    if (capturedDieNumbersRef.current.has(dieNumber)) return;

    capturedDieNumbersRef.current.add(dieNumber);
    capturedResultsOwnerRef.current = activeVisualRoundIdRef.current;

    setCapturedResults((current) => {
      const withoutDuplicate = current.filter(
        (result) => result.dieNumber !== dieNumber
      );

      return [
        ...withoutDuplicate,
        createBackendCapturedResult(label, dieNumber),
      ].sort((a, b) => a.dieNumber - b.dieNumber);
    });

    setSettled(false);
    setFaceResult(null);

clearLiveDiceTimers();

if (activeDieIndex < EXPECTED_DICE_RESULT_COUNT - 1) {
  liveNextDieTimerRef.current = window.setTimeout(() => {
    setActiveDieIndex(activeDieIndex + 1);
    liveDieStartedAtRef.current = Date.now();
    setResetKey((value) => value + 1);
    liveNextDieTimerRef.current = null;
  }, LIVE_DICE_CONFIRM_HOLD_MS);
} else {
  liveNextDieTimerRef.current = window.setTimeout(() => {
    setSequenceRunning(false);
    liveNextDieTimerRef.current = null;
  }, LIVE_DICE_FINAL_CONFIRM_HOLD_MS);
}
  };

  clearLiveDiceTimers();

  liveCaptureTimerRef.current = window.setTimeout(() => {
    captureCurrentDie();
  }, LIVE_DICE_VISUAL_MS);

  return () => {
    if (liveCaptureTimerRef.current) {
      window.clearTimeout(liveCaptureTimerRef.current);
      liveCaptureTimerRef.current = null;
    }
  };
}, [
  enabled,
  sequenceRunning,
  activeDieIndex,
  hasBackendLiveResults,
  backendResultKey,
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
  if (sequenceRunning || capturedResults.length !== EXPECTED_DICE_RESULT_COUNT) {
    return;
  }

  const ownerRoundId = capturedResultsOwnerRef.current;

  if (!ownerRoundId || ownerRoundId !== activeVisualRoundIdRef.current) {
    return;
  }

  if (completionSentRef.current) return;

  completionSentRef.current = true;

  onComplete(
    createThreeDiceRoundPayload(capturedResults, false),
    ownerRoundId
  );
}, [sequenceRunning, capturedResults, onComplete]);

const shouldRenderLiveDiceStage =
  enabled || (isLiveReconnectDisplay && sequenceRunning);

const targetAnimal = getServerTargetAnimal(activeDieIndex);

  return (
    <div
      className={`relative h-full min-h-[360px] overflow-hidden rounded-[1.6rem] border border-amber-300/15 bg-black/35 ${className}`}
    >
<ThreeDicePhysicsStage
  resetKey={resetKey}
  onSettledChange={setSettled}
  onFaceResultChange={setFaceResult}
  debugPhysics={false}
  testMode="trap"
  activeDieIndex={activeDieIndex}
  sequenceRunning={sequenceRunning}
  displayOnly={!shouldRenderLiveDiceStage}
  variant="room"
  mountedDiceRackMode={stageMountedDiceRackMode}
  targetAnimal={targetAnimal}
  targetCorrectionTestEnabled={false}
  hideActiveDiceFaces={serverRngResults.length === EXPECTED_DICE_RESULT_COUNT}
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

              return (
                <div
                  key={`sequence-die-${dieNumber}`}
                  className="rounded-xl border border-white/10 bg-white/[0.04] px-2 py-2"
                >
                  <p className="text-[9px] font-black uppercase tracking-[0.14em] text-white/35">
                    Die {dieNumber}
                  </p>

                  <p className="mt-1 text-xs font-black text-amber-100">
                    {captured?.label ?? "—"}
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