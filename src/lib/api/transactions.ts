import { apiRequest, ApiError, UNEXPECTED_RESPONSE_MESSAGE } from "@/lib/api"
import { isTransactionList } from "@/lib/type/transactions"
import type { Transaction } from "@/lib/type/transactions"

/**
 * Admin payment history. Read-only: the client never mutates transactions -
 * payment status is written exclusively by the verified Stripe webhook.
 */
export const getAdminTransactions = async (): Promise<Transaction[]> => {
  let data: unknown

  try {
    // apiRequest applies the base URL and credentials: "include" for us.
    data = await apiRequest<unknown>("/admin/transactions", {
      cache: "no-store",
    })
  } catch (error) {
    // A 404 here means the endpoint is unavailable, not that a service is
    // missing (the shared helper's generic message is service-oriented).
    if (error instanceof ApiError && error.status === 404) {
      throw new ApiError(404, "Payment history is unavailable right now.")
    }
    throw error
  }

  if (!isTransactionList(data)) {
    throw new ApiError(500, UNEXPECTED_RESPONSE_MESSAGE)
  }

  return data
}
