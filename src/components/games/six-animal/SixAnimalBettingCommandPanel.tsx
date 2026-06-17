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
      className={`shrink-0 rounded-[1.2rem] border p-1 shadow-xl shadow-black/35 backdrop-blur-md ${commandBarClass}`}
    >
      <div className="grid grid-cols-[0.74fr_1.26fr] gap-1.5">
        <div className="flex min-h-[50px] items-center justify-center rounded-[1rem] border border-[#d6a84f]/22 bg-black/30 px-2.5 py-2 text-center shadow-inner shadow-black/30">
          <div>
            <p className="text-[8px] font-black tracking-[0.16em] text-[#f7dfaa]/50">
              အချိန်
            </p>

            <p className="mt-1 text-[1rem] font-black leading-none text-[#ffd77a]">
              {formatTimerLabel(timerLabel)}
            </p>
          </div>
        </div>

        <div className="flex min-h-[50px] items-center justify-center rounded-[1rem] border border-[#d6a84f]/22 bg-black/30 px-2.5 py-2 text-center shadow-inner shadow-black/30">
          <div>
            <p className="text-[8px] font-black tracking-[0.16em] text-[#f7dfaa]/50">
              လက်ကျန်ငွေ
            </p>

            <p className="mt-1 text-[0.95rem] font-black leading-none text-[#fff3d0]">
              {formatBalanceLabel(walletBalanceLabel)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}