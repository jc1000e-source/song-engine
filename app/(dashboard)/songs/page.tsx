import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Music, Play, Download } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export default async function SongsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Fetch user's teams
  const { data: teamMembers } = await supabase
    .from('team_members')
    .select('team_id')
    .eq('user_id', user.id)
  
  const teamIds = teamMembers?.map(tm => tm.team_id) || []

  let songs: any[] = []
  
  if (teamIds.length > 0) {
      const { data } = await supabase
        .from('songs')
        .select('*, teams(name)')
        .in('team_id', teamIds)
        .order('created_at', { ascending: false })
      songs = data || []
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Songs</h2>
        <div className="flex items-center space-x-2">
          <Button asChild>
            <Link href="/dashboard/songs/new">
              <Music className="mr-2 h-4 w-4" /> Generate Song
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {songs.length === 0 ? (
            <Card className="col-span-full">
                <CardHeader>
                    <CardTitle>No songs yet</CardTitle>
                    <CardDescription>Generate your first team anthem to get started!</CardDescription>
                </CardHeader>
            </Card>
        ) : (
            songs.map((song) => (
                <Card key={song.id} className="flex flex-col">
                    <CardHeader>
                        <div className="flex items-start justify-between">
                            <div className="space-y-1">
                                <CardTitle className="text-base line-clamp-1" title={song.title}>
                                    {song.title || 'Untitled Song'}
                                </CardTitle>
                                <CardDescription>
                                    {song.teams?.name} • {new Date(song.created_at).toLocaleDateString()}
                                </CardDescription>
                            </div>
                            <Badge variant={
                                song.status === 'complete' ? 'default' : 
                                song.status === 'error' ? 'destructive' : 'secondary'
                            }>
                                {song.status}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-1">
                        <div className="aspect-video bg-muted rounded-md flex items-center justify-center mb-4 relative overflow-hidden group">
                            {song.image_url ? (
                                <img src={song.image_url} alt={song.title} className="object-cover w-full h-full" />
                            ) : (
                                <Music className="h-12 w-12 text-muted-foreground" />
                            )}
                            
                            {song.status === 'complete' && (
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Link href={`/dashboard/songs/${song.id}`}>
                                        <Button size="icon" variant="secondary" className="rounded-full h-12 w-12">
                                            <Play className="h-6 w-6 ml-1" />
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                        
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <span className="capitalize">{song.genre}</span>
                            {song.status === 'complete' && (
                                <Button variant="ghost" size="sm" asChild>
                                    <a href={song.audio_url} download target="_blank" rel="noopener noreferrer">
                                        <Download className="h-4 w-4 mr-2" />
                                        Download
                                    </a>
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            ))
        )}
      </div>
    </div>
  )
}