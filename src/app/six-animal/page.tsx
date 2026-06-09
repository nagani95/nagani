//src>app>six-animal>page.tsx

"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import { naganiAssets } from "@/lib/naganiAssets";
import SixAnimalBettingSheet from "@/components/games/six-animal/SixAnimalBettingSheet";
import ThreeDiceSequenceController from "@/components/games/six-animal/ThreeDiceSequenceController";
import type {
  MountedDiceRackMode,
  ThreeDiceRoundPayload,
} from "@/components/games/six-animal/ThreeDicePhysicsStage";
import { SIX_ANIMAL_OPTIONS, SIX_ANIMAL_RULES } from "@/lib/gameRules";
import { convertThreeDicePayloadToMyanmarResult } from "@/lib/threeDiceResultAdapter";
import { createClient } from "@/lib/supabase/client";
import type { SixAnimalKey } from "@/types/games";

const ROOM_BACKGROUND = naganiAssets.sixAnimal.room.palaceBgV1;

const RESULT_REVEAL_DELAY_MS = 900;
const SETTLEMENT_POPUP_DELAY_MS = 1400;

const ROOM_SOUND_ENABLED = false;

const SIX_ANIMAL_ROOM_UUID = "11111111-1111-1111-1111-111111111111";

type LiveSixAnimalRound = {
  id: string;
  room_id: string;
  round_number: number;
  phase: "betting" | "closed" | "rolling" | "result" | "settled";
  betting_starts_at: string | null;
  betting_ends_at: string | null;
  rolling_starts_at: string | null;
  result_revealed_at: string | null;
  next_round_starts_at: string | null;
  result_animals: string[] | null;
  status: string;
};

type LiveSixAnimalBet = {
  id: string;
  round_id: string;
  profile_id: string;
  animal: SixAnimalKey;
  amount: number;
  locked: boolean;
  settled: boolean;
  created_at: string;
};

function secondsUntil(targetIso: string | null | undefined) {
  if (!targetIso) return 0;

  const targetTime = new Date(targetIso).getTime();
  const nowTime = Date.now();

  return Math.max(0, Math.ceil((targetTime - nowTime) / 1000));
}

function getRoundPhaseTargetAt(round: LiveSixAnimalRound) {
  if (round.phase === "betting") return round.betting_ends_at;
  if (round.phase === "closed") return round.rolling_starts_at;
  if (round.phase === "result") return round.next_round_starts_at;

  return null;
}

function getLiveRoundCountdown(round: LiveSixAnimalRound) {
  return secondsUntil(getRoundPhaseTargetAt(round));
}

function mapLiveRoundPhase(round: LiveSixAnimalRound): RoundPhase {
  if (round.phase === "betting") return "betting";
  if (round.phase === "closed") return "closed";
  if (round.phase === "rolling") return "rolling";
  if (round.phase === "result" || round.phase === "settled") return "result";

  return "loading";
}

const ANIMAL_ASSETS: Record<SixAnimalKey, string> = {
  tiger: naganiAssets.sixAnimal.animals.tiger,
  dragon: naganiAssets.sixAnimal.animals.dragon,
  rooster: naganiAssets.sixAnimal.animals.rooster,
  fish: naganiAssets.sixAnimal.animals.fish,
  crab: naganiAssets.sixAnimal.animals.crab,
  elephant: naganiAssets.sixAnimal.animals.elephant,
};

type RoundPhase = "loading" | "betting" | "closed" | "rolling" | "result";
type VisualDiceStatus = "idle" | "playing" | "complete";

type ActiveBet = {
  animalKey: SixAnimalKey;
  animalNameMm: string;
  amount: number;
  roundNumber: number;
};

type SixAnimalSoundEvent =
  | "bet-locked"
  | "bets-closed"
  | "dice-reveal"
  | "round-result"
  | "round-win"
  | "round-no-match"
  | "next-round";

function formatMMK(amount: number) {
  return new Intl.NumberFormat("en-US").format(amount);
}

function RoyalRoomAtmosphere() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-52 bg-[radial-gradient(circle_at_50%_0%,rgba(251,191,36,0.13),rgba(127,29,29,0.08)_34%,transparent_72%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.42),transparent_24%,transparent_76%,rgba(0,0,0,0.42))]" />
      <div className="absolute inset-x-8 bottom-0 h-60 bg-[radial-gradient(circle_at_50%_100%,rgba(127,29,29,0.18),transparent_68%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.12),transparent_32%,rgba(0,0,0,0.34))]" />
    </div>
  );
}

function RoyalTableChamberBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.18),transparent_22%,transparent_66%,rgba(0,0,0,0.52))]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_34%,transparent_0%,rgba(0,0,0,0.18)_48%,rgba(0,0,0,0.56)_100%)]" />
      <div className="absolute inset-x-5 top-5 h-px bg-gradient-to-r from-transparent via-amber-200/28 to-transparent" />
      <div className="absolute left-4 top-10 bottom-10 w-px bg-gradient-to-b from-transparent via-amber-200/18 to-transparent" />
      <div className="absolute right-4 top-10 bottom-10 w-px bg-gradient-to-b from-transparent via-amber-200/18 to-transparent" />
      <div className="absolute inset-x-8 bottom-3 h-32 bg-[radial-gradient(circle_at_50%_100%,rgba(127,29,29,0.2),transparent_72%)]" />
    </div>
  );
}

function getAnimalByNameMm(nameMm: string) {
  return SIX_ANIMAL_OPTIONS.find((animal) => animal.nameMm === nameMm);
}

function convertBackendBetToActiveBet(
  bet: LiveSixAnimalBet,
  roundNumber: number
): ActiveBet | null {
  const animal = SIX_ANIMAL_OPTIONS.find((option) => option.key === bet.animal);

  if (!animal) return null;

  return {
    animalKey: animal.key,
    animalNameMm: animal.nameMm,
    amount: Number(bet.amount),
    roundNumber,
  };
}

export default function SixAnimalPage() {
  const router = useRouter();
  // Centralize the Supabase client to prevent hook errors and memory leaks
  const [supabase] = useState(() => createClient());
  
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [roundId, setRoundId] = useState<string>("");
  const [serverRngResults, setServerRngResults] = useState<string[]>([]);
  const [selectedAnimal, setSelectedAnimal] = useState<SixAnimalKey | null>(null);
  const [betAmount, setBetAmount] = useState("1000");
  const [phase, setPhase] = useState<RoundPhase>("loading");
  const [countdown, setCountdown] = useState(3);
  const [phaseTargetAt, setPhaseTargetAt] = useState<string | null>(null);
  const [rollingStartedAt, setRollingStartedAt] = useState<string | null>(null);
  const [roundNumber, setRoundNumber] = useState(1208);
const [diceResult, setDiceResult] = useState<string[]>([]);
const [isVisualDiceComplete, setIsVisualDiceComplete] = useState(false);
const [visualDiceStatus, setVisualDiceStatus] =
  useState<VisualDiceStatus>("idle");
const [visualCompleteRoundId, setVisualCompleteRoundId] = useState<string | null>(null);
const [visualActiveRoundId, setVisualActiveRoundId] = useState<string | null>(null);
const [threeDiceRunKey, setThreeDiceRunKey] = useState(0);
  const [shouldPlayLiveDiceSequence, setShouldPlayLiveDiceSequence] =
    useState(false);
  const soundEnabled = ROOM_SOUND_ENABLED;
  const [showRoomIntro, setShowRoomIntro] = useState(true);
  const [activeBet, setActiveBet] = useState<ActiveBet | null>(null);
  const [showSettlementMoment, setShowSettlementMoment] = useState(false);
const [settlementWaitingRoundId, setSettlementWaitingRoundId] =
  useState<string | null>(null);
  
  // --- QUEUING STATES ---
  const [isWaitingForNextRound, setIsWaitingForNextRound] = useState(false);
  const [showInRoomNextRoundPause, setShowInRoomNextRoundPause] = useState(false);
const [isQuitting, setIsQuitting] = useState(false);
const [joinedRoundId, setJoinedRoundId] = useState<string | null>(null);

const resultRevealTimerRef = useRef<number | null>(null);
const settlementMomentTimerRef = useRef<number | null>(null);
const localRollingStartTimerRef = useRef<number | null>(null);
const lastDiceSoundCountRef = useRef(0);

  // Refs for Realtime Websocket closures to prevent stale state
const phaseRef = useRef(phase);
const roundIdRef = useRef(roundId);
const isQuittingRef = useRef(isQuitting);
const joinedRoundIdRef = useRef<string | null>(null);
const shouldPlayLiveDiceSequenceRef = useRef(false);
const diceResultRef = useRef<string[]>([]);
const isVisualDiceCompleteRef = useRef(false);
const visualDiceStatusRef = useRef<VisualDiceStatus>("idle");

const visualCompleteRoundIdRef = useRef<string | null>(null);
const visualStartedRoundIdRef = useRef<string | null>(null);
const visualActiveRoundIdRef = useRef<string | null>(null);
const settlementWaitingRoundIdRef = useRef<string | null>(null);
const showInRoomNextRoundPauseRef = useRef(false);
const showSettlementMomentRef = useRef(false);
const pendingBettingRoundRef = useRef<LiveSixAnimalRound | null>(null);

function clearVisibleDiceRoundState() {
  setDiceResult([]);
  diceResultRef.current = [];

  setIsVisualDiceComplete(false);
  isVisualDiceCompleteRef.current = false;

  setVisualDiceStatus("idle");
visualDiceStatusRef.current = "idle";

  setVisualCompleteRoundId(null);
  visualCompleteRoundIdRef.current = null;

visualStartedRoundIdRef.current = null;
setVisualActiveRoundId(null);
visualActiveRoundIdRef.current = null;

if (settlementMomentTimerRef.current) {
  window.clearTimeout(settlementMomentTimerRef.current);
  settlementMomentTimerRef.current = null;
}

if (localRollingStartTimerRef.current) {
  window.clearTimeout(localRollingStartTimerRef.current);
  localRollingStartTimerRef.current = null;
}

setShowSettlementMoment(false);
showSettlementMomentRef.current = false;

setSettlementWaitingRoundId(null);
settlementWaitingRoundIdRef.current = null;

setShowInRoomNextRoundPause(false);
showInRoomNextRoundPauseRef.current = false;

lastDiceSoundCountRef.current = 0;
}

function startLocalDiceFlow(round: LiveSixAnimalRound) {
  const backendResultKeys = round.result_animals || [];

  if (backendResultKeys.length !== SIX_ANIMAL_RULES.diceCount) return;
  if (visualStartedRoundIdRef.current === round.id) return;
  if (isVisualDiceCompleteRef.current && visualCompleteRoundIdRef.current === round.id) return;

  visualStartedRoundIdRef.current = round.id;
  visualActiveRoundIdRef.current = round.id;

  setVisualActiveRoundId(round.id);
  setIsVisualDiceComplete(false);
  isVisualDiceCompleteRef.current = false;

  setVisualDiceStatus("playing");
visualDiceStatusRef.current = "playing";

  setVisualCompleteRoundId(null);
  visualCompleteRoundIdRef.current = null;

  setDiceResult([]);
  diceResultRef.current = [];

setServerRngResults(backendResultKeys);
setRollingStartedAt(round.rolling_starts_at);
setPhase("rolling");
phaseRef.current = "rolling";
setPhaseTargetAt(null);
  setShouldPlayLiveDiceSequence(true);
  shouldPlayLiveDiceSequenceRef.current = true;

  lastDiceSoundCountRef.current = 0;
  setThreeDiceRunKey((value) => value + 1);
}

async function applyLiveRound(round: LiveSixAnimalRound) {
  const nextPhase = mapLiveRoundPhase(round);
  const nextTargetAt = getRoundPhaseTargetAt(round);
  const nextCountdown = getLiveRoundCountdown(round);

  const isSwitchingRound =
    Boolean(roundIdRef.current) && roundIdRef.current !== round.id;

// When backend opens the next betting round, switch immediately.
// The settlement card stays visible only until the new betting round is applied.
pendingBettingRoundRef.current = null;

  if (isSwitchingRound) {
    clearVisibleDiceRoundState();
    setShouldPlayLiveDiceSequence(false);
    shouldPlayLiveDiceSequenceRef.current = false;
    setActiveBet(null);
  }

  roundIdRef.current = round.id;

  const backendBet = await fetchCurrentUserBetForRound(round.id);
  const restoredActiveBet = backendBet
    ? convertBackendBetToActiveBet(backendBet, round.round_number)
    : null;

const hasJoinedCurrentBrowserRound = joinedRoundIdRef.current === round.id;
const isJoinableBettingRound = nextPhase === "betting" && nextCountdown > 0;
const isRefreshOrLateJoinToInProgressRound =
  !isJoinableBettingRound && !hasJoinedCurrentBrowserRound;

if (isRefreshOrLateJoinToInProgressRound) {
  clearVisibleDiceRoundState();
  setShouldPlayLiveDiceSequence(false);
  setRoundId(round.id);
  setRoundNumber(round.round_number);
  setPhase("loading");
  setPhaseTargetAt(null);
  setRollingStartedAt(null);
  setCountdown(0);
  setIsWaitingForNextRound(true);
  setServerRngResults([]);
  setActiveBet(null);
  return;
}

if (restoredActiveBet) {
  joinedRoundIdRef.current = round.id;
  setJoinedRoundId(round.id);
  setActiveBet(restoredActiveBet);
}

  if (
    isQuittingRef.current &&
    joinedRoundIdRef.current &&
    joinedRoundIdRef.current !== round.id &&
    isJoinableBettingRound
  ) {
    router.push("/");
    return;
  }

if (isJoinableBettingRound) {
  joinedRoundIdRef.current = round.id;
  setJoinedRoundId(round.id);
}

const hasBackendDiceTimeline =
  Boolean(round.rolling_starts_at) &&
  (round.result_animals || []).length === SIX_ANIMAL_RULES.diceCount;

const hasCompleteVisualDiceResult =
  visualCompleteRoundIdRef.current === round.id &&
  isVisualDiceCompleteRef.current &&
  diceResultRef.current.length === SIX_ANIMAL_RULES.diceCount;

const shouldHoldLocalVisualRollingPhase =
  (nextPhase === "rolling" || nextPhase === "result") &&
  hasBackendDiceTimeline &&
  !hasCompleteVisualDiceResult;

const shouldHoldCompletedVisualResultPhase =
  nextPhase === "rolling" &&
  hasBackendDiceTimeline &&
  hasCompleteVisualDiceResult;

const displayPhase: RoundPhase = shouldHoldCompletedVisualResultPhase
  ? "result"
  : shouldHoldLocalVisualRollingPhase
    ? "rolling"
    : nextPhase;

roundIdRef.current = round.id;
phaseRef.current = displayPhase;

setRoundId(round.id);
setRoundNumber(round.round_number);
setPhase(displayPhase);
setPhaseTargetAt(displayPhase === "rolling" ? null : nextTargetAt);
setRollingStartedAt(round.rolling_starts_at);
setCountdown(nextCountdown);
// Hard waiting is only for late join / refresh safety.
// Normal post-settlement waiting must stay inside the live room.
setIsWaitingForNextRound(false);

  if (nextPhase === "betting") {
    setShowInRoomNextRoundPause(false);
showInRoomNextRoundPauseRef.current = false;
setIsWaitingForNextRound(false);
setShouldPlayLiveDiceSequence(false);
clearVisibleDiceRoundState();
setRollingStartedAt(null);
setServerRngResults([]);

    if (!restoredActiveBet) {
      setActiveBet(null);
    }

    lastDiceSoundCountRef.current = 0;
  }

if (nextPhase === "closed") {
  const hasStartedLocalDiceFlow =
    visualStartedRoundIdRef.current === round.id &&
    shouldPlayLiveDiceSequenceRef.current;

  setServerRngResults(round.result_animals || []);

  if (hasStartedLocalDiceFlow) {
    setPhase("rolling");
    phaseRef.current = "rolling";
    setPhaseTargetAt(null);
    return;
  }

  setShouldPlayLiveDiceSequence(false);
  clearVisibleDiceRoundState();
}

if (nextPhase === "rolling") {
  const backendResultKeys = round.result_animals || [];
  const hasBackendTimeline =
    Boolean(round.rolling_starts_at) &&
    backendResultKeys.length === SIX_ANIMAL_RULES.diceCount;

  const shouldRunLocalDiceFlow =
    hasBackendTimeline &&
    roundIdRef.current === round.id &&
    !isVisualDiceCompleteRef.current;

  setServerRngResults(backendResultKeys);
  setRollingStartedAt(round.rolling_starts_at);
  setShouldPlayLiveDiceSequence(shouldRunLocalDiceFlow);
  if (shouldRunLocalDiceFlow) {
  setVisualDiceStatus("playing");
  visualDiceStatusRef.current = "playing";
}

if (shouldRunLocalDiceFlow) {
  if (visualStartedRoundIdRef.current !== round.id) {
    visualStartedRoundIdRef.current = round.id;
visualActiveRoundIdRef.current = round.id;
setVisualActiveRoundId(round.id);
    setIsVisualDiceComplete(false);
    isVisualDiceCompleteRef.current = false;
    setVisualCompleteRoundId(null);
    visualCompleteRoundIdRef.current = null;
    setDiceResult([]);
    diceResultRef.current = [];
    lastDiceSoundCountRef.current = 0;
    setThreeDiceRunKey((value) => value + 1);
  }

  return;
}

  return;
}

if (nextPhase === "result") {
  const backendResultKeys = round.result_animals || [];
  const hasBackendTimeline =
    Boolean(round.rolling_starts_at) &&
    backendResultKeys.length === SIX_ANIMAL_RULES.diceCount;

const hasCompleteVisualDiceResult =
  visualCompleteRoundIdRef.current === round.id &&
  isVisualDiceCompleteRef.current &&
  diceResultRef.current.length === SIX_ANIMAL_RULES.diceCount;

  const shouldContinueLocalDiceFlow =
    hasBackendTimeline &&
    roundIdRef.current === round.id &&
    !hasCompleteVisualDiceResult;

setServerRngResults(backendResultKeys);
setRollingStartedAt(round.rolling_starts_at);

if (hasCompleteVisualDiceResult) {
  // Visual dice already completed for this round.
  // Result phase is now HOLD mode, not PLAY mode.
  setVisualDiceStatus("complete");
  visualDiceStatusRef.current = "complete";

  setShouldPlayLiveDiceSequence(false);
  shouldPlayLiveDiceSequenceRef.current = false;
  return;
}

setShouldPlayLiveDiceSequence(shouldContinueLocalDiceFlow);
shouldPlayLiveDiceSequenceRef.current = shouldContinueLocalDiceFlow;

return;
}
}

useEffect(() => {
  phaseRef.current = phase;
  roundIdRef.current = roundId;
  isQuittingRef.current = isQuitting;
  joinedRoundIdRef.current = joinedRoundId;
shouldPlayLiveDiceSequenceRef.current = shouldPlayLiveDiceSequence;
diceResultRef.current = diceResult;
isVisualDiceCompleteRef.current = isVisualDiceComplete;
  visualDiceStatusRef.current = visualDiceStatus;
visualCompleteRoundIdRef.current = visualCompleteRoundId;
visualActiveRoundIdRef.current = visualActiveRoundId;
settlementWaitingRoundIdRef.current = settlementWaitingRoundId;
showInRoomNextRoundPauseRef.current = showInRoomNextRoundPause;
showSettlementMomentRef.current = showSettlementMoment;
}, [
  phase,
  roundId,
  isQuitting,
  joinedRoundId,
  shouldPlayLiveDiceSequence,
  diceResult,
  isVisualDiceComplete,
    visualDiceStatus,
  visualCompleteRoundId,
  visualActiveRoundId,
  settlementWaitingRoundId,
  showInRoomNextRoundPause,
  showSettlementMoment,
]);

  const selectedOption = useMemo(() => {
    return SIX_ANIMAL_OPTIONS.find((animal) => animal.key === selectedAnimal);
  }, [selectedAnimal]);

  const numericBetAmount = Number(betAmount || 0);
  const isBettingOpen = phase === "betting";
  const canEditBet = isBettingOpen && !activeBet;

  const isBetValid =
    canEditBet &&
    Boolean(selectedAnimal) &&
    Number.isFinite(numericBetAmount) &&
    numericBetAmount >= SIX_ANIMAL_RULES.minBet &&
    numericBetAmount <= SIX_ANIMAL_RULES.maxBet &&
    roundId !== ""; 

  const matchCount =
    activeBet && diceResult.length > 0
      ? diceResult.filter((item) => item === activeBet.animalNameMm).length
      : 0;

  const displayProfitAmount =
    activeBet && phase === "result" && matchCount > 0
      ? activeBet.amount * matchCount
      : 0;

  const displayPayoutAmount =
    activeBet && phase === "result" && matchCount > 0
      ? activeBet.amount + displayProfitAmount
      : 0;

  const displayNetAmount =
    activeBet && phase === "result"
      ? matchCount > 0
        ? displayProfitAmount
        : -activeBet.amount
      : 0;

  const settlementStatus =
    !activeBet
      ? "No active bet"
      : phase !== "result"
        ? "Pending result"
        : matchCount > 0
          ? "Win"
          : "No Match";

  const displayCountdown = Math.max(0, countdown);

  const timerLabel =
    phase === "rolling"
      ? "Rolling"
      : phase === "closed" && displayCountdown <= 0
        ? "Starting"
        : `${displayCountdown}s`;

  const commandBarClass =
    phase === "betting"
      ? "border-emerald-300/20 bg-emerald-400/10"
      : phase === "closed"
        ? "border-red-300/25 bg-red-500/15"
        : phase === "rolling"
          ? "border-amber-300/30 bg-amber-400/15"
          : matchCount > 0
            ? "border-emerald-300/30 bg-emerald-400/15"
            : "border-amber-300/25 bg-black/35";
  
const hasCompleteDiceResult =
  diceResult.length === SIX_ANIMAL_RULES.diceCount;

const showFinalResultPanel =
  phase === "result" &&
  hasCompleteDiceResult &&
  isVisualDiceComplete &&
  visualCompleteRoundId === roundId;

const isResultPhaseVisualGuard =
  phase === "result" && !showFinalResultPanel;

const showRollingResultPanel = phase === "rolling" || isResultPhaseVisualGuard;
const showResultBoardPanel = showRollingResultPanel || showFinalResultPanel;

const isRollingReconnectView = false;

  const showTopPanel = phase === "betting";
  const showFloatingClosedPanel = phase === "closed";
  const showFloatingResultBoard = showResultBoardPanel;
const showSettlementSheet =
  showFinalResultPanel && showSettlementMoment && Boolean(activeBet);

const showNextRoundPause = false;

const heldVisualRoundId =
  visualActiveRoundId ?? (showFinalResultPanel ? visualCompleteRoundId : null);

const shouldEnableDiceController =
  shouldPlayLiveDiceSequence &&
  visualDiceStatus === "playing" &&
  !showFinalResultPanel &&
  (phase === "rolling" || isResultPhaseVisualGuard);

const shouldConfirmBrowserRefresh =
  !showRoomIntro &&
  !isWaitingForNextRound &&
  (phase === "closed" || phase === "rolling" || phase === "result");

  const mountedDiceRackMode: MountedDiceRackMode =
    phase === "betting" || phase === "closed"
      ? "ready"
      : phase === "rolling"
        ? "sequence"
        : "empty";

const effectiveMountedDiceRackMode: MountedDiceRackMode =
  phase === "rolling" || isResultPhaseVisualGuard
    ? "sequence"
    : mountedDiceRackMode;

const activeBetAnimal = activeBet
  ? getAnimalByNameMm(activeBet.animalNameMm)
  : null;

const activeBetDisplayName = activeBetAnimal?.name ?? activeBet?.animalNameMm ?? "";

const isResultWin = phase === "result" && Boolean(activeBet) && matchCount > 0;

  const resultStatusLabel = !activeBet
    ? "Table Result"
    : isResultWin
      ? "You Win"
      : "No Match";

  const netResultLabel =
    activeBet && phase === "result"
      ? `${displayNetAmount > 0 ? "+" : "-"}${formatMMK(
          Math.abs(displayNetAmount)
        )} MMK`
      : "—";

  function playRoomSound(eventName: SixAnimalSoundEvent) {
    if (!soundEnabled) return;
    void eventName;
  }

  async function handleLobbyClick() {
  if (isQuittingRef.current) return;

  const currentRoundId = roundIdRef.current;

  if (isWaitingForNextRound || !currentRoundId) {
    router.push("/");
    return;
  }

  const backendBet = await fetchCurrentUserBetForRound(currentRoundId);

  if (!backendBet) {
    router.push("/");
    return;
  }

  joinedRoundIdRef.current = currentRoundId;
  setJoinedRoundId(currentRoundId);

  isQuittingRef.current = true;
  setIsQuitting(true);
}

async function fetchCurrentUserBetForRound(roundIdToCheck: string) {
  if (!roundIdToCheck) return null;

  const { data, error } = await supabase.rpc("get_my_six_animal_bet", {
    p_round_id: roundIdToCheck,
  });

  if (error) {
    console.error("[SixAnimal] current bet restore RPC error:", error);
    return null;
  }

  const response = data as {
    success?: boolean;
    error?: string;
    bet?: LiveSixAnimalBet | null;
  } | null;

  if (!response?.success) {
    if (response?.error) {
      console.error("[SixAnimal] current bet restore rejected:", response.error);
    }

    return null;
  }

  return response.bet ?? null;
}

async function fetchLatestLiveRound() {
  const { data: latestRound, error: latestRoundError } = await supabase
    .from("six_animal_rounds")
    .select("*")
    .eq("room_id", SIX_ANIMAL_ROOM_UUID)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (latestRoundError) {
    console.error("[SixAnimal] latest round fetch error:", latestRoundError);
    return;
  }

    if (latestRound) {
    await applyLiveRound(latestRound as LiveSixAnimalRound);
  }
}

  useEffect(() => {
    const fetchInitialRoomData = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: wallet } = await supabase
          .from("wallets")
          .select("balance")
          .eq("profile_id", user.id)
          .single();
        if (wallet) setWalletBalance(wallet.balance);
      }

            const { data: activeRound, error: activeRoundError } = await supabase
        .from("six_animal_rounds")
        .select("*")
        .eq("room_id", SIX_ANIMAL_ROOM_UUID)
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (activeRoundError) {
        console.error("[SixAnimal] active round fetch error:", activeRoundError);
      }

      if (activeRound) {
        await applyLiveRound(activeRound as LiveSixAnimalRound);
      } else {

  const { error } = await supabase.rpc("rotate_six_animal_round", {
    p_room_id: SIX_ANIMAL_ROOM_UUID,
  });

  if (error) {
    console.error("[SixAnimal] recovery rotation error:", error);
    return;
  }

  const { data: recoveredRound, error: recoveredRoundError } = await supabase
    .from("six_animal_rounds")
    .select("*")
    .eq("room_id", SIX_ANIMAL_ROOM_UUID)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (recoveredRoundError) {
    console.error("[SixAnimal] recovered round fetch error:", recoveredRoundError);
  }

  if (recoveredRound) {
    await applyLiveRound(recoveredRound as LiveSixAnimalRound);
  }
}
    };
    
    fetchInitialRoomData();

    // --- LIVE ROOM REALTIME SYNC ---
    // Realtime is used as the fast signal.
    // fetchLatestLiveRound remains the safe source so old/stale row updates
    // cannot pull the player backward into a previous round.
    const channel = supabase
      .channel("public:six_animal_rounds")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "six_animal_rounds" },
        (payload) => {
          if (
            payload.eventType !== "INSERT" &&
            payload.eventType !== "UPDATE"
          ) {
            return;
          }

          const liveRound = payload.new as LiveSixAnimalRound;

          if (!liveRound?.id) return;
          if (liveRound.room_id !== SIX_ANIMAL_ROOM_UUID) return;

          void fetchLatestLiveRound();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  useEffect(() => {
  let cancelled = false;

  const pollLatestRound = async () => {
    if (cancelled) return;
    await fetchLatestLiveRound();
  };

  pollLatestRound();

  const pollTimer = window.setInterval(pollLatestRound, 2000);

  return () => {
    cancelled = true;
    window.clearInterval(pollTimer);
  };
}, [supabase]);

useEffect(() => {
  if (phase === "loading" || isWaitingForNextRound) {
    setShowRoomIntro(true);
    return;
  }

  const introTimer = window.setTimeout(() => {
    setShowRoomIntro(false);
  }, 800);

  return () => window.clearTimeout(introTimer);
}, [phase, isWaitingForNextRound]);

useEffect(() => {
  return () => {
    if (resultRevealTimerRef.current) {
      window.clearTimeout(resultRevealTimerRef.current);
    }

    if (settlementMomentTimerRef.current) {
      window.clearTimeout(settlementMomentTimerRef.current);
    }
  };
}, []);

useEffect(() => {
  if (phase === "loading" || phase === "rolling" || !phaseTargetAt) {
    return;
  }

  const syncCountdown = () => {
    setCountdown(secondsUntil(phaseTargetAt));
  };

  syncCountdown();

  const timer = window.setInterval(syncCountdown, 500);

  return () => window.clearInterval(timer);
}, [phase, phaseTargetAt]);

useEffect(() => {
  if (phase !== "closed") return;
  if (!roundId) return;
  if (!rollingStartedAt) return;
  if (serverRngResults.length !== SIX_ANIMAL_RULES.diceCount) return;
  if (visualStartedRoundIdRef.current === roundId) return;

  const rollingStartMs = new Date(rollingStartedAt).getTime();

  if (!Number.isFinite(rollingStartMs)) return;

  const delayMs = Math.max(0, rollingStartMs - Date.now());

  if (localRollingStartTimerRef.current) {
    window.clearTimeout(localRollingStartTimerRef.current);
    localRollingStartTimerRef.current = null;
  }

  localRollingStartTimerRef.current = window.setTimeout(() => {
    localRollingStartTimerRef.current = null;

    if (visualStartedRoundIdRef.current === roundId) return;
    if (
      isVisualDiceCompleteRef.current &&
      visualCompleteRoundIdRef.current === roundId
    ) {
      return;
    }

    startLocalDiceFlow({
      id: roundId,
      room_id: SIX_ANIMAL_ROOM_UUID,
      round_number: roundNumber,
      phase: "rolling",
      betting_starts_at: null,
      betting_ends_at: null,
      rolling_starts_at: rollingStartedAt,
      result_revealed_at: null,
      next_round_starts_at: null,
      result_animals: serverRngResults,
      status: "active",
    });
  }, delayMs);

  return () => {
    if (localRollingStartTimerRef.current) {
      window.clearTimeout(localRollingStartTimerRef.current);
      localRollingStartTimerRef.current = null;
    }
  };
}, [phase, roundId, roundNumber, rollingStartedAt, serverRngResults]);

useEffect(() => {
  if (!shouldConfirmBrowserRefresh) {
    return;
  }

  const handleBeforeUnload = (event: BeforeUnloadEvent) => {
    event.preventDefault();
    event.returnValue = "";
  };

  window.addEventListener("beforeunload", handleBeforeUnload);

  return () => {
    window.removeEventListener("beforeunload", handleBeforeUnload);
  };
}, [shouldConfirmBrowserRefresh]);

  function handleThreeDiceComplete(
  payload: ThreeDiceRoundPayload,
  payloadRoundId?: string | null
) {
  if (
    !payloadRoundId ||
    payloadRoundId !== visualActiveRoundIdRef.current ||
    payloadRoundId !== roundIdRef.current
  ) {
    return;
  }

    if (
    isVisualDiceCompleteRef.current &&
    visualCompleteRoundIdRef.current === payloadRoundId
  ) {
    return;
  }
    const resultNames = convertThreeDicePayloadToMyanmarResult(payload);

    if (resultNames.length !== SIX_ANIMAL_RULES.diceCount) return;

const completedRoundId = roundIdRef.current;

diceResultRef.current = resultNames;
isVisualDiceCompleteRef.current = true;
visualCompleteRoundIdRef.current = completedRoundId;

setDiceResult(resultNames);
setIsVisualDiceComplete(true);

setVisualDiceStatus("complete");
visualDiceStatusRef.current = "complete";

setVisualCompleteRoundId(payloadRoundId);
visualCompleteRoundIdRef.current = payloadRoundId;
// Keep the completed visual round id locked during result/settlement hold.
// clearVisibleDiceRoundState() will clear it safely when the next betting round is applied.
setVisualActiveRoundId(payloadRoundId);
visualActiveRoundIdRef.current = payloadRoundId;

// Die 3 completed. Hard-stop the dice controller.
// Do not keep enabled=true for result hold, because enabled still means "can run".
setShouldPlayLiveDiceSequence(false);
shouldPlayLiveDiceSequenceRef.current = false;

setShowSettlementMoment(false);
showSettlementMomentRef.current = false;

setSettlementWaitingRoundId(payloadRoundId);
settlementWaitingRoundIdRef.current = payloadRoundId;
setPhase("result");

if (settlementMomentTimerRef.current) {
  window.clearTimeout(settlementMomentTimerRef.current);
}

settlementMomentTimerRef.current = window.setTimeout(() => {
  if (
    settlementWaitingRoundIdRef.current !== payloadRoundId ||
    roundIdRef.current !== payloadRoundId
  ) {
    settlementMomentTimerRef.current = null;
    return;
  }

  setShowSettlementMoment(true);
  showSettlementMomentRef.current = true;

  settlementMomentTimerRef.current = null;
}, SETTLEMENT_POPUP_DELAY_MS);

    if (resultRevealTimerRef.current) {
      window.clearTimeout(resultRevealTimerRef.current);
    }

    resultRevealTimerRef.current = window.setTimeout(() => {
  const completedMatchCount = activeBet
    ? resultNames.filter((item) => item === activeBet.animalNameMm).length
    : 0;

  playRoomSound("round-result");
  playRoomSound(completedMatchCount > 0 ? "round-win" : "round-no-match");

  // Important:
  // In live-room mode, the browser does not settle the round,
  // does not update backend result, and does not force phase = result.
  // Backend cron + advance_six_animal_room controls result timing.
  resultRevealTimerRef.current = null;
}, RESULT_REVEAL_DELAY_MS);
  }

function handleThreeDiceProgress(
  payload: ThreeDiceRoundPayload,
  payloadRoundId?: string | null
) {
  if (
    !payloadRoundId ||
    payloadRoundId !== visualActiveRoundIdRef.current ||
    payloadRoundId !== roundIdRef.current
  ) {
    return;
  }

  if (
  isVisualDiceCompleteRef.current &&
  visualCompleteRoundIdRef.current === payloadRoundId
) {
  return;
}

    const resultNames = convertThreeDicePayloadToMyanmarResult(payload);

    if (resultNames.length > lastDiceSoundCountRef.current) {
      playRoomSound("dice-reveal");
      lastDiceSoundCountRef.current = resultNames.length;
    }

    setDiceResult(resultNames);
  }
  
  function handleSelectAnimal(animal: SixAnimalKey) {
    if (!canEditBet) return;
    setSelectedAnimal(animal);
  }

  async function handlePlaceBet() {
    if (!isBetValid || !selectedOption || !roundId) return;

    setActiveBet({
      animalKey: selectedOption.key,
      animalNameMm: selectedOption.nameMm,
      amount: numericBetAmount,
      roundNumber,
    });
    joinedRoundIdRef.current = roundId;
setJoinedRoundId(roundId);

    const { data, error } = await supabase.rpc("place_six_animal_bet", {
      p_round_id: roundId,
      p_animal: selectedOption.key,
      p_amount: numericBetAmount,
    });

    const response = data as any;
    if (error || (response && response.success === false)) {
      console.error("Bet rejected:", error?.message || response?.error);
      setActiveBet(null);
      return;
    }

    playRoomSound("bet-locked");
    if (response && response.new_balance !== undefined) {
      setWalletBalance(response.new_balance);
    }
  }

  return (
    <main
      className="relative isolate h-[100dvh] overflow-hidden bg-black text-white"
      style={{
        backgroundImage: `radial-gradient(circle at 50% 4%, rgba(251,191,36,0.08), transparent 34%), linear-gradient(135deg, rgba(8,1,1,0.52), rgba(32,5,5,0.32), rgba(0,0,0,0.78)), url(${ROOM_BACKGROUND})`,
        backgroundSize: "cover",
        backgroundPosition: "center top",
      }}
    >
      <RoyalRoomAtmosphere />

      {isQuitting && !showRoomIntro ? (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/85 backdrop-blur-sm">
          <div className="relative mx-5 w-full max-w-sm rounded-[2rem] border border-amber-300/25 bg-black/70 p-6 text-center shadow-2xl shadow-black/80 backdrop-blur-xl">
            <div className="mx-auto mb-5 h-10 w-10 animate-spin rounded-full border-4 border-amber-300/20 border-t-amber-300" />
            <p className="text-[10px] font-black uppercase tracking-[0.38em] text-amber-200/70">
              Leaving Room
            </p>
            <p className="mt-3 text-sm font-bold leading-relaxed text-white/65">
              Waiting for the current round to settle to safely return you to the lobby.
            </p>
          </div>
        </div>
      ) : null}

      {showRoomIntro ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-100"
            style={{ backgroundImage: `url(${ROOM_BACKGROUND})` }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.18),rgba(20,3,3,0.24),rgba(0,0,0,0.38))]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,transparent_0%,rgba(0,0,0,0.18)_48%,rgba(0,0,0,0.55)_100%)]" />

          <div className="relative mx-5 w-full max-w-sm rounded-[2rem] border border-amber-300/25 bg-black/70 p-6 text-center shadow-2xl shadow-red-950/50 backdrop-blur-xl">
            <p className="text-[10px] font-black uppercase tracking-[0.38em] text-amber-200/70">
              {isWaitingForNextRound ? "Round In Progress" : "Entering Live Room"}
            </p>
<h1 className="mt-3 text-3xl font-black text-amber-50">
  Six Animal
</h1>
            <p className="mt-3 text-sm font-bold leading-relaxed text-white/65">
              {isWaitingForNextRound 
                ? "Please wait for the current round to finish. You will be joined when betting opens." 
                : "Preparing table, dice, and live round timer."}
            </p>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-2/3 animate-pulse rounded-full bg-amber-300" />
            </div>
          </div>
        </div>
      ) : null}

      <div className="relative z-10 flex h-full min-h-0 flex-col overflow-hidden px-2 py-2 sm:px-4">
        <header className="z-20 flex shrink-0 items-center justify-between rounded-2xl border border-amber-300/24 bg-[linear-gradient(135deg,rgba(45,7,3,0.9),rgba(12,2,2,0.78),rgba(70,22,5,0.62))] px-3 py-2 shadow-[0_0_24px_rgba(127,29,29,0.28),inset_0_1px_0_rgba(251,191,36,0.12)] backdrop-blur-md">
<button
  onClick={handleLobbyClick}
  className="text-xs font-black text-amber-300"
>
  ← Lobby
</button>

          <div className="text-center">
<p className="text-[9px] font-bold uppercase tracking-[0.32em] text-amber-200/75 drop-shadow-[0_0_8px_rgba(251,191,36,0.22)]">
  Six Animal Live Room
</p>
            <p className="text-sm font-black text-white drop-shadow-[0_0_10px_rgba(251,191,36,0.18)]">
              Live Table
            </p>
          </div>

          <div className="rounded-full border border-amber-300/24 bg-[linear-gradient(135deg,rgba(251,191,36,0.18),rgba(120,53,15,0.22))] px-3 py-1 text-[11px] font-black text-amber-100 shadow-inner shadow-black/30">
            Live
          </div>
        </header>

        <section className="mt-2 flex min-h-0 flex-1 flex-col overflow-hidden rounded-[1.85rem] border border-amber-300/22 bg-gradient-to-b from-[#3a0707]/76 via-[#140202]/74 to-black/93 p-2.5 shadow-[0_0_50px_rgba(127,29,29,0.4),inset_0_0_34px_rgba(251,191,36,0.065),inset_0_1px_0_rgba(251,191,36,0.12)] backdrop-blur-sm">
          {showTopPanel ? (
            <div className={`shrink-0 rounded-[1.15rem] border p-1.5 shadow-xl shadow-black/35 backdrop-blur-md ${commandBarClass}`}>
              {showResultBoardPanel ? (
                <div
                  className={`rounded-2xl border p-2.5 shadow-xl shadow-black/35 ${
                    showFinalResultPanel && isResultWin
                      ? "border-emerald-300/30 bg-emerald-400/10"
                      : "border-amber-300/25 bg-black/38"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-[0.28em] text-amber-200/60">
                        Royal Result Board
                      </p>
                      <p className="mt-1 text-base font-black text-white">
                        {showFinalResultPanel ? "Royal Table Result" : "Dice Revealing"}
                      </p>
                    </div>

                    <div
                      className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] ${
                        showFinalResultPanel && isResultWin
                          ? "border-emerald-200/35 bg-emerald-300/18 text-emerald-100"
                          : "border-amber-200/25 bg-amber-300/10 text-amber-100"
                      }`}
                    >
                      {showFinalResultPanel ? resultStatusLabel : `${diceResult.length}/3`}
                    </div>
                  </div>

                  <div className="mt-1.5 grid grid-cols-3 gap-1.5">
                    {[0, 1, 2].map((index) => {
                      const nameMm = diceResult[index];
                      const animal = nameMm ? getAnimalByNameMm(nameMm) : null;
                      const isMatched = Boolean(
                        showFinalResultPanel &&
                          activeBet &&
                          nameMm &&
                          activeBet.animalNameMm === nameMm
                      );
const isCurrent =
  (phase === "rolling" || isResultPhaseVisualGuard) &&
  index === diceResult.length &&
  diceResult.length < SIX_ANIMAL_RULES.diceCount;

                      return (
                        <div
                          key={`stable-result-slot-${index}`}
                          className={`relative flex min-h-[62px] items-center justify-center rounded-2xl border ${
                            isMatched
                              ? "border-emerald-200/45 bg-emerald-300/14"
                              : animal
                                ? "border-amber-200/25 bg-amber-300/10"
                                : isCurrent
                                  ? "border-emerald-300/35 bg-emerald-400/12"
                                  : "border-white/10 bg-white/[0.03]"
                          }`}
                        >
                          {isMatched ? (
                            <div className="absolute right-1.5 top-1.5 rounded-full bg-emerald-300 px-1.5 py-0.5 text-[7px] font-black uppercase tracking-[0.12em] text-black">
                              Match
                            </div>
                          ) : null}

                          {animal ? (
                            <div className="text-center">
                              <img
                                src={ANIMAL_ASSETS[animal.key]}
                                alt={animal.name}
                                className="mx-auto h-10 w-10 object-contain drop-shadow-[0_0_14px_rgba(251,191,36,0.45)]"
                              />
                              <p className="mt-0.5 text-[10px] font-black text-white">
                                {animal.name}
                              </p>
                            </div>
                          ) : (
                            <div
                              className={`h-9 w-9 rounded-xl border shadow-inner shadow-black/50 ${
                                isCurrent
                                  ? "animate-pulse border-emerald-200/50 bg-emerald-300/25 shadow-emerald-500/20"
                                  : "border-amber-200/10 bg-black/35"
                              }`}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {showFinalResultPanel && activeBet ? (
                    <>
                      <div className="mt-2 grid grid-cols-[auto_1fr_auto] items-center gap-2 rounded-2xl border border-white/10 bg-black/38 p-2">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-amber-300/20 bg-amber-300/10">
                          {activeBetAnimal ? (
                            <img
                              src={ANIMAL_ASSETS[activeBetAnimal.key]}
                              alt={activeBetAnimal.name}
                              className="h-9 w-9 object-contain drop-shadow-[0_0_12px_rgba(251,191,36,0.45)]"
                            />
                          ) : (
                            <span className="text-sm font-black text-amber-100">
                              {activeBetDisplayName}
                            </span>
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="text-[8px] font-black uppercase tracking-[0.22em] text-amber-200/55">
                            Your Bet
                          </p>
                          <p className="truncate text-sm font-black text-white">
                            {activeBetDisplayName} · {formatMMK(activeBet.amount)} MMK
                          </p>
                        </div>

                        <div className="rounded-xl border border-amber-300/15 bg-white/[0.04] px-3 py-1.5 text-center">
                          <p className="text-[8px] font-black uppercase tracking-[0.16em] text-white/45">
                            Match
                          </p>
                          <p className="text-sm font-black text-amber-100">
                            {matchCount}/3
                          </p>
                        </div>
                      </div>

                      <div className="mt-2 grid grid-cols-3 gap-1.5">
                        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2 text-center">
                          <p className="text-[8px] font-black uppercase tracking-[0.16em] text-white/45">
                            Bet
                          </p>
                          <p className="mt-1 text-xs font-black text-white">
                            {formatMMK(activeBet.amount)} MMK
                          </p>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2 text-center">
                          <p className="text-[8px] font-black uppercase tracking-[0.16em] text-white/45">
                            Return
                          </p>
                          <p className="mt-1 text-xs font-black text-amber-100">
                            {formatMMK(displayPayoutAmount)} MMK
                          </p>
                        </div>

                        <div
                          className={`rounded-2xl border p-2 text-center ${
                            isResultWin
                              ? "border-emerald-300/25 bg-emerald-400/10"
                              : "border-red-300/20 bg-red-500/10"
                          }`}
                        >
                          <p className="text-[8px] font-black uppercase tracking-[0.16em] text-white/45">
                            Net
                          </p>
                          <p
                            className={`mt-1 text-xs font-black ${
                              isResultWin ? "text-emerald-100" : "text-red-100"
                            }`}
                          >
                            {netResultLabel}
                          </p>
                        </div>
                      </div>
                    </>
                  ) : null}
                </div>
              ) : (
<div className="grid grid-cols-2 gap-2">
  <div className="rounded-2xl border border-emerald-300/20 bg-emerald-400/10 px-4 py-2 text-right">
    <p className="text-[9px] font-black uppercase tracking-[0.25em] text-amber-200/60">
      Timer
    </p>
    <p className="mt-0.5 text-2xl font-black text-white">
      {timerLabel}
    </p>
  </div>

  <div className="rounded-2xl border border-emerald-300/20 bg-emerald-400/10 px-4 py-2 text-right">
    <p className="text-[9px] font-black uppercase tracking-[0.25em] text-emerald-100/55">
      Balance
    </p>
    <p className="mt-0.5 text-lg font-black text-emerald-100">
      {formatMMK(walletBalance)} MMK
    </p>
  </div>
</div>
              )}
            </div>
          ) : null}

          <div
            className="relative mt-2 min-h-0 flex-1 overflow-hidden rounded-[1.7rem] border border-amber-300/20 bg-black/55 shadow-[inset_0_0_34px_rgba(0,0,0,0.58),inset_0_0_28px_rgba(251,191,36,0.05)]"
            style={{
              backgroundImage: `linear-gradient(to bottom, rgba(5,1,1,0.48), rgba(18,2,2,0.42), rgba(0,0,0,0.72)), url(${ROOM_BACKGROUND})`,
              backgroundSize: "cover",
              backgroundPosition: "center 38%",
            }}
          >
            <RoyalTableChamberBackdrop />

            {showFloatingClosedPanel ? (
              <div className="pointer-events-none absolute left-1/2 top-3 z-40 -translate-x-1/2 rounded-full border border-red-300/25 bg-red-950/75 px-4 py-2 text-center shadow-2xl shadow-black/60 backdrop-blur-md">
                <p className="text-[9px] font-black uppercase tracking-[0.22em] text-red-100/65">
                  Bets Closed
                </p>
                <p className="mt-0.5 text-xs font-black text-white">
                  {displayCountdown > 0
                    ? `Dice starting · ${displayCountdown}s`
                    : "Dice starting"}
                </p>
              </div>
            ) : null}

            {showFloatingResultBoard ? (
              <div className="pointer-events-none absolute inset-x-4 top-2 z-40 overflow-hidden rounded-[1.05rem] border border-amber-300/28 bg-[linear-gradient(145deg,rgba(45,7,3,0.82),rgba(5,1,1,0.76),rgba(52,12,5,0.62))] p-1.5 shadow-2xl shadow-black/75 backdrop-blur-md">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(251,191,36,0.16),transparent_62%)]" />
                <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-amber-200/60 to-transparent" />

                <div className="relative z-10">
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-[7px] font-black uppercase tracking-[0.24em] text-amber-200/60">
                        Royal Result Board
                      </p>
                      <p className="truncate text-xs font-black text-white drop-shadow-[0_0_8px_rgba(251,191,36,0.16)]">
{showFinalResultPanel
  ? "Visible Dice Result"
  : isResultPhaseVisualGuard
    ? "Finalizing Table Result"
    : isRollingReconnectView
      ? "Live Table Sync"
      : "Dice Revealing"}
                      </p>
                    </div>

                    <div
                      className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[8px] font-black uppercase tracking-[0.12em] ${
                        showFinalResultPanel && isResultWin
                          ? "border-emerald-200/35 bg-emerald-300/18 text-emerald-100"
                          : showFinalResultPanel
                            ? "border-red-200/25 bg-red-500/12 text-red-100"
                            : "border-amber-200/25 bg-amber-300/10 text-amber-100"
                      }`}
                    >
{showFinalResultPanel
  ? resultStatusLabel
  : isResultPhaseVisualGuard
    ? `${diceResult.length}/3`
    : isRollingReconnectView
      ? "SYNCED TABLE"
      : `${diceResult.length}/3`}
                    </div>
                  </div>

                  <div className="mt-1.5 grid grid-cols-3 gap-1">
                    {[0, 1, 2].map((index) => {
                      const nameMm = diceResult[index];
                      const animal = nameMm ? getAnimalByNameMm(nameMm) : null;
                      const isMatched = Boolean(
                        showFinalResultPanel &&
                          activeBet &&
                          nameMm &&
                          activeBet.animalNameMm === nameMm
                      );
const isCurrent =
  (phase === "rolling" || isResultPhaseVisualGuard) &&
  index === diceResult.length &&
  diceResult.length < SIX_ANIMAL_RULES.diceCount;

                      return (
                        <div
                          key={`floating-result-slot-${index}`}
                          className={`relative flex min-h-[38px] items-center justify-center overflow-hidden rounded-xl border shadow-inner shadow-black/35 ${
                            isMatched
                              ? "border-emerald-200/50 bg-[linear-gradient(145deg,rgba(16,185,129,0.18),rgba(0,0,0,0.42))] shadow-[0_0_18px_rgba(16,185,129,0.14)]"
                              : animal
                                ? "border-amber-200/28 bg-[linear-gradient(145deg,rgba(251,191,36,0.12),rgba(0,0,0,0.42))]"
                                : isCurrent
                                  ? "border-emerald-300/38 bg-[linear-gradient(145deg,rgba(16,185,129,0.14),rgba(0,0,0,0.42))]"
                                  : "border-white/10 bg-black/30"
                          }`}
                        >
                          {isMatched ? (
                            <div className="absolute right-0.5 top-0.5 rounded-full border border-emerald-100/60 bg-emerald-300 px-1 py-0.5 text-[5px] font-black uppercase tracking-[0.08em] text-black shadow-[0_0_10px_rgba(16,185,129,0.28)]">
                              Match
                            </div>
                          ) : null}

                          {animal ? (
                            <div className="text-center">
                              <img
                                src={ANIMAL_ASSETS[animal.key]}
                                alt={animal.name}
                                className="mx-auto h-6 w-6 object-contain drop-shadow-[0_0_10px_rgba(251,191,36,0.42)]"
                              />
                              <p className="text-[8px] font-black text-white">
                                {animal.name}
                              </p>
                            </div>
                          ) : (
                            <div
                              className={`h-6 w-6 rounded-lg border shadow-inner shadow-black/50 ${
                                isCurrent
                                  ? "animate-pulse border-emerald-200/50 bg-emerald-300/25 shadow-emerald-500/20"
                                  : "border-amber-200/10 bg-black/35"
                              }`}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : null}

{isRollingReconnectView ? (
  <div className="pointer-events-none absolute left-1/2 top-[88px] z-40 -translate-x-1/2 rounded-full border border-amber-300/20 bg-black/55 px-3 py-1.5 text-center shadow-xl shadow-black/50 backdrop-blur-md">
    <p className="text-[8px] font-black uppercase tracking-[0.18em] text-amber-100/70">
      Rejoined Table
    </p>
    <p className="mt-0.5 text-[10px] font-bold text-white/55">
      Restoring current live dice state
    </p>
  </div>
) : null}

            {showSettlementSheet && activeBet ? (
              <div
                className={`pointer-events-none absolute inset-x-3 top-[60%] z-50 mx-auto max-w-[390px] -translate-y-1/2 overflow-hidden rounded-[1.25rem] border p-2 shadow-2xl shadow-black/75 backdrop-blur-xl ${
                  isResultWin
                    ? "border-emerald-300/28 bg-[linear-gradient(145deg,rgba(6,78,59,0.34),rgba(5,1,1,0.82),rgba(45,7,3,0.66))]"
                    : "border-red-300/22 bg-[linear-gradient(145deg,rgba(92,15,12,0.48),rgba(5,1,1,0.84),rgba(45,7,3,0.62))]"
                }`}
              >
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(251,191,36,0.12),transparent_64%)]" />

                <div className="relative z-10">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
                          isResultWin
                            ? "border-emerald-300/25 bg-emerald-400/10"
                            : "border-red-300/20 bg-red-500/10"
                        }`}
                      >
                        {activeBetAnimal ? (
                          <img
                            src={ANIMAL_ASSETS[activeBetAnimal.key]}
                            alt={activeBetAnimal.name}
                            className="h-8 w-8 object-contain drop-shadow-[0_0_12px_rgba(251,191,36,0.45)]"
                          />
                        ) : (
<span className="text-xs font-black text-amber-100">
  {activeBetDisplayName}
</span>
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="text-[8px] font-black uppercase tracking-[0.22em] text-amber-200/55">
                          Settlement
                        </p>
                        <p className="truncate text-sm font-black text-white">
                          {activeBetDisplayName} · Match {matchCount}/3
                        </p>
                      </div>
                    </div>

                    <div
                      className={`shrink-0 rounded-full border px-3 py-1 text-[8px] font-black uppercase tracking-[0.14em] ${
                        isResultWin
                          ? "border-emerald-200/35 bg-emerald-300/18 text-emerald-100"
                          : "border-red-200/25 bg-red-500/12 text-red-100"
                      }`}
                    >
                      {resultStatusLabel}
                    </div>
                  </div>

                  <div className="mt-2 grid grid-cols-3 gap-1.5">
                    <div className="rounded-xl border border-amber-300/12 bg-black/28 p-2 text-center shadow-inner shadow-black/30">
                      <p className="text-[7px] font-black uppercase tracking-[0.15em] text-white/45">
                        Bet
                      </p>
                      <p className="mt-1 text-[11px] font-black text-white">
                        {formatMMK(activeBet.amount)} MMK
                      </p>
                    </div>

                    <div className="rounded-xl border border-amber-300/12 bg-black/28 p-2 text-center shadow-inner shadow-black/30">
                      <p className="text-[7px] font-black uppercase tracking-[0.15em] text-white/45">
                        Return
                      </p>
                      <p className="mt-1 text-[11px] font-black text-amber-100">
                        {formatMMK(displayPayoutAmount)} MMK
                      </p>
                    </div>

                    <div
                      className={`rounded-xl border p-2 text-center ${
                        isResultWin
                          ? "border-emerald-300/25 bg-emerald-400/10"
                          : "border-red-300/20 bg-red-500/10"
                      }`}
                    >
                      <p className="text-[7px] font-black uppercase tracking-[0.15em] text-white/45">
                        Net
                      </p>
                      <p
                        className={`mt-1 text-[11px] font-black ${
                          isResultWin ? "text-emerald-100" : "text-red-100"
                        }`}
                      >
                        {netResultLabel}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

                        {showNextRoundPause ? (
              <div className="pointer-events-none absolute inset-x-4 bottom-4 z-50 mx-auto max-w-[360px] overflow-hidden rounded-[1.1rem] border border-amber-300/24 bg-[linear-gradient(145deg,rgba(45,7,3,0.78),rgba(5,1,1,0.82),rgba(52,12,5,0.58))] p-3 text-center shadow-2xl shadow-black/70 backdrop-blur-xl">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(251,191,36,0.14),transparent_66%)]" />

                <div className="relative z-10">
                  <p className="text-[8px] font-black uppercase tracking-[0.28em] text-amber-200/65">
                    Live Table Pause
                  </p>
                  <p className="mt-1 text-sm font-black text-white">
                    Next round opening{displayCountdown > 0 ? ` · ${displayCountdown}s` : " soon"}
                  </p>
                  <p className="mt-1 text-[10px] font-bold text-white/52">
                    Final dice and result stay on the table until betting opens.
                  </p>
                </div>
              </div>
            ) : null}

            <div className="relative z-10 flex h-full min-h-0 items-center justify-center p-2">
              <div className="relative h-full w-full max-w-[980px]">
                <ThreeDiceSequenceController
                  enabled={shouldEnableDiceController}
                  runKey={threeDiceRunKey}
                  onComplete={handleThreeDiceComplete}
                  onProgress={handleThreeDiceProgress}
                  className="h-full min-h-[430px] w-full"
                  showInternalResultStrip={false}
                  mountedDiceRackMode={effectiveMountedDiceRackMode}
                  serverRngResults={serverRngResults}
rollingStartedAt={
  phase === "rolling" || isResultPhaseVisualGuard ? rollingStartedAt : null
}
visualRoundId={heldVisualRoundId}
                />
              </div>
            </div>

            <SixAnimalBettingSheet
              isOpen={phase === "betting"}
              betAmount={betAmount}
              selectedAnimal={selectedAnimal}
              selectedOption={selectedOption}
              activeBet={activeBet}
              canEditBet={canEditBet}
              isBetValid={isBetValid}
              numericBetAmount={numericBetAmount}
              animalAssets={ANIMAL_ASSETS}
              onBetAmountChange={setBetAmount}
              onQuickAmountSelect={setBetAmount}
              onSelectAnimal={handleSelectAnimal}
              onPlaceBet={handlePlaceBet}
            />
          </div>
        </section>
      </div>
    </main>
  );
}