import { sectionRegistry } from "@/components/blocks/registry"
import type { SectionWithOptions } from "@/components/blocks/types"
import { sectionKey, type Page } from "@/content/schema"
import type { Brand } from "@/lib/brands"
import type { ComponentType } from "react"

/** Renders a page's sections in the order and variants its brand config lists. */
export function PageSections({ brand, page }: { brand: Brand; page: Page }) {
  return page.sections.map((section) => {
    // TypeScript can't see that `section.type` picks both the registry entry
    // and the props type, so the pairing is checked by the registry's type instead.
    const variants = sectionRegistry[section.type] as Record<
      string,
      ComponentType<SectionWithOptions<typeof section.type>>
    >
    const Section = variants[section.variant]

    return (
      <Section
        key={sectionKey(section)}
        brand={brand}
        section={section}
        id={section.id}
      />
    )
  })
}
