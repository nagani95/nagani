//src>components>profile>ProfileStatsGrid.tsx

type ProfileStat = {
  label: string;
  value: string;
};

type ProfileStatsGridProps = {
  stats: ProfileStat[];
};

export default function ProfileStatsGrid({ stats }: ProfileStatsGridProps) {
  return (
    <section className="mt-6 grid grid-cols-2 gap-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-[1.5rem] border border-amber-400/15 bg-black/45 p-4 shadow-lg shadow-black/20"
        >
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/35">
            {stat.label}
          </p>
          <p className="mt-2 text-2xl font-black text-amber-100">
            {stat.value}
          </p>
        </div>
      ))}
    </section>
  );
}