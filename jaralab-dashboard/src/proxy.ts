import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Routing por hostname:
// jaralab.co      → "/" = landing (sin redirección)
// app.jaralab.co  → "/" redirige a "/hoy"
// En local (localhost) → sin redirección, ambas rutas funcionan normalmente

export function proxy(request: NextRequest) {
  const host = request.headers.get('host') ?? ''
  const isApp = host.startsWith('app.')

  if (isApp && request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/hoy', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
