//src>components>games>six-animal>RoyalRoomAtmosphere.tsx

export function RoyalRoomAtmosphere() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-52 bg-[radial-gradient(circle_at_50%_0%,rgba(251,191,36,0.13),rgba(127,29,29,0.08)_34%,transparent_72%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.42),transparent_24%,transparent_76%,rgba(0,0,0,0.42))]" />
      <div className="absolute inset-x-8 bottom-0 h-60 bg-[radial-gradient(circle_at_50%_100%,rgba(127,29,29,0.18),transparent_68%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.12),transparent_32%,rgba(0,0,0,0.34))]" />
    </div>
  );
}