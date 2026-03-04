import { NextResponse } from "next/server"
import { z } from "zod"
import { createClient } from "@/lib/supabase/server"
import { requireAdmin } from "@/lib/utils/admin-api"

const createSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  display_order: z.number().int().optional().default(0),
})

export async function GET() {
  try {
    const { profile, error } = await requireAdmin()
    if (error) return error

    const supabase = await createClient()
    const { data, error: dbError } = await supabase
      .from("qualifications")
      .select("*")
      .order("display_order", { ascending: true })
      .order("name", { ascending: true })

    if (dbError) {
      return NextResponse.json({ success: false, error: "Failed to fetch qualifications" }, { status: 500 })
    }

    return NextResponse.json({ success: true, data: data ?? [] })
  } catch {
    return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { profile, error } = await requireAdmin()
    if (error) return error

    const body = await request.json()
    const parsed = createSchema.safeParse(body)
    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message ?? "Invalid input"
      return NextResponse.json({ success: false, error: message }, { status: 400 })
    }

    const { name, display_order } = parsed.data
    const supabase = await createClient()
    const { data, error: insertError } = await supabase
      .from("qualifications")
      .insert({ name, display_order })
      .select()
      .single()

    if (insertError) {
      if (insertError.code === "23505") {
        return NextResponse.json({ success: false, error: "A qualification with this name already exists" }, { status: 400 })
      }
      return NextResponse.json({ success: false, error: "Failed to create qualification" }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch {
    return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 })
  }
}
