import { redirect } from "next/navigation"

import { getSession } from "@/lib/core/server"

// Bare /dashboard entry point (old bookmarks, Navbar links, OAuth fallback):
// send each visitor to the dashboard that matches their session role.
const DashboardPage = async () => {
  const session = await getSession()

  if (!session) {
    redirect("/sign-in")
  }

  const role =
    (session.user as { role?: string } | undefined)?.role ?? "customer"

  redirect(role === "admin" ? "/dashboard/admin" : "/dashboard/customer")
}

export default DashboardPage
