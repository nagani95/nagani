//src>components>layout>AppShell.tsx

import {
  NaganiBottomNav,
  NaganiFloatingSupport,
  NaganiPageShell,
} from "../nagani-v2";

type AppShellProps = {
  children: React.ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
  return (
    <NaganiPageShell
      bottomNav={<NaganiBottomNav />}
      floatingSupport={<NaganiFloatingSupport />}
    >
      <section className="mx-auto w-full max-w-md px-4 pb-6 pt-6 sm:px-5">
        {children}
      </section>
    </NaganiPageShell>
  );
}