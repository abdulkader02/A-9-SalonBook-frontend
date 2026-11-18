// TODO: auth check - customer role only; users without the customer role
// (admins, unauthenticated, blocked) should be denied access to this whole
// route branch.
// The shared sidebar (src/components/sheard/DashboardSidebar.tsx) renders
// customer nav items for users with the customer role.

const CustomerLayout = ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>
}

export default CustomerLayout
