//src/components/nagani-v2/NaganiTransactionRow.tsx

import NaganiStatusBadge from "./NaganiStatusBadge";

type NaganiTransactionRowProps = {
  title: string;
  amount: number;
  status: string;
  time?: string;
};

function formatMMK(amount: number) {
  return new Intl.NumberFormat("en-US").format(amount);
}

export default function NaganiTransactionRow({
  title,
  amount,
  status,
  time,
}: NaganiTransactionRowProps) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-[#d6a84f]/10 py-3 last:border-b-0">
      <div className="min-w-0">
        <div className="truncate text-sm font-semibold text-[#fff3d0]">
          {title}
        </div>
        {time ? (
          <div className="mt-1 truncate text-[0.68rem] text-[#f7dfaa]/55">
            {time}
          </div>
        ) : null}
      </div>

      <div className="shrink-0 text-right">
        <div className="text-sm font-bold text-[#ffd77a]">
          {formatMMK(amount)} MMK
        </div>
        <div className="mt-1">
          <NaganiStatusBadge status={status} />
        </div>
      </div>
    </div>
  );
}