"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
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
import { Loader2, GraduationCap, BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"

type Role = "teacher" | "student" | null

export default function SignupPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<Role>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSignup() {
    setError(null)
    if (!role) {
      setError("Please select whether you're a Teacher or Student")
      return
    }
    if (!fullName.trim()) {
      setError("Full name is required")
      return
    }
    if (!email.trim()) {
      setError("Email is required")
      return
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters")
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password,
          full_name: fullName.trim(),
          role,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.")
        setLoading(false)
        return
      }
      router.push(`/verify-email?email=${encodeURIComponent(email.trim())}`)
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
          Create an account
        </CardTitle>
        <CardDescription className="text-muted-foreground dark:text-muted-foreground">
          Enter your details to get started
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
          <Label className="text-foreground dark:text-foreground">
            I am a
          </Label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole("teacher")}
              disabled={loading}
              className={cn(
                "flex flex-col items-center gap-2 rounded-lg border-2 px-4 py-4 transition-colors",
                role === "teacher"
                  ? "border-primary bg-primary/10 text-primary dark:border-primary dark:bg-primary/10 dark:text-primary"
                  : "border-border bg-surface hover:border-primary/50 dark:border-border dark:bg-surface dark:hover:border-primary/50"
              )}
            >
              <GraduationCap className="h-8 w-8" />
              <span className="font-medium">Teacher</span>
              <span className="text-xs text-muted-foreground">Assign exams & track students</span>
            </button>
            <button
              type="button"
              onClick={() => setRole("student")}
              disabled={loading}
              className={cn(
                "flex flex-col items-center gap-2 rounded-lg border-2 px-4 py-4 transition-colors",
                role === "student"
                  ? "border-primary bg-primary/10 text-primary dark:border-primary dark:bg-primary/10 dark:text-primary"
                  : "border-border bg-surface hover:border-primary/50 dark:border-border dark:bg-surface dark:hover:border-primary/50"
              )}
            >
              <BookOpen className="h-8 w-8" />
              <span className="font-medium">Student</span>
              <span className="text-xs text-muted-foreground">Practice & get AI feedback</span>
            </button>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="full_name" className="text-foreground dark:text-foreground">
            Full name
          </Label>
          <Input
            id="full_name"
            type="text"
            placeholder="Jane Smith"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            disabled={loading}
            className="h-10 border-border dark:border-border dark:bg-input/30 dark:text-foreground"
            autoComplete="name"
          />
        </div>
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
        <div className="space-y-2">
          <Label htmlFor="password" className="text-foreground dark:text-foreground">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            className="h-10 border-border dark:border-border dark:bg-input/30 dark:text-foreground"
            autoComplete="new-password"
          />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button
          onClick={handleSignup}
          disabled={loading}
          className="h-10 w-full bg-primary font-medium hover:bg-primary/90 dark:bg-primary dark:hover:bg-primary/90"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            "Create account"
          )}
        </Button>
        <p className="text-center text-sm text-muted-foreground dark:text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline dark:text-primary">
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
