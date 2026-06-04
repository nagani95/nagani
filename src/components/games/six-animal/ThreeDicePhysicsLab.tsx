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

const TARGET_ANIMAL_OPTIONS: DiceAnimalLabel[] = [
  "Tiger",
  "Dragon",
  "Rooster",
  "Fish",
  "Crab",
  "Elephant",
];

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
  useState<DiceShapePreset>("current");
  const [diceColliderPreset, setDiceColliderPreset] =
  useState<DiceColliderPreset>("current");
const [activeDieIndex, setActiveDieIndex] = useState(1);
const [targetAnimal, setTargetAnimal] = useState<DiceAnimalLabel>("Tiger");
const [targetCorrectionTestEnabled, setTargetCorrectionTestEnabled] =
  useState(false);
const [sequenceRunning, setSequenceRunning] = useState(false);
const [capturedResults, setCapturedResults] = useState<CapturedDiceResult[]>([]);
const capturedDieNumbersRef = useRef<Set<number>>(new Set());
const sequenceComplete = capturedResults.length === 3 && !sequenceRunning;
const finalResultSummary =
  capturedResults.length > 0
    ? capturedResults.map((result) => result.label).join(" · ")
    : "Waiting";

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

const targetTopFaceDebugInfo = getTargetTopFaceDebugInfo(targetAnimal);
const targetCorrectionSafetyConfig = getTargetCorrectionSafetyConfig();

const targetCorrectionReadiness = getTargetCorrectionReadiness({
  movementSpeed: settled ? 0 : Number.POSITIVE_INFINITY,
  tiltDegrees: faceResult?.tiltDegrees ?? 999,
  hasTarget: Boolean(targetAnimal),
});

const targetResultValidation = getTargetResultValidation({
  targetAnimal,
  faceResult,
});

const targetResultCaptureSummary = getTargetResultCaptureSummary({
  targetAnimal,
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
      : faceResult.label === targetAnimal
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
      ? targetCorrectionTestEnabled
        ? "Dev correction test is ON, but target influence is still experimental and may miss while tuning."
        : "The physical dice result does not match the selected target. This is expected because dev correction test is OFF."
      : targetMatchStatus === "invalid"
        ? "The dice stopped at an unreadable angle. No target comparison accepted."
        : "Drop a die to compare the selected target with the physical dice result.";

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
      ? "Invalid Throw"
      : "Royal Result Board";

const royalBoardMain = sequenceComplete
  ? finalResultSummary
  : faceResult?.status === "accepted"
    ? faceResult.label
    : faceResult?.status === "cocked"
      ? "Reroll Required"
      : "Waiting";

const royalBoardSub = sequenceComplete
  ? "All three dice results captured successfully."
  : faceResult?.status === "accepted"
    ? `${faceResult.confidence}% confidence · ${faceResult.tiltDegrees}° tilt`
    : faceResult?.status === "cocked"
      ? `Nearest ${faceResult.nearestLabel} · ${faceResult.confidence}% confidence`
      : "The dice result will be captured here after it settles.";

useEffect(() => {
  if (!sequenceRunning || !settled || !faceResult) return;

  const dieNumber = activeDieIndex + 1;

  if (capturedDieNumbersRef.current.has(dieNumber)) return;

if (faceResult.status === "cocked") {
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
}, [sequenceRunning, settled, faceResult, activeDieIndex]);

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-5">
        <header className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.35em] text-amber-300/70">
            Chapter 51.6
            </p>
            <h1 className="mt-2 text-2xl font-black text-amber-100">
              3D Physics Dice Lab
            </h1>
            <p className="mt-1 text-sm font-bold text-white/55">
              Isolated test route. Not connected to the live Six Animal room yet.
            </p>
          </div>

<div className="flex flex-wrap items-center justify-end gap-3">
  <label className="flex items-center gap-2 rounded-2xl border border-sky-300/20 bg-sky-300/10 px-4 py-3 text-sm font-black text-sky-100 shadow-xl shadow-black/30">
    <span className="text-[10px] uppercase tracking-[0.2em] text-sky-100/55">
      Target
    </span>

    <select
      value={targetAnimal}
      disabled={sequenceRunning}
      onChange={(event) =>
        setTargetAnimal(event.target.value as DiceAnimalLabel)
      }
      className="bg-transparent text-sm font-black text-sky-50 outline-none disabled:text-sky-100/35"
    >
      {TARGET_ANIMAL_OPTIONS.map((animal) => (
        <option key={animal} value={animal} className="bg-black text-white">
          {animal}
        </option>
      ))}
    </select>
    </label>

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
onClick={() => {
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
  setSequenceRunning(false);
  capturedDieNumbersRef.current.clear();
  setCapturedResults([]);
  setActiveDieIndex(1);
  setSettled(false);
  setFaceResult(null);
  setResetKey((value) => value + 1);
}}
    className="rounded-2xl border border-amber-300/30 bg-amber-300 px-4 py-3 text-sm font-black text-black shadow-xl shadow-amber-950/40"
  >
    Drop Again
  </button>
</div>
        </header>

<section className="relative mt-5 overflow-hidden rounded-[2rem] border border-amber-300/25 bg-[radial-gradient(circle_at_50%_28%,rgba(117,46,26,0.55),rgba(44,12,8,0.96)_45%,rgba(10,4,3,1)_100%)] shadow-2xl shadow-red-950/30">
  <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_46%,rgba(255,214,128,0.14),transparent_42%)]" />
    {effectiveShowResultBoard ? (
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
  targetAnimal={targetAnimal}
  targetCorrectionTestEnabled={targetCorrectionTestEnabled}
  showDice={effectiveShowDice}
forceShowStumbleBar={cleanTableShotMode}
/>
  </div>
</section>

        {cleanTableShotMode ? null : (
<section className="mt-4 grid gap-3 md:grid-cols-4 xl:grid-cols-8">
          <div className="rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-amber-200/60">
              Physics Status
            </p>
            <p className="mt-2 text-xl font-black text-white">
              {settled ? "Settled" : "Moving"}
            </p>
          </div>

          <div className="rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4">
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

<div className="rounded-2xl border border-orange-300/20 bg-orange-300/10 p-4">
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

<div className="rounded-2xl border border-sky-300/20 bg-sky-300/10 p-4">
  <p className="text-[10px] font-black uppercase tracking-[0.25em] text-sky-200/60">
    Target Face
  </p>

  <div className="mt-2 flex items-start justify-between gap-3">
    <div>
      <p className="text-xl font-black text-white">{targetAnimal}</p>
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

<div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-4">
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

<div className="rounded-2xl border border-lime-300/20 bg-lime-300/10 p-4">
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

<div className="rounded-2xl border border-purple-300/20 bg-purple-300/10 p-4">
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

<div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4">
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

<div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
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

<div className={`rounded-2xl border p-4 ${resultPanelTone}`}>
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