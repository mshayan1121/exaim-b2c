"use client"

import { useRef, useEffect, useCallback, useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface MathKeyboardProps {
  isVisible: boolean
  mode: "math" | "chem"
  onModeChange: (mode: "math" | "chem") => void
  onInsert: (latex: string) => void
  currentLatex: string
  onLatexChange: (latex: string) => void
}

// Maths tab key rows
const MATH_ROW_1 = [
  { label: "7", latex: "7" },
  { label: "8", latex: "8" },
  { label: "9", latex: "9" },
  { label: "÷", latex: "\\div " },
  { label: "(", latex: "(" },
  { label: ")", latex: ")" },
]
const MATH_ROW_2 = [
  { label: "4", latex: "4" },
  { label: "5", latex: "5" },
  { label: "6", latex: "6" },
  { label: "×", latex: "\\times " },
  { label: "xⁿ", latex: "^{}" },
  { label: "x²", latex: "^{2}" },
]
const MATH_ROW_3 = [
  { label: "1", latex: "1" },
  { label: "2", latex: "2" },
  { label: "3", latex: "3" },
  { label: "−", latex: "-" },
  { label: "√x", latex: "\\sqrt{}" },
  { label: "∛x", latex: "\\sqrt[3]{}" },
]
const MATH_ROW_4 = [
  { label: "0", latex: "0" },
  { label: ".", latex: "." },
  { label: "=", latex: "=" },
  { label: "+", latex: "+" },
  { label: "½", latex: "\\frac{1}{2}" },
  { label: "π", latex: "\\pi " },
]
const MATH_ROW_5 = [
  { label: "±", latex: "\\pm " },
  { label: "≤", latex: "\\leq " },
  { label: "≥", latex: "\\geq " },
  { label: "≠", latex: "\\neq " },
  { label: "∞", latex: "\\infty " },
  { label: "→", latex: "\\rightarrow " },
]
const MATH_ROW_6 = [
  { label: "α", latex: "\\alpha " },
  { label: "β", latex: "\\beta " },
  { label: "γ", latex: "\\gamma " },
  { label: "δ", latex: "\\delta " },
  { label: "λ", latex: "\\lambda " },
  { label: "μ", latex: "\\mu " },
  { label: "θ", latex: "\\theta " },
  { label: "φ", latex: "\\phi " },
  { label: "Δ", latex: "\\Delta " },
  { label: "Σ", latex: "\\Sigma " },
]
const MATH_ROW_7 = [
  { label: "sin", latex: "\\sin " },
  { label: "cos", latex: "\\cos " },
  { label: "tan", latex: "\\tan " },
  { label: "sin⁻¹", latex: "\\sin^{-1} " },
  { label: "cos⁻¹", latex: "\\cos^{-1} " },
  { label: "tan⁻¹", latex: "\\tan^{-1} " },
]
const MATH_ROW_8 = [
  { label: "a/b", latex: "\\frac{}{}" },
  { label: "xⁿ", latex: "^{}" },
  { label: "√", latex: "\\sqrt{}" },
  { label: "|x|", latex: "\\left|  \\right|" },
  { label: "∑", latex: "\\sum_{}^{}" },
  { label: "∫", latex: "\\int_{}^{}" },
]

// Chemistry tab key rows
const CHEM_ROW_1 = [
  "H", "C", "N", "O", "Na", "Cl", "K", "Ca", "Fe", "Mg",
]
const CHEM_SUBSCRIPTS = ["₁", "₂", "₃", "₄", "₅", "₆", "₇", "₈", "₉", "₀"].map(
  (c, i) => ({ label: c, latex: i < 9 ? `_${i + 1}` : "_0" })
)
const CHEM_ROW_3 = [
  { label: "→", latex: " \\rightarrow " },
  { label: "⇌", latex: " \\rightleftarrows " },
  { label: "↑", latex: " \\uparrow " },
  { label: "↓", latex: " \\downarrow " },
  { label: "+", latex: " + " },
  { label: "→Δ", latex: " \\xrightarrow{\\Delta} " },
]
const CHEM_ROW_4 = [
  { label: "(s)", latex: "_{(s)}" },
  { label: "(l)", latex: "_{(l)}" },
  { label: "(g)", latex: "_{(g)}" },
  { label: "(aq)", latex: "_{(aq)}" },
]
const CHEM_ROW_5 = [
  "H₂O", "CO₂", "O₂", "H₂", "NaCl", "HCl", "H₂SO₄", "NaOH",
].map((s) => ({
  label: s,
  latex: s
    .replace(/₂/g, "_2")
    .replace(/₃/g, "_3")
    .replace(/₄/g, "_4")
    .replace(/₅/g, "_5")
    .replace(/₆/g, "_6")
    .replace(/₇/g, "_7")
    .replace(/₈/g, "_8")
    .replace(/₉/g, "_9")
    .replace(/₀/g, "_0")
    .replace(/⁺/g, "^{+}")
    .replace(/⁻/g, "^{-}")
    .replace(/²⁺/g, "^{2+}")
    .replace(/²⁻/g, "^{2-}")
    .replace(/³⁺/g, "^{3+}") + " ",
}))
const CHEM_ROW_6 = [
  { label: "⁺", latex: "^{+}" },
  { label: "⁻", latex: "^{-}" },
  { label: "²⁺", latex: "^{2+}" },
  { label: "²⁻", latex: "^{2-}" },
  { label: "³⁺", latex: "^{3+}" },
]

function KeyButton({
  label,
  latex,
  onPress,
}: {
  label: string
  latex: string
  onPress: (latex: string) => void
}) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className={cn(
        "h-8 min-w-8 shrink-0 font-mono text-sm transition-transform active:scale-95",
        "border-border bg-surface hover:bg-muted dark:border-border dark:bg-surface dark:hover:bg-muted/80"
      )}
      onClick={() => onPress(latex)}
    >
      {label}
    </Button>
  )
}

export function MathKeyboard({
  isVisible,
  mode,
  onModeChange,
  onInsert,
  currentLatex,
  onLatexChange,
}: MathKeyboardProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mathfieldRef = useRef<HTMLElement | null>(null)
  const [mounted, setMounted] = useState(false)

  const handleInput = useCallback(
    (e: Event) => {
      const target = e.target as { value?: string }
      if (typeof target.value === "string") {
        onLatexChange(target.value)
      }
    },
    [onLatexChange]
  )

  useEffect(() => {
    if (typeof window === "undefined") return
    import("mathlive").then((mod) => {
      const MathfieldElement = mod.MathfieldElement
      if (!MathfieldElement || !containerRef.current) return
      const mf = new MathfieldElement()
      mf.setAttribute("math-virtual-keyboard-policy", "manual")
      mf.value = currentLatex
      mf.addEventListener("input", handleInput)
      containerRef.current.innerHTML = ""
      containerRef.current.appendChild(mf)
      mathfieldRef.current = mf
      setMounted(true)
      return () => {
        mf.removeEventListener("input", handleInput)
        mf.remove()
        mathfieldRef.current = null
        setMounted(false)
      }
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const mf = mathfieldRef.current as { value: string } | null
    if (mf && mounted && mf.value !== currentLatex) {
      mf.value = currentLatex
    }
  }, [currentLatex, mounted])

  const handleKeyPress = useCallback(
    (latex: string) => {
      const mf = mathfieldRef.current as { insert?: (s: string) => boolean } | null
      if (mf?.insert) {
        mf.insert(latex)
        const val = (mathfieldRef.current as { value?: string })?.value
        if (typeof val === "string") onLatexChange(val)
      } else {
        onInsert(latex)
      }
    },
    [onInsert, onLatexChange]
  )

  return (
    <div
      className={cn(
        "overflow-hidden rounded-b-lg border border-t-0 border-border bg-surface transition-[height,opacity] duration-200 ease-out dark:border-border dark:bg-surface",
        "shadow-sm",
        !isVisible && "max-h-0 border-t-0 opacity-0"
      )}
      aria-hidden={!isVisible}
    >
      <Tabs
        value={mode}
        onValueChange={(v) => onModeChange(v as "math" | "chem")}
        className="w-full"
      >
        <div className="flex items-center justify-between border-b border-border px-3 py-2 dark:border-border">
          <TabsList className="bg-muted/50 dark:bg-muted/30">
            <TabsTrigger
              value="math"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground dark:data-[state=active]:bg-primary dark:data-[state=active]:text-primary-foreground"
            >
              ∑ Maths
            </TabsTrigger>
            <TabsTrigger
              value="chem"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground dark:data-[state=active]:bg-primary dark:data-[state=active]:text-primary-foreground"
            >
              ⚗ Chemistry
            </TabsTrigger>
          </TabsList>
        </div>

        {/* MathLive input */}
        <div className="border-b border-border px-3 py-2 dark:border-border">
          <div
            ref={containerRef}
            className="min-h-[44px] w-full rounded-md border border-input bg-background px-3 py-2 dark:border-input dark:bg-background [&_math-field]:min-h-[40px] [&_math-field]:w-full [&_math-field]:border-0 [&_math-field]:bg-transparent [&_math-field]:outline-none"
          />
        </div>

        <div className="max-h-[280px] overflow-y-auto p-3">
          <TabsContent value="math" className="mt-0 space-y-2">
            <div className="flex flex-wrap gap-1">
              {MATH_ROW_1.map((k) => (
                <KeyButton key={k.label} label={k.label} latex={k.latex} onPress={handleKeyPress} />
              ))}
            </div>
            <div className="flex flex-wrap gap-1">
              {MATH_ROW_2.map((k) => (
                <KeyButton key={k.label} label={k.label} latex={k.latex} onPress={handleKeyPress} />
              ))}
            </div>
            <div className="flex flex-wrap gap-1">
              {MATH_ROW_3.map((k) => (
                <KeyButton key={k.label} label={k.label} latex={k.latex} onPress={handleKeyPress} />
              ))}
            </div>
            <div className="flex flex-wrap gap-1">
              {MATH_ROW_4.map((k) => (
                <KeyButton key={k.label} label={k.label} latex={k.latex} onPress={handleKeyPress} />
              ))}
            </div>
            <div className="flex flex-wrap gap-1">
              {MATH_ROW_5.map((k) => (
                <KeyButton key={k.label} label={k.label} latex={k.latex} onPress={handleKeyPress} />
              ))}
            </div>
            <div className="flex flex-wrap gap-1">
              {MATH_ROW_6.map((k) => (
                <KeyButton key={k.label} label={k.label} latex={k.latex} onPress={handleKeyPress} />
              ))}
            </div>
            <div className="flex flex-wrap gap-1">
              {MATH_ROW_7.map((k) => (
                <KeyButton key={k.label} label={k.label} latex={k.latex} onPress={handleKeyPress} />
              ))}
            </div>
            <div className="flex flex-wrap gap-1">
              {MATH_ROW_8.map((k) => (
                <KeyButton key={k.label} label={k.label} latex={k.latex} onPress={handleKeyPress} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="chem" className="mt-0 space-y-2">
            <div className="flex flex-wrap gap-1">
              {CHEM_ROW_1.map((el) => (
                <KeyButton key={el} label={el} latex={el + " "} onPress={handleKeyPress} />
              ))}
            </div>
            <div className="flex flex-wrap gap-1">
              {CHEM_SUBSCRIPTS.map((k) => (
                <KeyButton key={k.label} label={k.label} latex={k.latex} onPress={handleKeyPress} />
              ))}
            </div>
            <div className="flex flex-wrap gap-1">
              {CHEM_ROW_3.map((k) => (
                <KeyButton key={k.label} label={k.label} latex={k.latex} onPress={handleKeyPress} />
              ))}
            </div>
            <div className="flex flex-wrap gap-1">
              {CHEM_ROW_4.map((k) => (
                <KeyButton key={k.label} label={k.label} latex={k.latex} onPress={handleKeyPress} />
              ))}
            </div>
            <div className="flex flex-wrap gap-1">
              {CHEM_ROW_5.map((k) => (
                <KeyButton key={k.label} label={k.label} latex={k.latex} onPress={handleKeyPress} />
              ))}
            </div>
            <div className="flex flex-wrap gap-1">
              {CHEM_ROW_6.map((k) => (
                <KeyButton key={k.label} label={k.label} latex={k.latex} onPress={handleKeyPress} />
              ))}
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
