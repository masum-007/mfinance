import prisma from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { AddSubscriptionDialog } from "./add-sub-dialog";
import { Calendar, CreditCard, Flame, Power, PowerOff } from "lucide-react";

export default async function SubscriptionsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const [accounts, categories, subscriptions] = await Promise.all([
    prisma.account.findMany({ where: { userId: user.id } }),
    prisma.category.findMany({ where: { userId: user.id, type: "EXPENSE" } }),
    prisma.subscription.findMany({
      where: { userId: user.id },
      orderBy: { nextDate: "asc" },
      include: { account: true, category: true },
    }),
  ]);

  // Calculate Monthly Burn Rate (Monthly subs + Yearly subs / 12)
  const monthlyBurnRate = subscriptions
    .filter((sub) => sub.isActive)
    .reduce((sum, sub) => {
      const amount = Number(sub.amount);
      return sum + (sub.billingCycle === "YEARLY" ? amount / 12 : amount);
    }, 0);

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">
            Subscriptions
          </h1>
          <p className="text-slate-500 font-medium">
            Manage your recurring bills and burn rate.
          </p>
        </div>
        <AddSubscriptionDialog
          accounts={accounts.map((acc) => ({
            id: acc.id,
            name: acc.name,
            balance: Number(acc.balance), // <-- This converts the Decimal to a standard number
          }))}
          categories={categories}
        />
      </div>

      {/* Burn Rate Highlight Card */}
      <div className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Flame size={120} />
        </div>
        <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
          Monthly Burn Rate
        </p>
        <div className="text-5xl font-black tracking-tighter">
          ${monthlyBurnRate.toFixed(2)}
          <span className="text-xl text-slate-500 font-bold tracking-normal">
            /mo
          </span>
        </div>
        <p className="text-sm font-medium text-slate-400 mt-2 max-w-sm">
          This is the total amount automatically deducted from your accounts
          every month for active subscriptions.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {subscriptions.map((sub) => (
          <div
            key={sub.id}
            className={`p-6 rounded-3xl border shadow-sm transition-all duration-300 relative overflow-hidden ${
              sub.isActive
                ? "bg-white border-slate-100 hover:border-indigo-200 hover:shadow-xl"
                : "bg-slate-50 border-slate-200 opacity-60"
            }`}
          >
            <div className="flex justify-between items-start mb-6">
              <div className="space-y-1">
                <h3 className="text-xl font-black text-slate-900">
                  {sub.name}
                </h3>
                <div className="flex gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md">
                    {sub.billingCycle}
                  </span>
                  {sub.category && (
                    <span className="text-[10px] font-bold uppercase tracking-widest bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-md">
                      {sub.category.name}
                    </span>
                  )}
                </div>
              </div>
              <form
                action={async () => {
                  "use server"; /* Implement Toggle in actions.ts */
                }}
              >
                <button
                  title={sub.isActive ? "Pause" : "Activate"}
                  className={`h-8 w-8 rounded-full flex items-center justify-center transition-colors ${
                    sub.isActive
                      ? "bg-rose-50 text-rose-500 hover:bg-rose-100"
                      : "bg-emerald-50 text-emerald-500 hover:bg-emerald-100"
                  }`}
                >
                  {sub.isActive ? (
                    <PowerOff size={14} strokeWidth={3} />
                  ) : (
                    <Power size={14} strokeWidth={3} />
                  )}
                </button>
              </form>
            </div>

            <div className="space-y-4">
              <div className="text-3xl font-black tracking-tighter text-slate-900">
                ${Number(sub.amount).toFixed(2)}
              </div>

              <div className="flex items-center justify-between text-xs font-bold text-slate-500 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-1.5">
                  <CreditCard size={14} /> {sub.account.name}
                </div>
                <div className="flex items-center gap-1.5 text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">
                  <Calendar size={14} />
                  {new Date(sub.nextDate).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
