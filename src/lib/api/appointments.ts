"use server"

import { authFetch, protectedMutation } from "@/lib/core/server"
import type {
  AdminAppointment,
  Appointment,
  CreateAppointmentPayload,
} from "@/lib/type/appointments"

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

// 401/403 are redirected by authFetch/protectedMutation; throw on other failures.
const assertOk = async (response: Response, fallbackMessage: string) => {
  if (response.ok) return

  const serverMessage = await readServerMessage(response)
  throw new Error(serverMessage ?? fallbackMessage)
}

const parseJson = async <T>(response: Response): Promise<T> => {
  if (response.status === 204) return undefined as T
  return (await response.json()) as T
}

export const createAppointment = async (
  payload: CreateAppointmentPayload
): Promise<{ message?: string }> => {
  const res = await protectedMutation(
    `${API_BASE_URL}/appointments`,
    "POST",
    payload
  )
  await assertOk(res, "Failed to submit appointment request. Please try again.")

  return parseJson<{ message?: string }>(res)
}

// Customer scope is derived server-side from the Bearer token.
export const getMyAppointments = async (): Promise<Appointment[]> => {
  const res = await authFetch(`${API_BASE_URL}/appointments`)
  await assertOk(res, "Failed to fetch appointments. Please try again.")

  return parseJson<Appointment[]>(res)
}

export const cancelAppointment = async (
  appointmentId: string
): Promise<{ message?: string }> => {
  const res = await protectedMutation(
    `${API_BASE_URL}/appointments/${encodeURIComponent(appointmentId)}/cancel`,
    "PATCH"
  )
  await assertOk(res, "Failed to cancel appointment. Please try again.")

  return parseJson<{ message?: string }>(res)
}

export const getAdminAppointments = async (): Promise<AdminAppointment[]> => {
  const res = await authFetch(`${API_BASE_URL}/admin/appointments`)
  await assertOk(res, "Failed to fetch appointments. Please try again.")

  return parseJson<AdminAppointment[]>(res)
}

export const updateAppointmentStatus = async (
  appointmentId: string,
  status: "confirmed" | "cancelled"
): Promise<{ message?: string }> => {
  const res = await protectedMutation(
    `${API_BASE_URL}/appointments/${encodeURIComponent(appointmentId)}/status`,
    "PATCH",
    { status }
  )
  await assertOk(res, "Failed to update appointment. Please try again.")

  return parseJson<{ message?: string }>(res)
}
