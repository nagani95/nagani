//src/components/support/AgentSupportRealtimeChat.tsx

"use client";

import { useEffect, useRef, useState } from "react";

import { sendAgentSupportMessageAction } from "@/app/agent/support/actions";
import { createClient } from "@/lib/supabase/client";

type AgentInfo = {
  agent_code: string;
  display_name: string;
  agent_level: number;
  agent_login_phone: string | null;
};

type SupportConversation = {
  id: string;
  status: string | null;
  updated_at: string | null;
  agent_phone: string | null;
};

type SupportMessage = {
  id: string;
  sender_role: string | null;
  body: string;
  created_at: string | null;
};

type AgentSupportRealtimeChatProps = {
  agent: AgentInfo;
  conversation: SupportConversation | null;
  initialMessages: SupportMessage[];
};

function formatTime(value: string | null | undefined) {
  if (!value) return "";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function getAgentLevelLabel(level: number | null | undefined) {
  if (level === 1) return "Agent A";
  if (level === 2) return "Agent B";
  return "Agent";
}

export default function AgentSupportRealtimeChat({
  agent,
  conversation,
  initialMessages,
}: AgentSupportRealtimeChatProps) {
  const [supabase] = useState(() => createClient());
  const [messages, setMessages] = useState(initialMessages);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length]);

  useEffect(() => {
    if (!conversation?.id) return;

    const channel = supabase
      .channel(`agent-support-messages-${conversation.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "support_messages",
          filter: `conversation_id=eq.${conversation.id}`,
        },
        (payload) => {
          const nextMessage = payload.new as SupportMessage;

          setMessages((currentMessages) => {
            if (currentMessages.some((message) => message.id === nextMessage.id)) {
              return currentMessages;
            }

            return [...currentMessages, nextMessage];
          });
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [conversation?.id, supabase]);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-[#090202] px-4 py-5 pb-24 text-white">
      <section className="rounded-[28px] border border-[#c8a45d]/25 bg-[#160907] p-4 shadow-[0_18px_50px_rgba(0,0,0,0.45)]">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#d7b56d]">
              Agent Support
            </p>
            <h1 className="mt-1 text-2xl font-black text-[#fff4cf]">
              အေးဂျင့် အကူအညီ
            </h1>
            <p className="mt-1 text-sm text-[#d8c7a2]">
              Admin ထံ မက်ဆေ့ချ်ပို့ရန်။
            </p>
          </div>

          <div className="rounded-2xl border border-[#c8a45d]/25 bg-[#2a120c] px-3 py-2 text-right">
            <p className="text-[10px] uppercase tracking-[0.18em] text-[#b99b62]">
              {getAgentLevelLabel(agent.agent_level)}
            </p>
            <p className="mt-1 max-w-[130px] truncate text-xs font-bold text-[#fff4cf]">
              {agent.display_name}
            </p>
            <p className="mt-0.5 max-w-[130px] truncate text-[10px] font-bold text-[#b99b62]">
              {agent.agent_code}
            </p>
          </div>
        </div>

        <div className="h-[58vh] overflow-y-auto rounded-[24px] border border-[#c8a45d]/15 bg-[#0d0504] p-3">
          {!messages.length ? (
            <div className="flex h-full items-center justify-center text-center">
              <div>
                <p className="text-lg font-black text-[#fff4cf]">
                  Support chat စတင်ပါ
                </p>
                <p className="mt-2 text-sm leading-6 text-[#d8c7a2]">
                  Withdraw / player / commission ပြဿနာများကို admin ထံ
                  မက်ဆေ့ချ်ပို့နိုင်ပါတယ်။
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {messages.map((message) => {
                const isAgent = message.sender_role === "agent";

                return (
                  <div
                    key={message.id}
                    className={`flex ${isAgent ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[82%] rounded-2xl px-4 py-3 ${
                        isAgent
                          ? "bg-[#8f2117] text-[#fff8dc]"
                          : "border border-[#c8a45d]/25 bg-[#24100b] text-[#fff4cf]"
                      }`}
                    >
                      <p className="whitespace-pre-wrap text-sm leading-6">
                        {message.body}
                      </p>
                      <p
                        className={`mt-2 text-[10px] ${
                          isAgent ? "text-[#f5d9b8]" : "text-[#b99b62]"
                        }`}
                      >
                        {isAgent ? "You" : "Admin"} · {formatTime(message.created_at)}
                      </p>
                    </div>
                  </div>
                );
              })}

              <div ref={bottomRef} />
            </div>
          )}
        </div>

        <form action={sendAgentSupportMessageAction} className="mt-4">
          <textarea
            name="message"
            required
            maxLength={1000}
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
  );
}