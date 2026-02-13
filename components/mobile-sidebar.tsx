'use client'

import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import DashboardSidebar from '@/components/dashboard-sidebar'
import { siteConfig } from '@/config/site'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

export default function MobileSidebar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  // Close sidebar when route changes
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="p-0 w-72 h-full fixed left-0 top-0 border-r bg-background">
        <div className="flex h-14 items-center border-b px-6 font-semibold">
            {siteConfig.name}
        </div>
        <DashboardSidebar />
      </DialogContent>
    </Dialog>
  )
}