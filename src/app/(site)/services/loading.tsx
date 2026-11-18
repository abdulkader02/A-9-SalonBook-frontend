const ServicesLoading = () => {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      {/* Header skeleton */}
      <div className="flex flex-col gap-3">
        <div className="h-9 w-56 animate-pulse rounded-lg bg-muted" />
        <div className="h-5 w-full max-w-xl animate-pulse rounded bg-muted" />
      </div>

      {/* Controls skeleton */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <div className="h-9 flex-1 animate-pulse rounded-lg bg-muted" />
        <div className="h-9 w-40 animate-pulse rounded-lg bg-muted" />
        <div className="h-9 w-40 animate-pulse rounded-lg bg-muted" />
      </div>

      {/* Cards skeleton */}
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="flex flex-col overflow-hidden rounded-2xl border"
          >
            <div className="aspect-[4/3] w-full animate-pulse bg-muted" />
            <div className="flex flex-col gap-3 p-5">
              <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
              <div className="h-4 w-full animate-pulse rounded bg-muted" />
              <div className="h-8 w-1/2 animate-pulse rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ServicesLoading;
