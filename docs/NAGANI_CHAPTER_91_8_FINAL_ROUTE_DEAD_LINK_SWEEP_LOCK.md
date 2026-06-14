# Nagani Traditional — Chapter 91.8 Final Route / Dead Link Sweep Lock

Status: PASS / LOCKED

## Chapter

91.8 — Final Route / Dead Link Sweep

## Goal

Complete a safe final route and navigation sweep after the player surface and admin surface were cleaned.

This chapter checked only route links, redirects, navigation consistency, and direct URL protection.

No dice, backend result logic, wallet approval logic, settlement logic, Supabase functions, production assets, or sound implementation were reopened.

## Protected Rule

The following systems were not changed:

* Dice physics
* Shadow worker tuning
* Recorded dice replay
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

### 91.8-A — Middleware Route Guard

Status: PASS / LOCKED

Completed:

* Removed `/history` from protected player routes
* Removed `/history` from middleware matcher
* Kept `/profile` protected
* Kept `/cashier` protected
* Kept `/admin` matcher for admin pathname header support
* Build passed

### 91.8-B — Removed Player Routes Redirect

Status: PASS / LOCKED

Confirmed:

* `/history` redirects safely to `/`
* `/live` redirects safely to `/`

This keeps removed player routes from becoming dead pages.

### 91.8-C — Six Animal Direct Route Guard

Status: PASS / LOCKED

Completed:

* Added `/six-animal` to protected player routes
* Added `/six-animal/:path*` to middleware matcher
* Direct logged-out access to `/six-animal` now redirects to `/login?next=/six-animal`
* Dice page was not changed
* Build passed

### 91.8-D — Admin Home Route Links

Status: PASS / LOCKED

Checked links:

* `/`
* `/admin/users`
* `/admin/wallet-requests`
* `/admin/audit`
* `/admin/backend-health`
* `/admin/financial-integrity`
* `/admin/six-animal`
* `/admin/settings`

No dead link found.

### 91.8-E — Admin Layout Route Guard / Links

Status: PASS / LOCKED

Checked:

* `/admin/login` bypass remains correct
* Admin Login link points to `/admin/login`
* Open Lobby link points to `/`
* Server-side admin allowlist guard remains active
* No dead link found

### 91.8-F — Admin Login Route Links

Status: PASS / LOCKED

Checked:

* Back to Lobby points to `/`
* Player Login points to `/login`
* Admin login remains outside AppShell
* No player bottom nav leak
* No dead link found

### 91.8-G — Bottom Navigation

Status: PASS / LOCKED

Checked:

* Home points to `/`
* Cashier points to `/cashier`
* Profile points to `/profile`
* History is removed
* Live is removed
* Thirty Six is not shown in bottom nav
* No dead link found

### 91.8-H — AppShell Route Surface

Status: PASS / LOCKED

Checked:

* AppShell only renders page wrapper and BottomNav
* No admin leak found
* No dead link found

### 91.8-I — Lobby Game Cards

Status: PASS / LOCKED

Checked:

* Unlocked games render valid links
* Locked games render non-clickable cards
* No fake route exposed for locked games
* No History link
* No Live link
* No dead link found

### 91.8-J — Lobby Hero / Lobby Recent Activity

Status: PASS / LOCKED

Checked:

* LobbyHero has no route links
* LobbyRecentActivity has no route links
* No History text
* No Live link
* No fake route
* No dead link found

### 91.8-K — Profile Quick Actions

Status: PASS / LOCKED

Checked:

* Open Cashier points to `/cashier`
* Enter Six Animal points to `/six-animal`
* Back to Lobby points to `/`
* No History link
* No Live link
* No Thirty Six link
* No dead link found

### 91.8-L — Cashier Hero / Cashier Note

Status: PASS / LOCKED

Checked:

* CashierHero has no route links
* CashierNote has no route links
* No History text
* No Live text
* No fake route
* No dead link found

### 91.8-M — Cashier Recent Tickets / Cashier Request Form

Status: PASS / LOCKED

Checked:

* CashierRecentTickets has no route links
* CashierRequestForm has no route links
* Form action remains wallet request action
* No History link
* No Live link
* No fake route
* No dead link found

## Final Route Status

Current player navigation:

* `/`
* `/cashier`
* `/profile`

Current protected player routes:

* `/cashier`
* `/profile`
* `/six-animal`

Removed player routes:

* `/history` redirects to `/`
* `/live` redirects to `/`

Current MVP game route:

* `/six-animal`

Current placeholder route:

* `/thirty-six`

Current admin routes checked:

* `/admin`
* `/admin/login`
* `/admin/users`
* `/admin/wallet-requests`
* `/admin/audit`
* `/admin/backend-health`
* `/admin/financial-integrity`
* `/admin/six-animal`
* `/admin/settings`

## Build Status

`npm run build` passed after route guard changes.

## Final Status

Chapter 91.8 — Final Route / Dead Link Sweep is complete.

Status: PASS / LOCKED

The Six Animal MVP production baseline remains protected.
