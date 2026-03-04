# ExAIm B2C — User Flows

## Flow Legend
- → next step
- [condition] branching point
- (screen name) screen the user is on

---

## 1. Authentication Flows

### 1.1 Teacher Sign Up
(Landing Page)
→ Click "Sign Up as Teacher"
→ (Sign Up Screen) Enter name, email, password
→ Verify email (email sent by Resend)
→ Click verification link in email
→ (Onboarding Step 1) Choose plan — Free or Paid
  → [Free] continue to step 2
  → [Paid] Stripe payment flow → on success continue to step 2
→ (Onboarding Step 2) Select what you teach
  → Select Qualification → Exam Board → Subject
  → Can select multiple subjects
→ (Onboarding Step 3) Create first class
  → Enter class name
  → Optional year group label
→ (Onboarding Step 4) Invite students
  → Copy invite link
  → Can skip
→ (Onboarding Step 5) Assign first exam
  → Prompted to browse question library and assign
  → Can skip
→ (Teacher Dashboard)

### 1.2 Student Sign Up — Solo
(Landing Page)
→ Click "Sign Up as Student"
→ (Sign Up Screen) Enter name, email, password
→ Verify email
→ Click verification link
→ (Onboarding Step 1) Select course
  → Select Qualification → Exam Board → Subject
  → Can select multiple courses
→ (Onboarding Step 2) Quick profile
  → Name (pre-filled), optional school name
→ (Student Dashboard)
  → Daily challenge card shown prominently
  → Prompted to take first practice paper

### 1.3 Student Sign Up — Invited
(Teacher's Invite Link)
→ [Already has account] → Log in → Auto joined to class → (Student Dashboard)
→ [No account] → (Sign Up Screen) Enter name, email, password
→ Verify email
→ Click verification link
→ Auto joined to teacher's class
→ (Student Dashboard)
  → Assigned exams shown immediately

### 1.4 Login — All Users
(Login Screen)
→ Enter email + password
→ [Admin] → (Admin Dashboard)
→ [Teacher] → (Teacher Dashboard)
→ [Student] → (Student Dashboard)

### 1.5 Forgot Password
(Login Screen)
→ Click "Forgot Password"
→ Enter email
→ Receive reset email (Resend)
→ Click reset link
→ Enter new password
→ Redirected to login
→ Log in with new password

---

## 2. Admin Flows

### 2.1 Content Hierarchy Setup
(Admin Dashboard)
→ Navigate to Content → Qualifications
→ Create Qualification (e.g. GCSE)
→ Navigate to Exam Boards
→ Create Exam Board (e.g. AQA) → link to Qualification
→ Navigate to Subjects
→ Create Subject (e.g. Chemistry) → link to Qual + Board
→ Navigate to Topics
→ Create Topic (e.g. Atomic Structure) → link to Subject
→ Navigate to Sub-topics
→ Create Sub-topic (e.g. Isotopes) → link to Topic

### 2.2 Create Course
(Admin → Content → Courses)
→ Click "Create Course"
→ Select Qualification → Exam Board → Subject
→ Enter course name (e.g. GCSE AQA Chemistry)
→ Set course description
→ Save course (draft)
→ Add exams to course (via exam builder)
→ Publish course

### 2.3 Duplicate Course
(Admin → Content → Courses)
→ Find existing course
→ Click "Duplicate"
→ New draft course created with all exams and questions copied
→ Admin enters new course name
→ Admin removes topics / questions not relevant to new course
→ Publish new course

### 2.4 Create Exam — Manual
(Admin → Content → Exams → Create Exam)
→ Select course
→ Select exam type (topic based / sub-topic based / mixed / past paper style)
→ Select "Manual" creation method
→ Enter exam name and suggested duration
→ Add questions one by one:
  → Choose question type (written, MCQ, calculation)
  → Write question using TipTap rich text + math editor
  → Upload image (optional)
  → Add sub-parts (optional — add part a, b, c...)
  → Per question / part:
    → Set marks
    → Set difficulty
    → Write mark scheme
    → Add marking points (one per mark)
    → Add Claude instruction notes
  → Question auto-saved to question bank
→ Review full exam
→ Tag exam (topics covered, difficulty, year group label)
→ Save as draft or publish

### 2.5 Create Exam — AI Generate
(Admin → Content → Exams → Create Exam)
→ Select course
→ Select exam type
→ Select "AI Generate" creation method
→ Configure generation:
  → Select topics (populated from course hierarchy)
  → Select sub-topics (optional, more specific)
  → Number of questions
  → Difficulty mix (easy / medium / hard ratio)
  → Total marks
  → Question type mix (written / MCQ / calculation)
  → Exam duration
→ Click "Generate"
→ Claude generates full exam (loading state shown)
→ (AI Generated Exam Review Screen)
  → Review each question and mark scheme
  → Edit any question manually
  → Regenerate specific question
  → Delete question
  → Add manual question
  → Pick question from question bank
  → Regenerate entire exam
→ Approve exam
→ All questions auto-saved to question bank
→ Tag and publish

### 2.6 Create Exam — From Question Bank
(Admin → Content → Exams → Create Exam)
→ Select course
→ Select exam type
→ Select "From Question Bank" creation method
→ Enter exam name and duration
→ Search and filter question bank
  → Filter by Subject, Topic, Sub-topic, Difficulty, Type
→ Select questions to add
→ Arrange question order
→ Can also add new manual questions on top
→ Review full exam
→ Tag and publish

### 2.7 Manage Question Bank
(Admin → Content → Question Bank)
→ View all questions in searchable table
→ Filter by Qualification, Board, Subject, Topic, Sub-topic, Difficulty, Type
→ Click question to view / edit
→ See which exams and courses a question belongs to
→ Edit question (applies to future attempts only — past results unchanged)
→ Detach question from shared reference to edit independently for one course

### 2.8 Manage Users
(Admin → Users)
→ View all users in searchable table
→ Filter by role (teacher / student), plan (free / paid), status
→ Click user to view profile and activity
→ Suspend account
→ Reactivate account
→ View subscription status
→ Manually override subscription

### 2.9 Manage Badges
(Admin → Gamification → Badges)
→ View all badge types
→ Create new badge
  → Name, description, icon, colour, criteria
→ Edit existing badge
→ Deactivate badge

### 2.10 Admin Dashboard
(Admin Dashboard)
→ View platform stats:
  → Total teachers, total students
  → Active subscriptions + revenue
  → Daily active users
  → Most popular courses
  → Claude API usage and cost

---

## 3. Teacher Flows

### 3.1 Create a Class
(Teacher Dashboard)
→ Click "Create Class"
→ Enter class name
→ Optional year group label
→ Class created
→ Invite link generated automatically
→ Copy and share invite link with students

### 3.2 Manage Students in Class
(Teacher → Class → Students)
→ View all students in class
→ See each student's submission rate and average score
→ Click student to view detailed progress
→ Remove student from class
  → Confirm removal
  → Student removed, results preserved

### 3.3 Build and Assign Exam
(Teacher → Class → Assignments → Create Assignment)
→ Select class
→ Browse question library
  → Filter by Qualification, Board, Subject, Topic, Sub-topic, Difficulty
→ Select questions to include
→ Review exam (questions, marks, total)
→ Set assignment details:
  → Assignment name
  → Deadline date and time
  → Override exam duration (optional)
→ Assign to class
→ Students notified immediately (in-app + email)

### 3.4 View Assignment Results
(Teacher → Class → Assignments → Select Assignment)
→ See submission overview:
  → Total submitted / total students
  → Class average score
  → Who has not submitted (highlighted)
→ Click individual student
  → See their answers
  → See AI feedback per question
  → See marks awarded per question
→ See class wide weak topics for this assignment

### 3.5 View Student Progress
(Teacher → Class → Students → Select Student)
→ See student's full performance history
→ Score over time chart
→ Weak topics for this student
→ All assignment submissions and scores
→ AI feedback history

### 3.6 Teacher Dashboard Overview
(Teacher Dashboard)
→ Class selector (if multiple classes)
→ Class average score (current week)
→ Recent submissions
→ Students who have not submitted upcoming deadlines
→ Weak topics across class
→ Quick assign button

### 3.7 Manage Subscription
(Teacher → Settings → Billing)
→ View current plan (free / paid)
→ View usage (students added, assignments this month)
→ Upgrade to paid — Stripe checkout
→ View billing history
→ Cancel subscription (downgrades at end of billing period)

---

## 4. Student Flows

### 4.1 Student Dashboard
(Student Dashboard)
→ Streak counter and XP bar at top
→ Daily challenge card
→ Assigned exams (sorted by deadline, soonest first)
→ Weak topic alerts
→ Continue where you left off (last attempted exam)
→ Browse course library button

### 4.2 Take Exam — Practice Mode
(Student → Browse Library → Select Exam)
→ Select Practice Mode
→ Exam begins (no timer)
→ Per question:
  → Read question (and image if present)
  → Use math keyboard if needed
  → Type answer (written / calculation) or select MCQ option
  → Flag for review (optional)
  → Click "Submit Answer"
  → Immediately see:
    → Marks awarded for this question
    → Mark by mark breakdown
    → AI examiner feedback
    → Model answer (collapsible)
    → AI tutor option ("Explain this to me")
  → Click "Next Question"
→ After all questions:
  → See full exam summary
    → Total score
    → Time taken
    → Question by question breakdown
  → AI tutor button prominently shown
  → Retry button
  → Back to library button

### 4.3 Take Exam — Exam Mode
(Student → Browse Library → Select Exam)
→ Select Exam Mode
→ Pre-exam screen:
  → Exam name, total marks, duration
  → Rules reminder (timed, no feedback during exam)
  → Start button
→ Exam begins with countdown timer
→ Per question:
  → Read question (and image if present)
  → Use math keyboard if needed
  → Type answer or select MCQ
  → Flag for review (optional)
  → Navigate freely between questions
→ Timer warning:
  → Amber at 5 minutes remaining
  → Red at 1 minute remaining
→ [All questions attempted] → Submit button appears
→ [Timer runs out] → Auto submitted
→ (Results Screen)
  → Total score shown prominently
  → Colour coded (green / amber / red)
  → Mark by mark breakdown per question
  → AI examiner feedback per question
  → Model answers (collapsible)
  → AI tutor button
  → Retry button

### 4.4 Review Mode
(Results Screen → Click "Review Exam")
→ Go through each question one by one
→ See:
  → Original question
  → Student's answer
  → Correct marks / missed marks
  → AI feedback
  → Model answer
→ Navigate forward and back between questions
→ AI tutor button per question ("Explain this concept")

### 4.5 AI Tutor — Post Exam
(Results Screen → Click "Ask AI Tutor")
→ Chat interface opens
→ Context pre-loaded:
  → Exam topic
  → Questions student got wrong
  → Student's answers
→ Student can ask:
  → "Why did I lose marks on question 3?"
  → "Explain osmosis to me"
  → "How do I calculate this?"
→ Claude responds scoped to the course content
→ Student can continue chatting

### 4.6 AI Tutor — Standalone
(Student Dashboard → Click "AI Tutor")
→ Select which enrolled course to ask about
→ Chat interface opens
→ Student asks questions freely
→ Claude responds scoped to selected course only

### 4.7 Daily Challenge
(Student Dashboard → Daily Challenge Card)
→ One question shown (random from question bank)
→ Always free including freemium users
→ Practice mode only (instant feedback)
→ XP awarded on completion
→ Streak updated if not already done today
→ Can only be completed once per day

### 4.8 Browse Course Library
(Student → Library)
→ Filter by Qualification, Exam Board, Subject
→ See all available exams for enrolled courses
→ Filter by topic, difficulty, exam type
→ Select exam → choose Practice or Exam mode

### 4.9 Manage Enrollments
(Student → Settings → My Courses)
→ View all enrolled courses
→ Enroll in new course
  → Browse Qualification → Board → Subject
  → Confirm enrollment
→ Unenroll from course

### 4.10 Manage Subscription
(Student → Settings → Billing)
→ View current plan (free / paid)
→ View usage (papers taken this month)
→ Upgrade to paid — Stripe checkout
→ View billing history
→ Cancel subscription

### 4.11 Gamification — XP and Levels
(Automatic — triggered by actions)
→ Complete exam → earn XP
→ High score → bonus XP
→ Daily streak → bonus XP
→ XP bar fills on dashboard
→ [Level up] → celebration animation → new level shown
→ Badge earned → notification + badge shown on profile

---

## 5. Notification Flows

### 5.1 Student Notifications
- New assignment → in-app bell + email
- Deadline in 24 hours → in-app bell + email
- AI feedback ready → in-app bell
- Streak about to break → in-app bell + email
- Badge earned → in-app bell

### 5.2 Teacher Notifications
- Student submits assignment → in-app bell + email

---

## 6. Edge Case Flows

### 6.1 Claude API Fails During Evaluation
→ Student submits answer
→ Answer saved to database immediately
→ Claude API call fails
→ Student sees "Your feedback is being processed, check back soon"
→ Background retry job queued
→ Claude retried up to 3 times
→ [Success] → feedback saved → student notified via in-app bell
→ [All retries fail] → admin alerted → manual review flagged

### 6.2 Exam Timer Runs Out
→ Timer hits zero
→ All current answers auto-saved
→ Exam auto-submitted
→ Results screen shown
→ Any unanswered questions marked as 0 marks
→ AI feedback generated for answered questions only

### 6.3 Student Loses Connection During Exam
→ Answers auto-saved every 30 seconds
→ On reconnect → student returns to exam where they left off
→ Timer continues counting down server side
→ [Timer expired while offline] → exam auto submitted with saved answers

### 6.4 Teacher Invite Link Expired
→ Student clicks expired link
→ Screen shown: "This invite link has expired"
→ Prompted to ask teacher for a new link
→ Teacher can regenerate link from class settings

### 6.5 Freemium Limit Reached
→ Student tries to start 4th paper this month on free plan
→ Paywall screen shown
→ Explains what they get with paid plan
→ Upgrade button → Stripe checkout
→ [Upgrades] → exam unlocked immediately
→ [Dismisses] → returned to dashboard

### 6.6 Failed Payment
→ Stripe payment fails
→ User notified via email
→ 3 day grace period — full access maintained
→ [Pays within 3 days] → subscription continues normally
→ [Does not pay] → downgraded to free plan
→ Data preserved — no content deleted