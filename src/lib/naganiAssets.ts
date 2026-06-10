//src>lib>naganiAssets.ts

export const naganiAssets = {
  shared: {
    logo: {
      conceptV1: "/assets/nagani/shared/logo/nagani-logo-concept-v1.png",
    },
    backgrounds: {
      darkLacquer:
        "/assets/nagani/shared/backgrounds/shared-dark-lacquer-bg-sample-01.png",
    },
    ui: {
      goldPanel: "/assets/nagani/shared/ui/shared-gold-panel-sample-01.png",
    },
  },

  sixAnimal: {
       animals: {
      tiger: "/assets/nagani/six-animal/animals/six-animal-tiger-sample-01.png",
      dragon: "/assets/nagani/six-animal/animals/six-animal-dragon-sample-01.png",
      rooster: "/assets/nagani/six-animal/animals/six-animal-rooster-sample-01.png",
      fish: "/assets/nagani/six-animal/animals/six-animal-fish-sample-01.png",
      crab: "/assets/nagani/six-animal/animals/six-animal-crab-sample-01.png",
      elephant:
        "/assets/nagani/six-animal/animals/six-animal-elephant-sample-01.png",
    },
    dice: {
      sample: "/assets/nagani/six-animal/dice/six-animal-dice-sample-01.png",
      faces: {
        base: "/assets/nagani/six-animal/dice/faces",
        tiger: "/assets/nagani/six-animal/dice/faces/dice-face-tiger-v1.png",
        dragon: "/assets/nagani/six-animal/dice/faces/dice-face-dragon-v1.png",
        rooster: "/assets/nagani/six-animal/dice/faces/dice-face-rooster-v1.png",
        fish: "/assets/nagani/six-animal/dice/faces/dice-face-fish-v1.png",
        crab: "/assets/nagani/six-animal/dice/faces/dice-face-crab-v1.png",
        elephant: "/assets/nagani/six-animal/dice/faces/dice-face-elephant-v1.png",
      },
    },
    room: {
      palaceBgV1:
        "/assets/nagani/six-animal/room/six-animal-palace-room-bg-v1.jpg",
    },

        sounds: {
      base: "/assets/nagani/six-animal/sounds",
      betLocked: "/assets/nagani/six-animal/sounds/bet-locked.mp3",
      betsClosed: "/assets/nagani/six-animal/sounds/bets-closed.mp3",
      diceReveal: "/assets/nagani/six-animal/sounds/dice-reveal.mp3",
      result: "/assets/nagani/six-animal/sounds/result.mp3",
      win: "/assets/nagani/six-animal/sounds/win.mp3",
      noMatch: "/assets/nagani/six-animal/sounds/no-match.mp3",
      nextRound: "/assets/nagani/six-animal/sounds/next-round.mp3",
    },

    tableModels: {
      base: "/assets/nagani/six-animal/table-models",
      royalTableV1:
        "/assets/nagani/six-animal/table-models/six-animal-royal-table-v1.glb",
    },
  },

  thirtySix: {
    ui: {
      boardFrame:
        "/assets/nagani/thirty-six/ui/thirty-six-board-frame-sample-01.png",
    },
  },
} as const;

