//src>types>games.ts

export type GameKey = "six_animal" | "thirty_six";

export type GameStatus = "open" | "closed" | "settling" | "completed";

export type SixAnimalKey =
  | "tiger"
  | "dragon"
  | "rooster"
  | "fish"
  | "crab"
  | "elephant";

export type SixAnimalOption = {
  key: SixAnimalKey;
  name: string;
  nameMm: string;
  assetPath: string;
};

export type ThirtySixAnimalOption = {
  number: number;
  key: string;
  name: string;
  nameMm: string;
  assetPath: string;
};

export type BetStatus = "pending" | "won" | "lost" | "cancelled";

export type WalletRequestStatus = "pending" | "confirmed" | "rejected";