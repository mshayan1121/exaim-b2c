# ExAIm B2C — Data Model

## Conventions
- All tables use UUID primary keys
- All tables have `created_at` and `updated_at` timestamps
- Soft deletes use `deleted_at` timestamp (null = active)
- All foreign keys have ON DELETE behaviour specified
- Snake_case for all table and column names
- RLS (Row Level Security) enabled on all tables

---

## 1. Users & Auth

### profiles
Extends Supabase Auth users table.
```sql
id                uuid PRIMARY KEY REFERENCES auth.users(id)
role              text NOT NULL CHECK (role IN ('admin', 'teacher', 'student'))
full_name         text NOT NULL
avatar_url        text
email             text NOT NULL UNIQUE
is_verified       boolean DEFAULT false
is_suspended      boolean DEFAULT false
created_at        timestamptz DEFAULT now()
updated_at        timestamptz DEFAULT now()
deleted_at        timestamptz
```

### teacher_profiles
Additional data for teachers.
```sql
id                uuid PRIMARY KEY REFERENCES profiles(id)
bio               text
subjects_taught   text[] -- array of subject ids they teach
created_at        timestamptz DEFAULT now()
updated_at        timestamptz DEFAULT now()
```

### student_profiles
Additional data for students.
```sql
id                uuid PRIMARY KEY REFERENCES profiles(id)
school_name       text -- optional
year_group_label  text -- e.g. "Year 11" — display only, not a system entity
xp_total          integer DEFAULT 0
level             integer DEFAULT 1
streak_current    integer DEFAULT 0
streak_longest    integer DEFAULT 0
streak_last_date  date
created_at        timestamptz DEFAULT now()
updated_at        timestamptz DEFAULT now()
```

---

## 2. Subscriptions & Billing

### subscriptions
```sql
id                uuid PRIMARY KEY DEFAULT gen_random_uuid()
user_id           uuid NOT NULL REFERENCES profiles(id)
plan              text NOT NULL CHECK (plan IN ('free', 'paid'))
role              text NOT NULL CHECK (role IN ('teacher', 'student'))
stripe_customer_id      text UNIQUE
stripe_subscription_id  text UNIQUE
status            text NOT NULL CHECK (status IN ('active', 'grace_period', 'cancelled', 'expired'))
grace_period_ends_at    timestamptz
current_period_ends_at  timestamptz
created_at        timestamptz DEFAULT now()
updated_at        timestamptz DEFAULT now()
```

---

## 3. Content Hierarchy

### qualifications
```sql
id                uuid PRIMARY KEY DEFAULT gen_random_uuid()
name              text NOT NULL UNIQUE -- e.g. "GCSE", "IGCSE"
display_order     integer DEFAULT 0
is_active         boolean DEFAULT true
created_at        timestamptz DEFAULT now()
updated_at        timestamptz DEFAULT now()
```

### exam_boards
```sql
id                uuid PRIMARY KEY DEFAULT gen_random_uuid()
qualification_id  uuid NOT NULL REFERENCES qualifications(id)
name              text NOT NULL -- e.g. "AQA", "Edexcel"
display_order     integer DEFAULT 0
is_active         boolean DEFAULT true
created_at        timestamptz DEFAULT now()
updated_at        timestamptz DEFAULT now()
```

### subjects
```sql
id                uuid PRIMARY KEY DEFAULT gen_random_uuid()
exam_board_id     uuid NOT NULL REFERENCES exam_boards(id)
name              text NOT NULL -- e.g. "Chemistry"
display_order     integer DEFAULT 0
is_active         boolean DEFAULT true
created_at        timestamptz DEFAULT now()
updated_at        timestamptz DEFAULT now()
```

### topics
```sql
id                uuid PRIMARY KEY DEFAULT gen_random_uuid()
subject_id        uuid NOT NULL REFERENCES subjects(id)
name              text NOT NULL -- e.g. "Atomic Structure"
display_order     integer DEFAULT 0
is_active         boolean DEFAULT true
created_at        timestamptz DEFAULT now()
updated_at        timestamptz DEFAULT now()
```

### subtopics
```sql
id                uuid PRIMARY KEY DEFAULT gen_random_uuid()
topic_id          uuid NOT NULL REFERENCES topics(id)
name              text NOT NULL -- e.g. "Isotopes"
display_order     integer DEFAULT 0
is_active         boolean DEFAULT true
created_at        timestamptz DEFAULT now()
updated_at        timestamptz DEFAULT now()
```

### courses
```sql
id                uuid PRIMARY KEY DEFAULT gen_random_uuid()
subject_id        uuid NOT NULL REFERENCES subjects(id)
name              text NOT NULL -- e.g. "GCSE AQA Chemistry"
description       text
is_published      boolean DEFAULT false
duplicated_from   uuid REFERENCES courses(id) -- tracks course duplication
created_at        timestamptz DEFAULT now()
updated_at        timestamptz DEFAULT now()
deleted_at        timestamptz
```

---

## 4. Questions & Question Bank

### questions
```sql
id                uuid PRIMARY KEY DEFAULT gen_random_uuid()
created_by        uuid NOT NULL REFERENCES profiles(id)
subject_id        uuid REFERENCES subjects(id)
topic_id          uuid REFERENCES topics(id)
subtopic_id       uuid REFERENCES subtopics(id)
question_type     text NOT NULL CHECK (question_type IN ('written', 'mcq', 'calculation'))
difficulty        text NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard'))
content           jsonb NOT NULL -- TipTap JSON content (rich text + math)
image_url         text -- optional embedded image
total_marks       integer NOT NULL DEFAULT 1
is_ai_generated   boolean DEFAULT false
is_approved       boolean DEFAULT false -- AI generated questions need approval
parent_question_id uuid REFERENCES questions(id) -- for sub-parts
part_label        text -- e.g. "a", "b", "c"
part_order        integer -- order of parts within parent
created_at        timestamptz DEFAULT now()
updated_at        timestamptz DEFAULT now()
deleted_at        timestamptz
```

### mark_schemes
```sql
id                uuid PRIMARY KEY DEFAULT gen_random_uuid()
question_id       uuid NOT NULL REFERENCES questions(id) ON DELETE CASCADE
model_answer      text NOT NULL -- full model answer text
claude_notes      text -- special instructions for Claude evaluation
created_at        timestamptz DEFAULT now()
updated_at        timestamptz DEFAULT now()
```

### marking_points
```sql
id                uuid PRIMARY KEY DEFAULT gen_random_uuid()
mark_scheme_id    uuid NOT NULL REFERENCES mark_schemes(id) ON DELETE CASCADE
point_text        text NOT NULL -- one marking point = one mark
point_order       integer NOT NULL
created_at        timestamptz DEFAULT now()
updated_at        timestamptz DEFAULT now()
```

### mcq_options
Only used when question_type = 'mcq'
```sql
id                uuid PRIMARY KEY DEFAULT gen_random_uuid()
question_id       uuid NOT NULL REFERENCES questions(id) ON DELETE CASCADE
option_text       text NOT NULL
is_correct        boolean NOT NULL DEFAULT false
option_order      integer NOT NULL
created_at        timestamptz DEFAULT now()
updated_at        timestamptz DEFAULT now()
```

---

## 5. Exams

### exams
```sql
id                uuid PRIMARY KEY DEFAULT gen_random_uuid()
created_by        uuid NOT NULL REFERENCES profiles(id)
course_id         uuid REFERENCES courses(id)
name              text NOT NULL
exam_type         text NOT NULL CHECK (exam_type IN ('topic', 'subtopic', 'mixed', 'past_paper'))
creation_method   text NOT NULL CHECK (creation_method IN ('manual', 'ai_generated', 'question_bank', 'mixed'))
suggested_duration_mins integer
total_marks       integer NOT NULL DEFAULT 0
is_published      boolean DEFAULT false
is_ai_generated   boolean DEFAULT false
is_approved       boolean DEFAULT false
created_at        timestamptz DEFAULT now()
updated_at        timestamptz DEFAULT now()
deleted_at        timestamptz
```

### exam_questions
Junction table linking exams to questions.
```sql
id                uuid PRIMARY KEY DEFAULT gen_random_uuid()
exam_id           uuid NOT NULL REFERENCES exams(id) ON DELETE CASCADE
question_id       uuid NOT NULL REFERENCES questions(id)
question_order    integer NOT NULL
created_at        timestamptz DEFAULT now()
UNIQUE(exam_id, question_id)
```

---

## 6. Classes & Assignments (Teacher)

### classes
```sql
id                uuid PRIMARY KEY DEFAULT gen_random_uuid()
teacher_id        uuid NOT NULL REFERENCES profiles(id)
name              text NOT NULL
year_group_label  text -- display only
invite_token      text UNIQUE NOT NULL
invite_expires_at timestamptz NOT NULL
is_archived       boolean DEFAULT false
created_at        timestamptz DEFAULT now()
updated_at        timestamptz DEFAULT now()
deleted_at        timestamptz
```

### class_students
```sql
id                uuid PRIMARY KEY DEFAULT gen_random_uuid()
class_id          uuid NOT NULL REFERENCES classes(id)
student_id        uuid NOT NULL REFERENCES profiles(id)
joined_at         timestamptz DEFAULT now()
removed_at        timestamptz -- soft removal, results preserved
UNIQUE(class_id, student_id)
```

### assignments
```sql
id                uuid PRIMARY KEY DEFAULT gen_random_uuid()
class_id          uuid NOT NULL REFERENCES classes(id)
exam_id           uuid NOT NULL REFERENCES exams(id)
name              text NOT NULL
deadline_at       timestamptz NOT NULL
duration_override_mins integer -- teacher override of suggested duration
created_at        timestamptz DEFAULT now()
updated_at        timestamptz DEFAULT now()
deleted_at        timestamptz
```

---

## 7. Student Enrollments

### course_enrollments
```sql
id                uuid PRIMARY KEY DEFAULT gen_random_uuid()
student_id        uuid NOT NULL REFERENCES profiles(id)
course_id         uuid NOT NULL REFERENCES courses(id)
enrolled_at       timestamptz DEFAULT now()
unenrolled_at     timestamptz
UNIQUE(student_id, course_id)
```

---

## 8. Exam Attempts & Evaluation

### exam_attempts
```sql
id                uuid PRIMARY KEY DEFAULT gen_random_uuid()
student_id        uuid NOT NULL REFERENCES profiles(id)
exam_id           uuid NOT NULL REFERENCES exams(id)
assignment_id     uuid REFERENCES assignments(id) -- null if solo attempt
attempt_mode      text NOT NULL CHECK (attempt_mode IN ('practice', 'exam'))
status            text NOT NULL CHECK (status IN ('in_progress', 'submitted', 'evaluated', 'evaluation_failed'))
started_at        timestamptz DEFAULT now()
submitted_at      timestamptz
duration_taken_secs integer
total_marks_available integer NOT NULL
total_marks_awarded   integer
xp_earned         integer DEFAULT 0
created_at        timestamptz DEFAULT now()
updated_at        timestamptz DEFAULT now()
```

### question_attempts
```sql
id                uuid PRIMARY KEY DEFAULT gen_random_uuid()
exam_attempt_id   uuid NOT NULL REFERENCES exam_attempts(id) ON DELETE CASCADE
question_id       uuid NOT NULL REFERENCES questions(id)
answer_content    jsonb -- student's answer (text, selected MCQ option etc.)
is_flagged        boolean DEFAULT false
marks_available   integer NOT NULL
marks_awarded     integer -- null until evaluated
evaluation_status text CHECK (evaluation_status IN ('pending', 'evaluated', 'failed'))
evaluation_result jsonb -- full Claude response stored here
submitted_at      timestamptz
created_at        timestamptz DEFAULT now()
updated_at        timestamptz DEFAULT now()
```

### evaluation_results
Detailed breakdown stored separately for easy querying.
```sql
id                    uuid PRIMARY KEY DEFAULT gen_random_uuid()
question_attempt_id   uuid NOT NULL REFERENCES question_attempts(id) ON DELETE CASCADE
marks_awarded         integer NOT NULL
marks_available       integer NOT NULL
feedback_text         text NOT NULL
improvement_text      text
marking_breakdown     jsonb NOT NULL -- array of {point, awarded: bool}
error_carried_forward boolean DEFAULT false
claude_model_used     text NOT NULL
evaluation_duration_ms integer
created_at            timestamptz DEFAULT now()
```

---

## 9. Gamification

### badges
```sql
id                uuid PRIMARY KEY DEFAULT gen_random_uuid()
name              text NOT NULL UNIQUE
description       text NOT NULL
criteria          text NOT NULL -- human readable criteria
icon_url          text
colour            text -- hex colour
is_active         boolean DEFAULT true
created_at        timestamptz DEFAULT now()
updated_at        timestamptz DEFAULT now()
```

### student_badges
```sql
id                uuid PRIMARY KEY DEFAULT gen_random_uuid()
student_id        uuid NOT NULL REFERENCES profiles(id)
badge_id          uuid NOT NULL REFERENCES badges(id)
earned_at         timestamptz DEFAULT now()
UNIQUE(student_id, badge_id)
```

### xp_transactions
Audit log of all XP earned.
```sql
id                uuid PRIMARY KEY DEFAULT gen_random_uuid()
student_id        uuid NOT NULL REFERENCES profiles(id)
amount            integer NOT NULL
reason            text NOT NULL -- e.g. "exam_completed", "streak_bonus", "high_score"
reference_id      uuid -- optional reference to exam_attempt or other entity
created_at        timestamptz DEFAULT now()
```

### daily_challenges
```sql
id                uuid PRIMARY KEY DEFAULT gen_random_uuid()
question_id       uuid NOT NULL REFERENCES questions(id)
challenge_date    date NOT NULL UNIQUE
created_at        timestamptz DEFAULT now()
```

### daily_challenge_attempts
```sql
id                uuid PRIMARY KEY DEFAULT gen_random_uuid()
student_id        uuid NOT NULL REFERENCES profiles(id)
challenge_id      uuid NOT NULL REFERENCES daily_challenges(id)
completed_at      timestamptz DEFAULT now()
marks_awarded     integer
xp_earned         integer
UNIQUE(student_id, challenge_id)
```

---

## 10. Notifications

### notifications
```sql
id                uuid PRIMARY KEY DEFAULT gen_random_uuid()
user_id           uuid NOT NULL REFERENCES profiles(id)
type              text NOT NULL -- e.g. "new_assignment", "deadline_reminder"
title             text NOT NULL
body              text NOT NULL
reference_id      uuid -- related entity (assignment_id, badge_id etc.)
is_read           boolean DEFAULT false
created_at        timestamptz DEFAULT now()
```

### notification_preferences
```sql
id                uuid PRIMARY KEY DEFAULT gen_random_uuid()
user_id           uuid NOT NULL REFERENCES profiles(id) UNIQUE
new_assignment_inapp    boolean DEFAULT true
new_assignment_email    boolean DEFAULT true
deadline_reminder_inapp boolean DEFAULT true
deadline_reminder_email boolean DEFAULT true
feedback_ready_inapp    boolean DEFAULT true
streak_alert_inapp      boolean DEFAULT true
streak_alert_email      boolean DEFAULT true
badge_earned_inapp      boolean DEFAULT true
submission_inapp        boolean DEFAULT true -- teacher only
submission_email        boolean DEFAULT true -- teacher only
created_at        timestamptz DEFAULT now()
updated_at        timestamptz DEFAULT now()
```

---

## 11. AI Tutor

### tutor_conversations
```sql
id                uuid PRIMARY KEY DEFAULT gen_random_uuid()
student_id        uuid NOT NULL REFERENCES profiles(id)
course_id         uuid REFERENCES courses(id)
exam_attempt_id   uuid REFERENCES exam_attempts(id) -- null if standalone
mode              text NOT NULL CHECK (mode IN ('post_exam', 'standalone'))
created_at        timestamptz DEFAULT now()
updated_at        timestamptz DEFAULT now()
```

### tutor_messages
```sql
id                uuid PRIMARY KEY DEFAULT gen_random_uuid()
conversation_id   uuid NOT NULL REFERENCES tutor_conversations(id) ON DELETE CASCADE
role              text NOT NULL CHECK (role IN ('user', 'assistant'))
content           text NOT NULL
created_at        timestamptz DEFAULT now()
```

---

## 12. Teacher Question Bank

### teacher_questions
Private questions created by teachers — not in main library.
```sql
id                uuid PRIMARY KEY DEFAULT gen_random_uuid()
teacher_id        uuid NOT NULL REFERENCES profiles(id)
question_type     text NOT NULL CHECK (question_type IN ('written', 'mcq', 'calculation'))
difficulty        text NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard'))
content           jsonb NOT NULL
image_url         text
total_marks       integer NOT NULL DEFAULT 1
subject_tag       text -- freeform tag, not linked to hierarchy
topic_tag         text
created_at        timestamptz DEFAULT now()
updated_at        timestamptz DEFAULT now()
deleted_at        timestamptz
```

---

## Key Relationships Summary
```
profiles
├── teacher_profiles (1:1)
├── student_profiles (1:1)
├── subscriptions (1:1)
├── classes (1:many — teacher owns classes)
├── class_students (many:many — students in classes)
├── course_enrollments (many:many — students enrolled in courses)
├── exam_attempts (1:many — student attempts)
├── student_badges (1:many)
├── xp_transactions (1:many)
└── tutor_conversations (1:many)

qualifications
└── exam_boards
    └── subjects
        └── topics
            └── subtopics
                └── questions (tagged to subtopic)

courses (links to subject)
└── exams
    └── exam_questions (junction — links exams to questions)

exam_attempts
└── question_attempts
    └── evaluation_results
```

---

## RLS Policies Summary

### profiles
- Users can read and update their own profile
- Admin can read and update all profiles

### questions / mark_schemes / marking_points
- Admin can CRUD all
- Teachers can read published questions
- Students can read questions in their enrolled courses

### exams
- Admin can CRUD all
- Teachers can read published exams
- Students can read exams in their enrolled courses

### classes
- Teachers can CRUD their own classes
- Students can read classes they belong to

### exam_attempts / question_attempts
- Students can CRUD their own attempts
- Teachers can read attempts for students in their classes
- Admin can read all

### notifications
- Users can only read their own notifications

### subscriptions
- Users can read their own subscription
- Admin can read and update all