"use client"

import { useSyncExternalStore } from "react"

const MINUTE = 60_000

function subscribe(onChange: () => void) {
  const id = setInterval(onChange, MINUTE / 2)
  return () => clearInterval(id)
}

const currentMinute = () => Math.floor(Date.now() / MINUTE) * MINUTE
const noMinuteOnServer = () => null

/**
 * The visitor's clock as a timestamp rounded down to the minute. `null` during
 * prerender and hydration, so callers render a placeholder instead of a
 * mismatched time.
 */
export function useCurrentMinute(): number | null {
  return useSyncExternalStore(subscribe, currentMinute, noMinuteOnServer)
}
