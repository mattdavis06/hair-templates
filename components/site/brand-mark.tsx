import Image from "next/image"
import type { Site } from "@/content/schema"
import { cn } from "@/lib/utils"

/** The brand's logo, or its monogram and name. `logoClassName` sets the logo's height. */
export function BrandMark({
  name,
  monogram,
  logo,
  className,
  logoClassName = "h-11",
  preload,
}: {
  name: string
  monogram: string
  logo?: Site["logo"]
  className?: string
  logoClassName?: string
  /** Only when the logo is the first large thing on screen, e.g. a hero. */
  preload?: boolean
}) {
  if (logo) {
    return (
      <Image
        src={logo.src}
        width={logo.width}
        height={logo.height}
        alt={name}
        unoptimized
        preload={preload}
        className={cn("block w-auto", logoClassName, className)}
      />
    )
  }

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
