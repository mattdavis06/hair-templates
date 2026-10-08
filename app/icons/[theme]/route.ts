import { BRAND_IDS, getBrand } from "@/lib/brands"
import { renderBrandIcon } from "@/lib/seo/brand-images"

export const dynamicParams = false

export function generateStaticParams() {
  return BRAND_IDS.map((theme) => ({ theme }))
}

export async function GET(
  _request: Request,
  ctx: RouteContext<"/icons/[theme]">
) {
  return renderBrandIcon(getBrand((await ctx.params).theme), { size: 64 })
}
