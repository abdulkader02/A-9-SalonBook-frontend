import type { Service } from "@/lib/type/services"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

export const getAdminServices = async (): Promise<Service[]> => {
  const res = await fetch(`${API_BASE_URL}/admin/services`, {
    cache: "no-store",
    credentials: "include",
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch admin services (${res.status})`)
  }

  return res.json()
}

export const createService = async (
  payload: Omit<Service, "_id" | "createdAt" | "updatedAt">
): Promise<Service> => {
  const res = await fetch(`${API_BASE_URL}/services`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    let message = "Failed to create service. Please try again."
    try {
      const data = await res.json()
      if (data?.message) message = data.message
    } catch {
      // Response was not JSON
    }
    throw new Error(message)
  }

  return res.json()
}

export const updateService = async (
  id: string,
  payload: Partial<Omit<Service, "_id" | "createdAt" | "updatedAt">>
): Promise<Service> => {
  const res = await fetch(`${API_BASE_URL}/services/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    let message = "Failed to update service. Please try again."
    try {
      const data = await res.json()
      if (data?.message) message = data.message
    } catch {
      // Response was not JSON
    }
    throw new Error(message)
  }

  return res.json()
}

export const deleteService = async (id: string): Promise<{ message: string }> => {
  const res = await fetch(`${API_BASE_URL}/services/${id}`, {
    method: "DELETE",
    credentials: "include",
  })

  if (!res.ok) {
    let message = "Failed to delete service. Please try again."
    try {
      const data = await res.json()
      if (data?.message) message = data.message
    } catch {
      // Response was not JSON
    }
    throw new Error(message)
  }

  return res.json()
}