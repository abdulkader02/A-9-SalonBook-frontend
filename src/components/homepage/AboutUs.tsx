import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CalendarCheck, Sparkles, Store } from "lucide-react";
import aboutImage from "@/assets/banner.png";

import { Button } from "@/components/ui/button";

const features = [
  {
    icon: CalendarCheck,
    title: "Easy Appointment Booking",
    description:
      "Request appointments online in a few clicks — pick a date, a time slot, and you're done.",
  },
  {
    icon: Store,
    title: "Discover Premium Salons",
    description:
      "Browse trusted salons and explore services from haircuts and coloring to spa and skincare.",
  },
  {
    icon: Sparkles,
    title: "Convenient Service Management",
    description:
      "Track every booking in one place, from pending requests to confirmed visits and payments.",
  },
];

const AboutUs = () => {
  return (
    <section id="aboutus" className="scroll-mt-20 sm:scroll-mt-24">
      <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:gap-14 lg:px-8 lg:py-24">
        {/* Imagery */}
        <div className="relative isolate">
          {/* Decorative accent card behind the image */}
          <div className="absolute -top-4 -right-4 -z-10 hidden h-full w-full rounded-3xl bg-accent lg:block" />
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border">
            <Image
              src={aboutImage}
              alt="Stylist attending to a client inside a premium salon"
              fill
              sizes="(min-width: 1024px) 44vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col items-start gap-4">
          <span className="inline-flex items-center gap-1.5 rounded-full border bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
            <Sparkles className="size-3.5" />
            About SalonBook
          </span>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Beauty Made Simple, Every Step of the Way
          </h2>
          <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
            SalonBook is your all-in-one salon appointment platform. Discover
            premium salons, explore the services they offer, and book your
            visit online — no calls, no waiting — while every request is
            managed seamlessly in one place.
          </p>

          {/* Key features */}
          <ul className="mt-2 flex flex-col gap-4">
            {features.map((feature) => (
              <li key={feature.title} className="flex items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <feature.icon className="size-5" />
                </span>
                <div className="flex flex-col gap-0.5">
                  <p className="font-semibold">{feature.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <Button size="lg" className="mt-2" render={<Link href="/services" />}>
            Explore More
            <ArrowRight />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
