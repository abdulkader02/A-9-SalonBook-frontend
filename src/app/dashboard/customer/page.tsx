"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { AlertCircle, Calendar, Clock, CheckCircle2, XCircle } from "lucide-react"

import { useSession } from "@/lib/auth-client"
import { getMyAppointments } from "@/lib/api/appointments"
import type { Appointment } from "@/lib/type/appointments"
import { Button } from "@/components/ui/button"

const CustomerOverviewPage = () => {
  const { data: session, isPending: sessionLoading } = useSession()

  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    if (sessionLoading) return

    if (!session?.user) {
      queueMicrotask(() => setLoading(false))
      return
    }

    const fetchAppointments = async () => {
      try {
        // Scoped server-side to the authenticated user (no customerId query).
        const data = await getMyAppointments()
        setAppointments(data)
      } catch {
        setErrorMessage("We couldn't load your appointments right now.")
      } finally {
        setLoading(false)
      }
    }

    fetchAppointments()
  }, [sessionLoading, session])

  // Counts computed directly from the fetched appointments array.
  const total = appointments.length
  const pending = appointments.filter(
    (appointment) => appointment.status === "pending"
  ).length
  const confirmed = appointments.filter(
    (appointment) => appointment.status === "confirmed"
  ).length
  const cancelled = appointments.filter(
    (appointment) => appointment.status === "cancelled"
  ).length

  if (sessionLoading || loading) {
    return (
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Skeleton header */}
        <div className="flex flex-col gap-3">
          <div className="h-8 w-1/3 animate-pulse rounded-lg bg-muted" />
          <div className="h-5 w-full max-w-xs animate-pulse rounded bg-muted" />
        </div>

        {/* Skeleton stat cards */}
        <div className="mt-8 grid grid-cols-2 gap-6 lg:grid-cols-4">
          {[1, 2, 3, 4].map((index) => (
            <div
              key={index}
              className="rounded-2xl border p-5 sm:p-6 h-full"
            >
              <div className="h-10 w-10 animate-pulse rounded-lg bg-muted" />
              <div className="mt-3 flex items-center gap-2">
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
      <section className="flex flex-1 flex-col items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex w-full max-w-xl flex-col items-center gap-3 rounded-2xl border border-dashed py-16 text-center">
          <span className="flex size-11 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
            <AlertCircle className="size-5" />
          </span>
          <h2 className="font-semibold">Unable to load appointments</h2>
          <p className="max-w-sm text-sm text-muted-foreground">
            {errorMessage}
          </p>
          <Button variant="outline" nativeButton={false} render={<Link href="/services" />}>
            Browse Services
          </Button>
        </div>
      </section>
    )
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Customer Dashboard Overview
        </h1>
        <p className="text-base text-muted-foreground">
          Track all your salon appointment requests in one place.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-6 lg:grid-cols-4">
        {[
          {
            label: "Total Appointment Requests",
            icon: Calendar,
            value: total,
          },
          {
            label: "Pending Appointments",
            icon: Clock,
            value: pending,
          },
          {
            label: "Confirmed Appointments",
            icon: CheckCircle2,
            value: confirmed,
          },
          {
            label: "Cancelled Appointments",
            icon: XCircle,
            value: cancelled,
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border bg-card p-5 sm:p-6 h-full flex flex-col justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                <stat.icon className="size-5" />
              </div>
              <div className="flex flex-col">
                <p className="text-sm text-muted-foreground">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold tracking-tight">
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default CustomerOverviewPage
