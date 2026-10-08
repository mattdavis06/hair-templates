export const BRAND_IDS = ["northside", "colour-room"] as const

export type BrandId = (typeof BRAND_IDS)[number]

export const DEFAULT_BRAND: BrandId = "northside"

/** Shareable query param that picks the brand, e.g. `/book?theme=colour-room`. */
export const BRAND_PARAM = "theme"

export function isBrandId(value: unknown): value is BrandId {
  return BRAND_IDS.includes(value as BrandId)
}

/** Site-relative link that keeps the brand. The default brand gets clean URLs. */
export function brandHref(brandId: BrandId, path = "/"): string {
  const hashIndex = path.indexOf("#")
  const pathname = (hashIndex === -1 ? path : path.slice(0, hashIndex)) || "/"
  const hash = hashIndex === -1 ? "" : path.slice(hashIndex)
  if (brandId === DEFAULT_BRAND) return `${pathname}${hash}`
  return `${pathname}?${BRAND_PARAM}=${brandId}${hash}`
}
