# ExAIm B2C — Full Feature List

## Feature Status Legend
- ✅ v1 — build for launch
- ⏳ v2 — post launch
- ❌ out of scope

---

## Super Admin Features

### Content Management
- ✅ CRUD Qualifications (GCSE, IGCSE, A-Level...)
- ✅ CRUD Exam Boards (AQA, Edexcel, OCR, Cambridge...)
- ✅ CRUD Subjects (Chemistry, Maths, Physics...)
- ✅ CRUD Topics (per subject)
- ✅ CRUD Sub-topics (per topic)
- ✅ AI Hierarchy Generation — admin selects Qualification + Board + Subject + optional variant, Claude generates all topics and sub-topics automatically
- ✅ AI Single Topic Generation — generate sub-topics for one specific topic only
- ✅ Hierarchy review UI — editable tree view after generation (add, edit, delete before saving)
- ✅ Manual hierarchy management always available alongside AI generation
- ✅ CRUD Courses (Qualification + Board + Subject packaged)
- ✅ Duplicate a course (copies all exams and questions)
- ✅ CRUD Exams (manual, AI generated, or from question bank)
- ✅ CRUD Questions (auto saved to question bank on creation)
- ✅ CRUD Question Bank (view, search, reuse existing questions)
- ✅ Add images to questions (uploaded to Supabase Storage)
- ✅ Create multi-part questions (parent + child parts a, b, c...)
- ✅ Set mark scheme per question / per part
- ✅ Set marking points (one per mark)
- ✅ Set Claude instruction notes per question / per part
- ✅ Set question type (written, MCQ, calculation)
- ✅ Set difficulty (easy, medium, hard)
- ✅ Set suggested exam duration
- ✅ Tag questions to Qualification, Board, Subject, Topic, Sub-topic
- ✅ Bulk tagging with session context (set defaults for a creation session)
- ✅ AI exam generation (describe → Claude generates → admin reviews → publish)
- ✅ AI question generation (generate individual questions within exam builder)
- ✅ Question reusability across courses (referenced not copied)
- ✅ Detach question from shared reference to edit independently
- ✅ Course duplication (duplicate and trim for similar courses)
- ⏳ PDF import of past papers

### Exam Types Supported
- ✅ Topic based exam
- ✅ Sub-topic based exam
- ✅ Mixed / Full paper (questions from multiple topics)
- ✅ Past paper style (follows real exam board format)

### Exam Creation Methods
- ✅ Manual (rich text + math editor)
- ✅ AI Generate (Claude generates full exam → admin reviews)
- ✅ From Question Bank (pick existing questions)
- ✅ Mixed (combine all three methods in one exam)

### User Management
- ✅ View all users (teachers + students)
- ✅ Search and filter users
- ✅ Suspend / reactivate accounts
- ✅ View user subscription status
- ✅ Manually override subscription if needed

### Gamification Management
- ✅ CRUD Badges (create new badge types, set criteria)
- ✅ View XP leaderboard across platform

### Platform Configuration
- ✅ Configure freemium limits (free papers per month, max free students etc.)
- ✅ Configure daily challenge question (or set to auto-select)

### Admin Dashboard
- ✅ Total users (teachers + students)
- ✅ Active subscriptions + revenue overview
- ✅ Most popular courses
- ✅ Daily active users
- ✅ Claude API usage and cost tracking

---

## Teacher Features

### Account & Onboarding
- ✅ Sign up with email + password
- ✅ Email verification before access
- ✅ Onboarding flow:
  - Choose plan (free to start)
  - Select what they teach (Qualification → Board → Subject)
  - Create first class
  - Get invite link
  - Prompted to assign first exam
- ✅ Profile — name, profile picture, email, password
- ✅ Notification preferences

### Class Management
- ✅ Create a class (name, optional year group label)
- ✅ Multiple classes supported
- ✅ Generate student invite link (expires 7 days, unlimited uses, regeneratable)
- ✅ View all students in class
- ✅ Remove student from class (results preserved, soft removal)
- ✅ Delete class (soft delete — archived and restorable)
- ✅ Restore archived class

### Exam & Assignment Management
- ✅ Build custom exams from the ExAIm question library
- ✅ Pick questions by Qualification, Board, Subject, Topic, Sub-topic, Difficulty
- ✅ Assign exam to a class with deadline
- ✅ Override suggested exam duration when assigning
- ✅ View all assignments per class
- ✅ See submission status per student (submitted / not submitted)
- ✅ View individual student results and AI feedback
- ✅ Teacher private question bank (their own questions, not in main library)

### Analytics & Insights
- ✅ Class average score over time
- ✅ Individual student progress
- ✅ Weak topics across the whole class (ranked list)
- ✅ Who has not submitted (highlighted)
- ✅ Student comparison (private — teacher eyes only)

### Subscription & Billing
- ✅ Free plan (up to 5 students, 3 assignments/month, basic analytics)
- ✅ Paid plan (unlimited students, unlimited assignments, full analytics)
- ✅ Upgrade via Stripe
- ✅ Manage billing and subscription in settings
- ✅ Failed payment → 3 day grace period → downgrade to free
- ✅ No refunds policy (stated in terms and conditions)

### Notifications
- ✅ In-app — student submits an assignment
- ✅ Email — student submits an assignment
- ✅ In-app + email notification preferences in settings

---

## Student Features

### Account & Onboarding

#### Solo Student
- ✅ Sign up with email + password
- ✅ Email verification before access
- ✅ Onboarding flow:
  - Select course (Qualification → Board → Subject)
  - Quick profile (name, optional school)
  - Shown course library and daily challenge
  - Prompted to take first practice paper

#### Invited Student
- ✅ Click teacher invite link
- ✅ Sign up or log in
- ✅ Auto joined to teacher's class
- ✅ Immediately sees assigned exams

### Course Enrollment
- ✅ Enroll in multiple courses
- ✅ Browse course library (Qualification → Board → Subject)
- ✅ Invited students also get access to solo course library

### Exam Taking
- ✅ Browse exams by course, topic, sub-topic, difficulty
- ✅ Two attempt modes:
  - **Practice mode** — answer question → instant AI feedback per question → move on
  - **Exam mode** — timed, answer all → submit whole paper → see full results
- ✅ Question navigation (jump between questions)
- ✅ Flag questions for review
- ✅ Auto save answers as student types
- ✅ Timer in exam mode (amber under 5 mins, red under 1 min)
- ✅ Auto submit when timer runs out in exam mode
- ✅ Retry any exam
- ✅ Review mode after submission (go through all questions and feedback)
- ✅ See model answers after submission
- ✅ See AI examiner feedback after submission

### Question Types Supported
- ✅ Written / open ended
- ✅ Multiple choice (MCQ)
- ✅ Calculation based
- ❌ Diagram labelling (v2)

### Math & Science Input
- ✅ Custom math keyboard for equation input
- ✅ Subscript and superscript buttons
- ✅ KaTeX rendering of all math in questions and feedback
- ✅ Chemical notation support

### AI Features
- ✅ AI examiner feedback on every submitted answer
- ✅ Mark by mark breakdown
- ✅ Improvement suggestions
- ✅ AI tutor chatbot — post exam mode (explains mistakes, teaches concepts)
- ✅ AI tutor chatbot — standalone mode (ask anything about enrolled course)

### Gamification
- ✅ XP points (earned per exam, bonus for high scores, streaks, improvement)
- ✅ Level system (Beginner → Bronze → Silver → Gold → Distinction)
- ✅ Daily streak (practice every day)
- ✅ Badges:
  - First exam completed
  - 7 day streak
  - First full marks
  - Most improved this week
  - Topic mastered (80%+ across all questions in a sub-topic)
- ✅ Daily challenge (one free question per day — always free including freemium)
- ✅ Smart leaderboard (most improved — optional, teacher controlled for class)

### Progress & Analytics
- ✅ Predicted grade (based on performance over time)
- ✅ Weak topic alerts (shown on dashboard when student consistently loses marks)
- ✅ Performance tracking over time (scores per exam, per topic)
- ✅ Topic by topic gap analysis (paid feature)

### Subscription & Billing
- ✅ Free plan:
  - 3 practice papers per month
  - Basic score and simple feedback
  - Daily challenge always free
- ✅ Paid plan:
  - Unlimited practice papers
  - Full AI examiner feedback
  - Performance tracking
  - Topic gap analysis
- ✅ Upgrade via Stripe
- ✅ Manage subscription in settings
- ✅ Failed payment → 3 day grace period → downgrade to free

### Notifications
- ✅ New assignment from teacher
- ✅ Deadline reminder (24 hours before)
- ✅ AI feedback ready
- ✅ Streak alert (nudge when streak about to break)
- ✅ Badge earned
- ✅ In-app notification bell
- ✅ Email notifications
- ✅ Notification preferences in settings

### Settings & Profile
- ✅ Profile picture, name, email, password
- ✅ Current courses (view and manage enrollments)
- ✅ Subscription management
- ✅ Notification preferences

---

## Shared Features (All Users)

### Authentication
- ✅ Email + password sign up
- ✅ Email verification mandatory
- ✅ Login / logout
- ✅ Forgot password / reset password
- ✅ Session management via Supabase Auth

### Search
- ✅ Students — search courses and topics
- ✅ Teachers — search questions when building exam
- ✅ Admin — search everything

### Dark Mode
- ✅ Available from day one
- ✅ Respects system preference by default
- ✅ Manual toggle in settings

---

## Out of Scope for v1
- ❌ Mobile app
- ❌ Parent portal
- ❌ Diagram labelling question type
- ❌ PDF import of past papers
- ❌ Tab switching detection (exam integrity)
- ❌ Real-time collaboration
- ❌ Social features (follow, share)
- ❌ School/institution accounts (that's B2B)