# Nagani Traditional — Production 3D Dice Model / Material Plan

## Purpose

This document defines the future production path for the 3D dice used in the ၆ ကောင်ဂျင် / ဂလုန်းဂလုန်း simulation room.

The current dice system is working well enough for MVP:

* 3D dice physics works.
* Dice drops and rolls in the table.
* Top-face result detection works.
* Animal texture faces are mapped correctly.
* Dice visual constants are locked in code.
* Current dice is acceptable as a development/MVP dice.

The next production goal is to make the dice feel like real physical traditional dice, not a developer cube with image overlays.

---

## Current MVP Dice Method

Current implementation:

* RoundedBox dice body
* Transparent PNG animal marks placed on each dice face
* Result detection based on dice orientation axes
* Frontend dice animation still controls visual movement
* Result payload can later be controlled by backend

Current MVP file:

```txt
src/components/games/six-animal/ThreeDicePhysicsStage.tsx
```

Current accepted visual constants:

```ts
DICE_SIZE = 1.16
DICE_CORNER_RADIUS = 0.28
DICE_SMOOTHNESS = 16
DICE_FACE_SURFACE_OFFSET = 0.588
DICE_FACE_PRINT_SIZE = 0.6
```

This is good enough for continued frontend development.

---

## Final Production Dice Goal

The final dice should feel like:

* real physical rounded dice
* warm ivory / aged gold body
* animal marks printed, painted, or engraved into the dice surface
* no floating sticker feeling
* no emoji/cartoon style
* readable on mobile
* believable while rolling and after landing

The final animal face should look like it belongs to the dice material itself.

---

## Preferred Final Method

Use a custom 3D dice model instead of only `RoundedBox`.

Preferred asset type:

```txt
GLB / GLTF dice model
```

The model should include:

* correct rounded dice shape
* UV-mapped six faces
* animal face texture baked into the dice material
* ivory/gold body material
* roughness map
* optional normal/bump map
* subtle edge wear
* subtle dirt/aging
* no separate floating PNG planes

---

## Locked Six Animal Faces

1. Tiger / ကျား
2. Dragon / နဂါး
3. Rooster / ကြက်
4. Fish / ငါး
5. Crab / ဂဏန်း
6. Elephant / ဆင်

Do not use Gourd / ဘူး.

---

## Face Mapping Must Match Detection

The current result detection uses this axis mapping:

```txt
+Y = Tiger
-Y = Dragon
+X = Rooster
-X = Fish
+Z = Crab
-Z = Elephant
```

Any future GLB dice model must preserve this mapping, or the detection adapter must be updated carefully.

The visible top face and detected result must always match.

---

## Production Asset Folder Plan

Future dice model:

```txt
public/assets/nagani/six-animal/dice-models/six-animal-dice-v1.glb
```

Future dice texture files if separated:

```txt
public/assets/nagani/six-animal/dice-models/textures/
```

Possible texture names:

```txt
six-animal-dice-body-basecolor-v1.png
six-animal-dice-body-roughness-v1.png
six-animal-dice-body-normal-v1.png
six-animal-dice-faces-basecolor-v1.png
```

---

## Development Rule

Do not replace the current working dice system immediately.

Correct future process:

1. Keep current MVP dice working.
2. Build isolated production dice model test.
3. Confirm animal face orientation.
4. Confirm result detection still matches visible face.
5. Confirm physics collider still behaves correctly.
6. Only then replace the MVP dice in `/six-animal`.

---

## Backend Relationship

In production, backend should control the official round result.

Correct flow:

```txt
Backend result: [Crab, Dragon, Fish]
Frontend dice animation: rolls and reveals Crab, Dragon, Fish
Settlement/history: uses backend result only
```

The frontend dice is a visual simulation. The backend is the source of truth.

Demo mode may allow forced results for testing and showcase. Production mode should use fair locked result generation.

---

## Current Status

Current MVP dice visual is accepted enough.

Next future dice step is not urgent. Before full GLB production, continue the roadmap with live room backend architecture planning and final frontend polish.
