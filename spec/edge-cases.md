# ExAIm B2C — Edge Cases & Handling

## 1. Authentication & Access

### 1.1 Unverified Email Access
- **Scenario:** User signs up but tries to access app before verifying email
- **Handling:** Middleware blocks access, redirects to "Verify your email" screen
- **UI:** Show resend verification email button

### 1.2 Suspended Account Login
- **Scenario:** Suspended user tries to log in
- **Handling:** Auth succeeds but middleware blocks access
- **UI:** Show "Your account has been suspended. Contact support." message

### 1.3 Expired Session
- **Scenario:** User's session expires while using the app
- **Handling:** Supabase Auth auto-refreshes token. If refresh fails, redirect to login
- **UI:** Show "Session expired, please log in again" toast

### 1.4 Role Mismatch
- **Scenario:** Teacher tries to access student routes or vice versa
- **Handling:** Middleware checks role from database, never trusts client
- **UI:** Redirect to correct dashboard, show 403 error if route doesn't exist for role

### 1.5 Invite Link — Already in Class
- **Scenario:** Student clicks invite link but is already in the class
- **Handling:** Check class_students table, if already member skip creation
- **UI:** Show "You are already in this class" message, redirect to dashboard

### 1.6 Invite Link — Expired
- **Scenario:** Student clicks expired invite link
- **Handling:** Check invite_expires_at, if past current time reject
- **UI:** Show "This invite link has expired. Ask your teacher for a new one."

### 1.7 Invite Link — Student Not Logged In
- **Scenario:** Student clicks invite link without being logged in
- **Handling:** Save invite token to session storage, redirect to login/signup
- **UI:** After auth, retrieve token and auto-join class

---

## 2. Freemium & Payments

### 2.1 Freemium Limit Reached — Student
- **Scenario:** Student on free plan tries to start 4th paper this month
- **Handling:** Check attempt count before creating attempt, block if exceeded
- **UI:** Show paywall modal with upgrade prompt, do not create attempt record

### 2.2 Freemium Limit Reached — Teacher
- **Scenario:** Teacher on free plan tries to add 6th student or create 4th assignment
- **Handling:** Check limits before action, block if exceeded
- **UI:** Show paywall modal with upgrade prompt

### 2.3 Payment Failed — Grace Period
- **Scenario:** Stripe payment fails on renewal
- **Handling:** Set status = grace_period, set grace_period_ends_at = now + 3 days
- **UI:** Show persistent banner "Payment failed — update your payment method to keep access"
- **Email:** Send payment failed email immediately

### 2.4 Grace Period Expired
- **Scenario:** User doesn't pay within 3 day grace period
- **Handling:** Downgrade to free plan, preserve all data
- **UI:** Show "Your subscription has expired. Upgrade to restore full access."
- **Email:** Send downgrade confirmation email

### 2.5 Stripe Webhook Failure
- **Scenario:** Stripe webhook doesn't reach our server
- **Handling:** Stripe retries webhooks automatically for 3 days
- **Logging:** Log all webhook events and failures

### 2.6 Double Payment
- **Scenario:** User clicks upgrade button twice and two Stripe sessions created
- **Handling:** Use Stripe idempotency keys, check for existing active subscription before creating checkout
- **UI:** Disable upgrade button after first click

---

## 3. Exam Taking

### 3.1 Student Loses Connection During Exam
- **Scenario:** Internet drops while taking an exam
- **Handling:** Auto-save answers to database every 30 seconds
- **UI:** Show "Saving..." indicator, show "Connection lost — your answers are saved" if offline detected
- **On reconnect:** Resume exam from last saved state, timer continues server-side

### 3.2 Timer Expires — Unanswered Questions
- **Scenario:** Exam mode timer runs out with unanswered questions
- **Handling:** Auto-submit all saved answers, mark unanswered questions as 0 marks
- **UI:** Show "Time's up — your exam has been submitted" screen
- **Evaluation:** Only evaluate answered questions, unanswered get 0 automatically

### 3.3 Student Refreshes Page During Exam
- **Scenario:** Student accidentally refreshes browser mid-exam
- **Handling:** Detect in_progress attempt on page load, restore exam state
- **UI:** Show "Resuming your exam..." briefly, restore answers and timer

### 3.4 Student Tries to Start Same Exam Twice
- **Scenario:** Student tries to start an exam they have already in_progress
- **Handling:** Check for existing in_progress attempt before creating new one
- **UI:** Show "You have an attempt in progress" with resume button

### 3.5 Exam Has No Questions
- **Scenario:** Admin published an exam with no questions
- **Handling:** Validate question count > 0 before allowing publish
- **UI:** Admin sees validation error "Exam must have at least one question"

### 3.6 Practice Mode — Skipping Questions
- **Scenario:** Student tries to go to next question without answering in practice mode
- **Handling:** Allow skipping — not all questions need to be answered before moving
- **UI:** Show "You haven't answered this question — are you sure you want to skip?" confirmation

### 3.7 MCQ — No Option Selected
- **Scenario:** Student tries to submit MCQ without selecting an option
- **Handling:** Prevent submission until option selected
- **UI:** Show "Please select an answer" validation message

### 3.8 Answer Too Long
- **Scenario:** Student pastes an extremely long answer (e.g. 10,000 words)
- **Handling:** Enforce max character limit (e.g. 5,000 characters per answer)
- **UI:** Show character counter, show error if limit exceeded

---

## 4. AI Evaluation

### 4.1 Claude API Timeout
- **Scenario:** Claude API call takes too long and times out
- **Handling:** Set 30 second timeout on evaluation calls, treat as failure, retry
- **UI:** Show "Feedback is being processed — check back soon"

### 4.2 Claude API Rate Limited
- **Scenario:** Too many API calls hit Anthropic rate limits
- **Handling:** Queue evaluation requests, retry with exponential backoff
- **UI:** Show "Feedback is being processed — check back soon"

### 4.3 Claude Returns Invalid JSON
- **Scenario:** Claude response cannot be parsed as valid JSON
- **Handling:** Retry up to 3 times, if all fail mark evaluation_status = failed
- **Logging:** Log raw Claude response for debugging

### 4.4 Claude Awards More Marks Than Available
- **Scenario:** Claude returns marks_awarded > marks_available
- **Handling:** Cap marks_awarded at marks_available in post-processing
- **Logging:** Log incident for prompt improvement

### 4.5 All Evaluation Retries Fail
- **Scenario:** Claude fails 3 times for same question
- **Handling:** Mark question_attempt evaluation_status = failed, alert admin
- **UI:** Show "We had trouble evaluating this question. Our team has been notified."
- **Admin:** See failed evaluations in admin dashboard for manual review

### 4.6 Image Cannot Be Loaded by Claude
- **Scenario:** Question has image_url but image is inaccessible during evaluation
- **Handling:** Catch image fetch error, proceed with text-only evaluation, note in Claude notes
- **Logging:** Log image URL failure for storage debugging

### 4.7 Evaluation During High Load
- **Scenario:** Many students submit exams simultaneously (e.g. class all submits at once)
- **Handling:** Queue evaluations, process concurrently but within rate limits
- **UI:** Show "Your results are being processed" with estimated wait time if queue is long

---

## 5. Admin Content Management

### 5.1 Deleting a Topic With Active Questions
- **Scenario:** Admin tries to delete a topic that has questions in published exams
- **Handling:** Block deletion, show warning
- **UI:** "This topic has X questions used in published exams. Deactivate it instead."

### 5.2 Editing a Shared Question
- **Scenario:** Admin edits a question used in multiple exams
- **Handling:** Show warning before saving, change applies to all exams using this question
- **UI:** "This question is used in X exams. Editing will affect all of them. To edit for one exam only, detach it first."

### 5.3 Publishing Exam Without Mark Schemes
- **Scenario:** Admin tries to publish exam where some questions have no mark scheme
- **Handling:** Validate all questions have mark schemes before publish
- **UI:** List questions missing mark schemes with links to fix them

### 5.4 AI Generation Fails
- **Scenario:** Claude fails to generate exam or returns invalid structure
- **Handling:** Show error, allow retry, do not save partial result
- **UI:** "Generation failed — please try again. If the problem persists, try adjusting your settings."

### 5.5 Course Duplication — Large Course
- **Scenario:** Admin duplicates a course with hundreds of exams and questions
- **Handling:** Run duplication as background job, notify admin when complete
- **UI:** Show "Duplicating course — we'll notify you when it's ready" progress state

### 5.6 Image Upload — Wrong File Type
- **Scenario:** Admin uploads a PDF or non-image file as question image
- **Handling:** Validate file type client-side and server-side
- **UI:** "Only JPG, PNG, and WebP images are supported"

### 5.7 Image Upload — Too Large
- **Scenario:** Admin uploads image over 5MB
- **Handling:** Reject before upload, validate client-side first
- **UI:** "Image must be under 5MB. Please compress the image and try again."

---

## 6. Teacher Flows

### 6.1 Teacher Assigns Exam to Empty Class
- **Scenario:** Teacher assigns exam to class with no students
- **Handling:** Allow assignment, no notifications sent (no students to notify)
- **UI:** Show warning "This class has no students yet"

### 6.2 Deadline in the Past
- **Scenario:** Teacher tries to set assignment deadline in the past
- **Handling:** Validate deadline_at > now() on server
- **UI:** "Deadline must be in the future"

### 6.3 Teacher Deletes Class With Active Assignments
- **Scenario:** Teacher tries to delete a class that has active upcoming assignments
- **Handling:** Soft delete class and all assignments, results preserved
- **UI:** "Archiving this class will also archive its assignments. Student results will be preserved."

### 6.4 Teacher Removes Student Mid-Assignment
- **Scenario:** Teacher removes a student who has an in-progress exam attempt
- **Handling:** Allow removal, student's in-progress attempt continues to completion
- **UI:** Teacher sees warning "This student has an active exam attempt"

### 6.5 Assignment Deadline Passes — No Submission
- **Scenario:** Student does not submit assignment before deadline
- **Handling:** No automatic action, teacher can see who has not submitted
- **UI:** Teacher dashboard shows "Not submitted" for that student

---

## 7. Student Flows

### 7.1 Student Unenrolls From Course With Pending Assignments
- **Scenario:** Student unenrolls from a course but has an assigned exam pending
- **Handling:** Block unenrollment if active class membership depends on the course
- **UI:** "You cannot unenroll from this course while you are in a class that uses it"

### 7.2 Student Has No Courses Enrolled
- **Scenario:** New student skips course selection during onboarding
- **Handling:** Allow skip, show empty state on dashboard
- **UI:** Prominent "Enroll in a course to get started" card on dashboard

### 7.3 Daily Challenge — Question Unavailable
- **Scenario:** No daily challenge has been set for today
- **Handling:** Fall back to random published question from question bank
- **UI:** Show question normally, no indication it's a fallback

### 7.4 Student Level Up
- **Scenario:** Student earns enough XP to level up
- **Handling:** Calculate new level on every XP transaction, trigger level up if threshold crossed
- **UI:** Show celebration animation and new level name

### 7.5 Streak Broken
- **Scenario:** Student misses a day of practice
- **Handling:** Check streak_last_date on daily challenge completion, if gap > 1 day reset streak
- **UI:** Show "Your streak was reset — start a new one today!" message

### 7.6 Badge Already Earned
- **Scenario:** Badge criteria met again for a badge already earned
- **Handling:** Check student_badges before awarding, skip if already exists (UNIQUE constraint)
- **UI:** No duplicate notification

### 7.7 Predicted Grade — Insufficient Data
- **Scenario:** Student has only completed 1 exam — not enough data for prediction
- **Handling:** Show predicted grade only after 3+ completed exams
- **UI:** Show "Complete more exams to unlock your predicted grade" placeholder

---

## 8. Notifications

### 8.1 Email Delivery Failure
- **Scenario:** Resend fails to deliver an email
- **Handling:** Log failure, do not retry automatically (Resend has own retry logic)
- **Logging:** Track email delivery status in logs

### 8.2 Notification Preferences — All Disabled
- **Scenario:** User disables all notifications
- **Handling:** Respect preferences, send no emails or in-app notifications
- **Note:** Critical account emails (payment failed, account suspended) always sent regardless of preferences

### 8.3 Deadline Reminder — Already Submitted
- **Scenario:** 24-hour deadline reminder triggers but student already submitted
- **Handling:** Check submission status before sending reminder, skip if already submitted
- **UI:** No notification sent

---

## 9. Data & Security

### 9.1 SQL Injection Attempt
- **Handling:** All queries via Supabase client (parameterised), never raw SQL from user input
- **Extra:** Zod validation on all inputs rejects unexpected characters

### 9.2 Unauthorised API Access
- **Scenario:** Someone calls API routes directly without auth token
- **Handling:** Middleware rejects all unauthenticated requests to protected routes
- **Response:** 401 Unauthorised

### 9.3 Cross-Role Data Access
- **Scenario:** Student tries to access teacher's class data via API
- **Handling:** RLS policies enforce data isolation at database level
- **Response:** Empty result or 403 Forbidden

### 9.4 Concurrent Answer Submission
- **Scenario:** Student submits same question answer twice simultaneously (double click)
- **Handling:** Use optimistic UI locking, disable submit button after first click
- **Server:** Upsert on question_attempt to prevent duplicates

### 9.5 Large File Upload Attack
- **Scenario:** Malicious user uploads extremely large file to image upload endpoint
- **Handling:** Validate file size before processing (client and server side)
- **Server:** Set max body size limit on upload routes

### 9.6 Rate Limit Bypass Attempt
- **Scenario:** User tries to bypass Claude API rate limits
- **Handling:** Rate limits enforced server-side per user_id, not per IP
- **Response:** 429 Too Many Requests with retry_after header

---

## 10. Performance

### 10.1 Large Question Bank
- **Scenario:** Question bank grows to 10,000+ questions
- **Handling:** Paginate all question bank queries, add database indexes on subject_id, topic_id, subtopic_id, difficulty
- **Search:** Use Supabase full text search for question content search

### 10.2 Many Students Submitting Simultaneously
- **Scenario:** Whole class submits exam at same time (e.g. 30 students)
- **Handling:** Queue Claude evaluations, process with concurrency limit
- **UI:** Show "Results processing" state, update via polling or Supabase Realtime

### 10.3 Long AI Tutor Conversation
- **Scenario:** Student has very long conversation with AI tutor (50+ messages)
- **Handling:** Cap at 50 messages, start new conversation automatically
- **UI:** Show "Starting a new conversation to keep things fast" message
- **Context:** Summarise key points from old conversation into new one's system prompt

### 10.4 Slow Claude Response
- **Scenario:** Claude takes longer than usual to respond in tutor chat
- **Handling:** Show typing indicator, set 30 second timeout
- **UI:** Typing indicator animation while waiting, timeout message if too slow