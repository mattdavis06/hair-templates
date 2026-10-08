import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { PageSections } from "@/components/blocks/page-sections"
import { brandList, getBrand, getPage } from "@/lib/brands"
import { pageMetadata } from "@/lib/seo/metadata"

// Lists every brand's pages in one go: Next drops all of them when a brand
// with no sub-pages returns an empty list from a per-brand call. Unknown paths
// still render on demand, so notFound() shows the brand's own 404 page.
export function generateStaticParams() {
  return brandList.flatMap(({ id, site }) =>
    site.pages
      .filter((page) => page.slug !== "")
      .map((page) => ({ brand: id, slug: [page.slug] }))
  )
}

async function resolve(params: PageProps<"/[brand]/[...slug]">["params"]) {
  const { brand: brandId, slug } = await params
  if (slug.length !== 1) notFound()
  const brand = getBrand(brandId)
  return { brand, page: getPage(brand, slug[0]) }
}

export async function generateMetadata({
  params,
}: PageProps<"/[brand]/[...slug]">): Promise<Metadata> {
  const { brand, page } = await resolve(params)
  return pageMetadata(brand, page)
}

export default async function BrandPage({
  params,
}: PageProps<"/[brand]/[...slug]">) {
  const { brand, page } = await resolve(params)
  return <PageSections brand={brand} page={page} />
}
