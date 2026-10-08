import type { ComponentType } from "react"
import { BeforeAfterSlider } from "@/components/blocks/before-after/before-after-slider"
import { BookingCta } from "@/components/blocks/booking/booking-cta"
import { ContactFormCard } from "@/components/blocks/contact/contact-form-card"
import { ContactSplit } from "@/components/blocks/contact/contact-split"
import { EnquirySplit } from "@/components/blocks/enquiry/enquiry-split"
import { FaqsAccordion } from "@/components/blocks/faqs/faqs-accordion"
import { GalleryGrid } from "@/components/blocks/gallery/gallery-grid"
import { GalleryMasonry } from "@/components/blocks/gallery/gallery-masonry"
import { HeroCentered } from "@/components/blocks/hero/hero-centered"
import { HeroSplit } from "@/components/blocks/hero/hero-split"
import { HighlightsCards } from "@/components/blocks/highlights/highlights-cards"
import { LoyaltyCard } from "@/components/blocks/loyalty/loyalty-card"
import { NewsletterBanner } from "@/components/blocks/newsletter/newsletter-banner"
import { NoticeBanner } from "@/components/blocks/notice/notice-banner"
import { OfferBanner } from "@/components/blocks/offer/offer-banner"
import { PageHeaderSimple } from "@/components/blocks/page-header/page-header-simple"
import { PoliciesList } from "@/components/blocks/policies/policies-list"
import { ProductsGrid } from "@/components/blocks/products/products-grid"
import { ReviewsCarousel } from "@/components/blocks/reviews/reviews-carousel"
import { ReviewsGrid } from "@/components/blocks/reviews/reviews-grid"
import { ServicesList } from "@/components/blocks/services/services-list"
import { ServicesMatrix } from "@/components/blocks/services/services-matrix"
import { TeamGrid } from "@/components/blocks/team/team-grid"
import { TeamProfiles } from "@/components/blocks/team/team-profiles"
import type { SectionWithOptions } from "@/components/blocks/types"
import { VisitMap } from "@/components/blocks/visit/visit-map"
import { VouchersCards } from "@/components/blocks/vouchers/vouchers-cards"
import { WalkInsStrip } from "@/components/blocks/walk-ins/walk-ins-strip"
import type { SECTION_VARIANTS, SectionType } from "@/content/schema"

type SectionRegistry = {
  [T in SectionType]: Record<
    (typeof SECTION_VARIANTS)[T][number],
    ComponentType<SectionWithOptions<T>>
  >
}

export const sectionRegistry: SectionRegistry = {
  hero: { centered: HeroCentered, split: HeroSplit },
  "walk-ins": { strip: WalkInsStrip },
  services: { list: ServicesList, matrix: ServicesMatrix },
  team: { grid: TeamGrid, profiles: TeamProfiles },
  gallery: { grid: GalleryGrid, masonry: GalleryMasonry },
  reviews: { grid: ReviewsGrid, carousel: ReviewsCarousel },
  faqs: { accordion: FaqsAccordion },
  policies: { list: PoliciesList },
  products: { grid: ProductsGrid },
  loyalty: { card: LoyaltyCard },
  visit: { map: VisitMap },
  contact: { split: ContactSplit, form: ContactFormCard },
  newsletter: { banner: NewsletterBanner },
  highlights: { cards: HighlightsCards },
  offer: { banner: OfferBanner },
  notice: { banner: NoticeBanner },
  booking: { cta: BookingCta },
  vouchers: { cards: VouchersCards },
  "before-after": { slider: BeforeAfterSlider },
  enquiry: { split: EnquirySplit },
  "page-header": { simple: PageHeaderSimple },
}
