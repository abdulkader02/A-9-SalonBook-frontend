import type { AdminCustomer, User } from "@/lib/type/users"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

export const getUserById = async (id: string): Promise<User> => {
  const res = await fetch(`${API_BASE_URL}/users/${id}`, {
    cache: "no-store",
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch user profile (${res.status})`)
  }

  const result = await res.json()

  return result.data
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
  const result = await res.json()

  // console.log("Updated Profile Response:", result)

  return result.data
}

export const getAdminUsers = async (): Promise<AdminCustomer[]> => {
  const res = await fetch(`${API_BASE_URL}/admin/users`, {
    cache: "no-store",
    credentials: "include",
  })

  if (!res.ok) {
    let message = "Failed to fetch customers. Please try again."
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

export const updateUserBlockStatus = async (
  userId: string,
  isBlocked: boolean
): Promise<{ message?: string }> => {
  const res = await fetch(`${API_BASE_URL}/users/${userId}/block`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ isBlocked }),
  })

  if (!res.ok) {
    let message = "Failed to update customer status. Please try again."
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
