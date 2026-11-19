const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/+$/, "")

export const NETWORK_ERROR_MESSAGE =
  "Network error. Check your connection and try again."
export const SERVER_ERROR_MESSAGE =
  "Something went wrong on our side. Please try again."
export const UNEXPECTED_RESPONSE_MESSAGE =
  "We received an unexpected response. Please try again."

/**
 * Error thrown for every failed API request. `status` is 0 for network
 * failures (the request never reached the server).
 */
export class ApiError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = "ApiError"
    this.status = status
  }
}

// 400/409 responses carry actionable validation/conflict messages from the
// server, so those are surfaced. Everything else gets a safe, friendly text -
// raw server/stack details are never shown to the user.
const messageForStatus = (status: number, serverMessage: string | null) => {
  if (status === 401) return "Your session has expired. Please sign in again."
  if (status === 403) return "You do not have permission to do this."
  if (status === 404) return "Service not found."

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

// Reads `{ message }` from an error response without ever throwing.
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
    // Empty or non-JSON body - fall back to the generic message.
  }

  return null
}

/**
 * Single entry point for backend calls: resolves the base URL, sends cookies,
 * parses JSON safely and converts every failure into a typed `ApiError` with a
 * user-safe message.
 */
export const apiRequest = async <T>(
  path: string,
  options: RequestInit = {}
): Promise<T> => {
  let response: Response

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      credentials: "include",
    })
  } catch {
    throw new ApiError(0, NETWORK_ERROR_MESSAGE)
  }

  if (!response.ok) {
    const serverMessage = await readServerMessage(response)
    throw new ApiError(
      response.status,
      messageForStatus(response.status, serverMessage)
    )
  }

  // No content (e.g. 204) - nothing to parse.
  if (response.status === 204) {
    return undefined as unknown as T
  }

  try {
    return (await response.json()) as T
  } catch {
    throw new ApiError(response.status, UNEXPECTED_RESPONSE_MESSAGE)
  }
}
