"use server"

import { protectedMutation } from "@/lib/core/server"

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

/**
 * Creates a Stripe Checkout session for a confirmed, unpaid appointment.
 * Returns the Stripe-hosted Checkout URL the browser must be redirected to.
 */
export const createCheckoutSession = async (
  appointmentId: string
): Promise<{ url: string }> => {
  const res = await protectedMutation(
    `${API_BASE_URL}/create-checkout-session`,
    "POST",
    { appointmentId }
  )

  // 401/403 are redirected by protectedMutation before this point.
  if (!res.ok) {
    // Prefer the backend's message (e.g. 400/404 business-rule errors).
    const serverMessage = await readServerMessage(res)
    throw new Error(
      serverMessage ?? "Failed to start the payment. Please try again."
    )
  }

  const data = (await res.json()) as { url?: string }

  if (!data?.url) {
    throw new Error("Stripe did not return a checkout URL. Please try again.")
  }

  return { url: data.url }
}
