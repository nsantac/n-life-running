import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const createRunSchema = z.object({
  date: z.string(),
  distanceKm: z.number().positive(),
  durationMin: z.number().positive().optional(),
  heartRate: z.number().int().positive().optional(),
  hrZone: z.number().int().min(1).max(5).optional(),
  incline: z.number().optional(),
  rpe: z.number().int().min(1).max(10).optional(),
  feelingTags: z.array(z.string()).default([]),
  workoutType: z.string().optional(),
  notes: z.string().optional(),
  isSkipped: z.boolean().default(false),
  isModified: z.boolean().default(false),
})

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const parsed = createRunSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    )
  }

  const {
    date, distanceKm, durationMin, heartRate, hrZone,
    incline, rpe, feelingTags, workoutType, notes, isSkipped, isModified,
  } = parsed.data

  // Auto-calculate pace if we have both distance and duration
  const paceMinKm = durationMin && distanceKm ? durationMin / distanceKm : undefined

  try {
    const run = await prisma.run.create({
      data: {
        userId: session.user.id,
        date: new Date(date),
        distanceKm,
        durationMin: durationMin ?? null,
        paceMinKm: paceMinKm ?? null,
        heartRate: heartRate ?? null,
        hrZone: hrZone ?? null,
        incline: incline ?? null,
        rpe: rpe ?? null,
        feelingTags,
        workoutType: workoutType ?? null,
        notes: notes ?? null,
        rawNotes: notes ?? null,
        isSkipped,
        isModified,
      },
    })
    return NextResponse.json({ ok: true, run }, { status: 201 })
  } catch (e) {
    console.error("Failed to create run:", e)
    return NextResponse.json({ error: "Failed to save run. Please try again." }, { status: 500 })
  }
}

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const runs = await prisma.run.findMany({
    where: { userId: session.user.id },
    orderBy: { date: "desc" },
    take: 50,
  })

  return NextResponse.json({ runs })
}
