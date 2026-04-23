import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  // HARDCODED BYPASS: This guarantees Vercel cannot break the strings
  const supabaseUrl = "https://csszmtelqvispxrunqkv.supabase.co"
  const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzc3ptdGVscXZpc3B4cnVucWt2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4NDY3MjcsImV4cCI6MjA5MjQyMjcyN30.642UeEpHC7oa6eSsZYiQQvPUC9lFUCtrgVvTZV-QE94"

  return createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch (error) {
            // Next.js throws an error if setting cookies outside of Server Actions. Safe to ignore here.
          }
        },
      },
    }
  )
}