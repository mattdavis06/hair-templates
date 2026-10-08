import { Column, Link, Row, Section } from "react-email"
import { firstName, type EmailBrand } from "@/lib/email/brand"
import {
  BrandLayout,
  EmailButton,
  EmailHeading,
  Eyebrow,
  MessageQuote,
} from "./layout"

export type ContactNotificationProps = {
  brand: EmailBrand
  name: string
  email: string
  message: string
}

/** Sent to the shop's own inbox, so it favours scannable details over brand voice. */
export function ContactNotification({
  brand,
  name,
  email,
  message,
}: ContactNotificationProps) {
  const { theme } = brand
  const first = firstName(name)
  const replyHref = `mailto:${email}?subject=${encodeURIComponent(`Re: your message to ${brand.name}`)}`
  const label = {
    width: 72,
    padding: "6px 0",
    fontSize: 13,
    lineHeight: "20px",
    color: theme.muted,
    verticalAlign: "top",
  } as const
  const value = {
    padding: "6px 0",
    fontSize: 15,
    lineHeight: "20px",
    color: theme.text,
  } as const

  return (
    <BrandLayout
      brand={brand}
      preview={`${name}: ${message.slice(0, 90)}`}
      footer="minimal"
      footnote={`Sent from the contact form on the ${brand.name} website. Replying to this email goes straight to ${first}.`}
    >
      <Eyebrow theme={theme}>Website enquiry</Eyebrow>
      <EmailHeading theme={theme}>New message from {first}</EmailHeading>

      <Section style={{ margin: "0 0 16px" }}>
        <Row>
          <Column style={label}>Name</Column>
          <Column style={value}>{name}</Column>
        </Row>
        <Row>
          <Column style={label}>Email</Column>
          <Column style={value}>
            <Link href={`mailto:${email}`} style={{ color: theme.highlight }}>
              {email}
            </Link>
          </Column>
        </Row>
      </Section>

      <MessageQuote theme={theme} label="Message">
        {message}
      </MessageQuote>
      <EmailButton theme={theme} href={replyHref}>
        Reply to {first}
      </EmailButton>
    </BrandLayout>
  )
}
