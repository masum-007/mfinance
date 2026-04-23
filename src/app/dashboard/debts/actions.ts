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

export async function repayDebt(debtId: string, accountId: string, amountToRepay: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // PRE-CHECK: Verify the account has enough money before starting the transaction
  const debtCheck = await prisma.debt.findUnique({ where: { id: debtId } })
  const accountCheck = await prisma.account.findUnique({ where: { id: accountId } })
  
  if (!debtCheck || !accountCheck) return { error: 'Record not found' }

  // If I owe money, I am paying from my account. Check if I have enough!
  if (debtCheck.type === 'Owe' && Number(accountCheck.balance) < amountToRepay) {
    return { error: `Insufficient funds. Your ${accountCheck.name} balance is only ${accountCheck.balance}.` }
  }

  // If the check passes, proceed with the transaction
  await prisma.$transaction(async (tx) => {
    const newAmount = Math.max(0, Number(debtCheck.remainingAmount) - amountToRepay)
    
    await tx.debt.update({
      where: { id: debtId },
      data: {
        remainingAmount: newAmount,
        status: newAmount === 0 ? 'SETTLED' : 'OPEN'
      }
    })

    if (debtCheck.type === 'Owe') {
      await tx.account.update({
        where: { id: accountId },
        data: { balance: Number(accountCheck.balance) - amountToRepay }
      })
      await tx.transaction.create({
        data: {
          userId: user.id,
          accountId: accountId,
          type: 'DEBT_REPAYMENT',
          amount: amountToRepay,
          note: `Repayment to ${debtCheck.counterpartyName}`,
          status: 'COMPLETED'
        }
      })
    } else {
      await tx.account.update({
        where: { id: accountId },
        data: { balance: Number(accountCheck.balance) + amountToRepay }
      })
      await tx.transaction.create({
        data: {
          userId: user.id,
          accountId: accountId,
          type: 'LOAN_COLLECTION',
          amount: amountToRepay,
          note: `Collected from ${debtCheck.counterpartyName}`,
          status: 'COMPLETED'
        }
      })
    }
  })

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/debts')
}