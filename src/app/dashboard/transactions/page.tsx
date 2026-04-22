import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { CreateTransactionDialog } from './create-transaction-dialog'
import { TransactionFilters } from './transaction-filters'
import { ArrowDownCircle, ArrowUpCircle, ReceiptText, Calendar } from 'lucide-react'

export default async function TransactionsPage(props: {
  searchParams?: Promise<{ query?: string; type?: string }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';
  const typeFilter = searchParams?.type || '';

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  // Build the dynamic search query
  const whereClause: any = { userId: user.id }
  
  if (typeFilter) {
    whereClause.type = typeFilter
  }

  if (query) {
    whereClause.OR = [
      { note: { contains: query, mode: 'insensitive' } },
      { account: { name: { contains: query, mode: 'insensitive' } } },
      { category: { name: { contains: query, mode: 'insensitive' } } }
    ]
  }

  const [accounts, transactions, categories] = await Promise.all([
    prisma.account.findMany({ where: { userId: user.id } }),
    prisma.transaction.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: { account: true, category: true }
    }),
    prisma.category.findMany({ where: { userId: user.id } })
  ])

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Activity</h1>
          <p className="text-slate-500 font-medium">Detailed history of your money flow.</p>
        </div>
        <CreateTransactionDialog 
          accounts={accounts.map(acc => ({ id: acc.id, name: acc.name, balance: Number(acc.balance) }))} 
          categories={categories} 
        />
      </div>

      {/* The new Interactive Search & Filter Bar */}
      <TransactionFilters />

      {transactions.length === 0 ? (
        <div className="flex h-[300px] shrink-0 items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50/50 mt-8">
          <div className="mx-auto flex flex-col items-center justify-center text-center p-6">
            <ReceiptText className="h-12 w-12 text-slate-300 mb-4" />
            <h3 className="text-lg font-bold text-slate-900">No results found</h3>
            <p className="text-sm text-slate-500 mt-1">Try adjusting your search or filters.</p>
          </div>
        </div>
      ) : (
        <div className="grid gap-3">
          {transactions.map((txn) => (
            <div 
              key={txn.id} 
              className="group flex items-center justify-between p-5 bg-white border border-slate-100 rounded-3xl shadow-sm transition-all duration-200 hover:border-primary/30 hover:shadow-md"
            >
              <div className="flex items-center gap-5">
                <div className={`h-14 w-14 shrink-0 flex items-center justify-center rounded-2xl transition-transform group-hover:scale-105 ${
                  txn.type === 'INCOME' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                }`}>
                  {txn.type === 'INCOME' ? <ArrowUpCircle size={28} strokeWidth={2.5} /> : <ArrowDownCircle size={28} strokeWidth={2.5} />}
                </div>
                
                <div className="space-y-1.5 overflow-hidden">
                  <p className="font-extrabold text-slate-900 text-lg leading-none group-hover:text-primary transition-colors truncate">
                    {txn.note || 'General Transaction'}
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                      {txn.account.name}
                    </span>
                    {txn.category && (
                      <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/5 px-2 py-0.5 rounded-md border border-primary/10">
                        {txn.category.name}
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-[11px] font-medium text-slate-400 ml-1">
                      <Calendar size={12} />
                      {new Date(txn.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className={`text-xl font-black tracking-tighter shrink-0 ml-4 ${
                txn.type === 'INCOME' ? 'text-emerald-600' : 'text-slate-900'
              }`}>
                {txn.type === 'INCOME' ? '+' : '-'}${Number(txn.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}