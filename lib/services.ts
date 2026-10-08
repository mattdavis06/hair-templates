import type { Service, Services } from "@/content/schema"
import { formatPrice } from "@/lib/format"

/** The categories a services section shows: the ones it names, in its order, or all. */
export function pickCategories(
  services: Services,
  names: string[] | undefined
): Services["categories"] {
  if (!names) return services.categories
  return names.flatMap((name) =>
    services.categories.filter((category) => category.name === name)
  )
}

/** Cheapest and dearest price across stylist levels (the same for a single price). */
export function priceBounds(service: Service): { min: number; max: number } {
  const prices =
    service.price === undefined
      ? Object.values(service.prices ?? {})
      : [service.price]
  return { min: Math.min(...prices), max: Math.max(...prices) }
}

/** One label for lists: "£45", "from £30", or "from £85" when it varies by level. */
export function servicePriceLabel(service: Service): string {
  const { min, max } = priceBounds(service)
  return formatPrice(min, service.from || min !== max)
}
