import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Music, Trophy } from "lucide-react"

export default async function AdminDashboard() {
  const supabase = await createClient()

  // Fetch stats
  const { count: teamCount } = await supabase.from('teams').select('*', { count: 'exact', head: true })
  const { count: songCount } = await supabase.from('songs').select('*', { count: 'exact', head: true })
  const { count: accomplishmentCount } = await supabase.from('accomplishments').select('*', { count: 'exact', head: true })

  // Fetch recent activity
  const { data: recentSongs } = await supabase
    .from('songs')
    .select('*, teams(name)')
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h2>
        <p className="text-slate-500">System overview and statistics.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Teams</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamCount ?? 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Songs Generated</CardTitle>
            <Music className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{songCount ?? 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accomplishments</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{accomplishmentCount ?? 0}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentSongs?.map((song) => (
              <div key={song.id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                <div>
                  <p className="font-medium">{song.title}</p>
                  <p className="text-sm text-muted-foreground">{song.teams?.name} • {song.genre}</p>
                </div>
                <div className="text-sm text-muted-foreground">
                  {new Date(song.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
            {(!recentSongs || recentSongs.length === 0) && (
                <p className="text-sm text-muted-foreground">No recent activity.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}