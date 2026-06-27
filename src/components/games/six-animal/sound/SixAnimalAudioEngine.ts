//src/components/games/six-animal/sound/SixAnimalAudioEngine.ts

"use client";

import type { DiceTableAudioEvent } from "@/components/games/six-animal/ThreeDicePhysicsStage";
import {
  ROOM_SOUND_ENABLED,
  SIX_ANIMAL_RESULT_SOUND_SRC,
  SIX_ANIMAL_RESULT_SOUND_VOLUME,
  SIX_ANIMAL_SOUND_SRC,
  SIX_ANIMAL_SOUND_VOLUME,
  getAnimalByNameMm,
} from "@/components/games/six-animal/sixAnimalRoomHelpers";
import type { SixAnimalKey } from "@/types/games";

type RoomAudioKey =
  | "roomBgm"
  | "crowdBed"
  | "crowdOhh01"
  | "crowdOhh02"
  | "settlementWinSmall"
  | "settlementWinBig";

type DiceAudioKey =
  | "release"
  | "deflectorHit"
  | "trayImpact"
  | "rollLoop"
  | "tap"
  | "settle";

type LegacyRoomUiSoundKey =
  | "loading"
  | "betting-round"
  | "bets-closed"
  | "countdown-hit"
  | "settlement-lose"
  | "bet-locked"
  | "exit-button"
  | "bet-invalid"
  | "ui-click";

type ActiveLoop = {
  source: AudioBufferSourceNode;
  gain: GainNode;
};

const BACKGROUND_MUTED_STORAGE_KEY = "nagani-six-animal-room-bgm-muted";

const ROOM_AUDIO_SRC: Record<RoomAudioKey, string> = {
  roomBgm: "/assets/nagani/sounds/six-animal/room-bgm.mp3",
  crowdBed: "/assets/nagani/sounds/six-animal/room/crowd-bed-soft-v1.mp3",
  crowdOhh01:
    "/assets/nagani/sounds/six-animal/room/crowd-reaction-soft-01.mp3",
  crowdOhh02:
    "/assets/nagani/sounds/six-animal/room/crowd-reaction-soft-02.mp3",
  settlementWinSmall:
    "/assets/nagani/sounds/six-animal/room/result-celebrate-small-v1.mp3",
  settlementWinBig:
    "/assets/nagani/sounds/six-animal/room/result-celebrate-big-v1.mp3",
};

const ROOM_AUDIO_VOLUME: Record<RoomAudioKey, number> = {
  roomBgm: 0.16,
  crowdBed: 0.42,
  crowdOhh01: 0.68,
  crowdOhh02: 0.62,
  settlementWinSmall: 0.72,
  settlementWinBig: 0.88,
};

const DICE_AUDIO_SRC: Record<DiceAudioKey, string> = {
  release: "/assets/nagani/sounds/six-animal/dice/release-01.wav",
  deflectorHit: "/assets/nagani/sounds/six-animal/dice/deflector-hit-01.wav",
  trayImpact: "/assets/nagani/sounds/six-animal/dice/tray-impact-01.wav",
  rollLoop: "/assets/nagani/sounds/six-animal/dice/roll-loop-soft.wav",
  tap: "/assets/nagani/sounds/six-animal/dice/tap-01.wav",
  settle: "/assets/nagani/sounds/six-animal/dice/settle-01.wav",
};

const DICE_AUDIO_VOLUME: Record<DiceAudioKey, number> = {
  release: 0.58,
  deflectorHit: 0.9,
  trayImpact: 1.0,
  rollLoop: 0.54,
  tap: 0.76,
  settle: 0.82,
};

const DICE_MASTER_VOLUME = 1.12;
const ACTIVE_LEGACY_UI_SOUND_KEYS: LegacyRoomUiSoundKey[] = [
  "loading",
  "betting-round",
  "bets-closed",
  "countdown-hit",
  "settlement-lose",
  "bet-locked",
  "exit-button",
  "bet-invalid",
  "ui-click",
];

function getAudioContextConstructor() {
  if (typeof window === "undefined") return null;

  return (
    window.AudioContext ||
    (window as typeof window & { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext ||
    null
  );
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

class SixAnimalAudioEngine {
  private isUnlocked = false;
  private isBackgroundMuted = false;

  private htmlAudioPool = new Map<string, HTMLAudioElement>();
  private hasPreloadedHtmlAudio = false;

  private audioContext: AudioContext | null = null;
  private diceBuffers = new Map<DiceAudioKey, AudioBuffer>();
  private isDicePreloading = false;

  private activeRollLoop: ActiveLoop | null = null;
  private rollFadeTimer: number | null = null;
  private lastDiceOneShotAt = new Map<DiceAudioKey, number>();

  constructor() {
    this.isBackgroundMuted = this.readBackgroundMutedPreference();
  }

  getBackgroundMuted() {
    return this.isBackgroundMuted;
  }

  async unlockAudio() {
    if (!ROOM_SOUND_ENABLED) return;

    this.isUnlocked = true;

    const AudioContextConstructor = getAudioContextConstructor();

    if (AudioContextConstructor && !this.audioContext) {
      this.audioContext = new AudioContextConstructor();
    }

    if (this.audioContext?.state === "suspended") {
      await this.audioContext.resume().catch(() => undefined);
    }

    if (!this.hasPreloadedHtmlAudio) {
      this.preloadHtmlAudio();
      this.hasPreloadedHtmlAudio = true;
    }

    void this.preloadDiceAudio();
  }

startBackground() {
  if (!ROOM_SOUND_ENABLED) return;
  if (!this.isUnlocked) return;

  if (!this.isBackgroundMuted) {
    this.startLoopingRoomSound("crowdBed");
    this.startLoopingRoomSound("roomBgm");
  }
}

  stopBackground() {
    this.stopLoopingRoomSound("crowdBed");
    this.stopLoopingRoomSound("roomBgm");
  }

setBackgroundMuted(nextMuted: boolean) {
  this.isBackgroundMuted = nextMuted;
  this.writeBackgroundMutedPreference(nextMuted);

  if (nextMuted) {
    this.stopLoopingRoomSound("crowdBed");
    this.stopLoopingRoomSound("roomBgm");
    return;
  }

  this.startLoopingRoomSound("crowdBed");
  this.startLoopingRoomSound("roomBgm");
}

  toggleBackground() {
    const nextMuted = !this.isBackgroundMuted;

    this.setBackgroundMuted(nextMuted);

    return nextMuted;
  }

  playUiSound(soundKey: LegacyRoomUiSoundKey) {
    if (!ROOM_SOUND_ENABLED) return;
    if (!this.isUnlocked) return;

    const src = SIX_ANIMAL_SOUND_SRC[soundKey];
    const volume = SIX_ANIMAL_SOUND_VOLUME[soundKey] ?? 0.5;

    this.playHtmlOneShot(src, volume);
  }

  playReveal(animalNameMmOrKey: string) {
    if (!ROOM_SOUND_ENABLED) return;
    if (!this.isUnlocked) return;

    const animalKey = this.resolveAnimalKey(animalNameMmOrKey);

    if (animalKey) {
      this.playHtmlOneShot(
        SIX_ANIMAL_RESULT_SOUND_SRC[animalKey],
        SIX_ANIMAL_RESULT_SOUND_VOLUME[animalKey] ?? 0.9
      );
    }

    this.playCrowdOhh();
  }

  playSettlementWin(options?: { bigWin?: boolean }) {
    if (!ROOM_SOUND_ENABLED) return;
    if (!this.isUnlocked) return;

    const soundKey: RoomAudioKey = options?.bigWin
      ? "settlementWinBig"
      : "settlementWinSmall";

    this.playHtmlOneShot(ROOM_AUDIO_SRC[soundKey], ROOM_AUDIO_VOLUME[soundKey]);
  }

  playSettlementLose() {
    if (!ROOM_SOUND_ENABLED) return;
    if (!this.isUnlocked) return;

    this.playUiSound("settlement-lose");
  }

  handleDiceTableAudioEvent(event: DiceTableAudioEvent) {
    if (!ROOM_SOUND_ENABLED) return;
    if (!this.isUnlocked) return;

    const intensity = clamp(event.intensity, 0.05, 1);

        if (event.type === "dice-drop") {
      const impactKey: DiceAudioKey =
        event.rollAgeMs < 720 ? "deflectorHit" : "trayImpact";

      this.playDiceOneShot(impactKey, 0.8 + intensity * 0.7, 90);
      this.startOrUpdateRollLoop(0.32 + intensity * 0.42);
      return;
    }

if (event.type === "dice-bounce") {
  const shouldUseTrayLanding =
    event.rollAgeMs > 620 && event.rollAgeMs < 2600 && intensity > 0.44;

  if (shouldUseTrayLanding) {
    this.playDiceOneShot("trayImpact", 0.74 + intensity * 0.68, 90);
  } else {
    this.playDiceOneShot("tap", 0.62 + intensity * 0.78, 70);
  }

  this.startOrUpdateRollLoop(0.22 + intensity * 0.36);
  return;
}

    if (event.type === "dice-roll") {
      this.startOrUpdateRollLoop(0.18 + intensity * 0.52);
      this.scheduleRollLoopFade(520);
      return;
    }

if (event.type === "dice-settle") {
  this.fadeOutRollLoop(320);
  this.playDiceOneShot("settle", 0.72 + intensity * 0.78, 180);
  return;
}
  }

  playDiceRelease() {
    if (!ROOM_SOUND_ENABLED) return;
    if (!this.isUnlocked) return;

    this.playDiceOneShot("release", 1, 120);
  }

  stopAll() {
    this.stopBackground();
    this.fadeOutRollLoop(120);

    this.htmlAudioPool.forEach((audio) => {
      try {
        audio.pause();
        audio.currentTime = 0;
      } catch {
        // Safe cleanup.
      }
    });

    if (this.rollFadeTimer) {
      window.clearTimeout(this.rollFadeTimer);
      this.rollFadeTimer = null;
    }

    this.lastDiceOneShotAt.clear();
  }

  private preloadHtmlAudio() {
    Object.values(ROOM_AUDIO_SRC).forEach((src) => {
      this.getHtmlAudio(src).load();
    });

    Object.values(SIX_ANIMAL_RESULT_SOUND_SRC).forEach((src) => {
      this.getHtmlAudio(src).load();
    });

    ACTIVE_LEGACY_UI_SOUND_KEYS.forEach((soundKey) => {
      this.getHtmlAudio(SIX_ANIMAL_SOUND_SRC[soundKey]).load();
    });
  }

  private async preloadDiceAudio() {
    if (!this.audioContext) return;
    if (this.isDicePreloading) return;

    this.isDicePreloading = true;

    try {
      await Promise.all(
        (Object.keys(DICE_AUDIO_SRC) as DiceAudioKey[]).map(
          async (soundKey) => {
            if (this.diceBuffers.has(soundKey)) return;

            try {
              const response = await fetch(DICE_AUDIO_SRC[soundKey]);

              if (!response.ok) return;

              const arrayBuffer = await response.arrayBuffer();
              const audioBuffer =
                await this.audioContext?.decodeAudioData(arrayBuffer);

              if (audioBuffer) {
                this.diceBuffers.set(soundKey, audioBuffer);
              }
            } catch {
              // Missing sound file must never break game flow.
            }
          }
        )
      );
    } finally {
      this.isDicePreloading = false;
    }
  }

  private getHtmlAudio(src: string) {
    const existingAudio = this.htmlAudioPool.get(src);

    if (existingAudio) return existingAudio;

    const audio = new Audio(src);

    audio.preload = "auto";

    this.htmlAudioPool.set(src, audio);

    return audio;
  }

  private playHtmlOneShot(src: string, volume: number) {
    const audio = this.getHtmlAudio(src);

    try {
      audio.pause();
      audio.currentTime = 0;
      audio.volume = clamp(volume, 0, 1);

      void audio.play().catch(() => {
        // Browser may still block on some devices.
      });
    } catch {
      // Audio must never block game flow.
    }
  }

    private startLoopingRoomSound(soundKey: RoomAudioKey) {
    const audio = this.getHtmlAudio(ROOM_AUDIO_SRC[soundKey]);

    audio.loop = true;
    audio.volume = ROOM_AUDIO_VOLUME[soundKey];

    if (!audio.paused) return;

    void audio.play().catch(() => {
      // Audio must never block room flow.
    });
  }

  private stopLoopingRoomSound(soundKey: RoomAudioKey) {
    const audio = this.htmlAudioPool.get(ROOM_AUDIO_SRC[soundKey]);

    if (!audio) return;

    try {
      audio.pause();
      audio.currentTime = 0;
    } catch {
      // Safe cleanup.
    }
  }

  private playCrowdOhh() {
    const useFirst = Math.random() > 0.45;
    const soundKey: RoomAudioKey = useFirst ? "crowdOhh01" : "crowdOhh02";

    this.playHtmlOneShot(ROOM_AUDIO_SRC[soundKey], ROOM_AUDIO_VOLUME[soundKey]);
  }

  private resolveAnimalKey(value: string): SixAnimalKey | null {
    if (
      value === "tiger" ||
      value === "dragon" ||
      value === "rooster" ||
      value === "fish" ||
      value === "crab" ||
      value === "elephant"
    ) {
      return value;
    }

    return getAnimalByNameMm(value)?.key ?? null;
  }

  private playDiceOneShot(
    soundKey: DiceAudioKey,
    volumeScale = 1,
    minimumGapMs = 80
  ) {
    const audioContext = this.audioContext;

    if (!audioContext || audioContext.state !== "running") return;

    const now = performance.now();
    const lastPlayedAt = this.lastDiceOneShotAt.get(soundKey) ?? 0;

    if (now - lastPlayedAt < minimumGapMs) return;

    this.lastDiceOneShotAt.set(soundKey, now);

    const buffer = this.diceBuffers.get(soundKey);

    if (!buffer) return;

    const source = audioContext.createBufferSource();
    const gain = audioContext.createGain();

    source.buffer = buffer;
    source.playbackRate.value = 0.96 + Math.random() * 0.08;

    gain.gain.value =
      DICE_AUDIO_VOLUME[soundKey] * volumeScale * DICE_MASTER_VOLUME;

    source.connect(gain);
    gain.connect(audioContext.destination);

    source.start();
  }

  private startOrUpdateRollLoop(volume: number) {
    const audioContext = this.audioContext;

    if (!audioContext || audioContext.state !== "running") return;

    const targetVolume =
      clamp(volume, 0.12, 0.72) * DICE_AUDIO_VOLUME.rollLoop * DICE_MASTER_VOLUME;

    if (this.activeRollLoop) {
      try {
        this.activeRollLoop.gain.gain.cancelScheduledValues(
          audioContext.currentTime
        );
        this.activeRollLoop.gain.gain.setValueAtTime(
          this.activeRollLoop.gain.gain.value,
          audioContext.currentTime
        );
        this.activeRollLoop.gain.gain.linearRampToValueAtTime(
          targetVolume,
          audioContext.currentTime + 0.08
        );
      } catch {
        // Non-blocking.
      }

      return;
    }

    const buffer = this.diceBuffers.get("rollLoop");

    if (!buffer) return;

    const source = audioContext.createBufferSource();
    const gain = audioContext.createGain();

    source.buffer = buffer;
    source.loop = true;
    source.playbackRate.value = 0.98 + Math.random() * 0.04;

    gain.gain.value = 0;
    gain.gain.linearRampToValueAtTime(
      targetVolume,
      audioContext.currentTime + 0.12
    );

    source.connect(gain);
    gain.connect(audioContext.destination);

    source.start();

    this.activeRollLoop = { source, gain };
  }

  private scheduleRollLoopFade(delayMs: number) {
    if (this.rollFadeTimer) {
      window.clearTimeout(this.rollFadeTimer);
    }

    this.rollFadeTimer = window.setTimeout(() => {
      this.rollFadeTimer = null;
      this.fadeOutRollLoop(260);
    }, delayMs);
  }

  private fadeOutRollLoop(fadeMs: number) {
    const audioContext = this.audioContext;
    const activeRollLoop = this.activeRollLoop;

    if (!audioContext || !activeRollLoop) return;

    this.activeRollLoop = null;

    try {
      activeRollLoop.gain.gain.cancelScheduledValues(audioContext.currentTime);
      activeRollLoop.gain.gain.setValueAtTime(
        activeRollLoop.gain.gain.value,
        audioContext.currentTime
      );
      activeRollLoop.gain.gain.linearRampToValueAtTime(
        0,
        audioContext.currentTime + fadeMs / 1000
      );
      activeRollLoop.source.stop(audioContext.currentTime + fadeMs / 1000 + 0.03);
    } catch {
      // Safe cleanup.
    }
  }

  private readBackgroundMutedPreference() {
    if (typeof window === "undefined") return false;

    try {
      return window.localStorage.getItem(BACKGROUND_MUTED_STORAGE_KEY) === "true";
    } catch {
      return false;
    }
  }

  private writeBackgroundMutedPreference(nextMuted: boolean) {
    if (typeof window === "undefined") return;

    try {
      window.localStorage.setItem(
        BACKGROUND_MUTED_STORAGE_KEY,
        String(nextMuted)
      );
    } catch {
      // Preference saving must never block game flow.
    }
  }
}

export const sixAnimalAudioEngine = new SixAnimalAudioEngine();