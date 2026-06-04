//src>components>nagani>LobbyHero.tsx

import { naganiAssets } from "@/lib/naganiAssets";

type LobbyHeroProps = {
  balanceLabel: string;
  statusLabel: string;
};

export default function LobbyHero({
  balanceLabel,
  statusLabel,
}: LobbyHeroProps) {
  return (
    <section
      className="relative mt-7 overflow-hidden rounded-[2rem] border border-red-500/30 bg-red-950 bg-cover bg-center p-5 shadow-2xl shadow-red-950/40"
      style={{
        backgroundImage: `linear-gradient(135deg, rgba(69, 10, 10, 0.86), rgba(23, 4, 4, 0.9), rgba(0, 0, 0, 0.92)), url(${naganiAssets.shared.backgrounds.darkLacquer})`,
      }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(251,191,36,0.18),transparent_32%),radial-gradient(circle_at_bottom,rgba(220,38,38,0.22),transparent_45%)]" />
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-amber-300/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-red-600/20 blur-3xl" />

      <div className="relative rounded-[1.5rem] border border-amber-400/20 bg-black/45 p-5 shadow-xl shadow-black/30 backdrop-blur-sm">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-red-200/70">
            Red Dragon House
          </p>

          <div className="rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-amber-100">
            Live Floor
          </div>
        </div>

        <div className="mt-5 flex items-center gap-4">
          <div
            className="h-24 w-24 shrink-0 bg-contain bg-center bg-no-repeat drop-shadow-[0_18px_26px_rgba(251,191,36,0.22)]"
            style={{
              backgroundImage: `url(${naganiAssets.shared.logo.conceptV1})`,
            }}
            aria-label="Nagani dragon mark"
          />

          <h2 className="text-4xl font-black leading-tight text-amber-100">
            ၆ ကောင်ဂျင်
            <span className="block text-2xl text-amber-200/80">
              ၃၆ ကောင်ထီ
            </span>
          </h2>
        </div>

        <p className="mt-4 text-sm leading-6 text-amber-50/75">
          Enter the Nagani game room, choose your traditional table, follow live
          results, and manage your wallet from one mobile-first player center.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-amber-200/55">
              Wallet
            </p>
            <p className="mt-1 text-lg font-black text-amber-100">
              {balanceLabel}
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-200/55">
              Floor
            </p>
            <p className="mt-1 text-lg font-black text-emerald-100">
              {statusLabel}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}