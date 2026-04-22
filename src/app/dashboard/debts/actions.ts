'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'

export async function createDebtEntry(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const type = formData.get('type') as 'Owe' | 'Lent'
  const amount = parseFloat(formData.get('amount') as string)
  const counterpartyName = formData.get('person') as string
  const accountId = formData.get('accountId') as string
  const dueDate = formData.get('dueDate') as string

  await prisma.$transaction(async (tx: any) => {
    // 1. Create the Debt record
    await tx.debt.create({
      data: {
        userId: user.id,
        type,
        counterpartyName,
        amount,
        remainingAmount: amount,
        dueDate: dueDate ? new Date(dueDate) : null,
        status: 'OPEN'
      }
    })

    // 2. Adjust the Account Balance 
    const account = await tx.account.findUnique({ where: { id: accountId } })
    if (!account) throw new Error('Account not found')

    // If I borrow (Owe), my cash goes UP. If I lend (Lent), my cash goes DOWN.
    const balanceAdjustment = type === 'Owe' ? amount : -amount
    
    await tx.account.update({
      where: { id: accountId },
      data: { balance: Number(account.balance) + balanceAdjustment }
    })

    // 3. Log it in Transactions for the audit trail [cite: 204-211]
    await tx.transaction.create({
      data: {
        userId: user.id,
        accountId,
        type: type === 'Owe' ? 'BORROW' : 'LEND',
        amount,
        note: `${type === 'Owe' ? 'Borrowed from' : 'Lent to'} ${counterpartyName}`,
        status: 'COMPLETED'
      }
    })
  })

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/debts')
}

export async function repayDebt(debtId: string, amountToRepay: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const debt = await prisma.debt.findUnique({ where: { id: debtId } })
  if (!debt) throw new Error('Debt not found')

  const newAmount = Math.max(0, Number(debt.remainingAmount) - amountToRepay)
  
  await prisma.debt.update({
    where: { id: debtId },
    data: {
      remainingAmount: newAmount,
      status: newAmount === 0 ? 'CLOSED' : 'OPEN'
    }
  })

  revalidatePath('/dashboard/debts')
}