import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// ─── Rate Limiting (Upstash Redis, opcional) ─────────────────────────────────
const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null

const ratelimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, '10 s'),
    })
  : null

// ─── Rutas protegidas por rol ─────────────────────────────────────────────────
// Cualquier usuario autenticado
const AUTH_PROTECTED = ['/courses', '/checkout', '/teach', '/admin']
// Solo admin / superadmin
const ADMIN_PATHS    = ['/admin']
// Solo instructor
const TEACH_PATHS    = ['/teach']
// Solo usuario autenticado
const STUDENT_PATHS  = ['/courses']

function matchesAny(pathname: string, paths: string[]) {
  return paths.some((p) => pathname.startsWith(p))
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // ─── 1. Rate Limiting por IP ───────────────────────────────────────────────
  if (ratelimit) {
    const ip =
      request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      '127.0.0.1'

    const { success } = await ratelimit.limit(`ratelimit_${ip}`)
    if (!success) {
      return NextResponse.json(
        { error: 'Demasiadas peticiones. Por favor, espera unos segundos.' },
        { status: 429 },
      )
    }
  }

  // ─── 2. Supabase Auth client ───────────────────────────────────────────────
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet)
            request.cookies.set(name, value)
          supabaseResponse = NextResponse.next({ request })
          for (const { name, value, options } of cookiesToSet)
            supabaseResponse.cookies.set(name, value, options)
        },
      },
    },
  )

  // SIEMPRE usar getUser() — nunca getSession() en middleware
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // ─── 3. Rutas públicas — sin sesión OK ────────────────────────────────────
  const isProtectedRoute = matchesAny(pathname, AUTH_PROTECTED)

  if (isProtectedRoute && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('next', pathname)
    return NextResponse.redirect(url)
  }

  // ─── 4. Redirección post-login (raíz "/" con sesión activa) ───────────────
  if (pathname === '/login' && user) {
    // Redirigir al dashboard correcto según rol
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const role = profile?.role ?? 'user'
    const destination =
      role === 'superadmin' || role === 'admin'
        ? '/admin'
        : role === 'instructor'
          ? '/teach'
          : '/courses'

    return NextResponse.redirect(new URL(destination, request.url))
  }

  // ─── 5. RBAC por ruta ─────────────────────────────────────────────────────
  if (user && (matchesAny(pathname, ADMIN_PATHS) || matchesAny(pathname, TEACH_PATHS))) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const role = profile?.role ?? 'user'

    // /admin requiere admin o superadmin
    if (matchesAny(pathname, ADMIN_PATHS)) {
      if (role !== 'admin' && role !== 'superadmin') {
        return NextResponse.redirect(new URL('/courses', request.url))
      }
    }

    // /teach requiere instructor (admin también puede entrar)
    if (matchesAny(pathname, TEACH_PATHS)) {
      if (role !== 'instructor' && role !== 'admin' && role !== 'superadmin') {
        return NextResponse.redirect(new URL('/courses', request.url))
      }
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
