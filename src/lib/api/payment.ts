const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

/**
 * Creates a Stripe Checkout session for a confirmed, unpaid appointment.
 * Returns the Stripe-hosted Checkout URL the browser must be redirected to.
 */
export const createCheckoutSession = async (
  appointmentId: string
): Promise<{ url: string }> => {
  const res = await fetch(`${API_BASE_URL}/create-checkout-session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ appointmentId }),
  })

  if (!res.ok) {
    // Prefer the backend's message (400/404); fall back to a friendly one.
    let message = "Failed to start the payment. Please try again."
    try {
      const data = await res.json()
      if (data?.message) message = data.message
    } catch {
      // Response was not JSON
    }
    throw new Error(message)
  }

  const data = (await res.json()) as { url?: string }

  if (!data?.url) {
    throw new Error("Stripe did not return a checkout URL. Please try again.")
  }

  return { url: data.url }
}
