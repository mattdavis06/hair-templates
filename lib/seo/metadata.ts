import type { Metadata } from "next"
import type { Page } from "@/content/schema"
import { pagePath, type Brand } from "@/lib/brands"
import { brandUrl, shareImage } from "@/lib/site"

export function pageMetadata({ id, content }: Brand, page: Page): Metadata {
  const isHome = page.slug === ""
  const title = isHome ? content.seo.title : (page.seo?.title ?? page.title)
  const shareTitle = isHome ? content.seo.title : `${title} · ${content.name}`
  const description = page.seo?.description ?? content.seo.description
  const url = brandUrl(id, pagePath(page))
  const image = shareImage(id, `${content.name}: ${content.tagline}`)

  return {
    title: isHome ? { absolute: title } : title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "en_GB",
      siteName: content.name,
      url,
      title: shareTitle,
      description,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: shareTitle,
      description,
      images: [image],
    },
  }
}
