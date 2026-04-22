'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'

export async function createAccount(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  const name = formData.get('name') as string
  const type = formData.get('type') as string
  const startingBalance = parseFloat(formData.get('balance') as string) || 0

  await prisma.account.create({
    data: {
      userId: user.id,
      name,
      type,
      balance: startingBalance,
    }
  })

  // Refresh the accounts page to show the new data
  revalidatePath('/dashboard/accounts')
}