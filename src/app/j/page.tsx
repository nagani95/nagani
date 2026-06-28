// src/app/j/page.tsx

import { redirect } from "next/navigation";

export default function JumpJumpAdRedirectPage() {
  redirect("/start?src=jumpjumpvpn");
}