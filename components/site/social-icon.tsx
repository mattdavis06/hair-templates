import { SOCIAL_ICONS, type SocialIconName } from '@/lib/social-icons'

/** A platform logo in the current text colour. Decorative: label the link around it. */
export function SocialIcon({
  name,
  className,
}: {
  name: SocialIconName
  className?: string
}) {
  const Icon = SOCIAL_ICONS[name]
  return <Icon aria-hidden color='currentColor' className={className} />
}
