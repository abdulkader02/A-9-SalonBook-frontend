"use client"

import { useEffect, useState } from "react"
import {
  AlertCircle,
  CalendarCheck,
  CheckCircle2,
  Clock,
  CreditCard,
  Scissors,
  Users,
} from "lucide-react"

import { getAdminStats } from "@/lib/api/stats"
import type { AdminStats } from "@/lib/type/stats"

const AdminOverviewPage = () => {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getAdminStats()
        setStats(data)
      } catch {
        setErrorMessage(
          "We couldn't load the dashboard statistics right now. Please refresh the page to try again."
        )
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Skeleton header */}
        <div className="flex flex-col gap-3">
          <div className="h-8 w-1/3 animate-pulse rounded-lg bg-muted" />
          <div className="h-5 w-full max-w-xs animate-pulse rounded bg-muted" />
        </div>

        {/* Skeleton stat cards */}
        <div className="mt-8 grid grid-cols-2 gap-6 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((index) => (
            <div key={index} className="h-full rounded-2xl border p-5 sm:p-6">
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

  if (errorMessage || !stats) {
    return (
      <section className="flex flex-1 flex-col items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex w-full max-w-xl flex-col items-center gap-3 rounded-2xl border border-dashed py-16 text-center">
          <span className="flex size-11 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
            <AlertCircle className="size-5" />
          </span>
          <h2 className="font-semibold">Unable to load statistics</h2>
          <p className="max-w-sm text-sm text-muted-foreground">
            {errorMessage ||
              "We couldn't load the dashboard statistics right now. Please refresh the page to try again."}
          </p>
        </div>
      </section>
    )
  }

  const statCards = [
    {
      label: "Total Customers",
      icon: Users,
      value: stats.totalCustomers,
    },
    {
      label: "Active Services",
      icon: Scissors,
      value: stats.totalActiveServices,
    },
    {
      label: "Total Appointments",
      icon: CalendarCheck,
      value: stats.totalAppointments,
    },
    {
      label: "Pending Appointments",
      icon: Clock,
      value: stats.pendingAppointments,
    },
    {
      label: "Confirmed Appointments",
      icon: CheckCircle2,
      value: stats.confirmedAppointments,
    },
    {
      label: "Successful Payments",
      icon: CreditCard,
      value: stats.successfulPayments,
    },
  ]

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Admin Dashboard Overview
        </h1>
        <p className="text-base text-muted-foreground">
          A quick snapshot of customers, services, appointments and payments.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-6 lg:grid-cols-3">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border bg-card p-5 sm:p-6 h-full flex flex-col justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                <stat.icon className="size-5" />
              </div>
              <div className="flex flex-col">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
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

export default AdminOverviewPage
