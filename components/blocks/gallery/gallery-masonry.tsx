import { SectionHeading } from "@/components/blocks/section-heading"
import type { SectionProps } from "@/components/blocks/types"
import { BrandImage } from "@/components/site/brand-image"
import { cn } from "@/lib/utils"

/** Repeating shapes so the columns stagger, whatever the source photos' proportions. */
const SHAPES = ["aspect-4/5", "aspect-square", "aspect-3/4", "aspect-4/3"]

/** Staggered columns of photos with captions underneath. */
export function GalleryMasonry({ brand, id }: SectionProps) {
  const { gallery } = brand.content
  if (!gallery) return null

  return (
    <section
      id={id}
      className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-20"
    >
      <SectionHeading title={gallery.title} intro={gallery.intro} />
      <ul className="columns-1 gap-6 sm:columns-2 lg:columns-3">
        {gallery.images.map((image, index) => (
          <li key={image.src} className="mb-6 break-inside-avoid">
            <figure className="flex flex-col gap-3">
              <div
                className={cn(
                  "relative overflow-hidden rounded-lg bg-muted",
                  SHAPES[index % SHAPES.length]
                )}
              >
                <BrandImage
                  image={image}
                  sizes="(min-width: 1152px) 352px, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                />
              </div>
              {image.caption ? (
                <figcaption className="text-sm text-muted-foreground">
                  {image.caption}
                </figcaption>
              ) : null}
            </figure>
          </li>
        ))}
      </ul>
    </section>
  )
}
