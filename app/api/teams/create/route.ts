import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { name } = await request.json()
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // 1. Generate Join Code
    const code = Math.random().toString(36).substring(2, 8).toUpperCase()

    // 2. Create Team
    const { data: team, error: teamError } = await supabase
      .from('teams')
      .insert({
        name,
        owner_id: user.id,
        song_credits_remaining: 0,
        join_code: code
      })
      .select()
      .single()

    if (teamError) throw teamError

    return NextResponse.json({ team, code })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}