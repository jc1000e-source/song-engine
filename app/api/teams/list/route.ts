import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin (for admin panel) or fetch their own teams
    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('*')
      .eq('user_id', user.id)
      .single()

    let teams

    if (adminUser) {
      // Admin can see all teams
      const { data, error } = await supabase
        .from('teams')
        .select('id, name, song_credits_remaining')
        .order('created_at', { ascending: false })

      if (error) throw error
      teams = data
    } else {
      // Regular users see only their teams
      const { data, error } = await supabase
        .from('team_members')
        .select('teams(id, name, song_credits_remaining)')
        .eq('user_id', user.id)

      if (error) throw error
      teams = data?.map(tm => tm.teams).filter(Boolean) || []
    }

    return NextResponse.json({ teams })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
