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

export type SocialIconName = Content['socials'][number]['icon']

/**
 * Platform logos for `socials` in content.json. The site draws them as SVG;
 * emails get PNGs from `app/icons/[theme]/socials/[icon]`, as mail apps can't show SVG.
 */
export const SOCIAL_ICONS: Record<SocialIconName, IconType> = {
  instagram: SiInstagram,
  tiktok: SiTiktok,
  pinterest: SiPinterest,
  facebook: SiFacebook,
  x: SiX,
  youtube: SiYoutube,
  threads: SiThreads,
}
