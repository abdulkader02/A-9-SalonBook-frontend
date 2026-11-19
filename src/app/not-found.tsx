import Link from "next/link"
import { AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"

const NotFoundPage = () => {
  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center gap-3 px-4 text-center sm:px-6">
      <span className="flex size-11 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
        <AlertCircle className="size-5" />
      </span>
      <h1 className="text-xl font-semibold sm:text-2xl">Page not found</h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        The page you are looking for doesn&apos;t exist or may have been moved.
        Head back to the homepage to continue.
      </p>
      <Button nativeButton={false} render={<Link href="/" />}>
        Go to homepage
      </Button>
    </section>
  )
}

export default NotFoundPage
