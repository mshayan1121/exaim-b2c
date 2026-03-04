export type BlockType = "text" | "math" | "math-block" | "chem" | "image"

export interface ContentBlock {
  id: string
  type: BlockType
  content: string // for text: HTML string, for math/chem: LaTeX string, for image: URL
}

export interface EditorContent {
  blocks: ContentBlock[]
}

// Helper to convert EditorContent to plain text for Claude evaluation
export function contentToPlainText(content: EditorContent): string {
  return content.blocks
    .map((block) => {
      switch (block.type) {
        case "text":
          // Strip HTML tags
          return block.content.replace(/<[^>]*>/g, "")
        case "math":
        case "math-block":
          return latexToReadable(block.content)
        case "chem":
          return block.content.replace(/_\{(\d+)\}/g, "$1")
        case "image":
          return "[image]"
        default:
          return block.content
      }
    })
    .join(" ")
}

function latexToReadable(latex: string): string {
  return latex
    .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, "($1)/($2)")
    .replace(/\^{([^}]+)}/g, "^$1")
    .replace(/_{([^}]+)}/g, "_$1")
    .replace(/\\sqrt\{([^}]+)\}/g, "sqrt($1)")
    .replace(/\\times/g, "×")
    .replace(/\\div/g, "÷")
    .replace(/\\pm/g, "±")
    .replace(/\\infty/g, "∞")
    .replace(/\\pi/g, "π")
    .replace(/\\alpha/g, "α")
    .replace(/\\beta/g, "β")
    .replace(/\\gamma/g, "γ")
    .replace(/\\rightarrow/g, "→")
    .replace(/\\leftrightharpoons/g, "⇌")
    .replace(/\\/g, "")
}
