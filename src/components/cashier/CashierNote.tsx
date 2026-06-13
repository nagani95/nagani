// src/components/cashier/CashierNote.tsx

export default function CashierNote() {
  return (
    <section className="mt-6 rounded-[1.75rem] border border-emerald-400/15 bg-emerald-400/5 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-200/60">
            Cashier Note
          </p>
          <h3 className="mt-2 text-lg font-black text-amber-100">
            Wallet Request Guide
          </h3>
        </div>

        <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-emerald-100">
          Review
        </div>
      </div>

      <div className="mt-4 space-y-3 text-sm leading-6 text-white/65">
        <p>
          <span className="font-black text-amber-100">1.</span> Submit a deposit
          or withdraw request.
        </p>

        <p>
          <span className="font-black text-amber-100">2.</span> Your request
          stays pending while the cashier reviews it.
        </p>

        <p>
          <span className="font-black text-amber-100">3.</span> Confirmed
          requests update your wallet balance.
        </p>

        <p>
          <span className="font-black text-amber-100">4.</span> Rejected
          requests will remain visible in your wallet ticket history.
        </p>
      </div>

      <p className="mt-4 rounded-2xl border border-white/10 bg-black/25 p-3 text-xs leading-5 text-white/40">
        Please check your request amount and note before submitting. Wallet
        tickets are reviewed before your balance is updated.
      </p>
    </section>
  );
}