import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ArrowLeft, Download, Music, Calendar, User } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export default async function SongDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: song } = await supabase
    .from('songs')
    .select('*, teams(name)')
    .eq('id', params.id)
    .single()

  if (!song) notFound()

  // Verify user has access to this team's song
  const { data: membership } = await supabase
    .from('team_members')
    .select('team_id')
    .eq('team_id', song.team_id)
    .eq('user_id', user.id)
    .single()

  if (!membership) redirect('/dashboard')

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex items-center space-x-4">
        <Link href="/dashboard/songs">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h2 className="text-3xl font-bold tracking-tight">Song Details</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl">{song.title || 'Untitled Song'}</CardTitle>
                <CardDescription className="mt-2 flex items-center gap-4">
                  <span className="flex items-center gap-1"><Music className="h-4 w-4" /> {song.genre}</span>
                  <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {new Date(song.created_at).toLocaleDateString()}</span>
                  <span className="flex items-center gap-1"><User className="h-4 w-4" /> {song.teams?.name}</span>
                </CardDescription>
              </div>
              <Badge variant={song.status === 'complete' ? 'default' : 'secondary'}>
                {song.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {song.image_url && (
              <div className="aspect-video w-full max-w-2xl mx-auto rounded-lg overflow-hidden bg-muted relative">
                <img src={song.image_url} alt={song.title} className="object-cover w-full h-full" />
              </div>
            )}

            {song.audio_url && (
              <div className="bg-muted/50 p-6 rounded-lg flex flex-col items-center gap-4">
                <audio controls src={song.audio_url} className="w-full max-w-2xl" />
                <Button variant="outline" asChild>
                  <a href={song.audio_url} download target="_blank" rel="noopener noreferrer">
                    <Download className="mr-2 h-4 w-4" />
                    Download MP3
                  </a>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}