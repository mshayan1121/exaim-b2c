"use client"

import { Button } from "@/components/ui/button"
import { Calculator } from "lucide-react"
import { cn } from "@/lib/utils"

const SYMBOLS = [
  { label: "π", latex: "\\pi " },
  { label: "√", latex: "\\sqrt{}" },
  { label: "½", latex: "\\frac{1}{2}" },
  { label: "×", latex: "\\times " },
  { label: "÷", latex: "\\div " },
  { label: "±", latex: "\\pm " },
  { label: "→", latex: "\\rightarrow " },
  { label: "α", latex: "\\alpha " },
  { label: "β", latex: "\\beta " },
  { label: "²", latex: "^{2}" },
  { label: "₃", latex: "_3" },
  { label: "⁺", latex: "^{+}" },
  { label: "⁻", latex: "^{-}" },
]

export interface SymbolPaletteProps {
  onInsert: (value: string) => void
  isOpen: boolean
  onToggle: () => void
}

export function SymbolPalette({
  onInsert,
  isOpen,
  onToggle,
}: SymbolPaletteProps) {
  return (
    <div className="relative">
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        onClick={onToggle}
        title={isOpen ? "Close math symbols" : "Open math symbols"}
        className={cn(
          "h-9 w-9 shrink-0",
          isOpen && "bg-primary/10 text-primary dark:bg-primary/20"
        )}
      >
        <Calculator className="size-4" />
      </Button>
      {isOpen && (
        <div className="absolute bottom-full left-0 right-auto z-50 mb-2 w-full min-w-[280px] rounded-lg border border-border bg-popover p-3 shadow-lg dark:border-border dark:bg-popover">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Insert symbol
            </span>
          </div>
          <div className="flex flex-wrap gap-1">
            {SYMBOLS.map((s) => (
              <Button
                key={s.label}
                type="button"
                variant="outline"
                size="xs"
                className="h-8 min-w-8 font-mono text-sm"
                onClick={() => onInsert(s.latex)}
              >
                {s.label}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
