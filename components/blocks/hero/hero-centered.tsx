import { OpenStatus } from '@/components/blocks/opening-hours/open-status'
import type { SectionProps } from '@/components/blocks/types'
import { BrandImage } from '@/components/site/brand-image'
import { BrandMark } from '@/components/site/brand-mark'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

/**
 * Everything centred: the logo (or `hero.title`), tagline and buttons. With
 * `hero.image` the photo fills the section behind them under a dark wash.
 */
export function HeroCentered({ brand, id }: SectionProps) {
  const { name, tagline, strapline, booking, phone, openingHours, hero } =
    brand.content
  const { logo } = brand.site
  const image = hero?.image

  return (
    <section
      id={id}
      className={cn(
        'relative isolate flex flex-col items-center justify-center gap-6 overflow-hidden px-6 py-24 text-center md:py-32',
        image && 'min-h-[min(52rem,calc(100svh-var(--header-height,5rem)))]'
      )}
    >
      {image ? (
        <>
          <div className='absolute inset-0 -z-20'>
            <BrandImage image={image} sizes='100vw' preload />
          </div>
          <div
            aria-hidden
            className='absolute inset-0 -z-10 bg-radial from-black/85 from-40% to-black/10'
          />
        </>
      ) : null}

      <OpenStatus hours={openingHours} className='justify-center' />
      <div className='flex flex-col items-center gap-2'>
        <p className='font-accent text-3xl text-highlight md:text-4xl'>
          {strapline}
        </p>
        {hero?.title ? (
          <h1 className='max-w-4xl text-5xl text-balance uppercase md:text-7xl'>
            {hero.title}
          </h1>
        ) : logo ? (
          <h1 className='w-full max-w-xs md:max-w-xl'>
            <BrandMark
              name={name}
              monogram={brand.site.monogram}
              logo={logo}
              logoClassName='h-auto w-full'
              preload={!image}
            />
          </h1>
        ) : (
          <h1 className='max-w-3xl text-6xl md:text-8xl'>{name}</h1>
        )}
      </div>
      <p
        className={cn(
          'max-w-xl text-lg text-pretty',
          image ? 'text-white/85' : 'text-muted-foreground'
        )}
      >
        {hero?.text ?? tagline}
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
