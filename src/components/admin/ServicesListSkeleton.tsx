// Skeleton that mirrors the admin services page (header, controls, desktop
// table and mobile cards) so the layout does not jump while data loads.
const ServicesListSkeleton = () => {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <div className="h-8 w-52 animate-pulse rounded-lg bg-muted" />
          <div className="h-5 w-64 animate-pulse rounded bg-muted" />
        </div>
        <div className="h-9 w-36 animate-pulse rounded-lg bg-muted" />
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="h-10 flex-1 animate-pulse rounded-lg bg-muted" />
        <div className="h-10 w-40 animate-pulse rounded-lg bg-muted" />
      </div>

      {/* Desktop table skeleton */}
      <div className="mt-8 hidden overflow-hidden rounded-2xl border md:block">
        <div className="h-11 w-full bg-muted/30" />
        {[1, 2, 3, 4, 5].map((row) => (
          <div key={row} className="flex items-center gap-4 border-t px-4 py-3">
            <div className="size-12 shrink-0 animate-pulse rounded-lg bg-muted" />
            <div className="h-4 w-1/4 animate-pulse rounded bg-muted" />
            <div className="h-4 w-24 animate-pulse rounded bg-muted" />
            <div className="h-4 w-14 animate-pulse rounded bg-muted" />
            <div className="h-4 w-16 animate-pulse rounded bg-muted" />
            <div className="ml-auto h-6 w-20 animate-pulse rounded-full bg-muted" />
            <div className="h-8 w-32 animate-pulse rounded-lg bg-muted" />
          </div>
        ))}
      </div>

      {/* Mobile cards skeleton */}
      <div className="mt-8 flex flex-col gap-4 md:hidden">
        {[1, 2, 3].map((card) => (
          <div key={card} className="flex flex-col gap-3 rounded-2xl border p-4">
            <div className="flex items-center gap-3">
              <div className="size-14 shrink-0 animate-pulse rounded-lg bg-muted" />
              <div className="flex flex-1 flex-col gap-2">
                <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
                <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
              </div>
              <div className="h-6 w-16 animate-pulse rounded-full bg-muted" />
            </div>
            <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
            <div className="h-8 w-full animate-pulse rounded-lg bg-muted" />
          </div>
        ))}
      </div>
    </section>
  )
}

export default ServicesListSkeleton
