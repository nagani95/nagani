//src/app/support/page.tsx

import { redirect } from "next/navigation";

import AppShell from "@/components/layout/AppShell";
import SupportRealtimeChat from "@/components/support/SupportRealtimeChat";
import { createClient } from "@/lib/supabase/server";

function getPhoneFromEmail(email: string | null | undefined) {
  return String(email ?? "").replace("@nagani.local", "");
}

export default async function SupportPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/support");
  }

  const playerPhone = getPhoneFromEmail(user.email);

  const { data: conversation } = await supabase
    .from("support_conversations")
    .select("id, status, updated_at, player_phone")
    .eq("profile_id", user.id)
    .maybeSingle();

  const { data: messages } = conversation?.id
    ? await supabase
        .from("support_messages")
        .select("id, sender_role, body, created_at")
        .eq("conversation_id", conversation.id)
        .order("created_at", { ascending: true })
        .limit(200)
    : { data: [] };

  return (
    <AppShell>
      <SupportRealtimeChat
        playerPhone={playerPhone}
        conversation={conversation ?? null}
        initialMessages={messages ?? []}
      />
    </AppShell>
  );
}