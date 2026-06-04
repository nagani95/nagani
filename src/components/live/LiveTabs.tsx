//src>components>live>LiveTabs.tsx

type LiveTab = "all" | "six-animal" | "thirty-six" | "winners";

type LiveTabsProps = {
  activeTab: LiveTab;
  onChangeTab: (tab: LiveTab) => void;
};

const tabs: { key: LiveTab; label: string }[] = [
  { key: "all", label: "All" },
  { key: "six-animal", label: "၆ ကောင်ဂျင်" },
  { key: "thirty-six", label: "၃၆ ကောင်ထီ" },
  { key: "winners", label: "Winners" },
];

export default function LiveTabs({ activeTab, onChangeTab }: LiveTabsProps) {
  return (
    <section className="mt-6">
      <div className="flex gap-2 overflow-x-auto rounded-full border border-white/10 bg-black/35 p-1.5">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => onChangeTab(tab.key)}
            className={
              activeTab === tab.key
                ? "shrink-0 rounded-full bg-gradient-to-b from-amber-200 to-amber-400 px-4 py-3 text-xs font-black text-black shadow-lg shadow-amber-950/30"
                : "shrink-0 rounded-full px-4 py-3 text-xs font-bold text-amber-100/65 transition hover:bg-white/5 hover:text-amber-100"
            }
          >
            {tab.label}
          </button>
        ))}
      </div>
    </section>
  );
}