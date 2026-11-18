"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { AlertCircle, Calendar, Clock, Scissors } from "lucide-react"

import { useSession } from "@/lib/auth-client"
import { getMyAppointments } from "@/lib/api/appointments"
import type { Appointment } from "@/lib/type/appointments"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const statusVariant = {
  pending: "secondary",
  confirmed: "default",
  cancelled: "destructive",
} as const

const paymentVariant = {
  unpaid: "secondary",
  paid: "default",
} as const

const MyAppointmentsPage = () => {
  const { data: session, isPending: sessionLoading } = useSession()

  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    if (sessionLoading) return

    const customerId = session?.user?.id
    if (!customerId) {
      setLoading(false)
      return
    }

    const fetchAppointments = async () => {
      try {
        const data = await getMyAppointments(customerId)
        setAppointments(data)
      } catch {
        setErrorMessage("We couldn't load your appointments right now.")
      } finally {
        setLoading(false)
      }
    }

    fetchAppointments()
  }, [sessionLoading, session])

  if (sessionLoading || loading) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Skeleton header */}
        <div className="flex flex-col gap-3">
          <div className="h-8 w-1/3 animate-pulse rounded-lg bg-muted" />
          <div className="h-5 w-full max-w-xs animate-pulse rounded bg-muted" />
        </div>

        {/* Skeleton cards */}
        <div className="mt-8 grid grid-cols-1 gap-4">
          {[1, 2, 3].map((index) => (
            <div
              key={index}
              className="flex flex-col gap-3 sm:flex-row sm:items-center gap-4 rounded-2xl border p-4 sm:p-5"
            >
              <div className="flex-shrink-0 h-24 w-24 sm:h-32 sm:w-40 rounded-xl bg-muted animate-pulse" />
              <div className="flex flex-1 flex-col gap-3 sm:gap-5">
                <div className="h-5 w-1/2 animate-pulse rounded bg-muted" />
                <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
                <div className="flex items-center gap-3">
                  <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
                  <div className="h-4 w-1/4 animate-pulse rounded bg-muted" />
                </div>
                <div className="h-px w-full bg-muted/30" />
                <div className="flex justify-between items-center">
                  <div className="h-4 w-1/4 animate-pulse rounded bg-muted" />
                  <div className="h-5 w-1/3 animate-pulse rounded bg-muted" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  if (errorMessage) {
    return (
      <section className="mx-auto max-w-md px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed py-16 text-center">
          <span className="flex size-11 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
            <AlertCircle className="size-5" />
          </span>
          <h2 className="font-semibold">Unable to load appointments</h2>
          <p className="max-w-sm text-sm text-muted-foreground">
            {errorMessage}
          </p>
          <Button variant="outline" render={<Link href="/services" />}>
            Browse Services
          </Button>
        </div>
      </section>
    )
  }

  if (appointments.length === 0) {
    return (
      <section className="mx-auto max-w-md px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed py-16 text-center">
          <span className="flex size-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
            <Calendar className="size-5" />
          </span>
          <h2 className="font-semibold">You have no appointments yet.</h2>
          <p className="max-w-sm text-sm text-muted-foreground">
            Book your first salon service and track your appointments here.
          </p>
          <Button variant="outline" render={<Link href="/services" />}>
            Browse Services
          </Button>
        </div>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          My Appointments
        </h1>
        <p className="text-base text-muted-foreground">
          All your salon appointment requests in one place.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:gap-5">
        {appointments.map((appointment) => (
          <article
            key={appointment._id}
            className="flex flex-col gap-3 sm:flex-row sm:items-center gap-4 rounded-2xl border bg-card p-4 sm:p-5"
          >
            {/* Service Image */}
            <div className="relative flex-shrink-0 h-24 w-24 overflow-hidden rounded-xl sm:h-32 sm:w-40 bg-muted">
              {appointment.serviceImage ? (
                <Image
                  src={appointment.serviceImage}
                  alt={appointment.serviceName}
                  fill
                  sizes="(min-width: 640px) 80px, 100vw"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  <Scissors className="size-8" />
                </div>
              )}
            </div>

            {/* Service + Appointment Info */}
            <div className="flex flex-1 flex-col gap-3 sm:gap-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
                <div className="flex flex-col gap-1">
                  <h3 className="leading-tight font-semibold">
                    {appointment.serviceName}
                  </h3>
                  <Badge variant="secondary" className="shrink-0">
                    {appointment.serviceCategory}
                  </Badge>
                </div>
                <div className="flex flex-col gap-1.5 sm:items-end">
                  <Badge variant={statusVariant[appointment.status]}>
                    {appointment.status}
                  </Badge>
                  <Badge variant={paymentVariant[appointment.paymentStatus]}>
                    {appointment.paymentStatus}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Calendar className="size-4" />
                  {new Date(appointment.appointmentDate).toLocaleDateString()}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="size-4" />
                  {appointment.timeSlot}
                </span>
              </div>

              <div className="h-px w-full bg-muted/30" />

              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-sm font-semibold text-primary">
                  ${Number(appointment.servicePrice).toFixed(2)}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default MyAppointmentsPage
