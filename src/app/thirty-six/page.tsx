//src>app>thirty-six>page.tsx

"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import ThirtySixBoard from "@/components/games/thirty-six/ThirtySixBoard";
import ThirtySixHero from "@/components/games/thirty-six/ThirtySixHero";
import AppShell from "@/components/layout/AppShell";

const MIN_BET = 1000;

function formatMMK(amount: number) {
  return new Intl.NumberFormat("en-US").format(amount);
}

export default function ThirtySixPage() {
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [betAmount, setBetAmount] = useState("1000");
  const [ticketMessage, setTicketMessage] = useState<string | null>(null);

  const numericBetAmount = Number(betAmount || 0);
  const totalBet = selectedNumbers.length * numericBetAmount;

  const canConfirm = selectedNumbers.length > 0 && numericBetAmount >= MIN_BET;

  const selectedLabel = useMemo(() => {
    if (selectedNumbers.length === 0) return "No numbers selected";

    return selectedNumbers
      .slice()
      .sort((a, b) => a - b)
      .join(", ");
  }, [selectedNumbers]);

  function handleToggleNumber(number: number) {
    setTicketMessage(null);

    setSelectedNumbers((current) => {
      if (current.includes(number)) {
        return current.filter((item) => item !== number);
      }

      return [...current, number];
    });
  }

  function handleClearTicket() {
    setSelectedNumbers([]);
    setTicketMessage(null);
  }

  function handleConfirmTicket() {
    if (!canConfirm) return;

    setTicketMessage(
      `Ticket prepared: ${selectedNumbers.length} number${
        selectedNumbers.length > 1 ? "s" : ""
      } · ${formatMMK(totalBet)} MMK`
    );
  }

  return (
    <AppShell>
      <header className="flex items-center justify-between">
        <Link href="/" className="text-sm font-bold text-amber-300">
          ← Lobby
        </Link>

        <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-200">
          Open
        </div>
      </header>

      <ThirtySixHero nextDrawLabel="Soon" />

      <ThirtySixBoard
        selectedNumbers={selectedNumbers}
        onToggleAnimal={handleToggleNumber}
      />

      <section className="mt-6 rounded-[2rem] border border-amber-400/20 bg-black/45 p-4 shadow-xl shadow-black/40">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-200/60">
              Bet Ticket
            </p>
            <h2 className="mt-2 text-2xl font-black text-amber-100">
              Prepare Draw
            </h2>
          </div>

          <button
            type="button"
            onClick={handleClearTicket}
            className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-black text-white/60"
          >
            Clear
          </button>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <label className="rounded-2xl border border-amber-400/15 bg-amber-400/10 p-3">
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-amber-200/55">
              Amount / Number
            </span>
            <input
              value={betAmount}
              onChange={(event) => {
                setBetAmount(event.target.value);
                setTicketMessage(null);
              }}
              inputMode="numeric"
              className="mt-2 w-full bg-transparent text-lg font-black text-amber-100 outline-none"
            />
          </label>

          <div className="rounded-2xl border border-emerald-400/15 bg-emerald-400/10 p-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-200/55">
              Total Bet
            </p>
            <p className="mt-2 text-lg font-black text-emerald-100">
              {formatMMK(totalBet)} MMK
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/35">
            Selected Numbers
          </p>
          <p className="mt-2 text-sm font-bold leading-6 text-amber-100">
            {selectedLabel}
          </p>
        </div>

        <button
          type="button"
          disabled={!canConfirm}
          onClick={handleConfirmTicket}
          className={
            canConfirm
              ? "mt-4 w-full rounded-2xl bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-500 px-4 py-4 text-sm font-black uppercase tracking-[0.22em] text-black shadow-xl shadow-amber-950/40"
              : "mt-4 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 text-sm font-black uppercase tracking-[0.22em] text-white/30"
          }
        >
          Confirm Ticket
        </button>

        {ticketMessage && (
          <div className="mt-4 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm font-bold text-emerald-100">
            {ticketMessage}
          </div>
        )}
      </section>
    </AppShell>
  );
}