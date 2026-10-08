import type { Content, FontKey } from "@/content/schema"
import { brandHref, getBrand, type Brand, type BrandId } from "@/lib/brands"
import { groupOpeningHours } from "@/lib/opening-hours"
import { mix, mostReadable } from "@/lib/palette"
import { siteUrl } from "@/lib/site"

/** Email clients can't read CSS variables, so every colour is a plain hex value. */
export type EmailTheme = {
  scheme: "light" | "dark"
  page: string
  card: string
  text: string
  muted: string
  border: string
  subtle: string
  button: string
  onButton: string
  /** Eyebrows, links and the signoff: the brand colour that reads best on the card. */
  highlight: string
  footer: string
  onFooter: string
  footerMuted: string
  footerRule: string
  headingFont: string
  headingWeight: number
  headingCase: "uppercase" | "none"
  bodyFont: string
  accentFont: string
  fontsHref: string
  radius: number
}

/** Web-font name, the weights it ships, and fallbacks for clients that block web fonts. */
const EMAIL_FONTS: Record<
  FontKey,
  { family: string; weights: string; fallback: string }
> = {
  barlow: {
    family: "Barlow",
    weights: "400;600",
    fallback: "'Helvetica Neue', Arial, sans-serif",
  },
  "bebas-neue": {
    family: "Bebas Neue",
    weights: "400",
    fallback: "Impact, 'Arial Narrow', sans-serif",
  },
  "dm-sans": {
    family: "DM Sans",
    weights: "400;600",
    fallback: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  },
  "dm-serif-display": {
    family: "DM Serif Display",
    weights: "400",
    fallback: "Georgia, 'Times New Roman', serif",
  },
  parisienne: {
    family: "Parisienne",
    weights: "400",
    fallback: "'Brush Script MT', cursive",
  },
  yellowtail: {
    family: "Yellowtail",
    weights: "400",
    fallback: "'Brush Script MT', cursive",
  },
}

const fontStack = (key: FontKey) =>
  `'${EMAIL_FONTS[key].family}', ${EMAIL_FONTS[key].fallback}`

function fontsHref(keys: FontKey[]): string {
  const families = [...new Set(keys)].map((key) => {
    const { family, weights } = EMAIL_FONTS[key]
    return `family=${family.replaceAll(" ", "+")}:wght@${weights}`
  })
  return `https://fonts.googleapis.com/css2?${families.join("&")}&display=swap`
}

function emailTheme({ site }: Brand): EmailTheme {
  const p = site.palette
  const dark = site.scheme === "dark"
  const footer = dark ? p.muted : p.foreground
  const onFooter = dark ? p.foreground : p.background
  return {
    scheme: site.scheme,
    page: p.background,
    card: p.card,
    text: p.foreground,
    muted: p.mutedForeground,
    border: p.border,
    subtle: p.muted,
    button: p.primary,
    onButton: p.primaryForeground,
    highlight: mostReadable(p.card, [p.primary, p.accent]),
    footer,
    onFooter,
    footerMuted: mix(onFooter, footer, 0.35),
    footerRule: mix(footer, onFooter, 0.18),
    headingFont: fontStack(site.fonts.heading),
    headingWeight: site.fonts.headingWeight,
    headingCase: site.fonts.headingUppercase ? "uppercase" : "none",
    bodyFont: fontStack(site.fonts.body),
    accentFont: fontStack(site.fonts.accent),
    fontsHref: fontsHref([
      site.fonts.heading,
      site.fonts.body,
      site.fonts.accent,
    ]),
    radius: site.radius,
  }
}

/** Everything a template needs, as plain data so previews and sends render identically. */
export type EmailBrand = {
  id: BrandId
  name: string
  tagline: string
  theme: EmailTheme
  logoUrl: string
  siteUrl: string
  booking: { label: string; url: string }
  address: string[]
  phone: string
  email: string
  hours: { days: string; hours: string }[]
  socials: { label: string; url: string }[]
  copy: Content["emails"]
}

/**
 * Images in a sent email are fetched later by the recipient's mail client, so
 * they must come from a public deployment, never localhost or a protected preview.
 */
function resolveEmailBaseUrl(): string {
  const explicit =
    process.env.EMAIL_ASSET_URL || process.env.NEXT_PUBLIC_SITE_URL
  if (explicit) return explicit.replace(/\/$/, "")
  const production = process.env.VERCEL_PROJECT_PRODUCTION_URL
  return production ? `https://${production}` : siteUrl
}

const emailBaseUrl = resolveEmailBaseUrl()

export function toEmailBrand(brand: Brand): EmailBrand {
  const { content } = brand
  const { street, city, postcode } = content.address

  return {
    id: brand.id,
    name: content.name,
    tagline: content.tagline,
    theme: emailTheme(brand),
    logoUrl: `${emailBaseUrl}/icons/${brand.id}/apple`,
    siteUrl: `${emailBaseUrl}${brandHref(brand.id)}`,
    booking: { label: content.booking.label, url: content.booking.url },
    address: [street, `${city} ${postcode}`],
    phone: content.phone,
    email: content.email,
    hours: groupOpeningHours(content.openingHours),
    socials: content.socials,
    copy: content.emails,
  }
}

export function firstName(name: string): string {
  return name.trim().split(/\s+/)[0] ?? name
}

export function getEmailBrand(brandId: BrandId): EmailBrand {
  return toEmailBrand(getBrand(brandId))
}
