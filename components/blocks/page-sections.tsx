import type { ComponentType } from 'react'
import { sectionRegistry } from '@/components/blocks/registry'
import type { SectionWithOptions } from '@/components/blocks/types'
import { PageTransition } from '@/components/site/page-transition'
import { sectionKey, type Page } from '@/content/schema'
import type { Brand } from '@/lib/brands'

/** Renders a page's sections in the order and variants its brand config lists. */
export function PageSections({ brand, page }: { brand: Brand; page: Page }) {
  return (
    <PageTransition brand={brand} pageKey={page.slug}>
      {page.sections.map((section) => {
        // TypeScript can't see that `section.type` picks both the registry entry
        // and the props type, so the pairing is checked by the registry's type instead.
        const variants = sectionRegistry[section.type] as Record<
          string,
          ComponentType<SectionWithOptions<typeof section.type>>
        >
        const Component = variants[section.variant]

        return (
          <Component
            key={sectionKey(section)}
            brand={brand}
            section={section}
            id={section.id}
          />
        )
      })}
    </PageTransition>
  )
}
