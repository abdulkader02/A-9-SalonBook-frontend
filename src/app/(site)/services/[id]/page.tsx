import { headers } from "next/headers"
import Link from "next/link"
import Image from "next/image"
import { redirect } from "next/navigation"
import { AlertCircle, ArrowLeft, Clock, Scissors } from "lucide-react"

import { auth } from "@/lib/auth"
import { getServiceById } from "@/lib/api/services"
import type { Service } from "@/lib/type/services"
import BookingCard from "@/components/services/BookingCard"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

// Auth-dependent and always fetched fresh.
export const dynamic = "force-dynamic"

const ServiceDetailsPage = async ({
  params,
}: {
  params: Promise<{ id: string }>
}) => {
  const { id } = await params

  // Protected page: unauthenticated users are redirected to Sign In.
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) {
    redirect("/sign-in")
  }

  let service: Service | null = null
  let notFound = false

  try {
    service = await getServiceById(id)
  } catch (error) {
    const message = error instanceof Error ? error.message : ""
    // The backend returns 400 for an invalid ID and 404 for a missing service.
    notFound = message.includes("(400)") || message.includes("(404)")
  }

  if (!service) {
    return (
      <section className="mx-auto flex w-full max-w-7xl flex-col items-center gap-3 px-4 py-24 text-center sm:px-6 lg:px-8">
        <span className="flex size-11 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
          <AlertCircle className="size-5" />
        </span>
        <h1 className="text-xl font-semibold">
          {notFound ? "Service not found" : "Something went wrong"}
        </h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          {notFound
            ? "The service you are looking for does not exist or may have been removed."
            : "We couldn't load this service right now. Please try again."}
        </p>
        <Button variant="outline" render={<Link href="/services" />}>
          Browse Services
        </Button>
      </section>
    )
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <Link
        href="/services"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to services
      </Link>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-10">
        {/* Service information */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border bg-muted">
            {service.image ? (
              <Image
                src={service.image}
                alt={service.serviceName}
                fill
                priority
                sizes="(min-width: 1024px) 66vw, 100vw"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                <Scissors className="size-10" />
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{service.category}</Badge>
              {service.status === "inactive" && (
                <Badge variant="outline">Currently unavailable</Badge>
              )}
            </div>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {service.serviceName}
            </h1>

            <div className="flex flex-wrap items-center gap-6">
              <p className="text-2xl font-bold text-primary">
                ${Number(service.price).toFixed(2)}
              </p>
              <p className="inline-flex items-center gap-1.5 text-muted-foreground">
                <Clock className="size-4" />
                {service.duration} min
              </p>
            </div>

            <div className="flex flex-col gap-2 border-t pt-4">
              <h2 className="font-semibold">About this service</h2>
              <p className="text-muted-foreground">{service.description}</p>
            </div>
          </div>
        </div>

        {/* Booking card */}
        <div className="lg:col-span-1">
          <BookingCard service={service} />
        </div>
      </div>
    </section>
  )
}

export default ServiceDetailsPage
