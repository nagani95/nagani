// src/components/games/six-animal/SixAnimalBettingCommandPanel.tsx

type SixAnimalBettingCommandPanelProps = {
  commandBarClass: string;
  timerLabel: string;
  walletBalanceLabel: string;
};

const ROYAL_TOP_BAR_BOARD =
  "/assets/nagani/six-animal/ui/royal-top-bar-board-v1.png";

function formatTimerLabel(label: string) {
  if (label === "Rolling") return "လှိမ့်နေသည်";
  if (label === "Starting") return "စတင်နေသည်";

  return label.replace("s", " စက္ကန့်");
}

function formatBalanceLabel(label: string) {
  return label.replace("MMK", "ကျပ်");
}

function getTimerSeconds(label: string) {
  const seconds = Number(label.replace("s", ""));

  return Number.isFinite(seconds) ? seconds : null;
}

export default function SixAnimalBettingCommandPanel({
  commandBarClass,
  timerLabel,
  walletBalanceLabel,
}: SixAnimalBettingCommandPanelProps) {
  const timerSeconds = getTimerSeconds(timerLabel);
  const isUrgentTimer =
    timerSeconds !== null && timerSeconds > 0 && timerSeconds <= 5;

  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-[1.35rem] border border-[#d6a84f]/30 bg-[#090202] p-1.5 shadow-[0_10px_26px_rgba(0,0,0,0.52),inset_0_1px_0_rgba(255,215,122,0.14)] ${commandBarClass}`}
    >
      <div className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(180deg,#4a1608,#1a0303,#090202)]" />

      <img
        src={ROYAL_TOP_BAR_BOARD}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 h-full w-full object-fill opacity-100 brightness-[0.78] saturate-[1.08]"
      />

      <div className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(180deg,rgba(255,215,122,0.06),rgba(0,0,0,0.42))]" />
      <div className="pointer-events-none absolute inset-x-7 top-0 z-0 h-px bg-gradient-to-r from-transparent via-[#ffd77a]/65 to-transparent" />

      <div className="relative z-10 grid grid-cols-[0.72fr_1.28fr] gap-2">
        <div
          className={`relative flex min-h-[54px] items-center justify-center overflow-hidden rounded-[1rem] border px-2.5 py-2 text-center shadow-inner shadow-black/50 ${
            isUrgentTimer
              ? "border-[#ffd77a]/46 bg-[linear-gradient(145deg,#78350f,#2a1209,#090202)]"
              : "border-[#d6a84f]/28 bg-[linear-gradient(145deg,#2a1209,#090202)]"
          }`}
        >
          {isUrgentTimer ? (
            <div className="pointer-events-none absolute inset-0 animate-[naganiTimerPulse_1.45s_ease-in-out_infinite] bg-[radial-gradient(circle_at_50%_45%,rgba(255,215,122,0.2),transparent_68%)]" />
          ) : null}

          <div className="relative z-10">
            <p className="text-[8px] font-black tracking-[0.18em] text-[#f7dfaa]/58">
              အချိန်
            </p>

            <p
              className={`mt-1 text-[1.08rem] font-black leading-none drop-shadow-[0_1px_3px_rgba(0,0,0,0.85)] ${
                isUrgentTimer ? "text-[#fff3d0]" : "text-[#ffd77a]"
              }`}
            >
              {formatTimerLabel(timerLabel)}
            </p>
          </div>
        </div>

        <div className="relative flex min-h-[54px] items-center justify-center overflow-hidden rounded-[1rem] border border-[#d6a84f]/28 bg-[linear-gradient(145deg,#2a1209,#090202)] px-2.5 py-2 text-center shadow-inner shadow-black/50">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_25%,rgba(255,215,122,0.08),transparent_64%)]" />

          <div className="relative z-10">
            <p className="text-[8px] font-black tracking-[0.18em] text-[#f7dfaa]/58">
              လက်ကျန်ငွေ
            </p>

            <p className="mt-1 text-[1rem] font-black leading-none text-[#fff3d0] drop-shadow-[0_1px_3px_rgba(0,0,0,0.85)]">
              {formatBalanceLabel(walletBalanceLabel)}
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes naganiTimerPulse {
          0%,
          100% {
            opacity: 0.22;
            transform: scale(0.98);
          }

          50% {
            opacity: 1;
            transform: scale(1.04);
          }
        }
      `}</style>
    </div>
  );
}