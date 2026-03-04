import { NextResponse } from "next/server"
import { z } from "zod"
import { createClient } from "@/lib/supabase/server"
import { requireAdmin } from "@/lib/utils/admin-api"

const createSchema = z.object({
  subject_id: z.string().uuid(),
  name: z.string().min(1, "Name is required").max(255),
  description: z.string().optional(),
})

export async function GET(request: Request) {
  try {
    const { error } = await requireAdmin()
    if (error) return error

    const { searchParams } = new URL(request.url)
    const subjectId = searchParams.get("subject_id")
    const isPublished = searchParams.get("is_published")

    const supabase = await createClient()
    let query = supabase
      .from("courses")
      .select("*, subjects(id, name)")
      .is("deleted_at", null)
      .order("created_at", { ascending: false })

    if (subjectId) query = query.eq("subject_id", subjectId)
    if (isPublished !== null && isPublished !== undefined && isPublished !== "") {
      query = query.eq("is_published", isPublished === "true")
    }

    const { data, error: dbError } = await query

    if (dbError) {
      return NextResponse.json({ success: false, error: "Failed to fetch courses" }, { status: 500 })
    }

    return NextResponse.json({ success: true, data: data ?? [] })
  } catch {
    return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { error } = await requireAdmin()
    if (error) return error

    const body = await request.json()
    const parsed = createSchema.safeParse(body)
    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message ?? "Invalid input"
      return NextResponse.json({ success: false, error: message }, { status: 400 })
    }

    const { subject_id, name, description } = parsed.data
    const supabase = await createClient()
    const { data, error: insertError } = await supabase
      .from("courses")
      .insert({ subject_id, name, description: description ?? null })
      .select()
      .single()

    if (insertError) {
      return NextResponse.json({ success: false, error: "Failed to create course" }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch {
    return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 })
  }
}
