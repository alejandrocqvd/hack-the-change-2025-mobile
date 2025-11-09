import { supabase } from './supabase'

export async function getUserId() {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) console.error('Error retrieving user:', error.message)
  return user?.id
}