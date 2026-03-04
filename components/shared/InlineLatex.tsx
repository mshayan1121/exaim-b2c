"use client"

import { useRef, useEffect } from "react"
import { cn } from "@/lib/utils"

interface InlineLatexProps {
  latex: string
  display?: boolean
  className?: string
}

export function InlineLatex({
  latex,
  display = false,
  className,
}: InlineLatexProps) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (typeof window === "undefined" || !ref.current || !latex.trim()) return
    import("katex").then((katex) => {
      try {
        katex.default.render(latex, ref.current!, {
          throwOnError: false,
          displayMode: display,
        })
      } catch {
        ref.current.textContent = latex
      }
    })
  }, [latex, display])

  if (!latex.trim()) return <span className={cn("text-muted-foreground", className)}>—</span>

  return (
    <span
      ref={ref}
      className={cn("[&_.katex]:text-inherit", className)}
      aria-hidden
    />
  )
}
