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
  ShieldCheck,
  ChevronRight,
  Bell,
  Palette,
  CreditCard,
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
      {/* Header with Glassmorphism subtle touch */}
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
        {/* Responsive Side Navigation */}
        <div className="w-full md:w-64 shrink-0">
          <TabsList className="flex md:flex-col items-start justify-start bg-transparent h-auto w-full gap-2 overflow-x-auto no-scrollbar">
            <TabsTrigger
              value="categories"
              className="w-full justify-start gap-3 px-4 py-3 rounded-2xl font-bold transition-all data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-primary text-slate-500"
            >
              <Tags size={18} /> Categories
            </TabsTrigger>
            <TabsTrigger
              value="profile"
              className="w-full justify-start gap-3 px-4 py-3 rounded-2xl font-bold transition-all data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-primary text-slate-500"
            >
              <User size={18} /> Account
            </TabsTrigger>
            <TabsTrigger
              value="billing"
              className="w-full justify-start gap-3 px-4 py-3 rounded-2xl font-bold transition-all data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-primary text-slate-500"
            >
              <CreditCard size={18} /> Limits
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="w-full justify-start gap-3 px-4 py-3 rounded-2xl font-bold transition-all data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-primary text-slate-500"
            >
              <Bell size={18} /> Alerts
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          {/* CATEGORIES TAB */}
          <TabsContent value="categories" className="mt-0 focus-visible:ring-0">
            <div className="grid gap-8">
              {/* Add Category Bento Card */}
              <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[2.5rem] bg-gradient-to-br from-white to-slate-50 overflow-hidden">
                <CardHeader className="p-8 pb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                      <Plus size={18} />
                    </div>
                    <CardTitle className="text-xl font-black tracking-tight">
                      Quick Add Category
                    </CardTitle>
                  </div>
                  <CardDescription className="font-medium">
                    Define a new bucket for your transactions.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8 pt-0">
                  <form
                    action={createCategory}
                    className="flex flex-col md:flex-row gap-4 items-end"
                  >
                    <div className="w-full space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
                        Label Name
                      </Label>
                      <Input
                        name="name"
                        placeholder="e.g., DIU Tuition"
                        className="h-12 rounded-2xl border-none bg-white shadow-inner"
                        required
                      />
                    </div>
                    <div className="w-full md:w-64 space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
                        Flow Type
                      </Label>
                      <select
                        name="type"
                        className="flex h-12 w-full rounded-2xl border-none bg-white shadow-inner px-3 py-2 text-sm font-bold"
                      >
                        <option value="EXPENSE">Expense</option>
                        <option value="INCOME">Income</option>
                      </select>
                    </div>
                    <Button
                      type="submit"
                      className="h-12 px-8 rounded-2xl font-black shadow-xl shadow-primary/20 hover:scale-105 transition-transform"
                    >
                      Save
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Category Grid */}
              <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                    Active Labels ({categories.length})
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categories.map((cat) => (
                    <div
                      key={cat.id}
                      className="group relative flex items-center justify-between p-5 bg-white rounded-3xl shadow-sm border border-transparent hover:border-primary/20 hover:shadow-xl transition-all duration-300"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`h-12 w-12 flex items-center justify-center rounded-2xl font-black text-lg ${
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
                            className={`text-[9px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-full w-fit ${
                              cat.type === "INCOME"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-rose-100 text-rose-700"
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
                          className="rounded-xl text-slate-300 hover:text-rose-600 hover:bg-rose-50 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
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

          {/* PROFILE TAB */}
          <TabsContent value="profile" className="mt-0">
            <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white p-10 flex flex-col items-center text-center">
              <div className="h-24 w-24 rounded-full bg-slate-100 flex items-center justify-center mb-6 relative">
                <User size={40} className="text-slate-400" />
                <div className="absolute bottom-0 right-0 h-6 w-6 bg-emerald-500 border-4 border-white rounded-full" />
              </div>
              <h2 className="text-2xl font-black tracking-tight">
                {user.email}
              </h2>
              <p className="text-slate-500 font-medium mt-1">
                Verified Financial Identity
              </p>

              <div className="mt-8 pt-8 border-t w-full grid grid-cols-2 gap-4">
                <div className="text-left p-4 rounded-2xl bg-slate-50">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Member Since
                  </p>
                  <p className="font-bold text-slate-900">
                    {new Date(
                      user.created_at || Date.now(),
                    ).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-left p-4 rounded-2xl bg-slate-50">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Plan
                  </p>
                  <p className="font-bold text-primary">
                    Open Source Early Access
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
