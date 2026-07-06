// src/lib/naganiSlot/symbols.ts

import type {
  NaganiSlotPosition,
  NaganiSlotSymbol,
  NaganiSlotSymbolKey,
  NaganiSlotSymbolTier,
  NaganiSlotWinEvaluation,
  NaganiSlotWinGroup,
} from "./types";

const SYMBOL_ASSET_BASE = "/assets/nagani/slot/symbols";
const STAR_REEL_INDEXES = new Set([0, 1, 2, 3, 4]);
const CROWN_REEL_INDEXES = new Set([2, 4]);
const LEGACY_SLOT_SYMBOL_KEYS = new Set<NaganiSlotSymbolKey>([
  "bonus",
  "wild",
]);

function isSymbolAllowedOnReel(
  symbolKey: NaganiSlotSymbolKey,
  columnIndex?: number
) {
  if (LEGACY_SLOT_SYMBOL_KEYS.has(symbolKey)) {
    return false;
  }

  if (columnIndex === undefined) return true;

  if (symbolKey === "star") {
    return STAR_REEL_INDEXES.has(columnIndex);
  }

  if (symbolKey === "crown") {
    return CROWN_REEL_INDEXES.has(columnIndex);
  }

  return true;
}

export const naganiSlotSymbols: NaganiSlotSymbol[] = [
  {
    key: "dragon",
    label: "မြန်မာနဂါး",
    shortLabel: "နဂါး",
    emoji: "🐉",
    tier: "high",
    imageSrc: `${SYMBOL_ASSET_BASE}/dragon.png`,
    imageScale: 1.2,
  },
  {
    key: "gold_pot",
    label: "ရွှေအိုး",
    shortLabel: "ရွှေအိုး",
    emoji: "🏺",
    tier: "top",
    imageSrc: `${SYMBOL_ASSET_BASE}/gold-pot.png`,
    imageScale: 1.08,
  },
  {
    key: "buffalo",
    label: "ကျွဲ",
    shortLabel: "ကျွဲ",
    emoji: "🐃",
    tier: "mid",
    imageSrc: `${SYMBOL_ASSET_BASE}/buffalo.png`,
    imageScale: 1.16,
  },
  {
    key: "bell",
    label: "ရွှေခေါင်းလောင်း",
    shortLabel: "ခေါင်းလောင်း",
    emoji: "🔔",
    tier: "low",
    imageSrc: `${SYMBOL_ASSET_BASE}/bell.png`,
    imageScale: 1.08,
  },
  {
    key: "ruby",
    label: "ပတ္တမြား",
    shortLabel: "ပတ္တမြား",
    emoji: "♦️",
    tier: "high",
    imageSrc: `${SYMBOL_ASSET_BASE}/ruby.png`,
    imageScale: 1.04,
  },
  {
    key: "harp",
    label: "စောင်း",
    shortLabel: "စောင်း",
    emoji: "🎵",
    tier: "mid",
    imageSrc: `${SYMBOL_ASSET_BASE}/harp.png`,
    imageScale: 1.0,
  },
  {
    key: "bagan",
    label: "ပုဂံ",
    shortLabel: "ပုဂံ",
    emoji: "🛕",
    tier: "mid",
    imageSrc: `${SYMBOL_ASSET_BASE}/bagan.png`,
    imageScale: 1.04,
  },
  {
    key: "ever_stand",
    label: "ပစ်တိုင်းထောင်",
    shortLabel: "ပစ်တိုင်းထောင်",
    emoji: "🧸",
    tier: "low",
    imageSrc: `${SYMBOL_ASSET_BASE}/ever-stand.png`,
    imageScale: 1.04,
  },
    {
    key: "bonus",
    label: "ရွှေဒင်္ဂါးဆု",
    shortLabel: "ဒင်္ဂါး",
    emoji: "🪙",
    tier: "special",
    imageSrc: `${SYMBOL_ASSET_BASE}/bonus.png`,
    imageScale: 1.04,
  },
  {
    key: "crown",
    label: "ရွှေသရဖူ",
    shortLabel: "သရဖူ",
    emoji: "👑",
    tier: "special",
    imageSrc: `${SYMBOL_ASSET_BASE}/crown.png`,
    imageScale: 1.08,
  },
  {
    key: "star",
    label: "ကြယ်ဆု",
    shortLabel: "ကြယ်",
    emoji: "⭐",
    tier: "special",
    imageSrc: `${SYMBOL_ASSET_BASE}/star.png`,
    imageScale: 1.06,
  },
  {
    key: "wild",
    label: "နဂါး Wild",
    shortLabel: "နဂါး",
    emoji: "🐉",
    tier: "special",
    imageSrc: `${SYMBOL_ASSET_BASE}/wild.png`,
    imageScale: 1.08,
  },
];

export function getNaganiSlotSymbolByKey(key: NaganiSlotSymbolKey) {
  const symbol = naganiSlotSymbols.find((item) => item.key === key);

  if (!symbol) {
    throw new Error(`Missing Nagani slot symbol: ${key}`);
  }

  return symbol;
}

function getRandomSymbol(columnIndex?: number) {
  const allowedSymbols = naganiSlotSymbols.filter((symbol) =>
    isSymbolAllowedOnReel(symbol.key, columnIndex)
  );

  const index = Math.floor(Math.random() * allowedSymbols.length);
  return allowedSymbols[index];
}

function getRandomPaySymbol(excludeKey?: NaganiSlotSymbolKey) {
  const paySymbols = naganiSlotSymbols.filter(
    (symbol) => symbol.tier !== "special" && symbol.key !== excludeKey
  );

  const index = Math.floor(Math.random() * paySymbols.length);
  return paySymbols[index];
}

function getTierBaseScore(tier: NaganiSlotSymbolTier) {
  if (tier === "top") return 12;
  if (tier === "high") return 10;
  if (tier === "mid") return 8;
  if (tier === "special") return 12;
  return 7;
}

function getGroupScore(symbol: NaganiSlotSymbol, count: number) {
  if (symbol.key === "bonus" || symbol.key === "crown" || symbol.key === "star") {
    return count * 14 + Math.max(0, count - 3) * 12;
  }

  if (symbol.key === "wild") {
    return count * 13 + Math.max(0, count - 3) * 10;
  }

  const base = getTierBaseScore(symbol.tier);
  return count * base + Math.max(0, count - 3) * 8;
}

function getUniquePositions(positions: NaganiSlotPosition[]) {
  const seen = new Set<string>();

  return positions.filter((position) => {
    const key = `${position.columnIndex}-${position.rowIndex}`;

    if (seen.has(key)) return false;

    seen.add(key);
    return true;
  });
}

const initialSlotColumnKeys: NaganiSlotSymbolKey[][] = [
  ["dragon", "harp", "star"],
  ["gold_pot", "star", "bell"],
  ["buffalo", "crown", "star"],
  ["bell", "star", "bagan"],
  ["ruby", "crown", "star"],
];

const baseReelStripKeys: NaganiSlotSymbolKey[] = [
  "dragon",
  "gold_pot",
  "buffalo",
  "bell",
  "ruby",
  "harp",
  "bagan",
  "ever_stand",
  "dragon",
  "bell",
  "ruby",
  "gold_pot",
  "bagan",
];

function getReelStripKeys(columnIndex: number) {
  const reelStripKeys = [...baseReelStripKeys];

  if (STAR_REEL_INDEXES.has(columnIndex)) {
    reelStripKeys.splice(4, 0, "star");
  }

  if (CROWN_REEL_INDEXES.has(columnIndex)) {
    reelStripKeys.splice(8, 0, "crown");
  }

  return reelStripKeys;
}

export function getInitialSlotColumns() {
  return initialSlotColumnKeys.map((column) =>
    column.map((key) => getNaganiSlotSymbolByKey(key))
  );
}

export function getInitialSlotGrid() {
  const columns = getInitialSlotColumns();

  return [0, 1, 2].flatMap((rowIndex) =>
    columns.map((column) => column[rowIndex])
  );
}

function createRandomVisibleColumn(columnIndex: number) {
  const allowedSymbols = naganiSlotSymbols.filter((symbol) =>
    isSymbolAllowedOnReel(symbol.key, columnIndex)
  );

  const shuffledSymbols = [...allowedSymbols].sort(() => Math.random() - 0.5);

  if (shuffledSymbols.length < 3) {
    throw new Error(`Not enough Nagani slot symbols for reel ${columnIndex + 1}.`);
  }

  return shuffledSymbols.slice(0, 3);
}

export function createRandomSlotColumns() {
  return Array.from({ length: 5 }, (_, columnIndex) =>
    createRandomVisibleColumn(columnIndex)
  );
}

const demoSpinResultCycles: NaganiSlotSymbolKey[][] = [
  // Star helper example: top row Dragon + Dragon + Star
  [
    "dragon", "bell", "ruby",
    "dragon", "harp", "bagan",
    "star", "ever_stand", "gold_pot",
    "buffalo", "bell", "ruby",
    "harp", "bagan", "ever_stand",
  ],

  // Crown trigger preview: crowns appear on separate reels only
  [
    "gold_pot", "ruby", "bell",
    "dragon", "harp", "bagan",
    "buffalo", "crown", "ruby",
    "bell", "star", "bagan",
    "ruby", "crown", "dragon",
  ],

  // Medium normal win: top row Gold Pot + Gold Pot + Star
  [
    "gold_pot", "dragon", "bell",
    "gold_pot", "buffalo", "harp",
    "star", "ruby", "bagan",
    "ever_stand", "star", "dragon",
    "buffalo", "bell", "ruby",
  ],

  // Big normal win with Star helper: top row Dragon + Dragon + Star + Dragon + Star
  [
    "dragon", "bell", "ruby",
    "dragon", "star", "buffalo",
    "star", "gold_pot", "bell",
    "dragon", "harp", "bagan",
    "star", "crown", "gold_pot",
  ],
];

let demoSpinResultCycleIndex = 0;

function buildSlotColumnsFromKeys(keys: NaganiSlotSymbolKey[]) {
  return Array.from({ length: 5 }, (_, columnIndex) =>
    Array.from({ length: 3 }, (_, rowIndex) => {
      const flatIndex = columnIndex * 3 + rowIndex;
      return getNaganiSlotSymbolByKey(keys[flatIndex]);
    })
  );
}

export function buildSlotColumnsFromBackendGrid(grid: string[][]) {
  if (!Array.isArray(grid) || grid.length !== 5) {
    throw new Error("Invalid Nagani slot backend grid column count.");
  }

  return grid.map((column) => {
    if (!Array.isArray(column) || column.length !== 3) {
      throw new Error("Invalid Nagani slot backend grid row count.");
    }

    return column.map((key) =>
      getNaganiSlotSymbolByKey(key as NaganiSlotSymbolKey)
    );
  });
}

export function createDemoSpinResultColumns() {
  const cycleKeys =
    demoSpinResultCycles[demoSpinResultCycleIndex % demoSpinResultCycles.length];

  demoSpinResultCycleIndex += 1;

  return buildSlotColumnsFromKeys(cycleKeys);
}

export function getReelSpinStrip(columnIndex: number) {
  const reelStripKeys = getReelStripKeys(columnIndex);
  const offset = columnIndex * 2;
  const seamlessStripLength = reelStripKeys.length * 2;

  return Array.from({ length: seamlessStripLength }, (_, index) => {
    const symbolKey = reelStripKeys[(index + offset) % reelStripKeys.length];
    return getNaganiSlotSymbolByKey(symbolKey);
  });
}

export function evaluateNaganiSlotResult({
  columns,
  betAmount,
}: {
  columns: NaganiSlotSymbol[][];
  betAmount: number;
}): NaganiSlotWinEvaluation {
  const rowPaylines = [
    { line: 1, name: "အပေါ်တန်း", rowIndex: 0 },
    { line: 2, name: "အလယ်တန်း", rowIndex: 1 },
    { line: 3, name: "အောက်တန်း", rowIndex: 2 },
  ];

  const winGroups: NaganiSlotWinGroup[] = [];

  rowPaylines.forEach((payline) => {
const symbolsOnLine = columns.map((column) => column[payline.rowIndex]);
const firstSymbol = symbolsOnLine[0];

const isNormalPaySymbol =
  firstSymbol &&
  firstSymbol.key !== "star" &&
  firstSymbol.key !== "crown" &&
  firstSymbol.key !== "bonus" &&
  firstSymbol.key !== "wild";

if (!isNormalPaySymbol) return;

const firstNormalSymbol = firstSymbol;

    let count = 0;
    const positions: NaganiSlotPosition[] = [];

    for (let columnIndex = 0; columnIndex < symbolsOnLine.length; columnIndex += 1) {
      const symbol = symbolsOnLine[columnIndex];

      if (symbol.key === firstNormalSymbol.key || symbol.key === "star") {
        count += 1;
        positions.push({
          columnIndex,
          rowIndex: payline.rowIndex,
        });
      } else {
        break;
      }
    }

    if (count >= 3) {
      winGroups.push({
        symbolKey: firstNormalSymbol.key,
        symbolLabel: firstNormalSymbol.shortLabel,
        count,
        score: getGroupScore(firstNormalSymbol, count),
        positions,
      });
    }
  });

  if (winGroups.length === 0) {
    return {
      tier: "none",
      amount: 0,
      message: "နောက်တစ်ကြိမ် ထပ်လှည့်ပါ",
      matchCount: 0,
      score: 0,
      multiplier: 0,
      winningPositions: [],
      winGroups: [],
    };
  }

  const bestGroup = [...winGroups].sort((a, b) => b.score - a.score)[0];
  const totalScore = winGroups.reduce((sum, group) => sum + group.score, 0);
  const winningPositions = getUniquePositions(
    winGroups.flatMap((group) => group.positions)
  );

  const tier =
    bestGroup.count >= 5 || totalScore >= 90
      ? "big"
      : bestGroup.count >= 4 || totalScore >= 52
        ? "medium"
        : "small";

  const multiplier =
    bestGroup.count >= 5
      ? 12
      : bestGroup.count >= 4
        ? 6
        : 2;

  return {
    tier,
    amount: betAmount * multiplier,
    message:
      tier === "big"
        ? "အနိုင်ကြီး ရရှိပါသည်"
        : tier === "medium"
          ? "ဆုကောင်း ရရှိပါသည်"
          : "အနိုင် ရရှိပါသည်",
    matchCount: bestGroup.count,
    score: totalScore,
    multiplier,
    matchedSymbolKey: bestGroup.symbolKey,
    winningPositions,
    winGroups,
  };
}