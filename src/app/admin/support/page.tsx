//src/app/admin/support/page.tsx

import { redirect } from "next/navigation";

import AdminSupportRealtimePanel from "@/components/admin/support/AdminSupportRealtimePanel";
import { createClient } from "@/lib/supabase/server";

type PageProps = {
  searchParams?: Promise<{
    thread?: string;
    q?: string;
  }>;
};

type SupportConversation = {
  id: string;
  profile_id: string;
  player_phone: string | null;
  status: "open" | "closed";
  last_message_at: string | null;
  updated_at: string;
  created_at: string;
};

type SupportMessage = {
  id: string;
  sender_role: "player" | "admin";
  body: string;
  created_at: string;
};

export default async function AdminSupportPage({ searchParams }: PageProps) {
  const params = (await searchParams) ?? {};
  const selectedThreadId = params.thread ?? "";
  const search = String(params.q ?? "").trim();

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: isAdmin, error: adminError } = await supabase.rpc(
    "is_nagani_admin"
  );

  if (adminError || !isAdmin) {
    redirect("/admin/login");
  }

  let conversationsQuery = supabase
    .from("support_conversations")
    .select(
      "id, profile_id, player_phone, status, last_message_at, updated_at, created_at"
    )
    .order("updated_at", { ascending: false })
    .limit(80);

  if (search) {
    conversationsQuery = conversationsQuery.ilike(
      "player_phone",
      `%${search}%`
    );
  }

  const { data: conversationsData } = await conversationsQuery;

  const conversations = (conversationsData ?? []) as SupportConversation[];

  const activeConversation =
    conversations.find((conversation) => conversation.id === selectedThreadId) ??
    conversations[0] ??
    null;

  const { data: messagesData } = activeConversation?.id
    ? await supabase
        .from("support_messages")
        .select("id, sender_role, body, created_at")
        .eq("conversation_id", activeConversation.id)
        .order("created_at", { ascending: true })
        .limit(300)
    : { data: [] };

  const messages = (messagesData ?? []) as SupportMessage[];

  return (
    <AdminSupportRealtimePanel
      search={search}
      initialConversations={conversations}
      initialActiveConversation={activeConversation}
      initialMessages={messages}
    />
  );
}