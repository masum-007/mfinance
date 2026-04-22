import Link from 'next/link'
import { PieChart, ArrowRight } from 'lucide-react'
import { signup } from '@/app/auth/actions'

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const resolvedParams = await searchParams;

  return (
    <div className="min-h-screen flex bg-[#F9FAFB] p-4 sm:p-6 lg:p-8">
      {/* Left Side - Premium Brand Panel (Hidden on smaller screens) */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 rounded-[3rem] p-12 flex-col justify-between relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-[120px] pointer-events-none translate-x-20 -translate-y-20" />
        
        <div className="relative z-10 flex items-center gap-3 font-bold text-2xl tracking-tight text-white">
          <div className="bg-white text-slate-900 p-2 rounded-xl shadow-md">
            <PieChart size={24} />
          </div>
          <span>MFinance</span>
        </div>
        
        <div className="relative z-10">
          <h1 className="text-5xl lg:text-6xl font-black text-white tracking-tighter leading-tight mb-6">
            Start your journey to financial clarity.
          </h1>
          <p className="text-lg text-slate-400 font-medium max-w-md">
            Join MFinance today to take absolute control over your money, budgets, and future goals.
          </p>
        </div>
      </div>

      {/* Right Side - Interactive Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-12">
        <div className="w-full max-w-md space-y-10">
          {/* Mobile Branding */}
          <div className="lg:hidden flex items-center justify-center gap-3 font-black text-3xl tracking-tight text-slate-900 mb-10">
            <div className="bg-primary text-white p-2 rounded-xl shadow-md">
              <PieChart size={28} />
            </div>
            <span>MFinance</span>
          </div>

          <div className="space-y-2 text-center lg:text-left">
            <h2 className="text-4xl font-black tracking-tighter text-slate-900">Create Account</h2>
            <p className="text-slate-500 font-medium">Set up your profile to initialize your dashboard.</p>
          </div>

          <form action={signup} className="space-y-5">
            {/* Elegant Error Display */}
            {resolvedParams?.error && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 text-sm font-bold text-rose-600 shadow-sm flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                {resolvedParams.error}
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="name" className="text-[11px] font-black uppercase tracking-widest text-slate-500 ml-1">Full Name</label>
              <input 
                id="name" 
                name="name" 
                type="text" 
                placeholder="John Doe" 
                required 
                className="h-14 w-full px-5 rounded-2xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-[11px] font-black uppercase tracking-widest text-slate-500 ml-1">Email Address</label>
              <input 
                id="email" 
                name="email" 
                type="email" 
                placeholder="john.doe@example.com" 
                required 
                className="h-14 w-full px-5 rounded-2xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-[11px] font-black uppercase tracking-widest text-slate-500 ml-1">Password</label>
              <input 
                id="password" 
                name="password" 
                type="password" 
                placeholder="••••••••" 
                required 
                className="h-14 w-full px-5 rounded-2xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
            
            <button type="submit" className="h-14 w-full rounded-2xl bg-primary text-white font-black flex items-center justify-center gap-2 shadow-xl shadow-primary/20 hover:-translate-y-0.5 hover:shadow-2xl transition-all cursor-pointer mt-4">
              Initialize Dashboard <ArrowRight size={18} />
            </button>
          </form>

          <p className="text-center text-sm font-bold text-slate-500">
            Already have an account?{' '}
            <Link href="/login" className="text-primary hover:underline decoration-2 underline-offset-4">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}