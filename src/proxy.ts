import { NextResponse, type NextRequest } from "next/server"
import { getSessionCookie } from "better-auth/cookies"

// Lightweight session-cookie presence check used only to decide whether to
// redirect a visitor to Sign In. This is NOT full session verification or
// authorization - that is verified server-side where the data is used.
export function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request)

  if (!sessionCookie) {
    const signInUrl = new URL("/sign-in", request.url)
    signInUrl.searchParams.set(
      "callbackUrl",
      `${request.nextUrl.pathname}${request.nextUrl.search}`
    )

    return NextResponse.redirect(signInUrl)
  }

  return NextResponse.next()
}

export const config = {
  // Protect the service details page only.
  matcher: ["/services/:id"],
}
