import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { Card, CardContent } from '@/components/ui/card'
import { CreateAccountDialog } from './create-account-dialog'
import { AddMoneyDialog } from './add-money-dialog' 
import { Landmark, Smartphone, Wallet, CreditCard, Coins, Activity } from 'lucide-react'

// Helper function to pick the right icon
const getAccountIcon = (type: string) => {
  switch (type) {
    case 'bank': return <Landmark className="h-6 w-6" />
    case 'mobile': return <Smartphone className="h-6 w-6" />
    case 'wallet': return <Wallet className="h-6 w-6" />
    case 'credit': return <CreditCard className="h-6 w-6" />
    default: return <Coins className="h-6 w-6" />
  }
}

// Helper to assign beautiful, modern color palettes based on account type
const getTypeStyles = (type: string) => {
  switch (type) {
    case 'bank': return { color: 'text-blue-600', bg: 'bg-blue-50', gradient: 'from-blue-400/20' }
    case 'mobile': return { color: 'text-pink-600', bg: 'bg-pink-50', gradient: 'from-pink-400/20' }
    case 'wallet': return { color: 'text-indigo-600', bg: 'bg-indigo-50', gradient: 'from-indigo-400/20' }
    case 'credit': return { color: 'text-rose-600', bg: 'bg-rose-50', gradient: 'from-rose-400/20' }
    default: return { color: 'text-amber-600', bg: 'bg-amber-50', gradient: 'from-amber-400/20' }
  }
}

export default async function AccountsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const accounts = await prisma.account.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'asc' }
  })

  return (
    <div className="space-y-10 pb-20">
      {/* Clean Light Mode Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-slate-900">My Accounts</h1>
          <p className="text-slate-500 font-medium mt-1">Where your money lives and grows.</p>
        </div>
        <CreateAccountDialog />
      </div>

      {accounts.length === 0 ? (
        /* Refined Empty State */
        <div className="flex h-[350px] shrink-0 items-center justify-center rounded-[2.5rem] border-2 border-dashed bg-slate-50/50 border-slate-200">
          <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center p-6">
            <div className="h-20 w-20 bg-white shadow-xl shadow-slate-200/50 rounded-full flex items-center justify-center mb-6">
              <Wallet className="h-10 w-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-black text-slate-900">No accounts found</h3>
            <p className="text-slate-500 font-medium mb-6 mt-2">Add your first bank account or digital wallet to start tracking your net worth.</p>
          </div>
        </div>
      ) : (
        /* Modern Account Cards Grid */
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          {accounts.map((account: any) => {
            const styles = getTypeStyles(account.type)

            return (
              <Card 
                key={account.id} 
                className="relative overflow-hidden group border border-slate-100 shadow-xl shadow-slate-200/40 rounded-[2.5rem] bg-white transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 hover:border-slate-200"
              >
                {/* Background Ambient Glow */}
                <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl ${styles.gradient} to-transparent rounded-full blur-3xl opacity-40 group-hover:opacity-70 transition-opacity duration-500 pointer-events-none translate-x-10 -translate-y-10`} />
                
                {/* Decorative Pattern / Fake Chip */}
                <div className="absolute left-8 top-24 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity duration-500 pointer-events-none">
                  <Activity size={120} strokeWidth={1} />
                </div>

                <CardContent className="p-8 relative z-10 flex flex-col h-full justify-between min-h-[240px]">
                  {/* Top Section: Badges & Icon */}
                  <div className="flex justify-between items-start">
                    <div className="px-4 py-1.5 rounded-full bg-slate-50 border border-slate-100 text-[10px] font-black text-slate-500 uppercase tracking-widest shadow-sm">
                      {account.type}
                    </div>
                    <div className={`h-14 w-14 rounded-2xl flex items-center justify-center ${styles.bg} ${styles.color} shadow-inner ring-1 ring-white/50 backdrop-blur-sm group-hover:scale-110 transition-transform duration-500`}>
                      {getAccountIcon(account.type)}
                    </div>
                  </div>

                  {/* Bottom Section: Name & Balance */}
                  <div className="mt-10">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-2 drop-shadow-sm">
                      {account.name}
                    </p>
                    <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tighter truncate">
                      ${Number(account.balance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </h2>
                    
                    {/* MOVED: Button is now on its own row below the balance */}
                    <div className="mt-6 flex items-center">
                      <AddMoneyDialog accountId={account.id} accountName={account.name} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}