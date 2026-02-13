import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Download, Music, Calendar } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'
import TeamMembers from '../../team-members-client'
import { JoinCodeClient } from '../../join-code-client'

export default async function SongPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
export default async function TeamManagementPage(props: { searchParams: Promise<{ id?: string }> }) {
  const searchParams = await props.searchParams;
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: song } = await supabase
    .from('songs')
    .select('*, teams(name)')
    .eq('id', params.id)
    .single()
  // VIEW: SINGLE TEAM MANAGEMENT
  if (searchParams.id) {
    const teamId = searchParams.id;

  if (!song) {
    notFound()
  }
    const { data: teamData } = await supabase
      .from('teams')
      .select('*, team_members!inner(role)')
      .eq('id', teamId)
      .eq('team_members.user_id', user.id)
      .single();

  // Verify user belongs to the team that owns the song
  const { data: membership } = await supabase
    .from('team_members')
    .select('id')
    .eq('team_id', song.team_id)
    .eq('user_id', user.id)
    .single()
    if (!teamData) {
      // User is not a member of this team or team doesn't exist
      notFound();
    }

  if (!membership) {
    // User is not in the team that owns this song
    redirect('/dashboard')
  }
    const userRole = teamData.team_members[0].role;
    const isOwner = userRole === 'owner';

  const date = new Date(song.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
    const { data: membersData } = await supabase
      .from('team_members')
      .select('role, profiles(id, full_name, email)')
      .eq('team_id', teamId)
      .order('created_at');

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="pl-0 hover:pl-0 hover:bg-transparent text-muted-foreground hover:text-foreground">
          <Link href="/dashboard">
    const members = membersData?.map(m => ({
        id: m.profiles.id,
        fullName: m.profiles.full_name,
        email: m.profiles.email,
        role: m.role,
    })) || [];

    return (
      <div className="max-w-4xl mx-auto py-8 px-4 space-y-8">
        <Button variant="ghost" asChild className="pl-0 text-muted-foreground hover:text-foreground">
          <Link href="/team">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
            All Teams
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Content - Player & Info */}
        <div className="md:col-span-2 space-y-6">
          <Card className="overflow-hidden border-purple-500/20 shadow-lg shadow-purple-500/5">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-8 text-white">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-2.5 py-0.5 text-xs font-semibold transition-colors">
                    {song.genre}
                  </div>
                  <h1 className="text-3xl font-bold tracking-tight">{song.title || 'Untitled Track'}</h1>
                  <p className="text-purple-100 flex items-center gap-2">
                    <Music className="h-4 w-4" />
                    {song.teams?.name}
                  </p>
                </div>
              </div>
            </div>
            
            <CardContent className="p-6">
              <div className="space-y-6">
                {song.status === 'completed' && song.audio_url ? (
                  <div className="bg-slate-50 p-4 rounded-lg border">
                    <audio controls className="w-full" src={song.audio_url}>
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                ) : (
                  <div className="p-8 text-center border-2 border-dashed rounded-lg bg-slate-50">
                    <p className="text-muted-foreground">
                      {song.status === 'generating' ? 'Song is currently generating...' : 'Song generation failed or is pending.'}
                    </p>
                  </div>
                )}

                <div className="flex flex-wrap gap-3">
                  {song.audio_url && (
                    <Button asChild>
                      <a href={song.audio_url} download target="_blank" rel="noopener noreferrer">
                        <Download className="mr-2 h-4 w-4" />
                        Download MP3
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

        <div className="grid gap-8 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Lyrics</CardTitle>
              <CardTitle>{teamData.name}</CardTitle>
              <CardDescription>Invite others with this join code.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-muted-foreground bg-slate-50 p-6 rounded-lg border">
                {song.lyrics || 'Lyrics not available yet.'}
              </div>
              <JoinCodeClient code={teamData.join_code} />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Metadata */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Song Details</CardTitle>
              <CardTitle>Credits</CardTitle>
              <CardDescription>Shared across all team members.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="text-sm font-medium text-muted-foreground block mb-1">Created</span>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-purple-600" />
                  <span>{date}</span>
                </div>
              </div>
              
              <div>
                <span className="text-sm font-medium text-muted-foreground block mb-1">Genre</span>
                <span className="capitalize">{song.genre}</span>
              </div>

              <div>
                <span className="text-sm font-medium text-muted-foreground block mb-1">Status</span>
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                  song.status === 'completed' ? 'bg-green-100 text-green-800' :
                  song.status === 'generating' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {song.status}
                </span>
              </div>
            <CardContent className="flex items-baseline gap-4">
              <span className="text-4xl font-bold">{teamData.song_credits_remaining}</span>
              <Button asChild><Link href="/credits/purchase">Buy More</Link></Button>
            </CardContent>
          </Card>
        </div>

        <TeamMembers members={members} teamId={teamId} currentUserId={user.id} isOwner={isOwner} />
      </div>
    </div>
  )
    )
  }

  // If no ID is provided, redirect to dashboard or show list (Dashboard handles the list view)
  redirect('/dashboard')
}