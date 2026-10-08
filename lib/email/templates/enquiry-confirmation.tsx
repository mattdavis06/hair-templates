import type { EnquiryCopy } from "@/content/schema"
import { firstName, type EmailBrand } from "@/lib/email/brand"
import type { EnquiryRow } from "@/lib/forms/enquiries"
import { EnquiryDetails } from "./enquiry-details"
import {
  BrandLayout,
  EmailButton,
  EmailHeading,
  EmailText,
  Eyebrow,
  Signoff,
} from "./layout"

export type EnquiryConfirmationProps = {
  brand: EmailBrand
  /** The form's title, e.g. "Book a free colour consultation". */
  form: string
  copy: EnquiryCopy["email"]
  name: string
  rows: EnquiryRow[]
}

export function EnquiryConfirmation({
  brand,
  form,
  copy,
  name,
  rows,
}: EnquiryConfirmationProps) {
  const { theme } = brand

  return (
    <BrandLayout
      brand={brand}
      preview={copy.preview}
      footnote={`You're getting this because you filled in "${form}" on the ${brand.name} website. ${brand.name} is a demo brand, so this is an automated reply.`}
    >
      <Eyebrow theme={theme}>Your request</Eyebrow>
      <EmailHeading theme={theme}>{copy.heading}</EmailHeading>
      <EmailText theme={theme}>Hi {firstName(name)},</EmailText>
      <EmailText theme={theme}>{copy.body}</EmailText>
      <EnquiryDetails
        theme={theme}
        rows={rows.filter((row) => row.name !== "name" && row.name !== "email")}
      />
      <EmailButton theme={theme} href={brand.siteUrl}>
        Visit {brand.name}
      </EmailButton>
      <Signoff brand={brand} />
    </BrandLayout>
  )
}
