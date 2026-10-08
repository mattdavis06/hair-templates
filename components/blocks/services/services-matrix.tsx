import { SectionHeading } from "@/components/blocks/section-heading"
import type { SectionWithOptions } from "@/components/blocks/types"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import type { Service, ServiceLevel } from "@/content/schema"
import { formatDuration, formatPrice } from "@/lib/format"
import { pickCategories } from "@/lib/services"

/**
 * Price table with a column per stylist level, for salons that charge by
 * seniority. Services with one price span every column.
 */
export function ServicesMatrix({
  brand,
  section,
  id,
}: SectionWithOptions<"services">) {
  const { services, booking, team } = brand.content
  if (!services) return null
  const levels = services.levels ?? []
  const categories = pickCategories(services, section.categories)
  const columns = Math.max(levels.length, 1)

  return (
    <section
      id={id}
      className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-20"
    >
      <SectionHeading title={services.title} intro={services.intro} />

      {levels.length > 0 ? (
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {levels.map((level) => (
            <LevelCard
              key={level.id}
              level={level}
              members={
                team?.members
                  .filter((member) => member.level === level.id)
                  .map((member) => member.name.split(" ")[0]) ?? []
              }
            />
          ))}
        </dl>
      ) : null}

      <div className="flex flex-col gap-14">
        {categories.map((category) => (
          <div key={category.name} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <h3 className="text-3xl">{category.name}</h3>
              {category.description ? (
                <p className="max-w-2xl text-sm text-pretty text-muted-foreground">
                  {category.description}
                </p>
              ) : null}
            </div>
            <div className="-mx-6 overflow-x-auto px-6">
              <table className="w-full min-w-[20rem] border-y text-left text-sm md:text-base">
                <caption className="sr-only">
                  {category.name} prices
                  {levels.length > 0 ? " by stylist level" : ""}
                </caption>
                <thead>
                  <tr className="border-b text-xs text-muted-foreground md:text-sm">
                    <th scope="col" className="py-3 pr-4 font-medium">
                      Service
                    </th>
                    {levels.length > 0 ? (
                      levels.map((level) => (
                        <th
                          key={level.id}
                          scope="col"
                          className="w-[18%] py-3 pl-2 text-right align-bottom font-medium"
                        >
                          {level.name}
                        </th>
                      ))
                    ) : (
                      <th scope="col" className="py-3 text-right font-medium">
                        Price
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {category.items.map((service) => (
                    <tr key={service.name} className="align-top">
                      <th scope="row" className="py-4 pr-4 font-normal">
                        <ServiceDetails service={service} />
                      </th>
                      <PriceCells
                        service={service}
                        levels={levels}
                        columns={columns}
                      />
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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

const nameList = new Intl.ListFormat("en-GB")

function LevelCard({
  level,
  members,
}: {
  level: ServiceLevel
  members: string[]
}) {
  return (
    <div className="flex flex-col gap-1.5 rounded-lg border bg-card p-5">
      <dt className="font-heading text-2xl">{level.name}</dt>
      {level.description ? (
        <dd className="text-sm text-pretty text-muted-foreground">
          {level.description}
        </dd>
      ) : null}
      {members.length > 0 ? (
        <dd className="mt-auto pt-2 text-sm font-medium text-highlight">
          {nameList.format(members)}
        </dd>
      ) : null}
    </div>
  )
}

function ServiceDetails({ service }: { service: Service }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-medium">{service.name}</span>
        {service.popular ? <Badge variant="secondary">Popular</Badge> : null}
        {service.consultation ? (
          <Badge variant="outline">Consultation first</Badge>
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
  )
}

function PriceCells({
  service,
  levels,
  columns,
}: {
  service: Service
  levels: ServiceLevel[]
  columns: number
}) {
  const priceClass =
    "py-4 pl-2 text-right font-heading text-xl whitespace-nowrap tabular-nums md:text-2xl"

  if (service.price !== undefined) {
    return (
      <td colSpan={columns} className={priceClass}>
        {formatPrice(service.price, service.from)}
        {levels.length > 1 ? (
          <span className="block font-sans text-xs text-muted-foreground">
            Any stylist
          </span>
        ) : null}
      </td>
    )
  }

  return levels.map((level) => {
    const price = service.prices?.[level.id]
    return (
      <td key={level.id} className={priceClass}>
        {price === undefined ? (
          <>
            <span aria-hidden className="text-muted-foreground">
              –
            </span>
            <span className="sr-only">Not offered</span>
          </>
        ) : (
          formatPrice(price, service.from)
        )}
      </td>
    )
  })
}
