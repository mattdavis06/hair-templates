import type { CSSProperties } from "react"
import type { Site } from "@/content/schema"

const HEADER_MIN = 80
const HEADER_PADDING = 16

/** Per-brand logo heights and the header height that fits them, as CSS variables on `<html>`. */
export function logoStyle({ logo }: Site): CSSProperties {
  if (!logo) return { "--header-height": `${HEADER_MIN}px` } as CSSProperties
  const { header, footer } = logo.sizes
  return {
    "--logo-header": `${header}px`,
    "--logo-footer": `${footer}px`,
    "--header-height": `${Math.max(HEADER_MIN, header + HEADER_PADDING)}px`,
  } as CSSProperties
}

/** The largest size that fits in the box without stretching, so wide and tall logos both work. */
export function fitLogo(
  { width, height }: NonNullable<Site["logo"]>,
  box: { width: number; height: number }
): { width: number; height: number } {
  const scale = Math.min(box.width / width, box.height / height)
  return {
    width: Math.round(width * scale),
    height: Math.round(height * scale),
  }
}
