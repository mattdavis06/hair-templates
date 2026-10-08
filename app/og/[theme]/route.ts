import { BRAND_IDS, getBrand } from "@/lib/brands"
import { renderShareImage } from "@/lib/seo/brand-images"

export const dynamicParams = false

export function generateStaticParams() {
  return BRAND_IDS.map((theme) => ({ theme }))
}

export async function GET(_request: Request, ctx: RouteContext<"/og/[theme]">) {
  return renderShareImage(getBrand((await ctx.params).theme))
}
