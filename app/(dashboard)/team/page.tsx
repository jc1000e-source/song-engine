import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus, Users } from 'lucide-react'

export default async function TeamManagementPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: teams } = await supabase
    .from('teams')
    .select(`
      *,
      team_members!inner (
        user_id,
        role
      )
    `)
    .eq('team_members.user_id', user.id)
    .order('name')

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Teams</h2>
          <p className="text-muted-foreground">
            Manage your teams, view join codes, and check credit balances.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button asChild>
            <Link href="/dashboard/team/create">
              <Plus className="mr-2 h-4 w-4" /> Create Team
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/dashboard/team/join">
              <Users className="mr-2 h-4 w-4" /> Join Team
            </Link>
          </Button>
        </div>
      </div>
      
      <div className="rounded-md border">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Role</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Credits</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Join Code</th>
                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {teams && teams.length > 0 ? (
                teams.map((team) => (
                  <tr key={team.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <td className="p-4 align-middle font-medium">{team.name}</td>
                    <td className="p-4 align-middle capitalize">{team.team_members[0]?.role || 'Member'}</td>
                    <td className="p-4 align-middle">{team.song_credits_remaining ?? 0}</td>
                    <td className="p-4 align-middle font-mono">{team.join_code}</td>
                    <td className="p-4 align-middle text-right">
                      <Link href={`/dashboard/team/${team.id}`} className="font-medium text-primary hover:underline">
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-4 align-middle text-center text-muted-foreground">
                    You are not part of any teams yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}