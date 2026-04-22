'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { setBudgetLimit } from './actions'
import { Settings2 } from 'lucide-react'

export function SetBudgetDialog({ categoryId, currentLimit, month, year }: { categoryId: string, currentLimit: number, month: number, year: number }) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Removed asChild and styled the trigger directly */}
      <DialogTrigger className="text-slate-400 hover:text-primary transition-colors p-2 rounded-lg hover:bg-slate-50 cursor-pointer">
        <Settings2 size={18} />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[360px] p-8 bg-white rounded-3xl border-slate-100 shadow-2xl">
        <DialogHeader className="text-left mb-6">
          <DialogTitle className="text-xl font-black text-slate-900">Set Monthly Target</DialogTitle>
        </DialogHeader>

        <form action={async (fd) => { 
          await setBudgetLimit(categoryId, Number(fd.get('amount')), month, year); 
          setOpen(false); 
        }} className="space-y-6">
          <Input name="amount" type="number" step="0.01" defaultValue={currentLimit || ''} placeholder="0.00" className="h-14 rounded-xl border border-slate-200 bg-slate-50 font-black text-2xl text-center" required />
          <Button type="submit" className="w-full h-12 rounded-xl font-black shadow-lg shadow-primary/20">
            Save Target
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}