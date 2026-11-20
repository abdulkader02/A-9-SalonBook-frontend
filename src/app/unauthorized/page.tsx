import Link from "next/link"
import { ShieldAlert } from "lucide-react"

import { Button } from "@/components/ui/button"

const UnauthorizedPage = () => {
  return (
    <section className="mx-auto flex min-h-[60vh] w-full max-w-7xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6 lg:px-8">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
        <ShieldAlert className="size-7" />
      </span>
      <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
        Access Denied
      </h1>
      <p className="mt-3 max-w-md text-base text-muted-foreground">
        You don&apos;t have permission to view this page.
      </p>
      <Button
        className="mt-6"
        nativeButton={false}
        render={<Link href="/" />}
      >
        Back to Home
      </Button>
    </section>
  )
}

export default UnauthorizedPage
