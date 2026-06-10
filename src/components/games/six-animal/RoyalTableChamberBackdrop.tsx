//src>components>games>six-animal>FloatingResultBoard.tsx

export default function RoyalTableChamberBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.1),transparent_24%,rgba(0,0,0,0.5)_100%)]" />

      <div className="absolute inset-y-0 left-0 w-[34%] bg-[linear-gradient(90deg,rgba(30,7,3,0.82),rgba(69,22,8,0.36)_42%,transparent_100%)]" />
      <div className="absolute inset-y-0 right-0 w-[34%] bg-[linear-gradient(270deg,rgba(30,7,3,0.82),rgba(69,22,8,0.36)_42%,transparent_100%)]" />

      <div className="absolute left-0 top-20 bottom-10 w-[22%] bg-[radial-gradient(ellipse_at_0%_45%,rgba(120,53,15,0.24),rgba(251,191,36,0.055)_34%,transparent_72%)] shadow-[inset_-18px_0_34px_rgba(0,0,0,0.28)]" />
      <div className="absolute right-0 top-20 bottom-10 w-[22%] bg-[radial-gradient(ellipse_at_100%_45%,rgba(120,53,15,0.24),rgba(251,191,36,0.055)_34%,transparent_72%)] shadow-[inset_18px_0_34px_rgba(0,0,0,0.28)]" />

      <div className="absolute left-0 top-10 bottom-8 w-20 bg-[linear-gradient(90deg,rgba(120,53,15,0.28),rgba(251,191,36,0.08),transparent)]" />
      <div className="absolute right-0 top-10 bottom-8 w-20 bg-[linear-gradient(270deg,rgba(120,53,15,0.28),rgba(251,191,36,0.08),transparent)]" />

      <div className="absolute left-5 top-8 bottom-10 w-[2px] bg-gradient-to-b from-transparent via-amber-200/24 to-transparent" />
      <div className="absolute right-5 top-8 bottom-10 w-[2px] bg-gradient-to-b from-transparent via-amber-200/24 to-transparent" />

      <div className="absolute inset-x-6 bottom-0 h-44 bg-[radial-gradient(ellipse_at_50%_100%,rgba(127,29,29,0.34),rgba(69,10,10,0.18)_38%,transparent_74%)]" />
      <div className="absolute inset-x-10 top-4 h-px bg-gradient-to-r from-transparent via-amber-200/22 to-transparent" />
    </div>
  );
}