//src>components>layout>BottomNav.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Live",
    href: "/live",
  },
  {
    label: "Cashier",
    href: "/cashier",
  },
  {
    label: "History",
    href: "/history",
  },
  {
    label: "Profile",
    href: "/profile",
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed left-1/2 z-50 grid w-[calc(100%-1.25rem)] max-w-md -translate-x-1/2 grid-cols-5 rounded-[1.75rem] border border-amber-300/25 bg-[#080403]/95 p-1.5 shadow-2xl shadow-black/80 backdrop-blur-2xl [bottom:calc(0.75rem+env(safe-area-inset-bottom))]">
      {navItems.map((item) => {
        const isActive =
          item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={
              isActive
                ? "min-w-0 rounded-[1.25rem] bg-gradient-to-b from-amber-200 to-amber-400 px-1.5 py-3 text-center text-[11px] font-black text-black shadow-lg shadow-amber-950/30"
                : "min-w-0 rounded-[1.25rem] px-1.5 py-3 text-center text-[11px] font-bold text-amber-100/60 transition hover:bg-white/5 hover:text-amber-100"
            }
          >
            <span className="block truncate">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}