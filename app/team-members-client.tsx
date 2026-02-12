'use client'

import { useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Trash2, Crown, Shield } from 'lucide-react'
import { removeTeamMember } from './actions'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


type Member = {
  id: string;
  fullName: string | null;
  email: string | null;
  role: string;
}

interface TeamMembersProps {
  members: Member[];
  teamId: string;
  currentUserId: string;
  isOwner: boolean;
}

export default function TeamMembers({ members, teamId, currentUserId, isOwner }: TeamMembersProps) {
  const [isPending, startTransition] = useTransition()

  const handleRemove = (memberId: string) => {
    startTransition(async () => {
      try {
        const result = await removeTeamMember(teamId, memberId)
        if (result.success) {
          toast.success('Member removed successfully.')
        }
      } catch (error: any) {
        toast.error(error.message)
      }
    })
  }

  return (
    <div className="space-y-4">
      {members.map((member) => (
        <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarFallback>
                {member.fullName?.charAt(0).toUpperCase() || member.email?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{member.fullName || 'No Name'}</p>
              <p className="text-sm text-muted-foreground">{member.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground capitalize">
              {member.role === 'owner' ? <Crown className="h-4 w-4 text-amber-500" /> : <Shield className="h-4 w-4" />}
              {member.role}
            </div>
            {isOwner && member.id !== currentUserId && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 hover:text-destructive" disabled={isPending}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently remove {member.fullName || member.email} from the team. They will lose access to all team data and credits.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleRemove(member.id)} className="bg-destructive hover:bg-destructive/90">
                      Yes, remove member
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}