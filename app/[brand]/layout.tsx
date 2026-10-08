import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import type { Metadata, Viewport } from "next"
import { JsonLd } from "@/components/seo/json-ld"
import {
  BrandSwitcher,
  type BrandOption,
} from "@/components/site/brand-switcher"
import { BRAND_IDS, brandList, getBrand, pagePath } from "@/lib/brands"
import { brandFontProps } from "@/lib/fonts"
import { brandStyle } from "@/lib/palette"
import { businessJsonLd } from "@/lib/seo/structured-data"
import { allowIndexing, shareImage, siteUrl } from "@/lib/site"
import { cn } from "@/lib/utils"
import "../globals.css"

export function generateStaticParams() {
  return BRAND_IDS.map((brand) => ({ brand }))
}

const brandOptions: BrandOption[] = brandList.map(({ id, site }) => ({
  id,
  name: site.name,
  summary: site.summary,
  paths: site.pages.map(pagePath),
}))

export async function generateMetadata({
  params,
}: LayoutProps<"/[brand]">): Promise<Metadata> {
  const { id, content } = getBrand((await params).brand)
  const image = shareImage(id, `${content.name}: ${content.tagline}`)

  return {
    metadataBase: new URL(siteUrl),
    // Per-brand URLs: browsers cache favicons by URL, so a shared one never updates on switch.
    icons: {
      icon: { url: `/icons/${id}`, type: "image/png", sizes: "64x64" },
      apple: { url: `/icons/${id}/apple`, sizes: "180x180" },
    },
    title: { default: content.seo.title, template: `%s · ${content.name}` },
    description: content.seo.description,
    applicationName: content.name,
    robots: allowIndexing ? undefined : { index: false, follow: false },
    openGraph: {
      type: "website",
      locale: "en_GB",
      siteName: content.name,
      images: [image],
    },
    twitter: { card: "summary_large_image", images: [image] },
  }
}

export async function generateViewport({
  params,
}: LayoutProps<"/[brand]">): Promise<Viewport> {
  const { site } = getBrand((await params).brand)
  return { themeColor: site.palette.background, colorScheme: site.scheme }
}

export default async function BrandLayout({
  children,
  params,
}: LayoutProps<"/[brand]">) {
  const brand = getBrand((await params).brand)
  const fonts = brandFontProps(brand.site.fonts)

  return (
    <html
      lang="en-GB"
      data-brand={brand.id}
      className={cn(
        "antialiased",
        brand.site.scheme === "dark" && "dark",
        fonts.className
      )}
      style={{ ...brandStyle(brand.site), ...fonts.style }}
    >
      <body className="flex min-h-svh flex-col">
        <JsonLd data={businessJsonLd(brand)} />
        <main className="flex flex-1 flex-col">{children}</main>
        <BrandSwitcher brands={brandOptions} current={brand.id} />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
