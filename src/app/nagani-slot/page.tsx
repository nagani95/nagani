// src/app/nagani-slot/page.tsx

import type { Metadata } from "next";
import { redirect } from "next/navigation";

import NaganiSlotRoom from "@/components/nagani-slot/NaganiSlotRoom";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Nagani Slot | နဂါးနီရွှေအိုး",
  description: "Nagani Slot game room.",
};

const NAGANI_SLOT_MIN_BALANCE = 1000;

function toSafeBalance(value: number | string | null | undefined) {
  const amount = Number(value ?? 0);
  return Number.isFinite(amount) ? amount : 0;
}

export default async function NaganiSlotPlayerPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: wallet } = await supabase
    .from("wallets")
    .select("balance,bonus_balance")
    .eq("profile_id", user.id)
    .maybeSingle<{
      balance: number | string | null;
      bonus_balance: number | string | null;
    }>();

  const playableBalance =
    toSafeBalance(wallet?.balance) + toSafeBalance(wallet?.bonus_balance);

  if (playableBalance < NAGANI_SLOT_MIN_BALANCE) {
    redirect("/cashier");
  }

return (
  <NaganiSlotRoom
    initialBalance={playableBalance}
    initialFreeSpinSession={null}
    paintedAssetSkin
  />
);
}