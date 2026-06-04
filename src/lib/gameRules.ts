//src>lib>gameRules.ts

import type { SixAnimalOption, ThirtySixAnimalOption } from "@/types/games";
import { naganiAssets } from "@/lib/naganiAssets";

export const SIX_ANIMAL_OPTIONS: SixAnimalOption[] = [
  {
    key: "tiger",
    name: "Tiger",
    nameMm: "ကျား",
    assetPath: naganiAssets.sixAnimal.animals.tiger,
  },
  {
    key: "dragon",
    name: "Dragon",
    nameMm: "နဂါး",
    assetPath: naganiAssets.sixAnimal.animals.dragon,
  },
  {
    key: "rooster",
    name: "Rooster",
    nameMm: "ကြက်",
    assetPath: naganiAssets.sixAnimal.animals.rooster,
  },
  {
    key: "fish",
    name: "Fish",
    nameMm: "ငါး",
    assetPath: naganiAssets.sixAnimal.animals.fish,
  },
  {
    key: "crab",
    name: "Crab",
    nameMm: "ဂဏန်း",
    assetPath: naganiAssets.sixAnimal.animals.crab,
  },
  {
    key: "elephant",
    name: "Elephant",
    nameMm: "ဆင်",
    assetPath: naganiAssets.sixAnimal.animals.elephant,
  },
];

export const THIRTY_SIX_ANIMAL_OPTIONS: ThirtySixAnimalOption[] = Array.from(
  { length: 36 },
  (_, index) => {
    const number = index + 1;
    const paddedNumber = String(number).padStart(2, "0");

    return {
      number,
      key: `animal_${paddedNumber}`,
      name: `Animal ${number}`,
      nameMm: `${number}`,
      assetPath: `/assets/nagani/thirty-six/animals/${paddedNumber}.webp`,
    };
  }
);

export const SIX_ANIMAL_RULES = {
  minBet: 1000,
  maxBet: 500000,
  diceCount: 3,
  maxSelectedAnimals: 1,
  matchMultipliers: {
    zeroMatch: 0,
    oneMatch: 1,
    twoMatches: 2,
    threeMatches: 3,
  },
  payoutNote:
    "Frontend shows match count only. Backend must confirm whether multiplier means profit-only or total return.",
};

export const THIRTY_SIX_RULES = {
  minBet: 1000,
  maxBet: 500000,
  maxSelectedAnimals: 36,
  payoutMultiplier: 30,
  drawCloseBeforeMinutes: 5,
  sampleDrawTimes: ["12:00", "18:00", "21:00"],
  payoutNote:
    "Frontend shows ticket/result status only. Backend must confirm whether 30x means profit-only or total return.",
};