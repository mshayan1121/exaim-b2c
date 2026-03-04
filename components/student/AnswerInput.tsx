"use client"

import { useRef, useEffect, useCallback, useState } from "react"
import { MathRenderer } from "@/components/shared/MathRenderer"
import { MathKeyboard } from "./MathKeyboard"
import { MAX_ANSWER_LENGTH } from "@/constants"
import { cn } from "@/lib/utils"

export interface AnswerInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  maxLength?: number
  disabled?: boolean
}

export function AnswerInput({
  value,
  onChange,
  placeholder = "Type your answer here...",
  maxLength = MAX_ANSWER_LENGTH,
  disabled = false,
}: AnswerInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [keyboardOpen, setKeyboardOpen] = useState(false)

  const handleInsert = useCallback(
    (insertValue: string) => {
      const ta = textareaRef.current
      if (!ta) {
        onChange(value + insertValue)
        return
      }
      const start = ta.selectionStart
      const end = ta.selectionEnd
      const newValue =
        value.slice(0, start) + insertValue + value.slice(end)
      if (newValue.length <= maxLength) {
        onChange(newValue)
        setTimeout(() => {
          ta.focus()
          const newPos = start + insertValue.length
          ta.setSelectionRange(newPos, newPos)
        }, 0)
      }
    },
    [value, onChange, maxLength]
  )

  useEffect(() => {
    const ta = textareaRef.current
    if (!ta) return
    ta.style.height = "auto"
    ta.style.height = `${Math.min(ta.scrollHeight, 400)}px`
  }, [value])

  const remaining = maxLength - value.length

  return (
    <div className="space-y-2">
      <div className="relative flex gap-2">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => {
            const v = e.target.value
            if (v.length <= maxLength) onChange(v)
          }}
          placeholder={placeholder}
          disabled={disabled}
          rows={4}
          className={cn(
            "flex-1 resize-none rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none",
            "placeholder:text-muted-foreground",
            "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
            "disabled:pointer-events-none disabled:opacity-50",
            "min-h-[120px] max-h-[400px]",
            "dark:bg-input/30"
          )}
          aria-label="Answer input"
        />
        <div className="flex flex-col items-start gap-1 pt-2">
          <MathKeyboard
            onInsert={handleInsert}
            isOpen={keyboardOpen}
            onToggle={() => setKeyboardOpen((o) => !o)}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div
          className={cn(
            "rounded-md border border-border bg-muted/30 p-3 dark:border-border dark:bg-muted/20",
            "min-h-[80px]"
          )}
        >
          <p className="mb-2 text-xs font-medium text-muted-foreground">
            LaTeX preview
          </p>
          <div className="text-base leading-[1.6] [&_.katex]:text-inherit">
            {value.trim() ? (
              <MathRenderer latex={value} display={false} />
            ) : (
              <span className="text-muted-foreground">—</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground sm:self-end">
          <span
            className={cn(
              remaining < 100 && "text-warning",
              remaining < 0 && "text-destructive"
            )}
          >
            {remaining} characters left
          </span>
        </div>
      </div>
    </div>
  )
}
