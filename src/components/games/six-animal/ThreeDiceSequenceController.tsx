"use client";

import { useEffect, useRef, useState } from "react";

import ThreeDicePhysicsStage, {
  createThreeDiceRoundPayload,
  type CapturedDiceResult,
  type DiceFaceResult,
  type DiceAnimalLabel,
  type MountedDiceRackMode,
  type ThreeDiceRoundPayload,
} from "./ThreeDicePhysicsStage";

const EXPECTED_DICE_RESULT_COUNT = 3;

const LIVE_DICE_CONFIRM_HOLD_MS = 1000;
const LIVE_DICE_FINAL_CONFIRM_HOLD_MS = 1200;
const LIVE_DICE_DIRECTOR_CAPTURE_MS = 5600;

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

  // Kept for page compatibility. Not used in current natural visible-dice mode.
  serverRngResults?: string[];
  rollingStartedAt?: string | null;
};

function createVisibleCapturedResult(
  result: DiceFaceResult,
  dieNumber: number
): CapturedDiceResult {
  const visibleLabel = (
    result.status === "accepted" ? result.label : result.nearestLabel
  ) as DiceAnimalLabel;

  return {
    ...result,
    status: "accepted",
    label: visibleLabel,
    nearestLabel: visibleLabel,
    message:
      result.status === "accepted"
        ? result.message || "Visible dice face captured."
        : "Nearest visible dice face captured for natural dice test.",
    dieNumber,
  };
}

export default function ThreeDiceSequenceController({
  enabled,
  runKey,
  onComplete,
  onProgress,
  visualRoundId = null,
  className = "",
  showInternalResultStrip = true,
  mountedDiceRackMode = enabled ? "sequence" : "ready",
}: ThreeDiceSequenceControllerProps) {
  const [resetKey, setResetKey] = useState(1);
  const [, setSettled] = useState(false);
  const [captureRequestKey, setCaptureRequestKey] = useState(0);
  const [activeDieIndex, setActiveDieIndex] = useState(0);
  const [sequenceRunning, setSequenceRunning] = useState(false);
  const [capturedResults, setCapturedResults] = useState<CapturedDiceResult[]>(
    []
  );
  const [faceCaptureOwner, setFaceCaptureOwner] = useState<{
    dieIndex: number;
    result: DiceFaceResult;
  } | null>(null);

  const lastStartedSequenceKeyRef = useRef<string | null>(null);
  const activeVisualRoundIdRef = useRef<string | null>(null);
  const capturedResultsOwnerRef = useRef<string | null>(null);
  const capturedDieNumbersRef = useRef<Set<number>>(new Set());
  const completionSentRef = useRef(false);

  const forceCaptureTimerRef = useRef<number | null>(null);
  const nextDieTimerRef = useRef<number | null>(null);

  const onProgressRef = useRef(onProgress);
  const onCompleteRef = useRef(onComplete);

  function clearTimers() {
    if (forceCaptureTimerRef.current) {
      window.clearTimeout(forceCaptureTimerRef.current);
      forceCaptureTimerRef.current = null;
    }

    if (nextDieTimerRef.current) {
      window.clearTimeout(nextDieTimerRef.current);
      nextDieTimerRef.current = null;
    }
  }

  function resetSequenceForNewRun(roundId: string) {
    clearTimers();

    activeVisualRoundIdRef.current = roundId;
    capturedResultsOwnerRef.current = roundId;
    capturedDieNumbersRef.current.clear();
    completionSentRef.current = false;

    setCapturedResults([]);
    setActiveDieIndex(0);
    setSettled(false);
    setFaceCaptureOwner(null);
    setCaptureRequestKey(0);
    setSequenceRunning(true);
    setResetKey((value) => value + 1);
  }

  function handleFaceResultChange(result: DiceFaceResult | null) {
    setFaceCaptureOwner(
      result
        ? {
            dieIndex: activeDieIndex,
            result,
          }
        : null
    );
  }

  useEffect(() => {
    onProgressRef.current = onProgress;
  }, [onProgress]);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, []);

  useEffect(() => {
    if (!enabled || !visualRoundId) {
      clearTimers();
      setSequenceRunning(false);
      setFaceCaptureOwner(null);
      return;
    }

    const sequenceKey = `${runKey}|${visualRoundId}`;

    if (lastStartedSequenceKeyRef.current === sequenceKey) {
      return;
    }

    lastStartedSequenceKeyRef.current = sequenceKey;
    resetSequenceForNewRun(visualRoundId);
  }, [enabled, runKey, visualRoundId]);

  useEffect(() => {
    if (!enabled || !sequenceRunning) return;

    const dieNumber = activeDieIndex + 1;

    if (capturedDieNumbersRef.current.has(dieNumber)) return;

    if (forceCaptureTimerRef.current) {
      window.clearTimeout(forceCaptureTimerRef.current);
      forceCaptureTimerRef.current = null;
    }

    forceCaptureTimerRef.current = window.setTimeout(() => {
      if (capturedDieNumbersRef.current.has(dieNumber)) return;

      setCaptureRequestKey((value) => value + 1);
      forceCaptureTimerRef.current = null;
    }, LIVE_DICE_DIRECTOR_CAPTURE_MS);

    return () => {
      if (forceCaptureTimerRef.current) {
        window.clearTimeout(forceCaptureTimerRef.current);
        forceCaptureTimerRef.current = null;
      }
    };
  }, [enabled, sequenceRunning, activeDieIndex, resetKey]);

  useEffect(() => {
    if (!enabled || !sequenceRunning) return;
    if (!faceCaptureOwner) return;
    if (faceCaptureOwner.dieIndex !== activeDieIndex) return;

    const dieNumber = activeDieIndex + 1;

    if (capturedDieNumbersRef.current.has(dieNumber)) return;

    clearTimers();

    capturedDieNumbersRef.current.add(dieNumber);
    capturedResultsOwnerRef.current = activeVisualRoundIdRef.current;

    setCapturedResults((current) => {
      const withoutDuplicate = current.filter(
        (result) => result.dieNumber !== dieNumber
      );

      return [
        ...withoutDuplicate,
        createVisibleCapturedResult(faceCaptureOwner.result, dieNumber),
      ].sort((a, b) => a.dieNumber - b.dieNumber);
    });

    setSettled(false);
    setFaceCaptureOwner(null);

    if (activeDieIndex < EXPECTED_DICE_RESULT_COUNT - 1) {
      nextDieTimerRef.current = window.setTimeout(() => {
        setActiveDieIndex(activeDieIndex + 1);
        setCaptureRequestKey(0);
        setResetKey((value) => value + 1);
        nextDieTimerRef.current = null;
      }, LIVE_DICE_CONFIRM_HOLD_MS);

      return;
    }

    nextDieTimerRef.current = window.setTimeout(() => {
      setSequenceRunning(false);
      nextDieTimerRef.current = null;
    }, LIVE_DICE_FINAL_CONFIRM_HOLD_MS);
  }, [enabled, sequenceRunning, activeDieIndex, faceCaptureOwner]);

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

  const stageMountedDiceRackMode: MountedDiceRackMode = sequenceRunning
    ? mountedDiceRackMode
    : mountedDiceRackMode;

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
        activeDieIndex={activeDieIndex}
        sequenceRunning={sequenceRunning}
        displayOnly={!sequenceRunning}
        variant="room"
        mountedDiceRackMode={stageMountedDiceRackMode}
        hideActiveDiceFaces={false}
        captureRequestKey={captureRequestKey}
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