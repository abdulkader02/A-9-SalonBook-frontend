import type { Metadata } from "next"
import Link from "next/link"
import { XCircle } from "lucide-react"

import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Payment Cancelled | SalonBook",
}

const PaymentCancelPage = () => {
  return (
    <section className="flex flex-1 items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex w-full max-w-xl flex-col items-center gap-3 rounded-2xl border bg-card px-6 py-16 text-center">
        <span className="flex size-12 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
          <XCircle className="size-6" />
        </span>

        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Payment Cancelled
        </h1>

        <p className="max-w-sm text-sm text-muted-foreground">
          Your payment was cancelled and no charge was made. You can pay for
          this appointment any time from My Appointments.
        </p>

        <Button
          className="mt-2"
          nativeButton={false}
          render={<Link href="/dashboard/customer/appointments" />}
        >
          Back to My Appointments
        </Button>
      </div>
    </section>
  )
}

export default PaymentCancelPage
