"use client"

import { useMemo } from "react"
import { useCurrentMinute } from "@/components/blocks/opening-hours/use-current-minute"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import type { DayHours, WalkIns } from "@/content/schema"
import { formatDuration } from "@/lib/format"
import { getWalkInStatus } from "@/lib/opening-hours"

/** Depends on the visitor's clock, so it renders a placeholder until hydrated. */
export function WalkInWait({
  walkIns,
  hours,
}: {
  walkIns: WalkIns
  hours: DayHours[]
}) {
  const now = useCurrentMinute()
  const status = useMemo(
    () =>
      now === null ? null : getWalkInStatus(walkIns, hours, new Date(now)),
    [walkIns, hours, now]
  )

  if (!status) {
    return (
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-9 w-40" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-1" aria-live="polite">
      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {status.isOpen ? "Typical wait now" : "Walk-ins"}
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <p className="font-heading text-4xl leading-none">
          {status.isOpen
            ? status.wait === 0
              ? "No wait"
              : `~${formatDuration(status.wait)}`
            : status.label}
        </p>
        {status.isOpen && status.busy ? (
          <Badge variant="secondary">Busy time</Badge>
        ) : null}
      </div>
      <p className="text-sm text-muted-foreground">
        {status.isOpen ? `Open ${status.detail}` : status.detail}
      </p>
    </div>
  )
}
