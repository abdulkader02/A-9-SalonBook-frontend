import type { LucideIcon } from "lucide-react"

interface StatCardProps {
  label: string
  value: number
  icon: LucideIcon
}

// Shared overview stat card used by the admin and customer dashboards.
// Sizes step up at sm (tablet) and lg (desktop) so two columns stay
// comfortable at 360px without changing the text or the numbers.
const StatCard = ({ label, value, icon: Icon }: StatCardProps) => (
  <div className="flex h-full flex-col rounded-2xl border bg-card p-3 sm:p-5 lg:p-6">
    <div className="flex items-center gap-2 sm:gap-3">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground sm:size-10 sm:rounded-xl">
        <Icon className="size-4 sm:size-5" />
      </div>
      <div className="flex min-w-0 flex-col">
        <p className="text-xs break-words text-muted-foreground sm:text-sm">
          {label}
        </p>
        <p className="text-xl font-bold tracking-tight whitespace-nowrap tabular-nums sm:text-2xl lg:text-3xl">
          {value}
        </p>
      </div>
    </div>
  </div>
)

export default StatCard
