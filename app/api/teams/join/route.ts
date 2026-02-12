import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { genre, teamId } = await request.json()
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // 1. Get Team & Check Credits
    const { data: team, error: teamError } = await supabase
      .from('teams')
      .select('id, song_credits_remaining')
      .eq('id', teamId)
      .single()

    if (teamError || !team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 })
    }

    if (team.song_credits_remaining < 1) {
      return NextResponse.json({ error: 'Insufficient credits' }, { status: 402 })
    }

    // 2. Find unused accomplishments
    const { data: accomplishments, error: accError } = await supabase
        .from('accomplishments')
        .select('id, text')
        .eq('team_id', teamId)
        .eq('used_in_song', false)

    if (accError) throw accError
    if (!accomplishments || accomplishments.length === 0) {
        return NextResponse.json({ error: 'No new accomplishments to generate a song from' }, { status: 400 })
    }

    // 3. Create Song Record
    const { data: song, error: songError } = await supabase
      .from('songs')
      .insert({
        team_id: teamId,
        status: 'generating',
        genre: genre,
        created_by_user_id: user.id,
      })
      .select()
      .single()

    if (songError) throw songError

    // 4. Link Accomplishments & Deduct Credit
    const accomplishmentIds = accomplishments.map(a => a.id)
    await supabase
        .from('accomplishments')
        .update({ used_in_song: true, used_in_song_id: song.id })
        .in('id', accomplishmentIds)

    await supabase
      .from('teams')
      .update({ song_credits_remaining: team.song_credits_remaining - 1 })
      .eq('id', teamId)

    return NextResponse.json({ success: true, songId: song.id, remainingCredits: team.song_credits_remaining - 1 })

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}