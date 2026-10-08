import type { EnquiryKind } from "@/content/schema"
import { getBrand } from "@/lib/brands"
import type { BrandId } from "@/lib/brands/ids"
import { getEmailBrand } from "@/lib/email/brand"
import {
  enquiryFields,
  enquiryRows,
  type EnquiryValues,
} from "@/lib/forms/enquiries"

const sampleEnquiryValues: Record<EnquiryKind, EnquiryValues> = {
  consultation: {
    name: "Amara Clarke",
    email: "amara@example.com",
    phone: "07700 900123",
    stylist: "Isla Moreno",
    hairNow: "Coloured at home (box dye)",
    lastColoured: "In the last 3 months",
    goal: "I'd love to go from box-dyed dark brown to a soft copper. I don't mind two visits if it keeps my hair healthy.",
    days: "Thursday evenings",
    patchTest: "on",
  },
  events: {
    name: "Rachel Dunn",
    email: "rachel@example.com",
    phone: "07700 900456",
    date: "2027-06-12",
    occasion: "Wedding",
    people: "5",
    location: "On location (within 15 miles)",
    message:
      "Bride plus four bridesmaids, ready by 1pm at Goldney Hall. We'd love a trial in April.",
  },
}

/** Props for an enquiry email preview, built the same way the server builds them. */
export function sampleEnquiry(brandId: BrandId, kind: EnquiryKind) {
  const brand = getBrand(brandId)
  const copy = brand.content.enquiries?.[kind]
  if (!copy) throw new Error(`${brandId} has no "${kind}" enquiry`)
  const values = sampleEnquiryValues[kind]
  const rows = enquiryRows(enquiryFields(kind, brand.content), values)
  return {
    brand: getEmailBrand(brandId),
    form: copy.title,
    copy: copy.email,
    name: values.name ?? "",
    email: values.email ?? "",
    rows,
  }
}

/** Example form submissions for the email preview (`pnpm email`). */
export const sampleContact: Record<
  BrandId,
  { name: string; email: string; message: string }
> = {
  northside: {
    name: "Callum Reid",
    email: "callum@example.com",
    message:
      "Alright! Can you fit three of us in on Saturday morning before a wedding? Two skin fades and a beard tidy.\n\nHappy to come in early if that helps.",
  },
  "colour-room": {
    name: "Amara Clarke",
    email: "amara@example.com",
    message:
      "Hi, I'd love to go from box-dyed dark brown to a soft copper. Is that possible in one visit, and do I need a patch test first?",
  },
}
