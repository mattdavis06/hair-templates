import Image from "next/image"
import type { ContentImage } from "@/content/schema"
import { cn } from "@/lib/utils"

/**
 * A content photo that fills its parent. The parent sets the shape (e.g.
 * `aspect-4/5`) and must be `relative`; `sizes` tells the browser how wide it
 * renders so it downloads the right file.
 */
export function BrandImage({
  image,
  sizes,
  preload,
  className,
}: {
  image: ContentImage
  sizes: string
  /** Only for the first large image on screen, e.g. a hero. */
  preload?: boolean
  className?: string
}) {
  return (
    <Image
      src={image.src}
      alt={image.alt}
      fill
      sizes={sizes}
      preload={preload}
      className={cn("object-cover", className)}
      style={image.position ? { objectPosition: image.position } : undefined}
    />
  )
}
