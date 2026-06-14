//src>components>games>six-animal>physics>diceTrajectoryLibrary.ts

import type { DiceAnimalLabel } from "./physicsConstants";
import type { DiceTrajectoryFrame } from "./diceShadowTypes";

export const DICE_TRAJECTORY_MANIFEST_LOAD_PATH =
  "/assets/nagani/six-animal/dice/trajectories/trajectory-manifest.v1.json";

export const DICE_TRAJECTORY_LIBRARY_ANIMALS: DiceAnimalLabel[] = [
  "Tiger",
  "Dragon",
  "Rooster",
  "Fish",
  "Crab",
  "Elephant",
];

export type DiceTrajectoryMotionGrade = "premium" | "accepted" | "weak";
export type DiceTrajectoryGateSeverity = "pass" | "warn" | "block";
export type DiceTrajectorySlotMatch =
  | "not-requested"
  | "exact-slot"
  | "fallback-any-slot";

export type ApprovedDiceTrajectoryManifestEntry = {
  animal: DiceAnimalLabel;
  dieIndex: number;
  dieNumber: number;
  fileName: string;
  publicTargetPath: string;
  loadPath?: string;
  readableAtSeconds: number;
  motionEndSeconds: number;
  replayEndSeconds: number;
  motionGrade: DiceTrajectoryMotionGrade;
  motionScore: number;
  confidence: number;
};

export type ApprovedDiceTrajectoryManifest = {
  schema: "nagani.sixAnimal.diceTrajectoryManifest.v1";
  version: 1;
  generatedAt: string;
  totalFiles: number;
  counts: Record<DiceAnimalLabel, number>;
  targetPerAnimal: number;
  entries: ApprovedDiceTrajectoryManifestEntry[];
};

export type ApprovedDiceTrajectoryFile = {
  schema: "nagani.sixAnimal.diceTrajectory.v1";
  version: 1;
  trajectoryId: string;
  fileName: string;
  publicTargetPath: string;
  animal: DiceAnimalLabel;
  dieIndex: number;
  dieNumber: number;
  source: "v1-live-physics-recorder";
  approvedForProduction: true;
  frameRate: 60;
  frames: DiceTrajectoryFrame[];
  timing: {
    readableAtSeconds: number;
    motionEndSeconds: number;
    replayEndSeconds: number;
  };
  quality: {
    finalStatus: "accepted" | "cocked";
    confidence: number;
    tiltDegrees: number;
    motionScore: number;
    motionGrade: DiceTrajectoryMotionGrade;
    gateSeverity: DiceTrajectoryGateSeverity;
    issues: {
      severity: DiceTrajectoryGateSeverity;
      code: string;
      message: string;
    }[];
  };
  metrics: Record<string, number>;
  metadata: {
    recordedAt: string;
    approvedAt: string;
    notes: string[];
  };
};

function isDiceAnimalLabel(value: string): value is DiceAnimalLabel {
  return DICE_TRAJECTORY_LIBRARY_ANIMALS.includes(value as DiceAnimalLabel);
}

function normalizePreferredDieIndex(preferredDieIndex?: number | null) {
  if (preferredDieIndex === null || preferredDieIndex === undefined) {
    return null;
  }

  if (!Number.isInteger(preferredDieIndex)) {
    throw new Error(`Invalid preferred die index: ${preferredDieIndex}`);
  }

  if (preferredDieIndex < 0 || preferredDieIndex > 2) {
    throw new Error(`Preferred die index out of range: ${preferredDieIndex}`);
  }

  return preferredDieIndex;
}

function getTrajectoryEntryLoadPath(entry: ApprovedDiceTrajectoryManifestEntry) {
  if (entry.loadPath) {
    return entry.loadPath;
  }

  if (entry.publicTargetPath.startsWith("public/")) {
    return entry.publicTargetPath.replace(/^public/, "");
  }

  if (entry.publicTargetPath.startsWith("/assets/")) {
    return entry.publicTargetPath;
  }

  throw new Error(`Invalid trajectory path for ${entry.fileName}.`);
}

async function fetchJson<T>(loadPath: string): Promise<T> {
  const response = await fetch(loadPath, {
    cache: "force-cache",
  });

  if (!response.ok) {
    throw new Error(
      `Failed to load dice trajectory asset: ${loadPath} (${response.status})`
    );
  }

  return (await response.json()) as T;
}

function validateManifest(
  manifest: ApprovedDiceTrajectoryManifest
): ApprovedDiceTrajectoryManifest {
  if (manifest.schema !== "nagani.sixAnimal.diceTrajectoryManifest.v1") {
    throw new Error("Invalid dice trajectory manifest schema.");
  }

  if (manifest.version !== 1) {
    throw new Error("Unsupported dice trajectory manifest version.");
  }

  if (!Array.isArray(manifest.entries)) {
    throw new Error("Dice trajectory manifest entries are missing.");
  }

  for (const animal of DICE_TRAJECTORY_LIBRARY_ANIMALS) {
    if (typeof manifest.counts?.[animal] !== "number") {
      throw new Error(`Dice trajectory manifest count missing for ${animal}.`);
    }
  }

  for (const entry of manifest.entries) {
    if (!isDiceAnimalLabel(entry.animal)) {
      throw new Error(`Invalid trajectory animal: ${entry.animal}`);
    }

const loadPath = getTrajectoryEntryLoadPath(entry);

if (!loadPath.startsWith("/assets/")) {
  throw new Error(`Invalid trajectory load path: ${loadPath}`);
}

    if (entry.dieIndex < 0 || entry.dieIndex > 2) {
      throw new Error(`Invalid trajectory dieIndex: ${entry.dieIndex}`);
    }
  }

  return manifest;
}

function validateTrajectoryFile(
  trajectory: ApprovedDiceTrajectoryFile,
  expectedAnimal?: DiceAnimalLabel
): ApprovedDiceTrajectoryFile {
  if (trajectory.schema !== "nagani.sixAnimal.diceTrajectory.v1") {
    throw new Error("Invalid dice trajectory file schema.");
  }

  if (trajectory.version !== 1) {
    throw new Error("Unsupported dice trajectory file version.");
  }

  if (!trajectory.approvedForProduction) {
    throw new Error(`${trajectory.fileName} is not approved for production.`);
  }

  if (!isDiceAnimalLabel(trajectory.animal)) {
    throw new Error(`Invalid trajectory animal: ${trajectory.animal}`);
  }

  if (expectedAnimal && trajectory.animal !== expectedAnimal) {
    throw new Error(
      `Trajectory animal mismatch. Expected ${expectedAnimal}, got ${trajectory.animal}.`
    );
  }

  if (!Array.isArray(trajectory.frames) || trajectory.frames.length < 2) {
    throw new Error(`${trajectory.fileName} has no usable frames.`);
  }

  return trajectory;
}

export async function loadDiceTrajectoryManifest(
  manifestLoadPath = DICE_TRAJECTORY_MANIFEST_LOAD_PATH
) {
  const manifest =
    await fetchJson<ApprovedDiceTrajectoryManifest>(manifestLoadPath);

  return validateManifest(manifest);
}

export function getTrajectoryEntriesForAnimal({
  manifest,
  animal,
  preferredDieIndex = null,
}: {
  manifest: ApprovedDiceTrajectoryManifest;
  animal: DiceAnimalLabel;
  preferredDieIndex?: number | null;
}) {
  return getSlotAwareTrajectoryEntriesForAnimal({
    manifest,
    animal,
    preferredDieIndex,
  }).entries;
}

export function getSlotAwareTrajectoryEntriesForAnimal({
  manifest,
  animal,
  preferredDieIndex = null,
}: {
  manifest: ApprovedDiceTrajectoryManifest;
  animal: DiceAnimalLabel;
  preferredDieIndex?: number | null;
}): {
  entries: ApprovedDiceTrajectoryManifestEntry[];
  slotMatch: DiceTrajectorySlotMatch;
  requestedDieIndex: number | null;
} {
  const requestedDieIndex = normalizePreferredDieIndex(preferredDieIndex);

  const animalEntries = manifest.entries.filter(
    (entry) => entry.animal === animal
  );

  if (requestedDieIndex === null) {
    return {
      entries: animalEntries,
      slotMatch: "not-requested",
      requestedDieIndex,
    };
  }

  const exactSlotEntries = animalEntries.filter(
    (entry) => entry.dieIndex === requestedDieIndex
  );

  if (exactSlotEntries.length > 0) {
    return {
      entries: exactSlotEntries,
      slotMatch: "exact-slot",
      requestedDieIndex,
    };
  }

  return {
    entries: animalEntries,
    slotMatch: "fallback-any-slot",
    requestedDieIndex,
  };
}

export function selectSlotAwareTrajectoryEntryForAnimal({
  manifest,
  animal,
  preferredDieIndex = null,
  random = Math.random,
}: {
  manifest: ApprovedDiceTrajectoryManifest;
  animal: DiceAnimalLabel;
  preferredDieIndex?: number | null;
  random?: () => number;
}) {
  const selection = getSlotAwareTrajectoryEntriesForAnimal({
    manifest,
    animal,
    preferredDieIndex,
  });

  if (selection.entries.length === 0) {
    throw new Error(`No approved trajectory found for ${animal}.`);
  }

  const index = Math.floor(random() * selection.entries.length);
  const entry = selection.entries[Math.min(index, selection.entries.length - 1)];

  return {
    entry,
    entries: selection.entries,
    slotMatch: selection.slotMatch,
    requestedDieIndex: selection.requestedDieIndex,
  };
}

export function selectTrajectoryEntryForAnimal({
  manifest,
  animal,
  preferredDieIndex = null,
  random = Math.random,
}: {
  manifest: ApprovedDiceTrajectoryManifest;
  animal: DiceAnimalLabel;
  preferredDieIndex?: number | null;
  random?: () => number;
}) {
return selectSlotAwareTrajectoryEntryForAnimal({
  manifest,
  animal,
  preferredDieIndex,
  random,
}).entry;
}

export async function loadDiceTrajectoryFile(
  entry: ApprovedDiceTrajectoryManifestEntry
) {
  const trajectory = await fetchJson<ApprovedDiceTrajectoryFile>(
  getTrajectoryEntryLoadPath(entry)
);

  return validateTrajectoryFile(trajectory, entry.animal);
}

export async function loadDiceTrajectoryForAnimal({
  animal,
  preferredDieIndex = null,
  manifestLoadPath = DICE_TRAJECTORY_MANIFEST_LOAD_PATH,
  random = Math.random,
}: {
  animal: DiceAnimalLabel;
  preferredDieIndex?: number | null;
  manifestLoadPath?: string;
  random?: () => number;
}) {
  const manifest = await loadDiceTrajectoryManifest(manifestLoadPath);

const selection = selectSlotAwareTrajectoryEntryForAnimal({
  manifest,
  animal,
  preferredDieIndex,
  random,
});

const trajectory = await loadDiceTrajectoryFile(selection.entry);

return {
  manifest,
  entry: selection.entry,
  trajectory,
  slotMatch: selection.slotMatch,
  requestedDieIndex: selection.requestedDieIndex,
};
}