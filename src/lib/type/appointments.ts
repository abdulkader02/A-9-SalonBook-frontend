export interface CreateAppointmentPayload {
  serviceId: string
  appointmentDate: string // ISO date string
  timeSlot: string
  message?: string
}
