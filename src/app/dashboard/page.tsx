import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { signOut } from "@/lib/auth"

export default async function DashboardPage() {
  const session = await auth()
  if (!session) redirect("/login")

  const firstName = session.user?.name?.split(" ")[0] ?? "Runner"

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-8 max-w-lg mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-zinc-500 text-sm">Good {getTimeOfDay()},</p>
          <h1 className="text-2xl font-bold text-zinc-900">{firstName} 👋</h1>
        </div>
        <form action={async () => { "use server"; await signOut({ redirectTo: "/login" }) }}>
          <button type="submit" className="text-sm text-zinc-400 hover:text-zinc-600 transition-colors">
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
              <p className="text-xs text-zinc-500 font-medium uppercase tracking-wide">Today</p>
              <p className="font-semibold text-zinc-900">No plan yet</p>
            </div>
          </div>
          <p className="text-sm text-zinc-500 leading-relaxed">
            Generate your first training week to see today&apos;s workout here.
          </p>
          <Button size="full" disabled>
            Generate my first plan →
          </Button>
        </CardContent>
      </Card>

      {/* Quick log card */}
      <Card>
        <CardContent className="pt-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-xl">
              ✏️
            </div>
            <div>
              <p className="text-xs text-zinc-500 font-medium uppercase tracking-wide">Training log</p>
              <p className="font-semibold text-zinc-900">Log a run</p>
            </div>
          </div>
          <p className="text-sm text-zinc-500">
            Record what you did today — distance, how it felt, notes.
          </p>
          <Button variant="outline" size="full" disabled>
            Log run →
          </Button>
        </CardContent>
      </Card>

      {/* Status */}
      <p className="text-center text-xs text-zinc-400">
        App is running. More features coming soon.
      </p>
    </main>
  )
}

function getTimeOfDay() {
  const h = new Date().getHours()
  if (h < 12) return "morning"
  if (h < 17) return "afternoon"
  return "evening"
}
