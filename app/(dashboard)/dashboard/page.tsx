import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Music, Users, CreditCard, Trophy } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  // Fetch user's teams
  const { data: members } = await supabase
    .from('team_members')
    .select('role, teams(*)')
    .eq('user_id', user.id)

  const teams = members?.map((m: any) => m.teams).filter(Boolean) || []
  const currentTeam = teams[0] // Default to first team for now

  // Fetch recent songs if a team exists
  let recentSongs: any[] = []
  let memberCount = 0
  
  if (currentTeam) {
    const { data: songs } = await supabase
      .from('songs')
      .select('*')
      .eq('team_id', currentTeam.id)
      .order('created_at', { ascending: false })
      .limit(5)
    recentSongs = songs || []

    const { count } = await supabase
        .from('team_members')
        .select('*', { count: 'exact', head: true })
        .eq('team_id', currentTeam.id)
    memberCount = count || 0
  }

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>

      {!currentTeam ? (
        <Card>
          <CardHeader>
            <CardTitle>Welcome to TeamHighFive!</CardTitle>
            <CardDescription>You are not part of any team yet.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Create a team to start generating songs for your accomplishments.</p>
            <div className="flex gap-4">
                <Button asChild>
                    <Link href="/dashboard/team/create">Create Team</Link>
                </Button>
                 <Button asChild variant="outline">
                    <Link href="/dashboard/team/join">Join Team</Link>
                </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Team Credits</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currentTeam.credits}</div>
                <p className="text-xs text-muted-foreground">
                  <Link href="/dashboard/credits" className="hover:underline">Buy more</Link>
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Team Members</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{memberCount}</div>
                 <p className="text-xs text-muted-foreground">
                  <Link href="/dashboard/team" className="hover:underline">Manage team</Link>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}