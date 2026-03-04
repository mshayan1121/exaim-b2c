"use client"

import { Button } from "@/components/ui/button"
import { Calculator } from "lucide-react"
import { cn } from "@/lib/utils"

const NUMBERS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
const OPERATORS = ["+", "-", "×", "÷", "=", "(", ")"]
const SUBSCRIPTS = ["₁", "₂", "₃", "₄", "₅", "₆", "₇", "₈", "₉"]
const SYMBOLS = [
  { label: "π", value: "\\pi " },
  { label: "∞", value: "\\infty " },
  { label: "±", value: "\\pm " },
  { label: "≤", value: "\\leq " },
  { label: "≥", value: "\\geq " },
  { label: "→", value: "\\rightarrow " },
  { label: "∝", value: "\\propto " },
]
const GREEK = [
  { label: "α", value: "\\alpha " },
  { label: "β", value: "\\beta " },
  { label: "γ", value: "\\gamma " },
  { label: "δ", value: "\\delta " },
  { label: "λ", value: "\\lambda " },
  { label: "μ", value: "\\mu " },
  { label: "θ", value: "\\theta " },
  { label: "φ", value: "\\phi " },
]
const TRIG = [
  { label: "sin", value: "\\sin " },
  { label: "cos", value: "\\cos " },
  { label: "tan", value: "\\tan " },
]
const CHEMICAL = [
  { label: "→", value: " \\rightarrow " },
  { label: "⇌", value: " \\rightleftarrows " },
  { label: "+", value: " + " },
]
const POWER_TEMPLATES = [
  { label: "x²", value: "^{2}" },
  { label: "x³", value: "^{3}" },
  { label: "xⁿ", value: "^{}" },
]
const ROOT_TEMPLATES = [
  { label: "√", value: "\\sqrt{}" },
  { label: "∛", value: "\\sqrt[3]{}" },
]
const FRACTION_TEMPLATE = { label: "a/b", value: "\\frac{}{}" }

export interface MathKeyboardProps {
  onInsert: (value: string) => void
  isOpen: boolean
  onToggle: () => void
}

export function MathKeyboard({
  onInsert,
  isOpen,
  onToggle,
}: MathKeyboardProps) {
  return (
    <div className="relative">
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        onClick={onToggle}
        title={isOpen ? "Close math keyboard" : "Open math keyboard"}
        className={cn(
          "h-9 w-9 shrink-0",
          isOpen && "bg-primary/10 text-primary dark:bg-primary/20"
        )}
      >
        <Calculator className="size-4" />
      </Button>

      {isOpen && (
        <div className="absolute bottom-full left-0 right-auto z-50 mb-2 w-full min-w-[320px] max-w-[min(400px,90vw)] rounded-lg border border-border bg-popover p-3 shadow-lg dark:border-border dark:bg-popover">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Math symbols
            </span>
            <Button
              type="button"
              variant="ghost"
              size="xs"
              onClick={onToggle}
              className="h-6 px-2 text-xs"
            >
              Close
            </Button>
          </div>

          <div className="grid gap-2">
            {/* Numbers */}
            <div className="flex flex-wrap gap-1">
              {NUMBERS.map((n) => (
                <Button
                  key={n}
                  type="button"
                  variant="outline"
                  size="xs"
                  className="h-8 w-8 min-w-8 p-0 font-mono text-sm"
                  onClick={() => onInsert(n)}
                >
                  {n}
                </Button>
              ))}
            </div>

            {/* Operators */}
            <div className="flex flex-wrap gap-1">
              {OPERATORS.map((op) => (
                <Button
                  key={op}
                  type="button"
                  variant="outline"
                  size="xs"
                  className="h-8 min-w-8 font-mono"
                  onClick={() => onInsert(op === "×" ? " \\times " : op === "÷" ? " \\div " : op)}
                >
                  {op}
                </Button>
              ))}
            </div>

            {/* Fractions, Powers, Roots */}
            <div className="flex flex-wrap gap-1">
              <Button
                type="button"
                variant="secondary"
                size="xs"
                className="h-8 text-xs"
                onClick={() => onInsert(FRACTION_TEMPLATE.value)}
              >
                {FRACTION_TEMPLATE.label}
              </Button>
              {POWER_TEMPLATES.map((p) => (
                <Button
                  key={p.label}
                  type="button"
                  variant="secondary"
                  size="xs"
                  className="h-8 text-xs"
                  onClick={() => onInsert(p.value)}
                >
                  {p.label}
                </Button>
              ))}
              {ROOT_TEMPLATES.map((r) => (
                <Button
                  key={r.label}
                  type="button"
                  variant="secondary"
                  size="xs"
                  className="h-8 text-xs"
                  onClick={() => onInsert(r.value)}
                >
                  {r.label}
                </Button>
              ))}
            </div>

            {/* Subscript numbers */}
            <div className="flex flex-wrap gap-1">
              <span className="flex items-center px-1 text-xs text-muted-foreground">
                Subscript:
              </span>
              {SUBSCRIPTS.map((s, i) => (
                <Button
                  key={s}
                  type="button"
                  variant="ghost"
                  size="xs"
                  className="h-8 w-8 min-w-8 p-0 text-sm"
                  onClick={() => onInsert(s)}
                >
                  {s}
                </Button>
              ))}
            </div>

            {/* Common symbols */}
            <div className="flex flex-wrap gap-1">
              {SYMBOLS.map((s) => (
                <Button
                  key={s.label}
                  type="button"
                  variant="ghost"
                  size="xs"
                  className="h-8 min-w-8 font-mono"
                  onClick={() => onInsert(s.value)}
                >
                  {s.label}
                </Button>
              ))}
            </div>

            {/* Greek letters */}
            <div className="flex flex-wrap gap-1">
              {GREEK.map((g) => (
                <Button
                  key={g.label}
                  type="button"
                  variant="ghost"
                  size="xs"
                  className="h-8 min-w-8 font-mono"
                  onClick={() => onInsert(g.value)}
                >
                  {g.label}
                </Button>
              ))}
            </div>

            {/* Trig */}
            <div className="flex flex-wrap gap-1">
              {TRIG.map((t) => (
                <Button
                  key={t.label}
                  type="button"
                  variant="ghost"
                  size="xs"
                  className="h-8 text-xs"
                  onClick={() => onInsert(t.value)}
                >
                  {t.label}
                </Button>
              ))}
            </div>

            {/* Chemical */}
            <div className="flex flex-wrap gap-1">
              <span className="flex items-center px-1 text-xs text-muted-foreground">
                Chemical:
              </span>
              {CHEMICAL.map((c) => (
                <Button
                  key={c.label}
                  type="button"
                  variant="ghost"
                  size="xs"
                  className="h-8 min-w-8"
                  onClick={() => onInsert(c.value)}
                >
                  {c.label}
                </Button>
              ))}
              {SUBSCRIPTS.map((s) => (
                <Button
                  key={`chem-${s}`}
                  type="button"
                  variant="ghost"
                  size="xs"
                  className="h-8 w-8 min-w-8 p-0 text-sm"
                  onClick={() => onInsert(s)}
                >
                  {s}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
