'use client'

import { useState } from 'react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { createTransaction } from './actions'
import { Plus } from 'lucide-react'

export function CreateTransactionDialog({ accounts, categories }: { accounts: any[], categories: any[] }) {
  const [open, setOpen] = useState(false)
  const [type, setType] = useState<'EXPENSE' | 'INCOME'>('EXPENSE')

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className={`${buttonVariants({ variant: "default" })} rounded-full h-12 px-6 font-bold gap-2 shadow-lg shadow-primary/20 hover:scale-105 transition-all cursor-pointer`}>
        <Plus size={18} strokeWidth={3} />
        <span>New Entry</span>
      </DialogTrigger>
      {/* Styled directly on DialogContent for perfect corners */}
      <DialogContent className="sm:max-w-[440px] p-6 sm:p-8 bg-white rounded-3xl sm:rounded-[2rem] border-slate-100 shadow-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-left mb-6 space-y-1.5">
          <DialogTitle className="text-2xl font-black tracking-tight text-slate-900">Record Transaction</DialogTitle>
          <DialogDescription className="text-slate-500 font-medium">Log your daily income or spending.</DialogDescription>
        </DialogHeader>

        <form action={async (fd) => { await createTransaction(fd); setOpen(false); }} className="space-y-6">
          <div className="flex p-1 bg-slate-100 rounded-2xl w-fit">
            <button
              type="button"
              onClick={() => setType('EXPENSE')}
              className={`px-6 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${type === 'EXPENSE' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => setType('INCOME')}
              className={`px-6 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${type === 'INCOME' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Income
            </button>
            <input type="hidden" name="type" value={type} />
          </div>

          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</Label>
              <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-100 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10 transition-all">
                  <span className="text-xl font-black text-slate-400 pl-2">$</span>
                  <Input name="amount" type="number" step="0.01" className="text-2xl font-black border-none bg-transparent shadow-none focus-visible:ring-0 p-0 h-10 w-full" placeholder="0.00" required />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Account</Label>
                <select name="accountId" className="h-12 w-full px-4 rounded-xl border border-slate-200 bg-slate-50 font-semibold text-sm appearance-none outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all cursor-pointer" required>
                  <option value="" disabled selected>Select...</option>
                  {accounts.map(acc => (
                    <option key={acc.id} value={acc.id}>{acc.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Category</Label>
                <select name="categoryId" className="h-12 w-full px-4 rounded-xl border border-slate-200 bg-slate-50 font-semibold text-sm appearance-none outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all cursor-pointer" required>
                  <option value="" disabled selected>Select...</option>
                  {categories.filter(c => c.type === type).map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Reference Note</Label>
              <Input name="note" className="h-12 rounded-xl border border-slate-200 bg-slate-50 font-medium text-sm px-4 focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary/10 transition-all" placeholder="e.g., Groceries, Dinner..." />
            </div>
          </div>

          <div className="pt-2">
            <Button type="submit" className="w-full h-14 rounded-2xl text-lg font-black shadow-xl shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all">
              Save Transaction
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}