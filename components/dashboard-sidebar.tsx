'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { LayoutDashboard, Music, Trophy, CreditCard, Users } from 'lucide-react'

const routes = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/dashboard',
    color: "text-sky-500",
  },
  {
    label: 'Songs',
    icon: Music,
    href: '/songs',
    color: "text-violet-500",
  },
  {
    label: 'Accomplishments',
    icon: Trophy,
    href: '/accomplishments',
    color: "text-pink-700",
  },
  {
    label: 'Credits',
    icon: CreditCard,
    href: '/credits/purchase',
    color: "text-orange-700",
  },
]

export default function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <nav className="grid items-start px-2 text-sm font-medium lg:px-4 mt-4">
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
            pathname === route.href || pathname.startsWith(route.href + '/') 
              ? "bg-muted text-primary" 
              : "text-muted-foreground"
          )}
        >
          <route.icon className={cn("h-4 w-4", route.color)} />
          {route.label}
        </Link>
      ))}
    </nav>
  )
}