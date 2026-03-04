import { Node } from "@tiptap/core"
import { ReactNodeViewRenderer } from "@tiptap/react"
import { MathInlineNodeView, MathBlockNodeView } from "@/components/shared/MathNodeView"

export const MathInline = Node.create({
  name: "mathInline",

  group: "inline",

  inline: true,

  atom: true,

  addAttributes() {
    return {
      latex: {
        default: "",
        parseHTML: (el) => el.getAttribute("data-latex") ?? "",
        renderHTML: (attrs) => (attrs.latex ? { "data-latex": attrs.latex } : {}),
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-type="math-inline"]',
        getAttrs: (el) => ({
          latex: (el as HTMLElement).getAttribute("data-latex") ?? "",
        }),
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "span",
      {
        "data-type": "math-inline",
        "data-latex": HTMLAttributes["data-latex"],
      },
      0,
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer(MathInlineNodeView, { as: "span" })
  },
})

export const MathBlock = Node.create({
  name: "mathBlock",

  group: "block",

  atom: true,

  addAttributes() {
    return {
      latex: {
        default: "",
        parseHTML: (el) => el.getAttribute("data-latex") ?? "",
        renderHTML: (attrs) => (attrs.latex ? { "data-latex": attrs.latex } : {}),
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="math-block"]',
        getAttrs: (el) => ({
          latex: (el as HTMLElement).getAttribute("data-latex") ?? "",
        }),
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      {
        "data-type": "math-block",
        "data-latex": HTMLAttributes["data-latex"],
      },
      0,
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer(MathBlockNodeView, { as: "div" })
  },
})
