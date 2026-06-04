//src>components>cashier>CashierRecentTickets.tsx

type CashierTicket = {
  id: string;
  type: string;
  amount: number;
  status: string;
  time: string;
};

type CashierRecentTicketsProps = {
  tickets: CashierTicket[];
};

function formatMMK(amount: number) {
  return new Intl.NumberFormat("en-US").format(amount);
}

function getStatusClass(status: string) {
  if (status === "Confirmed") {
    return "border-emerald-400/20 bg-emerald-400/10 text-emerald-100";
  }

  if (status === "Rejected") {
    return "border-red-400/20 bg-red-400/10 text-red-100";
  }

  return "border-amber-400/20 bg-amber-400/10 text-amber-100";
}

export default function CashierRecentTickets({
  tickets,
}: CashierRecentTicketsProps) {
  return (
    <section className="mt-6 rounded-[1.75rem] border border-red-400/15 bg-red-950/10 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-200/60">
            Recent Wallet Tickets
          </p>
          <h3 className="mt-2 text-lg font-black text-amber-100">
            Settlement History
          </h3>
        </div>

        <div className="rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-amber-100">
          Ledger
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {tickets.map((ticket) => (
          <div
            key={ticket.id}
            className="rounded-2xl border border-white/10 bg-black/30 p-4 shadow-lg shadow-black/20"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="truncate text-xs font-bold text-white/35">
                  {ticket.id}
                </p>
                <p className="mt-1 text-lg font-black text-amber-100">
                  {ticket.type}
                </p>
              </div>

              <div className="shrink-0 text-right">
                <p className="text-sm font-black text-amber-100">
                  {formatMMK(ticket.amount)} MMK
                </p>
                <p
                  className={`mt-2 rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] ${getStatusClass(
                    ticket.status
                  )}`}
                >
                  {ticket.status}
                </p>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3">
              <p className="text-xs text-white/35">{ticket.time}</p>
              <p className="text-xs font-bold text-white/45">
                Wallet settlement
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}