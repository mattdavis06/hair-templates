import { firstName, type EmailBrand } from "@/lib/email/brand"
import {
  BrandLayout,
  EmailButton,
  EmailHeading,
  EmailText,
  Eyebrow,
  MessageQuote,
  Signoff,
} from "./layout"

export type ContactConfirmationProps = {
  brand: EmailBrand
  name: string
  message: string
}

export function ContactConfirmation({
  brand,
  name,
  message,
}: ContactConfirmationProps) {
  const { theme } = brand
  const copy = brand.copy.contact

  return (
    <BrandLayout
      brand={brand}
      preview={copy.preview}
      footnote={`You're getting this because you used the contact form on the ${brand.name} website. ${brand.name} is a demo brand, so this is an automated reply.`}
    >
      <Eyebrow theme={theme}>Your message</Eyebrow>
      <EmailHeading theme={theme}>{copy.heading}</EmailHeading>
      <EmailText theme={theme}>Hi {firstName(name)},</EmailText>
      <EmailText theme={theme}>{copy.body}</EmailText>
      <MessageQuote theme={theme} label="What you sent">
        {message}
      </MessageQuote>
      <EmailButton theme={theme} href={brand.booking.url}>
        {brand.booking.label}
      </EmailButton>
      <Signoff brand={brand} />
    </BrandLayout>
  )
}
