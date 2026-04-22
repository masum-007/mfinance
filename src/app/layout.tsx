import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'

const jakarta = Plus_Jakarta_Sans({ 
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['400', '500', '600', '700', '800'], 
})

export const metadata = {
  title: 'MFinance | Dashboard',
  description: 'Modern personal finance operating system.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body 
        className={`${jakarta.variable} font-sans min-h-screen flex flex-col antialiased bg-[#F9FAFB] text-slate-900`} 
        suppressHydrationWarning
      >
        <ThemeProvider 
          attribute="class" 
          forcedTheme="light" 
          enableSystem={false} 
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}