import type { EmailBrand } from "@/lib/email/brand"
import {
  BrandLayout,
  EmailButton,
  EmailHeading,
  EmailText,
  Eyebrow,
  Signoff,
} from "./layout"

export type NewsletterWelcomeProps = { brand: EmailBrand }

export function NewsletterWelcome({ brand }: NewsletterWelcomeProps) {
  const { theme } = brand
  const copy = brand.copy.newsletter

  return (
    <BrandLayout
      brand={brand}
      preview={copy.preview}
      footnote={`You're getting this because you signed up on the ${brand.name} website. ${brand.name} is a demo brand, so this is the only email you'll receive.`}
    >
      <Eyebrow theme={theme}>Newsletter</Eyebrow>
      <EmailHeading theme={theme}>{copy.heading}</EmailHeading>
      <EmailText theme={theme}>{copy.body}</EmailText>
      <EmailButton theme={theme} href={brand.booking.url}>
        {brand.booking.label}
      </EmailButton>
      <Signoff brand={brand} />
    </BrandLayout>
  )
}
