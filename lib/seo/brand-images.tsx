import { ImageResponse } from "next/og"
import type { Brand } from "@/lib/brands"
import { mostReadable } from "@/lib/palette"

export const shareImageSize = { width: 1200, height: 630 }

export function renderShareImage({ content, site }: Brand) {
  const { background, foreground, primary, accent } = site.palette

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "0 96px",
        background,
        color: foreground,
        borderLeft: `32px solid ${primary}`,
      }}
    >
      <div style={{ fontSize: 88, fontWeight: 700, lineHeight: 1 }}>
        {content.name}
      </div>
      <div
        style={{ marginTop: 28, maxWidth: 860, fontSize: 38, lineHeight: 1.3 }}
      >
        {content.tagline}
      </div>
      <div
        style={{
          marginTop: 44,
          fontSize: 26,
          letterSpacing: 3,
          textTransform: "uppercase",
          color: mostReadable(background, [primary, accent]),
        }}
      >
        {content.address.city}
      </div>
    </div>,
    shareImageSize
  )
}

type IconOptions = {
  size: number
  /** iOS fills transparent corners with black, so Apple icons stay square. */
  square?: boolean
}

export function renderBrandIcon(
  { site }: Brand,
  { size, square }: IconOptions
) {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: site.palette.primary,
        color: site.palette.primaryForeground,
        borderRadius: square ? 0 : "22%",
        borderBottom: `${Math.round(size / 10)}px solid ${site.palette.accent}`,
        fontSize: Math.round(size / (site.monogram.length > 1 ? 2.4 : 1.7)),
        fontWeight: 700,
      }}
    >
      {site.monogram}
    </div>,
    { width: size, height: size }
  )
}
