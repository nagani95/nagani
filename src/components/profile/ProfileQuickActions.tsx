//src>components>profile>ProfileQuickActions.tsx

import Link from "next/link";

const quickActions = [
  {
    label: "Open Cashier",
    href: "/cashier",
  },
  {
    label: "View History",
    href: "/history",
  },
  {
    label: "Live Results",
    href: "/live",
  },
];

export default function ProfileQuickActions() {
  return (
    <section className="mt-6 rounded-[1.75rem] border border-amber-400/20 bg-black/45 p-4 shadow-xl shadow-black/30">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-200/60">
            Quick Actions
          </p>
          <h3 className="mt-2 text-lg font-black text-amber-100">
            Member Center
          </h3>
        </div>

        <div className="rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-amber-100">
          Fast
        </div>
      </div>

      <div className="mt-4 grid gap-3">
        {quickActions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="group flex items-center justify-between rounded-2xl border border-amber-400/15 bg-amber-400/10 px-4 py-4 text-sm font-black text-amber-100 transition hover:bg-amber-300 hover:text-black"
          >
            <span>{action.label}</span>
            <span className="transition group-hover:translate-x-0.5">→</span>
          </Link>
        ))}
      </div>
    </section>
  );
}