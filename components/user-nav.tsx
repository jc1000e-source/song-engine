'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { User } from '@supabase/supabase-js'
import { LogOut } from 'lucide-react'

export default function UserNav({ user }: { user: User }) {
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
            <div className="flex flex-col space-y-1 text-right hidden md:block">
                <p className="text-sm font-medium leading-none">{user.user_metadata?.full_name || 'User'}</p>
                <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
            </div>
            <Avatar className="h-8 w-8">
                <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
        </div>
        <Button variant="ghost" size="icon" onClick={handleSignOut} title="Sign out">
            <LogOut className="h-4 w-4" />
        </Button>
    </div>
  )
}