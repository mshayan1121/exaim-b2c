# ExAIm B2C — Project Overview

## What is ExAIm B2C?
ExAIm B2C is an AI-powered exam preparation web application built for teachers/tutors and students. It is the consumer-facing version of ExAIm, an established B2B edtech platform used by 20+ schools worldwide.

The platform allows teachers to create classes, build and assign exams, and track student performance. Students can practice exams independently or through a teacher, receiving examiner-style AI feedback powered by Claude.

## Who is it for?
- **Teachers / Tutors** — independent educators who want to assign and track exams for their students
- **Students** — self-studying or enrolled in a teacher's class
- **Super Admin** — Shaun's team managing the platform, content and users

## Core Value Proposition
- Examiner-quality AI feedback on open ended, calculation and MCQ questions
- Full GCSE and IGCSE course coverage starting with Science and Maths
- Gamified learning experience that keeps students engaged
- Significant reduction in teacher marking workload

## Current Scope
- Web application — desktop first, tablet later, mobile out of scope for v1
- Starting curricula: GCSE and IGCSE — Science and Maths
- Exam boards: AQA, Edexcel, OCR, Cambridge

## Tech Stack
- **Frontend:** Next.js 16, TypeScript, Tailwind CSS, shadcn/ui
- **Backend:** Next.js API Routes + Server Actions
- **Database:** Supabase PostgreSQL — Frankfurt region (eu-central-1)
- **Auth:** Supabase Auth
- **Storage:** Supabase Storage
- **AI:** Claude API (claude-sonnet-4-5, vision enabled) — exam generation, question generation, answer evaluation, AI tutor
- **Payments:** Stripe
- **Email:** Resend
- **Math Rendering:** KaTeX
- **Rich Text Editor:** TipTap with math extension
- **Deployment:** Vercel

## Claude AI Usage
Claude is the core AI engine powering four distinct features:

### 1. Exam Generation (Admin)
Admin selects a course, topics, exam type and configuration. Claude generates a complete exam including questions, sub-questions, mark schemes and marking points. Admin must review and approve before publishing. Content is never auto-published.

### 2. Question Generation (Admin)
Within the exam builder, admin can generate individual questions using Claude. Same mandatory review and approval flow applies. Generated questions are saved to the question bank automatically on approval.

### 3. Answer Evaluation (Student)
When a student submits an answer, Claude evaluates it against the admin-provided mark scheme. Claude receives the question text, any embedded images (vision enabled), mark scheme, marking points, special instructions, and the student's answer. Claude returns structured JSON:
- Marks awarded
- Marks available
- Mark by mark breakdown
- Examiner style feedback
- Improvement suggestion
- Error carried forward applied for multi-part questions

### 4. AI Tutor Chatbot (Student)
Two modes:
- **Post-exam mode** — after submission, Claude explains mistakes and teaches the underlying concepts
- **Standalone mode** — student asks questions about their enrolled course anytime

The tutor is always scoped to the student's enrolled course. Claude never goes off topic or teaches content outside the course.

## Critical AI Rules
- Never auto-publish AI generated content — always require admin review
- Always save student exam attempt before calling Claude evaluation
- If Claude API fails — save attempt, retry in background, show "feedback processing" to student
- Never block UI waiting for Claude — always show a processing state
- Rate limit all Claude API endpoints per user per hour
- Always use structured JSON output for generation and evaluation
- Always send images alongside question text for vision evaluation
- Always use claude-sonnet-4-5 model

## Key Principles
- Spec driven development — no vibe coding
- Every feature references this spec before being built
- AI feedback quality is the core differentiator — never compromise it
- Design must feel professional and premium — not AI generated
- Student data is sensitive — security and privacy are non negotiable

## Linked Spec Documents
- `spec/features.md` — full feature list
- `spec/data-model.md` — database schema
- `spec/user-flows.md` — user journeys
- `spec/api.md` — API routes
- `spec/ai-evaluation.md` — Claude API contract
- `spec/design-system.md` — design tokens and rules
- `spec/edge-cases.md` — edge cases and handling
- `build-order.md` — step by step build plan