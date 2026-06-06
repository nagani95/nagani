# Nagani Royal Six Animal Table — Blender / Artist Handoff

Status: Draft.

Purpose:

Create a premium custom royal Myanmar Six Animal dice table GLB that matches the existing working prototype table anatomy.

The current prototype table is the gameplay truth.

The final GLB is visual only.

Dice physics will use invisible colliders.

## Non-Negotiable Requirements

The artist must not invent a new table shape.

The final GLB must match the current tested prototype anatomy.

The table is not only decoration. Its shape supports the dice performance.

Required final feeling:

* Premium Myanmar royal palace furniture.
* Dark red / black lacquer wood.
* Gold Myanmar Kanote decoration.
* Serious traditional dice table.
* Not toy-like.
* Not casino slot style.
* Not cartoon.
* Not melted AI geometry.
* Mobile-readable dice area.

Technical rule:

The GLB is visual only.

Do not build physics colliders into the GLB.

The game will keep simple invisible colliders for dice physics.

Final file target:

`public/assets/nagani/six-animal/table-models/six-animal-royal-table-v1.glb`

## Prototype Anatomy Measurements

The final GLB must match these working prototype proportions.

Coordinate direction:

* Player/front side: positive Z.
* Backboard/dice holder side: negative Z.
* Dice travels from back to front.
* Table is long front-to-back.

Main table:

* Floor width: `4.45`
* Floor depth: `6.75`
* Half width: `2.225`
* Half depth: `3.375`
* Floor center Y: `-1.05`
* Floor center Z: `0.35`

Runway and tray:

* Back edge Z: `-3.025`
* Front edge Z: `3.725`
* Transition Z: `1.3`
* Upper runway depth: `4.325`
* Lower tray depth: `2.425`
* Upper runway slope: `0.3 rad`
* Lower settling tray slope: `0.12 rad`

Rear backboard:

* Position: `[0, 1.05, -3.145]`
* Size: `[4.57, 4.45, 0.26]`

Dice holder:

* Dice lane X positions: `[-1.0, 0, 1.0]`
* Trapdoor Z: `-2.325`
* Shelf position: `[0, 2.1, -2.425]`
* Shelf size: `[3.12, 0.12, 0.28]`
* Trapdoor flap size: `[0.72, 0.045, 0.54]`

Deflector bar:

* Position: `[0, 0.36, -2.365]`
* Rotation: `[0.12, 0, 0]`
* Size: `[3.35, 0.055, 0.15]`

Front stopper:

* Visual lip position: `[0, -1.461, 3.805]`
* Visual lip size: `[4.45, 0.46, 0.3]`

Side rails:

* Left rail position: `[-2.225, -0.97, 0.35]`
* Right rail position: `[2.225, -0.97, 0.35]`
* Rail rotation: `[0.3, 0, 0]`
* Rail size: `[0.28, 1.32, 6.75]`

Dice drop:

* Active dice X lanes: `[-1.0, 0, 1.0]`
* Trapdoor mode dice start: `[activeDieX, 2.9, -2.55]`

Camera safety:

* The front lip, side rails, and ornaments must not block dice top faces.
* The dice runway and tray must remain readable from mobile portrait camera.

## Artist Modeling Instructions

Build the table in this order:

1. Create the clean base table shape first.
2. Match the runway, tray, rails, front stopper, backboard, and dice gate positions.
3. Keep the dice runway open and clean.
4. Add royal lacquer material after the shape is correct.
5. Add gold Kanote decoration only after the table anatomy is correct.

Decoration placement:

* Kanote decoration is allowed on the outer body.
* Kanote decoration is allowed on the front panel.
* Kanote decoration is allowed on the side rails.
* Kanote decoration is allowed on the backboard.
* Kanote decoration is allowed around the dice holder.

Decoration is not allowed inside the dice rolling path.

Do not place ornaments where dice should roll, bounce, or stop.

The runway and tray must stay clean.

Material direction:

* Dark red lacquer wood.
* Black / maroon shadow depth.
* Gold Kanote trim.
* Brass / gold rail accents.
* Clean red runway surface.
* Slight polished royal furniture shine.

Avoid:

* Toy shape.
* Plastic look.
* Cartoon carving.
* Casino machine style.
* Melted AI geometry.
* Noisy fake ornament.
* Heavy messy mesh.
* Dice included in the table model.
* Room wall included in the table model.

Export requirements:

* Export as `.glb`.
* Table only.
* No dice.
* No room.
* No physics collider.
* Embedded or safe textures.
* Center origin near the middle of the table.
* Front/player side faces positive Z.
* Mobile optimized.
* Clean geometry.
* Reasonable polygon count.

## Final Acceptance Checklist

The table model is accepted only if all items pass:

* Matches the current prototype table anatomy.
* Long runway is correct.
* Lower tray depth is correct.
* Side rails do not hide dice.
* Front stopper does not block dice view.
* Deflector bar is small and correctly placed.
* Rear three-dice gate is clear.
* Dice rolling path is clean.
* Kanote decoration stays outside the dice path.
* Table feels premium Myanmar royal palace style.
* Not toy-like.
* Not casino style.
* Not cartoon.
* Not melted AI geometry.
* Mobile camera can still see dice top faces.
* GLB is table only.
* GLB has no dice.
* GLB has no room wall.
* GLB has no physics colliders.
* GLB is optimized for mobile.

## Handoff Lock

Status: Ready for artist / Blender modeling.

This document is now the clean artist handoff for the custom Nagani royal Six Animal table.

The artist must follow this document instead of inventing a new table.

The final GLB target remains:

`public/assets/nagani/six-animal/table-models/six-animal-royal-table-v1.glb`

After the real GLB exists, continue with:

Chapter 78.9 — Dev Lab GLB + Invisible Collider Separation.
