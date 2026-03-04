"use client"

import { useMemo } from "react"
import katex from "katex"
import { cn } from "@/lib/utils"

export interface MathRendererProps {
  latex: string
  display?: boolean
  className?: string
}

export function MathRenderer({
  latex,
  display = false,
  className,
}: MathRendererProps) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(latex.trim() || " ", {
        displayMode: display,
        throwOnError: false,
        output: "html",
        strict: false,
      })
    } catch {
      return null
    }
  }, [latex, display])

  if (html === null) {
    return (
      <span
        className={cn(
          "font-mono text-sm text-muted-foreground dark:text-muted-foreground",
          display && "block",
          className
        )}
        title="Invalid LaTeX"
      >
        {latex || " "}
      </span>
    )
  }

  return (
    <span
      className={cn(
        display && "block text-center my-4",
        "[&>.katex]:text-inherit",
        className
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
