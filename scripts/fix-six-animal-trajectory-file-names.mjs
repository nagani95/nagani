//scripts/fix-six-animal-trajectory-file-names.mjs

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

for (const animal of ANIMALS) {
  const folderName = animalFolder(animal);
  const folder = path.join(TRAJECTORY_ROOT, folderName);

  const files = fs
    .readdirSync(folder)
    .filter((fileName) => /^.+-v1-d[123]-\d{3}\.json$/.test(fileName))
    .sort();

  for (const fileName of files) {
    const filePath = path.join(folder, fileName);
    const json = JSON.parse(fs.readFileSync(filePath, "utf8"));

    const match = fileName.match(/-d([123])-([0-9]{3})\.json$/);
    if (!match) throw new Error(`Bad filename: ${fileName}`);

    const dieNumber = Number(match[1]);
    const dieIndex = dieNumber - 1;

    json.fileName = fileName;
    json.animal = animal;
    json.dieIndex = dieIndex;
    json.dieNumber = dieNumber;

    json.publicTargetPath = `public/assets/nagani/six-animal/dice/trajectories/${folderName}/${fileName}`;
    json.loadPath = `/assets/nagani/six-animal/dice/trajectories/${folderName}/${fileName}`;

    fs.writeFileSync(filePath, `${JSON.stringify(json, null, 2)}\n`, "utf8");

    console.log(`Fixed ${fileName}`);
  }
}