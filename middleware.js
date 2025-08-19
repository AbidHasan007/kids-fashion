import { NextResponse } from 'next/server'
import { parse } from 'cookie'

export function middleware(request) {
  const { pathname } = request.nextUrl

  // Only apply to admin routes (except login)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const cookies = parse(request.headers.get('cookie') || '')
    const adminToken = cookies.adminToken

    if (!adminToken) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*',
}
