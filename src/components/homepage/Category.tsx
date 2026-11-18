import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { serviceCategories } from "@/lib/categories";

const Category = () => {
  return (
    <section>
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        {/* Section header */}
        <div className="flex flex-col gap-3">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Explore Our Service Categories
          </h2>
          <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
            From haircuts to spa days, find the care you need and discover
            salons offering it near you.
          </p>
        </div>

        {/* Category cards */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:mt-10 sm:grid-cols-2 lg:grid-cols-4">
          {serviceCategories.map((category) => (
            <Link
              key={category.name}
              href={`/services?category=${encodeURIComponent(category.name)}`}
              className="group flex flex-col gap-3 rounded-2xl border bg-card p-5 transition-colors outline-none hover:border-primary/40 hover:bg-accent/50 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <span className="flex size-11 items-center justify-center rounded-xl bg-accent text-accent-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <category.icon className="size-5" />
              </span>
              <div className="flex flex-col gap-0.5">
                <p className="font-semibold">{category.name}</p>
                <p className="text-sm text-muted-foreground">
                  {category.description}
                </p>
              </div>
              <span className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-primary">
                Explore
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}

          {/* Balances the 7-item grid and links to the full browse page */}
          <Link
            href="/services"
            className="group flex flex-col gap-3 rounded-2xl border border-dashed bg-card p-5 transition-colors outline-none hover:border-primary/40 hover:bg-accent/50 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <span className="flex size-11 items-center justify-center rounded-xl border border-dashed text-accent-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <ArrowRight className="size-5" />
            </span>
            <div className="flex flex-col gap-0.5">
              <p className="font-semibold">View All Services</p>
              <p className="text-sm text-muted-foreground">
                Browse every salon service in one place.
              </p>
            </div>
            <span className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-primary">
              Browse All
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Category;
