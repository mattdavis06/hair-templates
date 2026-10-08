import type { Section, SectionType } from "@/content/schema"
import type { Brand } from "@/lib/brands"

export type SectionProps = {
  brand: Brand
  /** Anchor for in-page links, e.g. `#contact`. */
  id?: string
}

/** For sections that read their options from site.json, e.g. `form` on an enquiry. */
export type SectionWithOptions<T extends SectionType> = SectionProps & {
  section: Extract<Section, { type: T }>
}
