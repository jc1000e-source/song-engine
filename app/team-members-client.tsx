'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Trash2, Shield, User } from 'lucide-react'
import { toast } from 'sonner'
import { removeTeamMember } from '@/app/actions'
import { useRouter } from 'next/navigation'

interface Member {
  id: string
  fullName: string
  email: string
  role: string
}

interface TeamMembersProps {
  members: Member[]
  teamId: string
  currentUserId: string
  isOwner: boolean
}

export default function TeamMembers({ members, teamId, currentUserId, isOwner }: TeamMembersProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const router = useRouter()

  const handleRemoveMember = async (userId: string) => {
    if (!confirm('Are you sure you want to remove this member?')) return

    setLoadingId(userId)
    try {
      const result = await removeTeamMember(teamId, userId)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Member removed successfully')
        router.refresh()
      }
    } catch (error) {
      toast.error('Failed to remove member')
    } finally {
      setLoadingId(null)
    }
  }

  return (
    <div className="space-y-6">
      {members.map((member) => (
        <div key={member.id} className="flex items-center justify-between space-x-4 border-b pb-4 last:border-0 last:pb-0">
          <div className="flex items-center space-x-4">
            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-medium">
                {member.fullName?.charAt(0) || member.email?.charAt(0) || '?'}
            </div>
            <div>
              <p className="text-sm font-medium leading-none">{member.fullName || 'Unknown Name'}</p>
              <p className="text-sm text-muted-foreground">{member.email}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {member.role === 'owner' ? (
                <div className="flex items-center text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-full">
                    <Shield className="mr-1 h-3 w-3" />
                    Owner
                </div>
            ) : (
                <div className="flex items-center text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-full">
                    <User className="mr-1 h-3 w-3" />
                    Member
                </div>
            )}
            
            {isOwner && member.id !== currentUserId && (
              <Button
                variant="ghost"
                size="icon"
                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                disabled={loadingId === member.id}
                onClick={() => handleRemoveMember(member.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}