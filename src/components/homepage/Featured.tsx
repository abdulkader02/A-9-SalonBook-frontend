"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AlertCircle, ArrowRight, Clock, Scissors } from "lucide-react";

import { getFeaturedServices } from "@/lib/api/services";
import type { FeaturedService } from "@/lib/type/services";
import { ApiError } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const FEATURED_COUNT = 6;

// Single featured card with its own image-fallback state so a broken URL
// never renders a broken image icon.
const FeaturedServiceCard = ({ service }: { service: FeaturedService }) => {
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = Boolean(service.image) && !imageFailed;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border bg-card transition-colors hover:border-primary/40">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        {showImage ? (
          <Image
            src={service.image}
            alt={service.serviceName}
            fill
            unoptimized
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
            className="object-cover"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <Scissors className="size-8" />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="leading-snug font-semibold">{service.serviceName}</h3>
          <Badge variant="secondary" className="shrink-0">
            {service.category}
          </Badge>
        </div>

        <p className="line-clamp-2 text-sm text-muted-foreground">
          {service.shortDescription}
        </p>

        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <div className="flex flex-col gap-0.5">
            <span className="text-lg font-bold text-primary">
              ${Number(service.price).toFixed(2)}
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="size-3.5" />
              {service.duration} min
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            render={<Link href={`/services/${service._id}`} />}
          >
            View Details
            <ArrowRight />
          </Button>
        </div>
      </div>
    </article>
  );
};

const FeaturedServicesSkeleton = () => (
  <div className="mt-8 grid grid-cols-1 gap-5 sm:mt-10 sm:grid-cols-2 lg:grid-cols-3">
    {Array.from({ length: FEATURED_COUNT }).map((_, index) => (
      <div
        key={index}
        className="flex h-full flex-col overflow-hidden rounded-2xl border bg-card"
      >
        <div className="aspect-[4/3] w-full animate-pulse bg-muted" />
        <div className="flex flex-1 flex-col gap-3 p-5">
          <div className="flex items-start justify-between gap-2">
            <div className="h-5 w-2/3 animate-pulse rounded bg-muted" />
            <div className="h-5 w-16 animate-pulse rounded-full bg-muted" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-full animate-pulse rounded bg-muted" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
          </div>
          <div className="mt-auto flex items-end justify-between gap-2 pt-2">
            <div className="space-y-2">
              <div className="h-6 w-16 animate-pulse rounded bg-muted" />
              <div className="h-4 w-14 animate-pulse rounded bg-muted" />
            </div>
            <div className="h-8 w-28 animate-pulse rounded-md bg-muted" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

const Featured = () => {
  const [services, setServices] = useState<FeaturedService[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [reloadCount, setReloadCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const loadFeaturedServices = async () => {
      try {
        const data = await getFeaturedServices();
        if (cancelled) return;
        setServices(data);
        setErrorMessage("");
      } catch (error) {
        if (cancelled) return;
        // Show a friendly message only - never surface raw error details.
        setErrorMessage(
          error instanceof ApiError
            ? error.message
            : "We couldn't load featured services right now."
        );
      } finally {
        if (cancelled) return;
        setLoading(false);
      }
    };

    void loadFeaturedServices();

    return () => {
      cancelled = true;
    };
  }, [reloadCount]);

  const retry = () => {
    setLoading(true);
    setErrorMessage("");
    setReloadCount((count) => count + 1);
  };

  return (
    <section>
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="flex flex-col gap-3">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Featured Salon Services
          </h2>
          <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
            Handpicked treatments loved by our clients, ready to book in just a
            few clicks.
          </p>
        </div>

        {loading ? (
          <FeaturedServicesSkeleton />
        ) : errorMessage ? (
          <div className="mt-8 flex flex-col items-center gap-3 rounded-2xl border border-dashed py-16 text-center sm:mt-10">
            <span className="flex size-11 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
              <AlertCircle className="size-5" />
            </span>
            <p className="font-semibold">Unable to load featured services</p>
            <p className="max-w-sm text-sm text-muted-foreground">
              {errorMessage}
            </p>
            <Button variant="outline" onClick={retry}>
              Try again
            </Button>
          </div>
        ) : services.length === 0 ? (
          <div className="mt-8 flex flex-col items-center gap-3 rounded-2xl border border-dashed py-16 text-center sm:mt-10">
            <span className="flex size-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
              <Scissors className="size-5" />
            </span>
            <p className="font-semibold">No featured services yet.</p>
            <p className="max-w-sm text-sm text-muted-foreground">
              Check back soon for highlighted salon services.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-5 sm:mt-10 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <FeaturedServiceCard key={service._id} service={service} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Featured;
