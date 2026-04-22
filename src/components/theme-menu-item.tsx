'use client'

import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { useEffect, useState } from "react"

export function ThemeMenuItem() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    // Explicitly avoiding asChild to prevent the Shadcn error!
    <DropdownMenuItem 
      className="rounded-xl cursor-pointer p-0 outline-none"
      onClick={(e) => {
        e.preventDefault(); // Prevent menu from closing instantly if preferred
        setTheme(theme === 'dark' ? 'light' : 'dark');
      }}
    >
      <div className="flex w-full items-center p-3 font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors">
        {theme === 'dark' ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
        Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode
      </div>
    </DropdownMenuItem>
  )
}