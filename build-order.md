# ExAIm B2C — Build Order

## Philosophy
- Build in vertical slices — each phase produces working, testable functionality
- Never build UI without the API and database behind it
- Never build features that depend on unbuilt features
- Test each phase before moving to the next
- Commit to GitHub after every completed phase

---

## Phase 0 — Project Setup
**Goal:** Working Next.js project connected to all services

### Steps
- [ ] Initialise Next.js 16 project with TypeScript
```bash
  npx create-next-app@latest exaim-b2c --typescript --tailwind --app
```
- [ ] Install and configure shadcn/ui
- [ ] Set up Tailwind config with design system tokens
  - Custom colours from spec/design-system.md
  - Custom border radius
  - Custom font (Inter)
- [ ] Create Supabase project (Frankfurt region)
- [ ] Install Supabase packages
```bash
  npm install @supabase/supabase-js @supabase/ssr
```
- [ ] Set up Supabase client (browser + server + middleware)
- [ ] Configure .env.local with all environment variables
- [ ] Set up middleware for auth protection
- [ ] Install remaining packages:
```bash
  npm install katex @tiptap/react @tiptap/starter-kit
  npm install zod resend stripe
  npm install @anthropic-ai/sdk
```
- [ ] Create folder structure as per .cursor/rules
- [ ] Configure .gitignore
- [ ] Push to GitHub
- [ ] Deploy to Vercel (connect GitHub repo)
- [ ] Add environment variables to Vercel

**Deliverable:** Deployed Next.js app connected to Supabase, Vercel CI/CD working

---

## Phase 1 — Database Schema
**Goal:** Full database schema created in Supabase

### Steps
- [ ] Create all tables in order (respecting foreign key dependencies):
  1. profiles (extends auth.users)
  2. teacher_profiles
  3. student_profiles
  4. subscriptions
  5. notification_preferences
  6. qualifications
  7. exam_boards
  8. subjects
  9. topics
  10. subtopics
  11. courses
  12. questions
  13. mark_schemes
  14. marking_points
  15. mcq_options
  16. exams
  17. exam_questions
  18. classes
  19. class_students
  20. assignments
  21. course_enrollments
  22. exam_attempts
  23. question_attempts
  24. evaluation_results
  25. badges
  26. student_badges
  27. xp_transactions
  28. daily_challenges
  29. daily_challenge_attempts
  30. notifications
  31. notification_preferences
  32. tutor_conversations
  33. tutor_messages
  34. teacher_questions
  35. claude_api_logs
- [ ] Add all indexes:
  - profiles(role)
  - questions(subject_id, topic_id, subtopic_id, difficulty)
  - exam_attempts(student_id, exam_id)
  - question_attempts(exam_attempt_id)
  - notifications(user_id, is_read)
  - class_students(class_id, student_id)
  - course_enrollments(student_id, course_id)
- [ ] Generate Supabase TypeScript types
```bash
  npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/database.ts
```
- [ ] Set up RLS policies for all tables

**Deliverable:** Complete database schema with RLS, TypeScript types generated

---

## Phase 2 — Authentication
**Goal:** Working sign up, login, email verification, role based routing

### Steps
- [ ] Build auth API routes:
  - POST /api/auth/signup
  - POST /api/auth/verify-email
  - POST /api/auth/forgot-password
  - POST /api/auth/reset-password
- [ ] Set up Resend for transactional emails:
  - Verification email template
  - Password reset email template
- [ ] Build auth UI screens:
  - Login screen
  - Sign up screen (teacher / student choice)
  - Email verification pending screen
  - Forgot password screen
  - Reset password screen
- [ ] Set up middleware:
  - Redirect unauthenticated users to login
  - Redirect authenticated users away from auth pages
  - Role based route protection
  - Block suspended accounts
- [ ] Build basic dashboard shells:
  - Admin dashboard shell (layout + sidebar)
  - Teacher dashboard shell (layout + sidebar)
  - Student dashboard shell (layout + sidebar)
- [ ] Test all auth flows end to end

**Deliverable:** Full auth system working, users can sign up, verify email, log in, and land on correct dashboard

---

## Phase 3 — Admin Content Hierarchy
**Goal:** Admin can create and manage the full content hierarchy with AI assistance

### Steps
- [ ] Build admin layout and sidebar navigation
- [ ] Build CRUD UI and API routes for:
  - Qualifications
  - Exam Boards
  - Subjects
  - Topics
  - Sub-topics
- [ ] Build AI Hierarchy Generation:
  - Generation form (Qualification, Board, Subject, Variant)
  - API route POST /api/admin/ai/generate-hierarchy
  - Claude generation prompt
  - Parse and validate response
  - Editable tree review UI:
    - Add topic
    - Edit topic name
    - Delete topic
    - Add sub-topic per topic
    - Edit sub-topic name
    - Delete sub-topic
    - Reorder topics and sub-topics
  - Confirm and save (POST /api/admin/ai/confirm-hierarchy)
- [ ] Build Single Topic Sub-topic Generation:
  - "Generate sub-topics" button per topic
  - API route POST /api/admin/ai/generate-subtopics
  - Review and confirm flow
- [ ] Build Courses CRUD
- [ ] Seed initial data using AI generation:
  - GCSE AQA Chemistry (Triple)
  - GCSE AQA Chemistry (Combined)
  - GCSE AQA Biology (Triple)
  - GCSE AQA Biology (Combined)
  - GCSE AQA Physics (Triple)
  - GCSE AQA Physics (Combined)
  - GCSE AQA Maths
  - IGCSE Cambridge Chemistry
  - IGCSE Cambridge Maths
- [ ] Add rate limiting (20 hierarchy generation calls per admin per hour)
- [ ] Test all CRUD and AI generation flows

**Deliverable:** Admin can build full content hierarchy manually or via AI generation,
initial seed data in place for all launch courses

## Phase 4 — Math & Rich Text Editor
**Goal:** Working TipTap editor with math support and KaTeX rendering

### Steps
- [ ] Set up TipTap editor component with:
  - Basic formatting (bold, italic, underline)
  - Headings
  - Lists
  - Math extension (LaTeX input)
  - Image embedding
- [ ] Build math toolbar:
  - Fractions
  - Powers / superscript
  - Subscript
  - Square roots
  - Common symbols (×, ÷, ±, ≤, ≥, →)
  - Greek letters (α, β, γ, λ, μ)
  - Chemical notation helpers
- [ ] Set up KaTeX rendering component
  - Renders TipTap JSON content with math
  - Used everywhere content is displayed (not edited)
- [ ] Build student math keyboard:
  - Floating toolbar activated by button
  - Same math options as admin toolbar
  - Outputs to student answer text area
- [ ] Test editor and rendering across question types

**Deliverable:** Admin can write rich text questions with math, students can input math answers, all renders correctly with KaTeX

---

## Phase 5 — Question Bank & Exam Builder (Manual)
**Goal:** Admin can create questions and build exams manually

### Steps
- [ ] Build question creation form:
  - Question type selector
  - Difficulty selector
  - Subject / Topic / Sub-topic selectors
  - TipTap editor for question content
  - Image upload (Supabase Storage)
  - Sub-parts builder (add part a, b, c...)
  - Mark scheme builder:
    - Model answer
    - Marking points (add / remove / reorder)
    - Claude notes field
  - MCQ options builder (if MCQ type)
  - Marks input
- [ ] Build question bank view:
  - Searchable, filterable table
  - Filter by subject, topic, subtopic, difficulty, type
  - Click to view / edit question
  - See which exams use this question
- [ ] Build exam builder (manual mode):
  - Exam name, type, duration inputs
  - Add questions from question bank
  - Search and filter question bank inline
  - Arrange question order (drag and drop)
  - Add new manual question inline
  - Mark scheme review per question
  - Total marks calculator
  - Save as draft / publish
- [ ] Build exam question detach feature
- [ ] Build API routes:
  - All question CRUD routes
  - All exam CRUD routes
  - Question bank search
  - Image upload
- [ ] Test full exam creation flow manually

**Deliverable:** Admin can create questions, build exams manually, manage question bank

---

## Phase 6 — AI Exam & Question Generation
**Goal:** Admin can generate exams and questions using Claude

### Steps
- [ ] Set up Claude API client in src/lib/claude/
- [ ] Build exam generation:
  - Generation config form (topics, difficulty mix, question types, marks)
  - API route POST /api/admin/ai/generate-exam
  - Claude generation prompt (from spec/ai-evaluation.md)
  - Parse and validate Claude response
  - Save as draft exam for review
- [ ] Build AI exam review UI:
  - Show all generated questions
  - Edit any question inline
  - Regenerate specific question
  - Delete question
  - Add manual question
  - Regenerate whole exam
  - Approve exam button
- [ ] Build question generation:
  - Generate single question button in exam builder
  - API route POST /api/admin/ai/generate-question
  - Review and approve flow
- [ ] Build approval routes:
  - POST /api/admin/ai/approve-question/[id]
  - POST /api/admin/ai/approve-exam/[id]
- [ ] Add rate limiting to generation routes
- [ ] Add claude_api_logs tracking
- [ ] Test AI generation with real Claude API

**Deliverable:** Admin can generate full exams and individual questions with Claude, review and approve before publishing

---

## Phase 7 — Course Management & Publishing
**Goal:** Admin can package exams into courses and publish them

### Steps
- [ ] Build course management UI:
  - Create course form
  - Link exams to course
  - Course duplication feature
  - Publish / unpublish course
- [ ] Build course duplication logic:
  - Copy all exams and exam_question references
  - Set duplicated_from reference
  - Save as draft
- [ ] Test course creation, duplication, publishing

**Deliverable:** Admin can create, manage, duplicate and publish courses

---

## Phase 8 — Teacher Classes & Assignments
**Goal:** Teachers can create classes, invite students, and assign exams

### Steps
- [ ] Build teacher dashboard
- [ ] Build class management:
  - Create class form
  - Class list view
  - Invite link generation and display
  - Regenerate invite link
  - Student list per class
  - Remove student from class
  - Archive / restore class
- [ ] Build assignment management:
  - Create assignment (select exam, set deadline, override duration)
  - Assignment list per class
  - Submission overview per assignment
  - View individual student results
- [ ] Build teacher analytics:
  - Class average score
  - Weak topics across class
  - Who has not submitted
  - Individual student progress
- [ ] Build API routes:
  - All class routes
  - All assignment routes
  - Results routes
- [ ] Test full teacher flow end to end

**Deliverable:** Teachers can create classes, invite students, assign exams, view results

---

## Phase 9 — Student Onboarding & Course Enrollment
**Goal:** Students can sign up, enroll in courses, and join classes

### Steps
- [ ] Build student onboarding flow:
  - Solo student — course selection
  - Quick profile setup
- [ ] Build join class via invite link flow:
  - Handle invite token in URL
  - Auto-join after auth
- [ ] Build course library:
  - Browse by Qualification, Board, Subject
  - Enroll / unenroll
- [ ] Build student dashboard shell:
  - Enrolled courses
  - Assigned exams (sorted by deadline)
  - Empty states
- [ ] Build API routes:
  - Enrollment routes
  - Join class route
- [ ] Test both onboarding flows

**Deliverable:** Students can onboard, enroll in courses, join teacher classes

---

## Phase 10 — Exam Taking Experience
**Goal:** Students can take exams in both practice and exam mode

### Steps
- [ ] Build exam taking layout:
  - Distraction-free full screen layout
  - Progress bar and question counter
  - Flag for review button
  - Navigation between questions
  - Timer component (exam mode)
  - Math keyboard integration
  - Auto-save (every 30 seconds)
- [ ] Build practice mode:
  - Per question submit
  - Show evaluation result immediately after each question
  - Model answer (collapsible)
  - Next question flow
  - End of exam summary
- [ ] Build exam mode:
  - Timed countdown
  - Timer colour changes (amber 5 min, red 1 min)
  - Auto submit on timer expiry
  - Full submit button (after all attempted)
  - Results screen after submission
- [ ] Build results screen:
  - Total score prominently shown
  - Colour coded score
  - Per question breakdown
  - AI feedback display (formatted)
  - Model answers (collapsible)
  - Retry button
  - Review mode button
- [ ] Build review mode:
  - Go through questions one by one
  - Show answer, feedback, model answer
  - Forward / back navigation
- [ ] Build API routes:
  - POST /api/student/attempts
  - PATCH /api/student/attempts/[id]/answer
  - POST /api/student/attempts/[id]/submit
  - GET /api/student/attempts/[id]/results
- [ ] Handle edge cases:
  - Connection loss / resume
  - Refresh page / resume
  - Duplicate attempt prevention
- [ ] Test complete exam flow in both modes

**Deliverable:** Students can take exams in practice and exam mode, see results and feedback

---

## Phase 11 — Claude Evaluation
**Goal:** Claude evaluates student answers and returns structured feedback

### Steps
- [ ] Build evaluation service (src/lib/claude/evaluation.ts)
- [ ] Implement evaluation payload builder:
  - Text questions
  - Image questions (vision)
  - Sub-part questions with parent context
  - Error carried forward logic
- [ ] Build evaluation system prompt
- [ ] Build retry logic (3 retries, exponential backoff)
- [ ] Build background evaluation for exam mode
- [ ] Build evaluation result display components:
  - Mark by mark breakdown checklist
  - Feedback card (styled distinctly)
  - Improvement tip
- [ ] Add rate limiting (60 calls per user per hour)
- [ ] Add claude_api_logs tracking
- [ ] Handle all evaluation edge cases from spec/edge-cases.md
- [ ] Test evaluation with real questions and answers

**Deliverable:** Claude evaluates student answers, feedback displayed on results screen

---

## Phase 12 — AI Tutor
**Goal:** Students can chat with AI tutor post-exam and standalone

### Steps
- [ ] Build tutor conversation API routes:
  - POST /api/student/tutor/conversations
  - POST /api/student/tutor/conversations/[id]/messages
  - GET /api/student/tutor/conversations/[id]
- [ ] Build tutor service (src/lib/claude/tutor.ts)
- [ ] Build post-exam system prompt builder
- [ ] Build standalone system prompt builder
- [ ] Build tutor chat UI:
  - Chat interface (messages, input, send button)
  - Typing indicator
  - Message history
  - Course scope indicator
- [ ] Integrate with results screen (post-exam button)
- [ ] Integrate with student dashboard (standalone button)
- [ ] Test tutor in both modes

**Deliverable:** Students can chat with AI tutor after exams and standalone

---

## Phase 13 — Gamification
**Goal:** XP, levels, streaks, badges, daily challenge working

### Steps
- [ ] Build XP system:
  - Award XP on exam completion
  - Bonus XP for high scores and streaks
  - XP transaction logging
- [ ] Build level system:
  - Define XP thresholds per level
  - Calculate level from total XP
  - Level up detection and celebration UI
- [ ] Build streak system:
  - Update streak on daily challenge completion
  - Break streak if day missed
  - Streak display on dashboard
- [ ] Build badge system:
  - Define all badge criteria
  - Check and award badges after exam completion
  - Badge display on profile
- [ ] Build daily challenge:
  - Admin sets or auto-selects daily question
  - Student sees daily challenge card on dashboard
  - Complete once per day
  - Awards XP and updates streak
- [ ] Build gamification UI:
  - XP bar with animation
  - Streak counter with flame icon
  - Badges grid on profile
  - Level display
  - Smart leaderboard (most improved, teacher controlled)
- [ ] Build gamification API routes
- [ ] Test all gamification flows

**Deliverable:** Full gamification system working — XP, levels, streaks, badges, daily challenge

---

## Phase 14 — Notifications
**Goal:** In-app and email notifications working

### Steps
- [ ] Build notification creation service
- [ ] Build in-app notification bell:
  - Unread count badge
  - Notification dropdown
  - Mark as read
  - Mark all as read
- [ ] Build email templates with Resend:
  - New assignment
  - Deadline reminder (24 hours)
  - Feedback ready
  - Streak alert
  - Badge earned
  - Payment failed
  - Subscription downgraded
- [ ] Build deadline reminder job:
  - Check assignments with deadline in 24 hours
  - Send reminders to students who haven't submitted
  - Use Supabase cron or Vercel cron
- [ ] Build streak alert job:
  - Check students who haven't practiced today
  - Send streak alert notification
- [ ] Build notification preference management UI
- [ ] Build API routes:
  - GET /api/notifications
  - PATCH /api/notifications/[id]/read
  - PATCH /api/notifications/read-all
- [ ] Test all notification flows

**Deliverable:** Full notification system — in-app bell and email notifications

---

## Phase 15 — Payments & Subscriptions
**Goal:** Stripe payments, freemium limits, subscription management

### Steps
- [ ] Set up Stripe account and products:
  - Teacher paid plan (monthly)
  - Student paid plan (monthly)
- [ ] Build payment API routes:
  - POST /api/payments/create-checkout
  - POST /api/payments/webhook
  - GET /api/payments/billing
- [ ] Build Stripe webhook handler:
  - checkout.session.completed
  - invoice.payment_failed
  - customer.subscription.deleted
- [ ] Implement freemium limit checks:
  - Student paper limit (3/month)
  - Teacher student limit (5)
  - Teacher assignment limit (3/month)
- [ ] Build paywall UI:
  - Paywall modal
  - Upgrade flow
  - Billing settings page
- [ ] Build grace period handling:
  - Persistent banner for payment failed
  - 3 day grace period logic
  - Downgrade on expiry
- [ ] Test all payment flows with Stripe test mode

**Deliverable:** Full payment system — freemium limits, Stripe checkout, webhooks, grace period

---

## Phase 16 — Admin Dashboard & User Management
**Goal:** Admin has full platform visibility and control

### Steps
- [ ] Build admin dashboard:
  - Platform stats (users, revenue, DAU)
  - Popular courses
  - Claude API usage and cost
- [ ] Build user management:
  - User search and filter table
  - View user profile
  - Suspend / reactivate
  - Override subscription
- [ ] Build badge management:
  - Create / edit badges
  - View earned badges across platform
- [ ] Build failed evaluation review:
  - List of failed evaluations
  - Manual review interface
- [ ] Build freemium config UI
- [ ] Test admin flows

**Deliverable:** Full admin panel with analytics, user management, and platform controls

---

## Phase 17 — Progress & Analytics
**Goal:** Predicted grades, weak topic alerts, performance tracking

### Steps
- [ ] Build predicted grade calculator:
  - Calculate from last 5+ attempts per course
  - Map percentage to grade (A*, A, B, C, D, E, F)
  - Show on student dashboard and results screen
  - Show only after 3+ completed exams
- [ ] Build weak topic detection:
  - Calculate average score per topic across all attempts
  - Flag topics below 60% average
  - Show on student dashboard as alert cards
  - Show on teacher dashboard for whole class
- [ ] Build performance tracking:
  - Score over time chart per course
  - Topic by topic breakdown
  - Attempt history table
- [ ] Build analytics API routes
- [ ] Test analytics with real exam data

**Deliverable:** Predicted grades, weak topic alerts, performance charts working

---

## Phase 18 — Polish & Launch Preparation
**Goal:** App is production ready

### Steps
- [ ] Design polish:
  - Review every screen against spec/design-system.md
  - Fix any inconsistencies
  - Ensure dark mode works everywhere
  - Add all missing empty states, loading states, error states
  - Smooth animations and transitions
- [ ] Performance:
  - Add database indexes where needed
  - Implement pagination on all list views
  - Add loading skeletons on all data fetching
  - Test with realistic data volumes
- [ ] Security review:
  - Verify all RLS policies
  - Test all API routes for unauthorised access
  - Verify rate limiting works
  - Verify no sensitive data in client responses
- [ ] Error handling review:
  - Every API route has proper error handling
  - User facing errors are friendly
  - All Claude failures handled gracefully
- [ ] Cross-browser testing:
  - Chrome, Firefox, Safari, Edge
  - Desktop and tablet sizes
- [ ] Accessibility:
  - Basic WCAG compliance
  - Keyboard navigation
  - Colour contrast check
- [ ] Set up monitoring:
  - Vercel analytics
  - Supabase dashboard alerts
  - Claude API cost alerts
- [ ] Final Supabase setup:
  - Upgrade to Pro plan
  - Configure backups
  - Set up connection pooling
- [ ] Environment variables:
  - All production keys set in Vercel
  - Stripe webhook configured for production URL
  - Resend domain verified
- [ ] Soft launch:
  - Invite Shaun and small group to test
  - Fix critical issues
  - Full launch

**Deliverable:** Production ready ExAIm B2C

---

## Dependency Map
```
Phase 0 (Setup)
└── Phase 1 (Database)
    └── Phase 2 (Auth)
        ├── Phase 3 (Content Hierarchy)
        │   └── Phase 4 (Math Editor)
        │       └── Phase 5 (Question Bank + Manual Exam Builder)
        │           ├── Phase 6 (AI Generation)
        │           └── Phase 7 (Course Management)
        │               ├── Phase 8 (Teacher Classes)
        │               │   └── Phase 9 (Student Onboarding)
        │               │       └── Phase 10 (Exam Taking)
        │               │           └── Phase 11 (Claude Evaluation)
        │               │               ├── Phase 12 (AI Tutor)
        │               │               ├── Phase 13 (Gamification)
        │               │               └── Phase 17 (Analytics)
        │               └── Phase 14 (Notifications)
        └── Phase 15 (Payments)
            └── Phase 16 (Admin Dashboard)
                └── Phase 18 (Polish + Launch)
```

---

## Current Phase
**Phase 0 — Project Setup**
Start here. Check off each step as you complete it.