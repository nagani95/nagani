//src/components/agent/CopyInviteButton.tsx

"use client";

import { useState } from "react";

type CopyInviteButtonProps = {
  inviteUrl: string;
  disabled?: boolean;
};

async function copyText(value: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "true");
  textarea.style.position = "fixed";
  textarea.style.top = "-9999px";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

export function CopyInviteButton({
  inviteUrl,
  disabled = false,
}: CopyInviteButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    if (disabled) return;

    await copyText(inviteUrl);
    setCopied(true);

    window.setTimeout(() => {
      setCopied(false);
    }, 1600);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      disabled={disabled}
      className={[
        "w-full rounded-2xl border px-4 py-3 text-center text-sm font-black shadow-lg shadow-black/30 transition",
        copied
          ? "border-emerald-200/50 bg-emerald-900/45 text-emerald-50"
          : "border-amber-200/45 bg-[linear-gradient(180deg,#f8d982,#b87819)] text-[#2a0701] hover:brightness-110",
        disabled ? "cursor-not-allowed opacity-55" : "",
      ].join(" ")}
    >
      {copied ? "လင့်ခ် ကူးပြီးပါပြီ" : "ဖိတ်ခေါ်လင့်ခ် ကူးရန်"}
    </button>
  );
}