"use client";

import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createTransaction } from "./actions";
import { Plus } from "lucide-react";

export function CreateTransactionDialog({
  accounts,
  categories,
}: {
  accounts: any[];
  categories: any[];
}) {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<"EXPENSE" | "INCOME">("EXPENSE");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className={`${buttonVariants({ variant: "default" })} rounded-full h-12 px-6 font-bold gap-2 shadow-lg shadow-primary/20 hover:scale-105 transition-all cursor-pointer`}
      >
        <Plus size={18} strokeWidth={3} />
        <span>New Entry</span>
      </DialogTrigger>
      {/* Styled directly on DialogContent for perfect corners */}
      <DialogContent className="sm:max-w-[440px] p-0 bg-white rounded-3xl border-slate-100 shadow-2xl overflow-hidden">
        {/* Header Section with dynamic background */}
        <div className={`p-6 sm:p-8 pb-6 transition-colors duration-500 ${type === 'EXPENSE' ? 'bg-rose-50/50' : 'bg-emerald-50/50'}`}>
          <DialogHeader className="text-left space-y-2">
            <DialogTitle className="text-2xl font-black text-slate-900 tracking-tight">
              Record Transaction
            </DialogTitle>
            <DialogDescription className="text-slate-500 font-medium">
              Enter the details of your latest financial activity.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form
          action={async (fd) => {
            const result = await createTransaction(fd);
            if (result?.error) {
              alert(result.error);
            } else {
              setOpen(false);
            }
          }}
          className="p-6 sm:p-8 pt-0 space-y-6"
        >
          {/* Custom Toggle Switch */}
          <div className="flex bg-slate-100 p-1 rounded-2xl relative">
            <div 
              className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-xl bg-white shadow-sm transition-all duration-300 ease-out ${type === 'INCOME' ? 'translate-x-full' : 'translate-x-0'}`} 
            />
            <button
              type="button"
              onClick={() => setType("EXPENSE")}
              className={`flex-1 py-3 text-sm font-black rounded-xl z-10 transition-colors ${type === 'EXPENSE' ? 'text-rose-600' : 'text-slate-400 hover:text-slate-600'}`}
            >
              EXPENSE
            </button>
            <button
              type="button"
              onClick={() => setType("INCOME")}
              className={`flex-1 py-3 text-sm font-black rounded-xl z-10 transition-colors ${type === 'INCOME' ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}
            >
              INCOME
            </button>
          </div>
          <input type="hidden" name="type" value={type} />

          <div className="space-y-5">
            {/* Amount Input */}
            <div className="flex flex-col gap-2">
              <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Amount
              </Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-black text-xl">$</span>
                <Input
                  name="amount"
                  type="number"
                  step="0.01"
                  className="h-14 pl-10 rounded-xl border border-slate-200 bg-slate-50 font-black text-2xl text-slate-900 focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary/10 transition-all"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            {/* Two Column Layout for Account & Category */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Account
                </Label>
                <select
                  name="accountId"
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 font-bold text-sm px-3 text-slate-700 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
                  required
                >
                  <option value="" disabled>
                    Select...
                  </option>
                  {accounts.map((acc: any) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Category
                </Label>
                <select
                  name="categoryId"
                  defaultValue=""
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 font-bold text-sm px-3 text-slate-700 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
                  required
                >
                  {/* 2. Remove the 'selected' attribute from this option */}
                  <option value="" disabled>
                    Select...
                  </option>
                  {categories.map((cat: any) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Reference Note
              </Label>
              <Input
                name="note"
                className="h-12 rounded-xl border border-slate-200 bg-slate-50 font-medium text-sm px-4 focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary/10 transition-all"
                placeholder="e.g., Groceries, Dinner..."
              />
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              className="w-full h-14 rounded-2xl text-lg font-black shadow-xl shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all"
            >
              Save Transaction
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}