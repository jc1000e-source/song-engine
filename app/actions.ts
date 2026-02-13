'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addAccomplishment(teamId: string, text: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Unauthorized' }

  // Verify membership
  const { data: membership } = await supabase
    .from('team_members')
    .select('role')
    .eq('team_id', teamId)
    .eq('user_id', user.id)
    .single()

  if (!membership) return { error: 'You are not a member of this team' }

  const { error } = await supabase
    .from('accomplishments')
    .insert({
        team_id: teamId,
        user_id: user.id,
        text: text,
        used_in_song: false
    })

  if (error) return { error: error.message }

  revalidatePath('/accomplishments')
  return { success: true }
}

export async function removeTeamMember(teamId: string, memberId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  // 1. Verify current user is the owner of the team
  const { data: teamMembership, error: ownerError } = await supabase
    .from('team_members')
    .select('role')
    .eq('team_id', teamId)
    .eq('user_id', user.id)
    .single()

  if (ownerError || teamMembership?.role !== 'owner') {
    throw new Error('Only team owners can remove members.')
  }

  // 2. Prevent owner from removing themselves
  if (user.id === memberId) {
    throw new Error('Owners cannot remove themselves from the team.')
  }

  // 3. Delete the member
  const { error: deleteError } = await supabase
    .from('team_members')
    .delete()
    .eq('team_id', teamId)
    .eq('user_id', memberId)

  if (deleteError) {
    console.error('Error removing member:', deleteError)
    throw new Error('Failed to remove member from the database.')
  }

  revalidatePath('/team')
  return { success: true }
}