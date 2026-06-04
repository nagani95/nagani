//src/lib>threeDiceResultAdapter.ts

import type {
  DiceAnimalLabel,
  ThreeDiceRoundPayload,
} from "@/components/games/six-animal/ThreeDicePhysicsStage";
import { SIX_ANIMAL_OPTIONS } from "@/lib/gameRules";
import type { SixAnimalKey, SixAnimalOption } from "@/types/games";

export const diceLabelToSixAnimalKey: Record<DiceAnimalLabel, SixAnimalKey> = {
  Tiger: "tiger",
  Dragon: "dragon",
  Rooster: "rooster",
  Fish: "fish",
  Crab: "crab",
  Elephant: "elephant",
};

export function getSixAnimalOptionFromDiceLabel(
  label: DiceAnimalLabel
): SixAnimalOption {
  const animalKey = diceLabelToSixAnimalKey[label];

  const option = SIX_ANIMAL_OPTIONS.find((animal) => animal.key === animalKey);

  if (!option) {
    throw new Error(`Missing Six Animal option for dice label: ${label}`);
  }

  return option;
}

export function convertThreeDicePayloadToSixAnimalKeys(
  payload: ThreeDiceRoundPayload
): SixAnimalKey[] {
  if (payload.status === "idle") return [];

  return payload.results.map((label) => diceLabelToSixAnimalKey[label]);
}

export function convertThreeDicePayloadToMyanmarResult(
  payload: ThreeDiceRoundPayload
): string[] {
  if (payload.status === "idle") return [];

  return payload.results.map((label) => {
    return getSixAnimalOptionFromDiceLabel(label).nameMm;
  });
}

export function convertThreeDicePayloadToDisplayNames(
  payload: ThreeDiceRoundPayload
): string[] {
  if (payload.status === "idle") return [];

  return payload.results.map((label) => {
    return getSixAnimalOptionFromDiceLabel(label).name;
  });
}