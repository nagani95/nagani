//src/components/games/six-animal/physics/DiceVisuals.tsx

"use client";

import { RoundedBox, Text, useTexture } from "@react-three/drei";

import { naganiAssets } from "@/lib/naganiAssets";

import {
  getDiceShapeConfig,
  type DiceAnimalLabel,
  type DiceShapePreset,
} from "./physicsConstants";

const USE_DICE_FACE_TEXTURES = true;
const SHOW_DICE_FACE_TEXT_LABELS = false;

const DICE_FACE_ASSET_BASE = naganiAssets.sixAnimal.dice.faces.base;

const DICE_FACE_SURFACE_OFFSET = 0.553;
const DICE_FACE_PRINT_SIZE = 0.78;
const DICE_FACE_PRINT_ALPHA_TEST = 0.052;
const DICE_FACE_PRINT_OPACITY = 0.94;
const DICE_FACE_PRINT_WARM_TINT = "#f4deb0";

const DICE_BODY_COLOR = "#f2e2b6";
const DICE_BODY_ROUGHNESS = 0.44;
const DICE_BODY_METALNESS = 0.012;

const DICE_FACE_PLANE_ROUGHNESS = 0.7;
const DICE_FACE_PLANE_METALNESS = 0;

const HIDDEN_DICE_FACE_SIZE = 0.68;
const HIDDEN_DICE_FACE_COLOR = "#3a0908";
const HIDDEN_DICE_FACE_GOLD = "#c89f47";
const HIDDEN_DICE_FACE_SHADOW = "#120102";
const HIDDEN_DICE_FACE_OPACITY = 0.82;
const HIDDEN_DICE_FACE_SURFACE_OFFSET = DICE_FACE_SURFACE_OFFSET + 0.006;

type DiceMaterialToken = {
  color: string;
  roughness: number;
  metalness?: number;
  emissive?: string;
  emissiveIntensity?: number;
  clearcoat?: number;
  clearcoatRoughness?: number;
};

const DICE_MATERIALS = {
ivoryBody: {
  color: DICE_BODY_COLOR,
  roughness: DICE_BODY_ROUGHNESS,
  metalness: DICE_BODY_METALNESS,
  emissive: "#2c1906",
  emissiveIntensity: 0.055,
  clearcoat: 0.36,
  clearcoatRoughness: 0.52,
},
} satisfies Record<string, DiceMaterialToken>;

type DiceFaceVisual = {
  key: string;
  label: DiceAnimalLabel;
  assetPath: string;
  position: [number, number, number];
  rotation: [number, number, number];
};

const diceFaceVisuals: DiceFaceVisual[] = [
  {
    key: "face-top-tiger",
    label: "Tiger",
    assetPath: `${DICE_FACE_ASSET_BASE}/dice-face-tiger-v1.png`,
    position: [0, DICE_FACE_SURFACE_OFFSET, 0],
    rotation: [-Math.PI / 2, 0, 0],
  },
  {
    key: "face-bottom-dragon",
    label: "Dragon",
    assetPath: `${DICE_FACE_ASSET_BASE}/dice-face-dragon-v1.png`,
    position: [0, -DICE_FACE_SURFACE_OFFSET, 0],
    rotation: [Math.PI / 2, 0, 0],
  },
  {
    key: "face-right-rooster",
    label: "Rooster",
    assetPath: `${DICE_FACE_ASSET_BASE}/dice-face-rooster-v1.png`,
    position: [DICE_FACE_SURFACE_OFFSET, 0, 0],
    rotation: [0, Math.PI / 2, 0],
  },
  {
    key: "face-left-fish",
    label: "Fish",
    assetPath: `${DICE_FACE_ASSET_BASE}/dice-face-fish-v1.png`,
    position: [-DICE_FACE_SURFACE_OFFSET, 0, 0],
    rotation: [0, -Math.PI / 2, 0],
  },
  {
    key: "face-front-crab",
    label: "Crab",
    assetPath: `${DICE_FACE_ASSET_BASE}/dice-face-crab-v1.png`,
    position: [0, 0, DICE_FACE_SURFACE_OFFSET],
    rotation: [0, 0, 0],
  },
  {
    key: "face-back-elephant",
    label: "Elephant",
    assetPath: `${DICE_FACE_ASSET_BASE}/dice-face-elephant-v1.png`,
    position: [0, 0, -DICE_FACE_SURFACE_OFFSET],
    rotation: [0, Math.PI, 0],
  },
];

function DiceFaceLabels() {
  return (
    <>
      {diceFaceVisuals.map((face) => (
        <Text
          key={face.key}
          position={face.position}
          rotation={face.rotation}
          fontSize={0.16}
          maxWidth={0.82}
          textAlign="center"
          anchorX="center"
          anchorY="middle"
          color="#3b0a0a"
          outlineWidth={0.01}
          outlineColor="#f8e89a"
        >
          {face.label}
        </Text>
      ))}
    </>
  );
}

// Animal texture planes sit just above each dice face.
// Keep this layer very thin: it is visual only and must not affect physics.
function DiceFaceTexturePlane({ face }: { face: DiceFaceVisual }) {
  const texture = useTexture(face.assetPath);

  return (
    <mesh position={face.position} rotation={face.rotation} renderOrder={2}>
      <planeGeometry args={[DICE_FACE_PRINT_SIZE, DICE_FACE_PRINT_SIZE]} />
      <meshStandardMaterial
        map={texture}
        color={DICE_FACE_PRINT_WARM_TINT}
        transparent
        opacity={DICE_FACE_PRINT_OPACITY}
        alphaTest={DICE_FACE_PRINT_ALPHA_TEST}
        roughness={DICE_FACE_PLANE_ROUGHNESS}
        metalness={DICE_FACE_PLANE_METALNESS}
        toneMapped={false}
        polygonOffset
        polygonOffsetFactor={-1}
        polygonOffsetUnits={-1}
      />
    </mesh>
  );
}

function DiceFaceTexturePlanes() {
  return (
    <>
      {diceFaceVisuals.map((face) => (
        <DiceFaceTexturePlane key={`texture-${face.key}`} face={face} />
      ))}
    </>
  );
}

function DiceFaceLayer() {
  return (
    <>
      {USE_DICE_FACE_TEXTURES ? <DiceFaceTexturePlanes /> : null}
      {SHOW_DICE_FACE_TEXT_LABELS ? <DiceFaceLabels /> : null}
    </>
  );
}

function getHiddenDiceFacePosition(
  position: [number, number, number]
): [number, number, number] {
  return [
    position[0] === 0
      ? 0
      : Math.sign(position[0]) * HIDDEN_DICE_FACE_SURFACE_OFFSET,
    position[1] === 0
      ? 0
      : Math.sign(position[1]) * HIDDEN_DICE_FACE_SURFACE_OFFSET,
    position[2] === 0
      ? 0
      : Math.sign(position[2]) * HIDDEN_DICE_FACE_SURFACE_OFFSET,
  ];
}

function HiddenDiceFaceSeal({ face }: { face: DiceFaceVisual }) {
  return (
    <group
      position={getHiddenDiceFacePosition(face.position)}
      rotation={face.rotation}
    >
      <mesh renderOrder={2}>
        <planeGeometry args={[HIDDEN_DICE_FACE_SIZE, HIDDEN_DICE_FACE_SIZE]} />
        <meshStandardMaterial
          color={HIDDEN_DICE_FACE_COLOR}
          transparent
          opacity={HIDDEN_DICE_FACE_OPACITY}
          roughness={0.72}
          metalness={0.08}
          polygonOffset
          polygonOffsetFactor={-1}
          polygonOffsetUnits={-1}
        />
      </mesh>

      <mesh position={[0, 0, 0.003]} renderOrder={3}>
        <planeGeometry args={[HIDDEN_DICE_FACE_SIZE * 0.72, 0.045]} />
        <meshStandardMaterial
          color={HIDDEN_DICE_FACE_GOLD}
          roughness={0.42}
          metalness={0.5}
          polygonOffset
          polygonOffsetFactor={-2}
          polygonOffsetUnits={-2}
        />
      </mesh>

      <mesh
        position={[0, 0.14, 0.004]}
        rotation={[0, 0, Math.PI / 4]}
        renderOrder={3}
      >
        <planeGeometry args={[0.14, 0.14]} />
        <meshStandardMaterial
          color={HIDDEN_DICE_FACE_GOLD}
          roughness={0.46}
          metalness={0.46}
          polygonOffset
          polygonOffsetFactor={-2}
          polygonOffsetUnits={-2}
        />
      </mesh>

      <mesh position={[0, -0.14, 0.002]} renderOrder={2}>
        <planeGeometry args={[HIDDEN_DICE_FACE_SIZE * 0.58, 0.035]} />
        <meshStandardMaterial
          color={HIDDEN_DICE_FACE_SHADOW}
          transparent
          opacity={0.48}
          roughness={0.9}
          polygonOffset
          polygonOffsetFactor={-1}
          polygonOffsetUnits={-1}
        />
      </mesh>
    </group>
  );
}

function HiddenDiceFaceLayer() {
  return (
    <>
      {diceFaceVisuals.map((face) => (
        <HiddenDiceFaceSeal key={`hidden-${face.key}`} face={face} />
      ))}
    </>
  );
}

export function DiceVisual({
  shapePreset = "current",
  showFaceLayer = true,
  showHiddenFaceSeal = false,
}: {
  shapePreset?: DiceShapePreset;
  showFaceLayer?: boolean;
  showHiddenFaceSeal?: boolean;
}) {
  const shape = getDiceShapeConfig(shapePreset);

  return (
    <>
      <RoundedBox
        args={[shape.size, shape.size, shape.size]}
        radius={shape.cornerRadius}
        smoothness={shape.smoothness}
        castShadow
      >
        <meshPhysicalMaterial {...DICE_MATERIALS.ivoryBody} />
      </RoundedBox>

      {showFaceLayer ? <DiceFaceLayer /> : null}
      {!showFaceLayer && showHiddenFaceSeal ? <HiddenDiceFaceLayer /> : null}
    </>
  );
}