import { NextResponse } from "next/server"

// One-shot endpoint to wipe all Auth.js cookies and redirect to /register.
// Used when a stale session from a previous database needs to be cleared.
export async function GET(req: Request) {
  const base = new URL(req.url).origin
  const res = NextResponse.redirect(`${base}/register`)

  const cookieNames = [
    "authjs.session-token",
    "__Secure-authjs.session-token",
    "authjs.csrf-token",
    "__Host-authjs.csrf-token",
    "authjs.callback-url",
    "next-auth.session-token",
    "next-auth.csrf-token",
  ]

  for (const name of cookieNames) {
    res.cookies.set(name, "", { maxAge: 0, path: "/" })
  }

  return res
}
