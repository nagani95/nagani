//src>components>history>HistoryFilters.tsx

type HistoryFilter = "all" | "six-animal" | "thirty-six" | "wallet";

type HistoryFiltersProps = {
  activeFilter: HistoryFilter;
  onChangeFilter: (filter: HistoryFilter) => void;
};

const filters: { key: HistoryFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "six-animal", label: "၆ ကောင်ဂျင်" },
  { key: "thirty-six", label: "၃၆ ကောင်ထီ" },
  { key: "wallet", label: "Wallet" },
];

export default function HistoryFilters({
  activeFilter,
  onChangeFilter,
}: HistoryFiltersProps) {
  return (
    <section className="mt-6">
      <div className="flex gap-2 overflow-x-auto rounded-full border border-white/10 bg-black/35 p-1.5">
        {filters.map((filter) => (
          <button
            key={filter.key}
            type="button"
            onClick={() => onChangeFilter(filter.key)}
            className={
              activeFilter === filter.key
                ? "shrink-0 rounded-full bg-gradient-to-b from-amber-200 to-amber-400 px-4 py-3 text-xs font-black text-black shadow-lg shadow-amber-950/30"
                : "shrink-0 rounded-full px-4 py-3 text-xs font-bold text-amber-100/65 transition hover:bg-white/5 hover:text-amber-100"
            }
          >
            {filter.label}
          </button>
        ))}
      </div>
    </section>
  );
}