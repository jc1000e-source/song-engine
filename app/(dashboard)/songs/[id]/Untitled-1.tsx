import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Music } from 'lucide-react'

export default async function Dashboard() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch songs
  const { data: songs } = await supabase
    .from('songs')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Link href="/songs/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Song
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {songs?.map((song) => (
          <Link key={song.id} href={`/songs/${song.id}`}>
            <Card className="hover:bg-accent transition-colors cursor-pointer h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium truncate pr-4">
                  {song.title}
                </CardTitle>
                <Music className="h-4 w-4 text-muted-foreground shrink-0" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold capitalize">{song.genre}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(song.created_at).toLocaleDateString()}
                </p>
                <div className="mt-3">
                  <span className={`text-xs px-2 py-1 rounded-full border ${
                    song.status === 'complete' ? 'bg-green-100 text-green-700 border-green-200' :
                    'bg-yellow-100 text-yellow-700 border-yellow-200'
                  }`}>
                    {song.status}
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
        {(!songs || songs.length === 0) && (
          <div className="col-span-full text-center p-12 border rounded-lg border-dashed text-muted-foreground">
            No songs created yet. Click "Create Song" to get started.
          </div>
        )}
      </div>
    </div>
  )
}
