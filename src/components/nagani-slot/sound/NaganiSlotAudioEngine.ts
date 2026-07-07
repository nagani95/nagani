// src/components/nagani-slot/sound/NaganiSlotAudioEngine.ts

"use client";

import {
  getNaganiMixedVolume,
  type NaganiSoundChannel,
} from "@/lib/nagani-sound/soundMixerSettings";

type SlotMixerChannel = Exclude<NaganiSoundChannel, "master">;

type SlotLoopSoundKey =
  | "slotRoomBgm"
  | "slotRoomAmbience"
  | "slotReelLoop"
  | "slotCountLoop";

type SlotOneShotSoundKey =
  | "slotUiTap"
  | "slotChipSelect"
  | "slotBetUp"
  | "slotBetDown"
  | "slotMax"
  | "slotAuto"
  | "slotInvalid"
  | "slotSpinStart"
  | "slotReelStop"
  | "slotReelStopFinal"
  | "slotSmallWin"
  | "slotMediumWin"
  | "slotBigWin"
  | "slotCrownStarReveal"
  | "slotFreeSpinTrigger"
  | "slotFlyToBalance";

type SlotSoundKey = SlotLoopSoundKey | SlotOneShotSoundKey;

const BACKGROUND_MUTED_STORAGE_KEY = "nagani-slot-room-bgm-muted";

const SLOT_SOUND_SRC: Record<SlotSoundKey, string> = {
  slotRoomBgm: "/assets/nagani/sounds/slot/ambience/slot-room-bgm.mp3",
  slotRoomAmbience:
    "/assets/nagani/sounds/slot/ambience/palace-slot-room.mp3",

  slotReelLoop: "/assets/nagani/sounds/slot/spin/reel-loop.mp3",
  slotCountLoop: "/assets/nagani/sounds/slot/win/count-loop.mp3",

  slotUiTap: "/assets/nagani/sounds/slot/ui/tap.mp3",
  slotChipSelect: "/assets/nagani/sounds/slot/ui/chip.mp3",
  slotBetUp: "/assets/nagani/sounds/slot/ui/bet-up.mp3",
  slotBetDown: "/assets/nagani/sounds/slot/ui/bet-down.mp3",
  slotMax: "/assets/nagani/sounds/slot/ui/max.mp3",
  slotAuto: "/assets/nagani/sounds/slot/ui/auto.mp3",
  slotInvalid: "/assets/nagani/sounds/slot/ui/invalid.mp3",

  slotSpinStart: "/assets/nagani/sounds/slot/spin/spin-start.mp3",
  slotReelStop: "/assets/nagani/sounds/slot/spin/reel-stop-1.mp3",
  slotReelStopFinal: "/assets/nagani/sounds/slot/spin/reel-stop-final.mp3",

  slotSmallWin: "/assets/nagani/sounds/slot/win/small-win.mp3",
  slotMediumWin: "/assets/nagani/sounds/slot/win/medium-win.mp3",
  slotBigWin: "/assets/nagani/sounds/slot/win/big-win.mp3",
  slotCrownStarReveal:
    "/assets/nagani/sounds/slot/bonus/crown-star-reveal.mp3",
  slotFreeSpinTrigger:
    "/assets/nagani/sounds/slot/bonus/free-spin-trigger.mp3",
  slotFlyToBalance: "/assets/nagani/sounds/slot/win/fly-to-balance.mp3",
};

const SLOT_SOUND_VOLUME: Record<SlotSoundKey, number> = {
  slotRoomBgm: 0.16,
  slotRoomAmbience: 0.28,

  slotReelLoop: 0.34,
  slotCountLoop: 0.34,

  slotUiTap: 0.38,
  slotChipSelect: 0.48,
  slotBetUp: 0.46,
  slotBetDown: 0.44,
  slotMax: 0.52,
  slotAuto: 0.42,
  slotInvalid: 0.56,

  slotSpinStart: 0.62,
  slotReelStop: 0.56,
  slotReelStopFinal: 0.74,

  slotSmallWin: 0.62,
  slotMediumWin: 0.74,
  slotBigWin: 0.9,
  slotCrownStarReveal: 0.7,
  slotFreeSpinTrigger: 0.86,
  slotFlyToBalance: 0.58,
};

const SLOT_SOUND_CHANNEL: Record<SlotSoundKey, SlotMixerChannel> = {
  slotRoomBgm: "roomBgm",
  slotRoomAmbience: "ambience",

  slotReelLoop: "ambience",
  slotCountLoop: "ambience",

  slotUiTap: "ui",
  slotChipSelect: "ui",
  slotBetUp: "ui",
  slotBetDown: "ui",
  slotMax: "ui",
  slotAuto: "ui",
  slotInvalid: "ui",

  slotSpinStart: "ui",
  slotReelStop: "ui",
  slotReelStopFinal: "ui",

  slotSmallWin: "ambience",
  slotMediumWin: "ambience",
  slotBigWin: "ambience",
  slotCrownStarReveal: "ambience",
  slotFreeSpinTrigger: "ambience",
  slotFlyToBalance: "ambience",
};

const LOOP_SOUND_KEYS: SlotLoopSoundKey[] = [
  "slotRoomBgm",
  "slotRoomAmbience",
  "slotReelLoop",
  "slotCountLoop",
];

const ONE_SHOT_SOUND_KEYS: SlotOneShotSoundKey[] = [
  "slotUiTap",
  "slotChipSelect",
  "slotBetUp",
  "slotBetDown",
  "slotMax",
  "slotAuto",
  "slotInvalid",
  "slotSpinStart",
  "slotReelStop",
  "slotReelStopFinal",
  "slotSmallWin",
  "slotMediumWin",
  "slotBigWin",
  "slotCrownStarReveal",
  "slotFreeSpinTrigger",
  "slotFlyToBalance",
];

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

class NaganiSlotAudioEngine {
  private isUnlocked = false;
  private isBackgroundMuted = false;
  private htmlAudioPool = new Map<string, HTMLAudioElement>();
  private hasPreloadedHtmlAudio = false;

  constructor() {
    this.isBackgroundMuted = this.readBackgroundMutedPreference();

    if (typeof window !== "undefined") {
      window.addEventListener("nagani:sound-mixer-change", () => {
        this.syncActiveLoopVolumes();
      });
    }
  }

  getBackgroundMuted() {
    return this.isBackgroundMuted;
  }

  async unlockAudio() {
    this.isUnlocked = true;

    if (!this.hasPreloadedHtmlAudio) {
      this.preloadHtmlAudio();
      this.hasPreloadedHtmlAudio = true;
    }
  }

  startBackground() {
    if (!this.isUnlocked) return;
    if (this.isBackgroundMuted) return;

    this.startLoopingSound("slotRoomBgm");
    this.startLoopingSound("slotRoomAmbience");
  }

  stopBackground() {
    this.stopLoopingSound("slotRoomBgm");
    this.stopLoopingSound("slotRoomAmbience");
  }

  setBackgroundMuted(nextMuted: boolean) {
    this.isBackgroundMuted = nextMuted;
    this.writeBackgroundMutedPreference(nextMuted);

    if (nextMuted) {
      this.stopBackground();
      return;
    }

    this.startBackground();
  }

  toggleBackground() {
    const nextMuted = !this.isBackgroundMuted;

    this.setBackgroundMuted(nextMuted);

    return nextMuted;
  }

  playUiTap() {
    this.playOneShot("slotUiTap");
  }

  playChipSelect() {
    this.playOneShot("slotChipSelect");
  }

  playBetUp() {
    this.playOneShot("slotBetUp");
  }

  playBetDown() {
    this.playOneShot("slotBetDown");
  }

  playMax() {
    this.playOneShot("slotMax");
  }

  playAuto() {
    this.playOneShot("slotAuto");
  }

  playInvalid() {
    this.playOneShot("slotInvalid");
  }

  playSpinStart() {
    this.stopCountLoop();
    this.playOneShot("slotSpinStart");
    this.startReelLoop();
  }

  playReelStop(reelIndex: number) {
    if (reelIndex >= 4) {
      this.playOneShot("slotReelStopFinal");
      this.stopReelLoop();
      return;
    }

    this.playOneShot("slotReelStop");
  }

  startReelLoop() {
    this.startLoopingSound("slotReelLoop");
  }

  stopReelLoop() {
    this.stopLoopingSound("slotReelLoop");
  }

  playWinTier(tier: "small" | "medium" | "big" | "none") {
    if (tier === "big") {
      this.playOneShot("slotBigWin");
      return;
    }

    if (tier === "medium") {
      this.playOneShot("slotMediumWin");
      return;
    }

    if (tier === "small") {
      this.playOneShot("slotSmallWin");
    }
  }

  playCrownStarReveal() {
    this.playOneShot("slotCrownStarReveal");
  }

  playFreeSpinTrigger() {
    this.playOneShot("slotFreeSpinTrigger");
  }

  startCountLoop() {
    this.startLoopingSound("slotCountLoop");
  }

  stopCountLoop() {
    this.stopLoopingSound("slotCountLoop");
  }

  playFlyToBalance() {
    this.stopCountLoop();
    this.playOneShot("slotFlyToBalance");
  }

  stopAll() {
    LOOP_SOUND_KEYS.forEach((soundKey) => {
      this.stopLoopingSound(soundKey);
    });

    this.htmlAudioPool.forEach((audio) => {
      try {
        audio.pause();
        audio.currentTime = 0;
      } catch {
        // Audio cleanup must never block the game.
      }
    });
  }

  private preloadHtmlAudio() {
    [...LOOP_SOUND_KEYS, ...ONE_SHOT_SOUND_KEYS].forEach((soundKey) => {
      this.getHtmlAudio(SLOT_SOUND_SRC[soundKey]).load();
    });
  }

  private getHtmlAudio(src: string) {
    const existingAudio = this.htmlAudioPool.get(src);

    if (existingAudio) return existingAudio;

    const audio = new Audio(src);

    audio.preload = "auto";

    this.htmlAudioPool.set(src, audio);

    return audio;
  }

  private playOneShot(soundKey: SlotOneShotSoundKey) {
    if (!this.isUnlocked) return;

    const src = SLOT_SOUND_SRC[soundKey];
    const baseAudio = this.getHtmlAudio(src);

    try {
      const audio = baseAudio.cloneNode(true) as HTMLAudioElement;

      audio.volume = this.getMixedVolume(soundKey);
      audio.currentTime = 0;

      void audio.play().catch(() => {
        // Browser or missing file may block playback.
      });
    } catch {
      // Audio must never block game flow.
    }
  }

  private startLoopingSound(soundKey: SlotLoopSoundKey) {
    if (!this.isUnlocked) return;

    const audio = this.getHtmlAudio(SLOT_SOUND_SRC[soundKey]);

    try {
      audio.loop = true;
      audio.volume = this.getMixedVolume(soundKey);

      if (!audio.paused) return;

      void audio.play().catch(() => {
        // Browser or missing file may block playback.
      });
    } catch {
      // Audio must never block game flow.
    }
  }

  private stopLoopingSound(soundKey: SlotLoopSoundKey) {
    const audio = this.htmlAudioPool.get(SLOT_SOUND_SRC[soundKey]);

    if (!audio) return;

    try {
      audio.pause();
      audio.currentTime = 0;
    } catch {
      // Safe cleanup.
    }
  }

  private syncActiveLoopVolumes() {
    LOOP_SOUND_KEYS.forEach((soundKey) => {
      const audio = this.htmlAudioPool.get(SLOT_SOUND_SRC[soundKey]);

      if (!audio) return;
      if (audio.paused) return;

      audio.volume = this.getMixedVolume(soundKey);
    });
  }

  private getMixedVolume(soundKey: SlotSoundKey) {
    return clamp(
      getNaganiMixedVolume(
        SLOT_SOUND_CHANNEL[soundKey],
        SLOT_SOUND_VOLUME[soundKey],
        soundKey
      ),
      0,
      1
    );
  }

  private readBackgroundMutedPreference() {
    if (typeof window === "undefined") return false;

    try {
      return (
        window.localStorage.getItem(BACKGROUND_MUTED_STORAGE_KEY) === "true"
      );
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

export const naganiSlotAudioEngine = new NaganiSlotAudioEngine();