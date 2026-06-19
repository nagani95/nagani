//src/components/nagani-v2/NaganiStatusBadge.tsx

type NaganiStatusBadgeProps = {
  status: string;
};

function getStatusLabel(status: string) {
  const normalized = status.toLowerCase();

  if (normalized === "approved" || normalized === "completed") {
    return "အတည်ပြုပြီး";
  }

  if (normalized === "rejected" || normalized === "cancelled") {
    return "ငြင်းပယ်ထားသည်";
  }

  return "စောင့်ဆိုင်းနေသည်";
}

function getStatusClass(status: string) {
  const normalized = status.toLowerCase();

  if (normalized === "approved" || normalized === "completed") {
    return "border-emerald-300/25 bg-emerald-400/10 text-emerald-100";
  }

  if (normalized === "rejected" || normalized === "cancelled") {
    return "border-red-300/25 bg-red-400/10 text-red-100";
  }

  return "border-[#ffd77a]/30 bg-[#d6a84f]/12 text-[#ffd77a]";
}

export default function NaganiStatusBadge({ status }: NaganiStatusBadgeProps) {
  return (
    <span
      className={`inline-flex min-h-7 items-center rounded-full border px-3 text-[0.68rem] font-semibold ${getStatusClass(
        status
      )}`}
    >
      {getStatusLabel(status)}
    </span>
  );
}