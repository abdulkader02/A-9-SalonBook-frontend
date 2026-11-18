import DashboardSidebar from "@/components/sheard/DashboardSidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

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
      <DashboardSidebar />
      <SidebarInset className="flex min-w-0 flex-col overflow-x-hidden">
        <header className="flex h-14 shrink-0 items-center gap-2 border-b bg-background px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80">
          <SidebarTrigger size="icon" aria-label="Toggle sidebar" />
        </header>
        <div className="flex min-h-0 flex-1 flex-col">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
