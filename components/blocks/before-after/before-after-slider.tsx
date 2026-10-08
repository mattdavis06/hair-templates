import { CompareSlider } from "@/components/blocks/before-after/compare-slider"
import { SectionHeading } from "@/components/blocks/section-heading"
import type { SectionProps } from "@/components/blocks/types"
import { BrandImage } from "@/components/site/brand-image"
import { Badge } from "@/components/ui/badge"
import { formatDuration } from "@/lib/format"
import { cn } from "@/lib/utils"

const SIZES = "(min-width: 1152px) 540px, (min-width: 768px) 50vw, 100vw"

/** Drag-to-compare photos beside the story of each transformation. */
export function BeforeAfterSlider({ brand, id }: SectionProps) {
  const { transformations } = brand.content
  if (!transformations) return null

  return (
    <section
      id={id}
      className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-20"
    >
      <SectionHeading
        title={transformations.title}
        intro={transformations.intro}
      />
      <ul className="flex flex-col gap-16">
        {transformations.items.map((item, index) => (
          <li
            key={item.title}
            className="grid items-center gap-8 md:grid-cols-2 md:gap-16"
          >
            <div className={cn(index % 2 === 1 && "md:order-last")}>
              <CompareSlider
                label={`Compare before and after: ${item.title}`}
                before={<BrandImage image={item.before} sizes={SIZES} />}
                after={<BrandImage image={item.after} sizes={SIZES} />}
              />
            </div>
            <div className="flex flex-col items-start gap-5">
              <h3 className="text-4xl text-balance">{item.title}</h3>
              <p className="text-lg text-pretty text-muted-foreground">
                {item.description}
              </p>
              <dl className="grid w-full grid-cols-[auto_1fr] gap-x-6 gap-y-3 border-t pt-5 text-sm">
                {item.services.length > 0 ? (
                  <>
                    <dt className="text-muted-foreground">Services</dt>
                    <dd className="flex flex-wrap gap-2">
                      {item.services.map((service) => (
                        <Badge key={service} variant="secondary">
                          {service}
                        </Badge>
                      ))}
                    </dd>
                  </>
                ) : null}
                {item.stylist ? (
                  <>
                    <dt className="text-muted-foreground">Stylist</dt>
                    <dd className="font-medium">{item.stylist}</dd>
                  </>
                ) : null}
                {item.duration ? (
                  <>
                    <dt className="text-muted-foreground">In the chair</dt>
                    <dd className="font-medium">
                      {formatDuration(item.duration)}
                    </dd>
                  </>
                ) : null}
              </dl>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
