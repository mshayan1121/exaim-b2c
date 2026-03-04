"use client"

import { useCallback, useState, useMemo } from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import Subscript from "@tiptap/extension-subscript"
import Superscript from "@tiptap/extension-superscript"
import Image from "@tiptap/extension-image"
import Placeholder from "@tiptap/extension-placeholder"
import MathExtension from "@aarkue/tiptap-math-extension"
import { NodeSelection } from "@tiptap/pm/state"
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  ImagePlus,
  Superscript as SuperscriptIcon,
  Subscript as SubscriptIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { MathKeyboard } from "@/components/shared/MathKeyboard"
import { cn } from "@/lib/utils"

export interface RichTextEditorProps {
  content?: object
  onChange: (content: object) => void
  mode: "admin" | "student"
  placeholder?: string
  className?: string
  disabled?: boolean
}

const EMPTY_DOC = { type: "doc", content: [{ type: "paragraph" }] }

function RichTextEditorInner({
  content,
  onChange,
  mode,
  placeholder = "Type here...",
  className,
  disabled = false,
}: RichTextEditorProps) {
  const [keyboardVisible, setKeyboardVisible] = useState(false)
  const [keyboardMode, setKeyboardMode] = useState<"math" | "chem">("math")
  const [currentLatex, setCurrentLatex] = useState("")
  const [activeMathPos, setActiveMathPos] = useState<number | null>(null)

  const extensions = useMemo(
    () => [
      StarterKit,
      Underline,
      Subscript,
      Superscript,
      Image.configure({ inline: false }),
      Placeholder.configure({ placeholder }),
      MathExtension.configure({
        evaluation: false,
        delimiters: "dollar",
        katexOptions: { throwOnError: false },
      }),
    ],
    [placeholder]
  )

  const editor = useEditor({
    extensions,
    content: content ?? EMPTY_DOC,
    immediatelyRender: false,
    editable: !disabled,
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON())
    },
    onSelectionUpdate: ({ editor }) => {
      const { selection } = editor.state
      const node =
        selection instanceof NodeSelection ? selection.node : null
      if (
        node?.type.name === "inlineMath" &&
        selection instanceof NodeSelection
      ) {
        setActiveMathPos(selection.from)
        setCurrentLatex(node.attrs.latex ?? "")
        setKeyboardVisible(true)
      } else {
        setActiveMathPos(null)
        setKeyboardVisible(false)
      }
    },
    editorProps: {
      attributes: {
        class:
          "min-h-[120px] w-full px-3 py-2 outline-none prose prose-sm dark:prose-invert max-w-none [&_.katex]:text-inherit",
      },
    },
  }, [])

  const handleLatexChange = useCallback(
    (newLatex: string) => {
      if (editor == null || activeMathPos == null) return
      editor
        .chain()
        .setNodeSelection(activeMathPos)
        .updateAttributes("inlineMath", { latex: newLatex })
        .run()
      setCurrentLatex(newLatex)
    },
    [editor, activeMathPos]
  )

  const handleKeyboardInsert = useCallback(() => {
    // Keyboard inserts into MathLive field, which fires onLatexChange
  }, [])

  const insertInlineMath = useCallback(() => {
    if (!editor) return
    editor
      .chain()
      .insertContent({ type: "inlineMath", attrs: { latex: "" } })
      .run()
  }, [editor])

  const insertBlockMath = useCallback(() => {
    if (!editor) return
    editor
      .chain()
      .insertContent({
        type: "inlineMath",
        attrs: { latex: "", display: "yes" },
      })
      .run()
  }, [editor])

  const insertChem = useCallback(() => {
    if (!editor) return
    editor
      .chain()
      .insertContent({ type: "inlineMath", attrs: { latex: "" } })
      .run()
    setKeyboardMode("chem")
    setKeyboardVisible(true)
    setCurrentLatex("")
    setActiveMathPos(null)
  }, [editor])

  const charCount = editor ? editor.getText().length : 0

  if (!editor) return null

  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-background dark:border-border dark:bg-background",
        className
      )}
    >
      {mode === "admin" && (
        <div className="flex flex-wrap items-center gap-1 border-b border-border bg-muted/30 px-2 py-1.5 dark:border-border dark:bg-muted/20">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive("bold") ? "bg-muted" : ""}
            title="Bold"
          >
            <Bold className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive("italic") ? "bg-muted" : ""}
            title="Italic"
          >
            <Italic className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={editor.isActive("underline") ? "bg-muted" : ""}
            title="Underline"
          >
            <UnderlineIcon className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleSubscript().run()}
            className={editor.isActive("subscript") ? "bg-muted" : ""}
            title="Subscript"
          >
            <SubscriptIcon className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleSuperscript().run()}
            className={editor.isActive("superscript") ? "bg-muted" : ""}
            title="Superscript"
          >
            <SuperscriptIcon className="size-4" />
          </Button>
          <span className="mx-1 h-4 w-px bg-border dark:bg-border" />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={editor.isActive("heading", { level: 1 }) ? "bg-muted" : ""}
            title="Heading 1"
          >
            H1
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={editor.isActive("heading", { level: 2 }) ? "bg-muted" : ""}
            title="Heading 2"
          >
            H2
          </Button>
          <span className="mx-1 h-4 w-px bg-border dark:bg-border" />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive("bulletList") ? "bg-muted" : ""}
            title="Bullet list"
          >
            <List className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={editor.isActive("orderedList") ? "bg-muted" : ""}
            title="Numbered list"
          >
            <ListOrdered className="size-4" />
          </Button>
          <span className="mx-1 h-4 w-px bg-border dark:bg-border" />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={insertInlineMath}
            title="Insert math"
          >
            ∑ Math
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={insertBlockMath}
            title="Insert block math"
          >
            ∑∑ Block
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={insertChem}
            title="Insert chemistry"
          >
            ⚗ Chem
          </Button>
          <span className="mx-1 h-4 w-px bg-border dark:bg-border" />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setImage({ src: "" }).run()}
            title="Insert image"
          >
            <ImagePlus className="size-4" />
          </Button>
        </div>
      )}
      {mode === "student" && (
        <div className="flex flex-wrap items-center gap-1 border-b border-border bg-muted/30 px-2 py-1.5 dark:border-border dark:bg-muted/20">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={insertInlineMath}
            title="Insert math"
          >
            ∑ Insert Math
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={insertChem}
            title="Insert chemistry"
          >
            ⚗ Insert Chem
          </Button>
        </div>
      )}
      <EditorContent editor={editor} />
      <MathKeyboard
        isVisible={keyboardVisible}
        mode={keyboardMode}
        onModeChange={setKeyboardMode}
        onInsert={handleKeyboardInsert}
        currentLatex={currentLatex}
        onLatexChange={handleLatexChange}
      />
      {mode === "student" && (
        <div className="border-t border-border px-3 py-1.5 text-xs text-muted-foreground dark:border-border">
          {charCount} characters
        </div>
      )}
    </div>
  )
}

export function RichTextEditor(props: RichTextEditorProps) {
  return <RichTextEditorInner {...props} />
}
