"use client"

import { Suspense, useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  )
}

function ResetPasswordContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    const hash = typeof window !== "undefined" ? window.location.hash : ""
    if (hash) {
      const params = new URLSearchParams(hash.replace("#", ""))
      const accessToken = params.get("access_token")
      const refreshToken = params.get("refresh_token")
      const type = params.get("type")
      if (accessToken && refreshToken && type === "recovery") {
        const supabase = createClient()
        supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken }).then(() => {
          window.history.replaceState(null, "", "/reset-password")
          setInitialized(true)
        })
      } else {
        setInitialized(true)
      }
    } else {
      setInitialized(true)
    }
  }, [])

  async function handleSubmit() {
    setError(null)
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters")
      return
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match")
      return
    }
    setLoading(true)
    try {
      const supabase = createClient()
      const { error: updateError } = await supabase.auth.updateUser({ password: newPassword })
      if (updateError) {
        setError(updateError.message)
        setLoading(false)
        return
      }
      router.push("/login")
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const token = searchParams.get("token")

  if (token) {
    return <ResetPasswordWithToken token={token} />
  }

  if (!initialized) {
    return (
      <Card className="border-border bg-card shadow-lg dark:border-border dark:bg-card">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border bg-card shadow-lg dark:border-border dark:bg-card">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-semibold tracking-tight text-foreground dark:text-foreground">
          Set new password
        </CardTitle>
        <CardDescription className="text-muted-foreground dark:text-muted-foreground">
          Enter your new password below
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div
            role="alert"
            className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive dark:border-destructive/50 dark:bg-destructive/10 dark:text-destructive"
          >
            {error}
          </div>
        )}
        <div className="space-y-2">
          <Label htmlFor="new_password" className="text-foreground dark:text-foreground">
            New password
          </Label>
          <Input
            id="new_password"
            type="password"
            placeholder="At least 8 characters"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={loading}
            className="h-10 border-border dark:border-border dark:bg-input/30 dark:text-foreground"
            autoComplete="new-password"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm_password" className="text-foreground dark:text-foreground">
            Confirm password
          </Label>
          <Input
            id="confirm_password"
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading}
            className="h-10 border-border dark:border-border dark:bg-input/30 dark:text-foreground"
            autoComplete="new-password"
          />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="h-10 w-full bg-primary font-medium hover:bg-primary/90 dark:bg-primary dark:hover:bg-primary/90"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Resetting...
            </>
          ) : (
            "Reset password"
          )}
        </Button>
        <Link
          href="/login"
          className="text-center text-sm font-medium text-primary hover:underline dark:text-primary"
        >
          Back to sign in
        </Link>
      </CardFooter>
    </Card>
  )
}

function ResetPasswordWithToken({ token }: { token: string }) {
  const router = useRouter()
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    setError(null)
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters")
      return
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match")
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, new_password: newPassword }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.")
        setLoading(false)
        return
      }
      router.push("/login")
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="border-border bg-card shadow-lg dark:border-border dark:bg-card">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-semibold tracking-tight text-foreground dark:text-foreground">
          Set new password
        </CardTitle>
        <CardDescription className="text-muted-foreground dark:text-muted-foreground">
          Enter your new password below
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div
            role="alert"
            className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive dark:border-destructive/50 dark:bg-destructive/10 dark:text-destructive"
          >
            {error}
          </div>
        )}
        <div className="space-y-2">
          <Label htmlFor="new_password_token" className="text-foreground dark:text-foreground">
            New password
          </Label>
          <Input
            id="new_password_token"
            type="password"
            placeholder="At least 8 characters"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={loading}
            className="h-10 border-border dark:border-border dark:bg-input/30 dark:text-foreground"
            autoComplete="new-password"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm_password_token" className="text-foreground dark:text-foreground">
            Confirm password
          </Label>
          <Input
            id="confirm_password_token"
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading}
            className="h-10 border-border dark:border-border dark:bg-input/30 dark:text-foreground"
            autoComplete="new-password"
          />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="h-10 w-full bg-primary font-medium hover:bg-primary/90 dark:bg-primary dark:hover:bg-primary/90"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Resetting...
            </>
          ) : (
            "Reset password"
          )}
        </Button>
        <Link
          href="/login"
          className="text-center text-sm font-medium text-primary hover:underline dark:text-primary"
        >
          Back to sign in
        </Link>
      </CardFooter>
    </Card>
  )
}
