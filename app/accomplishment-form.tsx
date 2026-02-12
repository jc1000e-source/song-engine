'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { addAccomplishment } from './actions'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

export function AccomplishmentForm({ teams, defaultTeamId }: { teams: any[], defaultTeamId: string }) {
  const [text, setText] = useState('')
  const [teamId, setTeamId] = useState(defaultTeamId)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return

    setLoading(true)
    try {
        const result = await addAccomplishment(teamId, text)
        if (result.error) {
            toast.error(result.error)
        } else {
            toast.success('Accomplishment logged!')
            setText('')
            router.refresh()
        }
    } catch (error) {
        toast.error('Failed to save accomplishment')
    } finally {
        setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
            <Label>Team</Label>
            <Select value={teamId} onValueChange={(val) => {
                setTeamId(val)
                router.push(`/accomplishments?teamId=${val}`)
            }}>
                <SelectTrigger>
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {teams.map(t => (
                        <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
        
        <div className="space-y-2">
            <Label>Accomplishment</Label>
            <Textarea 
                placeholder="We closed the big deal with Acme Corp..." 
                value={text}
                onChange={e => setText(e.target.value)}
                rows={4}
            />
        </div>

        <Button type="submit" className="w-full" disabled={loading || !text.trim()}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Log Win
        </Button>
    </form>
  )
}