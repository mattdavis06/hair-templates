import type { MetadataRoute } from "next"
import { brandList, pagePath } from "@/lib/brands"
import { brandUrl } from "@/lib/site"

export default function sitemap(): MetadataRoute.Sitemap {
  return brandList.flatMap(({ id, site }) =>
    site.pages.map((page) => ({
      url: brandUrl(id, pagePath(page)),
      changeFrequency: "monthly" as const,
      priority: page.slug === "" ? 1 : 0.8,
    }))
  )
}
