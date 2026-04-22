import { Card } from "@/components/ui/card"
import prisma from "@/lib/prisma"
import { createClient } from "@/lib/supabase/server"
import { TrendingUp, Wallet, ArrowDownCircle, ArrowUpCircle } from 'lucide-react'
import { SpendingChart, CategoryPie } from "@/components/dashboard/analytics-charts"

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  // Fetch everything
  const [accounts, debts, transactions, categories] = await Promise.all([
    prisma.account.findMany({ where: { userId: user.id } }),
    prisma.debt.findMany({ where: { userId: user.id, status: 'OPEN' } }),
    prisma.transaction.findMany({ 
      where: { userId: user.id }, 
      orderBy: { createdAt: 'asc' },
      include: { category: true }
    }),
    prisma.category.findMany({ where: { userId: user.id } })
  ])

  // Math for Header Cards (With explicit types to fix TS errors)
  const balance = accounts.reduce((s: number, a: any) => s + Number(a.balance), 0)
  const owed = debts.filter((d: any) => d.type === 'Owe').reduce((s: number, d: any) => s + Number(d.remainingAmount), 0)
  const lent = debts.filter((d: any) => d.type === 'Lent').reduce((s: number, d: any) => s + Number(d.remainingAmount), 0)

  // Data for Spending Chart
  const chartData = transactions.slice(-7).map((t: any) => ({
    name: new Date(t.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    value: Number(t.amount)
  }))

  // Data for Category Pie
  const categoryMap: Record<string, number> = {}
  transactions.filter((t: any) => t.type === 'EXPENSE').forEach((t: any) => {
    const name = t.category?.name || 'Uncategorized'
    categoryMap[name] = (categoryMap[name] || 0) + Number(t.amount)
  })
  const pieData = Object.entries(categoryMap).map(([name, value]) => ({ name, value }))

  // Pre-calculate hover data
  const topAccounts = accounts.slice(0, 3)

  const cards = [
    { 
      label: 'Total Balance', amount: balance, icon: Wallet, 
      bg: 'bg-gradient-to-br from-blue-50 to-blue-100', iconColor: 'text-blue-600', iconBg: 'bg-blue-200/50',
      hoverInfo: topAccounts.map((a: any) => `${a.name}: $${Number(a.balance).toFixed(0)}`).join(' • ') || 'No accounts yet'
    },
    { 
      label: 'Net Worth', amount: (balance + lent - owed), icon: TrendingUp, 
      bg: 'bg-gradient-to-br from-indigo-50 to-indigo-100', iconColor: 'text-indigo-600', iconBg: 'bg-indigo-200/50',
      hoverInfo: `Bal ($${balance.toFixed(0)}) + Lent ($${lent.toFixed(0)}) - Owed ($${owed.toFixed(0)})`
    },
    { 
      label: 'Debts Owed', amount: owed, icon: ArrowDownCircle, 
      bg: 'bg-gradient-to-br from-rose-50 to-rose-100', iconColor: 'text-rose-600', iconBg: 'bg-rose-200/50',
      hoverInfo: debts.filter((d: any) => d.type === 'Owe').map((d: any) => `${d.counterpartyName}: $${Number(d.remainingAmount).toFixed(0)}`).join(' • ') || 'Zero debt!'
    },
    { 
      label: 'Money Lent', amount: lent, icon: ArrowUpCircle, 
      bg: 'bg-gradient-to-br from-emerald-50 to-emerald-100', iconColor: 'text-emerald-600', iconBg: 'bg-emerald-200/50',
      hoverInfo: debts.filter((d: any) => d.type === 'Lent').map((d: any) => `${d.counterpartyName}: $${Number(d.remainingAmount).toFixed(0)}`).join(' • ') || 'Nothing lent out'
    },
  ]

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Overview</h1>
        <p className="text-slate-500 font-medium">Real-time insights into your financial flow.</p>
      </div>

      {/* Hover Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.label} className={`group relative p-6 border-none shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 overflow-hidden ${card.bg}`}>
            {/* Hover Overlay Glassmorphism */}
            <div className="absolute inset-0 bg-white/60 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex items-center justify-center p-6 text-center">
              <p className="text-sm font-bold text-slate-800 leading-relaxed">{card.hoverInfo}</p>
            </div>
            
            <div className="relative z-0">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2.5 rounded-xl ${card.iconBg} ${card.iconColor}`}>
                  <card.icon size={20} />
                </div>
              </div>
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">{card.label}</p>
                <h3 className="text-2xl font-black text-slate-900 mt-1 tracking-tighter">
                  ${card.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </h3>
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      {/* Analytics Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        <SpendingChart data={chartData} />
        <CategoryPie data={pieData} />
      </div>
    </div>
  )
}