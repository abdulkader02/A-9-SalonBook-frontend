"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  CalendarCheck,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Scissors,
  Store,
  UserRound,
  Users,
  type LucideIcon,
} from "lucide-react"
import { toast } from "sonner"

import { useSession, signOut } from "@/lib/auth-client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"

type DashboardNavRole = "customer" | "admin"

interface DashboardNavItem {
  href: string
  label: string
  icon: LucideIcon
}

// Navigation built from the roles defined in src/lib/auth.ts ("admin" |
// "customer") and the existing dashboard routes only.
const dashboardNav: Record<DashboardNavRole, DashboardNavItem[]> = {
  customer: [
    { href: "/dashboard/customer", label: "Overview", icon: LayoutDashboard },
    {
      href: "/dashboard/customer/appointments",
      label: "My Appointments",
      icon: CalendarCheck,
    },
    {
      href: "/dashboard/customer/profile",
      label: "My Profile",
      icon: UserRound,
    },
  ],
  admin: [
    { href: "/dashboard/admin", label: "Overview", icon: LayoutDashboard },
    {
      href: "/dashboard/admin/services",
      label: "Manage Services",
      icon: Store,
    },
    {
      href: "/dashboard/admin/appointments",
      label: "Manage Appointments",
      icon: CalendarCheck,
    },
    { href: "/dashboard/admin/users", label: "Manage Users", icon: Users },
    {
      href: "/dashboard/admin/transactions",
      label: "Transactions",
      icon: CreditCard,
    },
    { href: "/dashboard/admin/profile", label: "My Profile", icon: UserRound },
  ],
};

// Exact match or nested route (e.g. /dashboard/admin/services/add
// keeps "Manage Services" highlighted).
const isActive = (pathname: string, href: string) =>
  pathname === href || pathname.startsWith(`${href}/`);

const SidebarBrand = () => (
  <Link href="/" className="flex shrink-0 items-center gap-2 px-2">
    <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
      <Scissors className="size-4" />
    </span>
    <span className="text-lg font-semibold tracking-tight">SalonBook</span>
  </Link>
);

const SidebarNav = ({
  items,
  pathname,
  onNavigate,
}: {
  items: DashboardNavItem[];
  pathname: string;
  onNavigate?: () => void;
}) => (
  <SidebarGroup>
    <SidebarGroupLabel>Menu</SidebarGroupLabel>
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.href}>
          <SidebarMenuButton
            isActive={isActive(pathname, item.href)}
            tooltip={item.label}
            render={
              <Link
                href={item.href}
                onClick={onNavigate}
                className="flex items-center gap-2 w-full"
              >
                <item.icon className="size-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </Link>
            }
          />
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  </SidebarGroup>
);

const SidebarUser = ({
  onNavigate,
}: {
  onNavigate?: () => void;
}) => {
  const { data: session, isPending } = useSession();
  const user = session?.user;
  const role = (user as { role?: string } | undefined)?.role ?? "customer";

  const handleSignOut = async () => {
    await signOut();
    onNavigate?.();
    toast.success("Signed out successfully");
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Loading fallback while the session is unavailable */}
      {isPending ? (
        <div className="flex items-center gap-2.5 px-1">
          <div className="size-9 animate-pulse rounded-full bg-sidebar-accent" />
          <div className="flex flex-1 flex-col gap-1">
            <div className="h-3.5 w-20 animate-pulse rounded bg-sidebar-accent" />
            <div className="h-3 w-28 animate-pulse rounded bg-sidebar-accent" />
          </div>
        </div>
      ) : user ? (
        <>
          <div className="flex items-center gap-2.5 px-1">
            <Avatar className="size-9">
              {user.image ? (
                <AvatarImage src={user.image} alt={user.name} />
              ) : null}
              <AvatarFallback>
                {user.name?.charAt(0).toUpperCase() ?? "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex min-w-0 flex-col">
              <p className="truncate text-sm font-semibold">{user.name}</p>
              <p className="truncate text-xs text-muted-foreground">
                {user.email}
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="w-fit tracking-wide uppercase">
            {role}
          </Badge>
        </>
      ) : (
        // Safe fallback when signed out
        <Button
          variant="outline"
          render={<Link href="/sign-in" />}
          onClick={onNavigate}
        >
          Sign In
        </Button>
      )}

      {user && (
        <>
          <SidebarSeparator />
          <Button
            variant="ghost"
            className="justify-start w-full text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={handleSignOut}
          >
            <LogOut />
            Sign Out
          </Button>
        </>
      )}
    </div>
  );
};

const DashboardSidebar = () => {
  const pathname = usePathname();

  // Role comes from the session; falls back to "customer" (same fallback the
  // Navbar uses) so no role is hardcoded.
  const { data: session, isPending } = useSession();
  const role =
    (session?.user as { role?: string } | undefined)?.role ?? "customer";
  const items = dashboardNav[role as DashboardNavRole] ?? dashboardNav.customer;

  return (
    <Sidebar side="left" variant="sidebar" collapsible="icon">
      <SidebarHeader>
        <SidebarBrand />
      </SidebarHeader>
      <SidebarContent>
        {isPending ? (
          <div className="flex flex-col gap-1 p-2">
            <div className="h-3 w-10 rounded bg-sidebar-accent/60" />
            <div className="mt-1 flex flex-col gap-1.5">
              <div className="h-8 w-full animate-pulse rounded-lg bg-sidebar-accent" />
              <div className="h-8 w-full animate-pulse rounded-lg bg-sidebar-accent" />
              <div className="h-8 w-full animate-pulse rounded-lg bg-sidebar-accent" />
            </div>
          </div>
        ) : (
          <SidebarNav items={items} pathname={pathname} />
        )}
      </SidebarContent>
      <SidebarFooter>
        <SidebarUser />
      </SidebarFooter>
    </Sidebar>
  );
};

export default DashboardSidebar;
