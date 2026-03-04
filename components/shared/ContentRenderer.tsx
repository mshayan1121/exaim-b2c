"use client"

import { useMemo, useEffect } from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import Subscript from "@tiptap/extension-subscript"
import Superscript from "@tiptap/extension-superscript"
import Image from "@tiptap/extension-image"
import MathExtension from "@aarkue/tiptap-math-extension"
import { cn } from "@/lib/utils"

interface ContentRendererProps {
  content: object | null | undefined
  className?: string
}

const EMPTY_DOC = { type: "doc", content: [{ type: "paragraph" }] }

function ContentRendererInner({ content, className }: ContentRendererProps) {
  const extensions = useMemo(
    () => [
      StarterKit.configure({ editorProps: { editable: () => false } }),
      Underline,
      Subscript,
      Superscript,
      Image.configure({ inline: false }),
      MathExtension.configure({
        evaluation: false,
        delimiters: "dollar",
        katexOptions: { throwOnError: false },
      }),
    ],
    []
  )

  const editor = useEditor({
    extensions,
    content: content ?? EMPTY_DOC,
    immediatelyRender: false,
    editable: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm dark:prose-invert max-w-none [&_.katex]:text-inherit focus:outline-none",
      },
    },
  }, [])

  useEffect(() => {
    if (editor && content) {
      editor.commands.setContent(content, false)
    }
  }, [editor, content])

  if (!editor) return null

  return (
    <div
      className={cn(
        "text-foreground leading-[1.6] [&_.ProseMirror]:min-h-0 [&_.ProseMirror]:p-0",
        "[&_.ProseMirror]:outline-none",
        "[&_.ProseMirror_.inlineMath]:inline-block [&_.ProseMirror_[data-display=yes]]:my-4 [&_.ProseMirror_[data-display=yes]]:flex [&_.ProseMirror_[data-display=yes]]:justify-center",
        className
      )}
    >
      <EditorContent editor={editor} />
    </div>
  )
}

export function ContentRenderer({ content, className }: ContentRendererProps) {
  if (content == null) return null
  return <ContentRendererInner content={content} className={className} />
}
