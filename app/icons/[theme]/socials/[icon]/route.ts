import { BRAND_IDS, getBrand } from '@/lib/brands'
import { toEmailBrand } from '@/lib/email/brand'
import { renderSocialIcon } from '@/lib/seo/brand-images'
import { SOCIAL_ICONS, type SocialIconName } from '@/lib/social-icons'

export const dynamicParams = false

/** One PNG per social the brand lists, in its email footer colour. */
export function generateStaticParams() {
  return BRAND_IDS.flatMap((theme) =>
    getBrand(theme).content.socials.map((social) => ({
      theme,
      icon: social.icon,
    }))
  )
}

export async function GET(
  _request: Request,
  ctx: RouteContext<'/icons/[theme]/socials/[icon]'>
) {
  const { theme, icon } = await ctx.params
  const { theme: colours } = toEmailBrand(getBrand(theme))
  return renderSocialIcon(SOCIAL_ICONS[icon as SocialIconName], {
    color: colours.onFooter,
    size: 48,
  })
}
