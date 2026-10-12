import type { SectionProps } from '@/components/blocks/types'
import { buttonVariants } from '@/components/ui/button'
import { contentHref } from '@/lib/brands'
import { CalendarDaysIcon, PaletteIcon, PhoneIcon } from 'lucide-react'

const OUTLINE_ON_PRIMARY =
  'border-primary bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/40 hover:text-primary-foreground'

/** A full-width band that ends a page with one clear next step: book. */
export function BookingCta({ brand, id }: SectionProps) {
  const { bookingCta, booking, phone } = brand.content
  if (!bookingCta) return null

  return (
    <section id={id} className='bg-primary text-primary-foreground'>
      <div className='mx-auto flex w-full max-w-6xl flex-col items-start gap-8 px-6 py-16 md:flex-row md:items-center md:justify-between md:py-20'>
        <div className='flex max-w-2xl flex-col gap-3'>
          <h2 className='text-4xl text-balance md:text-5xl'>
            {bookingCta.title}
          </h2>
          <p className='text-lg text-pretty text-primary-foreground/85'>
            {bookingCta.body}
          </p>
        </div>
        <div className='flex w-full shrink-0 flex-col gap-3 sm:w-auto'>
          <a
            href={booking.url}
            className={buttonVariants({
              variant: 'secondary',
              size: 'lg',
              className: 'capitalize',
            })}
          >
            <CalendarDaysIcon data-icon='inline-start' />
            {booking.label}
          </a>
          {bookingCta.secondary ? (
            <a
              href={contentHref(brand, bookingCta.secondary.href)}
              className={buttonVariants({
                variant: 'outline',
                size: 'lg',
                className: OUTLINE_ON_PRIMARY,
              })}
            >
              <PaletteIcon data-icon='inline-start' />
              {bookingCta.secondary.label}
            </a>
          ) : null}
          <a
            href={`tel:${phone.replace(/\s/g, '')}`}
            className={buttonVariants({
              variant: 'outline',
              size: 'lg',
              className: OUTLINE_ON_PRIMARY,
            })}
          >
            <PhoneIcon data-icon='inline-start' />
            Call {phone}
          </a>
        </div>
      </div>
    </section>
  )
}
