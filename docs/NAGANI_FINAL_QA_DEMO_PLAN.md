# Nagani Final QA / Demo Polish Plan

Status: Draft v0.1
Project: Nagani Traditional
Primary Room: ၆ ကောင်ဂျင် / ဂလုန်းဂလုန်း

## 1. Purpose

This document defines the final mobile QA and demo polish checklist for the current `/six-animal` room.

The goal is to protect the accepted prototype before deeper production asset or backend work begins.

## 2. Current Accepted Baseline

Current `/six-animal` room baseline:

* mobile-first 3D room
* visible physical dice source of truth
* no backend forced result
* no production target correction
* no old sample table fallback
* muted room direction
* compact betting sheet
* active bet lock
* Bets Closed phase
* physical 3D dice rolling
* result board
* settlement layer
* next round reset
* warm room atmosphere
* build passing

## 3. Main QA Goal

The player should be able to complete a full room flow clearly:

1. enter room
2. see betting phase
3. select animal
4. place bet
5. wait for betting close
6. watch dice roll
7. see visible dice result
8. see result board
9. see settlement
10. next round resets cleanly

## 4. Mobile Portrait QA Checklist

Test on iPhone portrait size first.

Required:

* no horizontal scroll
* no broken vertical overflow
* header readable
* timer readable
* balance readable
* betting sheet readable
* animal cards touchable
* Place Bet button reachable
* dice table visible
* dice face readable
* result board readable
* settlement readable
* next round reset clean

## 5. Round Flow QA Checklist

Test one full round with a bet:

* room intro appears
* betting starts at 20s
* animal selection works
* amount input works
* quick amount buttons work
* Place Bet locks bet
* betting sheet disables after lock
* Bets Closed shows 3s
* dice rolling starts
* result board updates 1/3, 2/3, 3/3
* 2s reveal pause feels natural
* result phase appears
* settlement shows selected animal
* match count shows correctly
* Bet / Return / Net display correctly
* next round resets

## 6. No-Bet Round QA Checklist

Test one full round without placing a bet:

* betting phase runs normally
* betting closes normally
* dice rolling runs normally
* result board shows result
* no settlement card appears
* next round resets cleanly

## 7. Trust QA Checklist

The room must preserve trust:

* visible dice result matches result board
* result board does not appear before dice confirmation
* settlement matches result board
* no suspicious dice correction appears
* no backend-forced result is active
* no dev/lab UI appears
* no old sample table appears

## 8. Demo Readiness Checklist

The current demo is ready only when:

* full bet round passes
* no-bet round passes
* mobile portrait looks clean
* dice remains the focus
* betting sheet feels premium
* result/settlement is understandable
* muted room direction is consistent
* build passes
* no console errors appear during normal flow

## 9. What Not To Change During Final QA

Do not change during final QA unless a bug is found:

* dice physics
* table camera
* round timing
* betting rules
* settlement formula
* sound/audio strategy
* backend strategy
* production target correction lock
* room atmosphere baseline

Final QA protects the current stable room.

## 10. Final Demo Lock / Chapter 37 Closeout

The current `/six-animal` room is accepted as the stable demo baseline.

### 10.1 Passed QA

Final QA passed:

- full bet round QA
- no-bet round QA
- result / settlement edge QA
- small mobile portrait QA
- trust / visual source-of-truth QA
- build passing

### 10.2 Current Accepted Demo State

Accepted demo state:

- mobile-first 3D Six Animal room
- visible physical dice source of truth
- no old sample table
- no dev/lab UI
- no backend forced result
- no production target correction
- muted room direction
- betting sheet accepted
- Bets Closed phase accepted
- rolling/result board accepted
- settlement layer accepted
- room atmosphere accepted
- next round reset accepted

### 10.3 What Must Not Change Before Demo

Do not change before demo unless fixing a real bug:

- dice physics
- table camera
- result detection
- round timing
- betting sheet layout
- result board layout
- settlement math
- muted room direction
- backend strategy
- sound/audio strategy

### 10.4 Chapter 37 Lock Decision

Chapter 37 is complete enough.

Current decision:

Keep `/six-animal` stable as the accepted demo baseline before moving to the next major roadmap branch.

