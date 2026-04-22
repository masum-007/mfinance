import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css' // Keep this to load your Tailwind styles!

// 1. Configure the premium modern font
const jakarta = Plus_Jakarta_Sans({ 
  subsets: ['latin'],
  variable: '--font-sans',
  // Loading the specific weights we used throughout the UI
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
        // 2. Apply the font variable and the global font-sans class
        className={`${jakarta.variable} font-sans min-h-screen flex flex-col antialiased bg-[#F9FAFB]`}
        suppressHydrationWarning 
      >
        {children}
      </body>
    </html>
  )
}