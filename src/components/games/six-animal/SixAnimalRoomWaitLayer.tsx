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
  if (phase === "closed") return "ယခုပွဲစဉ် ဝင်ရောက်ခွင့် ပိတ်ထားပါသည်";
  if (phase === "rolling") return "နောက်ပွဲစဉ်ကို စောင့်ဆိုင်းနေပါသည်";
  if (phase === "result") return "နောက်လောင်းကြေးဖွင့်ချိန်ကို စောင့်နေပါသည်";

  return "နောက်ပွဲစဉ်ကို စောင့်ဆိုင်းနေပါသည်";
}

function getWaitSubtitle(phase: RoomWaitPhase) {
  if (phase === "closed") {
    return "ယခုပွဲစဉ်တွင် လောင်းကြေးမပါဝင်ထားသောကြောင့် နောက်လောင်းကြေးဖွင့်ချိန်တွင်သာ ဝင်ရောက်ကစားနိုင်ပါမည်";
  }

  if (phase === "rolling") {
    return "ယခုပွဲစဉ်တွင် လောင်းကြေးမပါဝင်ထားသောကြောင့် ရလဒ်ပြသမှုကို ကြည့်ရှုခွင့်မရှိပါ";
  }

  if (phase === "result") {
    return "ကစားထားသောသူများအတွက်သာ ရလဒ်ပြသပါသည်။ နောက်ပွဲစဉ် စတင်သည်နှင့် လောင်းကြေးထိုးနိုင်ပါမည်";
  }

  return "လောင်းကြေးဖွင့်ချိန်ရောက်သည်နှင့် အလိုအလျောက် ဝင်ရောက်နိုင်ပါမည်";
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
    <div className="pointer-events-auto absolute inset-0 z-40 flex items-center justify-center overflow-hidden bg-[#050101]/88 px-4 text-center backdrop-blur-[10px]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_32%,rgba(255,215,122,0.08)_0%,transparent_36%,rgba(0,0,0,0.72)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.46),rgba(8,2,2,0.86)_48%,rgba(0,0,0,0.96)_100%)]" />

      <div className="relative w-full max-w-[342px] overflow-hidden rounded-[1.8rem] border border-[#d6a84f]/36 bg-[linear-gradient(180deg,rgba(38,12,7,0.96),rgba(9,2,2,0.98))] p-5 shadow-[0_28px_84px_rgba(0,0,0,0.86),inset_0_1px_0_rgba(255,215,122,0.13)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,215,122,0.16),transparent_58%)]" />
        <div className="pointer-events-none absolute inset-[1px] rounded-[calc(1.8rem-1px)] border border-[#fff3d0]/8" />

        <div className="relative z-10">
          <div className="mx-auto mb-4 h-px w-28 bg-gradient-to-r from-transparent via-[#ffd77a]/78 to-transparent" />

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#d6a84f]/34 bg-black/42 text-2xl shadow-inner shadow-black/70">
            🔒
          </div>

          <h2 className="mt-4 text-[1.05rem] font-black leading-7 text-[#ffd77a] drop-shadow-[0_2px_8px_rgba(0,0,0,0.84)]">
            {getWaitTitle(phase)}
          </h2>

          <p className="mt-3 min-h-[4.25rem] text-[0.82rem] font-semibold leading-6 text-[#fff3d0]/76">
            {getWaitSubtitle(phase)}
          </p>

          <div className="mt-4 flex justify-center">
            <div className="min-w-[188px] rounded-full border border-[#d6a84f]/28 bg-black/58 px-4 py-2 shadow-inner shadow-black/60">
              <span className="mr-2 text-xs font-bold text-[#f7dfaa]/58">
                နောက်ပွဲစဉ်
              </span>
              <span className="text-lg font-black tabular-nums text-[#ffd77a]">
                {countdownLabel}
              </span>
            </div>
          </div>

          <div className="mt-5 overflow-hidden rounded-full border border-[#d6a84f]/18 bg-black/56 p-[3px]">
            <div className="relative h-2 overflow-hidden rounded-full bg-[linear-gradient(180deg,rgba(255,243,208,0.04),rgba(0,0,0,0.24))]">
              <div className="absolute inset-y-0 left-0 w-[42%] animate-[naganiWaitLoading_1.55s_ease-in-out_infinite] rounded-full bg-[linear-gradient(90deg,#6f4712_0%,#b67a20_26%,#f0c35d_52%,#fff0b8_72%,#d9a33d_100%)] shadow-[0_0_16px_rgba(255,215,122,0.42)]" />
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes naganiWaitLoading {
          0% {
            transform: translateX(-125%);
          }

          100% {
            transform: translateX(260%);
          }
        }
      `}</style>
    </div>
  );
}