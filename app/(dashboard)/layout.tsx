import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardSidebar from '@/components/dashboard-sidebar'
import MobileSidebar from '@/components/mobile-sidebar'
import UserNav from '@/components/user-nav'
import { siteConfig } from '@/config/site'
import Link from 'next/link'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <aside className="w-full md:w-64 border-r bg-muted/40 hidden md:block fixed h-full">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
            <span className="">{siteConfig.name}</span>
          </Link>
        </div>
        <DashboardSidebar />
      </aside>
      <div className="flex flex-1 flex-col md:pl-64 transition-all">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6 sticky top-0 z-10 backdrop-blur bg-background/80">
           <MobileSidebar />
           <div className="w-full flex-1">
             {/* Add breadcrumbs or search here later */}
           </div>
           <UserNav user={user} />
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}