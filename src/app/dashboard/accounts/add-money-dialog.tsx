'use client'

import { useState } from 'react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { addMoneyToAccount } from './actions'

export function AddMoneyDialog({ accountId, accountName }: { accountId: string, accountName: string }) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className={`${buttonVariants({ variant: "default", size: "sm" })} rounded-xl font-bold shadow-md cursor-pointer`}>
        + Add Money
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px] p-8 bg-white rounded-3xl border-slate-100 shadow-2xl">
        <DialogHeader className="text-left mb-6">
          <DialogTitle className="text-2xl font-black text-slate-900">Deposit to {accountName}</DialogTitle>
        </DialogHeader>

        <form action={async (fd) => {
          const amount = Number(fd.get('amount'))
          const note = fd.get('note') as string
          await addMoneyToAccount(accountId, amount, note);
          setOpen(false);
        }} className="space-y-6">
          
          <div className="space-y-2 text-left">
            <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Deposit Amount</Label>
            <Input name="amount" type="number" step="0.01" min="0.01" className="h-14 rounded-xl border border-slate-200 bg-slate-50 font-black text-xl px-4" required />
          </div>

          <div className="space-y-2 text-left">
            <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Source / Note</Label>
            <Input name="note" type="text" placeholder="e.g., Salary, ATM Deposit" className="h-14 rounded-xl border border-slate-200 bg-slate-50 px-4 font-medium" required />
          </div>

          <Button type="submit" className="w-full h-14 rounded-2xl font-black shadow-xl shadow-primary/20">
            Confirm Deposit
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}