import type { CSSProperties } from "react"
import type { Site } from "@/content/schema"

/** The brand's palette as the CSS variables shadcn components read. */
export function brandStyle({
  palette: p,
  scheme,
  radius,
}: Site): CSSProperties {
  return {
    colorScheme: scheme,
    "--radius": `${radius / 16}rem`,
    "--background": p.background,
    "--foreground": p.foreground,
    "--card": p.card,
    "--card-foreground": p.foreground,
    "--popover": p.card,
    "--popover-foreground": p.foreground,
    "--primary": p.primary,
    "--primary-foreground": p.primaryForeground,
    "--secondary": p.secondary,
    "--secondary-foreground": p.secondaryForeground,
    "--muted": p.muted,
    "--muted-foreground": p.mutedForeground,
    "--accent": p.accent,
    "--accent-foreground": p.accentForeground,
    "--destructive": p.destructive,
    "--border": p.border,
    "--input": p.border,
    "--ring": p.primary,
    /** Brand-coloured text (straplines, eyebrows): primary or accent, whichever reads better. */
    "--highlight": mostReadable(p.background, [p.primary, p.accent]),
  } as CSSProperties
}

function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((start) => {
    const value = parseInt(hex.slice(start, start + 2), 16) / 255
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/** WCAG contrast ratio; 4.5 or more passes AA for body text. */
export function contrastRatio(a: string, b: string): number {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (light + 0.05) / (dark + 0.05)
}

/** Whichever candidate reads best as text on `background`. */
export function mostReadable(background: string, candidates: string[]): string {
  return candidates.reduce((best, colour) =>
    contrastRatio(colour, background) > contrastRatio(best, background)
      ? colour
      : best
  )
}

/** Blends two hex colours; `amount` is how much of `to` ends up in the result. */
export function mix(from: string, to: string, amount: number): string {
  const channels = (hex: string) =>
    [1, 3, 5].map((start) => parseInt(hex.slice(start, start + 2), 16))
  const a = channels(from)
  const b = channels(to)
  return `#${a
    .map((value, index) =>
      Math.round(value + (b[index] - value) * amount)
        .toString(16)
        .padStart(2, "0")
    )
    .join("")}`
}
