import { cn } from "@/lib/utils"

/** The brand's logo: its monogram in a primary-coloured tile beside the name. */
export function BrandMark({
  name,
  monogram,
  className,
}: {
  name: string
  monogram: string
  className?: string
}) {
  return (
    <span className={cn("flex items-center gap-3", className)}>
      <span
        aria-hidden
        className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary font-heading text-lg text-primary-foreground"
      >
        {monogram}
      </span>
      <span className="font-heading text-2xl leading-none">{name}</span>
    </span>
  )
}
