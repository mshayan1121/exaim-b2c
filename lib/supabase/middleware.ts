import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const path = request.nextUrl.pathname

  // Public routes
  const publicRoutes = ['/', '/login', '/signup', '/forgot-password', '/reset-password', '/verify-email', '/suspended', '/auth']
  const isPublicRoute = publicRoutes.some(route => path === route || path.startsWith(route + '/'))
  const isApiRoute = path.startsWith('/api')

  if (!user && !isPublicRoute && !isApiRoute) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Redirect logged-in users from home to their dashboard
  if (user && path === '/') {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, is_verified, is_suspended')
      .eq('id', user.id)
      .single()
    if (profile?.is_suspended) {
      return NextResponse.redirect(new URL('/suspended', request.url))
    }
    if (profile?.role === 'admin') return NextResponse.redirect(new URL('/admin', request.url))
    if (profile?.role === 'teacher') return NextResponse.redirect(new URL('/teacher', request.url))
    if (profile?.role === 'student') return NextResponse.redirect(new URL('/student', request.url))
  }

  // Redirect logged-in users away from auth pages (except home and suspended)
  if (user && path !== '/' && path !== '/suspended' && (path === '/login' || path === '/signup' || path === '/forgot-password' || path === '/reset-password' || path === '/verify-email' || path.startsWith('/auth/'))) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, is_verified, is_suspended')
      .eq('id', user.id)
      .single()

    if (profile?.is_suspended) {
      return NextResponse.redirect(new URL('/suspended', request.url))
    }

    if (profile?.role === 'admin') {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
    if (profile?.role === 'teacher') {
      return NextResponse.redirect(new URL('/teacher', request.url))
    }
    if (profile?.role === 'student') {
      return NextResponse.redirect(new URL('/student', request.url))
    }
  }

  // Role based route protection
  if (user && path.startsWith('/admin')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    if (profile?.role !== 'admin') {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  if (user && path.startsWith('/teacher')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    if (profile?.role !== 'teacher') {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  if (user && path.startsWith('/student')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    if (profile?.role !== 'student') {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return supabaseResponse
}
