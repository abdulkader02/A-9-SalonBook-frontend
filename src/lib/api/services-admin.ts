import type { Service } from "@/lib/type/services"
import { isService, isServiceList } from "@/lib/type/services"
import { ApiError, apiRequest, UNEXPECTED_RESPONSE_MESSAGE } from "@/lib/api"

const unexpectedResponse = () => new ApiError(500, UNEXPECTED_RESPONSE_MESSAGE)

export const getAdminServices = async (): Promise<Service[]> => {
  const data = await apiRequest<unknown>("/admin/services", {
    cache: "no-store",
  })

  if (!isServiceList(data)) throw unexpectedResponse()

  return data
}

export const createService = async (
  payload: Omit<Service, "_id" | "createdAt" | "updatedAt">
): Promise<Service> => {
  const data = await apiRequest<unknown>("/services", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })

  if (!isService(data)) throw unexpectedResponse()

  return data
}

export const updateService = async (
  id: string,
  payload: Partial<Omit<Service, "_id" | "createdAt" | "updatedAt">>
): Promise<Service> => {
  const data = await apiRequest<unknown>(
    `/services/${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  )

  if (!isService(data)) throw unexpectedResponse()

  return data
}

export const deleteService = async (id: string): Promise<{ message: string }> => {
  const data = await apiRequest<{ message?: unknown }>(
    `/services/${encodeURIComponent(id)}`,
    { method: "DELETE" }
  )

  return {
    message:
      typeof data?.message === "string"
        ? data.message
        : "Service deleted successfully",
  }
}
