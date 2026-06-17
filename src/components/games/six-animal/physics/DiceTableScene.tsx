//src/components/games/six-animal/physics/DiceTableScene.tsx

"use client";

import { RoundedBox } from "@react-three/drei";
import { CuboidCollider, RigidBody } from "@react-three/rapier";

import { DiceVisual } from "./DiceVisuals";
import {
  DICE_HOLDER_X_POSITIONS,
  DISPLAY_DICE_ROTATIONS,
  TABLE_DEFLECTOR_FRICTION,
  TABLE_DEFLECTOR_RESTITUTION,
  TABLE_DEFLECTOR_SHOULDER_FRICTION,
  TABLE_DEFLECTOR_SHOULDER_RESTITUTION,
  TABLE_FRONT_COLLIDER_HEIGHT,
  TABLE_FRONT_KEEPER_FRICTION,
  TABLE_FRONT_KEEPER_RESTITUTION,
  TABLE_FRONT_REBOUND_FRICTION,
  TABLE_FRONT_REBOUND_RESTITUTION,
  TABLE_FRONT_VISUAL_LIP_HEIGHT,
  TABLE_SAFETY_FRONT_FRICTION,
  TABLE_SAFETY_FRONT_RESTITUTION,
  TABLE_SAFETY_SIDE_FRICTION,
  TABLE_SAFETY_SIDE_RESTITUTION,
  TABLE_SIDE_RAIL_FRICTION,
  TABLE_SIDE_RAIL_RESTITUTION,
  createTableMeasurements,
  type DiceShapePreset,
  type TableMeasurements,
} from "./physicsConstants";

type TestMode = "trap" | "runway";
type MountedDiceRackMode = "ready" | "sequence" | "empty";

const TABLE_RUNWAY_COLOR = "#5f0612";
const TABLE_BACKBOARD_COLOR = "#260405";
const TABLE_INNER_PANEL_COLOR = "#3a0808";
const TABLE_BORDER_COLOR = "#1d0304";
const TABLE_TRAPDOOR_CLOSED_COLOR = "#35100d";
const TABLE_TRAPDOOR_OPEN_COLOR = "#4a1813";
const TABLE_GOLD_ACCENT_COLOR = "#b9903d";
const TABLE_WOOD_ACCENT_COLOR = "#2b0806";
const TABLE_RUNWAY_INSET_COLOR = "#760816";
const TABLE_RUNWAY_SHADOW_COLOR = "#240205";
const TABLE_GOLD_TRIM_COLOR = "#c89f47";

const TABLE_LACQUER_OUTER_COLOR = "#190203";
const TABLE_SIDE_INNER_GLOW_COLOR = "#45100f";
const TABLE_VELVET_HIGHLIGHT_COLOR = "#9c1120";
const TABLE_SHADOW_GLASS_COLOR = "#120102";
const TABLE_BRASS_SHADOW_COLOR = "#6e4a1e";

type TableMaterialToken = {
  color: string;
  roughness: number;
  metalness?: number;
  transparent?: boolean;
  opacity?: number;
};

const TABLE_MATERIALS = {
  runwayFelt: {
    color: TABLE_RUNWAY_COLOR,
    roughness: 0.99,
    metalness: 0,
  },
  runwayInset: {
    color: TABLE_RUNWAY_INSET_COLOR,
    roughness: 1,
    metalness: 0,
    transparent: true,
    opacity: 0.22,
  },
  runwayCenterGlow: {
    color: TABLE_VELVET_HIGHLIGHT_COLOR,
    roughness: 1,
    metalness: 0,
    transparent: true,
    opacity: 0.1,
  },
  runwayBackShadow: {
    color: TABLE_RUNWAY_SHADOW_COLOR,
    roughness: 1,
    metalness: 0,
    transparent: true,
    opacity: 0.28,
  },
  runwaySideDepth: {
    color: TABLE_SHADOW_GLASS_COLOR,
    roughness: 1,
    metalness: 0,
    transparent: true,
    opacity: 0.12,
  },
  backboardLacquer: {
    color: TABLE_BACKBOARD_COLOR,
    roughness: 0.48,
    metalness: 0.08,
  },
  innerLacquerPanel: {
    color: TABLE_INNER_PANEL_COLOR,
    roughness: 0.56,
    metalness: 0.06,
  },
  holderWood: {
    color: TABLE_WOOD_ACCENT_COLOR,
    roughness: 0.62,
    metalness: 0.04,
  },
  trapdoorClosed: {
    color: TABLE_TRAPDOOR_CLOSED_COLOR,
    roughness: 0.68,
    metalness: 0.025,
  },
  trapdoorOpen: {
    color: TABLE_TRAPDOOR_OPEN_COLOR,
    roughness: 0.7,
    metalness: 0.025,
  },
  goldAccent: {
    color: TABLE_GOLD_ACCENT_COLOR,
    roughness: 0.42,
    metalness: 0.55,
  },
  goldTrim: {
    color: TABLE_GOLD_TRIM_COLOR,
    roughness: 0.4,
    metalness: 0.5,
  },
  darkBorder: {
    color: TABLE_BORDER_COLOR,
    roughness: 0.52,
    metalness: 0.06,
  },
  sideGoldRail: {
    color: TABLE_GOLD_TRIM_COLOR,
    roughness: 0.42,
    metalness: 0.48,
  },
  railLacquerSheen: {
    color: TABLE_SIDE_INNER_GLOW_COLOR,
    roughness: 0.46,
    metalness: 0.08,
    transparent: true,
    opacity: 0.22,
  },
  railOuterShadow: {
    color: TABLE_LACQUER_OUTER_COLOR,
    roughness: 0.7,
    metalness: 0.04,
    transparent: true,
    opacity: 0.42,
  },
  frontLipLacquerSheen: {
    color: TABLE_SIDE_INNER_GLOW_COLOR,
    roughness: 0.44,
    metalness: 0.08,
    transparent: true,
    opacity: 0.18,
  },
  frontLipBottomShadow: {
    color: TABLE_SHADOW_GLASS_COLOR,
    roughness: 0.78,
    metalness: 0.03,
    transparent: true,
    opacity: 0.36,
  },
  backboardLacquerSheen: {
    color: TABLE_SIDE_INNER_GLOW_COLOR,
    roughness: 0.48,
    metalness: 0.08,
    transparent: true,
    opacity: 0.16,
  },
  backboardLowerShadow: {
    color: TABLE_SHADOW_GLASS_COLOR,
    roughness: 0.82,
    metalness: 0.03,
    transparent: true,
    opacity: 0.34,
  },
  holderShelfGoldEdge: {
    color: TABLE_GOLD_TRIM_COLOR,
    roughness: 0.38,
    metalness: 0.5,
  },
  holderShelfShadow: {
    color: TABLE_SHADOW_GLASS_COLOR,
    roughness: 0.8,
    metalness: 0.03,
    transparent: true,
    opacity: 0.34,
  },
  kanoteGold: {
    color: TABLE_GOLD_TRIM_COLOR,
    roughness: 0.44,
    metalness: 0.52,
  },
  kanoteSoftShadow: {
    color: TABLE_BRASS_SHADOW_COLOR,
    roughness: 0.62,
    metalness: 0.24,
    transparent: true,
    opacity: 0.34,
  },
  kanoteBackboardGhost: {
    color: TABLE_GOLD_ACCENT_COLOR,
    roughness: 0.58,
    metalness: 0.26,
    transparent: true,
    opacity: 0.12,
  },
} satisfies Record<string, TableMaterialToken>;

const DEV_TRAP_RELEASE_DICE_START_Y = 2.82;
const DEV_TRAP_RELEASE_DICE_START_Z_OFFSET = 0.67;

const DEV_TRAP_RELEASE_HINGE_Y = 2.42;
const DEV_TRAP_RELEASE_HINGE_Z_OFFSET = 0.41;
const DEV_TRAP_RELEASE_CLOSED_ANGLE = 0.56;
const DEV_TRAP_RELEASE_OPEN_ANGLE = 1.12;

const DEV_RUNWAY_UPPER_RESTITUTION = 0.28;
const DEV_RUNWAY_UPPER_FRICTION = 0.3;
const DEV_RUNWAY_SETTLING_RESTITUTION = 0.14;
const DEV_RUNWAY_SETTLING_FRICTION = 0.4;

const DEV_DEFLECTOR_RESTITUTION = 0.78;
const DEV_DEFLECTOR_FRICTION = 0.18;
const DEV_DEFLECTOR_SHOULDER_RESTITUTION = 0.7;
const DEV_DEFLECTOR_SHOULDER_FRICTION = 0.22;

export function getDevTrapReleaseDicePosition({
  table,
  activeDieX,
}: {
  table: TableMeasurements;
  activeDieX: number;
}): [number, number, number] {
  return [
    activeDieX,
    DEV_TRAP_RELEASE_DICE_START_Y,
    table.backWallZ + DEV_TRAP_RELEASE_DICE_START_Z_OFFSET,
  ];
}

function TableRunwayDepthLayer({ table }: { table: TableMeasurements }) {
  return (
    <>
      {/* visual-only soft velvet wash; no collider */}
      <mesh
        position={[0, table.floorY + 0.108, table.floorZ + 0.36]}
        rotation={[table.slopeAngle, 0, 0]}
        receiveShadow
      >
        <boxGeometry args={[table.floorWidth - 0.95, 0.006, table.floorDepth - 1.55]} />
        <meshStandardMaterial
          {...TABLE_MATERIALS.runwayCenterGlow}
          depthWrite={false}
        />
      </mesh>

{/* visual-only very soft royal floor depth; no collider */}
<mesh
  position={[0, table.floorY + 0.116, table.floorZ + 0.82]}
  rotation={[table.settlingSlopeAngle, 0, 0]}
  receiveShadow
>
  <boxGeometry args={[table.floorWidth - 1.42, 0.004, 3.65]} />
  <meshStandardMaterial
    color="#8b0714"
    roughness={1}
    metalness={0}
    transparent
    opacity={0.075}
    depthWrite={false}
  />
</mesh>

      {/* visual-only rear shadow where dice leaves the holder area; no collider */}
      <mesh
        position={[0, table.floorY + 0.112, table.backEdgeZ + 0.72]}
        rotation={[table.slopeAngle, 0, 0]}
        receiveShadow
      >
        <boxGeometry args={[table.floorWidth - 0.82, 0.006, 0.42]} />
        <meshStandardMaterial
          {...TABLE_MATERIALS.runwayBackShadow}
          depthWrite={false}
        />
      </mesh>

            {/* visual-only back wall / runway seam cover; no collider */}
      <mesh
        position={[0, table.floorY + 0.13, table.backEdgeZ + 0.18]}
        rotation={[table.slopeAngle, 0, 0]}
        receiveShadow
      >
        <boxGeometry args={[table.floorWidth - 0.46, 0.012, 0.22]} />
        <meshStandardMaterial
          color="#0b0102"
          roughness={0.9}
          metalness={0.02}
          transparent
          opacity={0.42}
          depthWrite={false}
        />
      </mesh>

      {/* visual-only soft red cove above the seam; no collider */}
      <mesh
        position={[0, table.floorY + 0.138, table.backEdgeZ + 0.34]}
        rotation={[table.slopeAngle, 0, 0]}
        receiveShadow
      >
        <boxGeometry args={[table.floorWidth - 0.72, 0.006, 0.34]} />
        <meshStandardMaterial
          color="#3b0308"
          roughness={1}
          metalness={0}
          transparent
          opacity={0.2}
          depthWrite={false}
        />
      </mesh>

      {/* visual-only soft rail-side shadow, kept flat so it does not read as an obstacle */}
      <mesh
        position={[-table.halfWidth + 0.56, table.floorY + 0.11, table.floorZ + 0.28]}
        rotation={[table.slopeAngle, 0, 0]}
        receiveShadow
      >
        <boxGeometry args={[0.18, 0.005, table.floorDepth - 1.25]} />
        <meshStandardMaterial
          {...TABLE_MATERIALS.runwaySideDepth}
          depthWrite={false}
        />
      </mesh>

      <mesh
        position={[table.halfWidth - 0.56, table.floorY + 0.11, table.floorZ + 0.28]}
        rotation={[table.slopeAngle, 0, 0]}
        receiveShadow
      >
        <boxGeometry args={[0.18, 0.005, table.floorDepth - 1.25]} />
        <meshStandardMaterial
          {...TABLE_MATERIALS.runwaySideDepth}
          depthWrite={false}
        />
      </mesh>
    </>
  );
}

function TableRunway({
  table,
  devPhysicalReleaseEnabled = false,
}: {
  table: TableMeasurements;
  devPhysicalReleaseEnabled?: boolean;
}) {
  const upperRunwayRestitution = devPhysicalReleaseEnabled
    ? DEV_RUNWAY_UPPER_RESTITUTION
    : undefined;

  const upperRunwayFriction = devPhysicalReleaseEnabled
    ? DEV_RUNWAY_UPPER_FRICTION
    : undefined;

  const settlingRunwayRestitution = devPhysicalReleaseEnabled
    ? DEV_RUNWAY_SETTLING_RESTITUTION
    : undefined;

  const settlingRunwayFriction = devPhysicalReleaseEnabled
    ? DEV_RUNWAY_SETTLING_FRICTION
    : undefined;

  return (
    <>
      {/* upper lively runway: keeps the dice exciting after drop */}
      <mesh
        position={[0, table.upperFloorY, table.upperFloorZ]}
        rotation={[table.runwaySlopeAngle, 0, 0]}
        receiveShadow
      >
        <boxGeometry
          args={[table.floorWidth, 0.18, table.upperFloorDepth + 0.04]}
        />
        <meshStandardMaterial {...TABLE_MATERIALS.runwayFelt} />
      </mesh>

<CuboidCollider
  args={[table.halfWidth, 0.09, table.upperFloorDepth / 2 + 0.02]}
  position={[0, table.upperFloorY, table.upperFloorZ]}
  rotation={[table.runwaySlopeAngle, 0, 0]}
  restitution={upperRunwayRestitution}
  friction={upperRunwayFriction}
/>

      {/* lower runout tray: still sloped, but calmer for natural settling */}
      <mesh
        position={[0, table.settlingFloorY, table.settlingFloorZ]}
        rotation={[table.settlingSlopeAngle, 0, 0]}
        receiveShadow
      >
        <boxGeometry
          args={[table.floorWidth, 0.18, table.settlingFloorDepth + 0.04]}
        />
        <meshStandardMaterial {...TABLE_MATERIALS.runwayFelt} />
      </mesh>

<CuboidCollider
  args={[table.halfWidth, 0.09, table.settlingFloorDepth / 2 + 0.02]}
  position={[0, table.settlingFloorY, table.settlingFloorZ]}
  rotation={[table.settlingSlopeAngle, 0, 0]}
  restitution={settlingRunwayRestitution}
  friction={settlingRunwayFriction}
/>

            {/* visual-only soft inner felt tone; no collider */}
      <mesh
        position={[0, table.floorY + 0.102, table.floorZ + 0.32]}
        rotation={[table.slopeAngle, 0, 0]}
        receiveShadow
      >
        <boxGeometry args={[table.floorWidth - 0.72, 0.006, table.floorDepth - 1.28]} />
<meshStandardMaterial
  color="#8d0715"
  roughness={1}
  metalness={0}
  transparent
  opacity={0.11}
  depthWrite={false}
/>
      </mesh>

      <TableRunwayDepthLayer table={table} />
    </>
  );
}

function TableBackboardDepth({ table }: { table: TableMeasurements }) {
  return (
    <>
      {/* visual-only upper lacquer sheen; no collider */}
      <mesh
        position={[0, 2.82, table.backWallZ + 0.155]}
        receiveShadow
      >
        <boxGeometry args={[table.floorWidth - 0.72, 0.08, 0.018]} />
        <meshStandardMaterial
          {...TABLE_MATERIALS.backboardLacquerSheen}
          depthWrite={false}
        />
      </mesh>

      {/* visual-only soft center lacquer reflection; no collider */}
      <mesh
        position={[0, 1.55, table.backWallZ + 0.158]}
        receiveShadow
      >
        <boxGeometry args={[table.floorWidth - 1.05, 0.18, 0.018]} />
        <meshStandardMaterial
          {...TABLE_MATERIALS.backboardLacquerSheen}
          depthWrite={false}
        />
      </mesh>

            {/* visual-only warm palace glow behind dice holder; no collider */}
      <mesh
        position={[0, 2.08, table.backWallZ + 0.162]}
        receiveShadow
      >
        <boxGeometry args={[3.42, 0.34, 0.018]} />
        <meshStandardMaterial
          color="#8a4a18"
          roughness={0.72}
          metalness={0.08}
          transparent
          opacity={0.16}
          depthWrite={false}
        />
      </mesh>

      {/* visual-only lower holder shadow; no collider */}
      <mesh
        position={[0, 1.82, table.backWallZ + 0.164]}
        receiveShadow
      >
        <boxGeometry args={[3.2, 0.16, 0.018]} />
        <meshStandardMaterial
          color="#080101"
          roughness={0.9}
          metalness={0.02}
          transparent
          opacity={0.26}
          depthWrite={false}
        />
      </mesh>

      {/* visual-only lower shadow behind chute/tray; no collider */}
      <mesh
        position={[0, -0.42, table.backWallZ + 0.16]}
        receiveShadow
      >
        <boxGeometry args={[table.floorWidth - 0.48, 0.42, 0.02]} />
        <meshStandardMaterial
          {...TABLE_MATERIALS.backboardLowerShadow}
          depthWrite={false}
        />
      </mesh>
    </>
  );
}

function TableBackboardKanotePattern({ table }: { table: TableMeasurements }) {
  const motifCount = 7;
  const spacing = (table.floorWidth - 1.25) / (motifCount - 1);
  const startX = -((motifCount - 1) * spacing) / 2;

  return (
    <group position={[0, 1.72, table.backWallZ + 0.185]}>
      {/* visual-only ghost Kanote band; no collider */}
      <mesh position={[0, 0, -0.004]} receiveShadow>
        <boxGeometry args={[table.floorWidth - 0.95, 0.025, 0.012]} />
        <meshStandardMaterial
          {...TABLE_MATERIALS.kanoteBackboardGhost}
          depthWrite={false}
        />
      </mesh>

      {Array.from({ length: motifCount }).map((_, index) => {
        const x = startX + index * spacing;

        return (
          <group key={`backboard-kanote-motif-${index}`} position={[x, 0, 0]}>
            <mesh rotation={[0, 0, Math.PI / 4]} receiveShadow>
              <boxGeometry args={[0.12, 0.12, 0.012]} />
              <meshStandardMaterial
                {...TABLE_MATERIALS.kanoteBackboardGhost}
                depthWrite={false}
              />
            </mesh>

            <mesh position={[0, 0.11, 0.002]} receiveShadow>
              <boxGeometry args={[0.16, 0.018, 0.012]} />
              <meshStandardMaterial
                {...TABLE_MATERIALS.kanoteBackboardGhost}
                depthWrite={false}
              />
            </mesh>

            <mesh position={[0, -0.11, 0.002]} receiveShadow>
              <boxGeometry args={[0.16, 0.018, 0.012]} />
              <meshStandardMaterial
                {...TABLE_MATERIALS.kanoteBackboardGhost}
                depthWrite={false}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

function TableBackboard({ table }: { table: TableMeasurements }) {
  return (
    <>
<RoundedBox
  position={[0, 1.05, table.backWallZ]}
  args={[table.floorWidth + 0.12, 4.45, 0.26]}
  radius={0.045}
  smoothness={8}
  receiveShadow
  castShadow
>
  <meshStandardMaterial {...TABLE_MATERIALS.backboardLacquer} />
</RoundedBox>

      <CuboidCollider
        args={[table.halfWidth + 0.06, 2.22, 0.13]}
        position={[0, 1.05, table.backWallZ]}
      />

      {/* inner lacquer panel */}
      <mesh position={[0, 1.04, table.backWallZ + 0.018]} receiveShadow>
        <boxGeometry args={[table.floorWidth - 0.38, 3.72, 0.035]} />
        <meshStandardMaterial {...TABLE_MATERIALS.innerLacquerPanel} />
      </mesh>
            <TableBackboardDepth table={table} />
            <TableBackboardKanotePattern table={table} />
    </>
  );
}


function TrapdoorFlaps({
  table,
  activeDieIndex,
  sequenceRunning,
  displayOnly,
  devPhysicalReleaseEnabled,
}: {
  table: TableMeasurements;
  activeDieIndex: number;
  sequenceRunning: boolean;
  displayOnly: boolean;
  devPhysicalReleaseEnabled: boolean;
}) {
  return (
    <>
      {DICE_HOLDER_X_POSITIONS.map((x, index) => {
        const hasDroppedThisRound =
          !displayOnly && sequenceRunning && index <= activeDieIndex;

        const isSingleDropOpen =
          !displayOnly && !sequenceRunning && index === activeDieIndex;

const isDoorOpen = hasDroppedThisRound || isSingleDropOpen;

const closedAngle = 0.56;
        const openAngle = devPhysicalReleaseEnabled
  ? DEV_TRAP_RELEASE_OPEN_ANGLE
  : 1.22;

        return (
          <group
            key={`trapdoor-flap-${index}`}
position={[
  x,
  DEV_TRAP_RELEASE_HINGE_Y,
  table.backWallZ +
    (devPhysicalReleaseEnabled ? DEV_TRAP_RELEASE_HINGE_Z_OFFSET : 0.18),
]}
            rotation={[isDoorOpen ? openAngle : closedAngle, 0, 0]}
          >
            {/* simple hinge bar at wall-door connection */}
            <mesh position={[0, 0.002, 0.04]} receiveShadow castShadow>
              <boxGeometry args={[0.62, 0.026, 0.04]} />
              <meshStandardMaterial {...TABLE_MATERIALS.goldTrim} />
            </mesh>

            {/* lacquer trapdoor panel under the dice */}
            <RoundedBox
              position={[0, -0.02, 0.31]}
              args={[0.78, 0.055, 0.58]}
              radius={0.025}
              smoothness={6}
              receiveShadow
              castShadow
            >
              <meshStandardMaterial
                {...(isDoorOpen
                  ? TABLE_MATERIALS.trapdoorOpen
                  : TABLE_MATERIALS.trapdoorClosed)}
              />
            </RoundedBox>

            {/* visual-only inset shadow on trapdoor */}
            <mesh position={[0, -0.052, 0.31]} receiveShadow>
              <boxGeometry args={[0.58, 0.01, 0.38]} />
              <meshStandardMaterial
                color="#170202"
                roughness={0.82}
                metalness={0.02}
                transparent
                opacity={0.28}
                depthWrite={false}
              />
            </mesh>

            {/* tiny gold front edge */}
            <mesh position={[0, 0.01, 0.58]} receiveShadow castShadow>
              <boxGeometry args={[0.62, 0.024, 0.035]} />
              <meshStandardMaterial {...TABLE_MATERIALS.goldTrim} />
            </mesh>
          </group>
        );
      })}
    </>
  );
}

function WaitingDiceRack({
  table,
  activeDieIndex,
  sequenceRunning,
  diceShapePreset,
  mountedDiceRackMode,
  devPhysicalReleaseEnabled,
}: {
  table: TableMeasurements;
  activeDieIndex: number;
  sequenceRunning: boolean;
  diceShapePreset: DiceShapePreset;
  mountedDiceRackMode: MountedDiceRackMode;
  devPhysicalReleaseEnabled: boolean;
}) {
  return (
    <>
      {DICE_HOLDER_X_POSITIONS.map((x, index) => {
        const isRackWaitingForSequence =
          mountedDiceRackMode === "sequence" && !sequenceRunning;

        const shouldShowWaitingDie =
          mountedDiceRackMode === "ready" ||
          isRackWaitingForSequence ||
          (mountedDiceRackMode === "sequence" &&
            sequenceRunning &&
            index > activeDieIndex);

        if (!shouldShowWaitingDie) return null;

const waitingDiePosition: [number, number, number] =
  devPhysicalReleaseEnabled
    ? getDevTrapReleaseDicePosition({
        table,
        activeDieX: x,
      })
    : [x, 2.82, table.backWallZ + 0.42];

        const waitingDieScale = 1;
        const baseRotation = DISPLAY_DICE_ROTATIONS[index] ?? [0, 0, 0];

        const waitingPreviewOffset =
          mountedDiceRackMode === "ready" || isRackWaitingForSequence
            ? activeDieIndex + index + 1
            : 0;

        const waitingDieRotation: [number, number, number] = [
          baseRotation[0] + Math.sin(waitingPreviewOffset * 1.7) * 0.08,
          baseRotation[1] + Math.cos(waitingPreviewOffset * 1.3) * 0.1,
          baseRotation[2] + Math.sin(waitingPreviewOffset * 2.1) * 0.07,
        ];

        return (
          <group
            key={`mounted-waiting-die-${index}`}
            position={waitingDiePosition}
            rotation={waitingDieRotation}
            scale={[waitingDieScale, waitingDieScale, waitingDieScale]}
          >
            <DiceVisual shapePreset={diceShapePreset} />
          </group>
        );
      })}
    </>
  );
}

function StumbleBar({
  table,
  testMode,
  forceVisible = false,
  devPhysicalReleaseEnabled = false,
}: {
  table: TableMeasurements;
  testMode: TestMode;
  forceVisible?: boolean;
  devPhysicalReleaseEnabled?: boolean;
}) {
if (testMode !== "trap" && !forceVisible) return null;

const deflectorY = 0.36;
const deflectorZ = table.backWallZ + 0.78;
const deflectorRotation = 0.12;

const deflectorRestitution = devPhysicalReleaseEnabled
  ? DEV_DEFLECTOR_RESTITUTION
  : TABLE_DEFLECTOR_RESTITUTION;

const deflectorFriction = devPhysicalReleaseEnabled
  ? DEV_DEFLECTOR_FRICTION
  : TABLE_DEFLECTOR_FRICTION;

const shoulderRestitution = devPhysicalReleaseEnabled
  ? DEV_DEFLECTOR_SHOULDER_RESTITUTION
  : TABLE_DEFLECTOR_SHOULDER_RESTITUTION;

const shoulderFriction = devPhysicalReleaseEnabled
  ? DEV_DEFLECTOR_SHOULDER_FRICTION
  : TABLE_DEFLECTOR_SHOULDER_FRICTION;

return (
    <>
      <group
        position={[0, deflectorY, deflectorZ]}
rotation={[deflectorRotation, 0, 0]}
      >
        <mesh receiveShadow castShadow rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.072, 0.072, table.floorWidth - 0.28, 32]} />
          <meshStandardMaterial {...TABLE_MATERIALS.goldAccent} />
        </mesh>
      </group>

<CuboidCollider
  args={[1.675, 0.04, 0.095]}
position={[0, deflectorY + 0.03, deflectorZ]}
rotation={[deflectorRotation, 0, 0]}
restitution={deflectorRestitution}
friction={deflectorFriction}
/>

{/* subtle upper contact shoulder: helps dice visibly catch/graze the bar instead of gliding past it */}
<CuboidCollider
  args={[1.58, 0.032, 0.075]}
position={[0, deflectorY + 0.16, deflectorZ - 0.045]}
rotation={[deflectorRotation + 0.2, 0, 0]}
restitution={shoulderRestitution}
friction={shoulderFriction}
/>
    </>
  );
}

function FrontLipLacquerDepth({ table }: { table: TableMeasurements }) {
  return (
    <>
      {/* visual-only lacquer sheen on front lip; no collider */}
      <mesh
        position={[0, table.frontBorderY + 0.08, table.frontEdgeZ + 0.205]}
        receiveShadow
      >
        <boxGeometry args={[table.floorWidth - 0.28, 0.06, 0.035]} />
        <meshStandardMaterial {...TABLE_MATERIALS.frontLipLacquerSheen} />
      </mesh>

            {/* visual-only heavy front lacquer depth; no collider */}
      <mesh
        position={[0, table.frontBorderY - 0.08, table.frontEdgeZ + 0.23]}
        receiveShadow
      >
        <boxGeometry args={[table.floorWidth - 0.36, 0.13, 0.032]} />
        <meshStandardMaterial
          color="#070101"
          roughness={0.82}
          metalness={0.04}
          transparent
          opacity={0.32}
          depthWrite={false}
        />
      </mesh>

      {/* visual-only lower shadow for heavier furniture feeling; no collider */}
      <mesh
        position={[0, table.frontBorderY - 0.31, table.frontEdgeZ + 0.225]}
        receiveShadow
      >
        <boxGeometry args={[table.floorWidth - 0.18, 0.08, 0.04]} />
        <meshStandardMaterial {...TABLE_MATERIALS.frontLipBottomShadow} />
      </mesh>
    </>
  );
}

function FrontLipKanoteStrip({ table }: { table: TableMeasurements }) {
  const ornamentCount = 13;
  const spacing = (table.floorWidth - 0.9) / (ornamentCount - 1);
  const startX = -((ornamentCount - 1) * spacing) / 2;

  return (
    <group position={[0, table.frontBorderY + 0.015, table.frontEdgeZ + 0.255]}>
      {/* visual-only shadow base for carved/embossed feeling; no collider */}
      <mesh position={[0, -0.01, -0.004]} receiveShadow>
        <boxGeometry args={[table.floorWidth - 0.62, 0.035, 0.012]} />
        <meshStandardMaterial
          {...TABLE_MATERIALS.kanoteSoftShadow}
          depthWrite={false}
        />
      </mesh>

      {Array.from({ length: ornamentCount }).map((_, index) => {
        const x = startX + index * spacing;

        return (
          <group key={`front-kanote-motif-${index}`} position={[x, 0, 0]}>
            {/* simple first-pass diamond motif inspired by carved Kanote trim */}
            <mesh rotation={[0, 0, Math.PI / 4]} receiveShadow>
              <boxGeometry args={[0.105, 0.105, 0.018]} />
              <meshStandardMaterial {...TABLE_MATERIALS.kanoteGold} />
            </mesh>

            {/* small lower accent keeps motif from feeling like plain dots */}
            <mesh position={[0, -0.082, 0.002]} receiveShadow>
              <boxGeometry args={[0.18, 0.018, 0.016]} />
              <meshStandardMaterial {...TABLE_MATERIALS.kanoteGold} />
            </mesh>
          </group>
        );
      })}

      {Array.from({ length: ornamentCount - 1 }).map((_, index) => {
        const x = startX + spacing / 2 + index * spacing;

        return (
          <mesh
            key={`front-kanote-connector-${index}`}
            position={[x, 0, -0.001]}
            receiveShadow
          >
            <boxGeometry args={[spacing * 0.42, 0.018, 0.014]} />
            <meshStandardMaterial {...TABLE_MATERIALS.kanoteGold} />
          </mesh>
        );
      })}
    </group>
  );
}

function FrontLip({ table }: { table: TableMeasurements }) {
  return (
    <>
<RoundedBox
  position={[0, table.frontBorderY - 0.1, table.frontEdgeZ + 0.08]}
  args={[table.floorWidth, TABLE_FRONT_VISUAL_LIP_HEIGHT, 0.3]}
  radius={0.035}
  smoothness={8}
  receiveShadow
  castShadow
>
  <meshStandardMaterial {...TABLE_MATERIALS.darkBorder} />
</RoundedBox>

<RoundedBox
  position={[0, table.frontBorderY + 0.16, table.frontEdgeZ - 0.08]}
  args={[table.floorWidth - 0.42, 0.07, 0.095]}
  radius={0.028}
  smoothness={8}
  receiveShadow
  castShadow
>
  <meshStandardMaterial {...TABLE_MATERIALS.goldTrim} />
</RoundedBox>

<FrontLipLacquerDepth table={table} />
<FrontLipKanoteStrip table={table} />

            {/* invisible angled rebound face: kicks dice back into the tray */}
<CuboidCollider
  args={[table.halfWidth - 0.08, 0.07, 0.16]}
  position={[0, table.frontBorderY + 0.19, table.frontEdgeZ - 0.08]}
  rotation={[-0.11, 0, 0]}
  restitution={TABLE_FRONT_REBOUND_RESTITUTION}
  friction={TABLE_FRONT_REBOUND_FRICTION}
/>

      {/* invisible keeper wall: prevents escape without being the first hard stop */}
      <CuboidCollider
        args={[table.halfWidth, TABLE_FRONT_COLLIDER_HEIGHT, 0.11]}
        position={[0, table.frontBorderY + 0.02, table.frontEdgeZ + 0.1]}
        restitution={TABLE_FRONT_KEEPER_RESTITUTION}
        friction={TABLE_FRONT_KEEPER_FRICTION}
      />
    </>
  );
}

function TraySideRailKanoteTrim({ table }: { table: TableMeasurements }) {
  const motifCount = 9;
  const trimDepth = table.floorDepth - 1.35;
  const spacing = trimDepth / (motifCount - 1);
  const startZ = table.floorZ - trimDepth / 2;

  return (
    <>
      {[-1, 1].map((side) => {
        const x = side < 0 ? -table.halfWidth - 0.165 : table.halfWidth + 0.165;
        const motifRotationZ = side < 0 ? Math.PI / 4 : -Math.PI / 4;

        return (
          <group
            key={`side-rail-kanote-${side}`}
            rotation={[table.slopeAngle, 0, 0]}
          >
            {/* visual-only outer Kanote trim line; no collider */}
            <mesh
              position={[x, table.sideRailY + 0.53, table.floorZ]}
              receiveShadow
            >
              <boxGeometry args={[0.025, 0.035, trimDepth + 0.18]} />
              <meshStandardMaterial {...TABLE_MATERIALS.kanoteSoftShadow} />
            </mesh>

            {Array.from({ length: motifCount }).map((_, index) => {
              const z = startZ + index * spacing;

              return (
                <group
                  key={`side-rail-kanote-motif-${side}-${index}`}
                  position={[x, table.sideRailY + 0.58, z]}
                >
                  <mesh rotation={[0, 0, motifRotationZ]} receiveShadow>
                    <boxGeometry args={[0.072, 0.072, 0.014]} />
                    <meshStandardMaterial {...TABLE_MATERIALS.kanoteGold} />
                  </mesh>

                  <mesh
                    position={[0, -0.06, 0]}
                    rotation={[0, 0, motifRotationZ]}
                    receiveShadow
                  >
                    <boxGeometry args={[0.048, 0.048, 0.012]} />
                    <meshStandardMaterial {...TABLE_MATERIALS.kanoteGold} />
                  </mesh>
                </group>
              );
            })}
          </group>
        );
      })}
    </>
  );
}

function TrayRailLacquerDepth({ table }: { table: TableMeasurements }) {
  return (
    <>
      {/* visual-only left rail inner lacquer sheen; no collider */}
      <mesh
        position={[-table.halfWidth + 0.08, table.sideRailY + 0.44, table.floorZ]}
        rotation={[table.slopeAngle, 0, 0]}
        receiveShadow
      >
        <boxGeometry args={[0.045, 0.18, table.floorDepth - 0.72]} />
        <meshStandardMaterial {...TABLE_MATERIALS.railLacquerSheen} />
      </mesh>

      {/* visual-only left outer shadow; no collider */}
      <mesh
        position={[-table.halfWidth - 0.13, table.sideRailY + 0.16, table.floorZ]}
        rotation={[table.slopeAngle, 0, 0]}
        receiveShadow
      >
        <boxGeometry args={[0.04, 0.72, table.floorDepth - 0.48]} />
        <meshStandardMaterial {...TABLE_MATERIALS.railOuterShadow} />
      </mesh>

      {/* visual-only right rail inner lacquer sheen; no collider */}
      <mesh
        position={[table.halfWidth - 0.08, table.sideRailY + 0.44, table.floorZ]}
        rotation={[table.slopeAngle, 0, 0]}
        receiveShadow
      >
        <boxGeometry args={[0.045, 0.18, table.floorDepth - 0.72]} />
        <meshStandardMaterial {...TABLE_MATERIALS.railLacquerSheen} />
      </mesh>

      {/* visual-only right outer shadow; no collider */}
      <mesh
        position={[table.halfWidth + 0.13, table.sideRailY + 0.16, table.floorZ]}
        rotation={[table.slopeAngle, 0, 0]}
        receiveShadow
      >
        <boxGeometry args={[0.04, 0.72, table.floorDepth - 0.48]} />
        <meshStandardMaterial {...TABLE_MATERIALS.railOuterShadow} />
      </mesh>
    </>
  );
}

function TraySideRails({ table }: { table: TableMeasurements }) {
  return (
    <>
      {/* left side rail */}
      <RoundedBox
        position={[-table.halfWidth, table.sideRailY, table.floorZ]}
        rotation={[table.slopeAngle, 0, 0]}
        args={[0.28, 1.32, table.floorDepth]}
        radius={0.035}
        smoothness={8}
        receiveShadow
        castShadow
      >
        <meshStandardMaterial {...TABLE_MATERIALS.darkBorder} />
      </RoundedBox>

      <RoundedBox
        position={[-table.halfWidth + 0.16, table.sideRailY + 0.72, table.floorZ]}
        rotation={[table.slopeAngle, 0, 0]}
        args={[0.07, 0.07, table.floorDepth - 0.46]}
        radius={0.026}
        smoothness={8}
        receiveShadow
        castShadow
      >
        <meshStandardMaterial {...TABLE_MATERIALS.sideGoldRail} />
      </RoundedBox>

<CuboidCollider
  args={[0.13, 1.08, table.halfDepth]}
  position={[-table.halfWidth, table.sideRailY + 0.1, table.floorZ]}
  rotation={[table.slopeAngle, 0, 0]}
restitution={TABLE_SIDE_RAIL_RESTITUTION}
friction={TABLE_SIDE_RAIL_FRICTION}
/>

      {/* right side rail */}
      <RoundedBox
        position={[table.halfWidth, table.sideRailY, table.floorZ]}
        rotation={[table.slopeAngle, 0, 0]}
        args={[0.28, 1.32, table.floorDepth]}
        radius={0.035}
        smoothness={8}
        receiveShadow
        castShadow
      >
        <meshStandardMaterial {...TABLE_MATERIALS.darkBorder} />
      </RoundedBox>

      <RoundedBox
        position={[table.halfWidth - 0.16, table.sideRailY + 0.72, table.floorZ]}
        rotation={[table.slopeAngle, 0, 0]}
        args={[0.07, 0.07, table.floorDepth - 0.46]}
        radius={0.026}
        smoothness={8}
        receiveShadow
        castShadow
      >
        <meshStandardMaterial {...TABLE_MATERIALS.sideGoldRail} />
      </RoundedBox>

<CuboidCollider
  args={[0.13, 1.08, table.halfDepth]}
  position={[table.halfWidth, table.sideRailY + 0.1, table.floorZ]}
  rotation={[table.slopeAngle, 0, 0]}
restitution={TABLE_SIDE_RAIL_RESTITUTION}
friction={TABLE_SIDE_RAIL_FRICTION}
/>

      <TrayRailLacquerDepth table={table} />
      <TraySideRailKanoteTrim table={table} />
    </>
  );
}

function TableSafetyGuards({ table }: { table: TableMeasurements }) {
  return (
    <>
            {/* emergency escape guard only; main bounce should happen on FrontLip */}
<CuboidCollider
  args={[table.halfWidth, 0.92, 0.07]}
  position={[0, 0.08, table.frontEdgeZ + 0.34]}
restitution={TABLE_SAFETY_FRONT_RESTITUTION}
friction={TABLE_SAFETY_FRONT_FRICTION}
/>

<CuboidCollider
  args={[0.11, 1.16, table.halfDepth]}
  position={[-table.halfWidth - 0.04, 0.08, table.floorZ]}
restitution={TABLE_SAFETY_SIDE_RESTITUTION}
friction={TABLE_SAFETY_SIDE_FRICTION}
/>

<CuboidCollider
  args={[0.11, 1.16, table.halfDepth]}
  position={[table.halfWidth + 0.04, 0.08, table.floorZ]}
restitution={TABLE_SAFETY_SIDE_RESTITUTION}
friction={TABLE_SAFETY_SIDE_FRICTION}
/>
    </>
  );
}

export function TrayBox({
  testMode,
  activeDieIndex,
  sequenceRunning,
  displayOnly,
  diceShapePreset,
  mountedDiceRackMode,
  showDice = true,
  forceShowStumbleBar = false,
devPhysicalReleaseEnabled = false,
}: {
  testMode: TestMode;
  activeDieIndex: number;
  sequenceRunning: boolean;
  displayOnly: boolean;
  diceShapePreset: DiceShapePreset;
  mountedDiceRackMode: MountedDiceRackMode;
  showDice?: boolean;
  forceShowStumbleBar?: boolean;
devPhysicalReleaseEnabled?: boolean;
}) {
  const table = createTableMeasurements();

return (
  <>
    <RigidBody type="fixed" colliders={false}>
<TableRunway
  table={table}
  devPhysicalReleaseEnabled={devPhysicalReleaseEnabled}
/>
<TableBackboard table={table} />

<TrapdoorFlaps
        table={table}
        activeDieIndex={activeDieIndex}
        sequenceRunning={sequenceRunning}
        displayOnly={displayOnly}
        devPhysicalReleaseEnabled={devPhysicalReleaseEnabled}
      />
{showDice ? (
  <WaitingDiceRack
    table={table}
    activeDieIndex={activeDieIndex}
    sequenceRunning={sequenceRunning}
    diceShapePreset={diceShapePreset}
    mountedDiceRackMode={mountedDiceRackMode}
    devPhysicalReleaseEnabled={devPhysicalReleaseEnabled}
  />
) : null}
<StumbleBar
  table={table}
  testMode={testMode}
  forceVisible={forceShowStumbleBar}
  devPhysicalReleaseEnabled={devPhysicalReleaseEnabled}
/>
      <FrontLip table={table} />
      <TraySideRails table={table} />
      <TableSafetyGuards table={table} />
    </RigidBody>
  </>
);
}