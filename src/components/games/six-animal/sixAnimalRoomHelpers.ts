//src/components/games/six-animal/sixAnimalRoomHelpers.ts

import type { ThreeDiceRoundPayload } from "@/components/games/six-animal/ThreeDicePhysicsStage";
import { SIX_ANIMAL_OPTIONS, SIX_ANIMAL_RULES } from "@/lib/gameRules";
import { naganiAssets } from "@/lib/naganiAssets";
import type { SixAnimalKey } from "@/types/games";

export const ROOM_BACKGROUND = naganiAssets.sixAnimal.room.palaceBgV1;
export const ROYAL_EXIT_DOOR_BUTTON = naganiAssets.sixAnimal.ui.royalExitDoor;
export const NAGANI_LOGO =
  "/assets/nagani/shared/logo/nagani-logo-concept-v1.png";

export const RESULT_REVEAL_DELAY_MS = 900;
export const SETTLEMENT_POPUP_DELAY_MS = 1400;

export const ROOM_SOUND_ENABLED = true;
export const ROOM_SOUND_VOLUME = 0.72;

export const ROOM_BACKGROUND_MUSIC_SRC =
  "/assets/nagani/sounds/six-animal/room-bgm.mp3";

export const ROOM_BACKGROUND_MUSIC_VOLUME = 0.10;
export const ROOM_BACKGROUND_MUSIC_FADE_MS = 700;
export const ROOM_BACKGROUND_MUSIC_FADE_STEP_MS = 40;
export const ROOM_BACKGROUND_MUSIC_MUTED_STORAGE_KEY =
  "nagani-six-animal-bgm-muted";

export const SIX_ANIMAL_ROOM_UUID = "11111111-1111-1111-1111-111111111111";
export const BET_AMOUNT_STEP = 1000;
export const USE_V1_AUTO_VISIBLE_ROOM_RESULT = true;
export const USE_BACKEND_RESULT_FOR_ROOM_UI = true;

export type RoundPhase =
  | "loading"
  | "betting"
  | "closed"
  | "rolling"
  | "result";

export type VisualDiceStatus = "idle" | "playing" | "complete";

export type BetMode = "single" | "pair";

export type LiveSixAnimalRound = {
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

export type LiveSixAnimalBet = {
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

export type ActiveBet = {
  betType: BetMode;
  animalKey: SixAnimalKey;
  animalKey2?: SixAnimalKey | null;
  animalNameMm: string;
  animalNameMm2?: string | null;
  amount: number;
  roundNumber: number;
};

export type SixAnimalSoundEvent =
  | "loading"
  | "betting-round"
  | "bets-closed"
  | "dice-drop"
  | "settlement-round"
  | "settlement-win"
  | "settlement-lose"
  | "bet-locked"
  | "exit-button"
  | "bet-invalid"
  | "ui-click";

export const ANIMAL_ASSETS: Record<SixAnimalKey, string> = {
  tiger: naganiAssets.sixAnimal.animals.tiger,
  dragon: naganiAssets.sixAnimal.animals.dragon,
  rooster: naganiAssets.sixAnimal.animals.rooster,
  fish: naganiAssets.sixAnimal.animals.fish,
  crab: naganiAssets.sixAnimal.animals.crab,
  elephant: naganiAssets.sixAnimal.animals.elephant,
};

export const SIX_ANIMAL_SOUND_SRC: Record<SixAnimalSoundEvent, string> = {
  loading: "/assets/nagani/sounds/six-animal/loading.mp3",
  "betting-round": "/assets/nagani/sounds/six-animal/betting-round.mp3",
  "bets-closed": "/assets/nagani/sounds/six-animal/bets-closed.mp3",
  "dice-drop": "/assets/nagani/sounds/six-animal/dice-drop.mp3",
  "settlement-round": "/assets/nagani/sounds/six-animal/settlement-round.mp3",
  "settlement-win": "/assets/nagani/sounds/six-animal/settlement-win.mp3",
  "settlement-lose": "/assets/nagani/sounds/six-animal/settlement-lose.mp3",
  "bet-locked": "/assets/nagani/sounds/six-animal/bet-locked.mp3",
  "exit-button": "/assets/nagani/sounds/six-animal/exit-button.mp3",
  "bet-invalid": "/assets/nagani/sounds/six-animal/bet-invalid.mp3",
  "ui-click": "/assets/nagani/sounds/six-animal/ui-click.mp3",
};

export const SIX_ANIMAL_SOUND_VOLUME: Record<SixAnimalSoundEvent, number> = {
  loading: 0.82,
  "betting-round": 0.76,
  "bets-closed": 0.82,
  "dice-drop": 0.9,
  "settlement-round": 0.82,
  "settlement-win": 0.9,
  "settlement-lose": 0.86,
  "bet-locked": 0.68,
  "exit-button": 0.62,
  "bet-invalid": 0.72,
  "ui-click": 0.42,
};

export const SIX_ANIMAL_RESULT_SOUND_SRC: Record<SixAnimalKey, string> = {
  tiger: "/assets/nagani/sounds/six-animal/results/tiger.mp3",
  dragon: "/assets/nagani/sounds/six-animal/results/dragon.mp3",
  rooster: "/assets/nagani/sounds/six-animal/results/rooster.mp3",
  fish: "/assets/nagani/sounds/six-animal/results/fish.mp3",
  crab: "/assets/nagani/sounds/six-animal/results/crab.mp3",
  elephant: "/assets/nagani/sounds/six-animal/results/elephant.mp3",
};

export const SIX_ANIMAL_RESULT_SOUND_VOLUME: Record<SixAnimalKey, number> = {
  tiger: 0.92,
  dragon: 0.92,
  rooster: 0.88,
  fish: 0.86,
  crab: 0.88,
  elephant: 0.92,
};

export function secondsUntil(targetIso: string | null | undefined) {
  if (!targetIso) return 0;

  const targetTime = new Date(targetIso).getTime();
  const nowTime = Date.now();

  return Math.max(0, Math.ceil((targetTime - nowTime) / 1000));
}

export function getRoundPhaseTargetAt(round: LiveSixAnimalRound) {
  if (round.phase === "betting") return round.betting_ends_at;
  if (round.phase === "closed") return round.rolling_starts_at;

  if (round.phase === "rolling") {
    return round.result_revealed_at ?? round.next_round_starts_at;
  }

  if (round.phase === "result") return round.next_round_starts_at;

  return null;
}

export function getLiveRoundCountdown(round: LiveSixAnimalRound) {
  return secondsUntil(getRoundPhaseTargetAt(round));
}

export function mapLiveRoundPhase(round: LiveSixAnimalRound): RoundPhase {
  if (round.phase === "betting") return "betting";
  if (round.phase === "closed") return "closed";
  if (round.phase === "rolling") return "rolling";
  if (round.phase === "result" || round.phase === "settled") return "result";

  return "loading";
}

export function formatMMK(amount: number) {
  return new Intl.NumberFormat("en-US").format(amount);
}

export function getPairKey(animalA: SixAnimalKey, animalB: SixAnimalKey) {
  return [animalA, animalB].sort().join(":");
}

export function getAnimalByNameMm(nameMm: string) {
  return SIX_ANIMAL_OPTIONS.find((animal) => animal.nameMm === nameMm);
}

export function getVisibleDicePayloadResultNames(
  payload: ThreeDiceRoundPayload,
  revealCount = SIX_ANIMAL_RULES.diceCount
) {
  return payload.results
    .slice(0, revealCount)
    .map((label) => {
      const rawLabel = String(label);
      const normalizedLabel = rawLabel.toLowerCase();

      return (
        SIX_ANIMAL_OPTIONS.find(
          (animal) =>
            animal.name.toLowerCase() === normalizedLabel ||
            animal.nameMm === rawLabel ||
            animal.key === normalizedLabel
        )?.nameMm ?? null
      );
    })
    .filter((nameMm): nameMm is string => Boolean(nameMm));
}

export function convertBackendBetToActiveBet(
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