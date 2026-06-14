# Nagani Traditional — Chapter 91.7 Final Player Surface Smoke / Copy Freeze Lock

Status: PASS / LOCKED

## Chapter

91.7 — Final Player Surface Smoke / Copy Freeze

## Goal

Complete a final safe player-facing copy and surface pass after the Six Animal MVP production baseline was locked.

This chapter focused only on visible player pages, wording consistency, navigation clarity, and removal of confusing or unfinished surface text.

No dice, backend, wallet approval logic, settlement logic, Supabase functions, production assets, or sound implementation were reopened.

## Protected Rule

The following systems were not changed:

* Dice physics
* Shadow worker tuning
* Recorded replay behavior
* Dice holder / trapdoor
* Dice trajectory system
* Backend result logic
* Wallet approval logic
* Wallet transaction logic
* Settlement logic
* Supabase functions
* Sound implementation
* Production assets

## Completed Sections

### 91.7-A — Lobby Page / Player Entry

Status: PASS / LOCKED

Completed:

* Removed anonymous-session wording
* Cleaned logged-out Six Animal entry state
* Replaced confusing deposit message for logged-out users with login/register requirement
* Simplified Thirty Six copy to Coming Soon
* Replaced “Wallet Connected” with “Signed In”
* Added safe wallet balance parsing

### 91.7-B — Lobby Hero

Status: PASS / LOCKED

Completed:

* Removed Thirty Six from live hero emphasis
* Removed “follow live results” wording after Live page removal
* Removed “choose your traditional table” wording
* Focused hero on Six Animal MVP room

### 91.7-C — Lobby Game Cards

Status: PASS / LOCKED

Completed:

* Replaced “Choose Table” with “Game Room”
* Kept Home lobby game cards clear
* Kept locked game handling safe
* No player-facing History or Live links

### 91.7-D — Lobby Recent Activity

Status: PASS / LOCKED

Completed:

* Removed History reference
* Replaced table wording with room wording
* Clarified player can use Cashier and Profile from the lobby
* Kept Six Animal MVP status clear

### 91.7-E — Bottom Navigation

Status: PASS / LOCKED

Completed:

* Confirmed BottomNav shows only Home / Cashier / Profile
* Confirmed History removed
* Confirmed Live removed
* Confirmed no unsafe navigation remains

### 91.7-F — AppShell

Status: PASS / LOCKED

Completed:

* Confirmed player shell is clean
* Confirmed safe bottom padding for mobile nav
* Confirmed no fake/dev player text
* Confirmed no admin shell leakage

### 91.7-G — Cashier Page

Status: PASS / LOCKED

Completed:

* Replaced Confirmed status with Approved
* Replaced Withdraw wording with Withdrawal where player-facing
* Removed dev comment
* Added safe amount parsing
* Kept wallet request logic unchanged

### 91.7-H — Cashier Components

Status: PASS / LOCKED

Completed:

* Cleaned CashierHero copy
* Cleaned CashierNote copy
* Cleaned CashierRecentTickets copy
* Cleaned CashierRequestForm copy
* Removed confusing wallet “settlement” wording
* Standardized wallet request wording
* Kept submit wallet request action unchanged

### 91.7-I — Profile Components

Status: PASS / LOCKED

Completed:

* Added safe wallet balance parsing on profile page
* Replaced static “Active” member badge with “Signed In”
* Confirmed profile quick actions are clean
* Confirmed History and Live are not linked
* Cleaned withdrawal wording
* Cleaned support text for player-facing use

### 91.7-J — Login / Register

Status: PASS / LOCKED

Completed:

* Removed nested main tags inside AppShell
* Cleaned login copy
* Cleaned register copy
* Kept player auth actions unchanged
* Build passed

### 91.7-K — Thirty Six Player Placeholder

Status: PASS / LOCKED

Completed:

* Removed fake Thirty Six ticket preparation
* Removed fake number selection
* Removed fake ticket confirmation
* Changed player status from Open to Coming Soon
* Clarified Thirty Six is not live in current MVP
* Added safe link back to Six Animal

## Final Player Surface

Current player routes checked:

* `/`
* `/cashier`
* `/profile`
* `/login`
* `/register`
* `/thirty-six`
* Bottom navigation
* Player AppShell

Current player navigation:

* Home
* Cashier
* Profile

Current player MVP game:

* Six Animal

Removed or avoided:

* History navigation
* Live navigation
* Fake stats
* Fake Thirty Six tickets
* Fake draw data
* Frontend preview wording
* Backend placeholder wording
* Confusing settlement wording on wallet pages
* Misleading Thirty Six “Open” status
* Nested main tags inside AppShell pages

## Build Status

`npm run build` passed after each patch.

## Final Status

Chapter 91.7 — Final Player Surface Smoke / Copy Freeze is complete.

Status: PASS / LOCKED

The Six Animal MVP production baseline remains protected.
