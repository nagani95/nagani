// src/app/dev/nagani-slot/page.tsx

import type { Metadata } from "next";

import NaganiSlotRoom from "@/components/nagani-slot/NaganiSlotRoom";

export const metadata: Metadata = {
  title: "Nagani Slot Dev | နဂါးနီရွှေအိုး",
  description: "Nagani Slot visual MVP dev room.",
};

export default function NaganiSlotDevPage() {
  return <NaganiSlotRoom />;
}