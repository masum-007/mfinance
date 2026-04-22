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
  if (!amount || amount <= 0) throw new Error('Invalid amount')
  if (!accountId) throw new Error('Account is required')

  // We use prisma.$transaction to ensure the account balance updates 
  // at the EXACT same time the transaction is recorded.
  await prisma.$transaction(async (tx: any) => {
    // 1. Fetch the current account to ensure it exists and belongs to the user
    const account = await tx.account.findFirst({
      where: { id: accountId, userId: user.id }
    })

    if (!account) throw new Error('Account not found')

    // 2. Calculate the new balance
    const balanceChange = type === 'EXPENSE' ? -amount : amount
    const newBalance = Number(account.balance) + balanceChange

    // 3. Update the account balance
    await tx.account.update({
      where: { id: accountId },
      data: { balance: newBalance }
    })

    // 4. Create the transaction record
    await tx.transaction.create({
      data: {
        userId: user.id,
        accountId: accountId,
        categoryId: categoryId,
        type: type,
        amount: amount,
        note: note,
        status: 'COMPLETED'
      }
    })
  })

  revalidatePath('/dashboard/accounts')
  revalidatePath('/dashboard/transactions')
  revalidatePath('/dashboard')
}