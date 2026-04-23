'use client'

import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import { deleteAccount } from './actions'

export function DeleteAccountButton({ accountId, accountName }: { accountId: string, accountName: string }) {
  return (
    <form action={async () => {
      if (window.confirm(`Are you sure you want to delete ${accountName}? WARNING: This will permanently delete all transactions associated with this account.`)) {
        await deleteAccount(accountId)
      }
    }}>
      <Button 
        type="submit" 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8 text-slate-400 hover:text-rose-600 hover:bg-rose-100 transition-colors rounded-full shadow-sm"
        title="Delete Account"
      >
        <Trash2 size={16} strokeWidth={2.5} />
      </Button>
    </form>
  )
}