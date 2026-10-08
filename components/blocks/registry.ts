import type { ComponentType } from "react"
import { ContactFormCard } from "@/components/blocks/contact/contact-form-card"
import { ContactSplit } from "@/components/blocks/contact/contact-split"
import { FaqsAccordion } from "@/components/blocks/faqs/faqs-accordion"
import { GalleryGrid } from "@/components/blocks/gallery/gallery-grid"
import { HeroCentered } from "@/components/blocks/hero/hero-centered"
import { NewsletterBanner } from "@/components/blocks/newsletter/newsletter-banner"
import { LoyaltyCard } from "@/components/blocks/loyalty/loyalty-card"
import { PoliciesList } from "@/components/blocks/policies/policies-list"
import { ProductsGrid } from "@/components/blocks/products/products-grid"
import { ReviewsGrid } from "@/components/blocks/reviews/reviews-grid"
import { ServicesList } from "@/components/blocks/services/services-list"
import { TeamGrid } from "@/components/blocks/team/team-grid"
import type { SectionProps } from "@/components/blocks/types"
import { VisitMap } from "@/components/blocks/visit/visit-map"
import { WalkInsStrip } from "@/components/blocks/walk-ins/walk-ins-strip"
import type { SECTION_VARIANTS, SectionType } from "@/content/schema"

type SectionRegistry = {
  [T in SectionType]: Record<
    (typeof SECTION_VARIANTS)[T][number],
    ComponentType<SectionProps>
  >
}

export const sectionRegistry: SectionRegistry = {
  hero: { centered: HeroCentered },
  "walk-ins": { strip: WalkInsStrip },
  services: { list: ServicesList },
  team: { grid: TeamGrid },
  gallery: { grid: GalleryGrid },
  reviews: { grid: ReviewsGrid },
  faqs: { accordion: FaqsAccordion },
  policies: { list: PoliciesList },
  products: { grid: ProductsGrid },
  loyalty: { card: LoyaltyCard },
  visit: { map: VisitMap },
  contact: { split: ContactSplit, form: ContactFormCard },
  newsletter: { banner: NewsletterBanner },
}
