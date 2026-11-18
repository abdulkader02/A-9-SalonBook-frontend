const ServiceDetailsLoading = () => {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="mb-6 h-4 w-32 animate-pulse rounded bg-muted" />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-10">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <div className="aspect-[16/10] w-full animate-pulse rounded-2xl bg-muted" />
          <div className="flex flex-col gap-4">
            <div className="h-5 w-28 animate-pulse rounded bg-muted" />
            <div className="h-9 w-3/4 animate-pulse rounded bg-muted" />
            <div className="h-7 w-40 animate-pulse rounded bg-muted" />
            <div className="h-4 w-full animate-pulse rounded bg-muted" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
          </div>
        </div>

        <div className="h-96 animate-pulse rounded-2xl border bg-muted/50 lg:col-span-1" />
      </div>
    </section>
  )
}

export default ServiceDetailsLoading
