import Link from "next/link"
import { Scissors, Phone, Mail, MapPin, Globe } from "lucide-react"

import { Separator } from "@/components/ui/separator"

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Browse Services" },
]

const socialLinks = [
  { label: "Facebook", href: "https://www.facebook.com/", icon: Globe },
  { label: "Instagram", href: "https://www.instagram.com/", icon: Globe },
  { label: "Twitter", href: "https://twitter.com/", icon: Globe },
]

const Footer = () => {
  return (
    <footer className="border-t bg-muted/40">
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Scissors className="size-4" />
              </span>
              <span className="text-lg font-semibold tracking-tight">
                SalonBook
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Your one-stop salon appointment booking platform. Explore
              services, request appointments and pay securely online.
            </p>
            <div className="flex flex-wrap items-center gap-2">
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <Link
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex items-center gap-1.5 rounded-full border bg-background px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <Icon className="size-3.5" />
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold">Quick Links</h3>
            <ul className="flex flex-col gap-2">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold">Contact Us</h3>
            <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <Phone className="mt-0.5 size-4 shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="mt-0.5 size-4 shrink-0" />
                <span>hello@salonbook.com</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0" />
                <span>123 Beauty Street, Downtown, Springfield</span>
              </li>
            </ul>
          </div>

          {/* Opening hours */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold">Opening Hours</h3>
            <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
              <li className="flex items-center justify-between gap-2">
                <span>Monday – Friday</span>
                <span>9:00 AM – 8:00 PM</span>
              </li>
              <li className="flex items-center justify-between gap-2">
                <span>Saturday</span>
                <span>10:00 AM – 6:00 PM</span>
              </li>
              <li className="flex items-center justify-between gap-2">
                <span>Sunday</span>
                <span>Closed</span>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />
        <p className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} SalonBook. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer
