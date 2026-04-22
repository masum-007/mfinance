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
import { createDebtEntry } from './actions'
import { Plus, Handshake } from 'lucide-react'

export function AddDebtDialog({ accounts }: { accounts: any[] }) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className={`${buttonVariants({ variant: "default" })} rounded-full h-12 px-6 font-bold gap-2 shadow-lg shadow-primary/20 hover:scale-105 transition-all cursor-pointer`}>
        <Plus size={18} strokeWidth={3} />
        <span>Add Debt/Loan</span>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[440px] p-6 sm:p-8 bg-white rounded-3xl sm:rounded-[2rem] border-slate-100 shadow-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-left mb-6 space-y-1.5">
          <div className="h-10 w-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-2">
            <Handshake size={20} />
          </div>
          <DialogTitle className="text-2xl font-black tracking-tight text-slate-900">Debt Entry</DialogTitle>
          <DialogDescription className="text-slate-500 font-medium">Record a financial commitment.</DialogDescription>
        </DialogHeader>

        <form action={async (fd) => { await createDebtEntry(fd); setOpen(false); }} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
             <div className="flex flex-col gap-2">
              <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Agreement</Label>
              <select name="type" className="h-12 w-full px-4 rounded-xl border border-slate-200 bg-slate-50 font-semibold text-sm appearance-none outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all cursor-pointer">
                <option value="Owe">I Owe</option>
                <option value="Lent">Lent</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</Label>
              <Input name="amount" type="number" step="0.01" className="h-12 rounded-xl border border-slate-200 bg-slate-50 font-semibold px-4 focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary/10 transition-all" required />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Person</Label>
            <Input name="person" placeholder="Full Name" className="h-12 rounded-xl border border-slate-200 bg-slate-50 font-semibold px-4 focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary/10 transition-all" required />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="flex flex-col gap-2">
              <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Source</Label>
              <select name="accountId" className="h-12 w-full px-4 rounded-xl border border-slate-200 bg-slate-50 font-semibold text-sm appearance-none outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all cursor-pointer" required>
                <option value="" disabled selected>Select...</option>
                {accounts.map(acc => (
                  <option key={acc.id} value={acc.id}>{acc.name}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Due Date</Label>
              <Input name="dueDate" type="date" className="h-12 rounded-xl border border-slate-200 bg-slate-50 font-semibold px-4 focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary/10 transition-all cursor-pointer" />
            </div>
          </div>

          <div className="pt-2">
            <Button type="submit" className="w-full h-14 rounded-2xl text-lg font-black shadow-xl shadow-primary/20 hover:scale-[1.01] transition-transform">
              Register Entry
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}