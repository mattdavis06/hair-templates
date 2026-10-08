import type { Metadata } from "next"
import { PageSections } from "@/components/blocks/page-sections"
import { getBrand, getPage } from "@/lib/brands"
import { pageMetadata } from "@/lib/seo/metadata"

export async function generateMetadata({
  params,
}: PageProps<"/[brand]">): Promise<Metadata> {
  const brand = getBrand((await params).brand)
  return pageMetadata(brand, getPage(brand, ""))
}

export default async function HomePage({ params }: PageProps<"/[brand]">) {
  const brand = getBrand((await params).brand)
  return <PageSections brand={brand} page={getPage(brand, "")} />
}
