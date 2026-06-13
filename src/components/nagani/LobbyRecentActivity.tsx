// src/components/nagani/LobbyRecentActivity.tsx

const activities = [
  {
    label: "၆ ကောင်ဂျင်",
    detail: "Six Animal live room is ready for MVP play.",
    value: "Open",
  },
  {
    label: "Wallet",
    detail: "Check your balance before entering the table.",
    value: "Secure",
  },
  {
    label: "Player Center",
    detail: "Use cashier, history, and profile from the lobby.",
    value: "Ready",
  },
];

export default function LobbyRecentActivity() {
  return (
    <section className="mt-6 rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-white/40">
            Player Center
          </p>
          <h3 className="mt-2 text-lg font-black text-amber-100">
            Nagani Table Status
          </h3>
        </div>

        <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-emerald-100">
          Active
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {activities.map((activity) => (
          <div
            key={`${activity.label}-${activity.value}`}
            className="rounded-2xl border border-amber-400/10 bg-black/25 p-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-black text-amber-100">
                  {activity.label}
                </p>
                <p className="mt-1 text-xs leading-5 text-white/45">
                  {activity.detail}
                </p>
              </div>

              <p className="max-w-[9rem] text-right text-sm font-black text-emerald-100">
                {activity.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-4 text-xs leading-5 text-white/40">
        Enter the Six Animal room, place your bet, watch the dice result, and
        review your wallet activity from the player center.
      </p>
    </section>
  );
}