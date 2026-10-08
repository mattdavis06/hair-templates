import type { ComponentType } from "react"
import { ContactSplit } from "@/components/blocks/contact/contact-split"
import { HeroCentered } from "@/components/blocks/hero/hero-centered"
import { NewsletterBanner } from "@/components/blocks/newsletter/newsletter-banner"
import { ServicesList } from "@/components/blocks/services/services-list"
import type { SectionProps } from "@/components/blocks/types"
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
  contact: { split: ContactSplit },
  newsletter: { banner: NewsletterBanner },
}
