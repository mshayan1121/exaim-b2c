"use client"

import { Suspense, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Loader2, Mail } from "lucide-react"

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  )
}

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const emailFromUrl = searchParams.get("email") ?? ""
  const [resending, setResending] = useState(false)
  const [resent, setResent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleResend() {
    setError(null)
    setResending(true)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      const email = user?.email ?? emailFromUrl
      if (!email) {
        setError("No email found. Please sign up again.")
        setResending(false)
        return
      }
      const { error: resendError } = await supabase.auth.resend({
        type: "signup",
        email,
      })
      if (resendError) {
        setError(resendError.message)
      } else {
        setResent(true)
      }
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setResending(false)
    }
  }

  return (
    <Card className="border-border bg-card shadow-lg dark:border-border dark:bg-card">
      <CardHeader className="space-y-1 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 dark:bg-primary/10">
          <Mail className="h-6 w-6 text-primary dark:text-primary" />
        </div>
        <CardTitle className="text-2xl font-semibold tracking-tight text-foreground dark:text-foreground">
          Check your email
        </CardTitle>
        <CardDescription className="text-muted-foreground dark:text-muted-foreground">
          {emailFromUrl
            ? `We sent a verification link to ${emailFromUrl}. Click the link to verify your account and get started.`
            : "We sent a verification link to your email address. Click the link to verify your account and get started."}
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
        {resent && (
          <div
            role="status"
            className="rounded-md border border-accent/50 bg-accent/10 px-3 py-2 text-sm text-accent dark:border-accent/50 dark:bg-accent/10 dark:text-accent"
          >
            Verification email sent! Check your inbox.
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button
          variant="outline"
          onClick={handleResend}
          disabled={resending}
          className="h-10 w-full border-border dark:border-border"
        >
          {resending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            "Resend verification email"
          )}
        </Button>
        <p className="text-center text-sm text-muted-foreground dark:text-muted-foreground">
          <Link href="/login" className="font-medium text-primary hover:underline dark:text-primary">
            Back to sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
