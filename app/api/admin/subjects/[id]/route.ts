import { NextResponse } from "next/server"
import { z } from "zod"
import { createClient } from "@/lib/supabase/server"
import { requireAdmin } from "@/lib/utils/admin-api"

const updateSchema = z.object({
  exam_board_id: z.string().uuid().optional(),
  name: z.string().min(1).max(255).optional(),
  display_order: z.number().int().optional(),
  is_active: z.boolean().optional(),
})

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { error } = await requireAdmin()
    if (error) return error

    const { id } = await params
    const body = await request.json()
    const parsed = updateSchema.safeParse(body)
    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message ?? "Invalid input"
      return NextResponse.json({ success: false, error: message }, { status: 400 })
    }

    const supabase = await createClient()
    const { data, error: updateError } = await supabase
      .from("subjects")
      .update(parsed.data)
      .eq("id", id)
      .select()
      .single()

    if (updateError) {
      return NextResponse.json({ success: false, error: "Failed to update subject" }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch {
    return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { error } = await requireAdmin()
    if (error) return error

    const { id } = await params
    const supabase = await createClient()

    const { data: courses } = await supabase.from("courses").select("id").eq("subject_id", id).is("deleted_at", null)

    if (courses && courses.length > 0) {
      return NextResponse.json(
        { success: false, error: "Cannot delete: active courses depend on this subject" },
        { status: 400 }
      )
    }

    const { error: updateError } = await supabase.from("subjects").update({ is_active: false }).eq("id", id)

    if (updateError) {
      return NextResponse.json({ success: false, error: "Failed to delete subject" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 })
  }
}
