import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request,
  })

  // Mock authentication check
  const isAuthenticated = request.cookies.has('mrex_auth')

  // Define public routes that do not require authentication
  const isPublicRoute = request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register'

  if (!isAuthenticated && !isPublicRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // If user is logged in and tries to access login page, redirect to dashboard
  if (isAuthenticated && isPublicRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  return response
}
