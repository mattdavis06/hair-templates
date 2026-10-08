import type { Brand } from "@/lib/brands"

export type SectionProps = {
  brand: Brand
  /** Anchor for in-page links, e.g. `#contact`. */
  id?: string
}
