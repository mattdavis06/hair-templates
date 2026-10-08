import { firstName, type EmailBrand } from "@/lib/email/brand"
import type { EnquiryRow } from "@/lib/forms/enquiries"
import { EnquiryDetails } from "./enquiry-details"
import { BrandLayout, EmailButton, EmailHeading, Eyebrow } from "./layout"

export type EnquiryNotificationProps = {
  brand: EmailBrand
  /** The form's title, e.g. "Book a free colour consultation". */
  form: string
  name: string
  email: string
  rows: EnquiryRow[]
}

/** Sent to the salon's inbox: every answer, laid out to scan, with a reply button. */
export function EnquiryNotification({
  brand,
  form,
  name,
  email,
  rows,
}: EnquiryNotificationProps) {
  const { theme } = brand
  const first = firstName(name)
  const replyHref = `mailto:${email}?subject=${encodeURIComponent(`Re: ${form}`)}`

  return (
    <BrandLayout
      brand={brand}
      preview={`${name} · ${rows
        .filter((row) => !row.long && row.name !== "name")
        .map((row) => row.value)
        .slice(0, 4)
        .join(" · ")}`}
      footer="minimal"
      footnote={`Sent from "${form}" on the ${brand.name} website. Replying to this email goes straight to ${first}.`}
    >
      <Eyebrow theme={theme}>{form}</Eyebrow>
      <EmailHeading theme={theme}>New request from {first}</EmailHeading>
      <EnquiryDetails theme={theme} rows={rows} />
      <EmailButton theme={theme} href={replyHref}>
        Reply to {first}
      </EmailButton>
    </BrandLayout>
  )
}
