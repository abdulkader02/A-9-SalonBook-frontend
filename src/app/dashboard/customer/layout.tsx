import { requireRole } from "@/lib/core/server"

// The shared sidebar (src/components/sheard/DashboardSidebar.tsx) renders
// customer nav items for users with the customer role.
const CustomerLayout = async ({ children }: { children: React.ReactNode }) => {
  await requireRole("customer")
  return <div>{children}</div>
}

export default CustomerLayout
