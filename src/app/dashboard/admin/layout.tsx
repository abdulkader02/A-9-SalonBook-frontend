// TODO: auth check - admin role only; users without the admin role
// (customers, unauthenticated, blocked) should be denied access to this whole
// route branch.
// The shared sidebar (src/components/sheard/DashboardSidebar.tsx) renders
// admin nav items for users with the admin role.

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>
}

export default AdminLayout
