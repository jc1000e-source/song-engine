import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') || '/dashboard'

  console.log('[Auth Callback] Full URL:', request.nextUrl.toString())
  console.log('[Auth Callback] Code:', code ? 'present' : 'missing')

  if (code) {
    try {
      const supabase = await createClient()
      console.log('[Auth Callback] Attempting to exchange code...')
      
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('[Auth Callback] Exchange failed:', error.message)
        return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(error.message)}`, request.url))
      }

      if (!data.session) {
        console.error('[Auth Callback] No session in response')
        return NextResponse.redirect(new URL('/login?error=No session', request.url))
      }

      console.log('[Auth Callback] Success! User:', data.session.user.email, 'Redirecting to:', next)
      
      // Redirect to next page - session is now stored in cookies
      return NextResponse.redirect(new URL(next, request.url))
    } catch (error) {
      console.error('[Auth Callback] Exception:', error)
      return NextResponse.redirect(new URL(`/login?error=Error`, request.url))
    }
  }

  // No code provided
  console.log('[Auth Callback] No code in URL')
  return NextResponse.redirect(new URL('/login?error=No code provided', request.url))
}
