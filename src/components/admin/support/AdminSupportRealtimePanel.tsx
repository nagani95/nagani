//src/components/admin/support/AdminSupportRealtimePanel.tsx

"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import {
  sendAdminSupportMessageAction,
  updateSupportStatusAction,
} from "@/app/admin/support/actions";
import { createClient } from "@/lib/supabase/client";

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

type AdminSupportRealtimePanelProps = {
  search: string;
  initialConversations: SupportConversation[];
  initialActiveConversation: SupportConversation | null;
  initialMessages: SupportMessage[];
};

function formatTime(value: string | null | undefined) {
  if (!value) return "No message";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function shortId(value: string) {
  return value.slice(0, 8).toUpperCase();
}

function displayPhone(value: string | null | undefined) {
  return value?.trim() || "Unknown phone";
}

function sortConversations(conversations: SupportConversation[]) {
  return [...conversations].sort((a, b) => {
    const aTime = new Date(a.updated_at || a.created_at).getTime();
    const bTime = new Date(b.updated_at || b.created_at).getTime();

    return bTime - aTime;
  });
}

export default function AdminSupportRealtimePanel({
  search,
  initialConversations,
  initialActiveConversation,
  initialMessages,
}: AdminSupportRealtimePanelProps) {
  const [supabase] = useState(() => createClient());
  const [conversations, setConversations] = useState(initialConversations);
  const [activeConversation, setActiveConversation] = useState(
    initialActiveConversation
  );
  const [messages, setMessages] = useState(initialMessages);
  const [loadedConversationId, setLoadedConversationId] = useState(
    initialActiveConversation?.id ?? ""
  );
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setConversations(initialConversations);
    setActiveConversation(initialActiveConversation);
    setMessages(initialMessages);
    setLoadedConversationId(initialActiveConversation?.id ?? "");
  }, [initialConversations, initialActiveConversation, initialMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, activeConversation?.id]);

  useEffect(() => {
    const channel = supabase
      .channel("admin-support-conversations")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "support_conversations",
        },
        (payload) => {
          const nextConversation = payload.new as SupportConversation;

          if (
            search &&
            !String(nextConversation.player_phone ?? "")
              .toLowerCase()
              .includes(search.toLowerCase())
          ) {
            return;
          }

          setConversations((current) => {
            const exists = current.some(
              (conversation) => conversation.id === nextConversation.id
            );

            const next = exists
              ? current.map((conversation) =>
                  conversation.id === nextConversation.id
                    ? nextConversation
                    : conversation
                )
              : [nextConversation, ...current];

            return sortConversations(next);
          });

          setActiveConversation((current) => current ?? nextConversation);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "support_conversations",
        },
        (payload) => {
          const nextConversation = payload.new as SupportConversation;

          setConversations((current) =>
            sortConversations(
              current.map((conversation) =>
                conversation.id === nextConversation.id
                  ? nextConversation
                  : conversation
              )
            )
          );

          setActiveConversation((current) =>
            current?.id === nextConversation.id ? nextConversation : current
          );
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [search, supabase]);

useEffect(() => {
  const conversationId = activeConversation?.id ?? "";

  if (!conversationId) return;

  if (loadedConversationId === conversationId) return;

  async function loadMessages() {
    const { data } = await supabase
      .from("support_messages")
      .select("id, sender_role, body, created_at")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true })
      .limit(300);

    setMessages((data ?? []) as SupportMessage[]);
    setLoadedConversationId(conversationId);
  }

  void loadMessages();
}, [activeConversation?.id, loadedConversationId, supabase]);

  useEffect(() => {
    if (!activeConversation?.id) return;

    const channel = supabase
      .channel(`admin-support-messages-${activeConversation.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "support_messages",
          filter: `conversation_id=eq.${activeConversation.id}`,
        },
        (payload) => {
          const nextMessage = payload.new as SupportMessage;

          setMessages((currentMessages) => {
            if (
              currentMessages.some((message) => message.id === nextMessage.id)
            ) {
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
  }, [activeConversation?.id, supabase]);

  return (
    <main className="min-h-screen bg-[#090202] px-4 py-6 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#d7b56d]">
              Admin
            </p>
            <h1 className="mt-1 text-3xl font-black text-[#fff4cf]">
              Support Chat
            </h1>
            <p className="mt-1 text-sm text-[#cdbb91]">
              Player များထံမှ support message များကို ဖတ်ပြီး reply ပြန်ရန်။
            </p>
          </div>

          <Link
            href="/admin"
            className="rounded-2xl border border-[#c8a45d]/25 bg-[#1b0b08] px-4 py-3 text-sm font-bold text-[#fff4cf]"
          >
            Admin Home
          </Link>
        </div>

        <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
          <section className="rounded-[28px] border border-[#c8a45d]/20 bg-[#150806] p-4">
            <form action="/admin/support" className="mb-4 flex gap-2">
              <input
                name="q"
                defaultValue={search}
                placeholder="Search phone..."
                className="min-w-0 flex-1 rounded-2xl border border-[#c8a45d]/20 bg-[#0d0504] px-4 py-3 text-sm text-[#fff4cf] outline-none placeholder:text-[#8f7a57]"
              />

              <button className="rounded-2xl bg-[#c99a42] px-4 py-3 text-sm font-black text-[#1c0b07]">
                Search
              </button>
            </form>

            <div className="max-h-[72vh] space-y-2 overflow-y-auto pr-1">
              {!conversations.length ? (
                <div className="rounded-3xl border border-dashed border-[#c8a45d]/25 p-6 text-center">
                  <p className="font-bold text-[#fff4cf]">No support chats</p>
                  <p className="mt-1 text-sm text-[#bba982]">
                    Player message ဝင်လာရင် ဒီနေရာမှာ ပြပါမယ်။
                  </p>
                </div>
              ) : (
                conversations.map((conversation) => {
                  const isActive = activeConversation?.id === conversation.id;

                  return (
                    <button
                      key={conversation.id}
                      type="button"
                      onClick={() => setActiveConversation(conversation)}
                      className={`block w-full rounded-3xl border p-4 text-left transition ${
                        isActive
                          ? "border-[#f0cb75] bg-[#2a120c]"
                          : "border-[#c8a45d]/15 bg-[#0d0504] hover:border-[#c8a45d]/35"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-black text-[#fff4cf]">
                            {displayPhone(conversation.player_phone)}
                          </p>

                          <p className="mt-1 text-xs text-[#bba982]">
                            ID: {shortId(conversation.profile_id)}
                          </p>
                        </div>

                        <span
                          className={`rounded-full px-2 py-1 text-[10px] font-black uppercase ${
                            conversation.status === "open"
                              ? "bg-[#1f3b25] text-[#98f0a7]"
                              : "bg-[#34231c] text-[#d8b98a]"
                          }`}
                        >
                          {conversation.status}
                        </span>
                      </div>

                      <p className="mt-3 text-xs text-[#bba982]">
                        Latest: {formatTime(conversation.last_message_at)}
                      </p>
                    </button>
                  );
                })
              )}
            </div>
          </section>

          <section className="rounded-[28px] border border-[#c8a45d]/20 bg-[#150806] p-4">
            {!activeConversation ? (
              <div className="flex min-h-[70vh] items-center justify-center text-center">
                <div>
                  <p className="text-2xl font-black text-[#fff4cf]">
                    Select a chat
                  </p>
                  <p className="mt-2 text-sm text-[#bba982]">
                    Player support message ရှိလာရင် reply ပြန်နိုင်ပါတယ်။
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-4 flex flex-col gap-3 border-b border-[#c8a45d]/15 pb-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-[#d7b56d]">
                      Player
                    </p>

                    <h2 className="mt-1 text-xl font-black text-[#fff4cf]">
                      {displayPhone(activeConversation.player_phone)}
                    </h2>

                    <p className="mt-1 text-xs text-[#bba982]">
                      Profile ID: {activeConversation.profile_id}
                    </p>
                  </div>

                  <form action={updateSupportStatusAction} className="flex gap-2">
                    <input
                      type="hidden"
                      name="conversation_id"
                      value={activeConversation.id}
                    />

                    <button
                      name="status"
                      value="open"
                      className="rounded-2xl border border-[#c8a45d]/25 bg-[#1f3b25] px-4 py-3 text-xs font-black text-[#98f0a7]"
                    >
                      Open
                    </button>

                    <button
                      name="status"
                      value="closed"
                      className="rounded-2xl border border-[#c8a45d]/25 bg-[#34231c] px-4 py-3 text-xs font-black text-[#d8b98a]"
                    >
                      Close
                    </button>
                  </form>
                </div>

                <div className="h-[58vh] overflow-y-auto rounded-[24px] border border-[#c8a45d]/15 bg-[#0d0504] p-4">
                  {!messages.length ? (
                    <div className="flex h-full items-center justify-center text-center">
                      <p className="text-sm text-[#bba982]">
                        No messages yet.
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {messages.map((message) => {
                        const isAdminMessage = message.sender_role === "admin";

                        return (
                          <div
                            key={message.id}
                            className={`flex ${
                              isAdminMessage ? "justify-end" : "justify-start"
                            }`}
                          >
                            <div
                              className={`max-w-[78%] rounded-2xl px-4 py-3 ${
                                isAdminMessage
                                  ? "bg-[#8f2117] text-[#fff8dc]"
                                  : "border border-[#c8a45d]/25 bg-[#24100b] text-[#fff4cf]"
                              }`}
                            >
                              <p className="whitespace-pre-wrap text-sm leading-6">
                                {message.body}
                              </p>

                              <p
                                className={`mt-2 text-[10px] ${
                                  isAdminMessage
                                    ? "text-[#f5d9b8]"
                                    : "text-[#b99b62]"
                                }`}
                              >
                                {isAdminMessage ? "Admin" : "Player"} ·{" "}
                                {formatTime(message.created_at)}
                              </p>
                            </div>
                          </div>
                        );
                      })}

                      <div ref={bottomRef} />
                    </div>
                  )}
                </div>

                <form action={sendAdminSupportMessageAction} className="mt-4">
                  <input
                    type="hidden"
                    name="conversation_id"
                    value={activeConversation.id}
                  />

                  <textarea
                    name="message"
                    required
                    rows={3}
                    placeholder="Reply to player..."
                    className="w-full resize-none rounded-3xl border border-[#c8a45d]/25 bg-[#2a120c] px-4 py-3 text-sm text-[#fff4cf] outline-none placeholder:text-[#9f875f] focus:border-[#e7c36f]"
                  />

                  <button
                    type="submit"
                    className="mt-3 w-full rounded-2xl bg-gradient-to-b from-[#f3d27a] to-[#b8872f] px-4 py-4 text-sm font-black text-[#2a120c]"
                  >
                    Send Reply
                  </button>
                </form>
              </>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}