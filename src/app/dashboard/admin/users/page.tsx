"use client"

import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import { AlertCircle, Ban, Loader2, Search, Unlock, UserRound } from "lucide-react"

import { getAdminUsers, updateUserBlockStatus } from "@/lib/api/users"
import type { AdminCustomer } from "@/lib/type/users"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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

const formatDate = (value: string) => {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString()
}

const ManageUsersPage = () => {
  const [customers, setCustomers] = useState<AdminCustomer[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")
  const [search, setSearch] = useState("")
  const [customerToToggle, setCustomerToToggle] =
    useState<AdminCustomer | null>(null)
  const [blockingId, setBlockingId] = useState<string | null>(null)

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const data = await getAdminUsers()
        setCustomers(data)
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to load customers."
        setErrorMessage(message)
        toast.error(message)
      } finally {
        setLoading(false)
      }
    }

    fetchCustomers()
  }, [])

  const visibleCustomers = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return customers

    return customers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(query) ||
        customer.email.toLowerCase().includes(query)
    )
  }, [customers, search])

  const handleToggleBlock = async () => {
    if (!customerToToggle || blockingId) return

    const target = customerToToggle
    const nextBlocked = !target.isBlocked

    setBlockingId(target._id)
    try {
      await updateUserBlockStatus(target._id, nextBlocked)
      setCustomers((prev) =>
        prev.map((customer) =>
          customer._id === target._id
            ? { ...customer, isBlocked: nextBlocked }
            : customer
        )
      )
      toast.success(nextBlocked ? "User blocked." : "User unblocked.")
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update customer status."
      )
    } finally {
      setBlockingId(null)
      setCustomerToToggle(null)
    }
  }

  const isUnblockDialog = customerToToggle?.isBlocked === true

  if (loading) {
    return (
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading customers...</p>
        </div>
      </section>
    )
  }

  if (errorMessage) {
    return (
      <section className="mx-auto flex w-full max-w-7xl flex-col items-center gap-3 px-4 py-24 text-center sm:px-6 lg:px-8">
        <h1 className="text-xl font-semibold">Unable to load customers</h1>
        <p className="max-w-sm text-sm text-muted-foreground">{errorMessage}</p>
      </section>
    )
  }

  return (
    <section className="mx-auto w-full min-w-0 max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Manage Users
        </h1>
        <p className="text-base text-muted-foreground">
          View all customers and block or unblock their access.
        </p>
      </div>

      {customers.length === 0 ? (
        <div className="mt-8 flex flex-col items-center gap-3 rounded-2xl border border-dashed py-16 text-center">
          <AlertCircle className="size-6 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            There are no customers yet.
          </p>
        </div>
      ) : (
        <>
          {/* Search */}
          <div className="mt-8">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search customers by name or email..."
                aria-label="Search customers by name or email"
                className="h-10 w-full rounded-lg border border-input bg-transparent pl-8 pr-3 text-sm placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              />
            </div>
          </div>

          {/* Desktop table (hidden on mobile) */}
          <div className="mt-6 hidden w-full min-w-0 max-w-full overflow-x-auto rounded-2xl border md:block">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-muted/30 text-left text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Customer</th>
                  <th className="px-4 py-3 font-medium">Phone</th>
                  <th className="px-4 py-3 font-medium">Joined</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visibleCustomers.map((customer) => {
                  const isBusy = blockingId === customer._id
                  return (
                    <tr key={customer._id} className="border-t align-middle">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            {customer.image ? (
                              <AvatarImage
                                src={customer.image}
                                alt={customer.name}
                              />
                            ) : null}
                            <AvatarFallback>
                              <UserRound className="size-4" />
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-medium">{customer.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {customer.email}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                        {customer.phone?.trim() ? customer.phone : "-"}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                        {formatDate(customer.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={customer.isBlocked ? "destructive" : "default"}
                        >
                          {customer.isBlocked ? "Blocked" : "Active"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant={
                              customer.isBlocked ? "default" : "destructive"
                            }
                            disabled={isBusy}
                            onClick={() => setCustomerToToggle(customer)}
                            className="w-28"
                          >
                            {isBusy ? (
                              customer.isBlocked ? (
                                "Unblocking..."
                              ) : (
                                "Blocking..."
                              )
                            ) : (
                              <>
                                {customer.isBlocked ? (
                                  <Unlock className="size-3.5" />
                                ) : (
                                  <Ban className="size-3.5" />
                                )}
                                {customer.isBlocked ? "Unblock" : "Block"}
                              </>
                            )}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
                {visibleCustomers.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-12 text-center text-muted-foreground"
                    >
                      No customers match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile stacked cards (shown only on mobile) */}
          <div className="mt-6 flex flex-col gap-4 md:hidden">
            {visibleCustomers.map((customer) => {
              const isBusy = blockingId === customer._id
              return (
                <div
                  key={customer._id}
                  className="flex flex-col gap-3 rounded-2xl border p-4"
                >
                  <div className="flex items-center gap-3">
                    <Avatar size="lg">
                      {customer.image ? (
                        <AvatarImage
                          src={customer.image}
                          alt={customer.name}
                        />
                      ) : null}
                      <AvatarFallback>
                        <UserRound className="size-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <h3 className="truncate font-semibold leading-tight">
                        {customer.name}
                      </h3>
                      <span className="truncate text-xs text-muted-foreground">
                        {customer.email}
                      </span>
                    </div>
                    <Badge
                      variant={customer.isBlocked ? "destructive" : "default"}
                      className="shrink-0"
                    >
                      {customer.isBlocked ? "Blocked" : "Active"}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between gap-2 text-sm text-muted-foreground">
                    <span>
                      Phone: {customer.phone?.trim() ? customer.phone : "-"}
                    </span>
                    <span>Joined {formatDate(customer.createdAt)}</span>
                  </div>

                  <Button
                    size="sm"
                    variant={customer.isBlocked ? "default" : "destructive"}
                    disabled={isBusy}
                    onClick={() => setCustomerToToggle(customer)}
                    className="w-full justify-center"
                  >
                    {isBusy ? (
                      customer.isBlocked ? (
                        "Unblocking..."
                      ) : (
                        "Blocking..."
                      )
                    ) : (
                      <>
                        {customer.isBlocked ? (
                          <Unlock className="size-3.5" />
                        ) : (
                          <Ban className="size-3.5" />
                        )}
                        {customer.isBlocked ? "Unblock" : "Block"}
                      </>
                    )}
                  </Button>
                </div>
              )
            })}
            {visibleCustomers.length === 0 && (
              <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed py-12 text-center">
                <AlertCircle className="size-6 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  No customers match your search.
                </p>
              </div>
            )}
          </div>
        </>
      )}

      <AlertDialog
        open={customerToToggle !== null}
        onOpenChange={(open) => {
          if (!open) setCustomerToToggle(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isUnblockDialog ? "Unblock this user?" : "Block this user?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isUnblockDialog
                ? `${customerToToggle?.name ?? "This user"} will regain access to the platform.`
                : `${customerToToggle?.name ?? "This user"} won't be able to use the platform or any protected features until you unblock them.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleToggleBlock}>
              {isUnblockDialog ? "Yes, unblock" : "Yes, block"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  )
}

export default ManageUsersPage
