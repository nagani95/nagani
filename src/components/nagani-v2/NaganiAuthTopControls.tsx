//src/components/nagani-v2/NaganiAuthTopControls.tsx

"use client";

import { useEffect, useState } from "react";

const BGM_MUTED_KEY = "nagani-lobby-bgm-muted-v1";

function SpeakerOnIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="relative z-10 h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 9v6h4l5 4V5l-5 4H5z" />
      <path d="M16 9.5a4.5 4.5 0 0 1 0 5" />
      <path d="M18.5 7a8 8 0 0 1 0 10" />
    </svg>
  );
}

function SpeakerMutedIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="relative z-10 h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 9v6h4l5 4V5l-5 4H5z" />
      <path d="M4 4l16 16" />
    </svg>
  );
}

function EnterFullscreenIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="relative z-10 h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 9V3h6" />
      <path d="M21 9V3h-6" />
      <path d="M3 15v6h6" />
      <path d="M21 15v6h-6" />
    </svg>
  );
}

function ExitFullscreenIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="relative z-10 h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M8 3v5H3" />
      <path d="M16 3v5h5" />
      <path d="M8 21v-5H3" />
      <path d="M16 21v-5h5" />
    </svg>
  );
}

export default function NaganiAuthTopControls() {
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
      <div className="absolute right-4 top-4 z-40 flex items-center gap-2">
        <button
          type="button"
          onClick={handleBgmClick}
          aria-label={
            isBgmMuted ? "နောက်ခံတေးသံ ဖွင့်ရန်" : "နောက်ခံတေးသံ ပိတ်ရန်"
          }
          title={isBgmMuted ? "တေးသံ ပိတ်ထားသည်" : "တေးသံ ဖွင့်ထားသည်"}
          className={`group relative flex h-10 w-10 items-center justify-center rounded-full border shadow-[0_10px_18px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.08)] transition duration-200 active:scale-[0.94] ${
            isBgmMuted
              ? "border-[#d6a84f]/26 bg-[linear-gradient(135deg,rgba(58,22,8,0.96),rgba(92,40,14,0.90),rgba(42,15,6,0.98))] text-[#eecb82]"
              : "border-[#ffe1a3]/34 bg-[linear-gradient(135deg,rgba(120,70,18,0.96),rgba(214,168,79,0.92),rgba(94,54,15,0.98))] text-[#fff7e3]"
          }`}
        >
          <span className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_18%,rgba(255,243,208,0.24),transparent_62%)]" />
          {isBgmMuted ? <SpeakerMutedIcon /> : <SpeakerOnIcon />}
        </button>

        {canUseFullscreen ? (
          <button
            type="button"
            onClick={handleFullscreenClick}
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
            style={{
              animation: !isFullscreen
                ? "naganiAuthFullscreenHint 1.65s ease-in-out infinite"
                : undefined,
            }}
            className={`group relative flex h-10 w-10 items-center justify-center rounded-full border shadow-[0_10px_18px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.08)] transition duration-200 active:scale-[0.94] ${
              isFullscreen
                ? "border-[#ffe1a3]/34 bg-[linear-gradient(135deg,rgba(120,70,18,0.96),rgba(214,168,79,0.92),rgba(94,54,15,0.98))] text-[#fff7e3]"
                : "border-[#ffe1a3]/48 bg-[linear-gradient(135deg,rgba(92,40,14,0.98),rgba(204,138,38,0.96),rgba(74,26,8,0.98))] text-[#fff7e3]"
            }`}
          >
            <span className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_18%,rgba(255,243,208,0.28),transparent_62%)]" />
            {isFullscreen ? <ExitFullscreenIcon /> : <EnterFullscreenIcon />}
          </button>
        ) : null}
      </div>

      <style jsx global>{`
        @keyframes naganiAuthFullscreenHint {
          0%,
          100% {
            transform: rotateY(0deg) scale(1);
            box-shadow:
              0 10px 18px rgba(0, 0, 0, 0.45),
              0 0 0 rgba(255, 215, 122, 0);
          }

          38% {
            transform: rotateY(180deg) scale(1.08);
            box-shadow:
              0 10px 18px rgba(0, 0, 0, 0.45),
              0 0 18px rgba(255, 215, 122, 0.42),
              0 0 26px rgba(255, 215, 122, 0.24);
          }

          62% {
            transform: rotateY(360deg) scale(1.03);
          }
        }
      `}</style>
    </>
  );
}