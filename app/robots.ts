import type { MetadataRoute } from "next"
import { absoluteUrl, allowIndexing } from "@/lib/site"

// Crawling stays open so link-preview bots can read share tags; the `noindex`
// meta tag (see app/[brand]/layout.tsx) is what keeps demos out of search.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    ...(allowIndexing && { sitemap: absoluteUrl("/sitemap.xml") }),
  }
}
