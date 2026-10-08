import { EnquiryNotification } from "@/lib/email/templates/enquiry-notification"
import { sampleEnquiry } from "../_preview/samples"

const { brand, form, name, email, rows } = sampleEnquiry(
  "colour-room",
  "consultation"
)

export default function ColourRoomConsultationNotification() {
  return (
    <EnquiryNotification
      brand={brand}
      form={form}
      name={name}
      email={email}
      rows={rows}
    />
  )
}
