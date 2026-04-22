import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CreateAccountDialog } from './create-account-dialog'
import { Landmark, Smartphone, Wallet, CreditCard, Coins } from 'lucide-react'

// Helper function to pick the right icon based on account type
const getAccountIcon = (type: string) => {
  switch (type) {
    case 'bank': return <Landmark className="h-5 w-5 text-blue-600" />
    case 'mobile': return <Smartphone className="h-5 w-5 text-pink-600" />
    case 'wallet': return <Wallet className="h-5 w-5 text-indigo-600" />
    case 'credit': return <CreditCard className="h-5 w-5 text-rose-600" />
    default: return <Coins className="h-5 w-5 text-amber-600" />
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
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">My Accounts</h1>
          <p className="text-slate-500 font-medium">Where your money lives and grows.</p>
        </div>
        <CreateAccountDialog />
      </div>

      {accounts.length === 0 ? (
        <div className="flex h-[300px] shrink-0 items-center justify-center rounded-2xl border-2 border-dashed bg-white">
          <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center p-6">
            <Wallet className="h-12 w-12 text-slate-300 mb-4" />
            <h3 className="text-lg font-bold text-slate-900">No accounts found</h3>
            <p className="text-sm text-slate-500 mb-6">Add your first bank account or wallet to get started.</p>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {accounts.map((account) => (
            <Card key={account.id} className="relative overflow-hidden group border-none shadow-xl transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl">
              {/* Dynamic Gradient Background Overlay */}
              <div className={`absolute inset-0 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity pointer-events-none ${
                account.type === 'bank' ? 'bg-blue-600' : account.type === 'mobile' ? 'bg-pink-600' : 'bg-indigo-600'
              }`} />
              
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                <div className="space-y-1">
                  <CardTitle className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-400">
                    {account.name}
                  </CardTitle>
                  <div className="px-2 py-0.5 rounded-md bg-slate-100 text-[10px] font-bold text-slate-600 w-fit capitalize">
                    {account.type}
                  </div>
                </div>
                <div className="h-10 w-10 flex items-center justify-center bg-white shadow-sm rounded-xl border border-slate-100 group-hover:border-primary/20 transition-colors">
                  {getAccountIcon(account.type)}
                </div>
              </CardHeader>
              
              <CardContent className="pt-8 pb-10 relative z-10">
                <div className="text-4xl font-black text-slate-900 tracking-tighter">
                  ${Number(account.balance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </CardContent>
              
              {/* Modern Bottom Decorative Bar */}
              <div className={`h-2 w-full absolute bottom-0 left-0 ${
                account.type === 'bank' ? 'bg-blue-500' : account.type === 'mobile' ? 'bg-pink-500' : 'bg-indigo-500'
              }`} />
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}