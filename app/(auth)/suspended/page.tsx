"use client"

import { useRouter } from "next/navigation"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { AlertTriangle } from "lucide-react"

export default function SuspendedPage() {
  const router = useRouter()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  return (
    <Card className="border-border bg-card shadow-lg dark:border-border dark:bg-card">
      <CardHeader className="space-y-1 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 dark:bg-destructive/10">
          <AlertTriangle className="h-6 w-6 text-destructive dark:text-destructive" />
        </div>
        <CardTitle className="text-2xl font-semibold tracking-tight text-foreground dark:text-foreground">
          Account suspended
        </CardTitle>
        <CardDescription className="text-muted-foreground dark:text-muted-foreground">
          Your account has been suspended. Please contact support if you believe this is an error.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <a
          href="mailto:support@exaim.com"
          className="text-sm font-medium text-primary hover:underline dark:text-primary"
        >
          support@exaim.com
        </a>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleSignOut}
          variant="outline"
          className="h-10 w-full border-border dark:border-border"
        >
          Sign out
        </Button>
      </CardFooter>
    </Card>
  )
}
