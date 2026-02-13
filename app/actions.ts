'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addAccomplishment(teamId: string, description: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'You must be logged in to add an accomplishment' }
  }

  // Verify user is a member of the team
  const { data: membership } = await supabase
    .from('team_members')
    .select('role')
    .eq('team_id', teamId)
    .eq('user_id', user.id)
    .single()

  if (!membership) {
    return { error: 'You are not a member of this team' }
  }

  const { error } = await supabase
    .from('accomplishments')
    .insert({
      team_id: teamId,
      user_id: user.id,
      description: description,
    })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/accomplishments')
  revalidatePath('/dashboard')
  return { success: true }
}

export async function removeTeamMember(teamId: string, memberId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('You must be logged in')
  }

  // Verify current user is owner
  const { data: currentUserMembership } = await supabase
    .from('team_members')
    .select('role')
    .eq('team_id', teamId)
    .eq('user_id', user.id)
    .single()

  if (currentUserMembership?.role !== 'owner') {
    throw new Error('Only team owners can remove members')
  }

  if (memberId === user.id) {
      throw new Error('You cannot remove yourself from the team')
  }

  const { error } = await supabase
    .from('team_members')
    .delete()
    .eq('team_id', teamId)
    .eq('user_id', memberId)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath(`/team/${teamId}`)
  return { success: true }
}

export async function updateTeamName(teamId: string, name: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('You must be logged in')
  }

  // Verify current user is owner
  const { data: currentUserMembership } = await supabase
    .from('team_members')
    .select('role')
    .eq('team_id', teamId)
    .eq('user_id', user.id)
    .single()

  if (currentUserMembership?.role !== 'owner') {
    throw new Error('Only team owners can update settings')
  }

  const { error } = await supabase
    .from('teams')
    .update({ name })
    .eq('id', teamId)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath(`/team/${teamId}`)
  return { success: true }
}

export async function deleteTeam(teamId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('You must be logged in')
  }

  // Verify current user is owner
  const { data: currentUserMembership } = await supabase
    .from('team_members')
    .select('role')
    .eq('team_id', teamId)
    .eq('user_id', user.id)
    .single()

  if (currentUserMembership?.role !== 'owner') {
    throw new Error('Only team owners can delete teams')
  }

  const { error } = await supabase.from('teams').delete().eq('id', teamId)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/dashboard')
  return { success: true }
}