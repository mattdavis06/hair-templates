import type { ComponentType } from "react"
import { sectionRegistry } from "@/components/blocks/registry"
import type { SectionProps } from "@/components/blocks/types"
import { sectionKey, type Page } from "@/content/schema"
import type { Brand } from "@/lib/brands"

/** Renders a page's sections in the order and variants its brand config lists. */
export function PageSections({ brand, page }: { brand: Brand; page: Page }) {
  return page.sections.map((section) => {
    const variants: Record<
      string,
      ComponentType<SectionProps>
    > = sectionRegistry[section.type]
    const Section = variants[section.variant]
    return <Section key={sectionKey(section)} brand={brand} id={section.id} />
  })
}
