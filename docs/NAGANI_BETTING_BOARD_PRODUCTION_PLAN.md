# Nagani Betting Board / Animal Panel Production Plan

Status: Draft v0.1
Project: Nagani Traditional
Primary Room: ၆ ကောင်ဂျင် / ဂလုန်းဂလုန်း

## 1. Purpose

The betting board and animal panel must make animal selection feel clear, premium, and trustworthy.

The board must support:

* fast animal recognition
* mobile-first betting
* clear selected state
* clear locked bet state
* strong relationship between selected animal and dice result
* no confusion during betting, rolling, and settlement

The betting board must not feel like a slot grid, cheap button board, or emoji game panel.

## 2. Current Status

Current `/six-animal` betting sheet is accepted as a stable prototype baseline.

Current accepted state:

* compact betting sheet
* 2×3 animal board
* selected animal highlight
* amount input
* quick amount buttons
* bet slip
* Place Bet button
* active bet lock
* mobile portrait layout passed
* full room flow QA passed

## 3. Final Animal Board Direction

Final animal board should feel like a premium traditional betting mat/panel.

Target feeling:

* physical traditional board
* dark lacquer surface
* warm gold borders
* readable animal art
* strong selected state
* calm premium UI
* no cartoon casino style
* no emoji final assets

## 4. Animal Asset Requirements

Final animal assets must be production quality.

Six locked animals:

1. Tiger
2. Dragon
3. Rooster
4. Fish
5. Crab
6. Elephant

Requirements:

* premium Myanmar traditional art direction
* strong silhouette
* readable at mobile size
* consistent lighting
* consistent visual weight
* no emoji style
* no cheap cartoon style
* no slot-symbol style
* no overly detailed art that becomes unreadable on mobile

## 5. Board Readability Requirements

The board must work first on iPhone portrait.

Rules:

* all six animals visible without confusion
* animal name readable
* selected animal obvious
* locked animal obvious
* disabled state after bet lock obvious
* touch targets remain safe
* board must not cover dice table in non-betting phases

## 6. Selected / Locked State Requirements

Selected state:

* clear gold highlight
* animal card feels chosen
* amount panel updates clearly
* Place Bet button becomes active only when valid

Locked state:

* selected animal cannot be changed
* locked badge appears
* bet slip confirms round and amount
* player understands they are waiting for dice result

## 7. Result Relationship Requirement

The betting panel and result system must feel connected.

During result:

* result board should show dice animals
* settlement should show player’s chosen animal
* match count should be clear
* net result should be clear
* selected animal should visually relate to matched dice result

The player should understand why they won or lost without reading long text.

## 8. What Must Not Be Broken

Future betting board polish must not break:

* dice table focus
* visible dice source of truth
* betting 20s
* bet lock behavior
* active bet state
* settlement math
* result board matching dice
* mobile portrait layout
* muted room direction
* build stability

## 9. Future Acceptance Checklist

Betting board production polish is accepted only when:

* all animals are readable
* selected state is obvious
* locked state is obvious
* Place Bet action feels strong
* result relationship is easy to understand
* betting phase is clean on mobile
* rolling/result phases keep table focus
* full room flow QA passes
* build passes

## 10. Final Animal Asset Quality Requirements

The final Six Animal board depends heavily on animal asset quality. These assets must feel premium, traditional, and readable on mobile.

### 10.1 Locked Animal Set

The final ၆ ကောင်ဂျင် animal set is:

1. Tiger / ကျား
2. Dragon / နဂါး
3. Rooster / ကြက်
4. Fish / ငါး
5. Crab / ဂဏန်း
6. Elephant / ဆင်

Do not use Gourd / ဘူး unless the project direction changes later.

### 10.2 Visual Style Requirements

Each animal asset should follow:

- premium Myanmar traditional illustration style
- 2D or 2.5D quality
- strong silhouette
- rich warm lighting
- gold/red/lacquer compatibility
- clear face/body identity
- consistent scale across all six animals
- consistent shadow and glow direction

### 10.3 Mobile Readability Requirements

Each animal must be readable at small size.

Rules:

- recognizable inside a 46px–64px card image area
- strong outline or silhouette
- not too thin
- not too dark against black/red background
- not too detailed that it becomes muddy
- no tiny important details that disappear on mobile

### 10.4 What To Avoid

Do not use:

- emoji animals
- cheap cartoon mascot style
- slot-symbol style
- flat low-quality icons
- overly realistic photo cutouts
- inconsistent art styles
- mixed lighting directions
- animals that look copied from different games

### 10.5 Asset File Direction

Future production animal assets should follow this naming pattern:

- `six-animal-tiger-production-01.png`
- `six-animal-dragon-production-01.png`
- `six-animal-rooster-production-01.png`
- `six-animal-fish-production-01.png`
- `six-animal-crab-production-01.png`
- `six-animal-elephant-production-01.png`



## 11. Betting Interaction / Selected & Locked State Requirements

The betting board must make each player action clear. A player should always understand whether they are choosing, ready to bet, locked, waiting, or seeing result.

### 11.1 Betting Open State

During betting open:

- all six animal cards are selectable
- selected animal is clearly highlighted
- amount input is editable
- quick amount buttons are usable
- Place Bet button is disabled until animal and valid amount are selected
- timer remains visible
- table remains visible behind the sheet

### 11.2 Selected Animal State

When an animal is selected:

- selected card should feel stronger than others
- gold highlight should be obvious
- selected animal name should appear in the amount/selected panel
- bet slip should update immediately
- Place Bet button should become active if amount is valid

### 11.3 Invalid Bet State

Invalid bet state must be clear but not noisy.

Invalid examples:

- no animal selected
- amount below minimum
- amount above maximum
- empty amount
- non-numeric amount

Rules:

- Place Bet button stays disabled
- helper text can explain the problem
- do not use aggressive error color unless necessary
- layout must not jump

### 11.4 Locked Bet State

After Place Bet:

- animal cannot be changed
- amount cannot be changed
- quick amount buttons disabled
- bet slip shows locked state
- locked badge appears
- player sees round number
- player understands they are waiting for dice result

### 11.5 Betting Closed State

When betting closes:

- betting sheet disappears
- table stays same size
- small Bets Closed overlay appears
- no more animal/amount edits
- dice table remains the focus

### 11.6 Rolling State

During rolling:

- betting board must not cover dice
- result board shows dice progress
- active bet is not editable
- player waits for visible dice result

### 11.7 Result State

During result:

- result board shows three dice animals
- matched animals are highlighted
- settlement shows chosen animal, match count, bet, return, and net result
- player can understand win/loss without long text

### 11.8 Interaction Acceptance Checklist

Betting interaction is accepted only when:

- selected state is obvious
- locked state is obvious
- invalid state is understandable
- no action feels broken
- betting sheet does not hide dice after betting closes
- result relationship is clear
- full room flow QA passes
- build passes

## 12. Result Relationship / Match Feedback Requirements

The player must immediately understand how their chosen animal connects to the visible dice result.

### 12.1 Result Relationship Goal

During result phase, the UI must answer three questions quickly:

1. What animals landed on the dice?
2. What animal did I bet on?
3. Did my animal match, and how many times?

The player should not need to read long text to understand win or loss.

### 12.2 Matched Result State

When the player wins:

- matched dice animals should be highlighted
- settlement should show “You Win”
- match count should be clear
- return and net should be easy to read
- chosen animal should visually connect to the matched result

### 12.3 No-Match Result State

When the player loses:

- result board still shows all dice animals clearly
- settlement should show “No Match”
- chosen animal should remain visible
- net loss should be clear
- UI should not feel aggressive or confusing

### 12.4 Result Board Rules

The result board must:

- mirror visible dice only
- never show result before visible dice confirms it
- show 1/3, 2/3, 3/3 progress during rolling
- show final animals during result
- highlight matched animals only after result is confirmed

### 12.5 Settlement Rules

Settlement must show:

- selected animal
- match count
- bet amount
- return amount
- net result

Settlement must not hide the visible dice result too much.

### 12.6 Acceptance Checklist

Result relationship polish is accepted only when:

- win reason is clear
- loss reason is clear
- matched animals are easy to notice
- chosen animal remains visible
- result board matches visible dice
- settlement math remains correct
- full room flow QA passes
- build passes

## 13. Betting Board Implementation Phases

Betting board upgrades must be added carefully. The current betting sheet is stable, so future polish should happen step by step.

### 13.1 Integration Rule

Do not redesign the whole betting sheet at once.

Every betting board upgrade must preserve:

* mobile portrait readability
* animal selection clarity
* active bet lock behavior
* amount input behavior
* quick amount behavior
* Place Bet validation
* result relationship clarity
* dice table focus
* full room flow stability

### 13.2 Phase 1 — Animal Asset Replacement

First upgrade should be final animal image quality.

Scope:

* replace sample animal assets with production animal assets
* keep current 2×3 layout
* keep current selected/locked state
* keep current betting logic

Acceptance:

* all six animals are readable
* style is consistent
* no emoji/slot-symbol feeling
* build passes

### 13.3 Phase 2 — Animal Card Visual Polish

After assets are stable, improve animal card presentation.

Scope:

* better card border
* better selected glow
* better locked badge
* better disabled state
* better image scale

Acceptance:

* selected animal is obvious
* locked state is obvious
* layout does not crowd mobile screen
* table behind still feels alive

### 13.4 Phase 3 — Amount / Bet Slip Polish

After animal cards are stable, improve betting controls.

Scope:

* amount input hierarchy
* quick amount button clarity
* selected animal panel
* bet slip text
* Place Bet button strength

Acceptance:

* player understands next action immediately
* no layout jump
* no confusing disabled state
* Place Bet feels trustworthy

### 13.5 Phase 4 — Result Relationship Polish

After betting sheet is stable, improve result connection.

Scope:

* matched animal highlight
* chosen animal display
* settlement relationship
* win/no-match clarity

Acceptance:

* player knows why they won or lost
* selected animal connects visually to result
* result board still mirrors visible dice

### 13.6 Final QA Lock

Final betting board polish is accepted only after:

* betting with selected animal passes
* invalid bet state passes
* locked bet state passes
* betting closed phase passes
* rolling phase passes
* result/settlement phase passes
* next round reset passes
* mobile portrait QA passes
* build passes

### 13.7 What Must Stay Untouched During Betting Board Work

Do not change these during betting board visual polish:

* dice physics
* result detection
* round timing
* backend strategy
* settlement formula
* sound/audio strategy
* table camera
* visible dice source of truth

Betting board polish must support the stable room, not rebuild it.

## 14. Betting Board Plan Lock / Current Board Freeze

The current `/six-animal` betting sheet should be treated as the stable betting baseline.

### 14.1 Current Accepted Betting Baseline

Current accepted state:

* compact mobile betting sheet
* 2×3 animal selection board
* selected animal highlight
* active bet lock behavior
* amount input
* quick amount buttons
* bet slip
* Place Bet button
* result relationship plan
* settlement relationship plan
* full room flow QA passed

### 14.2 What Can Improve Later

Allowed future improvements:

* production animal assets
* better selected card glow
* better locked badge
* better disabled state
* refined betting mat/card design
* stronger win/no-match relationship polish
* better animal/result visual connection

### 14.3 What Must Not Be Broken

Future betting board work must not break:

* dice table focus
* visible dice source of truth
* betting 20s
* bet lock behavior
* active bet state
* result board matching visible dice
* settlement math
* mobile portrait layout
* muted room direction
* build stability

### 14.4 Chapter 35 Lock Decision

Chapter 35 is a planning chapter.

Do not redesign the betting sheet immediately.

Current decision:

Keep the current betting board stable and only improve it later through safe phased upgrades, starting with production animal assets when ready.
