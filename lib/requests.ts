import { supabase } from "../lib/supabase"

export async function getUserRequests(userId: string) {
  if (!userId) throw new Error("User id is required")

  const { data, error } = await supabase
    .from("requests")
    .select("*")
    .eq("submitted_by", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching user requests:", error.message)
    throw error
  }

  return data
}

export async function getUserRequestStreak(userId: string) {
  if (!userId) throw new Error("User id is required")

  const { data, error } = await supabase
    .from("requests")
    .select("created_at")
    .eq("submitted_by", userId)
    .order("created_at", { ascending: true })

  if (error) {
    console.error("Error fetching requests for streak:", error.message)
    throw error
  }

  if (!data || data.length === 0) return 0

  const dates = Array.from(new Set(data.map(r => new Date(r.created_at).toISOString().split("T")[0]))).sort()

  let longest = 1
  let current = 1
  for (let i = 1; i < dates.length; i++) {
    const prev = new Date(dates[i - 1])
    const curr = new Date(dates[i])
    const diff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24)
    if (diff === 1) current++
    else current = 1
    if (current > longest) longest = current
  }

  const lastDate = new Date(dates[dates.length - 1])
  const today = new Date()
  const diffFromToday = (today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
  const isCurrent = diffFromToday <= 1

  return isCurrent ? longest : 0
}

export async function getRequestById(id: string) {
  if (!id) throw new Error("request ID is required")

  const { data, error } = await supabase
    .from("requests")
    .select("*")
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching request by ID:", error.message)
    throw error
  }

  return data
}

export function calculateImpactScore(streak: number, totalReports: number, rank: number): number {
  const streakWeight = 0.5
  const reportWeight = 0.3
  const rankWeight = 0.2
  const rawScore = (streak * streakWeight * 10) + (totalReports * reportWeight * 5) + (2 * rankWeight * 100)

  return Math.round(rawScore)
}
