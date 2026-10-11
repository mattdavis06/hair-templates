import { OpenStatus } from '@/components/blocks/opening-hours/open-status'
import type { SectionProps } from '@/components/blocks/types'
import { BrandMark } from '@/components/site/brand-mark'
import { buttonVariants } from '@/components/ui/button'

export function HeroCentered({ brand, id }: SectionProps) {
  const { name, tagline, strapline, booking, phone, openingHours } =
    brand.content
  const { logo } = brand.site

  return (
    <section
      id={id}
      className='flex flex-col items-center gap-6 px-6 py-24 text-center md:py-32'
    >
      <OpenStatus hours={openingHours} className='justify-center' />
      <div className='flex flex-col items-center gap-2'>
        <p className='font-accent text-3xl text-highlight md:text-4xl'>
          {strapline}
        </p>
        {logo ? (
          <h1 className='w-full max-w-xs md:max-w-xl'>
            <BrandMark
              name={name}
              monogram={brand.site.monogram}
              logo={logo}
              logoClassName='h-auto w-full'
              preload
            />
          </h1>
        ) : (
          <h1 className='max-w-3xl text-6xl md:text-8xl'>{name}</h1>
        )}
      </div>
      <p className='max-w-xl text-lg text-pretty text-muted-foreground'>
        {tagline}
      </p>
      <div className='flex flex-wrap justify-center gap-3'>
        <a href={booking.url} className={buttonVariants({ size: 'lg' })}>
          {booking.label}
        </a>
        <a
          href={`tel:${phone.replace(/\s/g, '')}`}
          className={buttonVariants({ variant: 'outline', size: 'lg' })}
        >
          Call {phone}
        </a>
      </div>
    </section>
  )
}
