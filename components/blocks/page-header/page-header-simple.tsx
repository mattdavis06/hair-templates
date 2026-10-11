import type { SectionWithOptions } from '@/components/blocks/types'

/** The `<h1>` for a sub-page, with a rule underneath. */
export function PageHeaderSimple({
  brand,
  section,
  id,
}: SectionWithOptions<'page-header'>) {
  const header = brand.content.pageHeaders?.[section.name]
  if (!header) return null

  return (
    <section id={id} className='border-b'>
      <div className='mx-auto flex w-full max-w-6xl flex-col gap-3 px-6 py-16 md:py-24'>
        {header.eyebrow ? (
          <p className='font-accent text-3xl text-highlight'>
            {header.eyebrow}
          </p>
        ) : null}
        <h1 className='max-w-3xl text-5xl text-balance md:text-7xl'>
          {header.title}
        </h1>
        {header.intro ? (
          <p className='max-w-2xl text-lg text-pretty text-muted-foreground md:text-xl'>
            {header.intro}
          </p>
        ) : null}
      </div>
    </section>
  )
}
