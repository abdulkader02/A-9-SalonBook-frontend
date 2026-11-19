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

// Shape returned by the admin endpoint GET /admin/appointments: it includes
// the customer's name/email instead of the service image/category.
export interface AdminAppointment {
  _id: string
  appointmentDate: string
  timeSlot: string
  message?: string
  servicePrice: number
  status: "pending" | "confirmed" | "cancelled"
  paymentStatus: "unpaid" | "paid"
  createdAt: string
  serviceName: string
  customerName: string
  customerEmail: string
}