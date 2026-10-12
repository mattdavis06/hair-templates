import type { SectionProps } from '@/components/blocks/types'
import { WalkInWait } from '@/components/blocks/walk-ins/walk-in-wait'
import { formatDays, formatTime } from '@/lib/opening-hours'

export function WalkInsStrip({ brand, id }: SectionProps) {
  const { walkIns, openingHours, booking } = brand.content
  if (!walkIns) return null

  return (
    <section id={id} className='border-y bg-card'>
      <div className='mx-auto grid w-full max-w-6xl gap-8 px-6 py-10 md:grid-cols-[1fr_auto_auto] md:items-center md:gap-12'>
        <div className='flex max-w-md flex-col gap-2'>
          <h2 className='text-3xl'>{walkIns.title}</h2>
          <p className='text-pretty text-muted-foreground'>
            {walkIns.description}{' '}
            {booking.url ? (
              <a
                href={booking.url}
                className='capitalize underline transition-colors hover:text-primary-foreground'
              >
                {booking.label}
              </a>
            ) : null}
          </p>
          {walkIns.busyTimes.length > 0 ? (
            <p className='text-sm text-muted-foreground'>
              <span className='font-medium text-foreground'>Busiest:</span>{' '}
              {walkIns.busyTimes
                .map(
                  (band) =>
                    `${formatDays(band.days)} ${formatTime(band.from)} – ${formatTime(band.to)}`
                )
                .join(' · ')}
            </p>
          ) : null}
        </div>

        <WalkInWait walkIns={walkIns} hours={openingHours} />
      </div>
    </section>
  )
}
