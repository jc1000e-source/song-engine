import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { SettingsForm } from './settings-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default async function TeamSettingsPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: team } = await supabase.from('teams').select('*').eq('id', params.id).single()
  if (!team) notFound()

  // Check ownership
  const { data: membership } = await supabase
    .from('team_members')
    .select('role')
    .eq('team_id', team.id)
    .eq('user_id', user.id)
    .single()

  if (membership?.role !== 'owner') {
    // Redirect non-owners back to the team dashboard
    redirect(`/team/${params.id}`)
  }

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Team Settings</h2>
          <p className="text-muted-foreground">Manage your team configuration.</p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
          <CardDescription>Update your team's basic information.</CardDescription>
        </CardHeader>
        <CardContent>
          <SettingsForm teamId={team.id} initialName={team.name} />
        </CardContent>
      </Card>
    </div>
  )
}