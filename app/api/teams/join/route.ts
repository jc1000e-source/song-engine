import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { code } = await request.json()
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    if (!code) return NextResponse.json({ error: 'Join code is required' }, { status: 400 })

    // 1. Find Team
    const { data: team, error: teamError } = await supabase
      .from('teams')
      .select('id')
      .eq('join_code', code.toUpperCase())
      .single()

    if (teamError || !team) {
      return NextResponse.json({ error: 'Invalid join code' }, { status: 404 })
    }

    // 2. Check if already member
    const { data: existingMember } = await supabase
      .from('team_members')
      .select('id')
      .eq('team_id', team.id)
      .eq('user_id', user.id)
      .single()

    if (existingMember) {
      return NextResponse.json({ error: 'Already a member of this team' }, { status: 400 })
    }

    // 3. Add Member
    const { error: joinError } = await supabase
      .from('team_members')
      .insert({
        team_id: team.id,
        user_id: user.id,
        role: 'member'
      })

    if (joinError) throw joinError

    return NextResponse.json({ success: true, teamId: team.id })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}