import type { DayHours } from "@/content/schema"
import { formatDayHours } from "@/lib/opening-hours"
import { cn } from "@/lib/utils"

export function HoursList({
  hours,
  className,
}: {
  hours: DayHours[]
  className?: string
}) {
  return (
    <dl className={cn("flex flex-col gap-2 text-sm", className)}>
      {hours.map((day) => (
        <div key={day.day} className="flex justify-between gap-4">
          <dt className="text-muted-foreground">{day.day}</dt>
          <dd className="tabular-nums">{formatDayHours(day)}</dd>
        </div>
      ))}
    </dl>
  )
}
