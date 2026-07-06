// src/lib/naganiSlot/types.ts

export type NaganiSlotSymbolKey =
  | "dragon"
  | "gold_pot"
  | "buffalo"
  | "bell"
  | "ruby"
  | "harp"
  | "bagan"
  | "ever_stand"
  | "bonus"
  | "crown"
  | "star"
  | "wild";

export type NaganiSlotSymbolTier =
  | "low"
  | "mid"
  | "high"
  | "top"
  | "special";

export type NaganiSlotSymbol = {
  key: NaganiSlotSymbolKey;
  label: string;
  shortLabel: string;
  emoji: string;
  tier: NaganiSlotSymbolTier;
  imageSrc?: string;
  imageScale?: number;
};

export type NaganiSlotGameState = "ready" | "spinning" | "settling" | "result";

export type NaganiSlotWinTier = "none" | "small" | "medium" | "big";

export type NaganiSlotPosition = {
  columnIndex: number;
  rowIndex: number;
};

export type NaganiSlotWinGroup = {
  symbolKey: NaganiSlotSymbolKey;
  symbolLabel: string;
  count: number;
  score: number;
  positions: NaganiSlotPosition[];
};

export type NaganiSlotWinEvaluation = {
  tier: NaganiSlotWinTier;
  amount: number;
  message: string;
  matchCount: number;
  score: number;
  multiplier: number;
  winningPositions: NaganiSlotPosition[];
  winGroups: NaganiSlotWinGroup[];
  matchedSymbolKey?: NaganiSlotSymbolKey;
};