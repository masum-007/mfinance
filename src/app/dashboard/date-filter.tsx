'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { CalendarDays } from 'lucide-react'

export function DateFilter() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentPeriod = searchParams.get('period') || 'all'

  const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams)
    params.set('period', e.target.value)
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="relative flex items-center">
      <CalendarDays className="absolute left-4 text-slate-400 z-10" size={16} />
      <select 
        value={currentPeriod}
        onChange={handlePeriodChange}
        className="h-12 pl-12 pr-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-sm font-bold text-slate-600 dark:text-slate-300 outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer appearance-none"
      >
        <option value="all">All Time</option>
        <option value="this_month">This Month</option>
        <option value="last_month">Last Month</option>
        <option value="ytd">Year to Date</option>
      </select>
    </div>
  )
}