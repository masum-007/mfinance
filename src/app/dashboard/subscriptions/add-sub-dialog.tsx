'use client'

import { useState } from 'react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { createSubscription } from './actions'
import { Plus, Repeat } from 'lucide-react'

export function AddSubscriptionDialog({ accounts, categories }: { accounts: any[], categories: any[] }) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className={`${buttonVariants({ variant: "default" })} rounded-full h-12 px-6 font-bold gap-2 shadow-lg shadow-primary/20 hover:scale-105 transition-all cursor-pointer`}>
        <Plus size={18} strokeWidth={3} />
        <span>Add Subscription</span>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[440px] p-6 sm:p-8 bg-white rounded-3xl sm:rounded-[2rem] border-slate-100 shadow-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-left mb-6 space-y-1.5">
          <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2">
            <Repeat size={20} />
          </div>
          <DialogTitle className="text-2xl font-black tracking-tight text-slate-900">New Subscription</DialogTitle>
          <DialogDescription className="text-slate-500 font-medium">Track a recurring monthly or yearly bill.</DialogDescription>
        </DialogHeader>

        <form action={async (fd) => { await createSubscription(fd); setOpen(false); }} className="space-y-5">
          <div className="flex flex-col gap-2 text-left">
            <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Service Name</Label>
            <Input name="name" placeholder="Netflix, Gym, Rent..." className="h-12 rounded-xl border border-slate-200 bg-slate-50 font-semibold px-4 focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary/10 transition-all" required />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="flex flex-col gap-2 text-left">
              <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</Label>
              <Input name="amount" type="number" step="0.01" className="h-12 rounded-xl border border-slate-200 bg-slate-50 font-semibold px-4 focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary/10 transition-all" placeholder="0.00" required />
            </div>
            <div className="flex flex-col gap-2 text-left">
              <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Cycle</Label>
              <select name="billingCycle" className="h-12 w-full px-4 rounded-xl border border-slate-200 bg-slate-50 font-semibold text-sm appearance-none outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all cursor-pointer">
                <option value="MONTHLY">Monthly</option>
                <option value="YEARLY">Yearly</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2 text-left">
              <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Account</Label>
              <select name="accountId" className="h-12 w-full px-4 rounded-xl border border-slate-200 bg-slate-50 font-semibold text-sm appearance-none outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all cursor-pointer" required>
                {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-2 text-left">
              <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Category</Label>
              <select name="categoryId" className="h-12 w-full px-4 rounded-xl border border-slate-200 bg-slate-50 font-semibold text-sm appearance-none outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all cursor-pointer" required>
                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-2 text-left">
            <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Next Billing Date</Label>
            <Input name="nextDate" type="date" className="h-12 rounded-xl border border-slate-200 bg-slate-50 font-semibold px-4 focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary/10 transition-all cursor-pointer" required />
          </div>

          <div className="pt-2">
            <Button type="submit" className="w-full h-14 rounded-2xl font-black shadow-xl shadow-primary/20 hover:scale-[1.01] transition-transform">
              Save Subscription
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}