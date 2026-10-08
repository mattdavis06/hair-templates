"use client"

import { useMemo } from "react"
import { useCurrentMinute } from "@/components/blocks/opening-hours/use-current-minute"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import type { DayHours } from "@/content/schema"
import { getOpeningStatus } from "@/lib/opening-hours"
import { cn } from "@/lib/utils"

/** Depends on the visitor's clock, so it renders a placeholder until hydrated. */
export function OpenStatus({
  hours,
  className,
}: {
  hours: DayHours[]
  className?: string
}) {
  const now = useCurrentMinute()
  const status = useMemo(
    () => (now === null ? null : getOpeningStatus(hours, new Date(now))),
    [hours, now]
  )

  return (
    <div
      className={cn("flex min-h-5 items-center gap-2 text-sm", className)}
      aria-live="polite"
    >
      {status ? (
        <>
          <Badge variant={status.isOpen ? "default" : "outline"}>
            {status.label}
          </Badge>
          {status.detail ? (
            <span className="text-muted-foreground">{status.detail}</span>
          ) : null}
        </>
      ) : (
        <Skeleton className="h-5 w-40" />
      )}
    </div>
  )
}
