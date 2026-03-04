import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { requireAdmin } from "@/lib/utils/admin-api"

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { profile, error } = await requireAdmin()
    if (error) return error

    const { id } = await params
    const supabase = createAdminClient()

    const { data: course, error: courseError } = await supabase
      .from("courses")
      .select("subject_id, name")
      .eq("id", id)
      .single()

    if (courseError || !course) {
      return NextResponse.json({ success: false, error: "Course not found" }, { status: 404 })
    }

    const { data: newCourse, error: insertError } = await supabase
      .from("courses")
      .insert({
        subject_id: course.subject_id,
        name: `${course.name} (Copy)`,
        is_published: false,
        duplicated_from: id,
      })
      .select()
      .single()

    if (insertError) {
      return NextResponse.json({ success: false, error: "Failed to create course copy" }, { status: 500 })
    }

    const { data: examsToCopy } = await supabase
      .from("exams")
      .select("id, name, exam_type, creation_method, suggested_duration_mins, total_marks")
      .eq("course_id", id)
      .is("deleted_at", null)
      .order("created_at")

    if (examsToCopy && examsToCopy.length > 0) {
      for (const exam of examsToCopy) {
        const { data: newExam, error: examInsertError } = await supabase
          .from("exams")
          .insert({
            course_id: newCourse.id,
            created_by: profile!.id,
            name: exam.name,
            exam_type: exam.exam_type ?? "mixed",
            creation_method: exam.creation_method ?? "manual",
            suggested_duration_mins: exam.suggested_duration_mins ?? 60,
            total_marks: exam.total_marks ?? 0,
            is_published: false,
          })
          .select()
          .single()

        if (examInsertError) continue

        const { data: examQuestions } = await supabase
          .from("exam_questions")
          .select("question_id, question_order")
          .eq("exam_id", exam.id)
          .order("question_order")

        if (examQuestions && examQuestions.length > 0) {
          await supabase.from("exam_questions").insert(
            examQuestions.map((eq, idx) => ({
              exam_id: newExam.id,
              question_id: eq.question_id,
              question_order: eq.question_order ?? idx,
            }))
          )
        }
      }
    }

    return NextResponse.json({ success: true, data: { new_course_id: newCourse.id } })
  } catch {
    return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 })
  }
}
