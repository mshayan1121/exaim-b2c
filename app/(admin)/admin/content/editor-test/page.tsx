"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { ContentRenderer } from "@/components/shared/ContentRenderer"
import { tiptapContentToPlainText } from "@/lib/utils/content-to-text"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const RichTextEditor = dynamic(
  () =>
    import("@/components/shared/RichTextEditor").then((m) => m.RichTextEditor),
  { ssr: false }
)

// TipTap JSON examples (same shape as editor.getJSON())
const EXAMPLE_MIXED_TEXT_MATH = {
  type: "doc",
  content: [
    {
      type: "paragraph",
      content: [
        { type: "text", text: "The velocity " },
        { type: "inlineMath", attrs: { latex: "v" } },
        { type: "text", text: " = " },
        { type: "inlineMath", attrs: { latex: "u + at" } },
        { type: "text", text: " where t is time in seconds." },
      ],
    },
  ],
} as const

const EXAMPLE_BLOCK_MATH = {
  type: "doc",
  content: [
    {
      type: "paragraph",
      content: [
        {
          type: "inlineMath",
          attrs: {
            latex: "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}",
            display: "yes",
          },
        },
      ],
    },
  ],
} as const

const EXAMPLE_CHEM = {
  type: "doc",
  content: [
    {
      type: "paragraph",
      content: [
        {
          type: "inlineMath",
          attrs: { latex: "CH_4 + 2O_2 \\rightarrow CO_2 + 2H_2O" },
        },
      ],
    },
  ],
} as const

export default function EditorTestPage() {
  const [adminContent, setAdminContent] = useState<object>({
    type: "doc",
    content: [{ type: "paragraph" }],
  })
  const [studentContent, setStudentContent] = useState<object>({
    type: "doc",
    content: [{ type: "paragraph" }],
  })

  return (
    <div className="space-y-8 p-8">
      <div className="rounded-md border border-warning/50 bg-warning/5 px-4 py-3 text-sm text-foreground dark:bg-warning/10">
        <strong>Note:</strong> This page is for testing the editor components
        only. It is not linked in the sidebar.
      </div>

      {/* Section 1 — Admin Editor */}
      <Card>
        <CardHeader>
          <CardTitle>Admin Question Editor</CardTitle>
          <p className="text-sm text-muted-foreground">
            Type normally. Type $ to insert math. Type $$ for block math. Use
            toolbar buttons too.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <RichTextEditor
            content={adminContent}
            onChange={setAdminContent}
            mode="admin"
            placeholder="Type your question here..."
          />
          <div>
            <p className="mb-2 text-sm font-medium text-muted-foreground">
              Live preview (what students see):
            </p>
            <div className="rounded-md border border-border bg-muted/20 p-6 dark:border-border dark:bg-muted/10">
              <ContentRenderer content={adminContent} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 2 — Student Editor */}
      <Card>
        <CardHeader>
          <CardTitle>Student Answer Editor</CardTitle>
          <p className="text-sm text-muted-foreground">
            Minimal toolbar. Character count and plain text output for Claude.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <RichTextEditor
            content={studentContent}
            onChange={setStudentContent}
            mode="student"
            placeholder="Type your answer..."
          />
          <div>
            <p className="mb-2 text-sm font-medium text-muted-foreground">
              Plain text (what gets sent to Claude):
            </p>
            <pre className="rounded-md border border-border bg-muted/30 p-3 font-mono text-sm dark:border-border dark:bg-muted/20">
              {tiptapContentToPlainText(studentContent) || "(empty)"}
            </pre>
          </div>
        </CardContent>
      </Card>

      {/* Section 3 — Rendered Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Rendered Examples</CardTitle>
          <p className="text-sm text-muted-foreground">
            Pre-built content showing mixed text/math, block equation, and
            chemistry.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <p className="mb-2 text-xs font-medium text-muted-foreground">
              Mixed text and inline math: The velocity v = u + at
            </p>
            <div className="rounded-md border border-border bg-muted/20 p-4 dark:border-border dark:bg-muted/10">
              <ContentRenderer content={EXAMPLE_MIXED_TEXT_MATH} />
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs font-medium text-muted-foreground">
              Block equation (quadratic formula):
            </p>
            <div className="rounded-md border border-border bg-muted/20 p-4 dark:border-border dark:bg-muted/10">
              <ContentRenderer content={EXAMPLE_BLOCK_MATH} />
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs font-medium text-muted-foreground">
              Chemistry: CH₄ + 2O₂ → CO₂ + 2H₂O
            </p>
            <div className="rounded-md border border-border bg-muted/20 p-4 dark:border-border dark:bg-muted/10">
              <ContentRenderer content={EXAMPLE_CHEM} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
