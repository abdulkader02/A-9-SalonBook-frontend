"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  Loader2,
  XCircle,
} from "lucide-react"

import {
  getAdminAppointments,
  updateAppointmentStatus,
} from "@/lib/api/appointments"
import type { AdminAppointment } from "@/lib/type/appointments"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const statusVariant = {
  pending: "secondary",
  confirmed: "default",
  cancelled: "destructive",
} as const

const paymentVariant = {
  unpaid: "secondary",
  paid: "default",
} as const

type DialogState = {
  appointment: AdminAppointment
  action: "confirm" | "cancel"
}

const formatDate = (value: string) => {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString()
}

const ManageAppointmentsPage = () => {
  const [appointments, setAppointments] = useState<AdminAppointment[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")
  const [dialog, setDialog] = useState<DialogState | null>(null)
  const [pendingAction, setPendingAction] = useState<{
    id: string
    status: "confirmed" | "cancelled"
  } | null>(null)

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await getAdminAppointments()
        setAppointments(data)
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to load appointments."
        setErrorMessage(message)
        toast.error(message)
      } finally {
        setLoading(false)
      }
    }

    fetchAppointments()
  }, [])

  const handleConfirmAction = async () => {
    if (!dialog || pendingAction) return

    const { appointment, action } = dialog
    const nextStatus = action === "confirm" ? "confirmed" : "cancelled"

    setPendingAction({ id: appointment._id, status: nextStatus })
    try {
      await updateAppointmentStatus(appointment._id, nextStatus)
      setAppointments((prev) =>
        prev.map((item) =>
          item._id === appointment._id
            ? { ...item, status: nextStatus }
            : item
        )
      )
      toast.success(
        action === "confirm"
          ? "Appointment confirmed."
          : "Appointment cancelled."
      )
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update appointment."
      )
    } finally {
      setPendingAction(null)
      setDialog(null)
    }
  }

  const isConfirmDialog = dialog?.action === "confirm"
  const dialogCustomerName = dialog?.appointment.customerName ?? ""
  const dialogServiceName = dialog?.appointment.serviceName ?? ""

  if (loading) {
    return (
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Loading appointments...
          </p>
        </div>
      </section>
    )
  }

  if (errorMessage) {
    return (
      <section className="mx-auto flex w-full max-w-7xl flex-col items-center gap-3 px-4 py-24 text-center sm:px-6 lg:px-8">
        <h1 className="text-xl font-semibold">Unable to load appointments</h1>
        <p className="max-w-sm text-sm text-muted-foreground">{errorMessage}</p>
      </section>
    )
  }

  return (
    <section className="mx-auto w-full min-w-0 max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Manage Appointments
        </h1>
        <p className="text-base text-muted-foreground">
          Review, confirm and cancel customer appointment requests.
        </p>
      </div>

      {appointments.length === 0 ? (
        <div className="mt-8 flex flex-col items-center gap-3 rounded-2xl border border-dashed py-16 text-center">
          <AlertCircle className="size-6 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            There are no appointment requests yet.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop table (hidden on mobile) */}
          <div className="mt-8 hidden w-full min-w-0 max-w-full overflow-x-auto rounded-2xl border md:block">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-muted/30 text-left text-muted-foreground">
                  <th className="px-3 py-3 font-medium">Customer</th>
                  <th className="px-3 py-3 font-medium">Service</th>
                  <th className="px-3 py-3 font-medium">Date</th>
                  <th className="px-3 py-3 font-medium">Time</th>
                  <th className="px-3 py-3 font-medium">Message</th>
                  <th className="px-3 py-3 font-medium">Price</th>
                  <th className="px-3 py-3 font-medium">Status</th>
                  <th className="px-3 py-3 font-medium">Payment</th>
                  <th className="px-3 py-3 font-medium">Requested</th>
                  <th className="px-3 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment) => {
                  const isBusy = pendingAction?.id === appointment._id
                  return (
                    <tr key={appointment._id} className="border-t align-middle">
                      <td className="px-3 py-3">
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {appointment.customerName}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {appointment.customerEmail}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-3 font-medium">
                        {appointment.serviceName}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        {formatDate(appointment.appointmentDate)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 text-muted-foreground">
                        {appointment.timeSlot}
                      </td>
                      <td className="max-w-[16rem] px-3 py-3 text-muted-foreground">
                        {appointment.message ? (
                          <span className="line-clamp-2" title={appointment.message}>
                            {appointment.message}
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        ${Number(appointment.servicePrice).toFixed(2)}
                      </td>
                      <td className="px-3 py-3">
                        <Badge variant={statusVariant[appointment.status]}>
                          {appointment.status}
                        </Badge>
                      </td>
                      <td className="px-3 py-3">
                        <Badge
                          variant={paymentVariant[appointment.paymentStatus]}
                        >
                          {appointment.paymentStatus}
                        </Badge>
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 text-muted-foreground">
                        {formatDate(appointment.createdAt)}
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center justify-end gap-2">
                          {appointment.status === "pending" && (
                            <>
                              <Button
                                size="sm"
                                disabled={isBusy}
                                onClick={() =>
                                  setDialog({ appointment, action: "confirm" })
                                }
                                className="w-28"
                              >
                                {isBusy &&
                                pendingAction?.status === "confirmed" ? (
                                  "Confirming..."
                                ) : (
                                  <>
                                    <CheckCircle2 className="size-3.5" />
                                    Confirm
                                  </>
                                )}
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                disabled={isBusy}
                                onClick={() =>
                                  setDialog({ appointment, action: "cancel" })
                                }
                                className="w-28"
                              >
                                {isBusy &&
                                pendingAction?.status === "cancelled" ? (
                                  "Cancelling..."
                                ) : (
                                  <>
                                    <XCircle className="size-3.5" />
                                    Cancel
                                  </>
                                )}
                              </Button>
                            </>
                          )}
                          {appointment.status === "confirmed" && (
                            <Button
                              size="sm"
                              variant="destructive"
                              disabled={isBusy}
                              onClick={() =>
                                setDialog({ appointment, action: "cancel" })
                              }
                              className="w-28"
                            >
                              {isBusy ? (
                                "Cancelling..."
                              ) : (
                                <>
                                  <XCircle className="size-3.5" />
                                  Cancel
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile stacked cards (shown only on mobile) */}
          <div className="mt-8 flex flex-col gap-4 md:hidden">
            {appointments.map((appointment) => {
              const isBusy = pendingAction?.id === appointment._id
              return (
                <div
                  key={appointment._id}
                  className="flex flex-col gap-3 rounded-2xl border p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-col">
                      <h3 className="font-semibold leading-tight">
                        {appointment.customerName}
                      </h3>
                      <span className="text-xs text-muted-foreground">
                        {appointment.customerEmail}
                      </span>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <Badge variant={statusVariant[appointment.status]}>
                        {appointment.status}
                      </Badge>
                      <Badge
                        variant={paymentVariant[appointment.paymentStatus]}
                      >
                        {appointment.paymentStatus}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium">
                      {appointment.serviceName}
                    </span>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="size-4" />
                        {formatDate(appointment.appointmentDate)}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="size-4" />
                        {appointment.timeSlot}
                      </span>
                    </div>
                  </div>

                  {appointment.message && (
                    <p className="rounded-lg bg-muted/40 p-2 text-sm text-muted-foreground">
                      {appointment.message}
                    </p>
                  )}

                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium text-primary">
                      ${Number(appointment.servicePrice).toFixed(2)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Requested {formatDate(appointment.createdAt)}
                    </span>
                  </div>

                  {appointment.status !== "cancelled" && (
                    <div className="flex items-center gap-2">
                      {appointment.status === "pending" && (
                        <Button
                          size="sm"
                          disabled={isBusy}
                          onClick={() =>
                            setDialog({ appointment, action: "confirm" })
                          }
                          className="flex-1 justify-center"
                        >
                          {isBusy && pendingAction?.status === "confirmed" ? (
                            "Confirming..."
                          ) : (
                            <>
                              <CheckCircle2 className="size-3.5" />
                              Confirm
                            </>
                          )}
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={isBusy}
                        onClick={() =>
                          setDialog({ appointment, action: "cancel" })
                        }
                        className="flex-1 justify-center"
                      >
                        {isBusy && pendingAction?.status === "cancelled" ? (
                          "Cancelling..."
                        ) : (
                          <>
                            <XCircle className="size-3.5" />
                            Cancel
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </>
      )}

      <AlertDialog
        open={dialog !== null}
        onOpenChange={(open) => {
          if (!open) setDialog(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isConfirmDialog
                ? "Confirm this appointment?"
                : "Cancel this appointment?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isConfirmDialog
                ? `The appointment for ${dialogServiceName} requested by ${dialogCustomerName} will be confirmed. The customer will then be able to pay.`
                : `The appointment for ${dialogServiceName} requested by ${dialogCustomerName} will be cancelled. This action cannot be undone.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep as is</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmAction}>
              {isConfirmDialog ? "Yes, confirm" : "Yes, cancel"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  )
}

export default ManageAppointmentsPage
