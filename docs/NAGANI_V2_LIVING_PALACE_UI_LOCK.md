# Nagani V2 Living Palace UI Lock

Status: PASS

Branch:

- v2-living-palace-ui

## Theme Name

Nagani Living Palace UI

## Goal

Player-facing UI has been rebuilt toward a premium Myanmar royal festival hall feeling.

Players should feel:

> I entered a Myanmar royal festival hall, and the dice ceremony is waiting for me.

## Completed V2 Scope

### Theme Foundation

Created reusable V2 player UI foundation:

- NaganiPageShell
- NaganiVideoBackground
- NaganiBottomNav
- NaganiTopLogo
- NaganiRoyalButton
- NaganiRoyalInput
- NaganiFloatingSupport
- NaganiStatusBadge
- NaganiTransactionRow
- shared naganiTheme

### Main Player Shell

Updated player app shell:

- mobile-first portrait layout
- lacquer red / teak / old gold visual direction
- bottom nav has only:
  - ပရိုဖိုင်
  - မူလ
  - ပိုက်ဆံအိတ်
- support floating button added
- no History tab
- no Live tab

### Auth Pages

Updated:

- Login page
- Register page

Player-facing text is Burmese-first.

Phone-number wording is shown to players while internal auth field remains backend-safe.

### Home Page

Updated home page to V2 direction:

- top Nagani identity
- balance pill
- central dice-style play button
- Burmese play label
- ၃၆ ကောင်ထီ shown as coming soon
- no dashboard card clutter

Video background component is ready for future asset:

- /public/assets/nagani/v2/home-palace-loop.mp4
- /public/assets/nagani/v2/home-palace-poster.webp

### Wallet Page

Updated:

- cashier page
- deposit / withdraw form
- wallet hero
- wallet history
- wallet note

Text is Burmese-first.

Existing wallet backend request logic remains connected.

### Profile Page

Updated profile page:

- account information
- balance
- member ID
- wallet link
- password/support placeholders
- logout

No fake stats.
No fake VIP.
No History/Live clutter.

### Six Animal Room Visual Theme Match

Updated visual style only:

- Six Animal room shell
- betting tray
- timer/balance command panel
- active bet summary
- floating result board
- room loading overlay

Dice logic was not rebuilt.
Settlement logic was not changed.
Backend result logic was not changed.

## Locked Backend Safety

The following were not intentionally changed:

- SQL result functions
- six_animal_rounds backend timing logic
- advance_six_animal_room
- settlement logic
- wallet backend logic
- dice replay trajectory files
- dice detection logic
- approved replay library logic
- shared room result behavior

## QA Result

Build result:

- npm run build PASS

Required next smoke tests:

1. Login page opens and submits existing account.
2. Register page opens.
3. Home page loads.
4. Bottom nav opens:
   - ပရိုဖိုင်
   - မူလ
   - ပိုက်ဆံအိတ်
5. Wallet deposit/withdraw request still submits.
6. Profile logout works.
7. Six Animal room opens.
8. Betting still works.
9. Dice/result still match.
10. Settlement popup still appears once.
11. Refresh during Closed/Rolling/Result still waits safely.
12. Next round opens normally.

## V2 Status

Nagani Living Palace UI V2 is locked as player UI polish baseline.

Future V2.1+ work can continue from this lock:

- add final home video MP4
- add poster image
- improve wallet QR/admin config
- add support modal/page
- final Burmese text review
- mobile device QA