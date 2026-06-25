// src/components/games/six-animal/sound/DiceSoundDirector.ts

import type { DiceTableAudioEvent } from "../ThreeDicePhysicsStage";

type DiceSoundKey =
  | "release"
  | "deflectorHit"
  | "trayImpact"
  | "rollLoop"
  | "tap"
  | "settle";

type DiceSoundVariant = {
  key: DiceSoundKey;
  src: string;
  volume: number;
};

type ActiveLoop = {
  source: AudioBufferSourceNode;
  gain: GainNode;
};

const DICE_SOUND_VARIANTS: DiceSoundVariant[] = [
  {
    key: "release",
    src: "/assets/nagani/sounds/six-animal/dice/release-01.wav",
    volume: 0.32,
  },
  {
    key: "deflectorHit",
    src: "/assets/nagani/sounds/six-animal/dice/deflector-hit-01.wav",
    volume: 0.52,
  },
  {
    key: "deflectorHit",
    src: "/assets/nagani/sounds/six-animal/dice/deflector-hit-02.wav",
    volume: 0.48,
  },
  {
    key: "trayImpact",
    src: "/assets/nagani/sounds/six-animal/dice/tray-impact-01.wav",
    volume: 0.82,
  },
  {
    key: "trayImpact",
    src: "/assets/nagani/sounds/six-animal/dice/tray-impact-02.wav",
    volume: 0.76,
  },
  {
    key: "rollLoop",
    src: "/assets/nagani/sounds/six-animal/dice/roll-loop-soft.wav",
    volume: 0.28,
  },
  {
    key: "tap",
    src: "/assets/nagani/sounds/six-animal/dice/tap-01.wav",
    volume: 0.38,
  },
  {
    key: "tap",
    src: "/assets/nagani/sounds/six-animal/dice/tap-02.wav",
    volume: 0.34,
  },
  {
    key: "tap",
    src: "/assets/nagani/sounds/six-animal/dice/tap-03.wav",
    volume: 0.3,
  },
  {
    key: "settle",
    src: "/assets/nagani/sounds/six-animal/dice/settle-01.wav",
    volume: 0.44,
  },
];

const MASTER_VOLUME = 0.72;

function getAudioContextConstructor() {
  if (typeof window === "undefined") return null;

  return (
    window.AudioContext ||
    (window as typeof window & { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext ||
    null
  );
}

function randomFrom<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)] ?? null;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

class DiceSoundDirector {
  private audioContext: AudioContext | null = null;
  private buffers = new Map<string, AudioBuffer>();
  private isEnabled = true;
  private isPreloading = false;
  private isPreloaded = false;
  private activeTimers: number[] = [];
  private activeRollLoop: ActiveLoop | null = null;
  private rollFadeTimer: number | null = null;
  private lastOneShotAt = new Map<DiceSoundKey, number>();

  async unlock() {
    if (!this.isEnabled) return;

    const AudioContextConstructor = getAudioContextConstructor();

    if (!AudioContextConstructor) return;

    if (!this.audioContext) {
      this.audioContext = new AudioContextConstructor();
    }

    if (this.audioContext.state === "suspended") {
      await this.audioContext.resume().catch(() => undefined);
    }

    void this.preload();
  }

  async preload() {
    if (this.isPreloaded || this.isPreloading) return;

    this.isPreloading = true;

    try {
      await Promise.all(
        DICE_SOUND_VARIANTS.map(async (variant) => {
          if (this.buffers.has(variant.src)) return;

          const audioContext = this.audioContext;

          if (!audioContext) return;

          try {
            const response = await fetch(variant.src);

            if (!response.ok) return;

            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

            this.buffers.set(variant.src, audioBuffer);
          } catch {
            // Missing dice sound files must never break the game.
          }
        })
      );

      this.isPreloaded = true;
    } finally {
      this.isPreloading = false;
    }
  }

  setEnabled(nextEnabled: boolean) {
    this.isEnabled = nextEnabled;

    if (!nextEnabled) {
      this.stopAll();
    }
  }

  handleTableAudioEvent(event: DiceTableAudioEvent) {
    if (!this.isEnabled) return;

    void this.unlock();

    const intensity = clamp(event.intensity, 0.05, 1);

    if (event.type === "dice-drop") {
      this.fadeOutRollLoop(120);

      const impactKey: DiceSoundKey =
        event.rollAgeMs < 1200 ? "deflectorHit" : "trayImpact";

      this.playOneShotLimited(
        impactKey,
        0.48 + intensity * 0.74,
        95
      );

      return;
    }

    if (event.type === "dice-bounce") {
      const bounceKey: DiceSoundKey =
        event.intensity > 0.68 && event.rollAgeMs < 1700
          ? "deflectorHit"
          : "tap";

      this.playOneShotLimited(
        bounceKey,
        0.3 + intensity * 0.58,
        80
      );

      return;
    }

    if (event.type === "dice-roll") {
      this.pulseRollLoop(0.14 + intensity * 0.5, 460);
      return;
    }

    if (event.type === "dice-settle") {
      this.fadeOutRollLoop(360);
      this.playOneShotLimited("settle", 0.42 + intensity * 0.62, 220);
    }
  }

  // Legacy fallback. Kept only so old callers do not break.
  startDie(dieNumber: number) {
    if (!this.isEnabled) return;

    void this.unlock();

    const timingOffset = Math.max(0, dieNumber - 1) * 90;

    this.schedule(
      () =>
        this.handleTableAudioEvent({
          type: "dice-drop",
          dieIndex: dieNumber - 1,
          intensity: 0.74,
          rollAgeMs: 880,
          movementSpeed: 2.4,
        }),
      850 + timingOffset
    );

    this.schedule(
      () =>
        this.handleTableAudioEvent({
          type: "dice-roll",
          dieIndex: dieNumber - 1,
          intensity: 0.36,
          rollAgeMs: 1700,
          movementSpeed: 1.2,
        }),
      1700 + timingOffset
    );

    this.schedule(
      () =>
        this.handleTableAudioEvent({
          type: "dice-bounce",
          dieIndex: dieNumber - 1,
          intensity: 0.42,
          rollAgeMs: 2300,
          movementSpeed: 0.8,
        }),
      2300 + timingOffset
    );

    this.schedule(
      () =>
        this.handleTableAudioEvent({
          type: "dice-settle",
          dieIndex: dieNumber - 1,
          intensity: 0.34,
          rollAgeMs: 5200,
          movementSpeed: 0.12,
        }),
      5200 + timingOffset
    );
  }

  stopAll() {
    this.activeTimers.forEach((timerId) => {
      window.clearTimeout(timerId);
    });

    this.activeTimers = [];

    if (this.rollFadeTimer) {
      window.clearTimeout(this.rollFadeTimer);
      this.rollFadeTimer = null;
    }

    if (this.activeRollLoop) {
      try {
        this.activeRollLoop.source.stop();
      } catch {
        // Already stopped.
      }
    }

    this.activeRollLoop = null;
    this.lastOneShotAt.clear();
  }

  private schedule(callback: () => void, delayMs: number) {
    const timerId = window.setTimeout(() => {
      this.activeTimers = this.activeTimers.filter((id) => id !== timerId);
      callback();
    }, delayMs);

    this.activeTimers.push(timerId);
  }

  private playOneShotLimited(
    soundKey: DiceSoundKey,
    volumeScale = 1,
    minimumGapMs = 80
  ) {
    const now = performance.now();
    const lastPlayedAt = this.lastOneShotAt.get(soundKey) ?? 0;

    if (now - lastPlayedAt < minimumGapMs) return;

    this.lastOneShotAt.set(soundKey, now);
    this.playOneShot(soundKey, volumeScale);
  }

  private playOneShot(soundKey: DiceSoundKey, volumeScale = 1) {
    const audioContext = this.audioContext;

    if (!audioContext || audioContext.state !== "running") return;

    const variants = DICE_SOUND_VARIANTS.filter(
      (variant) => variant.key === soundKey
    );
    const variant = randomFrom(variants);

    if (!variant) return;

    const buffer = this.buffers.get(variant.src);

    if (!buffer) return;

    const source = audioContext.createBufferSource();
    const gain = audioContext.createGain();

    source.buffer = buffer;

    const subtlePitchVariation = 0.94 + Math.random() * 0.12;
    source.playbackRate.value = subtlePitchVariation;

    gain.gain.value = variant.volume * volumeScale * MASTER_VOLUME;

    source.connect(gain);
    gain.connect(audioContext.destination);

    source.start();
  }

  private pulseRollLoop(volume: number, holdMs: number) {
    this.startOrUpdateRollLoop(volume);

    if (this.rollFadeTimer) {
      window.clearTimeout(this.rollFadeTimer);
    }

    this.rollFadeTimer = window.setTimeout(() => {
      this.rollFadeTimer = null;
      this.fadeOutRollLoop(260);
    }, holdMs);
  }

  private startOrUpdateRollLoop(volume: number) {
    const audioContext = this.audioContext;

    if (!audioContext || audioContext.state !== "running") return;

    const targetVolume = clamp(volume, 0.05, 0.42);

    if (this.activeRollLoop) {
      const { gain } = this.activeRollLoop;

      try {
        gain.gain.cancelScheduledValues(audioContext.currentTime);
        gain.gain.setValueAtTime(gain.gain.value, audioContext.currentTime);
        gain.gain.linearRampToValueAtTime(
          targetVolume * MASTER_VOLUME,
          audioContext.currentTime + 0.08
        );
      } catch {
        // Non-blocking.
      }

      return;
    }

    const variant = DICE_SOUND_VARIANTS.find((item) => item.key === "rollLoop");

    if (!variant) return;

    const buffer = this.buffers.get(variant.src);

    if (!buffer) return;

    const source = audioContext.createBufferSource();
    const gain = audioContext.createGain();

    source.buffer = buffer;
    source.loop = true;
    source.playbackRate.value = 0.96 + Math.random() * 0.08;

    gain.gain.value = 0;
    gain.gain.linearRampToValueAtTime(
      variant.volume * targetVolume * MASTER_VOLUME,
      audioContext.currentTime + 0.1
    );

    source.connect(gain);
    gain.connect(audioContext.destination);

    source.start();

    this.activeRollLoop = { source, gain };
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
      // Keep sound cleanup safe.
    }
  }
}

export const diceSoundDirector = new DiceSoundDirector();