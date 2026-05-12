"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"

const FEELING_TAGS = ["Easy", "Good", "Hard", "Tired", "Sore", "Strong", "Pain", "Mentally tough"]
const WORKOUT_TYPES = ["Easy", "Tempo", "Long", "Interval", "Recovery", "Cross-train"]
const HR_ZONES = [1, 2, 3, 4, 5]
const RPE_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

function todayLocal() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

function formatPace(totalMin: number, distanceKm: number) {
  const pace = totalMin / distanceKm
  const m = Math.floor(pace)
  const s = Math.round((pace - m) * 60)
  return `${m}:${String(s).padStart(2, "0")} /km`
}

function formatDuration(totalMin: number) {
  const m = Math.floor(totalMin)
  const s = Math.round((totalMin - m) * 60)
  return `${m}:${String(s).padStart(2, "0")}`
}

export function LogRunForm() {
  const router = useRouter()

  const [date, setDate] = useState(todayLocal())
  const [distance, setDistance] = useState("")
  const [durationMin, setDurationMin] = useState("")
  const [durationSec, setDurationSec] = useState("")
  const [feelingTags, setFeelingTags] = useState<string[]>([])
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [workoutType, setWorkoutType] = useState("")
  const [heartRate, setHeartRate] = useState("")
  const [hrZone, setHrZone] = useState<number | null>(null)
  const [rpe, setRpe] = useState<number | null>(null)
  const [incline, setIncline] = useState("")
  const [notes, setNotes] = useState("")
  const [isSkipped, setIsSkipped] = useState(false)
  const [isModified, setIsModified] = useState(false)
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [error, setError] = useState("")

  function toggleTag(tag: string) {
    setFeelingTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  const totalMinutes =
    (parseFloat(durationMin) || 0) + (parseFloat(durationSec) || 0) / 60
  const distanceNum = parseFloat(distance) || 0

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault()
    if (!distance || distanceNum <= 0) {
      setError("Please enter a distance.")
      return
    }

    setStatus("loading")
    setError("")

    const body = {
      date,
      distanceKm: distanceNum,
      durationMin: totalMinutes > 0 ? totalMinutes : undefined,
      heartRate: heartRate ? parseInt(heartRate) : undefined,
      hrZone: hrZone ?? undefined,
      incline: incline ? parseFloat(incline) : undefined,
      rpe: rpe ?? undefined,
      feelingTags,
      workoutType: workoutType || undefined,
      notes: notes || undefined,
      isSkipped,
      isModified,
    }

    const res = await fetch("/api/runs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    if (res.ok) {
      if ("vibrate" in navigator) navigator.vibrate([40, 20, 40])
      setStatus("success")
      setTimeout(() => router.push("/dashboard"), 2000)
    } else {
      let msg = "Something went wrong. Please try again."
      try {
        const data = await res.json()
        msg = data.error ?? msg
      } catch {}
      setError(msg)
      setStatus("error")
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[55vh] space-y-5 text-center px-6">
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center text-4xl">
          ✓
        </div>
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-zinc-900">Run logged!</h2>
          <p className="text-zinc-500">
            {distance} km
            {totalMinutes > 0 && ` · ${formatDuration(totalMinutes)}`}
          </p>
          {totalMinutes > 0 && distanceNum > 0 && (
            <p className="text-sm text-zinc-400">{formatPace(totalMinutes, distanceNum)}</p>
          )}
          {feelingTags.length > 0 && (
            <p className="text-sm text-emerald-600 font-medium">{feelingTags.join(" · ")}</p>
          )}
        </div>
        <p className="text-sm text-zinc-400">Heading back…</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-7">
      {/* Date */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">
          Date
        </label>
        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      {/* Distance */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">
          Distance
        </label>
        <div className="relative">
          <Input
            type="number"
            inputMode="decimal"
            placeholder="0.0"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            className="pr-14 text-2xl font-bold"
            step="0.1"
            min="0"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 font-medium">
            km
          </span>
        </div>
      </div>

      {/* Duration */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">
          Duration{" "}
          <span className="text-zinc-400 normal-case font-normal">(optional)</span>
        </label>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Input
              type="number"
              inputMode="numeric"
              placeholder="0"
              value={durationMin}
              onChange={(e) => setDurationMin(e.target.value)}
              className="pr-14 text-xl font-semibold"
              min="0"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 text-sm">
              min
            </span>
          </div>
          <div className="relative flex-1">
            <Input
              type="number"
              inputMode="numeric"
              placeholder="00"
              value={durationSec}
              onChange={(e) => setDurationSec(e.target.value)}
              className="pr-12 text-xl font-semibold"
              min="0"
              max="59"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 text-sm">
              sec
            </span>
          </div>
        </div>
        {/* Live pace preview */}
        {totalMinutes > 0 && distanceNum > 0 && (
          <p className="text-sm text-emerald-600 font-medium pl-1">
            → {formatPace(totalMinutes, distanceNum)} pace
          </p>
        )}
      </div>

      {/* Feeling tags */}
      <div className="space-y-3">
        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">
          How did it feel?
        </label>
        <div className="flex flex-wrap gap-2">
          {FEELING_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all duration-150 active:scale-95 cursor-pointer",
                feelingTags.includes(tag)
                  ? "bg-emerald-500 text-white shadow-sm"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
              )}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Advanced toggle */}
      <button
        type="button"
        onClick={() => setShowAdvanced((v) => !v)}
        className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-600 transition-colors cursor-pointer"
      >
        {showAdvanced ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        {showAdvanced ? "Hide options" : "More options"}
      </button>

      {/* Advanced section */}
      {showAdvanced && (
        <div className="space-y-7 pt-2 border-t border-zinc-100">
          {/* Workout type */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">
              Workout type
            </label>
            <div className="flex flex-wrap gap-2">
              {WORKOUT_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setWorkoutType(workoutType === type ? "" : type)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-all duration-150 active:scale-95 cursor-pointer",
                    workoutType === type
                      ? "bg-zinc-800 text-white"
                      : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                  )}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Heart rate + zone */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">
              Heart rate
            </label>
            <div className="flex gap-3 items-center">
              <div className="relative flex-1">
                <Input
                  type="number"
                  inputMode="numeric"
                  placeholder="---"
                  value={heartRate}
                  onChange={(e) => setHeartRate(e.target.value)}
                  className="pr-14"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 text-sm">
                  bpm
                </span>
              </div>
              <div className="flex gap-1">
                {HR_ZONES.map((zone) => (
                  <button
                    key={zone}
                    type="button"
                    onClick={() => setHrZone(hrZone === zone ? null : zone)}
                    className={cn(
                      "w-10 h-10 rounded-full text-xs font-semibold transition-all active:scale-95 cursor-pointer",
                      hrZone === zone
                        ? "bg-emerald-500 text-white"
                        : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                    )}
                  >
                    Z{zone}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RPE */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">
              Effort (RPE 1–10)
            </label>
            <div className="flex gap-1.5">
              {RPE_OPTIONS.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRpe(rpe === n ? null : n)}
                  className={cn(
                    "flex-1 h-10 rounded-xl text-sm font-semibold transition-all active:scale-95 cursor-pointer",
                    rpe === n
                      ? "bg-emerald-500 text-white"
                      : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                  )}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Incline */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">
              Incline
            </label>
            <div className="relative">
              <Input
                type="number"
                inputMode="decimal"
                placeholder="0"
                value={incline}
                onChange={(e) => setIncline(e.target.value)}
                className="pr-8"
                step="0.5"
                min="0"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 text-sm">
                %
              </span>
            </div>
          </div>

          {/* Skipped / Modified */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setIsSkipped((v) => !v)}
              className={cn(
                "flex-1 py-3 rounded-2xl text-sm font-semibold transition-all active:scale-95 cursor-pointer",
                isSkipped
                  ? "bg-amber-100 text-amber-800"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
              )}
            >
              Skipped
            </button>
            <button
              type="button"
              onClick={() => setIsModified((v) => !v)}
              className={cn(
                "flex-1 py-3 rounded-2xl text-sm font-semibold transition-all active:scale-95 cursor-pointer",
                isModified
                  ? "bg-blue-100 text-blue-800"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
              )}
            >
              Modified
            </button>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">
              Notes
            </label>
            <Textarea
              placeholder="How did it go? Any pain, weather, thoughts…"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600 text-center">{error}</p>
      )}

      <Button
        type="submit"
        size="full"
        disabled={status === "loading"}
        className="mt-2"
      >
        {status === "loading" ? "Logging…" : "Log run"}
      </Button>
    </form>
  )
}
