import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import bannerImage from "@/assets/banner.png"

import { Button } from "@/components/ui/button";

const Banner = () => {
  return (
    <section className="relative isolate overflow-hidden">
      {/* Background image */}
      <Image
        src={bannerImage}
        alt="Banner"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative mx-auto flex w-full max-w-7xl flex-col items-start gap-4 px-4 py-20 sm:px-6 sm:py-28 md:py-32 lg:px-8">
        <span className="inline-flex items-center rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
          Beauty &amp; Wellness, On Your Schedule
        </span>
        <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
          Look Beautiful, <br className="hidden sm:block" />
          Feel Confident
        </h1>
        <p className="max-w-xl text-base text-white/90 sm:text-lg">
          SalonBook lets you explore premium salon services and request
          appointments online in just a few clicks — no calls, no waiting.
        </p>
        <Button size="lg" className="mt-2" render={<Link href="/services" />}>
          Explore Salon Services
          <ArrowRight />
        </Button>
      </div>
    </section>
  );
};

export default Banner;
