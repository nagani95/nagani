// src/components/layout/AppShell.tsx

import { NaganiBottomNav, NaganiPageShell } from "../nagani-v2";

type AppShellProps = {
  children: React.ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
  return (
    <NaganiPageShell bottomNav={<NaganiBottomNav />}>
      <section className="mx-auto w-full max-w-md px-4 pb-28 pt-6 sm:px-5">
        {children}
      </section>
    </NaganiPageShell>
  );
}