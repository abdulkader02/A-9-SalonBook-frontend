import Link from "next/link";
import { AlertCircle } from "lucide-react";

import { getServices } from "@/lib/api/services";
import type { Service } from "@/lib/type/services";
import { Button } from "@/components/ui/button";
import ServicesBrowser from "@/components/services/ServicesBrowser";

// Always render against fresh data from the backend.
export const dynamic = "force-dynamic";

interface ServicesPageProps {
  // Next.js 15+ passes searchParams as a Promise on Server Components.
  searchParams: Promise<{
    search?: string;
    category?: string;
    sort?: string;
  }>;
}

const ServicesPage = async ({ searchParams }: ServicesPageProps) => {
  const { search, category, sort } = await searchParams;

  let services: Service[] = [];
  let errorMessage = "";

  try {
    services = await getServices({ search, category, sort });
  } catch {
    errorMessage = "We couldn't load the services right now.";
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <header className="flex flex-col gap-3">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Browse Services
        </h1>
        <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
          Explore premium salon services and book your next appointment with
          ease.
        </p>
      </header>

      <div className="mt-8">
        {errorMessage ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed py-16 text-center">
            <span className="flex size-11 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
              <AlertCircle className="size-5" />
            </span>
            <p className="font-semibold">{errorMessage}</p>
            <p className="max-w-sm text-sm text-muted-foreground">
              Please check your connection and try again.
            </p>
            <Button variant="outline" render={<Link href="/services" />}>
              Try again
            </Button>
          </div>
        ) : (
          <ServicesBrowser services={services} />
        )}
      </div>
    </section>
  );
};

export default ServicesPage;