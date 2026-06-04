//src<components>games>six-animal>SixAnimalBetConsole.tsx

type SixAnimalBetConsoleProps = {
  selectedAnimalName: string | null;
  betAmount: string;
  amountLabel: string;
  minBetLabel: string;
  isBetValid: boolean;
  isRolling: boolean;
  onBetAmountChange: (value: string) => void;
  onConfirmBet: () => void;
};

function formatMMK(amount: number) {
  return new Intl.NumberFormat("en-US").format(amount);
}

export default function SixAnimalBetConsole({
  selectedAnimalName,
  betAmount,
  amountLabel,
  minBetLabel,
  isBetValid,
  isRolling,
  onBetAmountChange,
  onConfirmBet,
}: SixAnimalBetConsoleProps) {
  return (
    <section className="mt-6 rounded-[1.75rem] border border-amber-400/20 bg-black/45 p-4 shadow-xl shadow-black/40">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-200/60">
            Bet Console
          </p>
          <h2 className="mt-2 truncate text-2xl font-black text-amber-100">
            {selectedAnimalName ?? "Select animal"}
          </h2>
        </div>

        <div className="shrink-0 text-right">
          <p className="text-xs text-white/40">Amount</p>
          <p className="mt-1 text-xl font-black text-amber-100">
            {amountLabel}
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
        <input
          value={betAmount}
          onChange={(event) => onBetAmountChange(event.target.value)}
          inputMode="numeric"
          className="w-full bg-transparent text-2xl font-black text-amber-100 outline-none placeholder:text-white/20"
          placeholder="1000"
        />
        <p className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-white/35">
          MMK Bet Amount
        </p>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        {[1000, 5000, 10000].map((amount) => (
          <button
            key={amount}
            type="button"
            onClick={() => onBetAmountChange(String(amount))}
            className="rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-2 text-xs font-black text-amber-100 transition hover:bg-amber-300 hover:text-black"
          >
            {formatMMK(amount)}
          </button>
        ))}
      </div>

      <button
        type="button"
        disabled={!isBetValid || isRolling}
        onClick={onConfirmBet}
        className={
          isBetValid && !isRolling
            ? "mt-4 w-full rounded-full bg-gradient-to-b from-amber-200 to-amber-400 px-5 py-4 text-sm font-black text-black shadow-xl shadow-amber-950/40 transition active:scale-[0.98]"
            : "mt-4 w-full rounded-full bg-white/10 px-5 py-4 text-sm font-black text-white/35"
        }
      >
        {isRolling ? "Rolling..." : "Confirm Bet"}
      </button>

      {!isBetValid && (
        <p className="mt-3 text-center text-xs font-bold text-red-200/60">
          Select one animal and enter at least {minBetLabel} MMK.
        </p>
      )}
    </section>
  );
}