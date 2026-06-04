//src>components>games>thirty-six>ThirtySixBetTicket.tsx

import type { ThirtySixAnimalOption } from "@/types/games";

type ThirtySixBetTicketProps = {
  selectedCount: number;
  selectedAnimals: ThirtySixAnimalOption[];
  betAmount: string;
  totalBetLabel: string;
  minBetLabel: string;
  isBetValid: boolean;
  onClearSelections: () => void;
  onToggleAnimal: (number: number) => void;
  onBetAmountChange: (value: string) => void;
  onConfirmBet: () => void;
};

function formatMMK(amount: number) {
  return new Intl.NumberFormat("en-US").format(amount);
}

export default function ThirtySixBetTicket({
  selectedCount,
  selectedAnimals,
  betAmount,
  totalBetLabel,
  minBetLabel,
  isBetValid,
  onClearSelections,
  onToggleAnimal,
  onBetAmountChange,
  onConfirmBet,
}: ThirtySixBetTicketProps) {
  return (
    <section className="mt-6 rounded-[1.75rem] border border-amber-400/20 bg-black/45 p-4 shadow-xl shadow-black/40">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-200/60">
            Draw Ticket
          </p>
          <h2 className="mt-2 text-2xl font-black text-amber-100">
            {selectedCount} Selected
          </h2>
        </div>

        <button
          type="button"
          onClick={onClearSelections}
          className="rounded-full border border-red-400/20 bg-red-400/10 px-3 py-2 text-xs font-black text-red-100 transition hover:bg-red-400/20"
        >
          Clear
        </button>
      </div>

      {selectedAnimals.length > 0 && (
        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {selectedAnimals.map((animal) => (
            <button
              key={animal.number}
              type="button"
              onClick={() => onToggleAnimal(animal.number)}
              className="shrink-0 rounded-full border border-amber-300/40 bg-gradient-to-b from-amber-200 to-amber-400 px-3 py-2 text-xs font-black text-black shadow-lg shadow-amber-950/25"
            >
              #{animal.number} ×
            </button>
          ))}
        </div>
      )}

      <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
        <input
          value={betAmount}
          onChange={(event) => onBetAmountChange(event.target.value)}
          inputMode="numeric"
          className="w-full bg-transparent text-2xl font-black text-amber-100 outline-none placeholder:text-white/20"
          placeholder="1000"
        />
        <p className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-white/35">
          MMK per selected number
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

      <div className="mt-4 grid grid-cols-2 gap-3 rounded-2xl border border-white/10 bg-black/30 p-3">
        <div>
          <p className="text-xs text-white/40">Ticket Lines</p>
          <p className="mt-1 text-xl font-black text-amber-100">
            {selectedCount}
          </p>
        </div>

        <div className="text-right">
          <p className="text-xs text-white/40">Total Bet</p>
          <p className="mt-1 text-xl font-black text-amber-100">
            {totalBetLabel}
          </p>
        </div>
      </div>

      <button
        type="button"
        disabled={!isBetValid}
        onClick={onConfirmBet}
        className={
          isBetValid
            ? "mt-4 w-full rounded-full bg-gradient-to-b from-amber-200 to-amber-400 px-5 py-4 text-sm font-black text-black shadow-xl shadow-amber-950/40 transition active:scale-[0.98]"
            : "mt-4 w-full rounded-full bg-white/10 px-5 py-4 text-sm font-black text-white/35"
        }
      >
        Confirm Draw Bet
      </button>

      {!isBetValid && (
        <p className="mt-3 text-center text-xs font-bold text-red-200/60">
          Select at least one number and enter at least {minBetLabel} MMK.
        </p>
      )}
    </section>
  );
}