// src/components/profile/ProfileSupportSecurity.tsx

export default function ProfileSupportSecurity() {
  return (
    <section className="mt-6 rounded-[1.75rem] border border-red-400/15 bg-red-950/10 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-200/60">
            Support & Security
          </p>
          <h3 className="mt-2 text-lg font-black text-amber-100">
            Account Safety
          </h3>
        </div>

        <div className="rounded-full border border-red-400/20 bg-red-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-red-100">
          Notice
        </div>
      </div>

      <div className="mt-4 space-y-3 text-sm leading-6 text-white/65">
        <p>
          <span className="font-black text-amber-100">1.</span> Keep your member
          account private and do not share access.
        </p>

        <p>
          <span className="font-black text-amber-100">2.</span> Wallet requests
          appear inside the Cashier ticket list.
        </p>

        <p>
          <span className="font-black text-amber-100">3.</span> Use the Cashier
          page to review deposit and withdraw request status.
        </p>
      </div>

      <p className="mt-4 rounded-2xl border border-white/10 bg-black/25 p-3 text-xs leading-5 text-white/40">
        For wallet or account help, contact the cashier/admin team and include
        your member ID when reporting an issue.
      </p>
    </section>
  );
}