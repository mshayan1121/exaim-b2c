"use client"

import { useState, useEffect, useCallback } from "react"
import { NodeViewWrapper, type ReactNodeViewProps } from "@tiptap/react"
import katex from "katex"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { MathRenderer } from "./MathRenderer"
import { cn } from "@/lib/utils"

interface MathNodeViewExtraProps {
  display?: boolean
}

function MathNodeView({
  node,
  updateAttributes,
  display = false,
}: ReactNodeViewProps & MathNodeViewExtraProps) {
  const latexAttr = (node.attrs?.latex as string | undefined) ?? ""
  const [latex, setLatex] = useState(latexAttr)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setLatex((node.attrs?.latex as string | undefined) ?? "")
  }, [node.attrs?.latex])

  const handleSave = useCallback(() => {
    updateAttributes({ latex })
    setOpen(false)
  }, [latex, updateAttributes])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !display) {
        e.preventDefault()
        handleSave()
      }
    },
    [display, handleSave]
  )

  const previewHtml = (() => {
    try {
      return katex.renderToString((latex || " ").trim(), {
        displayMode: display,
        throwOnError: false,
        output: "html",
      })
    } catch {
      return null
    }
  })()

  return (
    <NodeViewWrapper
      as={display ? "div" : "span"}
      className={cn(
        "inline cursor-pointer rounded px-1 py-0.5 transition-colors",
        "hover:bg-muted/60 dark:hover:bg-muted/40",
        display && "block my-4 text-center"
      )}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <span
            className="inline-block min-w-[2ch]"
            onClick={() => setOpen(true)}
          >
            {previewHtml ? (
              <span
                className="[&>.katex]:text-inherit"
                dangerouslySetInnerHTML={{ __html: previewHtml }}
              />
            ) : (
              <span className="font-mono text-sm text-muted-foreground">
                {latex || "(click to add math)"}
              </span>
            )}
          </span>
        </PopoverTrigger>
        <PopoverContent
          className="w-96"
          align={display ? "center" : "start"}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <div className="space-y-3">
            <Input
              placeholder="Enter LaTeX (e.g. x^2 + y^2 = r^2)"
              value={latex}
              onChange={(e) => setLatex(e.target.value)}
              onKeyDown={handleKeyDown}
              className="font-mono text-sm"
              autoFocus
            />
            <div className="rounded-md border border-border bg-muted/30 p-3 dark:border-border dark:bg-muted/20">
              <p className="mb-2 text-xs font-medium text-muted-foreground">
                Preview
              </p>
              <MathRenderer latex={latex || " "} display={display} />
            </div>
            <Button size="sm" onClick={handleSave}>
              Done
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </NodeViewWrapper>
  )
}

export function MathInlineNodeView(props: ReactNodeViewProps) {
  return <MathNodeView {...props} display={false} />
}

export function MathBlockNodeView(props: ReactNodeViewProps) {
  return <MathNodeView {...props} display />  
}
