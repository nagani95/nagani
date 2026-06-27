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

type AgentJoin = {
  id: string;
  agent_code: string;
  display_name: string;
  agent_level: number;
  parent_agent_id: string | null;
  agent_login_phone: string | null;
};

type AgentParentLite = Pick<AgentJoin, "id" | "agent_code" | "display_name">;

type RawSupportConversation = {
  id: string;
  profile_id: string | null;
  player_phone: string | null;
  conversation_type: "player" | "agent";
  agent_id: string | null;
  agent_phone: string | null;
  status: "open" | "closed";
  last_message_at: string | null;
  updated_at: string;
  created_at: string;
  agent_profiles: AgentJoin | AgentJoin[] | null;
};

type SupportConversation = Omit<RawSupportConversation, "agent_profiles"> & {
  agent_profiles: AgentJoin | null;
};

type SupportMessage = {
  id: string;
  sender_role: "player" | "agent" | "admin";
  body: string;
  created_at: string;
};

function normalizeAgent(agentProfiles: RawSupportConversation["agent_profiles"]) {
  if (Array.isArray(agentProfiles)) {
    return agentProfiles[0] ?? null;
  }

  return agentProfiles;
}

function matchesSupportSearch(
  conversation: SupportConversation,
  search: string,
  parentAgentById: Map<string, AgentParentLite>,
) {
  const target = search.trim().toLowerCase();
  if (!target) return true;

  const agent = conversation.agent_profiles;
  const parentAgent = agent?.parent_agent_id
    ? parentAgentById.get(agent.parent_agent_id)
    : null;

  const searchableText = [
    conversation.id,
    conversation.profile_id,
    conversation.player_phone,
    conversation.conversation_type,
    conversation.agent_id,
    conversation.agent_phone,
    conversation.status,
    agent?.agent_code,
    agent?.display_name,
    agent?.agent_level,
    agent?.agent_login_phone,
    agent?.parent_agent_id,
    parentAgent?.agent_code,
    parentAgent?.display_name,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return searchableText.includes(target);
}

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

  const { data: isAdmin, error: adminError } =
    await supabase.rpc("is_nagani_admin");

  if (adminError || !isAdmin) {
    redirect("/admin/login");
  }

  const { data: conversationsData } = await supabase
    .from("support_conversations")
    .select(
      `
        id,
        profile_id,
        player_phone,
        conversation_type,
        agent_id,
        agent_phone,
        status,
        last_message_at,
        updated_at,
        created_at,
        agent_profiles (
          id,
          agent_code,
          display_name,
          agent_level,
          parent_agent_id,
          agent_login_phone
        )
      `,
    )
    .order("updated_at", { ascending: false })
    .limit(80);

  const { data: parentAgentsData } = await supabase
    .from("agent_profiles")
    .select("id, agent_code, display_name")
    .eq("agent_level", 1)
    .limit(1000)
    .returns<AgentParentLite[]>();

  const parentAgentById = new Map(
    (parentAgentsData ?? []).map((agent) => [agent.id, agent]),
  );

  const loadedConversations = (
    (conversationsData ?? []) as RawSupportConversation[]
  ).map((conversation) => ({
    ...conversation,
    agent_profiles: normalizeAgent(conversation.agent_profiles),
  }));

  const conversations = loadedConversations.filter((conversation) =>
    matchesSupportSearch(conversation, search, parentAgentById),
  );

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
      initialParentAgents={parentAgentsData ?? []}
    />
  );
}