//src/app/admin/support/actions.ts

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

async function requireAdmin() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: isAdmin, error } = await supabase.rpc("is_nagani_admin");

  if (error || !isAdmin) {
    redirect("/admin/login");
  }

  return { supabase, user };
}

export async function sendAdminSupportMessageAction(formData: FormData) {
  const conversationId = String(formData.get("conversation_id") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!conversationId) {
    redirect("/admin/support");
  }

  if (!message) {
    redirect(`/admin/support?thread=${conversationId}&error=empty`);
  }

  const { supabase, user } = await requireAdmin();

  const { error } = await supabase.from("support_messages").insert({
    conversation_id: conversationId,
    sender_id: user.id,
    sender_role: "admin",
    body: message,
  });

  if (error) {
    redirect(`/admin/support?thread=${conversationId}&error=send`);
  }

revalidatePath("/admin/support");
revalidatePath("/support");
revalidatePath("/agent/support");

  redirect(`/admin/support?thread=${conversationId}`);
}

export async function updateSupportStatusAction(formData: FormData) {
  const conversationId = String(formData.get("conversation_id") ?? "").trim();
  const status = String(formData.get("status") ?? "").trim();

  if (!conversationId || !["open", "closed"].includes(status)) {
    redirect("/admin/support");
  }

  const { supabase } = await requireAdmin();

  const { error } = await supabase
    .from("support_conversations")
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", conversationId);

  if (error) {
    redirect(`/admin/support?thread=${conversationId}&error=status`);
  }

revalidatePath("/admin/support");
revalidatePath("/support");
revalidatePath("/agent/support");

  redirect(`/admin/support?thread=${conversationId}`);
}