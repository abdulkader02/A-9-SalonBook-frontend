import { requireRole } from "@/lib/core/server"

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  await requireRole("admin")
  return <div>{children}</div>
}

export default AdminLayout
