// src/components/profile/ProfileAccountStatus.tsx

type AccountInfoItem = {
  label: string;
  value: string;
  tone: "green" | "gold";
};

const accountInfoItems: AccountInfoItem[] = [
  {
    label: "Wallet",
    value: "Available",
    tone: "green",
  },
  {
    label: "Six Animal",
    value: "Use Balance",
    tone: "gold",
  },
  {
    label: "Cashier",
    value: "Review Flow",
    tone: "gold",
  },
];

function getToneClass(tone: AccountInfoItem["tone"]) {
  if (tone === "green") {
    return "border-emerald-400/20 bg-emerald-400/10 text-emerald-100";
  }

  return "border-amber-400/20 bg-amber-400/10 text-amber-100";
}

export default function ProfileAccountStatus() {
  return (
    <section className="mt-6 rounded-[1.75rem] border border-emerald-400/15 bg-emerald-400/5 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-200/60">
            Account Center
          </p>
          <h3 className="mt-2 text-lg font-black text-amber-100">
            Member Guide
          </h3>
        </div>

        <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-emerald-100">
          Ready
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {accountInfoItems.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/30 px-4 py-3"
          >
            <p className="text-sm font-bold text-white/65">{item.label}</p>
            <p
              className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] ${getToneClass(
                item.tone
              )}`}
            >
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}