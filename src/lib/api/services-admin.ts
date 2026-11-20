"use server"

import type { Service } from "@/lib/type/services"
import { isService, isServiceList } from "@/lib/type/services"
import { ApiError, UNEXPECTED_RESPONSE_MESSAGE } from "@/lib/api"
import { authFetch, protectedMutation } from "@/lib/core/server"

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/+$/, "")

const unexpectedResponse = () => new ApiError(500, UNEXPECTED_RESPONSE_MESSAGE)

// Read the server's error message without throwing if the body is empty/invalid.
const readServerMessage = async (response: Response): Promise<string | null> => {
  try {
    const body: unknown = await response.json()

    if (body && typeof body === "object" && !Array.isArray(body)) {
      const { message } = body as { message?: unknown }
      if (typeof message === "string" && message.trim()) {
        return message.trim()
      }
    }
  } catch {
    // No usable message in the response body.
  }

  return null
}

// 401/403 are redirected by authFetch/protectedMutation; throw on other failures.
const assertOk = async (response: Response) => {
  if (response.ok) return

  const serverMessage = await readServerMessage(response)
  throw new ApiError(
    response.status,
    serverMessage ?? "Something went wrong. Please try again."
  )
}

const parseJson = async (response: Response): Promise<unknown> => {
  if (response.status === 204) return undefined

  try {
    return (await response.json()) as unknown
  } catch {
    throw new ApiError(response.status, UNEXPECTED_RESPONSE_MESSAGE)
  }
}

export const getAdminServices = async (): Promise<Service[]> => {
  const res = await authFetch(`${API_BASE_URL}/admin/services`)
  await assertOk(res)

  const data = await parseJson(res)
  if (!isServiceList(data)) throw unexpectedResponse()

  return data
}

export const createService = async (
  payload: Omit<Service, "_id" | "createdAt" | "updatedAt">
): Promise<Service> => {
  const res = await protectedMutation(`${API_BASE_URL}/services`, "POST", payload)
  await assertOk(res)

  const data = await parseJson(res)
  if (!isService(data)) throw unexpectedResponse()

  return data
}

export const updateService = async (
  id: string,
  payload: Partial<Omit<Service, "_id" | "createdAt" | "updatedAt">>
): Promise<Service> => {
  const res = await protectedMutation(
    `${API_BASE_URL}/services/${encodeURIComponent(id)}`,
    "PATCH",
    payload
  )
  await assertOk(res)

  const data = await parseJson(res)
  if (!isService(data)) throw unexpectedResponse()

  return data
}

export const deleteService = async (
  id: string
): Promise<{ message: string }> => {
  const res = await protectedMutation(
    `${API_BASE_URL}/services/${encodeURIComponent(id)}`,
    "DELETE"
  )
  await assertOk(res)

  const data = await parseJson(res)

  if (data && typeof data === "object" && !Array.isArray(data)) {
    const { message } = data as { message?: unknown }
    if (typeof message === "string") {
      return { message }
    }
  }

  return { message: "Service deleted successfully" }
}
