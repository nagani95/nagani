//src/components/games/six-animal/SixAnimalBettingCommandPanel.tsx

type SixAnimalBettingCommandPanelProps = {
  commandBarClass: string;
  timerLabel: string;
  walletBalanceLabel: string;
};

function formatTimerLabel(label: string) {
  if (label === "Rolling") return "လှိမ့်နေသည်";
  if (label === "Starting") return "စတင်နေသည်";

  return label.replace("s", " စက္ကန့်");
}

function formatBalanceLabel(label: string) {
  return label.replace("MMK", "ကျပ်");
}

export default function SixAnimalBettingCommandPanel({
  commandBarClass,
  timerLabel,
  walletBalanceLabel,
}: SixAnimalBettingCommandPanelProps) {
  return (
    <div
      className={`shrink-0 rounded-[1.35rem] border p-1.5 shadow-xl shadow-black/40 backdrop-blur-md ${commandBarClass}`}
    >
      <div className="grid grid-cols-[0.88fr_1.12fr] gap-2">
        <div className="flex min-h-[66px] flex-col items-center justify-center rounded-2xl border border-[#d6a84f]/24 bg-black/28 px-3 py-2 text-center shadow-inner shadow-black/30">
          <p className="text-[9px] font-black tracking-[0.18em] text-[#f7dfaa]/55">
            အချိန်
          </p>

          <p className="mt-1 text-xl font-black leading-none text-[#ffd77a]">
            {formatTimerLabel(timerLabel)}
          </p>
        </div>

        <div className="flex min-h-[66px] flex-col items-center justify-center rounded-2xl border border-[#d6a84f]/24 bg-black/28 px-3 py-2 text-center shadow-inner shadow-black/30">
          <p className="text-[9px] font-black tracking-[0.18em] text-[#f7dfaa]/55">
            လက်ကျန်ငွေ
          </p>

          <p className="mt-1 text-lg font-black leading-none text-[#fff3d0]">
            {formatBalanceLabel(walletBalanceLabel)}
          </p>
        </div>
      </div>
    </div>
  );
}