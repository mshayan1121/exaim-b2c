import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function requireAdmin() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { profile: null, error: NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 }) }
  }

  const { data: profile } = await supabase.from("profiles").select("id, role").eq("id", user.id).single()

  if (!profile || profile.role !== "admin") {
    return { profile: null, error: NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 }) }
  }

  return { profile, error: null }
}
