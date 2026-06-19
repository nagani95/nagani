// src/components/cashier/CashierRecentTickets.tsx

import NaganiStatusBadge from "@/components/nagani-v2/NaganiStatusBadge";

type CashierTicket = {
  id: string;
  type: string;
  amount: number;
  status: string;
  time: string;
};

type CashierRecentTicketsProps = {
  tickets: CashierTicket[];
};

function formatMMK(amount: number) {
  return new Intl.NumberFormat("en-US").format(amount);
}

function getTypeLabel(type: string) {
  if (type === "ငွေထုတ်") return "ငွေထုတ်";
  if (type === "ငွေသွင်း") return "ငွေသွင်း";

  return type.toLowerCase().includes("withdraw") ? "ငွေထုတ်" : "ငွေသွင်း";
}

export default function CashierRecentTickets({
  tickets,
}: CashierRecentTicketsProps) {
  const visibleTickets = tickets.slice(0, 5);

  return (
    <section className="mb-32 mt-5 rounded-[2rem] border border-[#d6a84f]/24 bg-[linear-gradient(180deg,rgba(35,5,3,0.78),rgba(7,1,1,0.92))] p-4 shadow-xl shadow-black/45">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-black text-[#f7dfaa]/55">
            နောက်ဆုံးမှတ်တမ်း
          </p>
          <h3 className="mt-1 text-lg font-black text-[#ffd77a]">
            ငွေကြေးမှတ်တမ်း
          </h3>
        </div>

        <div className="rounded-full border border-[#d6a84f]/25 bg-black/35 px-3 py-1 text-[0.68rem] font-black text-[#ffd77a]">
          {visibleTickets.length} ခု
        </div>
      </div>

      <div className="mt-4">
        {tickets.length === 0 ? (
          <div className="rounded-2xl border border-[#d6a84f]/18 bg-black/30 p-4 text-center">
            <p className="text-sm font-black text-[#fff3d0]">
              မှတ်တမ်းမရှိသေးပါ
            </p>
            <p className="mt-2 text-xs leading-5 text-[#f7dfaa]/50">
              ငွေသွင်း သို့မဟုတ် ငွေထုတ် တင်ပြီးပါက ဤနေရာတွင် ပြပါမည်။
            </p>
          </div>
        ) : null}

        <div className="divide-y divide-[#d6a84f]/12">
          {visibleTickets.map((ticket) => (
            <div key={ticket.id} className="py-3">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="truncate text-sm font-black text-[#fff3d0]">
                    {getTypeLabel(ticket.type)}
                  </p>
                  <p className="mt-1 truncate text-[0.68rem] font-semibold text-[#f7dfaa]/48">
                    {ticket.time}
                  </p>
                </div>

                <div className="shrink-0 text-right">
                  <p className="text-sm font-black text-[#ffd77a]">
                    {formatMMK(ticket.amount)} ကျပ်
                  </p>
                  <div className="mt-2 flex justify-end">
                    <NaganiStatusBadge status={ticket.status} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}