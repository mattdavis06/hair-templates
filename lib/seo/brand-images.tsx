import type { Brand } from "@/lib/brands"
import { fitLogo } from "@/lib/logo"
import { mostReadable } from "@/lib/palette"
import { ImageResponse } from "next/og"
import { readFile } from "node:fs/promises"
import { join } from "node:path"

export const shareImageSize = { width: 1200, height: 630 }

/** Reads an image from `public/` as a data URL; the renderer can't fetch site paths. */
async function publicImage(path: string): Promise<string> {
  const data = await readFile(join(process.cwd(), "public", path), "base64")
  const type = path.endsWith(".svg") ? "image/svg+xml" : "image/png"
  return `data:${type};base64,${data}`
}

const SHARE_LOGO_BOX = { width: 560, height: 260 }

export async function renderShareImage({ content, site }: Brand) {
  const { background, foreground, primary, accent } = site.palette
  const logo = site.logo && {
    src: await publicImage(site.logo.solid ?? site.logo.src),
    ...fitLogo(site.logo, SHARE_LOGO_BOX),
  }

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
      {logo ? (
        // eslint-disable-next-line @next/next/no-img-element -- rendered to a PNG, not the page
        <img
          src={logo.src}
          width={logo.width}
          height={logo.height}
          alt={content.name}
        />
      ) : (
        <div style={{ fontSize: 88, fontWeight: 700, lineHeight: 1 }}>
          {content.name}
        </div>
      )}
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

export async function renderBrandIcon(
  { site }: Brand,
  { size, square }: IconOptions
) {
  const icon = site.logo?.icon
  if (icon) {
    const mark = Math.round(size * (square ? 0.72 : 1))
    return new ImageResponse(
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: square ? site.palette.background : "transparent",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- rendered to a PNG, not the page */}
        <img src={await publicImage(icon)} width={mark} height={mark} alt="" />
      </div>,
      { width: size, height: size }
    )
  }

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
