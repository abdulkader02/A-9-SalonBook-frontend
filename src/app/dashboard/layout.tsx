import DashboardSidebar from "@/components/sheard/DashboardSidebar"

// TODO: auth check - verify the user is authenticated (and not blocked) before
// rendering any dashboard route; redirect unauthenticated users to Sign In.
// The sidebar resolves its nav items from the session role.

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-svh">
      <DashboardSidebar />
      {/* Offset for the fixed 16rem sidebar on md+; on mobile the sidebar is a
          drawer with its own in-flow top bar */}
      <main className="flex-1 md:pl-64 overflow-y-auto">{children}</main>
    </div>
  )
}

export default DashboardLayout
