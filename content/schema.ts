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

/** Matches what `siteSchema` accepts as a page or section path, e.g. `/book#vouchers`. */
const SITE_PATH = /^\/[a-z0-9-]*(#[a-z0-9-]+)?$/

/** A button or text link: a page or section on this site, a web address, phone or email. */
const linkSchema = z.object({
  label: z.string(),
  href: z
    .string()
    .refine(
      (href) =>
        SITE_PATH.test(href) || /^(https:\/\/|tel:|mailto:)\S+$/.test(href),
      "Use a site path like /colour#consultation, an https:// URL, tel: or mailto:"
    ),
})

const teamSchema = z.object({
  title: z.string(),
  intro: z.string(),
  members: z
    .array(
      z.object({
        name: z.string(),
        role: z.string(),
        /** One of `services.levels`; sets which price column applies to them. */
        level: z.string().optional(),
        bio: z.string().optional(),
        specialities: z.array(z.string()),
        /** Without a photo, the card shows their initials. */
        image: imageSchema.optional(),
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

const price = z.number().nonnegative()

const serviceSchema = z
  .object({
    name: z.string(),
    description: z.string().optional(),
    /** One price for everyone. Whole pounds or pence as decimals, e.g. 24 or 24.5. */
    price: price.optional(),
    /** A price per stylist level, keyed by level id; leave a level out if they don't offer it. */
    prices: z.record(z.string(), price).optional(),
    /** Shows "from £x" when the final price depends on hair length or extras. */
    from: z.boolean().optional(),
    /** Minutes; shown to customers and used for booking expectations. */
    duration: z.number().int().positive(),
    popular: z.boolean().optional(),
    /** Needs a consultation (and patch test) before it can be booked. */
    consultation: z.boolean().optional(),
  })
  .refine(
    (service) =>
      (service.price === undefined) !== (service.prices === undefined),
    "Give either price or prices, not both"
  )

const servicesSchema = z
  .object({
    title: z.string(),
    intro: z.string(),
    /** Stylist seniority, cheapest first. Needed when any service uses `prices`. */
    levels: z
      .array(
        z.object({
          id: z.string().regex(/^[a-z0-9-]+$/),
          name: z.string(),
          description: z.string().optional(),
        })
      )
      .optional(),
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
  .superRefine((services, ctx) => {
    const levels = new Set(services.levels?.map((level) => level.id))
    services.categories.forEach((category, c) =>
      category.items.forEach((service, i) => {
        for (const level of Object.keys(service.prices ?? {})) {
          if (levels.has(level)) continue
          ctx.addIssue({
            code: "custom",
            path: ["categories", c, "items", i, "prices", level],
            message: `"${level}" isn't one of services.levels`,
          })
        }
      })
    )
  })

const heroSchema = z.object({
  /** The large photo in the `split` hero. */
  image: imageSchema,
  /** Second button beside the booking button. */
  secondary: linkSchema.optional(),
})

const highlightsSchema = z.object({
  title: z.string(),
  intro: z.string().optional(),
  items: z
    .array(
      z.object({
        title: z.string(),
        body: z.string(),
        image: imageSchema,
        link: linkSchema,
      })
    )
    .min(1),
})

const offerSchema = z.object({
  /** Short label set in the accent font, e.g. "New here?". */
  eyebrow: z.string(),
  title: z.string(),
  body: z.string(),
  link: linkSchema,
  terms: z.string().optional(),
})

const noticeSchema = z.object({
  title: z.string(),
  body: z.string(),
  link: linkSchema.optional(),
})

const bookingCtaSchema = z.object({
  title: z.string(),
  body: z.string(),
  /** Extra link beside the booking and phone buttons. */
  secondary: linkSchema.optional(),
})

const vouchersSchema = z.object({
  title: z.string(),
  intro: z.string(),
  /** Fixed values shown as cards, in pounds. */
  amounts: z.array(price).min(1),
  /** Extra card for a custom value, e.g. "Any amount from £25". */
  custom: z.string().optional(),
  /** Where vouchers are bought, e.g. the booking provider's gift card page. */
  url: z.url(),
  label: z.string(),
  terms: z.array(z.string()),
})

const transformationsSchema = z.object({
  title: z.string(),
  intro: z.string(),
  items: z
    .array(
      z.object({
        title: z.string(),
        description: z.string(),
        stylist: z.string().optional(),
        /** e.g. ["Colour correction", "Gloss"]. */
        services: z.array(z.string()),
        /** Minutes in the chair. */
        duration: z.number().int().positive().optional(),
        /** Crop both photos the same way so the slider lines up. */
        before: imageSchema,
        after: imageSchema,
      })
    )
    .min(1),
})

/** The `<h1>` block that opens a sub-page, keyed by the name its section uses. */
const pageHeadersSchema = z.record(
  z.string(),
  z.object({
    eyebrow: z.string().optional(),
    title: z.string(),
    intro: z.string().optional(),
  })
)

/** Enquiry forms a brand can offer; the fields for each live in `lib/forms/enquiries.ts`. */
export const ENQUIRY_KINDS = ["consultation", "events"] as const
export type EnquiryKind = (typeof ENQUIRY_KINDS)[number]

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

const enquirySchema = z.object({
  title: z.string(),
  intro: z.string(),
  /** Short reassurances beside the form, e.g. "Free, 15 minutes". */
  points: z.array(z.string()),
  image: imageSchema.optional(),
  submit: z.string(),
  success: copySchema,
  /** The automatic reply the visitor gets. */
  email: emailCopySchema,
})

const enquiriesSchema = z.partialRecord(z.enum(ENQUIRY_KINDS), enquirySchema)

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
  /** Required by the `split` hero. */
  hero: heroSchema.optional(),
  /** Required by `page-header` sections; each names its entry. */
  pageHeaders: pageHeadersSchema.optional(),
  /** Required by the `highlights` section. */
  highlights: highlightsSchema.optional(),
  /** Required by the `offer` section. */
  offer: offerSchema.optional(),
  /** Required by the `notice` section. */
  notice: noticeSchema.optional(),
  /** Required by the `booking` section. */
  bookingCta: bookingCtaSchema.optional(),
  /** Required by the `vouchers` section. */
  vouchers: vouchersSchema.optional(),
  /** Required by the `before-after` section. */
  transformations: transformationsSchema.optional(),
  /** Copy for each `enquiry` section's form, keyed by its `form` option. */
  enquiries: enquiriesSchema.optional(),
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
  hero: ["centered", "split"],
  "walk-ins": ["strip"],
  services: ["list", "matrix"],
  team: ["grid", "profiles"],
  gallery: ["grid", "masonry"],
  reviews: ["grid", "carousel"],
  faqs: ["accordion"],
  policies: ["list"],
  products: ["grid"],
  loyalty: ["card"],
  visit: ["map"],
  contact: ["split", "form"],
  newsletter: ["banner"],
  highlights: ["cards"],
  offer: ["banner"],
  notice: ["banner"],
  booking: ["cta"],
  vouchers: ["cards"],
  "before-after": ["slider"],
  enquiry: ["split"],
  "page-header": ["simple"],
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
  highlights: "highlights",
  offer: "offer",
  notice: "notice",
  booking: "bookingCta",
  vouchers: "vouchers",
  "before-after": "transformations",
  enquiry: "enquiries",
  "page-header": "pageHeaders",
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
  section("services").extend({
    /** Show only these categories (by name), e.g. colour on its own page. */
    categories: z.array(z.string()).min(1).optional(),
  }),
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
  section("highlights"),
  section("offer"),
  section("notice"),
  section("booking"),
  section("vouchers"),
  section("before-after"),
  section("enquiry").extend({ form: z.enum(ENQUIRY_KINDS) }),
  /** `name` picks the entry in content.json's `pageHeaders`. */
  section("page-header").extend({ name: z.string() }),
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
      z.object({ label: z.string(), href: z.string().regex(SITE_PATH) })
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
      if (!linkExists(site, link.href)) {
        ctx.addIssue({
          code: "custom",
          path: ["nav", index, "href"],
          message: `"${link.href}" doesn't match a page or section id`,
        })
      }
    })
  })

/** True for outside links, and for site paths that point at a real page or section id. */
function linkExists(site: Pick<Site, "pages">, href: string): boolean {
  if (!href.startsWith("/")) return true
  const [path, hash] = href.split("#")
  const page = site.pages.find((p) => `/${p.slug}` === path)
  return hash
    ? Boolean(page?.sections.some((section) => section.id === hash))
    : Boolean(page)
}

/**
 * Checks that need both files: sections whose content is missing, options
 * that name things content.json doesn't have, and links to pages that don't exist.
 */
export function brandProblems(content: Content, site: Site): string[] {
  const problems: string[] = []

  for (const page of site.pages) {
    const where = `on page "/${page.slug}"`
    for (const s of page.sections) {
      const key =
        s.type in SECTION_CONTENT
          ? SECTION_CONTENT[s.type as keyof typeof SECTION_CONTENT]
          : null
      if (key && !content[key]) {
        problems.push(`"${s.type}" ${where} needs "${key}" in content.json`)
        continue
      }
      if (s.type === "hero" && s.variant === "split" && !content.hero) {
        problems.push(`The split hero ${where} needs "hero" in content.json`)
      }
      if (s.type === "services" && s.categories) {
        const names = new Set(content.services?.categories.map((c) => c.name))
        for (const name of s.categories.filter((n) => !names.has(n))) {
          problems.push(`Services ${where} lists unknown category "${name}"`)
        }
      }
      if (s.type === "enquiry" && !content.enquiries?.[s.form]) {
        problems.push(
          `Enquiry ${where} needs "enquiries.${s.form}" in content.json`
        )
      }
      if (s.type === "page-header" && !content.pageHeaders?.[s.name]) {
        problems.push(
          `Page header ${where} needs "pageHeaders.${s.name}" in content.json`
        )
      }
    }
  }

  const levels = new Set(content.services?.levels?.map((level) => level.id))
  for (const member of content.team?.members ?? []) {
    if (member.level && !levels.has(member.level)) {
      problems.push(`${member.name}'s level "${member.level}" isn't a level`)
    }
  }

  const links = [
    content.hero?.secondary,
    content.offer?.link,
    content.notice?.link,
    content.bookingCta?.secondary,
    ...(content.highlights?.items.map((item) => item.link) ?? []),
  ]
  for (const link of links) {
    if (link && !linkExists(site, link.href)) {
      problems.push(`Link "${link.href}" doesn't match a page or section id`)
    }
  }

  return problems
}

export type DayHours = z.infer<typeof dayHoursSchema>
export type Service = z.infer<typeof serviceSchema>
export type Services = z.infer<typeof servicesSchema>
export type WalkIns = z.infer<typeof walkInsSchema>
export type ServiceLevel = NonNullable<Services["levels"]>[number]
export type TeamMember = z.infer<typeof teamSchema>["members"][number]
export type ContentLink = z.infer<typeof linkSchema>
export type EnquiryCopy = z.infer<typeof enquirySchema>
export type ContentImage = z.infer<typeof imageSchema>
export type Content = z.infer<typeof contentSchema>
export type Site = z.infer<typeof siteSchema>
export type Page = Site["pages"][number]
export type Section = Page["sections"][number]
export type Palette = Site["palette"]
export type FontKey = (typeof FONTS)[number]
