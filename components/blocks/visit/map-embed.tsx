import { MapPinIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Google map that loads on its own once the visitor scrolls near it
 * (`loading='lazy'`), so it doesn't slow the top of the page. The address
 * shows underneath until the map has drawn.
 */
export function MapEmbed({
  src,
  title,
  address,
  className,
}: {
  src: string
  title: string
  address: string
  className?: string
}) {
  return (
    <div
      className={cn(
        'relative min-h-80 overflow-hidden rounded-lg border bg-muted',
        className
      )}
    >
      <div
        aria-hidden
        className='absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[radial-gradient(var(--border)_1px,transparent_1px)] bg-size-[20px_20px] p-6 text-center'
      >
        <span className='flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground'>
          <MapPinIcon />
        </span>
        <p className='max-w-xs font-medium text-pretty'>{address}</p>
      </div>
      {/* react-doctor-disable-next-line react-doctor/iframe-missing-sandbox -- cross-origin (google.com), so allow-same-origin can't reach this page; Maps needs scripts + its own storage */}
      <iframe
        src={src}
        title={title}
        loading='lazy'
        className='absolute inset-0 size-full'
        referrerPolicy='no-referrer-when-downgrade'
        sandbox='allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox'
        allowFullScreen
      />
    </div>
  )
}
