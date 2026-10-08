import { ArrowRightIcon } from "lucide-react"
import { SectionHeading } from "@/components/blocks/section-heading"
import type { SectionProps } from "@/components/blocks/types"
import { BrandImage } from "@/components/site/brand-image"
import { contentHref } from "@/lib/brands"

/** Photo cards that send visitors to the main areas of the site. */
export function HighlightsCards({ brand, id }: SectionProps) {
  const { highlights } = brand.content
  if (!highlights) return null

  return (
    <section
      id={id}
      className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-20"
    >
      <SectionHeading title={highlights.title} intro={highlights.intro} />
      <ul className="grid gap-8 md:grid-cols-3">
        {highlights.items.map((item) => (
          <li key={item.title}>
            <a
              href={contentHref(brand, item.link.href)}
              className="group flex h-full flex-col gap-5 rounded-lg outline-offset-4"
            >
              <div className="relative aspect-4/3 overflow-hidden rounded-lg bg-muted">
                <BrandImage
                  image={item.image}
                  sizes="(min-width: 1152px) 352px, (min-width: 768px) 33vw, 100vw"
                  className="transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
                />
              </div>
              <div className="flex flex-1 flex-col gap-2">
                <h3 className="text-3xl">{item.title}</h3>
                <p className="text-pretty text-muted-foreground">{item.body}</p>
              </div>
              <span className="flex items-center gap-1.5 font-medium text-highlight">
                {item.link.label}
                <ArrowRightIcon
                  aria-hidden
                  className="size-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
                />
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
