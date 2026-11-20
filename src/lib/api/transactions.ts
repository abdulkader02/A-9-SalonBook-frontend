"use server"

import { authFetch } from "@/lib/core/server"
import {
  ApiError,
  SERVER_ERROR_MESSAGE,
  UNEXPECTED_RESPONSE_MESSAGE,
} from "@/lib/api"
import { isTransactionList } from "@/lib/type/transactions"
import type { Transaction } from "@/lib/type/transactions"

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

// Mirrors the shared apiRequest status mapping so non-401/403 failures keep the
// same user-facing messages as before. 401/403 are redirected by authFetch.
const messageForStatus = (status: number, serverMessage: string | null) => {
  if (status === 404) return "Payment history is unavailable right now."

  if (status === 400) {
    return serverMessage ?? "Please check the submitted details and try again."
  }

  if (status === 409) {
    return (
      serverMessage ??
      "This action conflicts with the current data. Please refresh and try again."
    )
  }

  if (status >= 500) return SERVER_ERROR_MESSAGE

  return serverMessage ?? "Something went wrong. Please try again."
}

/**
 * Admin payment history. Read-only: the client never mutates transactions -
 * payment status is written exclusively by the verified Stripe webhook.
 */
export const getAdminTransactions = async (): Promise<Transaction[]> => {
  const res = await authFetch(`${API_BASE_URL}/admin/transactions`)

  if (!res.ok) {
    const serverMessage = await readServerMessage(res)
    throw new ApiError(res.status, messageForStatus(res.status, serverMessage))
  }

  let data: unknown

  try {
    data = (await res.json()) as unknown
  } catch {
    throw new ApiError(res.status, UNEXPECTED_RESPONSE_MESSAGE)
  }

  if (!isTransactionList(data)) {
    throw new ApiError(500, UNEXPECTED_RESPONSE_MESSAGE)
  }

  return data
}
