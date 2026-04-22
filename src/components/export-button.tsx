'use client'

import { Download } from 'lucide-react'
import { Button } from './ui/button'

export function ExportButton({ data, filename }: { data: any[], filename: string }) {
  const handleExport = () => {
    if (!data || data.length === 0) return alert('No data to export.')

    // Get headers
    const headers = Object.keys(data[0]).join(',')
    
    // Map rows
    const rows = data.map(obj => 
      Object.values(obj).map(val => `"${String(val).replace(/"/g, '""')}"`).join(',')
    ).join('\n')

    const csvContent = `${headers}\n${rows}`
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    
    link.href = URL.createObjectURL(blob)
    link.setAttribute('download', `${filename}-${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Button onClick={handleExport} variant="outline" className="rounded-2xl font-bold gap-2 h-12 shadow-sm dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800">
      <Download size={18} />
      <span className="hidden sm:inline">Export CSV</span>
    </Button>
  )
}