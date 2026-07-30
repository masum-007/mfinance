import prisma from "@/lib/prisma"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { AddDebtDialog } from "./add-debt-dialog"
import { RepayDialog } from "./repay-dialog"
import { UserMinus, UserPlus, Calendar } from "lucide-react"
import {
  formatCurrency,
  formatDate,
  getLocalizationPreferences,
} from "@/lib/localization"

export default async function DebtPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const preferences = getLocalizationPreferences(user)

  const [accounts, debts] = await Promise.all([
    prisma.account.findMany({
      where: { userId: user.id },
    }),
    prisma.debt.findMany({
      where: {
        userId: user.id,
        status: "OPEN",
      },
      orderBy: { createdAt: "desc" },
    }),
  ])

  const iOwe = debts.filter((debt) => debt.type === "Owe")
  const othersOwe = debts.filter(
    (debt) => debt.type === "Lent",
  )

  const formattedAccounts = accounts.map((account) => ({
    id: account.id,
    name: account.name,
  }))

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground">
            Liabilities & Receivables
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            Keep track of your personal commitments.
          </p>
        </div>

        <AddDebtDialog accounts={formattedAccounts} />
      </div>

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-1">
            <div className="h-10 w-10 flex items-center justify-center rounded-2xl bg-rose-50 dark:bg-rose-950/30 text-rose-600 border border-rose-100 dark:border-rose-900/30 shadow-sm">
              <UserMinus size={20} />
            </div>
            <h2 className="text-xl font-extrabold text-foreground">
              People I Owe
            </h2>
          </div>

          <div className="grid gap-4">
            {iOwe.length === 0 ? (
              <div className="p-8 text-center border-2 border-dashed rounded-3xl text-slate-400 dark:text-slate-600 font-medium bg-background border-border">
                No active debts.
              </div>
            ) : (
              iOwe.map((debt) => (
                <Card
                  key={debt.id}
                  className="group border-none shadow-md hover:shadow-xl transition-all duration-300 rounded-3xl overflow-hidden"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-2 bg-rose-500" />

                  <CardContent className="p-6 pl-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <p className="text-xl font-black text-foreground group-hover:text-rose-600 transition-colors">
                        {debt.counterpartyName}
                      </p>

                      <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                        <Calendar size={12} />
                        Due:{" "}
                        {debt.dueDate
                          ? formatDate(
                              debt.dueDate,
                              preferences,
                            )
                          : "Flexible"}
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-2xl font-black text-rose-600 tracking-tighter">
                        {formatCurrency(
                          debt.remainingAmount,
                          preferences,
                        )}
                      </div>

                      <RepayDialog
                        debtId={debt.id}
                        currentAmount={Number(
                          debt.remainingAmount,
                        )}
                        type={debt.type}
                        accounts={formattedAccounts}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-3 px-1">
            <div className="h-10 w-10 flex items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 border border-emerald-100 dark:border-emerald-900/30 shadow-sm transition-colors">
              <UserPlus size={20} />
            </div>
            <h2 className="text-xl font-extrabold text-foreground">
              Others Owe Me
            </h2>
          </div>

          <div className="grid gap-4">
            {othersOwe.length === 0 ? (
              <div className="p-8 text-center border-2 border-dashed rounded-3xl text-slate-400 dark:text-slate-600 font-medium bg-slate-50/50 dark:bg-slate-900/20 border-slate-200 dark:border-slate-800">
                No active receivables.
              </div>
            ) : (
              othersOwe.map((debt) => (
                <Card
                  key={debt.id}
                  className="group border-none shadow-md dark:shadow-none transition-all duration-300 rounded-3xl overflow-hidden bg-card dark:border dark:border-border hover:shadow-xl"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-2 bg-emerald-500" />

                  <CardContent className="p-6 pl-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-transparent">
                    <div className="space-y-1">
                      <p className="text-xl font-black text-foreground group-hover:text-emerald-600 transition-colors">
                        {debt.counterpartyName}
                      </p>

                      <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <Calendar size={12} />
                        Issued:{" "}
                        {formatDate(
                          debt.createdAt,
                          preferences,
                        )}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-2xl font-black text-emerald-600 tracking-tighter">
                        {formatCurrency(
                          debt.remainingAmount,
                          preferences,
                        )}
                      </div>

                      <RepayDialog
                        debtId={debt.id}
                        currentAmount={Number(
                          debt.remainingAmount,
                        )}
                        type={debt.type}
                        accounts={formattedAccounts}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
