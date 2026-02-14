import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function Home() {
  // Check for environment variables
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-24 bg-white text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Configuration Error</h1>
        <p className="text-gray-700">Missing Supabase environment variables.</p>
        <p className="text-sm text-gray-500 mt-2">Please check your <code className="bg-gray-100 p-1 rounded">.env.local</code> file and restart the server.</p>
      </div>
    )
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-white">
      <div className="absolute top-0 right-0 p-6 flex gap-4 items-center z-10">
        <Link href="/login" className="text-sm font-semibold leading-6 text-gray-900 hover:text-gray-600">
          Log in
        </Link>
        <Link href="/signup" className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500">
          Sign up
        </Link>
      </div>
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl mb-6">
          TeamHighFive
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600 mb-10">
          Turn team wins into custom AI-generated songs!
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            href="/login"
            className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Log in
          </Link>
          <Link href="/signup" className="text-sm font-semibold leading-6 text-gray-900">
            Sign up <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </main>
  )
}