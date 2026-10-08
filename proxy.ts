import { NextResponse, type NextRequest } from "next/server"
import {
  BRAND_PARAM,
  DEFAULT_BRAND,
  brandHref,
  isBrandId,
} from "@/lib/brands/ids"

/**
 * Pages are prerendered per brand under `/<brand>/...`. Visitors only ever see
 * the clean path plus `?theme=`, so every URL is shareable and needs no cookie.
 */
export function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl
  const param = searchParams.get(BRAND_PARAM)

  const [, firstSegment, ...rest] = pathname.split("/")
  if (isBrandId(firstSegment)) {
    return redirectTo(request, brandHref(firstSegment, `/${rest.join("/")}`))
  }

  if (param !== null && !isBrandId(param)) {
    const url = request.nextUrl.clone()
    url.searchParams.delete(BRAND_PARAM)
    return NextResponse.redirect(url)
  }

  const brandId = param ?? DEFAULT_BRAND
  const url = request.nextUrl.clone()
  url.pathname = pathname === "/" ? `/${brandId}` : `/${brandId}${pathname}`
  return NextResponse.rewrite(url)
}

function redirectTo(request: NextRequest, href: string) {
  return NextResponse.redirect(new URL(href, request.url), 308)
}

export const config = {
  matcher: [
    // Skips Next internals, files, image and icon routes, and BotID's own endpoints.
    "/((?!_next/|og/|icons/|149e9513-01fa-4fb0-aad4-566afd725d1b/|.*\\..*).*)",
  ],
}
