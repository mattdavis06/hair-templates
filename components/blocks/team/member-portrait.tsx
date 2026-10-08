import { BrandImage } from "@/components/site/brand-image"
import type { TeamMember } from "@/content/schema"
import { cn } from "@/lib/utils"

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
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
        "relative aspect-4/5 overflow-hidden rounded-lg bg-muted",
        className
      )}
    >
      {member.image ? (
        <BrandImage image={member.image} sizes={sizes} />
      ) : (
        <div
          aria-hidden
          className="absolute inset-0 grid place-items-center bg-[radial-gradient(circle_at_30%_20%,var(--color-secondary),transparent_55%),radial-gradient(circle_at_80%_90%,var(--color-accent),transparent_50%)]"
        >
          <span className="font-heading text-8xl text-highlight/80">
            {initials(member.name)}
          </span>
        </div>
      )}
    </div>
  )
}
