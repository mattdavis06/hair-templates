import { EnquiryConfirmation } from "@/lib/email/templates/enquiry-confirmation"
import { sampleEnquiry } from "../_preview/samples"

const { brand, form, copy, name, rows } = sampleEnquiry(
  "colour-room",
  "consultation"
)

export default function ColourRoomConsultationConfirmation() {
  return (
    <EnquiryConfirmation
      brand={brand}
      form={form}
      copy={copy}
      name={name}
      rows={rows}
    />
  )
}
