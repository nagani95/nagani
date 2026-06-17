//src/components/nagani-v2/naganiTheme.ts

export const naganiTheme = {
  colors: {
    lacquerBlack: "#090202",
    royalDeepRed: "#4b0808",
    royalRed: "#7f1111",
    oldGold: "#d6a84f",
    brightGold: "#ffd77a",
    teakBrown: "#5a2f18",
    darkTeak: "#2a1209",
    warmIvory: "#fff3d0",
    softIvory: "#f7dfaa",
    shadowBlack: "rgba(0, 0, 0, 0.62)",
  },
  classNames: {
    page:
      "min-h-screen bg-[#090202] text-[#fff3d0] selection:bg-[#d6a84f]/30 selection:text-[#fff3d0]",
    safe:
      "mx-auto min-h-screen w-full max-w-md overflow-hidden",
    glass:
      "border border-[#d6a84f]/20 bg-[#090202]/55 shadow-2xl shadow-black/50 backdrop-blur-md",
    goldText:
      "bg-gradient-to-b from-[#ffd77a] via-[#d6a84f] to-[#8f6422] bg-clip-text text-transparent",
    royalBorder:
      "border border-[#d6a84f]/25 ring-1 ring-[#fff3d0]/5",
  },
} as const;

export type NaganiTheme = typeof naganiTheme;