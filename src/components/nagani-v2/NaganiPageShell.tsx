//src/components/nagani-v2/NaganiPageShell.tsx

import type { ReactNode } from "react";

import { naganiTheme } from "./naganiTheme";

const TEMP_PALACE_BACKGROUND =
  "/assets/nagani/six-animal/room/six-animal-palace-room-bg-v1.jpg";

type NaganiPageShellProps = {
  children: ReactNode;
  background?: ReactNode;
  bottomNav?: ReactNode;
  floatingSupport?: ReactNode;
  className?: string;
  contentClassName?: string;
};

export default function NaganiPageShell({
  children,
  background,
  bottomNav,
  floatingSupport,
  className = "",
  contentClassName = "relative z-10 min-h-screen pb-[calc(5.5rem+env(safe-area-inset-bottom))]",
}: NaganiPageShellProps) {
  return (
    <main className={naganiTheme.classNames.page}>
      <div
        className={`relative isolate ${naganiTheme.classNames.safe} ${className}`}
      >
        <div className="fixed inset-0 z-0 mx-auto w-full max-w-md overflow-hidden bg-[#090202]">
          {background ? (
            background
          ) : (
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${TEMP_PALACE_BACKGROUND})` }}
            />
          )}

          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.34)_0%,rgba(0,0,0,0.12)_38%,rgba(0,0,0,0.72)_100%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(255,201,102,0.13),transparent_34%),radial-gradient(circle_at_50%_100%,rgba(95,18,8,0.45),transparent_48%)]" />
        </div>

        <div className={contentClassName}>{children}</div>

        {floatingSupport}

        {bottomNav}
      </div>
    </main>
  );
}