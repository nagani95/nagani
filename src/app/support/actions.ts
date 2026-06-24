//src/app/support/actions.ts

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

export async function sendPlayerSupportMessageAction(formData: FormData) {
  const message = getMessage(formData);

  if (!message) {
    redirect("/support?error=empty");
  }

    if (message.length > 1000) {
    redirect("/support?error=too-long");
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const playerPhone = getPhoneFromEmail(user.email);

  const { data: existingConversation, error: existingError } = await supabase
    .from("support_conversations")
    .select("id")
    .eq("profile_id", user.id)
    .maybeSingle();

  if (existingError) {
    redirect("/support?error=load");
  }

  let conversationId = existingConversation?.id;

  if (!conversationId) {
    const { data: newConversation, error: createError } = await supabase
      .from("support_conversations")
      .insert({
        profile_id: user.id,
        player_phone: playerPhone,
        status: "open",
      })
      .select("id")
      .single();

    if (createError || !newConversation) {
      redirect("/support?error=create");
    }

    conversationId = newConversation.id;
  }

  const { error: messageError } = await supabase.from("support_messages").insert({
    conversation_id: conversationId,
    sender_id: user.id,
    sender_role: "player",
    body: message,
  });

  if (messageError) {
    redirect("/support?error=send");
  }

  revalidatePath("/support");
  revalidatePath("/admin/support");

  redirect("/support");
}