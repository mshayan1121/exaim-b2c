import { NextResponse } from "next/server"
import { z } from "zod"
import { createClient } from "@/lib/supabase/server"
import { requireAdmin } from "@/lib/utils/admin-api"

const updateSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().optional().nullable(),
  is_published: z.boolean().optional(),
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
      .from("courses")
      .update(parsed.data)
      .eq("id", id)
      .select()
      .single()

    if (updateError) {
      return NextResponse.json({ success: false, error: "Failed to update course" }, { status: 500 })
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
    const { error: updateError } = await supabase
      .from("courses")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", id)

    if (updateError) {
      return NextResponse.json({ success: false, error: "Failed to delete course" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 })
  }
}
