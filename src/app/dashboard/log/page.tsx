import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { LogRunForm } from "./log-run-form"

export default async function LogRunPage() {
  const session = await auth()
  if (!session) redirect("/login")

  return (
    <main className="min-h-screen bg-zinc-50 max-w-lg mx-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-zinc-50/90 backdrop-blur-sm border-b border-zinc-100 px-4 py-4 flex items-center gap-3">
        <Link
          href="/dashboard"
          className="flex items-center justify-center w-9 h-9 rounded-full bg-zinc-100 hover:bg-zinc-200 transition-colors cursor-pointer"
        >
          <ArrowLeft size={18} className="text-zinc-600" />
        </Link>
        <h1 className="text-lg font-bold text-zinc-900">Log a run</h1>
      </div>

      {/* Form */}
      <div className="px-4 py-6">
        <LogRunForm />
      </div>
    </main>
  )
}
