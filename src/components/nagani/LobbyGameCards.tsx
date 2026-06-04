//src>components>nagani>LobbyGameCards.tsx

import Link from "next/link";

type LobbyGame = {
  title: string;
  subtitle: string;
  href: string;
  tag: string;
};

type LobbyGameCardsProps = {
  games: LobbyGame[];
};

export default function LobbyGameCards({ games }: LobbyGameCardsProps) {
  return (
    <section className="mt-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-red-200/50">
            Choose Table
          </p>
          <h3 className="mt-1 text-sm font-black uppercase tracking-[0.25em] text-amber-200">
            Main Games
          </h3>
        </div>

        <Link
          href="/live"
          className="rounded-full border border-red-300/20 bg-red-400/10 px-3 py-2 text-xs font-black text-red-100"
        >
          Live Results
        </Link>
      </div>

      {games.map((game, index) => {
        const isPrimary = index === 0;

        return (
          <Link
            key={game.href}
            href={game.href}
            className="group relative block overflow-hidden rounded-[1.75rem] border border-amber-400/20 bg-gradient-to-br from-[#1a0606] via-[#0f0303] to-black p-4 shadow-xl shadow-black/40 transition hover:-translate-y-0.5 hover:border-amber-300/50 hover:shadow-amber-950/30"
          >
            <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-amber-300/10 blur-2xl transition group-hover:bg-amber-300/20" />
            <div className="pointer-events-none absolute -bottom-14 left-8 h-28 w-28 rounded-full bg-red-600/15 blur-2xl" />

            <div className="relative flex items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="rounded-full border border-red-300/20 bg-red-400/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-red-100/80">
                    {game.tag}
                  </p>

                  {isPrimary && (
                    <p className="rounded-full border border-emerald-300/20 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-emerald-100">
                      Open
                    </p>
                  )}
                </div>

                <h4 className="mt-3 text-2xl font-black text-amber-100">
                  {game.title}
                </h4>

                <p className="mt-2 max-w-[15rem] text-sm leading-5 text-amber-50/60">
                  {game.subtitle}
                </p>

                <p className="mt-4 text-xs font-black uppercase tracking-[0.22em] text-amber-200/70">
                  Enter Room
                </p>
              </div>

              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-amber-300/30 bg-amber-300/10 text-2xl font-black text-amber-100 shadow-lg shadow-black/30 transition group-hover:scale-105 group-hover:bg-amber-300 group-hover:text-black">
                →
              </div>
            </div>
          </Link>
        );
      })}
    </section>
  );
}