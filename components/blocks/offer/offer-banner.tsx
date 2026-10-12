import type { SectionProps } from '@/components/blocks/types'
import { buttonVariants } from '@/components/ui/button'
import { contentHref } from '@/lib/brands'

/** A coloured panel for one promotion, e.g. a new-client discount. */
export function OfferBanner({ brand, id }: SectionProps) {
  const { offer } = brand.content
  if (!offer) return null

  return (
    <section id={id} className='mx-auto w-full max-w-6xl px-6 py-10'>
      <div className='rounded-[calc(var(--radius)*2)] bg-primary px-6 py-10 text-primary-foreground md:px-12 md:py-14'>
        <div className='flex flex-col gap-8 md:flex-row md:items-end md:justify-between'>
          <div className='flex max-w-2xl flex-col gap-3'>
            <p className='font-accent text-3xl'>{offer.eyebrow}</p>
            <h2 className='text-4xl text-balance md:text-5xl'>{offer.title}</h2>
            <p className='text-lg text-pretty'>{offer.body}</p>
            {offer.terms ? (
              <p className='text-sm text-primary-foreground/75'>
                {offer.terms}
              </p>
            ) : null}
          </div>
          {offer.link ? (
            <a
              href={contentHref(brand, offer.link.href)}
              className={buttonVariants({
                variant: 'secondary',
                size: 'lg',
                className: 'self-start',
              })}
            >
              {offer.link.label}
            </a>
          ) : null}
        </div>
      </div>
    </section>
  )
}
