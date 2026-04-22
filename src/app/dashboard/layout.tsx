import Link from 'next/link'
import { 
  Home, CreditCard, ArrowRightLeft, HandCoins, 
  PieChart, Settings, Target, LogOut, UserCircle, Repeat 
} from 'lucide-react'
import { logout } from './actions'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup, // <-- Imported the Group wrapper to fix the Base UI error
} from "@/components/ui/dropdown-menu"
import { createClient } from '@/lib/supabase/server'

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: Home },
  { label: 'Accounts', href: '/dashboard/accounts', icon: CreditCard },
  { label: 'Transactions', href: '/dashboard/transactions', icon: ArrowRightLeft },
  { label: 'Budgets', href: '/dashboard/budgets', icon: Target },
  { label: 'Debts & Loans', href: '/dashboard/debts', icon: HandCoins },
  { label: 'Subscriptions', href: '/dashboard/subscriptions', icon: Repeat },
]

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="flex min-h-screen bg-[#F9FAFB]">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-white hidden md:flex flex-col sticky top-0 h-screen">
        <div className="h-16 flex items-center px-6 border-b">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-primary">
            <div className="bg-primary text-white p-1.5 rounded-lg shadow-md shadow-primary/20">
              <PieChart size={20} />
            </div>
            <span>MFinance</span>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link 
              key={item.href}
              href={item.href} 
              className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold rounded-xl transition-all duration-200 text-slate-500 hover:bg-slate-50 hover:text-primary group"
            >
              <item.icon size={18} className="group-hover:scale-110 transition-transform" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t space-y-1">
          <Link href="/dashboard/settings" className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold rounded-xl text-slate-500 hover:bg-slate-50 transition-colors">
            <Settings size={18} />
            Settings
          </Link>
          
          <form action={logout}>
            <button type="submit" className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold rounded-xl text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer">
              <LogOut size={18} />
              Logout
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b bg-white/80 backdrop-blur-xl sticky top-0 z-40 flex items-center justify-between px-8">
          <div className="md:hidden font-black text-primary flex items-center gap-2">
            <PieChart size={20} /> MFinance
          </div>
          
          <div className="flex items-center gap-4 ml-auto">
            <DropdownMenu>
              <DropdownMenuTrigger className="outline-none h-10 w-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors cursor-pointer shadow-sm">
                <UserCircle size={22} />
              </DropdownMenuTrigger>
              
              <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 border-slate-100 shadow-2xl bg-white mt-1">
                
                {/* Fix: Wrapped the Label in a Group to satisfy Base UI context */}
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="font-bold text-slate-900 truncate">
                    {user?.email || 'My Account'}
                  </DropdownMenuLabel>
                </DropdownMenuGroup>

                <DropdownMenuSeparator className="bg-slate-100" />
                
                <DropdownMenuItem className="rounded-xl cursor-pointer p-0">
                  <Link href="/dashboard/settings" className="flex items-center w-full p-3 font-bold text-slate-600 hover:bg-slate-50 outline-none rounded-xl">
                    <Settings className="mr-2 h-4 w-4" /> System Settings
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator className="bg-slate-100" />
                
                <form action={logout}>
                  <DropdownMenuItem className="rounded-xl p-0">
                    <button type="submit" className="flex w-full items-center p-3 cursor-pointer font-bold text-rose-600 hover:bg-rose-50 outline-none rounded-xl">
                      <LogOut className="mr-2 h-4 w-4" /> Secure Logout
                    </button>
                  </DropdownMenuItem>
                </form>

              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        
        <main className="p-6 lg:p-10 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  )
}