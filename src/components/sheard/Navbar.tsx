"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import {
  Scissors,
  Menu,
  LayoutDashboard,
  LogOut,
  UserRound,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const publicLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Browse Services" },
  { href: "/#aboutus", label: "About Us" },
];

const Navbar = () => {
  const pathname = usePathname();

  // Better Auth session
  const { data: session, isPending } = useSession();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const user = session?.user;
  const role =
    (user as { role?: string } | undefined)?.role ?? "customer";

  const dashboardPath =
    role === "admin" ? "/dashboard/admin" : "/dashboard/customer";

  // Active navigation
  const isActive = (href: string) => {
    if (href === "/" || href === "/#aboutus") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const closeMenu = () => setMenuOpen(false);

  // Sign out handler
  const handleSignOut = async () => {
    if (isSigningOut) return;

    try {
      setIsSigningOut(true);

      const { error } = await signOut();

      if (error) {
        toast.error("Failed to sign out. Please try again.");
        console.error("Sign out error:", error);
        return;
      }

      closeMenu();
      setMobileOpen(false);

      toast.success("Signed out successfully.");

    } catch (error) {
      console.error("Unexpected sign out error:", error);
      toast.error("Something went wrong. Please try again.");

    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between gap-3 px-4 sm:h-16 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Scissors className="size-4" />
          </span>

          <span className="text-lg font-semibold tracking-tight">
            SalonBook
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {publicLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground",
                isActive(link.href)
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Authentication */}
        <div className="hidden items-center gap-2 md:flex">

          {isPending ? (
            <div className="size-8 animate-pulse rounded-full bg-muted" />

          ) : user ? (

            <Popover open={menuOpen} onOpenChange={setMenuOpen}>
              <PopoverTrigger
                render={
                  <button
                    className="flex items-center gap-2 rounded-full border bg-background py-1 pr-2.5 pl-1 transition-colors outline-none hover:bg-muted focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-expanded:bg-muted"
                    aria-label="Open profile menu"
                  >
                    <Avatar className="size-7">
                      {user.image && (
                        <AvatarImage
                          src={user.image}
                          alt={user.name}
                        />
                      )}

                      <AvatarFallback>
                        {user.name?.charAt(0).toUpperCase() ?? "U"}
                      </AvatarFallback>
                    </Avatar>

                    <span className="max-w-24 truncate text-sm font-medium sm:max-w-32">
                      {user.name}
                    </span>

                    <ChevronDown className="size-3.5 text-muted-foreground" />
                  </button>
                }
              />

              <PopoverContent align="end" className="w-64 gap-1.5 p-3">

                {/* User Information */}
                <div className="flex flex-col gap-0.5 px-1">
                  <p className="truncate text-sm font-semibold">
                    {user.name}
                  </p>

                  <p className="truncate text-xs text-muted-foreground">
                    {user.email}
                  </p>

                  <Badge
                    variant="secondary"
                    className="mt-1.5 w-fit tracking-wide uppercase"
                  >
                    {role}
                  </Badge>
                </div>

                <div className="-mx-1 my-1 h-px bg-border" />

                {/* Profile Menu */}
                <nav className="flex flex-col gap-0.5">

                  <Link
                    href={dashboardPath}
                    onClick={closeMenu}
                    className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring/50"
                  >
                    <LayoutDashboard className="size-4" />
                    Dashboard
                  </Link>

                  <Link
                    href="/profile"
                    onClick={closeMenu}
                    className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring/50"
                  >
                    <UserRound className="size-4" />
                    My Profile
                  </Link>

                  <button
                    type="button"
                    onClick={handleSignOut}
                    disabled={isSigningOut}
                    className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium text-destructive outline-none transition-colors hover:bg-destructive/10 focus-visible:ring-2 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <LogOut className="size-4" />
                    {isSigningOut ? "Signing out..." : "Sign Out"}
                  </button>

                </nav>
              </PopoverContent>
            </Popover>

          ) : (

            <>
              <Button variant="ghost" render={<Link href="/sign-in" />}>
                Sign In
              </Button>

              <Button render={<Link href="/sign-up" />}>
                Sign Up
              </Button>
            </>

          )}
        </div>

        {/* Mobile Navigation */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>

          <SheetTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Open navigation menu"
              >
                <Menu />
              </Button>
            }
          />

          <SheetContent side="right" className="w-72 max-w-[85vw]">

            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Scissors className="size-3.5" />
                </span>

                SalonBook
              </SheetTitle>
            </SheetHeader>

            {/* Mobile Public Links */}
            <nav className="flex flex-col gap-1 px-4">
              {publicLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted",
                    isActive(link.href)
                      ? "text-primary"
                      : "text-muted-foreground"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Mobile Authentication */}
            <div className="mt-auto flex flex-col gap-2 border-t p-4">

              {isPending ? (

                <div className="h-10 animate-pulse rounded-lg bg-muted" />

              ) : user ? (

                <>
                  {/* Mobile User Information */}
                  <div className="flex items-center gap-3 pb-3">
                    <Avatar className="size-9">
                      {user.image && (
                        <AvatarImage
                          src={user.image}
                          alt={user.name}
                        />
                      )}

                      <AvatarFallback>
                        {user.name?.charAt(0).toUpperCase() ?? "U"}
                      </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">
                        {user.name}
                      </p>

                      <p className="truncate text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    render={<Link href={dashboardPath} />}
                    onClick={() => setMobileOpen(false)}
                  >
                    <LayoutDashboard />
                    Dashboard
                  </Button>

                  <Button
                    variant="outline"
                    render={<Link href="/profile" />}
                    onClick={() => setMobileOpen(false)}
                  >
                    <UserRound />
                    My Profile
                  </Button>

                  <Button
                    variant="destructive"
                    onClick={handleSignOut}
                    disabled={isSigningOut}
                  >
                    <LogOut />
                    {isSigningOut ? "Signing out..." : "Sign Out"}
                  </Button>
                </>

              ) : (

                <>
                  <Button
                    variant="outline"
                    render={<Link href="/sign-in" />}
                    onClick={() => setMobileOpen(false)}
                  >
                    Sign In
                  </Button>

                  <Button
                    render={<Link href="/sign-up" />}
                    onClick={() => setMobileOpen(false)}
                  >
                    Sign Up
                  </Button>
                </>

              )}

            </div>
          </SheetContent>
        </Sheet>

      </div>
    </header>
  );
};

export default Navbar;