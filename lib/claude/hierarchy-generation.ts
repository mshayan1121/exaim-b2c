import Anthropic from "@anthropic-ai/sdk"

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

export function buildHierarchyGenerationPayload(config: {
  qualification: string
  exam_board: string
  subject: string
  variant?: string | null
}): string {
  return `
Generate the complete topic and sub-topic hierarchy for:

Qualification: ${config.qualification}
Exam Board: ${config.exam_board}
Subject: ${config.subject}
Variant: ${config.variant || "Standard"}

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

export function buildSingleTopicHierarchyPayload(
  topicName: string,
  config: {
    qualification: string
    exam_board: string
    subject: string
    variant?: string | null
  }
): string {
  return `
Generate all sub-topics for the following topic:

Qualification: ${config.qualification}
Exam Board: ${config.exam_board}
Subject: ${config.subject}
Variant: ${config.variant || "Standard"}
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

export interface GeneratedTopic {
  name: string
  display_order: number
  subtopics: { name: string; display_order: number }[]
}

export interface GeneratedHierarchy {
  qualification: string
  exam_board: string
  subject: string
  variant: string | null
  topics: GeneratedTopic[]
}

export interface GeneratedSubtopics {
  topic: string
  subtopics: { name: string; display_order: number }[]
}

function extractJson(text: string): string {
  const trimmed = text.trim()
  const start = trimmed.indexOf("{")
  const end = trimmed.lastIndexOf("}") + 1
  if (start === -1 || end === 0) return trimmed
  return trimmed.slice(start, end)
}

export async function generateHierarchy(config: {
  qualification: string
  exam_board: string
  subject: string
  variant?: string | null
}): Promise<{ data: GeneratedHierarchy; usage: { inputTokens: number; outputTokens: number }; durationMs: number }> {
  const start = Date.now()
  const anthropic = new Anthropic()

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 4000,
    system: HIERARCHY_GENERATION_SYSTEM_PROMPT,
    messages: [{ role: "user", content: buildHierarchyGenerationPayload(config) }],
  })

  const durationMs = Date.now() - start
  const textBlock = response.content.find((c) => c.type === "text" && "text" in c)
  const text = textBlock && typeof (textBlock as { text?: string }).text === "string"
    ? (textBlock as { text: string }).text
    : ""
  const jsonStr = extractJson(text)
  const parsed = JSON.parse(jsonStr) as GeneratedHierarchy

  const inputTokens = response.usage.input_tokens
  const outputTokens = response.usage.output_tokens

  return {
    data: parsed,
    usage: { inputTokens, outputTokens },
    durationMs,
  }
}

export async function generateSubtopics(
  topicName: string,
  config: {
    qualification: string
    exam_board: string
    subject: string
    variant?: string | null
  }
): Promise<{ data: GeneratedSubtopics; usage: { inputTokens: number; outputTokens: number }; durationMs: number }> {
  const start = Date.now()
  const anthropic = new Anthropic()

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 2000,
    system: HIERARCHY_GENERATION_SYSTEM_PROMPT,
    messages: [{ role: "user", content: buildSingleTopicHierarchyPayload(topicName, config) }],
  })

  const durationMs = Date.now() - start
  const textBlock = response.content.find((c) => c.type === "text" && "text" in c)
  const text = textBlock && typeof (textBlock as { text?: string }).text === "string"
    ? (textBlock as { text: string }).text
    : ""
  const jsonStr = extractJson(text)
  const parsed = JSON.parse(jsonStr) as GeneratedSubtopics

  const inputTokens = response.usage.input_tokens
  const outputTokens = response.usage.output_tokens

  return {
    data: parsed,
    usage: { inputTokens, outputTokens },
    durationMs,
  }
}
