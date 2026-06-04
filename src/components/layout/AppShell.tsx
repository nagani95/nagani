//src>components>layout>AppShell.tsx

import BottomNav from "./BottomNav";

type AppShellProps = {
  children: React.ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#090202] text-white">
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute left-1/2 top-[-10rem] h-80 w-80 -translate-x-1/2 rounded-full bg-red-700/20 blur-3xl" />
        <div className="absolute right-[-6rem] top-40 h-72 w-72 rounded-full bg-amber-400/10 blur-3xl" />
        <div className="absolute bottom-[-8rem] left-[-5rem] h-80 w-80 rounded-full bg-red-950/35 blur-3xl" />
      </div>

      <section className="relative z-10 mx-auto w-full max-w-md px-4 pb-[calc(9rem+env(safe-area-inset-bottom))] pt-6 sm:px-5">
        {children}
      </section>

      <BottomNav />
    </main>
  );
}