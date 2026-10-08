import type { SectionProps } from "@/components/blocks/types"
import { BrandImage } from "@/components/site/brand-image"
import { cn } from "@/lib/utils"

/** Square photo grid; the first photo is featured at double size on wider screens. */
export function GalleryGrid({ brand, id }: SectionProps) {
  const { gallery } = brand.content
  if (!gallery) return null

  return (
    <section
      id={id}
      className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-20"
    >
      <div className="flex max-w-2xl flex-col gap-3">
        <h2 className="text-5xl">{gallery.title}</h2>
        <p className="text-lg text-pretty text-muted-foreground">
          {gallery.intro}
        </p>
      </div>

      <ul className="grid grid-flow-dense grid-cols-2 gap-3 md:grid-cols-4">
        {gallery.images.map((image, index) => {
          const featured = index === 0
          return (
            <li
              key={image.src}
              className={cn(featured && "col-span-2 md:row-span-2")}
            >
              <figure className="relative aspect-square overflow-hidden rounded-lg bg-muted">
                <BrandImage
                  image={image}
                  sizes={
                    featured
                      ? "(min-width: 768px) 576px, 100vw"
                      : "(min-width: 768px) 288px, 50vw"
                  }
                />
                {image.caption ? (
                  <figcaption className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 to-transparent px-3 pt-8 pb-3 text-sm text-white">
                    {image.caption}
                  </figcaption>
                ) : null}
              </figure>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
