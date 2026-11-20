"use server"

import { authFetch } from "@/lib/core/server"
import type { AdminStats } from "@/lib/type/stats"

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/+$/, "")

// Admin-only: dashboard counters. The Bearer token is attached by authFetch;
// 401/403 are redirected to /unauthorized there.
export const getAdminStats = async (): Promise<AdminStats> => {
  const res = await authFetch(`${API_BASE_URL}/admin/stats`)

  if (!res.ok) {
    let message = "Failed to fetch dashboard statistics. Please try again."
    try {
      const data: unknown = await res.json()
      if (data && typeof data === "object" && !Array.isArray(data)) {
        const { message: serverMessage } = data as { message?: unknown }
        if (typeof serverMessage === "string" && serverMessage.trim()) {
          message = serverMessage
        }
      }
    } catch {
      // Response was not JSON
    }
    throw new Error(message)
  }

  return (await res.json()) as AdminStats
}
