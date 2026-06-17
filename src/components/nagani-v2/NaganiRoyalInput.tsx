//src/components/nagani-v2/NaganiRoyalInput.tsx

import type { InputHTMLAttributes } from "react";

type NaganiRoyalInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export default function NaganiRoyalInput({
  label,
  className = "",
  ...props
}: NaganiRoyalInputProps) {
  return (
    <label className="block space-y-2">
      <span className="pl-2 text-xs font-semibold text-[#f7dfaa]/85">
        {label}
      </span>
      <input
        className={`min-h-11 w-full rounded-2xl border border-[#d6a84f]/25 bg-black/35 px-4 py-3 text-sm text-[#fff3d0] outline-none placeholder:text-[#f7dfaa]/35 focus:border-[#ffd77a]/60 focus:ring-2 focus:ring-[#d6a84f]/20 ${className}`}
        {...props}
      />
    </label>
  );
}