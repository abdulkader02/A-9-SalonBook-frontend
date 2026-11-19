"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

import type { Service } from "@/lib/type/services";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ServicesCard from "./ServicesCard";

// "all" / "default" are UI sentinels only - they are never written to the URL.
const ALL_CATEGORIES = "all";
const DEFAULT_SORT = "default";

// Fixed list from the assignment spec, so the dropdown always shows every
// category - even ones with zero matching services for the current filter.
const CATEGORY_OPTIONS = [
  "Haircut & Styling",
  "Hair Coloring",
  "Hair Treatment",
  "Facial & Skincare",
  "Makeup",
  "Manicure & Pedicure",
  "Spa & Massage",
];

// `services` now arrives already filtered, searched and sorted by the
// Express/MongoDB API based on the current URL's search params.
const ServicesBrowser = ({ services }: { services: Service[] }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Read filters from the URL so refreshes and shared links keep them.
  const search = searchParams.get("search") ?? "";
  const category = searchParams.get("category") ?? ALL_CATEGORIES;
  const sort = searchParams.get("sort") ?? DEFAULT_SORT;

  const [searchInput, setSearchInput] = useState(search);

  // Keep the input in sync when the URL changes (back/forward, reset).
  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  const updateParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (!value || value === ALL_CATEGORIES || value === DEFAULT_SORT) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    }
    const query = params.toString();
    // replace() keeps filters shareable without flooding browser history,
    // and triggers a fresh server fetch with the new search params.
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  };

  // Debounce typing so the URL (and the server request) updates without
  // firing on every keystroke.
  useEffect(() => {
    if (searchInput === search) return;
    const timeout = setTimeout(() => {
      updateParams({ search: searchInput });
    }, 300);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput, search]);

  const clearFilters = () => {
    setSearchInput("");
    router.replace(pathname, { scroll: false });
  };

  const hasFilters =
    search !== "" || category !== ALL_CATEGORIES || sort !== DEFAULT_SORT;

  // Labels used by SelectValue to display the selected option.
  const categoryItems = [
    { label: "All Categories", value: ALL_CATEGORIES },
    ...CATEGORY_OPTIONS.map((item) => ({ label: item, value: item })),
  ];

  const sortItems = [
    { label: "Default order", value: DEFAULT_SORT },
    { label: "Price: Low to High", value: "price-asc" },
    { label: "Price: High to Low", value: "price-desc" },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Search + filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search services by name..."
            aria-label="Search services by name"
            className="h-9 pl-8"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <Select
            items={categoryItems}
            value={category}
            onValueChange={(value) =>
              updateParams({ category: value ?? ALL_CATEGORIES })
            }
          >
            <SelectTrigger className="h-9" aria-label="Filter by category">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              {categoryItems.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            items={sortItems}
            value={sort}
            onValueChange={(value) =>
              updateParams({ sort: value ?? DEFAULT_SORT })
            }
          >
            <SelectTrigger className="h-9" aria-label="Sort by price">
              <SelectValue placeholder="Sort by price" />
            </SelectTrigger>
            <SelectContent>
              {sortItems.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        {services.length} {services.length === 1 ? "service" : "services"}{" "}
        found
      </p>

      {/* Empty state */}
      {services.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed py-16 text-center">
          <span className="flex size-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
            <Search className="size-5" />
          </span>
          <p className="font-semibold">No services found</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            {hasFilters
              ? "No services match your search or filters. Try a different term or clear the filters."
              : "Check back soon - new salon services are added regularly."}
          </p>
          {hasFilters && (
            <Button variant="outline" onClick={clearFilters}>
              Clear filters
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServicesCard key={service._id} service={service} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ServicesBrowser;