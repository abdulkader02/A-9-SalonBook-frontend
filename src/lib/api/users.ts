"use server"

import { authFetch, protectedMutation } from "@/lib/core/server"
import type { AdminCustomer, User } from "@/lib/type/users"

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/+$/, "")

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

const parseJson = async <T>(response: Response): Promise<T> => {
  if (response.status === 204) return undefined as T
  return (await response.json()) as T
}

// Profile GET: ownership enforced server-side via the Bearer token; :id builds the URL.
export const getUserById = async (id: string): Promise<User> => {
  const res = await authFetch(`${API_BASE_URL}/users/${encodeURIComponent(id)}`)

  // 401/403 are redirected by authFetch; preserve existing error pattern.
  if (!res.ok) {
    throw new Error(`Failed to fetch user profile (${res.status})`)
  }

  const result = await parseJson<{ data: User }>(res)
  return result.data
}

// Profile PATCH: ownership enforced server-side via the Bearer token; :id builds the URL.
export const updateUserProfile = async (
  id: string,
  payload: { name?: string; image?: string; phone?: string }
): Promise<User> => {
  const res = await protectedMutation(
    `${API_BASE_URL}/users/${encodeURIComponent(id)}`,
    "PATCH",
    payload
  )

  if (!res.ok) {
    const serverMessage = await readServerMessage(res)
    throw new Error(
      serverMessage ?? "Failed to update profile. Please try again."
    )
  }

  const result = await parseJson<{ data: User }>(res)
  return result.data
}

// Admin-only: list all customers.
export const getAdminUsers = async (): Promise<AdminCustomer[]> => {
  const res = await authFetch(`${API_BASE_URL}/admin/users`)

  if (!res.ok) {
    const serverMessage = await readServerMessage(res)
    throw new Error(
      serverMessage ?? "Failed to fetch customers. Please try again."
    )
  }

  return parseJson<AdminCustomer[]>(res)
}

// Admin-only: block/unblock a customer.
export const updateUserBlockStatus = async (
  userId: string,
  isBlocked: boolean
): Promise<{ message?: string }> => {
  const res = await protectedMutation(
    `${API_BASE_URL}/users/${encodeURIComponent(userId)}/block`,
    "PATCH",
    { isBlocked }
  )

  if (!res.ok) {
    const serverMessage = await readServerMessage(res)
    throw new Error(
      serverMessage ?? "Failed to update customer status. Please try again."
    )
  }

  return parseJson<{ message?: string }>(res)
}
