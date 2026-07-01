// src/components/nagani-slot/NaganiSlotTopBar.tsx

"use client";

import { useRouter } from "next/navigation";

import RoyalRoomTopBar from "@/components/games/six-animal/RoyalRoomTopBar";
import type { NaganiSlotGameState } from "@/lib/naganiSlot/types";

type NaganiSlotTopBarProps = {
  balance: number;
  gameState: NaganiSlotGameState;
};

const ROYAL_EXIT_DOOR_BUTTON =
  "/assets/nagani/six-animal/ui/six-animal-royal-exit-door-button-v1.png";

const NAGANI_LOGO =
  "/assets/nagani/shared/logo/nagani-logo-concept-v1.png";

export default function NaganiSlotTopBar(_props: NaganiSlotTopBarProps) {
  const router = useRouter();

  return (
    <div className="relative z-40 mx-auto mt-0 w-[calc(100%-8px)] max-w-[424px]">
      <RoyalRoomTopBar
        exitDoorAsset={ROYAL_EXIT_DOOR_BUTTON}
        logoAsset={NAGANI_LOGO}
        onExitClick={() => router.push("/")}
        showRoomControls={false}
      />
    </div>
  );
}