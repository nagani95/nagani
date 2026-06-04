//src>components>history>HistoryRecordList.tsx

type HistoryItem = {
  id: string;
  type: string;
  title: string;
  detail: string;
  amount: number;
  status: string;
  payout: number;
  time: string;
};

type HistoryRecordListProps = {
  items: HistoryItem[];
};

function formatMMK(amount: number) {
  return new Intl.NumberFormat("en-US").format(amount);
}

function getStatusClass(status: string) {
  if (status === "Won" || status === "Confirmed") {
    return "border-emerald-400/20 bg-emerald-400/10 text-emerald-100";
  }

  if (status === "Lost") {
    return "border-red-400/20 bg-red-400/10 text-red-100";
  }

  return "border-amber-400/20 bg-amber-400/10 text-amber-100";
}

export default function HistoryRecordList({ items }: HistoryRecordListProps) {
  return (
    <section className="mt-5 space-y-3">
      {items.map((item) => (
        <article
          key={item.id}
          className="rounded-[1.5rem] border border-amber-400/15 bg-black/45 p-4 shadow-xl shadow-black/30"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="truncate text-xs font-bold text-white/35">
                {item.id}
              </p>
              <h2 className="mt-1 text-lg font-black text-amber-100">
                {item.title}
              </h2>
            </div>

            <div
              className={`shrink-0 rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] ${getStatusClass(
                item.status
              )}`}
            >
              {item.status}
            </div>
          </div>

          <p className="mt-3 text-sm leading-6 text-white/60">
            {item.detail}
          </p>

          <div className="mt-4 grid grid-cols-2 gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3">
            <div>
              <p className="text-xs text-white/35">Amount</p>
              <p className="mt-1 text-lg font-black text-amber-100">
                {formatMMK(item.amount)} MMK
              </p>
            </div>

            <div className="text-right">
              <p className="text-xs text-white/35">Payout</p>
              <p
                className={
                  item.payout > 0
                    ? "mt-1 text-lg font-black text-emerald-100"
                    : "mt-1 text-lg font-black text-white/35"
                }
              >
                {item.payout > 0 ? `${formatMMK(item.payout)} MMK` : "—"}
              </p>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3">
            <p className="text-xs text-white/35">{item.time}</p>
            <p className="text-xs font-bold text-white/45">Activity record</p>
          </div>
        </article>
      ))}
    </section>
  );
}