//scripts/generate-six-animal-dice-sounds.mjs

import fs from "fs";
import path from "path";

const OUT_DIR = path.join(
  process.cwd(),
  "public/assets/nagani/sounds/six-animal/dice"
);

const SAMPLE_RATE = 44100;

fs.mkdirSync(OUT_DIR, { recursive: true });

function wavBuffer(samples) {
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = SAMPLE_RATE * numChannels * (bitsPerSample / 8);
  const blockAlign = numChannels * (bitsPerSample / 8);
  const dataSize = samples.length * 2;
  const buffer = Buffer.alloc(44 + dataSize);

  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write("WAVE", 8);
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(SAMPLE_RATE, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(bitsPerSample, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(dataSize, 40);

  for (let i = 0; i < samples.length; i++) {
    const v = Math.max(-1, Math.min(1, samples[i]));
    buffer.writeInt16LE(v * 32767, 44 + i * 2);
  }

  return buffer;
}

function makeSamples(durationSeconds, render) {
  const length = Math.floor(durationSeconds * SAMPLE_RATE);
  const samples = new Float32Array(length);

  let seed = 123456;
  function rand() {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967295;
  }

  for (let i = 0; i < length; i++) {
    const t = i / SAMPLE_RATE;
    samples[i] = render(t, rand);
  }

  return samples;
}

function writeSound(filename, durationSeconds, render) {
  const samples = makeSamples(durationSeconds, render);
  fs.writeFileSync(path.join(OUT_DIR, filename), wavBuffer(samples));
  console.log(`created ${filename}`);
}

function decay(t, speed) {
  return Math.exp(-t * speed);
}

function noise(rand) {
  return rand() * 2 - 1;
}

writeSound("release-01.wav", 0.18, (t, rand) => {
  return (
    Math.sin(2 * Math.PI * 950 * t) * decay(t, 32) * 0.35 +
    noise(rand) * decay(t, 55) * 0.16
  );
});

writeSound("deflector-hit-01.wav", 0.28, (t, rand) => {
  return (
    Math.sin(2 * Math.PI * 210 * t) * decay(t, 15) * 0.42 +
    Math.sin(2 * Math.PI * 740 * t) * decay(t, 28) * 0.18 +
    noise(rand) * decay(t, 38) * 0.2
  );
});

writeSound("deflector-hit-02.wav", 0.24, (t, rand) => {
  return (
    Math.sin(2 * Math.PI * 250 * t) * decay(t, 18) * 0.34 +
    Math.sin(2 * Math.PI * 620 * t) * decay(t, 35) * 0.2 +
    noise(rand) * decay(t, 42) * 0.18
  );
});

writeSound("tray-impact-01.wav", 0.36, (t, rand) => {
  return (
    Math.sin(2 * Math.PI * 105 * t) * decay(t, 10) * 0.62 +
    Math.sin(2 * Math.PI * 330 * t) * decay(t, 21) * 0.24 +
    noise(rand) * decay(t, 32) * 0.18
  );
});

writeSound("tray-impact-02.wav", 0.34, (t, rand) => {
  return (
    Math.sin(2 * Math.PI * 135 * t) * decay(t, 11) * 0.52 +
    Math.sin(2 * Math.PI * 390 * t) * decay(t, 22) * 0.22 +
    noise(rand) * decay(t, 35) * 0.16
  );
});

writeSound("tap-01.wav", 0.16, (t, rand) => {
  return (
    Math.sin(2 * Math.PI * 410 * t) * decay(t, 38) * 0.28 +
    noise(rand) * decay(t, 50) * 0.13
  );
});

writeSound("tap-02.wav", 0.15, (t, rand) => {
  return (
    Math.sin(2 * Math.PI * 470 * t) * decay(t, 42) * 0.24 +
    noise(rand) * decay(t, 55) * 0.12
  );
});

writeSound("tap-03.wav", 0.14, (t, rand) => {
  return (
    Math.sin(2 * Math.PI * 360 * t) * decay(t, 40) * 0.22 +
    noise(rand) * decay(t, 58) * 0.11
  );
});

writeSound("settle-01.wav", 0.28, (t, rand) => {
  return (
    Math.sin(2 * Math.PI * 155 * t) * decay(t, 18) * 0.28 +
    noise(rand) * decay(t, 34) * 0.09
  );
});

writeSound("roll-loop-soft.wav", 2.4, (t, rand) => {
  const pulse =
    Math.sin(2 * Math.PI * 7.5 * t) * 0.5 +
    Math.sin(2 * Math.PI * 11.2 * t) * 0.3 +
    Math.sin(2 * Math.PI * 15.7 * t) * 0.2;

  return (
    noise(rand) * 0.055 +
    Math.sin(2 * Math.PI * 95 * t) * 0.025 +
    pulse * 0.035
  );
});

console.log(`\nDone. Files written to:\n${OUT_DIR}`);