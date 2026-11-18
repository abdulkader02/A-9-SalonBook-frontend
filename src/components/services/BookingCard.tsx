"use client"

import { useState, type FormEvent } from "react"
import { Clock, Loader2 } from "lucide-react"
import { toast } from "sonner"

import type { Service } from "@/lib/type/services"
import { createAppointment } from "@/lib/api/appointments"
import { useSession } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Predefined time slots (simple fixed list, no real-time scheduling).
const TIME_SLOTS = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
  "06:00 PM",
]

const timeSlotItems = TIME_SLOTS.map((slot) => ({ label: slot, value: slot }))

// Local date as yyyy-mm-dd (used for the date input's min and past-date checks).
const getTodayString = () => {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, "0")
  const day = String(now.getDate()).padStart(2, "0")
  return `${now.getFullYear()}-${month}-${day}`
}

const BookingCard = ({ service }: { service: Service }) => {
  const { data: session, isPending } = useSession()
  // Same role lookup the Navbar / DashboardSidebar use.
  const role =
    (session?.user as { role?: string } | undefined)?.role ?? "customer"

  const [appointmentDate, setAppointmentDate] = useState("")
  const [timeSlot, setTimeSlot] = useState("")
  const [message, setMessage] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const today = getTodayString()
  const isAdmin = role === "admin"
  const isInactive = service.status === "inactive"

  const helperText = isAdmin
    ? "Admins cannot book appointments."
    : isInactive
      ? "This service is currently unavailable for booking."
      : null

  // Fields stay visible; they are locked only while the action is unavailable.
  const formLocked = isAdmin || isInactive || isPending || submitting

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    // Frontend guard only - the backend must enforce these rules too.
    if (isAdmin || isInactive) return

    if (!appointmentDate) {
      toast.error("Please select an appointment date.")
      return
    }
    if (appointmentDate < today) {
      toast.error("Appointment date cannot be in the past.")
      return
    }
    if (!timeSlot) {
      toast.error("Please select a time slot.")
      return
    }

    setSubmitting(true)
    try {
      await createAppointment({
        serviceId: service._id,
        appointmentDate: new Date(`${appointmentDate}T00:00:00`).toISOString(),
        timeSlot,
        ...(message.trim() ? { message: message.trim() } : {}),
      })

      toast.success("Appointment request submitted successfully!")
      // Reset the form only after confirmed success.
      setAppointmentDate("")
      setTimeSlot("")
      setMessage("")
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to submit appointment request. Please try again."
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <aside className="flex flex-col gap-5 rounded-2xl border bg-card p-5 sm:p-6 lg:sticky lg:top-20">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold">Book an Appointment</h2>
        <p className="text-sm text-muted-foreground">{service.serviceName}</p>
      </div>

      {/* Price summary */}
      <div className="flex items-center justify-between rounded-xl bg-accent px-4 py-3">
        <div className="flex flex-col gap-0.5">
          <p className="text-xs text-muted-foreground">Price</p>
          <p className="text-xl font-bold text-primary">
            ${Number(service.price).toFixed(2)}
          </p>
        </div>
        <div className="flex flex-col items-end gap-0.5">
          <p className="text-xs text-muted-foreground">Duration</p>
          <p className="inline-flex items-center gap-1 font-medium">
            <Clock className="size-4" />
            {service.duration} min
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="appointment-date">Appointment Date</Label>
          <Input
            id="appointment-date"
            type="date"
            min={today}
            value={appointmentDate}
            onChange={(event) => setAppointmentDate(event.target.value)}
            disabled={formLocked}
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Time Slot</Label>
          <Select
            items={timeSlotItems}
            value={timeSlot}
            onValueChange={(value) => setTimeSlot(value ?? "")}
            disabled={formLocked}
          >
            <SelectTrigger className="w-full" aria-label="Time slot">
              <SelectValue placeholder="Select a time slot" />
            </SelectTrigger>
            <SelectContent>
              {timeSlotItems.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="appointment-message">
            Message <span className="text-muted-foreground">(optional)</span>
          </Label>
          <Textarea
            id="appointment-message"
            rows={3}
            placeholder="Any notes for the salon..."
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            disabled={formLocked}
          />
        </div>

        {helperText && (
          <p className="text-sm text-muted-foreground">{helperText}</p>
        )}

        <Button
          type="submit"
          size="lg"
          disabled={formLocked}
          className="w-full"
        >
          {submitting ? (
            <>
              <Loader2 className="animate-spin" />
              Booking...
            </>
          ) : (
            "Book Now"
          )}
        </Button>
      </form>
    </aside>
  )
}

export default BookingCard
