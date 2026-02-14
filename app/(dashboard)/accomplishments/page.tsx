import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Trophy, CheckCircle2 } from 'lucide-react'

export default async function AccomplishmentsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Fetch user's teams to filter accomplishments
  const { data: teamMembers } = await supabase
    .from('team_members')
    .select('team_id')
    .eq('user_id', user.id)
  
  const teamIds = teamMembers?.map(tm => tm.team_id) || []

  let accomplishments: any[] = []
  
  if (teamIds.length > 0) {
      const { data } = await supabase
        .from('accomplishments')
        .select('*, teams(name)')
        .in('team_id', teamIds)
        .order('created_at', { ascending: false })
      accomplishments = data || []
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Accomplishments</h2>
        <div className="flex items-center space-x-2">
          <Button asChild>
            <Link href="/dashboard/accomplishments/new">
              <Plus className="mr-2 h-4 w-4" /> Log Win
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {accomplishments.length === 0 ? (
            <Card>
                <CardHeader>
                    <CardTitle>No accomplishments yet</CardTitle>
                    <CardDescription>Log your team's first win to get started!</CardDescription>
                </CardHeader>
            </Card>
        ) : (
            accomplishments.map((acc) => (
                <Card key={acc.id}>
                    <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                        <div className="space-y-1">
                            <CardTitle className="text-base font-medium">
                                {acc.description}
                            </CardTitle>
                            <CardDescription>
                                {acc.teams?.name} • {new Date(acc.created_at).toLocaleDateString()}
                            </CardDescription>
                        </div>
                        {acc.used_in_song ? (
                            <div className="flex items-center text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-full">
                                <CheckCircle2 className="mr-1 h-3 w-3 text-green-500" />
                                Used in song
                            </div>
                        ) : (
                            <div className="flex items-center text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-full">
                                <Trophy className="mr-1 h-3 w-3 text-yellow-500" />
                                Ready for song
                            </div>
                        )}
                    </CardHeader>
                </Card>
            ))
        )}
      </div>
    </div>
  )
}