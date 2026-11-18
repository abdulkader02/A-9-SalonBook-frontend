import DashboardSidebar from "@/components/sheard/DashboardSidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

// TODO: auth check - verify the user is authenticated (and not blocked) before
// rendering any dashboard route; redirect unauthenticated users to Sign In.
// The sidebar resolves its nav items from the session role.

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex flex-col min-h-svh">
        <DashboardSidebar />
        <main className="flex-1 md:pl-64 overflow-y-auto">
          <header className="flex h-14 w-full items-center justify-between border-b bg-background px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80">
            <SidebarTrigger aria-label="Toggle sidebar" />
          </header>
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
