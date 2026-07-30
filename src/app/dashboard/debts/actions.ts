"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import prisma from "@/lib/prisma"
import {
  formatCurrency,
  getLocalizationPreferences,
} from "@/lib/localization"

export async function createDebtEntry(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  const preferences = getLocalizationPreferences(user)
  const type = formData.get("type") as "Owe" | "Lent"
  const amount = Number(formData.get("amount"))
  const counterpartyName = String(formData.get("person") ?? "").trim()
  const accountId = String(formData.get("accountId") ?? "")
  const dueDate = String(formData.get("dueDate") ?? "")

  await prisma.$transaction(async (tx) => {
    await tx.debt.create({
      data: {
        userId: user.id,
        type,
        counterpartyName,
        amount,
        remainingAmount: amount,
        dueDate: dueDate ? new Date(dueDate) : null,
        status: "OPEN",
      },
    })

    const account = await tx.account.findUnique({
      where: { id: accountId },
    })

    if (!account) throw new Error("Account not found")

    const balanceAdjustment = type === "Owe" ? amount : -amount

    await tx.account.update({
      where: { id: accountId },
      data: { balance: Number(account.balance) + balanceAdjustment },
    })

    await tx.transaction.create({
      data: {
        userId: user.id,
        accountId,
        type: type === "Owe" ? "BORROW" : "LEND",
        amount,
        currency: preferences.currency,
        note: `${type === "Owe" ? "Borrowed from" : "Lent to"} ${counterpartyName}`,
        status: "COMPLETED",
      },
    })
  })

  revalidatePath("/dashboard")
  revalidatePath("/dashboard/accounts")
  revalidatePath("/dashboard/debts")
  revalidatePath("/dashboard/transactions")
}

export async function repayDebt(
  debtId: string,
  accountId: string,
  amountToRepay: number,
) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  const preferences = getLocalizationPreferences(user)

  const debtCheck = await prisma.debt.findUnique({
    where: { id: debtId },
  })
  const accountCheck = await prisma.account.findUnique({
    where: { id: accountId },
  })

  if (!debtCheck || !accountCheck) {
    return { error: "Record not found" }
  }

  if (
    debtCheck.type === "Owe" &&
    Number(accountCheck.balance) < amountToRepay
  ) {
    return {
      error: `Insufficient funds. Your ${accountCheck.name} balance is only ${formatCurrency(
        accountCheck.balance,
        preferences,
      )}.`,
    }
  }

  await prisma.$transaction(async (tx) => {
    const newAmount = Math.max(
      0,
      Number(debtCheck.remainingAmount) - amountToRepay,
    )

    await tx.debt.update({
      where: { id: debtId },
      data: {
        remainingAmount: newAmount,
        status: newAmount === 0 ? "SETTLED" : "OPEN",
      },
    })

    if (debtCheck.type === "Owe") {
      await tx.account.update({
        where: { id: accountId },
        data: { balance: Number(accountCheck.balance) - amountToRepay },
      })

      await tx.transaction.create({
        data: {
          userId: user.id,
          accountId,
          type: "DEBT_REPAYMENT",
          amount: amountToRepay,
          currency: preferences.currency,
          note: `Repayment to ${debtCheck.counterpartyName}`,
          status: "COMPLETED",
        },
      })
    } else {
      await tx.account.update({
        where: { id: accountId },
        data: { balance: Number(accountCheck.balance) + amountToRepay },
      })

      await tx.transaction.create({
        data: {
          userId: user.id,
          accountId,
          type: "LOAN_COLLECTION",
          amount: amountToRepay,
          currency: preferences.currency,
          note: `Collected from ${debtCheck.counterpartyName}`,
          status: "COMPLETED",
        },
      })
    }
  })

  revalidatePath("/dashboard")
  revalidatePath("/dashboard/accounts")
  revalidatePath("/dashboard/debts")
  revalidatePath("/dashboard/transactions")
}
