"use client"

import { useMemo, useSyncExternalStore } from "react"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import type { DayHours } from "@/content/schema"
import { getOpeningStatus } from "@/lib/opening-hours"
import { cn } from "@/lib/utils"

const MINUTE = 60_000

function subscribe(onChange: () => void) {
  const id = setInterval(onChange, MINUTE / 2)
  return () => clearInterval(id)
}

const currentMinute = () => Math.floor(Date.now() / MINUTE)
const noMinuteOnServer = () => null

/** Depends on the visitor's clock, so it renders a placeholder until hydrated. */
export function OpenStatus({
  hours,
  className,
}: {
  hours: DayHours[]
  className?: string
}) {
  const minute = useSyncExternalStore(
    subscribe,
    currentMinute,
    noMinuteOnServer
  )
  const status = useMemo(
    () =>
      minute === null
        ? null
        : getOpeningStatus(hours, new Date(minute * MINUTE)),
    [hours, minute]
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
