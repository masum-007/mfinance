'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'

export async function createSubscription(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  await prisma.subscription.create({
    data: {
      userId: user.id,
      name: formData.get('name') as string,
      amount: parseFloat(formData.get('amount') as string),
      billingCycle: formData.get('billingCycle') as string,
      nextDate: new Date(formData.get('nextDate') as string),
      accountId: formData.get('accountId') as string,
      categoryId: formData.get('categoryId') as string || null,
      isActive: true
    }
  })

  revalidatePath('/dashboard/subscriptions')
}

export async function toggleSubscription(id: string, currentStatus: boolean) {
  await prisma.subscription.update({
    where: { id },
    data: { isActive: !currentStatus }
  })
  revalidatePath('/dashboard/subscriptions')
}