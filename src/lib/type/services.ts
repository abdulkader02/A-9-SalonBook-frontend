export type ServiceStatus = "active" | "inactive"

export interface Service {
  _id: string
  serviceName: string
  category: string
  description: string
  price: number
  duration: number
  image: string
  status: ServiceStatus
  createdAt?: string
}

/**
 * Runtime guard for service payloads. Any response that does not match this
 * shape is treated as an error by the API layer instead of crashing the UI.
 */
export const isService = (value: unknown): value is Service => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false
  }

  const service = value as Record<string, unknown>

  return (
    typeof service._id === "string" &&
    typeof service.serviceName === "string" &&
    typeof service.category === "string" &&
    typeof service.description === "string" &&
    typeof service.price === "number" &&
    Number.isFinite(service.price) &&
    typeof service.duration === "number" &&
    Number.isFinite(service.duration) &&
    typeof service.image === "string" &&
    (service.status === "active" || service.status === "inactive")
  )
}

export const isServiceList = (value: unknown): value is Service[] =>
  Array.isArray(value) && value.every(isService)
