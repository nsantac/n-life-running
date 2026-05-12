import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const urlSet = !!process.env.DATABASE_URL
  const urlPrefix = process.env.DATABASE_URL?.slice(0, 30) ?? "not set"

  try {
    await prisma.user.count()
    return NextResponse.json({ ok: true, db: "connected", urlSet, urlPrefix })
  } catch (e) {
    return NextResponse.json(
      { ok: false, db: "failed", error: String(e), urlSet, urlPrefix },
      { status: 500 }
    )
  }
}
