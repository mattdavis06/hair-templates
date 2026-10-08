import type { ComponentType } from "react"
import { ContactSplit } from "@/components/blocks/contact/contact-split"
import { HeroCentered } from "@/components/blocks/hero/hero-centered"
import { NewsletterBanner } from "@/components/blocks/newsletter/newsletter-banner"
import type { SectionProps } from "@/components/blocks/types"
import type { SECTION_VARIANTS, SectionType } from "@/content/schema"

type SectionRegistry = {
  [T in SectionType]: Record<
    (typeof SECTION_VARIANTS)[T][number],
    ComponentType<SectionProps>
  >
}

export const sectionRegistry: SectionRegistry = {
  hero: { centered: HeroCentered },
  contact: { split: ContactSplit },
  newsletter: { banner: NewsletterBanner },
}
