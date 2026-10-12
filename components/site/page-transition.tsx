import { ViewTransition, type ReactNode } from 'react'
import type { Brand } from '@/lib/brands'

/**
 * Animates the page content when the visitor moves to another page.
 * Has to sit inside a page, not the layout: the layout stays mounted between
 * pages, so it never enters or exits. Animations live in `globals.css`.
 */
export function PageTransition({
  brand,
  pageKey,
  children,
}: {
  brand: Brand
  /** Changes per page, so React treats each page as leaving and arriving. */
  pageKey: string
  children: ReactNode
}) {
  if (brand.site.transition === 'none') return children

  return (
    <ViewTransition
      key={pageKey}
      enter='page-in'
      exit='page-out'
      default='none'
    >
      <div className='flex flex-1 flex-col'>{children}</div>
    </ViewTransition>
  )
}
