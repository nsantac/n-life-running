import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-12 bg-zinc-50">
      <div className="w-full max-w-sm space-y-10 text-center">
        {/* Brand */}
        <div className="space-y-3">
          <div className="text-7xl">🏃</div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">
            n-life Running
          </h1>
          <p className="text-zinc-500 text-base leading-relaxed">
            A coach that learns from you<br />and keeps you consistent.
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button size="full" asChild>
            <Link href="/dashboard">Open my training</Link>
          </Button>
          <p className="text-xs text-zinc-400">
            Sign in to access your plan
          </p>
        </div>
      </div>
    </main>
  )
}
