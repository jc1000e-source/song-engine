'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { toast } from 'sonner'

const GENRES = [
  { id: 'pop', label: 'Pop' },
  { id: 'rock', label: 'Rock' },
  { id: 'country', label: 'Country' },
  { id: 'rap', label: 'Rap' },
  { id: 'edm', label: 'EDM' },
  { id: 'jazz', label: 'Jazz' },
  { id: 'anthem', label: 'Anthem' },
  { id: 'cinematic', label: 'Cinematic' },
  { id: 'lofi', label: 'Lofi' },
  { id: 'hype_announcer', label: 'Hype Announcer' },
]

export default function GenerateSongPage() {
  const [teams, setTeams] = useState<any[]>([])
  const [selectedTeam, setSelectedTeam] = useState('')
  const [genre, setGenre] = useState('pop')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Default to last 7 days
  const today = new Date().toISOString().split('T')[0]
  const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  
  const [startDate, setStartDate] = useState(lastWeek)
  const [endDate, setEndDate] = useState(today)

  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fetchTeams = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('teams')
        .select('*, team_members!inner(user_id)')
        .eq('team_members.user_id', user.id)
      
      if (data) {
        setTeams(data)
        if (data.length > 0) setSelectedTeam(data[0].id)
      }
    }
    fetchTeams()
  }, [])

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (!selectedTeam) {
      setError('Please create a team first')
      return
    }

    try {
      const res = await fetch('/api/songs/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamId: selectedTeam,
          genre,
          weekStartDate: startDate,
          weekEndDate: endDate,
        }),
      })
      
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Generation failed')
      
      toast.success('Song generation started!')
      router.push('/dashboard')
      router.refresh()
    } catch (err: any) {
      toast.error(err.message)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Generate New Song</h1>
      
      <div className="relative">
        {loading && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm rounded-xl transition-all duration-500">
            <div className="relative">
              {/* Spinning Record */}
              <div className="animate-spin" style={{ animationDuration: '2s' }}>
                <svg width="160" height="160" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                  {/* Vinyl Body */}
                  <circle cx="50" cy="50" r="48" fill="#18181b" stroke="#27272a" strokeWidth="1" />
                  {/* Grooves */}
                  <circle cx="50" cy="50" r="42" stroke="#27272a" strokeWidth="0.5" fill="none" />
                  <circle cx="50" cy="50" r="36" stroke="#27272a" strokeWidth="0.5" fill="none" />
                  <circle cx="50" cy="50" r="30" stroke="#27272a" strokeWidth="0.5" fill="none" />
                  <circle cx="50" cy="50" r="24" stroke="#27272a" strokeWidth="0.5" fill="none" />
                  {/* Label */}
                  <circle cx="50" cy="50" r="16" fill="#e11d48" />
                  <circle cx="50" cy="50" r="14" stroke="#be123c" strokeWidth="0.5" fill="none" />
                  {/* Center Hole */}
                  <circle cx="50" cy="50" r="2" fill="#f4f4f5" />
                </svg>
              </div>
            </div>
            <p className="mt-6 text-lg font-semibold text-gray-900 animate-pulse">Spinning up your track...</p>
            <p className="text-sm text-gray-500 mt-1">This usually takes about 20-30 seconds</p>
          </div>
        )}

        <form onSubmit={handleGenerate} className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        
        {/* Team Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Team</label>
          <select 
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3 border"
            disabled={teams.length === 0}
          >
            {teams.length === 0 && <option>No teams found</option>}
            {teams.map(t => <option key={t.id} value={t.id}>{t.name} ({t.credits} credits)</option>)}
          </select>
          {teams.length === 0 && (
            <p className="mt-2 text-sm text-red-600">You need to <Link href="/team/create" className="underline">create a team</Link> first.</p>
          )}
        </div>

        {/* Genre Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Musical Genre</label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {GENRES.map(g => (
              <button
                key={g.id}
                type="button"
                onClick={() => setGenre(g.id)}
                className={`px-3 py-2 text-sm rounded-md border ${genre === g.id ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3 border" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3 border" />
          </div>
        </div>

        {error && <div className="p-3 bg-red-50 text-red-700 text-sm rounded-md">{error}</div>}

        <div className="pt-4 flex gap-3">
          <button
            type="submit"
            disabled={loading || teams.length === 0}
            className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50 font-medium"
          >
            {loading ? 'Generating...' : 'Generate Song (1 Credit)'}
          </button>
          <Link href="/dashboard" className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">Cancel</Link>
        </div>
      </form>
    </div>
  )
}