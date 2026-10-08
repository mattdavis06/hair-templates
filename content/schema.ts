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

/** Hosts `lib/image-loader.ts` knows how to resize; anything else must live in `public/`. */
export const IMAGE_HOSTS = ["images.unsplash.com", "images.pexels.com"] as const

const imageSchema = z.object({
  src: z
    .string()
    .refine(
      (src) =>
        src.startsWith("/") ||
        IMAGE_HOSTS.some((host) => src.startsWith(`https://${host}/`)),
      `Use a /public path or an image from ${IMAGE_HOSTS.join(" or ")}`
    ),
  /** Describe what's in the photo for screen readers; never "image of…". */
  alt: z.string().min(1),
  /** CSS object-position for cropping, e.g. "center 30%". */
  position: z.string().optional(),
})

const teamSchema = z.object({
  title: z.string(),
  intro: z.string(),
  members: z
    .array(
      z.object({
        name: z.string(),
        role: z.string(),
        bio: z.string().optional(),
        specialities: z.array(z.string()),
        image: imageSchema,
        /** Booking link for this person; falls back to the shop's booking link. */
        bookingUrl: z.url().optional(),
      })
    )
    .min(1),
})

const gallerySchema = z.object({
  title: z.string(),
  intro: z.string(),
  images: z
    .array(imageSchema.extend({ caption: z.string().optional() }))
    .min(1),
})

const starRating = z.number().min(1).max(5)

const reviewsSchema = z
  .object({
    title: z.string(),
    intro: z.string(),
    /** The overall score shown in the summary; should match the source. */
    rating: z.object({
      average: starRating,
      count: z.number().int().positive(),
    }),
    /** Where the reviews come from, e.g. Google; links to all reviews. */
    source: z.object({ name: z.string(), url: z.url() }),
    items: z
      .array(
        z.object({
          author: z.string(),
          rating: starRating.int(),
          date: z.iso.date(),
          text: z.string(),
          /** The service they had, e.g. "Skin fade". */
          service: z.string().optional(),
        })
      )
      .min(1),
  })
  .refine(
    (reviews) => reviews.items.length <= reviews.rating.count,
    "rating.count can't be lower than the number of reviews listed"
  )

const faqsSchema = z.object({
  title: z.string(),
  intro: z.string().optional(),
  items: z.array(z.object({ question: z.string(), answer: z.string() })).min(1),
})

const policiesSchema = z.object({
  title: z.string(),
  intro: z.string().optional(),
  items: z.array(z.object({ title: z.string(), body: z.string() })).min(1),
})

const productsSchema = z.object({
  title: z.string(),
  intro: z.string(),
  items: z
    .array(
      z.object({
        name: z.string(),
        /** Maker or range, shown above the name. */
        brand: z.string().optional(),
        /** e.g. "100ml". */
        size: z.string().optional(),
        description: z.string().optional(),
        price: z.number().nonnegative(),
        image: imageSchema.optional(),
      })
    )
    .min(1),
  /** e.g. "In store only". */
  note: z.string().optional(),
})

const loyaltySchema = z.object({
  title: z.string(),
  description: z.string(),
  /** Boxes on the card; the last one is the reward. */
  stamps: z.number().int().min(4).max(12),
  /** Label on the last box, e.g. "Free cut". */
  reward: z.string(),
  terms: z.string().optional(),
})

const visitSchema = z.object({
  title: z.string(),
  intro: z.string().optional(),
  /** Getting-here notes: buses, parking, accessibility… */
  notes: z.array(z.object({ title: z.string(), body: z.string() })),
  /**
   * Google Maps → Share → Embed a map → copy the `src`. Without it the map is
   * built from the address.
   */
  mapEmbedUrl: z
    .url()
    .refine(
      (url) => url.startsWith("https://www.google.com/maps/embed"),
      "Use the src from Google Maps' 'Embed a map' code"
    )
    .optional(),
})

const serviceSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  /** Whole pounds or pence as decimals, e.g. 24 or 24.5. */
  price: z.number().nonnegative(),
  /** Shows "from £x" when the final price depends on hair length or extras. */
  from: z.boolean().optional(),
  /** Minutes; shown to customers and used for booking expectations. */
  duration: z.number().int().positive(),
  popular: z.boolean().optional(),
})

const servicesSchema = z.object({
  title: z.string(),
  intro: z.string(),
  categories: z
    .array(
      z.object({
        name: z.string(),
        description: z.string().optional(),
        items: z.array(serviceSchema).min(1),
      })
    )
    .min(1),
  /** Small print under the list, e.g. payment methods. */
  note: z.string().optional(),
})

const walkInsSchema = z.object({
  title: z.string(),
  description: z.string(),
  /** Typical wait in minutes outside the busy times. */
  usualWait: z.number().int().nonnegative(),
  busyTimes: z.array(
    z.object({
      days: z.array(z.enum(DAYS)).min(1),
      from: time,
      to: time,
      wait: z.number().int().nonnegative(),
    })
  ),
})

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
  /** Required by the `services` section. */
  services: servicesSchema.optional(),
  /** Required by the `walk-ins` section. */
  walkIns: walkInsSchema.optional(),
  /** Required by the `team` section. */
  team: teamSchema.optional(),
  /** Required by the `gallery` section. */
  gallery: gallerySchema.optional(),
  /** Required by the `reviews` section; also feeds the star rating in structured data. */
  reviews: reviewsSchema.optional(),
  /** Required by the `faqs` section. */
  faqs: faqsSchema.optional(),
  /** Required by the `policies` section. */
  policies: policiesSchema.optional(),
  /** Required by the `products` section. */
  products: productsSchema.optional(),
  /** Required by the `loyalty` section. */
  loyalty: loyaltySchema.optional(),
  /** Required by the `visit` section. */
  visit: visitSchema.optional(),
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
  "walk-ins": ["strip"],
  services: ["list"],
  team: ["grid"],
  gallery: ["grid"],
  reviews: ["grid"],
  faqs: ["accordion"],
  policies: ["list"],
  products: ["grid"],
  loyalty: ["card"],
  visit: ["map"],
  contact: ["split", "form"],
  newsletter: ["banner"],
} as const

export type SectionType = keyof typeof SECTION_VARIANTS

/** Sections that render optional content; the brand must provide it to use them. */
const SECTION_CONTENT = {
  "walk-ins": "walkIns",
  services: "services",
  team: "team",
  gallery: "gallery",
  reviews: "reviews",
  faqs: "faqs",
  policies: "policies",
  products: "products",
  loyalty: "loyalty",
  visit: "visit",
} as const satisfies Partial<Record<SectionType, keyof Content>>

function section<T extends SectionType>(type: T) {
  return z.object({
    type: z.literal(type),
    variant: z.enum(SECTION_VARIANTS[type]),
    id: z.string().optional(),
  })
}

const sectionSchema = z.discriminatedUnion("type", [
  section("hero"),
  section("walk-ins"),
  section("services"),
  section("team"),
  section("gallery"),
  section("reviews"),
  section("faqs"),
  section("policies"),
  section("products"),
  section("loyalty"),
  section("visit"),
  section("contact"),
  section("newsletter"),
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

/** Lists sections a brand uses without supplying the content they render. */
export function missingSectionContent(content: Content, site: Site): string[] {
  return site.pages.flatMap((page) =>
    page.sections.flatMap((s) => {
      const key =
        s.type in SECTION_CONTENT
          ? SECTION_CONTENT[s.type as keyof typeof SECTION_CONTENT]
          : null
      return key && !content[key]
        ? [`"${s.type}" on page "/${page.slug}" needs "${key}" in content.json`]
        : []
    })
  )
}

export type DayHours = z.infer<typeof dayHoursSchema>
export type Service = z.infer<typeof serviceSchema>
export type Services = z.infer<typeof servicesSchema>
export type WalkIns = z.infer<typeof walkInsSchema>
export type ContentImage = z.infer<typeof imageSchema>
export type Content = z.infer<typeof contentSchema>
export type Site = z.infer<typeof siteSchema>
export type Page = Site["pages"][number]
export type Section = Page["sections"][number]
export type Palette = Site["palette"]
export type FontKey = (typeof FONTS)[number]
