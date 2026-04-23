import prisma from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createCategory, deleteCategory } from "./actions";
import {
  Trash2,
  Plus,
  Tags,
  User,
  Bell,
  CreditCard,
  ShieldCheck,
} from "lucide-react";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const categories = await prisma.category.findMany({
    where: { userId: user.id },
    orderBy: { name: "asc" },
  });

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20">
      {/* Header Section */}
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
        {/* Navigation Sidebar */}
        <div className="w-full md:w-64 shrink-0">
          {/* FIXED: Added !h-auto to override shadcn's h-10, added md:overflow-visible */}
          <TabsList className="flex flex-row md:flex-col items-start justify-start bg-transparent !h-auto w-full p-0 gap-2 overflow-x-auto md:overflow-visible no-scrollbar">
            {[
              { value: "categories", icon: Tags, label: "Categories" },
              { value: "profile", icon: User, label: "Account" },
              { value: "billing", icon: CreditCard, label: "Limits" },
              { value: "notifications", icon: Bell, label: "Alerts" },
            ].map((tab: any) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="w-full justify-start gap-3 px-4 py-3 rounded-2xl font-bold transition-all data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-primary text-slate-500 hover:text-slate-900 hover:bg-slate-100"
              >
                <tab.icon size={18} /> {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          <TabsContent value="categories" className="mt-0 focus-visible:ring-0">
            <div className="grid gap-8">
              {/* Quick Add Category Card */}
              <Card className="border border-slate-100 shadow-2xl shadow-slate-200/40 rounded-[2.5rem] bg-white overflow-hidden relative">
                {/* Subtle top gradient accent */}
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
                        Define a new bucket for your transactions.
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
                        <option value="EXPENSE">Expense</option>
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

              {/* Active Labels Grid */}
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 px-2">
                  Active Labels ({categories.length})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categories.map((cat: any) => (
                    <div
                      key={cat.id}
                      className="group relative flex items-center justify-between p-5 bg-white rounded-3xl shadow-sm border border-slate-100 hover:border-primary/30 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`h-12 w-12 flex items-center justify-center rounded-2xl font-black text-lg shadow-inner ${
                            cat.type === "INCOME"
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-rose-50 text-rose-600"
                          }`}
                        >
                          {cat.name[0]}
                        </div>
                        <div className="space-y-0.5">
                          <p className="font-bold text-slate-900 group-hover:text-primary transition-colors">
                            {cat.name}
                          </p>
                          <p
                            className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md w-fit ${
                              cat.type === "INCOME"
                                ? "bg-emerald-100/50 text-emerald-700"
                                : "bg-rose-100/50 text-rose-700"
                            }`}
                          >
                            {cat.type}
                          </p>
                        </div>
                      </div>
                      <form action={deleteCategory}>
                        <input type="hidden" name="id" value={cat.id} />
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

          {/* Profile Tab */}
          <TabsContent value="profile" className="mt-0">
            <Card className="border border-slate-100 shadow-2xl shadow-slate-200/40 rounded-[2.5rem] bg-white p-10 flex flex-col items-center text-center relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-32 bg-slate-50/50 border-b border-slate-100" />

              <div className="h-28 w-28 rounded-full bg-white shadow-xl flex items-center justify-center mb-6 relative z-10 border-4 border-white">
                <User size={48} className="text-slate-300" />
                <div className="absolute bottom-1 right-1 h-7 w-7 bg-emerald-500 border-4 border-white rounded-full flex items-center justify-center text-white">
                  <ShieldCheck size={12} strokeWidth={4} />
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
                    {new Date(
                      user.created_at || Date.now(),
                    ).toLocaleDateString()}
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

          {/* NEW: Limits & Billing Placeholder */}
          <TabsContent value="billing" className="mt-0">
            <Card className="border border-slate-100 shadow-2xl shadow-slate-200/40 rounded-[2.5rem] bg-white p-10 text-center">
              <CreditCard size={48} className="mx-auto text-slate-300 mb-4" />
              <h3 className="text-2xl font-black text-slate-900">
                Limits & Configuration
              </h3>
              <p className="text-slate-500 font-medium mt-2">
                Advanced financial limits and settings are coming in the next
                update.
              </p>
            </Card>
          </TabsContent>

          {/* NEW: Notifications Placeholder */}
          <TabsContent value="notifications" className="mt-0">
            <Card className="border border-slate-100 shadow-2xl shadow-slate-200/40 rounded-[2.5rem] bg-white p-10 text-center">
              <Bell size={48} className="mx-auto text-slate-300 mb-4" />
              <h3 className="text-2xl font-black text-slate-900">
                Alerts & Notifications
              </h3>
              <p className="text-slate-500 font-medium mt-2">
                Custom alerts for budgets and payments are coming in the next
                update.
              </p>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
