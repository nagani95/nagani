//src>components>profile>ProfileMemberCard.tsx

type ProfileMemberCardProps = {
  memberName: string;
  memberId: string;
  balanceLabel: string;
};

export default function ProfileMemberCard({
  memberName,
  memberId,
  balanceLabel,
}: ProfileMemberCardProps) {
  return (
    <section className="relative mt-6 overflow-hidden rounded-[2rem] border border-red-500/30 bg-gradient-to-br from-red-950 via-[#160303] to-black p-5 shadow-2xl shadow-red-950/30">
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-amber-300/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 left-1/2 h-44 w-44 -translate-x-1/2 rounded-full bg-red-600/20 blur-3xl" />

      <div className="relative">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-red-200/60">
            Nagani Member
          </p>

          <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-emerald-100">
            Active
          </div>
        </div>

        <div className="mt-5 rounded-[1.75rem] border border-amber-400/20 bg-black/35 p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-amber-300/30 bg-gradient-to-br from-amber-300/20 to-red-500/10 text-2xl font-black text-amber-100 shadow-lg shadow-black/30">
              N
            </div>

            <div className="min-w-0">
              <h1 className="truncate text-2xl font-black text-amber-100">
                {memberName}
              </h1>
              <p className="mt-1 text-xs font-bold uppercase tracking-[0.25em] text-white/35">
                ID: {memberId}
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-200/60">
              Current Balance
            </p>
            <p className="mt-1 text-3xl font-black text-amber-100">
              {balanceLabel}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}