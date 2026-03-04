import { requireRole } from "@/lib/utils/auth"
import { createClient } from "@/lib/supabase/server"
import {
  DashboardSidebar,
  studentNavItems,
} from "@/components/shared/dashboard-sidebar"

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const profile = await requireRole("student")
  const supabase = await createClient()
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("plan")
    .eq("user_id", profile.id)
    .single()

  return (
    <div className="flex min-h-screen bg-background dark:bg-background">
      <DashboardSidebar
        user={{ full_name: profile.full_name, avatar_url: profile.avatar_url }}
        plan={(subscription?.plan as "free" | "paid") ?? "free"}
        navItems={studentNavItems}
        title="Student"
      />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
