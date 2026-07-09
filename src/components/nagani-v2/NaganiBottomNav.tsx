// src/components/nagani-v2/NaganiBottomNav.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import NaganiButtonClickSound from "@/components/nagani-v2/NaganiButtonClickSound";

type NavItem = {
  href: string;
  label: string;
  iconSrc: string;
  active: (pathname: string) => boolean;
};

const navItems: NavItem[] = [
  {
    href: "/profile",
    label: "ကိုယ်ရေး",
    iconSrc: "/assets/nagani/v2/nav-profile.png",
    active: (pathname) => pathname.startsWith("/profile"),
  },
  {
    href: "/",
    label: "မူလ",
    iconSrc: "/assets/nagani/v2/nav-home.png",
    active: (pathname) => pathname === "/",
  },
  {
    href: "/cashier",
    label: "ပိုက်ဆံအိတ်",
    iconSrc: "/assets/nagani/v2/nav-wallet.png",
    active: (pathname) => pathname.startsWith("/cashier"),
  },
];

export default function NaganiBottomNav() {
  const pathname = usePathname();

  function iconTone(isActive: boolean) {
    return isActive
      ? "scale-[1.04] opacity-100 drop-shadow-[0_0_20px_rgba(255,215,122,0.82)]"
      : "opacity-95 drop-shadow-[0_8px_16px_rgba(0,0,0,0.76)] group-hover:scale-[1.03] group-hover:opacity-100";
  }

return (
  <>
    <NaganiButtonClickSound rootSelector="[data-nagani-bottom-nav-sound-root]" />

    <nav
      data-nagani-bottom-nav-sound-root
      className="fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-md px-2 pb-[calc(0.22rem+env(safe-area-inset-bottom))]"
    >
      <div className="relative h-[7.25rem] overflow-visible">
        <img
          src="/assets/nagani/v2/nav-bar-parabaik-red.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute bottom-[0.05rem] left-1/2 h-[5.45rem] w-[104%] max-w-none -translate-x-1/2 select-none object-fill drop-shadow-[0_-14px_30px_rgba(0,0,0,0.72)]"
          draggable={false}
        />

        <div className="absolute bottom-[0.62rem] left-1/2 z-20 grid w-[102%] -translate-x-1/2 grid-cols-3 items-center px-9">
          {navItems.map((item) => {
            const isActive = item.active(pathname);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-label={item.label}
                aria-current={isActive ? "page" : undefined}
                className="group flex items-center justify-center transition active:scale-[0.97]"
              >
                <span
                  className={`relative flex h-[4.75rem] w-[4.75rem] items-center justify-center rounded-full transition ${iconTone(
                    isActive
                  )}`}
                >
                  <span className="absolute inset-[0.35rem] rounded-full bg-[#ffd77a]/12 blur-xl" />
                  <span className="absolute inset-[0.78rem] rounded-full bg-black/16 blur-md" />

                  <img
                    src={item.iconSrc}
                    alt=""
                    aria-hidden="true"
                    className="relative h-full w-full object-contain"
                    draggable={false}
                  />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  </>
);
}