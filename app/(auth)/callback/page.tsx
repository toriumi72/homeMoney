import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function AuthCallback({
  searchParams,
}: {
  searchParams: Promise<{ code?: string; error?: string }>
}) {
  const params = await searchParams
  const { code, error } = params

  if (error) {
    console.error('Auth callback error:', error)
    redirect('/auth?error=' + encodeURIComponent(error))
  }

  if (code) {
    const supabase = await createClient()
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
    
    if (exchangeError) {
      console.error('Code exchange error:', exchangeError)
      redirect('/auth?error=' + encodeURIComponent(exchangeError.message))
    }
  }

  redirect('/dashboard')
} 