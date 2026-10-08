import type { SectionWithOptions } from "@/components/blocks/types"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { formatDuration } from "@/lib/format"
import { pickCategories, servicePriceLabel } from "@/lib/services"

/** Price list grouped by category, two columns on wide screens. */
export function ServicesList({
  brand,
  section,
  id,
}: SectionWithOptions<"services">) {
  const { services, booking } = brand.content
  if (!services) return null
  const categories = pickCategories(services, section.categories)

  return (
    <section
      id={id}
      className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-20"
    >
      <div className="flex max-w-2xl flex-col gap-3">
        <h2 className="text-5xl">{services.title}</h2>
        <p className="text-lg text-pretty text-muted-foreground">
          {services.intro}
        </p>
      </div>

      <div className="grid gap-x-16 gap-y-12 md:grid-cols-2">
        {categories.map((category) => (
          <div key={category.name} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <h3 className="text-3xl">{category.name}</h3>
              {category.description ? (
                <p className="text-sm text-muted-foreground">
                  {category.description}
                </p>
              ) : null}
            </div>
            <ul className="flex flex-col divide-y border-y">
              {category.items.map((service) => (
                <li
                  key={service.name}
                  className="flex items-start justify-between gap-6 py-4"
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium">{service.name}</span>
                      {service.popular ? (
                        <Badge variant="secondary">Popular</Badge>
                      ) : null}
                    </div>
                    {service.description ? (
                      <p className="text-sm text-pretty text-muted-foreground">
                        {service.description}
                      </p>
                    ) : null}
                    <p className="text-xs text-muted-foreground">
                      {formatDuration(service.duration)}
                    </p>
                  </div>
                  <p className="font-heading text-2xl whitespace-nowrap tabular-nums">
                    {servicePriceLabel(service)}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {services.note ? (
          <p className="max-w-xl text-sm text-pretty text-muted-foreground">
            {services.note}
          </p>
        ) : null}
        <a
          href={booking.url}
          className={buttonVariants({ size: "lg", className: "self-start" })}
        >
          {booking.label}
        </a>
      </div>
    </section>
  )
}
