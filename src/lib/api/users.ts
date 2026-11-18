import type { User } from "@/lib/type/users"

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

export const getUserById = async (id: string): Promise<User> => {
  const res = await fetch(`${API_BASE_URL}/users/${id}`, {
    cache: "no-store",
  })
  if (!res.ok) {
    throw new Error(`Failed to fetch user profile (${res.status})`)
  }
  return res.json()
}

export const updateUserProfile = async (
  id: string,
  payload: { name?: string; image?: string; phone?: string }
): Promise<User> => {
  const res = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    let message = "Failed to update profile. Please try again."
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
