"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import prisma from "@/lib/prisma"
import { getLocalizationPreferences } from "@/lib/localization"

export async function createAccount(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  const name = String(formData.get("name") ?? "").trim()
  const type = String(formData.get("type") ?? "")
  const startingBalance = Number(formData.get("balance")) || 0

  await prisma.account.create({
    data: {
      userId: user.id,
      name,
      type,
      balance: startingBalance,
    },
  })

  revalidatePath("/dashboard")
  revalidatePath("/dashboard/accounts")
}

export async function addMoneyToAccount(
  accountId: string,
  amount: number,
  note: string,
) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  const preferences = getLocalizationPreferences(user)

  await prisma.$transaction(async (tx) => {
    await tx.account.update({
      where: { id: accountId },
      data: { balance: { increment: amount } },
    })

    await tx.transaction.create({
      data: {
        userId: user.id,
        accountId,
        type: "ADJUSTMENT",
        amount,
        currency: preferences.currency,
        note: note || "Manual Deposit",
        status: "COMPLETED",
      },
    })
  })

  revalidatePath("/dashboard")
  revalidatePath("/dashboard/accounts")
  revalidatePath("/dashboard/transactions")
}

export async function deleteAccount(accountId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  await prisma.$transaction(async (tx) => {
    await tx.transaction.deleteMany({
      where: { accountId, userId: user.id },
    })

    await tx.subscription.deleteMany({
      where: { accountId, userId: user.id },
    })

    await tx.account.delete({
      where: { id: accountId, userId: user.id },
    })
  })

  revalidatePath("/dashboard")
  revalidatePath("/dashboard/accounts")
}
