"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { AlertCircle, CheckCircle2, Loader2, Pencil, Plus, Search, Trash2 } from "lucide-react"

import { getAdminServices, updateService, deleteService } from "@/lib/api/services-admin"
import type { Service } from "@/lib/type/services"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const statusVariant = {
  active: "default",
  inactive: "secondary",
} as const

const sortItems: { label: string; value: string }[] = [
  { label: "Sort by price", value: "default" },
  { label: "Price: low to high", value: "asc" },
  { label: "Price: high to low", value: "desc" },
]

const ManageServicesPage = () => {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")
  const [search, setSearch] = useState("")
  const [sortByPrice, setSortByPrice] = useState<"default" | "asc" | "desc">("default")
  const [actionId, setActionId] = useState<string | null>(null)
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null)

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getAdminServices()
        setServices(data)
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Failed to load services."
        )
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [])

  const visibleServices = useMemo(() => {
    let result = services.filter((service) =>
      service.serviceName.toLowerCase().includes(search.toLowerCase().trim())
    )

    if (sortByPrice === "asc") {
      result = [...result].sort((a, b) => a.price - b.price)
    } else if (sortByPrice === "desc") {
      result = [...result].sort((a, b) => b.price - a.price)
    }

    return result
  }, [services, search, sortByPrice])

  const handleToggleStatus = async (service: Service) => {
    const newStatus = service.status === "active" ? "inactive" : "active"
    setActionId(service._id)
    try {
      const updated = await updateService(service._id, { status: newStatus })
      setServices((prev) =>
        prev.map((s) => (s._id === service._id ? { ...s, status: updated.status } : s))
      )
      toast.success(
        newStatus === "active" ? "Service activated." : "Service deactivated."
      )
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update service."
      )
    } finally {
      setActionId(null)
    }
  }

  const handleDelete = async () => {
    if (!serviceToDelete) return
    const id = serviceToDelete._id
    setActionId(id)
    try {
      await deleteService(id)
      setServices((prev) => prev.filter((s) => s._id !== id))
      toast.success("Service deleted.")
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete service."
      )
    } finally {
      setActionId(null)
      setServiceToDelete(null)
    }
  }

  if (loading) {
    return (
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading services...</p>
        </div>
      </section>
    )
  }

  if (errorMessage) {
    return (
      <section className="mx-auto flex w-full max-w-7xl flex-col items-center gap-3 px-4 py-24 text-center sm:px-6 lg:px-8">
        <h1 className="text-xl font-semibold">Unable to load services</h1>
        <p className="max-w-sm text-sm text-muted-foreground">{errorMessage}</p>
      </section>
    )
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Manage Services</h1>
          <p className="text-base text-muted-foreground">Add, edit and manage your salon services.</p>
        </div>
        <Button nativeButton={false} render={<Link href="/dashboard/admin/services/add" />}>
          <Plus className="size-4" />
          Add Service
        </Button>
      </div>

      {/* Search + sort controls */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search services by name..."
            className="h-10 w-full rounded-lg border border-input bg-transparent pl-8 pr-3 text-sm placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </div>
        <Select
          items={sortItems}
          value={sortByPrice}
          onValueChange={(value) =>
            setSortByPrice((value ?? "default") as "default" | "asc" | "desc")
          }
        >
          <SelectTrigger className="h-10" aria-label="Sort by price">
            <SelectValue placeholder="Sort by price" />
          </SelectTrigger>
          <SelectContent>
            {sortItems.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Desktop table (hidden on mobile) */}
      <div className="mt-8 hidden overflow-hidden rounded-2xl border md:block">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-muted/30 text-left text-muted-foreground">
              <th className="px-4 py-3 font-medium">Image</th>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Duration</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {visibleServices.map((service) => (
              <tr key={service._id} className="border-t">
                <td className="px-4 py-3">
                  <div className="flex size-12 items-center justify-center overflow-hidden rounded-lg bg-muted">
                    {service.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={service.image}
                        alt={service.serviceName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-muted-foreground">No image</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 font-medium">{service.serviceName}</td>
                <td className="px-4 py-3 text-muted-foreground">{service.category}</td>
                <td className="px-4 py-3">${Number(service.price).toFixed(2)}</td>
                <td className="px-4 py-3 text-muted-foreground">{service.duration} min</td>
                <td className="px-4 py-3">
                  <Badge variant={statusVariant[service.status]}>{service.status}</Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      nativeButton={false}
                      render={<Link href={`/dashboard/admin/services/edit/${service._id}`} />}
                      className="w-28"
                    >
                      <Pencil className="size-3.5" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant={service.status === "active" ? "outline" : "default"}
                      disabled={actionId === service._id}
                      onClick={() => handleToggleStatus(service)}
                      className="w-28"
                    >
                      <CheckCircle2 className="size-3.5" />
                      {service.status === "active" ? "Deactivate" : "Activate"}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      disabled={actionId === service._id}
                      onClick={() => setServiceToDelete(service)}
                      className="w-28"
                    >
                      <Trash2 className="size-3.5" />
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {visibleServices.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
                  No services found. Add your first service to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile stacked cards (shown only on mobile) */}
      <div className="mt-8 flex flex-col gap-4 md:hidden">
        {visibleServices.map((service) => (
          <div key={service._id} className="flex flex-col gap-3 rounded-2xl border p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted">
                {service.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={service.image}
                    alt={service.serviceName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-xs text-muted-foreground">No image</span>
                )}
              </div>
              <div className="flex flex-1 flex-col gap-1">
                <h3 className="font-semibold leading-tight">{service.serviceName}</h3>
                <span className="text-xs text-muted-foreground">{service.category}</span>
              </div>
              <Badge variant={statusVariant[service.status]} className="shrink-0">
                {service.status}
              </Badge>
            </div>

            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-medium text-primary">
                ${Number(service.price).toFixed(2)}
              </span>
              <span className="text-sm text-muted-foreground">{service.duration} min</span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                nativeButton={false}
                render={<Link href={`/dashboard/admin/services/edit/${service._id}`} />}
                className="flex-1 justify-center"
              >
                Edit
              </Button>
              <Button
                size="sm"
                variant={service.status === "active" ? "outline" : "default"}
                disabled={actionId === service._id}
                onClick={() => handleToggleStatus(service)}
                className="flex-1 justify-center"
              >
                {service.status === "active" ? "Deactivate" : "Activate"}
              </Button>
              <Button
                size="sm"
                variant="destructive"
                disabled={actionId === service._id}
                onClick={() => setServiceToDelete(service)}
                className="flex-1 justify-center"
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
        {visibleServices.length === 0 && (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed py-12 text-center">
            <AlertCircle className="size-6 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              No services found. Add your first service to get started.
            </p>
          </div>
        )}
      </div>

      <AlertDialog
        open={serviceToDelete !== null}
        onOpenChange={(open) => {
          if (!open) setServiceToDelete(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this service?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete &quot;{serviceToDelete?.serviceName}&quot;.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep service</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Yes, delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  )
}

export default ManageServicesPage