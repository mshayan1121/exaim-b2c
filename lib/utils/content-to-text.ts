/**
 * Converts TipTap JSON content to plain text for Claude evaluation.
 * Walks the document tree and extracts text; converts math nodes via latexToReadable.
 */

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
    .replace(/\\ce\{([^}]+)\}/g, "$1")
    .replace(/\\/g, "")
}

interface TipTapNode {
  type: string
  content?: TipTapNode[]
  text?: string
  attrs?: { latex?: string }
}

function nodeToText(node: TipTapNode): string {
  if (node.text) return node.text
  if (node.type === "inlineMath") {
    const latex = node.attrs?.latex ?? ""
    return latexToReadable(latex)
  }
  if (node.type === "image") return "[image]"
  if (node.content?.length) {
    return node.content.map(nodeToText).join("")
  }
  return ""
}

function blockToText(node: TipTapNode): string {
  if (node.type === "paragraph" || node.type === "heading") {
    const inner = (node.content ?? []).map(nodeToText).join("")
    return inner + "\n"
  }
  if (node.type === "bulletList" || node.type === "orderedList") {
    const items = (node.content ?? []).map((item) => {
      const itemContent = (item.content ?? []).map(nodeToText).join("").trim()
      return "• " + itemContent
    })
    return items.join("\n") + "\n"
  }
  if (node.type === "listItem") {
    return (node.content ?? []).map(nodeToText).join("")
  }
  if (node.type === "blockquote") {
    return (node.content ?? []).map(blockToText).join("")
  }
  return (node.content ?? []).map(nodeToText).join("")
}

export function tiptapContentToPlainText(content: object): string {
  const doc = content as { content?: TipTapNode[] }
  const blocks = doc.content ?? []
  const parts: string[] = []
  for (const node of blocks) {
    parts.push(blockToText(node))
  }
  return parts.join("").replace(/\n+/g, "\n").trim()
}
