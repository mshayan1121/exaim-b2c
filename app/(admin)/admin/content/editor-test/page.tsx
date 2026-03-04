"use client"

import { useState } from "react"
import { RichTextEditor } from "@/components/shared/RichTextEditor"
import { ContentRenderer } from "@/components/shared/ContentRenderer"
import { AnswerInput } from "@/components/student/AnswerInput"
import { MathKeyboard } from "@/components/student/MathKeyboard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Content } from "@tiptap/react"

export default function EditorTestPage() {
  const [editorContent, setEditorContent] = useState<Content>({
    type: "doc",
    content: [{ type: "paragraph" }],
  })
  const [answerValue, setAnswerValue] = useState("")
  const [keyboardOpen, setKeyboardOpen] = useState(false)
  const [keyboardInsert, setKeyboardInsert] = useState("")

  return (
    <div className="space-y-8 p-8">
      <div className="rounded-md border border-warning/50 bg-warning/5 px-4 py-3 text-sm text-foreground dark:bg-warning/10">
        <strong>Note:</strong> This page is for testing the editor components
        only. It is not linked in the sidebar.
      </div>

      {/* Rich Text Editor */}
      <Card>
        <CardHeader>
          <CardTitle>Rich Text Editor (Admin)</CardTitle>
          <p className="text-sm text-muted-foreground">
            Used when creating/editing questions. Includes formatting, math, and
            image support.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <RichTextEditor
            content={editorContent}
            onChange={(content) => setEditorContent(content as Content)}
            placeholder="Type your question here..."
          />
        </CardContent>
      </Card>

      {/* Content Renderer - Live Output */}
      <Card>
        <CardHeader>
          <CardTitle>Content Renderer (Live Output)</CardTitle>
          <p className="text-sm text-muted-foreground">
            How the editor content will be displayed to students.
          </p>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-border bg-muted/20 p-6 dark:border-border dark:bg-muted/10">
            <ContentRenderer
              content={
                editorContent &&
                typeof editorContent === "object" &&
                !Array.isArray(editorContent)
                  ? editorContent
                  : undefined
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Student Answer Input */}
      <Card>
        <CardHeader>
          <CardTitle>Student Answer Input</CardTitle>
          <p className="text-sm text-muted-foreground">
            Used when students type written or calculation answers. Includes math
            keyboard and LaTeX preview.
          </p>
        </CardHeader>
        <CardContent>
          <AnswerInput
            value={answerValue}
            onChange={setAnswerValue}
            placeholder="Type your answer..."
          />
        </CardContent>
      </Card>

      {/* Math Keyboard Demo (standalone) */}
      <Card>
        <CardHeader>
          <CardTitle>Math Keyboard (Standalone Demo)</CardTitle>
          <p className="text-sm text-muted-foreground">
            Toggle the keyboard and click symbols to insert. Inserted value
            appears below.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <MathKeyboard
              onInsert={(v) => setKeyboardInsert((prev) => prev + v)}
              isOpen={keyboardOpen}
              onToggle={() => setKeyboardOpen((o) => !o)}
            />
          </div>
          <div className="rounded-md border border-border bg-muted/30 p-3 font-mono text-sm dark:border-border dark:bg-muted/20">
            {keyboardInsert || "(click symbols to insert)"}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
