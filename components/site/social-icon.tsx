import {
  SiFacebook,
  SiInstagram,
  SiPinterest,
  SiThreads,
  SiTiktok,
  SiX,
  SiYoutube,
  type IconType,
} from '@icons-pack/react-simple-icons'
import type { Content } from '@/content/schema'

type SocialIconName = Content['socials'][number]['icon']

const ICONS: Record<SocialIconName, IconType> = {
  instagram: SiInstagram,
  tiktok: SiTiktok,
  pinterest: SiPinterest,
  facebook: SiFacebook,
  x: SiX,
  youtube: SiYoutube,
  threads: SiThreads,
}

/** A platform logo in the current text colour. Decorative: label the link around it. */
export function SocialIcon({
  name,
  className,
}: {
  name: SocialIconName
  className?: string
}) {
  const Icon = ICONS[name]
  return <Icon aria-hidden color='currentColor' className={className} />
}
