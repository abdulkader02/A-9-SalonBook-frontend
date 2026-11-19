"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import { getServiceById } from "@/lib/api/services"
import { updateService } from "@/lib/api/services-admin"
import { ServiceForm } from "@/components/admin/ServiceForm"
import { Button } from "@/components/ui/button"
import type { Service } from "@/lib/type/services"

const EditServiceClient = ({ serviceId }: { serviceId: string }) => {
  const router = useRouter()
  const [service, setService] = useState<Service | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchService = async () => {
      try {
        const data = await getServiceById(serviceId)
        setService(data)
      } catch {
        setService(null)
      } finally {
        setLoading(false)
      }
    }

    fetchService()
  }, [serviceId])

  if (loading) {
    return (
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3">
          <div className="h-8 w-1/3 animate-pulse rounded-lg bg-muted" />
          <div className="h-5 w-full max-w-xs animate-pulse rounded bg-muted" />
        </div>
        <div className="mt-8 max-w-2xl rounded-2xl border p-6">
          <div className="h-20 w-32 animate-pulse rounded-xl bg-muted" />
          <div className="mt-6 flex flex-col gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-10 w-full animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (!service) {
    return (
      <section className="mx-auto flex w-full max-w-7xl flex-col items-center gap-3 px-4 py-24 text-center sm:px-6 lg:px-8">
        <h1 className="text-xl font-semibold">Service not found</h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          The service you are trying to edit does not exist or may have been removed.
        </p>
        <Button variant="outline" nativeButton={false} render={<Link href="/dashboard/admin/services" />}>
          Back to services
        </Button>
      </section>
    )
  }

  const handleSubmit = async (payload: Partial<Service>) => {
    setIsSubmitting(true)
    try {
      await updateService(serviceId, payload)
      toast.success("Service updated successfully.")
      router.push("/dashboard/admin/services")
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update service."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <Link
        href="/dashboard/admin/services"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to Services
      </Link>

      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Edit Service
        </h1>
        <p className="text-base text-muted-foreground">
          Update the service details below.
        </p>
      </div>

      <div className="mt-8 max-w-2xl rounded-2xl border bg-card p-5 sm:p-6">
        <ServiceForm
          initialValues={service}
          onSubmit={handleSubmit}
          submitLabel="Update Service"
          isSubmitting={isSubmitting}
        />
      </div>
    </section>
  )
}

export default EditServiceClient