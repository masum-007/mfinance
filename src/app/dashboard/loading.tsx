import { Loader2 } from "lucide-react"

export default function DashboardLoading() {
  return (
    <div className="h-[60vh] w-full flex flex-col items-center justify-center gap-4 animate-in fade-in duration-500">
      <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
      <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Loading Data...</p>
    </div>
  )
}