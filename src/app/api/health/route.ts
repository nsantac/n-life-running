import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function GET() {
  const urlSet = !!process.env.DATABASE_URL
  const urlPrefix = process.env.DATABASE_URL?.slice(0, 30) ?? "not set"

  try {
    const [userCount, session] = await Promise.all([
      prisma.user.count(),
      auth(),
    ])

    const sessionUserId = session?.user?.id ?? null
    let userExistsInDb = false
    if (sessionUserId) {
      const u = await prisma.user.findUnique({ where: { id: sessionUserId } })
      userExistsInDb = !!u
    }

    return NextResponse.json({
      ok: true,
      db: "connected",
      urlSet,
      urlPrefix,
      userCount,
      sessionUserId,
      userExistsInDb,
    })
  } catch (e) {
    return NextResponse.json(
      { ok: false, db: "failed", error: String(e), urlSet, urlPrefix },
      { status: 500 }
    )
  }
}
