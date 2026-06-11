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
import SettlementPopup from "@/components/games/six-animal/SettlementPopup";
import FloatingResultBoard from "@/components/games/six-animal/FloatingResultBoard";
import { RoyalRoomAtmosphere } from "@/components/games/six-animal/RoyalRoomAtmosphere";
import RoyalTableChamberBackdrop from "@/components/games/six-animal/RoyalTableChamberBackdrop";
import RoomIntroOverlay from "@/components/games/six-animal/RoomIntroOverlay";
import { SIX_ANIMAL_OPTIONS, SIX_ANIMAL_RULES } from "@/lib/gameRules";
import { convertThreeDicePayloadToMyanmarResult } from "@/lib/threeDiceResultAdapter";
import { createClient } from "@/lib/supabase/client";
import type { SixAnimalKey } from "@/types/games";

const ROOM_BACKGROUND = naganiAssets.sixAnimal.room.palaceBgV1;
const ROYAL_EXIT_DOOR_BUTTON = naganiAssets.sixAnimal.ui.royalExitDoor;

const RESULT_REVEAL_DELAY_MS = 900;
const SETTLEMENT_POPUP_DELAY_MS = 1400;

const ROOM_SOUND_ENABLED = true;
const ROOM_SOUND_VOLUME = 0.72;

const ROOM_BACKGROUND_MUSIC_SRC =
  "/assets/nagani/sounds/six-animal/room-bgm.mp3";

const ROOM_BACKGROUND_MUSIC_VOLUME = 0.28;
const ROOM_BACKGROUND_MUSIC_FADE_MS = 700;
const ROOM_BACKGROUND_MUSIC_FADE_STEP_MS = 40;
const ROOM_BACKGROUND_MUSIC_MUTED_STORAGE_KEY =
  "nagani-six-animal-bgm-muted";

const SIX_ANIMAL_ROOM_UUID = "11111111-1111-1111-1111-111111111111";
const BET_AMOUNT_STEP = 1000;

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
  bet_type: BetMode;
  animal: SixAnimalKey;
  animal_2: SixAnimalKey | null;
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
  if (round.phase === "rolling") {
    return round.result_revealed_at ?? round.next_round_starts_at;
  }
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
type BetMode = "single" | "pair";

type ActiveBet = {
  betType: BetMode;
  animalKey: SixAnimalKey;
  animalKey2?: SixAnimalKey | null;
  animalNameMm: string;
  animalNameMm2?: string | null;
  amount: number;
  roundNumber: number;
  
};

type SixAnimalSoundEvent =
  | "loading"
  | "betting-round"
  | "bets-closed"
  | "dice-drop"
  | "result-reveal"
  | "settlement-round"
  | "bet-locked";

const SIX_ANIMAL_SOUND_SRC: Record<SixAnimalSoundEvent, string> = {
  loading: "/assets/nagani/sounds/six-animal/loading.mp3",
  "betting-round": "/assets/nagani/sounds/six-animal/betting-round.mp3",
  "bets-closed": "/assets/nagani/sounds/six-animal/bets-closed.mp3",
  "dice-drop": "/assets/nagani/sounds/six-animal/dice-drop.mp3",
  "result-reveal": "/assets/nagani/sounds/six-animal/result-reveal.mp3",
  "settlement-round": "/assets/nagani/sounds/six-animal/settlement-round.mp3",
  "bet-locked": "/assets/nagani/sounds/six-animal/bet-locked.mp3",
};
const SIX_ANIMAL_SOUND_VOLUME: Record<SixAnimalSoundEvent, number> = {
  loading: 0.42,
  "betting-round": 0.52,
  "bets-closed": 0.62,
  "dice-drop": 0.78,
  "result-reveal": 0.58,
  "settlement-round": 0.7,
  "bet-locked": 0.5,
};

function formatMMK(amount: number) {
  return new Intl.NumberFormat("en-US").format(amount);
}

function getPairKey(animalA: SixAnimalKey, animalB: SixAnimalKey) {
  return [animalA, animalB].sort().join(":");
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

  const betType: BetMode = bet.bet_type === "pair" ? "pair" : "single";
  const animal2 = bet.animal_2
    ? SIX_ANIMAL_OPTIONS.find((option) => option.key === bet.animal_2)
    : null;

  if (betType === "pair" && !animal2) return null;

  return {
    betType,
    animalKey: animal.key,
    animalKey2: animal2?.key ?? null,
    animalNameMm: animal.nameMm,
    animalNameMm2: animal2?.nameMm ?? null,
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
  const [betMode, setBetMode] = useState<BetMode>("single");
const [selectedPairAnimals, setSelectedPairAnimals] = useState<SixAnimalKey[]>([]);
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
const [isBackgroundMusicMuted, setIsBackgroundMusicMuted] = useState(false);

const gameSoundEnabled = ROOM_SOUND_ENABLED;
  const [showRoomIntro, setShowRoomIntro] = useState(true);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [activeBets, setActiveBets] = useState<ActiveBet[]>([]);
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
const roomAudioUnlockedRef = useRef(false);
const roomAudioPoolRef = useRef<
  Partial<Record<SixAnimalSoundEvent, HTMLAudioElement>>
>({});
const lastPhaseSoundKeyRef = useRef<string | null>(null);
const backgroundMusicAudioRef = useRef<HTMLAudioElement | null>(null);
const backgroundMusicFadeTimerRef = useRef<number | null>(null);

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
const isSubmittingBetRef = useRef(false);

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
  setActiveBets([]);
  setSelectedAnimal(null);
  setSelectedPairAnimals([]);
setBetMode("single");
  setBetAmount(String(SIX_ANIMAL_RULES.minBet));
  isSubmittingBetRef.current = false;
}

  roundIdRef.current = round.id;

const backendBets = await fetchCurrentUserBetsForRound(round.id);
const restoredActiveBets = backendBets
  .map((bet) => convertBackendBetToActiveBet(bet, round.round_number))
  .filter((bet): bet is ActiveBet => Boolean(bet));

const hasJoinedCurrentBrowserRound = joinedRoundIdRef.current === round.id;
const isJoinableBettingRound = nextPhase === "betting" && nextCountdown > 0;

const isRefreshOrLateJoinToInProgressRound =
  !isJoinableBettingRound && !hasJoinedCurrentBrowserRound;

if (isRefreshOrLateJoinToInProgressRound) {
  clearVisibleDiceRoundState();
  setShouldPlayLiveDiceSequence(false);
  setRoundId(round.id);
  setRoundNumber(round.round_number);
const waitingTargetAt =
  round.next_round_starts_at ?? getRoundPhaseTargetAt(round);

setPhase("loading");
setPhaseTargetAt(waitingTargetAt);
setRollingStartedAt(null);
setCountdown(secondsUntil(waitingTargetAt));
  setIsWaitingForNextRound(true);
  setServerRngResults([]);
  setActiveBets([]);
  return;
}

if (restoredActiveBets.length > 0) {
  joinedRoundIdRef.current = round.id;
  setJoinedRoundId(round.id);
  setActiveBets(restoredActiveBets);
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

if (restoredActiveBets.length === 0) {
  setActiveBets([]);
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

const selectedPairOptions = useMemo(() => {
  return selectedPairAnimals
    .map((animalKey) =>
      SIX_ANIMAL_OPTIONS.find((animal) => animal.key === animalKey)
    )
    .filter((animal): animal is (typeof SIX_ANIMAL_OPTIONS)[number] =>
      Boolean(animal)
    );
}, [selectedPairAnimals]);

const isPairBetMode = betMode === "pair";

const activeBet = activeBets[0] ?? null;
const hasActiveBets = activeBets.length > 0;

const totalActiveBetAmount = activeBets.reduce(
  (sum, bet) => sum + bet.amount,
  0
);

const numericBetAmount = Number(betAmount || 0);
const isBettingOpen = phase === "betting";
const canEditBet = isBettingOpen;

const walletStepAmount =
  Math.floor(Math.max(0, walletBalance) / BET_AMOUNT_STEP) * BET_AMOUNT_STEP;

const maxPlayableBetAmount = Math.min(
  SIX_ANIMAL_RULES.maxBet,
  walletStepAmount
);

const canAffordMinBet = maxPlayableBetAmount >= SIX_ANIMAL_RULES.minBet;

const isBetValid =
  canEditBet &&
  canAffordMinBet &&
  Number.isFinite(numericBetAmount) &&
  numericBetAmount >= SIX_ANIMAL_RULES.minBet &&
  numericBetAmount <= maxPlayableBetAmount &&
  roundId !== "" &&
  (isPairBetMode
    ? selectedPairOptions.length === 2
    : Boolean(selectedAnimal));

const activeBetResults = activeBets.map((bet) => {
  if (bet.betType === "pair" && bet.animalNameMm2) {
    const hasFirstAnimal = diceResult.includes(bet.animalNameMm);
    const hasSecondAnimal = diceResult.includes(bet.animalNameMm2);
    const pairMatchCount =
      Number(hasFirstAnimal) + Number(hasSecondAnimal);
    const isPairWin = hasFirstAnimal && hasSecondAnimal;

    const payout = phase === "result" && isPairWin ? bet.amount * 5 : 0;
    const profit = payout > 0 ? payout - bet.amount : 0;

    return {
      bet,
      matchCount: pairMatchCount,
      payout,
      profit,
    };
  }

  const betMatchCount =
    diceResult.length > 0
      ? diceResult.filter((item) => item === bet.animalNameMm).length
      : 0;

  const payout =
    phase === "result" && betMatchCount > 0
      ? bet.amount + bet.amount * betMatchCount
      : 0;

  const profit =
    phase === "result" && betMatchCount > 0
      ? bet.amount * betMatchCount
      : 0;

  return {
    bet,
    matchCount: betMatchCount,
    payout,
    profit,
  };
});

const totalMatchCount = activeBetResults.reduce(
  (sum, item) => sum + item.matchCount,
  0
);

const matchCount = activeBetResults[0]?.matchCount ?? 0;

const displayProfitAmount =
  phase === "result"
    ? activeBetResults.reduce((sum, item) => sum + item.profit, 0)
    : 0;

const displayPayoutAmount =
  phase === "result"
    ? activeBetResults.reduce((sum, item) => sum + item.payout, 0)
    : 0;

const displayNetAmount =
  hasActiveBets && phase === "result"
    ? displayPayoutAmount - totalActiveBetAmount
    : 0;

const settlementStatus =
  !hasActiveBets
    ? "No active bet"
    : phase !== "result"
      ? "Pending result"
      : displayPayoutAmount > 0
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
  const showFloatingClosedPanel = false;
  const showFloatingResultBoard = showResultBoardPanel;
const showSettlementSheet =
  showFinalResultPanel && showSettlementMoment && hasActiveBets;
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

const isResultWin =
  phase === "result" && hasActiveBets && displayPayoutAmount > 0;

  const resultStatusLabel = !hasActiveBets
    ? "Table Result"
    : isResultWin
      ? "You Win"
      : "No Match";

  const netResultLabel =
    hasActiveBets && phase === "result"
      ? `${displayNetAmount > 0 ? "+" : "-"}${formatMMK(
          Math.abs(displayNetAmount)
        )} MMK`
      : "—";

function getRoomAudio(eventName: SixAnimalSoundEvent) {
  const existingAudio = roomAudioPoolRef.current[eventName];

  if (existingAudio) {
    return existingAudio;
  }

  const audio = new Audio(SIX_ANIMAL_SOUND_SRC[eventName]);
  audio.preload = "auto";
  audio.volume = SIX_ANIMAL_SOUND_VOLUME[eventName] ?? ROOM_SOUND_VOLUME;

  roomAudioPoolRef.current[eventName] = audio;

  return audio;
}

function playRoomSound(eventName: SixAnimalSoundEvent) {
  if (!gameSoundEnabled) return;
  if (!roomAudioUnlockedRef.current) return;

  const audio = getRoomAudio(eventName);

  try {
    audio.currentTime = 0;
    void audio.play().catch(() => {
      // Browser may still block audio on some devices.
      // Keep silent fail for test mode.
    });
  } catch {
    // Keep sound non-blocking. Game flow must never depend on audio.
  }
}

function getBackgroundMusicAudio() {
  if (backgroundMusicAudioRef.current) {
    return backgroundMusicAudioRef.current;
  }

  const audio = new Audio(ROOM_BACKGROUND_MUSIC_SRC);
  audio.preload = "auto";
  audio.loop = true;
  audio.volume = ROOM_BACKGROUND_MUSIC_VOLUME;

  backgroundMusicAudioRef.current = audio;

  return audio;
}

function clearBackgroundMusicFadeTimer() {
  if (!backgroundMusicFadeTimerRef.current) return;

  window.clearInterval(backgroundMusicFadeTimerRef.current);
  backgroundMusicFadeTimerRef.current = null;
}

function fadeBackgroundMusicTo(targetVolume: number, pauseWhenDone = false) {
  const audio = getBackgroundMusicAudio();

  clearBackgroundMusicFadeTimer();

  const startVolume = audio.volume;
  const startedAt = Date.now();

  backgroundMusicFadeTimerRef.current = window.setInterval(() => {
    const progress = Math.min(
      1,
      (Date.now() - startedAt) / ROOM_BACKGROUND_MUSIC_FADE_MS
    );

    audio.volume = startVolume + (targetVolume - startVolume) * progress;

    if (progress < 1) return;

    clearBackgroundMusicFadeTimer();
    audio.volume = targetVolume;

    if (pauseWhenDone) {
      audio.pause();
    }
  }, ROOM_BACKGROUND_MUSIC_FADE_STEP_MS);
}

function syncBackgroundMusic() {
  if (!ROOM_SOUND_ENABLED) return;

  const audio = getBackgroundMusicAudio();

  if (!roomAudioUnlockedRef.current || isBackgroundMusicMuted) {
    fadeBackgroundMusicTo(0, true);
    return;
  }

  try {
    if (audio.paused) {
      audio.volume = 0;

      void audio.play().then(() => {
        fadeBackgroundMusicTo(ROOM_BACKGROUND_MUSIC_VOLUME);
      }).catch(() => {
        // Browser may still block if user has not interacted.
      });

      return;
    }

    fadeBackgroundMusicTo(ROOM_BACKGROUND_MUSIC_VOLUME);
  } catch {
    // Background music must never affect game flow.
  }
}

function handleBackgroundMusicToggle() {
  setIsBackgroundMusicMuted((currentValue) => {
    const nextValue = !currentValue;

    try {
      window.localStorage.setItem(
        ROOM_BACKGROUND_MUSIC_MUTED_STORAGE_KEY,
        String(nextValue)
      );
    } catch {
      // Keep preference saving non-blocking.
    }

    return nextValue;
  });
}

function playCurrentPhaseSound() {
  const currentPhase = phaseRef.current;

  if (currentPhase === "loading") {
    playRoomSound("loading");
    return;
  }

  if (currentPhase === "betting") {
    playRoomSound("betting-round");
    return;
  }

  if (currentPhase === "closed") {
    playRoomSound("bets-closed");
  }
}

function unlockRoomAudio() {
  if (!gameSoundEnabled) return;
  if (roomAudioUnlockedRef.current) return;

  roomAudioUnlockedRef.current = true;

  (Object.keys(SIX_ANIMAL_SOUND_SRC) as SixAnimalSoundEvent[]).forEach(
    (eventName) => {
      getRoomAudio(eventName).load();
    }
  );

  playCurrentPhaseSound();
  syncBackgroundMusic();
}

function handleLobbyClick() {
  setShowExitConfirm(false);
  router.push("/");
}

async function fetchCurrentUserBetsForRound(roundIdToCheck: string) {
  if (!roundIdToCheck) return [];

  const { data, error } = await supabase.rpc("get_my_six_animal_bets", {
    p_round_id: roundIdToCheck,
  });

  if (error) {
    console.error("[SixAnimal] current bets restore RPC error:", error);
    return [];
  }

  const response = data as {
    success?: boolean;
    error?: string;
    bets?: LiveSixAnimalBet[];
  } | null;

  if (!response?.success) {
    if (response?.error) {
      console.error("[SixAnimal] current bets restore rejected:", response.error);
    }

    return [];
  }

  return response.bets ?? [];
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

let fetchedWalletBalance = 0;

if (user) {
  const { data: wallet } = await supabase
    .from("wallets")
    .select("balance")
    .eq("profile_id", user.id)
    .single();

  fetchedWalletBalance = Number(wallet?.balance ?? 0);
  setWalletBalance(fetchedWalletBalance);
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

      if (user && fetchedWalletBalance < SIX_ANIMAL_RULES.minBet) {
  const existingRoundBets = activeRound
    ? await fetchCurrentUserBetsForRound(activeRound.id)
    : [];

  if (existingRoundBets.length === 0) {
    router.replace("/");
    return;
  }
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
  syncBackgroundMusic();
}, [isBackgroundMusicMuted]);

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
  if (!phaseTargetAt) return;
  if (phase === "loading" && !isWaitingForNextRound) return;
  if (phase === "rolling" && !isWaitingForNextRound) return;

  const syncCountdown = () => {
    setCountdown(secondsUntil(phaseTargetAt));
  };

  syncCountdown();

  const timer = window.setInterval(syncCountdown, 500);

  return () => window.clearInterval(timer);
}, [phase, phaseTargetAt, isWaitingForNextRound]);

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

useEffect(() => {
  if (!gameSoundEnabled) return;
  if (!roomAudioUnlockedRef.current) return;

  const soundRoundId = roundId || "boot";

  const phaseSoundEvent: SixAnimalSoundEvent | null =
    phase === "loading" || isWaitingForNextRound
      ? "loading"
      : phase === "betting"
        ? "betting-round"
        : phase === "closed"
          ? "bets-closed"
          : null;

  if (!phaseSoundEvent) return;

  const soundKey = `${phaseSoundEvent}:${soundRoundId}:${
    isWaitingForNextRound ? "waiting" : "live"
  }`;

  if (lastPhaseSoundKeyRef.current === soundKey) return;

  lastPhaseSoundKeyRef.current = soundKey;
  playRoomSound(phaseSoundEvent);
}, [phase, roundId, isWaitingForNextRound, gameSoundEnabled]);

useEffect(() => {
  return () => {
    if (resultRevealTimerRef.current) {
      window.clearTimeout(resultRevealTimerRef.current);
    }

    if (settlementMomentTimerRef.current) {
      window.clearTimeout(settlementMomentTimerRef.current);
    }

    if (backgroundMusicFadeTimerRef.current) {
      window.clearInterval(backgroundMusicFadeTimerRef.current);
      backgroundMusicFadeTimerRef.current = null;
    }

    if (backgroundMusicAudioRef.current) {
      backgroundMusicAudioRef.current.pause();
      backgroundMusicAudioRef.current = null;
    }
  };
}, []);

useEffect(() => {
  try {
    const storedValue = window.localStorage.getItem(
      ROOM_BACKGROUND_MUSIC_MUTED_STORAGE_KEY
    );

    if (storedValue === "true") {
      setIsBackgroundMusicMuted(true);
    }
  } catch {
    // Keep preference loading non-blocking.
  }
}, []);

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
  playRoomSound("settlement-round");

  settlementMomentTimerRef.current = null;
}, SETTLEMENT_POPUP_DELAY_MS);

    if (resultRevealTimerRef.current) {
      window.clearTimeout(resultRevealTimerRef.current);
    }

    resultRevealTimerRef.current = window.setTimeout(() => {
  const completedMatchCount = activeBet
    ? resultNames.filter((item) => item === activeBet.animalNameMm).length
    : 0;

void completedMatchCount;

  // Important:
  // In live-room mode, the browser does not settle the round,
  // does not update backend result, and does not force phase = result.
  // Backend cron + advance_six_animal_room controls result timing.
  resultRevealTimerRef.current = null;
}, RESULT_REVEAL_DELAY_MS);
  }

  function handleDiceDrop(
  dieNumber: number,
  payloadRoundId?: string | null
) {
  if (
    !payloadRoundId ||
    payloadRoundId !== visualActiveRoundIdRef.current ||
    payloadRoundId !== roundIdRef.current
  ) {
    return;
  }

  void dieNumber;
  playRoomSound("dice-drop");
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
      playRoomSound("result-reveal");
      lastDiceSoundCountRef.current = resultNames.length;
    }

    setDiceResult(resultNames);
  }
  
function handleSelectAnimal(animal: SixAnimalKey) {
  if (!canEditBet) return;

  if (betMode === "pair") {
    setSelectedPairAnimals((currentAnimals) => {
      if (currentAnimals.includes(animal)) {
        return currentAnimals.filter((item) => item !== animal);
      }

      if (currentAnimals.length >= 2) {
        return [currentAnimals[1], animal];
      }

      return [...currentAnimals, animal];
    });

    return;
  }

  setSelectedAnimal(animal);
}

function handleBetModeChange(nextMode: BetMode) {
  if (!canEditBet) return;

  setBetMode(nextMode);
}
  function clampBetAmount(amount: number) {
  if (!canAffordMinBet) return SIX_ANIMAL_RULES.minBet;

  return Math.min(
    Math.max(SIX_ANIMAL_RULES.minBet, amount),
    maxPlayableBetAmount
  );
}

function setSafeBetAmount(amount: number) {
  if (!canEditBet) return;
  setBetAmount(String(clampBetAmount(amount)));
}

function handleQuickAmountSelect(amount: number) {
  setSafeBetAmount(amount);
}

function handleIncreaseBetAmount() {
  setSafeBetAmount(numericBetAmount + BET_AMOUNT_STEP);
}

function handleDecreaseBetAmount() {
  setSafeBetAmount(numericBetAmount - BET_AMOUNT_STEP);
}

async function handlePlaceBet() {
  if (isSubmittingBetRef.current) return;
  if (!isBetValid || !roundId) return;

  isSubmittingBetRef.current = true;

  const placedAmount = numericBetAmount;

  joinedRoundIdRef.current = roundId;
  setJoinedRoundId(roundId);

  if (isPairBetMode) {
    if (selectedPairOptions.length !== 2) {
      isSubmittingBetRef.current = false;
      return;
    }

    const pairAnimalOne = selectedPairOptions[0];
    const pairAnimalTwo = selectedPairOptions[1];

    const { data, error } = await supabase.rpc("place_six_animal_pair_bet", {
      p_round_id: roundId,
      p_animal_1: pairAnimalOne.key,
      p_animal_2: pairAnimalTwo.key,
      p_amount: placedAmount,
    });

    const response = data as {
      success?: boolean;
      error?: string;
      animal?: SixAnimalKey;
      animal_2?: SixAnimalKey | null;
      new_balance?: number;
      total_pair_amount?: number;
    } | null;

    if (error || response?.success === false) {
      console.error("Pair bet rejected:", error?.message || response?.error);
      isSubmittingBetRef.current = false;
      return;
    }

    const backendAnimalOne = response?.animal ?? pairAnimalOne.key;
    const backendAnimalTwo = response?.animal_2 ?? pairAnimalTwo.key;

    const normalizedAnimalOne = SIX_ANIMAL_OPTIONS.find(
      (animal) => animal.key === backendAnimalOne
    );
    const normalizedAnimalTwo = SIX_ANIMAL_OPTIONS.find(
      (animal) => animal.key === backendAnimalTwo
    );

    if (!normalizedAnimalOne || !normalizedAnimalTwo) {
      isSubmittingBetRef.current = false;
      return;
    }

    const nextPairAmount = Number(
      response?.total_pair_amount ?? placedAmount
    );

    setActiveBets((currentBets) => {
      const pairKey = getPairKey(
        normalizedAnimalOne.key,
        normalizedAnimalTwo.key
      );

      const existingBet = currentBets.find(
        (bet) =>
          bet.betType === "pair" &&
          bet.animalKey2 &&
          getPairKey(bet.animalKey, bet.animalKey2) === pairKey
      );

      if (existingBet) {
        return currentBets.map((bet) =>
          bet.betType === "pair" &&
          bet.animalKey2 &&
          getPairKey(bet.animalKey, bet.animalKey2) === pairKey
            ? {
                ...bet,
                amount: nextPairAmount,
              }
            : bet
        );
      }

      return [
        ...currentBets,
        {
          betType: "pair",
          animalKey: normalizedAnimalOne.key,
          animalKey2: normalizedAnimalTwo.key,
          animalNameMm: normalizedAnimalOne.nameMm,
          animalNameMm2: normalizedAnimalTwo.nameMm,
          amount: nextPairAmount,
          roundNumber,
        },
      ];
    });

    playRoomSound("bet-locked");

    if (response?.new_balance !== undefined) {
      setWalletBalance(response.new_balance);
    }

    isSubmittingBetRef.current = false;
    return;
  }

  if (!selectedOption) {
    isSubmittingBetRef.current = false;
    return;
  }

  const placedAnimal = selectedOption;

  const { data, error } = await supabase.rpc("place_six_animal_bet", {
    p_round_id: roundId,
    p_animal: placedAnimal.key,
    p_amount: placedAmount,
  });

  const response = data as {
    success?: boolean;
    error?: string;
    new_balance?: number;
    total_animal_amount?: number;
  } | null;

  if (error || response?.success === false) {
    console.error("Bet rejected:", error?.message || response?.error);
    isSubmittingBetRef.current = false;
    return;
  }

  const nextAnimalAmount = Number(
    response?.total_animal_amount ?? placedAmount
  );

  setActiveBets((currentBets) => {
    const existingBet = currentBets.find(
      (bet) => bet.betType === "single" && bet.animalKey === placedAnimal.key
    );

    if (existingBet) {
      return currentBets.map((bet) =>
        bet.betType === "single" && bet.animalKey === placedAnimal.key
          ? {
              ...bet,
              amount: nextAnimalAmount,
            }
          : bet
      );
    }

    return [
      ...currentBets,
      {
        betType: "single",
        animalKey: placedAnimal.key,
        animalNameMm: placedAnimal.nameMm,
        amount: nextAnimalAmount,
        roundNumber,
      },
    ];
  });

  playRoomSound("bet-locked");

  if (response?.new_balance !== undefined) {
    setWalletBalance(response.new_balance);
  }

  isSubmittingBetRef.current = false;
}

  return (
    <main
  onPointerDownCapture={unlockRoomAudio}
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
<RoomIntroOverlay
  roomBackground={ROOM_BACKGROUND}
  isWaitingForNextRound={isWaitingForNextRound}
  countdown={displayCountdown}
  phase={phase}
  exitDoorAsset={ROYAL_EXIT_DOOR_BUTTON}
  onExitClick={() => setShowExitConfirm(true)}
/>
) : null}

{showExitConfirm ? (
  <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/72 px-5 backdrop-blur-sm">
    <div className="relative w-full max-w-[340px] overflow-hidden rounded-[1.75rem] border border-amber-300/28 bg-[linear-gradient(145deg,rgba(45,7,3,0.96),rgba(8,1,1,0.94),rgba(54,12,5,0.9))] p-5 text-center shadow-2xl shadow-black/80">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(251,191,36,0.18),transparent_62%)]" />
      <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-amber-200/80 to-transparent" />

      <div className="relative z-10">
<div className="mx-auto -mb-1 -mt-4 flex h-[112px] w-[128px] items-center justify-center overflow-visible">
  <img
    src={ROYAL_EXIT_DOOR_BUTTON}
    alt=""
    className="h-[150px] w-[150px] max-w-none object-contain drop-shadow-[0_0_22px_rgba(251,191,36,0.5)]"
  />
</div>

        <p className="mt-3 text-[10px] font-black uppercase tracking-[0.3em] text-amber-200/65">
          Leave Room
        </p>

        <p className="mt-2 text-lg font-black text-white">
          Return to Lobby?
        </p>

        <p className="mt-2 text-xs font-bold leading-5 text-white/55">
         Your placed bets stay active. You can return to the lobby now.
        </p>

        <div className="mt-5 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setShowExitConfirm(false)}
            className="rounded-xl border border-amber-300/18 bg-black/35 px-4 py-3 text-sm font-black text-amber-100 transition active:scale-[0.96]"
          >
            Stay
          </button>

          <button
            type="button"
            onClick={handleLobbyClick}
            className="rounded-xl border border-amber-100/55 bg-[linear-gradient(135deg,#facc15,#d6a937,#8a5b12)] px-4 py-3 text-sm font-black text-black shadow-[0_0_16px_rgba(251,191,36,0.16)] transition active:scale-[0.96]"
          >
            Leave
          </button>
        </div>
      </div>
    </div>
  </div>
) : null}

      <div className="relative z-10 flex h-full min-h-0 flex-col overflow-hidden px-2 py-2 sm:px-4">
        <header className="z-20 flex shrink-0 items-center justify-between rounded-2xl border border-amber-300/24 bg-[linear-gradient(135deg,rgba(45,7,3,0.9),rgba(12,2,2,0.78),rgba(70,22,5,0.62))] px-3 py-2 shadow-[0_0_24px_rgba(127,29,29,0.28),inset_0_1px_0_rgba(251,191,36,0.12)] backdrop-blur-md">
<button
  type="button"
  onClick={() => setShowExitConfirm(true)}
  aria-label="Exit to lobby"
  className="group flex h-[56px] w-[96px] items-center justify-start gap-1"
>
  <span className="sr-only">Exit to lobby</span>

  <span className="relative h-[56px] w-[52px] overflow-visible">
    <img
      src={ROYAL_EXIT_DOOR_BUTTON}
      alt=""
      className="absolute left-1/2 top-1/2 h-[86px] w-[86px] -translate-x-1/2 -translate-y-1/2 scale-[2.05] object-contain drop-shadow-[0_0_12px_rgba(251,191,36,0.48)] transition-transform duration-200 group-active:scale-[1.82]"
    />
  </span>

  <span className="relative z-10 text-xs font-black text-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.25)] transition-colors group-active:text-amber-100">
    Exit
  </span>
</button>

<div className="text-center">
  <p className="text-[10px] font-black uppercase tracking-[0.34em] text-amber-200 drop-shadow-[0_0_10px_rgba(251,191,36,0.28)]">
    Nagani
  </p>
  <p className="mt-0.5 text-[13px] font-black tracking-[0.08em] text-white drop-shadow-[0_0_12px_rgba(251,191,36,0.22)]">
    ၆ ကောင်ဂျင်
  </p>
</div>

<div className="flex w-[96px] flex-col items-end gap-1.5">
  <div className="flex w-[82px] justify-center rounded-full border border-amber-300/24 bg-[linear-gradient(135deg,rgba(251,191,36,0.18),rgba(120,53,15,0.22))] px-3 py-1 text-[10px] font-black text-amber-100 shadow-inner shadow-black/30">
    Live
  </div>

  <button
onClick={handleBackgroundMusicToggle}
aria-label={
  isBackgroundMusicMuted
    ? "Turn background music on"
    : "Turn background music off"
}
title={isBackgroundMusicMuted ? "Music Off" : "Music On"}
    className={`group relative flex h-11 w-11 items-center justify-center rounded-full border shadow-[0_0_14px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.08)] transition duration-200 active:scale-[0.94] ${
      isBackgroundMusicMuted
        ? "border-red-300/30 bg-[linear-gradient(135deg,rgba(127,29,29,0.9),rgba(69,10,10,0.85))] text-red-100"
        : "border-emerald-300/30 bg-[linear-gradient(135deg,rgba(6,78,59,0.92),rgba(6,95,70,0.84))] text-emerald-100"
    }`}
  >
<span className="sr-only">
  {isBackgroundMusicMuted
    ? "Turn background music on"
    : "Turn background music off"}
</span>

    {!isBackgroundMusicMuted ? (
      <>
        <span className="pointer-events-none absolute inset-0 rounded-full bg-emerald-300/10 blur-[2px] transition-opacity duration-200 group-hover:opacity-100" />

        <svg
          viewBox="0 0 24 24"
          className="relative z-10 h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M5 9v6h4l5 4V5l-5 4H5z" />
          <path className="animate-pulse" d="M16 9.5a4.5 4.5 0 0 1 0 5" />
          <path className="animate-pulse" d="M18.5 7a8 8 0 0 1 0 10" />
        </svg>
      </>
    ) : (
      <>
        <span className="pointer-events-none absolute inset-0 rounded-full bg-red-300/10 blur-[2px]" />

        <svg
          viewBox="0 0 24 24"
          className="relative z-10 h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M5 9v6h4l5 4V5l-5 4H5z" />
          <path d="M4 4l16 16" />
        </svg>
      </>
    )}
  </button>
</div>
        </header>

        <section className="mt-2 flex min-h-0 flex-1 flex-col overflow-hidden rounded-[1.65rem] border border-amber-300/12 bg-[linear-gradient(145deg,rgba(45,7,3,0.62),rgba(10,1,1,0.52),rgba(65,18,5,0.34))] p-2 shadow-[0_18px_58px_rgba(0,0,0,0.52),inset_0_0_42px_rgba(0,0,0,0.34),inset_0_1px_0_rgba(251,191,36,0.08)] backdrop-blur-[2px]">
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
<div className="grid grid-cols-[0.92fr_1.08fr] gap-2">
  <div className="flex min-h-[68px] flex-col items-center justify-center rounded-2xl border border-emerald-300/20 bg-emerald-400/10 px-3 py-2 text-center">
    <p className="text-[9px] font-black uppercase tracking-[0.25em] text-amber-200/60">
      Timer
    </p>
    <p className="mt-0.5 text-2xl font-black leading-none text-white">
      {timerLabel}
    </p>
  </div>

  <div className="flex min-h-[68px] flex-col items-center justify-center rounded-2xl border border-emerald-300/20 bg-emerald-400/10 px-3 py-2 text-center">
    <p className="text-[9px] font-black uppercase tracking-[0.25em] text-emerald-100/55">
      Balance
    </p>
    <p className="mt-0.5 text-lg font-black leading-none text-emerald-100">
      {formatMMK(walletBalance)} MMK
    </p>
  </div>
</div>
              )}
            </div>
          ) : null}

<div
  className="relative mt-2 min-h-0 flex-1 overflow-visible rounded-[1.55rem] border border-amber-300/10 bg-black/46 shadow-[inset_0_0_48px_rgba(0,0,0,0.62),inset_0_0_34px_rgba(251,191,36,0.035),0_18px_46px_rgba(0,0,0,0.35)]"
  style={{
    backgroundImage: `linear-gradient(to bottom, rgba(5,1,1,0.34), rgba(18,2,2,0.3), rgba(0,0,0,0.68)), url(${ROOM_BACKGROUND})`,
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
                  Dice starting · {displayCountdown}s
                </p>
              </div>
            ) : null}

{showFloatingResultBoard ? (
<FloatingResultBoard
  diceResult={diceResult}
  activeBets={activeBets}
  showFinalResultPanel={showFinalResultPanel}
  isResultPhaseVisualGuard={isResultPhaseVisualGuard}
  isRollingPhase={phase === "rolling"}
  isResultWin={isResultWin}
  animalAssets={ANIMAL_ASSETS}
/>
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

{showSettlementSheet ? (
  <SettlementPopup
    settlementBets={activeBetResults.map((item) => ({
      betType: item.bet.betType,
      animalKey: item.bet.animalKey,
      animalKey2: item.bet.animalKey2 ?? null,
      amount: item.bet.amount,
      matchCount: item.matchCount,
      payout: item.payout,
    }))}
    totalBetAmount={totalActiveBetAmount}
    displayPayoutAmount={displayPayoutAmount}
    netResultLabel={netResultLabel}
    resultStatusLabel={resultStatusLabel}
    isResultWin={isResultWin}
    animalAssets={ANIMAL_ASSETS}
  />
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
  onDiceDrop={handleDiceDrop}
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
  betMode={betMode}
  selectedAnimal={selectedAnimal}
  selectedPairAnimals={selectedPairAnimals}
  activeBets={activeBets}
  canEditBet={canEditBet}
  canPlaceBet={isBetValid}
  numericBetAmount={numericBetAmount}
  animalAssets={ANIMAL_ASSETS}
  onBetModeChange={handleBetModeChange}
  onSelectAnimal={handleSelectAnimal}
  onQuickAmountSelect={handleQuickAmountSelect}
  onIncreaseAmount={handleIncreaseBetAmount}
  onDecreaseAmount={handleDecreaseBetAmount}
  onPlaceBet={handlePlaceBet}
/>

          </div>
        </section>
      </div>
    </main>
  );
}