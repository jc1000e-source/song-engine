'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { Loader2, Music, AlertCircle, CheckCircle2, Trophy } from 'lucide-react'
import Link from 'next/link'

const GENRES = [
  { id: 'rap', label: 'Rap / Hip Hop' },
  { id: 'pop', label: 'Pop' },
  { id: 'rock', label: 'Rock' },
  { id: 'country', label: 'Country' },
  { id: 'edm', label: 'EDM' },
  { id: 'jazz', label: 'Jazz' },
  { id: 'metal', label: 'Heavy Metal' },
  { id: 'reggae', label: 'Reggae' },
  { id: 'gospel', label: 'Gospel' },
  { id: 'anthem', label: 'Sports Anthem' },
]

export default function NewSongPage() {
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [teams, setTeams] = useState<any[]>([])
  const [selectedTeamId, setSelectedTeamId] = useState<string>('')
  const [genre, setGenre] = useState<string>('rap')
  const [accomplishments, setAccomplishments] = useState<any[]>([])
  
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function loadData() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        // Fetch teams
        const { data: members } = await supabase
          .from('team_members')
          .select('teams(*)')
          .eq('user_id', user.id)
        
        const userTeams = members?.map((m: any) => m.teams).filter(Boolean) || []
        setTeams(userTeams)
        
        if (userTeams.length > 0) {
          setSelectedTeamId(userTeams[0].id)
        }
      } catch (error) {
        console.error('Error loading teams:', error)
        toast.error('Failed to load teams')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [supabase])

  useEffect(() => {
    async function loadAccomplishments() {
      if (!selectedTeamId) return

      const { data } = await supabase
        .from('accomplishments')
        .select('*')
        .eq('team_id', selectedTeamId)
        .eq('used_in_song', false)
        .order('created_at', { ascending: false })

      setAccomplishments(data || [])
    }

    loadAccomplishments()
  }, [selectedTeamId, supabase])

  const handleGenerate = async () => {
    if (!selectedTeamId) return
    if (accomplishments.length === 0) {
      toast.error('You need at least one accomplishment to generate a song!')
      return
    }

    setGenerating(true)
    try {
      const response = await fetch('/api/songs/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamId: selectedTeamId,
          genre,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate song')
      }

      toast.success('Song generation started! This usually takes 1-2 minutes.')
      router.push('/dashboard')
      router.refresh()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setGenerating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (teams.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 text-center">
        <AlertCircle className="h-12 w-12 text-yellow-500" />
        <h2 className="text-2xl font-bold">No Teams Found</h2>
        <p className="text-muted-foreground max-w-md">
          You need to be part of a team to generate songs. Create a team or ask to be invited to one.
        </p>
        <Button asChild className="mt-4">
          <Link href="/dashboard/team/create">Create a Team</Link>
        </Button>
      </div>
    )
  }

  const selectedTeam = teams.find(t => t.id === selectedTeamId)

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Generate New Song</h1>
        <p className="text-muted-foreground mt-2">
          Turn your team's recent wins into a hit song.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuration</CardTitle>
              <CardDescription>Choose your style and team.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Team</label>
                <select 
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={selectedTeamId}
                  onChange={(e) => setSelectedTeamId(e.target.value)}
                  disabled={generating}
                >
                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name} ({team.song_credits_remaining || team.credits || 0} credits)
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Musical Genre</label>
                <div className="grid grid-cols-2 gap-2">
                  {GENRES.map((g) => (
                    <div
                      key={g.id}
                      className={`cursor-pointer rounded-md border p-3 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground ${
                        genre === g.id ? 'border-primary bg-primary/5 ring-1 ring-primary' : ''
                      }`}
                      onClick={() => !generating && setGenre(g.id)}
                    >
                      {g.label}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cost</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span>Song Generation</span>
                <span className="font-bold">1 Credit</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-sm text-muted-foreground">
                <span>Current Balance</span>
                <span>{selectedTeam?.song_credits_remaining || selectedTeam?.credits || 0} Credits</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                size="lg" 
                onClick={handleGenerate}
                disabled={generating || accomplishments.length === 0 || (selectedTeam?.song_credits_remaining || 0) < 1}
              >
                {generating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Music className="mr-2 h-4 w-4" />
                    Generate Song
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Included Accomplishments</span>
                <span className="text-sm font-normal text-muted-foreground">
                  {accomplishments.length} items
                </span>
              </CardTitle>
              <CardDescription>
                These unused accomplishments will be used as lyrics.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto max-h-[600px]">
              {accomplishments.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-center text-muted-foreground border-2 border-dashed rounded-lg">
                  <Trophy className="h-8 w-8 mb-2 opacity-50" />
                  <p>No new accomplishments found.</p>
                  <Button variant="link" asChild className="mt-2">
                    <Link href="/dashboard/accomplishments/new">Add some wins first!</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {accomplishments.map((acc) => (
                    <div key={acc.id} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm font-medium">{acc.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(acc.created_at).toLocaleDateString()} • {acc.user_name || 'Team Member'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}