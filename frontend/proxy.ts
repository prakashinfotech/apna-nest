import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Routes that require authentication
const PROTECTED = ['/dashboard', '/post-property']

// Routes that logged-in users should not visit
const AUTH_ONLY = ['/login', '/signup']

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Detect auth by checking for the refresh-token HTTP-only cookie set by the backend
  const isAuthed = !!request.cookies.get('refreshToken')?.value

  const isProtected = PROTECTED.some((r) => pathname.startsWith(r))
  const isAuthPage  = AUTH_ONLY.includes(pathname)

  // Unauthenticated user hitting a protected route → home + open modal
  // DISABLING SERVER-SIDE REDIRECT: We are using localStorage for auth, which the server cannot see.
  // if (isProtected && !isAuthed) {
  //   const url = new URL('/', request.url)
  //   url.searchParams.set('auth', 'login')
  //   url.searchParams.set('returnUrl', pathname)
  //   return NextResponse.redirect(url)
  // }

  // Authenticated user visiting login/signup → dashboard
  // if (isAuthPage && isAuthed) {
  //   return NextResponse.redirect(new URL('/dashboard', request.url))
  // }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|mockServiceWorker.js|hero-bg.png).*)'],
}
