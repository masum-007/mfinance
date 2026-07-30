import prisma from "@/lib/prisma"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  createCategory,
  deleteCategory,
  updateLocalization,
} from "./actions"
import {
  Trash2,
  Plus,
  Tags,
  User,
  Bell,
  CreditCard,
  ShieldCheck,
  AlertTriangle,
  CalendarClock,
  ArrowRight,
  Globe2,
  Save,
} from "lucide-react"
import {
  CURRENCY_OPTIONS,
  LOCALE_OPTIONS,
  TIME_ZONE_OPTIONS,
  formatCurrency,
  formatDate,
  getLocalizationPreferences,
} from "@/lib/localization"

export default async function SettingsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const preferences = getLocalizationPreferences(user)
  const now = new Date()
  const currentMonth = now.getMonth() + 1
  const currentYear = now.getFullYear()

  const [categories, budgets, subscriptions, debts] =
    await Promise.all([
      prisma.category.findMany({
        where: { userId: user.id },
        orderBy: { name: "asc" },
      }),
      prisma.budget.findMany({
        where: {
          userId: user.id,
          month: currentMonth,
          year: currentYear,
        },
        include: { category: true },
      }),
      prisma.subscription.findMany({
        where: {
          userId: user.id,
          isActive: true,
        },
        orderBy: { nextDate: "asc" },
        take: 5,
      }),
      prisma.debt.findMany({
        where: {
          userId: user.id,
          status: "OPEN",
        },
        orderBy: { dueDate: "asc" },
      }),
    ])

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black tracking-tighter text-slate-900">
          System Preferences
        </h1>
        <p className="text-slate-500 font-medium">
          Fine-tune your MFinance operating environment.
        </p>
      </div>

      <Tabs
        defaultValue="categories"
        className="flex flex-col md:flex-row gap-10"
      >
        <div className="w-full md:w-64 shrink-0">
          <TabsList className="flex flex-row md:flex-col items-start justify-start bg-transparent !h-auto w-full p-0 gap-2 overflow-x-auto md:overflow-visible no-scrollbar">
            {[
              {
                value: "categories",
                icon: Tags,
                label: "Categories",
              },
              {
                value: "profile",
                icon: User,
                label: "Account",
              },
              {
                value: "regional",
                icon: Globe2,
                label: "Regional",
              },
              {
                value: "limits",
                icon: CreditCard,
                label: "Active Limits",
              },
              {
                value: "alerts",
                icon: Bell,
                label: "System Alerts",
              },
            ].map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="w-full justify-start gap-3 px-4 py-3 rounded-2xl font-bold transition-all data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-primary text-slate-500 hover:text-slate-900 hover:bg-slate-100"
              >
                <tab.icon size={18} />
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <div className="flex-1">
          <TabsContent
            value="categories"
            className="mt-0 focus-visible:ring-0"
          >
            <div className="grid gap-8">
              <Card className="border border-slate-100 shadow-2xl shadow-slate-200/40 rounded-[2.5rem] bg-white overflow-hidden relative">
                <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-primary/40 to-primary/10" />

                <CardHeader className="p-8 pb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shadow-inner">
                      <Plus size={20} strokeWidth={3} />
                    </div>

                    <div>
                      <CardTitle className="text-xl font-black tracking-tight text-slate-900">
                        Quick Add Category
                      </CardTitle>
                      <CardDescription className="font-medium text-slate-500 mt-1">
                        Define a new bucket for your
                        transactions.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-8 pt-2">
                  <form
                    action={createCategory}
                    className="flex flex-col md:flex-row gap-5 items-end bg-slate-50/50 p-6 rounded-3xl border border-slate-100"
                  >
                    <div className="w-full space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">
                        Label Name
                      </Label>
                      <Input
                        name="name"
                        placeholder="e.g., DIU Tuition"
                        className="h-12 rounded-2xl border-slate-200 bg-white shadow-sm text-slate-900 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-primary/20"
                        required
                      />
                    </div>

                    <div className="w-full md:w-64 space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">
                        Flow Type
                      </Label>
                      <select
                        name="type"
                        className="flex h-12 w-full rounded-2xl border border-slate-200 bg-white shadow-sm px-4 py-2 text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer appearance-none"
                      >
                        <option value="EXPENSE">
                          Expense
                        </option>
                        <option value="INCOME">Income</option>
                      </select>
                    </div>

                    <Button
                      type="submit"
                      className="h-12 px-8 rounded-2xl font-black shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
                    >
                      Save Label
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 px-2">
                  Active Labels ({categories.length})
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      className="group relative flex items-center justify-between p-5 bg-white rounded-3xl shadow-sm border border-slate-100 hover:border-primary/30 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`h-12 w-12 flex items-center justify-center rounded-2xl font-black text-lg shadow-inner ${
                            category.type === "INCOME"
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-rose-50 text-rose-600"
                          }`}
                        >
                          {category.name[0]}
                        </div>

                        <div className="space-y-0.5">
                          <p className="font-bold text-slate-900 group-hover:text-primary transition-colors">
                            {category.name}
                          </p>
                          <p
                            className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md w-fit ${
                              category.type === "INCOME"
                                ? "bg-emerald-100/50 text-emerald-700"
                                : "bg-rose-100/50 text-rose-700"
                            }`}
                          >
                            {category.type}
                          </p>
                        </div>
                      </div>

                      <form action={deleteCategory}>
                        <input
                          type="hidden"
                          name="id"
                          value={category.id}
                        />
                        <Button
                          type="submit"
                          variant="ghost"
                          size="icon"
                          className="rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                        >
                          <Trash2 size={18} />
                        </Button>
                      </form>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="profile" className="mt-0">
            <Card className="border border-slate-100 shadow-2xl shadow-slate-200/40 rounded-[2.5rem] bg-white p-10 flex flex-col items-center text-center relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-32 bg-slate-50/50 border-b border-slate-100" />

              <div className="h-28 w-28 rounded-full bg-white shadow-xl flex items-center justify-center mb-6 relative z-10 border-4 border-white">
                <User
                  size={48}
                  className="text-slate-300"
                />
                <div className="absolute bottom-1 right-1 h-7 w-7 bg-emerald-500 border-4 border-white rounded-full flex items-center justify-center text-white">
                  <ShieldCheck
                    size={12}
                    strokeWidth={4}
                  />
                </div>
              </div>

              <h2 className="text-3xl font-black tracking-tight text-slate-900 relative z-10">
                {user.email}
              </h2>
              <p className="text-slate-500 font-bold mt-1 text-sm relative z-10">
                Verified Financial Identity
              </p>

              <div className="mt-10 w-full grid grid-cols-2 gap-4 relative z-10">
                <div className="text-left p-5 rounded-3xl bg-slate-50 border border-slate-100">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Member Since
                  </p>
                  <p className="font-bold text-slate-900 text-lg mt-1">
                    {formatDate(
                      user.created_at || now,
                      preferences,
                    )}
                  </p>
                </div>

                <div className="text-left p-5 rounded-3xl bg-primary/5 border border-primary/10">
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary/60">
                    Current Plan
                  </p>
                  <p className="font-black text-primary text-lg mt-1">
                    MFinance Pro
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="regional" className="mt-0">
            <Card className="border border-slate-100 shadow-2xl shadow-slate-200/40 rounded-[2.5rem] bg-white overflow-hidden">
              <CardHeader className="p-8 pb-4">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <Globe2 size={22} />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-black text-slate-900">
                      Currency & Regional Format
                    </CardTitle>
                    <CardDescription className="font-medium text-slate-500 mt-1">
                      Control how amounts and dates appear
                      throughout MFinance.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-8 pt-4">
                <form
                  action={updateLocalization}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                    <div className="space-y-2">
                      <Label
                        htmlFor="currency"
                        className="text-xs font-black uppercase tracking-wider text-slate-500"
                      >
                        Base Currency
                      </Label>
                      <select
                        id="currency"
                        name="currency"
                        defaultValue={preferences.currency}
                        className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-primary/20"
                      >
                        {CURRENCY_OPTIONS.map((option) => (
                          <option
                            key={option.value}
                            value={option.value}
                          >
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="locale"
                        className="text-xs font-black uppercase tracking-wider text-slate-500"
                      >
                        Number & Date Locale
                      </Label>
                      <select
                        id="locale"
                        name="locale"
                        defaultValue={preferences.locale}
                        className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-primary/20"
                      >
                        {LOCALE_OPTIONS.map((option) => (
                          <option
                            key={option.value}
                            value={option.value}
                          >
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="timeZone"
                        className="text-xs font-black uppercase tracking-wider text-slate-500"
                      >
                        Time Zone
                      </Label>
                      <select
                        id="timeZone"
                        name="timeZone"
                        defaultValue={preferences.timeZone}
                        className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-primary/20"
                      >
                        {TIME_ZONE_OPTIONS.map((option) => (
                          <option
                            key={option.value}
                            value={option.value}
                          >
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-slate-100 bg-slate-50 p-6">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                      Current Preview
                    </p>
                    <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-8">
                      <span className="text-2xl font-black text-slate-900">
                        {formatCurrency(
                          1234567.89,
                          preferences,
                        )}
                      </span>
                      <span className="text-sm font-bold text-slate-500">
                        {formatDate(now, preferences, {
                          dateStyle: "full",
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <p className="text-xs font-medium text-amber-700 bg-amber-50 border border-amber-100 rounded-2xl px-4 py-3">
                      Changing the currency changes labels and
                      formatting only. It does not perform foreign
                      exchange conversion.
                    </p>

                    <Button
                      type="submit"
                      className="h-12 px-6 rounded-2xl font-black gap-2 shadow-lg shadow-primary/20"
                    >
                      <Save size={17} />
                      Save Regional Settings
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="limits" className="mt-0">
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-indigo-50 p-6 rounded-[2rem] border border-indigo-100">
                <div>
                  <h3 className="text-xl font-black text-indigo-900">
                    Active Budgets
                  </h3>
                  <p className="text-sm font-medium text-indigo-600 mt-1">
                    Limits enforced for{" "}
                    {formatDate(now, preferences, {
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>

                <Link
                  href="/dashboard/budgets"
                  className="flex items-center gap-2 text-sm font-bold text-indigo-700 bg-white px-4 py-2 rounded-xl shadow-sm hover:scale-105 transition-transform"
                >
                  Manage <ArrowRight size={16} />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {budgets.length === 0 ? (
                  <p className="text-slate-500 font-medium p-4 col-span-2">
                    No active budgets found for this month.
                  </p>
                ) : (
                  budgets.map((budget) => (
                    <div
                      key={budget.id}
                      className="flex justify-between items-center p-5 bg-white border border-slate-100 rounded-3xl shadow-sm"
                    >
                      <span className="font-bold text-slate-700">
                        {budget.category.name}
                      </span>
                      <span className="font-black text-lg text-slate-900">
                        {formatCurrency(
                          budget.amount,
                          preferences,
                        )}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent
            value="alerts"
            className="mt-0 space-y-6"
          >
            <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                  <CalendarClock size={24} />
                </div>
                <h3 className="text-xl font-black text-slate-900">
                  Upcoming Bills
                </h3>
              </div>

              <div className="space-y-3">
                {subscriptions.length === 0 ? (
                  <p className="text-slate-500 font-medium text-sm">
                    No upcoming subscriptions.
                  </p>
                ) : (
                  subscriptions.map((subscription) => (
                    <div
                      key={subscription.id}
                      className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl"
                    >
                      <div>
                        <p className="font-bold text-slate-900">
                          {subscription.name}
                        </p>
                        <p className="text-xs font-bold text-slate-500 mt-0.5">
                          Renews:{" "}
                          {formatDate(
                            subscription.nextDate,
                            preferences,
                          )}
                        </p>
                      </div>

                      <span className="font-black text-rose-600">
                        -
                        {formatCurrency(
                          subscription.amount,
                          preferences,
                        )}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
                  <AlertTriangle size={24} />
                </div>
                <h3 className="text-xl font-black text-slate-900">
                  Open Debts Action Required
                </h3>
              </div>

              <div className="space-y-3">
                {debts.length === 0 ? (
                  <p className="text-slate-500 font-medium text-sm">
                    All debts are settled!
                  </p>
                ) : (
                  debts.map((debt) => (
                    <div
                      key={debt.id}
                      className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl"
                    >
                      <div>
                        <p className="font-bold text-slate-900">
                          {debt.type === "Owe"
                            ? "You owe"
                            : "Owed by"}{" "}
                          {debt.counterpartyName}
                        </p>
                        <p className="text-xs font-bold text-slate-500 mt-0.5">
                          Due:{" "}
                          {debt.dueDate
                            ? formatDate(
                                debt.dueDate,
                                preferences,
                              )
                            : "No date set"}
                        </p>
                      </div>

                      <span
                        className={`font-black ${
                          debt.type === "Owe"
                            ? "text-rose-600"
                            : "text-emerald-600"
                        }`}
                      >
                        {formatCurrency(
                          debt.remainingAmount,
                          preferences,
                        )}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
