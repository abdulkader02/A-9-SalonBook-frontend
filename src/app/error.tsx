"use client"

import { useEffect } from "react"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

const ErrorPage = ({ error, reset }: ErrorProps) => {
  useEffect(() => {
    // Surface the error to logs for diagnostics - never render its message to
    // the user.
    console.error(error)
  }, [error])

  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center gap-3 px-4 text-center sm:px-6">
      <span className="flex size-11 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
        <AlertCircle className="size-5" />
      </span>
      <h1 className="text-xl font-semibold sm:text-2xl">
        Something went wrong
      </h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        We hit an unexpected problem. Please try again - your data is safe.
      </p>
      <Button onClick={() => reset()}>Try again</Button>
    </section>
  )
}

export default ErrorPage
