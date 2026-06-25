//src/components/agent/AgentChangePasswordButton.tsx

 "use client";

import { useState } from "react";

import { createClient } from "@/lib/supabase/client";

export function AgentChangePasswordButton() {
  const supabase = createClient();

  const [isOpen, setIsOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  function resetForm() {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setMessage(null);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage("အချက်အလက်အားလုံး ဖြည့်ပါ။");
      return;
    }

    if (newPassword.length < 6) {
      setMessage("Password အသစ်သည် အနည်းဆုံး ၆ လုံး ဖြစ်ရပါမည်။");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("Password အသစ် နှစ်ခု မတူပါ။");
      return;
    }

    setIsSaving(true);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user?.email) {
        setMessage("Login session မတွေ့ပါ။ ပြန်ဝင်ပြီး စမ်းပါ။");
        return;
      }

      const { error: verifyError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });

      if (verifyError) {
        setMessage("လက်ရှိ Password မမှန်ပါ။");
        return;
      }

      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        setMessage(updateError.message || "Password ပြောင်းရန် မအောင်မြင်ပါ။");
        return;
      }

      setMessage("Password ပြောင်းပြီးပါပြီ။");

      setTimeout(() => {
        resetForm();
        setIsOpen(false);
      }, 900);
    } finally {
      setIsSaving(false);
    }
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
        Password ပြောင်းရန်
      </button>

      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4">
          <section className="w-full max-w-[390px] rounded-[1.7rem] border border-amber-300/25 bg-[linear-gradient(145deg,#3a0904,#120202,#250503)] p-5 text-amber-50 shadow-2xl shadow-black/80">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-black tracking-[0.22em] text-amber-100/45">
                  SECURITY
                </p>
                <h2 className="mt-1 text-xl font-black">
                  Password ပြောင်းရန်
                </h2>
              </div>

              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setIsOpen(false);
                }}
                className="rounded-full border border-amber-300/20 bg-black/30 px-3 py-1 text-sm font-black text-amber-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-3">
              <label className="block">
                <span className="text-xs font-bold text-amber-100/55">
                  လက်ရှိ Password
                </span>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(event) => setCurrentPassword(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-amber-300/18 bg-black/35 px-4 py-3 text-base font-bold text-amber-50 outline-none placeholder:text-amber-100/25 focus:border-amber-200/45"
                  placeholder="လက်ရှိ password"
                  autoComplete="current-password"
                />
              </label>

              <label className="block">
                <span className="text-xs font-bold text-amber-100/55">
                  Password အသစ်
                </span>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-amber-300/18 bg-black/35 px-4 py-3 text-base font-bold text-amber-50 outline-none placeholder:text-amber-100/25 focus:border-amber-200/45"
                  placeholder="အနည်းဆုံး ၆ လုံး"
                  autoComplete="new-password"
                />
              </label>

              <label className="block">
                <span className="text-xs font-bold text-amber-100/55">
                  Password အသစ် ပြန်ရိုက်ပါ
                </span>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-amber-300/18 bg-black/35 px-4 py-3 text-base font-bold text-amber-50 outline-none placeholder:text-amber-100/25 focus:border-amber-200/45"
                  placeholder="ပြန်ရိုက်ပါ"
                  autoComplete="new-password"
                />
              </label>

              {message ? (
                <p className="rounded-2xl border border-amber-300/15 bg-black/30 px-4 py-3 text-sm font-bold leading-6 text-amber-100/75">
                  {message}
                </p>
              ) : null}

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setIsOpen(false);
                  }}
                  className="rounded-2xl border border-amber-300/20 bg-black/35 px-4 py-3 text-sm font-black text-amber-100"
                >
                  မလုပ်တော့ပါ
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="rounded-2xl border border-amber-200/40 bg-[linear-gradient(180deg,#f7d27a,#b87819)] px-4 py-3 text-sm font-black text-[#2a0701] shadow-lg shadow-black/35 disabled:opacity-60"
                >
                  {isSaving ? "ပြောင်းနေသည်..." : "ပြောင်းမည်"}
                </button>
              </div>
            </form>
          </section>
        </div>
      ) : null}
    </>
  );
}