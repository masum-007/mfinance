'use client'

import { useState } from 'react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { repayDebt } from './actions'
import { CheckCircle2 } from 'lucide-react'

// Added accounts prop to populate the dropdown
export function RepayDialog({ 
  debtId, 
  currentAmount, 
  type, 
  accounts 
}: { 
  debtId: string, 
  currentAmount: number, 
  type: string, 
  accounts: { id: string, name: string }[] 
}) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className={`${buttonVariants({ variant: "outline", size: "sm" })} rounded-xl font-bold border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer`}>
        {type === 'Owe' ? 'Make Payment' : 'Record Receipt'}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px] p-8 bg-white rounded-3xl border-slate-100 shadow-2xl">
        <DialogHeader className="text-left mb-6">
          <DialogTitle className="text-2xl font-black text-slate-900">Record Transaction</DialogTitle>
        </DialogHeader>

        <form action={async (fd) => { 
          const amount = Number(fd.get('amount'))
          const accountId = fd.get('accountId') as string
          
          // Capture the result to see if an error was returned
          const result = await repayDebt(debtId, accountId, amount); 
          
          if (result?.error) {
            alert(result.error); // Pops up an alert if balance is too low
          } else {
            setOpen(false); // Only close the dialog if successful
          }
        }} className="space-y-6">
          
          {/* Added Account Selection Dropdown */}
          <div className="space-y-2 text-left">
            <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {type === 'Owe' ? 'Pay From Account' : 'Receive Into Account'}
            </Label>
            <select name="accountId" className="w-full h-14 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-700 px-4" required>
              <option value="">Select Account...</option>
              {accounts.map(acc => (
                <option key={acc.id} value={acc.id}>{acc.name}</option>
              ))}
            </select>
          </div>

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