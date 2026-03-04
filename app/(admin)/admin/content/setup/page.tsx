"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Plus, Trash2, Sparkles, Loader2, ChevronDown, ChevronRight } from "lucide-react"

interface Qualification {
  id: string
  name: string
}

interface ExamBoard {
  id: string
  name: string
  qualification_id: string
}

interface Subject {
  id: string
  name: string
  exam_board_id: string
}

interface EditableSubtopic {
  name: string
  display_order: number
}

interface EditableTopic {
  name: string
  display_order: number
  subtopics: EditableSubtopic[]
}

export default function AICourseSetupPage() {
  const [qualifications, setQualifications] = useState<Qualification[]>([])
  const [examBoards, setExamBoards] = useState<ExamBoard[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])

  const [qualificationId, setQualificationId] = useState("")
  const [examBoardId, setExamBoardId] = useState("")
  const [subjectId, setSubjectId] = useState("")
  const [variant, setVariant] = useState("")

  const [loadingHierarchy, setLoadingHierarchy] = useState(false)
  const [generateError, setGenerateError] = useState<string | null>(null)
  const [topics, setTopics] = useState<EditableTopic[] | null>(null)
  const [qualificationName, setQualificationName] = useState("")
  const [examBoardName, setExamBoardName] = useState("")
  const [subjectName, setSubjectName] = useState("")
  const [confirming, setConfirming] = useState(false)
  const [confirmError, setConfirmError] = useState<string | null>(null)
  const [success, setSuccess] = useState<{ topics: number; subtopics: number } | null>(null)
  const [expandedTopics, setExpandedTopics] = useState<Set<number>>(new Set())
  const [generatingSubtopicsFor, setGeneratingSubtopicsFor] = useState<number | null>(null)

  async function fetchQualifications() {
    const res = await fetch("/api/admin/qualifications")
    const json = await res.json()
    if (json.success) setQualifications(json.data ?? [])
  }

  async function fetchExamBoards() {
    if (!qualificationId) {
      setExamBoards([])
      setExamBoardId("")
      setSubjectId("")
      setSubjects([])
      return
    }
    const res = await fetch(`/api/admin/exam-boards?qualification_id=${qualificationId}`)
    const json = await res.json()
    if (json.success) setExamBoards(json.data ?? [])
    setExamBoardId("")
    setSubjectId("")
    setSubjects([])
  }

  async function fetchSubjects() {
    if (!examBoardId) {
      setSubjects([])
      setSubjectId("")
      return
    }
    const res = await fetch(`/api/admin/subjects?exam_board_id=${examBoardId}`)
    const json = await res.json()
    if (json.success) setSubjects(json.data ?? [])
    setSubjectId("")
  }

  useEffect(() => {
    fetchQualifications()
  }, [])

  useEffect(() => {
    fetchExamBoards()
  }, [qualificationId])

  useEffect(() => {
    fetchSubjects()
  }, [examBoardId])

  async function handleGenerate() {
    const qual = qualifications.find((q) => q.id === qualificationId)
    const board = examBoards.find((b) => b.id === examBoardId)
    const subj = subjects.find((s) => s.id === subjectId)
    if (!qual || !board || !subj) {
      setGenerateError("Please select qualification, exam board and subject.")
      return
    }

    setLoadingHierarchy(true)
    setGenerateError(null)
    setSuccess(null)
    setTopics(null)

    try {
      const res = await fetch("/api/admin/ai/generate-hierarchy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          qualification: qual.name,
          exam_board: board.name,
          subject: subj.name,
          variant: variant.trim() || undefined,
        }),
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.error ?? "Failed to generate")

      setQualificationName(qual.name)
      setExamBoardName(board.name)
      setSubjectName(subj.name)
      const raw = json.data
      setTopics(
        (raw.topics ?? []).map((t: { name: string; display_order: number; subtopics?: { name: string; display_order: number }[] }) => ({
          name: t.name,
          display_order: t.display_order ?? 0,
          subtopics: (t.subtopics ?? []).map((s: { name: string; display_order: number }, i: number) => ({
            name: s.name,
            display_order: s.display_order ?? i,
          })),
        }))
      )
      setExpandedTopics(new Set((raw.topics ?? []).map((_: unknown, i: number) => i)))
    } catch (err) {
      setGenerateError(err instanceof Error ? err.message : "Failed to generate hierarchy")
    } finally {
      setLoadingHierarchy(false)
    }
  }

  function updateTopic(index: number, updates: Partial<EditableTopic>) {
    if (!topics) return
    setTopics(
      topics.map((t, i) => (i === index ? { ...t, ...updates } : t))
    )
  }

  function updateSubtopic(topicIndex: number, subtopicIndex: number, updates: Partial<EditableSubtopic>) {
    if (!topics) return
    setTopics(
      topics.map((t, ti) =>
        ti === topicIndex
          ? {
              ...t,
              subtopics: t.subtopics.map((s, si) =>
                si === subtopicIndex ? { ...s, ...updates } : s
              ),
            }
          : t
      )
    )
  }

  function addTopic() {
    if (!topics) return
    setTopics([
      ...topics,
      { name: "New topic", display_order: topics.length, subtopics: [] },
    ])
  }

  function addSubtopic(topicIndex: number) {
    if (!topics) return
    setTopics(
      topics.map((t, i) =>
        i === topicIndex
          ? {
              ...t,
              subtopics: [
                ...t.subtopics,
                { name: "New subtopic", display_order: t.subtopics.length },
              ],
            }
          : t
      )
    )
  }

  function deleteTopic(index: number) {
    if (!topics) return
    setTopics(topics.filter((_, i) => i !== index))
  }

  function deleteSubtopic(topicIndex: number, subtopicIndex: number) {
    if (!topics) return
    setTopics(
      topics.map((t, i) =>
        i === topicIndex
          ? {
              ...t,
              subtopics: t.subtopics.filter((_, si) => si !== subtopicIndex),
            }
          : t
      )
    )
  }

  async function generateSubtopicsForTopic(topicIndex: number) {
    if (!topics) return
    const topic = topics[topicIndex]
    if (!topic) return

    setGeneratingSubtopicsFor(topicIndex)
    try {
      const res = await fetch("/api/admin/ai/generate-subtopics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic_name: topic.name,
          qualification: qualificationName,
          exam_board: examBoardName,
          subject: subjectName,
          variant: variant.trim() || undefined,
        }),
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.error ?? "Failed to generate")

      const raw = json.data
      const newSubtopics = (raw.subtopics ?? []).map(
        (s: { name: string; display_order: number }, i: number) => ({
          name: s.name,
          display_order: s.display_order ?? i,
        })
      )
      updateTopic(topicIndex, { subtopics: newSubtopics })
    } catch {
      // Could toast
    } finally {
      setGeneratingSubtopicsFor(null)
    }
  }

  function toggleExpanded(index: number) {
    setExpandedTopics((prev) => {
      const next = new Set(prev)
      if (next.has(index)) next.delete(index)
      else next.add(index)
      return next
    })
  }

  async function handleConfirm() {
    if (!topics || !subjectId) return

    setConfirming(true)
    setConfirmError(null)
    try {
      const res = await fetch("/api/admin/ai/confirm-hierarchy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject_id: subjectId,
          topics: topics.map((t) => ({
            name: t.name,
            display_order: t.display_order,
            subtopics: t.subtopics.map((s, i) => ({
              name: s.name,
              display_order: s.display_order ?? i,
            })),
          })),
        }),
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.error ?? "Failed to save")

      setSuccess({
        topics: json.data.topics_created ?? 0,
        subtopics: json.data.subtopics_created ?? 0,
      })
      setTopics(null)
    } catch (err) {
      setConfirmError(err instanceof Error ? err.message : "Failed to save hierarchy")
    } finally {
      setConfirming(false)
    }
  }

  function handleCancel() {
    setTopics(null)
    setSuccess(null)
    setGenerateError(null)
    setConfirmError(null)
  }

  const canGenerate = qualificationId && examBoardId && subjectId

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-foreground dark:text-foreground">
          Course Setup
        </h1>
        <p className="mt-2 text-muted-foreground dark:text-muted-foreground">
          Use AI to automatically generate topics and subtopics for a course. Review and edit before saving.
        </p>
      </div>

      {success && (
        <Card className="mb-6 border-accent/50 bg-accent/5 p-6 dark:border-accent/30 dark:bg-accent/10">
          <p className="font-medium text-foreground dark:text-foreground">
            Successfully created {success.topics} topics and {success.subtopics} subtopics.
          </p>
          <Link href="/admin/content/topics">
            <Button variant="outline" size="sm" className="mt-4">
              View topics
            </Button>
          </Link>
        </Card>
      )}

      <Card className="rounded-lg border border-border bg-surface-raised p-6 dark:border-border dark:bg-surface-raised">
        <h2 className="mb-4 text-lg font-medium text-foreground dark:text-foreground">
          Generation form
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <Label>Qualification</Label>
            <Select value={qualificationId} onValueChange={setQualificationId}>
              <SelectTrigger>
                <SelectValue placeholder="Select qualification" />
              </SelectTrigger>
              <SelectContent>
                {qualifications.map((q) => (
                  <SelectItem key={q.id} value={q.id}>
                    {q.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Exam Board</Label>
            <Select value={examBoardId} onValueChange={setExamBoardId}>
              <SelectTrigger>
                <SelectValue placeholder="Select exam board" />
              </SelectTrigger>
              <SelectContent>
                {examBoards.map((b) => (
                  <SelectItem key={b.id} value={b.id}>
                    {b.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Subject</Label>
            <Select value={subjectId} onValueChange={setSubjectId}>
              <SelectTrigger>
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="variant">Variant (optional)</Label>
            <Input
              id="variant"
              value={variant}
              onChange={(e) => setVariant(e.target.value)}
              placeholder="e.g. Triple, Combined"
            />
          </div>
        </div>
        {generateError && (
          <p className="mt-4 text-sm text-destructive dark:text-destructive">{generateError}</p>
        )}
        <Button
          onClick={handleGenerate}
          disabled={!canGenerate || loadingHierarchy}
          className="mt-4 gap-2"
        >
          {loadingHierarchy ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating hierarchy — this may take a few seconds…
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Generate
            </>
          )}
        </Button>
      </Card>

      {topics && topics.length > 0 && (
        <Card className="mt-6 rounded-lg border border-border bg-surface-raised p-6 dark:border-border dark:bg-surface-raised">
          <h2 className="mb-4 text-lg font-medium text-foreground dark:text-foreground">
            Review and edit
          </h2>
          <div className="space-y-2">
            {topics.map((topic, ti) => (
              <div
                key={ti}
                className="rounded-lg border border-border bg-surface dark:border-border dark:bg-surface"
              >
                <div className="flex items-center gap-2 p-3">
                  <button
                    type="button"
                    onClick={() => toggleExpanded(ti)}
                    className="rounded p-1 hover:bg-accent/30 dark:hover:bg-accent/20"
                  >
                    {expandedTopics.has(ti) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </button>
                  <Input
                    value={topic.name}
                    onChange={(e) => updateTopic(ti, { name: e.target.value })}
                    className="max-w-md border-0 bg-transparent font-medium shadow-none focus-visible:ring-0"
                    placeholder="Topic name"
                  />
                  <div className="ml-auto flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => generateSubtopicsForTopic(ti)}
                      disabled={generatingSubtopicsFor === ti}
                    >
                      {generatingSubtopicsFor === ti ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Generate subtopics"
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => addSubtopic(ti)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => deleteTopic(ti)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {expandedTopics.has(ti) && (
                  <div className="border-t border-border px-4 py-3 pl-12 dark:border-border">
                    {topic.subtopics.length === 0 ? (
                      <p className="text-sm text-muted-foreground dark:text-muted-foreground">
                        No subtopics. Click &quot;Add subtopic&quot; or &quot;Generate subtopics&quot;.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {topic.subtopics.map((st, si) => (
                          <div
                            key={si}
                            className="flex items-center gap-2 rounded bg-muted/50 px-3 py-2 dark:bg-muted/30"
                          >
                            <Input
                              value={st.name}
                              onChange={(e) =>
                                updateSubtopic(ti, si, { name: e.target.value })
                              }
                              className="flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0"
                              placeholder="Subtopic name"
                            />
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              className="text-destructive hover:bg-destructive/10"
                              onClick={() => deleteSubtopic(ti, si)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Button variant="outline" onClick={addTopic} className="gap-2">
              <Plus className="h-4 w-4" />
              Add topic
            </Button>
            <Button onClick={handleConfirm} disabled={confirming} className="gap-2">
              {confirming ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving…
                </>
              ) : (
                "Confirm and Save"
              )}
            </Button>
            <Button variant="ghost" onClick={handleCancel} disabled={confirming}>
              Cancel
            </Button>
            {confirmError && (
              <p className="text-sm text-destructive dark:text-destructive">{confirmError}</p>
            )}
          </div>
        </Card>
      )}

      {topics && topics.length === 0 && !success && (
        <Card className="mt-6 rounded-lg border border-border bg-surface-raised p-6 dark:border-border dark:bg-surface-raised">
          <p className="text-muted-foreground dark:text-muted-foreground">
            No topics were generated. Try a different combination or add topics manually.
          </p>
          <Button variant="outline" onClick={handleCancel} className="mt-4">
            Cancel
          </Button>
        </Card>
      )}
    </div>
  )
}
