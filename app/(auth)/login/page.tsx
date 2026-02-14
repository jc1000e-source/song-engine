'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-md space-y-4 text-center">
          <h2 className="text-2xl font-bold text-red-600">Configuration Error</h2>
          <p>Missing Supabase environment variables on the client.</p>
          <p className="text-sm text-muted-foreground">Please check your <code className="bg-muted p-1 rounded">.env.local</code> file and restart the server.</p>
        </div>
      </div>
    )
  }

  if (!supabaseUrl.startsWith('https://') && !supabaseUrl.startsWith('http://')) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-md space-y-4 text-center">
          <h2 className="text-2xl font-bold text-red-600">Configuration Error</h2>
          <p>Invalid Supabase URL format.</p>
          <p className="text-sm text-muted-foreground">
            Your <code>NEXT_PUBLIC_SUPABASE_URL</code> must start with <code>https://</code>.
          </p>
          <div className="text-xs text-muted-foreground bg-muted p-2 rounded break-all">
            Current value: {supabaseUrl}
          </div>
        </div>
      </div>
    )
  }

  if (supabaseUrl.includes('your-project')) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-md space-y-4 text-center">
          <h2 className="text-2xl font-bold text-yellow-600">Configuration Warning</h2>
          <p>It looks like you are using a placeholder URL.</p>
          <p className="text-sm text-muted-foreground">
            Your <code>NEXT_PUBLIC_SUPABASE_URL</code> is currently:
            <br />
            <code className="bg-muted p-1 rounded block mt-2">{supabaseUrl}</code>
          </p>
          <p className="text-sm">Please update <code>.env.local</code> with your real Supabase project URL.</p>
        </div>
      </div>
    )
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error('Supabase login error:', error)
        console.log('Target Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
        if (error.message === 'Failed to fetch') {
          toast.error('Network Error: Could not reach Supabase. Check console (F12) for details.')
        } else if (error.message === 'Invalid login credentials') {
          toast.error('Incorrect email or password.')
        } else {
          toast.error(error.message)
        }
        setLoading(false)
        return
      }

      router.refresh()
      router.push('/dashboard')
    } catch (error: any) {
      console.error('Login error:', error)
      toast.error(error?.message || 'An unexpected error occurred')
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-foreground">
            Sign in to TeamHighFive
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Or{' '}
            <Link href="/signup" className="font-medium text-primary hover:text-primary/90">
              create a new account
            </Link>
          </p>
        </div>

        <form onSubmit={handleLogin} className="mt-8 space-y-6">
          <div className="space-y-4 rounded-md shadow-sm">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link
                href="/reset-password"
                className="font-medium text-primary hover:text-primary/90"
              >
                Forgot your password?
              </Link>
            </div>
          </div>

          <div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign in
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}