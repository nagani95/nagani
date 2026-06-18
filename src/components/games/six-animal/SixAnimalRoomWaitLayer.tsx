// src/components/games/six-animal/SixAnimalRoomWaitLayer.tsx

"use client";

import { useEffect, useRef } from "react";

type RoomWaitPhase = "loading" | "betting" | "closed" | "rolling" | "result";

type SixAnimalRoomWaitLayerProps = {
  phase: RoomWaitPhase;
  countdown: number;
  announcementKey?: string;
  isAudioUnlocked?: boolean;
  onAnnounce?: (announcementKey: string) => boolean;
};

function getWaitTitle(phase: RoomWaitPhase) {
  if (phase === "closed") return "လောင်းကြေး ပိတ်ထားပါသည်";
  if (phase === "rolling") return "လက်ရှိပွဲစဉ် ကစားနေပါသည်";
  if (phase === "result") return "ရလဒ် ပြသနေပါသည်";

  return "နောက်ပွဲစဉ်ကို စောင့်နေပါသည်";
}

function getWaitSubtitle(phase: RoomWaitPhase) {
  if (phase === "closed") {
    return "ယခုပွဲစဉ် စတင်ပြီးဖြစ်သောကြောင့် နောက်လောင်းကြေးဖွင့်ချိန်တွင် ဝင်ရောက်နိုင်ပါမည်";
  }

  if (phase === "rolling") {
    return "အန်စာတုံး လှိမ့်နေပါသည်။ နောက်ပွဲစဉ် လောင်းကြေးဖွင့်ချိန်တွင် အလိုအလျောက် ဝင်ရောက်ပါမည်";
  }

  if (phase === "result") {
    return "ရလဒ်ပြသပြီးဆုံးသည်နှင့် နောက်ပွဲစဉ် လောင်းကြေးဖွင့်ပါမည်";
  }

  return "လောင်းကြေးဖွင့်ချိန်ရောက်သည်နှင့် အလိုအလျောက် ဝင်ရောက်ပါမည်";
}

export default function SixAnimalRoomWaitLayer({
  phase,
  countdown,
  announcementKey,
  isAudioUnlocked = false,
  onAnnounce,
}: SixAnimalRoomWaitLayerProps) {
  const lastAnnouncementKeyRef = useRef<string | null>(null);

  useEffect(() => {
    if (!announcementKey) return;
    if (!isAudioUnlocked) return;
    if (!onAnnounce) return;
    if (lastAnnouncementKeyRef.current === announcementKey) return;

    const didAnnounce = onAnnounce(announcementKey);

    if (didAnnounce) {
      lastAnnouncementKeyRef.current = announcementKey;
    }
  }, [announcementKey, isAudioUnlocked, onAnnounce]);

  const safeCountdown = Math.max(0, Math.ceil(countdown));
  const countdownLabel =
    safeCountdown > 0 ? `${safeCountdown}s` : "ဝင်ရောက်နေပါသည်";

  return (
    <div className="pointer-events-none absolute inset-0 z-40 flex items-center justify-center px-4">
      <div className="w-full max-w-[330px] overflow-hidden rounded-[1.55rem] border border-[#d6a84f]/28 bg-[#090202]/72 p-4 text-center shadow-[0_18px_54px_rgba(0,0,0,0.72),inset_0_1px_0_rgba(255,215,122,0.12)] backdrop-blur-[8px]">
        <div className="mx-auto mb-3 h-px w-24 bg-gradient-to-r from-transparent via-[#ffd77a]/70 to-transparent" />

        <h2 className="text-base font-black text-[#ffd77a]">
          {getWaitTitle(phase)}
        </h2>

        <p className="mt-2 min-h-[3rem] text-xs font-semibold leading-5 text-[#fff3d0]/72">
          {getWaitSubtitle(phase)}
        </p>

        <div className="mt-4 flex justify-center">
          <div className="min-w-[180px] rounded-full border border-[#d6a84f]/25 bg-black/45 px-4 py-2 shadow-inner shadow-black/50">
            <span className="mr-2 text-xs font-bold text-[#f7dfaa]/60">
              ခန့်မှန်းကြာချိန်
            </span>
            <span className="text-lg font-black tabular-nums text-[#ffd77a]">
              {countdownLabel}
            </span>
          </div>
        </div>

        <div className="mt-4 overflow-hidden rounded-full border border-[#d6a84f]/16 bg-black/45 p-[2px]">
          <div className="h-2 rounded-full bg-[linear-gradient(90deg,rgba(143,100,34,0.22),rgba(214,168,79,0.52),rgba(255,215,122,0.72),rgba(214,168,79,0.52),rgba(143,100,34,0.22))]" />
        </div>
      </div>
    </div>
  );
}