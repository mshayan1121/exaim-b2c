# ExAIm B2C — AI Evaluation Spec

## Overview
Claude is the core AI engine for ExAIm B2C. This document defines the exact
contract for every Claude API interaction — inputs, outputs, prompts, and 
error handling. This must be read before building any Claude integration.

## Model
- Always use: `claude-sonnet-4-5`
- Vision enabled: YES — images sent with evaluation calls
- Structured JSON output: YES — all responses must be valid JSON

---

## 1. Answer Evaluation

### Purpose
Evaluate a student's answer against an admin-provided mark scheme.
Return structured marks, breakdown, and examiner-style feedback.

### Trigger
- Student submits an answer in Practice Mode (per question)
- Student submits full exam in Exam Mode (per question, batched)

### Critical Rules
- ALWAYS save the exam attempt to the database BEFORE calling Claude
- NEVER block the UI waiting for Claude — show processing state
- If Claude fails — retry up to 3 times in background
- Rate limit: max 60 evaluation calls per user per hour
- ALWAYS send images if the question has an image_url
- Apply error carried forward logic for multi-part questions

### API Call Structure
```typescript
// src/lib/claude/evaluation.ts

const response = await fetch("https://api.anthropic.com/v1/messages", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-api-key": process.env.ANTHROPIC_API_KEY!,
    "anthropic-version": "2023-06-01"
  },
  body: JSON.stringify({
    model: "claude-sonnet-4-5",
    max_tokens: 1000,
    system: EVALUATION_SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: buildEvaluationPayload(question, studentAnswer, markScheme)
      }
    ]
  })
})
```

### Evaluation Payload Builder
```typescript
function buildEvaluationPayload(
  question: Question,
  studentAnswer: string,
  markScheme: MarkScheme,
  parentContext?: Question,
  previousParts?: PreviousPartResult[]
) {
  const content: ContentBlock[] = []

  // Add parent question context if this is a sub-part
  if (parentContext) {
    content.push({
      type: "text",
      text: `PARENT QUESTION CONTEXT:\n${parentContext.content}`
    })
    if (parentContext.image_url) {
      content.push({
        type: "image",
        source: { type: "url", url: parentContext.image_url }
      })
    }
  }

  // Add question text
  content.push({
    type: "text",
    text: `QUESTION${question.part_label ? ` (Part ${question.part_label})` : ''}:\n${question.content}`
  })

  // Add question image if present
  if (question.image_url) {
    content.push({
      type: "image",
      source: { type: "url", url: question.image_url }
    })
  }

  // Add previous parts context for error carried forward
  if (previousParts && previousParts.length > 0) {
    const prevContext = previousParts.map(p =>
      `Part ${p.label}: Student answered "${p.answer}" — ${p.marksAwarded}/${p.marksAvailable} marks`
    ).join('\n')
    content.push({
      type: "text",
      text: `PREVIOUS PARTS (for error carried forward):\n${prevContext}`
    })
  }

  // Add mark scheme and student answer
  content.push({
    type: "text",
    text: `
MARKS AVAILABLE: ${question.total_marks}
QUESTION TYPE: ${question.question_type}
SUBJECT: ${question.subject}
TOPIC: ${question.topic}
EXAM BOARD STYLE: ${question.exam_board}

MARK SCHEME:
Model Answer: ${markScheme.model_answer}

Marking Points (one per mark):
${markScheme.marking_points.map((p, i) => `${i + 1}. ${p.point_text}`).join('\n')}

SPECIAL INSTRUCTIONS FOR MARKING:
${markScheme.claude_notes || 'None'}

STUDENT ANSWER:
${studentAnswer}

Evaluate the student answer and respond ONLY with valid JSON.
`
  })

  return content
}
```

### Evaluation System Prompt
```typescript
const EVALUATION_SYSTEM_PROMPT = `
You are an expert examiner with deep knowledge of GCSE and IGCSE curricula.
Your role is to evaluate student answers against mark schemes with the same 
precision and fairness as a professional examiner.

MARKING RULES:
1. Award marks strictly based on the marking points provided
2. Accept equivalent correct answers even if worded differently
3. Apply error carried forward (ECF) where indicated — if a student uses 
   a wrong value from a previous part but applies correct method, award ECF marks
4. For calculation questions — award method marks even if final answer is wrong,
   as long as correct method is shown
5. For MCQ — only award mark if correct option selected, no partial marks
6. Never award more marks than the marks available
7. Be fair but precise — do not be lenient beyond what the mark scheme allows
8. Consider the exam board style when evaluating written answers

OUTPUT FORMAT:
You must respond ONLY with valid JSON. No preamble, no explanation outside JSON.
The JSON must follow this exact structure:

{
  "marks_awarded": number,
  "marks_available": number,
  "marking_breakdown": [
    {
      "point": "marking point text",
      "awarded": boolean,
      "reason": "brief reason why awarded or not"
    }
  ],
  "feedback": "2-3 sentence examiner style feedback on the answer overall",
  "improvement": "1-2 sentence specific actionable improvement tip",
  "error_carried_forward": boolean
}
`
```

### Evaluation Response Type
```typescript
interface EvaluationResult {
  marks_awarded: number
  marks_available: number
  marking_breakdown: {
    point: string
    awarded: boolean
    reason: string
  }[]
  feedback: string
  improvement: string
  error_carried_forward: boolean
}
```

### Error Handling
```typescript
async function evaluateWithRetry(
  payload: EvaluationPayload,
  questionAttemptId: string,
  retries = 3
): Promise<EvaluationResult | null> {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const result = await callClaudeEvaluation(payload)
      await saveEvaluationResult(questionAttemptId, result)
      return result
    } catch (error) {
      if (attempt === retries - 1) {
        await markEvaluationFailed(questionAttemptId)
        await notifyAdminOfFailure(questionAttemptId)
        return null
      }
      // Wait before retry: 1s, 2s, 4s
      await sleep(Math.pow(2, attempt) * 1000)
    }
  }
  return null
}
```

---

## 2. AI Exam Generation

### Purpose
Generate a complete exam with questions, sub-questions, mark schemes,
and marking points based on admin configuration.

### Trigger
Admin selects AI Generate method in exam builder and clicks Generate.

### Critical Rules
- NEVER auto-publish AI generated content
- Admin MUST review and approve every generated exam
- Generated questions are saved to question bank only after approval
- Rate limit: max 10 generation calls per admin per hour

### Generation System Prompt
```typescript
const EXAM_GENERATION_SYSTEM_PROMPT = `
You are an expert exam paper creator with deep knowledge of GCSE and IGCSE 
curricula and exam board standards.

Your role is to create high quality exam questions that:
1. Match the specified exam board style precisely (AQA, Edexcel, OCR, Cambridge)
2. Are appropriate for the specified difficulty level
3. Cover the specified topics and sub-topics
4. Include detailed, accurate mark schemes
5. Follow real exam conventions for the subject

QUESTION QUALITY STANDARDS:
- Written questions must require genuine understanding, not just recall
- Calculation questions must specify required units and show mark allocation
- MCQ options must be plausible — avoid obviously wrong distractors
- Mark schemes must be unambiguous and fair
- Marking points must be specific and measurable

OUTPUT FORMAT:
Respond ONLY with valid JSON. No preamble, no markdown, no explanation outside JSON.
`
```

### Generation Payload
```typescript
interface ExamGenerationConfig {
  course_name: string
  exam_board: string
  qualification: string
  subject: string
  exam_type: 'topic' | 'subtopic' | 'mixed' | 'past_paper'
  selected_topics: string[]
  selected_subtopics: string[]
  num_questions: number
  difficulty_mix: {
    easy: number    // percentage e.g. 30
    medium: number  // percentage e.g. 50
    hard: number    // percentage e.g. 20
  }
  total_marks: number
  question_type_mix: {
    written: number     // percentage
    mcq: number         // percentage
    calculation: number // percentage
  }
  duration_mins: number
}

function buildGenerationPayload(config: ExamGenerationConfig): string {
  return `
Generate an exam with the following specifications:

Course: ${config.course_name}
Exam Board: ${config.exam_board}
Qualification: ${config.qualification}
Subject: ${config.subject}
Exam Type: ${config.exam_type}
Topics to Cover: ${config.selected_topics.join(', ')}
Sub-topics to Cover: ${config.selected_subtopics.join(', ')}
Number of Questions: ${config.num_questions}
Total Marks: ${config.total_marks}
Duration: ${config.duration_mins} minutes

Difficulty Distribution:
- Easy: ${config.difficulty_mix.easy}%
- Medium: ${config.difficulty_mix.medium}%
- Hard: ${config.difficulty_mix.hard}%

Question Type Distribution:
- Written: ${config.question_type_mix.written}%
- MCQ: ${config.question_type_mix.mcq}%
- Calculation: ${config.question_type_mix.calculation}%

Generate the exam following ${config.exam_board} ${config.qualification} style.
Include realistic context, diagrams descriptions where relevant, and precise mark schemes.

Respond with this exact JSON structure:
{
  "exam_name": "string",
  "total_marks": number,
  "suggested_duration_mins": number,
  "questions": [
    {
      "question_number": number,
      "question_type": "written" | "mcq" | "calculation",
      "difficulty": "easy" | "medium" | "hard",
      "topic": "string",
      "subtopic": "string",
      "content": "string — full question text",
      "image_description": "string | null — describe any diagram needed",
      "total_marks": number,
      "parts": [
        {
          "part_label": "a" | "b" | "c" | null,
          "content": "string — part question text",
          "question_type": "written" | "mcq" | "calculation",
          "marks": number,
          "mark_scheme": {
            "model_answer": "string",
            "marking_points": ["string"],
            "claude_notes": "string | null"
          },
          "mcq_options": [
            {
              "option_text": "string",
              "is_correct": boolean
            }
          ] 
        }
      ],
      "mark_scheme": {
        "model_answer": "string — only if no parts",
        "marking_points": ["string — only if no parts"],
        "claude_notes": "string | null"
      }
    }
  ]
}
`
}
```

---

## 3. AI Question Generation

### Purpose
Generate a single question with mark scheme within the exam builder.

### Trigger
Admin clicks "Generate Question" within the exam builder.

### System Prompt
```typescript
const QUESTION_GENERATION_SYSTEM_PROMPT = `
You are an expert exam question writer with deep knowledge of GCSE and IGCSE 
curricula and exam board standards.

Generate a single high quality exam question that precisely matches the 
specifications provided. Include a detailed, accurate mark scheme.

OUTPUT FORMAT:
Respond ONLY with valid JSON. No preamble, no markdown, no explanation outside JSON.
Follow the exact JSON structure specified in the user message.
`
```

---

## 4. AI Tutor

### Purpose
Help students understand exam content — either post-exam (explaining mistakes)
or standalone (answering course questions).

### Trigger
- Post-exam: Student clicks "Ask AI Tutor" on results screen
- Standalone: Student opens AI Tutor from dashboard

### Critical Rules
- ALWAYS scope responses to the student's enrolled course
- NEVER teach content outside the course
- NEVER just give answers — guide the student to understand
- Keep conversation history in tutor_messages table
- Send full conversation history on every API call
- Max conversation length: 50 messages (then start new conversation)

### Tutor System Prompt — Post Exam Mode
```typescript
function buildPostExamTutorSystemPrompt(
  courseName: string,
  examName: string,
  weakQuestions: WeakQuestion[]
): string {
  return `
You are a friendly, encouraging AI tutor for ${courseName}.
A student has just completed "${examName}" and needs help understanding 
their mistakes.

YOUR ROLE:
- Explain concepts clearly using simple language appropriate for a 14-18 year old
- Guide students to understand WHY an answer is correct, not just WHAT it is
- Use analogies and real world examples where helpful
- Be encouraging — mistakes are part of learning
- Keep explanations concise — avoid overwhelming the student

STRICT SCOPE:
- You may ONLY discuss content relevant to ${courseName}
- If asked about anything outside this course, politely redirect
- You may NOT just give the answer — guide the student to understand

QUESTIONS THE STUDENT STRUGGLED WITH:
${weakQuestions.map(q => `
Question: ${q.content}
Student answered: ${q.studentAnswer}
Correct answer: ${q.modelAnswer}
Marks awarded: ${q.marksAwarded}/${q.marksAvailable}
`).join('\n')}

Help the student understand their mistakes in a supportive way.
`
}
```

### Tutor System Prompt — Standalone Mode
```typescript
function buildStandaloneTutorSystemPrompt(courseName: string): string {
  return `
You are a friendly, encouraging AI tutor for ${courseName}.

YOUR ROLE:
- Answer student questions about ${courseName} content
- Explain concepts clearly for a 14-18 year old student
- Use analogies, examples, and step by step explanations
- Be encouraging and patient
- Keep responses focused and concise

STRICT SCOPE:
- You may ONLY discuss content relevant to ${courseName}
- If asked about anything outside this course, politely say:
  "I can only help with ${courseName} content. 
   Is there something specific about the course I can help with?"
- Guide students to understand concepts, not just memorise answers
`
}
```

### Tutor API Call Structure
```typescript
async function callTutor(
  conversationId: string,
  messages: TutorMessage[],
  systemPrompt: string
): Promise<string> {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-5",
      max_tokens: 1000,
      system: systemPrompt,
      messages: messages.map(m => ({
        role: m.role,
        content: m.content
      }))
    })
  })

  const data = await response.json()
  const reply = data.content[0].text

  // Save to database
  await saveTutorMessage(conversationId, 'assistant', reply)

  return reply
}
```

---

## 5. Rate Limiting

Implement rate limiting on all Claude API routes in Next.js middleware:
```typescript
const RATE_LIMITS = {
  evaluation: {
    maxRequests: 60,
    windowMs: 60 * 60 * 1000 // 1 hour
  },
  exam_generation: {
    maxRequests: 10,
    windowMs: 60 * 60 * 1000 // 1 hour
  },
  question_generation: {
    maxRequests: 30,
    windowMs: 60 * 60 * 1000 // 1 hour
  },
  tutor: {
    maxRequests: 100,
    windowMs: 60 * 60 * 1000 // 1 hour
  }
}
```

---

## 6. Cost Management

Track Claude API usage in the database:
```sql
claude_api_logs
  id                uuid PRIMARY KEY
  user_id           uuid REFERENCES profiles(id)
  call_type         text -- 'evaluation', 'exam_generation', 'question_generation', 'tutor'
  input_tokens      integer
  output_tokens     integer
  duration_ms       integer
  success           boolean
  created_at        timestamptz DEFAULT now()
```

Admin dashboard shows:
- Total API calls per day
- Total tokens used per day
- Estimated cost per day
- Breakdown by call type
- Calls per user (to detect abuse)

---

## 7. AI Hierarchy Generation

### Purpose
Generate a complete topic and sub-topic hierarchy for a given course
so admin doesn't have to manually type every topic and sub-topic.

### Trigger
Admin clicks "Generate Hierarchy" in the content setup screen.

### Critical Rules
- Admin MUST review and confirm before saving to database
- Never auto-save generated hierarchy
- Admin can freely edit, add, remove before confirming
- Rate limit: max 20 generation calls per admin per hour

### System Prompt
```typescript
const HIERARCHY_GENERATION_SYSTEM_PROMPT = `
You are an expert in GCSE and IGCSE curricula with precise knowledge of 
all major exam board syllabuses including AQA, Edexcel, OCR, and Cambridge.

Your role is to generate accurate, complete topic and sub-topic hierarchies
for a given course based on the official syllabus.

ACCURACY RULES:
1. Only include topics and sub-topics that are genuinely part of the official syllabus
2. Follow the exact terminology used by the specified exam board
3. For Combined Science — only include topics covered in the combined award
4. For Triple Science — include all topics including Triple-only content
5. Order topics logically as they appear in the official specification
6. Sub-topics should be specific enough to be useful for question tagging
   but not so granular that they become redundant

OUTPUT FORMAT:
Respond ONLY with valid JSON. No preamble, no markdown, no explanation outside JSON.
`
```

### Generation Payload
```typescript
function buildHierarchyGenerationPayload(config: HierarchyConfig): string {
  return `
Generate the complete topic and sub-topic hierarchy for:

Qualification: ${config.qualification}
Exam Board: ${config.exam_board}
Subject: ${config.subject}
Variant: ${config.variant || 'Standard'}

Return this exact JSON structure:
{
  "qualification": "string",
  "exam_board": "string",
  "subject": "string",
  "variant": "string | null",
  "topics": [
    {
      "name": "string",
      "display_order": number,
      "subtopics": [
        {
          "name": "string",
          "display_order": number
        }
      ]
    }
  ]
}
`
}
```

### Single Topic Generation Payload
```typescript
function buildSingleTopicHierarchyPayload(
  topicName: string,
  config: HierarchyConfig
): string {
  return `
Generate all sub-topics for the following topic:

Qualification: ${config.qualification}
Exam Board: ${config.exam_board}
Subject: ${config.subject}
Variant: ${config.variant || 'Standard'}
Topic: ${topicName}

Return this exact JSON structure:
{
  "topic": "string",
  "subtopics": [
    {
      "name": "string",
      "display_order": number
    }
  ]
}
`
}
```

### API Route
```typescript
// POST /api/admin/ai/generate-hierarchy
// Auth: Admin
// Input:
{
  qualification: string
  exam_board: string
  subject: string
  variant?: string // e.g. "Triple" | "Combined" | null
}

// Actions:
// 1. Build generation payload
// 2. Call Claude API
// 3. Parse and validate JSON response
// 4. Return for admin review — DO NOT save to database yet

// Output:
{ success: true, data: GeneratedHierarchy }

// POST /api/admin/ai/generate-subtopics
// Auth: Admin
// Input:
{
  topic_name: string
  qualification: string
  exam_board: string
  subject: string
  variant?: string
}

// Output:
{ success: true, data: GeneratedSubtopics }

// POST /api/admin/ai/confirm-hierarchy
// Auth: Admin
// Saves the reviewed and edited hierarchy to the database
// Input:
{
  subject_id: string
  topics: {
    name: string
    display_order: number
    subtopics: {
      name: string
      display_order: number
    }[]
  }[]
}

// Actions:
// 1. Create all topics linked to subject_id
// 2. Create all sub-topics linked to their topic
// 3. All saved in one transaction

// Output:
{ success: true, data: { topics_created: number, subtopics_created: number } }
```