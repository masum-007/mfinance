"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import prisma from "@/lib/prisma"
import {
  formatCurrency,
  getLocalizationPreferences,
} from "@/lib/localization"

export async function createTransaction(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  const preferences = getLocalizationPreferences(user)
  const type = formData.get("type") as "INCOME" | "EXPENSE"
  const amount = Number(formData.get("amount"))
  const accountId = String(formData.get("accountId") ?? "")
  const note = String(formData.get("note") ?? "").trim()
  const categoryId = String(formData.get("categoryId") ?? "")

  if (!Number.isFinite(amount) || amount <= 0) {
    return { error: "Invalid amount" }
  }

  if (!accountId) {
    return { error: "Account is required" }
  }

  const accountCheck = await prisma.account.findFirst({
    where: { id: accountId, userId: user.id },
  })

  if (!accountCheck) {
    return { error: "Account not found" }
  }

  if (type === "EXPENSE" && Number(accountCheck.balance) < amount) {
    return {
      error: `Insufficient funds. Your ${accountCheck.name} balance is only ${formatCurrency(
        accountCheck.balance,
        preferences,
      )}.`,
    }
  }

  await prisma.$transaction(async (tx) => {
    const balanceChange = type === "EXPENSE" ? -amount : amount
    const newBalance = Number(accountCheck.balance) + balanceChange

    await tx.account.update({
      where: { id: accountId },
      data: { balance: newBalance },
    })

    await tx.transaction.create({
      data: {
        userId: user.id,
        accountId,
        categoryId: categoryId || null,
        type,
        amount,
        currency: preferences.currency,
        note,
        status: "COMPLETED",
      },
    })
  })

  revalidatePath("/dashboard")
  revalidatePath("/dashboard/accounts")
  revalidatePath("/dashboard/budgets")
  revalidatePath("/dashboard/transactions")
}
