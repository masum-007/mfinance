import prisma from "@/lib/prisma"
import { createClient } from "@/lib/supabase/server"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Target, AlertCircle, Sparkles } from "lucide-react"
import { SetBudgetDialog } from "./set-budget-dialog"
import {
  formatCurrency,
  formatDate,
  getLocalizationPreferences,
} from "@/lib/localization"

export default async function BudgetsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const preferences = getLocalizationPreferences(user)
  const now = new Date()
  const currentMonth = now.getMonth() + 1
  const currentYear = now.getFullYear()
  const startOfMonth = new Date(currentYear, now.getMonth(), 1)

  const [categories, budgets, transactions] = await Promise.all([
    prisma.category.findMany({
      where: {
        userId: user.id,
        type: "EXPENSE",
      },
    }),
    prisma.budget.findMany({
      where: {
        userId: user.id,
        month: currentMonth,
        year: currentYear,
      },
    }),
    prisma.transaction.findMany({
      where: {
        userId: user.id,
        type: "EXPENSE",
        createdAt: { gte: startOfMonth },
      },
    }),
  ])

  const budgetStats = categories.map((category) => {
    const budget = budgets.find(
      (item) => item.categoryId === category.id,
    )

    const spent = transactions
      .filter(
        (transaction) =>
          transaction.categoryId === category.id,
      )
      .reduce(
        (sum, transaction) => sum + Number(transaction.amount),
        0,
      )

    const limit = budget ? Number(budget.amount) : 0
    const percent =
      limit > 0 ? Math.min((spent / limit) * 100, 100) : 0
    const remaining = Math.max(limit - spent, 0)

    return {
      id: category.id,
      name: category.name,
      limit,
      spent,
      percent,
      remaining,
    }
  })

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black tracking-tight text-card-foreground">
          Spending Goals
        </h1>

        <p className="text-slate-500 font-medium uppercase text-[11px] tracking-[0.2em]">
          Plan for{" "}
          {formatDate(now, preferences, {
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>

      {budgetStats.length === 0 ? (
        <div className="flex h-[300px] flex-col items-center justify-center rounded-3xl border-2 border-dashed bg-background text-center p-8">
          <Target className="h-12 w-12 text-slate-200 mb-4" />
          <h3 className="text-lg font-bold text-card-foreground">
            No targets set
          </h3>
          <p className="text-sm text-slate-500 max-w-xs">
            Define expense categories in settings to start managing
            your monthly limits.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {budgetStats.map((stat) => (
            <Card
              key={stat.id}
              className="group border-none shadow-xl hover:shadow-2xl transition-all duration-300 rounded-3xl overflow-hidden bg-background"
            >
              <CardHeader className="pb-4">
                <CardTitle className="text-sm font-black flex justify-between items-center text-slate-400 uppercase tracking-widest">
                  <span className="group-hover:text-primary transition-colors">
                    {stat.name}
                  </span>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-black ${
                        stat.percent >= 90
                          ? "bg-rose-100 text-rose-600"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {stat.percent.toFixed(0)}%
                    </span>

                    <SetBudgetDialog
                      categoryId={stat.id}
                      currentLimit={stat.limit}
                      month={currentMonth}
                      year={currentYear}
                    />
                  </div>
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <div className="text-3xl font-black text-card-foreground tracking-tighter">
                      {formatCurrency(stat.spent, preferences)}
                    </div>

                    <div className="text-xs font-bold text-slate-400">
                      of {formatCurrency(stat.limit, preferences)}
                    </div>
                  </div>

                  <Progress
                    value={stat.percent}
                    className={`h-3 rounded-full bg-slate-50 ${
                      stat.percent >= 90
                        ? "[&>div]:bg-rose-500"
                        : "[&>div]:bg-primary"
                    }`}
                  />
                </div>

                <div
                  className={`p-3 rounded-2xl flex items-center gap-3 ${
                    stat.percent >= 90
                      ? "bg-rose-50 text-rose-600 border border-rose-100"
                      : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                  }`}
                >
                  {stat.percent >= 90 ? (
                    <AlertCircle size={16} />
                  ) : (
                    <Sparkles size={16} />
                  )}

                  <span className="text-[11px] font-black uppercase tracking-tight">
                    {formatCurrency(stat.remaining, preferences)}{" "}
                    {stat.percent >= 90
                      ? "Over / Near Limit"
                      : "Safe to spend"}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
