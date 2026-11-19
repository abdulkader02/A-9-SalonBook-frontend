import type {
  CreateAppointmentPayload,
  Appointment,
  AdminAppointment,
} from "@/lib/type/appointments"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const createAppointment = async (
  payload: CreateAppointmentPayload
): Promise<{ message?: string }> => {
  const res = await fetch(`${API_BASE_URL}/appointments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    // Prefer the backend's message; fall back to a friendly generic one.
    let message = "Failed to submit appointment request. Please try again."
    try {
      const data = await res.json()
      if (data?.message) message = data.message
    } catch {}
    throw new Error(message)
  }

  return res.json()
}

export const getMyAppointments = async (
  customerId: string
): Promise<Appointment[]> => {
  const res = await fetch(
    `${API_BASE_URL}/appointments?customerId=${customerId}`,
    {
      cache: "no-store",
    }
  )

  if (!res.ok) {
    throw new Error(`Failed to fetch appointments (${res.status})`)
  }

  return res.json()
}


export const cancelAppointment = async (
  appointmentId: string
): Promise<{ message?: string }> => {
  const res = await fetch(`${API_BASE_URL}/appointments/${appointmentId}/cancel`, {
    method: "PATCH",
  })

  if (!res.ok) {
    let message = "Failed to cancel appointment. Please try again."
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

export const getAdminAppointments = async (): Promise<AdminAppointment[]> => {
  const res = await fetch(`${API_BASE_URL}/admin/appointments`, {
    cache: "no-store",
    credentials: "include",
  })

  if (!res.ok) {
    let message = "Failed to fetch appointments. Please try again."
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

export const updateAppointmentStatus = async (
  appointmentId: string,
  status: "confirmed" | "cancelled"
): Promise<{ message?: string }> => {
  const res = await fetch(`${API_BASE_URL}/appointments/${appointmentId}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ status }),
  })

  if (!res.ok) {
    let message = "Failed to update appointment. Please try again."
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
