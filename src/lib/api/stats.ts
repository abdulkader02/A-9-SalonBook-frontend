import type { AdminStats } from "@/lib/type/stats"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

export const getAdminStats = async (): Promise<AdminStats> => {
  const res = await fetch(`${API_BASE_URL}/admin/stats`, {
    cache: "no-store",
    credentials: "include",
  })

  if (!res.ok) {
    let message = "Failed to fetch dashboard statistics. Please try again."
    try {
      const data = await res.json()
      if (data?.message) message = data.message
    } catch {
      // Response was not JSON
    }
    throw new Error(message)
  }

  return res.json()
}
