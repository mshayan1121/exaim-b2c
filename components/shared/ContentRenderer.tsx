"use client"

import { MathRenderer } from "./MathRenderer"
import { cn } from "@/lib/utils"

type ContentNode = {
  type?: string
  content?: ContentNode[]
  attrs?: Record<string, unknown>
  text?: string
  marks?: Array<{ type: string; attrs?: Record<string, unknown> }>
}

interface ContentRendererProps {
  content: ContentNode | null | undefined
  className?: string
}

function applyMarks(
  text: string,
  marks?: Array<{ type: string; attrs?: Record<string, unknown> }>,
  keyPrefix?: string
): React.ReactNode {
  if (!marks || marks.length === 0) return text

  let wrapped: React.ReactNode = text
  for (let i = 0; i < marks.length; i++) {
    const mark = marks[i]
    const k = `${keyPrefix ?? ""}-${i}-${mark.type}`
    switch (mark.type) {
      case "bold":
      case "strong":
        wrapped = <strong key={k}>{wrapped}</strong>
        break
      case "italic":
      case "em":
        wrapped = <em key={k}>{wrapped}</em>
        break
      case "underline":
        wrapped = <u key={k}>{wrapped}</u>
        break
      case "subscript":
        wrapped = <sub key={k}>{wrapped}</sub>
        break
      case "superscript":
        wrapped = <sup key={k}>{wrapped}</sup>
        break
      default:
        break
    }
  }
  return wrapped
}

function renderNode(node: ContentNode, key: number): React.ReactNode {
  if (node.text !== undefined) {
    return applyMarks(node.text, node.marks, `text-${key}`)
  }

  switch (node.type) {
    case "paragraph": {
      const children = node.content?.map((n, i) => renderNode(n, i)) ?? []
      return (
        <p key={key} className="mb-3 leading-[1.6] last:mb-0 text-base">
          {children}
        </p>
      )
    }

    case "heading": {
      const level = (node.attrs?.level as number) ?? 1
      const Tag = `h${Math.min(6, Math.max(1, level))}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
      const children = node.content?.map((n, i) => renderNode(n, i)) ?? []
      const headingClass =
        level === 1
          ? "text-2xl font-bold mb-4 mt-6 first:mt-0 leading-[1.2]"
          : level === 2
            ? "text-xl font-semibold mb-3 mt-4 leading-[1.2]"
            : "text-lg font-medium mb-2 mt-3 leading-[1.3]"
      return (
        <Tag key={key} className={headingClass}>
          {children}
        </Tag>
      )
    }

    case "bulletList": {
      const items = node.content?.map((n, i) => renderNode(n, i)) ?? []
      return (
        <ul key={key} className="list-disc pl-6 mb-3 space-y-1 text-base leading-[1.6]">
          {items}
        </ul>
      )
    }

    case "orderedList": {
      const items = node.content?.map((n, i) => renderNode(n, i)) ?? []
      return (
        <ol key={key} className="list-decimal pl-6 mb-3 space-y-1 text-base leading-[1.6]">
          {items}
        </ol>
      )
    }

    case "listItem": {
      const children = node.content?.map((n, i) => renderNode(n, i)) ?? []
      return (
        <li key={key} className="leading-[1.6]">
          {children}
        </li>
      )
    }

    case "mathInline": {
      const latex = (node.attrs?.latex as string) ?? ""
      return (
        <MathRenderer key={key} latex={latex} display={false} className="inline" />
      )
    }

    case "mathBlock": {
      const latex = (node.attrs?.latex as string) ?? ""
      return <MathRenderer key={key} latex={latex} display className="block" />
    }

    case "image": {
      const src = node.attrs?.src as string | undefined
      const alt = (node.attrs?.alt as string) ?? ""
      if (!src) return null
      return (
        <figure key={key} className="my-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            className="max-w-full h-auto rounded-lg border border-border dark:border-border"
          />
        </figure>
      )
    }

    case "hardBreak":
      return <br key={key} />

    default:
      return node.content?.map((n, i) => renderNode(n, i)) ?? null
  }
}

export function ContentRenderer({ content, className }: ContentRendererProps) {
  if (!content) return null

  const doc = content.type === "doc" ? content : content
  const nodes = doc.content ?? (Array.isArray(doc) ? doc : [doc])

  const children = Array.isArray(nodes)
    ? nodes.map((n, i) => renderNode(n as ContentNode, i))
    : renderNode(nodes as ContentNode, 0)

  return (
    <div
      className={cn(
        "text-foreground dark:text-foreground prose dark:prose-invert max-w-none",
        "[&_strong]:font-semibold [&_em]:italic [&_u]:underline",
        "[&_.katex]:text-inherit",
        className
      )}
    >
      {children}
    </div>
  )
}
