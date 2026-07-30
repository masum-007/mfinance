"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import prisma from "@/lib/prisma"
import {
  isSupportedCurrency,
  isSupportedLocale,
  isSupportedTimeZone,
} from "@/lib/localization"

export async function createCategory(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  const name = String(formData.get("name") ?? "").trim()
  const type = formData.get("type") as "INCOME" | "EXPENSE"

  if (!name) {
    throw new Error("Category name is required")
  }

  await prisma.category.create({
    data: {
      userId: user.id,
      name,
      type,
    },
  })

  revalidatePath("/dashboard/settings")
}

export async function deleteCategory(formData: FormData) {
  const id = String(formData.get("id") ?? "")
  if (!id) return

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return

  await prisma.category.delete({
    where: { id, userId: user.id },
  })

  revalidatePath("/dashboard/settings")
}

export async function updateLocalization(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  const currency = String(formData.get("currency") ?? "")
  const locale = String(formData.get("locale") ?? "")
  const timeZone = String(formData.get("timeZone") ?? "")

  if (!isSupportedCurrency(currency)) {
    throw new Error("Unsupported currency")
  }

  if (!isSupportedLocale(locale)) {
    throw new Error("Unsupported locale")
  }

  if (!isSupportedTimeZone(timeZone)) {
    throw new Error("Unsupported time zone")
  }

  const { error } = await supabase.auth.updateUser({
    data: {
      ...(user.user_metadata ?? {}),
      defaultCurrency: currency,
      locale,
      timeZone,
    },
  })

  if (error) {
    throw new Error(error.message)
  }

  // Refresh all dashboard pages because money and dates appear everywhere.
  revalidatePath("/dashboard", "layout")
}
