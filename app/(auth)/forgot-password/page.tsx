"use client"

import { useState } from "react"
import Link from "next/link"
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

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSubmit() {
    setError(null)
    if (!email.trim()) {
      setError("Please enter your email address")
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.")
        setLoading(false)
        return
      }
      setSuccess(true)
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <Card className="border-border bg-card shadow-lg dark:border-border dark:bg-card">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-semibold tracking-tight text-foreground dark:text-foreground">
            Check your email
          </CardTitle>
          <CardDescription className="text-muted-foreground dark:text-muted-foreground">
            If an account exists with that email, we&apos;ve sent a reset link. Check your inbox and spam folder.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Link href="/login" className="w-full">
            <Button variant="outline" className="h-10 w-full border-border dark:border-border">
              Back to sign in
            </Button>
          </Link>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="border-border bg-card shadow-lg dark:border-border dark:bg-card">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-semibold tracking-tight text-foreground dark:text-foreground">
          Forgot password?
        </CardTitle>
        <CardDescription className="text-muted-foreground dark:text-muted-foreground">
          Enter your email and we&apos;ll send you a reset link
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
          <Label htmlFor="email" className="text-foreground dark:text-foreground">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            className="h-10 border-border dark:border-border dark:bg-input/30 dark:text-foreground"
            autoComplete="email"
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
              Sending...
            </>
          ) : (
            "Send reset link"
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
