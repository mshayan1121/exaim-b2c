import { NextResponse } from "next/server"
import { z } from "zod"
import { createAdminClient } from "@/lib/supabase/admin"
import { requireAdmin } from "@/lib/utils/admin-api"
import { generateSubtopics } from "@/lib/claude/hierarchy-generation"

const HIERARCHY_RATE_LIMIT = 20
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000

const inputSchema = z.object({
  topic_name: z.string().min(1, "Topic name is required"),
  qualification: z.string().min(1, "Qualification is required"),
  exam_board: z.string().min(1, "Exam board is required"),
  subject: z.string().min(1, "Subject is required"),
  variant: z.string().optional().nullable(),
})

export async function POST(request: Request) {
  try {
    const { profile, error } = await requireAdmin()
    if (error) return error

    const body = await request.json()
    const parsed = inputSchema.safeParse(body)
    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message ?? "Invalid input"
      return NextResponse.json({ success: false, error: message }, { status: 400 })
    }

    const supabase = createAdminClient()

    const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MS).toISOString()
    const { count } = await supabase
      .from("claude_api_logs")
      .select("*", { count: "exact", head: true })
      .eq("user_id", profile!.id)
      .eq("call_type", "hierarchy_generation")
      .gte("created_at", windowStart)

    if ((count ?? 0) >= HIERARCHY_RATE_LIMIT) {
      return NextResponse.json(
        { success: false, error: "Rate limit exceeded. Maximum 20 hierarchy generations per hour." },
        { status: 429 }
      )
    }

    const { topic_name, qualification, exam_board, subject, variant } = parsed.data

    const result = await generateSubtopics(topic_name, {
      qualification,
      exam_board,
      subject,
      variant: variant ?? null,
    })

    await supabase.from("claude_api_logs").insert({
      user_id: profile!.id,
      call_type: "hierarchy_generation",
      input_tokens: result.usage.inputTokens,
      output_tokens: result.usage.outputTokens,
      duration_ms: result.durationMs,
      success: true,
    })

    return NextResponse.json({ success: true, data: result.data })
  } catch {
    const supabase = createAdminClient()
    const { profile } = await requireAdmin()
    if (profile) {
      await supabase.from("claude_api_logs").insert({
        user_id: profile.id,
        call_type: "hierarchy_generation",
        input_tokens: null,
        output_tokens: null,
        duration_ms: null,
        success: false,
      })
    }
    return NextResponse.json(
      { success: false, error: "Failed to generate subtopics. Please try again." },
      { status: 500 }
    )
  }
}
