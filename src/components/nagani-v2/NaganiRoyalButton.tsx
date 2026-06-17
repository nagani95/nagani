//src/components/nagani-v2/NaganiRoyalButton.tsx

import type { ButtonHTMLAttributes, ReactNode } from "react";

type NaganiRoyalButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
};

export default function NaganiRoyalButton({
  children,
  variant = "primary",
  className = "",
  type = "button",
  ...props
}: NaganiRoyalButtonProps) {
  const variantClass =
    variant === "primary"
      ? "border-[#ffd77a]/45 bg-gradient-to-b from-[#b21b16] via-[#7f1111] to-[#3a0707] text-[#fff3d0] shadow-[0_14px_34px_rgba(0,0,0,0.45)]"
      : variant === "secondary"
        ? "border-[#d6a84f]/35 bg-[#2a1209]/78 text-[#fff3d0]"
        : "border-[#d6a84f]/20 bg-black/20 text-[#f7dfaa]";

  return (
    <button
      type={type}
      className={`min-h-11 rounded-full border px-5 py-3 text-center text-sm font-semibold tracking-wide transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 ${variantClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}