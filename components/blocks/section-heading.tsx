import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

/** The title and intro that open most sections; `children` sits beside them on wide screens. */
export function SectionHeading({
  title,
  intro,
  children,
  className,
}: {
  title: string
  intro?: string
  children?: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-8 md:flex-row md:items-end md:justify-between",
        className
      )}
    >
      <div className="flex max-w-2xl flex-col gap-3">
        <h2 className="text-5xl text-balance">{title}</h2>
        {intro ? (
          <p className="text-lg text-pretty text-muted-foreground">{intro}</p>
        ) : null}
      </div>
      {children}
    </div>
  )
}
