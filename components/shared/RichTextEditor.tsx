"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import {
  EditorProvider,
  useCurrentEditor,
  EditorContent,
  type Content,
} from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import Image from "@tiptap/extension-image"
import Placeholder from "@tiptap/extension-placeholder"
import Subscript from "@tiptap/extension-subscript"
import Superscript from "@tiptap/extension-superscript"
import { MathInline, MathBlock } from "@/lib/utils/tiptap-math-extension"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Image as ImageIcon,
  Calculator,
  SquareFunction,
  Superscript as SuperscriptIcon,
  Subscript as SubscriptIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

const MATH_SYMBOLS = [
  { label: "×", value: "\\times " },
  { label: "÷", value: "\\div " },
  { label: "±", value: "\\pm " },
  { label: "≤", value: "\\leq " },
  { label: "≥", value: "\\geq " },
  { label: "→", value: "\\rightarrow " },
  { label: "∞", value: "\\infty " },
  { label: "√", value: "\\sqrt{}" },
  { label: "π", value: "\\pi " },
  { label: "α", value: "\\alpha " },
  { label: "β", value: "\\beta " },
  { label: "γ", value: "\\gamma " },
  { label: "λ", value: "\\lambda " },
  { label: "μ", value: "\\mu " },
]

function getExtensions(placeholder: string) {
  return [
    StarterKit.configure({
      heading: { levels: [1, 2] },
      codeBlock: false,
      blockquote: false,
      horizontalRule: false,
    }),
    Underline,
    Image.configure({ allowBase64: true }),
    Placeholder.configure({ placeholder }),
    Subscript,
    Superscript,
    MathInline,
    MathBlock,
  ]
}

function ToolbarButton({
  onClick,
  isActive,
  disabled,
  title,
  icon: Icon,
}: {
  onClick: () => void
  isActive?: boolean
  disabled?: boolean
  title: string
  icon: React.ComponentType<{ className?: string }>
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        "h-8 w-8 text-muted-foreground hover:text-foreground dark:text-muted-foreground dark:hover:text-foreground",
        isActive && "bg-muted text-foreground dark:bg-muted dark:text-foreground"
      )}
    >
      <Icon className="size-4" />
    </Button>
  )
}

function EditorToolbar() {
  const { editor } = useCurrentEditor()
  const [imageUrl, setImageUrl] = useState("")
  const [imageOpen, setImageOpen] = useState(false)
  const [mathPopover, setMathPopover] = useState<"inline" | "block" | null>(null)
  const [mathLatex, setMathLatex] = useState("")

  const addImage = useCallback(() => {
    if (!editor || !imageUrl.trim()) return
    editor.chain().focus().setImage({ src: imageUrl.trim() }).run()
    setImageUrl("")
    setImageOpen(false)
  }, [editor, imageUrl])

  const addMathInline = useCallback(() => {
    if (!editor) return
    editor
      .chain()
      .focus()
      .insertContent({ type: "mathInline", attrs: { latex: mathLatex } })
      .run()
    setMathLatex("")
    setMathPopover(null)
  }, [editor, mathLatex])

  const addMathBlock = useCallback(() => {
    if (!editor) return
    editor
      .chain()
      .focus()
      .insertContent({ type: "mathBlock", attrs: { latex: mathLatex } })
      .run()
    setMathLatex("")
    setMathPopover(null)
  }, [editor, mathLatex])

  if (!editor) return null

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-1 rounded-md border border-border bg-muted/30 p-1 dark:border-border dark:bg-muted/20">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          title="Bold"
          icon={Bold}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          title="Italic"
          icon={Italic}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive("underline")}
          title="Underline"
          icon={UnderlineIcon}
        />
        <div className="mx-1 h-4 w-px bg-border dark:bg-border" />
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          isActive={editor.isActive("heading", { level: 1 })}
          title="Heading 1"
          icon={Heading1}
        />
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          isActive={editor.isActive("heading", { level: 2 })}
          title="Heading 2"
          icon={Heading2}
        />
        <div className="mx-1 h-4 w-px bg-border dark:bg-border" />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
          title="Bullet list"
          icon={List}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
          title="Ordered list"
          icon={ListOrdered}
        />
        <div className="mx-1 h-4 w-px bg-border dark:bg-border" />
        <Popover
          open={mathPopover === "inline"}
          onOpenChange={(o) => setMathPopover(o ? "inline" : null)}
        >
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="h-8 w-8 text-muted-foreground hover:text-foreground dark:text-muted-foreground dark:hover:text-foreground"
              title="Insert inline math"
            >
              <Calculator className="size-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="start">
            <div className="space-y-3">
              <Label>Inline math (LaTeX)</Label>
              <Input
                placeholder="e.g. x^2 + y^2"
                value={mathLatex}
                onChange={(e) => setMathLatex(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addMathInline()
                  }
                }}
                className="font-mono text-sm"
              />
              <Button size="sm" onClick={addMathInline}>
                Insert
              </Button>
            </div>
          </PopoverContent>
        </Popover>
        <Popover
          open={mathPopover === "block"}
          onOpenChange={(o) => setMathPopover(o ? "block" : null)}
        >
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="h-8 w-8 text-muted-foreground hover:text-foreground dark:text-muted-foreground dark:hover:text-foreground"
              title="Insert block math"
            >
              <SquareFunction className="size-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="start">
            <div className="space-y-3">
              <Label>Block math (LaTeX)</Label>
              <Input
                placeholder="e.g. \\frac{1}{2}"
                value={mathLatex}
                onChange={(e) => setMathLatex(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addMathBlock()
                  }
                }}
                className="font-mono text-sm"
              />
              <Button size="sm" onClick={addMathBlock}>
                Insert
              </Button>
            </div>
          </PopoverContent>
        </Popover>
        <Popover open={imageOpen} onOpenChange={setImageOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="h-8 w-8 text-muted-foreground hover:text-foreground dark:text-muted-foreground dark:hover:text-foreground"
              title="Insert image"
            >
              <ImageIcon className="size-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="start">
            <div className="space-y-3">
              <Label>Image URL</Label>
              <Input
                placeholder="https://..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="text-sm"
              />
              <Button size="sm" onClick={addImage} disabled={!imageUrl.trim()}>
                Insert
              </Button>
            </div>
          </PopoverContent>
        </Popover>
        <div className="mx-1 h-4 w-px bg-border dark:bg-border" />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleSubscript().run()}
          isActive={editor.isActive("subscript")}
          title="Subscript"
          icon={SubscriptIcon}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleSuperscript().run()}
          isActive={editor.isActive("superscript")}
          title="Superscript"
          icon={SuperscriptIcon}
        />
      </div>

      {/* Math toolbar row */}
      <div className="flex flex-wrap items-center gap-1 rounded-md border border-border bg-muted/20 p-2 dark:border-border dark:bg-muted/10">
        {MATH_SYMBOLS.map((s) => (
          <Button
            key={s.label}
            type="button"
            variant="ghost"
            size="xs"
            className="h-7 min-w-7 px-1.5 font-mono text-sm"
            onClick={() =>
              editor.chain().focus().insertContent({
                type: "mathInline",
                attrs: { latex: s.value },
              })
            }
            title={s.label}
          >
            {s.label}
          </Button>
        ))}
        <div className="mx-1 h-4 w-px bg-border dark:bg-border" />
        <Button
          type="button"
          variant="ghost"
          size="xs"
          className="h-7 text-xs"
          onClick={() =>
            editor.chain().focus().insertContent({
              type: "mathInline",
              attrs: { latex: "\\frac{}{}" },
            })
          }
        >
          Fraction
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="xs"
          className="h-7 text-xs"
          onClick={() =>
            editor.chain().focus().insertContent({
              type: "mathInline",
              attrs: { latex: "^{}" },
            })
          }
        >
          Powers
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="xs"
          className="h-7 text-xs"
          onClick={() =>
            editor.chain().focus().insertContent({
              type: "mathInline",
              attrs: { latex: "\\sqrt{}" },
            })
          }
        >
          √
        </Button>
        <div className="mx-1 h-4 w-px bg-border dark:bg-border" />
        <Button
          type="button"
          variant="ghost"
          size="xs"
          className="h-7 text-xs"
          onClick={() =>
            editor.chain().focus().insertContent({
              type: "mathInline",
              attrs: { latex: "\\rightleftarrows " },
            })
          }
        >
          ⇌
        </Button>
      </div>
    </div>
  )
}

function EditorToolbarWrapper() {
  return (
    <div className="border-b border-border bg-muted/30 px-3 py-2 dark:border-border dark:bg-muted/20">
      <EditorToolbar />
    </div>
  )
}

interface RichTextEditorProps {
  content?: Content
  onChange: (content: object) => void
  placeholder?: string
  className?: string
}

export function RichTextEditor({
  content,
  onChange,
  placeholder = "Start typing...",
  className,
}: RichTextEditorProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const extensions = useMemo(
    () => getExtensions(placeholder),
    [placeholder]
  )

  const handleUpdate = useCallback(
    ({ editor }: { editor: { getJSON: () => object } }) => {
      onChange(editor.getJSON())
    },
    [onChange]
  )

  const initialContent =
    content ?? ({ type: "doc", content: [{ type: "paragraph" }] } as Content)

  if (!isMounted) return null

  return (
    <div
      className={cn(
        "rounded-lg border border-border dark:border-border overflow-hidden",
        className
      )}
    >
      <EditorProvider
        immediatelyRender={false}
        slotBefore={<EditorToolbarWrapper />}
        extensions={extensions}
        content={initialContent}
        onUpdate={handleUpdate}
        editorContainerProps={{
          className:
            "min-h-[200px] [&_.ProseMirror]:min-h-[180px] [&_.ProseMirror]:px-4 [&_.ProseMirror]:py-4 [&_.ProseMirror]:outline-none [&_.ProseMirror_p]:mb-2 [&_.ProseMirror_p]:leading-[1.6] [&_.ProseMirror_h1]:text-2xl [&_.ProseMirror_h1]:font-bold [&_.ProseMirror_h2]:text-xl [&_.ProseMirror_h2]:font-semibold [&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:pl-6 [&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:pl-6",
        }}
      />
    </div>
  )
}
