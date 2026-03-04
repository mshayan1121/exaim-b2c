import { NextResponse } from "next/server"
import { z } from "zod"
import { createAdminClient } from "@/lib/supabase/admin"
import { requireAdmin } from "@/lib/utils/admin-api"

const subtopicSchema = z.object({
  name: z.string().min(1),
  display_order: z.number().int(),
})

const topicSchema = z.object({
  name: z.string().min(1),
  display_order: z.number().int(),
  subtopics: z.array(subtopicSchema),
})

const inputSchema = z.object({
  subject_id: z.string().uuid(),
  topics: z.array(topicSchema),
})

export async function POST(request: Request) {
  try {
    const { error } = await requireAdmin()
    if (error) return error

    const body = await request.json()
    const parsed = inputSchema.safeParse(body)
    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message ?? "Invalid input"
      return NextResponse.json({ success: false, error: message }, { status: 400 })
    }

    const { subject_id, topics } = parsed.data
    const supabase = createAdminClient()

    let topicsCreated = 0
    let subtopicsCreated = 0

    for (const topic of topics) {
      const { data: newTopic, error: topicError } = await supabase
        .from("topics")
        .insert({
          subject_id,
          name: topic.name,
          display_order: topic.display_order,
        })
        .select()
        .single()

      if (topicError) {
        return NextResponse.json({ success: false, error: "Failed to save topics" }, { status: 500 })
      }
      topicsCreated++

      for (const subtopic of topic.subtopics) {
        const { error: subtopicError } = await supabase.from("subtopics").insert({
          topic_id: newTopic.id,
          name: subtopic.name,
          display_order: subtopic.display_order,
        })
        if (subtopicError) {
          return NextResponse.json({ success: false, error: "Failed to save subtopics" }, { status: 500 })
        }
        subtopicsCreated++
      }
    }

    return NextResponse.json({
      success: true,
      data: { topics_created: topicsCreated, subtopics_created: subtopicsCreated },
    })
  } catch {
    return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 })
  }
}
