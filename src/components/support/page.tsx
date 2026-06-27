//src/app/agent/support/page.tsx

import { redirect } from "next/navigation";

import AgentSupportRealtimeChat from "@/components/support/AgentSupportRealtimeChat";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type AgentInfo = {
  id: string;
  agent_code: string;
  display_name: string;
  agent_level: number;
  agent_login_phone: string | null;
};

export default async function AgentSupportPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/agent/login");
  }

  const { data: agent } = await supabase
    .from("agent_profiles")
    .select("id, agent_code, display_name, agent_level, agent_login_phone")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (!agent) {
    redirect("/agent");
  }

  const agentInfo = agent as AgentInfo;

  const { data: conversation } = await supabase
    .from("support_conversations")
    .select("id, status, updated_at, agent_phone")
    .eq("conversation_type", "agent")
    .eq("agent_id", agentInfo.id)
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
    <AgentSupportRealtimeChat
      agent={agentInfo}
      conversation={conversation ?? null}
      initialMessages={messages ?? []}
    />
  );
}