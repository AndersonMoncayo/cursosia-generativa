import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// Inicializar redis si existen las keys
const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null

// Permitir 10 peticiones cada 10 segundos globalmente
const ratelimit = redis
  ? new Ratelimit({
      redis: redis,
      limiter: Ratelimit.slidingWindow(10, '10 s'),
    })
  : null

export async function middleware(request: NextRequest) {
  // 1. Rate Limiting por IP
  if (ratelimit) {
    // request.ip no está disponible siempre en el Edge de Next.js pero podemos leer headers
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1'
    const { success } = await ratelimit.limit(`ratelimit_${ip}`)
    
    if (!success) {
      return NextResponse.json(
        { error: 'Demasiadas peticiones. Por favor, espera unos segundos.' },
        { status: 429 }
      )
    }
  }

  // 2. Auth y Headers de Supabase
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
          cookiesToSet.forEach(({ name, value }) => 
            request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options))
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  
  const protectedPaths = ['/dashboard', '/checkout']
  const adminPaths = ['/admin']
  const isProtected = protectedPaths.some(p => 
    request.nextUrl.pathname.startsWith(p))
  const isAdmin = adminPaths.some(p => 
    request.nextUrl.pathname.startsWith(p))

  if (isProtected && !user) {
    return NextResponse.redirect(
      new URL('/login', request.url))
  }

  if (isAdmin) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user?.id)
      .single()
    
    if (profile?.role !== 'admin') {
      return NextResponse.redirect(
        new URL('/dashboard', request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
