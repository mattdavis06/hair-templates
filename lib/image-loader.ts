"use client"

import type { ImageLoaderProps } from "next/image"

/**
 * Asks the photo's own CDN for the exact width next/image needs, so we never
 * download a full-size original. Hosts must match `IMAGE_HOSTS` in the schema.
 */
export default function imageLoader({
  src,
  width,
  quality,
}: ImageLoaderProps): string {
  const q = String(quality ?? 75)

  if (src.startsWith("https://images.unsplash.com/")) {
    const url = new URL(src)
    url.searchParams.set("w", String(width))
    url.searchParams.set("q", q)
    url.searchParams.set("auto", "format")
    url.searchParams.set("fit", "max")
    return url.href
  }

  if (src.startsWith("https://images.pexels.com/")) {
    const url = new URL(src)
    url.searchParams.set("w", String(width))
    url.searchParams.set("auto", "compress")
    url.searchParams.set("cs", "tinysrgb")
    return url.href
  }

  return `${src}?w=${width}`
}
