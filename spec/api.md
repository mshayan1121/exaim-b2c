# ExAIm B2C — API Routes Spec

## Conventions
- All routes are in `src/app/api/`
- All routes require authentication unless marked PUBLIC
- All routes check role authorisation before processing
- All routes validate input with Zod
- All routes return consistent response shape:
  - Success: `{ success: true, data: ... }`
  - Error: `{ success: false, error: "message" }`
- All routes wrapped in try/catch
- Never expose internal errors to client

---

## 1. Auth Routes

### POST /api/auth/signup
PUBLIC
Create a new user account.
```typescript
// Input
{
  email: string
  password: string
  full_name: string
  role: 'teacher' | 'student'
}

// Actions
// 1. Create Supabase Auth user
// 2. Create profile record
// 3. Create teacher_profile or student_profile
// 4. Create subscription (free plan)
// 5. Create notification_preferences (defaults)
// 6. Send verification email via Resend

// Output
{ success: true, data: { user_id: string } }
```

### POST /api/auth/verify-email
PUBLIC
Handle email verification callback.
```typescript
// Input
{ token: string }

// Actions
// 1. Verify token with Supabase Auth
// 2. Update profile is_verified = true

// Output
{ success: true }
```

### POST /api/auth/forgot-password
PUBLIC
```typescript
// Input
{ email: string }

// Actions
// 1. Send password reset email via Supabase Auth + Resend

// Output
{ success: true }
```

### POST /api/auth/reset-password
PUBLIC
```typescript
// Input
{ token: string, new_password: string }

// Actions
// 1. Verify token
// 2. Update password in Supabase Auth

// Output
{ success: true }
```

---

## 2. Profile Routes

### GET /api/profile
Auth: Any role
```typescript
// Output
{ success: true, data: Profile & TeacherProfile | StudentProfile }
```

### PATCH /api/profile
Auth: Any role
```typescript
// Input
{
  full_name?: string
  avatar_url?: string
}

// Output
{ success: true, data: Profile }
```

### PATCH /api/profile/password
Auth: Any role
```typescript
// Input
{
  current_password: string
  new_password: string
}

// Output
{ success: true }
```

### PATCH /api/profile/notifications
Auth: Any role
```typescript
// Input — any subset of notification preferences
{
  new_assignment_inapp?: boolean
  new_assignment_email?: boolean
  deadline_reminder_inapp?: boolean
  deadline_reminder_email?: boolean
  // ... etc
}

// Output
{ success: true, data: NotificationPreferences }
```

---

## 3. Admin — Content Hierarchy Routes

### GET /api/admin/qualifications
Auth: Admin
```typescript
// Output
{ success: true, data: Qualification[] }
```

### POST /api/admin/qualifications
Auth: Admin
```typescript
// Input
{ name: string, display_order?: number }

// Output
{ success: true, data: Qualification }
```

### PATCH /api/admin/qualifications/[id]
Auth: Admin
```typescript
// Input
{ name?: string, display_order?: number, is_active?: boolean }

// Output
{ success: true, data: Qualification }
```

### DELETE /api/admin/qualifications/[id]
Auth: Admin
```typescript
// Actions
// Soft delete — set is_active = false
// Check no active courses depend on this before deleting

// Output
{ success: true }
```

// Same CRUD pattern applies for:
// /api/admin/exam-boards
// /api/admin/subjects
// /api/admin/topics
// /api/admin/subtopics

---

## 4. Admin — Course Routes

### GET /api/admin/courses
Auth: Admin
```typescript
// Query params
{ subject_id?: string, is_published?: boolean }

// Output
{ success: true, data: Course[] }
```

### POST /api/admin/courses
Auth: Admin
```typescript
// Input
{
  subject_id: string
  name: string
  description?: string
}

// Output
{ success: true, data: Course }
```

### PATCH /api/admin/courses/[id]
Auth: Admin
```typescript
// Input
{
  name?: string
  description?: string
  is_published?: boolean
}

// Output
{ success: true, data: Course }
```

### POST /api/admin/courses/[id]/duplicate
Auth: Admin
```typescript
// Actions
// 1. Create new course with same subject_id
// 2. Copy all exams linked to this course
// 3. Copy exam_questions references (not the questions themselves)
// 4. Set duplicated_from = original course id
// 5. Set is_published = false on new course

// Output
{ success: true, data: { new_course_id: string } }
```

### DELETE /api/admin/courses/[id]
Auth: Admin
```typescript
// Soft delete

// Output
{ success: true }
```

---

## 5. Admin — Question Routes

### GET /api/admin/questions
Auth: Admin
```typescript
// Query params
{
  subject_id?: string
  topic_id?: string
  subtopic_id?: string
  difficulty?: string
  question_type?: string
  is_approved?: boolean
  search?: string
  page?: number
  limit?: number
}

// Output
{
  success: true,
  data: {
    questions: Question[],
    total: number,
    page: number
  }
}
```

### POST /api/admin/questions
Auth: Admin
```typescript
// Input
{
  subject_id: string
  topic_id: string
  subtopic_id?: string
  question_type: 'written' | 'mcq' | 'calculation'
  difficulty: 'easy' | 'medium' | 'hard'
  content: object // TipTap JSON
  image_url?: string
  total_marks: number
  parent_question_id?: string
  part_label?: string
  part_order?: number
  mark_scheme: {
    model_answer: string
    claude_notes?: string
    marking_points: string[]
  }
  mcq_options?: {
    option_text: string
    is_correct: boolean
    option_order: number
  }[]
}

// Actions
// 1. Create question
// 2. Create mark_scheme
// 3. Create marking_points
// 4. Create mcq_options if MCQ
// 5. Set is_approved = true (manually created questions auto approved)

// Output
{ success: true, data: Question }
```

### PATCH /api/admin/questions/[id]
Auth: Admin
```typescript
// Input — any subset of question fields
// Note: editing a shared question affects all exams using it
// Unless detached first

// Output
{ success: true, data: Question }
```

### POST /api/admin/questions/[id]/detach
Auth: Admin
```typescript
// Input
{ exam_id: string }

// Actions
// 1. Create a copy of the question
// 2. Update exam_questions to point to new copy
// 3. New copy is independent — edits don't affect other exams

// Output
{ success: true, data: { new_question_id: string } }
```

### DELETE /api/admin/questions/[id]
Auth: Admin
```typescript
// Soft delete
// Check question is not used in any active exam before deleting

// Output
{ success: true }
```

---

## 6. Admin — Exam Routes

### GET /api/admin/exams
Auth: Admin
```typescript
// Query params
{ course_id?: string, is_published?: boolean }

// Output
{ success: true, data: Exam[] }
```

### POST /api/admin/exams
Auth: Admin
```typescript
// Input
{
  course_id?: string
  name: string
  exam_type: 'topic' | 'subtopic' | 'mixed' | 'past_paper'
  creation_method: 'manual' | 'ai_generated' | 'question_bank' | 'mixed'
  suggested_duration_mins: number
}

// Output
{ success: true, data: Exam }
```

### POST /api/admin/exams/[id]/questions
Auth: Admin
Add a question to an exam.
```typescript
// Input
{ question_id: string, question_order: number }

// Output
{ success: true, data: ExamQuestion }
```

### DELETE /api/admin/exams/[id]/questions/[question_id]
Auth: Admin
Remove a question from an exam.
```typescript
// Output
{ success: true }
```

### PATCH /api/admin/exams/[id]/questions/reorder
Auth: Admin
```typescript
// Input
{ question_orders: { question_id: string, order: number }[] }

// Output
{ success: true }
```

### PATCH /api/admin/exams/[id]
Auth: Admin
```typescript
// Input
{
  name?: string
  suggested_duration_mins?: number
  is_published?: boolean
  is_approved?: boolean
}

// Output
{ success: true, data: Exam }
```

### DELETE /api/admin/exams/[id]
Auth: Admin
```typescript
// Soft delete

// Output
{ success: true }
```

---

## 7. Admin — AI Generation Routes

### POST /api/admin/ai/generate-exam
Auth: Admin
```typescript
// Input
{
  course_id: string
  exam_type: 'topic' | 'subtopic' | 'mixed' | 'past_paper'
  selected_topic_ids: string[]
  selected_subtopic_ids?: string[]
  num_questions: number
  difficulty_mix: { easy: number, medium: number, hard: number }
  total_marks: number
  question_type_mix: { written: number, mcq: number, calculation: number }
  duration_mins: number
}

// Actions
// 1. Validate input
// 2. Build generation payload
// 3. Call Claude API
// 4. Parse and validate response
// 5. Save generated exam as draft (is_approved = false)
// 6. Save generated questions (is_approved = false)
// 7. Return generated exam for admin review

// Output
{ success: true, data: GeneratedExam }
```

### POST /api/admin/ai/generate-question
Auth: Admin
```typescript
// Input
{
  exam_id: string
  subject_id: string
  topic_id: string
  subtopic_id?: string
  question_type: 'written' | 'mcq' | 'calculation'
  difficulty: 'easy' | 'medium' | 'hard'
  marks: number
  context?: string // additional context for generation
}

// Actions
// 1. Call Claude API
// 2. Save generated question (is_approved = false)
// 3. Return for admin review

// Output
{ success: true, data: GeneratedQuestion }
```

### POST /api/admin/ai/approve-question/[id]
Auth: Admin
```typescript
// Actions
// 1. Set question is_approved = true
// 2. Question now available in question bank

// Output
{ success: true }
```

### POST /api/admin/ai/approve-exam/[id]
Auth: Admin
```typescript
// Actions
// 1. Set exam is_approved = true
// 2. Set all questions in exam is_approved = true
// 3. Questions saved to question bank

// Output
{ success: true }
```

---

## 8. Admin — User Management Routes

### GET /api/admin/users
Auth: Admin
```typescript
// Query params
{
  role?: 'teacher' | 'student'
  plan?: 'free' | 'paid'
  is_suspended?: boolean
  search?: string
  page?: number
  limit?: number
}

// Output
{
  success: true,
  data: {
    users: UserWithSubscription[],
    total: number
  }
}
```

### PATCH /api/admin/users/[id]/suspend
Auth: Admin
```typescript
// Input
{ reason?: string }

// Actions
// 1. Set profile is_suspended = true
// 2. Revoke active sessions

// Output
{ success: true }
```

### PATCH /api/admin/users/[id]/reactivate
Auth: Admin
```typescript
// Output
{ success: true }
```

---

## 9. Teacher — Class Routes

### GET /api/teacher/classes
Auth: Teacher
```typescript
// Output
{ success: true, data: Class[] }
```

### POST /api/teacher/classes
Auth: Teacher
```typescript
// Input
{
  name: string
  year_group_label?: string
}

// Actions
// 1. Create class
// 2. Generate invite token (nanoid)
// 3. Set invite_expires_at = now + 7 days

// Output
{ success: true, data: Class }
```

### GET /api/teacher/classes/[id]
Auth: Teacher (owns class)
```typescript
// Output
{ success: true, data: ClassWithStudents }
```

### PATCH /api/teacher/classes/[id]
Auth: Teacher (owns class)
```typescript
// Input
{ name?: string, year_group_label?: string }

// Output
{ success: true, data: Class }
```

### POST /api/teacher/classes/[id]/regenerate-invite
Auth: Teacher (owns class)
```typescript
// Actions
// 1. Generate new invite token
// 2. Set invite_expires_at = now + 7 days

// Output
{ success: true, data: { invite_token: string, invite_expires_at: string } }
```

### DELETE /api/teacher/classes/[id]/students/[student_id]
Auth: Teacher (owns class)
```typescript
// Actions
// 1. Set class_students.removed_at = now
// 2. Results preserved

// Output
{ success: true }
```

### DELETE /api/teacher/classes/[id]
Auth: Teacher (owns class)
```typescript
// Soft delete — set deleted_at and is_archived = true

// Output
{ success: true }
```

### POST /api/teacher/classes/[id]/restore
Auth: Teacher (owns class)
```typescript
// Actions
// 1. Set deleted_at = null, is_archived = false

// Output
{ success: true }
```

---

## 10. Teacher — Assignment Routes

### GET /api/teacher/assignments
Auth: Teacher
```typescript
// Query params
{ class_id?: string }

// Output
{ success: true, data: AssignmentWithSubmissions[] }
```

### POST /api/teacher/assignments
Auth: Teacher
```typescript
// Input
{
  class_id: string
  exam_id: string
  name: string
  deadline_at: string // ISO datetime
  duration_override_mins?: number
}

// Actions
// 1. Verify teacher owns the class
// 2. Create assignment
// 3. Send notifications to all students in class
//    - In-app notification
//    - Email via Resend

// Output
{ success: true, data: Assignment }
```

### GET /api/teacher/assignments/[id]/results
Auth: Teacher (owns assignment's class)
```typescript
// Output
{
  success: true,
  data: {
    assignment: Assignment,
    class_average: number,
    submission_count: number,
    total_students: number,
    not_submitted: StudentProfile[],
    results: StudentResult[]
  }
}
```

### DELETE /api/teacher/assignments/[id]
Auth: Teacher (owns assignment's class)
```typescript
// Soft delete

// Output
{ success: true }
```

---

## 11. Student — Enrollment Routes

### POST /api/student/enroll
Auth: Student
```typescript
// Input
{ course_id: string }

// Output
{ success: true, data: CourseEnrollment }
```

### DELETE /api/student/enroll/[course_id]
Auth: Student
```typescript
// Soft unenroll — set unenrolled_at

// Output
{ success: true }
```

### POST /api/student/join-class
Auth: Student
```typescript
// Input
{ invite_token: string }

// Actions
// 1. Find class by invite_token
// 2. Check invite not expired
// 3. Check student not already in class
// 4. Create class_students record
// 5. Enroll student in the class's course if not already enrolled

// Output
{ success: true, data: { class_id: string, class_name: string } }
```

---

## 12. Student — Exam Routes

### GET /api/student/exams
Auth: Student
```typescript
// Query params
{
  course_id?: string
  topic_id?: string
  difficulty?: string
  exam_type?: string
}

// Returns published exams for student's enrolled courses

// Output
{ success: true, data: Exam[] }
```

### GET /api/student/assignments
Auth: Student
```typescript
// Returns all assignments for classes student belongs to

// Output
{ success: true, data: AssignmentWithExam[] }
```

---

## 13. Student — Exam Attempt Routes

### POST /api/student/attempts
Auth: Student
Start a new exam attempt.
```typescript
// Input
{
  exam_id: string
  assignment_id?: string
  attempt_mode: 'practice' | 'exam'
}

// Actions
// 1. Check freemium limits — if exceeded return paywall error
// 2. Create exam_attempt record (status: in_progress)
// 3. Create question_attempt records for all questions
// 4. Return attempt with all questions

// Output
{ success: true, data: ExamAttemptWithQuestions }
```

### PATCH /api/student/attempts/[id]/answer
Auth: Student (owns attempt)
Save or update an answer.
```typescript
// Input
{
  question_attempt_id: string
  answer_content: object // student's answer
  is_flagged?: boolean
}

// Actions
// 1. Verify attempt is in_progress
// 2. Update question_attempt answer_content
// 3. In practice mode — trigger Claude evaluation immediately
// 4. In exam mode — just save, evaluate on full submission

// Output (practice mode)
{
  success: true,
  data: {
    evaluation: EvaluationResult | null // null if processing
  }
}

// Output (exam mode)
{ success: true }
```

### POST /api/student/attempts/[id]/submit
Auth: Student (owns attempt)
Submit full exam (exam mode).
```typescript
// Actions
// 1. Set exam_attempt status = submitted
// 2. Set submitted_at = now
// 3. Calculate duration_taken_secs
// 4. Trigger Claude evaluation for all unevaluated questions
// 5. Update status to evaluated when all done
// 6. Calculate XP earned
// 7. Update student XP and streak
// 8. Check and award badges
// 9. Send feedback ready notification

// Output
{ success: true, data: { attempt_id: string } }
```

### GET /api/student/attempts/[id]/results
Auth: Student (owns attempt)
```typescript
// Output
{
  success: true,
  data: {
    attempt: ExamAttempt,
    questions: QuestionAttemptWithEvaluation[],
    total_marks_awarded: number,
    total_marks_available: number,
    percentage: number,
    predicted_grade: string
  }
}
```

### GET /api/student/attempts/history
Auth: Student
```typescript
// Query params
{ course_id?: string, limit?: number }

// Output
{ success: true, data: ExamAttempt[] }
```

---

## 14. Student — Evaluation Routes

### POST /api/student/evaluate
Auth: Student
Manually trigger evaluation (used in practice mode).
```typescript
// Input
{ question_attempt_id: string }

// Actions
// 1. Check attempt belongs to student
// 2. Check answer exists
// 3. Call Claude evaluation
// 4. Save result
// 5. Update XP if practice mode

// Output
{ success: true, data: EvaluationResult }
```

---

## 15. AI Tutor Routes

### POST /api/student/tutor/conversations
Auth: Student
Start a new tutor conversation.
```typescript
// Input
{
  course_id: string
  mode: 'post_exam' | 'standalone'
  exam_attempt_id?: string // required for post_exam mode
}

// Output
{ success: true, data: TutorConversation }
```

### POST /api/student/tutor/conversations/[id]/messages
Auth: Student (owns conversation)
Send a message to the tutor.
```typescript
// Input
{ content: string }

// Actions
// 1. Save user message to tutor_messages
// 2. Load full conversation history
// 3. Build system prompt (post_exam or standalone)
// 4. Call Claude API with history
// 5. Save assistant response
// 6. Return assistant response

// Output
{ success: true, data: { message: string } }
```

### GET /api/student/tutor/conversations/[id]
Auth: Student (owns conversation)
```typescript
// Output
{ success: true, data: TutorConversationWithMessages }
```

---

## 16. Gamification Routes

### GET /api/student/gamification
Auth: Student
```typescript
// Output
{
  success: true,
  data: {
    xp_total: number,
    level: number,
    level_name: string,
    xp_to_next_level: number,
    streak_current: number,
    streak_longest: number,
    badges: StudentBadge[],
    recent_xp: XpTransaction[]
  }
}
```

### GET /api/student/leaderboard
Auth: Student
```typescript
// Query params
{ class_id?: string }

// Returns most improved leaderboard for class

// Output
{ success: true, data: LeaderboardEntry[] }
```

---

## 17. Daily Challenge Routes

### GET /api/student/daily-challenge
Auth: Student
```typescript
// Actions
// 1. Get today's daily challenge
// 2. Check if student already completed it

// Output
{
  success: true,
  data: {
    challenge: DailyChallenge,
    already_completed: boolean,
    completion?: DailyChallengeAttempt
  }
}
```

### POST /api/student/daily-challenge/[id]/complete
Auth: Student
```typescript
// Input
{ answer_content: object }

// Actions
// 1. Check not already completed today
// 2. Evaluate with Claude
// 3. Award XP
// 4. Update streak

// Output
{ success: true, data: { evaluation: EvaluationResult, xp_earned: number } }
```

---

## 18. Notification Routes

### GET /api/notifications
Auth: Any role
```typescript
// Query params
{ is_read?: boolean, limit?: number }

// Output
{ success: true, data: Notification[] }
```

### PATCH /api/notifications/[id]/read
Auth: Any role (owns notification)
```typescript
// Output
{ success: true }
```

### PATCH /api/notifications/read-all
Auth: Any role
```typescript
// Output
{ success: true }
```

---

## 19. Subscription & Payment Routes

### POST /api/payments/create-checkout
Auth: Teacher or Student
```typescript
// Input
{ plan: 'paid', role: 'teacher' | 'student' }

// Actions
// 1. Create or retrieve Stripe customer
// 2. Create Stripe checkout session
// 3. Return checkout URL

// Output
{ success: true, data: { checkout_url: string } }
```

### POST /api/payments/webhook
PUBLIC — Stripe webhook
```typescript
// Actions (based on event type)
// checkout.session.completed
//   → Update subscription to paid
//   → Set current_period_ends_at
// invoice.payment_failed
//   → Set status to grace_period
//   → Set grace_period_ends_at = now + 3 days
//   → Send payment failed email
// customer.subscription.deleted
//   → Downgrade to free plan
//   → Send downgrade email

// Output
{ received: true }
```

### GET /api/payments/billing
Auth: Teacher or Student
```typescript
// Output
{
  success: true,
  data: {
    plan: 'free' | 'paid',
    status: string,
    current_period_ends_at: string | null,
    stripe_portal_url: string | null
  }
}
```

---

## 20. Admin — Analytics Routes

### GET /api/admin/analytics
Auth: Admin
```typescript
// Output
{
  success: true,
  data: {
    total_teachers: number,
    total_students: number,
    active_paid_teachers: number,
    active_paid_students: number,
    daily_active_users: number,
    popular_courses: CourseStats[],
    claude_api_usage: {
      total_calls_today: number,
      total_tokens_today: number,
      estimated_cost_today: number,
      breakdown_by_type: Record<string, number>
    }
  }
}
```

---

## 21. File Upload Routes

### POST /api/upload/question-image
Auth: Admin
```typescript
// Input: multipart/form-data with image file

// Actions
// 1. Validate file type (jpg, png, webp only)
// 2. Validate file size (max 5MB)
// 3. Validate minimum resolution
// 4. Upload to Supabase Storage
// 5. Return public URL

// Output
{ success: true, data: { url: string } }
```

### POST /api/upload/avatar
Auth: Any role
```typescript
// Input: multipart/form-data with image file

// Actions
// 1. Validate file type
// 2. Resize to 200x200
// 3. Upload to Supabase Storage
// 4. Update profile avatar_url

// Output
{ success: true, data: { url: string } }
```