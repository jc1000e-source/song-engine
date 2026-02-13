import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'
import { AccomplishmentForm } from '@/app/accomplishment-form'

export default async function NewAccomplishmentPage({
  searchParams,
}: {
  searchParams: { teamId?: string }
}) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch user's teams
  const { data: teamMembers } = await supabase
    .from('team_members')
    .select('teams(id, name)')
    .eq('user_id', user.id)

  const teams = teamMembers?.map((tm: any) => tm.teams).filter(Boolean) || []

  if (teams.length === 0) {
    return (
        <div className="flex-1 flex flex-col items-center justify-center p-4 min-h-[50vh]">
            <div className="text-center space-y-4">
                <p className="text-muted-foreground">You need to join a team before logging wins.</p>
                <Link href="/teams/create">
                    <Button>Create a Team</Button>
                </Link>
            </div>
        </div>
    )
  }

  const defaultTeamId = searchParams.teamId || teams[0]?.id

  return (
    <div className="flex-1 flex flex-col p-8 pt-6 space-y-8 max-w-2xl mx-auto w-full">
      <div className="flex items-center space-x-4">
        <Link href="/accomplishments">
            <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
            </Button>
        </Link>
        <h2 className="text-3xl font-bold tracking-tight">Log a Win</h2>
      </div>

      <Card>
        <CardHeader>
            <CardTitle>New Accomplishment</CardTitle>
            <CardDescription>
                Record a win for your team. This will be used to generate your next song.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <AccomplishmentForm teams={teams} defaultTeamId={defaultTeamId} />
        </CardContent>
      </Card>
    </div>
  )
}