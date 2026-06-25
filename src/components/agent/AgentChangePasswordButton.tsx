//src/components/agent/AgentChangePasswordButton.tsx

"use client";

import { useState } from "react";

import { createClient } from "@/lib/supabase/client";

export function AgentChangePasswordButton() {
  const supabase = createClient();

  const [isOpen, setIsOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("error");
  const [isLoading, setIsLoading] = useState(false);

  function resetForm() {
    setCurrentPassword("");
    setNewPassword("");
    setRetypePassword("");
    setMessage("");
    setMessageType("error");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");

    if (!currentPassword) {
      setMessageType("error");
      setMessage("လက်ရှိစကားဝှက် ရိုက်ပါ။");
      return;
    }

    if (newPassword.length < 6) {
      setMessageType("error");
      setMessage("စကားဝှက်အသစ် အနည်းဆုံး ၆ လုံး ဖြစ်ရပါမည်။");
      return;
    }

    if (newPassword !== retypePassword) {
      setMessageType("error");
      setMessage("စကားဝှက်အသစ် နှစ်ကြိမ် မတူပါ။");
      return;
    }

    setIsLoading(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user?.email) {
      setIsLoading(false);
      setMessageType("error");
      setMessage("Login ပြန်ဝင်ပါ။");
      return;
    }

    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    });

    if (verifyError) {
      setIsLoading(false);
      setMessageType("error");
      setMessage("လက်ရှိစကားဝှက် မှားနေပါသည်။");
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    setIsLoading(false);

    if (updateError) {
      setMessageType("error");
      setMessage("စကားဝှက် မပြောင်းနိုင်ပါ။ ပြန်ကြိုးစားပါ။");
      return;
    }

    setMessageType("success");
    setMessage("စကားဝှက် ပြောင်းပြီးပါပြီ။");
    setCurrentPassword("");
    setNewPassword("");
    setRetypePassword("");
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          resetForm();
          setIsOpen(true);
        }}
        className="w-full rounded-2xl border border-amber-300/25 bg-black/35 px-5 py-3 text-sm font-bold text-amber-100"
      >
        စကားဝှက်ပြောင်းရန်
      </button>

      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4">
          <section className="w-full max-w-[390px] rounded-[1.7rem] border border-amber-300/24 bg-[linear-gradient(145deg,rgba(78,13,6,0.98),rgba(17,2,2,0.99),rgba(55,8,4,0.97))] p-5 shadow-2xl shadow-black/80">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-black tracking-[0.22em] text-amber-200/55">
                  PASSWORD
                </p>
                <h2 className="mt-1 text-xl font-black text-amber-50">
                  စကားဝှက်ပြောင်းရန်
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full border border-amber-300/20 bg-black/25 px-3 py-2 text-xs font-black text-amber-100"
              >
                ပိတ်ရန်
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-amber-100/70">
                  လက်ရှိစကားဝှက်
                </span>
                <input
                  value={currentPassword}
                  onChange={(event) => setCurrentPassword(event.target.value)}
                  type="password"
                  autoComplete="current-password"
                  className="w-full rounded-2xl border border-amber-300/18 bg-black/35 px-4 py-3 text-base font-bold text-amber-50 outline-none placeholder:text-amber-100/28 focus:border-amber-300/55"
                  placeholder="••••••••"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-amber-100/70">
                  စကားဝှက်အသစ်
                </span>
                <input
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  type="password"
                  autoComplete="new-password"
                  className="w-full rounded-2xl border border-amber-300/18 bg-black/35 px-4 py-3 text-base font-bold text-amber-50 outline-none placeholder:text-amber-100/28 focus:border-amber-300/55"
                  placeholder="အနည်းဆုံး ၆ လုံး"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-amber-100/70">
                  စကားဝှက်အသစ် ပြန်ရိုက်ပါ
                </span>
                <input
                  value={retypePassword}
                  onChange={(event) => setRetypePassword(event.target.value)}
                  type="password"
                  autoComplete="new-password"
                  className="w-full rounded-2xl border border-amber-300/18 bg-black/35 px-4 py-3 text-base font-bold text-amber-50 outline-none placeholder:text-amber-100/28 focus:border-amber-300/55"
                  placeholder="စကားဝှက်အသစ် ပြန်ရိုက်ပါ"
                />
              </label>

              {message ? (
                <p
                  className={[
                    "rounded-2xl border px-4 py-3 text-sm font-bold leading-6",
                    messageType === "success"
                      ? "border-emerald-300/25 bg-emerald-950/25 text-emerald-100"
                      : "border-red-300/25 bg-red-950/25 text-red-100",
                  ].join(" ")}
                >
                  {message}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-2xl border border-amber-200/45 bg-[linear-gradient(180deg,#f7d27a,#b87819)] px-5 py-3 text-base font-black text-[#2a0701] shadow-lg shadow-black/40 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? "ပြောင်းနေပါသည်..." : "ပြောင်းမည်"}
              </button>
            </form>
          </section>
        </div>
      ) : null}
    </>
  );
}