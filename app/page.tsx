import Link from "next/link"
import { Button } from "@/components/ui/button"
import { GraduationCap, BookOpen } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-16 dark:bg-background">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground dark:text-foreground">
          ExAIm
        </h1>
        <p className="mt-4 text-lg text-muted-foreground dark:text-muted-foreground">
          AI-powered exam preparation for teachers and students
        </p>
        <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link href="/signup">
            <Button
              size="lg"
              className="flex w-full items-center gap-2 sm:w-auto bg-primary hover:bg-primary/90 dark:bg-primary dark:hover:bg-primary/90"
            >
              <GraduationCap className="h-5 w-5" />
              Sign up as Teacher
            </Button>
          </Link>
          <Link href="/signup">
            <Button
              size="lg"
              variant="outline"
              className="flex w-full items-center gap-2 sm:w-auto border-border dark:border-border dark:bg-input/30 dark:hover:bg-input/50"
            >
              <BookOpen className="h-5 w-5" />
              Sign up as Student
            </Button>
          </Link>
        </div>
        <p className="mt-8 text-sm text-muted-foreground dark:text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline dark:text-primary">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
