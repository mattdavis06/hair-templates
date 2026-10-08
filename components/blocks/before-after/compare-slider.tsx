"use client"

import { ChevronsLeftRightIcon } from "lucide-react"
import { useState, type CSSProperties, type ReactNode } from "react"

/**
 * Two stacked photos; a range input sets how much of "before" shows. The
 * input is invisible but covers the photo, so dragging, tapping and arrow
 * keys all work, and screen readers announce it as a slider.
 */
export function CompareSlider({
  before,
  after,
  label,
}: {
  before: ReactNode
  after: ReactNode
  label: string
}) {
  const [split, setSplit] = useState(50)

  return (
    <div
      className="relative aspect-4/5 overflow-hidden rounded-[calc(var(--radius)*2)] bg-muted select-none has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-ring/50"
      style={{ "--split": `${split}%` } as CSSProperties}
    >
      <div className="absolute inset-0">{after}</div>
      <div className="absolute inset-0 [clip-path:inset(0_calc(100%-var(--split))_0_0)]">
        {before}
      </div>

      <span className="absolute top-4 left-4 rounded-full bg-background/85 px-3 py-1 text-xs font-medium backdrop-blur-sm">
        Before
      </span>
      <span className="absolute top-4 right-4 rounded-full bg-background/85 px-3 py-1 text-xs font-medium backdrop-blur-sm">
        After
      </span>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-(--split) w-0.5 -translate-x-1/2 bg-background shadow-[0_0_0_1px_rgb(0_0_0/0.08)]"
      >
        <span className="absolute top-1/2 left-1/2 grid size-11 -translate-1/2 place-items-center rounded-full bg-background text-foreground shadow-md">
          <ChevronsLeftRightIcon className="size-5" />
        </span>
      </div>

      <input
        type="range"
        min={0}
        max={100}
        value={split}
        onChange={(event) => setSplit(Number(event.target.value))}
        aria-label={label}
        aria-valuetext={`${split}% before, ${100 - split}% after`}
        className="absolute inset-0 size-full cursor-ew-resize opacity-0"
      />
    </div>
  )
}
