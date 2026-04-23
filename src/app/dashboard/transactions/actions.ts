'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'

export async function createTransaction(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  const type = formData.get('type') as 'INCOME' | 'EXPENSE'
  const amount = parseFloat(formData.get('amount') as string)
  const accountId = formData.get('accountId') as string
  const note = formData.get('note') as string
  const categoryId = formData.get('categoryId') as string;
  
  // Validation
  if (!amount || amount <= 0) return { error: 'Invalid amount' }
  if (!accountId) return { error: 'Account is required' }

  // PRE-CHECK: Verify the account exists and check the balance
  const accountCheck = await prisma.account.findFirst({
    where: { id: accountId, userId: user.id }
  })

  if (!accountCheck) return { error: 'Account not found' }

  // OVERDRAFT PROTECTION: Reject if spending more than available
  if (type === 'EXPENSE' && Number(accountCheck.balance) < amount) {
    return { error: `Insufficient funds. Your ${accountCheck.name} balance is only ${accountCheck.balance}.` }
  }

  // We use prisma.$transaction to ensure the account balance updates 
  // at the EXACT same time the transaction is recorded.
  await prisma.$transaction(async (tx: any) => {
    // 1. Calculate the new balance
    const balanceChange = type === 'EXPENSE' ? -amount : amount
    const newBalance = Number(accountCheck.balance) + balanceChange

    // 2. Update the account balance
    await tx.account.update({
      where: { id: accountId },
      data: { balance: newBalance }
    })

    // 3. Create the transaction record
    await tx.transaction.create({
      data: {
        userId: user.id,
        accountId: accountId,
        categoryId: categoryId || null, // Ensure empty strings become null
        type: type,
        amount: amount,
        note: note || '',
        status: 'COMPLETED'
      }
    })
  })

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/transactions')
}