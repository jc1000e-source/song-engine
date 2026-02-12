import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Check if user is admin
  const { data: adminUser } = await supabase
    .from('admin_users')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!adminUser) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-slate-900 text-white shadow-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🛡️</span>
            <h1 className="font-bold text-lg">Admin Console</h1>
          </div>
          <nav className="flex gap-4 items-center">
             <a href="/admin" className="hover:text-slate-300 text-sm font-medium">Overview</a>
             <a href="/admin/users" className="hover:text-slate-300 text-sm font-medium">Users</a>
             <a href="/admin/prompt-tester" className="hover:text-slate-300 text-sm font-medium">Prompt Tester</a>
             <a href="/admin/grant-credits" className="hover:text-slate-300 text-sm font-medium">Grant Credits</a>
             <a href="/dashboard" className="text-xs bg-slate-800 px-3 py-2 rounded hover:bg-slate-700 transition-colors">Back to App</a>
          </nav>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}