"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { AlertCircle, Scissors } from "lucide-react"

import { useSession } from "@/lib/auth-client"
import { getUserById } from "@/lib/api/users"
import type { User } from "@/lib/type/users"
import ProfileForm from "@/components/profile/ProfileForm"
import { Button } from "@/components/ui/button"

const CustomerProfilePage = () => {
  const { data: session, isPending: sessionLoading } = useSession()

  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")

  const customerId = session?.user?.id

  // Fetch the profile when the session and customer ID are available.
  useEffect(() => {
    if (sessionLoading) return
    if (!customerId) {
      setLoading(false)
      return
    }

    const fetchProfile = async () => {
      try {
        const data = await getUserById(customerId)
        setUser(data)
      } catch {
        setErrorMessage("We couldn't load your profile right now.")
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [sessionLoading, customerId])

  if (sessionLoading || loading) {
    return (
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Skeleton header */}
        <div className="flex flex-col gap-3">
          <div className="h-8 w-1/3 animate-pulse rounded-lg bg-muted" />
          <div className="h-5 w-full max-w-xs animate-pulse rounded bg-muted" />
        </div>

        {/* Skeleton form */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((index) => (
            <div
              key={index}
              className="rounded-2xl border p-5 sm:p-6 h-full flex flex-col"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground animate-pulse" />
              <div className="mt-3 flex flex-col gap-3">
                <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
                <div className="h-5 w-full animate-pulse rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  if (errorMessage) {
    return (
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed py-16 text-center">
          <span className="flex size-11 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
            <AlertCircle className="size-5" />
          </span>
          <h2 className="font-semibold">Unable to load profile</h2>
          <p className="max-w-sm text-sm text-muted-foreground">
            {errorMessage}
          </p>
          <Button variant="outline" nativeButton={false} render={<Link href="/dashboard/customer" />}>
            Back to Dashboard
          </Button>
        </div>
      </section>
    )
  }

  if (!user) {
    return (
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed py-16 text-center">
          <span className="flex size-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
            <Scissors className="size-5" />
          </span>
          <h2 className="font-semibold">Profile not found</h2>
          <p className="max-w-sm text-sm text-muted-foreground">
            We couldn&apos;t find your profile information.
          </p>
          <Button variant="outline" nativeButton={false} render={<Link href="/dashboard/customer" />}>
            Back to Dashboard
          </Button>
        </div>
      </section>
    )
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          My Profile
        </h1>
        <p className="text-base text-muted-foreground">
          Manage your personal information and profile settings.
        </p>
      </div>

      <ProfileForm user={user} userId={customerId ?? ""} onSaved={setUser} />
    </section>
  )
}

export default CustomerProfilePage
