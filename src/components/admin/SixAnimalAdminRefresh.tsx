//src>components>admin>SixAnimalAdminRefresh.tsx

"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type SixAnimalAdminRefreshProps = {
  phase: string | null;
  targetTime: string | null;
  generatedAt: string;
};

function formatRemaining(ms: number) {
  if (ms <= 0) return "00:00";

  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0"
  )}`;
}

function getPhaseLabel(phase: string | null) {
  if (!phase) return "Waiting";

  if (phase === "betting") return "Betting ends in";
  if (phase === "closed") return "Rolling starts in";
  if (phase === "rolling") return "Result reveals in";
  if (phase === "result") return "Next round starts in";

  return "Phase target";
}

export default function SixAnimalAdminRefresh({
  phase,
  targetTime,
  generatedAt,
}: SixAnimalAdminRefreshProps) {
  const router = useRouter();
  const [now, setNow] = useState(() => Date.now());

  const targetMs = useMemo(() => {
    if (!targetTime) return null;

    const parsed = new Date(targetTime).getTime();
    return Number.isNaN(parsed) ? null : parsed;
  }, [targetTime]);

  const generatedLabel = useMemo(() => {
    return new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Yangon",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(new Date(generatedAt));
  }, [generatedAt]);

  useEffect(() => {
    const tickTimer = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    const refreshTimer = window.setInterval(() => {
      router.refresh();
    }, 5000);

    return () => {
      window.clearInterval(tickTimer);
      window.clearInterval(refreshTimer);
    };
  }, [router]);

  const remainingLabel =
    targetMs === null ? "—" : formatRemaining(targetMs - now);

  return (
    <section className="mt-6 rounded-[1.5rem] border border-sky-400/20 bg-sky-950/20 p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-sky-200/55">
            Live Admin Refresh
          </p>

          <h2 className="mt-2 text-2xl font-black text-amber-100">
            {getPhaseLabel(phase)}{" "}
            <span className="text-sky-100">{remainingLabel}</span>
          </h2>

          <p className="mt-2 text-xs font-bold text-white/35">
            Page snapshot generated at {generatedLabel} Myanmar time.
          </p>
        </div>

        <button
          type="button"
          onClick={() => router.refresh()}
          className="w-fit rounded-full border border-sky-300/25 bg-sky-300/10 px-5 py-3 text-sm font-black text-sky-100 transition hover:bg-sky-300 hover:text-black"
        >
          Refresh Now
        </button>
      </div>

      <p className="mt-4 text-xs leading-5 text-white/45">
        Auto-refresh reads backend state every 5 seconds. It does not advance
        rounds, settle bets, change wallet balances, or control player dice.
      </p>
    </section>
  );
}