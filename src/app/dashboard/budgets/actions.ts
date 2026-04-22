'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'

export async function setBudgetLimit(categoryId: string, amount: number, month: number, year: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Create or Update the budget
  const existing = await prisma.budget.findFirst({
    where: { userId: user.id, categoryId, month, year }
  })

  if (existing) {
    await prisma.budget.update({
      where: { id: existing.id },
      data: { amount }
    })
  } else {
    await prisma.budget.create({
      data: { userId: user.id, categoryId, amount, month, year }
    })
  }

  revalidatePath('/dashboard/budgets')
}