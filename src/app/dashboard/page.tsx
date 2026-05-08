import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { signOut } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

function getTimeOfDay() {
  const h = new Date().getHours()
  if (h < 12) return "morning"
  if (h < 17) return "afternoon"
  return "evening"
}

function formatPace(paceMinKm: number) {
  const m = Math.floor(paceMinKm)
  const s = Math.round((paceMinKm - m) * 60)
  return `${m}:${String(s).padStart(2, "0")} /km`
}

function formatDuration(totalMin: number) {
  const h = Math.floor(totalMin / 60)
  const m = Math.floor(totalMin % 60)
  if (h > 0) return `${h}h ${m}m`
  return `${m} min`
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(new Date(date))
}

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const recentRuns = await prisma.run.findMany({
    where: { userId: session.user.id },
    orderBy: { date: "desc" },
    take: 5,
  })

  const firstName = session.user?.name?.split(" ")[0] ?? "Runner"

  return (
    <main className="min-h-screen bg-zinc-50 max-w-lg mx-auto px-4 py-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <p className="text-zinc-500 text-sm">Good {getTimeOfDay()},</p>
          <h1 className="text-2xl font-bold text-zinc-900">{firstName} 👋</h1>
        </div>
        <form
          action={async () => {
            "use server"
            await signOut({ redirectTo: "/login" })
          }}
        >
          <button
            type="submit"
            className="text-sm text-zinc-400 hover:text-zinc-600 transition-colors cursor-pointer"
          >
            Sign out
          </button>
        </form>
      </div>

      {/* Today card */}
      <Card>
        <CardContent className="pt-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-xl">
              📅
            </div>
            <div>
              <p className="text-xs text-zinc-500 font-medium uppercase tracking-wide">
                Today
              </p>
              <p className="font-semibold text-zinc-900">No plan yet</p>
            </div>
          </div>
          <p className="text-sm text-zinc-500 leading-relaxed">
            Generate your first training week to see today&apos;s workout here.
          </p>
          <Button size="full" disabled variant="outline">
            Generate my first plan →
          </Button>
        </CardContent>
      </Card>

      {/* Log run CTA */}
      <Button size="full" asChild>
        <Link href="/dashboard/log">✏️ &nbsp; Log a run</Link>
      </Button>

      {/* Recent runs */}
      {recentRuns.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide px-1">
            Recent runs
          </p>
          <div className="space-y-2">
            {recentRuns.map((run) => (
              <Card key={run.id}>
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="text-sm text-zinc-400">
                        {formatDate(run.date)}
                        {run.workoutType && (
                          <span className="ml-2 text-zinc-300">·</span>
                        )}
                        {run.workoutType && (
                          <span className="ml-2 text-zinc-500">
                            {run.workoutType}
                          </span>
                        )}
                      </p>
                      <p className="text-xl font-bold text-zinc-900">
                        {run.distanceKm} km
                      </p>
                      <div className="flex gap-3 text-sm text-zinc-500">
                        {run.durationMin && (
                          <span>{formatDuration(run.durationMin)}</span>
                        )}
                        {run.paceMinKm && (
                          <span>{formatPace(run.paceMinKm)}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {run.isSkipped && (
                        <Badge variant="warning">Skipped</Badge>
                      )}
                      {run.isModified && (
                        <Badge variant="secondary">Modified</Badge>
                      )}
                      {run.feelingTags.length > 0 && (
                        <div className="flex flex-wrap gap-1 justify-end">
                          {run.feelingTags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="default">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  {run.notes && (
                    <p className="mt-2 text-sm text-zinc-400 leading-snug line-clamp-2">
                      {run.notes}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {recentRuns.length === 0 && (
        <p className="text-center text-sm text-zinc-400 py-4">
          No runs logged yet. Log your first one above!
        </p>
      )}
    </main>
  )
}
