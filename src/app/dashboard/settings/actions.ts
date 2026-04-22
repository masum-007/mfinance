'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'

export async function createCategory(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const name = formData.get('name') as string
  const type = formData.get('type') as 'INCOME' | 'EXPENSE'

  await prisma.category.create({
    data: {
      userId: user.id,
      name,
      type,
    }
  })

  revalidatePath('/dashboard/settings')
}

export async function deleteCategory(formData: FormData) {
  const id = formData.get('id') as string;
  if (!id) return;

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return;

  await prisma.category.delete({
    where: { id: id, userId: user.id }
  });

  revalidatePath('/dashboard/settings')
}