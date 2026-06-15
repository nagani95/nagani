//scripts>build-six-animal-trajectory-manifest.mjs

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();

const TRAJECTORY_ROOT = path.join(
  ROOT,
  "public",
  "assets",
  "nagani",
  "six-animal",
  "dice",
  "trajectories"
);

const ANIMALS = ["Tiger", "Dragon", "Rooster", "Fish", "Crab", "Elephant"];

const animalFolder = (animal) => animal.toLowerCase();

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function sortEntries(a, b) {
  const animalDiff = ANIMALS.indexOf(a.animal) - ANIMALS.indexOf(b.animal);

  if (animalDiff !== 0) return animalDiff;
  if (a.dieIndex !== b.dieIndex) return a.dieIndex - b.dieIndex;

  return a.fileName.localeCompare(b.fileName);
}

const entries = [];
const counts = Object.fromEntries(ANIMALS.map((animal) => [animal, 0]));
const missingSlots = [];

for (const animal of ANIMALS) {
  const folder = path.join(TRAJECTORY_ROOT, animalFolder(animal));

  if (!fs.existsSync(folder)) {
    throw new Error(`Missing trajectory folder: ${folder}`);
  }

  const files = fs
    .readdirSync(folder)
    .filter((fileName) => fileName.endsWith(".json"))
    .filter((fileName) => !fileName.startsWith("diagnostic-"))
    .filter((fileName) => /^.+-v1-d[123]-\d{3}\.json$/.test(fileName))
    .sort();

  for (const fileName of files) {
    const filePath = path.join(folder, fileName);
    const file = readJson(filePath);

    if (file.schema !== "nagani.sixAnimal.diceTrajectory.v1") {
      throw new Error(`${fileName}: invalid trajectory schema`);
    }

    if (file.version !== 1) {
      throw new Error(`${fileName}: invalid trajectory version`);
    }

    if (file.approvedForProduction !== true) {
      throw new Error(`${fileName}: not approved for production`);
    }

    if (file.animal !== animal) {
      throw new Error(
        `${fileName}: animal mismatch. Folder ${animal}, file ${file.animal}`
      );
    }

    if (!Number.isInteger(file.dieIndex) || file.dieIndex < 0 || file.dieIndex > 2) {
      throw new Error(`${fileName}: invalid dieIndex ${file.dieIndex}`);
    }

    if (file.dieNumber !== file.dieIndex + 1) {
      throw new Error(
        `${fileName}: dieNumber ${file.dieNumber} does not match dieIndex ${file.dieIndex}`
      );
    }

    if (file.fileName !== fileName) {
      throw new Error(
        `${fileName}: internal fileName mismatch. JSON says ${file.fileName}`
      );
    }

    const expectedPublicTargetPath = `public/assets/nagani/six-animal/dice/trajectories/${animalFolder(
      animal
    )}/${fileName}`;

    const loadPath = `/assets/nagani/six-animal/dice/trajectories/${animalFolder(
      animal
    )}/${fileName}`;

    entries.push({
      animal: file.animal,
      dieIndex: file.dieIndex,
      dieNumber: file.dieNumber,
      fileName,
      publicTargetPath: expectedPublicTargetPath,
      loadPath,
      readableAtSeconds: file.timing.readableAtSeconds,
      motionEndSeconds: file.timing.motionEndSeconds,
      replayEndSeconds: file.timing.replayEndSeconds,
      motionGrade: file.quality.motionGrade,
      motionScore: file.quality.motionScore,
      confidence: file.quality.confidence,
    });

    counts[animal] += 1;
  }

  for (let dieIndex = 0; dieIndex < 3; dieIndex += 1) {
    const hasSlot = entries.some(
      (entry) => entry.animal === animal && entry.dieIndex === dieIndex
    );

    if (!hasSlot) {
      missingSlots.push(`${animal} D${dieIndex + 1}`);
    }
  }
}

if (missingSlots.length > 0) {
  throw new Error(
    [
      "Missing required slot-aware trajectories:",
      ...missingSlots.map((slot) => `- ${slot}`),
    ].join("\n")
  );
}

const manifest = {
  schema: "nagani.sixAnimal.diceTrajectoryManifest.v1",
  version: 1,
  generatedAt: new Date().toISOString(),
  totalFiles: entries.length,
  counts,
  targetPerAnimal: 10,
  entries: entries.sort(sortEntries),
};

const outputPath = path.join(TRAJECTORY_ROOT, "trajectory-manifest.v1.json");

fs.writeFileSync(outputPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");

console.log(`Wrote ${outputPath}`);
console.log(`Total files: ${manifest.totalFiles}`);
console.log(JSON.stringify(counts, null, 2));