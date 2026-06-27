//src/app/agent/support/actions.ts

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

function getMessage(formData: FormData) {
  return String(formData.get("message") ?? "").trim();
}

function getPhoneFromEmail(email: string | null | undefined) {
  return String(email ?? "").replace("@nagani.local", "");
}

export async function sendAgentSupportMessageAction(formData: FormData) {
  const message = getMessage(formData);

  if (!message) {
    redirect("/agent/support?error=empty");
  }

  if (message.length > 1000) {
    redirect("/agent/support?error=too-long");
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/agent/login");
  }

  const { data: agent, error: agentError } = await supabase
    .from("agent_profiles")
    .select("id, agent_login_phone")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (agentError || !agent?.id) {
    redirect("/agent?error=agent-not-found");
  }

  const agentPhone =
    String(agent.agent_login_phone ?? "").trim() || getPhoneFromEmail(user.email);

  const { data: existingConversation, error: existingError } = await supabase
    .from("support_conversations")
    .select("id")
    .eq("conversation_type", "agent")
    .eq("agent_id", agent.id)
    .maybeSingle();

  if (existingError) {
    redirect("/agent/support?error=load");
  }

  let conversationId = existingConversation?.id;

  if (!conversationId) {
    const { data: newConversation, error: createError } = await supabase
      .from("support_conversations")
      .insert({
        conversation_type: "agent",
        agent_id: agent.id,
        agent_phone: agentPhone,
        status: "open",
      })
      .select("id")
      .single();

    if (createError || !newConversation) {
      redirect("/agent/support?error=create");
    }

    conversationId = newConversation.id;
  }

  const { error: messageError } = await supabase.from("support_messages").insert({
    conversation_id: conversationId,
    sender_id: user.id,
    sender_role: "agent",
    body: message,
  });

  if (messageError) {
    redirect("/agent/support?error=send");
  }

  revalidatePath("/agent/support");
  revalidatePath("/admin/support");

  redirect("/agent/support");
}