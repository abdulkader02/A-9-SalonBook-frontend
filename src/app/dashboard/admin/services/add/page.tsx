"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import { ServiceForm } from "@/components/admin/ServiceForm"
import { createService } from "@/lib/api/services-admin"
import type { Service } from "@/lib/type/services"

const AddServicePage = () => {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (payload: Partial<Service>) => {
    setIsSubmitting(true)
    try {
      await createService(
        payload as Omit<Service, "_id" | "createdAt" | "updatedAt">
      )
      toast.success("Service created successfully.")
      router.push("/dashboard/admin/services")
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create service."
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
          Add Service
        </h1>
        <p className="text-base text-muted-foreground">
          Fill in the details to add a new salon service.
        </p>
      </div>

      <div className="mt-8 max-w-2xl rounded-2xl border bg-card p-5 sm:p-6">
        <ServiceForm
          initialValues={{}}
          onSubmit={handleSubmit}
          submitLabel="Add Service"
          isSubmitting={isSubmitting}
        />
      </div>
    </section>
  )
}

export default AddServicePage