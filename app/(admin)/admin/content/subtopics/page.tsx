"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Plus, Pencil, Trash2, ListTree } from "lucide-react"

interface Topic {
  id: string
  name: string
}

interface Subtopic {
  id: string
  name: string
  topic_id: string
  is_active: boolean | null
  created_at: string | null
  topics?: {
    name: string
    subjects?: { name: string; exam_boards?: { name: string; qualifications?: { name: string } } }
  }
}

export default function SubtopicsPage() {
  const [data, setData] = useState<Subtopic[]>([])
  const [topics, setTopics] = useState<Topic[]>([])
  const [topicFilter, setTopicFilter] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [selected, setSelected] = useState<Subtopic | null>(null)
  const [formName, setFormName] = useState("")
  const [formTopicId, setFormTopicId] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  async function fetchTopics() {
    const res = await fetch("/api/admin/topics")
    const json = await res.json()
    if (json.success) setTopics(json.data ?? [])
  }

  async function fetchData() {
    setLoading(true)
    setError(null)
    try {
      await fetchTopics()
      const url = topicFilter
        ? `/api/admin/subtopics?topic_id=${topicFilter}`
        : "/api/admin/subtopics"
      const res = await fetch(url)
      const json = await res.json()
      if (!json.success) throw new Error(json.error ?? "Failed to fetch")
      setData(json.data ?? [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [topicFilter])

  function openCreate() {
    setFormName("")
    setFormTopicId(topics[0]?.id ?? "")
    setFormError(null)
    setCreateOpen(true)
  }

  function openEdit(st: Subtopic) {
    setSelected(st)
    setFormName(st.name)
    setFormTopicId(st.topic_id)
    setFormError(null)
    setEditOpen(true)
  }

  function openDelete(st: Subtopic) {
    setSelected(st)
    setFormError(null)
    setDeleteOpen(true)
  }

  async function handleCreate() {
    if (!formTopicId) return
    setSubmitting(true)
    setFormError(null)
    try {
      const res = await fetch("/api/admin/subtopics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic_id: formTopicId,
          name: formName,
        }),
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.error ?? "Failed to create")
      setCreateOpen(false)
      fetchData()
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to create")
    } finally {
      setSubmitting(false)
    }
  }

  async function handleEdit() {
    if (!selected) return
    setSubmitting(true)
    setFormError(null)
    try {
      const res = await fetch(`/api/admin/subtopics/${selected.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic_id: formTopicId,
          name: formName,
        }),
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.error ?? "Failed to update")
      setEditOpen(false)
      setSelected(null)
      fetchData()
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to update")
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete() {
    if (!selected) return
    setSubmitting(true)
    setFormError(null)
    try {
      const res = await fetch(`/api/admin/subtopics/${selected.id}`, { method: "DELETE" })
      const json = await res.json()
      if (!json.success) throw new Error(json.error ?? "Failed to delete")
      setDeleteOpen(false)
      setSelected(null)
      fetchData()
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to delete")
    } finally {
      setSubmitting(false)
    }
  }

  const topicName = (id: string) => topics.find((t) => t.id === id)?.name ?? id

  const qualificationName = (st: Subtopic) => st.topics?.subjects?.exam_boards?.qualifications?.name ?? "—"
  const examBoardName = (st: Subtopic) => st.topics?.subjects?.exam_boards?.name ?? "—"
  const subjectName = (st: Subtopic) => st.topics?.subjects?.name ?? "—"
  const topicNameFromSubtopic = (st: Subtopic) => st.topics?.name ?? topicName(st.topic_id)

  if (loading) {
    return (
      <div className="p-8">
        <div className="mb-6 flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-9 w-48" />
        </div>
        <div className="rounded-lg border border-border bg-surface-raised dark:border-border dark:bg-surface-raised">
          <div className="border-b border-border p-4 dark:border-border">
            <div className="flex gap-4">
              <Skeleton className="h-4 flex-1" />
              <Skeleton className="h-4 flex-1" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="border-b border-border-subtle p-4 dark:border-border-subtle">
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-6 dark:bg-destructive/10">
          <p className="font-medium text-destructive dark:text-destructive">{error}</p>
          <Button variant="outline" size="sm" className="mt-4" onClick={() => fetchData()}>
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-foreground dark:text-foreground">Subtopics</h1>
        <div className="flex items-center gap-3">
          <Select
            value={topicFilter || "all"}
            onValueChange={(v) => setTopicFilter(v === "all" ? "" : v)}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All topics" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All topics</SelectItem>
              {topics.map((t) => (
                <SelectItem key={t.id} value={t.id}>
                  {t.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={openCreate} className="gap-2">
            <Plus className="h-4 w-4" />
            Create
          </Button>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-surface-raised py-16 dark:border-border dark:bg-surface-raised">
          <ListTree className="mb-4 h-12 w-12 text-muted-foreground dark:text-muted-foreground" />
          <p className="text-center text-muted-foreground dark:text-muted-foreground">
            No subtopics yet. Create topics first, or use AI Course Setup to generate them.
          </p>
          <Button onClick={openCreate} className="mt-4 gap-2" disabled={topics.length === 0}>
            <Plus className="h-4 w-4" />
            Create subtopic
          </Button>
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-surface-raised shadow-md dark:border-border dark:bg-surface-raised">
          <table className="w-full">
            <thead className="border-b border-border bg-surface dark:border-border dark:bg-surface">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground dark:text-foreground">
                  Qualification
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground dark:text-foreground">
                  Exam Board
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground dark:text-foreground">
                  Subject
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground dark:text-foreground">
                  Topic
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground dark:text-foreground">
                  Subtopic Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground dark:text-foreground">
                  Status
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-foreground dark:text-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((st) => (
                <tr
                  key={st.id}
                  className="border-b border-border-subtle transition-colors hover:bg-surface dark:border-border-subtle dark:hover:bg-surface"
                >
                  <td className="px-4 py-3 text-sm text-muted-foreground dark:text-muted-foreground">
                    {qualificationName(st)}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground dark:text-muted-foreground">
                    {examBoardName(st)}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground dark:text-muted-foreground">
                    {subjectName(st)}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground dark:text-muted-foreground">
                    {topicNameFromSubtopic(st)}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground dark:text-foreground">{st.name}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                        st.is_active
                          ? "bg-accent/20 text-accent dark:bg-accent/30 dark:text-accent"
                          : "bg-muted text-muted-foreground dark:bg-muted dark:text-muted-foreground"
                      }`}
                    >
                      {st.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon-sm" onClick={() => openEdit(st)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive dark:hover:bg-destructive/20"
                        onClick={() => openDelete(st)}
                        disabled={!st.is_active}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create subtopic</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Topic</Label>
              <Select value={formTopicId} onValueChange={setFormTopicId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select topic" />
                </SelectTrigger>
                <SelectContent>
                  {topics.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-name">Name</Label>
              <Input
                id="create-name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g. Isotopes"
              />
            </div>
            {formError && (
              <p className="text-sm text-destructive dark:text-destructive">{formError}</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={submitting || !formName.trim() || !formTopicId}
            >
              {submitting ? "Creating…" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit subtopic</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Topic</Label>
              <Select value={formTopicId} onValueChange={setFormTopicId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select topic" />
                </SelectTrigger>
                <SelectContent>
                  {topics.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g. Isotopes"
              />
            </div>
            {formError && (
              <p className="text-sm text-destructive dark:text-destructive">{formError}</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button
              onClick={handleEdit}
              disabled={submitting || !formName.trim() || !formTopicId}
            >
              {submitting ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete subtopic</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{selected?.name}&quot;? This will soft-deactivate it.
            </AlertDialogDescription>
            {formError && (
              <p className="text-sm text-destructive dark:text-destructive">{formError}</p>
            )}
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={submitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault()
                handleDelete()
              }}
              disabled={submitting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {submitting ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
