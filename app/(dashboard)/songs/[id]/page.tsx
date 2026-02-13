import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { JoinCodeClient } from '@/app/join-code-client'
import TeamMembers from '@/app/team-members-client'
import { Badge } from '@/components/ui/badge'
import { Settings } from 'lucide-react'

interface TeamPageProps {
  params: {
    id: string
  }
}

export default async function TeamPage({ params }: TeamPageProps) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch team details
  const { data: team } = await supabase
    .from('teams')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!team) {
    notFound()
  }

  // Check if user is a member of this team
  const { data: membership } = await supabase
    .from('team_members')
    .select('role')
    .eq('team_id', team.id)
    .eq('user_id', user.id)
    .single()

  if (!membership) {
    // User is not in this team
    redirect('/dashboard')
  }

  // Fetch all team members with profile info
  const { data: members } = await supabase
    .from('team_members')
    .select(`
      user_id,
      role,
      profiles (
        full_name,
        email
      )
    `)
    .eq('team_id', team.id)

  // Transform data for the client component
  const formattedMembers = members?.map((m: any) => ({
    id: m.user_id,
    fullName: m.profiles?.full_name,
    email: m.profiles?.email,
    role: m.role,
  })) || []

  const isOwner = membership.role === 'owner'

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{team.name}</h2>
          <p className="text-muted-foreground">
            Manage your team members and settings.
          </p>
        </div>
        <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="text-lg px-4 py-1">
                {team.credits} Credits
            </Badge>
            {isOwner && (
              <Link href={`/team/${team.id}/settings`}>
                <Button variant="outline" size="sm">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Button>
              </Link>
            )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
            <CardDescription>
              People with access to this team.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TeamMembers 
                members={formattedMembers} 
                teamId={team.id} 
                currentUserId={user.id}
                isOwner={isOwner}
            />
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Invite Members</CardTitle>
            <CardDescription>
              Share this code to let others join your team.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <JoinCodeClient code={team.join_code} />
            <p className="text-sm text-muted-foreground">
                Anyone with this code can join your team and use shared credits.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}