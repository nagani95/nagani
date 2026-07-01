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
    tier: "high",
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
    tier: "mid",
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
    label: "Bonus",
    shortLabel: "Bonus",
    emoji: "✨",
    tier: "special",
    imageSrc: `${SYMBOL_ASSET_BASE}/bonus.png`,
    imageScale: 1.0,
  },
  {
    key: "wild",
    label: "Wild",
    shortLabel: "Wild",
    emoji: "👑",
    tier: "special",
    imageSrc: `${SYMBOL_ASSET_BASE}/wild.png`,
    imageScale: 1.0,
  },
];

function getSymbolByKey(key: NaganiSlotSymbolKey) {
  const symbol = naganiSlotSymbols.find((item) => item.key === key);

  if (!symbol) {
    throw new Error(`Missing Nagani slot symbol: ${key}`);
  }

  return symbol;
}

function getRandomSymbol() {
  const index = Math.floor(Math.random() * naganiSlotSymbols.length);
  return naganiSlotSymbols[index];
}

function getRandomPaySymbol(excludeKey?: NaganiSlotSymbolKey) {
  const paySymbols = naganiSlotSymbols.filter(
    (symbol) =>
      symbol.key !== "bonus" &&
      symbol.key !== "wild" &&
      symbol.key !== excludeKey
  );

  const index = Math.floor(Math.random() * paySymbols.length);
  return paySymbols[index];
}

function getTierBaseScore(tier: NaganiSlotSymbolTier) {
  if (tier === "high") return 10;
  if (tier === "mid") return 8;
  if (tier === "special") return 12;
  return 7;
}

function getGroupScore(symbol: NaganiSlotSymbol, count: number) {
  if (symbol.key === "bonus") {
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
  ["dragon", "harp", "gold_pot"],
  ["gold_pot", "bagan", "bell"],
  ["buffalo", "ever_stand", "ruby"],
  ["bell", "bonus", "bagan"],
  ["ruby", "dragon", "wild"],
];

const reelStripKeys: NaganiSlotSymbolKey[] = [
  "dragon",
  "gold_pot",
  "buffalo",
  "bell",
  "ruby",
  "harp",
  "bagan",
  "ever_stand",
  "bonus",
  "dragon",
  "bell",
  "ruby",
  "wild",
  "gold_pot",
  "bagan",
];

export function getInitialSlotColumns() {
  return initialSlotColumnKeys.map((column) =>
    column.map((key) => getSymbolByKey(key))
  );
}

export function getInitialSlotGrid() {
  const columns = getInitialSlotColumns();

  return [0, 1, 2].flatMap((rowIndex) =>
    columns.map((column) => column[rowIndex])
  );
}

export function createRandomSlotColumns() {
  return Array.from({ length: 5 }, () =>
    Array.from({ length: 3 }, () => getRandomSymbol())
  );
}

export function createDemoSpinResultColumns() {
  const columns = createRandomSlotColumns();

  const forceRoll = Math.random();

  // Around 44% pure random, 56% guided reward demo.
  if (forceRoll >= 0.56) {
    return columns;
  }

  const allPositions: NaganiSlotPosition[] = [];

  for (let columnIndex = 0; columnIndex < 5; columnIndex += 1) {
    for (let rowIndex = 0; rowIndex < 3; rowIndex += 1) {
      allPositions.push({ columnIndex, rowIndex });
    }
  }

  const shuffledPositions = [...allPositions].sort(() => Math.random() - 0.5);

  const firstRewardSymbol = getRandomPaySymbol();

  const firstCount =
    forceRoll < 0.08 ? 5 : forceRoll < 0.24 ? 4 : 3;

  shuffledPositions.slice(0, firstCount).forEach((position) => {
    columns[position.columnIndex][position.rowIndex] = firstRewardSymbol;
  });

  const shouldAddSecondGroup =
    forceRoll < 0.1 || (forceRoll >= 0.24 && Math.random() < 0.16);

  if (shouldAddSecondGroup) {
    const secondRewardSymbol = getRandomPaySymbol(firstRewardSymbol.key);
    const secondCount = forceRoll < 0.08 ? 4 : 3;

    shuffledPositions.slice(firstCount, firstCount + secondCount).forEach(
      (position) => {
        columns[position.columnIndex][position.rowIndex] = secondRewardSymbol;
      }
    );
  }

  const shouldAddBonusScatter = forceRoll < 0.05 || Math.random() < 0.08;

  if (shouldAddBonusScatter) {
    const bonusSymbol = getSymbolByKey("bonus");

    shuffledPositions.slice(10, 13).forEach((position) => {
      columns[position.columnIndex][position.rowIndex] = bonusSymbol;
    });
  }

  return columns;
}

export function getReelSpinStrip(columnIndex: number) {
  const offset = columnIndex * 2;
  const seamlessStripLength = reelStripKeys.length * 2;

  return Array.from({ length: seamlessStripLength }, (_, index) => {
    const symbolKey = reelStripKeys[(index + offset) % reelStripKeys.length];
    return getSymbolByKey(symbolKey);
  });
}

export function evaluateNaganiSlotResult({
  columns,
  betAmount,
}: {
  columns: NaganiSlotSymbol[][];
  betAmount: number;
}): NaganiSlotWinEvaluation {
  const positionsBySymbol = new Map<NaganiSlotSymbolKey, NaganiSlotPosition[]>();

  columns.forEach((column, columnIndex) => {
    column.forEach((symbol, rowIndex) => {
      const currentPositions = positionsBySymbol.get(symbol.key) ?? [];

      currentPositions.push({ columnIndex, rowIndex });
      positionsBySymbol.set(symbol.key, currentPositions);
    });
  });

  const wildPositions = positionsBySymbol.get("wild") ?? [];
  const normalCandidates: NaganiSlotWinGroup[] = [];
  const specialGroups: NaganiSlotWinGroup[] = [];
  const wildAssistCandidates: NaganiSlotWinGroup[] = [];

  naganiSlotSymbols.forEach((symbol) => {
    const symbolPositions = positionsBySymbol.get(symbol.key) ?? [];

    if (symbol.key === "bonus") {
      if (symbolPositions.length >= 3) {
        specialGroups.push({
          symbolKey: symbol.key,
          symbolLabel: symbol.shortLabel,
          count: symbolPositions.length,
          score: getGroupScore(symbol, symbolPositions.length),
          positions: symbolPositions,
        });
      }

      return;
    }

    if (symbol.key === "wild") {
      if (symbolPositions.length >= 3) {
        specialGroups.push({
          symbolKey: symbol.key,
          symbolLabel: symbol.shortLabel,
          count: symbolPositions.length,
          score: getGroupScore(symbol, symbolPositions.length),
          positions: symbolPositions,
        });
      }

      return;
    }

    if (symbolPositions.length >= 3) {
      normalCandidates.push({
        symbolKey: symbol.key,
        symbolLabel: symbol.shortLabel,
        count: symbolPositions.length,
        score: getGroupScore(symbol, symbolPositions.length),
        positions: symbolPositions,
      });

      return;
    }

    // Wild can assist only one best near-match group, not every group.
    if (symbolPositions.length === 2 && wildPositions.length > 0) {
      const effectivePositions = [...symbolPositions, wildPositions[0]];

      wildAssistCandidates.push({
        symbolKey: symbol.key,
        symbolLabel: symbol.shortLabel,
        count: effectivePositions.length,
        score: Math.max(1, getGroupScore(symbol, effectivePositions.length) - 8),
        positions: effectivePositions,
      });
    }
  });

  const bestNormalGroups = [...normalCandidates]
    .sort((a, b) => b.score - a.score)
    .slice(0, 2);

  const bestWildAssistGroup = [...wildAssistCandidates].sort(
    (a, b) => b.score - a.score
  )[0];

  const winGroups: NaganiSlotWinGroup[] = [...bestNormalGroups];

  if (bestWildAssistGroup && winGroups.length < 2) {
    winGroups.push(bestWildAssistGroup);
  }

  specialGroups
    .sort((a, b) => b.score - a.score)
    .slice(0, 1)
    .forEach((group) => winGroups.push(group));

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

  const totalScore = winGroups.reduce((sum, group) => sum + group.score, 0);
  const bestGroup = [...winGroups].sort((a, b) => b.score - a.score)[0];
  const winningPositions = getUniquePositions(
    winGroups.flatMap((group) => group.positions)
  );

  const tier =
    totalScore >= 125 ? "big" : totalScore >= 72 ? "medium" : "small";

  const multiplier =
    tier === "big"
      ? Math.min(25, Math.max(15, Math.round(totalScore / 8)))
      : tier === "medium"
        ? Math.min(12, Math.max(6, Math.round(totalScore / 11)))
        : Math.min(5, Math.max(1, Math.round(totalScore / 18)));

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