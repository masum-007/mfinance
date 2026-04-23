"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Wallet, 
  ArrowRightLeft, 
  PieChart, 
  Landmark, 
  CalendarCheck, 
  Settings, 
  Menu
} from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/accounts', label: 'Accounts', icon: Wallet },
  { href: '/dashboard/transactions', label: 'Transactions', icon: ArrowRightLeft },
  { href: '/dashboard/budgets', label: 'Budgets', icon: PieChart },
  { href: '/dashboard/debts', label: 'Debts', icon: Landmark },
  { href: '/dashboard/subscriptions', label: 'Subscriptions', icon: CalendarCheck },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const NavLinks = () => (
    <nav className="space-y-2 mt-8">
      {navItems.map((item) => {
        const isActive = pathname === item.href
        const Icon = item.icon
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold transition-all duration-300 ${
              isActive
                ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/20'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Icon size={20} />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="hidden lg:flex flex-col w-[280px] fixed inset-y-0 left-0 border-r border-slate-200 bg-white p-6 z-20">
        <div className="flex items-center gap-2 font-black text-2xl tracking-tight text-slate-900 px-2 mb-4">
          <div className="bg-primary text-white p-1.5 rounded-lg shadow-md shadow-primary/20">
            <PieChart size={24} />
          </div>
          <span>MFinance</span>
        </div>
        <NavLinks />
      </aside>

      <div className="flex-1 lg:pl-[280px] flex flex-col min-h-screen w-full">
        <header className="lg:hidden flex items-center justify-between p-4 sm:p-6 bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-2 font-black text-xl tracking-tight text-slate-900">
            <div className="bg-primary text-white p-1.5 rounded-lg shadow-sm">
              <PieChart size={20} />
            </div>
            <span>MFinance</span>
          </div>

          <Sheet>
            {/* FIXED: Removed asChild and styled the SheetTrigger directly */}
            <SheetTrigger className="p-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors flex items-center justify-center">
              <Menu size={24} />
            </SheetTrigger>
            
            <SheetContent side="left" className="w-[280px] p-6 bg-white border-r-0">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <div className="flex items-center gap-2 font-black text-2xl tracking-tight text-slate-900 px-2 mb-4 mt-2">
                <div className="bg-primary text-white p-1.5 rounded-lg shadow-md shadow-primary/20">
                  <PieChart size={24} />
                </div>
                <span>MFinance</span>
              </div>
              <NavLinks />
            </SheetContent>
          </Sheet>
        </header>

        <main className="flex-1 p-4 sm:p-6 md:p-8 lg:p-10 w-full max-w-[1400px] mx-auto overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  )
}