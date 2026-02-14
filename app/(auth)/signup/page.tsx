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

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
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

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          // Redirect to this URL after email verification
          emailRedirectTo: `${window.location.origin}/api/auth/callback`,
        },
      })

      if (error) {
        if (error.message === 'Failed to fetch') {
          toast.error('Network Error: Could not reach Supabase.')
        } else {
          toast.error(error.message)
        }
        return
      }

      toast.success('Check your email to confirm your account!')
      router.push('/login')
    } catch (error: any) {
      console.error('Signup error:', error)
      toast.error(error?.message || 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-foreground">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Or{' '}
            <Link href="/login" className="font-medium text-primary hover:text-primary/90">
              sign in to existing account
            </Link>
          </p>
        </div>

        <form onSubmit={handleSignup} className="mt-8 space-y-6">
          <div className="space-y-4 rounded-md shadow-sm">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                autoComplete="name"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
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
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign up
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}