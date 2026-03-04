"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  FileText,
  Users,
  BarChart3,
  Settings,
  LogOut,
  BookOpen,
  ClipboardList,
  Library,
  Brain,
  TrendingUp,
  ChevronDown,
  ChevronRight,
  GraduationCap,
  Award,
  BookMarked,
  Layers,
  ListTree,
  Sparkles,
} from "lucide-react"

interface NavItem {
  href: string
  label: string
  icon: React.ReactNode
}

interface NavGroup {
  label: string
  icon: React.ReactNode
  children: NavItem[]
}

interface DashboardSidebarProps {
  user: { full_name: string; avatar_url: string | null }
  plan?: "free" | "paid"
  navItems: (NavItem | NavGroup)[]
  title: string
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export function DashboardSidebar({
  user,
  plan = "free",
  navItems,
  title,
}: DashboardSidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    Content: pathname?.startsWith("/admin/content") ?? true,
  })

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-border bg-surface dark:border-border dark:bg-surface">
      <div className="flex h-14 items-center border-b border-border px-4 dark:border-border">
        <Link href="/" className="font-semibold text-foreground dark:text-foreground">
          ExAIm
        </Link>
      </div>
      <div className="flex flex-1 flex-col overflow-y-auto px-3 py-4">
        <div className="mb-4 px-2">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground dark:text-muted-foreground">
            {title}
          </p>
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => {
            if ("children" in item) {
              const isExpanded = expandedGroups[item.label] ?? true
              return (
                <div key={item.label}>
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedGroups((prev) => ({ ...prev, [item.label]: !isExpanded }))
                    }
                    className={cn(
                      "flex w-full items-center justify-between gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      "text-muted-foreground hover:bg-accent/50 hover:text-foreground dark:text-muted-foreground dark:hover:bg-accent/50 dark:hover:text-foreground"
                    )}
                  >
                    <span className="flex items-center gap-3">
                      {item.icon}
                      {item.label}
                    </span>
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </button>
                  {isExpanded && (
                    <div className="ml-4 mt-1 space-y-0.5 border-l border-border pl-3 dark:border-border">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={cn(
                            "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
                            pathname === child.href
                              ? "font-medium text-foreground dark:text-foreground"
                              : "text-muted-foreground hover:bg-accent/50 hover:text-foreground dark:text-muted-foreground dark:hover:bg-accent/50 dark:hover:text-foreground"
                          )}
                        >
                          {child.icon}
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            }
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  pathname === item.href
                    ? "bg-accent/30 text-foreground dark:bg-accent/30 dark:text-foreground"
                    : "text-muted-foreground hover:bg-accent/50 hover:text-foreground dark:text-muted-foreground dark:hover:bg-accent/50 dark:hover:text-foreground"
                )}
              >
                {item.icon}
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>
      <Separator className="dark:bg-border" />
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            {user.avatar_url ? (
              <AvatarImage src={user.avatar_url} alt="" />
            ) : null}
            <AvatarFallback className="bg-primary/10 text-primary dark:bg-primary/10 dark:text-primary">
              {getInitials(user.full_name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-medium text-foreground dark:text-foreground">
              {user.full_name}
            </p>
            <Badge
              variant="secondary"
              className="mt-0.5 text-[10px] capitalize dark:bg-secondary dark:text-secondary-foreground"
            >
              {plan}
            </Badge>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground dark:text-muted-foreground dark:hover:text-foreground"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </Button>
      </div>
    </aside>
  )
}

export const adminNavItems: (NavItem | NavGroup)[] = [
  { href: "/admin", label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
  {
    label: "Content",
    icon: <FileText className="h-4 w-4" />,
    children: [
      { href: "/admin/content/qualifications", label: "Qualifications", icon: <GraduationCap className="h-4 w-4" /> },
      { href: "/admin/content/exam-boards", label: "Exam Boards", icon: <Award className="h-4 w-4" /> },
      { href: "/admin/content/subjects", label: "Subjects", icon: <BookMarked className="h-4 w-4" /> },
      { href: "/admin/content/topics", label: "Topics", icon: <Layers className="h-4 w-4" /> },
      { href: "/admin/content/subtopics", label: "Subtopics", icon: <ListTree className="h-4 w-4" /> },
      { href: "/admin/content/courses", label: "Courses", icon: <BookOpen className="h-4 w-4" /> },
      { href: "/admin/content/setup", label: "AI Course Setup", icon: <Sparkles className="h-4 w-4" /> },
    ],
  },
  { href: "/admin/users", label: "Users", icon: <Users className="h-4 w-4" /> },
  { href: "/admin/analytics", label: "Analytics", icon: <BarChart3 className="h-4 w-4" /> },
  { href: "/admin/settings", label: "Settings", icon: <Settings className="h-4 w-4" /> },
]

export const teacherNavItems: NavItem[] = [
  { href: "/teacher", label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
  { href: "/teacher/classes", label: "Classes", icon: <BookOpen className="h-4 w-4" /> },
  { href: "/teacher/assignments", label: "Assignments", icon: <ClipboardList className="h-4 w-4" /> },
  { href: "/teacher/settings", label: "Settings", icon: <Settings className="h-4 w-4" /> },
]

export const studentNavItems: NavItem[] = [
  { href: "/student", label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
  { href: "/student/library", label: "Library", icon: <Library className="h-4 w-4" /> },
  { href: "/student/tutor", label: "AI Tutor", icon: <Brain className="h-4 w-4" /> },
  { href: "/student/progress", label: "Progress", icon: <TrendingUp className="h-4 w-4" /> },
  { href: "/student/settings", label: "Settings", icon: <Settings className="h-4 w-4" /> },
]
