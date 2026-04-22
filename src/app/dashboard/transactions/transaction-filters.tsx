'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Search, Filter } from 'lucide-react'
import { useEffect, useState, useRef } from 'react'

export function TransactionFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [query, setQuery] = useState(searchParams.get('query') || '')
  const [type, setType] = useState(searchParams.get('type') || '')
  
  // Use a ref to prevent the effect from running on the initial mount
  const isMounted = useRef(false)

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true
      return
    }

    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      if (query) params.set('query', query)
      else params.delete('query')
      
      if (type) params.set('type', type)
      else params.delete('type')

      // scroll: false prevents the page from jumping when filtering
      router.push(`${pathname}?${params.toString()}`, { scroll: false })
    }, 300)

    return () => clearTimeout(timer)
  // WARNING: Deliberately excluding searchParams/router to prevent infinite loop lag!
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, type])

  return (
    // Fixed: top-16 locks it precisely beneath the header, bg-[#F9FAFB] hides scrolling items
    <div className="sticky top-16 z-30 py-4 bg-[#F9FAFB] flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <Input 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search notes, categories, or accounts..." 
          className="h-14 pl-12 rounded-2xl border-none shadow-sm bg-white font-bold focus-visible:ring-2 focus-visible:ring-primary/20 w-full transition-shadow" 
        />
      </div>
      <div className="flex shrink-0">
        <div className="relative w-full sm:w-auto">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10" size={16} />
          <select 
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="h-14 pl-12 pr-8 rounded-2xl bg-white border-none shadow-sm text-sm font-bold text-slate-600 outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer appearance-none w-full sm:w-auto"
          >
            <option value="">All Types</option>
            <option value="INCOME">Income Only</option>
            <option value="EXPENSE">Expenses Only</option>
          </select>
        </div>
      </div>
    </div>
  )
}