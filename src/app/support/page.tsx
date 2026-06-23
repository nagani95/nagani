//src/app/support/page.tsx

import { redirect } from "next/navigation";

import AppShell from "@/components/layout/AppShell";
import { createClient } from "@/lib/supabase/server";

import { sendPlayerSupportMessageAction } from "./actions";

function formatTime(value: string | null | undefined) {
  if (!value) return "";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function getPhoneFromEmail(email: string | null | undefined) {
  return String(email ?? "").replace("@nagani.local", "");
}

export default async function SupportPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
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
      <main className="mx-auto flex min-h-[calc(100vh-120px)] w-full max-w-md flex-col pb-24">
        <section className="rounded-[28px] border border-[#c8a45d]/25 bg-[#160907] p-4 shadow-[0_18px_50px_rgba(0,0,0,0.45)]">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#d7b56d]">
                Support
              </p>
              <h1 className="mt-1 text-2xl font-black text-[#fff4cf]">
                အကူအညီ
              </h1>
              <p className="mt-1 text-sm text-[#d8c7a2]">
                မေးချင်တာရှိရင် ဒီနေရာကနေ ပို့နိုင်ပါတယ်။
              </p>
            </div>

            <div className="rounded-2xl border border-[#c8a45d]/25 bg-[#2a120c] px-3 py-2 text-right">
              <p className="text-[10px] uppercase tracking-[0.18em] text-[#b99b62]">
                Account
              </p>
              <p className="mt-1 max-w-[120px] truncate text-xs font-bold text-[#fff4cf]">
                {conversation?.player_phone || playerPhone || "Player"}
              </p>
            </div>
          </div>

          <div className="h-[52vh] overflow-y-auto rounded-[24px] border border-[#c8a45d]/15 bg-[#0d0504] p-3">
            {!messages?.length ? (
              <div className="flex h-full items-center justify-center text-center">
                <div>
                  <p className="text-lg font-black text-[#fff4cf]">
                    Support chat စတင်ပါ
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[#d8c7a2]">
                    ငွေဖြည့် / ငွေထုတ် / အကောင့်ပြဿနာများကို admin ထံ
                    မက်ဆေ့ချ်ပို့နိုင်ပါတယ်။
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {messages.map((message) => {
                  const isPlayer = message.sender_role === "player";

                  return (
                    <div
                      key={message.id}
                      className={`flex ${isPlayer ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[82%] rounded-2xl px-4 py-3 ${
                          isPlayer
                            ? "bg-[#8f2117] text-[#fff8dc]"
                            : "border border-[#c8a45d]/25 bg-[#24100b] text-[#fff4cf]"
                        }`}
                      >
                        <p className="whitespace-pre-wrap text-sm leading-6">
                          {message.body}
                        </p>
                        <p
                          className={`mt-2 text-[10px] ${
                            isPlayer ? "text-[#f5d9b8]" : "text-[#b99b62]"
                          }`}
                        >
                          {isPlayer ? "You" : "Admin"} ·{" "}
                          {formatTime(message.created_at)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <form action={sendPlayerSupportMessageAction} className="mt-4">
            <textarea
              name="message"
              required
              rows={3}
              placeholder="မက်ဆေ့ချ်ရေးပါ..."
              className="w-full resize-none rounded-3xl border border-[#c8a45d]/25 bg-[#2a120c] px-4 py-3 text-sm text-[#fff4cf] outline-none placeholder:text-[#9f875f] focus:border-[#e7c36f]"
            />

            <button
              type="submit"
              className="mt-3 w-full rounded-2xl bg-gradient-to-b from-[#f3d27a] to-[#b8872f] px-4 py-4 text-sm font-black text-[#2a120c] shadow-[0_14px_30px_rgba(0,0,0,0.35)]"
            >
              ပို့မည်
            </button>
          </form>
        </section>
      </main>
    </AppShell>
  );
}