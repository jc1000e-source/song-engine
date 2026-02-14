'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addAccomplishment(teamId: string, description: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  const { error } = await supabase
    .from('accomplishments')
    .insert({
      team_id: teamId,
      user_id: user.id,
      description,
      user_name: user.user_metadata.full_name || user.email
    })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard/accomplishments')
  return { success: true }
}

export async function removeTeamMember(teamId: string, userId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  // Check if current user is owner
  const { data: membership } = await supabase
    .from('team_members')
    .select('role')
    .eq('team_id', teamId)
    .eq('user_id', user.id)
    .single()

  if (membership?.role !== 'owner') {
    return { error: 'Only team owners can remove members' }
  }

  const { error } = await supabase.from('team_members').delete().eq('team_id', teamId).eq('user_id', userId)

  if (error) return { error: error.message }

  revalidatePath(`/dashboard/team/${teamId}`)
  return { success: true }
}

export async function updateTeamName(teamId: string, name: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Unauthorized' }

  // Check ownership
  const { data: membership } = await supabase
    .from('team_members')
    .select('role')
    .eq('team_id', teamId)
    .eq('user_id', user.id)
    .single()

  if (membership?.role !== 'owner') {
    return { error: 'Only team owners can update settings' }
  }

  const { error } = await supabase
    .from('teams')
    .update({ name })
    .eq('id', teamId)

  if (error) return { error: error.message }

  revalidatePath(`/dashboard/team/${teamId}`)
  return { success: true }
}

export async function deleteTeam(teamId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Unauthorized' }

  // Check ownership
  const { data: membership } = await supabase
    .from('team_members')
    .select('role')
    .eq('team_id', teamId)
    .eq('user_id', user.id)
    .single()

  if (membership?.role !== 'owner') {
    return { error: 'Only team owners can delete teams' }
  }

  const { error } = await supabase.from('teams').delete().eq('id', teamId)

  if (error) return { error: error.message }

  return { success: true }
}