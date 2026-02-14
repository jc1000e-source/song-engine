'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

interface Team {
  id: string
  name: string
  song_credits_remaining: number
}

export default function GrantCreditsPage() {
  const [teams, setTeams] = useState<Team[]>([])
  const [selectedTeam, setSelectedTeam] = useState<string>('')
  const [creditAmount, setCreditAmount] = useState<string>('10')
  const [loading, setLoading] = useState(false)
  const [loadingTeams, setLoadingTeams] = useState(true)

  useEffect(() => {
    fetchTeams()
  }, [])

  const fetchTeams = async () => {
    try {
      const response = await fetch('/api/teams/list')
      if (response.ok) {
        const data = await response.json()
        setTeams(data.teams || [])
      }
    } catch (error) {
      console.error('Failed to fetch teams:', error)
    } finally {
      setLoadingTeams(false)
    }
  }

  const handleGrantCredits = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedTeam || !creditAmount) {
      toast.error('Please select a team and enter credit amount')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/admin/grant-credits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          teamId: selectedTeam,
          amount: parseInt(creditAmount),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to grant credits')
      }

      toast.success(`Successfully granted ${creditAmount} credits!`)
      setCreditAmount('10')
      setSelectedTeam('')
      fetchTeams() // Refresh the team list
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const selectedTeamData = teams.find(t => t.id === selectedTeam)

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Grant Credits</h2>
        <p className="text-muted-foreground">
          Manually add song credits to any team.
        </p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Add Credits to Team</CardTitle>
          <CardDescription>
            Select a team and specify the number of credits to grant.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleGrantCredits} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="team">Select Team</Label>
              {loadingTeams ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : (
                <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                  <SelectTrigger id="team">
                    <SelectValue placeholder="Choose a team..." />
                  </SelectTrigger>
                  <SelectContent>
                    {teams.map((team) => (
                      <SelectItem key={team.id} value={team.id}>
                        {team.name} (Current: {team.song_credits_remaining} credits)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {selectedTeamData && (
              <div className="rounded-lg bg-muted p-4">
                <p className="text-sm text-muted-foreground">
                  Current balance: <span className="font-bold">{selectedTeamData.song_credits_remaining}</span> credits
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="amount">Credit Amount</Label>
              <Input
                id="amount"
                type="number"
                min="1"
                value={creditAmount}
                onChange={(e) => setCreditAmount(e.target.value)}
                placeholder="Enter number of credits"
              />
            </div>

            <Button 
              type="submit" 
              disabled={loading || !selectedTeam || !creditAmount}
              className="w-full"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? 'Granting Credits...' : 'Grant Credits'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
