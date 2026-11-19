import type { Metadata } from "next"
import Link from "next/link"
import { CheckCircle2 } from "lucide-react"

import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Payment Successful | SalonBook",
}

interface PaymentSuccessPageProps {
  searchParams: Promise<{ session_id?: string }>
}

const PaymentSuccessPage = async ({
  searchParams,
}: PaymentSuccessPageProps) => {
  // Informational only: the verified Stripe webhook is what marks the
  // appointment as paid, so nothing is sent to the backend from here.
  const { session_id: sessionId } = await searchParams

  return (
    <section className="flex flex-1 items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex w-full max-w-xl flex-col items-center gap-3 rounded-2xl border bg-card px-6 py-16 text-center">
        <span className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <CheckCircle2 className="size-6" />
        </span>

        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Payment Successful
        </h1>

        <p className="max-w-sm text-sm text-muted-foreground">
          Thank you! Your payment was received and your appointment is now
          marked as paid.
        </p>

        {sessionId ? (
          <p className="max-w-full font-mono text-[0.7rem] break-all text-muted-foreground/70">
            Payment reference: {sessionId}
          </p>
        ) : null}

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

export default PaymentSuccessPage
