import { notFound } from "next/navigation"
import colourRoomContent from "@/content/brands/colour-room/content.json"
import colourRoomSite from "@/content/brands/colour-room/site.json"
import northsideContent from "@/content/brands/northside/content.json"
import northsideSite from "@/content/brands/northside/site.json"
import {
  brandProblems,
  contentSchema,
  siteSchema,
  type Content,
  type Page,
  type Site,
} from "@/content/schema"
import { BRAND_IDS, brandHref, isBrandId, type BrandId } from "./ids"

export * from "./ids"

export type Brand = { id: BrandId; content: Content; site: Site }

function parseBrand(id: BrandId, content: unknown, site: unknown): Brand {
  let brand: Brand
  try {
    brand = {
      id,
      content: contentSchema.parse(content),
      site: siteSchema.parse(site),
    }
  } catch (error) {
    throw new Error(`Invalid content for brand "${id}"`, { cause: error })
  }

  const problems = brandProblems(brand.content, brand.site)
  if (problems.length > 0) {
    throw new Error(`Brand "${id}": ${problems.join("; ")}`)
  }
  return brand
}

const brands: Record<BrandId, Brand> = {
  northside: parseBrand("northside", northsideContent, northsideSite),
  "colour-room": parseBrand("colour-room", colourRoomContent, colourRoomSite),
}

export const brandList: Brand[] = BRAND_IDS.map((id) => brands[id])

export function findBrand(id: unknown): Brand | null {
  return isBrandId(id) ? brands[id] : null
}

/** Resolves a route param to a brand, or renders the 404 page. */
export function getBrand(id: string): Brand {
  return findBrand(id) ?? notFound()
}

export function getPage(brand: Brand, slug: string): Page {
  const page = brand.site.pages.find((p) => p.slug === slug)
  if (!page) notFound()
  return page
}

export function pagePath(page: Page): string {
  return page.slug ? `/${page.slug}` : "/"
}

/** Content links to site paths keep the brand; outside, tel: and mailto: links pass through. */
export function contentHref(brand: Brand, href: string): string {
  return href.startsWith("/") ? brandHref(brand.id, href) : href
}

export type NavLink = { label: string; href: string }

/** The brand's header and footer links, with the brand kept in each URL. */
export function navLinks(brand: Brand): NavLink[] {
  return brand.site.nav.map(({ label, href }) => ({
    label,
    href: brandHref(brand.id, href),
  }))
}
