//src/components/games/six-animal/SixAnimalBettingCommandPanel.tsx

type SixAnimalBettingCommandPanelProps = {
  commandBarClass: string;
  timerLabel: string;
  walletBalanceLabel: string;
};

export default function SixAnimalBettingCommandPanel({
  commandBarClass,
  timerLabel,
  walletBalanceLabel,
}: SixAnimalBettingCommandPanelProps) {
  return (
    <div
      className={`shrink-0 rounded-[1.15rem] border p-1.5 shadow-xl shadow-black/35 backdrop-blur-md ${commandBarClass}`}
    >
      <div className="grid grid-cols-[0.92fr_1.08fr] gap-2">
        <div className="flex min-h-[68px] flex-col items-center justify-center rounded-2xl border border-emerald-300/20 bg-emerald-400/10 px-3 py-2 text-center">
          <p className="text-[9px] font-black uppercase tracking-[0.25em] text-amber-200/60">
            Timer
          </p>

          <p className="mt-0.5 text-2xl font-black leading-none text-white">
            {timerLabel}
          </p>
        </div>

        <div className="flex min-h-[68px] flex-col items-center justify-center rounded-2xl border border-emerald-300/20 bg-emerald-400/10 px-3 py-2 text-center">
          <p className="text-[9px] font-black uppercase tracking-[0.25em] text-emerald-100/55">
            Balance
          </p>

          <p className="mt-0.5 text-lg font-black leading-none text-emerald-100">
            {walletBalanceLabel}
          </p>
        </div>
      </div>
    </div>
  );
}