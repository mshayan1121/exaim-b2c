import { NextResponse } from "next/server"
import { z } from "zod"
import { createClient } from "@/lib/supabase/server"
import { requireAdmin } from "@/lib/utils/admin-api"

const createSchema = z.object({
  topic_id: z.string().uuid(),
  name: z.string().min(1, "Name is required").max(255),
  display_order: z.number().int().optional().default(0),
})

export async function GET(request: Request) {
  try {
    const { error } = await requireAdmin()
    if (error) return error

    const { searchParams } = new URL(request.url)
    const topicId = searchParams.get("topic_id")

    const supabase = await createClient()
    let query = supabase
      .from("subtopics")
      .select("*, topics(id, name, subjects(id, name, exam_boards(id, name, qualifications(id, name))))")
      .order("display_order", { ascending: true })
      .order("name", { ascending: true })

    if (topicId) {
      query = query.eq("topic_id", topicId)
    }

    const { data, error: dbError } = await query

    if (dbError) {
      return NextResponse.json({ success: false, error: "Failed to fetch subtopics" }, { status: 500 })
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

    const { topic_id, name, display_order } = parsed.data
    const supabase = await createClient()
    const { data, error: insertError } = await supabase
      .from("subtopics")
      .insert({ topic_id, name, display_order })
      .select()
      .single()

    if (insertError) {
      return NextResponse.json({ success: false, error: "Failed to create subtopic" }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch {
    return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 })
  }
}
