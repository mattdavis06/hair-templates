import { z } from "zod"

const time = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Use 24-hour HH:MM")
const hexColour = z
  .string()
  .regex(/^#[0-9a-f]{6}$/i, "Use a 6-digit hex colour")

export const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const

export const dayHoursSchema = z.union([
  z.object({ day: z.enum(DAYS), open: time, close: time }),
  z.object({ day: z.enum(DAYS), closed: z.literal(true) }),
])

const copySchema = z.object({ title: z.string(), description: z.string() })

const emailCopySchema = z.object({
  subject: z.string(),
  /** Inbox preview text shown after the subject line. */
  preview: z.string(),
  heading: z.string(),
  body: z.string(),
})

export const contentSchema = z.object({
  name: z.string(),
  tagline: z.string(),
  /** A few words set in the accent font above the name, e.g. "Walk-ins welcome". */
  strapline: z.string(),
  description: z.string(),
  businessType: z.enum(["HairSalon", "BeautySalon"]),
  priceRange: z.string().optional(),
  phone: z.string(),
  email: z.email(),
  address: z.object({
    street: z.string(),
    city: z.string(),
    postcode: z.string(),
    country: z.string().length(2),
  }),
  openingHours: z
    .array(dayHoursSchema)
    .length(7)
    .refine(
      (days) => new Set(days.map((d) => d.day)).size === 7,
      "List each day once"
    ),
  booking: z.object({
    provider: z.enum(["fresha", "booksy", "other"]),
    url: z.url(),
    label: z.string(),
  }),
  socials: z.array(z.object({ label: z.string(), url: z.url() })),
  seo: z.object({ title: z.string(), description: z.string() }),
  forms: z.object({
    contact: z.object({
      title: z.string(),
      intro: z.string(),
      submit: z.string(),
      success: copySchema,
    }),
    newsletter: z.object({
      title: z.string(),
      intro: z.string(),
      submit: z.string(),
      success: copySchema,
    }),
    failed: copySchema,
  }),
  emails: z.object({
    signoff: z.string(),
    contact: emailCopySchema,
    newsletter: emailCopySchema,
  }),
})

export const SECTION_VARIANTS = {
  hero: ["centered"],
  contact: ["split"],
  newsletter: ["banner"],
} as const

export type SectionType = keyof typeof SECTION_VARIANTS

const sectionSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("hero"),
    variant: z.enum(SECTION_VARIANTS.hero),
    id: z.string().optional(),
  }),
  z.object({
    type: z.literal("contact"),
    variant: z.enum(SECTION_VARIANTS.contact),
    id: z.string().optional(),
  }),
  z.object({
    type: z.literal("newsletter"),
    variant: z.enum(SECTION_VARIANTS.newsletter),
    id: z.string().optional(),
  }),
])

/** Identifies a section within its page; unique per page. */
export function sectionKey(section: { type: string; id?: string }) {
  return section.id ?? section.type
}

/** The shadcn colour roles; popover, input and ring are derived from these. */
const paletteSchema = z.object({
  background: hexColour,
  foreground: hexColour,
  card: hexColour,
  primary: hexColour,
  primaryForeground: hexColour,
  secondary: hexColour,
  secondaryForeground: hexColour,
  muted: hexColour,
  mutedForeground: hexColour,
  accent: hexColour,
  accentForeground: hexColour,
  border: hexColour,
  destructive: hexColour,
})

export const FONTS = [
  "barlow",
  "bebas-neue",
  "dm-sans",
  "dm-serif-display",
  "parisienne",
  "yellowtail",
] as const

export const siteSchema = z
  .object({
    name: z.string(),
    /** One line shown in the brand switcher. */
    summary: z.string(),
    fonts: z.object({
      heading: z.enum(FONTS),
      /** Match a weight the heading font ships; others get faked by the browser. */
      headingWeight: z.number().int().min(100).max(900),
      headingUppercase: z.boolean(),
      body: z.enum(FONTS),
      /** Short flourishes only: straplines and signoffs, never body copy. */
      accent: z.enum(FONTS),
    }),
    /** Dark brands also switch on shadcn's `dark:` styles and native dark controls. */
    scheme: z.enum(["light", "dark"]),
    /** Corner radius in px; becomes `--radius` on the site and in emails. */
    radius: z.number().int().min(0).max(24),
    palette: paletteSchema,
    monogram: z.string().min(1).max(3),
    /** Header and footer links: a page (`/book`) or a section on one (`/#contact`). */
    nav: z.array(
      z.object({
        label: z.string(),
        href: z.string().regex(/^\/[a-z0-9-]*(#[a-z0-9-]+)?$/),
      })
    ),
    pages: z
      .array(
        z.object({
          /** URL path segment; empty for the home page. */
          slug: z.string().regex(/^[a-z0-9-]*$/),
          title: z.string(),
          seo: z
            .object({ title: z.string(), description: z.string() })
            .optional(),
          sections: z
            .array(sectionSchema)
            .min(1)
            .refine(
              (sections) =>
                new Set(sections.map(sectionKey)).size === sections.length,
              "Give repeated section types on a page their own id"
            ),
        })
      )
      .min(1)
      .refine((pages) => pages.some((p) => p.slug === ""), "Add a home page")
      .refine(
        (pages) => new Set(pages.map((p) => p.slug)).size === pages.length,
        "Page slugs must be unique"
      ),
  })
  .superRefine((site, ctx) => {
    site.nav.forEach((link, index) => {
      const [path, hash] = link.href.split("#")
      const page = site.pages.find((p) => `/${p.slug}` === path)
      const found = hash
        ? page?.sections.some((section) => section.id === hash)
        : Boolean(page)
      if (!found) {
        ctx.addIssue({
          code: "custom",
          path: ["nav", index, "href"],
          message: `"${link.href}" doesn't match a page or section id`,
        })
      }
    })
  })

export type DayHours = z.infer<typeof dayHoursSchema>
export type Content = z.infer<typeof contentSchema>
export type Site = z.infer<typeof siteSchema>
export type Page = Site["pages"][number]
export type Section = Page["sections"][number]
export type Palette = Site["palette"]
export type FontKey = (typeof FONTS)[number]
