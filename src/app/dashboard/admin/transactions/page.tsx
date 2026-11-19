"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import { AlertCircle } from "lucide-react"

import { getAdminTransactions } from "@/lib/api/transactions"
import { ApiError } from "@/lib/api"
import type { Transaction } from "@/lib/type/transactions"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

// Same date formatting used by the other admin list pages.
const formatDate = (value: string) => {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleDateString()
}

const formatAmount = (transaction: Transaction) =>
  `${transaction.currency} ${transaction.amount.toFixed(2)}`

const shortStripeReference = (stripeSessionId: string) =>
  stripeSessionId ? `${stripeSessionId.slice(0, 12)}...` : "—"

const PaymentStatusBadge = ({ status }: { status: Transaction["status"] }) =>
  status === "paid" ? (
    <Badge
      variant="outline"
      className="border-green-200 bg-green-100 text-green-800 dark:border-green-800 dark:bg-green-900/30 dark:text-green-400"
    >
      paid
    </Badge>
  ) : (
    <Badge variant="destructive">failed</Badge>
  )

// Skeleton matches the real table/card layout so content does not jump.
const TransactionsSkeleton = () => (
  <div className="mt-8">
    <div className="hidden w-full min-w-0 max-w-full overflow-hidden rounded-2xl border md:block">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-muted/30 text-left text-muted-foreground">
            <th className="px-3 py-3 font-medium">Customer</th>
            <th className="px-3 py-3 font-medium">Service</th>
            <th className="px-3 py-3 font-medium">Appointment</th>
            <th className="px-3 py-3 font-medium">Amount</th>
            <th className="px-3 py-3 font-medium">Status</th>
            <th className="px-3 py-3 font-medium">Transaction date</th>
            <th className="px-3 py-3 font-medium">Stripe reference</th>
          </tr>
        </thead>
        <tbody>
          {[1, 2, 3, 4, 5].map((row) => (
            <tr key={row} className="border-t">
              <td className="px-3 py-3">
                <div className="flex flex-col gap-1.5">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-36" />
                </div>
              </td>
              <td className="px-3 py-3">
                <Skeleton className="h-4 w-24" />
              </td>
              <td className="px-3 py-3">
                <div className="flex flex-col gap-1.5">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-3 w-14" />
                </div>
              </td>
              <td className="px-3 py-3">
                <Skeleton className="h-4 w-20" />
              </td>
              <td className="px-3 py-3">
                <Skeleton className="h-5 w-16 rounded-4xl" />
              </td>
              <td className="px-3 py-3">
                <Skeleton className="h-4 w-20" />
              </td>
              <td className="px-3 py-3">
                <Skeleton className="h-4 w-24" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <div className="flex flex-col gap-4 md:hidden">
      {[1, 2, 3].map((card) => (
        <div key={card} className="flex flex-col gap-3 rounded-2xl border p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-36" />
            </div>
            <Skeleton className="h-5 w-16 shrink-0 rounded-4xl" />
          </div>
          <Skeleton className="h-4 w-24" />
          <div className="flex justify-between gap-3">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-3 w-28" />
        </div>
      ))}
    </div>
  </div>
)

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")
  const [reloadCount, setReloadCount] = useState(0)

  useEffect(() => {
    let cancelled = false

    const fetchTransactions = async () => {
      try {
        const data = await getAdminTransactions()
        if (cancelled) return
        setTransactions(data)
        setErrorMessage("")
      } catch (error) {
        if (cancelled) return
        const message =
          error instanceof ApiError
            ? error.message
            : "Unable to load transactions. Please try again."
        setTransactions([])
        setErrorMessage(message)
        toast.error(message)
      } finally {
        if (cancelled) return
        setLoading(false)
      }
    }

    void fetchTransactions()

    return () => {
      cancelled = true
    }
  }, [reloadCount])

  const retry = () => {
    setLoading(true)
    setErrorMessage("")
    setReloadCount((count) => count + 1)
  }

  if (loading) {
    return (
      <section className="mx-auto w-full min-w-0 max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="flex flex-col gap-1">
          <Skeleton className="h-9 w-56" />
          <Skeleton className="mt-1 h-5 w-72" />
        </div>
        <TransactionsSkeleton />
      </section>
    )
  }

  if (errorMessage) {
    return (
      <section className="mx-auto flex w-full max-w-7xl flex-col items-center gap-3 px-4 py-24 text-center sm:px-6 lg:px-8">
        <span className="flex size-11 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
          <AlertCircle className="size-5" />
        </span>
        <h1 className="text-xl font-semibold">Unable to load transactions</h1>
        <p className="max-w-sm text-sm text-muted-foreground">{errorMessage}</p>
        <Button variant="outline" onClick={retry}>
          Try again
        </Button>
      </section>
    )
  }

  return (
    <section className="mx-auto w-full min-w-0 max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Transactions
        </h1>
        <p className="text-base text-muted-foreground">
          View payment history. Payment records are read-only.
        </p>
      </div>

      {transactions.length === 0 ? (
        <div className="mt-8 flex flex-col items-center gap-3 rounded-2xl border border-dashed py-16 text-center">
          <AlertCircle className="size-6 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">No transactions yet.</p>
        </div>
      ) : (
        <>
          {/* Desktop / tablet table (hidden on mobile) */}
          <div className="mt-8 hidden w-full min-w-0 max-w-full overflow-x-auto rounded-2xl border md:block">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-muted/30 text-left text-muted-foreground">
                  <th className="px-3 py-3 font-medium">Customer</th>
                  <th className="px-3 py-3 font-medium">Service</th>
                  <th className="px-3 py-3 font-medium">Appointment</th>
                  <th className="px-3 py-3 font-medium">Amount</th>
                  <th className="px-3 py-3 font-medium">Status</th>
                  <th className="px-3 py-3 font-medium">Transaction date</th>
                  <th className="px-3 py-3 font-medium">Stripe reference</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction._id} className="border-t align-middle">
                    <td className="px-3 py-3">
                      <div className="flex min-w-0 flex-col">
                        <span className="font-medium">
                          {transaction.customerName}
                        </span>
                        <span className="truncate text-xs text-muted-foreground">
                          {transaction.customerEmail}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-3 font-medium">
                      {transaction.serviceName}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      <div className="flex flex-col">
                        <span>
                          {transaction.appointmentDate
                            ? formatDate(transaction.appointmentDate)
                            : "—"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {transaction.timeSlot ?? "—"}
                        </span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 font-medium">
                      {formatAmount(transaction)}
                    </td>
                    <td className="px-3 py-3">
                      <PaymentStatusBadge status={transaction.status} />
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-muted-foreground">
                      {formatDate(transaction.createdAt)}
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className="font-mono text-xs text-muted-foreground"
                        title={transaction.stripeSessionId}
                      >
                        {shortStripeReference(transaction.stripeSessionId)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile stacked cards (shown only on mobile) */}
          <div className="mt-8 flex flex-col gap-4 md:hidden">
            {transactions.map((transaction) => (
              <div
                key={transaction._id}
                className="flex min-w-0 flex-col gap-3 rounded-2xl border p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 flex-1 flex-col">
                    <h3 className="truncate font-semibold leading-tight">
                      {transaction.customerName}
                    </h3>
                    <span className="truncate text-xs text-muted-foreground">
                      {transaction.customerEmail}
                    </span>
                  </div>
                  <div className="shrink-0">
                    <PaymentStatusBadge status={transaction.status} />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium">
                    {transaction.serviceName}
                  </span>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                    <span>
                      Appointment:{" "}
                      {transaction.appointmentDate
                        ? formatDate(transaction.appointmentDate)
                        : "—"}
                    </span>
                    <span>{transaction.timeSlot ?? "—"}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium text-primary">
                    {formatAmount(transaction)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(transaction.createdAt)}
                  </span>
                </div>

                <span
                  className="truncate font-mono text-xs text-muted-foreground"
                  title={transaction.stripeSessionId}
                >
                  Stripe: {shortStripeReference(transaction.stripeSessionId)}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  )
}

export default TransactionsPage
