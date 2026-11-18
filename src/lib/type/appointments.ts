export interface CreateAppointmentPayload {
  serviceId: string
  customerId: string
  appointmentDate: string // ISO date string
  timeSlot: string
  message?: string
}

export interface Appointment {
  _id: string
  appointmentDate: string
  timeSlot: string
  message?: string
  servicePrice: number
  status: "pending" | "confirmed" | "cancelled"
  paymentStatus: "unpaid" | "paid"
  createdAt: string
  serviceName: string
  serviceImage: string
  serviceCategory: string
}