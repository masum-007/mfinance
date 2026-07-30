import { Card } from "@/components/ui/card"
import prisma from "@/lib/prisma"
import { createClient } from "@/lib/supabase/server"
import {
  TrendingUp,
  Wallet,
  ArrowDownCircle,
  ArrowUpCircle,
} from "lucide-react"
import {
  SpendingChart,
  CategoryPie,
} from "@/components/dashboard/analytics-charts"
import { DateFilter } from "./date-filter"
import { ExportButton } from "@/components/export-button"
import {
  formatCurrency,
  formatDate,
  getLocalizationPreferences,
} from "@/lib/localization"

export default async function DashboardPage(props: {
  searchParams?: Promise<{ period?: string }>
}) {
  const searchParams = await props.searchParams
  const period = searchParams?.period || "all"

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const preferences = getLocalizationPreferences(user)
  const now = new Date()
  let dateFilter: { gte?: Date; lt?: Date } | undefined

  if (period === "this_month") {
    dateFilter = {
      gte: new Date(now.getFullYear(), now.getMonth(), 1),
    }
  } else if (period === "last_month") {
    dateFilter = {
      gte: new Date(now.getFullYear(), now.getMonth() - 1, 1),
      lt: new Date(now.getFullYear(), now.getMonth(), 1),
    }
  } else if (period === "ytd") {
    dateFilter = {
      gte: new Date(now.getFullYear(), 0, 1),
    }
  }

  const [accounts, debts, transactions] = await Promise.all([
    prisma.account.findMany({
      where: { userId: user.id },
    }),
    prisma.debt.findMany({
      where: {
        userId: user.id,
        status: "OPEN",
      },
    }),
    prisma.transaction.findMany({
      where: {
        userId: user.id,
        ...(dateFilter ? { createdAt: dateFilter } : {}),
      },
      orderBy: { createdAt: "asc" },
      include: {
        category: true,
        account: true,
      },
    }),
  ])

  const currentBalance = accounts.reduce(
    (sum, account) => sum + Number(account.balance),
    0,
  )

  const othersOwe = debts
    .filter((debt) => debt.type === "Lent")
    .reduce(
      (sum, debt) => sum + Number(debt.remainingAmount),
      0,
    )

  const iOwe = debts
    .filter((debt) => debt.type === "Owe")
    .reduce(
      (sum, debt) => sum + Number(debt.remainingAmount),
      0,
    )

  const currentNetWorth = currentBalance + othersOwe - iOwe

  const periodIncome = transactions
    .filter((transaction) => transaction.type === "INCOME")
    .reduce(
      (sum, transaction) => sum + Number(transaction.amount),
      0,
    )

  const periodExpenses = transactions
    .filter((transaction) => transaction.type === "EXPENSE")
    .reduce(
      (sum, transaction) => sum + Number(transaction.amount),
      0,
    )

  const chartData = transactions.slice(-14).map((transaction) => ({
    name: formatDate(transaction.createdAt, preferences, {
      month: "short",
      day: "numeric",
    }),
    value: Number(transaction.amount),
  }))

  const categoryMap: Record<string, number> = {}

  transactions
    .filter((transaction) => transaction.type === "EXPENSE")
    .forEach((transaction) => {
      const name = transaction.category?.name || "Uncategorized"
      categoryMap[name] =
        (categoryMap[name] || 0) + Number(transaction.amount)
    })

  const pieData = Object.entries(categoryMap).map(
    ([name, value]) => ({ name, value }),
  )

  const exportData = transactions.map((transaction) => ({
    Date: formatDate(transaction.createdAt, preferences),
    Type: transaction.type,
    Amount: Number(transaction.amount),
    Currency: preferences.currency,
    Category: transaction.category?.name || "None",
    Account: transaction.account?.name || "Unknown",
    Note: transaction.note || "",
  }))

  const cards = [
    {
      label: "Current Balance",
      amount: currentBalance,
      icon: Wallet,
      bg: "from-blue-600 to-blue-800",
      details: (
        <div className="space-y-2 mt-2 w-full text-blue-50">
          <p className="border-b border-blue-400/30 pb-1 font-bold text-[10px] uppercase tracking-widest">
            Account Breakdown
          </p>

          {accounts.slice(0, 3).map((account) => (
            <div
              key={account.id}
              className="flex justify-between items-center text-xs font-medium"
            >
              <span className="truncate mr-2 opacity-90">
                {account.name}
              </span>
              <span className="font-bold">
                {formatCurrency(account.balance, preferences, {
                  maximumFractionDigits: 0,
                })}
              </span>
            </div>
          ))}

          {accounts.length > 3 && (
            <p className="text-[10px] opacity-70 italic text-right">
              + {accounts.length - 3} more
            </p>
          )}
        </div>
      ),
    },
    {
      label: "Net Worth",
      amount: currentNetWorth,
      icon: TrendingUp,
      bg: "from-indigo-600 to-indigo-900",
      details: (
        <div className="space-y-2 mt-2 w-full text-indigo-50">
          <p className="border-b border-indigo-400/30 pb-1 font-bold text-[10px] uppercase tracking-widest">
            Asset Calculation
          </p>

          <div className="flex justify-between text-xs font-medium">
            <span className="opacity-90">Total Assets</span>
            <span className="font-bold text-emerald-300">
              +{formatCurrency(currentBalance + othersOwe, preferences)}
            </span>
          </div>

          <div className="flex justify-between text-xs font-medium">
            <span className="opacity-90">Total Liabilities</span>
            <span className="font-bold text-rose-300">
              -{formatCurrency(iOwe, preferences)}
            </span>
          </div>
        </div>
      ),
    },
    {
      label: "Period Income",
      amount: periodIncome,
      icon: ArrowUpCircle,
      bg: "from-emerald-500 to-emerald-700",
      details: (
        <div className="mt-2 w-full text-emerald-50 text-xs font-medium leading-relaxed opacity-90">
          Total incoming cash flow across all accounts for the
          currently selected time period.
        </div>
      ),
    },
    {
      label: "Period Expenses",
      amount: periodExpenses,
      icon: ArrowDownCircle,
      bg: "from-rose-500 to-rose-800",
      details: (
        <div className="mt-2 w-full text-rose-50 text-xs font-medium leading-relaxed opacity-90">
          Total outgoing expenditures and payments for the currently
          selected time period.
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Overview
          </h1>
          <p className="text-slate-500 font-medium">
            Real-time insights into your financial flow.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <DateFilter />
          <ExportButton
            data={exportData}
            filename={`MFinance-Transactions-${period}`}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {cards.map((card) => (
          <Card
            key={card.label}
            className={`group relative p-0 border-none shadow-lg transition-all hover:shadow-2xl lg:hover:-translate-y-1 overflow-hidden bg-gradient-to-br flex flex-col ${card.bg}`}
          >
            <div className="p-6 flex-1 relative z-10 transition-transform duration-500 lg:group-hover:-translate-y-4">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 rounded-xl bg-white/20 text-white backdrop-blur-sm">
                  <card.icon size={20} />
                </div>
              </div>

              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/70">
                  {card.label}
                </p>
                <h3 className="text-2xl font-black text-white mt-1 tracking-tighter drop-shadow-sm">
                  {formatCurrency(card.amount, preferences)}
                </h3>
              </div>
            </div>

            <div className="relative lg:absolute inset-x-0 bottom-0 opacity-100 lg:translate-y-full lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100 transition-all duration-500 bg-black/40 lg:backdrop-blur-md p-5 z-20 flex flex-col justify-end">
              {card.details}
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SpendingChart
            data={chartData}
            currency={preferences.currency}
            locale={preferences.locale}
          />
        </div>

        <div className="lg:col-span-1">
          <CategoryPie
            data={pieData}
            currency={preferences.currency}
            locale={preferences.locale}
          />
        </div>
      </div>
    </div>
  )
}
