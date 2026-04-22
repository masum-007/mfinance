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
import { createAccount } from './actions'
import { Plus, CreditCard } from 'lucide-react'

export function CreateAccountDialog() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className={`${buttonVariants({ variant: "default" })} rounded-full h-12 px-6 font-bold gap-2 shadow-lg shadow-primary/20 hover:scale-105 transition-all cursor-pointer`}>
        <Plus size={18} strokeWidth={3} />
        <span>Add Account</span>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px] p-6 sm:p-8 bg-white rounded-3xl sm:rounded-[2rem] border-slate-100 shadow-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-left mb-6 space-y-1.5">
          <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-2">
            <CreditCard size={20} />
          </div>
          <DialogTitle className="text-2xl font-black tracking-tight text-slate-900">New Account</DialogTitle>
          <DialogDescription className="text-slate-500 font-medium">Add a source of funds.</DialogDescription>
        </DialogHeader>

        <form action={async (fd) => { await createAccount(fd); setOpen(false); }} className="space-y-5">
          <div className="flex flex-col gap-2">
            <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Account Name</Label>
            <Input name="name" placeholder="e.g., bKash, Dutch-Bangla Bank" className="h-12 rounded-xl border border-slate-200 bg-slate-50 font-semibold px-4 focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary/10 transition-all" required />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="flex flex-col gap-2">
              <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Type</Label>
              <select name="type" className="h-12 w-full px-4 rounded-xl border border-slate-200 bg-slate-50 font-semibold text-sm appearance-none outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all cursor-pointer">
                <option value="bank">Bank</option>
                <option value="mobile">MFS</option>
                <option value="wallet">Cash</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Balance</Label>
              <Input name="balance" type="number" step="0.01" className="h-12 rounded-xl border border-slate-200 bg-slate-50 font-semibold px-4 focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary/10 transition-all" placeholder="0.00" required />
            </div>
          </div>

          <div className="pt-2">
            <Button type="submit" className="w-full h-14 rounded-2xl font-black shadow-xl shadow-primary/20 hover:scale-[1.01] transition-transform">
              Create Account
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}