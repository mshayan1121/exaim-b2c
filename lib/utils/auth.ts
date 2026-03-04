import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function getAuthUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  return user
}

export async function getProfile() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) redirect('/login')
  return profile
}

export async function requireRole(role: 'admin' | 'teacher' | 'student') {
  const profile = await getProfile()
  if (profile.role !== role) redirect('/login')
  return profile
}
