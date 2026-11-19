// Read-only shape returned by GET /admin/transactions.
export interface Transaction {
  _id: string
  stripeSessionId: string
  amount: number
  currency: string
  status: "paid" | "failed"
  createdAt: string
  appointmentDate: string | null
  timeSlot: string | null
  customerName: string
  customerEmail: string
  serviceName: string
}

// Guards against unexpected payloads so the UI never crashes on bad data.
export const isTransaction = (value: unknown): value is Transaction => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false
  }

  const transaction = value as Record<string, unknown>

  return (
    typeof transaction._id === "string" &&
    typeof transaction.stripeSessionId === "string" &&
    typeof transaction.amount === "number" &&
    Number.isFinite(transaction.amount) &&
    typeof transaction.currency === "string" &&
    (transaction.status === "paid" || transaction.status === "failed") &&
    typeof transaction.createdAt === "string" &&
    (transaction.appointmentDate === null ||
      typeof transaction.appointmentDate === "string") &&
    (transaction.timeSlot === null || typeof transaction.timeSlot === "string") &&
    typeof transaction.customerName === "string" &&
    typeof transaction.customerEmail === "string" &&
    typeof transaction.serviceName === "string"
  )
}

export const isTransactionList = (value: unknown): value is Transaction[] =>
  Array.isArray(value) && value.every(isTransaction)
