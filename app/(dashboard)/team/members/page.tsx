import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import TeamMembers from '@/app/team-members-client'

export default async function TeamMembersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch user's teams to get IDs
  const { data: myTeams } = await supabase
    .from('team_members')
    .select('team_id')
    .eq('user_id', user.id)

  const teamIds = myTeams?.map(t => t.team_id) || []

  if (teamIds.length === 0) {
     return (
         <div className="flex-1 p-8 pt-6">
             <h2 className="text-3xl font-bold tracking-tight mb-4">Team Members</h2>
             <p className="text-muted-foreground">You are not part of any teams yet.</p>
         </div>
     )
  }

  // Fetch all members for these teams
  const { data: allMembers } = await supabase
    .from('team_members')
    .select(`
      user_id,
      role,
      team_id,
      teams (
        name
      ),
      profiles (
        full_name,
        email
      )
    `)
    .in('team_id', teamIds)
    .order('team_id')

  // Group members by team
  const teamsMap: Record<string, { id: string, name: string, members: any[] }> = {}
  
  allMembers?.forEach((m: any) => {
      const teamId = m.team_id
      if (!teamsMap[teamId]) {
          teamsMap[teamId] = {
              id: teamId,
              name: m.teams?.name,
              members: []
          }
      }
      teamsMap[teamId].members.push({
          id: m.user_id,
          fullName: m.profiles?.full_name,
          email: m.profiles?.email,
          role: m.role
      })
  })

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">All Team Members</h2>
          <p className="text-muted-foreground">
            View and manage members across all your teams.
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        {Object.values(teamsMap).map((team) => {
            // Determine if current user is owner of this specific team
            const currentUserMember = team.members.find(m => m.id === user.id)
            const isOwner = currentUserMember?.role === 'owner'

            return (
                <Card key={team.id}>
                    <CardHeader>
                        <CardTitle>{team.name}</CardTitle>
                        <CardDescription>{team.members.length} members</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <TeamMembers 
                            members={team.members}
                            teamId={team.id}
                            currentUserId={user.id}
                            isOwner={isOwner}
                        />
                    </CardContent>
                </Card>
            )
        })}
      </div>
    </div>
  )
}