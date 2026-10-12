import { BrandImage } from '@/components/site/brand-image'
import type { TeamMember } from '@/content/schema'
import { cn } from '@/lib/utils'

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

/** Their photo, or their initials on a brand-coloured card until a photo is added. */
export function MemberPortrait({
  member,
  sizes,
  className,
}: {
  member: TeamMember
  sizes: string
  className?: string
}) {
  return (
    <div
      className={cn(
        'relative aspect-4/5 overflow-hidden rounded-lg bg-muted shadow-xl',
        className
      )}
    >
      {member.image ? (
        <BrandImage image={member.image} sizes={sizes} />
      ) : (
        <div
          aria-hidden
          className='absolute inset-0 grid place-items-center bg-background/75'
        >
          <span className='font-heading text-8xl text-highlight/80'>
            {initials(member.name)}
          </span>
        </div>
      )}
    </div>
  )
}
