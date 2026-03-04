import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@supabase/supabase-js'
import { createAdminClient } from '@/lib/supabase/admin'

const signupSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  full_name: z.string().min(1, 'Full name is required').max(255),
  role: z.enum(['teacher', 'student'], {
    message: 'Please select Teacher or Student',
  }),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = signupSchema.safeParse(body)

    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message ?? 'Invalid input'
      return NextResponse.json({ success: false, error: message }, { status: 400 })
    }

    const { email, password, full_name, role } = parsed.data

    const anonClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      { auth: { persistSession: false } }
    )

    const { data: authData, error: authError } = await anonClient.auth.signUp({
      email,
      password,
      options: {
        data: { full_name },
        emailRedirectTo: process.env.NEXT_PUBLIC_APP_URL
          ? `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`
          : undefined,
      },
    })

    if (authError) {
      if (authError.message.includes('already registered') || authError.message.includes('already been registered')) {
        return NextResponse.json(
          { success: false, error: 'An account with this email already exists' },
          { status: 400 }
        )
      }
      return NextResponse.json(
        { success: false, error: authError.message },
        { status: 400 }
      )
    }

    if (!authData.user) {
      return NextResponse.json(
        { success: false, error: 'Failed to create user. Please try again.' },
        { status: 500 }
      )
    }

    const userId = authData.user.id
    const supabase = createAdminClient()

    const { error: profileError } = await supabase.from('profiles').insert({
      id: userId,
      email,
      full_name,
      role,
      is_verified: false,
      is_suspended: false,
    })

    if (profileError) {
      const adminSupabase = createAdminClient()
      await adminSupabase.auth.admin.deleteUser(userId)
      return NextResponse.json(
        { success: false, error: 'Failed to create profile. Please try again.' },
        { status: 500 }
      )
    }

    if (role === 'teacher') {
      const { error: teacherError } = await supabase.from('teacher_profiles').insert({
        id: userId,
      })
      if (teacherError) {
        await supabase.from('profiles').delete().eq('id', userId)
        const adminSupabase = createAdminClient()
        await adminSupabase.auth.admin.deleteUser(userId)
        return NextResponse.json(
          { success: false, error: 'Failed to create teacher profile. Please try again.' },
          { status: 500 }
        )
      }
    } else {
      const { error: studentError } = await supabase.from('student_profiles').insert({
        id: userId,
      })
      if (studentError) {
        await supabase.from('profiles').delete().eq('id', userId)
        const adminSupabase = createAdminClient()
        await adminSupabase.auth.admin.deleteUser(userId)
        return NextResponse.json(
          { success: false, error: 'Failed to create student profile. Please try again.' },
          { status: 500 }
        )
      }
    }

    const { error: subError } = await supabase.from('subscriptions').insert({
      user_id: userId,
      plan: 'free',
      role,
      status: 'active',
    })

    if (subError) {
      if (role === 'teacher') {
        await supabase.from('teacher_profiles').delete().eq('id', userId)
      } else {
        await supabase.from('student_profiles').delete().eq('id', userId)
      }
      await supabase.from('profiles').delete().eq('id', userId)
      const adminSupabase = createAdminClient()
      await adminSupabase.auth.admin.deleteUser(userId)
      return NextResponse.json(
        { success: false, error: 'Failed to create subscription. Please try again.' },
        { status: 500 }
      )
    }

    const { error: notifError } = await supabase.from('notification_preferences').insert({
      user_id: userId,
      new_assignment_inapp: true,
      new_assignment_email: true,
      deadline_reminder_inapp: true,
      deadline_reminder_email: true,
      feedback_ready_inapp: true,
      streak_alert_inapp: true,
      streak_alert_email: true,
      badge_earned_inapp: true,
      submission_inapp: role === 'teacher',
      submission_email: role === 'teacher',
    })

    if (notifError) {
      await supabase.from('subscriptions').delete().eq('user_id', userId)
      if (role === 'teacher') {
        await supabase.from('teacher_profiles').delete().eq('id', userId)
      } else {
        await supabase.from('student_profiles').delete().eq('id', userId)
      }
      await supabase.from('profiles').delete().eq('id', userId)
      const adminSupabase = createAdminClient()
      await adminSupabase.auth.admin.deleteUser(userId)
      return NextResponse.json(
        { success: false, error: 'Failed to set notification preferences. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data: { user_id: userId } })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
