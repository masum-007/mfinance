import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { PieChart, ArrowRight, ShieldCheck, Zap, BarChart3 } from 'lucide-react'

export default async function LandingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // If user is already logged in, send them straight to the dashboard
  if (user) {
    redirect('/dashboard')
  }

  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900">
      {/* Navigation */}
      <header className="px-6 lg:px-12 h-20 flex items-center justify-between border-b border-slate-50">
        <div className="flex items-center gap-2 font-black text-2xl tracking-tighter text-primary">
          <div className="bg-primary text-white p-1.5 rounded-xl shadow-lg shadow-primary/20">
            <PieChart size={24} />
          </div>
          <span>MFinance</span>
        </div>
        <div className="flex gap-4">
          <Link href="/login">
            <Button variant="ghost" className="font-bold">Log in</Button>
          </Link>
          <Link href="/signup">
            <Button className="font-bold rounded-xl px-6 shadow-xl shadow-primary/20">Get Started</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="py-24 px-6 text-center max-w-4xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-primary text-xs font-black uppercase tracking-widest">
            <Zap size={14} />
            The Future of Finance Tracking
          </div>
          <h1 className="text-6xl md:text-7xl font-black tracking-tight leading-[0.9] text-slate-900">
            Master your money with <span className="text-primary">precision.</span>
          </h1>
          <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
            A beautiful, minimalist operating system for your personal finances. 
            Track accounts, manage debts, and hit your budget goals in one place.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/signup">
              <Button size="lg" className="h-14 px-8 rounded-2xl font-black text-lg gap-2 shadow-2xl shadow-primary/30">
                Start for Free <ArrowRight size={20} />
              </Button>
            </Link>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="py-20 bg-slate-50/50 border-y border-slate-100">
          <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 text-primary">
                <BarChart3 size={24} />
              </div>
              <h3 className="text-xl font-black tracking-tight">Smart Analytics</h3>
              <p className="text-slate-500 font-medium text-sm leading-relaxed">Visualize your spending trends and category breakdowns with beautiful, real-time charts.</p>
            </div>
            <div className="space-y-4">
              <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 text-emerald-500">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-xl font-black tracking-tight">Debt Tracking</h3>
              <p className="text-slate-500 font-medium text-sm leading-relaxed">Never lose track of what you owe or what others owe you with our robust lending engine.</p>
            </div>
            <div className="space-y-4">
              <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 text-indigo-500">
                <PieChart size={24} />
              </div>
              <h3 className="text-xl font-black tracking-tight">Budget Goals</h3>
              <p className="text-slate-500 font-medium text-sm leading-relaxed">Set monthly limits for categories and get visual alerts before you overspend.</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-slate-50 text-center">
        <p className="text-slate-400 font-bold text-sm tracking-tight">
          © 2026 MFinance Operating System. Built for financial freedom.
        </p>
      </footer>
    </div>
  )
}