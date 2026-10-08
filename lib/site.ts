import { brandHref, type BrandId } from "@/lib/brands/ids"

function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL
  if (explicit) return explicit.replace(/\/$/, "")

  const vercelHost =
    process.env.VERCEL_ENV === "production"
      ? process.env.VERCEL_PROJECT_PRODUCTION_URL
      : process.env.VERCEL_URL
  if (vercelHost) return `https://${vercelHost}`

  return `http://localhost:${process.env.PORT ?? 3000}`
}

export const siteUrl = resolveSiteUrl()

/** Demos stay out of search results unless a deployment opts in. */
export const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true"

export function absoluteUrl(path: string): string {
  return new URL(path, siteUrl).toString()
}

/** Absolute URL that keeps the brand, for canonical links, sitemaps and emails. */
export function brandUrl(brandId: BrandId, path = "/"): string {
  return absoluteUrl(brandHref(brandId, path))
}

/** Per-brand share image; one shared URL would let crawlers cache one brand's card for all. */
export function shareImage(brandId: BrandId, alt: string) {
  return { url: `/og/${brandId}`, width: 1200, height: 630, alt }
}
