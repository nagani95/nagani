//src/components/nagani-v2/NaganiPageShell.tsx

import type { ReactNode } from "react";

import { naganiTheme } from "./naganiTheme";

type NaganiPageShellProps = {
  children: ReactNode;
  background?: ReactNode;
  bottomNav?: ReactNode;
  floatingSupport?: ReactNode;
  className?: string;
};

export default function NaganiPageShell({
  children,
  background,
  bottomNav,
  floatingSupport,
  className = "",
}: NaganiPageShellProps) {
  return (
    <main className={naganiTheme.classNames.page}>
      <div className={`relative ${naganiTheme.classNames.safe} ${className}`}>
        {background ? (
          <div className="fixed inset-0 -z-20 mx-auto w-full max-w-md overflow-hidden bg-[#090202]">
            {background}
          </div>
        ) : (
          <div className="fixed inset-0 -z-20 mx-auto w-full max-w-md bg-gradient-to-b from-[#090202] via-[#2a1209] to-[#090202]" />
        )}

        <div className="fixed inset-0 -z-10 mx-auto w-full max-w-md bg-gradient-to-b from-black/45 via-black/20 to-black/75" />

        <div className="relative z-10 min-h-screen pb-[calc(5.5rem+env(safe-area-inset-bottom))]">
          {children}
        </div>

        {floatingSupport}

        {bottomNav}
      </div>
    </main>
  );
}