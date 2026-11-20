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
import StatCard from "@/components/dashboard/StatCard"

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
        <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-8 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:gap-6">
          {[1, 2, 3, 4, 5, 6].map((index) => (
            <div key={index} className="h-full rounded-2xl border p-3 sm:p-5 lg:p-6">
              <div className="size-8 animate-pulse rounded-lg bg-muted sm:size-10" />
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
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
          Admin Dashboard Overview
        </h1>
        <p className="text-sm text-muted-foreground sm:text-base">
          A quick snapshot of customers, services, appointments and payments.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-8 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:gap-6">
        {statCards.map((stat) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            icon={stat.icon}
          />
        ))}
      </div>
    </section>
  )
}

export default AdminOverviewPage
