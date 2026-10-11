import { Fragment, type ComponentType } from 'react'
import { sectionRegistry } from '@/components/blocks/registry'
import type { SectionWithOptions } from '@/components/blocks/types'
import { DevLabel, showDevLabels } from '@/components/site/dev-label'
import { sectionKey, type Page, type Section } from '@/content/schema'
import { brandList, type Brand } from '@/lib/brands'

const variantName = (section: Section) => `${section.type}/${section.variant}`

/** Brand names using each section variant, for the dev-only "Shared" labels. */
const variantBrands = new Map<string, Set<string>>()
for (const { site } of brandList) {
  for (const page of site.pages) {
    for (const section of page.sections) {
      const name = variantName(section)
      variantBrands.set(
        name,
        (variantBrands.get(name) ?? new Set()).add(site.name)
      )
    }
  }
}

function OwnerLabel({ section }: { section: Section }) {
  const owners = [...(variantBrands.get(variantName(section)) ?? [])]
  if (owners.length < 2) return null
  return (
    <DevLabel>
      Shared · {owners.join(' + ')} · {variantName(section)}
    </DevLabel>
  )
}

/** Renders a page's sections in the order and variants its brand config lists. */
export function PageSections({ brand, page }: { brand: Brand; page: Page }) {
  return page.sections.map((section) => {
    // TypeScript can't see that `section.type` picks both the registry entry
    // and the props type, so the pairing is checked by the registry's type instead.
    const variants = sectionRegistry[section.type] as Record<
      string,
      ComponentType<SectionWithOptions<typeof section.type>>
    >
    const Component = variants[section.variant]

    return (
      <Fragment key={sectionKey(section)}>
        {showDevLabels ? <OwnerLabel section={section} /> : null}
        <Component brand={brand} section={section} id={section.id} />
      </Fragment>
    )
  })
}
