import type { CSSProperties } from "react"
import {
  Barlow,
  Bebas_Neue,
  DM_Sans,
  DM_Serif_Display,
  Parisienne,
  Yellowtail,
} from "next/font/google"
import type { NextFontWithVariable } from "next/dist/compiled/@next/font"
import type { FontKey, Site } from "@/content/schema"

// One layout serves every brand, so preloading would fetch every brand's fonts
// on every page. Unpreloaded, browsers download only the fonts a page uses.
const barlow = Barlow({
  subsets: ["latin"],
  preload: false,
  weight: ["400", "500", "600"],
  variable: "--font-barlow",
})

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  preload: false,
  weight: "400",
  variable: "--font-bebas-neue",
})

const dmSans = DM_Sans({
  subsets: ["latin"],
  preload: false,
  variable: "--font-dm-sans",
})

const dmSerifDisplay = DM_Serif_Display({
  subsets: ["latin"],
  preload: false,
  weight: "400",
  variable: "--font-dm-serif-display",
})

const parisienne = Parisienne({
  subsets: ["latin"],
  preload: false,
  weight: "400",
  variable: "--font-parisienne",
})

const yellowtail = Yellowtail({
  subsets: ["latin"],
  preload: false,
  weight: "400",
  variable: "--font-yellowtail",
})

const fonts: Record<FontKey, NextFontWithVariable> = {
  barlow,
  "bebas-neue": bebasNeue,
  "dm-sans": dmSans,
  "dm-serif-display": dmSerifDisplay,
  parisienne,
  yellowtail,
}

/** Loads only the brand's fonts and points the heading, body and accent tokens at them. */
export function brandFontProps(selection: Site["fonts"]) {
  const keys = [selection.heading, selection.body, selection.accent]

  return {
    className: [...new Set(keys)].map((key) => fonts[key].variable).join(" "),
    style: {
      "--font-display": `var(--font-${selection.heading})`,
      "--font-body": `var(--font-${selection.body})`,
      "--font-flourish": `var(--font-${selection.accent})`,
      "--heading-weight": String(selection.headingWeight),
      "--heading-transform": selection.headingUppercase ? "uppercase" : "none",
    } as CSSProperties,
  }
}
