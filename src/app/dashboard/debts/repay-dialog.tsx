'use client'

import { useState } from 'react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { repayDebt } from './actions'
import { CheckCircle2 } from 'lucide-react'

export function RepayDialog({ debtId, currentAmount, type }: { debtId: string, currentAmount: number, type: string }) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Removed asChild and styled the trigger directly */}
      <DialogTrigger className={`${buttonVariants({ variant: "outline", size: "sm" })} rounded-xl font-bold border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer`}>
        {type === 'Owe' ? 'Make Payment' : 'Record Receipt'}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px] p-8 bg-white rounded-3xl border-slate-100 shadow-2xl">
        <DialogHeader className="text-left mb-6">
          <DialogTitle className="text-2xl font-black text-slate-900">Record Transaction</DialogTitle>
        </DialogHeader>

        <form action={async (fd) => { 
          await repayDebt(debtId, Number(fd.get('amount'))); 
          setOpen(false); 
        }} className="space-y-6">
          <div className="space-y-2 text-left">
            <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Amount Paid</Label>
            <Input name="amount" type="number" step="0.01" max={currentAmount} defaultValue={currentAmount} className="h-14 rounded-xl border border-slate-200 bg-slate-50 font-black text-xl px-4" required />
          </div>
          <Button type="submit" className="w-full h-14 rounded-2xl font-black shadow-xl shadow-primary/20">
            <CheckCircle2 className="mr-2" /> Confirm Update
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}