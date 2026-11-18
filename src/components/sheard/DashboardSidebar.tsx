"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarCheck,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Menu,
  Scissors,
  Store,
  UserRound,
  Users,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";

import { useSession, signOut } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type DashboardNavRole = "customer" | "admin";

interface DashboardNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
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
  <nav className="flex flex-col gap-1">
    <p className="px-2 pb-1 text-xs font-medium tracking-wide text-muted-foreground uppercase">
      Menu
    </p>
    {items.map((item) => (
      <Link
        key={item.href}
        href={item.href}
        onClick={onNavigate}
        aria-current={isActive(pathname, item.href) ? "page" : undefined}
        className={cn(
          "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/50",
          isActive(pathname, item.href)
            ? "bg-sidebar-accent text-sidebar-accent-foreground"
            : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
        )}
      >
        <item.icon className="size-4 shrink-0" />
        {item.label}
      </Link>
    ))}
  </nav>
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
          <Separator />
          <Button
            variant="ghost"
            className="justify-start text-destructive hover:bg-destructive/10 hover:text-destructive"
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
  const [mobileOpen, setMobileOpen] = useState(false);

  // Role comes from the session; falls back to "customer" (same fallback the
  // Navbar uses) so no role is hardcoded.
  const { data: session } = useSession();
  const role =
    (session?.user as { role?: string } | undefined)?.role ?? "customer";
  const items = dashboardNav[role as DashboardNavRole] ?? dashboardNav.customer;

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col gap-6 border-r border-sidebar-border bg-sidebar p-4 md:flex">
        <SidebarBrand />
        <SidebarNav items={items} pathname={pathname} />
        <div className="mt-auto">
          <SidebarUser />
        </div>
      </aside>

      {/* Mobile top bar with drawer toggle */}
      <header className="sticky top-0 z-40 flex h-14 w-full items-center justify-between border-b bg-background px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:hidden">
        <SidebarBrand />
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                aria-label="Open dashboard menu"
              />
            }
          >
            <Menu />
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-72 max-w-[85vw] gap-0 p-4"
          >
            <SheetHeader className="p-0">
              <SheetTitle className="flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Scissors className="size-3.5" />
                </span>
                SalonBook
              </SheetTitle>
            </SheetHeader>
            <div className="flex flex-1 flex-col gap-6 overflow-y-auto py-4">
              <SidebarNav
                items={items}
                pathname={pathname}
                onNavigate={closeMobile}
              />
              <div className="mt-auto">
                <SidebarUser onNavigate={closeMobile} />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </header>
    </>
  );
};

export default DashboardSidebar;
