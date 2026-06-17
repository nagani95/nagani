//src/components/nagani-v2/NaganiBottomNav.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  label: string;
  href: string;
  symbol: string;
  isCenter?: boolean;
  active: (pathname: string) => boolean;
};

const navItems: NavItem[] = [
  {
    label: "ပရိုဖိုင်",
    href: "/profile",
    symbol: "◜◝",
    active: (pathname) => pathname.startsWith("/profile"),
  },
  {
    label: "မူလ",
    href: "/",
    symbol: "◆",
    isCenter: true,
    active: (pathname) => pathname === "/",
  },
  {
    label: "ပိုက်ဆံအိတ်",
    href: "/cashier",
    symbol: "◟◞",
    active: (pathname) => pathname.startsWith("/cashier"),
  },
];

export default function NaganiBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-md px-3 pb-[calc(0.65rem+env(safe-area-inset-bottom))]">
      <div className="grid grid-cols-3 items-end rounded-[2rem] border border-[#d6a84f]/25 bg-gradient-to-b from-[#4b0808]/96 via-[#2a0707]/96 to-[#090202]/98 px-2 py-2 shadow-[0_-18px_40px_rgba(0,0,0,0.55)] backdrop-blur-md">
        {navItems.map((item) => {
          const isActive = item.active(pathname);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={`group flex min-h-14 flex-col items-center justify-center rounded-[1.5rem] text-center transition active:scale-[0.98] ${
                item.isCenter ? "-mt-6 min-h-[4.6rem]" : ""
              } ${
                isActive
                  ? "text-[#ffd77a]"
                  : "text-[#fff3d0]/68 hover:text-[#fff3d0]"
              }`}
            >
              <span
                className={`flex items-center justify-center rounded-full border text-sm font-black shadow-lg transition ${
                  item.isCenter
                    ? "mb-1 h-12 w-12 border-[#ffd77a]/55 bg-gradient-to-b from-[#b21b16] via-[#7f1111] to-[#3a0707] text-[#ffd77a] shadow-black/50"
                    : "mb-1 h-8 w-8 border-[#d6a84f]/20 bg-black/20 text-[#d6a84f]/85"
                } ${
                  isActive
                    ? "ring-2 ring-[#ffd77a]/25"
                    : "ring-0 group-hover:border-[#d6a84f]/35"
                }`}
              >
                {item.symbol}
              </span>

              <span
                className={`text-[0.68rem] font-semibold leading-none ${
                  item.isCenter ? "text-[0.74rem]" : ""
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}