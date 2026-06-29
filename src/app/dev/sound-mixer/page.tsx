//src/app/dev/sound-mixer/page.tsx

"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import {
  NAGANI_SOUND_ITEMS,
  type NaganiMixerSettings,
  type NaganiSoundChannel,
  type NaganiSoundItem,
  createDefaultNaganiMixerSettings,
  readNaganiMixerSettings,
  resetNaganiMixerSettings,
  writeNaganiMixerSettings,
} from "@/lib/nagani-sound/soundMixerSettings";

type MixerSection = Exclude<NaganiSoundChannel, "master">;

const CHANNEL_LABELS: Record<NaganiSoundChannel, string> = {
  master: "Master Volume",
  lobbyBgm: "Lobby BGM",
  roomBgm: "Room BGM",
  announcement: "Announcement",
  resultAnnouncement: "Result Announcement",
  countdown: "Countdown",
  dice: "Dice",
  ui: "UI Sound",
  ambience: "Ambience / Crowd",
};

const SECTION_ORDER: MixerSection[] = [
  "lobbyBgm",
  "roomBgm",
  "announcement",
  "resultAnnouncement",
  "countdown",
  "dice",
  "ui",
  "ambience",
];

function percent(value: number) {
  return Math.round(value * 100);
}

function clampVolume(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.min(Math.max(value, 0), 1);
}

export default function DevSoundMixerPage() {
  const [settings, setSettings] = useState<NaganiMixerSettings>(
    createDefaultNaganiMixerSettings()
  );
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [saveMessage, setSaveMessage] = useState("Loaded saved mixer settings.");

  const audioPoolRef = useRef<Map<string, HTMLAudioElement>>(new Map());

  const groupedItems = useMemo(() => {
    return NAGANI_SOUND_ITEMS.reduce<
      Partial<Record<MixerSection, NaganiSoundItem[]>>
    >((groups, item) => {
      groups[item.channel] = groups[item.channel] ?? [];
      groups[item.channel]?.push(item);
      return groups;
    }, {});
  }, []);

  useEffect(() => {
    setSettings(readNaganiMixerSettings());

    return () => {
      audioPoolRef.current.forEach((audio) => {
        audio.pause();
        audio.currentTime = 0;
      });
      audioPoolRef.current.clear();
    };
  }, []);

  useEffect(() => {
    audioPoolRef.current.forEach((audio, src) => {
      const item = NAGANI_SOUND_ITEMS.find((soundItem) => soundItem.src === src);

      if (!item) return;

      audio.volume = getFinalVolume(item);
    });
  }, [settings]);

  function saveSettings(nextSettings: NaganiMixerSettings) {
    setSettings(nextSettings);
    setHasUnsavedChanges(true);
    setSaveMessage("Unsaved changes. Click Save Settings to apply to game.");
  }

  function commitSettings() {
    writeNaganiMixerSettings(settings);
    setHasUnsavedChanges(false);
    setSaveMessage("Saved. Six Animal game will use this mixer setting.");
  }

  function updateChannelVolume(channel: NaganiSoundChannel, value: number) {
    saveSettings({
      ...settings,
      [channel]: {
        ...settings[channel],
        volume: clampVolume(value),
      },
    });
  }

  function toggleChannelMute(channel: NaganiSoundChannel) {
    saveSettings({
      ...settings,
      [channel]: {
        ...settings[channel],
        muted: !settings[channel].muted,
      },
    });
  }

  function updateItemVolume(itemKey: string, value: number) {
    const currentItemSetting = settings.items[itemKey] ?? {
      volume: 1,
      muted: false,
    };

    saveSettings({
      ...settings,
      items: {
        ...settings.items,
        [itemKey]: {
          ...currentItemSetting,
          volume: clampVolume(value),
        },
      },
    });
  }

  function toggleItemMute(itemKey: string) {
    const currentItemSetting = settings.items[itemKey] ?? {
      volume: 1,
      muted: false,
    };

    saveSettings({
      ...settings,
      items: {
        ...settings.items,
        [itemKey]: {
          ...currentItemSetting,
          muted: !currentItemSetting.muted,
        },
      },
    });
  }

  function getAudio(item: NaganiSoundItem) {
    const existingAudio = audioPoolRef.current.get(item.src);
    if (existingAudio) return existingAudio;

    const audio = new Audio(item.src);
    audio.preload = "auto";
    audio.loop = Boolean(item.loop);

    audioPoolRef.current.set(item.src, audio);

    return audio;
  }

  function getFinalVolume(item: NaganiSoundItem) {
    const master = settings.master;
    const channel = settings[item.channel];
    const itemSetting = settings.items[item.key] ?? {
      volume: 1,
      muted: false,
    };

    if (master.muted || channel.muted || itemSetting.muted) return 0;

    return clampVolume(master.volume * channel.volume * itemSetting.volume);
  }

  function playItem(item: NaganiSoundItem) {
    const audio = getAudio(item);

    audio.pause();
    audio.currentTime = 0;
    audio.volume = getFinalVolume(item);

    void audio.play().catch(() => undefined);
  }

  function stopItem(item: NaganiSoundItem) {
    const audio = audioPoolRef.current.get(item.src);
    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;
  }

  function stopAll() {
    audioPoolRef.current.forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
    });
  }

  function resetAll() {
    stopAll();

    const defaultSettings = createDefaultNaganiMixerSettings();

    resetNaganiMixerSettings();
    setSettings(defaultSettings);
    setHasUnsavedChanges(false);
    setSaveMessage("Defaults saved.");
  }

  return (
    <main className="min-h-screen bg-[#140704] px-4 py-5 text-[#f9e7b6]">
      <div className="mx-auto max-w-5xl space-y-5">
        <header className="rounded-3xl border border-[#d8a23a]/35 bg-[#2a0d07] p-5 shadow-2xl">
          <p className="text-xs uppercase tracking-[0.35em] text-[#d8a23a]">
            Nagani Developer Tool
          </p>

          <h1 className="mt-2 text-2xl font-black">Sound Mixer Control</h1>

          <p className="mt-2 text-sm text-[#f7d98a]/75">
            First make files inside each group equal. Then use the group volume
            to balance against BGM, dice, UI, and ambience.
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={stopAll}
              className="rounded-full border border-[#f7d98a]/35 px-4 py-2 text-sm font-bold"
            >
              Stop All
            </button>

            <button
              type="button"
              onClick={commitSettings}
              className="rounded-full bg-[#d8a23a] px-4 py-2 text-sm font-black text-[#210905]"
            >
              Save Settings
            </button>

            <button
              type="button"
              onClick={resetAll}
              className="rounded-full border border-[#f7d98a]/35 px-4 py-2 text-sm font-bold"
            >
              Reset Defaults
            </button>

            <span className="flex items-center text-xs font-bold text-[#f7d98a]/75">
              {hasUnsavedChanges ? "● " : "✓ "}
              {saveMessage}
            </span>
          </div>
        </header>

        <section className="rounded-3xl border border-[#d8a23a]/25 bg-[#1f0905] p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-black">Master Volume</h2>
              <p className="text-xs text-[#f7d98a]/65">
                Whole game sound {percent(settings.master.volume)}%
              </p>
            </div>

            <button
              type="button"
              onClick={() => toggleChannelMute("master")}
              className="rounded-full border border-[#f7d98a]/35 px-3 py-1 text-xs font-bold"
            >
              {settings.master.muted ? "Muted" : "On"}
            </button>
          </div>

          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={settings.master.volume}
            onChange={(event) =>
              updateChannelVolume("master", Number(event.target.value))
            }
            className="mt-4 w-full"
          />
        </section>

        <section className="space-y-4">
          {SECTION_ORDER.map((channel) => {
            const items = groupedItems[channel] ?? [];

            return (
              <article
                key={channel}
                className="rounded-3xl border border-[#d8a23a]/25 bg-[#1f0905] p-4"
              >
                <div className="rounded-2xl border border-[#d8a23a]/25 bg-[#240b06] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-black">
                        {CHANNEL_LABELS[channel]} Group Volume
                      </h2>
                      <p className="text-xs text-[#f7d98a]/65">
                        Group volume {percent(settings[channel].volume)}%
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleChannelMute(channel)}
                      className="rounded-full border border-[#f7d98a]/35 px-3 py-1 text-xs font-bold"
                    >
                      {settings[channel].muted ? "Muted" : "On"}
                    </button>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={settings[channel].volume}
                    onChange={(event) =>
                      updateChannelVolume(channel, Number(event.target.value))
                    }
                    className="mt-4 w-full"
                  />
                </div>

                <div className="mt-4 grid gap-3">
                  {items.map((item) => {
                    const itemSetting = settings.items[item.key] ?? {
                      volume: 1,
                      muted: false,
                    };

                    return (
                      <div
                        key={item.key}
                        className="rounded-2xl border border-[#f7d98a]/15 bg-black/20 p-3"
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <p className="font-bold">{item.label}</p>
                            <p className="break-all text-xs text-[#f7d98a]/50">
                              {item.src}
                            </p>
                            <p className="mt-1 text-xs text-[#f7d98a]/75">
                              File standard volume {percent(itemSetting.volume)}%
                            </p>
                            <p className="text-xs text-[#f7d98a]/55">
                              Test output now {percent(getFinalVolume(item))}%
                            </p>
                          </div>

                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => playItem(item)}
                              className="rounded-full bg-[#d8a23a] px-4 py-2 text-sm font-black text-[#210905]"
                            >
                              Play
                            </button>

                            <button
                              type="button"
                              onClick={() => stopItem(item)}
                              className="rounded-full border border-[#f7d98a]/35 px-4 py-2 text-sm font-bold"
                            >
                              Stop
                            </button>

                            <button
                              type="button"
                              onClick={() => toggleItemMute(item.key)}
                              className="rounded-full border border-[#f7d98a]/35 px-4 py-2 text-sm font-bold"
                            >
                              {itemSetting.muted ? "Muted" : "On"}
                            </button>
                          </div>
                        </div>

                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.01"
                          value={itemSetting.volume}
                          onChange={(event) =>
                            updateItemVolume(item.key, Number(event.target.value))
                          }
                          className="mt-3 w-full"
                        />
                      </div>
                    );
                  })}
                </div>
              </article>
            );
          })}
        </section>
      </div>
    </main>
  );
}