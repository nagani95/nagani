//src/lib/nagani-sound/soundMixerSettings.ts

"use client";

export type NaganiSoundChannel =
  | "master"
  | "lobbyBgm"
  | "roomBgm"
  | "announcement"
  | "resultAnnouncement"
  | "countdown"
  | "dice"
  | "ui"
  | "ambience";

export type NaganiSoundItem = {
  key: string;
  label: string;
  channel: Exclude<NaganiSoundChannel, "master">;
  src: string;
  defaultVolume: number;
  loop?: boolean;
};

export type NaganiMixerSetting = {
  volume: number;
  muted: boolean;
};

export type NaganiMixerSettings = Record<NaganiSoundChannel, NaganiMixerSetting> & {
  items: Record<string, NaganiMixerSetting>;
};

export const NAGANI_MIXER_STORAGE_KEY = "nagani-dev-sound-mixer-v2";

export const NAGANI_SOUND_ITEMS: NaganiSoundItem[] = [
  {
    key: "lobbyBgm",
    label: "Lobby Palace BGM",
    channel: "lobbyBgm",
    src: "/assets/nagani/sounds/lobby/bgm/lobby-palace-bgm-v1.mp3",
    defaultVolume: 0.42,
    loop: true,
  },
  {
    key: "welcome",
    label: "Lobby Welcome Announcement",
    channel: "announcement",
    src: "/assets/nagani/sounds/lobby/announcement/welcome.mp3",
    defaultVolume: 0.95,
  },
  {
    key: "roomBgm",
    label: "Six Animal Room BGM",
    channel: "roomBgm",
    src: "/assets/nagani/sounds/six-animal/bgm/room-bgm.mp3",
    defaultVolume: 0.18,
    loop: true,
  },
  {
    key: "crowdBed",
    label: "Crowd Bed Ambience",
    channel: "ambience",
    src: "/assets/nagani/sounds/six-animal/ambience/crowd-bed-soft-v1.mp3",
    defaultVolume: 0.42,
    loop: true,
  },
  {
    key: "loading",
    label: "Loading Announcement",
    channel: "announcement",
    src: "/assets/nagani/sounds/six-animal/announcement/loading.mp3",
    defaultVolume: 0.82,
  },
  {
    key: "bettingRound",
    label: "Betting Round Announcement",
    channel: "announcement",
    src: "/assets/nagani/sounds/six-animal/announcement/betting-round.mp3",
    defaultVolume: 0.76,
  },
  {
    key: "betsClosed",
    label: "Bets Closed Announcement",
    channel: "announcement",
    src: "/assets/nagani/sounds/six-animal/announcement/bets-closed.mp3",
    defaultVolume: 0.82,
  },
  {
    key: "settlementWin",
    label: "Settlement Win Announcement",
    channel: "resultAnnouncement",
    src: "/assets/nagani/sounds/six-animal/announcement/settlement-win.mp3",
    defaultVolume: 0.9,
  },
  {
    key: "settlementLose",
    label: "Settlement Lose Announcement",
    channel: "resultAnnouncement",
    src: "/assets/nagani/sounds/six-animal/announcement/settlement-lose.mp3",
    defaultVolume: 0.86,
  },
  {
    key: "tiger",
    label: "Result Tiger Announcement",
    channel: "resultAnnouncement",
    src: "/assets/nagani/sounds/six-animal/announcement/results/tiger.mp3",
    defaultVolume: 0.92,
  },
  {
    key: "dragon",
    label: "Result Dragon Announcement",
    channel: "resultAnnouncement",
    src: "/assets/nagani/sounds/six-animal/announcement/results/dragon.mp3",
    defaultVolume: 0.92,
  },
  {
    key: "rooster",
    label: "Result Rooster Announcement",
    channel: "resultAnnouncement",
    src: "/assets/nagani/sounds/six-animal/announcement/results/rooster.mp3",
    defaultVolume: 0.88,
  },
  {
    key: "fish",
    label: "Result Fish Announcement",
    channel: "resultAnnouncement",
    src: "/assets/nagani/sounds/six-animal/announcement/results/fish.mp3",
    defaultVolume: 0.86,
  },
  {
    key: "crab",
    label: "Result Crab Announcement",
    channel: "resultAnnouncement",
    src: "/assets/nagani/sounds/six-animal/announcement/results/crab.mp3",
    defaultVolume: 0.88,
  },
  {
    key: "elephant",
    label: "Result Elephant Announcement",
    channel: "resultAnnouncement",
    src: "/assets/nagani/sounds/six-animal/announcement/results/elephant.mp3",
    defaultVolume: 0.92,
  },
  {
    key: "countdownHit",
    label: "Countdown Hit",
    channel: "countdown",
    src: "/assets/nagani/sounds/six-animal/countdown/countdown-hit.mp3",
    defaultVolume: 0.88,
  },
    {
    key: "diceRelease",
    label: "Dice Release",
    channel: "dice",
    src: "/assets/nagani/sounds/six-animal/dice/release-01.wav",
    defaultVolume: 0.58,
  },
  {
    key: "diceDeflectorHit",
    label: "Dice Deflector Hit",
    channel: "dice",
    src: "/assets/nagani/sounds/six-animal/dice/deflector-hit-01.wav",
    defaultVolume: 0.9,
  },
  {
    key: "diceTrayImpact",
    label: "Dice Tray Impact",
    channel: "dice",
    src: "/assets/nagani/sounds/six-animal/dice/tray-impact-01.wav",
    defaultVolume: 1,
  },
  {
    key: "diceRollLoop",
    label: "Dice Roll Loop",
    channel: "dice",
    src: "/assets/nagani/sounds/six-animal/dice/roll-loop-soft.wav",
    defaultVolume: 0.54,
    loop: true,
  },
  {
    key: "diceTap",
    label: "Dice Tap",
    channel: "dice",
    src: "/assets/nagani/sounds/six-animal/dice/tap-01.wav",
    defaultVolume: 0.76,
  },
  {
    key: "diceSettle",
    label: "Dice Settle",
    channel: "dice",
    src: "/assets/nagani/sounds/six-animal/dice/settle-01.wav",
    defaultVolume: 0.82,
  },
  {
    key: "uiClick",
    label: "UI Click",
    channel: "ui",
    src: "/assets/nagani/sounds/six-animal/ui/ui-click.mp3",
    defaultVolume: 0.42,
  },
  {
    key: "betLocked",
    label: "Bet Locked",
    channel: "ui",
    src: "/assets/nagani/sounds/six-animal/ui/bet-locked.mp3",
    defaultVolume: 0.68,
  },
  {
    key: "betInvalid",
    label: "Bet Invalid",
    channel: "ui",
    src: "/assets/nagani/sounds/six-animal/ui/bet-invalid.mp3",
    defaultVolume: 0.72,
  },
  {
    key: "exitButton",
    label: "Exit Button",
    channel: "ui",
    src: "/assets/nagani/sounds/six-animal/ui/exit-button.mp3",
    defaultVolume: 0.62,
  },
  {
    key: "crowdOhh01",
    label: "Crowd Reaction 01",
    channel: "ambience",
    src: "/assets/nagani/sounds/six-animal/ambience/crowd-reaction-soft-01.mp3",
    defaultVolume: 0.68,
  },
  {
    key: "crowdOhh02",
    label: "Crowd Reaction 02",
    channel: "ambience",
    src: "/assets/nagani/sounds/six-animal/ambience/crowd-reaction-soft-02.mp3",
    defaultVolume: 0.62,
  },
  {
    key: "resultCelebrateSmall",
    label: "Result Celebrate Small",
    channel: "ambience",
    src: "/assets/nagani/sounds/six-animal/ambience/result-celebrate-small-v1.mp3",
    defaultVolume: 0.72,
  },
  {
    key: "resultCelebrateBig",
    label: "Result Celebrate Big",
    channel: "ambience",
    src: "/assets/nagani/sounds/six-animal/ambience/result-celebrate-big-v1.mp3",
    defaultVolume: 0.88,
  },
];

const DEFAULT_CHANNEL_SETTINGS: Record<NaganiSoundChannel, NaganiMixerSetting> = {
  master: { volume: 1, muted: false },
  lobbyBgm: { volume: 0.42, muted: false },
  roomBgm: { volume: 0.18, muted: false },
  announcement: { volume: 0.82, muted: false },
  resultAnnouncement: { volume: 0.9, muted: false },
  countdown: { volume: 0.88, muted: false },
  dice: { volume: 1, muted: false },
  ui: { volume: 0.55, muted: false },
  ambience: { volume: 0.45, muted: false },
};

function buildDefaultItemSettings() {
  return Object.fromEntries(
    NAGANI_SOUND_ITEMS.map((item) => [
      item.key,
      {
        volume: 1,
        muted: false,
      },
    ])
  );
}

export function createDefaultNaganiMixerSettings(): NaganiMixerSettings {
  return {
    ...DEFAULT_CHANNEL_SETTINGS,
    items: buildDefaultItemSettings(),
  };
}

export const DEFAULT_NAGANI_MIXER_SETTINGS =
  createDefaultNaganiMixerSettings();

export function clampNaganiVolume(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.min(Math.max(value, 0), 1);
}

export function readNaganiMixerSettings(): NaganiMixerSettings {
  const defaults = createDefaultNaganiMixerSettings();

  if (typeof window === "undefined") return defaults;

  try {
    const rawValue = window.localStorage.getItem(NAGANI_MIXER_STORAGE_KEY);
    if (!rawValue) return defaults;

    const parsedValue = JSON.parse(rawValue) as Partial<NaganiMixerSettings>;

    return {
      ...defaults,
      ...parsedValue,
      items: {
        ...defaults.items,
        ...(parsedValue.items ?? {}),
      },
    };
  } catch {
    return defaults;
  }
}

export function writeNaganiMixerSettings(settings: NaganiMixerSettings) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(
      NAGANI_MIXER_STORAGE_KEY,
      JSON.stringify(settings)
    );

    window.dispatchEvent(
      new CustomEvent("nagani:sound-mixer-change", {
        detail: settings,
      })
    );
  } catch {
    // Dev mixer must never block the app.
  }
}

export function resetNaganiMixerSettings() {
  writeNaganiMixerSettings(createDefaultNaganiMixerSettings());
}

export function getNaganiMixedVolume(
  channel: Exclude<NaganiSoundChannel, "master">,
  baseVolume: number,
  itemKey?: string
) {
  const settings = readNaganiMixerSettings();
  const master = settings.master;
  const channelSetting = settings[channel];
  const itemSetting = itemKey ? settings.items[itemKey] : null;

  if (master.muted || channelSetting?.muted || itemSetting?.muted) return 0;

  if (!Number.isFinite(baseVolume)) return 0;

  return clampNaganiVolume(
    master.volume *
      (channelSetting?.volume ?? 1) *
      (itemSetting?.volume ?? 1)
  );
}