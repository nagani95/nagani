//src/components/games/six-animal/sound/DiceSoundDirector.ts

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
    volume: 0.48,
  },
  {
    key: "deflectorHit",
    src: "/assets/nagani/sounds/six-animal/dice/deflector-hit-01.wav",
    volume: 0.76,
  },
  {
    key: "deflectorHit",
    src: "/assets/nagani/sounds/six-animal/dice/deflector-hit-02.wav",
    volume: 0.68,
  },
  {
    key: "trayImpact",
    src: "/assets/nagani/sounds/six-animal/dice/tray-impact-01.wav",
    volume: 1.45,
  },
  {
    key: "trayImpact",
    src: "/assets/nagani/sounds/six-animal/dice/tray-impact-02.wav",
    volume: 1.35,
  },
  {
    key: "rollLoop",
    src: "/assets/nagani/sounds/six-animal/dice/roll-loop-soft.wav",
    volume: 0.52,
  },
  {
    key: "tap",
    src: "/assets/nagani/sounds/six-animal/dice/tap-01.wav",
    volume: 0.72,
  },
  {
    key: "tap",
    src: "/assets/nagani/sounds/six-animal/dice/tap-02.wav",
    volume: 0.64,
  },
  {
    key: "tap",
    src: "/assets/nagani/sounds/six-animal/dice/tap-03.wav",
    volume: 0.56,
  },
  {
    key: "settle",
    src: "/assets/nagani/sounds/six-animal/dice/settle-01.wav",
    volume: 0.74,
  },
];

const MASTER_VOLUME = 1.0;

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

class DiceSoundDirector {
  private audioContext: AudioContext | null = null;
  private buffers = new Map<string, AudioBuffer>();
  private isEnabled = true;
  private isPreloading = false;
  private isPreloaded = false;
  private activeTimers: number[] = [];
  private activeLoops: ActiveLoop[] = [];

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
  startDie(dieNumber: number) {
    if (!this.isEnabled) return;

    void this.unlock();

    const timingOffset = Math.max(0, dieNumber - 1) * 90;
    const forceBoost = dieNumber === 3 ? 1.08 : dieNumber === 2 ? 0.96 : 1;

    // 0ms = holder door opens / dice release begins.
    this.schedule(() => this.playOneShot("release", 0.9), timingOffset);

    // The dice is still near the wall after release.
    // Deflector sound must wait until the visual die reaches the bar.
    this.schedule(
      () => this.playOneShot("deflectorHit", 0.95 * forceBoost),
      850 + timingOffset
    );

    // Tray impact comes shortly after deflector hit.
    this.schedule(
      () => this.playOneShot("trayImpact", 1.05 * forceBoost),
      1560 + timingOffset
    );

    // Rolling must start only after tray impact, not during wall drop.
    this.schedule(() => {
      this.startRollLoop(0.62 * forceBoost);
    }, 1700 + timingOffset);

    // Small bounces after the die has landed.
    this.schedule(() => this.playOneShot("tap", 0.82), 1880 + timingOffset);
    this.schedule(() => this.playOneShot("tap", 0.66), 2460 + timingOffset);
    this.schedule(() => this.playOneShot("tap", 0.5), 3260 + timingOffset);
    this.schedule(() => this.playOneShot("tap", 0.34), 4080 + timingOffset);

    // Final settle near the end of visible dice motion.
    this.schedule(() => {
      this.fadeOutRollLoops(760);
      this.playOneShot("settle", 0.9);
    }, 5200 + timingOffset);
  }

  stopAll() {
    this.activeTimers.forEach((timerId) => {
      window.clearTimeout(timerId);
    });

    this.activeTimers = [];

    this.activeLoops.forEach(({ source }) => {
      try {
        source.stop();
      } catch {
        // Already stopped.
      }
    });

    this.activeLoops = [];
  }

  private schedule(callback: () => void, delayMs: number) {
    const timerId = window.setTimeout(() => {
      this.activeTimers = this.activeTimers.filter((id) => id !== timerId);
      callback();
    }, delayMs);

    this.activeTimers.push(timerId);
  }

  private playOneShot(soundKey: DiceSoundKey, volumeScale = 1) {
    const audioContext = this.audioContext;

    if (!audioContext || audioContext.state !== "running") return;

    const variants = DICE_SOUND_VARIANTS.filter((variant) => variant.key === soundKey);
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

  private startRollLoop(volume: number) {
    const audioContext = this.audioContext;

    if (!audioContext || audioContext.state !== "running") return;

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
      variant.volume * volume * MASTER_VOLUME,
      audioContext.currentTime + 0.12
    );

    source.connect(gain);
    gain.connect(audioContext.destination);

    source.start();

    this.activeLoops.push({ source, gain });
  }

  private fadeOutRollLoops(fadeMs: number) {
    const audioContext = this.audioContext;

    if (!audioContext) return;

    const loopsToStop = [...this.activeLoops];
    this.activeLoops = [];

    loopsToStop.forEach(({ source, gain }) => {
      try {
        gain.gain.cancelScheduledValues(audioContext.currentTime);
        gain.gain.setValueAtTime(gain.gain.value, audioContext.currentTime);
        gain.gain.linearRampToValueAtTime(0, audioContext.currentTime + fadeMs / 1000);
        source.stop(audioContext.currentTime + fadeMs / 1000 + 0.03);
      } catch {
        // Keep sound cleanup safe.
      }
    });
  }
}

export const diceSoundDirector = new DiceSoundDirector();