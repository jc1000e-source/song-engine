import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { buildPrompt } from '@/lib/prompt-builder'

export async function POST(request: Request) {
  try {
    const { genre, teamId } = await request.json()
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // 1. Get Team & Check Credits
    const { data: team, error: teamError } = await supabase
      .from('teams')
      .select('id, name, song_credits_remaining')
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
        .select('id, description')
        .eq('team_id', teamId)
        .eq('used_in_song', false)

    if (accError) throw accError
    if (!accomplishments || accomplishments.length === 0) {
        return NextResponse.json({ error: 'No new accomplishments to generate a song from' }, { status: 400 })
    }

    // 3. Deduct Credit & Create Song Record (Optimistic)
    // We do this BEFORE the API call to prevent double-spending and handle the "generating" state
    const { data: song, error: songError } = await supabase
      .from('songs')
      .insert({
        team_id: teamId,
        status: 'generating',
        genre: genre,
        created_by_user_id: user.id,
        title: `Song for ${team.name}`, // Temporary title
      })
      .select()
      .single()

    if (songError) throw songError

    // Mark accomplishments as used immediately so they aren't picked up by another request
    const accomplishmentIds = accomplishments.map(a => a.id)
    await supabase
        .from('accomplishments')
        .update({ used_in_song: true, used_in_song_id: song.id })
        .in('id', accomplishmentIds)

    await supabase
      .from('teams')
      .update({ song_credits_remaining: team.song_credits_remaining - 1 })
      .eq('id', teamId)

    // 4. Generate Prompt & Call AI
    const accomplishmentTexts = accomplishments.map(a => a.description)
    const prompt = buildPrompt(team.name, new Date().toLocaleDateString(), genre, accomplishmentTexts)

    try {
        const response = await fetch(process.env.SONG_GENERATION_API_URL!, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.SONG_GENERATION_API_KEY}`
            },
            body: JSON.stringify({
                prompt,
                genre,
                title: `Anthem for ${team.name}`,
                make_instrumental: false,
                wait_audio: true 
            })
        })

        if (!response.ok) {
            throw new Error(`AI API error: ${response.statusText}`)
        }

        const result = await response.json()
        const songData = Array.isArray(result) ? result[0] : result
        
        // 5. Update Song with Result
        await supabase
            .from('songs')
            .update({
                status: 'complete',
                audio_url: songData.audio_url || songData.audioUrl,
                image_url: songData.image_url || songData.imageUrl,
                lyrics: songData.lyrics || songData.text,
                title: songData.title || `Anthem for ${team.name}`
            })
            .eq('id', song.id)

        return NextResponse.json({ success: true, songId: song.id })

    } catch (aiError: any) {
        console.error("Song generation failed:", aiError)
        // Refund credits and mark song as error
        const { data: currentTeam } = await supabase.from('teams').select('song_credits_remaining').eq('id', teamId).single()
        if (currentTeam) {
             await supabase.from('teams').update({ song_credits_remaining: currentTeam.song_credits_remaining + 1 }).eq('id', teamId)
        }
        await supabase.from('accomplishments').update({ used_in_song: false, used_in_song_id: null }).in('id', accomplishmentIds)
        await supabase.from('songs').update({ status: 'error' }).eq('id', song.id)

        return NextResponse.json({ error: 'Song generation failed, credits refunded.' }, { status: 500 })
    }

  } catch (error: any) {
    console.error("Route error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}