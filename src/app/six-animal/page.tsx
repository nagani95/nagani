//src>app>six-animal>page.tsx

"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import SixAnimalBettingSheet from "@/components/games/six-animal/SixAnimalBettingSheet";
import ThreeDiceSequenceController from "@/components/games/six-animal/ThreeDiceSequenceController";
import type {
  MountedDiceRackMode,
  ThreeDiceRoundPayload,
} from "@/components/games/six-animal/ThreeDicePhysicsStage";
import SettlementPopup from "@/components/games/six-animal/SettlementPopup";
import FloatingResultBoard from "@/components/games/six-animal/FloatingResultBoard";
import RoyalTableChamberBackdrop from "@/components/games/six-animal/RoyalTableChamberBackdrop";
import RoyalRoomTopBar from "@/components/games/six-animal/RoyalRoomTopBar";
import RoomIntroOverlay from "@/components/games/six-animal/RoomIntroOverlay";
import SixAnimalExitConfirm from "@/components/games/six-animal/SixAnimalExitConfirm";
import SixAnimalLeavingRoomOverlay from "@/components/games/six-animal/SixAnimalLeavingRoomOverlay";
import SixAnimalBettingCommandPanel from "@/components/games/six-animal/SixAnimalBettingCommandPanel";
import SixAnimalRoomWaitLayer from "@/components/games/six-animal/SixAnimalRoomWaitLayer";
import SixAnimalRoomBootGate from "@/components/games/six-animal/SixAnimalRoomBootGate";
import { SIX_ANIMAL_OPTIONS, SIX_ANIMAL_RULES } from "@/lib/gameRules";
import { createClient } from "@/lib/supabase/client";
import type { SixAnimalKey } from "@/types/games";
import { diceSoundDirector } from "@/components/games/six-animal/sound/DiceSoundDirector";
import { useSixAnimalFullscreenControls } from "@/components/games/six-animal/hooks/useSixAnimalFullscreenControls";
import { useSixAnimalBackgroundMusic } from "@/components/games/six-animal/hooks/useSixAnimalBackgroundMusic";
import {
  ANIMAL_ASSETS,
  BET_AMOUNT_STEP,
  NAGANI_LOGO,
  RESULT_REVEAL_DELAY_MS,
  ROOM_BACKGROUND,
  ROOM_SOUND_ENABLED,
  ROOM_SOUND_VOLUME,
  ROYAL_EXIT_DOOR_BUTTON,
  SETTLEMENT_POPUP_DELAY_MS,
  SIX_ANIMAL_RESULT_SOUND_SRC,
  SIX_ANIMAL_RESULT_SOUND_VOLUME,
  SIX_ANIMAL_ROOM_UUID,
  SIX_ANIMAL_SOUND_SRC,
  SIX_ANIMAL_SOUND_VOLUME,
  USE_BACKEND_RESULT_FOR_ROOM_UI,
  USE_V1_AUTO_VISIBLE_ROOM_RESULT,
  convertBackendBetToActiveBet,
  formatMMK,
  getAnimalByNameMm,
  getLiveRoundCountdown,
  getPairKey,
  getRoundPhaseTargetAt,
  getWaitingForNextBettingTargetAt,
  getVisibleDicePayloadResultNames,
  mapLiveRoundPhase,
  secondsUntil,
  type ActiveBet,
  type BetMode,
  type LiveSixAnimalBet,
  type LiveSixAnimalRound,
  type RoundPhase,
  type SixAnimalSoundEvent,
  type VisualDiceStatus,
} from "@/components/games/six-animal/sixAnimalRoomHelpers";

const ROYAL_CHAMBER_WALLPAPER_SRC =
  "/assets/nagani/six-animal/room/royal-chamber-wallpaper-v1.jpg";

const ROYAL_CHAMBER_VIDEO_SRC =
  "/assets/nagani/six-animal/room/royal-chamber-loop-v1.mp4";

export default function SixAnimalPage() {
  const router = useRouter();
  // Centralize the Supabase client to prevent hook errors and memory leaks
  const [supabase] = useState(() => createClient());
  
  const [walletBalance, setWalletBalance] = useState<number>(0);
const [walletBonusBalance, setWalletBonusBalance] = useState<number>(0);
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
const {
  isFullscreenMode,
  canUseFullscreen,
  handleFullscreenToggle,
  exitFullscreenIfNeeded,
} = useSixAnimalFullscreenControls();

const gameSoundEnabled = ROOM_SOUND_ENABLED;
  const [showRoomIntro, setShowRoomIntro] = useState(true);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [activeBets, setActiveBets] = useState<ActiveBet[]>([]);
  const [showSettlementMoment, setShowSettlementMoment] = useState(false);
const [settlementWaitingRoundId, setSettlementWaitingRoundId] =
  useState<string | null>(null);
  
  // --- QUEUING STATES ---
  const [isWaitingForNextRound, setIsWaitingForNextRound] = useState(false);
const [isQuitting, setIsQuitting] = useState(false);
const [joinedRoundId, setJoinedRoundId] = useState<string | null>(null);

const resultRevealTimerRef = useRef<number | null>(null);
const settlementMomentTimerRef = useRef<number | null>(null);
const localRollingStartTimerRef = useRef<number | null>(null);
const lastDiceSoundCountRef = useRef(0);
const roomAudioUnlockedRef = useRef(false);
const [isRoomAudioUnlocked, setIsRoomAudioUnlocked] = useState(false);
const lastInRoomWaitAnnouncementKeyRef = useRef<string | null>(null);
const hasPlayedLoadingAnnouncementRef = useRef(false);
const roomAudioPoolRef = useRef<
  Partial<Record<SixAnimalSoundEvent, HTMLAudioElement>>
>({});
const resultAnimalAudioPoolRef = useRef<
  Partial<Record<SixAnimalKey, HTMLAudioElement>>
>({});
const lastPhaseSoundKeyRef = useRef<string | null>(null);
const lastUrgentCountdownSecondRef = useRef<number | null>(null);
const {
  isBackgroundMusicMuted,
  handleBackgroundMusicToggle,
  syncBackgroundMusic,
} = useSixAnimalBackgroundMusic({
  isRoomAudioUnlockedRef: roomAudioUnlockedRef,
});

  // Refs for Realtime Websocket closures to prevent stale state
const phaseRef = useRef(phase);
const roundIdRef = useRef(roundId);
const isQuittingRef = useRef(isQuitting);
const joinedRoundIdRef = useRef<string | null>(null);
const shouldPlayLiveDiceSequenceRef = useRef(false);
const diceResultRef = useRef<string[]>([]);
const serverRngResultsRef = useRef<string[]>([]);
const isVisualDiceCompleteRef = useRef(false);
const visualDiceStatusRef = useRef<VisualDiceStatus>("idle");

const visualCompleteRoundIdRef = useRef<string | null>(null);
const visualStartedRoundIdRef = useRef<string | null>(null);
const visualActiveRoundIdRef = useRef<string | null>(null);
const settlementWaitingRoundIdRef = useRef<string | null>(null);
const showSettlementMomentRef = useRef(false);
const isSubmittingBetRef = useRef(false);
const showRoomIntroRef = useRef(true);
const isWaitingForNextRoundRef = useRef(false);

function clearVisibleDiceRoundState() {
  diceSoundDirector.stopAll();

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

lastDiceSoundCountRef.current = 0;
}

function getBackendResultNames(revealCount = SIX_ANIMAL_RULES.diceCount) {
  return serverRngResultsRef.current
    .slice(0, revealCount)
    .map((animalKey) =>
      SIX_ANIMAL_OPTIONS.find((animal) => animal.key === animalKey)
    )
    .filter((animal): animal is (typeof SIX_ANIMAL_OPTIONS)[number] =>
      Boolean(animal)
    )
    .map((animal) => animal.nameMm);
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
serverRngResultsRef.current = backendResultKeys;

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

const hasJoinedCurrentBrowserRound = joinedRoundIdRef.current === round.id;
const isJoinableBettingRound = nextPhase === "betting" && nextCountdown > 0;

if (
  isJoinableBettingRound &&
  (phaseRef.current === "loading" ||
    isWaitingForNextRoundRef.current ||
    showRoomIntroRef.current)
) {
  joinedRoundIdRef.current = round.id;
  setJoinedRoundId(round.id);

  setIsWaitingForNextRound(false);
  isWaitingForNextRoundRef.current = false;

  setShowRoomIntro(false);
  showRoomIntroRef.current = false;

  setRoundId(round.id);
  setRoundNumber(round.round_number);
  setPhase("betting");
  phaseRef.current = "betting";
  setPhaseTargetAt(nextTargetAt);
  setCountdown(nextCountdown);
}

const backendBets = await fetchCurrentUserBetsForRound(round.id);
const restoredActiveBets = backendBets
  .map((bet) => convertBackendBetToActiveBet(bet, round.round_number))
  .filter((bet): bet is ActiveBet => Boolean(bet));

const isRefreshOrLateJoinToInProgressRound =
  !isJoinableBettingRound && !hasJoinedCurrentBrowserRound;

if (isRefreshOrLateJoinToInProgressRound) {
  clearVisibleDiceRoundState();

  setShouldPlayLiveDiceSequence(false);
  shouldPlayLiveDiceSequenceRef.current = false;

  setRoundId(round.id);
  setRoundNumber(round.round_number);

  const waitingTargetAt = getWaitingForNextBettingTargetAt(round);

  setPhase(nextPhase);
  phaseRef.current = nextPhase;

  setPhaseTargetAt(waitingTargetAt);
  setRollingStartedAt(null);
  setCountdown(secondsUntil(waitingTargetAt));

  setIsWaitingForNextRound(true);
  setShowRoomIntro(false);

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
  setShowRoomIntro(false);
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
  const backendResultKeys = round.result_animals || [];

  const canPrepareShadowDice =
    Boolean(round.rolling_starts_at) &&
    backendResultKeys.length === SIX_ANIMAL_RULES.diceCount;

  if (!canPrepareShadowDice) {
    setServerRngResults(backendResultKeys);
    serverRngResultsRef.current = backendResultKeys;

    setShouldPlayLiveDiceSequence(false);
    shouldPlayLiveDiceSequenceRef.current = false;

    clearVisibleDiceRoundState();
    return;
  }

if (USE_V1_AUTO_VISIBLE_ROOM_RESULT) {
  setServerRngResults(backendResultKeys);
  serverRngResultsRef.current = backendResultKeys;

  setRollingStartedAt(round.rolling_starts_at);

  // If local V1 dice already started for this round, do not let
  // repeated CLOSED polling stop the dice animation.
  if (visualStartedRoundIdRef.current === round.id) {
    return;
  }

  setVisualDiceStatus("idle");
  visualDiceStatusRef.current = "idle";

  setShouldPlayLiveDiceSequence(false);
  shouldPlayLiveDiceSequenceRef.current = false;

  return;
}

  if (visualStartedRoundIdRef.current !== round.id) {
    clearVisibleDiceRoundState();

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

  setServerRngResults(backendResultKeys);
  serverRngResultsRef.current = backendResultKeys;

  setRollingStartedAt(round.rolling_starts_at);

  setVisualDiceStatus("playing");
  visualDiceStatusRef.current = "playing";

  setShouldPlayLiveDiceSequence(true);
  shouldPlayLiveDiceSequenceRef.current = true;

  return;
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
serverRngResultsRef.current = backendResultKeys;

setRollingStartedAt(round.rolling_starts_at);;
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
serverRngResultsRef.current = backendResultKeys;

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
serverRngResultsRef.current = serverRngResults;
isVisualDiceCompleteRef.current = isVisualDiceComplete;
  visualDiceStatusRef.current = visualDiceStatus;
visualCompleteRoundIdRef.current = visualCompleteRoundId;
visualActiveRoundIdRef.current = visualActiveRoundId;
settlementWaitingRoundIdRef.current = settlementWaitingRoundId;
showSettlementMomentRef.current = showSettlementMoment;
showRoomIntroRef.current = showRoomIntro;
isWaitingForNextRoundRef.current = isWaitingForNextRound;
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
  showSettlementMoment,
  showRoomIntro,
  isWaitingForNextRound,
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

const playableWalletBalance = walletBalance + walletBonusBalance;

const walletStepAmount =
  Math.floor(Math.max(0, playableWalletBalance) / BET_AMOUNT_STEP) *
  BET_AMOUNT_STEP;

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

const matchCount = activeBetResults[0]?.matchCount ?? 0;

const displayPayoutAmount =
  phase === "result"
    ? activeBetResults.reduce((sum, item) => sum + item.payout, 0)
    : 0;

const displayNetAmount =
  hasActiveBets && phase === "result"
    ? displayPayoutAmount - totalActiveBetAmount
    : 0;

  const displayCountdown = Math.max(0, countdown);
    const isUrgentBettingCountdown =
    phase === "betting" && displayCountdown > 0 && displayCountdown <= 4;

  const timerLabel =
    phase === "rolling"
? "လှိမ့်နေသည်"
: phase === "closed" && displayCountdown <= 0
  ? "စတင်နေသည်"
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

const showPendingResultBoard =
  (phase === "closed" &&
    serverRngResults.length === SIX_ANIMAL_RULES.diceCount) ||
  phase === "rolling" ||
  isResultPhaseVisualGuard;

const showRollingResultPanel = showPendingResultBoard;
const showResultBoardPanel = showRollingResultPanel || showFinalResultPanel;

  const showTopPanel = phase === "betting";
  const showFloatingResultBoard = showResultBoardPanel;
const showSettlementSheet =
  showFinalResultPanel && showSettlementMoment && hasActiveBets;

const fallbackVisualRoundId =
  roundId && (phase === "closed" || phase === "rolling" || isResultPhaseVisualGuard)
    ? roundId
    : null;

const heldVisualRoundId =
  visualActiveRoundId ??
  fallbackVisualRoundId ??
  (showFinalResultPanel ? visualCompleteRoundId : null);

const canPrepareShadowDice =
  phase === "closed" &&
  Boolean(roundId) &&
  Boolean(rollingStartedAt) &&
  serverRngResults.length === SIX_ANIMAL_RULES.diceCount;

const canPlayShadowDice =
  shouldPlayLiveDiceSequence &&
  visualDiceStatus === "playing" &&
  (phase === "rolling" || isResultPhaseVisualGuard);

const canPreloadShadowDice =
  !USE_V1_AUTO_VISIBLE_ROOM_RESULT && canPrepareShadowDice;

const shouldEnableDiceController =
  !showFinalResultPanel && (canPreloadShadowDice || canPlayShadowDice);

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
? "ပွဲရလဒ်"
: isResultWin
  ? "အနိုင်ရပါသည်"
  : "မကိုက်ပါ";

  const netResultLabel =
    hasActiveBets && phase === "result"
      ? `${displayNetAmount > 0 ? "+" : "-"}${formatMMK(
          Math.abs(displayNetAmount)
        )} ကျပ်`
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

function getResultAnimalAudio(animalKey: SixAnimalKey) {
  const existingAudio = resultAnimalAudioPoolRef.current[animalKey];

  if (existingAudio) {
    return existingAudio;
  }

  const audio = new Audio(SIX_ANIMAL_RESULT_SOUND_SRC[animalKey]);
  audio.preload = "auto";
  audio.volume = SIX_ANIMAL_RESULT_SOUND_VOLUME[animalKey] ?? ROOM_SOUND_VOLUME;

  resultAnimalAudioPoolRef.current[animalKey] = audio;

  return audio;
}

function playResultAnimalSound(animalKey: SixAnimalKey) {
  if (!gameSoundEnabled) return;
  if (!roomAudioUnlockedRef.current) return;

  const audio = getResultAnimalAudio(animalKey);

  try {
    audio.currentTime = 0;
    void audio.play().catch(() => {
      // Browser may still block audio on some devices.
    });
  } catch {
    // Animal result sound must never block game flow.
  }
}

function playResultAnimalSoundByNameMm(nameMm: string) {
  const animal = getAnimalByNameMm(nameMm);

  if (!animal) return;

  playResultAnimalSound(animal.key);
}

function playNewResultAnimalSounds(resultNames: string[]) {
  if (resultNames.length <= lastDiceSoundCountRef.current) return;

  const newlyRevealedResultNames = resultNames.slice(
    lastDiceSoundCountRef.current
  );

  newlyRevealedResultNames.forEach((nameMm, index) => {
    window.setTimeout(() => {
      playResultAnimalSoundByNameMm(nameMm);
    }, index * 180);
  });

  lastDiceSoundCountRef.current = resultNames.length;
}

function handleExitButtonClick() {
  playRoomSound("exit-button");
  setShowExitConfirm(true);
}

function playInRoomWaitAnnouncement(announcementKey?: string) {
  if (!gameSoundEnabled) return false;
  if (!roomAudioUnlockedRef.current) return false;
  if (showRoomIntroRef.current) return false;
  if (!isWaitingForNextRoundRef.current) return false;
  if (hasPlayedLoadingAnnouncementRef.current) return false;

  const safeAnnouncementKey =
    announcementKey ??
    [
      roundIdRef.current || "room",
      phaseRef.current,
      phaseTargetAt ?? "no-target",
    ].join(":");

  if (lastInRoomWaitAnnouncementKeyRef.current === safeAnnouncementKey) {
    return false;
  }

  lastInRoomWaitAnnouncementKeyRef.current = safeAnnouncementKey;
  hasPlayedLoadingAnnouncementRef.current = true;
  playRoomSound("loading");

  return true;
}

function playCurrentPhaseSound() {
  const currentPhase = phaseRef.current;

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

  if (roomAudioUnlockedRef.current) {
    setIsRoomAudioUnlocked(true);
    return;
  }

  roomAudioUnlockedRef.current = true;
  setIsRoomAudioUnlocked(true);
  void diceSoundDirector.unlock();

  (Object.keys(SIX_ANIMAL_SOUND_SRC) as SixAnimalSoundEvent[]).forEach(
    (eventName) => {
      getRoomAudio(eventName).load();
    }
  );

  (Object.keys(SIX_ANIMAL_RESULT_SOUND_SRC) as SixAnimalKey[]).forEach(
  (animalKey) => {
    getResultAnimalAudio(animalKey).load();
  }
);

  playCurrentPhaseSound();
  syncBackgroundMusic();
}

function handleStayInRoomClick() {
  playRoomSound("ui-click");
  setShowExitConfirm(false);
}

async function handleLobbyClick() {
  playRoomSound("ui-click");
  setShowExitConfirm(false);
  await exitFullscreenIfNeeded();
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
const {
  data: { user },
} = await supabase.auth.getUser();

if (!user) {
  router.replace("/login");
  return;
}

const { data: wallet } = await supabase
  .from("wallets")
  .select("balance, bonus_balance")
  .eq("profile_id", user.id)
  .maybeSingle();

const fetchedWalletBalance = Number(wallet?.balance ?? 0);
const fetchedWalletBonusBalance = Number(wallet?.bonus_balance ?? 0);
const fetchedPlayableWalletBalance =
  fetchedWalletBalance + fetchedWalletBonusBalance;

setWalletBalance(fetchedWalletBalance);
setWalletBonusBalance(fetchedWalletBonusBalance);

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

if (fetchedPlayableWalletBalance < SIX_ANIMAL_RULES.minBet) {
  const existingRoundBets = activeRound
    ? await fetchCurrentUserBetsForRound(activeRound.id)
    : [];

  if (existingRoundBets.length === 0) {
    router.replace("/cashier");
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
  let pollTimer: number | null = null;

  const pollLatestRound = async () => {
    if (cancelled) return;
    await fetchLatestLiveRound();
  };

  const scheduleNextPoll = (delayMs: number) => {
    pollTimer = window.setTimeout(async () => {
      await pollLatestRound();

      if (cancelled) return;

      const shouldFastPoll =
        showRoomIntroRef.current ||
        phaseRef.current === "loading" ||
        isWaitingForNextRoundRef.current;

      scheduleNextPoll(shouldFastPoll ? 650 : 2000);
    }, delayMs);
  };

  void pollLatestRound();
  scheduleNextPoll(650);

  return () => {
    cancelled = true;

    if (pollTimer) {
      window.clearTimeout(pollTimer);
    }
  };
}, [supabase]);

useEffect(() => {
  if (phase === "loading") {
    setShowRoomIntro(true);
    return;
  }

  if (isWaitingForNextRound) {
    setShowRoomIntro(false);
    return;
  }

  if (phase === "betting") {
    setShowRoomIntro(false);
    return;
  }

  const introTimer = window.setTimeout(() => {
    setShowRoomIntro(false);
  }, 300);

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
  if (phase !== "betting") {
    lastUrgentCountdownSecondRef.current = null;
    return;
  }

  if (displayCountdown > 4 || displayCountdown <= 0) {
    lastUrgentCountdownSecondRef.current = null;
    return;
  }

  if (lastUrgentCountdownSecondRef.current === displayCountdown) return;

  lastUrgentCountdownSecondRef.current = displayCountdown;
  playRoomSound("countdown-hit");
}, [phase, displayCountdown, gameSoundEnabled]);

useEffect(() => {
  if (!gameSoundEnabled) return;
  if (!roomAudioUnlockedRef.current) return;

  const soundRoundId = roundId || "boot";

const phaseSoundEvent: SixAnimalSoundEvent | null =
  phase === "betting"
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
    diceSoundDirector.stopAll();

    if (resultRevealTimerRef.current) {
      window.clearTimeout(resultRevealTimerRef.current);
    }

    if (settlementMomentTimerRef.current) {
      window.clearTimeout(settlementMomentTimerRef.current);
    }
  };
}, []);

function hasWinningSettlementResult(resultNames: string[]) {
  if (activeBets.length === 0) return false;

  return activeBets.some((bet) => {
    if (bet.betType === "pair" && bet.animalNameMm2) {
      return (
        resultNames.includes(bet.animalNameMm) &&
        resultNames.includes(bet.animalNameMm2)
      );
    }

    return resultNames.includes(bet.animalNameMm);
  });
}

function playSettlementResultSound(resultNames: string[]) {
  if (activeBets.length === 0) return;

  playRoomSound(
    hasWinningSettlementResult(resultNames)
      ? "settlement-win"
      : "settlement-lose"
  );
}

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

 const resultNames = USE_BACKEND_RESULT_FOR_ROOM_UI
  ? getBackendResultNames(SIX_ANIMAL_RULES.diceCount)
  : getVisibleDicePayloadResultNames(payload, SIX_ANIMAL_RULES.diceCount);

  if (resultNames.length !== SIX_ANIMAL_RULES.diceCount) return;
  playNewResultAnimalSounds(resultNames);

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

  setVisualActiveRoundId(payloadRoundId);
  visualActiveRoundIdRef.current = payloadRoundId;

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
playSettlementResultSound(resultNames);

settlementMomentTimerRef.current = null;
  }, SETTLEMENT_POPUP_DELAY_MS);

  if (resultRevealTimerRef.current) {
    window.clearTimeout(resultRevealTimerRef.current);
  }

  resultRevealTimerRef.current = window.setTimeout(() => {
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

  diceSoundDirector.startDie(dieNumber);
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

  const revealCount = Math.min(
    payload.results.length,
    SIX_ANIMAL_RULES.diceCount
  );

const resultNames = USE_BACKEND_RESULT_FOR_ROOM_UI
  ? getBackendResultNames(revealCount)
  : getVisibleDicePayloadResultNames(payload, revealCount);

  playNewResultAnimalSounds(resultNames);

  diceResultRef.current = resultNames;
  setDiceResult(resultNames);
}
  
function handleSelectAnimal(animal: SixAnimalKey) {
  if (!canEditBet) return;

  playRoomSound("ui-click");

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

  playRoomSound("ui-click");
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
  if (!canEditBet) return;

  playRoomSound("ui-click");
  setSafeBetAmount(amount);
}

function handleIncreaseBetAmount() {
  if (!canEditBet) return;

  playRoomSound("ui-click");
  setSafeBetAmount(numericBetAmount + BET_AMOUNT_STEP);
}

function handleDecreaseBetAmount() {
  if (!canEditBet) return;

  playRoomSound("ui-click");
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
new_bonus_balance?: number;
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

if (response?.new_bonus_balance !== undefined) {
  setWalletBonusBalance(response.new_bonus_balance);
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
new_bonus_balance?: number;
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

if (response?.new_bonus_balance !== undefined) {
  setWalletBonusBalance(response.new_bonus_balance);
}
  isSubmittingBetRef.current = false;
}

function handleInvalidBetButtonClick() {
  const hasSelectedBetTarget = isPairBetMode
    ? selectedPairOptions.length === 2
    : Boolean(selectedAnimal);

  if (hasSelectedBetTarget) return;

  playRoomSound("bet-invalid");
}

const waitLayerAnnouncementKey =
  isWaitingForNextRound && !showRoomIntro
    ? [roundId || "room", phase, phaseTargetAt ?? "no-target"].join(":")
    : "";

  return (
    <SixAnimalRoomBootGate
      backgroundSrc={ROYAL_CHAMBER_WALLPAPER_SRC}
      logoSrc={NAGANI_LOGO}
    >
      <main
      onPointerDownCapture={unlockRoomAudio}
      className="relative isolate h-[100dvh] overflow-hidden bg-[#090202] text-[#fff3d0]"
style={{
  backgroundColor: "#090202",
}}
>
      <video
        data-nagani-room-video="true"
        className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover"
        src={ROYAL_CHAMBER_VIDEO_SRC}
        poster={ROYAL_CHAMBER_WALLPAPER_SRC}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      />


{isQuitting && !showRoomIntro ? <SixAnimalLeavingRoomOverlay /> : null}

{showRoomIntro ? (
<RoomIntroOverlay
  roomBackground={ROOM_BACKGROUND}
  isWaitingForNextRound={isWaitingForNextRound}
  countdown={displayCountdown}
  phase={phase}
  exitDoorAsset={ROYAL_EXIT_DOOR_BUTTON}
  logoAsset={NAGANI_LOGO}
  onExitClick={handleExitButtonClick}
  showRoomControls
  isBackgroundMusicMuted={isBackgroundMusicMuted}
  isFullscreenMode={isFullscreenMode}
  canUseFullscreen={canUseFullscreen}
  onBackgroundMusicToggle={handleBackgroundMusicToggle}
  onFullscreenToggle={handleFullscreenToggle}
/>
) : null}

{showExitConfirm ? (
  <SixAnimalExitConfirm
    exitDoorAsset={ROYAL_EXIT_DOOR_BUTTON}
    onStayClick={handleStayInRoomClick}
    onLeaveClick={handleLobbyClick}
  />
) : null}

            <div className="relative z-10 flex h-full min-h-0 flex-col overflow-hidden px-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] pt-[calc(0.5rem+env(safe-area-inset-top))] sm:px-4">
        <RoyalRoomTopBar
  exitDoorAsset={ROYAL_EXIT_DOOR_BUTTON}
  logoAsset={NAGANI_LOGO}
  onExitClick={handleExitButtonClick}
  showRoomControls
  isBackgroundMusicMuted={isBackgroundMusicMuted}
  isFullscreenMode={isFullscreenMode}
  canUseFullscreen={canUseFullscreen}
  onBackgroundMusicToggle={handleBackgroundMusicToggle}
  onFullscreenToggle={handleFullscreenToggle}
/>

                <section className="mt-1 flex min-h-0 flex-1 flex-col overflow-visible rounded-none border-0 bg-transparent p-0 shadow-none">
          {showTopPanel ? (
            <SixAnimalBettingCommandPanel
              commandBarClass={commandBarClass}
              timerLabel={timerLabel}
              walletBalanceLabel={`${formatMMK(playableWalletBalance)} ကျပ်`}
            />
          ) : null}

          <div className="relative mt-1 min-h-0 flex-1 overflow-visible rounded-none border-0 bg-transparent shadow-none">
            <RoyalTableChamberBackdrop />

            {showFloatingResultBoard ? (
<FloatingResultBoard
  diceResult={diceResult}
  activeBets={activeBets}
  showFinalResultPanel={showFinalResultPanel}
  isResultPhaseVisualGuard={isResultPhaseVisualGuard}
  isRollingPhase={phase === "closed" || phase === "rolling"}
  isResultWin={isResultWin}
  isSettlementStage={showSettlementSheet}
  animalAssets={ANIMAL_ASSETS}
/>
            ) : null}

{isWaitingForNextRound && !showRoomIntro ? (
<SixAnimalRoomWaitLayer
  phase={phase}
  countdown={displayCountdown}
  announcementKey={waitLayerAnnouncementKey}
  isAudioUnlocked={isRoomAudioUnlocked}
  onAnnounce={playInRoomWaitAnnouncement}
/>
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

            <div className="relative z-10 flex h-full min-h-0 items-center justify-center px-0 pb-0 pt-1">
  <div className="relative h-full w-full">
                <ThreeDiceSequenceController
  key={roundId || "six-animal-dice-stage"}
  enabled={shouldEnableDiceController}
  runKey={threeDiceRunKey}
  onComplete={handleThreeDiceComplete}
                  onProgress={handleThreeDiceProgress}
                  onDiceDrop={handleDiceDrop}
                  className="h-full min-h-[500px] w-full"
                  showInternalResultStrip={false}
                  mountedDiceRackMode={effectiveMountedDiceRackMode}
                  serverRngResults={serverRngResults}
                  visualRoundId={heldVisualRoundId}
                />
              </div>
            </div>

            <SixAnimalBettingSheet
              isOpen={phase === "betting"}
              isUrgentCountdown={isUrgentBettingCountdown}
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
              onInvalidBetClick={handleInvalidBetButtonClick}
            />
          </div>
        </section>
      </div>
      </main>
    </SixAnimalRoomBootGate>
  );
}