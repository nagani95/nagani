// src/components/nagani-v2/NaganiHomeTopControls.tsx

"use client";

import { useEffect, useState } from "react";

const BGM_MUTED_KEY = "nagani-lobby-bgm-muted-v1";

export default function NaganiHomeTopControls() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [canUseFullscreen, setCanUseFullscreen] = useState(false);
  const [isBgmMuted, setIsBgmMuted] = useState(false);

  useEffect(() => {
    setCanUseFullscreen(Boolean(document.fullscreenEnabled));
    setIsBgmMuted(localStorage.getItem(BGM_MUTED_KEY) === "1");

    function syncFullscreenState() {
      setIsFullscreen(Boolean(document.fullscreenElement));
    }

    function syncBgmMutedState(event: Event) {
      const customEvent = event as CustomEvent<{ muted: boolean }>;

      if (typeof customEvent.detail?.muted === "boolean") {
        setIsBgmMuted(customEvent.detail.muted);
        return;
      }

      setIsBgmMuted(localStorage.getItem(BGM_MUTED_KEY) === "1");
    }

    syncFullscreenState();

    document.addEventListener("fullscreenchange", syncFullscreenState);
    window.addEventListener("nagani:lobby-bgm-muted-change", syncBgmMutedState);

    return () => {
      document.removeEventListener("fullscreenchange", syncFullscreenState);
      window.removeEventListener(
        "nagani:lobby-bgm-muted-change",
        syncBgmMutedState
      );
    };
  }, []);

  function handleBgmClick() {
    window.dispatchEvent(new Event("nagani:lobby-bgm-toggle"));
  }

  async function handleFullscreenClick() {
    if (!canUseFullscreen) return;

    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        return;
      }

      await document.exitFullscreen();
    } catch {
      setIsFullscreen(false);
    }
  }

  return (
    <>
      <div className="absolute right-[6.5%] top-[3.2%] z-30 flex flex-col items-end gap-2">
        <div
          style={{
            animation: "naganiLiveBreathe 1.85s ease-in-out infinite",
          }}
          className="relative overflow-hidden rounded-full border border-[#ffd77a]/45 bg-[#090202]/52 px-4 py-1.5 text-[0.7rem] font-black text-[#fff3d0] shadow-lg shadow-black/45 backdrop-blur-md"
        >
          <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,215,122,0.26),transparent_62%)]" />
          <span className="pointer-events-none absolute inset-y-0 -left-8 w-7 rotate-12 bg-white/20 blur-[1px] animate-[naganiLiveShine_2.4s_ease-in-out_infinite]" />
          <span className="relative">Live</span>
        </div>

        <button
          type="button"
          onClick={handleBgmClick}
          style={{
            animation: isBgmMuted
              ? "naganiSpeakerMutedHint 1.9s ease-in-out infinite"
              : "naganiSpeakerAlive 1.7s ease-in-out infinite",
          }}
          className={`relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border text-lg font-black shadow-lg shadow-black/45 backdrop-blur-md active:scale-[0.96] ${
            isBgmMuted
              ? "border-[#ffb4b4]/35 bg-[#090202]/52 text-[#ffd1d1]"
              : "border-[#ffd77a]/42 bg-[#090202]/52 text-[#ffd77a]"
          }`}
          aria-label={
            isBgmMuted ? "နောက်ခံတေးဂီတ ဖွင့်ရန်" : "နောက်ခံတေးဂီတ ပိတ်ရန်"
          }
        >
          <span className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_22%,rgba(255,215,122,0.22),transparent_64%)]" />
          <span className="relative z-10">{isBgmMuted ? "🔇" : "🔊"}</span>
        </button>

        {canUseFullscreen ? (
          <button
            type="button"
            onClick={handleFullscreenClick}
            style={{
              animation: !isFullscreen
                ? "naganiFullscreenHint 1.65s ease-in-out infinite"
                : undefined,
            }}
            className={`relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border text-lg font-black shadow-lg shadow-black/45 backdrop-blur-md active:scale-[0.96] ${
              isFullscreen
                ? "border-[#ffd77a]/35 bg-[#090202]/48 text-[#ffd77a]"
                : "border-[#ffe1a3]/55 bg-[#9b651d]/72 text-[#fff7e3]"
            }`}
            aria-label={
              isFullscreen
                ? "မျက်နှာပြင်အပြည့်မှ ထွက်ရန်"
                : "မျက်နှာပြင်အပြည့် ဖွင့်ရန်"
            }
            title={
              isFullscreen
                ? "မျက်နှာပြင်အပြည့်မှ ထွက်ရန်"
                : "မျက်နှာပြင်အပြည့်"
            }
          >
            <span className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_18%,rgba(255,243,208,0.30),transparent_62%)]" />
            <span className="pointer-events-none absolute inset-[-3px] rounded-full border border-[#fff0b8]/20" />
            <span className="relative z-10">{isFullscreen ? "×" : "⛶"}</span>
          </button>
        ) : null}
      </div>

      <style jsx global>{`
        @keyframes naganiLiveBreathe {
          0%,
          100% {
            transform: scale(1);
            box-shadow:
              0 10px 18px rgba(0, 0, 0, 0.45),
              0 0 0 rgba(255, 215, 122, 0);
          }

          50% {
            transform: scale(1.055);
            box-shadow:
              0 10px 18px rgba(0, 0, 0, 0.45),
              0 0 16px rgba(255, 215, 122, 0.34);
          }
        }

        @keyframes naganiLiveShine {
          0%,
          45% {
            transform: translateX(-130%) rotate(12deg);
            opacity: 0;
          }

          62% {
            opacity: 0.85;
          }

          100% {
            transform: translateX(520%) rotate(12deg);
            opacity: 0;
          }
        }

        @keyframes naganiSpeakerAlive {
          0%,
          100% {
            transform: scale(1);
            box-shadow:
              0 10px 18px rgba(0, 0, 0, 0.45),
              0 0 0 rgba(255, 215, 122, 0);
          }

          50% {
            transform: scale(1.06);
            box-shadow:
              0 10px 18px rgba(0, 0, 0, 0.45),
              0 0 17px rgba(255, 215, 122, 0.34);
          }
        }

        @keyframes naganiSpeakerMutedHint {
          0%,
          100% {
            transform: scale(1);
            box-shadow:
              0 10px 18px rgba(0, 0, 0, 0.45),
              0 0 0 rgba(255, 180, 180, 0);
          }

          50% {
            transform: scale(1.045);
            box-shadow:
              0 10px 18px rgba(0, 0, 0, 0.45),
              0 0 14px rgba(255, 180, 180, 0.26);
          }
        }

        @keyframes naganiFullscreenHint {
          0%,
          100% {
            transform: rotateY(0deg) scale(1);
            box-shadow:
              0 10px 18px rgba(0, 0, 0, 0.45),
              0 0 0 rgba(255, 215, 122, 0);
          }

          38% {
            transform: rotateY(180deg) scale(1.1);
            box-shadow:
              0 10px 18px rgba(0, 0, 0, 0.45),
              0 0 20px rgba(255, 215, 122, 0.46),
              0 0 34px rgba(255, 215, 122, 0.22);
          }

          62% {
            transform: rotateY(360deg) scale(1.035);
          }
        }
      `}</style>
    </>
  );
}