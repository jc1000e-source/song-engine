'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Loader2, ArrowLeft } from 'lucide-react'

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const supabase = createClient()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-md space-y-4 text-center">
          <h2 className="text-2xl font-bold text-red-600">Configuration Error</h2>
          <p>Missing Supabase environment variables on the client.</p>
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
        </div>
      </div>
    )
  }

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const redirectUrl = `${window.location.origin}/api/auth/callback?next=/update-password`
      console.log('Sending password reset with redirect:', redirectUrl)

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      })

      if (error) {
        if (error.message === 'Failed to fetch') {
          toast.error('Network Error: Could not reach Supabase. Check your production environment variables.')
        } else {
          toast.error(error.message)
        }
        return
      }

      setSuccess(true)
      toast.success('Password reset email sent!')
    } catch (error: any) {
      toast.error(error?.message || 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-md space-y-8 text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-foreground">Check your email</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            We have sent a password reset link to <strong>{email}</strong>.
          </p>
          <Button asChild className="mt-4" variant="outline">
            <Link href="/login">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Login
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8">
        <div>
          <Link href="/login" className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Login
          </Link>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-foreground">
            Reset Password
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        <form onSubmit={handleReset} className="mt-8 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Send Reset Link
          </Button>
        </form>
      </div>
    </div>
  )
}